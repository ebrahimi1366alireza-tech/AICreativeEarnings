# Shared cloud development workspace (pilot)

This branch prepares a browser-based cloud development environment for testing the Work replacement. It is intentionally isolated from `main`.

## Stack

- GitHub Codespaces: cloud Linux development machine, accessed from the browser on Android.
- OpenCode CLI: open-source coding agent installed automatically when the Codespace is created.
- GitHub Actions: existing `.github/workflows/quality-checks.yml` continues to run TypeScript checks and a production build.
- GitHub repositories: source of truth for each project. This pilot does not copy or merge project data.

## Start from an Android phone

1. Open this branch in GitHub: https://github.com/ebrahimi1366alireza-tech/AICreativeEarnings/tree/work-replacement/bootstrap
2. Open the green **Code** menu, choose **Codespaces**, then **Create codespace on work-replacement/bootstrap**.
3. Choose the smallest available machine (2 cores). Keep the Codespaces port and storage usage within the personal free quota.
4. Do not add a payment method or enable paid usage. GitHub documents that personal Free accounts include 120 core-hours and 15 GB-month storage; a 2-core machine uses 2 core-hours per active hour. If the free quota is exhausted, stop until it renews rather than enabling billing.
5. Wait for the devcontainer setup to finish. Open the integrated terminal.

## Start the project

```bash
npm install
npm run dev
```

The development server uses port 3000. Codespaces should offer a forwarded browser link.

## Start OpenCode

```bash
opencode
```

OpenCode is free/open-source software, but model inference is a separate service. The CLI does not include unlimited free AI tokens. Use only a provider/model whose current free allowance and regional availability have been checked. Do not paste API keys into chat, source files, commits, or screenshots; enter them only in the provider's secure configuration flow. Do not select a paid provider or model without explicit approval.

## Safety rules

- Work on feature branches. Do not experiment directly on `main`.
- Review diffs before committing or opening a pull request.
- Never put passwords, access tokens, Supabase service-role keys, private keys, wallet seed phrases, or other secrets in the repository.
- Never enable GitHub billing or add a payment method without explicit approval.
- Stop the Codespace when finished. Deleting an unused Codespace also releases its storage allocation.
- Do not run live trades, claims, payments, account-verification actions, or other irreversible operations from an agent.

## Rollout plan

1. Validate this pilot on the Android browser.
2. Confirm the free quota and OpenCode model access without paying.
3. Add the same devcontainer pattern to other repositories only after this pilot works.
4. Keep each project isolated in its own repository and branch. No project is automatically merged into another.

## Current limitation

The connected GitHub tools can inspect and edit repositories, but do not expose a Codespaces creation/start API. The Codespace itself must be created by the account owner through GitHub's **Code → Codespaces** interface. This is a one-time manual click, not a missing code change.
