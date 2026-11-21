import express from 'express';
import type { Request, Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseRangeHeader } from './src/lib/rangeDownload.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number.parseInt(process.env.PORT ?? '3000', 10);
const VIDEO_FILENAME = 'sakib-law34-90s.mp4';

const VIDEO_CANDIDATES = [
  path.resolve(__dirname, 'public', 'video', VIDEO_FILENAME),
  path.resolve(__dirname, 'dist', 'video', VIDEO_FILENAME),
  path.resolve(__dirname, 'out', VIDEO_FILENAME),
];

const POSTER_CANDIDATES = [
  path.resolve(__dirname, 'public', 'video', 'poster.png'),
  path.resolve(__dirname, 'dist', 'video', 'poster.png'),
  path.resolve(__dirname, 'out', 'stills', 'scene01_cold_open_glitch.png'),
];

function resolveExistingPath(candidates: readonly string[]): string | null {
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}

function setCrossOriginMediaHeaders(res: Response): void {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Range, Content-Length, Accept-Ranges');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
}

function handleVideoStream(req: Request, res: Response): void {
  setCrossOriginMediaHeaders(res);
  const videoPath = resolveExistingPath(VIDEO_CANDIDATES);
  if (!videoPath) {
    res.status(404).json({ error: 'Rendered MP4 not found' });
    return;
  }

  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const parsed = parseRangeHeader(req.headers.range, fileSize);

  if (parsed.status === 'invalid') {
    res.writeHead(416, {
      'Content-Range': `bytes */${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'no-store',
    });
    res.end();
    return;
  }

  if (parsed.status === 'ok') {
    const { start, end, chunkLength } = parsed.range;
    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkLength,
      'Content-Type': 'video/mp4',
      'Cache-Control': 'no-store',
    });
    const stream = fs.createReadStream(videoPath, { start, end });
    stream.on('error', () => {
      if (!res.headersSent) {
        res.status(500).end();
      } else {
        res.end();
      }
    });
    stream.pipe(res);
    return;
  }

  res.writeHead(200, {
    'Content-Length': fileSize,
    'Content-Type': 'video/mp4',
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'no-store',
  });
  const stream = fs.createReadStream(videoPath);
  stream.on('error', () => {
    if (!res.headersSent) {
      res.status(500).end();
    } else {
      res.end();
    }
  });
  stream.pipe(res);
}

function handleDirectDownload(_req: Request, res: Response): void {
  setCrossOriginMediaHeaders(res);
  const videoPath = resolveExistingPath(VIDEO_CANDIDATES);
  if (!videoPath) {
    res.status(404).json({ error: 'Rendered MP4 not found' });
    return;
  }
  const stat = fs.statSync(videoPath);
  res.writeHead(200, {
    'Content-Type': 'video/mp4',
    'Content-Length': stat.size,
    'Content-Disposition': `attachment; filename="${VIDEO_FILENAME}"`,
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'no-store',
  });
  const stream = fs.createReadStream(videoPath);
  stream.pipe(res);
}

async function startServer(): Promise<void> {
  const app = express();
  app.disable('x-powered-by');

  app.get('/api/poster', (_req, res) => {
    setCrossOriginMediaHeaders(res);
    res.setHeader('Cache-Control', 'no-store');
    const posterPath = resolveExistingPath(POSTER_CANDIDATES);
    if (!posterPath) {
      res.status(404).end();
      return;
    }
    res.sendFile(posterPath);
  });

  // Metadata endpoint for exact rendered MP4 byte size
  app.get('/api/meta', (_req, res) => {
    setCrossOriginMediaHeaders(res);
    res.setHeader('Cache-Control', 'no-store');
    const videoPath = resolveExistingPath(VIDEO_CANDIDATES);
    if (!videoPath) {
      res.status(404).json({ error: 'Rendered MP4 not found' });
      return;
    }
    const stat = fs.statSync(videoPath);
    res.json({
      filename: VIDEO_FILENAME,
      sizeBytes: stat.size,
      width: 1080,
      height: 1920,
      fps: 30,
      durationSec: 90,
      totalFrames: 2700,
    });
  });

  // HEAD /api/video for fast size probing
  app.head('/api/video', (_req, res) => {
    setCrossOriginMediaHeaders(res);
    const videoPath = resolveExistingPath(VIDEO_CANDIDATES);
    if (!videoPath) {
      res.status(404).end();
      return;
    }
    const stat = fs.statSync(videoPath);
    res.writeHead(200, {
      'Content-Type': 'video/mp4',
      'Content-Length': stat.size,
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'no-store',
    });
    res.end();
  });

  // RFC 7233 HTTP 206 Partial Content streaming routes (both /api/video and /video/sakib-law34-90s.mp4)
  app.get('/api/video', handleVideoStream);
  app.get(`/video/${VIDEO_FILENAME}`, handleVideoStream);

  // Direct attachment download routes (/api/download and short /download) for instant phone & desktop downloads
  app.get('/api/download', handleDirectDownload);
  app.get('/download', handleDirectDownload);

  // Mount Vite middleware in development, or static dist in production
  const isProd = process.env.NODE_ENV === 'production';
  const distDir = path.resolve(__dirname, 'dist');

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else if (fs.existsSync(distDir)) {
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Server] Startup error:', err);
  process.exit(1);
});
