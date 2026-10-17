# Kingdom Garden Junior — Math Playground 1.0

## Implemented

A separate, directly playable math.html is added to the existing static GitHub Pages application. A navigation-only math-link-v1.js adds Math launch links to the library sidebar/top bar. No original reading, artwork, narration, kingdom economy, purchase, farm, or writing code is replaced.

Seven original activities, each with five generated puzzles per adventure:
- Harvest Helper: pack the requested number of apples; tap again to remove one.
- Picnic Party: count two groups of berries and add them together; tap-to-count support.
- Bunny Bus: tap the requested number of friends off the bus, then find the remaining quantity.
- Shape Workshop: recognize circle, triangle, square, rectangle, pentagon and hexagon, introduced by level.
- Pattern Express: complete repeating shape patterns. Shapes and not only colors distinguish pattern elements.
- Number Bridge: fill a missing number in a sequence; steps of one or two at the highest level.
- Firefly Frames: fill five/ten/twenty-frame spaces and find the missing quantity.

Three selectable comfort levels use quantities/operations to 5, 10 and 20. The level is chosen by the child or parent; it is not inferred from age or an assessment. There is no adaptive/mastery scoring, timed test, negative answer, or full curriculum claim.

All activities have spoken questions (device English speech), retry feedback, a specific hint, and an explicit worked example through Show me together. Supported practice can earn the same sticker. No new natural-voice recordings are generated; physical device speech quality remains unverified.

A complete adventure records a practice sticker for that game/level; 21 different stickers are available. Rereading, kingdom coins, purchases and writing blooms remain separate and unchanged. A sticker is a keepsake for participation, not proof of independent mastery. No real money, advertisements, external API key, analytics, microphone, or personal information is required.

Math save data is isolated under kgj-math-v1 (with a recovery snapshot under kgj-math-v1-recovery). Completed adventures/settings persist locally when available. Unfinished adventures are not retained after closing or leaving the math game. Up to 1,000 completed adventures are retained. The parent view supports validated export/import with explicit restore confirmation, corrupt-save preservation and memory-only play if storage is unavailable. Math backups are separate from kingdom and writing backups. No cloud sync is added.

## Visuals and accessibility

Original scalable illustrations give each activity its own scene: apple tree and basket, berry picnic, school bus, shape workbench, train, river stepping stones, and night-time firefly frames. This is vector artwork, not a new set of generated 3D paintings.

Controls accept touch, mouse, keyboard and Pencil taps. There is no handwritten-number recognition or required drag gesture. Feedback is written and spoken rather than color-only. Short completion animations honor both the app animation preference and system reduced motion. The page is scrollable; it does not contain a writing pad or change the existing locked writing desk.

## Verification actually performed

- Node question-engine checks validated 15,750 generated questions across seven activities and three levels. Checks include arithmetic bounds, nonnegative subtraction, unique answer choices containing the answer, sequence/pattern correctness, determinism, duplicate-sticker behavior and save validation.
- 234 Chromium browser assertions passed using the entire authored math HTML/CSS/JS through page.set_content. They cover every game at every level, complete five-round adventures, supported examples, hints, incorrect answers, sticker persistence, no writes to legacy reading/kingdom/writing keys, corrupt and blocked storage, export/import confirmation, device-speech invocation/cancellation, reduced motion and layouts at 320, 390, 834, 1112 and 1440 pixels.
- 20 additional checks passed for completion/sticker layouts and a small existing-navigation fixture. The fixture verifies additive links and no mobile horizontal overflow; it is not a regression run of the entire original app.

Browser URL navigation and external networking were restricted by this environment. localStorage and speech output were test substitutes. No physical iPad, Safari, Apple Pencil or audible-narration test was performed. Repository commit, successful Pages deployment and real-device operation are separate verification steps.

Full unminified source, reproducible tests, test reports and screenshots accompany the downloadable source archive.

## Learning and interaction references

These references informed the starting scope; they do not certify this app or imply full standards coverage.
- Kindergarten object-based addition/subtraction and making ten: https://www.thecorestandards.org/Math/Content/K/OA/
- Grade 1 visual addition/subtraction within twenty: https://www.thecorestandards.org/Math/Content/1/OA/
- Non-drag alternatives: https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements
- Pointer target guidance: https://www.w3.org/WAI/WCAG22/quickref/

## Use and rollback

Open math.html?release=math-1. Choose a comfort level and a game. Tap the speaker to hear a question. Hints and Show me together are always available. Finish five puzzles to add a practice sticker.

Before clearing browser data, open Grown-up corner and Export math save. Restore replaces only math progress after confirmation.

Revert this additive release to roll back; no force push is required. The previous app is preserved on backup/pre-math-playground-1.
