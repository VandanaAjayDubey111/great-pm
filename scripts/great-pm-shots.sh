#!/usr/bin/env bash
# Regenerate the great-pm board screenshots (for the README) from the Lumen demo
# project. Idempotent: seeds the demo if missing, captures every view to
# docs/screenshots/*.png via headless Chrome, leaves your registry untouched.
#   Usage: bash scripts/great-pm-shots.sh
set -e
ROOT="${CLAUDE_PLUGIN_ROOT:-$HOME/great-pm}"
DEMO="$HOME/great-pm-demo"
OUT="$ROOT/docs/screenshots"
PORT=3199
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
[ -x "$CHROME" ] || CHROME="$(command -v google-chrome || command -v chromium || true)"
[ -n "$CHROME" ] || { echo "✗ Chrome not found — install Chrome or set CHROME"; exit 1; }
VIEWS=(inbox board roadmap loop knowledge metrics logs agents share help)

mkdir -p "$OUT"
[ -d "$DEMO/.great-pm" ] || bash "$ROOT/examples/seed-demo.sh"

# temporary demo-only registry so the project switcher shows only "Lumen"
REG="$HOME/.great-pm/projects.json"; BAK=""
mkdir -p "$HOME/.great-pm"
[ -f "$REG" ] && { BAK="$REG.shots-bak"; cp "$REG" "$BAK"; }
python3 - "$REG" "$DEMO" <<'PY'
import json,sys; reg,demo=sys.argv[1:3]
json.dump({"projects":[{"path":demo,"name":"Lumen — Public Beta","lastSeen":"2026-06-22T00:00:00Z"}]},open(reg,"w"),indent=2)
PY
restore(){ [ -n "$BAK" ] && mv "$BAK" "$REG" || rm -f "$REG"; kill "$SRV" 2>/dev/null || true; }
trap restore EXIT

# isolated capture server (does not touch your live board on 3142)
node "$ROOT/board/server.mjs" --port "$PORT" --no-open >/tmp/gpm-shots.log 2>&1 & SRV=$!
for i in $(seq 1 15); do [ "$(curl -sS -o /dev/null -w '%{http_code}' --max-time 2 "http://localhost:$PORT/" 2>/dev/null)" = "200" ] && break; sleep 1; done

ENC=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1]))" "$DEMO")
for v in "${VIEWS[@]}"; do
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=2 \
    --window-size=1560,1000 --virtual-time-budget=6000 \
    --screenshot="$OUT/$v.png" "http://localhost:$PORT/?project=$ENC#$v" >/dev/null 2>&1 \
    && echo "  ✓ $v.png" || echo "  ✗ $v.png (capture failed)"
done
echo "Screenshots → $OUT"
ls -1 "$OUT"/*.png 2>/dev/null | wc -l | xargs echo "  total:"
