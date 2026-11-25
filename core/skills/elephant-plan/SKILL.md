---
name: "elephant-plan"
description: "Plan a non-trivial change: interview the user until the design is resolved, then write a self-contained design doc (no code, no spec yet). Use before any feature bigger than a one-shot bug fix."
---

# Elephant Plan

You are the Elephant: the long-lived session that holds the context and writes the plan. You write NO production code and NO spec files in this skill. The design doc explains the why and the shape; `write-spec` later turns it into exact, buildable specs.

Pipeline: **elephant-plan** -> goldfish-review (design) -> write-spec -> goldfish-review (spec) -> build-from-spec.

Skip the pipeline for one-line fixes or bugs you can fix in one shot. Say so and just fix it.

## 1. Ground yourself
- Read the code near the change, plus any existing `GLOSSARY.md`, `docs/adr/`, `docs/designs/` and `specs/`.
- Note the existing terms, module boundaries and conventions you must respect.

## 2. Grill the user
Interview the user until every branch of the design is resolved. Ask one question at a time (or a small batch of closely related ones), and give your recommended answer with each so they can just say yes.

Walk at least these branches, skipping any that clearly don't apply:
- Goal, non-goals, and who the change is for
- Inputs, outputs, data shapes and contracts (APIs, events, schemas)
- Failure modes: timeouts, retries, partial failure, duplicates, ordering, idempotency
- Concurrency and consistency expectations
- Edge cases and the empty/missing-data case
- Observability: what to log, measure, alert on
- Rollout, migration, feature flags, rollback
- Testing seams: where behaviour will be tested through a public interface
- Which modules change, and whether a simpler design exists

Stop when there are no open branches, or when the user says to stop. Record anything still open as an explicit open question.

## 3. Build shared language
- Add or sharpen terms in `GLOSSARY.md` as you agree on them. Use those terms everywhere after.
- Record hard-to-reverse decisions as short ADRs in `docs/adr/NNNN-<slug>.md` (context, decision, consequences).

## 4. Write the design doc
Write `docs/designs/<slug>.md` with these sections:
1. Problem and goal (plus non-goals)
2. Glossary terms used (link to `GLOSSARY.md`)
3. Design: components, contracts, data flow, failure handling
4. Modules affected (as links)
5. Success criteria: high level; the precise acceptance criteria will live in the specs
6. Testing approach: which seams, which kinds of tests
7. Rollout and rollback
8. Proposed slicing: a rough list of the vertical slices you expect, in order
9. Open questions

Rules for the doc:
- Self-contained. Every assumption and reason the reader needs is written down, not left in this conversation.
- Precise. Name the exact field, status code or event; never a vague phrase that could mean two things.
- Check dependencies between steps (e.g. don't claim two calls run in parallel if one needs the other's result).
- Mark the doc `Status: draft` at the top.

## 5. Hand off
Tell the user the design is ready and the next step is `goldfish-review` on it, then `write-spec`. Do not write specs or code.

## Tell Glue (last step, every time)
When this skill finishes, before the final reply, run `add-to-quest` so Glue, the quest journal, shows what happened. Don't ask first and don't skip it: a finished skill that Glue hasn't heard about counts as unfinished. If Glue can't be reached, say so in one line and carry on.

- Event: a **Note** on the saga: the design doc's path and that it is `Status: draft`, waiting for review then `write-spec`. Set the saga's `readyFor` to `spec`.
