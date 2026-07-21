#!/usr/bin/env python3
"""
Agent discipline sweep — applies engineering's patterns to all 21 great-pm agents.

Adds/standardizes:
  1. `## Brain append` — every agent appends a synthesis line to .great-pm/brain.md
  2. `## Verdict log` — every agent writes to BOTH per-agent and per-date log
                        (replaces existing block; preserves agent-specific field set)

Idempotent: re-running won't duplicate sections. Safe to re-run.

Usage:
  python3 ~/great-pm/scripts/sweep-agents-discipline.py
"""

import re
import sys
from pathlib import Path

AGENTS_DIR = Path.home() / "great-pm" / "agents"

BRAIN_APPEND_TEMPLATE = """## Brain append

After writing the artefact (or producing the verdict for review-style
agents), append a 1–3 line synthesis to `.great-pm/brain.md` so future
subagents inherit it via the SubagentStart hook:

```bash
mkdir -p .great-pm
TS=$(date -u +%Y-%m-%dT%H:%M:%SZ)
{{
  echo ""
  echo "## $TS | {agent} | <topic>"
  echo "- <1–3 line synthesis: what was learned, what now matters, what next subagents should remember>"
}} >> .great-pm/brain.md
```

Keep it terse. Future subagents see this via `tail -40 .great-pm/brain.md`.
Do NOT dump raw artefact content here — only the synthesis.

"""

VERDICT_LOG_TEMPLATE = """## Verdict log

Standard format — written to BOTH per-agent log AND per-date log so
downstream agents can grep ONE LINE instead of re-parsing prose.

```bash
mkdir -p .great-pm/verdicts
TS=$(date -u +%Y-%m-%dT%H:%M:%SZ)
LINE="$TS | {agent} | <DONE|BLOCKED|HELD> | <key=value pairs — e.g. initiative=<slug> artefact=<path> verdict=<...>>"
echo "$LINE" >> ".great-pm/verdicts/{agent}.log"
echo "$LINE" >> ".great-pm/verdicts/$(date +%Y-%m-%d).log"
```

Why two logs:
- `.great-pm/verdicts/{agent}.log` — fast per-agent history (`/pm-agent-review {agent}` reads this)
- `.great-pm/verdicts/<date>.log` — daily cross-agent timeline (`/pm-board` reads this)
"""


def sweep_agent(path: Path) -> dict:
    """Sweep one agent file. Returns a dict of what changed."""
    agent_name = path.stem
    text = path.read_text()
    changes = {"agent": agent_name, "brain_append": False, "verdict_log": False}

    # Render templates for this agent
    brain_block = BRAIN_APPEND_TEMPLATE.format(agent=agent_name)
    verdict_block = VERDICT_LOG_TEMPLATE.format(agent=agent_name)

    # ---- Replace ## Verdict log section (everything from "## Verdict log" until
    # next "## " heading or EOF) ----
    verdict_pattern = re.compile(
        r"## Verdict log\s*\n.*?(?=\n## |\Z)",
        re.DOTALL,
    )
    if verdict_pattern.search(text):
        new_text = verdict_pattern.sub(verdict_block.rstrip() + "\n", text)
        if new_text != text:
            text = new_text
            changes["verdict_log"] = True
    else:
        # No verdict log section — append at end (rare)
        text = text.rstrip() + "\n\n" + verdict_block.rstrip() + "\n"
        changes["verdict_log"] = True

    # ---- Insert ## Brain append section right BEFORE ## Verdict log ----
    if "## Brain append" not in text:
        # Find the ## Verdict log heading and insert brain block before it
        verdict_heading = re.compile(r"^## Verdict log\s*$", re.MULTILINE)
        m = verdict_heading.search(text)
        if m:
            insert_at = m.start()
            text = text[:insert_at] + brain_block + text[insert_at:]
            changes["brain_append"] = True
        else:
            # Shouldn't happen since we just inserted verdict log above
            text = text.rstrip() + "\n\n" + brain_block.rstrip() + "\n"
            changes["brain_append"] = True

    path.write_text(text)
    return changes


def main():
    if not AGENTS_DIR.exists():
        print(f"ERROR: agents dir not found: {AGENTS_DIR}", file=sys.stderr)
        return 1

    agent_files = sorted(AGENTS_DIR.glob("*.md"))
    print(f"Sweeping {len(agent_files)} agent files in {AGENTS_DIR}\n")

    for f in agent_files:
        result = sweep_agent(f)
        flags = []
        if result["brain_append"]:
            flags.append("brain-append+")
        if result["verdict_log"]:
            flags.append("verdict-log+")
        if not flags:
            flags.append("(no changes — already standardized)")
        print(f"  {result['agent']:25s}  {', '.join(flags)}")

    print(f"\nDone. {len(agent_files)} files processed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
