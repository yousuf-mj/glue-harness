---
name: "orchestrate-build"
description: "Run a repo's spec queue as a build manager: triage drafts and ready specs, plan parallel waves by priority and dependencies, run builder agents, debrief each spec and update Glue."
---

# Orchestrate Build

This session is the manager, not a builder. It reads the spec queue, decides what gets worked on and in what order, runs builder agents in parallel where it is safe, and closes each spec with a Glue update and a short debrief. It writes no product code itself.

Pipeline: write-spec / quick-spec -> roadmap -> **orchestrate-build** (runs build-from-spec per spec) -> retro.

Start it in a fresh session on the repo, e.g. "orchestrate the build for <repo>". Optional inputs: a priority list, a max number of parallel builders, specs to skip.

## 0. Set up the run
1. Fetch the latest main. Main's spec folder is the queue; ignore specs that only exist on branches (list them for the user to land or drop).
2. Read the spec index(es), `.agents/tracker.md` and its mirror if they exist, and `docs/builds/` for an unfinished run. If a run file from an earlier session has open items, resume it instead of starting over.
3. Ask once, in one question round (with your recommendation for each):
   - Max parallel builders (recommend 1 per machine for local builds: two at once cause false test timeouts; more in the cloud)
   - Will they be away during the run? Local or cloud builds (recommend local while they're around). Whenever the user later says they're leaving, shutting down or going out, offer at once to move the remaining builds to the cloud. Cloud sessions don't report back, so check their PRs.
   - Whether builders may push branches and open PRs without asking each time (merging always stays with the user)
   - Any priority order that overrides the tracker
4. Create the run file `docs/builds/<YYYY-MM-DD>-run.md` (local until close-out). It holds the plan, wave status, and a log line per event, so a later session can pick it up.

## 1. Triage every spec on main
Read each spec that isn't `done` and put it in one bucket:

| Bucket | Test | Action |
|---|---|---|
| **Build now** | approved/ready, every dependency `done` on main | Goes in the next wave |
| **Waiting** | approved/ready, a dependency not yet `done` | Queue behind it |
| **Needs improving** | approved/ready but would fail a readiness check: vague ACs, missing contracts, TBDs, over ~300 lines, depends on something undefined | Don't build. Propose fixes (see below) |
| **Needs writing** | `Status: draft` | Don't build. Say what's missing and whether it needs `write-spec` (from a design doc) or `quick-spec` |
| **In flight** | `in-progress` | Check for an open branch/PR; resume or flag it as stale |

For Needs improving, run `goldfish-review` in doc mode (Readiness reviewer only) on those specs, in parallel with the first wave. Spec approval is always the user's call: present fixes, apply only what they approve, and land them on main the way `write-spec` step 5 does. Then the spec moves to Build now or Waiting.

## 2. Plan the waves
1. Priority order: the user's stated order, then the tracker's order, then the index's dependency order, then spec number.
2. Build the dependency graph from each spec's `depends on`. Flag cycles and missing dependencies as blockers.
3. Fill each wave in priority order, up to the max builders, skipping any spec that conflicts with one already in the wave:
   - Its "Files likely to change" overlap with another spec's
   - Both change the database schema or migrations
   - Both change the same contract (endpoint, event, shared type)
   Conflicting specs go in the next wave, so builds don't fight over merges.
4. A dependent spec can only start once its dependency's PR has merged to main (build-from-spec checks `done` on main). Show this as the critical path.
5. Show the user one short table: wave, spec, priority, depends on, why it's in this wave, estimate (from the tracker if there is one). Note the critical path and anything blocked. Get one OK, then start.

## 3. Run builders
For each spec in the wave, spawn one builder agent in the background with an isolated git worktree. Pass only:
- The spec's path on main and the repo
- This prompt:

> Run the `build-from-spec` skill on `<spec path>`, on a fresh branch `build/<NN>-<slug>` from the latest main. Don't merge: the build manager merges. You cannot ask the user questions. If you hit anything that build-from-spec says to stop and ask about, stop and return `BLOCKED` with the exact question and your recommended answer. <Push and open the PR when done | Stop before pushing and return `READY_FOR_PR`>. Before finishing, add a `## Findings` section at the end of the spec in your branch: what was unclear or wrong in the spec, surprises in the code, decisions you made that the spec left open, and anything the next builder should know. Return a report: status (DONE / READY_FOR_PR / BLOCKED / FAILED), branch, PR link, commits, ACs covered and by which tests, spec changes made, review findings (FIX / CONTEST / ASK counts), time from first to last commit, and anything you're unsure of. Estimate each step up front, start every recap with `Step N of M: <step>, est <time>`, and end the report with a table: step | estimate | actual | why it differed. Review with a fresh-context reviewer, never your own. Never CONTEST a CLAUDE.md rule: follow it or ask.

Start each builder on the model and effort the spec's `build_model` / `build_effort` fields name; if they're missing, use the session default.

Don't pass conversation history or your view of the spec: the build should depend on the spec alone.

While builders run:
- Don't poll. React when a builder reports back.
- `BLOCKED`: if the question is a small detail the spec left open, answer it and continue that builder with SendMessage. If it changes behaviour or scope, take it to the user, with the builder's recommendation.
- `READY_FOR_PR`: batch these and ask the user once for the set.
- `FAILED`: read the report, decide retry (once), send back to `quick-spec`/`write-spec`, or park. Say which.
- When a builder's slot frees up, start the next unblocked spec from the plan; don't wait for the whole wave.
- When a PR is open and green, ask the user to merge it (or merge it if they say so). Merging is what unblocks dependents.
- When main moves, check `git diff --name-only` before sending a builder back to rerun: docs-only moves don't need one, unless the repo's tests read those docs.
- Don't land your own process or tooling PRs while builders are in their test phase; each one forces reruns.

Keep the user's view short: one line per event (started, blocked, PR ready, merged), and the task list ticked as specs finish.

## 4. Close each spec (every time a spec's PR merges)
1. **Glue**: run `add-to-quest` for the PR merged event (and PR opened, if not already told). Don't skip it.
2. **Debrief**: write `docs/builds/debriefs/<NN>-<slug>.md`, about 5 minutes of work, from evidence rather than impressions. Read the builder's report, the PR diff and description, the review log lines, and the spec's Findings section.
   - Outcome: done / done with changes / parked, and the PR link
   - Estimate vs actual time, and builder rounds (retries, SendMessage continuations)
   - Spec quality: changes made mid-build, questions raised, ACs that were untestable or missing. This is the best signal of how well the spec stage worked.
   - What the agents did: steps that helped, steps that were wasted, anything done that wasn't asked for, review findings that were worth having vs noise
   - Usefulness: 1–5, with one sentence on why
   - Improvement candidates: each one line, tagged with the skill or file it would change (e.g. `[write-spec] require error codes in Contracts`, `[orchestrate-build] stagger schema specs`)
3. **Archive the builder's chat**, only once all four are true: the PR is merged to main, the spec's Findings section is on main with it, the debrief is written, and Glue has the merge event. If any is missing, leave the chat open and say which one is missing.
   - If this session has a tool that can archive or close a chat or session, use it on that spec's builder chat. Archive only the builder chat for this spec, never the orchestrator's own chat or another spec's.
   - If there's no such tool, or it fails, post one line: "Safe to archive: <spec> builder chat" with a direct link to that chat, so the user can archive it.
   - Log it in the run file: archived, or handed to the user.
4. If the spec changed behaviour, copy or a design, run `design-sync` so designs, guides and the design register match what shipped.
5. Add a line to the run file and replan if a merge unblocked something.

## 5. Close out the run
When the queue is empty, blocked, or the user stops:
1. Finish the run file: what was built, PRs, what's blocked and on what, what still needs writing or improving, and which builder chats were archived or are still open (with the reason, e.g. PR not merged yet).
2. Add an **Improvement plan**: group the debriefs' improvement candidates by skill, count how often each came up, and list the top 3–5 with the evidence. This is input for `retro`; don't edit skills here.
3. Land `docs/builds/` (run file and debriefs) on main in one docs-only PR, the way `write-spec` lands docs.
4. If `.agents/tracker.md` exists, run `roadmap` status mode so the tracker matches main.
5. Recommend the next step: `retro` once a round has shipped, or the `write-spec` / `quick-spec` runs the drafts need.

## Tell Glue (last step, every time)
When this skill finishes, before the final reply, run `add-to-quest` so Glue shows what happened. A finished run that Glue hasn't heard about counts as unfinished. If Glue can't be reached, say so in one line and carry on.
- Every spec closed in this run has had its PR events applied.
- Add a **Note** to each saga the run touched, with the run file's path and the top improvement candidate.

## Rules
- Never build from a draft, a design doc or the conversation; that's build-from-spec's gate and the orchestrator doesn't bypass it.
- Never approve a spec or merge a PR without the user.
- Never run two builders on conflicting specs.
- Never archive a builder chat before its PR has merged and its learnings (Findings, debrief, Glue) are saved: the chat is the only record until then.
- If more than one builder fails for the same reason, stop starting new builds and show the user: it's probably a spec or setup problem, not a builder problem.