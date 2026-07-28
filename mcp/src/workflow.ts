export const workflowStageIds = [
  "discover",
  "strategize",
  "prioritize",
  "define",
  "launch",
  "measure",
] as const;

export type WorkflowStageId = (typeof workflowStageIds)[number];

export interface WorkflowGate {
  readonly id: "gate:strategy" | "gate:spec" | "gate:launch";
  readonly decision: string;
}

export interface WorkflowStage {
  readonly id: WorkflowStageId;
  readonly title: string;
  readonly objective: string;
  readonly methodIds: readonly string[];
  readonly artifacts: readonly string[];
  readonly gate?: WorkflowGate;
}

export interface PrepareWorkflowInput {
  readonly initiative: string;
  readonly context?: string;
  readonly currentStage?: WorkflowStageId;
  readonly includeStages?: readonly WorkflowStageId[];
}

export interface PreparedWorkflow {
  readonly initiative: string;
  readonly context?: string;
  readonly stages: readonly WorkflowStage[];
  readonly governance: string;
  readonly suggestedNextAction: string;
}

export const workflowStages: readonly WorkflowStage[] = [
  {
    id: "discover",
    title: "Discover",
    objective: "Validate the user problem and collect evidence before solutioning.",
    methodIds: [
      "continuous-discovery",
      "jobs-to-be-done",
      "user-research",
      "mom-test",
      "opportunity-solution-tree",
    ],
    artifacts: [
      "research plan",
      "interview evidence",
      "validated problem statement",
      "opportunity map",
    ],
  },
  {
    id: "strategize",
    title: "Strategize",
    objective: "Make explicit choices about position, value, and business model.",
    methodIds: [
      "competitive-analysis",
      "product-strategy-stack",
      "working-backwards",
      "pricing-models",
    ],
    artifacts: [
      "strategy narrative",
      "competitive position",
      "value proposition",
      "pricing hypothesis",
    ],
  },
  {
    id: "prioritize",
    title: "Prioritize",
    objective: "Rank opportunities and commit to outcomes before feature scope.",
    methodIds: [
      "prioritization-methods",
      "impact-mapping",
      "outcome-roadmap",
      "brainstorm-okrs",
    ],
    artifacts: ["scored options", "outcome roadmap", "objectives and key results"],
    gate: {
      id: "gate:strategy",
      decision: "A human confirms the validated problem earns a roadmap slot.",
    },
  },
  {
    id: "define",
    title: "Define",
    objective: "Specify a build-ready solution and pre-commit to success measures.",
    methodIds: ["prd-authoring", "metrics-design", "pre-mortem"],
    artifacts: [
      "product requirements document",
      "acceptance criteria",
      "metrics and instrumentation plan",
      "risk register",
    ],
    gate: {
      id: "gate:spec",
      decision: "A human confirms the specification is clear and build-ready.",
    },
  },
  {
    id: "launch",
    title: "Launch",
    objective: "Plan a controlled rollout with ownership and rollback signals.",
    methodIds: ["launch-readiness", "stakeholder-map"],
    artifacts: [
      "launch plan",
      "go-to-market plan",
      "stakeholder communications",
      "rollback criteria",
    ],
    gate: {
      id: "gate:launch",
      decision: "A human confirms the product is ready for production launch.",
    },
  },
  {
    id: "measure",
    title: "Measure and Learn",
    objective: "Evaluate outcomes honestly and feed evidence into discovery.",
    methodIds: [
      "experiment-design",
      "cohort-analysis",
      "funnel-diagnostics",
      "growth-loops",
    ],
    artifacts: [
      "experiment readout",
      "metric review",
      "learning summary",
      "next discovery questions",
    ],
  },
] as const;

const stageIdSet = new Set<string>(workflowStageIds);
const governance =
  "GreatPM methods draft and propose. A human reviews critical decisions and gives explicit human approval at strategy, specification, and launch gates.";

export function prepareWorkflow(
  input: PrepareWorkflowInput,
): PreparedWorkflow {
  const initiative = input.initiative.trim();
  if (initiative.length < 3 || initiative.length > 300) {
    throw new Error("Initiative must be between 3 and 300 characters.");
  }
  if (input.context && input.context.length > 4_000) {
    throw new Error("Context must not exceed 4,000 characters.");
  }
  if (input.currentStage && !stageIdSet.has(input.currentStage)) {
    throw new Error(`Unknown current stage "${input.currentStage}".`);
  }
  if (input.includeStages && input.includeStages.length === 0) {
    throw new Error("Include at least one stage.");
  }
  for (const stage of input.includeStages ?? []) {
    if (!stageIdSet.has(stage)) {
      throw new Error(`Unknown included stage "${stage}".`);
    }
  }

  const selectedStageIds = input.includeStages
    ? new Set(input.includeStages)
    : undefined;
  const stages = workflowStages
    .filter((stage) => !selectedStageIds || selectedStageIds.has(stage.id))
    .map(cloneStage);
  const focus = input.currentStage ?? stages[0]?.id ?? "discover";
  const focusStage = workflowStages.find((stage) => stage.id === focus);
  const focusIndex = workflowStages.findIndex((stage) => stage.id === focus);
  const upcomingGate = workflowStages
    .slice(Math.max(0, focusIndex))
    .find((stage) => stage.gate)?.gate;
  const gateText = upcomingGate
    ? ` Prepare toward ${upcomingGate.id}, but leave the decision to the human reviewer.`
    : "";

  return {
    initiative,
    ...(input.context?.trim() ? { context: input.context.trim() } : {}),
    stages,
    governance,
    suggestedNextAction: `Start with ${focusStage?.title ?? "Discover"}: ${focusStage?.objective ?? workflowStages[0].objective}${gateText}`,
  };
}

function cloneStage(stage: WorkflowStage): WorkflowStage {
  return {
    ...stage,
    methodIds: [...stage.methodIds],
    artifacts: [...stage.artifacts],
    ...(stage.gate ? { gate: { ...stage.gate } } : {}),
  };
}
