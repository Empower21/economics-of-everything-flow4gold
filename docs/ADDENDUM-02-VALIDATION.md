# Addendum 02 delivery record

Checkpoint: Git tag `before-addendum-02`. The user-supplied Addendum 02 remains intact. Existing Railway project, public URL, QR destination, n8n workflow and calculation keys are preserved.

## Implementation

- `shared/teaching.js`: bilingual field dictionary, units, bounds, placement, worked examples, setup text, deterministic before/after explanations, scene state and explicit zone experiments. The economic formulas are unchanged.
- `src/experience.js`, `src/teaching.css`: two concert / three conference / three factory primary decisions; optional assumptions, cost breakdown, four principal outcomes, causal explanation and Undo. Scene selection is independent of scenario changes. Factory starting-assumption changes restart at day 0; Undo restores the prior complete scenario and day. Simulation playback and decorative motion remain separate.
- `shared/lesson.js` and sanitized workflow: n8n selects approved explanations containing the actual previous and current scenario. No earlier state is disclosed explicitly. No invented backup shipment or literal workshop queue. Spending limit and financial result remain distinct.
- `src/voice.js`, `server/voice.js`: editable transcript before Send, compact microphone, opt-in spoken answers, answer playback controls, creator audition available through `?review=1`. Existing ElevenLabs voice retained. Spoken changes use the same validation and Undo; ambiguous multi-setting requests clarify.
- `scripts/create-worlds.py`, base/polish scripts, editable `.blend` files and GLBs: original articulated adult characters with faces, hair, varied clothing, DJ equipment, speaker/workshop/networking spaces, factory workwear and shaped cars with glazing, tires and lights. Named joints animate in Babylon. Representative groups are labeled; scene activity follows the calculator. This is stylized geometry, not photorealism or a downloaded production character rig.
- `src/scene.js`: actual imported-object focus targets, selected outlines, purposeful joint motion, stock visibility, stopped production and finished inventory. Static shadow maps, cached joint lookup and offscreen rendering suspension limit repeated work. No animation runs per model/API call.
- `src/illustration.js`: distinct original SVG fallback scenes with articulated figure movement, shaped cars and matching scenario/zone state. Unavailable 3D controls and drag instructions are removed in fallback.
- Six composed, square browser-recorded lesson films, using the same Blender/Babylon worlds. Large narrative cards replace the dashboard; captions are split into short sentences, with full transcripts. One conference narration segment in each language was revised to avoid implying modeled workshop demand. These are not the competition submission video.

## Blender update

Installed portable Blender **5.2.2 LTS** alongside 4.3.2 at `C:\Users\amdre\blender-5.2.2-windows-x64`. The official release directory identified 5.2.2 as current. The direct server presented a Cloudflare challenge; the archive came from the Clarkson mirror, and its SHA256 matched the release checksum also served by NLUUG and Berkeley:

`3849d17a682cba006075aaa3f3597ecb5c9c30ec31035b2e092c53e40679b535`

`blender.exe --version` reported 5.2.2 LTS. Windows Authenticode status was Valid. A Start-menu shortcut named Blender 5.2 LTS was added. Rebuild with `npm run assets`; `BLENDER_EXE` can override the executable. The older install and reversible Git checkpoint remain available. No HyperFrames dependency, project or runtime was added.

## Verification log

Local checks completed during implementation:

- 17 Node test groups: gateway validation, origins, upstream failure/drift, formula reference cases, factory event/FIFO accounting, validated commands, causal comparison context, field coverage, focus purity and production-state derivation.
- Desktop and 390 × 844 mobile emulation: price 20→30, capacity-only 200→1000, workshop 200→300, factory day 1–4, settings restart and Undo, simulation pause, selected zones without mutation, explicit experiments, comparisons/reset, German routes, overflow, failed assets and stale answers.
- Blender 5.2.2 exports and Babylon browser screenshots inspected for all three worlds and a character close-up. The remote review's 3D failure was not reproduced locally; a blocked GLB request was deliberately tested. That does not establish the cause on the reviewer's browser.

Final build, hosted checks and media evidence are appended after completion below. Do not interpret in-progress checks as deployment confirmation.

## Review boundaries

- No observed first-time-learner usability session has been conducted.
- Mobile screenshots and recordings are Chromium emulation, not a new physical-phone test. Alicia's prior physical-phone QR success predates this revision.
- The configured voice is preserved; Alicia's accent/preference acceptance and fluent German pronunciation review are still pending.
- The art is an original stylized treatment. Human judgment of whether its proportions, movement and framing meet the desired polish remains a review step; a passing calculation test does not establish visual quality.
- No competition entry, consent or submission video was submitted. The approximately two-minute competition video remains last.

## Final local verification

- Final production build succeeded. The existing Babylon bundle-size warning remains; no phone frame-rate guarantee is claimed.
- Updated asset suite passed desktop and mobile emulation checks, including pixel-stable paused motion versus changing resumed frames, all three forced-asset-failure fallbacks, non-mutating zone selection, explicit experiments, Undo, comparison/reset, factory restart, German routes and stale-answer rejection.
- Real service test used a synthetic microphone file: recognized transcript remained editable until Send, then the validated 1,000-capacity change reached n8n and played through ElevenLabs. Permission denial, cancel, silence (no transcription request), transcription failure, mute and pending/stale speech checks passed. This is not a physical microphone test.
- Live n8n returned approved previous/current explanations in both languages (750 → 1,000) without using fallback.
- The media run at 8× timed out during a concurrent graphics test. A separate complete-playback run is used for final media verification; the timeout is not counted as a pass.
- Source scan passed 133 staged/tracked files. Code diff whitespace checks passed; intentional Markdown hard-break spaces in the untouched user-supplied addendum are preserved.
- Browser evidence: character-closeup.png; all three *-world.png images; desktop/mobile input-change MP4s; full-page desktop/mobile and fallback screenshots in docs/evidence/addendum02.

- Separate complete playback at 4× passed all six 960 × 960 films in a 390 × 844 viewport. Durations: concert 70.00 s, conference 73.01 s, factory 72.16 s. Each has 15–17 caption cues and a transcript; opening/playback left the live scenario unchanged.
- Final source scan passed 135 staged/tracked files.
