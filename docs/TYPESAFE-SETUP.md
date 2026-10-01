# Native TypeSafe concert routing

The single canonical Concert System Cloud workflow is `Cbr6Bvxj4vKROEaE`. The user installed TypeSafe AI and configured an existing `typeSafeAiApi` credential. No TypeSafe key is copied to the browser or repository.

The official scoped package inspected from npm is `@typesafe-ai/n8n-nodes-typesafe-ai@0.9.0`. Its source declares `typeSafeAi`, node schema version 1, Evaluate, JSON state, raw JSON questions, resource-locator model, and `includeOtherFields` / `simplify` / `timeout` options. The installed native type `@typesafe-ai/n8n-nodes-typesafe-ai.typeSafeAi`, version 1, was verified by successful execution. n8n's public API does not expose the installed package release number; 0.9.0 is the inspected package, not an independently read installed-release claim.

Account-authenticated `/v1/models` returned `jev-latest` and `jev-preview`. Production selects `jev-latest`; real calls returned `jev-1.13.0`. A temporary protected setup workflow retrieved the model list and was deleted after verification. Another temporary native Evaluate probe was likewise deleted. Production uses the actual native node, not an HTTP substitute.

Import `workflow/economics-concert.json`, then select existing credentials on:

1. Lesson request and Event research request → Header Auth, header `X-Lesson-Key`.
2. Identify concert question → TypeSafe AI API. Select an available model from the account dropdown if its list changes.
3. Select lesson explanation and Retrieve dated sources → OpenAI.

Publish after selecting credentials. The server's webhook URL/secret must match the trigger. The existing deployment is already configured; these steps are for reproducing the credential-free export, not additional setup requests.

The validated server/workflow recomputes results before sending only the question, language, audience mode, scenario, saved scenario and deterministic figures to TypeSafe. It does not send webhook headers or transport secrets. Evaluate returns the application-defined eight-choice intent taxonomy. `Read intent confidence` applies the threshold from `shared/intent.js` (0.80), and `Confident supported intent?` explicitly branches. Below threshold or unrelated → focused clarification. Service failure → labeled prepared explanation. Supported intent → OpenAI selects approved paragraph IDs; the app reconstructs those paragraphs with shared computed numbers.

TypeSafe timeout: 4.5 seconds; OpenAI: 10 seconds; server upstream budget: 18 seconds. No automatic retry duplicates paid requests. The public gateway has origin checking, per-minute limits and a daily process budget. No user payload execution saving is enabled. Arithmetic and browser controls continue locally during service failure.

`npm run workflow` rebuilds the sanitized export. `scripts/n8n-deploy.js` supplies existing credential references from ignored local state. `scripts/pixel-n8n-check.js` exercises actual executions; `tests/intent.test.js` covers synthetic boundary/error outputs. The eight-question sample is not a calibrated accuracy study. It includes clear questions below threshold, so clarification frequency should be reviewed before changing the threshold.

Official references inspected: https://github.com/typesafe-ai/n8n-nodes-typesafe-ai and https://docs.typesafe.ai/introduction .

Addendum 05 consolidated the research branch onto this same canvas. See [migration proof and rollback](ADDENDUM-05-VALIDATION.md). The workflow-wide timeout is 75 seconds for research; the coach provider/server budgets above remain unchanged.
