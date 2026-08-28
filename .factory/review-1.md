# Adversarial first-read review 1 — Comfort Card

**Verdict: FAIL.** Live site reviewed 2026-08-28 in fresh Chromium contexts at
390 × 844 and 1440 × 900. Four BLOCKING findings prevent acceptance.

## First 30 seconds

I could infer a game-settings planner with 15-minute check-ins and identify
“Make a comfort card” as the first action. I could not identify who it is for.
The first screen says:

> “Find a steadier way into the game.”
>
> “Build a personal list of visual settings to try, then use gentle 15-minute
> check-ins to notice how the session is going.”

Neither line names players with motion sickness, or an equally concrete
situation. A visitor could take this for a general performance or accessibility
tool. This is a BLOCKING first-screen failure. Both cold loads had one h1 and
no console or page errors.

## Findings, ordered by severity

### BLOCKING B1 — The hero does not name the audience or job plainly

**Quote:** “Find a steadier way into the game.”

**Why a visitor is lost:** “Steadier” is a metaphor and “personal list” does
not say who needs it. A visitor cannot confirm relevance before creating a
health-related personal record.

**Concrete fix:** Use **“Plan game settings before motion sickness starts.”**
Then: **“For players who feel sick from game motion; make a private settings
plan and check in every 15 minutes.”** Place facts beside it: “Free,” “Stored
on this device,” and, only after proof, “Works offline after the first visit.”

### BLOCKING B2 — There is no one-click, isolated sample-data demo

**Evidence:** The first screen has no “Try it with sample data” action. “Make
a comfort card” opens a blank form. Fresh visits to /demo and /?demo=1 both
returned 200 but rendered the empty home hero, zero game cards, and no “Demo
— sample data,” “Reset demo,” or “Start for real” control. Both contexts
opened the normal comfort-card-local IndexedDB database. No .factory/demo.md
exists.

**Why a visitor is lost or misled:** They must enter their own data before
seeing the product in use. There is no way to verify demo isolation, Reset, or
offline demo behavior.

**Concrete fix:** Add a hero **“Try it with sample data”** action. Make /demo
(or ?demo=1) immediately show a realistic completed game card: named game,
motion triggers, ordered settings, and a completed check-in. Show a persistent
“Demo — sample data, nothing is saved” banner with “Reset demo” and “Start for
real.” Use a separate demo: storage namespace; never read/write real records in
demo. Add .factory/demo.md and tests proving real records remain unchanged after
demo use, Reset, and offline reload.

### BLOCKING B3 — Claims registry and claim tests are missing

**Evidence:** .factory/claims.json is absent. There are no @claim: tags in the
test suite, so there were no listed claim commands to run. npm test passed 6/6,
npm run build passed, and the complete npm run test:e2e records
{"status":"passed"} in test-results/.last-run.json; this does not replace a
claims manifest and demo-only sandbox tests.

**Why a visitor is lost or misled:** Privacy, offline use, clean sharing, and
15-minute behavior are reliance claims that cannot be traced to a reproducible
sandbox assertion.

**Concrete fix:** Add one claims entry and one @claim:<id> test per retained
claim, each starting in a fresh /demo context. Test local-only storage,
same-origin-only traffic for the full demo flow, clean-export exclusions,
15-minute check-ins, and offline reload. Remove unprovable promises.

**Unlisted claim-like sentences (the registry has no entries at all):**

| Location | Exact sentence or claim |
| --- | --- |
| Landing | “Build a personal list of visual settings to try, then use gentle 15-minute check-ins to notice how the session is going.” |
| Landing | “This is a personal planning tool, not medical advice or a promise that a game will feel safe.” |
| Landing | “Make a short settings plan now, so you do not have to hunt through menus once play begins.” |
| Landing | “Mark the visual patterns you already know, without needing to diagnose anything.” |
| Landing | “Put the most promising game options first and check them off as you try them.” |
| Landing | “Notice symptoms every 15 minutes. Pause or stop at any time—no streaks, pressure, or scoring.” |
| Landing | “Your cards stay in this browser unless you export them.” |
| Landing | “Original AI-generated risograph artwork · no trackers or ads.” |
| README | “Comfort Card is a private, offline-first field note for players who experience motion sickness in games.” |
| README | “It turns scattered settings advice into a game-specific plan: note familiar motion triggers, order the settings to try, record 15-minute symptom check-ins, and keep what helped.” |
| README | “This is a planning and self-advocacy tool.” |
| README | “It is not medical advice, a compatibility rating, or a promise that a setting will make a game safe or comfortable.” |
| README | All eight What it does bullets: card, checklist, IndexedDB sessions, timer, check-ins, clean export, JSON backup, and PWA offline reload. |
| README | “There is no account, server-side database, analytics, advertising, remote font, or third-party runtime script.” |
| README | “Cards remain in the browser unless the user explicitly downloads, imports, copies, or shares them.” |
| README | “A clean shared card omits session dates, durations, symptom scores, and notes; a full backup includes them and should be treated as private.” |
| README | “The service worker precaches the app shell and uses same-origin runtime caching for built assets.” |

Cold-page request capture contained same-origin traffic only, but this is not
the required interception test of a complete demo flow.

### BLOCKING B4 — /demo falsely succeeds as the home page

**Evidence:** GET /demo returns 200, uses the home title, and renders “Find a
steadier way into the game.” rather than a demo, demo title, or sample data.

**Why a visitor is lost or misled:** A catalog or verifier link silently drops
the requested state.

**Concrete fix:** Implement B2’s real demo, title it “Demo — Comfort Card,”
add it to the sitemap, and test direct load, reload, Back, and offline load.

### Major M1 — Metaphors and jargon add interpretation work

**Quotes:** “A before-you-play field note,” “Your drawer is empty,” “Three
small moves,” “Name the motion,” “Plan, notice, keep what helped,” and “Local
by design.”

**Why a visitor is lost:** These headings do not stand alone as a game
motion-sickness planner.

**Concrete fixes:** Use “A private game-motion plan,” “No game cards yet,”
“Make a settings plan in three steps,” “Choose motion triggers,” “Choose
settings, check in, save notes,” and “Saved on this device.”

### Major M2 — README has overlong and technical player copy

**Quote:** “It turns scattered settings advice into a game-specific plan: note
familiar motion triggers, order the settings to try, record 15-minute symptom
check-ins, and keep what helped.” (26 words; cap is 22)

**Why a visitor is lost:** It is hard to scan, and “offline-first,” “IndexedDB,”
“PWA,” and “JSON” do not say plainly what happens to information.

**Concrete fix:** “Make one card for each game. List triggers, order settings
to try, and record a 15-minute check-in.” Use “saved in this browser,”
“installable app,” and “backup file” in player copy.

### Major M3 — Metadata and not-found routing are incomplete

**Evidence:** Legal routes have appropriate titles and one h1. All checked live
routes lack canonical, Open Graph, Twitter, and Apple-touch metadata.
/definitely-missing returns 200 and the home hero, not a designed 404. The
sitemap has no Demo route.

**Why a visitor is lost or misled:** Shared links lack a product preview and a
mistyped deep link masquerades as the home page.

**Concrete fix:** Add route-specific canonical/OG/Twitter/Apple-touch metadata,
a designed 404 with a way home, and valid demo/404 route tests.

### Major M4 — Route changes leave keyboard focus on BODY

**Evidence:** Selecting “Make a comfort card” changed the h1 to “Make a comfort
card.” but left document.activeElement at BODY. Browser Back restored home with
focus still on BODY; the only aria-live region was an empty toast.

**Why a visitor is lost:** Keyboard and screen-reader users are not told that
the view changed or placed at its heading.

**Concrete fix:** On every route change focus the new h1 with temporary
tabindex=-1 and announce it in a polite live region. Test forward/Back focus
and scroll restoration.

### Minor N1 — Shared navigation/footer requirements are incomplete

**Evidence:** Header links are “New card,” “Back up,” and “Import”; it has no
Demo or Privacy link. The consistent footer has Privacy and Terms but lacks
“Built by Param Factory” and a version/build identifier.

**Concrete fix:** Use the four-link header limit for Demo, the key action, and
Privacy; add the factory credit and build id to the footer.

### Minor N2 — A visible action does not name its result

**Quote:** “See how it works.”

**Why a visitor is lost:** It does not say it scrolls to a three-step guide.

**Concrete fix:** Use **“Read the 3-step guide.”** Change “New card” to
**“Make a card.”**

## Copy audit

Counts use visible whitespace-delimited words. Headings, controls, and labels
are included because visitors read them; decorative arrow and numeric step
markers are omitted. J = jargon/metaphor/ambiguous; A = marketing adjective;
B = non-result button; >22 = hard-cap failure.

### Landing page

| Text | Words | Flag and proposed rewrite |
| --- | ---: | --- |
| Skip to main content | 4 | — |
| CC | 1 | — |
| New card | 2 | B → “Make a card” |
| Back up | 2 | — |
| Import | 1 | — |
| A before-you-play field note | 4 | J → “A private game-motion plan” |
| Find a steadier way into the game. | 7 | J/A → B1 rewrite |
| Build a personal list of visual settings to try, then use gentle 15-minute check-ins to notice how the session is going. | 20 | A/J → B1 rewrite |
| Make a comfort card | 4 | — |
| See how it works | 4 | B → “Read the 3-step guide” |
| Your comfort is the stop signal. | 6 | J → “Stop playing when you feel unwell.” |
| This is a personal planning tool, not medical advice or a promise that a game will feel safe. | 18 | A → retain only with claim test |
| Pause belongs in the plan. | 5 | J → “You can pause or stop at any time.” |
| Your drawer is empty | 4 | J → “No game cards yet” |
| Start with the game you want to try. | 7 | — |
| Make a short settings plan now, so you do not have to hunt through menus once play begins. | 18 | J → “Choose settings before you start playing.” |
| Make your first card | 4 | — |
| Three small moves | 3 | J → “Make a settings plan in three steps” |
| Plan, notice, keep what helped. | 5 | J → “Choose settings, check in, save notes.” |
| Name the motion | 3 | J → “Choose motion triggers” |
| Mark the visual patterns you already know, without needing to diagnose anything. | 11 | J → “Select game effects that have made you feel sick.” |
| Order your settings | 3 | — |
| Put the most promising game options first and check them off as you try them. | 14 | A → “Put settings in the order you want to try them.” |
| Check in, or stop | 4 | — |
| Notice symptoms every 15 minutes. | 5 | — |
| Pause or stop at any time—no streaks, pressure, or scoring. | 11 | J → “Pause or stop whenever you need.” |
| Local by design | 3 | J → “Saved on this device” |
| Your cards stay in this browser unless you export them. | 10 | — |
| Privacy | 1 | — |
| Terms | 1 | — |
| Original AI-generated risograph artwork · no trackers or ads. | 8 | J → “Original illustration. No ads or trackers.” |

### README prose

Code blocks, headings, command comments, and project-reference bullets are not
reader-facing sentences. Every remaining prose sentence/bullet follows.

| Text | Words | Flag and proposed rewrite |
| --- | ---: | --- |
| Comfort Card is a private, offline-first field note for players who experience motion sickness in games. | 16 | J → “Comfort Card is a private game-settings planner for players who get motion sick.” |
| It turns scattered settings advice into a game-specific plan: note familiar motion triggers, order the settings to try, record 15-minute symptom check-ins, and keep what helped. | 26 | >22/J → M2 rewrite |
| Live: motion-comfort-card.sociobot.in | 2 | — |
| This is a planning and self-advocacy tool. | 7 | J → “Use it to plan settings and record what you notice.” |
| It is not medical advice, a compatibility rating, or a promise that a setting will make a game safe or comfortable. | 21 | — |
| Creates a card for each game with an optional platform and usual comfortable play-time baseline. | 15 | J → “Make one card for each game and add your usual comfortable play time.” |
| Provides an editable-before-save, ordered checklist covering camera sway, shake, blur, FOV, UI motion, turn speed, frame rate, and a fixed reticle. | 21 | J → “Choose and order common motion settings before you save.” |
| Records tried settings and private play sessions in IndexedDB. | 9 | J → “Saves tried settings and play sessions in this browser.” |
| Runs a resumable 15-minute check-in timer with a prominent pause/stop path. | 11 | J → “Runs a 15-minute timer you can pause or stop.” |
| Records 0–4 symptom check-ins, familiar triggers, and optional private notes. | 10 | — |
| Exports a clean, non-identifying card that excludes all session history. | 10 | J → “Exports a card without session history or notes.” |
| Exports and imports a full JSON backup so the user owns their data. | 11 | J → “Exports and imports a full backup file.” |
| Installs as a PWA and reloads saved cards without a network connection. | 12 | J → “You can install the app and reopen saved cards offline.” |
| There is no account, server-side database, analytics, advertising, remote font, or third-party runtime script. | 14 | J → “No account, ads, analytics, or third-party scripts are used.” |
| Cards remain in the browser unless the user explicitly downloads, imports, copies, or shares them. | 13 | — |
| A clean shared card omits session dates, durations, symptom scores, and notes; a full backup includes them and should be treated as private. | 22 | J → split into two short sentences |
| See the in-app privacy page and terms. | 7 | — |
| Requirements: Node.js 22+ and npm. | 4 | J → move to “For developers” |
| Vite prints the local development URL. | 6 | J → move to “For developers” |
| Service-worker behavior is enabled in production builds, not the development server. | 11 | J → move to “For developers” |
| The end-to-end suite expects the Playwright 1.58.2 Chromium binary. | 9 | J → move to “For developers” |
| Install it when needed with npx playwright install chromium. | 9 | — |
| For a clean production verification: | 5 | Fragment → “Run these commands to verify a production build.” |
| Deploy the contents of dist/ as a static site. | 9 | — |
| index.html is at the distribution root, with independent privacy, terms, and offline fallback pages. | 13 | J → move to “Deployment” |
| The service worker precaches the app shell and uses same-origin runtime caching for built assets. | 14 | J → move to “Deployment” |

## Structure/behavior record

| Check | Result |
| --- | --- |
| Cold mobile and desktop | 200, one h1, no console/page errors; audience fails B1. |
| Title/description | Home title is Comfort Card — plan a steadier play session; 91-character description exists. Legal titles are route-specific. |
| Metadata | lang, favicon, manifest, robots, sitemap present; canonical/OG/Twitter/Apple-touch absent. |
| Link crawl | Eight visible home links and checked static routes returned valid responses; mailto was not HTTP-crawled. |
| 404/deep links | Unknown path shows home at 200; /demo false-succeeds as home. |
| Back/focus | Hash Back changes content but focus is BODY. |
| Header/footer | Legal links consistent; N1 items absent. |
| Visual identity | Pass: the warm two-ink risograph field-note art is distinct, not a generic SaaS template. |
| Privacy/offline | Cold live traffic same-origin only; local offline test passed, but neither proves a demo sandbox. |

## Reproduction

    npm ci
    npm test             # PASS: 6 tests
    npm run build         # PASS: dist and build verifier
    npm run test:e2e      # PASS: test-results/.last-run.json

No claim commands could run because .factory/claims.json is missing. The
missing demo prevents the required isolated-storage and offline/privacy claim
exercises. Re-review from a fresh browser context only after all blockers are
resolved.
