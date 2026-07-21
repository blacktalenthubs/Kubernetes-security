/* =========================================================================
   SECTION: Program Delivery & Leadership (the TPM/EPM craft)
   Turning technical depth into shipped programs — scoping, dependencies,
   risk, launch readiness, executive communication, and behavioral stories.
   ========================================================================= */
DEPTH.registerSection({
  id: "program-delivery",
  title: "Program Delivery & Leadership",
  icon: "🧭",
  blurb: "The TPM/EPM craft that turns technical depth into shipped outcomes: charters & scoping, dependency mapping & critical path, RAID & risk, launch readiness / go-no-go, executive communication, and behavioral STAR stories.",
  topics: [

    /* ------------------------------------------------------------------ */
    {
      id: "charter-scoping",
      title: "Program Charter & Scoping from Zero",
      week: 6,
      minutes: 35,
      tags: ["charter", "scoping", "ambiguity", "objectives", "success metrics", "stakeholders"],
      summary: "How to scope a program from ambiguity: the charter, objectives vs deliverables, success metrics, and setting boundaries before you plan.",
      context: `
Your résumé's sharpest line is *"scopes programs from zero, builds the dependency map, and drives to launch against immovable dates."* Scoping from ambiguity is the defining EPM skill — anyone can run a well-defined project; the value is **imposing structure where there is none.**

The **charter** is the instrument. It's the one-page contract that answers *why are we doing this, what does done look like, who's involved, and what's in vs out* — **before** anyone builds a plan. Skipping it is why programs drift: without a charter, scope creep has nothing to push against.`,
      architecture: `
### Anatomy of a program charter
| Element | The question it answers |
|---|---|
| **Problem / why now** | What business/regulatory pain forces this? |
| **Objectives** | The *outcomes* (not tasks) — e.g., "reduce CNP fraud 30% without raising false declines" |
| **Success metrics** | How we'll *measure* done — quantified KPIs |
| **Scope: in / out** | Explicit boundaries — the *out* list prevents creep |
| **Key stakeholders / RACI** | Who's Responsible, Accountable, Consulted, Informed |
| **Milestones / timeline** | The immovable dates and major gates |
| **Assumptions & constraints** | What we're betting on; what's fixed (date, budget, compliance) |
| **High-level risks** | The known unknowns that could sink it |

### Objectives ≠ deliverables ≠ tasks
- **Objective:** the outcome ("digital wallet provisioning success rate ≥ X%").
- **Deliverable:** the thing produced ("re-provisioning flow shipped to prod").
- **Task:** the work ("build the TSP callback handler").
Interviewers listen for whether you lead with **outcomes** or get lost in tasks.

### Scoping from ambiguity — the moves
1. **Interview stakeholders** to surface the real goal (often different from the stated one).
2. **Write the objective as a measurable outcome**, then get sign-off on it.
3. **Draw the boundary** — an explicit *out of scope* list is your most powerful anti-creep tool.
4. **Identify the immovable constraint** (usually a compliance/network date) and work backward.
5. **Name assumptions explicitly** so they can be challenged early, not discovered late.`,
      diagram: `flowchart TB
    A[Ambiguous ask] --> B[Stakeholder interviews<br/>find the real goal]
    B --> C[Objective as measurable outcome]
    C --> D[Charter: why / metrics / RACI]
    D --> E{Scope boundary}
    E -->|IN| F[Committed deliverables]
    E -->|OUT| G[Explicit out-of-scope list<br/>anti-creep]
    D --> H[Immovable constraint<br/>work backward from date]
    F --> I[Plan & dependency map]
    H --> I`,
      useCases: [
        { title: "The 'out of scope' list saves the launch", scale: "anti-creep", body: "On a payments program a dozen good ideas will try to attach themselves. The charter's explicit **out-of-scope** list lets you say 'yes, and that's a fast-follow — it's out of *this* scope' without being the person who says no to everything. It converts scope fights into a documented backlog decision." },
        { title: "Working backward from an immovable date", scale: "compliance deadline", body: "Your BofA vendor-SLA renegotiation protected a **Q2 2025 compliance deadline** — that only works if the date is treated as fixed and everything is scoped *backward* from it. Naming the immovable constraint first changes every downstream decision (what's cut, what's parallelized)." },
        { title: "Charter as the alignment forcing-function", scale: "matrixed orgs", body: "In a matrixed org (6 internal teams, 4 external partners on your résumé), the charter is the single artifact everyone signs. Getting that sign-off *surfaces disagreement early* — better a hard conversation at charter time than a discovered misalignment at launch." },
      ],
      interview: [
        { q: "You're handed a vague, ambiguous program. What are your first moves?", a: "First, **find the real objective** — interview stakeholders, because the stated ask often hides the actual business/regulatory driver. Then **write it as a measurable outcome** and get explicit sign-off. Draft a **charter**: objectives, success metrics, RACI, and — critically — an explicit **in/out-of-scope boundary**. Identify the **immovable constraint** (usually a compliance or network date) and plan **backward** from it. Surface **assumptions** so they're challenged now, not discovered late. The whole point is to convert ambiguity into a written contract everyone signs before we build a plan." },
        { q: "What's the difference between an objective and a deliverable?", a: "An **objective** is the *outcome* — 'reduce CNP fraud 30% while holding false declines under 2%.' A **deliverable** is the *thing produced* to get there — 'ship the risk-based step-up flow.' Tasks are the work under deliverables. I anchor programs on objectives because they keep the team pointed at *why*; teams that track only deliverables/tasks can ship everything and still miss the outcome. Leading with the measurable outcome is what separates program from project management." },
        { q: "How do you prevent scope creep?", a: "Prevention starts at the charter with an explicit **out-of-scope list** — the boundary has to be written down to be defensible. Then every new request goes through a lightweight **change-control**: does it serve the committed objective, what's the impact on the immovable date, and is it in or a documented fast-follow? Creep isn't stopped by saying no to everything; it's stopped by making the trade-off **visible and owned** — usually 'yes, as a fast-follow, here's what it costs.'" },
        { q: "How do you handle an immovable deadline you think is unrealistic?", a: "I treat the **date as fixed and flex the other levers** — scope, resources, or risk tolerance — because with compliance/network dates the date genuinely can't move. I build the plan **backward** from it, identify the critical path, and if it doesn't fit, I bring a **quantified trade-off** to the sponsors: 'to hit the date we cut X to fast-follow, or add Y resources, or accept Z risk.' Escalating with options, not just alarm, is the move — I've renegotiated a vendor SLA to protect exactly this kind of deadline." },
      ],
      pitfalls: [
        "Planning before scoping — a Gantt chart on top of an undefined objective just schedules the wrong work.",
        "Writing objectives as **tasks** ('build the API') instead of **outcomes** ('raise provisioning success to X%').",
        "No explicit **out-of-scope** list — creep then has nothing to push against.",
        "Treating an **immovable date** as negotiable, or treating scope/resources as fixed when the date is what's truly fixed.",
        "Leaving **assumptions** implicit — they become the risks you 'discover' at the worst time.",
      ],
      deliverables: [
        { type: "artifact", title: "Charter template (yours)", detail: "A one-page charter you can fill in for any program in 30 minutes — the version you'd standardize for a team." },
        { type: "lab", title: "Scope a program from a 2-line ask", detail: "Take a vague prompt and produce objective, metrics, in/out scope, and the immovable constraint." },
        { type: "presentation", title: "Charter walkthrough", detail: "Present a filled charter and defend the in/out boundary under 'but shouldn't we also…' pushback." },
      ],
      references: [
        { label: "PMI PMBOK — project charter & scope management", note: "Formal reference for the artifacts." },
        { label: "Your own templates (résumé: charter/RAID/go-no-go)", note: "You already authored these — turn them into reusable assets." },
      ],
    },

    /* ------------------------------------------------------------------ */
    {
      id: "dependency-critical-path",
      title: "Dependency Mapping & the Critical Path",
      week: 6,
      minutes: 35,
      tags: ["dependencies", "critical path", "hidden dependencies", "sequencing", "cross-functional"],
      summary: "The core TPM skill: mapping dependencies across teams, finding the critical path, and surfacing the hidden dependencies that slip launches.",
      context: `
If scoping defines *what*, dependency management defines *whether you'll actually hit the date.* Your résumé quantifies this repeatedly — "surfaced 6 hidden dependencies that would have slipped launch by 5 weeks," "critical path across POS firmware, payment gateway, and eCommerce." **Finding the dependency nobody else saw is the single most valuable thing a TPM does.**

The **critical path** is the longest chain of dependent work — the sequence where any delay delays the whole program. Everything not on it has **slack**. Knowing which is which tells you where to spend your attention and escalation capital.`,
      architecture: `
### Dependency types (name them)
| Type | Example |
|---|---|
| **Finish-to-start** | Terminal firmware must ship *before* certification testing starts |
| **Cross-team** | Fraud model needs the tokenization team's PAR feed |
| **External / vendor** | Network certification slot; TSP integration window |
| **Resource** | One HSM/key-ceremony team both programs need |
| **Regulatory** | Audit sign-off gates go-live |

### Finding hidden dependencies (the real skill)
Hidden dependencies live in the **seams between teams** — where each team assumes the other owns it. Techniques:
- **Walk the flow end-to-end** and ask each owner "what do you need from someone else, and who needs something from you?"
- **Ask the 'what has to be true' question** for each milestone — often uncovers an unstated prerequisite.
- **Follow the data and the environments** — shared test environments, certs, and key material are classic hidden coupling.
- **Interview the skeptics** — the senior engineer who says "this won't work until…" is naming a dependency.

### Critical path & slack
- Map tasks → durations → dependencies → find the **longest path** = critical path.
- **Slack/float** = how long a non-critical task can slip without moving the end date.
- **Compression**: **fast-tracking** (parallelize what was sequential — adds risk) or **crashing** (add resources to critical tasks — adds cost). You trade risk/cost to protect the date.

### The living dependency map
Not a one-time diagram — a **maintained artifact** reviewed in your cadence, because dependencies change as the program moves. Owners, dates, and status per dependency; escalate the ones going red.`,
      diagram: `flowchart LR
    A[Firmware build] --> B[Cert testing]
    B --> C[Terminal rollout]
    D[Payment gateway] --> C
    E[eCommerce integration] --> F[Go-live gate]
    C --> F
    G[Fraud model] -.needs PAR feed.-> H[Tokenization team]
    H --> E
    C -. CRITICAL PATH .-> F
    classDef crit fill:#ffe0e0,stroke:#c33,stroke-width:2px;
    class A,B,C,F crit;`,
      useCases: [
        { title: "The 6 hidden dependencies", scale: "5 weeks saved", body: "Your Walmart cross-channel map surfaced 6 dependencies across POS firmware, gateway, and eCommerce that would have slipped launch 5 weeks. The lesson interviewers want: those weren't in any team's plan because each sat in the *seam between* teams — found only by walking the flow end-to-end and asking 'what has to be true.'" },
        { title: "Certification slots as external critical-path items", scale: "network windows", body: "Network/acquirer certification test cycles have fixed, scarce slots. If cert is on the critical path (it usually is for EMV/terminal work), a missed slot can cost weeks. TPMs book these **early** and treat the external date as immovable — you can't crash a vendor's calendar." },
        { title: "Fast-track vs crash to protect a date", scale: "compression", body: "When the critical path won't fit, you either **fast-track** (run cert prep in parallel with late firmware — accepting rework risk) or **crash** (add engineers to the bottleneck — accepting cost). Bringing that explicit risk/cost trade to sponsors, rather than silently slipping, is the professional move." },
      ],
      interview: [
        { q: "How do you find dependencies nobody else has spotted?", a: "I **walk the flow end-to-end** and, for every milestone, ask two questions to each owner: 'what do you need from someone else to start?' and 'who's waiting on you?' The hidden ones live in the **seams between teams**, where each assumes the other owns it. I also chase **shared resources** (test environments, certs, key material, one HSM team) and **interview the skeptics** — the senior engineer saying 'this won't work until X' is naming a dependency. Then I write them into a **living map** with owners and dates, not a one-time diagram." },
        { q: "What is the critical path and why does it matter?", a: "It's the **longest chain of dependent work** — the sequence where any slip moves the launch date. It matters because it tells you **where to spend attention**: delays *on* the path are program delays; delays *off* it (within their slack) aren't. I focus escalation and buffer on critical-path items and let non-critical work flex within its float. Without knowing the critical path, you treat every delay as equally urgent, which wastes your limited escalation capital." },
        { q: "Your critical path shows you'll miss the date. What do you do?", a: "Quantify first — how much are we over and *where* on the path. Then choose a compression lever with eyes open: **fast-track** (parallelize sequential work, accepting rework/integration risk) or **crash** (add resources to the bottleneck, accepting cost). If neither closes the gap, I take a **scope trade** to sponsors — cut X to fast-follow to protect the date — with the options and their costs laid out. The failure mode is silently absorbing the slip; the move is surfacing it early with choices." },
        { q: "How do you manage a dependency on an external vendor you don't control?", a: "Make it **visible and contractual**: get the commitment into an SOW/SLA with dates, build **buffer** around it because you can't crash someone else's calendar, and set up **early-warning** signals (regular checkpoints, not just milestone dates). Book scarce slots (like network certification) early. And have a **fallback** — I've recovered at-risk vendor deliverables by escalating against SOW commitments and, in one case, renegotiating an SLA to protect a compliance deadline. Treat external dependencies as the highest-risk items on the map." },
      ],
      pitfalls: [
        "Mapping only **within-team** work and missing the **cross-team seams** where hidden dependencies live.",
        "Treating the dependency map as a **one-time artifact** instead of a living, reviewed one.",
        "Not knowing the **critical path**, so every delay feels equally urgent and escalation is wasted.",
        "Assuming you can **crash an external** dependency — you can't move a vendor's calendar; buffer instead.",
        "Silently absorbing a slip rather than surfacing a **quantified trade-off** to sponsors.",
      ],
      deliverables: [
        { type: "lab", title: "Build a dependency map + mark critical path", detail: "For a multi-team payments launch, diagram dependencies, compute the critical path, and identify slack." },
        { type: "artifact", title: "Hidden-dependency question set", detail: "Your reusable checklist of 'what has to be true' / seam-probing questions." },
        { type: "presentation", title: "Compression trade-off pitch", detail: "Present a fast-track-vs-crash decision to 'sponsors' with risk and cost quantified." },
      ],
      references: [
        { label: "Critical Path Method (CPM) / PERT", note: "The scheduling technique behind this." },
        { label: "Your cross-channel map (résumé)", note: "The 6-hidden-dependencies story — rehearse it as a STAR." },
      ],
    },

    /* ------------------------------------------------------------------ */
    {
      id: "raid-risk",
      title: "RAID & Risk Management",
      week: 7,
      minutes: 30,
      tags: ["RAID", "risk", "issues", "assumptions", "dependencies", "escalation", "mitigation"],
      summary: "The RAID discipline — Risks, Assumptions, Issues, Dependencies — plus how to score, mitigate, and escalate risk without crying wolf.",
      context: `
**RAID** is the TPM's operating log: **R**isks, **A**ssumptions, **I**ssues, **D**ependencies. It's how you keep a large program's uncertainty *visible and managed* instead of living in people's heads. Your résumé leans on this — weekly RAID reviews, 7 executive escalations including a blocked certification and a vendor SLA renegotiation.

The subtle skill isn't logging risks — it's **calibration**: escalating early enough to act, but not so often that leadership tunes you out. Escalation is **capital**; spend it on the things that actually need executive leverage.`,
      architecture: `
### RAID defined
| Letter | Definition | Key question |
|---|---|---|
| **Risk** | Something that *might* happen and would hurt | Probability × impact — mitigate/accept/transfer/avoid? |
| **Assumption** | Something taken as true but unverified | What if it's false? (assumptions are latent risks) |
| **Issue** | A risk that *has materialized* — happening now | Who owns resolution, by when? |
| **Dependency** | A reliance on another team/vendor/event | Is it tracked, owned, on the critical path? |

**Risk vs issue** is the distinction interviewers probe: a **risk** is future/probabilistic; an **issue** is present/certain. A risk that fires becomes an issue.

### Scoring & response
- **Score:** Probability × Impact → a heat-map priority. Focus on high-P/high-I.
- **Four responses:** **Mitigate** (reduce P or I), **Avoid** (change plan to remove it), **Transfer** (insurance, contract, vendor SLA), **Accept** (document and monitor).
- Each risk needs an **owner, a response, and a trigger** (the signal that says 'act now').

### Escalation done right
- **Escalate with options, not just alarm** — 'here's the blocker, here are 2 paths, here's my recommendation and what I need from you.'
- **Match altitude to the decision** — only escalate what genuinely needs executive authority (unblock a vendor, reallocate budget, accept risk).
- **Early beats loud** — a small early nudge beats a crisis escalation later.
- Your **7 escalations** figure is a *feature*: it signals calibrated judgment, not a firehose.

### Cadence
RAID is reviewed on a **regular rhythm** (weekly), with items aging, status changing, and reds getting airtime. The log is only useful if it's *maintained and acted on.*`,
      diagram: `quadrantChart
    title Risk heat map (Probability x Impact)
    x-axis Low Probability --> High Probability
    y-axis Low Impact --> High Impact
    quadrant-1 Escalate / mitigate now
    quadrant-2 Watch closely
    quadrant-3 Accept & monitor
    quadrant-4 Have a plan ready
    Vendor cert slip: [0.7, 0.85]
    HSM ceremony delay: [0.4, 0.7]
    Minor UI copy: [0.3, 0.2]
    Key rotation window: [0.6, 0.5]`,
      useCases: [
        { title: "Blocked certification cycle → executive unblock", scale: "1 of 7 escalations", body: "A blocked network certification is a classic **issue** (risk materialized) sitting on the **critical path** — exactly what merits escalation, because unblocking it needs authority above the program. You escalated with a path, not just a flag, which is why it moved. That's calibrated escalation in action." },
        { title: "Vendor SLA renegotiation as risk transfer", scale: "protected Q2 deadline", body: "Renegotiating a vendor SLA to protect a compliance deadline is **risk transfer/mitigation** made concrete — you changed the contract so the risk of vendor slip was bounded and owned. Framing it as a RAID response (not just 'a negotiation') shows you think in the discipline." },
        { title: "Assumptions as the risks you forget to log", scale: "latent", body: "The dangerous risks are often unlogged **assumptions** — 'we assume the TSP window is available in Q2.' Making assumptions explicit in RAID converts them into trackable risks with triggers, so they're challenged early instead of discovered as issues at the worst moment." },
      ],
      interview: [
        { q: "What is RAID and how do you use it?", a: "**Risks, Assumptions, Issues, Dependencies** — the log that keeps a program's uncertainty visible and managed. **Risks** are future/probabilistic (scored P×I, with an owner, response, and trigger); **Assumptions** are unverified beliefs (latent risks I make explicit so they're challenged); **Issues** are risks that have already materialized and need owned resolution now; **Dependencies** are reliances I track against the critical path. I review it on a **weekly cadence**, age the items, and give the reds airtime. It's only useful if it's maintained and *acted on*, not a static spreadsheet." },
        { q: "What's the difference between a risk and an issue?", a: "A **risk** is something that *might* happen — future, probabilistic, so you mitigate/avoid/transfer/accept it *before* it fires. An **issue** is a risk that **has materialized** — it's happening now, so it needs an owner and a resolution date, not a probability. The job is to manage risks well enough that few become issues, and to convert a risk to an issue in the log the moment it triggers. Blurring the two means you're either panicking about maybes or reacting to certainties too late." },
        { q: "How do you decide when to escalate?", a: "Escalate when the decision genuinely needs **authority you don't have** — unblock a vendor, reallocate budget/resources, or formally accept a material risk — and when **acting now** beats waiting. I escalate **with options and a recommendation**, not just an alarm, so leadership can decide fast. I'm deliberately calibrated: over-escalate and you get tuned out; under-escalate and you own a preventable miss. I'd rather send a small early nudge than a loud late crisis — my track record is a *handful* of high-value escalations, not a firehose." },
        { q: "Give me your framework for responding to a risk.", a: "Score it **Probability × Impact**, then pick one of four responses: **Mitigate** (reduce likelihood or impact), **Avoid** (change the plan so it can't happen), **Transfer** (push it to a vendor/contract/insurance — e.g., an SLA), or **Accept** (document and monitor if it's low or unavoidable). Every risk gets an **owner and a trigger** — the signal that says 'act.' I focus energy on the high-probability/high-impact quadrant and consciously accept the low ones so the log stays actionable rather than a wall of noise." },
      ],
      pitfalls: [
        "Confusing **risk** (future/maybe) and **issue** (present/now) — they need different handling.",
        "Logging risks with **no owner, response, or trigger** — a list that changes nothing.",
        "**Over-escalating** — escalation is capital; spend it only where executive authority is needed.",
        "Leaving **assumptions** out of RAID — they're the latent risks that become surprise issues.",
        "Reviewing RAID irregularly — stale logs give false confidence.",
      ],
      deliverables: [
        { type: "artifact", title: "RAID log template", detail: "Columns: item, type, P×I, response, owner, trigger, status, age — ready to run a weekly review from." },
        { type: "lab", title: "Score & respond to 5 risks", detail: "Take a payments program, populate a RAID log, and assign a response + trigger to each." },
        { type: "presentation", title: "Escalation memo", detail: "Write a real escalation: blocker, 2 options, recommendation, the specific decision you need — in under a page." },
      ],
      references: [
        { label: "RAID log practice / PMI risk management", note: "Standard risk response taxonomy." },
        { label: "Your 7-escalation record (résumé)", note: "Each is a ready STAR story on calibrated judgment." },
      ],
    },

    /* ------------------------------------------------------------------ */
    {
      id: "launch-readiness",
      title: "Launch Readiness & Go/No-Go",
      week: 7,
      minutes: 35,
      tags: ["launch readiness", "go-no-go", "readiness gates", "rollback", "peak readiness", "chaos testing"],
      summary: "Driving to launch: readiness gates, the go/no-go decision, rollback playbooks, and peak-season readiness against immovable dates.",
      context: `
Launch is where a program is judged — and where a TPM earns their keep. Your résumé is dense with this: peak readiness with **zero payment-related Sev-1 incidents**, go/no-go across 14 dependent services, wave-based rollouts with rollback exercised 3 times at zero customer impact. **Launch readiness is a discipline, not a vibe** — a set of gates that must be objectively met before the go decision.

The core idea: make the go/no-go decision **boring**. If readiness has been tracked continuously against explicit gates, the meeting just confirms what everyone already knows. Drama at go/no-go means the readiness process failed earlier.`,
      architecture: `
### Readiness gates (what 'ready' objectively means)
| Gate | Question |
|---|---|
| **Functional** | Does it meet acceptance criteria? Tests green? |
| **Performance / capacity** | Load-tested to peak + headroom? |
| **Resilience** | Chaos/failover tested? Degrades gracefully? |
| **Security / compliance** | Sign-offs, scans, audit evidence complete? |
| **Operational** | Runbooks, alerts, on-call, dashboards live? |
| **Rollback** | Tested rollback plan with clear triggers? |
| **Support / comms** | Support briefed, stakeholders informed, comms staged? |

### The go/no-go
- A **decision meeting** with named **decision-makers** and each gate owner reporting **green/yellow/red** against pre-agreed criteria.
- **No-go criteria are set in advance** — you decide what would stop launch *before* emotions and sunk cost are in the room.
- Output: **go**, **no-go**, or **conditional go** (launch with named follow-ups / guardrails).

### Rollback & progressive delivery
- **Rollback playbook**: exact steps, owner, and **trigger conditions** ('if error rate > X for Y min, roll back') — decided cold, executed fast.
- **Progressive rollout**: **canary → waves → full**, so blast radius is bounded and you can halt early. Your wave-based rollouts with documented rollback are this pattern — 96% on-time waves, rollback exercised without customer impact.

### Peak readiness (the immovable-date special case)
For holiday/peak: **capacity gates, load + chaos sign-off, freeze windows**, and a go/no-go covering every dependent service. The date can't move, so readiness is about **proving** you'll survive peak, not hoping. Zero Sev-1 at peak is the outcome that proves the process.`,
      diagram: `flowchart TB
    subgraph Gates["Readiness gates (all must be green)"]
      F[Functional] & P[Perf/capacity] & Res[Resilience] & Sec[Security/compliance] & Ops[Operational] & RB[Rollback tested]
    end
    Gates --> GNG{Go / No-Go<br/>pre-agreed criteria}
    GNG -->|all green| GO[Progressive rollout<br/>canary → waves → full]
    GNG -->|red gate| NOGO[No-go / fix]
    GNG -->|minor gaps| COND[Conditional go<br/>+ named follow-ups]
    GO --> MON{Health within thresholds?}
    MON -->|yes| DONE[Full launch]
    MON -->|no: trigger hit| ROLL[Execute rollback playbook]`,
      useCases: [
        { title: "Zero Sev-1 at peak = the process worked", scale: "holiday scale", body: "Your Walmart peak: zero payment-related Sev-1 against an immovable holiday date. That outcome isn't luck — it's capacity gates, load + chaos sign-off, and a go/no-go across 14 dependent services. The interview story is *how the gates made the outcome*, not just the outcome." },
        { title: "Rollback exercised 3× at zero customer impact", scale: "wave rollout", body: "Your Brinks deployment exercised rollback 3 times with zero customer impact — proof that the rollback playbook was **real and tested**, not a paragraph nobody had run. A rollback plan you haven't executed is a hope; one you've rehearsed is a control." },
        { title: "Pre-agreed no-go criteria kill launch-day drama", scale: "decision hygiene", body: "Deciding *in advance* what would stop the launch removes sunk-cost pressure from the go/no-go room. When a red gate appears on launch day, the earlier the criteria said 'this is a no-go,' the easier the hard call is — the decision was made when everyone was calm." },
      ],
      interview: [
        { q: "How do you run a go/no-go decision?", a: "I make it **boring by design**: named decision-makers, each **readiness gate** owner reporting green/yellow/red against **criteria we agreed in advance**, and **no-go conditions set before launch week** so sunk cost can't override judgment. The gates cover functional, performance/capacity, resilience, security/compliance, operational readiness, and a **tested rollback**. The output is go, no-go, or **conditional go** with named guardrails. If the meeting is dramatic, the readiness *process* failed earlier — the decision should just confirm what continuous tracking already showed." },
        { q: "What makes a rollback plan actually useful?", a: "Three things: **exact steps with an owner**, **pre-defined trigger conditions** ('roll back if error rate > X% for Y minutes'), and — most important — that it's been **tested**, not just written. A rollback you've rehearsed is a control; one you haven't is a hope. I pair it with **progressive rollout** (canary → waves → full) so blast radius is bounded and you can halt before full exposure. On one program we exercised rollback three times in production with zero customer impact — that's the bar." },
        { q: "How do you prepare for an immovable peak date, like holiday season?", a: "Treat readiness as something you **prove**, not hope for. Set **capacity gates** (load-tested to peak plus headroom), run **chaos/failover testing** to confirm graceful degradation, institute **change-freeze windows**, and run a go/no-go covering **every dependent service** — because at peak the weakest dependency defines your reliability. The date can't move, so the plan flexes scope and adds guardrails, not the date. The proof it worked is **zero Sev-1 at peak**, which I've delivered by running exactly these gates." },
        { q: "A gate is yellow on launch day. Go or no-go?", a: "It depends on whether it hits a **pre-agreed no-go criterion** and whether there's a **guardrail** that bounds the risk. If the yellow is cosmetic or mitigated (feature flag off, extra monitoring, fast rollback ready), I'd consider a **conditional go** with named follow-ups and owners. If it touches a hard no-go line — payment correctness, security sign-off, no tested rollback — it's a **no-go**, full stop. The discipline is having decided those lines *cold*, so launch-day pressure doesn't move them." },
      ],
      pitfalls: [
        "A **go/no-go with no pre-agreed criteria** — it becomes a gut/optimism vote under sunk-cost pressure.",
        "An **untested rollback plan** — a paragraph nobody has executed is not a control.",
        "Launching **big-bang** instead of **canary → waves** — you lose the ability to bound blast radius.",
        "Forgetting **operational readiness** (runbooks, alerts, on-call) — 'it works in test' isn't 'we can run it.'",
        "At peak, checking your own service but not **every dependency** — the weakest one defines reliability.",
      ],
      deliverables: [
        { type: "artifact", title: "Go/no-go checklist + no-go criteria", detail: "Your reusable gate list with pre-agreed stop conditions and gate owners." },
        { type: "lab", title: "Write a rollback playbook", detail: "For a payments deploy: steps, owner, trigger thresholds, and how you'd rehearse it." },
        { type: "presentation", title: "Run a mock go/no-go", detail: "Facilitate the meeting: gates reported, a yellow surfaced, and you drive to go/conditional-go/no-go." },
      ],
      references: [
        { label: "SRE launch/readiness reviews; progressive delivery", note: "Canary, error budgets, rollback triggers." },
        { label: "Your peak-readiness & wave-rollout results (résumé)", note: "Zero-Sev-1 and rollback-3x stories as STARs." },
      ],
    },

    /* ------------------------------------------------------------------ */
    {
      id: "exec-communication",
      title: "Executive Communication & Status",
      week: 7,
      minutes: 30,
      tags: ["executive communication", "status reporting", "one-pager", "metrics", "storytelling", "stakeholders"],
      summary: "Communicating up: the exec one-pager, leading with the answer, choosing the right metrics, and tailoring the message by audience.",
      context: `
A program that's going well but *communicated* badly reads as a program in trouble — and vice versa. Executive communication is a distinct, learnable skill, and your résumé shows it's central to the role: a **weekly one-pager to SVP/CISO** tracking provisioning success, auth approval, fraud bps, and milestone burn-down.

The governing rule: **executives buy outcomes and decisions, not activity.** Lead with the answer, quantify status, surface the one thing you need from them, and match the altitude to the audience. Burying the ask under a wall of task updates is the most common failure.`,
      architecture: `
### Lead with the answer (BLUF)
**Bottom Line Up Front.** First sentence: are we green/yellow/red, will we hit the date, and what do you need? Then support it. Execs read top-down and may stop after line one — make line one count.

### The exec one-pager (your weekly artifact)
| Section | Content |
|---|---|
| **Status** | Overall RAG (red/amber/green) + on-track-for-date yes/no |
| **Key metrics** | The 3–5 numbers that matter (KPIs + trend arrows) |
| **Progress** | What moved since last week (outcomes, not tasks) |
| **Risks / asks** | Top risks and the *specific decisions* you need |
| **Milestones** | Burn-down against the plan |

### Choosing metrics
- **Few and meaningful** — 3–5 KPIs an exec can hold in their head, with **trend** and **target**.
- Your set is a model: **provisioning success rate, authorization approval rate, fraud basis points, milestone burn-down** — each ties an activity to a business outcome.
- Show **trend and context** (vs target, vs last period), not just a raw number.

### Tailor to audience (altitude)
| Audience | Wants |
|---|---|
| **Board / SVP** | Business impact, risk, the date, the ask — 30 seconds' worth |
| **CISO** | Risk posture, compliance status, security KPIs |
| **Peers / eng leads** | Dependencies, blockers, sequencing detail |
| **Team** | Tasks, ownership, near-term plan |
Same program, different altitude. Sending eng-level detail to a board (or vice versa) is a miscalibration.

### Delivering bad news
Early, factual, with a plan. 'We're trending red on the cert date; here's why, here are two options, here's what I need by Friday.' Executives forgive problems surfaced early with a path; they punish surprises.`,
      diagram: `flowchart TB
    BLUF[BLUF: RAG + on-track? + the ask] --> M[3-5 KPIs w/ trend vs target]
    M --> Prog[Progress = outcomes since last week]
    Prog --> RA[Top risks + specific decisions needed]
    RA --> Mile[Milestone burn-down]
    BLUF -.tailor altitude.-> Aud{Audience}
    Aud -->|Board/SVP| Biz[Impact · risk · date · ask]
    Aud -->|CISO| Sec[Risk · compliance · security KPIs]
    Aud -->|Eng leads| Dep[Dependencies · blockers]`,
      useCases: [
        { title: "The weekly one-pager to SVP/CISO", scale: "your artifact", body: "Your BofA one-pager — provisioning success, auth approval, fraud bps, burn-down — is a model exec report: 4 outcome-linked KPIs, a clear RAG, and milestone trend, on one page a busy SVP/CISO reads in a minute. The discipline of *one page* forces you to decide what actually matters." },
        { title: "Escalation as communication, not confession", scale: "7 escalations", body: "Each of your escalations is an exec-comms act: surfaced early, framed with options and a recommendation, asking for a specific decision. Executives experienced it as 'this TPM brings me solvable choices,' which is why the escalations *worked* rather than eroding confidence." },
        { title: "Different deck for CISO vs SVP vs eng", scale: "altitude", body: "The same wallet-provisioning program is a *security-posture* story to the CISO, a *business-impact-and-date* story to the SVP, and a *dependency-and-sequencing* story to eng leads. Reusing one deck for all three is the classic miscalibration; tailoring altitude is what makes you legible to each." },
      ],
      interview: [
        { q: "How do you structure an executive status update?", a: "**BLUF — bottom line up front.** First line: are we green/amber/red, will we hit the date, and what do I need from you. Then 3–5 **outcome-linked KPIs** with trend vs target, what *moved* since last update (outcomes, not a task list), top risks with the **specific decisions** I need, and milestone burn-down — ideally on **one page**. Execs read top-down and may stop after the first line, so the answer and the ask go first, not buried under activity." },
        { q: "How do you choose what metrics to report?", a: "**Few, meaningful, and outcome-linked** — 3–5 KPIs an exec can hold in their head, each tying activity to a business result and shown with **trend and target**, not a bare number. My payments set is a good template: provisioning success rate, authorization approval rate, fraud basis points, milestone burn-down. Each answers 'is the business outcome improving?' I deliberately *exclude* vanity/activity metrics — reporting everything signals you don't know what matters." },
        { q: "How do you deliver bad news to executives?", a: "**Early, factual, and with a plan.** 'We're trending red on the certification date — here's the cause, here are two options with their costs, here's the decision I need by Friday.' Executives forgive problems raised early with a path; they punish surprises and sugar-coating. I never let a red status be a launch-week discovery — the value of a weekly RAG is that leadership sees amber *before* it's red and can help while there's still room to act." },
        { q: "How do you tailor communication to different stakeholders?", a: "By **altitude**. The board/SVP wants business impact, risk, the date, and the ask in 30 seconds; the CISO wants risk posture and compliance KPIs; eng leads want dependencies, blockers, and sequencing; the team wants tasks and ownership. Same program, different cut. The skill is being **legible to each** — I'd never hand a board an eng-level dependency graph or hand engineers a one-line RAG. Matching the message to what that audience actually decides is the whole job of communicating up and across." },
      ],
      pitfalls: [
        "**Burying the answer/ask** under a wall of activity — execs may stop after line one; lead with BLUF.",
        "Reporting **too many metrics** — 3–5 outcome KPIs beat a dashboard nobody reads.",
        "Sending **one deck to every audience** — mismatched altitude makes you illegible.",
        "**Sitting on bad news** until it's red — surprise is what erodes executive trust, not problems.",
        "Reporting **activity** ('we held 6 meetings') instead of **outcomes** ('approval rate +0.5%').",
      ],
      deliverables: [
        { type: "artifact", title: "Exec one-pager template", detail: "BLUF + 3–5 KPIs + progress + risks/asks + burn-down, that you can fill weekly." },
        { type: "lab", title: "Rewrite a status update BLUF-first", detail: "Take a rambling update and compress it to answer-first, one page, with a clear ask." },
        { type: "presentation", title: "Same program, 3 audiences", detail: "Produce the board, CISO, and eng-lead versions of one update to practice altitude." },
      ],
      references: [
        { label: "BLUF / Minto Pyramid Principle", note: "Answer-first executive writing." },
        { label: "Your weekly SVP/CISO one-pager (résumé)", note: "Already a strong model — formalize it as a template." },
      ],
    },

    /* ------------------------------------------------------------------ */
    {
      id: "behavioral-star",
      title: "Behavioral Interviews & STAR Stories",
      week: 7,
      minutes: 35,
      tags: ["behavioral", "STAR", "leadership principles", "conflict", "influence", "stories"],
      summary: "Turning your résumé into a bank of crisp STAR stories — influence without authority, conflict, failure, and immovable-date delivery.",
      context: `
For EPM/TPM roles, **behavioral interviews often decide the outcome** — technical depth gets you in the room, but stories about *how you lead* get you the offer. The good news: your résumé is a **goldmine of quantified stories**. The work is packaging them into tight **STAR** narratives you can deliver in 2–3 minutes, mapped to the themes every payments/security TPM loop probes.

The most common failure isn't a lack of stories — it's **rambling**: no structure, no result, buried lede. STAR fixes that.`,
      architecture: `
### STAR
| Letter | Content | Time budget |
|---|---|---|
| **Situation** | Brief context — just enough to understand the stakes | ~15% |
| **Task** | Your specific responsibility / the goal | ~15% |
| **Action** | What **you** did (say 'I', not 'we') — the decisions and trade-offs | ~50% |
| **Result** | The **quantified** outcome + what you learned | ~20% |

Keep it **2–3 minutes.** Lead with a one-line headline so the interviewer knows where it's going.

### The themes to prepare (map your résumé to each)
| Theme | Your candidate story |
|---|---|
| **Influence without authority** | Aligning 6 internal teams + 4 external partners with no direct reports |
| **Conflict / disagreement** | Vendor SLA renegotiation; blocked cert escalation |
| **Ambiguity** | Scoping a program from zero |
| **Immovable deadline** | Q2 2025 compliance date; peak-season readiness |
| **Failure / mistake** | A slip you caught late, a wrong call — and the fix/lesson |
| **Data-driven decision** | 3DS frictionless/challenge tuning; fraud/false-decline trade |
| **Cross-functional leadership** | Cross-channel dependency map surfacing 6 hidden deps |
| **Mentorship** | Mentoring 3 junior PMs; authoring the team's templates |

### 'I' vs 'we'
Interviewers assess **you**. Use 'we' for context, but your **Actions** must be 'I decided / I built / I escalated.' TPMs especially get dinged for hiding behind the team.

### Failure stories (don't skip prep here)
Pick a **real** failure, own it without blaming, show the **specific lesson and behavior change**. 'We missed a date because I under-scoped the vendor dependency; now I front-load external commitments into the SOW' beats any humble-brag non-failure.

### Influence-without-authority (the TPM signature theme)
You almost never have direct authority over the engineers/partners you depend on. Prepare the mechanisms: **shared goals, data, dependency transparency, escalation as a last resort, and relationship capital.** This is the theme most likely to decide a TPM loop.`,
      diagram: `mindmap
  root((Your STAR bank))
    Influence w/o authority
      6 internal + 4 external partners
      shared goals + data
    Conflict
      vendor SLA renegotiation
      blocked cert escalation
    Immovable date
      Q2 2025 compliance
      peak-season zero Sev-1
    Ambiguity
      scope from zero
    Failure
      real miss + lesson + changed behavior
    Data decision
      3DS tuning
      fraud vs false-decline
    Cross-functional
      6 hidden dependencies
    Mentorship
      3 junior PMs + templates`,
      useCases: [
        { title: "One achievement → multiple themes", scale: "story reuse", body: "Your cross-channel dependency map (6 hidden deps, 5 weeks saved) answers *cross-functional leadership*, *attention to detail*, AND *influence without authority* depending on framing. Prep the core facts once, then flex the emphasis to the question asked. A dozen achievements can cover every behavioral theme." },
        { title: "The quantified result is your differentiator", scale: "numbers win", body: "Most candidates say 'it went well.' You can say '34% fraud reduction, false declines under 2%, zero-finding audits, zero Sev-1 at peak.' Numbers make stories credible and memorable — always land the STAR on a **quantified R**. Your résumé already has them; the job is to *say* them out loud, crisply." },
        { title: "Influence-without-authority is the TPM litmus test", scale: "decides the loop", body: "You aligned 6 internal teams and 4 external partners with **no direct authority**. That's the exact competency EPM loops probe hardest. Prepare the *mechanism* — how you created shared goals, used dependency transparency and data, and escalated only as a last resort — not just the outcome." },
      ],
      interview: [
        { q: "Tell me about a time you influenced without authority.", a: "Use STAR on the wallet program: **S** — deliver provisioning enhancements across 6 internal teams and 4 external partners, none reporting to me. **T** — get them to a shared plan against a fixed date. **A** — *I* built a shared objective everyone signed in the charter, made the **dependency map transparent** so each team saw how a slip hurt the others, drove decisions with **data** in a weekly cadence, and reserved **escalation** for genuine blockers rather than leading with it. **R** — launched on time, and the escalation count stayed low because alignment was built in. The mechanism — shared goals + transparency + data, escalation last — is the point, not just that it worked." },
        { q: "Tell me about a failure.", a: "Pick a **real** one, own it cleanly, end on the changed behavior. Structure: 'I under-scoped an external vendor dependency early in a program, and it surfaced late as a near-slip. **I** owned it to the sponsors immediately with a recovery plan, and we held the date by fast-tracking cert prep. The lasting change: I now **front-load external commitments into the SOW with dated milestones and buffer**, and I probe vendor dependencies first in scoping. The result is I've since *recovered* at-risk vendor deliverables instead of being surprised by them.' No blame, specific lesson, evidence it stuck." },
        { q: "Tell me about delivering under an immovable deadline.", a: "STAR on peak readiness or the Q2 compliance date: **S** — an immovable holiday/compliance date across many dependent services. **T** — ensure launch with no payment Sev-1 / no compliance miss. **A** — *I* treated the date as fixed and flexed scope, set **capacity and chaos-test gates**, ran a go/no-go across all 14 dependent services, and escalated one blocked vendor with options — even renegotiating an SLA to protect the date. **R** — peak completed with **zero payment-related Sev-1** / the compliance date held with zero findings. Land it on the number." },
        { q: "How do you keep behavioral answers from rambling?", a: "**STAR with a time budget and a headline.** I open with a one-line headline so the interviewer knows the destination, keep Situation/Task tight (~30% combined), spend the bulk on **my Actions** — the decisions and trade-offs, in 'I' language — and always close on a **quantified Result plus the lesson**, in 2–3 minutes total. The discipline is resisting the urge to narrate context; interviewers assess the *actions*, so that's where the time goes." },
      ],
      pitfalls: [
        "**Rambling** with no structure — always STAR, always land a quantified Result.",
        "Saying **'we'** through the Action — interviewers assess *you*; use 'I' for your decisions.",
        "A **fake failure** ('I work too hard') — pick a real miss, own it, show the changed behavior.",
        "Burying the **result** or leaving it vague — lead with a headline, close on the number.",
        "Over-long **Situation** — context is setup, not the story; the **Action** is the story.",
      ],
      deliverables: [
        { type: "artifact", title: "STAR story bank", detail: "Write 8–10 STAR stories from your résumé, one per behavioral theme, each ≤ 250 words with a quantified result." },
        { type: "drill", title: "Deliver each in 2–3 minutes", detail: "Record yourself; cut every story to headline + tight S/T + rich A (in 'I') + quantified R." },
        { type: "presentation", title: "Mock behavioral loop", detail: "Have someone fire 6 theme questions; answer cold in STAR. Note which stories you reuse across themes." },
      ],
      references: [
        { label: "STAR method / Amazon Leadership Principles style", note: "The dominant behavioral framework." },
        { label: "Your résumé bullets", note: "Each quantified bullet is a pre-built Result — reverse-engineer the STAR." },
      ],
    },

  ],
});
