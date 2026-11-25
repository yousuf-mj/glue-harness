#!/usr/bin/env bash
# Tests for spec 001 (people profiles). Run: bash core/skills/people/test_feed.sh
set -u
here="$(cd "$(dirname "$0")" && pwd)"
fails=0
ok()   { echo "ok   - $1"; }
bad()  { echo "FAIL - $1"; fails=$((fails+1)); }
check(){ if [ "$2" = "$3" ]; then ok "$1"; else bad "$1 (want [$3] got [$2])"; fi; }

new_glue() { g="$(mktemp -d)"; echo "$g"; }

# T3 -> AC-01.2, AC-01.3: create makes the slug file from the template, copies _template.md, never overwrites
g="$(new_glue)"
out="$(bash "$here/create.sh" "$g" "Ryan Smith")"
f="$g/resources/people/ryan-smith.md"
check "T3 create makes slug file" "$([ -f "$f" ] && echo yes)" "yes"
check "T3 name filled" "$(sed -n 's/^name: //p' "$f")" "Ryan Smith"
check "T3 first name is an alias" "$(sed -n 's/^aliases: //p' "$f")" "[ryan]"
check "T3 empty sections show -" "$(grep -c '^-$' "$f")" "8"
check "T3 _template.md copied" "$([ -f "$g/resources/people/_template.md" ] && echo yes)" "yes"
echo "edited" >> "$f"
out="$(bash "$here/create.sh" "$g" "Ryan Smith")"; rc=$?
check "T3 refuses to overwrite (exit 1)" "$rc" "1"
check "T3 file unchanged" "$(tail -1 "$f")" "edited"

# T1 -> AC-01.4: name or alias match appends a dated line; no match prints unmatched
g="$(new_glue)"
bash "$here/create.sh" "$g" "Ryan Smith" >/dev/null
bash "$here/create.sh" "$g" "Paul Jones" >/dev/null
out="$(bash "$here/feed.sh" "$g" 2026-11-25 "Spoke to RYAN and Paul about hiring")"
check "T1 alias match appends (case-insensitive)" "$(tail -1 "$g/resources/people/ryan-smith.md")" "- 2026-11-25 · Spoke to RYAN and Paul about hiring"
check "T1 every matching profile gets the line" "$(tail -1 "$g/resources/people/paul-jones.md")" "- 2026-11-25 · Spoke to RYAN and Paul about hiring"
out="$(bash "$here/feed.sh" "$g" 2026-11-25 "Coffee with Paul Jones")"
check "T1 full name match appends once" "$(grep -c 'Coffee with Paul Jones' "$g/resources/people/paul-jones.md")" "1"
before="$(cat "$g/resources/people/ryan-smith.md")"
out="$(bash "$here/feed.sh" "$g" 2026-11-25 "Spoke to Ryanair support")"
check "T1 whole word only: prints unmatched" "$out" "unmatched"
check "T1 no match leaves file unchanged" "$(cat "$g/resources/people/ryan-smith.md")" "$before"
out="$(bash "$here/feed.sh" "$(new_glue)" 2026-11-25 "Spoke to Ryan")"
check "T1 no people folder prints unmatched" "$out" "unmatched"

# T2 -> AC-01.5: two profiles share alias -> ambiguous, both unchanged
g="$(new_glue)"
bash "$here/create.sh" "$g" "Ryan Smith" >/dev/null
bash "$here/create.sh" "$g" "Ryan Jones" >/dev/null
a="$(cat "$g/resources/people/ryan-smith.md")"; b="$(cat "$g/resources/people/ryan-jones.md")"
out="$(bash "$here/feed.sh" "$g" 2026-11-25 "Spoke to Ryan")"
check "T2 prints ambiguous with slugs" "$out" "ambiguous: ryan-jones ryan-smith"
check "T2 first unchanged" "$(cat "$g/resources/people/ryan-smith.md")" "$a"
check "T2 second unchanged" "$(cat "$g/resources/people/ryan-jones.md")" "$b"

echo; [ "$fails" = 0 ] && echo "all passed" || { echo "$fails failed"; exit 1; }
