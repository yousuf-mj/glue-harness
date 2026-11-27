---
name: profile-work
description: Work profile for the harness. Says where Glue lives, where docs are published, who signs off and which vocabulary to use. Load before any harness skill runs at work.
---


## Glue
type: files
path: ~/glue/

## Publish
Confluence (by hand)

## Sign-off
me

## Core version
>=0.1.0 <0.2.0

## Extra rules
~/glue/standing-rules.md

## Connectors
suite: Microsoft 365
calendar.search: outlook_calendar_search (query "*", afterDateTime/beforeDateTime, order "oldest")
calendar.create: outlook_create_event
calendar.times: wall-clock in "GMT Standard Time"; show as-is
calendar.day: 09:00–18:00
mail.search: outlook_email_search
mail.draft: outlook_create_draft

## Vocabulary
project (was realm) · epic (was saga) · ticket (was quest)

## Standing rules
Before the first step, read `~/glue/standing-rules.md` and apply every rule. If the folder is not reachable (Claude app without the folder connected), request access to `~/glue` once, before the first step, with the reason "log telemetry, corrections and journal entries". If I decline or the request fails, say so in one line, carry on without recording, and don't ask again in that chat.
