---
name: consumer-privacy
description: Playbook for consumer-privacy compliance — CCPA / CPRA (California), state privacy laws (VA / CO / CT / UT / TX / others), India DPDP overlay, sensitive-data special handling, opt-out signals, do-not-sell.
when_to_use: |
  Use for consumer-facing products processing US, India, or multi-state
  data. Primarily for consumer-app-pm-reviewer, fintech-pm-reviewer,
  data-strategist, spec-writer (consent UX).
allowed-tools: Read, Write, WebSearch, WebFetch
---

# Consumer privacy — product-side playbook

US consumer privacy is no longer "just California". A dozen states have
comprehensive privacy laws (2023-2026), and India's DPDP Act adds
another regime. Each has slightly different definitions, thresholds,
and user rights. The PM job is to design the consent + opt-out UX once
in a way that satisfies all.

## 1. The US state-privacy landscape (mid-2026)

| State | Law | In force | Key features |
|---|---|---|---|
| California | CCPA + CPRA | 2020 / 2023 | DNS (Do Not Sell), opt-out + opt-in for sensitive, private right of action for breaches |
| Virginia | CDPA | 2023 | Similar to CPRA; no PROA |
| Colorado | CPA | 2023 | Universal opt-out signal recognition (Global Privacy Control) |
| Connecticut | CTDPA | 2023 | GPC + sensitive-data opt-in |
| Utah | UCPA | 2023 | Weaker; B2B-friendly |
| Texas | TDPSA | 2024 | Broad applicability |
| Iowa, Indiana, Tennessee | Various | 2024-2026 | Generally similar to VA |
| Montana, Oregon, Delaware, NH, NJ | Various | 2024-2026 | Various |
| Washington | My Health My Data Act | 2024 | Health-data specific; opt-in for sensitive |

**Number is growing.** 15+ states by end of 2026.

## 2. The common thread (across most)

Every state law shares this skeleton:

- **Consumer rights**: access, delete, correct, opt-out of sale / targeted ads.
- **Sensitive data**: separate treatment (sexual orientation, immigration
  status, biometrics, geolocation precise, health, etc.).
- **Privacy notice**: required, with specifics.
- **Vendor agreements**: required.
- **Universal opt-out signals**: increasingly required (GPC).

## 3. Universal opt-out signals (GPC / DNT)

Global Privacy Control (GPC) — a browser-level opt-out signal.

- **CA, CO, CT, OR** require honoring GPC.
- More states will likely follow.
- Engineering implications: detect the signal at server-side AND
  client-side, propagate, respect.

**PM implication**: build GPC detection into the privacy stack from
launch. Retrofitting at scale is painful.

## 4. Sensitive data — special handling

Across most state laws, "sensitive personal information" includes:

- Racial / ethnic origin
- Religious or philosophical beliefs
- Sexual orientation
- Citizenship / immigration status
- Health / medical info
- Genetic / biometric data
- Precise geolocation
- Children's data
- Mental health (Washington MHMDA)

**Treatment varies:**
- CA: opt-out of sale (and limit use/disclosure of sensitive).
- VA/CO/CT/UT: opt-in required for sensitive.
- WA MHMDA: strict opt-in for health.

**PM rule**: design sensitive data flows assuming opt-IN is required.
That covers more jurisdictions; CA's opt-out becomes a no-op for users
who haven't opted in anyway.

## 5. Consumer rights operational SLAs

Mostly aligned across states:

- **Verifiable request**: must verify the requester is the consumer.
- **Response window**: 45 days (extendable to 90 with notice).
- **Free for first request per year**; reasonable fee for excessive.
- **No retaliation** for exercising rights.

**PM implication**: build a self-service privacy portal. Manual ops
collapses at scale.

## 6. Privacy notice — the disclosure layer

Required fields (composite of state laws):

- Categories of personal data collected.
- Purposes of collection.
- Categories of recipients (vendors / third parties).
- Whether personal data is sold / used for targeted ads.
- Sensitive-data treatment.
- Consumer rights + how to exercise.
- Authorized agent process.
- Retention period.
- Contact info.

**PM rule**: don't write privacy notice as one giant block of legalese.
Layer it: short summary up front, detail behind clicks. Some states are
beginning to require this.

## 7. India DPDP — overlay for global products

DPDP Act 2023 (India) sits alongside US state laws for products with
Indian users. Key differences:
- **Notice required in 22 languages** on demand.
- **Verifiable parental consent for under-18** (vs US-13).
- **Significant Data Fiduciary** designation may apply.
- **Cross-border transfer**: government can restrict.

(See `india-fintech` skill for more.)

## 8. Vendor / subprocessor management

- **Data Processing Agreement (DPA)** required with every vendor that
  processes consumer data.
- **Subprocessor list** maintained, often disclosed publicly.
- **Vendor due diligence** before signing.

**PM rule**: maintain the subprocessor list as a real document, not a
fiction. Audit-readiness depends on it.

## 9. Targeted ads — the opt-out moment

Most state laws give a right to opt out of "targeted advertising" /
"profiling". Implications:

- Default targeted ads = OPT-OUT required (most states).
- Display the opt-out clearly (footer link is common).
- Honor GPC (universal opt-out).
- For sensitive data: targeted ads typically require OPT-IN.

## 10. Operational checklist (US + India)

- [ ] Privacy notice drafted, reviewed, layered UX
- [ ] Cookie / tracking consent banner (where required)
- [ ] GPC server + client detection
- [ ] Consumer rights self-service portal
- [ ] Verification flow for rights requests
- [ ] DSAR queue + 45-day SLA tracker
- [ ] Sensitive-data opt-in flow
- [ ] Subprocessor list public + maintained
- [ ] DPA template for all vendors
- [ ] DPDP-compliant notice + age-of-consent matrix
- [ ] Breach notification flow per state
- [ ] Privacy training for all teams handling data

## 11. When great-pm agents consume this skill

| Agent | What it pulls from here |
|---|---|
| consumer-app-pm-reviewer | Privacy notice + consent UX + DSAR portal |
| fintech-pm-reviewer | Sensitive-data treatment + state matrix |
| data-strategist | Sensitive-data opt-in design + vendor management |
| spec-writer | Consent UX patterns + opt-out flows + GPC respect |
| ai-ethics-pm | Sensitive-data fairness; profiling opt-out |

## 12. References

- CCPA + CPRA: cppa.ca.gov
- IAPP state tracker: iapp.org/resources/article/us-state-privacy-legislation-tracker
- GPC: globalprivacycontrol.org
- WA MHMDA: atg.wa.gov
- India DPDP: meity.gov.in

## 13. The honesty filter

If a privacy posture says "we comply with CCPA", that's table stakes; ask
about the next 14 states. The architecture must be multi-state by
default, not California-first then retrofit.
