#!/usr/bin/env bash
# great-pm SessionStart — context load + feedback-loop directive injection.
# Runs at session start (cwd = the project). Output is injected into the
# session context, so directives here are SEEN and ACTED ON by the agent.
# Hooks cannot run agents; this is how the learning/feedback loops become
# "automatic on next session" — the hook flags, the agent executes.
set -u
PLUGIN_ROOT="${CLAUDE_PLUGIN_ROOT:-$HOME/great-pm}"

# --- ensure the `great-pm` CLI is on PATH (idempotent, silent) so agents can call
#     `great-pm connect ...`. No-op if already resolvable or already linked. ---
GPM_SRC="${PLUGIN_ROOT}/scripts/great-pm"
if [ -x "$GPM_SRC" ] && ! command -v great-pm >/dev/null 2>&1 && [ ! -e "$HOME/.local/bin/great-pm" ]; then
  mkdir -p "$HOME/.local/bin" && ln -s "$GPM_SRC" "$HOME/.local/bin/great-pm" 2>/dev/null || true
fi

bd prime 2>/dev/null || true

echo '=== great-pm ==='
if [ -f .great-pm/PROJECT.md ]; then
  cat .great-pm/PROJECT.md
else
  echo "great-pm: No .great-pm/PROJECT.md yet — copy ${PLUGIN_ROOT}/templates/PROJECT.md.template to .great-pm/PROJECT.md to start."
fi

# --- brain.md: seed if missing, show recent, FLAG IF STALE (pitfall #2 guard) ---
if [ ! -f .great-pm/brain.md ] && [ -f "${PLUGIN_ROOT}/templates/BRAIN.md.template" ]; then
  mkdir -p .great-pm
  cp "${PLUGIN_ROOT}/templates/BRAIN.md.template" .great-pm/brain.md
fi
if [ -f .great-pm/brain.md ]; then
  echo ''
  echo '=== brain.md (recent synthesis) ==='
  tail -20 .great-pm/brain.md
  # freshness: is brain.md older than the newest verdict? (cycle moved, brain didn't)
  newest_verdict=$(ls -t .great-pm/verdicts/*.log 2>/dev/null | head -1)
  if [ -n "$newest_verdict" ] && [ "$newest_verdict" -nt .great-pm/brain.md ]; then
    echo ''
    echo '⚠️  BRAIN STALE (pitfall #2): brain.md is older than the latest verdict.'
    echo '    Every subagent inherits brain.md — a stale brain poisons the whole loop.'
    echo '    ACTION: refresh .great-pm/brain.md from recent verdicts/gates before continuing.'
  fi
fi

# --- LEARNING LOOP (pitfall #3): a pending learn must EXECUTE this session ---
if [ -f .great-pm/.learn-pending ]; then
  echo ''
  echo '⚠️  ACTION REQUIRED — LEARNING PASS PENDING (pitfall #3, learning loop):'
  echo '    Last session ended without capturing lessons. Run the continuous-learner'
  echo '    pass now (or /pm-learn) BEFORE advancing the loop — extract what worked /'
  echo '    failed into .great-pm/lessons.md, then: rm .great-pm/.learn-pending'
fi

# --- OPEN DECISIONS: questions a human must answer, never lost to scroll ---
opendec=$(bd list --label open-decision --status open 2>/dev/null)
if [ -n "$opendec" ]; then
  echo ''
  echo '⚠️  OPEN DECISIONS PENDING — a human must answer these before the loop'
  echo '    builds further on assumptions. P0 = blocking (a gate cannot pass);'
  echo '    P2 = advisory. Answer, then record + close the bd issue:'
  echo "$opendec" | sed 's/^/    /'
fi

# --- FEEDBACK LOOP (pitfall #4): unprocessed build-feedback must reach Define ---
if [ -d .great-pm/build-feedback ]; then
  pending=$(find .great-pm/build-feedback -name '*.md' ! -name '*.ingested.md' 2>/dev/null)
  if [ -n "$pending" ]; then
    echo ''
    echo '⚠️  ACTION REQUIRED — BUILD FEEDBACK PENDING (pitfall #4, feedback loop):'
    echo '    Build learnings have not been folded back into Define. Before the next'
    echo '    spec, spec-writer + pm-tech-spec-review must ingest:'
    echo "$pending" | sed 's/^/      - /'
    echo '    After ingesting, rename each to <name>.ingested.md so it stops surfacing.'
  fi
fi

exit 0
