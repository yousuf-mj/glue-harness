---
name: "build-from-spec"
description: "Build one approved spec file test-first, tracing every test to its acceptance criteria, verify it for real, run a goldfish code review against the spec, and write the PR. Refuses to build without an approved spec."
---

# Build From Spec

The spec is the only source of truth. Build exactly what it says: nothing missing, nothing extra. For full-pipeline specs, run in a fresh session given only the spec path, so the build depends on the spec and not on planning chatter. Specs marked `Route: feature` can be built in the same session.

Pipeline: elephant-plan -> goldfish-review (design) -> write-spec -> goldfish-review (spec) -> **build-from-spec**.

Short route: quick-spec -> **build-from-spec**.

## 0. Gate
- Input: a path to one spec file, in `specs/<feature>/` or the spec folder the repo uses.
- If there is no spec, or its status isn't `approved` (or the repo's equivalent, such as `ready`), stop. Tell the user to run `write-spec` or `quick-spec` (or to approve the spec). Do not build from a design doc, a ticket or the conversation.
- If any spec it depends on isn't `done`, stop and say which.
- Read the spec, the index if there is one, `GLOSSARY.md` if there is one, and the files it links to. If anything blocks a first-pass build, stop and ask; don't guess.
- Find the test, type-check and lint commands (package scripts, Makefile, CI config).
- Set the spec to `Status: in-progress`, and mark its tracker row as started if `.agents/tracker.md` exists.
- List your steps with an estimate for each, in agent time. Start every turn-end recap with `Step N of M: <step>, est <time>` and what's running, so the user can see progress without opening the session.

## 1. Red, green, refactor, per acceptance criterion
Work through the spec's test cases in order. Write only the tests the spec lists; an extra test needs a one-line reason in the PR. If the repo writes down test rules (layers, an E2E budget, what not to assert), follow them. Each AC gets **one owning test at the lowest layer that can prove it**: a pure function before a service, a service before a screen, a screen before a browser journey. Don't prove the same behaviour again at a higher layer. For each test case:
1. Write the failing test through the public interface at the seam the spec names. Reference the AC IDs in the test name or a comment (e.g. `AC-003.2`). Add it to the existing test file and helpers for that module before creating a new file. When cases share a shape, use one table-driven test.
2. Run it. Confirm it fails for the right reason.
3. Write the minimum code to pass it.
4. Run that test file. Before each commit, run the repo's changed-tests check if it has one (for example `npm run check:changed`), otherwise the unit suite. Run browser/E2E only for the journey the spec names, once at the end.
5. Refactor while green. Use the names from `GLOSSARY.md` and the exact contracts from the spec.
6. Commit, naming the spec and the ACs covered.

## 2. Spec changes during the build
If the spec turns out wrong or incomplete, stop coding. Propose the change to the user. Once they approve, update the spec first (and the design doc if the change affects it), then continue. Never let code silently diverge from the spec. Small choices the spec left open don't need a stop: make them and list only those that change behaviour.

For `Route: feature` specs, a correction that stays within the agreed scope doesn't need a stop: update the spec, carry on, and note the change in the PR. Stop and ask if scope changes. If the work turns out to touch anything on the Project list in `quick-spec`, or no longer fits one slice, stop and recommend the full pipeline.

## 3. Verify for real
- Merge the latest main into the branch first, so you test what will actually land.
- Run the repo's per-PR check locally on that commit (its changed-tests check if it has one, otherwise the full suite), plus type check and lint, and the E2E journey the spec names, if any. All must pass. Repos that run the full suites at deploy don't need them per PR. Don't rely on hosted CI, and give the commit you tested in the PR.
- Check traceability: every AC in the spec has one owning passing test. List any gaps and close them. If an AC has tests at more than one layer, keep the second only if it proves something the first can't, and say what.
- Mutation-check each new guard (permission check, validation, state rule, transaction), never with uncommitted fixes in the tree: commit, invert the guard, run only its owning test file, then restore it from the commit. A guard that no test catches gets a test or is removed. A guard that only a browser/E2E test catches is missing its lower test.
- If the slice has a UI: open it in a browser at laptop and phone widths, walk every Given/When/Then scenario or acceptance criterion, check the console for errors, and capture screenshots of both as evidence. These walk screenshots are the PR evidence. Don't add screenshot steps to the automated suite for that.
- If it's a service: run it locally and exercise the happy path and the spec's error cases.

## 4. Review
Run the repo's code review if it names one, otherwise `goldfish-review` in code mode against the diff, passing the spec file as the spec (not the design doc). **The reviewer is always fresh-context** (a subagent or session that never saw the build); never review your own build inline. Fix approved blockers, then re-verify. Never CONTEST a rule written in the repo's CLAUDE.md or spec rules: follow it, or ASK.

For `Route: feature` specs, the review is one round and replaces the usual triage with the user:
- Triage the findings yourself, then fix valid blockers and re-verify. Don't re-run the reviewers.
- If a blocker is a security issue, or the fix would change the spec's scope, stop and show the user.
- Put remaining majors in the PR as notes, and drop nits.

## 5. Close out
- Set the spec to `Status: done` and update the index if there is one.
- If `.agents/tracker.md` exists, update the row's Status, PR and actual time (first commit to merge). If the spec has no row, create one. The work isn't closed until this is done.
- Write the PR body:
  - **Summary**: the smallest description or diagram that makes the change clear
  - **Spec**: link, plus a table of AC IDs and the tests that cover each
  - **Evidence**: test output, screenshots, or a log of the real run
  - **Risk**: one-way door or two-way door, the blast radius, and how to roll back
  - **Review notes** (`Route: feature` only): remaining majors and any spec corrections made during the build
  - **Steps**: a table of step | estimate | actual | why it differed (agent time)
- Ask the user before pushing or opening the PR.

## Tell Glue (last step, every time)
When this skill finishes, before the final reply, run `add-to-quest` so Glue shows what happened. Don't ask first and don't skip it: a finished skill that Glue hasn't heard about counts as unfinished. If Glue can't be reached, say so in one line and carry on.

- At the gate: read `Glue quest: <id>` from the spec and move that quest to `onquest`. If the spec has no quest, create one in the repo's realm and add the line to the spec.
- In the PR body: include `glue:<id>`.
- When the PR opens: **PR opened** event. When it merges: **PR merged** event (quest to `ready`; it becomes `done` after a successful deploy).