---
name: "quick-design"
description: "Spend a few minutes on rough PNG designs instead of a full design stage. Use for small UI decisions, or as pre-work to pick a direction before ui-design."
---

# Quick Design

Rough PNGs that help the user decide quickly. Seeing something and reacting to it is the point, so nothing here needs to be polished or final.

Aim for a few minutes per round. Don't build an editable artifact, because artifacts take much longer. Build one only after a concept has been chosen, and only if the user wants to refine it there.

## 1. Pick the mode
- **Small piece:** a UI decision inside an existing product. Goes on to `quick-spec`.
- **Pre-work:** finding a direction before a large design. Goes on to `ui-design`.

Say which mode you chose in one line.

## 2. Get just enough context
- Read the repo for existing tokens, components and screens.
- Read any project preferences about design, and follow them.
- **Ask before designing.** If the prompt is short or leaves content open, ask one round of clarifying questions before making any PNGs, using the multiple-choice question tool when available (up to 4 questions, recommended option first, free answer always allowed). Read the repo, docs and memory first, so you don't ask what you can see. Cover what would otherwise be guessed:
  - the exact words: headline, key lines, call to action
  - which details to include (and leave out)
  - size, medium and where it will be seen
  - design ideas or references the user already has in mind
- Don't invent copy, facts or details. Anything you still had to assume goes in a short list under the PNGs for the user to confirm.

Skip research, briefs, principles, palettes and contrast tables. In pre-work mode, the user can name themes they like or dislike, but don't wait for them to.

## 3. Make the PNGs
Build each concept as quick throwaway HTML, then screenshot it to PNG. Use realistic content, not lorem ipsum. Cover phone and desktop in the same image when both are in scope.

**Small piece**
- Use the existing design system.
- Make 1 to 3 options, only as many as there are real choices.
- The user picks one, and that is usually one round.

**Pre-work**
1. Make 5 rough concepts in clearly different generic themes.
2. The user says what they like and don't like about each.
3. Narrow to 3 rough concepts using that feedback.
4. The user picks one or names what to mix.

Label each image so the user can refer to it by name. Show the PNGs in the conversation and ask for reactions in plain words. Save them in `docs/designs/<slug>-quick/`.

## 4. Record and hand off
Save `chosen.png` and a `notes.md` of up to 10 lines: what was chosen, why, and what the user disliked.

- **Small piece:** hand off to `quick-spec`, which links `chosen.png`. If this is a new kind of flow rather than a visual choice, say so, because it belongs in `ux-design`.
- **Pre-work:** hand off to `ui-design`, which takes the chosen concept as its direction.

No goldfish review runs here. The user's reaction is the review.

## Tell Glue (last step, every time)
When this skill finishes, before the final reply, run `add-to-quest` so Glue shows what happened. Don't ask first and don't skip it: a finished skill that Glue hasn't heard about counts as unfinished. If Glue can't be reached, say so in one line and carry on.

- Event: a **Note** on the change's quest with what was chosen and a link to `chosen.png` on main. If there's no quest yet, create one in the repo's realm as `planning` with `readyFor: spec`.