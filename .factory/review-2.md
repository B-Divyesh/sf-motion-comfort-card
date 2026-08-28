# Adversarial first-read review 2 — Comfort Card

**Verdict: FAIL.** Reviewed 2026-08-28 against
<https://motion-comfort-card.sociobot.in> in fresh Chromium contexts at 390 ×
844 and 1440 × 900, and against a fresh local clone of commit `f0ceded`.

There are no usability, demo, routing, accessibility, visual-identity, or
registered-claim failures. Two minor claim-registry gaps remain. The required
verdict is therefore FAIL: PASS requires zero findings.

## First 30 seconds

Before scrolling, the product is clear on both phone and desktop:

- **What it does:** It helps someone make a game-specific ordered settings
  plan and use 15-minute symptom check-ins before motion sickness starts.
- **For whom:** “For players who feel sick from game motion”.
- **What to click first:** “Try it with sample data”; the adjacent text says
  “Opens a completed game card.”

The visible headline is “Plan game settings before motion sickness starts.”
It is seven words, names the job, and is supported by an 18-word audience and
outcome sentence. The action, three facts, and stop guidance fit in the first
390px screen. No blocking first-read finding.

## Findings

### Minor F-2-1 — The non-medical/safety statement is an unlisted claim and uses two different terms

**Locations and exact quotes:**

- Landing hero: “This planning tool is not medical advice or a promise that a
  game will feel safe.”
- README, introduction: “It is not medical advice or a safety rating.”

**Why this is a finding:** These are important honesty statements a visitor
could rely on, but no `claims.json` entry names or tests them. They also use
two different descriptions of the same limitation: “promise that a game will
feel safe” and “safety rating”. A future copy change could weaken the required
non-medical scope without a claim-level regression test.

**Concrete fix:** Use the same plain sentence on both surfaces, for example:
“Comfort Card is not medical advice. It cannot tell you whether a game is safe
or comfortable for you.” Add a `medical-scope` claim, list both locations, and
add a Playwright copy-policy test that verifies the exact limitation on the
landing page and README-facing content/terms route.

### Minor F-2-2 — Three README technical reliance claims are not listed in `claims.json`

**Location and exact quotes:** README, Run locally/Deploy:

- “Service-worker behavior runs only in a production build.”
- “The host configuration maps product routes to the app and serves a styled
  404 page.”
- “The versioned service worker caches the app shell and same-origin assets.”

**Why this is a finding:** These are factual promises in the public README.
The existing `offline-reload` claim proves one offline outcome, but the
registry does not list these statements or identify their tests. The
cross-check required for README claims is therefore incomplete.

**Concrete fix:** Either remove implementation-detail promises from the
visitor README, or add a `pwa-routing` claim with a production-build test that
checks a controlled worker, offline reload, direct routes, and the styled 404.
List these README locations in that claim.

## Copy audit

Counts are whitespace-delimited. The landing audit includes all meaningful
sentences and short reader-facing headings/actions; navigation labels are not
sentences. No item exceeds 22 words. `U` denotes the unlisted claim in F-2-1;
otherwise there is no jargon, marketing-adjective, incoherent-heading, or
non-result-naming-button flag.

### Landing page

| Text | Words | Result |
| --- | ---: | --- |
| A private game-motion plan | 4 | Pass |
| Plan game settings before motion sickness starts. | 7 | Pass |
| For players who feel sick from game motion; make a private settings plan and check in every 15 minutes. | 18 | Pass |
| Try it with sample data | 5 | Pass |
| Opens a completed game card. | 5 | Pass |
| Make your own card | 4 | Pass |
| Free | 1 | Pass |
| Stored on this device | 4 | Pass |
| Works offline after the first visit | 6 | Pass |
| Read the 3-step guide | 4 | Pass |
| Stop playing when you feel unwell. | 6 | Pass |
| This planning tool is not medical advice or a promise that a game will feel safe. | 15 | U → F-2-1 |
| You can pause or stop at any time. | 8 | Pass |
| No game cards yet | 4 | Pass |
| Start with the game you want to try. | 8 | Pass |
| Choose settings before you start playing. | 6 | Pass |
| Make your first card | 4 | Pass |
| Make a settings plan in three steps | 7 | Pass |
| Choose settings, check in, save notes. | 6 | Pass |
| Choose motion triggers | 3 | Pass |
| Select game effects that have made you feel sick. | 9 | Pass |
| Order your settings | 3 | Pass |
| Put settings in the order you want to try them. | 9 | Pass |
| Check in, or stop | 4 | Pass |
| Notice symptoms every 15 minutes. | 5 | Pass |
| Pause or stop whenever you need. | 6 | Pass |
| Saved on this device | 4 | Pass |
| Plan game settings before motion sickness starts. | 7 | Pass |
| Risograph illustration. | 2 | Pass (visual provenance is in `design.md`) |
| No ads or trackers. | 4 | Pass (`local-private`) |
| Built by Param Factory | 4 | Pass |

### README

| Text | Words | Result |
| --- | ---: | --- |
| Comfort Card is a private game-settings planner for players who get motion sick. | 12 | Pass |
| Make one card for each game. | 6 | Pass |
| List triggers, order settings, and record a 15-minute check-in. | 9 | Pass |
| Try the isolated sample at motion-comfort-card.sociobot.in/demo. | 6 | Pass |
| The demo opens a completed Harbor Signal card. | 8 | Pass |
| Demo changes disappear when you reload or leave. | 8 | Pass (`demo-isolation`) |
| This tool helps you plan settings and record what you notice. | 11 | Pass (`core-card-workflow`) |
| It is not medical advice or a safety rating. | 9 | U → F-2-1 |
| Makes one card for each game and adds your usual comfortable play time. | 12 | Pass |
| Lets you choose and order common motion settings before saving. | 10 | Pass |
| Saves tried settings and play sessions in this browser. | 9 | Pass |
| Starts a 15-minute timer that you can pause or stop. | 10 | Pass |
| Records symptom check-ins, familiar triggers, and optional private notes. | 9 | Pass |
| Exports a clean card without session history or notes. | 9 | Pass |
| Exports and imports a full backup file. | 7 | Pass |
| Reopens the sample offline after the first visit. | 8 | Pass |
| No account, ads, analytics, or third-party scripts are used. | 9 | Pass |
| Cards remain in this browser unless you download, import, copy, or share them. | 13 | Pass |
| A clean card leaves out session dates, durations, symptom scores, and notes. | 12 | Pass |
| A full backup contains those details, so treat it as private. | 11 | Pass |
| Read the privacy page and terms. | 6 | Pass |
| Vite prints the local development URL. | 6 | Pass |
| Service-worker behavior runs only in a production build. | 8 | U → F-2-2 |
| Install Chromium with npx playwright install chromium if needed. | 9 | Pass (developer instruction) |
| Run these commands to verify a clean production build. | 9 | Pass |
| Deploy the contents of dist/ as a static site. | 9 | Pass (developer instruction) |
| The host configuration maps product routes to the app and serves a styled 404 page. | 14 | U → F-2-2 |
| The versioned service worker caches the app shell and same-origin assets. | 11 | U → F-2-2 |

## Demo, claims, privacy, and offline verification

The one-click home action opened `/?demo=1`, focused the `Harbor Signal` h1,
and immediately rendered an in-use card: named game, four motion triggers,
six ordered settings, two tried settings, and one completed 24-minute session
with a check-in. The persistent banner reads “Demo — sample data, nothing is
saved”; Reset demo and Start for real are present. A fresh direct `/demo`
context reported no IndexedDB databases before leaving demo. The clean-clone
`@claim:demo-isolation` test also created a real card, changed/reset/reloaded
the demo, and confirmed that real card remained intact.

All nine commands listed in `.factory/claims.json` passed independently from a
fresh clone, in Chromium and 390px projects:

| Claim | Result |
| --- | --- |
| `demo-isolation` | Pass |
| `core-card-workflow` | Pass |
| `local-private` | Pass |
| `clean-share` | Pass |
| `check-in-interval` | Pass |
| `offline-reload` | Pass |
| `free-core-workflow` | Pass |
| `local-persistence` | Pass |
| `backup-restore` | Pass |

The privacy test intercepted the complete demo flow and allowed only the
same-origin local server. A separate fresh live browser context installed and
was controlled by the live service worker; after `context.setOffline(true)`,
reload retained the Harbor Signal card and showed the offline banner. No page
or console errors occurred in cold phone or desktop loads.

## Earlier-history regression check

Read: `review-1.md`, `polish-1.md`, all three independent verification
records, and the prior handoff. Each review finding is fixed in both the
shipped behavior and source/tests:

| Earlier ID | Confirmed current evidence |
| --- | --- |
| B1 | Plain audience/job headline and primary sample action are visible before scroll at 390px and desktop. |
| B2 | `/demo` and `?demo=1` are memory-only sample entries with banner, Reset, Start for real, and completed data. |
| B3 | Nine manifest entries each have one `@claim:` Playwright test; all passed from a fresh clone. |
| B4 | `/demo` has Demo title/canonical/sample card and is in the sitemap. |
| M1 | Landing headings/actions use concrete game-motion wording; copy audit has no banned marketing language. |
| M2 | README player copy is under the 22-word cap and uses “saved in this browser” / “backup file”. |
| M3 | Live routes expose titles, descriptions, canonical, OG/Twitter metadata, favicon and Apple touch icon; unknown URL is a styled 404. |
| M4 | Sample navigation and browser Back both focus the destination h1; the live region is populated by the route name. |
| N1 | Header has Demo, Make a card, Privacy; footer has Privacy, Terms, Param Factory, and build id. |
| N2 | “Read the 3-step guide” and “Make a card” name their outcomes. |

Earlier verification defects were also rechecked: malformed backups and
out-of-range baselines have regression tests, the build creates a derived PWA
version, and the live worker is installed/controlling/offline-capable. The
former CSP observation is no longer current: live responses send a restrictive
same-origin CSP.

## Structure, accessibility, and visual review

- Link crawl: every rendered internal link from home, demo, Privacy, Terms,
  and the 404 either returned 200 or was the expected 404 test route; the only
  non-HTTP link is `mailto:privacy@sociobot.in`.
- `/`, `/demo`, `/privacy/`, `/terms/`, and the 404 each have one h1, main,
  header/footer, route title, description, canonical, OG/Twitter title, and
  `lang=en`. The home title is “Comfort Card — plan settings for motion
  sickness”; legal/demo routes use their page-name pattern.
- Fresh 390px and desktop loads had no horizontal overflow or console/page
  errors. `npm run test:a11y` passed 16/16 Axe/browser checks from the clean
  clone.
- The warm paper, clipped rules, offset ink, risograph controller/pause art,
  and low-glare two-ink palette are distinct and match `design.md`; this is not
  a generic SaaS template.
- The brief does not imply a missing AI, account sync, import format, or paid
  feature. Backup/import, clean sharing, offline sample, and the practical
  non-AI planning workflow are already present. No decorative AI feature or
  embedded provider key was found.

## What would make this perfect

Close F-2-1 and F-2-2 by making every factual public statement traceable to a
single claims entry and executable test, then rerun this same full cold-start
review. No product interaction or visual change is otherwise indicated.

## Commands run

From a fresh clone:

```sh
npm ci
npm test
npm run build
npm run test:a11y
# and each exact npm run test:e2e -- --grep @claim:<id> command in claims.json
```

`npm test` passed 6/6, `npm run build` produced `dist/`, and `npm run test:a11y`
passed 16/16. All nine independently invoked claim commands passed.
