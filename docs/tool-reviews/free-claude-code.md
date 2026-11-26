# Free Claude Code (FCC) review

- Reviewed: 2026-11-26
- Upstream: https://github.com/Alishahryar1/free-claude-code
- Upstream default branch: `main`
- License: AGPL-3.0-only
- Decision: **keep as an optional, locally run model-routing companion; do not make it a required production dependency.**

## What it is

Free Claude Code (FCC) is a local proxy and provider/model router for coding-agent harnesses. It can expose Anthropic Messages, OpenAI Chat Completions, OpenAI Responses, and Gemini-compatible endpoints, and route supported clients to multiple upstream providers. The current upstream README advertises 12 harnesses and 61 providers, including free, paid, subscription, and local providers. Provider counts, free quotas, models, and integrations can change; treat upstream claims as time-sensitive, not guarantees.

FCC includes retries, configurable rate limits/concurrency, model/provider fallbacks, numbered API-key fallback, an Admin UI, and optional Discord/Telegram messaging and voice-note support. It is primarily a connectivity/routing layer, **not** a multi-agent task orchestrator, job scheduler, or autonomous earning system.

## Relevance to AI Creative Earnings

- Could give the existing OpenCode-first development workspace a single local endpoint for trying compatible model providers and fallback models.
- Could be useful for later coding/automation experiments without replacing OpenCode as the primary coding agent.
- Does not directly discover paid creative work, create deliverables, verify platform eligibility, or generate revenue.
- Does not provide a guaranteed free model. Provider quotas and terms are controlled by each provider; paid providers may incur charges.
- Does not remove the need for human approval of account access, submissions, contracts, identity checks, or financial actions.

## Existing project integration

The repository already has an opt-in setup wrapper and instructions:
- `scripts/install-fcc.sh`
- `docs/FCC_SETUP.md`

The wrapper downloads the official upstream installer over HTTPS, runs `sh -n` before installation, and requires an interactive user confirmation for installation. FCC is intentionally not installed automatically in the Dev Container. If installing for this workspace, choose **OpenCode only** in the upstream installer; keep OpenCode as the primary agent. The wrapper's preflight is a syntax check, not a security audit or proof that installation/provider connectivity works.

## Risks and checks before use

1. **License:** upstream declares AGPL-3.0-only. Running an unmodified local copy is permitted, but distributing a modified covered version or making a modified version available for network use can trigger AGPL source-offer and notice obligations. Review the full license before redistributing, embedding, or offering a modified FCC service.
2. **Installer supply chain:** the upstream quick-start uses a remote shell installer. The project wrapper downloads the script and syntax-checks it, but syntax validation does not establish that the script is safe. Review the exact downloaded release/script before execution and pin a reviewed release/commit for any repeatable deployment.
3. **Provider economics:** “free tokens” are provider-specific and can change without notice. Check provider pricing, quota, account eligibility, rate limits, and terms before use. A fallback chain may send a failed request to another provider and consume additional quota or money.
4. **Credentials and OAuth:** keep provider keys and OAuth credentials local to the user's FCC installation. Never commit them, place them in client-side app code, or send them to agents. Use proxy authentication when a client connects to FCC; do not expose an unauthenticated proxy to a public network.
5. **Data handling:** prompts, source code, and tool context may be sent to whichever upstream provider/model is selected. Check that provider's retention, training, privacy, and regional terms before sending sensitive project or personal data.
6. **Runtime footprint:** upstream currently requires Python 3.14.10 and uv >= 0.13.7, with a substantial dependency set and optional local voice dependencies. This is a meaningful additional runtime, not a lightweight browser-only integration. Verify Codespaces resource usage and compatibility before adopting it for routine work.
7. **Operational verification:** after installation, test only with non-sensitive sample code; verify proxy binding/authentication, selected provider/model, fallback behavior, and actual provider billing/quota. The repository does not currently claim FCC is installed or that any provider is connected.

## Recommended status

**Optional / review-only companion.** Keep the current confirmation-gated setup. Do not install automatically, do not switch the primary agent away from OpenCode, do not enable paid providers without explicit cost approval, and do not treat FCC's advertised free quotas as dependable income infrastructure.

## Sources

- Upstream repository and current README: https://github.com/Alishahryar1/free-claude-code
- Upstream license: https://github.com/Alishahryar1/free-claude-code/blob/main/LICENSE
- Upstream Python project metadata: https://github.com/Alishahryar1/free-claude-code/blob/main/pyproject.toml
- Existing local setup guide: ../FCC_SETUP.md
