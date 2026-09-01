#!/usr/bin/env bash
# MAXI via raw curl. Usage: ./curl.sh "I want to make an app for students to network"
# Requires OPENAI_API_KEY (or swap the endpoint for any OpenAI-compatible server, e.g. Ollama at http://localhost:11434/v1).
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
REQUEST="${*:-I want to make an app for students to network}"
MODEL="${MAXI_MODEL:-gpt-4o}"
BASE="${OPENAI_BASE_URL:-https://api.openai.com/v1}"

jq -n --rawfile sys "$HERE/system-prompt.txt" --arg req "/maxi $REQUEST" --arg model "$MODEL" \
  '{model:$model, messages:[{role:"system",content:$sys},{role:"user",content:$req}]}' |
curl -sS "$BASE/chat/completions" \
  -H "Authorization: Bearer ${OPENAI_API_KEY:-ollama}" \
  -H "Content-Type: application/json" \
  -d @- | jq -r '.choices[0].message.content'
