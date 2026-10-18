/* Challenge Lab: deterministic question engine and conservative answer parsing.
   Educational practice, not an assessment or age placement. No network calls. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.KGChallengeCore=api;})(typeof window!=='undefined'?window:globalThis,function(){
'use strict';
const levels=[{id:0,name:'Stretch',tag:'Build a strategy',detail:'Multi-step work, equal groups, fractions and evidence.'},{id:1,name:'Reason',tag:'Explain your thinking',detail:'Larger numbers, unknowns, equivalent fractions and inference.'},{id:2,name:'Deep Think',tag:'Connect ideas',detail:'Several operations, constraints, fractional quantities and competing explanations.'}];
const skills=[
{id:'delivery',name:'Delivery Planner',mark:'↗',tag:'Multi-step problems',intro:'Plan the stops. Work out what remains.'},
{id:'machine',name:'Mystery Machine',mark:'?',tag:'Unknown numbers',intro:'Work backward through a number machine.'},
{id:'fractions',name:'Fraction Kitchen',mark:'½',tag:'Parts, wholes & equivalence',intro:'Compare equal parts and share whole collections.'},
{id:'place',name:'Number Architect',mark:'▦',tag:'Place value & regrouping',intro:'Build, exchange and compare numbers.'},
{id:'time',name:'Clockwork Trail',mark:'◷',tag:'Elapsed time',intro:'Follow a journey that crosses the hour.'},
{id:'market',name:'Market Budget',mark:'¢',tag:'Money & decisions',intro:'Use a budget, bundles and change.'},
{id:'patterns',name:'Pattern Detective',mark:'⋯',tag:'Rules & sequences',intro:'Apply a stated rule, not just a guess.'},
{id:'logic',name:'Clue Chest',mark:'◇',tag:'Constraint reasoning',intro:'Combine the clues to discover one number.'}
];
function rng(seed){let s=seed>>>0;return()=>{s=(Math.imul(1664525,s)+1013904223)>>>0;return s/4294967296;};}
const pick=(r,a)=>a[Math.floor(r()*a.length)];
const int=(r,a,b)=>a+Math.floor(r()*(b-a+1));
function gcd(a,b){while(b){const t=b;b=a%b;a=t;}return a;}
function clock(m){const t=((m%720)+720)%720;return (Math.floor(t/60)||12)+':'+String(t%60).padStart(2,'0');}
function numeric(raw){const s=String(raw).trim().replace(/−/g,'-');return /^-?\d+(?:\.\d+)?$/.test(s)?Number(s):null;}
function correct(raw,q){const v=String(raw).trim();if(q.kind==='time'){if(!/^\d{1,2}:\d{2}$/.test(v))return false;const [h,m]=v.split(':').map(Number);return h>=1&&h<=12&&m<60&&clock(h*60+m)===q.answer;}if(q.kind==='fraction'){const m=v.match(/^(\d+)\s*\/\s*(\d+)$/);if(!m||+m[2]===0)return false;return +m[1]*q.fraction[1]===+m[2]*q.fraction[0];}return numeric(v)===q.answer;}
function make(skill,level,seed){
 if(!skills.some(s=>s.id===skill)||![0,1,2].includes(level))throw Error('Unknown challenge or level.');
 const r=rng(seed),q={skill,level,kind:'number',unit:'',prompt:'',answer:0,hint:'',steps:[],visual:null};let a,b,c,d,total;
 switch(skill){
 case 'delivery':
  if(level===0){a=int(r,25,58);b=int(r,12,27);c=int(r,7,19);q.prompt=`Pip loads ${a} books, then adds ${b} more. He delivers ${c} books to school. How many remain?`;q.answer=a+b-c;q.hint='Find the total load before taking away the delivery.';q.steps=[`${a} + ${b} = ${a+b} books loaded.`,`${a+b} − ${c} = ${q.answer} books left.`];q.visual={type:'steps',values:[`${a} books`,`+ ${b}`,`− ${c}`]};}
  else{a=int(r,level===1?3:6,level===1?8:12);b=int(r,level===1?4:12,level===1?9:24);c=int(r,2,Math.min(24,a*b-1));d=level===2?int(r,4,19):0;q.prompt=`A truck has ${a} boxes with ${b} books in each. It delivers ${c} books${d?`, then collects ${d} returns`:''}. How many books are on the truck now?`;q.answer=a*b-c+d;q.hint='Multiply to count all the books, not just the boxes. Then follow the stops in order.';q.steps=[`${a} × ${b} = ${a*b} books before the first stop.`,`${a*b} − ${c} = ${a*b-c} after delivery.`,...(d?[`${a*b-c} + ${d} = ${q.answer} after the returns.`]:[])];q.visual={type:'steps',values:[`${a} boxes × ${b}`,`− ${c}`,...(d?[`+ ${d}`]:[])]};}q.unit='books';break;
 case 'machine':
  a=int(r,2,level===2?12:9);b=int(r,2,12);c=int(r,3,19);
  if(level===0){q.prompt=`A mystery number plus ${c} equals ${a*b+c}. What is the number?`;q.answer=a*b;q.hint='Undo adding by subtracting.';q.steps=[`? + ${c} = ${a*b+c}`,`${a*b+c} − ${c} = ${q.answer}`];q.visual={type:'steps',values:['?',`+ ${c}`,`= ${a*b+c}`]};}
  else{q.answer=b;total=a*b+c;q.prompt=`A machine multiplies your number by ${a}, then adds ${c}. Its output is ${total}. What went in?`;q.hint='Undo the LAST step first. Subtract, then divide.';q.steps=[`Undo + ${c}: ${total} − ${c} = ${a*b}.`,`Undo × ${a}: ${a*b} ÷ ${a} = ${b}.`,`Check: (${b} × ${a}) + ${c} = ${total}.`];q.visual={type:'steps',values:['?',`× ${a}`,`+ ${c}`,`= ${total}`]};}break;
 case 'fractions':
  d=pick(r,[2,3,4,6,8]);a=int(r,1,d-1);
  if(level===0){q.kind='fraction';q.fraction=[a,d];q.answer=`${a}/${d}`;q.prompt=`A tray is split into ${d} equal parts. ${a} parts contain berries. What fraction contains berries? Write a fraction such as 1/4.`;q.hint='The denominator counts all equal parts. The numerator counts the parts you use.';q.steps=[`There are ${d} equal parts in one whole tray.`,`${a} are filled, so the fraction is ${a}/${d}.`];q.visual={type:'fraction',parts:d,filled:a};}
  else if(level===1){b=pick(r,[2,3,4]);q.prompt=`Keep the same amount of a whole tray: ${a}/${d} = ?/${d*b}. What numerator belongs in the blank?`;q.answer=a*b;q.hint=`Each old part is split into ${b} smaller equal parts. Do the same to numerator and denominator.`;q.steps=[`${d} × ${b} = ${d*b} equal parts in the whole.`,`${a} × ${b} = ${a*b} filled parts.`,`${a}/${d} = ${a*b}/${d*b}.`];q.visual={type:'fraction',parts:d,filled:a};}
  else{b=int(r,3,9);total=d*b;q.prompt=`There are ${total} strawberries. Milo uses ${a}/${d} of them for a cake. How many strawberries does he use?`;q.answer=a*b;q.hint='Share the total into denominator-many equal groups, then take numerator-many groups.';q.steps=[`One ${d}th: ${total} ÷ ${d} = ${b}.`,`${a} groups: ${a} × ${b} = ${a*b}.`];q.visual={type:'steps',values:[`${total} strawberries`,`÷ ${d}`,`× ${a}`]};q.unit='strawberries';}break;
 case 'place':
  a=int(r,2,8);b=int(r,1,7);c=int(r,1,9);
  if(level===0){q.prompt=`Build a number with ${a} tens and ${c} ones. Add ${b} more tens. What is the new number?`;q.answer=(a+b)*10+c;q.hint='A ten is worth 10, not 1. You may need to regroup ten tens as one hundred.';q.steps=[`${a} tens and ${c} ones make ${a*10+c}.`,`${b} tens are ${b*10}.`,`${a*10+c} + ${b*10} = ${q.answer}.`];q.visual={type:'steps',values:[`${a} tens`,`${c} ones`,`+ ${b} tens`]};}
  else if(level===1){total=a*100+b*10+c;d=int(r,2,9)*10;q.prompt=`The town has ${total} blocks. It receives ${d} more blocks, then gives away 100. How many are left?`;q.answer=total+d-100;q.hint='Use hundreds, tens and ones. Do the addition before giving away one hundred.';q.steps=[`${total} + ${d} = ${total+d}.`,`${total+d} − 100 = ${q.answer}.`];q.visual={type:'steps',values:[`${total}`,`+ ${d}`,'− 100']};}
  else{if(a===c)c=a===9?1:a+1;const n=a*100+b*10+c,rev=c*100+b*10+a;q.prompt=`Swap the hundreds and ones digits of ${n}; keep the tens digit. What is the positive difference between the two numbers?`;q.answer=Math.abs(n-rev);q.hint='First write the changed number. Subtract the smaller number from the larger.';q.steps=[`Swapping changes ${n} to ${rev}.`,`${Math.max(n,rev)} − ${Math.min(n,rev)} = ${q.answer}.`];q.visual={type:'steps',values:[String(n),'swap outer digits','difference?']};}break;
 case 'time':
  a=int(r,7,10)*60+pick(r,[10,20,25,35,40,45,50]);b=pick(r,level===0?[15,20,30]:[35,45,55,65,75]);c=level===2?pick(r,[10,15,20]):0;
  q.kind='time';q.answer=clock(a+b+c);q.prompt=`The bus leaves at ${clock(a)} in the morning. The trip takes ${b} minutes${c?` and a rest stop takes ${c} more minutes`:''}. When does it arrive? Use hours:minutes, such as 9:05.`;q.hint='There are 60 minutes in an hour. Count to the next hour, then count the remaining minutes.';q.steps=[`Travel time${c?' plus the rest stop':''}: ${b}${c?' + '+c:''} = ${b+c} minutes.`,`Start at ${clock(a)}. After ${b+c} minutes it is ${q.answer}.`];q.visual={type:'steps',values:[clock(a),`+ ${b} min`,...(c?[`+ ${c} min`]:[]),'arrival?']};break;
 case 'market':
  if(level===0){total=100;a=int(r,18,44);b=int(r,15,38);q.prompt=`You have 100 cents. A pencil costs ${a} cents and an eraser costs ${b} cents. How many cents remain after buying both?`;q.answer=100-a-b;q.hint='Combine both prices, then subtract that total from your budget.';q.steps=[`${a} + ${b} = ${a+b} cents spent.`,`100 − ${a+b} = ${q.answer} cents left.`];q.unit='cents';q.visual={type:'steps',values:['100 cents',`− ${a}`,`− ${b}`]};}
  else if(level===1){a=int(r,3,7);b=pick(r,[12,15,18,25]);total=Math.ceil(a*b/100)*100+100;q.prompt=`You buy ${a} stickers at ${b} cents EACH and pay ${total} cents. How much change do you get, in cents?`;q.answer=total-a*b;q.hint='Multiply the number of stickers by the price of ONE sticker.';q.steps=[`${a} × ${b} = ${a*b} cents spent.`,`${total} − ${a*b} = ${q.answer} cents change.`];q.unit='cents';q.visual={type:'steps',values:[`${total} cents`,`${a} × ${b} cents`,'change?']};}
  else{a=int(r,3,8);b=int(r,9,18);c=int(r,1,b-1);total=a*b+c;q.prompt=`A plant costs ${b} coins. Your budget is ${total} coins. What is the GREATEST number of whole plants you can buy?`;q.answer=a;q.hint='You cannot buy part of a plant. Check that one more plant would cost too much.';q.steps=[`${a} × ${b} = ${a*b}, which fits the budget.`,`${a+1} × ${b} = ${(a+1)*b}, which is more than ${total}.`,`So ${a} whole plants is the maximum; ${c} coins remain.`];q.unit='plants';q.visual={type:'steps',values:[`${total} coins`,`${b} each`,'whole plants?']};}break;
 case 'patterns':
  a=int(r,2,8);b=int(r,2,5);
  if(level===0){const v=Array.from({length:4},(_,i)=>a+i*b);q.answer=a+4*b;q.prompt=`Rule: add ${b} each time. ${v.join(', ')}, __. What comes next?`;q.hint='Use the stated rule on the last number.';q.steps=[`${v[3]} + ${b} = ${q.answer}.`];q.visual={type:'steps',values:v.map(String).concat('?')};}
  else if(level===1){const v=[a];for(let i=0;i<3;i++)v.push(v.at(-1)+b+i);q.answer=v[3]+b+3;q.prompt=`Rule: add ${b}, then ${b+1}, then ${b+2}, and keep increasing the added amount by 1. ${v.join(', ')}, __. What is next?`;q.hint=`The next jump is ${b+3}, not ${b+2}.`;q.steps=[`The jumps are ${b}, ${b+1}, ${b+2}, ${b+3}.`,`${v[3]} + ${b+3} = ${q.answer}.`];q.visual={type:'steps',values:v.map(String).concat('?')};}
  else{const v=[a];for(let i=0;i<3;i++)v.push(v.at(-1)*2+1);q.answer=v[3]*2+1;q.prompt=`Rule: double the previous number, THEN add 1. ${v.join(', ')}, __. What comes next?`;q.hint='Both operations happen at each step.';q.steps=[`Double ${v[3]}: ${v[3]} × 2 = ${v[3]*2}.`,`Add 1: ${v[3]*2} + 1 = ${q.answer}.`];q.visual={type:'steps',values:v.map(String).concat('?')};}break;
 case 'logic':
  a=int(r,2,8);b=int(r,1,8);
  if(level===0){total=a*10+b;q.prompt=`My tens digit is ${a}. My two digits add to ${a+b}. What two-digit number am I?`;q.answer=total;q.hint='Subtract the tens digit from the digit sum to find the ones digit.';q.steps=[`Ones digit: ${a+b} − ${a} = ${b}.`,`The number is ${a}${b}.`];q.visual={type:'steps',values:[`tens = ${a}`,`digit sum = ${a+b}`,'number?']};}
  else if(level===1){const low=a*10,high=low+10;total=low+b;q.prompt=`I am greater than ${low} and less than ${high}. My digits add to ${a+b}. What number am I?`;q.answer=total;q.hint='The interval fixes the tens digit. Use the sum to find the other digit.';q.steps=[`The tens digit must be ${a}.`,`Ones: ${a+b} − ${a} = ${b}.`,`Check: ${low} < ${total} < ${high}.`];q.visual={type:'steps',values:[`> ${low}`,`< ${high}`,`digits total ${a+b}`]};}
  else{b=int(r,1,6);c=b+2;total=a*100+b*10+c;q.prompt=`I am a three-digit number. My hundreds digit is ${a}. My ones digit is 2 MORE than my tens digit. My digits add to ${a+b+c}. What number am I?`;q.answer=total;q.hint='Remove the hundreds digit from the sum. The two remaining digits differ by 2.';q.steps=[`The tens and ones digits sum to ${b+c}.`,`Take away the extra 2: ${b+c} − 2 = ${2*b}.`,`Two equal tens-digit parts: ${2*b} ÷ 2 = ${b}.`,`The ones digit is ${b+2}. The number is ${total}.`];q.visual={type:'steps',values:[`hundreds ${a}`,'ones = tens + 2',`digit sum ${a+b+c}`]};}break;
 }
 q.id=skill+'-'+level+'-'+(seed>>>0);return q;
}
function adventure(skill,level,seed,count=5){return Array.from({length:count},(_,i)=>make(skill,level,(seed+Math.imul(i+1,2654435761))>>>0));}
return {version:'1.0',levels,skills,make,adventure,correct,numeric,clock,gcd};
});
