# Validation record

Build date: September 29, 2026. This document distinguishes verified work from remaining checks.

## Verified so far

- Original venue authored with Blender 4.3.2 through the checked-in Python script; editable `.blend` and browser `.glb` exported successfully.
- Node dependency installation and initial production build succeeded.
- Eight automated test groups passed, including accounting identities over every cent-valued price from 5 through 50, the two reference scenarios, invalid inputs, model failure/refusal, content selection validation, and unsafe actions.
- Actual n8n workflow imported into the supplied instance and activated through the API. Header Auth and OpenAI credentials are stored in n8n, not in the downloadable workflow.
- Live authenticated English and German webhook requests returned HTTP 200 using OpenAI selection, with the expected calculations.
- Live unsupported-language request returned HTTP 400; unauthenticated request returned HTTP 403.
- Initial desktop and 390px mobile viewport browser checks passed: GLB loads, price controls update profit, language switching works, prepared lessons respond, quiz responds, manual 2D switch works, and a blocked model asset triggers the 2D fallback.

## Quality issue found and addressed

The first live generative answer used correct numeric placeholders but reversed the relationship between attendance and variable costs. Numeric checks alone were not sufficient. The final architecture restricts the model to selecting authored bilingual paragraph IDs and a safe focus action. Only the calculator and approved content produce the learner-visible explanation. Live English and German calls were repeated successfully after this change.

## Still required

- Final production browser pass after visual refinements and connected gateway restart.
- Live hosted deployment and its HTTPS journey.
- Actual phone performance and touch check.
- Fluent German human review.
- Actual n8n canvas screenshot.
- Final video, public-link verification, and manual competition submission.

The current operational logs measure request duration and fallback frequency. No production baseline, translation review time, actual cost per completed session, or learning-outcome dataset has been collected. No platform ROI claim is made.
