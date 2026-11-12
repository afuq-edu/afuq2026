/* =====================================================================
   DECK · عالم «رحلة المطار» للغة العربية (world-airport.js) — يُحمَّل بعد deck.js و deck-world.js
   من نموذج شرائح عيسى «رحلتنا التعليمية»: لافتة ترحيب، بوابة الرحلة، عنوان الدرس على حقيبة،
   الأهداف تذاكر صعود، التعلم القبلي «تجهيز حقيبة السفر» بالسحب والإفلات.
   أول استعمال: عرض «الأساس الخالد» للمعلم أحمد الشيهاني (/ahmad/) 2026-11-12.

   المشاهد: room = صالة المطار (نافذة كبيرة على المدرج والطائرة وبرج المراقبة وجبال الحجر)
            gallery = صالة الانتظار، ويستطيع كل درس استبدالها بمشهد وجهته (متحف، قلعة، سوق…)
   الشرائح المضافة: cover (حقيبة العنوان)، goals (تذاكر صعود)، drag (حقيبة السفر)، chapter، end.
   أدوات للدروس: DECK.AIR.sign(نص)، DECK.AIR.suitcase(html)، DECK.AIR.tag(n,نص)، DECK.AIR.plane()
   ===================================================================== */
(function(){
'use strict';
var D=window.DECK;if(!D)return;
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function $(s,r){return (r||document).querySelector(s);}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));}
function snd(k){try{if(window.DA&&DA.snd)DA.snd(k);}catch(e){}}
var PAL=['#5AA6E8','#F28B9B','#F2C14E','#6CC08B','#B08BE0','#F29E4C'];

/* ---------- رسوم صغيرة ---------- */
var PLANE='<svg viewBox="0 0 64 64" aria-hidden="true"><g transform="rotate(-35 32 32)"><path d="M6 33c0-2 2-3 4-3h40c6 0 10 1 10 3s-4 3-10 3H10c-2 0-4-1-4-3z" fill="#fff" stroke="#1F3A68" stroke-width="2.4"/><path d="M30 31 L20 12 h6 l14 19z M30 35 L20 54 h6 l14-19z" fill="#5AA6E8" stroke="#1F3A68" stroke-width="2.2" stroke-linejoin="round"/><path d="M10 31 L5 22 h5 l7 9z" fill="#5AA6E8" stroke="#1F3A68" stroke-width="2"/><circle cx="46" cy="33" r="1.6" fill="#1F3A68"/><circle cx="41" cy="33" r="1.6" fill="#1F3A68"/><circle cx="36" cy="33" r="1.6" fill="#1F3A68"/></g></svg>';
var PASS='<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="8" y="12" width="34" height="44" rx="5" fill="#1F3A68"/><circle cx="25" cy="30" r="9" fill="none" stroke="#F2C14E" stroke-width="2.4"/><path d="M16 30h18M25 21c4 5 4 13 0 18M25 21c-4 5-4 13 0 18" stroke="#F2C14E" stroke-width="1.8" fill="none"/><rect x="30" y="18" width="26" height="36" rx="4" fill="#fff" stroke="#5AA6E8" stroke-width="2.4" transform="rotate(12 43 36)"/><path d="M37 30h12M37 36h9" stroke="#5AA6E8" stroke-width="2.4" stroke-linecap="round" transform="rotate(12 43 36)"/><path d="M48 6c-4 0-7 3-7 7 0 5 7 11 7 11s7-6 7-11c0-4-3-7-7-7z" fill="#E4572E"/><circle cx="48" cy="13" r="2.6" fill="#fff"/></svg>';
D.AIR={PLANE:PLANE,PASS:PASS};

/* ---------- مشهد صالة المطار ---------- */
function board(x,y){var s='<g transform="translate('+x+' '+y+')"><rect x="-10" y="-10" width="200" height="300" rx="16" fill="#2A3B57"/><rect x="0" y="0" width="180" height="280" rx="10" fill="#14223A"/><path d="M40 34 l40 -6 l10 -14 l8 0 l-4 16 l30 -4 l8 -8 l6 0 l-4 12 l-4 12 l-6 0 l-6 -8 l-30 2 l4 16 l-8 0 l-10 -14 l-40 -4z" fill="#F2C14E"/>';
  for(var i=0;i<9;i++){var yy=70+i*22;s+='<rect x="14" y="'+yy+'" width="62" height="12" rx="3" fill="#3E5A85"/><rect x="84" y="'+yy+'" width="82" height="12" rx="3" fill="'+(i%3===1?'#F2C14E':'#5C7FB3')+'" opacity=".9"/>';}
  return s+'<rect x="80" y="280" width="20" height="300" fill="#C9D4E2"/></g>';}
function plant(x,y,f){return '<g transform="translate('+x+' '+y+') scale('+(f||1)+')"><path d="M-60 0 h120 l-14 120 h-92z" fill="#F4EFE8" stroke="#D9CFC2" stroke-width="4"/><g fill="#5FAE5A">'+
  [[-70,-150,-10],[60,-160,10],[-20,-190,-4],[20,-180,6],[-90,-90,-30],[90,-100,30],[0,-210,0]].map(function(l){return '<path d="M0 0 Q'+(l[0]*.4)+' '+(l[1]*.6)+' '+l[0]+' '+l[1]+' Q'+(l[0]*.9)+' '+(l[1]*.4)+' 0 0z" transform="rotate('+l[2]+')"/>';}).join('')+'</g><g fill="#3F8F45" opacity=".8"><path d="M0 0 Q-40 -60 -50 -120 Q-10 -70 0 0z"/><path d="M0 0 Q40 -70 44 -130 Q10 -70 0 0z"/></g></g>';}
function seats(x,y,flip){var s='<g transform="translate('+x+' '+y+')'+(flip?' scale(-1 1)':'')+'">';for(var i=0;i<3;i++){var xx=i*112;s+='<rect x="'+xx+'" y="0" width="100" height="70" rx="18" fill="#3D5F95"/><rect x="'+(xx+6)+'" y="60" width="96" height="40" rx="14" fill="#2F4D7E"/><rect x="'+(xx+4)+'" y="8" width="20" height="40" rx="8" fill="#5B82C0" opacity=".6"/>';}
  return s+'<rect x="0" y="100" width="330" height="12" rx="6" fill="#8EA0B8"/><rect x="20" y="112" width="12" height="40" fill="#8EA0B8"/><rect x="300" y="112" width="12" height="40" fill="#8EA0B8"/></g>';}
function airliner(x,y,sc){return '<g transform="translate('+x+' '+y+') scale('+sc+')"><ellipse cx="300" cy="118" rx="290" ry="10" fill="#000" opacity=".12"/>'+
  '<path d="M40 70 Q40 40 90 40 H520 Q580 40 600 70 Q580 100 520 100 H90 Q40 100 40 70z" fill="#FDFDFD" stroke="#C9D2DE" stroke-width="3"/><path d="M40 70 Q40 52 70 48 L120 48 L120 92 L70 92 Q40 88 40 70z" fill="#E6ECF4"/>'+
  '<path d="M80 40 L40 -20 H80 L150 40z" fill="#2E86AB"/><path d="M60 -10 L80 -10 L120 30" stroke="#F2C14E" stroke-width="6" fill="none"/>'+
  '<path d="M300 78 L230 150 H270 L380 80z" fill="#DDE4EE" stroke="#B8C3D1" stroke-width="2"/><rect x="250" y="108" width="60" height="22" rx="11" fill="#9AA8BB"/>'+
  '<g fill="#3A5A86">'+[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(function(i){return '<rect x="'+(150+i*22)+'" y="56" width="12" height="14" rx="5"/>';}).join('')+'</g>'+
  '<path d="M560 52 Q585 56 596 68 H560z" fill="#2A3B57"/><rect x="520" y="60" width="16" height="30" rx="3" fill="#C9D2DE"/>'+
  '<circle cx="160" cy="112" r="10" fill="#333"/><circle cx="330" cy="114" r="10" fill="#333"/><circle cx="520" cy="110" r="8" fill="#333"/></g>';}
function tower(x,y){return '<g transform="translate('+x+' '+y+')"><rect x="-18" y="40" width="36" height="200" fill="#E9E2D6"/><rect x="-8" y="40" width="6" height="200" fill="#D3C8B6"/><path d="M-56 40 h112 l-18 -40 h-76z" fill="#2E86AB"/><path d="M-50 32 h100 l-10 -26 h-80z" fill="#9FD3F2" opacity=".8"/><rect x="-44" y="-12" width="88" height="14" rx="4" fill="#E9E2D6"/><rect x="-3" y="-40" width="6" height="30" fill="#8EA0B8"/><circle cx="0" cy="-42" r="5" fill="#E4572E" class="aw-blink"/></g>';}
function terminal(){var s='<svg class="dw-scene" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>'+
  '<linearGradient id="awSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5FB2EC"/><stop offset=".6" stop-color="#BFE5FA"/><stop offset="1" stop-color="#FFF1D9"/></linearGradient>'+
  '<linearGradient id="awFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EFE7DC"/><stop offset="1" stop-color="#DCCFBE"/></linearGradient>'+
  '<linearGradient id="awCarpet" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D93B3B"/><stop offset="1" stop-color="#B92A2F"/></linearGradient>'+
  '<linearGradient id="awGlass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".16"/></linearGradient></defs>'+
  '<rect width="1600" height="700" fill="url(#awSky)"/>'+
  '<g class="dw-cloud"><ellipse cx="260" cy="150" rx="90" ry="26" fill="#fff"/><ellipse cx="310" cy="128" rx="60" ry="30" fill="#fff"/></g><g class="dw-cloud c2"><ellipse cx="1180" cy="120" rx="80" ry="22" fill="#fff" opacity=".9"/><ellipse cx="1220" cy="102" rx="50" ry="26" fill="#fff" opacity=".9"/></g>'+
  '<g class="aw-fly"><g transform="translate(980 210) scale(.9) rotate(-8)">'+'<path d="M0 10 h90 q14 0 14 6 t-14 6 h-90z" fill="#fff"/><path d="M40 12 l-20 -26 h10 l30 26z M40 22 l-20 26 h10 l30 -26z M4 12 l-8 -14 h8 l10 14z" fill="#9FC6E8"/>'+'</g></g>'+
  '<path d="M0 520 L120 470 L210 495 L330 430 L470 480 L600 440 L760 485 L900 420 L1040 470 L1180 430 L1330 480 L1460 445 L1600 480 V560 H0z" fill="#C7A27C"/><path d="M0 540 L180 505 L340 530 L520 495 L700 530 L880 500 L1080 535 L1260 505 L1440 530 L1600 510 V570 H0z" fill="#DDBE97"/>'+
  tower(1250,330)+'<rect x="1150" y="520" width="240" height="50" fill="#E9E2D6"/><rect x="1160" y="530" width="220" height="14" fill="#9FD3F2" opacity=".8"/>'+
  '<rect y="560" width="1600" height="140" fill="#B9C3CF"/><g stroke="#fff" stroke-width="6" stroke-dasharray="60 50" opacity=".8"><path d="M0 640 H1600"/></g>'+
  airliner(150,520,.92)+
  /* إطارات النوافذ */
  '<g fill="#2C3E57">'+[0,1,2,3,4,5,6,7,8].map(function(i){return '<rect x="'+(i*200-10)+'" y="0" width="20" height="700"/>';}).join('')+'<rect x="0" y="0" width="1600" height="40"/><rect x="0" y="300" width="1600" height="10" opacity=".6"/><rect x="0" y="690" width="1600" height="16"/></g>'+
  '<rect width="1600" height="700" fill="url(#awGlass)"/>'+
  '<rect y="700" width="1600" height="200" fill="url(#awFloor)"/>'+[0,1,2,3,4,5,6,7].map(function(i){return '<path d="M'+(i*230)+' 700 L'+(i*230-160)+' 900" stroke="#D2C4B1" stroke-width="2"/>';}).join('')+
  '<path d="M640 700 H960 L1140 900 H460z" fill="url(#awCarpet)"/><path d="M660 700 L490 900 M940 700 L1110 900" stroke="#F2C14E" stroke-width="5" opacity=".8"/>'+
  board(40,120)+board(1380,120)+plant(250,760,.9)+plant(1350,760,.9)+seats(-60,770,false)+seats(1660,770,true)+
  '</svg>';return s;}

/* ---------- صالة الانتظار (تستبدلها الدروس بمشهد الوجهة) ---------- */
function lounge(){var s='<svg class="dw-scene" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="alSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7CC4F2"/><stop offset="1" stop-color="#FFE9C4"/></linearGradient></defs>'+
  '<rect width="1600" height="900" fill="#F6F1EA"/><rect x="100" y="80" width="1400" height="520" rx="30" fill="url(#alSky)"/><path d="M100 470 L400 420 L700 460 L1000 410 L1300 450 L1500 420 V600 H100z" fill="#DDBE97"/>'+airliner(380,330,1.2)+
  '<g fill="#2C3E57"><rect x="560" y="80" width="16" height="520"/><rect x="1020" y="80" width="16" height="520"/></g><rect x="100" y="80" width="1400" height="520" rx="30" fill="none" stroke="#2C3E57" stroke-width="18"/><rect y="640" width="1600" height="260" fill="#E7DCCD"/>'+seats(120,700,false)+seats(1480,700,true)+'</svg>';return s;}

var W=D.WORLDS.airport={cls:'w-airport',scenes:{room:terminal,gallery:lounge},welcome:'مرحبًا بكم في رحلتنا التعليمية',gate:'بوابة الرحلة',gateEn:'Boarding Gate',titleKicker:'عنوان درسنا اليوم:',
  priorTitle:'التعلم القبلي: تجهيز حقيبة السفر',priorHint:'اسحبوا البطاقة وضعوها في المكان المناسب',boxLabel:'حقيبة السفر',goalsTitle:'تذاكر رحلتنا: سأتعلم اليوم',endTitle:'وصلنا بسلام!',icL:PASS,icR:PLANE};

/* ---------- عناصر المشهد ---------- */
function sign(txt,cls){return '<div class="aw-sign'+(cls?' '+cls:'')+'"><span class="ic">'+PLANE+'</span><b>'+esc(txt)+'</b><span class="ic">'+PASS+'</span></div>';}
function gateBar(code){return '<div class="aw-gate"><i class="ar">⬆</i><span class="gi">'+PLANE+'</span><span class="gt"><b>'+esc(W.gate)+'</b><small>'+esc(W.gateEn)+'</small></span><span class="gn">'+esc(code||'A3')+'</span><i class="ar">⬆</i></div>';}
function suitcase(inner,cls){return '<div class="aw-case'+(cls?' '+cls:'')+'"><i class="hdl"></i><div class="body"><i class="cl c1"></i><i class="cl c2"></i>'+inner+'</div><i class="tix"><b></b></i></div>';}
function tag(n,t,c){return '<div class="aw-tag" style="--tc:'+(c||PAL[(n-1)%PAL.length])+'"><i class="hole"></i><span class="n">'+n+'</span><p>'+esc(t)+'</p></div>';}
function pass(n,t,c){return '<div class="aw-pass" style="--i:'+(n-1)+';--pc:'+c+'" data-pass><div class="pl"><small>بطاقة صعود</small><span class="n">'+n+'</span><span class="pi">'+PLANE+'</span></div><div class="pr"><p>'+esc(t)+'</p><i class="bar"></i></div><span class="stamp">✓ تحقق</span></div>';}
D.AIR.sign=sign;D.AIR.suitcase=suitcase;D.AIR.tag=tag;D.AIR.gate=gateBar;D.AIR.plane=function(){return PLANE;};D.AIR.pass=pass;

var prevWS=D.worldSlide,prevOS=D.onSlide;
D.worldSlide=function(w,s,sp,ctx,html){if(w!==W)return prevWS(w,s,sp,ctx,html);var k=s.k;
  if(D.AIR.slides&&D.AIR.slides[k]){var r=D.AIR.slides[k](s,sp,ctx);return {html:r.html,scene:r.scene||'room',soft:r.soft!==false};}
  if(k==='cover'){return {scene:'room',soft:false,html:'<div class="aw-cover">'+sign(W.welcome)+gateBar(s.code)+'<div class="aw-cv-case">'+suitcase('<span class="kick">'+esc(W.titleKicker)+'</span><h1>'+esc(s.title)+'</h1>'+(s.sub?'<p>'+esc(s.sub)+'</p>':''))+'<i class="post a"></i><i class="post b"></i></div>'+(s.chips&&s.chips.length?'<div class="aw-chips">'+s.chips.map(function(c){return '<span>'+esc(c)+'</span>';}).join('')+'</div>':'')+'</div>'};}
  if(k==='goals'){return {scene:'room',soft:true,html:'<div class="aw-goals">'+sign(s.title||W.goalsTitle)+'<div class="aw-passes">'+s.items.map(function(x,i){return pass(i+1,x[0]||x,PAL[i%PAL.length]);}).join('')+'</div><p class="aw-hint">اضغطوا التذكرة عندما نحقق الهدف ✓</p></div>'};}
  if(k==='drag'){return {scene:'room',soft:true,html:'<div class="aw-drag">'+sign(s.title||W.priorTitle)+'<div class="aw-hint">'+esc(s.hint||W.priorHint)+'</div><div class="dk-drag-b" data-dragb></div></div>'};}
  if(k==='chapter'){return {scene:'room',soft:true,html:'<div class="aw-chapter">'+sign(s.title||'')+suitcase('<h1>'+esc(s.big||'')+'</h1>','closed')+(s.sub?'<div class="aw-hint">'+esc(s.sub)+'</div>':'')+'</div>'};}
  if(k==='end'){return {scene:'room',soft:false,html:'<div class="aw-end">'+sign(s.title||W.endTitle)+html.replace(/<h1>[\s\S]*?<\/h1>/,'')+'</div>'};}
  if(k==='game'){return {scene:'room',soft:true,html:html};}
  return {html:html,scene:'room',soft:true};};
D.onSlide=function(s,sl,ctx,w){if(prevOS)prevOS(s,sl,ctx,w);if(w!==W)return;
  $$('[data-pass]',sl).forEach(function(p){p.onclick=function(){p.classList.toggle('done');snd(p.classList.contains('done')?'ok':'tap');};});
  if(D.AIR.bind&&D.AIR.bind[s.k])D.AIR.bind[s.k](s,sl,ctx);};
})();
