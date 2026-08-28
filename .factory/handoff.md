# Review 1 handoff — Comfort Card

Completed the requested adversarial first-read review without changing product
code. The review is in .factory/review-1.md; its verdict is **FAIL**.

## What was checked

- Fresh live Chromium visits at 390px and desktop before scrolling.
- Direct checks of /demo, /?demo=1, legal routes, a missing route, metadata,
  visible links, cold-load requests, and route-change focus.
- Claims/demo documentation and claim-test tags.
- npm ci, npm test, npm run build, and npm run test:e2e. All passed; the
  end-to-end suite records passed in test-results/.last-run.json.

## Required next steps

No sample-data demo, .factory/demo.md, or .factory/claims.json exists. Those
are blocking failures. The first screen does not identify players with motion
sickness, and metadata, real 404 routing, and route focus need repair. See
.factory/review-1.md for exact evidence, rewrites, and required tests.

## Re-run

    npm ci
    npm test
    npm run build
    npm run test:e2e
