---
name: competitive-battlecard
description: "Create sales-ready competitive battlecards comparing your product against a specific competitor — positioning, feature comparison, objection handling, and win/loss patterns. Use when preparing sales teams, creating competitive materials, or responding to 'why not competitor X?'"
---

> **Provenance.** Vendored from `phuryn/pm-skills@competitive-battlecard` (MIT, Paweł Huryn / Product Compass — github.com/phuryn/pm-skills). Adapted into great-pm 2026-05-29 with attribution. Host agent: market-analyst.

## Competitive Battlecard

Create a concise, sales-ready battlecard for use against a specific competitor.

### Context

You are creating a competitive battlecard for **$ARGUMENTS**.

Use web search to research the competitor's current product, pricing, positioning, and recent changes. If the user provides files (feature lists, win/loss data, sales call notes), read them first.

### Instructions

1. **Research the competitor** (use web search):
   - Current product offerings and features
   - Pricing tiers and model
   - Target market and positioning
   - Recent product launches or changes
   - Known strengths and weaknesses
   - Customer reviews and sentiment (G2, Capterra, Reddit)

2. **Create the battlecard** with these sections:

   ### Company Overview
   - Founded, HQ, funding/revenue (if public)
   - Target market and ICP
   - Positioning in one sentence

   ### Quick Comparison

   | Capability | Us | Them | Winner |
   |---|---|---|---|
   | [Feature area 1] | [Our approach] | [Their approach] | [Us/Them/Tie] |
   | [Feature area 2] | ... | ... | ... |
   | Pricing | ... | ... | ... |
   | Support | ... | ... | ... |

   ### Where We Win
   - [Advantage 1]: [Proof point or customer quote]
   - [Advantage 2]: [Specific capability they lack]
   - [Advantage 3]: [Better approach with reasoning]

   ### Where They Win
   - [Their strength 1]: [Our counter-positioning]
   - [Their strength 2]: [How we mitigate this gap]

   ### Common Objections & Responses

   | Prospect Says | Respond With |
   |---|---|
   | "Competitor X has [feature]" | "[Our alternative approach and why it's better for them]" |
   | "They're cheaper" | "[Value framing: total cost of ownership, ROI, hidden costs]" |
   | "They're more established" | "[Our advantages: speed, innovation, focus, support]" |

   ### Landmines to Plant
   Questions to ask the prospect that highlight competitor weaknesses:
   - "How important is [area where we excel] to your team?"
   - "Have you evaluated [specific capability they lack]?"

   ### Win/Loss Patterns
   - We tend to win when: [pattern]
   - We tend to lose when: [pattern]
   - Key differentiator in competitive deals: [what tips the scale]

3. **Keep it scannable**: Sales reps need to reference this during calls. Use tables, bold text, and short bullets.

4. **Date-stamp the card.** Put `Last verified: YYYY-MM-DD` at the top and a
   `Sources` line under each competitor claim. A battlecard with no date is a
   liability (see pitfall 1).

Save as markdown. Format for easy printing or sharing in Notion/Confluence.

### Pitfalls / failure modes

1. **Battlecard rot (date-staleness).** Competitors re-price, ship the feature
   you said they lacked, and rebrand — fast. A card claiming "they have no mobile
   app" six months after they launched one doesn't just miss; it *destroys rep
   credibility* the moment a prospect corrects them. Every card carries a
   `Last verified` date; treat anything older than the refresh cadence (below) as
   unverified and flag it in-line rather than letting reps quote it as fact.
2. **False feature-parity claim.** Two traps, opposite directions: (a) claiming
   "we have that too" when your version is a UX disaster a demo will expose, and
   (b) claiming a competitor "lacks X" when they have a rough version. Both blow
   up live on a call. Rule: a "Winner" verdict must rest on a *verified* capability
   gap, not a marketing-page bullet. If parity is real but your execution is
   worse, say so internally and counter-position on a different axis — don't send
   reps into a demo they'll lose.
3. **Crossing the ethical line on landmines / FUD.** "Landmines to Plant" is
   legitimate *only* when the question points at a real, verifiable weakness the
   prospect should genuinely care about ("How are you handling X compliance?").
   It becomes unethical FUD when it (a) implies a weakness you can't substantiate,
   (b) spreads a claim you know is false or outdated, or (c) disparages rather than
   informs. The test: would you stand behind the question if the competitor's PM
   were in the room? Every landmine must trace to a sourced, current fact — never
   invent a weakness, and never repeat an unverified rumor.

### Cross-links

- **Upstream → `competitive-analysis`.** This battlecard is the *sales-ready
  output*; `competitive-analysis` is the *fact-gathering layer* that feeds it —
  TAM/SAM/SOM, the source checklist (G2, Reddit, filings, hiring posts, call
  transcripts), and the "we have no competitors = no market" discipline. Don't
  hand-source facts in the battlecard; pull verified inputs from a
  `competitive-analysis` pass and cite them.
- **Positioning frame → `obviously-awesome`.** A battlecard's "Where We Win"
  section is only as sharp as your positioning. Use `obviously-awesome` (April
  Dunford) to establish the competitive alternative, your unique attributes, and
  the value those attributes enable — then the battlecard's win/loss patterns
  fall out of a positioning you can defend, not ad-hoc bullet points.
- For market-structure depth (rivalry, switching costs, substitutes) defer to
  `porters-five-forces`.

### Refresh cadence

Battlecards are perishable. Maintain on a **90-day refresh cycle** as the floor,
plus event-triggered refreshes:

- **Every 90 days:** re-verify pricing, feature claims, positioning, and the
  win/loss patterns against current evidence. Re-stamp `Last verified`. Archive
  claims you can no longer source.
- **On a competitor launch / major release:** refresh immediately — a new feature
  can invalidate your central "Where We Win" claim overnight.
- **On a competitor funding round, acquisition, pricing change, or leadership
  shift:** refresh the Company Overview and re-test positioning.
- **On a lost deal to this competitor:** capture the real loss reason and update
  Win/Loss Patterns — field losses are the highest-signal refresh input there is.

A card past 90 days with no refresh should be marked stale, not quietly trusted.

---

### Further Reading

- [How to Design a Value Proposition Customers Can't Resist?](https://www.productcompass.pm/p/how-to-design-value-proposition-template)
