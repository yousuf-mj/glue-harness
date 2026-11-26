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
