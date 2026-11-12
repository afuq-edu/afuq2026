/* =====================================================================
   DECK · العوالم المرسومة (deck-world.js) — يُحمَّل بعد deck.js
   الفكرة (من نموذج شرائح عيسى «رحلتنا التعليمية/المطار»): كل عرض «عالَم» واحد مرسوم يناسب فلسفة المادة،
   وكل شريحة مشهد من ذلك العالم، والعناصر أشياء من العالم (لافتة، حقيبة، بطاقات تُسحب وتُفلت).
   هنا عالم الفنون البصرية «مرسم الفنان». لمادة أخرى: أضيفي عالمًا إلى DECK.WORLDS بالمفاتيح نفسها
   (مثل: العربية = رحلة المطار، العلوم = المختبر، الرياضيات = ورشة البنّاء، الهوية = الحارة العُمانية).

   world = {cls, scenes:{room, gallery}, welcome, gate, titleKicker, priorTitle, priorHint, boxLabel, endTitle}
   ويضيف الملف: شريحة «drag» (سحب وإفلات إلى سلال) ولعبة DECK.GAMES.drag.
   ===================================================================== */
(function(){
'use strict';
var D=window.DECK;if(!D)return;
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function $(s,r){return (r||document).querySelector(s);}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));}
function snd(k){try{if(window.DA&&DA.snd)DA.snd(k);}catch(e){}}
var PAL=['#E4572E','#F2B705','#2E86AB','#7A4FB0','#2E9E6B','#E95F8C'];

/* ---------- مشهد المرسم: جدار دافئ، نافذة مقوّسة تطل على قلعة ونخيل، أرضية خشب، رفوف ألوان ---------- */
function jar(x,y,c,h){h=h||70;return '<g><rect x="'+x+'" y="'+(y-h)+'" width="46" height="'+h+'" rx="8" fill="#fff" opacity=".55"/><rect x="'+(x+3)+'" y="'+(y-h*.62)+'" width="40" height="'+(h*.62-3)+'" rx="6" fill="'+c+'"/><rect x="'+(x-2)+'" y="'+(y-h-8)+'" width="50" height="12" rx="4" fill="#C9B79A"/><rect x="'+(x+7)+'" y="'+(y-h+6)+'" width="6" height="'+(h*.5)+'" rx="3" fill="#fff" opacity=".5"/></g>';}
function frame(x,y,w,h,inner){return '<g><line x1="'+(x+w/2)+'" y1="'+(y-30)+'" x2="'+(x+w/2)+'" y2="'+y+'" stroke="#8A6B4A" stroke-width="3"/><rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="6" fill="#8A5A2B"/><rect x="'+(x+8)+'" y="'+(y+8)+'" width="'+(w-16)+'" height="'+(h-16)+'" fill="#FFFDF6"/><g transform="translate('+(x+8)+' '+(y+8)+')">'+inner+'</g></g>';}
function room(){var s='<svg class="dw-scene" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>'+
  '<linearGradient id="dwWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF1DC"/><stop offset="1" stop-color="#F7DDBB"/></linearGradient>'+
  '<linearGradient id="dwSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7CC4F2"/><stop offset=".7" stop-color="#CBEBFB"/><stop offset="1" stop-color="#FFE9C4"/></linearGradient>'+
  '<linearGradient id="dwFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D9A066"/><stop offset="1" stop-color="#B9773F"/></linearGradient>'+
  '<pattern id="dwDots" width="60" height="60" patternUnits="userSpaceOnUse"><circle cx="30" cy="30" r="3" fill="#F2C99A" opacity=".5"/></pattern>'+
  '<clipPath id="dwWin"><path d="M560 600 V250 a240 240 0 0 1 480 0 V600 Z"/></clipPath></defs>'+
  '<rect width="1600" height="640" fill="url(#dwWall)"/><rect width="1600" height="640" fill="url(#dwDots)"/>'+
  /* النافذة */
  '<g clip-path="url(#dwWin)"><rect x="560" y="0" width="480" height="620" fill="url(#dwSky)"/><circle cx="940" cy="150" r="46" fill="#FFE38A"/><g class="dw-cloud"><ellipse cx="660" cy="170" rx="60" ry="22" fill="#fff"/><ellipse cx="700" cy="152" rx="44" ry="24" fill="#fff"/></g><g class="dw-cloud c2"><ellipse cx="880" cy="270" rx="54" ry="18" fill="#fff" opacity=".9"/><ellipse cx="910" cy="256" rx="36" ry="20" fill="#fff" opacity=".9"/></g>'+
   '<path d="M560 520 q120 -90 240 -30 t240 -20 V620 H560Z" fill="#C9B38A"/><path d="M560 560 q160 -50 480 -10 V620 H560Z" fill="#E3CFA4"/>'+
   '<g fill="#D8B37A"><rect x="690" y="430" width="150" height="110"/><rect x="680" y="414" width="20" height="24"/><rect x="716" y="414" width="20" height="24"/><rect x="752" y="414" width="20" height="24"/><rect x="788" y="414" width="20" height="24"/><rect x="824" y="414" width="20" height="24"/><rect x="820" y="380" width="60" height="160"/><rect x="814" y="366" width="16" height="20"/><rect x="842" y="366" width="16" height="20"/><rect x="870" y="366" width="16" height="20"/></g><rect x="748" y="480" width="34" height="60" rx="17" fill="#8A6B4A"/>'+
   '<g stroke="#7A5A34" stroke-width="7" fill="none" stroke-linecap="round"><path d="M960 560 q-8 -70 6 -130"/></g><g fill="#3E9B62"><path d="M966 430 q-60 -30 -84 10 q44 -20 84 -10z"/><path d="M966 430 q60 -30 84 10 q-44 -20 -84 -10z"/><path d="M966 430 q-30 -60 -76 -40 q50 4 76 40z"/><path d="M966 430 q30 -60 76 -40 q-50 4 -76 40z"/></g></g>'+
  '<path d="M560 600 V250 a240 240 0 0 1 480 0 V600" fill="none" stroke="#FFF8EC" stroke-width="22"/><path d="M560 600 V250 a240 240 0 0 1 480 0 V600" fill="none" stroke="#C99A62" stroke-width="6"/><line x1="800" y1="12" x2="800" y2="600" stroke="#FFF8EC" stroke-width="10"/><line x1="560" y1="330" x2="1040" y2="330" stroke="#FFF8EC" stroke-width="10"/>'+
  '<rect x="530" y="596" width="540" height="22" rx="6" fill="#C99A62"/>'+
  /* إطارات معلّقة */
  frame(120,150,170,130,'<rect width="154" height="114" fill="#FFF3D9"/><path d="M10 90 Q50 20 80 60 T144 30" fill="none" stroke="#E4572E" stroke-width="7" stroke-linecap="round"/><circle cx="120" cy="88" r="12" fill="#F2B705"/>')+
  frame(330,210,130,150,'<rect width="114" height="134" fill="#F7F3E8"/><rect x="0" y="0" width="52" height="60" fill="#E4572E"/><rect x="60" y="0" width="54" height="30" fill="#F2B705"/><rect x="60" y="38" width="54" height="96" fill="#2E86AB"/><g stroke="#151515" stroke-width="6"><path d="M56 0V134M0 64H56M56 34H114"/></g>')+
  frame(1150,170,150,130,'<rect width="134" height="114" fill="#EAF5F4"/><circle cx="46" cy="50" r="30" fill="#E53935" opacity=".85"/><circle cx="84" cy="50" r="30" fill="#FDD835" opacity=".85"/><circle cx="66" cy="78" r="30" fill="#1E63C6" opacity=".8"/>')+
  frame(1340,130,150,170,'<rect width="134" height="154" fill="#FFE9C4"/><circle cx="96" cy="36" r="18" fill="#FFF3C4"/><path d="M0 120 L40 70 L70 100 L100 60 L134 110 V154 H0Z" fill="#7A4FB0"/><path d="M0 134 Q60 110 134 134 V154 H0Z" fill="#3B2A6B"/>')+
  /* زينة أعلام */
  '<path d="M0 60 Q400 130 800 70 T1600 60" fill="none" stroke="#B88A5A" stroke-width="3"/><g class="dw-bunt">';
  for(var i=0;i<16;i++){var x=40+i*100,y=62+Math.sin((x/1600)*Math.PI*2)*-26+((x>200&&x<1400)?24:8);s+='<path d="M'+x+' '+y+' l36 4 l-20 46z" fill="'+PAL[i%PAL.length]+'"/>';}
  s+='</g>'+
  /* الأرضية */
  '<rect y="630" width="1600" height="270" fill="url(#dwFloor)"/><rect y="622" width="1600" height="16" fill="#A8672F"/>';
  for(i=-8;i<=8;i++){s+='<line x1="'+(800+i*70)+'" y1="638" x2="'+(800+i*230)+'" y2="900" stroke="#9A5E2C" stroke-width="2" opacity=".45"/>';}
  s+='<line x1="0" y1="720" x2="1600" y2="720" stroke="#9A5E2C" stroke-width="2" opacity=".3"/><line x1="0" y1="810" x2="1600" y2="810" stroke="#9A5E2C" stroke-width="2" opacity=".3"/>'+
  /* سجادة */
  '<path d="M560 900 L690 650 H910 L1040 900Z" fill="#D7263D"/><path d="M590 900 L706 664 H894 L1010 900Z" fill="none" stroke="#FFD27A" stroke-width="5" stroke-dasharray="14 10"/>'+
  /* رف الألوان يسارًا */
  '<g><rect x="40" y="380" width="250" height="16" rx="5" fill="#A8672F"/><rect x="40" y="520" width="250" height="16" rx="5" fill="#A8672F"/><rect x="48" y="396" width="10" height="250" fill="#8A5A2B"/><rect x="272" y="396" width="10" height="250" fill="#8A5A2B"/>'+jar(64,380,'#E53935')+jar(120,380,'#FDD835',84)+jar(176,380,'#1E63C6')+jar(232,380,'#2E9E4F',60)+jar(70,520,'#F57C00',64)+jar(128,520,'#7B3FA0',80)+
   '<g transform="translate(196 440)"><rect x="0" y="20" width="60" height="60" rx="8" fill="#5AA6CF"/><g stroke-linecap="round" stroke-width="7"><line x1="14" y1="24" x2="6" y2="-40" stroke="#C99A62"/><line x1="30" y1="24" x2="30" y2="-52" stroke="#8A5A2B"/><line x1="46" y1="24" x2="58" y2="-36" stroke="#C99A62"/></g><path d="M0 -52 l12 0 l-4 18 l-4 0z M24 -66 h12 l-3 18 h-6z M54 -50 l12 2 l-6 16 l-4 -1z" fill="#E4572E"/></g></g>'+
  /* نبتة */
  '<g transform="translate(330 560)"><path d="M0 40 h90 l-10 80 h-70z" fill="#E07A4F"/><rect x="-6" y="30" width="102" height="16" rx="6" fill="#C9603A"/><g fill="#3E9B62" class="dw-leaf"><path d="M45 34 q-70 -60 -60 -140 q60 50 60 140z"/><path d="M45 34 q70 -60 60 -140 q-60 50 -60 140z"/><path d="M45 34 q-10 -110 20 -170 q30 80 -20 170z" fill="#57B77E"/></g></g>'+
  /* مقعد ولوحة ألوان يمينًا */
  '<g transform="translate(1180 520)"><ellipse cx="90" cy="0" rx="92" ry="20" fill="#C99A62"/><rect x="20" y="0" width="12" height="150" fill="#8A5A2B" transform="rotate(8 26 0)"/><rect x="148" y="0" width="12" height="150" fill="#8A5A2B" transform="rotate(-8 154 0)"/><rect x="30" y="80" width="120" height="8" fill="#8A5A2B"/>'+
   '<g transform="translate(18 -62) rotate(-8)"><path d="M70 0c44 0 76 26 76 58 0 20-14 28-30 26-12-2-20 6-16 16 4 12-8 26-30 26-40 0-70-28-70-64S30 0 70 0z" fill="#FFF8EC" stroke="#8A5A2B" stroke-width="5"/><circle cx="40" cy="44" r="13" fill="#E4572E"/><circle cx="72" cy="26" r="12" fill="#F2B705"/><circle cx="106" cy="38" r="12" fill="#2E86AB"/><circle cx="34" cy="80" r="12" fill="#2E9E6B"/></g></g>'+
  '<g transform="translate(1400 470)"><rect x="0" y="0" width="150" height="180" rx="10" fill="#B9773F"/><rect x="10" y="12" width="130" height="70" rx="6" fill="#D9A066"/><rect x="10" y="96" width="130" height="70" rx="6" fill="#D9A066"/><circle cx="75" cy="47" r="7" fill="#8A5A2B"/><circle cx="75" cy="131" r="7" fill="#8A5A2B"/><g transform="translate(20 -90)"><rect x="0" y="30" width="40" height="60" rx="4" fill="#fff"/><rect x="50" y="10" width="26" height="80" rx="4" fill="#F2B705"/><rect x="84" y="24" width="26" height="66" rx="4" fill="#E95F8C"/></g></g>'+
  '</svg>';return s;}
function gallery(){var s='<svg class="dw-scene" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="dgW" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBF3E4"/><stop offset="1" stop-color="#F1E1C6"/></linearGradient><linearGradient id="dgF" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D9A066"/><stop offset="1" stop-color="#B9773F"/></linearGradient><linearGradient id="dgL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF6C9" stop-opacity=".75"/><stop offset="1" stop-color="#FFF6C9" stop-opacity="0"/></linearGradient></defs>'+
  '<rect width="1600" height="700" fill="url(#dgW)"/><rect y="56" width="1600" height="12" fill="#C99A62"/><rect y="690" width="1600" height="210" fill="url(#dgF)"/><rect y="682" width="1600" height="16" fill="#A8672F"/>';
  [220,620,1020,1420].forEach(function(x){s+='<g><rect x="'+(x-24)+'" y="20" width="48" height="26" rx="8" fill="#3B2A6B"/><path d="M'+(x-20)+' 46 L'+(x-170)+' 640 H'+(x+170)+' L'+(x+20)+' 46Z" fill="url(#dgL)" class="dw-spot"/></g>';});
  for(var i=-8;i<=8;i++)s+='<line x1="'+(800+i*70)+'" y1="698" x2="'+(800+i*230)+'" y2="900" stroke="#9A5E2C" stroke-width="2" opacity=".4"/>';
  s+='<g transform="translate(60 720)"><rect width="260" height="34" rx="10" fill="#3B2A6B"/><rect x="20" y="34" width="14" height="70" fill="#2A1E4E"/><rect x="226" y="34" width="14" height="70" fill="#2A1E4E"/></g><g transform="translate(1280 720)"><rect width="260" height="34" rx="10" fill="#3B2A6B"/><rect x="20" y="34" width="14" height="70" fill="#2A1E4E"/><rect x="226" y="34" width="14" height="70" fill="#2A1E4E"/></g>'+
  '<g stroke="#E4572E" stroke-width="10" fill="none" stroke-linecap="round" opacity=".9"><path d="M500 800 H1100"/></g><circle cx="500" cy="770" r="14" fill="#F2B705"/><rect x="494" y="780" width="12" height="60" fill="#C98A04"/><circle cx="1100" cy="770" r="14" fill="#F2B705"/><rect x="1094" y="780" width="12" height="60" fill="#C98A04"/></svg>';return s;}

var W=D.WORLDS=D.WORLDS||{};
W.studio={cls:'w-studio',scenes:{room:room,gallery:gallery},welcome:'مرحبًا بكم في مرسمنا',gate:'بوابة الإبداع',gateEn:'Art Studio',titleKicker:'لوحة حصتنا اليوم:',
  priorTitle:'التعلم القبلي: تجهيز علبة الفنان',priorHint:'اسحبوا البطاقة وضعوها في البرطمان المناسب',boxLabel:'علبة الفنان',goalsTitle:'معرض أهدافنا: سأتعلم اليوم',endTitle:'أحسنتم يا فنانينا الصغار',
  icL:'<svg viewBox="0 0 64 64"><g transform="rotate(35 32 32)"><rect x="27" y="22" width="10" height="38" rx="5" fill="#3B2A6B"/><rect x="25" y="16" width="14" height="10" rx="2" fill="#F2B705"/><path d="M25 16c0-8 3-12 7-16 4 4 7 8 7 16z" fill="#E4572E"/></g></svg>',
  icR:'<svg viewBox="0 0 64 64"><path d="M32 6c16 0 28 10 28 23 0 8-5 11-11 10-5-1-8 2-6 6 2 6-3 12-12 12C16 57 5 46 5 32S16 6 32 6z" fill="#FFF8EC" stroke="#3B2A6B" stroke-width="3"/><circle cx="20" cy="24" r="5" fill="#E4572E"/><circle cx="33" cy="17" r="5" fill="#F2B705"/><circle cx="46" cy="22" r="5" fill="#2E86AB"/><circle cx="17" cy="38" r="5" fill="#2E9E6B"/></svg>'};

/* ---------- عناصر المشهد بالـHTML ---------- */
function sign(w,txt){return '<div class="dw-sign"><i class="rope a"></i><i class="rope b"></i><span class="ic">'+w.icR+'</span><b>'+esc(txt)+'</b><span class="ic">'+w.icL+'</span></div>';}
function sceneWrap(scene,inner,cls){return '<div class="dw'+(cls?' '+cls:'')+'">'+scene+'<div class="dw-in">'+inner+'</div></div>';}
D.sceneWrap=sceneWrap;D.sign=sign;

/* ---------- سحب وإفلات: بطاقات إلى سلال (باللمس أو الفأرة، أو ضغطة ثم ضغطة) ---------- */
function dragGame(box,g,ctx,w){var items=g.items.map(function(x,i){return {t:x[0],b:x[1],v:x[2],i:i};}).sort(function(){return Math.random()-.5;}).slice(0,g.max||8),left=items.length,ok=0,sel=null;
  box.innerHTML='<div class="dd"><div class="dd-cards" data-cards>'+items.map(function(x,k){return '<button type="button" class="dd-card" data-card="'+x.i+'" data-bin="'+x.b+'" style="--i:'+k+'"><i class="clip"></i>'+(x.v?'<span class="v">'+(D.VIS[x.v]?D.vis(x.v):esc(x.v))+'</span>':'')+'<b>'+esc(x.t)+'</b></button>';}).join('')+'</div>'+
   '<div class="dd-bins">'+g.bins.map(function(b,k){return '<div class="dd-bin" data-drop="'+k+'" style="--bc:'+PAL[(k*2)%PAL.length]+'"><div class="lbl"><b>'+esc(b)+'</b></div><div class="zone" data-zone></div></div>';}).join('')+'</div>'+
   '<div class="dd-box" aria-hidden="true"><span>'+esc((w&&w.boxLabel)||'')+'</span></div></div>';
  var root=$('.dd',box),drag=null;
  function place(card,bin){var good=String(card.dataset.bin)===String(bin.dataset.drop);if(good){ok++;left--;snd('ok');card.classList.add('done');card.disabled=true;card.style.transform='';$('[data-zone]',bin).appendChild(card);bin.classList.remove('hit');void bin.offsetWidth;bin.classList.add('hit');
     if(!left){setTimeout(function(){var r=document.createElement('div');r.className='dg-done';r.innerHTML='<div class="dg-medal">'+ok+'/'+items.length+'</div><b>'+esc(g.doneMsg||'العلبة جاهزة، هيا نبدأ!')+'</b>';root.appendChild(r);D.confetti(box.closest('.dk')||document.body,60);if(ctx&&ctx.nt)for(var t=0;t<ctx.nt;t++){ctx.sc[t]+=1;}if(ctx)ctx.paint();},500);}}
    else{bin.classList.remove('shake');void bin.offsetWidth;bin.classList.add('shake');card.style.transform='';try{if(window.DA&&DA.snd)DA.snd('tap');}catch(e){}}}
  root.addEventListener('pointerdown',function(e){var c=e.target.closest('.dd-card');if(!c||c.disabled)return;drag={c:c,x:e.clientX,y:e.clientY,moved:false};c.setPointerCapture&&c.setPointerCapture(e.pointerId);c.classList.add('drag');});
  root.addEventListener('pointermove',function(e){if(!drag)return;var dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>6)drag.moved=true;drag.c.style.transform='translate('+dx+'px,'+dy+'px) rotate(3deg) scale(1.06)';
   $$('.dd-bin',root).forEach(function(b){var r=b.getBoundingClientRect();b.classList.toggle('over',e.clientX>r.left&&e.clientX<r.right&&e.clientY>r.top&&e.clientY<r.bottom);});});
  function up(e){if(!drag)return;var c=drag.c,moved=drag.moved;drag=null;c.classList.remove('drag');var bin=$$('.dd-bin',root).filter(function(b){var r=b.getBoundingClientRect();return e.clientX>r.left&&e.clientX<r.right&&e.clientY>r.top&&e.clientY<r.bottom;})[0];$$('.dd-bin',root).forEach(function(b){b.classList.remove('over');});
   if(moved){if(bin)place(c,bin);else c.style.transform='';return;}
   c.style.transform='';if(sel)sel.classList.remove('sel');sel=c;c.classList.add('sel');snd('tap');}
  root.addEventListener('pointerup',up);root.addEventListener('pointercancel',up);
  root.addEventListener('click',function(e){var b=e.target.closest('.dd-bin');if(b&&sel&&!sel.disabled){var c=sel;sel.classList.remove('sel');sel=null;place(c,b);}});}
D.GAMES.drag={n:'اسحب وأفلت',ic:'🧺',d:'اسحبوا كل بطاقة وضعوها في مكانها الصحيح',run:function(box,g,ctx){box.innerHTML='<div class="dg-h"><b>'+esc(g.t||this.n)+'</b><small>اسحبوا البطاقة إلى مكانها، أو اضغطوها ثم اضغطوا المكان</small></div><div data-gb></div>';dragGame($('[data-gb]',box),g,ctx,null);}};
D.dragGame=dragGame;

/* ---------- تحويل الشريحة إلى مشهد من العالم ---------- */
D.worldSlide=function(w,s,sp,ctx,html){var k=s.k,scene=(k==='goals'||k==='levels'||k==='gallery'||k==='exit'||k==='end'||k==='concepts')?'gallery':'room',soft=true;
  if(k==='cover'){soft=false;html='<div class="dw-cover">'+sign(w,w.welcome)+'<div class="dw-gate"><span class="gi">'+w.icR+'</span><span class="gt"><b>'+esc(w.gate)+'</b><small>'+esc(w.gateEn||'')+'</small></span><span class="gn">'+esc(s.code||'')+'</span></div>'+
     '<div class="dw-easel"><div class="canvas"><span class="kick">'+esc(w.titleKicker)+'</span><h1>'+esc(s.title)+'</h1>'+(s.sub?'<p>'+esc(s.sub)+'</p>':'')+'<small>'+esc(s.kicker||'')+'</small></div><i class="leg l"></i><i class="leg m"></i><i class="leg r"></i><i class="tray"></i></div>'+
     '<div class="dw-chips">'+(s.chips||[]).map(function(c){return '<span>'+esc(c)+'</span>';}).join('')+'</div></div>';}
  else if(k==='goals'){html='<div class="dw-goals">'+sign(w,w.goalsTitle||s.title)+'<div class="dw-frames">'+s.items.map(function(x,i){return '<div class="dw-frame" style="--i:'+i+';--fc:'+PAL[i%PAL.length]+'"><i class="wire"></i><span class="n">'+(i+1)+'</span><p>'+esc(x[0])+'</p>'+(x[1]?'<em>'+esc(x[1])+'</em>':'')+'</div>';}).join('')+'</div></div>';}
  else if(k==='drag'){html='<div class="dw-drag">'+sign(w,s.title||w.priorTitle)+'<div class="dw-hint">'+esc(s.hint||w.priorHint)+'</div><div class="dk-drag-b" data-dragb></div></div>';}
  else if(k==='levels'||k==='concepts'){html='<div class="dw-wrap">'+sign(w,s.title||'')+html.replace(/<h2>[\s\S]*?<\/h2>/,'')+'</div>';}
  else if(k==='end'){soft=false;html='<div class="dw-wrap">'+sign(w,w.endTitle)+html+'</div>';}
  return {html:html,scene:scene,soft:soft};};
})();

/* =====================================================================
   مراحل الرحلة (من شرائح عيسى السبع): مدخل مرحلة، تمهيد «الباب المقفل»، وتحدي «تدخل أم لا تدخل؟»
   ===================================================================== */
(function(){
'use strict';
var D=window.DECK,W=D.WORLDS.studio,U=D._||{};
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function $(s,r){return (r||document).querySelector(s);}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));}
function snd(k){try{if(window.DA&&DA.snd)DA.snd(k);}catch(e){}}
var PAL=['#F28B9B','#5AA6E8','#F2C14E','#6CC08B','#B08BE0'];
W.unlockTitle='التمهيد: الحصول على مفتاح المرسم';W.doorName='باب المرسم';W.doorEn='Studio Door';W.openMsg='فُتح المرسم، تفضلوا يا فنانين!';
W.cardNames=['البطاقة الأولى','البطاقة الثانية','البطاقة الثالثة','البطاقة الرابعة'];W.gateTitle='التحدي: تدخل أم لا تدخل؟';W.inLbl='تدخل';W.outLbl='لا تدخل';
function tube(c){return '<svg viewBox="0 0 60 90" class="tube"><rect x="22" y="2" width="16" height="14" rx="3" fill="#3B2A6B"/><path d="M16 16 h28 l6 58 q-20 12 -40 0z" fill="'+c+'"/><path d="M16 16 h28 l1 10 h-30z" fill="#fff" opacity=".55"/><rect x="18" y="40" width="24" height="20" rx="4" fill="#fff" opacity=".85"/><path d="M10 74 q20 12 40 0 l1 8 q-21 10 -42 0z" fill="#C9C9D6"/></svg>';}
function door(w,name,code,cls){return '<div class="dw-door '+(cls||'locked')+'" data-door><div class="hd"><span class="gi">'+w.icR+'</span><span class="gt"><b>'+esc(name)+'</b><small>'+esc(w.doorEn||'')+'</small></span>'+(code?'<span class="gn">'+esc(code)+'</span>':'')+'</div><div class="fr"><i class="lf a"></i><i class="lf b"></i><span class="in">🎨</span><span class="lk">🔒</span><i class="tape"></i></div><i class="rug"></i></div>';}
W.boxClosed=function(){return '<svg class="dw-art" viewBox="0 0 640 360" aria-hidden="true"><ellipse cx="320" cy="330" rx="270" ry="18" fill="#000" opacity=".14"/><rect x="60" y="70" width="520" height="250" rx="26" fill="#C4763E"/><rect x="60" y="70" width="520" height="118" rx="26" fill="#D08A4E"/><rect x="60" y="176" width="520" height="12" fill="#8A4A20"/><path d="M60 96 a26 26 0 0 1 26 -26 h30 v60 h-56z M580 96 a26 26 0 0 0 -26 -26 h-30 v60 h56z M60 294 a26 26 0 0 0 26 26 h30 v-60 h-56z M580 294 a26 26 0 0 1 -26 26 h-30 v-60 h56z" fill="#6B3A1C"/><rect x="150" y="162" width="70" height="46" rx="6" fill="#E9C46A"/><rect x="420" y="162" width="70" height="46" rx="6" fill="#E9C46A"/><rect x="250" y="20" width="140" height="62" rx="22" fill="none" stroke="#3B2A2A" stroke-width="16"/><rect x="262" y="214" width="116" height="26" rx="13" fill="#3B2A2A"/><circle cx="150" cy="262" r="26" fill="#E4572E"/><circle cx="212" cy="270" r="20" fill="#F2B705"/><circle cx="470" cy="266" r="24" fill="#2E86AB"/><g transform="translate(410 96) rotate(24)"><rect x="0" y="0" width="12" height="60" rx="5" fill="#3B2A6B"/><path d="M-2 0 q8 -22 16 0z" fill="#E4572E"/></g><g transform="translate(180 90) rotate(-18)"><path d="M0 30 a34 26 0 1 1 68 0 q-4 16 -22 10 q-10 -2 -8 8 q-40 6 -38 -18z" fill="#FFF8EC" stroke="#3B2A6B" stroke-width="3"/><circle cx="18" cy="24" r="6" fill="#E4572E"/><circle cx="36" cy="14" r="6" fill="#F2B705"/><circle cx="52" cy="24" r="6" fill="#2E9E6B"/></g></svg>';};

/* تحدي البوابة: تدخل أم لا تدخل؟ */
D.GAMES.gate={n:'تدخل أم لا تدخل؟',ic:'🚪',d:'بطاقة بعد بطاقة: هل تدخل من هذه البوابة أم لا؟',
 run:function(box,g,ctx){var it=(U.shuf?U.shuf(g.items||[]):g.items).slice(0,g.max||6),i=0,ok=0,w=W;
  box.innerHTML='<div class="dg-h"><b>'+esc(g.t||w.gateTitle)+'</b><small>احكموا على كل بطاقة: هل تنتمي إلى هذه البوابة؟</small></div><div class="gt-g"><div class="gt-list">'+it.map(function(x,k){return '<div class="gt-it" data-it="'+k+'" style="--i:'+k+'"><span class="n">'+(k+1)+'</span><b>'+esc(x[0])+'</b><span class="v">'+(x[2]?(D.VIS[x[2]]?D.vis(x[2]):esc(x[2])):'')+'</span></div>';}).join('')+'</div><div class="gt-side">'+door(w,g.gate||w.doorName,'','closed')+'<div class="gt-btns"><button type="button" class="yes" data-a="1">✓ '+w.inLbl+'</button><button type="button" class="no" data-a="0">✗ '+w.outLbl+'</button></div></div></div>';
  var dr=$('[data-door]',box);
  function cur(){$$('.gt-it',box).forEach(function(e,k){e.classList.toggle('cur',k===i);});if(i>=it.length){$$('[data-a]',box).forEach(function(b){b.disabled=true;});if(U.done)U.done($('.gt-g',box),'أنهيتم التحدي!',ok+'/'+it.length);}}
  box.addEventListener('click',function(e){var a=e.target.closest('[data-a]');if(!a||i>=it.length||a.disabled)return;var x=it[i],el=$('[data-it="'+i+'"]',box),right=(+a.dataset.a===(x[1]?1:0));
   if(!right){el.classList.remove('shake');void el.offsetWidth;el.classList.add('shake');try{if(window.DA&&DA.snd)DA.snd('tap');}catch(er){}return;}
   ok++;snd('ok');if(x[1]){dr.classList.add('open');el.classList.add('in');setTimeout(function(){dr.classList.remove('open');},1100);}else el.classList.add('out');
   var fin=function(t){if(U.addPts)U.addPts(ctx,t,1);i++;cur();};if(U.teamPick&&ctx&&ctx.nt)U.teamPick(ctx,fin);else fin(-1);});
  cur();}};

var prevWS=D.worldSlide;
D.worldSlide=function(w,s,sp,ctx,html){
  if(s.k==='unlock'){var items=(s.items||[]).slice(0,4);return {scene:'room',soft:true,html:'<div class="dw-unlock">'+D.sign(w,s.title||w.unlockTitle)+'<div class="ul-g">'+door(w,w.doorName,s.code||'','locked')+'<div class="ul-cards">'+items.map(function(t,k){return '<button type="button" class="ul-card" data-ul style="--uc:'+PAL[k%PAL.length]+';--i:'+k+'"><span class="f">'+tube(PAL[k%PAL.length])+'<b>'+esc(w.cardNames[k]||('البطاقة '+(k+1)))+'</b><i class="hand">👆</i></span><span class="bk">'+esc(t)+'</span><i class="stub"></i></button>';}).join('')+'</div></div><div class="ul-msg" data-ulmsg hidden>'+esc(w.openMsg)+'</div></div>'};}
  if(s.k==='chapter'){return {scene:'room',soft:true,html:'<div class="dw-chapter">'+D.sign(w,s.title||'')+'<div class="ch-art">'+(s.art&&w[s.art]?w[s.art]():'')+'</div>'+(s.sub?'<div class="dw-hint">'+esc(s.sub)+'</div>':'')+'</div>'};}
  return prevWS(w,s,sp,ctx,html);};
D.onSlide=function(s,sl,ctx,w){if(s.k!=='unlock')return;var cards=$$('[data-ul]',sl),dr=$('[data-door]',sl);
  cards.forEach(function(c){c.onclick=function(){if(c.classList.contains('open'))return;c.classList.add('open');snd('tap');if(cards.every(function(x){return x.classList.contains('open');})){setTimeout(function(){dr.classList.remove('locked');dr.classList.add('open');var m=$('[data-ulmsg]',sl);if(m)m.hidden=false;snd('ok');D.confetti(sl.closest('.dk'),70);},700);}};});};
})();
