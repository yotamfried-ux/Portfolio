# Tori capture and editing workflow

The private editing masters live under `assets/source/tori/`. The Portfolio website's public media directory and media manifest are reserved for approved edits.

## Record the five scenes

Use a clean checkout of the Tori recorder branch, Node.js 22 or later, Chromium, FFmpeg with libx264, ffprobe, and a fresh local Supabase stack. The capture script builds Tori and starts a production-mode Next server on loopback. It uses synthetic business and customer fixtures, fake email and billing adapters, and keeps the outbox kick disabled. It does not invoke notification workers, webhooks, payments, or reminder jobs. The application and browser are restricted to local endpoints during capture.

```sh
npm ci
npm run db:start
npx playwright install chromium
bash scripts/recording/capture.sh /absolute/path/to/new-capture
```

With an existing compatible Chromium, install just Playwright's recording helper with `npx playwright install ffmpeg`, then set `TORI_CHROMIUM_PATH=/absolute/path/to/chromium` when running capture. Use a disposable stack dedicated to recording and stop it with `npm run db:stop` afterward.

### Compact stack for a disk-constrained host

The initial recordings used this equivalent local stack because the full Supabase database container exceeded the workspace disk budget. It runs PostgreSQL 17, GoTrue v2.197.0 and PostgREST v16.4 with the Tori migrations. The HTTP gateway only forwards requests to those services on loopback. It returns real service responses.

Provide PostgreSQL binaries including `initdb`, `pg_ctl` and `psql`. In the capture workspace, PostgreSQL 17.12 came from the Debian 13 `postgresql-17` and `postgresql-client-17` packages extracted with `dpkg-deb -x`. On a compatible Linux host, the GoTrue and PostgREST binaries can be extracted from their official images by using `docker create` and `docker cp` on a temporary container, then removing that container.

| Binary | Official image | Path inside the image |
| --- | --- | --- |
| GoTrue | `public.ecr.aws/supabase/gotrue:v2.197.0` | `/usr/local/bin/auth` |
| PostgREST | `public.ecr.aws/supabase/postgrest:v16.4` | `/bin/postgrest` |

In separate terminals in the Tori checkout, run:

```sh
TORI_PG_BIN=/path/to/postgresql/bin TORI_AUTH_BIN=/path/to/auth TORI_REST_BIN=/path/to/postgrest \
  bash scripts/recording/start-compact-stack.sh /absolute/path/to/new-local-state
```

```sh
TORI_RECORDING_KEYS=/absolute/path/to/new-local-state/keys.json \
  TORI_CHROMIUM_PATH=/path/to/chromium \
  bash scripts/recording/capture.sh /absolute/path/to/new-capture
```

The state directory contains generated local credentials and should stay outside either Git repository. Stop the stack with Ctrl+C after capture. Preserve the originals in the capture output's `webm/` directory if another edit is planned. Only the measured MP4 masters are committed.

## Inventory and review the masters

Use Python 3.11 or later for the verifier and sync workflow. Copy the five MP4 files from the capture output into `assets/source/tori/` in the private Portfolio checkout. Generate the machine-readable manifest using the full Git SHA of the Tori checkout used to record.

```sh
git lfs install
cp /absolute/path/to/new-capture/mp4/*.mp4 assets/source/tori/
python3 scripts/tori-media.py --capture-revision FULL_TORI_GIT_SHA
python3 scripts/tori-media.py
git lfs fsck
```

Review the beginning, several points in the middle, and the ending of each clip in a player. Check UI text, credentials, address bars, and accidental notifications. If the scene starts with a blank frame or an internal address, trim those frames from the original WebM and re-encode with the same FFmpeg settings in the capture script. Regenerate the manifest and update the README table after trimming. After pushing, fetch the branch in a fresh checkout, run `git lfs install --local` and `git lfs pull`, then run `python3 scripts/tori-media.py` again. The verifier checks resolution, duration, pixel format, H.264, faststart, full decode, and hashes against the manifest.

## Sync private editing copies to Google Drive

Authorize once on a machine where you can sign in to your Google account. Install rclone if needed and run `rclone config`. Create a remote named `tori-drive`, choose the Google Drive backend, leave client ID and secret blank to use rclone's default app, and choose the Drive scope that lets rclone find and update the destination folder. For an existing folder, choose full Drive access. On a desktop, let rclone open the browser, choose the owner account, and approve access. On a headless machine, answer **No** when asked to use the browser. Run the exact `rclone authorize` command shown by rclone on a trusted computer with a browser, then paste the result into the interactive rclone setup. Keep that result and the rclone configuration private. Select **No** for a shared drive.

If the destination folder already exists, check in Drive that its General access is **Restricted** and that its parent folders are private. The workflow creates missing folders and leaves sharing permissions as they are.

```sh
git lfs pull
bash scripts/sync-tori-drive.sh
```

The script copies the five MP4s and manifest to `Portfolio/Video Assets/Tori/Raw Captures`, reconciles sizes and MD5 hashes through an authenticated listing, and stores file IDs and access status in a private receipt under Git's internal directory. It does not create public links.

## Edit in Google Vids and Flow

- **Google Vids.** In a private Vids project, choose **Drive & Photos → Google Drive**, locate the Raw Captures folder, insert an MP4 and play it in the editor. Confirm the desktop and vertical framing before editing. [Google Vids help](https://support.google.com/docs/answer/14917464)
- **Google Flow.** Use Flow's supported local video upload where available. Download the verified Drive copy or use the local LFS copy, and trim a working copy if Flow rejects its duration. Check that the first and last frames and orientation are correct after import. [Google Flow help](https://support.google.com/flow/answer/16353334)
- Keep working edits private and use separate filenames. Before publication, review the full edited videos for private details, add captions and transcripts, and obtain approval to update `src/lib/media.ts` and publish optimized derivatives.
