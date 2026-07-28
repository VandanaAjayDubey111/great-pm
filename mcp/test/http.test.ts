import {
  Client,
  StreamableHTTPClientTransport,
} from "@modelcontextprotocol/client";
import worker from "../src/index";
import { createGreatPmServer } from "../src/server";

const executionContext = {
  waitUntil: () => undefined,
  passThroughOnException: () => undefined,
  props: {},
} as unknown as ExecutionContext;

async function invoke(
  path: string,
  init: RequestInit = {},
  env: Record<string, string> = {},
) {
  const request = new Request(`http://localhost${path}`, {
    ...init,
    headers: {
      host: "localhost",
      ...Object.fromEntries(new Headers(init.headers)),
    },
  });
  return invokeWorker(request, env);
}

function invokeWorker(
  request: globalThis.Request,
  env: Record<string, string>,
): Promise<Response> {
  if (!worker.fetch) {
    throw new Error("Worker does not export a fetch handler.");
  }
  return Promise.resolve(
    worker.fetch(request as never, env, executionContext),
  );
}

describe("GreatPM Worker HTTP interface", () => {
  it("creates a server with all public capabilities", async () => {
    const server = createGreatPmServer();
    expect(server).toBeDefined();
    expect(server.isConnected()).toBe(false);
    await server.close();
  });

  it("serves discovery metadata and health", async () => {
    const root = await invoke("/");
    const health = await invoke("/health");
    const rootBody = (await root.json()) as Record<string, unknown>;
    const healthBody = (await health.json()) as Record<string, unknown>;

    expect(root.status).toBe(200);
    expect(rootBody).toMatchObject({
      name: "GreatPM MCP",
      version: "1.0.0",
      transport: "streamable-http",
      mcp: "/mcp",
      authentication: "none",
      access: "read-only",
    });
    expect(health.status).toBe(200);
    expect(healthBody).toEqual({ status: "ok", service: "greatpm-mcp" });
  });

  it("returns JSON 404s and security headers", async () => {
    const response = await invoke("/not-real");

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: "Not found." });
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
    expect(response.headers.get("referrer-policy")).toBe("no-referrer");
    expect(response.headers.get("content-security-policy")).toContain(
      "default-src 'none'",
    );
  });

  it("rejects guarded MCP requests before protocol handling", async () => {
    const response = await invokeWorker(
      new Request("https://greatpm.example/mcp", {
        method: "POST",
        headers: {
          host: "attacker.example",
          "content-type": "application/json",
        },
        body: "{}",
      }),
      {},
    );

    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ error: "Forbidden." });
  });

  it("initializes and calls tools over Streamable HTTP", async () => {
    const localFetch: typeof fetch = async (input, init) => {
      const original = new Request(input, init);
      const headers = new Headers(original.headers);
      headers.set("host", "localhost");
      const request = new Request(original, { headers });
      return invokeWorker(request, {});
    };
    const transport = new StreamableHTTPClientTransport(
      new URL("http://localhost/mcp"),
      { fetch: localFetch },
    );
    const client = new Client({
      name: "greatpm-http-test",
      version: "1.0.0",
    });

    try {
      await client.connect(transport);
      const { tools } = await client.listTools();
      const result = await client.callTool({
        name: "greatpm_list_methods",
        arguments: { query: "pricing", limit: 5 },
      });

      expect(tools).toHaveLength(3);
      expect(result.isError).not.toBe(true);
      expect(JSON.stringify(result.structuredContent)).toContain(
        "pricing-models",
      );
    } finally {
      await client.close();
    }
  });
});
