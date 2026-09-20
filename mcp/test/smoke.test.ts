import worker from "../src/index";

describe("GreatPM Worker", () => {
  it("exports a Cloudflare fetch handler", () => {
    expect(worker).toBeTypeOf("object");
    expect(worker.fetch).toBeTypeOf("function");
  });
});
