# Independent verification 2 — FAIL

**Verdict: FAIL**

Verified on 2026-08-28 against candidate commit
`e79554372f6dc27da16623c69bbb828a5fd5eec5` and production
https://motion-comfort-card.sociobot.in.

## Scope and deployment identity

- Used a detached, clean worktree at the candidate commit. The original worktree's unrelated `graphify-out/` changes were not touched.
- `npm ci` installed 61 packages and reported 0 vulnerabilities.
- Fresh production build output matched live byte-for-byte (SHA-256) for `index.html`, `manifest.webmanifest`, `sw.js`, `assets/main-BE6wTLUz.js`, `assets/main-C2wDbX7b.css`, and `assets/comfort-card-hero-720.webp`. This is the deployed candidate, not a stale release.

## Passing evidence

| Area | Fresh evidence |
| --- | --- |
| Unit/type/build | `npm test`: 6/6; `npm run lint`: passed; `npm run build`: passed and produced `dist/`. Build verification confirmed PWA version `comfort-card-d860df4e7510`. |
| Browser suite | `npm run test:e2e`: 25 passed, 1 intended mobile-only skip; `npm run test:a11y`: 12/12 passed. |
| Independent live workflow | On desktop and 390×844 mobile, created a card with an HTML-like game name (rendered as literal text), selected Motion blur, accepted baseline 600, started a session, recorded symptom 2 after baseline 0, took the stop path, and confirmed the clean share excludes the private note and symptom history. No console or page errors occurred. |
| Error/recovery paths | Live rejects baseline 601 with the announced 0–600 error and returns focus to the field. A malformed backup with `triggers` as a string is rejected before persistence. A deliberately injected legacy malformed local record was quarantined, reviewed, and removed without page errors. |
| Accessibility/mobile | Live axe: 0 serious/critical findings on `/`, `/#new`, `/privacy/`, and `/terms/` in desktop and 390px contexts (8 scans). Both contexts have one h1/main, no horizontal overflow, a keyboard-reachable skip link with solid visible focus, and reduced motion changes the hero transform to `none` with a `0.01ms` transition. |
| Privacy/network | Live interaction made requests only to `https://motion-comfort-card.sociobot.in`. Source and browser review found IndexedDB-local records, no analytics, remote fonts, third-party scripts, ads, or payment paths. |
| Bundles/visual | Initial JS is 41,782 B raw / 13,622 B gzip; CSS is 25,629 B raw / 6,227 B gzip; no source maps or font files ship. The mobile hero WebP is 43,548 B. Desktop and 390px screenshots visually match the documented risograph field-note system. Token contrast checks: ink/paper 12.65:1, muted/paper 5.85:1, cobalt-deep/paper 9.42:1. |
| Live response policy | HTTPS responses have HSTS, `nosniff`, strict referrer policy, and `Permissions-Policy: camera=(), geolocation=(), microphone=(), payment=()`. Manifest is `application/manifest+json`; hashed JS/CSS/image assets have `public, max-age=31536000, immutable`. |

`lighthouse` is not installed in this container, so a Lighthouse score was not produced. The bundle, responsive, console, axe, and browser checks above completed independently.

## Blocking defect

### High — live service worker cannot install, so offline and update guarantees are absent

**Fresh production reproduction**

1. Load the production URL in a fresh Chromium profile and wait 8–10 seconds.
2. `navigator.serviceWorker.getRegistrations()` returns `[]`; `navigator.serviceWorker.controller` is `false`; `navigator.serviceWorker.ready` does not settle within 12 seconds.
3. Manually calling `navigator.serviceWorker.register('/sw.js')` initially returns an `installing` worker, but it disappears after installation. The shell cache is created but no registration remains.
4. The generated worker precaches `/staticwebapp.config.json`. Production returns **404** for that URL, while every other precache URL returns 200. `cache.addAll(PRECACHE)` is atomic, so this 404 rejects installation and prevents activation.

The local Playwright offline and old-to-new update tests pass only because Vite preview serves `dist/staticwebapp.config.json`. The production static host consumes that configuration file rather than deploying it. As a result, the shipped PWA cannot become controlled, cannot reload offline, and cannot show its service-worker update path. This violates the offline-PWA artifact contract and is a release blocker.

**Required fix:** exclude `staticwebapp.config.json` (and any deployment-only control files) from the generated precache, rebuild, deploy, then re-test a fresh-profile live registration, controlled reload, `context.setOffline(true)` reload, and old-to-new update toast.

## Non-blocking observations

- Production does not send a Content-Security-Policy header. The current app safely escapes tested stored input and has no third-party runtime resources, but CSP would be worthwhile defense in depth.

## Final assessment

The product's core comfort-card workflow, careful non-medical language, local-data behavior, privacy, accessibility, responsiveness, and performance budget are verified. The candidate must **not** be accepted because the deployed PWA's essential offline/update behavior fails in a fresh real browser.
