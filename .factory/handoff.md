# Perfection loop round 1 handoff — Comfort Card

## Outcome

Repaired release candidate `e6c2838247f7ebec0781e2424591f8b9310f86d0` against every finding in `.factory/review-1.md`.

- B1: The first screen now says “Plan game settings before motion sickness starts.” It names players affected by game motion, presents one-click sample data, and lists free, local-storage, and offline facts.
- B2/B4: `/demo` and `/?demo=1` open a completed Harbor Signal card. The persistent banner offers “Reset demo” and “Start for real.” Demo state stays in memory and never opens the real `comfort-card-local` database.
- B3: `.factory/claims.json` registers nine reliance claims. Each ID appears on exactly one Playwright test, and every manifest command passed independently from a clean clone.
- M1/M2/N2: Replaced the review’s metaphors, jargon, and vague actions with plain player language. `.factory/copy-audit.md` records landing and README word counts and terminology.
- M3/B4: Added route-aware titles, descriptions, canonicals, Open Graph/Twitter metadata, a 1200×630 product-art social image, Apple touch icon, `/demo` sitemap entry, explicit app route rewrites, security headers, and a designed HTTP 404.
- M4: History navigation restores scroll, moves focus to the new h1, and updates a persistent polite live region.
- N1: The shared header links Demo, Make a card, and Privacy. The footer links Privacy and Terms and includes the factory credit and build ID.
- Mobile: The first screen and complete demo card were visually checked at 390×844. Controls stack without horizontal overflow and remain at least 44 px tall.
- PWA: The versioned service worker caches the app shell and demo route behavior. The large social preview is excluded from precache. Offline demo reload is covered by a claim test.

The existing warm-paper, two-ink risograph field-note identity remains intact. The social preview is cropped from the accepted generated source art; provenance is recorded in `.factory/design.md`.

## Clean-clone verification

Verified commit `f2a7371d46b7b8acb24765857d606b85980d2bfe` in `/tmp/comfort-clean.26sqTS/repo` on 2026-08-28.

- `npm ci`: passed; 61 packages installed, 0 vulnerabilities.
- `npm test`: passed, 6/6 unit tests.
- `npm run build`: passed; `dist/index.html` exists. Main JS is 47.18 KB raw / 15.42 KB gzip. CSS is 27.22 KB raw / 6.53 KB gzip.
- Every command in `.factory/claims.json`: passed independently; nine claims × desktop and mobile = 18 passing checks.
- `npm run test:e2e`: 63 passed, 1 intentionally skipped. The skipped mobile duplicate is the service-worker update-install transition; it passed in the desktop project. The suite covers the full workflow, keyboard use, validation/recovery, direct routes, Back/focus/scroll, metadata/legal links, 390 px layout, demo reset/isolation, privacy traffic interception, downloads/imports, and offline reload.
- `npm run test:a11y`: 16/16 passed. Axe found no serious or critical issues on home, new card, demo, privacy, terms, or 404 routes in desktop and 390 px projects.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4176 ...`: passed with title, `lang=en`, one h1, main landmark, all image alt attributes, labeled buttons, and zero console/page errors.
- Lighthouse 12.8.2 mobile: performance 100, accessibility 100, best practices 100, SEO 100; LCP 1.5 s, CLS 0, TBT 50 ms.
- Azure Static Web Apps CLI 2.0.10 route check: `/`, `/demo`, `/new`, `/card/*`, `/session/*`, `/check-in/*`, `/privacy/`, and `/terms/` returned 200; `/definitely-missing` returned 404.

## Run locally

```sh
npm ci
npm test
npm run build
npm run test:e2e
npm run test:a11y
```

Run each claim command exactly as listed in `.factory/claims.json`. Open `/demo` or `/?demo=1` to inspect the isolated sample manually.

## Known gaps and next steps

No blocking review finding or known product defect remains. Deployment and live URL verification are recorded below after release.
