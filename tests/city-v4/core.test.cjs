/* node tests/city-v4/core.test.cjs — tests the shipped modules, not a mock economy. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const C=require('../../kingdom-core-v2.js'),K=require('../../city-core-v4.js');
let assertions=0;const ok=(cond,name)=>{assert.ok(cond,name);assertions++;};
const eq=(a,b,name)=>{assert.deepEqual(a,b,name);assertions++;};
const fails=(f,name)=>{assert.throws(f,undefined,name);assertions++;};
const storage=()=>{const m=new Map();return{getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k),dump:()=>Object.fromEntries(m)};};
const full=()=>{const w=C.initial({completed:C.bookIds});w.coins=5000;w.vehicles=C.vehicles.map(v=>v.id);w.lands=C.lands.map(v=>v.id);w.flowers=Array.from({length:12},(_,i)=>C.flowers[i%4]);return w;};
(async()=>{
 const w=full();let l=K.makeLayout(w,'real');
 eq(l.buildings.length,9,'all existing buildings assigned without loss');eq(l.flowers.length,12,'all old flowers assigned');eq(l.vehicles.length,0,'cars wait for explicit deployment');
 l=K.placement(l,w,{type:'all-cars'});eq(l.vehicles.length,14,'all 14 vehicles');eq(K.placement(l,w,{type:'all-cars'}).vehicles.length,14,'no duplicate batch deployment');
 eq(K.validateLayout(l,C,'real'),l,'valid layout round trip');fails(()=>K.validateLayout({...l,mode:'test'},C,'real'),'cannot import test as real');
 fails(()=>K.placement(l,{...w,vehicles:[]},{type:'place-car',id:'red-car',region:'home'}),'cannot place unowned vehicle');
 fails(()=>K.placement(l,w,{type:'place-building',id:'bakery',slot:'farm-a'}),'cannot place incompatible building');
 fails(()=>K.placement(l,w,{type:'place-building',id:'bakery',slot:'market-a'}),'cannot overwrite occupied plot');
 const moved=K.placement(l,w,{type:'remove-building',id:'market-square'});const moved2=K.placement(moved,w,{type:'place-building',id:'bakery',slot:'market-a'});eq(moved2.buildings.filter(b=>b.id==='bakery').length,1,'move not copy');
 eq(w.lands.length,9,'return keeps ownership');eq(K.placement(l,w,{type:'clear'}).buildings.length,0,'clear layout only');eq(w.coins,5000,'placement does not change coins');
 fails(()=>K.placement(l,w,{type:'place-flower',index:0,slot:1}),'cannot overlay flower');
 const stolen=K.activeLayout(l,{...w,vehicles:['red-car'],lands:[],flowers:[]});eq(stolen.vehicles.length,1,'orphan car reference isolated');eq(stolen.buildings.length,0,'orphan building isolated');
 const store=storage();store.setItem(C.KEY,JSON.stringify(w));store.setItem('kgj-math-v1','unchanged');store.setItem('kgj-writing-v1','unchanged');
 const repo=K.repository(C,{storage:store});await repo.init();const realBefore=store.getItem(C.KEY);
 await repo.act({type:'all-cars'});eq(store.getItem(C.KEY),realBefore,'layout does not rewrite wallet bytes');
 const restored=K.repository(C,{storage:store});eq((await restored.init()).layout.vehicles.length,14,'placements persist');
 const backup=restored.export();await restored.act({type:'clear'});await restored.restore(backup);eq(restored.snapshot().layout.vehicles.length,14,'layout restore');
 const demo=K.repository(C,{storage:store,test:true});await demo.init();eq(demo.snapshot().wallet.coins,5000,'fresh test coins');
 const realImmutable=store.getItem(C.KEY);await demo.buy('big-truck');eq(demo.snapshot().wallet.coins,4500,'500 coin truck');await demo.act({type:'place-car',id:'big-truck',region:'market'});
 eq(store.getItem(C.KEY),realImmutable,'test purchase isolated');await demo.resetTest();eq(demo.snapshot().wallet.coins,5000,'test reset');eq(demo.snapshot().layout.vehicles.length,0,'test layout reset');eq(store.getItem(C.KEY),realImmutable,'test reset isolated');
 eq(store.getItem('kgj-math-v1'),'unchanged','math data untouched');eq(store.getItem('kgj-writing-v1'),'unchanged','writing untouched');
 const bad=storage();bad.setItem(C.KEY,JSON.stringify(w));bad.setItem('kgj-city-v4-layout','{broken');await assert.rejects(K.repository(C,{storage:bad}).init());assertions++;eq(bad.getItem('kgj-city-v4-layout'),'{broken','corrupt layout preserved');
 const rec=storage();const r=K.repository(C,{storage:rec});await r.init();await r.act({type:'pause',value:true});rec.setItem('kgj-city-v4-layout','garbled');await r.recover();ok(r.snapshot().layout.schema===4,'explicit recovery works');ok(rec.getItem(r.backupKey+'-damaged').includes('garbled'),'damaged save kept');
 const vol=K.repository(C,{storage:{getItem(){throw Error('blocked')},setItem(){throw Error('blocked')}}});await vol.init();ok(vol.isVolatile(),'blocked storage detected');await vol.act({type:'pause',value:true});ok(vol.snapshot().layout.paused,'blocked storage still playable');
 let economy=C.initial();const read=(book,sid,day)=>{for(let i=0;i<C.pages(book);i++)economy=C.reduce(economy,{type:'visit',book,page:i,session:sid}).state;const r=C.reduce(economy,{type:'complete',book,session:sid,day});economy=r.state;return r.result;};
 eq(read('seed','first-123','2026-10-17').earned,10,'reading reward unchanged');eq(read('seed','second-123','2026-10-17').earned,3,'same day reread unchanged');eq(read('seed','third-123','2026-10-18').earned,5,'later reread unchanged');
 for(const [kind,coins]of [['writing',4],['math',7]]){const a={type:'activity',kind,token:kind+':test-token-123',task:'test'};let r=C.reduce(economy,a);eq(r.result.earned,coins,kind+' shared reward');economy=r.state;ok(C.reduce(economy,a).result.unchanged,kind+' duplicate ignored');}
 const simulationReports=[];
 for(const portrait of [false,true]){
  const g=K.geometry(portrait),road=g.road;eq(g.regions.length,8,'eight zones '+portrait);
  for(const r of g.regions){ok(r.x-r.width/2>0&&r.x+r.width/2<g.width&&r.y-r.height/2>0&&r.y+r.height/2<g.height,'zone fits '+r.id);}
  const p0=road.point(0),p1=road.point(road.length);ok(Math.hypot(p0.x-p1.x,p0.y-p1.y)<1e-5,'loop closes');
  const sim=new K.Simulation(g);sim.sync(l);let min=Infinity,maxActive=0;
  for(let i=0;i<36000;i++){sim.step(1/60);maxActive=Math.max(maxActive,[...sim.cars.values()].filter(v=>v.status==='interacting').length);if(i%20===0){const a=[...sim.cars.values()];for(let j=0;j<a.length;j++)for(let k=j+1;k<a.length;k++){const x=sim.pose(a[j]),y=sim.pose(a[k]);min=Math.min(min,Math.hypot(x.x-y.x,x.y-y.y));}}}
  ok(min>42,'no overlapping car centers during ten minute run');ok(maxActive<=2,'at most two primary interactions');ok([...sim.cars.values()].every(v=>v.trips>0),'every car continues making visits');
  eq(w.coins,5000,'simulation gives no income');
  const paused=K.placement(l,w,{type:'pause-car',id:'red-car'});sim.sync(paused);const at=sim.pose(sim.cars.get('red-car'));for(let i=0;i<600;i++)sim.step(1/60);eq(sim.pose(sim.cars.get('red-car')),at,'individual parked car stays still');
  sim.sync(K.placement(l,w,{type:'remove-car',id:'pickup'}));eq(sim.cars.size,13,'return removes one instance');
  simulationReports.push({portrait,seconds:600,minCenterDistance:min,maxConcurrentInteractions:maxActive,trips:[...sim.cars.values()].map(v=>({id:v.id,trips:v.trips}))});
 }
 // Fixed 120-Hz simulation ticks make rendering refresh rate irrelevant.
 const journeys=[];for(const hz of [30,60,120]){const sim=new K.Simulation(K.geometry(false));sim.sync(l);for(let i=0;i<hz*60;i++)sim.step(1/hz);journeys.push([...sim.cars.values()].map(v=>[v.id,v.status,Math.round(v.s*1000),v.trips]));}
 eq(journeys[0],journeys[1],'30 and 60 Hz identical');eq(journeys[1],journeys[2],'60 and 120 Hz identical');
 let trio=K.makeLayout(w,'real');trio.vehicles=[{id:'red-car',region:'home',paused:false},{id:'pickup',region:'market',paused:false},{id:'tractor',region:'farm',paused:false}];const sim=new K.Simulation(K.geometry(false));sim.sync(trio);for(let i=0;i<3600;i++)sim.step(1/60);ok(new Set(sim.events.map(e=>e.kind)).size>=2,'three cars produce multiple autonomous interaction types within a minute');
 const report={passed:assertions,simulationReports,trioEvents:sim.events,limitations:'Pure engine and storage tests, not physical hardware or curriculum tests.'};console.log(JSON.stringify(report,null,2));
 if(process.env.REPORT_PATH)fs.writeFileSync(process.env.REPORT_PATH,JSON.stringify(report,null,2));
})().catch(e=>{console.error(e);process.exit(1)});
