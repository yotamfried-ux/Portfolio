import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { mkdir, stat, writeFile } from 'node:fs/promises';
import { extname, isAbsolute, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const [source, destination, ...centers] = process.argv.slice(2);
if (!source || !destination || !isAbsolute(source) || !isAbsolute(destination) ||
    extname(source).toLowerCase() !== '.mp4' || !(await stat(source)).isFile()) {
  throw new Error('Use an absolute path to a local MP4 and an absolute output directory');
}
if (!centers.every((center) => /^\d+(\.\d+)?$/.test(center) && Number(center) < 3600)) {
  throw new Error('Seam centers must be nonnegative seconds under one hour');
}
await mkdir(destination, { recursive: true, mode: 0o700 });
const transport = new StdioClientTransport({
  command: process.execPath,
  args: [fileURLToPath(new URL('./node_modules/mcp-video-analyzer/dist/index.js', import.meta.url))],
  env: {
    PATH: process.env.PATH,
    FFMPEG_BIN: process.env.FFMPEG_BIN || '/usr/bin/ffmpeg',
    MCP_CACHE_DIR: destination,
  },
});
const client = new Client({ name: 'portfolio-local-visual-review', version: '1.0.0' });
const timestamp = (seconds) => {
  const ms = Math.round(seconds * 1000);
  const remainder = (ms % 60000 / 1000).toFixed(3).padStart(6, '0');
  return `${Math.floor(ms / 60000)}:${remainder}`;
};

async function take(label, name, args) {
  const reply = await client.callTool({ name, arguments: { url: source, ...args } });
  if (reply.isError) throw new Error(JSON.stringify(reply.content));
  let images = 0;
  const descriptions = [];
  for (const item of reply.content) {
    if (item.type === 'image') {
      await writeFile(join(destination, `${label}-${++images}.jpg`), Buffer.from(item.data, 'base64'), { mode: 0o600 });
    } else if (item.type === 'text') {
      descriptions.push(JSON.parse(item.text));
    }
  }
  if (!images) throw new Error(`Missing frame output for ${label}`);
  console.log(JSON.stringify({ label, images, descriptions }));
}

try {
  await client.connect(transport);
  console.log(JSON.stringify({ tools: (await client.listTools()).tools.map((tool) => tool.name) }));
  await take('overview', 'get_frames', { options: { maxFrames: 60, dense: true, maxWidth: 960 } });
  if (centers.length) {
    for (const center of centers.map(Number)) {
      await take(`seam-${center}`, 'get_frame_burst', {
        from: timestamp(Math.max(0, center - .12)), to: timestamp(center + .16),
        count: 7, returnBase64: true, maxWidth: 960,
      });
    }
  } else {
    const options = { timestamp: '0:03.000', returnBase64: true, maxWidth: 0 };
    await take('exact', 'get_frame_at', options);
    await take('burst', 'get_frame_burst', {
      from: '0:02.400', to: '0:03.120', count: 6, returnBase64: true, maxWidth: 960,
    });
    await take('exact-repeat', 'get_frame_at', options);
  }
} finally {
  await client.close();
}
