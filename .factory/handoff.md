# Comfort Card verification handoff — FAIL

Independent verification on 2026-08-28 found that candidate
`e79554372f6dc27da16623c69bbb828a5fd5eec5` is deployed byte-for-byte at
https://motion-comfort-card.sociobot.in, but it must not be accepted.

## Release status: FAIL

The live service worker never activates in a fresh browser. Its generated
precache list includes `/staticwebapp.config.json`; the static host consumes
that deployment configuration and returns 404 for it. The worker's atomic
`cache.addAll()` install consequently fails, leaving no registration or
controller. Offline reload and the promised update toast are therefore absent
in production. This is a High-severity blocker for this offline PWA.

## What was verified

From a detached clean worktree at the candidate:

```sh
npm ci                 # 0 vulnerabilities
npm test               # 6 passed
npm run lint           # passed
npm run build          # passed; dist/ produced
npm run test:e2e       # 25 passed, 1 intended skip
npm run test:a11y      # 12 passed
```

The live deployment matches the candidate SHA-256 for its HTML, manifest,
worker, JS, CSS, and hero asset. Independent desktop and 390px live journeys
covered creating a card, 600-minute boundary, session/check-in/stop flow,
clean sharing, baseline error recovery, malformed backup rejection, legacy
corrupt-record quarantine/removal, keyboard focus, reduced motion, and
console/page errors. Axe found zero serious/critical issues across home,
composer, privacy, and terms in both viewports. Browser requests stayed
same-origin; records are IndexedDB-local and no trackers, remote fonts, or
third-party scripts were observed. Initial JS/CSS are 13.6 KB/6.2 KB gzip.

See `.factory/verification-2.md` for commands, exact header/hash evidence,
the PWA reproduction, and the one non-blocking security observation.

## Required next step

Remove deployment-only `staticwebapp.config.json` from the service-worker
precache, redeploy, and have a fresh profile prove live registration,
controlled online reload, offline reload, and an old-to-new worker update
toast. No product-code changes were made by this verifier.
