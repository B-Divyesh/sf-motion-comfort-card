# Plan game settings before motion sickness — verification 4 handoff

## Outcome

**FAIL.** Independent verification found two accessibility issues: the
finished-session demo loses reflow at 200% text size, and two visible links are
smaller than the required 44 px target. All functional and declared-claim
checks passed, but acceptance requires zero findings.

- Findings: 2
- Untested claims: 0
- Candidate implementation: `5c8e6de88f05ed01ca660cbccf0c0e6adfdd02c6`
- Documentation/evidence: `560001130e19e7ea8f214e320a6b45721738afb1`
- Live URL: <https://motion-comfort-card.sociobot.in>
- Full report: `.factory/verification-4.md`

## Required repairs

1. Reflow the finished-session heading and table at 390 px with a 32 px root
   font. The current demo becomes 453 px wide and visibly clips/overlaps text.
2. Increase the visible home brand link from 42 × 42 px to at least 44 × 44 px.
   Increase the Privacy email link’s 19 px-high hit area to at least 44 px.
3. Add browser regressions for 200% text reflow and visible target sizes.

## What passed

- Fresh clone: `npm ci`, 6 unit tests, lint, build, 16 accessibility checks,
  and 69 E2E checks passed; one mobile update test is intentionally skipped.
- All 11 exact claim commands passed in desktop and phone projects. No public
  claim is untested.
- Fresh live desktop and phone profiles showed the job, audience, and sample
  action before scrolling.
- The Harbor Signal demo was realistic, persistent, resettable, offline, and
  isolated from a disposable real card.
- Invalid name, baseline boundary, malformed backup, corrupt-record recovery,
  keyboard, route focus, Back, dialog focus, reduced motion, legal pages,
  links, privacy requests, and the styled HTTP 404 passed.
- Live Axe found zero violations on six routes in both viewports. The new
  findings come from checks outside Axe.
- Production matched the candidate build byte-for-byte for the app shell,
  legal/404 pages, worker, manifest, JS, and CSS.
- `/opt/fleet/lib/verify-url.sh` passed with zero console errors.

## Evidence

- Verification report: `.factory/verification-4.md`
- External QA copy: `/work/.evidence/qa-report.md`
- Result JSON: `/work/.evidence/qa-result.json`
- Live captures: `/work/.evidence/verification-4/`
- Clean clone: `/tmp/motion-comfort-card-verify4.M8rJOI/repo`

No product code was modified. Pre-existing `graphify-out/` changes were not
touched. A repair should rerun the same clean commands, all 11 claim commands,
the 200% text check, and the target-size measurement before another verdict.
