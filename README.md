# The Economics of Everything

Three interactive economics lessons with original Blender worlds, animated 2D/3D views, English/German text, captioned short videos and optional microphone questions and spoken replies.

Live: https://web-production-af12a.up.railway.app. The existing QR code in docs/demo-qr.svg is unchanged.

## Lessons

| Route | Experiment |
| --- | --- |
| /lessons/concert-economics | Ticket price, independent demand, venue capacity and costs |
| /lessons/conference-economics | Sponsorship, workshop/networking access and budget |
| /lessons/factory-supply-chain | Daily production, component deliveries, inventory and sales |

Append ?lang=de for German. Root opens the concert with links to all lessons. Presets identify changed assumptions. Reset scenario, Reset view, Pause motion and Save A have separate purposes. Factory has explicit day advancement.

## Run

Requires Node 22+. Install with npm ci, then npm run dev (port 3000). Production: npm run build then npm start. Use .env.example when setting up a new checkout; never overwrite an existing configured .env. Without service credentials, prepared text and calculations still work. Microphone capture requires HTTPS or localhost.

## Services

Import workflow/economics-concert.json into n8n. The filename and authenticated webhook path are preserved, but all three topics are supported. Select Header Auth on Lesson request, with header X-Lesson-Key and a random secret. Select an OpenAI credential on Select lesson explanation, then publish.

Server variables: N8N_WEBHOOK_URL, matching N8N_WEBHOOK_SECRET, OPENAI_API_KEY for transcription, ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID for speech, PUBLIC_ORIGIN for the exact HTTPS origin. Railway uses TRUST_PROXY_HOPS=1 and a single replica. Credentials never reach browser code. Owner-specific deployment helpers are scripts/n8n-deploy.js and scripts/configure-railway.js.

## Trusted calculations

shared/registry.js contains field schemas, bounds, presets and deterministic formulas. shared/lesson.js supplies authored bilingual explanations. npm run workflow embeds the same functions in n8n. AI selects approved paragraph IDs and a declared scene focus. It cannot invent numbers or execute code. Server and browser validate matching results and request revisions.

Concert: D = floor(M * (p/20)^(-e)); attendance = min(capacity,D); cost = productionBudget + venueRate * capacity + perGuest * attendance; profit = revenue - cost. Return on cost is null at zero cost. Capacity does not create demand.

| Capacity | Demand at price 20 | Price | Guests | Cost | Profit |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 200 | 150 | 20 | 150 | 2250 | 750 |
| 200 | 150 | 30 | 100 | 2000 | 1000 |
| 1000 | 150 | 20 | 150 | 4250 | -1250 |
| 1000 | 900 | 20 | 900 | 8000 | 10000 |
| 5000 | 4500 | 20 | 4500 | 36000 | 54000 |
| 20000 | 18000 | 20 | 18000 | 141000 | 219000 |

Conference: revenue is ticket income plus sponsorship; funding budget is a separate constraint. Default revenue 30000, cost 25000, surplus 5000. Workshop seats 200 to 300 raises access 40% to 60% and lowers surplus to 4000. Access does not measure satisfaction or sponsor ROI.

Factory: receive, produce/consume, sell, accrue costs, advance. Reference daily output: 100,50,0,100; closing component inventory: 50,0,0,100. FIFO premiums are consumed once. Purchase cash is separate from expenses; unsold finished vehicles remain inventory. Unfilled production opportunities are not automatically lost sales.

All currency and demand assumptions are invented for teaching. This is a bounded lesson tutor, not an unrestricted chatbot or forecast.

## Voice and videos

Microphone -> OpenAI transcription -> validated setting command when present -> n8n -> approved text -> configured ElevenLabs voice. Recording lasts at most 30 seconds with Stop & send and Cancel. Scenario/language/topic changes discard pending responses. Stop audio also suppresses pending speech. Permission denial leaves text input usable.

Three preset stories in two languages run approximately 70-74 seconds each. These are actual animated browser recordings of original Blender scenes, with native caption tracks and transcripts. Live controls do not alter recorded numbers. Learner media is separate from the pending competition video.

Regenerate using scripts/generate-narration.js then scripts/record-explainers.js against a production preview. These require FFmpeg and Playwright Chromium; narration calls the paid speech service for missing cached clips. Existing owner-configured ElevenLabs voice is used; no new voice was cloned. Factory narration is sped up 8% to stay under 75 seconds. Rebuild afterward to include media in dist.

## Fallbacks and privacy

Invalid input receives a correction. Model/n8n/network failure uses labeled prepared text. Failed 3D uses animated 2D. Failed speech retains text. Stale answers cannot update another scenario.

Lesson limits: 12/minute/IP and 300 upstream calls/day/process. Voice: 6/minute/IP and 200/day/process; uploads limited to 5 MB. In-memory limits reset on restart; multiple replicas need shared storage. No database is required.

Application logs omit questions, recordings, session IDs and secrets. n8n execution payload saving is disabled. Microphone recordings remain in memory for transcription rather than being saved to disk. Providers process transmitted questions/audio under their own policies. The UI discloses AI speech and asks learners to omit personal information.

## Verify

npm test covers formulas, contract validation, fallback and gateway behavior. Set TEST_BASE_URL to a running production preview, then run npm run test:browser and node scripts/check-revision-live.js. node --env-file=.env scripts/voice-browser.js uses synthetic microphone audio with real transcription, n8n and ElevenLabs services.

Run scripts/create-worlds.py in Blender to rebuild assets/*.blend and public/models/*.glb. Crowd figures represent groups, avoiding one mesh per real attendee.

See docs/ADDENDUM-VALIDATION.md, docs/CONTROL-INVENTORY.md, docs/MANUAL-STEPS.md and docs/SUBMISSION.md. Actual phone microphone behavior and human voice/language preferences require owner review. Competition recording remains the final production step.
