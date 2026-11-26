---
name: "people"
description: "Private profiles of the people the user works with: one file per person in Glue resources/people/. Use on 'add <name>', 'profile <name>', 'who is <name>', 'what does <name> work on', after a 1:1 or coffee chat he wants remembered, or whenever he refers to a colleague and their profile would help."
---

# 🤝 People

## 0. Before anything
Load the `me` skill and the active `profile-<name>` skill. The profile says where Glue lives. Set `G` to it, and `P` to the folder holding this skill's scripts:
- **Claude Code:** `P` is this skill's base directory.
- **Claude app:** the skill's folder isn't on the user's computer, so the scripts live in Glue. Set `P="$G/.harness/people"`. If `$P/feed.sh` is missing, or its `people-scripts-version` line differs from this skill's copy, read `create.sh`, `feed.sh` and `template.md` from this skill's base directory and write them to `$P` with the device shell first.

One private file per person: `$G/resources/people/<slug>.md`, where `<slug>` is the name in lowercase with spaces as hyphens. **Reader: only the user.** It helps him remember who people are, how they like to work and how he can help them.

## The data rule (read first, every time)
Write every profile as if the person will read it. A colleague can ask for the notes their manager keeps about them.

**Never record:** health, private life, family, beliefs, or guesses about personality or mood.

When the user gives one of these, record only the agreed adjustment or the work fact, and say in one line what you left out:
- "has a back problem, can't do long meetings" → Agreed adjustments: "prefers meetings under 45 minutes" · 🔒 Left out: the health detail.

Record what he observed or was told about work: "likes data before a decision", not "seems anxious".

## 1. Create a profile
1. Run `bash "$P/create.sh" "$G" "<Full Name>"`. It copies the template to `_template.md` on first run and never overwrites an existing profile (it prints `exists:` instead; then update that file). It refuses names containing `/` or starting with `.` or `_` (`bad name:`).
2. Fill only what the user said, section by section. Leave every other section as `-`. Don't look people up elsewhere and don't guess. The one exception is the meeting invite (section 4), and only for facts the user approves.
3. Add other names he uses for them (nicknames, initials) to `aliases`, lowercase.
4. Reply in one line: `🤝 Created: <Name> (<sections filled>)`.

## 2. Update a profile
- New facts: replace the `-` or add a line under the right section. Keep his words, tidied.
- A chat or meeting: append `- YYYY-MM-DD · <what happened>` at the end of `## Log` (the last section). Coffee chats say "coffee" in the line. After a meeting, check the invite first (section 4).
- Never rewrite or delete earlier lines unless he asks. The one exception: adding the invite's length and organiser to that meeting's Log line (section 4).
- Reply in one line: `🤝 Updated: <Name> · <what changed>`.

## 3. Look someone up
When he asks about a person ("who is Sam", "what does Alex work on") or refers to someone where their profile would change the answer:
1. Find the file by slug, `name` or `aliases`. If two match, ask which one.
2. Answer from the file and quote its lines. Don't add facts that aren't there.
3. End every answer about a person with their **How I can help** lines, or `How I can help: -` when empty.
4. If there's no profile, say so in one line and offer to create one.

## 4. After a meeting: check the invite
When you create or update a profile after a meeting, and a calendar tool is available (for example Microsoft 365 `outlook_calendar_search`):
1. Search the last 14 days, up to now, for events whose subject or attendees match the person's name or one of their aliases. Skip cancelled events and events he declined.
2. **Several matches:** ask which one in one question, listing each event's date, time and subject. Fill nothing until he answers.
3. **No calendar tool, or no match:** carry on as normal and say `No invite found` in one line.
4. **One match:** write the Log line from the event without asking: `- YYYY-MM-DD · <n> min · set up by <organiser> · <what happened>`. Leave out "set up by" when he organised it (the event says he is the organiser, or the organiser's address is his). If the Log already has a line for that date and meeting (for example from the journal feed), add the length and organiser to that line instead of appending a new one.
5. In the same reply, offer one list of the facts the invite adds that the profile doesn't have yet:
   - full name (from the attendees)
   - job title (from the subject: the person's own title, not his)
   - team, reporting line and other work facts (from the description)

   Write only the items he approves. Show no list when there's nothing new. An approved full name replaces `name`, the old name becomes an alias, and the file keeps its slug.

Keep the invite's wording. "On Ryan's team" is a team fact: don't turn it into **Reports to**. Offer unsure facts with their question mark ("SmartDocs?"), or leave them out.

Never copy ratings or praise from the invite (for example "star CS guy"). The data rule applies to every item in the list. Don't record the other attendees.

Example reply, for a profile created as "Sam":
```
🤝 Updated: Sam · Log: 2026-11-25 · 30 min · set up by Tim · intro
From the invite, add any of these?
1. Full name: Sam Smith
2. Role and team: <title> · <team>
3. What they work on: <products>
```

## Journal feed
The `journal` skill runs `feed.sh` after every `meet` entry, with the text on stdin (`-`) through a quoted heredoc. It appends the line to every profile whose `name` or alias appears in the text as a whole word; a longer match wins over a shorter one inside it ("Sam Smith" over "sam"). It prints `unmatched` when none match and `ambiguous: <slugs>` (changing nothing) when one name still fits two people. Fix ambiguity by using the full name or giving each person a distinct alias.

## Style
UK spelling, plain words, short lines. No judgement, ratings or scores about people.
