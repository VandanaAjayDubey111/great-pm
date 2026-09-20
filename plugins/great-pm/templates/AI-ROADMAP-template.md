# AI Roadmap — <YYYY-Qn>

> Authored by ai-roadmap-planner. 3-layer view (data / model / product)
> with explicit cross-layer dependencies. Pairs with roadmap-planner's
> standard themed roadmap.

**Period:** <quarter / horizon>
**Owner:** <name>
**Date:** <YYYY-MM-DD>
**Status:** DRAFT | REVIEWED | APPROVED

---

## Headline

<One paragraph: where we are, where we're going this period, what the
bottleneck layer is.>

> **The bottleneck layer this period is: DATA | MODEL | PRODUCT**
> Because: <one-line>

---

## The 3-layer grid

### Now (this period, in flight)

| Layer | Theme | Bet | Linked initiative | Owner |
|---|---|---|---|---|
| PRODUCT | <theme> | <one-line> | <slug> | <name> |
| PRODUCT | <theme> | <one-line> | <slug> | <name> |
| MODEL | <theme> | <one-line> | <slug> | <name> |
| MODEL | <theme> | <one-line> | <slug> | <name> |
| DATA | <theme> | <one-line> | <slug> | <name> |
| DATA | <theme> | <one-line> | <slug> | <name> |

### Next (committed for next period)

| Layer | Theme | Bet | Tied to which Now item | Owner |
|---|---|---|---|---|
| PRODUCT | <theme> | <one-line> | <Now-MODEL-theme> | <name> |
| MODEL | <theme> | <one-line> | <Now-DATA-theme> | <name> |
| DATA | <theme> | <one-line> | — (foundation) | <name> |

### Later (direction signaled; uncommitted)

| Layer | Theme | Why it might matter | Conditions to commit |
|---|---|---|---|
| PRODUCT | <theme> | <one-line> | <conditions> |
| MODEL | <theme> | <one-line> | <conditions> |
| DATA | <theme> | <one-line> | <conditions> |

---

## Cross-layer dependency map

```
DATA themes →  enable  →  MODEL themes →  enable  →  PRODUCT themes

  data-X      ────────►   model-Y      ────────►    product-Z
  data-A      ────────►   model-B      ────────►    product-C
                          model-D      ────────►    product-E
                          (no new data needed)
```

### Slips and surfaces

> Product themes whose required model/data work is in Later — these
> WILL slip unless reordered.

- **<product-theme>** depends on **<model-theme in Later>** → slip risk.
  Options:
  1. Move model-theme to Next or Now.
  2. Move product-theme to Later.
  3. Cut the product-theme.

---

## Per-theme detail

### Theme: <name>
- **Layer**: data | model | product
- **Bet**: <one-line>
- **Tied initiative(s)**: <slugs>
- **Leading KPI**: <metric>
- **Cross-layer dependencies**: <other themes>
- **Kill criterion**: <when to stop investing>
- **Stakeholders**: <people>
- **Resource ask**: <people-weeks / $ / etc.>

### Theme: <name>
*<repeat>*

---

## Strategic narratives

### 1. What this roadmap optimizes for

<One paragraph: the strategic posture this period. Are we investing in
moat (data layer)? Capability (model layer)? User reach (product layer)?>

### 2. What we're NOT prioritizing

<Honest list of plausible themes we're cutting / deferring + why.>

### 3. The commoditization watch

<For each model-layer theme: what happens if the underlying model commoditizes
in 12 months? Does the bet still work? If not, it's a fragile theme.>

### 4. Bottleneck argument

<Why DATA / MODEL / PRODUCT is the bottleneck this period — with
evidence from past period's drag.>

---

## Reconciliation with non-AI roadmap

This roadmap is the AI section of the unified product roadmap. roadmap-
planner integrates these themes with non-AI themes for the full picture
at: `.great-pm/drafts/roadmap-<YYYY-Qn>.md`.

| AI-roadmap theme | Non-AI roadmap counterpart | Coupling |
|---|---|---|
| <AI theme> | <non-AI theme that depends on it> | tight / loose |

---

## Changelog (this version)

| Date | Change | Approver |
|---|---|---|
| <YYYY-MM-DD> | Initial | <name> |
| <YYYY-MM-DD> | Moved <X> from Next → Now | <name> |
| <YYYY-MM-DD> | Cut <Y> from Later (changed market signal) | <name> |

---

> Reviewed by: pm-reviewer (steelman + counter on bottleneck argument).
> Approved by: human (via /pm-gate approve gate:strategy at first
> commitment).
> Re-reviewed: quarterly or on major shift.
