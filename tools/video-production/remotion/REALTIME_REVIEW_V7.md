# Independent creative improvement — real-time pacing and frame-accurate QA

## Status

**Engineering fix: complete on the review branch. Creative release: NOT APPROVED.**

This change is stacked on PR #9 and does not modify the live Portfolio.

## Root cause repaired in the Remotion director

The prior stage path used `setpts=(target_duration / source_duration)*(PTS-STARTPTS)`, converting:
- 0.64 seconds of booking into 2.20 seconds
- 0.68 seconds of confirmation into 1.64 seconds
- 1.36 seconds of calendar interaction into 2.92 seconds
- 0.76 seconds of hours editing into 2.96 seconds
- 0.64 seconds of availability into 2.68 seconds

This is an unwanted 2–4× slow-motion effect, not genuine product motion.

The director now passes frames at source speed and permits a maximum `0.24 s` hold on the last frame. Anything longer fails with a clear recapture/shorten instruction.

Action and cinema configs use durations close to the captured source lengths instead of filling a predetermined 12–15-second target. Added five regression tests covering valid/invalid source-time preservation.

## Creative changes in the Remotion component

- A scene-aware text rail uses meaningful, concise captions (`CHOOSE A TIME`, `BOOKING CONFIRMED`, etc.) without covering the original UI.
- A progress indicator and restrained frame-direction keep motion legible.
- More useful frame area for the authentic product; smaller black matte.
- The changes are present in code on this review branch. **A new Remotion-rendered MP4 from this exact branch has not yet been executed on its Node toolchain**, so there is no claim that all creative changes were runtime-qualified.

## Independently rendered V7 comparison

A separate, reproducible offline `Pillow/OpenCV/FFmpeg` review edit was rendered from the five real original Tori MP4 masters in Portfolio PR #5. This **is not claimed to be a Remotion render**. It previews the intended fast editorial rhythm and authentic interaction-first structure.

- **Review copy**: private Drive folder [Creative Review V7 - Realtime](https://drive.google.com/drive/folders/1DTrp5wR2p67A5_t794NRbc38oM_u2RL5)
- 8.56 seconds; 1600×900; 25 fps; 214 frames
- SHA-256: `830a5b3e02cf2136e228db47ed3f4b4f7cf57fe738f36f3b56a2cc65ad9f9e58`
- FFmpeg full decode: PASS; full Chromium playback: 214/214 frames, 0 dropped
- source interactions remain at true speed; no synthetic UI, no actual notification delivery
- original recordings are stored in the PR #5 branch; no production services or payments used

### Visual review decisions

Initial revision rejected: opening too wide and dominant white space.

Second revision rejected: crop excluded the selected slot or focused on the wrong hours row.

V7 reframe inspected at 0.12, 0.45, 0.86, 1.25, 1.8, 2.3, 3.1, 3.7, 4.25, 4.85, 5.35, 5.95, 6.65, 7.4 and 8.13 seconds.

This is a **visibly faster and more action-focused review cut**, not proof of Hollywood-level studio art direction. The source footage remains white UI at 25 fps, some mobile details are small, and the standalone render is not yet the Remotion composition from this branch.

## Next acceptance gate (must run before merge)

1. Run `cd tools/video-production/remotion && python3.12 -m unittest -v test_realtime_pacing.py` and full original tests.
2. Execute both updated Remotion variants on the original approved takes (LFS pull). Validate 25 fps with no source retiming and re-render actual MP4.
3. Re-inspect actual Remotion outputs (full-time frames, important cuts, 350px card embedding, browser smoke). Note action cut is now ~4.84s, so evaluate a new natural-speed 8–12s story only if authentic source material supports its duration.
4. Compare real before/after artifacts, improve typography and action legibility until editorial quality is acceptable; only then seek owner approval.
5. **Do not publish, auto-merge or claim PR #9 is ready solely based on these fixes.**
