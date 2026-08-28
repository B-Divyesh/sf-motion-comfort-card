# Comfort Card visual thesis

## Direction: the calm risograph field note

Comfort Card should feel like a useful card pulled from a player's desk drawer: tactile, marked up, and ready before a session—not like a clinical tracker or a glossy gaming dashboard. The visual language is a two-ink risograph collage with offset registration, clipped paper forms, chunky rule lines, and stamped numbers. Decoration always explains the workflow: a steady horizon and a hand reaching for a pause control make the promise of agency concrete.

This is intentionally a single light, paper-toned mode. The explicit warm ground prevents the hard black/white glare of a dark-mode switch and keeps the risograph metaphor coherent. It remains legible in dim environments through strong contrast and a user-adjustable device brightness.

## Palette

| Token | Value | Role |
| --- | --- | --- |
| Paper | `#F4EBD8` | page background; warm, low-glare stock |
| Paper raised | `#FFF9ED` | fields and elevated sheets |
| Ink | `#172A2A` | primary text and rule work |
| Muted ink | `#4E5D58` | secondary copy (7.0:1 on Paper) |
| Cobalt | `#1956A3` | links, selected settings, focus fields |
| Cobalt deep | `#103B70` | interactive hover and text |
| Coral | `#C8452D` | stop guidance, symptom marks, urgency |
| Coral deep | `#8F2D1D` | accessible danger text |
| Marigold | `#E7A923` | timer/status stamp (with dark text) |
| Moss | `#2D684F` | saved/complete status (5.7:1 on Paper) |

Color is never the sole signal: states pair color with plain labels, icons, or patterns. Focus uses a 3px cobalt outer ring with a paper gap. Form errors use coral ink plus text.

## Typography

- Display and card titles: `Cooper`-like soft slab character expressed through a self-hosted, original SVG letter treatment in the hero and a robust `Georgia, ui-serif, serif` stack in the interface. No external font request.
- UI and body: `Avenir Next, Trebuchet MS, ui-sans-serif, system-ui, sans-serif`. It is frank and exceptionally readable at small sizes.
- Scale: 16px body with 1.55 line height; 18px label; 22px section title; fluid 34–56px h1. Timer digits and session data use tabular figures.
- Reading measure is capped around 68 characters. Uppercase is reserved for small stamped eyebrows, always with generous tracking.

## Spacing and layout

The base rhythm is 4px: `4, 8, 12, 16, 24, 32, 48, 64`. Content sits in a 1120px field. On wide screens, setup and context can form an asymmetric 7/5 collage; the active session deliberately narrows to reduce scanning. At 390px everything becomes one column, secondary explanatory copy compresses, and sticky actions gain safe-area padding. Interactive targets are at least 44px, with 8px separation.

Surfaces are flat paper sheets with 2px ink rules, modest 2–6px offsets, one deliberately clipped corner, and sparing halftone fields. Shadow is never blurred glass; it is a printed second edge. Cards only separate truly independent game records or steps.

## Interaction grammar

- The landing page has one dominant verb: “Make a comfort card.” Existing cards appear below as separate paper slips.
- Card creation is a short three-step composition: game, known triggers, then an ordered plan. Sensible settings begin selected, but can be reordered and rewritten.
- Starting a session opens a focused 15-minute check-in view. The user can check in early, pause the timer, or immediately stop. Symptoms are a plainly labeled 0–4 scale; keyboard arrow behavior follows native radios.
- Each check-in ends with a clear choice: continue another 15 minutes, adjust a setting, or end the session. Nothing celebrates endurance or implies a medical result.
- Save/import/export actions respond in an `aria-live` ink-stamp toast. Destructive deletion requires naming the game in a confirmation dialog.

## Motion policy

Motion is quiet and functional: paper sheets enter 8px from their origin over 180ms; a saved stamp fades/scales once; timers change without pulsing. Nothing loops. With `prefers-reduced-motion: reduce`, all transforms, scrolling, and animated transitions become instant while state and depth remain visible through outline, offset, and contrast. The timer does not depend on animation timing.

## Asset plan and provenance

### Generated hero illustration

Art direction prompt sheet:

> Minimal editorial risograph still life, a single generic game controller resting on a desk beside one oversized round pause button, a perfectly straight calm horizon visible through a rectangular torn-paper window above them, no people or hands, layered torn paper shapes and two-color halftone ink, imperfect print registration, warm oat paper, deep teal ink, cobalt blue and vermilion red accents, one marigold circle, reassuring practical mood, flat overhead composition, screen-print texture, generous quiet negative space, no text, letters, numbers, logos, brands, copyrighted characters, medical imagery, photorealism, gradients, or watermark.

The accepted source PNG and prompt sidecar live in `assets/src/`. A first render was rejected during review because it introduced an ambiguous extra hand and is not shipped. Shipping WebP derivatives live in `public/assets/`, with an authored responsive `<picture>`. The image is generated for this product through the factory Azure OpenAI image deployment (`factory-image`) on 2026-08-28. It is original project artwork; generated imagery is disclosed in the footer.

The 1200×630 social preview in `public/assets/social-card.png` is a direct crop of that accepted source image. It adds no generated or third-party material.

### Authored assets

The CC monogram app icons and small interface pictograms are hand-authored SVG/CSS using the palette above. They contain no third-party marks. The paper noise is a tiny inline SVG filter/data texture, not a remote asset.

## Why it fits

Players arrive uncertain and often frustrated by settings hidden behind inconsistent terminology. A field note is forgiving: it invites experimentation and records what happened without grading the person. Risograph misregistration subtly acknowledges that visual systems do not line up perfectly for every player, while the strong horizontal rules and stop stamp restore a sense of control.
