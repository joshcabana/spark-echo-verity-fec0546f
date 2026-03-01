#!/usr/bin/env bash
set -euo pipefail

CANONICAL_PROJECT_ID="${1:-itdzdyhdkbcxbqgukzis}"
ENV_FILE="${2:-.env}"
SUPABASE_CONFIG_FILE="${3:-supabase/config.toml}"
ENV_FALLBACK_FILE="${4:-.env.production}"

ENV_FILES=("$ENV_FILE")
if [[ "$ENV_FALLBACK_FILE" != "$ENV_FILE" ]]; then
  ENV_FILES+=("$ENV_FALLBACK_FILE")
fi

read_env_var() {
  local key="$1"
  local env_val
  env_val="$(printenv "$key" 2>/dev/null || true)"
  if [[ -n "$env_val" ]]; then
    echo "$env_val"
    return 0
  fi

  local env_file
  for env_file in "${ENV_FILES[@]}"; do
    if [[ ! -f "$env_file" ]]; then
      continue
    fi

    local line
    line="$(grep -E "^${key}=" "$env_file" | tail -n 1 || true)"
    if [[ -z "$line" ]]; then
      continue
    fi

    local value="${line#*=}"
    value="${value%\"}"
    value="${value#\"}"
    echo "$value"
    return 0
  done

  echo ""
}

if [[ ! -f "$SUPABASE_CONFIG_FILE" ]]; then
  echo "Missing $SUPABASE_CONFIG_FILE" >&2
  exit 1
fi

ENV_PROJECT_ID="$(read_env_var "VITE_SUPABASE_PROJECT_ID")"
ENV_URL="$(read_env_var "VITE_SUPABASE_URL")"
CONFIG_PROJECT_ID="$(
  awk -F'"' '/^project_id[[:space:]]*=/{print $2}' "$SUPABASE_CONFIG_FILE" | head -n 1
)"

if [[ -z "$ENV_PROJECT_ID" ]]; then
  echo "Missing VITE_SUPABASE_PROJECT_ID in env context or ${ENV_FILES[*]}" >&2
  exit 1
fi

if [[ -z "$ENV_URL" ]]; then
  echo "Missing VITE_SUPABASE_URL in env context or ${ENV_FILES[*]}" >&2
  exit 1
fi

if [[ -z "$CONFIG_PROJECT_ID" ]]; then
  echo "Unable to parse project_id from $SUPABASE_CONFIG_FILE" >&2
  exit 1
fi

URL_PROJECT_ID="$(echo "$ENV_URL" | sed -E 's#https?://([^.]+)\.supabase\.co/?#\1#')"

if [[ "$ENV_PROJECT_ID" != "$CANONICAL_PROJECT_ID" ]]; then
  echo "FAIL: env project id '$ENV_PROJECT_ID' != canonical '$CANONICAL_PROJECT_ID'" >&2
  exit 2
fi

if [[ "$URL_PROJECT_ID" != "$CANONICAL_PROJECT_ID" ]]; then
  echo "FAIL: env URL '$ENV_URL' does not resolve to canonical '$CANONICAL_PROJECT_ID'" >&2
  exit 2
fi

if [[ "$CONFIG_PROJECT_ID" != "$CANONICAL_PROJECT_ID" ]]; then
  echo "FAIL: $SUPABASE_CONFIG_FILE project_id '$CONFIG_PROJECT_ID' != canonical '$CANONICAL_PROJECT_ID'" >&2
  exit 2
fi

echo "PASS: project alignment validated for canonical '$CANONICAL_PROJECT_ID'."
