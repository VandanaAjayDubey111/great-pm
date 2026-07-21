---
name: customer-journey-map
description: "Create an end-to-end customer journey map with stages, touchpoints, emotions, pain points, and opportunities. Use when mapping the customer experience, identifying friction points, improving onboarding, or visualizing the user journey."
when_to_use: |
  Use when you have evidence (interviews, analytics, support tickets) about how
  real users move through a product and you need to locate where they stall,
  drop, or churn. The map turns scattered friction into a prioritized list of
  fixes. Primarily for the user-researcher agent; pairs with improve-retention
  (post-aha), hooked-ux (habit moments), and growth-loops (advocacy → acquisition).
allowed-tools: Read, Write, WebSearch, WebFetch
---

> **Provenance.** Vendored from `phuryn/pm-skills@customer-journey-map` (MIT, Paweł Huryn / Product Compass — github.com/phuryn/pm-skills). Adapted into great-pm 2026-05-29 with attribution. Host agent: user-researcher.

## Customer Journey Map

Map the end-to-end customer experience from awareness through advocacy, identifying emotions, pain points, and improvement opportunities at each stage.

### Context

You are creating a customer journey map for **$ARGUMENTS**.

If the user provides files (interview transcripts, survey data, analytics, support tickets, or existing journey maps), read them first. Use web search to understand the product if a URL is provided.

### Instructions

1. **Define the persona**: Who is traveling this journey? Use a specific persona with JTBD, not a generic user.

2. **Map the journey stages** (adapt to the product):

   | Stage | Description |
   |---|---|
   | **Awareness** | How do they first learn about the product? |
   | **Consideration** | What do they evaluate? What alternatives do they compare? |
   | **Acquisition** | How do they sign up or purchase? |
   | **Onboarding** | First experience with the product — time to value |
   | **Engagement** | Regular usage — building habits |
   | **Retention** | What keeps them coming back? What might cause churn? |
   | **Advocacy** | When and why do they recommend the product to others? |

3. **For each stage, document**:

   - **Touchpoints**: Where the user interacts with the product, brand, or team (website, email, in-app, support, social media)
   - **User actions**: What they do at this stage
   - **Thoughts & questions**: What's on their mind ("Is this worth my time?" "How do I...?")
   - **Emotions**: How they feel (excited, confused, frustrated, delighted) — rate on a scale or use emoji indicators
   - **Pain points**: Friction, confusion, drop-off risks
   - **Opportunities**: How to improve the experience at this point

4. **Identify critical moments**:
   - **Aha moment**: When the user first experiences core value
   - **Moments of truth**: Decision points where they commit or abandon
   - **Churn triggers**: Where users most commonly drop off

5. **Create the journey map table** — and add an **Evidence column**:

   | Stage | Touchpoint | User Action | Emotion | Pain Point | Opportunity | Evidence |
   |---|---|---|---|---|---|---|

   The **Evidence** column is what separates a real journey map from a fictional
   one. For every emotion and pain point, mark the source: *observed* (analytics
   funnel, session recording, support ticket, interview quote) or *assumed* (your
   best guess). A map where every row says "assumed" is a hypothesis to validate,
   not a finding to act on. Make the assumed rows visible so they get tested
   before anyone builds against them.

6. **Recommend prioritized improvements**:
   - Which pain points have the highest impact on conversion or retention?
   - What quick wins can improve the experience immediately?
   - What requires deeper investment but has the biggest payoff?

Think step by step. Save as a markdown document. For visual journey maps, suggest the user create one in Miro or FigJam using this analysis as the foundation.

## Worked example — Acme.ai onboarding journey (Indian consumer fintech)

**Persona.** Priya, 29, salaried in Bengaluru. JTBD: *"When my salary hits, help
me see where my money actually goes — without me logging every UPI payment by
hand."* She downloaded Acme after a Reddit thread.

| Stage | Touchpoint | User action | Emotion (1–5) | Pain point | Opportunity | Evidence |
|---|---|---|---|---|---|---|
| Awareness | Reddit / Play Store | Reads reviews, installs | 4 hopeful | "Is this another app that needs manual entry?" | Lead screenshot must show auto-categorization, not a blank ledger | Observed (Play listing dwell + install funnel) |
| Acquisition | Signup screen | Phone-OTP signup | 3 | OTP delivery flaky on some carriers | Add WhatsApp-OTP fallback | Observed (12% drop at OTP, support tickets) |
| Onboarding | Import statement | Uploads PDF bank statement | **2 anxious** | "Will my bank data be safe?" + password-protected PDF fails silently | Inline trust copy (DPDP) + clear password-PDF prompt | Observed (40% abandon at import; recent PDF-password fix) |
| **Aha moment** | First categorized view | Sees 1 month auto-sorted | **5 delighted** | — (this is the value moment) | Get her here *faster* — pre-fill from SMS while PDF parses | Observed (users who reach this in <3 min retain 3×) |
| Engagement | Weekly check-in | Opens app on salary day | 3 | No reason to return between salary days | Push a "you spent ₹X on food this week" nudge | Assumed (no retention data yet — alpha) |
| Retention | Month 2 | Re-imports / connects again | ? | Re-import is as painful as first import | Auto-sync so import is one-time | Assumed |
| Advocacy | — | Shares with friends | ? | No share trigger exists | Defer — don't build advocacy while onboarding leaks 40% | Assumed |

**Reading the map.** Two facts jump out. (1) The **emotional trough is at import**
(rating 2, 40% abandonment) — that's the highest-impact fix, not the prettier
dashboard. (2) Everything from Engagement onward is **"assumed"** — there's no
retention data yet because it's a pre-launch alpha. So the advocacy stage is
mapped but flagged: *do not invest in referral mechanics while the onboarding
funnel still loses 40%.* The map's job here was to stop a premature growth bet and
point the July 1 alpha at the import experience.

## When NOT to use this skill

- **You have zero evidence about the real journey.** A map built entirely from
  imagination is a fiction that *feels* like data — worse than no map, because it
  launders guesses into a deliverable. Go run `user-research` first, then map.
- **Single-screen / single-action utility.** A one-shot tool (a tip calculator,
  a one-page converter) has no multi-stage journey worth mapping. Don't manufacture stages.
- **Retention is broken and you're mapping advocacy.** If users churn in week one,
  modeling the advocacy stage is fantasy. Map only as far as your actual funnel
  reaches; fix the leak before charting the loyalty parade.
- **As a substitute for a funnel/cohort analysis.** The journey map is qualitative
  texture (what they *feel* and *think*); it doesn't replace the quantitative
  drop-off numbers from `cohort-analysis`. Use both.

## Pitfalls / failure modes

1. **Mapping the journey you imagine, not the one users live.** The team's mental
   model of "how onboarding works" is almost never what analytics shows. Anchor
   every stage to a real touchpoint and a real number; if you can't, label it
   *assumed* and treat it as a hypothesis.
2. **Inventing emotions.** "User feels confident here" with no quote, no survey, no
   session recording behind it is decoration. Emotion ratings must trace to
   evidence (a frustrated support ticket, a rage-click, an interview quote) or be
   flagged as guesses.
3. **Skipping the support / recovery touchpoints.** Maps love the happy path and
   ignore what happens when something breaks — failed payment, password-protected
   PDF, lost OTP. The recovery touchpoints are where trust is won or lost in
   fintech; map them explicitly.
4. **Vanity advocacy stage.** Tacking on an "Advocacy → users share with friends"
   stage as if it's automatic, when retention is unproven. Advocacy is *earned*
   after the aha moment sticks; don't model (or build for) it while earlier stages leak.
5. **No prioritization — every pain point treated equally.** A map that lists 20
   frictions without ranking them by impact on conversion/retention is a wish
   list. End with the 1–3 highest-leverage fixes, not a flat catalogue.
6. **Mapping once and never updating.** The journey changes every time you ship.
   A map from three releases ago describes a product that no longer exists.

## Relationship to other great-pm skills

- **`improve-retention`** — picks up after the aha moment. Where this map ends
  ("Engagement / Retention"), improve-retention goes deep on habit formation and
  resurrection. The journey map locates *where* retention breaks; improve-retention
  is the playbook to fix it.
- **`hooked-ux`** — the aha moment and the engagement loop on the map are exactly
  the trigger → action → reward → investment cycle Hooked models. Use it to design
  the habit moments the map identifies.
- **`growth-loops`** — the advocacy stage feeds back into awareness/acquisition.
  When (and only when) the earlier stages are healthy, growth-loops turns the
  advocacy touchpoint into an engine.
- **`cohort-analysis`** — supplies the quantitative drop-off numbers that fill the
  Evidence column. Map + cohorts together: the map tells you *why*, cohorts tell
  you *how many*.
- **`jobs-to-be-done`** — the persona's JTBD anchors the whole journey; without it,
  you map a generic user nobody actually is.

---

### Further Reading

- [User Journey Mapping 101](https://www.productcompass.pm/p/user-journey-mapping-101)
- [Funnel Analysis 101: How to Track and Optimize Your User Journey](https://www.productcompass.pm/p/funnel-analysis)
- [Market Research: Advanced Techniques](https://www.productcompass.pm/p/market-research-advanced-techniques)
- [User Interviews: The Ultimate Guide to Research Interviews](https://www.productcompass.pm/p/interviewing-customers-the-ultimate)
