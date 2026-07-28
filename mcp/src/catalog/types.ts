export const lifecycleStages = [
  "discover",
  "strategize",
  "prioritize",
  "define",
  "launch",
  "measure",
  "cross-functional",
] as const;

export type LifecycleStage = (typeof lifecycleStages)[number];

export interface GeneratedMethod {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly markdown: string;
  readonly stage: LifecycleStage;
  readonly tags: readonly string[];
}

export interface GreatPmMethod extends GeneratedMethod {
  readonly resourceUri: `greatpm://methods/${string}`;
}

export type MethodSummary = Omit<GreatPmMethod, "markdown">;

export interface ListMethodsOptions {
  readonly query?: string;
  readonly stage?: LifecycleStage;
  readonly limit?: number;
}
