import React from 'react';
import { interpolate, spring, useVideoConfig } from 'remotion';
import type { SubtitleCue } from '../../lib/timeline';

interface SceneProps {
  globalFrame: number;
  localFrame: number;
  durationInFrames: number;
  cues: readonly SubtitleCue[];
  fontFamily: string;
}

export const Scene05NeuralCutaway: React.FC<SceneProps> = ({
  localFrame,
  durationInFrames,
  fontFamily,
}) => {
  const { fps } = useVideoConfig();

  const titlePop = spring({
    frame: localFrame,
    fps,
    config: { damping: 16, stiffness: 185 },
  });

  // Mind rewiring progress: breaking crimson shame chains -> forging golden royal crown
  const shiftProgress = interpolate(localFrame, [28, Math.round(durationInFrames * 0.65)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const orbitY1 = Math.sin(localFrame * 0.08) * 8;
  const orbitY2 = Math.cos(localFrame * 0.08) * 8;
  const ink = '#191412';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        fontFamily,
        backgroundColor: '#131D28',
      }}
    >
      {/* Hand-Inked Editorial Anatomical Blueprint (Crisp Ink Contours, Hatching, Drafting Ticks) */}
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        {/* Archival Drafting Blueprint Grid */}
        <g stroke="#2B4257" strokeWidth={1.2} opacity={0.55}>
          {[240, 360, 480, 600, 720, 840, 960, 1080, 1200, 1320].map((y) => (
            <line key={`h_${y}`} x1={60} y1={y} x2={940} y2={y} />
          ))}
          {[120, 240, 360, 480, 600, 720, 840].map((x) => (
            <line key={`v_${x}`} x1={x} y1={240} x2={x} y2={1320} />
          ))}
        </g>

        {/* Drafting Blueprint Compass Circle behind head */}
        <g transform="translate(320, 840)" opacity={0.35}>
          <circle cx={0} cy={0} r={248} fill="none" stroke="#D4AF37" strokeWidth={1.6} strokeDasharray="8 6" />
          <circle cx={0} cy={0} r={212} fill="none" stroke="#5EA3B8" strokeWidth={1.2} />
          <line x1={-268} y1={0} x2={268} y2={0} stroke="#5EA3B8" strokeWidth={1} />
          <line x1={0} y1={-268} x2={0} y2={268} stroke="#5EA3B8" strokeWidth={1} />
        </g>

        {/* SAKIB EDITORIAL SIDE-PROFILE HEAD centered at (x: 325, y: 885) facing RIGHT */}
        <g transform="translate(325, 885)">
          {/* Formal Navy-Emerald Shirt Shoulders with Crisp Ink Lines */}
          <path
            d="M -165 275 C -150 176 -88 152 -28 152 L 68 152 C 118 152 156 186 168 275 L 168 430 L -165 430 Z"
            fill="#1E4D5C"
            stroke={ink}
            strokeWidth={3.2}
          />
          <path d="M 10 152 L 168 275 L 168 430 L 10 430 Z" fill="#133540" opacity={0.55} />
          <path d="M -48 152 L 34 214 L 70 152" fill="none" stroke="#D4AF37" strokeWidth={4.5} />

          {/* Neck with Jaw Cast Shadow */}
          <path d="M -64 56 L 40 56 L 44 166 C 12 182 -40 182 -70 162 Z" fill="#D59A73" stroke={ink} strokeWidth={3} />
          <path d="M -64 56 L 40 56 L 41 112 Q -10 132 -66 108 Z" fill="#B27450" />

          {/* Hand-Inked Side-Profile Head Silhouette (Two-tone Cel Shaded) */}
          <path
            d="M -130 -12
               C -142 -154 -58 -236 44 -230
               C 116 -226 156 -162 160 -92
               L 190 -36
               C 195 -24 188 -14 174 -12
               L 162 -8
               L 168 16
               L 158 26
               L 164 42
               C 162 66 140 84 104 88
               L 28 94
               C -46 94 -120 50 -130 -12 Z"
            fill="#DDA27B"
            stroke={ink}
            strokeWidth={3.2}
            strokeLinejoin="round"
          />
          {/* Cel shadow along lower jaw & cheekbone */}
          <path
            d="M -112 24 C -68 78 24 94 104 86 C 138 82 158 64 162 44 C 132 64 52 72 -18 54 C -68 42 -96 28 -112 24 Z"
            fill="#BD7E58"
            opacity={0.65}
          />

          {/* Side-profile Hair with Layered Strands */}
          <path
            d="M -132 -8
               C -156 -142 -88 -246 44 -242
               C 104 -240 148 -206 162 -156
               C 118 -182 50 -196 -28 -180
               C -96 -164 -114 -92 -102 4
               L -124 12 Z"
            fill="#1A2029"
            stroke={ink}
            strokeWidth={3}
          />
          <path d="M -86 -194 Q 6 -232 112 -196" fill="none" stroke="#425166" strokeWidth={5} strokeLinecap="round" opacity={0.75} />

          {/* Detailed Side-Profile Eye with Eyelid Crease & Focused Gaze */}
          <g transform="translate(122, -74)">
            <path d="M -18 -15 Q 2 -23 24 -13" fill="none" stroke="#1A2029" strokeWidth={4.5} strokeLinecap="round" />
            <path d="M -12 -6 Q 4 -12 18 -4" fill="none" stroke="#9B603E" strokeWidth={2} strokeLinecap="round" />
            <path d="M -10 4 Q 6 -6 20 4 Q 6 13 -10 4 Z" fill="#FAF6EE" stroke={ink} strokeWidth={2.2} />
            <circle cx={11} cy={4} r={5.4} fill="#2B1C14" />
            <circle cx={12} cy={4} r={2.8} fill="#0B0807" />
            <circle cx={9.5} cy={2} r={1.8} fill="#FFFFFF" />
          </g>

          {/* Confident Side-Profile Lips & Nostril Mark */}
          <path d="M 164 -20 Q 156 -16 154 -22" fill="none" stroke={ink} strokeWidth={2.2} strokeLinecap="round" />
          <path d="M 162 20 Q 144 24 128 18" fill="none" stroke={ink} strokeWidth={2.8} strokeLinecap="round" />

          {/* Detailed Ear positioned cleanly BELOW the Cranial Cutaway */}
          <g transform="translate(-44, 6)">
            <ellipse cx={0} cy={0} rx={21} ry={33} fill="#D59A73" stroke={ink} strokeWidth={2.8} />
            <path d="M -4 -16 C 8 -14 10 12 -4 16" fill="none" stroke="#8C5234" strokeWidth={2.6} strokeLinecap="round" />
          </g>

          {/* HAND-INKED CRANIAL CUTAWAY PLATE — STRICTLY ABOVE EAR (y: -210..-66) */}
          <g transform="translate(-4, -138)">
            <ellipse
              cx={0}
              cy={0}
              rx={106}
              ry={72}
              fill="#0E1B26"
              stroke="#D4AF37"
              strokeWidth={4}
            />
            <ellipse
              cx={0}
              cy={0}
              rx={99}
              ry={65}
              fill="none"
              stroke="#5EA3B8"
              strokeWidth={1.6}
              strokeDasharray="6 5"
            />

            {/* Hand-Inked Anatomical Brain Cortex with Detailed Gyri/Sulci */}
            <path
              d="M -76 14 C -86 -24 -52 -54 2 -52 C 52 -50 84 -24 80 14 C 76 40 48 50 12 44 C -22 52 -66 42 -76 14 Z"
              fill="#19424F"
              stroke="#F3D87A"
              strokeWidth={2.4}
            />
            <g fill="none" stroke="#7CC8D4" strokeWidth={2.8} strokeLinecap="round" opacity={0.85}>
              <path d="M -56 -12 C -38 -32 -12 -32 -2 -10 C 8 10 34 8 48 -14" />
              <path d="M -44 18 C -24 2 2 8 16 26 C 32 40 58 28 66 8" />
              <path d="M -22 -40 C -10 -24 18 -26 36 -36" />
              <path d="M -62 6 C -48 24 -22 34 -4 20" />
            </g>

            {/* Rewiring Golden Neural Sparks */}
            {[
              { x: -46, y: -14, c: '#FDE047' },
              { x: -6, y: -24, c: '#2EC4B6' },
              { x: 38, y: -12, c: '#FDE047' },
              { x: 14, y: 18, c: '#38BDF8' },
              { x: -28, y: 18, c: '#F59E0B' },
            ].map((node, idx) => {
              const r = 4.5 + Math.sin(localFrame * 0.25 + idx * 1.4) * 2.2;
              return (
                <g key={idx}>
                  <circle cx={node.x} cy={node.y} r={r + 4} fill="none" stroke={node.c} strokeWidth={1.6} opacity={0.65} />
                  <circle cx={node.x} cy={node.y} r={r} fill={node.c} stroke={ink} strokeWidth={1.2} />
                </g>
              );
            })}
            <path
              d="M -46 -14 L -6 -24 L 38 -12 L 14 18 L -28 18 Z"
              fill="none"
              stroke="#FDE047"
              strokeWidth={2.2}
              opacity={0.45 + shiftProgress * 0.5}
            />
          </g>

          {/* Crisp Blueprint Callout Leader Lines to Memory Shards (strictly clearing nose at x=+190) */}
          <polyline
            points="98,-182 178,-260 236,-260"
            fill="none"
            stroke="#E05A47"
            strokeWidth={3}
            strokeDasharray="6 5"
            opacity={0.9 - shiftProgress * 0.45}
          />
          <polyline
            points="102,-120 184,-68 238,-68"
            fill="none"
            stroke="#D4AF37"
            strokeWidth={3.5}
            opacity={0.45 + shiftProgress * 0.55}
          />
        </g>
      </svg>

      {/* Top Editorial Title Plaque inside Safe Zone (x: 70..930, y: 192..300) */}
      <div
        style={{
          position: 'absolute',
          left: 70,
          top: 192,
          width: 860,
          textAlign: 'center',
          transform: `translateY(${(1 - titlePop) * -20}px)`,
          opacity: titlePop,
          zIndex: 20,
        }}
      >
        <div
          style={{
            display: 'inline-block',
            padding: '13px 34px',
            borderRadius: 14,
            backgroundColor: '#104138',
            border: '3px solid #0B0E12',
            outline: '2.5px solid #D4AF37',
            outlineOffset: -6,
            boxShadow: '6px 7px 0 rgba(7, 9, 13, 0.7)',
            color: '#FDE047',
            fontSize: 44,
            fontWeight: 700,
            letterSpacing: '0.02em',
          }}
        >
          LAW 34: রাজার মতো চলো
        </div>
      </div>

      {/* Crimson Shard with Breaking Iron Chain Emblem — strictly inside x: 558..920 */}
      <div
        style={{
          position: 'absolute',
          left: 558,
          top: 520 + orbitY1,
          width: 362,
          padding: '16px 20px',
          borderRadius: 14,
          backgroundColor: '#5B1A1C',
          border: '3px solid #140B0C',
          outline: '2px solid #E05A47',
          outlineOffset: -5,
          boxShadow: '5px 6px 0 rgba(8, 6, 8, 0.65)',
          color: '#FEE2E2',
          fontSize: 27,
          fontWeight: 700,
          opacity: 1 - shiftProgress * 0.48,
          transform: `scale(${1 - shiftProgress * 0.06})`,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          zIndex: 22,
        }}
      >
        {/* Hand-inked breaking chain SVG */}
        <svg viewBox="0 0 48 48" width={42} height={42} style={{ flexShrink: 0 }}>
          <rect x={4} y={16} width={18} height={14} rx={6} fill="none" stroke="#FCA5A5" strokeWidth={4} transform="rotate(-18 13 23)" />
          <rect x={26} y={18} width={18} height={14} rx={6} fill="none" stroke="#FCA5A5" strokeWidth={4} transform="rotate(18 35 25)" />
          <path d="M 22 6 L 26 16 M 24 32 L 28 42" stroke="#FDE047" strokeWidth={3} strokeLinecap="round" />
        </svg>
        <span>✕ রেজাল্টের লজ্জা ও মিথ্যা</span>
      </div>

      {/* Emerald-Gold Shard with Forged Royal Crown Emblem — strictly inside x: 564..920 */}
      <div
        style={{
          position: 'absolute',
          left: 564,
          top: 782 + orbitY2,
          width: 356,
          padding: '18px 20px',
          borderRadius: 14,
          backgroundColor: '#104138',
          border: '3px solid #0B1211',
          outline: '2.5px solid #D4AF37',
          outlineOffset: -5,
          boxShadow: '6px 7px 0 rgba(7, 10, 12, 0.72)',
          color: '#FEF9C3',
          fontSize: 27,
          fontWeight: 700,
          transform: `scale(${0.95 + shiftProgress * 0.07})`,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          zIndex: 24,
        }}
      >
        {/* Hand-inked royal crown emblem SVG */}
        <svg viewBox="0 0 52 44" width={44} height={38} style={{ flexShrink: 0 }}>
          <path d="M 6 34 L 4 12 L 18 22 L 26 6 L 34 22 L 48 12 L 46 34 Z" fill="#F4C94E" stroke="#1A1410" strokeWidth={2.5} strokeLinejoin="round" />
          <rect x={6} y={34} width={40} height={6} rx={2} fill="#C49228" stroke="#1A1410" strokeWidth={2} />
        </svg>
        <span>✓ রাজার মতো আত্মসম্মান</span>
      </div>
    </div>
  );
};
