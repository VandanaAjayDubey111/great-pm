import { Client, InMemoryTransport } from "@modelcontextprotocol/client";
import { McpServer } from "@modelcontextprotocol/server";
import { registerTools } from "../src/tools";

async function createConnectedPair() {
  const server = new McpServer({ name: "greatpm-test", version: "1.0.0" });
  registerTools(server);

  const client = new Client({ name: "greatpm-test-client", version: "1.0.0" });
  const [clientTransport, serverTransport] =
    InMemoryTransport.createLinkedPair();
  await server.connect(serverTransport);
  await client.connect(clientTransport);

  return {
    client,
    close: async () => {
      await client.close();
      await server.close();
    },
  };
}

describe("GreatPM MCP tools", () => {
  it("advertises exactly three safe read-only tools", async () => {
    const { client, close } = await createConnectedPair();
    try {
      const { tools } = await client.listTools();

      expect(tools.map((tool) => tool.name)).toEqual([
        "greatpm_list_methods",
        "greatpm_get_method",
        "greatpm_prepare_workflow",
      ]);
      for (const tool of tools) {
        expect(tool.description?.length).toBeGreaterThan(30);
        expect(tool.inputSchema.type).toBe("object");
        expect(tool.annotations).toMatchObject({
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: false,
        });
      }
    } finally {
      await close();
    }
  });

  it("lists matching method summaries without full Markdown bodies", async () => {
    const { client, close } = await createConnectedPair();
    try {
      const result = await client.callTool({
        name: "greatpm_list_methods",
        arguments: { query: "research", stage: "discover", limit: 3 },
      });
      const output = result.structuredContent as {
        count: number;
        methods: Array<{ id: string; markdown?: string }>;
      };

      expect(result.isError).not.toBe(true);
      expect(output.count).toBeGreaterThan(0);
      expect(output.methods.length).toBeLessThanOrEqual(3);
      expect(output.methods.map((method) => method.id)).toContain(
        "user-research",
      );
      expect(output.methods.every((method) => !method.markdown)).toBe(true);
    } finally {
      await close();
    }
  });

  it("retrieves one complete GreatPM method", async () => {
    const { client, close } = await createConnectedPair();
    try {
      const result = await client.callTool({
        name: "greatpm_get_method",
        arguments: { id: "prd-authoring" },
      });
      const output = result.structuredContent as {
        method: { id: string; markdown: string; resourceUri: string };
      };

      expect(result.isError).not.toBe(true);
      expect(output.method.id).toBe("prd-authoring");
      expect(output.method.markdown).toContain("Acceptance Criteria");
      expect(output.method.resourceUri).toBe(
        "greatpm://methods/prd-authoring",
      );
    } finally {
      await close();
    }
  });

  it("returns a helpful tool error for an unknown method", async () => {
    const { client, close } = await createConnectedPair();
    try {
      const result = await client.callTool({
        name: "greatpm_get_method",
        arguments: { id: "prd" },
      });

      expect(result.isError).toBe(true);
      expect(JSON.stringify(result.content)).toMatch(/prd-authoring/i);
    } finally {
      await close();
    }
  });

  it("prepares a structured workflow without executing it", async () => {
    const { client, close } = await createConnectedPair();
    try {
      const result = await client.callTool({
        name: "greatpm_prepare_workflow",
        arguments: {
          initiative: "Improve activation",
          currentStage: "discover",
          includeStages: ["discover", "define", "launch"],
        },
      });
      const output = result.structuredContent as {
        workflow: {
          stages: Array<{ id: string }>;
          governance: string;
        };
      };

      expect(result.isError).not.toBe(true);
      expect(output.workflow.stages.map((stage) => stage.id)).toEqual([
        "discover",
        "define",
        "launch",
      ]);
      expect(output.workflow.governance).toMatch(/human approval/i);
      expect(JSON.stringify(output)).not.toMatch(/executed|published|shipped/i);
    } finally {
      await close();
    }
  });
});
