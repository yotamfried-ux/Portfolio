import React from 'react';
import {
  AbsoluteFill, Composition, Easing, Freeze, interpolate, OffthreadVideo,
  Sequence, staticFile, useCurrentFrame, useVideoConfig
} from 'remotion';
import type { CalculateMetadataFunction } from 'remotion';

type Point = [number, number];
type Crop = [number, number, number, number];
type Shot = {id:string; role:string; label:string; frames:number; width:number; height:number;
  crop:Crop; focus:Point; zoom:number; phone?:boolean};
export type Recipe = {
  width:number; height:number; fps:number; theme:'action'|'cinema';
  brand:{name:string; accent:string; backdrop:string; mark?:string};
  shots:Shot[];
};
type Props = {recipe: Recipe};
const smooth = (f:number,start:number,end:number) => interpolate(f,[start,end],[0,1],{
  easing:Easing.bezier(.2,.64,.25,1),extrapolateLeft:'clamp',extrapolateRight:'clamp'
});
const mix = (a:number,b:number,t:number)=>a+(b-a)*t;

function Footage({shot, accent, cinema, clip}: {shot:Shot; accent:string; cinema:boolean; clip?:number}) {
  const f=useCurrentFrame();
  const view=useVideoConfig();
  const u=view.height/720;
  const [cx,cy,cw,ch]=shot.crop;
  const move=smooth(f, cinema ? 1 : 0, Math.max(10, Math.round(shot.frames * (cinema ? .72 : .43))));
  const maxW=(shot.phone?583:cinema?1132:1224)*u;
  const maxH=(shot.phone?610:cinema?628:636)*u;
  const fit=Math.min(maxW/cw,maxH/ch);
  const w=cw*fit,h=ch*fit;
  const centerX=view.width*(shot.phone?(cinema?.67:.59):.5);
  const centerY=view.height*.467;
  const camera = fit*mix(1,shot.zoom,move);
  const targetX=mix(cx+cw/2,shot.focus[0],move);
  const targetY=mix(cy+ch/2,shot.focus[1],move);
  const x=Math.min(0,Math.max(w-shot.width*camera,w/2-targetX*camera));
  const y=Math.min(0,Math.max(h-shot.height*camera,h/2-targetY*camera));
  return <div style={{
    position:'absolute',width:w,height:h,left:centerX-w/2,top:centerY-h/2,overflow:'hidden',
    borderRadius:(shot.phone?29:16)*u,background:'#e7eeea',
    clipPath:clip === undefined ? undefined : `inset(0 0 0 ${(1-clip)*100}% round ${16*u}px)`,
    boxShadow:`0 ${22*u}px ${62*u}px #0008,0 0 0 ${(shot.phone?6:1.5)*u}px ${shot.phone?'#1f302f':accent+'62'}`
  }}>
    <OffthreadVideo src={staticFile(`takes/${shot.id}.mp4`)} muted style={{
      position:'absolute',left:x,top:y,width:shot.width,height:shot.height,
      transformOrigin:'top left',transform:`scale(${camera})`,objectFit:'contain'
    }}/>
  </div>;
}

function Wipe({shot,accent}: {shot:Shot;accent:string}) {
  const reveal=smooth(useCurrentFrame(),0,6);
  return <Freeze frame={0}><Footage shot={shot} accent={accent} cinema clip={reveal}/></Freeze>;
}

function Identity({brand, role, frames, index}: {
  brand:Recipe['brand']; role:string; frames:number; index:number
}) {
  const f=useCurrentFrame();
  const u=useVideoConfig().height/720;
  const headlines:Record<string,string>={
    pick:'CHOOSE A TIME',
    confirm:'BOOKING CONFIRMED',
    calendar:'THE BUSINESS CALENDAR',
    settings:'SET YOUR HOURS',
    slots:'AVAILABILITY UPDATED',
    service:'CHOOSE A SERVICE',
    mobile:'BOOK ON MOBILE'
  };
  const enter=interpolate(f,[0,5],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const exit=interpolate(f,[Math.max(5,frames-5),frames],[1,0],{
    extrapolateLeft:'clamp',extrapolateRight:'clamp'
  });
  const visibility=Math.min(enter,exit);
  const reveal=interpolate(f,[0,7],[16,0],{
    extrapolateLeft:'clamp',extrapolateRight:'clamp',
    easing:Easing.bezier(.25,.7,.25,1)
  });
  return <div style={{
    position:'absolute',bottom:9*u,left:34*u,right:34*u,height:45*u,
    color:'#effbf6',fontFamily:'Arial, sans-serif',
    display:'flex',alignItems:'center',gap:12*u,
    opacity:visibility,transform:`translateY(${reveal*u}px)`,
    pointerEvents:'none'
  }}>
    {brand.mark && <img src={staticFile(brand.mark)} alt="" style={{
      width:25*u,height:25*u
    }}/>}
    <span style={{fontSize:17*u,fontWeight:800,letterSpacing:.4*u}}>{brand.name}</span>
    <span style={{width:1*u,height:19*u,background:'#63877e'}}/>
    <span style={{fontSize:21*u,fontWeight:700,letterSpacing:.3*u}}>
      {headlines[role] ?? role.toUpperCase()}
    </span>
    <span style={{marginLeft:'auto',fontSize:14*u,color:'#9abfb3',fontVariantNumeric:'tabular-nums'}}>
      {String(index+1).padStart(2,'0')}
    </span>
    <div style={{
      position:'absolute',bottom:0,left:0,
      width:`${Math.min(100,(f+1)/Math.max(1,frames)*100)}%`,
      height:2*u,background:brand.accent
    }}/>
  </div>;
}

export function ProductShowcase({recipe}: Props) {
  let cursor=0;
  const cinema=recipe.theme==='cinema';
  const {brand}=recipe;
  return <AbsoluteFill style={{background: cinema ?
    `radial-gradient(ellipse at 71% 27%,${brand.accent}58,transparent 59%),${brand.backdrop}` :
    `linear-gradient(143deg,${brand.backdrop} 27%,${brand.accent}95)`}}>
    {recipe.shots.map((shot,index)=>{
      const start=cursor;
      cursor+=shot.frames;
      const previous=recipe.shots[index-1];
      return <React.Fragment key={shot.role}>
        {cinema && previous && !previous.phone && !shot.phone &&
          <Sequence from={start-7} durationInFrames={7} layout="none"><Wipe shot={shot} accent={brand.accent}/></Sequence>}
        <Sequence from={start} durationInFrames={shot.frames} layout="none">
          <Footage shot={shot} accent={brand.accent} cinema={cinema}/>
          <Identity brand={brand} role={shot.role} frames={shot.frames} index={index}/>
        </Sequence>
      </React.Fragment>;
    })}
  </AbsoluteFill>;
}

const metadata: CalculateMetadataFunction<Props> = ({props}) => ({
  width:props.recipe.width,height:props.recipe.height,fps:props.recipe.fps,
  durationInFrames:Math.max(1,props.recipe.shots.reduce((n,s)=>n+s.frames,0))
});
const starter: Recipe={width:1280,height:720,fps:25,theme:'action',
  brand:{name:'Portfolio',accent:'#0a6b5e',backdrop:'#11191d'},shots:[]};

export function ShowcaseComposition() {
  return <Composition id="ProductShowcase" component={ProductShowcase} defaultProps={{recipe:starter}}
    width={1280} height={720} fps={25} durationInFrames={1} calculateMetadata={metadata}/>;
}
