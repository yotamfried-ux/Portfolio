# Portfolio

A bilingual Next.js portfolio for applied AI, product engineering, and data projects. English uses the root routes. Hebrew uses `/he` with a right-to-left document direction.

## Run and verify

Use Node.js 24 and npm.

```sh
npm ci
npm run dev
```

```sh
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Playwright runs against the production build. Set `PLAYWRIGHT_CHROMIUM_PATH` to use an existing Chromium executable or `PLAYWRIGHT_BASE_URL` for an accessible review deployment. CI runs lint, strict type checking, unit tests, a production build, and Playwright.

## Deployment and contact

The Vercel project `portfolio` is linked to this private GitHub repository under `yotamfried-7101's projects`. It uses the Next.js preset, repository root, and `main` as its production branch. Push changes to the feature branch for Git-integrated previews and use the branch's deployment link to review the latest build.

The Namecheap `portfolio` CNAME resolves to `cname.vercel-dns.com.` Vercel's domain configuration check reported no conflict and recommended that same value. Vercel can assign `portfolio.d2ryf.com` to the review branch for a stable preview URL. Verify the domain and TLS in the project. Switch the domain to the production branch after owner approval. Preview responses and robots settings discourage indexing.

`SITE_URL` sets the canonical root, which defaults to `https://portfolio.d2ryf.com`. Set `PUBLIC_CONTACT_EMAIL` only after the owner approves a public address. Rebuild after changing either value. The visitor composes a draft in the browser and sends from their email app. The website stores no submissions and exposes no mail-sending endpoint. Without an approved address, the draft can be copied locally. With one, the contact page also shows it with a copy button. `PUBLIC_LINKEDIN_URL` and `PUBLIC_CV_URL` (https only) add LinkedIn and CV links to About and Contact; they are hidden when unset. The ETL example is kept in the data but hidden (`hidden: true` in `src/lib/projects.ts`) until it is ready.

## Phase 2 media

1. Produce one 15–25 second hero showreel, five 6–12 second silent preview loops, and five 45–90 second project demos. Use approved project footage or screen recordings for functional walkthroughs. Optional conceptual cuts can be storyboarded in ChatGPT and produced in Google Flow, Vids, or Nano Banana where available.
2. Remove credentials, customer data, internal URLs, and other private details from footage. Encode an optimized MP4 with a poster. Publish it under `public/media/` for small assets or on an approved CDN for larger files. Prepare reviewed WebVTT captions and English and Hebrew transcripts for detailed demos.
3. Add the asset to `src/lib/media.ts`. The hero uses `heroMedia.previewVideo`; each project uses its own `previewVideo` and `demoVideo`. For each video, set `src`, localized `attribution`, and `isIllustration`. Set `demoVideo.captions` with one WebVTT URL per locale and `demoVideo.transcript` with one transcript per locale for detailed walkthroughs. Keep the poster and set `aspectRatio` when the crop requires it. Mark AI-generated conceptual footage as illustrative.
4. Run the production build and test captions, keyboard controls, viewport pausing, reduced motion, and the poster-only fallback. Verify truthful footage attribution on both locales.

See [the approved specification](docs/PORTFOLIO_SPEC.md), [Engineering-OS reuse](docs/ENGINEERING_OS_REUSE.md), and [project evidence](docs/PROJECT_EVIDENCE.md).
