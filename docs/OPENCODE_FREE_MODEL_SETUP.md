# OpenCode: free model connection

## Current decision

Use the built-in **GitHub Copilot provider** in OpenCode as the first no-subscription experiment. GitHub Models is not an option: GitHub retired its playground, model catalog, and inference API on July 30, 2026.

GitHub currently advertises Copilot Free at $0, with a limited monthly AI-credit allowance and 2,000 code completions. Free-plan model selection is automatic, not a user-selected model catalog. Availability of OpenCode as a third-party client must be confirmed by the account's actual OAuth entitlement before relying on it.

Official references:
- OpenCode provider setup: https://opencode.ai/docs/providers
- GitHub Copilot plans: https://docs.github.com/en/copilot/get-started/plans
- GitHub Copilot usage limits: https://docs.github.com/en/copilot/concepts/billing-and-usage/individuals/usage-limits
- GitHub Models retirement: https://github.blog/changelog/2026-07-30-github-models-is-now-retired/

## Safe connection procedure

1. Open the existing GitHub Codespace from the Android browser.
2. In the Codespaces terminal, run `opencode`.
3. In the OpenCode TUI, run `/connect`.
4. Choose **GitHub Copilot**, then choose **Login with GitHub Copilot**.
5. Open the device-verification URL shown by OpenCode on the user's phone and enter the one-time code personally.
6. Review the GitHub authorization screen and approve only if it clearly identifies the expected OpenCode/GitHub Copilot connection.
7. Return to OpenCode and run `/models`. Use only models actually listed for that account.
8. Run a small read-only test first, such as asking OpenCode to explain the repository structure. Do not permit edits, commits, deployments, or paid usage during the first test.

## Hard stop conditions

- Do not paste GitHub passwords, recovery codes, personal access tokens, or OAuth device codes into chat or repository files.
- Do not create a paid Copilot subscription, enable metered overage, add a payment method, or set a spending budget.
- If the provider reports no entitlement, a payment requirement, or an upgrade prompt, stop. Do not bypass it.
- Never store credentials in `opencode.json`, GitHub source files, Actions logs, or the app's database.
- The OpenCode CLI smoke test in GitHub Actions only proves that the CLI can be installed and launched. It does **not** prove that a model is connected or that an agent can complete a coding task.

## Current status

- OpenCode CLI installation smoke test: passed in GitHub Actions.
- Provider OAuth: not yet completed; it requires the user to complete GitHub's device verification on their phone.
- Model response test: pending user-authorized OAuth.
- No API key, paid subscription, or billing setting has been added by this project.
