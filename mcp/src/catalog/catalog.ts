import { generatedMethods } from "../generated/catalog";
import type {
  GreatPmMethod,
  ListMethodsOptions,
  MethodSummary,
} from "./types";

export const methodCatalog: readonly GreatPmMethod[] = generatedMethods.map(
  (method) => ({
    ...method,
    resourceUri: `greatpm://methods/${method.id}`,
  }),
);

export function listMethods(
  options: ListMethodsOptions = {},
): readonly MethodSummary[] {
  const limit = options.limit ?? 20;
  if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
    throw new Error("Method result limit must be between 1 and 50.");
  }

  const query = options.query?.trim().toLocaleLowerCase("en") ?? "";
  return methodCatalog
    .filter((method) => !options.stage || method.stage === options.stage)
    .filter((method) => {
      if (!query) return true;
      const haystack = [
        method.id,
        method.title,
        method.description,
        method.stage,
        ...method.tags,
      ]
        .join(" ")
        .toLocaleLowerCase("en");
      return haystack.includes(query);
    })
    .slice(0, limit)
    .map(({ markdown: _markdown, ...summary }) => summary);
}

export function getMethod(id: string): GreatPmMethod {
  const method = methodCatalog.find((candidate) => candidate.id === id);
  if (method) return method;

  const query = id.trim().toLocaleLowerCase("en");
  const suggestions = methodCatalog
    .filter(
      (candidate) =>
        candidate.id.includes(query) || query.includes(candidate.id),
    )
    .slice(0, 3)
    .map((candidate) => candidate.id);
  const suggestionText = suggestions.length
    ? ` Did you mean: ${suggestions.join(", ")}?`
    : "";

  throw new Error(`Unknown GreatPM method "${id}".${suggestionText}`);
}
