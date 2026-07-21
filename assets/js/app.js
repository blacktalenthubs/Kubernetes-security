/* =========================================================================
   Depth Library — engine
   A dependency-light, data-driven static portal for interview-prep depth.

   Content lives in content/sections/*.js. Each file calls:
       DEPTH.registerSection({ id, title, icon, blurb, topics: [...] })

   Progress (reading status, deliverable checkboxes, personal notes) is
   persisted in localStorage — nothing leaves the machine.
   ========================================================================= */

(function () {
  "use strict";

  const LS_PREFIX = "depthlib.v1.";
  const STATUSES = [
    { id: "new",       label: "Not started", icon: "○" },
    { id: "reading",   label: "Reading",     icon: "◐" },
    { id: "reviewed",  label: "Reviewed",    icon: "◑" },
    { id: "mastered",  label: "Mastered",    icon: "●" },
  ];

  const DEPTH = {
    sections: [],
    _topicIndex: new Map(), // "sectionId/topicId" -> {section, topic, order}
    _flatOrder: [],         // ordered list of {section, topic}
    registerSection(section) {
      section.topics = section.topics || [];
      this.sections.push(section);
    },
    boot() { boot(); },
  };
  window.DEPTH = DEPTH;

  /* ---------- storage helpers ---------- */
  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem(LS_PREFIX + key); return v === null ? fallback : JSON.parse(v); }
      catch (e) { return fallback; }
    },
    set(key, val) {
      try { localStorage.setItem(LS_PREFIX + key, JSON.stringify(val)); } catch (e) {}
    },
  };
  const statusOf   = (tid) => store.get("status." + tid, "new");
  const setStatus  = (tid, s) => store.set("status." + tid, s);
  const delivDone  = (tid, i) => store.get(`deliv.${tid}.${i}`, false);
  const setDeliv   = (tid, i, v) => store.set(`deliv.${tid}.${i}`, v);
  const notesOf    = (tid) => store.get("notes." + tid, "");
  const setNotes   = (tid, v) => store.set("notes." + tid, v);

  /* ---------- tiny DOM helpers ---------- */
  const el = (sel) => document.querySelector(sel);
  const esc = (s) => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
  const md = (s) => (window.marked ? window.marked.parse(s || "", { mangle: false, headerIds: false }) : esc(s));

  /* ---------- build indexes ---------- */
  function buildIndex() {
    DEPTH._topicIndex.clear();
    DEPTH._flatOrder = [];
    DEPTH.sections.forEach((section) => {
      section.topics.forEach((topic) => {
        const key = section.id + "/" + topic.id;
        DEPTH._topicIndex.set(key, { section, topic });
        DEPTH._flatOrder.push({ section, topic, key });
      });
    });
  }

  /* ---------- progress math ---------- */
  const WEIGHT = { new: 0, reading: 0.34, reviewed: 0.67, mastered: 1 };
  function sectionProgress(section) {
    if (!section.topics.length) return 0;
    const sum = section.topics.reduce((a, t) => a + WEIGHT[statusOf(section.id + "/" + t.id)], 0);
    return sum / section.topics.length;
  }
  function overallProgress() {
    const all = DEPTH._flatOrder;
    if (!all.length) return 0;
    const sum = all.reduce((a, x) => a + WEIGHT[statusOf(x.key)], 0);
    return sum / all.length;
  }
  function countByStatus() {
    const c = { new: 0, reading: 0, reviewed: 0, mastered: 0 };
    DEPTH._flatOrder.forEach((x) => { c[statusOf(x.key)]++; });
    return c;
  }
  function deliverableStats() {
    let total = 0, done = 0;
    DEPTH._flatOrder.forEach((x) => {
      (x.topic.deliverables || []).forEach((d, i) => {
        total++; if (delivDone(x.key, i)) done++;
      });
    });
    return { total, done };
  }

  /* ---------- mermaid ---------- */
  let mermaidInited = false;
  function renderMermaid() {
    if (!window.mermaid) return;
    const theme = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "default";
    try {
      window.mermaid.initialize({
        startOnLoad: false,
        theme,
        securityLevel: "loose",
        flowchart: { curve: "basis", useMaxWidth: true },
        sequence: { useMaxWidth: true },
        themeVariables: { fontFamily: "inherit" },
      });
      mermaidInited = true;
      const nodes = document.querySelectorAll(".mermaid");
      if (nodes.length) window.mermaid.run({ nodes });
    } catch (e) { console.warn("mermaid render error", e); }
  }

  /* =======================================================================
     SIDEBAR
     ======================================================================= */
  function renderSidebar(active) {
    const collapsed = store.get("nav.collapsed", {});
    let html = `<a class="nav-home ${active.view === "home" ? "active" : ""}" href="#/">
        <span>🏠</span><span>Coverage Dashboard</span></a>`;

    DEPTH.sections.forEach((section) => {
      const isColl = collapsed[section.id];
      const done = section.topics.filter((t) => statusOf(section.id + "/" + t.id) === "mastered").length;
      html += `<div class="nav-section ${isColl ? "collapsed" : ""}" data-section="${section.id}">
        <button class="nav-section-head" data-toggle="${section.id}">
          <span class="nav-section-icon">${section.icon || "📁"}</span>
          <span>${esc(section.title)}</span>
          <span class="nav-section-count">${done}/${section.topics.length}</span>
          <span class="chev">▾</span>
        </button>
        <ul class="nav-topics">`;
      section.topics.forEach((topic) => {
        const key = section.id + "/" + topic.id;
        const st = statusOf(key);
        const isActive = active.view === "topic" && active.key === key;
        html += `<li class="nav-topic"><a href="#/topic/${key}" class="${isActive ? "active" : ""}">
            <span class="status-dot ${st}"></span>
            <span class="t-label">${esc(topic.title)}</span>
            ${topic.week ? `<span class="t-week">W${topic.week}</span>` : ""}
          </a></li>`;
      });
      html += `</ul></div>`;
    });
    el("#sidebar").innerHTML = html;
  }

  /* =======================================================================
     DASHBOARD
     ======================================================================= */
  function renderHome() {
    const overall = overallProgress();
    const counts = countByStatus();
    const deliv = deliverableStats();
    const totalTopics = DEPTH._flatOrder.length;
    const totalMins = DEPTH._flatOrder.reduce((a, x) => a + (x.topic.minutes || 0), 0);

    let html = `<div class="content-inner">
      <div class="page-head">
        <h1>Coverage Dashboard</h1>
        <p class="lede">A living depth library for Payments &amp; Security interview prep. Track what you've read,
        what you've mastered, and the hands-on deliverables that prove it. Progress is saved on this device.</p>
      </div>

      <div class="stat-grid">
        <div class="stat-card"><div class="num">${Math.round(overall * 100)}%</div><div class="lbl">Overall mastery</div>
          <div class="sub">${counts.mastered} mastered · ${counts.reviewed} reviewed · ${counts.reading} in progress</div></div>
        <div class="stat-card"><div class="num">${totalTopics}</div><div class="lbl">Topics</div>
          <div class="sub">${DEPTH.sections.length} sections · ~${Math.round(totalMins / 60)}h of reading</div></div>
        <div class="stat-card"><div class="num">${deliv.done}/${deliv.total}</div><div class="lbl">Deliverables done</div>
          <div class="sub">Labs · demos · presentations · artifacts</div></div>
        <div class="stat-card"><div class="num">${counts.new}</div><div class="lbl">Not started</div>
          <div class="sub">Topics still to open</div></div>
      </div>

      <div class="section-cards">`;

    DEPTH.sections.forEach((section) => {
      const p = sectionProgress(section);
      const mastered = section.topics.filter((t) => statusOf(section.id + "/" + t.id) === "mastered").length;
      html += `<a class="section-card" href="#/section/${section.id}">
        <div class="sc-icon">${section.icon || "📁"}</div>
        <h3>${esc(section.title)}</h3>
        <p>${esc(section.blurb || "")}</p>
        <div class="progress-line"><span style="width:${Math.round(p * 100)}%"></span></div>
        <div class="sc-foot"><span>${section.topics.length} topics</span><span>${mastered} mastered · ${Math.round(p * 100)}%</span></div>
      </a>`;
    });
    html += `</div>`;

    // coverage matrix
    html += `<div class="coverage-wrap"><h2>Coverage map</h2>
      <table class="matrix"><thead><tr>
        <th>Topic</th><th>Section</th><th>Week</th><th>Status</th><th>Deliverables</th>
      </tr></thead><tbody>`;
    DEPTH._flatOrder.forEach((x) => {
      const st = statusOf(x.key);
      const stLabel = STATUSES.find((s) => s.id === st).label;
      const dl = x.topic.deliverables || [];
      const dlDone = dl.filter((_, i) => delivDone(x.key, i)).length;
      html += `<tr>
        <td><a href="#/topic/${x.key}">${esc(x.topic.title)}</a></td>
        <td>${esc(x.section.title)}</td>
        <td>${x.topic.week ? "W" + x.topic.week : "—"}</td>
        <td><span class="pill ${st}">${stLabel}</span></td>
        <td>${dl.length ? `${dlDone}/${dl.length}` : "—"}</td>
      </tr>`;
    });
    html += `</tbody></table></div></div>`;

    el("#main").innerHTML = html;
  }

  /* =======================================================================
     SECTION PAGE
     ======================================================================= */
  function renderSection(section) {
    const p = sectionProgress(section);
    let html = `<div class="content-inner">
      <div class="crumbs"><a href="#/">Dashboard</a> › ${esc(section.title)}</div>
      <div class="page-head">
        <h1>${section.icon || ""} ${esc(section.title)}</h1>
        <p class="lede">${esc(section.blurb || "")}</p>
      </div>
      <div class="progress-line" style="max-width:340px;margin-bottom:22px"><span style="width:${Math.round(p * 100)}%"></span></div>
      <div class="topic-list">`;

    section.topics.forEach((topic) => {
      const key = section.id + "/" + topic.id;
      const st = statusOf(key);
      const dl = topic.deliverables || [];
      const dlDone = dl.filter((_, i) => delivDone(key, i)).length;
      html += `<a class="topic-row" href="#/topic/${key}">
        <span class="status-dot ${st}" title="${STATUSES.find(s=>s.id===st).label}"></span>
        <div class="tr-body">
          <div class="tr-title">${esc(topic.title)}</div>
          <div class="tr-sum">${esc(topic.summary || "")}</div>
        </div>
        <div class="tr-side">
          ${topic.week ? "Week " + topic.week + "<br>" : ""}
          ${topic.minutes ? topic.minutes + " min<br>" : ""}
          ${dl.length ? dlDone + "/" + dl.length + " deliverables" : ""}
        </div>
      </a>`;
    });
    html += `</div></div>`;
    el("#main").innerHTML = html;
  }

  /* =======================================================================
     TOPIC PAGE
     ======================================================================= */
  function renderTopic(entry) {
    const { section, topic } = entry;
    const key = section.id + "/" + topic.id;
    const st = statusOf(key);

    const tags = (topic.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join("");

    // status control
    const statusBtns = STATUSES.map((s) =>
      `<button data-s="${s.id}" class="${st === s.id ? "active" : ""}"><span>${s.icon}</span>${s.label}</button>`
    ).join("");

    let html = `<div class="content-inner">
      <div class="crumbs"><a href="#/">Dashboard</a> › <a href="#/section/${section.id}">${esc(section.title)}</a> › ${esc(topic.title)}</div>
      <div class="topic-head">
        <h1>${esc(topic.title)}</h1>
        ${topic.summary ? `<p class="topic-summary">${esc(topic.summary)}</p>` : ""}
        <div class="topic-meta">
          ${topic.week ? `<span class="tag week">Week ${topic.week}</span>` : ""}
          ${topic.minutes ? `<span class="tag mins">⏱ ${topic.minutes} min</span>` : ""}
          ${tags}
        </div>
      </div>
      <div class="status-control" id="statusControl">${statusBtns}</div>`;

    // Context + Architecture
    if (topic.context) html += block("🧭", "Context — why it matters", `<div class="prose">${md(topic.context)}</div>`);
    if (topic.architecture) html += block("🏗️", "Architecture — how it works", `<div class="prose">${md(topic.architecture)}</div>`);

    // Diagram(s)
    const diagrams = topic.diagrams || (topic.diagram ? [{ code: topic.diagram, title: topic.diagramTitle }] : []);
    if (diagrams.length) {
      let d = "";
      diagrams.forEach((dg) => {
        d += `<div class="diagram">
          ${dg.title ? `<p class="diagram-title">${esc(dg.title)}</p>` : ""}
          <div class="diagram-wrap"><pre class="mermaid">${esc(dg.code.trim())}</pre></div>
        </div>`;
      });
      html += block("📊", "Diagram — the mental model", d);
    }

    // Production use cases
    if (topic.useCases && topic.useCases.length) {
      let u = "";
      topic.useCases.forEach((uc) => {
        if (typeof uc === "string") { u += `<div class="usecase"><div class="prose">${md(uc)}</div></div>`; }
        else {
          u += `<div class="usecase">
            <h4>${esc(uc.title)} ${uc.scale ? `<span class="uc-scale">${esc(uc.scale)}</span>` : ""}</h4>
            <div class="prose">${md(uc.body || "")}</div>
          </div>`;
        }
      });
      html += block("🏭", "In production — scale &amp; reality", u);
    }

    // Interview Q&A
    if (topic.interview && topic.interview.length) {
      let q = "";
      topic.interview.forEach((item) => {
        q += `<details class="qa"><summary><span class="q-mark">Q</span><span>${esc(item.q)}</span></summary>
          <div class="qa-body prose">${md(item.a)}</div></details>`;
      });
      html += block("🎯", "Interview Q&amp;A", q);
    }

    // Pitfalls
    if (topic.pitfalls && topic.pitfalls.length) {
      let pf = topic.pitfalls.map((p) =>
        `<div class="pitfall"><span class="p-ico">⚠</span><div class="prose" style="font-size:14.5px">${md(p)}</div></div>`
      ).join("");
      html += block("🕳️", "Traps &amp; gotchas", pf);
    }

    // Deliverables
    if (topic.deliverables && topic.deliverables.length) {
      const done = topic.deliverables.filter((_, i) => delivDone(key, i)).length;
      let dl = topic.deliverables.map((d, i) => {
        const isDone = delivDone(key, i);
        return `<label class="deliverable ${isDone ? "done" : ""}" data-i="${i}">
          <input type="checkbox" ${isDone ? "checked" : ""} data-deliv="${i}">
          <div class="d-body">
            <div class="d-title">${esc(d.title)} <span class="d-type ${d.type || "drill"}">${esc(d.type || "task")}</span></div>
            ${d.detail ? `<div class="d-detail">${esc(d.detail)}</div>` : ""}
          </div>
        </label>`;
      }).join("");
      dl += `<div class="deliv-progress" id="delivProgress">${done}/${topic.deliverables.length} complete — these are what you produce to prove mastery.</div>`;
      html += block("🛠️", "Your deliverables — prove it", dl);
    }

    // References
    if (topic.references && topic.references.length) {
      let r = `<ul class="refs">` + topic.references.map((ref) => {
        if (typeof ref === "string") return `<li>${md(ref)}</li>`;
        return `<li><strong>${esc(ref.label)}</strong>${ref.note ? ` — <span class="r-note">${esc(ref.note)}</span>` : ""}</li>`;
      }).join("") + `</ul>`;
      html += block("📚", "Go deeper — references", r);
    }

    // Notes
    html += block("📝", "Your notes", `
      <div class="notes-box">
        <textarea id="topicNotes" placeholder="Jot your own explanation, the version you'd say out loud in an interview, open questions, links…">${esc(notesOf(key))}</textarea>
        <div class="notes-saved" id="notesSaved"></div>
      </div>`);

    // prev / next
    const idx = DEPTH._flatOrder.findIndex((x) => x.key === key);
    const prev = idx > 0 ? DEPTH._flatOrder[idx - 1] : null;
    const next = idx < DEPTH._flatOrder.length - 1 ? DEPTH._flatOrder[idx + 1] : null;
    html += `<div class="topic-nav">
      ${prev ? `<a class="prev" href="#/topic/${prev.key}"><div class="tn-dir">← Previous</div><div class="tn-title">${esc(prev.topic.title)}</div></a>` : `<span></span>`}
      ${next ? `<a class="next" href="#/topic/${next.key}"><div class="tn-dir">Next →</div><div class="tn-title">${esc(next.topic.title)}</div></a>` : `<span></span>`}
    </div></div>`;

    el("#main").innerHTML = html;
    renderMermaid();

    // wire status control
    el("#statusControl").addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-s]");
      if (!btn) return;
      setStatus(key, btn.dataset.s);
      el("#statusControl").querySelectorAll("button").forEach((b) => b.classList.toggle("active", b === btn));
      renderSidebar({ view: "topic", key });
      updateGlobalProgress();
    });

    // wire deliverables
    el("#main").querySelectorAll("input[data-deliv]").forEach((cb) => {
      cb.addEventListener("change", () => {
        const i = Number(cb.dataset.deliv);
        setDeliv(key, i, cb.checked);
        cb.closest(".deliverable").classList.toggle("done", cb.checked);
        const done = topic.deliverables.filter((_, j) => delivDone(key, j)).length;
        const pd = el("#delivProgress");
        if (pd) pd.textContent = `${done}/${topic.deliverables.length} complete — these are what you produce to prove mastery.`;
      });
    });

    // wire notes (debounced save)
    const ta = el("#topicNotes");
    let notesTimer = null;
    ta.addEventListener("input", () => {
      clearTimeout(notesTimer);
      el("#notesSaved").textContent = "saving…";
      notesTimer = setTimeout(() => {
        setNotes(key, ta.value);
        el("#notesSaved").textContent = "saved ✓";
        setTimeout(() => { const n = el("#notesSaved"); if (n) n.textContent = ""; }, 1500);
      }, 500);
    });

    el("#main").scrollTop = 0;
    window.scrollTo(0, 0);
  }

  function block(ico, title, inner) {
    return `<section class="block"><h2><span class="b-ico">${ico}</span>${title}</h2>${inner}</section>`;
  }

  /* =======================================================================
     SEARCH
     ======================================================================= */
  function buildSearchCorpus() {
    return DEPTH._flatOrder.map((x) => ({
      key: x.key,
      title: x.topic.title,
      section: x.section.title,
      hay: (x.topic.title + " " + (x.topic.summary || "") + " " + (x.topic.tags || []).join(" ") + " " + x.section.title).toLowerCase(),
    }));
  }
  let corpus = [];
  function wireSearch() {
    const input = el("#searchInput");
    const box = el("#searchResults");
    let active = -1;
    function run() {
      const q = input.value.trim().toLowerCase();
      if (!q) { box.hidden = true; box.innerHTML = ""; return; }
      const hits = corpus.filter((c) => c.hay.includes(q)).slice(0, 12);
      active = -1;
      if (!hits.length) { box.innerHTML = `<div class="sr-empty">No topics match “${esc(q)}”.</div>`; box.hidden = false; return; }
      box.innerHTML = hits.map((h) =>
        `<a class="sr-item" href="#/topic/${h.key}"><div class="sr-title">${esc(h.title)}</div><div class="sr-meta">${esc(h.section)}</div></a>`
      ).join("");
      box.hidden = false;
    }
    input.addEventListener("input", run);
    input.addEventListener("focus", run);
    input.addEventListener("keydown", (e) => {
      const items = [...box.querySelectorAll(".sr-item")];
      if (e.key === "ArrowDown") { e.preventDefault(); active = Math.min(active + 1, items.length - 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); active = Math.max(active - 1, 0); }
      else if (e.key === "Enter") { if (items[active]) { location.hash = items[active].getAttribute("href").slice(1); input.blur(); } return; }
      else if (e.key === "Escape") { box.hidden = true; input.blur(); return; }
      items.forEach((it, i) => it.classList.toggle("active", i === active));
      if (items[active]) items[active].scrollIntoView({ block: "nearest" });
    });
    document.addEventListener("click", (e) => { if (!e.target.closest(".topbar-search")) box.hidden = true; });
    box.addEventListener("click", () => { box.hidden = true; input.value = ""; });
    // "/" focuses search
    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && document.activeElement !== input && !/input|textarea/i.test(document.activeElement.tagName)) {
        e.preventDefault(); input.focus();
      }
    });
  }

  /* =======================================================================
     ROUTER
     ======================================================================= */
  function parseHash() {
    const h = location.hash.replace(/^#\/?/, "");
    if (!h || h === "") return { view: "home" };
    const parts = h.split("/");
    if (parts[0] === "section" && parts[1]) return { view: "section", id: parts[1] };
    if (parts[0] === "topic" && parts[1] && parts[2]) return { view: "topic", key: parts[1] + "/" + parts[2] };
    return { view: "home" };
  }

  function route() {
    const r = parseHash();
    document.body.classList.remove("nav-open");
    if (r.view === "section") {
      const s = DEPTH.sections.find((x) => x.id === r.id);
      if (s) { renderSection(s); renderSidebar({ view: "section", id: r.id }); document.title = s.title + " · Depth Library"; return; }
    }
    if (r.view === "topic") {
      const entry = DEPTH._topicIndex.get(r.key);
      if (entry) { renderTopic(entry); renderSidebar({ view: "topic", key: r.key }); document.title = entry.topic.title + " · Depth Library"; return; }
    }
    renderHome();
    renderSidebar({ view: "home" });
    document.title = "Coverage Dashboard · Depth Library";
  }

  function updateGlobalProgress() {
    const p = Math.round(overallProgress() * 100);
    const fill = el("#globalProgressFill"), label = el("#globalProgressLabel");
    if (fill) fill.style.width = p + "%";
    if (label) label.textContent = p + "%";
  }

  /* =======================================================================
     BOOT
     ======================================================================= */
  function boot() {
    buildIndex();
    corpus = buildSearchCorpus();

    // theme
    const savedTheme = store.get("theme", null) ||
      (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", savedTheme);
    el("#themeToggle").textContent = savedTheme === "dark" ? "☀️" : "🌙";

    el("#themeToggle").addEventListener("click", () => {
      const cur = document.documentElement.getAttribute("data-theme");
      const nxt = cur === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", nxt);
      el("#themeToggle").textContent = nxt === "dark" ? "☀️" : "🌙";
      store.set("theme", nxt);
      route(); // re-render so mermaid picks up the theme
    });

    // nav collapse toggles (delegated)
    el("#sidebar").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-toggle]");
      if (!btn) return;
      const collapsed = store.get("nav.collapsed", {});
      collapsed[btn.dataset.toggle] = !collapsed[btn.dataset.toggle];
      store.set("nav.collapsed", collapsed);
      btn.closest(".nav-section").classList.toggle("collapsed");
    });

    // mobile nav
    el("#menuToggle").addEventListener("click", () => document.body.classList.toggle("nav-open"));
    el("#scrim").addEventListener("click", () => document.body.classList.remove("nav-open"));

    wireSearch();
    window.addEventListener("hashchange", route);
    route();
    updateGlobalProgress();
  }
})();
