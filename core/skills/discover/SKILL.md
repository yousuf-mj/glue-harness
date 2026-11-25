---
name: "discover"
description: "Frame a product idea before any design: problem and evidence, market and competitor research, divergent concepts from parallel agents, then pick the concept worth pursuing. Run before shape."
---

# Discover

The first stage. It answers "is this worth building, and which idea?" by researching the space and generating genuinely different concepts. It stops at choosing a concept; `shape` then works out how that concept should work.

Pipeline: **discover** -> shape -> ux-design -> ui-design / devex-design -> goldfish-review (design) -> elephant-plan -> write-spec -> roadmap -> build-from-spec -> retro.

Skip it for changes to an existing, well-understood feature; say so and start at `shape`.

Output goes in `docs/designs/<slug>-discovery/`.

## 1. Frame
Ask in rounds, using the multiple-choice question tool when available (always allow a free answer; recommend an option first):
- The problem, in the user's words. Who has it, how often, how painful?
- Evidence it's real: conversations, data, reviews, their own experience
- Why now, and why us
- What success looks like in 3 months, and how we'd measure it
- Ambition: what would make this remarkable rather than adequate?
- Constraints: time, budget, team (who builds what), platforms
- Research scope: competitors and products to study, industries to borrow from, where to look (their files, sites, app stores, forums, Reddit, review sites, Product Hunt), depth

Save to `brief.md` and read it back in five lines.

## 2. Research
- **Competitors:** what each does, for whom, pricing, positioning, and what their users complain about (app-store and review-site complaints are the best source of unmet needs).
- **Adjacent industries:** who solves a similar job elsewhere, and what we could borrow.
- **Trends and constraints:** platform changes, regulation, technology that makes something newly possible.
- If a source needs a login, ask first.
- Write `research.md` with cited links and a synthesis: table stakes users will expect, gaps nobody fills well, and where we could be clearly better.

## 3. Diverge
Spawn 4-5 fresh subagents in parallel. Give each only `brief.md`, `research.md` and one lens:
- **Novice:** the simplest thing a first-time user would love
- **Power user:** what the most demanding user would want
- **Contrarian:** what if we did the opposite of the market's convention?
- **Business:** how this makes or saves money and grows
- **Leverage:** what our tech, data or distribution makes uniquely possible

Each returns 2-3 concepts with: a one-line pitch, the core experience in 3-5 steps, why it's better than the alternatives, the riskiest assumption, and a bolder version of the same idea.

## 4. Converge
- Cluster duplicates. Score each concept 1-5 on impact, confidence, effort (inverted) and differentiation. Show the table to the user.
- The user picks a concept or combines several. Record the choice, why, and the runners-up in `decision.md`.
- Keep the bolder version of the chosen concept in `decision.md` as a later ambition, not deleted.
- Don't scope it or design how it works yet; that is `shape`'s job.

## 5. Review and hand off
- Run `goldfish-review` in doc mode on `decision.md` with `research.md`. Ask the Critic: "Is this differentiated enough, and what obvious opportunity is missing?"
- Triage with the user.
- Hand off to `shape`, which reads this folder.

## Tell Glue (last step, every time)
When this skill finishes, before the final reply, run `add-to-quest` so Glue, the quest journal, shows what happened. Don't ask first and don't skip it: a finished skill that Glue hasn't heard about counts as unfinished. If Glue can't be reached, say so in one line and carry on.

- Event: **Stage finished** for the saga (slug = the doc folder prefix), stage `discover`, linking `brief.md`, `research.md` and `decision.md`. Create the saga in the realm if it doesn't exist yet.
