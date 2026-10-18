# My Wonderful City 3.0 — Premium Neighborhood Rebuild

## What changed
The 2.0 city was an illustrated map that showed all the buildings compressed together. City 3.0 replaces that screen with a **2760 × 2320** large, **scrollable** storybook neighborhood, with an iPad/phone-sized camera rather than shrinking the entire town to one page.

The neighborhood now has **16 separated destinations** across a four-row district layout:
- Storybook Library, Pip's Cozy Cottage, Sunshine Farm, Grand Town Hall
- Rainbow Playground, Little Cloud Bakery, Sunshine Market, My Happy Garage
- Apple Blossom Orchard, Little Village Lane, Rainbow Fountain, Benny's School
- Sunflower Meadow, Wishing Pond, Friendship Festival, Moonlight Story Castle

Buildings and grounds are separately illustrated rather than one repeated map texture. Art includes distinct roofs, architectural details, windows, signage, orchards, slides, markets, fountain, park landscaping, trees, flowers, gardens, and soft shadows. The world is original scalable SVG illustration; not a generated 3D environment.

## Interaction
- Pan the town naturally by swiping on an iPad; scroll around the map on desktop or drag using the mouse. Jump buttons make reaching far places easy.
- Zoom in/out on wide screens and center on your cottage.
- Tap or keyboard-select a property to see its details, visit a related activity, buy an unlock, or drive to it.
- Cars travel along city roads between locations. Owned vehicles are shown in the garage and some appear parked by the neighborhood.
- New buildings appear on their own lots when purchased; locked plots remain visible as preview locations.
- Vehicle and building shops show existing unlock prerequisites and spend actual earned Sunshine Coins.

## Save safety and testing
- Kept the existing `kingdom-core-v2.js` economy and `kgj-kingdom-v1` local save. **All existing coins, vehicles, farm crops, reading sessions, and purchased land persist unchanged.**
- `city.html?v=3&test=1` still provides 5,000 **test coins**, all book unlocks, and a dedicated reset; test data uses `kgj-kingdom-city-v2-test-wallet`, completely separate from real coins.
- Shared rewards for reading, writing, and math remain unchanged.
- Navigation in `library.html` now opens `city.html?v=3`.

## Tests
- 24 deterministic mocked-browser assertions passed: startup, 5,000-coin demo mode, wallet separation, 16 unique lots with no rectangular overlaps, map dimensions, buildings with distinct visual elements, responsive CSS, vehicle shop, purchasing the 500-coin truck, purchasing/unlocking castle, and resetting demo coins.
- Browser-native touch movement, performance on a physical iPad, font rendering, voice narration, and visual polish have **not** been verified on real hardware.
- Test-mode and real-mode local saves are per device and browser. They do not synchronize.

## Limitations and roadmap
City 3.0 is a large illustrated **2D** environment, not 3D, and children cannot drag buildings to arbitrary coordinates yet. Cars follow streets rather than full physics simulation. All art is original SVG/CSS; richer commissioned animation and bespoke character sprites could improve visual polish further.

## Links
- [Play City 3.0](https://bosswill720.github.io/kingdom-garden-junior/city.html?v=3)
- [5,000-coin Test City](https://bosswill720.github.io/kingdom-garden-junior/city.html?v=3&test=1)
- [GitHub Source](https://github.com/Bosswill720/kingdom-garden-junior)
