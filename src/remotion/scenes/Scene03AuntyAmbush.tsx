import React from 'react';
import { interpolate, spring, useVideoConfig } from 'remotion';
import { isSpeakerTalkingAtFrame } from '../../lib/timeline';
import type { SubtitleCue } from '../../lib/timeline';
import { GENERATED_SILENCE_DROP } from '../../lib/audioManifest.generated';
import { CharacterRig } from '../components/CharacterRig';

interface SceneProps {
  globalFrame: number;
  localFrame: number;
  durationInFrames: number;
  cues: readonly SubtitleCue[];
  fontFamily: string;
}

export const Scene03AuntyAmbush: React.FC<SceneProps> = ({
  globalFrame,
  localFrame,
  cues,
  fontFamily,
}) => {
  const { fps } = useVideoConfig();

  const auntyTalking = isSpeakerTalkingAtFrame(cues, 'aunty', globalFrame);
  const ruksanaTalking = isSpeakerTalkingAtFrame(cues, 'ruksana', globalFrame);
  const inSilenceDrop = globalFrame >= GENERATED_SILENCE_DROP.startFrame;

  const auntyEnter = spring({
    frame: localFrame,
    fps,
    config: { damping: 16, stiffness: 165 },
  });

  const auntyX = interpolate(auntyEnter, [0, 1], [960, 775]);
  const ruksanaStep = interpolate(
    globalFrame,
    [GENERATED_SILENCE_DROP.startFrame - 95, GENERATED_SILENCE_DROP.startFrame - 65],
    [345, 392],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Aunty jolts backward shocked right after Ruksana's mic-drop
  const shockJolt = inSilenceDrop
    ? interpolate(globalFrame, [GENERATED_SILENCE_DROP.startFrame, GENERATED_SILENCE_DROP.startFrame + 8], [0, 24], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  // Shatter expansion of gossip sound-waves at silence drop
  const shatterProgress = inSilenceDrop
    ? interpolate(globalFrame, [GENERATED_SILENCE_DROP.startFrame, GENERATED_SILENCE_DROP.startFrame + 16], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  const ink = '#241A15';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        fontFamily,
        backgroundColor: '#E9DFCC',
      }}
    >
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <radialGradient id="s3_royalSpot" cx="38%" cy="56%" r="50%">
            <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#0D1117" stopOpacity="0.58" />
          </radialGradient>
        </defs>

        {/* Detailed Bangladeshi Living Room Backdrop (Mosaic Tile Trim, Wall Clock, Framed Calligraphy) */}
        <rect x={0} y={0} width={1080} height={1242} fill="#EFE4D2" />
        {/* Wall dado rail & wainscoting */}
        <rect x={0} y={920} width={1080} height={322} fill="#E0CEB4" stroke={ink} strokeWidth={2.4} />
        <line x1={0} y1={932} x2={1080} y2={932} stroke="#B89B74" strokeWidth={3} />

        {/* Framed Bengali Interior Archway */}
        <rect x={334} y={442} width={352} height={800} fill="#D5BC9B" stroke={ink} strokeWidth={3.5} />
        <rect x={348} y={456} width={324} height={786} fill="none" stroke="#855733" strokeWidth={8} />

        {/* Vintage Round Wall Clock above doorway */}
        <g transform="translate(510, 384)">
          <circle cx={0} cy={0} r={42} fill="#FAF3E3" stroke={ink} strokeWidth={3} />
          <circle cx={0} cy={0} r={34} fill="none" stroke="#B48A30" strokeWidth={2} />
          <line x1={0} y1={0} x2={0} y2={-22} stroke={ink} strokeWidth={3} strokeLinecap="round" />
          <line x1={0} y1={0} x2={16} y2={8} stroke="#9E2A2B" strokeWidth={2.4} strokeLinecap="round" />
          <circle cx={0} cy={0} r={4} fill={ink} />
        </g>

        {/* Neighbor Window on Right with Gossiping Neighbor Silhouettes Peeking In */}
        <g transform="translate(750, 470)">
          <rect x={0} y={0} width={226} height={240} rx={6} fill="#364152" stroke={ink} strokeWidth={3.2} />
          {/* Two eavesdropping neighbor silhouettes */}
          <circle cx={72} cy={140} r={28} fill="#1E2530" />
          <path d="M 32 238 C 36 184 108 184 112 238 Z" fill="#1E2530" />
          <circle cx={154} cy={148} r={25} fill="#252E3C" />
          <path d="M 118 238 C 122 192 186 192 190 238 Z" fill="#252E3C" />
          {/* Window grill bars */}
          <line x1={56} y1={0} x2={56} y2={240} stroke={ink} strokeWidth={4} />
          <line x1={113} y1={0} x2={113} y2={240} stroke={ink} strokeWidth={4} />
          <line x1={170} y1={0} x2={170} y2={240} stroke={ink} strokeWidth={4} />
          <line x1={0} y1={120} x2={226} y2={120} stroke={ink} strokeWidth={4} />
        </g>

        {/* Wooden Interior Door on Left where Sakib hides */}
        <rect x={0} y={448} width={226} height={796} fill="#5E371F" stroke={ink} strokeWidth={3.5} />
        <rect x={26} y={506} width={160} height={310} rx={4} fill="#4F2D18" stroke={ink} strokeWidth={2.2} />
        <rect x={26} y={846} width={160} height={310} rx={4} fill="#4F2D18" stroke={ink} strokeWidth={2.2} />

        {/* Classic Bangladeshi Mosaic Floor */}
        <rect x={0} y={1242} width={1080} height={678} fill="#B38D69" stroke={ink} strokeWidth={2.8} />
        <g stroke="#8E6744" strokeWidth={2} opacity={0.45}>
          <line x1={0} y1={1340} x2={1080} y2={1340} />
          <line x1={260} y1={1242} x2={140} y2={1620} />
          <line x1={540} y1={1242} x2={540} y2={1620} />
          <line x1={820} y1={1242} x2={940} y2={1620} />
        </g>

        {/* Split-focus Sakib hiding behind the wooden door edge, head bowed in shame */}
        <g opacity={0.95}>
          <CharacterRig
            preset="sakib18"
            frame={localFrame}
            x={152}
            y={1145}
            scale={0.92}
            expression="sad"
            leftArmAngle={10}
            rightArmAngle={-8}
            rightElbowBend={6}
            headTiltDeg={14}
            eyeLookX={0.6}
            eyeLookY={0.6}
            sweatDrop={!inSilenceDrop}
          />
          <rect x={0} y={448} width={116} height={990} fill="#6E4026" stroke={ink} strokeWidth={3} />
        </g>

        {/* Ground Contact Shadows */}
        <ellipse cx={ruksanaStep} cy={1354} rx={110} ry={20} fill="#4D331E" opacity={0.28} />
        <ellipse cx={auntyX + shockJolt} cy={1354} rx={110} ry={20} fill="#4D331E" opacity={0.28} />

        {/* Ruksana stepping forward with royal calm posture & articulated hand gesture */}
        <CharacterRig
          preset="ruksanaFaded"
          frame={localFrame}
          x={ruksanaStep}
          y={1155}
          scale={1.25}
          expression={ruksanaTalking || inSilenceDrop ? 'realization' : 'neutral'}
          isTalking={ruksanaTalking}
          leftArmAngle={14}
          leftElbowBend={8}
          rightArmAngle={ruksanaTalking ? -52 : -18}
          rightElbowBend={ruksanaTalking ? -26 : -10}
          headTiltDeg={0}
          eyeLookX={0.8}
          breathPhase={0.8}
        />

        {/* Neighbor Aunty marching in holding upright smartphone cleanly in open space */}
        <CharacterRig
          preset="aunty"
          frame={localFrame}
          x={auntyX + shockJolt}
          y={1155}
          scale={1.24}
          expression={inSilenceDrop ? 'shocked' : 'smirk'}
          isTalking={auntyTalking}
          leftArmAngle={inSilenceDrop ? 76 : 112}
          leftElbowBend={inSilenceDrop ? -18 : -34}
          rightArmAngle={-22}
          rightElbowBend={-14}
          leftProp="phone"
          eyeLookX={-0.8}
          headTiltDeg={inSilenceDrop ? 6 : -4}
          breathPhase={2.2}
        />

        {/* BESPOKE 2D GRAPHIC: Crimson Gossip Sound-Waves radiating from Aunty that SHATTER at Silence Drop! */}
        {!inSilenceDrop && auntyTalking && (
          <g transform={`translate(${auntyX - 115}, 885)`} fill="none" stroke="#B91C1C" strokeWidth={4} strokeLinecap="round">
            <path d="M 0 -22 Q -22 0 0 22" opacity={0.85} />
            <path d="M -22 -38 Q -52 0 -22 38" opacity={0.62} />
            <path d="M -46 -54 Q -84 0 -46 54" opacity={0.4} />
          </g>
        )}
        {inSilenceDrop && shatterProgress < 1 && (
          <g transform="translate(595, 865)" opacity={1 - shatterProgress * 0.92}>
            {/* Cracked & breaking sound-wave arcs with crisp gold silence-slash */}
            <path
              d="M 10 -34 Q -10 -12 2 6"
              fill="none"
              stroke="#B91C1C"
              strokeWidth={4.5}
              strokeLinecap="round"
              transform={`translate(${-shatterProgress * 28}, ${-shatterProgress * 22}) rotate(${-shatterProgress * 18})`}
            />
            <path
              d="M 12 16 Q -4 34 14 48"
              fill="none"
              stroke="#B91C1C"
              strokeWidth={4.5}
              strokeLinecap="round"
              transform={`translate(${shatterProgress * 24}, ${shatterProgress * 24}) rotate(${shatterProgress * 20})`}
            />
            <line x1={-32} y1={-36} x2={42} y2={42} stroke="#D4AF37" strokeWidth={4} strokeLinecap="round" />
          </g>
        )}

        {/* Dramatic Silence Drop Vignette spotlighting Ruksana's royal dignity */}
        {inSilenceDrop && (
          <rect x={0} y={0} width={1080} height={1920} fill="url(#s3_royalSpot)" />
        )}
      </svg>

      {/* Editorial Phone Evidence Card strictly inside Safe Zone (x: 495..930, y: 195..340) */}
      <div
        style={{
          position: 'absolute',
          left: 495,
          top: 195,
          width: 435,
          padding: '16px 22px',
          borderRadius: 14,
          backgroundColor: '#1E242B',
          border: '3px solid #241A15',
          outline: '2.5px solid #E05A47',
          outlineOffset: -6,
          boxShadow: '6px 7px 0 rgba(18, 12, 10, 0.55)',
          zIndex: 20,
          opacity: inSilenceDrop ? 0.52 : 1,
        }}
      >
        <div style={{ color: '#CBD5E1', fontSize: 20, fontWeight: 600, marginBottom: 4 }}>
          📱 আন্টির ফোনে বোর্ড রেজাল্ট
        </div>
        <div style={{ color: '#FCA5A5', fontSize: 28, fontWeight: 700 }}>
          কলেজ রেজাল্ট সিট: GPA 2.80
        </div>
      </div>

      {/* Dramatic Silence Drop Editorial Stamp when Ruksana freezes the room */}
      {inSilenceDrop && (
        <div
          style={{
            position: 'absolute',
            left: 80,
            top: 208,
            padding: '12px 26px',
            borderRadius: 12,
            backgroundColor: '#0F3D36',
            border: '3px solid #241A15',
            outline: '2.5px solid #D4AF37',
            outlineOffset: -6,
            color: '#FDE047',
            fontSize: 30,
            fontWeight: 700,
            boxShadow: '6px 7px 0 rgba(10, 10, 12, 0.6)',
            zIndex: 22,
          }}
        >
          পুরো মহল্লা নিস্তব্ধ...
        </div>
      )}
    </div>
  );
};
