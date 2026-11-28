# Free-first AI video generation

## What this release supports

The app prepares a video brief/prompt and routes the user to a provider's own website. The user generates and downloads the video there, then brings the file back into the production workflow. This is a manual workflow, not an in-app generation API.

## Verified consumer options (official pages checked 2026-11-28)

| Provider | What the free route currently offers | Important limits |
|---|---|---|
| Krea | Official video page advertises a Free plan with 100 compute units per day and no credit card. It says free accounts can generate short clips with selected free video models. | Free-plan outputs are for personal use; Krea says commercial licensing is included on paid plans. Model availability and units can change. Do not use free-plan output for paid client delivery unless the applicable license explicitly permits it. |
| Dreamina | Official help confirms free access alongside paid services; its product page advertises free daily credits for image/video workflows. | The exact allowance, selected model, region, watermark/export limits, and commercial rights must be checked in the signed-in account and applicable terms. Do not assume every model is free or commercial-use eligible. |
| Canva | Free plan has limited shared AI access and supports some AI tools such as image-to-video. | Canva's specific "Create a Video Clip" feature powered by Veo is listed for Pro, Business, Enterprise, and Nonprofit plans, not the Free plan. |
| CapCut | Useful free editing, captioning, and finishing workflow. | Editing is not the same as generating original AI footage. Some AI features, effects, assets, and regional availability may be restricted or paid. |
| ComfyUI + Wan | Open-source software/model workflow can avoid per-generation provider API charges when run on owned hardware. | Not practical to assume phone execution. Video models require substantial storage and GPU memory; rented cloud GPUs cost money. |
| Runway Dev API | Not a free option for this app. | Disabled. Do not configure a key or buy credits. |

Krea's own feature page currently states 100 free units/day, no credit card, and personal-use-only rights for free-plan videos; paid plans include a commercial license. Dreamina's official help confirms free access but directs users to the account for current credits and applicable terms. Canva's official feature page says its Veo-powered video clip generator is for paid/eligible organizational plans.

## API reality check

A free consumer web allowance is not a free API.

- Google AI developer pricing lists Veo 3.1 video generation with no free tier; paid generation is priced per video second.
- fal's official model API documentation describes prepaid credits and per-output/per-second billing. It is not a dependable free API route.
- Hugging Face Inference Providers lists only $0.10 in monthly credits for Free accounts (subject to change), then requires paid credits for additional usage. This is a tiny trial allowance, not a sustainable free video-generation backend.
- Hugging Face does document text-to-video API access through providers such as fal; that does not make the underlying inference free.

Therefore, as of this review, no stable, useful, genuinely free video-generation API has been verified for integration. The practical no-upfront-cost route is manual use of free consumer quotas for personal/sample work, subject to regional access and licensing. For commercial client work, verify the exact license before delivery. No provider API is connected or invoked by this release.

## Safety and cost rules

- No provider API is invoked by this release. `lib/video-provider-policy.cjs` is a policy/catalogue module, not a generator.
- Never represent free quotas as unlimited or guaranteed. Check current account quota, regional availability, watermark/export limits, and commercial-use rights before a client job.
- Do not add `RUNWAYML_API_SECRET` or any other paid provider secret to production. Do not purchase credits.
- Open-source local generation is not automatically free on a phone: model size, GPU RAM, electricity, and cloud GPU rental can create costs.
- Human review is required for commercial rights and final delivery.

## Next integration gate

An in-app provider may be added only after official documentation confirms a stable API, genuinely free usable quota, Armenia/account availability, commercial-use rights, watermark/export behavior, and enforceable spend limits. Until then the app uses manual provider handoff and prompt preparation.

## Official references

- Krea free AI video generator and plan rights: https://www.krea.ai/features/ai-video-generator
- Krea pricing: https://www.krea.ai/pricing
- Dreamina official help: https://dreamina.capcut.com/help
- Dreamina official product page: https://dreamina.capcut.com/productivity
- Canva AI video generator eligibility: https://www.canva.com/features/ai-video-generator/
- Canva AI plan access: https://www.canva.com/help/ai-access/
- Google Gemini API pricing: https://ai.google.dev/gemini-api/docs/pricing
- fal model API billing: https://fal.ai/docs/documentation/model-apis/pricing
- Hugging Face Inference Providers pricing: https://huggingface.co/docs/inference-providers/pricing
- Hugging Face text-to-video API task: https://huggingface.co/docs/inference-providers/tasks/text-to-video
- NVIDIA ComfyUI/Wan video hardware guidance: https://build.nvidia.com/spark/comfyui/video-gen-workflow
