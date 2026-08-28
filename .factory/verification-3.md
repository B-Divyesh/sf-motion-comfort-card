# Independent verification 3 — PASS

**Verdict: PASS**

Verified on 2026-08-28 against candidate commit
`e6c2838247f7ebec0781e2424591f8b9310f86d0` and production
<https://motion-comfort-card.sociobot.in>.

## Scope and deployment identity

- QA ran from a detached clean worktree at the candidate commit. The primary
  worktree's pre-existing modified `graphify-out/` files were not changed.
- `npm ci` installed 61 packages and reported 0 vulnerabilities.
- Fresh `npm run build` produced `dist/` and build-derived PWA version
  `comfort-card-da463c02721e`.
- Production is the candidate: SHA-256 matched exactly for `index.html`,
  `privacy/index.html`, `terms/index.html`, `offline.html`,
  `manifest.webmanifest`, `sw.js`, `assets/main-BE6wTLUz.js`, and
  `assets/main-C2wDbX7b.css`. The live worker is
  `be80b9134eeb8ce32e01549ab585fd7badda4a2d9a1d406b13170ce18adcfe2c`.

## Evidence

| Area | Result |
| --- | --- |
| Install, unit, type, production build | PASS — `npm test` 6/6; `npm run lint` passed (`tsc --noEmit`); `npm run build` passed, generated `dist/`, and `verify:build` confirmed the manifest/worker version and current bundle precache. |
| Browser regression suite | PASS — `npm run test:e2e` completed 27 passed with 1 intentional mobile-only update-test skip. This covers desktop and 390×844 mobile card creation, keyboard-first validation, normal session/check-in/stop flow, IndexedDB persistence, malformed-import rejection, corrupt-record recovery, baseline range and share redaction. `npm run test:a11y` is included in that suite and its 12 route/project scans passed. |
| Independent live functional checks | PASS — 390px live browser confirmed missing game-name validation, invalid baseline `601` rejection and recovery path, no horizontal overflow, no page errors, and the current deployed app shell. Existing end-to-end regression exercises a representative card, a private note, a symptom increase, immediate stop guidance, end/save, and verifies that the clean share omits note and symptom history. |
| Accessibility and keyboard | PASS — live axe scans found 0 serious/critical findings on `/`, `/#new`, `/privacy/`, and `/terms/`. Mobile check found one h1, a visible keyboard skip-link path, `main`, no horizontal overflow, and the reduced-motion context changes decorative transition duration to `0.01ms`. |
| Privacy and outbound traffic | PASS — browser request capture during fresh live use saw only `https://motion-comfort-card.sociobot.in`. Source/browser review confirms IndexedDB-local records, no analytics, ads, remote fonts, third-party scripts, payment, or remote API calls. Clean shares exclude session dates, durations, symptom levels, and private notes. |
| PWA/offline/update | PASS — a fresh 390×844 Chromium profile installed the live worker, reloaded while controlled, then reloaded successfully under `context.setOffline(true)` with the offline banner and home h1. The local production-browser update test passed, including detection of a changed worker and the in-app update-ready toast. Live worker precache contains the current shell and **does not** contain `staticwebapp.config.json`, eliminating the earlier deployment-only install failure. |
| Performance/bundles | PASS — production JS is 41.78 KB raw / 13.70 KB gzip (under 200 KB); CSS is 25.63 KB raw / 6.21 KB gzip (under 50 KB); the 720px hero is 43,548 B. No shipped font files or source maps were found. Desktop and 390px screenshots visually match the documented low-glare risograph field-note system. |
| Response and cache policy | PASS — live HTTPS sends HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy: camera=(), geolocation=(), microphone=(), payment=()`. The manifest is `application/manifest+json`; hashed JS/CSS have `public, max-age=31536000, immutable`; HTML and `sw.js` revalidate after 30 seconds. |

## Regression checked from verification 2

The previous FAIL was independently retested rather than accepted on the
builder's report. In a fresh production profile, `navigator.serviceWorker.ready`
settled, the worker controlled the page, and offline reload rendered the app.
The live `/sw.js` precache excludes the deployment-consumed
`staticwebapp.config.json`; its previous 404 can no longer atomically reject
service-worker installation.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low (non-blocking): production does not emit a `Content-Security-Policy`
  header. Current behavior is safe in this assessment (same-origin-only
  resources and tested escaping of stored input), but a restrictive CSP would
  be useful future defense in depth.

## Notes

No repository code was modified for this verification. Lighthouse was not used
for scoring because it is not installed in this clean checkout; the release
performance budgets, browser console/page-error checks, responsive behavior,
and axe scans above were completed directly.
