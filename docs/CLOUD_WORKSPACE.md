# Cloud development workspace

This repository is configured for GitHub Codespaces and mobile browser development.

## Open from Android

1. Sign in to GitHub in your mobile browser.
2. Open this repository.
3. Open the green **Code** menu, choose **Codespaces**, then **Create codespace on main**.
4. Wait for the environment to finish building.
5. Open the terminal in the web editor.

## Start the app

```bash
npm install
npm run dev -- --hostname 0.0.0.0
```

Open the forwarded port 3000 preview.

## OpenCode

OpenCode CLI is installed by the dev-container setup:

```bash
opencode
```

OpenCode is an agent interface, not a free model by itself. It needs a supported model provider and valid credentials. Do not paste API keys into chat, source files, commits, or screenshots. Configure provider credentials only in the Codespace's secure environment or the provider's supported authentication flow. No paid provider or API usage is authorized by this setup.

## Cost guardrails

GitHub Free currently includes a monthly Codespaces allowance for personal accounts (120 core-hours and 15 GB-month storage). Stop the Codespace when finished. Check GitHub billing before creating more environments. Do not add a payment method or spending budget just to continue.

## Android builds

Use the repository's GitHub Actions workflow for Android builds where available. Android SDK installation is intentionally kept out of the Codespace to reduce setup time and storage. Download build artifacts from the Actions run.

## Security

Never commit passwords, OAuth secrets, wallet seed phrases, private keys, or API tokens. Keep all credentials in provider-managed secrets. Review every AI-generated diff before committing.
