import React from 'react';
import { Composition } from 'remotion';
import { FPS, TOTAL_FRAMES, VIDEO_HEIGHT, VIDEO_WIDTH } from '../lib/timeline';
import { Law34Composition } from './Law34Composition';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Law34BengaliShort"
      component={Law34Composition}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={VIDEO_WIDTH}
      height={VIDEO_HEIGHT}
    />
  );
};
