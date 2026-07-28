# GreatPM public MCP privacy notice

**Effective:** 2026-07-28

The public GreatPM MCP server provides read-only product-management methods,
templates, prompts, and workflow preparation.

## Data the application does not request or store

The server has:

- no user accounts;
- no login or cookies;
- no database or durable object;
- no project-file access;
- no connector credentials;
- no advertising or analytics SDK;
- no server-side language-model calls.

Application code does not intentionally log MCP request bodies, tool arguments,
prompt arguments, or resource contents.

## Request processing

When a client calls the server, Cloudflare Workers processes the HTTPS request
to return the requested MCP response. Cloudflare may process standard network
and request metadata, such as IP address, timestamp, URL, response status, and
technical diagnostics, according to the Cloudflare account settings and
Cloudflare's policies.

Do not send secrets, personal data, confidential customer information, or
regulated data in the optional `initiative`, `context`, or `artifact` fields.
The public server does not need that information to return GreatPM guidance.

## Retention

GreatPM application code does not create a persistent record of requests.
Platform metadata retention, if enabled by Cloudflare, is controlled by the
hosting account and Cloudflare service configuration.

## Third-party MCP clients

Your MCP host or AI provider may store prompts, tool arguments, and responses
under its own terms. Review that provider's privacy settings before sending
information through any MCP client.

## Changes

Material changes to data collection, authentication, storage, or external
connectors require an updated privacy notice before deployment.

For private security concerns, use
[GitHub Security Advisories](https://github.com/VandanaAjayDubey111/great-pm/security/advisories/new).
