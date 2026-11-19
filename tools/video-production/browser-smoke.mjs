import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

// Portfolio already depends on Playwright. An existing installation can be reused.
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const [file] = process.argv.slice(2);
if (!file) throw new Error('Usage: node browser-smoke.mjs /path/to/render.mp4');
const video = await readFile(file);
const server = createServer((request, response) => {
  if (request.url === '/video.mp4') {
    response.writeHead(200, { 'Content-Type': 'video/mp4', 'Content-Length': video.length });
    response.end(video);
  } else {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end('<!doctype html><meta charset="utf-8"><video src="/video.mp4" muted playsinline></video>');
  }
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
let browser;
try {
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, headless: true });
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  const result = await page.locator('video').evaluate(async (player) => {
    const presented = [];
    const finished = new Promise((resolve, reject) => {
      player.addEventListener('ended', resolve, { once: true });
      player.addEventListener('error', () => reject(Error(player.error.message)), { once: true });
      setTimeout(() => reject(Error('Playback did not reach the end')), 60_000);
    });
    function watch(_now, metadata) {
      presented.push(metadata.mediaTime);
      if (!player.ended) player.requestVideoFrameCallback(watch);
    }
    player.requestVideoFrameCallback(watch);
    player.playbackRate = 1;
    await player.play();
    await finished;
    const quality = player.getVideoPlaybackQuality();
    return {
      duration: player.duration, width: player.videoWidth, height: player.videoHeight,
      ended: player.ended, firstPresented: presented.at(0), lastPresented: presented.at(-1),
      presentedCallbacks: presented.length, totalVideoFrames: quality.totalVideoFrames,
      droppedVideoFrames: quality.droppedVideoFrames,
    };
  });
  assert.equal(result.ended, true);
  assert.ok(result.firstPresented <= .2 && result.lastPresented >= result.duration - .15);
  assert.ok(result.totalVideoFrames > 0 && result.droppedVideoFrames / result.totalVideoFrames < .05);
  console.log(JSON.stringify({ chromium: browser.version(), ...result }, null, 2));
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}
