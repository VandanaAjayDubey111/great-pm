---
name: user-research
description: Playbook for planning and synthesizing user research — research questions, JTBD framing, interview-guide design, problem validation, and the leading-question traps to avoid. Used by user-researcher in the Discover stage.
when_to_use: |
  Use when planning user discovery, designing an interview guide, running JTBD
  analysis, or deciding whether an assumed problem is real. Primarily for the
  user-researcher agent.
allowed-tools: Read, Write, WebSearch, WebFetch
---

# User Research — playbook

Good research kills bad ideas cheaply. The goal is not to confirm the assumed
problem — it is to find out whether the problem is real.

## Where this sits among great-pm skills

This is the **playbook layer** — how to plan, run, and synthesize research in a
great-pm cycle. It is deliberately thin on two things that have their own deep
skills:

- **For interview discipline** (how to ask without leading, the three rules, the
  ethical boundary) → use **`mom-test`**. This skill tells you *what* to find out;
  `mom-test` tells you *how to ask* so you get truth instead of politeness.
- **For synthesis structure** (the job/struggle/forces framing, scoring) → use
  **`jobs-to-be-done`**. Section 2 below is the lightweight JTBD entry point;
  `jobs-to-be-done` is the full operational model.

Downstream: validated opportunities feed **`opportunity-solution-tree`** (the
discovery structure) and **`circles-method`** (the Identify step). If you need to
size who is affected, hand off to `competitive-analysis` / `market-analyst`.

## 1. Frame the research question

Start from the assumed problem and turn it into questions that can be answered
with evidence, not opinion.
- Bad: "Would you use a feature that does X?" (hypothetical, leading)
- Good: "Tell me about the last time you needed to do X. What did you do?"

Research questions target past behaviour, not future intention. People are
poor predictors of their own future behaviour and good reporters of their past.

## 2. JTBD — Jobs To Be Done

For the problem space, name three things:
- **The job** — the progress the user is trying to make.
- **The trigger** — the situation that makes the job urgent.
- **The current alternative** — what they use instead today (including
  "nothing" or "a spreadsheet" — these are real competitors).

If you cannot name the current alternative, the problem may not be real — no
one is solving it because no one feels it.

## 3. Interview guide

- 5-8 open questions, ordered from broad to specific.
- Every question is about a real past episode.
- No feature pitches. No "would you like..." questions.
- End open: "What did I not ask that I should have?"

## 4. Problem validation rubric

After synthesis, classify the assumed problem:
- **Real** — multiple users describe the same pain, unprompted, with a real
  current workaround and real cost.
- **Mis-stated** — there is a pain, but it is not the one assumed; restate it.
- **Not real** — users do not recognise the problem, or it is trivial. Say so.

A "not real" verdict early saves the whole loop from building the wrong thing.

## 4a. Worked example — raw quote → JTBD reframe → verdict

Assumed problem (Acme): *"Users want a budgeting dashboard."*

**Raw quotes from 6 interviews:**
- U1: "End of the month I have no idea where the money went. I scroll my UPI
  history trying to remember what each ₹400 was."
- U3: "I keep a rough number in my head but it's always wrong by salary day."
- U4: "I tried two budgeting apps. I stopped because tagging every txn was a chore."
- U2/U5/U6: variations of the same — *reconstruction is painful, dashboards went unused.*

**JTBD reframe** (Section 2 lens):
- **Job:** "When the month ends, help me know where my money actually went, so I
  trust my own picture without manual work."
- **Trigger:** salary day / month-end reckoning.
- **Current alternative:** scrolling raw UPI history + mental math (and abandoned
  budgeting apps — the workaround *failed*, which is signal, not noise).

**Problem-validation verdict:** **Mis-stated.** The real, unprompted, multi-user
pain is *automatic categorization and trustworthy month-end recall* — not a
dashboard. A dashboard on top of un-categorized data reproduces the chore that
made U4 quit. Restated problem: *"reconstructing where the money went is manual
and error-prone."* This is exactly the problem Acme's auto-categorization
pipeline targets — the research redirected the bet from a UI feature to the
ingestion/categorization core.

Note the move: no single quote is a finding. The *pattern across 6, unprompted,
with a real failed workaround* is what turns "dashboard" into a falsifiable,
correctly-stated problem.

## 5. Honesty rules
- Never invent a user quote, persona, or number. If there is no real input,
  the output is "no evidence yet — here is the research plan to get it."
- Mark every finding **data-backed** (from real input) or **assumption**.
- One interview is an anecdote, not a finding. State how much evidence each
  conclusion rests on. For sample size, use the table below.

## 5a. Sample-size guidance by problem type

There is no universal "5 users is enough." The right N depends on how
homogeneous the population is and the cost of being wrong.

| Problem / population | Target N | Why |
|---|---|---|
| **B2B, narrow ICP** (one role, one workflow) | **5–8** | Homogeneous users repeat the same patterns fast; ~5 surfaces the bulk, 8 confirms. Beyond ~8 you mostly re-hear known themes. |
| **Consumer / heterogeneous** (varied segments, habits, geographies) | **8–12** | More variance → more interviews to separate a real pattern from one segment's quirk. Split across the segments you actually care about. |
| **Multiple distinct segments** | 5–8 **per segment**, not pooled | A pooled 10 that's really 2-per-5-segments tells you nothing per segment. |
| **Pure usability** (can they use it) | 5 per round | Nielsen: ~5 finds most usability defects; iterate rather than batch. |

Stop when you hit **saturation** — two or three consecutive interviews surface no
new theme. If new themes keep appearing at interview 8, the population is more
varied than assumed; widen N and re-segment rather than declaring a finding.

## 6. Leading-question traps to avoid
- Pitching the solution inside the question.
- Asking about the future ("would you", "will you", "could you see yourself").
- Asking yes/no questions where a story is what you need.
- Talking more than the user.
