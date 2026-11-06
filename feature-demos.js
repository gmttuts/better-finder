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
    // "Made with AI?" (Pro): the column sorts and groups by the answer (Yes, Partly, Maybe, then no sign), like the app.
    const AIRANK = { yes: 0, partly: 1, maybe: 2, "": 3 };
    const aiWord = { yes: "Yes", partly: "Partly", maybe: "Maybe" };
    const aiPill = (f) => (f.ai ? `<em class="ai-pill t-${f.ai}" title="${(f.why[BF.lang] || f.why.en).replace(/"/g, "&quot;")}">${f.tool || aiWord[f.ai]}</em>` : "");
    const pro = `<span class="pro-badge" title="${BF.t("pro.tip")}">PRO</span>`;
    const COLS = [
      { k: "name", label: "Name", get: (f) => f.name.toLowerCase(), show: (f) => f.name },
      { k: "ai", label: "AI", pro: true, get: (f) => AIRANK[f.ai || ""] + (f.tool || "~").toLowerCase(), show: aiPill },
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
      { k: "ai", label: "AI", pro: true, of: (f) => BF.t(`srt.aig.${f.ai || "none"}`), order: (f) => AIRANK[f.ai || ""] },
      { k: "ratio", label: "Ratio", of: (f) => f.ar.label, order: (f) => f.ar.r },
      { k: "codec", label: "Codec", of: (f) => f.codec, order: (f) => f.codec },
    ];
    const RH = 30, GH = 26;
    box.innerHTML = `${chrome("Footage")}
      <div class="sd2-body">
        <div class="sd2-tools"><button class="sd2-aif" data-aif><span class="sd2-spark">✦</span>AI<span class="sd2-aif-l"></span>${pro}</button><span class="sd2-sep"></span><span data-k="srt.group"></span>${GROUPS.map((g) => `<button data-group="${g.k}">${g.label ? g.label : `<span data-k="srt.none"></span>`}${g.pro ? pro : ""}</button>`).join("")}</div>
        <div class="sd2-head">${COLS.map((col) => `<button data-col="${col.k}" class="c-${col.k}${col.num ? " num" : ""}">${col.label}${col.pro ? pro : ""}<i></i></button>`).join("")}</div>
        <div class="sd2-scroll" style="height:${files.length * RH + 8}px"><div class="sd2-rows">${files.map((f, i) => `
          <div class="sd2-row" data-i="${i}">${COLS.map((col) => `<span class="c-${col.k}${col.num ? " num" : ""}">${col.k === "name" ? `<span class="vd-th" style="background-image:url('${f.thumb}')"></span>` : ""}${col.show(f)}</span>`).join("")}</div>`).join("")}</div></div>
        <div class="sd2-status"></div>
      </div>`;
    const rowsBox = $(".sd2-rows", box), rows = $$(".sd2-row", box);
    let key = "name", dir = 1, group = "none", tour = null, step = 0, aiFilter = "all";
    // The AI filter chip, like the app's: All Files, Made with AI (Yes, Partly or Maybe), Not Made with AI.
    const AIF = ["all", "ai", "not"];
    const passes = (f) => aiFilter === "all" || (aiFilter === "ai") === !!f.ai;
    function sort(k, d) {
      key = k; dir = d;
      const col = COLS.find((x) => x.k === k), g = GROUPS.find((x) => x.k === group);
      const byCol = (a, b) => {
        if (k === "ai" && !files[a].ai !== !files[b].ai) return files[a].ai ? -1 : 1;   // no sign of AI stays last
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
      const shown = order.filter((i) => passes(files[i]));
      rows.forEach((r, i) => { r.classList.toggle("out", !passes(files[i])); $(".c-ai", r).innerHTML = aiPill(files[i]); });
      shown.forEach((i, pos) => {
        if (g.of && g.of(files[i]) !== last) {
          last = g.of(files[i]); groups++;
          const n = files.filter((f) => passes(f) && g.of(f) === last).length;
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
      const aif = $("[data-aif]", box);
      aif.classList.toggle("on", aiFilter !== "all");
      $(".sd2-aif-l", box).textContent = aiFilter === "all" ? "" : ": " + BF.t(`srt.aif.${aiFilter}`);
      $(".sd2-status", box).textContent = aiFilter !== "all"
        ? BF.t("srt.shown").replace("{k}", shown.length).replace("{n}", files.length).replace("{f}", BF.t(`srt.aif.${aiFilter}`)).replace("{col}", col.label)
        : (g.of ? BF.t("srt.grouped").replace("{g}", groups).replace("{by}", g.label) : BF.t("srt.items")).replace("{n}", files.length).replace("{col}", col.label);
    }
    const stopTour = (e) => { if (e.isTrusted) { clearInterval(tour); tour = null; box.dataset.touched = "1"; } };
    $$("[data-col]", box).forEach((b) => b.addEventListener("click", (e) => {
      stopTour(e);
      const k = b.dataset.col;
      sort(k, k === key ? -dir : COLS.find((x) => x.k === k).num ? -1 : 1);
    }));
    $$("[data-group]", box).forEach((b) => b.addEventListener("click", (e) => { stopTour(e); setGroup(b.dataset.group); sort(key, dir); }));
    $("[data-aif]", box).addEventListener("click", (e) => { stopTour(e); aiFilter = AIF[(AIF.indexOf(aiFilter) + 1) % AIF.length]; $(".sd2-scroll", box).scrollTop = 0; sort(key, dir); });
    // The list keeps the window's height (no page jump); groups that don't fit scroll inside it, like in the app.
    const setGroup = (g) => { if (g !== group) $(".sd2-scroll", box).scrollTop = 0; group = g; };
    const TOUR = [["ai", 1], ["name", 1, "ai"], ["name", 1, "none", "ai"], ["fps", -1], ["res", -1], ["ratio", -1], ["name", 1, "ratio"], ["size", -1, "ratio"], ["codec", 1], ["dur", -1], ["name", 1]];
    document.addEventListener("langchange", () => {
      $$("[data-k]", box).forEach((el) => (el.textContent = BF.t(el.dataset.k)));
      sort(key, dir);
    });
    $$("[data-k]", box).forEach((el) => (el.textContent = BF.t(el.dataset.k)));
    sort("name", 1);
    whenVisible(box, () => { if (!tour && box.dataset.touched !== "1") tour = setInterval(() => { const [k, d, g, f] = TOUR[step++ % TOUR.length]; setGroup(g || "none"); aiFilter = f || "all"; sort(k, d); }, 2200); },
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

  // ======================= Compare (Pro): 2 to 9 versions in a grid on one timeline =======================
  // Like the app's Compare window: click a tile = reference (specs that differ turn orange; on the reference itself, specs
  // that differ from any shown tile), double-click = one tile big, sound per tile, Wipe only with 2 files.
  // Every tile draws the same scene at the same moment (one clock), so the tiles really play together.
  const DUR = 12;   // seconds in one loop of the "clip"
  const SCENES = {
    day:    { sky: ["#2f7fd8", "#a8d8ff"], body: "sun",  by: 0.2,  bc: "#fff4c2", glow: "rgba(255,236,170,.55)", cloud: "rgba(255,255,255,.92)", hills: ["#8cc276", "#5a9c52", "#336f3a"], road: "#59606a", stars: 0, lights: 0 },
    night:  { sky: ["#040817", "#1a2a58"], body: "moon", by: 0.2,  bc: "#eef2ff", glow: "rgba(190,210,255,.28)", cloud: "rgba(120,140,200,.22)", hills: ["#1e2c50", "#15203d", "#0b1327"], road: "#141924", stars: 1, lights: 1 },
    dusk:   { sky: ["#2a2b62", "#f28a5b"], body: "sun",  by: 0.62, bc: "#ffd27a", glow: "rgba(255,140,80,.55)",  cloud: "rgba(255,180,150,.55)", hills: ["#5e4569", "#40304f", "#261c33"], road: "#2c2533", stars: 0.35, lights: 1 },
    dawn:   { sky: ["#6f9fd6", "#ffd4ae"], body: "sun",  by: 0.56, bc: "#fff0cf", glow: "rgba(255,210,170,.6)",  cloud: "rgba(255,236,226,.8)",  hills: ["#a3b98f", "#77966d", "#4d6e4c"], road: "#6a6a72", stars: 0, lights: 0 },
    golden: { sky: ["#f2a65a", "#ffe3a1"], body: "sun",  by: 0.45, bc: "#fff1c4", glow: "rgba(255,200,110,.6)",  cloud: "rgba(255,240,215,.8)",  hills: ["#c3a05c", "#97793d", "#5f4b26"], road: "#6e5d47", stars: 0, lights: 0 },
    fog:    { sky: ["#9fb3c4", "#dfe6ec"], body: "sun",  by: 0.24, bc: "#ffffff", glow: "rgba(255,255,255,.4)",  cloud: "rgba(255,255,255,.7)",  hills: ["#a9b9a8", "#8ea38f", "#6f8a73"], road: "#7d848c", stars: 0, lights: 0, fog: 0.5 },
  };
  const STARS = Array.from({ length: 60 }, (_, i) => [((i * 97) % 100) / 100, ((i * 53) % 47) / 100, (i * 1.7) % 6.28]);
  function drawScene(g, w, h, t, s) {
    const p = t / DUR, sky = g.createLinearGradient(0, 0, 0, h * 0.75);
    sky.addColorStop(0, s.sky[0]); sky.addColorStop(1, s.sky[1]);
    g.fillStyle = sky; g.fillRect(0, 0, w, h);
    if (s.stars) STARS.forEach(([x, y, ph]) => {
      g.globalAlpha = s.stars * (0.35 + 0.65 * Math.abs(Math.sin(t * 1.6 + ph)));
      g.fillStyle = "#fff"; g.fillRect(x * w, y * h, Math.max(1, w / 420), Math.max(1, w / 420));
    });
    g.globalAlpha = 1;
    // Sun or moon: drifts slowly across the sky over the loop.
    const bx = w * (0.2 + 0.6 * p), by = h * (s.by + 0.04 * Math.sin(p * Math.PI)), r = h * 0.075;
    const glow = g.createRadialGradient(bx, by, r * 0.6, bx, by, r * 3.2);
    glow.addColorStop(0, s.glow); glow.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = glow; g.fillRect(bx - r * 3.2, by - r * 3.2, r * 6.4, r * 6.4);
    g.fillStyle = s.bc; g.beginPath(); g.arc(bx, by, r, 0, 7); g.fill();
    if (s.body === "moon") {   // a few soft craters
      g.fillStyle = "rgba(160,170,200,.35)";
      [[-0.3, -0.2, 0.22], [0.25, 0.1, 0.16], [-0.05, 0.4, 0.12]].forEach(([dx, dy, k]) => { g.beginPath(); g.arc(bx + dx * r, by + dy * r, k * r, 0, 7); g.fill(); });
    }
    // Clouds drift right.
    g.fillStyle = s.cloud;
    [[0.1, 0.16, 1], [0.55, 0.1, 0.8], [0.85, 0.28, 0.6]].forEach(([x0, y, k], i) => {
      const x = (((x0 + p * (0.5 + i * 0.25)) % 1.3) - 0.15) * w, cy = y * h, cr = h * 0.05 * k;
      g.beginPath(); g.arc(x, cy, cr, 0, 7); g.arc(x + cr * 1.1, cy - cr * 0.4, cr * 1.2, 0, 7); g.arc(x + cr * 2.3, cy, cr * 0.9, 0, 7); g.fill();
    });
    // Hills, back to front.
    s.hills.forEach((col, i) => {
      const base = h * (0.55 + i * 0.1), amp = h * (0.06 - i * 0.012);
      g.fillStyle = col; g.beginPath(); g.moveTo(0, h);
      for (let k = 0; k <= 40; k++) { const x = (k / 40) * w; g.lineTo(x, base - amp * Math.sin((k / 40) * (3 + i) + i * 1.3)); }
      g.lineTo(w, h); g.fill();
    });
    // A house on the middle hill, windows lit at night.
    const hx = w * 0.68, hy = h * 0.66, hw = w * 0.05;
    g.fillStyle = s.lights ? "#0d1426" : "#f3efe6"; g.fillRect(hx, hy, hw, hw * 0.7);
    g.fillStyle = s.lights ? "#1a2238" : "#b5533c"; g.beginPath(); g.moveTo(hx - hw * 0.1, hy); g.lineTo(hx + hw / 2, hy - hw * 0.45); g.lineTo(hx + hw * 1.1, hy); g.fill();
    g.fillStyle = s.lights ? `rgba(255,${200 + 20 * Math.sin(t * 3)},120,.95)` : "#6b8fb0";
    g.fillRect(hx + hw * 0.15, hy + hw * 0.18, hw * 0.25, hw * 0.22); g.fillRect(hx + hw * 0.6, hy + hw * 0.18, hw * 0.25, hw * 0.22);
    // Road with cars passing.
    const ry = h * 0.86;
    g.fillStyle = s.road; g.fillRect(0, ry, w, h * 0.06);
    [[0, 1], [0.45, -1], [0.75, 1]].forEach(([o, dir], i) => {
      let x = (o + p * (1.6 + i * 0.4)) % 1.2 - 0.1; if (dir < 0) x = 1 - x;
      const cx = x * w, cw = w * 0.05, cy = ry + h * (dir > 0 ? 0.008 : 0.03);
      g.fillStyle = ["#e94f37", "#f6f7f8", "#2f6fdb"][i]; g.fillRect(cx, cy, cw, h * 0.022);
      if (s.lights) {
        const fx = dir > 0 ? cx + cw : cx, beam = g.createRadialGradient(fx, cy + h * 0.01, 0, fx, cy + h * 0.01, w * 0.06);
        beam.addColorStop(0, "rgba(255,240,180,.85)"); beam.addColorStop(1, "rgba(255,240,180,0)");
        g.fillStyle = beam; g.fillRect(fx - w * 0.06, cy - w * 0.06, w * 0.12, w * 0.12);
        g.fillStyle = "#ff3b30"; g.fillRect(dir > 0 ? cx : cx + cw - 3, cy + 2, 3, 3);
      }
    });
    if (s.fog) { const f = g.createLinearGradient(0, h * 0.35, 0, h); f.addColorStop(0, "rgba(235,240,245,0)"); f.addColorStop(1, `rgba(235,240,245,${s.fog})`); g.fillStyle = f; g.fillRect(0, 0, w, h); }
  }

  function compareDemo(box) {
    const T = S.compareDemo, COUNTS = [2, 4, 6, 9], KEYS = ["codec", "res", "fps", "size"];
    const COLS = { 2: 2, 4: 2, 6: 3, 9: 3 };
    const still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    let n = 2, ref = 0, big = -1, mode = "grid", sound = 0, wipe = 0.5, playing = !still, t = 4, last = 0, raf = 0, dirty = true;
    let story = null, storyDone = false, timers = [];
    box.classList.add("cw");
    box.innerHTML = `${chrome("", `<div class="cw-tools"><span data-k="cmpf.files"></span>
        <div class="cw-seg" data-counts>${COUNTS.map((k) => `<button data-n="${k}">${k}</button>`).join("")}</div>
        <div class="cw-seg" data-modes><button data-mode="grid" data-k="cmpf.grid"></button><button data-mode="wipe" data-k="cmpf.wipe"></button></div></div>`)}
      <div class="cw-stage">${T.map((f, i) => `
        <div class="cw-tile" data-i="${i}"><canvas style="filter:${f.look}"></canvas>
          <div class="cw-cap top"><b>${f.name}</b><i data-k="cmpf.ref"></i><u><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 6h3l4-3v10l-4-3H2z"/><path d="M11 5.5a3.5 3.5 0 0 1 0 5M12.8 3.5a6 6 0 0 1 0 9" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg></u></div><span class="cw-key">${i + 1}</span><div class="cw-cap bot"></div></div>`).join("")}
        <span class="cw-wline"><b class="cw-knob"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 4L2 8l4 4M10 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg><span data-k="cmpf.knob"></span></b></span></div>
      <div class="cw-bar">
        <button class="cw-play" aria-label="Play / pause"><svg viewBox="0 0 24 24"><path class="i-pause" d="M7 5h3v14H7zM14 5h3v14h-3z"/><path class="i-play" d="M8 5l11 7-11 7z"/></svg></button>
        <span class="cw-tc">00:00:00:00</span><div class="cw-scrub"><i></i></div>
        <div class="cw-sound"><span data-k="cmpf.sound"></span>${T.map((f, i) => `<button data-s="${i}">${String.fromCharCode(65 + i)}</button>`).join("")}<button data-s="-1" data-k="cmpf.off"></button></div>
        <button class="cw-replay" data-replay aria-label="Replay">↻</button>
      </div>
      <div class="cw-hint"></div>
      <svg class="cw-cursor" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3l14 8-6 1.6L10 19z" fill="#fff" stroke="#111" stroke-width="1.4" stroke-linejoin="round"/></svg>`;
    const stage = $(".cw-stage", box), tiles = $$(".cw-tile", box), cans = tiles.map((tl) => $("canvas", tl)), cursor = $(".cw-cursor", box);
    const spec = (f, k) => (k === "fps" ? `${f.fps} fps` : f[k]);

    function layout() {
      if (n !== 2) mode = "grid";
      if (big >= n) big = -1;
      if (ref >= n) ref = 0;
      if (sound >= n) sound = 0;
      box.dataset.n = n;
      box.dataset.mode = mode;
      $(".vd-title", box).textContent = BF.t("cmpf.win").replace("{n}", n);
      stage.style.gridTemplateColumns = `repeat(${COLS[n]}, minmax(0, 1fr))`;
      stage.style.gridTemplateRows = `repeat(${Math.ceil(n / COLS[n])}, minmax(0, 1fr))`;
      stage.classList.toggle("wipe", mode === "wipe");
      stage.classList.toggle("focus", big >= 0 && mode === "grid");
      stage.style.setProperty("--wx", wipe * 100 + "%");
      stage.style.setProperty("--wf", wipe);
      tiles.forEach((tl, i) => {
        const f = T[i];
        tl.hidden = i >= n;
        tl.classList.toggle("ref", n > 2 && i === ref && mode === "grid");
        tl.classList.toggle("big", i === big);
        $(".cw-cap.top i", tl).hidden = !(n > 2 && i === ref);
        $(".cw-cap.top u", tl).hidden = i !== sound;
        // Orange: differs from the reference; on the reference, differs from any shown tile.
        $(".cw-cap.bot", tl).innerHTML = KEYS.map((k) => {
          const d = i === ref ? T.slice(0, n).some((o) => o[k] !== f[k]) : f[k] !== T[ref][k];
          return `<span class="${d ? "d" : "s"}">${spec(f, k)}</span>`;
        }).join("");
      });
      $$("[data-n]", box).forEach((b) => b.setAttribute("aria-pressed", +b.dataset.n === n));
      $$("[data-mode]", box).forEach((b) => b.setAttribute("aria-pressed", b.dataset.mode === mode));
      $("[data-modes]", box).hidden = n !== 2;
      $$("[data-s]", box).forEach((b) => { const s = +b.dataset.s; b.hidden = s >= n; b.setAttribute("aria-pressed", s === sound); });
      box.classList.toggle("paused", !playing);
      $(".cw-hint", box).textContent = BF.t(mode === "wipe" ? "cmpf.drag" : "cmpf.hint");
      sizeCanvases();
      dirty = true;
    }
    function sizeCanvases() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cans.forEach((cv, i) => {
        if (i >= n) return;
        const w = Math.round(cv.clientWidth * dpr), h = Math.round(cv.clientHeight * dpr);
        if (w && (cv.width !== w || cv.height !== h)) { cv.width = w; cv.height = h; dirty = true; }
      });
    }
    // One clock for every tile: the scene at time t, drawn into each shown tile.
    function draw() {
      cans.forEach((cv, i) => {
        if (i >= n || !cv.width || (mode === "grid" && big >= 0 && i !== big)) return;
        drawScene(cv.getContext("2d"), cv.width, cv.height, t, SCENES[T[i].scene]);
      });
    }
    function paintClock() {
      $(".cw-tc", box).textContent = tc(t);
      $(".cw-scrub i", box).style.width = (t / DUR) * 100 + "%";
    }
    function tick(now) {
      raf = requestAnimationFrame(tick);
      if (playing) { t = (t + Math.min(0.1, (now - (last || now)) / 1000)) % DUR; dirty = true; }
      last = now;
      if (dirty) { draw(); paintClock(); dirty = false; }
    }
    const setPlaying = (p) => { playing = p; last = 0; layout(); };
    const seek = (frac) => { t = Math.min(DUR - 0.01, Math.max(0, frac * DUR)); dirty = true; };

    // ---- The short story when the section first shows: side by side, playing; a pointer clicks Wipe; it drags the line.
    const at = (ms, fn) => timers.push(setTimeout(fn, ms));
    const pointTo = (el, dx = 0.5, dy = 0.5) => {
      const b = box.getBoundingClientRect(), r = el.getBoundingClientRect();
      cursor.style.transform = `translate(${r.left - b.left + r.width * dx - 4}px, ${r.top - b.top + r.height * dy - 3}px)`;
    };
    const lineEl = () => $(".cw-wline", box);
    function animateWipe(stops, ms, done) {
      cursor.classList.add("drag");
      const t0 = performance.now(), ease = (x) => (x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2);
      const step = (now) => {
        if (!story) return;
        const k = Math.min(1, (now - t0) / ms), seg = Math.min(stops.length - 2, Math.floor(k * (stops.length - 1)));
        const local = ease(k * (stops.length - 1) - seg);
        wipe = stops[seg] + (stops[seg + 1] - stops[seg]) * local;
        stage.style.setProperty("--wx", wipe * 100 + "%"); stage.style.setProperty("--wf", wipe);
        pointTo(lineEl(), 0.5, 0.5);
        if (k < 1) requestAnimationFrame(step); else done();
      };
      requestAnimationFrame(step);
    }
    function endStory(handOver) {
      timers.forEach(clearTimeout); timers = [];
      story = null; storyDone = true;
      cursor.classList.remove("on", "press", "drag");
      $$(".press", box).forEach((b) => b.classList.remove("press"));
      if (handOver) box.dataset.touched = "1";
    }
    function playStory() {
      endStory(false);
      storyDone = false;
      n = 2; mode = "grid"; big = -1; ref = 0; wipe = 0.5; t = 0; playing = true; last = 0;
      layout();
      if (still) { mode = "wipe"; playing = false; t = 4; layout(); storyDone = true; return; }
      story = {};
      const btn = $('[data-mode="wipe"]', box);
      cursor.classList.add("on");
      pointTo(stage, 0.5, 0.75);
      at(2000, () => pointTo(btn));
      at(2900, () => { cursor.classList.add("press"); btn.classList.add("press"); });
      at(3150, () => {
        cursor.classList.remove("press"); btn.classList.remove("press");
        mode = "wipe"; layout();
        stage.animate([{ opacity: 0.55 }, { opacity: 1 }], { duration: 350, easing: "ease-out" });
      });
      at(3700, () => pointTo(lineEl()));
      at(4400, () => { cursor.classList.add("press");
        animateWipe([0.5, 0.25, 0.75, 0.5], 3000, () => at(250, () => { cursor.classList.remove("press", "drag", "on"); at(400, () => endStory(false)); }));
      });
    }
    // Any real interaction takes over from the story.
    box.addEventListener("pointerdown", (e) => { if (e.isTrusted && story && !e.target.closest("[data-replay]")) endStory(true); }, true);

    $$("[data-n]", box).forEach((b) => b.addEventListener("click", () => { n = +b.dataset.n; big = -1; mode = n === 2 ? "wipe" : "grid"; layout(); }));
    $$("[data-mode]", box).forEach((b) => b.addEventListener("click", () => { mode = b.dataset.mode; big = -1; layout(); }));
    $$("[data-s]", box).forEach((b) => b.addEventListener("click", () => { sound = +b.dataset.s; layout(); }));
    $(".cw-play", box).addEventListener("click", () => setPlaying(!playing));
    $("[data-replay]", box).addEventListener("click", () => playStory());
    $(".cw-scrub", box).addEventListener("pointerdown", (e) => { const r = e.currentTarget.getBoundingClientRect(); seek((e.clientX - r.left) / r.width); });
    tiles.forEach((tl, i) => {
      tl.addEventListener("click", () => { if (mode === "wipe") return; ref = i; layout(); });
      tl.addEventListener("dblclick", () => { if (mode === "wipe") return; big = big === i ? -1 : i; layout(); });
    });
    // Wipe: click or drag anywhere to move the line (mouse and touch).
    const wipeAt = (e) => { const r = stage.getBoundingClientRect(); wipe = Math.min(0.98, Math.max(0.02, (e.clientX - r.left - 6) / (r.width - 12))); layout(); };
    stage.addEventListener("pointerdown", (e) => {
      if (mode !== "wipe") return;
      wipeAt(e);
      const move = (ev) => wipeAt(ev), up = () => { removeEventListener("pointermove", move); removeEventListener("pointerup", up); removeEventListener("pointercancel", up); };
      addEventListener("pointermove", move); addEventListener("pointerup", up); addEventListener("pointercancel", up);
    });
    new ResizeObserver(() => sizeCanvases()).observe(stage);

    function render() {
      $$("[data-k]", box).forEach((el) => (el.textContent = BF.t(el.dataset.k)));
      layout();
    }
    document.addEventListener("langchange", render);
    render();
    if (still) { mode = "wipe"; playing = false; layout(); }
    // Runs only while the section is on screen; the story plays once per page view.
    whenVisible(box, () => {
      last = 0;
      if (!raf) raf = requestAnimationFrame(tick);
      if (!storyDone && !story && box.dataset.touched !== "1") playStory();
    }, () => { cancelAnimationFrame(raf); raf = 0; });
  }

  document.querySelectorAll("[data-player-demo]").forEach(playerDemo);
  document.querySelectorAll("[data-compare-demo]").forEach(compareDemo);
  document.querySelectorAll("[data-filter-demo]").forEach(filterDemo);
  document.querySelectorAll("[data-sort-demo]").forEach(sortDemo);
  document.querySelectorAll("[data-media-demo]").forEach(mediaDemo);
  document.querySelectorAll("[data-bg-demo]").forEach(bgDemo);
  document.querySelectorAll("[data-search-demo]").forEach(searchDemo);
})();
