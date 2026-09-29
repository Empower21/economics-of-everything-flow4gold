# Flow4Gold entry preparation

## Deadline

Supplied terms dated September 10, 2026, section 3.1: **October 1, 2026, 23:59 CEST / 17:59 US Eastern**. The [live form](https://theflowgrammer.app.n8n.cloud/form/Flow4Gold) first page confirms October 1 as the deadline. Later steps have not been submitted or inspected.

The user has confirmed eligibility. No repeat eligibility verification is needed in this build process.

## Entry name

The Economics of Everything — Turn a concert into a two-minute economics lesson

## Description draft

Why can two concerts earn exactly the same ticket revenue but make different profits? This workflow turns an everyday question into a miniature world you can explore.

Learners open a link, adjust the ticket price, and see the crowd and accounts change together. They can tap the stage, entrance, or audience to explore fixed costs, revenue, and demand. English and German are built in, and the same lesson works in 2D if 3D is unavailable.

n8n authenticates the lesson request, validates the inputs, calculates the scenario, asks OpenAI to select relevant approved explanations, checks the result, and returns safe scene actions. Every number comes from one deterministic calculator shared with the browser. If the model or network fails, the lesson continues with prepared content.

The motivation is to make an abstract idea useful and memorable in a short visit. The workflow does not require a learner account, roleplay, or a quiz; the learning check is optional. The first complete topic is the economics of a live music event, using clearly labeled invented assumptions.

External components: a Node web gateway, Babylon.js browser UI, an original Blender-authored GLB venue, and an OpenAI API credential in n8n. Setup documentation and source code accompany the workflow so judges can reproduce the experience.

## Required materials

- [x] Clean workflow JSON: `workflow/economics-concert.json`.
- [x] Setup documentation and formula explanation.
- [ ] Hosted HTTPS demonstration, verified end to end.
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
| Completeness | One complete bilingual lesson, bounded input, visible assumptions, 2D fallback |
| Error handling | Invalid input correction, webhook authentication, model fallback, gateway fallback, stale answer protection |
| Result quality | Shared calculator, approved content, the 20/30 comparison, correct language and response schema |
| Motivation | Make everyday economics understandable during a short visit |

Do not claim measured savings, improved retention, causal learning gains, or an optimal real-world ticket price. Future conference and factory lessons are not represented as available.
