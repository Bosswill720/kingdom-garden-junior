"""Actual local-HTTP page tests. Only audible speech is replaced by an invocation spy."""
import functools, http.server, json, os, pathlib, threading, time
from playwright.sync_api import sync_playwright
ROOT=pathlib.Path(__file__).resolve().parents[2]
OUT=ROOT/'reports';OUT.mkdir(exist_ok=True)
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args): pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
BASE=f'http://127.0.0.1:{server.server_port}'
checks=[];errors=[]
def check(value,label):
    assert value,label
    checks.append(label)
def balance(p):
    return p.evaluate("JSON.parse(localStorage.getItem('kgj-kingdom-v1')||'{\"coins\":0}').coins")
def choose(p,kind,level,ident):
    p.click('#home');p.click(f'[data-act="level"][data-level="{level}"]');p.click(f'[data-act="tab"][data-tab="{kind}"]');p.click(f'[data-act="start"][data-id="{ident}"]')
with sync_playwright() as pw:
    browser=pw.chromium.launch(headless=True,args=['--no-sandbox'])
    context=browser.new_context(viewport={'width':1112,'height':834},accept_downloads=True)
    context.add_init_script("window.__speech=0;window.__stops=0;if(window.speechSynthesis){speechSynthesis.speak=function(){window.__speech++};speechSynthesis.cancel=function(){window.__stops++};}")
    p=context.new_page();p.on('pageerror',lambda e:errors.append(str(e)));p.on('dialog',lambda d:d.accept())
    p.goto(BASE+'/challenge.html?release=challenge-1&level=2');p.wait_for_selector('.cards')
    check(p.evaluate('KGChallenge.getState().level')==2,'Deep Think deep link')
    p.evaluate("const s=KingdomCore.initial({completed:['seed'],flowers:['rose']});s.coins=120;s.vehicles=['red-car'];s.selected='red-car';localStorage.setItem(KingdomCore.KEY,JSON.stringify(s));localStorage.setItem('kgj-math-v1','original-math');localStorage.setItem('kgj-writing-v1','original-writing');localStorage.setItem('kgj-city-v4-layout','original-city');")
    p.screenshot(path=str(OUT/'challenge-home-ipad.png'),full_page=True)
    skills=p.evaluate('KGChallengeCore.skills.map(s=>s.id)')
    check(len(skills)==10,'Ten mission cards')
    for level in range(3):
        for ident in skills:
            choose(p,'math',level,ident);before=balance(p)
            for index in range(5):
                q=p.evaluate('KGChallenge.getQuestion()')
                if level==2 and ident=='delivery' and index==0:
                    p.screenshot(path=str(OUT/'challenge-deep-math.png'),full_page=True)
                    p.fill('#answer','999999');p.click('#checkMath')
                    check(p.locator('#questionFeedback').inner_text().startswith('Not quite'),'Incorrect answer feedback')
                    p.click('[data-act="hint"]');check(p.evaluate('KGChallenge.getState().session.questionHelp'),'Hint marked supported')
                p.fill('#answer',str(q['answer']));p.click('#checkMath');p.wait_for_selector('#next:visible')
                check(p.evaluate('KGChallenge.getState().session.solved'),f'{ident}/{level}/{index} solved')
                p.click('#next')
            p.wait_for_selector('.completed');check(balance(p)==before+7,f'{ident}/{level} deposits 7 once')
            check(p.evaluate('KGChallenge.getState().session') is None,'Completed math clears active session')
    # Complete every reading and evidence question using the real handlers.
    stories=p.evaluate('KGChallengeReading.map(s=>({id:s.id,level:s.level}))')
    for story in stories:
        choose(p,'read',story['level'],story['id']);before=balance(p)
        p.click('[data-act="hear-story"]');check(p.evaluate('__speech')>0,'Device narration invoked');p.click('[data-act="stop"]')
        p.click('[data-act="questions"]')
        for index in range(4):
            q=p.evaluate('KGChallenge.getQuestion()');p.click(f'[data-act="option"][data-choice="{q["answer"]}"]');p.click(f'[data-act="evidence"][data-evidence="{q["evidence"][0]}"]');p.click('#checkRead');p.wait_for_selector('#next:visible');p.click('#next')
        p.wait_for_selector('.completed');check(balance(p)==before+10,f'{story["id"]} deposits 10')
    # A newly completed reread, with the worked-example route, still earns coins.
    choose(p,'read',2,'festival');before=balance(p);p.click('[data-act="questions"]')
    for index in range(4):
        p.click('[data-act="worked"]');p.click('[data-act="understood"]');p.click('#next')
    p.wait_for_selector('.completed');check(balance(p)==before+3,'Supported same-day reread deposits 3')
    tasks=p.evaluate('KGChallengeWriting.map(s=>({id:s.id,level:s.level}))')
    for task in tasks:
        choose(p,'write',task['level'],task['id']);before=balance(p)
        p.fill('#draftText','I recommend comparing both plans because speed alone does not tell us the total delivery time. We should keep the load equal, record each result, and revise the plan if the evidence changes.')
        for i in range(3):p.check(f'[data-check="{i}"]')
        p.click('#finishWriting');p.wait_for_selector('.completed');check(balance(p)==before+4,f'{task["id"]} deposits 4')
    saved=balance(p);p.reload();p.wait_for_selector('.cards');check(balance(p)==saved,'Reload does not grant another reward')
    choose(p,'write',2,'design');p.click('[data-act="notebook"]');p.wait_for_selector('#desk[open]')
    box=p.locator('#ink').bounding_box();p.mouse.move(box['x']+box['width']*.15,box['y']+box['height']*.3);p.mouse.down();p.mouse.move(box['x']+box['width']*.55,box['y']+box['height']*.4,steps=30);p.mouse.up()
    check(p.evaluate("KGChallenge.getState().drafts['write-design'].pages[0].length")==1,'Real mouse ink persisted')
    p.check('#pencilOnly');p.mouse.move(box['x']+40,box['y']+40);p.mouse.down();p.mouse.move(box['x']+100,box['y']+60);p.mouse.up()
    check(p.evaluate("KGChallenge.getState().drafts['write-design'].pages[0].length")==1,'Pencil-only rejects mouse marks')
    p.locator('#ink').dispatch_event('pointerdown',{'pointerId':7,'pointerType':'pen','clientX':box['x']+60,'clientY':box['y']+60,'buttons':1})
    p.locator('#ink').dispatch_event('pointermove',{'pointerId':7,'pointerType':'pen','clientX':box['x']+160,'clientY':box['y']+100,'buttons':1})
    p.locator('#ink').dispatch_event('pointerup',{'pointerId':7,'pointerType':'pen','clientX':box['x']+200,'clientY':box['y']+110,'buttons':0})
    check(p.evaluate("KGChallenge.getState().drafts['write-design'].pages[0].length")==2,'Synthetic pen input accepted')
    offset=p.evaluate('scrollY');p.mouse.wheel(0,500);p.wait_for_timeout(120);check(p.evaluate('scrollY')==offset,'Notebook remains locked against wheel scrolling')
    for width,height in [(1112,834),(834,1112),(390,844),(320,700)]:
        p.set_viewport_size({'width':width,'height':height});p.wait_for_timeout(100)
        b=p.locator('#ink').bounding_box();check(b['x']>=0 and b['y']>=0 and b['x']+b['width']<=width+1 and b['y']+b['height']<=height+1,f'Notebook visible {width}x{height}')
        check(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),f'No notebook horizontal overflow {width}')
    p.set_viewport_size({'width':1112,'height':834});p.screenshot(path=str(OUT/'challenge-writing-notebook.png'))
    p.click('#pageNext');check(p.locator('#pageCount').inner_text()=='2 / 2','Second writing page')
    p.click('#deskClose');p.reload();p.wait_for_selector('.cards');p.click('[data-act="resume"]')
    check(p.evaluate("KGChallenge.getState().drafts['write-design'].pages[0].length")==2,'Ink survives page reload')
    p.click('#home')
    for width,height in [(834,1112),(390,844),(320,700)]:
        p.set_viewport_size({'width':width,'height':height});p.wait_for_timeout(80)
        check(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),f'Home fits {width}')
    p.screenshot(path=str(OUT/'challenge-home-phone.png'),full_page=True)
    p.click('#parentsOpen')
    with p.expect_download() as info:p.click('[data-act="export"]')
    info.value.save_as(str(OUT/'example-challenge-save.json'));check((OUT/'example-challenge-save.json').stat().st_size>100,'Export downloads real draft JSON')
    p.set_input_files('#restoreFile',str(OUT/'example-challenge-save.json'));p.wait_for_selector('.cards');check(balance(p)==saved,'Restore challenge data does not change coins')
    for key,value in [('kgj-math-v1','original-math'),('kgj-writing-v1','original-writing'),('kgj-city-v4-layout','original-city')]:check(p.evaluate('(k)=>localStorage.getItem(k)',key)==value,key+' untouched')
    check(not errors,'No uncaught browser errors: '+str(errors))
    report={'status':'passed','checks':len(checks),'labels':checks,'errors':errors,'navigation':'actual local HTTP','storage':'real browser localStorage','audio':'invocation spy; no audible output verified'}
    (OUT/'challenge-browser.json').write_text(json.dumps(report,indent=2));print(json.dumps({'status':'passed','checks':len(checks),'errors':errors}))
    browser.close()
server.shutdown()
