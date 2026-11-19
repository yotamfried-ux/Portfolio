import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const [mp4, webp, output, ...sought] = process.argv.slice(2);
if (!mp4 || !webp || !output) throw new Error('Usage: node embed-smoke.mjs VIDEO POSTER OUTPUT_DIR');
const [video, poster] = await Promise.all([readFile(mp4),readFile(webp)]);
await mkdir(output, {recursive:true});
const html=`<!doctype html><html lang=en><meta charset=utf-8><title>Tori card media review</title>
<style>
body{background:#10191c;color:#e7f3ee;font:16px system-ui;margin:20px}
figure{margin:0;width:min(100%,586px);background:#152327;border-radius:14px;overflow:hidden}
video{display:block;width:100%;height:auto;aspect-ratio:var(--card-ratio,2.15);object-fit:cover;background:#10191c}
figcaption{padding:14px 16px} button{margin-left:12px} p{font-size:14px}
@media(max-width:700px){video{--card-ratio:1.9}}
</style><figure id="card"><video width=1280 height=720 muted playsinline preload=none poster=/poster.webp aria-label="Tori demo"></video>
<figcaption><strong>Tori</strong><button type=button>Play product showcase</button></figcaption></figure>
<script>
const video=document.querySelector('video');
const button=document.querySelector('button');
button.addEventListener('click',async()=>{
  if(video.paused){
    if(!video.src) video.src='/clip.mp4';
    await video.play();
    button.textContent='Pause showcase';
  } else{
    video.pause();
    button.textContent='Play product showcase';
  }
});
</script>`;
const server=createServer((req,res)=>{
  if(req.url==='/clip.mp4'){
    const startEnd = /^bytes=(\d+)-(\d*)$/.exec(req.headers.range || '');
    const headers = {'Content-Type':'video/mp4','Accept-Ranges':'bytes'};
    if (!startEnd) {
      res.writeHead(200,{...headers,'Content-Length':video.length});res.end(video);return;
    }
    const start=Number(startEnd[1]), end=Math.min(video.length-1,Number(startEnd[2]||video.length-1));
    if (start>end) {res.writeHead(416,{'Content-Range':`bytes */${video.length}`});res.end();return;}
    res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${video.length}`,'Content-Length':end-start+1});
    res.end(video.subarray(start,end+1));return;
  }
  if(req.url==='/poster.webp'){res.writeHead(200,{'Content-Type':'image/webp'});res.end(poster);return;}
  res.writeHead(200,{'Content-Type':'text/html'});res.end(html);
});
await new Promise((resolve)=>server.listen(0,'127.0.0.1',resolve));
let browser;
const results=[];
try {
  browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true});
  for (const [name,width,height,motion] of [['desktop',1000,660,'no-preference'],['mobile',390,740,'reduce']]){
    const page=await browser.newPage({viewport:{width,height},reducedMotion:motion});
    let requests=0;
    page.on('request',req=>{if(req.url().endsWith('/clip.mp4')) requests++;});
    await page.goto(`http://127.0.0.1:${server.address().port}`);
    await page.locator('video').waitFor();
    assert.equal(requests,0);
    assert.equal(await page.locator('video').evaluate(v=>v.paused),true);
    assert.equal(await page.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches),motion==='reduce');
    await page.locator('#card').screenshot({path:join(output,`card-${name}-poster.png`)});
    await page.getByRole('button',{name:'Play product showcase'}).click();
    await page.waitForFunction(()=>document.querySelector('video').currentTime>=1.54);
    await page.getByRole('button',{name:'Pause showcase'}).click();
    const media = page.locator('video');
    assert.equal(await media.evaluate(v=>v.paused && v.muted),true);
    const box=await media.boundingBox();
    const expectedRatio = name==='desktop' ? 2.15 : 1.9;
    assert.ok(box.width<=width && Math.abs(box.width/box.height-expectedRatio)<.025);
    await page.locator('#card').screenshot({path:join(output,`card-${name}-playing.png`)});
    for (const time of sought.map(Number)) {
      await media.evaluate((v,seconds)=>new Promise((resolve)=>{
        v.addEventListener('seeked',resolve,{once:true}); v.currentTime=seconds;
      }),time);
      assert.ok(Math.abs(await media.evaluate(v=>v.currentTime)-time)<.08);
      await page.locator('#card').screenshot({path:join(output,`card-${name}-${time.toFixed(2)}.png`)});
    }
    results.push({name,viewport:width,cardWidth:box.width,cardHeight:box.height,
      reducedMotion:motion==='reduce',autoplay:false,objectFit:await media.evaluate(v=>getComputedStyle(v).objectFit),mp4RequestsAfterClick:requests,
      reviewedAt:await media.evaluate(v=>v.currentTime)});
    await page.close();
  }
  await writeFile(join(output,'embed.json'),JSON.stringify(results,null,2)+'\n');
} finally {
  await browser?.close();
  await new Promise((resolve)=>server.close(resolve));
}
