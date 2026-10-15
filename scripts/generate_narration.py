#!/usr/bin/env python3
"""Generate original Kingdom Garden narration using a private OpenAI API key.
Run manually. Never put credentials in repository or browser JavaScript.
"""
import json, os, pathlib, re, time, urllib.request, urllib.error

ROOT = pathlib.Path(__file__).resolve().parents[1]
API_KEY = os.environ.get("OPENAI_API_KEY")
if not API_KEY:
    raise SystemExit("Missing OPENAI_API_KEY environment secret")
source = (ROOT / "library.html").read_text(encoding="utf-8")
match = re.search(r"const stories=(\[.*?\]);const \$=", source, re.S)
if not match:
    raise SystemExit("Cannot locate original library stories; stop rather than generate wrong audio.")
stories = json.loads(match.group(1))
initial = [
    ["Pip is a little fox.", "Pip likes to play.", "Look! A shiny seed!"],
    ["Pip digs a hole.", "He puts the seed in.", "He gives it water."],
    ["The sun is warm.", "The rain comes down.", "Pop! A green sprout!"],
    ["The flower is big.", "It glows at night.", "Pip is so happy!"]
]
out = ROOT / "audio"
out.mkdir(exist_ok=True)
def generate(text, destination):
    destination.parent.mkdir(parents=True, exist_ok=True)
    if destination.exists() and destination.stat().st_size > 1000:
        print("Already generated:", destination.relative_to(ROOT))
        return
    payload = json.dumps({
        "model": "gpt-4o-mini-tts",
        "voice": "nova",
        "input": text,
        "instructions": "Read as a warm, kind, expressive American English female storybook narrator for a five-year-old. Use gentle natural pauses, clear words, playful but not exaggerated emotion, and a calm reassuring pace.",
        "response_format": "mp3"
    }).encode()
    req = urllib.request.Request("https://api.openai.com/v1/audio/speech", data=payload, headers={
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
    }, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=120) as response:
            audio = response.read()
    except urllib.error.HTTPError as e:
        raise SystemExit("Speech generation failed with HTTP " + str(e.code) + ": " + e.read().decode(errors="replace")[:300])
    if len(audio) < 1000:
        raise SystemExit("Generated audio unexpectedly small; not saving.")
    destination.write_bytes(audio)
    print("Generated:", destination.relative_to(ROOT), len(audio), "bytes")
    time.sleep(.15)

for i, lines in enumerate(initial, 1):
    generate(" ".join(lines), out / f"page-{i}.mp3")
(out / "manifest.json").write_text(json.dumps({"pages":[{"src":f"audio/page-{i}.mp3"} for i in range(1,5)]}, indent=2)+"\n", encoding="utf-8")
for i, story in enumerate(stories, 1):
    for j, line in enumerate(story[2], 1):
        generate(line, out / f"story-{i}" / f"page-{j}.mp3")
print("Complete: 68 page recordings generated or reused. Word timing intentionally omitted until forced alignment is available.")
