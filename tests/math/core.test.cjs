'use strict';
const assert=require('node:assert/strict'),C=require('../../math-core-v1.js');
let questions=0;
for(let level=0;level<3;level++)for(const g of C.GAMES)for(let seed=0;seed<150;seed++){
 const adv=C.adventure(g.id,level,seed);assert.equal(adv.length,5);
 for(const q of adv){questions++;assert(C.correct(q,q.answer));assert(!C.correct(q,{}));assert(q.prompt&&q.hint&&q.explain);if(q.choices){assert.equal(new Set(q.choices).size,q.choices.length);assert(q.choices.includes(q.answer));}
 const max=C.LEVELS[level].range;
 if(q.game==='harvest'){assert(q.target>=1&&q.target<=q.pool&&q.pool===max);}
 if(q.game==='picnic'){assert.equal(q.answer,q.a+q.b);assert(q.answer<=max);}
 if(q.game==='bus'){assert.equal(q.answer,q.a-q.b);assert(q.answer>=0);assert(q.b<=q.a);}
 if(q.game==='shapes'){assert(C.SHAPES.includes(q.answer));assert([0,3,4,5,6].includes(q.sides));}
 if(q.game==='train'){assert.equal(q.answer,q.pattern[6%q.pattern.length]);q.sequence.forEach((s,i)=>assert.equal(s,q.pattern[i%q.pattern.length]));}
 if(q.game==='bridge'){assert(q.sequence.every(n=>n>=0&&n<=max));assert.equal(q.answer,q.sequence[q.missing]);for(let i=1;i<5;i++)assert.equal(q.sequence[i]-q.sequence[i-1],q.step);}
 if(q.game==='fireflies'){assert.equal(q.answer+q.a,q.total);assert.equal(q.total,max);}
 }}
assert.deepEqual(C.adventure('harvest',1,123),C.adventure('harvest',1,123));assert.throws(()=>C.question('bogus',0));assert.throws(()=>C.question('bus',5));
let data=C.blank();const rec={id:'test-1234567',game:'picnic',level:1,at:Date.now(),helped:2,tries:6};data=C.award(data,rec);data=C.award(data,rec);assert.equal(data.sessions.length,1);assert.deepEqual(C.badges(data),['picnic-1']);data=C.award(data,{...rec,id:'test-1234568'});assert.equal(data.sessions.length,2);assert.equal(C.badges(data).length,1);assert.throws(()=>C.clean({version:9,sessions:[]}));assert.throws(()=>C.clean({...C.blank(),sessions:[{...rec,game:'<script>'}]}));assert.throws(()=>C.clean({...C.blank(),sessions:[{...rec,helped:50}]}));assert.throws(()=>C.clean({...C.blank(),sessions:[{...rec,level:-1}]}));assert.equal(C.clean({...data,sessions:[rec,rec]}).sessions.length,1);
console.log(JSON.stringify({questionChecks:questions,gameLevelCombinations:21,determinism:true,duplicateRewardProtection:true,saveValidation:true}));
