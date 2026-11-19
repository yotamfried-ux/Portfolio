# Portfolio — Product & Engineering Specification
Status: APPROVED DIRECTION / implementation pending
Updated: 2026-11-19
Owner: portfolio owner
Repository: private `yotamfried-ux/Portfolio`

## 1. Mission
Build a premium, production-ready personal portfolio for two audiences: freelance clients and technical recruiters. Show tangible products and credible engineering depth without exposing private source code, credentials, customer data, or internal infrastructure.

**Approved visual direction:** **Cinematic AI Studio (A)** as the base, blended with **Interactive Product Lab (B)**. Reference patterns: Instrument (cinematic case studies), Active Theory (immersive transitions), Rauno Fäderholm (interaction craftsmanship), Brittany Chiang (scannability). Do not copy protected artwork, layouts or assets. Links: https://www.instrument.com/work/ ; https://activetheory.net ; https://rauno.me/craft ; https://brittanychiang.com .

## 2. Approved featured work (exactly five)
1. **SportReel** — AI-assisted sports/drone video processing. Lead visual project. Repo: `yotamfried-ux/Video-editing-with-drone`. Explain raw drone footage → athlete detection/tracking → clip selection/editing → output. Do not claim full autonomy, accuracy, speed, or production readiness without evidence.
2. **Tori — Appointment Scheduling** — booking SaaS. Repo: `yotamfried-ux/Appointment-scheduling-system`. Show client booking, business calendar, availability and notifications, only when verifiable.
3. **AI Agent System** — autonomous software engineering/orchestration experiments. Related repos: `agent-arsenal`, `AutoProjectBuilder`, `Engineering-OS`, `Improved-Engineering-OS`; orchestration also lives in n8n, potentially outside these repositories. Carefully distinguish verified autonomous runs from manual work and future goals.
4. **Customer Churn Prediction** — ML project. Repository mapping, model metrics, datasets and demo assets **NOT YET VERIFIED**. Build content scaffolding; do not invent scores, screenshots or implementation details.
5. **ETL Pipeline** — data engineering project. Repository mapping and implementation **NOT YET VERIFIED**; may require refurbishment. Build content scaffolding; do not invent technologies or outcomes.

Professional training: **Data Analyst professional training certificate, Technion**. Display in Education & Certifications as professional training, **not an academic degree**. Exact official program name, completion year, certificate image and syllabus require verification.

## 3. Information architecture
- `/`: cinematic hero, brief value proposition, selected work, capabilities, short about, Technion certification, CTA/contact.
- `/projects`: curated five-project grid, optional filters AI / Full Stack / Data.
- `/projects/[slug]`: reusable case study template: problem, role, solution, genuine demo slot, architecture illustration at public-safe abstraction, stack (verified only), challenges, evidence-backed outcomes, next steps.
- `/about`: concise bio, capabilities, professional training, résumé link only when provided.
- `/contact`: accessible contact form with spam protection or safe mailto fallback; never publish private addresses without approval.
- English-first, Hebrew switch with full RTL support; localized content must not silently fall back to mixed-direction layouts. Accessible navigation, mobile-first.

## 4. Visual and interaction system
- Premium dark charcoal/near-black base; restrained cyan/blue accents; crisp editorial typography; generous whitespace; carefully layered gradients and subtle grain, not generic glowing AI imagery everywhere.
- Hero: strong headline, short supporting statement, primary CTA to projects, secondary CTA to contact; visually rich **static/animated CSS placeholder until genuine hero video is supplied**.
- Oversized project cards with intentional imagery and consistent aspect ratios; hover/focus states and subtle transitions. Mobile touch interaction must not depend on hover.
- Selected interactive modules: SportReel before/after comparison placeholder; Tori guided UI walkthrough placeholder; AI agent flow diagram with honest sample/illustration label; churn data visualization with **synthetic labeled sample data only** until verified; ETL interactive pipeline schematic with clearly labeled illustrative nodes.
- Motion: elegant, restrained; respect `prefers-reduced-motion`; no mandatory 3D navigation or scroll hijacking; accessible focus/keyboard controls.
- Distinct visual identity for each project, unified layout grammar. Avoid stock screenshots pretending to be real product interfaces.

## 5. Video-first architecture, **video production is phase 2**
**User decision: build and deploy the complete site first; add videos later.** Do not block initial release on video production or purchase third-party subscriptions.
- Video slots in hero, project previews and detailed case studies; meaningful posters and text fallbacks.
- Phase 2 target assets: a 15–25s hero showreel, 6–12s silent previews, and 45–90s full demos where appropriate. Tori uses one 15–20s product showcase on both its card and case study, with a direct link to the verified production landing page beneath the video. See the [Tori showcase plan](TORI_SHOWCASE.md).
- Media manifest per project: `poster`, optional `previewVideo`, optional `demoVideo`, captions/transcript, attribution, `isIllustration` flag, optional aspect ratio. Missing videos must never produce broken UI.
- Preview videos muted, `playsInline`, lazy loaded and played only when relevant; no forced autoplay with sound; user controls for long-form demos; accessible pause, captions and reduced motion. Optimize assets for performance and CDN delivery.
- Production plan: ChatGPT for scripts/storyboards, existing Google AI Pro tools (Flow/Vids/Nano Banana) for optional cinematic illustrations, actual screen recordings and project footage for functional demonstrations. No claim that Google is connected or that generated footage is genuine execution.
- Distinguish **real product footage** from **AI-generated conceptual visualization** visibly in captions and case studies.

## 6. Engineering architecture
- Next.js App Router, TypeScript strict, Tailwind CSS, responsive semantic components, minimal justified dependencies.
- Data-driven project content and media manifest; typed schema with provenance/status fields (`verified`, `illustrative`, `pending`). No fake metrics, fake testimonials, fabricated client names or invented credentials.
- SEO: page-specific metadata, Open Graph images, sitemap, robots, canonical URLs; ensure no private repository exposure.
- Performance: optimized images, lazy media, sensible font loading, code splitting, mobile Core Web Vitals; graceful degradation.
- Security: no secrets in client bundles, no private GitHub tokens or URLs in generated HTML, safe form handling and validation, no sensitive logs. GitHub source links optional and **off by default**; never surface private repos publicly.
- Accessibility: WCAG 2.2 AA target, keyboard navigation, focus visibility, alt text, contrast, reduced motion, captions/transcripts when videos arrive.
- Testing: lint, typecheck, unit/component tests for project data and media fallbacks, Playwright smoke E2E for home/projects/case studies/contact, responsive and RTL checks. CI required before production deployment.
- Deployment: Vercel, existing domain **subdomain not yet specified**; configure via environment and document DNS steps, do not invent a hostname or change DNS without approval.

## 7. Content integrity and evidence
- Review repository documentation and actual working implementations before writing project-specific claims. Treat any README claims as unverified until corroborated by tests, demos or owner-provided evidence.
- For churn and ETL, explicitly request mapping to real repos/assets before final public case-study publication; meanwhile create attractive honest placeholder content, clearly marked `Coming soon / case study in preparation`.
- For the Technion certificate, exact wording/year/image pending verification. No fabricated degree.
- Public portfolio must never expose proprietary code, secrets, internal URLs, private user data, or unreleased internal dashboards.

## 8. Phased implementation and acceptance
**Phase 1 — Build now:** inspect repo; scaffold app; design system; complete responsive EN/HE pages; five project entries; interactive illustrative modules; poster-first media slots; contact mechanism; SEO/accessibility; tests/CI; Vercel preview. Provide screenshots and deployed preview for owner review.
**Phase 1.5 — Content verification:** validate claims and assets; collect missing churn/ETL repo mapping, Technion certificate details, public contact information, résumé, and chosen subdomain. Do not fabricate to fill gaps.
**Phase 2 — Videos later:** produce real recordings and optional Google AI-generated cinematic segments, edit, encode, add captions, populate media manifest, test performance, deploy.
**Phase 3 — Polish:** analytics only with consent/privacy compliance, performance optimization, conversion and recruiter UX review.

Definition of Done for Phase 1: all routes render; EN/HE + RTL work; five approved projects appear; no missing video causes errors; keyboard/mobile/reduced-motion tested; typecheck/lint/tests pass; no sensitive data in output; preview deployed or blocker reported; no unsupported public claims.

## 9. Implementation guardrails for Codex
- Work in this private repo. Read `AGENTS.md` and this specification before coding.
- Make changes in a feature branch and open PR; do not merge implementation without owner review unless separately instructed.
- Do not assume any current app or video files exist; inspect first.
- Prefer real proof over simulated claims; explicitly label illustrative demos.
- Ask for credentials, domain ownership, contact destination and missing assets only when needed; never invent them.

## 10. Reuse Engineering-OS UI/UX knowledge before implementing UI
**User-approved reuse:** The separate private repository `yotamfried-ux/Engineering-OS` contains curated UI/UX patterns, premium motion guidance, skills and reference resources. It is a **knowledge library, not an application runtime**. Use it to accelerate design and implementation, not to copy proprietary assets blindly or install everything.

Read, in this order, the smallest relevant set of existing sources:
1. `Engineering-OS/docs/ui-ux/EXPERIENCE-ROUTING.md` — select the landing-page, new-screen, interaction/motion and UX quality routes.
2. `Engineering-OS/docs/product-experience/README.md` and `docs/product-experience/premium-motion-and-design-systems.md` — premium visual direction, responsive motion and design systems.
3. `Engineering-OS/patterns/ui/README.md` — semantic design tokens, reusable component architecture, accessibility.
4. `Engineering-OS/external-skills/ui-ux-pro-max/README.md` — inspect skill documentation and adoption prerequisites; **do not assume the skill is installed or runnable**.
5. `Engineering-OS/docs/ui-ux/MOTION-AND-INTERACTIONS.md`, `SCREEN-CONTENT-PLAYBOOK.md`, `PRODUCT-EXPERIENCE-QUALITY-GATE.md` — relevant to hero, interactive case studies, CTAs and validation.
6. `Engineering-OS/docs/product-experience/ui-library-candidates-2026.md` — evaluate candidate UI/motion libraries; verify current upstream, license and bundle/performance cost before adoption.
7. `Engineering-OS/capability-registry/ROUTING-MAP.md` and `docs/reference-repositories/` — discover additional references only when needed.

Execution rules:
- Inspect and reuse existing patterns/components **when technically compatible**, adapting them to this portfolio's Next.js/TypeScript/Tailwind architecture; never assume examples are production-ready.
- Prefer documented, tested, accessible primitives and a coherent token system over generating generic template UI.
- Verify exact source paths, upstream license, version and dependencies; avoid broad installs and needless clones. On a persistent workspace, reuse an existing Engineering-OS checkout and update it with `git pull --ff-only`; on an ephemeral environment, obtain only required references.
- If access to the private Engineering-OS repository is unavailable in Codex, report the blocker and proceed using the approved design specification; **do not claim reuse happened**.
- Deliver a short `docs/ENGINEERING_OS_REUSE.md` evidence table mapping source path → adopted pattern/tool → implementation location → verification, and note any rejected options.
- Follow the already-approved A+B direction; do not restart aesthetic selection or add a blocking design approval gate.
