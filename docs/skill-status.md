# Skill status

Every skill is in `core/skills/` and loads as-is. Port each one in turn: add a step 0 "load the `me` skill and the active `profile-<name>` skill", remove personal parts, use the vocabulary project / epic / ticket, record to Glue as the profile says.

| Skill | Wave | Status | Notes |
|---|---|---|---|
| shape | 1 | copied | |
| elephant-plan | 1 | copied | |
| goldfish-review | 1 | copied | |
| sign-off | 1 | copied | Split: reading rules now in the `me` skill; Christine/Playground parts move to personal profile |
| owl | 1 | copied | Glue checks need the files adapter |
| me | 1 | done | Replaces core/me.md so the Claude app gets it too |
| profile-work | 1 | done | In profiles/work; Claude app equivalent of the hook |
| writing | 1 | done | New: doc types, Microsoft-based style rules, layout, wording table, reader check, humanizer pass, references |
| journal | 1 | done | New: fast append-only daily log in Glue `journal/`, evening wrap with open loops to inbox |
| people | 1 | done | New: private profiles in Glue `resources/people/`, fed by journal meet lines (spec 001) |
| learn | 1 | to write | New: Friday review, promotions, scrub check, estimates |
| add-to-quest | 2 | copied | Rename to add-to-glue; drop quest/saga |
| quick-spec | 2 | copied | |
| quick-design | 2 | copied | |
| brain-dump | 2 | copied | Remove whimsical tone |
| retro | 2 | copied | Overlaps with learn: decide what stays |
| discover | 3 | copied | |
| ux-design | 3 | copied | |
| ui-design | 3 | copied | |
| devex-design | 3 | copied | |
| write-spec | 3 | copied | |
| build-from-spec | 3 | copied | |
| roadmap | 3 | copied | Notion today; needs a Jira-shaped adapter |
| orchestrate-build | 3 | copied | |
| design-sync | 3 | copied | |

Status: copied → ported → tested.
Not in this repo: humanizer (install the humanizer plugin separately).
