/* My Little Kingdom 1.0 — deterministic, local-only economy. No API keys. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.KingdomCore=api;})(typeof window!=='undefined'?window:globalThis,function(){
'use strict';
const KEY='kgj-kingdom-v1', BACKUP='kgj-kingdom-v1-recovery';
const vehicles=[
 {id:'red-car',name:'Little Red Car',price:20,books:1,description:'Your very first ride. Tap a destination and off you go!',art:0},
 {id:'pickup',name:'Farm Pickup',price:70,books:5,description:'Carry your colorful harvest to Milo’s market.',art:2},
 {id:'tractor',name:'Green Tractor',price:100,books:8,description:'Gather a whole field with one happy harvest.',art:3},

 {id:'blue-car',name:'Blue Family Car',price:45,books:2,description:'A cheerful blue car for visiting your friends.',art:1},
 {id:'yellow-taxi',name:'Sunny Yellow Taxi',price:60,books:3,description:'Give a friendly ride to the library.',art:0},
 {id:'icecream-van',name:'Ice Cream Van',price:90,books:6,description:'Visit the park with a pretend ice cream truck.',art:2},
 {id:'school-bus',name:'Rainbow School Bus',price:140,books:8,description:'Take your storybook friends across the village.',art:1},
 {id:'fire-truck',name:'Brave Fire Truck',price:190,books:10,description:'Visit the fire station and wave to helpers.',art:2},
 {id:'police-car',name:'Kindness Patrol Car',price:210,books:12,description:'Help friendly neighbors find their way.',art:0},
 {id:'dump-truck',name:'Happy Dump Truck',price:260,books:14,description:'Deliver pretend blocks to the building yard.',art:2},
 {id:'excavator',name:'Little Excavator',price:300,books:16,description:'Move colorful blocks at the construction site.',art:3},
 {id:'race-car',name:'Rainbow Race Car',price:350,books:18,description:'Zip around a safe, playful loop.',art:0},
 {id:'camper-van',name:'Adventure Camper',price:420,books:20,description:'Drive toward the storybook forest.',art:1},
 {id:'big-truck',name:'Giant Delivery Truck',price:500,books:22,description:'Your special five-hundred-coin truck. Explore the whole city!',art:2}
];
const lands=[
 {id:'meadow',name:'Farm Meadow',price:40,books:3,description:'Open four more crop beds. Grow a bigger, brighter farm.'},
 {id:'village',name:'Village Lane',price:100,books:8,description:'Open a new driving destination and a three-car garage.'},
 {id:'market-square',name:'Market Square',price:160,books:12,description:'Meet characters and drive around the friendly market.'},
 {id:'orchard',name:'Orchard Road',price:250,books:16,description:'Explore fruit trees and the quiet pond.'},
 {id:'city-center',name:'City Center',price:400,books:22,description:'Open the bright town hall and the grand boulevard.'}
];
const crops=[{id:'carrot',name:'Carrots',art:0},{id:'strawberry',name:'Strawberries',art:1},{id:'pumpkin',name:'Pumpkins',art:2},{id:'sunflower',name:'Sunflowers',art:3}];
const flowers=['rose','sun','daisy','tulip'];
const catalog=[...vehicles,...lands];
const bookIds=[...Array.from({length:28},(_,i)=>'story-'+(i+1)),'seed','puddle'];
const pages=id=>id==='puddle'?8:4;
const sets=[['garden-friends',['seed','story-7','story-13']],['little-dreamers',['story-5','story-15','story-16']],['kind-friends',['story-1','story-10','story-21']]];
const clone=o=>JSON.parse(JSON.stringify(o));
const day=d=>{const t=d||new Date();return t.getFullYear()+'-'+String(t.getMonth()+1).padStart(2,'0')+'-'+String(t.getDate()).padStart(2,'0');};
const uid=()=>globalThis.crypto?.randomUUID?.()||Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
const validId=id=>bookIds.includes(id);
const unique=(a,list)=>[...new Set((Array.isArray(a)?a:[]).filter(x=>list.includes(x)))];
const int=(v,min,max)=>Number.isSafeInteger(v)&&v>=min&&v<=max;
function initial(legacy={}){
 const completed=unique(legacy.completed,bookIds), oldFlowers=(Array.isArray(legacy.flowers)?legacy.flowers:[]).slice(0,12).map(x=>flowers.includes(x)?x:null);
 const oldStars=Math.max(0,completed.length*3-oldFlowers.filter(Boolean).length);
 return {schema:1,revision:0,coins:oldStars*5,completed,readDays:{},vehicles:[],lands:[],selected:null,wishlist:'red-car',flowers:oldFlowers,
 farm:{plots:['carrot','carrot',null,null,null,null],stage:0,cycle:1,cargo:null,delivered:0},sessions:{},bonuses:[],receipts:[],lastReward:null,
 migration:{at:new Date().toISOString(),stars:oldStars,coins:oldStars*5},created:new Date().toISOString()};
}
function validate(s){
 if(!s||s.schema!==1||!int(s.revision,0,1e9)||!int(s.coins,0,1e7))throw Error('This is not a valid Kingdom save.');
 for(const [field,list] of [['completed',bookIds],['vehicles',vehicles.map(x=>x.id)],['lands',lands.map(x=>x.id)],['bonuses',sets.map(x=>x[0])]]){
  if(!Array.isArray(s[field])||s[field].length!==unique(s[field],list).length)throw Error('Invalid '+field+' in save.');
 }
 if(s.selected!==null&&!s.vehicles.includes(s.selected))throw Error('Invalid selected vehicle.');
 if(s.wishlist!==null&&!catalog.some(x=>x.id===s.wishlist))throw Error('Invalid saving goal.');
 if(!Array.isArray(s.flowers)||s.flowers.length>12||s.flowers.some(x=>x!==null&&!flowers.includes(x)))throw Error('Invalid flowers.');
 const f=s.farm;if(!f||!Array.isArray(f.plots)||f.plots.length!==6||f.plots.some(x=>x!==null&&!crops.some(c=>c.id===x))||!int(f.stage,0,2)||!int(f.cycle,1,1e7)||!int(f.delivered,0,1e7))throw Error('Invalid farm.');
 if(f.cargo&&(!int(f.cargo.cycle,1,1e7)||!Array.isArray(f.cargo.crops)||f.cargo.crops.length>6||f.cargo.crops.some(x=>!crops.some(c=>c.id===x))))throw Error('Invalid harvest.');
 if(!s.readDays||typeof s.readDays!=='object'||Array.isArray(s.readDays)||Object.keys(s.readDays).some(k=>!validId(k)||!/^\d{4}-\d{2}-\d{2}$/.test(s.readDays[k])))throw Error('Invalid reading dates.');
 if(!s.sessions||typeof s.sessions!=='object'||Array.isArray(s.sessions)||Object.keys(s.sessions).length>64)throw Error('Invalid reading sessions.');
 for(const [k,v] of Object.entries(s.sessions)){if(!/^[a-zA-Z0-9-]{1,100}$/.test(k)||!v||!validId(v.book)||!Array.isArray(v.pages)||v.pages.some(p=>!int(p,0,pages(v.book)-1))||typeof v.done!=='boolean'||!Number.isFinite(v.at))throw Error('Invalid reading progress.');}
 if(s.activityClaims!==undefined&&(!s.activityClaims||typeof s.activityClaims!=='object'||Array.isArray(s.activityClaims)||Object.keys(s.activityClaims).length>10000||Object.keys(s.activityClaims).some(k=>!/^[a-zA-Z0-9:_-]{1,120}$/.test(k)||s.activityClaims[k]!==true)))throw Error('Invalid activity history.');
 if(!Array.isArray(s.receipts)||s.receipts.length>1000||s.receipts.some(x=>!x||typeof x.id!=='string'||x.id.length>150||!int(x.amount,-1000,1000)||typeof x.kind!=='string'))throw Error('Invalid transaction history.');
 if(s.migration&&(!int(s.migration.stars,0,1000000)||!int(s.migration.coins,0,5000000)))throw Error('Invalid migration totals.');
 if(s.lastReward){const r=s.lastReward;if(!validId(r.book)||![0,3,5,10].includes(r.earned)||![0,15,30,45].includes(r.bonus)||typeof r.isNew!=='boolean'||typeof r.session!=='string'||!/^[a-zA-Z0-9-]{1,100}$/.test(r.session)||!/^\d{4}-\d{2}-\d{2}$/.test(r.day))throw Error('Invalid reading reward.');}
 return s;
}
function note(s,kind,amount,extra={}){s.receipts.push({id:uid(),kind,amount,at:new Date().toISOString(),...extra});s.receipts=s.receipts.slice(-400);}
function own(s,id){return s.vehicles.includes(id)||s.lands.includes(id);}
function capacity(s){return s.lands.includes('meadow')?6:2;}
function reduce(input,a){
 const s=clone(input);let result={ok:true};
 const fail=message=>({state:input,result:{ok:false,message}});
 if(a.type==='visit'){
  if(!validId(a.book)||!int(a.page,0,pages(a.book)-1)||!/^[a-zA-Z0-9-]{1,100}$/.test(a.session))return fail('Invalid reading page.');
  let v=s.sessions[a.session];if(!v)v=s.sessions[a.session]={book:a.book,pages:[],done:false,at:Date.now()};
  if(v.book!==a.book||v.done)return fail('Begin a fresh reading session.');
  if(v.pages.includes(a.page))return {state:input,result:{ok:true,unchanged:true}};
  v.pages.push(a.page);v.at=Date.now();const keys=Object.keys(s.sessions).sort((x,y)=>s.sessions[y].at-s.sessions[x].at);keys.slice(40).forEach(k=>delete s.sessions[k]);
 }else if(a.type==='complete'){
  const v=s.sessions[a.session];if(!v||v.done||v.book!==a.book||new Set(v.pages).size!==pages(a.book))return fail('Enjoy all the pages before finishing the story.');
  const today=a.day||day();if(!/^\d{4}-\d{2}-\d{2}$/.test(today))return fail('Invalid date.');
  v.done=true;
  const isNew=!s.completed.includes(a.book),eligible=isNew||!s.readDays[a.book]||today>s.readDays[a.book];
  const earned=isNew?10:eligible?5:3;
  if(isNew)s.completed.push(a.book);
  let bonus=0;if(eligible){s.coins+=earned;s.readDays[a.book]=today;if(s.farm.plots.some(Boolean))s.farm.stage=Math.min(2,s.farm.stage+1);note(s,'reading',earned,{book:a.book});
   for(const [id,ids] of sets){if(!s.bonuses.includes(id)&&ids.includes(a.book)&&ids.every(b=>s.completed.includes(b))){s.bonuses.push(id);bonus+=15;s.coins+=15;note(s,'collection',15,{collection:id});}}
  }
  result={ok:true,earned,bonus,isNew,farmStage:s.farm.stage,message:earned?'Lovely reading!':'You already earned today’s reward for this book. Rereading is always welcome.'};
  s.lastReward={book:a.book,earned,bonus,isNew,session:a.session,day:today};
 }else if(a.type==='activity'){
  const kind=a.kind;
  if(!['writing','math'].includes(kind)||typeof a.token!=='string'||!/^[a-zA-Z0-9:_-]{8,120}$/.test(a.token)||typeof a.task!=='string'||a.task.length>90)return fail('Invalid learning activity.');
  if(!s.activityClaims)s.activityClaims={};
  if(s.activityClaims[a.token])return {state:input,result:{ok:true,unchanged:true,earned:0}};
  if(Object.keys(s.activityClaims).length>=10000)return fail('Please export your progress before continuing.');
  const earned=kind==='writing'?4:7;
  s.activityClaims[a.token]=true;
  s.coins+=earned;note(s,kind,earned,{task:a.task,claim:a.token});
  result={ok:true,earned,kind,message:kind==='writing'?'Wonderful writing!':'Great math adventure!'};
 }else if(a.type==='buy'){
  const item=catalog.find(x=>x.id===a.id);if(!item)return fail('This item is not available.');
  if(own(s,item.id))return fail('You already own this.');
  if(s.completed.length<item.books)return fail('Finish '+item.books+' different books to unlock this item.');
  if(s.coins<item.price)return fail('Keep saving: '+(item.price-s.coins)+' more coins to go.');
  s.coins-=item.price;if(vehicles.includes(item)){s.vehicles.push(item.id);s.selected=item.id;}else s.lands.push(item.id);
  if(s.wishlist===item.id)s.wishlist=null;note(s,'purchase',-item.price,{item:item.id});result.item=item;
 }else if(a.type==='select'){
  if(!s.vehicles.includes(a.id))return fail('Buy this vehicle first.');s.selected=a.id;
 }else if(a.type==='wishlist'){
  if(a.id!==null&&!catalog.some(x=>x.id===a.id))return fail('Unknown saving goal.');s.wishlist=a.id;
 }else if(a.type==='plant'){
  if(!int(a.slot,0,capacity(s)-1)||!crops.some(c=>c.id===a.crop))return fail('Choose an open crop bed.');
  if(s.farm.stage!==0||s.farm.plots[a.slot])return fail('This crop is already growing.');
  s.farm.plots[a.slot]=a.crop;
 }else if(a.type==='harvest'){
  if(s.farm.stage!==2||!s.farm.plots.some(Boolean))return fail('Two rewarding story sessions grow a harvest.');
  if(s.farm.cargo)return fail('Deliver your previous harvest first.');
  s.farm.cargo={cycle:s.farm.cycle,crops:s.farm.plots.filter(Boolean)};s.farm.cycle++;s.farm.plots=[null,null,null,null,null,null];s.farm.stage=0;note(s,'harvest',0,{cycle:s.farm.cargo.cycle});
 }else if(a.type==='deliver'){
  if(!s.farm.cargo)return fail('There is no harvest waiting to be delivered.');
  note(s,'delivery',6,{cycle:s.farm.cargo.cycle});s.farm.delivered++;s.farm.cargo=null;s.coins+=6;result.earned=6;
 }else if(a.type==='flower'){
  if(!flowers.includes(a.flower)||!int(a.slot,0,11))return fail('Choose a garden spot.');
  if(s.flowers[a.slot])return fail('There is already a flower here.');if(s.coins<5)return fail('A flower costs 5 coins.');
  while(s.flowers.length<=a.slot)s.flowers.push(null);s.flowers[a.slot]=a.flower;s.coins-=5;note(s,'flower',-5,{slot:a.slot});
 }else return fail('Unknown action.');
 s.revision++;validate(s);return {state:s,result};
}
function createStore(options={}){
 const storage=options.storage;const locks=options.locks;let memory=null,volatile=!storage,queue=Promise.resolve(),subscribers=[];
 function emit(){subscribers.forEach(fn=>fn(snapshot()));}
 function read(){if(!volatile&&storage){let raw;try{raw=storage.getItem(KEY);}catch(_){volatile=true;}if(raw){try{return validate(JSON.parse(raw));}catch(_){throw Error('Your kingdom save needs recovery. Export it before replacing it.');}}}return memory;}
 function write(s){if(!volatile&&storage){try{const previous=storage.getItem(KEY);if(previous)storage.setItem(BACKUP,previous);storage.setItem(KEY,JSON.stringify(s));}catch(_){volatile=true;}}memory=s;}
 function locked(fn){const run=()=>locks?.request?locks.request(KEY,fn):Promise.resolve().then(fn);const p=queue.then(run);queue=p.catch(()=>{});return p;}
 async function init(legacy){return locked(()=>{const existing=read();if(existing)memory=existing;else{if(storage){try{storage.setItem('kgj-before-kingdom',JSON.stringify(legacy||{}));}catch(_){}}write(initial(legacy));}return snapshot();});}
 function snapshot(){const s=read()||memory;if(!s)throw Error('Kingdom is not initialized.');return clone(s);}
 async function act(a){return locked(()=>{const r=reduce(snapshot(),a);if(r.result.ok&&!r.result.unchanged)write(r.state);if(r.result.ok&&!r.result.unchanged)emit();return r.result;});}
 async function restore(data){const s=clone(validate(data));return locked(()=>{s.revision=(read()?.revision||0)+1;write(s);emit();return snapshot();});}
 function refresh(){if(!volatile){memory=read();if(memory)emit();}}
 return {init,act,snapshot,restore,refresh,subscribe:fn=>(subscribers.push(fn),()=>subscribers=subscribers.filter(f=>f!==fn)),isVolatile:()=>volatile,hasLocks:()=>!!locks?.request};
}
return {KEY,BACKUP,vehicles,lands,crops,flowers,catalog,bookIds,pages,initial,validate,reduce,createStore,day,uid,own,capacity,version:'2.0'};
});
