---
name: "retro"
description: "After a round of work ships, compare plan vs reality (estimates, reviews, escaped bugs, design quality, real use) and turn the gaps into concrete edits to the skills, checks and steering files. Use at the end of each round."
---

# Retro

Closes the loop. Each round should make the next one go better, by changing the skills themselves rather than just noting lessons. Run it after every round, not only after a big launch, and aim for about 20 minutes. A retro covering one round is far cheaper than one covering everything.

Pipeline: discover -> ux-design -> ui-design / devex-design -> design review -> elephant-plan -> write-spec -> roadmap -> build-from-spec -> **retro**.

## 1. Gather evidence (read, don't ask yet)
- `docs/reviews/` for this round, plus `docs/reviews/code-review-log.md` if it exists
- The ticket mirror named in `.agents/tracker.md`: estimated vs actual
- The git history and PRs: rework commits, spec departures, reverted changes
- Bugs found after merge and what stage should have caught them
- Which skills ran and which were skipped
- Whether real people have used this yet
- Lost work. Fetch all remote branches and main, then list:
  - Files under `docs/specs/`, `docs/designs/`, `docs/adr/` or `docs/reviews/` on a branch but not on main
  - Specs whose build PR merged but aren't `done` on main, and index rows that disagree with their spec file
  - Duplicate spec numbers, and specs renumbered during the round
  - Merged branches that were never deleted
  - Run the repo's spec check script if it has one (such as `npm run specs:check`)

## 2. Ask the team
Ask the user (and their partner, if they want to fill it in async):
- What felt basic, missing or too small? Ask for one concrete example.
- What took longer than it should have, and why?
- Which reviews were valuable, and which were noise?
- Was anything hard to find, or rebuilt because it was lost?
- What would you do differently next time?

Show the evidence with the questions, so the answers can correct it.

## 3. Find root causes
For each gap, find the earliest stage that could have caught it and why it didn't: missing question in an intake, missing research source, missing reviewer lens, spec not precise, test gap, estimate too optimistic, output left on a branch. If a skill was skipped, ask whether it was too long or not useful, and make it shorter or sharper.

## 4. Propose concrete changes
Most important first, at most 8, each one a specific edit:
- A question to add to a skill's intake, a research source, a reviewer lens or check, a spec rule, a test or lint rule, a CLAUDE.md or glossary line
- Reviewer lenses that rarely produce useful findings: tighten their prompt or drop them
- Skills that aren't being used: cut them down until they're worth running
- Estimation: report the new calibration factor from roadmap
- Lost work found in step 1: land it on main, drop it, or fix the status, as one docs PR the user approves

Show the user the exact proposed edit for each skill file. Apply only what they approve. Skill edits go through the skill save card, not local files.

## 5. Record
Append a short summary to `docs/retros/<YYYY-MM-DD>-<round>.md`: what went well, gaps, root causes, and the changes applied. Land it on main in a docs-only PR.

## Tell Glue (last step, every time)
When this skill finishes, before the final reply, run `add-to-quest` so Glue shows what happened. Don't ask first and don't skip it: a finished skill that Glue hasn't heard about counts as unfinished. If Glue can't be reached, say so in one line and carry on.

- Event: a **Note** on each saga the round covered, with the retro file's path and the changes applied. Quests that shipped and deployed move to `done`.
