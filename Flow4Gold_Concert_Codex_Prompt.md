# Full Codex prompt — Concert pixel-art dashboard

Place `Flow4Gold_Addendum_03_Concert_Pixel_Dashboard.md` in your existing project, then paste the prompt below into Codex in VS Code.

---

Implement `Flow4Gold_Addendum_03_Concert_Pixel_Dashboard.md` in the existing “The Economics of Everything” repository. Read the entire addendum and repository instructions before editing. This is an implementation task: produce working assets, code, integration configuration, and verification evidence.

We are focusing only on **The concert**. This addendum overrides conflicting product directions in earlier Flow4Gold briefs and the earlier DJ prompt. Preserve unrelated work and the current Railway deployment architecture. Blender is installed locally; inspect the executable/version and existing scene pipeline.

Current page: https://web-production-af12a.up.railway.app/lessons/concert-economics?lang=en

Art reference: https://www.youtube.com/shorts/RvFAbyJ3Yj4. Inspect it if accessible. If it is unavailable, use the addendum’s explicit art direction and say that playback was unavailable. Do not claim a visual match you have not checked.

First inspect the existing concert model, controls, Babylon.js scene, translations, coach API, n8n workflow, assets, and build/deployment scripts. Work in a reversible branch or the project’s established change workflow. Keep useful existing functionality. Adapt file paths to the actual repository; do not start a replacement application.

Build these requirements fully:

1. Change `01 / The concert` to `The concert`. Keep `A full house. A better business?`. Replace its description with: “Set the price. Build the crowd. See what pays. Adjust your ticket price, venue and event costs, then watch the dance floor and neon signs respond. Can you put on a great night and still make a profit?”

2. Recreate the concert in Blender as a polished retro pixel-art scene: recognizable DJ, articulated hands visibly scratching records and adjusting a mixer, two turntables, headphones, speakers, stage, moving lights, and varied dancing people. Create editable Blender source and reproducible scripts. Export and verify animated assets in the existing browser renderer. Apply the pixel-art style to the runtime scene; a normal low-poly model is not finished pixel art.

3. Keep the scene live. Crowd size must add/remove people when the calculated attendance changes. A fixed video cannot be the primary scene. Reuse character variants and animation loops, and use the addendum’s explicit grouped representation for large capacities. Show exact attendance and occupancy. Support capacity above 200, up to the configured 10,000-person limit. A larger venue alone must not invent demand. Keep the same art direction on desktop and mobile.

4. Display live neon signs within the scene composition for Audience, Revenue, Total costs, Profit/Loss, and ROI. Bind everything to one deterministic result object. Preserve the existing ROI meaning: profit / total costs × 100. Undefined ROI at zero costs shows a dash with an explanation. Use readable accessible sign text and a clear negative-value display.

5. Remove Lightweight view and alternate-renderer controls. Keep pause and reduced motion within the same scene. When animation is paused, lever changes must still update attendance and all numbers. In a rendering failure, keep accessible metrics/dashboard and a clear retry message; do not expose a second scene mode.

6. Replace Try a change with Mix Your Margins. Make the right side a dashboard with sliders AND editable numeric fields, clear units, inline validation, and one-action Undo. Always expose ticket price, capacity, Location, and Audience controls. Audience supports Estimate from ticket price or Set attendance myself, with clear explanations and capacity limits.

7. Implement Add a variable… as a dropdown that reveals optional controls for DJ/stage/sound, venue cost per place, cost per guest, promotion budget, assumed extra interest from promotion, sponsor contribution, and price sensitivity. Follow the model effects and removal/reset behavior in the addendum. No cosmetic controls without defined effects.

8. Implement Neighborhood club, City-center venue, Outdoor concert space, and Custom location using the addendum’s fictional preset table. Label them as illustrative, not real venue quotes. Preserve unrelated settings when switching locations, show the changes, and make the whole switch undoable. Editing preset values creates Custom location. Keep USD throughout.

9. Replace CU with $ everywhere relevant to the concert: labels, helpers, results, methodology, voice/text responses, captions, saves, and exports. Identify USD once. Use a shared formatter and consistent monetary precision. Do not treat this display/model-unit change as a real exchange-rate conversion.

10. Preserve the existing isoelastic demand model and extend it exactly as specified. Keep calculations in shared deterministic code, independent of AI. Validate positive ticket prices and all input ranges; handle zero demand, zero costs, negative profits, and capacity limits. Use the addendum’s numerical acceptance table as regression fixtures.

11. Integrate the official native TypeSafe AI node in the existing n8n Cloud workflow. Verify `@typesafe-ai/n8n-nodes-typesafe-ai`, the installed node schema/version, and model availability from the official references. Use Evaluate to classify question intent, then explicitly branch on confidence to an explanation or clarification. Keep the proposed 0.80 threshold configurable and test it; it is not an accuracy guarantee. Do not use TypeSafe to calculate money or portray its output as mathematical certification.

12. Keep secrets in n8n credentials/server configuration. Confirm existing account availability before proposing new accounts. Do not fabricate credentials, node IDs, node versions, model names, or a successful connection. If access is missing, finish the local work, provide a credential-free workflow/setup guide as far as the verified schema allows, and list the exact activation step that remains. An HTTP substitute must be clearly labeled and does not complete the native-node requirement.

13. Keep the coach and microphone usable, with the existing warm female Caribbean English voice preference where supported, captions, and user-controlled playback. Supply the server-verified current scenario to the coach. Prevent stale responses from affecting newer scenario revisions. Routine “Your last move” explanations should use deterministic figures. Preserve English and German.

14. Verify the finished experience, not just compilation. Inspect Blender preview frames and animation, the exported browser scene, crowd responses at multiple prices/capacities, typed and slider input, location changes, ROI, Undo/Reset/Save, mobile layout, reduced motion, translations, and failure paths. Distinguish mocked checks from real n8n executions and desktop emulation from actual mobile testing.

Deliver updated code; editable `.blend` files; generation/export scripts; optimized runtime assets; numerical regression checks; a credential-free n8n workflow export and setup guide; before/after desktop/mobile screenshots; and a short capture showing a real lever change affecting the crowd and signs. Record asset sizes and observed performance. Follow the existing Railway release workflow and authorization; state separately whether changes are local, previewed, or deployed.

Proceed with reasonable implementation decisions. Do not stop after writing a plan or producing placeholder visuals. When a dependency blocks one part, complete the unblocked work and report the specific missing access or execution step. Finish with a concise account of what changed, what was tested, and what remains incomplete.
