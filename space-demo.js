// The "Press Space" section: one viewer window that runs through a multi-file selection the way the app does
// (Space on several files: each opens in its own viewer, "3 / 20", ← → move). A tab per kind of file jumps there.
// Every viewer is drawn in HTML / CSS; only the videos, the Lottie and the Rive file are real (small files the page
// already uses). Files and texts come from content.js (spaceDemo, space.*). The mock windows speak English, like the app.
(() => {
  const S = window.SITE, BF = window.BF, D = S.spaceDemo;
  const root = document.querySelector("[data-space-demo]");
  if (!root || !D) return;
  const $ = (sel, el = root) => el.querySelector(sel);
  const $$ = (sel, el = root) => [...el.querySelectorAll(sel)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const files = D.files, N = files.length;
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const tc = (s) => [s / 3600, (s / 60) % 60, s % 60, (s % 1) * 24].map((n) => String(Math.floor(n)).padStart(2, "0")).join(":");
  const PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="i-pause" d="M7 5h3v14H7zM14 5h3v14h-3z"/><path class="i-play" d="M8 5l11 7-11 7z"/></svg>';

  // A playhead that runs from 0 to 1 every `secs` (still at `rest` with reduced motion). Returns stop().
  function playhead(secs, rest, onP) {
    if (reduce) { onP(rest); return () => {}; }
    let raf = 0;
    const t0 = performance.now() - rest * secs * 1000;
    const tick = (now) => { onP(((now - t0) / 1000 / secs) % 1); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }
  // Library scripts (lottie-web, Rive) load once through main.js; a viewer that was left before they arrived does nothing.
  const lib = (src, gone, fn) => BF.loadScript(src).then(() => { if (!gone()) fn(); }).catch(() => {});

  // ---------------------------------------------------------------- the viewers
  const R = {
    // A real player: play / pause, frame steps, timecode, position, speed.
    video: {
      html: (f) => `<div class="sv-stage"><video src="${f.src}" muted loop playsinline preload="auto"></video></div>
        <div class="sv-ctrl"><button class="sv-play" aria-label="Play / pause">${PLAY}</button>
          <button data-step="-1" aria-label="Previous frame">‹</button><span class="sv-tc">00:00:00:00</span><button data-step="1" aria-label="Next frame">›</button>
          <input type="range" min="0" max="1000" value="0" aria-label="Position"><button class="sv-speed" aria-label="Speed">1×</button></div>`,
      start(el) {
        const v = $("video", el), bar = $("input", el), sp = $(".sv-speed", el);
        let raf = 0, held = false;
        const tick = () => {
          $(".sv-tc", el).textContent = tc(v.currentTime || 0);
          if (!held && v.duration) bar.value = Math.round((v.currentTime / v.duration) * 1000);
          el.classList.toggle("paused", v.paused);
          raf = requestAnimationFrame(tick);
        };
        tick();
        const still = () => (v.currentTime = v.duration * 0.3);
        if (reduce) v.readyState >= 1 ? still() : v.addEventListener("loadedmetadata", still, { once: true });
        else v.play().catch(() => {});
        $(".sv-play", el).onclick = () => (v.paused ? v.play().catch(() => {}) : v.pause());
        $$("[data-step]", el).forEach((b) => (b.onclick = () => { v.pause(); v.currentTime = Math.max(0, v.currentTime + b.dataset.step / 24); }));
        bar.oninput = () => { held = true; if (v.duration) v.currentTime = (bar.value / 1000) * v.duration; };
        bar.onchange = () => (held = false);
        sp.onclick = () => { const r = { 1: 2, 2: 0.5, 0.5: 1 }[v.playbackRate] || 1; v.playbackRate = r; sp.textContent = r + "×"; };
        return () => { cancelAnimationFrame(raf); v.pause(); v.removeAttribute("src"); v.load(); };
      },
    },

    // Camera RAW / HEIC: the picture big, the camera and exposure beside it, a histogram.
    raw: {
      html: (f) => {
        const pts = (k, ph) => Array.from({ length: 33 }, (_, i) => `${i * 5},${(60 - 52 * Math.pow(Math.sin((i / 32) * Math.PI), 1.6) * (0.55 + 0.45 * Math.sin(i * k + ph))).toFixed(1)}`).join(" ");
        return `<div class="sv-photo"><img src="${f.img}" alt=""></div>
        <aside class="sv-info"><p class="sv-badge">${/RAW/.test(f.kind) ? "RAW" : "HEIC"}</p>
          <svg class="sv-histo" viewBox="0 0 160 60" preserveAspectRatio="none" aria-hidden="true">
            <polygon points="0,60 ${pts(0.45, 0)} 160,60" fill="#ff4d4d"/><polygon points="0,60 ${pts(0.38, 1.4)} 160,60" fill="#3ddc84"/><polygon points="0,60 ${pts(0.5, 2.6)} 160,60" fill="#4d8dff"/></svg>
          <dl>${f.info.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("")}</dl></aside>`;
      },
    },

    // Photoshop: the picture from its layers, with an eye per layer.
    psd: {
      html: (f) => {
        const L = [["title", "Title", "T"], ["date", "Date", "T"], ["glow", "Glow", "◐"], ["photo", "Photo", "▣"], ["bg", "Background", "▢"]];
        return `<div class="sv-art"><div class="sv-poster"><div class="sv-l-bg"></div><div class="sv-l-photo" style="background-image:url('${f.img}')"></div><div class="sv-l-glow"></div>
          <div class="sv-l-title">SUMMER<br>REEL 26</div><div class="sv-l-date">12 · 07 · ROOFTOP</div></div></div>
        <aside class="sv-layers"><p>Layers</p>${L.map(([id, n, ic]) => `<button aria-pressed="true" data-l="${id}" ><span class="sv-eye" aria-hidden="true"></span><i aria-hidden="true">${ic}</i>${n}</button>`).join("")}</aside>`;
      },
      start(el) {
        $$("[data-l]", el).forEach((b) => (b.onclick = () => {
          const on = b.getAttribute("aria-pressed") !== "true";
          b.setAttribute("aria-pressed", on);
          $(".sv-l-" + b.dataset.l, el).classList.toggle("off", !on);
        }));
      },
    },

    // Figma: the file's frames on its canvas.
    figma: {
      html: () => {
        const frame = (n, body) => `<figure><figcaption>${n}</figcaption><div class="sv-phone">${body}</div></figure>`;
        return `<aside class="sv-fig-side"><p>Pages</p><span class="on">Mobile</span><span>Components</span><p>Frames</p><span>Home</span><span>Player</span><span>Settings</span></aside>
        <div class="sv-fig">${frame("Home", '<b class="h"></b><i class="hero"></i><i class="row"></i><i class="row"></i><i class="row s"></i>')}
          ${frame("Player", '<i class="cover"></i><b class="h c"></b><i class="scrub"></i><span class="btns"><i></i><i class="big"></i><i></i></span>')}
          ${frame("Settings", '<b class="h"></b><i class="sw"></i><i class="sw"></i><i class="sw off"></i><i class="row s"></i>')}</div>`;
      },
    },

    // Affinity: the picture plus what the document holds.
    affinity: {
      html: () => `<div class="sv-aff-art"><span class="sv-logo" aria-hidden="true"><i></i><i></i><i></i></span><b>NORTH</b></div>
        <aside class="sv-info"><p class="sv-badge">Affinity</p><dl>
          <dt>App</dt><dd>Affinity Designer 2.5</dd><dt>Author</dt><dd>Studio North</dd><dt>Colour</dt><dd>sRGB IEC61966-2.1</dd>
          <dt>Fonts</dt><dd>Inter, Recoleta</dd><dt>Layers</dt><dd>14</dd><dt>Linked</dt><dd>2 found · <em>1 missing</em></dd></dl></aside>`,
    },

    // PDF: pages down the side, one page big.
    pdf: {
      pages: ["Our story", "Colour", "Type", "Photography"],
      html(f) {
        return `<aside class="sv-pages">${this.pages.map((p, i) => `<button data-p="${i}" aria-label="Page ${i + 1}"><i></i><i></i><i></i><span>${i + 1}</span></button>`).join("")}</aside>
        <div class="sv-paper"><div class="sv-page"><small>BRAND BOOK</small><h4></h4><div class="sv-pimg" style="background-image:url('${f.img}')"></div><i></i><i></i><i class="s"></i><i></i></div></div>
        <span class="sv-pgno"></span>`;
      },
      start(el) {
        const show = (i) => {
          $$("[data-p]", el).forEach((b) => b.setAttribute("aria-current", +b.dataset.p === i));
          $("h4", el).textContent = R.pdf.pages[i];
          $(".sv-pimg", el).style.filter = `hue-rotate(${i * 70}deg)`;
          $(".sv-pgno", el).textContent = `Page ${i + 1} of 24`;
        };
        $$("[data-p]", el).forEach((b) => (b.onclick = () => show(+b.dataset.p)));
        show(1);
      },
    },

    // Lottie: the 0.320 player (play / pause, scrub with frame, speed, background).
    lottie: {
      html: () => `<div class="sv-stage sv-checker"><div class="sv-anim"></div></div>
        <div class="sv-ctrl"><button class="sv-play" aria-label="Play / pause">${PLAY}</button>
          <input type="range" min="0" max="100" value="0" aria-label="Frame"><span class="sv-tc">0 / 0</span>
          <button class="sv-speed" aria-label="Speed">1×</button><button class="sv-bgb" aria-label="Background">▦</button></div>`,
      start(el, f) {
        let anim = null, gone = false, held = false;
        const sync = () => el.classList.toggle("paused", !anim || anim.isPaused);
        const bar = $("input", el), stage = $(".sv-stage", el), BGS = ["sv-checker", "sv-darkbg", "sv-lightbg"];
        lib(BF.LOTTIE, () => gone, () => {
          anim = window.lottie.loadAnimation({ container: $(".sv-anim", el), renderer: "svg", loop: true, autoplay: !reduce, path: f.src });
          anim.addEventListener("DOMLoaded", () => { bar.max = Math.round(anim.totalFrames - 1); if (reduce) anim.goToAndStop(20, true); });
          anim.addEventListener("enterFrame", () => {
            sync();
            if (!held) bar.value = Math.round(anim.currentFrame);
            $(".sv-tc", el).textContent = `${Math.round(anim.currentFrame)} / ${Math.round(anim.totalFrames)}`;
          });
          sync();
          $(".sv-play", el).onclick = () => { anim.isPaused ? anim.play() : anim.pause(); sync(); };
          bar.oninput = () => { held = true; anim.goToAndStop(+bar.value, true); sync(); };
          bar.onchange = () => (held = false);
          const sp = $(".sv-speed", el);
          sp.onclick = () => { const r = { 1: 2, 2: 4, 4: 0.25, 0.25: 0.5, 0.5: 1 }[anim.playSpeed] || 1; anim.setSpeed(r); sp.textContent = r + "×"; };
        });
        $(".sv-bgb", el).onclick = () => { const i = BGS.findIndex((c) => stage.classList.contains(c)); stage.classList.replace(BGS[i], BGS[(i + 1) % 3]); };
        return () => { gone = true; anim?.destroy(); };
      },
    },

    // Rive: plays its state machine and answers the mouse.
    rive: {
      html: () => `<div class="sv-stage sv-rive"><canvas></canvas></div><div class="sv-ctrl sv-note"><span>State machine: <b class="sv-sm">…</b></span><span>Move and click on it</span></div>`,
      start(el, f) {
        let r = null, gone = false;
        const canvas = $("canvas", el), stage = $(".sv-stage", el);
        const fit = () => { const b = stage.getBoundingClientRect(); canvas.width = b.width * devicePixelRatio; canvas.height = b.height * devicePixelRatio; r?.resizeDrawingSurfaceToCanvas(); };
        fit();
        const ro = new ResizeObserver(fit);
        ro.observe(stage);
        lib(BF.RIVE, () => gone, () => {
          const Rv = window.rive;
          r = new Rv.Rive({
            src: f.src, canvas, autoplay: false,
            layout: new Rv.Layout({ fit: Rv.Fit.Contain, alignment: Rv.Alignment.Center }),
            onLoad: () => {
              const sm = r.stateMachineNames || [];
              $(".sv-sm", el).textContent = sm[0] || "none";
              if (sm.length) r.play(sm[0]); else r.play();
              if (reduce) setTimeout(() => r?.pause(), 600);
              r.resizeDrawingSurfaceToCanvas();
            },
          });
        });
        return () => { gone = true; ro.disconnect(); r?.cleanup(); };
      },
    },

    // 3D: a model you can turn by dragging (a shaded box stands in for it).
    model: {
      html: () => `<div class="sv-3d" role="img" aria-label="3D model, drag to turn"><div class="sv-cube">${["front", "back", "right", "left", "top", "bottom"].map((s) => `<i class="${s}"></i>`).join("")}</div><div class="sv-floor"></div></div>
        <div class="sv-ctrl sv-note"><span>Drag to turn</span><span>12,480 triangles · 3 materials · 1 animation</span></div>`,
      start(el) {
        const cube = $(".sv-cube", el), box = $(".sv-3d", el);
        let a = -30, t = -18, drag = null, raf = 0;
        const draw = () => (cube.style.transform = `rotateX(${t}deg) rotateY(${a}deg)`);
        const spin = () => { if (!drag) a += 0.35; draw(); raf = requestAnimationFrame(spin); };
        if (reduce) draw(); else spin();
        box.onpointerdown = (e) => { drag = { x: e.clientX, y: e.clientY, a, t }; box.setPointerCapture(e.pointerId); };
        box.onpointermove = (e) => { if (!drag) return; a = drag.a + (e.clientX - drag.x) * 0.5; t = Math.max(-80, Math.min(80, drag.t - (e.clientY - drag.y) * 0.5)); draw(); };
        box.onpointerup = box.onpointercancel = () => (drag = null);
        return () => cancelAnimationFrame(raf);
      },
    },

    // After Effects: comps, a sketch of the frame at the playhead, the timeline with keyframes, sound.
    aep: {
      html: () => {
        const rows = [["Name Bar", 4, 70, [4, 14]], ["Jane Doe", 10, 64, [10, 22]], ["Director", 16, 58, [16, 28]], ["Logo Pop", 30, 40, [30, 38, 46]]];
        return `<aside class="sv-comps"><p>Compositions</p><span class="on">Lower Third</span><span>Name Bar</span><span>Logo Pop</span><small>1920×1080 · 25 fps · 0:00:08:00</small></aside>
        <div class="sv-frame sv-ae-frame"><div class="sv-sketch"><i class="bar"></i><b>Jane Doe</b><small>Director</small><span class="logo"></span></div><span class="sv-tag">Frame sketch</span></div>
        <div class="sv-tl">${rows.map(([n, s, w, k]) => `<div class="sv-row"><span>${n}</span><div><i style="left:${s}%;width:${w}%"></i>${k.map((x) => `<u style="left:${x}%"></u>`).join("")}</div></div>`).join("")}
          <div class="sv-row sv-sound"><span>♪ Whoosh.wav</span><div><i style="left:2%;width:50%"></i></div></div><b class="sv-ph"></b><span class="sv-tc">00:00:00:00</span></div>`;
      },
      start(el) {
        const sk = $(".sv-sketch", el), ph = $(".sv-ph", el), out = $(".sv-tc", el);
        return playhead(8, 0.42, (p) => {
          ph.style.left = `calc(var(--name-w) + (100% - var(--name-w)) * ${p})`;
          sk.style.setProperty("--a", Math.min(1, Math.max(0, (p - 0.04) / 0.2)));
          sk.style.setProperty("--b", Math.min(1, Math.max(0, (p - 0.3) / 0.12)));
          out.textContent = tc(p * 8);
        });
      },
    },

    // Premiere / Resolve / Final Cut: media, the frame at the playhead, the timeline.
    timeline: {
      apps: {
        premiere: { label: "Premiere Pro", tracks: ["V2", "V1", "A1", "A2"] },
        resolve: { label: "DaVinci Resolve", tracks: ["V2", "V1", "A1", "A2"] },
        fcp: { label: "Final Cut Pro", tracks: ["Titles", "Storyline", "Music", "Sound"] },
      },
      clips: [
        [1, 0, 34, "sunset"], [1, 34, 30, "countdown"], [1, 64, 36, "ball"],
        [0, 22, 20, "title"], [0, 70, 18, "title"], [2, 0, 100, "audio"], [3, 30, 26, "audio"], [3, 66, 16, "audio"],
      ],
      html(f) {
        const A = this.apps[f.app];
        return `<aside class="sv-bin"><p>Media</p>${["sunset", "countdown", "ball"].map((m) => `<span><i style="background-image:url('assets/demo/thumbs/${m}.jpg')"></i>${m[0].toUpperCase() + m.slice(1)}.mov</span>`).join("")}<span><i class="aud"></i>Music.wav</span></aside>
        <div class="sv-frame"><img alt=""><span class="sv-tag">${A.label}</span></div>
        <div class="sv-tl sv-nle">${A.tracks.map((tn, ti) => `<div class="sv-row"><span>${tn}</span><div>${this.clips.filter((c) => c[0] === ti).map(([, s, w, k]) =>
          `<i class="c-${k}" style="left:${s}%;width:${w}%;${/sunset|countdown|ball/.test(k) ? `background-image:url('assets/demo/thumbs/${k}.jpg')` : ""}">${k === "title" ? "Title" : ""}</i>`).join("")}</div></div>`).join("")}
          <b class="sv-ph"></b><span class="sv-tc">00:00:00:00</span></div>`;
      },
      start(el, f) {
        const img = $(".sv-frame img", el), ph = $(".sv-ph", el), out = $(".sv-tc", el);
        el.classList.add("sv-app-" + f.app);
        let cur = "";
        return playhead(12, 0.2, (p) => {
          ph.style.left = `calc(var(--name-w) + (100% - var(--name-w)) * ${p})`;
          const c = this.clips.find(([tr, s, w]) => tr === 1 && p * 100 >= s && p * 100 < s + w);
          const want = `assets/demo/big/${c ? c[3] : "sunset"}.jpg`;
          if (want !== cur) img.src = cur = want;
          out.textContent = tc(p * 24);
        });
      },
    },

    // Motion Graphics Template: preview, Play / Open in After Effects Viewer, its editable fields.
    mogrt: {
      html: (f) => `<div class="sv-frame sv-tpl-prev"><img src="${f.img}" alt=""><div class="sv-lt"><i></i><b>Jane Doe</b><small>Director</small></div></div>
        <aside class="sv-card"><b>Title_Pack.mogrt</b><small>After Effects · 1920×1080 · 0:10</small>
          <div class="sv-btns"><button class="sv-tplay">▶ Play</button><button>Open in After Effects Viewer</button></div>
          <dl><dt>Name</dt><dd><span class="sv-field">Jane Doe</span></dd><dt>Title</dt><dd><span class="sv-field">Director</span></dd>
          <dt>Accent</dt><dd><span class="sv-sw"></span>#FF7A1A</dd><dt>Logo</dt><dd>☑ On</dd></dl></aside>`,
      start(el) {
        const lt = $(".sv-lt", el);
        const play = () => { lt.classList.remove("go"); void lt.offsetWidth; lt.classList.add("go"); };
        $(".sv-tplay", el).onclick = play;
        if (!reduce) play();
      },
    },

    // Resolve .drfx: the pack's templates, a still drawn from the Text+ layers, the Inspector controls.
    drfx: {
      items: [["Titles", "Glitch Title", "GLITCH"], ["Titles", "Neon Title", "NEON"], ["Effects", "RGB Split", "SPLIT"], ["Transitions", "Slide Glitch", "SLIDE"]],
      html() {
        let last = "";
        return `<aside class="sv-pack">${this.items.map(([g, n], i) => `${g !== last ? `<p>${(last = g)}</p>` : ""}<button data-t="${i}">${n}</button>`).join("")}</aside>
        <div class="sv-frame sv-still"><b></b><span class="sv-tag">Text+ still</span></div>
        <aside class="sv-insp"><p>Inspector</p><label>Text<span class="sv-field sv-tx"></span></label><label>Font<span class="sv-field">Montserrat Black</span></label>
          <label>Size<span class="sv-slider"><i style="width:62%"></i></span></label><label>Glitch<span class="sv-slider"><i style="width:35%"></i></span></label>
          <label>Colour<span class="sv-sw"></span></label></aside>`;
      },
      start(el) {
        const show = (i) => {
          const [, , word] = R.drfx.items[i];
          $$("[data-t]", el).forEach((b) => b.setAttribute("aria-current", +b.dataset.t === i));
          $(".sv-still b", el).textContent = word;
          $(".sv-still", el).dataset.look = i;
          $(".sv-tx", el).textContent = word;
        };
        $$("[data-t]", el).forEach((b) => (b.onclick = () => show(+b.dataset.t)));
        show(0);
      },
    },

    // Code card (0.319): window dots, name, language, line numbers, syntax colours, Copy.
    code: {
      src: `import subprocess
from pathlib import Path

FPS = 24

def export_frames(src: Path, every: int = 12) -> int:
    """Save one still every few frames, next to the clip."""
    out = src.with_suffix("")
    out.mkdir(exist_ok=True)
    # one picture every \`every\` frames
    cmd = ["ffmpeg", "-i", str(src),
           "-vf", f"fps={FPS / every}",
           str(out / "%04d.png")]
    subprocess.run(cmd, check=True)
    return len(list(out.glob("*.png")))

if __name__ == "__main__":
    print(export_frames(Path("Promo_v3.mov")), "stills")`,
      html() {
        const hl = (line) => esc(line).replace(/("""[^"]*"""|f?"[^"]*"|#.*$|\b\d+\b|\b(?:import|from|def|return|if|for|in|not|True|None)\b|\b[A-Za-z_]\w*(?=\())/g, (m) =>
          `<span class="${m[0] === "#" ? "cm" : /^f?"/.test(m) ? "st" : /^\d/.test(m) ? "nu" : /^(import|from|def|return|if|for|in|not|True|None)$/.test(m) ? "kw" : "fn"}">${m}</span>`);
        return `<div class="sv-codebg"><div class="sv-codecard"><div class="sv-cchrome"><i></i><i></i><i></i><span>export_frames.py</span><em>Python</em></div>
          <ol>${this.src.split("\n").map((l) => `<li>${hl(l) || " "}</li>`).join("")}</ol></div></div>
          <div class="sv-ctrl sv-note"><span>Theme: Auto · Background: Sunset</span><span class="sv-btns"><button class="sv-copy">Copy</button><button>Copy Image</button></span></div>`;
      },
      start(el) {
        const b = $(".sv-copy", el);
        b.onclick = () => navigator.clipboard?.writeText(R.code.src).then(() => { b.textContent = "Copied"; setTimeout(() => (b.textContent = "Copy"), 1400); }, () => {});
      },
    },

    // Archive: what's inside, without extracting.
    archive: {
      html: () => {
        const row = (n, s, kids) => kids ? `<details${/Footage|Graphics/.test(n) ? " open" : ""}><summary><span>📁 ${n}</span><small>${s}</small></summary>${kids}</details>` : `<p><span>${n}</span><small>${s}</small></p>`;
        return `<div class="sv-arc"><header><b>Delivery_Final.zip</b><span>248 items · 1.2 GB · not extracted</span><button>Browse</button></header>
          ${row("Footage", "6 items · 1.1 GB", row("🎬 A001_C003.mov", "412 MB") + row("🎬 A001_C007.mov", "388 MB") + row("🎬 Drone_04.mp4", "296 MB"))}
          ${row("Graphics", "238 items · 64 MB", row("🎨 Lower_Third.aep", "18 MB") + row("✨ Logo_Sting.json", "84 KB") + row("🖼 Poster_v3.psd", "42 MB"))}
          ${row("Audio", "3 items · 22 MB", row("🎵 Music_Final.wav", "19 MB"))}
          ${row("📄 README.txt", "2 KB")}</div>`;
      },
    },
  };

  // ---------------------------------------------------------------- the window and the run through the files
  const dark = root.hasAttribute("data-dark");
  root.innerHTML = `
    <div class="sp-tabs" role="tablist">${D.groups.map((g) => `<button role="tab" id="sp-tab-${g.id}" data-g="${g.id}" aria-controls="sp-win"><span aria-hidden="true">${g.icon}</span><b data-k="space.${g.id}"></b></button>`).join("")}</div>
    <p class="sp-sr" id="sp-how" data-k="space.window"></p>
    <div class="vd sv${dark ? " vd-dark" : ""}" id="sp-win" role="tabpanel" tabindex="0" aria-describedby="sp-how">
      <div class="vd-chrome"><i></i><i></i><i></i><span class="vd-title sv-name"></span><span class="sv-kind"></span></div>
      <div class="sv-view"></div>
      <div class="sv-run"><button class="sv-prev" data-k-label="space.prev">‹</button><span class="sv-count" aria-live="off"></span><button class="sv-next" data-k-label="space.next">›</button>
        <span class="sv-dots" aria-hidden="true">${files.map((f, i) => `<i data-i="${i}" title="${f.name}"></i>`).join("")}</span><span class="sv-hint" data-k="space.try"></span></div>
    </div>
    <div class="sp-cap"><p class="sp-desc"></p><p class="sp-fmt"></p><p class="sp-where" data-k="space.where"></p></div>`;

  const win = $("#sp-win"), view = $(".sv-view"), count = $(".sv-count");
  const key = document.querySelector("[data-space-key]");
  let at = 0, stop = null, auto = null, user = false, onScreen = false;

  function texts() {
    $$("[data-k]").forEach((el) => (el.textContent = BF.t(el.dataset.k)));
    $$("[data-k-label]").forEach((el) => el.setAttribute("aria-label", BF.t(el.dataset.kLabel)));
    $(".sp-tabs").setAttribute("aria-label", BF.t("space.kinds"));
    if (key) key.setAttribute("aria-label", `Space: ${BF.t("space.key")}`);
    const g = files[at].g;
    $(".sp-desc").textContent = BF.t(`space.${g}.d`);
    $(".sp-fmt").textContent = BF.t(`space.${g}.f`);
  }

  // Draw the current file's viewer afresh (started only while on screen).
  function render() {
    stop?.();
    stop = null;
    const f = files[at];
    view.className = `sv-view sv-${f.view}`;
    view.innerHTML = R[f.view].html(f);
    if (onScreen) stop = R[f.view].start?.call(R[f.view], view, f) || null;
  }

  function go(i) {
    // keep keyboard focus in the window when the control that had it is about to be replaced
    const inside = view.contains(document.activeElement);
    at = (i + N) % N;
    const f = files[at];
    $(".sv-name").textContent = f.name;
    $(".sv-kind").textContent = f.kind;
    count.textContent = `${at + 1} / ${N}`;
    render();
    if (inside) win.focus({ preventScroll: true });
    $$("[role=tab]").forEach((b) => {
      const on = b.dataset.g === f.g;
      b.setAttribute("aria-selected", on);
      b.tabIndex = on ? 0 : -1;
    });
    win.setAttribute("aria-labelledby", `sp-tab-${f.g}`);
    $$(".sv-dots i").forEach((d, k) => d.classList.toggle("on", k === at));
    texts();
  }

  // Anything the visitor does stops the automatic run and lets the count speak to screen readers.
  function took() {
    if (user) return;
    user = true;
    clearInterval(auto);
    auto = null;
    count.setAttribute("aria-live", "polite");
  }
  function press() {
    if (!key || reduce) return;
    key.classList.remove("down");
    void key.offsetWidth;
    key.classList.add("down");
  }
  const step = (d) => { press(); go(at + d); };

  root.addEventListener("pointerdown", took);
  root.addEventListener("keydown", took);
  root.addEventListener("focusin", took);
  key?.addEventListener("focus", took);
  $(".sv-prev").onclick = () => step(-1);
  $(".sv-next").onclick = () => step(1);
  $$(".sv-dots i").forEach((d) => (d.onclick = () => go(+d.dataset.i)));
  key?.addEventListener("click", () => { took(); step(1); win.focus({ preventScroll: true }); });

  // Tabs: click, or arrows / Home / End when a tab has focus (it opens that kind's first file).
  const tabs = $$("[role=tab]");
  const first = (g) => files.findIndex((f) => f.g === g);
  tabs.forEach((b, i) => {
    b.onclick = () => { if (files[at].g !== b.dataset.g) go(first(b.dataset.g)); };
    b.onkeydown = (e) => {
      const j = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (j == null) return;
      e.preventDefault();
      const t = tabs[(j + tabs.length) % tabs.length];
      go(first(t.dataset.g));
      t.focus();
    };
  });

  // In the window (not on one of its own buttons or sliders): Space / → / Page Down next, ← / Page Up previous.
  win.addEventListener("keydown", (e) => {
    const own = e.target !== win && !e.target.closest(".sv-run") && e.target.closest("button, input, summary, canvas");
    const d = { " ": 1, ArrowRight: 1, PageDown: 1, ArrowLeft: -1, PageUp: -1 }[e.key];
    if (!d || e.metaKey || e.ctrlKey || e.altKey || (own && (e.target.matches("input") || !/Page/.test(e.key)))) return;
    if (e.key === " " && e.target.closest(".sv-run button")) return;   // Space presses the focused ‹ › button
    e.preventDefault();
    step(d);
  });

  // Run through the files by itself while on screen, until the visitor takes over. Off screen, viewers stop.
  const wake = () => { if (!stop && onScreen) stop = R[files[at].view].start?.call(R[files[at].view], view, files[at]) || null; };
  const startAuto = () => { if (!user && !reduce && !auto && onScreen && !document.hidden) auto = setInterval(() => step(1), 5200); };
  const stopAuto = () => { clearInterval(auto); auto = null; };
  document.addEventListener("visibilitychange", () => (document.hidden ? stopAuto() : startAuto()));
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      if (onScreen) {
        wake();
        startAuto();
      } else {
        stopAuto();
        render();   // fresh viewer, started again when it comes back
      }
    }, { threshold: 0.3 }).observe(win);
  } else onScreen = true;

  document.addEventListener("langchange", texts);
  go(0);
})();
