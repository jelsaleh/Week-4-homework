# Week 4 Build Scope — Telehealth Platform MVP #1 (buildable slice)

*Tech Fleet AI Development Residency, Week 4 ("Code and Launch"). Premium track: we build **our own specialization app — the UAE telehealth platform** — not the ADHD budgeting app. This doc defines exactly what we build **this week**, and why we narrowed it. Last updated: 2026-11-07. Status: APPROVED by Jasmine.*

> **Source of truth.** The full product spec lives in the `ai-development-residency` repo (Week 2 deliverables): `product-plan.md`, `scope.md` (MVP #1 + MMP), `build-plan.md`, `non-functional-requirements.md` (T1–T11), `regulatory-compliance-scope.md`, `epics-features-tasks.md`. **This doc does not replace them** — it selects the slice of MVP #1 we implement in Week 4 and records what we deliberately defer or stub.
>
> **Evidence tags:** `[VERIFIED]` authority/law · `[REPORTED]` credible secondary · `[ASSUMPTION]` reasoned, to confirm. Nothing here is legal advice; anything needing an authority (DHA / EDE / a UAE lawyer) is flagged.

---

## 1. The tension we resolved, and how

The course rule is *"build the **entire** MVP #1, fully functioning — nothing fake or 'coming soon.'"* But our MVP #1 is a **regulated UAE telehealth platform** (triage, EDE product gate, labs gate, prescribing-with-safety-checks, DHA-compliant video, VAT payments, bilingual AR/EN, NABIDH-compatible EMR). Several pieces depend on **rented regulated services** and **licensing** that genuinely cannot be live in one week — and faking them would break the "nothing fake" rule too.

**Resolution (the principle):** build **one complete `Case` end to end** — the thinnest *complete and genuinely-working* thread through the whole platform — with **all non-functional and compliance guardrails real underneath it**, and every regulated/rented piece built **ready and honestly labeled** as launch-gated rather than faked. Depth over breadth. This mirrors our own `build-plan.md`: *non-functional before functional*, and *prove the riskiest, most-regulated thing first.*

Same phases as `build-plan.md`, same order — a **thinner slice through each phase.**

---

## 2. In scope this week (real, working, persisted to Supabase)

### 2.1 Foundation — the non-functional spine *(build-plan Phase 0)*
- Next.js + Material UI app, in GitHub, deployed to **Vercel** · `[T1]`
- **Supabase** for database + auth + file storage · `[T2]` *(region: see §5 flag)*
- **Sign up / log in** (Supabase Auth) — basic email/password this week; **strong password policy + 2FA / MFA** flagged on the backlog for production (healthcare account-security hardening) → §4.1
- **Roles** (patient / clinician / admin) + **Row-Level Security** — each patient sees only their own records; clinicians see assigned cases · `[T3]`
- **Core data model** — `Case` + stages, plus Patient, Clinician/Staff, Intake, Appointment, Consultation, Prescription/Plan, Product (with EDE-status flag), LabOrder · `[T2]`
- **Security & privacy baseline** — encryption (Supabase defaults: TLS + at-rest), an **audit-log** table (who viewed/changed what), a **consent** record captured in the flow · `[T4 · T5]`
- **Bilingual (AR/EN + RTL) and accessibility framework** scaffolded from day one — structure now, full translation/passes later · `[T11]`
- Dev-ops rails: environment config with **secrets in env vars, never in code**; migrations-as-code · `[T9]`

### 2.2 The regulated spine *(build-plan Phase 1 — our differentiator, highest risk)*
- **Eligibility triage** — classify each request: telehealth-eligible / in-person required / decline · `[VERIFIED constraint — ST-14 §17.12.7]`
- **EDE-gated product catalog** — only EDE-cleared products can be added to a plan (per-product flag) · `[VERIFIED — catalog carries only EDE-approved products]`
- **Labs gate** — block prescribing until required labs are ordered + reviewed · `[VERIFIED — ST-14 §9.8.2/§9.8.3]`
- **Prescribing with safety checks** — physician-only; allergy/contraindication flags; generate **Rx PDF**
- *Proven with seeded data before the UI is polished around it.*

### 2.3 The one golden thread *(build-plan Phase 2 — narrowed)*
| Patient side (P1→P6) | Clinic side |
|---|---|
| Landing page + **required disclosure** (what can't be prescribed via telehealth) | **Pipeline board** — all Cases by stage |
| Book an appointment → creates a `Case` | **Case review** — intake, red flags, labs status |
| **Medical intake** + eligibility triage, saved to the Case | **Consult record** → notes + outcome → advance stage |
| **Patient portal** — case status, plan (with rationale), history | **Prescribe** through the gates (§2.2) |

---

## 3. Built-ready but honestly labeled (launch-gated — NOT faked)

We build the **real data fields and records**, and show a clear **"activated at licensing / go-live"** state. No empty buttons pretending to work.

- **Video consult** — store the consult-link field on the appointment; labeled "DHA-compliant video provider connected at licensing." `[REPORTED — no public whitelist; approved at facility licensing]`
- **Payments + VAT (5%)** — build the invoice/receipt record + VAT calc; live provider wired at go-live.
- **NABIDH connection** — EMR built to HL7-FHIR / Minimum Data Set; connection certified during DHA licensing. `[REPORTED — licensing prerequisite]`
- **Pharmacy dispensing** — manual notification now (Rx PDF); live pharmacy integration later. `[approach confirmed]`

---

## 4. Out of scope this week

Everything already deferred in Week 2 `scope.md`: hormone/TRT/HRT pathway, automated follow-up/refill engine, native mobile app, real-time chat, analytics dashboards, and **any controlled/semi-controlled medicine via telehealth** (permanently out · `[VERIFIED — ST-14 §17.12.7]`). Plus, for time: full third-party scheduling/video/payment *integrations* (built-ready instead, §3), full admin configuration breadth, and the standalone polish passes (applied per-screen as we go — §6).

---

### 4.1 Parked ideas — captured so we don't lose them *(raised by Jasmine, 2026-11-16)*

Good instincts raised during the data-model design. All real; none built this week. **Because we use migrations-as-code (ADR-0003), each can be added later with a small, numbered migration — no rebuild.** Recorded here so we can safely defer them.

| Idea | Verdict | Where it lands | Proof / basis |
|---|---|---|---|
| **Pharmacy orders** — what the patient ordered, coordinated with the compounding pharmacy | Launch-gated (build-ready, not faked) | A future `orders` / fulfillment table switched on with live pharmacy integration. Clinical decision is already captured now in `prescriptions`. | §3 "Pharmacy dispensing — manual notification now; live pharmacy integration later" |
| **Reorders / refills** | Out of scope this week | Part of the deferred follow-up/refill engine (future tables + logic) | §4 "automated follow-up/refill engine" |
| **Follow-up dates** | Out of scope this week | Same follow-up engine | §4 |
| **Dosage guidance on products** | Add later via migration | One text column added to `products` when the prescribing screen needs it; keep `products` lean now | migrations-as-code (§2.1 dev-ops rails) |
| **Terms & conditions acceptance** | In scope (already) | The *acceptance* is data → `consents` table (+ `audit_log` timestamp). The T&C *text itself* is a published document/page, not DB data. | §2.1 "a consent record captured in the flow" |
| **Strong password policy + 2FA / MFA** | Backlog — production hardening | Enforced at the **auth step** (§2.1 sign-up): minimum-strength passwords + two-factor login. Basic email/password this week; harden before real patients. | Healthcare account security; `security` skill (auth), PDPL safeguards |
| **Products catalog visibility** | Revisit later (open) | RLS currently lets **any signed-in user read all `products`**. May later restrict (e.g. hide non-EDE-cleared items, role-based visibility, or per-clinic catalogs). Kept open for now pending more info. | Decision 2026-11-19 — Jasmine flagged to revisit |
| **Email confirmation (auth)** | Re-enable for production | Turned **OFF** in Supabase for local testing (fake test emails can't receive confirmation links). **Real patients must confirm their email before first login** — turn back on before go-live. | Dev convenience 2026-11-23; security for production |

---

## 5. Open flag carried into the build — data residency (T2.1)

Supabase's managed cloud has **no UAE/Middle East region** `[VERIFIED — Supabase regions docs]`, and does **not** support in-place region changes (you create a new project in the target region and migrate) `[VERIFIED — Supabase docs]`. For this **learning build** we will use the **nearest region (Frankfurt, eu-central-1)** and record it in an ADR. For **production UAE residency** (NFR T2.1, Federal Law 2/2019 + DHA) the path is **self-hosted Supabase on UAE infrastructure** (same Postgres + same migrations → no rebuild) or a UAE managed-Supabase host, decided at licensing. Because we keep **migrations-as-code + env-var config**, that later move is low-effort on the schema/app side. → see `docs/adr/0004-data-residency-region-strategy.md`.

---

## 6. Definition of done — Week 4 (course requirements ✓ mapped)

- [ ] Next.js + **Material UI**, in the GitHub repo
- [ ] Sign up / log in works
- [ ] Every in-scope feature **saves to Supabase and reads back** (persists across logout)
- [ ] **Each person sees only their own data** (RLS)
- [ ] The golden thread (§2.3) works end to end — no fake/empty screens; launch-gated items honestly labeled (§3)
- [ ] **≥ 3 ADRs** in `docs/adr/` (Next.js+MUI, Vercel, Supabase) + one per other big choice (e.g. data residency)
- [ ] **Database diagram** in `docs/`
- [ ] **Live on Vercel** at a public `*.vercel.app` URL
- [ ] Our Week 2 MVP #1 backlog tickets for the in-scope slice → Done
- [ ] **Make the repo submittable** — it was created **private**; at hand-in either flip it to **public** or add the teacher as a collaborator (so it can be reviewed)
- [ ] Filled-out **Submission Template** · *(target was Nov 16; timeline now flexible — depth over rushing)*
- [ ] *(Advanced, optional)* usability test with 1–2 people → report → v2

**Quality bar (global standards applied throughout, not as a final pass):** security, accessibility (WCAG 2.2), and reliability skills are the definition of done for every screen we build.

---

## 7. Progress tracker — where we are *(updated 2026-11-13)*

> **Live status now lives in [`docs/status-and-gaps.md`](status-and-gaps.md)** (homework progress + market-ready gaps). The snapshot below is kept for history.

Mapped to the course **Build & Launch Checklist** (14 steps). Legend: ✅ done · 🟡 partial · ⬜ not started.

| # | Checklist step | Status | Where it lives |
|---|---|---|---|
| 1 | Make Vercel + Supabase accounts | ⬜ | Needed at deploy; our twist = local Supabase now, UAE-resident later (ADR-0004) |
| 2 | Check computer is ready (Node.js) | ⬜ | Quick check before scaffolding |
| 3 | Gather Week 2 documents | ✅ | Week 2 deliverables = source of truth |
| 4 | **Scaffold Next.js + MUI** (working skeleton) | ⬜ | **Next build action** |
| 5 | Architect the app (3 tiers, written) | 🟡 | `build-plan.md` + this doc |
| 6 | Write ADRs | ✅ | 4 ADRs in `docs/adr/` (course needs ≥3) |
| 7 | Design database tables (+ migration, + RLS) | ⬜ | Uses Database Design Template; produces the ERD |
| 8 | Connect app to Supabase (keys, `.env.local`) | ⬜ | Keep Your App Safe checklist; re-teach keys/env-vars/git here |
| 9 | Build features one at a time (sign-up first) | ⬜ | Golden thread §2.3 |
| 10 | Run & test locally (2 accounts, RLS check) | ⬜ | Prove per-patient isolation |
| 11–13 | Deploy to Vercel + test live (incl. phone) | ⬜ | Resolve demo-DB residency decision here (seed data only) |
| 14 | Fill Submission Template, email teacher | ⬜ | Make repo public / add teacher |

**Plain read:** the **thinking + documentation foundation is finished and committed** — decisions, scope, roadmap, glossary (steps 3, 5, 6). Everything remaining is **build → test → deploy → submit**. We front-loaded the hard reasoning on purpose, so the build rests on solid ground.

### Phased path for the rest
- **Phase A — Foundation** (steps 2, 4): check Node → scaffold the skeleton → commit.
- **Phase B — Data layer** (steps 7, 8): design tables + draw the **ERD**, create the migration, run local Supabase, turn on **RLS**, wire auth. *(keys/env-vars/git re-taught hands-on here)*
- **Phase C — Features** (step 9): build the golden thread one feature at a time, sign-up first.
- **Phase D — Test locally** (step 10): two accounts; confirm one patient can't see another's data.
- **Phase E — Deploy** (steps 1, 11–13): accounts → live on Vercel → test desktop + phone. **Demo uses seed/fake data only**; UAE-resident production hosting stays launch-gated (ADR-0004, `roadmap-to-market.md` §8).
- **Phase F — Submit** (step 14): Submission Template → repo public / add teacher → email `mdenner@techfleet.org`.
