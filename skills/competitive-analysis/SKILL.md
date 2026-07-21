---
name: competitive-analysis
description: Playbook for competitive teardowns, market sizing (TAM/SAM/SOM), and positioning-gap analysis. Used by market-analyst.
when_to_use: |
  Use when tearing down competitors, sizing a market, or finding positioning
  gaps. Primarily for the market-analyst agent.
allowed-tools: Read, Write, WebSearch, WebFetch
---

# Competitive Analysis — playbook

The job is sourced facts, not wishful sizing. Every number traces to a source;
every assumption is shown.

## 1. Competitor teardown

For each competitor capture:
- **What they do** — the core product, in one honest sentence.
- **Positioning** — who they say they are for, and the wedge they lead with.
- **Strengths** — what they genuinely do well.
- **Weaknesses** — where users complain or the product is thin.
- **Recent moves** — launches, pricing changes, pivots in the last 6-12 months.

Include indirect competitors and the "do nothing / spreadsheet" alternative —
they hold real market share.

### Where to source competitors (the 5-source checklist)

Don't list the three rivals you already know. Triangulate from sources that
surface the ones you *don't*:

1. **G2 / Capterra / Product Hunt** — review sites cluster alternatives users
   actually compared. The "compare to" sidebar is a free competitor list.
2. **Reddit / forums / app-store reviews** — search "[problem] app" and
   "alternative to [leader]". Indian fintech: r/IndiaInvestments, r/personalfinanceindia.
   Read the 1- and 2-star reviews — that's where weaknesses are documented for free.
3. **Public filings / funding news** — Crunchbase, Tracxn (strong on India),
   press releases. Reveals who's funded to come after the same market.
4. **Hiring posts** — a competitor's job ads leak roadmap ("hiring for UPI
   AutoPay integration"). LinkedIn + their careers page.
5. **Sales-call / churn transcripts** — when prospects say "we're also looking
   at X" or churned users say "we left for Y", that's the real competitive set,
   not the one in your head.

If you can name only the obvious incumbents, you haven't sourced — you've recalled.

## 2. Market sizing — TAM / SAM / SOM

- **TAM** (Total Addressable Market) — everyone who has the problem.
- **SAM** (Serviceable Available Market) — the slice this product can serve
  (geography, segment, channel).
- **SOM** (Serviceable Obtainable Market) — the slice realistically winnable
  in a defined period.

Two methods — use both and compare:
- **Top-down** — start from an industry figure, narrow by segment.
- **Bottom-up** — number of target users x price x adoption rate.

A sized number is meaningless without its method and assumptions. Always show:
the source, the formula, and every assumption. If the data does not support a
reliable estimate, say "cannot size reliably — here is why."

## 3. Positioning-gap analysis

Map competitors on the 2-3 dimensions that matter to users (not vanity axes).
Look for:
- Quadrants no competitor occupies.
- User segments everyone underserves.
- Jobs (from JTBD) no product does well.

A gap is only real if users actually want that position — an empty quadrant
nobody wants is not an opportunity.

## 4. Honesty rules
- Every competitor claim and every market number cites a real, checkable source.
- Distinguish fact (from a source) from inference (your reasoning) explicitly.
- Recency matters — flag any source older than ~12 months.
- "We could not verify this" beats a confident guess.

## 5. Output shape
A competitive brief: teardown table, the TAM/SAM/SOM with methods shown, the
positioning-gap map, and the 2-3 gaps most worth great-pm's attention.

## Worked example — Acme.ai market sizing (Indian consumer fintech)

**Goal.** Size the market for an AI-categorizing personal-expense app for Indian
consumers, ahead of a July 1 alpha.

**TAM (top-down).** Smartphone users in India who track money digitally.
~750M smartphone users (TRAI, 2025) × ~25% who actively manage personal finances
digitally (industry surveys) = **~190M people**. Source: TRAI subscriber data +
RedSeer fintech-adoption reports. Assumption shown: "actively manage" ≈ uses any
finance/UPI-tracking app monthly.

**SAM.** The slice Acme can plausibly serve: English-or-Hindi-comfortable,
smartphone-first, with ≥1 bank account and recurring UPI usage, in metro + tier-1
cities. ~190M × ~30% (metro/tier-1 share of the digitally-active base) =
**~57M people**.

**SOM (bottom-up — the honest cross-check).** What's realistically winnable in
18 months. Realistic reach via organic + WhatsApp + modest paid: ~500K app
installs → ~15% activate (complete first import) → ~8% convert to ₹149/mo Pro.
500,000 × 0.15 × 0.08 = **~6,000 paying users → ~₹1.07 Cr ARR**.

**The gap, shown honestly.** Top-down SAM (57M) and bottom-up SOM (6K paying)
differ by four orders of magnitude — and that's the *point*. The top-down number
is the prize; the bottom-up number is what the go-to-market can actually touch in
the planning window. Reporting only the 57M (or, worse, the 190M TAM) as "our
market" would be TAM-gaming. The decision-useful number is the SOM and the
conversion assumptions inside it — every one of which is a falsifiable bet for the
alpha to test.

**Positioning gap.** Map rivals on (a) automation depth — manual entry → rules →
true AI categorization, and (b) India-native rails — generic finance app →
deep UPI/SMS-parse/bank-statement-import. Walnut/Money View sit mid-automation,
India-native. Mint-style apps sit higher-automation but US-centric and now
sunset. The empty quadrant Acme targets: **high-automation AND India-native**
— *if* users actually want auto-categorization (the bet to validate), not just
cheaper manual tracking.

## When NOT to use this skill

- **You haven't talked to a single user yet.** Competitive analysis tells you the
  *supply* side; it can't tell you whether the problem is real. Do `user-research`
  / `jobs-to-be-done` first — a beautiful teardown of a market nobody wants is wasted.
- **For a sales objection in the moment.** A live deal needs a `competitive-battlecard`
  (sales-ready, one competitor, fast), not a full market study.
- **When the answer won't change a decision.** If you'll build the same thing
  regardless of what rivals do, sizing the market is procrastination. Spend the
  time shipping.
- **Quarterly macro re-sizing for a stable B2B niche.** If TAM moves by single-digit
  percent a year, re-sizing every quarter is busywork — revisit annually or on a
  real market shock.

## Pitfalls / failure modes

1. **"We have no competitors."** The single most dangerous line in a competitive
   brief. It almost always means one of: (a) you've defined the category so
   narrowly that you've defined the market out of existence, or (b) there is no
   demand and that's *why* nobody's there. The honest reframe: the alternative to
   your product is never "nothing" — it's a spreadsheet, a notes app, a bank's own
   app, or simply not tracking. Name that incumbent. **No competitors usually
   means no market, not a clear runway.**
2. **TAM-gaming.** Picking the biggest defensible number ("everyone with a
   smartphone") to impress a deck. The fix: always report TAM/SAM/SOM together and
   lead decisions with the SOM. A TAM with no SOM is a vanity figure.
3. **Top-down only (no bottom-up cross-check).** A single-method size is unfalsifiable.
   The two methods must be shown side by side; when they disagree by orders of
   magnitude, the *disagreement* is the finding.
4. **Vanity-axis positioning maps.** Plotting rivals on axes you win on by
   construction ("AI-powered" vs "legacy") instead of axes users decide on. A gap
   on an axis nobody buys on is not an opportunity — it's an empty quadrant nobody wants.
5. **Stale facts presented as current.** A competitor's pricing or feature from 14
   months ago, cited as today's reality. Date-stamp every claim; flag anything
   older than ~12 months (especially in fast-moving fintech).
6. **Confusing "they're weak here" (your inference) with "users complain here"
   (sourced fact).** Mark which competitor weaknesses come from real reviews/
   transcripts vs your own reasoning. Inferred weaknesses are hypotheses, not
   ammunition.

## Relationship to other great-pm skills

- **`porters-five-forces`** — when you need *structural* market depth (supplier
  power, switching costs, threat of new entrants) beyond a competitor teardown,
  delegate to Porter's. This skill is the operational playbook; Porter's is the
  structural lens.
- **`competitive-battlecard`** — the downstream, sales-ready output. This brief
  is the upstream source of facts the battlecard distills into win/loss talking
  points. Keep the battlecard's claims traceable to this brief.
- **`value-proposition-canvas`** — the positioning gaps you find here feed the
  differentiation work; the canvas turns "the empty quadrant" into a concrete
  value proposition for that segment.
- **`jobs-to-be-done`** — a positioning gap is only real if it maps to a job users
  are trying to get done; use JTBD to test that the empty quadrant is wanted.
