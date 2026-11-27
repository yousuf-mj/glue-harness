# Changelog

## 0.1.0 (2026-11-25)
- All 19 skills copied in as-is; waves tracked in docs/skill-status.md
- Work profile, me.md, Glue template, session-start update hook

## 0.1.1 (2026-11-25)
- me.md and profile.md become skills (me, profile-work) so the Claude app gets them too

## 0.1.2 (2026-11-25)
- /update-harness command for a manual update

## 0.1.3 (2026-11-25)
- New writing skill with references

## 0.1.4 (2026-11-25)
- New journal skill: one-line daily log in Glue `journal/YYYY-MM-DD.md`, evening wrap with summary and open loops

## 0.1.5 (2026-11-25)
- Glue is no longer called "the quest journal", so "journal" only means the journal skill. add-to-quest now responds to "update Glue"

## 0.1.6 (2026-11-25)
- Telemetry hooks log request and tool timings to Glue `telemetry/YYYY-MM-DD.jsonl` (Claude Code only; no-op when ~/glue is missing)
- Journal evening wrap adds a `## Speed` review and a Speed line in the summary

## 0.1.7 (2026-11-25)
- New people skill: one private profile per person in Glue `resources/people/`, from a template, with a data rule (write as if they'll read it; no health, private life or personality guesses)
- Journal feeds `meet` lines into matching profiles and lists meetings with no profile at the evening wrap

## 0.1.8 (2026-11-26)
- Claude app requests are timed: `mark.py` writes `prompt`/`stop` telemetry lines (session `cowork`), a lower bound from first to last tool call
- Speed report flags app requests, shows no tool/model split for them, and ends a missing `stop` at the last event instead of the next prompt

## 0.1.9 (2026-11-26)
- Writing skill 0.2.0: voice and tone. Voice (who is speaking) stays the same; tone (casual, neutral, formal) changes with the doc type and reader
- New `voice/yousuf.md` from a voice interview, and `tone/casual.md`, `tone/neutral.md`, `tone/formal.md`
- Edits to drafts written in my voice are offered as new voice-file lines
- harness-work 0.1.4: in the Claude app, ask once for access to `~/glue` when it isn't connected, instead of skipping recording silently

## 0.1.10 (2026-11-26)
- People skill: after a meeting, finds the invite in the calendar (last 14 days) when a calendar tool is available. Date, length and organiser go in the Log line; full name, title, team and other work facts are offered in one list and added only when approved. No ratings or praise are copied (spec 003)

## 0.1.11 (2026-11-27)
- Profiles name their mail and calendar tools in a `## Connectors` section (format in README "Profiles"). Core skills never name a provider; a missing connector gives `📅 Calendar not connected` or `✉️ Mail not connected` (spec 004)
- Owl uses today's calendar: a `📅 Free:` line before the buckets, a budget capped at the next meeting minus 5, the next meeting on the time line, and "wrap up or park?" 10 minutes before it. It creates a focus block or a reminder only on an explicit yes, and stores only start, end and subject
- People and journal read `calendar.search` from `## Connectors`
- harness-work 0.1.5: `## Connectors` for Microsoft 365, working day 09:00–18:00
