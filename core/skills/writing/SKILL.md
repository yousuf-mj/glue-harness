---
name: writing
description: Write or review any document people will read (proposal, onboarding guide, how-to, runbook, decision doc, update, email): pick the doc type, voice and tone, apply the Microsoft-based style rules with UK spelling, use the summary-first layout, offer wording options when naming things, check it against the reader, and run a humanizer pass. Use for drafting, editing or reviewing prose.
---

# Writing

Version: 0.2.0

## 0. Load first
Load the `me` skill and the active `profile-<name>` skill. Apply every standing rule they list. Say in one line which ones you're applying.

## 1. Before writing: settle four things
Ask only what you can't find yourself. One question at a time.
1. **Reader.** Who reads this, what do they already know, and what will they do after reading it? Name the least experienced reader. The author is not the reader (see `references.md`: COK, EBS).
2. **Job.** What one decision or action should the doc lead to?
3. **Type.** Pick one from the table. A doc that tries to be two types gets split.

| Type | Use for | Shape |
|---|---|---|
| **Tutorial** | Learning by doing (first day setup) | Goal, numbered steps with the result of each, what you've learned |
| **How-to** | A known task (request access, raise a ticket) | Goal, prerequisites, numbered steps, "If you see X, do Y" |
| **Reference** | Facts to look up (who owns what, where docs live) | Tables and lists, no narrative |
| **Explanation** | Why things are the way they are | Short sections, plain argument |
| **Proposal** | Asking for a decision (AI credits) | Problem, options with cost and risk, recommendation, what happens if we do nothing, decision needed by when |
| **Runbook / troubleshooting** | Fixing a known problem | Title is the exact error or symptom, when it happens, cause, fix, warning before any step that changes data |
| **Decision record** | Recording a hard-to-reverse call | Context, decision, consequences |

An onboarding doc is usually a short tutorial for day one plus a reference page, not one long document.

4. **Voice and tone.** Voice is who is speaking: it stays the same everywhere. Tone is how formal the piece is: it changes with the situation (MC-VT, NNG-TONE). Say in one line which voice and tone you're using.
   - **Voice:** `voice/yousuf.md` for anything sent in my name. If it's in someone else's name or the company's, ask.
   - **Tone:** use the default for the type, then let the reader override it. A how-to for customers is formal; a proposal to my own team can be neutral.

| Tone | File | Default for |
|---|---|---|
| **Casual** | `tone/casual.md` | Slack messages, meeting invites, quick emails to people I work with |
| **Neutral** | `tone/neutral.md` | Updates, tutorials, how-tos, reference, explanations, runbooks |
| **Formal** | `tone/formal.md` | Policies, proposals, decision records, anything for leadership, customers or outside the company |

- The style rules in section 3 apply in every tone. Casual is no excuse for unclear.
- **Writing to me is not writing as me.** `me` governs replies to me (signpost emojis, confidence ratings, hard answer first). The voice file governs text I'll send. Never carry one into the other.

## 2. Layout of every doc
Casual-tone messages use the shape in `tone/casual.md` instead.
- **Summary at the top:** at most 5 lines. What it is, what it decides or asks, what changes for the reader, and the one thing that most needs attention.
- **Body:** the shape for its type.
- **Decisions and actions at the end:** one line per decision with who made it; a checkbox list of actions, each with an owner and what it blocks. If nothing is open, say so.

## 3. Style rules
Base: Microsoft Writing Style Guide. Supplements fill its gaps. Each rule's source key is in `references.md`.
- **UK spelling** everywhere.
- **Plain words.** Split sentences over 25 words; at most 5 sentences a paragraph (GOV-CLEAR).
- **Must / need / can:** "must" for legal or hard requirements, "need" for other required steps, "can" for options (GOV-CLEAR).
- **Steps** (MS-STEP, GOOGLE): a numbered list for two or more steps; open each step with an imperative verb; one action per step; location before action ("In Confluence, go to **Spaces**"); state the result in the same step; write "Optional:" at the start, not "(Optional)"; no "please".
- **UI verbs** (MS-UI): *select* for buttons and links, *go to* for places and menus, *enter* for typed values, *turn on / turn off* for toggles, *clear* to deselect. Never *click* or *swipe*.
- **Accessible** (MS-A11Y): never use left, right, above or below as the only clue to location. Link text says where it goes.
- **Error recovery** inside instructions: "If you see X, do Y" at the step where it happens (MIN).
- **Minimal:** the best instruction is one the reader doesn't need. If a tool or page already makes it clear, link to it instead of re-explaining (MS-PROC).
- **Same word for the same thing** everywhere. Use the profile's vocabulary.

## 4. Naming things: the wording table
When the doc names something people will use (a process, a channel, a ticket type, a label, a button), give options instead of choosing alone:

| # | Where | Job of the text | A: Industry standard | B: Plainer | C: House voice | Who uses A | Recommended |
|---|---|---|---|---|---|---|---|

Call A "standard" only if at least 2 named products or organisations use it, and list them. Otherwise write "no clear standard". Show at most 15 rows; I can answer in one line ("all recommended except 4 = B").

## 5. Check against the reader
Before showing a draft, walk it as the least experienced reader from step 1:
- Can they do the job of the doc from this page alone? Where would they get stuck?
- Every term defined or linked on first use? Every acronym spelled out once?
- Anything that assumes knowledge only the author has? (COK)
- Does it match the voice file and the tone file? Check the greeting, the sign-off and the "never use" list.

For anything longer than one page, or going to more than a few people, run `goldfish-review` in doc mode with the Comprehension and Readiness lenses.

## 6. Humanizer pass
Before showing prose meant for other people, remove AI tells. If the humanizer skill is installed, run it. Otherwise check for:
- "Not X but Y" contrasts, staged openers ("Here's the thing"), one-line punchy closers
- Forced groups of three, inflated claims, sales language, stock words (delve, robust, seamless, leverage, journey)
- Dashes used as the main punctuation, bold labels on every line, filler and hedging
- A closing paragraph that restates the body
Keep my meaning. Don't add claims.

## 7. Reviewing someone's writing
Every finding must quote the exact text it's about and name the rule it breaks (a section 3 rule or a source key). A finding with no quote or no rule is dropped. Allow "not enough information to judge". Never rest a finding on "as an expert" (PERSONA).

## 8. Record
- Any change I make to your wording or structure is a correction: record it in Glue as the profile says (a `correction` line in `learnings.md` at work).
- If I say "note that" or "learning:", record a `note` line.
- When I edit a draft written in my voice, offer one line for `voice/yousuf.md` with the before and after. Change the voice file only with my yes.
