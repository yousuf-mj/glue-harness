---
name: "write-spec"
description: "Turn an approved design doc into exact, testable spec files (one per vertical slice) that are the only thing code may be built from. Use after the design has passed goldfish-review."
---

# Write Spec

Specs are the contract for building. Code is written only from an approved spec, never from the design doc or the conversation. The design says why and roughly how; the spec says exactly what, precisely enough that a fresh session could build it with no questions.

Specs live on main. Main's spec folder is the queue of work: every draft and every approved spec that isn't done is there, so nothing waits on a branch or in a chat where it can be lost.

Pipeline: elephant-plan -> goldfish-review (design) -> **write-spec** -> goldfish-review (spec) -> build-from-spec.

## 0. Preconditions
- Input: a design doc path. Read it, the files it links to, `GLOSSARY.md` and relevant ADRs.
- If the design is still `Status: draft` or has unresolved blockers or open questions that affect behaviour, stop and say which ones. Don't paper over gaps in the spec.
- Read `docs/decisions/<slug>.md` and apply its standing rules (`sign-off` step 1). If the design has no signed-off entry there, stop and run `sign-off` on it first.
- When the design is ready, set it to `Status: approved`.
- If you are in a chat without the repo checked out, attach the repo now. A spec that only exists in a chat is not a spec yet.
- Read the spec folder's README. If it sets its own rule for how specs reach main, follow it where it differs from this skill.

## 1. Slice
Start from the design's proposed slicing. Each slice must be a thin vertical slice: end-to-end through the layers, shippable and testable on its own. Order slices by dependency. Confirm the slice list with the user before writing.

## 2. Write the files
Use the spec folder and numbering the repo already has. Otherwise create `specs/<feature-slug>/`. Take each number from the latest main (fetch it first), never from a branch.

**`specs/<feature-slug>/README.md`** (index, or the repo's existing index)
- Link to the design doc
- Slice table: ID, title, status, depends on
- Dependency order
- The `sign-off` layout across the whole set: a summary at the top, then decisions and your actions at the end

**One file per slice**, with these sections:
1. Header: `Status: draft` (draft -> approved -> done; use the repo's names if it has them, such as `ready`), design link, depends on
2. Scope: what this slice delivers, in one or two sentences
3. Out of scope: what it explicitly does not do
4. Behaviour: scenarios in Given / When / Then form, using glossary terms
5. Contracts: exact signatures, endpoints, request/response bodies, event payloads, schema changes, status and error codes. Real field names and types.
6. Error and edge cases: each with the exact expected result
7. Acceptance criteria: numbered `AC-<slice>.<n>`, each one binary and testable
8. Test cases: first a layer table (`Layer | What | New tests`), then each case mapped to one or more AC IDs, naming the seam it tests through. Follow the repo's written test rules if it has them. Otherwise:
   - one test per behaviour, at the lowest layer that can prove it;
   - error, validation and permission cases at the unit or service layer;
   - at most one browser/E2E journey per slice, unless the spec says why no lower layer can prove a second;
   - assert exact copy only where the copy is the contract;
   - extend existing test files before naming new ones.
9. Files likely to change (links)
10. Non-functional requirements, if any: limits, timeouts, idempotency keys, metrics and log lines

Wrap every spec in the `sign-off` layout. Right after the header, add a **Summary** of up to 5 plain lines: what a real user can do after this slice that they couldn't before. At the end, add **Decisions** (key choices, who made them) and **Your actions** (what's still yours to approve or answer).

Any user-facing text in Behaviour, Contracts or acceptance criteria quotes the chosen wording from `docs/designs/<slug>-wording.md` with its row number, e.g. `"Save changes" (wording #12)`. New text that isn't in the table yet gets a row with three options first (`sign-off` step 3). A spec with a row that isn't `chosen` can't be approved.

Rules:
- No "should probably", "etc.", "handle errors appropriately" or TBD. If you can't make it exact, it's an open question; ask the user.
- Every behaviour in the design that falls in this slice appears as an AC. Nothing in the spec contradicts the design; if the design was wrong, fix the design first and say so.
- Keep each spec small enough to build in one session. Aim for under 300 lines, and split it if it's longer.
- Be exact about behaviour and contracts between slices, and leave the rest to the builder. Name files, not line numbers. Don't name CSS classes, helpers or private types unless another slice depends on them.
- For UI, the spec covers laptop and phone, and links the screens that show both. Linked screens, PNGs and briefs must be files in the repo, not chat attachments.

## 3. Land the drafts on main
As soon as the specs are numbered, before review:
1. Branch `docs/specs-<feature-slug>` from the latest main.
2. Commit only docs: the draft specs with `Status: draft`, their index rows, the design doc and linked designs. No code.
3. Push, open a docs-only PR and merge it. Docs-only PRs need no test run.
4. If another PR took a number first, fetch main, renumber, update cross-references and retry.
5. Delete the branch after merge.

## 4. Review and approve
- Run `goldfish-review` in doc mode on each spec (the Readiness reviewer matters most here: could a fresh session build it in one pass?).
- Triage with the user and apply approved fixes.
- Run `sign-off` across the specs: one summary of the whole set, wording rows still open, decisions, and your actions. Ask for approval for each spec or for the whole set. Never mark a spec approved without an explicit yes.
- The user's approval of a spec also approves landing it on main.

## 5. Land the approval on main
Do this the moment the user approves, before any build starts.
1. Branch `docs/specs-<feature-slug>-ready` from the latest main.
2. Commit the review fixes, `Status: approved` (or the repo's `ready`) on each approved spec, the updated index rows, the review notes and the decision log entry.
3. Push, open a docs-only PR titled `specs: <feature> ready (NN–MM)`, merge it and delete the branch.

The spec is approved only once main says so. If landing fails, say so; don't hand off.

## 6. Hand off
Tell the user which specs are approved on main, with their paths and numbers, and that `build-from-spec` builds them in dependency order from main. If `.agents/tracker.md` exists, run `roadmap` plan mode next.

## Tell Glue (last step, every time)
When this skill finishes, before the final reply, run `add-to-quest` so Glue, the quest journal, shows what happened. Don't ask first and don't skip it: a finished skill that Glue hasn't heard about counts as unfinished. If Glue can't be reached, say so in one line and carry on.

- After the drafts land on main: one quest per spec (create or link it in the saga), state `planning`, and write `Glue quest: <id>` on the spec's first lines before committing.
- After the approval lands on main: each approved spec's quest moves to `ready`, `readyFor: build`, with the spec's path on main as a scroll. When every spec in the saga is ready, add the `write-spec` trail step.