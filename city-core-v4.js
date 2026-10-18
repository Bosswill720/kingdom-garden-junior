/* Little Living City 4.0. Pure layout / simulation plus a namespaced local store.
 * Ownership and prices always come from KingdomCore; animation never awards money.
 */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.City4=api;})(globalThis,function(){
'use strict';
const VERSION='4.0.0',TEST_KEY='kgj-kingdom-city-v2-test-wallet';
const REGIONS=[['home','Cottage Lane','A little place to call home'],['learn','Story School','Books and friendly bus stops'],['farm','Sunshine Farm','Good things grow here'],['market','Market Street','Fresh bread and little deliveries'],['garage','Garage Yard','A home for every vehicle'],['park','Play Park','Room for a little fun'],['town','Town Square','Meet your storybook neighbors'],['wood','Woodland Hill','A castle, an orchard, a little wonder']].map(([id,name,description])=>({id,name,description}));
const SLOTS={ 'village':['home-a'],'meadow':['farm-a'],'market-square':['market-a','market-b'],'bakery':['market-a','market-b'],'city-center':['town-a','town-b'],'rainbow-fountain':['town-a','town-b'],'playground':['park-a'],'orchard':['wood-a','wood-b'],'castle-hill':['wood-a','wood-b'] };
const PREFERENCES={ 'red-car':['home','learn','market'],'blue-car':['home','learn','park'],'yellow-taxi':['town','market','learn'],pickup:['farm','market'],tractor:['farm','garage'],'icecream-van':['park','market'],'school-bus':['learn','home'],'fire-truck':['town','garage'],'police-car':['town','home','park'],'dump-truck':['garage','market'],excavator:['garage','farm'],'race-car':['garage','town'],'camper-van':['wood','home'],'big-truck':['market','garage','farm'] };
const copy=o=>JSON.parse(JSON.stringify(o)),clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const plain=x=>x&&typeof x==='object'&&!Array.isArray(x)&&[Object.prototype,null].includes(Object.getPrototypeOf(x));
const ids=()=>REGIONS.map(r=>r.id),mod=(x,n)=>(x%n+n)%n;
function seedRandom(seed){let a=seed>>>0;return()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
function makeLayout(wallet,mode){const l={schema:4,revision:0,mode,vehicles:[],buildings:[],flowers:[],paused:false,seed:48217,moments:[]};
 for(const id of wallet.lands){const slot=SLOTS[id]?.find(s=>!l.buildings.some(p=>p.slot===s));if(slot)l.buildings.push({id,slot});}
 wallet.flowers.forEach((x,index)=>{if(x)l.flowers.push({index,slot:index});});return l;}
function validateLayout(l,core,mode){
 if(!plain(l)||l.schema!==4||l.mode!==mode||!Number.isSafeInteger(l.revision)||l.revision<0||typeof l.paused!=='boolean'||!Number.isInteger(l.seed))throw Error('This city layout needs recovery. Nothing was replaced.');
 const unique=(a,key)=>new Set(a.map(x=>x[key])).size===a.length;
 if(!Array.isArray(l.vehicles)||l.vehicles.length>14||!unique(l.vehicles,'id')||l.vehicles.some(p=>!plain(p)||!core.vehicles.some(v=>v.id===p.id)||!ids().includes(p.region)||typeof p.paused!=='boolean'))throw Error('Invalid car placement.');
 if(!Array.isArray(l.buildings)||l.buildings.length>9||!unique(l.buildings,'id')||!unique(l.buildings,'slot')||l.buildings.some(p=>!plain(p)||!SLOTS[p.id]?.includes(p.slot)))throw Error('Invalid building placement.');
 if(!Array.isArray(l.flowers)||l.flowers.length>12||!unique(l.flowers,'index')||!unique(l.flowers,'slot')||l.flowers.some(p=>!plain(p)||!Number.isInteger(p.index)||p.index<0||p.index>11||!Number.isInteger(p.slot)||p.slot<0||p.slot>11))throw Error('Invalid flower placement.');
 if(!Array.isArray(l.moments)||l.moments.length>30||l.moments.some(x=>!['hello','school','delivery','bakery','icecream','farm','construction','fountain','camp','castle'].includes(x)))throw Error('Invalid city keepsakes.');return copy(l);
}
function activeLayout(l,w){return {...l,vehicles:l.vehicles.filter(p=>w.vehicles.includes(p.id)),buildings:l.buildings.filter(p=>w.lands.includes(p.id)),flowers:l.flowers.filter(p=>!!w.flowers[p.index])};}
function placement(l,w,action){const n=copy(l),bad=m=>{throw Error(m);};
 if(action.type==='place-car'){
  if(!w.vehicles.includes(action.id)||!ids().includes(action.region))bad('Choose one of your cars and a parking spot.');
  n.vehicles=n.vehicles.filter(p=>p.id!==action.id);n.vehicles.push({id:action.id,region:action.region,paused:false});
 }else if(action.type==='all-cars'){w.vehicles.forEach((id,i)=>{if(!n.vehicles.some(p=>p.id===id))n.vehicles.push({id,region:REGIONS[i%8].id,paused:false});});
 }else if(action.type==='remove-car'){n.vehicles=n.vehicles.filter(p=>p.id!==action.id);
 }else if(action.type==='pause-car'){const p=n.vehicles.find(p=>p.id===action.id);if(p)p.paused=!p.paused;
 }else if(action.type==='place-building'){
  if(!w.lands.includes(action.id)||!SLOTS[action.id]?.includes(action.slot))bad('That building needs a matching empty plot.');
  if(n.buildings.some(p=>p.id!==action.id&&p.slot===action.slot))bad('Another building lives here. Pick the other plot.');
  n.buildings=n.buildings.filter(p=>p.id!==action.id);n.buildings.push({id:action.id,slot:action.slot});
 }else if(action.type==='remove-building'){n.buildings=n.buildings.filter(p=>p.id!==action.id);
 }else if(action.type==='place-flower'){
  if(!w.flowers[action.index]||!Number.isInteger(action.slot)||action.slot<0||action.slot>11)bad('Choose one of your flowers and a garden spot.');
  if(n.flowers.some(p=>p.index!==action.index&&p.slot===action.slot))bad('A flower already grows here.');
  n.flowers=n.flowers.filter(p=>p.index!==action.index);n.flowers.push({index:action.index,slot:action.slot});
 }else if(action.type==='remove-flower'){n.flowers=n.flowers.filter(p=>p.index!==action.index);
 }else if(action.type==='pause'){n.paused=!!action.value;
 }else if(action.type==='clear'){n.vehicles=[];n.buildings=[];n.flowers=[];
 }else if(action.type==='moment'){if(!n.moments.includes(action.kind))n.moments.push(action.kind);
 }else bad('Unknown city action.');n.revision++;return n;
}
function repository(core,{storage,locks,test=false}={}){
 const mode=test?'test':'real',key=test?TEST_KEY:core.KEY,layoutKey=test?'kgj-city-v4-test-layout':'kgj-city-v4-layout',backupKey=layoutKey+'-recovery';
 let volatile=!storage,memW=null,memL=null,queue=Promise.resolve();
 const get=k=>{if(volatile)return null;try{return storage.getItem(k);}catch(_){volatile=true;return null;}};
 const parse=raw=>{try{return JSON.parse(raw);}catch(_){throw Error('Your saved city could not be read. Export or restore it; do not clear browser data.');}};
 function read(){const rw=get(key),rl=get(layoutKey);return{wallet:rw?copy(core.validate(parse(rw))):memW,layout:rl?validateLayout(parse(rl),core,mode):memL};}
 function write(w,l,writeWallet=true,writeLayout=true){
  if(!volatile){const oldW=get(key),oldL=get(layoutKey);try{
   storage.setItem(backupKey,JSON.stringify({format:'kgj-city4',mode,wallet:oldW?parse(oldW):w,layout:oldL?parse(oldL):l}));
   if(writeWallet)storage.setItem(key,JSON.stringify(w));if(writeLayout)storage.setItem(layoutKey,JSON.stringify(l));
  }catch(e){try{if(oldW!==null)storage.setItem(key,oldW);else if(writeWallet)storage.removeItem(key);if(oldL!==null)storage.setItem(layoutKey,oldL);else if(writeLayout)storage.removeItem(layoutKey);}catch(_){}volatile=true;}}
  memW=copy(w);memL=copy(l);
 }
 function locked(fn){const p=queue.then(()=>locks?.request?locks.request(key,fn):fn());queue=p.catch(()=>{});return p;}
 const api={key,layoutKey,backupKey,mode,isVolatile:()=>volatile,hasLocks:()=>!!locks?.request,
  init:legacy=>locked(()=>{let {wallet:w,layout:l}=read();const nw=!w,nl=!l;
   if(!w){w=core.initial(test?{completed:core.bookIds}:legacy||{});if(test)w.coins=5000;}if(!l)l=makeLayout(w,mode);
   if(nw||nl)write(w,l,nw,nl);else{memW=w;memL=l;}return api.snapshot();}),
  snapshot:()=>{const v=read();if(!v.wallet||!v.layout)throw Error('The city is still opening.');return copy(v);},
  act:a=>locked(()=>{const {wallet:w,layout:l}=api.snapshot();const n=placement(l,w,a);validateLayout(n,core,mode);write(w,n,false,true);return api.snapshot();}),
  buy:id=>locked(()=>{const {wallet:w,layout:l}=api.snapshot();let result;
   if(id==='flower'){const slot=Array.from({length:12},(_,i)=>i).find(i=>!w.flowers[i]);if(slot===undefined)throw Error('You already have twelve flowers. Place them in your city!');result=core.reduce(w,{type:'flower',slot,flower:core.flowers[slot%4]});}
   else result=core.reduce(w,{type:'buy',id});
   if(!result.result.ok)throw Error(result.result.message);write(result.state,l,true,false);return api.snapshot();}),
  export:()=>({format:'kgj-city4',mode,...api.snapshot()}),
  validateBackup:data=>{if(!plain(data)||data.format!=='kgj-city4'||data.mode!==mode)throw Error('Use a '+mode+' City 4 backup; test and real saves cannot mix.');const w=copy(core.validate(data.wallet)),l=validateLayout(data.layout,core,mode);return{wallet:w,layout:l};},
  restore:data=>locked(()=>{const n=api.validateBackup(data),old=api.snapshot();n.wallet.revision=old.wallet.revision+1;n.layout.revision=old.layout.revision+1;write(n.wallet,n.layout);return api.snapshot();}),
  resetTest:()=>locked(()=>{if(!test)throw Error('Only the test city can be reset.');const w=core.initial({completed:core.bookIds});w.coins=5000;const l=makeLayout(w,mode);write(w,l);return api.snapshot();}),
  recover:()=>locked(()=>{const raw=get(backupKey);if(!raw)throw Error('There is no local recovery snapshot. Import a known backup instead.');const n=api.validateBackup(parse(raw));
   if(!volatile){const rw=get(key),rl=get(layoutKey);try{storage.setItem(backupKey+'-damaged',JSON.stringify({mode,walletRaw:rw,layoutRaw:rl}));storage.setItem(key,JSON.stringify(n.wallet));storage.setItem(layoutKey,JSON.stringify(n.layout));}catch(e){try{if(rw!==null)storage.setItem(key,rw);if(rl!==null)storage.setItem(layoutKey,rl);}catch(_){}throw Error('Recovery could not be saved. Export your backup first.');}}
   memW=copy(n.wallet);memL=copy(n.layout);return api.snapshot();}),
  rawBackup:()=>get(backupKey)
 };return api;
}
// Clockwise rounded loop: exact distance parametrization, no 90-degree jumps.
function route(x,y,w,h,r){const seg=[],add=v=>{v.start=seg.reduce((n,s)=>n+s.len,0);seg.push(v);};
 const line=(a,b)=>add({a,b,len:Math.hypot(b.x-a.x,b.y-a.y)}),arc=(cx,cy,a)=>add({cx,cy,r,angle:a,len:Math.PI*r/2});
 line({x:x+r,y},{x:x+w-r,y});arc(x+w-r,y+r,-Math.PI/2);line({x:x+w,y:y+r},{x:x+w,y:y+h-r});arc(x+w-r,y+h-r,0);line({x:x+w-r,y:y+h},{x:x+r,y:y+h});arc(x+r,y+h-r,Math.PI/2);line({x,y:y+h-r},{x,y:y+r});arc(x+r,y+r,Math.PI);
 const length=seg.reduce((n,s)=>n+s.len,0);
 function point(s){s=mod(s,length);const p=seg.find(p=>s<p.start+p.len)||seg.at(-1),t=(s-p.start)/p.len;let px,py,a;
  if(p.a){px=p.a.x+(p.b.x-p.a.x)*t;py=p.a.y+(p.b.y-p.a.y)*t;a=Math.atan2(p.b.y-p.a.y,p.b.x-p.a.x);}else{const z=p.angle+t*Math.PI/2;px=p.cx+Math.cos(z)*r;py=p.cy+Math.sin(z)*r;a=z+Math.PI/2;}
  return{x:px,y:py,a,nx:-Math.sin(a),ny:Math.cos(a),curve:!p.a};}
 function nearest(p){let best=0,d=Infinity;for(const s of seg){let t;if(s.a){const dx=s.b.x-s.a.x,dy=s.b.y-s.a.y;t=clamp(((p.x-s.a.x)*dx+(p.y-s.a.y)*dy)/(s.len*s.len),0,1);}else{let a=mod(Math.atan2(p.y-s.cy,p.x-s.cx)-s.angle,Math.PI*2);if(a>Math.PI)a=0;t=clamp(a/(Math.PI/2),0,1);}const at=s.start+t*s.len,q=point(at),dist=Math.hypot(q.x-p.x,q.y-p.y);if(dist<d){d=dist;best=at;}}return mod(best,length);}
 return{length,point,nearest,path:`M${x+r} ${y}H${x+w-r}A${r} ${r} 0 0 1 ${x+w} ${y+r}V${y+h-r}A${r} ${r} 0 0 1 ${x+w-r} ${y+h}H${x+r}A${r} ${r} 0 0 1 ${x} ${y+h-r}V${y+r}A${r} ${r} 0 0 1 ${x+r} ${y}Z`};
}
function geometry(portrait){const width=portrait?680:1200,height=portrait?1060:720,rx=portrait?36:44,ry=portrait?44:52;
 const road=route(rx,ry,width-2*rx,height-2*ry,portrait?55:65),regions=REGIONS.map((r,i)=>{const col=portrait?i%2:i%4,row=portrait?Math.floor(i/2):Math.floor(i/4),x=portrait?202+col*276:186+col*276,y=portrait?180+row*232:236+row*250;const side=portrait?(col?'right':'left'):(row?'bottom':'top');const s=road.nearest({x:side==='left'?rx:side==='right'?width-rx:x,y:side==='top'?ry:side==='bottom'?height-ry:y});return{...r,x,y,side,s,width:portrait?204:232,height:portrait?184:206};});
 function slotPoint(slot){const [zone,letter]=slot.split('-'),r=regions.find(x=>x.id===zone);if(!r)return null;return{x:r.x+(letter==='a'?-51:51),y:r.y-8,region:zone};}
 const flowers=Array.from({length:12},(_,i)=>{const r=regions[i%8];return{slot:i,x:r.x+(i>=8?63:-68),y:r.y+58,region:r.id};});
 return{width,height,portrait,road,regions,slotPoint,flowers};
}
function interaction(id,region,buildings){const has=x=>buildings.some(b=>b.id===x);
 if(region==='learn')return'school';if(region==='garage'&&['dump-truck','excavator'].includes(id))return'construction';
 if(region==='farm'&&id==='tractor')return'farm';if(['pickup','big-truck'].includes(id)&&['farm','market'].includes(region))return'delivery';
 if(region==='market'&&has('bakery'))return'bakery';if(region==='park'&&has('playground')&&id==='icecream-van')return'icecream';
 if(region==='town'&&has('rainbow-fountain'))return'fountain';if(region==='wood'&&has('castle-hill'))return'castle';if(region==='wood'&&id==='camper-van')return'camp';return'hello';}
class Simulation{
 constructor(g,seed=48217,onEvent=()=>{}){this.g=g;this.random=seedRandom(seed);this.cars=new Map();this.bays=new Map();this.time=0;this.events=[];this.onEvent=onEvent;this.buildings=[];this.gap=83;}
 sync(layout){this.buildings=layout.buildings;const allowed=new Set(layout.vehicles.map(v=>v.id));
  const release=v=>{if(this.bays.get(v.target)===v.id)this.bays.delete(v.target);};
  for(const [id,v]of this.cars)if(!allowed.has(id)){release(v);this.cars.delete(id);}
  const park=(v,region)=>{const reg=this.g.regions.find(r=>r.id===region)||this.g.regions[0];let at=reg.s;
   for(let k=0;k<36;k++){const p=this.g.road.point(at+10);const x=p.x+p.nx*46,y=p.y+p.ny*46;
    const overlap=[...this.cars.values()].some(other=>{if(other===v||this.lane(other))return false;const q=this.pose(other);return Math.hypot(x-q.x,y-q.y)<88;});if(!overlap)break;at=mod(at+98,this.g.road.length);}
   release(v);v.s=at;v.region=region;v.status='queued';v.phase=0;v.speed=0;v.target=null;};
  layout.vehicles.forEach(p=>{let v=this.cars.get(p.id);if(!v){v={id:p.id,region:p.region,s:0,status:'queued',phase:0,speed:0,target:null,history:[],trips:0,kind:'hello',paused:p.paused};park(v,p.region);this.cars.set(p.id,v);}else if(v.region!==p.region||p.paused&&!v.paused)park(v,p.region);v.paused=p.paused;});} 
 destination(v){let opts=this.g.regions.filter(r=>r.id!==v.history.at(-1)&&(!v.history.slice(-2).includes(r.id)||v.trips<2));
  if(!opts.length)opts=this.g.regions;const preferences=PREFERENCES[v.id]||[];const candidates=opts.filter(r=>['home','learn','farm','garage'].includes(r.id)||this.buildings.some(b=>b.slot.startsWith(r.id+'-')));
  opts=candidates.length?candidates:opts;const total=opts.reduce((n,r)=>n+(preferences.includes(r.id)?6:1),0);let choice=this.random()*total;for(const r of opts){choice-=preferences.includes(r.id)?6:1;if(choice<=0)return r;}return opts.at(-1);}
 lane(v){return ['driving','arriving','merging'].includes(v.status);}
 gapAhead(v){let gap=Infinity;for(const other of this.cars.values()){if(other===v||!this.lane(other))continue;const d=mod(other.s-v.s,this.g.road.length);gap=Math.min(gap,d);}return gap;}
 canMerge(v){for(const other of this.cars.values()){if(other===v||!this.lane(other))continue;const d=mod(other.s-v.s,this.g.road.length);if(d<140||this.g.road.length-d<140)return false;}return true;}
 step(dt){if(!Number.isFinite(dt)||dt<0)return;this.accumulator=(this.accumulator||0)+clamp(dt,0,.05);while(this.accumulator+1e-10>=1/120){this.accumulator-=1/120;this.tick(1/120);}}
 tick(dt){this.time+=dt;
  let active=[...this.cars.values()].filter(v=>v.status==='interacting').length;
  for(const v of this.cars.values()){
   if(v.paused)continue;
   if(['queued','leaving'].includes(v.status)){if(this.canMerge(v)){v.status='merging';v.phase=0;}continue;}
   if(v.status==='merging'){v.phase+=dt/1.15;if(v.phase>=1){v.s=mod(v.s+60,this.g.road.length);if(this.bays.get(v.target)===v.id)this.bays.delete(v.target);v.target=this.destination(v).id;v.status='driving';v.speed=28;v.phase=0;}continue;}
   if(v.status==='driving'){
    const desired=this.g.road.point(v.s).curve?55:v.id==='tractor'||v.id==='excavator'?72:v.id==='race-car'?110:94;
    v.speed=Math.min(desired,v.speed+dt*65);const step=Math.max(0,Math.min(v.speed*dt,this.gapAhead(v)-this.gap));
    const target=this.g.regions.find(r=>r.id===v.target),remaining=mod(target.s-30-v.s,this.g.road.length);
    if(remaining<=step+.001){if(!this.bays.has(target.id)&&![...this.cars.values()].some(o=>{if(o===v||this.lane(o))return false;const p=this.g.road.point(target.s+10),q=this.pose(o);return Math.hypot(p.x+p.nx*46-q.x,p.y+p.ny*46-q.y)<84;})){v.s=target.s-30;v.dockS=target.s;this.bays.set(target.id,v.id);v.status='arriving';v.phase=0;v.kind=interaction(v.id,target.id,this.buildings);}else{v.target=this.destination(v).id;v.s=mod(v.s+step,this.g.road.length);}}
    else v.s=mod(v.s+step,this.g.road.length);continue;
   }
   if(v.status==='arriving'){v.phase+=dt/1.15;if(v.phase>=1){v.status='waiting';v.s=v.dockS;v.phase=0;}continue;}
   if(v.status==='waiting'){if(active<2){v.status='interacting';v.phase=0;active++;}continue;}
   if(v.status==='interacting'){v.phase+=dt/3.3;if(v.phase>=1){v.trips++;v.history.push(v.target);v.history=v.history.slice(-2);const event={id:v.id,region:v.target,kind:v.kind,time:this.time};this.events.push(event);this.events=this.events.slice(-60);this.onEvent(event);v.status='leaving';v.phase=0;active--;}}
  }
 }
 pose(v){const road=this.g.road,offset=(s,n)=>{const p=road.point(s);return{x:p.x+p.nx*n,y:p.y+p.ny*n,a:p.a};};
  if(v.status==='driving')return road.point(v.s);
  if(['queued','waiting','interacting','leaving'].includes(v.status))return offset(v.s+10,46);
  const s=v.status==='arriving'?v.dockS:v.s,t=clamp(v.phase,0,1),a=v.status==='arriving'?[offset(s-30,0),offset(s-8,0),offset(s-6,46),offset(s+10,46)]:[offset(s+10,46),offset(s+30,46),offset(s+40,0),offset(s+60,0)];
  const k=1-t,p={x:k*k*k*a[0].x+3*k*k*t*a[1].x+3*k*t*t*a[2].x+t*t*t*a[3].x,y:k*k*k*a[0].y+3*k*k*t*a[1].y+3*k*t*t*a[2].y+t*t*t*a[3].y};
  const dx=3*k*k*(a[1].x-a[0].x)+6*k*t*(a[2].x-a[1].x)+3*t*t*(a[3].x-a[2].x),dy=3*k*k*(a[1].y-a[0].y)+6*k*t*(a[2].y-a[1].y)+3*t*t*(a[3].y-a[2].y);p.a=Math.atan2(dy,dx);return p;
 }
 resetGeometry(g,layout){this.g=g;this.cars.clear();this.bays.clear();this.sync(layout);}
}
return{VERSION,TEST_KEY,REGIONS,SLOTS,PREFERENCES,makeLayout,validateLayout,activeLayout,placement,repository,route,geometry,interaction,Simulation,seedRandom};
});
