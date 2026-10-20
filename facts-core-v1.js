/* Original arithmetic fact worksheets. No textbook images or personal data. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.KGFacts=api;})(typeof window!=='undefined'?window:globalThis,function(){
'use strict';
const SETS=[{id:'doubles',name:'Doubles',hint:'Add the same number twice.'},{id:'near',name:'Near doubles',hint:'Use the double, then add one more.'},{id:'addition',name:'Mixed addition',hint:'Line up the ones and tens.'},{id:'subtraction',name:'Related subtraction',hint:'Use the matching addition fact.'}];
const LEVELS=[{id:0,name:'Facts 0–9',lo:0,hi:9},{id:1,name:'Doubles & facts 10–20',lo:10,hi:20},{id:2,name:'Two-digit stretch',lo:21,hi:50}];
const clone=x=>JSON.parse(JSON.stringify(x));
function rng(seed){let n=seed>>>0;return()=>((n=(Math.imul(n,1664525)+1013904223)>>>0)/4294967296);}
function shuffle(a,r){for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function questions(set,level,count,seed){
 if(!SETS.some(s=>s.id===set)||![0,1,2].includes(level)||![10,20].includes(count)||!Number.isInteger(seed)||seed<0||seed>4294967295)throw Error('Invalid worksheet settings.');
 const r=rng(seed),l=LEVELS[level],pool=Array.from({length:l.hi-l.lo+1},(_,i)=>i+l.lo);let cycle=[],out=[];
 for(let i=0;i<count;i++){if(!cycle.length)cycle=shuffle(pool.slice(),r);let a=cycle.pop(),b=a,op='+';
  if(set==='near')b=a+1;
  if(set==='addition'||set==='subtraction')b=l.lo+Math.floor(r()*(l.hi-l.lo+1));
  if(set==='subtraction'){a+=b;op='−';}
  out.push({a,b,op,answer:op==='+'?a+b:a-b});
 }return out;
}
function fresh({set='doubles',level=0,count=20,seed,id}){questions(set,level,count,seed);if(!/^[-a-zA-Z0-9]{8,80}$/.test(id))throw Error('Invalid worksheet ID.');return {schema:1,id,set,level,count,seed,created:new Date().toISOString(),finished:false,paid:[],responses:Array.from({length:count},()=>({text:'',ink:[],mode:'keypad',status:'open',assisted:false,tries:0}))};}
function validate(s){
 if(!s||s.schema!==1||!/^[-a-zA-Z0-9]{8,80}$/.test(s.id)||typeof s.finished!=='boolean'||!Array.isArray(s.responses)||s.responses.length!==s.count||!Array.isArray(s.paid)||new Set(s.paid).size!==s.paid.length||s.paid.some(i=>!Number.isInteger(i)||i<0||i>=s.count/5))throw Error('This fact-practice save needs recovery.');
 const qs=questions(s.set,s.level,s.count,s.seed);
 s.responses.forEach((r,i)=>{
  if(!r||typeof r.text!=='string'||r.text.length>3||!/^[0-9]*$/.test(r.text)||!['keypad','pencil'].includes(r.mode)||!['open','retry','correct','reviewed'].includes(r.status)||typeof r.assisted!=='boolean'||!Number.isSafeInteger(r.tries)||r.tries<0||!Array.isArray(r.ink)||r.ink.length>100||r.ink.some(st=>!Array.isArray(st)||st.length<1||st.length>400||st.some(p=>!Array.isArray(p)||p.length!==2||!p.every(v=>Number.isFinite(v)&&v>=0&&v<=1000))))throw Error('Invalid saved answer or handwriting.');
  if(r.status==='correct'&&(r.mode!=='keypad'||!correct(r.text,qs[i])))throw Error('Saved checked answer does not match this question.');
  if(r.status==='reviewed'&&(r.mode!=='pencil'||!r.ink.length))throw Error('An empty handwritten answer cannot be reviewed.');
 });
 if(s.finished&&!ready(s))throw Error('An unfinished page cannot have a completion reward.');
 if(s.paid.length&&!s.finished)throw Error('Invalid reward record.');return s;
}
function correct(text,q){return /^\d{1,3}$/.test(String(text))&&Number(text)===q.answer;}
function ready(s){return s.responses.every(r=>r.status==='correct'||r.status==='reviewed');}
function check(s){const next=clone(validate(s));if(next.finished)return next;const qs=questions(s.set,s.level,s.count,s.seed);next.responses.forEach((r,i)=>{if(r.mode!=='keypad'||r.status==='correct')return;if(r.text===''){r.status='open';return;}r.tries++;r.status=correct(r.text,qs[i])?'correct':'retry';if(r.status==='retry')r.assisted=true;});return next;}
function hint(q,set){if(q.op==='−')return `${q.b} + ${q.answer} = ${q.a}, so ${q.a} − ${q.b} = ${q.answer}.`;if(set==='doubles')return `Double ${q.a}: ${q.a} + ${q.a} = ${q.answer}.`;if(set==='near')return `${q.a} + ${q.a} = ${q.a*2}. One more makes ${q.answer}.`;return `${q.a} + ${q.b} = ${q.answer}. You can split tens and ones, or count on from ${Math.max(q.a,q.b)}.`;}
async function award(session,store,onPaid=()=>{}){
 validate(session);if(!session.finished||!ready(session))throw Error('Finish and check the whole page before collecting coins.');
 for(let i=0;i<session.count/5;i++){
  const result=await store.act({type:'activity',kind:'math',task:`Fact Practice: ${session.set}`,token:`facts:${session.id}:batch:${i}`});
  if(!result.ok)throw Error(result.message||'Reward could not be recorded.');
  if(!session.paid.includes(i))session.paid.push(i);onPaid(session);
 }
 return {total:session.count/5*7,temporary:store.isVolatile(),coins:store.snapshot().coins};
}
return {SETS,LEVELS,questions,fresh,validate,correct,check,ready,hint,award};
});
