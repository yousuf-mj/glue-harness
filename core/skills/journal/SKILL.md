---
name: "journal"
description: "Yousuf's daily work journal: log what he did as one-line entries in Glue's journal/YYYY-MM-DD.md, then write an evening summary with open loops. Use on 'log:', 'journal', 'note that I…', 'what did I do today', 'wrap up the day', 'evening summary', or when he mentions finishing a meeting, decision or task he wants remembered."
---

# 📓 Journal

## 0. Before anything
Load the `me` skill and the active `profile-<name>` skill. The profile says where Glue lives.

A fast, private log of Yousuf's working day. **Reader: only Yousuf.** It is for memory and reflection, not reporting, so write it the way he would scribble it: short, plain, honest.

The journal has two jobs:

1. **Log**: add one line the moment he says something happened. Speed matters more than polish.
2. **Evening wrap**: fill gaps from his tools, then add a short summary and carry open loops forward.

The journal looks back. Owl looks forward. Don't plan, prioritise or challenge here; if he asks "what next", hand over to Owl.

## Where the file lives

- Glue folder: the `Glue` path in the active profile (work: `~/glue/`). Set `G` to it.
  - Claude Code: read and write `~/glue/journal/` directly.
  - Claude app: use the device shell on the connected `glue` folder (`$HOME/mnt/glue/journal/`). If the folder isn't connected, say so in one line and ask him to connect it. Don't fall back to the artifact or Project docs: they are slow, and that's why this skill exists.
- One file per day: `journal/YYYY-MM-DD.md` (London time). Create `journal/` and the day file if missing.
- Journal files stay in Glue. Nothing in Glue goes to GitHub.

## 1. Log an entry

**Append only.** Never read the whole file back, never rewrite earlier lines. A log is one shell append, so it takes about a second:

```bash
mkdir -p "$G/journal" && f="$G/journal/$(TZ=Europe/London date +%F).md"
[ -f "$f" ] || printf '# %s\n\n## Log\n' "$(TZ=Europe/London date '+%A %-d %B %Y')" > "$f"
printf -- '- %s · %s · %s\n' "$(TZ=Europe/London date +%H:%M)" "<tag>" "<text>" >> "$f"
```

Entry line: `- HH:MM · tag · what happened`

Tags (pick one, don't ask him):
- `did`: work done
- `meet`: meeting or 1:1, with the one thing that came out of it
- `decide`: a decision, and the reason in a few words
- `learn`: something learnt about the company, the team or the work
- `open`: something left hanging that needs a next step
- `feel`: energy or mood, only if he says it

Rules for the text:
- His words, tidied, not rewritten. Keep names, ticket ids and links as he gave them.
- One line. If he dumps several things, write several lines.
- Use the time he says ("at 10 I met…"), otherwise now.
- Don't log what he didn't say. No guessing at outcomes.

Reply with one line only: `📓 Logged: <tag> · <text>`. No questions, no follow-up, so he can get back to work.

## 2. Evening wrap

Run on "wrap up the day", "evening summary", "what did I do today", or the evening ritual.

**a. Read** today's file.

**b. Pull to fill gaps** (in parallel, skip any source that isn't connected and say which in one line):
- Calendar: today's meetings (whichever calendar connector the session has)
- Slack and Teams: threads he started or replied in that look like decisions or asks
- Owl: today's `focus-*` records (focus, time used, outcome)
- Repo/Glue: PRs opened or merged today

Only add what isn't already logged. Append them as one block at the end of `## Log` (don't reorder earlier lines; appending keeps it fast and safe). Mark each with `(pulled)` so he can tell them from his own:

```
- 14:00 · meet · Platform sync (pulled)
```

**c. Show him the gaps first.** In chat, list at most 3 pulled items that look important, and ask one question: "Anything to add or fix before I write the summary?" Wait for the answer.

**d. Append the summary** to the day file. Use exactly this shape:

```
## Today
**Done:** <2–4 short lines>
**Decided:** <decisions, or "none">
**Still open:** <open loops, or "none">
**Start tomorrow with:** <one thing>
```

**e. Carry open loops forward.** Append each `open` item and each "Still open" line to `inbox.md` as `- YYYY-MM-DD · <item> (from journal)`. Skip any already there.

**f. Reply** in chat with the `## Today` block and one 👉 step (usually "Close the laptop" or the start-tomorrow item).

## Reading back

For "what did I do on Tuesday" or "this week", read the matching day files and answer from them. Quote his lines; don't embellish. If a day has no file, say so.

## Style

- UK spelling, plain words, short lines.
- Never add praise, judgement or productivity scores. It's his private record.
