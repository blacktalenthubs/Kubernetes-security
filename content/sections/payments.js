/* =========================================================================
   SECTION: Payments Engineering
   How money moves — issuing, acceptance, tokenization, authentication,
   messaging, and the money-movement lifecycle from tap to settlement.
   ========================================================================= */
DEPTH.registerSection({
  id: "payments",
  title: "Payments Engineering",
  icon: "💳",
  blurb: "How money actually moves: the four-party model, wallet provisioning, network tokenization, EMV/contactless, 3-D Secure, ISO messaging, and the road from authorization to settlement.",
  topics: [

    /* ------------------------------------------------------------------ */
    {
      id: "rails-and-lifecycle",
      title: "Payment Rails & the Authorization Lifecycle",
      week: 1,
      minutes: 40,
      tags: ["four-party model", "authorization", "clearing", "settlement", "issuer", "acquirer"],
      summary: "The four-party model and the full life of a card transaction — authorization, clearing, settlement — and who holds risk at each hop.",
      context: `
Every card payment is a **messaging problem wrapped around a risk problem**. Before you can reason about tokenization, EMV, or fraud, you need the skeleton: **who talks to whom, in what order, and who is on the hook if it goes wrong.**

The dominant model is the **four-party model**:

- **Cardholder** — the person paying.
- **Merchant** — the business getting paid.
- **Acquirer** (merchant's bank / processor) — signs up the merchant, routes their transactions, funds them.
- **Issuer** (cardholder's bank) — issued the card, holds the funds, makes the approve/decline decision.
- …with the **card network** (Visa, Mastercard, Amex, Discover) sitting in the middle as the switch and rulebook. (Amex/Discover are "three-party" — they are both issuer and acquirer.)

Two things confuse newcomers and are prime interview fodder: **authorization is not payment**, and **money does not move when you tap.** Authorization is a *promise* (a hold); the actual money moves later during **clearing and settlement**, often T+1 or T+2.`,
      architecture: `
### The three phases

| Phase | What happens | Timing | Money moved? |
|---|---|---|---|
| **Authorization** | Real-time yes/no. Issuer checks funds, risk, controls; places a hold. | ~1–2 seconds | No — a hold only |
| **Clearing** | Networks exchange the final transaction records; amounts reconciled (e.g., tip added). | Batched, T+1 | No — bookkeeping |
| **Settlement** | Net funds move between issuer and acquirer via the network; merchant funded. | T+1 / T+2 | **Yes** |

### Who carries risk
- Between **auth and settlement** the merchant has shipped/served but not been paid — this is why auth *approval rate* matters so much commercially.
- **Interchange** (fee paid by acquirer → issuer) and **scheme fees** (paid to the network) are set here; interchange is the largest cost line in card acceptance.
- **Liability shift** (chargebacks) is governed by network rules — EMV, 3-D Secure, and tokenization all move liability around, which is the *whole point* of adopting them.`,
      diagram: `sequenceDiagram
    autonumber
    participant C as Cardholder
    participant M as Merchant / POS
    participant A as Acquirer
    participant N as Card Network
    participant I as Issuer
    C->>M: Tap / dip / enter card
    M->>A: Auth request (amount, PAN/token)
    A->>N: Route by BIN
    N->>I: Auth request
    I->>I: Funds + risk + controls check
    I-->>N: Approve / Decline (+ hold)
    N-->>A: Response
    A-->>M: Response
    M-->>C: Receipt
    Note over M,I: --- later, batched ---
    M->>A: Batch capture
    A->>N: Clearing records
    N->>I: Clearing
    I->>N: Settlement funds (net)
    N->>A: Settlement funds (net)
    A->>M: Merchant funded (T+1/T+2)`,
      useCases: [
        { title: "Auth approval rate as a revenue lever", scale: "basis points = $M", body: "At Bank-of-America / Walmart scale, a **0.5% lift in authorization approval rate** on billions of transactions is a very large revenue number. Teams obsess over *false declines* — legitimate transactions the issuer wrongly rejects — because each one is lost revenue **and** a customer-trust hit." },
        { title: "Dual-message vs single-message rails", scale: "credit vs PIN debit", body: "Credit is typically **dual-message** (auth now, capture later — enables tips, partial captures). PIN debit / ATM is often **single-message** (auth + clearing together). This changes how refunds, incremental auths, and reversals behave — a classic source of production bugs." },
        { title: "Stand-in processing (STIP)", scale: "issuer downtime", body: "When an issuer is unreachable, the **network stands in** and approves/declines on the issuer's behalf using pre-set limits. It keeps commerce flowing during outages, but the issuer inherits decisions it didn't make — a real risk-governance conversation." },
      ],
      interview: [
        { q: "Walk me through what happens when I tap my phone at a coffee shop.", a: "Start with the **four-party model**, then narrate: device presents a **token** (not the PAN) + a **cryptogram**; POS builds an auth request; acquirer routes by **BIN** to the network; network forwards to the **issuer**; issuer validates the cryptogram, checks funds/risk, places a **hold**, responds approve/decline in ~1–2s. Then explicitly separate: *'that was authorization — the actual money moves later in clearing and settlement, usually T+1.'* Naming that split is what signals depth." },
        { q: "What's the difference between authorization, clearing, and settlement?", a: "**Authorization** = real-time approve/decline + a hold, no money moves. **Clearing** = networks exchange final transaction records and reconcile the true amount (e.g., tip added, partial shipment). **Settlement** = net funds actually move between issuer and acquirer. Interviewers want you to say *authorization is a promise, settlement is the payment.*" },
        { q: "Why do merchants care so much about approval rates?", a: "Every **false decline** is lost revenue on a customer who *wanted* to pay, plus churn risk. On large volumes even a few basis points is millions. It's also a cross-functional problem — issuer risk models, network routing, tokenization freshness, and 3-DS friction all move the number, which is exactly the kind of dependency map a TPM owns." },
        { q: "Who bears the loss on a fraudulent card-present vs card-not-present transaction?", a: "It depends on **liability shift rules**. For card-present, since the EMV liability shift, the party that is *least* EMV-capable generally eats it (e.g., a merchant still on magstripe). For card-not-present, **3-D Secure** can shift liability from merchant to issuer when authentication succeeds. The mechanism to always name is *the network rulebook decides, and adopting EMV/3-DS/tokenization is largely about moving that liability.*" },
      ],
      pitfalls: [
        "**Saying money moves at tap.** It doesn't — that's authorization (a hold). Money moves at settlement. This is the single most common tell of shallow knowledge.",
        "Conflating **issuer** and **acquirer**. Issuer = cardholder's bank (approves). Acquirer = merchant's bank (routes & funds).",
        "Forgetting **reversals**. A failed/duplicate auth must be reversed or it holds the customer's funds — a frequent source of angry-customer incidents.",
        "Assuming every rail is dual-message. PIN debit is often single-message, which breaks naive refund/capture logic.",
      ],
      deliverables: [
        { type: "lab", title: "Draw the four-party flow from memory", detail: "Whiteboard the tap-to-settlement sequence including reversal and clearing, in under 5 minutes, no notes." },
        { type: "artifact", title: "One-page glossary", detail: "Issuer, acquirer, network, BIN, interchange, scheme fees, STIP, dual vs single message, liability shift — one crisp line each." },
        { type: "drill", title: "Teach-back", detail: "Explain auth vs clearing vs settlement to a non-payments friend in 90 seconds. If they get it, you own it." },
      ],
      references: [
        { label: "Card network core rules (Visa/Mastercard rulebooks)", note: "The actual governance layer for liability and messaging." },
        { label: "ISO 8583", note: "The message format underneath all of this (its own topic in this section)." },
      ],
    },

    /* ------------------------------------------------------------------ */
    {
      id: "wallet-provisioning",
      title: "Digital Wallet Provisioning",
      week: 1,
      minutes: 45,
      tags: ["Apple Pay", "Google Pay", "provisioning", "TSP", "device binding", "ID&V"],
      summary: "How a card gets into Apple Pay / Google Pay / Samsung Pay — ID&V, tokenization, the green/yellow/red path, and secure element vs HCE.",
      context: `
"Provisioning" = the process of getting a card **into a wallet** so the device can pay. This is the flagship program on your résumé, and interviewers will probe whether you understand it as a **security + risk + UX** problem, not just a happy-path flow.

The core insight: the wallet never stores your real card number (**PAN**). It stores a **Device Account Number (DAN)** — a network token bound to that specific device. The most fraud-sensitive moment in the whole lifecycle is **the moment of provisioning**, because that's when an attacker with stolen card data tries to load *your* card onto *their* phone. So provisioning is gated by **Identification & Verification (ID&V)**.`,
      architecture: `
### The provisioning flow (Apple Pay as the canonical example)
1. User enters/scans card in Wallet.
2. Device + wallet provider (e.g., Apple) send card data to the **Token Service Provider (TSP)** — run by the network (Visa TSP, Mastercard MDES).
3. TSP asks the **issuer** to approve and to choose an **ID&V path**.
4. Issuer runs ID&V and returns a **decision color**.
5. On approval, TSP issues a **token (DAN)** + keys; wallet provisions it to the device's **Secure Element** (Apple/Samsung) or via **Host Card Emulation (HCE)** with cloud-based keys (typical Android).
6. Card is now "live" in the wallet, bound to that device.

### The green / yellow / red path (ID&V)
| Path | Meaning | Action |
|---|---|---|
| 🟢 **Green** | Issuer confident it's the real cardholder | Provision instantly |
| 🟡 **Yellow** | Needs step-up | One-time passcode via SMS/email/app/call center |
| 🔴 **Red** | High fraud signal | Decline provisioning |

### Secure Element vs HCE
- **Secure Element (SE):** tamper-resistant chip; keys never leave hardware. Apple Pay, Samsung Pay.
- **HCE:** keys live in the cloud (TSP); device gets short-lived **Limited Use Keys (LUKs)** replenished over the air. Common on Android. Trade-off: no dedicated chip needed, but relies on key rotation for safety.`,
      diagram: `sequenceDiagram
    autonumber
    participant U as User + Device
    participant W as Wallet (Apple/Google)
    participant T as TSP (MDES / VTS)
    participant I as Issuer
    U->>W: Add card (PAN)
    W->>T: Encrypted card data
    T->>I: Provisioning request + risk data
    I->>I: ID&V decision
    alt Green
        I-->>T: Approve
    else Yellow
        I-->>T: Step-up required
        T-->>U: OTP challenge (SMS/app/call)
        U->>T: OTP
        T->>I: Verified
        I-->>T: Approve
    else Red
        I-->>T: Decline
    end
    T-->>W: Token (DAN) + keys
    W->>U: Provision to Secure Element / HCE
    Note over U: Card now bound to this device`,
      useCases: [
        { title: "Yellow-path OTP as the fraud battleground", scale: "millions of provisions", body: "Fraudsters with stolen PANs mass-attempt provisioning. The **yellow-path OTP** is the choke point. Issuers tune the green/yellow/red thresholds constantly — too loose and fraud loads cards; too tight and legitimate users rage at OTP friction. This tension *is* the program." },
        { title: "Device binding & lifecycle events", scale: "suspend/resume/delete", body: "Tokens must handle **suspend** (phone lost), **resume** (found), and **delete** (wiped/sold). Your résumé calls out 'token lifecycle: provisioning, device binding, suspend/resume, deletion' — interviewers love asking what happens to the token when a phone is factory-reset (answer: token is deleted/deactivated at the TSP, PAN untouched)." },
        { title: "Re-provisioning on new device", scale: "phone upgrade season", body: "New phone = new Secure Element = **new token**. The PAN is re-tokenized to the new device; the old device's token is deactivated. Peak provisioning load spikes around flagship-phone launches — a capacity-planning reality." },
      ],
      interview: [
        { q: "What actually gets stored on the phone when I add a card to Apple Pay?", a: "Not the PAN. A **network token (Device Account Number)** plus cryptographic keys, held in the **Secure Element** (or via HCE with cloud keys on Android). Each transaction generates a one-time **cryptogram** from those keys. So even if the phone/token is compromised, the real card number isn't exposed and the token is useless off-device." },
        { q: "Explain the green / yellow / red path.", a: "It's the issuer's **ID&V decision** at provisioning. **Green** = provision instantly (high confidence). **Yellow** = step-up, usually an OTP through a channel the issuer already trusts (SMS/app/call center) — never through the wallet-add flow itself, or you've defeated the point. **Red** = decline. The whole art is threshold tuning: fraud loss vs OTP friction vs abandonment." },
        { q: "Secure Element vs HCE — trade-offs?", a: "SE keeps keys in tamper-resistant hardware; strongest, but needs the chip (Apple/Samsung). HCE puts keys in the cloud and streams short-lived **Limited Use Keys** to the device — works on any Android, no chip, but security leans on aggressive key rotation and the LUK's limited scope. TPM framing: SE is a hardware dependency, HCE is an availability/key-rotation dependency." },
        { q: "A fraudster has a stolen card number. Why can't they just add it to their phone and spend?", a: "Because **provisioning is gated by ID&V**, not just card data. The yellow path forces a step-up (OTP) delivered to a channel bound to the *real* cardholder — the fraudster with only the PAN can't receive it. That's why provisioning-time controls matter more than transaction-time controls for wallet fraud." },
      ],
      pitfalls: [
        "**Delivering the yellow-path OTP inside the wallet-add flow.** If the attacker controls that flow, you've verified nothing. OTP must go to a pre-existing trusted channel.",
        "Thinking the PAN lives on the phone. It's a **token (DAN)**; the PAN stays at the issuer/TSP.",
        "Ignoring lifecycle: a lost phone must **suspend** the token; a sold phone must **delete** it. Forgetting these is a real breach vector.",
        "Assuming one token per card. It's **one token per card per device** — re-provisioning a new phone mints a new token.",
      ],
      deliverables: [
        { type: "presentation", title: "10-slide 'Provisioning 101' deck", detail: "Flow, green/yellow/red, SE vs HCE, lifecycle events. Pitch it as if onboarding a new PM to the program." },
        { type: "demo", title: "Narrate a live Apple Pay add", detail: "Add a card on your own phone and talk through each step in TSP/ID&V terms as it happens." },
        { type: "lab", title: "Threshold trade-off memo", detail: "Write the green/yellow/red tuning decision as a 1-page risk memo: what moves fraud, friction, and abandonment, and how you'd A/B it." },
      ],
      references: [
        { label: "Mastercard MDES & Visa VTS", note: "The two dominant TSP platforms behind wallet tokens." },
        { label: "EMVCo Payment Tokenisation Specification", note: "The standard that defines DANs and token domain controls." },
      ],
    },

    /* ------------------------------------------------------------------ */
    {
      id: "network-tokenization",
      title: "Network Tokenization & the TSP",
      week: 2,
      minutes: 45,
      tags: ["tokenization", "TSP", "MDES", "VTS", "token domain", "PAR", "PCI scope"],
      summary: "What a network token really is, how the TSP mints and controls it, token domain restrictions, PAR, and why tokenization slashes PCI scope.",
      context: `
Tokenization is the **single highest-leverage idea in modern payments security**: replace the sensitive **PAN** with a **surrogate value (token)** that is useless outside its intended context. You ran a tokenization + P2PE program at Walmart that removed 38 systems from PCI scope — that outcome *is* the pitch.

Be precise about a distinction interviewers use to separate levels:
- **Network / EMV tokenization** — tokens minted by the network's **TSP** (Visa VTS, Mastercard MDES), usable on the rails, carry **domain controls** (device, merchant, channel). This is what powers Apple Pay and card-on-file.
- **PCI / acquirer / "vault" tokenization** — a token that's just a reference into a merchant/processor vault to shrink PCI scope; **not** a network credential and won't route on its own.

Mixing these two up is a classic interview stumble.`,
      architecture: `
### What the TSP does
- **Mints** the token (a real 16-digit PAN-format number in a token BIN range).
- Maps token ⇄ PAN in a secured vault (the merchant never sees the PAN).
- Enforces **token domain restrictions**: which device, merchant, or channel may use it.
- Issues per-transaction **cryptograms** / keys.
- Manages **lifecycle**: suspend, resume, delete, and **automatic updates** when the underlying card is reissued (lost/expired) — "token lifecycle management," so a card-on-file keeps working after a reissue.

### PAR — Payment Account Reference
A **non-sensitive** identifier that links all tokens back to the same underlying PAN **without exposing it**. Lets fraud/loyalty/analytics correlate a customer's tokens across devices and channels safely.

### Why PCI scope collapses
If a system only ever touches **tokens**, it is (largely) **out of PCI-DSS scope** because it never stores/processes/transmits the PAN. Fewer in-scope systems = smaller/cheaper audit = the 38-systems-out win.`,
      diagram: `flowchart TB
    subgraph Merchant["Merchant / Wallet (out of PAN scope)"]
      A[Checkout / device] -->|uses| TOK[Network Token + cryptogram]
    end
    TOK --> N[Card Network]
    N --> TSP[(TSP Vault<br/>token ⇄ PAN)]
    TSP -->|de-tokenize| PAN[(Real PAN)]
    PAN --> I[Issuer auth]
    TSP -. domain controls .-> TOK
    TSP -. PAR links tokens .-> PAR[[PAR: non-sensitive ref]]
    classDef vault fill:#fde,stroke:#b36;
    class TSP,PAN vault;`,
      useCases: [
        { title: "Card-on-file that survives reissue", scale: "subscriptions", body: "A subscriber's card is lost and reissued. With a **network token**, the TSP updates the token→PAN mapping automatically, so the subscription keeps billing — no failed payment, no churn. Without tokenization the merchant would need the customer to re-enter a new card (involuntary churn)." },
        { title: "PCI scope reduction at retail scale", scale: "38 systems removed", body: "Your Walmart program: tokenize across POS, mobile, and eCommerce so downstream systems handle only tokens → those systems leave PCI audit scope, cutting ~30 person-weeks of assessment per cycle. The engineering win *is* the compliance win." },
        { title: "Domain-restricted tokens contain breach blast radius", scale: "merchant-scoped", body: "A merchant-domain token stolen in a breach can't be replayed at another merchant or channel — the TSP rejects out-of-domain use. Tokenization turns a catastrophic PAN breach into a contained, revocable event." },
      ],
      interview: [
        { q: "Network token vs a PCI vault token — what's the difference?", a: "A **network token** is a real payment credential minted by the network **TSP**, routes on the rails, and carries **domain controls** + cryptograms (this powers Apple Pay / card-on-file). A **PCI/vault token** is just a reference into a merchant or processor vault to keep the PAN out of scope — it **cannot route** by itself; you must de-tokenize to a PAN first. One is a credential; the other is a scope-reduction pointer." },
        { q: "How does tokenization reduce PCI-DSS scope?", a: "PCI scope follows the PAN: any system that stores, processes, or transmits it is in scope. If you replace the PAN with a token *before* it reaches those systems, they never touch cardholder data and drop (largely) out of scope — fewer systems to assess, smaller audit, lower cost. The PAN is concentrated in one hardened vault." },
        { q: "What is PAR and why does it exist?", a: "**Payment Account Reference** — a non-sensitive ID that ties all of a card's tokens (across devices/channels) back to the same underlying account **without revealing the PAN**. It lets fraud, loyalty, and analytics correlate a customer safely, solving the problem that tokenization otherwise fragments a customer into many unlinkable tokens." },
        { q: "A network token is stolen. How bad is it vs a stolen PAN?", a: "Much less bad, if domain controls are set. The token is **restricted** to its device/merchant/channel and requires a valid cryptogram, so it can't be replayed elsewhere, and the TSP can **revoke** just that token without reissuing the card. A stolen PAN is usable anywhere and forces a card reissue. Tokenization converts a broad, persistent exposure into a narrow, revocable one." },
      ],
      pitfalls: [
        "Calling a **vault token** a 'network token' — a vault token can't route; it's just a scope pointer. Interviewers test this exact confusion.",
        "Claiming tokenization takes you 'fully out of PCI scope.' It **reduces** scope; the token vault and any de-tokenization path stay firmly in scope.",
        "Forgetting **domain controls** — a token without them is nearly as dangerous as a PAN.",
        "Ignoring **PAR**, then being unable to explain how fraud/loyalty still works once every device has its own token.",
      ],
      deliverables: [
        { type: "artifact", title: "Token taxonomy table", detail: "Network vs vault vs P2PE-encrypted: who mints, can it route, PCI scope impact, revocability. One page." },
        { type: "presentation", title: "'Why we tokenize' exec slide", detail: "Frame the 38-systems / 30-person-week win in dollars and risk, not jargon — the version you'd show a CISO/CFO." },
        { type: "lab", title: "Map PCI scope before/after", detail: "Take a fictional retailer's system diagram and shade what's in-scope pre- and post-tokenization; quantify the reduction." },
      ],
      references: [
        { label: "EMVCo Payment Tokenisation Specification", note: "Defines network tokens, domains, PAR." },
        { label: "PCI-DSS scoping guidance", note: "How CDE scope is determined and reduced." },
      ],
    },

    /* ------------------------------------------------------------------ */
    {
      id: "emv-contactless",
      title: "EMV, Contactless & the Cryptogram",
      week: 2,
      minutes: 40,
      tags: ["EMV", "chip", "contactless", "ARQC", "cryptogram", "liability shift", "NFC"],
      summary: "Why chip killed counterfeit fraud: dynamic cryptograms (ARQC), card-present flows, contactless/NFC, and the EMV liability shift.",
      context: `
**EMV** (Europay-Mastercard-Visa) is the chip standard. Its one big idea: replace the **static** magstripe data — which can be copied and replayed — with a **dynamic cryptogram** unique to each transaction. A skimmer can copy a magstripe forever; it cannot reuse a chip cryptogram, because the next transaction needs a *different* one.

This is why the **EMV liability shift** mattered so much: after the shift, whichever party is *least* chip-capable eats counterfeit-fraud losses. That single rule change is what drove the entire global chip migration you helped run across 4,700 store locations.`,
      architecture: `
### The cryptogram (ARQC) — the heart of EMV
On a chip transaction the card generates an **ARQC (Authorization Request Cryptogram)** using:
- A key derived from the card's secret key (never leaves the chip),
- Transaction-specific data (amount, currency, unpredictable number from the terminal, an **ATC** — Application Transaction Counter).

The issuer re-computes the ARQC and verifies it. Because the unpredictable number + counter change every time, the cryptogram is **single-use** — replay is defeated.

### Contactless / NFC
Same EMV cryptogram, delivered over **NFC** instead of contact plate. Tap-to-pay on cards and phones is EMV-over-NFC. Phones add tokenization on top (the DAN from wallet provisioning).

### CVM — Cardholder Verification Method
How the cardholder is verified: **PIN**, **signature**, **on-device (biometric)**, or **no-CVM** below a floor limit. Contactless often uses no-CVM under a threshold, then forces a CVM above it (why your tap sometimes asks for a PIN).

### Card-present vs card-not-present
EMV protects **card-present**. It does nothing for **CNP** (e-commerce) — you can't insert a chip into a website. That gap is exactly what **3-D Secure** and **tokenization** fill.`,
      diagram: `sequenceDiagram
    autonumber
    participant Card as Chip Card / Phone
    participant Term as Terminal
    participant I as Issuer
    Term->>Card: Unpredictable number + txn data
    Card->>Card: Generate ARQC (key + ATC + data)
    Card-->>Term: ARQC + ATC
    Term->>I: Auth request (ARQC)
    I->>I: Re-compute & verify ARQC
    alt Valid & funds ok
        I-->>Term: Approve (+ ARPC response cryptogram)
    else Invalid cryptogram
        I-->>Term: Decline (possible counterfeit)
    end`,
      useCases: [
        { title: "Chip migration crushed counterfeit fraud", scale: "industry-wide", body: "Post-EMV-shift, counterfeit card-present fraud dropped dramatically in every market that migrated — because cloned magstripes stopped working at chip terminals. Fraud didn't vanish; it **migrated to CNP** (online), which is why e-commerce fraud rose as in-store fell. Naming that displacement shows systems thinking." },
        { title: "Terminal firmware sequencing across a fleet", scale: "4,700 stores", body: "Your résumé: coordinating EMV/contactless enablement with acquirers and networks across thousands of terminals means **certification test cycles + firmware sequencing** — a rollout-wave and dependency problem as much as a crypto one." },
        { title: "No-CVM floor limits & tap fraud", scale: "contactless", body: "Contactless under the floor limit skips CVM for speed, so a lost card can tap small amounts. Issuers counter with cumulative counters that force a CVM after N taps or a spend threshold — a deliberate fraud-vs-friction tuning knob." },
      ],
      interview: [
        { q: "Why did chip cards reduce fraud when magstripe didn't?", a: "Magstripe data is **static** — copy it once, replay forever. EMV generates a **dynamic cryptogram (ARQC)** per transaction using a secret key that never leaves the chip plus an unpredictable number and a transaction counter, so each cryptogram is single-use. Cloning the chip data gets you a value that's already spent. It defeats **replay**, which is the core magstripe weakness." },
        { q: "Does EMV protect online (card-not-present) transactions?", a: "No. EMV is a **card-present** control — there's no chip to dip on a website. CNP is protected by different mechanisms: **3-D Secure** for authentication and **tokenization** for the stored credential. In fact EMV *pushed* fraud into CNP, which is why those two exist. Getting this boundary right is a common differentiator." },
        { q: "What is the EMV liability shift?", a: "A network rule change: after a set date, counterfeit card-present fraud losses fall on whichever party is **least EMV-capable**. If a chip card is used at a magstripe-only merchant and it's fraud, the merchant eats it; if a chip terminal is used with a non-chip card, the issuer does. It's an incentive mechanism — it didn't ban magstripe, it made *not* upgrading expensive." },
        { q: "What's a CVM and when is a contactless tap 'no-CVM'?", a: "**Cardholder Verification Method** — PIN, signature, on-device biometric, or none. Contactless below a **floor limit** typically uses **no-CVM** for speed; above it, the terminal forces a CVM. Issuers also force a CVM after cumulative taps to cap lost-card exposure. It's a deliberate speed-vs-risk trade." },
      ],
      pitfalls: [
        "**Claiming EMV stops online fraud.** It's card-present only; CNP needs 3-DS + tokenization.",
        "Saying the cryptogram is 'encryption of the card number.' It's a **MAC/cryptogram over transaction data** proving the real chip is present — different purpose.",
        "Treating EMV and contactless as different security models. Contactless is **EMV over NFC** — same cryptogram.",
        "Forgetting fraud **displacement** — EMV moved fraud to CNP rather than eliminating it.",
      ],
      deliverables: [
        { type: "lab", title: "Explain ARQC generation on a whiteboard", detail: "Show the inputs (key, ATC, unpredictable number, amount) and why that makes it single-use." },
        { type: "artifact", title: "CP vs CNP control map", detail: "Table: which control (EMV / 3-DS / tokenization / P2PE) protects which channel and which threat." },
        { type: "presentation", title: "'Where did the fraud go?' story", detail: "5-minute narrative of the EMV shift → CNP migration, with the liability mechanism front and center." },
      ],
      references: [
        { label: "EMVCo specifications (Books 1–4)", note: "The contact/contactless kernel and cryptogram definitions." },
        { label: "Network liability-shift bulletins", note: "Dates and rules that drove migration." },
      ],
    },

    /* ------------------------------------------------------------------ */
    {
      id: "3ds-risk-auth",
      title: "3-D Secure 2.x & Risk-Based Authentication",
      week: 3,
      minutes: 45,
      tags: ["3-D Secure", "EMV 3DS", "step-up", "frictionless", "SCA", "PSD2", "liability shift"],
      summary: "How CNP transactions get authenticated: frictionless vs challenge flows, risk-based step-up, SCA/PSD2, and the CNP liability shift.",
      context: `
**3-D Secure (3DS)** is the authentication layer for **card-not-present** (online) payments — the "three domains" being issuer, acquirer, and the interoperability domain (network). 3DS **1.0** was the clunky "Verified by Visa" password pop-up everyone hated. **3DS 2.x (EMV 3DS)** is the modern, data-rich, mostly-invisible version — and it's the one on your résumé (34% fraud reduction, 28% less step-up friction, false-decline < 2%).

The whole design goal of 2.x: **authenticate silently when you can, challenge only when you must.** That's *risk-based authentication*, and getting the balance right is the entire program.`,
      architecture: `
### The two paths
| Path | Trigger | User experience |
|---|---|---|
| **Frictionless** | Issuer's risk engine is confident from the data | Nothing — approved invisibly |
| **Challenge (step-up)** | Risk/regulatory rules require proof | OTP, biometric, or app approval |

3DS 2.x sends the issuer **~100+ data elements** (device, behavior, transaction context) so the issuer's risk engine can decide *frictionless vs challenge* in real time. More data → more frictionless → less abandonment.

### Key components
- **3DS Server** (merchant/acquirer side) — collects data, starts auth.
- **Directory Server** (network) — routes to the right issuer ACS.
- **ACS — Access Control Server** (issuer side) — makes the auth decision and runs any challenge.

### SCA & PSD2 (Europe)
**Strong Customer Authentication** mandates **two of three factors** (knowledge / possession / inherence) for many electronic payments, with **exemptions** (low value, low risk via TRA, recurring, trusted beneficiaries). 3DS 2.x is the rails that *carry* SCA + its exemptions. Even outside Europe, this two-factor thinking is now the model.

### Liability
A successful 3DS authentication typically **shifts CNP fraud liability from merchant to issuer** — the commercial reason merchants adopt it despite friction.`,
      diagram: `flowchart TB
    U[Shopper checkout] --> S[3DS Server<br/>merchant/acquirer]
    S -->|AReq + ~100 data elements| DS[Directory Server<br/>network]
    DS --> ACS[ACS — Issuer<br/>risk engine]
    ACS -->|risk score| DEC{Frictionless<br/>or challenge?}
    DEC -->|low risk / exemption| FR[Frictionless: approve invisibly]
    DEC -->|high risk / SCA required| CH[Challenge: OTP / biometric / app]
    CH --> V{Passed?}
    V -->|yes| FR
    V -->|no| DECL[Decline]
    FR --> LIAB[Liability shifts to issuer]`,
      useCases: [
        { title: "Tuning the frictionless/challenge line", scale: "34% fraud ↓, 28% friction ↓", body: "Your BofA program: push more transactions to **frictionless** without letting fraud rise. Every extra data element and better issuer model moves both curves. The KPI trio to hold simultaneously: **fraud basis points ↓, step-up rate ↓, false-decline < 2%.** That's the whole optimization." },
        { title: "SCA exemptions as a friction lever", scale: "PSD2 Europe", body: "**TRA (Transaction Risk Analysis) exemptions** let low-risk transactions skip the challenge legally. Managing exemption strategy — who claims it, acquirer vs issuer, and the fraud-rate thresholds that keep the exemption valid — is a real cross-functional program with compliance." },
        { title: "Abandonment is the hidden cost of challenge", scale: "cart drop-off", body: "Every challenge step loses some shoppers (OTP not received, confusion). So 'more authentication' is not free — it trades fraud loss for **conversion loss**. Framing 3DS as a *conversion* problem, not just a security one, is what product/exec partners care about." },
      ],
      interview: [
        { q: "What's the difference between 3DS 1.0 and 2.x?", a: "1.0 was a **static password challenge on every CNP transaction** (Verified by Visa) — high friction, high abandonment. 2.x (**EMV 3DS**) is **risk-based and data-rich**: it sends ~100+ data elements so the issuer can approve most transactions **frictionlessly** and challenge only high-risk ones, usually with an OTP or biometric rather than a password. It also supports app/in-app flows and SCA. The leap is *always-challenge* → *challenge-only-when-needed*." },
        { q: "Explain frictionless vs challenge flow.", a: "The issuer's **ACS** scores the transaction from the 3DS data. If confident (or an exemption applies), it authenticates **frictionlessly** — the shopper sees nothing. If risk or regulation demands proof, it issues a **challenge** (OTP, biometric, app approval). The design goal is to maximize frictionless while holding fraud flat — which is exactly the tuning your résumé quantifies." },
        { q: "How does 3DS relate to SCA / PSD2?", a: "**SCA** (PSD2, Europe) mandates two-factor authentication for many electronic payments, with defined **exemptions** (low value, TRA-based low risk, recurring, trusted beneficiary). **3DS 2.x is the technical rail that delivers SCA and carries the exemption flags.** So SCA is the *regulation*, 3DS is the *mechanism*. Exemption strategy is where friction is won or lost." },
        { q: "Why would a merchant accept the friction of 3DS?", a: "**Liability shift.** A successful 3DS authentication moves CNP fraud-chargeback liability from the merchant to the issuer, and (in Europe) satisfies the SCA mandate. So merchants trade a bit of conversion friction for removing fraud loss and regulatory risk — and with 2.x's frictionless path, that trade is far cheaper than it was under 1.0." },
      ],
      pitfalls: [
        "Describing 3DS as 'the OTP popup.' The OTP is only the **challenge** path; 2.x's whole point is that most transactions are **frictionless**.",
        "Forgetting **abandonment** — treating more challenges as pure upside ignores lost conversion.",
        "Conflating **SCA (regulation)** with **3DS (mechanism)**. SCA can also be met by other means; 3DS is how it's usually carried.",
        "Assuming liability shift is automatic — it depends on a **successful** authentication and the specific network rules.",
      ],
      deliverables: [
        { type: "presentation", title: "Frictionless-vs-challenge exec narrative", detail: "Explain the fraud ↔ friction ↔ conversion trade-off with your 34%/28%/<2% numbers as the proof points." },
        { type: "artifact", title: "3DS component + data-flow diagram", detail: "3DS Server → Directory Server → ACS, annotated with where risk scoring and SCA exemptions live." },
        { type: "lab", title: "SCA exemption decision tree", detail: "Build the flow: value threshold → TRA eligibility → recurring/trusted → challenge, and where liability lands at each leaf." },
      ],
      references: [
        { label: "EMVCo 3-D Secure 2.x specification", note: "The authoritative protocol definition." },
        { label: "PSD2 RTS on SCA", note: "The regulation and its exemption list." },
      ],
    },

    /* ------------------------------------------------------------------ */
    {
      id: "iso-messaging",
      title: "ISO 8583 & ISO 20022",
      week: 3,
      minutes: 35,
      tags: ["ISO 8583", "ISO 20022", "MTI", "bitmap", "data elements", "messaging"],
      summary: "The message formats under card payments (ISO 8583) and the modern richer standard (ISO 20022) taking over bank/real-time rails.",
      context: `
Under every flow in this section is a **wire format** — the actual bytes issuers, acquirers, and networks exchange. Two standards dominate:

- **ISO 8583** — the decades-old workhorse of **card** authorization/clearing messages. Compact, bitmap-based, cryptic. If you've touched card switches, you've touched 8583.
- **ISO 20022** — the modern, **XML/structured, data-rich** standard taking over **bank transfers, real-time payments (RTP, FedNow, SEPA), and cross-border (SWIFT migration)**. Far more descriptive; carries rich remittance data 8583 can't.

You don't need to hand-parse bitmaps in an interview, but you should be able to say *what these are, why 8583 is terse, and why the industry is migrating to 20022.*`,
      architecture: `
### ISO 8583 anatomy
- **MTI (Message Type Indicator)** — 4 digits classifying the message (e.g., \`0100\` auth request, \`0110\` auth response, \`0200\` financial request, \`0210\` response, \`0400\` reversal).
- **Bitmap** — a 64-bit (primary, optionally secondary) map where each set bit says "data element *n* is present." This is the compactness trick: you only send the fields you need.
- **Data elements (DE)** — the actual fields: DE2 = PAN, DE3 = processing code, DE4 = amount, DE7 = transmission datetime, DE11 = STAN (trace), DE39 = response code, DE55 = EMV/ICC data, etc.

### ISO 20022 anatomy
- **XML messages** with business-area prefixes: **pacs** (clearing & settlement), **pain** (customer→bank initiation), **camt** (account/cash management).
- Rich, nested, self-describing structures with room for **structured remittance info**, purpose codes, and full party data.

### Why migrate?
8583's terseness is also its ceiling — no room for rich remittance, sanctions/AML data, or extensibility. 20022 fixes that, at the cost of much larger messages and a heavy migration lift (SWIFT MT→MX, Fed, SEPA all on this path).`,
      diagram: `flowchart LR
    subgraph ISO8583["ISO 8583 (card rails)"]
      MTI[MTI e.g. 0100] --> BM[Bitmap: which DEs present]
      BM --> DE[DE2 PAN · DE4 amount · DE39 resp · DE55 EMV]
    end
    subgraph ISO20022["ISO 20022 (bank / RTP / cross-border)"]
      X[XML message] --> P[pacs / pain / camt]
      P --> R[Rich structured remittance + party data]
    end
    ISO8583 -. industry migration .-> ISO20022`,
      useCases: [
        { title: "Response codes drive approval-rate work", scale: "DE39", body: "**DE39** (response code) is where declines are classified — insufficient funds vs do-not-honor vs invalid-token. Approval-rate programs live in the analytics of these codes: which declines are *soft* (retry-able) vs *hard*. A TPM optimizing approval rates is really doing DE39 forensics." },
        { title: "EMV data rides in DE55", scale: "chip in the message", body: "The chip cryptogram (ARQC) and related EMV tags travel in **DE55**. So EMV, tokenization, and 8583 aren't separate worlds — the crypto from the chip topic is literally a field in the 8583 message." },
        { title: "ISO 20022 migration as a multi-year program", scale: "SWIFT / Fed / SEPA", body: "The global MT→MX (ISO 20022) migration is a textbook TPM program: immovable regulator-set dates, dozens of dependent systems, coexistence periods where both formats run in parallel, and data-truncation risk moving from rich MX back to legacy MT. Pure dependency-and-cutover management." },
      ],
      interview: [
        { q: "What is ISO 8583 and where is it used?", a: "It's the long-standing **card transaction message format** — auth, financial, reversal messages between acquirers, networks, and issuers. It's identified by a 4-digit **MTI**, uses a **bitmap** to declare which **data elements** are present (for compactness), and carries fields like PAN (DE2), amount (DE4), response code (DE39), and EMV data (DE55). Essentially every card switch speaks it." },
        { q: "How does the bitmap work and why use one?", a: "Each bit in the (primary/secondary) bitmap corresponds to a data element number; a set bit means 'this field is included.' It lets a message carry only the fields it needs instead of a fixed giant record — **compactness** was critical when these ran over slow, expensive links. The cost is readability: you can't understand the message without decoding the bitmap first." },
        { q: "Why is the industry moving to ISO 20022?", a: "8583 is terse and rigid — no room for rich remittance, structured party/purpose data, or sanctions/AML context, and it's card-centric. **ISO 20022** is structured **XML**, self-describing, and extensible, so it carries far more business context. It's becoming the standard for **bank transfers, real-time rails (FedNow, RTP, SEPA), and cross-border (SWIFT MT→MX)**. The trade-off is much larger messages and a big migration effort with coexistence periods." },
        { q: "Are 8583 and 20022 competitors?", a: "Not really head-to-head — they dominate **different rails**. 8583 rules **card** authorization; 20022 is winning **bank/interbank, real-time, and cross-border**. Card networks are gradually adding 20022 too, but the near-term reality is 8583 for card auth and 20022 for account-to-account. Framing them by rail, not as rivals, is the mature answer." },
      ],
      pitfalls: [
        "Thinking ISO 20022 replaces 8583 on **card** rails tomorrow — migration is gradual and rail-specific.",
        "Ignoring **coexistence risk**: during MT→MX migration, rich 20022 data can be **truncated** when a hop still speaks the legacy format.",
        "Not knowing a single DE (at least PAN=DE2, amount=DE4, response=DE39, EMV=DE55) — you don't need all, but zero looks shallow.",
        "Describing 20022 as 'just XML.' The value is the **structured business model** (pacs/pain/camt), not the syntax.",
      ],
      deliverables: [
        { type: "lab", title: "Decode a sample 8583 message", detail: "Take an MTI + bitmap + a few DEs and narrate what the transaction is. Even a paper exercise cements it." },
        { type: "artifact", title: "MTI + key-DE cheat sheet", detail: "0100/0110/0200/0210/0400 and DE2/3/4/11/39/55 — one card you can recall under pressure." },
        { type: "presentation", title: "'Why 20022' migration brief", detail: "Frame the SWIFT/Fed migration as a TPM program: dates, coexistence, truncation risk, dependency map." },
      ],
      references: [
        { label: "ISO 8583 standard", note: "MTI, bitmap, data element definitions." },
        { label: "ISO 20022 (iso20022.org)", note: "pacs/pain/camt message catalog." },
      ],
    },

    /* ------------------------------------------------------------------ */
    {
      id: "fraud-disputes",
      title: "Fraud, Chargebacks & Disputes",
      week: 4,
      minutes: 40,
      tags: ["fraud", "chargeback", "dispute", "false decline", "account takeover", "risk scoring"],
      summary: "The economics of fraud vs friction, the chargeback/dispute lifecycle, false declines, account takeover, and how risk scoring ties it together.",
      context: `
Fraud is where all the prior topics pay off — and where **security meets economics.** The central truth: **fraud prevention is an optimization, not a maximization.** You can drive fraud to zero by declining everything, but you'll destroy the business with **false declines** and friction. The job is the *balance*: minimize fraud loss + false declines + friction *simultaneously*.

Your résumé shows both sides: 41% reduction in account-takeover / stored-payment abuse via MFA + device-risk scoring, and holding false-decline < 2% while cutting fraud. Those numbers only make sense as a **portfolio of trade-offs.**`,
      architecture: `
### The fraud/friction frontier
Four quantities move together:
- **Fraud loss** (approved-but-fraudulent),
- **False declines** (declined-but-legit) — often *larger* than actual fraud loss in dollars,
- **Friction / abandonment** (step-ups that lose good customers),
- **Operational cost** (manual review, disputes).

A good program moves the *whole frontier* outward (better data/models) rather than just sliding along it (blunt threshold changes).

### The chargeback / dispute lifecycle
1. **Cardholder disputes** a transaction with their issuer.
2. Issuer raises a **chargeback** (a reason code) against the acquirer/merchant.
3. Merchant can **represent** (contest) with evidence.
4. Unresolved cases escalate to network **arbitration**.
5. Networks run **excessive-chargeback monitoring** — merchants over thresholds face fines/programs.

### Attack patterns to name
- **Account takeover (ATO):** attacker seizes a legit account (credential stuffing, SIM swap) → **MFA + device-risk scoring** is the counter.
- **Card testing:** small auths to validate stolen PANs → velocity limits, CAPTCHA, device fingerprinting.
- **Friendly fraud / first-party misuse:** real cardholder disputes a real purchase → hardest to fight; needs evidence (delivery, device, prior behavior).

### Where the signals come from
Device fingerprint, behavioral biometrics, velocity, geolocation, 3DS data, token freshness, historical patterns — fused in a **risk score** that drives approve / step-up / decline.`,
      diagram: `stateDiagram-v2
    [*] --> Purchase
    Purchase --> Disputed: cardholder disputes
    Disputed --> Chargeback: issuer files reason code
    Chargeback --> Represented: merchant contests w/ evidence
    Chargeback --> Lost: no/weak evidence
    Represented --> Won: evidence accepted
    Represented --> Arbitration: still contested
    Arbitration --> Won
    Arbitration --> Lost
    Won --> [*]
    Lost --> [*]`,
      useCases: [
        { title: "False declines can cost more than fraud", scale: "hidden line item", body: "Industry studies repeatedly find merchants lose **more** revenue to false declines than to actual fraud. That reframes the whole program: a TPM who only reports 'fraud down 34%' but ignores false declines is optimizing half the equation. Holding **false-decline < 2%** *while* cutting fraud is the real achievement." },
        { title: "ATO countered by device-risk + MFA", scale: "80M accounts", body: "Your Walmart rollout: MFA + device-risk scoring to 80M accounts cut ATO / stored-payment abuse 41%. The lever isn't 'more passwords' — it's **step-up only on risky device/behavior signals**, so 95%+ of logins stay frictionless while the risky 5% get challenged." },
        { title: "Excessive-chargeback programs force action", scale: "network thresholds", body: "Cross a network's chargeback-ratio threshold and you enter a monitoring program with fines and remediation deadlines — an immovable-date TPM situation. Prevention (3DS, better risk models, clearer billing descriptors) is cheaper than the program." },
      ],
      interview: [
        { q: "How do you think about the fraud vs customer-experience trade-off?", a: "As an **optimization across four quantities**: fraud loss, **false declines**, friction/abandonment, and op cost — not fraud alone. Zero fraud is trivial (decline everything) and business-destroying. The goal is to push the *whole frontier* out with better **data and models** (device, behavioral, 3DS signals) so you challenge only genuinely risky transactions, keeping most customers frictionless. I'd report all four metrics together, because moving one silently worsens another." },
        { q: "Walk me through a chargeback.", a: "Cardholder disputes → **issuer files a chargeback** with a reason code against the acquirer/merchant → merchant can **represent** with evidence (delivery proof, device match, AVS/CVV, prior history) → unresolved goes to network **arbitration**. Networks monitor **chargeback ratios** and put excessive merchants into fine/remediation programs. Key nuance: **friendly fraud** (real customer disputing a real purchase) is the hardest and needs behavioral/delivery evidence." },
        { q: "What is a false decline and why does it matter so much?", a: "A **legitimate** transaction wrongly declined as fraud. It matters because it's often a **bigger dollar loss than fraud itself**, it churns good customers, and it's invisible if you only measure fraud caught. A mature program treats false-decline rate as a first-class KPI — your résumé's *< 2%* is exactly that discipline." },
        { q: "How would you reduce account takeover without annoying every user?", a: "**Risk-based step-up**: score each login/transaction on device fingerprint, behavior, velocity, geo, and known-good history; keep the ~95% low-risk frictionless and challenge only the risky slice with MFA. Add controls at the *sensitive* moments (adding a payment method, changing contact info) rather than every action. That's how you get a big ATO reduction with minimal friction — the 41%/80M-accounts pattern." },
      ],
      pitfalls: [
        "Optimizing **fraud alone** and ignoring **false declines** — the classic half-measured program.",
        "Treating MFA as 'apply everywhere.' Blanket MFA destroys conversion; **risk-based** step-up is the point.",
        "Confusing **friendly fraud** (first-party) with third-party fraud — they need completely different defenses.",
        "Reporting a single fraud number to execs. Always pair it with false-decline, step-up, and approval-rate to show the trade-off is managed.",
      ],
      deliverables: [
        { type: "presentation", title: "Fraud-KPI dashboard mock", detail: "Design the exec view: fraud bps, false-decline %, step-up %, approval rate, chargeback ratio — the four-quantity story on one screen." },
        { type: "lab", title: "Chargeback representment packet", detail: "For a fictional dispute, assemble the evidence you'd submit and predict win/lose. Teaches what data actually matters." },
        { type: "artifact", title: "Attack-pattern → control matrix", detail: "ATO, card testing, friendly fraud, stolen-PAN provisioning → the specific control that counters each." },
      ],
      references: [
        { label: "Visa/Mastercard chargeback reason-code guides", note: "The dispute taxonomy and representment rules." },
        { label: "Network excessive-chargeback / fraud-monitoring programs", note: "Thresholds that force remediation." },
      ],
    },

  ],
});
