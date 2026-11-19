# Tori video tool qualification

Qualified on 19 November 2026 on Debian 13 x86-64 with Python 3.12.14, Pillow 13.0.0, libx264 and FFmpeg/ffprobe 7.1.5-0+deb13u1, DejaVu Sans, Node 24.22.1, npm 11.9.0, Chromium 156.0.8078.79 and Git LFS 3.6.1. Dependencies stay in the local tooling directory or an isolated virtual environment. No hosted inference, model downloads, subscriptions, paid APIs or paid rendering were used.

| Candidate | Source and qualification | Decision |
| --- | --- | --- |
| MCP Video Analyzer | [Official README](https://github.com/guimatheus92/mcp-video-analyzer/blob/84ffd825cbc87c28958c29697e30ea23fbbf71ed/README.md), MIT, npm 0.11.0 locked by package integrity. Using the SDK stdio client and system FFmpeg, initialized all eight tools and called overview, exact and burst tools on the actual desktop master. The 3.00 s native-width frame showed an 18-slot grid (09:00–17:30) under the Hebrew time question. A 2.40–3.12 s burst showed the day view give way to the time grid. The replayed exact JPEG had the same SHA-256. | Qualified for local visual extraction and used again on the final MP4. The agent read the frames visually. MCP’s npm install used `--ignore-scripts` and `npm audit --omit=dev` returned zero reported vulnerabilities. No browser-cookie or URL mode was used. |
| watch | [MIT upstream](https://github.com/mathiaschu/watch/blob/14c780e47bbafaf3b6ae22ec108615470cc89476/README.md). Offers FFmpeg sampling and local Whisper, and also URL/platform acquisition with yt-dlp. | Reviewed as a fallback. MCP worked on local files and every source is silent, so no Whisper, yt-dlp or browser auth was installed or exercised for this tool. |
| OpenMontage | [Pinned upstream](https://github.com/calesthio/OpenMontage/tree/2e003e65fa99a0f329478a2c1cdcf26bc481933a), AGPL-3.0. The maintained project’s Python tooling offers local trimming/assembly with FFmpeg, a provider registry, local production board and optional Remotion composition. Runtime prerequisites overlap with this host. Its default setup also adds SDKs for Google/OpenAI and a separate renderer. Provider selection can use cloud services when configured. | Reviewed as an isolated candidate. The scope is a small, silent factual edit of existing footage. No provider or large renderer is needed. No upstream code was adopted or vendored. Contract tests and minimum-render qualification were reserved for adoption and not run. |
| Remotion | [Official licensing](https://www.remotion.dev/license) describes the free license for individuals and companies of up to three people and a company license for other entities. | FFmpeg suffices for the approved offline workflow. Remotion was not installed. |
| FFmpeg and Pillow | [FFmpeg](https://ffmpeg.org/legal.html) system build with libx264, and [Pillow](https://pillow.readthedocs.io/en/stable/about.html#license) with an exact, hashed Linux CPython 3.12 wheel. No tool binaries are redistributed by the repository. The product marks are derived from Tori’s own `components/brand/logo.tsx` and `app/globals.css` at capture revision `b776bf5bed1130ff9ac04aedb7d171a49896ec8b`. | Rendering, QA, optional bidi title, and recut tests run locally. No new website dependencies. |

The analyzer emitted five deduplicated overview frames for the 7.84-second source. The exact native-size JPEG repeated with SHA-256 `249cc0f081b64816f7c7c4247bc972722bec7727823b984ff7dc4325db1704dd`. See [qualification receipt](../assets/review/tori/mcp-qualification.jsonl) and [final review](../assets/review/tori/REVIEW.md). JPEGs and caches from upstream were held in private scratch directories.

## Engineering-OS sources used

Engineering-OS revision `477a27d0e8852fc63318b5949fc0e05b4d3df809` was up to date on the accessible main branch.

| Knowledge path | Applied and verified |
| --- | --- |
| `capability-registry/video-analysis/mcp-video-analyzer.md` | Local file, visual-only question, higher-resolution still, precise burst, repeated frame, and final-file reinspection. |
| `external-skills/watch-video/README.md`, `external-skills/openmontage/README.md` | Local fallback options and explicit adoption gate. Assessment above. |
| `docs/product-experience/video-hooks-and-retention-research.md` | Open on a real, understandable action that matches the payoff. No retention claim. |
| `docs/product-experience/premium-motion-and-design-systems.md`, `docs/ui-ux/MOTION-AND-INTERACTIONS.md` | Shared dark matte, meaningful shot scale, readable focused UI frames, restrained device transitions and native RTL capture. |
| `external-skills/ui-ux-pro-max/README.md` | Reviewed as design guidance. No website UI or external styling package was added. |

Five pipeline regression tests cover deterministic role routing and shot selection, range/crop rejection, circular story rejection, the optional title’s budget, and corrupt MP4 boxes. Real end-to-end build and browser receipts are in `assets/review/tori`. The optional bidi-title/alternate-size smoke found that its PNG input did not set a sample aspect ratio. Explicitly setting square pixels fixed the track metadata.
