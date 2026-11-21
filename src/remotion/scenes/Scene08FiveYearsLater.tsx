import React from 'react';
import { interpolate, spring, useVideoConfig } from 'remotion';
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

export const Scene08FiveYearsLater: React.FC<SceneProps> = ({
  globalFrame,
  localFrame,
  cues,
  fontFamily,
}) => {
  const { fps } = useVideoConfig();

  const nadimTalking = isSpeakerTalkingAtFrame(cues, 'nadim', globalFrame);
  const entrance = spring({ frame: localFrame, fps, config: { damping: 16, stiffness: 165 } });
  const sakibHandRaise = interpolate(localFrame, [24, 68], [-34, -84], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const sakibElbow = interpolate(localFrame, [24, 68], [-12, 26], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const birdShift = localFrame * 1.4;
  const ink = '#241A15';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        fontFamily,
        backgroundColor: '#FAEDD0',
      }}
    >
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        {/* Crisp Editorial Morning Sky & Stylized Sun */}
        <rect x={0} y={0} width={1080} height={540} fill="#FDF2D5" />
        <circle cx={182} cy={355} r={88} fill="#FFF7C2" stroke="#E5B946" strokeWidth={3} />
        {/* Fluttering morning birds */}
        {[0, 1, 2].map((b) => {
          const bx = 310 + b * 68 + birdShift * 0.45;
          const by = 330 + b * 24 + Math.sin(localFrame * 0.22 + b) * 5;
          return (
            <path
              key={b}
              d={`M ${bx - 14} ${by + 4} Q ${bx - 6} ${by - 8} ${bx} ${by} Q ${bx + 6} ${by - 8} ${bx + 14} ${by + 4}`}
              fill="none"
              stroke={ink}
              strokeWidth={2.5}
              strokeLinecap="round"
            />
          );
        })}

        {/* Sunlit Neighborhood Porch Facade & Terracotta Trim */}
        <rect x={0} y={482} width={1080} height={760} fill="#F3E7D4" stroke={ink} strokeWidth={3} />
        <rect x={0} y={472} width={1080} height={24} fill="#A35334" stroke={ink} strokeWidth={2.5} />

        {/* Wrought-Iron Veranda Railing on Left */}
        <g transform="translate(56, 860)">
          <rect x={0} y={0} width={360} height={16} fill="#364152" stroke={ink} strokeWidth={2.5} />
          {[28, 76, 124, 172, 220, 268, 316].map((rx) => (
            <line key={rx} x1={rx} y1={16} x2={rx} y2={382} stroke="#364152" strokeWidth={5} />
          ))}
        </g>

        {/* Neighbor Aunty's Ornate Maroon Doorway on Right */}
        <g transform="translate(682, 548)">
          <rect x={0} y={0} width={286} height={694} fill="#6E3B4B" stroke={ink} strokeWidth={3.5} />
          <rect x={22} y={24} width={242} height={670} fill="#592C3A" stroke="#D4AF37" strokeWidth={2.5} />
          {/* Door transom grille */}
          <rect x={38} y={38} width={210} height={64} fill="#FAF3E3" stroke={ink} strokeWidth={2.4} />
          {[80, 122, 164, 206].map((gx) => (
            <line key={gx} x1={gx} y1={38} x2={gx} y2={102} stroke={ink} strokeWidth={2.4} />
          ))}
        </g>

        {/* Porch Floor with Editorial Tile Grid */}
        <rect x={0} y={1242} width={1080} height={678} fill="#C6A276" stroke={ink} strokeWidth={2.8} />
        <g stroke="#9E7B52" strokeWidth={2} opacity={0.45}>
          <line x1={0} y1={1342} x2={1080} y2={1342} />
          <line x1={320} y1={1242} x2={220} y2={1600} />
          <line x1={680} y1={1242} x2={760} y2={1600} />
        </g>

        {/* Diagonal Morning Sunlight Band */}
        <polygon points="0,250 380,250 880,1360 400,1360" fill="#FFFBEB" opacity={0.22} />

        {/* Ground Cast Shadows */}
        <ellipse cx={225} cy={1360} rx={100} ry={18} fill="#6E4E2D" opacity={0.26} />
        <ellipse cx={492} cy={1354} rx={110} ry={20} fill="#6E4E2D" opacity={0.28} />
        <ellipse cx={805} cy={1360} rx={104} ry={18} fill="#6E4E2D" opacity={0.26} />

        {/* Nadim (Best Friend, Age 23, energetic articulated gesture cheering Sakib) */}
        <CharacterRig
          preset="nadim"
          frame={localFrame}
          x={225}
          y={1162}
          scale={1.22}
          expression="happy"
          isTalking={nadimTalking}
          leftArmAngle={24}
          leftElbowBend={16}
          rightArmAngle={nadimTalking ? -64 : -28}
          rightElbowBend={nadimTalking ? -32 : -14}
          eyeLookX={0.7}
          breathPhase={0.3}
        />

        {/* Older, Confident Sakib (Age 23, wristwatch, calmly presenting gold-ribbon sweetBox) */}
        <CharacterRig
          preset="sakib23"
          frame={localFrame}
          x={492}
          y={1152}
          scale={1.27}
          expression="happy"
          isTalking={false}
          leftArmAngle={22}
          leftElbowBend={12}
          rightArmAngle={sakibHandRaise}
          rightElbowBend={sakibElbow}
          rightProp="sweetBox"
          eyeLookX={0.8}
          breathPhase={1.4}
        />

        {/* Stunned Neighbor Aunty wide-eyed at her doorway */}
        <CharacterRig
          preset="aunty"
          frame={localFrame}
          x={805}
          y={1162}
          scale={1.23}
          expression="shocked"
          isTalking={false}
          leftArmAngle={46}
          leftElbowBend={30}
          rightArmAngle={-24}
          rightElbowBend={-14}
          eyeLookX={-0.8}
          headTiltDeg={4}
          breathPhase={2.6}
        />
      </svg>

      {/* Editorial Time Stamp ("৫ বছর পর") & Sweet Box Tag strictly inside Safe Zone */}
      <div
        style={{
          position: 'absolute',
          left: 72,
          top: 192,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          transform: `translateY(${(1 - entrance) * -18}px)`,
          opacity: entrance,
          zIndex: 20,
        }}
      >
        <div
          style={{
            padding: '11px 28px',
            borderRadius: 12,
            backgroundColor: '#104138',
            border: '3px solid #241A15',
            outline: '2px solid #D4AF37',
            outlineOffset: -6,
            color: '#FDE047',
            fontSize: 32,
            fontWeight: 700,
            boxShadow: '5px 6px 0 rgba(20, 15, 12, 0.45)',
          }}
        >
          ৫ বছর পর
        </div>
        <div
          style={{
            padding: '11px 24px',
            borderRadius: 12,
            backgroundColor: '#9E2A2B',
            border: '3px solid #241A15',
            outline: '2px solid #D4AF37',
            outlineOffset: -6,
            color: '#FFFBEB',
            fontSize: 30,
            fontWeight: 700,
            boxShadow: '5px 6px 0 rgba(20, 15, 12, 0.45)',
          }}
        >
          🍬 প্রথম বেতনের মিষ্টি
        </div>
      </div>
    </div>
  );
};
