# Shared cloud development workspace (Work replacement)

This branch prepares a browser-accessible cloud development environment for the user's projects. It is isolated from `main` and does not alter production code or deployments.

## Stack
- GitHub Codespaces: cloud Linux development machine, opened in the Android browser.
- OpenCode: coding agent with a browser UI, installed automatically in the devcontainer.
- GitHub CLI: clone and switch between repositories from the same Codespace, subject to the account's repository permissions.
- GitHub Actions: existing `.github/workflows/quality-checks.yml` runs TypeScript checks and a production build on pushes/PRs to `main`.

## Start from an Android phone
1. Open this branch: https://github.com/ebrahimi1366alireza-tech/AICreativeEarnings/tree/work-replacement/bootstrap
2. Open **Code** → **Codespaces** → **Create codespace on work-replacement/bootstrap**.
3. Choose the smallest available machine (2 cores).
4. Do not add a payment method or enable paid usage. Personal GitHub Free accounts currently include 120 Codespaces core-hours and 15 GB-month storage. A 2-core machine uses 2 core-hours per active hour, about 60 active hours. If the free quota runs out, stop and wait for reset rather than enabling billing.
5. Wait for the devcontainer to finish installing OpenCode. Open the integrated terminal.

## Start OpenCode in the browser
Run:
```bash
bash .devcontainer/start-opencode-web.sh
```
The script creates a one-time random password if `OPENCODE_SERVER_PASSWORD` is not already set, then starts OpenCode on port 4096. Copy the password from the terminal, open the forwarded **OpenCode Web** port, and enter it when prompted. Port 4096 is configured as **Private**. Do not change it to Public.

To restart with a new password, stop the server and run the script again. For a persistent password, set `OPENCODE_SERVER_PASSWORD` as a GitHub Codespaces secret instead of saving it in this repository.

## Run the web app
```bash
npm install
npm run dev
```
The app uses port 3000, also forwarded privately.

## Work across other projects
Create a separate folder and clone only the repositories you need:
```bash
mkdir -p ~/projects && cd ~/projects
gh auth status
gh repo clone ebrahimi1366alireza-tech/InstaAIManager2026
```
If the private repository is not accessible, use GitHub's sign-in/authorization prompt to grant the Codespace access. Never paste a personal access token into chat or commit it. Keep each project on its own branch.

## Models and cost controls
OpenCode itself is free/open-source, but model inference is separate. Use a model only after checking its current free allowance and regional availability in OpenCode. Do not select paid providers or models without explicit approval. No API key is included in this setup.

GitHub Actions has separate usage limits. Check account billing before enabling additional workflows on private repositories. No paid usage is authorized.

## Safety
- Work on feature branches; do not experiment directly on `main`.
- Review diffs before committing or opening a pull request.
- Never commit passwords, API keys, Supabase service-role keys, private keys, wallet seed phrases, or `.env` files.
- Never enable billing or add a payment method without explicit approval.
- Stop the Codespace when finished to conserve compute hours.
- Do not run live trades, claims, payments, account verification, or irreversible financial actions from an agent.

## Rollout
1. User creates the Codespace once through GitHub's web interface. The connected GitHub tools do not expose a Codespaces create/start action.
2. Test OpenCode from the Android browser and confirm that a free model works without payment.
3. Only after the pilot works, apply the same devcontainer pattern to other repositories. Keep each project isolated.

## Current status
Bootstrap configuration and setup instructions are committed on `work-replacement/bootstrap`. The Codespace itself has not yet been created, and OpenCode/model access has not yet been tested in the user's session.
