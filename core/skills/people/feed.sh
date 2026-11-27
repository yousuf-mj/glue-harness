#!/usr/bin/env bash
# people-scripts-version: 0.1.8
# Feed a journal meet line into matching people profiles.
# Usage: feed.sh <glue> <YYYY-MM-DD> "<text>"     (text "-" = read it from stdin)
#        feed.sh --check <glue> "<text>"          (report only, writes nothing; AC-01.7)
# Spec 001: AC-01.4 (append to every match, else "unmatched"), AC-01.5 ("ambiguous: <slugs>")
IFS= read -r -d '' py <<'PY' || true
import glob, os, re, sys
a = sys.argv[1:]
check = bool(a) and a[0] == "--check"
if check: a = a[1:]
if len(a) != (2 if check else 3):
    print("usage: feed.sh <glue> <date> <text|-> | feed.sh --check <glue> <text|->"); sys.exit(2)
glue, text = a[0], a[-1]
date = None if check else a[1]
if text == "-":
    text = sys.stdin.read().rstrip("\n")
files = sorted(f for f in glob.glob(os.path.join(glue, "resources", "people", "*.md"))
               if not os.path.basename(f).startswith("_"))
clean = lambda t: t.strip().strip("\"'").strip()
spans = []    # (start, end, file)
for f in files:
    head = open(f, encoding="utf-8").read().split("\n---", 1)[0]
    name = re.search(r"^name:[ \t]*(.+)$", head, re.M)
    al = re.search(r"^aliases:[ \t]*\[?([^\]\n]*)\]?", head, re.M)
    terms = ([clean(name.group(1))] if name else []) + \
            ([clean(x) for x in al.group(1).split(",")] if al else [])
    for t in set(filter(None, terms)):
        for m in re.finditer(r"(?<!\w)" + re.escape(t) + r"(?!\w)", text, re.I):
            spans.append((m.start(), m.end(), f))
# A match inside a longer match ("Sam" inside "Sam Smith") gives way to the longer one.
spans = [s for s in spans
         if not any(o[0] <= s[0] and s[1] <= o[1] and (o[1] - o[0]) > (s[1] - s[0]) for o in spans)]
owners = {}
for s in spans:
    owners.setdefault((s[0], s[1]), set()).add(s[2])
slug = lambda f: os.path.basename(f)[:-3]
clash = sorted({slug(f) for fs in owners.values() if len(fs) > 1 for f in fs})
hits = sorted({s[2] for s in spans})
if clash:
    print("ambiguous: " + " ".join(clash)); sys.exit(0)
if not hits:
    print("unmatched"); sys.exit(0)
if check:
    print("matched: " + " ".join(slug(f) for f in hits)); sys.exit(0)
for f in hits:
    body = open(f, encoding="utf-8").read()
    with open(f, "a", encoding="utf-8") as out:
        out.write(("" if body.endswith("\n") else "\n") + f"- {date} · {text}\n")
PY
exec python3 -c "$py" "$@"
