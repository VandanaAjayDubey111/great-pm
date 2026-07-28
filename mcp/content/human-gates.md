# GreatPM human gates

GreatPM uses three explicit human checkpoints for decisions that should not be
delegated to an automated system.

## Strategy gate

Approve the target customer, problem, positioning, strategic choices, and
success outcome before committing substantial definition work.

Review:

- strength and recency of the evidence;
- alternatives and deliberate non-goals;
- unresolved assumptions and competitive risks;
- the metric that will show whether the strategy worked.

## Specification gate

Approve scope only when the proposed product can be built and verified without
silent decisions.

Review:

- testable user stories and acceptance criteria;
- edge cases, limits, abuse cases, and failure behavior;
- instrumentation, target, and guardrail metrics;
- open decisions, owners, deadlines, and safe defaults.

## Launch gate

Approve release only when the team can detect harm, stop rollout, and recover.

Review:

- readiness evidence and known residual risks;
- rollout stages, monitoring, and rollback triggers;
- support, communication, privacy, and security readiness;
- who owns the decision during and after launch.

An MCP client may use GreatPM material to prepare a recommendation, but the
client must present these gates to a person. It must not claim that a gate was
passed or that a product decision was approved without explicit human action.
