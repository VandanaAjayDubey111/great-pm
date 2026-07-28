import {
  getMethod,
  listMethods,
  methodCatalog,
} from "../src/catalog/catalog";

describe("GreatPM method catalog", () => {
  it("contains a curated set of unique methods with lifecycle metadata", () => {
    expect(methodCatalog.length).toBe(28);

    const ids = methodCatalog.map((method) => method.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const method of methodCatalog) {
      expect(method.id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(method.title.length).toBeGreaterThan(2);
      expect(method.description.length).toBeGreaterThan(10);
      expect(method.stage).toMatch(
        /^(discover|strategize|prioritize|define|launch|measure|cross-functional)$/,
      );
      expect(method.tags.length).toBeGreaterThan(0);
      expect(method.markdown).toContain("#");
      expect(method.resourceUri).toBe(`greatpm://methods/${method.id}`);
    }
  });

  it("searches deterministically across method metadata", () => {
    const first = listMethods({ query: "research" });
    const second = listMethods({ query: "RESEARCH" });

    expect(first).toEqual(second);
    expect(first.map((method) => method.id)).toContain("user-research");
    expect(first.map((method) => method.id)).toContain("continuous-discovery");
  });

  it("filters by lifecycle stage", () => {
    const launchMethods = listMethods({ stage: "launch", limit: 50 });

    expect(launchMethods.length).toBeGreaterThan(0);
    expect(launchMethods.every((method) => method.stage === "launch")).toBe(
      true,
    );
    expect(launchMethods.map((method) => method.id)).toContain(
      "launch-readiness",
    );
  });

  it("applies a bounded result limit", () => {
    expect(listMethods({ limit: 2 })).toHaveLength(2);
    expect(() => listMethods({ limit: 0 })).toThrow(/between 1 and 50/i);
    expect(() => listMethods({ limit: 51 })).toThrow(/between 1 and 50/i);
  });

  it("retrieves a complete method by exact ID", () => {
    const method = getMethod("prd-authoring");

    expect(method.title).toMatch(/PRD/i);
    expect(method.markdown).toContain("Acceptance Criteria");
    expect(method.resourceUri).toBe("greatpm://methods/prd-authoring");
  });

  it("suggests close IDs when a method is unknown", () => {
    expect(() => getMethod("prd")).toThrow(/prd-authoring/i);
  });
});
