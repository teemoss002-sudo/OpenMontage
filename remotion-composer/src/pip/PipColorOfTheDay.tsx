import React from "react";
import {
  AbsoluteFill,
  Audio,
  CalculateMetadataFunction,
  Easing,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFredoka } from "../lib/localFonts";
import { Pip } from "./Pip";
import { PipItem } from "./items";

const { fontFamily } = loadFredoka(["600", "700"]);

export type PipSegment = {
  startFrame: number;
  durationFrames: number;
  speechFrames: number;
  audio?: string;
};

export type PipColorItem = PipSegment & {
  name: string;
  label: string;
};

export type PipColorOfTheDayProps = {
  colorName: string;
  color: string;
  dark: string;
  light: string;
  background: string;
  labelText?: string;
  intro: PipSegment;
  items: PipColorItem[];
  outro: PipSegment & { text: string };
  music?: string;
  musicVolume?: number;
};

const WIDTH = 1080;
const CENTER_Y = 1010;
const ROW_Y = 620;
const ITEM_SIZE = 440;
const ROW_SCALE = 0.36;
const MOVE_FRAMES = 14;

const DOTS = Array.from({ length: 22 }, (_, i) => ({
  x: (i * 397) % WIDTH,
  y: 80 + ((i * 683) % 1760),
  r: 8 + (i % 3) * 3,
  speed: 0.4 + (i % 5) * 0.15,
}));

const FloatingDots: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {DOTS.map((dot, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: dot.x,
            top: dot.y + Math.sin((frame / 30) * dot.speed + i) * 14,
            width: dot.r * 2,
            height: dot.r * 2,
            borderRadius: "50%",
            background: "#FFE2A8",
            opacity: 0.7,
          }}
        />
      ))}
    </>
  );
};

const Title: React.FC<Pick<PipColorOfTheDayProps, "colorName" | "color" | "dark" | "light">> = ({ colorName, color, dark, light }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pill = spring({ frame, fps, config: { damping: 12 } });
  const word = spring({ frame: frame - 8, fps, config: { damping: 7, stiffness: 140 } });
  const pulse = 1 + Math.sin((frame / fps) * Math.PI * 2 * 0.5) * 0.02;

  return (
    <div style={{ position: "absolute", top: 110, width: WIDTH, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div
        style={{
          transform: `scale(${pill})`,
          background: "#FFFFFF",
          borderRadius: 60,
          padding: "16px 44px",
          fontFamily,
          fontWeight: 600,
          fontSize: 52,
          color: "#3B3552",
          boxShadow: "0 6px 0 rgba(0,0,0,0.06)",
        }}
      >
        Color of the Day
      </div>
      <div style={{ position: "relative", marginTop: 10, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ position: "absolute", width: 440, height: 300, borderRadius: "50%", background: light, opacity: 0.55, transform: `scale(${word * pulse})` }} />
        <div
          style={{
            position: "relative",
            transform: `scale(${word * pulse})`,
            fontFamily,
            fontWeight: 700,
            fontSize: 200,
            letterSpacing: 4,
            color,
            textShadow: `0 10px 0 ${dark}, 0 14px 24px rgba(0,0,0,0.12)`,
          }}
        >
          {colorName.toUpperCase()}!
        </div>
      </div>
    </div>
  );
};

const Label: React.FC<{ text: string; color: string; textColor: string; appearFrame: number; hideFrame: number }> = ({ text, color, textColor, appearFrame, hideFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const show = spring({ frame: frame - appearFrame, fps, config: { damping: 10 } });
  const hide = interpolate(frame, [hideFrame - 6, hideFrame], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = show * hide;
  if (scale <= 0.001) return null;
  return (
    <div style={{ position: "absolute", top: 1330, width: WIDTH, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          transform: `scale(${scale})`,
          background: color,
          color: textColor,
          borderRadius: 36,
          padding: "10px 46px 18px",
          fontFamily,
          fontWeight: 700,
          fontSize: 96,
        }}
      >
        {text}
      </div>
    </div>
  );
};

const slotX = (index: number, count: number) => (WIDTH * (index + 1)) / (count + 1);

const FlyingItem: React.FC<{ item: PipColorItem; index: number; count: number } & Pick<PipColorOfTheDayProps, "color" | "dark" | "light">> = ({
  item,
  index,
  count,
  color,
  dark,
  light,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - item.startFrame;
  if (local < 0) return null;

  const pop = spring({ frame: local, fps, config: { damping: 8, stiffness: 130 } });
  const moveStart = item.durationFrames - MOVE_FRAMES;
  const move = interpolate(local, [moveStart, item.durationFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const wobble = move === 0 ? Math.sin((local / fps) * Math.PI * 2 * 0.8) * 3 : 0;
  const x = interpolate(move, [0, 1], [WIDTH / 2, slotX(index, count)]);
  const y = interpolate(move, [0, 1], [CENTER_Y, ROW_Y]) - Math.sin(move * Math.PI) * 120;
  const scale = interpolate(move, [0, 1], [pop, ROW_SCALE]);
  const settled = move >= 1 ? 1 + Math.sin(((frame - item.startFrame - item.durationFrames) / fps) * Math.PI * 2 * 0.5 + index) * 0.03 : 1;

  return (
    <div
      style={{
        position: "absolute",
        left: x - ITEM_SIZE / 2,
        top: y - ITEM_SIZE / 2,
        transform: `scale(${scale * settled}) rotate(${wobble}deg)`,
      }}
    >
      <PipItem name={item.name} color={color} dark={dark} light={light} size={ITEM_SIZE} />
    </div>
  );
};

export const PipColorOfTheDay: React.FC<PipColorOfTheDayProps> = (props) => {
  const { colorName, color, dark, light, background, labelText = "#FFFFFF", intro, items, outro, music, musicVolume = 0.45 } = props;
  const frame = useCurrentFrame();
  const segments: PipSegment[] = [intro, ...items, outro];
  const talking = segments.some((segment) => frame >= segment.startFrame && frame < segment.startFrame + segment.speechFrames);
  const waving = frame < intro.startFrame + intro.durationFrames || frame >= outro.startFrame;

  return (
    <AbsoluteFill style={{ background }}>
      <FloatingDots />
      <Title colorName={colorName} color={color} dark={dark} light={light} />
      {items.map((item, index) => (
        <FlyingItem key={index} item={item} index={index} count={items.length} color={color} dark={dark} light={light} />
      ))}
      {items.map((item, index) => (
        <Label key={index} text={item.label} color={color} textColor={labelText} appearFrame={item.startFrame + 6} hideFrame={item.startFrame + item.durationFrames - MOVE_FRAMES} />
      ))}
      <Label text={outro.text} color={color} textColor={labelText} appearFrame={outro.startFrame} hideFrame={outro.startFrame + outro.durationFrames + 60} />
      <div style={{ position: "absolute", top: 1500, width: WIDTH, display: "flex", justifyContent: "center" }}>
        <Pip size={340} talking={talking} waving={waving} />
      </div>
      {segments.map((segment, index) =>
        segment.audio ? (
          <Sequence key={index} from={segment.startFrame}>
            <Audio src={staticFile(segment.audio)} />
          </Sequence>
        ) : null,
      )}
      {music ? <Audio src={staticFile(music)} volume={musicVolume} /> : null}
    </AbsoluteFill>
  );
};

export const calculatePipColorOfTheDayMetadata: CalculateMetadataFunction<PipColorOfTheDayProps> = ({ props }) => ({
  durationInFrames: props.outro.startFrame + props.outro.durationFrames,
});

export const PIP_COLOR_OF_THE_DAY_PREVIEW: PipColorOfTheDayProps = {
  colorName: "Red",
  color: "#E53935",
  dark: "#B71C1C",
  light: "#FFCDD2",
  background: "#FDEDED",
  intro: { startFrame: 0, durationFrames: 75, speechFrames: 50 },
  items: [
    { name: "apple", label: "apple", startFrame: 75, durationFrames: 75, speechFrames: 25 },
    { name: "fire truck", label: "fire truck", startFrame: 150, durationFrames: 75, speechFrames: 30 },
    { name: "strawberry", label: "strawberry", startFrame: 225, durationFrames: 75, speechFrames: 30 },
  ],
  outro: { text: "What else is red?", startFrame: 300, durationFrames: 90, speechFrames: 45 },
};
