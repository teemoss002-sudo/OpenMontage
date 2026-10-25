# Pip: Color of the Day

Renders a 9:16 "Color of the Day" Short for the Pip Lessons for English channel: Pip at the bottom, a bouncing color title, and objects that pop in with their word and then line up along the top.

## Make an episode

```bash
make setup

.venv/bin/python scripts/pip_color_of_the_day.py red apple "fire truck" strawberry --theme-music
```

The video lands in `projects/pip/renders/color-of-the-day-<color>.mp4`.

- Colors: red, blue, yellow, green, orange, purple, pink, brown
- Objects: apple, strawberry, fire truck, car, balloon, heart, ball, star, flower, whale, fish, banana, leaf, umbrella, sun
- `--no-voice` skips narration, `--theme-music` composes the Pip theme to fit the episode, `--music <file>` uses your own track, `--output <path>` changes where the mp4 goes

Narration uses the free offline Piper voice (`en_US-lessac-medium`, downloaded on first run), pitched up for Pip. `pip_music.py` synthesizes an original ukulele and glockenspiel loop, so there is nothing to license.

## Where things live

- `remotion-composer/src/pip/Pip.tsx`: the Pip character
- `remotion-composer/src/pip/items.tsx`: object drawings; add a new one here and to `ITEMS` in the script
- `remotion-composer/src/pip/PipColorOfTheDay.tsx`: the episode layout and animation
- `scripts/pip_color_of_the_day.py`: voice, timing, and render
