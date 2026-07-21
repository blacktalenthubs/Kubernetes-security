/* =========================================================================
   SECTION: Security & Cryptography
   The security-engineering foundation under payments — key management,
   crypto primitives, transport security, identity, secure SDLC, and PCI.
   ========================================================================= */
DEPTH.registerSection({
  id: "security",
  title: "Security & Cryptography",
  icon: "🔐",
  blurb: "The engineering foundation: HSMs and key management (DUKPT, TR-31/34, remote key loading), crypto primitives (AES/RSA/ECC), TLS/mTLS, identity (FIDO2/OAuth/OIDC/SAML), secure SDLC & threat modeling, and PCI.",
  topics: [

    /* ------------------------------------------------------------------ */
    {
      id: "key-management-hsm",
      title: "Cryptographic Key Management & HSMs",
      week: 4,
      minutes: 50,
      tags: ["HSM", "DUKPT", "TR-31", "TR-34", "key hierarchy", "remote key loading", "key ceremony"],
      summary: "The discipline that underpins all payment security: key hierarchies, HSMs, DUKPT, TR-31/34 key blocks, and remote key loading.",
      context: `
**Key management is the hardest and most important part of applied cryptography.** Algorithms rarely fail; **key handling** does — keys leaked in logs, shared insecurely, never rotated, or stored in software. This is core to your résumé (HSM-backed key lifecycle, DUKPT, TR-31/34, remote key loading), and it's where deep security interviews separate people who *use* crypto from people who can *run a key program.*

The governing principle: a key's security is bounded by **how it's generated, stored, distributed, used, rotated, and destroyed** — the full lifecycle — not by the algorithm. Payments solves this with **hardware (HSMs)**, **key hierarchies**, and **standardized key exchange (TR-31/34)**.`,
      architecture: `
### HSM — Hardware Security Module
A tamper-resistant appliance that **generates, stores, and uses keys without ever exposing them in plaintext**. Crypto operations happen *inside* the HSM; the key never leaves in the clear. Tamper attempts **zeroize** the keys. FIPS 140-2/3 Level 3+ is the payments bar. Everything below leans on HSMs.

### Key hierarchy (wrapping)
Keys protect keys, in tiers:
- **Master Key / LMK (Local Master Key):** top of the tree, lives only in the HSM, protects everything below.
- **Key-Encrypting Keys (KEKs / ZMK):** wrap (encrypt) other keys for storage/transport.
- **Working / Data keys (DEK, PEK, etc.):** actually encrypt data or PINs; stored **wrapped** by a KEK.

You never store a working key in the clear — always **wrapped** by the key above it.

### DUKPT — Derived Unique Key Per Transaction
Every transaction uses a **different** key, derived from a **Base Derivation Key (BDK)** + the device's **KSN (Key Serial Number)**. The device holds *future* keys, not the BDK. Result: **compromise of one transaction's key reveals nothing about past or other transactions** (forward secrecy for POS PIN/encryption). This is what protects card-present PIN and P2PE at scale.

### TR-31 & TR-34 — standardized key blocks
- **TR-31:** a **key block** format that binds a key to its **usage attributes** (this key is *only* for PIN encryption, *only* for MAC, etc.) and integrity-protects them, so a key can't be maliciously repurposed ("key misuse"). Replaces insecure legacy variant methods.
- **TR-34:** **remote key distribution** using asymmetric crypto (RSA) to securely load the initial symmetric keys to a device **without a physical key-injection visit** — enabling **Remote Key Loading (RKL)**.

### Key ceremony
High-value keys are created in a **dual-control / split-knowledge** ceremony: multiple custodians each hold a component; no single person ever knows the full key. Auditable, videotaped, scripted.`,
      diagram: `flowchart TB
    LMK[(LMK / Master Key<br/>inside HSM only)] -->|wraps| KEK[KEK / ZMK<br/>key-encrypting key]
    KEK -->|wraps| WK[Working keys<br/>PIN / data / MAC]
    subgraph Device["POS device"]
      BDK[BDK-derived future keys] --> KSN[KSN counter]
      KSN --> TXK[Unique key per txn - DUKPT]
    end
    TR34[TR-34 RKL<br/>RSA-protected] -.remote load.-> Device
    WK -->|TR-31 key block<br/>binds usage| Transport[Secure key exchange]
    classDef hsm fill:#e6f0ff,stroke:#36c;
    class LMK,KEK hsm;`,
      useCases: [
        { title: "Remote key loading eliminates truck rolls", scale: "12,000 endpoints", body: "Your Brinks program: **RKL via TR-34** replaced manual key injection (a technician physically loading keys per device) across 12,000 endpoints — cutting 5 manual steps and 45% of install time. The security win (no human handling of keys) and the ops win (no truck roll) are the same change." },
        { title: "DUKPT contains a POS breach", scale: "per-transaction keys", body: "If a POS terminal is compromised, DUKPT means the attacker gets at most keys for *future* transactions on *that* device — not the BDK, not other devices, not past transactions. This is why a single skimmed terminal isn't a fleet-wide catastrophe. Forward secrecy in hardware." },
        { title: "TR-31 stops key misuse", scale: "audit finding avoided", body: "Legacy key exchange didn't bind a key to its purpose, so a PIN-encryption key could be coerced into acting as a data key to extract PINs. **TR-31 key blocks** cryptographically bind usage, closing that class of attack — and networks now *mandate* key blocks, making this a compliance deadline, not just good practice." },
      ],
      interview: [
        { q: "Why do we use HSMs instead of just encrypting keys in software?", a: "Because the key must **never exist in plaintext outside tamper-resistant hardware.** An HSM generates and uses keys internally — crypto happens *inside* the box, the key never leaves in the clear, and tamper attempts **zeroize** it. Software keys leak: into memory dumps, logs, swap, backups. HSMs (FIPS 140-2/3 L3+) give you a hardware root of trust that software can't, which is why they anchor every payment key hierarchy." },
        { q: "Explain DUKPT and what problem it solves.", a: "**Derived Unique Key Per Transaction.** Instead of a device holding one shared key, it derives a **unique key for every transaction** from a **Base Derivation Key (BDK)** and its **Key Serial Number (KSN)** — and it stores only *future* keys, never the BDK. So compromising one transaction's key reveals **nothing** about past transactions or other devices. It gives POS PIN/P2PE **forward secrecy** and contains breach blast radius to a single device's future." },
        { q: "What are TR-31 and TR-34?", a: "Both are ANSI/ASC X9 key-management standards. **TR-31** is a **key block** format that binds a key to its **allowed usage** (PIN-only, MAC-only…) and integrity-protects those attributes, preventing **key misuse** — networks now mandate it. **TR-34** defines **remote key distribution**: using RSA/asymmetric crypto to securely load initial symmetric keys to a device remotely, enabling **Remote Key Loading** without a physical key-injection visit." },
        { q: "How is a top-level key created safely?", a: "Via a **key ceremony** under **dual control and split knowledge**: multiple custodians each contribute/hold a key component, and no single person ever knows the whole key. It's scripted, witnessed, and audited, and the key is assembled *inside the HSM*. This defends against the insider threat — no one individual can compromise the master key." },
        { q: "Walk through the lifecycle of a cryptographic key.", a: "**Generate** (in HSM, good entropy) → **Distribute** (wrapped in a KEK, or via TR-34 RKL) → **Store** (wrapped by the key above it; plaintext only inside the HSM) → **Use** (inside the HSM, bound to its TR-31 usage) → **Rotate** (on schedule / on suspicion) → **Revoke/Destroy** (zeroize, with audit). Security lives in this whole chain — the algorithm is almost never the weak link." },
      ],
      pitfalls: [
        "Focusing on **algorithm choice** while ignoring **key handling** — key leakage, not AES, is what breaks systems.",
        "Storing a working key **unwrapped**. Every key below the master must be wrapped by the key above it.",
        "Confusing **TR-31** (key *block*, binds usage) with **TR-34** (remote key *distribution* via RSA). Interviewers test this pairing.",
        "Thinking DUKPT protects the BDK on the device — the device holds **derived future keys**, never the BDK itself.",
        "Skipping **rotation and destruction** — a key with no end-of-life is a standing liability.",
      ],
      deliverables: [
        { type: "lab", title: "Draw the key hierarchy + DUKPT derivation", detail: "LMK→KEK→working keys, and BDK+KSN→per-txn key, from memory." },
        { type: "artifact", title: "TR-31 vs TR-34 one-pager", detail: "What each solves, where it's used, and why networks mandate key blocks." },
        { type: "presentation", title: "RKL business case", detail: "Frame remote key loading as your Brinks win: security + ops savings from killing manual key injection." },
        { type: "drill", title: "Key-lifecycle recall", detail: "Recite generate→distribute→store→use→rotate→destroy with the control at each step in under a minute." },
      ],
      references: [
        { label: "ANSI X9.24 (DUKPT) & X9 TR-31 / TR-34", note: "The authoritative key-management standards." },
        { label: "FIPS 140-2 / 140-3", note: "HSM security certification levels." },
        { label: "PCI PIN Security Requirements", note: "Key-management controls for PIN processing." },
      ],
    },

    /* ------------------------------------------------------------------ */
    {
      id: "crypto-primitives",
      title: "Crypto Primitives: Symmetric, Asymmetric & Hashing",
      week: 5,
      minutes: 45,
      tags: ["AES", "RSA", "ECC", "hashing", "MAC", "digital signature", "symmetric", "asymmetric"],
      summary: "The toolkit: AES vs RSA vs ECC, when to use symmetric vs asymmetric, hashing/MAC/signatures, and how hybrid encryption ties them together.",
      context: `
You don't need to implement AES, but you must **choose the right primitive for a goal** and explain *why*. Interviewers probe this to see if you understand **confidentiality vs integrity vs authenticity vs non-repudiation** — four different properties that need four different tools (and are constantly confused).

The mental model:
- **Symmetric (AES):** one shared secret, **fast**, great for bulk data — but you must **share the key** securely.
- **Asymmetric (RSA/ECC):** public/private key pair, solves **key distribution** and enables **signatures**, but **slow**.
- **Hashing:** one-way fingerprint, for **integrity** (and, salted+slow, password storage).
- Real systems combine them: **hybrid encryption**.`,
      architecture: `
### The four properties (know which primitive gives which)
| Property | Meaning | Primitive |
|---|---|---|
| **Confidentiality** | No one else can read it | Encryption (AES; RSA/ECC for key exchange) |
| **Integrity** | It wasn't altered | Hash / MAC |
| **Authenticity** | It's really from the claimed sender | MAC (shared key) or digital signature (private key) |
| **Non-repudiation** | Sender can't later deny it | Digital signature only (MAC can't — both sides share the key) |

### Symmetric vs asymmetric
- **AES** — symmetric, 128/256-bit, fast, hardware-accelerated. Use **AES-GCM** for authenticated encryption (confidentiality **+** integrity in one). ECB mode is a trap (patterns leak).
- **RSA** — asymmetric; encryption + signatures; 2048/3072-bit; **slow**, large keys.
- **ECC** — asymmetric via elliptic curves; **same security as RSA at far smaller keys** (256-bit ECC ≈ 3072-bit RSA) → faster, less power. Preferred on mobile / constrained devices and increasingly everywhere (ECDSA signatures, ECDH key exchange).

### Hybrid encryption (how TLS, wallets, everything real works)
Use **asymmetric** to exchange a random **symmetric** key, then use fast **symmetric** (AES) for the actual data. You get asymmetric's key-distribution *and* symmetric's speed. This pattern is everywhere.

### Hashing, MAC, signatures
- **Hash (SHA-256):** deterministic one-way fingerprint. Integrity check. **Not** for encryption; **not** reversible.
- **MAC / HMAC:** hash + shared secret → integrity **and** authenticity, but both parties share the key (so no non-repudiation).
- **Digital signature:** hash + **private** key → integrity, authenticity, **and non-repudiation** (only the private-key holder could sign; anyone verifies with the public key).
- **Passwords:** never plain SHA-256 — use slow, salted KDFs (**bcrypt / scrypt / Argon2**) to resist brute force.`,
      diagram: `flowchart TB
    subgraph Hybrid["Hybrid encryption (the real-world pattern)"]
      direction LR
      A[Sender] -->|1. random AES key| K[Symmetric key]
      K -->|2. encrypt with recipient PUBLIC key RSA/ECC| WK[Wrapped key]
      D[Data] -->|3. AES-GCM with symmetric key| CT[Ciphertext]
      WK --> R[Recipient]
      CT --> R
      R -->|4. decrypt key w/ PRIVATE key, then AES| P[Plaintext]
    end`,
      useCases: [
        { title: "ECC on mobile & IoT payment devices", scale: "constrained hardware", body: "Wallets, secure elements, and payment terminals favor **ECC** because 256-bit ECC matches 3072-bit RSA security with far less compute, battery, and bandwidth — critical on a phone's secure element or a battery-powered terminal. When asked 'RSA or ECC for a mobile wallet,' the answer is ECC, and *why* is size/power." },
        { title: "AES-GCM as the default, not AES-CBC", scale: "authenticated encryption", body: "Modern systems use **AES-GCM** because it provides confidentiality **and** integrity in one pass — no separate MAC to get wrong. Choosing GCM over CBC-without-a-MAC is a signal you understand that encryption alone doesn't stop tampering." },
        { title: "Signatures for code/firmware integrity", scale: "supply chain", body: "Firmware updates to payment devices are **digitally signed** so the device verifies authenticity + integrity + non-repudiation before installing — blocking malicious updates. This ties directly to your device-deployment programs: signed firmware is the control." },
      ],
      interview: [
        { q: "When would you use symmetric vs asymmetric encryption?", a: "**Symmetric (AES)** for bulk data — it's fast and hardware-accelerated — *once you have a shared key.* **Asymmetric (RSA/ECC)** to solve the hard part: **securely distributing that key** and enabling **signatures**. Since asymmetric is slow, real systems use **hybrid**: asymmetric to exchange a random AES key, then AES for the data. That's how TLS, wallets, and secure messaging all work." },
        { q: "RSA vs ECC — which and why?", a: "**ECC** gives equivalent security at **much smaller keys** (256-bit ECC ≈ 3072-bit RSA), so it's faster and lighter — preferred on mobile, secure elements, and constrained devices, and increasingly the default everywhere (ECDSA/ECDH). RSA is still widespread and simpler to reason about, but for anything power/size-sensitive, ECC wins. The trade-off is compatibility/legacy vs efficiency." },
        { q: "What's the difference between a MAC and a digital signature?", a: "Both prove **integrity + authenticity**, but a **MAC** uses a **shared secret** (both parties have it), so it can't prove *which* party sent it — **no non-repudiation**. A **digital signature** uses the sender's **private** key, so only they could produce it and anyone can verify with the public key — giving **non-repudiation**. Use a MAC between two mutually-trusting parties; use a signature when the sender must be provably, publicly accountable." },
        { q: "How should passwords be stored?", a: "Never encrypted or plain-hashed. Use a **slow, salted password KDF — bcrypt, scrypt, or Argon2.** The **salt** defeats rainbow tables (each hash is unique) and the **deliberate slowness / work factor** makes brute force expensive. Plain SHA-256 is fast, which is exactly wrong for passwords. This question catches people who think 'hashing = secure' without the salt+slow nuance." },
        { q: "What does hashing give you that encryption doesn't, and vice versa?", a: "**Hashing** is one-way — you can't recover the input — so it's for **integrity/fingerprinting**, not secrecy of recoverable data. **Encryption** is reversible with a key — for **confidentiality**. Mixing them up ('let's hash the credit card so it's encrypted') is a red flag: a hash can't be decrypted back to the PAN when you need it, and isn't the right confidentiality tool." },
      ],
      pitfalls: [
        "Conflating the four properties — **encryption ≠ integrity ≠ authenticity ≠ non-repudiation.** Name which primitive gives which.",
        "Using a plain hash (SHA-256) for passwords instead of a **salted, slow KDF** (bcrypt/scrypt/Argon2).",
        "Claiming a **MAC** gives non-repudiation — it can't; both sides share the key.",
        "Using **AES-ECB** or CBC-without-a-MAC. Prefer **AES-GCM** (authenticated encryption).",
        "Saying 'ECC is more secure than RSA.' It's **equivalent security at smaller keys** — efficiency, not strength.",
      ],
      deliverables: [
        { type: "artifact", title: "Property → primitive cheat card", detail: "Confidentiality / integrity / authenticity / non-repudiation → the exact tool for each." },
        { type: "lab", title: "Diagram hybrid encryption", detail: "Show the RSA/ECC-wraps-AES-key pattern and explain why both are needed." },
        { type: "drill", title: "MAC vs signature in one breath", detail: "State the non-repudiation difference cleanly on demand." },
      ],
      references: [
        { label: "NIST SP 800-57 (key management) & FIPS 197 (AES)", note: "Algorithm and key-size guidance." },
        { label: "OWASP Password Storage Cheat Sheet", note: "Argon2/bcrypt/scrypt guidance." },
      ],
    },

    /* ------------------------------------------------------------------ */
    {
      id: "tls-mtls",
      title: "TLS & mTLS — Transport Security",
      week: 5,
      minutes: 40,
      tags: ["TLS", "mTLS", "handshake", "certificates", "PKI", "cipher suite", "forward secrecy"],
      summary: "How TLS secures data in transit, the handshake, certificates/PKI, mutual TLS for service-to-service auth, and forward secrecy.",
      context: `
**TLS** is the most deployed cryptographic protocol on earth — every \`https://\` and virtually every payment API call rides it. It's the working example of everything in the primitives topic: **hybrid encryption + certificates + signatures**, assembled into a protocol. **mTLS** (mutual TLS) extends it so **both** sides authenticate — the norm for service-to-service and partner-integration security, which is exactly your world of TSP/network/partner integrations.

TLS gives you three things at once: **confidentiality** (eavesdroppers can't read), **integrity** (tampering detected), and **authentication** (you're talking to the real server — and with mTLS, the server knows it's the real client).`,
      architecture: `
### The TLS 1.3 handshake (simplified)
1. **ClientHello** — client offers TLS version, cipher suites, and its ECDHE key share.
2. **ServerHello** — server picks the cipher, sends its key share + **certificate** (its public key, signed by a CA).
3. Client **validates the certificate chain** (up to a trusted root CA) and checks the hostname/expiry/revocation.
4. Both derive the **same symmetric session key** via **ECDHE** (Diffie-Hellman) — *without ever sending it*.
5. Application data flows under **AES-GCM** with that session key.

TLS 1.3 cut round-trips (1-RTT, optional 0-RTT), removed legacy/weak ciphers, and made **forward secrecy mandatory**.

### Certificates & PKI
A **certificate** binds an identity (hostname) to a public key, **signed by a Certificate Authority**. Trust chains up to a **root CA** in the client's trust store. This is the real-world use of digital signatures. Revocation via **CRL / OCSP**.

### Forward secrecy (PFS)
Because the session key comes from **ephemeral** ECDHE (new per session), stealing the server's long-term private key **later** does **not** decrypt **past** recorded traffic. Each session is independently protected. (Same idea as DUKPT, at the transport layer.)

### mTLS — mutual TLS
Standard TLS authenticates only the **server**. **mTLS** also makes the **client present a certificate**, so both ends are cryptographically authenticated. Used for **service-to-service**, **partner/B2B API** security, and zero-trust internal traffic — no shared API key that can leak; identity is a certificate the other side validates.`,
      diagram: `sequenceDiagram
    autonumber
    participant C as Client
    participant S as Server
    C->>S: ClientHello (versions, ciphers, key share)
    S->>C: ServerHello (cipher) + Certificate + key share
    Note over C: Validate cert chain to trusted root CA<br/>check hostname / expiry / revocation
    Note over C,S: Both derive same session key via ECDHE<br/>(never transmitted → forward secrecy)
    opt mTLS
        S->>C: CertificateRequest
        C->>S: Client Certificate
        Note over S: Validate client cert → both sides authenticated
    end
    C->>S: Application data (AES-GCM under session key)
    S->>C: Application data (AES-GCM)`,
      useCases: [
        { title: "mTLS for TSP / network / partner integrations", scale: "B2B APIs", body: "Your role integrates with token service providers, networks, and vendors. **mTLS** is the standard there: each partner presents a certificate, so neither side relies on a shared secret that could leak. Certificate lifecycle (issuance, rotation, expiry monitoring) becomes a real operational program — an expired partner cert is a Sev-1 outage waiting to happen." },
        { title: "Forward secrecy limits breach retro-damage", scale: "recorded traffic", body: "An adversary who records encrypted traffic today and steals the private key next year still can't decrypt it, because each session used an **ephemeral** key. This is why PFS is mandatory in TLS 1.3 and why 'harvest now, decrypt later' is blunted for the session layer." },
        { title: "Certificate expiry as an outage class", scale: "the classic incident", body: "Expired TLS certificates cause some of the most common, embarrassing outages in the industry. Mature orgs treat cert inventory + auto-rotation (ACME) + expiry alerting as first-class reliability work — a TPM-visible dependency across every service and partner." },
      ],
      interview: [
        { q: "Walk me through the TLS handshake.", a: "Client sends **ClientHello** (supported versions/ciphers + an ECDHE key share); server replies **ServerHello** with the chosen cipher, its **certificate**, and its key share. The client **validates the cert chain** to a trusted root CA and checks hostname/expiry/revocation. Both sides then derive the **same symmetric session key via ECDHE without transmitting it**, and application data flows under **AES-GCM**. It's hybrid encryption in protocol form: asymmetric (cert + ECDHE) to establish a symmetric session key." },
        { q: "What is mTLS and when do you use it?", a: "**Mutual TLS** — both sides present and validate certificates, not just the server. You use it for **service-to-service**, **partner/B2B APIs**, and zero-trust internal traffic, where you want cryptographic identity on *both* ends instead of a shared API key that can leak or be replayed. The cost is **certificate lifecycle management** (issuance, rotation, revocation) on every client — an operational commitment." },
        { q: "What is forward secrecy and why does it matter?", a: "**Perfect Forward Secrecy** means each session uses an **ephemeral** key (ECDHE) that's never stored, so compromising the server's long-term private key **later** can't decrypt **previously recorded** sessions. It defeats 'harvest now, decrypt later.' TLS 1.3 makes it mandatory. Conceptually it's the same forward-secrecy idea as DUKPT — a fresh key per unit of work limits blast radius backward in time." },
        { q: "How does certificate validation actually establish trust?", a: "The server's certificate is a public key **signed by a Certificate Authority.** The client verifies that signature chains up to a **root CA it already trusts** (in its trust store), and checks the certificate's **hostname, validity dates, and revocation** (OCSP/CRL). So trust is transitive: I trust the root, the root vouched for the intermediate, the intermediate vouched for this server. It's digital signatures + PKI doing the work." },
        { q: "A partner integration over mTLS suddenly fails. Where do you look first?", a: "**Certificate lifecycle** — expired or rotated cert on either side, an untrusted/updated CA chain, or a hostname/SAN mismatch, before suspecting the crypto itself. mTLS failures are overwhelmingly **operational** (cert expiry, missing intermediate, clock skew), not algorithmic. That instinct — 'check the cert chain and expiry first' — is what shows real-world experience." },
      ],
      pitfalls: [
        "Thinking TLS only gives **encryption** — it also gives **integrity** and **server authentication** (and client auth with mTLS).",
        "Confusing **TLS** (secures the channel) with **application-layer encryption** (secures the data at rest / end-to-end). You often need both.",
        "Ignoring **certificate lifecycle** — expiry/rotation causes more outages than any crypto weakness.",
        "Assuming mTLS is 'just TLS with extra steps' — the operational burden of client certs is the real design decision.",
        "Forgetting **revocation** — a valid-looking cert may be revoked; OCSP/CRL checks matter.",
      ],
      deliverables: [
        { type: "lab", title: "Inspect a real handshake", detail: "Use `openssl s_client -connect host:443` and read the cert chain, cipher, and TLS version out loud." },
        { type: "artifact", title: "TLS vs mTLS decision note", detail: "When one-way auth suffices vs when to require client certs, with the ops cost spelled out." },
        { type: "presentation", title: "Cert-lifecycle reliability brief", detail: "Frame cert inventory + rotation + expiry alerting as an outage-prevention program." },
      ],
      references: [
        { label: "RFC 8446 (TLS 1.3)", note: "The current protocol." },
        { label: "NIST SP 800-52 / OWASP TLS Cheat Sheet", note: "Deployment hardening guidance." },
      ],
    },

    /* ------------------------------------------------------------------ */
    {
      id: "identity-auth",
      title: "Identity & Access: FIDO2, OAuth 2.0, OIDC, SAML",
      week: 6,
      minutes: 50,
      tags: ["FIDO2", "WebAuthn", "OAuth 2.0", "OIDC", "SAML", "passkeys", "MFA", "authn vs authz"],
      summary: "The identity stack: authN vs authZ, OAuth 2.0 vs OIDC vs SAML, and FIDO2/WebAuthn passkeys that kill phishing.",
      context: `
Identity is where most breaches actually start (stolen/phished credentials), so this cluster is disproportionately important — and disproportionately muddled in interviews. The first job is to keep four things straight:

- **Authentication (authN):** *who are you?*
- **Authorization (authZ):** *what are you allowed to do?*
- **Federation / SSO:** logging in *once* across many systems.
- **Delegated access:** letting an app act on your behalf *without your password.*

The protocols map to these: **OAuth 2.0 = authorization/delegation**, **OIDC = authentication on top of OAuth**, **SAML = enterprise SSO (older, XML)**, **FIDO2/WebAuthn = phishing-resistant authentication (passkeys).** Mixing up OAuth and OIDC is the single most common identity interview mistake.`,
      architecture: `
### The clean mental model
| Protocol | Answers | Format | Typical use |
|---|---|---|---|
| **OAuth 2.0** | *Can this app access that resource on my behalf?* (authZ) | tokens (JWT/opaque) | "Sign in with…" delegation, API access |
| **OIDC** | *Who is this user?* (authN, built **on** OAuth) | **ID token (JWT)** | Modern consumer/SSO login |
| **SAML 2.0** | *Who is this user?* (authN, enterprise SSO) | XML assertion | Corporate SSO to SaaS |
| **FIDO2 / WebAuthn** | *Prove it's really you, un-phishably* | public-key challenge | Passkeys, hardware keys, biometrics |

### OAuth 2.0 (delegated authorization)
Roles: **Resource Owner** (you), **Client** (the app), **Authorization Server** (issues tokens), **Resource Server** (the API). The **Authorization Code flow + PKCE** is the modern default: the client gets an **access token** (and often a **refresh token**) to call APIs *without ever seeing your password.* OAuth is about **access**, **not** identity — using a raw OAuth access token as "proof of who you are" is a classic security bug.

### OIDC (authentication layer)
OIDC adds an **ID token** (a signed **JWT** with claims: sub, email, etc.) so the app learns *who logged in*. It's OAuth **plus** a standard identity layer — this is what "Sign in with Google" actually is.

### SAML
The **enterprise SSO** veteran: browser redirects an **XML assertion** from an **Identity Provider (IdP)** to a **Service Provider (SP)**. Heavier than OIDC but entrenched in corporate SaaS.

### FIDO2 / WebAuthn — passkeys
Public-key authentication: the device holds a **private key**; the server holds the **public key**. Login = sign a server **challenge**. Crucially, the credential is **bound to the origin (domain)**, so a phishing site **can't** use it — the signature won't validate for the wrong domain. **This is why passkeys kill phishing**, the attack MFA-over-SMS doesn't stop.`,
      diagram: `sequenceDiagram
    autonumber
    participant U as User / Browser
    participant App as Client App
    participant AS as Authorization Server / IdP
    participant API as Resource Server (API)
    U->>App: Click "Sign in with…"
    App->>AS: Auth request (Authorization Code + PKCE)
    U->>AS: Authenticate (passkey / password+MFA)
    AS-->>App: Authorization code
    App->>AS: Exchange code (+ PKCE verifier)
    AS-->>App: Access token (+ ID token if OIDC) + refresh token
    App->>API: Call API with access token
    API-->>App: Protected resource
    Note over U,AS: OIDC ID token = "who". OAuth access token = "what access".`,
      useCases: [
        { title: "Passkeys as the phishing endgame", scale: "ATO defense", body: "Because a WebAuthn credential is **origin-bound**, a user *cannot* be tricked into using it on a look-alike phishing domain — the private key won't sign for the wrong origin. This closes the gap that SMS/TOTP MFA leaves open (a phished OTP still works for the attacker). For payment-account security, passkeys are the strongest available authN and directly cut ATO." },
        { title: "OAuth token scoping limits blast radius", scale: "least privilege", body: "A well-scoped access token grants only \`read:transactions\`, not full account control, and expires quickly with a refresh token behind it. If leaked, the damage is bounded to that scope and short window. Poorly scoped, long-lived tokens are a top API-breach cause — token scope + lifetime is a design decision, not a default." },
        { title: "SAML entrenchment in the enterprise", scale: "corporate SaaS", body: "Even as OIDC wins new builds, large enterprises run thousands of **SAML** integrations to SaaS. Any identity-modernization program must handle **SAML↔OIDC coexistence** and migration — a real dependency-heavy TPM effort, not a flip-the-switch." },
      ],
      interview: [
        { q: "What's the difference between OAuth 2.0 and OIDC?", a: "**OAuth 2.0 is authorization** — it issues an **access token** so an app can act on your behalf against an API *without your password*. It says nothing reliable about *who you are.* **OIDC is authentication built on top of OAuth** — it adds a signed **ID token (JWT)** with identity claims, so the app learns *who logged in.* Rule of thumb: OAuth = **access/what**, OIDC = **identity/who**. Using a raw OAuth access token as proof of identity is a well-known anti-pattern OIDC exists to fix." },
        { q: "Why are FIDO2/WebAuthn passkeys phishing-resistant when SMS MFA isn't?", a: "A passkey is a **public/private key pair bound to the website's origin (domain).** Authentication means signing a server challenge with the private key, and the signature only validates for the **correct origin** — so a phishing look-alike domain gets a signature it can't use. There's also **no shared secret to steal.** SMS/TOTP send a code the user can be tricked into typing into a fake site (or that's SIM-swapped), which the attacker replays. Passkeys remove the human-rerouteable secret entirely." },
        { q: "AuthN vs authZ — and where do systems get it wrong?", a: "**AuthN** proves *who you are*; **authZ** decides *what you may do.* Systems fail by **authenticating but not properly authorizing** — e.g., any logged-in user can hit an endpoint that returns another user's data (broken object-level authorization, IDOR). Strong login doesn't imply correct permissions; the two need separate, deliberate enforcement. Naming that gap (authN ≠ authZ) is what interviewers listen for." },
        { q: "OAuth vs SAML — when would you pick each?", a: "**SAML** is the **enterprise SSO** standard — XML assertions, browser-redirect, deeply entrenched in corporate SaaS; pick it when integrating with existing enterprise IdPs. **OAuth/OIDC** is lighter, JSON/JWT, mobile- and API-friendly — the default for **new consumer and API** scenarios. In practice big orgs run both and you manage coexistence. Both do federation; SAML is legacy-heavy, OIDC is the modern build." },
        { q: "What's in a JWT and how do you validate one safely?", a: "A **JWT** has a header, claims payload (sub, iss, aud, exp…), and a **signature**. Validate by: verifying the **signature** against the issuer's key, checking **iss/aud** match your app, and enforcing **exp** (not expired). Pitfalls: accepting \`alg: none\`, not verifying **aud** (token meant for another service), and treating an unverified JWT as trusted. Also don't put secrets in a JWT — the payload is only **base64, not encrypted.**" },
      ],
      pitfalls: [
        "**Using OAuth for authentication.** OAuth is authorization; use **OIDC** to learn *who* the user is.",
        "Treating a **JWT payload as encrypted** — it's base64-encoded and readable. Sign it; don't put secrets in it.",
        "Confusing **authN and authZ** — strong login doesn't grant correct permissions (IDOR/broken object-level authZ).",
        "Believing **SMS MFA** is phishing-resistant — it isn't; passkeys/WebAuthn are.",
        "Long-lived, over-scoped access tokens — scope narrowly and keep lifetimes short with refresh tokens.",
      ],
      deliverables: [
        { type: "artifact", title: "Protocol map", detail: "OAuth / OIDC / SAML / FIDO2 → what each answers (authN vs authZ), format, and when to use it." },
        { type: "lab", title: "Trace an Authorization Code + PKCE flow", detail: "Diagram every hop and label where the ID token vs access token appear." },
        { type: "presentation", title: "'Why passkeys' security brief", detail: "Explain origin-binding and no-shared-secret as the reason passkeys beat SMS MFA — pitched to a risk exec." },
        { type: "drill", title: "OAuth-vs-OIDC one-liner", detail: "Nail 'access vs identity' cleanly, on demand." },
      ],
      references: [
        { label: "RFC 6749 (OAuth 2.0) + OAuth 2.1 draft", note: "Authorization framework; 2.1 bakes in PKCE." },
        { label: "OpenID Connect Core & W3C WebAuthn", note: "Identity layer and passkey standard." },
      ],
    },

    /* ------------------------------------------------------------------ */
    {
      id: "secure-sdlc-threat-modeling",
      title: "Secure SDLC & Threat Modeling",
      week: 6,
      minutes: 40,
      tags: ["secure SDLC", "threat modeling", "STRIDE", "shift left", "SAST", "DAST", "OWASP"],
      summary: "Building security in, not bolting it on: shift-left SDLC, threat modeling with STRIDE, and the SAST/DAST/SCA testing stack.",
      context: `
Security you add at the end is expensive and weak; security **designed in** is cheap and strong. A **Secure SDLC** embeds security at every phase, and **threat modeling** is its highest-leverage practice — you find design flaws on a whiteboard, before a line of code exists, when they cost almost nothing to fix. Your résumé lists "secure system design & threat modeling," and as a TPM this is where you **facilitate**: you don't have to be the deepest engineer in the room, you have to *run the session that surfaces the risks.*

The mantra is **shift left** — move security earlier — but the honest version is **shift everywhere**: design, code, build, deploy, run.`,
      architecture: `
### Security across the SDLC
| Phase | Security activity |
|---|---|
| **Requirements** | Abuse cases, security/compliance requirements, data classification |
| **Design** | **Threat modeling**, secure architecture review, trust boundaries |
| **Implementation** | Secure coding standards, **SAST** (static analysis), secrets scanning, peer review |
| **Testing** | **DAST** (dynamic), **SCA** (dependency/CVE scanning), pen testing |
| **Deploy** | Hardened config, IaC scanning, signed artifacts |
| **Operate** | Monitoring, logging, incident response, patch management |

### Threat modeling with STRIDE
For each component/data flow, ask what an attacker could do, using **STRIDE**:
| Letter | Threat | Property violated |
|---|---|---|
| **S** | Spoofing | Authentication |
| **T** | Tampering | Integrity |
| **R** | Repudiation | Non-repudiation |
| **I** | Information disclosure | Confidentiality |
| **D** | Denial of service | Availability |
| **E** | Elevation of privilege | Authorization |

Process: **draw the system → mark trust boundaries → enumerate threats per element (STRIDE) → rank → decide mitigations → track to closure.** The four framing questions (Adam Shostack): *What are we building? What can go wrong? What are we going to do about it? Did we do a good job?*

### The testing stack (know the difference)
- **SAST** — analyzes **source code** (white-box), early, finds injection/hardcoded-secret patterns; noisy (false positives).
- **DAST** — tests the **running app** (black-box), finds runtime/config issues; later, no source needed.
- **SCA** — scans **third-party dependencies** for known **CVEs** (this is how you catch a Log4Shell in a library).
- **Pen test / red team** — humans, adversarial, periodic depth.

Defense terms to have ready: **defense in depth** (layers), **least privilege**, **fail secure**, **secure by default**.`,
      diagram: `flowchart LR
    R[Requirements<br/>abuse cases] --> D[Design<br/>THREAT MODEL / STRIDE]
    D --> I[Implement<br/>SAST + secrets scan]
    I --> T[Test<br/>DAST + SCA + pentest]
    T --> Dep[Deploy<br/>IaC scan + signed artifacts]
    Dep --> O[Operate<br/>monitor + IR + patch]
    O -.feedback / new threats.-> D
    classDef hot fill:#ffe6e6,stroke:#c33;
    class D hot;`,
      useCases: [
        { title: "Threat modeling a token-provisioning flow", scale: "design-time", body: "Run STRIDE over wallet provisioning: **Spoofing** (attacker impersonates cardholder → ID&V/yellow path), **Information disclosure** (PAN in transit → tokenization + TLS), **Elevation** (weak issuer API auth → mTLS + scoping). The controls from your payments topics *are* the threat-model mitigations — this is where security and payments knowledge fuse." },
        { title: "SCA catches the dependency you didn't write", scale: "Log4Shell class", body: "Most modern code is dependencies. **SCA** scanning your software bill of materials (SBOM) for known CVEs is how orgs found and patched Log4Shell fast. A secure SDLC without dependency scanning misses the majority of the attack surface." },
        { title: "TPM as threat-model facilitator", scale: "cross-functional", body: "Your value-add: you *run* the threat-modeling session — get engineering, security, and product in a room, keep it structured (STRIDE per data flow), and **track findings to closure** in the risk log. The output is a prioritized mitigation backlog with owners — a program artifact, not just a diagram." },
      ],
      interview: [
        { q: "What is threat modeling and how do you run one?", a: "It's structured analysis of **what can go wrong** in a design, done **before/while building** so flaws are cheap to fix. I'd answer with Shostack's four questions — *What are we building? What can go wrong? What will we do about it? Did we do a good job?* — and a concrete process: **draw the system, mark trust boundaries, enumerate threats per element using STRIDE, rank them, assign mitigations, and track to closure.** As a TPM I emphasize the *facilitation and follow-through*: the value is a prioritized, owned mitigation list, not a one-time diagram." },
        { q: "What does STRIDE stand for?", a: "**Spoofing** (breaks authentication), **Tampering** (integrity), **Repudiation** (non-repudiation), **Information disclosure** (confidentiality), **Denial of service** (availability), **Elevation of privilege** (authorization). It's a checklist so you don't miss a threat category — and notice each maps to a security property, which ties back to choosing the right control (authN, MAC, signature, encryption, rate-limiting, least privilege)." },
        { q: "SAST vs DAST vs SCA — when does each run?", a: "**SAST** analyzes **source code** early (white-box) — finds injection patterns, hardcoded secrets; noisy. **DAST** tests the **running application** (black-box) later — finds runtime/config vulns without source. **SCA** scans **third-party dependencies** for known **CVEs** — critical because most code is libraries. They're complementary: SAST for your code's logic, DAST for runtime behavior, SCA for inherited risk. A real pipeline runs all three plus periodic pen testing." },
        { q: "What does 'shift left' mean and what's the catch?", a: "Move security **earlier** — threat modeling at design, SAST/secret-scanning at commit — because a flaw caught in design costs a fraction of one caught in production. The catch: 'shift left' shouldn't mean 'only left.' You still need **DAST, monitoring, and incident response** at runtime — some issues only appear in production. The honest framing is **shift everywhere / build security in at every phase**, with the biggest ROI at design time." },
        { q: "As a TPM, what's your role in secure SDLC if you're not the deepest engineer?", a: "**Facilitation, structure, and accountability.** I convene the right people, run the threat-modeling session with a repeatable method (STRIDE per data flow), make sure security requirements are in the definition of done, and — most importantly — **track findings to closure** in the risk register with owners and dates. I turn security from an opinion in a review into a tracked, prioritized backlog that actually ships. Enough depth to ask the right questions, enough program discipline to close them." },
      ],
      pitfalls: [
        "Treating security as a **final gate** instead of designing it in — expensive and weak.",
        "Threat modeling once and never revisiting — new features create new threats; it must be **iterative**.",
        "Confusing **SAST/DAST/SCA** — code vs running app vs dependencies. Interviewers test this trio.",
        "'Shift left' as an excuse to drop runtime controls — you still need DAST, monitoring, and IR.",
        "Producing a threat model with **no owners or tracking** — a diagram that closes nothing.",
      ],
      deliverables: [
        { type: "lab", title: "STRIDE a real design", detail: "Pick one flow from the payments section and produce a threat table with mitigations and owners." },
        { type: "artifact", title: "SAST/DAST/SCA one-pager", detail: "What each finds, when it runs, its blind spots — so you never confuse them under pressure." },
        { type: "presentation", title: "Run a mock threat-modeling session", detail: "Facilitate 20 minutes: draw system, mark trust boundaries, enumerate via STRIDE, rank, assign. Record it." },
      ],
      references: [
        { label: "Adam Shostack, 'Threat Modeling' + the 4-question frame", note: "The canonical method." },
        { label: "OWASP Top 10, ASVS, SAMM", note: "Vuln taxonomy and SDLC maturity model." },
      ],
    },

    /* ------------------------------------------------------------------ */
    {
      id: "pci-compliance",
      title: "PCI-DSS, PIN & P2PE Compliance",
      week: 7,
      minutes: 40,
      tags: ["PCI-DSS", "PCI PIN", "P2PE", "CDE", "scope reduction", "compliance", "FFIEC"],
      summary: "The compliance frameworks that govern payment security: PCI-DSS, PCI PIN, P2PE, what CDE scope means, and how you shrink it.",
      context: `
PCI and its siblings are where security becomes **mandatory and auditable**. You've lived this — closing exam cycles with zero findings, removing 38 systems from PCI scope, running PCI PIN and P2PE workstreams. Interviewers (especially for payments-security TPM/EPM roles) want to know you can **translate control requirements into engineering scope** and **manage an audit**, not just recite acronyms.

The central concept is **scope**: PCI applies to the **Cardholder Data Environment (CDE)** — anything that stores, processes, or transmits **cardholder data**. Everything you do to *shrink the CDE* (tokenization, P2PE, segmentation) reduces cost, risk, and audit burden. That's the whole game.`,
      architecture: `
### The PCI family
| Standard | Governs | Applies to |
|---|---|---|
| **PCI-DSS** | Protecting **cardholder data** (12 requirements, 6 goals) | Anyone storing/processing/transmitting card data |
| **PCI PIN** | Secure **PIN** handling & key management | ATMs, POS PIN entry, acquirers |
| **PCI P2PE** | **Point-to-point encryption** solutions (card data encrypted at swipe) | Validated P2PE reduces merchant DSS scope |
| **PCI PTS** | **Device** security (terminals) | Hardware manufacturers |

### PCI-DSS at a glance (the 6 goals → 12 reqs)
1. Build/maintain a secure network (firewalls; no vendor defaults)
2. Protect cardholder data (**encrypt storage & transit**; don't store what you don't need)
3. Vulnerability management (anti-malware, secure development)
4. Strong access control (**need-to-know, unique IDs, restrict physical**)
5. Monitor & test (logging, track access, pen test)
6. Information security policy

### CDE & scope reduction — the core lever
- **CDE = every system that touches cardholder data.** Bigger CDE = bigger audit, more risk.
- **Network segmentation** isolates the CDE so out-of-scope systems can't reach it.
- **Tokenization** removes the PAN downstream → those systems leave scope.
- **Validated P2PE** encrypts card data **at the point of capture**, so the merchant environment only ever sees ciphertext → **dramatic DSS scope reduction.**

### How assessment works
- **SAQ** (Self-Assessment Questionnaire) for smaller/eligible merchants; **ROC** (Report on Compliance) by a **QSA** (Qualified Security Assessor) for large ones.
- Evidence: policies, diagrams, scan results (**ASV scans**), key-management docs, segmentation proof.

### Adjacent regimes (name them)
**FFIEC** (US bank IT exams), **GLBA** (financial privacy), **SOX** (financial reporting controls), **PSD2/SCA** (EU). Your résumé maps program milestones to FFIEC/GLBA/PCI — the **regulatory traceability matrix** is the artifact.`,
      diagram: `flowchart TB
    subgraph OUT["Out of PCI scope (only tokens / ciphertext)"]
      POS2[POS after P2PE] --> TOK[Tokenized systems]
    end
    subgraph CDE["Cardholder Data Environment (in scope)"]
      SW[Payment switch] --> VAULT[(Token vault / PAN)]
      HSM[HSM key mgmt] --> VAULT
    end
    Capture[Card capture] -->|P2PE encrypt at swipe| POS2
    POS2 -->|ciphertext only| CDE
    SEG[Network segmentation] -.isolates.-> CDE
    classDef scope fill:#fde,stroke:#b36;
    class SW,VAULT,HSM scope;`,
      useCases: [
        { title: "P2PE + tokenization = scope collapse", scale: "38 systems removed", body: "Your Walmart program: encrypt at the point of swipe (**P2PE**) so the store environment only handles ciphertext, and tokenize downstream so back-office systems only handle tokens. Result: 38 systems leave PCI scope, ~30 person-weeks less assessment per cycle. This is the textbook 'reduce the CDE' win, quantified." },
        { title: "Regulatory traceability matrix", scale: "zero-finding audits", body: "Mapping each program milestone to the specific FFIEC/GLBA/PCI control it satisfies — with evidence attached — is what lets you walk into an exam and close it with **zero findings** (your BofA result). The matrix turns compliance from a scramble into a byproduct of delivery." },
        { title: "PCI PIN key blocks as a hard deadline", scale: "TR-31 mandate", body: "PCI PIN's push to **key blocks (TR-31)** and away from legacy key methods is a dated, mandatory migration across a device fleet — exactly the kind of immovable-date, many-dependency program a payments-security TPM runs. Compliance sets the date; you build the plan." },
      ],
      interview: [
        { q: "What is PCI-DSS and what does 'scope' mean?", a: "**PCI-DSS** is the card-industry standard for protecting **cardholder data** — 12 requirements across 6 goals (secure networks, protect data, vuln management, access control, monitoring, policy). **Scope** is the **Cardholder Data Environment**: every system that stores, processes, or transmits card data. It matters because the CDE defines your entire audit and risk surface — so the highest-leverage security *and* cost move is **shrinking the CDE.**" },
        { q: "How do you reduce PCI scope?", a: "Three main levers: **(1) Tokenization** — replace the PAN so downstream systems handle only tokens and leave scope; **(2) Validated P2PE** — encrypt card data **at the point of capture** so the merchant environment only ever sees ciphertext; **(3) Network segmentation** — isolate the CDE so out-of-scope systems provably can't reach card data. Combined, they can pull dozens of systems out of scope — I did this at retail scale, removing 38 systems and ~30 person-weeks of assessment per cycle." },
        { q: "What's the difference between PCI-DSS, PCI PIN, and PCI P2PE?", a: "**PCI-DSS** protects stored/processed **cardholder data** broadly. **PCI PIN** governs secure **PIN** handling and the **key management** behind it (ATMs, POS PIN). **PCI P2PE** validates **point-to-point encryption solutions** — encrypt at swipe so card data is ciphertext everywhere downstream, which in turn **reduces DSS scope**. They interlock: P2PE and PIN lean on the HSM/key-management discipline, and both feed into your DSS posture." },
        { q: "How do you run a payment program to pass an audit with zero findings?", a: "Bake compliance into delivery, don't bolt it on. I maintain a **regulatory traceability matrix** mapping each milestone to the specific control (PCI/FFIEC/GLBA) it satisfies, attach **evidence continuously** (diagrams, scans, key-mgmt docs, segmentation proof), keep the CDE minimal, and rehearse the **QSA/ROC** narrative before the exam. When evidence is a byproduct of how you already run the program, the audit is a review, not a fire drill — that's how you close cycles with zero findings." },
        { q: "Tokenization takes systems 'out of scope' — is that literally true?", a: "**Partly.** Systems that only ever handle tokens drop *largely* out of scope, but the **token vault, the de-tokenization path, and key management stay firmly in scope** — you concentrated the risk, you didn't delete it. Claiming 'fully out of scope' is the trap; the accurate statement is 'scope reduced and concentrated into a smaller, more hardened environment.' Assessors care about that precision." },
      ],
      pitfalls: [
        "Saying tokenization/P2PE takes you **fully** out of PCI scope — the **vault and key management remain in scope.**",
        "Confusing the standards: **DSS** (data) vs **PIN** (PIN + keys) vs **P2PE** (encryption solution) vs **PTS** (devices).",
        "Treating compliance as a **year-end event** rather than continuous evidence — that's how audits become fire drills.",
        "Forgetting **segmentation** — without it, 'out of scope' systems that can reach the CDE are actually **in** scope.",
        "Reciting the 12 requirements but being unable to explain **CDE/scope** — scope is the concept that matters.",
      ],
      deliverables: [
        { type: "artifact", title: "Regulatory traceability matrix template", detail: "Milestone → control (PCI/FFIEC/GLBA) → evidence → owner. The artifact that produces zero-finding audits." },
        { type: "lab", title: "Scope-reduction before/after", detail: "Diagram a merchant environment, then apply P2PE + tokenization + segmentation and mark what leaves the CDE." },
        { type: "presentation", title: "'How we passed with zero findings' brief", detail: "Turn your BofA/Walmart results into a repeatable compliance-by-design playbook." },
      ],
      references: [
        { label: "PCI-DSS v4.0, PCI PIN, PCI P2PE (PCI SSC)", note: "The authoritative standards." },
        { label: "FFIEC IT Handbook, GLBA Safeguards Rule", note: "Adjacent US financial regulation." },
      ],
    },

  ],
});
