---
name: "devex-design"
description: "Design or audit the developer and agent experience of an API, SDK, CLI, event contract, library or MCP server: usage-first design, contracts, errors, docs, and a fresh-agent time-to-first-success test."
---

# DevEx Design

For any surface consumed by someone else's code: public or partner APIs, SDKs, CLIs, events and webhooks other teams subscribe to, libraries, MCP servers other agents call. The consumer is often an agent, so design for a newcomer who reads only the docs and parses output.

Skip it when the only consumers are your own agents working inside the repo; the glossary, specs, contracts and tests already cover that.

Two modes:
- **plan**: design the experience before building
- **audit**: test the real thing as a newcomer and compare against the plan

Pipeline: discover -> ux-design -> **devex-design** -> goldfish-review (design) -> elephant-plan -> write-spec -> roadmap -> build-from-spec -> devex-design audit -> retro.

Output goes in `docs/designs/<slug>-devex/`.

## Plan mode

### 1. Intake
Ask in rounds, using the multiple-choice question tool when available (always allow a free answer; recommend an option first).
- **Who:** internal teams, external developers, or other agents? Experience level, languages and frameworks
- **Job:** what are they trying to build with this, and what's the first thing they'll try?
- **Today:** how do they do it now, and what slows them down?
- **Targets:** time to first success (e.g. first successful call in under 5 minutes), number of steps, number of new concepts to learn
- **Constraints:** auth model, rate limits, compatibility and versioning promises, compliance
- **References:** developer products they consider excellent, and existing conventions in your own APIs to stay consistent with

Save to `brief.md`.

### 2. Research
Study the named references and your existing surfaces. Record conventions to follow (naming, pagination, errors, auth, versioning) and what makes the best ones fast to start with. Write `research.md` with cited links.

### 3. Write the usage first
Before any contract, write `usage.md`: the quickstart and 3-5 real tasks exactly as a consumer would write them (code, curl, CLI commands, event handlers, MCP tool calls). If the usage reads awkwardly, the design is wrong; change it now. Count steps and concepts against the targets.

### 4. Design the contracts
Check each that applies:
- **APIs:** resource names from `GLOSSARY.md`, consistent verbs, pagination, filtering, idempotency keys for writes, versioning, request IDs in every response
- **Errors:** a stable machine-readable code, a human message, and how to fix it; correct status codes; never leak internals
- **Events and webhooks:** schema per event, versioning and evolution rules, ordering guarantees, at-least-once delivery and how to dedupe, retries and backoff, dead-letter and replay, signature verification
- **CLI:** sensible defaults, `--help` with examples, `--json` output, meaningful exit codes, non-interactive mode for CI
- **SDK/library:** idiomatic per language, typed, safe defaults, small surface, no hidden network calls
- **MCP/agent tools:** clear tool names and descriptions, typed inputs, compact outputs, actionable errors
- **Local development:** sandbox or test mode, fixtures, mocks, seed data
- **Change policy:** what counts as breaking, the deprecation window, and how it's announced

Draft machine-readable contracts where they fit (OpenAPI, AsyncAPI, JSON Schema) next to `devex.md`.

### 5. Docs plan
List the docs needed: quickstart, task guides, reference generated from contracts, error reference, changelog. The quickstart in `usage.md` becomes the real one.

### 6. Review
Run `goldfish-review` on this folder (stage mode): a fresh reviewer tries each usage task from the docs and contracts alone. Triage with the user.

## Audit mode
Run after the build, against the real thing.
1. Spawn a fresh subagent with only the public docs and access to the sandbox or local environment. No repo internals, no conversation.
2. Task it: "Starting from zero, complete the quickstart and each task. Log every step, every error message you hit, every time you had to guess, and the elapsed time."
3. Compare its log against the plan's targets (time to first success, steps, concepts).
4. Report the gaps, most severe first: broken docs, unhelpful errors, missing defaults, confusing names. Triage with the user and route fixes through write-spec and build-from-spec.

## Tell Glue (last step, every time)
When this skill finishes, before the final reply, run `add-to-quest` so Glue shows what happened. Don't ask first and don't skip it: a finished skill that Glue hasn't heard about counts as unfinished. If Glue can't be reached, say so in one line and carry on.

- Plan mode: **Stage finished** for the saga, stage `ui-design` (Glue's trail stage for devex too), linking the devex contract.
- Audit mode: a **Note** on the saga with the top gaps found.
