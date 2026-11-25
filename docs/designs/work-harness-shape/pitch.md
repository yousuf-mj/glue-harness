# Pitch: shared AI harness (work edition first)

**Summary.** One GitHub repo holds a shared core of skills for shaping, planning, reviewing, writing docs and learning from corrections. It's designed for two profiles, personal (Glue) and work (a local markdown second brain), but only the work profile is built this round. Build the core and the work profile first, within a couple of evenings plus 1–2 work days. Test it on the my employer onboarding doc.

**Verdict: Go smaller.** Build the core and the work profile only. Move the personal setup onto the core later.

---

## 1. Problem and who has it
I'm an Engineering Manager who's just started at work. My first documents are an engineer/EM onboarding doc, an access-and-process map (who needs what, who to ask, where information lives, raising tickets) and a proposal on AI credits and usage. My personal Claude setup has a mature process for shaping, planning, fresh-context review, documentation and self-learning, but it's tied to personal projects and tools. Work Claude starts from nothing, and the company has no established AI processes.

## 2. Value case, and the case against
- **For (evidence):** three real documents are due soon, so the demand is real. That says nothing yet about whether the harness helps.
- **For (belief, personal use only, nothing measured):** capturing corrections and editing skills from them improved my personal work.
- **For (belief):** plain Claude with an import file misses three things: fresh-context review, an interview before writing, and a consistent doc shape. The skills fix those. Promoted rules improve the output over time.
- **Against:** I've been in the job days. Plain Claude plus the import file may be good enough for the first doc, and time spent on tooling is time not spent learning the company. Keeping two setups in sync adds an ongoing cost.
- **Does it survive?** Yes, as long as the scope stays small and the onboarding doc acts as the test.

## 3. Appetite
A couple of evenings plus 1–2 work days. Fixed. Scope flexes to fit.

## 4. Solution (breadboard)
```
harness/                    personal GitHub repo
  core/skills/              shape, elephant-plan, goldfish-review (doc mode),
                            sign-off, writing (style rules + humanizer), learn
  profiles/work/            local markdown second brain (PARA folders,
                            learnings log, decision log); Confluence for publishing
  profiles/personal/        (later) Glue adapter, personal context
  learnings/                generic promoted rules shared by both profiles
```
1. **Install:** the work machine pulls the core plus the work profile (as a Claude Code plugin if possible, otherwise by copying the skills).
2. **Work:** I run shape or elephant-plan on a proposal. Claude interviews me and writes a doc in the sign-off shape.
3. **Review:** goldfish-review runs in doc mode on the draft, then I triage the findings.
4. **Record:** core skills call a "record" step, and the work profile writes it to the local second brain (decisions, learnings, estimate vs actual).
5. **Learn:** when a correction repeats 2–3 times, `learn` proposes a skill edit. Everything lands in the work profile by default. Learnings and context stay inside the company (local second brain, or Notion if my employer adopts it). A change moves to core only when it's a genuine improvement to a skill or to how learnings work, approved on a separate card after a scrub check for names, systems, customers and internal terms.
6. **Publish:** finished docs go to Confluence.
7. **Sync (later round):** once the personal profile exists, improvements pushed to core are pulled by both. Out of scope now.

## 5. Options considered
- **Notion as the second brain:** my employer only has a trial and its docs live in Confluence. It would also add cost and lock-in. Lost.
- **A Claude artifact like Glue:** tied to one Claude account and not where the company keeps its records. Lost for work; kept for personal.
- **Copying skills by hand into each account:** fastest on day one, but the copies drift. Lost to the shared repo.

## 6. Failure modes
| Failure | Likelihood / impact | Response |
|---|---|---|
| Work AI use not sanctioned: company docs sent to Claude without approval | Medium / high | **Prevent:** confirm what is allowed before using real company content. Until then, draft with placeholders. |
| Learnings leak work detail into core | Medium / high | **Prevent:** separate approval plus a scrub check for every promotion to core. |
| A new manager's first docs read as AI-written | Medium / medium | **Prevent:** humanizer pass; my own examples and judgement in each doc. |
| Local second brain lost on a company laptop | Low / medium | **Accept:** it holds summaries, not records; Confluence holds finished docs. |
| Work IP or data leaks into a personal repo | Medium / high | **Prevent:** keep the core generic. The work profile and second brain stay local unless the contract allows otherwise. |
| Second brain dies from upkeep | High / medium | **Prevent:** Claude does the capture. I only approve promotions. |
| Skills bloat with rules and contradict each other | Medium / medium | **Prevent:** monthly prune in `learn`. |
| Claude app can't install from the repo | Medium / low | **Accept:** fall back to Claude Code or manual upload. |
| It works but doesn't matter | Medium / medium | **Detect:** the onboarding doc test. |
| Over-engineering the adapters | Medium / medium | **Prevent:** two profiles only; no plugin framework. |

**Kill criteria:** after the onboarding doc and the access map, I'd rather go back to plain Claude; or the build runs past 2 work days plus evenings.

**No baseline step (decided):** the aim is to keep the doc-writing practice built up in the personal setup (sign-off shape, wording tables, style rules, humanizer, review lenses), not to prove the harness beats plain Claude.

## 7. Rabbit holes and no-gos
- **Rabbit hole:** installing on the Claude app versus Claude Code. Timebox to 1 hour on the work machine before building more.
- **Rabbit hole:** my employer uses GitLab, not GitHub. The core stays in personal GitHub. The work machine only needs to pull from it over plain git. Check that GitHub isn't blocked on the work network. If it is, keep a read-only copy in a personal GitLab project. Never put the core in my employer's GitLab, since that would make it company property.
- **Rabbit hole:** mapping Confluence structure. Not needed: publish by hand at first.
- **No-gos this round:** team adoption, a team template, giving others their own Claude, the design/spec/build skills, the roadmap, the orchestrator, Notion, and moving the personal setup onto core.

## 8. Riskiest assumptions (check before building)
1. **Using Claude with company content is allowed.** Resolved: confirmed allowed. Context and learnings must stay within the company.
2. **Personal GitHub and local repos are allowed on the work machine, and harness work isn't company IP.** Belief, stated by me. Test: 5 minutes with the contract's IP clause, done before any build work. Fallback if it's not allowed: build the core only in personal time on a personal machine, and copy skills into work Claude by hand.

## 9. Success measure
Compared with the plain-Claude baseline section, the harness sections need fewer rewrites and catch at least one real issue in review. At least three learnings are captured across the first three docs. Rule promotion isn't expected yet.

## 10. Open questions
- Can the work Claude app install plugins from a GitHub repo, or only Claude Code?
- How should a "team template" eventually derive from core (parked)?

## Decisions and actions for you
- Decided: shared repo, core plus two profiles; work profile first; local markdown second brain; Confluence for publishing; promotion to core needs its own approval.
- **Action:** check the contract's IP clause.
- **Action:** confirm whether the work account uses the Claude app, Claude Code, or both.
