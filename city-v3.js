/* Kingdom Garden Junior — Living City 3.0
   Large illustrated neighborhood with real owned-state rendering.
   The established shared wallet remains untouched.
   Test coins continue in an isolated storage namespace. */
(function(){
'use strict';
const C=window.KingdomCore;
const $=id=>document.getElementById(id);
if(!C||!$('content'))return;
const W=2760,H=2320,TEST_KEY='kgj-kingdom-city-v2-test-wallet';
const testing=new URLSearchParams(location.search).get('test')==='1';
const reduceMotion=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const clone=o=>JSON.parse(JSON.stringify(o));
const safe=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const lots=[
 {id:'library',title:'The Storybook Library',type:'library',x:355,y:280,row:0,icon:'📚',description:'Pip’s favorite place. Every new story helps your whole town grow.',link:'./library.html#library'},
 {id:'home',title:'Pip’s Cozy Cottage',type:'home',x:1025,y:280,row:0,icon:'🏡',description:'Welcome home! Your little kingdom starts with kindness and imagination.'},
 {id:'farm',title:'Sunshine Farm',type:'farm',x:1695,y:280,row:0,icon:'🌻',description:'Plant, grow, and harvest crops in your original Kingdom farm.',link:'./library.html#kingdom/farm'},
 {id:'city-center',title:'Grand Town Hall',type:'townhall',x:2370,y:280,row:0,icon:'🏛️',description:'Open the friendly civic square and the grand boulevard.',land:'city-center'},
 {id:'playground',title:'Rainbow Playground',type:'playground',x:355,y:825,row:1,icon:'🛝',description:'Slides, gentle swings and happy afternoons.',land:'playground'},
 {id:'bakery',title:'Little Cloud Bakery',type:'bakery',x:1025,y:825,row:1,icon:'🧁',description:'A cozy pink bakery with a striped awning and friendly neighbors.',land:'bakery'},
 {id:'market-square',title:'Sunshine Market',type:'market',x:1695,y:825,row:1,icon:'🏪',description:'Take your harvest to a colorful outdoor market.',land:'market-square'},
 {id:'garage',title:'My Happy Garage',type:'garage',x:2370,y:825,row:1,icon:'🚗',description:'All your collected cars are ready for a neighborhood drive.',tab:'garage'},
 {id:'orchard',title:'Apple Blossom Orchard',type:'orchard',x:355,y:1350,row:2,icon:'🍎',description:'Discover fruit trees, blossoms and butterflies.',land:'orchard'},
 {id:'village',title:'Little Village Lane',type:'village',x:1025,y:1350,row:2,icon:'🏘️',description:'Open a row of lovely storybook cottages.',land:'village'},
 {id:'rainbow-fountain',title:'Rainbow Fountain',type:'fountain',x:1695,y:1350,row:2,icon:'⛲',description:'Meet friends beside the sparkling fountain.',land:'rainbow-fountain'},
 {id:'school',title:'Benny’s Little School',type:'school',x:2370,y:1350,row:2,icon:'🎒',description:'Benny is waiting with games and learning adventures.',link:'./math.html'},
 {id:'meadow',title:'Sunflower Meadow',type:'meadow',x:355,y:1900,row:3,icon:'🌼',description:'Open extra planting plots back on your farm.',land:'meadow'},
 {id:'pond',title:'The Wishing Pond',type:'pond',x:1025,y:1900,row:3,icon:'🦆',description:'Listen to the ducks and watch the ripples.',link:'./library.html#library'},
 {id:'festival',title:'Friendship Festival',type:'festival',x:1695,y:1900,row:3,icon:'🎡',description:'A happy spot to celebrate new books and adventures.'},
 {id:'castle-hill',title:'Moonlight Story Castle',type:'castle',x:2370,y:1900,row:3,icon:'🏰',description:'Unlock the very grand castle at the top of the hill.',land:'castle-hill'}
];
const icons={meadow:'🌾',village:'🏘️','market-square':'🏪',orchard:'🍎','city-center':'🏛️',playground:'🛝',bakery:'🧁','rainbow-fountain':'⛲','castle-hill':'🏰'};
const paint={'red-car':'#e87577','blue-car':'#7cadd0','yellow-taxi':'#e9bd58',pickup:'#c28b78',tractor:'#82aa72','icecream-van':'#dca7c8','school-bus':'#e5bc53','fire-truck':'#df716c','police-car':'#8aa8cd','dump-truck':'#d5ad67',excavator:'#d9ac51','race-car':'#ce95c6','camper-van':'#a2bfa7','big-truck':'#ab83c7'};
let store,model,tab='world',chosen='home',zoom=1,pending=null,toastTimer=0,animation=0;
let driving={x:1025,y:560};
let mapOffset=null,justStarted=true;
function owned(l){return !l.land||model.lands.includes(l.land);}
function labelForLot(l){return owned(l)?'Visit '+l.title:'Unlock '+l.title;}
function rgb(seed){const x=Math.sin(seed*12.9898+78.233)*43758.5453;return x-Math.floor(x);}
function flower(x,y,i){
 const a=['#fff4c0','#ef9cbb','#ffe1a0','#c9b9e3','#ffffff'][i%5];
 return '<g transform="translate('+x+' '+y+')"><path d="M0 0V-11" stroke="#609768" stroke-width="3"/><circle cx="-5" cy="-13" r="5" fill="'+a+'"/><circle cx="5" cy="-13" r="5" fill="'+a+'"/><circle cy="-18" r="5" fill="'+a+'"/><circle cy="-10" r="5" fill="'+a+'"/><circle cy="-14" r="3.5" fill="#efc66f"/></g>';
}
function tree(x,y,s=1,pink=false){
 const a=pink?'#eeb6c7':'#8dc39a',b=pink?'#f5d6df':'#b3d9aa',c=pink?'#e6a6bb':'#6fae8d';
 return '<g transform="translate('+x+' '+y+') scale('+s+')"><ellipse cx="4" cy="7" rx="49" ry="15" fill="#55795b2b"/><path d="M0 0V-98" stroke="#977457" stroke-width="15" stroke-linecap="round"/><circle cx="-23" cy="-91" r="49" fill="'+a+'"/><circle cx="26" cy="-91" r="43" fill="'+c+'"/><circle cx="4" cy="-124" r="46" fill="'+b+'"/><path d="M-29-110Q-7-139 22-125" fill="none" stroke="#ffffff77" stroke-width="7" stroke-linecap="round"/>'+(pink?'<circle cx="-28" cy="-106" r="7" fill="#f8e9df"/><circle cx="28" cy="-111" r="7" fill="#f8e9df"/>':'')+'</g>';
}
function clouds(){let out='';for(let i=0;i<17;i++){const x=rgb(i+51)*W,y=rgb(i+63)*H,r=30+rgb(i+31)*36;out+='<g opacity=".3" transform="translate('+x+' '+y+')"><ellipse rx="'+r+'" ry="'+r*.34+'" fill="#fffef4"/><ellipse cx="'+(r*.24)+'" cy="-10" rx="'+(r*.63)+'" ry="'+(r*.55)+'" fill="#fffef4"/></g>';}return out;}
function surroundings(){
 let out='';
 for(let i=0;i<150;i++){
  const x=45+rgb(i+200)*2670,y=55+rgb(i+700)*2205;
  const nearLot=lots.some(l=>Math.abs(l.x-x)<225&&Math.abs(l.y-y)<205);
  const nearRoad=[690,1370,2050].some(p=>Math.abs(x-p)<105)||[560,1080,1620,2160].some(p=>Math.abs(y-p)<100);
  if(nearLot||nearRoad)continue;
  out+=i%3?tree(Math.round(x),Math.round(y),.4+rgb(i+444)*.38,i%10===0):flower(Math.round(x),Math.round(y),i);
 }
 for(let i=0;i<115;i++){
  const x=35+rgb(i+1350)*2650,y=25+rgb(i+1690)*2200;
  if(lots.some(l=>Math.abs(l.x-x)<255&&Math.abs(l.y-y)<210))continue;
  if([690,1370,2050].some(p=>Math.abs(x-p)<75)||[560,1080,1620,2160].some(p=>Math.abs(y-p)<75))continue;
  out+='<ellipse cx="'+x+'" cy="'+y+'" rx="12" ry="4" fill="#8abc9560"/>';
 }
 return out;
}
function road(){
 let out='';
 const horizontal=[560,1080,1620,2160],vertical=[690,1370,2050];
 for(const y of horizontal){out+='<path d="M0 '+y+'H'+W+'" stroke="#719f7870" stroke-width="136" stroke-linecap="round"/><path d="M0 '+y+'H'+W+'" stroke="#f6ecd5" stroke-width="124"/><path d="M0 '+y+'H'+W+'" stroke="#e6dac0" stroke-width="2" stroke-dasharray="11 23"/>';}
 for(const x of vertical){out+='<path d="M'+x+' 0V'+H+'" stroke="#719f7870" stroke-width="136"/><path d="M'+x+' 0V'+H+'" stroke="#f6ecd5" stroke-width="124"/><path d="M'+x+' 0V'+H+'" stroke="#e6dac0" stroke-width="2" stroke-dasharray="11 23"/>';}
 for(const x of vertical)for(const y of horizontal){
  out+='<circle cx="'+x+'" cy="'+y+'" r="65" fill="#f6ecd5"/><circle cx="'+x+'" cy="'+y+'" r="34" fill="none" stroke="#efe4ca" stroke-width="2" stroke-dasharray="7 9"/>';
 }
 return out;
}
function lotGround(l){
 const unlocked=owned(l),x=l.x,y=l.y;
 return '<rect class="parcel" x="'+(x-240)+'" y="'+(y-224)+'" width="480" height="417" rx="75" fill="'+(unlocked?'url(#parcel)':'url(#emptyParcel)')+'" stroke="'+(unlocked?'#d1e9c5':'#e6d4b5')+'" stroke-width="5"/>'+
 '<path d="M'+(x-184)+' '+(y+122)+'Q'+x+' '+(y+144)+' '+(x+192)+' '+(y+122)+'" fill="none" stroke="#d9bf9a" stroke-width="17" stroke-linecap="round" opacity=".6"/>';
}
function puff(x,y,color='#f2b4ad'){return '<g><circle cx="'+x+'" cy="'+y+'" r="11" fill="'+color+'"/><circle cx="'+(x+17)+'" cy="'+(y-3)+'" r="13" fill="'+color+'"/><circle cx="'+(x+34)+'" cy="'+(y+1)+'" r="10" fill="'+color+'"/></g>';}
function roofHouse({walls='#ffe8ca',roof='#d48e89',trim='#ffffff',sign='',wide=220,door='#937c71',tier=false}={}){
 const x=-wide/2,y=-78;
 return '<g filter="url(#buildingShadow)"><rect x="'+x+'" y="'+y+'" width="'+wide+'" height="158" rx="15" fill="'+walls+'" stroke="'+trim+'" stroke-width="7"/>'+
 '<path d="M'+(x-30)+' '+y+'L0 -187L'+(wide/2+30)+' '+y+'Z" fill="'+roof+'" stroke="'+trim+'" stroke-width="8" stroke-linejoin="round"/>'+
 '<path d="M'+(x-7)+' '+(y-11)+'L0 -167L'+(wide/2+7)+' '+(y-11)+'" fill="none" stroke="#ffffff50" stroke-width="8"/>'+
 '<rect x="-30" y="0" width="60" height="80" rx="12" fill="'+door+'" stroke="'+trim+'" stroke-width="5"/><circle cx="13" cy="42" r="4" fill="#fae8a7"/>'+
 [-1,1].map(side=>'<rect x="'+(side*70-26)+'" y="-36" width="52" height="49" rx="10" fill="#dcf4ed" stroke="'+trim+'" stroke-width="7"/><path d="M'+(side*70)+'-36V13" stroke="#fffdf6" stroke-width="5"/>').join('')+
 (tier?'<rect x="-29" y="-106" width="58" height="42" rx="9" fill="#fdf6d5" stroke="'+trim+'" stroke-width="5"/>':'')+
 '</g>'+puff(-142,83)+' '+puff(107,89,'#e3c3d9');
}
function buildingArt(l){
 const type=l.type;
 switch(type){
 case 'library':return roofHouse({walls:'#ffeaca',roof:'#b78cae',tier:true,door:'#81a7a1'})+
 '<g><rect x="-93" y="-77" width="186" height="34" rx="12" fill="#fffaf0" stroke="#e0c4a5" stroke-width="4"/><text x="0" y="-54" text-anchor="middle" font-size="19" fill="#80627b" font-weight="900">STORY LIBRARY</text>'+
 '<text x="-114" y="74" font-size="30">📖</text><text x="78" y="69" font-size="32">🌷</text></g>';
 case 'home':return roofHouse({walls:'#ffe4c6',roof:'#db9b97',door:'#98aa8d',tier:true})+'<path d="M61-162V-213H92V-133" fill="#d5a5a0" stroke="#fff9ed" stroke-width="5"/><text x="-125" y="91" font-size="32">🌼</text>';
 case 'farm':return '<g filter="url(#buildingShadow)"><rect x="-122" y="-93" width="244" height="173" rx="15" fill="#dc8882" stroke="#fff4e5" stroke-width="7"/><path d="M-148-91L0-196L148-91Z" fill="#b96970" stroke="#fff4e5" stroke-width="9"/><rect x="-50" y="-25" width="100" height="105" rx="10" fill="#fff0cd" stroke="#f6d1a5" stroke-width="5"/><path d="M-50-25L50 80M50-25L-50 80" stroke="#d28b7a" stroke-width="8"/><rect x="-79" y="-65" width="41" height="37" rx="6" fill="#d8ecde" stroke="#f9e9d5" stroke-width="5"/><rect x="38" y="-65" width="41" height="37" rx="6" fill="#d8ecde" stroke="#f9e9d5" stroke-width="5"/></g><text x="-165" y="90" font-size="44">🌻</text><text x="120" y="90" font-size="44">🥕</text>';
 case 'townhall':return roofHouse({walls:'#d0e5e5',roof:'#87acbb',door:'#8da3a1',wide:263,tier:true})+
 '<rect x="-34" y="-187" width="68" height="73" rx="11" fill="#e7e2cc" stroke="#fff4df" stroke-width="6"/><path d="M-44-186L0-233L44-186" fill="#8ba3b7" stroke="#fff5ea" stroke-width="5"/><circle cy="-148" r="19" fill="#fff6dc"/><path d="M0-148V-162M0-148h10" stroke="#a28b72" stroke-width="4"/>';
 case 'bakery':return roofHouse({walls:'#f8d4d4',roof:'#c88da2',wide:250,door:'#b68b7c'})+
 '<path d="M-130-40H130V-7H-130Z" fill="#fff5de"/><path d="M-123-40v32m42-32v32m42-32v32m42-32v32m42-32v32m42-32v32" stroke="#dd9d9e" stroke-width="18"/><rect x="-69" y="-100" width="138" height="35" rx="12" fill="#fff5e5"/><text x="0" y="-78" text-anchor="middle" font-size="20" font-weight="900" fill="#a76f81">BAKERY</text><text x="-136" y="90" font-size="39">🧁</text>';
 case 'market':return '<g filter="url(#buildingShadow)"><rect x="-139" y="-45" width="278" height="145" rx="20" fill="#fcdfb3" stroke="#fff9e9" stroke-width="6"/><path d="M-151-60H151L135-125H-135Z" fill="#e9af8f" stroke="#fff8e6" stroke-width="8"/><path d="M-121-125v66m60-66v66m60-66v66m60-66v66m60-66v66" stroke="#fff6df" stroke-width="24"/><rect x="-93" y="-17" width="185" height="55" rx="8" fill="#c5e2bc"/><rect x="-105" y="37" width="210" height="42" rx="10" fill="#b88e76"/></g><text x="-85" y="22" font-size="30">🍎</text><text x="-18" y="24" font-size="30">🥕</text><text x="56" y="23" font-size="31">🍓</text>';
 case 'garage':return '<g filter="url(#buildingShadow)"><rect x="-139" y="-101" width="278" height="190" rx="19" fill="#bbd2c3" stroke="#fff7e4" stroke-width="8"/><path d="M-160-102L0-187L160-102Z" fill="#8fab99" stroke="#fff9e8" stroke-width="8"/><rect x="-105" y="-36" width="210" height="124" rx="14" fill="#f5e8d3" stroke="#e2bb9c" stroke-width="6"/><path d="M-105-9H105M-105 24H105M-105 55H105" stroke="#d5c2ac" stroke-width="5"/></g><text x="-82" y="47" font-size="59">🚙</text><rect x="-79" y="-123" width="158" height="33" rx="10" fill="#fffaf1"/><text x="0" y="-100" font-size="21" fill="#577963" font-weight="900" text-anchor="middle">MY GARAGE</text>';
 case 'school':return roofHouse({walls:'#fbe2af',roof:'#8fbfc5',wide:258,door:'#92aab3',tier:true})+'<rect x="-78" y="-101" width="156" height="34" rx="10" fill="#fff8e4"/><text x="0" y="-77" font-size="19" font-weight="900" text-anchor="middle" fill="#67919a">LITTLE SCHOOL</text><text x="-146" y="86" font-size="40">🎒</text>';
 case 'playground':return '<g filter="url(#buildingShadow)"><path d="M-150 71L-86-117L-21 71" fill="none" stroke="#d79aad" stroke-width="17" stroke-linejoin="round"/><path d="M-86-108H40" stroke="#e9c080" stroke-width="16" stroke-linecap="round"/><path d="M-17-92v118m54-118v118" stroke="#819fb5" stroke-width="7"/><rect x="-32" y="24" width="86" height="18" rx="8" fill="#e8b26a"/><path d="M85-106V-14L138 82" fill="none" stroke="#77b9a6" stroke-width="18" stroke-linejoin="round"/><path d="M70-106H109" stroke="#a98cb1" stroke-width="15"/></g><text x="-126" y="96" font-size="45">🧸</text>';
 case 'orchard':return tree(-108,76,.88,true)+tree(68,59,1.03)+tree(159,93,.62,true)+
 '<g>'+[-1,1].map(sign=>'<circle cx="'+(sign*115)+'" cy="-29" r="14" fill="#ef9f88"/><circle cx="'+(sign*115+22)+'" cy="-54" r="12" fill="#edb48e"/>').join('')+'</g><text x="-34" y="92" font-size="52">🍎</text>';
 case 'village':return '<g transform="translate(-103 15) scale(.67)">'+roofHouse({walls:'#fce3b7',roof:'#d7a3a2',wide:210})+'</g><g transform="translate(104 17) scale(.68)">'+roofHouse({walls:'#d9e3ce',roof:'#99a6bd',wide:210})+'</g><g transform="translate(0 -62) scale(.61)">'+roofHouse({walls:'#fff1d1',roof:'#c6a0b3',wide:205})+'</g>';
 case 'fountain':return '<g filter="url(#buildingShadow)"><ellipse cy="68" rx="162" ry="47" fill="#d0d0c6" stroke="#fffaf0" stroke-width="10"/><ellipse cy="57" rx="146" ry="29" fill="#89cada"/><rect x="-27" y="-43" width="54" height="91" rx="16" fill="#ecdfc6"/><ellipse cy="-46" rx="58" ry="19" fill="#e2d7bf"/><ellipse cy="-50" rx="50" ry="11" fill="#9dd5e1"/></g><path d="M0-52Q-110-174-121-39M0-52Q110-174 121-39" stroke="#d7f5f7" stroke-width="11" fill="none" stroke-linecap="round"/><path d="M-10-79Q-46-144-75-51" stroke="#f8fcf0" stroke-width="8" fill="none"/><text x="-138" y="103" font-size="36">🌷</text>';
 case 'meadow':return '<g><path d="M-173 88Q0 44 175 88" stroke="#d2b783" stroke-width="14" fill="none"/>'+Array.from({length:13},(_,i)=>flower(-157+i*26,35-rgb(i+51)*80,i)).join('')+'<path d="M-110 81V-2m73 89V-23m74 110V-15m73 100V-4" stroke="#d1b385" stroke-width="10"/></g><text x="-38" y="7" font-size="72">🌻</text>';
 case 'pond':return '<g filter="url(#buildingShadow)"><ellipse cy="-5" rx="175" ry="118" fill="#dce9d4" stroke="#f9f5df" stroke-width="9"/><ellipse cy="-10" rx="158" ry="96" fill="#8bc7d5"/><path d="M-125-32Q0-83 121-36M-75 29Q22-4 110 31" stroke="#e7fbfa" stroke-width="9" fill="none" stroke-linecap="round"/></g><text x="-48" y="28" font-size="58">🦆</text><text x="73" y="64" font-size="43">🪷</text>';
 case 'festival':return '<g filter="url(#buildingShadow)"><path d="M-96 105L0-123L95 105" fill="none" stroke="#c7a2c8" stroke-width="14"/><circle cy="-84" r="88" fill="none" stroke="#fff8e6" stroke-width="13"/><circle cy="-84" r="88" fill="none" stroke="#a7bcb2" stroke-width="7"/>'+Array.from({length:8},(_,i)=>{let a=i*Math.PI/4,x=Math.round(Math.cos(a)*88),y=Math.round(Math.sin(a)*88-84);return '<circle cx="'+x+'" cy="'+y+'" r="17" fill="'+['#dca5a3','#f0d187','#9dcfc8','#cbb2d6'][i%4]+'" stroke="#fff9ef" stroke-width="5"/>';}).join('')+'<circle cy="-84" r="20" fill="#f4d2a0"/><path d="M-127 95H128" stroke="#b0c6ae" stroke-width="17"/></g><text x="-160" y="97" font-size="36">🎠</text>';
 case 'castle':return '<g filter="url(#buildingShadow)"><rect x="-118" y="-87" width="237" height="166" rx="13" fill="#d9cadf" stroke="#fff7e9" stroke-width="8"/>'+[-1,1].map(v=>'<rect x="'+(v*114-35)+'" y="-154" width="70" height="236" rx="11" fill="#c7bbd9" stroke="#fff8ed" stroke-width="6"/><path d="M'+(v*114-49)+'-153L'+(v*114)+'-219L'+(v*114+49)+'-153Z" fill="#ad92bb" stroke="#fff8e9" stroke-width="7"/>').join('')+'<rect x="-44" y="5" width="88" height="74" rx="42" fill="#aa99ba" stroke="#fff8e8" stroke-width="7"/><path d="M-47-88L0-158L47-88" fill="#c1a5cc" stroke="#fff7e8" stroke-width="7"/><rect x="-23" y="-86" width="46" height="32" rx="16" fill="#ffefbc"/></g><text x="-171" y="98" font-size="37">✨</text><text x="129" y="100" font-size="37">✨</text>';
 default:return roofHouse();
 }
}
function badge(l){
 const isOwned=owned(l);
 return '<g transform="translate('+l.x+' '+(l.y+155)+')" pointer-events="none"><rect x="-202" y="-22" width="404" height="56" rx="24" fill="'+(isOwned?'#fffdf4':'#f5ede0')+'" stroke="'+(isOwned?'#e8d9ba':'#d7c7ad')+'" stroke-width="4"/>'+
 '<text x="0" y="13" text-anchor="middle" font-size="26" font-weight="850" fill="'+(isOwned?'#4b6a56':'#987f67')+'">'+safe(l.title)+(isOwned?'':' · 🔒')+'</text></g>';
}
function lotMarkup(l){
 const yes=owned(l);
 return '<g class="lot-hotspot" data-lot="'+l.id+'" tabindex="0" role="button" aria-label="'+safe(labelForLot(l))+'" aria-disabled="'+(!yes)+'" transform="translate(0 0)">'+
 lotGround(l)+
 '<g transform="translate('+l.x+' '+l.y+')" opacity="'+(yes?'1':'.72')+'">'+buildingArt(l)+'</g>'+
 badge(l)+
 '<rect x="'+(l.x-238)+'" y="'+(l.y-224)+'" width="476" height="412" rx="75" fill="transparent" stroke="transparent" stroke-width="2"/>'+
 '</g>';
}
function laneY(row){return [560,1080,1620,2160][row];}
function carArt(id,scale=1){
 const c=paint[id]||paint['red-car'];const big=/truck|bus|pickup|van|excavator|tractor/.test(id);
 const len=/truck|bus/.test(id)?148:big?125:109;
 return '<g transform="scale('+scale+')"><ellipse cy="39" rx="'+(len*.62)+'" ry="13" fill="#395b4f4a"/>'+
 '<rect x="'+(-len/2)+'" y="-16" width="'+len+'" height="50" rx="15" fill="'+c+'" stroke="#fff7e8" stroke-width="5"/>'+
 (big?'<rect x="'+(-len*.35)+'" y="-51" width="'+(len*.53)+'" height="45" rx="10" fill="'+c+'" stroke="#fff9e8" stroke-width="5"/><rect x="'+(-len*.32)+'" y="-46" width="'+(len*.35)+'" height="25" rx="7" fill="#cde7ed"/>':'<path d="M-'+(len*.34)+'-16L-'+(len*.18)+'-51H'+(len*.17)+'L'+(len*.38)+'-16Z" fill="'+c+'" stroke="#fff6e9" stroke-width="5"/><path d="M-'+(len*.23)+'-17L-'+(len*.12)+'-42H'+(len*.12)+'L'+(len*.28)+'-17Z" fill="#d6eff1"/>')+
 (id==='big-truck'?'<text x="-21" y="14" fill="#fff6e0" font-size="23" font-weight="950">500</text>':'')+
 '<circle cx="'+(-len*.28)+'" cy="31" r="18" fill="#52676a"/><circle cx="'+(len*.28)+'" cy="31" r="18" fill="#52676a"/>'+
 '<circle cx="'+(-len*.28)+'" cy="31" r="9" fill="#e5e2cc"/><circle cx="'+(len*.28)+'" cy="31" r="9" fill="#e5e2cc"/>'+
 '<circle cx="'+(len*.45)+'" cy="0" r="7" fill="#fff4ce"/></g>';
}
function scene(){
 const booked=lots.map(lotMarkup).join('');
 const vehicles=model.vehicles.filter(id=>id!==model.selected).slice(0,11).map((id,i)=>{
  const x=2110+(i%3)*120,y=930+Math.floor(i/3)*48;
  return '<g transform="translate('+x+' '+y+')">'+carArt(id,.52)+'</g>';
 }).join('');
 return '<svg id="world" width="'+W+'" height="'+H+'" viewBox="0 0 '+W+' '+H+'" xmlns="http://www.w3.org/2000/svg" role="group" aria-label="Large storybook town. Scroll across spacious, separate buildings and tap one to visit.">'+
 '<defs><linearGradient id="grass" x2="0" y2="1"><stop stop-color="#d4e8bf"/><stop offset=".48" stop-color="#bde0b3"/><stop offset="1" stop-color="#d2e6bf"/></linearGradient><linearGradient id="parcel" x2=".2" y2="1"><stop stop-color="#f2f0d2"/><stop offset="1" stop-color="#d2e8bf"/></linearGradient><linearGradient id="emptyParcel" x2=".2" y2="1"><stop stop-color="#f2ead2"/><stop offset="1" stop-color="#e3dcbd"/></linearGradient><filter id="buildingShadow" x="-30%" y="-35%" width="160%" height="180%"><feDropShadow dx="0" dy="12" stdDeviation="10" flood-color="#597f5b" flood-opacity=".27"/></filter><filter id="groundBlur"><feGaussianBlur stdDeviation="34"/></filter></defs>'+
 '<rect width="'+W+'" height="'+H+'" fill="url(#grass)"/>'+
 '<path d="M-40 930Q385 790 720 895T1460 875T2840 850V1180Q2400 1080 1980 1195T1090 1140T-40 1280Z" fill="#a7d6b2" opacity=".5"/>'+
 '<path d="M2340 0Q2190 350 2580 580T2700 1200T2530 1940T2790 2340" fill="none" stroke="#c0dfcf" stroke-width="115" opacity=".36"/>'+
 clouds()+surroundings()+road()+booked+
 '<g opacity=".82"><text x="135" y="80" font-size="53" font-family="Georgia,serif" font-weight="700" fill="#668b77">The Wonderful Neighborhood</text><text x="140" y="120" font-size="23" fill="#76967c">A little world. A big adventure.</text></g>'+
 '<g id="parked-cars">'+vehicles+'</g>'+
 (model.vehicles.length?'<g id="travelling-car" transform="translate('+driving.x+' '+driving.y+')">'+carArt(model.selected||model.vehicles[0],.9)+'</g>':'')+
 '</svg>';
}
function miniMap(){
 return '<div class="mini-map" aria-hidden="true"><p class="mini-title">YOUR LITTLE WORLD</p><svg viewBox="0 0 160 136"><rect width="160" height="136" rx="11" fill="#cbdfb9"/>'+
 [40,80,120].map(y=>'<path d="M0 '+y+'H160" stroke="#f6e8c9" stroke-width="7"/>').join('')+
 [40,80,120].map(x=>'<path d="M'+x+' 0V136" stroke="#f6e8c9" stroke-width="7"/>').join('')+
 lots.map(l=>'<circle cx="'+(l.x/W*158)+'" cy="'+(l.y/H*135)+'" r="4.2" fill="'+(owned(l)?'#538b6b':'#c7a781')+'" stroke="#fff" stroke-width="1"/>').join('')+
 '</svg></div>';
}
function coins(n){return '⭐ '+n;}
function notify(s){const el=$('toast');if(!el)return;el.textContent=s;el.classList.add('active');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('active'),4800);}
function wallet(){const el=$('wallet');if(el&&model)el.textContent=coins(model.coins)+(testing?' TEST':'');}
function productCard(item){
 const bought=C.own(model,item.id),unlock=model.completed.length>=item.books,car=C.vehicles.some(v=>v.id===item.id);
 return '<article class="product">'+(bought?'<span class="owned">✓ COLLECTED</span>':'')+
 '<div class="product-art">'+(car?'<svg viewBox="-115 -105 230 175" aria-hidden="true">'+carArt(item.id,1.25)+'</svg>':'<span class="item-emoji">'+(icons[item.id]||'🏡')+'</span>')+'</div>'+
 '<div class="product-body"><h3>'+safe(item.name)+'</h3><p>'+safe(item.description)+'</p><span class="price">'+coins(item.price)+'</span><span class="unlock">'+(unlock?'Unlocked for purchase':item.books+' books to unlock')+'</span>'+
 '<button data-buy="'+item.id+'" '+(bought?'disabled':'')+'>'+(bought?'Already yours':unlock&&model.coins>=item.price?'Buy for '+item.price+' coins':'View saving goal')+'</button></div></article>';
}
function worldView(){
 return '<section class="board"><div class="world-titlebar"><div><div class="tag">LIVING STORYBOOK TOWN · EXPLORE</div><h2>Every building has its own place.</h2><p class="subtitle">Swipe the map to travel through the neighborhood. Tap a building to meet it.</p></div>'+
 '<div class="world-tools"><button data-go="home">⌂ Center home</button><button class="zoom-btn" data-zoom="out" aria-label="Zoom out">−</button><button class="zoom-btn" data-zoom="in" aria-label="Zoom in">+</button></div></div>'+
 '<div class="map-shell"><div class="world-viewport" id="worldViewport" tabindex="0" aria-label="Scrollable illustrated city map">'+scene()+'</div>'+miniMap()+'</div>'+
 '<div class="map-actions"><strong>Jump to:</strong>'+['library','farm','garage','market-square','playground','castle-hill'].map(id=>{const l=lots.find(x=>x.id===id);return '<button data-go="'+id+'">'+l.icon+' '+l.title.replace(/^(The |My |Pip’s )/,'')+'</button>';}).join('')+'</div>'+
 '<div id="lotDetails">'+lotDrawer(chosen)+'</div>'+
 '<div class="stats"><div class="stat"><b>'+model.vehicles.length+'</b>Vehicles in your garage</div><div class="stat"><b>'+model.lands.length+'</b>Places unlocked</div><div class="stat"><b>'+model.completed.length+'</b>'+(testing?'Books available for test':'Books completed')+'</div><div class="stat"><b>'+model.coins+'</b>'+(testing?'Test coins':'Sunshine Coins')+'</div></div></section>';
}
function lotDrawer(id){
 const l=lots.find(x=>x.id===id)||lots[1],have=owned(l);
 const item=l.land?C.lands.find(x=>x.id===l.land):null;
 let actions='';
 if(have){
  actions=(l.link?'<a class="primary" href="'+l.link+'">Visit '+l.title.split(' ').at(-1)+' ↗</a>':'')+
   (l.tab?'<button data-open-tab="'+l.tab+'">Open Garage →</button>':'')+
   (model.vehicles.length?'<button data-drive="'+l.id+'">🚗 Drive here</button>':'<button class="ghost" data-open-tab="cars">Get your first car</button>');
 }else{
  actions='<button data-buy="'+item.id+'">Unlock for '+coins(item.price)+'</button><button class="ghost" data-open-tab="land">See buildings</button>';
 }
 return '<div class="drawer"><div class="drawer-icon" aria-hidden="true">'+l.icon+'</div><div class="drawer-copy"><h3>'+safe(l.title)+'</h3><p>'+safe(l.description)+(have?'': ' This place will come alive after you collect it.')+'</p>'+
 (item&&!have?'<div class="tag">'+item.books+' completed books required'+(testing?' · unlocked in test mode':'')+'</div>':'')+'</div><div class="drawer-actions">'+actions+'</div></div>';
}
function catalogView(kind){
 const car=kind==='cars',things=car?C.vehicles:C.lands;
 return '<section class="board"><div class="store-heading"><div><div class="tag">'+(car?'THE LITTLE MOTOR SHOP':'A TOWN MADE BY YOU')+'</div><h2>'+(car?'Choose your dream ride':'A home for every discovery')+'</h2><p class="subtitle">'+(car?'Collect a whole family of colorful vehicles, then drive around the neighborhood.':'Each building gets its own beautiful lot in your growing town.')+'</p></div><small>'+coins(model.coins)+' · '+things.filter(i=>C.own(model,i.id)).length+' of '+things.length+' collected</small></div><div class="catalog">'+things.map(productCard).join('')+'</div></section>';
}
function garageView(){
 const list=model.vehicles;
 return '<section class="board"><div class="store-heading"><div><div class="tag">YOUR COLLECTION</div><h2>My happy garage</h2><p class="subtitle">Choose a ride for the city streets. No fuel charges, repairs, or racing timers.</p></div><small>'+list.length+' owned vehicles</small></div>'+
 (list.length?'<div class="garage-grid">'+list.map(id=>{const item=C.vehicles.find(x=>x.id===id);return '<article class="garage-card"><svg viewBox="-115 -110 230 185" aria-label="'+safe(item.name)+'">'+carArt(id)+'</svg><div><h3>'+safe(item.name)+'</h3><p>'+((model.selected||list[0])===id?'Your current ride':'Ready for an adventure')+'</p><button data-select="'+id+'">'+((model.selected||list[0])===id?'Drive around town':'Choose this car')+'</button></div></article>';}).join('')+'</div>':'<div class="notice">The garage is waiting for its first vehicle! Finish two new stories to buy the Little Red Car for 20 coins.</div>')+'</section>';
}
function freshDemo(){const s=C.initial({completed:C.bookIds});s.coins=5000;s.completed=C.bookIds.slice();return C.validate(s);}
function legacy(){try{return JSON.parse(localStorage.getItem('kgj-storybook-v1')||'null')||{};}catch(_){return {};}}
function resetNotice(){
 return testing?'<div class="notice test" id="testNotice"><strong>🧪 TEST CITY — Your 5,000 starting coins are separate</strong><div>Try buying every car, castle and building. Your child’s actual wallet and purchases will not change. <button id="resetTest">↺ Reset test wallet to 5,000 coins</button> <a href="./city.html?v=3">Leave test mode</a></div></div>':'';
}
function render(preserve=true){
 if(!model)return;
 const viewport=$('worldViewport');if(preserve&&viewport)mapOffset={left:viewport.scrollLeft,top:viewport.scrollTop};
 wallet();
 $('testSlot').innerHTML=resetNotice();
 document.querySelectorAll('[data-tab]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.tab===tab)));
 $('content').innerHTML=tab==='world'?worldView():tab==='cars'||tab==='land'?catalogView(tab):garageView();
 if(tab==='world'){
  const v=$('worldViewport'),s=$('world');if(s){s.style.width=W*zoom+'px';s.style.height=H*zoom+'px';}
  setupDesktopPan(v);
  requestAnimationFrame(()=>{
   if(!v)return;
   if(mapOffset){v.scrollLeft=mapOffset.left;v.scrollTop=mapOffset.top;}
   else focusPoint(1025,440,true);
   if(justStarted){justStarted=false;mapOffset=null;}
  });
 }
 const btn=$('resetTest');if(btn)btn.onclick=resetDemo;
}
let ignorePanClick=false;
function setupDesktopPan(v){
 if(!v)return;
 let drag=null;
 v.addEventListener('pointerdown',e=>{
  if(e.pointerType!=='mouse'||e.button!==0)return;
  drag={x:e.clientX,y:e.clientY,left:v.scrollLeft,top:v.scrollTop,moved:false};
 });
 v.addEventListener('pointermove',e=>{
  if(!drag)return;
  const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
  if(Math.abs(dx)+Math.abs(dy)>8)drag.moved=true;
  if(!drag.moved)return;
  v.classList.add('grabbing');
  v.scrollLeft=drag.left-dx;v.scrollTop=drag.top-dy;
  e.preventDefault();
 });
 const end=()=>{
  if(!drag)return;
  const moved=drag.moved;drag=null;v.classList.remove('grabbing');
  if(moved){ignorePanClick=true;setTimeout(()=>{ignorePanClick=false},0);}
 };
 v.addEventListener('pointerup',end);v.addEventListener('pointercancel',end);
 v.addEventListener('pointerleave',end);
}
function focusPoint(x,y,instant=false){
 const v=$('worldViewport');if(!v)return;
 const left=x*zoom-v.clientWidth/2,top=y*zoom-v.clientHeight/2;
 v.scrollTo({left:Math.max(0,left),top:Math.max(0,top),behavior:instant||reduceMotion()?'instant':'smooth'});
}
function choose(id){const l=lots.find(x=>x.id===id);if(!l)return;chosen=id;const drawer=$('lotDetails');if(drawer)drawer.innerHTML=lotDrawer(chosen);const a=document.querySelectorAll('[data-lot]');a.forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.lot===id)));}
function changeTab(id){if(!['world','cars','land','garage'].includes(id))return;cancelAnimationFrame(animation);tab=id;mapOffset=null;render(false);}
function getRoadPoint(id){const l=lots.find(x=>x.id===id)||lots[1];return {x:l.x,y:laneY(l.row)};}
function travel(id){
 if(!model.vehicles.length){notify('Collect your first car in the Vehicle Shop!');changeTab('cars');return;}
 const l=lots.find(x=>x.id===id);if(!l)return;
 if(!owned(l)){notify('This neighborhood needs unlocking first.');choose(id);return;}
 const start={...driving},end=getRoadPoint(id),vehicle=$('travelling-car'),svg=$('world'),viewport=$('worldViewport');
 if(!vehicle||!svg||!viewport)return;
 cancelAnimationFrame(animation);
 const near=[690,1370,2050].reduce((a,b)=>Math.abs(b-(start.x+end.x)/2)<Math.abs(a-(start.x+end.x)/2)?b:a);
 const d=start.y===end.y?'M'+start.x+' '+start.y+'H'+end.x:'M'+start.x+' '+start.y+'H'+near+'V'+end.y+'H'+end.x;
 const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',d);const length=path.getTotalLength();
 const dur=reduceMotion()?10:Math.min(4800,1600+length*1.4),began=performance.now();
 function frame(t){
  const fraction=Math.min(1,(t-began)/dur),eased=fraction<.5?2*fraction*fraction:1-Math.pow(-2*fraction+2,2)/2;
  const p=path.getPointAtLength(length*eased),next=path.getPointAtLength(Math.min(length,length*eased+2));
  const angle=Math.atan2(next.y-p.y,next.x-p.x)*180/Math.PI;
  vehicle.setAttribute('transform','translate('+p.x+' '+p.y+') rotate('+angle+')');
  if(!reduceMotion()&&Math.round(fraction*100)%3===0){viewport.scrollLeft=p.x*zoom-viewport.clientWidth/2;viewport.scrollTop=p.y*zoom-viewport.clientHeight/2;}
  if(fraction<1)animation=requestAnimationFrame(frame);
  else{driving=end;focusPoint(l.x,l.y,true);choose(id);notify('🌟 Hooray! You arrived at '+l.title+'!');}
 }
 notify('🚗 Off we go to '+l.title+'!');
 animation=requestAnimationFrame(frame);
}
function confirmBuy(id){
 const item=C.catalog.find(x=>x.id===id);if(!item)return;
 if(C.own(model,id)){notify('You already own '+item.name+'!');return;}
 pending=item;
 const canRead=model.completed.length>=item.books,canBuy=model.coins>=item.price;
 $('dialogTitle').textContent=item.name;
 $('dialogCopy').textContent=(canRead?'':'Read '+(item.books-model.completed.length)+' more different books to unlock. ')+(canBuy?'':'Save '+(item.price-model.coins)+' more coins. ')+item.description+' Price: '+coins(item.price)+'.';
 $('confirmPurchase').hidden=!(canRead&&canBuy);
 $('purchaseDialog').showModal();
}
async function doPurchase(){
 if(!pending)return;
 const item=pending;const b=$('confirmPurchase');b.disabled=true;
 try{const r=await store.act({type:'buy',id:item.id});$('purchaseDialog').close();if(r.ok){
   const lot=lots.find(l=>l.land===item.id);
   if(lot)chosen=lot.id;
   tab='world';mapOffset=null;render(false);
   if(lot)requestAnimationFrame(()=>focusPoint(lot.x,lot.y,true));
   notify('🎉 '+item.name+' has joined your wonderful town! Explore it on the map.');
  }
 else notify(r.message||'Not available yet.');}
 catch(e){notify('Unable to save purchase. Your previous progress is untouched.');}
 finally{pending=null;b.disabled=false;}
}
async function chooseCar(id){
 const r=await store.act({type:'select',id});
 if(r.ok){tab='world';mapOffset=null;render(false);notify('🚗 Your '+C.vehicles.find(x=>x.id===id).name+' is ready. Choose a place to drive!');}
 else notify(r.message||'Choose an owned vehicle.');
}
async function resetDemo(){
 if(!testing)return;
 if(!window.confirm('Reset only this TEST CITY to 5,000 coins? Real saved coins remain unchanged.'))return;
 try{await store.restore(freshDemo());driving=getRoadPoint('home');tab='world';mapOffset=null;render(false);notify('🧪 Test wallet reset to 5,000 coins.');}
 catch(e){notify('Test save could not reset; real kingdom is untouched.');}
}
function handleClick(e){
 if(ignorePanClick){e.preventDefault();return;}
 const b=e.target.closest('button');
 if(b){
  if(b.dataset.tab)return changeTab(b.dataset.tab);
  if(b.dataset.openTab)return changeTab(b.dataset.openTab);
  if(b.dataset.buy)return confirmBuy(b.dataset.buy);
  if(b.dataset.select)return chooseCar(b.dataset.select);
  if(b.dataset.drive)return travel(b.dataset.drive);
  if(b.dataset.go){const l=lots.find(x=>x.id===b.dataset.go);if(l){if(tab!=='world')changeTab('world');focusPoint(l.x,l.y);choose(l.id);}return;}
  if(b.dataset.zoom){
   const v=$('worldViewport');if(!v)return;
   const sx=(v.scrollLeft+v.clientWidth/2)/zoom,sy=(v.scrollTop+v.clientHeight/2)/zoom;
   zoom=Math.max(.8,Math.min(1.5,zoom+(b.dataset.zoom==='in'?.2:-.2)));
   const svg=$('world');svg.style.width=W*zoom+'px';svg.style.height=H*zoom+'px';focusPoint(sx,sy,true);return;
  }
 }
 const lot=e.target.closest('[data-lot]');if(lot){choose(lot.dataset.lot);}
}
document.addEventListener('click',handleClick);
document.addEventListener('keydown',e=>{const lot=e.target.closest('[data-lot]');if(lot&&(e.key==='Enter'||e.key===' ')){e.preventDefault();choose(lot.dataset.lot);}});
$('confirmPurchase').onclick=doPurchase;$('cancelPurchase').onclick=()=>$('purchaseDialog').close();
$('centerHome').onclick=()=>{tab='world';mapOffset=null;render(false);focusPoint(1025,280);};
let storage;try{storage=localStorage;}catch(_){}
const sandbox=testing&&storage?{
 getItem:k=>storage.getItem(k===C.KEY?TEST_KEY:'kgj-test-v2:'+k),
 setItem:(k,v)=>storage.setItem(k===C.KEY?TEST_KEY:'kgj-test-v2:'+k,v),
 removeItem:k=>storage.removeItem(k===C.KEY?TEST_KEY:'kgj-test-v2:'+k)
}:null;
const scoped=testing?sandbox:storage;
let hadSave=false;
try{hadSave=testing&&sandbox&&sandbox.getItem(C.KEY)!==null;}catch(_){}
const locks=testing&&navigator.locks?{request:(_key,fn)=>navigator.locks.request(TEST_KEY,fn)}:navigator.locks;
store=C.createStore({storage:scoped,locks});
store.init(testing?{completed:C.bookIds}:legacy()).then(async state=>{
 if(testing&&!hadSave)state=await store.restore(freshDemo());
 model=state;store.subscribe(n=>{model=n;render()});render(false);
}).catch(e=>{
 $('content').innerHTML='<section class="notice" role="alert">Your saved city needs recovery. No saved data has been deleted. Please open Grown-up corner in the main reading app to export or restore your save.</section>';
 notify('City save needs recovery. Your real coins were not reset.');
 console.warn('City 3.0 init:',e);
});
window.addEventListener('storage',e=>{if(e.key===(testing?TEST_KEY:C.KEY)){try{store.refresh();}catch(_){}}});
window.addEventListener('pagehide',()=>cancelAnimationFrame(animation));
window.KGJCity3={version:'3.0',getLots:()=>clone(lots),getState:()=>model?{coins:model.coins,vehicles:[...model.vehicles],lands:[...model.lands],testing,tab,zoom}:null};
})();