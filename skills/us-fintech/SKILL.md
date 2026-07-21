---
name: us-fintech
description: Playbook for product decisions in US fintech — federal + state regulatory matrix, ECOA / Reg B adverse action, FCRA, MLA 36% APR cap, NMLS licensing, CFPB / OCC / state-DFI authority, PCI scope.
when_to_use: |
  Use when an initiative serves US fintech customers — lending, payments,
  cards, neobank, BNPL, investment, insurance. Primarily for
  fintech-pm-reviewer, spec-writer, ai-product-strategist when training on
  US consumer data.
allowed-tools: Read, Write, WebSearch, WebFetch
---

# US Fintech — playbook

US fintech is federal AND state — both apply, often simultaneously. The
classic mistake: launching nationally without state-by-state license
analysis. Consumer protection rules are deep and enforced. Lending rules
(ECOA, FCRA, MLA) carry personal liability for executives. PCI scope
shapes architecture.

## 1. The federal regulator matrix

| Regulator | What they cover | When they care about you |
|---|---|---|
| CFPB | Consumer financial products | Always, if consumer-facing |
| OCC | Federally-chartered banks | If bank partner is OCC-supervised |
| FDIC | Bank deposit insurance | If holding deposits via partner bank |
| SEC | Securities | Investing / brokerage / crypto-as-security |
| FINRA | Broker-dealers | Investment products |
| FinCEN | AML / BSA | Any money-transmission |
| FTC | UDAP (deceptive practices) | Marketing claims; data practices |
| IRS | Tax reporting | 1099, K, B, INT depending on product |

## 2. The state matrix — never assume 50-state coverage

| Category | State concerns |
|---|---|
| Money transmission | State MTL (Money Transmitter License) per state; 49 states have them |
| Lending | State lending license per state; rates capped by state usury laws |
| Insurance | State insurance department licensing per product line |
| Securities | Blue-sky laws + state securities commissioners |
| Debt collection | State debt collector licensing if you ever collect |

**The MTL maze**: state-by-state is the slow path; partnership with
licensed entity (e.g. Synapse pre-collapse, Unit, Increase, banking-as-a-service)
is the fast path with its own counterparty risk.

**NMLS** is the registry for state mortgage + state lending licenses.

## 3. Consumer-credit laws (apply if you LEND)

### ECOA / Regulation B
- **Prohibits discrimination** based on protected classes (race, religion,
  age, sex, marital status, national origin, public assistance,
  exercise of consumer rights).
- **Adverse action notice required** within 30 days of decision; must
  include ≤4 principal reasons.
- **AI-based credit decisions**: still require adverse action; the model
  doesn't excuse the requirement.

### FCRA
- **Permissible purpose** required to pull a consumer report.
- **Dispute resolution** within 30-45 days.
- **Risk-based pricing notice** if pricing varies by credit score.
- **5-year limit** on most negative info; 7 years for bankruptcy.

### TILA / Regulation Z
- **APR disclosure** in standardized form.
- **Right to cancel** for certain credit (3-day rescission for HELOC, etc.).

### Military Lending Act
- **36% APR cap (MAPR)** on consumer credit to active-duty servicemembers
  and dependents.
- **MLA scrub** against DoD database required before extending credit.

### CFPB §1033 (Open Banking, when finalized)
- Consumer right to access their financial data.
- Affects screen-scraping vs API access vs token-based.

## 4. UDAAP — the catch-all the CFPB uses

Unfair / Deceptive / Abusive Acts or Practices. Applies to ALL consumer
financial products. Examples that have produced enforcement:

- Hidden fees discovered only at settlement.
- Misleading interest-rate marketing ("low rate" when only the teaser).
- Auto-enrollment in upgrades.
- Difficulty cancelling (dark patterns).

**PM rule**: every pricing, marketing, fee, and renewal flow should pass
the UDAAP smell test. Document the smell test.

## 5. PCI scope — affects architecture

| Level | When | Effort |
|---|---|---|
| SAQ-A | Card data never touches your servers (full redirect to PSP) | Low |
| SAQ-A-EP | You host a payment page, but card data goes to PSP via JS | Medium |
| SAQ-D | You touch card data (or store it) | High — full PCI-DSS audit |

**Default architecture choice**: stay in SAQ-A scope by using a hosted
checkout (Stripe Checkout, Adyen, etc.). The cost difference between
SAQ-A and SAQ-D is real money.

## 6. Bank-partnership model (most US fintechs use this)

- You're not the bank; a sponsor bank is.
- Bank holds FDIC insurance; you operate the user experience.
- Bank does the regulatory heavy lifting; you pay them.
- **Risks**: sponsor bank exits (Synapse/Evolve collapse 2024); regulator
  flags the bank (Cross River 2023); concentration risk if you have only
  one sponsor.

**PM rule**: name the sponsor bank in your strategy. Plan for them
exiting.

## 7. Customer-money handling primitives

- **For Benefit Of (FBO) accounts**: pool customer funds under
  partner bank; track per-user balance internally.
- **Sweep**: move idle funds to interest-bearing accounts.
- **Custody vs custody-like**: legal distinction matters (and varies by
  state).
- **Segregation**: client funds must be segregated from operational funds.

## 8. State-specific gotchas (sample)

- **NY**: BitLicense (crypto), no-action-letter friendly otherwise.
- **CA**: DFPI (Department of Financial Protection and Innovation)
  active enforcement; strict consumer protection.
- **TX**: looser on some products; OCCC for credit access.
- **CT, NJ, IL**: aggressive lending-license enforcement.

## 9. When great-pm agents consume this skill

| Agent | What it pulls from here |
|---|---|
| fintech-pm-reviewer | Federal + state matrix; consumer-credit laws |
| ai-ethics-pm | ECOA disparate-impact; FCRA adverse-action |
| spec-writer | Adverse-action UX; PCI scope; FBO account model |
| ai-product-strategist | Bank-partnership model; sponsor risk |
| data-strategist | FCRA permissible purpose; consent boundaries |

## 10. References (verify currency)

- CFPB regs and guidance: consumerfinance.gov
- FDIC: fdic.gov
- OCC: occ.treas.gov
- FinCEN: fincen.gov
- NMLS: nmlsconsumeraccess.org
- MLA Database (DoD): mla.dmdc.osd.mil

## 11. The honesty filter

If a US fintech strategy says "we'll do this nationally on day 1" without
naming the 49-state MTL path OR the sponsor bank, it's not a strategy —
it's a wish. Demand specificity.
