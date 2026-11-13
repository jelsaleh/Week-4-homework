# ADR-0003: Use Supabase for the database, authentication, and file storage

## Date and status
2026-11-12. Accepted.

## Context
Our app needs three back-end capabilities that must work together:
1. a **database** to store structured data (patients, cases, appointments, plans…),
2. **authentication** — signing users up and logging them in, and
3. **file storage** — keeping documents (lab PDFs, ID scans, prescription PDFs).

We also need strong **per-row access control (RLS)** for patient privacy, **migrations-as-code** so the database design travels with the repo, and something Claude Code can build against quickly. The course specifies Supabase.

**Scope of this decision:** this ADR chooses the back-end **technology**. *Where it is hosted* — the **UAE data-residency** question — is a **separate decision in ADR-0004**, because Supabase's managed cloud is not UAE-resident. We split them on purpose so each decision is clean.

## Options

- **Option 1 — Supabase (Postgres + Auth + Storage + auto-generated APIs)**
  - Good: **One integrated platform** for all three needs; built on **Postgres** (trusted, standard SQL — a good fit for our relational Patient/Case data); **first-class RLS** for per-row privacy (our NFR T3); built-in **Auth** and **Storage**; supports **migrations-as-code**; **open-source**, so the same software can later be **self-hosted on UAE infrastructure** (ADR-0004); course-supported; fast for Claude to build against.
  - Bad: Supabase *Cloud* has **no UAE region** (handled in ADR-0004); some convention lock-in to Supabase's auth/storage (softened by the Postgres core being portable).

- **Option 2 — Firebase (Google)**
  - Good: Mature, integrated auth + storage + database.
  - Bad: **NoSQL document model** — a poorer fit for our clearly relational data; harder to express RLS-style row rules; **not open-source**, so no clean UAE self-host path; off the course route.

- **Option 3 — Build our own (bare Postgres + custom auth + separate storage)**
  - Good: Full control.
  - Bad: We'd **build and secure authentication ourselves** (risky), wire storage separately, and lose Supabase's integrated RLS/APIs — far more work and a much larger security surface for a small team.

## Decision
Use **Supabase**. It bundles **database + auth + storage** on top of **Postgres**, gives us **first-class RLS** for patient privacy, supports **migrations-as-code**, and — crucially — is **open-source**, so the *exact same software* can later run on **UAE infrastructure** to meet data residency (ADR-0004). It's the course-supported, fastest, and most maintainable path, and it keeps the residency decision cleanly separable.

## Consequences
**What gets easier:** one platform for data/auth/storage; RLS for privacy out of the box; quick authentication; migrations keep the schema portable (laptop today → UAE host later); a clear path to a UAE-resident deployment.

**What we take on / must watch:** Supabase *Cloud* is **not UAE-resident**, so for **development** we use **local Supabase** and for **production** a **UAE-resident deployment** (ADR-0004). We keep the **service-role key server-only** and all secrets in **env vars** (Keep Your App Safe checklist).

**What we need to do next:**
- Run **local Supabase** for development.
- Design the database tables (**Database Design Template**) and create them as a **migration**.
- Turn on **RLS for every table**; wire **auth**.
- Then build the golden-thread features.

**Related decisions:** ADR-0001 (Next.js + MUI), ADR-0002 (Vercel), and especially **ADR-0004 (UAE data residency)** — the "where is this hosted" half of this decision.
