# Concert pixel dashboard — Addendum 03

Revision branch: `concert-pixel-dashboard`. Supersedes the earlier concert-only visual/control validation. Original user briefs remain unchanged. The app remains a single concert lesson on the existing Railway service.

## Delivered

- Original Blender 5.2.2 LTS source: `assets/concert.blend`; reproducible `npm run assets` / `scripts/create-pixel-concert.py`. Optional source preview: `scripts/render-pixel-preview.py`.
- Two turntables, tonearms, mixer/faders, speakers, truss, stage, entrance and tile floor. Articulated DJ hands use a reproducible two-bone solution to keep the left hand on the record; right hand works the mixer and acknowledges the audience. Source loop: 192 frames / 24 fps / 8 seconds. Export has 11 animated groups, played from a single browser clock.
- Four original audience designs, eight posed frames each. Babylon thin instances reuse these 32 meshes. At capacity <=300, one figure per attendee; above that, `ceil(capacity/300)` guests per figure, visibly labeled. Exact attendance is always separate from the representative crowd. Empty attendance produces zero figures.
- One fixed-camera pixel scene: no alternative renderer. 512-pixel maximum internal width, no antialiasing, nearest-neighbour CSS enlargement, palette vertex colors with simple runtime materials. Accessible DOM signs remain crisp. Pause/reduced motion retain scenario updates. Load failure retains metrics/controls and offers Retry.
- Dashboard: typed and slider inputs, estimated/manual audience, fictional locations, optional costs/promotion/sponsorship/sensitivity, inline validation, transactional Undo, Reset, locally saved/restorable/exportable mixes. Shared limits include capacity 1–10,000. A location updates exactly demand, production, venue rate and guest cost; all other inputs remain.
- USD throughout active UI, coach, methodology and new media. Money is calculated using integer cents; the presentation change is not a currency conversion. ROI remains profit / total costs, null when costs are zero.
- Native TypeSafe Evaluate in the existing n8n workflow, then explicit confidence branching. AI still only selects authored paragraphs; it cannot invent numerical claims. User voice preference and English/German support retained.

## Reference and visual review

The initial web fetch of the YouTube reference failed. A later direct retrieval succeeded; frames across the clip were inspected. It demonstrates Blender-to-pixel-art treatment with strong silhouettes and readable character faces. No reference footage or third-party art is shipped in the app. This is original concert artwork inspired by that treatment, not an asserted exact match.

Inspected Blender preview, 8-second sampled source loop/contact sheet, browser stage view and DJ close-ups at 0, 2, 6 and 7.96 seconds. This caught and corrected hovering hands, reversed camera direction and material color interpretation. Runtime stage, hands and crowd were checked again after export. `blender-loop.mp4` is a 3 fps review proxy of the 24 fps source; `live-lever-change.mp4` records the actual app.

## Verification

- 21 Node test groups: all eight exact addendum regression rows; cents, zero-cost ROI, zero demand, manual capping, maximum capacity, independent promotion spending, currency formatting, monotonic bounded crowd grouping; existing contract/input/numeric tampering checks; configurable confidence threshold and mocked timeout/auth/rate-limit outputs.
- Browser acceptance at desktop 1440×1080 and mobile viewport 390×844: price 20→30→10; crowd 150→100→200; negative profit; empty numeric input; manual mode/cap; location preservation/Undo; add/remove/reset variables; promotion/sponsorship; Save/Restore; zero-cost ROI; 10,000 attendees represented by 295 figures; reduced motion; German; no horizontal overflow. Forced GLB failure preserves the dashboard and retry, without an alternate view.
- Motion checks compare rendered pixels during pause and after resume; paused input still changes attendance. Delayed mocked AI response is discarded after a scenario revision.
- Voice: synthetic microphone audio passed through real OpenAI transcription, editable transcript, validated capacity change, real n8n and real ElevenLabs playback. Mocked denial, transcription failure, silence, cancellation and stale audio also passed. This is not a real phone microphone test or human accent approval.
- Real native TypeSafe + OpenAI executions are recorded in `evidence/addendum03/n8n-live.json`. Eight labeled questions exercise four successful explanation routes and four clarification routes in the recorded sample. Model version: `jev-1.13.0`; configured alias `jev-latest`. Clear questions can score below 0.80; no accuracy claim is made. Provider failures are mocked separately from these real executions.
- English/German short films are approximately 70.8 seconds, 960×960, with configured ElevenLabs narration, WebVTT and transcripts. These are fixed examples, not the live scene and not the competition submission video.

## Size and performance

Concert GLB: 1,373,956 bytes (previous model 7,461,468 bytes). Source `.blend`: 205,431 bytes. English film: 15,704,877 bytes; German film: 16,018,557 bytes. Exact artifacts are listed in `evidence/addendum03/artifact-sizes.json`. Observed headless Chromium software-rendered frame rates improved from about 15 fps with PBR shading to approximately 38–49 fps across sampled runs with simple palette materials; other short samples reached 60 fps. Measurements depend on simultaneous rendering/tests and are not real-device performance promises. `motion-performance.json` stores the sampled values and environment. Browser resolution is capped at 512 pixels wide; mobile uses its narrower viewport width.

## Manual review still needed

Open the existing QR code on a real phone, try recording a question, inspect pixel-art readability and confirm the preferred voice/accent. Fluent German editorial review is still appropriate. The final Flow4Gold competition video remains the last step after product review; nothing has been submitted to the competition.

## Release

Deployment details are appended after production verification. The workflow export contains no credential references or secrets. Existing n8n workflow URL and authenticated path are preserved.

Production verification completed for application commit `6ae80f0` on Railway deployment `827496f5-5616-41e1-960b-9fe3067da236` (SUCCESS). Live URL: https://web-production-af12a.up.railway.app.

Hosted desktop/mobile browser acceptance passed in English and German with no page errors, 11 animation groups loaded, and 512/364-pixel internal scene widths. Evidence screenshots and browser-check.json were refreshed against this deployment. Latest local motion samples were 46.5–54.8 fps; pause remained pixel-stable and stale responses were discarded. These are emulated/software-rendered checks, not physical-phone measurements.

Real hosted English/German coach calls passed through the native TypeSafe node and OpenAI with verified profits of $1,500 and $500; see railway-coach.json. Those calls used the immediately preceding deployment with the same backend; the final application change only adjusted crowd and DJ animation.

Hosted English and German films both passed complete playback at 4x speed: 960 by 960, 70.84 seconds, 16 caption cues each, with scenario state preserved. The delayed-tutor-response check also passed: no competing speech starts while the film is playing.
