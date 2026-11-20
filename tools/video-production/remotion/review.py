"""Validate a silent output and sample editorial boundaries for visual review."""
import argparse
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from studio import at, digest, load, save, sheet, verify


def main():
    p=argparse.ArgumentParser()
    p.add_argument('video',type=Path)
    p.add_argument('recipe',type=Path)
    p.add_argument('output',type=Path)
    args=p.parse_args()
    recipe=load(args.recipe)
    fps=recipe['fps']
    frames=sum(shot['frames'] for shot in recipe['shots'])+int(recipe.get('outroFrames',0))
    args.output.mkdir(parents=True,exist_ok=True)
    name=args.video.stem
    report=verify(args.video,{'resolution':[recipe['width'],recipe['height']]},{'fps':fps,'frames':frames})
    midpoints=[(shot['timeline_in']+shot['timeline_out'])/2 for shot in recipe['shots']]
    samples=sorted({0,(frames-1)/fps,*midpoints,*range(1,int(frames/fps))})
    sheet([(at(args.video,t,800),f'{t:.2f}s') for t in samples],args.output/(name+'-overview.jpg'),
          cols=4,width=320,height=180)
    seams=[round(shot['timeline_in']*fps) for shot in recipe['shots'][1:]]
    if int(recipe.get('outroFrames',0))>0:
        seams.append(sum(shot['frames'] for shot in recipe['shots']))
    burst=[]
    for cut in seams:
        for offset in (-7,-5,-3,-1,0,2):
            i=cut+offset
            burst.append((at(args.video,i/fps,640),f'{i/fps:.2f}s / cut {cut/fps:.2f}s'))
    sheet(burst,args.output/(name+'-seams.jpg'),cols=6,width=200,height=113)
    hero=next(shot for shot in recipe['shots'] if shot['role']=='pick')
    poster_time=hero['timeline_in']+(hero['timeline_out']-hero['timeline_in'])*.80
    poster=args.output/(name+'-poster.webp')
    at(args.video,poster_time,recipe['width']).save(poster,quality=87,method=6)
    report.update(poster_seconds=poster_time,poster_sha256=digest(poster))
    save(args.output/(name+'-qa.json'),report)


if __name__=='__main__':
    main()
