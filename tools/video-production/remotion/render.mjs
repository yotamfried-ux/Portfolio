import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';

const [output, recipe] = process.argv.slice(2);
if (!output) throw new Error('Usage: npm run render -- OUTPUT.mp4 [RECIPE.json]');
const inputProps = recipe ? {recipe:JSON.parse(await readFile(recipe,'utf8'))} : {};
const id = recipe ? 'ProductShowcase' : 'ToriExperiment';
const browserExecutable = process.env.CHROMIUM_PATH || '/usr/bin/chromium';
const dir = await mkdtemp(join(tmpdir(),'portfolio-remotion-'));
const raw = join(dir,'composition.mp4');
try {
  const serveUrl = await bundle({entryPoint:resolve('src/index.tsx'),onProgress:()=>{},outDir:join(dir,'bundle')});
  const composition = await selectComposition({serveUrl,id,browserExecutable,inputProps});
  await renderMedia({serveUrl,composition,browserExecutable,inputProps,codec:'h264',
    outputLocation:raw,muted:true,crf:16,concurrency:2,pixelFormat:'yuv420p'});
  const range = execFileSync('ffprobe',['-v','error','-select_streams','v:0','-show_entries',
    'stream=color_range','-of','default=nw=1:nk=1',raw],{encoding:'utf8'}).trim();
  const scale = range === 'pc' ? 'scale=in_range=pc:out_range=tv,' : '';
  execFileSync('ffmpeg',['-v','error','-threads','2','-i',raw,'-map','0:v:0','-vf',
    scale+'format=yuv420p,setsar=1','-color_range','tv','-an','-c:v','libx264','-threads','4',
    '-crf','17','-movflags','+faststart','-y',resolve(output)],{stdio:'inherit'});
} finally {
  await rm(dir,{recursive:true,force:true});
}
