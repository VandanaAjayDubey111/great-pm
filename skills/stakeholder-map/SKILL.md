---
name: stakeholder-map
description: "Build a stakeholder map using a power/interest grid, identify communication strategies per quadrant, and generate a communication plan. Use when managing stakeholders, preparing for a launch, aligning cross-functional teams, or planning stakeholder engagement."
when_to_use: |
  Use when a decision or launch needs people outside your direct control to
  say yes (or to not say no) — pricing changes, launches, cross-functional
  rollouts, anything that touches legal/finance/support. The map tells you who
  to involve, how often, and in what tone. Primarily for the stakeholder-comms
  agent; pairs with pre-mortem (who could kill this), skeptical-triage (whose
  objections are real), and circles-method (the Identify step).
allowed-tools: Read, Write
---

> **Provenance.** Vendored from `phuryn/pm-skills@stakeholder-map` (MIT, Paweł Huryn / Product Compass — github.com/phuryn/pm-skills). Adapted into great-pm 2026-05-29 with attribution. Host agent: stakeholder-comms.

## Stakeholder Mapping & Communication Plan

Map stakeholders on a Power × Interest grid and create a tailored communication plan for each group.

### Context

You are helping build a stakeholder map for **$ARGUMENTS**.

If the user provides files (org charts, project briefs, team rosters), read them first. If they describe the product or initiative, use that context to infer likely stakeholders.

### Instructions

1. **Identify stakeholders**: List all relevant individuals and groups — executives, engineering leads, designers, marketing, sales, support, legal, finance, external partners, and end users.

2. **Classify each stakeholder** on two dimensions:
   - **Power** (High/Low): Their ability to influence decisions, resources, or outcomes
   - **Interest** (High/Low): How much the project directly affects them or how engaged they are

3. **Place stakeholders in the Power × Interest grid**:

   | | High Interest | Low Interest |
   |---|---|---|
   | **High Power** | **Manage Closely** — Regular 1:1s, involve in decisions, seek their input early | **Keep Satisfied** — Periodic updates, escalate only critical issues |
   | **Low Power** | **Keep Informed** — Regular status updates, invite to demos, gather feedback | **Monitor** — Light-touch updates, available on request |

4. **For each quadrant**, recommend:
   - Communication frequency (daily, weekly, bi-weekly, monthly)
   - Communication format (1:1, email, Slack, meeting, dashboard)
   - Key messages and framing
   - Potential risks if this stakeholder is neglected

5. **Create a communication plan table**:

   | Stakeholder | Role | Power | Interest | Strategy | Frequency | Channel | Key Message |
   |---|---|---|---|---|---|---|---|

6. **Flag potential conflicts**: Identify stakeholders with competing interests and suggest alignment strategies.

Think step by step. Save the stakeholder map as a markdown document.

### The anti-stakeholder prompt (do this before the grid)

Before mapping helpers, run the inversion: **Who could kill this — and what do
they need to not kill it?** Most launch failures are not caused by the people
you forgot to inform; they are caused by one person with veto power whose
specific objection you never surfaced. For each potential blocker write:

- Their veto lever (legal hold, budget freeze, security sign-off, exec "not now").
- The exact concern behind it (not "legal is slow" — *what* are they protecting against?).
- The smallest thing that turns the veto into a yes (a data-residency answer, a rollback plan, a one-line carve-out).

A blocker you have pre-empted is worth more than ten supporters you have updated.

### Stakeholders move — re-map at every gate

Quadrant placement is **not static**. Interest spikes the moment a team is
affected: a finance lead who was Low Interest in discovery becomes High Interest
the week pricing changes hit their forecast. Re-run the grid at every stage gate
(strategy → spec → launch). A stakeholder who slid from "Monitor" to "Manage
Closely" without you noticing is how a launch gets blocked at the last meeting.

## Worked example — Acme pricing change (Indian consumer fintech)

**Context.** Acme.ai is moving its July 1 alpha from "free for everyone" to a
₹0 free tier + ₹149/mo Pro tier (auto-categorization beyond 100 txns/mo,
multi-account sync). Eight stakeholders must align for this to land. Founder is
solo on product; the rest are part-time, advisory, or external.

**Step 1 — Identify & classify.**

| Stakeholder | Role | Power | Interest | Quadrant |
|---|---|---|---|---|
| Founder (you) | Owns product + pricing | High | High | Manage Closely (it's you) |
| Lead engineer (contract) | Ships the paywall + billing | High | High | Manage Closely |
| Razorpay/billing partner | Provides UPI + card rails | High | Low | Keep Satisfied |
| Existing 40 alpha users | Were promised "free" | Low | High | Keep Informed |
| Beta WhatsApp community | Word-of-mouth channel | Low | High | Keep Informed |
| Angel investor | Funds runway; wants ARR signal | High | Low | Keep Satisfied |
| Legal advisor (DPDP/RBI) | Reviews pricing + auto-debit consent | High | Low | Keep Satisfied → **blocker** |
| App Store / Play review | Gates the build going live | High | Low | Keep Satisfied (procedural) |

**Step 2 — Anti-stakeholder pass (the part the thin version skipped).**

- **Legal advisor** is the real veto. Concern: charging Indian consumers via
  recurring auto-debit triggers RBI e-mandate rules (₹15,000 cap, 24h pre-debit
  notification, AFA). The veto turns to yes when billing uses a compliant
  Razorpay e-mandate flow with the pre-debit notice wired in. **Surface this in
  week 1, not at the launch review.**
- **Existing 40 alpha users** can't veto, but a "you said it was free" backlash
  in the WhatsApp community poisons the word-of-mouth channel. Mitigation:
  grandfather them onto Pro free for 6 months, announced *before* the paywall ships.

**Step 3 — Communication plan (excerpt).**

| Stakeholder | Strategy | Frequency | Channel | Key message |
|---|---|---|---|---|
| Lead engineer | Manage Closely | Daily async + weekly 1:1 | Slack / call | "E-mandate flow is the critical path; legal answer lands Mon." |
| Legal advisor | Keep Satisfied (blocker) | Front-load, then on-change | 1 doc + 1 call | "Here's the e-mandate design — what breaks RBI compliance?" |
| Alpha users | Keep Informed | Once, pre-launch + at launch | In-app + email | "You're grandfathered to Pro, free for 6 months. Thank you." |
| Angel investor | Keep Satisfied | Monthly | Update email | "Pricing live July 1; first conversion data by July 15." |

**The payoff:** the map reframed the launch from "build a paywall" to "get the
legal e-mandate answer and protect the alpha cohort" — the two things that
actually decide whether July 1 lands.

## When NOT to use this skill

- **Solo founder, no external decision-makers.** If you own every lever and no
  one can block or needs informing, a stakeholder map is ceremony. Use a
  `pre-mortem` instead to find what (not who) kills the plan.
- **The decision is already made and uncontested.** Mapping to "socialize" a
  done deal is theater. Just send the announcement.
- **Pre-PMF discovery.** When you're still finding the problem, there are no
  stakes to land yet — talk to users (`user-research`), don't map politics.
- **As a substitute for actually talking to the blocker.** The map points you
  at the conversation; it is not the conversation. A beautiful grid with no
  outreach behind it has changed nothing.

## Pitfalls / failure modes

1. **"Everyone is High Power / High Interest."** The most common trap. If every
   stakeholder lands in Manage Closely, you've built a to-do list, not a map.
   The grid only helps if it *discriminates* — force-rank power and interest so
   most people fall into Keep Informed / Monitor. If you can't say who is Low
   Power, you don't yet understand the org.
2. **Treating the org chart as the stakeholder list.** Title ≠ influence. A
   staff engineer or a respected support lead can hold more launch-blocking power
   than a VP who never opens the channel. Map *actual* influence on *this*
   decision, not reporting lines.
3. **Ignoring blockers because they're "Low Interest."** A legal or security
   reviewer is Low Interest right up until the moment they read the spec — then
   they're a High-Power veto. Run the anti-stakeholder prompt so blockers don't
   hide in the Keep Satisfied quadrant.
4. **Static map / map-once-and-forget.** Quadrants shift as the project
   progresses (see "Stakeholders move"). A map made at kickoff and never revisited
   is stale by the launch gate.
5. **Communication plan with no owner or trigger.** "Keep Informed — weekly" with
   nobody assigned and no calendar hold means it won't happen. Each row needs an
   owner and a concrete cadence, or it's a wish.
6. **Confusing "informed" with "bought in."** Sending updates is not the same as
   securing a yes. High-Power stakeholders in Manage Closely need their *input
   solicited early*, not their inbox filled after decisions are locked.

## Relationship to other great-pm skills

- **`pre-mortem`** — the forward-looking sibling. The stakeholders who *cause*
  failure in a pre-mortem are exactly the blockers your anti-stakeholder pass
  should have caught. Run both: map the people, pre-mortem the plan.
- **`skeptical-triage`** — when a stakeholder objects, triage whether the
  objection is a real risk or noise before you spend political capital on it.
- **`circles-method`** — stakeholder identification is the practical engine for
  the *Identify* step (who has the need, who else is affected).
- **`launch-readiness`** — the stakeholder communication plan is an input to the
  launch checklist; blockers must be cleared before the launch gate.

---

### Further Reading

- [The Product Management Frameworks Compendium + Templates](https://www.productcompass.pm/p/the-product-frameworks-compendium)
- [Team Topologies: A Handbook to Set and Scale Product Teams](https://www.productcompass.pm/p/team-topologies-a-handbook-to-set)
