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

export const Scene01ColdOpen: React.FC<SceneProps> = ({
  globalFrame,
  localFrame,
  cues,
  fontFamily,
}) => {
  const { fps } = useVideoConfig();

  // Viral 0.5s Lie-Detector Glitch Freeze at frames 75..90
  const isGlitchFreeze = localFrame >= 75 && localFrame < 90;
  const postGlitch = localFrame >= 90;
  const animFrame = isGlitchFreeze ? 75 : localFrame;
  const glitchJitter = isGlitchFreeze ? Math.sin((localFrame - 75) * 2.1) * 9 : 0;

  const hookSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 16, stiffness: 190 },
  });

  const crackProgress = interpolate(localFrame, [75, 89], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Analog needle sweeps dramatically from 18% to 99% at frame 75
  const needleSpring = spring({
    frame: Math.max(0, localFrame - 75),
    fps,
    config: { damping: 9, stiffness: 190 },
  });
  const needleDeg = interpolate(needleSpring, [0, 1], [-68, 76]) + (postGlitch ? Math.sin(localFrame * 0.65) * 3.5 : 0);

  const sakibTalking = isSpeakerTalkingAtFrame(cues, 'sakib', globalFrame);

  // Expressive realistic articulated arm choreography
  const sakibLeftArm = localFrame < 75 ? 28 + Math.sin(localFrame * 0.24) * 7 : 64;
  const sakibLeftElbow = localFrame < 75 ? 18 + Math.cos(localFrame * 0.24) * 8 : 66;
  const sakibRightArm = localFrame < 75 ? -34 - Math.sin(localFrame * 0.22) * 8 : -28;
  const sakibRightElbow = localFrame < 75 ? -20 : -34;

  // Ruksana calmly extends brass sweet tray toward neighbors after frame 90
  const trayLift = interpolate(localFrame, [92, 132], [20, 64], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const trayElbow = interpolate(localFrame, [92, 132], [-10, -28], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const lanternSway = Math.sin(animFrame * 0.05) * 2.8;
  const ink = '#241A15';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        fontFamily,
        backgroundColor: '#F3E3C3',
      }}
    >
      {/* Handcrafted 2D Editorial Bengali Courtyard & Articulated Characters */}
      <svg
        viewBox="0 0 1080 1920"
        width={1080}
        height={1920}
        style={{
          position: 'absolute',
          inset: 0,
          transform: isGlitchFreeze ? `translateX(${glitchJitter}px)` : undefined,
        }}
      >
        <defs>
          <pattern id="s1_terracotta" width="44" height="28" patternUnits="userSpaceOnUse">
            <path d="M 0 28 Q 22 6 44 28" fill="#A95335" stroke={ink} strokeWidth={2} />
            <path d="M 0 14 Q 22 -4 44 14" fill="none" stroke="#C56D4C" strokeWidth={1.6} />
          </pattern>
        </defs>

        {/* Flat Editorial Warm Afternoon Sky with Layered Paper Clouds */}
        <rect x={0} y={0} width={1080} height={540} fill="#F7E3B6" />
        <rect x={0} y={240} width={1080} height={300} fill="#F1D096" opacity={0.55} />
        <circle cx={885} cy={385} r={96} fill="#FFF5CE" stroke="#E2BA68" strokeWidth={3} />
        {/* Crisp stylized cloud silhouettes */}
        <path d="M 60 360 Q 95 322 145 332 Q 185 304 235 328 Q 272 326 286 360 Z" fill="#FFF9EA" stroke="#DFC496" strokeWidth={2} />

        {/* Detailed Courtyard Mango & Bougainvillea Foliage */}
        <g>
          <path d="M -20 510 Q 95 385 235 440 Q 295 415 340 505 Z" fill="#2F6146" stroke={ink} strokeWidth={2.8} />
          <path d="M 30 500 Q 125 415 215 462" fill="none" stroke="#488563" strokeWidth={4} strokeLinecap="round" />
          <path d="M 760 510 Q 870 395 1010 445 Q 1060 430 1100 505 Z" fill="#28543C" stroke={ink} strokeWidth={2.8} />
          {/* Bougainvillea magenta blossoms peeking over wall */}
          {[820, 860, 910, 955, 165, 210].map((bx, i) => (
            <circle key={i} cx={bx} cy={466 + (i % 2) * 14} r={10} fill="#C63663" stroke={ink} strokeWidth={1.8} />
          ))}
        </g>

        {/* Terracotta Sloped Veranda Roof Awning */}
        <polygon points="0,486 1080,486 1080,548 0,548" fill="url(#s1_terracotta)" stroke={ink} strokeWidth={3} />
        <rect x={0} y={544} width={1080} height={18} fill="#7B4326" stroke={ink} strokeWidth={2.5} />

        {/* Cream Lime-Plaster Bangladeshi Courtyard Wall with Subtle Brick Patch Texture */}
        <rect x={0} y={562} width={1080} height={680} fill="#F2E4CC" />
        {/* Subtle weathered plaster & exposed brick detail on left */}
        <g fill="#C97F5D" stroke={ink} strokeWidth={1.4} opacity={0.45}>
          <rect x={54} y={660} width={34} height={14} rx={2} />
          <rect x={72} y={676} width={34} height={14} rx={2} />
          <rect x={50} y={692} width={30} height={14} rx={2} />
        </g>

        {/* Arched Veranda Recess with Recessed Shadow */}
        <path
          d="M 118 1242 L 118 688 Q 118 594 232 594 L 848 594 Q 962 594 962 688 L 962 1242 Z"
          fill="#E2CFAF"
          stroke={ink}
          strokeWidth={3.2}
        />
        <path
          d="M 136 1242 L 136 694 Q 136 614 234 614 L 846 614 Q 944 614 944 694 L 944 1242 Z"
          fill="none"
          stroke="#B38A5E"
          strokeWidth={5}
        />

        {/* Louvered Wooden Bangladeshi Window on Right */}
        <g transform="translate(758, 690)">
          <rect x={0} y={0} width={142} height={224} rx={4} fill="#2A4A43" stroke={ink} strokeWidth={2.8} />
          <rect x={12} y={12} width={118} height={200} fill="#39665C" stroke={ink} strokeWidth={2} />
          {[32, 54, 76, 98, 120, 142, 164, 186].map((ly) => (
            <line key={ly} x1={18} y1={ly} x2={124} y2={ly} stroke={ink} strokeWidth={2.2} opacity={0.65} />
          ))}
          <rect x={-10} y={222} width={162} height={16} rx={3} fill="#C29B6F" stroke={ink} strokeWidth={2.4} />
        </g>

        {/* Traditional Panelled Wooden Front Door in Center */}
        <g transform="translate(415, 668)">
          <rect x={0} y={0} width={246} height={574} rx={6} fill="#6B3F24" stroke={ink} strokeWidth={3.2} />
          <rect x={22} y={28} width={92} height={232} rx={4} fill="#58321B" stroke={ink} strokeWidth={2.2} />
          <rect x={132} y={28} width={92} height={232} rx={4} fill="#58321B" stroke={ink} strokeWidth={2.2} />
          <rect x={22} y={288} width={92} height={238} rx={4} fill="#58321B" stroke={ink} strokeWidth={2.2} />
          <rect x={132} y={288} width={92} height={238} rx={4} fill="#58321B" stroke={ink} strokeWidth={2.2} />
          {/* Brass door rings */}
          <circle cx={102} cy={274} r={8} fill="#D4AF37" stroke={ink} strokeWidth={2} />
          <circle cx={144} cy={274} r={8} fill="#D4AF37" stroke={ink} strokeWidth={2} />
        </g>

        {/* Gently Swaying Hanging Brass Veranda Lantern */}
        <g transform={`translate(500, 562) rotate(${lanternSway})`}>
          <line x1={0} y1={0} x2={0} y2={42} stroke={ink} strokeWidth={3} />
          <path d="M -22 42 L 22 42 L 16 84 L -16 84 Z" fill="#FDE68A" stroke={ink} strokeWidth={2.5} />
          <path d="M -26 42 Q 0 26 26 42 Z" fill="#B4832C" stroke={ink} strokeWidth={2.4} />
          <rect x={-18} y={84} width={36} height={10} rx={3} fill="#B4832C" stroke={ink} strokeWidth={2.2} />
        </g>

        {/* Terracotta Potted Marigold Plant beside Door */}
        <g transform="translate(178, 1142)">
          <path d="M -30 22 L 30 22 L 22 100 L -22 100 Z" fill="#BA5E39" stroke={ink} strokeWidth={2.5} />
          <rect x={-36} y={10} width={72} height={16} rx={4} fill="#CD6D46" stroke={ink} strokeWidth={2.5} />
          <path d="M -18 10 Q -42 -30 -16 -56 Q 0 -30 0 10" fill="#2F6E48" stroke={ink} strokeWidth={2} />
          <path d="M 16 10 Q 44 -28 18 -54 Q 0 -28 0 10" fill="#3C8459" stroke={ink} strokeWidth={2} />
          <circle cx={-16} cy={-56} r={11} fill="#F59E0B" stroke={ink} strokeWidth={2} />
          <circle cx={18} cy={-52} r={11} fill="#F97316" stroke={ink} strokeWidth={2} />
          <circle cx={2} cy={-68} r={12} fill="#FBBF24" stroke={ink} strokeWidth={2} />
        </g>

        {/* Editorial Tiled Courtyard Floor with Crisp Ink Perspective Lines */}
        <rect x={0} y={1242} width={1080} height={678} fill="#C6976B" />
        <rect x={0} y={1242} width={1080} height={24} fill="#A7774D" stroke={ink} strokeWidth={2.6} />
        <g stroke="#8A5E3B" strokeWidth={2} opacity={0.45}>
          <line x1={0} y1={1325} x2={1080} y2={1325} />
          <line x1={0} y1={1430} x2={1080} y2={1430} />
          <line x1={270} y1={1266} x2={140} y2={1620} />
          <line x1={540} y1={1266} x2={540} y2={1620} />
          <line x1={810} y1={1266} x2={940} y2={1620} />
        </g>

        {/* Warm Afternoon Diagonal Sunlight Band (flat editorial screen) */}
        <polygon points="690,340 1080,340 760,1360 360,1360" fill="#FFF7D6" opacity={0.18} />

        {/* === BESPOKE TOPIC METAPHOR: STAMPED "A+" CERTIFICATE RIPPING OPEN INTO RED-INK "GPA 2.8" === */}
        <g transform="translate(278, 634)">
          {localFrame < 75 ? (
            <g>
              {/* Embossed Gold Merit Certificate Seal */}
              <rect x={-114} y={-56} width={228} height={112} rx={12} fill="#0F3D36" stroke={ink} strokeWidth={3.5} />
              <rect x={-105} y={-47} width={210} height={94} rx={8} fill="none" stroke="#D4AF37" strokeWidth={2.4} strokeDasharray="6 4" />
              <text x={0} y={24} textAnchor="middle" fill="#FDE047" fontSize={72} fontWeight={700} fontFamily={fontFamily}>
                A+
              </text>
            </g>
          ) : (
            <g>
              {/* Exposed Reality Report Card Slip with Red Ink Rubber Stamp */}
              <rect x={-124} y={-62} width={248} height={124} rx={10} fill="#FAF3E3" stroke={ink} strokeWidth={3.5} />
              <rect x={-112} y={-50} width={224} height={100} rx={6} fill="#FEE2E2" stroke="#B91C1C" strokeWidth={3} strokeDasharray="8 4" />
              <text x={0} y={-14} textAnchor="middle" fill="#7F1D1D" fontSize={20} fontWeight={700} fontFamily={fontFamily}>
                HSC RESULT · ACTUAL
              </text>
              <text x={0} y={32} textAnchor="middle" fill="#B91C1C" fontSize={50} fontWeight={700} fontFamily={fontFamily}>
                GPA 2.8
              </text>
              {/* Torn Gold "A+" Halves peeling violently outward */}
              {crackProgress < 1 && (
                <>
                  <g transform={`translate(${-crackProgress * 92}, ${-crackProgress * 30}) rotate(${-crackProgress * 24})`} opacity={1 - crackProgress * 0.85}>
                    <path d="M -112 -58 L 6 -58 L -14 -8 L 8 18 L -16 58 L -112 58 Z" fill="#D4AF37" stroke={ink} strokeWidth={3} />
                    <text x={-52} y={18} textAnchor="middle" fill="#1C1917" fontSize={48} fontWeight={700}>A</text>
                  </g>
                  <g transform={`translate(${crackProgress * 92}, ${crackProgress * 26}) rotate(${crackProgress * 24})`} opacity={1 - crackProgress * 0.85}>
                    <path d="M 6 -58 L 112 -58 L 112 58 L -16 58 L 8 18 L -14 -8 Z" fill="#C49A28" stroke={ink} strokeWidth={3} />
                    <text x={52} y={16} textAnchor="middle" fill="#1C1917" fontSize={48} fontWeight={700}>+</text>
                  </g>
                </>
              )}
            </g>
          )}
        </g>

        {/* === BESPOKE 2D ANALOG DIAL FEAR-O-METER (Triggers at frame 75, positioned cleanly clear of lantern) === */}
        {(isGlitchFreeze || postGlitch) && (
          <g transform="translate(742, 514)">
            {/* Vintage brass-rimmed analog gauge plaque */}
            <rect x={-166} y={-92} width={332} height={154} rx={14} fill="#FAF3E3" stroke={ink} strokeWidth={3.5} />
            <rect x={-158} y={-84} width={316} height={138} rx={10} fill="none" stroke="#B91C1C" strokeWidth={2} />
            {/* Dial semi-circle scale */}
            <path d="M -86 12 A 86 86 0 0 1 86 12" fill="none" stroke="#E5D8C0" strokeWidth={18} />
            <path d="M -86 12 A 86 86 0 0 1 -20 -70" fill="none" stroke="#16A34A" strokeWidth={14} />
            <path d="M -20 -70 A 86 86 0 0 1 42 -62" fill="none" stroke="#EAB308" strokeWidth={14} />
            <path d="M 42 -62 A 86 86 0 0 1 86 12" fill="none" stroke="#DC2626" strokeWidth={14} />
            {/* Dial tick marks */}
            {[-70, -35, 0, 35, 70].map((deg) => (
              <line
                key={deg}
                x1={0}
                y1={-76}
                x2={0}
                y2={-62}
                stroke={ink}
                strokeWidth={2.5}
                transform={`translate(0, 12) rotate(${deg})`}
              />
            ))}
            {/* High-Contrast Dark Ink Analog Needle swinging to 99% */}
            <g transform={`translate(0, 12) rotate(${needleDeg})`}>
              <polygon points="-7,10 0,-78 7,10" fill="#1C1917" stroke="#FFFDF7" strokeWidth={1.8} />
              <circle cx={0} cy={0} r={11} fill="#D4AF37" stroke={ink} strokeWidth={2.6} />
            </g>
            {/* Bengali Label inside gauge plaque */}
            <rect x={-136} y={20} width={272} height={32} rx={6} fill="#991B1B" stroke={ink} strokeWidth={2} />
            <text x={0} y={43} textAnchor="middle" fill="#FFFDF7" fontSize={21} fontWeight={700} fontFamily={fontFamily}>
              ধরা পড়ার ভয়: ৯৯%
            </text>
          </g>
        )}

        {/* Ground Contact Cast Shadows */}
        <ellipse cx={265} cy={1350} rx={110} ry={22} fill="#5C3B21" opacity={0.28} />
        <ellipse cx={745} cy={1354} rx={114} ry={22} fill="#5C3B21" opacity={0.28} />

        {/* Sakib (Age 18, nervous, expressive articulated 2-segment arms & sculpted hands) */}
        <CharacterRig
          preset="sakib18"
          frame={animFrame}
          x={265}
          y={1148}
          scale={1.25}
          expression={localFrame < 75 ? 'worried' : 'shocked'}
          isTalking={!isGlitchFreeze && sakibTalking}
          leftArmAngle={sakibLeftArm}
          leftElbowBend={sakibLeftElbow}
          rightArmAngle={sakibRightArm}
          rightElbowBend={sakibRightElbow}
          headTiltDeg={localFrame < 75 ? 4 : -4}
          sweatDrop={true}
          eyeLookX={0.8}
          breathPhase={0}
        />

        {/* Ruksana (Faded teal saree with আঁচলের গিঁট, calm dignified smile, holding level brass sweetTray) */}
        <CharacterRig
          preset="ruksanaFaded"
          frame={animFrame}
          x={748}
          y={1150}
          scale={1.26}
          expression="happy"
          isTalking={false}
          leftArmAngle={trayLift}
          leftElbowBend={trayElbow}
          rightArmAngle={-18}
          rightElbowBend={-10}
          leftProp="sweetTray"
          eyeLookX={-0.7}
          breathPhase={1.5}
        />

        {/* Editorial Ink Halftone Glitch-Freeze Flash (frames 75..90) */}
        {isGlitchFreeze && (
          <g>
            <rect x={0} y={0} width={1080} height={1920} fill="#B91C1C" opacity={0.12} />
            <rect x={0} y={530 + glitchJitter * 4} width={1080} height={14} fill="#14B8A6" opacity={0.34} />
            <rect x={0} y={860 - glitchJitter * 5} width={1080} height={20} fill="#DC2626" opacity={0.32} />
            <rect x={0} y={1100 + glitchJitter * 3} width={1080} height={10} fill="#EAB308" opacity={0.35} />
          </g>
        )}
      </svg>

      {/* Top Editorial Hook Banner (y: 185..340, strictly inside Safe Zone x: 60..940) */}
      <div
        style={{
          position: 'absolute',
          left: 64,
          top: 185,
          width: 872,
          padding: '20px 44px',
          borderRadius: 16,
          backgroundColor: '#104138',
          border: '3px solid #241A15',
          outline: '3px solid #D4AF37',
          outlineOffset: -7,
          boxShadow: '7px 8px 0 rgba(20, 15, 12, 0.55)',
          color: '#FFFBEB',
          fontSize: 38,
          fontWeight: 700,
          lineHeight: 1.3,
          textAlign: 'center',
          textWrap: 'balance',
          transform: `translateY(${(1 - hookSpring) * -24}px)`,
          zIndex: 20,
        }}
      >
        জিপিএ ২.৮ জেনেও মা রুকসানা কেন পুরো মহল্লায় মিষ্টি বিলালেন?
      </div>

      {/* Editorial Stamp Data Strip below hook card (y: 356..414) */}
      <div
        style={{
          position: 'absolute',
          left: 102,
          top: 358,
          width: 796,
          padding: '10px 22px',
          borderRadius: 12,
          backgroundColor: '#1E242B',
          border: '2.5px solid #D4AF37',
          boxShadow: '4px 5px 0 rgba(20, 15, 12, 0.45)',
          color: '#FAF6EE',
          fontSize: 27,
          fontWeight: 600,
          textAlign: 'center',
          zIndex: 20,
        }}
      >
        📄 সাকিবের রেজাল্ট: ২.৮ | 🍬 তবুও মিষ্টি বিতরণ
      </div>
    </div>
  );
};
