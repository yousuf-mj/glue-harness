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
1. Run `bash "$P/create.sh" "$G" "<Full Name>"`. It copies the template to `_template.md` on first run and never overwrites an existing profile (it prints `exists:` instead; then update that file).
2. Fill only what the user said, section by section. Leave every other section as `-`. Don't look people up elsewhere and don't guess.
3. Add other names he uses for them (nicknames, initials) to `aliases`, lowercase.
4. Reply in one line: `🤝 Created: <Name> (<sections filled>)`.

## 2. Update a profile
- New facts: replace the `-` or add a line under the right section. Keep his words, tidied.
- A chat or meeting: append `- YYYY-MM-DD · <what happened>` at the end of `## Log` (the last section). Coffee chats say "coffee" in the line.
- Never rewrite or delete earlier lines unless he asks.
- Reply in one line: `🤝 Updated: <Name> · <what changed>`.

## 3. Look someone up
When he asks about a person ("who is Sam", "what does Alex work on") or refers to someone where their profile would change the answer:
1. Find the file by slug, `name` or `aliases`. If two match, ask which one.
2. Answer from the file and quote its lines. Don't add facts that aren't there.
3. End every answer about a person with their **How I can help** lines, or `How I can help: -` when empty.
4. If there's no profile, say so in one line and offer to create one.

## Journal feed
The `journal` skill runs `bash "$P/feed.sh" "$G" <date> "<text>"` after every `meet` entry. It appends the line to every profile whose `name` or alias appears in the text as a whole word. It prints `unmatched` when none match and `ambiguous: <slugs>` (changing nothing) when one name fits two people. Fix ambiguity by giving each person a distinct alias.

## Style
UK spelling, plain words, short lines. No judgement, ratings or scores about people.
