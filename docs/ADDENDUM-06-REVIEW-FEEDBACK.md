# Addendum 06 — External review feedback

Completed 2026-10-25. Canonical canvas: https://amdrfound.app.n8n.cloud/workflow/Cbr6Bvxj4vKROEaE

An external reviewer of the Flow4Gold entry made five recommendations: distribute with Docker Compose (they contributed PR #1), reduce the size of the Code nodes by moving logic into native nodes or smaller pieces, use the native OpenAI node instead of HTTP Request, connect cubic.dev for automated review, and add repository topics plus a LICENSE file. This addendum records what changed, what was deliberately kept, and the live verification.

## Docker Compose

PR #1 adds `docker-compose.yml` (one `web` service built from the unchanged Dockerfile, bound to `127.0.0.1:3000`, configured from `.env`) and a README Docker section. Reviewed against the Dockerfile; no changes requested. Merge is the owner's click.

## Code nodes

The Code nodes are long because each one carries the deterministic calculator and validators from `shared/*.js`, serialized by `npm run workflow`. That is the design: the browser, the Node server and n8n run the same functions, `npm test` covers them, and the server re-validates every n8n response against them. Re-expressing that logic as Edit Fields, Filter or Remove Duplicates chains would create a second implementation that could drift from the one the server checks. Routing was already native IF.

Two defects in the build pipeline made the nodes larger and harder to read than the design requires:

- The consolidation step wrapped the whole helper bundle inside one function body before calling esbuild. esbuild prunes unused top-level declarations only, so the advertised tree-shaking never removed anything. Every events node carried every planning and events helper.
- Output was syntax-minified (`!0`, comma-chained statements), which is hostile to a reader opening the node in n8n.

Fix: the builders now emit top-level helpers plus `function execute() {…}` and the consolidation step tree-shakes that shape with minification off. Every Code node carries an n8n note (`notes`, shown on canvas) that starts with `Why Code:` and names the native node considered, repeated as a header comment in the code.

| Code node | Lines before | Lines after | Helpers now bundled |
| --- | ---: | ---: | --- |
| Validate and calculate | 106 | 103 | registry, calculator, request validation, prepared lesson, model request |
| Check explanation or use prepared lesson | 14 | 26 | `selectLesson` from shared/lesson.js (was a hand-copied variant) |
| Read intent confidence | 11 | 15 | `routeIntent` from shared/intent.js |
| Ask focused clarification | 5 | 13 | none |
| Validate planning interval | 132 | 64 | planning validators and request builder |
| Build clearly labeled simulation | 128 | 22 | `simulatedEvents` and two date helpers |
| Verify geography dates and deduplicate | 128 | 100 | `readEvents` and its source checks |
| Record research correlation | 5 | 8 | none |

Line counts after include the two-line header. The coach entry node stays large because it is the calculator itself.

`Check explanation or use prepared lesson` previously held a hand-written copy of the selection check. It now serializes `selectLesson` from `shared/lesson.js`, the function `applyModel` and `npm test` use, so there is one implementation of the paragraph and focus allowlist check.

## Native OpenAI node

`Select lesson explanation` is now the native OpenAI node (`@n8n/n8n-nodes-langchain.openAi`, node version 2, operation `response`, Responses API; requires n8n 1.117 or later). Model, instructions, input, token cap, `store: false` and the JSON schema are expressions over `$json.modelRequest`, which `shared/lesson.js modelRequest` builds, so the request stays the one the server tests. Simplify Output is off so the raw response reaches the selection check. Parameter names were taken from the node's source in the n8n repository, not from memory.

Two differences from the HTTP Request body, both verified in the node source:

- The node does not forward the schema `strict` flag. The selection check rejects any paragraph ID or focus outside the allowlist, so correctness does not depend on it.
- With a JSON schema format the node parses `output_text.text` into an object before returning. `outputJson` in `shared/lesson.js` accepts both the raw string and the parsed object; `tests/lesson.test.js` and `scripts/check-consolidated-draft.js` cover both shapes and assert identical results.

The node has no per-request timeout option; the HTTP node had 10 seconds. The server still aborts the n8n call at 18 seconds and falls back, and the workflow timeout remains 75 seconds.

`Retrieve dated sources` was first kept as HTTP Request because the native node cannot send `tool_choice: required`. At the owner's decision it is now the native OpenAI node too (round 2 below): built-in Web Search with context size medium, `include: web_search_call.action.sources` so the server's URL allowlist check keeps working, JSON schema output, `store: false`. `readEvents` reports a response without a completed `web_search_call` as `unavailable`, which is the designed fallback if the model ever skips the search.

## cubic.dev, topics, license

- `cubic.yaml` at the repository root configures cubic reviews: secrets in exports and evidence first, calculator parity with `shared/*.js` second, server trust boundaries third, n8n hygiene fourth; generated and media paths are ignored. Installing the GitHub App on the repository is the owner's action in the cubic dashboard.
- Repository topics set: n8n, n8n-workflow, n8n-template, workflow-automation, openai, babylonjs, blender, express, vite, economics, education, interactive-learning, flow4gold, docker.
- `LICENSE` is MIT, copyright holder taken from the GitHub profile name; `package.json` declares `"license": "MIT"`. Font licenses and asset provenance remain in `docs/THIRD-PARTY-NOTICES.md` and `docs/licenses/`. The license covers the media in `public/` too; the owner can add an asset exception if that is not intended.

## Verification

Local: `npm run workflow` regenerates `workflow/economics-concert.json`; `node scripts/check-consolidated-draft.js` executes every serialized Code node with fixtures including the native node output shape; `npm test` passes 29 tests. The export contains no credentials and no secret-like strings.

Live: the canonical workflow was backed up to `docs/evidence/addendum06/before-Cbr6Bvxj4vKROEaE.json` (credential references removed; the full copy is local only), then deployed with `scripts/n8n-deploy.js`. Synthetic requests against the authenticated production webhooks, recorded in `docs/evidence/addendum06/live-smoke.json`:

| Request | Result |
| --- | --- |
| Invalid topic | 400 with the correction message |
| Research, Atlanta, simulation mode | 200, three labeled fictional listings, validated by `validateResearch` |
| Coach, low TypeSafe confidence | 200, `intent-clarification`, validated by `validateLesson` |
| Coach, TypeSafe confidence 0.86 and 0.84 | 200, `model-fallback`, validated by `validateLesson` |

The `model-fallback` results were diagnosed with execution retention enabled briefly for one synthetic request (the execution was deleted and retention restored to none). The native node returned `Authorization failed - please check your credentials`. Restoring the backed-up HTTP Request version and sending the same question also returned `model-fallback`, and the OpenAI key in the local `.env` is rejected by the OpenAI models endpoint. The stored OpenAI credential is stale; the node change is not the cause. The native node path could therefore not be exercised end to end on the live instance.

**Owner action required:** replace the OpenAI credential `Economics Concert — OpenAI` in n8n with a valid key (and `OPENAI_API_KEY` in `.env` and on Railway if transcription uses the same key), then send one question that clears the confidence gate and confirm `delivery: "n8n-openai"`. Until then the coaching path serves prepared bilingual text and the live research path returns `unavailable`; the public demo keeps working because that is the designed fallback.

## Round 2 (same day)

After the owner replaced the OpenAI credential and asked for the research call to use the native node as well:

- `Retrieve dated sources` became the native OpenAI node (see above). `shared/responses.js` now holds the one `outputJson` reader used by both branches, so the research parser accepts the native node's pre-parsed output exactly as the coach parser does. `tests/planning.test.js` covers the native shape and the no-search case.
- `Ask focused clarification` became a native Edit Fields node in raw JSON mode: one object expression over the prepared lesson and the intent decision. The fixture harness evaluates that expression the way it evaluates Code. Six nodes were native before this addendum; eight are now, and seven Code nodes remain, all of them the shared calculator or its validators.
- cubic.dev reviewed the pull request and raised three findings, all accepted: the `docs/evidence/**` ignore contradicted the instruction to check evidence for secrets (removed); the README overstated what the native node cannot do (rewritten); the consolidation step would have aborted the `--rollback` path on archived exports (the transform loop now runs only for freshly built sources).

Live verification after redeploy, recorded under `round2` in `docs/evidence/addendum06/live-smoke.json`:

| Request | Result |
| --- | --- |
| Coach, English, confidence 0.90 | 200, `delivery: n8n-openai`, `fallbackUsed: false`, three approved paragraphs, focus `stage`, validated |
| Coach, German, confidence 0.54 | 200, `intent-clarification` from the Edit Fields node, validated |
| Coach, low confidence 0.27 | 200, `intent-clarification`, validated |
| Research, Atlanta, simulation | 200, `ok`, three labeled fictional listings, validated |
| Research, Atlanta, live, 2026-11-14 | 200, `partial`, native web search ran with 12 retrieved sources, zero events survived the geography, date and evidence checks, validated |

The credential finding above is closed: the native node path works end to end with the replaced key.

## Rollback

`git revert` this change set and run `node --env-file=.env scripts/n8n-deploy.js`, or import `docs/evidence/addendum06/before-Cbr6Bvxj4vKROEaE.json` and reselect the credentials. The webhook paths, node names and credentials are unchanged, so no Railway change is needed either way.
