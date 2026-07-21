---
name: sprint-planning
description: Plan a sprint with capacity estimation, story selection against Definition of Ready, dependency mapping, and risk identification. Produces a sprint goal + committed-scope summary with a 15-20% buffer. Use when preparing sprint planning, estimating team capacity, selecting stories, or balancing scope against velocity.
when_to_use: |
  Use when sequencing a fixed-length build window across limited capacity — what
  fits, in what order, with which risks called out. Primarily for the pm-lead
  agent. Especially useful under a hard launch deadline where scope must be cut
  honestly rather than over-committed.
allowed-tools: Read, Write
---

> **Provenance.** Adapted from `phuryn/pm-skills@sprint-plan` (MIT License,
> Paweł Huryn / Product Compass — github.com/phuryn/pm-skills). Vendored into
> great-pm 2026-05-29 with great-pm-convention frontmatter. MIT permits commercial
> use with attribution; this header is the attribution.

# Sprint Planning

Plan a sprint by estimating capacity, selecting and sequencing stories, and
naming risks. The output is a committed scope the team can actually hit — not a
wish-list.

## Context

If the user provides backlogs, velocity data, team rosters, or previous sprint
reports, read them first.

## Instructions

1. **Estimate team capacity**
   - Members and availability (PTO, meetings, on-call).
   - Historical velocity (avg story points over the last 3 sprints).
   - **Reserve 15-20% buffer** for bugs, tech debt, and unexpected work.
   - Compute available capacity in points or ideal hours.

2. **Review and select stories**
   - Pull from the prioritized backlog, highest priority first.
   - Verify each meets Definition of Ready (clear AC, estimated, no blockers).
   - Flag stories needing refinement before they can be committed.
   - Stop adding when capacity is reached. Do not over-commit.

3. **Map dependencies**
   - Stories depending on other stories or external teams.
   - Sequence dependent stories; flag external dependencies + owners.
   - Identify the critical path.

4. **Identify risks and mitigations**
   - High-uncertainty / high-complexity stories.
   - External dependencies that could slip.
   - Knowledge concentration (only one person can do it).
   - Propose a mitigation for each risk.

5. **Sprint plan summary**
   ```
   Sprint Goal: [one sentence — what success looks like]
   Duration: [2 weeks / 1 week / …]
   Team Capacity: [X points]
   Committed: [Y points across Z stories]
   Buffer: [remaining]

   Stories:
   1. [title] — [points] — [owner] — [dependencies]
   ...

   Risks:
   - [risk] → [mitigation]
   ```

6. **Define the sprint goal** — a single clear sentence capturing the primary
   value the sprint delivers.

Think step by step. Save as markdown.

## When NOT to use sprint planning

- **Continuous-flow / continuous-deployment teams.** If work ships when ready and
  there is no fixed iteration, sprint planning imposes ceremony that buys nothing.
  Use WIP limits and a pull-based board (Kanban) instead — cycle time, not sprint
  commitment, is the unit of honesty.
- **No velocity history.** For the first 1–2 sprints of a new team or product
  there is no average to plan against. Don't fabricate a points target —
  timebox a small, explicit slice, measure what actually got done, and let the
  first real sprints *produce* the velocity baseline. Planning to a made-up
  number is worse than planning to none.
- **A genuine spike / research week.** When the work is "find out whether X is
  possible," outcomes are unknowable; commit to a timebox and a decision, not a
  story list.
- **Solo great-pm operator with a continuous backlog.** A one-person cadence is
  closer to flow than to sprints; reserve full planning for when there's a real
  team to coordinate.

## Pitfalls / failure modes

1. **Over-commit despite the buffer.** The 15–20% buffer gets quietly spent
   during planning ("we'll just fit one more"). Then carry-over, an incident, or
   a refinement gap eats it and the sprint misses. The buffer is not negotiable
   scope — if everything "fits" exactly to capacity, you have already
   over-committed. Plan *to capacity minus buffer*, full stop.
2. **Stretch-goal theatre.** A "stretch goal" that slips every single sprint is
   not a stretch goal — it's an honesty failure. Either it's real committed scope
   (then it counts against capacity) or it's next sprint's backlog (then don't
   list it). Recurring un-hit stretch goals train the team to treat the plan as
   fiction.
3. **Ignoring carry-over and on-call.** Unfinished work from last sprint and the
   on-call/support load are *real* capacity draws that planning routinely zeroes
   out. Carry-over is committed *before* new work is pulled; on-call time is
   subtracted from the assignee's availability up front, not discovered mid-sprint.
4. **"We'll catch up next sprint."** Treating a miss as a debt to repay later
   compounds — next sprint starts already behind and the same over-commit repeats.
   A miss is a signal to *lower* the next commitment, not to add the shortfall on
   top of a full plan.

## Worked example — Acme-scale sprint with capacity math and a cut

**Team:** 3 engineers (E1, E2, E3). 2-week sprint = 10 working days each.
**Velocity:** trailing 3-sprint average = 24 points.

**Capacity math (do this before touching the backlog):**
```
Raw capacity (velocity baseline) ............... 24 pts
− On-call this sprint (E3 on rotation, ~30%) ... −3 pts
− Carry-over from last sprint (PDF-parse bug) .. −5 pts  (committed first)
= Capacity for NEW work before buffer .......... 16 pts
− Buffer 18% (bugs / tech debt / surprises) .... −3 pts
= Available for new committed scope ............ 13 pts
```

**Candidate backlog (priority order, with estimates):**
1. Auto-categorize ingested transactions (Gate 1 exact-match) — **5 pts**
2. Month-end "where it went" digest (push + email) — **5 pts**
3. Dedup: flag Gmail-alert + CSV overlaps — **3 pts**
4. Read-only Gmail OAuth scope-explainer screen — **3 pts**

Running total if all four: 5+5+3+3 = **16 pts** against **13 available**.

**The cut.** Stories 1–3 = 13 pts, exactly the available scope. Story 4 (OAuth
explainer, 3 pts) **is cut to next sprint** — it's the lowest priority of the
four and depends on the OAuth flow that isn't yet on Definition of Ready, so it
would have carried over anyway. Cutting it now is honest; carrying it would
silently spend the buffer.

**Resulting plan summary:**
```
Sprint Goal: New users can see auto-categorized, de-duplicated spend and
             receive a trustworthy month-end recap.
Duration: 2 weeks
Team Capacity: 24 pts raw → 13 pts for new work (after on-call, carry-over, buffer)
Committed: 13 pts across 3 stories (+ 5-pt carry-over bug already counted)

Stories:
  0. [carry-over] PDF-parse bug — 5 pts — E1 — blocks nothing, finish first
  1. Auto-categorize at ingestion — 5 pts — E2 — bd-142
  2. Month-end digest — 5 pts — E1 — bd-143 — depends on (1) for categorized data
  3. Dedup Gmail+CSV overlap — 3 pts — E3 — bd-144

Cut: Gmail OAuth scope-explainer (3 pts) → next sprint (not DoR yet)

Risks:
  - Digest (story 2) depends on categorization (story 1) landing mid-sprint
    → sequence (1) first; if it slips, (2) ships with a stubbed category set.
  - E3 on-call may spike → dedup (story 3) is the designated drop if an incident
    consumes the buffer.
```

Note the discipline: the cut is named explicitly, carry-over is counted *first*,
on-call is subtracted up front, and the buffer has a pre-declared "what drops if
it's spent" answer.

## great-pm note

Sprint stories should map to beads issues (`bd`). When producing the committed
list, reference bd IDs where they exist so the plan stays the system-of-record's
view, not a parallel tracker.
