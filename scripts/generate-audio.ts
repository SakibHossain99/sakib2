import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

const FPS = 30;
const TOTAL_FRAMES = 2700;
const TOTAL_DURATION = 90.0;

export type SpeakerId = 'narrator' | 'sakib' | 'ruksana' | 'aunty' | 'nadim';

interface VoiceProfile {
  speakerId: SpeakerId;
  bengaliName: string;
  voice: string;
  rate: string;
  pitch: string;
  accentColor: string;
}

const VOICE_PROFILES: Record<SpeakerId, VoiceProfile> = {
  narrator: {
    speakerId: 'narrator',
    bengaliName: 'কথক',
    voice: 'bn-BD-PradeepNeural',
    rate: '-4%',
    pitch: '-3Hz',
    accentColor: '#D4AF37',
  },
  sakib: {
    speakerId: 'sakib',
    bengaliName: 'সাকিব',
    voice: 'bn-IN-BashkarNeural',
    rate: '+2%',
    pitch: '+2Hz',
    accentColor: '#5CA4D6',
  },
  ruksana: {
    speakerId: 'ruksana',
    bengaliName: 'রুকসানা',
    voice: 'bn-BD-NabanitaNeural',
    rate: '-6%',
    pitch: '-2Hz',
    accentColor: '#2EC4B6',
  },
  aunty: {
    speakerId: 'aunty',
    bengaliName: 'আন্টি',
    voice: 'bn-IN-TanishaaNeural',
    rate: '+7%',
    pitch: '+5Hz',
    accentColor: '#E05A7A',
  },
  nadim: {
    speakerId: 'nadim',
    bengaliName: 'নাদিম',
    voice: 'bn-IN-BashkarNeural',
    rate: '+6%',
    pitch: '+4Hz',
    accentColor: '#4ADE80',
  },
};

interface ScriptLineSpec {
  id: string;
  sceneId: number;
  speaker: SpeakerId;
  captionText: string;
  ttsText?: string;
  pauseAfterSec?: number;
}

interface NominalScene {
  id: number;
  slug: string;
  title: string;
  nominalStartSec: number;
  nominalEndSec: number;
  veilColor: string;
}

const NOMINAL_SCENES: NominalScene[] = [
  { id: 1, slug: 'cold-open', title: 'Viral Lie-Detector Glitch Cold Open', nominalStartSec: 0, nominalEndSec: 10, veilColor: '#1E242B' },
  { id: 2, slug: 'flashback-knot', title: 'Flashback Sacrifice & The Saree Knot', nominalStartSec: 10, nominalEndSec: 19, veilColor: '#EFE7DA' },
  { id: 3, slug: 'aunty-ambush', title: 'The Afternoon Ambush & The One-Line Mic-Drop', nominalStartSec: 19, nominalEndSec: 31, veilColor: '#EFE7DA' },
  { id: 4, slug: 'midnight-reveal', title: 'Moonlit Midnight Reveal', nominalStartSec: 31, nominalEndSec: 43, veilColor: '#141B29' },
  { id: 5, slug: 'neural-cutaway', title: 'Side-Profile Neural Cutaway: Royal Identity Shift', nominalStartSec: 43, nominalEndSec: 52, veilColor: '#0D131D' },
  { id: 6, slug: 'mirror-graphic', title: 'Own Worth vs The World Eyes', nominalStartSec: 52, nominalEndSec: 62, veilColor: '#0D131D' },
  { id: 7, slug: 'book-quote', title: '3D Opening Book Quote & Golden Rule', nominalStartSec: 62, nominalEndSec: 71, veilColor: '#1B1410' },
  { id: 8, slug: 'five-years-later', title: '5 Years Later: The Royal Turnaround', nominalStartSec: 71, nominalEndSec: 77, veilColor: '#FFF6E5' },
  { id: 9, slug: 'three-rules', title: 'Save-Worthy 3-Rule Action Card', nominalStartSec: 77, nominalEndSec: 83, veilColor: '#0F2421' },
  { id: 10, slug: 'grand-finale', title: 'Grand Happy Finale & Viral CTA', nominalStartSec: 83, nominalEndSec: 90, veilColor: '#FFF6E5' },
];

const SCRIPT_LINES: ScriptLineSpec[] = [
  {
    id: 's01_l01',
    sceneId: 1,
    speaker: 'sakib',
    captionText: 'মা, আমি এ প্লাস পেয়েছি!',
    pauseAfterSec: 0.65, // Leaves dramatic beat for frame-75 glitch freeze!
  },
  {
    id: 's01_l02',
    sceneId: 1,
    speaker: 'narrator',
    captionText: 'অথচ এইচএসসিতে সাকিবের জিপিএ ২.৮! মা রুকসানা সেটা আগেই জানতেন—তবুও পুরো মহল্লায় মিষ্টি বিলালেন!',
  },
  {
    id: 's02_l01',
    sceneId: 2,
    speaker: 'narrator',
    captionText: 'সাকিবের কোচিংয়ের টাকা দিতে রুকসানা এক বছর নতুন শাড়ি কেনেননি।',
    pauseAfterSec: 0.35,
  },
  {
    id: 's02_l02',
    sceneId: 2,
    speaker: 'narrator',
    captionText: 'মা আঁচলের গিঁট খুলে মিষ্টি আনালেন—সাকিবের হাত-পা ঠান্ডা, ধরা পড়লে মায়ের মুখ থাকবে না!',
  },
  {
    id: 's03_l01',
    sceneId: 3,
    speaker: 'aunty',
    captionText: 'আপা, ২.৮-এ এত মিষ্টি?!',
    pauseAfterSec: 0.45,
  },
  {
    id: 's03_l02',
    sceneId: 3,
    speaker: 'ruksana',
    captionText: 'মিষ্টি রেজাল্টের জন্য না আপা—আমার ছেলে সাকিবের জন্য!',
    pauseAfterSec: 1.35, // Dramatic silence drop right after Ruksana's mic-drop!
  },
  {
    id: 's03_l03',
    sceneId: 3,
    speaker: 'narrator',
    captionText: 'রুকসানার ওই এক লাইনে পুরো মহল্লা চুপ হয়ে গেল!',
  },
  {
    id: 's04_l01',
    sceneId: 4,
    speaker: 'sakib',
    captionText: 'তুমি জানতে মা?! তাহলে মিষ্টি কেন?',
    pauseAfterSec: 0.45,
  },
  {
    id: 's04_l02',
    sceneId: 4,
    speaker: 'ruksana',
    captionText: 'আজ মহল্লা দেখল আমি আমার ছেলেকে কীভাবে দেখি—কাল থেকে ওরাও তোকে সেভাবেই দেখবে। আর কোনোদিন মিথ্যা বলবি না সাকিব, মাথাও নিচু করবি না।',
  },
  {
    id: 's05_l01',
    sceneId: 5,
    speaker: 'narrator',
    captionText: 'সেই রাতে সাকিবের ভেতরের ভয় ভেঙে গেল—সে বুঝল, মানুষ তোমাকে ঠিক ততটুকুই সম্মান দেয়, যতটুকু তুমি নিজেকে দাও।',
  },
  {
    id: 's06_l01',
    sceneId: 6,
    speaker: 'narrator',
    captionText: 'রাজা মানে টাকা না, রেজাল্টও না—রাজা মানে নিজের দাম দুনিয়াকে ঠিক করতে না দেওয়া।',
  },
  {
    id: 's07_l01',
    sceneId: 7,
    speaker: 'narrator',
    captionText: 'রবার্ট গ্রিনের ৩৪ নম্বর নিয়ম বলে—রাজার মতো চলো, দুনিয়া তোমাকে রাজার মতোই সম্মান করবে।',
  },
  {
    id: 's08_l01',
    sceneId: 8,
    speaker: 'nadim',
    captionText: 'চল দোস্ত, আজ মাথা উঁচু করে মিষ্টি দিয়ে আসি!',
    pauseAfterSec: 0.35,
  },
  {
    id: 's08_l02',
    sceneId: 8,
    speaker: 'narrator',
    captionText: 'পাঁচ বছর পর প্রথম বেতনের মিষ্টি সাকিব নিজেই দিয়ে এলো সেই আন্টির বাসায়—মাথা উঁচু করে!',
  },
  {
    id: 's09_l01',
    sceneId: 9,
    speaker: 'narrator',
    captionText: 'তাই তিনটি কথা মনে রাখুন—মিথ্যা বলবেন না, কৈফিয়ত দেবেন না, আর সন্তানকে শাসন করুন ঘরে—সম্মান দিন সবার সামনে।',
  },
  {
    id: 's10_l01',
    sceneId: 10,
    speaker: 'narrator',
    captionText: 'কারণ মিষ্টিটা কখনো রেজাল্টের জন্য ছিল না—মানুষটার জন্য ছিল। রেজাল্টের দিন আপনার মা-বাবা কী বলেছিলেন? কমেন্টে লিখুন, আর ফলো করুন @sakibexplains.bn!',
    ttsText: 'কারণ মিষ্টিটা কখনো রেজাল্টের জন্য ছিল না—মানুষটার জন্য ছিল। রেজাল্টের দিন আপনার মা-বাবা কী বলেছিলেন? কমেন্টে লিখুন, আর ফলো করুন সাকিব এক্সপ্লেইনস ডট বি এন!',
  },
];

const WORK_DIR = path.resolve(process.cwd(), '.audio-build');
const OUT_AUDIO_DIR = path.resolve(process.cwd(), 'public', 'audio');
const OUT_VOICEOVER_PATH = path.join(OUT_AUDIO_DIR, 'voiceover.mp3');
const OUT_MANIFEST_PATH = path.resolve(process.cwd(), 'src', 'lib', 'audioManifest.generated.ts');

function runCmd(bin: string, args: string[]): string {
  return execFileSync(bin, args, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
}

function probeDurationSec(filePath: string): number {
  const out = runCmd('ffprobe', [
    '-v', 'error',
    '-show_entries', 'format=duration',
    '-of', 'default=noprint_wrappers=1:nokey=1',
    filePath,
  ]);
  const val = Number.parseFloat(out);
  if (!Number.isFinite(val) || val <= 0) {
    throw new Error(`Invalid duration from ffprobe for ${filePath}: ${out}`);
  }
  return val;
}

async function synthesizeLine(line: ScriptLineSpec, outRawMp3: string): Promise<void> {
  const profile = VOICE_PROFILES[line.speaker];
  const spokenText = line.ttsText ?? line.captionText;

  let lastErr: unknown;
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const tts = new MsEdgeTTS();
      await tts.setMetadata(profile.voice, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);
      const { audioStream } = tts.toStream(spokenText, {
        rate: profile.rate,
        pitch: profile.pitch,
      });
      const chunks: Buffer[] = [];
      for await (const chunk of audioStream) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      const buf = Buffer.concat(chunks);
      if (buf.length < 512) {
        throw new Error(`Empty TTS buffer (${buf.length} bytes) for ${line.id}`);
      }
      fs.writeFileSync(outRawMp3, buf);
      return;
    } catch (err) {
      lastErr = err;
      console.warn(`[TTS] Retry ${attempt}/4 for ${line.id}:`, err instanceof Error ? err.message : err);
      await new Promise((r) => setTimeout(r, 700 * attempt));
    }
  }
  throw lastErr;
}

function buildEmotionalPianoBed(outPath: string, silenceDropStart: number, silenceDropEnd: number): void {
  // Subtle, warm emotional cinema ambient chord progression (90s exact)
  // D minor (0-43s, poignant sacrifice & tension) -> warm F/C uplift (43-71s, realization) -> bright D major glow (71-90s, turnaround & finale)
  // Softly ducked to -24dB under speech and cleanly muted during Ruksana's dramatic silence drop!
  const dropFadeInStart = silenceDropStart.toFixed(3);
  const dropFadeOutEnd = silenceDropEnd.toFixed(3);

  const exprL = [
    // Section 1-4 (0..43s): Warm Dm9 / Bbmaj7 gentle pad pulses
    `between(t,0,43)*(`,
    `  0.22*sin(2*PI*146.83*t) + 0.16*sin(2*PI*220.00*t) + 0.14*sin(2*PI*261.63*t) + 0.09*sin(2*PI*329.63*t)`,
    `)*(0.75 + 0.25*sin(2*PI*0.25*t))`,
    // Section 5-7 (43..71s): Thoughtful A minor / Fmaj7 / Cmaj7 swell
    `+ between(t,43,71)*(`,
    `  0.22*sin(2*PI*174.61*t) + 0.17*sin(2*PI*220.00*t) + 0.15*sin(2*PI*261.63*t) + 0.10*sin(2*PI*392.00*t)`,
    `)*(0.78 + 0.22*sin(2*PI*0.33*t))`,
    // Section 8-10 (71..90s): Warm uplifting D major / G major resolution
    `+ between(t,71,90)*(`,
    `  0.24*sin(2*PI*146.83*t) + 0.18*sin(2*PI*220.00*t) + 0.16*sin(2*PI*293.66*t) + 0.12*sin(2*PI*369.99*t)`,
    `)*(0.80 + 0.20*sin(2*PI*0.4*t))`,
  ].join('');

  // Subtle stereo detune on right channel for cinema width
  const exprR = exprL
    .replaceAll('146.83', '147.05')
    .replaceAll('174.61', '174.85')
    .replaceAll('261.63', '261.95')
    .replaceAll('369.99', '370.35');

  // Dramatic silence drop envelope around Ruksana's mic-drop
  const volumeExpr = `if(between(t,${dropFadeInStart},${dropFadeOutEnd}),0.02,1.0)`;

  runCmd('ffmpeg', [
    '-y',
    '-f', 'lavfi',
    '-i', `aevalsrc='${exprL}|${exprR}':s=44100:d=${TOTAL_DURATION}:c=stereo`,
    '-af', [
      'lowpass=f=880',
      'highpass=f=90',
      `volume='${volumeExpr}':eval=frame`,
      'afade=t=in:st=0:d=1.8',
      'afade=t=out:st=87.5:d=2.5',
      'volume=-24dB',
    ].join(','),
    '-c:a', 'pcm_s16le',
    outPath,
  ]);
}

function generateSfxClips(sfxDir: string): Record<string, string> {
  fs.mkdirSync(sfxDir, { recursive: true });
  const clips: Record<string, string> = {};

  // 1. Glitch-freeze hit (Scene 1 frame 75): tight sub drop + crisp digital crackle
  clips.glitchHit = path.join(sfxDir, 'sfx_glitch_hit.wav');
  runCmd('ffmpeg', [
    '-y',
    '-f', 'lavfi',
    '-i', `aevalsrc='(0.75*sin(2*PI*(110*exp(-6*t))*t)*exp(-5.5*t) + 0.22*(random(0)-0.5)*exp(-14*t)*between(t,0,0.18))':s=44100:d=0.55:c=stereo`,
    '-af', 'lowpass=f=3200,volume=-10dB',
    '-c:a', 'pcm_s16le',
    clips.glitchHit,
  ]);

  // 2. Saree rustle & sweet box clink (Scene 2): soft filtered noise shimmer + warm porcelain tap
  clips.sareeSweet = path.join(sfxDir, 'sfx_saree_sweet.wav');
  runCmd('ffmpeg', [
    '-y',
    '-f', 'lavfi',
    '-i', `aevalsrc='(0.18*(random(1)-0.5)*sin(PI*t/0.75)*between(t,0,0.75) + 0.35*sin(2*PI*1480*t)*exp(-18*max(0,t-0.35))*gte(t,0.35) + 0.20*sin(2*PI*2210*t)*exp(-22*max(0,t-0.35))*gte(t,0.35))':s=44100:d=0.95:c=stereo`,
    '-af', 'bandpass=f=1600:width_type=h:w=1800,volume=-16dB',
    '-c:a', 'pcm_s16le',
    clips.sareeSweet,
  ]);

  // 3. Phone notification ping (Scene 3 Aunty entrance): bright two-tone smartphone alert
  clips.phonePing = path.join(sfxDir, 'sfx_phone_ping.wav');
  runCmd('ffmpeg', [
    '-y',
    '-f', 'lavfi',
    '-i', `aevalsrc='(0.40*sin(2*PI*1174.66*t)*exp(-12*t)*between(t,0,0.22) + 0.42*sin(2*PI*1567.98*(t-0.11))*exp(-10*(t-0.11))*gte(t,0.11))':s=44100:d=0.55:c=stereo`,
    '-af', 'volume=-15dB',
    '-c:a', 'pcm_s16le',
    clips.phonePing,
  ]);

  // 4. Warm book page-turn (Scene 7): soft papery swoosh
  clips.pageTurn = path.join(sfxDir, 'sfx_page_turn.wav');
  runCmd('ffmpeg', [
    '-y',
    '-f', 'lavfi',
    '-i', `aevalsrc='0.28*(random(2)-0.5)*pow(sin(PI*t/0.65),1.5)':s=44100:d=0.65:c=stereo`,
    '-af', 'bandpass=f=1100:width_type=h:w=1400,volume=-15dB',
    '-c:a', 'pcm_s16le',
    clips.pageTurn,
  ]);

  // 5. Golden chime glow (Scene 10 finale): warm royal harmonic shimmer
  clips.royalChime = path.join(sfxDir, 'sfx_royal_chime.wav');
  runCmd('ffmpeg', [
    '-y',
    '-f', 'lavfi',
    '-i', `aevalsrc='(0.28*sin(2*PI*587.33*t)+0.22*sin(2*PI*880*t)+0.18*sin(2*PI*1174.66*t))*exp(-2.4*t)':s=44100:d=1.6:c=stereo`,
    '-af', 'lowpass=f=3500,volume=-16dB',
    '-c:a', 'pcm_s16le',
    clips.royalChime,
  ]);

  return clips;
}

async function main(): Promise<void> {
  fs.mkdirSync(WORK_DIR, { recursive: true });
  fs.mkdirSync(OUT_AUDIO_DIR, { recursive: true });

  console.log('[Audio] Synthesizing 16 Bengali neural character voiceovers...');
  const rawClips: Array<{
    line: ScriptLineSpec;
    trimmedWav: string;
    naturalDurationSec: number;
  }> = [];

  for (const line of SCRIPT_LINES) {
    const rawMp3 = path.join(WORK_DIR, `${line.id}_raw.mp3`);
    const trimmedWav = path.join(WORK_DIR, `${line.id}_trimmed.wav`);

    if (!fs.existsSync(rawMp3) || fs.statSync(rawMp3).size < 1024) {
      await synthesizeLine(line, rawMp3);
    }

    // Trim silence and convert to 44.1kHz stereo WAV, then normalize per clip
    runCmd('ffmpeg', [
      '-y',
      '-i', rawMp3,
      '-af', 'silenceremove=start_periods=1:start_threshold=-42dB:start_silence=0.05,areverse,silenceremove=start_periods=1:start_threshold=-42dB:start_silence=0.06,areverse,highpass=f=70,dynaudnorm,alimiter=limit=0.95',
      '-ar', '44100',
      '-ac', '2',
      '-c:a', 'pcm_s16le',
      trimmedWav,
    ]);

    const dur = probeDurationSec(trimmedWav);
    console.log(`  - ${line.id} (${VOICE_PROFILES[line.speaker].bengaliName}): ${dur.toFixed(3)}s`);
    rawClips.push({ line, trimmedWav, naturalDurationSec: dur });
  }

  // Compute natural required duration per scene (leadIn + speech + inter-line pauses + tailOut)
  // so every single Bengali line plays naturally without truncation, locked frame-for-frame to 90.00s (2700f).
  const sceneLeadIn = (id: number) => (id === 1 ? 0.2 : 0.25);
  const sceneTailOut = (id: number) => (id === 10 ? 0.35 : 0.25);

  const rawSceneDemands = NOMINAL_SCENES.map((scene) => {
    const clips = rawClips.filter((c) => c.line.sceneId === scene.id);
    const speechTotal = clips.reduce((s, c) => s + c.naturalDurationSec, 0);
    const pauseTotal = clips.reduce((s, c, idx) => (idx < clips.length - 1 ? s + (c.line.pauseAfterSec ?? 0.28) : s), 0);
    // For Scene 1, reserve clean glitch beat between Line 1 and frame 75 (2.50s..3.00s)
    const extraVisualBeat = scene.id === 1 ? Math.max(0, 3.0 - (sceneLeadIn(1) + clips[0].naturalDurationSec + (clips[0].line.pauseAfterSec ?? 0.65))) : 0;
    // Give visual showcase scenes (5, 6, 7) slight breathing room so graphics land cleanly
    const visualHold = scene.id === 6 ? 1.1 : scene.id === 7 ? 0.9 : scene.id === 5 ? 0.45 : 0;
    const needed = sceneLeadIn(scene.id) + speechTotal + pauseTotal + extraVisualBeat + visualHold + sceneTailOut(scene.id);
    return { scene, clips, speechTotal, pauseTotal, visualHold, needed };
  });

  const totalNeeded = rawSceneDemands.reduce((s, d) => s + d.needed, 0);
  // Global gentle tempo adjustment if natural sum slightly exceeds 90.00s (stays around 1.00..1.05x — completely natural!)
  const totalFixedOverhead = rawSceneDemands.reduce(
    (s, d) => s + sceneLeadIn(d.scene.id) + d.pauseTotal + d.visualHold + sceneTailOut(d.scene.id),
    0,
  );
  const totalNaturalSpeech = rawSceneDemands.reduce((s, d) => s + d.speechTotal, 0);
  const targetSpeechTotal = TOTAL_DURATION - totalFixedOverhead;
  const globalTempo = totalNaturalSpeech > targetSpeechTotal
    ? Math.min(1.12, (totalNaturalSpeech / targetSpeechTotal) * 1.005)
    : 1.0;

  console.log(`[Audio] Total natural speech: ${totalNaturalSpeech.toFixed(2)}s, overhead: ${totalFixedOverhead.toFixed(2)}s, global tempo: ${globalTempo.toFixed(4)}x (totalNeeded raw=${totalNeeded.toFixed(2)}s)`);

  const placedCues: Array<{
    id: string;
    sceneId: number;
    speaker: SpeakerId;
    speakerName: string;
    accentColor: string;
    text: string;
    startSec: number;
    endSec: number;
    startFrame: number;
    endFrame: number;
    wavPath: string;
  }> = [];

  const finalScenes: Array<{
    id: number;
    slug: string;
    title: string;
    startSec: number;
    endSec: number;
    startFrame: number;
    endFrame: number;
    veilColor: string;
  }> = [];

  let silenceDropStart = 26.8;
  let silenceDropEnd = 28.1;
  let sceneCursorFrame = 0;

  for (let sIdx = 0; sIdx < rawSceneDemands.length; sIdx++) {
    const demand = rawSceneDemands[sIdx];
    const scene = demand.scene;
    const isLast = sIdx === rawSceneDemands.length - 1;

    const sceneStartFrame = sceneCursorFrame;
    const sceneStartSec = sceneStartFrame / FPS;
    let cursorSec = sceneStartSec + sceneLeadIn(scene.id);

    const scenePlaced: typeof placedCues = [];

    for (let i = 0; i < demand.clips.length; i++) {
      const item = demand.clips[i];
      let clipTempo = globalTempo;

      // Scene 1 Line 1 finishes before frame 75 (2.50s) glitch freeze; Line 2 starts right after at frame 90 (3.00s)
      if (scene.id === 1 && i === 0) {
        clipTempo = 1.0;
      } else if (scene.id === 1 && i === 1) {
        cursorSec = Math.max(cursorSec, 3.0);
      }

      const fittedWav = path.join(WORK_DIR, `${item.line.id}_fitted.wav`);
      if (clipTempo > 1.003) {
        runCmd('ffmpeg', [
          '-y',
          '-i', item.trimmedWav,
          '-af', `atempo=${clipTempo.toFixed(4)},highpass=f=70,dynaudnorm,alimiter=limit=0.95`,
          '-ar', '44100',
          '-ac', '2',
          '-c:a', 'pcm_s16le',
          fittedWav,
        ]);
      } else {
        fs.copyFileSync(item.trimmedWav, fittedWav);
      }

      const actualDur = probeDurationSec(fittedWav);
      const startSec = Number(cursorSec.toFixed(3));
      const endSec = Number((startSec + actualDur).toFixed(3));
      const startFrame = Math.round(startSec * FPS);
      const endFrame = Math.max(startFrame + 1, Math.round(endSec * FPS));

      const profile = VOICE_PROFILES[item.line.speaker];
      scenePlaced.push({
        id: item.line.id,
        sceneId: scene.id,
        speaker: item.line.speaker,
        speakerName: profile.bengaliName,
        accentColor: profile.accentColor,
        text: item.line.captionText,
        startSec,
        endSec,
        startFrame,
        endFrame,
        wavPath: fittedWav,
      });

      const pauseAfter = i < demand.clips.length - 1 ? (item.line.pauseAfterSec ?? 0.28) : 0;
      if (item.line.id === 's03_l02') {
        silenceDropStart = endSec;
        silenceDropEnd = endSec + pauseAfter;
      }
      cursorSec = endSec + pauseAfter;
    }

    const lastCueEnd = scenePlaced[scenePlaced.length - 1].endSec;
    const rawSceneEndSec = lastCueEnd + demand.visualHold + sceneTailOut(scene.id);
    const sceneEndFrame = isLast ? TOTAL_FRAMES : Math.min(TOTAL_FRAMES - (rawSceneDemands.length - 1 - sIdx) * 90, Math.round(rawSceneEndSec * FPS));
    const sceneEndSec = Number((sceneEndFrame / FPS).toFixed(3));

    // Clamp final cue inside sceneEndFrame - 1 just in case of rounding
    for (const c of scenePlaced) {
      if (c.endFrame > sceneEndFrame - 1) {
        c.endFrame = sceneEndFrame - 1;
        c.endSec = Number((c.endFrame / FPS).toFixed(3));
      }
      placedCues.push(c);
    }

    finalScenes.push({
      id: scene.id,
      slug: scene.slug,
      title: scene.title,
      startSec: Number(sceneStartSec.toFixed(3)),
      endSec: sceneEndSec,
      startFrame: sceneStartFrame,
      endFrame: sceneEndFrame,
      veilColor: scene.veilColor,
    });

    sceneCursorFrame = sceneEndFrame;
  }

  // Generate emotional piano/ambient bed ducked to -24dB + cinema SFX
  console.log('[Audio] Generating emotional piano ambient bed & cinema SFX...');
  const bedPath = path.join(WORK_DIR, 'piano_bed.wav');
  buildEmotionalPianoBed(bedPath, silenceDropStart, silenceDropEnd);
  const sfx = generateSfxClips(path.join(WORK_DIR, 'sfx'));

  // Build master voiceover track (all 16 clips placed at exact millisecond offsets)
  const voicesMixPath = path.join(WORK_DIR, 'voices_mix.wav');
  const voiceInputs: string[] = [
    '-f', 'lavfi', '-i', `anullsrc=r=44100:cl=stereo:d=${TOTAL_DURATION}`,
  ];
  const voiceFilters: string[] = [];
  const voiceLabels: string[] = ['[0:a]'];

  placedCues.forEach((cue, idx) => {
    const inputIdx = idx + 1;
    voiceInputs.push('-i', cue.wavPath);
    const delayMs = Math.round(cue.startSec * 1000);
    voiceFilters.push(`[${inputIdx}:a]adelay=${delayMs}|${delayMs},apad=whole_dur=${TOTAL_DURATION}[v${idx}]`);
    voiceLabels.push(`[v${idx}]`);
  });

  voiceFilters.push(
    `${voiceLabels.join('')}amix=inputs=${voiceLabels.length}:duration=first:normalize=0,highpass=f=70,dynaudnorm,alimiter=limit=0.95[vout]`,
  );

  runCmd('ffmpeg', [
    '-y',
    ...voiceInputs,
    '-filter_complex', voiceFilters.join(';'),
    '-map', '[vout]',
    '-t', `${TOTAL_DURATION.toFixed(2)}`,
    '-ar', '44100',
    '-ac', '2',
    '-c:a', 'pcm_s16le',
    voicesMixPath,
  ]);

  // Mix voices + emotional piano bed + cinema SFX into final 90.00s 192kbps stereo MP3
  const scene2Start = finalScenes.find((s) => s.id === 2)?.startSec ?? 10.0;
  const scene3Start = finalScenes.find((s) => s.id === 3)?.startSec ?? 19.0;
  const scene7Start = finalScenes.find((s) => s.id === 7)?.startSec ?? 62.0;
  const scene10Start = finalScenes.find((s) => s.id === 10)?.startSec ?? 83.0;

  const sfxEvents = [
    { file: sfx.glitchHit, atSec: 2.5 }, // Scene 1 frame 75 glitch freeze
    { file: sfx.sareeSweet, atSec: scene2Start + 4.0 }, // Scene 2 saree knot untie & sweet box
    { file: sfx.phonePing, atSec: scene3Start + 0.15 }, // Scene 3 Aunty smartphone ambush
    { file: sfx.pageTurn, atSec: scene7Start + 1.0 }, // Scene 7 3D book page turn
    { file: sfx.royalChime, atSec: scene10Start + 0.3 }, // Scene 10 grand family finale
  ];

  const masterInputs: string[] = ['-i', voicesMixPath, '-i', bedPath];
  const masterFilters: string[] = [];
  const masterLabels: string[] = ['[0:a]', '[1:a]'];

  sfxEvents.forEach((ev, idx) => {
    const inputIdx = idx + 2;
    masterInputs.push('-i', ev.file);
    const delayMs = Math.round(ev.atSec * 1000);
    masterFilters.push(`[${inputIdx}:a]adelay=${delayMs}|${delayMs},apad=whole_dur=${TOTAL_DURATION}[sfx${idx}]`);
    masterLabels.push(`[sfx${idx}]`);
  });

  masterFilters.push(
    `${masterLabels.join('')}amix=inputs=${masterLabels.length}:duration=first:normalize=0,alimiter=limit=0.95[master]`,
  );

  runCmd('ffmpeg', [
    '-y',
    ...masterInputs,
    '-filter_complex', masterFilters.join(';'),
    '-map', '[master]',
    '-t', `${TOTAL_DURATION.toFixed(2)}`,
    '-ar', '44100',
    '-ac', '2',
    '-c:a', 'libmp3lame',
    '-b:a', '192k',
    OUT_VOICEOVER_PATH,
  ]);

  // Verify exact duration with ffprobe
  const finalDuration = probeDurationSec(OUT_VOICEOVER_PATH);
  const probeSummary = runCmd('ffprobe', [
    '-v', 'error',
    '-show_entries', 'stream=codec_name,channels,sample_rate,bit_rate:format=duration,size',
    '-of', 'default=noprint_wrappers=1',
    OUT_VOICEOVER_PATH,
  ]);
  console.log('\n[Audio] Verified public/audio/voiceover.mp3 via ffprobe:');
  console.log(probeSummary);
  if (Math.abs(finalDuration - TOTAL_DURATION) > 0.1) {
    throw new Error(`Expected 90.00s voiceover.mp3, got ${finalDuration}s`);
  }

  // Write generated TypeScript manifest so Remotion & unit tests lock frame-for-frame to real audio
  const manifestContent = `// AUTO-GENERATED by scripts/generate-audio.ts — locked frame-for-frame to public/audio/voiceover.mp3
import type { SceneBoundary, SubtitleCue } from './timeline';

export const GENERATED_AUDIO_DURATION_SEC = ${finalDuration.toFixed(3)};
export const GENERATED_SILENCE_DROP = {
  startSec: ${silenceDropStart.toFixed(3)},
  endSec: ${silenceDropEnd.toFixed(3)},
  startFrame: ${Math.round(silenceDropStart * FPS)},
  endFrame: ${Math.round(silenceDropEnd * FPS)},
} as const;

export const GENERATED_SCENES: readonly SceneBoundary[] = ${JSON.stringify(finalScenes, null, 2)} as const;

export const GENERATED_CUES: readonly SubtitleCue[] = ${JSON.stringify(
    placedCues.map(({ wavPath: _wavPath, ...rest }) => rest),
    null,
    2,
  )} as const;
`;

  fs.writeFileSync(OUT_MANIFEST_PATH, manifestContent, 'utf-8');
  console.log(`\n[Audio] Wrote frame-locked manifest to ${OUT_MANIFEST_PATH}`);
  console.log(`[Audio] Total scenes: ${finalScenes.length}, Total cues: ${placedCues.length}, Frames: ${TOTAL_FRAMES}`);
}

main().catch((err) => {
  console.error('[Audio] FATAL ERROR:', err);
  process.exit(1);
});
