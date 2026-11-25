# Week 4 Coding Challenge — Submission

## Links
- **My GitHub repository:** https://github.com/jelsaleh/Week-4-homework
- **My live app on Vercel:** https://week-4-homework.vercel.app
- **My database diagram:** https://github.com/jelsaleh/Week-4-homework/blob/main/docs/database-erd.md
- **My ADR folder:** https://github.com/jelsaleh/Week-4-homework/tree/main/docs/adr

## Documents
- **My Notion links:** <!-- paste your Week 2 Notion links here: Product Backlog, Vision Board, Scope, Audience/Market, Glossary -->
- **Any other document links:** <!-- optional — e.g. the repo's docs/WHAT-I-BUILT.md, docs/build-scope.md, docs/status-and-gaps.md -->

## What I Did

To start off the project, I wanted to give Claude enough context so we could build the right constraints and requirements. I fed Claude the lecture material from Notion, as well as the Week 4 homework requirements, and I asked Claude to keep me on track with the homework. I wanted to use this curriculum to also build a market-ready telehealth product; however, after I fed Claude the material, it flagged that the MVP1 we had scoped out was too ambitious for one week of homework deliverables within the TechFleet residency. So, as per Claude's recommendation, we created a narrowed build scope just for Week 4, and I asked it to identify and continuously track the gaps between what we are covering for the homework and what would make this product market-ready. Claude then deferred some of MVP1 to "launch-gated" or "build later."

Part of the requirements that came up during Week 2 was that our patient data had to be hosted locally. However, for the homework curriculum, with seeded data, we settled on a Supabase database — and we would end up copying the migration files (the recipe) to another database once the product is market-ready.

To start off, Claude generated the ADRs that had to do with Next.js + MUI, Vercel, and Supabase; the last one had to do with the data-residency contingency plan that we came up with and have to carry out upon launch, to move the database to a legally compliant server location.

When we started Next.js + MUI, I understood that Next.js pairs natively with Vercel, and that it builds the working skeleton around the React components. It built this with an RTL language hook built in, as part of our product's legal requirements, with the translations and toggle deferred for later.

After that, we worked through the database tables. Claude laid out all of the data tables and the relationships between them (and explained the concept of one-to-many and many-to-many), as well as primary and foreign keys and how the tables tied in together. It also built RLS for each table with a default-deny policy, which would only be unlocked if there is an explicit policy allowing it. We also created RLS for reading (a patient could view their cases) and RLS for creation (a patient could create a new case in the database table).

After verifying the database tables, we ran this in the SQL editor in Supabase and chose the region closest to us for reduced latency.

After this, we connected the two layers together: Supabase for the database, and Vercel + Next.js for the working skeleton and screens. We pushed the code to GitHub, and deployed to Vercel by adding our public variables to Vercel.

We made a few tweaks, because Claude hadn't created any navigation links, which left each page disconnected from the others. The end result was a patient able to log in, create an account, book a consultation, fill out the intake form, and see their portal — which Claude identified as the golden journey for MVP1.

## What I Learned

It was interesting to see how the backend of an application and the interface work, and how it related to the three-tier network architecture. Since Week 2, I had been trying to build a market-ready product at the same time as finishing our residency homework; however, after I fed Claude the Week 4 homework, it became clear that that was not reasonable. So we ended up narrowing the scope for the curriculum and focusing only on the core golden paths for the platform, and also asking Claude to track the gaps so that I could come back to it later and build the remaining features. I learned that Claude can tend to skip a lot of steps and reasoning, and assume things, so I found myself breaking down each output and asking it to explain its steps — which takes time, but is really worth it to understand what is going on. I have a clearer picture of why we use Next.js and Vercel, and their roles in creating the interface. I had to stay very mindful and be an active participant in what it was outputting so that I could vet the information. Having an understanding of the product, the user experience, and the legal and regulatory requirements proved to be handy when it came to orchestrating the database rules and values and giving Claude the right information. I was continuously reminded that an understanding of the problem is really the core from which the entire process should flow, because it makes every subsequent step clearer.
