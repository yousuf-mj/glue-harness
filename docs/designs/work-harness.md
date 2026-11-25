Status: draft

# Design: Work harness (shared core + work profile)

## Summary
- **What:** a personal GitHub repo holding a shared core of skills (shape, elephant-plan, goldfish-review, sign-off, writing, learn) and two small profiles (work, personal) that tell the core where things live.
- **Decides:** the core never names a tool or a company. "Glue" is the role name for the place where state goes. At work, Glue is a local folder of markdown files.
- **Changes for me:** at work, Claude Code and the Claude desktop app run the same skills. Corrections are captured automatically, and a Friday `learn` run turns repeats into rules.
- **Needs attention:** the 1-hour install timebox on the work laptop (plugin install vs manual upload).
- Waiting for your sign-off.

---

## 1. Problem and goal
I'm an Engineering Manager who has just started at work. My personal Claude setup has a strong practice for shaping, planning, fresh-context review, documentation and learning from corrections, but it's tied to personal tools (the Glue artifact, Notion, Playground, Christine). I want that practice at work, kept in one place, so an improvement made in one setup can flow to the other.

**Goal:** one repo of core skills, usable at work through a work profile, with my employer knowledge kept on the work laptop.

**Non-goals (this round):**
- Team adoption, a team template, or Claude for other people
- Porting wave 2 and 3 skills (they're in the repo as-is; see docs/skill-status.md)
- Moving the personal setup onto the core
- A phone view of work Glue (later idea: a read-only artifact built from the files)
- Notion at work

## 2. Glossary
See [GLOSSARY.md](../../GLOSSARY.md). Terms used here: **core**, **profile**, **Glue**, **learning**, **standing rule**, **promotion**, **`me.md`**.

## 3. Design

### 3.1 Repo layout (personal GitHub: `harness`)
```
harness/
  .claude-plugin/marketplace.json     lists the plugins harness-core and harness-work
  core/                               plugin: harness-core
    .claude-plugin/plugin.json        name, version (semver)
    skills/                           all 19 skills, copied as-is; ported in waves (docs/skill-status.md)
                                      wave 1: shape, elephant-plan, goldfish-review, sign-off, owl, writing (new), learn (new)
    hooks/hooks.json                  SessionStart: pull updates, print me.md
    me.md                             how I like to work and read (shared by both profiles)
    templates/glue-files/             starter Glue folder (see 3.4)
  profiles/
    work/                             plugin: harness-work
      .claude-plugin/plugin.json      name, version, requires core version range
      profile.md
    personal/                         later round
      profile.md
  docs/                               designs, ADRs, decision log for the harness itself
  GLOSSARY.md
  CHANGELOG.md
```

**Boundary rule:** something goes in GitHub only if it would make sense at any company. Anything naming my employer, a colleague, a system or a customer lives in work Glue on the laptop ([ADR 0001](../adr/0001-github-holds-no-company-content.md)).

### 3.2 Profile contract (`profile.md`)
Every core skill reads the active profile skill (`profile-<name>`) before its first step. It is plain markdown with these headings, all required:

| Heading | Work value | Meaning |
|---|---|---|
| `## Glue` | `type: files`, `path: ~/glue/` | Where state is read and written |
| `## Publish` | `Confluence (by hand)` | Where finished docs go |
| `## Sign-off` | `me` | Who approves gates |
| `## Core version` | `>=0.1.0 <0.2.0` | Core versions this profile supports |
| `## Extra rules` | `~/glue/standing-rules.md` | Company-specific rules to load after core rules |

**Missing or incomplete profile:** the skill stops and names the missing heading. It doesn't guess.

**Which profile is active:** the installed profile plugin. Only one profile plugin is installed per machine. Each profile is a skill, `profile-<name>` (in `profiles/<name>/skills/`), so the Claude app gets it too. In Claude Code the profile's SessionStart hook also prints it and `~/glue/standing-rules.md`. In the Claude app, which runs no hooks, every core skill's step 0 loads `me` and the active profile skill.

**Vocabulary:** project (was realm), epic (was saga), ticket (was quest). No themed wording.

### 3.3 Skills in core
- **shape, elephant-plan:** ported as they are, with the personal parts removed. "Tell Glue" becomes "record in Glue as the profile says". Saga and quest wording becomes "the piece of work".
- **goldfish-review:** doc and bug modes. Stage, design and code modes are left out this round.
- **sign-off:** keeps the doc layout (summary at the top, decisions and actions at the end), the approval tiers and the decision log format. The reading rules move to `me.md`. The Christine and Playground sections stay in the personal setup.
- **writing (new):** Microsoft Writing Style Guide as the base, UK spelling, a humanizer pass before showing any prose meant for others, and the wording table (A industry standard / B plainer / C house voice) when naming things.
- **learn (new):** see 3.5.

### 3.4 Work Glue (`~/glue/`)
Files only ([ADR 0002](../adr/0002-work-glue-is-files.md)). Layout follows PARA:
```
~/glue/
  README.md               what goes where
  inbox.md                quick captures that aren't filed yet
  learnings.md            one line per learning (format below)
  standing-rules.md       promoted company rules
  projects/<slug>/        a piece of work: docs, decisions.md, notes
  areas/                  ongoing responsibilities (team, 1:1s, hiring, on-call)
  resources/              reference material (systems, people, how-tos)
  archive/                finished projects
```

**`learnings.md` line format**
`- YYYY-MM-DD | <skill> | <kind: correction | note | estimate> | <what happened> → <what I wanted> | why: <reason or "no reason given"> | count: 1`
An estimate line also records `est: <time> actual: <time>`.

### 3.5 Learning loop
1. **Automatic capture:** when I reject or change something a core skill proposed, the skill appends a `correction` line to `learnings.md`. It doesn't ask first.
2. **On request:** when I say "note that" or "learning:", it appends a `note` line.
3. **Friday `learn` run** (on request, or as a scheduled task):
   - Groups the week's lines and raises `count` on repeats.
   - **Promotes** any learning with `count >= 2` to `standing-rules.md`, as a proposal I approve.
   - **Core candidates:** a learning that passes the boundary rule and improves a skill or the loop itself is proposed as a core change. Each one needs its own approval and a scrub check that it names no company, person, system or customer. Approved core changes become a commit in `harness` with a `CHANGELOG.md` line.
   - **Prune:** standing rules not applied in 8 weeks are proposed for removal.
   - **Estimates:** reports the median of actual divided by estimate over the last 10 estimate lines. Skills that estimate read this ratio.

### 3.6 Install and update
- **Claude Code:** `harness` is a plugin marketplace. Install `harness-core` and `harness-work`. A SessionStart hook runs `claude plugin marketplace update harness` and updates both plugins at every session start, never blocking. New versions load from the next session.
- **Claude app (desktop):** upload each core skill folder as a skill, and connect `~/glue/` as a folder so the app can read and write it. Re-upload after a core version change.
- The work laptop pulls from personal GitHub over plain git. If GitHub is blocked, use a personal GitLab mirror. Never use my employer's GitLab.

### 3.7 Failure handling
| Case | Behaviour |
|---|---|
| `~/glue/` missing | Create it from `templates/glue-files/` and say so in one line |
| Company rule conflicts with a core rule | The company rule in `standing-rules.md` wins at work; the conflict is listed at the next `learn` run |
| Profile's `Core version` doesn't match the installed core | The skill warns once per session and carries on; `learn` lists it |
| Claude app has an older skill version than Claude Code | `learn` compares the `version:` line in each skill and lists stale ones |
| Learning line malformed | `learn` lists it for a fix and doesn't promote it |
| Promotion would put company detail in core | Blocked by the scrub check; stays in `standing-rules.md` |

## 4. Modules affected
New repo `harness`. Source skills are copied from the personal setup (shape, elephant-plan, goldfish-review, sign-off). The personal skills themselves don't change this round.

## 5. Success criteria
- On the work laptop, Claude Code and the desktop app both run shape, elephant-plan, goldfish-review, sign-off and writing, using the work profile.
- The onboarding doc is written with the harness: it has the summary, decisions and actions layout, and a goldfish doc review.
- At least 3 learnings are captured across the first 3 work docs.
- No company content is in `harness` (checked by `learn`'s scrub on every core candidate, plus a manual search before each push).

## 6. Testing approach
- **Fresh-agent run per skill:** a new subagent with only the repo and a sample proposal (made-up company) runs the skill. Check the output has the required layout, reads `profile.md`, and writes to a temp Glue folder.
- **Learning loop:** seed `learnings.md` with fixed lines (repeats, a malformed line, one with company terms). Run `learn` and check promotions, the malformed-line report and the blocked scrub.
- **Profile contract:** run a skill with a missing heading and check it stops and names the heading.
- **Install:** done by hand on the work laptop, both surfaces.

## 7. Rollout and rollback
- **Rollout:** build and test on personal time, install on the work laptop, then first real use on the onboarding doc.
- **Rollback:** uninstall the two plugins and remove the uploaded skills. Work Glue stays as plain files and keeps its value without the harness.

## 8. Proposed slicing
1. Repo skeleton, marketplace, profile contract, `me.md`, `GLOSSARY.md`, all skills copied as-is, update hook (done 2026-11-25)
2. Port wave 1: shape, elephant-plan, goldfish-review, sign-off (core part), owl
3. `writing` skill
4. `learn` skill plus the work Glue template
5. Install on the work laptop (1-hour timebox: plugin vs upload)
6. First real use: onboarding doc

## 9. Open questions
- Does the work Claude app allow uploading custom skills under my employer's org settings? (Answered during slice 5.)
- Should the Friday `learn` run be a scheduled task or on request? Default: on request until it's used twice.
- When the personal profile is built, does personal Glue keep quest and saga vocabulary in its adapter only? (Next round.)

---

## Decisions
- One personal GitHub repo with core plus profiles. Reason: improvements flow both ways. (you)
- GitHub holds no company content; my employer knowledge lives in work Glue. Reason: IP and data stay in the company. (you)
- "Glue" is the role name; work Glue is a markdown folder. Reason: speed and fewer calls. (you)
- Use both Claude Code and the desktop app at work. (you)
- Capture: automatic for corrections, on request for notes, weekly `learn` review. (you)
- Core skills, profile contract, install, failure handling, testing and slicing as listed in sections 3 to 8. (agent recommendation, confirmed by you)

## Your actions
- [ ] Approve this design (blocks write-spec)
- [ ] Check the contract's IP clause (blocks pushing anything work-related)
- [ ] Create the empty `harness` repo on GitHub (blocks slice 1)
