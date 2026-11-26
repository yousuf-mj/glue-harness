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

For a `meet` entry, also feed it to people profiles, silently (set `P` as the `people` skill's step 0 says: its base directory in Claude Code, `$G/.harness/people` in the Claude app; skip this if `$P/feed.sh` doesn't exist):

```bash
bash "$P/feed.sh" "$G" "$(TZ=Europe/London date +%F)" - >/dev/null <<'TXT'
<text>
TXT
```

Pass the text through the quoted heredoc as shown, never inside double quotes, so `$`, quotes and backticks in his words stay as typed.

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

**b2. Speed review.** Run the report on today's telemetry log (written by the harness hooks):

```bash
python3 "<this skill's base directory>/../../hooks/telemetry_report.py" "$G/telemetry/$(TZ=Europe/London date +%F).jsonl"
```

In the Claude app, run `python3 "$G/.harness/telemetry/telemetry_report.py"` with the same argument instead (installed as the `me` skill says). Append its output to the day file as-is (it starts with `## Speed`). If it says there is no file, skip this step and say in one line that no requests were timed today (no Claude Code hooks ran, and no app request was marked).

Then write one `learn` line about speed, from the numbers only. For example: "Slowest request was 3m 10s, 80% model time: big rewrites cost more than tool calls." No blame, no scores.

**c. Show him the gaps first.** Feed each `meet` line pulled in this run (not ones already in the file) to people profiles as in step 1. Then run `bash "$P/feed.sh" --check "$G" -` (text through the same quoted heredoc; it writes nothing) on every `meet` line in today's file. In chat, list at most 3 pulled items that look important, then `No profile yet: <lines that printed unmatched>` and `Unclear who: <lines that printed ambiguous>` if there are any, and ask one question: "Anything to add or fix before I write the summary?" Wait for the answer.

**d. Append the summary** to the day file. Use exactly this shape:

```
## Today
**Done:** <2–4 short lines>
**Decided:** <decisions, or "none">
**Still open:** <open loops, or "none">
**Start tomorrow with:** <one thing>
**Speed:** <requests, total time, slowest request, one lesson>
```

**e. Carry open loops forward.** Append each `open` item and each "Still open" line to `inbox.md` as `- YYYY-MM-DD · <item> (from journal)`. Skip any already there.

**f. Reply** in chat with the `## Today` block (including the Speed line) and one 👉 step (usually "Close the laptop" or the start-tomorrow item).

## Reading back

For "what did I do on Tuesday" or "this week", read the matching day files and answer from them. Quote his lines; don't embellish. If a day has no file, say so.

## Style

- UK spelling, plain words, short lines.
- Never add praise, judgement or productivity scores. It's his private record.
