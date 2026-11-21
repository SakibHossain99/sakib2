import React from 'react';
import { interpolate } from 'remotion';
import type { SubtitleCue } from '../../lib/timeline';
import { CharacterRig } from '../components/CharacterRig';

interface SceneProps {
  globalFrame: number;
  localFrame: number;
  durationInFrames: number;
  cues: readonly SubtitleCue[];
  fontFamily: string;
}

export const Scene02FlashbackKnot: React.FC<SceneProps> = ({
  localFrame,
  durationInFrames,
  fontFamily,
}) => {
  const splitFrame = Math.round(durationInFrames * 0.48);
  const partBOpacity = interpolate(localFrame, [splitFrame - 10, splitFrame + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const sakibTremble = Math.sin(localFrame * 1.4) * 3.0;
  const cashArmAngle = interpolate(localFrame, [16, 74], [24, 72], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cashElbow = interpolate(localFrame, [16, 74], [-10, -32], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Animated calendar pages flipping through 12 months
  const monthIdx = Math.min(11, Math.floor((localFrame / Math.max(1, splitFrame)) * 12));
  const BENGALI_MONTHS = ['বৈশাখ', 'জ্যৈষ্ঠ', 'আষাঢ়', 'শ্রাবণ', 'ভাদ্র', 'আশ্বিন', 'কার্তিক', 'অগ্রহায়ণ', 'পৌষ', 'মাঘ', 'ফাল্গুন', 'চৈত্র'];
  const ink = '#241A15';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        fontFamily,
        backgroundColor: '#EDE2CC',
      }}
    >
      {/* PART A: Handcrafted Editorial Flashback — Skipping New Jamdani Saree for Coaching Fee */}
      <svg
        viewBox="0 0 1080 1920"
        width={1080}
        height={1920}
        style={{ position: 'absolute', inset: 0, opacity: 1 - partBOpacity }}
      >
        {/* Warm Archival Sepia-Cream Street Backdrop */}
        <rect x={0} y={0} width={1080} height={1240} fill="#EFE4CE" />
        {/* Brick street facade strips */}
        <rect x={0} y={295} width={1080} height={24} fill="#966A43" stroke={ink} strokeWidth={2.5} />
        <rect x={0} y={1240} width={1080} height={680} fill="#C6AF8D" stroke={ink} strokeWidth={2.5} />

        {/* Striped Awning above Textile Boutique Window */}
        <g transform="translate(86, 326)">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <path
              key={i}
              d={`M ${i * 62} 0 L ${(i + 1) * 62} 0 L ${(i + 1) * 62} 44 Q ${i * 62 + 31} 62 ${i * 62} 44 Z`}
              fill={i % 2 === 0 ? '#9E2A2B' : '#FAF3E3'}
              stroke={ink}
              strokeWidth={2.2}
            />
          ))}
        </g>

        {/* Boutique Shop Display Window with Hand-Drawn Crimson-Gold Jamdani Saree */}
        <g transform="translate(96, 384)">
          <rect x={0} y={0} width={416} height={636} rx={12} fill="#4A2E1E" stroke={ink} strokeWidth={3.5} />
          <rect x={20} y={20} width={376} height={596} rx={6} fill="#2B1C14" stroke={ink} strokeWidth={2.4} />
          {/* Warm shop pendant lamp cone */}
          <polygon points="156,20 260,20 358,596 58,596" fill="#FDE68A" opacity={0.14} />

          {/* Wooden Tailor's Mannequin wearing desired crimson-gold Jamdani saree */}
          <g transform="translate(208, 320)">
            <ellipse cx={0} cy={-162} rx={24} ry={30} fill="#D9C3A3" stroke={ink} strokeWidth={2.2} />
            <rect x={-9} y={-132} width={18} height={24} fill="#BFA480" stroke={ink} strokeWidth={2} />
            <path d="M -68 -102 C -68 -116 68 -116 68 -102 L 96 186 L -96 186 Z" fill="#9E2A2B" stroke={ink} strokeWidth={2.8} />
            {/* Diagonal gold zari pallu with woven jamdani diamond motifs */}
            <path d="M -58 -100 L 82 142 L 66 186 L -78 -54 Z" fill="#B91C1C" stroke="#D4AF37" strokeWidth={6} />
            {[-40, 0, 40, 80].map((dy) => (
              <polygon
                key={dy}
                points={`0,${dy - 9} 9,${dy} 0,${dy + 9} -9,${dy}`}
                fill="#FDE047"
                transform={`translate(${dy * 0.35}, 0)`}
              />
            ))}
            <line x1={-88} y1={170} x2={92} y2={170} stroke="#D4AF37" strokeWidth={11} />
          </g>

          {/* Hanging Brass Price Tag swinging gently */}
          <g transform={`translate(332, 190) rotate(${Math.sin(localFrame * 0.08) * 4})`}>
            <line x1={0} y1={-46} x2={0} y2={0} stroke="#D4AF37" strokeWidth={2} />
            <rect x={-48} y={0} width={96} height={46} rx={6} fill="#FAF3E3" stroke={ink} strokeWidth={2.2} />
            <text x={0} y={30} textAnchor="middle" fill="#9E2A2B" fontSize={22} fontWeight={700} fontFamily={fontFamily}>
              ৳ ৪,৫০০
            </text>
          </g>

          {/* Subtle diagonal glass ink streaks */}
          <line x1={38} y1={42} x2={120} y2={150} stroke="#FFFDF7" strokeWidth={4} opacity={0.22} strokeLinecap="round" />
          <line x1={54} y1={32} x2={106} y2={100} stroke="#FFFDF7" strokeWidth={2.5} opacity={0.18} strokeLinecap="round" />

          <rect x={60} y={536} width={296} height={52} rx={8} fill="#1C1917" stroke="#D4AF37" strokeWidth={2.5} />
          <text x={208} y={570} textAnchor="middle" fill="#FDE68A" fontSize={24} fontWeight={700} fontFamily={fontFamily}>
            নতুন শাড়ি — এবার থাক...
          </text>
        </g>

        {/* Animated Flipping 12-Month Calendar & Coaching Fee Receipt Ledger on Right */}
        <g transform="translate(558, 378)">
          {/* Wall Calendar showing passing months */}
          <rect x={0} y={0} width={156} height={144} rx={10} fill="#FAF3E3" stroke={ink} strokeWidth={3} />
          <rect x={0} y={0} width={156} height={42} rx={8} fill="#9E2A2B" stroke={ink} strokeWidth={3} />
          <circle cx={42} cy={20} r={5} fill="#FAF3E3" />
          <circle cx={114} cy={20} r={5} fill="#FAF3E3" />
          <text x={78} y={84} textAnchor="middle" fill="#1C1917" fontSize={26} fontWeight={700} fontFamily={fontFamily}>
            {BENGALI_MONTHS[monthIdx]}
          </text>
          <text x={78} y={120} textAnchor="middle" fill="#785A32" fontSize={20} fontWeight={700} fontFamily={fontFamily}>
            মাস {monthIdx + 1}/১২
          </text>

          {/* Coaching Fee Receipt Slip stamped PAID */}
          <g transform="translate(178, 0)">
            <rect x={0} y={0} width={196} height={154} rx={8} fill="#0F3D36" stroke={ink} strokeWidth={3} />
            <rect x={8} y={8} width={180} height={138} rx={4} fill="none" stroke="#D4AF37" strokeWidth={2} strokeDasharray="5 4" />
            <text x={98} y={48} textAnchor="middle" fill="#FDE047" fontSize={24} fontWeight={700} fontFamily={fontFamily}>
              কোচিং ফি
            </text>
            <line x1={26} y1={66} x2={170} y2={66} stroke="#D4AF37" strokeWidth={2} opacity={0.6} />
            <text x={98} y={102} textAnchor="middle" fill="#FFFBEB" fontSize={22} fontWeight={700} fontFamily={fontFamily}>
              সাকিবের ভবিষ্যৎ
            </text>
            <text x={98} y={130} textAnchor="middle" fill="#A7F3D0" fontSize={21} fontWeight={700} fontFamily={fontFamily}>
              আগে ✓
            </text>
          </g>
        </g>

        {/* Ground Shadow & Ruksana handing coaching fee cash envelope */}
        <ellipse cx={692} cy={1350} rx={118} ry={22} fill="#6C5336" opacity={0.28} />
        <CharacterRig
          preset="ruksanaFaded"
          frame={localFrame}
          x={692}
          y={1140}
          scale={1.34}
          expression="neutral"
          leftArmAngle={cashArmAngle}
          leftElbowBend={cashElbow}
          rightArmAngle={-22}
          rightElbowBend={-12}
          leftProp="cashEnvelope"
          eyeLookX={-0.6}
          headTiltDeg={-3}
        />

        {/* Subtle warm sepia memory tint */}
        <rect x={0} y={0} width={1080} height={1920} fill="#8C6432" opacity={0.11} />
      </svg>

      {/* PART B: Present Day — Untying the Faded Saree Knot (আঁচলের গিঁট) while Sakib trembles */}
      <svg
        viewBox="0 0 1080 1920"
        width={1080}
        height={1920}
        style={{ position: 'absolute', inset: 0, opacity: partBOpacity }}
      >
        <rect x={0} y={0} width={1080} height={1240} fill="#ECE0CB" />
        {/* Traditional Gridded Bangladeshi Veranda Window with Cotton Curtain */}
        <g transform="translate(76, 368)">
          <rect x={0} y={0} width={310} height={410} rx={8} fill="#FFF7E2" stroke={ink} strokeWidth={3.5} />
          <rect x={14} y={14} width={282} height={382} fill="none" stroke="#8C5B36" strokeWidth={10} />
          <line x1={155} y1={14} x2={155} y2={396} stroke="#8C5B36" strokeWidth={8} />
          <line x1={14} y1={205} x2={296} y2={205} stroke="#8C5B36" strokeWidth={8} />
          {/* Striped cotton curtain tied to left */}
          <path d="M 8 10 L 92 10 L 58 240 L 82 396 L 8 396 Z" fill="#D59A6A" stroke={ink} strokeWidth={2.2} opacity={0.85} />
        </g>

        {/* Wall Shelf with Brass Pot & Picture Frame */}
        <g transform="translate(560, 440)">
          <rect x={0} y={110} width={360} height={16} rx={3} fill="#7B4B2A" stroke={ink} strokeWidth={2.5} />
          <rect x={30} y={16} width={96} height={94} rx={4} fill="#FAF3E3" stroke={ink} strokeWidth={2.5} />
          <circle cx={78} cy={58} r={22} fill="#0F3D36" opacity={0.25} />
          <path d="M 225 110 C 210 82 222 52 246 52 C 270 52 282 82 267 110 Z" fill="#C49A36" stroke={ink} strokeWidth={2.4} />
        </g>

        {/* Editorial Tiled Floor */}
        <rect x={0} y={1240} width={1080} height={680} fill="#B89068" stroke={ink} strokeWidth={2.6} />

        {/* Ruksana untying her saree knot (আঁচলের গিঁট) to pay for sweets */}
        <ellipse cx={324} cy={1352} rx={114} ry={20} fill="#5C3B21" opacity={0.28} />
        <CharacterRig
          preset="ruksanaFaded"
          frame={localFrame}
          x={324}
          y={1142}
          scale={1.34}
          expression="neutral"
          leftArmAngle={26}
          leftElbowBend={14}
          rightArmAngle={-64}
          rightElbowBend={28}
          rightProp="cashEnvelope"
          eyeLookX={0.4}
          eyeLookY={0.4}
          headTiltDeg={6}
        />

        {/* Editorial Magnifier Inset Callout highlighting আঁচলের গিঁট */}
        <g transform="translate(402, 1216)">
          <circle cx={0} cy={0} r={54 + Math.sin(localFrame * 0.18) * 3} fill="none" stroke="#D4AF37" strokeWidth={4} strokeDasharray="8 6" />
          <rect x={-114} y={62} width={228} height={46} rx={8} fill="#0F3D36" stroke={ink} strokeWidth={2.5} />
          <text x={0} y={93} textAnchor="middle" fill="#FEF08A" fontSize={24} fontWeight={700} fontFamily={fontFamily}>
            আঁচলের গিঁট
          </text>
        </g>

        {/* Sakib watching with trembling hands & cold sweat */}
        <ellipse cx={735} cy={1358} rx={110} ry={20} fill="#5C3B21" opacity={0.28} />
        <CharacterRig
          preset="sakib18"
          frame={localFrame}
          x={735 + sakibTremble}
          y={1152}
          scale={1.28}
          expression="worried"
          leftArmAngle={34}
          leftElbowBend={28}
          rightArmAngle={-34}
          rightElbowBend={-28}
          sweatDrop={true}
          eyeLookX={-0.8}
          headTiltDeg={-5}
        />
      </svg>

      {/* Top Editorial Era Stamp inside Safe Zone (y: 195..260) */}
      <div
        style={{
          position: 'absolute',
          left: 80,
          top: 195,
          padding: '11px 28px',
          borderRadius: 12,
          backgroundColor: partBOpacity < 0.5 ? '#5C3A21' : '#0F3D36',
          border: '2.5px solid #241A15',
          outline: '2px solid #D4AF37',
          outlineOffset: -6,
          color: '#FFFBEB',
          fontSize: 30,
          fontWeight: 700,
          boxShadow: '5px 6px 0 rgba(20, 15, 12, 0.45)',
          zIndex: 20,
        }}
      >
        {partBOpacity < 0.5 ? '১ বছর ধরে · মায়ের নীরব ত্যাগ' : 'আজ · আঁচলের গিঁট খুলে মিষ্টি'}
      </div>
    </div>
  );
};
