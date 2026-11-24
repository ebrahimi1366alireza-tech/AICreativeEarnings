# Optional Free Claude Code (FCC) setup

FCC is an optional companion to OpenCode. OpenCode remains the primary coding agent for AI Creative Earnings. This setup is deliberately **not** part of the Dev Container post-create hook: FCC's official installer is interactive and can offer multiple agents, so running it automatically could install software the user did not request.

## Preflight

From the repository root in a Codespaces terminal:

```bash
bash scripts/install-fcc.sh --check
```

This downloads the official installer over HTTPS and checks its shell syntax. It does not install software, create accounts, or configure a provider.

## Install

```bash
bash scripts/install-fcc.sh --install
```

The script asks for confirmation and then starts the official interactive installer. In its agent selection step, select **OpenCode only** for this workspace. Do not select optional agents or token-optimization packages unless separately reviewed and requested.

The current FCC release metadata specifies Python 3.14.10 and uv >= 0.13.7. The official installer manages these prerequisites with uv; do not hard-code a Python version into the Dev Container. The installer resolves and downloads a completed FCC release after launch.

## Cost and security rules

- FCC is an open-source client/proxy, not a guarantee of free inference. Provider quotas, model availability, subscription eligibility, and terms are controlled by each provider and can change.
- Do not enter a paid API key or enable paid provider usage without checking the provider's current pricing and obtaining explicit approval.
- Do not place API keys, OAuth tokens, passwords, OTPs, wallet seed phrases, or private keys in this repository, source code, or GitHub Actions variables unless a specific server-side integration has been reviewed and explicitly approved.
- Complete browser sign-in, email/SMS verification, CAPTCHA, and identity checks yourself. Never send verification codes to an agent.
- Keep the Codespaces terminal open while a foreground FCC server is running. Use only the official FCC admin URL shown by its startup output, and do not expose an unauthenticated proxy publicly.
- If FCC setup fails, preserve the error output and stop. Do not repeatedly run installers or paste secrets into logs.

## Current status

This repository contains an opt-in, confirmation-gated installer wrapper and these instructions. It does not claim that FCC is installed, that a provider is connected, or that a free model is available. Codespaces terminal execution and live FCC verification must still be performed in the user's active Codespace.
