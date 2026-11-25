---
name: "roadmap"
description: "Turn approved specs into owned, estimated, dependency-ordered tickets with dates and milestones, sync them to Notion token-efficiently, and report status. Use after write-spec and whenever work changes state."
---

# Roadmap

Keeps everyone (including a partner who isn't in the terminal) clear on what's being built, what's done and when real people will use it. The repo is the source of truth for content; Notion holds only the tracking metadata and links back to the repo.

Main's spec folder is the queue. A spec that isn't on main isn't planned, and a ticket always links to the spec on main, never to a branch.

Pipeline: discover -> ux-design -> ui-design / devex-design -> design review -> elephant-plan -> write-spec -> **roadmap** -> build-from-spec -> retro.

Modes, picked from the user's request:
- **setup**: once per repo
- **plan**: add a round of work (under 10 minutes)
- **status**: update ticket states
- **report**: summarise progress and risks

## Token rules (follow in every mode)
- Never write spec, design or code content into Notion. Rows hold properties plus a link to the spec file.
- Read the database schema once during setup and cache it in `.agents/tracker.md`. Never re-fetch it.
- Keep a local mirror for each round, at the path named in `.agents/tracker.md`. Diff against it and send only changed properties.
- Batch: create all rows for a round in one call where the tool allows it.
- Update only on state changes (started, done, blocked), never per commit or per test.

## Setup
1. Ask which Notion database holds the work (or offer to create one). Ask who is on the team and each person's realistic capacity.
2. Use the columns the database already has. Only add a column if the user wants it.
3. Write `.agents/tracker.md`: database ID, property names, how statuses map, team, mirror path and the estimate calibration factor.

## Plan
1. Fetch main. Plan only specs that are on main. If a spec exists only on a branch or in a chat, land it on main first (the "Land" steps in `write-spec` or `quick-spec`), then plan it.
2. Add one row for the round, and one row per spec. Every spec gets a row, however small. The Spec link points at the file on main (for GitHub, `.../blob/main/<path>`).
3. Estimate each spec from its size in agent time, then multiply by the calibration factor (start at 0.3 for agent builds if there's no history: builds ran at 0.2–0.3× their estimates). Give "tests and merges" its own line in each estimate; reruns, not building, are usually the cost. Anything over 2 days means the slice is too big: send it back to `write-spec` to split.
4. Name the date real people first use this round. If nothing from the last round has been used by a real person, say so in the plan and put that first.
5. Show a short table and the first-use date. Get the user's OK, then sync to Notion and write the mirror.

## Status
`build-from-spec` updates the row when a spec starts and finishes: Status, PR and actual time from first commit to merge. If a row is missing, create it.

When asked for status, reconcile first, from main and the merged PRs (no Notion fetch beyond one filtered query):
- A spec whose build PR has merged but isn't `done` on main: fix the spec status and its index row in one docs PR, and mark the row done.
- A spec on main that is approved or draft with no row: add the row.
- A row whose Spec link points at a branch, or at a file that isn't on main: land the spec, then fix the link.
- Spec or design files that exist on a remote branch but not on main: list them for the user to land or drop.

Say in one line what you reconciled.

## Report
Use the mirror, or one filtered query. Summarise in plain, non-technical language, short enough to paste into a message:
- Done since the last report, in progress, blocked (and on what)
- The queue: specs approved on main and not started, in dependency order
- What real people can use now, and the next first-use date
- Next up per person

If dates slip or scope changes, show the options (cut scope, move dates), let the user choose, then update only the affected rows. Recompute the calibration factor from done rows (actual / estimated) and save it.

## Tell Glue (last step, every time)
When this skill finishes, before the final reply, run `add-to-quest` so Glue shows what happened. Don't ask first and don't skip it: a finished skill that Glue hasn't heard about counts as unfinished. If Glue can't be reached, say so in one line and carry on.

- After a plan or status sync: make each touched quest's state match its spec status (draft = planning, ready/approved = ready, in-progress = onquest, done = done), forward only, following add-to-quest's move rules.