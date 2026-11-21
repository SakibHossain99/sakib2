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

/**
 * BESPOKE LAW 34 EDITORIAL 2D MOTION GRAPHIC METAPHOR:
 * "The Golden Balance Scale of Self-Valuation vs. How the World Prices You"
 * - Left Pan (Weighed down, Crimson): Bowed figure with a hanging "কম দাম" markdown tag
 *   being pushed downward by pointing fingers & judging crowd eyes.
 * - Right Pan (Elevated high, Emerald-Gold): Upright figure crowning themselves with
 *   dignity while crowd hands rise in salute.
 */
export const Scene06MirrorGraphic: React.FC<SceneProps> = ({
  localFrame,
  durationInFrames,
  fontFamily,
}) => {
  const { fps } = useVideoConfig();

  const headerSpring = spring({ frame: localFrame, fps, config: { damping: 16, stiffness: 185 } });
  const scaleSpring = spring({ frame: Math.max(0, localFrame - 8), fps, config: { damping: 12, stiffness: 95 } });
  const crownStart = Math.round(durationInFrames * 0.34);
  const sealSpring = spring({
    frame: Math.max(0, localFrame - crownStart),
    fps,
    config: { damping: 15, stiffness: 160 },
  });

  // Dramatic physical balance tilt: starts level (0°), then right pan rises (-11°) while left pan drops!
  const beamTiltDeg = interpolate(scaleSpring, [0, 1], [3, -10.5]) + Math.sin(localFrame * 0.08) * 1.1;
  const tiltRad = (beamTiltDeg * Math.PI) / 180;
  const halfBeam = 228;
  const pivotX = 500;
  const pivotY = 472;

  const leftHookX = pivotX - Math.cos(tiltRad) * halfBeam;
  const leftHookY = pivotY - Math.sin(tiltRad) * halfBeam;
  const rightHookX = pivotX + Math.cos(tiltRad) * halfBeam;
  const rightHookY = pivotY + Math.sin(tiltRad) * halfBeam;

  // Self-crowning arm motion on right pan figure
  const selfCrownLift = interpolate(scaleSpring, [0, 1], [18, 0]);
  const fingerPress = Math.sin(localFrame * 0.22) * 5;
  const ink = '#191412';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        fontFamily,
        backgroundColor: '#141B24',
      }}
    >
      {/* Hand-Inked 2D Editorial Balance Scale & Self-Worth Metaphor Stage */}
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        {/* Archival Drafting Board Lines */}
        <g stroke="#263445" strokeWidth={1.2} opacity={0.55}>
          {[260, 380, 500, 620, 740, 860, 980, 1100, 1220, 1340].map((y) => (
            <line key={`h_${y}`} x1={55} y1={y} x2={945} y2={y} />
          ))}
          {[120, 260, 400, 500, 600, 740, 880].map((x) => (
            <line key={`v_${x}`} x1={x} y1={240} x2={x} y2={1340} />
          ))}
        </g>

        {/* Editorial Ink Spotlight Backdrop Circles behind the two pans */}
        <circle cx={leftHookX} cy={leftHookY + 210} r={190} fill="#7F1D1D" opacity={0.22} />
        <circle cx={rightHookX} cy={rightHookY + 210} r={195} fill="#0F4C42" opacity={0.28} />

        {/* === CENTRAL VINTAGE BRASS FULCRUM PILLAR === */}
        <g>
          {/* Heavy stepped brass pedestal resting cleanly above synthesis card */}
          <path d="M 418 1020 L 582 1020 L 564 988 L 436 988 Z" fill="#9E7628" stroke={ink} strokeWidth={3} />
          <path d="M 444 988 L 556 988 L 542 962 L 458 962 Z" fill="#C99E3D" stroke={ink} strokeWidth={3} />
          {/* Vertical fluted central brass column */}
          <rect x={486} y={472} width={28} height={490} fill="#D4AF37" stroke={ink} strokeWidth={3} />
          <line x1={496} y1={488} x2={496} y2={952} stroke="#8A631A" strokeWidth={2.5} />
          <line x1={506} y1={488} x2={506} y2={952} stroke="#FEF08A" strokeWidth={2} opacity={0.7} />
          {/* Top finial ornament */}
          <path d="M 482 472 L 500 412 L 518 472 Z" fill="#E5C04B" stroke={ink} strokeWidth={3} />
          <circle cx={500} cy={406} r={11} fill="#FDE047" stroke={ink} strokeWidth={2.6} />
        </g>

        {/* === TILTING BRASS BALANCE BEAM === */}
        <g transform={`translate(${pivotX}, ${pivotY}) rotate(${beamTiltDeg})`}>
          <path
            d={`M ${-halfBeam - 14} 0 Q -120 -18 0 -10 Q 120 -18 ${halfBeam + 14} 0 L ${halfBeam + 14} 12 Q 120 -2 0 12 Q -120 -2 ${-halfBeam - 14} 12 Z`}
            fill="#E2B948"
            stroke={ink}
            strokeWidth={3}
            strokeLinejoin="round"
          />
          <circle cx={-halfBeam} cy={6} r={10} fill="#FAF3E3" stroke={ink} strokeWidth={2.6} />
          <circle cx={halfBeam} cy={6} r={10} fill="#FAF3E3" stroke={ink} strokeWidth={2.6} />
          {/* Center pivot medallion */}
          <circle cx={0} cy={2} r={19} fill="#104138" stroke={ink} strokeWidth={3} />
          <circle cx={0} cy={2} r={9} fill="#FDE047" stroke={ink} strokeWidth={2} />
        </g>

        {/* === LEFT PAN (WEIGHED DOWN): BOWED FIGURE + MARKDOWN PRICE TAG + JUDGING CROWD === */}
        <g transform={`translate(${leftHookX}, ${leftHookY + 8})`}>
          {/* Hanging brass suspension chains */}
          <line x1={0} y1={0} x2={-118} y2={250} stroke="#C99E3D" strokeWidth={3.5} />
          <line x1={0} y1={0} x2={118} y2={250} stroke="#C99E3D" strokeWidth={3.5} />
          <line x1={0} y1={0} x2={0} y2={250} stroke="#A17B2A" strokeWidth={2.2} strokeDasharray="5 4" />

          {/* Pointing Judgmental Crowd Fingers & Eyes pushing down on the left pan! */}
          <g transform={`translate(0, ${44 + fingerPress})`}>
            {/* Top peering judging eyes */}
            {[-64, 64].map((ex, i) => (
              <g key={i} transform={`translate(${ex}, 0)`}>
                <path d="M -26 0 Q 0 -18 26 0 Q 0 18 -26 0 Z" fill="#FAF3E3" stroke={ink} strokeWidth={2.4} />
                <circle cx={0} cy={2} r={8.5} fill="#991B1B" stroke={ink} strokeWidth={1.8} />
                <circle cx={0} cy={2} r={3.5} fill="#0F0B0A" />
              </g>
            ))}
            {/* Downward red force arrows */}
            <path d="M -64 26 L -64 56 M -72 48 L -64 58 L -56 48" fill="none" stroke="#E05A47" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 64 26 L 64 56 M 56 48 L 64 58 L 72 48" fill="none" stroke="#E05A47" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
          </g>

          {/* Bowed, Shrinking 2D Figure standing on the sunken Left Pan */}
          <g transform="translate(0, 174)">
            {/* Slumped torso */}
            <path d="M -42 74 C -46 20 -26 -8 8 -4 C 34 0 42 30 38 74 Z" fill="#7D3032" stroke={ink} strokeWidth={2.8} />
            {/* Bowed head tilted down */}
            <circle cx={14} cy={-26} r={24} fill="#D49B74" stroke={ink} strokeWidth={2.6} />
            <path d="M -8 -30 C -6 -52 28 -54 36 -30 C 20 -40 -2 -38 -8 -30 Z" fill="#1C222B" stroke={ink} strokeWidth={2} />
            {/* Sad downturned eyes */}
            <path d="M 14 -20 L 24 -18" stroke={ink} strokeWidth={2.2} strokeLinecap="round" />
            {/* Hanging Crimson "কম দাম" Markdown Price Tag around neck! */}
            <g transform="translate(-44, 18) rotate(-14)">
              <line x1={26} y1={-16} x2={6} y2={0} stroke="#FAF3E3" strokeWidth={2} />
              <rect x={-52} y={0} width={96} height={36} rx={5} fill="#DC2626" stroke={ink} strokeWidth={2.4} />
              <circle cx={34} cy={18} r={4} fill="#FAF3E3" stroke={ink} strokeWidth={1.4} />
              <text x={-10} y={24} textAnchor="middle" fill="#FFFDF7" fontSize={18} fontWeight={700} fontFamily={fontFamily}>
                কম দাম
              </text>
            </g>
          </g>

          {/* Heavy Crimson-Rimmed Brass Scale Pan */}
          <path d="M -132 250 L 132 250 C 118 282 -118 282 -132 250 Z" fill="#9E2A2B" stroke={ink} strokeWidth={3.2} />
          <rect x={-138} y={244} width={276} height={11} rx={4} fill="#D4AF37" stroke={ink} strokeWidth={2.4} />
        </g>

        {/* === RIGHT PAN (ELEVATED HIGH): SELF-CROWNING ROYAL FIGURE + RESPECTFUL SALUTES === */}
        <g transform={`translate(${rightHookX}, ${rightHookY + 8})`}>
          {/* Hanging brass suspension chains */}
          <line x1={0} y1={0} x2={-118} y2={250} stroke="#E2B948" strokeWidth={3.5} />
          <line x1={0} y1={0} x2={118} y2={250} stroke="#E2B948" strokeWidth={3.5} />
          <line x1={0} y1={0} x2={0} y2={250} stroke="#C99E3D" strokeWidth={2.2} strokeDasharray="5 4" />

          {/* Sunburst Ink Rays behind the Upright Royal Figure */}
          <g transform="translate(0, 148)" opacity={0.45}>
            {[-60, -30, 0, 30, 60].map((deg) => (
              <line
                key={deg}
                x1={0}
                y1={-76}
                x2={0}
                y2={-106}
                stroke="#FDE047"
                strokeWidth={3.5}
                strokeLinecap="round"
                transform={`rotate(${deg})`}
              />
            ))}
          </g>

          {/* Upright, Broad-Shouldered 2D Figure Placing Self-Forged Golden Crown on Own Head! */}
          <g transform="translate(0, 174)">
            {/* Broad confident emerald-gold torso */}
            <path d="M -46 74 L -40 -2 C -40 -14 40 -14 40 -2 L 46 74 Z" fill="#134E44" stroke={ink} strokeWidth={2.8} />
            <path d="M -14 -8 L 0 26 L 14 -8" fill="none" stroke="#D4AF37" strokeWidth={3.5} />
            {/* Left & Right Articulated Arms lifted gracefully placing the crown (crisp outer ink outline) */}
            <path d="M -40 4 L -64 -26 L -34 -62" fill="none" stroke={ink} strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" />
            <path d="M -40 4 L -64 -26 L -34 -62" fill="none" stroke="#134E44" strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 40 4 L 64 -26 L 34 -62" fill="none" stroke={ink} strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 40 4 L 64 -26 L 34 -62" fill="none" stroke="#134E44" strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
            {/* Upright dignified head */}
            <circle cx={0} cy={-36} r={24} fill="#DDA27B" stroke={ink} strokeWidth={2.6} />
            <path d="M -23 -42 C -22 -64 22 -64 23 -42 C 12 -52 -12 -52 -23 -42 Z" fill="#1C222B" stroke={ink} strokeWidth={2} />
            {/* Calm confident smile */}
            <path d="M -7 -26 Q 0 -20 7 -26" fill="none" stroke={ink} strokeWidth={2.2} strokeLinecap="round" />
            {/* Self-Forged Golden Crown settling neatly onto head! */}
            <g transform={`translate(0, ${-68 - selfCrownLift})`}>
              <path
                d="M -28 10 L -34 -14 L -14 -2 L 0 -22 L 14 -2 L 34 -14 L 28 10 Z"
                fill="#F4C94E"
                stroke={ink}
                strokeWidth={2.6}
                strokeLinejoin="round"
              />
              <rect x={-28} y={10} width={56} height={7} rx={2} fill="#C49228" stroke={ink} strokeWidth={2} />
              <circle cx={0} cy={2} r={3.5} fill="#2EC4B6" stroke={ink} strokeWidth={1.2} />
            </g>
          </g>

          {/* Respectful Gold Check Seals floating on either side */}
          <g transform="translate(-88, 180)">
            <circle cx={0} cy={0} r={16} fill="#0F3D36" stroke="#D4AF37" strokeWidth={2.5} />
            <path d="M -6 0 L -1 5 L 7 -5" fill="none" stroke="#FDE047" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <g transform="translate(88, 180)">
            <circle cx={0} cy={0} r={16} fill="#0F3D36" stroke="#D4AF37" strokeWidth={2.5} />
            <path d="M -6 0 L -1 5 L 7 -5" fill="none" stroke="#FDE047" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
          </g>

          {/* Elevated Emerald-Gold Brass Scale Pan */}
          <path d="M -132 250 L 132 250 C 118 282 -118 282 -132 250 Z" fill="#104138" stroke={ink} strokeWidth={3.2} />
          <rect x={-138} y={244} width={276} height={11} rx={4} fill="#F4C94E" stroke={ink} strokeWidth={2.4} />
        </g>
      </svg>

      {/* Top Editorial Header Plaque (x: 68..932, y: 190..275) */}
      <div
        style={{
          position: 'absolute',
          left: 68,
          top: 190,
          width: 864,
          textAlign: 'center',
          transform: `translateY(${(1 - headerSpring) * -18}px)`,
          opacity: headerSpring,
          zIndex: 20,
        }}
      >
        <div
          style={{
            display: 'inline-block',
            padding: '11px 32px',
            borderRadius: 14,
            backgroundColor: '#1B2533',
            border: '3px solid #0B0E12',
            outline: '2.5px solid #D4AF37',
            outlineOffset: -6,
            boxShadow: '6px 7px 0 rgba(8, 10, 14, 0.72)',
            color: '#FEF3C7',
            fontSize: 38,
            fontWeight: 700,
          }}
        >
          নিজের দাম বনাম দুনিয়ার চোখ
        </div>
      </div>

      {/* Left Pan Editorial Verdict Plaque (strictly inside x: 64..472, y: 842..982) */}
      <div
        style={{
          position: 'absolute',
          left: 64,
          top: 842,
          width: 404,
          padding: '16px 20px',
          borderRadius: 14,
          backgroundColor: '#5B1A1C',
          border: '3px solid #140B0C',
          outline: '2px solid #E05A47',
          outlineOffset: -5,
          boxShadow: '5px 6px 0 rgba(8, 6, 8, 0.7)',
          color: '#FEE2E2',
          fontSize: 27,
          fontWeight: 700,
          lineHeight: 1.32,
          textAlign: 'center',
          zIndex: 22,
        }}
      >
        ✕ মাথা নিচু + কৈফিয়ত = দুনিয়ার খোঁটা ও করুণা
      </div>

      {/* Right Pan Editorial Verdict Plaque (strictly inside x: 528..936, y: 810..950) */}
      <div
        style={{
          position: 'absolute',
          left: 528,
          top: 810,
          width: 408,
          padding: '16px 20px',
          borderRadius: 14,
          backgroundColor: '#104138',
          border: '3px solid #0B1211',
          outline: '2.5px solid #D4AF37',
          outlineOffset: -5,
          boxShadow: '5px 6px 0 rgba(8, 10, 12, 0.72)',
          color: '#FEF9C3',
          fontSize: 27,
          fontWeight: 700,
          lineHeight: 1.32,
          textAlign: 'center',
          zIndex: 22,
        }}
      >
        ✓ মাথা উঁচু + আত্মমর্যাদা = রাজার মতো সম্মান
      </div>

      {/* Bottom Hand-Inked Royal Crest Synthesis Banner (y: 1084..1310, cleanly above SubtitleBar at y: 1382) */}
      <div
        style={{
          position: 'absolute',
          left: 76,
          top: 1084,
          width: 848,
          padding: '22px 54px',
          borderRadius: 16,
          backgroundColor: '#1A2422',
          border: '3px solid #0B0E12',
          outline: '3px solid #D4AF37',
          outlineOffset: -7,
          boxShadow: '7px 8px 0 rgba(7, 9, 12, 0.78)',
          color: '#FFFBEB',
          fontSize: 34,
          fontWeight: 700,
          lineHeight: 1.36,
          textAlign: 'center',
          textWrap: 'balance',
          transform: `scale(${0.92 + sealSpring * 0.08})`,
          opacity: sealSpring,
          zIndex: 24,
        }}
      >
        রাজা মানে টাকা বা রেজাল্ট না—নিজের দাম নিজে ঠিক করা
      </div>
    </div>
  );
};
