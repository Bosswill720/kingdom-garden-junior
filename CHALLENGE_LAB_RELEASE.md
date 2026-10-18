# Challenge Lab 1.0 — harder reading, writing and math

## Play

- Highest level: https://bosswill720.github.io/kingdom-garden-junior/challenge.html?release=challenge-1&level=2
- Remembered level / Reason default: https://bosswill720.github.io/kingdom-garden-junior/challenge.html?release=challenge-1

A commit alone does not establish successful GitHub Pages deployment. The shipped entry loads versioned modules; its playable URL is confirmed separately after publishing.

## Substantial difficulty increase

Three selectable levels: **Stretch**, **Reason**, **Deep Think**. Reason is the default; the link with `level=2` selects Deep Think. No age gate or automatically inferred reading/math level. This is not an adaptive placement test.

### Reading detectives

Six original stories, **288–456 words each**, in four substantial paragraphs rather than one sentence per page. Two stories at each level:

- Stretch: The Bridge That Bent (288); The Case of the Moving Seeds (304).
- Reason: The Long Way That Worked (358); The Moon Garden Experiment (356).
- Deep Think: Two Plans for One Square (456); The Clock Tower's Missing Ring (452).

Each has four questions: **24 evidence questions total**. A child chooses an answer AND a directly supporting paragraph. The texts and questions address cause, trade-offs, observation versus assumption, fair comparisons, limitations of evidence, conflicting accounts, two-source comparison and counterarguments. Evidence must come from the provided story; optional worked explanations show the reasoning. The stories are fictional reasoning scenarios, not reports of actual experiments.

Reading text can be enlarged. Explicit Hear the story / Stop controls use the device's English speech voice. There are no new natural AI voice recordings, timing files or claimed word-synchronized narration in this module.

### Writers' workshop

Twelve independent composition/editing tasks, four at each level. Targets progress from 3–5 sentences to 5–7 sentences and two short paragraphs. Prompts cover vivid description, opinions with reasons, instructions, editing, alternative decisions, plan comparison, fair tests, balanced recommendations, defensible claims, design constraints and two viewpoints.

Each task includes a planning checklist, sentence-start support, an optional example and an explicit self-review step. Children can type or open a **fixed two-page lined Pencil notebook**. Earlier lines stay visible; page selection does not clear ink. Undo, per-page clear with confirmation, pen priority, Pencil-only filtering, geometry frozen per stroke, pointer cancellation, local draft persistence and picture export are included. The whole notebook stays locked against scrolling while writing. The original tracing desk remains available separately.

This notebook does **not** recognize handwriting, check grammar, count handwritten sentences or grade a paragraph. The self-review requires a nonempty response and checklist confirmation, not proof that the suggested length or learning objective was achieved. A worked example is recorded as support. Starting another completed writing task asks before replacing that task's old draft.

### Math missions

Eight generated mission types across all three levels; five puzzles per completed mission:

1. Delivery Planner — several operations and load/return problems; upper-level multiplication with two-digit quantities.
2. Mystery Machine — missing numbers and working backward through multiply-then-add operations.
3. Fraction Kitchen — equal parts, equivalent fractions, and fractional quantities of a collection.
4. Number Architect — tens/hundreds, regrouping, swapping digits and positive differences.
5. Clockwork Trail — elapsed time across the hour, with extra stops at the highest level.
6. Market Budget — two-item costs, bundle costs, change and greatest affordable whole quantity.
7. Pattern Detective — explicitly stated arithmetic, increasing-jump or double-then-add rules.
8. Clue Chest — uniquely determined two-/three-digit numbers from combined constraints.

Answers are entered instead of guessed from a multiple-choice list. Equivalent fractions and valid hour:minute answers are accepted. A strategy hint, complete worked solution and private thinking notebook are available. No countdown, speed penalty, lost lives or mandatory level promotion. Asking for help still earns the same practice reward. A feedback choice (Too easy / Good challenge / Need more support) is saved for the grown-up; it does not automatically alter difficulty.

## Shared coins and preservation

No existing reading, writing, math, city, artwork or economy module is replaced. `kingdom-core-v2.js` remains unchanged. `library.html` only loads the new navigation-only `challenge-nav-v1.js`; the new link appears on the library sidebar and home/library screen, without cluttering the story reader. The previous learning screens remain available through explicit links.

`challenge-wallet-v1.js` uses the established `kgj-kingdom-v1` wallet and the same Web Locks key. It validates before writing, backs up the previous wallet, and uses persistent unique completion claims to prevent repeat deposits. Writing still earns 4 coins, five math questions 7, a new challenge story 10, same-day completed rereads 3 and eligible later-day rereads 5. Supported completion receives the same base rewards. A failed deposit remains pending with a Retry coin save control rather than claiming payment succeeded.

Challenge reading dates are added as `challengeReadDays` in that wallet; the original thirty-title reading unlock counter and vehicle gates are not changed. Existing vehicles, land, farm and flowers are retained. Notebook interaction does not advance crops or award coins by itself. Challenge coins are the normal earned wallet, not the city's separate testing funds.

Learning progress, one unfinished activity, local text and two-page ink drafts use `kgj-challenge-v1`, with a recovery snapshot. Backups include Challenge Lab data only—not the city wallet or original writing/math badges. Restore is validated and confirmed and cannot reissue an already-claimed reward. Corrupt challenge data is preserved, not overwritten. Shared-wallet corruption prevents deposits rather than replacing the wallet. Storage-unavailable play is clearly temporary. No cloud sync, accounts, microphone, analytics, handwriting upload, API key or real-money purchases are introduced.

## Verification actually performed

- **24,000 generated questions** checked against independently recomputed answers from their prompts. Included deterministic generation, unique mystery-number solutions, numeric bounds, answer parsing, time normalization and equivalent fractions.
- **67 additional Node assertions** covering data shape, word counts, paragraph evidence, all shared reward types, same-/later-day reading, duplicate prevention, reopening, locks, preserved ownership, corruption and write failures.
- **220 complete-page Chromium assertions** using the actual authored HTML/CSS/JS, exact current wallet core (Git blob e2c3c0fde6bb71e68d8864cfcec84219b834670c), real math/read flows and the notebook. All six reading investigations and all 24 math mission/level combinations were completed through controls. Checked help/retry rewards, mouse ink, synthetic Pencil and touch filtering, page lock, two notebook pages, persistence and five viewport sizes (1440×900, 1112×834, 834×1112, 390×844, 320×700). No uncaught JavaScript errors observed.

The authoring environment blocks browser URL/file navigation and external network access. Browser tests loaded the whole page with `page.set_content`, with explicit browser-storage and speech substitutes. They are not a live GitHub Pages test, a physical iPad/Safari/Apple Pencil test or an audible voice test. Screenshots were reviewed; a fixed notebook screenshot should be captured as a viewport image, not a full-document image.

These tests do not establish educational effectiveness, grade-level mastery, standardized reading level or full curriculum coverage. The notebook has practical limits (two pages/task, 500 strokes/page and 80 saved drafts); export before approaching storage limits. Use one active reward/purchase tab when Web Locks are unavailable.

## Reproduce

```
node tests/challenge/core.test.cjs
python tests/challenge/browser_test.py
```

Browser tests require Playwright and a Chromium executable. Without `--base-url` they run explicitly labeled full-page fixtures with storage/speech substitutes. The fixture is the tested mode in this environment. For a normal local-server testing environment, adapt the storage/speech assertions as needed and pass `--base-url http://127.0.0.1:8000`; do not report an unrun HTTP suite as passed.

## Learning references

Selected tasks were informed by these primary standards descriptions, without claiming complete alignment or certification:
- Evidence-based reading responses: https://www.thecorestandards.org/ELA-Literacy/RL/3/
- Reasons, explanatory writing and revision: https://www.thecorestandards.org/ELA-Literacy/W/3/
- Multi-step problems and multiplication/division: https://www.thecorestandards.org/Math/Content/3/OA/
- Equal parts and equivalent fractions: https://www.thecorestandards.org/Math/Content/3/NF/

## Rollback

Revert this additive release. No force-push or existing learning-data reset is needed. The base wallet accepts the added activity claims and challenge reading dates; a rollback should preserve them. The current city and easier activities are unchanged by removal of the new Challenge Lab entry files.
