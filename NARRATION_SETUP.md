# Kingdom Garden Junior — Natural narration

The website already supports native iPad speech. The new player also supports **prerecorded narration** with optional word-level timing.

## Create the audio

Use a reputable TTS provider (for example OpenAI TTS or ElevenLabs) in a private/local environment. Choose a warm, friendly female-sounding American English voice. Speak at a gentle children's-story pace, with natural pauses. Do not generate audio in browser with a secret API key.

Generate four audio files, one for each page. Use these exact scripts:

1. **Pip Finds a Seed:** "Pip is a little fox. Pip likes to play. Look! A shiny seed!"
2. **Plant the Seed:** "Pip digs a hole. He puts the seed in. He gives it water."
3. **A Little Sprout:** "The sun is warm. The rain comes down. Pop! A green sprout!"
4. **A Magic Flower:** "The flower is big. It glows at night. Pip is so happy!"

Save as `audio/page-1.mp3` through `audio/page-4.mp3`.

## Manifest

Create `audio/manifest.json`:

```json
{
  "pages": [
    {"src":"audio/page-1.mp3"},
    {"src":"audio/page-2.mp3"},
    {"src":"audio/page-3.mp3"},
    {"src":"audio/page-4.mp3"}
  ]
}
```

When the manifest and audio files are committed, the website will use the recordings automatically. Until then, Safari's built-in narration remains available.

## Accurate highlighting

Each page may optionally include a `words` array of timestamped objects:

```json
{"src":"audio/page-1.mp3","words":[{"start":0.12,"end":0.44},{"start":0.44,"end":0.68}]}
```

**Do not use estimated timestamps.** Word boundaries must be obtained from forced alignment or a speech provider that returns actual word-level timing, then checked against the recorded audio. The timestamps are seconds from the start of that page's audio and must match the rendered words in exact order. If no valid timestamps exist, omit `words` and the player will not pretend to highlight words accurately.

## API credentials and cost

GitHub Pages serves static files only. It cannot securely store a TTS API key. Generate audio locally or in a protected CI environment using an API key stored as a secret, then upload the resulting MP3s and manifest. Never put the key in HTML, JavaScript, the repository, or the public site. Speech synthesis services generally bill by usage; verify current pricing and voice licensing with your selected provider.

## iPad verification

Open the Pages URL in Safari, tap **Read My Story**, then **Read to Me**. With recorded audio installed, the status should say **Natural narrator**. Otherwise it should say **Built-in narration**. Verify play/pause, replay, page changes, tapping words, and garden rewards. Safari playback must start after a user tap.

This is a children's reading demo. No child accounts or personal data are needed.
