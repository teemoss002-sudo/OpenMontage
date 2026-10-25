import React from "react";

// Every item is drawn in a 200x200 box and filled with the episode color, so
// one drawing serves every "Color of the Day" episode it fits.
type ItemDrawing = (color: string, dark: string, light: string) => React.ReactNode;

const GREEN = "#5DBB4A";
const BROWN = "#8B5A2B";
const TIRE = "#37474F";
const HUB = "#CFD8DC";
const GLASS = "#D6EEFF";
const INK = "#2B2B2B";

export const PIP_ITEMS: Record<string, ItemDrawing> = {
  apple: (color, dark, light) => (
    <>
      <path d="M100 58 C70 38 30 52 32 98 C34 146 66 178 86 176 C94 175 96 170 100 170 C104 170 106 175 114 176 C134 178 166 146 168 98 C170 52 130 38 100 58 Z" fill={color} />
      <path d="M150 90 C152 130 132 160 114 170 C140 166 164 136 164 98 Z" fill={dark} opacity="0.5" />
      <ellipse cx="68" cy="90" rx="10" ry="18" fill={light} opacity="0.7" transform="rotate(20 68 90)" />
      <path d="M100 60 C100 46 104 36 110 28" stroke={BROWN} strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M108 40 C120 24 144 26 150 34 C138 46 118 48 108 40 Z" fill={GREEN} />
    </>
  ),
  strawberry: (color, dark, light) => (
    <>
      <path d="M100 182 C60 160 32 112 40 80 C46 58 70 52 100 58 C130 52 154 58 160 80 C168 112 140 160 100 182 Z" fill={color} />
      <path d="M150 90 C154 120 132 156 100 182 C140 164 164 118 156 84 Z" fill={dark} opacity="0.45" />
      {[[70, 90], [100, 86], [130, 90], [62, 118], [90, 116], [118, 116], [142, 118], [80, 144], [108, 144], [96, 166]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="3.5" ry="5" fill="#FFF3B0" />
      ))}
      <ellipse cx="66" cy="84" rx="8" ry="14" fill={light} opacity="0.6" transform="rotate(30 66 84)" />
      <path d="M100 64 L74 46 L90 60 L62 62 L92 70 L100 76 L108 70 L138 62 L110 60 L126 46 Z" fill={GREEN} />
      <path d="M100 66 L100 38" stroke={GREEN} strokeWidth="7" strokeLinecap="round" />
    </>
  ),
  "fire truck": (color, dark) => (
    <>
      <rect x="22" y="78" width="112" height="62" rx="10" fill={color} />
      <path d="M130 92 L160 92 C168 92 176 104 178 116 L178 140 L130 140 Z" fill={color} />
      <path d="M140 100 L158 100 C164 100 168 108 170 118 L140 118 Z" fill={GLASS} />
      <rect x="22" y="126" width="156" height="14" fill={dark} />
      <rect x="30" y="62" width="96" height="10" rx="5" fill={HUB} />
      {[42, 62, 82, 102].map((x) => (
        <rect key={x} x={x} y="58" width="6" height="18" fill={HUB} />
      ))}
      <rect x="140" y="80" width="14" height="10" rx="3" fill="#4FC3F7" />
      <circle cx="56" cy="148" r="20" fill={TIRE} />
      <circle cx="56" cy="148" r="8" fill={HUB} />
      <circle cx="148" cy="148" r="20" fill={TIRE} />
      <circle cx="148" cy="148" r="8" fill={HUB} />
    </>
  ),
  car: (color, dark) => (
    <>
      <path d="M48 96 C56 70 72 62 100 62 C128 62 142 70 152 96 Z" fill={color} />
      <path d="M64 94 C70 76 80 72 98 72 L98 94 Z" fill={GLASS} />
      <path d="M104 72 C122 72 132 76 138 94 L104 94 Z" fill={GLASS} />
      <rect x="24" y="92" width="152" height="46" rx="20" fill={color} />
      <rect x="24" y="116" width="152" height="10" fill={dark} />
      <circle cx="30" cy="106" r="5" fill="#FF7043" />
      <circle cx="170" cy="106" r="5" fill="#FFEB3B" />
      <circle cx="62" cy="140" r="19" fill={TIRE} />
      <circle cx="62" cy="140" r="8" fill={HUB} />
      <circle cx="138" cy="140" r="19" fill={TIRE} />
      <circle cx="138" cy="140" r="8" fill={HUB} />
    </>
  ),
  balloon: (color, dark, light) => (
    <>
      <path d="M100 136 C96 156 108 170 98 194" stroke="#78909C" strokeWidth="2.5" fill="none" />
      <ellipse cx="100" cy="76" rx="52" ry="64" fill={color} />
      <path d="M140 60 C150 100 130 136 100 140 C136 134 156 96 146 60 Z" fill={dark} opacity="0.4" />
      <ellipse cx="78" cy="52" rx="10" ry="20" fill={light} opacity="0.7" transform="rotate(25 78 52)" />
      <path d="M92 138 L108 138 L104 146 L96 146 Z" fill={dark} />
    </>
  ),
  heart: (color, dark, light) => (
    <>
      <path d="M100 176 C40 132 20 100 28 70 C36 40 76 34 100 64 C124 34 164 40 172 70 C180 100 160 132 100 176 Z" fill={color} />
      <path d="M164 74 C168 104 148 130 100 168 C152 134 174 104 166 72 Z" fill={dark} opacity="0.4" />
      <ellipse cx="60" cy="72" rx="10" ry="18" fill={light} opacity="0.7" transform="rotate(35 60 72)" />
    </>
  ),
  ball: (color, dark, light) => (
    <>
      <circle cx="100" cy="100" r="72" fill={color} />
      <path d="M30 86 C70 100 130 100 170 86 L172 112 C130 126 70 126 28 112 Z" fill="#FFFFFF" opacity="0.9" />
      <path d="M156 60 C176 100 160 156 100 172 C150 170 182 120 160 60 Z" fill={dark} opacity="0.35" />
      <ellipse cx="70" cy="60" rx="12" ry="20" fill={light} opacity="0.7" transform="rotate(40 70 60)" />
    </>
  ),
  star: (color, dark, light) => (
    <>
      <path d="M100 22 L122 74 L178 78 L135 114 L149 170 L100 140 L51 170 L65 114 L22 78 L78 74 Z" fill={color} stroke={dark} strokeWidth="6" strokeLinejoin="round" />
      <ellipse cx="86" cy="80" rx="8" ry="14" fill={light} opacity="0.7" transform="rotate(30 86 80)" />
      <circle cx="86" cy="108" r="5" fill={INK} />
      <circle cx="114" cy="108" r="5" fill={INK} />
      <path d="M90 122 Q100 130 110 122" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
    </>
  ),
  flower: (color, dark) => (
    <>
      <path d="M100 110 L100 190" stroke={GREEN} strokeWidth="8" strokeLinecap="round" />
      <ellipse cx="124" cy="160" rx="22" ry="10" fill={GREEN} transform="rotate(-30 124 160)" />
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <ellipse key={angle} cx="100" cy="52" rx="22" ry="32" fill={color} stroke={dark} strokeWidth="3" transform={`rotate(${angle} 100 86)`} />
      ))}
      <circle cx="100" cy="86" r="22" fill="#FFD54F" />
    </>
  ),
  whale: (color, dark, light) => (
    <>
      <path d="M20 110 C20 70 60 56 100 60 C140 64 160 90 162 110 L182 86 C188 100 186 118 176 126 C186 134 188 150 182 160 L160 134 C150 160 120 170 90 170 C44 170 20 146 20 110 Z" fill={color} />
      <path d="M24 126 C40 160 100 166 150 140 C120 172 40 170 24 126 Z" fill={light} opacity="0.8" />
      <circle cx="56" cy="104" r="7" fill={INK} />
      <circle cx="58" cy="101" r="2.5" fill="#FFFFFF" />
      <path d="M76 58 C70 40 60 34 52 34 M76 58 C80 40 92 32 100 32" stroke={dark} strokeWidth="5" strokeLinecap="round" fill="none" />
    </>
  ),
  fish: (color, dark, light) => (
    <>
      <path d="M140 100 L182 66 L182 134 Z" fill={dark} />
      <ellipse cx="94" cy="100" rx="64" ry="44" fill={color} />
      <path d="M70 60 C90 40 120 48 130 64 Z" fill={dark} />
      <path d="M96 64 C110 90 110 110 96 136" stroke={light} strokeWidth="6" fill="none" opacity="0.8" />
      <circle cx="58" cy="92" r="8" fill={INK} />
      <circle cx="60" cy="89" r="3" fill="#FFFFFF" />
    </>
  ),
  banana: (color, dark) => (
    <>
      <path d="M36 58 C30 140 100 186 168 152 C174 146 170 138 162 138 C112 142 80 108 72 54 Z" fill={color} stroke={dark} strokeWidth="5" strokeLinejoin="round" />
      <path d="M52 74 C56 124 96 156 148 150" stroke={dark} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.5" />
      <path d="M38 60 L46 40 L68 44 L70 58 Z" fill={BROWN} />
      <path d="M162 140 L172 146 L166 150 Z" fill={BROWN} />
    </>
  ),
  leaf: (color, dark) => (
    <>
      <path d="M40 160 C40 80 100 30 170 30 C170 110 120 160 40 160 Z" fill={color} />
      <path d="M40 160 C80 120 120 80 160 40" stroke={dark} strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M90 110 L80 80 M110 90 L104 60 M90 110 L120 116 M120 80 L146 86" stroke={dark} strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  umbrella: (color, dark) => (
    <>
      <path d="M100 100 L100 166 C100 182 76 182 76 166" stroke={INK} strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M20 104 C20 54 60 28 100 28 C140 28 180 54 180 104 C168 92 150 92 140 104 C130 92 112 92 100 104 C88 92 70 92 60 104 C50 92 32 92 20 104 Z" fill={color} />
      <path d="M100 28 C80 50 66 78 60 104 M100 28 C120 50 134 78 140 104" stroke={dark} strokeWidth="4" fill="none" />
    </>
  ),
  sun: (color, dark) => (
    <>
      {Array.from({ length: 10 }, (_, i) => i * 36).map((angle) => (
        <path key={angle} d="M100 14 L110 40 L90 40 Z" fill={dark} transform={`rotate(${angle} 100 100)`} />
      ))}
      <circle cx="100" cy="100" r="54" fill={color} />
      <circle cx="82" cy="94" r="6" fill={INK} />
      <circle cx="118" cy="94" r="6" fill={INK} />
      <path d="M84 114 Q100 128 116 114" stroke={INK} strokeWidth="5" fill="none" strokeLinecap="round" />
    </>
  ),
};

export const PIP_ITEM_NAMES = Object.keys(PIP_ITEMS);

export const PipItem: React.FC<{ name: string; color: string; dark: string; light: string; size: number }> = ({ name, color, dark, light, size }) => {
  const drawing = PIP_ITEMS[name];
  if (!drawing) {
    throw new Error(`Unknown Pip item "${name}". Known items: ${PIP_ITEM_NAMES.join(", ")}`);
  }
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: "visible" }}>
      {drawing(color, dark, light)}
    </svg>
  );
};
