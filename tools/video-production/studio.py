#!/usr/bin/env python3
"""Private local screen-recording ingestion, agent-led edit, render, and QA."""

import argparse
import hashlib
import io
import json
import math
import re
import struct
import subprocess
import tempfile
from fractions import Fraction
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps, features


def run(*args):
    return subprocess.run(args, check=True, stdout=subprocess.PIPE).stdout


def ff(*args):
    return run("ffmpeg", "-hide_banner", "-nostdin", "-v", "error", "-xerror",
               "-filter_threads", "2", "-filter_complex_threads", "2", *args)


def load(path):
    return json.loads(path.read_text())


def save(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")


def digest(path):
    with path.open("rb") as stream:
        return hashlib.file_digest(stream, "sha256").hexdigest()


def probe(path, count=False):
    flags = ["-count_frames"] if count else []
    return json.loads(run("ffprobe", "-v", "error", *flags,
                          "-show_streams", "-show_format", "-of", "json", path))


def safe_file(folder, name):
    if not name or name in {".", ".."} or Path(name).name != name:
        raise ValueError(f"Expected a local filename: {name!r}")
    return folder / name


def inventory(folder, manifest):
    entries = {}
    for entry in load(safe_file(folder, manifest))["files"]:
        name = entry["file"]
        path = safe_file(folder, name)
        checksum = digest(path)
        if checksum != entry["sha256"] or path.stat().st_size != entry["bytes"] or name in entries:
            raise ValueError(f"Manifest mismatch: {name} (check git lfs pull)")
        info = probe(path)
        (video,) = [stream for stream in info["streams"] if stream["codec_type"] == "video"]
        width, height = video["width"], video["height"]
        duration = float(info["format"]["duration"])
        if (width, height) != (entry["width"], entry["height"]) or abs(duration - entry["duration_seconds"]) > .02:
            raise ValueError(f"Unexpected dimensions or duration: {name}")
        ff("-threads", "2", "-i", path, "-map", "0:v:0", "-f", "null", "-")
        entries[name] = {"sha256": checksum, "width": width, "height": height, "duration": duration}
    if not entries:
        raise ValueError("Source manifest is empty")
    return entries


def make_plan(config, entries):
    roles = config["roles"]
    by_role = {role["id"]: role for role in roles}
    if not roles or len(by_role) != len(roles):
        raise ValueError("Story roles must be present and unique")
    ranked = {role: [] for role in by_role}
    ids = set()
    for candidate in config["candidates"]:
        source = entries[candidate["source"]]
        if candidate["id"] in ids or not 0 <= candidate["in"] < candidate["out"] <= source["duration"]:
            raise ValueError(f"Duplicate candidate or invalid range: {candidate['id']}")
        ids.add(candidate["id"])
        if "crop" in candidate:
            x, y, w, h = candidate["crop"]
            if min(x, y) < 0 or min(w, h) <= 0 or any(n % 2 for n in (x, y, w, h)) or x + w > source["width"] or y + h > source["height"]:
                raise ValueError(f"Invalid chroma-aligned crop: {candidate['id']}")
        if candidate.get("layout", "desktop") not in {"desktop", "phone"}:
            raise ValueError("Unsupported layout")
        if not math.isfinite(candidate["score"]):
            raise ValueError("Candidate score must be finite")
        ranked[candidate["role"]].append(candidate)
    chosen = {}
    for role, candidates in ranked.items():
        if not candidates:
            raise ValueError(f"No reviewed candidates for {role}")
        chosen[role] = max(candidates, key=lambda shot: (shot["score"], shot["id"]))

    fps = config["fps"]
    title_frames = round(fps * 1.2) if config.get("title_card") else 0
    total = round(config["duration"] * fps)
    total_weight = sum(role["seconds"] for role in roles)
    if any(role["seconds"] <= 0 for role in roles) or total <= title_frames:
        raise ValueError("Need positive story timing")
    start = title_frames
    elapsed_weight = 0
    ordered = {}
    shots = []
    while len(ordered) < len(roles):
        ready = [role for role, meta in by_role.items()
                 if role not in ordered and set(meta["after"]) <= ordered.keys()]
        if not ready:
            raise ValueError("Story dependencies are cyclic or refer to missing roles")
        role = max(ready, key=lambda name: (chosen[name]["score"], name))
        elapsed_weight += by_role[role]["seconds"]
        end = (total if len(ordered) + 1 == len(roles) else
               title_frames + round((total - title_frames) * elapsed_weight / total_weight))
        if end <= start:
            raise ValueError("A shot would receive no output frames")
        dissolve = by_role[role].get("dissolve", False)
        if dissolve and (start < 4 or end - start < 5):
            raise ValueError("A short dissolve needs four preceding frames and five shot frames")
        shots.append({**chosen[role], "start_frame": start, "end_frame": end, "dissolve": dissolve})
        ordered[role] = True
        start = end
    return {"fps": fps, "frames": total, "title_frames": title_frames, "shots": shots,
            "alternates": [c for c in config["candidates"] if c["id"] != chosen[c["role"]]["id"]],
            "sources": entries}


def font(family, size):
    if not features.check_feature("raqm"):
        raise RuntimeError("Pillow with libraqm is required for bidi text")
    path = run("fc-match", "-f", "%{file}", family).decode()
    return ImageFont.truetype(path, size, layout_engine=ImageFont.Layout.RAQM)


def background(config):
    width, height = config["resolution"]
    matte = Image.new("RGB", (width, height), config["matte"])
    accent = Image.new("RGB", (width, height), config["accent"])
    mask = Image.new("L", (120, 68))
    mask.putdata([round(48 * math.exp(-(((x - 91) / 45) ** 2 + ((y - 28) / 30) ** 2)))
                  for y in range(68) for x in range(120)])
    return Image.composite(accent, matte, mask.resize(matte.size, Image.Resampling.BICUBIC)).convert("RGBA")


def composition(config, aspect, layout, mark):
    width, height = config["resolution"]
    unit = height / 1080
    scale = lambda number: round(number * unit)
    canvas = background(config)
    draw = ImageDraw.Draw(canvas)
    if layout == "title":
        draw.text((width // 2, height // 2), config["project"], font=font(config["font"], scale(105)),
                  anchor="mm", fill="#f4f8f7")
        return canvas, None
    phone = layout == "phone"
    max_w, max_h = (width * .32, height * .91) if phone else (width * .86, height * .86)
    pane_w = int(min(max_w, max_h * aspect)) // 2 * 2
    pane_h = int(pane_w / aspect + .5) // 2 * 2
    center_x = round(width * (.70 if phone else .50))
    x = (center_x - pane_w // 2) // 2 * 2
    y = (height - pane_h) // 4 * 2
    edge = scale(13 if phone else 4)
    radius = scale(39 if phone else 25)
    draw.rounded_rectangle((x-edge-2, y-edge-2, x+pane_w+edge+1, y+pane_h+edge+1),
                           radius=radius+edge, fill="#45605f")
    draw.rounded_rectangle((x-edge, y-edge, x+pane_w+edge-1, y+pane_h+edge-1),
                           radius=radius+edge, fill="#0c1317")
    if phone:
        center = (round(width * .31), round(height * .51))
        if mark is not None:
            logo = mark.resize((scale(92), scale(92)), Image.Resampling.LANCZOS)
            canvas.alpha_composite(logo, (center[0]-logo.width//2, center[1]-scale(125)))
        draw.text(center, config["project"], font=font(config["font"], scale(112)),
                  anchor="mt", fill="#eaf4f1")
        draw.rounded_rectangle((center[0]-scale(29), center[1]+scale(118),
                                center[0]+scale(29), center[1]+scale(121)), radius=2, fill="#477c72")
    # Alpha is zero only inside the aperture; decoration cannot overlap the recorded UI.
    aperture = Image.new("L", (width * 2, height * 2), 255)
    ImageDraw.Draw(aperture).rounded_rectangle((2*x, 2*y, 2*(x+pane_w)-1, 2*(y+pane_h)-1),
                                               radius=2*radius, fill=0)
    canvas.putalpha(aperture.resize(canvas.size, Image.Resampling.LANCZOS))
    return canvas, (x, y, pane_w, pane_h)


def render(config, plan, sources, config_folder, output, working):
    fps = plan["fps"]
    mark_name = config.get("brand_mark")
    mark = None
    if mark_name:
        mark_path = safe_file(config_folder, mark_name)
        mark = Image.open(io.BytesIO(ff("-i", mark_path, "-vf", "scale=256:256",
                                        "-frames:v", "1", "-threads", "1",
                                        "-f", "image2pipe", "-vcodec", "png", "-"))).convert("RGBA")
    segments = []
    for index, shot in enumerate(plan["shots"]):
        source = safe_file(sources, shot["source"])
        info = plan["sources"][shot["source"]]
        crop = shot.get("crop", [0, 0, info["width"], info["height"]])
        matte, pane = composition(config, crop[2] / crop[3], shot.get("layout", "desktop"), mark)
        x, y, pane_w, pane_h = pane
        width, height = config["resolution"]
        layer = working / f"matte-{index}.png"
        matte.save(layer)
        segment = working / f"segment-{index:02}.mp4"
        frames = shot["end_frame"] - shot["start_frame"]
        stretch = (frames / fps) / (shot["out"] - shot["in"])
        w, h, cx, cy = crop[2], crop[3], crop[0], crop[1]
        graph = (f"[0:v]crop={w}:{h}:{cx}:{cy},scale={pane_w}:{pane_h}:flags=lanczos,"
                 f"setsar=1,setpts={stretch:.12f}*(PTS-STARTPTS),fps={fps},"
                 f"tpad=stop_mode=clone:stop_duration=1,pad={width}:{height}:{x}:{y}[ui];"
                 "[ui][1:v]overlay=format=yuv420")
        encode_to(segment, "-ss", str(shot["in"]), "-t", str(shot["out"]-shot["in"]),
                  "-threads", "2", "-i", source, "-i", layer,
                  "-filter_complex", graph, "-frames:v", str(frames))
        segments.append(segment)
    if plan["title_frames"]:
        title_path = working / "title.png"
        title, _ = composition(config, 1, "title", mark)
        title.save(title_path)
        segment = working / "title.mp4"
        encode_to(segment, "-loop", "1", "-framerate", str(fps), "-i", title_path,
                  "-vf", "setsar=1", "-frames:v", str(plan["title_frames"]))
        segments.insert(0, segment)
    playlist = working / "concat.txt"
    playlist.write_text("".join(f"file '{part.name}'\nduration {frames / fps:.8f}\n"
                                for part, frames in zip(segments, part_lengths(plan), strict=True)))
    dissolve_at = [shot["start_frame"] for shot in plan["shots"] if shot["dissolve"]]
    if dissolve_at:
        # Use the four preceding frames as handles. Mix only the brief
        # transition, retaining the planned time, geometry and clean holds.
        # blend counts frames from 1. Frame numbers in the plan start at 0.
        enabled = "+".join(f"between(n,{start},{start+4})" for start in dissolve_at)
        blend = ("[0:v]split[base][history];[history]tmix=frames=5:weights='1 1 1 1 1'[soft];"
                 f"[base][soft]blend=all_expr='B':enable='{enabled}'")
        encode_to(output, "-f", "concat", "-safe", "1", "-i", playlist, "-filter_complex", blend)
    else:
        ff("-f", "concat", "-safe", "1", "-i", playlist, "-map", "0:v:0", "-c", "copy",
           "-map_metadata", "-1", "-movflags", "+faststart", "-y", output)


def encode_to(path, *args):
    ff(*args, "-map_metadata", "-1", "-an", "-sn", "-dn", "-c:v", "libx264",
       "-preset", "fast", "-crf", "17", "-threads", "4", "-pix_fmt", "yuv420p",
       "-movflags", "+faststart", "-y", path)


def part_lengths(plan):
    title = [plan["title_frames"]] if plan["title_frames"] else []
    return title + [s["end_frame"]-s["start_frame"] for s in plan["shots"]]


def atoms(path):
    result = []
    size = path.stat().st_size
    with path.open("rb") as stream:
        while stream.tell() < size:
            start = stream.tell()
            length, name = struct.unpack(">I4s", stream.read(8))
            header = 8
            if length == 1:
                length, = struct.unpack(">Q", stream.read(8))
                header = 16
            elif length == 0:
                length = size - start
            if length < header or start + length > size:
                raise ValueError("Invalid MP4 box length")
            result.append(name.decode("ascii"))
            stream.seek(start + length)
    return result


def verify(path, config, plan):
    data = probe(path, count=True)
    fps, expected = plan["fps"], plan["frames"]
    (stream,) = data["streams"]
    boxes = atoms(path)
    checks = {
        "single_silent_h264_track": stream["codec_type"] == "video" and stream["codec_name"] == "h264",
        "square_pixels_yuv420p": stream["pix_fmt"] == "yuv420p" and stream.get("sample_aspect_ratio") == "1:1",
        "dimensions": [stream["width"], stream["height"]] == config["resolution"],
        "frame_rate_and_count": Fraction(stream["avg_frame_rate"]) == Fraction(fps)
        and Fraction(stream["r_frame_rate"]) == Fraction(fps) and int(stream["nb_read_frames"]) == expected,
        "duration_and_start": abs(float(data["format"]["duration"]) - expected / fps) < .002
        and abs(float(stream["start_time"])) < .002,
        "faststart": "moov" in boxes and "mdat" in boxes and boxes.index("moov") < boxes.index("mdat"),
    }
    # Decode every frame independently of ffprobe and catch near-solid or black
    # frames. Motion outliers are evidence for review, not semantic assertions.
    width, height = 160, 90
    raw = ff("-threads", "2", "-i", path, "-map", "0:v:0", "-vf", f"scale={width}:{height},format=gray",
             "-threads", "1", "-f", "rawvideo", "-")
    size = width * height
    frames = [raw[i:i + size] for i in range(0, len(raw), size)]
    blank = [i for i, frame in enumerate(frames)
             if max(frame)-min(frame) < 24 or sum(frame) / size < 18]
    changes = [sum(abs(a-b) for a, b in zip(old, new)) / size
               for old, new in zip(frames, frames[1:])]
    checks["full_decode"] = len(raw) == expected * size
    checks["no_near_solid_or_dark_frames"] = not blank
    evidence = {"checks": checks, "sha256": digest(path), "bytes": path.stat().st_size,
                "ffprobe": {key: stream[key] for key in
                            ["codec_type", "codec_name", "profile", "width", "height", "pix_fmt",
                             "sample_aspect_ratio", "avg_frame_rate", "r_frame_rate", "nb_read_frames",
                             "duration", "color_range"] if key in stream},
                "mp4_boxes": boxes, "blank_frame_indices": blank,
                "largest_luma_changes": [{"frame": i+1, "time": (i+1)/fps, "mean_delta": round(delta, 3)}
                                         for i, delta in sorted(enumerate(changes), key=lambda pair: -pair[1])[:12]]}
    if not all(checks.values()):
        raise ValueError(f"Render failed QA: {evidence}")
    return evidence


def at(path, seconds, width):
    png = ff("-ss", f"{seconds:.6f}", "-threads", "2", "-i", path, "-vf", f"scale={width}:-2",
             "-frames:v", "1", "-threads", "1", "-f", "image2pipe", "-vcodec", "png", "-")
    return Image.open(io.BytesIO(png)).convert("RGB")


def sheet(images, output, *, cols=3, width=384, height=216):
    if not images:
        raise ValueError("Contact sheet has no frames")
    cell_h = height + 26
    canvas = Image.new("RGB", (width * cols, cell_h * math.ceil(len(images) / cols)), "#11191d")
    draw = ImageDraw.Draw(canvas)
    face = font("DejaVu Sans", 14)
    for i, (frame, caption) in enumerate(images):
        x, y = (i % cols) * width, (i // cols) * cell_h
        tile = ImageOps.contain(frame, (width - 6, height - 4), Image.Resampling.LANCZOS)
        canvas.paste(tile, (x+(width-tile.width)//2, y+(height-tile.height)//2))
        draw.text((x+8, y+height+3), caption, fill="#ffffff", font=face)
    canvas.save(output, quality=86)


def analyze(sources, entries, output):
    for name, meta in entries.items():
        frame_samples = []
        for tick in range(math.ceil(meta["duration"] * 2)):
            t = tick / 2
            if t <= meta["duration"] - .04:
                frame_samples.append((at(sources / name, t, min(960, meta["width"])), f"{t:.2f}s"))
        sheet(frame_samples, output / f"{Path(name).stem}-source.jpg", cols=4, width=320, height=180)


def timestamp(frame, fps):
    ms = round(frame * 1000 / fps)
    return f"{ms // 3600000:02}:{ms // 60000 % 60:02}:{ms // 1000 % 60:02}.{ms % 1000:03}"


def write_captions(config, plan, output):
    for lang, by_role in config.get("captions", {}).items():
        if not re.fullmatch(r"[a-z]{2,3}(-[A-Za-z0-9]+)*", lang):
            raise ValueError(f"Invalid WebVTT language: {lang}")
        blocks = ["WEBVTT"]
        for shot in plan["shots"]:
            if shot["role"] in by_role:
                cue = by_role[shot["role"]]
                if "\n" in cue or "-->" in cue:
                    raise ValueError("Expected plain single-line caption")
                start = timestamp(shot["start_frame"], plan["fps"])
                end = timestamp(shot["end_frame"], plan["fps"])
                blocks.append(f"{start} --> {end}\n{cue}")
        (output / f"showcase.{lang}.vtt").write_text("\n\n".join(blocks) + "\n")


def review_outputs(path, config, plan, working):
    fps = plan["fps"]
    shots = plan["shots"]
    poster = next(s for s in shots if s["role"] == config["poster_role"])
    poster_time = (poster["start_frame"] + poster["end_frame"]) // 2 / fps
    at(path, poster_time, config["resolution"][0]).save(working / "poster.webp", quality=86, method=6)
    overview = sorted({*range(0, plan["frames"], fps), plan["frames"] - 1})
    sheet([(at(path, i/fps, 768), f"{i/fps:.2f}s") for i in overview],
          working / "contact-sheet.jpg", cols=4, width=320, height=180)
    bursts = []
    for frame in [s["start_frame"] for s in shots if s["start_frame"]]:
        for i in range(max(0, frame-2), min(plan["frames"], frame+6)):
            bursts.append((at(path, i/fps, 480), f"{i/fps:.2f}s  cut {frame/fps:.2f}s"))
    for i in (plan["frames"]-2, plan["frames"]-1, 0, 1):
        bursts.append((at(path, i/fps, 480), f"{i/fps:.2f}s  loop"))
    sheet(bursts, working / "seams.jpg", cols=5, width=256, height=144)
    return poster_time


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=["analyze", "build"])
    parser.add_argument("--config", type=Path, required=True)
    parser.add_argument("--sources", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--duration", type=float)
    parser.add_argument("--resolution", metavar=("WIDTH", "HEIGHT"), nargs=2, type=int)
    args = parser.parse_args()
    config = load(args.config)
    if args.duration is not None:
        config["duration"] = args.duration
    if args.resolution is not None:
        config["resolution"] = args.resolution
    width, height = config["resolution"]
    if min(width, height) < 360 or max(width, height) > 3840 or width % 2 or height % 2 or width * 9 != height * 16:
        raise ValueError("Expected even 16:9 dimensions in the supported range")
    if not isinstance(config["fps"], int) or not 12 <= config["fps"] <= 60 or not 1 <= config["duration"] <= 120:
        raise ValueError("Expected 12–60 whole fps and a 1–120 second duration")
    args.output.mkdir(parents=True, exist_ok=True)
    entries = inventory(args.sources, config["source_manifest"])
    if args.command == "analyze":
        analyze(args.sources, entries, args.output)
        save(args.output / "source-verification.json", entries)
        return
    plan = make_plan(config, entries)
    with tempfile.TemporaryDirectory(dir=args.output, prefix=".studio-") as directory:
        work = Path(directory)
        output = safe_file(work, config["output"])
        render(config, plan, args.sources, args.config.parent, output, work)
        evidence = verify(output, config, plan)
        evidence["poster_seconds"] = review_outputs(output, config, plan, work)
        evidence["poster_sha256"] = digest(work / "poster.webp")
        evidence["poster_bytes"] = (work / "poster.webp").stat().st_size
        evidence["ffmpeg"] = run("ffmpeg", "-version").decode().splitlines()[0]
        save(work / "qa.json", evidence)
        save(work / "timeline.json", plan)
        write_captions(config, plan, work)
        for artifact in work.iterdir():
            if artifact.name == output.name or artifact.name in {
                    "qa.json", "timeline.json", "poster.webp", "contact-sheet.jpg", "seams.jpg"} or artifact.suffix == ".vtt":
                artifact.replace(args.output / artifact.name)
    print(json.dumps(evidence["checks"]))


if __name__ == "__main__":
    main()
