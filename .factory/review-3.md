# Adversarial first-read review 3 — Comfort Card

**Verdict: FAIL.** Reviewed 2026-08-28 against
<https://motion-comfort-card.sociobot.in> in fresh Chromium contexts at
390 × 844 and 1440 × 900, and from a clean clone of
`9fdb1555435c0066b9b90b973344391e393ebca2`. One minor finding remains. The
required verdict is FAIL because PASS requires zero findings.

## First 30 seconds

Before scrolling, both phone and desktop answer the three first-read questions.

- **What it does:** plan game settings and use 15-minute symptom check-ins
  before motion sickness starts.
- **For whom:** “For players who feel sick from game motion”.
- **What to click first:** “Try it with sample data”; “Opens a completed game
  card.” says what happens next.

The 390px first viewport has the seven-word job headline, the 18-word audience
sentence, sample action, result, and Free / local / offline facts. It has no
horizontal overflow (`scrollWidth === 390`). This first read is not blocking.

## Findings, ordered by severity

### Minor F-3-1 — The 404 H1 is a metaphor that does not name the error plainly

**Location and exact quote:** live `/definitely-missing`, H1: “This page is
not in the drawer.”

**Why this is a finding:** The browser title and visible “PAGE NOT FOUND” label
make the screen usable visually, and the route is a real styled HTTP 404. But a
screen-reader heading list announces this H1 without the small preceding label.
“Drawer” is product decoration rather than a plain description of a missing
page, so the heading does not make sense on its own.

**Concrete fix:** Change the H1 to **“Page not found.”** Keep the risograph
drawer artwork and the existing “Return to your cards” action. Add a route test
that asserts the 404 H1 is this plain text.

## Copy audit

Counts are whitespace-delimited. All landing and README sentences, meaningful
headings, and visitor-facing controls are included. No audited item exceeds 22
words, uses a banned marketing adjective, changes the product term, or has a
non-result-naming action. Reliance statements are covered by the named claim.

### Landing page

| Text | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | Pass |
| Comfort Card | 2 | Pass |
| Demo | 1 | Pass |
| Make a card | 3 | Pass |
| Privacy | 1 | Pass |
| A private game-motion plan | 4 | Pass |
| Plan game settings before motion sickness starts. | 7 | `core-card-workflow` |
| For players who feel sick from game motion; make a private settings plan and check in every 15 minutes. | 18 | `core-card-workflow`, `check-in-interval` |
| Try it with sample data | 5 | Pass |
| Opens a completed game card. | 5 | `core-card-workflow` |
| Make your own card | 4 | Pass |
| Free | 1 | `free-core-workflow` |
| Stored on this device | 4 | `local-persistence` |
| Works offline after the first visit | 6 | `offline-reload` |
| Read the 3-step guide | 4 | Pass |
| Stop playing when you feel unwell. | 6 | Safety guidance |
| Comfort Card is not medical advice. | 6 | `medical-scope` |
| It cannot tell you whether a game is safe or comfortable for you. | 13 | `medical-scope` |
| You can pause or stop at any time. | 8 | `check-in-interval` |
| No game cards yet | 4 | Pass |
| Start with the game you want to try. | 8 | Pass |
| Choose settings before you start playing. | 6 | `core-card-workflow` |
| Make your first card | 4 | Pass |
| Make a settings plan in three steps | 7 | Pass |
| Choose settings, check in, save notes. | 6 | `core-card-workflow` |
| Choose motion triggers | 3 | Pass |
| Select game effects that have made you feel sick. | 9 | Pass |
| Order your settings | 3 | Pass |
| Put settings in the order you want to try them. | 9 | `core-card-workflow` |
| Check in, or stop | 4 | Pass |
| Notice symptoms every 15 minutes. | 5 | `check-in-interval` |
| Pause or stop whenever you need. | 6 | `check-in-interval` |
| Saved on this device | 4 | `local-persistence` |
| Risograph illustration. | 2 | Pass; provenance is in `design.md` |
| No ads or trackers. | 4 | `local-private` |
| Built by Param Factory · Build polish-2 | 6 | Pass |

### README

| Text | Words | Result |
| --- | ---: | --- |
| Comfort Card is a private game-settings planner for players who get motion sick. | 12 | Pass |
| Make one card for each game. | 6 | `core-card-workflow` |
| List triggers, order settings, and record a 15-minute check-in. | 9 | `core-card-workflow`, `check-in-interval` |
| Live: motion-comfort-card.sociobot.in | 2 | Pass |
| Try the isolated sample at motion-comfort-card.sociobot.in/demo. | 6 | Pass |
| The demo opens a completed Harbor Signal card. | 8 | `core-card-workflow` |
| Demo changes disappear when you reload or leave. | 8 | `demo-isolation` |
| This tool helps you plan settings and record what you notice. | 11 | `core-card-workflow` |
| Comfort Card is not medical advice. | 6 | `medical-scope` |
| It cannot tell you whether a game is safe or comfortable for you. | 13 | `medical-scope` |
| Makes one card for each game and adds your usual comfortable play time. | 12 | `core-card-workflow` |
| Lets you choose and order common motion settings before saving. | 10 | `core-card-workflow` |
| Saves tried settings and play sessions in this browser. | 9 | `local-persistence` |
| Starts a 15-minute timer that you can pause or stop. | 10 | `check-in-interval` |
| Records symptom check-ins, familiar triggers, and optional private notes. | 9 | `core-card-workflow` |
| Exports a clean card without session history or notes. | 9 | `clean-share` |
| Exports and imports a full backup file. | 7 | `backup-restore` |
| Reopens the sample offline after the first visit. | 8 | `offline-reload` |
| No account, ads, analytics, or third-party scripts are used. | 9 | `local-private`, `free-core-workflow` |
| Cards remain in this browser unless you download, import, copy, or share them. | 13 | `local-persistence` |
| A clean card leaves out session dates, durations, symptom scores, and notes. | 12 | `clean-share` |
| A full backup contains those details, so treat it as private. | 11 | `backup-restore` |
| Read the privacy page and terms. | 6 | Pass |
| For developers, the requirements are Node.js 22 or newer and npm. | 10 | Developer instruction |
| Vite prints the local development URL. | 6 | Developer instruction |
| Service-worker behavior runs only in a production build. | 8 | `pwa-routing` |
| The browser suite uses Playwright 1.58.2. | 6 | Developer instruction |
| Install Chromium with npx playwright install chromium if needed. | 9 | Developer instruction |
| Run these commands to verify a clean production build. | 9 | Developer instruction |
| Deploy the contents of dist/ as a static site. | 9 | Deployment instruction |
| The host configuration maps product routes to the app and serves a styled 404 page. | 14 | `pwa-routing` |
| The versioned service worker caches the app shell and same-origin assets. | 11 | `pwa-routing` |

## Demo, sandbox, claims, and privacy

The home sample action reaches `/?demo=1` in one click. Direct `/demo` also
works and immediately shows the completed **Harbor Signal** card: PC platform,
four motion triggers, six ordered settings, two tried settings, and a finished
24-minute session with a 15-minute check-in. The persistent banner says “Demo
— sample data, nothing is saved” and has working Reset demo and Start for real
controls.

In a fresh direct demo context, `indexedDB.databases()` and localStorage were
empty. The exact `@claim:demo-isolation` test created a real card, changed and
reset the demo, and confirmed the real card was unchanged. A live request log
for the complete sample flow contained only the page, same-origin JS, and
same-origin CSS. A fresh live worker controlled `/demo`; after switching the
context offline, reload retained Harbor Signal and showed “Offline mode · your
saved cards still work”.

All eleven exact commands from `.factory/claims.json` passed independently in
the clean clone and in both Chromium and the 390px project:
`demo-isolation`, `core-card-workflow`, `local-private`, `clean-share`,
`check-in-interval`, `offline-reload`, `free-core-workflow`,
`local-persistence`, `backup-restore`, `medical-scope`, and `pwa-routing`.
Every ID has exactly one `@claim:<id>` test. No landing or README reliance
claim is unlisted.

## Earlier-history regression check

Read and checked `review-1.md`, `review-2.md`, `polish-1.md`, `polish-2.md`,
all three verification records, and the previous handoff. The historical
findings are fixed in live behavior and current code/tests.

| Earlier finding | Current confirmation |
| --- | --- |
| Review 1 B1, M1, M2, N2 | Plain audience/job copy, short README copy, concrete headings, and result-naming actions remain on the live product. |
| Review 1 B2, B4 | `/demo` and `?demo=1` are completed, memory-only sample entries with banner, Reset, Start for real, demo title, and offline support. |
| Review 1 B3; Review 2 F-2-1, F-2-2 | Eleven registry entries exist; each exact tagged test passed. Medical scope and PWA-routing claims cover the former gaps. |
| Review 1 M3, N1 | Metadata, legal routes, footer, social image, icons, sitemap, and styled HTTP 404 are live. |
| Review 1 M4 | The browser suite confirms route-change and Back focus/announcement behavior. |
| Verification 1 defects | Current tests cover malformed imports, recovery, baseline bounds, and a build-derived service-worker version. |
| Verification 2 defect | Live worker controls a fresh profile and completes an offline demo reload; its precache excludes deployment-only host configuration. |
| Verification 3 observation | Live responses now send a restrictive same-origin CSP. |

## Structure, accessibility, and visual review

- `/`, `/demo`, `/new`, `/demo/new`, `/privacy/`, and `/terms/` return 200.
  All rendered HTTP links resolve; `mailto:privacy@sociobot.in` is the only
  non-HTTP destination. The deliberate missing route returns HTTP 404.
- Each checked route has `lang=en`, one H1, `main`, a description, canonical,
  Open Graph/Twitter data, SVG favicon, and Apple touch icon. Route titles use
  the product pattern. Robots, sitemap, manifest, and security headers are
  live.
- `npm run test:a11y` passed 16/16. Cold mobile and desktop loads had no page
  errors, console errors, or horizontal overflow. The complete E2E suite
  passed (`test-results/.last-run.json`: `status: passed`).
- The warm paper, offset two-ink rules, printed edges, original controller and
  pause artwork, and matching 404 surface follow `design.md`; the product does
  not resemble a generic SaaS template.

## Missed leverage and AI check

The brief implies local planning, check-ins, clean sharing, and backup/restore;
all are present. Account sync would conflict with the stated local-first model.
AI would add data transfer to a small, deliberate checklist task without a
clear user benefit. No decorative AI feature, provider key, or AI claim was
found.

## Verification commands

From `/tmp/motion-comfort-card-review3.CSI6OB/repo`:

```sh
npm ci
npm test
npm run build
npm run test:a11y
npm run test:e2e
# plus each exact claim command in .factory/claims.json
```

`npm test` passed 6/6; `npm run build` produced `dist/` with 47.40 KB raw /
15.42 KB gzip initial JS; `npm run test:a11y` passed 16/16; and the complete
Playwright run passed.

## What would make this perfect

Replace the 404 H1 with “Page not found.” and add its direct assertion. Then
rerun the same cold live, sandbox, claim, and route review. No other product
change is indicated by this review.
