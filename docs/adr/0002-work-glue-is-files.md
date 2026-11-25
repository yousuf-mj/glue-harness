# 0002: Work Glue is a folder of markdown files

**Context.** Personal Glue is an artifact with a database. Logging one stage there took 4 tool calls (lookup, catch-up check, refused write, retry). At work the priority is speed and low token use, and my employer keeps its documents in Confluence with only a Notion trial.

**Decision.** Work Glue is `~/glue/`, plain markdown in a PARA layout. Claude Code edits it directly, and the Claude desktop app reaches it as a connected folder.

**Consequences.** It's fast, searchable and free, and survives without the harness. It can't be read on a phone. A read-only artifact view is a possible later addition.
