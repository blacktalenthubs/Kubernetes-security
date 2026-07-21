# 📚 Depth Library — Payments & Security Interview Prep

A small, local-first portal that organizes interview prep into **sections → topics**, tracks your **coverage**, and forces real depth: every topic carries **context + architecture, a rendered diagram, production use cases, interview Q&A + pitfalls**, and a set of **deliverables you produce** (labs, demos, presentations) to prove mastery.

Built around two core domains — **Payments Engineering** and **Security & Cryptography** — plus the **Program Delivery & Leadership** craft, so it maps to broader TPM / EPM roles.

---

## Run it

No build step, no internet needed (Mermaid + Markdown are vendored locally).

```bash
python3 serve.py          # → opens http://localhost:8000
# or a custom port:
python3 serve.py 8080
```

Any static server works too (`npx serve`, VS Code Live Server, etc.). You can even open `index.html` directly, though the tiny server avoids `file://` quirks.

Your progress (reading status, deliverable checkboxes, personal notes) is saved in the browser's **localStorage** — it stays on your machine and persists between sessions. Nothing is uploaded anywhere.

---

## What's inside

| Section | Topics | Covers |
|---|---|---|
| 💳 **Payments Engineering** | 7 | Four-party model & authorization lifecycle · wallet provisioning · network tokenization/TSP · EMV & contactless · 3-D Secure 2.x · ISO 8583 / 20022 · fraud & chargebacks |
| 🔐 **Security & Cryptography** | 6 | Key management & HSMs (DUKPT, TR-31/34, RKL) · crypto primitives (AES/RSA/ECC) · TLS/mTLS · identity (FIDO2/OAuth/OIDC/SAML) · secure SDLC & threat modeling · PCI-DSS/PIN/P2PE |
| 🧭 **Program Delivery & Leadership** | 6 | Charter & scoping · dependency mapping & critical path · RAID & risk · launch readiness / go-no-go · executive communication · behavioral STAR stories |

Every topic page has:

- **🧭 Context** — why it matters, in plain language
- **🏗️ Architecture** — how it actually works, with tables
- **📊 Diagram** — a rendered Mermaid mental model
- **🏭 In production** — scale, failure modes, real scenarios (tied to real programs)
- **🎯 Interview Q&A** — likely questions with strong, structured answers
- **🕳️ Traps & gotchas** — the mistakes that reveal shallow knowledge
- **🛠️ Your deliverables** — labs / demos / presentations / artifacts you complete to prove mastery (each independently checkable)
- **📝 Your notes** — a personal scratchpad, auto-saved

## Tracking coverage

- The **Coverage Dashboard** (home) shows overall mastery, per-section progress, and a **coverage map** table (topic × week × status × deliverables done).
- Each topic has a status: **Not started → Reading → Reviewed → Mastered**. Status weights the progress bars.
- **Deliverables** are tracked separately from reading — because *reading* a topic and *being able to demo it* are different bars.
- Search (press `/`) filters across every topic, tag, and section.
- Toggle **light/dark** with the 🌙 button (top right).

---

## Updating it weekly

This is designed to grow — add topics or whole sections as your prep deepens.

**Add a topic to an existing section:** open the section file in `content/sections/` (e.g. `payments.js`) and drop a new topic object into its `topics: [ ... ]` array. Refresh.

**Add a whole new section:**

1. Copy `content/sections/_TEMPLATE.js` to `content/sections/<your-section>.js` and fill it in.
2. Add one line to `index.html`, next to the other content `<script>` tags:
   ```html
   <script src="content/sections/<your-section>.js"></script>
   ```
3. Refresh. No build, no tooling.

The `_TEMPLATE.js` file documents every field. Text fields accept **Markdown**; diagrams accept **Mermaid** (`flowchart`, `sequenceDiagram`, `stateDiagram-v2`, `mindmap`, `quadrantChart`, …).

### Suggested cadence

Topics carry a `week` number that feeds the coverage map, so you can pace a study plan (e.g. Payments in weeks 1–4, Security 4–7, Program Delivery 6–7) and see the map fill in. Adjust the weeks to your own timeline.

---

## Project layout

```
index.html                     # app shell + content <script> includes
serve.py                       # tiny local server (python3 serve.py)
assets/
  css/styles.css               # light/dark theme, all styling
  js/app.js                    # engine: routing, rendering, coverage tracking, search
  vendor/
    marked.min.js              # Markdown rendering (vendored)
    mermaid.min.js             # diagram rendering (vendored)
content/
  sections/
    payments.js                # 💳 Payments Engineering
    security.js                # 🔐 Security & Cryptography
    program-delivery.js        # 🧭 Program Delivery & Leadership
    _TEMPLATE.js               # copy this to add a section (not loaded)
```

---

*A living document. The point isn't to finish it — it's to keep pulling each topic into more depth and reality until you can teach it, diagram it, and demo it cold.*
