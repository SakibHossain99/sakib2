export const FPS = 30;
export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;
export const TOTAL_FRAMES = 2700;
export const DURATION_SECONDS = 90;

export const SAFE_ZONE = {
  minX: 60,
  maxX: 940,
  minY: 170,
  maxY: 1560,
} as const;

export type SpeakerId = 'narrator' | 'sakib' | 'ruksana' | 'aunty' | 'nadim';

export interface SceneBoundary {
  id: number;
  slug: string;
  title: string;
  startSec: number;
  endSec: number;
  startFrame: number;
  endFrame: number;
  veilColor: string;
}

export interface SubtitleCue {
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
}

export interface TilingValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validates that scenes tile [0, TOTAL_FRAMES) continuously without gaps or overlaps.
 */
export function validateTimelineTiling(
  scenes: readonly SceneBoundary[],
  expectedTotalFrames: number = TOTAL_FRAMES,
): TilingValidationResult {
  const errors: string[] = [];
  if (scenes.length === 0) {
    return { valid: false, errors: ['Scene list is empty'] };
  }
  if (scenes[0].startFrame !== 0) {
    errors.push(`First scene must start at frame 0, got ${scenes[0].startFrame}`);
  }
  for (let i = 0; i < scenes.length; i++) {
    const sc = scenes[i];
    if (sc.endFrame <= sc.startFrame) {
      errors.push(`Scene ${sc.id} has non-positive duration (${sc.startFrame}..${sc.endFrame})`);
    }
    if (i > 0) {
      const prev = scenes[i - 1];
      if (sc.startFrame !== prev.endFrame) {
        errors.push(
          `Gap or overlap between scene ${prev.id} (end ${prev.endFrame}) and scene ${sc.id} (start ${sc.startFrame})`,
        );
      }
    }
  }
  const last = scenes[scenes.length - 1];
  if (last.endFrame !== expectedTotalFrames) {
    errors.push(`Last scene must end at frame ${expectedTotalFrames}, got ${last.endFrame}`);
  }
  return { valid: errors.length === 0, errors };
}

/**
 * Validates all subtitle cues are well-ordered, non-overlapping, and inside their owning scene.
 */
export function validateSubtitleCues(
  cues: readonly SubtitleCue[],
  scenes: readonly SceneBoundary[],
): TilingValidationResult {
  const errors: string[] = [];
  const sceneMap = new Map(scenes.map((s) => [s.id, s]));

  for (let i = 0; i < cues.length; i++) {
    const cue = cues[i];
    if (cue.endFrame <= cue.startFrame) {
      errors.push(`Cue ${cue.id} has invalid frame range ${cue.startFrame}..${cue.endFrame}`);
    }
    const owner = sceneMap.get(cue.sceneId);
    if (!owner) {
      errors.push(`Cue ${cue.id} references unknown scene ${cue.sceneId}`);
    } else if (cue.startFrame < owner.startFrame || cue.endFrame > owner.endFrame) {
      errors.push(
        `Cue ${cue.id} (${cue.startFrame}..${cue.endFrame}) escapes scene ${owner.id} (${owner.startFrame}..${owner.endFrame})`,
      );
    }
    if (i > 0 && cue.startFrame < cues[i - 1].endFrame) {
      errors.push(
        `Cue ${cue.id} (start ${cue.startFrame}) overlaps previous cue ${cues[i - 1].id} (end ${cues[i - 1].endFrame})`,
      );
    }
  }
  return { valid: errors.length === 0, errors };
}

/**
 * Strict SVG Arm Rotation Polarity Law:
 * - Left arm (x = -68): strictly >= 0 deg (clockwise LEFT/OUTWARD/UP)
 * - Right arm (x = +68): strictly <= 0 deg (counter-clockwise RIGHT/OUTWARD/UP)
 */
export function clampArmAngles(leftArmAngle: number, rightArmAngle: number): {
  left: number;
  right: number;
} {
  return {
    left: Math.max(0, Math.min(155, leftArmAngle)),
    right: Math.min(0, Math.max(-155, rightArmAngle)),
  };
}

export function isValidArmPolarity(leftArmAngle: number, rightArmAngle: number): boolean {
  return leftArmAngle >= 0 && leftArmAngle <= 155 && rightArmAngle <= 0 && rightArmAngle >= -155;
}

export function getActiveCueAtFrame(
  cues: readonly SubtitleCue[],
  frame: number,
): SubtitleCue | null {
  for (const cue of cues) {
    if (frame >= cue.startFrame && frame <= cue.endFrame) {
      return cue;
    }
  }
  return null;
}

export function isSpeakerTalkingAtFrame(
  cues: readonly SubtitleCue[],
  speaker: SpeakerId,
  frame: number,
): boolean {
  const active = getActiveCueAtFrame(cues, frame);
  return active !== null && active.speaker === speaker;
}

export function getLipSyncShape(frame: number, isTalking: boolean): 0 | 1 | 2 | 3 {
  if (!isTalking) return 0;
  return (Math.floor(frame / 4) % 4) as 0 | 1 | 2 | 3;
}

export function getBlinkScaleY(frame: number, period: number = 104, phaseOffset: number = 0): number {
  const t = ((frame + phaseOffset) % period + period) % period;
  if (t === 0 || t === 4) return 0.55;
  if (t === 1 || t === 3) return 0.2;
  if (t === 2) return 0.08;
  return 1;
}
