# 003 · Fill people profiles from the meeting invite

Status: done
Route: feature
Depends on: 001 (people skill)

## Scope
When the people skill creates or updates a profile after a meeting, and a calendar tool is available, it finds that meeting's invite and uses it: date, length and organiser go into the Log line without asking, and the work facts the invite adds are offered in one list for the user to approve.

## Out of scope
- The journal feed (`feed.sh`): it stays a script with no calendar access
- Searching email, Teams, people directories or anything else besides the calendar
- Future events, and events older than 14 days
- Recording other attendees, or anything from the invite the user didn't approve (except date, length and organiser in the Log line)
- Any script change

## Evidence
Rhys (25 Nov, 15:15) and Paul French (25 Nov, 16:00) were both intros set up by Tim. Each invite held the person's full name, job title, team and products.

## Acceptance criteria
- AC-03.1 After a meeting, when a calendar tool is available (for example Microsoft 365 `outlook_calendar_search`), the skill searches the last 14 days, up to now, for events whose subject or attendees match the person's name or one of their aliases.
- AC-03.2 With one match, the Log line takes the event's date, length in minutes and organiser without asking: `- YYYY-MM-DD · <n> min · set up by <organiser> · <what happened>`. The "set up by" part is left out when the user organised it. If the Log already has a line for that date and meeting (for example from the journal feed), the length and organiser are added to that line instead of a new one. (Corrected during build.)
- AC-03.3 In the same reply, the skill offers one list of facts the invite adds that the profile doesn't have yet: full name (from attendees), job title (from the subject), and team, reporting line and other work facts (from the description). It writes only the items the user approves. With nothing new, it shows no list.
- AC-03.4 With several matches, it asks which one in one question, listing each event's date, time and subject, and fills nothing until the user answers.
- AC-03.5 With no calendar tool or no match, it carries on as today and says `No invite found` in one line.
- AC-03.6 It never copies ratings or praise from the invite (for example "star CS guy"). The data rule applies to every fact in the list.
- AC-03.7 The rule "Don't look people up elsewhere" names the meeting invite as its one exception.

## Tests (hand check; skill prose, no script change)
- H1 → AC-03.1 to AC-03.3, AC-03.6: in a real chat, update Paul French after the 25 Nov intro. Expect the Log line with 25 Nov, the length, "set up by Tim", and one list with full name, title, team and products, with no praise copied.
- H2 → AC-03.4, AC-03.5: a name with two invites in 14 days gets one "which one?" question; a made-up name gets `No invite found`.
- AC-03.7: read the rule in the changed skill.

## Contracts
Log line gains an optional prefix: `- YYYY-MM-DD · <n> min · set up by <organiser> · <what happened>`. Older lines stay as they are.

## Files likely to change
- `core/skills/people/SKILL.md`
- `core/.claude-plugin/plugin.json` (0.1.10), `CHANGELOG.md`, `docs/skill-status.md`

## Docs and guides to update
- `docs/skill-status.md` people row: add "fills meetings from the calendar invite (spec 003)".

## Default states
None (no UI).
