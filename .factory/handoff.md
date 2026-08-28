# Comfort Card v1 handoff

## What was built

Comfort Card is a complete static, offline-first PWA for making private, per-game motion-comfort plans. The shipped path covers:

- Empty-state onboarding and a three-part card composer for game/platform, familiar triggers, baseline play time, and an ordered settings plan.
- Eight practical visual-setting experiments with enable/disable and ordering controls, plus a per-game “tried” record.
- IndexedDB persistence with resumed active sessions after reload or app close.
- A real 15-minute session timer, pause/resume, check-in-early path, 0–4 symptom scale, trigger notes, optional private notes, increased-symptom caution, and an always-visible stop action.
- Finished-session history and comparison to the user’s own baseline, without claims about medical benefit or game safety.
- Clean text/JSON sharing that deliberately excludes symptom scores, timestamps, duration, and notes; separate full JSON backup/import for data ownership.
- Offline app-shell and asset caching, versioned caches, offline fallback, install manifest, 192/512/maskable icons, and update-ready notice.
- First-class loading, empty, invalid-import, missing-card, storage-error, offline, and deletion-confirmation states.
- Static `/privacy/` and `/terms/` pages, no analytics, no remote runtime resources, and no payment path (the product is free).

The visual system is an original “calm risograph field note” with a warm paper ground, teal/cobalt/coral inks, clipped paper forms, offset print edges, and a no-loop reduced-motion policy. The generated hero was reviewed, optimized to responsive 44 KB and 168 KB WebP files, and its prompt/model/date are recorded in `.factory/design.md` and `assets/src/`.

## How to run and verify

```sh
npm ci
npm test
npm run build
npm run test:e2e
```

Production output is exactly `dist/`, with `dist/index.html` at its root.

Verification completed on 2026-08-28:

- `npm test`: 4/4 unit tests passed.
- `npm run build`: passed with Vite 6.4.3.
- `npm run test:e2e`: 18/18 passed in Chromium desktop and 390×844 mobile; creation, validation, keyboard path, session check-in/stop/history, privacy-safe sharing, persistence, offline reload, and legal pages covered.
- Axe via Playwright: zero serious or critical violations on home, composer, privacy, and terms in both desktop and 390px projects.
- Console smoke test: no console or page errors on load.
- Offline: explicit `context.setOffline(true)` reload passed after the service worker cached the shell.
- Production bundle: 37.8 KB JS (12.4 KB gzip), 25.6 KB CSS (6.2 KB gzip), no font payload, 44 KB mobile hero, 168 KB large hero.
- Lighthouse 12.2.1 mobile on the final local production preview: Performance 100, Accessibility 100, Best Practices 100, SEO 100. LCP 1.5 s, total blocking time 20 ms, speed index 0.9 s, CLS 0.
- Manual 390px visual review: no horizontal clipping; hero, empty state, creation controls, and footer stack as intended.

## Known gaps and next steps

- Game setting names and availability vary. The app offers generic things to look for and never claims verified compatibility.
- The 15-minute reminder is in-app; it catches up correctly after reopening, but v1 does not send background notifications when the PWA is closed.
- Browser storage can be cleared by the browser or device. The full JSON backup is the recovery path; there is intentionally no cloud sync.
- Success against the brief’s early-user outcome (30 minutes beyond baseline for at least half of 30 users without increased symptoms) requires an opt-in, privacy-preserving field study outside this codebase. No telemetry was added to manufacture that measurement.
