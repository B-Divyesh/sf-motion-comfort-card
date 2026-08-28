# Perfection-loop round 2 handoff — Comfort Card

## Outcome

All findings from `.factory/review-1.md` and `.factory/review-2.md` are closed. The final repair is commit `8250b7c585b5a44331d06c7b303f900a77f606da` on `main`, pushed to origin and deployed at <https://motion-comfort-card.sociobot.in>. Final Azure Static Web Apps deployment: `559db583-20a6-402f-8c0e-643de59e68b2`.

The warm-paper risograph field-note identity and offline-PWA artifact class are unchanged.

## What changed

- Unified the medical/safety limitation across the landing page, Terms, README, and clean share text.
- Added the `medical-scope` claim and a real cross-surface regression test.
- Added the `pwa-routing` claim and a production-build test for versioning, precaching, same-origin runtime behavior, direct routes, offline reload, and the host's real 404 configuration.
- Expanded `.factory/claims.json` from nine to 11 entries. Each entry has exactly one matching `@claim:<id>` test.
- Updated the catalog line to the 95-character verb-first sentence: “Prepare game settings before motion sickness starts with private cards and 15-minute check-ins.”
- Marked the visible product as build `polish-2` and updated the copy audit.
- Moved the hidden import control inside `<main>` after the live Axe audit found it outside landmarks. Accessibility tests now require zero violations, not only zero serious/critical violations.

## Exact clean-clone verification

Verified final commit `8250b7c585b5a44331d06c7b303f900a77f606da` from `/tmp/motion-comfort-card-polish2-final.NUdxa9/repo` on 2026-08-28.

- `npm ci`: 61 packages installed; zero vulnerabilities.
- `npm test`: 6/6 unit tests passed.
- `npm run build`: passed and produced `dist/`. Build verifier reported PWA version `comfort-card-a26fa004738f`.
- Production bundles: JavaScript 47.40 KB raw / 15.42 KB gzip; CSS 27.22 KB raw / 6.53 KB gzip. Both are well below the product budgets.
- Every exact command in `.factory/claims.json` passed independently. Each of the 11 claims ran in Chromium and the 390px mobile project: 22/22 executions.
- `npm run test:e2e`: 69 passed; one intentional duplicate mobile worker-update check skipped because the same production worker mutation runs once in desktop Chromium.
- `npm run test:a11y`: 16/16 passed with zero Axe violations across home, new card, demo, Privacy, Terms, and 404 in desktop and mobile projects.
- `npm audit --audit-level=high`: zero vulnerabilities.

## Final deployed evidence

- `/opt/fleet/lib/verify-url.sh` passed on the cold live home and demo: correct title, `lang=en`, one h1, main landmark, image alt text, labeled buttons, and zero console/page errors.
- Fresh 1440×900 and 390×844 contexts confirmed the exact first-screen copy, one-click query demo, banner/reset/Start for real, clean share limitation, same-origin-only requests, and no horizontal overflow.
- A separate fresh direct `/demo` context listed no IndexedDB databases.
- `/`, `/demo`, `/privacy/`, and `/terms/` returned 200. `/definitely-missing` returned HTTP 404 and rendered the product-specific 404.
- Route navigation and Back focused/announced the h1; Back restored scroll to 382px in the cold check.
- A freshly installed controlling worker reloaded Harbor Signal offline and displayed the offline banner.
- Live Axe scans found zero violations on home, demo, Privacy, Terms, and 404 at desktop and mobile sizes.
- Lighthouse 13.0.1: performance 100, accessibility 100, best practices 100, SEO 100; LCP 1.1 s, CLS 0, TBT 30 ms.

Evidence:

- `.factory/evidence/polish-2/live/cold-recheck.json`
- `.factory/evidence/polish-2/live/lighthouse.json`
- `.factory/evidence/polish-2/live/home/`
- `.factory/evidence/polish-2/live/demo/`
- `.factory/polish-2.md`

## Run and deploy

```sh
npm ci
npm test
npm run build
npm run test:e2e
npm run test:a11y
/opt/fleet/lib/deploy-static.sh motion-comfort-card dist
```

Run every `test` command in `.factory/claims.json` separately for claim-level verification.

## Known gaps and next steps

None. No review finding, accessibility violation, failed claim, or deployment gap remains.
