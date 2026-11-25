---
name: "ui-design"
description: "Design a product's visual UI that looks good on laptop and phone: rough concepts, reference research, clearly different directions, then a colour, type and component system and screen visuals. Builds on ux-design when it exists."
---

# UI Design

One skill for the visual design stage: research, explore, decide, systematise, check. UX (flows, structure, states, copy) comes from `ux-design`; this skill decides how it looks. The output is precise enough that `write-spec` can turn every screen and state into acceptance criteria.

The goal is a product people think looks good. A correct screen that reads as plain forms and lists has not met the bar.

Pipeline: discover -> ux-design -> **ui-design** -> goldfish-review (design) -> elephant-plan -> write-spec -> roadmap -> build-from-spec -> retro.

Skip it for a change that reuses existing screens and the existing design system with no new visual decisions; say so. For a new feature in an existing product, reuse the design system and only add new components and states.

All output goes in `docs/designs/<slug>-ui/`.

## The bar for every screen
- **Laptop and phone are both first-class.** Design them together, with as much crossover as possible. Controls, spacing and layout must suit each device. Don't shrink a laptop screen onto a phone or stretch a phone screen across a laptop.
- **It looks designed.** For every plain list or form, ask what would make it read as this product: colour, grouping, scale, shape or imagery.
- **Colour is deliberate.** Say what colour does on each screen. Use the amount the brief asks for, and don't default to mostly neutral.
- **Every type size has a job.** Use as few sizes as you can. Name what each one is for, and use the same size for the same job. If you can't say why two sizes differ, make them the same.
- **Actions look like actions.** Navigation and buttons must look like controls you can press, not bare text. A new link in a menu or side panel gets the same treatment as its neighbours.
- **Small details are judgement calls.** Decide differences of a few pixels yourself, and don't take them to the user or a reviewer.

## 0. Start from what exists
- If `docs/designs/<slug>-ux/` exists, read it fully. Take users, flows, screens, states and copy from it. Don't re-ask what it answers and don't redesign flows; if a flow looks wrong, raise it with the user and update the UX docs first.
- If it doesn't exist and the change involves new flows, recommend running `ux-design` first. If the user declines, cover the basics in Round 1 below.
- Read the repo for an existing design system, tokens, component library and brand files, plus any project preferences about design.
- If no direction has been chosen yet, start with `quick-design` in pre-work mode: 5 rough PNGs, then 3. Use what the user liked and disliked as input to the intake and research.

## 1. Intake
Ask in rounds, using the multiple-choice question tool when available (up to 4 questions per round, always allowing a free answer, recommended option first). Skip anything already answered.

**Round 1: what and who** (only if no UX docs)
- What are we designing, for whom, and the one job the key screen must do

**Round 2: taste**
- Products the user thinks look great, from any industry, and ones they dislike
- Competitors to study, by name
- Where to search: their own files or screenshots; Mobbin (default when connected); competitor sites and app-store screenshots; other galleries like Page Flows, Refero, Land-book, Awwwards, Dribbble, Behance; or "you pick" (which means Mobbin first)

**Round 3: brand and feel**
- Existing brand assets: logo, colours, fonts, design system (or none)
- Three personality adjectives
- How much colour, and what it should do
- Light, dark, or both
- Density: airy, balanced, or compact
- Typography feel, imagery, icon style and amount of motion

**Round 4: constraints**
- Accessibility target (default WCAG 2.2 AA)
- Tech: component library and styling, and anything that must be kept
- Screens in scope

Save to `brief.md`. Read it back in five lines and get a yes.

## 2. Research what looks good
Study at least 5 real products that show the same kind of screen as ours, such as a schedule, an admin list or a settings page. Include products from other industries.
- Search where the user said to. If a source needs a login, ask first; don't sign in on your own.
- **Mobbin first when it's connected:** use `search_screens` for the key screen types (e.g. "class schedule", "admin list", "settings") and `search_sections` for components and patterns (cards, filters, nav bars, empty states). Search for named competitors and for products in other industries. If ux-design already made a Mobbin collection for this project, start from it with `get_collection_contents`. If Mobbin isn't connected or has nothing relevant, use the other sources above and say which source each reference came from.
- Save the references you use to a Mobbin collection named after the project and stage (e.g. "<project> – UI references"), creating it if it doesn't exist, with a short comment on each item saying what we'll borrow from it.
- For each reference: link, screenshot or description, and specifically why it looks good: how it uses colour, type sizes, grouping, density, buttons and navigation. Note how it handles both laptop and phone.
- References are inspiration, not templates: never copy a layout wholesale, and never reuse logos, illustrations, brand names or copy.
- Write `research.md` with cited links and a synthesis: what we'll borrow, what would make ours stand out, and what to avoid.

## 3. Principles
Write 3-5 visual principles specific to this product, each usable to settle a disagreement later. Add them to `brief.md`.

## 4. Explore clearly different directions
Create 3 directions that a person would call different at a glance. They must differ in at least three of: layout structure, role of colour, typography, density, shape language. A new palette on the same layout is not a new direction. One direction must be an unexpected option the user wouldn't have asked for.

For each:
- A name and a one-line mood
- Palette, type pairing, density and shape language (radius, borders, elevation)
- What this direction gives up, and what makes it better than the others
- A rough PNG of the key screen with realistic content, showing laptop and phone together

Before presenting, put the three side by side and ask: would someone notice the difference from across a room? If not, redo the closest two. Say which idea in each is new.

The user picks one or names what to mix. Record the decision and why. Build a self-contained HTML prototype in `directions/` only for the chosen direction.

## 5. Palette
- Start from one brand hue (or the existing brand colour). Generate a 50-950 scale in OKLCH so steps are perceptually even.
- Neutrals: a grey scale tinted slightly towards the brand hue.
- Semantic colours: success, warning, danger, info, each with a scale and clearly distinct from the brand colour.
- Semantic tokens on top: background, surface, surface-raised, border, text, text-muted, primary, primary-hover, on-primary, focus-ring, and so on. Components use semantic tokens only.
- Set how much of each screen is colour from the brief, not from a fixed ratio.
- Dark mode, if in scope, is its own token set (not inverted), slightly desaturated, with elevation shown by lighter surfaces.
- Verify contrast with code, not by eye, for text and control pairs in both modes. Body text at least 4.5:1; large text, icons and control borders at least 3:1; focus ring at least 3:1. Fix failures and record the table.

## 6. Design system
Write `design-system.md` plus `tokens.json` and CSS variables (or the stack's format):
- Colour tokens, spacing, radius, elevation, motion, breakpoints, icon size and stroke
- A type table: each size, its job, and where it's used on laptop and phone
- Components in scope, each with every state: default, hover, focus-visible, active, disabled, loading, error, empty
- Rules: 44x44px minimum touch targets on phone, sensible pointer sizes on laptop, focus always visible, never colour alone for meaning, truncation and wrapping behaviour

## 7. Screens
Write `screens.md`: for every screen and state from the UX inventory (or your own if there's no UX doc), the visual layout at laptop and phone, components and tokens used. Refine the chosen prototype to cover the key screens and states.

## 8. Check
- Render every key screen and look at screenshots of the actual pixels at laptop and phone widths.
- Check each screen against "The bar for every screen". Fix anything that looks plain before showing it.
- Check the basics: one clear primary action per screen, contrast table passes, every state designed, long content tested, generic AI tells avoided (default purple gradients, everything in centred cards, emoji as icons, identical stat tiles, decorative blobs).
- Show the user the screenshots. Their reaction comes first.
- Run `goldfish-review` on this folder (stage mode), with the screenshots. Triage and apply fixes.

## 9. Hand off
When all design stages are done, run `goldfish-review` in design mode across all design folders. Then `elephant-plan` links `docs/designs/<slug>-ui/` (and `-ux/`), and `write-spec` turns each screen state into Given/When/Then scenarios and acceptance criteria, including contrast and focus requirements.

## Tell Glue (last step, every time)
When this skill finishes, before the final reply, run `add-to-quest` so Glue, the quest journal, shows what happened. Don't ask first and don't skip it: a finished skill that Glue hasn't heard about counts as unfinished. If Glue can't be reached, say so in one line and carry on.

- Event: **Stage finished** for the saga, stage `ui-design`, linking `design-system.md` and the screens, once its review has passed.