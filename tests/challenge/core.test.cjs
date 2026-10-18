'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'../..'),K=require(root+'/kingdom-core-v2.js'),C=require(root+'/challenge-core-v1.js'),WC=require(root+'/challenge-wallet-v1.js');
const win={KGChallengeCore:C};for(const f of ['challenge-deep-v1.js','challenge-reading-v1.js'])vm.runInNewContext(fs.readFileSync(root+'/'+f,'utf8'),{window:win});
let checks=0,questions=0,audited=0;const ok=(x,msg)=>{assert.ok(x,msg);checks++;};
function expected(m){switch(m.op){case'delivery':return(m.a*m.b-m.c+m.d)/m.groups;case'machine':return(m.t+m.d)/m.a-m.c;case'fractions':return(m.total-m.total*m.p/m.den)*(m.groups-1)/m.groups;case'place':return Math.abs(m.t-m.reversed)/9;case'time':{const mins=m.start+m.durations.reduce((a,b)=>a+b,0);return(Math.floor(mins/60)%12||12)+':'+String(mins%60).padStart(2,'0');}case'market':return Math.floor((m.total-m.a*m.b)/m.c);case'patterns':return m.last*2+m.increment;case'logic':{const matches=[];for(let n=100;n<=999;n++){const d=String(n).split('').map(Number);if(d[0]===m.hundreds&&d[0]+d[1]+d[2]===m.sum&&d[2]-d[1]===m.difference)matches.push(n);}assert.equal(matches.length,1);return matches[0];}case'perimeter':return 2*m.a+2*m.b;case'side':return m.area/m.a;case'area':return(m.perimeter-2*m.a)/2*m.a;case'share':return m.total/m.groups;case'remainder':return m.total%m.groups;case'boxes':return(m.total-m.extra)/m.groups+m.added;default:throw Error('No independent solver: '+m.op);}}
for(const skill of C.skills)for(let level=0;level<3;level++)for(let seed=0;seed<1000;seed++){
 const q=C.make(skill.id,level,seed);questions++;
 assert.ok(q.prompt.length>20&&q.hint.length>5&&q.steps.length>0);
 assert.ok(C.correct(String(q.answer),q),'Expected answer rejected: '+q.id);
 assert.ok(!C.correct('not a number',q));assert.ok(!C.correct('',q));
 if(q.kind==='number'){assert.ok(Number.isFinite(q.answer)&&q.answer>=0);assert.ok(!C.correct(String(q.answer+1),q));}
 if(q.audit){audited++;assert.equal(q.answer,expected(q.audit),'Independent result: '+q.id);if(q.audit.op==='delivery')assert.ok(q.audit.c<=q.audit.a*q.audit.b,'Cannot deliver more than the loaded books: '+q.id);}
 if(seed<10)assert.deepEqual(q,C.make(skill.id,level,seed));
}
ok(C.skills.length===10,'ten mission types');
const fraction={kind:'fraction',fraction:[1,2],answer:'1/2'};ok(C.correct('2/4',fraction),'equivalent fraction');ok(!C.correct('1/0',fraction),'zero denominator');ok(!C.correct('NaN',{kind:'number',answer:0}),'NaN');ok(!C.correct('12:60',{kind:'time',answer:'1:00'}),'invalid clock minutes');
const R=win.KGChallengeReading,W=win.KGChallengeWriting;
ok(R.length===6&&W.length===12,'Complete original content');
const wordCounts=[];for(const s of R){ok(s.paragraphs.length===4&&s.questions.length===4,s.id+' paragraph/question counts');const words=s.paragraphs.join(' ').split(/\s+/).length;wordCounts.push({id:s.id,words});ok(words>=240,s.id+' longer reading');for(const q of s.questions){ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.choices.length,'answer index');ok(q.evidence.length>0&&q.evidence.every(i=>i>=0&&i<s.paragraphs.length),'evidence index');ok(q.why.length>30,'explanation');}}
for(const w of W){ok(w.plan.length===3&&w.prompt.length>70&&w.example.length>100,w.id+' writing scaffold');}
function storage(){const data=new Map;return{getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v)),removeItem:k=>data.delete(k),data};}
(async()=>{
const st=storage(),baseline=K.initial({completed:['seed'],flowers:['rose']});baseline.coins=80;baseline.vehicles=['red-car'];baseline.selected='red-car';baseline.lands=['meadow'];st.setItem(K.KEY,JSON.stringify(baseline));st.setItem('kgj-math-v1','original-math');st.setItem('kgj-writing-v1','original-writing');st.setItem('kgj-city-v4-layout','original-layout');
const w=WC.create(K,st,null);
let x=await w.grant('read','bridge','session-read-0001','2026-10-18');ok(x.earned===10&&x.coins===90,'new advanced reading');
x=await w.grant('read','bridge','session-read-0001','2026-10-18');ok(x.already&&x.earned===0,'same event not rewarded twice');
x=await w.grant('read','bridge','session-read-0002','2026-10-18');ok(x.earned===3,'same-day new attempt');x=await w.grant('read','bridge','session-read-0003','2026-10-19');ok(x.earned===5,'later-day new attempt');
x=await w.grant('write','design','session-write-001');ok(x.earned===4,'writing');x=await w.grant('math','geometry','session-math-001');ok(x.earned===7,'math');
const before=w.snapshot().coins;await Promise.all([w.grant('math','machine','session-parallel-01'),w.grant('math','machine','session-parallel-01')]);ok(w.snapshot().coins===before+7,'concurrent duplicate serialized');
ok(JSON.stringify(w.snapshot().completed)===JSON.stringify(baseline.completed),'original book milestones unchanged');ok(JSON.stringify(w.snapshot().vehicles)===JSON.stringify(baseline.vehicles),'owned cars unchanged');ok(JSON.stringify(w.snapshot().farm)===JSON.stringify(baseline.farm),'farm unchanged');
for(const [key,value]of[['kgj-math-v1','original-math'],['kgj-writing-v1','original-writing'],['kgj-city-v4-layout','original-layout']])ok(st.getItem(key)===value,key+' untouched');
const reloaded=WC.create(K,st,null);ok((await reloaded.grant('math','machine','session-parallel-01')).already,'reload deduplication');
const corrupt=storage();corrupt.setItem(K.KEY,'broken');await assert.rejects(WC.create(K,corrupt,null).grant('math','machine','session-corrupt-01'));ok(corrupt.getItem(K.KEY)==='broken','corrupt wallet preserved');
const memory=WC.create(K,null,null);x=await memory.grant('math','machine','session-memory-001');ok(x.earned===7&&x.volatile,'explicit memory-only reward');
const report={questions,independentlyAudited:audited,checks,wordCounts,status:'passed'};fs.mkdirSync(root+'/reports',{recursive:true});fs.writeFileSync(root+'/reports/challenge-core.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});
