# Addendum 05 — One concert workflow

Completed 2026-09-30. Canonical canvas: https://amdrfound.app.n8n.cloud/workflow/Cbr6Bvxj4vKROEaE

**The Economics of Everything — Concert System** is active and published. Final saved/published version: `ac2b9da7-7fe8-4fa2-a64b-0a604e1492a6`. The established coach ID was retained because it already owns the primary lesson entry and native TypeSafe credentials. Research nodes moved into the same canvas. No third workflow, wrapper, subworkflow, dispatcher, or extra provider call was introduced.

## Endpoint ownership

| Application / setting | Public n8n path (unchanged) | Before | After |
|---|---|---|---|
| `/api/lesson`, `N8N_WEBHOOK_URL` | `https://amdrfound.app.n8n.cloud/webhook/economics-concert-v1` | `Cbr6Bvxj4vKROEaE` | `Cbr6Bvxj4vKROEaE` |
| `/api/events`, `N8N_EVENTS_WEBHOOK_URL` | `https://amdrfound.app.n8n.cloud/webhook/concert-events-v1` | `Hdc8JHwuai8BlbI6` | `Cbr6Bvxj4vKROEaE` |

Both are POST webhooks, Header Auth with the existing X-Lesson-Key credential, and Respond to Webhook response mode. Actual Railway variables matched these URLs before migration and were unchanged. No Railway deployment or browser change was required. Voice transcription and synthesis remain existing Railway endpoints; text/transcribed coaching goes through the canonical workflow.

The former research canvas is inactive, unpublished (`activeVersionId: null`), and named **ARCHIVED — Replaced by Concert System — 2026-09-30**, with a note linking the canonical workflow. It was not deleted. Inspection of the account's 17 workflows found no other workflow caller referencing its ID/path. Repository and Railway callers use unchanged paths now owned by the canonical workflow. Undiscoverable external clients cannot be exhaustively audited; retaining the exact authenticated URLs preserves their contract.

## Changes and deduplication

- Moved the existing ten research nodes; retained existing node IDs, names, webhook identifiers, credentials and expressions. Added one research section note and updated the coach note. No duplicated IDs or names; the two entry graphs are disjoint.
- Reused the entry's prepared calculation and approved paragraph map in model validation and clarification, removing repeated coaching calculation bundles. Removed unused functions from serialized Code nodes. Small required date utilities are generated from one shared source into isolated n8n Code runtimes; no second maintained implementation was introduced.
- Kept branch-specific validation and response nodes because the request/response contracts differ. No Merge waits on independent triggers.
- Preserved execution order v1, provider timeouts, error continuation, credentials and explicit TypeSafe confidence gate. Workflow timeout is 75 seconds to accommodate research; coach provider and Railway timeout budgets remain unchanged. Neither original had a timezone/error-workflow override or required static state. Planning uses explicit IANA zones; cache ownership stays in Railway.
- Synthetic acceptance payload retention was temporarily enabled to record real node execution proof, then disabled for success/error/manual executions. Historical acceptance executions remain in the protected n8n account. Shared evidence excludes headers, private prompts, pinned data and secrets.
- `npm run workflow` now builds one maintained sanitized export: `workflow/economics-concert.json`. Branch artifacts are ignored local build intermediates. Removed the separate maintained event export. The deployment helper configures both entries on the canonical ID; the former separate event deploy command refuses deployment.

## Verification

Local serialized-node draft tests passed before changing registrations. These exercised valid/invalid coaching, confidence below threshold, simulated TypeSafe/provider failures, model-result parity, all three fictional cities, unavailable research and zero events. They are fixtures, not claimed live provider failures. All 28 existing tests also passed.

Production registration transfer: checked no running executions, deactivated research to release its path, saved and published the consolidated canonical canvas, then tested the website. The path transfer involved a short transition; zero downtime is not claimed. Draft checks were local serialized-node execution, not an n8n test-webhook run.

| Real website action | Request ID | Canonical execution |
|---|---|---|
| English coach | `df7909f9-f572-4121-a523-3fd18118e207` | `3705` |
| Uncached Atlanta live source search | `f977c67d-9b03-464f-b46e-5be5b01e8328` | `3706` |
| German coach | `67e2095f-6668-45a1-992e-06b6040fa43f` | `3707` |

All three succeeded under `Cbr6Bvxj4vKROEaE`. The first coach and research requests overlapped. Their execution node lists show only the appropriate branch; research returned one sourced card, `cached:false`. TypeSafe Evaluate ran through official native `@typesafe-ai/n8n-nodes-typesafe-ai.typeSafeAi`, schema v1, returning `jev-1.13.0`, ticket_price confidence 0.96 (English) / 0.90 (German), followed by the deterministic confidence gate and explanation path. This verifies credential/account availability. Public API does not expose the installed package release number; schema v1 is verified, while the previously inspected npm release 0.9.0 must not be presented as an independently read installed release.

Unauthenticated requests to both entries returned 403; authenticated invalid input returned 400. Hosted voice synthesis returned 200 audio/mpeg, 206,097 bytes. No browser errors; financial state stayed identical across research/coaching. No UI, Blender, Babylon, CSS, financial model, or QR source files were edited. Existing economic/control tests passed. Physical microphone testing was not performed.

The ORIGINAL `docs/demo-qr.svg` was rasterized for decoding with zxing-cpp: exact destination `https://web-production-af12a.up.railway.app` (no query parameters). Browser navigation to that address opened the concert; page opening made zero POST calls. Subsequent actual UI coaching/research requests produced the executions above. **Physical phone scan remains a manual check**; browser mobile viewport navigation is not a real scan.

Evidence: `docs/evidence/addendum05/` contains sanitized before/after definitions, draft checks, actual browser results, node execution IDs and auth/voice checks. Original before definitions showed saved/published version equality for both workflows; final canonical definition also has equal versions.

Official references checked: [TypeSafe native node source and output schema](https://github.com/typesafe-ai/n8n-nodes-typesafe-ai), [n8n integration listing](https://n8n.io/integrations/typesafe-ai/), [n8n webhook uniqueness](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/common-issues).

## Rollback

Run `node --env-file=.env scripts/consolidate-workflows.js --rollback` only when intentionally restoring the pre-migration two-workflow system. It deactivates the canonical workflow, restores its saved coach-only definition, activates that entry, then restores and activates the original research workflow. This avoids simultaneous conflicting path registrations. Both existing Railway URLs stay unchanged. Backups retain credential references but no secret values; existing account credentials are required. Checkpoint branch: `checkpoint/addendum05-start-3aac1e8`.

For normal future changes, run `npm run workflow`, tests, then `node --env-file=.env scripts/n8n-deploy.js`. Do not reactivate the archived research canvas while the consolidated canvas owns its path. Competition video remains the last step; submission remains manual.
