import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";

const promptArguments = z.object({
  initiative: z
    .string()
    .min(3)
    .max(300)
    .describe("The product problem, opportunity, or initiative."),
  context: z
    .string()
    .max(4_000)
    .optional()
    .describe("Optional evidence, constraints, or background."),
  artifact: z
    .string()
    .max(12_000)
    .optional()
    .describe("Optional artifact text to review or improve."),
});

interface PromptDefinition {
  readonly name: string;
  readonly title: string;
  readonly description: string;
  readonly objective: string;
  readonly methodIds: readonly string[];
  readonly templateId?: string;
  readonly output: string;
}

const promptDefinitions: readonly PromptDefinition[] = [
  {
    name: "start-initiative",
    title: "Start a GreatPM initiative",
    description:
      "Frame a product initiative and prepare a human-governed GreatPM lifecycle workflow.",
    objective:
      "Clarify the problem, identify the riskiest assumptions, and propose the first evidence-gathering steps.",
    methodIds: ["continuous-discovery", "jobs-to-be-done", "pre-mortem"],
    output: "An initiative brief, open questions, and a proposed stage-by-stage plan.",
  },
  {
    name: "discover",
    title: "Discover a product opportunity",
    description:
      "Plan problem discovery using interviews, jobs-to-be-done, and opportunity mapping.",
    objective:
      "Separate evidence from assumptions and learn whether the user problem is important enough to solve.",
    methodIds: [
      "user-research",
      "mom-test",
      "jobs-to-be-done",
      "opportunity-solution-tree",
    ],
    templateId: "discovery-brief",
    output: "A discovery brief with research questions, evidence, and decision criteria.",
  },
  {
    name: "strategize",
    title: "Develop product strategy",
    description:
      "Turn validated evidence into explicit product, positioning, and business-model choices.",
    objective:
      "Propose a coherent set of choices, name tradeoffs, and state what the product will not do.",
    methodIds: [
      "product-strategy-stack",
      "working-backwards",
      "competitive-analysis",
    ],
    templateId: "strategy",
    output: "A strategy draft with choices, non-goals, risks, and unresolved decisions.",
  },
  {
    name: "prioritize",
    title: "Prioritize product opportunities",
    description:
      "Compare opportunities using explicit evidence, scoring, outcomes, and tradeoffs.",
    objective:
      "Rank options transparently and propose an outcome-oriented roadmap without hiding uncertainty.",
    methodIds: [
      "prioritization-methods",
      "impact-mapping",
      "outcome-roadmap",
    ],
    templateId: "roadmap",
    output: "A scored recommendation, tradeoff log, and Now/Next/Later outcome roadmap.",
  },
  {
    name: "write-prd",
    title: "Draft a build-ready PRD",
    description:
      "Draft a testable Product Requirements Document (PRD) with scope, non-goals, risks, metrics, and acceptance criteria.",
    objective:
      "Convert a validated product decision into an implementation-ready contract while preserving open decisions.",
    methodIds: ["prd-authoring", "metrics-design", "pre-mortem"],
    templateId: "prd",
    output: "A PRD draft ready for critical review and explicit human specification approval.",
  },
  {
    name: "plan-launch",
    title: "Plan a controlled product launch",
    description:
      "Prepare rollout phases, ownership, communications, readiness checks, and rollback signals.",
    objective:
      "Make launch risk visible and propose a reversible rollout that a human can approve.",
    methodIds: ["launch-readiness", "stakeholder-map", "pre-mortem"],
    templateId: "launch-plan",
    output: "A launch plan with owners, phases, guardrails, rollback criteria, and open decisions.",
  },
  {
    name: "measure-and-learn",
    title: "Measure outcomes and learn",
    description:
      "Evaluate post-launch outcomes with experiments, cohorts, funnels, and explicit learning decisions.",
    objective:
      "Compare results with pre-committed targets and turn evidence into the next discovery questions.",
    methodIds: [
      "experiment-design",
      "cohort-analysis",
      "funnel-diagnostics",
      "growth-loops",
    ],
    templateId: "experiment",
    output: "An evidence-based readout, decision, and next learning plan.",
  },
  {
    name: "review-artifact",
    title: "Review a product artifact",
    description:
      "Critically review a supplied product artifact for evidence, clarity, risks, and unresolved decisions.",
    objective:
      "Stress-test the artifact and report actionable gaps without silently rewriting its decisions.",
    methodIds: ["pre-mortem", "stakeholder-map", "responsible-ai-guardrails"],
    output: "A verdict, strongest evidence, material gaps, and prioritized revision requests.",
  },
  {
    name: "competitive-analysis",
    title: "Analyze competitors",
    description:
      "Analyze the competitive landscape, substitutes, positioning, and defensible opportunities.",
    objective:
      "Distinguish sourced facts from inference and identify choices that could create meaningful differentiation.",
    methodIds: [
      "competitive-analysis",
      "porters-five-forces",
      "swot-analysis",
    ],
    templateId: "competitive-brief",
    output: "A competitive brief with evidence, implications, opportunities, and watch items.",
  },
  {
    name: "metrics-plan",
    title: "Design a product metrics plan",
    description:
      "Define success measures, targets, guardrails, event instrumentation, and review cadence.",
    objective:
      "Pre-commit to measurable outcomes and prevent post-launch goalpost movement.",
    methodIds: ["metrics-design", "experiment-design", "funnel-diagnostics"],
    templateId: "metrics-plan",
    output: "A metrics plan with target, guardrail, formula, event, owner, and review window.",
  },
  {
    name: "pricing-plan",
    title: "Develop a pricing plan",
    description:
      "Develop a pricing hypothesis using value, willingness-to-pay evidence, packaging, and unit economics.",
    objective:
      "Propose testable pricing and packaging choices while exposing assumptions and downside risk.",
    methodIds: ["pricing-models", "cost-model", "pre-mortem"],
    templateId: "pricing-plan",
    output: "A pricing plan with segments, value metric, packages, tests, and decision thresholds.",
  },
] as const;

export function registerPrompts(server: McpServer): void {
  for (const definition of promptDefinitions) {
    server.registerPrompt(
      definition.name,
      {
        title: definition.title,
        description: definition.description,
        argsSchema: promptArguments,
      },
      ({ initiative, context, artifact }) => ({
        description: definition.description,
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: formatPrompt(definition, {
                initiative,
                context,
                artifact,
              }),
            },
          },
        ],
      }),
    );
  }
}

function formatPrompt(
  definition: PromptDefinition,
  input: {
    readonly initiative: string;
    readonly context?: string;
    readonly artifact?: string;
  },
): string {
  const methodResources = definition.methodIds
    .map((id) => `- greatpm://methods/${id}`)
    .join("\n");
  const templateResource = definition.templateId
    ? `\nUse this artifact structure when useful:\n- greatpm://templates/${definition.templateId}\n`
    : "";

  return [
    `Help me with this product initiative: ${input.initiative}`,
    input.context ? `Context:\n${input.context}` : "",
    input.artifact ? `Artifact to review:\n${input.artifact}` : "",
    "",
    `Objective: ${definition.objective}`,
    "",
    "Use these GreatPM method resources as the working playbook:",
    methodResources,
    templateResource,
    `Expected output: ${definition.output}`,
    "",
    "Governance: draft and propose. Separate evidence, assumptions, and open decisions. Do not claim a critical decision is final, approved, shipped, or published; leave approval to the human.",
  ]
    .filter(Boolean)
    .join("\n");
}
