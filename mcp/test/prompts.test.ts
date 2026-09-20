import { Client, InMemoryTransport } from "@modelcontextprotocol/client";
import { McpServer } from "@modelcontextprotocol/server";
import { registerPrompts } from "../src/prompts";

const expectedPrompts = [
  "start-initiative",
  "discover",
  "strategize",
  "prioritize",
  "write-prd",
  "plan-launch",
  "measure-and-learn",
  "review-artifact",
  "competitive-analysis",
  "metrics-plan",
  "pricing-plan",
];

async function createConnectedPair() {
  const server = new McpServer({ name: "greatpm-test", version: "1.0.0" });
  registerPrompts(server);

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

describe("GreatPM MCP prompts", () => {
  it("advertises the 11 public product workflow prompts", async () => {
    const { client, close } = await createConnectedPair();
    try {
      const { prompts } = await client.listPrompts();

      expect(prompts.map((prompt) => prompt.name)).toEqual(expectedPrompts);
      expect(
        prompts.every(
          (prompt) =>
            prompt.description && prompt.description.length > 20,
        ),
      ).toBe(true);
      expect(
        prompts.every((prompt) =>
          prompt.arguments?.some(
            (argument) => argument.name === "initiative" && argument.required,
          ),
        ),
      ).toBe(true);
    } finally {
      await close();
    }
  });

  it("returns a method-aware PRD drafting prompt", async () => {
    const { client, close } = await createConnectedPair();
    try {
      const result = await client.getPrompt({
        name: "write-prd",
        arguments: {
          initiative: "Improve activation",
          context: "New users do not reach the first success moment.",
        },
      });
      const text = result.messages
        .map((message) =>
          message.content.type === "text" ? message.content.text : "",
        )
        .join("\n");

      expect(result.description).toMatch(/PRD/i);
      expect(text).toContain("Improve activation");
      expect(text).toMatch(/prd-authoring/i);
      expect(text).toMatch(/greatpm:\/\/methods\//i);
      expect(text).toMatch(/draft|propose/i);
      expect(text).toMatch(/human/i);
    } finally {
      await close();
    }
  });

  it("keeps every public prompt portable across MCP clients", async () => {
    const { client, close } = await createConnectedPair();
    try {
      for (const name of expectedPrompts) {
        const result = await client.getPrompt({
          name,
          arguments: {
            initiative: "Example initiative",
            context: "Example context",
            artifact: "Example artifact",
          },
        });
        const serialized = JSON.stringify(result);

        expect(serialized).not.toMatch(
          /Agent\(|\bBash\b|\/pm-|bd\s|\.great-pm\//,
        );
        expect(serialized).not.toMatch(
          /publish without approval|ship without approval|finalize without approval/i,
        );
      }
    } finally {
      await close();
    }
  });

  it("validates required initiative input", async () => {
    const { client, close } = await createConnectedPair();
    try {
      await expect(
        client.getPrompt({
          name: "discover",
          arguments: {},
        }),
      ).rejects.toThrow(/initiative|required|invalid/i);
    } finally {
      await close();
    }
  });
});
