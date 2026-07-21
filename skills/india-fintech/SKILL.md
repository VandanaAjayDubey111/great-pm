---
name: india-fintech
description: Playbook for product decisions in Indian fintech — UPI rails, RBI regulatory frame, DPDP Act 2023, NPCI conventions, customer-money handling, Tier-1 vs Tier-2 vs Tier-3 KYC limits.
when_to_use: |
  Use when an initiative serves Indian fintech customers OR moves money
  in/through India. Primarily for fintech-pm-reviewer, ai-product-strategist,
  data-strategist when training on Indian data, spec-writer when writing
  India-touching PRDs.
allowed-tools: Read, Write, WebSearch, WebFetch
---

# India Fintech — playbook

India fintech is a high-volume, low-margin, regulated environment. UPI
moves ~10 billion transactions/month. The same product fails for entirely
different reasons here vs the US/EU — different rails, different KYC
tiers, different consent law (DPDP, not GDPR), different fraud patterns,
different language coverage.

## 1. The rails — pick deliberately

| Rail | Use case | Reality |
|---|---|---|
| UPI (NPCI) | P2P, P2M, recurring (UPI Autopay) | Free for users; revenue-thin for builders |
| IMPS / NEFT / RTGS | Larger transfers, B2B | Slower, fee-bearing |
| Bharat Bill Payment (BBPS) | Bill payments | NPCI's centralized layer |
| Cards (NPCI RuPay + Visa/MC) | E-commerce, retail | Card tokenization mandatory (2022) |
| AEPS (Aadhaar Enabled) | Last-mile rural | KYC via Aadhaar |
| ONDC | Open commerce protocol | Newer; lighter regulatory frame |

Default for most consumer fintech: **UPI as the primary rail.** Plan
revenue around features other than transaction fees (UPI is free).

## 2. RBI regulatory frame — know your category

| Category | What it does | License needed |
|---|---|---|
| Bank | Full banking | Bank license (rare for new entrants) |
| NBFC | Lending, financing | NBFC registration |
| Payment Aggregator (PA) | Collect payments on behalf of merchants | RBI PA license (since 2020) |
| Payment Gateway (PG) | Tech provider, no merchant funds | Lighter, no PA license required |
| PSO (Payment System Operator) | Operate a payment system | PSO license |
| Account Aggregator (AA) | Consent-based data flow | AA framework (NBFC-AA license) |
| TReDS / NeSL / CIC | Specialized infra | Specific licenses |

**The line:** if you touch customer funds at any point (custody, even
T+0 transit), PA license likely applies. If you're tech-only and money
flows directly bank-to-bank, PG framework is lighter.

## 3. DPDP Act 2023 — India's consent law

Different from GDPR. Key differences PMs must internalize:

- **Notice + consent are pillar.** Notice must be in 22 scheduled
  languages on demand (not just English/Hindi).
- **Verifiable parental consent for under-18** (vs GDPR-K's 13-16 range).
- **Significant Data Fiduciary (SDF) designation** triggers stricter
  obligations — your platform may get designated if you process
  significant volume.
- **Data Principal rights**: access, correction, erasure, grievance.
- **Cross-border transfer**: government can restrict to specific
  countries. Don't assume EU-style freedom.
- **Penalties**: up to ₹250 crore per breach.

**PM rule of thumb**: design the consent UX once for DPDP; it'll satisfy
most other regimes.

## 4. KYC tiers — design product flow around them

| Tier | Limit | What's required | UX implication |
|---|---|---|---|
| Min-KYC | ₹10K/mo wallet, ₹1L/year | Aadhaar OTP + PAN | Fast onboarding (minutes) |
| Full KYC | Higher limits | Video KYC OR in-person | Slow (hours to days) |
| Re-KYC | Periodic | Per RBI re-KYC schedule | Friction; design re-engagement |

**PM rule**: front-load Min-KYC, save Full-KYC for the moment user
needs the higher limit. Don't gate first value on Full-KYC.

## 5. India-specific patterns to design for

- **Vernacular (22 languages)**: not just translation; transliteration
  affects search, merchant matching, classification. Hindi-Latin mixed
  is the norm.
- **Low-data, intermittent connectivity**: design for it. Heavy first-load
  + offline-capable thereafter beats always-online.
- **Cash-out is a feature**: most consumers want to extract value as cash
  somewhere. Pure-digital is harder than it looks.
- **Festival cycles**: October-November (Diwali) drives 30%+ of consumer
  spending. Plan launches around it, not against it.
- **Tier-2 / Tier-3 cities**: 70% of population, different UX (number-pad
  preferred, voice-first growing).
- **Fraud patterns**: UPI phishing, SIM-swap, social engineering
  ("KYC update required"). RBI mandates 2FA + transaction limits.

## 6. The Account Aggregator (AA) framework

If your product needs financial data from other banks (for credit,
budgeting, etc.):

- **Consent-based data flow** via licensed AA (Finvu, Onemoney, Cookiejar,
  etc.).
- **Time-bound consent** (max 1 year, user-revocable).
- **Specific data types** (bank txn, mutual fund, insurance, GST).
- **No data resale** — strict.

For products like Acme that ingest bank data: **AA is the right path
long-term**, even if you start with Gmail-OCR + CSV.

## 7. Operational realities to plan for

- **Settlement cycles**: T+0 for UPI, T+1 for cards. Reconcile daily.
- **Chargebacks**: card chargeback risk; UPI mostly final.
- **Customer support load**: WhatsApp + IVR are the channels users use.
  Email is not a real channel for the mass market.
- **Founder visibility**: RBI ombudsman can summon founders; have
  governance and grievance officer in place.

## 8. When great-pm agents consume this skill

| Agent | What it pulls from here |
|---|---|
| fintech-pm-reviewer | The whole frame — jurisdictional scope + KYC tiers + DPDP |
| ai-product-strategist | Data moat re Indian fintech; AA framework; vernacular |
| data-strategist | DPDP scope; AA framework; cross-border restriction |
| spec-writer | Consent UX; DPDP-compliant flows; KYC tier design |
| ai-launch-strategist | Festival cycle planning; vernacular launch copy |

## 9. References (verify currency before relying)

- RBI Master Directions on PA/PG (current version on rbi.org.in)
- DPDP Act 2023 + Rules (when notified)
- NPCI guidelines (npci.org.in)
- RBI tokenization mandate (Sep 2022)
- Account Aggregator: sahamati.org.in (industry org)

## 10. The honesty filter

If a product strategy assumes "we'll be like Stripe" or "we'll be like
PhonePe", ask: which specific Indian regulatory pivot did they survive?
The answer reveals whether the strategy actually grappled with India's
specifics.
