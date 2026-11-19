import React from 'react';
import {AbsoluteFill, Composition, Easing, Freeze, interpolate, OffthreadVideo,
  Sequence, staticFile, useCurrentFrame} from 'remotion';
import spec from '../experiment.json';

type Shot = (typeof spec.shots)[number];
const easing = Easing.bezier(.24,.72,.22,1);
const ease = (frame: number, start: number, end: number) => interpolate(frame,[start,end],[0,1],
  {easing, extrapolateLeft:'clamp',extrapolateRight:'clamp'});
const pane = {x:78,y:50,w:1124,h:632};
const accent = '#0a6b5e';

function ProductWindow({shot, order, reveal}: {shot: Shot, order: number, reveal?: number}) {
  const f = useCurrentFrame();
  const [cx,cy,cw,ch] = shot.crop;
  const turn = ease(f, order === 0 ? 0 : 4, order === 0 ? 23 : 29);
  const scale = pane.w/cw * (1 + (shot.zoom-1)*turn);
  const focusX = (cx+cw/2) + (shot.focus[0]-(cx+cw/2))*turn*.74;
  const focusY = (cy+ch/2) + (shot.focus[1]-(cy+ch/2))*turn*.74;
  const left = Math.min(0, Math.max(pane.w-1920*scale,pane.w*.5-focusX*scale));
  const top = Math.min(0, Math.max(pane.h-1080*scale,pane.h*.5-focusY*scale));
  return <div style={{position:'absolute',left:pane.x,top:pane.y,width:pane.w,height:pane.h,
    borderRadius:20,overflow:'hidden',background:'#cbd9d5',isolation:'isolate',
    boxShadow:'0 30px 64px #0009, 0 0 0 1px #b7d7d033',
    clipPath: reveal === undefined ? undefined : `inset(0 0 0 ${(1-reveal)*100}% round 20px)`}}>
    <OffthreadVideo src={staticFile(`experiment/${shot.id}.mp4`)} muted style={{
      position:'absolute',width:1920,height:1080,left,top,transformOrigin:'top left',
      transform:`scale(${scale})`,objectFit:'contain',
    }}/>
  </div>;
}

function Reveal({shot, order}: {shot: Shot, order: number}) {
  const progress=ease(useCurrentFrame(),0,6);
  return <Freeze frame={0}><ProductWindow shot={shot} order={order} reveal={progress}/></Freeze>;
}

export function Experiment() {
  let cursor = 0;
  return <AbsoluteFill style={{background:'radial-gradient(ellipse at 75% 20%,#21423f 0%,#121e22 45%,#0e1519 80%)'}}>
    {spec.shots.map((shot,order)=>{
      const at=cursor;
      cursor+=shot.frames;
      return <React.Fragment key={shot.id}>
        {order>0 && <Sequence from={at-7} durationInFrames={7} layout="none">
          <Reveal shot={shot} order={order}/>
        </Sequence>}
        <Sequence from={at} durationInFrames={shot.frames} layout="none">
          <ProductWindow shot={shot} order={order}/>
        </Sequence>
      </React.Fragment>;
    })}
    <div style={{position:'absolute',right:77,top:19,color:'#d3e6df',display:'flex',gap:7,
      alignItems:'center',font:'600 15px Arial',letterSpacing:1}}>
      <svg viewBox="0 0 32 32" width="18" height="18" aria-hidden="true">
        <rect x="2" y="5" width="28" height="25" rx="7" fill={accent}/>
        <rect x="9" y="2" width="3" height="7" rx="1.5" fill={accent}/>
        <rect x="20" y="2" width="3" height="7" rx="1.5" fill={accent}/>
        <path d="M10.5 18.5 14.5 22.5 22 14.5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
      Tori
    </div>
  </AbsoluteFill>;
}

export const ExperimentComposition = () => <Composition id="ToriExperiment" component={Experiment}
  width={spec.width} height={spec.height} fps={spec.fps}
  durationInFrames={spec.shots.reduce((sum,s)=>sum+s.frames,0)}/>;
