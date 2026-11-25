# 001 · People profiles

Status: in-progress
Route: feature (overruled from project: the personal-data rules are settled below, files stay private in Glue, easy to undo)

## Scope
A `people` skill that keeps one private profile per person in Glue `resources/people/<slug>.md`, built from one template, read whenever the user refers to someone. The journal feeds it: a `meet` line that names someone with a profile also lands as a dated line in their file.

## Out of scope
- Pulling profile facts from HR systems, org charts, Slack or calendar
- Reminders, follow-ups or 1:1 agendas (Owl's job)
- Any sync of profiles outside Glue

## Design
None (text files only).

## Data rule
Write every profile as if the person will read it (UK GDPR subject access applies to manager notes).
Never record health, private life, family, beliefs or personality guesses. When the user gives one, record only the agreed adjustment ("prefers no meetings before 10") and say in one line what was left out.

## Acceptance criteria
- AC-01.1 The skill ships `template.md` with these sections, in order: Role and team, Reports to, Joined, What they work on, How they like to work, What they care about, Agreed adjustments, How I can help, Log. Front matter has `name` and `aliases`.
- AC-01.2 Creating a profile writes `$G/resources/people/<slug>.md` from the template, where `<slug>` is the name in lowercase with spaces as hyphens. It fills only what the user said; other sections keep the placeholder `-`. If the file exists, it does not overwrite it.
- AC-01.3 On first run the skill copies the template to `$G/resources/people/_template.md` if missing, for hand use.
- AC-01.4 `feed.sh <glue> <date> <text>` appends `- <date> · <text>` under `## Log` of every profile whose `name` or an alias appears in `<text>` as a whole word, case-insensitive. It prints `unmatched` and changes nothing when no profile matches.
- AC-01.5 When two or more profiles match the same name (two Ryans), `feed.sh` changes nothing and prints `ambiguous: <slugs>`.
- AC-01.6 The journal's log step runs `feed.sh` after a `meet` append, with no extra output. The one-line `📓 Logged:` reply is unchanged.
- AC-01.7 The journal's evening wrap lists today's `meet` lines that matched no profile as one line, "No profile yet: …", in the gaps step.
- AC-01.8 When the user asks about a person ("who is Ryan", "what does Paul work on"), the skill answers from the profile and quotes its lines. If no profile exists, it says so in one line. Every answer about a person ends with their "How I can help" lines, or "How I can help: -" when empty.

## Tests (seam: `feed.sh` against a temp Glue folder, in `core/skills/people/test_feed.sh`)
- T1 → AC-01.4: matching name and alias append one dated line; no match prints `unmatched`, file unchanged
- T2 → AC-01.5: two profiles with alias "ryan" → `ambiguous`, both unchanged
- T3 → AC-01.2: create helper makes the slug file and refuses to overwrite
- AC-01.1, 01.3, 01.6, 01.7, 01.8: checked by hand in one real run (skill prose, no code seam)

## Contracts
Profile file: YAML front matter (`name`, `aliases`), then the template sections. Log line: `- YYYY-MM-DD · <text>`.

## Files likely to change
- `core/skills/people/SKILL.md`, `template.md`, `feed.sh`, `test_feed.sh` (new)
- `core/skills/journal/SKILL.md` (log step + evening wrap)
- `CHANGELOG.md`, `core/.claude-plugin/plugin.json` (0.1.7), `docs/skill-status.md`

## Docs and guides to update
- `core/templates/glue-files/README.md`: `resources/` line → "reference (systems, people/ profiles, how-tos)"

## Default states
- New profile: every unfilled section shows `-`; Log is empty.
