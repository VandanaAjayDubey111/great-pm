---
name: pr-review
description: Playbook for reviewing pull requests — verdict format, verification-not-trust, severity-ranked findings with concrete fixes, risk acceptance on the record. The reviewer-side counterpart of pr-authoring.
when_to_use: |
  Use when reviewing ANY pull request, or when acting as the human's prep
  for a review. pr-authoring defines what the author owes the reviewer;
  this defines what the reviewer owes back.
allowed-tools: Read, Write
---

# PR Review — playbook

A review is not an opinion; it is a verification with a verdict. The author
owed you an evidence-backed PR (per `pr-authoring`); you owe back a review
that says what you checked, what you found, and exactly what it takes to
get to APPROVE.

## 1. Review output format (in order)

1. **Verdict** — one of:
   - **APPROVE** — mergeable as-is.
   - **APPROVE-WITH-NITS** — mergeable; nits listed, author's call.
   - **REQUEST-CHANGES** — not mergeable; the exact path to APPROVE is
     listed. A REQUEST-CHANGES without that path is a stall, not a review.
   - **BLOCKED** — a question outside this PR must be answered first
     (file it as a ticket / open decision; link it).
2. **What I verified** — table: Claim in PR | How I checked | Result.
   Re-run at least the highest-risk verification the author claims, and
   spot-check at least two checklist boxes. Trust is not a review method.
3. **Findings** — table: Severity | Location | Issue | Concrete fix.
   Severity levels:
   - **Blocker** — merging causes harm (bug, security, data, broken
     contract). Ship-stoppers only.
   - **Major** — wrong but not dangerous; fix before or immediately after
     merge, reviewer states which.
   - **Minor** — should fix; does not gate merge.
   - **Nit** — style/preference; author may ignore.
4. **Questions** — genuine questions are not findings; keep them separate
   so they don't inflate the change request.
5. **Risk acceptance** — if approving despite a known risk, say so on the
   record: "approving with X risk accepted because Y". Silent risk
   acceptance is how incidents lose their audit trail.
6. **Post-merge watch** — what to monitor after deploy, for how long, and
   the rollback trigger ("error rate > N% in first hour → revert per the
   PR's Rollback section").

## 2. Rules

- **Follow the PR's Suggested review order** — the author ranked by risk;
  start there, not at the easiest file.
- **Verify, don't trust** — the Verification table in the PR is the
  author's claim; your "What I verified" table is the check on it.
- **Severity honesty** — inflating a nit to a blocker burns trust exactly
  like claiming a target as a result. Blockers are ship-stoppers only.
- **Every REQUEST-CHANGES names the exact path to APPROVE** — finite,
  concrete, no moving goalposts on re-review.
- **Critique the work, never the author** — "this query is unbounded"
  not "you always forget limits".
- **Scope discipline** — re-litigating approved scope belongs upstream
  (file a ticket); "while you're here" expansions are banned in both
  directions.

## 3. Anti-patterns — ban these

- **"LGTM" with no verification statement** — an approval that checked
  nothing is a rubber stamp, and the audit trail records it as one.
- **Nit storms** — twenty style comments burying one real blocker.
- **Goalpost creep** — new demands on re-review that weren't in the first
  review's path-to-APPROVE.
- **Drive-by scope expansion** — the review is not the place to grow the
  ticket.
- **Silent risk acceptance** — approving around a known risk without
  writing it down.

## 4. Output shape

A review the author can act on without a follow-up meeting, and an audit
trail that shows what was actually verified before merge. If the author
asks "so what do I need to change to get this approved?", the review
failed.
