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
- **Sign up / log in** (Supabase Auth)
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
