/* Shared Sunshine Coin rewards for completed writing and math activities.
   All rewards use the existing kingdom wallet; no separate currency or cloud account. */
(function(){
'use strict';
const C=window.KingdomCore;
if(!C)return;
let storage=null;
try{storage=window.localStorage;}catch(_){}
function legacy(){
 try{const s=JSON.parse(storage?.getItem('kgj-storybook-v1')||'null');if(s)return s;}catch(_){}
 try{const s=JSON.parse(storage?.getItem('kgj-v1')||'null');if(s)return {completed:s.completed?['seed']:[],flowers:s.flowers||[]};}catch(_){}
 return {};
}
const store=C.createStore({storage,locks:navigator.locks});
const ready=store.init(legacy()).catch(e=>{console.warn('Kingdom coin save needs recovery:',e.message);return null;});
let toastTimer=0;
function feedback(text){
 let el=document.getElementById('kg-coins-feedback');
 if(!el){el=document.createElement('div');el.id='kg-coins-feedback';el.setAttribute('role','status');el.setAttribute('aria-live','polite');el.style.cssText='position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:9999;background:#285e48;color:#fffdf0;padding:15px 23px;border-radius:23px;box-shadow:0 10px 26px #243b3044;font:700 18px system-ui;max-width:min(95vw,500px);text-align:center;pointer-events:none';document.body.appendChild(el);}
 el.textContent=text;clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.remove(),4000);
}
window.addEventListener('kgj:activity-complete',async e=>{
 const d=e.detail||{};
 if(!['math','writing'].includes(d.kind)||typeof d.token!=='string')return;
 const key=d.kind+':'+d.token;
 if(!/^[a-zA-Z0-9:_-]{8,120}$/.test(key))return;
 if(!await ready){feedback('Your kingdom save needs recovery. Open Grown-up Corner before playing more.');return;}
 try{
  const result=await store.act({type:'activity',kind:d.kind,token:key,task:String(d.task||'Practice').slice(0,90)});
  if(result.ok&&result.earned)feedback('⭐ +'+result.earned+' Sunshine Coins! Your kingdom is growing!');
  else if(!result.ok)feedback('Coins could not save: '+result.message);
 }catch(err){feedback('Coins could not save. Please keep your backup.');console.warn(err);}
});
window.KGJCoinsV2={ready,version:'2.0'};
})();