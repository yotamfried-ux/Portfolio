#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

remote="${1:-tori-drive}"
if [[ ! "$remote" =~ ^[A-Za-z0-9_-]+$ ]]; then
  echo 'Usage: bash scripts/sync-tori-drive.sh [configured Drive remote name]' >&2
  exit 2
fi
if ! command -v rclone >/dev/null || ! rclone listremotes | grep -Fx "$remote:" >/dev/null; then
  echo "DRIVE_UPLOAD_BLOCKED: configure the OAuth remote '$remote' with rclone config first." >&2
  exit 1
fi
if [[ "$(rclone config show "$remote" | awk '$1=="type" && $2=="=" {print $3}')" != drive ]]; then
  echo 'DRIVE_UPLOAD_BLOCKED: the selected remote must use the Google Drive backend.' >&2
  exit 1
fi
folder="$remote:Portfolio/Video Assets/Tori/Raw Captures"
source_dir=assets/source/tori
receipt="$(git rev-parse --git-path tori-drive-receipt.json)"
python3 scripts/tori-media.py
rclone mkdir "$folder"
files=(booking-desktop.mp4 calendar-owner.mp4 availability-settings.mp4 confirmation-preview.mp4 booking-mobile.mp4 manifest.json)
for file in "${files[@]}"; do
  rclone copyto --checksum "$source_dir/$file" "$folder/$file"
done
umask 077
listing=$(mktemp)
trap 'rm -f "$listing"' EXIT
rclone lsjson --files-only --hash "$folder" > "$listing"
python3 - "$listing" "$receipt" <<'PY'
import hashlib
import json
import sys
import tempfile
from pathlib import Path

listing, receipt = map(Path, sys.argv[1:])
source = Path("assets/source/tori")
manifest = json.loads((source / "manifest.json").read_text())
files = json.loads(listing.read_text())
verified = []
for name in [row["file"] for row in manifest["files"]] + ["manifest.json"]:
    matches = [row for row in files if row["Name"] == name]
    if len(matches) != 1:
        raise SystemExit(f"Expected one Drive file for {name}, got {len(matches)}")
    row = matches[0]
    with (source / name).open("rb") as local:
        md5 = hashlib.file_digest(local, "md5").hexdigest()
    if row.get("Size") != (source / name).stat().st_size or {k.lower(): v for k, v in row.get("Hashes", {}).items()}.get("md5") != md5 or not row.get("ID"):
        raise SystemExit(f"Drive verification failed for {name}")
    verified.append({"file": name, "drive_file_id": row["ID"], "bytes": row["Size"], "md5": md5, "access_status": "verified_by_authenticated_listing"})
with tempfile.NamedTemporaryFile(mode="w", dir=receipt.parent, delete=False) as out:
    json.dump({"folder": "Portfolio/Video Assets/Tori/Raw Captures", "files": verified}, out, indent=2)
    out.write("\n")
    temp_path = Path(out.name)
temp_path.replace(receipt)
print(f"Verified {len(verified)} Drive files. Private receipt: {receipt}")
PY
