# Kingdom Garden Junior — Writing Studio 1.0

## Included

- Dedicated writing.html with 77 original guides: 5 warmups, 26 uppercase letters, 26 lowercase letters, 10 digits (0–9), and 10 familiar words: pip, sun, car, farm, seed, cat, mom, dad, book, bus.
- Numbered starting point, direction arrow, dotted path, handwriting guidelines, and optional gold-dot stroke demonstration. Words are practiced one letter at a time.
- Follow the dots mode compares start, direction, coverage and distance to the target path with forgiving thresholds. My own try shows a small model on a blank lined pad; the child or parent marks an attempt. It is not handwriting recognition, grading, curriculum certification, or a skill assessment.
- Pen, touch, and mouse input using Pointer Events. Optional Pencil-only filtering ignores touch marks inside the pad. Pen priority, pointer capture, cancellation handling and resize-safe coordinates. This is not native PencilKit palm rejection and physical device behavior is unverified.
- Optional spoken guidance uses the device English voice. No new AI audio recordings or paid APIs.
- Undo, try again, progress blooms, browser-local badge/settings persistence, and in-memory ink while this page remains open. Grown-up corner can export a practice PNG or badge JSON list; there is no badge import in this version.
- No child handwriting upload, microphone, account, analytics or API key required. Ink is not automatically persisted after refresh or closing. Writing blooms are separate from kingdom coins and do not alter the reading economy.
- Optional demos honor reduced motion with a static stroke. Formation is one consistent print style (single-storey a and g); a school may teach different formation.

## Integration and preservation

The sole change to library.html is loading writing-link-v1.js. That small script adds sidebar/topbar links to the separate writing area and scoped navigation styles. Original storybook, Art 2, kingdom, narration and economy modules are untouched. Writing stores data only under kgj-writing-v1 and does not change existing kingdom or reading keys. Returning to Stories or My Kingdom is normal same-tab navigation.

## Verification performed

33 Chromium browser checks passed, including all 101 canonical alphanumeric stroke paths, rejection of reverse/incomplete/off-path traces, synthetic pen events, real browser mouse gestures, Pencil-only filtering, pointer cancellation, undo/reset, multi-letter words, freehand attempts, duplicate-badge prevention, saved-state restoration, blocked-storage startup, and layouts at 320, 390, 834 and 1440 pixels with no horizontal overflow. Browser navigation was restricted in the environment, so the actual writing-page HTML/CSS/JS was loaded through set_content with a test storage substitute. These are functional writing-page tests, not a full live-app regression or physical iPad/Safari/Apple Pencil test. Audible device narration was not verified. Source and test artifacts accompany the release.

## Try it

Open writing.html?release=writing-1 in Safari on an iPad paired with a compatible Apple Pencil. Choose Big letters, A. Tap Show me; then follow the green numbered dot. Turn on Pencil only to ignore finger marks inside the pad. Buttons still accept finger input. Without a Pencil, leave Pencil only off to test with a finger or mouse.

No force-push is required to roll back: revert this release commit. Existing reading and kingdom progress remain in their original keys.
