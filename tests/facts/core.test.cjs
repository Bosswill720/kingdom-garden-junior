'use strict';
const assert=require('node:assert/strict'),path=require('node:path');
const root=path.resolve(__dirname,'../..'),F=require(path.join(root,'facts-core-v1.js')),K=require(path.join(root,'kingdom-core-v2.js'));
let checks=0,generated=0;function ok(v,msg){assert.ok(v,msg);checks++;}
for(const set of F.SETS)for(let level=0;level<3;level++)for(let seed=0;seed<1000;seed++){
 const qs=F.questions(set.id,level,20,seed);assert.deepEqual(qs,F.questions(set.id,level,20,seed));
 for(const q of qs){assert.equal(q.answer,q.op==='+'?q.a+q.b:q.a-q.b);assert.ok(q.answer>=0&&Number.isInteger(q.answer));assert.ok(F.correct(String(q.answer),q));assert.ok(!F.correct(String(q.answer+1),q));generated++;}
 if(set.id==='doubles'){assert.ok(qs.every(q=>q.a===q.b));if(!level){for(let n=0;n<10;n++)assert.equal(qs.filter(q=>q.a===n).length,2);}}
 if(set.id==='near')assert.ok(qs.every(q=>q.b-q.a===1));
}
for(const s of ['', ' ', '-0','1e1','Infinity','0x10','2 apples'])ok(!F.correct(s,{answer:0}),'strict answer '+s);
ok(F.correct('0',{answer:0}),'zero accepted');
function newSheet(id='test-facts-001'){return F.fresh({set:'doubles',level:0,count:20,seed:12,id});}
function filled(){const s=newSheet();F.questions(s.set,s.level,s.count,s.seed).forEach((q,i)=>s.responses[i].text=String(q.answer));return F.check(s);}
const empty=newSheet();ok(!F.ready(empty),'blank page not complete');assert.throws(()=>F.validate({...empty,finished:true}));checks++;
const s=filled();ok(F.ready(s),'20 entered facts check');ok(s.responses.every(r=>r.status==='correct'),'all statuses correct');
const invalid=JSON.parse(JSON.stringify(s));invalid.responses[0].text='999';assert.throws(()=>F.validate(invalid));checks++;
const pen=newSheet();pen.responses[0].mode='pencil';pen.responses[0].status='reviewed';assert.throws(()=>F.validate(pen));checks++;
pen.responses[0].ink=[[[0,0],[100,100]]];ok(!!F.validate(pen),'parent review accepted only with ink');
const tooBig=newSheet();tooBig.responses[0].ink=[[[1001,0]]];assert.throws(()=>F.validate(tooBig));checks++;
function memory(){const m=new Map();return {getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)};}
(async()=>{
 const storage=memory(),base=K.initial({completed:['seed'],flowers:['rose']});base.coins=200;base.vehicles=['red-car'];base.selected='red-car';base.lands=['meadow'];storage.setItem(K.KEY,JSON.stringify(base));storage.setItem('kgj-challenge-v1','preserve');storage.setItem('kgj-city-v4-layout','preserve');const store=K.createStore({storage});await store.init();
 await assert.rejects(F.award(empty,store));ok(store.snapshot().coins===200,'no coins before completion');
 s.finished=true;let r=await F.award(s,store);ok(r.total===28&&store.snapshot().coins===228,'7 per 5 = 28');
 await F.award(s,store);ok(store.snapshot().coins===228,'same completion not paid twice');
 const reopened=K.createStore({storage});await reopened.init();await F.award(s,reopened);ok(reopened.snapshot().coins===228,'reopen replay still deduplicated');
 const next=filled();next.id='test-facts-002';next.finished=true;let actions=0;const failStore={...store,act:a=>{actions++;if(actions===3)throw Error('interrupted');return store.act(a);}};
 await assert.rejects(F.award(next,failStore));ok(next.paid.length===2&&store.snapshot().coins===242,'partial award tracked');await F.award(next,store);ok(store.snapshot().coins===256,'partial retries only add missing14');
 ok(JSON.stringify(store.snapshot().vehicles)===JSON.stringify(base.vehicles),'existing car preserved');ok(JSON.stringify(store.snapshot().farm)===JSON.stringify(base.farm),'farm preserved');ok(storage.getItem('kgj-challenge-v1')==='preserve'&&storage.getItem('kgj-city-v4-layout')==='preserve','unrelated saves untouched');
 const short=F.fresh({set:'near',level:1,count:10,seed:88,id:'short-test-0001'});F.questions(short.set,short.level,10,88).forEach((q,i)=>short.responses[i].text=String(q.answer));const ready=F.check(short);ready.finished=true;r=await F.award(ready,store);ok(r.total===14,'10 facts earns14');
 const report={status:'passed',generatedQuestions:generated,assertions:checks};console.log(JSON.stringify(report,null,2));
})().catch(e=>{console.error(e);process.exitCode=1});
