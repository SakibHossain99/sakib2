import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { bundle } from '@remotion/bundler';
import { renderMedia, renderStill, selectComposition } from '@remotion/renderer';
import { GENERATED_SCENES, GENERATED_SILENCE_DROP } from '../src/lib/audioManifest.generated';

const BROWSER_EXECUTABLE =
  '/ms-playwright/chrome-headless-shell-linux64/chrome-headless-shell';

const COMPOSITION_ID = 'Law34BengaliShort';
const ENTRY_POINT = path.resolve(process.cwd(), 'src', 'remotion', 'index.ts');
const OUT_DIR = path.resolve(process.cwd(), 'out');
const STILLS_DIR = path.join(OUT_DIR, 'stills');
const RAW_MP4 = path.join(OUT_DIR, 'raw.mp4');
const OUT_FINAL_MP4 = path.join(OUT_DIR, 'sakib-law34-90s.mp4');

// Persist rendered MP4 and poster inside public/video/ so container sync & live preview always keep them!
const PUBLIC_VIDEO_DIR = path.resolve(process.cwd(), 'public', 'video');
const PUBLIC_FINAL_MP4 = path.join(PUBLIC_VIDEO_DIR, 'sakib-law34-90s.mp4');
const PUBLIC_POSTER_PNG = path.join(PUBLIC_VIDEO_DIR, 'poster.png');

function runCmd(bin: string, args: string[]): string {
  return execFileSync(bin, args, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
}

function getPreviewFrames(): Array<{ name: string; frame: number }> {
  const byId = new Map(GENERATED_SCENES.map((s) => [s.id, s]));
  const s1 = byId.get(1)!;
  const s3 = byId.get(3)!;
  const s5 = byId.get(5)!;
  const s6 = byId.get(6)!;
  const s7 = byId.get(7)!;
  const s10 = byId.get(10)!;

  return [
    { name: 'scene01_cold_open_glitch.png', frame: s1.startFrame + 82 },
    { name: 'scene03_aunty_micdrop.png', frame: Math.min(s3.endFrame - 20, GENERATED_SILENCE_DROP.startFrame + 6) },
    { name: 'scene05_neural_cutaway.png', frame: s5.startFrame + Math.round((s5.endFrame - s5.startFrame) * 0.58) },
    { name: 'scene06_mirror_comparison.png', frame: s6.startFrame + Math.round((s6.endFrame - s6.startFrame) * 0.62) },
    { name: 'scene07_book_quote.png', frame: s7.startFrame + Math.round((s7.endFrame - s7.startFrame) * 0.68) },
    { name: 'scene10_finale_cta.png', frame: s10.startFrame + Math.round((s10.endFrame - s10.startFrame) * 0.55) },
  ];
}

async function main(): Promise<void> {
  const stillsOnly = process.argv.includes('--stills-only');
  const videoOnly = process.argv.includes('--video-only');

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(STILLS_DIR, { recursive: true });
  fs.mkdirSync(PUBLIC_VIDEO_DIR, { recursive: true });

  console.log('[Render] Bundling Remotion 4.x composition...');
  const serveUrl = await bundle({
    entryPoint: ENTRY_POINT,
    publicDir: path.resolve(process.cwd(), 'public'),
  });

  const browserExecutable = fs.existsSync(BROWSER_EXECUTABLE)
    ? BROWSER_EXECUTABLE
    : undefined;

  console.log('[Render] Selecting composition:', COMPOSITION_ID);
  const composition = await selectComposition({
    serveUrl,
    id: COMPOSITION_ID,
    browserExecutable,
    chromiumOptions: {
      disableWebSecurity: false,
      gl: 'angle',
    },
  });

  if (!videoOnly) {
    console.log('[Render] Rendering 6 preview stills for visual inspection...');
    const previews = getPreviewFrames();
    for (const p of previews) {
      const output = path.join(STILLS_DIR, p.name);
      await renderStill({
        composition,
        serveUrl,
        output,
        frame: p.frame,
        browserExecutable,
        chromiumOptions: { gl: 'angle' },
      });
      console.log(`  - Saved ${output} (frame ${p.frame})`);
      if (p.name === 'scene01_cold_open_glitch.png') {
        fs.copyFileSync(output, PUBLIC_POSTER_PNG);
        console.log(`  - Synced persistent poster -> ${PUBLIC_POSTER_PNG}`);
      }
    }
  }

  if (stillsOnly) {
    console.log('[Render] --stills-only complete.');
    return;
  }

  const concurrency = Math.max(2, Math.min(4, os.cpus().length));
  console.log(`[Render] Rendering full 2,700-frame 1080x1920 30fps MP4 (concurrency=${concurrency})...`);

  let lastLoggedPct = -10;
  await renderMedia({
    composition,
    serveUrl,
    codec: 'h264',
    crf: 18,
    x264Preset: 'ultrafast',
    imageFormat: 'jpeg',
    jpegQuality: 90,
    pixelFormat: 'yuv420p',
    audioCodec: 'aac',
    audioBitrate: '192k',
    outputLocation: RAW_MP4,
    concurrency,
    browserExecutable,
    chromiumOptions: { gl: 'angle' },
    onProgress: ({ progress, renderedFrames, encodedFrames }) => {
      const pct = Math.floor(progress * 100);
      if (pct >= lastLoggedPct + 10) {
        lastLoggedPct = pct;
        console.log(`  [Render Progress] ${pct}% (rendered ${renderedFrames}/2700, encoded ${encodedFrames}/2700)`);
      }
    },
  });

  // Normalize to strict mobile-compatible H.264 High@4.1 yuv420p (TV range) + faststart for iOS Safari & Android!
  console.log('[Render] Encoding strict mobile-compatible yuv420p +faststart -> public/video/sakib-law34-90s.mp4 ...');
  runCmd('ffmpeg', [
    '-y',
    '-i', RAW_MP4,
    '-c:v', 'libx264',
    '-preset', 'veryfast',
    '-crf', '21',
    '-profile:v', 'high',
    '-level', '4.1',
    '-pix_fmt', 'yuv420p',
    '-color_range', 'tv',
    '-c:a', 'copy',
    '-movflags', '+faststart',
    PUBLIC_FINAL_MP4,
  ]);

  // Mirror into out/ for compatibility and remove raw intermediate
  fs.copyFileSync(PUBLIC_FINAL_MP4, OUT_FINAL_MP4);
  if (fs.existsSync(RAW_MP4)) {
    fs.unlinkSync(RAW_MP4);
  }

  const videoProbe = runCmd('ffprobe', [
    '-v', 'error',
    '-select_streams', 'v:0',
    '-show_entries', 'stream=codec_name,profile,width,height,pix_fmt,color_range,nb_frames,r_frame_rate',
    '-of', 'default=noprint_wrappers=1',
    PUBLIC_FINAL_MP4,
  ]);
  const audioProbe = runCmd('ffprobe', [
    '-v', 'error',
    '-select_streams', 'a:0',
    '-show_entries', 'stream=codec_name,channels,sample_rate,bit_rate',
    '-of', 'default=noprint_wrappers=1',
    PUBLIC_FINAL_MP4,
  ]);
  const formatProbe = runCmd('ffprobe', [
    '-v', 'error',
    '-show_entries', 'format=duration,size',
    '-of', 'default=noprint_wrappers=1',
    PUBLIC_FINAL_MP4,
  ]);

  console.log('\n[Render] Verified public/video/sakib-law34-90s.mp4 via ffprobe:');
  console.log('--- VIDEO ---\n' + videoProbe);
  console.log('--- AUDIO ---\n' + audioProbe);
  console.log('--- FORMAT ---\n' + formatProbe);
}

main().catch((err) => {
  console.error('[Render] FATAL ERROR:', err);
  process.exit(1);
});
