---
name: "shape"
description: "Between discover and design: grill the idea adversarially (value, failure, pre-mortem), set an appetite, compare 3 options, resolve risks, and reach a go / go-smaller / no-go verdict and pitch."
---

# Shape

Discover decided *which* idea is worth pursuing. Shape decides whether it's truly worth building, how it could fail, and *how it should work* at the level of a rough sketch, before anyone spends time on detailed design.

Pipeline: discover -> **shape** -> ux-design -> ui-design / devex-design -> goldfish-review (design) -> elephant-plan -> write-spec -> roadmap -> build-from-spec -> retro.

Stay at the right altitude: concrete enough to see how it works, rough enough that design still has room. No colours, no pixel layouts, no code. Write in plain language so a non-technical teammate can lead this stage; bring in engineering only for feasibility.

Input: `docs/designs/<slug>-discovery/` (read `decision.md` and `research.md` first). Output: `docs/designs/<slug>-shape/`.

## How to grill (applies to steps 1-2)
You are a sceptical investor and a seasoned operator, not a cheerleader.
- No praise, no reassurance, no "great idea". Your job is to find out whether this deserves to exist.
- One question at a time. After each answer, push on it until it is specific: who exactly, how many, how often, how do you know?
- Label every claim as **evidence** (data, research, real conversations) or **belief** (opinion, hope). Beliefs that the plan depends on go on the assumptions list.
- Name contradictions with the research, earlier answers or the appetite out loud.
- Give your own view with each question, including when you think the answer is "don't build this".
- Don't move on from a branch until it is resolved or explicitly recorded as an open risk.
- If the user is the only evidence for a claim, say so.

## 1. Grill the value
- In one sentence: what problem, for whom? Is that the real problem or a symptom of a bigger one?
- How painful is it, and what do people do about it today? (No workaround usually means not painful enough.)
- What happens if we do nothing? Who loses, and how much?
- Why would someone choose this over the alternatives, including doing nothing?
- What is it worth to them (money, time, risk removed), and to us (revenue, growth, learning)?
- What does it cost us to build and to run, including our time and attention?
- What is the smallest thing that would genuinely solve it? What is the 10x version?
- Make the strongest honest case for **not** building it. Does the value case survive it?

## 2. Grill the failure
**Pre-mortem.** "It's six months from now and this has failed. Write the story of why." Generate the most likely failure stories, then check each of these failure modes:
- **Nobody comes:** the people we target don't find it, or don't care
- **Nobody returns:** they try it once and leave
- **Nobody pays:** the value is real but not worth paying for
- **It doesn't work:** technical, data, integration or quality failure
- **It works but doesn't matter:** it ships and the metric doesn't move
- **It gets outrun:** a competitor or a platform does it better or for free
- **It costs too much:** to build, support, moderate or maintain
- **It does harm:** privacy, safety, trust or reputation damage
- **We stall:** the team runs out of time, skill or motivation

For each plausible failure: how likely, how bad, how early we'd notice, and how reversible it is. For the serious ones, decide: prevent it (change the plan), detect it early (a metric or signal), or accept it.

Then set **kill criteria**: the signals, with numbers and dates, that would make us stop or change course after launch.

## 3. Set the appetite
Ask how much time this is worth (e.g. 1 week, 2 weeks, 6 weeks), given the value from step 1. Time is fixed; scope flexes to fit. Every option below must fit.

## 4. Generate options
Spawn 3 fresh subagents in parallel, each given only the problem statement, appetite, value case, failure list, `decision.md` and `research.md`, and told to propose a genuinely different approach (e.g. build it fully, integrate an existing tool, a manual or concierge version first, a different interaction model). Separate agents avoid anchoring on the first idea.

Each option returns:
- How it works, as a breadboard: the places (screens or steps), what the user can do in each, and how they connect, in 5-7 steps
- What it reuses from what already exists
- Rough effort against the appetite
- Which failure modes from step 2 it reduces or makes worse
- Feasibility notes: hidden complexity, data that must exist, external integrations
- The biggest risk

## 5. Compare and choose
Show the options side by side, scored against: solves the core problem, fits the appetite, failure risk, differentiation, and reversibility. Recommend one and say why, including your doubts. The user decides; combining options is fine.

## 6. Rabbit holes and no-gos
- List the unknowns that could blow up the timeline. For each, decide with the user: settle it now, cut it, or run a timeboxed spike.
- List explicit no-gos: things deliberately not done this round.

## 7. Test the riskiest assumption
Take the belief that, if wrong, would sink the idea. Propose the cheapest test before design: a clickable fake, a concierge trial, five user conversations, a landing page, or a technical spike. Run it, or record the decision to proceed without it and why.

## 8. Verdict
Give an honest verdict, with reasons:
- **Go:** value is clear, failures are covered, it fits the appetite
- **Go smaller:** worth doing, but only a reduced version (say which)
- **Test first:** run the step 7 test before committing
- **No-go:** not worth it now (say what would change your mind)

The user makes the final call; record it and any disagreement.

## 9. Write the pitch
Write `docs/designs/<slug>-shape/pitch.md`:
1. Problem and who has it
2. Value case, and the case against
3. Appetite
4. Solution: the breadboard of the chosen option
5. Options considered and why they lost
6. Failure modes, how each is prevented or detected, and kill criteria
7. Rabbit holes and no-gos
8. Riskiest assumption and how it was tested (or why not)
9. Success measure
10. Verdict and open questions

## 10. Review and hand off
- Run `goldfish-review` in doc mode on `pitch.md`. Ask the Critic: "What failure mode is missing, is there a simpler option, and is the value case honest?"
- Triage with the user.
- On go or go smaller, hand off to `ux-design`, which designs the detailed flows for the chosen option only.

## Tell Glue (last step, every time)
When this skill finishes, before the final reply, run `add-to-quest` so Glue shows what happened. Don't ask first and don't skip it: a finished skill that Glue hasn't heard about counts as unfinished. If Glue can't be reached, say so in one line and carry on.

- Event: **Stage finished** for the saga, stage `shape`, linking `pitch.md`. On a no-go, add a Note to the saga with the verdict instead of a trail step.
