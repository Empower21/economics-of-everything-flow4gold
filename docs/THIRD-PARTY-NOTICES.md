# Asset provenance and dependencies

The concert world is original geometry authored by `scripts/create-venue.py` and `scripts/create-worlds.py`. Editable Blender files and GLBs are included. No downloaded third-party characters or venues are used.

Six learner videos are recordings of those animated browser scenes, with authored English/German narration synthesized using the owner's existing configured ElevenLabs voice. No new voice clone was created. Source narration and timing live in `scripts/media-plan.js`; public videos, transcripts, captions and posters live in `public/media/`. No background music or third-party video footage is included. The supplied YouTube reference was inspected locally for interaction inspiration and is not shipped.

The locally bundled DM Sans and Manrope fonts are supplied by their respective Fontsource packages under the SIL Open Font License. Unmodified license notices are retained in `docs/licenses/`.

Babylon.js and its glTF loader are distributed under Apache-2.0. Express, Vite, and the other JavaScript dependencies retain their licenses in their npm packages; exact resolved versions are recorded in `package-lock.json`. The application uses n8n and OpenAI as connected services rather than bundling those services' software or branding assets.

The `e•` application mark is a simple original typographic mark. The product does not use n8n's logo as its own identity.

## Addendum 02 assets

Articulated character geometry, environments and SVG fallback illustrations were authored in this project. No Rain character, reference-video footage or third-party character rig was imported. Blender 5.2.2 exports are identified in public/asset-manifest.json. Revised learner films are recordings of those Blender assets animated by Babylon.js. Existing configured ElevenLabs concert narration is retained. No voice cloning or HyperFrames project was introduced.
