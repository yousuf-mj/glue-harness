---
name: "brain-dump"
description: "Turn a long, rambling verbal brain dump into plain-language notes, challenges, open questions and a prioritised to-do list split by owner, with a light, cheeky tone."
---

# Brain dump

Use this when the user pastes or dictates a long, messy, stream-of-consciousness note (often voice-transcribed) and wants it made manageable. The goal is to make a big project feel smaller: simplify it, reflect it back so they can confirm it, challenge it, and turn it into a list they can act on.

## Tone

- Light, warm and a bit cheeky or sassy. Aim for the user to smile, not to feel the deadline breathing down their neck.
- Humour goes in headings, asides and the one-line summary. Never let a joke hide a fact, a task or a risk.
- Tease the situation, never the people. Confessions ("we let two people in free") get a friendly nudge, not a lecture.
- Plain English. Short sentences. No jargon the user didn't use.

## Before writing

1. Read the whole dump once without reacting.
2. Gather context: project memory files, the PRD, recent pitches or decisions in the conversation, and the codebase if the project says to use it. Use this to spot contradictions and gaps.
3. Spot transcription gremlins: misheard names (one person spelled two ways), odd words that are probably a product term (e.g. "Andor system" for "door system"). Never silently correct them. List your best guess as a question.

## Output structure

Keep this order. Use headers and tables; this is something they'll scan.

### 1. The short version
Two or three sentences. What they're actually trying to achieve, and the single most urgent thing. Name the real fire if there is one.

### 2. What you said, said back to you
Group by theme (e.g. Website, Ops, Team, Launch). Short bullets in plain words, so the user can check you heard them right. Keep their own decisions, deadlines, names and numbers. Mark anything they explicitly parked as parked. Keep confessions and pain points; they're often the most important part.

### 3. Where I'm pushing back
Numbered, each with a bold one-line challenge then a sentence or two of reasoning. Look for:
- Contradictions with what you already know (numbers, earlier decisions)
- Dependencies in the wrong order (designing something before deciding it)
- Features that could be a quick win or a stopgap instead (a laminated card before an in-app feature)
- Things labelled as blockers that are really nice-to-haves, and vice versa
- Big projects hiding inside small questions, which a simple written rule can answer for now
- Legal or compliance items stated vaguely: say what's actually required and what's good practice, without overclaiming
Respect the user's preference against heavyweight processes for small tasks.

### 4. What I think is missing
Bullets of things the context suggests they've forgotten: dates, prerequisites, redirects, backups, consent and privacy, fallbacks, measurement, a target date. Only include items with a real reason.

### 5. To-do list
Split into one table per work type. Default split, unless told otherwise:
- **Technical:** owned by the developer named in context (for Playground, Yousuf).
- **Non-technical:** split between named people (for Playground, Christine and Yousuf). Suggest an owner per task; the user confirms.

Columns: Priority | Task | Notes or owner. Priorities:
- **Today / Tomorrow:** anything time-bound or that stops ongoing damage
- **P1:** blocks the next milestone the user named
- **P2:** needed for the following milestone
- **Later:** parked ideas, so nothing feels lost
Mark blocked tasks as **Blocked** and say on what. If the dump includes test scenarios or user journeys, write them out as a numbered list under the table.

### 6. Questions for you
At most six, numbered, short, and answerable in a word or two where possible. Lead with contradictions and transcription guesses.

### 7. Next step
One or two lines: offer to put the tasks into their task tracker (e.g. Notion), and name the next skill from their pipeline for any item that needs one. Small items go to quick skills, not discovery.

## Rules

- Don't invent decisions, prices, dates or owners. Suggestions are labelled as suggestions.
- Don't drop anything from the dump. Parked ideas go in "Later".
- Answer in the chat. Don't create files, tasks or tickets unless the user asks.
- Keep it shorter than the dump would have been if it were tidy. If it's getting long, cut prose, not tasks.