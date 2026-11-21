import React from 'react';
import { spring, useVideoConfig } from 'remotion';
import type { SubtitleCue } from '../../lib/timeline';

interface SceneProps {
  globalFrame: number;
  localFrame: number;
  durationInFrames: number;
  cues: readonly SubtitleCue[];
  fontFamily: string;
}

const RULES = [
  {
    num: '১',
    text: '✓ ১. মিথ্যা বলো না — মিথ্যা মানে নিজেকে ছোট ভাবা',
    delay: 8,
    icon: 'mask',
  },
  {
    num: '২',
    text: '✓ ২. মাথা উঁচু রাখো — কৈফিয়ত দিও না',
    delay: 36,
    icon: 'crown',
  },
  {
    num: '৩',
    text: '✓ ৩. শাসন ঘরে, সম্মান সবার সামনে',
    delay: 68,
    icon: 'shield',
  },
] as const;

function renderRuleEmblem(kind: 'mask' | 'crown' | 'shield'): React.ReactNode {
  const ink = '#191412';
  if (kind === 'mask') {
    return (
      <svg viewBox="0 0 64 64" width={62} height={62} style={{ flexShrink: 0 }}>
        <rect x={4} y={4} width={56} height={56} rx={12} fill="#F4C94E" stroke={ink} strokeWidth={3} />
        {/* Cracked fake mask splitting open to reveal honest light */}
        <path d="M 16 20 Q 32 14 48 20 L 44 42 Q 32 50 20 42 Z" fill="#FAF3E3" stroke={ink} strokeWidth={2.4} />
        <path d="M 33 16 L 28 30 L 35 36 L 30 47" fill="none" stroke="#B91C1C" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={24} cy={28} r={2.8} fill={ink} />
        <circle cx={40} cy={28} r={2.8} fill={ink} />
      </svg>
    );
  }
  if (kind === 'crown') {
    return (
      <svg viewBox="0 0 64 64" width={62} height={62} style={{ flexShrink: 0 }}>
        <rect x={4} y={4} width={56} height={56} rx={12} fill="#F4C94E" stroke={ink} strokeWidth={3} />
        {/* Upright royal crown emblem */}
        <path d="M 14 42 L 12 22 L 24 32 L 32 16 L 40 32 L 52 22 L 50 42 Z" fill="#104138" stroke={ink} strokeWidth={2.5} strokeLinejoin="round" />
        <rect x={14} y={42} width={36} height={7} rx={2} fill="#9E2A2B" stroke={ink} strokeWidth={2.2} />
        <circle cx={32} cy={32} r={3.5} fill="#FDE047" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 64" width={62} height={62} style={{ flexShrink: 0 }}>
      <rect x={4} y={4} width={56} height={56} rx={12} fill="#F4C94E" stroke={ink} strokeWidth={3} />
      {/* Sheltering home roof + public honor star emblem */}
      <path d="M 12 32 L 32 14 L 52 32" fill="none" stroke={ink} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 18 30 L 18 48 L 46 48 L 46 30" fill="#104138" stroke={ink} strokeWidth={2.5} />
      <polygon points="32,26 35,34 43,34 36.5,39 39,47 32,42 25,47 27.5,39 21,34 29,34" fill="#FDE047" stroke={ink} strokeWidth={1.6} />
    </svg>
  );
}

export const Scene09ThreeRules: React.FC<SceneProps> = ({
  localFrame,
  fontFamily,
}) => {
  const { fps } = useVideoConfig();
  const headerPop = spring({ frame: localFrame, fps, config: { damping: 16, stiffness: 185 } });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        fontFamily,
        backgroundColor: '#0E2925',
      }}
    >
      {/* Editorial Drafting Decree Frame */}
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        {/* Archival blueprint lines */}
        <g stroke="#1C4640" strokeWidth={1.2} opacity={0.6}>
          {[240, 420, 600, 780, 960, 1140, 1320].map((y) => (
            <line key={y} x1={48} y1={y} x2={952} y2={y} />
          ))}
        </g>
        <rect
          x={48}
          y={162}
          width={904}
          height={1185}
          rx={18}
          fill="none"
          stroke="#D4AF37"
          strokeWidth={2.5}
          opacity={0.42}
        />
        <rect
          x={58}
          y={172}
          width={884}
          height={1165}
          rx={14}
          fill="none"
          stroke="#D4AF37"
          strokeWidth={1.2}
          strokeDasharray="8 6"
          opacity={0.32}
        />
      </svg>

      {/* Header inside Safe Zone (x: 68..932, y: 195..310) */}
      <div
        style={{
          position: 'absolute',
          left: 68,
          top: 195,
          width: 864,
          textAlign: 'center',
          transform: `translateY(${(1 - headerPop) * -20}px)`,
          opacity: headerPop,
          zIndex: 20,
        }}
      >
        <div
          style={{
            color: '#E5C04B',
            fontSize: 25,
            fontWeight: 700,
            letterSpacing: '0.08em',
            marginBottom: 8,
          }}
        >
          LAW 34 · সেভ করে রাখুন
        </div>
        <div
          style={{
            color: '#FFFBEB',
            fontSize: 46,
            fontWeight: 700,
            lineHeight: 1.2,
          }}
        >
          রাজার মতো বাঁচার ৩টি নিয়ম
        </div>
      </div>

      {/* Sequential Editorial Decree Cards with Bespoke Hand-Inked Emblems (x: 72..928, y: 372..1235) */}
      <div
        style={{
          position: 'absolute',
          left: 72,
          top: 374,
          width: 856,
          display: 'flex',
          flexDirection: 'column',
          gap: 30,
          zIndex: 22,
        }}
      >
        {RULES.map((rule) => {
          const pop = spring({
            frame: Math.max(0, localFrame - rule.delay),
            fps,
            config: { damping: 14, stiffness: 175 },
          });

          return (
            <div
              key={rule.num}
              style={{
                padding: '30px 28px',
                borderRadius: 16,
                backgroundColor: '#133C36',
                border: '3px solid #0B1412',
                outline: '2.5px solid #D4AF37',
                outlineOffset: -6,
                boxShadow: '7px 8px 0 rgba(7, 12, 11, 0.72)',
                transform: `translateX(${(1 - pop) * -44}px)`,
                opacity: pop,
                display: 'flex',
                alignItems: 'center',
                gap: 22,
              }}
            >
              {renderRuleEmblem(rule.icon)}
              <div
                style={{
                  color: '#FFFBEB',
                  fontSize: 34,
                  fontWeight: 700,
                  lineHeight: 1.35,
                }}
              >
                {rule.text}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
