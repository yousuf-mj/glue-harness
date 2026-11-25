---
name: "goldfish-review"
description: "Review with fresh-context subagents that never saw the conversation: a design stage, the whole design (UX/UI/DevEx together), a design doc or spec, a code diff, or a bug. Then triage with the user."
---

# Goldfish Review

A Goldfish is a reviewer with no memory of this conversation. It sees only the artifacts, so it doesn't share your blind spots. This is the one review primitive for the whole pipeline; don't stack other review skills on top of it.

Where it runs in the pipeline:
- After each design stage (ux-design, ui-design, devex-design): **stage** mode, light and fast
- At the end of the design phase: **design** mode, across all design artifacts
- On the design doc and on specs: **doc** mode
- On every diff: **code** mode, unless the repo names its own code review
- On stubborn bugs: **bug** mode

Pick the mode from the input. A single `docs/designs/<slug>-ux|ui|devex/` folder means stage. Several of those folders, or the user saying "design review", means design.

## Keeping the Goldfish fresh
- Spawn each reviewer as a subagent. Pass ONLY file paths (and screenshots where listed) plus the reviewer prompt.
- Never pass conversation history, your reasoning, or your opinion of the artifact.
- Tell every reviewer: "Do not read CLAUDE.md, AGENTS.md, or any memory or notes files. Work only from the files you are given and the files they link to."
- Run reviewers in parallel.
- Second model: if another model's CLI is available (e.g. Codex or Gemini), run one reviewer per round on it as well. A different model has different blind spots. Skip silently if none is available.

## Reference packs
If the repo has `docs/review-packs/`, reviewers judge against it instead of their own sense of expertise:
- Give each reviewer the artefact paths plus `docs/review-packs/README.md`, `docs/review-packs/references.md`, and its lens folder: usability (ux stage, usability lens), comprehension (comprehension lens), accessibility (accessibility lens, ui stage), adoption (adoption lens). Tell it to follow that folder's `LENS.md`.
- Every finding uses the format in `README.md`: `where` (a verbatim quote or locator) and `rule` (a check ID from the lens's `checklist.md`, or `decision:<slug>#rule`) are required, plus basis R1 to R4, confidence and fix. R4 (opinion) is always minor and never blocks. Each lens ends with "Declined to judge".
- **Verify before triage.** Spawn one fresh verifier per lens with `docs/review-packs/verifier.md`, the artefact, the lens folder and the findings. Triage only what it marks keep or downgrade.
- Without packs, run the lenses as written below.

Every reviewer returns a ranked list of only the findings that would change what gets built or how it lands with people, most severe first. There is no target count, and a short list is a good result. At most 3 nits. Each finding has: severity (blocker / major / nit), exact location, what is wrong, what goes wrong for a real person if it stays, and a suggested fix. A finding without a location or a consequence is dropped.

## Mode: stage (one design stage)
One reviewer, matched to the stage:
- **ux**: "Walk each task flow as a first-time user using only these flows, wireframes and copy. Where would you get stuck, confused, or unable to recover from an error?"
- **ui**: given the brief, research, design system and laptop and phone screenshots. Use the Design quality prompt below.
- **devex**: "As a developer new to this, complete each task in usage.md from these docs and contracts alone. Where would you get stuck?"

## Mode: design (end of the design phase)
Give every reviewer all design folders for the feature, plus laptop and phone screenshots. Spawn the lenses that apply:
- **Design quality**: "You are a demanding product designer. Would you be proud to ship this? Where does it look like basic forms or lists? Does colour have a job? Does every type size have a reason, or do sizes differ for no purpose? Do navigation and actions look like controls? Does it work well on both laptop and phone, or is one an afterthought? If directions are included, are they really different, and is one unexpected? Compare with the references in research.md and name what they do better. Ignore differences of a few pixels and anything a designer would settle by judgement."
- **Usability**: walk every task flow end to end as a first-time user of each segment, including error and recovery paths.
- **Accessibility**: WCAG 2.2 AA failures that would stop someone using the product: contrast, keyboard path, screen-reader order, touch targets, colour-only meaning.
- **DevEx** (if a devex folder exists): complete each usage task from the docs and contracts alone.
- **Adoption** (when the work is new or changes someone's routine; needs `docs/review-packs/adoption/`): will the people it is for start using it, keep using it and be better off, and who carries the effort? Any ETH finding goes to a person at sign-off.

Consistency is a checklist for you, not a reviewer: every screen and state has a design, and every action that changes data has an API. Fix gaps without raising them as findings.

## Mode: doc (design doc or spec)
- **Comprehension**: "Read this and the files it references. In your own words, what is it trying to accomplish, and how? List anything ambiguous." A restatement that differs from the intent marks unclear text.
- **Critic**: "As an expert technical reviewer, list everything this missed: faulty assumptions, unhandled edge cases and failure modes, and any simpler design that would do the job."
- **Readiness**: "You must implement this in one pass from these files alone. What information is missing that would stop you?" For specs, also: "Is every acceptance criterion binary and testable?" and an **assumption hunt**: "List every sentence that guesses, defers to the owner ('assumed', 'to confirm', 'probably'), or leaves a UI default unstated, and every other ready or in-flight spec or existing test this one could collide with. Each is a blocker until answered."

With packs: when the doc is user help (an article, guide or troubleshooting page), the Comprehension reviewer uses the comprehension pack. On a shape pitch or design doc for new work, also run the Adoption reviewer.

## Mode: code (a diff)
Default base: the branch's merge-base with main. Code reviewers may explore the repo and run tests, type checks and lint, but must not edit files.
- **Standards**: repo conventions, names from `GLOSSARY.md`, error handling, tests through public interfaces, code smells.
- **Spec**: given the diff and the spec file. Does it meet every acceptance criterion, with a test for each? Flag anything missing, and anything built that the spec didn't ask for.
- **Security** (when the diff touches auth, input handling, secrets, permissions, payments or personal data): injection, authz gaps, secret handling, unsafe defaults, data exposure.

## Mode: bug
1. Before spawning, write your own root-cause hypothesis to a scratch note. Don't share it.
2. Spawn one reviewer with only the symptom, the repro steps and the relevant code paths: "Diagnose the root cause. Say what evidence would confirm it."
3. Compare. Agreement raises confidence; proceed. Disagreement: show the user both and gather the evidence that separates them before fixing.

## Triage (you, the Elephant)
With packs, triage only findings the verifier kept or downgraded. Merge duplicates across reviewers. For each finding decide:
- **FIX**: valid, and you can say what goes wrong if it stays; propose the concrete change
- **CONTEST**: wrong, out of scope, or a matter of taste with no real consequence; give the reason
- **ASK**: needs the user's call (e.g. reviewers disagree, or it changes what the product does)

Expect only a minority of findings to be valuable. If nearly everything comes back FIX, your triage is too soft: look again. Decide small details yourself instead of asking. Present only the blockers, the majors and the ASK items to the user. Apply only what they approve.

## Loop
- stage, doc and design: after fixes, re-run only the reviewers that raised blockers. Stop when there are no blockers, or after 2 rounds.
- code: after fixes, re-run the reviewer that raised the blockers.

## Log
Append a short record to `docs/reviews/<YYYY-MM-DD>-<slug>.md`: mode, reviewers run, counts of FIX / CONTEST / ASK per reviewer, and the finding most worth having. For code reviews, one line per PR in `docs/reviews/code-review-log.md` is enough. Over time this shows which lenses earn their keep.

With packs, also record each finding's rule ID and outcome: accepted, false positive, out of appetite, or missed (a problem a person found that no lens caught). `retro` uses these to update the packs: two rejections of the same kind become a narrowly worded `false-positives.md` entry, clean accepted findings replace weaker examples, and misses become new checks and test cases. A pack change applies only if the test designs in `docs/review-packs/evals/` still pass.

Reviewers read and reason; they don't prove the product works. Tests, a real run and real users still have to do that.