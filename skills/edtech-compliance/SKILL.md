---
name: edtech-compliance
description: Playbook for edtech regulatory compliance — COPPA (US under-13), FERPA (US schools), GDPR-K (EU age of digital consent matrix), state student-privacy laws (CA, NY 2-D, etc.), Section 508 accessibility.
when_to_use: |
  Use when an initiative serves K-12 / minor / school-based users.
  Primarily for edtech-pm-reviewer, spec-writer (consent / age-gate UX),
  data-strategist (student data scope), ai-ethics-pm (fairness for minors).
allowed-tools: Read, Write, WebSearch, WebFetch
---

# Edtech compliance — product-side playbook

Edtech compliance is a thicket: federal (COPPA, FERPA), state (CA, NY,
IL, others), international (GDPR-K), and overlapping. The default
assumption is wrong: most consumer-app compliance frameworks DO NOT cover
edtech sufficiently. Building edtech requires this overlay.

## 1. COPPA (US, under-13)

Children's Online Privacy Protection Act. Applies if:
- Product directed at children under 13, OR
- Product has actual knowledge it's collecting from under-13.

**Required:**
- **Verifiable Parental Consent (VPC)** before collecting any personal
  info from under-13.
- Parents can review / delete collected info.
- Reasonable security measures.
- Limited retention.
- No conditioning service on more info than reasonably necessary.

**Acceptable VPC methods** (FTC rule):
- Signed consent form (mail / fax / scan-back).
- Credit card transaction (small charge to verify adult).
- Government-issued ID verification.
- Video conference verification.
- Knowledge-based authentication (KBA).

**Common mistakes**:
- "Click here to confirm you're 13+" — NOT VPC.
- Treating parental email confirmation as VPC — NOT enough alone.
- Treating school-channel signup as automatic VPC — only works under
  specific school-authorized-agent doctrine.

## 2. FERPA (US schools)

Family Educational Rights and Privacy Act. Applies to:
- Educational institutions receiving federal funding (most K-12 and
  higher-ed in US).
- Their vendors (you, if you serve schools).

**Key concepts**:
- **Education records** are protected.
- **School official exception**: vendor can be treated as school
  official for FERPA purposes IF: legitimate educational interest, under
  direct control of school (BAA-like agreement), school authorizes access.
- **Parental access**: parents have right to review records of their
  under-18 child.
- **Directory info**: limited disclosure allowed unless parent opts out.

**Vendor agreement** (sometimes called "DPA" — Data Processing Agreement):
- Required between vendor and school district.
- Many states have model forms (e.g. CA SOPIPA, NY 2-D).

## 3. GDPR-K — EU age of digital consent matrix

GDPR sets default age of digital consent at 16, but member states can
lower to 13.

| Country | Age |
|---|---|
| Default (and Germany, NL, IE, LU, others) | 16 |
| Spain, France, Slovenia | 14 (15 in France) |
| Italy, Greece, UK, Belgium, Czech, Denmark, Estonia, Latvia, Sweden | 13 |

**PM implication**: launching across EU requires age gate + per-country
parental consent flow if applicable. Default to 16 if uncertain.

## 4. State student-privacy laws (US)

Layered on top of federal FERPA + COPPA:

| State | Law | Key points |
|---|---|---|
| California | SOPIPA (Student Online Personal Information Protection Act) | Forbids targeted ads; forbids selling student data |
| California | AB 1584 | Strict vendor contract requirements |
| New York | Education Law §2-D | Parents' Bill of Rights; data security standards |
| Illinois | SOPPA (similar to CA) | + State Board of Education tool registration |
| Colorado, Connecticut, Iowa, etc. | Various | Each different; check state-by-state |

**California + NY in particular**: products without their compliance
will not get adopted by their districts.

## 5. Section 508 accessibility (US public-sector schools)

Federally-funded schools require Section 508 compliance for ICT (info &
comms tech).

- **WCAG 2.0 / 2.1 AA** is the working standard.
- VPAT (Voluntary Product Accessibility Template) — districts ask for it.

## 6. Age-gate UX patterns that work

- **Date of birth entry** (with sanity check — refusal of impossible dates
  like 1900).
- Server-side age calc, not client-side trust.
- **No back-button bypass** (track attempt; flag if user tries multiple
  dates).
- For US: differentiate under-13 (COPPA path), 13-17 (some state laws),
  18+ (standard adult).
- For EU: country lookup + age-of-consent matrix.

## 7. School-vs-consumer dual path

Many edtech products serve BOTH schools and consumers. Patterns:

- **School path**: school authorizes vendor (FERPA school-official
  exception); district signs DPA; teacher/admin onboards students. No
  individual VPC needed because school authority covers it.
- **Consumer path**: VPC required for under-13; parental account creates
  child account; explicit per-data-type consent.

**PM rule**: don't conflate the two paths in UX or backend. The legal
basis is different; the data flow should be different too.

## 8. Operational checklist for K-12 launch

- [ ] Age gate at signup
- [ ] VPC path for under-13 (if consumer)
- [ ] FERPA school-official DPA template ready (if B2school)
- [ ] State DPA variants (CA AB 1584, NY 2-D, IL SOPPA at minimum)
- [ ] Privacy policy explicit about no-target-ads, no-data-sale (SOPIPA)
- [ ] No third-party tracking on minor pages (CCPA + SOPIPA)
- [ ] Section 508 VPAT
- [ ] Parental access portal (review child data, delete, opt-out)
- [ ] Breach notification flow per state law

## 9. When great-pm agents consume this skill

| Agent | What it pulls from here |
|---|---|
| edtech-pm-reviewer | The full compliance frame; school-vs-consumer path |
| spec-writer | Age gate UX; VPC flows; parental portal |
| data-strategist | Student data scope; FERPA school-official doctrine |
| ai-ethics-pm | No-targeting rule; minor fairness audits |

## 10. References

- COPPA: ftc.gov/coppa
- FERPA: studentprivacy.ed.gov
- CA SOPIPA: leginfo.legislature.ca.gov
- NY 2-D: nysed.gov/data-privacy-security
- IL SOPPA: isbe.net/Pages/Student-Online-Personal-Protection-Act.aspx

## 11. The honesty filter

If an edtech strategy says "we handle minor data" without explicitly
naming the COPPA + FERPA path, it's not. Demand the path per user type.
