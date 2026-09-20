import {
  ResourceNotFoundError,
  ResourceTemplate,
  type McpServer,
} from "@modelcontextprotocol/server";
import { getMethod, listMethods } from "./catalog/catalog";
import {
  generatedDocs,
  generatedTemplates,
} from "./generated/catalog";
import { workflowStages } from "./workflow";

const publicCacheHint = {
  ttlMs: 3_600_000,
  cacheScope: "public" as const,
};

export function registerResources(server: McpServer): void {
  server.registerResource(
    "greatpm-catalog",
    "greatpm://catalog",
    {
      title: "GreatPM public catalog",
      description:
        "Index of curated GreatPM methods, templates, and documentation.",
      mimeType: "application/json",
      cacheHint: publicCacheHint,
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify(
            {
              methods: listMethods({ limit: 50 }),
              templates: generatedTemplates.map(({ id, title }) => ({
                id,
                title,
                resourceUri: `greatpm://templates/${id}`,
              })),
              docs: generatedDocs.map(({ id, title }) => ({
                id,
                title,
                resourceUri: `greatpm://docs/${id}`,
              })),
            },
            null,
            2,
          ),
        },
      ],
    }),
  );

  server.registerResource(
    "greatpm-workflow",
    "greatpm://workflow",
    {
      title: "GreatPM six-stage workflow",
      description:
        "The Discover, Strategize, Prioritize, Define, Launch, and Measure product lifecycle with human gates.",
      mimeType: "application/json",
      cacheHint: publicCacheHint,
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify({ stages: workflowStages }, null, 2),
        },
      ],
    }),
  );

  server.registerResource(
    "greatpm-method",
    new ResourceTemplate("greatpm://methods/{id}", {
      list: undefined,
      complete: {
        id: (value) =>
          listMethods({ query: value, limit: 20 }).map((method) => method.id),
      },
    }),
    {
      title: "GreatPM method",
      description: "Complete Markdown guidance for a curated GreatPM method.",
      mimeType: "text/markdown",
      cacheHint: publicCacheHint,
    },
    async (uri, variables) => {
      const id = String(variables.id ?? "");
      try {
        const method = getMethod(id);
        return {
          contents: [
            {
              uri: uri.href,
              mimeType: "text/markdown",
              text: method.markdown,
            },
          ],
        };
      } catch {
        throw new ResourceNotFoundError(
          uri.href,
          `Unknown GreatPM method "${id}".`,
        );
      }
    },
  );

  server.registerResource(
    "greatpm-template",
    new ResourceTemplate("greatpm://templates/{id}", {
      list: undefined,
      complete: {
        id: (value) =>
          generatedTemplates
            .filter((template) => template.id.startsWith(value))
            .map((template) => template.id),
      },
    }),
    {
      title: "GreatPM artifact template",
      description: "Reusable Markdown template for a product artifact.",
      mimeType: "text/markdown",
      cacheHint: publicCacheHint,
    },
    async (uri, variables) => {
      const id = String(variables.id ?? "");
      const template = generatedTemplates.find((entry) => entry.id === id);
      if (!template) {
        throw new ResourceNotFoundError(
          uri.href,
          `Unknown GreatPM template "${id}".`,
        );
      }
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "text/markdown",
            text: template.markdown,
          },
        ],
      };
    },
  );

  server.registerResource(
    "greatpm-document",
    new ResourceTemplate("greatpm://docs/{id}", {
      list: undefined,
      complete: {
        id: (value) =>
          generatedDocs
            .filter((document) => document.id.startsWith(value))
            .map((document) => document.id),
      },
    }),
    {
      title: "GreatPM documentation",
      description: "Selected public GreatPM architecture and workflow guidance.",
      mimeType: "text/markdown",
      cacheHint: publicCacheHint,
    },
    async (uri, variables) => {
      const id = String(variables.id ?? "");
      const document = generatedDocs.find((entry) => entry.id === id);
      if (!document) {
        throw new ResourceNotFoundError(
          uri.href,
          `Unknown GreatPM document "${id}".`,
        );
      }
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "text/markdown",
            text: document.markdown,
          },
        ],
      };
    },
  );
}
