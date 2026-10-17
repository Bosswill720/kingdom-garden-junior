# Kingdom Garden Junior — Storybook Edition 1.0

## Implemented

- Unified Home, Stories, Favorites, Garden, Badges and Grown-up corner.
- All 30 original stories available together. The original 28-story data order and audio asset paths are preserved for scripts/generate_narration.py.
- Original vector character artwork, illustrated covers, woodland scenes, cream/sage palette, book-style typography, responsive layouts, and user-controlled animations.
- The 28 library stories now display two short sentences per spread. The original Seed and Puddle stories retain their grouped sentences.
- A single narration controller handles prerecorded audio, device speech fallback, replay, pause/resume, word pronunciation, and cancellation on navigation. Existing per-sentence MP3s are queued across each new spread; recordings need not be regenerated for the layout change.
- Word highlighting uses supplied valid timing data when available. Without timestamps, recorded audio highlights its sentence. Device highlighting depends on speech-boundary events.
- Completing each different story once earns 3 sunshine stars. Plant four flower varieties in a twelve-slot garden, earn milestone badges, and save favorites/progress locally. Previous original-story completion and flower count are migrated from kgj-v1.
- No new paid services, API credentials, account signup, child information, or third-party analytics added.

## Testing performed

Chromium UI tests at desktop 1440x1100, tablet 834x1112 and phone 390x844 sizes passed: 30-book display, multi-sentence pages, navigation, story completion, reward balance, and flower planting. No horizontal overflow or uncaught JavaScript errors was observed in those tests.

Additional functional checks passed for all 30 story openings, category filters, title search, favorites, text sizing, chosen garden slots, once-only rewards, storage-unavailable fallback, user animation toggle and OS reduced-motion preference. Mocked media/speech tests covered full-page narration, pause/resume, replay, individual words, stop, cancellation, queued recordings, timed highlighting and sentence fallback.

Test limitations: browser documents were loaded directly from the authored source because this environment blocked navigation to local test URLs. Tests used Chromium, not an actual iPad Safari device. Speech/media control tests were simulated; audible output and real MP3 recordings were not verified. Prerecorded natural narration was not generated as part of this visual release. The illustrations are reusable original vector scenes with per-story props, not individually painted artwork for every page.

## Deployment and rollback

No build step is required. GitHub Pages can serve index.html, library.html, storybook-v1.css and storybook-v1.js from main at the repository root. Existing .nojekyll, narration scripts, and workflow files are preserved.

Previous version: backup/pre-storybook-redesign-20261016 at commit 6d2f7ae917d6e637039ca1cc5cae4b862b98efa6. Restore by a normal revert/change; do not force-push.

Repository update, Pages deployment status, and actual device playback are separate verification steps. A successful source commit alone does not prove a live deployment.
