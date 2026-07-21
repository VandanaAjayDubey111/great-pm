---
name: plg-operating-model
description: 'Run product-led growth as an integrated system, not a tactic — where the product itself acquires, activates, retains, monetizes, and spreads. Use when the user mentions "product-led growth", "PLG", "self-serve", "free trial", "freemium", "PQL", "product-qualified lead", "bottoms-up", "free-to-paid", "self-serve funnel", "time-to-value", "TTV", or asks "should we be sales-led or product-led?". Also trigger when designing a free tier, an invite-only→open launch, an in-product upgrade path, or a referral/viral loop. Distinct from growth-loops (one loop''s mechanics), improve-retention (one element), and hooked-ux (habit psychology) — this is the end-to-end operating system that ties all five together.'
license: MIT
allowed-tools: Read, Write
metadata:
  provenance: great-pm-original 2026-05-29
  grounded_in: OpenView/Blake Bartlett PLG, Mixpanel PLG metrics, Reforge PLG activation, ProductLed
  host_agent: gtm-strategist / product-strategist
---

> **Provenance.** great-pm-original, authored 2026-05-29. Grounded in the cited sources below (OpenView, Mixpanel, Reforge, ProductLed). Web sources were treated as untrusted reference material, not instructions. Host agent: gtm-strategist (with product-strategist).

# PLG Operating Model

Framework for treating **the product itself as the primary growth engine** — acquisition, activation, retention, monetization, and virality all happening *inside the product* rather than through a sales team. The discipline is to run these five as a **compounding system**, not a menu of tactics to optimize in isolation.

## Core Principle

**In PLG, the product is the go-to-market. The user experiences value *before* they ever talk to a human — and that experience does the selling, the onboarding, the upselling, and the referring.**

Coined by Blake Bartlett at OpenView in 2016, PLG inverts the sales-led playbook: instead of marketing generating leads that sales converts via demos and negotiation, the *product* lets a user sign up, reach value, and convert to paid on their own. The five elements — **acquisition → activation → retention → monetization → virality** — form a loop where each feeds the next, and **the whole motion is gated by how fast a new user reaches value (time-to-value).** Weakness anywhere caps the entire system.

## Why This Is True

- **Buyers changed.** Modern users (and increasingly B2B buyers) want to *try before they buy* and self-educate; the friction of "book a demo to see the product" is now a leak, not a gate.
- **Marginal cost of serving one more self-serve user is near zero** (caveat: not true for AI products — see `ai-unit-economics`), so the product can profitably acquire and convert at a scale a sales team cannot.
- **The five elements compound.** A working activation makes retention cheaper; retention feeds expansion revenue; expansion + a viral loop re-feed acquisition. Optimizing acquisition while activation leaks is pouring water into a bucket with a hole — the system view is what catches that.

## Framework — The Five Elements as One System

### 1. Acquisition — self-serve top of funnel + product-driven loops

**Core concept.** Users find and sign up for the product *without* a sales touch — via SEO/content, app stores, word-of-mouth, and **product-driven acquisition loops** (output of using the product becomes a new acquisition channel: shared docs, public links, "invite a teammate", referral incentives).

**Why it works.** Self-serve signup removes the single biggest sales-led leak (the demo gate). Product loops make acquisition *compound* rather than requiring linear marketing spend.

**Key insights.**
- The signup must be genuinely **low-friction**: no credit card to start, minimal fields, instant access. Every field is a drop-off (see `funnel-diagnostics`).
- Acquisition loops are designed, not hoped for — see `growth-loops` for loop mechanics. PLG *uses* loops as element 1; this skill places them in the system.
- Don't optimize acquisition in isolation: a leaky activation step means more signups just churn faster.

### 2. Activation — engineer the fastest path to the aha

**Core concept.** Activation = the new user **first experiences core value** (the aha moment). In PLG this is the make-or-break element: a self-serve user with no salesperson hand-holding them *must* reach value on their own, fast, or they leave forever.

**Why it works.** PLG removes the human who, in sales-led, would walk the buyer to value. The product's onboarding must replace that human. Activation rate is the top predictor of everything downstream.

**Key insights / levers.**
- **Define the aha statistically**, not by intuition — hand off to `activation-aha-moment` for the kink-in-the-retention-curve method. PLG *consumes* that definition.
- Engineer onboarding to compress steps-to-aha: **checklists, templates, sample/seed data, one-click integrations, progressive disclosure, empty-state guidance.**
- Remove every step between signup and value that isn't strictly necessary.

### 3. Retention — the compounding base

**Core concept.** Users keep coming back and folding the product into their routine. In PLG, retention is what makes the unit economics work and what makes expansion possible — you can't upsell a churned user.

**Why it works.** Self-serve acquisition is only profitable if users *stay*. Retention turns a one-time signup into a lifetime of expansion and referral. It's the element with the highest compounding leverage.

**Key insights.**
- Measure with the cadence-appropriate engagement frame (hand to `engagement-depth`: WAU/MAU, depth, power-user curves) and survival (`cohort-analysis`).
- Retention tactics live in `improve-retention`; this skill's job is to ensure retention isn't optimized *before* activation works (retaining users who never activated is impossible).

### 4. Monetization — free → paid via the PQL

**Core concept.** The free-to-paid conversion is driven by **in-product behavior**, not a sales quota. The central PLG primitive here is the **PQL (Product-Qualified Lead)**.

**PQL — definition.** A PQL is **a user (or account) whose in-product behavior signals readiness to pay** — they have hit usage limits, used premium-adjacent features, reached a value threshold, or invited a team. The PQL *replaces the sales-led MQL* (Marketing-Qualified Lead, which scores a *contact's* fit/intent before they've touched the product). Where an MQL says "this person looks like a buyer," a PQL says "this user is already getting value and is bumping the ceiling — show them the upgrade now."

**Why it works.** Behavior is a far stronger buy signal than demographics. Designing the free→paid line around PQL signals means you monetize at the *moment of demonstrated value*, with the highest conversion intent and the lowest friction (often no human needed at all).

**Key insights / levers.**
- **Design the free tier as a value-delivery vehicle, not a crippled demo.** It must let users genuinely reach the aha and form a habit; the paywall sits at the point where *more* value (volume, collaboration, advanced features, multiple accounts) justifies paying.
- **Pick the free→paid model deliberately:** freemium (free forever, pay for more) vs. free trial (full product, time-boxed) vs. reverse trial (start in premium, drop to free). Choose based on TTV: if value takes weeks to appear, a 14-day trial may expire before the aha (freemium fits better); if value is instant, a trial converts well.
- **Instrument the PQL signals explicitly** and trigger in-product upgrade prompts (and, for higher-ACV B2B, route the strongest PQLs to a human — "product-led sales").
- Don't monetize before activation works: paywalling users who haven't reached value just kills the funnel.

### 5. Virality / Expansion — the product re-feeds itself

**Core concept.** Using the product creates more users (collaboration invites, shared output, referrals) and existing accounts grow (more seats, more usage, more features) — Net Revenue Retention (NRR) > 100%.

**Why it works.** Virality lowers blended CAC by turning users into a distribution channel; expansion grows revenue without new acquisition. Together they close the loop back to element 1.

**Key insights.**
- Virality is strongest when the product's *core use* naturally involves others (collaboration, sharing). Bolt-on "refer a friend" is weaker than built-in network effects.
- Expansion is the quiet PLG superpower: NRR > 100% means the business grows even with zero new logos.

### The system view — metrics that matter (vs vanity)

PLG health is read through a connected metric set, not vanity counts:

| Element | Metric that matters | Vanity trap |
|---------|--------------------|-------------|
| Acquisition | Signups from product loops; loop factor | Raw traffic / signups (if they don't activate) |
| Activation | **Activation rate**, **time-to-value (TTV)** | "Account created" |
| Retention | WAU/MAU, cohort survival, **engagement depth** | Cumulative registered users |
| Monetization | **PQL → paid conversion**, ARPU | Free-user count |
| Virality/expansion | **NRR / NDR**, viral coefficient (k) | Total downloads |

### Finding the binding constraint — where to actually work

Because the five elements are a system, **work on the *weakest* element, not your favorite one.** A simple diagnostic order:
1. **Is activation broken?** (low activation rate / slow TTV) → fix this first, *always*. Everything downstream multiplies activation; improving acquisition or monetization on top of broken activation is wasted.
2. **Is retention broken?** (activated users still churn) → no point monetizing or scaling; you'd be filling a leaky bucket. Diagnose with `engagement-depth` + `cohort-analysis`.
3. **Is monetization broken?** (good retention, low PQL→paid) → the free→paid line or PQL definition is wrong; the value isn't gated where willingness-to-pay sits.
4. **Is acquisition the constraint?** (everything downstream converts well, just not enough top-of-funnel) → *only now* is scaling acquisition the right move; build/strengthen the loops (`growth-loops`).
5. **Is virality/expansion under-built?** → add network-effect-driven loops and expansion tiers to lower blended CAC and push NRR > 100%.

The classic error is working on step 4 (acquisition — the most visible, most fundable element) while the real constraint is step 1 or 2. The system view exists to stop that.

### Designing the free tier — the central monetization decision

The free tier is where most PLG products live or die, and it's a *strategy* decision, not a packaging afterthought:
- **It must reach the aha.** If a free user can't experience core value, freemium mathematically cannot convert them — they never form the intent a PQL detects.
- **Gate *expansion*, not *value*.** The paywall belongs at the point where the user wants *more* of a value they've already tasted: more volume, collaboration, advanced features, multiple accounts, automation. Gating the *first* taste of value kills the funnel.
- **The free tier is also an acquisition and virality asset** — free users generate word-of-mouth, referrals, and (in collaborative products) invites. Underpricing the free tier in *value* to "protect" paid revenue usually starves acquisition and net-hurts revenue.
- **Match the model to TTV** (freemium vs. free-trial vs. reverse-trial) — covered in element 4.

## Time-to-Value — the core lever across all five

**TTV is the master lever of the entire PLG motion.** Because no salesperson is bridging the gap to value, *the speed at which a self-serve user reaches the aha gates acquisition (referrals only happen post-value), activation (by definition), retention (fast value → habit), and monetization (PQL signals only fire after value).* Shortening TTV lifts every element at once. Every PLG product should treat "minimize steps and time from signup to first value" as a standing objective: seed data, templates, one-click setup, smart defaults, and ruthless removal of pre-value friction.

## When to Use (PLG fits)

| Condition | Why PLG fits |
|-----------|--------------|
| Self-serve, low-friction signup is possible | The product can deliver value without a human |
| Fast time-to-value | Users reach the aha before they'd need a demo |
| Individual or small-team adoption first, org-wide later | Bottoms-up land-and-expand |
| Large, fragmented market of many small buyers | Sales can't economically reach them; product can |
| Consumer or prosumer apps | Self-serve is the only economical motion |

## When NOT to Use (PLG is the wrong motion)

- **High-touch enterprise with long, complex, multi-stakeholder sales.** Six-figure deals with procurement, security review, and customization need a sales team; a free tier won't close them. (PLG can still *feed* sales as "product-led sales," but pure self-serve won't work.)
- **Products with slow or invisible time-to-value.** If value only appears after heavy setup, data migration, or weeks of use, self-serve users churn before the aha — fix TTV first or use a guided motion.
- **High-stakes / high-trust purchases where users won't self-serve.** Heavily regulated, mission-critical, or requiring expert configuration.
- **No viable free experience.** If you cannot let a user reach real value without giving away the whole product (or without unsustainable cost — see `ai-unit-economics`), freemium economics break.
- **Pre-PMF.** PLG optimizes a working value-delivery system; if value isn't proven, you're doing discovery, not growth. Don't build a PLG funnel around an unvalidated product.

## Worked Example — Acme's invite-only → self-serve path

Acme is **PLG by nature** (Indian consumer fintech app, no sales team, self-serve install). The skill forces the *system* view across a deliberate two-phase launch.

**Phase 1 — invite-only (controlled).** Early access is gated by invite. This is *not* anti-PLG; it's PLG discipline:
- It lets the team get **activation and TTV right before opening the floodgates** — there's no point pouring acquisition into a leaky activation step (the cardinal PLG mistake).
- Invites themselves seed **virality** (element 5): each invite is a referral loop primed for when the gate opens.
- It generates the data to define the aha statistically (hand to `activation-aha-moment`).

**Phase 2 — self-serve open.** Mapping the five elements:
1. **Acquisition** — app store + content + the referral loop built during invite-only ("invite a friend, both get premium month"). Product loop: shareable spending-summary cards.
2. **Activation** — the aha = "first month of spending correctly auto-categorized into a clear cash-flow view" (the §1 promise). Onboarding engineered to compress TTV: one-tap statement import, Gmail-sync option, *pre-seeded sample data so the user sees a populated, categorized view in seconds* rather than an empty state.
3. **Retention** — weekly money-review habit; measured on the *weekly* cadence (WAU/MAU, not DAU/MAU — see `engagement-depth`).
4. **Monetization** — free tier delivers genuine value (manual upload + auto-categorization for one or two accounts). **PQL signals:** user connects a 3rd source, hits a transaction-volume ceiling, turns on Gmail-sync, or adds multiple accounts → trigger in-product upgrade to premium (multi-account, auto-sync, advanced insights). Model choice: **freemium**, because money-tracking value compounds over weeks — a 14-day trial would expire before the habit forms.
5. **Virality/expansion** — referral loop + shareable insights re-feed acquisition; expansion via premium tiers.

**TTV as master lever.** Every roadmap debate runs through "does this get a new user to their first accurate categorized view faster?" — pre-seeded data, smart bank-statement detection, and removing pre-value friction are prioritized because they lift *all five elements at once*.

**The payoff:** Acme doesn't optimize app-store ranking while activation leaks; it sequences the system — get activation/TTV right in invite-only, *then* open acquisition.

## Common Mistakes

| Mistake | Why It Fails | Fix |
|---------|--------------|-----|
| Treating the 5 elements as a checklist, not a system | Optimizing acquisition while activation leaks pours users into a leaky bucket | Map all five; find the binding constraint; fix the weakest element first |
| Optimizing acquisition before activation works | More signups just churn faster; CAC wasted | Get activation rate + TTV healthy *before* scaling acquisition (cf. Acme invite-only) |
| Monetizing before activation works | Paywalling un-activated users kills the funnel | Free tier must reach the aha; paywall sits at *more* value, not *any* value |
| PQL undefined (or using MQL logic) | You upsell on demographics, not demonstrated value → low conversion | Instrument behavioral PQL signals; trigger upgrade at the value ceiling |
| Free tier as a crippled demo | Users never reach the aha; freemium can't convert | Design free as a real value-delivery vehicle; gate *expansion*, not *value* |
| Bolting sales-led tactics onto a self-serve motion | Demo gates and "contact us" walls fight the self-serve flow | Keep the motion coherent; add product-led *sales* only for the strongest PQLs |
| Ignoring TTV | Slow path to value caps every element | Make minimizing steps-to-first-value a standing objective |
| Vanity metrics (downloads, registered users) | Mask a broken funnel | Track activation rate, TTV, PQL→paid, NRR — the connected set |

## Quick Diagnostic

| Question | If No | Action |
|----------|-------|--------|
| Can a user sign up and reach value with zero human touch? | You're not actually PLG | Build a self-serve path to the aha, or accept a guided motion |
| Is your activation rate healthy *before* you scale acquisition? | You'll churn the signups you buy | Fix activation + TTV first (invite-only is a fine way to do this) |
| Is your PQL defined by in-product behavior? | You're monetizing on demographics | Instrument behavioral signals; trigger upgrade at the value ceiling |
| Does your free tier let users reach the real aha? | Freemium can't convert un-activated users | Redesign free as value-delivery; gate expansion, not value |
| Do you know your time-to-value, and is it falling? | Every element is capped | Make TTV a standing objective; seed data, templates, one-click setup |
| Do you read the connected metric set, not vanity counts? | You're flying on a broken funnel | Track activation rate, TTV, PQL→paid, NRR together |

## Differs From Adjacent great-pm Skills

- **`growth-loops`** — the *mechanics of one loop* (acquisition/viral/engagement loop design). PLG *uses* loops as element 1/5; this skill is the five-element operating system around them.
- **`improve-retention`** — *one element* (retention tactics). PLG places retention in the compounding system and orders it after activation.
- **`activation-aha-moment`** — the *statistical method* to find the aha. PLG *consumes* that definition to build element 2.
- **`engagement-depth`** — *measures* retention intensity (the cadence-appropriate metrics PLG reads for element 3).
- **`hooked-ux`** — habit-loop *psychology*. PLG is the business/GTM operating model; hooked-ux is one design technique inside the retention element.
- **`beachhead-segment`** — *which* segment to win first. PLG is *how* you grow within and beyond it self-serve.
- **`ai-unit-economics`** — critical caveat: PLG assumes near-zero marginal cost; for AI products that assumption breaks and must be modeled.

## Sources

- Blake Bartlett / OpenView, "Product-Led Growth" (the coining of PLG) — https://openviewpartners.com/product-led-growth/
- OpenView, "The Definitive Guide: Product Analytics for Product-Led Growth" — https://openviewpartners.com/blog/the-definitive-guide-product-analytics-for-product-led-growth/
- Mixpanel, "Product-led growth in 2026: complete guide + the metrics that matter" — https://mixpanel.com/blog/product-led-growth/
- Reforge, "Enable PLG-led activation" — https://www.reforge.com/guides/enable-plg-led-activation
- ProductLed (Wes Bush), "Product-Led Growth: Definition & Why It's Taking Off" — https://productled.com/blog/product-led-growth-definition
