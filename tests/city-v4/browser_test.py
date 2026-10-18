"""City 4 browser regression. Normal: --base-url http://127.0.0.1:8000
Use --fixture only when browser network navigation is policy-blocked. It loads the
complete shipped HTML/CSS/JS into about:blank with an explicit storage substitute;
no fake DOM, fake simulation, or fake asset functions are used.
"""
from pathlib import Path
import argparse,json,re,time
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[2]
parser=argparse.ArgumentParser();parser.add_argument('--fixture',action='store_true');parser.add_argument('--base-url',default='http://127.0.0.1:8000');parser.add_argument('--report-dir',default='city4-test-results');args=parser.parse_args()
OUT=Path(args.report_dir);OUT.mkdir(parents=True,exist_ok=True)
checks=[];errors=[]
def check(name,cond):
 if not cond:raise AssertionError(name)
 checks.append(name)
def composed_html():
 html=(ROOT/'city-v4.html').read_text()
 html=re.sub(r'<link rel="stylesheet" href="([^"]+)">',lambda m:'<style>'+(ROOT/m[1].split('?')[0]).read_text()+'</style>',html)
 return re.sub(r'<script src="([^"]+)"></script>',lambda m:'<script>'+(ROOT/m[1].split('?')[0]).read_text().replace('</script>','<\\/script>')+'</script>',html)
STORAGE="""Object.defineProperty(window,'localStorage',{configurable:true,value:(()=>{const m=new Map(Object.entries(window.__seed||{}));return {getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k),clear:()=>m.clear(),key:i=>[...m.keys()][i],get length(){return m.size}}})()});"""
def load(page,seed=None,test=True,ready=True):
 if args.fixture:
  page.goto('about:blank'+('?test=1' if test else ''));page.evaluate('(s)=>window.__seed=s',seed or {});page.evaluate(STORAGE);page.set_content(composed_html())
 else:
  if seed:page.add_init_script('Object.entries('+json.dumps(seed)+').forEach(([k,v])=>localStorage.setItem(k,v))')
  page.goto(args.base_url.rstrip('/')+'/city-v4.html'+('?test=1' if test else ''))
 if ready:page.wait_for_function('window.CityPlay4?.ready()')
 page.wait_for_timeout(150)
def act(page,a,id=None):
 selector='[data-action="'+a+'"]'+(' [bad]' if False else '')
 if id is not None:selector+='[data-id="'+str(id)+'"]'
 page.locator(selector).first.click()
 page.wait_for_timeout(70)
def dump(page):return page.evaluate('()=>Object.fromEntries(Array.from({length:localStorage.length},(_,i)=>localStorage.key(i)).map(k=>[k,localStorage.getItem(k)]))')
def full_seed(page):return page.evaluate("""()=>{const w=KingdomCore.initial({completed:KingdomCore.bookIds});w.coins=5000;w.vehicles=KingdomCore.vehicles.map(v=>v.id);w.lands=KingdomCore.lands.map(v=>v.id);w.flowers=Array.from({length:12},(_,i)=>KingdomCore.flowers[i%4]);return {[City4.TEST_KEY]:JSON.stringify(w),'kgj-math-v1':'preserve-math','kgj-writing-v1':'preserve-writing'};}""")
def snap(page):return page.evaluate('CityPlay4.snapshot()')
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':1112,'height':834},device_scale_factor=1)
 page.on('pageerror',lambda e:errors.append(str(e)))
 load(page)
 check('demo starts with 5000',snap(page)['wallet']['coins']==5000)
 check('no unowned car on map',page.locator('.car-instance').count()==0)
 check('no ghost purchased buildings',page.locator('[data-building]').count()==0)
 act(page,'demo-trio');check('trio asks for explicit confirmation',page.locator('#sheet').is_visible())
 act(page,'confirm-trio');check('three cars deployed',page.locator('.car-instance').count()==3)
 check('trio deducts only 190 test coins',snap(page)['wallet']['coins']==4810)
 before=page.evaluate('CityPlay4.simulation().cars.map(c=>c.pose)');page.wait_for_timeout(2500);after=page.evaluate('CityPlay4.simulation().cars.map(c=>c.pose)')
 check('several independent cars move',sum(a!=b for a,b in zip(before,after))>=2)
 page.locator('#pauseCity').click();page.wait_for_timeout(100)
 at=page.evaluate('CityPlay4.simulation()');page.wait_for_timeout(500);eq=page.evaluate('CityPlay4.simulation()');check('pause freezes simulation',at==eq)
 page.locator('#pauseCity').click();page.wait_for_timeout(300);check('resume restarts time',page.evaluate('CityPlay4.simulation().time')>at['time'])
 page.locator('[data-panel=cars]').click();t=page.evaluate('CityPlay4.simulation().time');page.wait_for_timeout(300);check('open collection pauses simulation',page.evaluate('CityPlay4.simulation().time')==t)
 act(page,'place-car','red-car');check('8 parking choices',page.locator('[data-place]').count()==8)
 page.locator('[data-place=learn]').click();check('car can be moved without duplication',len(snap(page)['layout']['vehicles'])==3)
 check('car saved in chosen region',next(v for v in snap(page)['layout']['vehicles'] if v['id']=='red-car')['region']=='learn')
 page.locator('[data-panel=cars]').click();act(page,'remove-car','pickup');check('return removes deployment',page.locator('.car-instance').count()==2)
 check('return keeps ownership','pickup' in snap(page)['wallet']['vehicles'])
 check('returned card correctly shows Place',page.locator('[data-action=place-car][data-id=pickup]').inner_text()=='Place in city')
 act(page,'pause-car','red-car');check('park state persisted',next(v for v in snap(page)['layout']['vehicles'] if v['id']=='red-car')['paused'])
 act(page,'pause-car','red-car');page.locator('#closeSheet').click()
 page.locator('[data-panel=shop]').click();act(page,'shop-filter','buildings');act(page,'buy','bakery');check('purchase dialog shows correct price','125 coins' in page.locator('#sheetBody').inner_text())
 act(page,'confirm-buy','bakery');check('buying does not auto place',len(snap(page)['layout']['buildings'])==0)
 check('bakery has two compatible plots',page.locator('[data-place]').count()==2)
 page.locator('[data-place=market-a]').click();check('bakery visible in chosen plot',page.locator('[data-building=bakery]').count()==1)
 check('building purchase amount correct',snap(page)['wallet']['coins']==4685)
 page.locator('[data-panel=flowers]').click();act(page,'buy','flower');act(page,'confirm-buy','flower');check('twelve flower spots',page.locator('[data-place]').count()==12)
 page.locator('[data-place="3"]').click();check('flower appears',page.locator('[data-flower="0"]').count()==1)
 saved=dump(page);load(page,saved);check('layout persists across a reload',len(snap(page)['layout']['vehicles'])==2 and len(snap(page)['layout']['flowers'])==1)
 check('bakery survives reload',page.locator('[data-building=bakery]').count()==1)
 # Full ownership fixture is labelled test data, not falsely earned progress.
 seed=full_seed(page);load(page,seed)
 act(page,'all-cars');act(page,'confirm-all');check('all fourteen simultaneous instances',page.locator('.car-instance').count()==14)
 check('nine separate placed upgrades',page.locator('[data-building]').count()==9)
 check('twelve legacy flowers retained',page.locator('[data-flower]').count()==12)
 for width,height in [(1112,834),(834,1112),(1024,768),(1440,900),(390,844),(320,700)]:
  page.set_viewport_size({'width':width,'height':height});page.wait_for_timeout(200)
  bounds=page.evaluate("""()=>({w:innerWidth,h:innerHeight,docW:document.documentElement.scrollWidth,docH:document.documentElement.scrollHeight,dock:document.querySelector('.dock').getBoundingClientRect().bottom,zones:[...document.querySelectorAll('[data-region-art]')].map(n=>{const r=n.getBoundingClientRect();return {left:r.left,top:r.top,right:r.right,bottom:r.bottom}})})""")
  check(f'{width}x{height} no horizontal page overflow',bounds['docW']<=width+1)
  check(f'{width}x{height} no vertical page scrolling',bounds['docH']<=height+1)
  check(f'{width}x{height} all eight districts visible',len(bounds['zones'])==8 and all(z['left']>=-1 and z['right']<=width+1 and z['top']>=0 and z['bottom']<=height for z in bounds['zones']))
  check(f'{width}x{height} dock in viewport',bounds['dock']<=height+1)
  check(f'{width}x{height} keeps 14 vehicles',len(snap(page)['layout']['vehicles'])==14)
  page.screenshot(path=str(OUT/f'city4-{width}x{height}.png'))
 page.set_viewport_size({'width':1112,'height':834});page.wait_for_timeout(200)
 page.locator('[data-panel=cars]').click();check('collection scrolls within panel',page.locator('#sheetBody').evaluate('(n)=>n.scrollHeight>n.clientHeight'))
 check('all 14 garage cards exist',page.locator('.item').count()==14)
 page.screenshot(path=str(OUT/'city4-garage.png'))
 page.locator('#closeSheet').click();page.emulate_media(reduced_motion='reduce');page.wait_for_timeout(100)
 a=page.evaluate('CityPlay4.simulation()');page.wait_for_timeout(450);check('system Reduce Motion stops movement',page.evaluate('CityPlay4.simulation()')==a)
 check('quiet guidance visible','Quiet city' in page.locator('#hintbar').inner_text())
 page.emulate_media(reduced_motion='no-preference');page.wait_for_timeout(200)
 page.locator('#settings').click()
 with page.expect_download() as info:act(page,'export')
 download=info.value;download.save_as(str(OUT/'test-city-backup.json'));backup=json.loads((OUT/'test-city-backup.json').read_text());check('export includes wallet and layout',backup['format']=='kgj-city4' and len(backup['layout']['vehicles'])==14)
 act(page,'ask-clear');act(page,'clear');check('clear removes placed cars only',len(snap(page)['layout']['vehicles'])==0 and len(snap(page)['wallet']['vehicles'])==14)
 page.locator('#settings').click();page.locator('#importFile').set_input_files(str(OUT/'test-city-backup.json'));page.wait_for_timeout(100)
 check('restore requires confirmation',page.locator('[data-action=confirm-restore]').count()==1)
 act(page,'confirm-restore');check('restore recovers fourteen deployments',page.locator('.car-instance').count()==14)
 check('math storage untouched',page.evaluate("localStorage.getItem('kgj-math-v1')")=='preserve-math')
 check('writing storage untouched',page.evaluate("localStorage.getItem('kgj-writing-v1')")=='preserve-writing')
 # The final video and frame interval sample use real browser animation, not a simulation time jump.
 page.wait_for_timeout(5000)
 metric=page.evaluate("""()=>new Promise(resolve=>{const times=[];let last;function f(t){if(last)times.push(t-last);last=t;if(times.length<120)requestAnimationFrame(f);else resolve({mean:times.reduce((a,b)=>a+b,0)/times.length,max:Math.max(...times),samples:times.length});}requestAnimationFrame(f);})""")
 check('fourteen vehicles keep animating',page.evaluate('CityPlay4.simulation().time')>5)
 # Full renderer SVG and all thumbnail assets must parse as XML.
 page.locator('[data-panel=shop]').click();count=page.evaluate("""()=>[...document.querySelectorAll('svg')].filter(n=>new DOMParser().parseFromString(new XMLSerializer().serializeToString(n),'image/svg+xml').querySelector('parsererror')).length""")
 check('all current SVG assets valid XML',count==0)
 check('no uncaught browser errors',errors==[])
 report={'passed':len(checks),'checks':checks,'errors':errors,'animationSampleMs':metric,'mode':'full authored page on about:blank with explicit storage substitute' if args.fixture else 'HTTP page','limitations':'Not physical iPad, Safari, audible narration or learning efficacy testing.'}
 (OUT/'browser-results.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2));browser.close()
