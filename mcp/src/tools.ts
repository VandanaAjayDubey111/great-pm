import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { getMethod, listMethods } from "./catalog/catalog";
import { lifecycleStages } from "./catalog/types";
import {
  prepareWorkflow,
  workflowStageIds,
  type WorkflowStageId,
} from "./workflow";

const safeToolAnnotations = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
} as const;

const listMethodsInput = z.object({
  query: z
    .string()
    .max(200)
    .optional()
    .describe("Case-insensitive search across method metadata."),
  stage: z
    .enum(lifecycleStages)
    .optional()
    .describe("Only return methods assigned to this lifecycle stage."),
  limit: z
    .number()
    .int()
    .min(1)
    .max(50)
    .default(20)
    .describe("Maximum summaries to return, from 1 to 50."),
});

const getMethodInput = z.object({
  id: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .describe("Exact GreatPM method ID returned by greatpm_list_methods."),
});

const prepareWorkflowInput = z.object({
  initiative: z
    .string()
    .min(3)
    .max(300)
    .describe("The product problem, opportunity, or initiative to plan."),
  context: z
    .string()
    .max(4_000)
    .optional()
    .describe("Optional evidence, constraints, or background."),
  currentStage: z
    .enum(workflowStageIds)
    .optional()
    .describe("The lifecycle stage where work is currently focused."),
  includeStages: z
    .array(z.enum(workflowStageIds))
    .min(1)
    .max(6)
    .optional()
    .describe("Optional subset of lifecycle stages to include."),
});

export function registerTools(server: McpServer): void {
  server.registerTool(
    "greatpm_list_methods",
    {
      title: "List GreatPM methods",
      description:
        "Search the curated GreatPM product-management catalog and return compact method summaries. This read-only tool never loads user data or contacts external systems.",
      inputSchema: listMethodsInput,
      annotations: safeToolAnnotations,
    },
    ({ query, stage, limit }) => {
      const methods = listMethods({ query, stage, limit });
      const output = { count: methods.length, methods };
      return {
        content: [{ type: "text", text: JSON.stringify(output, null, 2) }],
        structuredContent: output,
      };
    },
  );

  server.registerTool(
    "greatpm_get_method",
    {
      title: "Get a GreatPM method",
      description:
        "Retrieve the complete Markdown guidance and metadata for one curated GreatPM method by its exact ID. The result is static, read-only repository content.",
      inputSchema: getMethodInput,
      annotations: safeToolAnnotations,
    },
    ({ id }) => {
      try {
        const method = getMethod(id);
        const output = { method };
        return {
          content: [{ type: "text", text: method.markdown }],
          structuredContent: output,
        };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown method error.";
        return {
          content: [{ type: "text", text: message }],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "greatpm_prepare_workflow",
    {
      title: "Prepare a GreatPM workflow",
      description:
        "Prepare a deterministic, human-governed product workflow using GreatPM's six lifecycle stages, recommended methods, artifacts, and approval gates. It plans work but does not execute or publish anything.",
      inputSchema: prepareWorkflowInput,
      annotations: safeToolAnnotations,
    },
    ({ initiative, context, currentStage, includeStages }) => {
      try {
        const workflow = prepareWorkflow({
          initiative,
          context,
          currentStage: currentStage as WorkflowStageId | undefined,
          includeStages: includeStages as WorkflowStageId[] | undefined,
        });
        const output = { workflow };
        return {
          content: [
            {
              type: "text",
              text: formatWorkflow(workflow),
            },
          ],
          structuredContent: output,
        };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown workflow error.";
        return {
          content: [{ type: "text", text: message }],
          isError: true,
        };
      }
    },
  );
}

function formatWorkflow(
  workflow: ReturnType<typeof prepareWorkflow>,
): string {
  const stages = workflow.stages
    .map((stage) => {
      const gate = stage.gate ? `\n  Human gate: ${stage.gate.id}` : "";
      return [
        `- ${stage.title}: ${stage.objective}`,
        `  Methods: ${stage.methodIds.join(", ")}`,
        `  Artifacts: ${stage.artifacts.join(", ")}`,
        gate,
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  return [
    `# GreatPM workflow: ${workflow.initiative}`,
    "",
    stages,
    "",
    `Governance: ${workflow.governance}`,
    `Next action: ${workflow.suggestedNextAction}`,
  ].join("\n");
}
