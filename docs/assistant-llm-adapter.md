# Opt-in LLM assistant adapter

The assistant API is intentionally disabled by default. It does not activate merely because this code is deployed.

## Server-only environment

Set all four variables on the server runtime only:

- `AI_ASSISTANTS_ENABLED=true`
- `AI_ASSISTANT_BASE_URL=https://provider.example/v1` (OpenAI-compatible Chat Completions base URL)
- `AI_ASSISTANT_API_KEY=...` (secret; never expose with a `NEXT_PUBLIC_` prefix)
- `AI_ASSISTANT_MODEL=...`

Production requires HTTPS. Do not commit credentials or place them in client-side code. No provider is selected by default and no paid provider or account has been configured.

## Free-first provider candidate (not yet connected)

Google AI Studio's Gemini API currently lists a free tier for selected models. Its OpenAI-compatible Chat Completions endpoint matches this adapter's request format:

- `AI_ASSISTANT_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai`
- `AI_ASSISTANT_MODEL=gemini-2.5-flash-lite`
- `AI_ASSISTANT_API_KEY` must be a Gemini API key created in Google AI Studio.
- `AI_ASSISTANTS_ENABLED=true`

Important: Google's published free-tier terms state that submitted content may be used to improve its products. Do not send client-confidential material, personal data, account credentials, KYC documents, wallet details, or unreleased sensitive work. The app's current adapter forwards only the allowlisted creative brief, and the user must consent on every request. Verify current model availability, free quota, regional eligibility, and terms in Google AI Studio before adding a key. Do not enable Cloud Billing or a paid tier for this project without explicit budget approval.

This is a documented candidate only. No Google account, API key, provider connection, or paid service has been created or enabled.

## Request contract

Authenticated users may POST to `/api/assistants/advice` with:

```json
{
  "allowExternalProcessing": true,
  "brief": {
    "title": "Product launch video",
    "contentType": "short video",
    "platform": "Instagram",
    "product": "Handmade bag",
    "audience": "Young adults",
    "message": "Show the product clearly",
    "specifications": "Vertical 9:16, 20 seconds"
  }
}
```

The explicit consent flag is required for each request. Only the allowlisted creative brief fields are forwarded. Identity, citizenship, residence, KYC, wallet, payment, expected income, and platform eligibility data are not forwarded by this endpoint. Requests are limited to five per user per minute in each running server instance and the provider call times out after 20 seconds.

## Authority and safety

The response is advisory text only. It cannot change deterministic opportunity, rights, quality, delivery, eligibility, or earnings states. It cannot call tools, register accounts, upload files, contact clients, connect wallets, or move funds. A human must independently review all output.

The in-memory rate limit is best-effort on serverless deployments; use an edge/shared rate limiter before exposing this endpoint to broad public traffic. Configure a provider only after reviewing its data-retention, processing-location, pricing, and account eligibility terms. No live provider call has been made as part of this change.
