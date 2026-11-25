#!/usr/bin/env bash
# people-scripts-version: 0.1.7
# Feed a journal meet line into matching people profiles.
# Usage: feed.sh <glue> <YYYY-MM-DD> "<text>"
#        feed.sh --check <glue> "<text>"   (report only, writes nothing; AC-01.7)
# Spec 001: AC-01.4 (append to every match, else "unmatched"), AC-01.5 ("ambiguous: <slugs>")
exec python3 - "$@" <<'PY'
import glob, os, re, sys
check = sys.argv[1] == "--check"
if check:
    glue, date, text = sys.argv[2], None, sys.argv[3]
else:
    glue, date, text = sys.argv[1], sys.argv[2], sys.argv[3]
files = sorted(f for f in glob.glob(os.path.join(glue, "resources", "people", "*.md"))
               if not os.path.basename(f).startswith("_"))
owners = {}   # matched term -> set of files
hits = []
for f in files:
    head = open(f, encoding="utf-8").read().split("\n---", 1)[0]
    name = re.search(r"^name:\s*(.+)$", head, re.M)
    al = re.search(r"^aliases:\s*\[?([^\]\n]*)\]?", head, re.M)
    terms = ([name.group(1).strip()] if name else []) + \
            ([a.strip().strip('"\'') for a in al.group(1).split(",")] if al else [])
    matched = False
    for t in filter(None, terms):
        if re.search(r"(?<!\w)" + re.escape(t) + r"(?!\w)", text, re.I):
            owners.setdefault(t.lower(), set()).add(f)
            matched = True
    if matched:
        hits.append(f)
clash = sorted({os.path.basename(f)[:-3] for fs in owners.values() if len(fs) > 1 for f in fs})
if clash:
    print("ambiguous: " + " ".join(clash)); sys.exit(0)
if not hits:
    print("unmatched"); sys.exit(0)
if check:
    print("matched: " + " ".join(os.path.basename(f)[:-3] for f in hits)); sys.exit(0)
for f in hits:
    body = open(f, encoding="utf-8").read()
    with open(f, "a", encoding="utf-8") as out:
        out.write(("" if body.endswith("\n") else "\n") + f"- {date} · {text}\n")
PY
