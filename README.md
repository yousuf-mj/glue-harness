# glue-harness

My shared AI skills: shaping, planning, fresh-context reviews, docs, learning loop and owl. One core, small profiles per setup.

## Claude Code (only if the app sync doesn't cover it)
```
claude plugin marketplace add yousuf-mj/glue-harness
claude plugin install harness-core@harness
claude plugin install harness-work@harness
mkdir -p ~/glue && cp -rn ~/.claude/plugins/marketplaces/harness/core/templates/glue-files/. ~/glue/
```
Restart Claude Code. Every session start checks for updates; new versions load next session. To update by hand, run `/update-harness`.
(If the marketplace folder path differs, copy `core/templates/glue-files/` from this repo instead.)

## Claude app (main route)
Customize → Plugins → Personal plugins → + → Add marketplace → from a repository → `yousuf-mj/glue-harness`. Install `harness-core` and `harness-work`, and turn on **Sync automatically** so every push arrives on its own. Connect `~/glue/` as a folder. Plugins added here also sync to Claude Code, so you may not need the Claude Code install below.

The app doesn't run hooks, so core skills load `me` and `profile-work` as their first step. Chat requests are timed from the first to the last tool call (a lower bound), by `mark.py` installed into `~/glue/.harness/telemetry/`.

## Rules
- Nothing naming a company, person, system or customer goes in this repo (see docs/adr/0001).
- Work Glue is `~/glue/`, plain files, never pushed.
- Skill porting status: docs/skill-status.md
- Core skills never name a mail or calendar provider or tool. They read `## Connectors` from the active profile.

## Profiles
One core, many profiles. Each profile is `profiles/<name>/` with one skill, `profile-<name>`, plus a hook that loads it in Claude Code. Install core plus exactly one profile per setup. Personal profile: next round.

### Connectors
Each profile skill has a `## Connectors` section that names the mail and calendar tools for that setup. One `key: value` line per key; the value is the tool name, with any call notes in brackets.

| Key | Value |
|---|---|
| `suite` | The suite's name, for the reader only |
| `calendar.search` | Tool that lists events, with the arguments for "all events in a time range, oldest first" |
| `calendar.create` | Tool that creates an event |
| `calendar.times` | How the tool returns times, and how to show them |
| `calendar.day` | Working day, `HH:MM–HH:MM`, used for free blocks |
| `mail.search` | Tool that searches mail |
| `mail.draft` | Tool that creates a draft (never sends) |

A missing key means not connected. Skills then carry on and say `📅 Calendar not connected` or `✉️ Mail not connected` in one line.
