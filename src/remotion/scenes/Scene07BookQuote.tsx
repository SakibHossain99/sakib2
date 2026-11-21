import React from 'react';
import { interpolate, spring, useVideoConfig } from 'remotion';
import type { SubtitleCue } from '../../lib/timeline';

interface SceneProps {
  globalFrame: number;
  localFrame: number;
  durationInFrames: number;
  cues: readonly SubtitleCue[];
  fontFamily: string;
  serifFontFamily: string;
}

export const Scene07BookQuote: React.FC<SceneProps> = ({
  localFrame,
  cues: _cues,
  fontFamily,
  serifFontFamily,
}) => {
  const { fps } = useVideoConfig();

  const bookOpen = spring({
    frame: localFrame,
    fps,
    config: { damping: 16, stiffness: 125 },
  });

  // Turning parchment page animates across frames 14..54 and fades opacity 1 -> 0 over final 10 frames (44..54)
  const pageTurnProgress = interpolate(localFrame, [14, 54], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const turningPageOpacity = interpolate(localFrame, [44, 54], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const hlLine1 = interpolate(localFrame, [48, 86], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const hlLine2 = interpolate(localFrame, [82, 124], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const sealSpring = spring({
    frame: Math.max(0, localFrame - 64),
    fps,
    config: { damping: 15, stiffness: 170 },
  });

  const ink = '#1A130E';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        fontFamily,
        backgroundColor: '#1E1510',
      }}
    >
      {/* Editorial 2D Scholar's Dark-Wood Desk, Vintage Banker's Lamp, Inkwell & Quill */}
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <radialGradient id="s7_lampGlow" cx="50%" cy="18%" r="64%">
            <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.32" />
            <stop offset="52%" stopColor="#D97706" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#1E1510" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Rich Flat-Editorial Wood Desk Planks with Crisp Ink Grain */}
        <rect x={0} y={0} width={1080} height={1920} fill="#261A13" />
        {[220, 440, 660, 880, 1100, 1320, 1540].map((y) => (
          <line key={y} x1={0} y1={y} x2={1080} y2={y} stroke="#170F0A" strokeWidth={3} opacity={0.65} />
        ))}
        {/* Desk leather blotter mat underneath the book */}
        <rect x={44} y={248} width={912} height={736} rx={16} fill="#142C27" stroke={ink} strokeWidth={4} />
        <rect x={54} y={258} width={892} height={716} rx={12} fill="none" stroke="#C59D44" strokeWidth={2} strokeDasharray="8 6" opacity={0.55} />

        {/* Vintage Emerald Banker's Lamp Hood at Top Center */}
        <g transform="translate(500, 128)">
          <rect x={-16} y={-128} width={32} height={80} fill="#B48A30" stroke={ink} strokeWidth={3} />
          <path d="M -98 10 Q -84 -50 0 -50 Q 84 -50 98 10 Z" fill="#135043" stroke={ink} strokeWidth={3.5} />
          <rect x={-102} y={8} width={204} height={12} rx={4} fill="#D4AF37" stroke={ink} strokeWidth={2.5} />
        </g>

        {/* Soft Editorial Lamp Light Cone */}
        <polygon points="402,148 598,148 980,1180 20,1180" fill="url(#s7_lampGlow)" />

        {/* Hand-Inked Glass Inkwell & Brass Feather Quill Pen resting at bottom-right of blotter */}
        <g transform="translate(918, 1282)">
          <rect x={-28} y={-24} width={56} height={46} rx={8} fill="#1E293B" stroke={ink} strokeWidth={2.8} />
          <rect x={-18} y={-36} width={36} height={14} rx={3} fill="#D4AF37" stroke={ink} strokeWidth={2.4} />
          <path d="M 4 -34 Q 36 -96 76 -124 Q 54 -72 16 -34 Z" fill="#FAF3E3" stroke={ink} strokeWidth={2.4} />
          <line x1={4} y1={-34} x2={68} y2={-114} stroke="#B48A30" strokeWidth={2} />
        </g>

        {/* Floating warm dust specks */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const dx = 110 + ((i * 105 + localFrame * 0.6) % 780);
          const dy = 220 + ((i * 124 - localFrame * 0.4 + 980) % 920);
          return <circle key={i} cx={dx} cy={dy} r={2.4 + (i % 2)} fill="#FDE68A" opacity={0.38} />;
        })}
      </svg>

      {/* Book Title Kicker inside Safe Zone (y: 192..246) */}
      <div
        style={{
          position: 'absolute',
          left: 72,
          top: 192,
          width: 856,
          textAlign: 'center',
          color: '#E5C46B',
          fontSize: 25,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          zIndex: 20,
        }}
      >
        THE 48 LAWS OF POWER — ROBERT GREENE
      </div>

      {/* Antique Emerald-Gold Hardcover Book (strictly inside x: 68..932, y: 268..960) */}
      <div
        style={{
          position: 'absolute',
          left: 68,
          top: 268,
          width: 864,
          height: 690,
          perspective: 1400,
          zIndex: 22,
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: 16,
            backgroundColor: '#0F3D36',
            border: '4px solid #140E0A',
            outline: '3px solid #D4AF37',
            outlineOffset: -8,
            boxShadow: '12px 16px 0 rgba(10, 7, 5, 0.72)',
            padding: 18,
            transform: `rotateX(${interpolate(bookOpen, [0, 1], [16, 4])}deg) scale(${0.93 + bookOpen * 0.07})`,
            display: 'flex',
            gap: 0,
          }}
        >
          {/* Left Page: Engraved Law 34 Chapter Plate */}
          <div
            style={{
              flex: '0 0 36%',
              height: '100%',
              backgroundColor: '#F3E7D2',
              borderRadius: '8px 0 0 8px',
              padding: '38px 24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderRight: '3px solid #BDA98A',
              boxShadow: 'inset -12px 0 18px rgba(45, 30, 16, 0.14)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: '50%',
                border: '3px solid #241A15',
                outline: '3px solid #D4AF37',
                outlineOffset: -6,
                backgroundColor: '#0F3D36',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FDE047',
                fontSize: 40,
                fontWeight: 700,
                marginBottom: 22,
              }}
            >
              34
            </div>
            <div
              style={{
                fontFamily: serifFontFamily,
                fontStyle: 'italic',
                fontWeight: 600,
                fontSize: 30,
                color: '#241A15',
                lineHeight: 1.25,
                marginBottom: 14,
              }}
            >
              Law 34
            </div>
            <div style={{ width: 64, height: 2.5, backgroundColor: '#B48A30', marginBottom: 14 }} />
            <div style={{ color: '#4B3728', fontSize: 22, fontWeight: 700, lineHeight: 1.35 }}>
              Be Royal in Your Own Fashion
            </div>
          </div>

          {/* Right Page: Exact Playfair Display 600 Italic English Quote + Warm Highlighter */}
          <div
            style={{
              flex: 1,
              height: '100%',
              backgroundColor: '#F8F0E0',
              borderRadius: '0 8px 8px 0',
              padding: '44px 36px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              position: 'relative',
              boxShadow: 'inset 12px 0 18px rgba(45, 30, 16, 0.12)',
            }}
          >
            <div
              style={{
                fontFamily: serifFontFamily,
                fontStyle: 'italic',
                fontWeight: 600,
                fontSize: 38,
                lineHeight: 1.48,
                color: '#1C140F',
                position: 'relative',
              }}
            >
              <div style={{ position: 'relative', marginBottom: 16 }}>
                <span
                  style={{
                    backgroundImage: 'linear-gradient(120deg, rgba(242, 198, 72, 0.56) 0%, rgba(242, 198, 72, 0.56) 100%)',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: `${hlLine1}% 44%`,
                    backgroundPosition: '0 82%',
                    padding: '2px 4px',
                  }}
                >
                  “The way you carry yourself will often determine how you are treated.
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <span
                  style={{
                    backgroundImage: 'linear-gradient(120deg, rgba(212, 175, 55, 0.68) 0%, rgba(250, 204, 21, 0.68) 100%)',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: `${hlLine2}% 48%`,
                    backgroundPosition: '0 82%',
                    padding: '2px 4px',
                  }}
                >
                  Act like a king to be treated like one.”
                </span>
              </div>
            </div>
            <div
              style={{
                marginTop: 28,
                color: '#785A32',
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: '0.06em',
              }}
            >
              — ROBERT GREENE
            </div>
          </div>

          {/* 3D Turning Parchment Page (fades opacity 1 -> 0 cleanly over final 10 frames) */}
          {turningPageOpacity > 0.01 && (
            <div
              style={{
                position: 'absolute',
                top: 18,
                left: 'calc(36% + 12px)',
                width: 'calc(64% - 30px)',
                height: 'calc(100% - 36px)',
                backgroundColor: '#F3E7D2',
                border: '1.5px solid #BDA98A',
                borderRadius: '0 8px 8px 0',
                transformOrigin: 'left center',
                transform: `rotateY(${interpolate(pageTurnProgress, [0, 1], [0, -172])}deg)`,
                opacity: turningPageOpacity,
                pointerEvents: 'none',
              }}
            />
          )}
        </div>
      </div>

      {/* Editorial Embossed Rule Seal (★ মূল নিয়ম) strictly inside y: 1020..1260 */}
      <div
        style={{
          position: 'absolute',
          left: 76,
          top: 1020,
          width: 848,
          padding: '22px 32px',
          borderRadius: 14,
          backgroundColor: '#104138',
          border: '3px solid #140E0A',
          outline: '3px solid #D4AF37',
          outlineOffset: -7,
          boxShadow: '7px 8px 0 rgba(10, 7, 5, 0.72)',
          color: '#FFFBEB',
          fontSize: 36,
          fontWeight: 700,
          lineHeight: 1.38,
          textAlign: 'center',
          transform: `translateY(${(1 - sealSpring) * 22}px) scale(${0.95 + sealSpring * 0.05})`,
          opacity: sealSpring,
          zIndex: 24,
        }}
      >
        ★ মূল নিয়ম: রাজার মতো চলুন—দুনিয়া আপনাকে রাজার মতোই সম্মান করবে।
      </div>
    </div>
  );
};
