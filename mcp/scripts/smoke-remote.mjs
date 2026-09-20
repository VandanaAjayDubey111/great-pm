import {
  Client,
  StreamableHTTPClientTransport,
} from "@modelcontextprotocol/client";
import { readFile } from "node:fs/promises";

const endpoint = process.argv[2];
if (!endpoint) {
  throw new Error("Usage: node scripts/smoke-remote.mjs <https://.../mcp>");
}

const url = new URL(endpoint);
if (url.protocol !== "https:" || url.pathname !== "/mcp") {
  throw new Error("Remote smoke endpoint must be an HTTPS /mcp URL.");
}

const packageMetadata = JSON.parse(
  await readFile(new URL("../package.json", import.meta.url), "utf8"),
);
const expectedName = "greatpm-mcp";
const expectedVersion = packageMetadata.version;

const client = new Client({
  name: "greatpm-production-smoke",
  version: "1.0.0",
});
const transport = new StreamableHTTPClientTransport(url);

try {
  await client.connect(transport);
  const serverVersion = client.getServerVersion();
  const [{ tools }, { resources }, { resourceTemplates }, { prompts }] =
    await Promise.all([
      client.listTools(),
      client.listResources(),
      client.listResourceTemplates(),
      client.listPrompts(),
    ]);
  const [method, prompt, listResult, methodResult, workflowResult] =
    await Promise.all([
      client.readResource({
        uri: "greatpm://methods/prd-authoring",
      }),
      client.getPrompt({
        name: "write-prd",
        arguments: { initiative: "Production smoke test" },
      }),
      client.callTool({
        name: "greatpm_list_methods",
        arguments: { query: "pricing", limit: 5 },
      }),
      client.callTool({
        name: "greatpm_get_method",
        arguments: { id: "prd-authoring" },
      }),
      client.callTool({
        name: "greatpm_prepare_workflow",
        arguments: { initiative: "Production smoke test" },
      }),
    ]);

  const methodText =
    "text" in method.contents[0] ? method.contents[0].text : "";
  if (
    serverVersion?.name !== expectedName ||
    serverVersion.version !== expectedVersion ||
    tools.length !== 3 ||
    resources.length !== 2 ||
    resourceTemplates.length !== 3 ||
    prompts.length !== 11 ||
    !methodText.includes("Acceptance Criteria") ||
    prompt.messages.length === 0 ||
    listResult.isError ||
    methodResult.isError ||
    workflowResult.isError
  ) {
    throw new Error("Remote MCP response did not match the release contract.");
  }

  console.log(
    JSON.stringify(
      {
        endpoint,
        server: `${serverVersion.name}@${serverVersion.version}`,
        tools: tools.map((tool) => tool.name),
        resources: resources.length,
        resourceTemplates: resourceTemplates.length,
        prompts: prompts.length,
        calls: {
          listMethods: "ok",
          getMethod: "ok",
          prepareWorkflow: "ok",
        },
      },
      null,
      2,
    ),
  );
} finally {
  await client.close();
}
