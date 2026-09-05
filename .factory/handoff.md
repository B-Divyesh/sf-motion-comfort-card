# Repair 3 handoff — Comfort Card

## Outcome

**PASS.** Repair 3 closes the only open finding from review 3 (`F-3-1`). The
styled HTTP 404 now gives screen-reader users the standalone H1 **“Page not
found.”** It keeps the product-specific risograph 404 surface and the
“Return to your cards” action.

Implementation commit: `5c8e6de88f05ed01ca660cbccf0c0e6adfdd02c6`

The implementation commit was pushed to `origin/main` and deployed as the
static product at <https://motion-comfort-card.sociobot.in>. The live missing
route returned HTTP 404 and rendered the new H1 from a fresh browser.

## Change made

- Replaced the metaphorical generic-page 404 H1, “This page is not in the
  drawer.”, with “Page not found.”
- Updated the normal route test and the production PWA-routing claim test to
  verify the visible H1 outcome on a missing URL. These are browser-level
  checks of what a visitor receives, rather than source-string checks.
- Kept card-specific missing messages unchanged; they already name the
  missing game card plainly.

## Clean verification

From clean clone `/tmp/motion-comfort-card-repair3.9U4xx3` at the
implementation commit:

```sh
npm ci
npm test
npm run lint
npm run build
npm run test:a11y
npm run test:e2e
# then every exact command in .factory/claims.json
```

- `npm ci`: installed the locked 61 packages with 0 reported vulnerabilities.
- `npm test`: 6/6 passed.
- `npm run lint`: passed.
- `npm run build`: passed, created `dist/`, and verified build-derived PWA
  version `comfort-card-c8fb94c808f8`. Initial JS was 47.38 KB raw / 15.41 KB
  gzip; CSS was 27.22 KB raw / 6.53 KB gzip.
- `npm run test:a11y`: 16/16 passed.
- `npm run test:e2e`: 69 passed; the one mobile service-worker update test is
  intentionally skipped because the update transition runs once in desktop.
- Each of the 11 listed claim commands passed independently in desktop and
  390px projects: `demo-isolation`, `core-card-workflow`, `local-private`,
  `clean-share`, `check-in-interval`, `offline-reload`, `free-core-workflow`,
  `local-persistence`, `backup-restore`, `medical-scope`, and `pwa-routing`.

## Live production verification

Fresh HTTPS desktop (1440 × 900) and phone (390 × 844) contexts both showed,
before scrolling:

- Job: “Plan game settings before motion sickness starts.”
- Audience: players who feel sick from game motion.
- First action: “Try it with sample data.”

Both contexts opened the completed Harbor Signal sample in one click, showed
the persistent “Demo — sample data, nothing is saved” label, changed and reset
a sample setting, and confirmed Start for real retained only the separate real
card. Fresh controlled service workers reloaded the demo offline in both
contexts. Their complete request logs stayed same-origin, with no page or
console errors on normal routes.

The live pass also rejected a 601-minute baseline, saved 600 after correction,
rejected a malformed backup, quarantined and removed a legacy malformed card,
and checked Privacy, Terms, and the styled deliberate HTTP 404. The expected
browser console note for the deliberately HTTP-404 document was classified as
expected; the page itself rendered normally with the correct title, H1, and
return action.

- `/opt/fleet/lib/verify-url.sh`: passed; 629 ms load, title/lang/one H1/main,
  image alt text, and zero console errors. Evidence:
  `.factory/evidence/repair-3/live/home/`.
- Live Axe: zero violations on `/`, `/demo`, `/privacy/`, `/terms/`, and the
  missing route at desktop and phone sizes (10/10 checks).
- Mobile Lighthouse: performance 98, accessibility 100, LCP 1,889 ms, CLS 0,
  total blocking time 137 ms. Report:
  `.factory/evidence/repair-3/live/lighthouse.json`.

The plain verb-first catalog description remains 96 characters and was copied
unchanged to `/work/.evidence/catalog-description.txt` as required.

## Earlier finding disposition

| Record | Current disposition |
| --- | --- |
| Review 1 B1–B4, M1–M4, N1–N2 | Still covered by the current plain first screen, isolated demo, claims registry, metadata/404, route-focus, and browser checks. |
| Verification 1 | Malformed imports, corrupt-record recovery, baseline bounds, and build-derived PWA versions remain covered by regression tests and the live recovery pass. |
| Verification 2 | The live controlled-worker offline demo reload passed; the worker excludes deployment-only host configuration. |
| Verification 3 | Same-origin CSP and response policy remain live; no regression was found. |
| Review 2 F-2-1/F-2-2 | Medical-scope and PWA-routing claims remain registered and independently passing. |
| Review 3 F-3-1 | Closed by the plain 404 H1 and two browser-visible route assertions. |

## Known gaps and next steps

No known product gaps remain. The pre-existing modified `graphify-out/` files
were intentionally left untouched. No credentials were committed or reported.
