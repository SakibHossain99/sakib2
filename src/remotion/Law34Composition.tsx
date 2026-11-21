import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { loadFont as loadHindSiliguri } from '@remotion/google-fonts/HindSiliguri';
import { loadFont as loadPlayfairDisplay } from '@remotion/google-fonts/PlayfairDisplay';
import { GENERATED_CUES, GENERATED_SCENES } from '../lib/audioManifest.generated';
import { SubtitleBar } from './components/SubtitleBar';
import { TransitionVeil } from './components/TransitionVeil';
import { EditorialFrameOverlay } from './components/EditorialFrameOverlay';
import { Scene01ColdOpen } from './scenes/Scene01ColdOpen';
import { Scene02FlashbackKnot } from './scenes/Scene02FlashbackKnot';
import { Scene03AuntyAmbush } from './scenes/Scene03AuntyAmbush';
import { Scene04MidnightReveal } from './scenes/Scene04MidnightReveal';
import { Scene05NeuralCutaway } from './scenes/Scene05NeuralCutaway';
import { Scene06MirrorGraphic } from './scenes/Scene06MirrorGraphic';
import { Scene07BookQuote } from './scenes/Scene07BookQuote';
import { Scene08FiveYearsLater } from './scenes/Scene08FiveYearsLater';
import { Scene09ThreeRules } from './scenes/Scene09ThreeRules';
import { Scene10Finale } from './scenes/Scene10Finale';

const { fontFamily: bengaliFontFamily } = loadHindSiliguri('normal', {
  weights: ['500', '600', '700'],
  subsets: ['bengali', 'latin'],
});

const { fontFamily: playfairFontFamily } = loadPlayfairDisplay('italic', {
  weights: ['600'],
  subsets: ['latin'],
});

export const Law34Composition: React.FC = () => {
  const globalFrame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: '#0D131D' }}>
      {/* Master 90.00s Stereo Bengali Neural Voiceover + SFX + Ducked Piano Bed */}
      <Audio src={staticFile('audio/voiceover.mp3')} />

      {/* 10 Gapless Scenes locked frame-for-frame to real ffprobe audio timestamps */}
      {GENERATED_SCENES.map((scene, idx) => {
        const durationInFrames = scene.endFrame - scene.startFrame;
        const localFrame = globalFrame - scene.startFrame;
        const prevVeil = idx > 0 ? GENERATED_SCENES[idx - 1].veilColor : scene.veilColor;
        const nextVeil = idx < GENERATED_SCENES.length - 1 ? GENERATED_SCENES[idx + 1].veilColor : scene.veilColor;

        let sceneNode: React.ReactNode = null;
        switch (scene.id) {
          case 1:
            sceneNode = (
              <Scene01ColdOpen
                globalFrame={globalFrame}
                localFrame={localFrame}
                durationInFrames={durationInFrames}
                cues={GENERATED_CUES}
                fontFamily={bengaliFontFamily}
              />
            );
            break;
          case 2:
            sceneNode = (
              <Scene02FlashbackKnot
                globalFrame={globalFrame}
                localFrame={localFrame}
                durationInFrames={durationInFrames}
                cues={GENERATED_CUES}
                fontFamily={bengaliFontFamily}
              />
            );
            break;
          case 3:
            sceneNode = (
              <Scene03AuntyAmbush
                globalFrame={globalFrame}
                localFrame={localFrame}
                durationInFrames={durationInFrames}
                cues={GENERATED_CUES}
                fontFamily={bengaliFontFamily}
              />
            );
            break;
          case 4:
            sceneNode = (
              <Scene04MidnightReveal
                globalFrame={globalFrame}
                localFrame={localFrame}
                durationInFrames={durationInFrames}
                cues={GENERATED_CUES}
                fontFamily={bengaliFontFamily}
              />
            );
            break;
          case 5:
            sceneNode = (
              <Scene05NeuralCutaway
                globalFrame={globalFrame}
                localFrame={localFrame}
                durationInFrames={durationInFrames}
                cues={GENERATED_CUES}
                fontFamily={bengaliFontFamily}
              />
            );
            break;
          case 6:
            sceneNode = (
              <Scene06MirrorGraphic
                globalFrame={globalFrame}
                localFrame={localFrame}
                durationInFrames={durationInFrames}
                cues={GENERATED_CUES}
                fontFamily={bengaliFontFamily}
              />
            );
            break;
          case 7:
            sceneNode = (
              <Scene07BookQuote
                globalFrame={globalFrame}
                localFrame={localFrame}
                durationInFrames={durationInFrames}
                cues={GENERATED_CUES}
                fontFamily={bengaliFontFamily}
                serifFontFamily={playfairFontFamily}
              />
            );
            break;
          case 8:
            sceneNode = (
              <Scene08FiveYearsLater
                globalFrame={globalFrame}
                localFrame={localFrame}
                durationInFrames={durationInFrames}
                cues={GENERATED_CUES}
                fontFamily={bengaliFontFamily}
              />
            );
            break;
          case 9:
            sceneNode = (
              <Scene09ThreeRules
                globalFrame={globalFrame}
                localFrame={localFrame}
                durationInFrames={durationInFrames}
                cues={GENERATED_CUES}
                fontFamily={bengaliFontFamily}
              />
            );
            break;
          case 10:
          default:
            sceneNode = (
              <Scene10Finale
                globalFrame={globalFrame}
                localFrame={localFrame}
                durationInFrames={durationInFrames}
                cues={GENERATED_CUES}
                fontFamily={bengaliFontFamily}
              />
            );
            break;
        }

        return (
          <Sequence
            key={scene.id}
            from={scene.startFrame}
            durationInFrames={durationInFrames}
            name={`Scene-${String(scene.id).padStart(2, '0')}-${scene.slug}`}
          >
            <AbsoluteFill>
              {sceneNode}
              <EditorialFrameOverlay darkScene={[4, 5, 6, 7, 9].includes(scene.id)} />
              <TransitionVeil
                localFrame={localFrame}
                durationInFrames={durationInFrames}
                enterColor={prevVeil}
                exitColor={nextVeil}
                isFirstScene={idx === 0}
                isLastScene={idx === GENERATED_SCENES.length - 1}
              />
            </AbsoluteFill>
          </Sequence>
        );
      })}

      {/* Broadcast Obsidian-Glass Bengali SubtitleBar (strictly inside y: 1380..1546) */}
      <SubtitleBar cues={GENERATED_CUES} frame={globalFrame} fontFamily={bengaliFontFamily} />
    </AbsoluteFill>
  );
};
