# Challenge Lab — harder reading, writing and math

## Open after deployment

- [Start directly in Deep Think](https://bosswill720.github.io/kingdom-garden-junior/challenge.html?release=challenge-1&level=2)
- [Choose any challenge level](https://bosswill720.github.io/kingdom-garden-junior/challenge.html?release=challenge-1)
- [Original learning app](https://bosswill720.github.io/kingdom-garden-junior/library.html?release=challenge-1#home)

This is a new advanced track, not a replacement for the original beginner activities. The main library home and story shelf include a prominent Challenge Lab entry. Difficulty is selectable by task readiness, not a maximum based on the child's age. The direct link above selects the hardest tier without a prerequisite quiz.

## Implemented content

### Reading detectives

Six original multi-paragraph stories, each followed by four questions that require both an answer and a supporting paragraph. Narration, larger text, rereading and worked explanations are available. These are substantially longer texts than the original one-line pages.

| Tier | Story | Word count |
|---|---|---:|
| Stretch | The Bridge That Bent | 288 |
| Stretch | The Case of the Moving Seeds | 304 |
| Reason | The Long Way That Worked | 358 |
| Reason | The Moon Garden Experiment | 356 |
| Deep Think | Two Plans for One Square | 456 |
| Deep Think | The Clock Tower's Missing Ring | 452 |

Topics include cause and effect, fair testing, observations versus assumptions, constrained planning, comparing two sources, sampling limitations, reconciling accounts, and the limits of a conclusion. All 24 questions include explicit evidence keys and explanations. Reading questions are selected-response plus evidence selection, not automated free-response assessment.

### Writers' workshop

Twelve original response tasks, four in each tier. They move beyond tracing: descriptive scenes, supported opinions, instructions, editing, persuasive paragraphs, alternative outcomes, comparing plans, designing tests, balanced recommendations, supported claims, engineering trade-offs, and two viewpoints.

Targets range from three or four original sentences to two short paragraphs. Each task has a plan, optional starter language, a worked example, and three self-review points. Responses may be typed or written in a locked two-page Pencil notebook. The notebook accepts pen/touch/mouse, has Pencil-only filtering, undo, clear-page confirmation and picture export. Both text and normalized pen strokes persist locally in the Challenge Lab save. It is not native PencilKit palm rejection, handwriting recognition, grammar scoring, or proof that the requested response was independently produced. A child or grown-up reviews the response.

### Math missions

Ten mission types across three selectable tiers. Each completed adventure includes five generated puzzles. Answers are entered rather than selected from a short multiple-choice list. Every question includes a specific strategy hint and a complete worked explanation.

- Delivery Planner: multi-step loading, delivery, returns and equal sharing.
- Mystery Machine: unknown inputs, reversing up to three operations.
- Fraction Kitchen: equal parts, equivalent fractions, and fractions of a remaining quantity.
- Number Architect: tens/hundreds, regrouping, digit exchanges and a further division step.
- Clockwork Trail: elapsed time across hours, including separate driving and rest durations.
- Market Budget: item bundles, multiple purchases and greatest affordable whole quantities.
- Pattern Detective: explicit rules, changing increments and doubling with an adjustment.
- Clue Chest: two- and three-digit numbers satisfying several constraints.
- Garden Geometry: perimeter, missing sides from area, and area inferred from perimeter.
- Fair Share Workshop: equal groups, remainders, and box-content reasoning.

For example, a Deep Think mission can require `(boxes × books − delivered + returns) ÷ classrooms`, not just a larger single addition. Another uses part of a collection, then a different fraction of what remains. A numeric notebook is available for scratch work; it does not recognize written answers. Final answers are typed. There are no timers, lives or penalties for taking time.

## Same city wallet

The existing `kingdom-core-v2.js` is not changed. Challenge completions use the existing `kgj-kingdom-v1` wallet and its lock name.

| Activity completion | Coins |
|---|---:|
| First completion of each advanced story investigation | 10 |
| Another completed attempt that same day | 3 |
| Eligible later-day completion | 5 |
| Written response with self-review | 4 |
| Five math questions | 7 |

Hints or worked explanations do not remove the base reward. They are recorded as supported practice. Completion events carry unique identifiers; retries/reloads do not pay the same event twice. A failed deposit stays pending with a retry option.

Advanced-story bookkeeping is additional metadata in the same wallet; the original 30-book completion list, original farm-growth rules, vehicle prices and book gates are not modified. Advanced stories earn spendable coins but do not increment those legacy 30-book unlock gates. Traffic, city layouts, original writing badges and original math stickers are not altered.

## Saves and privacy

`kgj-challenge-v1` contains challenge settings, completed attempts, the unfinished activity, and local text/ink drafts. A recovery copy is kept before replacing a saved version. Bad data is not silently overwritten. The Challenge Lab export/import covers its own records and notebook drafts, not the city wallet, city placement, or older module saves. Restoring it does not reissue already-paid coin transactions.

Two notebook pages are available per draft. Limits are 80 draft entries, 500 recorded completions, 500 pen strokes per page, and 8,000 text characters per response. Export before clearing browser data; storage is local, not cross-device cloud sync. Browsers without usable storage show a temporary-progress warning. With no browser Web Locks, use one tab for reward/purchase actions.

No new accounts, microphones, uploaded handwriting, advertisements, paid APIs or natural-narration recordings are introduced. Spoken guidance uses the device voice. No full-curriculum, age-placement, grade-certification or validated-learning-effectiveness claim is made.

## Verification actually performed

The first complete validation run was [GitHub Actions 39112013632](https://github.com/Bosswill720/kingdom-garden-junior/actions/runs/39112013632), on candidate commit `a69b4ffb6c7d9593265999c2bf03c8d7103d08b8`.

- 30,000 generated questions exercised across 10 missions and three levels. All generated answers were accepted and invalid answers rejected. 14,000 harder/added questions were additionally checked using separate expected-result calculations, including valid loading bounds and unique logic solutions.
- 118 content/wallet assertions passed: story lengths, evidence keys, writing scaffolds, answer formats, same-day/later rereads, new attempts, duplicate transactions, reloads, original asset preservation, corrupt wallets, and explicit temporary storage.
- 263 full-page Chromium assertions passed. The tests used real HTTP navigation to the authored page and real browser localStorage on a GitHub runner, not a mock DOM or `set_content` substitute. They completed all 30 game/tier combinations, all six reading investigations, all twelve writing tasks, assisted rereading, reward deposits, actual mouse strokes, synthetic pen input, two-page notebook operation, reload persistence, export/import and four viewport sizes. No uncaught page errors were observed.
- Speech output was replaced by an invocation spy in those browser tests. Audible device speech and physical iPad/Safari/Apple Pencil operation remain unverified.
- Screenshots were captured and reviewed at actual browser dimensions. They are test captures, not new generated artwork.

The workflow reruns on the final branch/PR. After merging, its main-branch run additionally waits for nine deployed files to match the checkout byte-for-byte, opens the public Pages app, completes a Deep Think mission and checks its 7-coin reward, then verifies the new library entry point. A commit or an earlier green test alone does not imply that this post-deployment step has passed; inspect the final run.

## Reproduce

```sh
node tests/challenge/core.test.cjs
python -m pip install playwright==1.55.0
python -m playwright install --with-deps chromium
python tests/challenge/browser_test.py
# Only after publishing this exact checkout:
python tests/challenge/live_smoke.py
```

GitHub Actions retains JSON reports and screenshots as `challenge-lab-test-reports`. These use synthetic test progress, not a child's real saved work.

## Release and rollback

Developed on `feature/challenge-learning-1`. The release adds the Challenge Lab modules and one launch script in `library.html`. Original reading, writing, math, city and economy source modules remain unchanged. Merge as one reviewed change; never force-push. Reverting the release hides the advanced track but does not delete its local records or reset city coins and purchases.
