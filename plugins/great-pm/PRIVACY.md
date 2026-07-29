# GreatPM Privacy

GreatPM is a local-first product-management plugin. The plugin does not operate
a GreatPM-owned backend, create a GreatPM account, or send telemetry to the
GreatPM maintainers.

## Data handled locally

GreatPM reads product context from the repository in which you use it and writes
its working state to that repository's `.great-pm/` directory. Its packaged
skills, workflows, templates, board, scripts, and hooks run in the Codex host
environment under the permissions you approve.

## Codex and connected services

Prompts, repository content, and tool results used in a Codex session are
processed according to the terms and privacy controls of your Codex account.
When you explicitly configure a GreatPM connector, the selected third-party
service may receive the data required for that action. Its own privacy policy
then applies.

GreatPM does not enable connectors automatically. Review connector settings and
the plugin's hooks before approving them, and do not place credentials in
product artefacts or committed configuration.

## Questions

For privacy questions, open a repository issue without including confidential
product information, customer data, or credentials.
