#!/usr/bin/env bash
# Seed a self-contained DEMO great-pm project ("Lumen — async standup") used for
# screenshots and trials. Contains only fictional data — no real project content.
# Usage: bash examples/seed-demo.sh   →   creates ~/great-pm-demo
set -e
DEMO="$HOME/great-pm-demo"
rm -rf "$DEMO"; mkdir -p "$DEMO"/.great-pm/{discover,strategize,prioritize,define,gates,reviews,advisor,research,verdicts,logs,drafts}
cd "$DEMO"
G=.great-pm

cat > $G/PROJECT.md <<'MD'
# Lumen — Public Beta

> Single source of truth for great-pm agents working on Lumen.
> Lumen is **async standup for distributed teams** — write your update once,
> the team reads on their own time. (Fictional sample project for great-pm demos.)

## Project
product: Lumen
archetype: b2b-saas
project_size: medium

## Phase
phase: building
loop_stage: define   # gate:strategy APPROVED; now specifying the beta backlog

## Team
team-size: 4
approval-level: gates-only

## Gate policy
gate-policy: explicit

## Cost model (demo)
llm-cost-per-run: 0.40
pm-rate-per-hr: 80
pm-hours-per-run: 3

## Boundaries
- Agents DRAFT and PROPOSE; the human passes the 3 gates.
MD

cat > $G/brain.md <<'MD'
# Lumen — shared synthesis

## 2026-06-18 | product-strategist | positioning
- Async-first beats meeting-replacement: teams want fewer meetings, not a nicer one.
- The wedge is the 30-second composer, not the dashboard. Lead with write speed.

## 2026-06-19 | prioritization-analyst | backlog
- Activation = "first standup posted in <48h of signup". Everything ranks against it.
MD

cat > $G/lessons.md <<'MD'
# Lessons — Lumen

- Standup-bot churn is a week-3 problem; instrument week-3 retention from day one.
- 3 design partners asked for SSO before the others — gate the beta on it, not v1.
MD

cat > $G/discover/discovery-brief-lumen.md <<'MD'
# Discovery Brief — Lumen async standup

## The job
"When my team is across 4 time zones, help me share progress without a 9am call,
so nobody blocks waiting on an answer."

## Who
Eng/product leads at 15–80 person distributed startups already living in Slack.

## Evidence (12 interviews)
- 10/12 run a standup bot; 7/12 have abandoned at least one. Reason: noise, not value.
- The moment of value is *reading* a teammate's blocker before it blocks you — not posting.

## Problem validation
Real. Teams pay for Geekbot/Standuply but complain about the same two things:
rigid prompts and a firehose digest nobody reads.

## Open questions
- Is the buyer the eng lead or the team? (affects pricing)
- Slack-first or web-first for the beta?
MD

cat > $G/discover/competitive-scan-lumen.md <<'MD'
# Competitive scan — Geekbot · Standuply · Polly

| Tool | Strength | Where they leak |
|---|---|---|
| Geekbot | Simple, cheap, Slack-native | Rigid prompts; digest fatigue |
| Standuply | Powerful, integrations | Heavy setup; overkill for small teams |
| Polly | Polished surveys | Not standup-shaped; no blocker model |

## Gap Lumen takes
A first-class **blocker graph** (who's waiting on whom) + a 30-second composer.
None of the three model "I'm blocked by X" as a first-class object.
MD

cat > $G/strategize/positioning-thesis-lumen.md <<'MD'
# Positioning thesis — Lumen

**For** distributed eng/product teams drowning in standup-bot noise,
**Lumen** is an async standup that surfaces *blockers*, not status,
**unlike** Geekbot/Standuply which dump an unread digest.

## The bet (falsifiable)
If we lead with the blocker graph + 30s composer, week-3 retention beats the
category's ~35%. Kill criterion: <35% week-3 retention across the beta cohort.
MD

cat > $G/prioritize/ranked-backlog-lumen.md <<'MD'
# RICE-ranked beta backlog — Lumen

| # | Item | RICE | Why |
|---|---|---|---|
| 1 | Async standup composer (MVP) | 96 | The core write surface |
| 2 | Activation funnel instrumentation | 80 | Can't improve what we can't see |
| 3 | Blocker graph v1 | 72 | The differentiator |
| 4 | Weekly digest email | 40 | Re-entry without nagging |
| 5 | Jira / Linear blocker sync | 24 | Later — power users |
MD

cat > $G/prioritize/roadmap-lumen.md <<'MD'
# Roadmap — Lumen Public Beta (Now / Next / Later)

| Field | Value |
|---|---|
| Initiative | lumen-public-beta |
| Stage | Define |
| Window | 6 weeks to public beta |
| Status | DRAFT — awaiting gate:spec |

## NOW — weeks 1–2 (the write surface)
- **Async standup composer MVP** — write an update in under 30 seconds
- **Activation funnel instrumentation** — measure first-standup-in-48h

## NEXT — weeks 3–4 (the beta cohort)
- Onboard the **50-team beta cohort**
- **Weekly digest email** — re-entry without nagging
- **Slack app submission** + review

## LATER — weeks 5–6 (depth)
- **Blocker graph v1** — who's waiting on whom
- Jira / Linear blocker sync
- Optional mood check-in

## Watch-items
- Slack app review can take 1–3 weeks — submit by week 3 or the beta slips.
- SSO required by 3 design partners — confirm scope before cohort invites.
MD

cat > $G/define/PRD-async-standup-composer.md <<'MD'
# PRD — Async Standup Composer (MVP)

## Problem
Posting a standup today takes too long and the prompts feel like a form.

## Goal
A teammate writes a useful update in **under 30 seconds**, and a reader finds the
**blockers** in **under 10 seconds**.

## User stories
- As a teammate, I write Yesterday / Today / Blockers in one keyboard-only flow.
- As a reader, I see only the blockers across my team, newest first.
- As a lead, I see who has not posted today (no public shaming).

## Non-goals
- No mood surveys, no analytics dashboard (later).

## Acceptance criteria
- Composer submits with Enter; no mouse required.
- A blocker becomes a first-class object linkable to a person.
- Activation event fires on first successful post.
MD

cat > $G/define/REVIEW-composer-prd.md <<'MD'
# spec-reviewer — REVIEW of the Composer PRD

Verdict: **READY-WITH-CHANGES** · 1 P0 · 2 P1

- **P0** — "useful update" is undefined. Add a measurable definition before build.
- P1 — keyboard flow needs an explicit empty/error state.
- P1 — activation event needs a name + properties for instrumentation.
MD

cat > $G/advisor/external-read-lumen.md <<'MD'
# External PM Read — Lumen (pm-advisor)

**The bet, in one line:** that a blocker-first async standup retains where status-first
bots churn.

**Compelling:** the blocker graph is a real wedge none of the incumbents model.
**Worries most:** week-3 retention is the whole game and the beta must measure it from
day one, not at the end. **Pitch-meeting question:** "what did a team do in week 3 that
a Geekbot team wouldn't?" **Verdict:** Not-yet — flips on a pre-registered week-3
retention target for the cohort.
MD

cat > $G/gates/gate-strategy-lumen.md <<'MD'
# gate:strategy — Lumen public beta

Status: APPROVED (2026-06-17).
Package: positioning thesis + RICE backlog + Now/Next/Later roadmap.
pm-reviewer verdict: PASS · must_fix=0 · 1 suggestion (instrument week-3 retention).
MD

# ── verdict logs (drive Logs / Agents / Metrics / cost) ──────────────────────
v(){ printf '%s | %s | %s | %s\n' "$1" "$2" "$3" "$4" >> "$G/verdicts/$2.log"; }
v 2026-06-15T10:02:00Z user-researcher       DONE "initiative=lumen-public-beta artefact=.great-pm/discover/discovery-brief-lumen.md"
v 2026-06-15T11:14:00Z market-analyst        DONE "initiative=lumen-public-beta artefact=.great-pm/discover/competitive-scan-lumen.md"
v 2026-06-15T12:40:00Z feedback-synthesizer  DONE "initiative=lumen-public-beta themes=6"
v 2026-06-16T09:20:00Z product-strategist    DONE "initiative=lumen-public-beta artefact=.great-pm/strategize/positioning-thesis-lumen.md"
v 2026-06-16T14:05:00Z pricing-strategist    DONE "initiative=lumen-public-beta models=2"
v 2026-06-17T10:11:00Z prioritization-analyst DONE "initiative=lumen-public-beta artefact=.great-pm/prioritize/ranked-backlog-lumen.md"
v 2026-06-17T10:48:00Z roadmap-planner       DONE "initiative=lumen-public-beta columns=now/next/later"
v 2026-06-17T15:30:00Z pm-reviewer           DONE "gate=strategy verdict=PASS must_fix=0 suggestions=1"
v 2026-06-18T09:05:00Z spec-writer           DONE "artefact=.great-pm/define/PRD-async-standup-composer.md"
v 2026-06-18T16:22:00Z spec-reviewer         DONE "artefact=.great-pm/define/REVIEW-composer-prd.md verdict=READY-WITH-CHANGES p0=1 p1=2"
v 2026-06-19T11:00:00Z pm-advisor            DONE "subject=lumen-public-beta verdict=Not-yet top_risk=week-3-retention-untested"
v 2026-06-19T11:45:00Z devils-advocate       DONE "blocking=2 advisory=1 filed=2"
v 2026-06-14T13:00:00Z market-analyst        BLOCKED "need=access-to-category-pricing-data"

# ── beads store ──────────────────────────────────────────────────────────────
bd init --prefix lumen >/dev/null 2>&1 || true
cat > .beads/seed.jsonl <<'JSONL'
{"_type":"issue","title":"User interviews — 12 standup-pain sessions","description":"12 interviews with eng/product leads at distributed startups. 10/12 run a standup bot; 7/12 abandoned one.","status":"closed","priority":1,"issue_type":"task","labels":["stage-discover","agent-user-researcher"]}
{"_type":"issue","title":"Competitive scan — Geekbot · Standuply · Polly","description":"Where the incumbents leak: rigid prompts + unread digests. None model blockers as first-class.","status":"closed","priority":1,"issue_type":"task","labels":["stage-discover","agent-market-analyst"]}
{"_type":"issue","title":"JTBD synthesis — why teams abandon standup bots","status":"closed","priority":1,"issue_type":"task","labels":["stage-discover","agent-user-researcher"]}
{"_type":"issue","title":"Feedback themes from 40 support tickets","status":"closed","priority":2,"issue_type":"task","labels":["stage-discover","agent-feedback-synthesizer"]}
{"_type":"issue","title":"Positioning thesis — async-first vs meeting-replacement","status":"closed","priority":1,"issue_type":"task","labels":["stage-strategize","agent-product-strategist"]}
{"_type":"issue","title":"Pricing model — per-seat vs flat-team","status":"closed","priority":2,"issue_type":"task","labels":["stage-strategize","agent-pricing-strategist"]}
{"_type":"issue","title":"RICE-ranked beta backlog","status":"closed","priority":1,"issue_type":"task","labels":["stage-prioritize","agent-prioritization-analyst"]}
{"_type":"issue","title":"Now / Next / Later roadmap","status":"closed","priority":1,"issue_type":"task","labels":["stage-prioritize","agent-roadmap-planner"]}
{"_type":"issue","title":"gate:strategy — Lumen public beta","description":"Gate package: positioning + backlog + roadmap. pm-reviewer PASS, 1 suggestion.","status":"closed","priority":0,"issue_type":"task","labels":["gate","stage-prioritize"]}
{"_type":"issue","title":"PRD — async standup composer","description":"Write a useful update in <30s; read blockers in <10s.","status":"in_progress","priority":0,"issue_type":"task","labels":["stage-define","agent-spec-writer"]}
{"_type":"issue","title":"Spec review — composer PRD","status":"open","priority":1,"issue_type":"task","labels":["stage-define","agent-spec-reviewer"]}
{"_type":"issue","title":"gate:spec — composer PRD ready for build","description":"Pending: PRD has 1 P0 (define 'useful update') before it can pass.","status":"open","priority":0,"issue_type":"task","labels":["gate","stage-define"]}
{"_type":"issue","title":"Build async standup composer (MVP)","status":"in_progress","priority":1,"issue_type":"task","labels":["stage-define"]}
{"_type":"issue","title":"Instrument activation funnel (first-standup-in-48h)","status":"open","priority":1,"issue_type":"task","labels":["stage-define"]}
{"_type":"issue","title":"DECISION NEEDED: Slack-first or web-first for the beta?","description":"Blocks: cohort onboarding flow. Default-if-unanswered: Slack-first. Raised-by: devils-advocate.","status":"open","priority":0,"issue_type":"task","labels":["open-decision"]}
{"_type":"issue","title":"DECISION NEEDED: free-tier limits — seats or history?","description":"Blocks: pricing page + signup. Raised-by: pricing-strategist.","status":"open","priority":0,"issue_type":"task","labels":["open-decision"]}
{"_type":"issue","title":"DECISION NEEDED: require SSO for the 3 design partners before beta?","status":"open","priority":2,"issue_type":"task","labels":["open-decision"]}
{"_type":"issue","title":"P0 — finalize the 50-team beta cohort","status":"open","priority":0,"issue_type":"task","labels":[]}
{"_type":"issue","title":"P0 BLOCKER: Slack app review submitted — awaiting approval","status":"blocked","priority":0,"issue_type":"task","labels":[]}
{"_type":"issue","title":"Weekly digest email — team summary","status":"open","priority":2,"issue_type":"task","labels":[]}
{"_type":"issue","title":"Blocker graph v1 — who's waiting on whom","status":"open","priority":2,"issue_type":"feature","labels":[]}
{"_type":"issue","title":"Jira / Linear blocker sync","status":"open","priority":3,"issue_type":"feature","labels":[]}
{"_type":"issue","title":"Optional mood check-in field","status":"open","priority":3,"issue_type":"feature","labels":[]}
{"_type":"issue","title":"Onboarding flow v1","status":"closed","priority":1,"issue_type":"task","labels":[]}
{"_type":"issue","title":"Workspace settings page","status":"closed","priority":2,"issue_type":"task","labels":[]}
{"_type":"issue","title":"Auth + workspace creation","status":"closed","priority":1,"issue_type":"task","labels":[]}
JSONL
bd import .beads/seed.jsonl >/dev/null 2>&1
echo "✓ demo project seeded at $DEMO"
echo "  issues: $(bd list --all --include-gates --limit 0 --json 2>/dev/null | python3 -c 'import sys,json;print(len(json.load(sys.stdin)))')"
echo "  artifacts: $(find $G -name '*.md' | wc -l | tr -d ' ') md · verdict logs: $(ls $G/verdicts/*.log | wc -l | tr -d ' ')"
