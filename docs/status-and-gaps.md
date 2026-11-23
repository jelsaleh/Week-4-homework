# Status & Gap Tracker — Week 4 build

*Live snapshot of where the build stands, and the gaps to close for a market-ready product. Last updated: 2026-11-23.*

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
| Golden thread works end to end (book → case → intake → consult → plan) | 🟡 In progress — auth done; patient journey being built thin |
| Live on Vercel (public URL) | ⬜ Not yet |
| Backlog tickets → Done | ⬜ Pending |
| Submission template + email teacher + repo submittable | ⬜ Not yet |
| *(optional)* usability test | ⬜ Not yet |

## B. Remaining to finish the homework (ordered)

1. **Thin golden thread** — enough of the patient journey to be genuinely end-to-end:
   - Add **write-side RLS policies** (a patient may create/read their own cases + intakes).
   - Patient dashboard → **"Book a consultation"** creates a `case`.
   - **Medical intake** form → saves to `intakes`.
   - Patient portal → shows their case status/history.
2. **Deploy to Vercel** — set the env vars in Vercel, ship a public URL, test on desktop + phone. *(Demo uses seed/fake data only.)*
3. **Submission** — fill the Submission Template, make the repo public (or add the teacher), email `mdenner@techfleet.org`.

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

**Bottom line:** the hardest, riskiest foundation (architecture, data model, security/RLS, auth) is **done and proven**. The homework finish is **breadth + deploy + submit**. The market-ready path is **mapped and launch-gated** — ready to resume in December.
