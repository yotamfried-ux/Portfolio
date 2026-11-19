#!/usr/bin/env python3
"""Render the Tori showcase and individual editorial shots from verified MP4 masters."""
import argparse
import json
import shutil
import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
TIMELINE = ROOT / "docs/tori-showcase-timeline.json"
FONT = Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf")


def ffmpeg(*args):
    subprocess.run([
        "ffmpeg", "-nostdin", "-hide_banner", "-loglevel", "error",
        "-filter_complex_threads", "1", "-filter_threads", "1", *map(str, args),
    ], check=True)


def brand(draw, x, y, scale):
    # Calendar-check geometry and lagoon color from Tori's LogoMark.
    def pos(x_offset, y_offset):
        return x + x_offset * scale, y + y_offset * scale

    for corners, radius in [((2, 5, 30, 30), 7), ((9, 2, 12, 9), 1.5), ((20, 2, 23, 9), 1.5)]:
        left, top, right, bottom = corners
        draw.rounded_rectangle([pos(left, top), pos(right, bottom)], radius * scale, fill="#0a6b5e")
    points = [pos(10.5, 18.5), pos(14.5, 22.5), pos(22, 14.5)]
    draw.line(points, fill="white", width=round(3 * scale), joint="curve")


def slate(output, shot, size):
    width, height = size
    backdrop = Image.new("RGB", size)
    pixels = backdrop.load()
    for y in range(height):
        for x in range(width):
            light = max(0, 1 - ((x - 1020) / 1250) ** 2 - ((y - 248) / 825) ** 2)
            pixels[x, y] = (round(8 + 14 * light), round(17 + 29 * light), round(20 + 27 * light))
    x, y, w, h = shot["frame"]
    shadow = Image.new("RGBA", size)
    ImageDraw.Draw(shadow).rounded_rectangle((x - 8, y + 1, x + w + 8, y + h + 17), 18, fill=(0, 0, 0, 160))
    art = Image.alpha_composite(backdrop.convert("RGBA"), shadow.filter(ImageFilter.GaussianBlur(14)))
    draw = ImageDraw.Draw(art)
    draw.rounded_rectangle((x - 6, y - 6, x + w + 5, y + h + 5), 11, fill="#132624", outline="#48706b", width=1)
    if shot["branding"] == "header":
        brand(draw, 91, 32, 1)
        draw.text((134, 35), "Tori", font=ImageFont.truetype(str(FONT), 26), fill="#eef5f3")
    else:
        brand(draw, 183, 252, 2.45)
        draw.text((174, 338), "Tori", font=ImageFont.truetype(str(FONT), 94), fill="#eef5f3")
    art.convert("RGB").save(output)


def render_shot(shot, source, slate_path, output, fps):
    x, y, width, height = shot["frame"]
    crop = shot.get("crop")
    crop_filter = f"crop={':'.join(map(str, crop))}," if crop else ""
    filters = (
        f"[0:v]{crop_filter}scale={width}:{height}:flags=lanczos,setsar=1,fps={fps}[ui];"
        f"[1:v][ui]overlay={x}:{y}:shortest=1,format=yuv420p"
    )
    ffmpeg("-ss", shot["start"], "-i", source / shot["source"],
           "-loop", 1, "-framerate", fps, "-i", slate_path, "-filter_complex", filters,
           "-t", shot["length"], "-an", "-c:v", "libx264", "-threads", 2,
           "-crf", 16, "-movflags", "+faststart", output)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path, help="Directory containing the original verified Tori MP4 files")
    parser.add_argument("output", type=Path, help="New directory for the showcase, poster and Vids clips")
    args = parser.parse_args()
    timeline = json.loads(TIMELINE.read_text())
    fps, dissolve, shots = timeline["fps"], timeline["dissolve_seconds"], timeline["shots"]
    args.output.mkdir()
    segments = args.output / "vids-clips"
    segments.mkdir()
    with tempfile.TemporaryDirectory() as scratch:
        backgrounds = Path(scratch)
        inputs = []
        inputs_end = shots[0]["length"]
        filters = [f"[{i}:v]setpts=PTS-STARTPTS,fps={fps}[s{i}]" for i in range(len(shots))]
        for index, shot in enumerate(shots):
            background = backgrounds / f"{index}.png"
            slate(background, shot, timeline["canvas"])
            segment = segments / f"{index + 1:02}-{shot['id']}.mp4"
            render_shot(shot, args.source, background, segment, fps)
            inputs.extend(["-i", segment])
            if index:
                left = "s0" if index == 1 else f"x{index - 1}"
                filters.append(
                    f"[{left}][s{index}]xfade=transition=fade:duration={dissolve}:"
                    f"offset={inputs_end - dissolve:.3f},fps={fps}[x{index}]"
                )
                inputs_end += shot["length"] - dissolve
        showcase = args.output / "showcase.mp4"
        ffmpeg(*inputs, "-filter_complex", ";".join(filters), "-map", f"[x{len(shots) - 1}]",
               "-an", "-c:v", "libx264", "-threads", 2, "-preset", "slow", "-crf", 21,
               "-pix_fmt", "yuv420p", "-movflags", "+faststart", showcase)
        ffmpeg("-ss", "5.6", "-i", showcase, "-frames:v", 1, "-c:v", "libwebp", "-quality", 82, args.output / "poster.webp")
    shutil.copyfile(TIMELINE, args.output / TIMELINE.name)
    ffmpeg("-xerror", "-i", showcase, "-f", "null", "-")


if __name__ == "__main__":
    main()
