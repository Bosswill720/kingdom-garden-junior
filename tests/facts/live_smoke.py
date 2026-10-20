"""Verify exact published source and play a synthetic, isolated test-wallet worksheet."""
from pathlib import Path
import time,urllib.request,json
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[2];BASE='https://bosswill720.github.io/kingdom-garden-junior/'
files=['facts.html','facts-v1.css','facts-core-v1.js','facts-app-v1.js','facts-link-v1.js','math.html','challenge.html']
last=None
for attempt in range(30):
 try:
  for f in files:
   req=urllib.request.Request(BASE+f+'?verify='+str(time.time_ns()),headers={'Cache-Control':'no-cache'})
   with urllib.request.urlopen(req,timeout=20) as r: actual=r.read()
   assert actual==(ROOT/f).read_bytes(),f+' does not yet match this checkout'
  break
 except Exception as e:
  last=e;time.sleep(10)
else:raise RuntimeError('Published release could not be verified: '+str(last))
with sync_playwright() as p:
 b=p.chromium.launch(headless=True);pg=b.new_page(viewport={'width':834,'height':1112});errors=[];pg.on('pageerror',lambda e:errors.append(str(e)))
 pg.goto(BASE+'facts.html?release=facts-1&test=1',wait_until='networkidle');pg.wait_for_selector('.problem')
 assert pg.locator('.problem').count()==20
 for i,q in enumerate(pg.evaluate('KGFactPractice.getQuestions()')):pg.locator('#a'+str(i)).fill(str(q['answer']))
 pg.locator('#check').click();pg.locator('#collect').click();pg.wait_for_function('KGFactPractice.getSession().paid.length===4')
 assert pg.evaluate('JSON.parse(localStorage.getItem("kgj-kingdom-city-v2-test-wallet")).coins')==5028
 assert pg.evaluate('localStorage.getItem("kgj-kingdom-v1")') is None
 pg.goto(BASE+'math.html?release=facts-1',wait_until='networkidle');pg.wait_for_selector('[data-facts-launch]')
 pg.goto(BASE+'challenge.html?release=facts-1',wait_until='networkidle');pg.locator('[data-tab="math"]').click();pg.wait_for_selector('[data-facts-launch]')
 assert not errors,errors
 (ROOT/'reports').mkdir(exist_ok=True);(ROOT/'reports'/'facts-live.json').write_text(json.dumps({'status':'passed','matchedFiles':files,'typedFactsCompleted':20,'testCoins':5028,'realWalletUntouched':True,'entryLinks':2,'errors':errors},indent=2));b.close()
print('Published files match; live 20-question worksheet awarded 28 test coins; both math entry links work.')
