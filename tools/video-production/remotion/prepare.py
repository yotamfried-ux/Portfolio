"""Verify source masters and stage the same retimed extracts for both engines."""
import argparse
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from studio import encode_to, inventory, load, make_plan, render, verify


def main():
    here = Path(__file__).resolve().parent
    parser = argparse.ArgumentParser()
    parser.add_argument('--sources', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    spec = load(here / 'experiment.json')
    inventory_data = inventory(args.sources, 'manifest.json')
    cfg = {
        'project': spec['project'], 'fps': spec['fps'],
        'resolution': [spec['width'], spec['height']],
        'duration': sum(s['frames'] for s in spec['shots']) / spec['fps'],
        'matte': '#11191d', 'accent': '#0a6b5e', 'font': 'DejaVu Sans',
        'roles': [], 'candidates': [],
    }
    previous = []
    media = here / 'public' / 'experiment'
    media.mkdir(parents=True, exist_ok=True)
    args.output.mkdir(parents=True, exist_ok=True)
    for shot in spec['shots']:
        shot_id = shot['id']
        cfg['roles'].append({'id': shot_id, 'after': previous, 'seconds': shot['frames']})
        cfg['candidates'].append({**shot, 'role': shot_id, 'score': 1})
        previous = [shot_id]
    plan = make_plan(cfg, inventory_data)
    from tempfile import TemporaryDirectory
    with TemporaryDirectory(dir=args.output) as directory:
        render(cfg, plan, args.sources, here, args.output / 'baseline.mp4', Path(directory))
    verify(args.output / 'baseline.mp4', cfg, plan)
    for shot in spec['shots']:
        fps = spec['fps']
        length = shot['out']-shot['in']
        stretch = shot['frames'] / fps / length
        normalize = (f'setpts={stretch:.12f}*(PTS-STARTPTS),fps={fps},'
                     'setsar=1,tpad=stop_mode=clone:stop_duration=1')
        encode_to(media / f"{shot['id']}.mp4", '-ss', str(shot['in']), '-t', str(length),
                  '-threads', '2', '-i', args.sources / shot['source'], '-vf', normalize,
                  '-frames:v', str(shot['frames']))


if __name__ == '__main__':
    main()
