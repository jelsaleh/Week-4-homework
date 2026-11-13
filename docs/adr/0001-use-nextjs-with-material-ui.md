# ADR-0001: Use Next.js with Material UI for the web app

## Date and status
2026-11-12. Accepted.

## Context
We are building the patient-facing **UAE telehealth platform** (MVP #1) as a **web app** — screens people open in a browser. Two choices have to be made up front and are hard to change later:
1. a **frontend framework** to build the screens and give the app its structure (routing, pages, how the UI talks to the server), and
2. a **component / design-system library** so the interface is consistent, accessible, and fast to build instead of hand-coding every button and form.

Our platform has specific needs that weigh on this: **bilingual Arabic/English with right-to-left (RTL) layout**, **WCAG 2.2 accessibility**, and a clean path to production **hosting**. We also want a mainstream, well-supported stack that Claude Code can scaffold and that a clinic's future developer could maintain. The Week 4 course specifies **Next.js + Material UI** as the standard stack.

## Options

- **Option 1 — Next.js (React) + Material UI (MUI)**
  - Good: Course-supported. React is the most widely used UI technology, so it's the easiest to hire for and hand over. Next.js gives routing, server-side rendering, and **first-class Vercel deployment** out of the box. MUI is a mature component library with **built-in accessibility and RTL support** — directly serving our AR/EN and WCAG 2.2 requirements. Very fast to scaffold (`create-next-app`). Strong TypeScript support for safer code.
  - Bad: React/Next has a learning curve. Stock MUI looks recognizable, so it needs **theming** to feel like our brand. Some added bundle weight.

- **Option 2 — Plain React (Vite) + a different component library (e.g. Tailwind/Chakra)**
  - Good: Lighter-weight; very flexible.
  - Bad: We'd have to wire up routing, server-rendering, and deployment ourselves; diverges from the course and from Vercel's zero-config path; a less guided route for a learner.

- **Option 3 — A non-React framework (e.g. Vue/Nuxt, SvelteKit)**
  - Good: All capable frameworks.
  - Bad: Smaller ecosystems for our needs; off the course path; fewer mature component libraries with the RTL + accessibility maturity MUI has; harder to find help and examples.

## Decision
Use **Next.js (React) with Material UI**. It is the course-supported stack, pairs **natively with Vercel** (our host — see ADR-0002), and its **mature accessibility + RTL support** directly serves our **bilingual (AR/EN)** and **WCAG 2.2** requirements. It is also the most **maintainable and hireable** choice for eventually handing the platform to a clinic's own team.

## Consequences
**What gets easier:** scaffolding the app, deploying to Vercel, finding ready-made components, accessibility defaults, RTL for Arabic, and getting help/examples (huge community).

**What gets harder / what we take on:** we must **theme MUI** so the app looks like our brand rather than stock MUI; we accept React's learning curve; and we keep an eye on bundle size.

**What we need to do next:**
- Scaffold the Next.js + MUI app (the **working skeleton**) and commit it.
- Set up the **AR/EN + RTL theme scaffold** from day one.
- Deploy the skeleton to **Vercel** to prove the pipeline end-to-end before building features.
- Then build features one at a time through the golden thread.

**Related decisions:** ADR-0002 (Vercel hosting), ADR-0003 (Supabase for database/auth/storage), ADR-0004 (UAE data residency).
