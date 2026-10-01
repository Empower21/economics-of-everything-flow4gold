# Addendum 04 implementation and validation

## Scope and audit

Baseline: `7aa38f4`, rollback branch `checkpoint/addendum04-start-7aa38f4`. The user subsequently authorized made-up listings because this is a simulation. Simulation listings are now the default; live web research is an explicit alternative, never mixed with fictional cards.

Partial changes found: `server/index.js`, `server/events.js`, `shared/planning.js`, `src/planner.js`, `src/deck.js`, `src/deck.css`, `scripts/create-control-deck.py`, plus generated `assets/control-deck.blend` and `public/models/control-deck.glb`. None were discarded. The direct OpenAI server route was replaced with a single authenticated n8n proxy. Useful provider normalization code moved to `shared/events.js` and is serialized into the n8n workflow.

## Change map

| Layer | Change |
|---|---|
| Concert | No protected file changes. Live GLB hash and same-state screenshot match local revised experience exactly. |
| Dashboard | Separate Blender deck, Babylon rotating records, state-driven faders, native number/slider controls in a pixel mixer housing. |
| Economics | Existing model unchanged. Break-even uses integer cents, sponsorship and zero/negative contribution handling. |
| Planning | Canonical cities, IANA zones, date-only/overnight intervals, ambiguous/nonexistent-time rejection, independent revision, optional filters. Venue presets renamed Venue setup. |
| Persistence | Save version 2 includes planning schema 1 and dated snapshot. Old saves restore economic values; no venue-to-city inference. Restored snapshots are stale. Reset concert resets both; Reset planning and Undo planning edit affect planning only. |
| Server | `/api/events` validates interval, authenticates to n8n, validates returned contract, caches and correlates request IDs. No direct provider search path. |
| Events canvas | New workflow `Hdc8JHwuai8BlbI6`, production path `concert-events-v1`. Simulation branch avoids provider calls. Live branch uses the existing OpenAI credential. |
| Coach canvas | Existing `Cbr6Bvxj4vKROEaE` retained. Native TypeSafe v1 `jev-latest` intent options include local events; observed model `jev-1.13.0`. Server loads trusted research only from its cache. Approved bilingual planning explanation references source cards without inventing event claims. |

## n8n nodes and connections

Event research request → Validate planning interval → Valid planning request? → Use illustrative listings?

- Simulation → Build clearly labeled simulation → Record research correlation → Return one research response.
- Live → Retrieve dated sources → Verify geography dates and deduplicate → Record research correlation → Return one research response.
- Invalid → Return invalid request (400).
- Provider errors continue into normalization, which returns unavailable with zero cards. Empty searches still produce one response object. Rejected/truncated candidates are partial, not no_matches.

Node versions are cloned from the actual installed coach canvas: Webhook 2.1, Code 2, If 2.2, HTTP Request 4.2, Respond to Webhook 1.4. Credential references reuse the existing gateway and OpenAI credentials. Importable `workflow/*.json` exports omit credentials. Before/after evidence exports retain credential IDs/names but no secret values or captured webhook headers.

Event overlap classification is intentionally unassessed. The optional additional TypeSafe overlap classifier is not enabled; the functioning native TypeSafe coach integration remains. Neither simulated nor live cards affect attendance or money.

## Contract and bounds

`concert-events-v1` request: requestId, planningRevision, cityId, local start/end dates and optional times, category (`music`/`all`), dateScope (`same_day`/`nearby`), dataMode (`simulation` default / `live`), language. Railway and n8n independently derive timezone and UTC half-open interval. queryKey includes mode, city, interval, filters and language. Date-only DST days may be 23 or 25 hours. Start-only input explicitly ends at 23:59; overnight times require an explicit next-day end date. Maximum window seven days, years 2020–2100.

Railway owns a one-hour cache (configurable `EVENT_CACHE_TTL_MS`), 100 entries, per-process. Refresh bypasses it. Cache hits retain retrieval time and use the caller's requestId/revision. 12 requests/minute/IP, 60 new live searches/day/process, 65-second server timeout, 50-second provider timeout, eight cards maximum. No paid search happens on a slider/date change. Browser aborts and ignores stale requests. Simulated cards have no source URL or verification timestamp; they are explicitly fictional.

Live search uses the existing OpenAI Responses credential with web search. Public source coverage varies; it is not comprehensive event inventory. The normalizer rejects unsafe/unretrieved URLs, wrong city/country, canceled events, invalid dates and unsupported recurring listings. It deduplicates title/date/time/venue; distinct showtimes survive. Contradictory end timing becomes uncertain. Source extraction still depends on search evidence and may miss events. A result is not a forecast or certification.

## Verification

- Protected checksums: `evidence/addendum04/protected-before.json`; model parity and exact screenshot hashes in `concert-asset-parity.json` and `scene-visual-parity.json`.
- Existing browser suite: desktop/mobile EN/DE, all levers, typed/empty inputs, Undo/Reset/Save, optional controls, 10,000 capacity, zero demand/cost, reduced motion, scene failure. No page errors. Browser evidence is desktop emulation, not a physical phone test.
- New planning browser suite: all three fictional city datasets through actual n8n, economic state unchanged, cache, refresh, saved stale snapshots, keyboard fader, translated mobile panel, fast city changes with delayed fixture response.
- Unit/contract tests cover DST/overnight, invalid dates, canonical cities, break-even edge cases, duplicates, wrong Kingston, cancellations/unknown time, empty/failed source responses, proxy errors, malformed response, simulation labeling/tamper rejection. Existing TypeSafe failure/threshold fixtures remain.
- Live searches were executed separately from fictional fixtures. Early provider integration findings and subsequent refined results are retained in `live-cities*.json`; these are historical test outputs, not a promise of current availability.
- Rendering: separate low-resolution deck capped at 15 fps. Existing scene browser checks observed 27.9 fps desktop and 53.5 fps mobile emulation with software rendering; these are environment-specific samples, not device benchmarks.

## Release and rollback

Server-only `N8N_EVENTS_WEBHOOK_URL` must point to `https://amdrfound.app.n8n.cloud/webhook/concert-events-v1`, never webhook-test. Authentication uses existing `N8N_WEBHOOK_SECRET`. Workflow publishing and Railway release are independently verified in release evidence.

Rollback application to `7aa38f4` through Railway; its original coach contract remains supported. To roll back coach canvas, use the sanitized before export and reselect existing credential references, then publish. Deactivate the added events workflow only after the app no longer calls it.

No new hosting project/account was created. Competition submission stays manual; the final submission video is still the last step.

## Final release status

Implemented locally, workflow artifacts prepared, actual canvases updated, both workflows published/active, Railway deployed, and hosted end-to-end verified. Application commit: `27c5bd2`. Railway deployment `089dd597-8d8f-4e2f-8b67-19e3d3268ed1`: SUCCESS.

Hosted simulation checks reached n8n executions 3699 (Atlanta), 3700 (Berlin), and 3701 (Kingston); each returned three fictional cards. Cache and refresh passed. See `hosted-simulation-trace.json`. An additional uncached live-mode check returned a sourced card; its exact request/execution mapping is in `hosted-live-search.json`. Hosted coach returned n8n/OpenAI content with TypeSafe confidence 0.96; speech returned HTTP 200 audio/mpeg. No physical phone/microphone test is claimed.

28 automated tests pass. The separate dashboard runtime asset is 146,512 bytes; Blender source is 138,672 bytes. The protected concert scene remains unchanged. Final competition video and manual submission are not part of this release and remain for the agreed final step.

