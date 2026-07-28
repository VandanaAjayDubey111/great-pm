const worker: ExportedHandler = {
  async fetch(): Promise<Response> {
    return Response.json({
      name: "GreatPM MCP",
      status: "ok",
    });
  },
};

export default worker;
