# Independent verification 1 — FAIL

**Verdict: FAIL**

Verified on 2026-08-28 against candidate commit
`a0635577582739f6cd42d93d5a88f7252e072de5` and the deployed production URL
https://motion-comfort-card.sociobot.in.

## Scope and identity

- A separate, detached clean worktree was created at the candidate commit.
- `npm ci` completed with 0 reported vulnerabilities.
- The live `index.html`, `assets/main-DfOLw0Em.js`,
  `assets/main-C2wDbX7b.css`, `manifest.webmanifest`, and `sw.js` each had
  the same SHA-256 content as the candidate's production `dist/` output.
  The deployment is therefore the tested candidate, not an older build.

## Commands and passing checks

| Check | Evidence |
| --- | --- |
| Unit tests | `npm test` passed: 4/4. |
| Type check and exact production build | `npm run build` passed; created `dist/`. |
| Browser E2E | `npm run test:e2e` passed: 18/18 Chromium desktop and 390×844 mobile tests. |
| Accessibility subset | `npm run test:a11y` passed: 12/12. Axe found zero serious or critical issues on home, composer, privacy, and terms in both projects. |
| Bundles | Initial JS: 37,788 B raw / 12,421 B gzip; CSS: 25,629 B raw / 6,211 B gzip. Both are within the static-product budgets. No font files. |
| Visual/mobile | Manual live 390px capture had `scrollWidth === innerWidth === 390`; no clipping. Desktop and mobile have one `h1`, one `main`, `lang=en`, a visible skip link/focus treatment, and no load console/page errors. |
| Motion | In a reduced-motion context, decorative transform was `none` and button transition duration was `0.01ms`. |
| Privacy/network | Fresh desktop and mobile live loads made no third-party requests. Source review found IndexedDB-only records, no analytics, remote fonts, ads, or runtime third-party scripts. A normal valid shared-card import works and HTML-like game input is rendered as text, not markup. |
| PWA/offline | Live service worker controlled the page using `comfort-card-v1-shell` and `comfort-card-v1-runtime`. After initial online caching, `context.setOffline(true)` followed by reload rendered the home screen and visible offline banner without errors. Manifest has 192, 512, and maskable 512 icons; image dimensions verified. |
| Response basics | Live HTTPS responses send HSTS, `nosniff`, and a strict referrer policy. |

No `lint` script exists; `npm run build` includes the available TypeScript check.
Lighthouse CLI could not be launched in this container because its Chromium
launcher could not connect to the preinstalled browser; bundle measurements,
axe, and responsive/browser checks above completed independently.

## Blocking defects

### High — malformed full backup is accepted, persisted, and crashes its card route

**Reproduction on the live candidate**

1. Open the app and use Import with this structurally invalid backup (the
   `triggers` field must be an array, but is a string):

   ```json
   {"kind":"comfort-card-backup","version":1,"cards":[{"id":"bad-id","game":"Broken Backup","platform":"PC","baselineMinutes":10,"triggers":"not-an-array","customTrigger":"","settings":[{"id":"x","label":"Setting","tip":"tip","enabled":true,"tried":false}],"sessions":[]}]}
   ```

2. The app announces **“1 cards restored from backup.”**
3. Open **Broken Backup**. The route throws `e.triggers.map is not a function`
   and remains on the previous/loading view rather than showing a recoverable
   error or a delete action.

`parseImport()` validates only a small subset of backup fields before casting
the object to `ComfortCard`; `cardView()` assumes `card.triggers.map` exists.
The invalid record is already in IndexedDB, and there is no in-product route
to remove it from the failed card. This contradicts the required invalid-input
and recovery behavior and the app's claimed first-class invalid-import state.

### Medium — advertised baseline boundary is not enforced

The baseline number field declares `max="600"`, but the form has `novalidate`
and `syncDraft()` accepts the raw number. On live production, entering `9999`
and saving succeeds; the card renders **“9999 baseline minutes.”** The input
constraint is bypassed rather than rejected or clamped with an explanation.

### Medium — service-worker update versioning is not build-derived

The deployed/candidate `public/sw.js` has a fixed
`const VERSION = 'comfort-card-v1'`; the manifest also has fixed
`start_url: '/?v=1'`. Vite copies that file unchanged. Consequently, a normal
future production asset build that does not manually edit `sw.js` will not
produce a changed service-worker script/cache version or trigger the promised
in-app update path. Offline reload works for this version, but the required
service-worker update guarantee is not reliable.

## Non-blocking observations

- A malformed internal fragment such as `/#card/%` throws `URI malformed` and
  leaves the loading view, rather than recovering to the not-found view.
- The live deployment applies `cache-control: public, must-revalidate,
  max-age=30` to hashed JS/CSS/image assets, rather than long-lived immutable
  caching. It also lacks CSP and Permissions-Policy headers, and serves the
  manifest as `application/octet-stream`.
- Production source maps are shipped. They did not expose credentials in the
  reviewed bundle, but are unnecessary for this static public app.

## Required resolution and re-verification

1. Strictly validate every full-backup card/session/check-in field before any
   IndexedDB write; reject the whole import with an announced error, and add a
   recovery/delete path for already-invalid local data.
2. Enforce or clearly normalize the baseline range in application logic.
3. Generate a build-derived service-worker/cache/start-url version and rerun
   an actual old-to-new service-worker update test, including the update toast.
4. Re-run the command suite, invalid-import/recovery regression, offline
   reload, update flow, and live headers/caching check.
