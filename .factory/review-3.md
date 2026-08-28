# Adversarial first-read review 3 — Comfort Card

**Verdict: PASS.** Reviewed 2026-08-28 against <https://motion-comfort-card.sociobot.in> from fresh Chromium contexts at 390 × 844 and 1440 × 900, and from a clean clone of `23b02ddfa48534c3a0051f8a04751add018887ea`.

There are zero findings. Every registered claim was run independently, and no landing-page or README reliance claim is unlisted.

## First 30 seconds

Before scrolling, both phone and desktop made all three required answers clear.

- **What it does:** Makes a game-specific settings plan and provides 15-minute symptom check-ins before motion sickness starts.
- **For whom:** “For players who feel sick from game motion”.
- **What to click first:** “Try it with sample data”; the adjacent result says “Opens a completed game card.”

The mobile first viewport contains the seven-word job headline, audience/outcome sentence, sample action, result, and three facts. It has no horizontal overflow (`390px` scroll width). No first-read blocker applies.

## Copy audit

Counts are whitespace-delimited. Controls and standalone headings are included because they are visitor copy. `Claim` names the registry entry that covers a reliance statement. No entry exceeds 22 words, uses a banned marketing adjective, relies on unexplained jargon, changes terminology, or uses a non-result-naming action.

### Landing page

| Text | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | Pass |
| Comfort Card | 2 | Pass |
| Demo | 1 | Pass |
| Make a card | 3 | Pass |
| Privacy | 1 | Pass |
| A private game-motion plan | 4 | Pass |
| Plan game settings before motion sickness starts. | 7 | Pass; `core-card-workflow` |
| For players who feel sick from game motion; make a private settings plan and check in every 15 minutes. | 18 | Pass; `core-card-workflow`, `check-in-interval` |
| Try it with sample data | 5 | Pass |
| Opens a completed game card. | 5 | Pass; `core-card-workflow` |
| Make your own card | 4 | Pass |
| Free | 1 | Pass; `free-core-workflow` |
| Stored on this device | 4 | Pass; `local-persistence` |
| Works offline after the first visit | 6 | Pass; `offline-reload` |
| Read the 3-step guide | 4 | Pass |
| Stop playing when you feel unwell. | 6 | Pass; safety guidance |
| Comfort Card is not medical advice. | 6 | Pass; `medical-scope` |
| It cannot tell you whether a game is safe or comfortable for you. | 13 | Pass; `medical-scope` |
| You can pause or stop at any time. | 8 | Pass; `check-in-interval` |
| No game cards yet | 4 | Pass |
| Start with the game you want to try. | 8 | Pass |
| Choose settings before you start playing. | 6 | Pass; `core-card-workflow` |
| Make your first card | 4 | Pass |
| Make a settings plan in three steps | 7 | Pass |
| Choose settings, check in, save notes. | 6 | Pass; `core-card-workflow` |
| Choose motion triggers | 3 | Pass |
| Select game effects that have made you feel sick. | 9 | Pass |
| Order your settings | 3 | Pass |
| Put settings in the order you want to try them. | 9 | Pass; `core-card-workflow` |
| Check in, or stop | 4 | Pass |
| Notice symptoms every 15 minutes. | 5 | Pass; `check-in-interval` |
| Pause or stop whenever you need. | 6 | Pass; `check-in-interval` |
| Saved on this device | 4 | Pass; `local-persistence` |
| Risograph illustration. | 2 | Pass; provenance is in `design.md` |
| No ads or trackers. | 4 | Pass; `local-private` |
| Built by Param Factory · Build polish-2 | 6 | Pass; build identifier |

### README

| Text | Words | Result |
| --- | ---: | --- |
| Comfort Card is a private game-settings planner for players who get motion sick. | 12 | Pass |
| Make one card for each game. | 6 | Pass; `core-card-workflow` |
| List triggers, order settings, and record a 15-minute check-in. | 9 | Pass; `core-card-workflow`, `check-in-interval` |
| Live: motion-comfort-card.sociobot.in | 2 | Pass |
| Try the isolated sample at motion-comfort-card.sociobot.in/demo. | 6 | Pass |
| The demo opens a completed Harbor Signal card. | 8 | Pass; `core-card-workflow` |
| Demo changes disappear when you reload or leave. | 8 | Pass; `demo-isolation` |
| This tool helps you plan settings and record what you notice. | 11 | Pass; `core-card-workflow` |
| Comfort Card is not medical advice. | 6 | Pass; `medical-scope` |
| It cannot tell you whether a game is safe or comfortable for you. | 13 | Pass; `medical-scope` |
| Makes one card for each game and adds your usual comfortable play time. | 12 | Pass; `core-card-workflow` |
| Lets you choose and order common motion settings before saving. | 10 | Pass; `core-card-workflow` |
| Saves tried settings and play sessions in this browser. | 9 | Pass; `local-persistence` |
| Starts a 15-minute timer that you can pause or stop. | 10 | Pass; `check-in-interval` |
| Records symptom check-ins, familiar triggers, and optional private notes. | 9 | Pass; `core-card-workflow` |
| Exports a clean card without session history or notes. | 9 | Pass; `clean-share` |
| Exports and imports a full backup file. | 7 | Pass; `backup-restore` |
| Reopens the sample offline after the first visit. | 8 | Pass; `offline-reload` |
| No account, ads, analytics, or third-party scripts are used. | 9 | Pass; `local-private`, `free-core-workflow` |
| Cards remain in this browser unless you download, import, copy, or share them. | 13 | Pass; `local-persistence` |
| A clean card leaves out session dates, durations, symptom scores, and notes. | 12 | Pass; `clean-share` |
| A full backup contains those details, so treat it as private. | 11 | Pass; `backup-restore` |
| Read the privacy page and terms. | 6 | Pass |
| For developers, the requirements are Node.js 22 or newer and npm. | 10 | Pass; developer instruction |
| Vite prints the local development URL. | 6 | Pass; developer instruction |
| Service-worker behavior runs only in a production build. | 8 | Pass; `pwa-routing` |
| The browser suite uses Playwright 1.58.2. | 6 | Pass; developer instruction |
| Install Chromium with npx playwright install chromium if needed. | 9 | Pass; developer instruction |
| Run these commands to verify a clean production build. | 9 | Pass; developer instruction |
| Deploy the contents of dist/ as a static site. | 9 | Pass; deployment instruction |
| The host configuration maps product routes to the app and serves a styled 404 page. | 14 | Pass; `pwa-routing` |
| The versioned service worker caches the app shell and same-origin assets. | 11 | Pass; `pwa-routing` |

## Demo, privacy, offline, and claims

The first-screen action opened `/?demo=1` in one click. The first resulting screen was the completed **Harbor Signal** card: PC platform, four named motion triggers, six ordered settings, two settings already tried, and a completed 24-minute session with a check-in. The persistent banner read “Demo — sample data, nothing is saved”, with working **Reset demo** and **Start for real** controls.

A fresh direct `/demo` context had no IndexedDB database and no localStorage keys. The isolation test created a real card, changed and reset the demo, and confirmed the real card remained unchanged. The privacy test intercepted the complete sample flow and allowed only same-origin requests. A fresh live service worker controlled `/demo`; after `context.setOffline(true)`, reloading kept Harbor Signal and displayed “Offline mode · your saved cards still work”.

All eleven commands from `.factory/claims.json` passed independently in the clean clone, in Chromium and the 390px project: `demo-isolation`, `core-card-workflow`, `local-private`, `clean-share`, `check-in-interval`, `offline-reload`, `free-core-workflow`, `local-persistence`, `backup-restore`, `medical-scope`, and `pwa-routing`.

Each claim ID appears exactly once as an `@claim:<id>` test. No claim failed, and no landing or README reliance statement lacks a covering registry entry.

## Earlier-history regression check

Read and rechecked: `review-1.md`, `review-2.md`, `polish-1.md`, `polish-2.md`, all three verification records, and the previous handoff.

| Earlier finding | Live and code confirmation |
| --- | --- |
| B1 | The cold first screen plainly names the job, audience, action, result, and facts at 390px and desktop. |
| B2 | `/demo` and `?demo=1` are in-memory sample entries with a completed card, persistent banner, Reset, and Start for real. |
| B3 | The registry has eleven entries, each with one matching tagged test; every exact command passed. |
| B4 | Direct `/demo` has its sample card, title, canonical URL, and offline service-worker coverage. |
| M1 | Landing headings and actions use concrete game-motion language; no earlier metaphor-led task wording remains. |
| M2 | Player-facing README copy stays within the cap and uses “this browser” and “backup file” terminology. |
| M3 | Routes have title, description, canonical, OG/Twitter data, favicon/touch icon, sitemap entry, and a styled HTTP 404. |
| M4 | Internal route changes and browser Back focus the destination h1 and announce its text through a polite live region. |
| N1 | The shared header has Demo, Make a card, Privacy; the footer has Privacy, Terms, Param Factory credit, and a build identifier. |
| N2 | “Read the 3-step guide” and “Make a card” name their outcomes. |
| Verification 1 | Validation/recovery tests, app-level baseline limit, and build-derived PWA version remain in the suite and build. |
| Verification 2 | The live worker installs and controls a fresh context; its precache excludes the deployment-only host configuration. |

## Structure, accessibility, and visual check

- `/`, `/demo`, `/privacy/`, `/terms/`, direct `/demo/card/demo-harbor-signal`, and the missing route were checked. Valid routes return 200; the missing route returns a styled HTTP 404.
- Route titles follow the product pattern. Each has one h1, `lang=en`, a main landmark, route description, canonical, OG/Twitter metadata, SVG favicon, and Apple touch icon.
- Every rendered internal link from home, demo, Privacy, Terms, and 404 returned 200. The only non-HTTP destination is the privacy `mailto:` link.
- The live home response sends same-origin CSP, `nosniff`, strict referrer policy, HSTS, and a restrictive permissions policy. `robots.txt` and `sitemap.xml` are present and list the four public routes.
- `npm run test:a11y` passed 16/16. Fresh mobile and desktop cold loads had no product console or page errors and no horizontal overflow.
- The warm-paper, two-ink risograph field-note surface, clipped rules, printed offset edges, controller/pause artwork, and product-specific 404 match `design.md`. This is not a generic SaaS template.

## Missed leverage and AI check

The brief calls for local game-specific planning, check-ins, sharing, and offline use. The product provides the implied clean share and full backup import/export. Account sync would weaken the stated local-first privacy model, and AI would not improve the small, deliberate checklist task enough to justify data transmission or a decorative feature. No AI runtime, provider key, or AI claim was found.

## What would make this perfect

No additional feature, copy, or structural change is indicated by this review. Keep the existing clean-clone claim commands and cold live checks in the release process so the current zero-finding state remains verifiable.
