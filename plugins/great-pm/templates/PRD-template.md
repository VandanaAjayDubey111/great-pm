# PRD — <feature name>

> Authored by `spec-writer`. Reviewed mechanically by `spec-reviewer` and strategically by `pm-reviewer`. Format per `skills/prd-authoring/SKILL.md`.

**Initiative slug:** <slug>
**Date:** <YYYY-MM-DD>
**Status:** DRAFT | REVIEWED | APPROVED | IN-BUILD | SHIPPED

---

## 1. Problem
<One sentence. The user pain — not the solution.>

## 2. Why now
<Why this PRD this cycle, not later.>

## 3. Users + JTBD
- **Who:** <persona — anchored in real Discover data>
- **Job:** <progress the user is trying to make>
- **Trigger:** <situation that makes the job urgent>
- **Current alternative:** <what they use instead today — including "nothing" or "a spreadsheet">

## 4. Solution overview
<1–2 paragraphs. The shape, not every detail.>

## 5. User stories with Acceptance Criteria

### Story 1
As **<persona>**, I want **<capability>**, so that **<outcome>**.

**Acceptance Criteria** (Given / When / Then — each one is yes/no testable):
- Given <state>, When <action>, Then <observable outcome>.
- Given <state>, When <action>, Then <observable outcome>.

### Story 2
*<repeat the structure>*

## 6. Scope
What is IN this release:
- <item>
- <item>

## 7. Non-goals
**What is explicitly NOT in this release** (the most useful section — prevents scope creep):
- <item>
- <item>
- <item>  ← at least 3, more is better

## 8. Edge cases
- **Error paths:** <network fail / API 500 / malformed input — and expected behavior>
- **Empty states:** <first-run / no data / deleted-everything>
- **Limits:** <max size / count / rate>
- **Abuse cases:** <hostile user does X>

## 9. Required success metrics
Handed to `metrics-architect` for the metrics plan:
- North Star this PRD affects: <name>
- New events needed: <list>
- Success threshold: <number, not adjective>

## 10. Definition of Done (yes/no checklist)
- [ ] Code merged
- [ ] Tests pass
- [ ] AC #1, #2, #3 verified in staging
- [ ] Tracking events firing per metrics plan
- [ ] Docs updated
- [ ] <feature-specific items>

---

> Reviewer notes:
> - Mechanical: `.great-pm/reviews/REVIEW-spec-<slug>.md`
> - Strategic: `.great-pm/reviews/REVIEW-pm-<slug>.md`
> - No TBD / TODO / "engineering decides" / vague adjectives without numbers.
