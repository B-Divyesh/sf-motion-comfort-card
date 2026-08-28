# Comfort Card

Comfort Card is a private, offline-first field note for players who experience motion sickness in games. It turns scattered settings advice into a game-specific plan: note familiar motion triggers, order the settings to try, record 15-minute symptom check-ins, and keep what helped.

Live: [motion-comfort-card.sociobot.in](https://motion-comfort-card.sociobot.in)

This is a planning and self-advocacy tool. It is not medical advice, a compatibility rating, or a promise that a setting will make a game safe or comfortable.

## What it does

- Creates a card for each game with an optional platform and usual comfortable play-time baseline.
- Provides an editable-before-save, ordered checklist covering camera sway, shake, blur, FOV, UI motion, turn speed, frame rate, and a fixed reticle.
- Records tried settings and private play sessions in IndexedDB.
- Runs a resumable 15-minute check-in timer with a prominent pause/stop path.
- Records 0–4 symptom check-ins, familiar triggers, and optional private notes.
- Exports a clean, non-identifying card that excludes all session history.
- Exports and imports a full JSON backup so the user owns their data.
- Installs as a PWA and reloads saved cards without a network connection.

## Privacy

There is no account, server-side database, analytics, advertising, remote font, or third-party runtime script. Cards remain in the browser unless the user explicitly downloads, imports, copies, or shares them. A clean shared card omits session dates, durations, symptom scores, and notes; a full backup includes them and should be treated as private.

See the in-app [privacy page](https://motion-comfort-card.sociobot.in/privacy/) and [terms](https://motion-comfort-card.sociobot.in/terms/).

## Run locally

Requirements: Node.js 22+ and npm.

```sh
npm ci
npm run dev
```

Vite prints the local development URL. Service-worker behavior is enabled in production builds, not the development server.

## Test and build

```sh
npm test            # model and import/export unit tests
npm run build       # exact production build; writes dist/
npm run test:e2e    # Chromium desktop + 390px mobile + offline + axe checks
npm run test:a11y   # accessibility subset
```

The end-to-end suite expects the Playwright 1.58.2 Chromium binary. Install it when needed with `npx playwright install chromium`.

For a clean production verification:

```sh
npm ci
npm test
npm run build
npm run test:e2e
```

## Deploy

Deploy the contents of `dist/` as a static site. `index.html` is at the distribution root, with independent `/privacy/`, `/terms/`, and offline fallback pages. The service worker precaches the app shell and uses same-origin runtime caching for built assets.

## Project notes

- Product opportunity: [.factory/brief.json](.factory/brief.json)
- Visual system and original asset provenance: [.factory/design.md](.factory/design.md)
- Verification and handoff: [.factory/handoff.md](.factory/handoff.md)
- License: MIT
