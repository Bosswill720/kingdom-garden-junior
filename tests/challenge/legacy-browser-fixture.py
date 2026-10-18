"""Full authored-page tests. --fixture explicitly substitutes storage/speech.
HTTP navigation is restricted in the authoring environment; not a real-iPad test.
Run locally with: python tests/challenge/browser_test.py --base-url http://127.0.0.1:8000
"""
from pathlib import Path
import argparse, json, re
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT.parent/'reports';OUT.mkdir(exist_ok=True)
parser=argparse.ArgumentParser();parser.add_argument('--base-url');args=parser.parse_args()
fixture=r'''<script>
window.__storageData={}; Object.defineProperty(window,'localStorage',{configurable:true,get(){return {getItem:k=>window.__storageData[k]??null,setItem:(k,v)=>window.__storageData[k]=String(v),removeItem:k=>delete window.__storageData[k]};}});
window.__spoken=[];window.SpeechSynthesisUtterance=function(t){this.text=t;};Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{getVoices:()=>[],cancel(){window.__cancelled=(window.__cancelled||0)+1;},speak(u){window.__spoken.push(u.text);}}});
</script>'''
html=(ROOT/'challenge.html').read_text()
html=re.sub(r'<link rel="stylesheet" href="./([^"?]+)[^"]*">',lambda m:'<style>'+(ROOT/m[1]).read_text()+'</style>',html)
html=re.sub(r'<script src="./([^"?]+)[^"]*"></script>',lambda m:'<script>'+(ROOT/m[1]).read_text()+'</script>',html)
html=html.replace('</head>',fixture+'</head>')
checks=[]
def check(name,condition):
 if not condition: raise AssertionError(name)
 checks.append(name)
def load(page):
 if args.base_url:page.goto(args.base_url.rstrip('/')+'/challenge.html',wait_until='load')
 else:page.set_content(html,wait_until='load')
 page.wait_for_function('window.KGChallenge && document.querySelector(".cards .card")')
def click(page,a):page.locator(f'[data-act="{a}"]').first.click()
def home(page):page.locator('#home').click()
def question(page):return page.evaluate('KGChallenge.getQuestion()')
def wallet(page):return page.evaluate('JSON.parse(localStorage.getItem("kgj-kingdom-v1")||"null")')
def settle(page):page.wait_for_timeout(40)
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':1112,'height':834},device_scale_factor=1)
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.on('dialog',lambda d:d.accept())
 load(page)
 check('default Reason level',page.evaluate('KGChallenge.getState().level')==1)
 check('two long readings at selected level',page.locator('.card').count()==2)
 page.screenshot(path=str(OUT/'challenge-home-1112.png'),full_page=True)
 # 6 reading investigations; evidence is mandatory.
 for level in range(3):
  for task in ['bridge','seeds'] if level==0 else ['route','moon-garden'] if level==1 else ['festival','clocktower']:
   home(page);page.locator(f'[data-act="level"][data-level="{level}"]').click();page.locator('[data-act="tab"][data-tab="read"]').click();page.locator(f'[data-id="{task}"][data-kind="read"]').click()
   check('four substantial paragraphs '+task,page.locator('.passage').count()==4)
   if task=='festival':page.screenshot(path=str(OUT/'reading-deep.png'),full_page=True)
   click(page,'questions')
   if task=='bridge':
    click(page,'check-read');check('requires answer and evidence','both' in page.locator('#questionFeedback').inner_text())
   for i in range(4):
    q=question(page);page.locator(f'[data-choice="{q["answer"]}"]').click();page.locator(f'[data-evidence="{q["evidence"][0]}"]').click();click(page,'check-read');check(f'{task} evidence question {i}',page.locator('#next').is_visible());click(page,'next')
   page.wait_for_selector('.completed');check('read reward '+task,'+10 city coins' in page.locator('.completed').inner_text())
 check('six readings +60 shared coins',wallet(page)['coins']==60)
 # All 24 math game/level combinations, 5 questions each.
 for level in range(3):
  for skill in ['delivery','machine','fractions','place','time','market','patterns','logic']:
   home(page);page.locator(f'[data-act="level"][data-level="{level}"]').click();page.locator('[data-act="tab"][data-tab="math"]').click();page.locator(f'[data-id="{skill}"][data-kind="math"]').click()
   if level==2 and skill=='machine':page.screenshot(path=str(OUT/'math-deep.png'),full_page=True)
   for i in range(5):
    q=question(page);page.locator('#answer').fill(str(q['answer']));page.locator('#checkMath').click();check(f'{skill}-{level}-{i} correct',page.locator('#next').is_visible());click(page,'next')
   page.wait_for_selector('.completed');check(f'{skill}-{level} reward','+7 city coins' in page.locator('.completed').inner_text())
 check('math deposited to same wallet',wallet(page)['coins']==228)
 # A supported retry remains rewarded; original counts stay intact.
 home(page);page.locator('[data-act="tab"][data-tab="math"]').click();page.locator('[data-id="logic"][data-kind="math"]').click();page.locator('#answer').fill('999999');page.locator('#checkMath').click();check('wrong answer permits retry',page.locator('#answer').is_enabled());click(page,'hint');check('specific hint displayed',len(page.locator('#questionFeedback').inner_text())>20)
 for i in range(5):click(page,'worked');click(page,'understood');click(page,'next')
 page.wait_for_selector('.completed');check('assisted attempt still earns 7',wallet(page)['coins']==235)
 check('assistance explicitly recorded','5 questions completed with' in page.locator('.completed').inner_text())
 # Writing: independent content, locked notebook, real mouse ink and Pencil filtering.
 home(page);page.locator('[data-act="tab"][data-tab="write"]').click();page.locator('[data-id="sources"][data-kind="write"]').click();check('writing has no tracing gate',page.locator('#draftText').is_visible());click(page,'complete-writing');check('empty writing not completed',page.locator('#finishWriting').is_visible());click(page,'notebook');page.wait_for_selector('#desk[open]')
 rect=page.locator('#ink').bounding_box();page.mouse.move(rect['x']+90,rect['y']+70);page.mouse.down();page.mouse.move(rect['x']+200,rect['y']+110,steps=12);page.mouse.up();check('real mouse handwriting saved',page.evaluate('KGChallenge.getState().drafts["write-sources"].pages[0].length')==1)
 y0=page.evaluate('scrollY');page.mouse.wheel(0,650);settle(page);check('locked writing page does not scroll',page.evaluate('scrollY')==y0)
 page.locator('#pencilOnly').check();n=page.evaluate('KGChallenge.getState().drafts["write-sources"].pages[0].length')
 page.evaluate('''()=>{const c=document.getElementById('ink'),r=c.getBoundingClientRect();c.dispatchEvent(new PointerEvent('pointerdown',{pointerId:10,pointerType:'touch',clientX:r.x+80,clientY:r.y+80,bubbles:true}));c.dispatchEvent(new PointerEvent('pointerup',{pointerId:10,pointerType:'touch',clientX:r.x+120,clientY:r.y+120,bubbles:true}));}''')
 check('Pencil only ignores touch',page.evaluate('KGChallenge.getState().drafts["write-sources"].pages[0].length')==n)
 page.evaluate('''()=>{const c=document.getElementById('ink'),r=c.getBoundingClientRect();for(const [type,x,y] of [['pointerdown',90,140],['pointermove',190,145],['pointerup',200,150]])c.dispatchEvent(new PointerEvent(type,{pointerId:22,pointerType:'pen',clientX:r.x+x,clientY:r.y+y,bubbles:true,cancelable:true}));}''')
 check('synthetic Pencil draws',page.evaluate('KGChallenge.getState().drafts["write-sources"].pages[0].length')==n+1)
 page.locator('#pageNext').click();check('second lined page available',page.locator('#pageCount').inner_text()=='2 / 2');page.screenshot(path=str(OUT/'writing-notebook.png'),full_page=True);page.locator('#deskClose').click()
 page.locator('#draftText').fill('I propose a small track with a separate reading area. Both groups can help. We should try the plan and ask families who were not at the garage.');page.locator('[data-check="0"]').check();page.locator('[data-check="1"]').check();page.locator('[data-check="2"]').check();page.screenshot(path=str(OUT/'writing-deep.png'),full_page=True);click(page,'complete-writing');page.wait_for_selector('.completed');check('writing earns 4',wallet(page)['coins']==239)
 check('original books not fabricated',wallet(page)['completed']==[])
 check('normal assets not awarded by challenge',wallet(page)['vehicles']==[])
 # Voice invoked only by interaction and explicitly stopped on navigation.
 home(page);page.locator('[data-act="tab"][data-tab="read"]').click();page.locator('[data-id="festival"][data-kind="read"]').click();click(page,'hear-story');check('voice explicitly invoked',page.evaluate('__spoken.length')>0);home(page);check('voice cancelled on leaving',page.evaluate('__cancelled')>0)
 # Stable responsive layouts with all modules.
 for width,height in [(1440,900),(834,1112),(1112,834),(390,844),(320,700)]:
  page.set_viewport_size({'width':width,'height':height});home(page)
  check(f'home no horizontal overflow {width}',page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
  page.locator('[data-act="tab"][data-tab="math"]').click();page.locator('[data-id="machine"][data-kind="math"]').click()
  check(f'math no overflow {width}',page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
  if width==834:page.screenshot(path=str(OUT/'math-834.png'),full_page=True)
  click(page,'scratch');rect=page.locator('#ink').bounding_box();check(f'notebook fits viewport {width}',rect['x']>=0 and rect['y']>=0 and rect['x']+rect['width']<=width+1 and rect['y']+rect['height']<=height+1);page.locator('#deskClose').click()
  if width==390:home(page);page.screenshot(path=str(OUT/'home-390.png'),full_page=True)
 # Saved state is validated and preserves notebook/history (real page reload fixture).
 stored=page.evaluate('JSON.parse(JSON.stringify(window.__storageData))');history=page.evaluate('KGChallenge.getState().history.length')
 load(page);page.evaluate('(d)=>window.__storageData=d',stored)
 # Reload scripts over injected storage, retaining the saved bytes.
 source=html.replace('window.__storageData={};','window.__storageData='+json.dumps(stored)+';')
 page.set_content(source,wait_until='load');check('saved history restored',page.evaluate('KGChallenge.getState().history.length')==history);check('ink restored',page.evaluate('KGChallenge.getState().drafts["write-sources"].pages[0].length')>=2)
 check('shared reward restored',wallet(page)['coins']==239)
 check('no uncaught JS errors',len(errors)==0)
 print(json.dumps({'passed':len(checks),'browser':'Chromium','mode':'http' if args.base_url else 'full-page fixture with storage/speech substitutes','errors':errors,'checks':checks},indent=2))
 (OUT/'browser-results.json').write_text(json.dumps({'passed':len(checks),'mode':'http' if args.base_url else 'fixture','errors':errors,'checks':checks},indent=2))
 browser.close()
