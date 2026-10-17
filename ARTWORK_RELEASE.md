# Story-matched artwork — Art 2

## What is actually included

This release connects artwork to the running app; it is not another standalone preview. The main reading application, story data, audio controller, garden storage, favorites, and reward rules are unchanged.

- 17 book covers use raster crops from the previously generated illustration preview, distributed in four small WebP sprite assets. These are thumbnail-sized cover assets, not full-resolution interior paintings.
- The other 13 covers use story-specific scalable illustrations.
- All 30 stories have explicit per-page scene definitions: 124 reading frames in total. Interior artwork uses reusable vector characters and props composed for the setting and action on each spread. These are not 124 separately generated AI paintings.
- Examples include school and classroom scenes for Benny, a kitchen for Milo Makes Soup, a bedroom for Luna's Sleepy Moon, a leaf boat for Pip, and a birthday scene centered on Bo the bird.
- Preview panels with conflicting characters or objects were not substituted into the app. Pip's yellow boots, Luna's role in The Rainbow Flower, and Bo's birthday remain aligned with the existing text.
- The additive layer replaces only the artwork containers. It leaves existing text, reading buttons, event handlers, narration, and progress code intact. Existing vector drawings remain the fallback if the new script fails to load.
- Version labels show “Story artwork · Art 2” and “Story-matched artwork · Art 2” after the artwork layer runs.

## Component verification performed

The isolated artwork component was tested in Chromium at viewport widths 390, 834, and 1440. All 30 covers rendered; all 17 painted cover crops loaded from the four local WebP assets; all 124 SVG frames parsed as valid XML. Representative page transitions, retained original control listeners, and reduced-motion behavior passed. No JavaScript page errors or horizontal overflow were observed in this fixture.

These are component-level tests, not full application regression tests. Live HTTP rendering and physical iPad/Safari audio playback were not verified in this testing environment. No new natural voice recordings were generated. The existing audio fallback remains unchanged.

## Deployment

The existing GitHub Pages deployment publishes the updated library.html, story-art-v2.js, story-art-v2.css and assets/covers-*.webp together. Open library.html?release=art-2#library. Old saved page URLs remain supported.

## Rollback

Revert the Art 2 integration commit. The previous storybook-v1.js and storybook-v1.css were not modified, and no force push or history rewrite is needed.
