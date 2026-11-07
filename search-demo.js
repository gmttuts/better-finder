// The Search section: the app's ⌘K palette with its three tabs (Search, Visual, Advanced), drawn in HTML / CSS and searching a
// small index of demo files (content.js searchDemo) the way the app searches its name index: as you type, letters may be
// missing ("invq4"), accents don't matter ("khach hang"), "kind:video " and the like turn into chips, "said: " searches what is
// said in clips. Visual (Pro) finds pictures by colour or by what they show; Advanced has its conditions in groups that
// fold. While nobody touches it, it types a few searches by itself (none with reduced motion). The palette speaks English,
// like the app; the texts around it come from content.js (find.*).
(() => {
  const S = window.SITE, BF = window.BF, D = S.searchDemo;
  const root = document.querySelector("[data-find-demo]");
  if (!root || !D) return;
  const $ = (sel, el = root) => el.querySelector(sel);
  const $$ = (sel, el = root) => [...el.querySelectorAll(sel)];
  const t = (k) => BF.t(k);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const FILES = D.files;

  // Folding as the app does it: no accents, đ = d, lower case. One character in, one out, so positions match the name.
  const fold1 = (ch) => (ch === "đ" || ch === "Đ" ? "d" : ch.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()[0] || ch);
  const fold = (s) => [...s].map(fold1).join("");

  // Where the letters of `word` sit in `name` (folded): a run of them first, else one after another (invq4 in invoice_Q4).
  function find(name, word) {
    const at = name.indexOf(word);
    if (at >= 0) return { score: 100 - at, pos: [...word].map((_, i) => at + i) };
    const pos = [];
    let from = 0;
    for (const ch of word) {
      const i = name.indexOf(ch, from);
      if (i < 0) return null;
      pos.push(i);
      from = i + 1;
    }
    if (pos[pos.length - 1] - pos[0] > word.length * 4) return null; // too spread out to be what was meant
    return { score: 40 - (pos[pos.length - 1] - pos[0]), pos };
  }
  function matchName(f, words) {
    const name = fold(f.n);
    let score = 0, pos = [];
    for (const w of words) {
      const m = find(name, w);
      if (!m) return null;
      score += m.score;
      pos = pos.concat(m.pos);
    }
    return { f, score, pos: new Set(pos) };
  }
  const hl = (name, pos) => [...name].map((ch, i) => (pos && pos.has(i) ? `<mark>${esc(ch)}</mark>` : esc(ch))).join("");

  // ---------------------------------------------------------------- icons and bits
  const ICON = {
    search: '<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5"/><path d="M12.6 12.6L17 17"/></svg>',
    visual: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M1.8 10S5 4.5 10 4.5 18.2 10 18.2 10 15 15.5 10 15.5 1.8 10 1.8 10z"/><circle cx="10" cy="10" r="2.6"/></svg>',
    advanced: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 5.5h14M3 10h14M3 14.5h14"/><circle cx="7" cy="5.5" r="1.6"/><circle cx="13" cy="10" r="1.6"/><circle cx="8.5" cy="14.5" r="1.6"/></svg>',
    drop: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M13.5 2.5l4 4-2 2-4-4zM11.5 4.5l-8 8V16h3.5l8-8"/></svg>',
    drive: '<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="2.5" y="6" width="15" height="8" rx="2"/><circle cx="14" cy="10" r=".9"/></svg>',
    fold: '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5l3 3 3-3"/></svg>',
  };
  const KIND = { folder: "📁", doc: "📄", audio: "🎵", project: "🎬" };
  const thumb = (f) => (f.th ? `<span class="fd-th"><img src="${f.th}" alt="" loading="lazy" decoding="async"></span>` : `<span class="fd-th fd-th-i" aria-hidden="true">${KIND[f.k] || "📄"}</span>`);
  const where = (f) => `<span class="fd-where">${f.drive ? `<span class="fd-drive">${ICON.drive}${esc(f.drive)}</span>` : ""}<span class="fd-path">${esc(f.p)}</span></span>`;
  const row = (f, name, extra = "") => `<li class="fd-row" role="option" aria-selected="false">${thumb(f)}<span class="fd-name">${name}${extra}</span>${where(f)}<span class="fd-meta">${esc(f.s)} · ${esc(f.d)}</span></li>`;
  // A section of the result list (Names, Spoken words…): a group named by its heading. hdr = the heading above a grid or list.
  let gid = 0;
  const sect = (title, n, rows) => { const id = "fd-g" + ++gid; return `<li role="group" aria-labelledby="${id}"><div class="fd-h" id="${id}"><b>${title}</b><span>${n}</span></div><ul class="fd-list" role="presentation">${rows}</ul></li>`; };
  const hdr = (title, n, note = "") => `<div class="fd-h fd-gh" id="fd-gh"><b>${title}</b><span>${n}</span>${note ? `<em>${note}</em>` : ""}</div>`;

  const COLORS = [["red", "#ff3b30"], ["orange", "#ff9500"], ["yellow", "#ffcc00"], ["green", "#34c759"], ["teal", "#30b0c7"], ["blue", "#3a7bd5"],
    ["purple", "#8e5cf7"], ["pink", "#ff6b9a"], ["brown", "#a2643a"], ["black", "#1c1c1e"], ["gray", "#8e8e93"], ["white", "#f4f4f4"]];
  const HEX = Object.fromEntries(COLORS);
  const cap = (s) => s[0].toUpperCase() + s.slice(1);

  // ---------------------------------------------------------------- the palette
  const TABS = [["search", "Search"], ["visual", "Visual"], ["advanced", "Advanced"]];
  const backTiles = FILES.filter((f) => f.th).slice(0, 12);
  root.innerHTML = `
    <div class="fd vd${root.hasAttribute("data-dark") ? " vd-dark" : ""}">
      <div class="fd-back" aria-hidden="true">${backTiles.map((f) => `<span style="background-image:url('${f.th}')"></span>`).join("")}</div>
      <div class="fd-pal">
        <div class="fd-field"><span class="fd-ico"></span><span class="fd-chips"></span>
          <input type="text" role="combobox" aria-expanded="true" aria-controls="fd-list" aria-autocomplete="list" spellcheck="false" autocomplete="off" autocapitalize="off" enterkeyhint="search">
          <span class="fd-count" aria-hidden="true"></span></div>
        <div class="fd-tabs" role="tablist" aria-label="Search palette">${TABS.map(([id, name], i) => `
          <button type="button" role="tab" id="fd-tab-${id}" aria-controls="fd-panel" data-tab="${id}" tabindex="-1">${ICON[id]}<b>${name}</b>${id === "visual" ? '<span class="pro-badge">PRO</span>' : ""}<span class="fd-n"></span><kbd>⌘${i + 1}</kbd></button>`).join("")}
          <i class="fd-line" aria-hidden="true"></i></div>
        <div class="fd-body" id="fd-panel" role="tabpanel" tabindex="0"></div>
        <div class="fd-foot" aria-hidden="true"></div>
      </div>
    </div>
    <p class="sp-sr" aria-live="off" data-live></p>
    <div class="fd-tries"><span class="fd-try-t"></span>${D.tries.map((_, i) => `<button type="button" data-try="${i}"></button>`).join("")}</div>`;

  const input = $("input"), body = $(".fd-body"), live = $("[data-live]");
  const st = { tab: "search", chips: [], colors: [], adv: { kind: 0, size: 0, date: 0, ratio: 0, tags: 0, folders: 0 }, folded: new Set(["media", "also"]), order: [], sel: 0 };

  // ---------------------------------------------------------------- Search tab
  const CHIP = /(^|\s)(kind|ext|tag|in|color):(\S+)\s/i, SAID = /(^|\s)(said|transcript):\s/i;
  const KINDS = { video: "video", videos: "video", movie: "video", image: "image", images: "image", picture: "image", audio: "audio", doc: "doc", document: "doc", folder: "folder", project: "project" };
  function chipsFromText() {
    let v = input.value, m, changed = false;
    while ((m = v.match(SAID)) || (m = v.match(CHIP))) {
      st.chips.push(m[3] ? { k: m[2].toLowerCase(), v: m[3] } : { k: "said" });
      v = (v.slice(0, m.index) + m[1] + v.slice(m.index + m[0].length)).replace(/^\s+/, "");
      changed = true;
    }
    if (changed) input.value = v;
  }
  function passChips(f) {
    return st.chips.every((c) => {
      const v = fold(c.v || "");
      if (c.k === "kind") return f.k === (KINDS[v] || v);
      if (c.k === "ext") return v.split(",").some((e) => fold(f.n).endsWith("." + e.replace(/^\./, "")));
      if (c.k === "tag") return (f.tags || []).some((g) => fold(g) === v);
      if (c.k === "in") return fold(f.p).includes(v);
      if (c.k === "color") return (f.c || []).some(([n, p]) => n === v && p >= 20);
      return true;
    });
  }
  function searchTab(q) {
    const words = fold(q).split(/\s+/).filter(Boolean);
    const said = st.chips.some((c) => c.k === "said");
    const pool = FILES.filter(passChips);
    let html = "", n = 0;
    if (said) {
      // every sentence that has the words, under its clip, with its time
      const hits = pool.filter((f) => f.said).map((f) => ({ f, lines: f.said.filter(([, s]) => words.every((w) => fold(s).includes(w))) })).filter((h) => h.lines.length);
      n = hits.reduce((a, h) => a + h.lines.length, 0);
      html = sect("Spoken words", n, hits.map((h) => row(h.f, esc(h.f.n)) + h.lines.map(([tm, s]) =>
        `<li class="fd-row fd-said" role="option" aria-selected="false"><span class="fd-tm">${tm}</span><span class="fd-q">“${hl(s, spots(s, words))}”</span><span class="fd-meta">↩ plays from here</span></li>`).join("")).join(""));
      if (!n) html = empty("No sentence has these words yet.");
      return { html, n };
    }
    if (!words.length) {
      const list = st.chips.length ? pool : pool.filter((f) => f.d === "Today");
      n = list.length;
      return { html: list.length ? sect(st.chips.length ? "Matches" : "Recents", n, list.slice(0, 7).map((f) => row(f, esc(f.n))).join("")) : empty("Nothing matches these chips."), n };
    }
    const names = pool.map((f) => matchName(f, words)).filter(Boolean).sort((a, b) => b.score - a.score);
    n = names.length;
    if (names.length) html += sect("Names", names.length, names.slice(0, 6).map((m) => row(m.f, hl(m.f.n, m.pos))).join(""));
    if (!st.chips.length && words.join("").length >= 3) {
      const tagged = pool.filter((f) => (f.tags || []).some((g) => fold(g) === words.join(" ")));
      if (tagged.length) html += sect("Tags", tagged.length, tagged.slice(0, 3).map((f) => row(f, esc(f.n), `<span class="fd-tag" style="--c:${HEX[fold(f.tags[0])] || "#999"}"></span>`)).join(""));
      const spoken = pool.filter((f) => f.said).flatMap((f) => f.said.filter(([, s]) => words.every((w) => fold(s).includes(w))).map((l) => [f, l]));
      if (spoken.length) html += sect("Spoken words", spoken.length, spoken.slice(0, 2).map(([f, [tm, s]]) =>
        `<li class="fd-row fd-said" role="option" aria-selected="false"><span class="fd-tm">${tm}</span><span class="fd-q">“${hl(s, spots(s, words))}” <i>${esc(f.n)}</i></span><span class="fd-meta">${esc(f.d)}</span></li>`).join(""));
      n += tagged.length + spoken.length;
    }
    if (!html) html = empty(`No names match “${esc(q)}”.`, "Search inside documents, spoken words or Advanced instead.");
    return { html, n };
  }
  // positions of whole words in a sentence, for the highlight
  function spots(s, words) {
    const f = fold(s), pos = new Set();
    for (const w of words) { const i = f.indexOf(w); if (i >= 0) for (let k = 0; k < w.length; k++) pos.add(i + k); }
    return pos;
  }
  const empty = (a, b = "", tag = "li") => `<${tag} class="fd-empty" role="option" aria-disabled="true"><b>${a}</b>${b ? `<span>${b}</span>` : ""}</${tag}>`;

  // ---------------------------------------------------------------- Visual tab (all of it is Pro: colour, Visual Search, Find Similar)
  const PRO_NOTE = `<p class="fd-pro"><span class="pro-badge">PRO</span>The Visual tab is part of Better Finder Pro: colours, what pictures and clips show, and pictures like yours.</p>`;
  function visualTab(q) {
    const sw = `<div class="fd-sw" role="group" aria-label="Colours">${COLORS.map(([c, hex]) =>
      `<button type="button" data-color="${c}" aria-pressed="${st.colors.includes(c)}"><i style="--c:${hex}"></i>${cap(c)}</button>`).join("")}
      <span class="fd-eye" title="Eyedropper (⌘E)">${ICON.drop}</span><span class="fd-custom">Custom…</span></div>`;
    const words = fold(q).split(/\s+/).filter(Boolean);
    if (st.colors.length) {
      // pictures that have every chosen colour, by how much of the picture it covers (the smaller share when there are two)
      const hits = FILES.filter((f) => f.c).map((f) => {
        const share = Math.min(...st.colors.map((c) => (f.c.find(([n]) => n === c) || [, 0])[1]));
        return { f, share };
      }).filter((h) => h.share >= 12 && words.every((w) => fold(h.f.n).includes(w))).sort((a, b) => b.share - a.share);
      const title = "Mostly " + st.colors.map(cap).join(" and ");
      return { n: hits.length, html: sw + PRO_NOTE + `${hdr(title, hits.length, st.colors.length > 1 ? "has both colours" : "share of the picture · click two colours for both")}
        <div class="fd-grid" role="listbox" id="fd-list" aria-labelledby="fd-gh">${hits.slice(0, 8).map(({ f, share }) => `<figure class="fd-tile" role="option" aria-selected="false">
          <span class="fd-pic"><img src="${f.th}" alt="" loading="lazy" decoding="async"><b><i style="--c:${HEX[st.colors[0]]}"></i>${share}%</b></span>
          <span class="fd-strip">${f.c.map(([c, p]) => `<i style="--c:${HEX[c]};flex:${p}"></i>`).join("")}</span>
          <figcaption>${esc(f.n)}</figcaption></figure>`).join("") || empty("No picture is mostly this colour.", "", "div")}</div>` };
    }
    if (words.length) {
      // what the picture shows: Visual Search, part of Better Finder Pro
      const hits = FILES.filter((f) => f.sees).map((f) => ({ f, s: words.filter((w) => f.sees.includes(w)).length / words.length }))
        .filter((h) => h.s > 0).sort((a, b) => b.s - a.s);
      return { n: hits.length, html: sw + PRO_NOTE + `
        ${hdr("Best matches", hits.length, "how well it matches · where in the clip")}
        <div class="fd-grid" role="listbox" id="fd-list" aria-labelledby="fd-gh">${hits.slice(0, 8).map(({ f, s }, i) => `<figure class="fd-tile" role="option" aria-selected="false">
          <span class="fd-pic"><img src="${f.th}" alt="" loading="lazy" decoding="async"><b>${Math.round(28 + s * 10 - i)}%</b>${f.k === "video" ? `<em>at 0:${String(4 + i * 3).padStart(2, "0")}</em>` : ""}</span>
          <figcaption>${esc(f.n)}</figcaption></figure>`).join("") || empty("Nothing looks like that here.", "", "div")}</div>` };
    }
    return { n: null, html: sw + PRO_NOTE + `<p class="fd-hint">Pick a colour, or type what the picture shows.</p>` };
  }

  // ---------------------------------------------------------------- Advanced tab
  const ADV = {
    kind: ["Kind", ["Any", "Video", "Image", "Audio", "Project"]],
    size: ["Size", ["Any size", "> 100 MB", "> 1 GB"]],
    date: ["Date", ["Any time", "Today", "This week"]],
    ratio: ["Ratio", ["Any ratio", "16:9", "9:16", "1:1"]],
    tags: ["Tags", ["None", "Red", "Green", "Blue", "Yellow", "Orange"]],
    folders: ["Folders", ["Off", "On"]],
  };
  const GROUPS = [["file", "File", ["look", "name", "kind", "size", "date"]], ["frame", "Frame", ["ratio"]], ["media", "Media", ["tags"]], ["also", "Also", ["folders"]]];
  const bytes = (s) => { const m = /([\d.]+)\s*(KB|MB|GB)/.exec(s); return m ? m[1] * { KB: 1e3, MB: 1e6, GB: 1e9 }[m[2]] : 0; };
  const WEEK = ["Today", "Yesterday", "Monday"];
  const advVal = (k) => ADV[k][1][st.adv[k]];
  function advPass(f, words) {
    const a = st.adv, k = advVal("kind").toLowerCase();
    if (a.kind && f.k !== k) return false;
    if (a.size && bytes(f.s) <= (a.size === 1 ? 1e8 : 1e9)) return false;
    if (a.date && !(a.date === 1 ? f.d === "Today" : WEEK.includes(f.d))) return false;
    if (a.ratio && f.r !== advVal("ratio")) return false;
    if (a.tags && !(f.tags || []).includes(advVal("tags"))) return false;
    if (!a.folders && f.k === "folder") return false;
    return words.every((w) => fold(f.n).includes(w));
  }
  function advancedTab(q) {
    const words = fold(q).split(/\s+/).filter(Boolean);
    const hits = FILES.filter((f) => advPass(f, words));
    const chip = (k) => {
      if (k === "look") return `<span class="fd-cond"><span>Look in</span><b>Everywhere</b></span>`;
      if (k === "name") return `<span class="fd-cond${q ? " on" : ""}"><span>Name</span><b>${q ? esc(q) : "Any"}</b></span>`;
      return `<button type="button" class="fd-cond${st.adv[k] ? " on" : ""}" data-adv="${k}" aria-label="${ADV[k][0]}: ${esc(advVal(k))}. Click to change."><span>${ADV[k][0]}</span><b>${esc(advVal(k))}</b>${ICON.fold}</button>`;
    };
    const groups = GROUPS.map(([id, name, keys]) => {
      const set = keys.filter((k) => (k === "name" ? q : k !== "look" && st.adv[k])).map((k) => (k === "name" ? `“${esc(q)}”` : esc(advVal(k))));
      const open = !st.folded.has(id);
      return `<div class="fd-grp${open ? " open" : ""}"><button type="button" class="fd-gb" data-fold="${id}" aria-expanded="${open}">${ICON.fold}<b>${name}</b><span>${set.length ? set.join(" · ") : "nothing set"}</span></button>
        ${open ? `<div class="fd-conds">${keys.map(chip).join("")}</div>` : ""}</div>`;
    }).join("");
    return { n: hits.length, html: `<div class="fd-adv">${groups}</div>${hdr("Results", hits.length, "live")}<ul class="fd-list" role="listbox" id="fd-list" aria-labelledby="fd-gh">${hits.slice(0, 4).map((f) => row(f, esc(f.n))).join("") || empty("Nothing matches every condition.")}</ul>` };
  }

  // ---------------------------------------------------------------- drawing
  const FOOT = {
    search: [["↩", "Open"], ["⌘↩", "Show all"], ["⌘S", "Save as Smart Folder"], ["␣", "Quick Look"]],
    visual: [["↩", "Open"], ["⌘E", "Eyedropper"], ["␣", "Quick Look"], ["⌘↩", "Show all"]],
    advanced: [["⌘↩", "Show in window"], ["⌘S", "Save as Smart Folder"], ["⌫", "Remove"]],
  };
  const PLACE = { search: "Search files, said: for spoken words, kind:video…", visual: "Describe it, pick a colour, or drop a picture", advanced: "Name contains…" };
  let shown = 0;
  function draw() {
    const q = input.value.trim();
    const t0 = performance.now();
    gid = 0;
    const r = st.tab === "search" ? searchTab(q) : st.tab === "visual" ? visualTab(q) : advancedTab(q);
    const ms = performance.now() - t0;
    body.innerHTML = st.tab === "search" ? `<ul class="fd-list" role="listbox" id="fd-list" aria-label="Results">${r.html}</ul>` : r.html;
    input.setAttribute("aria-expanded", !!$("#fd-list", body));
    body.dataset.view = st.tab;
    $(".fd-ico").innerHTML = ICON[st.tab];
    const chips = st.tab === "visual" ? st.colors.map((c) => ({ k: "color", v: cap(c), c })) : st.tab === "search" ? st.chips : [];
    $(".fd-chips").innerHTML = chips.map((c, i) => `<span class="fd-chip">${c.k}:${c.c ? `<i style="--c:${HEX[c.c]}"></i>` : ""}${c.v ? ` <b>${esc(c.v)}</b>` : ""}<button type="button" data-unchip="${i}" aria-label="Remove ${c.k} ${esc(c.v || "")}" tabindex="-1">×</button></span>`).join("");
    input.placeholder = chips.length ? "" : PLACE[st.tab];
    $(".fd-count").textContent = st.tab === "search" ? `${D.total.toLocaleString("en-US")} items · ${ms < 1 ? "< 1" : Math.round(ms)} ms` : r.n == null ? "" : `${r.n} · 0.0 s`;
    $$("[data-tab]").forEach((b) => {
      const on = b.dataset.tab === st.tab;
      b.setAttribute("aria-selected", on);
      b.tabIndex = on ? 0 : -1;
      $(".fd-n", b).textContent = on && r.n ? r.n : "";
    });
    body.setAttribute("aria-labelledby", "fd-tab-" + st.tab);
    $(".fd-foot").innerHTML = FOOT[st.tab].map(([k, l]) => `<span><kbd>${k}</kbd>${l}</span>`).join("") + "<em>esc</em>";
    const line = $(".fd-line"), tab = $(`[data-tab="${st.tab}"]`);
    line.style.cssText = `left:${tab.offsetLeft}px;width:${tab.offsetWidth}px`;
    shown = r.n;
    select(0);
  }
  function select(i) {
    const rows = $$(".fd-row, .fd-tile", body);
    if (!rows.length) { input.removeAttribute("aria-activedescendant"); return; }
    st.sel = (i + rows.length) % rows.length;
    rows.forEach((el, k) => { el.id = "fd-opt-" + k; el.setAttribute("aria-selected", k === st.sel); el.classList.toggle("sel", k === st.sel); });
    input.setAttribute("aria-activedescendant", "fd-opt-" + st.sel);
    if (user) rows[st.sel].scrollIntoView({ block: "nearest" });
  }
  // the count, said once the visitor has stopped typing
  let sayT = 0;
  const say = () => { clearTimeout(sayT); if (user && shown != null) sayT = setTimeout(() => (live.textContent = t("find.results").replace("{n}", shown)), 700); };

  function setTab(id, focus) {
    st.tab = id;
    draw(); say();
    if (focus) $(`[data-tab="${id}"]`).focus();
  }

  // ---------------------------------------------------------------- the visitor
  let user = false;
  function took() {
    if (user) return;
    user = true;
    stopAuto();
    live.setAttribute("aria-live", "polite");
  }
  root.addEventListener("pointerdown", took);
  root.addEventListener("keydown", took, true);
  root.addEventListener("focusin", took);

  input.addEventListener("input", () => { if (st.tab === "search") chipsFromText(); draw(); say(); });
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); select(st.sel + (e.key === "ArrowDown" ? 1 : -1)); }
    else if (e.key === "Backspace" && !input.value && input.selectionStart === 0) {
      // Delete in the empty field takes away the last chip, colour or condition
      if (st.tab === "search" && st.chips.length) st.chips.pop();
      else if (st.tab === "visual" && st.colors.length) st.colors.pop();
      else if (st.tab === "advanced" && st.order.length) st.adv[st.order.pop()] = 0;
      else return;
      e.preventDefault(); draw(); say();
    } else if (e.key === "Escape" && (input.value || st.chips.length || st.colors.length)) {
      e.preventDefault(); input.value = ""; st.chips = []; st.colors = []; draw(); say();
    }
  });
  // tabs: click, or the arrows / Home / End on the tab row (focus follows)
  $(".fd-tabs").addEventListener("click", (e) => { const b = e.target.closest("[data-tab]"); if (b) setTab(b.dataset.tab); });
  $(".fd-tabs").addEventListener("keydown", (e) => {
    const i = TABS.findIndex(([id]) => id === st.tab), last = TABS.length - 1;
    const j = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: last }[e.key];
    if (j == null) return;
    e.preventDefault();
    setTab(TABS[(j + TABS.length) % TABS.length][0], true);
  });
  root.addEventListener("click", (e) => {
    const c = e.target.closest("[data-color]"), a = e.target.closest("[data-adv]"), g = e.target.closest("[data-fold]"), x = e.target.closest("[data-unchip]");
    const r = e.target.closest(".fd-row, .fd-tile");
    if (c) {
      const k = c.dataset.color;
      st.colors = st.colors.includes(k) ? st.colors.filter((v) => v !== k) : st.colors.concat(k).slice(-2);
    } else if (a) {
      const k = a.dataset.adv;
      st.adv[k] = (st.adv[k] + 1) % ADV[k][1].length;
      st.order = st.order.filter((x) => x !== k).concat(st.adv[k] ? [k] : []); // the order conditions were set, for Delete
    }
    else if (g) { const id = g.dataset.fold; st.folded.has(id) ? st.folded.delete(id) : st.folded.add(id); }
    else if (x) { const i = +x.dataset.unchip; if (st.tab === "visual") st.colors.splice(i, 1); else st.chips.splice(i, 1); }
    else if (r) { select($$(".fd-row, .fd-tile", body).indexOf(r)); return; }
    else return;
    // the control that was clicked is drawn again: keep the focus on its new copy
    const key = c ? `[data-color="${c.dataset.color}"]` : a ? `[data-adv="${a.dataset.adv}"]` : g ? `[data-fold="${g.dataset.fold}"]` : null;
    const had = root.contains(document.activeElement) && document.activeElement !== input;
    draw(); say();
    const grp = a && GROUPS.find(([, , keys]) => keys.includes(a.dataset.adv))[0];
    if (key && had) ($(key) || (grp && $(`[data-fold="${grp}"]`)) || input).focus(); else if (x) input.focus();
  });

  // ---------------------------------------------------------------- what it does by itself, and the Try buttons
  const tries = $$("[data-try]");
  let typing = 0;
  function play(i, animate) {
    const tr = D.tries[i];
    clearInterval(typing);
    st.chips = []; st.colors = []; st.order = []; st.adv = { kind: 0, size: 0, date: 0, ratio: 0, tags: 0, folders: 0 };
    input.value = "";
    tries.forEach((b, k) => b.setAttribute("aria-pressed", k === i));
    if (tr.color) { st.colors = [tr.color]; setTab("visual"); return; }
    if (tr.set) {
      st.tab = "advanced";
      for (const [k, v] of Object.entries(tr.set)) st.adv[k] = Math.max(0, ADV[k][1].indexOf(v));
      st.order = Object.keys(tr.set);
      st.folded = new Set(["media", "also"]);
      draw(); return;
    }
    st.tab = tr.tab;
    if (!animate) { input.value = tr.q; chipsFromText(); draw(); return; }
    let n = 0;
    draw();
    typing = setInterval(() => {
      input.value += tr.q[n++];
      chipsFromText(); draw();
      if (n >= tr.q.length) clearInterval(typing);
    }, 85);
  }
  tries.forEach((b) => b.addEventListener("click", () => { took(); play(+b.dataset.try, !reduce); say(); }));

  // ⌘K on the big key: puts the cursor in the palette, the way ⌘K opens it in the app
  const key = document.querySelector("[data-find-key]");
  key?.addEventListener("click", () => {
    took();
    key.classList.remove("down"); void key.offsetWidth; key.classList.add("down");
    input.focus(); input.select();
  });

  let auto = 0, next = 0, onScreen = false;
  const step = () => { next = (next + 1) % D.tries.length; play(next, true); };
  const startAuto = () => { if (!user && !reduce && !auto && onScreen && !document.hidden) { play(next, true); auto = setInterval(step, 4800); } };
  const stopAuto = () => { clearInterval(auto); auto = 0; clearInterval(typing); };
  document.addEventListener("visibilitychange", () => (document.hidden ? stopAuto() : startAuto()));
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; onScreen ? startAuto() : stopAuto(); }, { threshold: 0.35 }).observe(root);
  }

  function texts() {
    $(".fd-try-t").textContent = t("find.try");
    tries.forEach((b, i) => (b.textContent = t("find.try." + i)));
    input.setAttribute("aria-label", t("find.type"));
  }
  document.addEventListener("langchange", texts);
  const underline = () => { const tab = $(`[data-tab="${st.tab}"]`); $(".fd-line").style.cssText = `left:${tab.offsetLeft}px;width:${tab.offsetWidth}px`; };
  if ("ResizeObserver" in window) new ResizeObserver(underline).observe($(".fd-tabs")); else window.addEventListener("resize", underline);
  texts();
  play(0, false);
})();
