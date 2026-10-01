# Control deck asset

- Source: `assets/control-deck.blend`; original geometry, generated locally in Blender 5.2.2.
- Generator: `scripts/create-control-deck.py`.
- Runtime: `public/models/control-deck.glb`, displayed by `src/deck.js` using Babylon.js 8.56.2.
- Export: run `C:/Users/amdre/blender-5.2.2-windows-x64/blender.exe --background --python scripts/create-control-deck.py` from the repository root. This writes only the deck assets and `.local/control-deck-preview.png`.
- Records rotate around the imported Y axis. Named faders follow price and capacity; they never write economic state. Native HTML sliders and number inputs remain the input mechanism.
- Separate canvas, maximum 384 × 219 internal pixels, capped at 15 fps, intersection/visibility gated. Pause and reduced motion stop rotation; edits still update fader positions. Renderer is retained across dashboard field changes and disposed on a full page rebuild.
- The approved concert source, GLB, renderer, styles and Blender generator are unchanged. Do not run the concert asset generator for dashboard changes.
- No HyperFrames dependency or runtime was introduced.
