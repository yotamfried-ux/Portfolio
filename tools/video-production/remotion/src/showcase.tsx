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
  shots:Shot[]; outroFrames?:number;
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
  const maxW=(shot.phone?600:cinema?1160:1240)*u;
  const maxH=(shot.phone?596:cinema?590:590)*u;
  const fit=Math.min(maxW/cw,maxH/ch);
  const w=cw*fit,h=ch*fit;
  const centerX=view.width*(shot.phone?.265:.5);
  const centerY=view.height*.452;
  const camera = fit*mix(1,shot.zoom,move);
  const entrance=smooth(f,0,5);
  const direction=shot.role==='calendar'||shot.role==='settings'?1:-1;
  const targetX=mix(cx+cw/2,shot.focus[0],move);
  const targetY=mix(cy+ch/2,shot.focus[1],move);
  const x=Math.min(0,Math.max(w-shot.width*camera,w/2-targetX*camera));
  const y=Math.min(0,Math.max(h-shot.height*camera,h/2-targetY*camera));
  return <div style={{
    position:'absolute',width:w,height:h,
    left:centerX-w/2+(1-entrance)*70*direction*u,
    top:centerY-h/2+(1-entrance)*21*u,
    transform:`perspective(${1300*u}px) rotateY(${direction*(1-entrance)*-5}deg) scale(${.965+.035*entrance})`,
    overflow:'hidden',
    borderRadius:(shot.phone?29:16)*u,background:'#e7eeea',
    clipPath:clip === undefined ? undefined : `inset(0 0 0 ${(1-clip)*100}% round ${16*u}px)`,
    boxShadow:`0 ${24*u}px ${78*u}px #000b,0 0 0 ${(shot.phone?6:2)*u}px ${shot.phone?'#1f302f':accent+'8f'}`
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
    position:'absolute',bottom:13*u,left:34*u,right:34*u,height:71*u,
    color:'#effbf6',fontFamily:'Arial, sans-serif',
    display:'flex',alignItems:'center',gap:12*u,
    opacity:visibility,transform:`translateY(${reveal*u}px)`,
    pointerEvents:'none'
  }}>
    {brand.mark && <img src={staticFile(brand.mark)} alt="" style={{
      width:29*u,height:29*u
    }}/>}
    <span style={{fontSize:24*u,fontWeight:800,letterSpacing:.4*u}}>{brand.name}</span>
    <span style={{width:1*u,height:19*u,background:'#63877e'}}/>
    <span style={{fontSize:47*u,fontWeight:800,letterSpacing:.3*u}}>
      {headlines[role] ?? role.toUpperCase()}
    </span>
    <span style={{marginLeft:'auto',fontSize:18*u,color:'#9abfb3',fontVariantNumeric:'tabular-nums'}}>
      {String(index+1).padStart(2,'0')}
    </span>
    <div style={{
      position:'absolute',bottom:0,left:0,
      width:`${Math.min(100,(f+1)/Math.max(1,frames)*100)}%`,
      height:2*u,background:brand.accent
    }}/>
  </div>;
}


function MobileDetail({shot,accent}: {shot:Shot;accent:string}) {
  const frame=useCurrentFrame(),u=useVideoConfig().height/720;
  const t=smooth(frame,2,11);
  return <div style={{
    position:'absolute',left:552*u,top:105*u,width:630*u,height:525*u,
    transform:`translateX(${(1-t)*80*u}px) scale(${.96+.04*t})`,
    opacity:t,overflow:'hidden',borderRadius:22*u,
    border:`${2*u}px solid ${accent}bb`,
    boxShadow:`0 ${25*u}px ${90*u}px #0009,0 0 ${55*u}px ${accent}36`
  }}>
    <OffthreadVideo muted src={staticFile(`takes/${shot.id}.mp4`)}
      style={{
        position:'absolute',left:24*u,top:-359*u,
        width:390*1.5*u,height:844*1.5*u,objectFit:'contain'
      }}/>
    <div style={{
      position:'absolute',right:14*u,bottom:12*u,
      borderRadius:8*u,background:'#10221fe8',color:'#d9f4e9',
      fontFamily:'Arial, sans-serif',fontSize:15*u,fontWeight:700,
      padding:`${6*u}px ${12*u}px`
    }}>LIVE MOBILE VIEW</div>
  </div>;
}

function Closing({brand,frames,finalShot}: {
  brand:Recipe['brand'];frames:number;finalShot:Shot
}) {
  const f=useCurrentFrame(),v=useVideoConfig(),u=v.height/720;
  const t=smooth(f,0,15);
  const out=smooth(f,Math.max(18,frames-7),frames);
  return <AbsoluteFill style={{
    background:`radial-gradient(ellipse at 76% 46%,${brand.accent}55,transparent 52%),#071615`,
    overflow:'hidden',color:'#effff8'
  }}>
    <div style={{
      position:'absolute',left:125*u,top:132*u,
      transform:`translateY(${(1-t)*54*u}px)`,
      opacity:t
    }}>
      <div style={{
        fontFamily:'Arial,sans-serif',fontWeight:900,letterSpacing:-7*u,
        fontSize:144*u,lineHeight:1
      }}>{brand.name}</div>
      <div style={{
        fontFamily:'Arial,sans-serif',fontWeight:700,
        fontSize:23*u,marginTop:20*u,letterSpacing:1.5*u,
        color:'#9fe7d1'
      }}>APPOINTMENTS. IN SYNC.</div>
      <div style={{height:3*u,width:135*u,background:'#53e3b4',marginTop:32*u}}/>
    </div>
    <div style={{
      position:'absolute',left:830*u,top:67*u,
      width:300*u,height:577*u,overflow:'hidden',
      borderRadius:28*u,boxShadow:'0 28px 75px #000b',
      border:`${6*u}px solid #264843`,
      transform:`translateY(${(1-t)*85*u}px) rotate(${-5+5*t}deg)`,
      opacity:t
    }}>
      <Freeze frame={Math.max(0,finalShot.frames-3)}>
        <OffthreadVideo muted src={staticFile(`takes/${finalShot.id}.mp4`)}
          style={{width:'100%',height:'100%',objectFit:'cover'}}/>
      </Freeze>
    </div>
    <div style={{
      position:'absolute',left:0,bottom:0,width:'100%',height:4*u,
      background:brand.accent,transformOrigin:'left',
      transform:`scaleX(${Math.min(1,f/Math.max(1,frames-1))})`
    }}/>
    <div style={{
      position:'absolute',right:35*u,bottom:24*u,
      fontFamily:'Arial,sans-serif',fontSize:11*u,
      letterSpacing:1*u,color:'#709d92',opacity:1-out
    }}>AUTHENTIC PRODUCT DEMONSTRATION</div>
  </AbsoluteFill>;
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
          {shot.phone && <MobileDetail shot={shot} accent={brand.accent}/>}
          <Identity brand={brand} role={shot.role} frames={shot.frames} index={index}/>
        </Sequence>
      </React.Fragment>;
    })}
    {recipe.outroFrames && recipe.outroFrames>0 && recipe.shots.length>0 &&
      <Sequence from={cursor} durationInFrames={recipe.outroFrames}>
        <Closing brand={brand} frames={recipe.outroFrames} finalShot={recipe.shots[recipe.shots.length-1]}/>
      </Sequence>}
  </AbsoluteFill>;
}

const metadata: CalculateMetadataFunction<Props> = ({props}) => ({
  width:props.recipe.width,height:props.recipe.height,fps:props.recipe.fps,
  durationInFrames:Math.max(1,props.recipe.shots.reduce((n,s)=>n+s.frames,props.recipe.outroFrames??0))
});
const starter: Recipe={width:1280,height:720,fps:25,theme:'action',
  brand:{name:'Portfolio',accent:'#0a6b5e',backdrop:'#11191d'},shots:[]};

export function ShowcaseComposition() {
  return <Composition id="ProductShowcase" component={ProductShowcase} defaultProps={{recipe:starter}}
    width={1280} height={720} fps={25} durationInFrames={1} calculateMetadata={metadata}/>;
}
