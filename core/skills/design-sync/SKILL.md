---
name: "design-sync"
description: "Keep the repo's designs matching the app: land approved designs on main, replace and remove old ones, keep one register, and audit for stale designs. Use on 'design sync', 'update designs', or at a design or build hand-off."
---

# Design sync

Designs go out of date because nothing forces an update, and the folder only ever grows. This skill fixes both: every screen has exactly one current design, old ones are removed, and one register says what exists.

The code is the source of truth for what is built. A design is only "live" if it matches the app.

## The layout it keeps
```
docs/designs/
  REGISTER.md            the one list of every current design
  current/<area>/        one file per screen, the design that matches the app
  <slug>-<stage>/        working folders made by the design skills (quick, ux, ui, shape)
  <slug>-wording.md      wording tables (owned by sign-off, never touched here)
```

- `current/` holds finished designs only: one file per screen, named `<screen>.png` (or `.html`), with phone and laptop in the same file when both are in scope.
- Working folders hold the process: concepts, notes, the chosen direction. They are tidied once the work ships (see Mode 2).
- Old versions are deleted, not archived. Git history is the archive.
- Never rename or remove a `<slug>-<stage>/` folder while its saga is still in progress, because other skills find the slug from the folder name.

## The register
`docs/designs/REGISTER.md`, one row per screen:

| Screen | Area | File | Status | Spec / saga | Last checked | Note |
|---|---|---|---|---|---|---|

Status is one of:
- 🟢 **Live**: matches the app
- 🟡 **In progress**: designed or being built, not shipped yet
- 🔴 **Outdated**: the app has moved on; the Note says what changed and which spec or PR did it

Areas follow the product's own navigation (for example public website, student, door, admin). Keep a short "Design system" section at the top of the register pointing to the current colours, type and components.

## Pick the mode
Say which mode you are in, in one line.

| Mode | When |
|---|---|
| 1. Land | A design was just approved (called at the hand-off of quick-design, ux-design, ui-design) |
| 2. Build check | A spec was just built (called by build-from-spec before its PR hand-off) |
| 3. Audit | On a schedule, or when the user asks what designs exist or which are stale |
| 4. First sweep | There is no REGISTER.md yet |

If there is no register, run Mode 4 first, whatever was asked.

## Mode 1: Land an approved design
1. Work out which screens the approved design covers. If that isn't clear, ask.
2. For each screen, write the design to `current/<area>/<screen>.<ext>`, replacing the file that is there. Replace, never add a second version beside it.
3. Update the register row: status 🟡, the spec or saga, today's date. Add a row if the screen is new.
4. Land it on main in a docs-only PR straight away, so a design made in chat isn't left on a branch. If the stage already has a docs-only PR, add to that one.
5. If you are in a chat with no repo access, don't pretend it landed. Write the files as outputs, list exactly what goes where, and say it needs one run from Claude Code.

## Mode 2: Build check
1. Read the spec's **Design impact** line (the screens this change touches, or "none"). If the line is missing, work it out from the diff and tell the user the spec lacked it.
2. For each touched screen, compare what was built with `current/`:
   - **Matches:** set 🟢 and today's date.
   - **Differs and a capture is possible:** screenshot the built screen (phone and laptop when both apply), replace the file in `current/`, set 🟢. The app is the truth.
   - **Differs and no capture is possible:** set 🔴 with a note saying what changed and the PR. A recorded 🔴 is fine. A silent mismatch is not.
3. If this build ships the last spec of a saga, tidy that saga's working folders: keep the chosen design and `notes.md`, list the rough concepts and rejected options for deletion, and remove them once the user says yes.
4. Put the register and design changes in the same PR as the build.
5. The build doesn't count as handed off until every touched screen is 🟢 or 🔴 in the register.

## Mode 3: Audit
Read the register, list `docs/designs/`, and read what merged since the oldest "Last checked" date. Report, shortest first:
- **Not in the register:** files in `current/` with no row
- **Missing:** rows whose file is gone
- **No screen:** designs for screens that no longer exist in the app
- **Probably stale:** 🟢 screens whose code changed since they were last checked
- **Stuck:** 🔴 for more than two audits, or 🟡 with nothing in progress
- **Clutter:** working folders for shipped or abandoned work that still hold rough concepts

Then fix what is safe without asking: set today's date on screens that still match, and mark probably-stale screens 🔴 with a note. Anything that deletes a file goes in a list for the user.

When it runs unattended, change statuses only. Never delete. End with the list waiting for approval.

## Mode 4: First sweep
1. List everything under `docs/designs/`.
2. For each design, compare it with the app as built and propose one of: **keep as current** (move into `current/`), **keep as working** (saga still in progress), or **delete** (superseded, rejected, or for something that no longer exists).
3. Show the list in batches of up to 15, grouped by area, with the proposal and a one-line reason for each. The user can answer in one line, e.g. "all as proposed except 4 = keep".
4. After approval, move, delete, and write the first `REGISTER.md`. Do it in one PR titled "Design sweep".
5. List screens in the app that have no design at all. Don't make designs for them; just list them.

## Rules
- **Never delete without a yes.** Every deletion is listed first with a reason, and waits for the user's approval in this conversation. Replacing a screen's file in `current/` with its newly approved design is the one exception, because that approval already happened.
- One screen, one current design.
- Don't raise small differences such as a couple of pixels. Stale means a real change: layout, content, wording, flow, colour meaning or a component.
- Wording tables and decision logs are not designs. Leave them alone.
- Keep reports short: a few lines per group, the count first.

## Tell Glue (last step, every time)
When this skill finishes, before the final reply, run `add-to-quest`. If Glue can't be reached, say so in one line and carry on.

- Mode 1 and Mode 2: a **Note** on the change's quest, e.g. "Designs synced: 2 live, 1 outdated", with a link to the register on main.
- Mode 3 and Mode 4: a **Note** on the design-upkeep quest in the repo's realm (create it as `planning` if there isn't one) with the counts and what is waiting for approval.

## Reply
Three parts, each short:
1. What changed (screens set 🟢 / 🟡 / 🔴, files replaced)
2. What is waiting for a yes (deletions)
3. A link to the register