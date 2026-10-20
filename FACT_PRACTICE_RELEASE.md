# Fact Practice 1.0 — stacked arithmetic worksheets

[Open Fact Practice](https://bosswill720.github.io/kingdom-garden-junior/facts.html?release=facts-1)

The supplied homework photograph was used only to understand the requested question format. The photo, handwriting, child's name and publisher artwork are not included in this repository. Questions are original generated arithmetic facts, not scanned textbook pages.

## Added experience

- The default worksheet contains twenty vertical **doubles** problems. Each addend from 0 through 9 appears twice in shuffled order, including 0 + 0 and 9 + 9.
- Numbers are stacked vertically, right-aligned above a horizontal answer line. Tablets/desktop use a five-column worksheet; smaller phones use two columns with large controls. The page can scroll normally; the Pencil answer desk cannot.
- Choose 10 or 20 questions, and generate a fresh shuffled page. Optional near-doubles, mixed addition and related subtraction preserve the same format. Ranges start with 0–9, then 10–20, then 21–50; a near-double's second operand is one more, subtraction uses the corresponding addition total, and results can exceed those starting ranges.
- Type a number into each answer box and press **Check my page**. Blank answers remain open; incorrect answers can be retried. Zero is a valid answer. Correct/reviewed status persists locally. Enter moves to the next available typed answer.
- Tap **Pencil** for a fixed, large question-and-answer desk. Apple Pencil-style pen input, finger and mouse marks, pen priority, Pencil-only filtering, undo, clear with confirmation, and normalized local ink storage are implemented. The input rectangle is held fixed through each stroke. Drawing outside the canvas does not pan the desk.
- Handwritten answers use **Review handwriting**: a grown-up compares the visible writing with the answer key and explicitly confirms each response. This is not handwriting recognition, OCR, automatic grading or evidence of independent mastery.
- Optional spoken question uses the device English voice; no recordings or paid service is added. Printing uses the browser's print dialog. Export saves this worksheet's responses and ink as JSON, not the city or other learning records.

## Entry points and preservation

`facts-link-v1.js` adds a fact-practice banner to the original Math Playground home and the Challenge Lab's Math missions home. `math.html` and `challenge.html` only load this navigation script. The ten advanced math missions, reading, writing, City 4, their saved data, and `kingdom-core-v2.js` are not replaced.

The new page stores one current worksheet under `kgj-facts-v1`, with a recovery snapshot. Starting a new page asks before replacing unfinished work. It does not clear city coins or purchases. Malformed stored facts are not silently overwritten. Browser storage failure is reported; temporary-memory rewards are labeled rather than claimed saved. Use Export to keep a completed page before creating another. There is no cross-device synchronization.

## Coin rewards

Keep the existing math rate: **7 coins per five completed facts**. Thus a checked/reviewed 10-question page records 14 coins; a 20-question page records 28. The child presses Finish & collect after the whole page is checked. Hints and reviewed handwriting do not remove the reward.

Each five-question reward has a stable session/batch transaction ID in the existing shared wallet. Double clicks, reloading and partial-failure retries cannot pay the same batch twice. A new genuinely completed page can earn another reward. Pending coins remain retryable before starting another page. The original wallet, books, prices, vehicles and crops are unchanged.

An optional `facts.html?release=facts-1&test=1` uses the existing separate test-city wallet and a separate `kgj-facts-v1-test` worksheet key. A missing test wallet starts with 5,000 coins. Existing test purchases are preserved. Test rewards never modify the real wallet.

## Verification

Before publishing, the authoring environment ran:
- 240,000 generated question cases: four fact sets, three ranges, 1,000 seeds and twenty questions per case group. Checked arithmetic, deterministic ordering, doubles balance and answer parsing.
- 26 additional validation/wallet assertions: unfinished pages, malformed ink, correct zero handling, existing assets, repeated completion, partial reward failure and retry, and the 10/20-question reward amounts.
- 36 full authored-page Chromium assertions with explicit storage/query substitutes, because browser URL navigation is blocked in the authoring environment. Checked keypad completion, Pencil/touch filtering, non-scrolling desk, manual review, persistence, responsive viewports and separate test coins. Screenshots were reviewed.

The added GitHub Actions workflow runs the same browser checks over real HTTP with real localStorage, then (on main only) waits for seven public Pages files to match its checkout and completes a real public-page worksheet in an isolated test browser. It checks 28 test coins and both math launch links. These CI/live stages must be checked for the actual released commit; writing this document alone does not imply they passed.

Physical iPad/Safari/Apple Pencil operation and audible speech have not been tested. The handwriting desk is browser-based, not native PencilKit. Human confirmation of a handwritten answer is not an automated accuracy score. No educational-effectiveness or standardized grade-placement claim is made.

## Repeatable commands

```sh
node tests/facts/core.test.cjs
python -m pip install playwright==1.55.0
python -m playwright install --with-deps chromium
python tests/facts/browser_test.py
# Only after this exact checkout has been deployed:
python tests/facts/live_smoke.py
```

`--fixture` is an explicitly labeled browser-test alternative for a URL-restricted environment; do not report it as a live-site or device test. The user-uploaded photograph is not a test artifact.
