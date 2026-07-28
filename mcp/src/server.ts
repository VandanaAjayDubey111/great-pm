import { McpServer, preloadSchemas } from "@modelcontextprotocol/server";
import { registerPrompts } from "./prompts";
import { registerResources } from "./resources";
import { registerTools } from "./tools";

preloadSchemas();

export const serverIdentity = {
  name: "greatpm-mcp",
  version: "1.0.0",
} as const;

export function createGreatPmServer(): McpServer {
  const server = new McpServer(serverIdentity, {
    instructions:
      "GreatPM is a public, read-only product-management methodology server. Use resources for full guidance, prompts to start common product jobs, and tools to discover methods or prepare a workflow. It does not access user projects or external systems. All critical product decisions require human approval.",
    cacheHints: {
      "tools/list": { ttlMs: 3_600_000, cacheScope: "public" },
      "prompts/list": { ttlMs: 3_600_000, cacheScope: "public" },
      "resources/list": { ttlMs: 3_600_000, cacheScope: "public" },
      "resources/templates/list": {
        ttlMs: 3_600_000,
        cacheScope: "public",
      },
      "server/discover": { ttlMs: 3_600_000, cacheScope: "public" },
    },
  });

  registerTools(server);
  registerResources(server);
  registerPrompts(server);

  return server;
}
