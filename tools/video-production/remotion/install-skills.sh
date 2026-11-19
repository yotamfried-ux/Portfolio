#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
scratch=$(mktemp -d)
trap 'rm -rf "$scratch"' EXIT
git clone --quiet https://github.com/remotion-dev/skills.git "$scratch/upstream"
git -C "$scratch/upstream" checkout --quiet 6f55706d1069e512430582ad86e4e57dc07afe1b
for skill in remotion-markup remotion-render remotion-studio; do
  mkdir -p ".agents/skills/$skill"
  cp -R "$scratch/upstream/skills/$skill/." ".agents/skills/$skill/"
done
