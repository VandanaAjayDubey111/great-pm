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
9. **Required success metrics** — named, handed to metrics-architect.
10. **Definition of Done** — yes/no checklist.

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

## 5. Definition of Done — a yes/no checklist

- Code merged.
- Tests pass.
- AC #1, #2, #3 verified in staging.
- Tracking events firing per the metrics plan.
- Docs updated.
- (Item-specific items — never generic "feels right".)

## 6. Anti-patterns — ban these

- **TBD / TODO / "engineering decides" / "more later" / "similar to X"** —
  every one is a deferred decision the engineer will have to make for you.
  Kill them in self-edit.
- **Vague adjectives without numbers** — "user-friendly", "fast", "scalable",
  "reliable". Replace with a number or remove.
- **Solution buried in the Problem section** — keep Problem about the pain.
- **Acceptance criteria that cannot be tested** (yes/no rule).
- **No Non-goals section** — the silent scope-creep enabler.

## 7. Output shape

A PRD an engineer can build from without a single clarifying question. If
they ask a clarifying question, the PRD failed.
