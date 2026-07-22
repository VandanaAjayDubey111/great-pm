---
name: pr-authoring
description: Playbook for deployment-aware pull requests — the 11-section format that turns a PR into a reviewable contract; why, decision requested, change map, review order, evidence, verification, risk, rollback. Used for the Define→build handoff and any PR a great-pm-driven project opens.
when_to_use: |
  Use when authoring or reviewing ANY pull request — especially the handoff
  from gate:spec to engineering and any launch-affecting change.
  `.github/PULL_REQUEST_TEMPLATE.md` is the fill-in skeleton; this file is
  the rubric.
allowed-tools: Read, Write
---

# PR Authoring — playbook

A PR is a contract with the reviewer, exactly as a PRD is a contract with
engineering. The reviewer must understand what happened, what they are
approving, what could go wrong, and how to undo it — **without opening the
diff or the chat history**.

Format adopted 2026-07-22 from the Symphony engineering-handoff pattern
(ajayd942/cloudflare-ai-event-concierge#4). When starting a new product repo,
copy `.github/PULL_REQUEST_TEMPLATE.md` from great-pm into that repo's
`.github/` so GitHub auto-fills every new PR with this skeleton.

## 1. Required sections (in order)

1. **Reviewer summary** — three subsections: **Why** (the gap this PR
   addresses), **Outcome** (what it delivers), **Out of scope** (what it
   deliberately does NOT include — code, secrets, deployment, config).
2. **Decision requested** — exactly what approving means, what happens after
   merge, and what approval does **NOT** authorize.
3. **Tracking and design context** — links to the tracker issue, the upstream
   approved artifacts (PRD, strategy doc, ADRs), and the decision IDs this
   change traces to.
4. **Change map** — table: Area | What changed | Why it changed.
5. **Suggested review order** — table: Step | File or artifact | What to
   verify. Ordered by risk, highest first.
6. **Acceptance criteria and evidence** — table: Criterion | Implementation |
   Evidence. Every criterion from the spec maps to proof.
7. **Verification performed** — table: Check | Result. Real commands and real
   output, not "tested locally". Screenshot/video for UI changes; an explicit
   "not applicable because…" otherwise.
8. **Risk and impact** — table over five fixed dimensions: Security,
   Privacy/data, Cost, Operations/observability, Compatibility. "No change"
   is a valid entry but must be stated, never implied by omission.
9. **Limitations and follow-up** — what this PR honestly does not solve, and
   the follow-up issues filed for it.
10. **Rollback** — the exact undo path BOTH before merge (close the PR) and
    after merge (revert commit + what to verify). "No rollback applies" must
    be justified, never assumed.
11. **Handoff checklist** — the checkbox list from the template, checked only
    after actually doing each check.

## 2. Rules

- **The title states the outcome, not the activity.** "Define the event
  concierge product requirements", not "Update docs".
- **Decision requested is the deployment gate.** It must name what approval
  does NOT authorize (deployment, secret handling, spend, production config) —
  this is how the human stays the boss of the pipeline.
- **Targets vs results honesty.** Every number is labeled either an approved
  target or a measured result. Claiming a target as a result is the
  fastest way to lose reviewer trust.
- **Review order starts with the highest-risk contract**, not with the
  easiest file.
- **Evidence over assertion.** "Sensitive-value scan: 6 pattern classes,
  0 hits" beats "no secrets included".
- **The checklist is a verification log, not decoration.** Checking a box
  without doing the check is a false statement to the reviewer.

## 3. Why this format helps deployment understanding

The PR carries the deployment story end to end: what approval authorizes →
what was verified → what the risks are → how to roll back. A user following
great-pm's loop reads spec → build PR → review → merge → deploy and at every
step knows exactly what has and has not happened. Nothing rides on memory or
chat scroll.

## 4. Anti-patterns — ban these

- **"Misc fixes" / "Update files" titles** — outcome-free titles force the
  reviewer to reverse-engineer intent.
- **Summaries that assume the reviewer read the issue/chat** — the PR must
  stand alone.
- **Unlabeled numbers** — implying measured results that are actually hopes.
- **Empty or missing Risk / Rollback sections** — the two sections that
  matter most in an incident are the two most often skipped.
- **Out-of-scope creep** — the Out-of-scope section exists so small "while
  I was here" changes don't ride along unreviewed.
- **Checked boxes, unchecked work** — see Rule above.

## 5. Output shape

A PR the reviewer can approve without opening the diff, and an operator can
roll back without asking anyone. If the reviewer asks "what does merging this
actually do?", the PR failed.
