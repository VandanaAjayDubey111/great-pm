---
name: impact-mapping
description: Build an Impact Map (Gojko Adzic) — a four-level tree connecting a measurable Goal → Actors (who can move it) → Impacts (behaviour changes we want from them) → Deliverables (what we could build). Use when tying features to business outcomes, exposing untested assumptions behind a roadmap, or deciding what NOT to build because it doesn't move the goal.
when_to_use: |
  Use when a roadmap or feature list exists but the line from "ship this" to
  "the metric moves" is fuzzy. Impact mapping makes every deliverable defend
  itself against a goal and an actor behaviour. Primarily for the
  product-strategist agent; pairs with metrics-design (for the goal) and
  prioritization-methods (for ranking deliverables).
allowed-tools: Read, Write
---

# Impact Mapping

A strategic-planning technique (Gojko Adzic, *Impact Mapping*) that prevents the
single most common roadmap failure: **building deliverables that don't actually
move the goal.** It does this by forcing every feature to trace back through an
actor and a behaviour change to a measurable goal — and by making the assumptions
in that chain explicit and testable.

An impact map is a mind-map with exactly four levels, answering four questions.

## The four levels

1. **Goal — WHY?**
   The measurable business objective. Must be a metric with a target and a
   deadline, not an activity. SMART. Examples: "Reach 5,000 weekly active users by
   Q3", "Cut onboarding drop-off from 60% to 30%."
   - Bad goal (an activity): "Launch the mobile app."
   - Good goal (an outcome): "20% of signups complete first upload within 24h."

2. **Actors — WHO?**
   The people/systems who can produce the desired effect — or obstruct it. Be
   specific: not "users" but "first-time uploaders", "returning power users",
   "the support team", "the recommender system". Include actors who could get in
   the way, not just help.

3. **Impacts — HOW?**
   The **behaviour changes** we want from each actor — how their actions should
   change to move the goal. Phrase as a change in what the actor *does*: "uploads
   a second statement", "shares the app with a friend", "stops abandoning at the
   password screen." Impacts can also be reductions in harmful behaviour.
   *This is the level teams skip — and it's the whole point.* A deliverable with
   no actor-behaviour-change behind it is a guess.

4. **Deliverables — WHAT?**
   What we could build or do to support an impact. Features, campaigns, copy
   changes, process changes. These sit at the **bottom**, not the top — they're
   the cheapest level to change and the least certain to matter. A deliverable is
   a hypothesis: "*we believe* this deliverable will cause this impact in this
   actor, which moves the goal."

## Why the direction matters

Most teams start at the deliverable ("build feature X") and rationalize upward.
Impact mapping forces top-down: goal first, then who can move it, then how their
behaviour must change, then — only last — what to build. The payoff:

- **Deliverables become optional.** If you can hit the impact a cheaper way, the
  expensive deliverable dies. The map is a map of *options*, not a plan.
- **Assumptions surface.** Each branch is an assumption you can test. The riskiest
  branch is where discovery/experiments should go first.
- **Scope shrinks honestly.** Branches that don't trace to the goal get cut
  without drama — they were never justified.

## Process

1. **Lock the goal.** One measurable goal with a target + deadline. If you can't
   measure it, fix it before continuing. (Use metrics-design if needed.)
2. **List actors.** Who can move this goal — helpers and blockers. Be specific.
3. **Name impacts per actor.** What behaviour change in this actor would move the
   goal? Multiple impacts per actor is fine. Phrase as changed behaviour.
4. **Brainstorm deliverables per impact.** What could cause that behaviour change?
   Keep them as candidates, not commitments.
5. **Annotate each branch with:**
   - **Assumption**: "We believe [deliverable] → [impact] in [actor] → [goal]."
   - **Confidence / evidence**: what tells us this is likely?
   - **Cost / effort** of the deliverable.
6. **Find the first bet.** The branch with highest goal-leverage × lowest cost ×
   testable-soonest is where to start. Mark assumptions to validate before
   committing.
7. **Render the map.** A hierarchical text tree:
   ```
   GOAL: [measurable goal + target + deadline]
   ├─ ACTOR: [specific actor]
   │   ├─ IMPACT: [behaviour change]
   │   │   ├─ DELIVERABLE: [thing] — assumption: … — confidence: … — cost: …
   │   │   └─ DELIVERABLE: …
   │   └─ IMPACT: …
   └─ ACTOR: …
   ```

## Anti-patterns to call out

- **Goal is an activity, not an outcome** → rewrite as a metric.
- **Jumping straight to deliverables** → no actor/impact behind a feature = a guess; flag it.
- **"Users" as the only actor** → too vague to design for; split into real roles.
- **Impacts written as features** ("add a button") → that's a deliverable; the
  impact is the behaviour the button is supposed to change.
- **Every branch equally confident** → it never is; force the confidence column.

## Relationship to other great-pm skills

- The **goal** should come from `metrics-design` (North Star / target metric).
- Deliverables, once mapped, feed `prioritization-methods` for ranking.
- `impact-mapping` is referenced as one of the 12 methods in `prioritization-methods`;
  this skill is the full operational playbook for it.

## Further reading

- Gojko Adzic, *Impact Mapping: Making a Big Impact with Software Products and Projects*
- impactmapping.org
