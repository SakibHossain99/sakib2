import React from 'react';
import { spring, useVideoConfig } from 'remotion';
import type { SubtitleCue } from '../../lib/timeline';
import { getActiveCueAtFrame } from '../../lib/timeline';

interface SubtitleBarProps {
  cues: readonly SubtitleCue[];
  frame: number;
  fontFamily: string;
}

/**
 * Handcrafted editorial 2D SubtitleBar positioned strictly inside the
 * YouTube Shorts Safe Zone (x: 60..940, y: 1380..1546) with crisp ink borders
 * and flat editorial offset shadow (zero glossy 3D plastic).
 */
export const SubtitleBar: React.FC<SubtitleBarProps> = ({ cues, frame, fontFamily }) => {
  const { fps } = useVideoConfig();
  const activeCue = getActiveCueAtFrame(cues, frame);

  if (!activeCue) {
    return null;
  }

  const localFrame = Math.max(0, frame - activeCue.startFrame);
  const pop = spring({
    frame: localFrame,
    fps,
    config: { damping: 17, stiffness: 240, mass: 0.65 },
  });

  const translateY = (1 - pop) * 14;
  const opacity = Math.min(1, localFrame / 3);

  const charCount = activeCue.text.length;
  const fontSize = charCount > 110 ? 29 : charCount > 78 ? 33 : 37;

  return (
    <div
      style={{
        position: 'absolute',
        left: 66,
        top: 1382,
        width: 868,
        zIndex: 50,
        opacity,
        transform: `translateY(${translateY}px)`,
        transformOrigin: 'center bottom',
        fontFamily,
      }}
    >
      {/* Crisp editorial speaker ribbon tag anchored on top-left edge */}
      <div
        style={{
          position: 'absolute',
          top: -21,
          left: 22,
          zIndex: 2,
          padding: '4px 18px',
          borderRadius: 8,
          backgroundColor: activeCue.accentColor,
          color: '#14110E',
          fontWeight: 700,
          fontSize: 22,
          letterSpacing: '0.01em',
          border: '2.5px solid #1E1713',
          boxShadow: '3px 3px 0 #14100D',
        }}
      >
        {activeCue.speakerName}
      </div>

      {/* Matte charcoal editorial card with crisp ink border & flat offset shadow */}
      <div
        style={{
          position: 'relative',
          padding: '25px 28px 19px 28px',
          borderRadius: 14,
          backgroundColor: 'rgba(20, 22, 26, 0.94)',
          border: '2.5px solid #2C2723',
          borderLeft: `6px solid ${activeCue.accentColor}`,
          boxShadow: '6px 7px 0 rgba(10, 10, 12, 0.68)',
          color: '#FAF6EE',
          fontSize,
          fontWeight: 600,
          lineHeight: 1.32,
          textAlign: 'left',
        }}
      >
        {activeCue.text}
      </div>
    </div>
  );
};
