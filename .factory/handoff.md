# Comfort Card repair handoff

**Verification status: PASS locally** — repair of verifier report 1 for base
candidate `a0635577582739f6cd42d93d5a88f7252e072de5`.

## What changed

- Full JSON backups now undergo strict, recursive validation before any local
  write. Every card, setting, session, check-in, date, id, boolean, symptom
  value, trigger list, and 0–600 minute baseline is checked. A bad card rejects
  the entire backup with “Nothing was restored.” The restore write is a single
  IndexedDB transaction.
- Existing malformed records from the previously vulnerable importer are
  quarantined from normal card routes. The home screen presents a recovery
  notice; opening its review link provides an explicit, scoped removal action.
  A malformed card can no longer crash `cardView()` or strand the user.
- The baseline field now enforces a whole-number range of 0–600 in application
  logic, announces the error, focuses the field, and preserves the rest of the
  draft while it is corrected. Model construction also caps programmatic input
  at 600 and backup validation rejects larger values.
- The production build now derives a content fingerprint after Vite writes its
  files. It writes that fingerprint into the service-worker cache names and
  manifest `start_url`, precaches the current hashed app bundle, and fails the
  build if the manifest and worker versions differ or a placeholder remains.
  Production source maps are no longer shipped.
- Static Web Apps response policy now lives in source: hashed assets and icons
  receive immutable one-year caching, the manifest is served as
  `application/manifest+json`, and a restrictive Permissions-Policy disables
  camera, geolocation, microphone, and payment features.
- Added regression coverage for the exact malformed-backup payload, no-write
  guarantee, malformed local-record recovery/removal, baseline boundary on
  desktop and 390px mobile, and a real old-to-new service-worker update that
  displays the in-app update action.

## Run and verify

```sh
npm ci
npm test
npm run lint
npm run build
npm run test:e2e
npm run test:a11y
```

Results from the final local run on 2026-08-28:

- `npm ci`: 61 packages installed; 0 vulnerabilities.
- `npm test`: 6/6 Vitest tests passed.
- `npm run lint`: TypeScript `--noEmit` passed.
- `npm run build`: passed and produced `dist/index.html`; the built PWA version
  was `comfort-card-d860df4e7510`. `verify:build` confirmed matching manifest
  and worker versions, resolved placeholders, and precaching of the current JS
  bundle. JS is 41.78 KB raw / 13.70 KB gzip; CSS is 25.63 KB raw / 6.21 KB
  gzip; no font payload or source maps are shipped.
- `npm run test:e2e`: 25 passed, 1 intentionally skipped. Chromium desktop and
  390×844 mobile cover the complete card/session workflow, keyboard creation,
  the import/recovery/baseline regressions, offline cached reload, and the
  desktop service-worker old-to-new update/toast transition. The update test
  runs once against the shared production build; mobile executes every other
  workflow regression.
- `npm run test:a11y`: 12/12 passed. Axe found no serious or critical issues
  on home, composer, privacy, or terms in desktop and 390px views. The suite
  also confirms one h1, skip-link keyboard focus, no horizontal overflow, and
  no console/page errors on load.

## Product and privacy notes

The artifact remains a static Vite TypeScript offline PWA. Data is still
IndexedDB-only, exports remain local and user-directed, and no analytics,
remote fonts, third-party runtime scripts, or payment paths were added. The
existing visual thesis, original asset provenance, non-medical language, and
all passing creation/session/share behavior were preserved.

## Known limits

- Game setting names continue to vary by game and platform; the product offers
  general things to look for rather than compatibility promises.
- The reminder is in-app and does not send background notifications once the
  PWA is closed.
- Browser storage may be cleared by the user or device; the full private JSON
  backup remains the recovery path for valid records.
