# Addendum 01 validation — September 29, 2026

The initial release is preserved by Git tag `before-addendum-01`. This revision implements three lessons rather than the original concert-only scope. The selected existing ElevenLabs voice is used directly; an exact Caribbean accent match has not been claimed.

## Local production verification

- 13 automated test groups passed: legacy reference checks, v2 reference calculations, finite/bounded inputs, fractional costs, zero demand/cost, conference access, factory receive-before-produce order, consumed premiums, unsold inventory, command bounds, response validation and gateway failures.
- All three original Blender scenes loaded in Playwright Chromium. Desktop 1440×1080 and mobile emulation 390×844 passed input, comparison, reset, German switching and direct reload checks.
- Capacities 1,000, 5,000, 20,000 and custom 1,234 were exercised through the UI without changing demand. Live n8n requests at those scales returned validated results, including custom profit 6,415 for capacity 1,234 and demand 700.
- Conference 300 workshop seats returned surplus 4,000 and access 60%. Factory four-day sequence matched 100/50/0/100 output and 50/0/0/100 closing components.
- The selected voice passed a complete browser test: synthetic recorded microphone question → real OpenAI transcription → validated capacity 1,000 → live n8n response → actual ElevenLabs audio playback. This verifies the integration but does not substitute for a physical phone microphone test.
- Cancel released microphone tracks. Denied permission retained working text input. Speech has revision and playback guards; Stop audio suppresses pending playback.
- Six MP4s passed actual browser playback, native caption cues and transcript checks in both desktop and mobile emulation: concert 70.0s, conference 73.4s, factory 72.2s in each language.
- Paused canvas frames were byte-identical across a wait; resumed motion changed the frame. This checks visible animation without asserting a frame-rate guarantee.
- Failed GLB loading fell back to usable 2D. A delayed answer could not overwrite the newer price/profit. Browser back/forward and methodology routes passed. Tested views had no horizontal overflow or page JavaScript errors.

## Evidence and reproduction

Before screenshots: `docs/evidence/before/`. After screenshots and desktop/mobile interaction recordings: `docs/evidence/after/`. Recordings show controls and results, including playable videos. The synthetic voice test screenshot is also included.

Scripts: `revision-browser.js`, `revision-acceptance.js`, `voice-browser.js`, `check-revision-live.js`. Set `TEST_BASE_URL` to choose local production or hosted testing. Tests that invoke live providers incur normal account usage. No secret values or personal recordings are stored in evidence.

The supplied YouTube inspiration was downloaded to ignored local storage and sampled visually. Its large-world/context-panel approach informed the revision. Its footage is not included in the product.

## Deployment verification

Railway service variables include the existing authenticated n8n connection, OpenAI transcription key and selected ElevenLabs key/voice ID. The existing project and public domain are retained.

Hosted deployment `4f65d8fa-5c04-4849-b7ae-a17583aaae6d` reached SUCCESS. The public health endpoint reported n8n configured. The full desktop/mobile acceptance suite passed against the public HTTPS address, including all six videos, caption tracks, direct routes, motion pause/resume, fallback, stale text protection and history. Live hosted n8n calls passed all six selected concert/conference/factory scenarios without fallback. The hosted voice suite passed actual transcription/n8n/ElevenLabs playback, denied permission, cancellation, forced transcription error and pending-audio suppression after mute or scenario change.

A final chart correction includes carrying and operating costs in the factory's 2D cost bar when no cars are sold; a focused browser test passed with cost 1,005 and a full-width cost bar. The revised page metadata also names all three lessons. Final deployment confirmation is recorded below.

## Human checks still required

- User's actual phone: new scene touch behavior, microphone permission, recording, audio output and native video captions.
- User's voice preference and fluent German pronunciation/content review. The requested existing voice is used, but human preference cannot be certified by automated testing.
- Competition video with entrant introduction, final public video link, creator-template/competition form details and manual submission. The competition video remains the final production step; these six videos are learner explainers.

The user confirmed QR and initial release controls on a phone before this revision. That is recorded separately from new-version physical-device validation. No learning outcomes, production ROI, translation-review savings or real-device frame-rate claims are made.
