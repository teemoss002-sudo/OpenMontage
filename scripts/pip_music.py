"""Synthesize an original, royalty-free ukulele + glockenspiel loop for Pip videos.

    python scripts/pip_music.py projects/pip/music/pip-theme.wav --seconds 20
"""

from __future__ import annotations

import argparse
import wave
from pathlib import Path

import numpy as np

RATE = 44100
BPM = 112
BEAT = 60 / BPM

# I-V-vi-IV in C major, one bar each.
CHORDS = [
    [60, 64, 67, 72],
    [55, 59, 62, 67],
    [57, 60, 64, 69],
    [53, 57, 60, 65],
]
BASS = [48, 43, 45, 41]
# Eight eighth-notes per bar; None is a rest.
MELODY = [
    [76, None, 79, 76, 72, None, 74, 76],
    [74, None, 71, 74, 79, None, 77, 74],
    [72, None, 76, 72, 69, None, 71, 72],
    [77, 76, 74, 72, 74, None, None, None],
]
STRUM = ["D", None, "D", "U", None, "U", "D", "U"]


def hz(note: int) -> float:
    return 440.0 * 2 ** ((note - 69) / 12)


def pluck(note: int, seconds: float, rng: np.random.Generator) -> np.ndarray:
    # Karplus-Strong string, which reads as a bright nylon ukulele.
    period = int(RATE / hz(note))
    buffer = rng.uniform(-1, 1, period)
    samples = np.empty(int(seconds * RATE))
    for i in range(len(samples)):
        samples[i] = buffer[i % period]
        buffer[i % period] = 0.996 * 0.5 * (buffer[i % period] + buffer[(i + 1) % period])
    return samples


def bell(note: int, seconds: float) -> np.ndarray:
    t = np.arange(int(seconds * RATE)) / RATE
    f = hz(note)
    tone = np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 9) + 0.2 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t * 14)
    return tone * np.exp(-t * 3.5)


def bass(note: int, seconds: float) -> np.ndarray:
    t = np.arange(int(seconds * RATE)) / RATE
    envelope = np.minimum(1, t * 80) * np.exp(-t * 2.2)
    return np.sin(2 * np.pi * hz(note) * t) * envelope


def shaker(seconds: float, rng: np.random.Generator) -> np.ndarray:
    t = np.arange(int(seconds * RATE)) / RATE
    noise = rng.uniform(-1, 1, len(t))
    noise = noise - np.concatenate(([0], noise[:-1]))
    return noise * np.exp(-t * 60)


def add(track: np.ndarray, sound: np.ndarray, start: float, gain: float) -> None:
    offset = int(start * RATE)
    end = min(len(track), offset + len(sound))
    if offset < end:
        track[offset:end] += sound[: end - offset] * gain


def render(seconds: float) -> np.ndarray:
    rng = np.random.default_rng(7)
    track = np.zeros(int((seconds + 2) * RATE))
    bar_seconds = 4 * BEAT
    eighth = BEAT / 2
    bar = 0
    while bar * bar_seconds < seconds:
        chord_index = bar % 4
        bar_start = bar * bar_seconds
        for step, direction in enumerate(STRUM):
            time = bar_start + step * eighth
            if direction:
                notes = CHORDS[chord_index] if direction == "D" else CHORDS[chord_index][::-1]
                for string, note in enumerate(notes):
                    add(track, pluck(note, 1.2, rng), time + string * 0.012, 0.16 if direction == "D" else 0.1)
            add(track, shaker(0.08, rng), time, 0.05 if step % 2 else 0.08)
            melody_note = MELODY[chord_index][step]
            if melody_note is not None and bar >= 1:
                add(track, bell(melody_note, 1.0), time, 0.16)
        for beat in (0, 2):
            add(track, bass(BASS[chord_index], 1.2), bar_start + beat * BEAT, 0.35)
        bar += 1

    track = track[: int(seconds * RATE)]
    fade = int(1.5 * RATE)
    track[-fade:] *= np.linspace(1, 0, fade)
    track[: int(0.05 * RATE)] *= np.linspace(0, 1, int(0.05 * RATE))
    return track / np.max(np.abs(track)) * 0.85


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("output", type=Path)
    parser.add_argument("--seconds", type=float, default=20)
    args = parser.parse_args()

    audio = (render(args.seconds) * 32767).astype(np.int16)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(args.output), "wb") as output:
        output.setnchannels(1)
        output.setsampwidth(2)
        output.setframerate(RATE)
        output.writeframes(audio.tobytes())
    print(f"Wrote {args.output}")


if __name__ == "__main__":
    main()
