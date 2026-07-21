---
name: pci-bundle
description: Playbook for PCI-DSS scope decisions from a product perspective — SAQ-A vs SAQ-A-EP vs SAQ-D, card-data flow architecture, tokenization, SCA / PSD2 (EU), 3DS 2.x, scope-reduction patterns.
when_to_use: |
  Use when any initiative touches card payment data (PAN, CVV, magnetic
  stripe, cardholder data) or interacts with card networks. Primarily for
  fintech-pm-reviewer, spec-writer, ai-product-strategist (architectural
  cost of PCI scope), ai-launch-strategist (3DS implications).
allowed-tools: Read, Write, WebSearch, WebFetch
---

# PCI-DSS — product-side playbook

PCI scope is the single biggest hidden cost in payment products. SAQ-A
(low scope) vs SAQ-D (full scope) is the difference between 2-week
integration and 9-month audit. PMs decide scope through the product
architecture — not through the audit phase.

## 1. The SAQ levels (Self-Assessment Questionnaire)

| Level | When | Effort | Annual cost (typical) |
|---|---|---|---|
| **SAQ-A** | Card data NEVER touches your servers; full redirect to PSP | ~30 questions | ~$0 (self-attestation) |
| **SAQ-A-EP** | You host the payment page, but card data goes via JS to PSP iframe/redirect | ~140 questions | $5-15K (QSA may help) |
| **SAQ-B / B-IP** | Card-present (POS / terminal) — physical | Varies | $5-25K |
| **SAQ-C / C-VT** | Virtual terminal, not network-integrated | ~80 questions | $5-15K |
| **SAQ-D** | You touch / store / process card data on your servers | ~330 questions, full PCI-DSS controls | $50-200K+ + recurring |

**Default architecture choice**: build for SAQ-A. The cost difference is
real money you don't have to spend.

## 2. What pushes you out of SAQ-A scope

- **Capturing card data in any form on your server** (even if you forward
  it).
- **Caching PAN** in any application memory you control.
- **Hosting the payment form** (not just iframe).
- **Logging that includes card data** (even partial).
- **Custom checkout that doesn't redirect to PSP**.

**Common architecture choice**: PSP-hosted checkout (Stripe Checkout,
Adyen Drop-in, Braintree DropIn). User clicks "pay" → PSP page → PSP
handles card → PSP redirects back to you with a token. SAQ-A.

## 3. Tokenization — the core scope-reduction trick

- **PSP-side tokens**: PSP holds the card, gives you a token. You store
  the token; never see the card. SAQ-A.
- **Network tokens**: Visa/MC issue tokens that replace PAN at network
  level. Useful for card-on-file UX without raising scope.
- **Mandate in India**: card tokenization mandatory since Sep 2022 (RBI).

## 4. PSD2 / Strong Customer Authentication (SCA) — EU

PSD2 requires **Strong Customer Authentication** (2 of 3: knowledge,
possession, inherence) for most card transactions in EU/UK.

- **3DS 2.x** is the standard mechanism (challenge flows, frictionless
  flows).
- **Exemptions**: low value, low risk, trusted beneficiaries, MIT
  (Merchant Initiated Transactions).
- **Failure mode**: 3DS challenge timeouts → cart abandonment. Design
  for it.

**PM rule**: assume challenge flow on first transaction; design for it,
celebrate when frictionless. Measure 3DS abandonment as a metric.

## 5. UK / EU specifics

- **PSD2 SCA** applies (above).
- **PSR (Payment Services Regulation, UK 2024)**: APP fraud reimbursement
  shifts to receiving + sending banks.
- **Open Banking (UK)**: alternative to cards for some flows.

## 6. PCI-DSS v4 (current as of 2026)

PCI-DSS v4.0 took effect April 2024; full enforcement March 2025.

Key changes from v3.2.1:
- **Customizable approach** allowed alongside defined approach.
- **More frequent penetration tests** for some entities.
- **Targeted risk analysis** required.
- **MFA strengthened**.
- **Authenticated scanning** for internal vulnerabilities.

## 7. Recurring payments — special considerations

- **Card-on-file** requires user consent + clear cadence disclosure.
- **Failed-payment retry logic**: be careful of network rules (don't
  exceed permitted retries).
- **Subscription auto-renew**: SCA exempt as MIT if first transaction
  was SCA-compliant AND you registered the relationship.

## 8. Refunds & disputes — operational reality

- **Chargeback ratio**: card networks monitor; > 1% triggers
  consequences (excessive chargeback program).
- **Dispute representment**: window to fight (typically 7-30 days
  depending on network).
- **First-party fraud / friendly fraud**: increasing problem in 2024+.

## 9. Architectural decisions PMs should make explicit

| Decision | SAQ-A option | SAQ-D option |
|---|---|---|
| Checkout UX | PSP-hosted page (redirect) | Custom checkout on your servers |
| Card-on-file | PSP tokens | Vault on your servers |
| Recurring | PSP subscription product | DIY in your billing system |
| Backend ops (refunds, etc.) | PSP API only | Touch card data directly |

**For 95% of products, SAQ-A is the right answer.**

## 10. When great-pm agents consume this skill

| Agent | What it pulls from here |
|---|---|
| fintech-pm-reviewer | The SAQ scope decision; PSD2/SCA impact on conversion |
| spec-writer | Checkout UX architecture; 3DS challenge UX |
| ai-product-strategist | Cost-of-scope as a strategic choice |
| ai-launch-strategist | SCA abandonment as a launch metric |
| ai-cost-optimizer | SCA exemption strategy (cost of fraud vs cost of friction) |

## 11. References

- PCI SSC: pcisecuritystandards.org
- PCI-DSS v4.0: pcisecuritystandards.org/documents
- PSD2 + SCA: ec.europa.eu (EBA RTS)
- 3DS 2.x: emvco.com

## 12. The honesty filter

If a payment product strategy doesn't explicitly state its target SAQ
level, ask: which? The answer reveals whether the team has done the
architecture work or is hoping to figure it out in audit.
