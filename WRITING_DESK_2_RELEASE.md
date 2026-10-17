# Writing Desk 2.0 — steady paper and whole lines

## Implemented

- Paper lock is on by default. The desk is a fixed viewport layout with touch-action:none set before input begins. Page margins and toolbar areas do not pan the document. Scrollable guide/settings dialogs are outside that gesture restriction. Lock paper can be explicitly disabled for normal scrolling.
- Touchmove fallback uses non-passive listeners. Pencil-only ignores finger ink; pen priority, pointer capture, cancellation, frozen per-stroke coordinates, and deferred resize are retained. Feedback and completion occupy fixed-height space, so the pad does not jump after a stroke or badge.
- 24 whole words and 12 short multiword lines are drawn along a single baseline. Each stroke advances to the next letter without clearing the previous ink or requiring a Next letter page. Examples: cat cat cat; sun car bus; I see a cat.; Pip has a car.; The sun is up.
- Grown-up corner accepts a custom line of up to 5 short words / 24 characters (English letters, digits, spaces, periods). It stays local. Trace and independent-copy modes are both supported.
- Retains the 5 warmups, 52 letter guides and 10 digits: 103 preset guides in total. Original letter formations remain. A self-intersection matching correction prevents the numeral 8's crossing from being mistaken for a reversed stroke.
- Show me, device-voice guidance, Undo, Try again, local writing blooms, picture export and badge export remain. New word/line practice uses scale-aware tracing tolerance; this is practice feedback, not handwriting recognition or educational assessment.
- Badges/settings retain kgj-writing-v1. An unreadable save is not silently overwritten. Ink is in memory only and must be exported as a picture before refresh/close to retain it.

## Scope and preservation

writing.html now loads writing-guides-v2.js, writing-v2.js and writing-v2.css with versioned URLs. Existing writing links still resolve to the new desk. No stories, artwork, kingdom purchases, coin rules, narration APIs or other app modules are changed. Old writing-v1.js and writing-v1.css remain available for rollback.

## Verification actually performed

54 Chromium browser checks passed. They include all 101 retained alphanumeric reference strokes, all 12 composed line layouts, a complete 14-stroke sentence with unchanged canvas coordinates after every stroke, whole-word continuity, undo, duplicate-badge prevention, incorrect-path feedback, pen/finger filtering, pointer cancellation, a real mouse trace, independent-copy mode, reduced motion, and retained badges.

Trusted CDP touch gestures and wheel events verified that locked page margins do not pan, including with a synthetic pen active. The guide dialog remains independently scrollable. Explicit unlock restores outside-pad scrolling. Layouts fit 834x1112, 1112x834, 1440x900, 390x844, 320x700 and 1024x768.

Tests ran the full writing-page HTML/CSS/JS through page.set_content because browser URL navigation was blocked by the environment. Browser storage and spoken audio were test substitutes. These are not physical iPad, Safari or Apple Pencil tests, and audible guidance was not verified. Browser event filtering is not native PencilKit palm rejection.

## Use

Open writing.html?release=writing-2#line-i-see-a-cat. Keep Lock paper checked. Choose a guide > Word lines offers multiple words on the same line; Whole words practices an entire word without changing pages. Landscape provides more room for a long line. Choose My own try for ungraded freehand copying.

## Recovery

Export a practice picture before closing the tab; writing badges and settings remain browser-local. Reverting this release restores the original writing page. No force push is required.
