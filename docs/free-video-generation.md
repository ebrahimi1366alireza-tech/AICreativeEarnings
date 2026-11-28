# Free-first AI video generation

## What this release supports

The app can prepare a video brief/prompt and route the user to a provider's own website. The user generates and downloads the video in that provider's interface, then brings the file back into the production workflow. This is a manual workflow, not an in-app generation API.

| Provider | Workflow | Cost/quota status |
|---|---|---|
| Dreamina | Manual browser/app generation | Account-dependent; verify current quota, watermark and commercial rights |
| Krea | Manual browser generation | Account-dependent; consumer quota is separate from API billing |
| Canva | Manual design/video assembly | Account-dependent; some assets/features may be paid |
| CapCut | Manual editing and finishing | Account-dependent; some effects/assets may be paid |
| ComfyUI + Wan | Self-hosted open-source workflow | Software/model can be free; compute/GPU and hosting may cost money |
| Runway Dev API | Disabled | Paid API; no key, credit purchase or generation is enabled |

## Safety and cost rules

- No provider API is invoked by this release. `lib/video-provider-policy.cjs` is a policy/catalogue module, not a generator.
- Free quotas are not represented as unlimited or guaranteed. Check the signed-in account's current quota, regional availability, watermark/export limits, and commercial-use license before a client job.
- A free consumer website plan does not imply a free API. In particular, Runway Dev API billing is separate from the consumer app.
- Do not add `RUNWAYML_API_SECRET` or any other paid provider secret to production. Do not purchase credits.
- Open-source local generation is not automatically free on a phone: model size, GPU RAM, electricity, and cloud GPU rental can create costs.
- Human review is required for commercial rights and final delivery.

## Next integration gate

An in-app provider may be added only after its official documentation confirms a stable API, genuinely free usable quota, Armenia/account availability, commercial-use rights, watermark/export behavior, and enforceable spend limits. Until then the app uses manual provider handoff and prompt preparation.
