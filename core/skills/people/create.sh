#!/usr/bin/env bash
# people-scripts-version: 0.1.8
# Create a people profile from the template. Usage: create.sh <glue> "<Full Name>"
# Spec 001: AC-01.2 (slug file, never overwrite), AC-01.3 (copy _template.md)
# Exit: 0 created, 1 exists, 2 bad name.
here="$(cd "$(dirname "$0")" && pwd)"
IFS= read -r -d '' py <<'PY' || true
import os, re, shutil, sys
tpl, glue, name = sys.argv[1], sys.argv[2], " ".join(sys.argv[3].split())
d = os.path.join(glue, "resources", "people")
slug = re.sub(r"\s+", "-", name.lower())
if not slug or "/" in slug or "\\" in slug or slug.startswith((".", "_")):
    print("bad name: " + name); sys.exit(2)
os.makedirs(d, exist_ok=True)
if not os.path.exists(os.path.join(d, "_template.md")):
    shutil.copy(tpl, os.path.join(d, "_template.md"))
f = os.path.join(d, slug + ".md")
body = open(tpl, encoding="utf-8").read() \
    .replace("<Name>", name, 1).replace("<first name>", name.split()[0].lower(), 1)
try:
    with open(f, "x", encoding="utf-8") as out:
        out.write(body)
except FileExistsError:
    print("exists: " + f); sys.exit(1)
print("created: " + f)
PY
exec python3 -c "$py" "$here/template.md" "$@"
