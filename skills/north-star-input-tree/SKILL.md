---
name: north-star-input-tree
description: Build a North Star Metric and decompose it into 3-5 controllable input metrics that sum/multiply to it — the Amplitude framework as a standalone build. Covers NSM selection criteria, the input-metric tree, finding the weakest input to focus on, and the anti-patterns (revenue/vanity NSMs). Makes a North Star *actionable* instead of a scoreboard. Used by metrics-architect.
when_to_use: |
  Use when a team has (or needs) a North Star but no way to *act* on it —
  to select an NSM against real criteria and decompose it into the few
  input metrics teams directly influence. Trigger when "what's our one
  metric?" or "our North Star doesn't drive any decisions" comes up, or
  when setting up measurement for a new product/initiative. Primarily for
  metrics-architect.
allowed-tools: Read, Write
---

> **Provenance.** great-pm-original, authored 2026-05-29, grounded in the
> cited sources (Amplitude North Star Playbook, Open Practice Library,
> Alex Morcillo). Host agent: metrics-architect.

# North Star + Input-Metric Tree — making the one number actionable

A North Star Metric (NSM) on its own is a **scoreboard**: it tells you the
score but not which move to make. It becomes *actionable* only when
decomposed into **3–5 input metrics** — the levers teams directly
influence that *combine* (sum or multiply) to produce the North Star.
Sean Ellis coined the NSM concept; **Amplitude formalized the
input-metrics tree** that turns it from a vanity dashboard into a
decision-making instrument. This skill builds both halves: select an NSM
that survives the criteria, then decompose it into a tree the team can
move.

The defining property: a North Star expresses the **value customers get
from the product**, framed as a *leading* indicator of business success —
not the business success itself (that's revenue, a lagging output). The
input tree is what lets a decentralized team find the *weakest input*,
run experiments there, and check whether the North Star moved.

## 1. Selecting the North Star — the criteria

A candidate NSM must satisfy *all* of these. Score each candidate against
the checklist; the one that passes cleanly wins.

| Criterion | What it means | Failure mode it catches |
|-----------|---------------|--------------------------|
| **Expresses customer value** | Captures the value the *user* gets, not the value *you* extract | Revenue/bookings (value to you, lagging) |
| **Reflects vision & strategy** | A proxy for the strategy working; if it moves, the bet is paying off | A generic metric unconnected to the actual bet |
| **Leading, not lagging** | Predicts future business results; moves *before* revenue does | Revenue, churn (rear-view) |
| **Actionable** | Teams can take actions that measurably move it | A macro metric no single team can influence |
| **Understandable** | Stateable in plain language to anyone in the company | A composite "engagement score" nobody can explain |
| **Measurable** | A clear unit + period, instrumentable without ambiguity | "Customer happiness" with no definition |
| **Can credibly drop** | Has a real down direction (the honesty test) | Cumulative totals that only ever rise (vanity) |

**The single best heuristic:** the NSM sits at the intersection of
*customer value* and *business value*, expressed as the **moment/quantity
of value delivered**. Examples that pass:
- Spotify — *time spent listening* (value experienced, leading on
  subscription retention).
- Airbnb — *nights booked* (the core value exchange).
- Slack — *teams actively messaging* (value-in-use, leading on expansion).
- WhatsApp — *messages sent* (the product *is* messaging).

Examples that **fail** (anti-patterns): revenue / ARR (lagging, business-
not-customer value), "total registered users" (cumulative, can't drop,
value not delivered), a vague "engagement" composite (un-understandable,
ungameable into meaninglessness), DAU *with no value qualifier* (opened ≠
got value).

## 2. The input-metric tree — decomposing the NSM

The NSM is the trunk. The branches are **3–5 input metrics** that satisfy
two joint conditions:

1. **They collectively produce the NSM.** Stated as a rough equation —
   they should *sum or multiply* to the North Star. The tree is wrong if
   moving every input wouldn't move the NSM.
2. **Each is directly influenceable** by the daily work of a team. An
   input metric a team can't actually move is decoration.

### How to find the inputs (the decomposition)

Ask: *"What has to be true for the North Star to go up?"* The answers,
deduplicated to the few that matter, are the inputs. Use these common
decomposition lenses:
- **Breadth × Depth × Frequency × Efficiency.** Many NSMs factor as
  (how many users) × (how deeply each engages) × (how often) × (how
  reliably the product delivers value when they try).
- **Acquisition → Activation → Retention** of the value-event (each a
  controllable rate feeding the value the NSM counts).
- **Quality × Quantity.** A volume metric times a quality/success rate
  (this catches the trap of pumping volume while value-per-event falls).

Keep it to **3–5**. Two inputs is usually under-decomposed (you've hidden
sub-levers); more than five and no team can focus — the whole point is to
let a team pick *the weakest input* and attack it.

### Operating the tree

1. **Measure all inputs.** Each is itself a metric with a unit, period,
   and instrumentation spec (see `metrics-design`).
2. **Find the weakest input** — the one most below its potential / most
   constraining the NSM. That is where the next experiments go.
3. **Run experiments on the weakest input** (hand to `experiment-design`).
4. **Check the NSM actually moved.** If you improved an input and the NSM
   didn't budge, your tree is wrong — the input either doesn't really
   feed the NSM, or another input fell as this one rose. Re-derive.
5. **Re-balance over time.** As the weakest input is fixed, a different
   one becomes the constraint. The tree is a living instrument.

### The three jobs the tree does (Amplitude)

- **Prioritize & accelerate decentralized decisions** — a team can pick
  an input and act without escalating; the tree is the shared map.
- **Align & communicate** — everyone sees how their work ladders to the
  one number.
- **Focus on sustainable product-led growth** — inputs are value-and-
  product levers, steering away from vanity and short-term hacks.

## 3. When to use — and when NOT to

| Use it when… | Because… |
|---------------|----------|
| You have a North Star nobody can act on | The tree converts a scoreboard into levers |
| Setting up measurement for a new product/initiative | NSM + inputs is the backbone the KPI plan hangs on |
| Teams are optimizing local metrics that don't ladder up | The tree realigns everyone to one number |
| "Revenue is our North Star" is being proposed | Apply §1 criteria — revenue is a lagging output, not an NSM |

**When NOT to use:**
- **Pre-product-market-fit / pure exploration.** Before you know what
  value looks like, a fixed NSM tree can ossify the wrong bet. Use
  discovery + a provisional metric instead; build the tree once the value
  is clear.
- **A single team / single feature.** A full company NSM tree is overkill
  for one feature's success metric — use `metrics-design` for the local
  KPI and slot it under the existing tree.
- **As a substitute for strategy.** The NSM *reflects* strategy; it
  doesn't *create* it. If there's no strategy bet, fix that first
  (`brainstorm-okrs` / strategy work), then derive the NSM from it.
- **Don't let the tree become a giant scorecard.** More than ~5 inputs and
  it stops focusing decisions — that's the anti-use.

## 4. Worked example — Acme

**Strategy bet** (per MEMORY / instructions.md §1): Acme wins by giving
Indian consumers *effortless, accurate, recurring* visibility into their
cash flow — a money-awareness *habit*. The North Star must express that
value as a leading indicator.

**NSM candidate (passes §1 criteria):**
> **Weekly active users who viewed an accurate categorized cash-flow
> view** ("weekly money-aware sessions").

Check it:
- Customer value? Yes — the user *gets* visibility (the §1 promise). ✓
- Reflects strategy? Yes — the recurring-awareness-habit bet. ✓
- Leading? Yes — predicts retention/subscription, ahead of revenue. ✓
- Actionable? Yes — multiple teams can move it. ✓
- Understandable? Yes — plain language. ✓
- Measurable? Yes — weekly count, defined "accurate view" event. ✓
- Can drop? Yes — if accuracy or habit slips, it falls. ✓

(Rejected alternatives: *transactions categorized* — volume without value
felt; *revenue* — lagging, business-not-user; *total users* — cumulative,
can't drop.)

**The input tree (rough product):**

```
North Star: Weekly money-aware sessions
  ≈ (active users)
    × (share who connected ≥1 data source)        ← INPUT 1: data breadth
    × (categorization accuracy rate)               ← INPUT 2: quality
    × (share returning within their weekly cadence) ← INPUT 3: habit/freq
  with TTV gating who ever reaches the first session ← INPUT 4: time-to-first-insight
```

| # | Input metric | Who moves it | Lens |
|---|--------------|--------------|------|
| 1 | % of users with ≥1 source connected (breadth) | onboarding / integrations | breadth |
| 2 | Categorization accuracy rate (% not overridden) | the AI gate pipeline / evals | quality |
| 3 | % returning within their weekly cadence (habit) | retention / notifications | frequency |
| 4 | Time-to-first-insight (TTV) | onboarding | activation/efficiency |

**Operating it.** Suppose accuracy (Input 2) is at 78% and overrides are
high — that's the **weakest input**, and it's *causal*: an inaccurate view
isn't a money-aware session, it's a chore. Focus experiments there (better
gate routing, more merchant rules, eval-driven prompt fixes). Improve
accuracy → fewer overrides → more sessions *count* as money-aware → NSM
rises. Crucially, **verify the NSM moved**: if accuracy rose but weekly
money-aware sessions didn't, the tree is mis-specified (maybe habit, Input
3, is the real constraint and users churn before accuracy matters).

**Cross-tie:** Input 4 (TTV) is exactly the lever
`activation-aha-moment` optimizes; Input 2 (accuracy) is what `ai-evals`
measures; the drops *between* connecting a source and the first insight
are what `funnel-diagnostics` repairs. The tree is the spine that
organizes all three.

## 5. Common pitfalls

| Pitfall | Why it fails | Fix |
|---------|--------------|-----|
| NSM with no input tree | Un-actionable scoreboard; teams optimize local metrics that don't ladder up | Decompose into 3–5 controllable inputs that combine to the NSM |
| Revenue (or any lagging output) as the NSM | Rear-view, expresses *your* value not the *customer's*; can't be steered directly | Pick a leading customer-value metric; revenue is the *outcome* of the NSM |
| Vague "engagement" composite | Un-understandable, un-actionable, gameable into meaninglessness | Use a concrete value event with a unit and period |
| A metric that can't credibly drop | Cumulative totals (total users/transactions) are vanity | Apply the honesty test: does it have a real down direction? |
| Too many inputs (> 5) | No team can focus; defeats the "attack the weakest input" purpose | Deduplicate to the few that genuinely drive the NSM |
| Inputs the team can't move | Decoration, not levers | Every input must be directly influenceable by daily work |
| Never re-checking that the input moved the NSM | You "win" on an input while the NSM is flat — the tree is wrong | Always verify the NSM responded; re-derive the tree if not |
| Volume input with no quality counterpart | You pump events while value-per-event falls (more sessions, less awareness) | Pair volume with a quality/success rate input |

## 6. Ethical boundary

The North Star must measure value the **user actually receives**, not
value extracted *from* them. An NSM secretly optimized for the company's
take (sessions inflated by manipulative notifications, "active" counted on
hollow opens) corrupts every decision the tree drives downstream — teams
will dutifully grow a number that no longer represents user benefit. The
honesty test ("can it drop?") is also an ethics test: if your metric only
rises because it counts something the user didn't value, you've built a
vanity engine with a strategy doc attached. Anchor the NSM and its inputs
on genuine value delivered.

## 7. Quick diagnostic

| Question | If "no" → |
|----------|-----------|
| Does the NSM express **customer value**, leading not lagging? | Re-select against §1 criteria; reject revenue/totals |
| Can you state it in **plain language** with a unit + period? | Sharpen the definition |
| Can it **credibly drop**? | It's vanity — pick an honest metric |
| Is it decomposed into **3–5 controllable inputs** that combine to it? | Build the tree (§2) |
| Can each team **directly move** its input? | Replace decoration inputs with real levers |
| Have you identified the **weakest input** to focus on? | Measure all inputs; find the constraint |
| When you moved an input, did the **NSM actually respond**? | Re-derive the tree — it's mis-specified |

## 8. Cross-links & boundary

- **`metrics-design`** — names the North Star + AARRR at a *definition*
  level (one paragraph each); this skill is the full Amplitude *tree*
  methodology. metrics-design specs the events/thresholds for each node
  *after* the tree is built.
- **`activation-aha-moment`** — activation rate / TTV is almost always one
  of the input metrics; build the aha there, slot it in here.
- **`funnel-diagnostics`** — funnel conversion rates are common input
  metrics; a leaking funnel step is often the *weakest input*.
- **`improve-retention`** — a retention/habit input lives here as a
  branch; retention *tactics* live in that skill.
- **`cohort-analysis`** — supplies the retention-curve data behind
  retention-flavored inputs.
- **`experiment-design`** — how you act on the weakest input: experiments
  on that branch, then verify the NSM moved.
- **`brainstorm-okrs`** — input metrics make excellent OKR key results;
  the NSM is the objective they ladder to. (The NSM *reflects* strategy —
  derive it from the strategy bet, don't invent it free-standing.)

**Differs from `metrics-design` because** that defines a KPI set
conceptually (one line on the NSM); this *builds the decomposition tree* —
the actionable mechanism. **Differs from `brainstorm-okrs` because** that
sets objectives/key-results for a period; this builds the *enduring
measurement spine* objectives ladder to. **Differs from `cohort-analysis`
/ `funnel-diagnostics` because** those are diagnostic techniques that
*feed* input branches; this is the *framework that organizes* them under
one number.

## Sources

- Amplitude, "The North Star Playbook" — https://amplitude.com/books/north-star/about-the-north-star-framework
- Open Practice Library, "North Star Framework" — https://openpracticelibrary.com/practice/north-star-framework/
- Alex Morcillo, "Your North Star Metric Is Wrong: Spotify, Airbnb, Slack" — https://alexmorcillo.com/blog/strategy/what-is-a-north-star-and-what-is-not/
- Sean Ellis (originator of the North Star Metric concept; GrowthHackers) — widely documented in the Amplitude playbook above
