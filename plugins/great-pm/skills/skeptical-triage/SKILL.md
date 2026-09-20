---
name: skeptical-triage
description: "Reusable 3-round self-challenge + arbiter pattern for stress-testing a critical PM decision before it is finalized. Filters weak reasoning and false confidence from strategy, prioritization, spec, pricing, and gate decisions."
---

## Codex host binding

- Treat references to Claude slash workflows as the equivalently named Codex skill.
- Before delegating to any specialist, read the `great-pm-runtime` skill and the selected packaged role file.
- Treat "invoke", "assign", "delegate", "spawn", and source Agent-tool instructions as a required Codex `spawn_agent` call with that role and a bounded assignment.
- For the spawn tool's `task_name` or `agent_name` identifier, replace canonical role-name hyphens with underscores (`query-refiner-pm` → `query_refiner_pm`). Keep canonical names unchanged in prompts, filenames, verdict logs, and user-facing output; this is an internal identifier mapping, not a role rename.
- Store every returned agent identifier. Never call a wait tool until a spawn has returned an identifier, and wait only on identifiers returned by successful spawns.
- If `spawn_agent` is unavailable or a spawn fails, report BLOCKED; do not impersonate the specialist or wait on an empty agent set.
- Resolve bundled paths from the installed GreatPM plugin root.
- Ignore Claude-only model aliases, colors, turn limits, and tool allowlists.
- Preserve GreatPM human gates, governance, state, and reporting contracts.


# Skeptical Triage — for critical decisions

Three rounds of skeptical self-review + an impartial arbiter, with a confidence
score from the vote. Used by pm-reviewer (and any agent facing a contested
call) to make sure a decision is sound before it is finalized.

## The 4-step pattern

Run sequentially. Each round sees the prior rounds. The arbiter sees all rounds.

### Round 1 — Premise
Question: **is the premise true?**
The decision rests on an assumption — name it, then test it. "We should build X
because users want it" -> is "users want it" established (research, data) or
assumed? If the premise is unproven, lean WEAK.
Output: {round: 1, verdict: SOUND|WEAK|UNCERTAIN, reasoning, crux}

### Round 2 — Evidence
Question: **is the cited evidence real and sufficient?**
For every claimed benefit or demand, find the actual source. A number in a
draft is not evidence until you can point to where it came from (a survey, an
analytics export, a competitor's public data). If you cannot point to the
source, the claim is belief, not evidence — label it so.
Output: same shape, with evidence_checked: true/false

### Round 3 — Missed angles
Question: **what did Rounds 1-2 not consider?**
Second-order effects, the option nobody raised, the user segment not
represented, what happens if the decision is wrong. Add NEW evidence or concede
— do not rehash prior rounds.
Output: same shape

### Arbiter
Input: all 3 rounds + the original decision.
Deliver a single verdict — SOUND | WEAK (no UNCERTAIN — make the call) — a
one-sentence crux (the fact the verdict turns on), and the reasoning.

## Hard rules
1. **Absence of evidence -> WEAK, not UNCERTAIN.** "There is probably data
   somewhere" is not evidence.
2. **A stated benefit is not evidence.** "This will improve retention" needs a
   source or a testable mechanism — otherwise it is a belief; label it.
3. **Name the source or it does not exist.** Vague "market trends say..." does
   not count.
4. **A preference is not a flaw.** Disliking an approach is not the same as the
   approach being wrong. Separate taste from substance.
5. **Trust a genuinely sound decision.** If it holds up across 3 rounds, say
   SOUND — do not manufacture doubt.

## Confidence scoring
confidence = sound_rounds_before_arbiter / 3
- 100% (SSS) — arbiter rubber-stamps unless it finds something brand-new.
- 67% — majority sound; arbiter breaks the tie with new evidence.
- 33% / 0% — majority weak; arbiter usually confirms WEAK.
The arbiter overrides the final verdict; confidence reflects the round vote so
the human can see where the arbiter diverged.

## Output
Log to `.great-pm/triage-log.jsonl` (append-only, one JSON object per line):
timestamp, decision, the 3 rounds, the arbiter verdict + crux, confidence. This
log is how we measure whether triage earns its keep.

## Anti-patterns
- Triaging trivial / advisory points — triage is for decisions that matter.
- Letting rounds rehash each other — Round 3 must add new evidence or concede.
- Hiding an arbiter override — record both the vote confidence and the arbiter
  call so the human sees the disagreement.
