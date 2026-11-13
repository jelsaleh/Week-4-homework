# ADR-0002: Host the web app on Vercel

## Date and status
2026-11-12. Accepted.

## Context
Our Next.js + Material UI app (ADR-0001) needs somewhere to **live on the internet** — a host that builds the app, serves the screens to users' browsers, and updates automatically when we push new code. We want **no running of our own servers**, a smooth path straight from GitHub, and fast, global delivery of the patient-facing screens.

**Important boundary:** this host serves the **frontend** (the screens people see). It is **not** where patient data is stored — that is the **database** (Supabase, ADR-0003), which carries the **UAE data-residency** requirement (ADR-0004). Serving *screens* from a global network is fine; storing *patient data* is the regulated part. Keeping this distinction clear is what lets us use a global frontend host without a residency problem.

## Options

- **Option 1 — Vercel**
  - Good: Made by the **same company as Next.js** → **pairs natively**, **zero-config** deploys. Connects directly to GitHub (**push to `main` = auto-deploy**). **Free tier** suitable for launch. **Global CDN** = fast screen delivery. Built-in environment-variable management for keys. Course-supported.
  - Bad: It's a managed platform (less low-level control); its edge network is US/EU-centric — acceptable here because **no patient data is stored on it**, only screens are served.

- **Option 2 — Netlify (a similar managed host)**
  - Good: Comparable Git-based deploys and free tier.
  - Bad: Not the *native* Next.js home; occasional friction with the newest Next.js features; off the course path.

- **Option 3 — Self-host the frontend (our own server/container)**
  - Good: Full control; could co-locate with UAE infrastructure if ever desired.
  - Bad: We'd manage servers, builds, scaling, and **security patching** ourselves — heavy for a small team and unnecessary just to serve screens.

## Decision
Use **Vercel**. It is the **native home for Next.js** (zero-config, auto-deploy from GitHub), course-supported, free to start, and fast globally. Because Vercel serves only the **frontend screens** — not patient data — using a global host raises **no UAE-residency issue**; residency is handled entirely at the database layer (ADR-0004).

## Consequences
**What gets easier:** deployment (push-to-deploy), a preview URL for every change, environment-variable/secret handling, global performance, and **zero server maintenance**.

**What we take on / must watch:** we depend on a managed platform's limits; and we must **keep the data-residency boundary explicit** — *Vercel = screens only; the UAE database = patient data.* Secrets (the Supabase keys) go in **Vercel's environment-variable settings, never in the code**.

**What we need to do next:**
- Deploy the **working skeleton** to Vercel to prove the pipeline end-to-end.
- Add the Supabase keys as **environment variables** at the right step, following the **Keep Your App Safe Checklist**.

**Related decisions:** ADR-0001 (Next.js + MUI), ADR-0003 (Supabase), ADR-0004 (UAE data residency).
