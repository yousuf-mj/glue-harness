---
name: "sign-off"
description: "Close every pipeline stage the same way: a plain summary at the top, a wording table with industry-standard options, decisions and your actions at the end, a log of corrections, and approval only where the risk tier calls for it."
---

# Sign-off

Every pipeline stage ends here before it hands off. It does four things:
1. Makes the stage's output quick to read: a summary at the top, and decisions and actions at the end.
2. Puts every word real users will see in front of the user as a choice, using industry-standard terms.
3. Waits for an explicit approval before the next stage starts.
4. Records what was decided and what the user corrected, so later stages and retros learn from it.

Called by: discover, shape, ux-design, ui-design, devex-design, quick-design, elephant-plan, write-spec, quick-spec, roadmap (plan), goldfish-review (triage), build-from-spec (spec changes), orchestrate-build (answers to blocked builders), retro.

**Approval tiers.** Most decisions don't need a person. Sort every decision and finding into one tier:
- **Stop and ask (high).** Two fixed gates: the shape verdict, and spec approval before build. Also stop for: an ETH finding; a Required WCAG blocker; a destructive or irreversible action; payment, pricing, consent or legal text; AI disclosure on Code of Conduct or safeguarding content; breaking a standing rule; a new conflict between sources; a change to appetite or scope.
- **Decide and flag (medium).** Pick the recommended option, carry on, and list it under "Decided for you" in the end-of-stage summary. Wording rows with no standing rule, choices between design options, triage of majors.
- **Decide and log (low).** Wording that follows a standing rule or a cited check, minor fixes, R4 opinions. Log it; don't show it unless asked.

Who is asked at a stop: Yousuf for engineering calls and the two fixed gates; Christine for go / no-go on new products, product voice, high-stakes copy, ETH and adoption calls. Either can answer for the other when the other is away; log who answered.

Only `retro` moves a kind of decision between tiers: down a tier after a round with no corrections to it, up a tier after two corrections.

The slug is the saga slug: the doc folder prefix, e.g. `docs/designs/<slug>-ux/` gives `<slug>`.

## 0. How every stage talks to Yousuf
These rules apply to every stage that calls sign-off, from its first message to its hand-off. They come from neurodiversity workplace research and Yousuf asked for them.
- **Literal and direct.** Say exactly what you mean. Give instructions as statements ("Choose rows 4 and 7"), not soft questions. No sarcasm, idioms or hints.
- **One thing at a time.** One question per message. Never ask about two stages at once.
- **Challenge once.** If the user adds scope, starts something new while work is unfinished, or picks against the recommendation, ask "why this, why now?" once and name what it pushes back. Then accept the answer. Criticise the plan, never the person. Never soften a real problem.
- **Park ideas.** A new idea mid-stage goes to Glue `dumps` in one line. Then go back to the stage.
- **Make time visible.** At sign-off, show agent time used against the estimate as numbers.
- **No surprises.** Keep this layout every time. Flag any change to plan or format before making it.
- **Easy to read.** Short chunks, clear headings, emoji markers, a light tone. At most 3 items per list in chat.
- **One next step.** End with exactly one 👉 action.

## 0b. When Christine is the reader
Use this when a stage writes for Christine or asks her a question. When Yousuf is reading, section 0 wins where they differ.
- **Capable collaborator.** Don't explain change management, inclusion, facilitation or communication basics to her. Do explain technical decisions in terms of users, operations, cost, risk and long-term effort.
- **Direct, with reasons.** If you disagree, say what, why, what evidence supports it, and what you recommend. Don't dilute criticism with politeness. Don't manufacture disagreement either.
- **Facts apart from guesses.** Label confirmed facts, inferences, assumptions and recommendations. Never invent product features, user needs, evidence or decisions.
- **Autonomy matches consequence.** Low: decide and flag. Moderate: flag the uncertainty, its impact, and a provisional recommendation, then continue. High: don't guess; ask.
- **Keep the nuance.** She often explores tensions on purpose. Before simplifying an idea, check you haven't removed the point she is making.
- **Who carries the effort.** For any trade-off, say who benefits and who absorbs the extra work.
- **Inform, don't ask, outside her area.** Engineering decisions by Yousuf are sent to her as "decided, here is what it means for you", not as approval requests.
- **Every question stands on its own.** A question for Christine, in Glue or in a doc, must include: what you need from her (one line); where it appears (which app, which screen, and when a user sees it); the exact wording or options, in a table; what happens after each answer; and, for any design or wording sign-off, an image of the screen with the part in question highlighted, plus a link to the full design. Never ask about "the button" or "the copy" without saying which and where. If you can't supply the location or the image, don't send the question yet: get them first.
- **Voice.** Plain, warm, conversational. No corporate jargon, false enthusiasm, empty praise or em dashes. No playful, themed or whimsical wording: say plainly what is going on. UK spelling (team standing rule).

## 1. Start of every stage: read the log
Before a stage asks its first question, read `docs/decisions/<slug>.md` if it exists:
- The **Standing rules** section at the top: apply every rule that fits this stage.
- The latest entry: what was decided last and what is still open.

Say in one line which standing rules you are applying ("Applying 3 standing rules: UK spelling, 'Sign in' not 'Log in', no modal confirmations"). Don't re-ask anything the log already answers.

## 2. Layout of every doc the user reads
Every doc a stage writes for the user (brief, decision, pitch, flows, design system, devex contract, design doc, spec, spec index, retro) follows this layout. Put it after any header lines the skill requires, such as `Status:` and `Glue quest:`.

**At the top: Summary**
- At most 5 lines, plain language, no jargon.
- What this is, what it decides, what changes for real users, and the one thing that most needs the reader's attention.
- A status line: `Waiting for your sign-off`, or `Signed off YYYY-MM-DD`.

**The body:** as the stage's own skill says.

**At the end: Decisions**
One line per key decision: the decision, the reason, and who made it (`you`, `Christine`, or `agent recommendation, not yet confirmed`).

**At the end: Your actions**
A checkbox list of what only a person can do. Each item names the owner (Yousuf for engineering calls, Christine for idea and strategy calls, when it's clearly theirs) and what it blocks:
- `[ ] Choose wording for rows 4, 7, 12 (blocks wireframes)`
- `[ ] Approve the pitch (blocks ux-design)`

If nothing is open, write "Nothing to action. Approve to continue."

## 3. The wording table
Use this whenever a stage writes or changes words that real users will see: navigation, screen titles, headings, labels, buttons, placeholders, empty states, errors, confirmations, notifications, emails, CLI output, API error messages.

There is one table for each piece of work: `docs/designs/<slug>-wording.md`. Later stages add rows to it rather than starting their own.

| # | Where (screen / state / element) | Job of the text | A: Industry standard | B: Plainer | C: Product voice | Who uses A | Recommended | Chosen | Status |
|---|---|---|---|---|---|---|---|---|---|

### Finding the industry standard (option A)
Users already know these terms from other software, so use them.
1. **What already exists:** the repo's `GLOSSARY.md` and wording already shipped in the product. Staying consistent beats a better word, unless the user wants to change it everywhere.
2. **What common products use:** check how at least 3 well-known products label the same thing. Use Mobbin (search screens and flows) when it's connected, otherwise web search for product docs and screenshots. Prefer products the target users already use.
3. **Design system writing guides:** Material Design, Apple HIG, GOV.UK Design System, Atlassian, Shopify Polaris and Microsoft Fluent, especially for buttons, errors and confirmations.
4. **The industry's own terms:** if the domain has its own words (e.g. a dance school's "class", "term", "drop-in"), use them over generic software words.

Call something the standard only if at least 2 named products use it, and list them in "Who uses A". Otherwise write "no clear standard" and treat all three options as equal.

If `docs/review-packs/usability/` exists, option A must also pass its `checklist.md` and follow its `house-rules.md`, and name the check it follows in "Who uses A" (for example "UX-BTN-01, GOV.UK Button; Calendly, Mindbody"). Without a check ID it is the agent's opinion of the standard, not the standard. Option C reads `docs/voice.md` when it exists.

### The other options
- **B: Plainer:** the shortest version a first-time user would understand without help.
- **C: Product voice:** fits the brief's personality adjectives. If there's no brief, use another common term instead.

### Rules for every option
- Buttons are verbs that say what happens ("Save changes", not "OK").
- Use the same word for the same thing everywhere.
- Errors say what happened and how to fix it. They never blame the user.
- Use sentence case unless the product already uses something else.
- Ask once whether to use UK or US spelling, and record the answer as a standing rule.

### Status
`proposed` -> `chosen` -> `changed`. A change records why it changed. Wireframes, screens and specs use only `chosen` wording. A spec with a row that isn't `chosen` can't be approved, and `build-from-spec` uses chosen wording word for word.

### Showing it
Show up to 15 rows at a time, recommended option marked, so the user can answer in one line, e.g. "all recommended except 4 = B and 9 = C". Show more than 15 rows in batches, most visible first.

## 4. Ask for sign-off
In the chat, show in this order:
1. The summary (5 lines)
2. Wording rows that need a choice, inline if there are 15 or fewer, otherwise linked with a count
3. Decisions
4. Your actions

Then add **Decided for you**: one line per medium-tier decision, each with its reason, so it can be overruled later.

If anything is in the **stop and ask** tier, or this is a fixed gate, ask with the multiple-choice question tool: **Approve and move to `<next skill>`** (recommended only if nothing is open) / **Approve with changes** / **Not yet**. Ask only about the stop items, and say who needs to answer.

If nothing is in the stop tier, set the status to `Signed off by tier rules YYYY-MM-DD`, log the entry, and hand off. An overrule of a "Decided for you" line, at any later point, is logged as a correction.

Rules:
- Never pass a fixed gate or a stop-tier item without an explicit yes in this conversation.
- Approving part of the work doesn't approve all of it. If the yes was only about one part, confirm the rest.
- **Unattended** (a scheduled run, a builder agent, or the question goes unanswered): never approve on the user's behalf. Finish the docs, set the status to `Waiting for your sign-off`, write the actions list, add the log entry, and stop.

## 5. Record the decision log
Append to `docs/decisions/<slug>.md`. Never rewrite past entries. Create the file with this skeleton the first time:

```
# Decision log: <saga title>

## Standing rules
- <rule> (from <stage>, YYYY-MM-DD)

## Entries
```

Then add one entry per sign-off:

```
### YYYY-MM-DD · <stage> · approved | approved with changes | not yet
Session: <chat or session link, if known>
Decisions:
- <decision>: <why> (by you | agent recommendation accepted)
Corrections:
- Agent proposed: <what>. You changed it to: <what>. Why: <your reason in your words, or "no reason given">. Type: rule | one-off
Wording: rows <n-m> chosen (<link>)
Still open: <items, or none>
```

Rules:
- **A correction is any time the user rejects, edits or overrides what an agent proposed:** wording, a recommendation, a triage call, a design choice, a spec line, an answer for a blocked builder. Record it even when it's small. Corrections are what retro learns from.
- If the reason isn't obvious, ask "why?" once, lightly. If the user skips it, write "no reason given" and don't ask again.
- If a correction should apply again ("never use modals for this", "we say members, not users"), mark it `rule` and add it to **Standing rules** at the top. Ask if you aren't sure whether it's a one-off.
- Summarise. It's a log, not a transcript.
- Land the log on main with the stage's docs, in the same docs-only PR. If the stage has no PR, open a docs-only one for the log.

## 6. Before showing anything
Check each standing rule that applies to this stage was followed. If one wasn't, fix it first and don't show the slip. This is how a correction made once stays made.

## What retro does with this
`retro` reads every decision log for the round. It groups corrections by stage and by kind, asks why the agent got it wrong, and turns repeated corrections into edits to the skills themselves. A rule that holds across projects moves out of the logs and into the skill that kept getting it wrong. Retro also reviews the tiers: a kind of decision moves down a tier after a round with no corrections to it, and up a tier after two corrections.