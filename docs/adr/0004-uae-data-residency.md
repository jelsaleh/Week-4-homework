# ADR-0004: Keep patient data resident in the UAE (hosting strategy)

## Date and status
2026-11-13. **Accepted** (the residency *principle* and the dev/prod split). The *specific* UAE production host — self-hosted (Option A) vs UAE managed (Option B) — is **Proposed**, to be finalized at provisioning (see Consequences).

## Context
We chose Supabase as our backend (ADR-0003). But this platform stores **patient health data**, and UAE law requires such data to be **hosted inside the UAE**:
- **Federal Law No. 2 of 2019** (on the Use of ICT in Health Fields), **Art. 13** — health data generated in the UAE may **not** be stored or processed outside the UAE without approval from the health authority. `[VERIFIED — law text]`
- **PDPL — Federal Decree-Law No. 45 of 2021** — data-protection duties, including limits on cross-border transfer. `[VERIFIED]`
- **DHA licensing + NABIDH** expect UAE-resident, compliant EMR data. `[REPORTED]`
- *(Not legal advice; final confirmation needs EDE / DHA / a UAE lawyer.)*

**The problem:** Supabase's **managed cloud has no UAE region**, so it cannot host patient data compliantly `[VERIFIED — Supabase regions]`. **The opening:** Supabase is **open-source** — the same software + the same migrations run anywhere. We need a plan that (a) lets us **build now** without being blocked, and (b) **guarantees UAE residency** in production.

**Scope boundary:** this applies to the **database / auth / storage / backups** (where patient data lives) — **not** the frontend CDN. Vercel serves only screens (ADR-0002), so global screen delivery is fine; residency is a **data-layer** concern.

## Options

- **Option A — Self-hosted Supabase on a UAE-region cloud** (AWS `me-central-1`, or Azure UAE North / Central)
  - Good: Full control; keeps all Supabase features; data physically in the UAE; low migration effort (migrations-as-code).
  - Bad: **We** run, patch, back up, and secure the server ourselves (ops burden + **security patching**) — heavy for a small team.

- **Option B — UAE managed host** (managed Supabase or managed Postgres in a UAE data centre, under a **data-processing agreement**)
  - Good: UAE residency; the provider handles patching / backups / uptime (**SLA**); far less ops burden.
  - Bad: A recurring fee; depends on finding a host that will **sign a DPA and attest UAE residency**; slightly less control.

- **Option C — UAE managed Postgres only (no Supabase auth/storage)** — *ruled out:* we'd rebuild auth + storage ourselves (more work, more security surface).
- **Option D — Sovereign cloud (e.g. G42 / Khazna)** — *ruled out for now:* enterprise/government scale, costly, heavy procurement; overkill at launch.
- *(Baseline rejected — Supabase Cloud as-is: fails residency.)*

## Decision
A **two-phase, residency-first** strategy:
1. **Development (now):** build against **local Supabase** on the developer machine — free, private, fast; **no patient data**, only seed/test data. All schema kept as **migrations-as-code**.
2. **Production (at go-live):** deploy to a **UAE-resident Supabase** (Option A or B). The same migrations **stand up the identical database in the UAE** — no rebuild.

**The principle is locked: patient data is UAE-resident.** The **A-vs-B choice is deferred to provisioning**, when DHA licensing is underway and we know real costs, our ops capacity, and which UAE managed hosts will sign a DPA. **Expert lean** for a small clinic team: **Option B (managed)** — to offload security patching, backups, and uptime — migrating to A later only if cost or control demands it. `[ASSUMPTION — confirm at provisioning]`

## Consequences
**What gets easier / safer:** we can **build immediately** without waiting on a paid UAE host; **residency is guaranteed before any real patient data exists**; migrations-as-code make the laptop → UAE move low-effort; the residency boundary stays explicit (**Vercel = screens; UAE database = patient data**).

**What we take on / must watch:** production UAE hosting is a **paid** step (approx costs in `build-scope.md`), and account/payment setup is **Jasmine's** to do; the **A-vs-B decision + the DPA / residency attestation** must be verified at provisioning; **legal sign-off** (EDE / DHA / a UAE lawyer) is still required before launch.

**What we need to do next** (tracked in `roadmap-to-market.md` §8, launch-gated):
- Provision the UAE host → **point the migration files at the UAE database** → move auth / storage / RLS / secrets → certify NABIDH, complete licensing.

**Related decisions:** ADR-0002 (Vercel = frontend only), ADR-0003 (Supabase backend — this ADR is its "where is it hosted" half).
