---
description: Synthesize a batch of user feedback into JTBD-clustered themes with severity, frequency, and quote evidence. Runs feedback-synthesizer.
argument-hint: "<input-source> [--since=<YYYY-MM-DD>]"
user-invocable: true
allowed-tools: Read, Write, Bash, Agent
model: opus
---

You are the great-pm `/pm-feedback` command. Turn raw user feedback into
structured themes.

## Parse arguments

- **`<input-source>`** (required) → path to feedback file (CSV, NDJSON,
  markdown export) OR keyword like `support`, `survey`, `social`, `sales`
  (the agent knows where these live by convention or asks).
- **`--since=<YYYY-MM-DD>`** (optional) → filter to feedback after this
  date.

## Pre-flight

```bash
SRC="${1:?usage: /pm-feedback <input-source> [--since=<YYYY-MM-DD>]}"
[ -f "$SRC" ] && echo "FILE_OK" || echo "SOURCE_KEYWORD"
mkdir -p .great-pm/drafts
```

If `SOURCE_KEYWORD`, the agent will ask the user which file or stream
provides that source.

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

1. **feedback-synthesizer**
   - Brief: read the feedback batch. For each item:
     - Tag with JTBD (Jobs-to-be-done) it relates to.
     - Severity (blocker / pain / nice-to-have).
     - Sentiment (frustrated / neutral / delighted).
     - Verbatim quote (preserved).
   - Cluster by JTBD. For each cluster:
     - Theme name.
     - Frequency count.
     - Severity distribution.
     - Top 2 verbatim quotes.
     - 1-line synthesis of what users actually want (vs. what they asked).
   - Output: `.great-pm/drafts/feedback-synthesis-<YYYY-MM-DD>.md`.

2. Surface the **top 3 themes** as a one-screen executive summary.

3. Suggest follow-up: if any theme is high-severity + high-frequency,
   recommend `/pm-discover` with `--focus=<theme>` to dig deeper.

## Reporting

- **DONE**: `DONE: /pm-feedback — <N> items synthesized into <T> themes. Top theme: <name> (<count>, severity: <dist>). Output: <path>.`
- **BLOCKED**: source not found / not parsable. tried + failed_because + need.

## Notes

- Users describe symptoms; the synthesizer infers JTBD. Preserve the
  verbatim quotes — they keep you honest about whether the inference is
  fair.
- A single voice with a strong story is **not** a theme. Theme requires
  ≥3 distinct users.
