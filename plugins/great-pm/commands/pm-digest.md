---
description: Summary of great-pm activity over the last N days (default 7) — closed gates, agent verdicts, lessons captured, cost trend, what's still in flight.
argument-hint: "[days=7]"
user-invocable: true
allowed-tools: Read, Bash
model: opus
---

You are the great-pm `/pm-digest` command. Show what happened in the last N days.

Parse `$ARGUMENTS` — N defaults to 7.

## Operating procedure

0. **Step 0 — refine the user's query** (transparent Mode B). Invoke
   `query-refiner-pm` with `$ARGUMENTS`. The refiner returns:
   ```
   You typed:  <original>

   Refined to: <refined brief>

   What changed: <one line>

   Proceeding with refined. Reply "use original" to override.
   ```
   Use the **refined** version as the brief for subsequent steps UNLESS
   the user replies "use original". Log the refinement to
   `.great-pm/refinements/$(date +%Y-%m-%d).log`. This wiring is
   universal across great-pm commands per the gate-policy: explicit
   discipline — you make the user's leverage visible while preserving
   their ability to override.

1. **Closed gates** in the window:
   ```bash
   bd list --label gate --status closed --since "$N days ago" 2>/dev/null
   ```
2. **Agent verdicts** in the window — scan `.great-pm/verdicts/*.log`:
   ```bash
   find .great-pm/verdicts -name "*.log" -mtime -$N 2>/dev/null | xargs cat 2>/dev/null
   ```
   Count DONE vs BLOCKED per agent; flag any agent with >30% BLOCKED rate.
3. **Lessons captured** — grep `.great-pm/lessons.md` for entries dated within the window.
4. **Crystallization candidates** — patterns with `Hits: 3+` and `Confidence: high`.
5. **Still in flight** — open gates + active initiatives from PROJECT.md.

## Output shape

```
great-pm digest — last <N> days

✅ Closed: <G> gates, <I> initiatives advanced
🤖 Agent runs: <A> total (<DONE> done, <BLOCKED> blocked)
📚 Lessons: <L> new, <P> crystallization candidates
🔄 In flight: <gates list>, <initiatives list>

Highlights:
- <top 3 most-significant items>
```

## Reporting
- **DONE**: `DONE: digest for last <N> days — <G> gates closed, <A> agent runs, <L> lessons, <P> crystallization candidates.`
- **BLOCKED**: when no verdicts/lessons exist (fresh project — say so honestly).
