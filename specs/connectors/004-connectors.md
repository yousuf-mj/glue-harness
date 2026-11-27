# 004 · Connectors in the profile; Owl plans around the calendar

Status: done
Route: feature
Depends on: 003 (people skill reads the calendar)

## Scope
The active profile names the mail and calendar tools in a `## Connectors` section, and core skills read it instead of naming a provider. Owl uses today's calendar to show free time, size the budget to the next meeting, and warn before it.

## Out of scope
- Owl reading or acting on email
- Other people's calendars
- Planning beyond today
- The personal profile (next round; it copies the format)
- Tracking breaks or away time

## Acceptance criteria
- AC-04.1 `profile-work` has a `## Connectors` section with `suite`, `calendar.search`, `calendar.create`, `calendar.times`, `calendar.day: 09:00–18:00`, `mail.search` and `mail.draft`. README "Profiles" documents the format: one `key: tool (notes)` line per key, and a missing key means not connected.
- AC-04.2 No file in `core/` names a mail or calendar provider or tool. Skills that use mail or calendar read the key from the active profile. If the section, the key or the tool is missing, or the call fails, they carry on and say `📅 Calendar not connected` or `✉️ Mail not connected` in one line.
- AC-04.3 Owl's focus gather adds today's events (`calendar.search`), skipping cancelled and declined ones. Before the buckets it shows `📅 Free: 09:00–11:00 · 11:30–14:00`: gaps of 15 minutes or more from now (or the start of `calendar.day`, if later) to the end of `calendar.day`. With no such gap: `📅 Free: none today`.
- AC-04.4 The default budget is the smaller of the item's estimate and the minutes until the next meeting minus 5. With no meeting left today, it is the estimate. If the pick doesn't fit the gap, Owl says so and offers the smallest piece that fits, or a later free block.
- AC-04.5 The time check line adds the next meeting: `⏱️ 25 of 40 min · <meeting> in 10 min`. When a time check or hand-off finds the next meeting 10 minutes away or less, Owl asks "wrap up or park?" and records the choice on the focus doc.
- AC-04.6 Owl's calendar use is read-only by default. It may offer, and creates with `calendar.create` only after an explicit yes in that chat: (a) a busy event in a free slot, subject `🦉 Focus: <focus>`; (b) a reminder: a 5-minute event shown as free, subject `🦉 Wrap up or park: <focus>`, starting 10 minutes before the next meeting.
- AC-04.7 The focus doc stores only each event's start, end and subject. No attendees or bodies go to Glue.
- AC-04.8 The people skill (section 4) and the journal (section 2b, Calendar line) read `calendar.search` from `## Connectors` and no longer name a provider. Their behaviour doesn't change. Exception, from AC-04.2: when the connector is missing or fails, the people skill says `📅 Calendar not connected` instead of `No invite found`. (Corrected during build.)

## Tests (hand check; skill prose, no script change)
- G1 → AC-04.2: `git grep -n -i -E "outlook_|microsoft 365|google calendar|gmail" core/` returns nothing.
- H1 → AC-04.3, AC-04.4, AC-04.5: run Owl focus on a working day with meetings. Expect the Free line, a budget capped at the next meeting minus 5, and the meeting on the time line.
- H2 → AC-04.2: with `calendar.search` removed from a copy of the profile, Owl says `📅 Calendar not connected` and shows the buckets.
- AC-04.1, AC-04.6, AC-04.7, AC-04.8: read the changed files.

## Contracts
- Profile section: `## Connectors`, one `key: value` line per key. Keys: `suite`, `calendar.search`, `calendar.create`, `calendar.times`, `calendar.day`, `mail.search`, `mail.draft`.
- Owl focus doc gains `nextMeeting: {start, end, subject} | null` and `meetingChoice: 'wrap' | 'park' | null`.

## Files likely to change
- `profiles/work/skills/profile-work/SKILL.md`, `profiles/work/.claude-plugin/plugin.json` (0.1.5)
- `core/skills/owl/SKILL.md`, `core/skills/people/SKILL.md`, `core/skills/journal/SKILL.md`
- `README.md`, `CHANGELOG.md`, `core/.claude-plugin/plugin.json` (0.1.11), `docs/skill-status.md`

## Docs and guides to update
- `README.md` "Profiles": add the `## Connectors` format. "Rules": add "Core skills never name a mail or calendar provider; they read `## Connectors` from the profile."
- `docs/skill-status.md` owl row: "uses the calendar from `## Connectors` (spec 004)".

## Default states
None (no UI).
