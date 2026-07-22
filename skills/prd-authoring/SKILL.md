---
name: prd-authoring
description: Playbook for writing build-ready PRDs — structure, user stories, acceptance criteria, scope vs non-goals, edge cases, and the anti-patterns that kill engineering velocity. Used by spec-writer (to author) and spec-reviewer (as the rubric).
when_to_use: |
  Use when authoring or reviewing a PRD. Primary for spec-writer; the rubric
  is also spec-reviewer's checklist.
allowed-tools: Read, Write
---

# PRD Authoring — playbook

A PRD is a contract. An engineer reads it and knows exactly what to build, how
to know it's done, and what is out of scope. Anything less is costly
back-and-forth.

## 1. Required sections (in order)

1. **Problem** — one sentence. The user pain, not the solution.
2. **Why now** — why this PRD this cycle, not later.
3. **Users + JTBD** — who, with what job, in what trigger.
4. **Solution overview** — 1–2 paragraphs. The shape, not every detail.
5. **User stories with Acceptance Criteria** — the meat.
6. **Scope** — what is IN this release.
7. **Non-goals** — what is OUT (the most useful section).
8. **Edge cases** — error, empty, limits, abuse.
9. **Top-3 risks (pre-mortem-lite)** — how this fails, one mitigation each.
10. **Open decisions** — every unresolved question: owner + answer-by + default.
11. **Required success metrics** — named, WITH a target and a guardrail.
12. **Definition of Done** — yes/no checklist.

Conditional 13th: **AI-feature appendix** — required whenever the feature
calls an LLM or model (see §8).

## 2. User stories — the format

`As <persona>, I want <capability>, so that <outcome>.`

Each story has Acceptance Criteria in Given / When / Then form:

> Given a logged-in user with no saved drafts,
> When they click "New",
> Then a blank editor opens and is autosaved within 2 seconds.

Acceptance criteria must be **testable** — convert to yes/no. "Quick" is not
testable; "within 2 seconds" is.

## 3. Non-goals — the most powerful section

For every feature, list what is explicitly NOT in this release. Examples:
- "Not in scope: bulk import."
- "Not in scope: mobile."
- "Not in scope: undo across sessions."

Non-goals prevent scope creep more than goals enable progress. If a non-goals
list is short or empty, the spec will silently grow during build.

## 4. Edge cases — the four categories

- **Error paths** — what if the network fails? the API returns 500? input is
  malformed?
- **Empty states** — first-run, no data, deleted-everything.
- **Limits** — max size, max count, rate limits.
- **Abuse cases** — what if a hostile user does this?

Listing edge cases up front catches ~60% of the rework engineering would do.

## 5. Top-3 risks — pre-mortem-lite

Ask: "Twelve months on, this failed. Why?" Write the top 3 answers, each with
one concrete mitigation (or an explicit "accepted — no mitigation").

- Risks must be about THIS feature. Generic risks ("users might not like it")
  are banned.
- A mitigation must change the plan or the spec. Restating hope ("we'll
  monitor closely") is not a mitigation.

## 6. Open decisions — the honesty section

Every question the PRD does NOT settle goes here — never silently omitted.

| Decision needed | Owner | Answer-by | Default-if-unanswered |
|---|---|---|---|

Rules:
- If the answer would flip scope or build order, it is a BLOCKER: file it to
  the Open-Decision Register (`bd` issue, label `open-decision`) and reference
  the issue id in the PRD.
- An empty Open-decisions section is a claim that everything is settled —
  spec-reviewer should treat that claim with suspicion.

This extends great-pm's core promise into Define: unknowns are tracked on the
record, never forgotten.

## 7. Success metrics — target + guardrail, not just names

Naming a metric is not enough. Each required metric carries:

- **Target** — a number + time window ("activation ≥ 40% within 7 days").
- **Guardrail** — the number that must NOT degrade ("support tickets per user
  must not rise > 5%").

Pre-committing targets prevents post-launch goalpost-moving. metrics-architect
still owns the full instrumentation spec; the PRD owns the commitment.

## 8. AI-feature appendix — required for model-backed features

If the feature calls an LLM or model, the PRD must include:

- **Failure modes** — the 3 most likely wrong outputs (hallucination, stale
  data, off-tone, over-refusal…).
- **Wrong-answer UX** — exactly what the user sees when the model fails:
  fallback copy, confidence cues, escalation path.
- **5 eval examples** — input → expected-output pairs an engineer can turn
  into tests before writing the feature.
- **Cost / latency budget** — max spend per call and the p95 latency the
  feature tolerates.

A model feature specced without this appendix is a demo, not a product.

## 9. Definition of Done — a yes/no checklist

- Code merged.
- Tests pass.
- AC #1, #2, #3 verified in staging.
- Tracking events firing per the metrics plan.
- Docs updated.
- (Item-specific items — never generic "feels right".)

## 10. Anti-patterns — ban these

- **TBD / TODO / "engineering decides" / "more later" / "similar to X"** —
  every one is a deferred decision the engineer will have to make for you.
  Kill them in self-edit.
- **Vague adjectives without numbers** — "user-friendly", "fast", "scalable",
  "reliable". Replace with a number or remove.
- **Solution buried in the Problem section** — keep Problem about the pain.
- **Acceptance criteria that cannot be tested** (yes/no rule).
- **No Non-goals section** — the silent scope-creep enabler.
- **Metrics named without targets** — "we'll track activation" defers the
  definition of success to after launch.
- **Unknowns hidden outside the PRD** — every open question lives in the
  Open-decisions section or it doesn't exist.
- **Model-backed feature without the AI appendix** — specs the happy path
  only; the wrong-answer path is the product.

## 11. Output shape

A PRD an engineer can build from without a single clarifying question. If
they ask a clarifying question, the PRD failed.
