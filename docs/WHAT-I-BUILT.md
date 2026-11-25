# What I Built & Why — Week 4 "Build & Launch"

*A plain-language summary of what shipped this week and the decisions behind it. For my submission and for anyone reading the repo.*

**Project:** A UAE telehealth platform (patient side) for peptide therapies + IV treatments. The Week 4 goal was to ship a **live, secure, thin slice** of the real patient journey — not the whole product.

- **Live app:** https://week-4-homework.vercel.app
- **Stack:** Next.js (App Router) + Material UI → **Vercel** (hosting) → **Supabase** (Postgres + Auth).

---

## What I built (works on the live app)

- **Accounts** — sign-up and log-in via Supabase Auth. A database trigger auto-creates a patient *profile* the moment someone signs up.
- **Data model** — 12 tables modelling the clinical journey (Case, Profile, Intake, Appointment, Consultation, Prescription/Plan, and more), written as SQL **migration files** in `supabase/migrations/`.
- **Security (Row-Level Security)** — every table has RLS so **each patient can see only their own data**. Verified live with two separate test accounts (one could not see the other's cases).
- **The golden path** — *Book a consultation → creates a Case → fill the medical intake → see it on your dashboard.*
- **Accessible, themed UI** — Material UI forms with labels, validation, and keyboard support.

## What I decided (Architecture Decision Records — `docs/adr/`)

| ADR | Decision | Why |
|---|---|---|
| 0001 | Next.js + Material UI | One framework for screens + routing; MUI gives accessible components fast |
| 0002 | Host on Vercel | Push-to-deploy hosting that pairs natively with Next.js |
| 0003 | Use Supabase | Managed Postgres + Auth + RLS, so security lives in the database |
| 0004 | UAE data residency | Hosting region is **launch-gated**; the demo runs on Frankfurt with seed/fake data only |

## What's deferred (tracked, not forgotten)

Week 4 deliberately shipped the **secure foundation + a thin golden thread**. The full clinic side, prescribing, labs, payments, scheduling/video, bilingual AR/EN, NABIDH integration, and UAE-resident hosting are **launch-gated** and tracked in [`docs/status-and-gaps.md`](./status-and-gaps.md) and the Notion product backlog. Three deferred-scope items from this week's features are logged as their own backlog tickets (Refs 88–90).

---

*Full regulatory and market-ready scope lives in [`docs/build-scope.md`](./build-scope.md) and the Week 2 deliverables.*
