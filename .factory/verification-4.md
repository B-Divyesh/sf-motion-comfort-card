# Plan game settings before motion sickness — verification 4

## Verdict

**FAIL.** Two accessibility findings remain: one major and one minor. All 11
declared claims were tested and passed, so the untested claim count is zero.
PASS requires zero findings of every severity.

- Finding count: **2**
- Untested claim count: **0**
- Candidate implementation: `5c8e6de88f05ed01ca660cbccf0c0e6adfdd02c6`
- Candidate documentation/evidence: `560001130e19e7ea8f214e320a6b45721738afb1`
- Live URL: <https://motion-comfort-card.sociobot.in>
- Verified: 5 September 2026

The later main-branch commit `eea57cb68902fd7fae6e24cbbea5b19615469c45`
changes only `graphify-out/`. It does not change the product or the evidence
being reviewed.

## First screen before scrolling

Fresh 1440 × 900 desktop and 390 × 844 phone profiles showed all three items
before scrolling:

- Job: **Plan game settings before motion sickness starts.**
- Audience: players who feel sick from game motion.
- First action: **Try it with sample data.** The adjacent text says it opens a
  completed game card.

The three facts—Free, Stored on this device, and Works offline after the first
visit—also fit on the first phone screen. Neither viewport had horizontal
overflow at the normal text size. The warm-paper risograph layout and original
controller illustration match `.factory/design.md` and are not a generic
framework surface.

## Findings

### Major F-4-1 — The finished-session view breaks at 200% text size

**Evidence:** In a fresh 390 × 844 live profile, setting the root text size
from 16 px to 32 px produced a document width of 453 px on `/demo`, 63 px wider
than the viewport. The finished-session section visibly clips its heading and
forces the table headers together. “Last symptom” extends beyond the viewport.
Home, new-card, Privacy, Terms, and 404 routes had no horizontal overflow under
the same check.

This fails the attached accessibility requirement that text resize to 200%
without content loss. It also makes the sample output harder to read for the
people most likely to enlarge text.

**Required fix:** At the phone breakpoint, let the history heading wrap without
the count stamp competing for the same row. Reflow the finished-session table
into labeled rows or place it in a clearly bounded scroll region. Add a 390 px
browser regression that doubles the root font size and checks for no clipping,
overlap, or page-level horizontal overflow.

Evidence screenshot:
`/work/.evidence/verification-4/demo-phone-text-200-stats.png`.

### Minor F-4-2 — Two visible links are smaller than the 44 px target minimum

**Evidence:** Browser bounding boxes on the live 390 px layout measured:

- the “Comfort Card home” brand link at **42 × 42 px**;
- the Privacy contact link `privacy@sociobot.in` at about **162 × 19 px**.

Neither element has a pseudo-element that expands its hit area. Checkbox inputs
and the visually hidden import input were excluded because their visible labels
provide the intended targets. The two links above are the actual visible hit
areas. This fails the attached 44 × 44 px touch/click target requirement.

**Required fix:** Give the brand link a minimum 44 px width and height. Give the
email link a 44 px-high inline-flex or padded target without harming paragraph
reflow. Add a phone regression that measures visible interactive targets.

## Demo and real-data separation

The first action opened the completed fictional **Harbor Signal** card in one
click. It showed PC, four motion triggers, six ordered settings, two tried
settings, and a finished 24-minute session with a 1 / 4 check-in.

The persistent label said **“Demo — sample data, nothing is saved”** and kept
Reset demo and Start for real available. A direct `/demo` load in a fresh
profile reported no IndexedDB databases. Changing Motion blur, resetting, and
reloading restored the sample. A real card made in the same disposable profile
was hidden in demo mode and remained unchanged after demo reset.

## Clean-checkout commands

Verification ran in a fresh clone at documentation commit `5600011…`; its
product files are the implementation at `5c8e6de…`.

| Command | Result |
| --- | --- |
| `npm ci` | PASS — 61 packages, 0 reported vulnerabilities |
| `npm test` | PASS — 6/6 |
| `npm run lint` | PASS |
| `npm run build` | PASS — `dist/` created; PWA version `comfort-card-c8fb94c808f8` |
| `npm run test:a11y` | PASS — 16/16 |
| `npm run test:e2e` | PASS — 69 passed, 1 intentional mobile update-test skip |

The production build contains 47.38 KB raw / 15.41 KB gzip JavaScript and
27.22 KB raw / 6.53 KB gzip CSS. The mobile hero is 43.55 KB. These are within
the product budgets. The committed Lighthouse record for this byte-identical
build reports 98 performance, 100 accessibility, 1,889 ms LCP, 0 CLS, and
137 ms total blocking time.

## Declared claims

Every exact command in `.factory/claims.json` ran separately. Each command ran
the tagged test in both desktop and phone projects.

| Claim | Result |
| --- | --- |
| `demo-isolation` | PASS |
| `core-card-workflow` | PASS |
| `local-private` | PASS |
| `clean-share` | PASS |
| `check-in-interval` | PASS |
| `offline-reload` | PASS |
| `free-core-workflow` | PASS |
| `local-persistence` | PASS |
| `backup-restore` | PASS |
| `medical-scope` | PASS |
| `pwa-routing` | PASS |

Each claim ID appears exactly once as an `@claim:<id>` test. A fresh copy audit
of the landing page and README found no unlisted reliance claim. Untested claim
count: **0**.

## Live behavior

- Normal flow: the sample and real card workflows worked. Starting a session,
  pausing, checking in, stopping, saving, clean sharing, backup, and restore are
  covered by passing browser tests.
- Invalid and boundary flow: a missing game name was rejected and focused;
  baseline 601 was rejected, and 600 saved. A malformed backup was rejected
  before storage. A legacy malformed record was quarantined and removable.
- Recovery: route changes focused and announced the new H1. Browser Back
  restored heading focus and scroll. The session dialog received focus.
- Keyboard: the skip link was first, Enter moved into main content, and its
  visible focus outline measured 3 px cobalt.
- Reduced motion: the live hero transform became `none`; transition duration
  became `1e-05s` (0.01 ms).
- Accessibility automation: live Axe scans reported zero violations on `/`,
  `/new`, `/demo`, `/privacy/`, `/terms/`, and the missing route in desktop and
  phone profiles. The target-size and 200% text findings are manual contract
  checks that Axe does not cover.
- Privacy: full-flow request capture stayed on the product origin. No account,
  analytics, ads, third-party script, payment, or remote API request appeared.
- Offline/update: fresh desktop and phone profiles became controlled by
  `/sw.js` and reloaded Harbor Signal offline with the offline banner. The local
  old-to-new worker test passed and showed the update-ready action.
- Links and routes: every rendered HTTP link returned below 400. Privacy and
  Terms returned 200 with route-specific titles, canonicals, one H1, and main.
- Missing route: `/definitely-missing` deliberately returned HTTP 404 and the
  styled page with title “Page not found — Comfort Card”, H1 “Page not found.”,
  and “Return to your cards”. This expected HTTP 404 is not a defect.
- Headers: production sends HSTS, `nosniff`, strict referrer policy,
  Permissions-Policy, and a restrictive same-origin CSP. Hashed assets are
  immutable; the manifest has the correct MIME type.
- `/opt/fleet/lib/verify-url.sh`: PASS — 671 ms, title, `lang=en`, one H1,
  main, complete image alt text, labeled buttons, and zero console errors.

## Deployment identity

Fresh-build and production SHA-256 values matched for `index.html`, `404.html`,
Privacy, Terms, `offline.html`, `manifest.webmanifest`, `sw.js`, the hashed JS,
and the hashed CSS. The live runtime is the implementation candidate, not an
older deployment. Report-only and Graphify commits do not require another
product image.

## Earlier findings

| Earlier record | Current disposition |
| --- | --- |
| Review 1 B1, M1, M2, N2 | Closed: the live first screen names the job and audience; copy and actions remain plain. |
| Review 1 B2, B4 | Closed: both demo entries show the completed isolated sample with persistent reset/exit controls. |
| Review 1 B3 | Closed: 11 claims exist, each has one tagged test, and every exact command passed. |
| Review 1 M3, N1 | Closed: metadata, social image, header/footer, legal routes, sitemap, security headers, and styled 404 are live. |
| Review 1 M4 | Closed: forward and Back navigation focus and announce the route H1 and restore scroll. |
| Verification 1 malformed import | Closed: malformed imports are rejected; corrupt stored records are quarantined and removable. |
| Verification 1 baseline range | Closed: 601 is rejected and 600 is accepted with field focus on error. |
| Verification 1 worker version | Closed: the manifest and worker use the build-derived `comfort-card-c8fb94c808f8` version; update regression passes. |
| Verification 1 minor observations | Closed: malformed legacy hash input shows the styled not-found page without an error; cache/MIME/headers are correct; no source maps ship. |
| Verification 2 service-worker install | Closed: deployment-only configuration is absent from precache; fresh live desktop and phone workers control and reload offline. |
| Verification 3 CSP observation | Closed: production now sends the restrictive CSP shown above. |
| Review 2 F-2-1, F-2-2 | Closed: medical scope and PWA routing are registered and their exact commands passed. |
| Review 3 F-3-1 | Closed: the live deliberate HTTP 404 has the standalone H1 “Page not found.” and browser regressions assert it. |

## Scope notes

This is a static local-first PWA, so backend tenant isolation, restart
persistence, health checks, and 429 behavior do not apply. AI does not improve
the brief’s small private checklist task, and no AI runtime or related claim is
present. No product code was changed during this verification. The existing
modified `graphify-out/` files were left untouched.
