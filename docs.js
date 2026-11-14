// Docs page (docs.html): draws docs-content.js in the visitor's language (main.js decides it and sends "langchange"),
// the contents list, the keyboard-shortcut tables from data/shortcuts.js, and a search over every section.
(() => {
  const D = window.DOCS, K = window.DOCS_SHORTCUTS || { mac: [], desktop: [] };
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  let lang = (window.BF && window.BF.lang) || "en";
  const ui = (key) => { const v = D.ui[key]; return (v && (v[lang] ?? v.en)) || ""; };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  // ---------- Keyboard shortcuts: Mac grouped like Settings ▸ Shortcuts; Windows / Linux in one table ----------
  let keysTab = "mac";
  function keysHtml() {
    const tabs = `<div class="keys-tabs" role="tablist">
      <button role="tab" data-keys-tab="mac" aria-selected="${keysTab === "mac"}">${ui("keysMac")}</button>
      <button role="tab" data-keys-tab="desktop" aria-selected="${keysTab === "desktop"}">${ui("keysDesk")}</button></div>`;
    const row = (s) => `<tr><td>${esc(s.title)}</td><td>${s.keys ? s.keys.split("+").map((x) => `<kbd>${esc(x)}</kbd>`).join("+") : `<span class="fine">${ui("keysNone")}</span>`}${s.fixed ? ` <span class="fine">(${ui("keysFixed")})</span>` : ""}</td></tr>`;
    if (keysTab === "desktop") return tabs + `<table class="doc-table keys"><tbody>${K.desktop.map(row).join("")}</tbody></table>`;
    const groups = [...new Set(K.mac.map((s) => s.group))];
    const name = (g) => (lang === "vi" && D.ui.groups[g]) || g;
    // Mac keys are one glyph string (⇧⌘N): shown as a single key cap.
    const macRow = (s) => `<tr><td>${esc(s.title)}</td><td><kbd>${esc(s.keys)}</kbd>${s.fixed ? ` <span class="fine">(${ui("keysFixed")})</span>` : ""}</td></tr>`;
    return tabs + groups.map((g) => `<h4>${esc(name(g))}</h4><table class="doc-table keys"><tbody>${K.mac.filter((s) => s.group === g).map(macRow).join("")}</tbody></table>`).join("");
  }
  function drawKeys() { $$("[data-keys]").forEach((el) => { el.innerHTML = keysHtml(); }); }
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-keys-tab]");
    if (b) { keysTab = b.dataset.keysTab; drawKeys(); }
  });

  // ---------- Page ----------
  function render() {
    $$("[data-docs-ui]").forEach((el) => { el.textContent = ui(el.dataset.docsUi); });
    $("[data-docs-follows]").textContent = ui("follows").replace("{mac}", D.versions.mac).replace("{desktop}", D.versions.desktop);
    $("[data-docs-search]").placeholder = ui("search");
    $("[data-docs-search]").setAttribute("aria-label", ui("search"));
    $("[data-docs-nav]").innerHTML = D.sections.map((s) => `<a href="#${s.id}" data-nav="${s.id}"><span aria-hidden="true">${s.icon}</span>${esc(s.t[lang] ?? s.t.en)}</a>`).join("");
    $("[data-docs-body]").innerHTML = D.sections.map((s) => `
      <section class="doc-section" id="${s.id}">
        <h2><a class="anchor" href="#${s.id}" aria-hidden="true">#</a>${esc(s.t[lang] ?? s.t.en)}</h2>
        ${s[lang] ?? s.en}
        <p class="doc-top"><a href="#top">↑ ${ui("top")}</a></p>
      </section>`).join("");
    // Every sub-heading links to itself.
    $$(".doc-section h3[id]").forEach((h) => h.insertAdjacentHTML("afterbegin", `<a class="anchor" href="#${h.id}" aria-hidden="true">#</a>`));
    $$(".pro-badge").forEach((el) => { el.title = window.BF ? window.BF.t("pro.tip") : ""; });
    // Tables with a header (Free / Pro) turn into stacked cards on narrow screens: each cell names its column.
    $$(".doc-table").forEach((t) => {
      const heads = [...t.querySelectorAll("thead th")].map((th) => th.textContent.trim());
      if (heads.length) t.querySelectorAll("tbody tr").forEach((tr) => [...tr.children].forEach((c, i) => { if (c.tagName === "TD" && heads[i]) c.dataset.label = heads[i]; }));
    });
    drawKeys();
    buildIndex();
    search($("[data-docs-search]").value);
    watchSections();
  }

  // ---------- Search: every sub-section (or a section without sub-headings) is one hit, accents ignored ----------
  const fold = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();
  let index = [];
  function buildIndex() {
    index = [];
    $$(".doc-section").forEach((sec) => {
      const title = $("h2", sec).textContent.replace(/^#/, "");
      let cur = { id: sec.id, title, sub: "", text: "" };
      index.push(cur);
      [...sec.children].forEach((el) => {
        if (el.tagName === "H3") { cur = { id: el.id, title, sub: el.textContent.replace(/^#/, ""), text: "" }; index.push(cur); }
        else if (!el.classList.contains("doc-top") && el.tagName !== "H2") cur.text += " " + el.textContent;
      });
    });
    index.forEach((x) => { x.hay = fold(`${x.sub} ${x.text}`); x.text = x.text.replace(/\s+/g, " ").trim(); });
  }
  function snippet(text, word) {
    const at = fold(text).indexOf(word);
    if (at < 0) return esc(text.slice(0, 140)) + (text.length > 140 ? "…" : "");
    const from = Math.max(0, at - 60), to = Math.min(text.length, at + word.length + 80);
    return (from ? "…" : "") + esc(text.slice(from, at)) + `<mark>${esc(text.slice(at, at + word.length))}</mark>` + esc(text.slice(at + word.length, to)) + (to < text.length ? "…" : "");
  }
  function search(q) {
    const box = $("[data-docs-results]");
    const words = fold(q.trim()).split(/\s+/).filter((w) => w.length > 1);
    if (!words.length) { box.hidden = true; box.innerHTML = ""; return; }
    const hits = index.filter((x) => words.every((w) => x.hay.includes(w) || fold(x.title).includes(w)));
    box.hidden = false;
    box.innerHTML = `<p class="fine">${hits.length ? ui("hits").replace("{n}", hits.length) : ui("noHits")}</p>` +
      hits.slice(0, 30).map((x) => `<a class="hit" href="#${x.id}"><b>${esc(x.title)}${x.sub ? ` ▸ ${esc(x.sub)}` : ""}</b><span>${snippet(x.text, words[0])}</span></a>`).join("");
  }
  $("[data-docs-search]").addEventListener("input", (e) => search(e.target.value));
  $("[data-docs-search]").addEventListener("keydown", (e) => {
    if (e.key === "Escape") { e.target.value = ""; search(""); }
    if (e.key === "Enter") { const a = $("[data-docs-results] a.hit"); if (a) { location.hash = a.getAttribute("href"); } }
  });
  // "/" jumps to the search box, like many docs sites.
  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); $("[data-docs-search]").focus(); }
  });

  // ---------- Contents: the section on screen is highlighted; on a phone the list folds after a pick ----------
  let io;
  function watchSections() {
    io?.disconnect();
    if (!("IntersectionObserver" in window)) return;
    io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      $$("[data-nav]").forEach((a) => a.toggleAttribute("aria-current", a.dataset.nav === e.target.id));
    }), { rootMargin: "-20% 0px -70% 0px" });
    $$(".doc-section").forEach((s) => io.observe(s));
  }
  const phone = matchMedia("(max-width: 900px)");
  const toc = $("[data-docs-toc]");
  const fitToc = () => { toc.open = !phone.matches; };
  fitToc();
  phone.addEventListener?.("change", fitToc);
  $("[data-docs-nav]").addEventListener("click", () => { if (phone.matches) toc.open = false; });

  // A deep link (docs.html#lim-figma) lands on its heading once the page is drawn.
  function goHash() {
    const id = decodeURIComponent(location.hash.slice(1));
    const el = id && document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "instant" });
  }

  document.addEventListener("langchange", (e) => { lang = e.detail; render(); window.BF?.glue?.(); goHash(); });
  render();
  window.BF?.glue?.();
  goHash();
})();
