# Portfolio Remotion studio

This workspace runs the controlled Tori experiment and the private production pipeline. FFmpeg verifies, trims, stages, and encodes real footage. Remotion handles frame-directed camera, viewports, transitions, and branding. A reviewing agent interprets the decoded frames, records observations with evidence, and selects and checks the output. The same approved recipe renders again without a person positioning keyframes.

## Isolated setup

Use Node 24, Python 3.12, Git LFS, FFmpeg/ffprobe with libx264 and WebP, Chromium, and Playwright from the Portfolio development install for browser QA.

```sh
git lfs install --local
git lfs pull
cd tools/video-production/remotion
npm ci --ignore-scripts
bash install-skills.sh
python3.12 -m venv .venv
.venv/bin/python -m pip install --require-hashes -r ../requirements.lock
export CHROMIUM_PATH="$(command -v chromium)"
node node_modules/typescript/bin/tsc
```

The installer places the official Remotion markup, rendering, and Studio skills at a pinned Git revision in the workspace’s `.agents/skills/`. Read those before changing renderer behavior. Studio starts with `npm run studio -- --no-open` on a private development machine. The CLI listens on the machine’s network interfaces. Use only private, local preview environments when staging media.

Remotion 4.0.545 is pinned with its lockfile. The Portfolio is an individual project under Remotion’s Free License. The license also permits companies of up to three people, subject to the terms. The workspace uses local traces and Chromium, with zero paid renders, subscriptions, or external media services. The website’s npm lockfile is separate. [Pricing and eligibility](https://www.remotion.dev/docs/license/pricing) · [Agent setup](https://www.remotion.dev/docs/ai/coding-agents) · [Official skills](https://www.remotion.dev/docs/ai/skills)

## Controlled experiment

```sh
work="$(mktemp -d)"
.venv/bin/python prepare.py --sources ../../../assets/source/tori --output "$work"
npm run render -- "$work/remotion.mp4"
CHROMIUM_PATH="$CHROMIUM_PATH" node ../browser-smoke.mjs "$work/remotion.mp4"
```

`experiment.json` fixes identical source ranges and frame allocations in both versions. The existing FFmpeg engine renders the baseline. The original video frame bytes are the source for both compositions. Remotion renders a spatial reveal and camera movement. Final encoding uses the same H.264 pixel format and silent playback. [Comparison and decision](../../../assets/review/tori-remotion/REVIEW.md)

## Capture

Use a fresh Tori checkout at the recorder revision in [the capture plan](capture/PLAN.md). Install that repository’s own dependencies and recording helper. Start a fresh loopback stack using Tori’s recorder runbook. Then run from this directory:

```sh
bash capture/record.sh /path/to/disposable-tori /absolute/new-capture-directory
```

The runner applies and reverts its patch in the disposable checkout, records action times and locator boxes, and uses existing fixture and no-delivery assertions. The entitlement remains local. Inspect the raw files in a private scratch directory, including the frames around each event. The approved source ranges in the project JSON refer to the measured recording made for this PR. Recaptures can shift event timing. Reverify the exact appearance and adjust the approved in/out points from recorded evidence each time.

```sh
sources="$(cd ../../../assets/source/tori-remotion && pwd)"
.venv/bin/python director.py ingest --config tori-production.json --takes /absolute/new-capture-directory \
  --sources /absolute/new-approved-sources --output "$work/source-review"
```

Only commit approved LFS takes with a regenerated manifest. Capture rejects an action that fails the Playwright oracle. The visual verification supports rejecting/retrying a capture when live layout, motion or readability is unsuitable. A successful new take still needs timestamped visual inspection before admission.

## Select, render, review

To reproduce the reviewed production versions from the committed approved sources:

```sh
for variant in action cinema; do
  .venv/bin/python director.py stage --config tori-production.json --sources "$sources" \
    --output "$work" --variant "$variant"
  npm run render -- "$work/$variant.mp4" "$work/recipe-$variant.json"
  .venv/bin/python review.py "$work/$variant.mp4" "$work/recipe-$variant.json" "$work"
  node ../browser-smoke.mjs "$work/$variant.mp4"
done
node embed-smoke.mjs "$work/action.mp4" "$work/action-poster.webp" "$work/card-review"
```

For visual QA, install the parent workspace’s analyzer with `npm ci --ignore-scripts` from `tools/video-production`. Call `mcp-review.mjs` with the absolute MP4 path, a private output directory and the edit boundaries from the rendered recipe. Inspect the exact frames around selection, any defective crop, the edit boundaries and both loop endpoints. Full-decode checks are separate from editorial approval. No auto-publish runs after a render.

## Reuse for another product

1. Inspect the real product and build a local fixture and capture adapter. Preserve viewport, exact interaction timestamps and successful UI assertions. Keep browser paths and secrets out of the render config.
2. Give the director a same-layout source manifest and a project JSON with identity, frame rate, resolution, duration per variant, story roles and candidate observations. Each accepted candidate has a source/action, verified range, crop, camera focus, ranking per treatment and a plain caption. The agent establishes the roles and evidence from actual frames. The director ranks eligible clips and allocates their frame budgets. Staging is sequential because a variant may assign a different time budget to a shot.
3. Configure optional source-sized device frames, camera emphasis, and a verified local mark. Keep the assets under the Remotion workspace’s ignored preview directory when staging. For an app with no brand mark omit the `mark` field. A different brand asset can be staged as a local file before rendering. For SportReel, capture the raw-to-processed interaction and use an actual export as the payoff. For the AI Agent System, capture a sanitized worker/run state change and an independently verified output.
4. Verify the two actual MP4s, inspect the frame evidence independently from the recipe, and document revisions and any remaining readability limits. Derive the poster and captions from the chosen version. Keep LFS uploads and private Drive separate from live website publication.
