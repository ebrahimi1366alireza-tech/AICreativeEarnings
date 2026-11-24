#!/usr/bin/env bash
set -euo pipefail

INSTALLER_URL="https://raw.githubusercontent.com/Alishahryar1/free-claude-code/main/scripts/install.sh"
MODE="${1:---help}"

usage() {
  cat <<'USAGE'
AI Creative Earnings - optional Free Claude Code setup

Usage:
  bash scripts/install-fcc.sh --check    Download and syntax-check the official installer only.
  bash scripts/install-fcc.sh --install  Ask for confirmation, then launch the interactive official installer.
USAGE
}

case "$MODE" in
  --help|-h) usage; exit 0 ;;
  --check|--install) ;;
  *) usage >&2; exit 2 ;;
esac

if ! command -v curl >/dev/null 2>&1; then
  echo "curl is required. No changes have been made." >&2
  exit 1
fi
if ! command -v sh >/dev/null 2>&1; then
  echo "POSIX sh is required. No changes have been made." >&2
  exit 1
fi

tmp_dir="$(mktemp -d)"
trap 'rm -rf "$tmp_dir"' EXIT
installer="$tmp_dir/fcc-install.sh"

echo "Downloading the official FCC installer from:"
echo "  $INSTALLER_URL"
curl --fail --location --silent --show-error --proto '=https' --tlsv1.2 "$INSTALLER_URL" -o "$installer"
sh -n "$installer"
echo "Official installer downloaded and passed the shell syntax check."

if [[ "$MODE" == "--check" ]]; then
  echo "Preflight only: no software was installed and no account was connected."
  exit 0
fi

if [[ ! -t 0 || ! -t 1 ]]; then
  echo "Interactive installation needs a terminal. Open the Codespaces terminal and run this command again." >&2
  exit 1
fi

cat <<'NOTICE'

Before continuing:
- FCC itself is open source, but model/provider usage is not automatically free.
- Do not add a paid API key or approve paid usage unless you have reviewed the price.
- The official installer may offer several coding agents. Choose only OpenCode for this workspace; OpenCode is already the primary agent here.
- The installer may install Python/uv and FCC components in your Codespace.
- No passwords, OTPs, wallet keys, or API secrets should be committed to this repository.

NOTICE
read -r -p "Run the official interactive FCC installer now? [y/N] " answer
case "$answer" in
  y|Y|yes|YES) ;;
  *) echo "Cancelled. No installation was started."; exit 0 ;;
esac

sh "$installer"
