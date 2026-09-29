# Flow4Gold Addendum 01 — three lessons, animation, voice and interactive repairs

Date: September 29, 2026. Project: The Economics of Everything.

Read alongside Flow4Gold_Build_Brief.md. This addendum takes precedence wherever the original brief conflicts with it. Extend the existing working implementation; do not restart the project.

## 1. Current situation and scope changes

Alicia reports that the first concert lesson is running, ticket-price adjustment works, capacity is fixed at 200, visuals need stronger animation and recognizable forms, voice interaction is missing, and some arrows/links do not work. Blender is already installed. Railway is the selected deployment platform.

These are user-reported observations. The author of this addendum has not inspected the current repository, live deployment or broken controls. Codex must reproduce the issues in the existing project before claiming a repair.

The original brief mentioned conferences and supply chains but postponed their implementation. This addendum makes all three lessons required deliverables. It also promotes video, visibly animated 3D scenes, and two-way voice to implementation requirements. Their use remains optional for the learner.

| Original direction | Superseding requirement |
| --- | --- |
| Complete only the concert lesson; other topics later | Implement three selectable, working lessons using shared architecture |
| Fixed capacity of 200 | Editable venue capacity, independent demand and scalable venue costs |
| Prepared 3D assets sufficient | Recognizable, animated objects/people plus interactive scene changes |
| Narration may be added later | Implement voice input and spoken output; audition the preferred voice |
| No explicit learner video deliverable | Provide a playable short animated explainer for each lesson |
| Hosting not selected | Preserve and extend the existing Railway project |
| Blender installation uncertain | Use the installed Blender; check its executable/version only as needed |

Keep QR/link entry, phone and desktop browser use, multilingual design, optional exploration, the learner as themselves, and Alicia's warm female Caribbean voice preference. Keep all original source links and valid existing work.

## 2. Three required lessons

### A. The economics of a live music event

Question: How do ticket prices, audience demand, venue size and costs interact?

Scene: an identifiable stage and performer/DJ booth, moving stylized attendees, ticket entrance, lighting and a venue that visibly adapts to scale. Dots or abstract points alone are not acceptable as the primary audience representation.

Controls: ticket price, venue capacity, audience interest/demand, production budget, venue cost per available place, and cost per attendee. Keep the primary controls simple; place advanced cost assumptions in an expandable panel.

Outputs: potential demand, actual attendance, occupancy, unmet demand, revenue, total cost, profit and explicitly defined return on cost. Include a loss state and an empty-venue state.

Interactions: tap entrance to explain revenue; tap stage for fixed production costs; tap audience for per-person costs; compare two saved scenarios; reset; ask by voice or text why the result changed.

Takeaway: a bigger venue or higher ticket price does not guarantee more profit. Cost and demand assumptions matter.

### B. Build a conference people love

Question: How does a conference balance attendee experience, budget and financial sustainability?

Scene: a miniature conference with registration, speaker stage, workshop room, networking area and catering. People move between areas; workshop seats fill; an oversubscribed activity shows a queue.

Controls: expected attendees, overall venue capacity, ticket price, sponsor contribution, speaker budget, workshop seats, networking-area seats and catering spend per person. Presets can show a community meetup, regional conference and large conference.

Show registration revenue, sponsorship revenue, total cost, surplus/deficit, workshop access percentage, networking-area capacity percentage and catering provision per person. Do not convert these access measures into invented satisfaction scores or guaranteed learning outcomes.

Suggested deterministic teaching model, all fictional:

- A = minimum of expected attendees and venue capacity; expected attendees are a user assumption, not an automatic consequence of price.
- Registration revenue = A × ticket price.
- Total revenue = registration revenue + sponsor contribution.
- Workshop cost = configured workshop seats × cost per workshop seat.
- Networking setup cost = configured networking seats × cost per networking seat.
- Catering cost = A × catering allowance per person.
- Total cost = venue cost + speaker budget + workshop cost + networking setup cost + catering cost + other fixed costs.
- Surplus = total revenue − total cost.
- Workshop access = min(A, workshop seats) / A; networking capacity share uses the same form. If A is zero, show not applicable.
- Budget gap = max(0, total cost − available budget). Explain that a funding budget and eventual revenue are different quantities.

Reference example: A=500, ticket=40, sponsor=10,000. Venue=8,000; speakers=5,000; workshop seats=200 at 10 each; networking seats=100 at 10 each; catering=15 per attendee; other fixed costs=1,500. Revenue=30,000; total cost=25,000; surplus=5,000; workshop access=40%; networking capacity share=20%. Increasing workshop seats to 300 raises cost to 26,000, reduces surplus to 4,000 and raises workshop access to 60%, with other inputs unchanged.

Interactions: tap each zone to reveal its cost and purpose; change workshop allocation and see seating/queues update; compare configurations; ask why a financially stronger outcome can still leave fewer people with workshop access.

Sponsor contribution is organizer revenue. Sponsor ROI requires evidence of sponsor benefits and cannot be inferred from a contribution or attendee count alone.

### C. Why is my car waiting for one tiny part?

Question: How can a low-cost component become the bottleneck for an expensive finished product?

Scene: a recognizable miniature assembly line, vehicle bodies, conveyor, component bins, supplier truck and a clearly visible bottleneck. Removing a part supply visibly slows or stops downstream production; incoming stock restarts it.

Controls: daily production target, opening component inventory, supplier delay, unit selling price, non-component unit cost, component purchase cost, alternative-supplier premium, inventory carrying cost, and planned delivery quantities. Provide play, pause, advance one day, reset and compare.

Use a deterministic daily simulation with an explicit event order:

1. Receive deliveries scheduled for the current day and add them to inventory.
2. Compute units produced = min(production target, available components), assuming one component per unit and no other bottleneck in this simplified lesson.
3. Consume one component per produced unit.
4. Record lost production opportunities = target − produced. These are not automatically realized lost sales.
5. Accrue inventory carrying cost on closing inventory and operating cost for the day.
6. Advance day and schedule only the orders explicitly placed by the scenario.

Default assumption: each completed unit is sold that day at the configured price; prominently label it. If this assumption is disabled, track sales and finished inventory separately.

Show production, component inventory, delayed units, sales under the stated assumption, consumed-component cost, supplier premiums, carrying costs and operating contribution. Keep cash spent acquiring unused stock separate from cost of components consumed; do not expense the same component twice.

Reference operational case: target=100/day; opening inventory=150; no deliveries for days 1–3. Day 1 produces 100 and ends with 50; day 2 produces 50 and ends with zero; day 3 produces zero. A delivery of 200 at the start of day 4 permits 100 units that day and leaves 100 components. Cumulative output by day 4 is 250, versus a target of 400. An alternative supplier's benefit must be compared with its actual arrival day and premium.

Interactions: highlight the blocked station; trace a component from truck to vehicle; compare a baseline with spare inventory or a second supplier; ask why a cheap component can have a large operational consequence.

Takeaway: resilience has costs and benefits; extra stock and alternative suppliers must be evaluated against disruption assumptions.

## 3. Replace the hard-coded concert capacity

Add a visible Venue capacity control beside Set your ticket price. Provide both presets and direct numeric input. Suggested presets: 200, 1,000, 5,000 and 20,000. Suggested validated teaching range: 50–100,000 integer places. These are configurable implementation limits, not claims about real venue safety or occupancy rules.

Changing capacity must update the scene, relevant costs, occupancy and all dependent outputs. Search the code, schemas, API validation, model prompts, tests and workflow logic for hard-coded 200-person assumptions. Do not replace every occurrence of the number 200 blindly.

Preserve the existing financial panel and its useful functionality. It must continue to show projected ticket revenue, total event cost and projected event profit or loss, recalculating whenever relevant inputs change. Projected revenue is ticket price times projected attendance, not ticket price times capacity unless a sellout is explicitly assumed. Keep values visible beside the controls on desktop and readily accessible without losing the scene on mobile.

Capacity must not be confused with demand. Simply raising capacity must not fill the extra seats or create revenue. Provide a separate audience-demand input. A named preset may change capacity, demand and costs together, but must show which assumptions it changes.

### Proposed canonical concert model, version 2

This fictional model supersedes the original linear-demand formula. It retains the original two reference results under the default settings but may differ at other prices.

- C: selected capacity.
- p: ticket price, positive; proposed range 1–500.
- M: potential attendance at reference price p0=20; default 150, independently editable, including zero.
- e: price elasticity parameter; default 1; advanced range 0–3.
- D = floor(M × (p / p0)^(-e)).
- Actual attendance A = min(C, D).
- Unmet demand = max(0, D − C).
- Occupancy = A / C.
- Fixed production cost F = 1,000 by default.
- Venue cost rate k = 2.5 per unit of capacity by default.
- Cost per attendee v = 5 by default.
- Total cost = F + k × C + v × A.
- Revenue = p × A.
- Profit = revenue − total cost.
- Return on cost = 100 × profit / total cost. If total cost is zero, return not applicable rather than infinity.

Validate finite numbers, integer capacity and attendance, nonnegative costs, and approved ranges in browser and server. Reject unsafe oversized values; never silently wrap or overflow. Keep full precision internally and round currency only for presentation.

Reference checks:

| Scenario | Attendance | Revenue | Cost | Profit |
| --- | ---: | ---: | ---: | ---: |
| C=200, M=150, p=20 | 150 | 3,000 | 2,250 | 750 |
| C=200, M=150, p=30 | 100 | 3,000 | 2,000 | 1,000 |
| C=1,000, M=150, p=20 | 150 | 3,000 | 4,250 | −1,250 |
| C=1,000, M=900, p=20 | 900 | 18,000 | 8,000 | 10,000 |
| C=5,000, M=4,500, p=20 | 4,500 | 90,000 | 36,000 | 54,000 |
| C=20,000, M=18,000, p=20 | 18,000 | 360,000 | 141,000 | 219,000 |

The last three rows change demand as well as capacity. Explain that explicitly; none is a real-world forecast. Display the illustrative venue-cost rate so scaling does not imply venue hire is actually linear.

Separate simulated population from rendered character count. Use instancing, shared animation, levels of detail and representative groups to keep phones responsive. Numeric results must reflect all attendees even when fewer figures are drawn; label representative visualization. Scene bodies should remain recognizable rather than collapsing into dots.

## 4. Animation and video are separate deliverables

Each lesson requires both a live interactive 3D scene and a playable animated explainer. A screenshot carousel does not satisfy either requirement.

### Live scene

Use Blender-authored assets with animation clips or suitable browser-driven motion. Include purposeful action: people walking, stage activity, workshop seating, a moving conveyor or a supplier truck. Animate transitions when inputs change, and expose play/pause, reset camera and reduced-motion controls. Decorative movement must not obscure the economic result.

Give every important scene object a recognizable silhouette, coherent material, readable lighting and a purposeful interaction. Verify imported Blender animation clips actually play in the deployed browser, rather than existing only in the source file.

### Vibrancy and interactive art direction

Alicia explicitly expects a more vibrant, engaging presentation inspired by the supplied Mark Kashef reference. Animation alone does not satisfy this request: improve composition, lighting, materials, color and the layout around the scene as well. The exact video frames have not been inspected here; use available user-supplied reference frames or inspect the reference during implementation rather than inventing a claim of visual matching.

Use a coordinated, lively palette with warm stage lighting and contrasting accent colors, clear depth, readable focal points, and enough environmental detail to feel like a real miniature place. Avoid featureless dots, flat gray placeholders, objects floating in a dark void, excessive empty canvas, or decorative motion that makes labels hard to read. Keep the experience polished and welcoming rather than visually noisy.

The scene should occupy the main visual area, with a compact title, topic navigation and an accessible control panel. On phones, use a collapsible control tray that does not permanently cover the 3D scene. Keep financial results legible; a visual redesign must not remove the useful calculations.

Required interaction feedback:

- Selecting a hotspot highlights a recognizable object and opens a short contextual explanation.
- Camera controls move to a meaningful view, with an obvious reset-view action; touch users do not need to discover hover-only features.
- Adjusting ticket price, capacity or demand visibly updates crowd/occupancy representation and the financial panel together.
- Changing venue scale changes the visible venue arrangement or clearly shows its larger scale; changing only a numeric label is insufficient.
- Play/pause affects animation, reset restores the documented scenario, and compare reveals changes between two selected scenarios.
- Interactive targets show focus/pressed/selected feedback and expose usable labels. Avoid buttons with no observable effect.

Capture before-and-after screenshots and a short screen recording of actual interactions at desktop and phone sizes. Review recognizable forms, color/lighting, motion, readability and response to input. Report remaining visual gaps explicitly; do not mark a static arrangement with a moving camera as the finished animated lesson.

### Short explainer video

Recommended duration: 45–75 seconds per lesson. Deliver an actual playable video with a poster frame, playback controls, captions and equivalent transcript. Use the same visual style as the live scene, including an opening question, a visible economic mechanism, one numerical example and a closing insight. Narration follows Alicia's voice preference.

Concert storyboard: venue reveal → tickets and attendees → price/capacity/demand comparison → profit explanation. Conference: registration and areas → budget allocation → workshop access versus surplus. Factory: working line → component stock runs down → delay → replenishment or alternative supplier.

Pre-render the explainers from Blender or record a carefully composed animated browser sequence. Do not render a fresh movie for every learner question. Mark videos as preset examples; changing live inputs does not silently update recorded narration or numbers. The interactive scene is the live calculation surface.

Keep the learner videos distinct from the competition's approximately two-minute submission video.

## 5. Two-way voice interaction

Required capability: the learner can speak a question, see its transcript, and receive a spoken answer grounded in the active lesson and scenario. A play-narration button alone does not meet this requirement.

First implementation: tap-to-talk recording → server transcription → the existing n8n lesson workflow → validated text answer → speech synthesis → browser playback. This builds on the current text workflow. A continuous realtime voice session is an optional later enhancement, not required to deliver the first functional voice loop.

Visible controls and states: microphone button, permission request only after a user action, recording indicator, stop/cancel, transcript, thinking indicator, spoken response, mute and replay. Provide typing when microphone permission is denied. Cancel stops recording and releases the microphone. Prevent simultaneous narration and tutor speech; stop playback before recording a new question.

Start with bounded recordings, for example 30 seconds, and document supported browser formats. Never label a disconnected microphone mock-up as working voice. Surface permission denied, no microphone, silence, transcription failure and playback failure clearly.

Spoken questions must include current topic, scenario values and revision. Asking “Why did profit fall?” must use the visible state, not the original default. For a spoken change such as “make the venue one thousand seats,” display the recognized parameter change and resulting values; ask a narrow clarification if the number or unit is unclear.

Voice style: warm female Caribbean delivery, natural cadence and clear teaching tone, matching Alicia's stated preference. Audition a short sample with Alicia before declaring the accent accepted. Accent instructions are available in supported speech models, but do not guarantee an exact voice match. Do not assume access to custom voices or authorize cloning based on this preference. Indicate that synthesized speech is AI-generated.

Maintain multilingual text and captions. Review spoken pronunciation for each supported language. Do not silently switch languages because an accent was requested. Text and simulations must continue to work if voice generation fails.

## 6. Extend the existing Railway architecture

Railway hosts the application services. Blender creates assets; Babylon.js displays the interactive scenes; n8n coordinates lesson turns; OpenAI handles language and speech. Preserve the existing repository, framework, Railway project and working n8n integration. Do not migrate hosting or rebuild from a blank scaffold.

~~~mermaid
flowchart TD
    U["Browser: lessons, 3D, video and microphone"] --> G["Railway application API"]
    U --> L["Local deterministic simulation"]
    L --> U
    G -->|"Recorded question"| T["Speech transcription"]
    T --> N["n8n: route lesson and scenario"]
    G -->|"Typed question"| N
    N --> C["Trusted calculation and lesson content"]
    C --> A["AI explanation and validation"]
    A --> G
    G --> S["Speech synthesis"]
    S --> U
    G --> U
    B["Installed Blender: assets and video"] --> M["Versioned media hosting"]
    M --> U
~~~

Use the existing application service for API routes if supported; avoid creating services without a concrete need. If app and n8n are in the same Railway project environment, private networking may support server-to-server communication. If n8n is elsewhere, retain its authenticated HTTPS endpoint. Browsers cannot use Railway internal service hostnames.

Keep service secrets in Railway variables and n8n credentials, never frontend code. Verify environment variables in the actual selected environment. Preserve existing public domains and QR destination. Reuse existing media storage where available; do not treat a deployment's temporary filesystem as durable storage for user-generated audio or saved scenarios.

Small fixed media assets can be shipped with the app if appropriate. Larger media needs a deliberate storage/cache strategy; do not create a paid storage account without confirming existing resources and approval. Do not make Blender rendering part of ordinary lesson requests.

### Shared lesson contract

Create or extend a lesson registry rather than three disconnected applications. Each lesson defines its ID, titles, supported languages, input schema, defaults/presets, calculation version, scene manifest, animation actions, explanatory content, media URLs and fallback.

Stable suggested IDs: concert-economics, conference-economics, factory-supply-chain.

Add contract fields as needed: lessonId, lessonVersion, simulationVersion, language, scenario, scenarioRevision, requestId, inputMode and optional transcript. Return matching revisions plus calculationResults, explanation, sceneActions, optional audioUrl, video metadata and fallback status.

Prefer a versioned envelope or backward-compatible additions to changing live payloads without migration. Preserve existing route aliases and deep links. Ignore stale responses when the learner has changed scenario or lesson since the request began. Bind cached explanations and audio to lesson/version/language/voice/scenario; never replay an old profit figure for a new state.

Allow only declared actions such as highlighting an object, selecting a scene step or setting a validated input. The model must not return executable JavaScript or arbitrary camera/asset code.

n8n remains responsible for one lesson turn, not animation frames. Compute visual changes locally from shared deterministic formulas, and validate/recompute authoritative results on the server for model explanations.

## 7. Repair navigation, arrows and links

Codex must inspect the actual implementation. The report does not identify specific selectors or root causes.

Create a control inventory: page/lesson, visible label or icon, expected action, observed behavior and repair result. Cover lesson cards, previous/next arrows, back/home, camera arrows, hotspots, accordions, sliders, video, microphone, audio, language switch, reset, comparison controls and external references.

Use a link for navigation and a button for an action. Fix empty destinations, missing handlers, incorrect routes, transparent overlays, pointer-event interception, disabled states and mobile touch conflicts only where reproduced. Decorative arrows must not look like actionable controls; actionable arrows need accessible names and a visible result.

Check direct navigation and refresh on every lesson URL in Railway, not only client-side navigation from the home page. Verify browser back/forward, keyboard focus and touch targets. Disabled controls need a reason; remove misleading placeholders.

Test the deployed URL for broken asset paths, mixed-content requests, incorrect API base URLs, 404 routes and network errors. Retest changed controls plus nearby flows. Screenshots alone cannot prove an arrow works; record the action and resulting state.

## 8. Implementation order

1. Inspect current repository, applicable instructions, deployed routes and Railway service configuration. Create a checkpoint preserving working functionality. Record which user-reported issues reproduce.
2. Repair blocking navigation and implement the shared lesson registry and flexible concert model. Preserve the current working ticket-price control.
3. Improve concert assets and motion, then produce its actual explainer video. Confirm the Blender-to-browser pipeline.
4. Add conference and factory simulations, distinct animated scenes and explainers using the shared architecture.
5. Wire the two-way voice flow and verify scenario-aware follow-ups across all lessons. Review the preferred voice sample.
6. Test mobile/desktop, language changes, failure paths and the deployed Railway build; update setup and demonstration documentation.

These stages organize work; they do not remove required features. If time or service access prevents completion, report the exact unfinished items instead of silently replacing them with screenshots, placeholders or “coming soon” cards.

## 9. Definition of done and evidence

| Area | Required verification |
| --- | --- |
| Three lessons | All three open from home and direct URLs and have distinct working controls, formulas and scenes |
| Capacity | 200, 1,000, 5,000, 20,000 and custom values work through UI, API and explanation; demand remains independent |
| Economic model | Reference cases above pass; zero demand, losses, invalid values and zero-cost handling are correct |
| Conference | Changing workshop seats updates both costs and access; sponsor revenue is not mislabeled sponsor ROI |
| Factory | Day-by-day inventory case matches the reference; pause/reset are deterministic; delivery timing is explicit |
| Animation | Recognizable people/objects move; input changes affect scene state; large attendance does not require one expensive mesh per person |
| Visual quality | Vibrant lighting/materials, deliberate composition and usable mobile layout are shown in before/after evidence; calculations remain legible |
| Interactive feedback | Hotspots, camera controls, presets, comparison and resets have visible effects; no hover-only essential interaction |
| Video | Every lesson has a playable, captioned animated explainer with a transcript |
| Voice | Real microphone question → transcript → scenario-aware answer → spoken playback; deny/cancel/error states work |
| Voice identity | Warm female Caribbean preference tested with an audition; exact match not claimed without review |
| Navigation | Inventory of visible arrows/links completed, broken controls repaired and deployed routes refreshed successfully |
| State | No stale answer/audio overwrites a newer scenario or another lesson |
| Deployment | Existing Railway environment verified without exposing secrets; actual phone and desktop checks recorded |
| Fallback | Text/calculations remain usable when microphone, AI, audio or 3D fails |

Report tested device/browser names and measured behavior. Set performance budgets after inspecting the real scene; do not invent frame-rate or load-time results. Keep a clear distinction between a code change, a local test and a verified deployed repair.

## 10. Copy into Codex in the existing VS Code project

~~~text
Read Flow4Gold_Build_Brief.md and Flow4Gold_Addendum_01.md completely. This addendum overrides conflicting scope in the original brief. Extend the current working application; do not restart it. Blender is installed and Railway is our deployment platform.

Inspect the current code and reproduce broken arrows/links first. Implement all three lessons: live music event, conference economics, and factory/supply-chain bottlenecks. Replace the fixed 200-person capacity with editable capacity, presets and independent demand, updating costs, scene and explanations consistently.

Deliver visibly animated, recognizable 3D scenes plus a real short animated explainer video for each lesson. Implement microphone input and spoken replies grounded in the active scenario, preserving the warm female Caribbean voice preference and multilingual text/captions. Audio and deeper interaction are optional for learners but required product capabilities.

Reuse existing architecture and accounts. Keep deterministic economics separate from model prose. Update schemas, n8n routing and Railway configuration only as needed. Preserve public links and working functionality, and prevent stale responses. Do not claim an integration, accent match or deployed fix without verification.

Follow the implementation order and acceptance criteria in the addendum. Continue independent work when a credential or external service is blocked, documenting the exact limitation. Ask one focused question at a time only when necessary. Deliver the changed code/assets, validated workflow export if changed, updated README, control-repair inventory and verification evidence.
~~~

## 11. Sources and access boundaries

The original brief was read in its current saved version before preparing this addendum. Its original reference directory remains applicable. This document provides implementation requirements, not a diagnosis of unseen code.

Current official references reviewed:

- [OpenAI audio and voice](https://developers.openai.com/api/docs/guides/audio): supports a chained transcription/text workflow/speech synthesis approach.
- [OpenAI text-to-speech](https://developers.openai.com/api/docs/guides/text-to-speech): supported models can take accent and delivery instructions; voice availability and multilingual quality require verification.
- [Railway private networking](https://docs.railway.com/networking/private-networking): internal communication is scoped to services in the appropriate project environment.
- [Railway variables](https://docs.railway.com/variables): service/shared/reference variables for deployment configuration.

Original creative and implementation references:

- [Supplied video inspiration](https://youtu.be/27qpBfBhpDk?si=5Ued_9_guJE1f18_) — not directly watched here.
- [Blender](https://www.blender.org/) and [Python API quickstart](https://docs.blender.org/api/current/info_quickstart.html).
- [Babylon.js documentation](https://doc.babylonjs.com/).
- [n8n build reference](https://docs.n8n.io/build) and [integrations](https://docs.n8n.io/integrations).
- [Hugging Face models](https://huggingface.co/models) — optional, not a required new dependency.

This handoff does not require the live URL or repository to be written. Actual debugging in this chat would require access to the deployment or code. Codex in the existing project should inspect what it already has rather than ask Alicia to reconstruct the project history.
