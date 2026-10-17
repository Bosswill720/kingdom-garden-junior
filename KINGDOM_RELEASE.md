# My Little Kingdom — Cars & Farm 1.0

## Playable scope

This is the first playable expansion, not the entire proposed world-building roadmap.

- Reading wallet: 10 coins for a new title; 5 coins for a later-day reread, once per title per day. Three defined themed collections give a once-only 15-coin bonus. Replaying a completion or double-clicking cannot award the same transaction twice.
- Three purchasable vehicles: Little Red Car (20 coins / 1 different book), Farm Pickup (70 / 5 books), Green Tractor (100 / 8 books). Owned vehicles appear in the garage and can follow animated tap-to-destination routes. Driving does not cost fuel or coins.
- Four crops: carrots, strawberries, pumpkins, sunflowers. Two starter beds are planted free. Two eligible reading rewards grow one whole harvest batch. Harvesting creates cargo; delivery pays 6 coins once per batch. Crops do not wither. Basic seeds are free. A pickup is optional; basket delivery remains free. Owning the tractor adds a whole-field harvesting animation.
- Farm Meadow costs 40 coins and requires 3 different books; it opens four additional crop beds. Village Lane costs 100 coins and requires 8 different books; it adds a driving destination. More beds do not multiply the batch payout.
- Shop previews, purchase confirmation, ownership checks, a saving goal, a garage, reading keepsakes, and the original twelve flower slots. New flowers cost 5 coins each.
- Existing remaining Sunshine Stars migrate once at 5 coins per star. Existing completed titles, favorites, reading positions and flowers are retained. Migration does not pay the new-book reward again for old titles.
- Parent-controlled save export/import, validated save data, a local recovery snapshot, and in-memory fallback when persistent storage is unavailable. Progress is device/browser-local; there is no cloud sync.

## Preserved application

All 30 stories, narration controls, Art 2 artwork, and original audio asset paths remain. The existing storybook-v1.js, storybook-v1.css, story-art-v2.js and story-art-v2.css are unchanged. library.html only loads the additional kingdom modules and stylesheet. The new layer owns the displayed wallet and kingdom routes; it accepts a reading completion only after the original reader successfully changes to its finished screen and the new tracker has visited every page.

This records participation/page visits, not proof of reading or comprehension. Listening and shared reading have equal base rewards. No new natural narration recordings, API calls, API credentials, accounts, advertisements, or real-money purchases were added.

## Artwork and limits

The approved concept artwork supplies the map and vehicle/crop thumbnails. A small WebP atlas is stored as six local binary parts and reassembled by the optional kingdom-art-v1.js loader; its size, optional SHA-256 and image decoding are checked. Art failure does not disable gameplay.

The illustrated map is an activity selector, not a fully editable 3D or isometric world. Driving occurs on the garage route. Keepsakes are reading badges, not placeable decorations. Castle Hill, family cars, the school bus, sports car, orchard, custom building placement and cloud sync remain future work. These limits are labeled in the app.

## Verification actually performed

- 20 Node economy/storage checks passed: migration, reading rewards, later-day eligibility, page-completion requirements, duplicate sessions, purchasing, free planting, harvest/delivery deduplication, land capacity, bonuses, flower ownership, simulated cross-tab locking, save validation, corrupt-save preservation and recovery.
- 27 Chromium offline component/integration-fixture checks passed: reading-to-purchase-to-drive-to-harvest flow, retained simulated narrator listener, completion messaging, save export and restore confirmation, retained ownership on a second loaded fixture, reduced-motion driving, and no horizontal overflow across all six kingdom tabs at 834px and 390px widths. A 1440px layout was also rendered.
- Two artwork-loader checks passed: six parts decode to a 720x340 WebP and populate the CSS image URL; missing parts fail gracefully.

Browser navigation was blocked in the test environment, so the browser checks used page.set_content with a simulated reader contract and storage. They are not full live-app regression tests, physical iPad Safari tests, or audible narration tests. A successful GitHub deployment is a separate check, not proof that every interaction has been tested on the child's device.

## Quick playtest

On a fresh save, finish two new stories. Open My Kingdom > Shop and buy the Little Red Car for 20 coins. Open Garage and choose a destination. Open My Farm, gather the ready carrots, and deliver the basket for 6 coins. Choose free seeds and tap an empty crop bed. Existing users may begin with converted coins and previously completed-book milestones.

## Recovery and rollback

Use Grown-up corner > Export save before clearing browser data or changing devices. Restore asks for confirmation before replacing progress. With Web Locks available, transactions are serialized across same-origin tabs; otherwise use one tab for purchases. The last local snapshot is kept under kgj-kingdom-v1-recovery. Corrupt saves are not silently replaced.

Revert this expansion commit to return to Art 2. The original reader and artwork modules are not overwritten. No force-push or history rewrite is required.
