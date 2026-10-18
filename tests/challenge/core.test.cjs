'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../..');const Q=require(path.join(root,'challenge-core-v1.js')),K=require(path.join(root,'kingdom-core-v2.js')),Wallet=require(path.join(root,'challenge-wallet-v1.js'));
global.window={};require(path.join(root,'challenge-reading-v1.js'));let checks=0,questions=0;const ok=(value,msg)=>{assert.ok(value,msg);checks++;};
function expected(q){const p=q.prompt,n=p.match(/\d+/g).map(Number);switch(q.skill){
case 'delivery':return q.level===0?n[0]+n[1]-n[2]:n[0]*n[1]-n[2]+(n[3]||0);
case 'machine':return q.level===0?n[1]-n[0]:(n[2]-n[1])/n[0];
case 'fractions':return q.level===0?`${n[1]}/${n[0]}`:q.level===1?n[0]*n[2]/n[1]:n[0]*n[1]/n[2];
case 'place':{if(q.level===0)return n[0]*10+n[1]+n[2]*10;if(q.level===1)return n[0]+n[1]-100;const reversed=Number(String(n[0]).split('').reverse().join(''));return Math.abs(n[0]-reversed);}
case 'time':{const [_,h,m,d]=p.match(/leaves at (\d+):(\d+).*trip takes (\d+)/);const rest=p.match(/rest stop takes (\d+)/);return Q.clock(+h*60+ +m+ +d+(rest?+rest[1]:0));}
case 'market':return q.level===0?n[0]-n[1]-n[2]:q.level===1?n[2]-n[0]*n[1]:Math.floor(n[1]/n[0]);
case 'patterns':{const v=p.match(/(\d+(?:, \d+)+), __/)[1].split(', ').map(Number);return q.level===0?v[3]+(v[3]-v[2]):q.level===1?v[3]+(v[3]-v[2])+1:v[3]*2+1;}
case 'logic':{const candidates=Array.from({length:999},(_,i)=>i+1).filter(x=>{const hundreds=Math.floor(x/100),tens=Math.floor(x/10)%10,ones=x%10;if(q.level===0)return x>=10&&x<100&&tens===n[0]&&tens+ones===n[1];if(q.level===1)return x>n[0]&&x<n[1]&&tens+ones===n[2];return x>=100&&hundreds===n[0]&&ones===tens+2&&hundreds+tens+ones===n[2];});assert.equal(candidates.length,1,'Mystery number must be uniquely identified');return candidates[0];}
}}
for(const skill of Q.skills)for(let l=0;l<3;l++)for(let seed=0;seed<1000;seed++){
 const q=Q.make(skill.id,l,seed);assert.equal(q.answer,expected(q),q.prompt);assert.ok(Q.correct(String(q.answer),q));assert.ok(q.steps.length&&q.hint.length);if(q.kind==='number')assert.ok(Number.isSafeInteger(q.answer)&&q.answer>=0);assert.deepEqual(q,Q.make(skill.id,l,seed));questions++;
}
ok(Q.skills.length===8,'8 games');ok(Q.levels.length===3,'3 levels');
for(const bad of ['',' ','0x10','Infinity','NaN','six','12cats','1e2'])ok(!Q.correct(bad,{kind:'number',answer:0}),'reject malformed numeric input '+bad);
ok(Q.correct(' 4/8 ',{kind:'fraction',fraction:[1,2]}),'equivalent fraction');ok(!Q.correct('1/0',{kind:'fraction',fraction:[1,2]}),'no zero denominator');ok(!Q.correct('0:15',{kind:'time',answer:'12:15'}),'strict 12h format');ok(Q.correct('09:05',{kind:'time',answer:'9:05'}),'time normalization');
const stories=window.KGChallengeReading,writing=window.KGChallengeWriting;
ok(stories.length===6,'6 readings');ok(writing.length===12,'12 writing tasks');
for(const story of stories){ok(story.paragraphs.length===4&&story.questions.length===4,'four paragraphs and four questions');ok(story.paragraphs.join(' ').split(/\s+/).length>=280,'longer reading');for(const q of story.questions){ok(q.choices[q.answer]&&q.evidence.every(i=>Number.isInteger(i)&&story.paragraphs[i]),'valid answer and evidence reference');}}
function fakeStorage(){const data=new Map();return {data,getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,String(v)),removeItem:k=>data.delete(k)};}
(async()=>{
const s=fakeStorage(),base=K.initial({completed:['seed'],flowers:['rose','sun']});base.vehicles=['red-car'];base.selected='red-car';base.lands=['meadow'];base.coins=250;K.validate(base);s.setItem(K.KEY,JSON.stringify(base));s.setItem('kgj-city-v4-layout','do not change');s.setItem('kgj-writing-v1','do not change');
const lockMap=new Map(),locks={request(key,fn){const p=(lockMap.get(key)||Promise.resolve()).then(fn);lockMap.set(key,p.catch(()=>{}));return p;}};
const w=Wallet.create(K,s,locks),w2=Wallet.create(K,s,locks);
let r=await w.grant('read','bridge','reading-test-001','2026-10-18');ok(r.earned===10&&r.coins===260,'new read 10');r=await w.grant('read','bridge','reading-test-001','2026-10-18');ok(r.already&&r.coins===260,'duplicate completion no extra');r=await w.grant('read','bridge','reading-test-002','2026-10-18');ok(r.earned===3&&r.coins===263,'same day repeat 3');r=await w.grant('read','bridge','reading-test-003','2026-10-19');ok(r.earned===5&&r.coins===268,'later day repeat 5');
await Promise.all([w.grant('write','sources','writing-test-001'),w2.grant('math','machine','math-test-0001')]);ok(w.snapshot().coins===279,'shared locked concurrent +4 +7');const saved=w.snapshot();ok(JSON.stringify(saved.vehicles)===JSON.stringify(base.vehicles)&&JSON.stringify(saved.lands)===JSON.stringify(base.lands),'ownership retained');ok(JSON.stringify(saved.completed)===JSON.stringify(base.completed),'original reading counter untouched');ok(JSON.stringify(saved.farm)===JSON.stringify(base.farm),'real farm inventory unchanged');ok(s.getItem('kgj-city-v4-layout')==='do not change'&&s.getItem('kgj-writing-v1')==='do not change','other namespaces unchanged');ok(!!K.validate(saved),'backwards compatible shared wallet');
const reopened=Wallet.create(K,s,locks);ok(reopened.snapshot().coins===279,'wallet survives new instance');await reopened.grant('math','machine','math-test-0001');ok(reopened.snapshot().coins===279,'duplicate remains blocked after reopen');
const corrupt=fakeStorage();corrupt.setItem(K.KEY,'{broken');await assert.rejects(Wallet.create(K,corrupt,locks).grant('math','machine','invalid-wallet-1'));ok(corrupt.getItem(K.KEY)==='{broken','corrupt wallet not overwritten');
const memory=Wallet.create(K,null,null);r=await memory.grant('math','machine','memory-test-001');ok(r.earned===7&&r.volatile,'in-memory fallback labeled');
const failed=fakeStorage();failed.setItem(K.KEY,JSON.stringify(base));const before=failed.getItem(K.KEY);failed.setItem=()=>{throw Error('quota');};await assert.rejects(Wallet.create(K,failed,locks).grant('math','machine','quota-test-0001'));ok(failed.getItem(K.KEY)===before,'storage failure preserves prior wallet');
const report={generatedQuestionsValidated:questions,otherAssertions:checks,readingWordCounts:stories.map(s=>[s.id,s.paragraphs.join(' ').split(/\s+/).length]),passed:true};console.log(JSON.stringify(report,null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});
