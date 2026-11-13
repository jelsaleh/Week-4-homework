# CLAUDE.md — Week 4 build repo (UAE Telehealth Platform, MVP #1)

Standing instructions for this repository. Claude Code reads this automatically at the start of every session here.

## Read before changing code
- **Read every ADR in `docs/adr/` before making changes, and write a new ADR for every big decision.** (Per the Week 4 ADR template.)
- At the start of a new chat, read `docs/build-scope.md` (what we build now vs defer) and `docs/roadmap-to-market.md` (the road to market, incl. launch-gated steps).

## Non-negotiable mandate
- This is a **market-ready, enterprise-grade, UAE-compliant** telehealth platform — not a homework toy.
- **Patient data must be hosted inside the UAE** (see the data-residency ADR). Supabase *Cloud* is not UAE-resident; we build on local Supabase now and deploy to a UAE-resident host later.
- Apply the **security**, **accessibility (WCAG 2.2)**, and **reliability** skills as the definition of done for every screen.

## Source of truth
- Full product spec + backlog: the `ai-development-residency` repo, **Week 2 Telehealth Platform** deliverables (`product-plan.md`, `scope.md`, `build-plan.md`, `regulatory-compliance-scope.md`, `glossary.md`, epics/features/tasks).
