import React from 'react';

interface EditorialFrameOverlayProps {
  /** Subtle warm ink paper-grain & framing tint for authentic 2D animation explainer craft */
  darkScene?: boolean;
}

export const EditorialFrameOverlay: React.FC<EditorialFrameOverlayProps> = ({ darkScene = false }) => {
  return (
    <svg
      viewBox="0 0 1080 1920"
      width={1080}
      height={1920}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 35,
      }}
    >
      <defs>
        <filter id="ed_paper_grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.78"
            numOctaves={2}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <radialGradient id="ed_vignette" cx="50%" cy="48%" r="64%">
          <stop offset="68%" stopColor="#120E0B" stopOpacity="0" />
          <stop offset="100%" stopColor="#120E0B" stopOpacity={darkScene ? 0.34 : 0.22} />
        </radialGradient>
      </defs>

      {/* Subtle fine archival paper grain (handcrafted 2D print texture, zero glossy 3D) */}
      <rect
        x={0}
        y={0}
        width={1080}
        height={1920}
        filter="url(#ed_paper_grain)"
        opacity={darkScene ? 0.045 : 0.038}
      />

      {/* Soft cinematic edge framing vignette */}
      <rect x={0} y={0} width={1080} height={1920} fill="url(#ed_vignette)" />

      {/* Subtle editorial ink corner registration ticks inside outer margin */}
      <g stroke={darkScene ? '#D4AF37' : '#2A1F18'} strokeWidth={2} opacity={darkScene ? 0.24 : 0.16} fill="none">
        <path d="M 30 62 L 30 30 L 62 30" />
        <path d="M 1050 62 L 1050 30 L 1018 30" />
        <path d="M 30 1858 L 30 1890 L 62 1890" />
        <path d="M 1050 1858 L 1050 1890 L 1018 1890" />
      </g>
    </svg>
  );
};
