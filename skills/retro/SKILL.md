---
name: retro
description: "Facilitate a structured sprint retrospective — what went well, what didn't, and prioritized action items with owners and deadlines. Use when running a retrospective, reflecting on a sprint, creating action items from team feedback, or learning how to run effective retros."
---

> **Provenance.** Vendored from `phuryn/pm-skills@retro` (MIT, Paweł Huryn / Product Compass — github.com/phuryn/pm-skills). Adapted into great-pm 2026-05-29 with attribution. Host agent: pm-lead.

## Sprint Retrospective Facilitator

Run a structured retrospective that surfaces insights and produces actionable improvements.

### Context

You are facilitating a retrospective for **$ARGUMENTS**.

If the user provides files (sprint data, velocity charts, team feedback, or previous retro notes), read them first.

### Instructions

1. **Choose a retro format** based on context (or let the user pick):

   **Format A — Start / Stop / Continue**:
   - **Start**: What should we begin doing?
   - **Stop**: What should we stop doing?
   - **Continue**: What's working well that we should keep?

   **Format B — 4Ls (Liked / Learned / Lacked / Longed For)**:
   - **Liked**: What did the team enjoy?
   - **Learned**: What new knowledge was gained?
   - **Lacked**: What was missing?
   - **Longed For**: What do we wish we had?

   **Format C — Sailboat**:
   - **Wind (propels us)**: What's driving us forward?
   - **Anchor (holds us back)**: What's slowing us down?
   - **Rocks (risks)**: What dangers lie ahead?
   - **Island (goal)**: Where are we trying to get to?

2. **If the user provides raw feedback** (e.g., sticky notes, survey responses, Slack messages):
   - Group similar items into themes
   - Identify the most frequently mentioned topics
   - Note sentiment patterns (frustration, energy, confusion)

3. **Analyze the sprint performance**:
   - Sprint goal: achieved or not?
   - Velocity vs. commitment (over-committed? under-committed?)
   - Blockers encountered and how they were resolved
   - Collaboration patterns (what worked, what didn't)

4. **Generate prioritized action items**:

   | Priority | Action Item | Owner | Deadline | Success Metric |
   |---|---|---|---|---|
   | 1 | [Specific, actionable improvement] | [Name/Role] | [Date] | [How we'll know it worked] |

   - Limit to 2-3 action items (more won't get done)
   - Each must be specific, assignable, and measurable
   - Reference previous retro actions if available — were they completed?

5. **Create the retro summary**:
   ```
   ## Sprint [X] Retrospective — [Date]

   ### Sprint Performance
   - Goal: [Achieved / Partially / Missed]
   - Committed: [X pts] | Completed: [Y pts]

   ### Key Themes
   1. [Theme] — [summary]

   ### Action Items
   1. [Action] — [Owner] — [By date]

   ### Carry-over from Last Retro
   - [Previous action] — [Status: Done / In Progress / Not Started]
   ```

Save as markdown. Keep the tone constructive — the goal is improvement, not blame.

## The action-item batting average

A retro is only as good as the actions it generates *and closes*. The single most important number to open every retro with is the **batting average**: of the action items from the last retro, how many actually got done?

```
Batting average = (actions completed) / (actions committed last retro)
```

- **> 0.7** — healthy. Your retros are changing behavior.
- **0.3–0.7** — warning. You're generating actions faster than the team can absorb them. Cut to 1–2 next time.
- **< 0.3** — the retro is theater. **Stop adding new action items.** The topic of *this* retro is: "why don't our action items get done?" That is the only thing worth discussing until the average recovers.

If the batting average is low, surfacing it is itself the highest-value move — it converts a feel-good ritual back into a feedback loop. A carry-over that appears for the third consecutive retro is not an action item; it's a signal that either no one owns it, it's not actually important, or it's blocked by something the retro can't fix (escalate that).

## Worked example — Acme categorizer sprint retro

Context: a 2-week sprint to ship the Tamil/Telugu merchant-name normalization. Goal was "Tamil merchants categorize at parity with English." Shipped, but 4 days late.

```markdown
## Sprint 14 Retrospective — 2026-06-15

### Action-item batting average (from Sprint 13)
2 of 3 completed (0.67). Carry-over: "add a regression eval slice for
regional merchants" — NOT STARTED (3rd appearance → see Themes).

### Sprint Performance
- Goal: Partially — parity hit for Tamil, Telugu still 8% behind.
- Committed: 21 pts | Completed: 18 pts (3 pts slipped to Sprint 15)

### Format: Start / Stop / Continue
- **Start**: Writing the eval slice BEFORE the feature, not after.
- **Stop**: Treating "the Mac Mini worker was offline" as an
  acceptable excuse for missed categorization SLAs — it's a known risk
  we keep eating.
- **Continue**: Pairing on the normalization regexes — caught 3 bugs
  pre-merge.

### Key Themes
1. **The regression-eval action keeps dying.** Carried 3 sprints. Root
   cause: it has no owner with capacity, not low priority. → Assign and
   protect time, or explicitly drop it and stop carrying it.
2. **Worker downtime is a recurring tax**, not a one-off. → This is a
   pre-mortem topic, not a retro one (see cross-link).

### Action Items (capped at 2)
1. Write regional-merchant eval slice — Priya — by 2026-06-22 — success: slice runs in CI, fails if Tamil/Telugu parity drops >2%.
2. Spec a worker-offline fallback so categorization SLA holds — Arjun — by 2026-06-29 — success: queue drains within SLA even with worker down 1h.

### Carry-over from Last Retro
- Regression eval slice — NOT STARTED → promoted to Action #1 with a named owner and a hard date. If it slips again, we drop it.
```

Note what makes this work: the carry-over isn't silently re-listed — it's *diagnosed* (no owner, not low priority), and a recurring operational problem is *handed off* to the pre-mortem skill rather than re-litigated every two weeks.

## The 5 retro failure modes

❌ **Blame.** "QA missed it" / "Arjun's PR broke prod." The moment a retro names a culprit, people stop being honest and the data dries up. Frame around systems and decisions, not people: *"our pre-merge checks don't cover regional data"* — not *"Arjun forgot."* This is the analog of the pre-mortem's "no hand-waves" rule: specific about the *system*, never accusatory about the *person*.

❌ **Action-item theater.** Generating 8 earnest action items, assigning none of them a real owner or date, and feeling productive. Cap at 2–3, each with a name, a date, and a success metric. An action item without an owner is a wish.

❌ **Never-completed carry-overs.** The same item drifts from retro to retro. Track the batting average; a 3-time carry-over is a signal, not a task — diagnose *why* (no owner / not actually important / blocked elsewhere) and either fix the cause or kill it.

❌ **"We're fine."** A retro with only "Continue" items and no tension. Either the team is conflict-avoidant or not psychologically safe. Prompt specifically: "What almost went wrong?" / "What did we get lucky on?" Luck is a risk you haven't paid for yet.

❌ **No follow-through audit.** Running the retro but never checking whether last time's actions landed. Without the batting-average open, the retro is a venting session, not a feedback loop. This is the single most common reason retros quietly lose value.

## When NOT to run a retro

- **A one-person great-pm "team."** A solo operator looking *backward* over their own sprint mostly produces self-justification, not insight. The higher-value exercise for a solo operator is forward-looking: run a **`pre-mortem`** on the next initiative instead. (Retros need ≥2 perspectives the way pre-mortems need ≥3 — see the sibling skill.)
- **Retro fatigue / nothing changed.** If three consecutive retros produced no behavior change (batting average ≈ 0), don't run a fourth on autopilot. Run a *meta-retro* on the retro process itself, change the format, or pause the ritual until there's something real to inspect.
- **As a substitute for root-cause analysis.** A retro is for *patterns across a sprint*, not for dissecting a single production incident. A P0 outage needs a proper incident post-mortem / root-cause analysis with a timeline — don't let it get diluted into a "what went well / badly" round.
- **Mid-crisis.** Don't retro while the fire is burning. Stabilize, then retro once you can think instead of react.

## Retro vs pre-mortem — the sibling skills

These are the two halves of the same reflective discipline, pointed in opposite directions in time:

| | **`pre-mortem`** | **`retro`** (this skill) |
|---|---|---|
| Direction | Forward — *before* the build | Backward — *after* the sprint |
| Question | "Imagine this shipped and failed — why?" | "What actually happened, and what do we change?" |
| Output | Guardrails written into the plan | Action items with owners + dates |
| Cadence | At strategy and launch gates | Every sprint / cycle |
| Min participants | ≥3 (blind-spot coverage) | ≥2 |
| Discipline rule | Reject vague risks; rank L×S | Reject blame; track batting average |

The same operational risk often appears in both: a worker-downtime theme that *surfaces* in a retro should be *promoted forward* into the next pre-mortem so it becomes a guardrail rather than a recurring carry-over.

## Cross-links

- **`pre-mortem`** — the forward-looking sibling. For solo operators, or for any recurring risk a retro keeps surfacing, run the pre-mortem instead of / in addition to the retro. Hold both to the same specificity bar.
- **`pm-audit`** — the *structural* retro: where a sprint retro inspects one cycle's behavior, pm-audit inspects PM maturity across 15 dimensions. Use it when retros keep surfacing the same systemic gaps (no metrics, no discovery, etc.) — that's an audit finding, not a retro action item.
- **`metrics-design`** — every action item needs a success metric; borrow the leading/lagging discipline so "how we'll know it worked" isn't a vanity number.
- **`done-blocked`** — for tracking whether carry-over actions are actually Done vs Blocked between retros.
