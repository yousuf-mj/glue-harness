---
name: "quick-spec"
description: "Write a one-page spec for a small, reversible change that fits in one slice, then hand it to build-from-spec. Use instead of elephant-plan and write-spec for adjustments and small features."
---

# Quick Spec

The short route from idea to ship. Code is still built only from an approved spec, but the spec is one page and there is no design doc, doc review or schedule.

Route: **quick-spec** -> land on main -> build-from-spec -> PR.

Aim for about 10 minutes and one approval from the user.

## 1. Pick the route
Read the request and the code near the change, then choose:

- **Quick:** a bug or tweak with no new behaviour decision. Don't write a spec. Fix it, test it and open a PR.
- **Feature:** this skill. All of these must be true:
  - It fits one slice, about 2 days or less
  - It is easy to reverse
  - It follows existing patterns and flows
- **Project:** anything else. Stop and recommend the full pipeline, naming the skill to run next.

These always go to Project, however small the change:
- Payments or money movement
- Auth or permissions
- New handling of personal data
- Destructive or hard-to-reverse migrations
- Public APIs, events or other contracts that outside consumers rely on
- A new kind of user flow with no existing pattern to follow

Say which route you chose and why in one line. The user can overrule it.

## 2. Resolve the unknowns
Read the code before asking, so you don't ask what you can see. If you are in a chat without the repo, attach it first. If the prompt is short, or anything about behaviour, wording or scope is open, ask before writing: a round of up to 4 questions with the multiple-choice question tool when available, each with your recommended answer first so the user can just say yes. Ask a second round only if the answers open something new. Don't fill gaps with guesses, and don't leave assumptions for later: anything you'd have to assume becomes a question now, and the spec records the answer. A spec with an unanswered assumption can't be approved. Before writing, check for ready or in-flight specs that touch the same screens or files, and for existing tests that guard copy or behaviour you're changing. Skip questions only when the prompt already settles everything.

If the change has a visible UI decision, run `quick-design` first, save the chosen PNG in the repo's designs folder, and link it.

If you still can't make the behaviour exact after that round, it isn't a Feature. Say so and move it to Project.

## 3. Write the spec
Use the repo's spec folder and numbering, taking the next free number from the latest main (fetch it first). Otherwise write `specs/<slug>/001-<slug>.md`. If the spec folder's README sets its own rule for how specs reach main, follow it.

1. Header: `Status: draft`, `Route: feature`
2. Scope: what this delivers, in one or two sentences
3. Out of scope: what it deliberately doesn't do
4. Design: link to the chosen PNG, if there is one
5. Acceptance criteria: numbered `AC-<NN>.<n>`, each binary and testable, including the error and empty cases that matter
6. Tests: each mapped to one or more AC IDs, naming the seam it tests through. At most one test per AC (money, the ledger, sign-in and permissions get every rule); no tests for copy, CSS or layout; no E2E unless an AC needs a real browser
7. Contracts: exact fields, endpoints or schema changes, only if any change
8. Files likely to change
9. Docs and guides to update: design files, user guides, runbooks, help pages and website copy this changes, each with the line to change, or "None"
10. For every new UI element, its default state (open or closed, empty, error)

Rules:
- Keep it to one page. If it needs more, it is probably not a Feature.
- Aim for 8 acceptance criteria or fewer.
- No "etc.", "should probably", "handle errors appropriately" or TBD.
- Use `GLOSSARY.md` terms when the repo has one, but don't add ADRs or new glossary entries.

## 4. Approve and land on main
Show the user the scope, out of scope and acceptance criteria. One yes approves the spec and approves landing it on main.

Then, before any code:
1. Fetch main and branch `docs/spec-<NN>-ready` from it. If another PR took the number, renumber.
2. Set `Status: approved` (or the repo's `ready`) and add its index row.
3. Commit only the spec, its PNG and the index. Push, open a docs-only PR, merge it and delete the branch.

If the user stops before approving, still land the draft on main with `Status: draft` so it isn't lost.

The spec is approved only once main says so.

## 5. Track and hand off
If `.agents/tracker.md` exists, create one Notion ticket with Name, Status, Owner and Spec (the spec's path on main), following the token rules in `roadmap`. Skip estimates, dates and milestones.

Then run `build-from-spec` on the spec's path on main. It can run in this session, on a fresh branch from main.

## Tell Glue (last step, every time)
When this skill finishes, before the final reply, run `add-to-quest` so Glue, the quest journal, shows what happened. Don't ask first and don't skip it: a finished skill that Glue hasn't heard about counts as unfinished. If Glue can't be reached, say so in one line and carry on.

- When the draft lands on main: create or link one quest for the spec, state `planning`, and write `Glue quest: <id>` on the spec's first lines.
- When the approval lands on main: move the quest to `ready`, `readyFor: build`, with the spec's path on main as a scroll. Do this before handing to `build-from-spec`.