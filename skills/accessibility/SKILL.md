---
name: accessibility
description: Playbook for product accessibility — WCAG 2.2 AA, ADA Title III (US public accommodations), Section 508 (US federal), EN 301 549 (EU), accessibility-first UX patterns, accessibility testing.
when_to_use: |
  Use for any consumer product, gov / public-sector product, or product
  that may be subject to ADA / Section 508. Primarily for spec-writer,
  consumer-app-pm-reviewer, edtech-pm-reviewer, healthcare-pm-reviewer.
allowed-tools: Read, Write, WebSearch, WebFetch
---

# Accessibility — product-side playbook

Accessibility is product, not legal. The product is more usable for
everyone when designed accessible-first. Legally, ADA Title III lawsuits
have grown rapidly (Domino's, Target, etc.); Section 508 gates federal
sales; EU EN 301 549 + Accessibility Act apply to EU consumer products
from 2025. The market case: ~15% of people have a disability.

## 1. WCAG 2.2 AA — the current standard

W3C Web Content Accessibility Guidelines. The most-referenced standard.

**Four principles (POUR):**
- **Perceivable**: info presented in ways user can perceive (alt text,
  captions, contrast).
- **Operable**: UI usable via keyboard, touch, voice.
- **Understandable**: text + interaction predictable.
- **Robust**: works with assistive tech.

**Levels**: A (basics) / AA (industry standard) / AAA (high bar).
Target: **AA** for most products.

**WCAG 2.2 adds:**
- Focus indicators must be visible (no more invisible focus rings).
- Click targets ≥ 24×24 px (touch targets often ≥ 44×44).
- Dragging gestures need single-pointer alternatives.
- Authentication can't require cognitive test (memorization).
- Help available consistently.

## 2. US legal frame

### ADA Title III (private-sector public accommodations)
- Applies to "public accommodations" — increasingly read to include
  websites and mobile apps.
- Lawsuit surge: 11,000+ web accessibility lawsuits in 2024.
- No specific technical standard mandated; courts treat WCAG 2.1/2.2 AA
  as benchmark.

### Section 508 (federal procurement)
- Required for federal agencies + their vendors.
- Standard: revised Section 508 (2017) aligns with WCAG 2.0 AA.
- VPAT (Voluntary Product Accessibility Template) documents conformance.

### State laws
- California Unruh Act (often invoked for ADA-equivalent state claims).
- NY State Human Rights Law similar.

## 3. EU legal frame

### EN 301 549
- European Standard for ICT accessibility.
- Aligned with WCAG 2.1 AA.

### European Accessibility Act (EAA, 2025)
- Applies from June 2025.
- Covers consumer ICT (e-commerce, banking, e-readers, etc.).
- Penalties at member-state level.

## 4. The accessibility-first UX patterns

| Pattern | Why |
|---|---|
| Semantic HTML | Screen readers + keyboard nav need real `<button>` not `<div onclick>` |
| Visible focus indicators | Keyboard users need to see where focus is |
| Color contrast 4.5:1 (text), 3:1 (large) | Low-vision + glare conditions |
| Don't convey info by color alone | Colorblind users; status icons + text |
| Alt text on meaningful images | Screen readers |
| Captions on video | Deaf + hard-of-hearing + sound-off contexts |
| Form labels + error messages associated | Screen reader announces |
| Logical heading hierarchy (H1 → H2 → H3) | Screen reader navigation |
| Skip-to-content link | Keyboard users bypass repetitive nav |
| Touch targets ≥ 44×44 px | Motor impairment + everyone with finger |
| Avoid auto-play / auto-redirect | Cognitive + screen reader interruption |
| Text alternatives for time-based content | Captions + audio descriptions |

## 5. Testing — combine automated + manual

**Automated tools** catch ~30-40% of issues:
- axe (axe-core for CI)
- Lighthouse accessibility audit
- WAVE
- pa11y

**Manual tests** catch the rest:
- **Keyboard-only navigation** — unplug mouse, navigate everything.
- **Screen reader** — VoiceOver (Mac) / NVDA (Win) / TalkBack (Android).
- **Zoom to 200%, 400%** — text reflow, no horizontal scroll at 320px wide.
- **High contrast mode** — Windows + macOS.
- **Color contrast check** per design.

**User testing** with disabled users — beats every automated tool.

## 6. The VPAT — for B2B/B2gov sales

Voluntary Product Accessibility Template. Procurement often requires it.

- Documents conformance to WCAG 2.0/2.1/2.2 AA, Section 508, EN 301 549.
- Public-facing; honest is better than aspirational.
- Update on major releases.

## 7. PM checklist (per-feature)

- [ ] Keyboard-only walkthrough on the new flow
- [ ] Screen reader walkthrough on the new flow
- [ ] Touch target audit
- [ ] Color contrast check
- [ ] Form labels + errors check
- [ ] No info-by-color-only
- [ ] Captions on any new video
- [ ] Focus indicators visible
- [ ] Skip-to-content link if main nav added
- [ ] axe-core (or equivalent) added to CI for the new pages

## 8. The 5 most common accessibility failures (and fixes)

| Failure | Fix |
|---|---|
| Icon button with no label | Add aria-label or visible text |
| Form field with placeholder-only "label" | Use actual `<label>` |
| Modal that traps focus on open but not on close | Focus management on both open + close |
| Color-only error indicator | Add icon + text |
| Custom dropdown that doesn't work with keyboard | Use semantic `<select>` or implement WAI-ARIA combobox |

## 9. When great-pm agents consume this skill

| Agent | What it pulls from here |
|---|---|
| consumer-app-pm-reviewer | Accessibility-as-product-quality (not legal afterthought) |
| edtech-pm-reviewer | Section 508 (federal-funded schools), WCAG for K-12 |
| healthcare-pm-reviewer | Section 508 for VA / federal health systems |
| spec-writer | Per-feature accessibility checklist embedded in PRD |
| ai-launch-strategist | VPAT readiness for B2B/B2gov launch |

## 10. References

- WCAG 2.2: w3.org/TR/WCAG22/
- Section 508: section508.gov
- EU EAA: ec.europa.eu/social/main.jsp?catId=1202
- VPAT template: itic.org/policy/accessibility/vpat

## 11. The honesty filter

If a product strategy says "we'll add accessibility later", it won't.
Accessibility added later is 5-10× more expensive than designed-in, and
the legal liability accumulates daily. Build it in from sprint 1.
