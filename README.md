# Birthday Battle — Visual Refinements

Static website for GitHub Pages. Open `index.html` locally or deploy the project folder.

## Add to `assets/`
- `loading.png`, `battleg.png`, `opponent.png`, `love.png`, `win.png`
- `loading.mp3`, `battlebegin.mp3`, `screech.mp3`, `attack.mp3`, `low.mp3`, `attack2.mp3`, `catch.mp3` (3 seconds), `move.mp3` (6 seconds), `catch2.mp3`, `end.mp3`, `win.mp3`
- `battle back.webp` is included.

## Fixes in this revision
- Hides duplicated name/level text; the background artwork supplies those details and only live HP is overlaid.
- Capture ball launches from Love toward Saloni's grass platform and stays on the grass patch, not the bottom battle card.
- Love Shower uses larger pink hearts, Love Shock uses a pink lightning bolt with heart particles, and Rose Throw is larger.
- Every Love attack's `attack.mp3` finishes before Saloni's Cuteness turn. On the third attack, `low.mp3` plays after `attack.mp3`, while the battle music continues looping.
- Saloni's counterattack uses `attack2.mp3` and finishes before the not-very-effective text appears.
- The third move leaves Saloni at 1 HP.
- Capture stars appear only after `move.mp3` ends.
- `battleg.png` appears behind the battle frame.


## V6 targeted updates
- Raised both battle sprites and enlarged the opponent sprite slightly.
- Renamed the player character in dialogue to Lovchu (sprite file remains `assets/love.png`).
- Replaced Love Beam with Love Shock, a pink lightning effect with heart particles.
- Capture order is now: `move.mp3` finishes, the Poké Ball stops, `catch2.mp3` plays with stars, `end.mp3` plays, then `win.mp3` starts.
- No unrelated scene or layout redesigns were made.


## V7 updates
- Added a separate `reveal.html` page after the initial Tap to Interact screen. It uses `assets/reveal.png` as the background and plays `assets/reveal.mp3`; FIND OUT appears when the audio ends and plays `assets/ding.mp3`.
- FIND OUT opens `index.html?load=1`, which starts the existing loading scene and preserves the existing ready/battle flow.
- Moved Lovchu and Saloni upward onto their grass platforms and enlarged Saloni slightly to avoid the status panels.
- Added `ding.mp3` to the four main battle action buttons.
- Poké Ball dialogue now says `Vasanth threw a Poké Ball!`.
- Added a pixel-style CONTINUE button at the lower-right of `win.png`; it opens `evolve.html`, a placeholder page reserved for the next stage. The Pokédex profile page remains available separately as `pokedex.html`. The supplied Pokédex image is included as `assets/pokedex.png`.

## Required assets to add
This project bundle does not contain your separate character sprites or audio files. Add these into `assets/` before testing/deploying: `reveal.png`, `reveal.mp3`, `ding.mp3`, `loading.png`, `battleg.png`, `opponent.png`, `love.png`, `win.png`, and the existing battle audio (`loading.mp3`, `battlebegin.mp3`, `screech.mp3`, `attack.mp3`, `low.mp3`, `attack2.mp3`, `catch.mp3`, `move.mp3`, `catch2.mp3`, `end.mp3`, `win.mp3`). Keep the filenames exact. `battle back.webp` and `pokedex.png` are included.


## Updated V7 responsiveness and input fixes
- Main action buttons and move buttons fire `ding.mp3` immediately without waiting for the sound to finish before the UI responds.
- The victory background uses `contain` so the full `win.png` artwork can fit phone screens instead of being aggressively cropped; the Continue button is raised to avoid obstructing the artwork.
- Continue now opens `evolve.html`, a placeholder for the next planned scene.

\n## V8 evolution scene
- Added `evolve.html` with the supplied `assets/evolve.webp` background, a pixel dialogue box, opponent sprite blinking, sparkles, and the `bdg.png` evolved sprite.
- Text advances with `ding.mp3`; after “What? Saloni is Evolving?” finishes, `evolve.mp3` plays while the sprite blinks and sparkles animate.
- When `evolve.mp3` ends, `bdg.png` replaces `opponent.png` and `evolve1.mp3` plays. The birthday dialogue then continues and YES opens `pack.html`.
- NO jumps away from the pointer/touch.
- Fixed capture audio sequence: `catch.mp3` → Poké Ball shakes with `move.mp3` and stars → `catch1.mp3` → `end.mp3` → victory flow.
\n## V8 assets to add
Add these exact files under `assets/`: `opponent.png`, `bdg.png`, `ding.mp3`, `evolve.mp3`, `evolve1.mp3`, `catch.mp3`, `move.mp3`, `catch1.mp3`, `end.mp3`, plus all other existing assets listed above. The supplied evolution background is included as `assets/evolve.webp`.


## V8 follow-up fixes
- Capture stars now appear only after `move.mp3` finishes; the Poké Ball remains shaking during the audio and then settles before the stars burst out.
- Evolution sprites (`opponent.png` and `bdg.png`) are significantly larger, with responsive sizing for phones and desktop.
