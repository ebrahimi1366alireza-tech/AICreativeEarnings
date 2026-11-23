#!/usr/bin/env bash
set -euo pipefail

if ! command -v opencode >/dev/null 2>&1; then
  echo "OpenCode is not installed. Rebuild the Codespace container first." >&2
  exit 1
fi

if [[ -z "${OPENCODE_SERVER_PASSWORD:-}" ]]; then
  if ! command -v openssl >/dev/null 2>&1; then
    echo "Set OPENCODE_SERVER_PASSWORD before starting OpenCode." >&2
    exit 1
  fi
  export OPENCODE_SERVER_PASSWORD="$(openssl rand -hex 24)"
  echo "Temporary OpenCode password (copy it now): ${OPENCODE_SERVER_PASSWORD}"
fi

echo "OpenCode will listen on private Codespaces port 4096."
exec opencode web --hostname 0.0.0.0 --port 4096
