#!/usr/bin/env bash
set -euo pipefail
capture_dir=$(cd "$(dirname "$0")" && pwd)
if [[ $# -ne 2 ]]; then
  echo 'Usage: record.sh /path/to/disposable/tori-checkout /absolute/new-output-directory' >&2
  exit 2
fi
checkout=$1
destination=$2
: "${TORI_RECORDING_KEYS:?Start a dedicated loopback Tori stack and set TORI_RECORDING_KEYS}"
if [[ "$(git -C "$checkout" rev-parse HEAD)" != b776bf5bed1130ff9ac04aedb7d171a49896ec8b ||
  -n "$(git -C "$checkout" status --porcelain)" ]]; then
  echo 'Use a clean disposable checkout at the documented recorder revision.' >&2
  exit 2
fi
git -C "$checkout" apply --check "$capture_dir/tori-recorder.patch"
git -C "$checkout" apply "$capture_dir/tori-recorder.patch"
trap 'git -C "$checkout" apply -R "$capture_dir/tori-recorder.patch"' EXIT
bash "$checkout/scripts/recording/capture.sh" "$destination"
