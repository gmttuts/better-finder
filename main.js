// Shared by every design (index.html = A, b.html = B). Fills the page from content.js and data/changelog.js.
// A page only needs the data-* hooks it uses; missing sections are skipped.
(() => {
  const S = window.SITE;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const each = (sel, fn) => $$(sel).forEach(fn);

  // ---------- Language: English unless the browser's main language is Vietnamese or the visitor is in Vietnam (time zone) ----------
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} },
  };
  function detectLang() {
    const first = (navigator.languages && navigator.languages[0]) || navigator.language || "";
    if (/^vi\b/i.test(first)) return "vi";
    let tz = "";
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch {}
    return /^Asia\/(Ho_Chi_Minh|Saigon)$/.test(tz) ? "vi" : "en";
  }
  const urlLang = new URLSearchParams(location.search).get("lang");
  let lang = urlLang || store.get("bf.lang") || detectLang();
  if (!["en", "vi"].includes(lang)) lang = "en";
  const t = (key) => (S.text[key] || {})[lang] ?? (S.text[key] || {}).en ?? key;
  const tv = (v) => (v && typeof v === "object" ? v[lang] ?? v.en : v);

  function applyLang() {
    document.documentElement.lang = lang;
    each("[data-i18n]", (el) => { el.innerHTML = t(el.dataset.i18n); });
    each("[data-lang]", (b) => b.setAttribute("aria-pressed", b.dataset.lang === lang));
    each("[data-requires]", (el) => { el.textContent = `${tv(S.download.requires)} · ${S.download.size}`; });
    each(".shot-missing span", (el) => { el.textContent = t("shot.missing"); });
    renderFeatures();
    renderViewDesc();
    renderReleases();
    renderCompare();
    renderDemoHints();
    window.BF.lang = lang;
    document.dispatchEvent(new CustomEvent("langchange", { detail: lang }));
  }
  each("[data-lang]", (b) => b.addEventListener("click", () => {
    lang = b.dataset.lang; store.set("bf.lang", lang); applyLang();
  }));
  // For views-demo.js / feature-demos.js (loaded after this file).
  window.BF = { t, lang };

  // ---------- Download + version + stats ----------
  each("[data-download]", (a) => { a.href = S.download.file; a.setAttribute("download", ""); });
  each("[data-version]", (el) => { el.textContent = "v" + S.download.version; });
  each("[data-year]", (el) => { el.textContent = new Date().getFullYear(); });

  // ---------- Screenshots / screen recordings (placeholder when the file isn't there yet) ----------
  function placeholder(name) {
    const file = (S.screenshots[name] || name).split("/").pop();
    const tiles = Array.from({ length: 12 }, (_, i) => `<i style="--h:${(i * 37) % 360}"></i>`).join("");
    return `<div class="shot-missing"><div class="fake-side"><b></b><b></b><b></b><b></b><b></b></div>
      <div class="fake-grid">${tiles}</div><p><span>${t("shot.missing")}</span> · <code>${file}</code></p></div>`;
  }
  function setShot(fig, name) {
    fig.dataset.shot = name;
    fig.innerHTML = fig.hasAttribute("data-bare") ? "" : `<div class="chrome"><i></i><i></i><i></i></div>`;
    const src = S.screenshots[name];
    const missing = () => fig.insertAdjacentHTML("beforeend", placeholder(name));
    if (!src) return missing();
    if (/\.(mp4|webm|mov)$/i.test(src)) {
      const v = Object.assign(document.createElement("video"), { src, muted: true, loop: true, autoplay: true, playsInline: true });
      v.onloadeddata = () => fig.appendChild(v);
      v.onerror = missing;
      return;
    }
    const img = new Image();
    img.alt = name;
    img.onload = () => fig.appendChild(img);
    img.onerror = missing;
    img.src = src;
  }
  each("[data-shot]", (fig) => setShot(fig, fig.dataset.shot));

  // ---------- Views: the animated window lives in views-demo.js; this keeps the description in sync ----------
  let view = "list";
  function renderViewDesc() { const el = $("[data-view-desc]"); if (el) el.textContent = t(`views.${view}.d`); }
  document.addEventListener("viewchange", (e) => { view = e.detail; renderViewDesc(); });

  // ---------- Features ----------
  function renderFeatures() {
    each("[data-features]", (box) => {
      box.innerHTML = S.features.map((f) => {
        const [title, body] = f[lang] || f.en;
        return `<article class="feature"><span class="ficon">${f.icon}</span><h3>${title}</h3><p>${body}</p></article>`;
      }).join("");
    });
  }

  // ---------- Better Finder vs Finder ----------
  function cell(v) {
    if (v === true) return `<span class="yes" aria-label="yes">✓</span>`;
    if (v === false) return `<span class="no" aria-label="no">✕</span>`;
    return `<span class="txt">${tv(v)}</span>`;
  }
  function renderCompare() {
    each("[data-compare]", (tb) => {
      tb.innerHTML = S.compare.map((r) => `<tr><th scope="row">${t(r.row)}</th><td class="bf">${cell(r.bf)}</td><td>${cell(r.finder)}</td></tr>`).join("");
    });
  }

  // ---------- What's new (only versions you can actually download) ----------
  const vkey = (v) => v.split(".").map(Number);
  const cmp = (a, b) => { const x = vkey(a), y = vkey(b); for (let i = 0; i < Math.max(x.length, y.length); i++) { const d = (x[i] || 0) - (y[i] || 0); if (d) return d; } return 0; };
  const releases = (window.CHANGELOG || []).filter((r) => cmp(r.version, S.download.version) <= 0);
  // App notes may use long dashes; the site avoids them.
  const tidy = (s) => s.replace(/\s+—\s+/g, "; ").replace(/—/g, ", ");
  function renderReleases() {
    const box = $("[data-releases]");
    if (!box) return;
    box.innerHTML = releases.map((r) => `
      <li><div class="rel-head"><span class="rel-v">${r.version}</span><h3>${tidy(r.title)}</h3><time>${r.date}</time></div>
      <ul>${r.notes.map((n) => `<li>${tidy(n)}</li>`).join("")}</ul></li>`).join("");
  }
  // The release notes open in a pop-up from the footer (and the nav link).
  const relModal = $("[data-releases-modal]");
  each("[data-releases-open]", (a) => a.addEventListener("click", (e) => {
    e.preventDefault();
    if (!relModal) return;
    relModal.showModal ? relModal.showModal() : relModal.setAttribute("open", "");
    $("[data-releases]", relModal).scrollTop = 0;
  }));
  relModal?.addEventListener("click", (e) => { if (e.target === relModal || e.target.closest("[data-close]")) relModal.close(); });

  // ---------- Copy buttons ----------
  each("[data-copy]", (b) => b.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(b.previousElementSibling.textContent); } catch { return; }
    b.textContent = t("install.copied");
    setTimeout(() => { b.textContent = t("install.copy"); }, 1400);
  }));

  // ---------- Support the author (QR modal) ----------
  const modal = $("[data-support-modal]");
  // which = "bmc", "momo" or "both" (both QR codes side by side).
  function openSupport(which) {
    if (!modal) return;
    const keys = which === "both" ? Object.keys(S.support) : [which];
    $("[data-support-title]", modal).textContent = which === "both" ? t("support.title.both") : t("support." + which);
    modal.classList.toggle("both", keys.length > 1);
    $("[data-support-qr]", modal).innerHTML = keys.map((k) => {
      const cfg = S.support[k];
      return `<div class="qr-card">${keys.length > 1 ? `<b>${t("support." + k)}</b>` : ""}
        <div class="qr"><img src="${cfg.qr}" alt="${t("support." + k)} QR" onerror="this.outerHTML='<div class=qr-missing>${t("support.noqr")}</div>'"></div>
        ${cfg.url ? `<a class="btn btn-small" href="${cfg.url}" target="_blank" rel="noopener">${t("support.open")}</a>` : ""}</div>`;
    }).join("");
    modal.showModal ? modal.showModal() : modal.setAttribute("open", "");
  }
  each("[data-support]", (b) => b.addEventListener("click", () => openSupport(b.dataset.support)));
  // Support pages always open in a new tab/window.
  modal?.addEventListener("click", (e) => {
    const a = e.target.closest("a[href^='http']");
    if (!a) return;
    e.preventDefault();
    window.open(a.href, "_blank", "noopener");
  });
  modal?.addEventListener("click", (e) => { if (e.target === modal || e.target.closest("[data-close]")) modal.close(); });

  // ---------- Hover demo with real files ----------
  const loadScript = (src) => new Promise((ok, fail) => {
    const s = Object.assign(document.createElement("script"), { src, onload: ok, onerror: fail });
    document.head.appendChild(s);
  });
  const LOTTIE = "https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie_light.min.js";
  const RIVE = "https://cdn.jsdelivr.net/npm/@rive-app/canvas@2.40.0/rive.js";
  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}:${String(Math.floor((s % 1) * 24)).padStart(2, "0")}`;

  function renderDemoHints() {
    each(".demo-tile", (tile) => { $(".hint", tile).textContent = t(tile.dataset.hint); });
  }

  function buildDemo(box) {
    box.innerHTML = S.demo.map((d, i) => `
      <figure class="demo-tile kind-${d.kind}" data-i="${i}" data-hint="${d.hint || "demo.hint." + d.kind}">
        <div class="stage"><span class="ext">${d.ext}</span><span class="bar"><i></i></span><span class="tc"></span></div>
        <figcaption><span class="name">${d.name}</span><span class="hint"></span></figcaption>
      </figure>`).join("");
    renderDemoHints();
    $$(".demo-tile", box).forEach((tile) => {
      const d = S.demo[tile.dataset.i];
      const stage = $(".stage", tile);
      ({ video: setupVideo, lottie: setupLottie, rive: setupRive, gif: setupGif })[d.kind](d, stage, tile);
    });
  }

  function progress(stage, p, label) {
    stage.style.setProperty("--p", Math.min(1, Math.max(0, p)));
    if (label != null) $(".tc", stage).textContent = label;
  }
  const xOf = (e, el) => { const r = el.getBoundingClientRect(); return Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)); };

  function setupVideo(d, stage) {
    const v = Object.assign(document.createElement("video"), { src: d.src, muted: true, playsInline: true, preload: "auto" });
    stage.prepend(v);
    // Seek to the newest pointer position, one seek at a time; never get stuck if a "seeked" event is missed.
    let want = null, seeking = false, guard = 0;
    const seek = () => {
      if (want == null || seeking || !v.duration) return;
      seeking = true;
      v.currentTime = Math.min(v.duration - 0.05, want * v.duration);
      want = null;
      clearTimeout(guard);
      guard = setTimeout(() => { seeking = false; seek(); }, 250);
    };
    v.addEventListener("seeked", () => { clearTimeout(guard); seeking = false; seek(); });
    v.addEventListener("loadedmetadata", () => { v.currentTime = v.duration * 0.25; progress(stage, 0.25, fmt(v.duration * 0.25)); });
    stage.addEventListener("pointermove", (e) => {
      const p = xOf(e, stage);
      want = p; progress(stage, p, v.duration ? fmt(p * v.duration) : ""); seek();
    });
  }

  function setupLottie(d, stage) {
    const host = document.createElement("div");
    host.className = "anim";
    stage.prepend(host);
    loadScript(LOTTIE).then(() => {
      const anim = window.lottie.loadAnimation({ container: host, renderer: "svg", loop: true, autoplay: false, path: d.src });
      anim.addEventListener("DOMLoaded", () => anim.goToAndStop(20, true));
      anim.addEventListener("enterFrame", (e) => progress(stage, e.currentTime / anim.totalFrames, `${Math.floor(e.currentTime)} / ${anim.totalFrames}f`));
      stage.addEventListener("pointerenter", () => anim.play());
      stage.addEventListener("pointerleave", () => anim.pause());
    }).catch(() => { host.textContent = "Lottie"; });
  }

  function setupRive(d, stage) {
    const canvas = document.createElement("canvas");
    stage.prepend(canvas);
    const fit = () => { const r = stage.getBoundingClientRect(); canvas.width = r.width * devicePixelRatio; canvas.height = r.height * devicePixelRatio; };
    fit();
    loadScript(RIVE).then(() => {
      const R = window.rive;
      const r = new R.Rive({
        src: d.src, canvas, autoplay: false, autoBind: true,
        layout: new R.Layout({ fit: R.Fit.Cover, alignment: R.Alignment.Center }),
        onLoad: () => {
          const sm = r.stateMachineNames;
          if (sm && sm.length) r.play(sm[0]); else r.play();
          r.resizeDrawingSurfaceToCanvas();
          // Many .riv files start with an intro: let it play so the still frame isn't empty.
          setTimeout(() => { if (!stage.matches(":hover")) r.pause(); }, 3000);
        },
      });
      stage.addEventListener("pointerenter", () => { stage.classList.add("live"); r.play(r.stateMachineNames?.[0]); });
      stage.addEventListener("pointerleave", () => { stage.classList.remove("live"); r.pause(); });
      new ResizeObserver(() => { fit(); r.resizeDrawingSurfaceToCanvas(); }).observe(stage);
    }).catch(() => { stage.insertAdjacentHTML("afterbegin", `<div class="anim">Rive</div>`); });
  }

  function setupGif(d, stage) {
    const img = Object.assign(new Image(), { src: d.poster, alt: d.name });
    stage.prepend(img);
    stage.addEventListener("pointerenter", () => { img.src = d.src + "?" + Date.now(); progress(stage, 1); });
    stage.addEventListener("pointerleave", () => { img.src = d.poster; progress(stage, 0); });
  }

  // Build the demo only when it scrolls near (keeps the first load light).
  each("[data-demo]", (box) => {
    if (!("IntersectionObserver" in window)) return buildDemo(box);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); buildDemo(box); } }, { rootMargin: "600px" });
    io.observe(box);
  });

  // ---------- Reveal on scroll ----------
  const io = "IntersectionObserver" in window ? new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.12 }) : null;
  each(".reveal", (el) => (io ? io.observe(el) : el.classList.add("in")));

  // ---------- Design switcher (only when previewing on this Mac) ----------
  if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) {
    const here = location.pathname.endsWith("b.html") ? "B" : "A";
    document.body.insertAdjacentHTML("beforeend", `<div class="dev-switch">Preview:
      <a href="index.html${location.search}" ${here === "A" ? 'aria-current="page"' : ""}>A · Dark</a>
      <a href="b.html${location.search}" ${here === "B" ? 'aria-current="page"' : ""}>B · Light</a></div>`);
  }

  applyLang();
})();
