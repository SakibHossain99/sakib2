import React from 'react';
import { spring, useVideoConfig } from 'remotion';
import type { SubtitleCue } from '../../lib/timeline';
import { CharacterRig } from '../components/CharacterRig';

interface SceneProps {
  globalFrame: number;
  localFrame: number;
  durationInFrames: number;
  cues: readonly SubtitleCue[];
  fontFamily: string;
}

export const Scene10Finale: React.FC<SceneProps> = ({
  localFrame,
  fontFamily,
}) => {
  const { fps } = useVideoConfig();

  const bannerPop = spring({ frame: localFrame, fps, config: { damping: 16, stiffness: 175 } });
  const ctaPop = spring({ frame: Math.max(0, localFrame - 14), fps, config: { damping: 14, stiffness: 175 } });
  const followPulse = 1 + Math.sin(localFrame * 0.16) * 0.03;
  const steamShift = Math.sin(localFrame * 0.14) * 3.5;
  const ink = '#241A15';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        fontFamily,
        backgroundColor: '#FAF0DA',
      }}
    >
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        {/* Sun-Drenched Handcrafted Bengali Family Dining Room */}
        <rect x={0} y={0} width={1080} height={1130} fill="#F9ECDA" />
        {/* Warm Wainscoting Dado Panel */}
        <rect x={0} y={840} width={1080} height={290} fill="#EED9BA" stroke={ink} strokeWidth={2.5} />

        {/* Large Arched Dining Room Window with Parted Cream-Gold Curtains */}
        <g transform="translate(150, 354)">
          <rect x={0} y={0} width={700} height={454} rx={18} fill="#FFFDF4" stroke={ink} strokeWidth={3.5} />
          <rect x={12} y={12} width={676} height={430} rx={12} fill="#FEF9E7" stroke="#C59D68" strokeWidth={8} />
          {/* Garden treetops outside window */}
          <path d="M 16 438 Q 140 310 290 380 Q 430 300 684 390 L 684 438 Z" fill="#468362" opacity={0.45} />
          <line x1={350} y1={12} x2={350} y2={442} stroke="#C59D68" strokeWidth={7} />
          <line x1={12} y1={226} x2={688} y2={226} stroke="#C59D68" strokeWidth={7} />
          {/* Editorial parted curtains with gold tiebacks */}
          <path d="M -8 -6 L 122 -6 L 84 260 L 114 458 L -8 458 Z" fill="#134E44" stroke={ink} strokeWidth={2.8} />
          <path d="M 708 -6 L 578 -6 L 616 260 L 586 458 L 708 458 Z" fill="#134E44" stroke={ink} strokeWidth={2.8} />
          <line x1={-6} y1={260} x2={88} y2={260} stroke="#D4AF37" strokeWidth={7} strokeLinecap="round" />
          <line x1={612} y1={260} x2={706} y2={260} stroke="#D4AF37" strokeWidth={7} strokeLinecap="round" />
        </g>

        {/* Framed Bengali Family Portrait on Left Wall */}
        <g transform="translate(44, 520)">
          <rect x={0} y={0} width={82} height={106} rx={4} fill="#8C5B36" stroke={ink} strokeWidth={2.4} />
          <rect x={10} y={10} width={62} height={86} fill="#FAF3E3" stroke="#D4AF37" strokeWidth={1.6} />
          <circle cx={41} cy={42} r={14} fill="#104138" opacity={0.35} />
          <path d="M 22 84 C 24 62 58 62 60 84 Z" fill="#9E2A2B" opacity={0.35} />
        </g>

        {/* Soft Sunbeams pouring across the happy room */}
        <polygon points="150,354 850,354 1060,1130 0,1130" fill="#FFFBEB" opacity={0.22} />

        {/* === LAYER 1: ALL 4 POSITIVE CHARACTERS BEHIND THE DINING TABLE EDGE (y = 1185) === */}
        {/* 1. Ruksana (Mother) in brand-new crimson-gold silk saree (#9E2A2B / #D4AF37) */}
        <CharacterRig
          preset="ruksanaRoyal"
          frame={localFrame}
          x={182}
          y={1095}
          scale={1.06}
          expression="happy"
          leftArmAngle={14}
          leftElbowBend={-8}
          rightArmAngle={-12}
          rightElbowBend={8}
          eyeLookX={0.3}
          breathPhase={0}
        />

        {/* 2. Tanvir (Father) with round gold spectacles, cream panjabi (#F2ECE1), proud warm smile */}
        <CharacterRig
          preset="tanvir"
          frame={localFrame}
          x={386}
          y={1082}
          scale={1.09}
          expression="happy"
          leftArmAngle={12}
          leftElbowBend={-8}
          rightArmAngle={-12}
          rightElbowBend={8}
          eyeLookX={0.2}
          breathPhase={1.1}
        />

        {/* 3. Sakib (Age 23) confident in crisp navy-emerald formal shirt */}
        <CharacterRig
          preset="sakib23"
          frame={localFrame}
          x={600}
          y={1080}
          scale={1.11}
          expression="happy"
          leftArmAngle={12}
          leftElbowBend={-8}
          rightArmAngle={-12}
          rightElbowBend={8}
          eyeLookX={0}
          breathPhase={2.2}
        />

        {/* 4. Nadim (Close Friend) raising celebratory upright teacup OUTWARD in right hand (zero face overlap!) */}
        <CharacterRig
          preset="nadim"
          frame={localFrame}
          x={816}
          y={1092}
          scale={1.06}
          expression="happy"
          leftArmAngle={12}
          leftElbowBend={-8}
          rightArmAngle={-118}
          rightElbowBend={28}
          rightProp="teacup"
          eyeLookX={-0.3}
          breathPhase={3.0}
        />

        {/* === LAYER 2: FOREGROUND CARVED WALNUT DINING TABLE EDGE (y = 1185) & LOWER TABLE FRONT === */}
        {/* Perspective Table Top Plane (y: 1122..1185) */}
        <polygon points="0,1122 1080,1122 1080,1185 0,1185" fill="#8C5832" stroke={ink} strokeWidth={3} />
        {/* Gold-trimmed table edge exactly at y = 1185 */}
        <rect x={0} y={1181} width={1080} height={10} fill="#C69249" stroke={ink} strokeWidth={2.4} />
        {/* Clean Carved Walnut Table Front Apron (y: 1191..1920) for unobstructed CTA & SubtitleBar */}
        <rect x={0} y={1191} width={1080} height={729} fill="#3B2112" />
        <rect x={28} y={1200} width={1024} height={154} rx={10} fill="#2E190D" stroke="#5A3720" strokeWidth={2.5} />

        {/* === LAYER 3: TABLETOP ITEMS VISIBLY RESTING ON TOP OF THE TABLE (y = 1110..1180) === */}
        {/* Gold-Ribbon Gift Box on left side of table */}
        <g transform="translate(222, 1142)">
          <rect x={-56} y={-34} width={112} height={60} rx={6} fill="#9E2A2B" stroke={ink} strokeWidth={2.8} />
          <rect x={-9} y={-34} width={18} height={60} fill="#E5B946" stroke={ink} strokeWidth={1.8} />
          <rect x={-56} y={-8} width={112} height={12} fill="#D4AF37" stroke={ink} strokeWidth={1.6} />
          <ellipse cx={-12} cy={-38} rx={14} ry={7} fill="#F6D569" stroke={ink} strokeWidth={1.8} />
          <ellipse cx={12} cy={-38} rx={14} ry={7} fill="#F6D569" stroke={ink} strokeWidth={1.8} />
        </g>

        {/* Festive Brass Plate of Bengali Sweets (রসগোল্লা / সন্দেশ) at center */}
        <g transform="translate(505, 1148)">
          <ellipse cx={0} cy={12} rx={104} ry={22} fill="#A67C29" stroke={ink} strokeWidth={2.8} />
          <ellipse cx={0} cy={8} rx={92} ry={16} fill="#DDB657" stroke="#8A631A" strokeWidth={1.6} />
          <circle cx={-48} cy={-2} r={16} fill="#FFF9EB" stroke={ink} strokeWidth={2} />
          <circle cx={-16} cy={-6} r={17} fill="#EA8C1E" stroke={ink} strokeWidth={2} />
          <circle cx={18} cy={-4} r={16} fill="#FFF9EB" stroke={ink} strokeWidth={2} />
          <circle cx={50} cy={0} r={15} fill="#F5C042" stroke={ink} strokeWidth={2} />
          <circle cx={-2} cy={-22} r={16} fill="#FFFDF5" stroke={ink} strokeWidth={2} />
          <circle cx={26} cy={-18} r={14} fill="#EA8C1E" stroke={ink} strokeWidth={2} />
          {/* Pistachio & saffron slivers */}
          <line x1={-51} y1={-6} x2={-45} y2={-4} stroke="#15803D" strokeWidth={3} strokeLinecap="round" />
          <line x1={-19} y1={-10} x2={-13} y2={-8} stroke="#B91C1C" strokeWidth={2.6} strokeLinecap="round" />
          <line x1={-5} y1={-26} x2={1} y2={-24} stroke="#15803D" strokeWidth={3} strokeLinecap="round" />
          <line x1={15} y1={-8} x2={21} y2={-6} stroke="#15803D" strokeWidth={3} strokeLinecap="round" />
        </g>

        {/* Steaming Porcelain Teacups on right side of table */}
        {[720, 815].map((cx, idx) => (
          <g key={idx} transform={`translate(${cx}, 1150)`}>
            <path d={`M -5 -26 Q ${-9 + steamShift} -40 -3 -50`} fill="none" stroke="#FFFDF7" strokeWidth={2.4} strokeLinecap="round" opacity={0.75} />
            <path d={`M 6 -26 Q ${10 - steamShift} -41 4 -52`} fill="none" stroke="#FFFDF7" strokeWidth={2.2} strokeLinecap="round" opacity={0.58} />
            <ellipse cx={0} cy={14} rx={28} ry={7} fill="#E5DDD0" stroke={ink} strokeWidth={2} />
            <path d="M 16 -12 C 29 -12 29 8 15 8" fill="none" stroke={ink} strokeWidth={6} strokeLinecap="round" />
            <path d="M 16 -12 C 28 -12 28 8 15 8" fill="none" stroke="#FFFDF8" strokeWidth={3.2} strokeLinecap="round" />
            <path d="M -20 -18 L 20 -18 L 15 12 C 12 18 -12 18 -15 12 Z" fill="#FFFDF8" stroke={ink} strokeWidth={2.4} />
            <line x1={-17} y1={-4} x2={17} y2={-4} stroke="#D4AF37" strokeWidth={2.4} />
            <ellipse cx={0} cy={-18} rx={20} ry={5.5} fill="#A35216" stroke={ink} strokeWidth={1.8} />
          </g>
        ))}
      </svg>

      {/* Top Editorial Victory Banner strictly inside Safe Zone (y: 185..325, x: 64..936) */}
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
          boxShadow: '7px 8px 0 rgba(20, 15, 12, 0.5)',
          color: '#FFFBEB',
          fontSize: 37,
          fontWeight: 700,
          lineHeight: 1.3,
          textAlign: 'center',
          textWrap: 'balance',
          transform: `translateY(${(1 - bannerPop) * -20}px)`,
          opacity: bannerPop,
          zIndex: 20,
        }}
      >
        মিষ্টিটা কখনো রেজাল্টের জন্য ছিল না—মানুষটার জন্য ছিল!
      </div>

      {/* Unobstructed Lower Table Front CTA (y: 1208..1346, strictly ABOVE SubtitleBar at y: 1382..1546) */}
      <div
        style={{
          position: 'absolute',
          left: 68,
          top: 1208,
          width: 864,
          height: 136,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          transform: `scale(${0.95 + ctaPop * 0.05})`,
          opacity: ctaPop,
          zIndex: 24,
        }}
      >
        {/* Crisp Editorial Gold Button: + ফলো করুন */}
        <div
          style={{
            padding: '12px 30px',
            borderRadius: 12,
            backgroundColor: '#F4C94E',
            border: '3px solid #140E0A',
            color: '#140E0A',
            fontSize: 30,
            fontWeight: 700,
            whiteSpace: 'nowrap',
            boxShadow: '5px 5px 0 rgba(10, 7, 5, 0.72)',
            transform: `scale(${followPulse})`,
          }}
        >
          + ফলো করুন
        </div>

        {/* Emerald-Gold Editorial Bar: @sakibexplains.bn · কমেন্টে লিখুন আপনার গল্প */}
        <div
          style={{
            padding: '13px 26px',
            borderRadius: 12,
            backgroundColor: '#104138',
            border: '3px solid #140E0A',
            outline: '2px solid #D4AF37',
            outlineOffset: -6,
            color: '#FFFBEB',
            fontSize: 26,
            fontWeight: 700,
            whiteSpace: 'nowrap',
            boxShadow: '5px 5px 0 rgba(10, 7, 5, 0.72)',
          }}
        >
          @sakibexplains.bn · কমেন্টে লিখুন আপনার গল্প
        </div>
      </div>
    </div>
  );
};
