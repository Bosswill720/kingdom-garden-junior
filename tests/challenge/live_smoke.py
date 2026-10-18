"""Post-deploy check from a GitHub runner. No access to a child's browser data."""
import hashlib,json,pathlib,time,urllib.request
from playwright.sync_api import sync_playwright
ROOT=pathlib.Path(__file__).resolve().parents[2]
BASE='https://bosswill720.github.io/kingdom-garden-junior/'
FILES=['challenge.html','challenge-v1.css','challenge-core-v1.js','challenge-deep-v1.js','challenge-reading-v1.js','challenge-wallet-v1.js','challenge-app-v1.js','challenge-link-v1.js','library.html']
last=[]
for attempt in range(30):
    last=[]
    for name in FILES:
        try:
            req=urllib.request.Request(BASE+name+'?verify='+str(time.time_ns()),headers={'Cache-Control':'no-cache'})
            with urllib.request.urlopen(req,timeout=20) as response: payload=response.read()
            if payload!=(ROOT/name).read_bytes():last.append(name+' content mismatch')
        except Exception as exc:last.append(name+': '+str(exc))
    if not last:break
    time.sleep(5)
else:raise AssertionError('Published files did not match this checkout: '+str(last))
errors=[]
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':1112,'height':834})
    page.on('pageerror',lambda error:errors.append(str(error)))
    page.goto(BASE+'challenge.html?release=challenge-1&level=2',wait_until='networkidle')
    assert page.locator('[data-level="2"]').get_attribute('aria-pressed')=='true'
    page.click('[data-tab="math"]');assert page.locator('.card').count()==10
    page.click('[data-id="machine"]')
    for _ in range(5):
        question=page.evaluate('KGChallenge.getQuestion()')
        assert question['level']==2
        page.fill('#answer',str(question['answer']));page.click('#checkMath');page.click('#next')
    page.wait_for_selector('.completed')
    assert page.evaluate("JSON.parse(localStorage.getItem('kgj-kingdom-v1')).coins")==7
    page.goto(BASE+'library.html?release=challenge-1#home',wait_until='networkidle')
    page.wait_for_selector('#challengeBanner')
    assert page.locator('#challengeBanner a').get_attribute('href').startswith('./challenge.html')
    assert not errors,errors
    page.screenshot(path=str(ROOT/'reports/live-library-challenge-link.png'),full_page=True)
    browser.close()
report={'status':'passed','verifiedFiles':FILES,'liveURL':BASE+'challenge.html?release=challenge-1&level=2','browser':'Chromium on GitHub runner','coinTest':'complete one Deep Think five-question mission; exactly 7 coins in isolated runner browser','errors':errors}
(ROOT/'reports/challenge-live.json').write_text(json.dumps(report,indent=2));print(json.dumps(report))
