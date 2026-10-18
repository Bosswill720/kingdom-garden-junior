# Little Living City 4.0 — Place, watch, and play

## Play

- [Open the real city](https://bosswill720.github.io/kingdom-garden-junior/city.html?release=city-4)
- [Open the separate 5,000-coin test city](https://bosswill720.github.io/kingdom-garden-junior/city.html?release=city-4&test=1)

These addresses show this release after its commit has completed GitHub Pages deployment. Repository commit, deployment, and physical-device operation are distinct verification steps.

## Implemented experience

This replaces the oversized, scrolling City 3 screen with a compact toy-town board. All eight neighborhoods remain visible: Cottage Lane, Story School, Sunshine Farm, Market Street, Garage Yard, Play Park, Town Square, and Woodland Hill. Landscape uses a 4-by-2 arrangement; portrait uses 2-by-4. The camera never follows a car and the map does not require panning.

Open **My cars**, choose an owned vehicle, press **Place in city**, then tap a numbered parking spot. Repeat to place another car; earlier cars continue independently when the collection closes. **Place all my cars** deploys the owned collection after confirmation. All 14 existing vehicles can be deployed at the same time, including the 500-coin Giant Delivery Truck. Park, wake, move, or return an individual car without losing ownership.

Vehicles independently select destinations, follow a rounded road, leave the main lane to stop, interact, and continue. Preferences depend on the vehicle type and actually placed buildings. School visits, deliveries, bakery bags, park treats, tractor/water effects, construction work, fountains, woodland picnics, castle visits and friendly greetings are supported. Up to two primary interaction scenes run together. Residents walk and carry items; excavator and dump-truck equipment animates. These small visual activities are not extra claims against real farm inventory.

Open **Build** to place or return owned upgrades. The nine existing land/building items map to compatible plots, including separate bakery and market plots. Open **Decorate** to place or move up to twelve existing flower instances. Placing, moving and returning owned objects is free. Empty plots are shown rather than unowned buildings pretending to be part of the collection.

The new artwork is original scalable SVG: distinct toy-car bodies and equipment, custom houses and landmarks, flowers, fox/bunny residents, and interaction props. Vehicles are drawn from above so turning does not flip a side-view car illustration upside down. The collection cards and board use the same asset definitions.

## Shared rewards and save preservation

`kingdom-core-v2.js` is unchanged. The existing shared coin wallet, vehicle IDs, prices, reading unlock requirements, farm inventory, purchased land, and flowers remain in `kgj-kingdom-v1`. The existing reading, writing and math modules are not modified by this city release.

Existing rewards remain: new book 10 coins; same-day reread 3; eligible later-day reread 5; writing completion 4; five-question math adventure 7. Traffic and automatic city interactions never award money, advance crops, spend fuel or consume harvest cargo.

City placements use `kgj-city-v4-layout`. The test wallet remains `kgj-kingdom-city-v2-test-wallet`, with separate placements under `kgj-city-v4-test-layout`. Existing test purchases survive the upgrade. A missing test wallet starts at 5,000 coins with all book gates available. Resetting the test city affects only test purchases and placements.

Previously owned buildings and flowers receive suggested initial placements; previously owned cars stay in the garage until the child chooses to place them. No purchase is fabricated and no real coin balance is recomputed during layout migration.

The parent settings include **Export city save**, **Restore city save**, and a recovery snapshot. A full city backup contains the shared wallet plus the layout, not separate math stickers, writing badges or unfinished handwriting. Import validates the format and real/test mode and asks before replacement. Corrupt data is not silently overwritten with a blank city. Explicit recovery preserves a copy of damaged raw data. Where browser storage is unavailable, play continues in memory with a warning; export before leaving.

Progress remains local to the current browser/device. Sharing the link does not synchronize a child's progress to another device.

## Try it quickly

For a fresh test wallet, choose **Try 3 test cars** and confirm. This buys and places the red car, pickup and tractor for 190 test coins total, leaving 4,810. They begin exploring automatically.

For an existing test collection, choose **My cars → Place all my cars** and confirm. To place one at a time, choose its card and a highlighted parking point. Buy a bakery in **Shop → Buildings**, then choose one of its compatible empty market plots. Add a flower through **Decorate**. The town pauses while the collection or placement interface is open and resumes when closed.

## Controls and accessibility

- All placement can be completed with two taps; dragging is not required.
- Global Pause, individual Park/Wake, keyboard-selectable districts and parking choices.
- Opening a panel or rearranging a collection item pauses the simulation.
- Background pages pause; returning resets animation time rather than jumping vehicles forward.
- System Reduce Motion keeps the city still; quiet descriptive feedback remains available.
- Browsing collection panels scrolls only the panel, not the city behind it.
- No paid API, new account, microphone, uploaded handwriting, advertisements, real-money purchases, random paid rewards, or new audio recording service.

## Verification performed on the shipped source

### 76 Node assertions passed

`node tests/city-v4/core.test.cjs` tests the actual shipped economy and city core. It covers all 14 deployments, all nine building mappings, twelve flowers, invalid ownership/slots, duplicate prevention, moving and returning, wallet byte preservation on layout-only edits, reloads, export/restore, test isolation, corrupt-save preservation, explicit recovery, memory-only storage and unchanged activity rewards.

Two ten-minute simulated runs (landscape and portrait) ran all fourteen vehicles. Every vehicle completed visits, at most two major interactions ran together, no nonfinite positions occurred, and sampled center spacing stayed above the test's 42-world-unit threshold. This is not a claim of fully verified geometric collision avoidance in every possible layout. Three-car seeded tests produced multiple interaction types within one simulated minute. Equivalent 30/60/120-Hz input schedules produced identical paths/states/trips through the fixed 120-Hz simulation tick.

### 72 complete-page Chromium assertions passed

`tests/city-v4/browser_test.py` ran the entire authored HTML/CSS/JavaScript, actual SVG artwork, and actual simulation in Chromium. Because browser HTTP/file navigation was blocked in the development environment, tests used `page.set_content` on `about:blank` with an explicitly substituted localStorage fixture. These were not fake DOM or fake car-controller tests, but they were also not live GitHub Pages or physical iPad tests.

Checks covered explicit starter-trio confirmation and spending, independent movement, global/individual pause, return without losing ownership, all parking choices, purchase-to-placement, flower placement, persistence after fixture reload, all 14 rendered cars, nine placed upgrades, twelve flowers, panel-only scrolling, Reduce Motion, backup export/restore, and untouched writing/math storage keys. No uncaught page errors were observed.

At viewport sizes 1112×834, 834×1112, 1024×768, 1440×900, 390×844 and 320×700, all eight regions and the bottom controls stayed in view without document overflow. A 120-frame development-browser sample with fourteen cars averaged approximately 16.67 ms; this does not establish performance on the user's iPad.

### Remaining limits

- Physical iPad/Safari/Apple Pencil operation and audible narration were not tested in this environment.
- This is a 2D illustrated toy board, not generated 3D artwork or a freely editable road/terrain simulation.
- The initial traffic model uses **one continuous rounded clockwise loop with off-road stops**, rather than the implementation spec's aspirational intersecting/two-loop network. Every car still has its own state, destination, traffic spacing and interaction cycle.
- Buildings have compatible assigned slots, not arbitrary free-coordinate placement. Flowers have twelve movable spots.
- Small-map vehicle tap targets are supplemented by large collection-card controls; full accessibility certification is not claimed.
- No new natural narrator recordings, broader learning-curriculum validation, or effectiveness assessment was performed.

## Source and test commands

New source: `city-v4.html`, `city-core-v4.js`, `city-art-v4.js`, `city-app-v4.js`, `city-v4.css`. `city.html` serves the same new entry point. `library.html` changes only its two city launch links and their version labels. All prior city modules remain in the repository.

Run the pure tests:

```sh
node tests/city-v4/core.test.cjs
```

For browser regression with a local server, install Playwright in your development environment, ensure Chromium is available at the executable path configured in the test, then use:

```sh
python -m http.server 8000
# In a separate terminal:
python tests/city-v4/browser_test.py --base-url http://127.0.0.1:8000
```

Use `--fixture` only when the test environment disallows normal browser navigation, and label those results accordingly.

## Rollback

The pre-City-4 baseline is commit `489adc00d7f48bf14256580d604ad7d60e7f2f22`. Restore the prior `city.html` and library launch links with a normal revert; old city-v3 modules are retained. No force push is needed. The shared wallet keeps its existing schema, so a rollback does not require resetting coins or purchases. The new City 4 layout can remain stored separately for later reuse.
