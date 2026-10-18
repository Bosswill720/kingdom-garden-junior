/* Shares the established wallet/lock. Adds only challenge reading bookkeeping.
   No paid API, cloud account, or writes to city layout, math stickers or writing badges. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.KGChallengeWallet=api;})(typeof window!=='undefined'?window:globalThis,function(){
'use strict';
function create(C,storage,locks){
 let memory=null,queue=Promise.resolve(),volatile=!storage;
 function read(){if(!volatile){let raw;try{raw=storage.getItem(C.KEY);}catch(_){volatile=true;}
  if(raw){try{return C.validate(JSON.parse(raw));}catch(_){throw Error('Your kingdom save needs recovery. It has not been replaced.');}}}
  if(memory)return JSON.parse(JSON.stringify(memory));
  let old={};if(!volatile){try{const v=storage.getItem('kgj-storybook-v1');if(v)old=JSON.parse(v);else{const s=JSON.parse(storage.getItem('kgj-v1')||'{}');old={completed:s.completed?['seed']:[],flowers:Array.isArray(s.flowers)?s.flowers.slice(0,12).map((_,i)=>C.flowers[i%4]):[]};}}catch(_){throw Error('Older reading progress needs recovery before creating a wallet.');}}
  return C.initial(old);
 }
 function locked(fn){const run=()=>locks?.request?locks.request(C.KEY,fn):Promise.resolve().then(fn);const p=queue.then(run);queue=p.catch(()=>{});return p;}
 function write(s){C.validate(s);if(!volatile){const raw=storage.getItem(C.KEY);if(raw)storage.setItem(C.BACKUP,raw);storage.setItem(C.KEY,JSON.stringify(s));}memory=JSON.parse(JSON.stringify(s));}
 function grant(kind,task,session,day=C.day()){
  return locked(()=>{if(!['read','write','math'].includes(kind)||!/^[-a-zA-Z0-9_]{1,70}$/.test(task)||!/^[-a-zA-Z0-9_]{8,70}$/.test(session)||!/^\d{4}-\d{2}-\d{2}$/.test(day))throw Error('Invalid completed challenge.');
   const s=read(),claim='challenge:'+kind+':'+session;
   if(s.activityClaims?.[claim])return {coins:s.coins,earned:0,already:true,volatile};
   let result;
   if(kind!=='read'){result=C.reduce(s,{type:'activity',kind:kind==='write'?'writing':'math',token:claim,task});if(!result.result.ok)throw Error(result.result.message);write(result.state);return {coins:result.state.coins,earned:result.result.earned,volatile};}
   const n=JSON.parse(JSON.stringify(s));n.activityClaims=n.activityClaims||{};
   if(Object.keys(n.activityClaims).length>=10000)throw Error('Export your kingdom save; the activity history needs maintenance.');
   n.challengeReadDays=n.challengeReadDays||{};if(Array.isArray(n.challengeReadDays)||typeof n.challengeReadDays!=='object'||Object.entries(n.challengeReadDays).some(([k,v])=>!/^[-a-zA-Z0-9_]{1,70}$/.test(k)||!/^\d{4}-\d{2}-\d{2}$/.test(v)))throw Error('Challenge reading dates need recovery.');
   const previous=n.challengeReadDays[task],earned=!previous?10:day>previous?5:3;
   n.challengeReadDays[task]=previous&&previous>day?previous:day;n.activityClaims[claim]=true;n.coins+=earned;n.revision++;
   n.receipts.push({id:C.uid(),kind:'challenge-reading',amount:earned,at:new Date().toISOString(),task,claim});n.receipts=n.receipts.slice(-400);write(n);return {coins:n.coins,earned,volatile};
  });
 }
 return {grant,snapshot:()=>read(),isVolatile:()=>volatile,hasLocks:()=>!!locks?.request};
}
return {create};
});
