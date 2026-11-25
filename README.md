# glue-harness

My shared AI skills: shaping, planning, fresh-context reviews, docs, learning loop and owl. One core, small profiles per setup.

## Install on a work laptop (Claude Code)
```
claude plugin marketplace add yousuf-mj/glue-harness
claude plugin install harness-core@harness
claude plugin install harness-work@harness
mkdir -p ~/glue && cp -rn ~/.claude/plugins/marketplaces/harness/core/templates/glue-files/. ~/glue/
```
Restart Claude Code. Every session start checks for updates; new versions load next session.
(If the marketplace folder path differs, copy `core/templates/glue-files/` from this repo instead.)

## Claude desktop app
Upload each folder in `core/skills/` (including `me`) and `profiles/work/skills/profile-work` as skills, and connect `~/glue/` as a folder. The app doesn't run hooks, so core skills load `me` and the profile skill as their first step. Re-upload after core changes.

## Rules
- Nothing naming a company, person, system or customer goes in this repo (see docs/adr/0001).
- Work Glue is `~/glue/`, plain files, never pushed.
- Skill porting status: docs/skill-status.md

## Profiles
One core, many profiles. Each profile is `profiles/<name>/` with one skill, `profile-<name>`, plus a hook that loads it in Claude Code. Install core plus exactly one profile per setup. Personal profile: next round.
