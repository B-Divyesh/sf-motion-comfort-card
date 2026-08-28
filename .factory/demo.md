# Demo sandbox

Open `https://motion-comfort-card.sociobot.in/demo` or add `?demo=1` to the home URL.

The demo opens a completed card for the fictional game Harbor Signal. It contains:

- PC as the platform and a 20-minute reference time.
- Camera shake, motion blur, narrow field of view, and a bobbing boat camera as triggers.
- Six ordered settings, with the first two marked as tried.
- One 24-minute finished session with a completed 15-minute check-in and private note.

Demo state lives only in page memory. The demo never opens, reads, or writes the real `comfort-card-local` IndexedDB database. Reloading the page reseeds the sample. “Reset demo” also restores it immediately. “Start for real” leaves the sandbox and loads the normal local database.

The demo banner remains visible on every demo route. Claim tests always begin in a fresh `/demo` browser context.
