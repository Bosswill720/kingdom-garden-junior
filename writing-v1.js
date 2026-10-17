/* Kingdom Garden Writing Studio 1.0 — original manuscript guides.
   Local path matching, not OCR or a clinical/educational assessment.
   Coordinates are scalable; no child handwriting is sent to a server. */
(function () {
'use strict';
const $ = id => document.getElementById(id);
const paths = {
A:['M20 100 L50 20 L80 100','M32 68 H68'],
B:['M26 20 V100','M26 20 H49 C86 20 86 60 49 60 H26','M26 60 H51 C90 60 90 100 51 100 H26'],
C:['M80 31 C19 -9 5 120 80 89'],
D:['M25 20 V100','M25 20 H43 C97 20 97 100 43 100 H25'],
E:['M75 20 H25 V100 H75','M25 60 H65'],
F:['M75 20 H25 V100','M25 60 H65'],
G:['M80 31 C19 -9 5 120 80 89 V66 H54'],
H:['M25 20 V100','M75 20 V100','M25 60 H75'],
I:['M50 20 V100','M25 20 H75','M25 100 H75'],
J:['M72 20 V76 C72 112 23 108 23 80','M40 20 H85'],
K:['M25 20 V100','M78 20 L25 65 L80 100'],
L:['M25 20 V100 H78'],
M:['M18 100 V20 L50 67 L82 20 V100'],
N:['M23 100 V20 L77 100 V20'],
O:['M50 20 C7 20 7 100 50 100 C93 100 93 20 50 20'],
P:['M25 20 V100','M25 20 H49 C90 20 90 63 49 63 H25'],
Q:['M50 20 C7 20 7 100 50 100 C93 100 93 20 50 20','M57 78 L84 105'],
R:['M25 20 V100','M25 20 H49 C90 20 90 61 49 61 H25','M49 61 L80 100'],
S:['M78 30 C35 1 9 42 48 59 C95 76 75 120 22 90'],
T:['M17 20 H83','M50 20 V100'],
U:['M23 20 V72 C23 111 77 111 77 72 V20'],
V:['M20 20 L50 100 L80 20'],
W:['M12 20 L30 100 L50 52 L70 100 L88 20'],
X:['M22 20 L78 100','M78 20 L22 100'],
Y:['M20 20 L50 60 L80 20','M50 60 V100'],
Z:['M20 20 H80 L20 100 H80'],
a:['M72 57 C24 29 12 100 50 100 C68 100 74 84 72 57','M73 50 V100'],
b:['M28 20 V100','M28 66 C78 24 93 104 53 100 C33 100 28 85 28 66'],
c:['M76 57 C27 27 10 121 77 92'],
d:['M71 59 C27 28 12 100 50 100 C67 100 74 83 71 59','M73 20 V100'],
e:['M25 75 H77 C78 39 24 41 24 75 C24 105 59 108 77 91'],
f:['M72 25 C50 10 39 26 39 44 V100','M23 54 H65'],
g:['M71 59 C27 28 12 100 50 100 C67 100 74 83 71 59','M73 50 V109 C73 133 40 137 26 119'],
h:['M27 20 V100','M27 72 C27 42 75 42 75 72 V100'],
i:['M50 54 V100','M50 31 L50 32'],
j:['M60 54 V111 C60 133 35 135 27 120','M60 31 L60 32'],
k:['M27 20 V100','M73 50 L27 80 L77 100'],
l:['M50 20 V100'],
m:['M17 50 V100','M17 68 C17 43 49 42 49 67 V100','M49 68 C49 43 83 42 83 67 V100'],
n:['M27 50 V100','M27 70 C27 42 76 42 76 70 V100'],
o:['M52 50 C14 50 14 100 52 100 C90 100 90 50 52 50'],
p:['M28 50 V129','M28 65 C74 27 96 102 55 100 C35 100 28 84 28 65'],
q:['M71 59 C27 28 12 100 50 100 C67 100 74 83 71 59','M73 50 V129'],
r:['M30 50 V100','M30 70 C30 45 53 46 73 54'],
s:['M75 57 C30 33 13 71 48 77 C86 83 76 116 23 93'],
t:['M43 27 V83 C43 107 62 103 73 96','M22 53 H72'],
u:['M27 50 V79 C27 108 73 108 73 78 V50','M73 50 V100'],
v:['M23 50 L50 100 L77 50'],
w:['M12 50 L30 100 L50 65 L70 100 L88 50'],
x:['M26 50 L74 100','M74 50 L26 100'],
y:['M23 50 L50 95','M77 50 L36 130'],
z:['M25 50 H75 L25 100 H75'],
'0':['M50 20 C12 20 12 100 50 100 C88 100 88 20 50 20'],
'1':['M31 38 L51 20 V100'],
'2':['M24 40 C24 3 99 14 73 52 L24 100 H81'],
'3':['M25 27 C81 -1 97 58 49 59 C100 57 85 122 23 91'],
'4':['M60 20 L20 74 H85','M67 20 V100'],
'5':['M78 20 H28 V58 C92 35 99 125 24 92'],
'6':['M75 24 C40 6 17 53 23 82 C31 122 94 96 73 64 C57 43 26 57 23 78'],
'7':['M20 20 H80 L37 100'],
'8':['M50 20 C5 20 16 53 50 60 C95 72 90 100 50 100 C10 100 5 72 50 60 C84 53 95 20 50 20'],
'9':['M73 49 C73 6 16 16 24 49 C32 80 73 64 73 37 V74 C73 105 43 108 28 96']
};
const hints = {
A:['Up the hill, then down.','Across the middle.'],B:['Start at the top. Go down.','Back to the top. Make a small bump.','From the middle, make another bump.'],
H:['Down.','Another line down.','Join them across.'],T:['Across the top.','Down the middle.'],
a:['Go around.','Down the right side.'],b:['Tall line down.','Around the little belly.'],d:['Go around.','Tall line down.'],
i:['Down from the middle line.','Lift your Pencil. Add the dot.'],j:['Down and curl left.','Lift your Pencil. Add the dot.'],
'1':['Slant up, then straight down.'],'4':['Slant down, then across.','Down from the top.']
};
const warmups=[
 {id:'down',label:'Rain lines',symbol:'↓',paths:['M50 20 V100'],hint:'Start at the dot. Draw down.'},
 {id:'across',label:'A little bridge',symbol:'→',paths:['M15 60 H85'],hint:'Start on the left. Draw across.'},
 {id:'slant',label:'A mountain',symbol:'Λ',paths:['M15 100 L50 20 L85 100'],hint:'Up the mountain, then down.'},
 {id:'round',label:'Round the pond',symbol:'○',paths:paths.O,hint:'Go all the way around to the dot.'},
 {id:'wave',label:'River waves',symbol:'∿',paths:['M10 60 Q25 20 40 60 T70 60 T100 60'],hint:'Follow the waves, from left to right.'}
];
const words=['pip','sun','car','farm','seed','cat','mom','dad','book','bus'];
const examples={A:'apple',B:'Benny',C:'car',D:'duck',E:'egg',F:'farm',G:'garden',H:'hat',I:'insect',J:'jump',K:'kite',L:'Luna',M:'Milo',N:'nest',O:'owl',P:'Pip',Q:'quiet',R:'rain',S:'sun',T:'tree',U:'up',V:'van',W:'water',X:'fox',Y:'yellow',Z:'zebra'};
const KEY='kgj-writing-v1';
let store={done:[],pencilOnly:false,group:'warmup',saved:{},spoken:true},storageOK=true;
try {const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s&&typeof s==='object'){
 store.done=Array.isArray(s.done)?s.done.filter(x=>typeof x==='string'&&x.length<40).slice(0,100):[];
 store.pencilOnly=s.pencilOnly===true;store.spoken=s.spoken!==false;
 if(['warmup','upper','lower','number','word'].includes(s.group))store.group=s.group;
}}catch(e){storageOK=false;}
function save(){try{localStorage.setItem(KEY,JSON.stringify({done:store.done,pencilOnly:store.pencilOnly,spoken:store.spoken,group:store.group}));}catch(e){storageOK=false;}$('savedHint').textContent=storageOK?'Practice badges stay in this browser.':'Storage is unavailable. Badges last for this visit only.';}
const canvas=$('pad'),ctx=canvas.getContext('2d'),NS='http://www.w3.org/2000/svg';
const W=600,H=450,scale=3,ox=150,oy=25;
let lesson=null,letterIndex=0,strokeIndex=0,targets=[],accepted=[],loose=[],active=null,lastPen=0,copy=false,finished=false,raf=0,demo=null,ink='#426f66',speech=null;
let draftKey='',drafts=new Map();
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
function samples(path){const p=document.createElementNS(NS,'path');p.setAttribute('d',path);const len=p.getTotalLength();const n=Math.max(1,Math.ceil(len*scale/4));return Array.from({length:n+1},(_,i)=>{const q=p.getPointAtLength(len*i/n);return {x:ox+q.x*scale,y:oy+q.y*scale};});}
function resample(points,gap=4){if(points.length<2)return points.slice();const out=[points[0]];let leftover=0;for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],len=distance(a,b);if(!len)continue;for(let d=gap-leftover;d<=len;d+=gap)out.push({x:a.x+(b.x-a.x)*d/len,y:a.y+(b.y-a.y)*d/len});leftover=(leftover+len)%gap;}out.push(points.at(-1));return out;}
/* Generous, local tracing feedback: start, direction, coverage, off-path ratio.
   Does not label freehand writing correct, recognize letters, or measure skill. */
function assess(points,target){if(!points.length||!target.length)return {ok:false,reason:'start'};const sampled=resample(points);const length=target.reduce((n,p,i)=>n+(i?distance(p,target[i-1]):0),0);
 if(length<10)return {ok:distance(sampled[0],target[0])<29&&sampled.every(p=>distance(p,target[0])<34),reason:'dot'};
 if(distance(sampled[0],target[0])>40)return {ok:false,reason:'start'};
 if(sampled.length<5)return {ok:false,reason:'finish'};
 const nearest=sampled.map(p=>{let d=Infinity,k=0;target.forEach((q,i)=>{const x=distance(p,q);if(x<d){d=x;k=i;}});return {d,k};});
 const covered=target.filter(t=>sampled.some(p=>distance(p,t)<27)).length/target.length;
 const near=nearest.filter(p=>p.d<32).length/nearest.length;
 let progress=0,reverse=0;nearest.forEach(p=>{if(p.k<progress-8)reverse++;progress=Math.max(progress,p.k);});
 const goodEnd=distance(sampled.at(-1),target.at(-1))<38;
 // Closed loops share their start/end; ordered progress still rejects reversed loops.
 const early=nearest.slice(0,Math.max(4,Math.floor(nearest.length*.2)));
 const backwards=early.some(p=>p.k>target.length*.62)&&target.length>15;
 const ok=covered>=.8&&near>=.78&&goodEnd&&reverse/nearest.length<.32&&!backwards;
 return {ok,reason:!goodEnd||covered<.8?'finish':near<.78?'trail':(backwards||reverse/nearest.length>=.32)?'direction':'trail',coverage:covered,near};
}
function getLessons(group){if(group==='warmup')return warmups.map(w=>({...w,chars:[w.id],type:'warmup'}));if(group==='word')return words.map(w=>({id:'word-'+w,label:w,symbol:w,chars:[...w],type:'word'}));const list=group==='upper'?'ABCDEFGHIJKLMNOPQRSTUVWXYZ':group==='lower'?'abcdefghijklmnopqrstuvwxyz':'0123456789';return [...list].map(c=>({id:group+'-'+c,label:c,symbol:c,chars:[c],type:group}));}
function selection(){const list=getLessons(store.group);$('choices').innerHTML=list.map(l=>`<button type="button" class="lesson ${l.id===lesson?.id?'selected':''}" data-lesson="${l.id}" aria-pressed="${l.id===lesson?.id}" aria-label="Practice ${esc(l.label)}${store.done.includes(l.id)?', badge earned':''}"><strong>${esc(l.symbol)}</strong>${store.group==='warmup'?`<span>${esc(l.label)}</span>`:''}${store.done.includes(l.id)?'<i aria-hidden="true">✓</i>':''}</button>`).join('');document.querySelectorAll('[data-group]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.group===store.group)));$('lessonCount').textContent=list.length+' little '+(store.group==='word'?'words':store.group==='warmup'?'warm-ups':'guides')+' to explore';$('badgeCount').textContent=store.done.length;}
function cancelSpeech(){if('speechSynthesis'in window)window.speechSynthesis.cancel();speech=null;}
function say(text){cancelSpeech();if(!('speechSynthesis'in window)){$('voiceNote').textContent='Read-aloud guidance is unavailable in this browser.';return;}const u=new SpeechSynthesisUtterance(text);speech=u;u.lang='en-US';u.rate=.83;const vs=window.speechSynthesis.getVoices();u.voice=vs.find(v=>/^en-US$/i.test(v.lang)&&/Samantha|Ava|Zoe|Jenny/i.test(v.name))||vs.find(v=>/^en/i.test(v.lang))||null;u.onend=()=>{speech=null;};u.onerror=e=>{if(!['canceled','interrupted'].includes(e.error))$('voiceNote').textContent='Tap Hear the guide again, or check device sound.';};window.speechSynthesis.speak(u);}
function hint(){if(finished)return copy?'You practiced! You can try tracing, or choose a new guide.':'You followed every stroke. Lovely practice!';if(copy)return 'Look at the little model. Try it in the blank space.';const ch=lesson.chars[letterIndex];return lesson.type==='warmup'?lesson.hint:(hints[ch]?.[strokeIndex]||'Start at the green dot. Follow the arrow to the end.');}
function message(text,kind=''){const el=$('feedback');el.textContent=text;el.className='feedback '+kind;}
function feedback(){message(hint(),finished?'success':'');$('strokeHint').textContent=copy?'My own try':finished?'Guide completed':`Stroke ${strokeIndex+1} of ${targets.length}`;$('nextLetter').hidden=lesson.type!=='word'||!finished||letterIndex===lesson.chars.length-1;$('nextLetter').textContent='Next letter: '+(lesson.chars[letterIndex+1]||'');$('markTry').hidden=!copy;$('markTry').disabled=!copy||loose.length===0||finished;$('undo').disabled=!accepted.length&&!loose.length;}
function remember(){if(active)active=null;if(!lesson)return;drafts.set(draftKey,{accepted:accepted.map(p=>p.slice()),loose:loose.map(p=>p.slice()),strokeIndex,finished});}
function loadLetter(reset=false){stopDemo();cancelSpeech();active=null;const ch=lesson.chars[letterIndex];targets=(lesson.type==='warmup'?lesson.paths:paths[ch]).map(samples);draftKey=lesson.id+'-'+letterIndex+'-'+(copy?'copy':'trace');const d=!reset&&drafts.get(draftKey);accepted=d?d.accepted:[];loose=d?d.loose:[];strokeIndex=d?d.strokeIndex:0;finished=d?d.finished:false;
 $('guideTitle').textContent=lesson.type==='warmup'?lesson.label:lesson.type==='word'?'Let’s write “'+lesson.label+'”':'Let’s write '+ch;
 $('character').textContent=lesson.type==='word'?`Letter ${letterIndex+1} of ${lesson.chars.length}: ${ch}`:lesson.type==='warmup'?'A little pencil adventure':lesson.type==='number'?'Number '+ch:(lesson.type==='upper'?'Capital ':'Little ')+ch;
 $('meaning').textContent=lesson.type==='word'?'One letter at a time.':examples[ch.toUpperCase()]?(ch.toUpperCase()==='X'?'X is in fox.':ch.toUpperCase()+' is for '+examples[ch.toUpperCase()]+'.'):'Start at the green dot.';
 $('wordSteps').innerHTML=lesson.type==='word'?lesson.chars.map((c,i)=>`<span class="${i===letterIndex?'now':''}" aria-label="${esc(c)}${i===letterIndex?', current letter':''}">${esc(c)}</span>`).join(''):'';
 $('model').innerHTML=`<svg viewBox="0 0 110 145" aria-hidden="true"><path d="M5 20H105M5 100H105" fill="none" stroke="#ccd9d1" stroke-width="1"/>${(lesson.type==='warmup'?lesson.paths:paths[ch]).map(p=>`<path d="${p}" fill="none" stroke="#376e5c" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>`).join('')}</svg>`;
 $('model').hidden=!copy;canvas.setAttribute('aria-label',copy?'Freehand practice pad. Copy '+lesson.label+'.':'Trace '+lesson.label+'. '+targets.length+' strokes. Follow the numbered green dot.');
 feedback();draw();}
function selectLesson(id){remember();lesson=getLessons(store.group).find(l=>l.id===id)||getLessons(store.group)[0];letterIndex=0;loadLetter();selection();location.hash=lesson.id;}
function strokeLine(points,color,width,dash=[]){if(!points.length)return;ctx.beginPath();ctx.lineWidth=width;ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineCap='round';ctx.lineJoin='round';ctx.setLineDash(dash);if(points.length===1||distance(points[0],points.at(-1))<2&&points.length<4){ctx.arc(points[0].x,points[0].y,width/2,0,Math.PI*2);ctx.fill();}else{ctx.moveTo(points[0].x,points[0].y);for(const p of points.slice(1))ctx.lineTo(p.x,p.y);ctx.stroke();}ctx.setLineDash([]);}
function draw(){if(!ctx)return;ctx.clearRect(0,0,W,H);ctx.fillStyle='#fffefa';ctx.fillRect(0,0,W,H);
 // Writing guidelines: cap line, x-height line, baseline, descender line.
 [85,175,325,415].forEach((y,i)=>{ctx.strokeStyle=i===2?'#bacfd0':'#dde5df';ctx.lineWidth=i===2?2:1.3;ctx.setLineDash(i===1?[8,8]:[]);ctx.beginPath();ctx.moveTo(35,y);ctx.lineTo(W-35,y);ctx.stroke();});ctx.setLineDash([]);
 if(!lesson)return;
 if(!copy){targets.forEach((p,i)=>{strokeLine(p,i<strokeIndex?'#d1e8dc':i===strokeIndex?'#e6f0e6':'#f0eee7',24);strokeLine(p,i===strokeIndex?'#8baba0':'#c5cec4',3,[1,10]);});}
 accepted.forEach(p=>strokeLine(p,'#47876e',8));loose.forEach(p=>strokeLine(p,ink,8));if(active)strokeLine(active.points,ink,8);
 if(!copy&&!finished&&!demo){const t=targets[strokeIndex],start=t[0];ctx.fillStyle='#2e725a';ctx.beginPath();ctx.arc(start.x,start.y,15,0,Math.PI*2);ctx.fill();ctx.fillStyle='white';ctx.font='bold 15px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(strokeIndex+1),start.x,start.y);
 if(t.length>6){const p=t[Math.min(9,t.length-1)],q=t[Math.min(6,t.length-2)],a=Math.atan2(p.y-q.y,p.x-q.x);ctx.save();ctx.translate(p.x,p.y);ctx.rotate(a);ctx.strokeStyle='#2e725a';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-7,-7);ctx.lineTo(0,0);ctx.lineTo(-7,7);ctx.stroke();ctx.restore();}
 const end=t.at(-1);if(distance(start,end)>30){ctx.beginPath();ctx.arc(end.x,end.y,6,0,Math.PI*2);ctx.fillStyle='#d9ae54';ctx.fill();}}
 if(demo){const t=targets[demo.index],visible=t.slice(0,Math.max(1,Math.floor(demo.progress*t.length)));strokeLine(visible,'#be9343',8);const p=visible.at(-1);ctx.beginPath();ctx.arc(p.x,p.y,10,0,Math.PI*2);ctx.fillStyle='#e8b851';ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.stroke();}}
function resize(){const dpr=Math.min(window.devicePixelRatio||1,3);canvas.width=W*dpr;canvas.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);draw();}
function pos(e){const r=canvas.getBoundingClientRect();return {x:(e.clientX-r.left)*W/r.width,y:(e.clientY-r.top)*H/r.height};}
function down(e){if(store.pencilOnly&&e.pointerType!=='pen'){message('Pencil-only is on. Use your Apple Pencil, or turn it off.');return;}if(e.pointerType==='touch'&&Date.now()-lastPen<1200)return;if(e.pointerType==='mouse'&&e.button!==0)return;
 if(e.pointerType==='pen'){lastPen=Date.now();if(active&&active.type!=='pen')active=null;}
 if(active)return;e.preventDefault();stopDemo();cancelSpeech();if(finished&&!copy){message('Lovely practice! Tap Try again or choose another guide.','success');return;}
 try{canvas.setPointerCapture(e.pointerId);}catch(_){}active={id:e.pointerId,type:e.pointerType,points:[pos(e)]};$('inputState').textContent=e.pointerType==='pen'?'Pencil connected':e.pointerType==='touch'?'Finger drawing':'Mouse drawing';draw();}
function move(e){if(!active||active.id!==e.pointerId)return;e.preventDefault();if(e.pointerType==='pen')lastPen=Date.now();const events=e.getCoalescedEvents?.()||[];for(const c of events.length?events:[e]){const p=pos(c);if(distance(p,active.points.at(-1))>1)active.points.push(p);}if(active.points.length>5000)active.points=resample(active.points,5);draw();}
function up(e){if(!active||active.id!==e.pointerId)return;e.preventDefault();const p=pos(e);if(distance(p,active.points.at(-1))>1)active.points.push(p);const points=active.points;active=null;try{canvas.releasePointerCapture(e.pointerId);}catch(_){}
 if(copy){loose.push(points);finished=false;remember();feedback();draw();return;}
 const result=assess(points,targets[strokeIndex]);if(result.ok){accepted.push(points);strokeIndex++;finished=strokeIndex===targets.length;remember();feedback();if(finished){complete();}else message('Nice line! '+hint(),'success');}
 else message(result.reason==='start'?'Let’s begin at the green numbered dot.':result.reason==='direction'?'Follow the arrow this time. You can watch Show me.':result.reason==='finish'?'Keep going to the end of the dotted trail.':'Nice try! Stay near the dotted trail. Try this stroke again.');draw();}
function cancel(e){if(active&&active.id===e.pointerId){active=null;draw();}}
function complete(){const all=lesson.type!=='word'||lesson.chars.every((c,i)=>i===letterIndex?finished:drafts.get(lesson.id+'-'+i+'-'+(copy?'copy':'trace'))?.finished);
 if(all){if(!store.done.includes(lesson.id)){store.done.push(lesson.id);save();selection();}message(copy?'You practiced '+lesson.label+'! A little practice bloom is yours.':'You traced '+lesson.label+'! A little practice bloom is yours.','success');$('celebrate').hidden=false;}else message('Lovely '+lesson.chars[letterIndex]+'! Tap Next letter.','success');feedback();if(all)message(copy?'Practice saved! Your bloom celebrates trying, not a grade.':'You followed every stroke! Your practice bloom is saved.','success');}
function stopDemo(){cancelAnimationFrame(raf);raf=0;demo=null;$('show').textContent='▷ Show me';}
function showDemo(){if(demo){stopDemo();draw();message(hint());return;}cancelSpeech();active=null;let i=finished||copy?0:strokeIndex;const duration=reduced.matches?0:1400;let began=0;demo={index:i,progress:0};$('show').textContent='■ Stop demo';
 if(reduced.matches){demo={index:i,progress:1};draw();message('Full stroke shown. Follow its numbered start and arrow.');return;}
 const frame=t=>{if(!demo)return;if(!began)began=t;demo.progress=Math.min(1,(t-began)/duration);demo.index=i;draw();if(t-began>duration+500){i++;if(i>=targets.length){stopDemo();draw();message(hint());return;}began=t;demo={index:i,progress:0};}raf=requestAnimationFrame(frame);};raf=requestAnimationFrame(frame);message('Watch the gold dot. Your turn is next.');}
function reset(){stopDemo();active=null;accepted=[];loose=[];strokeIndex=0;finished=false;drafts.delete(draftKey);$('celebrate').hidden=true;loadLetter(true);}
function undo(){stopDemo();active=null;if(copy){loose.pop();finished=false;}else if(accepted.length){accepted.pop();strokeIndex=Math.max(0,strokeIndex-1);finished=false;}remember();$('celebrate').hidden=true;feedback();draw();}
canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',cancel);canvas.addEventListener('lostpointercapture',cancel);canvas.addEventListener('contextmenu',e=>e.preventDefault());
$('show').onclick=showDemo;$('hear').onclick=()=>say((lesson.type==='word'?'Let’s write '+lesson.label+'. ':lesson.type==='warmup'?lesson.label+'. ':'Let’s write '+lesson.chars[letterIndex]+'. ')+hint());$('clear').onclick=reset;$('undo').onclick=undo;
$('nextLetter').onclick=()=>{remember();letterIndex++;$('celebrate').hidden=true;loadLetter();};
$('markTry').onclick=()=>{if(!loose.length)return;finished=true;remember();complete();};
$('pencilOnly').checked=store.pencilOnly;$('pencilOnly').onchange=e=>{active=null;store.pencilOnly=e.target.checked;save();message(store.pencilOnly?'Only Pencil marks will be drawn. Buttons still work with your finger.':hint());draw();};
$('mode').onchange=e=>{remember();copy=e.target.value==='copy';$('celebrate').hidden=true;loadLetter();};
$('choices').onclick=e=>{const b=e.target.closest('[data-lesson]');if(b){$('celebrate').hidden=true;selectLesson(b.dataset.lesson);}};
$('groups').onclick=e=>{const b=e.target.closest('[data-group]');if(!b)return;remember();store.group=b.dataset.group;save();$('celebrate').hidden=true;selectLesson(getLessons(store.group)[0].id);};
$('again').onclick=reset;$('chooseNext').onclick=()=>{const list=getLessons(store.group),i=list.findIndex(l=>l.id===lesson.id);$('celebrate').hidden=true;selectLesson(list[(i+1)%list.length].id);};
$('export').onclick=()=>{const blob=new Blob([JSON.stringify({version:1,completedGuides:store.done},null,2)],{type:'application/json'});const a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download='kingdom-writing-badges.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
$('savePicture').onclick=()=>{stopDemo();draw();canvas.toBlob(blob=>{if(!blob)return;const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='my-writing-'+lesson.id+'.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});};
window.addEventListener('resize',resize);window.addEventListener('pagehide',()=>{remember();stopDemo();cancelSpeech();});document.addEventListener('visibilitychange',()=>{if(document.hidden){active=null;stopDemo();cancelSpeech();draw();}});
// Read-only diagnostics for reproducible browser tests; no rewards API exposed.
window.KGJWriting={version:'1.0',paths,assess,samples,resample,lessonCounts:{warmup:5,upper:26,lower:26,number:10,word:10},getCurrent:()=>({id:lesson?.id,letterIndex,strokeIndex,finished,copy,active:!!active,targets:targets.map(t=>t.map(p=>({...p}))),accepted:accepted.length,loose:loose.length})};
let incoming='';try{incoming=decodeURIComponent(location.hash.slice(1));}catch(_){}for(const group of ['warmup','upper','lower','number','word'])if(getLessons(group).some(l=>l.id===incoming)){store.group=group;break;}
resize();selectLesson(incoming);save();
})();
