// The "five views" section: a mock Better Finder window drawn in HTML. The same file tiles fly between
// List, Grid, Columns, Gallery and Globe. Buttons with data-view (anywhere on the page) switch it.
// It cycles by itself until the visitor clicks a view; on Globe, drag to spin.
// Several windows can exist: data-views-still="grid" makes a quiet one (the MacBook in the hero) that starts in
// that view, never cycles and only answers its own buttons. Buttons outside any window drive the main one.
(() => {
  const instances = new Map();
  let main = null;
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-view]");
    if (!b) return;
    const inst = instances.get(b.closest("[data-views-demo]")) || main;
    inst?.pick(b.dataset.view, e.isTrusted);
  });
  // A MacBook drawn in HTML: the screen is laid out at 1440×900 and scaled to fit, like a real screenshot.
  document.querySelectorAll("[data-macbook]").forEach((mb) => {
    mb.innerHTML = `
      <div class="mbp-lid"><div class="mbp-display"><div class="mbp-canvas">
        <div class="mbp-menubar"><span class="mbp-apple"></span><b class="mbp-app"><span class="was">Finder</span><span class="now">Better Finder</span></b><span>File</span><span>Edit</span><span>View</span><span>Go</span><span>Window</span><span>Help</span>
          <span class="mbp-right"><span>⌕</span><span>◉</span><span>Tue 21 Oct&nbsp; 9:41</span></span></div>
        <div class="mbp-icons"><span class="hd"><i></i>Macintosh HD</span><span><i></i>Projects</span><span><i></i>Footage</span></div>
        <div class="mbp-win vd" data-views-demo data-views-still="grid" data-views-filters></div>
        <div class="mbp-dock"><i style="--c:#3b82f6"></i><i style="--c:#22c55e"></i><span class="mbp-slot"><span class="mbp-old" aria-hidden="true"><b></b></span><img class="mbp-bf" src="assets/icon.png" alt=""></span><i style="--c:#f97316"></i><i style="--c:#a855f7"></i><i style="--c:#ef4444"></i></div>
      </div></div><span class="mbp-notch"></span></div>
      <div class="mbp-base"></div>`;
    const display = mb.querySelector(".mbp-display"), canvas = mb.querySelector(".mbp-canvas");
    new ResizeObserver(() => canvas.style.setProperty("--k", display.clientWidth / 1440)).observe(display);
    macIntro(mb);
  });

  // The opening scene: an old, plain Finder; Better Finder drops into the Dock, kicks the old icon away,
  // and the window upgrades (thumbnails, tags, filter chips, mini player). Click the MacBook to replay.
  function macIntro(mb) {
    const bf = mb.querySelector(".mbp-bf"), old = mb.querySelector(".mbp-old");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let timers = [], played = false, visible = false, pending = false;
    const later = (ms, fn) => timers.push(setTimeout(fn, ms));
    const items = () => [...mb.querySelectorAll(".vd-item")];
    function finish() { mb.classList.remove("intro", "old"); items().forEach((el) => el.classList.remove("old")); }
    // The Better Finder icon hides behind the plain grey tiles of the old window and peeks out (3 times),
    // then leaps out, flips twice on the way down to the Dock and kicks the old icon away.
    let peekEl = null;
    const stage = () => mb.querySelector(".mbp-win .vd-stage");
    function peekIcon() {
      if (!peekEl) { peekEl = Object.assign(document.createElement("img"), { src: "assets/icon.png", alt: "", className: "mbp-peek" }); stage().appendChild(peekEl); }
      return peekEl;
    }
    // a tile's thumbnail box in stage pixels
    function tile(i) {
      const st = stage(), s = st.getBoundingClientRect().width / st.clientWidth;
      const r = items()[i].querySelector(".vd-th").getBoundingClientRect(), o = st.getBoundingClientRect();
      return { x: (r.left - o.left) / s, y: (r.top - o.top) / s, w: r.width / s, h: r.height / s };
    }
    const P = 64; // icon size inside the window
    // full = true: the icon comes all the way out (in front of the tiles), looks around, then slips back behind
    function peek(i, side, hold, tilt, full) {
      const t = tile(i), el = peekIcon();
      const cx = t.x + t.w / 2 - P / 2, cy = t.y + t.h / 2 - P / 2;
      const half = side === "top" ? [cx, t.y - P * 0.72] : side === "corner" ? [t.x - P * 0.45, t.y - P * 0.4] : [cx, t.y + t.h - P * 0.15];
      const out = side === "top" ? [cx, t.y - P - 10] : side === "corner" ? [t.x - P * 0.75, t.y - P * 0.72] : [cx, t.y + t.h + 8];
      const at = ([x, y], r = 0, sx = 1, sy = 1) => `translate(${x}px, ${y}px) rotate(${r}deg) scale(${sx}, ${sy})`;
      const frames = full ? [
        { transform: at([cx, cy]), zIndex: 0 },
        { transform: at(half, 0, .92, 1.1), zIndex: 0, offset: .14 },
        { transform: at(out, 0, 1.12, .9), zIndex: 3, offset: .24 },
        { transform: at(out, tilt), zIndex: 3, offset: .42 },
        { transform: at(out, -tilt), zIndex: 3, offset: .58 },
        { transform: at(out, 0, .95, 1.06), zIndex: 3, offset: .7 },
        { transform: at(half), zIndex: 3, offset: .8 },
        { transform: at(half), zIndex: 0, offset: .81 },
        { transform: at([cx, cy]), zIndex: 0 },
      ] : [
        { transform: at([cx, cy]), zIndex: 0 },
        { transform: at(half), zIndex: 0, offset: .22 },
        { transform: at(half, tilt), zIndex: 0, offset: .45 },
        { transform: at(half, -tilt / 2), zIndex: 0, offset: .65 },
        { transform: at(half), zIndex: 0, offset: .8 },
        { transform: at([cx, cy]), zIndex: 0 },
      ];
      el.style.opacity = 1;
      el.animate(frames, { duration: hold, easing: "cubic-bezier(.45,0,.3,1)", fill: "forwards" });
    }
    // where a point of the window is, measured from the Dock slot, in canvas pixels
    const canvasK = () => mb.querySelector(".mbp-canvas").getBoundingClientRect().width / 1440;
    function fromSlot(r) {
      const s = bf.parentElement.getBoundingClientRect(), k = canvasK();
      return [(r.left + r.width / 2 - (s.left + s.width / 2)) / k, (r.top + r.height / 2 - (s.top + s.height / 2)) / k];
    }
    function leap() {
      // crouch below the last row, then the Dock icon takes over: flips up above the top row and drops into the Dock
      const t = tile(15), el = peekIcon();
      const x = t.x + t.w / 2 - P / 2, y0 = t.y + t.h / 2 - P / 2, y1 = t.y + t.h + 10;
      el.style.zIndex = 3;
      el.animate([
        { transform: `translate(${x}px, ${y0}px)` },
        { transform: `translate(${x}px, ${y1}px) scale(1, 1)`, offset: .4 },
        { transform: `translate(${x}px, ${y1 + 6}px) scale(1.3, .7)`, offset: .85 },
        { transform: `translate(${x}px, ${y1 - 10}px) scale(.85, 1.2)` },
      ], { duration: 650, easing: "ease-in-out", fill: "forwards" });
      later(650, () => {
        const [dx, dy] = fromSlot(el.getBoundingClientRect());
        const top = fromSlot(stage().getBoundingClientRect())[1] - stage().getBoundingClientRect().height / 2 / canvasK() - 70;
        el.getAnimations().forEach((a) => a.cancel()); el.style.opacity = 0; el.style.zIndex = "";
        bf.style.opacity = 1;
        bf.animate([
          { transform: `translate(${dx}px, ${dy}px) rotate(0deg) scale(.85, 1.2)`, easing: "cubic-bezier(.2,.7,.4,1)" },
          { transform: `translate(${dx * 0.55 - 30}px, ${top}px) rotate(-380deg) scale(1.15)`, offset: .45, easing: "cubic-bezier(.6,0,.9,.6)" },
          { transform: `translate(-78px, -10px) rotate(-715deg) scale(.95, 1.1)`, offset: .86 },
          { transform: "translate(-78px, 0) rotate(-720deg) scale(1.4, .6)", offset: .9 },
          { transform: "translate(-78px, -34px) rotate(-720deg) scale(.92, 1.1)", offset: .95 },
          { transform: "translate(-78px, 0) rotate(-720deg) scale(1, 1)" },
        ], { duration: 1700, fill: "forwards" });
        later(1530, impact);
      });
    }
    // the landing hits hard: the other Dock icons get knocked aside, the Dock and the screen shake
    function impact() {
      const slot = bf.parentElement, dock = slot.parentElement;
      const kids = [...dock.children], at = kids.indexOf(slot);
      kids.forEach((el, i) => {
        if (el === slot) return;
        const d = i - at, side = Math.sign(d), f = 1 / Math.abs(d);
        el.animate([
          { transform: "none" },
          { transform: `translate(${side * 26 * f}px, ${-38 * f}px) rotate(${side * 22 * f}deg)`, offset: .25 },
          { transform: `translate(${-side * 8 * f}px, 0) rotate(${-side * 8 * f}deg)`, offset: .55 },
          { transform: `translate(${side * 3 * f}px, ${-6 * f}px) rotate(${side * 3 * f}deg)`, offset: .78 },
          { transform: "none" },
        ], { duration: 700, easing: "ease-out" });
      });
      dock.animate([{ transform: "translateX(-50%)" }, { transform: "translateX(-50%) translateY(7px)", offset: .2 }, { transform: "translateX(-50%) translateY(-3px)", offset: .5 }, { transform: "translateX(-50%)" }], { duration: 450 });
      mb.querySelector(".mbp-display").animate([{ transform: "none" }, { transform: "translate(-3px, 3px)", offset: .2 }, { transform: "translate(3px, -2px)", offset: .45 }, { transform: "translate(-2px, 1px)", offset: .7 }, { transform: "none" }], { duration: 380 });
    }
    function play() {
      timers.forEach(clearTimeout); timers = [];
      bf.getAnimations().forEach((a) => a.cancel()); old.getAnimations().forEach((a) => a.cancel());
      if (peekEl) { peekEl.getAnimations().forEach((a) => a.cancel()); peekEl.style.opacity = 0; }
      if (reduce) return finish();
      pending = false;
      mb.querySelector(".mbp-win").__vd?.reset();
      mb.classList.add("intro", "old");
      items().forEach((el) => el.classList.add("old"));
      bf.style.opacity = 0;
      // hide and seek behind the grey tiles
      later(900, () => peek(8, "top", 1500, -14, true));
      later(2550, () => peek(0, "corner", 1500, -20, true));
      later(4200, leap);
      // after the landing: wind up, dash into the slot and kick the old icon right off the screen
      later(6750, () => {
        bf.animate([
          { transform: "translate(-78px, 0) rotate(-720deg) scale(1, 1)" },
          { transform: "translate(-112px, 0) rotate(-735deg) scale(.82, 1.15)", offset: .45 },
          { transform: "translate(12px, 0) rotate(-712deg) scale(1.22, .85)", offset: .82 },
          { transform: "translate(0, 0) rotate(-720deg) scale(1, 1)" },
        ], { duration: 480, easing: "ease-in-out", fill: "forwards" });
      });
      later(7140, () => {
        old.animate([
          { transform: "translate(0, 0) rotate(0) scale(1)" },
          { transform: "translate(70px, -60px) rotate(120deg) scale(1.1)", offset: .12 },
          { transform: "translate(1400px, -1100px) rotate(1080deg) scale(.6)" },
        ], { duration: 900, easing: "cubic-bezier(.15,.7,.3,1)", fill: "forwards" });
      });
      later(7350, () => {
        mb.classList.remove("old");
        items().forEach((el, i) => later(i * 45, () => el.classList.remove("old")));
      });
      later(8750, () => mb.classList.remove("intro"));
      // quick pass through the filter chips, then Tidy Up, then start over
      const vd = mb.querySelector(".mbp-win").__vd;
      ["video", "motion", "3d", "gif", "all"].forEach((t, i) => later(8850 + i * 700, () => vd.filter(t)));
      later(12750, () => vd.tidy());
      later(17100, () => (visible ? play() : (pending = true)));
    }
    mb.addEventListener("click", () => { played = true; play(); });
    if ("IntersectionObserver" in window) {
      // plays when the MacBook comes into view, and loops while it stays there
      new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        if (visible && (!played || pending)) { played = true; play(); }
      }, { threshold: 0.35 }).observe(mb);
    } else finish();
    // stay in the old state until the scene plays
    if (!reduce) { mb.classList.add("intro", "old"); queueMicrotask(() => items().forEach((el) => el.classList.add("old"))); }
  }
  document.querySelectorAll("[data-views-demo]").forEach(setup);

function setup(box) {
  const still = box.dataset.viewsStill;
  const withFilters = box.hasAttribute("data-views-filters");
  const files = window.SITE.viewsDemo;
  const F = window.SITE.filters;
  // type of each file for the filter chips, and its colour tags (from content.js filters.files)
  const typeOf = (f) => (/lottie|rive/i.test(f.kind) ? "motion" : /3d|blender/i.test(f.kind) ? "3d" : /gif/i.test(f.kind) ? "gif" : "video");
  const tagsOf = (i) => (F.files.find((x) => x.i === i) || { tags: [] }).tags;
  const tagColor = (id) => F.tags.find((t) => t.id === id).color;
  let filterType = "all";
  const VIEWS = ["list", "grid", "columns", "gallery", "globe"];
  const ICONS = {
    list: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    grid: '<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/>',
    columns: '<rect x="3.5" y="5" width="17" height="14" rx="1.5"/><path d="M9.5 5v14M15 5v14"/>',
    gallery: '<rect x="3.5" y="4" width="17" height="11" rx="1.5"/><path d="M4 19h3M9 19h3M14 19h3"/>',
    globe: '<circle cx="12" cy="12" r="8"/><path d="M4 12h16M12 4c2.5 2.5 2.5 13.5 0 16M12 4c-2.5 2.5-2.5 13.5 0 16"/>',
  };
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  box.innerHTML = `
    <div class="vd-chrome"><i></i><i></i><i></i>
      <span class="vd-title">Motion Library</span>
      <div class="vd-seg">${VIEWS.map((v) => `<button data-view="${v}" title="${v}"><svg viewBox="0 0 24 24">${ICONS[v]}</svg></button>`).join("")}</div>
    </div>
    ${withFilters ? `<div class="vd-filter"><button data-f="all">All<em>${files.length}</em></button>${F.chips.map((ch) => `<button data-f="${ch.id}" style="--c:${ch.color}">${ch.en}<em>${files.filter((f) => typeOf(f) === ch.id).length}</em></button>`).join("")}<span class="vd-fnote">⌘-click to pick several</span></div>` : ""}
    <div class="vd-body">
      <aside class="vd-side">
        <p>Favorites</p><span>🖥 Desktop</span><span class="on">🎬 Motion Library</span><span>📁 Projects</span><span>⬇️ Downloads</span>
        <p class="tag">Tags</p>${F.tags.map((t) => `<span class="tag"><b style="background:${t.color}"></b>${t.en}</span>`).join("")}
      </aside>
      <div class="vd-stage">
        <div class="vd-head"><span>Name</span><span class="vd-meta"><span>Kind</span><span>Duration</span><span>Size</span></span></div>
        <div class="vd-col1"><span>📁 2026 Brand</span><span class="on">📁 Motion Library</span><span>📁 Footage</span><span>📁 Renders</span><span>📁 Sound</span></div>
        <div class="vd-preview"><div class="vd-pth"></div><b></b><small></small></div>
        ${files.map((f, i) => `
          <div class="vd-item" data-i="${i}">
            <div class="vd-th" style="${f.thumb ? `background-image:url('${f.thumb}')` : `--h:${f.hue}`}">${f.badge ? `<em>${f.badge}</em>` : ""}${f.dur ? `<u>${f.dur}</u>` : ""}</div>
            <span class="vd-name">${withFilters && tagsOf(i).length ? `<span class="vd-dots">${tagsOf(i).map((t) => `<i style="background:${tagColor(t)}"></i>`).join("")}</span>` : ""}${f.name}</span>
            <span class="vd-meta"><span>${f.kind}</span><span>${f.dur || "--"}</span><span>${f.size}</span></span>
          </div>`).join("")}
      </div>
    </div>
    ${withFilters ? `<div class="vd-status"><span class="vd-count"></span><span>Tags: ${F.tags.map((t) => t.en).join(" · ")}</span></div>` : ""}`;

  if (window.SITE.viewsEase === "elastic") box.classList.add("vd-elastic");
  const stage = box.querySelector(".vd-stage");
  const items = [...box.querySelectorAll(".vd-item")];
  const preview = box.querySelector(".vd-preview");
  const last = [];
  let view = "list", selected = 0, raf = 0, angle = 0, tilt = -0.28, drag = null, spinV = 0.004;

  // ---------- Layouts: each returns {x, y, w, h, s, o, z} per item ----------
  function layout() {
    const W = stage.clientWidth, H = stage.clientHeight;
    const small = W < 520;
    const out = [];
    if (view === "list") {
      const top = 30, rh = small ? 34 : 32;
      items.forEach((_, i) => out.push({ x: 0, y: top + i * rh, w: W, h: rh }));
    } else if (view === "grid") {
      const cols = W > 760 ? 6 : W > 520 ? 4 : 3, pad = 16, gap = 14;
      const w = (W - pad * 2 - gap * (cols - 1)) / cols, h = w * 9 / 16 + 24;
      let k = 0;
      items.forEach((_, i) => {
        if (filterType !== "all" && typeOf(files[i]) !== filterType) {
          const p = last[i] || { x: pad + (i % cols) * (w + gap), y: pad + Math.floor(i / cols) * (h + gap) };
          return out.push({ x: p.x, y: p.y, w, h, o: 0, s: 0.85, hide: true });
        }
        out.push({ x: pad + (k % cols) * (w + gap), y: pad + Math.floor(k / cols) * (h + gap), w, h });
        k++;
      });
    } else if (view === "columns") {
      const c1 = small ? 0 : W * 0.22, c2 = small ? W * 0.5 : W * 0.36, rh = 30;
      items.forEach((_, i) => out.push({ x: c1, y: 6 + i * rh, w: c2, h: rh }));
    } else if (view === "gallery") {
      // Filmstrip fills the whole width (no empty space) and scrolls so the selected file stays in view.
      const pad = 16, gap = 8, n = items.length;
      const k = Math.max(3, Math.round((W - pad * 2) / (Math.max(48, H * 0.16) * 16 / 9 + gap)));
      const fw = (W - pad * 2 - gap * (k - 1)) / k, film = fw * 9 / 16;
      const bigH = H - pad * 2 - film - 30, bigW = Math.min(W - pad * 2, bigH * 16 / 9);
      const first = Math.max(0, Math.min(selected - Math.floor(k / 2), n - k));
      const start = pad - first * (fw + gap);
      items.forEach((_, i) => out.push(i === selected
        ? { x: (W - bigW) / 2, y: pad, w: bigW, h: bigH + 24, big: true }
        : { x: start + i * (fw + gap), y: H - pad - film, w: fw, h: film }));
    } else {
      out.push(...globe(W, H));
    }
    return out;
  }

  function globe(W, H) {
    const n = items.length, R = Math.min(W, H) * 0.36, P = R * 3.2;
    const w = Math.max(70, Math.min(W, H) * 0.2), h = w * 9 / 16;
    const ca = Math.cos(angle), sa = Math.sin(angle), ct = Math.cos(tilt), st = Math.sin(tilt);
    return items.map((_, i) => {
      const y0 = 1 - (2 * (i + 0.5)) / n, r = Math.sqrt(1 - y0 * y0), th = i * Math.PI * (3 - Math.sqrt(5));
      let x = Math.cos(th) * r, y = y0, z = Math.sin(th) * r;
      [x, z] = [x * ca + z * sa, -x * sa + z * ca];
      [y, z] = [y * ct - z * st, y * st + z * ct];
      const s = P / (P - z * R);
      return { x: W / 2 + x * R * s - w / 2, y: H / 2 + y * R * s - h / 2, w, h, s: s * (0.75 + 0.25 * z), o: 0.35 + 0.65 * (z + 1) / 2, z: Math.round((z + 1) * 100) };
    });
  }

  function apply(animate) {
    const L = layout();
    items.forEach((el, i) => {
      const p = L[i];
      el.style.transition = animate ? "" : "none";
      el.style.transitionDelay = animate && !reduce ? `${(i % 9) * 10}ms` : "0ms";
      el.style.width = p.w + "px";
      el.style.height = p.h + "px";
      el.style.transform = `translate(${p.x}px, ${p.y}px) scale(${p.s || 1})`;
      el.style.opacity = p.o ?? 1;
      el.style.zIndex = p.z ?? (p.big ? 5 : 1);
      el.classList.toggle("big", !!p.big);
      el.classList.toggle("vd-hide", !!p.hide);
      if (!p.hide) last[i] = { x: p.x, y: p.y };
      el.classList.toggle("sel", i === selected && (view === "columns" || view === "list"));
    });
    if (withFilters) {
      box.querySelectorAll("[data-f]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.f === filterType));
      const n = L.filter((p) => !p.hide).length;
      box.querySelector(".vd-count").textContent = `${n} of ${files.length} items`;
    }
    const f = files[selected];
    preview.querySelector(".vd-pth").style.cssText = f.thumb ? `background-image:url('${f.thumb}')` : `--h:${f.hue}`;
    preview.querySelector("b").textContent = f.name;
    preview.querySelector("small").textContent = [f.kind, f.dur, f.size].filter(Boolean).join(" · ");
  }

  function spin() {
    if (!drag) angle += spinV;
    apply(false);
    raf = requestAnimationFrame(spin);
  }

  function set(v) {
    if (!VIEWS.includes(v)) return;
    cancelAnimationFrame(raf);
    view = v;
    box.dataset.mode = v;
    stage.className = "vd-stage mode-" + v;
    box.querySelectorAll("[data-view]").forEach((b) => b.setAttribute("aria-selected", b.dataset.view === v));
    if (!still) {
      document.querySelectorAll("[data-view]").forEach((b) => { if (!b.closest("[data-views-demo]")) b.setAttribute("aria-selected", b.dataset.view === v); });
      document.dispatchEvent(new CustomEvent("viewchange", { detail: v }));
    }
    apply(true);
    if (v === "globe" && !reduce) setTimeout(() => { if (view === "globe") { items.forEach((el) => (el.style.transition = "none")); spin(); } }, 480);
  }

  // ---------- Interaction ----------
  let auto = null;
  const stopAuto = () => { clearInterval(auto); auto = null; };
  instances.set(box, { pick: (v, byUser) => { if (byUser) stopAuto(); set(v); } });
  if (!still && !main) main = instances.get(box);
  items.forEach((el, i) => el.addEventListener("click", () => {
    stopAuto();
    if (view === "globe") return;
    selected = i;
    apply(true);
  }));
  stage.addEventListener("pointerdown", (e) => {
    if (view !== "globe") return;
    stopAuto();
    drag = { x: e.clientX, y: e.clientY, a: angle, t: tilt };
    stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const nx = drag.a + (e.clientX - drag.x) * 0.01;
    spinV = (nx - angle) * 0.5 || spinV;
    angle = nx;
    tilt = Math.max(-1.2, Math.min(1.2, drag.t + (e.clientY - drag.y) * 0.008));
  });
  const endDrag = () => { if (drag) { drag = null; spinV = Math.max(-0.03, Math.min(0.03, spinV)); setTimeout(() => (spinV = Math.sign(spinV || 1) * 0.004), 1200); } };
  stage.addEventListener("pointerup", endDrag);
  stage.addEventListener("pointercancel", endDrag);
  new ResizeObserver(() => { if (view !== "globe" || !raf) apply(false); }).observe(stage);

  // Cycle through the views while the section is on screen, until the visitor takes over.
  const startAuto = () => {
    if (auto || reduce || still) return;
    auto = setInterval(() => set(VIEWS[(VIEWS.indexOf(view) + 1) % VIEWS.length]), 3200);
  };
  if ("IntersectionObserver" in window) {
    let started = false;
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) { started = true; startAuto(); }
      else if (!e.isIntersecting && auto) { stopAuto(); started = false; }
    }, { threshold: 0.4 }).observe(box);
  }

  set(still || "list");
  // The hero window is driven by the MacBook timeline: step through the chips, then Tidy Up by Type
  // (one folder per type; every file flies into its folder), then reset for the next loop.
  if (withFilters) {
    const folders = F.chips.map((ch) => {
      const el = document.createElement("div");
      el.className = "vd-folder";
      el.innerHTML = `<i style="--c:${ch.color}"></i><span>${ch.en}</span><em></em>`;
      stage.appendChild(el);
      return { el, id: ch.id, n: 0 };
    });
    const menu = document.createElement("div");
    menu.className = "vd-menu";
    menu.innerHTML = "<span>View ▸</span><b>✨ Tidy Up by Type</b><kbd>⌃⌘K</kbd>";
    stage.appendChild(menu);
    // a magic wand flies in and taps the menu item
    const wand = document.createElement("div");
    wand.className = "vd-wand";
    // one piece: dark shaft, white tip band, star centred on the very tip (49,15 of 64)
    wand.innerHTML = '<svg viewBox="0 0 64 64"><line x1="9" y1="55" x2="46" y2="18" stroke="#2b2b2e" stroke-width="7" stroke-linecap="round"/><line x1="39" y1="25" x2="47" y2="17" stroke="#f5f5f7" stroke-width="7" stroke-linecap="round"/><path d="M49 3l3.2 8 8 3.2-8 3.2-3.2 8-3.2-8-8-3.2 8-3.2z" fill="#ffcc00" stroke="#e0a800" stroke-width="1"/></svg>';
    stage.appendChild(wand);
    function sparkle(x, y) {
      for (let s = 0; s < 10; s++) {
        const p = document.createElement("i");
        p.className = "vd-spark";
        stage.appendChild(p);
        const a = (s / 10) * Math.PI * 2, d = 40 + Math.random() * 40;
        p.animate([{ transform: `translate(${x}px, ${y}px) scale(1)`, opacity: 1 }, { transform: `translate(${x + Math.cos(a) * d}px, ${y + Math.sin(a) * d}px) scale(.2)`, opacity: 0 }],
          { duration: 650, easing: "cubic-bezier(.2,.7,.3,1)" }).onfinish = () => p.remove();
      }
    }
    let tidyTimers = [];
    box.__vd = {
      filter(t) { filterType = t; apply(true); },
      tidy() {
        filterType = "all"; apply(true);
        menu.classList.add("on");
        // the wand swoops in from the right, taps the item (it flashes, sparks fly), and leaves
        tidyTimers.push(setTimeout(() => {
          const m = menu.querySelector("b"), sr = stage.getBoundingClientRect(), s = sr.width / stage.clientWidth, r = m.getBoundingClientRect();
          const tx = (r.left - sr.left) / s + r.width / s * 0.62, ty = (r.top - sr.top) / s + r.height / s * 0.55;
          // the wand pops up out of nowhere in the middle, flips once, winds up and strikes with its tip
          // (tip = the star, 78% / 19% of the wand box; rotations pivot on it so it lands exactly on the text)
          const TX = 84 * 49 / 64, TY = 84 * 15 / 64, at = (x, y, r, sc = 1) => `translate(${x - TX}px, ${y - TY}px) rotate(${r}deg) scale(${sc})`;
          const cx = stage.clientWidth / 2, cy = stage.clientHeight * 0.55;
          // pops up in the middle, flips once, swings round to the right, then whips in from the right and
          // hits the text with its tip, growing big on impact
          wand.animate([
            { transform: at(cx, cy, -120, 0), opacity: 0 },
            { transform: at(cx, cy, -20, 1.3), opacity: 1, offset: .12 },
            { transform: at(cx, cy - 10, 340, 1), opacity: 1, offset: .42, easing: "cubic-bezier(.5,0,.5,1)" },
            { transform: at(tx + 150, ty + 40, 330, 1.05), opacity: 1, offset: .6, easing: "cubic-bezier(.7,0,1,.5)" },
            { transform: at(tx, ty, 250, 1.55), opacity: 1, offset: .7 },
            { transform: at(tx + 14, ty + 6, 268, 1.25), opacity: 1, offset: .78 },
            { transform: at(tx + 8, ty + 3, 262, 1.2), opacity: 1, offset: .9 },
            { transform: at(tx + 40, ty + 30, 280, .7), opacity: 0 },
          ], { duration: 1500, easing: "ease-out" });
          sparkle(cx, cy);
          tidyTimers.push(setTimeout(() => { menu.classList.add("tap"); sparkle(tx, ty); }, 1050));
        }, 250));
        tidyTimers.push(setTimeout(() => {
          menu.classList.remove("on", "tap");
          const W = stage.clientWidth, cols = W > 760 ? 6 : W > 520 ? 4 : 3, pad = 16, gap = 14;
          const w = (W - pad * 2 - gap * (cols - 1)) / cols, h = w * 9 / 16 + 24;
          const mr = menu.getBoundingClientRect(), sr = stage.getBoundingClientRect(), s = sr.width / stage.clientWidth;
          const ox = (mr.left + mr.width / 2 - sr.left) / s - w / 2, oy = (mr.top + mr.height / 2 - sr.top) / s - h / 2;
          folders.forEach((f, k) => {
            f.x = pad + (k % cols) * (w + gap); f.y = pad + Math.floor(k / cols) * (h + gap); f.n = 0; f.landed = false;
            f.el.style.cssText = `width:${w}px;height:${h}px;transform:translate(${f.x}px,${f.y}px)`;
            f.el.querySelector("em").textContent = "";
            tidyTimers.push(setTimeout(() => {
              f.el.classList.add("on");
              f.el.animate([
                { transform: `translate(${ox}px, ${oy}px) scale(.15) rotate(-14deg)`, opacity: 0 },
                { transform: `translate(${(ox + f.x) / 2}px, ${Math.min(oy, f.y) - 30}px) scale(.8) rotate(6deg)`, opacity: 1, offset: .5 },
                { transform: `translate(${f.x}px, ${f.y}px) scale(1.18) rotate(-2deg)`, opacity: 1, offset: .78 },
                { transform: `translate(${f.x}px, ${f.y}px) scale(.96)`, opacity: 1, offset: .9 },
                { transform: `translate(${f.x}px, ${f.y}px) scale(1)`, opacity: 1 },
              ], { duration: 620, easing: "cubic-bezier(.3,.7,.4,1)" }).onfinish = () => (f.landed = true);
            }, k * 140));
          });
          items.forEach((el, i) => tidyTimers.push(setTimeout(() => {
            const f = folders.find((x) => x.id === typeOf(files[i]));
            el.style.transitionDelay = "0ms";
            el.style.transform = `translate(${f.x + w * 0.3}px, ${f.y + h * 0.1}px) scale(.3)`;
            el.style.opacity = 0;
            f.n++;
            f.el.querySelector("em").textContent = f.n;
            if (f.landed) f.el.animate([{ transform: `translate(${f.x}px,${f.y}px) scale(1)` }, { transform: `translate(${f.x}px,${f.y}px) scale(1.1)` }, { transform: `translate(${f.x}px,${f.y}px) scale(1)` }], { duration: 260 });
          }, 60 + i * 60)));
          tidyTimers.push(setTimeout(() => { box.querySelector(".vd-count").textContent = `${folders.length} folders · ${files.length} items tidied`; }, 120 + files.length * 60));
        }, 1700));
      },
      reset() {
        tidyTimers.forEach(clearTimeout); tidyTimers = [];
        menu.classList.remove("on", "tap");
        wand.getAnimations().forEach((a) => a.cancel());
        folders.forEach((f) => f.el.classList.remove("on"));
        filterType = "all";
        apply(false);
      },
    };
  }
}
})();
