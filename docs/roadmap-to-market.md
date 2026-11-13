# Roadmap to Market — UAE Telehealth Platform

*A living tracker of everything standing between the **Week 4 homework slice** and a **market-ready, UAE-compliant product**. This is **separate from curriculum hand-ins**: the course tells us what to submit each week; this file tells us what's left to ship a real product. Last updated: 2026-11-12.*

> **How to use this file.** It's a **lens over the Week 2 backlog**, not a replacement — the backlog/epics/features stay the complete product picture; this just tracks *status on the road to launch*. Open it any time to see where we are. **You edit it in place and commit** — you do **not** make a new copy each build. Git keeps the full history, so nothing is lost (see *Versioning* at the bottom).
>
> **Status legend:** ✅ Done · 🔄 In progress · ⛔ **Launch-gated** (built, switched off until a condition is met) · ⬜ Not started
>
> **Evidence tags:** `[VERIFIED]` authority/law · `[REPORTED]` credible secondary · `[ASSUMPTION]` reasoned, to confirm. Nothing here is legal advice; anything needing an authority (DHA / EDE / a UAE lawyer) is flagged.

---

## How the documents fit together (where to look for what)

| If you want to know… | Look in… |
|---|---|
| What a term means | `glossary.md` (Week 2 deliverables) |
| What we're building **this week** & what we defer | `docs/build-scope.md` |
| **Why** we chose a technology (the reasoning, audit trail) | `docs/adr/` (ADRs) |
| How we **work** (e.g. polish continuously, risk-first) | `docs/build-scope.md` + `build-plan.md` |
| The **full remaining road to market** (this file) | `docs/roadmap-to-market.md` |
| The exact **switch-on steps** before going live | §8 below (*Launch-gated go-live checklist*) |
| The full product vision & backlog | Week 2 deliverables (`product-plan.md`, `scope.md`, `build-plan.md`, epics/features/tasks) |

---

## 1. Foundation & engineering
- ⬜ Next.js + Material UI app scaffolded (working skeleton) · `[course req]`
- ⬜ Deployed to Vercel at a live URL
- ⬜ Supabase (local for dev) — auth + database + storage wired
- ⬜ Core data model built as **migrations-as-code**
- ⬜ **RLS** on every table (each person sees only their own rows) · `[NFR T3]`
- ⬜ Secrets in env vars, never in code · `[NFR T9]`
- ⬜ Audit-log table + consent record in the flow · `[NFR T4 · T5]`

## 2. The golden thread (core clinical flow)
- ⬜ Patient: landing + required telehealth disclosure
- ⬜ Patient: book appointment → creates a `Case`
- ⬜ Patient: medical intake + eligibility triage saved to the Case
- ⬜ Patient portal: case status, plan with rationale, history
- ⬜ Clinic: pipeline board of all Cases by stage
- ⬜ Clinic: case review (intake, red flags, labs status)
- ⬜ Clinic: consult record → notes + outcome → advance stage
- ⬜ Clinic: prescribe through the gates (below)

## 3. The regulated spine (our differentiator)
- ⬜ Eligibility triage: telehealth-eligible / in-person / decline · `[VERIFIED — ST-14 §17.12.7]`
- ⬜ EDE-gated product catalog (only EDE-cleared products addable) · `[VERIFIED]`
- ⬜ Labs gate (block prescribing until required labs ordered + reviewed) · `[VERIFIED — ST-14 §9.8.2/§9.8.3]`
- ⬜ Prescribing with safety checks (physician-only; allergy/contraindication flags; Rx PDF)

## 4. Compliance, legal & data residency (UAE)
- ⬜ **Data residency decision recorded** → `docs/adr/` (data-residency ADR) · `[NFR T2.1]`
- ⛔ **Patient data hosted inside the UAE** (self-hosted Supabase on a UAE-region host, OR a UAE managed host) · `[VERIFIED — Federal Law 2/2019 Art. 13]` — *locked decision: build local now, deploy UAE-resident later*
- ⬜ PDPL alignment (consent, data-subject rights, retention) · `[VERIFIED — Federal Decree-Law 45/2021]`
- ⛔ DHA facility & practitioner licensing (gates go-live) · `[VERIFIED]`
- ⛔ EDE catalog kept current against the official list · `[VERIFIED]`

## 5. Clinical governance
- ⬜ Physician-only prescribing enforced in code & roles
- ⛔ Named medical director / clinical oversight sign-off · `[ASSUMPTION — confirm with DHA]`
- ⬜ Clinical content reviewed by a licensed clinician `[ASSUMPTION]`

## 6. Bilingual (AR/EN) & accessibility
- ⬜ Bilingual + RTL framework scaffolded from day one · `[NFR T11]`
- ⬜ Full Arabic translation of patient-facing screens
- ⬜ WCAG 2.2 accessibility pass per screen (continuous, not a final pass)

## 7. Payments, integrations & operations
- ⛔ Payments + VAT 5% — invoice/receipt record built now; **live provider wired at go-live**
- ⛔ **DHA-compliant video provider** connected (link field built now) · `[REPORTED — approved at facility licensing]`
- ⛔ **NABIDH connection** (EMR built to HL7-FHIR / Minimum Data Set; certified during DHA licensing) · `[REPORTED]`
- ⛔ Pharmacy dispensing integration (manual Rx PDF now → live integration later)
- ⛔ Lab-provider integration (manual now → live later)

---

## 8. Launch-gated go-live checklist (the switch-on steps)

*These are the concrete things to do to flip the platform from "built" to "live", once the legal/licensing conditions are met. They stay ⛔ until then — this is the list you asked for.*

1. ⛔ **Provision a UAE-resident database host** — rent a UAE-region server (AWS `me-central-1` or Azure UAE North/Central), or sign up a UAE managed-Supabase host. *(Paid step — happens later; approx costs in `build-scope.md`.)*
2. ⛔ **Point the migration files at the UAE database** and run them → stands up the identical schema in the UAE. *(Yes — this is exactly the step you described. It's low-effort precisely because the schema is migrations-as-code.)*
3. ⛔ Move auth + storage + RLS to the UAE instance; move secrets into the production environment.
4. ⛔ Complete **DHA facility + practitioner licensing**; obtain approvals.
5. ⛔ **Certify the NABIDH connection** during licensing.
6. ⛔ Connect the **DHA-approved video provider**.
7. ⛔ Wire the **live payment provider** (replace test mode).
8. ⛔ Confirm the **EDE catalog** matches the current official list.
9. ⛔ Final security + accessibility + data-residency review before launch.
10. ⛔ Point the public domain (e.g. `yourclinic.ae`) at the app; go live.

> **Note:** "Make the GitHub repo public / add the teacher" is a **submission** step for the homework, not a launch step — it lives in `build-scope.md` §6.

---

## Versioning — how this file changes over time

- **This file is living:** edit lines in place (change ⬜ → 🔄 → ✅), add rows as new work appears, and **commit**. Git stores every past version, so the history is preserved automatically. **Do not** create `roadmap-v2.md` etc. — that fragments the picture.
- **Contrast with ADRs:** ADRs are **append-only** — you never erase one; if a decision changes you write a *new* ADR that supersedes the old (marked "Replaced by ADR-XXXX"). That's because an ADR is a historical record of a decision, whereas this roadmap is a *current* status board. Different jobs, different rules.
