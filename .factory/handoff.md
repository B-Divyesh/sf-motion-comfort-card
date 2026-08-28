# Comfort Card repair handoff — deployed

Repaired the sole release-blocking finding from independent verification 2
(`fbd0a6224dad67aeb8b66d3ecc7673ed966d3939`) for candidate
`e79554372f6dc27da16623c69bbb828a5fd5eec5`.

## Repair

The static host consumes `staticwebapp.config.json` during deployment, so the
file correctly exists in `dist/` but returns 404 in production. The generated
service worker had incorrectly added that deployment-only file to its atomic
precache list. One 404 rejected `cache.addAll()`, preventing worker activation,
offline reload, and the update toast.

- `vite.config.ts` now explicitly excludes deployment-control files from the
  generated PWA precache while still leaving them in `dist/` for the host.
- `scripts/verify-build.mjs` fails the production build if
  `staticwebapp.config.json` is ever placed in the worker again.
- `tests/product.spec.ts` has a desktop and 390px regression asserting the
  generated worker contains a precache but excludes that deployment-only URL.

No product workflow, data schema, visual system, artifact class, or deployment
configuration changed.

## Verification before deployment

Clean install and local checks on 2026-08-28:

```sh
npm ci                 # 61 packages, 0 vulnerabilities
npm test               # 6 passed
npm run lint           # passed (tsc --noEmit)
npm run build          # passed; dist/ created
npm run test:e2e       # 27 passed, 1 intended mobile update-test skip
npm run test:a11y      # 12 passed
```

The fresh build produced PWA version `comfort-card-da463c02721e`. Its generated
worker precaches the current JS/CSS, pages, artwork, icons, and offline page,
but does **not** contain `staticwebapp.config.json`; `npm run verify:build`
enforces that invariant. The app JS is 41.78 KB raw / 13.70 KB gzip and CSS is
25.63 KB raw / 6.21 KB gzip; no fonts or source maps ship.

Playwright exercised desktop and 390×844 mobile creation, keyboard-first form
validation, malformed-backup rejection, corrupt local-record recovery,
baseline bounds, IndexedDB persistence, private-share exclusion, offline reload
via `context.setOffline(true)`, and the old-to-new worker update toast. Axe
found zero serious or critical issues on home, composer, privacy, and terms in
both projects; the suite also checks one h1, focusable skip link, no horizontal
scroll, reduced console/page errors, and the new worker-precache regression.

Before the repair deployment, the current live site reproduced the verifier's
root cause: `GET /staticwebapp.config.json` returned 404. Its response policy
already had HSTS, `nosniff`, strict referrer policy, and a restrictive
Permissions-Policy.

## Deployment and live verification

The repair commit `b86c207` was pushed to `origin/main` and deployed on
2026-08-28 using:

```sh
/opt/fleet/lib/deploy-static.sh motion-comfort-card dist
```

Azure Static Web Apps completed deployment `b52d7e9b-ca89-45bd-81ee-a68441a09309`
to the existing product URL. The live `sw.js` SHA-256 is
`be80b9134eeb8ce32e01549ab585fd7badda4a2d9a1d406b13170ce18adcfe2c`, exactly
matching the local `dist/sw.js`; its precache contains no
`staticwebapp.config.json`, while the live control-file URL remains 404 as
expected. The live manifest is `application/manifest+json`, hashed JS is
`public, max-age=31536000, immutable`, and HTTPS responses include HSTS,
`nosniff`, strict referrer policy, and the restrictive Permissions-Policy.

A fresh 390×844 Chromium profile registered the live worker, reloaded under
its active controller, then used `context.setOffline(true)` and reloaded to the
home h1 plus the visible offline banner. The worker was `activated`, the page
had no console/page errors, and the controlled URL was the live `/sw.js`.
The existing old-to-new update-toast regression is covered in the local
production-browser suite.

`verify-url.sh` against production returned HTTP 200 in 714 ms with no browser
errors, the expected title and `lang=en`, one h1, main landmark, and no
missing image alt or unlabeled buttons. Live desktop and 390px Axe scans found
zero serious/critical violations, no horizontal overflow, no errors, and only
same-origin `https://motion-comfort-card.sociobot.in` requests.

Lighthouse was not installed in this container; browser performance budgets,
responsive checks, bundle sizes, console checks, and axe checks above completed
successfully.

## Run / deploy

```sh
npm ci
npm test
npm run lint
npm run build
npm run test:e2e
npm run test:a11y
```

Deploy `dist/` as the existing static application. The deployment platform
consumes `dist/staticwebapp.config.json`; it must not publish that control file
as an application asset.
