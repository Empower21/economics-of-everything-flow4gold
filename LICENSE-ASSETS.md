# Media and voice asset notice

The MIT License in `LICENSE` covers the source code, the n8n workflow export, scripts, tests and documentation text in this repository.

It does not cover the following, which are Copyright (c) 2026 AMDR, all rights reserved:

- `public/media/**`: recorded learner films, narration audio, captions, transcripts and posters.
- `public/models/**` and `assets/*.blend`: the Blender concert world, character designs and exported GLB models. `assets/CONTROL-DECK.md` is documentation and stays MIT.
- Any audio produced with the owner's configured ElevenLabs voice, wherever it appears.

You may view and play these files while running or demonstrating this project, including in your own imported copy of the workflow and companion app. You may not extract, redistribute, remix, sell, train models on, or reuse them in other projects, and you may not clone or imitate the narration voice.

To build your own version, regenerate the assets from `scripts/create-*.py` and `scripts/generate-narration.js` with your own voice configuration; those scripts are MIT.

Bundled fonts keep their SIL Open Font License under `docs/licenses/`. Provenance is recorded in `docs/THIRD-PARTY-NOTICES.md`.
