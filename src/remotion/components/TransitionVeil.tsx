import React from 'react';
import { interpolate } from 'remotion';

interface TransitionVeilProps {
  localFrame: number;
  durationInFrames: number;
  enterColor: string;
  exitColor: string;
  isFirstScene?: boolean;
  isLastScene?: boolean;
}

/**
 * Smooth 10-12 frame color-matched dissolve veil at every scene boundary
 * preventing abrupt 1-frame snaps.
 */
export const TransitionVeil: React.FC<TransitionVeilProps> = ({
  localFrame,
  durationInFrames,
  enterColor,
  exitColor,
  isFirstScene = false,
  isLastScene = false,
}) => {
  const fadeFrames = 11;

  const enterOpacity = isFirstScene
    ? 0
    : interpolate(localFrame, [0, fadeFrames], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });

  const exitOpacity = isLastScene
    ? 0
    : interpolate(
        localFrame,
        [durationInFrames - fadeFrames, durationInFrames],
        [0, 1],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        },
      );

  return (
    <>
      {enterOpacity > 0.001 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: enterColor,
            opacity: enterOpacity,
            pointerEvents: 'none',
            zIndex: 40,
          }}
        />
      )}
      {exitOpacity > 0.001 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: exitColor,
            opacity: exitOpacity,
            pointerEvents: 'none',
            zIndex: 40,
          }}
        />
      )}
    </>
  );
};
