# Perfection-loop round 1 handoff — Comfort Card

## Outcome

Commit `bbc9fd0` completes the remaining release-candidate polish and is deployed at <https://motion-comfort-card.sociobot.in> (Azure Static Web Apps deployment `3f35f84a-f1fd-4e0f-93ee-0ee1d4319e9e`). It preserves the warm-paper, two-ink risograph field-note identity.

- The first screen names the job and audience plainly, gives a one-click `?demo=1` sample path, and states the free, local, and offline facts.
- `/demo` and `?demo=1` show the completed Harbor Signal card with an isolated in-memory source, Reset demo, and Start for real. A fresh direct demo visit does not open `comfort-card-local`.
- `.factory/claims.json` contains nine reliance claims, each with one tagged demo-based Playwright test.
- Routing has per-route metadata, a real styled 404, legal pages, history restoration, and focus/live announcement behavior. This pass extended that focus behavior to Demo, Privacy, Terms, the sample action, and the legal return link; mode switches load the new data source before rendering.
- Header/footer, mobile layout, README/copy audit, catalog description, demo documentation, PWA caching, and local-only export/backup behavior meet the review record. See `.factory/polish-1.md` for a finding-by-finding map.

## Exact verification evidence

### Clean clone

Verified `bbc9fd0` from `/tmp/comfort-card-clean.xGtvKY/repo` on 2026-08-28.

- `npm ci`: passed (61 packages, 0 vulnerabilities).
- `npm test`: passed, 6 unit tests.
- `npm run build`: passed; `dist/index.html` exists. Main JavaScript is 47.40 KB raw / 15.46 KB gzip; CSS is 27.22 KB raw / 6.53 KB gzip.
- Every command named in `.factory/claims.json` passed independently from that fresh clone: `demo-isolation`, `core-card-workflow`, `local-private`, `clean-share`, `check-in-interval`, `offline-reload`, `free-core-workflow`, `local-persistence`, and `backup-restore`. Each ran in desktop and 390 px projects (18 passing claim executions).

### Final workspace and live checks

- `npm run test:e2e`: passed (full 66-test desktop/mobile browser suite, including demo, privacy traffic, downloads/imports, offline reload, routes, 404, focus, and mobile layout).
- `npm run test:a11y`: passed (16 Axe checks, no serious or critical issues). The required Axe coverage is the Playwright Axe integration; the standalone Axe CLI could not locate its Selenium Chrome binary in this container.
- `/opt/fleet/lib/verify-url.sh` passed locally for `/` and `/demo`, then cold against the live home and live demo: title, `lang=en`, one h1, main landmark, complete image alt text, labeled buttons, and zero page errors. Captures and JSON reports: `.factory/evidence/local/` and `.factory/evidence/live/`.
- A fresh live 390 × 844 browser re-check passed the hero, one-click query demo, direct-demo IndexedDB isolation, Reset demo, route-heading focus, and styled 404. See `.factory/evidence/live/cold-recheck.json`. The expected network message for the deliberately requested HTTP 404 is not a page error.
- Live HTTP checks: `/`, `/demo`, `/privacy/`, and `/terms/` returned 200; `/definitely-missing` returned 404. Security headers are served by the static work app configuration.
- Lighthouse 12.8.2 against the deployed home: performance 100, accessibility 100, best practices 100, SEO 100; LCP 1.2 s, CLS 0, TBT 80 ms. Full report: `.factory/evidence/live/lighthouse.json`.

## Run or deploy

```sh
npm ci
npm test
npm run build
npm run test:e2e
npm run test:a11y
```

Run each command listed in `.factory/claims.json` separately for claim-level verification. Deploy `dist/` as the static app; the work-order deployment used `/opt/fleet/lib/deploy-static.sh motion-comfort-card dist`.

## Known gaps and next steps

None. No review finding, including the previously minor navigation/footer and copy items, remains unresolved.
