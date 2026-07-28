import {
  MAX_REQUEST_BYTES,
  boundPublicRequestBody,
  guardPublicRequest,
} from "../src/security";

describe("GreatPM public request guard", () => {
  it("allows localhost and the exact production host", () => {
    expect(
      guardPublicRequest(
        new Request("http://localhost/mcp", {
          method: "POST",
          headers: { host: "localhost" },
          body: "{}",
        }),
        {},
      ),
    ).toBeNull();
    expect(
      guardPublicRequest(
        new Request("https://greatpm-mcp.vandana424-s.workers.dev/mcp", {
          method: "POST",
          headers: { host: "greatpm-mcp.vandana424-s.workers.dev" },
          body: "{}",
        }),
        {},
      ),
    ).toBeNull();
  });

  it("rejects unrelated workers.dev hosts", () => {
    const response = guardPublicRequest(
      new Request("https://unrelated.workers.dev/mcp", {
        method: "POST",
        headers: { host: "unrelated.workers.dev" },
        body: "{}",
      }),
      {},
    );

    expect(response?.status).toBe(403);
  });

  it("rejects a Host outside the default and configured allowlists", () => {
    const response = guardPublicRequest(
      new Request("https://greatpm.example/mcp", {
        method: "POST",
        headers: { host: "attacker.example" },
        body: "{}",
      }),
      {},
    );

    expect(response?.status).toBe(403);
  });

  it("accepts exact configured custom hosts", () => {
    const response = guardPublicRequest(
      new Request("https://mcp.greatpm.example/mcp", {
        method: "POST",
        headers: { host: "mcp.greatpm.example" },
        body: "{}",
      }),
      { ALLOWED_HOSTS: "mcp.greatpm.example" },
    );

    expect(response).toBeNull();
  });

  it("validates browser Origin headers", () => {
    const sameOrigin = guardPublicRequest(
      new Request("https://greatpm-mcp.vandana424-s.workers.dev/mcp", {
        method: "POST",
        headers: {
          host: "greatpm-mcp.vandana424-s.workers.dev",
          origin: "https://greatpm-mcp.vandana424-s.workers.dev",
        },
        body: "{}",
      }),
      {},
    );
    const hostileOrigin = guardPublicRequest(
      new Request("https://greatpm-mcp.vandana424-s.workers.dev/mcp", {
        method: "POST",
        headers: {
          host: "greatpm-mcp.vandana424-s.workers.dev",
          origin: "https://attacker.example",
        },
        body: "{}",
      }),
      {},
    );
    const malformedOrigin = guardPublicRequest(
      new Request("https://greatpm-mcp.vandana424-s.workers.dev/mcp", {
        method: "POST",
        headers: {
          host: "greatpm-mcp.vandana424-s.workers.dev",
          origin: "not a URL",
        },
        body: "{}",
      }),
      {},
    );

    expect(sameOrigin).toBeNull();
    expect(hostileOrigin?.status).toBe(403);
    expect(malformedOrigin?.status).toBe(403);
  });

  it("allows HTTP browser origins only for local development", () => {
    expect(
      guardPublicRequest(
        new Request("http://localhost/mcp", {
          method: "POST",
          headers: {
            host: "localhost",
            origin: "http://127.0.0.1:5173",
          },
          body: "{}",
        }),
        {},
      ),
    ).toBeNull();
    expect(
      guardPublicRequest(
        new Request("https://greatpm-mcp.vandana424-s.workers.dev/mcp", {
          method: "POST",
          headers: {
            host: "greatpm-mcp.vandana424-s.workers.dev",
            origin: "http://public.example",
          },
          body: "{}",
        }),
        { ALLOWED_ORIGINS: "public.example" },
      )?.status,
    ).toBe(403);
  });

  it("rejects declared MCP bodies over 256 KiB", () => {
    const response = guardPublicRequest(
      new Request("http://localhost/mcp", {
        method: "POST",
        headers: {
          host: "localhost",
          "content-length": String(MAX_REQUEST_BYTES + 1),
        },
        body: "{}",
      }),
      {},
    );

    expect(response?.status).toBe(413);
  });

  it("rejects actual MCP bodies over 256 KiB without Content-Length", async () => {
    const request = new Request("http://localhost/mcp", {
      method: "POST",
      headers: { host: "localhost" },
      body: "x".repeat(MAX_REQUEST_BYTES + 1),
    });
    expect(request.headers.get("content-length")).toBeNull();

    const result = await boundPublicRequestBody(request);

    expect(result).toBeInstanceOf(Response);
    expect((result as Response).status).toBe(413);
  });
});
