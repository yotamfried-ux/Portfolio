# Tori showcase review

18.000 seconds, 1920 × 1080, 25 fps. The cut begins on a usable mobile time grid, moves through desktop booking and the owner’s workflow, and returns to the same device framing for the genuine confirmation. The clip and its poster are held here for review.

## Visual evidence and decisions

| Output | Source range | Observed evidence and editing decision |
|---|---|---|
| 0.00–2.00 | Mobile 2.60–3.36 | Start on visible choices. The 09:30 chip turns green while the Tori mark stays outside the recorded screen. The date and contact typing are omitted here. |
| 2.00–5.00 | Desktop booking 1.56–3.56 | A day is selected, the time grid appears, and a slot turns green. Crop retains the progress, service summary, and full grid. Ends before the contact form. |
| 5.00–8.32 | Owner calendar 0.52–2.92 | The count resolves from zero to one and the 09:00 entry becomes visible. The date, day list and entry are within the same frame. |
| 8.32–11.28 | Availability 0.82–1.56 | Sunday’s closing time changes from 18:00 to 12:00. The heading, Sunday controls, and shortened bar are visible. Omits the later scroll to the toast. |
| 11.28–14.32 | Availability 6.76–8.84 | The customer view shows 09:00–12:00 and six morning slots. Matching booking crop makes the change in slot count easy to see. |
| 14.32–18.00 | Mobile 5.32–7.56 | The verified client-side confirmation is visible, with the same phone placement, mark and backdrop as the opening. The UI text mentions email, and the clip depicts only on-screen confirmation from the local demo. |

All five source MP4s were verified against the [capture manifest](../../source/tori/manifest.json), fully decoded, and sampled at half-second intervals. I inspected all five sheets and requested closer samples around the slot loading, Sunday edit and mobile form-to-confirmation change. The desktop confirmation master showed a legitimate but already settled result and repeated the stronger mobile ending. It was reviewed and preserved, then dropped from the cut.

The mobile and desktop captures contain separate fixture appointments. The edit demonstrates equivalent flows across devices. It does not claim one shared booking across the two runs. Confirmation and client details are from isolated synthetic fixtures. The final cut omits the contact form and contains no visible credential, internal address, email recipient, or real customer data found in the reviewed frames.

- [Final contact sheet](contact-sheet.jpg) and [exact seam frames](seams.jpg) were extracted from the encoded MP4. I checked the opening selection, date change, calendar arrival, Sunday close, reduced grid and on-screen confirmation in playback order, plus exact frames on either side of each cut.
- [MCP frame timestamps](mcp-qa.jsonl) cover each of the five edits and both loop endpoints, using source presentation timestamps. Sparse overview extraction deduplicated holds, so I also inspected the full timed sheet and boundary bursts. The check at 17.96 → 0.00 keeps the phone frame, brand and matte anchored. The active UI switches from confirmation back to booking.
- [Iteration comparison](iteration.jpg) shows the first render’s loading states and early mobile cut, and the final replacements. The earlier form image is cropped to the title in this evidence. In another pass, the technical report identified two device switches with a mean frame-to-frame luma delta of 124.189 and 123.293 on an 8-bit scale. The final four blended frames at 2.00 and 14.32 reduce the largest step across those switches to 25.077. Overlap clears at 2.16 and 14.48 before the actions and reading holds.
- [Full-decode QA](qa.json) verifies 450 frames, one High Profile H.264 video track, square pixels, yuv420p, no audio and the MP4 header before the media data. No decoded frame was flagged as dark or nearly solid. [Chromium playback](browser-playback.json) exercised continuous 1× playback to 17.96 s.
- The calendar poster comes from 6.64 s, after the owner record appears. The source UI is preserved inside the video, and the opening/closing brand mark uses the calendar-check geometry and Lagoon color in the Tori capture revision. Captions are optional EN and HE WebVTT tracks.

The 1080p deliverable was reviewed. Some fine print will be small in an inline card on a phone. Viewer retention and legibility at the final embedding size still require owner review. Frame and playback checks establish media integrity and visual evidence, with no live-site acceptance claim.

## Reproducibility and tooling

See the [setup and exact production commands](../../../tools/video-production/README.md), [agent-authored recipe](../../../tools/video-production/tori.json), [selected timeline](timeline.json) and [Engineering-OS assessment](../../../docs/TORI_VIDEO_TOOLING.md). A second build produced the same MP4 and poster bytes on the qualified host. The [technical report](qa.json) gives exact hashes and sizes. The private masters and final MP4 use Git LFS.
