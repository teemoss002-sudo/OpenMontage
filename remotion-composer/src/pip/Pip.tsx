import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export type PipProps = {
  size: number;
  talking: boolean;
  waving: boolean;
};

const BODY = "#FFD84D";
const BELLY = "#FFE99A";
const SHADE = "#F5C431";
const FEET = "#F5A623";
const SPROUT = "#5DBB4A";
const BLUSH = "#F7A1A1";
const INK = "#2B2B2B";

export const Pip: React.FC<PipProps> = ({ size, talking, waving }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 9, stiffness: 120 } });
  const bob = Math.sin((frame / fps) * Math.PI * 2 * 0.9) * 6;
  const squash = 1 + Math.sin((frame / fps) * Math.PI * 2 * 0.9) * 0.015;
  const blink = frame % 96 < 4 ? 0.15 : 1;
  const mouthOpen = talking ? 0.5 + 0.5 * Math.abs(Math.sin((frame / fps) * Math.PI * 7)) : 0;
  const wave = waving ? Math.sin((frame / fps) * Math.PI * 2 * 2) * 25 : 0;
  const sproutSway = Math.sin((frame / fps) * Math.PI * 2 * 0.6) * 6;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      style={{
        overflow: "visible",
        transform: `translateY(${bob + interpolate(entrance, [0, 1], [200, 0])}px) scale(${entrance})`,
        transformOrigin: "50% 100%",
      }}
    >
      <ellipse cx="100" cy="194" rx="46" ry="6" fill="rgba(0,0,0,0.08)" />
      <g transform={`translate(100 190) scale(${2 - squash} ${squash}) translate(-100 -190)`}>
        <ellipse cx="78" cy="184" rx="14" ry="9" fill={FEET} />
        <ellipse cx="122" cy="184" rx="14" ry="9" fill={FEET} />
        <ellipse cx="32" cy="118" rx="14" ry="10" fill={BODY} transform="rotate(-25 32 118)" />
        <g transform={`rotate(${-wave} 160 120)`}>
          <ellipse cx="170" cy="112" rx="14" ry="10" fill={BODY} transform="rotate(30 170 112)" />
        </g>
        <circle cx="100" cy="115" r="70" fill={BODY} />
        <path d="M 40 140 A 70 70 0 0 0 160 140 A 70 40 0 0 1 40 140 Z" fill={SHADE} opacity="0.5" />
        <ellipse cx="100" cy="140" rx="46" ry="38" fill={BELLY} />
        <g transform={`translate(78 98) scale(1 ${blink})`}>
          <ellipse cx="0" cy="0" rx="8" ry="10" fill={INK} />
          <circle cx="2.5" cy="-4" r="3" fill="#fff" />
        </g>
        <g transform={`translate(122 98) scale(1 ${blink})`}>
          <ellipse cx="0" cy="0" rx="8" ry="10" fill={INK} />
          <circle cx="2.5" cy="-4" r="3" fill="#fff" />
        </g>
        <ellipse cx="66" cy="120" rx="10" ry="6" fill={BLUSH} />
        <ellipse cx="134" cy="120" rx="10" ry="6" fill={BLUSH} />
        {mouthOpen > 0 ? (
          <ellipse cx="100" cy="124" rx="9" ry={3 + 7 * mouthOpen} fill="#8A3B3B" />
        ) : (
          <path d="M 90 120 Q 100 130 110 120" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
        )}
        <g transform={`rotate(${sproutSway} 100 46)`}>
          <path d="M 100 46 L 100 28" stroke={SPROUT} strokeWidth="4" strokeLinecap="round" />
          <ellipse cx="88" cy="26" rx="12" ry="6" fill={SPROUT} transform="rotate(-20 88 26)" />
          <ellipse cx="112" cy="26" rx="12" ry="6" fill={SPROUT} transform="rotate(20 112 26)" />
        </g>
      </g>
    </svg>
  );
};
