// Coded demos for the feature spotlights (no screenshots): player + transcript with AI Review,
// folder backgrounds (⌘J), and spoken Advanced Search. Each looks for its data-* box and skips if absent.
// Texts come from content.js through window.BF (set by main.js); they re-render when the language changes.
(() => {
  const S = window.SITE;
  const BF = window.BF;
  const $ = (sel, root) => root.querySelector(sel);
  const $$ = (sel, root) => [...root.querySelectorAll(sel)];
  const thumbStyle = (f) => (f.thumb ? `background-image:url('${f.thumb}')` : `--h:${f.hue}`);
  const chrome = (title, extra = "") => `<div class="vd-chrome"><i></i><i></i><i></i><span class="vd-title">${title}</span>${extra}</div>`;
  const whenVisible = (el, on, off) => {
    if (!("IntersectionObserver" in window)) return on();
    new IntersectionObserver(([e]) => (e.isIntersecting ? on() : off && off()), { threshold: 0.25 }).observe(el);
  };
  const tc = (s) => {
    const f = Math.floor((s % 1) * 24);
    return `00:${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}:${String(f).padStart(2, "0")}`;
  };

  // ======================= Player + transcript + AI Review =======================
  function playerDemo(box) {
    let fixed = false;
    box.innerHTML = `${chrome("Sunset_Timelapse.mp4")}
      <div class="pd-body">
        <div class="pd-video">
          <video src="assets/demo/sunset.mp4" muted loop playsinline preload="auto"></video>
          <div class="pd-ctrl">
            <button class="pd-play" aria-label="Play / pause"><svg viewBox="0 0 24 24"><path class="i-pause" d="M7 5h3v14H7zM14 5h3v14h-3z"/><path class="i-play" d="M8 5l11 7-11 7z"/></svg></button>
            <button class="pd-step" data-step="-1" aria-label="Previous frame">‹</button>
            <span class="pd-tc">00:00:00:00</span>
            <button class="pd-step" data-step="1" aria-label="Next frame">›</button>
            <div class="pd-bar"><i></i></div>
            <span class="pd-speed">1×</span>
          </div>
        </div>
        <aside class="pd-tr">
          <header><b data-k="pl.transcript"></b><button class="pd-ai">✨ <span data-k="pl.ai"></span></button></header>
          <ol></ol>
        </aside>
      </div>`;
    const v = $("video", box), ol = $("ol", box), bar = $(".pd-bar", box);
    let active = -1;

    function render() {
      $$("[data-k]", box).forEach((el) => (el.textContent = BF.t(el.dataset.k)));
      const lines = S.transcript[BF.lang] || S.transcript.en;
      ol.innerHTML = lines.map((l, i) => {
        let text = l.text;
        if (l.fix) {
          const [bad, good] = l.fix;
          text = fixed ? text.replace(bad, `<mark class="ok">${good}</mark>`) : text.replace(bad, `<mark class="err">${bad}</mark>`);
        }
        const card = l.fix && !fixed ? `<div class="pd-sug"><span>✨ ${BF.t("pl.suggest")}: <s>${l.fix[0]}</s> → <b>${l.fix[1]}</b></span><button>${BF.t("pl.apply")}</button></div>` : "";
        return `<li data-i="${i}"><time>${tc(l.t).slice(3, 8)}</time><p>${text}</p>${card}</li>`;
      }).join("");
      $$("li", ol).forEach((li) => li.addEventListener("click", (e) => {
        if (e.target.closest(".pd-sug button")) { fixed = true; render(); return; }
        v.currentTime = lines[li.dataset.i].t + 0.05;
        v.play();
      }));
      active = -1;
    }

    function tick() {
      const lines = S.transcript[BF.lang] || S.transcript.en;
      const t = v.currentTime || 0;
      $(".pd-tc", box).textContent = tc(t);
      bar.style.setProperty("--p", v.duration ? t / v.duration : 0);
      let i = lines.length - 1;
      while (i > 0 && lines[i].t > t) i--;
      if (i !== active) {
        active = i;
        $$("li", ol).forEach((li) => li.classList.toggle("on", +li.dataset.i === i));
        const li = $(`li[data-i="${i}"]`, ol);
        if (li) ol.scrollTo({ top: li.offsetTop - ol.clientHeight / 3, behavior: "smooth" });
      }
      // start over with the typo when the clip loops, so the suggestion can be tried again
      if (t < 0.1 && fixed) { fixed = false; render(); }
      box.classList.toggle("paused", v.paused);
      requestAnimationFrame(tick);
    }

    $(".pd-play", box).addEventListener("click", () => (v.paused ? v.play() : v.pause()));
    $$(".pd-step", box).forEach((b) => b.addEventListener("click", () => { v.pause(); v.currentTime = Math.max(0, v.currentTime + b.dataset.step / 24); }));
    $(".pd-ai", box).addEventListener("click", () => box.classList.toggle("no-ai"));
    const seek = (e) => { const r = bar.getBoundingClientRect(); v.currentTime = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) * (v.duration || 0); };
    bar.addEventListener("pointerdown", (e) => { seek(e); bar.setPointerCapture(e.pointerId); bar.onpointermove = seek; });
    bar.addEventListener("pointerup", () => (bar.onpointermove = null));
    document.addEventListener("langchange", render);
    render();
    requestAnimationFrame(tick);
    whenVisible(box, () => v.play().catch(() => {}), () => v.pause());
  }

  // ======================= Folder backgrounds (⌘J) =======================
  function bgDemo(box) {
    const MODES = ["gradient", "video", "lottie", "none"];
    const files = S.viewsDemo.slice(0, 8);
    box.innerHTML = `${chrome("Motion Library")}
      <div class="bd-body">
        <div class="bd-folder">
          <div class="bd-bg"><div class="bd-grad"></div><video src="assets/demo/sunset.mp4" muted loop playsinline preload="none"></video><div class="bd-lottie"></div></div>
          <div class="bd-grid">${files.map((f) => `<div class="bd-tile"><div class="vd-th" style="${thumbStyle(f)}">${f.badge ? `<em>${f.badge}</em>` : ""}</div><span>${f.name}</span></div>`).join("")}</div>
        </div>
        <aside class="bd-panel">
          <p class="bd-h">⌘J · <span data-k="bg.title"></span></p>
          <div class="bd-seg">${MODES.map((m) => `<button data-mode="${m}" data-k="bg.${m}"></button>`).join("")}</div>
          <p class="bd-h" data-k="bg.layers"></p>
          <div class="bd-layer"><span class="bd-sw"></span><b></b><button class="bd-eye" aria-label="Show / hide layer">👁</button></div>
          <label class="bd-op">Opacity <input type="range" min="0" max="100" value="100"></label>
        </aside>
      </div>`;
    const bg = $(".bd-bg", box), video = $("video", box), lot = $(".bd-lottie", box);
    let mode = "gradient", anim = null, auto = null;

    function set(m) {
      mode = m;
      box.dataset.mode = m;
      $$("[data-mode]", box).forEach((b) => b.setAttribute("aria-pressed", b.dataset.mode === m));
      const label = { gradient: "Gradient · Linear", video: "Sunset_Timelapse.mp4", lottie: "Loader_Bounce.json", none: "--" }[m];
      $(".bd-layer b", box).textContent = m === "none" ? BF.t("bg.none") : label;
      if (m === "video") { video.preload = "auto"; video.play().catch(() => {}); } else video.pause();
      if (m === "lottie") {
        if (!anim && window.lottie) anim = window.lottie.loadAnimation({ container: lot, renderer: "svg", loop: true, autoplay: true, path: "assets/demo/loader.json", rendererSettings: { preserveAspectRatio: "xMidYMid slice" } });
        else if (!anim) loadLottie().then(() => set("lottie"));
        anim?.play();
      } else anim?.pause();
    }
    function loadLottie() {
      return new Promise((ok) => {
        const s = Object.assign(document.createElement("script"), { src: "https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie_light.min.js", onload: ok });
        document.head.appendChild(s);
      });
    }
    const stop = () => { clearInterval(auto); auto = null; };
    $$("[data-mode]", box).forEach((b) => b.addEventListener("click", () => { stop(); set(b.dataset.mode); }));
    $(".bd-eye", box).addEventListener("click", (e) => { stop(); bg.classList.toggle("off"); e.currentTarget.classList.toggle("off"); });
    $(".bd-op input", box).addEventListener("input", (e) => { stop(); bg.style.opacity = e.target.value / 100; });
    const render = () => { $$("[data-k]", box).forEach((el) => (el.textContent = BF.t(el.dataset.k))); set(mode); };
    document.addEventListener("langchange", render);
    render();
    whenVisible(box, () => {
      if (mode === "video") video.play().catch(() => {});
      if (!auto && box.dataset.touched !== "1") auto = setInterval(() => set(MODES[(MODES.indexOf(mode) + 1) % 3]), 3200);
    }, () => { stop(); video.pause(); });
    box.addEventListener("pointerdown", () => { box.dataset.touched = "1"; stop(); });
  }

  // ======================= Spoken Advanced Search =======================
  function searchDemo(box) {
    const files = S.search.files;
    box.innerHTML = `${chrome("", "")}
      <div class="sd-body">
        <div class="sd-field"><span class="sd-mic">🎙</span><span class="sd-q"></span><i class="sd-caret"></i><button class="sd-go" data-k="sr.ai"></button></div>
        <div class="sd-chips"></div>
        <div class="sd-count"></div>
        <ul class="sd-list">${files.map((f) => `<li><span class="vd-th" style="${thumbStyle(f)}"></span><b>${f.name}</b><span>${f.dur || "--"}</span><span>${f.date}</span></li>`).join("")}</ul>
      </div>`;
    const q = $(".sd-q", box), chips = $(".sd-chips", box), rows = $$(".sd-list li", box), count = $(".sd-count", box);
    let timers = [], running = false;
    const later = (ms, fn) => timers.push(setTimeout(fn, ms));
    const clear = () => { timers.forEach(clearTimeout); timers = []; };
    const setCount = (n) => (count.textContent = BF.t("sr.found").replace("{n}", n).replace("{m}", files.length));

    function run() {
      clear();
      running = true;
      $(".vd-title", box).textContent = BF.t("sr.title");
      $$("[data-k]", box).forEach((el) => (el.textContent = BF.t(el.dataset.k)));
      const text = S.search.query[BF.lang] || S.search.query.en;
      const cs = S.search.chips[BF.lang] || S.search.chips.en;
      box.classList.add("listening");
      box.classList.remove("done");
      q.textContent = "";
      q.dataset.ph = BF.t("sr.listening");
      chips.innerHTML = "";
      rows.forEach((r) => r.classList.remove("out"));
      setCount(files.length);
      let i = 0;
      const type = () => { q.textContent = text.slice(0, ++i); if (i < text.length) later(45 + Math.random() * 50, type); else later(500, think); };
      later(900, type);
      function think() {
        box.classList.remove("listening");
        cs.forEach((c, k) => later(250 + k * 280, () => chips.insertAdjacentHTML("beforeend", `<span>${c}</span>`)));
        later(250 + cs.length * 280 + 200, () => {
          rows.forEach((r, k) => { if (!files[k].match) r.classList.add("out"); });
          setCount(files.filter((f) => f.match).length);
          box.classList.add("done");
          later(4200, run);
        });
      }
    }
    $(".sd-go", box).addEventListener("click", run);
    document.addEventListener("langchange", () => running && run());
    whenVisible(box, () => { if (!running) run(); }, () => { clear(); running = false; });
  }

  // ======================= Media player: play queue, trim, compress =======================
  function mediaDemo(box) {
    const Q = S.mediaQueue.map((q, id) => ({ ...q, id, a: 0, b: 1 }));
    const first = Q.map((q) => q.id);
    let busy = false, order = [...first], playing = 0, repeat = true, shuffle = false, saved = null, tour = null, step = 0;
    const RH = 52;
    const mb = (n) => (n < 1 ? Math.round(n * 1000) + " KB" : (n >= 100 ? Math.round(n) : n.toFixed(1)) + " MB");
    const dur = (q) => (q.b - q.a) * q.dur;
    const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;
    const icon = (d) => `<svg viewBox="0 0 24 24">${d}</svg>`;
    box.innerHTML = `${chrome("")}
      <div class="md-body">
        <div class="md-left">
          <div class="md-video"><video muted playsinline preload="auto"></video><div class="md-toast"></div>
            <div class="md-sheet"><b data-k="mp.compress"></b><div class="md-presets"></div><div class="md-prog"><i></i></div>
              <div class="md-sbtn"><button class="md-btn ghost" data-act="close" data-k="mp.cancel"></button><button class="md-btn" data-act="go" data-k="mp.start"></button></div></div>
          </div>
          <div class="md-trim"><div class="md-strip"></div><div class="md-range"><span class="h" data-h="a"></span><span class="h" data-h="b"></span></div><i class="md-head"></i></div>
          <div class="md-ctrl">
            <button data-act="prev" aria-label="Previous">${icon('<path d="M7 6v12M18 6l-9 6 9 6z"/>')}</button>
            <button data-act="play" class="md-play" aria-label="Play / pause">${icon('<path class="i-pause" d="M7 5h3v14H7zM14 5h3v14h-3z"/><path class="i-play" d="M8 5l11 7-11 7z"/>')}</button>
            <button data-act="next" aria-label="Next">${icon('<path d="M17 6v12M6 6l9 6-9 6z"/>')}</button>
            <span class="md-tc"></span><div class="md-bar"><i></i></div>
            <span class="md-tools">
              <button data-act="trim" class="md-lbl">✂︎ <span data-k="mp.trim"></span></button>
              <button data-act="compress" class="md-lbl">⇣ <span data-k="mp.compress"></span></button>
              <button data-act="repeat" aria-label="Repeat">${icon('<path d="M5 9h11l-3-3M19 15H8l3 3"/>')}</button>
              <button data-act="shuffle" aria-label="Shuffle">${icon('<path d="M4 7h4l8 10h4M4 17h4l8-10h4M18 5l2 2-2 2M18 15l2 2-2 2"/>')}</button>
            </span>
            <span class="md-trimbtns"><button class="md-btn ghost" data-act="trim-cancel" data-k="mp.cancel"></button><button class="md-btn yellow" data-act="trim-ok" data-k="mp.trim"></button></span>
          </div>
        </div>
        <aside class="md-queue"><header><b data-k="mp.queue"></b><span class="md-count"></span></header><div class="md-list">${Q.map((q) => `
          <div class="md-row" data-id="${q.id}"><span class="md-grip" title="Drag to reorder">≡</span><span class="vd-th" style="background-image:url('${q.thumb}')"></span>
            <span class="md-txt"><b>${q.name}</b><small></small></span><span class="md-eq"><i></i><i></i><i></i></span></div>`).join("")}</div>
          <footer class="md-foot"><span class="md-total"></span><button class="md-btn ghost" data-act="save" data-k="mp.save"></button></footer></aside>
      </div>`;
    const v = $("video", box), list = $(".md-list", box), rows = $$(".md-row", box);
    const rowOf = (id) => rows.find((r) => +r.dataset.id === id);
    const q = () => Q[playing];

    function paintQueue(dragId = -1) {
      list.style.height = order.length * RH + "px";
      order.forEach((id, i) => { const r = rowOf(id); if (id !== dragId) r.style.transform = `translateY(${i * RH}px)`; });
      rows.forEach((r) => {
        const it = Q[+r.dataset.id], i = order.indexOf(it.id), pi = order.indexOf(playing);
        r.classList.toggle("on", it.id === playing);
        $("small", r).textContent = it.id === playing ? mmss(dur(it)) + (it.b - it.a < 1 ? " ✂︎" : "")
          : (i === (pi + 1) % order.length ? `${BF.t("mp.next")} · ` : "") + mmss(dur(it)) + (it.b - it.a < 1 ? " ✂︎" : "");
      });
      $(".md-count", box).textContent = order.length;
      $(".md-total", box).textContent = `${BF.t("mp.total")} ${mmss(Q.reduce((s, it) => s + dur(it), 0))}`;
      $(".vd-title", box).textContent = q().name;
      $$('[data-act="repeat"]', box)[0].setAttribute("aria-pressed", repeat);
      $$('[data-act="shuffle"]', box)[0].setAttribute("aria-pressed", shuffle);
    }
    function load(id) {
      playing = id;
      const it = q();
      if (!v.src.endsWith(it.src)) v.src = it.src;
      // busy until the seek lands, so the old clip's time can't trigger another 'next'
      busy = true;
      const go = () => { v.addEventListener("seeked", () => (busy = false), { once: true }); v.currentTime = (it.start || 0) + it.a * it.dur; v.play().catch(() => {}); };
      v.readyState >= 1 ? go() : v.addEventListener("loadedmetadata", go, { once: true });
      $(".md-strip", box).style.backgroundImage = `url('${it.strip}')`;
      paintTrim();
      paintQueue();
    }
    function step1(dir) {
      let i = order.indexOf(playing);
      if (shuffle && dir > 0) { const others = order.filter((id) => id !== playing); return load(others[Math.floor(Math.random() * others.length)]); }
      i += dir;
      if (i >= order.length) { if (!repeat) return v.pause(); i = 0; }
      if (i < 0) i = order.length - 1;
      load(order[i]);
    }
    function frac() { const it = q(); return (v.currentTime - (it.start || 0)) / it.dur; }
    function tick() {
      const it = q(), f = frac();
      if (!busy && f >= it.b - 0.005 && !v.paused) { box.classList.contains("trimming") ? (v.currentTime = (it.start || 0) + it.a * it.dur) : step1(1); }
      const local = Math.max(0, f - it.a) * it.dur;
      $(".md-tc", box).textContent = `${mmss(local)} / ${mmss(dur(it))}`;
      $(".md-bar", box).style.setProperty("--p", Math.min(1, Math.max(0, (f - it.a) / (it.b - it.a))));
      $(".md-head", box).style.left = `${Math.min(1, Math.max(0, f)) * 100}%`;
      box.classList.toggle("paused", v.paused);
      requestAnimationFrame(tick);
    }
    v.addEventListener("ended", () => { if (!busy) step1(1); });

    // ----- trim -----
    function paintTrim() {
      const it = q(), r = $(".md-range", box);
      r.style.left = it.a * 100 + "%";
      r.style.right = (1 - it.b) * 100 + "%";
    }
    function trimOpen() { saved = [q().a, q().b]; box.classList.add("trimming"); closeSheet(); }
    function trimClose(keep) {
      box.classList.remove("trimming");
      if (!keep && saved) { [q().a, q().b] = saved; paintTrim(); }
      else if (keep) {
        const n = q().name.replace(/(\.[^.]+)$/, " (trimmed)$1");
        toast(BF.t("mp.trimmed").replace("{name}", n).replace("{dur}", mmss(dur(q()))));
      }
      saved = null;
      paintQueue();
    }
    $$(".md-range .h", box).forEach((h) => {
      h.addEventListener("pointerdown", (e) => {
        e.preventDefault(); h.setPointerCapture(e.pointerId);
        const strip = $(".md-trim", box).getBoundingClientRect();
        h.onpointermove = (ev) => {
          const x = Math.min(1, Math.max(0, (ev.clientX - strip.left) / strip.width)), it = q();
          if (h.dataset.h === "a") it.a = Math.min(x, it.b - 0.1); else it.b = Math.max(x, it.a + 0.1);
          paintTrim();
          v.currentTime = (it.start || 0) + (h.dataset.h === "a" ? it.a : it.b - 0.02) * it.dur;
        };
      });
      h.addEventListener("pointerup", () => (h.onpointermove = null));
    });

    // ----- compress -----
    const PRESETS = [["orig", 0.32], ["720", 0.17], ["gif", 0.11]];
    let preset = "720";
    function sheetOpen() {
      if (box.classList.contains("trimming")) trimClose(false);
      $(".md-presets", box).innerHTML = PRESETS.map(([k, r]) => `<button data-p="${k}" aria-pressed="${k === preset}"><span>${BF.t("mp.p." + k)}</span><em>${mb(q().size)} → ${mb(q().size * r * (q().b - q().a))}</em></button>`).join("");
      $$("[data-p]", box).forEach((b) => b.addEventListener("click", () => { preset = b.dataset.p; sheetOpen(); }));
      box.classList.add("sheet");
      box.classList.remove("working");
    }
    function closeSheet() { box.classList.remove("sheet", "working"); }
    function compress() {
      box.classList.add("working");
      const it = q(), r = PRESETS.find((p) => p[0] === preset)[1], out = it.size * r * (it.b - it.a);
      later(1700, () => {
        closeSheet();
        toast(BF.t("mp.done").replace("{a}", mb(it.size)).replace("{b}", mb(out)).replace("{p}", `−${Math.round((1 - out / it.size) * 100)}%`));
      });
    }
    let tt = 0;
    function toast(text) { const t = $(".md-toast", box); t.textContent = text; t.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 2600); }
    const timers = [];
    const later = (ms, fn) => timers.push(setTimeout(fn, ms));

    // ----- queue drag (≡) -----
    rows.forEach((r) => {
      const grip = $(".md-grip", r), id = +r.dataset.id;
      grip.addEventListener("pointerdown", (e) => {
        e.preventDefault(); grip.setPointerCapture(e.pointerId);
        const top = list.getBoundingClientRect().top, off = e.clientY - top - order.indexOf(id) * RH;
        r.classList.add("drag");
        grip.onpointermove = (ev) => {
          const y = Math.min((order.length - 1) * RH, Math.max(0, ev.clientY - top - off));
          r.style.transform = `translateY(${y}px)`;
          const to = Math.round(y / RH), from = order.indexOf(id);
          if (to !== from) { order.splice(from, 1); order.splice(to, 0, id); paintQueue(id); }
        };
      });
      grip.addEventListener("pointerup", () => { grip.onpointermove = null; r.classList.remove("drag"); paintQueue(); });
      r.addEventListener("click", (e) => { if (!e.target.closest(".md-grip")) load(id); });
    });

    // ----- buttons -----
    box.addEventListener("click", (e) => {
      const a = e.target.closest("[data-act]")?.dataset.act;
      if (!a) return;
      ({ play: () => (v.paused ? v.play() : v.pause()), prev: () => step1(-1), next: () => step1(1), trim: trimOpen,
         "trim-cancel": () => trimClose(false), "trim-ok": () => trimClose(true), compress: sheetOpen, close: closeSheet, go: compress,
         repeat: () => { repeat = !repeat; paintQueue(); }, save: () => toast(BF.t("mp.saved")), shuffle: () => { shuffle = !shuffle; paintQueue(); } })[a]?.();
    });
    $(".md-bar", box).addEventListener("pointerdown", (e) => {
      const r = e.currentTarget.getBoundingClientRect(), it = q();
      v.currentTime = (it.start || 0) + (it.a + ((e.clientX - r.left) / r.width) * (it.b - it.a)) * it.dur;
    });

    // ----- a short tour until the visitor takes over -----
    const animTrim = (a, b) => { const it = q(); box.classList.add("glide"); it.a = a; it.b = b; paintTrim(); later(700, () => box.classList.remove("glide")); };
    const TOUR = [
      () => trimOpen(),
      () => animTrim(0.2, 0.75),
      () => trimClose(true),
      () => { const last = order[order.length - 1]; order.splice(order.length - 1, 1); order.splice(order.indexOf(playing) + 1, 0, last); paintQueue(); },
      () => step1(1),
      () => { preset = "720"; sheetOpen(); },
      () => compress(),
      () => {},
      () => { Q.forEach((it) => { it.a = 0; it.b = 1; }); order = [...first]; load(first[0]); },
    ];
    const stopTour = () => { clearInterval(tour); tour = null; };
    box.addEventListener("pointerdown", () => { box.dataset.touched = "1"; stopTour(); });

    const render = () => { $$("[data-k]", box).forEach((el) => (el.textContent = BF.t(el.dataset.k))); paintQueue(); if (box.classList.contains("sheet")) sheetOpen(); };
    document.addEventListener("langchange", render);
    render();
    load(first[0]);
    requestAnimationFrame(tick);
    whenVisible(box, () => {
      v.play().catch(() => {});
      if (!tour && box.dataset.touched !== "1") tour = setInterval(() => TOUR[step++ % TOUR.length](), 2300);
    }, () => { v.pause(); stopTour(); });
  }

  // ======================= Sort by media columns (FPS, resolution, codec, ratio…) + Group By =======================
  // Nearest common aspect ratio for a "W×H" size (within 1.5 %), else W:H as a decimal.
  const RATIOS = [[1, "1:1"], [16 / 9, "16:9"], [9 / 16, "9:16"], [4 / 5, "4:5"], [5 / 4, "5:4"], [4 / 3, "4:3"], [3 / 4, "3:4"],
    [3 / 2, "3:2"], [2 / 3, "2:3"], [16 / 10, "16:10"], [1.85, "1.85:1"], [2.39, "2.39:1"], [21 / 9, "21:9"], [2, "2:1"]];
  const ratioOf = (res) => {
    const [w, h] = res.split("×").map(Number), r = w / h;
    const best = RATIOS.reduce((a, b) => (Math.abs(b[0] - r) < Math.abs(a[0] - r) ? b : a));
    return { r, label: Math.abs(best[0] - r) / r < 0.015 ? best[1] : r.toFixed(2) + ":1" };
  };
  function sortDemo(box) {
    const files = S.sortDemo.map((f) => ({ ...f, ar: ratioOf(f.res) }));
    const still = (f) => !f.fps;
    const arIcon = (f) => { const k = 14 / Math.max(f.ar.r, 1 / f.ar.r); return `<span class="sd2-ar"><i style="width:${(k * Math.max(f.ar.r, 1)).toFixed(1)}px;height:${(k * Math.max(1 / f.ar.r, 1)).toFixed(1)}px"></i></span>`; };
    const COLS = [
      { k: "name", label: "Name", get: (f) => f.name.toLowerCase(), show: (f) => f.name },
      { k: "dur", label: "Duration", get: (f) => f.dur, show: (f) => (still(f) ? "–" : `${Math.floor(f.dur / 60)}:${String(f.dur % 60).padStart(2, "0")}`), num: true },
      { k: "fps", label: "FPS", get: (f) => f.fps, show: (f) => (still(f) ? "–" : f.fps), num: true },
      { k: "res", label: "Resolution", get: (f) => f.res.split("×").reduce((a, b) => a * b, 1), show: (f) => f.res, num: true },
      { k: "ratio", label: "Ratio", get: (f) => f.ar.r, show: (f) => `${arIcon(f)}${f.ar.label}` },
      { k: "codec", label: "Codec", get: (f) => f.codec, show: (f) => f.codec },
      { k: "size", label: "Size", get: (f) => f.size, show: (f) => (f.size >= 1000 ? (f.size / 1000).toFixed(1) + " GB" : f.size + " MB"), num: true },
    ];
    // Group By: groups in a fixed order (ratio: tallest first, so the 9:16 / 4:5 / 1:1 social cuts lead; codec: A to Z).
    const GROUPS = [
      { k: "none" },
      { k: "ratio", label: "Ratio", of: (f) => f.ar.label, order: (f) => f.ar.r, isNew: true },
      { k: "codec", label: "Codec", of: (f) => f.codec, order: (f) => f.codec },
    ];
    const RH = 30, GH = 26;
    box.innerHTML = `${chrome("Footage")}
      <div class="sd2-body">
        <div class="sd2-tools"><span data-k="srt.group"></span>${GROUPS.map((g) => `<button data-group="${g.k}">${g.label ? g.label : `<span data-k="srt.none"></span>`}${g.isNew ? `<em data-k="${BF.ratioOut ? "srt.new" : "srt.soon"}"></em>` : ""}</button>`).join("")}</div>
        <div class="sd2-head">${COLS.map((col) => `<button data-col="${col.k}" class="c-${col.k}${col.num ? " num" : ""}">${col.label}<i></i></button>`).join("")}</div>
        <div class="sd2-scroll" style="height:${files.length * RH + 8}px"><div class="sd2-rows">${files.map((f, i) => `
          <div class="sd2-row" data-i="${i}">${COLS.map((col) => `<span class="c-${col.k}${col.num ? " num" : ""}">${col.k === "name" ? `<span class="vd-th" style="background-image:url('${f.thumb}')"></span>` : ""}${col.show(f)}</span>`).join("")}</div>`).join("")}</div></div>
        <div class="sd2-status"></div>
      </div>`;
    const rowsBox = $(".sd2-rows", box), rows = $$(".sd2-row", box);
    let key = "name", dir = 1, group = "none", tour = null, step = 0;
    function sort(k, d) {
      key = k; dir = d;
      const col = COLS.find((x) => x.k === k), g = GROUPS.find((x) => x.k === group);
      const byCol = (a, b) => {
        const x = col.get(files[a]), y = col.get(files[b]);
        return (x < y ? -1 : x > y ? 1 : files[a].name < files[b].name ? -1 : 1) * d;
      };
      const order = files.map((f, i) => i).sort((a, b) => {
        if (g.of) { const x = g.order(files[a]), y = g.order(files[b]); if (x !== y) return x < y ? -1 : 1; }
        return byCol(a, b);
      });
      // Rows move to their new place; with Group By on, a header line opens above each group.
      $$(".sd2-ghead", rowsBox).forEach((el) => el.remove());
      let y = 0, last = null, groups = 0;
      order.forEach((i, pos) => {
        if (g.of && g.of(files[i]) !== last) {
          last = g.of(files[i]); groups++;
          const n = files.filter((f) => g.of(f) === last).length;
          rowsBox.insertAdjacentHTML("beforeend", `<div class="sd2-ghead" style="transform:translateY(${y}px)">${g.k === "ratio" ? arIcon(files[i]) : ""}<b>${last}</b><span>${n}</span></div>`);
          y += GH;
        }
        rows[i].style.transform = `translateY(${y}px)`;
        rows[i].classList.toggle("odd", pos % 2 === 1);
        y += RH;
      });
      rowsBox.style.height = y + "px";
      $$("[data-col]", box).forEach((b) => { b.classList.toggle("on", b.dataset.col === k); b.querySelector("i").textContent = b.dataset.col === k ? (d > 0 ? "▲" : "▼") : ""; });
      $$("[data-group]", box).forEach((b) => b.classList.toggle("on", b.dataset.group === group));
      box.dataset.sorted = k;
      box.dataset.grouped = group;
      $(".sd2-status", box).textContent = (g.of ? BF.t("srt.grouped").replace("{g}", groups).replace("{by}", g.label) : BF.t("srt.items"))
        .replace("{n}", files.length).replace("{col}", col.label);
    }
    const stopTour = (e) => { if (e.isTrusted) { clearInterval(tour); tour = null; box.dataset.touched = "1"; } };
    $$("[data-col]", box).forEach((b) => b.addEventListener("click", (e) => {
      stopTour(e);
      const k = b.dataset.col;
      sort(k, k === key ? -dir : COLS.find((x) => x.k === k).num ? -1 : 1);
    }));
    $$("[data-group]", box).forEach((b) => b.addEventListener("click", (e) => { stopTour(e); setGroup(b.dataset.group); sort(key, dir); }));
    // The list keeps the window's height (no page jump); groups that don't fit scroll inside it, like in the app.
    const setGroup = (g) => { if (g !== group) $(".sd2-scroll", box).scrollTop = 0; group = g; };
    const TOUR = [["fps", -1], ["res", -1], ["ratio", -1], ["name", 1, "ratio"], ["size", -1, "ratio"], ["codec", 1], ["dur", -1], ["name", 1]];
    document.addEventListener("langchange", () => {
      $$("[data-k]", box).forEach((el) => (el.textContent = BF.t(el.dataset.k)));
      sort(key, dir);
    });
    $$("[data-k]", box).forEach((el) => (el.textContent = BF.t(el.dataset.k)));
    sort("name", 1);
    whenVisible(box, () => { if (!tour && box.dataset.touched !== "1") tour = setInterval(() => { const [k, d, g] = TOUR[step++ % TOUR.length]; setGroup(g || "none"); sort(k, d); }, 2200); },
      () => { clearInterval(tour); tour = null; });
  }

  // ======================= Filter chips + colour tags =======================
  function filterDemo(box) {
    const F = S.filters;
    const files = F.files.map((f) => ({ ...S.viewsDemo[f.i], type: f.type, tags: f.tags }));
    const tagOf = (id) => F.tags.find((t) => t.id === id);
    const nm = (o) => o[BF.lang] || o.en;
    box.innerHTML = `${chrome("Motion Library")}
      <div class="fl-body">
        <aside class="fl-side"><p data-k="flt.tags"></p>${F.tags.map((t) => `<button data-tag="${t.id}"><i style="background:${t.color}"></i><span></span><em>${files.filter((f) => f.tags.includes(t.id)).length}</em></button>`).join("")}</aside>
        <div class="fl-main">
          <div class="fl-chips"><button data-chip="all"></button>${F.chips.map((ch) => `<button data-chip="${ch.id}" style="--c:${ch.color}"></button>`).join("")}<span class="fl-hint" data-k="flt.hint"></span></div>
          <div class="fl-stage">${files.map((f, i) => `
            <div class="fl-tile" data-i="${i}"><div class="vd-th" style="${thumbStyle(f)}">${f.badge ? `<em>${f.badge}</em>` : ""}</div>
              <span class="fl-name">${f.tags.map((t) => `<i style="background:${tagOf(t).color}"></i>`).join("")}<b>${f.name}</b></span></div>`).join("")}</div>
          <div class="fl-status"></div>
        </div>
      </div>`;
    const stage = $(".fl-stage", box), tiles = $$(".fl-tile", box);
    const chips = new Set();
    let tag = null, auto = null, step = 0;

    function layout() {
      const W = stage.clientWidth, cols = W > 520 ? 4 : 3, gap = 12;
      const w = (W - gap * (cols - 1)) / cols, h = w * 9 / 16 + 26;
      stage.style.height = Math.ceil(files.length / cols) * (h + gap) - gap + "px";
      let k = 0;
      tiles.forEach((el, i) => {
        const f = files[i];
        const show = (!chips.size || chips.has(f.type)) && (!tag || f.tags.includes(tag));
        // hidden tiles shrink away where they were; shown tiles move to their new place
        if (show) { el.dataset.pos = `translate(${(k % cols) * (w + gap)}px, ${Math.floor(k / cols) * (h + gap)}px)`; k++; }
        else if (!el.dataset.pos) el.dataset.pos = `translate(${(i % cols) * (w + gap)}px, ${Math.floor(i / cols) * (h + gap)}px)`;
        el.style.transform = el.dataset.pos + (show ? "" : " scale(.85)");
        el.style.width = w + "px";
        el.style.height = h + "px";
        el.classList.toggle("off", !show);
      });
      $(".fl-status", box).textContent = BF.t("flt.items").replace("{n}", k) + (tag ? ` · ${nm(tagOf(tag))}` : "");
      $$("[data-chip]", box).forEach((b) => b.setAttribute("aria-pressed", b.dataset.chip === "all" ? !chips.size : chips.has(b.dataset.chip)));
      $$("[data-tag]", box).forEach((b) => b.setAttribute("aria-pressed", b.dataset.tag === tag));
    }
    function chip(id, multi) {
      if (id === "all") chips.clear();
      else if (multi) chips.has(id) ? chips.delete(id) : chips.add(id);
      else if (chips.size === 1 && chips.has(id)) chips.clear();
      else { chips.clear(); chips.add(id); }
      layout();
    }
    function render() {
      $$("[data-k]", box).forEach((el) => (el.textContent = BF.t(el.dataset.k)));
      $('[data-chip="all"]', box).textContent = BF.t("flt.all");
      F.chips.forEach((ch) => ($(`[data-chip="${ch.id}"]`, box).textContent = nm(ch)));
      F.tags.forEach((t) => ($(`[data-tag="${t.id}"] span`, box).textContent = nm(t)));
      layout();
    }
    const stop = () => { clearInterval(auto); auto = null; };
    $$("[data-chip]", box).forEach((b) => b.addEventListener("click", (e) => { if (e.isTrusted) stop(); chip(b.dataset.chip, e.metaKey || e.ctrlKey); }));
    $$("[data-tag]", box).forEach((b) => b.addEventListener("click", (e) => { if (e.isTrusted) stop(); tag = tag === b.dataset.tag ? null : b.dataset.tag; layout(); }));
    // A short tour: one type, then two types (⌘-click), then tags, then everything again.
    const TOUR = [() => chip("video"), () => { box.classList.add("multi"); chip("motion", true); }, () => { box.classList.remove("multi"); chip("all"); tag = "client"; layout(); },
      () => { tag = "final"; layout(); }, () => { tag = null; chip("3d"); }, () => chip("all")];
    new ResizeObserver(() => layout()).observe(stage);
    document.addEventListener("langchange", render);
    render();
    whenVisible(box, () => { if (!auto && box.dataset.touched !== "1") auto = setInterval(() => TOUR[step++ % TOUR.length](), 2000); }, stop);
    box.addEventListener("pointerdown", () => { box.dataset.touched = "1"; stop(); box.classList.remove("multi"); });
  }

  // ======================= Made with AI?: the AI column, its hover reasons, Get Info and Check on SynthID =======================
  // Works like the Mac app (AIOrigin.swift): the cell shows the tool when known, else Yes / Partly / Maybe / No; the colour
  // tells how sure. A SynthID answer is kept with the file, but its "Not Found" never hides AI found another way.
  function aiDemo(box) {
    const files = S.aiDemo.map((f) => ({ ...f, m: null }));
    const word = (v) => ({ yes: "Yes", partly: "Partly", maybe: "Maybe", site: "Maybe", no: "No" })[v] || "";
    // What is shown: the user's SynthID answer, unless it's "Not Found" and something was detected.
    const shown = (f) => (f.m && !(f.m === "no" && f.v && f.v !== "no") ? { v: f.m, manual: true } : { v: f.v, manual: false });
    const cell = (f) => {
      const s = shown(f);
      if (s.manual) return s.v === "no" ? "No ✓" : (f.tool && f.v !== "no" ? f.tool : s.v === "yes" ? "SynthID" : word(s.v)) + " ✓";
      return f.tool && f.v !== "no" ? f.tool : word(f.v);
    };
    const tone = (f) => {
      const s = shown(f);
      if ((s.manual && s.v === "no" && !f.v) || (!s.manual && s.v === "site")) return "grey";
      return s.v;
    };
    const headline = (f) => {
      const s = shown(f), who = f.tool ? `: ${f.tool}` : "";
      if (s.manual) return BF.t(`ai.s.${s.v}`);
      if (f.v === "no") return BF.t("ai.h.no") + (f.tool ? ` (${f.tool})` : "");
      if (!f.v) return BF.t("ai.h.none");
      return BF.t(`ai.h.${f.v === "site" ? "maybe" : f.v}`) + who;
    };
    const details = (f) => {
      const s = shown(f), out = f.v && f.why ? [...(f.why[BF.lang] || f.why.en)] : [];
      if (f.m === "no") out.push(BF.t("ai.s.checked"), BF.t("ai.s.only"));
      else if (f.m) out.push(BF.t("ai.s.ans").replace("{a}", word(f.m)));
      if (s.manual && f.v && f.v !== f.m) out.push(BF.t("ai.s.detected").replace("{a}", word(f.v)));
      if (!s.v || (s.manual && s.v === "no" && !f.v)) out.push(BF.t("ai.none.why"));
      return out;
    };
    const pill = (f) => (cell(f) ? `<em class="ai-pill t-${tone(f)}">${cell(f)}</em>` : "");

    box.innerHTML = `${chrome("Downloads")}
      <div class="ai-body">
        <div class="ai-list">
          <div class="ai-head"><span class="c-name" data-k="ai.name"></span><span class="c-kind" data-k="ai.kind"></span><span class="c-size" data-k="ai.size"></span><span class="c-ai" data-k="ai.col"></span></div>
          <div class="ai-rows">${files.map((f, i) => `
            <div class="ai-row" data-i="${i}"><span class="c-name"><span class="vd-th" style="background-image:url('${f.thumb}')"></span><b>${f.name}</b></span><span class="c-kind">${f.kind}</span><span class="c-size">${f.size}</span><span class="c-ai"></span></div>`).join("")}</div>
          <div class="ai-tip" role="tooltip"></div>
          <div class="ai-status"></div>
        </div>
        <aside class="ai-info"></aside>
      </div>`;
    const rows = $$(".ai-row", box), tip = $(".ai-tip", box), info = $(".ai-info", box), list = $(".ai-list", box);
    let sel = 0, tipAt = -1, hideT = null, synthOpen = false, tour = null, step = 0;

    function paintRow(i) { $(".c-ai", rows[i]).innerHTML = pill(files[i]); }
    function status() {
      const k = files.filter((f) => ["yes", "partly", "maybe", "site"].includes(shown(f).v)).length;
      $(".ai-status", box).textContent = BF.t("ai.items").replace("{n}", files.length).replace("{k}", k);
    }
    // The reasons open beside the column and follow the pointer from row to row (like the app's AIHoverTip).
    function showTip(i) {
      clearTimeout(hideT);
      if (!cell(files[i])) return hideTip();
      tipAt = i;
      tip.innerHTML = `<b>${headline(files[i])}</b>${details(files[i]).join(" · ")}`;
      const r = rows[i].getBoundingClientRect(), l = list.getBoundingClientRect(), c = $(".c-ai", rows[i]).getBoundingClientRect();
      // Narrow window: no room beside the column, so the reasons open under the row.
      const below = l.width < 520;
      tip.classList.toggle("below", below);
      tip.style.right = below ? "8px" : l.right - c.left + 6 + "px";
      tip.style.top = Math.max(0, Math.min(below ? r.bottom - l.top + 4 : r.top - l.top, list.clientHeight - tip.offsetHeight - 4)) + "px";
      tip.classList.add("on");
    }
    function hideTip() { tipAt = -1; tip.classList.remove("on"); }
    function renderInfo() {
      const f = files[sel], canCheck = f.synth !== false && /\.(png|jpe?g|webp|heic|mp4|mov|webm)$/i.test(f.name);
      info.innerHTML = `<div class="vd-th ai-ith" style="background-image:url('${f.thumb}')"></div>
        <b class="ai-iname">${f.name}</b><small>${f.kind} · ${f.size}</small>
        <div class="ai-group"><h4>▾ ${BF.t("ai.info")}</h4>
          <p class="ai-ihead">${pill(f)}<span>${headline(f)}</span></p>
          <ul>${details(f).map((d) => `<li>${d}</li>`).join("")}</ul>
          ${canCheck ? `<button class="ai-check">${BF.t("ai.check")}</button>
          <div class="ai-synth"${synthOpen ? "" : " hidden"}><p>${BF.t("ai.check.how")}</p>
            <div><button data-a="yes">${BF.t("ai.found")}</button><button data-a="partly">${BF.t("ai.part")}</button><button data-a="no">${BF.t("ai.notfound")}</button></div>
            ${f.m ? `<button class="ai-clear" data-a="clear">${BF.t("ai.clear")}</button>` : ""}</div>` : ""}
        </div>`;
    }
    function select(i, withTip) {
      if (i !== sel) synthOpen = false;
      sel = i;
      rows.forEach((r, k) => r.classList.toggle("sel", k === i));
      renderInfo();
      if (withTip) showTip(i); else hideTip();
    }
    function render() {
      $$("[data-k]", box).forEach((el) => (el.textContent = BF.t(el.dataset.k)));
      files.forEach((f, i) => paintRow(i));
      status();
      renderInfo();
      if (tipAt >= 0) showTip(tipAt);
    }
    const stopTour = () => { clearInterval(tour); tour = null; box.dataset.touched = "1"; };

    rows.forEach((r, i) => {
      $(".c-ai", r).addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") { stopTour(); showTip(i); } });
      r.addEventListener("click", () => { stopTour(); select(i, true); });
    });
    $(".ai-rows", box).addEventListener("pointerleave", () => { hideT = setTimeout(hideTip, 150); });
    $(".ai-rows", box).addEventListener("scroll", hideTip);
    info.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      stopTour();
      if (b.classList.contains("ai-check")) { synthOpen = !synthOpen; return renderInfo(); }
      const f = files[sel];
      f.m = b.dataset.a === "clear" ? null : b.dataset.a;
      synthOpen = false;
      paintRow(sel); status(); renderInfo(); showTip(sel);
      rows[sel].classList.remove("flash"); void rows[sel].offsetWidth; rows[sel].classList.add("flash");
    });

    document.addEventListener("langchange", render);
    render();
    select(0, false);
    // A short tour through the kinds of answers, until the visitor touches the demo.
    const TOUR = [0, 3, 6, 8, 2, 12, 10, 13];
    whenVisible(box, () => { if (!tour && box.dataset.touched !== "1") tour = setInterval(() => select(TOUR[step++ % TOUR.length], true), 2600); },
      () => { clearInterval(tour); tour = null; });
  }

  document.querySelectorAll("[data-player-demo]").forEach(playerDemo);
  document.querySelectorAll("[data-ai-demo]").forEach(aiDemo);
  document.querySelectorAll("[data-filter-demo]").forEach(filterDemo);
  document.querySelectorAll("[data-sort-demo]").forEach(sortDemo);
  document.querySelectorAll("[data-media-demo]").forEach(mediaDemo);
  document.querySelectorAll("[data-bg-demo]").forEach(bgDemo);
  document.querySelectorAll("[data-search-demo]").forEach(searchDemo);
})();
