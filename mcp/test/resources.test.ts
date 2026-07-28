import { Client, InMemoryTransport } from "@modelcontextprotocol/client";
import { McpServer } from "@modelcontextprotocol/server";
import { registerResources } from "../src/resources";

async function createConnectedPair() {
  const server = new McpServer({ name: "greatpm-test", version: "1.0.0" });
  registerResources(server);

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

describe("GreatPM MCP resources", () => {
  it("lists the catalog and workflow indexes", async () => {
    const { client, close } = await createConnectedPair();
    try {
      const { resources } = await client.listResources();

      expect(resources.map((resource) => resource.uri)).toEqual([
        "greatpm://catalog",
        "greatpm://workflow",
      ]);
      expect(resources.every((resource) => resource.mimeType)).toBe(true);
    } finally {
      await close();
    }
  });

  it("advertises method, template, and documentation URI templates", async () => {
    const { client, close } = await createConnectedPair();
    try {
      const { resourceTemplates } = await client.listResourceTemplates();

      expect(
        resourceTemplates.map((template) => template.uriTemplate),
      ).toEqual([
        "greatpm://methods/{id}",
        "greatpm://templates/{id}",
        "greatpm://docs/{id}",
      ]);
    } finally {
      await close();
    }
  });

  it("reads the JSON catalog index", async () => {
    const { client, close } = await createConnectedPair();
    try {
      const result = await client.readResource({
        uri: "greatpm://catalog",
      });
      const content = result.contents[0];

      expect(content.mimeType).toBe("application/json");
      expect("text" in content ? JSON.parse(content.text).methods : null).toHaveLength(
        28,
      );
    } finally {
      await close();
    }
  });

  it("reads complete methods, templates, and docs as Markdown", async () => {
    const { client, close } = await createConnectedPair();
    try {
      const method = await client.readResource({
        uri: "greatpm://methods/prd-authoring",
      });
      const template = await client.readResource({
        uri: "greatpm://templates/prd",
      });
      const document = await client.readResource({
        uri: "greatpm://docs/workflow",
      });

      expect("text" in method.contents[0] && method.contents[0].text).toContain(
        "Acceptance Criteria",
      );
      expect(
        "text" in template.contents[0] && template.contents[0].text,
      ).toMatch(/PRD|Product Requirements/i);
      expect(
        "text" in document.contents[0] && document.contents[0].text,
      ).toContain("The loop");
    } finally {
      await close();
    }
  });

  it("returns a protocol error for unknown resource IDs", async () => {
    const { client, close } = await createConnectedPair();
    try {
      await expect(
        client.readResource({ uri: "greatpm://methods/not-real" }),
      ).rejects.toThrow(/not-real|not found|unknown/i);
      await expect(
        client.readResource({ uri: "greatpm://templates/not-real" }),
      ).rejects.toThrow(/not-real|not found|unknown/i);
    } finally {
      await close();
    }
  });
});
