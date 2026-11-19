# Local screen-recording studio

This pipeline keeps each project’s masters, editorial recipe, and review cut reproducible. FFmpeg and Pillow do the rendering. A vision-capable reviewing agent decides what the recording shows and ranks candidate moments. The planner chooses the strongest reviewed candidate for each story role, orders roles by their dependencies and scores, and allocates an integer frame budget. The renderer never sends footage to hosted services.

## Setup

Use Git LFS, CPython 3.12, FFmpeg and ffprobe with libx264, WebP and librsvg support, fontconfig, and DejaVu Sans. The Pillow wheel lock is for Linux x86-64 with glibc 2.27 or newer. On other platforms install the same Pillow version from a separately verified wheel with RAQM (for bidirectional title text). Use a private output directory.

From the Portfolio checkout:

```sh
git lfs install --local
git lfs pull
git lfs fsck
cd tools/video-production
python3.12 -m venv .venv
.venv/bin/python -m pip install --require-hashes -r requirements.lock
.venv/bin/python -m unittest -v
```

For the optional local analyzer, use Node >=22.12 and the nested npm lock. Ignore install hooks and point the analyzer to the same system FFmpeg. The commands use only local absolute MP4 paths. The analyzer emits images and timestamp receipts. It has no semantic model of its own.

```sh
npm ci --ignore-scripts
npm audit --omit=dev
export FFMPEG_BIN="$(command -v ffmpeg)"
```

## Ingest, direct, build, review

Run from this directory. Use a new private scratch directory for each working cut.

```sh
sources="$(cd ../../assets/source/tori && pwd)"
scratch="$(mktemp -d)"
.venv/bin/python studio.py analyze --config tori.json --sources "$sources" --output "$scratch/source"
node mcp-review.mjs "$sources/booking-desktop.mp4" "$scratch/qualification"
.venv/bin/python studio.py build --config tori.json --sources "$sources" --output "$scratch/final"
node mcp-review.mjs "$scratch/final/tori-showcase-16x9.mp4" "$scratch/mcp-final" \
  0 2 5 8.32 11.28 14.32 17.96 > "$scratch/mcp-qa.jsonl"
ffplay -autoexit "$scratch/final/tori-showcase-16x9.mp4"
```

For a future project, use this sequence:

1. Collect real screen recordings and write a `manifest.json` with each local filename, bytes, SHA-256, width, height and duration in seconds. [Tori’s manifest](../../assets/source/tori/manifest.json) is an example. The ingest and build commands both verify hashes and fully decode every master.
2. Copy the project config. Set the project identity, source manifest name, size, frame rate and duration. Run `analyze` and examine the timestamped sheets. For small text, read the native-width frame from the analyzer or review an exact FFmpeg frame. Identify events, readable focal regions, bad frames and any details that should stay out of the edit.
3. Add candidate ranges with names, an observed event, source coordinates if a crop is needed, a story role and a score. Use higher scores for clarity and stronger evidence, with candidate alternatives recorded in the plan. Use `after` only for roles that need a causal order. Unconstrained roles are ordered by the best eligible candidate score. A crop is `[x, y, width, height]` in even source pixels. Use `"layout": "phone"` for vertical footage. To soften a high-contrast change in framing, set `"dissolve": true` on the incoming role and inspect the blended frames. Set `poster_role` to the state that best represents the project.
4. Generate the cut. `--duration 17.5` and `--resolution 1280 720` override the config when wanted. `title_card` optionally enables a short project title. Provide plain single-line WebVTT text in the config under language and role. The actual Tori video has no intro card and keeps captions as separate EN and HE tracks.
5. Play the real result and compare the images in `contact-sheet.jpg` and `seams.jpg` with `timeline.json`. Check the first and last frames, every editorial boundary, readability and any suspected loading frames, overlay, flicker or privacy issue. The MCP helper accepts seam centers in seconds and retrieves source PTS bursts. Repeat with revised ranges or framing when you find a defect. `qa.json` reports all-frame decode and integrity checks. Changes in adjacent luminance flag points to inspect. They don’t classify application states or guarantee privacy.
6. Keep the masters and review cut in Git LFS outside `public/`. Put reviewed footage in the website’s media manifest only through a separate approved publication change.

The optional browser smoke uses Portfolio’s existing Playwright development dependency and installed Chromium. It serves the MP4 over loopback and plays it continuously at 1×, checking presentation through the end and dropped frames.

```sh
CHROMIUM_PATH="$(command -v chromium)" node browser-smoke.mjs "$scratch/final/tori-showcase-16x9.mp4"
```

The commands and QA results apply to the verified binaries and reviewed cut. Encoder, font and rasterizer versions can change output bytes across hosts.
