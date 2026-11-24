# Status & Gap Tracker — Week 4 build

*Live snapshot of where the build stands, and the gaps to close for a market-ready product. Last updated: 2026-11-24.*

> **Decision (2026-11-23):** prioritise **finishing the Week 4 homework** to catch up with the curriculum. The full **market-ready** product is deferred to **after the course (December)** — the gaps below are tracked so they can be closed deliberately, not forgotten.

---

## A. Week 4 homework — status

| Requirement (course definition of done) | Status |
|---|---|
| Next.js + Material UI, in the repo | ✅ Done |
| Sign up / log in works | ✅ Done |
| Data persists to Supabase & reads back | ✅ Done (auth + profiles) |
| **Each person sees only their own data (RLS)** | ✅ **Done & verified with two accounts** |
| ≥ 3 ADRs in `docs/adr/` | ✅ Done (4) |
| Database diagram in `docs/` | ✅ `docs/database-erd.md` |
| Golden thread works end to end (book → case → intake → portal) | ✅ Done & verified live (Alice/Bob) |
| Live on Vercel (public URL) | ✅ Done — tested on desktop (phone pending) |
| Backlog tickets → Done | ✅ 11 shipped tickets moved to Done; 3 remaining-scope tickets tracked (Refs 88–90) |
| Submission template + email teacher + repo submittable | 🟡 Pending — Jasmine fills the template (no AI); phone test + hand-in left |
| *(optional)* usability test | ⬜ Not yet |

## B. Remaining to finish the homework (ordered)

1. ~~**Thin golden thread**~~ ✅ **Done** — write-side RLS added; book → case → intake → portal works and was verified live.
2. ~~**Deploy to Vercel**~~ ✅ **Done** — public URL live, desktop tested. **Left: open it on a phone and test (step 13).**
3. **Submission** — fill the **Submission Template yourself (no AI)**; confirm the repo is submittable (public or add the teacher); hand in per the Week 4 assignment page.

---

## C. Market-ready gaps to close after the course (December)

Nearly all of these are **already designed/deferred**, not missed. Grouped, with where each is tracked.

| Area | Gap to close | Tracked in |
|---|---|---|
| **Security — write-side RLS** | Full insert/update policies per table (we built read policies first) | this file · `security` skill |
| **Security — accounts** | Strong-password policy + **2FA/MFA**; re-enable **email confirmation** | build-scope §4.1 |
| **Security — platform** | DESC/ISR alignment, rate limiting, audit-log immutability | `regulatory-compliance-scope.md` §5 |
| **Data residency** | Move to **UAE-resident hosting** (re-run migrations on UAE infra) | ADR-0004, build-scope §5 |
| **Regulatory/licensing** | DHA facility license, EDE product clearance, NABIDH live integration, TDRA video vendor, compounding-pharmacy licensing | `regulatory-compliance-scope.md`, build-scope §3 |
| **Clinical governance** | Triage rules, labs gate, prescribing safety checks, clinical protocols | build-scope §2.2 |
| **Bilingual AR/EN + RTL** | Full translation + RTL pass (hooks are scaffolded) | build-scope §2.1 (T11) |
| **Accessibility (WCAG 2.2)** | Full audit (built per-screen as we go) | `accessibility` skill |
| **Payments + VAT, pharmacy dispensing, video** | Live providers wired at go-live | build-scope §3 |
| **Parked product ideas** | Pharmacy orders, reorders/follow-ups, product dosage guidance, products visibility | build-scope §4.1 |

---

## D. Shipped thin — remaining scope tracked as tickets

Three Week-4 features shipped as a **working thin slice**; their fuller spec was deferred and is now tracked as its own backlog ticket (Status: Backlog · Type: Build · Release: MVP #1), so nothing we deferred is buried inside a "Done" card.

| New ticket | Shipped now (→ Done) | Remaining scope (new ticket) |
|---|---|---|
| **Ref 88** | Booking: *book → creates a Case* (Ref 79) | Pick a specific service/treatment. *(Time/scheduling already tracked as Ref 54.)* |
| **Ref 89** | Intake: *reason + symptoms* form (Ref 80) | Eligibility + contraindication screening — needs clinical governance |
| **Ref 90** | Intake *saved to the Case* (Ref 58) | Flag red flags to the clinician — needs clinical governance |

**Also tracked (engineering hardening, not a feature gap):**
- **Session token storage** — Supabase stores auth tokens in the browser's `localStorage` (fine for homework). Market-ready: move to httpOnly cookies / server-side auth to reduce token-theft (XSS) risk.

---

**Bottom line:** the hardest, riskiest foundation (architecture, data model, security/RLS, auth) is **done and proven**. The homework finish is **breadth + deploy + submit**. The market-ready path is **mapped and launch-gated** — ready to resume in December.
