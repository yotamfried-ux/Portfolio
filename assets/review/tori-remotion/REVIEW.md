# Tori Remotion review

**Five-second experiment PASS. Selected production edit: Dynamic Product Experience, 12.40 seconds.**

[Experiment baseline](baseline.mp4) · [Experiment Remotion](remotion.mp4) · [Selected full cut](action.mp4) · [Cinematic full cut](cinema.mp4) · [Selected poster](action-poster.webp) · [English captions](captions-action.vtt)

## Controlled five-second test

Both outputs use the same desktop selection (2.96–3.60 s), genuine booking confirmation (5.60–6.52 s), and matching owner-calendar recording (0.56–2.84 s) from Portfolio PR #5. Segment budgets are 42, 25, and 58 frames at 25 fps. The desktop confirmation and owner row came from the same fixture. The old synthetic appointments and bookings were preserved privately.

| Output time | Observed comparison |
| --- | --- |
| 0.00–0.64 | The baseline leaves the selected time in a fixed wide crop. Remotion begins on loaded UI and advances the crop toward the grid before the change. At 0.64 s the same green 09:00 chip is about one-third wider, and the Hebrew time heading still fits. |
| 1.40–1.64 | A frame-grounded reveal brings in the genuine confirmation without obscuring both screens. In the first Remotion version, a teal plate covered most of the UI at 1.56 s. The revised version uses active footage across the moving boundary. |
| 2.44–2.68 | The same rule brings in the start of the business calendar. The calendar moves from zero to one during the genuine app update. |
| 3.56–4.96 | The second controlled camera move puts the matching appointment row and time in a larger, readable right-side region. The revised framing keeps the date and day count. The first experiment’s camera clipped the date. |

[Three-way frame comparison](comparison.jpg) and [analyzer burst sheet](experiment-bursts.jpg) show both improvements and the revision. The original UI text is rendered from captured pixels. The five-second MP4s each contain 125 decoded frames at 1280 × 720 with one silent, square-pixel H.264 track. The baseline and final experiment played end to end in Chromium. See the [FFmpeg baseline receipt](baseline-qa.json), [Remotion receipt](remotion-qa.json), and [timestamped local analyzer output](v2-bursts.jsonl). The gate passed before moving to fresh production capture.

## Fresh sources and selection

Playwright captured five new scenes in the real Tori application on the loopback-only stack. The test asserted booking persistence, the matching owner row, a saved hours change, reduced slot count, actual mobile completion and zero sent notifications. A blocked dynamic font request occurred during the isolated Next build for an unrelated generated image. The build and recording test completed successfully. The recorder delivered 25 fps. Startup, waiting states and contact-form frames were excluded from the accepted ranges.

The pipeline extracted nine independent, verified editorial takes from those scenes. The [source manifest](../../source/tori-remotion/manifest.json) has the LFS asset hashes. The [source observations](source-review/observations.json) have raw hashes, action receipts, bounds, in/out values and observed outcomes. The director ranked candidate states and allocated frames for both treatments. The vision and creative judgments were made by the agent from local decoded frames. The code automates selection from those observations and subsequent render and QA stages.

| Selected cut time | Visible state |
| --- | --- |
| 0.00–2.20 | Loaded booking grid and deliberate push toward the 09:00 choice, which becomes green within the first second. |
| 2.20–3.84 | Genuine on-screen confirmation for the desktop appointment. Delivery of email or other notifications is outside the demonstration. |
| 3.84–6.76 | The owner calendar switches day, count becomes one and the matching 09:00 booking row appears. |
| 6.76–9.72 | Sunday hours show the 18:00 to 12:00 edit and shortened interval bar. |
| 9.72–12.40 | Six morning options in the revised public booking view. The hours example is an independent fixture. |

The [dynamic edit](action-overview.jpg) uses direct cuts and two action-focused camera moves. The [cinematic edit](cinema-overview.jpg) adds a service-selection beat, moving reveals and a separate mobile ending. Its second booking view is explicitly marked “Also on mobile.” It offers more product context, but the extra booking beat and narrower mobile screen dilute the payoff at card size. The dynamic cut reaches 09:00 sooner and ends on the immediate effect of the hours change.

The [production comparison](production-iteration.jpg) shows the final opener reaching the selected state sooner, the owner row pulled away from the bottom edge, and the full availability heading kept in frame. The last slots hold was reduced from 3.60 s to 2.68 s. Both cuts were rerendered after the framing correction. [Dynamic cut seams](action-seams.jpg) · [Cinematic cut seams](cinema-seams.jpg) · [Dynamic MCP timestamps](action-bursts.jsonl) · [Cinematic MCP timestamps](cinema-bursts.jsonl)

## Playback and display limits

- The final cut is 12.40 s, 1280 × 720, H.264 High / yuv420p, 25 fps, 310 frames, faststart, and 1,348,254 bytes. All frames decoded, and zero were flagged as nearly solid or dark. Chromium played all the way through with zero reported dropped frames. The 14.40 s candidate fully decoded and played through, with five browser-dropped frames in that playback run. [Dynamic QA](action-qa.json) · [Cinematic QA](cinema-qa.json) · [Dynamic playback](action-playback.json) · [Cinematic playback](cinema-playback.json)
- Simulated current Portfolio card ratios use its 2.15:1 desktop and 1.9:1 mobile cover crops. The 586 px and 350 px media surfaces remained silent, displayed the poster before user action, and supported play and pause, including mobile reduced motion. The primary time chips, hours value and owner row remained visible. The compact cover crop trims the top brand mark and some peripheral UI. Small body text is best read at full size. [Card smoke results](card-review/embed.json) · [Desktop calendar](card-review/card-desktop-5.60.png) · [Mobile hours](card-review/card-mobile-8.90.png) · [Mobile slots](card-review/card-mobile-11.10.png)
- This is an internal visual acceptance for review. Recruitment or client retention, real-device playback beyond this Chromium host, and integration into a live page remain unverified.

The official Remotion skills and pinned dependencies are reproducible from the [studio runbook](../../../tools/video-production/remotion/README.md). Review was local and spent $0 on paid services.
