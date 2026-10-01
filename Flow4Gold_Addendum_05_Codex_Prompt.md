# Codex prompt — One n8n workflow with mandatory TypeSafe AI

Place `Flow4Gold_Addendum_05_One_n8n_Workflow.md` in your existing project, then paste the following prompt into Codex in VS Code.

---

Read `Flow4Gold_Addendum_05_One_n8n_Workflow.md` and consolidate the existing concert system into ONE active n8n workflow. This overrides Addendum 04’s recommendation to maintain separate coach and event-research workflows. The website looks great; preserve its approved concert scene, Blender assets, turntable dashboard, calculations, controls, and behavior.

Website: https://web-production-af12a.up.railway.app/

**Preserve the existing QR-code trigger/entry point.** Inspect and decode its actual destination; retain the original QR image, encoded URL, route/redirect, lesson/language parameters, and behavior so already printed/shared codes keep working. Do not replace the QR code. If it opens the website, keep that flow and change only the backend connections. If it targets an n8n webhook, preserve that public path through the coordinated migration without leaving a second active workflow. Retain the existing timing of workflow calls; scanning/opening a page must not add unwanted paid searches. Test the original QR on a phone when available, confirm the expected page, and trace subsequent coaching and event research into the canonical workflow. Clearly distinguish a real scan from a URL-only test.

Inspect BOTH actual workflows before choosing the canonical one:
- https://amdrfound.app.n8n.cloud/workflow/Cbr6Bvxj4vKROEaE
- https://amdrfound.app.n8n.cloud/workflow/Hdc8JHwuai8BlbI6

Do not guess which ID does what. Read repository instructions, preserve existing uncommitted work, fetch the current saved/published definitions, inspect recent executions, and trace the Railway server endpoints/environment-variable names to their actual production webhook URLs. Check other callers before retiring anything. Export recoverable backups without secret values.

Reuse ONE of those existing workflow IDs, selecting the one that minimizes disruption based on actual production use. Name it “The Economics of Everything — Concert System.” Move all necessary logic from the other workflow into clearly labeled Coach and City & Date Research areas on that canvas. Do not create a third production workflow, a wrapper calling the old workflows, or a subworkflow hierarchy.

Prefer retaining the existing webhook entry points and request/response contracts inside this one workflow. One canvas can have separate entry branches; do not force an unrelated API redesign. If a single action-based entry already exists and is clearly simpler, preserve it with deterministic routing. No new AI dispatcher, queue, gateway, or self-calling webhook. A coach request should run only its appropriate branch; an event search should run only the research branch.

The official native TypeSafe AI node is MANDATORY. Retain and verify it if already working; add/configure it if missing. Verify the official package `@typesafe-ai/n8n-nodes-typesafe-ai`, installed schema/version, credentials, and account availability. Connect it to a real decision path: use Evaluate for concert-question intent, with deterministic downstream branching and explicit uncertainty/error handling. Do not use it merely to route the app’s already-known request type. A disabled/disconnected node, mock, sticky note, or HTTP substitute does not satisfy this requirement. Demonstrate at least one real successful execution through the native node. If activation is blocked, mark TypeSafe incomplete with the specific missing setup. Preserve current provider credentials, coaching/voice/language behavior, sourced city/date research, cache/freshness semantics, and error handling. Keep arithmetic local/deterministic and do not add n8n calls to sliders or animations. Keep small branch-specific validation/response nodes if sharing them adds complexity.

Repair copied node IDs/names, expressions, item linking, trigger references, and workflow-level settings. Carry requestId, scenario/planning revision, query identity, city/date/time-zone data, language, and source metadata through each branch. Do not reference an independent trigger that did not run. Do not use a Merge node that waits for both separate webhook requests. Return one correct response per request, including zero-event and error cases.

Prepare and test the consolidated draft BEFORE changing production registrations. n8n allows only one registered webhook per HTTP method/path pair. If preserving the old paths, coordinate releasing the retiring workflow’s registration and publishing the canonical workflow; prepare rollback first and verify promptly. Do not try to publish conflicting endpoints simultaneously. If a small server-side URL change avoids a risky path transfer, use a unique path in the canonical workflow, test it, switch the corresponding Railway setting, then disable the old workflow. Keep the deployed app compatible during cutover.

Update the ACTUAL n8n canvas and production configuration, not just a local JSON file. Verify the published/active version, credentials, response modes, webhook ownership, and Railway settings. Follow the existing release process and permissions. After migration, run one real coaching request and one real uncached city/date search from the website; trace both to executions under the SAME canonical workflow ID. Verify concurrency and failure paths without cross-request state leakage. Confirm the UI and financial outputs remain unchanged.

Finish with exactly one canonical active workflow. Unpublish/deactivate and clearly rename/archive the retired workflow as a rollback backup once the cutover is verified; do not permanently delete it. Ensure no production callers still use it. Update current setup documentation and maintained workflow exports so future revisions target the canonical ID.

Deliver the final canonical workflow URL/ID, the retired workflow’s status, a concise before/after endpoint mapping, sanitized consolidated export, actual node/settings changes, real test execution IDs/request IDs, and rollback instructions. Distinguish local edits, canvas update, publication, Railway change, and live verification. A merged export alone is not completion.

If n8n access is unavailable, complete the work possible from verified repository exports, clearly mark the live migration pending, and specify only the missing access/export needed. Do not invent node content or successful executions. Keep this consolidation small and practical; no additional features or visual redesign.
