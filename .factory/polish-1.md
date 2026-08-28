# Perfection-loop polish 1 — Comfort Card

This record closes every finding in `.factory/review-1.md`. The review is the
only `review-*` record in this repository; there were no earlier `polish-*`
records to carry forward.

| Finding | Change made | Evidence |
| --- | --- | --- |
| B1 | Replaced the metaphor-led hero with “Plan game settings before motion sickness starts.” The supporting sentence names players affected by game motion, explains the private plan and 15-minute check-in, and shows Free, local-storage, and offline facts beside the sample action. | `tests/product.spec.ts` first-screen and mobile checks; `.factory/copy-audit.md`; local and live mobile screenshots in `.factory/evidence/`. |
| B2 | Added the first-screen “Try it with sample data” link to `?demo=1`, a completed Harbor Signal card, persistent demo banner, Reset demo, Start for real, and an in-memory-only demo source that never opens the real IndexedDB database. Added `.factory/demo.md`. | `@claim:demo-isolation`, `@claim:core-card-workflow`, `@claim:local-private`, and `@claim:offline-reload`; demo screenshots and live `/demo` check. |
| B3 | Added nine explicit reliance claims in `.factory/claims.json`; every ID has one tagged Playwright assertion against the isolated demo. | Each exact command in `.factory/claims.json` passed from the clean-clone checkout; `tests/claims.spec.ts`. |
| B4 | Made `/demo` and `?demo=1` real direct demo entries with the Demo title, canonical route, sample card, and offline coverage. Added `/demo` to the sitemap. | `loads both demo entry points with sample data and route metadata`; `@claim:offline-reload`; live `/demo` check. |
| M1 | Rewrote ambiguous headings, empty state, guide, stop language, and footer using the review’s plain player wording. | `.factory/copy-audit.md`; `tests/product.spec.ts` home/mobile assertions. |
| M2 | Rewrote player-facing README prose into short sentences and used “saved in this browser,” “installable app,” and “backup file” language. | `.factory/copy-audit.md`; README review. |
| M3 | Added route-specific titles, descriptions, canonicals, Open Graph/Twitter metadata, Apple touch icon, social art, sitemap routes, headers, and a styled HTTP 404. | `ships complete social metadata and working legal links`; `renders a designed not-found page instead of the home page`; live `/definitely-missing` check. |
| M4 | Route changes now focus and announce the new h1. This pass also routes the Demo, Privacy, Terms, sample, and legal back links through the same focus-preserving transition; entering/leaving demo changes the card source before rendering. | `uses real routes, route titles, focus, Back, and scroll restoration`; `moves focus and keeps real cards hidden when navigation enters or leaves the demo`. |
| N1 | Header includes Demo, Make a card, and Privacy; footer includes Privacy, Terms, Param Factory credit, and build `polish-1`. | `tests/accessibility.spec.ts`; local/live screenshots. |
| N2 | Renamed vague controls to “Read the 3-step guide” and “Make a card.” | `.factory/copy-audit.md`; first-screen screenshot. |

## Evidence locations

- Local desktop and 390 px captures: `.factory/evidence/local/`
- Live cold-load desktop and 390 px captures: `.factory/evidence/live/`
- URL verifier JSON and downloaded HTML sit alongside those captures.

The exact final commands, commit, deployment result, claim runs, and live
re-check are recorded in `.factory/handoff.md` after deployment.
