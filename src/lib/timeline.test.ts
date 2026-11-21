import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DURATION_SECONDS,
  FPS,
  SAFE_ZONE,
  TOTAL_FRAMES,
  clampArmAngles,
  getActiveCueAtFrame,
  getBlinkScaleY,
  getLipSyncShape,
  isSpeakerTalkingAtFrame,
  isValidArmPolarity,
  validateSubtitleCues,
  validateTimelineTiling,
} from './timeline';
import { GENERATED_CUES, GENERATED_SCENES } from './audioManifest.generated';

test('generated 10-scene timeline tiles 0..2700 gaplessly with zero overlaps', () => {
  assert.equal(GENERATED_SCENES.length, 10);
  assert.equal(FPS * DURATION_SECONDS, TOTAL_FRAMES);
  const res = validateTimelineTiling(GENERATED_SCENES, TOTAL_FRAMES);
  assert.equal(res.valid, true, `Timeline tiling errors: ${res.errors.join('; ')}`);
});

test('all 16 generated Bengali subtitle cues stay strictly inside their scenes without overlap', () => {
  assert.equal(GENERATED_CUES.length, 16);
  const res = validateSubtitleCues(GENERATED_CUES, GENERATED_SCENES);
  assert.equal(res.valid, true, `Cue validation errors: ${res.errors.join('; ')}`);
});

test('lip-sync activates ONLY during the exact spoken frames of each speaker', () => {
  const sakibCue = GENERATED_CUES.find((c) => c.id === 's01_l01');
  assert.ok(sakibCue, 's01_l01 cue must exist');

  assert.equal(isSpeakerTalkingAtFrame(GENERATED_CUES, 'sakib', sakibCue.startFrame + 2), true);
  assert.equal(isSpeakerTalkingAtFrame(GENERATED_CUES, 'ruksana', sakibCue.startFrame + 2), false);
  assert.equal(getActiveCueAtFrame(GENERATED_CUES, sakibCue.startFrame + 2)?.speakerName, 'সাকিব');

  // 4-shape lip-sync cycles 0..3 every 4 frames when talking, stays 0 when silent
  assert.equal(getLipSyncShape(10, false), 0);
  assert.equal(getLipSyncShape(0, true), 0);
  assert.equal(getLipSyncShape(4, true), 1);
  assert.equal(getLipSyncShape(8, true), 2);
  assert.equal(getLipSyncShape(12, true), 3);
});

test('SVG Arm Rotation Polarity Law enforces leftArm >= 0 and rightArm <= 0', () => {
  assert.equal(isValidArmPolarity(45, -60), true);
  assert.equal(isValidArmPolarity(-15, -60), false);
  assert.equal(isValidArmPolarity(45, 25), false);

  const clamped = clampArmAngles(-30, 45);
  assert.equal(clamped.left, 0);
  assert.equal(clamped.right, 0);

  const clampedMax = clampArmAngles(210, -210);
  assert.equal(clampedMax.left, 155);
  assert.equal(clampedMax.right, -155);
});

test('automatic blink cycle closes briefly every 90-120 frames and stays open otherwise', () => {
  assert.equal(getBlinkScaleY(2, 100, 0), 0.08);
  assert.equal(getBlinkScaleY(50, 100, 0), 1);
});

test('YouTube Shorts safe zone boundaries match specification', () => {
  assert.deepEqual(SAFE_ZONE, { minX: 60, maxX: 940, minY: 170, maxY: 1560 });
});
