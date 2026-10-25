"""Render a "Color of the Day" Short for the Pip Lessons for English channel.

    python scripts/pip_color_of_the_day.py red apple "fire truck" strawberry
    python scripts/pip_color_of_the_day.py blue whale car balloon --no-voice
"""

from __future__ import annotations

import argparse
import json
import math
import shutil
import subprocess
import sys
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
COMPOSER = ROOT / "remotion-composer"
FPS = 30

COLORS = {
    "red": {"color": "#E53935", "dark": "#B71C1C", "light": "#FFCDD2", "background": "#FDEDED"},
    "blue": {"color": "#1E88E5", "dark": "#1565C0", "light": "#BBDEFB", "background": "#E6F0FB"},
    "yellow": {"color": "#FBC02D", "dark": "#F57F17", "light": "#FFF59D", "background": "#FFF8E1"},
    "green": {"color": "#43A047", "dark": "#2E7D32", "light": "#C8E6C9", "background": "#EAF6EA"},
    "orange": {"color": "#FB8C00", "dark": "#E65100", "light": "#FFE0B2", "background": "#FFF2E3"},
    "purple": {"color": "#8E24AA", "dark": "#6A1B9A", "light": "#E1BEE7", "background": "#F5EAF8"},
    "pink": {"color": "#EC407A", "dark": "#C2185B", "light": "#F8BBD0", "background": "#FDEEF4"},
    "brown": {"color": "#8D6E63", "dark": "#5D4037", "light": "#D7CCC8", "background": "#F5EFEC"},
}

# Matches PIP_ITEMS in remotion-composer/src/pip/items.tsx.
ITEMS = {
    "apple", "strawberry", "fire truck", "car", "balloon", "heart", "ball", "star",
    "flower", "whale", "fish", "banana", "leaf", "umbrella", "sun",
}

# Pip's shared Piper voice: a slightly slow read pitched up into a small cheerful character.
VOICE_MODEL = "en_US-lessac-medium"
VOICE_LENGTH_SCALE = 1.1
VOICE_PITCH = 1.18


def frames(seconds: float) -> int:
    return math.ceil(seconds * FPS)


def piper_binary() -> str:
    venv_piper = ROOT / ".venv" / "bin" / "piper"
    if venv_piper.exists():
        return str(venv_piper)
    found = shutil.which("piper")
    if not found:
        sys.exit("Piper is not installed. Run `make setup` first.")
    return found


def ensure_voice_model() -> None:
    if (ROOT / f"{VOICE_MODEL}.onnx").exists():
        return
    python = ROOT / ".venv" / "bin" / "python"
    subprocess.run([str(python if python.exists() else sys.executable), "-m", "piper.download_voices", VOICE_MODEL], cwd=ROOT, check=True)


def speak(text: str, output: Path) -> float:
    raw = output.with_suffix(".raw.wav")
    subprocess.run(
        [piper_binary(), "--model", VOICE_MODEL, "--length-scale", str(VOICE_LENGTH_SCALE), "--output_file", str(raw)],
        input=text, text=True, cwd=ROOT, check=True, capture_output=True,
    )
    with wave.open(str(raw)) as source:
        rate = source.getframerate()
    subprocess.run(
        [
            "ffmpeg", "-v", "error", "-y", "-i", str(raw),
            "-af", f"asetrate={rate * VOICE_PITCH:.0f},aresample=44100,atempo={1 / VOICE_PITCH:.4f},volume=1.6",
            str(output),
        ],
        check=True,
    )
    raw.unlink()
    with wave.open(str(output)) as result:
        return result.getnframes() / result.getframerate()


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("color", choices=sorted(COLORS))
    parser.add_argument("items", nargs="+", help=f"objects to show, in order. Known: {', '.join(sorted(ITEMS))}")
    parser.add_argument("--no-voice", action="store_true", help="render without narration")
    parser.add_argument("--music", type=Path, help="optional background music file")
    parser.add_argument("--output", type=Path, help="output mp4 path")
    args = parser.parse_args()

    unknown = [item for item in args.items if item not in ITEMS]
    if unknown:
        sys.exit(f"Unknown items: {', '.join(unknown)}. Known: {', '.join(sorted(ITEMS))}")

    color_name = args.color.capitalize()
    episode = f"color-of-the-day-{args.color}"
    public_dir = COMPOSER / "public" / "pip" / episode
    public_dir.mkdir(parents=True, exist_ok=True)
    if not args.no_voice:
        ensure_voice_model()

    def segment(text: str, slug: str, minimum_frames: int, tail_frames: int, cursor: int) -> dict:
        if args.no_voice:
            return {"startFrame": cursor, "durationFrames": minimum_frames, "speechFrames": 0}
        speech = frames(speak(text, public_dir / f"{slug}.wav"))
        return {
            "startFrame": cursor,
            "durationFrames": max(minimum_frames, speech + tail_frames),
            "speechFrames": speech,
            "audio": f"pip/{episode}/{slug}.wav",
        }

    cursor = 0
    intro = segment(f"Color of the day! {color_name}!", "intro", 75, 25, cursor)
    cursor += intro["durationFrames"]
    items = []
    for index, name in enumerate(args.items):
        item = segment(f"{name.capitalize()}!", f"item-{index}", 72, 42, cursor)
        items.append({"name": name, "label": name, **item})
        cursor += item["durationFrames"]
    outro_text = f"What else is {args.color}?"
    outro = {"text": outro_text, **segment(outro_text, "outro", 90, 45, cursor)}

    props = {**COLORS[args.color], "colorName": color_name, "intro": intro, "items": items, "outro": outro}
    if args.music:
        shutil.copy(args.music, public_dir / f"music{args.music.suffix}")
        props["music"] = f"pip/{episode}/music{args.music.suffix}"

    props_path = public_dir / "props.json"
    props_path.write_text(json.dumps(props, indent=2))
    output = (args.output or ROOT / "projects" / "pip" / "renders" / f"{episode}.mp4").resolve()
    output.parent.mkdir(parents=True, exist_ok=True)

    subprocess.run(
        ["npx", "remotion", "render", "src/index.tsx", "PipColorOfTheDay", str(output), f"--props={props_path}"],
        cwd=COMPOSER, check=True,
    )
    print(f"Done: {output}")


if __name__ == "__main__":
    main()
