"""Accept visually reviewed local clips, select ranked story roles, stage variants."""

import argparse
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT.parent))
from studio import at, digest, encode_to, ff, inventory, load, probe, save, sheet, timestamp


def ingest(takes, spec, destination, evidence):
    destination.mkdir(parents=True, exist_ok=True)
    evidence.mkdir(parents=True, exist_ok=True)
    observations = []
    sources = {}
    for clip in spec['observations']:
        name = clip['scene']
        source = takes / 'mp4' / f'{name}.mp4'
        events = load(takes / 'events' / f'{name}.json')
        event = next(item for item in events['events'] if item['label'] == clip['event'])
        meta = probe(source)
        stream = meta['streams'][0]
        w, h = stream['width'], stream['height']
        if events['viewport'] != {'width': w, 'height': h} or stream['avg_frame_rate'] != '25/1':
            raise ValueError(f'Unexpected recorder geometry or cadence: {name}')
        if not 0 <= clip['in'] < clip['out'] <= float(meta['format']['duration']):
            raise ValueError(f'Out-of-range approved moment: {clip["id"]}')
        product = destination / (clip['id']+'.mp4')
        encode_to(product, '-ss', str(clip['in']), '-i', source, '-t', str(clip['out']-clip['in']),
                  '-vf', 'setsar=1', '-map', '0:v:0')
        ff('-i', product, '-f', 'null', '-')
        digest_value = digest(product)
        duration = float(probe(product)['format']['duration'])
        observations.append({**clip, 'event_second': event['second'], 'box': event.get('box'),
                             'file': product.name, 'source_sha256': digest(source)})
        sources[product.name] = {'file':product.name, 'sha256':digest_value,
                                 'bytes':product.stat().st_size,'width':w,'height':h,'duration_seconds':duration}
        frames = [
            (at(product,t,min(1000,w)),f'{clip["id"]} {t:.2f}s')
            for t in (0, round(duration*.4, 3), round(duration-.08, 3))
        ]
        sheet(frames,evidence/(clip['id']+'.jpg'),cols=3,width=320,height=200)
    save(destination/'manifest.json',{'capture_revision':spec['capture_revision'],'files':list(sources.values())})
    save(evidence/'observations.json',observations)


def directed(selections, sources, project, variant, output):
    spec = project['variants'][variant]
    fps = project['fps']
    target = round(spec['seconds'] * fps)
    property_key = 'action_score' if variant == 'action' else 'cinema_score'
    candidates = {}
    for clip in selections:
        if clip.get(property_key,0) > 0:
            candidates.setdefault(clip['role'],[]).append(clip)
    used_labels = set()
    total_weight = sum(role['weight'] for role in spec['roles'])
    portion = 0
    previous = 0
    shots = []
    for role in spec['roles']:
        ranked = candidates.get(role['id'],[])
        if not ranked:
            raise ValueError(f'No approved shot for {role["id"]}')
        candidate = max(ranked,key=lambda item:(item[property_key],item['id']))
        source = sources[candidate['file']]
        width,height = source['width'],source['height']
        x,y,w,h = candidate['crop']
        fx,fy = candidate['focus']
        if (x < 0 or y < 0 or w <= 0 or h <= 0 or x+w > width or y+h > height
                or not 0 <= fx <= width or not 0 <= fy <= height):
            raise ValueError(f'Invalid camera geometry: {candidate["id"]}')
        portion += role['weight']
        end = round(target * portion / total_weight)
        if candidate['id'] in used_labels or end - previous < 10:
            raise ValueError('Overlapping or sub-400 ms editorial segment')
        used_labels.add(candidate['id'])
        shots.append({**candidate,'frames':end-previous,'width':width,'height':height,
                      'timeline_in':previous/fps, 'timeline_out':end/fps,
                      'alternatives':[c['id'] for c in ranked if c['id'] != candidate['id']]})
        previous = end
    recipe = {'brand':project['brand'],'fps':fps,'width':project['width'],
              'height':project['height'],'theme':variant,'shots':shots}
    save(output/('recipe-'+variant+'.json'),recipe)
    tracks = ['WEBVTT']
    start = 0
    for shot in shots:
        end = start+shot['frames']
        tracks.append(f'{timestamp(start,fps)} --> {timestamp(end,fps)}\n{shot["caption"]}')
        start = end
    (output/('captions-'+variant+'.vtt')).write_text('\n\n'.join(tracks)+'\n')
    return recipe


def realtime_hold_frames(source_seconds, target_frames, fps, max_hold_seconds=0.24):
    """Reject fake slow motion; only a short final-frame editorial hold is allowed."""
    if fps <= 0 or source_seconds <= 0 or target_frames <= 0:
        raise ValueError("Positive source duration, frame budget and fps required")
    original_frames = round(source_seconds * fps)
    hold = max(0, target_frames - original_frames)
    if hold > round(max_hold_seconds * fps):
        raise ValueError(
            f"Shot would extend {source_seconds:.2f}s of true-time action "
            f"to {target_frames/fps:.2f}s. Recapture or reduce duration."
        )
    return hold


def stage(recipe, folder):
    stage_dir = ROOT/'public'/'takes'
    stage_dir.mkdir(parents=True,exist_ok=True)
    for shot in recipe['shots']:
        length = float(probe(folder/shot['file'])['format']['duration'])
        # Preserve the genuine speed of browser interactions. The former
        # setpts=target/source multiplier slowed 0.64s of UI action to 2–4s.
        fps = recipe['fps']
        target_frames = shot['frames']
        linger_frames = realtime_hold_frames(length, target_frames, fps)
        max_linger_frames = round(0.24 * fps)
        norm = (
            f"fps={fps},setsar=1,"
            f"tpad=stop_mode=clone:stop_duration={max_linger_frames/fps:.3f}"
        )
        encode_to(stage_dir/(shot['id']+'.mp4'), '-i', folder/shot['file'], '-vf', norm,
                  '-frames:v', str(target_frames))
    if recipe['brand'].get('mark') == 'tori-mark.svg':
        (ROOT/'public'/'tori-mark.svg').write_bytes((ROOT.parent/'tori-mark.svg').read_bytes())


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('command',choices=['ingest','stage'])
    parser.add_argument('--config',required=True,type=Path)
    parser.add_argument('--sources',required=True,type=Path)
    parser.add_argument('--output',required=True,type=Path)
    parser.add_argument('--takes',type=Path)
    parser.add_argument('--variant',choices=['action','cinema'])
    args=parser.parse_args()
    project=load(args.config)
    if args.command == 'ingest':
        if not args.takes:
            parser.error('ingest requires --takes')
        ingest(args.takes,project,args.sources,args.output)
        return
    if not args.variant:
        parser.error('stage requires --variant')
    sources=inventory(args.sources,'manifest.json')
    for item in sources:
        if item not in {f['id']+'.mp4' for f in project['observations']}:
            raise ValueError('Unknown accepted source asset')
    args.output.mkdir(parents=True,exist_ok=True)
    choices=[{**entry,'file':entry['id']+'.mp4'} for entry in project['observations']]
    stage(directed(choices,sources,project,args.variant,args.output),args.sources)


if __name__=='__main__':
    main()
