# Tori portfolio showcase

Tori uses one **19.32-second** product showcase on the project card and case study. It is a silent edit of the five authentic Hebrew UI captures in Portfolio PR #5, taken in the isolated Tori demo environment with synthetic data. The original master files stay in that private PR. The website uses the optimized derivative.

## Edit sequence

The canvas is 1280 × 720 at 25 fps. Keep the UI in focus, use brief dissolves between shots, and let the Tori calendar-check mark and wordmark carry the branding. The [timeline JSON](./tori-showcase-timeline.json) contains source trims, crop rectangles, and frame placement.

| Start on timeline | Shot | Source |
| ---: | --- | --- |
| 00:00.000 | Choose a service and move through day and time selection | Desktop booking |
| 00:04.440 | The new appointment in the business calendar | Owner calendar |
| 00:08.120 | Edit Sunday working hours | Availability settings |
| 00:11.160 | Show the resulting customer-facing time slots | Availability settings |
| 00:13.200 | Book on a phone, framed beside the wordmark | Mobile booking |
| 00:16.840 | End on the real customer appointment details and Tori mark | Confirmation preview |

The clip shows UI recorded locally with demo data. The **View Live App** action points to the verified Tori production landing page. On November 19, 2026 it returned HTTP 200 without sign-in, its canonical and Open Graph URLs matched the domain, and the app health endpoint returned OK. The verification used read-only requests. [Tori production landing page](https://turim.d2ryf.com/)

## Reproduce or edit in Google Vids

You need FFmpeg with libx264 and libwebp, Python 3 with Pillow, and DejaVu Sans Bold. Fetch the five original files from [Portfolio PR #5](https://github.com/yotamfried-ux/Portfolio/pull/5) using Git LFS, then run from the showcase branch:

```sh
python3 scripts/render-tori-showcase.py /path/to/pr5/assets/source/tori /path/to/new-output
```

The output contains `showcase.mp4`, a calendar poster, six individually framed clips in `vids-clips/`, and the timeline. Each clip can be moved or replaced independently. Upload the clips to a private Drive folder, then use **Drive & Photos → Google Drive** in Vids to import them in filename order. Use the start times above to reproduce the short overlaps, or use clean cuts where the editor does not support a 0.12-second dissolve. The six clips total 19.92 seconds if joined with cuts. Leave audio silent and keep extra titles out of the product shots. [Google Vids help](https://support.google.com/docs/answer/14917464)

The website master is H.264, yuv420p, and faststart. Both website placements wait for the visitor to press Play. The WebP poster appears initially and stays available on load failure. The case-study player has native controls, English and Hebrew descriptive tracks, and a transcript. The original captures and editable segment package are kept out of the website's public media folder.
