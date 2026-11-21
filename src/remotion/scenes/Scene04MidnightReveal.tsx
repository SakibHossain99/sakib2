import React from 'react';
import { interpolate } from 'remotion';
import { isSpeakerTalkingAtFrame } from '../../lib/timeline';
import type { SubtitleCue } from '../../lib/timeline';
import { CharacterRig } from '../components/CharacterRig';

interface SceneProps {
  globalFrame: number;
  localFrame: number;
  durationInFrames: number;
  cues: readonly SubtitleCue[];
  fontFamily: string;
}

export const Scene04MidnightReveal: React.FC<SceneProps> = ({
  globalFrame,
  localFrame,
  durationInFrames,
  cues,
  fontFamily,
}) => {
  const sakibTalking = isSpeakerTalkingAtFrame(cues, 'sakib', globalFrame);
  const ruksanaTalking = isSpeakerTalkingAtFrame(cues, 'ruksana', globalFrame);

  // Second half: Ruksana gently lifts Sakib's bowed chin; his head rises with royal dignity
  const liftStart = Math.round(durationInFrames * 0.45);
  const chinLiftProgress = interpolate(localFrame, [liftStart, liftStart + 65], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const sakibHeadTilt = interpolate(chinLiftProgress, [0, 1], [14, -2]);
  const ruksanaReachAngle = interpolate(chinLiftProgress, [0, 1], [-82, -108]);
  const ruksanaReachElbow = interpolate(chinLiftProgress, [0, 1], [24, -18]);
  const warmGlowOpacity = interpolate(chinLiftProgress, [0, 1], [0.08, 0.34]);

  const ink = '#0D1118';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        fontFamily,
        backgroundColor: '#131A26',
      }}
    >
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <radialGradient id="s4_warmAura" cx="50%" cy="56%" r="44%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity={warmGlowOpacity} />
            <stop offset="100%" stopColor="#131A26" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Quiet Moonlit Bedroom Wall (Match-cut from family house) */}
        <rect x={0} y={0} width={1080} height={1242} fill="#182233" />
        {/* Bedroom dado paneling */}
        <rect x={0} y={930} width={1080} height={312} fill="#131B29" stroke={ink} strokeWidth={2.5} />

        {/* Moonlit Gridded Bedroom Window with Crescent-Full Moon & Tree Branch */}
        <g transform="translate(88, 355)">
          <rect x={0} y={0} width={296} height={412} rx={8} fill="#1E2C42" stroke={ink} strokeWidth={4} />
          <rect x={14} y={14} width={268} height={384} fill="#253652" stroke="#3B4D6B" strokeWidth={8} />
          <circle cx={212} cy={104} r={44} fill="#F1F5F9" stroke="#CBD5E1" strokeWidth={2} />
          {/* Night palm/mango silhouette across moon */}
          <path d="M 14 295 Q 92 225 182 260 Q 125 268 14 328 Z" fill="#162133" />
          {/* Window grill bars */}
          <line x1={148} y1={14} x2={148} y2={398} stroke="#3B4D6B" strokeWidth={8} />
          <line x1={14} y1={206} x2={282} y2={206} stroke="#3B4D6B" strokeWidth={8} />
        </g>

        {/* Cast Window-Grill Moonlight Parallelogram across wall */}
        <polygon points="88,355 384,355 876,1242 436,1242" fill="#CBD5E1" opacity={0.07} />

        {/* Bedroom Wall Clock showing Midnight (12:15) & Hanging Bookshelf */}
        <g transform="translate(772, 412)">
          <circle cx={0} cy={0} r={44} fill="#233046" stroke="#94A3B8" strokeWidth={3} />
          <line x1={0} y1={0} x2={0} y2={-24} stroke="#E2E8F0" strokeWidth={3} strokeLinecap="round" />
          <line x1={0} y1={0} x2={22} y2={0} stroke="#D4AF37" strokeWidth={2.6} strokeLinecap="round" />
          <circle cx={0} cy={0} r={4} fill="#FDE047" />
          <text x={0} y={76} textAnchor="middle" fill="#94A3B8" fontSize={22} fontWeight={700} fontFamily={fontFamily}>
            রাত ১২:১৫
          </text>
        </g>

        {/* Warm Bedside Brass Lamp / Hurricane Lantern glowing brighter during dignity reveal */}
        <g transform="translate(888, 916)">
          <rect x={-26} y={14} width={52} height={18} rx={4} fill="#8C6426" stroke={ink} strokeWidth={2.2} />
          <path d="M -18 -26 L 18 -26 L 24 14 L -24 14 Z" fill="#FDE68A" opacity={0.4 + chinLiftProgress * 0.55} stroke={ink} strokeWidth={2.2} />
          <circle cx={0} cy={-6} r={48 + chinLiftProgress * 32} fill="#F59E0B" opacity={0.14 + chinLiftProgress * 0.2} />
        </g>

        {/* Bedroom Floor & Rising Golden Dignity Warmth */}
        <rect x={0} y={1242} width={1080} height={678} fill="#0F1521" stroke={ink} strokeWidth={2.6} />
        <rect x={0} y={0} width={1080} height={1920} fill="url(#s4_warmAura)" />

        {/* Floating silver-gold dust motes */}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const mx = 160 + i * 125 + Math.sin(localFrame * 0.04 + i) * 18;
          const my = 480 + ((i * 140 + localFrame * 0.55) % 620);
          return <circle key={i} cx={mx} cy={my} r={3} fill="#E2E8F0" opacity={0.36} />;
        })}

        {/* Ruksana showing folded printed GPA 2.80 sheet, then gently raising hand toward Sakib's chin */}
        <CharacterRig
          preset="ruksanaFaded"
          frame={localFrame}
          x={348}
          y={1155}
          scale={1.34}
          expression={chinLiftProgress > 0.5 ? 'realization' : 'neutral'}
          isTalking={ruksanaTalking}
          leftArmAngle={20}
          leftElbowBend={12}
          rightArmAngle={ruksanaReachAngle}
          rightElbowBend={ruksanaReachElbow}
          rightProp={chinLiftProgress < 0.5 ? 'resultSheet' : 'none'}
          eyeLookX={0.8}
          breathPhase={0.4}
        />

        {/* Sakib stunned -> uplifted realization with rising head */}
        <CharacterRig
          preset="sakib18"
          frame={localFrame}
          x={698}
          y={1155}
          scale={1.32}
          expression={
            chinLiftProgress > 0.65
              ? 'realization'
              : sakibTalking
                ? 'shocked'
                : 'sad'
          }
          isTalking={sakibTalking}
          leftArmAngle={24}
          leftElbowBend={16}
          rightArmAngle={-24}
          rightElbowBend={-16}
          headTiltDeg={sakibHeadTilt}
          eyeLookX={-0.8}
          breathPhase={1.9}
        />
      </svg>

      {/* Top Editorial Midnight Stamp (y: 195..255) */}
      <div
        style={{
          position: 'absolute',
          left: 80,
          top: 195,
          padding: '11px 26px',
          borderRadius: 12,
          backgroundColor: '#1E293B',
          border: '2.5px solid #0B0F17',
          outline: '2px solid #94A3B8',
          outlineOffset: -6,
          boxShadow: '5px 6px 0 rgba(8, 10, 14, 0.55)',
          color: '#E2E8F0',
          fontSize: 28,
          fontWeight: 600,
          zIndex: 20,
        }}
      >
        🌙 গভীর রাত · মায়ের আঁচলে লুকানো সত্য
      </div>
    </div>
  );
};
