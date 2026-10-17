# Kingdom Garden Junior — Storybook Edition 1.0

## Changes

- One unified 30-book library: 28 existing library stories plus Pip Finds a Seed and Puddle Parade.
- Original scalable vector woodland artwork, illustrated covers, coordinated colors, custom navigation icons, responsive mobile navigation, search and categories.
- 2 short sentences per spread for the expanded library; the original stories retain their 3-sentence pages. Large adjustable reading text (30 / 36 / 42 CSS pixels).
- Working favorites, progress, badges and garden integration. Each newly completed book awards 3 sunshine stars once. Plant flowers in any of 12 garden spots.
- Optional gentle animations, tap-to-greet characters, tap-to-bloom flowers, and device reduced-motion support. Reading text stays still.
- Existing sentence MP3 filenames retained. The audio player queues original recordings to match grouped pages. Device narration remains the fallback. Timed highlighting requires supplied timings; without them recorded narration highlights the active sentence.
- Legacy index and Puddle Parade URLs route into the same application. Existing kgj-v1 garden data is migrated where available. The original narration generation script and workflow remain unchanged.

## Tests performed

Chromium UI tests at desktop (1440px), tablet (834px), and phone (390px) viewport widths passed for rendering, navigation, 30-book count, multi-sentence pages, completion rewards, planting and horizontal-overflow checks. Behavioral tests passed for all 30 story openings, filters, search, favorites, text size, once-only rewards, selected planting slots, storage-unavailable fallback and reduced motion. Audio control tests used mocked speech and media objects to check full-page narration, pause/resume, replay, word taps, cancellation on navigation, queued recordings, timestamp highlights and sentence fallback.

Limitations: physical iPad Safari playback and natural voice quality were not verified. No new natural voice files were generated as part of this visual redesign. Narration assets may be absent; the UI reports device versus recorded narration rather than claiming recordings exist. Scenes use reusable vector characters and props, not individually hand-painted artwork for each sentence.

## Rollback

The original site is preserved on backup/pre-storybook-redesign-20261016 at commit 6d2f7ae917d6e637039ca1cc5cae4b862b98efa6. Revert the redesign commit if necessary; no force-push or history rewrite is required.
