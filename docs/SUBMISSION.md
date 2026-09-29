# Flow4Gold entry preparation

## Deadline

Supplied terms dated September 10, 2026, section 3.1: **October 1, 2026, 23:59 CEST / 17:59 US Eastern**. The [live form](https://theflowgrammer.app.n8n.cloud/form/Flow4Gold) first page confirms October 1 as the deadline. Later steps have not been submitted or inspected.

The user has confirmed eligibility. No repeat eligibility verification is needed in this build process.

## Entry name

The Economics of Everything — Small worlds, useful economics

## Description draft

Why can two concerts earn exactly the same ticket revenue but make different profits? This workflow turns an everyday question into a miniature world you can explore.

Learners open a link and explore three animated miniature worlds: a concert, a conference and a factory waiting for a tiny component. They change assumptions and see the scene and accounts respond together. English and German text, captioned preset videos and optional microphone questions/spoken answers are included. An animated 2D view remains available if 3D fails.

n8n authenticates the lesson request, validates the inputs, calculates the scenario, asks OpenAI to select relevant approved explanations, checks the result, and returns safe scene actions. Every number comes from one deterministic calculator shared with the browser. If the model or network fails, the lesson continues with prepared content.

The motivation is to make an abstract idea useful and memorable in a short visit without requiring a learner account. Concert capacity does not create demand; workshop access can cost surplus; and a cheap component can stop expensive production. Every lesson uses clearly labeled invented assumptions.

External components: a Node gateway, Babylon.js browser UI, three original Blender worlds, OpenAI selection/transcription and the owner's configured ElevenLabs voice. Setup documentation, calculation tests and source code accompany the workflow. The model chooses approved content rather than generating unchecked economic claims.

## Required materials

- [x] Clean workflow JSON: `workflow/economics-concert.json`.
- [x] Setup documentation and formula explanation.
- [x] Hosted HTTPS demonstration, verified end to end: https://web-production-af12a.up.railway.app.
- [ ] Actual phone validation and final German human review.
- [ ] Screenshot of the actual n8n workflow canvas.
- [ ] Unpublished creator-template ID if requested by the live form.
- [ ] About two-minute public video introducing the entrant and showing the workflow.
- [ ] Final check that screenshots/video/export contain no secrets or third-party personal information.
- [ ] Entrant manually completes personal details, consent, and submission.

The supplied terms allow JSON or an unpublished creator-template ID; the first page of the live form specifically mentions the creator portal. Prepare both. No workflow/template has been publicly published by this project.

## Judging evidence

| Criterion from section 5.3 | Evidence to show |
| --- | --- |
| Usability | Link → price experiment → short explanation; annotated workflow and setup guide |
| Completeness | Three bilingual lessons, distinct deterministic simulations, visible assumptions, videos/transcripts and 2D fallback |
| Error handling | Invalid input correction, webhook authentication, model fallback, gateway fallback, stale answer protection |
| Result quality | Shared calculator, approved content, the 20/30 comparison, correct language and response schema |
| Motivation | Make everyday economics understandable during a short visit |

Do not claim measured savings, improved retention, causal learning gains, an optimal real-world ticket price, or an exact accent match. The final competition video and entry are still to be completed by the entrant after real-device review.
