# Steps requiring your interaction

## 1. Railway sign-in

The assistant has started Railway CLI login. In the browser page, sign in using **amdrentcorp@gmail.com**, finish Google verification, and authorize the CLI. Tell the assistant when complete. Do not paste a password, API key, or login code into chat.

If that login window expires, open a PowerShell terminal in this project and run:

```powershell
npx --yes @railway/cli login
```

Only you can complete Google authentication, accept account agreements, and choose billing. The assistant can configure and deploy the application after login. Railway Hobby has a $5/month base subscription with resource usage accounting; check the dashboard's displayed terms before choosing a plan. A trial may be available. No subscription purchase is part of the completed work so far.

Deployment uses one Node service and no database. The server needs `N8N_WEBHOOK_URL`, `N8N_WEBHOOK_SECRET`, and its generated `PUBLIC_ORIGIN`. The assistant can copy these securely from local configuration. OpenAI's key belongs in n8n credentials, not the website's environment. Leave service sleeping/serverless disabled for the conference demo if your plan permits.

## 2. Real phone check

After the HTTPS URL is available:

1. Open it on your actual phone using mobile data, then conference-style Wi-Fi if possible.
2. Rotate the venue and tap the stage, entrance, and crowd.
3. Choose 20, then 30. Both show revenue 3,000; profit changes from 750 to 1,000.
4. Switch to German and ask a question. Check that controls and explanations are readable.
5. Switch to 2D view. The same lesson and figures must remain usable.
6. Use the price control and ask a second question. Confirm there is no stale answer for an old price.
7. Report phone model, browser, and anything slow or hard to tap.

The assistant can test desktop and emulated mobile browsers; only this test establishes actual phone behavior. A fluent German speaker should also read the short lesson before recording.

## 3. Workflow screenshot and creator portal

Open the configured [n8n workflow](https://amdrfound.app.n8n.cloud/workflow/Cbr6Bvxj4vKROEaE). Fit the whole canvas on screen. Collapse side panels and capture the nodes and documentation notes. Keep credential panels closed. The submission JSON is `workflow/economics-concert.json`, not a raw export with your credential identifiers.

Visit [n8n Creators](https://creators.n8n.io/) in your own creator account. The first page of the competition form says the template must already be submitted there. Upload the clean workflow, use the template description in `docs/SUBMISSION.md`, and retain its workflow/template ID. Keep it unpublished for entry in accordance with the supplied terms. If the portal cannot keep a submitted template unpublished, resolve that conflict with the organizer before changing its publication status.

The assistant has not submitted the registration form or accepted any consent on your behalf. Later form pages could not be inspected without advancing the registration.

## 4. Video — last

Do this only after the hosted lesson and phone test pass. The final video should be about two minutes and include you introducing yourself, the learner problem, the working interaction, the n8n orchestration, and an honest failure-handling demonstration. Your real introduction needs your own recording or an explicitly chosen capture method. The assistant can then edit the demonstration around it.

Upload the final video somewhere publicly viewable without sign-in. Test the link in a private browser window. The assistant will not submit the competition entry; you will manually review and submit it when ready.
