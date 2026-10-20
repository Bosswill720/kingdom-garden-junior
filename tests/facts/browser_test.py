"""Actual page checks. Default: real HTTP/localStorage. --fixture for restricted authoring."""
import argparse, functools, http.server, json, re, threading
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'reports';OUT.mkdir(exist_ok=True)
ap=argparse.ArgumentParser();ap.add_argument('--fixture',action='store_true');args=ap.parse_args()
checks=[];errors=[]
def check(name,v):
 if not v:raise AssertionError(name)
 checks.append(name)
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=None
if not args.fixture:
 server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
 threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
html=(ROOT/'facts.html').read_text()
html=re.sub(r'<link rel="stylesheet" href="./([^?]+)\?[^\"]+">',lambda m:'<style>'+(ROOT/m[1]).read_text()+'</style>',html)
html=re.sub(r'<script src="./([^?]+)\?[^\"]+"></script>',lambda m:'<script>'+(ROOT/m[1]).read_text()+'</script>',html)
def load(page,test=False,data=None):
 if args.fixture:
  fixture="<script>(()=>{window.__data="+json.dumps(data or {})+";Object.defineProperty(window,'localStorage',{configurable:true,get:()=>({getItem:k=>window.__data[k]??null,setItem:(k,v)=>window.__data[k]=String(v),removeItem:k=>delete window.__data[k]})});window.__OriginalParams=window.__OriginalParams||window.URLSearchParams;window.URLSearchParams=class extends window.__OriginalParams{constructor(s){super(s||"+json.dumps('test=1' if test else '')+")}};})();</script>"
  page.set_content(html.replace('<head>','<head>'+fixture),wait_until='load')
 else:
  page.goto(base+'facts.html'+('?test=1' if test else ''),wait_until='load')
 page.wait_for_selector('.problem')
def snapshot(page):return page.evaluate('KGFactPractice.getSession()')
def wallet(page,test=False):return page.evaluate('(k)=>JSON.parse(localStorage.getItem(k))','kgj-kingdom-city-v2-test-wallet' if test else 'kgj-kingdom-v1')
def fill(page,skip=()):
 for i,q in enumerate(page.evaluate('KGFactPractice.getQuestions()')):
  if i not in skip:page.locator(f'#a{i}').fill(str(q['answer']))
def new(page,set='doubles',level='0',count='20'):
 page.locator('#set').select_option(set);page.locator('#level').select_option(level);page.locator('#count').select_option(count);page.locator('#settings button').click()
with sync_playwright() as p:
 import shutil
 executable=shutil.which('chromium') if args.fixture else None
 browser=p.chromium.launch(**({'executable_path':executable} if executable else {}),headless=True,args=['--no-sandbox'])
 pg=browser.new_page(viewport={'width':834,'height':1112});pg.on('pageerror',lambda e:errors.append(str(e)));pg.on('dialog',lambda d:d.accept());load(pg)
 check('20 default questions',pg.locator('.problem').count()==20)
 qs=pg.evaluate('KGFactPractice.getQuestions()');check('all doubles',all(q['a']==q['b'] for q in qs));check('0–9 twice',all(sum(q['a']==n for q in qs)==2 for n in range(10)))
 check('vertical 5-column tablet layout',pg.locator('#questions').evaluate('(e)=>getComputedStyle(e).gridTemplateColumns.split(" ").length')==5)
 pg.screenshot(path=str(OUT/'facts-tablet.png'),full_page=True)
 pg.locator('#check').click();check('empty answers get no reward',not pg.locator('#collect').is_visible());pg.locator('#a0').fill('999');pg.locator('#check').click();check('wrong answer remains retryable',snapshot(pg)['responses'][0]['status']=='retry');fill(pg);pg.locator('#check').click();check('all20 checked',pg.locator('#progress').inner_text()=='20 / 20 checked');pg.locator('#collect').click();pg.wait_for_function('KGFactPractice.getSession().paid.length===4');check('28 coins deposited',wallet(pg)['coins']==28)
 if args.fixture:
  saved=pg.evaluate('window.__data');load(pg,data=saved)
 else:pg.reload();pg.wait_for_selector('.problem')
 check('reload cannot double pay',wallet(pg)['coins']==28 and not pg.locator('#collect').is_visible());check('finished answers locked',pg.locator('#a0').is_disabled())
 for s in ['near','addition','subtraction']:
  new(pg,s,'2','10');fill(pg);pg.locator('#check').click();check(s+'two-digit checked',pg.locator('#collect').is_visible());pg.locator('#collect').click();pg.wait_for_function('KGFactPractice.getSession().paid.length===2')
 check('all kinds award into same wallet',wallet(pg)['coins']==70)
 new(pg,'doubles','0','20');pg.locator('[data-write="0"]').first.click();pg.wait_for_selector('#desk[open]');check('fixed handwriting desk opens',pg.locator('#desk').evaluate('(e)=>getComputedStyle(e).position')=='fixed')
 rect=pg.locator('#ink').bounding_box();pg.mouse.move(rect['x']+40,rect['y']+45);pg.mouse.down();pg.mouse.move(rect['x']+100,rect['y']+85,steps=10);pg.mouse.up();check('mouse strokes saved',len(snapshot(pg)['responses'][0]['ink'])==1)
 y=pg.evaluate('scrollY');pg.mouse.wheel(0,500);pg.wait_for_timeout(50);check('writing page stays fixed',pg.evaluate('scrollY')==y)
 pg.locator('#pencilOnly').check()
 pg.evaluate("""()=>{const c=document.getElementById('ink'),r=c.getBoundingClientRect();for(const type of ['pointerdown','pointerup'])c.dispatchEvent(new PointerEvent(type,{pointerId:71,pointerType:'touch',clientX:r.x+120,clientY:r.y+50,bubbles:true,cancelable:true}));}""")
 check('Pencil-only rejects finger',len(snapshot(pg)['responses'][0]['ink'])==1)
 pg.evaluate("""()=>{const c=document.getElementById('ink'),r=c.getBoundingClientRect();for(const [type,x]of [['pointerdown',160],['pointermove',190],['pointerup',210]])c.dispatchEvent(new PointerEvent(type,{pointerId:73,pointerType:'pen',clientX:r.x+x,clientY:r.y+75,bubbles:true,cancelable:true}));}""")
 check('synthetic Pencil accepted',len(snapshot(pg)['responses'][0]['ink'])==2)
 pg.screenshot(path=str(OUT/'facts-pencil.png'))
 pg.locator('#saveInk').click();fill(pg,skip=(0,));pg.locator('#check').click();check('ink is not falsely auto-graded',not pg.locator('#collect').is_visible() and snapshot(pg)['responses'][0]['status']=='open');pg.locator('#review').click();check('answer key for human review',pg.locator('#reviews .review-item').count()==1);pg.locator('[data-reviewed="0"]').check();pg.locator('#closeReview').click();check('explicit review allows completion',pg.locator('#collect').is_visible());pg.locator('#collect').click();pg.wait_for_function('KGFactPractice.getSession().paid.length===4');check('reviewed page receives28',wallet(pg)['coins']==98)
 new(pg);pg.locator('#a0').fill('12')
 if args.fixture:
  saved=pg.evaluate('window.__data');load(pg,data=saved)
 else:pg.reload();pg.wait_for_selector('.problem')
 check('unfinished answer persists',pg.locator('#a0').input_value()=='12')
 for width,height in [(1112,834),(834,1112),(390,844),(320,700)]:
  pg.set_viewport_size({'width':width,'height':height});check(f'no horizontal overflow{width}',pg.evaluate('document.documentElement.scrollWidth<=innerWidth'))
  pg.locator('[data-write="1"]').first.click();rect=pg.locator('#ink').bounding_box();check(f'canvas visible{width}',rect['width']>50 and rect['height']>45 and rect['x']>=0 and rect['y']>=0 and rect['y']+rect['height']<=height+1);pg.locator('#closeDesk').click()
  if width==390:pg.screenshot(path=str(OUT/'facts-phone.png'),full_page=True)
 # Test mode shares ONLY the test-city wallet; keep real progress intact.
 before=wallet(pg)
 data=pg.evaluate('window.__data') if args.fixture else None
 load(pg,test=True,data=data);check('test wallet starts5000',wallet(pg,True)['coins']==5000);fill(pg);pg.locator('#check').click();pg.locator('#collect').click();pg.wait_for_function('KGFactPractice.getSession().paid.length===4');check('test reward5000+28',wallet(pg,True)['coins']==5028);check('real wallet unaffected',wallet(pg)==before)
 check('no uncaught page errors',not errors)
 report={'status':'passed','mode':'full-page fixture' if args.fixture else 'real HTTP/localStorage','checks':len(checks),'assertions':checks,'errors':errors};(OUT/'facts-browser.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2));browser.close()
if server:server.shutdown()
