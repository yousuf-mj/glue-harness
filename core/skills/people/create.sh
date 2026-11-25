#!/usr/bin/env bash
# Create a people profile from the template. Usage: create.sh <glue> "<Full Name>"
# Spec 001: AC-01.2 (slug file, never overwrite), AC-01.3 (copy _template.md)
set -eu
here="$(cd "$(dirname "$0")" && pwd)"
G="$1"; name="$2"
dir="$G/resources/people"
mkdir -p "$dir"
[ -f "$dir/_template.md" ] || cp "$here/template.md" "$dir/_template.md"
slug="$(printf '%s' "$name" | tr '[:upper:]' '[:lower:]' | sed -E 's/[[:space:]]+/-/g')"
f="$dir/$slug.md"
if [ -e "$f" ]; then echo "exists: $f"; exit 1; fi
first="$(printf '%s' "$name" | awk '{print tolower($1)}')"
sed -e "s/<Name>/$name/" -e "s/<first name>/$first/" "$here/template.md" > "$f"
echo "created: $f"
