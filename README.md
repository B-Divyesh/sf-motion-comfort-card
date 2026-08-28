# Comfort Card

Comfort Card is a private game-settings planner for players who get motion sick.
Make one card for each game. List triggers, order settings, and record a 15-minute check-in.

Live: [motion-comfort-card.sociobot.in](https://motion-comfort-card.sociobot.in)

Try the isolated sample at [motion-comfort-card.sociobot.in/demo](https://motion-comfort-card.sociobot.in/demo).
The demo opens a completed Harbor Signal card. Demo changes disappear when you reload or leave.

This tool helps you plan settings and record what you notice.
Comfort Card is not medical advice. It cannot tell you whether a game is safe or comfortable for you.

## What it does

- Makes one card for each game and adds your usual comfortable play time.
- Lets you choose and order common motion settings before saving.
- Saves tried settings and play sessions in this browser.
- Starts a 15-minute timer that you can pause or stop.
- Records symptom check-ins, familiar triggers, and optional private notes.
- Exports a clean card without session history or notes.
- Exports and imports a full backup file.
- Reopens the sample offline after the first visit.

## Privacy

No account, ads, analytics, or third-party scripts are used.
Cards remain in this browser unless you download, import, copy, or share them.
A clean card leaves out session dates, durations, symptom scores, and notes.
A full backup contains those details, so treat it as private.

Read the [privacy page](https://motion-comfort-card.sociobot.in/privacy/) and [terms](https://motion-comfort-card.sociobot.in/terms/).

## Run locally

For developers, the requirements are Node.js 22 or newer and npm.

```sh
npm ci
npm run dev
```

Vite prints the local development URL. Service-worker behavior runs only in a production build.

## Test and build

```sh
npm test            # unit tests
npm run build       # production build in dist/
npm run test:e2e    # browser, mobile, routing, offline, privacy, and claim tests
npm run test:a11y   # accessibility subset
```

The browser suite uses Playwright 1.58.2. Install Chromium with `npx playwright install chromium` if needed.

Run these commands to verify a clean production build.

```sh
npm ci
npm test
npm run build
npm run test:e2e
```

## Deploy

Deploy the contents of `dist/` as a static site.
The host configuration maps product routes to the app and serves a styled 404 page.
The versioned service worker caches the app shell and same-origin assets.

## Project notes

- Product opportunity: [.factory/brief.json](.factory/brief.json)
- Visual system and original asset provenance: [.factory/design.md](.factory/design.md)
- Demo sandbox: [.factory/demo.md](.factory/demo.md)
- Reliance claims and commands: [.factory/claims.json](.factory/claims.json)
- Verification and handoff: [.factory/handoff.md](.factory/handoff.md)
- License: MIT
