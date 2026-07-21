---
name: growth-loops
description: "Identify growth loops (flywheels) for sustainable traction. Evaluates 5 loop types: Viral, Usage, Collaboration, User-Generated, and Referral. Use when designing growth mechanisms, building product-led traction, or understanding how growth loops work."
---

> **Provenance.** Vendored from `phuryn/pm-skills@growth-loops` (MIT, Paweł Huryn / Product Compass — github.com/phuryn/pm-skills). Adapted into great-pm 2026-05-29 with attribution. Host agent: gtm-strategist.
# Growth Loops

## Overview
Identify and design growth loops (flywheels) that create sustainable traction. This skill evaluates five proven growth loop mechanisms to reduce reliance on paid acquisition and build product-led growth.

## When to Use
- Designing growth mechanisms for a product
- Building sustainable viral or referral traction
- Reducing reliance on paid acquisition
- Analyzing competitor growth strategies
- Optimizing product for product-led growth

## The 5 Growth Loop Types

### 1. Viral Loop
Product content created by users gets shared on external platforms, bringing new users back to the product.
- **Mechanism**: Users create content in-product → Share on social/external platforms → New users discover and signup
- **Example**: Figma designs shared as links, Loom videos shared in emails
- **Strength**: Exponential user acquisition if content is inherently shareable
- **Challenge**: Requires highly shareable output and strong incentive to share

### 2. Usage Loop
Users create content or value within the product, then share it, which invites new users or drives re-engagement.
- **Mechanism**: User creates → Shares creation → Others consume → Become engaged users
- **Example**: Twitter threads, Medium articles, Notion templates shared publicly
- **Strength**: Growth tied directly to product usage and network effects
- **Challenge**: Requires content creation friction to be very low

### 3. Collaboration Loop
Users invite colleagues to co-create or collaborate within the product, expanding the user base within organizations.
- **Mechanism**: User creates → Invites colleagues for collaboration → Colleagues discover product value
- **Example**: Google Docs invitations, Figma team projects, Slack channels
- **Strength**: Deep organizational penetration and high retention
- **Challenge**: Works best for collaborative/team-based products

### 4. User-Generated Loop
Users discover new content or features through other users' creations, then create and share their own content.
- **Mechanism**: User discovers content → Creates similar content → Shares creation → Others discover
- **Example**: TikTok, Pinterest, YouTube trends driving creator participation
- **Strength**: Creates content flywheel and network effects
- **Challenge**: Requires critical mass of quality content to sustain

### 5. Referral Loop
Users invite other potential users in exchange for rewards, incentives, or social recognition.
- **Mechanism**: User refers → Referred user joins → Referrer gets reward → Shares more referrals
- **Example**: Dropbox referral bonus, Uber rider referrals, PayPal signup bonuses
- **Strength**: Directly incentivizes acquisition; easy to measure ROI
- **Challenge**: Requires valuable incentive without eroding unit economics

## How It Works

### Step 1: Define Product Value
Clarify the core value users experience:
- Primary action users take in your product
- Value created per user action
- Network effects present (if any)
- Friction points in the experience

### Step 2: Evaluate Loop Fit
Assess which growth loops align with your product:
- Product type (collaborative, content-based, utility, etc.)
- Target user behavior and sharing habits
- Network effects already present
- Existing user base and engagement

### Step 3: Design Loop Mechanics
Create specific loop implementation:
- Trigger that initiates sharing or invitations
- Incentive for participation (intrinsic or extrinsic)
- Ease of sharing mechanism
- Conversion rate from invite to activation
- Frequency of loop repetition per user

### Step 4: Calculate Loop Coefficient
Estimate growth velocity. The loop coefficient **K** is the number of new users each user brings *in one cycle*:

```
K = (sends or shares per user per cycle)
    × (conversion rate from exposure → activated new user)
```

- **K > 1 sustainably** → self-sustaining viral growth (each user more than replaces themselves). Genuinely rare; treat any claim of K > 1 with suspicion until measured.
- **K between ~0.5 and 1** → the loop is a powerful *amplifier* on paid/organic acquisition, not a standalone engine. This is the realistic target for most products.
- **K < 0.3** → the loop is decorative; do not headline growth on it.

Two numbers the raw K hides — both must be honest:
- **Cycle time** — calendar days from a user joining to them completing one full loop. A K of 0.6 with a 3-day cycle compounds far faster than K of 0.9 with a 60-day cycle. Always report `K @ cycle-time`, never K alone.
- **Decay** — K is rarely constant. Early-cohort enthusiasm and finite address books mean K falls over a user's life. Model K per-cycle (K₁, K₂, K₃…), not as one fixed number, or you will over-forecast.

Worked math: 1,000 new users, each sends 4 invites (sends = 4), 15% of invitees activate (conv = 0.15) → K = 4 × 0.15 = **0.6**. Those 1,000 produce 600 in the next cycle, then 360, then 216… a finite 2.5× amplification (1 / (1 − K) = 1 / 0.4), **not** runaway growth. Reporting this as "viral" would be dishonest; it is a 2.5× multiplier on whatever fills the top of the loop.

### Step 5: Build the Loop
Implement the highest-leverage loop first:
- Start with the most natural loop for your product
- Optimize messaging and friction
- Measure loop metrics and conversion rates
- Compound results over time

## Input Format
Use $ARGUMENTS to pass:
- Product description and primary user action
- Target user demographics and behavior
- Existing sharing/collaboration features
- Current growth channels and metrics
- Constraints or opportunities

## Output
A growth loops analysis including:
- Ranked evaluation of all 5 loop types for your product
- Recommended primary growth loop with implementation plan
- Secondary loops to layer over time
- Key metrics and measurement framework
- 30-60-90 day implementation roadmap
- Potential loop coefficient and growth projections

## Framework
Based on growth loops research by Ognjen Bošković. Focuses on compounding user acquisition through built-in, product-native sharing and collaboration mechanisms.

## Tips
- Start with one loop and master it before adding complexity
- Viral loops compound fastest but take time to build
- Collaboration loops create strongest retention and LTV
- Measure loop health weekly during optimization phase
- Combine loops for multiplicative effect once operating at scale

## Worked Example — Acme (personal-finance app)

**Product:** Acme auto-categorizes a user's spending from bank statements and shows a monthly money story.

Ranking the 5 loops against this product:

| Loop | Fit | Why |
|---|---|---|
| Viral | Weak | Spending data is *private*. Nobody shares "my categorized transactions." |
| Usage | Weak | The core output (your budget) is not something users publish. |
| Collaboration | **Medium** | Shared household budgets — invite a partner to co-track a joint account. Real, but only fires for couples/families, a slice of users. |
| User-Generated | Weak | No public content layer; building one would be a different product. |
| Referral | **Strong** | Clear ROI framing ("save ₹X/month"), easy to measure, no privacy leak — you refer the *app*, not your data. |

**Chosen primary loop: Referral.** Trigger fires at the *aha moment* — right after the first month-end summary lands ("you spent ₹4,200 on food delivery") — not at signup before any value is felt.

**Loop math, honest version:** Suppose 20% of users who hit the aha moment send a referral (effective sends per user = 0.2 × ~2 invites = 0.4), and 25% of invitees activate. K = 0.4 × 0.25 = **0.1**. That is *not* a growth engine — it is a 1.11× amplifier (1 / (1 − 0.1)). The honest read: referral meaningfully lowers CAC but Acme still needs a paid/organic top-of-funnel. The secondary collaboration loop (joint budgets) is layered later for retention, not acquisition.

**The trap avoided:** an earlier draft proposed a "share your savings streak" viral loop. It was killed because (a) finance shame means low share rates, and (b) it risked exposing spending levels — collaboration-disguised-as-virality with a privacy cost and no real coefficient.

## When NOT to use growth loops

- **Single-player utility products** with no natural sharing surface (a tax calculator, a solo password manager, an offline note-taker). Forcing a loop here produces dark-pattern invite spam, not growth. Use paid acquisition + retention + word-of-mouth instead, and accept that.
- **Pre-product-market-fit.** A loop amplifies whatever you feed it — including churn. If retention is broken, loops accelerate the leak. Fix the leaky bucket (see `improve-retention`) *before* engineering a loop.
- **Privacy-sensitive cores** (health, finance, legal) where the valuable artifact cannot be shared without exposing the user. Constrain to referral-of-the-app, never sharing-of-the-data.
- **When K is being used as theater.** If you cannot measure sends, conversion, and cycle time, you do not have a loop — you have a hope. Don't put a coefficient in a deck you can't defend.

## Pitfalls / Failure modes

1. **Referral loop that erodes margin.** A ₹500 two-sided bonus with a customer LTV of ₹400 is a machine for buying users at a loss. Always check `referral incentive cost < contribution margin per referred user`, and watch for incentive farmers who refer and churn. Cap, gate on activation (pay the reward only after the referred user is retained), and revisit quarterly.
2. **Collaboration disguised as virality.** "Invite a teammate" inside a *single-player* job is not a viral loop — it is a feature with a low ceiling. Be honest about which loop you actually have; mislabeling inflates forecasts. A true collaboration loop requires the second user to also be doing the core job, not just spectating.
3. **K reported without cycle time or decay.** A flat K = 0.7 in a forecast model overstates growth because real K decays per cohort and per cycle. Always model K₁, K₂, K₃ and the calendar cycle time, or you will promise compounding that never arrives.
4. **Optimizing the loop before the aha moment.** Triggering an invite/share prompt *before* the user has felt value tanks conversion and trains users to dismiss your prompts. Place loop triggers at the point of realized value, not at signup.
5. **Counting paid acquisition as a loop.** "We spend ad money, get users, who generate revenue, which buys more ads" is a *funded* growth model, not a product loop. It does not compound on its own — it compounds on capital. Label it correctly.

## Cross-links

- **`improve-retention`** — a loop amplifies retention; if the bucket leaks, fix it first. Retention is the multiplier on every loop's output.
- **`hooked-ux`** — the in-product habit (trigger → action → reward → investment) is what produces the artifact the loop then shares. Loops without a Hooked-style habit have no fuel.
- **`metrics-design`** — instrument sends, exposure→activation conversion, and cycle time as first-class events; K is a derived metric, not a vanity number.
- **`pricing-models`** — referral incentives are a pricing/unit-economics decision; size them against contribution margin there.

---

### Further Reading

- [Product-Led Growth 101, Part 1/2](https://www.productcompass.pm/p/product-led-growth-101-12)
- [OpenAI’s Product Leader Shares 3-Layer Distribution Framework To Win Mind & Market Share in the AI World](https://www.productcompass.pm/p/distribution-framework-ai-products)
- [How to Design a Value Proposition Customers Can't Resist?](https://www.productcompass.pm/p/how-to-design-value-proposition-template)
