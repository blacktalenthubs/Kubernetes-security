/* =========================================================================
   TEMPLATE — copy this file to add a new section (or copy one topic object
   into an existing section's `topics: [...]` array to add a topic).

   To PUBLISH a new section file:
     1. Save it as content/sections/<your-section>.js
     2. Add one line to index.html next to the other content <script> tags:
          <script src="content/sections/<your-section>.js"></script>
     3. Refresh the browser. That's it — no build step.

   Every field except `id` and `title` is optional; include what serves the
   topic. Diagrams use Mermaid syntax. Markdown is supported in text fields.
   ========================================================================= */
DEPTH.registerSection({
  id: "my-section",                 // unique, url-safe
  title: "My New Section",
  icon: "🧩",                        // any emoji
  blurb: "One-line description shown on the dashboard card and section page.",
  topics: [

    {
      id: "my-topic",               // unique within the section
      title: "My Topic",
      week: 8,                       // optional: suggested study week (drives the coverage map)
      minutes: 30,                   // optional: est. reading time
      tags: ["tag-one", "tag-two"],  // searchable
      summary: "One sentence shown under the title and in lists.",

      // --- Context + Architecture (markdown) ---
      context: `
Why this matters, in plain language. **Markdown** works: lists, tables,
\`code\`, > blockquotes, ### headings.`,
      architecture: `
How it actually works — components, flow, trade-offs. Tables are great here:

| Thing | Does what |
|---|---|
| A | ... |
| B | ... |`,

      // --- Diagram (Mermaid). Use `diagram` for one, or `diagrams: [...]` for several. ---
      diagram: `flowchart LR
    A[Start] --> B[Middle] --> C[End]`,
      // diagrams: [
      //   { title: "Flow", code: `sequenceDiagram\n  A->>B: hi` },
      //   { title: "States", code: `stateDiagram-v2\n  [*] --> Live` },
      // ],

      // --- Production use cases (string OR {title, scale, body}) ---
      useCases: [
        { title: "Real scenario", scale: "at scale", body: "What happens in production, with numbers and failure modes." },
      ],

      // --- Interview Q&A (answers are markdown) ---
      interview: [
        { q: "A likely interview question?", a: "A strong, structured answer that shows depth." },
      ],

      // --- Traps & gotchas (markdown strings) ---
      pitfalls: [
        "The common mistake and why it's wrong.",
      ],

      // --- Your deliverables. type ∈ lab | demo | presentation | artifact | drill ---
      deliverables: [
        { type: "lab", title: "Hands-on thing to build", detail: "What to do to prove you own it." },
        { type: "presentation", title: "Explain it to an audience", detail: "The teach-back that cements mastery." },
      ],

      // --- References (string OR {label, note}) ---
      references: [
        { label: "Authoritative source", note: "why it's worth reading" },
      ],
    },

  ],
});
