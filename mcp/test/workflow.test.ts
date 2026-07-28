import {
  prepareWorkflow,
  workflowStages,
} from "../src/workflow";

describe("GreatPM workflow preparation", () => {
  it("defines the six ordered lifecycle stages and three human gates", () => {
    expect(workflowStages.map((stage) => stage.id)).toEqual([
      "discover",
      "strategize",
      "prioritize",
      "define",
      "launch",
      "measure",
    ]);

    const gates = workflowStages
      .filter((stage) => stage.gate)
      .map((stage) => stage.gate?.id);
    expect(gates).toEqual(["gate:strategy", "gate:spec", "gate:launch"]);
  });

  it("prepares a complete workflow with methods and expected artifacts", () => {
    const result = prepareWorkflow({
      initiative: "Improve new-user activation",
      context: "Users abandon setup before reaching the first success moment.",
    });

    expect(result.initiative).toBe("Improve new-user activation");
    expect(result.stages).toHaveLength(6);
    expect(
      result.stages.every(
        (stage) => stage.methodIds.length > 0 && stage.artifacts.length > 0,
      ),
    ).toBe(true);
    expect(result.governance).toMatch(/draft and propose/i);
    expect(result.governance).toMatch(/human approval/i);
    expect(result.suggestedNextAction).toMatch(/discover/i);
  });

  it("selects requested stages without changing lifecycle order", () => {
    const result = prepareWorkflow({
      initiative: "Launch team workspaces",
      includeStages: ["launch", "define", "measure"],
    });

    expect(result.stages.map((stage) => stage.id)).toEqual([
      "define",
      "launch",
      "measure",
    ]);
  });

  it("uses the current stage to recommend the next action", () => {
    const result = prepareWorkflow({
      initiative: "Rework pricing",
      currentStage: "strategize",
    });

    expect(result.suggestedNextAction).toMatch(/strategize/i);
    expect(result.suggestedNextAction).toMatch(/gate:strategy/i);
  });

  it("returns fresh values and does not mutate caller input", () => {
    const includeStages = ["discover", "define"] as const;
    const input = {
      initiative: "Improve search",
      includeStages: [...includeStages],
    };
    const before = structuredClone(input);

    const first = prepareWorkflow(input);
    const second = prepareWorkflow(input);

    expect(input).toEqual(before);
    expect(first).toEqual(second);
    expect(first).not.toBe(second);
    expect(first.stages).not.toBe(second.stages);
  });

  it("validates initiative, context, stages, and empty selections", () => {
    expect(() => prepareWorkflow({ initiative: "x" })).toThrow(
      /3 and 300 characters/i,
    );
    expect(() =>
      prepareWorkflow({
        initiative: "Valid initiative",
        context: "x".repeat(4_001),
      }),
    ).toThrow(/4,000 characters/i);
    expect(() =>
      prepareWorkflow({
        initiative: "Valid initiative",
        currentStage: "build" as never,
      }),
    ).toThrow(/current stage/i);
    expect(() =>
      prepareWorkflow({
        initiative: "Valid initiative",
        includeStages: [],
      }),
    ).toThrow(/at least one stage/i);
  });
});
