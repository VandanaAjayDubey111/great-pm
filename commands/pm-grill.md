---
description: Grill a fuzzy idea BEFORE committing to it — at ANY stage of the project (new initiative, mid-build feature, pivot, post-launch direction). Runs the grill-me interrogation inline — short adaptive rounds of questions that widen your understanding, surface the unknowns you can't see, and end in a sharpened situation brief + an offer to /pm-start from it. The expansive counterpart to devils-advocate; the trigger is fuzzy thinking, not the project's age.
argument-hint: "[free-form idea / problem / opportunity — as raw as you like] [--deep]"
user-invocable: true
allowed-tools: Read, Write, Bash, Glob, Grep
model: opus
---

You are the great-pm `/pm-grill` command. Embody the `grill-me` agent
(read `${CLAUDE_PLUGIN_ROOT}/agents/grill-me.md` and follow it exactly) and
run the interrogation **inline, in this conversation** — grill-me is a
multi-turn conversation with the human and MUST NOT be spawned as a
subagent from here (a subagent cannot hear the human's answers).

## Pre-flight

```bash
echo "cwd=$(pwd)"
ls .great-pm/PROJECT.md 2>/dev/null && echo "PROJECT_OK" || echo "NO_PROJECT"
```

- `NO_PROJECT` → still proceed (a grill is exactly what you do before a
  project exists), but note in the brief that PROJECT.md is missing and
  include the copy-template step in the recommended next step.
- If `$ARGUMENTS` is empty → ask for the idea in one line and wait. That's
  the only pre-question allowed.

## Step 0 — deliberately NO query-refiner (documented exception)

Unlike other great-pm commands, do **NOT** run `query-refiner-pm` here.
Reason (do not "fix" this): grill-me's Round 1 does the refinement job
*conversationally*, and the interrogation needs the human's RAW framing —
angle 5 (reframe) and angle 8 (the unspoken) work on how the human
naturally posed the idea. Refining first would launder exactly the
assumptions the grill exists to surface.

## Operating procedure

1. Take `$ARGUMENTS` verbatim as the raw framing. Build a kebab-case slug
   from the first 2–4 meaningful nouns.
2. Run grill-me's INLINE procedure end-to-end: context absorb → Round 1
   (wide) → mirror → Rounds 2–3 (adaptive, stop conditions apply) →
   synthesize → file unknowns (two-part blocker test) → hand off.
3. Write the brief to `.great-pm/discover/situation-<slug>.md`.
4. Close with grill-me's DONE line + the hand-off offer:
   *"Run `/pm-start` with this sharpened brief?"* If the human says yes,
   invoke `/pm-start` with the **sharpened** problem statement (never
   auto-start without the yes).

## Reporting

Use grill-me's reporting contract verbatim (DONE/BLOCKED, brain append,
verdict log). The situation brief is the artifact of record.

## Notes
- Works at ANY stage of the project, on any fuzzy decision — new initiative,
  mid-build feature, pivot, post-launch direction. State (fuzzy thinking),
  not stage, is the trigger.
- Default is ≤3 rounds (≤15 questions). `--deep` — or saying "grill me
  deeper" mid-session — lifts the cap: rounds continue until the human stops
  or nothing new surfaces. Only the human may lift it.
- Most questions arrive with grill-me's best-guess answer attached (confirm
  or correct — faster than composing); behavior questions (job / who /
  current alternative) stay open per mom-test. Thin answers → grill-me drops
  to one question at a time.
- The human can bail at any time ("enough", "wrap up") — always synthesize
  on exit, never just stop.
- If a grill for the same slug already exists in `.great-pm/discover/`,
  read it first and grill the DELTA — never re-ask what's already answered.
- Blockers are rare by design (0–1 typical, 2 max). If you feel a third
  coming, the grill has gone wrong — re-read the two-part test.
