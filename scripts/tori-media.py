#!/usr/bin/env python3
"""Inspect, decode, and inventory the five private Tori recording masters."""

import argparse
import hashlib
import json
import re
import struct
import subprocess
from pathlib import Path

SOURCE = Path(__file__).resolve().parents[1] / "assets/source/tori"
SCENES = {
    "booking-desktop": ("Full desktop booking", (1920, 1080)),
    "calendar-owner": ("New booking in the business owner's calendar", (1920, 1080)),
    "availability-settings": ("Owner adjusts working hours and checks the public slots", (1920, 1080)),
    "confirmation-preview": ("Customer confirmation and appointment details, with no email delivery", (1920, 1080)),
    "booking-mobile": ("Full mobile booking", (390, 844)),
}


def digest(path, algorithm):
    with path.open("rb") as media:
        return hashlib.file_digest(media, algorithm).hexdigest()


def faststart(path):
    atoms = []
    with path.open("rb") as file:
        while file.tell() < path.stat().st_size:
            start = file.tell()
            size, kind = struct.unpack(">I4s", file.read(8))
            if size == 1:
                size = struct.unpack(">Q", file.read(8))[0]
            if size == 0:
                size = path.stat().st_size - start
            if start + size <= file.tell() - 1 or start + size > path.stat().st_size:
                raise ValueError(f"Malformed MP4 atom in {path.name}")
            atoms.append(kind)
            file.seek(start + size)
    return b"moov" in atoms and b"mdat" in atoms and atoms.index(b"moov") < atoms.index(b"mdat")


def inspect(path, description, dimensions):
    probe = subprocess.check_output([
        "ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", str(path)
    ])
    data = json.loads(probe)
    (video,) = data["streams"]
    actual = (video["width"], video["height"])
    duration = float(data["format"]["duration"])
    if (
        video["codec_name"] != "h264" or video["pix_fmt"] != "yuv420p"
        or actual != dimensions or duration <= 1 or not faststart(path)
    ):
        raise ValueError(f"Unexpected format for {path.name}: {actual}, {duration}s")
    subprocess.run(
        ["ffmpeg", "-nostdin", "-v", "error", "-xerror", "-i", str(path), "-f", "null", "-"], check=True
    )
    return {
        "file": path.name, "scenario": description, "duration_seconds": round(duration, 3),
        "width": actual[0], "height": actual[1], "format": "H.264 MP4, yuv420p, faststart, silent",
        "bytes": path.stat().st_size, "sha256": digest(path, "sha256"), "md5": digest(path, "md5"),
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--capture-revision", help="Exact 40-character Tori commit used to record the clips")
    args = parser.parse_args()
    manifest = SOURCE / "manifest.json"
    if args.capture_revision and not re.fullmatch(r"[0-9a-f]{40}", args.capture_revision):
        parser.error("supply the full Tori Git revision")
    entries = [inspect(SOURCE / (key + ".mp4"), *details) for key, details in SCENES.items()]
    if args.capture_revision:
        record = {
            "source": "yotamfried-ux/Appointment-scheduling-system",
            "capture_revision": args.capture_revision,
            "environment": "Local real Tori app with synthetic fixtures, PostgreSQL, GoTrue and PostgREST",
            "files": entries,
        }
        manifest.write_text(json.dumps(record, ensure_ascii=False, indent=2) + "\n")
    elif entries != json.loads(manifest.read_text())["files"]:
        raise SystemExit("Media differs from the committed manifest")
    print("\n".join(f"{f['file']} {f['duration_seconds']:.3f}s {f['width']}x{f['height']} {f['sha256']}" for f in entries))


if __name__ == "__main__":
    main()
