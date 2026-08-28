# Review 3 handoff — Comfort Card

## Outcome

Independent adversarial review 3 is **FAIL** with one minor copy/accessibility
finding: `F-3-1` in `.factory/review-3.md`. The designed 404 uses the unclear
H1 “This page is not in the drawer.” Replace it with “Page not found.” before
acceptance.

No product code was changed. This handoff and the review report are the only
intended commit changes. Pre-existing `graphify-out/` modifications remain
untouched.

## Verification performed

- Fresh live first reads at 390 × 844 and 1440 × 900; no console/page errors
  or mobile horizontal overflow.
- Direct `/demo` and one-click `?demo=1` sample, banner, Reset, Start for real,
  zero demo IndexedDB/localStorage keys, same-origin request log, and live
  service-worker offline reload.
- Crawl of all rendered internal HTTP links and live route metadata/404/header
  checks.
- Full historical regression check of previous reviews, polish records,
  verification records, and handoff.

## Clean-clone commands

From `/tmp/motion-comfort-card-review3.CSI6OB/repo` at
`9fdb1555435c0066b9b90b973344391e393ebca2`:

```sh
npm ci
npm test
npm run build
npm run test:a11y
npm run test:e2e
```

Results: unit 6/6 passed; build passed and created `dist/`; accessibility
16/16 passed; the full browser suite passed. Every one of the 11 exact claim
commands in `.factory/claims.json` also passed independently in desktop and
390px projects.

## Next step

Make the single 404 heading rewrite and add a route assertion, then rerun this
review. Do not treat the current report as a PASS until `F-3-1` is closed.
