---
name: "ux-design"
description: "Design how a product works for its users before any visuals: users and jobs, journeys, task flows with error paths, information architecture, wireframes, states and microcopy. Feeds ui-design."
---

# UX Design

UX decides how the product behaves across a user's whole task; UI decides how it looks. This skill does the first and stops before colour, type or polish. Wireframes stay greyscale.

Pipeline: discover -> shape -> **ux-design** -> ui-design (if there's a UI) / devex-design (if there's a developer surface) -> goldfish-review (design) -> elephant-plan -> write-spec -> roadmap -> build-from-spec -> retro.

Skip it when the change reuses an existing flow unchanged; say so.

All output goes in `docs/designs/<slug>-ux/`.

Before the first question, read `docs/decisions/<slug>.md` and apply its standing rules (`sign-off` step 1). Every doc written here uses the `sign-off` layout: a summary at the top, then decisions and your actions at the end.

## Pick the size
- **Light:** a change to an existing product. Do step 0, the real occurrence in step 1, then task flows, a screen list and states. Skip journey maps, competitor research and the usability test plan. Aim for under an hour.
- **Full:** a new product area or a new way of working. Do every step.

Say which size you chose in one line. The user can overrule it.

## 0. Start from the shaping
- If `docs/designs/<slug>-shape/pitch.md` exists, read it fully, plus anything in `docs/designs/<slug>-discovery/`. Design the detailed flows for the chosen option only, within its appetite and no-gos. Don't re-open the options; if the pitch looks wrong, raise it with the user and update the pitch first.
- If there's no pitch and the change involves a new way of working, recommend running `shape` first. If the user declines, cover the basics in the intake below.
- Read the repo and existing docs so you don't ask what you can see.

## 1. Intake
Ask in rounds, using the multiple-choice question tool when available (always allow a free answer; recommend an option first). Skip anything the discovery or pitch already answers.

**Start with one real occurrence.** Walk through one real instance of what's being designed, from start to finish, using the live site, posters, messages or by watching it happen. Record what repeats, what splits and what varies each time in `brief.md`. The screens must show this real shape, not the shape of the database. If nobody has seen a real one, say so and mark it as the top assumption.

**Round 1: users and jobs**
- Who are the users? Distinct segments, how often they use it, expertise
- The job each segment is trying to get done, and what triggers it
- Context of use: device, environment, time pressure, interruptions, emotional state. Which tasks happen on a phone, and which on a laptop?
- How they do it today, and where it hurts (workarounds are the best evidence)

**Round 2: evidence and research**
- What evidence exists: analytics, support tickets, interview notes, reviews, sales calls? Ask for the files or where to find them
- Competitors and products from other industries that solve a similar job well, by name
- Where to look: their files, competitor products, Mobbin (default when connected) or other pattern galleries, app-store reviews, forums, or "you pick"

**Round 3: outcomes and risk**
- Success metrics (task completion, time on task, conversion, error rate, retention)
- What happens if a user gets it wrong: is the mistake cheap or costly, reversible or not?
- Constraints: accessibility target (default WCAG 2.2 AA), locales, legal or compliance steps, platforms

Save answers to `brief.md`. Mark anything not backed by the user or evidence as an assumption. Read it back in five lines and get a yes.

## 2. Research
- Study existing evidence first, then competitor and cross-industry flows. Reuse the discovery research rather than repeating it.
- **Mobbin first when it's connected:** use `search_flows` for the key tasks (e.g. "book a class", "cancel subscription", "onboarding") and `search_screens` for individual states (empty, error, confirmation). Search for named competitors and for the job itself, so cross-industry examples show up. If Mobbin isn't connected or has nothing relevant, use web search, competitor sites and app-store screenshots instead, and say which source each reference came from.
- Save the references you use to a Mobbin collection named after the project and stage (e.g. "<project> – UX flows"), creating it if it doesn't exist, so ui-design and later reviews can reuse it. Add a short comment on each saved item saying why it was picked.
- For each: link, the flow step by step, what works, what to avoid.
- Write `research.md` with cited links and a synthesis: conventions users will expect, and opportunities to do better.

## 3. Journeys and flows
- **Journey map** per main segment: stages, actions, what they're thinking, pain points, opportunities. Include before and after the product touchpoint.
- **Task flows** for every key task as Mermaid flowcharts, expanding the pitch's breadboard. Include decision points, validation, error and recovery paths, cancel/back, and re-entry after interruption.
- For key interaction choices within the chosen option, give two options: the proven pattern and a bolder one, with honest pros and cons. When principles conflict (e.g. fewer steps vs safety), decide by task frequency first, then cost of an error, then the user's emotional state. Record the decision.

## 4. Information architecture
- Content and object model: the things users see and act on, using `GLOSSARY.md` terms
- Navigation structure and labels
- What lives on which screen, and why

## 5. Wireframes and states
- A screen list with each screen's single purpose and primary action.
- Greyscale wireframes of the key screens at laptop and phone widths, as one self-contained HTML file, with realistic content.
- A state inventory for every screen: loading, empty first use, empty no results, partial data, error, offline, permission denied, success.
- Interaction details: what gives feedback within 0.1s, what shows progress past 1s, what lets the user leave and come back for anything longer.

## 6. Microcopy and wording table
List every word that carries the flow: navigation, screen titles, labels, button text (verbs), placeholders, empty states, errors (what happened, why, how to fix), confirmations and notifications. Put each one in `docs/designs/<slug>-wording.md` following `sign-off` step 3: the industry standard (and which products use it), a plainer option, and a product-voice option, with one recommended. The user chooses. Wireframes show only chosen wording. `copy.md` lists the chosen wording and links the table.

If `docs/review-packs/usability/` exists, write every row to pass its `checklist.md` (buttons, errors, empty states, confirmations, forms, AI labels) and follow its `house-rules.md`. For each element, check the five parts: what it is, why it is there, what happens when used, what feedback follows, and how to recover. Option C uses `docs/voice.md` when it exists. Tone follows the moment: no playfulness in errors, data loss, payments or anything about harm.

**Where help goes.** Anything a user needs to finish the task goes on screen (label, hint or inline text), never only in a tooltip or article. Tooltips hold optional extras for one control. Troubleshooting, concepts and branching tasks go in a help article, written to `docs/review-packs/comprehension/checklist.md` (Microsoft Writing Style Guide base). List any article needed in `copy.md`.

Do this before the wireframes are final, not after, so you don't redo screens.

## 7. Critique
- Self-check against usability heuristics: visibility of status, match to the user's language, control and undo, consistency, error prevention, recognition over recall, minimal cognitive load, helpful errors. Also keyboard and screen-reader order.
- Check the design still fits the pitch's appetite and no-gos.
- Run `goldfish-review` on this folder (stage mode): a fresh reviewer walks each task as a first-time user and says where they'd get stuck.
- Triage with the user and apply approved fixes.
- For full-size work, write a short usability test plan: 3-5 tasks to try with 3-5 real users.

## 8. Sign off and hand off
Run `sign-off`: the summary, wording rows still open, decisions, and your actions. Then wait for an explicit approval and log the decisions and any corrections. Only then tell the user the UX is ready. `ui-design` takes the screens, states and copy from here and adds the visual design. `elephant-plan` links `docs/designs/<slug>-ux/` and the shape pitch.

## Tell Glue (last step, every time)
When this skill finishes, before the final reply, run `add-to-quest` so Glue shows what happened. Don't ask first and don't skip it: a finished skill that Glue hasn't heard about counts as unfinished. If Glue can't be reached, say so in one line and carry on.

- Event: **Stage finished** for the saga, stage `ux-design`, linking `flows.md` and the folder, once its review has passed.