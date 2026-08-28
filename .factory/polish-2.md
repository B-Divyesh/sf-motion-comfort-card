# Perfection-loop polish 2 — Comfort Card

This repair closes both findings in `.factory/review-2.md` and re-verifies every finding from `.factory/review-1.md` and `.factory/polish-1.md`. The final live build is commit `8250b7c585b5a44331d06c7b303f900a77f606da`, deployed as `559db583-20a6-402f-8c0e-643de59e68b2`.

## Review 2 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | Standardized the limitation everywhere as: “Comfort Card is not medical advice. It cannot tell you whether a game is safe or comfortable for you.” It appears on the landing page, Terms, README, and clean share text. Added the `medical-scope` registry entry and one tagged test that checks all four surfaces. | Test: `@claim:medical-scope every public surface states the same medical and safety limit` (desktop and mobile). Screenshot: `.factory/evidence/polish-2/live/home/screenshot-mobile.png`. Live: `/`, `/terms/`, and `/demo` clean share passed in `.factory/evidence/polish-2/live/cold-recheck.json`. |
| F-2-2 | Kept the useful README deployment facts and registered them as `pwa-routing`. Its test inspects the built versioned worker, current precache bundle, same-origin fetch guard, production-only registration, route rewrites, and 404 override. It then proves worker control, direct Privacy routing, offline demo reload, and the styled not-found page. | Test: `@claim:pwa-routing production worker controls direct routes offline and missing URLs keep a styled 404` (desktop and mobile). Screenshot: `.factory/evidence/polish-2/live/demo/screenshot-mobile.png`. Live: `/demo` offline control and `/definitely-missing` HTTP 404 passed in `cold-recheck.json`. |

## Cumulative review 1 findings

| Finding | Current change/state | Evidence |
| --- | --- | --- |
| B1 | The first screen retains the approved seven-word job headline, names players affected by game motion, and places the sample action and three facts before the artwork. | Tests: `keeps first-screen content and controls usable at 390px`, `@claim:medical-scope`. Screenshot: `.factory/evidence/polish-2/live/home/screenshot-mobile.png`. Live `/` cold check confirms the exact h1, audience, facts, and no overflow. |
| B2 | `?demo=1` remains a one-click completed Harbor Signal card. Demo state is memory-only with a persistent banner, Reset demo, and Start for real. | Tests: `opens the isolated query-string demo from the first screen in one click`, `@claim:demo-isolation`, `@claim:core-card-workflow`, `@claim:local-private`. Screenshot: `.factory/evidence/polish-2/live/demo/screenshot-mobile.png`. Live direct `/demo` reported an empty database list. |
| B3 | `.factory/claims.json` now has 11 claims. Every ID has exactly one matching tagged test; all 11 exact commands passed independently in desktop and mobile projects from the final clean clone. | Tests: all `@claim:*` tests in `tests/claims.spec.ts`. Screenshot: the live home/demo captures above. Live: the final cold audit exercised demo, privacy, sharing, offline, and routing behavior. |
| B4 | `/demo` and `?demo=1` retain real sample routes, Demo title/canonical, reload behavior, and offline support. | Tests: `loads both demo entry points with sample data and route metadata`, `@claim:offline-reload`, `@claim:pwa-routing`. Screenshot: live demo mobile capture. Live `/demo` returned 200 and reloaded offline under a controlling worker. |
| M1 | Concrete game-motion wording remains in the hero, empty state, guide, and stop guidance; no metaphor-led first task returned. | Test: `keeps first-screen content and controls usable at 390px`. Screenshot: live home mobile capture. Live `/` cold text audit passed. |
| M2 | README sentences remain within 22 words and use player-facing terms. The unified medical limitation is also under the cap. | Test: `@claim:medical-scope` reads the repository README. Screenshot: live home mobile capture for matching player copy. Live `/` uses the same terminology. |
| M3 | Route-specific title, description, canonical, OG/Twitter metadata, touch icon, legal routes, and the designed 404 remain intact. | Tests: `ships complete social metadata and working legal links`, `renders a designed not-found page instead of the home page`, `@claim:pwa-routing`. Screenshot: live home desktop capture. Live `/privacy/` and `/terms/` returned 200; the missing route returned 404 with its own title/h1/canonical. |
| M4 | Route changes still focus and announce the new h1; browser Back restores heading focus and scroll. | Tests: `uses real routes, route titles, focus, Back, and scroll restoration`, `keeps demo mode, title, and focus through internal navigation and Back`. Screenshot: live demo desktop capture. Live cold audit recorded forward/back focus `true`, announcement text, and restored scroll `382`. |
| N1 | Header retains Demo, Make a card, and Privacy. Footer retains Privacy, Terms, factory credit, and now identifies build `polish-2`. | Test: accessibility and live cold footer assertions. Screenshot: both live mobile captures. Live home reported the factory credit and build marker. |
| N2 | Controls remain result-naming: “Read the 3-step guide” and “Make a card.” | Test: first-screen product test. Screenshot: live home mobile capture. Live `/` cold check passed. |

## Additional final-audit repair

The post-deploy Axe scan exposed the hidden import file input outside a landmark. It now lives inside `<main>`, and the accessibility suite was tightened from serious/critical-only checks to zero Axe violations. The final live scan found zero violations on `/`, `/demo`, `/privacy/`, `/terms/`, and the 404 at both 1440px and 390px.

## Evidence index

- Clean clone: `/tmp/motion-comfort-card-polish2-final.NUdxa9/repo`
- Local screenshots/reports: `.factory/evidence/polish-2/local/`
- Final live screenshots/reports: `.factory/evidence/polish-2/live/`
- Final live behavior record: `.factory/evidence/polish-2/live/cold-recheck.json`
- Final Lighthouse report: `.factory/evidence/polish-2/live/lighthouse.json`

No finding of any severity remains unresolved.
