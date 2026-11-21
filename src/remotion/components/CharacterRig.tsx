import React from 'react';
import { clampArmAngles, getBlinkScaleY, getLipSyncShape } from '../../lib/timeline';

export type CharacterPreset =
  | 'sakib18'
  | 'sakib23'
  | 'ruksanaFaded'
  | 'ruksanaRoyal'
  | 'aunty'
  | 'nadim'
  | 'tanvir';

export type Expression =
  | 'neutral'
  | 'shocked'
  | 'worried'
  | 'smirk'
  | 'angry'
  | 'sad'
  | 'realization'
  | 'happy';

export type HandProp =
  | 'none'
  | 'phone'
  | 'sweetBox'
  | 'sweetTray'
  | 'resultSheet'
  | 'cashEnvelope'
  | 'teacup';

export interface CharacterRigProps {
  preset: CharacterPreset;
  frame: number;
  x?: number;
  y?: number;
  scale?: number;
  flipX?: boolean;
  expression?: Expression;
  isTalking?: boolean;
  /** Strictly >= 0 degrees (rotates clockwise LEFT / OUTWARD / UP) */
  leftArmAngle?: number;
  /** Strictly <= 0 degrees (rotates counter-clockwise RIGHT / OUTWARD / UP) */
  rightArmAngle?: number;
  /** Optional realistic elbow articulation bend in degrees */
  leftElbowBend?: number;
  rightElbowBend?: number;
  leftProp?: HandProp;
  rightProp?: HandProp;
  headTiltDeg?: number;
  sweatDrop?: boolean;
  eyeLookX?: number;
  eyeLookY?: number;
  breathPhase?: number;
  idSuffix?: string;
}

interface CharacterAppearance {
  skinBase: string;
  skinCelShadow: string;
  skinWarmBlush: string;
  inkColor: string;
  hairBase: string;
  hairHighlight: string;
  outfitPrimary: string;
  outfitCelShadow: string;
  outfitAccent: string;
  trouserOrSkirt: string;
  isFemale: boolean;
  hasSaree: boolean;
  hasSareeKnot: boolean;
  hasBindi: boolean;
  hasNosePin: boolean;
  hasSpectacles: boolean;
  hasMustache: boolean;
  hasStubble: boolean;
  hasAgeLines: boolean;
  hasWristwatch: boolean;
  hasGoldBangles: boolean;
  hasRoyalJewelry: boolean;
  hasJacket: boolean;
  shoulderWidth: number;
  jawWidth: number;
  headScale: number;
  blinkPeriod: number;
}

const APPEARANCES: Record<CharacterPreset, CharacterAppearance> = {
  sakib18: {
    skinBase: '#DDA27B',
    skinCelShadow: '#BE7F58',
    skinWarmBlush: '#D96B52',
    inkColor: '#231915',
    hairBase: '#1C222B',
    hairHighlight: '#3B485C',
    outfitPrimary: '#7FA8C9',
    outfitCelShadow: '#5C84A6',
    outfitAccent: '#F0F5F9',
    trouserOrSkirt: '#283240',
    isFemale: false,
    hasSaree: false,
    hasSareeKnot: false,
    hasBindi: false,
    hasNosePin: false,
    hasSpectacles: false,
    hasMustache: false,
    hasStubble: false,
    hasAgeLines: false,
    hasWristwatch: false,
    hasGoldBangles: false,
    hasRoyalJewelry: false,
    hasJacket: false,
    shoulderWidth: 138,
    jawWidth: 46,
    headScale: 1,
    blinkPeriod: 98,
  },
  sakib23: {
    skinBase: '#D99B72',
    skinCelShadow: '#B87850',
    skinWarmBlush: '#D1654E',
    inkColor: '#1E1613',
    hairBase: '#192029',
    hairHighlight: '#415064',
    outfitPrimary: '#1E4D5C',
    outfitCelShadow: '#133540',
    outfitAccent: '#D4AF37',
    trouserOrSkirt: '#1B222C',
    isFemale: false,
    hasSaree: false,
    hasSareeKnot: false,
    hasBindi: false,
    hasNosePin: false,
    hasSpectacles: false,
    hasMustache: false,
    hasStubble: true,
    hasAgeLines: false,
    hasWristwatch: true,
    hasGoldBangles: false,
    hasRoyalJewelry: false,
    hasJacket: false,
    shoulderWidth: 150,
    jawWidth: 50,
    headScale: 1,
    blinkPeriod: 112,
  },
  ruksanaFaded: {
    skinBase: '#D59973',
    skinCelShadow: '#B47651',
    skinWarmBlush: '#D66E59',
    inkColor: '#241A16',
    hairBase: '#1F2127',
    hairHighlight: '#5A5E6B',
    outfitPrimary: '#4A7A78',
    outfitCelShadow: '#345B59',
    outfitAccent: '#A9C3C0',
    trouserOrSkirt: '#38615F',
    isFemale: true,
    hasSaree: true,
    hasSareeKnot: true,
    hasBindi: true,
    hasNosePin: true,
    hasSpectacles: false,
    hasMustache: false,
    hasStubble: false,
    hasAgeLines: true,
    hasWristwatch: false,
    hasGoldBangles: false,
    hasRoyalJewelry: false,
    hasJacket: false,
    shoulderWidth: 134,
    jawWidth: 44,
    headScale: 0.98,
    blinkPeriod: 116,
  },
  ruksanaRoyal: {
    skinBase: '#D99E78',
    skinCelShadow: '#B87A54',
    skinWarmBlush: '#DA6D57',
    inkColor: '#241915',
    hairBase: '#1D1F26',
    hairHighlight: '#565A66',
    outfitPrimary: '#9E2A2B',
    outfitCelShadow: '#731B1C',
    outfitAccent: '#D4AF37',
    trouserOrSkirt: '#7A1E1F',
    isFemale: true,
    hasSaree: true,
    hasSareeKnot: false,
    hasBindi: true,
    hasNosePin: true,
    hasSpectacles: false,
    hasMustache: false,
    hasStubble: false,
    hasAgeLines: true,
    hasWristwatch: false,
    hasGoldBangles: true,
    hasRoyalJewelry: true,
    hasJacket: false,
    shoulderWidth: 136,
    jawWidth: 44,
    headScale: 0.98,
    blinkPeriod: 118,
  },
  aunty: {
    skinBase: '#CF926D',
    skinCelShadow: '#AC6F4B',
    skinWarmBlush: '#D66560',
    inkColor: '#23171A',
    hairBase: '#1B1A22',
    hairHighlight: '#4E475C',
    outfitPrimary: '#7A2E63',
    outfitCelShadow: '#541C44',
    outfitAccent: '#E2B84A',
    trouserOrSkirt: '#5D204B',
    isFemale: true,
    hasSaree: true,
    hasSareeKnot: false,
    hasBindi: true,
    hasNosePin: true,
    hasSpectacles: false,
    hasMustache: false,
    hasStubble: false,
    hasAgeLines: true,
    hasWristwatch: false,
    hasGoldBangles: true,
    hasRoyalJewelry: false,
    hasJacket: false,
    shoulderWidth: 142,
    jawWidth: 47,
    headScale: 0.99,
    blinkPeriod: 92,
  },
  nadim: {
    skinBase: '#D2946C',
    skinCelShadow: '#AF724D',
    skinWarmBlush: '#D46A52',
    inkColor: '#201814',
    hairBase: '#1B2129',
    hairHighlight: '#435061',
    outfitPrimary: '#3B6E5C',
    outfitCelShadow: '#284F41',
    outfitAccent: '#F5F7F6',
    trouserOrSkirt: '#232D38',
    isFemale: false,
    hasSaree: false,
    hasSareeKnot: false,
    hasBindi: false,
    hasNosePin: false,
    hasSpectacles: false,
    hasMustache: false,
    hasStubble: true,
    hasAgeLines: false,
    hasWristwatch: false,
    hasGoldBangles: false,
    hasRoyalJewelry: false,
    hasJacket: true,
    shoulderWidth: 144,
    jawWidth: 48,
    headScale: 1,
    blinkPeriod: 95,
  },
  tanvir: {
    skinBase: '#CE916B',
    skinCelShadow: '#AA6E4A',
    skinWarmBlush: '#CC6853',
    inkColor: '#231A16',
    hairBase: '#2A2D34',
    hairHighlight: '#969CA8',
    outfitPrimary: '#F2ECE1',
    outfitCelShadow: '#DDD2BF',
    outfitAccent: '#C5A25C',
    trouserOrSkirt: '#4A433B',
    isFemale: false,
    hasSaree: false,
    hasSareeKnot: false,
    hasBindi: false,
    hasNosePin: false,
    hasSpectacles: true,
    hasMustache: true,
    hasStubble: false,
    hasAgeLines: true,
    hasWristwatch: true,
    hasGoldBangles: false,
    hasRoyalJewelry: false,
    hasJacket: false,
    shoulderWidth: 148,
    jawWidth: 50,
    headScale: 1.01,
    blinkPeriod: 114,
  },
};

function renderSculptedHand(
  side: 'left' | 'right',
  skinBase: string,
  skinShadow: string,
  ink: string,
  holdingProp: boolean,
  isTalking: boolean,
  frame: number,
): React.ReactNode {
  const dir = side === 'left' ? -1 : 1;
  const fingerCurl = holdingProp ? 1 : isTalking ? Math.sin(frame * 0.25) * 0.5 : 0;

  return (
    <g transform={`scale(${dir}, 1)`}>
      {/* Sculpted Palm */}
      <path
        d="M -11 -4 C -13 6 -12 16 -5 20 L 8 20 C 14 16 14 5 11 -4 Z"
        fill={skinBase}
        stroke={ink}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      {/* Thumb */}
      <path
        d={holdingProp ? 'M -10 2 C -17 4 -18 12 -11 14' : 'M -10 1 C -19 2 -20 11 -13 14'}
        fill={skinBase}
        stroke={ink}
        strokeWidth={2}
        strokeLinecap="round"
      />
      {/* Four articulated fingers with subtle ink separations */}
      <g transform={`translate(0, ${holdingProp ? -2 : 0})`}>
        <path
          d={`M -6 17 L -7 ${27 - fingerCurl * 4} C -7 ${30 - fingerCurl * 4} -2 ${30 - fingerCurl * 4} -2 ${27 - fingerCurl * 4} L -1 17`}
          fill={skinBase}
          stroke={ink}
          strokeWidth={1.8}
          strokeLinecap="round"
        />
        <path
          d={`M -1 18 L -1 ${29 - fingerCurl * 4} C -1 ${32 - fingerCurl * 4} 4 ${32 - fingerCurl * 4} 4 ${29 - fingerCurl * 4} L 4 18`}
          fill={skinBase}
          stroke={ink}
          strokeWidth={1.8}
          strokeLinecap="round"
        />
        <path
          d={`M 4 17 L 5 ${27 - fingerCurl * 4} C 5 ${30 - fingerCurl * 4} 9 ${30 - fingerCurl * 4} 9 ${27 - fingerCurl * 4} L 9 16`}
          fill={skinShadow}
          stroke={ink}
          strokeWidth={1.8}
          strokeLinecap="round"
        />
        <path
          d={`M 8 15 L 10 ${23 - fingerCurl * 3} C 10 ${25 - fingerCurl * 3} 13 ${25 - fingerCurl * 3} 13 ${22 - fingerCurl * 3} L 12 13`}
          fill={skinShadow}
          stroke={ink}
          strokeWidth={1.7}
          strokeLinecap="round"
        />
      </g>
    </g>
  );
}

function renderHandProp(
  prop: HandProp,
  side: 'left' | 'right',
  frame: number,
  totalArmAngle: number,
  ink: string,
): React.ReactNode {
  if (prop === 'none') return null;
  const dir = side === 'left' ? -1 : 1;
  const uprightRotate = -totalArmAngle;

  switch (prop) {
    case 'phone':
      return (
        <g transform={`rotate(${uprightRotate}) translate(${dir * 8}, -22) rotate(${dir * -8})`}>
          {/* Hand-inked 2D smartphone */}
          <rect x={-23} y={-46} width={46} height={82} rx={9} fill="#1E2530" stroke={ink} strokeWidth={2.5} />
          <rect x={-18} y={-39} width={36} height={65} rx={5} fill="#F8FAFC" stroke="#334155" strokeWidth={1.5} />
          <rect x={-15} y={-34} width={30} height={8} rx={2} fill="#0F3D36" />
          <rect x={-15} y={-21} width={30} height={19} rx={3} fill="#DC2626" />
          <text x={0} y={-7} textAnchor="middle" fill="#FFFFFF" fontSize={10.5} fontWeight={700}>2.80</text>
          <line x1={-13} y1={5} x2={13} y2={5} stroke="#94A3B8" strokeWidth={2.5} strokeLinecap="round" />
          <line x1={-13} y1={13} x2={8} y2={13} stroke="#CBD5E1" strokeWidth={2.5} strokeLinecap="round" />
          <circle cx={0} cy={31} r={2.5} fill="#64748B" />
        </g>
      );

    case 'sweetBox':
      return (
        <g transform={`rotate(${uprightRotate}) translate(${dir * 12}, -16)`}>
          {/* Editorial 2D festive sweet box with gold ribbon & crisp ink */}
          <rect x={-44} y={-26} width={88} height={50} rx={7} fill="#A92022" stroke={ink} strokeWidth={2.5} />
          <rect x={-44} y={-26} width={88} height={15} rx={5} fill="#C8282B" stroke={ink} strokeWidth={2} />
          <rect x={-8} y={-26} width={16} height={50} fill="#E5B946" stroke={ink} strokeWidth={1.8} />
          <rect x={-44} y={-6} width={88} height={11} fill="#D4AF37" stroke={ink} strokeWidth={1.5} />
          <ellipse cx={-10} cy={-31} rx={12} ry={6.5} fill="#F6D569" stroke={ink} strokeWidth={1.8} />
          <ellipse cx={10} cy={-31} rx={12} ry={6.5} fill="#F6D569" stroke={ink} strokeWidth={1.8} />
          <circle cx={0} cy={-30} r={4.5} fill="#D97706" stroke={ink} strokeWidth={1.5} />
        </g>
      );

    case 'sweetTray':
      return (
        <g transform={`rotate(${uprightRotate}) translate(${dir * 20}, -14)`}>
          {/* Editorial brass serving tray with detailed Bengali sweets */}
          <ellipse cx={0} cy={13} rx={66} ry={16} fill="#A67C29" stroke={ink} strokeWidth={2.4} />
          <ellipse cx={0} cy={9} rx={58} ry={12} fill="#DDB657" stroke="#8A631A" strokeWidth={1.5} />
          {/* Rasgulla, Laddu, Sandesh */}
          <circle cx={-30} cy={2} r={11.5} fill="#FFF9EC" stroke={ink} strokeWidth={1.8} />
          <circle cx={-9} cy={-3} r={12} fill="#EA8C1E" stroke={ink} strokeWidth={1.8} />
          <circle cx={14} cy={0} r={11.5} fill="#FFF9EC" stroke={ink} strokeWidth={1.8} />
          <circle cx={34} cy={4} r={10.5} fill="#F5C042" stroke={ink} strokeWidth={1.8} />
          <circle cx={2} cy={-13} r={11} fill="#FFFDF7" stroke={ink} strokeWidth={1.8} />
          {/* Saffron & pistachio slivers */}
          <line x1={-32} y1={-2} x2={-27} y2={0} stroke="#15803D" strokeWidth={2.4} strokeLinecap="round" />
          <line x1={-11} y1={-7} x2={-6} y2={-5} stroke="#B91C1C" strokeWidth={2.2} strokeLinecap="round" />
          <line x1={0} y1={-17} x2={5} y2={-15} stroke="#15803D" strokeWidth={2.4} strokeLinecap="round" />
          <line x1={12} y1={-4} x2={17} y2={-2} stroke="#15803D" strokeWidth={2.4} strokeLinecap="round" />
        </g>
      );

    case 'resultSheet':
      return (
        <g transform={`rotate(${uprightRotate}) translate(${dir * 12}, -22) rotate(${dir * -6})`}>
          <rect x={-32} y={-42} width={64} height={78} rx={4} fill="#FBF6EA" stroke={ink} strokeWidth={2.2} />
          {/* Saree-knot fold creases */}
          <line x1={-32} y1={-3} x2={32} y2={-3} stroke="#C7BBA6" strokeWidth={1.8} strokeDasharray="4 3" />
          <line x1={0} y1={-42} x2={0} y2={36} stroke="#DDD3C0" strokeWidth={1.4} strokeDasharray="4 3" />
          <rect x={-23} y={-34} width={46} height={8} rx={2} fill="#1E3A5F" />
          <line x1={-23} y1={-19} x2={18} y2={-19} stroke="#94A3B8" strokeWidth={3} strokeLinecap="round" />
          <line x1={-23} y1={-12} x2={10} y2={-12} stroke="#CBD5E1" strokeWidth={2.5} strokeLinecap="round" />
          <rect x={-24} y={5} width={48} height={20} rx={3} fill="#FEE2E2" stroke="#B91C1C" strokeWidth={1.8} />
          <text x={0} y={19} textAnchor="middle" fill="#991B1B" fontSize={12} fontWeight={700}>GPA 2.80</text>
        </g>
      );

    case 'cashEnvelope':
      return (
        <g transform={`rotate(${uprightRotate}) translate(${dir * 12}, -12)`}>
          <rect x={-35} y={-18} width={70} height={36} rx={5} fill="#2A7B4F" stroke={ink} strokeWidth={2.2} />
          <rect x={-29} y={-13} width={58} height={26} rx={3} fill="#3FA06B" />
          <rect x={-9} y={-18} width={18} height={36} fill="#F4D37E" stroke={ink} strokeWidth={1.6} />
          <text x={0} y={6} textAnchor="middle" fill="#1C3A28" fontSize={15} fontWeight={700}>৳</text>
        </g>
      );

    case 'teacup': {
      const steamShift = Math.sin(frame * 0.14) * 3.5;
      return (
        <g transform={`rotate(${uprightRotate}) translate(${dir * 4}, -16)`}>
          <path
            d={`M -6 -22 Q ${-11 + steamShift} -33 -4 -43`}
            fill="none"
            stroke="#FFFDF7"
            strokeWidth={2.4}
            strokeLinecap="round"
            opacity={0.78}
          />
          <path
            d={`M 6 -22 Q ${11 - steamShift} -34 4 -45`}
            fill="none"
            stroke="#FFFDF7"
            strokeWidth={2.2}
            strokeLinecap="round"
            opacity={0.62}
          />
          <path d="M 16 -10 C 28 -10 28 8 15 8" fill="none" stroke={ink} strokeWidth={6} strokeLinecap="round" />
          <path d="M 16 -10 C 27 -10 27 8 15 8" fill="none" stroke="#FFFDF8" strokeWidth={3.2} strokeLinecap="round" />
          <path
            d="M -18 -16 L 18 -16 L 14 14 C 12 20 -12 20 -14 14 Z"
            fill="#FFFDF8"
            stroke={ink}
            strokeWidth={2.2}
          />
          <line x1={-15} y1={-4} x2={15} y2={-4} stroke="#D4AF37" strokeWidth={2.5} />
          <ellipse cx={0} cy={-16} rx={18} ry={5} fill="#A35216" stroke={ink} strokeWidth={1.8} />
        </g>
      );
    }

    default:
      return null;
  }
}

function renderMouth(expression: Expression, lipShape: 0 | 1 | 2 | 3, ink: string): React.ReactNode {
  if (lipShape > 0) {
    if (lipShape === 1) {
      return (
        <g>
          <path d="M -12 36 Q 0 33 12 36 Q 10 46 0 46 Q -10 46 -12 36 Z" fill="#5D1E26" stroke={ink} strokeWidth={2} />
          <path d="M -8 36 L 8 36 L 7 40 L -7 40 Z" fill="#FFFDF8" />
          <ellipse cx={0} cy={43.5} rx={5.5} ry={2.2} fill="#C85B68" />
        </g>
      );
    }
    if (lipShape === 2) {
      return (
        <g>
          <path d="M -15 35 Q 0 31 15 35 Q 14 50 0 50 Q -14 50 -15 35 Z" fill="#5D1E26" stroke={ink} strokeWidth={2} />
          <path d="M -11 35 L 11 35 L 10 40 L -10 40 Z" fill="#FFFDF8" />
          <ellipse cx={0} cy={46.5} rx={8} ry={3.2} fill="#D46672" />
        </g>
      );
    }
    return (
      <g>
        <ellipse cx={0} cy={41} rx={8.5} ry={9.5} fill="#5D1E26" stroke={ink} strokeWidth={2} />
        <ellipse cx={0} cy={46} rx={4.5} ry={2.5} fill="#C85B68" />
      </g>
    );
  }

  switch (expression) {
    case 'happy':
      return (
        <g>
          <path d="M -18 35 Q 0 52 18 35 Q 0 38 -18 35 Z" fill="#632028" stroke={ink} strokeWidth={2} strokeLinejoin="round" />
          <path d="M -14 36 Q 0 42 14 36 Z" fill="#FFFDF8" />
          {/* Smile dimple corners */}
          <path d="M -21 33 Q -19 36 -21 39" fill="none" stroke={ink} strokeWidth={1.6} strokeLinecap="round" opacity={0.6} />
          <path d="M 21 33 Q 19 36 21 39" fill="none" stroke={ink} strokeWidth={1.6} strokeLinecap="round" opacity={0.6} />
        </g>
      );
    case 'shocked':
      return (
        <g>
          <ellipse cx={0} cy={42} rx={10.5} ry={12.5} fill="#5C1D24" stroke={ink} strokeWidth={2.2} />
          <path d="M -6 33 L 6 33 L 5 37 L -5 37 Z" fill="#FFFDF8" />
        </g>
      );
    case 'worried':
      return (
        <g>
          <path d="M -14 43 Q -5 36 0 40 Q 6 36 14 44" fill="none" stroke={ink} strokeWidth={3} strokeLinecap="round" />
          <path d="M -5 46 Q 0 48 5 46" fill="none" stroke="#8B553A" strokeWidth={1.6} strokeLinecap="round" />
        </g>
      );
    case 'sad':
      return (
        <g>
          <path d="M -15 44 Q 0 34 15 44" fill="none" stroke={ink} strokeWidth={3} strokeLinecap="round" />
          <path d="M -6 47 Q 0 49 6 47" fill="none" stroke="#8B553A" strokeWidth={1.6} strokeLinecap="round" />
        </g>
      );
    case 'smirk':
      return (
        <g>
          <path d="M -13 40 Q 2 43 18 32" fill="none" stroke={ink} strokeWidth={3.2} strokeLinecap="round" />
          <path d="M 16 29 Q 20 32 19 36" fill="none" stroke={ink} strokeWidth={1.8} strokeLinecap="round" opacity={0.7} />
        </g>
      );
    case 'angry':
      return <path d="M -15 43 Q 0 34 15 42" fill="none" stroke={ink} strokeWidth={3.4} strokeLinecap="round" />;
    case 'realization':
      return (
        <g>
          <path d="M -15 37 Q 0 46 15 37" fill="none" stroke={ink} strokeWidth={3} strokeLinecap="round" />
          <path d="M -5 45 Q 0 47 5 45" fill="none" stroke="#8B553A" strokeWidth={1.5} strokeLinecap="round" />
        </g>
      );
    case 'neutral':
    default:
      return (
        <g>
          <path d="M -13 38 Q 0 44 13 38" fill="none" stroke={ink} strokeWidth={2.8} strokeLinecap="round" />
          <path d="M -4 45 Q 0 47 4 45" fill="none" stroke="#8B553A" strokeWidth={1.5} strokeLinecap="round" />
        </g>
      );
  }
}

function renderBrows(expression: Expression, color: string): React.ReactNode {
  switch (expression) {
    case 'worried':
    case 'sad':
      return (
        <g fill={color}>
          <path d="M -37 -14 Q -24 -25 -9 -20 Q -10 -15 -35 -10 Z" />
          <path d="M 37 -14 Q 24 -25 9 -20 Q 10 -15 35 -10 Z" />
        </g>
      );
    case 'shocked':
      return (
        <g fill={color}>
          <path d="M -38 -22 Q -23 -35 -9 -24 Q -10 -19 -36 -18 Z" />
          <path d="M 38 -22 Q 23 -35 9 -24 Q 10 -19 36 -18 Z" />
        </g>
      );
    case 'smirk':
      return (
        <g fill={color}>
          <path d="M -37 -17 Q -22 -21 -9 -16 Q -10 -12 -36 -13 Z" />
          <path d="M 9 -20 Q 24 -34 38 -21 Q 36 -17 10 -16 Z" />
        </g>
      );
    case 'angry':
      return (
        <g fill={color}>
          <path d="M -37 -24 L -8 -14 L -10 -10 L -37 -18 Z" />
          <path d="M 37 -24 L 8 -14 L 10 -10 L 37 -18 Z" />
        </g>
      );
    case 'happy':
    case 'realization':
      return (
        <g fill={color}>
          <path d="M -37 -19 Q -22 -29 -9 -20 Q -10 -16 -36 -15 Z" />
          <path d="M 37 -19 Q 22 -29 9 -20 Q 10 -16 36 -15 Z" />
        </g>
      );
    case 'neutral':
    default:
      return (
        <g fill={color}>
          <path d="M -36 -17 Q -22 -23 -9 -17 Q -10 -13 -35 -13 Z" />
          <path d="M 36 -17 Q 22 -23 9 -17 Q 10 -13 35 -13 Z" />
        </g>
      );
  }
}

export const CharacterRig: React.FC<CharacterRigProps> = ({
  preset,
  frame,
  x = 0,
  y = 0,
  scale = 1,
  flipX = false,
  expression = 'neutral',
  isTalking = false,
  leftArmAngle = 14,
  rightArmAngle = -14,
  leftElbowBend,
  rightElbowBend,
  leftProp = 'none',
  rightProp = 'none',
  headTiltDeg = 0,
  sweatDrop = false,
  eyeLookX = 0,
  eyeLookY = 0,
  breathPhase = 0,
}) => {
  const app = APPEARANCES[preset];
  const ink = app.inkColor;

  // Lifelike breathing + subtle micro head-nod when talking
  const breathY = Math.sin(frame * 0.08 + breathPhase) * 2.6;
  const talkHeadNod = isTalking ? Math.sin(frame * 0.34) * 2.2 : 0;
  const headBob = Math.sin(frame * 0.08 + breathPhase - 0.5) * 1.6 + talkHeadNod * 0.5;
  const dynamicTilt = headTiltDeg + (isTalking ? Math.sin(frame * 0.18) * 1.6 : 0);

  // Strict Arm Polarity Law enforcement
  const clamped = clampArmAngles(leftArmAngle, rightArmAngle);
  const talkWave = isTalking ? Math.sin(frame * 0.28) * 6 : Math.sin(frame * 0.07 + breathPhase) * 1.5;
  const finalLeftShoulder = Math.max(0, clamped.left + Math.max(0, talkWave));
  const finalRightShoulder = Math.min(0, clamped.right - Math.max(0, talkWave));

  // Natural 2-segment articulated elbow bends with conversational follow-through!
  const defaultLeftElbow = leftProp !== 'none'
    ? -Math.min(34, finalLeftShoulder * 0.32)
    : (isTalking ? 14 + Math.sin(frame * 0.32 - 0.6) * 10 : 8);
  const defaultRightElbow = rightProp !== 'none'
    ? Math.min(34, Math.abs(finalRightShoulder) * 0.32)
    : (isTalking ? -14 - Math.sin(frame * 0.32 - 0.6) * 10 : -8);

  const finalLeftElbow = leftElbowBend ?? defaultLeftElbow;
  const finalRightElbow = rightElbowBend ?? defaultRightElbow;

  const blinkScaleY = getBlinkScaleY(frame, app.blinkPeriod, Math.round(breathPhase * 17));
  const lipShape = getLipSyncShape(frame, isTalking);
  const halfShoulder = app.shoulderWidth / 2;
  const upperArmLen = 68;
  const foreArmLen = 64;

  // Subtle natural eye micro-saccade
  const saccadeX = eyeLookX + Math.sin(frame * 0.035 + breathPhase) * 0.14;

  return (
    <g transform={`translate(${x}, ${y}) scale(${flipX ? -scale : scale}, ${scale})`}>
      {/* Grounded Lower Body (Pleated Saree Skirt or Tailored Trousers with cel shadow) */}
      <g>
        {app.hasSaree ? (
          <g>
            <path
              d={`M ${-halfShoulder - 5} 112 L ${halfShoulder + 5} 112 L ${halfShoulder + 22} 292 L ${-halfShoulder - 22} 292 Z`}
              fill={app.trouserOrSkirt}
              stroke={ink}
              strokeWidth={2.5}
              strokeLinejoin="round"
            />
            {/* Editorial pleated vertical folds */}
            <path d="M -24 114 L -32 290 L -14 290 L -10 114 Z" fill={app.outfitPrimary} opacity={0.65} />
            <path d="M 2 114 L -2 290 L 14 290 L 16 114 Z" fill={app.outfitPrimary} opacity={0.55} />
            <line x1={-halfShoulder - 20} y1={272} x2={halfShoulder + 20} y2={272} stroke={app.outfitAccent} strokeWidth={9} />
            <line x1={-halfShoulder - 21} y1={263} x2={halfShoulder + 21} y2={263} stroke={ink} strokeWidth={1.6} opacity={0.5} />
          </g>
        ) : (
          <g>
            {/* Belt & Buckle */}
            <rect x={-halfShoulder + 2} y={108} width={halfShoulder * 2 - 4} height={22} fill="#1A1F26" stroke={ink} strokeWidth={2.2} />
            <rect x={-9} y={111} width={18} height={16} rx={2} fill="#C9A24B" stroke={ink} strokeWidth={1.6} />
            {/* Tailored Trousers with vertical crease */}
            <path
              d={`M ${-halfShoulder + 4} 128 L -4 128 L -8 292 L ${-halfShoulder + 12} 292 Z`}
              fill={app.trouserOrSkirt}
              stroke={ink}
              strokeWidth={2.4}
            />
            <path
              d={`M 4 128 L ${halfShoulder - 4} 128 L ${halfShoulder - 12} 292 L 8 292 Z`}
              fill="#19202A"
              stroke={ink}
              strokeWidth={2.4}
            />
          </g>
        )}
      </g>

      <g transform={`translate(0, ${breathY})`}>
        {/* Female Hair Bun / Low Chignon behind neck */}
        {app.isFemale && (
          <g transform={`translate(0, ${-198 + headBob}) rotate(${dynamicTilt})`}>
            <circle cx={0} cy={14} r={55} fill={app.hairBase} stroke={ink} strokeWidth={2.5} />
            <ellipse cx={-36} cy={38} rx={25} ry={22} fill="#16181F" stroke={ink} strokeWidth={2.2} />
            <ellipse cx={36} cy={38} rx={25} ry={22} fill="#16181F" stroke={ink} strokeWidth={2.2} />
            {app.hasRoyalJewelry && (
              <path d="M -34 28 Q 0 18 34 28" fill="none" stroke="#F8FAFC" strokeWidth={4} strokeDasharray="5 5" />
            )}
          </g>
        )}

        {/* === LEFT ARTICULATED 2-SEGMENT ARM (Upper Arm + Elbow + Forearm + Sculpted Hand) === */}
        <g transform={`translate(${-halfShoulder + 5}, -84) rotate(${finalLeftShoulder})`}>
          {/* Upper Arm Sleeve */}
          <path
            d={`M -18 -10 C -22 16 -20 46 -15 ${upperArmLen} L 15 ${upperArmLen} C 19 46 20 16 16 -10 Z`}
            fill={app.outfitPrimary}
            stroke={ink}
            strokeWidth={2.4}
            strokeLinejoin="round"
          />
          {/* Sleeve Hem Detail */}
          <line x1={-15} y1={upperArmLen - 7} x2={15} y2={upperArmLen - 7} stroke={app.outfitAccent} strokeWidth={3.5} opacity={0.85} />

          {/* Elbow Joint -> Forearm -> Sculpted 5-Finger Hand */}
          <g transform={`translate(0, ${upperArmLen - 4}) rotate(${finalLeftElbow})`}>
            <path
              d={`M -13 0 L -10 ${foreArmLen} C -10 ${foreArmLen + 6} 10 ${foreArmLen + 6} 10 ${foreArmLen} L 13 0 Z`}
              fill={app.skinBase}
              stroke={ink}
              strokeWidth={2.2}
            />
            {/* Forearm Cel Shadow Edge */}
            <path d={`M 3 2 L 12 2 L 9 ${foreArmLen} L 2 ${foreArmLen} Z`} fill={app.skinCelShadow} opacity={0.45} />
            {app.hasGoldBangles && (
              <g>
                <rect x={-12} y={foreArmLen - 20} width={24} height={5} rx={2} fill="#EAB308" stroke={ink} strokeWidth={1.4} />
                <rect x={-12} y={foreArmLen - 13} width={24} height={5} rx={2} fill="#FACC15" stroke={ink} strokeWidth={1.4} />
              </g>
            )}
            {app.hasWristwatch && (
              <g>
                <rect x={-12} y={foreArmLen - 18} width={24} height={9} rx={2} fill="#1E293B" stroke={ink} strokeWidth={1.4} />
                <circle cx={0} cy={foreArmLen - 13.5} r={6} fill="#FFFDF8" stroke="#D4AF37" strokeWidth={2} />
              </g>
            )}
            {/* Hand & Prop Group */}
            <g transform={`translate(0, ${foreArmLen})`}>
              {renderHandProp(leftProp, 'left', frame, finalLeftShoulder + finalLeftElbow, ink)}
              {renderSculptedHand('left', app.skinBase, app.skinCelShadow, ink, leftProp !== 'none', isTalking, frame)}
            </g>
          </g>
        </g>

        {/* === RIGHT ARTICULATED 2-SEGMENT ARM (Upper Arm + Elbow + Forearm + Sculpted Hand) === */}
        <g transform={`translate(${halfShoulder - 5}, -84) rotate(${finalRightShoulder})`}>
          <path
            d={`M -16 -10 C -20 16 -19 46 -15 ${upperArmLen} L 15 ${upperArmLen} C 20 46 22 16 18 -10 Z`}
            fill={app.outfitCelShadow}
            stroke={ink}
            strokeWidth={2.4}
            strokeLinejoin="round"
          />
          <line x1={-15} y1={upperArmLen - 7} x2={15} y2={upperArmLen - 7} stroke={app.outfitAccent} strokeWidth={3.5} opacity={0.85} />

          <g transform={`translate(0, ${upperArmLen - 4}) rotate(${finalRightElbow})`}>
            <path
              d={`M -13 0 L -10 ${foreArmLen} C -10 ${foreArmLen + 6} 10 ${foreArmLen + 6} 10 ${foreArmLen} L 13 0 Z`}
              fill={app.skinBase}
              stroke={ink}
              strokeWidth={2.2}
            />
            <path d={`M 3 2 L 12 2 L 9 ${foreArmLen} L 2 ${foreArmLen} Z`} fill={app.skinCelShadow} opacity={0.5} />
            {app.hasGoldBangles && (
              <g>
                <rect x={-12} y={foreArmLen - 20} width={24} height={5} rx={2} fill="#EAB308" stroke={ink} strokeWidth={1.4} />
                <rect x={-12} y={foreArmLen - 13} width={24} height={5} rx={2} fill="#FACC15" stroke={ink} strokeWidth={1.4} />
              </g>
            )}
            <g transform={`translate(0, ${foreArmLen})`}>
              {renderHandProp(rightProp, 'right', frame, finalRightShoulder + finalRightElbow, ink)}
              {renderSculptedHand('right', app.skinBase, app.skinCelShadow, ink, rightProp !== 'none', isTalking, frame)}
            </g>
          </g>
        </g>

        {/* === EDITORIAL 2D TORSO WITH CEL SHADOW & FABRIC FOLDS === */}
        <g>
          <path
            d={`M ${-halfShoulder} -90
                C ${-halfShoulder} -112 -32 -118 0 -118
                C 32 -118 ${halfShoulder} -112 ${halfShoulder} -90
                L ${halfShoulder + 7} 118
                L ${-halfShoulder - 7} 118 Z`}
            fill={app.outfitPrimary}
            stroke={ink}
            strokeWidth={2.6}
            strokeLinejoin="round"
          />
          {/* Crisp Flat-Editorial 2D Cel Shadow Plane on right half */}
          <path
            d={`M 4 -117 C 34 -117 ${halfShoulder} -111 ${halfShoulder} -90 L ${halfShoulder + 6} 117 L 4 117 Z`}
            fill={app.outfitCelShadow}
            opacity={0.55}
          />

          {/* Outfit-Specific Handcrafted 2D Details */}
          {app.hasSaree && (
            <g>
              {/* Blouse neckline */}
              <path d="M -28 -114 Q 0 -92 28 -114" fill="none" stroke={ink} strokeWidth={2.2} />
              {/* Saree diagonal pallu drape with crisp pleats & woven zari border */}
              <path
                d={`M ${-halfShoulder + 12} -109 L ${halfShoulder + 6} 56 L ${halfShoulder + 7} 118 L ${-halfShoulder + 44} 118 L ${-halfShoulder - 2} -66 Z`}
                fill={app.outfitPrimary}
                stroke={ink}
                strokeWidth={2.4}
              />
              {/* Woven saree border */}
              <path d={`M ${-halfShoulder + 15} -106 L ${halfShoulder + 5} 58`} stroke={app.outfitAccent} strokeWidth={8} />
              <path
                d={`M ${-halfShoulder + 15} -106 L ${halfShoulder + 5} 58`}
                stroke={ink}
                strokeWidth={1.6}
                strokeDasharray="6 6"
                opacity={0.45}
              />
              {/* Subtle pallu pleat ink lines */}
              <line x1={-halfShoulder + 22} y1={-82} x2={halfShoulder - 12} y2={76} stroke={ink} strokeWidth={1.4} opacity={0.35} />
              <line x1={-halfShoulder + 12} y1={-56} x2={halfShoulder - 26} y2={98} stroke={ink} strokeWidth={1.4} opacity={0.35} />

              {/* Ruksana's iconic faded saree knot (আঁচলের গিঁট) */}
              {app.hasSareeKnot && (
                <g transform="translate(46, 52)">
                  <path
                    d="M -15 -9 Q 0 -19 15 -6 Q 19 10 2 17 Q -17 15 -15 -9 Z"
                    fill="#386260"
                    stroke={ink}
                    strokeWidth={2.2}
                  />
                  <circle cx={2} cy={2} r={7.5} fill="#5C8F8D" stroke={ink} strokeWidth={1.8} />
                  <path d="M 6 9 L 22 27 L 4 25 Z" fill="#4A7A78" stroke={ink} strokeWidth={1.8} />
                </g>
              )}

              {/* Royal gold filigree necklace in Scene 10 */}
              {app.hasRoyalJewelry && (
                <g>
                  <path d="M -28 -108 Q 0 -78 28 -108" fill="none" stroke="#D4AF37" strokeWidth={5} strokeLinecap="round" />
                  <path d="M -28 -108 Q 0 -78 28 -108" fill="none" stroke={ink} strokeWidth={1.4} strokeDasharray="4 4" />
                  <circle cx={0} cy={-86} r={5.5} fill="#FDE047" stroke={ink} strokeWidth={1.6} />
                </g>
              )}
            </g>
          )}

          {app.hasJacket && (
            <g>
              {/* White Crewneck Tee under Nadim's olive-teal overshirt jacket */}
              <path d="M -26 -116 L 26 -116 L 21 118 L -21 118 Z" fill="#F8FAF9" stroke={ink} strokeWidth={2.2} />
              <path d="M -20 -114 Q 0 -98 20 -114" fill="none" stroke="#CBD5E1" strokeWidth={2.5} />
              {/* Jacket lapels & chest pocket */}
              <rect x={30} y={-52} width={26} height={24} rx={3} fill={app.outfitCelShadow} stroke={ink} strokeWidth={1.8} />
              <line x1={30} y1={-46} x2={56} y2={-46} stroke={ink} strokeWidth={1.5} />
            </g>
          )}

          {!app.hasSaree && !app.hasJacket && (
            <g>
              {/* Tailored Shirt / Panjabi Collar Flaps */}
              <path
                d="M -28 -116 L -4 -90 L -24 -78 L -34 -108 Z"
                fill={app.outfitPrimary}
                stroke={ink}
                strokeWidth={2}
                strokeLinejoin="round"
              />
              <path
                d="M 28 -116 L 4 -90 L 24 -78 L 34 -108 Z"
                fill={app.outfitCelShadow}
                stroke={ink}
                strokeWidth={2}
                strokeLinejoin="round"
              />
              {/* Placket & Buttons */}
              <rect x={-5} y={-90} width={10} height={152} fill={app.outfitCelShadow} opacity={0.35} />
              <line x1={0} y1={-90} x2={0} y2={95} stroke={ink} strokeWidth={1.8} opacity={0.55} />
              <circle cx={0} cy={-62} r={3.4} fill={app.outfitAccent} stroke={ink} strokeWidth={1.3} />
              <circle cx={0} cy={-30} r={3.4} fill={app.outfitAccent} stroke={ink} strokeWidth={1.3} />
              <circle cx={0} cy={2} r={3.4} fill={app.outfitAccent} stroke={ink} strokeWidth={1.3} />
              {/* Chest Pocket */}
              <path d="M 24 -52 L 50 -52 L 50 -26 L 37 -20 L 24 -26 Z" fill="none" stroke={ink} strokeWidth={1.8} opacity={0.55} />
            </g>
          )}
        </g>

        {/* === NECK WITH ANATOMICAL COLLARBONE & JAW CAST SHADOW === */}
        <path
          d="M -20 -142 L 20 -142 L 23 -104 C 12 -96 -12 -96 -23 -104 Z"
          fill={app.skinBase}
          stroke={ink}
          strokeWidth={2.2}
        />
        {/* Crisp chin cast shadow on neck */}
        <path d="M -20 -142 L 20 -142 L 21 -120 Q 0 -110 -21 -122 Z" fill={app.skinCelShadow} />

        {/* === METICULOUSLY DETAILED EDITORIAL 2D HEAD GROUP === */}
        <g transform={`translate(0, ${-198 + headBob}) rotate(${dynamicTilt}) scale(${app.headScale})`}>
          {/* Ears with Inner Helix Fold */}
          <g transform="translate(-56, 4)">
            <ellipse cx={0} cy={0} rx={11.5} ry={17} fill={app.skinBase} stroke={ink} strokeWidth={2.2} />
            <path d="M -3 -8 C 3 -6 3 6 -3 8" fill="none" stroke={app.skinCelShadow} strokeWidth={2.2} strokeLinecap="round" />
            {app.hasRoyalJewelry && (
              <path d="M -5 16 L 5 16 L 7 25 Q 0 29 -7 25 Z" fill="#EAB308" stroke={ink} strokeWidth={1.6} />
            )}
          </g>
          <g transform="translate(56, 4)">
            <ellipse cx={0} cy={0} rx={11.5} ry={17} fill={app.skinCelShadow} stroke={ink} strokeWidth={2.2} />
            <path d="M 3 -8 C -3 -6 -3 6 3 8" fill="none" stroke={ink} strokeWidth={1.8} opacity={0.45} strokeLinecap="round" />
            {app.hasRoyalJewelry && (
              <path d="M -5 16 L 5 16 L 7 25 Q 0 29 -7 25 Z" fill="#EAB308" stroke={ink} strokeWidth={1.6} />
            )}
          </g>

          {/* Sculpted Editorial Jawline & Cheekbone Silhouette */}
          <path
            d={`M -56 -22
                C -56 -68 56 -68 56 -22
                C 56 18 ${app.jawWidth} 52 0 68
                C ${-app.jawWidth} 52 -56 18 -56 -22 Z`}
            fill={app.skinBase}
            stroke={ink}
            strokeWidth={2.6}
            strokeLinejoin="round"
          />

          {/* Subtle Editorial Cel Shadow Plane along right temple & jaw */}
          <path
            d={`M 16 -60 C 44 -54 55 -38 55 -22 C 55 18 ${app.jawWidth} 51 2 66 C 24 52 38 22 36 -18 C 35 -42 28 -54 16 -60 Z`}
            fill={app.skinCelShadow}
            opacity={0.48}
          />

          {/* Subtle Stubble Shadow for Adult Sakib (23) & Nadim */}
          {app.hasStubble && (
            <path
              d="M -38 30 C -30 56 30 56 38 30 C 34 62 -34 62 -38 30 Z"
              fill="#2B2420"
              opacity={0.13}
            />
          )}

          {/* Warm Cheek Hatching & Blush */}
          <ellipse cx={-32} cy={20} rx={11} ry={5.5} fill={app.skinWarmBlush} opacity={0.2} />
          <ellipse cx={32} cy={20} rx={11} ry={5.5} fill={app.skinWarmBlush} opacity={0.16} />

          {/* Expressive Age / Character Cheek Lines for Ruksana, Aunty, Tanvir */}
          {app.hasAgeLines && (
            <g stroke={app.skinCelShadow} strokeWidth={1.6} fill="none" strokeLinecap="round" opacity={0.65}>
              <path d="M -34 14 Q -30 22 -24 28" />
              <path d="M 34 14 Q 30 22 24 28" />
            </g>
          )}

          {/* Traditional Bindi */}
          {app.hasBindi && (
            <circle
              cx={0}
              cy={-26}
              r={preset === 'ruksanaRoyal' ? 5.2 : 4.2}
              fill={preset === 'aunty' ? '#7A2E63' : '#B91C1C'}
              stroke={ink}
              strokeWidth={1}
            />
          )}

          {/* === DETAILED MULTI-LAYERED EYES (Upper Crease, Eyelashes, Iris Ring, Dual Catchlights) === */}
          {[-23, 23].map((ex, eIdx) => {
            const isRight = eIdx === 1;
            return (
              <g key={ex} transform={`translate(${ex}, -2)`}>
                {/* Upper Eyelid Fold Crease */}
                <path
                  d="M -14 -11 Q 0 -17 14 -11"
                  fill="none"
                  stroke={app.skinCelShadow}
                  strokeWidth={1.8}
                  strokeLinecap="round"
                />
                <g transform={`scale(1, ${blinkScaleY})`}>
                  {/* Warm off-white sclera */}
                  <path
                    d="M -14 0 Q 0 -12 14 0 Q 0 11 -14 0 Z"
                    fill="#FCF9F2"
                    stroke={ink}
                    strokeWidth={2}
                  />
                  {/* Upper thick lash rim */}
                  <path
                    d={
                      app.isFemale
                        ? isRight
                          ? 'M -14 0 Q 0 -12 16 -4'
                          : 'M -16 -4 Q 0 -12 14 0'
                        : 'M -14 0 Q 0 -11 14 0'
                    }
                    fill="none"
                    stroke={ink}
                    strokeWidth={app.isFemale ? 3.2 : 2.5}
                    strokeLinecap="round"
                  />
                  {/* Rich layered dark iris & pupil */}
                  <circle cx={saccadeX * 3.4} cy={eyeLookY * 2.4} r={6.2} fill="#362319" />
                  <circle cx={saccadeX * 3.4} cy={eyeLookY * 2.4} r={3.5} fill="#0D0908" />
                  {/* Dual Catchlights */}
                  <circle cx={saccadeX * 3.4 - 2.3} cy={eyeLookY * 2.4 - 2.4} r={2.1} fill="#FFFFFF" />
                  <circle cx={saccadeX * 3.4 + 2.4} cy={eyeLookY * 2.4 + 2.0} r={1.0} fill="#FFFFFF" opacity={0.85} />
                </g>
              </g>
            );
          })}

          {/* Tanvir's Round Gold Wire Spectacles */}
          {app.hasSpectacles && (
            <g fill="none" stroke="#C5A25C" strokeWidth={3}>
              <circle cx={-23} cy={-2} r={17.5} fill="#FFFFFF" fillOpacity={0.14} />
              <circle cx={23} cy={-2} r={17.5} fill="#FFFFFF" fillOpacity={0.14} />
              <path d="M -5.5 -2 Q 0 -7 5.5 -2" />
              <line x1={-40.5} y1={-4} x2={-55} y2={-6} />
              <line x1={40.5} y1={-4} x2={55} y2={-6} />
            </g>
          )}

          {/* Tapered Expressive Eyebrows */}
          {renderBrows(expression, app.hairBase)}

          {/* Sculpted Editorial Nose Bridge, Tip & Nostril Curve + Optional Gold Nose-Pin */}
          <g>
            <path d="M -2 -8 L 3 14 Q 5 21 -3 21 Q -7 21 -8 18" fill="none" stroke={ink} strokeWidth={2.2} strokeLinecap="round" />
            <path d="M 1 -5 L 4 13" fill="none" stroke={app.skinCelShadow} strokeWidth={3} opacity={0.5} strokeLinecap="round" />
            {app.hasNosePin && (
              <circle cx={-7} cy={15} r={2.3} fill="#FDE047" stroke={ink} strokeWidth={0.9} />
            )}
          </g>

          {/* Tanvir's Salt-and-Pepper Mustache */}
          {app.hasMustache && (
            <path
              d="M -20 30 Q -7 23 0 27 Q 7 23 20 30 Q 9 35 0 32 Q -9 35 -20 30 Z"
              fill="#3A3E48"
              stroke={ink}
              strokeWidth={1.6}
            />
          )}

          {/* Expressive Mouth / 4-Shape Lip-Sync */}
          {renderMouth(expression, lipShape, ink)}

          {/* Nervous Cold Sweat Drop */}
          {sweatDrop && (
            <g transform={`translate(42, ${-24 + (frame % 26) * 0.5})`}>
              <path
                d="M 0 -11 C 7 -2 9 7 0 12 C -9 7 -7 -2 0 -11 Z"
                fill="#7DD3FC"
                stroke="#0369A1"
                strokeWidth={1.8}
              />
              <circle cx={-2.2} cy={2} r={2.2} fill="#FFFFFF" />
            </g>
          )}

          {/* === LAYERED EDITORIAL HAIR WITH STRAND CONTOURS === */}
          {app.isFemale ? (
            <g>
              <path
                d="M -59 -12 C -62 -69 -25 -78 0 -78 C 25 -78 62 -69 59 -12 C 48 -38 20 -50 0 -46 C -20 -50 -48 -38 -59 -12 Z"
                fill={app.hairBase}
                stroke={ink}
                strokeWidth={2.5}
                strokeLinejoin="round"
              />
              {/* Center Hair Parting Line & Soft Strands */}
              <line x1={0} y1={-76} x2={0} y2={-46} stroke={app.skinBase} strokeWidth={2.4} strokeLinecap="round" />
              <path d="M -42 -44 Q -22 -64 -4 -58" fill="none" stroke={app.hairHighlight} strokeWidth={3.5} strokeLinecap="round" opacity={0.75} />
              <path d="M 10 -60 Q 32 -60 46 -40" fill="none" stroke={app.hairHighlight} strokeWidth={3} strokeLinecap="round" opacity={0.6} />
            </g>
          ) : (
            <g>
              <path
                d="M -58 -10 C -64 -68 -28 -86 6 -84 C 42 -82 64 -60 58 -10 C 50 -36 36 -48 14 -48 C 4 -48 -6 -40 -14 -46 C -34 -46 -48 -34 -58 -10 Z"
                fill={app.hairBase}
                stroke={ink}
                strokeWidth={2.5}
                strokeLinejoin="round"
              />
              {/* Forelock Strands & Sideburns */}
              <path d="M -58 -14 L -50 8 L -45 -8 Z" fill={app.hairBase} stroke={ink} strokeWidth={1.5} />
              <path d="M 58 -14 L 50 8 L 45 -8 Z" fill={app.hairBase} stroke={ink} strokeWidth={1.5} />
              <path d="M -36 -60 Q -8 -76 26 -62" fill="none" stroke={app.hairHighlight} strokeWidth={4.5} strokeLinecap="round" opacity={0.75} />
              <path d="M -18 -49 Q 8 -58 32 -48" fill="none" stroke={app.hairHighlight} strokeWidth={2.4} strokeLinecap="round" opacity={0.55} />
            </g>
          )}
        </g>
      </g>
    </g>
  );
};
