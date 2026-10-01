<!-- Current revision: Addendum 03; earlier documents are historical evidence. -->
﻿# The Economics of Everything

One interactive concert economics lesson with an original Blender world and animated Babylon.js scene with a live pixel-art crowd and neon metrics, English/German text, captioned short videos and optional microphone questions and spoken replies.

Live: https://web-production-af12a.up.railway.app. The existing QR code in docs/demo-qr.svg is unchanged.

## Use this template

- [Download the Creators portal workflow JSON](submission/The-Economics-of-Everything-Concert-n8n.json).
- [Follow the recipient setup guide](submission/TEMPLATE-SETUP.txt).
- [Watch the 1:49 walkthrough](https://youtu.be/JP_wxRAzGkc).

The public demo uses the creator's backend. To use your own n8n credentials, import the workflow, install TypeSafe AI, and deploy this companion web application with your own production webhook URLs and shared secret. Importing the JSON does not reconnect the public demo to your instance. Voice credentials are configured separately on the website server. One workflow contains both coaching and event-research branches.

## Lessons

| Route | Experiment |
| --- | --- |
| /lessons/concert-economics | Ticket price, independent demand, venue capacity and costs |

Append ?lang=de for German. Root opens the concert. Mix Your Margins offers typed/sliding levers, fictional location profiles and estimated/manual attendance. Reset concert, Pause motion and Save this mix have distinct purposes. The guided story introduces the purpose, controls, economic trade-offs and architecture. See docs/ADDENDUM-03-VALIDATION.md and docs/TYPESAFE-SETUP.md for current implementation and evidence.

## Run

Requires Node 22+. Install with npm ci, then npm run dev (port 3000). Production: npm run build then npm start. Use .env.example when setting up a new checkout; never overwrite an existing configured .env. Without service credentials, prepared text and calculations still work. Microphone capture requires HTTPS or localhost.

## Services

The single canonical production workflow is [The Economics of Everything ? Concert System](https://amdrfound.app.n8n.cloud/workflow/Cbr6Bvxj4vKROEaE). See [Addendum 05 validation and rollback](docs/ADDENDUM-05-VALIDATION.md). The old research canvas is inactive. For reproduction, import workflow/economics-concert.json into n8n. The filename and authenticated webhook path are preserved, and only the concert topic is supported. Select the same Header Auth on Lesson request and Event research request, with header X-Lesson-Key and a random secret. Select the existing OpenAI credential on Select lesson explanation and Retrieve dated sources and a TypeSafe AI API credential on Identify concert question, then publish.

Server variables: N8N_WEBHOOK_URL, N8N_EVENTS_WEBHOOK_URL (two entries on the same canonical workflow), matching N8N_WEBHOOK_SECRET, OPENAI_API_KEY for transcription, ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID for speech, PUBLIC_ORIGIN for the exact HTTPS origin. Railway uses TRUST_PROXY_HOPS=1 and a single replica. Credentials never reach browser code. Owner-specific deployment helpers are scripts/n8n-deploy.js and scripts/configure-railway.js.

## Trusted calculations

shared/registry.js contains field schemas, bounds, presets and deterministic formulas. shared/teaching.js supplies bilingual field metadata, causal comparisons and scene state; shared/lesson.js supplies authored tutor explanations. npm run workflow embeds the same functions in n8n. AI selects approved paragraph IDs and a declared scene focus. It cannot invent numbers or execute code. Server and browser validate matching results and request revisions.

Concert: D = floor(M * (1 + promotionBoost/100) * (p/20)^(-e)); attendance = min(capacity, manual ? manualAttendance : D); cost = productionBudget + venueRate * capacity + perGuest * attendance + promotionBudget; revenue = ticketPrice * attendance + sponsorship; profit = revenue - cost. Return on cost is null at zero cost. Capacity does not create demand.

| Capacity | Demand at price 20 | Price | Guests | Cost | Profit |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 200 | 150 | 20 | 150 | 2250 | 750 |
| 200 | 150 | 30 | 100 | 2000 | 1000 |
| 1000 | 150 | 20 | 150 | 4250 | -1250 |
| 1000 | 900 | 20 | 900 | 8000 | 10000 |
| 5000 | 4500 | 20 | 4500 | 36000 | 54000 |

All amounts are USD; demand/cost assumptions are fictional teaching inputs. Capacity is limited to 10,000. This is a bounded lesson tutor, not an unrestricted chatbot or forecast.

## Voice and videos

Microphone -> OpenAI transcription -> editable transcript -> Send -> validated setting command when present -> n8n -> approved text -> configured ElevenLabs voice. Recording lasts at most 30 seconds with Stop recording and Cancel. Scenario/language/topic changes discard pending responses. Stop audio also suppresses pending speech. Permission denial leaves text input usable.

One guided product story runs approximately 4 minutes 30 seconds in English and 5 minutes 15 seconds in German, in a phone-friendly 960 × 960 composition. Eleven chapters cover the purpose, pricing, capacity, costs, audience assumptions, competing events, saved comparisons, voice/text coaching and the deterministic/n8n architecture. Chapter buttons support seeking. These are actual animated browser recordings of original Blender scenes, with native caption tracks and transcripts. Live controls do not alter recorded numbers. Learner media is separate from the pending competition video.

Regenerate using node --env-file=.env scripts/generate-narration.js then node scripts/record-explainers.js against a production preview (TEST_BASE_URL, default http://127.0.0.1:3196; matching PUBLIC_ORIGIN required for demonstration requests). STORY_PREVIEW=1 produces chapter screenshots; STORY_LANGUAGE=en or de limits a render to one language. Narration caches are keyed by script, language and configured voice. These require FFmpeg and Playwright Chromium; narration calls the paid speech service for missing cached clips. Existing owner-configured ElevenLabs voice is used; no new voice was cloned. Rebuild afterward to include media in dist.

## Fallbacks and privacy

Invalid input receives a correction. Model/n8n/network failure uses labeled prepared text. Scene failure keeps the accessible dashboard and shows Retry; there is no second renderer. Failed speech retains text. Stale answers cannot update another scenario.

Lesson limits: 12/minute/IP and 300 upstream calls/day/process. Voice: 6/minute/IP and 200/day/process; uploads limited to 5 MB. In-memory limits reset on restart; multiple replicas need shared storage. No database is required.

Application logs omit questions, recordings, session IDs and secrets. n8n execution payload saving is disabled. Microphone recordings remain in memory for transcription rather than being saved to disk. Providers process transmitted questions/audio under their own policies. The UI discloses AI speech and asks learners to omit personal information.

## Verify

npm test covers formulas, contract validation, fallback and gateway behavior. Set TEST_BASE_URL to a running production preview, then run node scripts/pixel-browser-check.js and node --env-file=.env scripts/pixel-n8n-check.js. node --env-file=.env scripts/voice-browser.js uses synthetic microphone audio with real transcription, n8n and ElevenLabs services.

Run npm run assets to rebuild assets/*.blend and public/models/*.glb with the installed Blender 5.2.2 LTS. Override BLENDER_EXE if needed. Blender exports DJ/record/light animations and four reusable audience designs. Babylon plays the single pixel scene and instances live crowd poses; no HyperFrames dependency was added. One figure per guest at small capacities; larger capacities use an explicit scale capped at 300 visible figures.

See docs/ADDENDUM-03-VALIDATION.md, docs/CONTROL-INVENTORY.md, docs/MANUAL-STEPS.md and docs/SUBMISSION.md. Actual phone microphone behavior and human voice/language preferences require owner review. Competition recording remains the final production step.
