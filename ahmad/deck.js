/* =====================================================================
   DECK · محرك العروض التفاعلية والألعاب (أول استعمال: «مرسم مزن» /shaima/)
   مستقل عن المنصة: يحتاج فقط deck.css، ويستعمل DA.snd وDA.toast إن وُجدا.

   DECK.open(spec)           يفتح عرضًا بملء الشاشة
     spec = {title, sub, color, minutes, names:[...], slides:[slide...]}
     slide.k: cover | goals | step | work | concepts | game | levels | gallery | exit | end | text
       step/work: {phase, min, title, lines:[[who,text]], vis}   (who: t معلم، s طالب)
       game: {game:{k, t, ...data}}   ← أي لعبة من DECK.GAMES تعمل داخل الشريحة
       levels: {items:[{lv, q, a}]}   concepts: {items:[[term, def, vis]]}
   DECK.play(game, opt)      يشغّل لعبة وحدها بملء الشاشة (مكتبة الألعاب)
   DECK.vis(key)             رسم SVG متحرك لمفهوم فني (line-zigzag, color-mix, light-shadow …)
   DECK.GAMES                سجل الألعاب: tf, boxes, catch, race, sort, match, memory, wheel, mix, spot

   الفرق ولوحة النقاط مشتركة بين كل الشرائح والألعاب داخل العرض الواحد.
   ===================================================================== */
(function(){
'use strict';
var D=window.DECK={};
var RED=!!(window.DA&&window.DA.REDUCED);
function $(s,r){return (r||document).querySelector(s);}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function shuf(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;}return a;}
function snd(k){try{if(window.DA&&DA.snd)DA.snd(k);}catch(e){}}
function toast(m){if(window.DA&&DA.toast)DA.toast(m);}
var AC=null;
function tone(f,d,v,type,when){try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();var t=AC.currentTime+(when||0),o=AC.createOscillator(),g=AC.createGain();o.type=type||'sine';o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v||.12,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+d+.05);}catch(e){}}
function chime(){if(window.DA&&DA.lsg&&DA.lsg('mute',false))return;[784,988,1175].forEach(function(f,i){tone(f,.9,.1,'sine',i*.18);});}
function win(){if(window.DA&&DA.lsg&&DA.lsg('mute',false))return;[523,659,784,1047].forEach(function(f,i){tone(f,.35,.09,'triangle',i*.11);});}
function bad(){if(window.DA&&DA.lsg&&DA.lsg('mute',false))return;tone(220,.25,.08,'sawtooth');}
var PAL=['#E4572E','#F2B705','#2E86AB','#7A4FB0','#2E9E6B','#E95F8C'];
/* عبارات الواجهة: الافتراضي لمعلمة الفنون؛ لعرض آخر غيّري DECK.T قبل DECK.open (مثل: معلم، ومواد غير الفنون) */
var T={start:'▶ ابدئي',cont:'▶ متابعة',again:'↻ من جديد',stop:'⏸ إيقاف',show:'أظهري الإجابة',flip:'اضغطي لمعرفة المعنى',tmTip:'اضغطي لإضافة نقطة، واضغطي مطولًا للإنقاص',skip:'تخطّي السؤال ←',eyes:'عيونكم عيون فنانين!',endT:'أحسنتم يا فنانينا الصغار',mix:true};

/* ---------- قصاصات الاحتفال ---------- */
function confetti(host,n){if(RED)return;host=host||document.body;var c=document.createElement('div');c.className='dk-conf';
  for(var i=0;i<(n||70);i++){var p=document.createElement('i');p.style.left=Math.random()*100+'%';p.style.background=PAL[i%PAL.length];p.style.animationDelay=(Math.random()*.6)+'s';p.style.animationDuration=(1.6+Math.random()*1.4)+'s';p.style.setProperty('--r',(Math.random()*720-360)+'deg');p.style.setProperty('--x',(Math.random()*160-80)+'px');if(i%3===0)p.style.borderRadius='50%';c.appendChild(p);}
  host.appendChild(c);setTimeout(function(){c.remove();},3600);}
D.confetti=confetti;

/* =====================================================================
   مكتبة البصريات: رسوم SVG متحركة للمفاهيم الفنية
   ===================================================================== */
function sv(inner,vb){return '<svg class="dk-vis" viewBox="'+(vb||'0 0 400 280')+'" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'+inner+'</svg>';}
function dp(d,c,w,dl,extra){return '<path class="dw" pathLength="1" d="'+d+'" fill="none" stroke="'+c+'" stroke-width="'+(w||8)+'" stroke-linecap="round" stroke-linejoin="round" style="--dl:'+(dl||0)+'s" '+(extra||'')+'/>';}
var V={
 'line-straight':function(){return sv(dp('M40 140 H360','#E4572E',10)+dp('M80 60 V230','#2E86AB',10,.6)+dp('M120 230 L300 60','#7A4FB0',10,1.2));},
 'line-zigzag':function(){return sv(dp('M30 180 L80 90 L130 180 L180 90 L230 180 L280 90 L330 180 L370 110','#E4572E',10)+dp('M30 240 L60 210 L90 240 L120 210 L150 240 L180 210 L210 240 L240 210 L270 240 L300 210 L330 240 L360 210','#2E86AB',6,.8));},
 'line-curve':function(){return sv(dp('M30 180 C100 40 160 40 200 140 S300 240 370 100','#2E9E6B',10)+dp('M30 230 Q120 170 200 230 T370 230','#2E86AB',7,.7));},
 'line-wave':function(){return sv(dp('M20 100 q30 -40 60 0 t60 0 t60 0 t60 0 t60 0 t60 0','#2E86AB',9)+dp('M20 160 q30 -40 60 0 t60 0 t60 0 t60 0 t60 0 t60 0','#2E9E6B',9,.5)+dp('M20 220 q30 -40 60 0 t60 0 t60 0 t60 0 t60 0 t60 0','#7A4FB0',9,1));},
 'line-spiral':function(){var d='M200 140',r=4,a=0;for(var i=0;i<90;i++){a+=.35;r+=1.35;d+=' L'+(200+Math.cos(a)*r).toFixed(1)+' '+(140+Math.sin(a)*r*.8).toFixed(1);}return sv(dp(d,'#7A4FB0',7));},
 'line-coil':function(){var d='M30 150';for(var i=0;i<=340;i+=4){d+=' L'+(30+i+Math.sin(i/12)*22).toFixed(1)+' '+(150-Math.cos(i/12)*44).toFixed(1);}return sv(dp(d,'#E95F8C',7));},
 'line-thick':function(){return sv(dp('M40 80 H360','#3B2A6B',3)+dp('M40 140 H360','#3B2A6B',10,.4)+dp('M40 210 H360','#3B2A6B',22,.8));},
 'line-dir':function(){return sv(dp('M40 60 H360','#E4572E',9)+dp('M200 90 V250','#2E86AB',9,.5)+dp('M60 250 L180 110','#2E9E6B',9,1)+dp('M220 110 L340 250','#2E9E6B',9,1.2)+'<text x="200" y="44" class="dk-vl">أفقي</text><text x="232" y="180" class="dk-vl">رأسي</text><text x="96" y="160" class="dk-vl">مائل</text>');},
 'line-near':function(){var s='';for(var i=0;i<9;i++)s+=dp('M'+(40+i*12)+' 60 V230','#3B2A6B',4,i*.08);for(i=0;i<5;i++)s+=dp('M'+(230+i*30)+' 60 V230','#3B2A6B',4,.8+i*.1);return sv(s+'<text x="88" y="262" class="dk-vl">متقاربة</text><text x="290" y="262" class="dk-vl">متباعدة</text>');},
 'line-feel':function(){return sv('<circle cx="110" cy="140" r="80" fill="#FFE9A8"/><circle cx="290" cy="140" r="80" fill="#FFD3C7"/>'+dp('M80 115 v2 M140 115 v2','#3B2A6B',10)+dp('M75 165 Q110 200 145 165','#3B2A6B',7,.4)+dp('M255 110 l20 10 M325 110 l-20 10','#3B2A6B',7,.8)+dp('M255 185 L270 170 L285 185 L300 170 L315 185 L330 170','#E4572E',6,1.1));},
 'shape-geo':function(){return sv('<g class="pop-in"><circle cx="90" cy="100" r="55" fill="#E4572E" style="--dl:.1s"/><rect x="170" y="45" width="110" height="110" rx="6" fill="#2E86AB" style="--dl:.3s"/><polygon points="330,45 390,155 270,155" fill="#F2B705" style="--dl:.5s"/><rect x="60" y="185" width="280" height="70" rx="6" fill="#2E9E6B" style="--dl:.7s"/></g>');},
 'shape-build':function(){return sv('<g class="pop-in"><rect x="130" y="120" width="140" height="110" fill="#F2B705" style="--dl:.1s"/><polygon points="120,124 200,50 280,124" fill="#E4572E" style="--dl:.35s"/><rect x="180" y="170" width="40" height="60" fill="#3B2A6B" style="--dl:.6s"/><circle cx="300" cy="70" r="28" fill="#F2B705" style="--dl:.8s"/><rect x="146" y="140" width="28" height="28" fill="#2E86AB" style="--dl:.95s"/><rect x="226" y="140" width="28" height="28" fill="#2E86AB" style="--dl:1.05s"/></g>');},
 'space':function(){return sv('<rect width="400" height="280" fill="#151030"/><g class="pop-in"><circle cx="300" cy="80" r="40" fill="#F2B705" style="--dl:.1s"/><circle cx="90" cy="200" r="26" fill="#2E86AB" style="--dl:.3s"/><ellipse cx="90" cy="200" rx="46" ry="10" fill="none" stroke="#E95F8C" stroke-width="4" style="--dl:.4s"/><rect x="180" y="120" width="40" height="90" rx="6" fill="#EEE" style="--dl:.6s"/><polygon points="180,120 200,80 220,120" fill="#E4572E" style="--dl:.75s"/><polygon points="180,210 166,236 180,226" fill="#E4572E" style="--dl:.85s"/><polygon points="220,210 234,236 220,226" fill="#E4572E" style="--dl:.85s"/><circle cx="200" cy="150" r="10" fill="#2E86AB" style="--dl:.95s"/></g><g fill="#fff">'+[30,70,140,250,360,330,40].map(function(x,i){return '<circle class="tw" cx="'+x+'" cy="'+(30+i*33%240)+'" r="2" style="--dl:'+i*.3+'s"/>';}).join('')+'</g>');},
 'mondrian':function(){return sv('<g class="pop-in"><rect x="10" y="10" width="140" height="120" fill="#E4572E" style="--dl:.1s"/><rect x="160" y="10" width="230" height="60" fill="#F7F3E8"/><rect x="160" y="80" width="100" height="190" fill="#F2B705" style="--dl:.35s"/><rect x="270" y="80" width="120" height="100" fill="#F7F3E8"/><rect x="270" y="190" width="120" height="80" fill="#2E86AB" style="--dl:.6s"/><rect x="10" y="140" width="140" height="130" fill="#F7F3E8"/></g><g stroke="#151515" stroke-width="9">'+dp('M155 5 V275','#151515',9,.8)+dp('M5 135 H155','#151515',9,.9)+dp('M155 75 H395','#151515',9,1)+dp('M265 75 V275','#151515',9,1.1)+dp('M265 185 H395','#151515',9,1.2)+'</g>');},
 'color-primary':function(){return sv('<g class="pop-in"><circle cx="100" cy="140" r="62" fill="#E53935" style="--dl:.1s"/><circle cx="200" cy="140" r="62" fill="#FDD835" style="--dl:.35s"/><circle cx="300" cy="140" r="62" fill="#1E63C6" style="--dl:.6s"/></g><text x="100" y="250" class="dk-vl">أحمر</text><text x="200" y="250" class="dk-vl">أصفر</text><text x="300" y="250" class="dk-vl">أزرق</text>');},
 'color-mix':function(){return sv('<g style="mix-blend-mode:multiply" class="drift"><circle cx="160" cy="110" r="78" fill="#E53935" opacity=".85"/><circle cx="240" cy="110" r="78" fill="#FDD835" opacity=".85"/><circle cx="200" cy="175" r="78" fill="#1E63C6" opacity=".85"/></g><text x="200" y="22" class="dk-vl">أساسي + أساسي = ثانوي</text>');},
 'color-secondary':function(){return sv('<g class="pop-in"><circle cx="100" cy="130" r="58" fill="#F57C00" style="--dl:.1s"/><circle cx="200" cy="130" r="58" fill="#2E9E4F" style="--dl:.35s"/><circle cx="300" cy="130" r="58" fill="#7B3FA0" style="--dl:.6s"/></g><text x="100" y="232" class="dk-vl">برتقالي</text><text x="200" y="232" class="dk-vl">أخضر</text><text x="300" y="232" class="dk-vl">بنفسجي</text><text x="100" y="262" class="dk-vs">أحمر + أصفر</text><text x="200" y="262" class="dk-vs">أزرق + أصفر</text><text x="300" y="262" class="dk-vs">أحمر + أزرق</text>');},
 'color-tones':function(){var c=[[255,224,196],[255,190,140],[248,150,80],[230,110,30],[190,80,10],[140,55,5],[90,35,5]];return sv('<g class="pop-in">'+c.map(function(x,i){return '<rect x="'+(18+i*53)+'" y="70" width="46" height="130" rx="10" fill="rgb('+x.join(',')+')" style="--dl:'+i*.12+'s"/>';}).join('')+'</g><text x="60" y="236" class="dk-vl">فاتح</text><text x="340" y="236" class="dk-vl">غامق</text>'+dp('M90 250 H310','#3B2A6B',4,.9,'marker-end="url(#ar)"')+'<defs><marker id="ar" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10z" fill="#3B2A6B"/></marker></defs>');},
 'color-wheel':function(){var c=['#E53935','#F57C00','#FDD835','#2E9E4F','#1E63C6','#7B3FA0'],s='';for(var i=0;i<6;i++){var a0=(i/6)*Math.PI*2-Math.PI/2,a1=((i+1)/6)*Math.PI*2-Math.PI/2;s+='<path d="M200 140 L'+(200+Math.cos(a0)*110).toFixed(1)+' '+(140+Math.sin(a0)*110).toFixed(1)+' A110 110 0 0 1 '+(200+Math.cos(a1)*110).toFixed(1)+' '+(140+Math.sin(a1)*110).toFixed(1)+'Z" fill="'+c[i]+'"/>';}return sv('<g class="spin-slow">'+s+'</g><circle cx="200" cy="140" r="38" fill="#FFF8EC"/>');},
 'light-shadow':function(){return sv('<rect width="400" height="280" fill="#FFF8EC"/><rect y="205" width="400" height="75" fill="#EFE3CC"/><g class="sun-move"><circle cx="70" cy="60" r="28" fill="#F2B705"/><g stroke="#F2B705" stroke-width="4">'+[0,1,2,3,4,5,6,7].map(function(i){var a=i*Math.PI/4;return '<line x1="'+(70+Math.cos(a)*36)+'" y1="'+(60+Math.sin(a)*36)+'" x2="'+(70+Math.cos(a)*48)+'" y2="'+(60+Math.sin(a)*48)+'"/>';}).join('')+'</g></g><ellipse class="shd" cx="290" cy="212" rx="90" ry="12" fill="#3B2A6B" opacity=".35"/><circle cx="210" cy="160" r="50" fill="url(#sg)"/><defs><radialGradient id="sg" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#FFD0B0"/><stop offset=".6" stop-color="#E4572E"/><stop offset="1" stop-color="#7A2A10"/></radialGradient></defs><text x="120" y="262" class="dk-vs">منطقة النور</text><text x="300" y="262" class="dk-vs">الظل الساقط</text>');},
 'relief':function(){return sv('<rect x="40" y="40" width="320" height="200" rx="12" fill="#E9DCC6"/><g class="pop-in"><rect x="70" y="70" width="80" height="60" rx="8" fill="#F7EEDD" style="--dl:.1s;filter:drop-shadow(8px 8px 4px rgba(60,40,20,.45))"/><rect x="250" y="70" width="80" height="60" rx="8" fill="#CDBB9E" style="--dl:.35s;filter:drop-shadow(-4px -4px 3px rgba(60,40,20,.35))"/><polygon points="160,215 200,150 240,215" fill="#F7EEDD" style="--dl:.6s;filter:drop-shadow(8px 6px 4px rgba(60,40,20,.45))"/></g><text x="110" y="160" class="dk-vs">بارز</text><text x="290" y="160" class="dk-vs">غائر</text>');},
 'pattern':function(){var s='';for(var i=0;i<6;i++){var x=20+i*62;s+='<g class="pop-in"><rect x="'+x+'" y="96" width="56" height="88" rx="6" fill="'+['#FFF3D9','#FDE2D6'][i%2]+'" style="--dl:'+i*.1+'s"/></g>'+dp('M'+(x+8)+' 140 L'+(x+28)+' 108 L'+(x+48)+' 140 L'+(x+28)+' 172 Z',PAL[i%4],5,.6+i*.1)+'<circle cx="'+(x+28)+'" cy="140" r="6" fill="#3B2A6B"/>';}return sv(s+'<text x="200" y="222" class="dk-vl">وحدة زخرفية تتكرر</text>');},
 'origami':function(){return sv('<g class="pop-in"><polygon points="70,140 150,80 150,200" fill="#2E86AB" style="--dl:.1s"/><polygon points="150,80 260,140 150,200" fill="#5AA6CF" style="--dl:.35s"/><polygon points="260,140 330,90 320,140 330,190" fill="#E4572E" style="--dl:.6s"/><circle cx="210" cy="130" r="8" fill="#151515" style="--dl:.8s"/></g>'+dp('M150 80 L150 200','#1A4C6B',3,1)+dp('M60 240 q20 -12 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0','#2E86AB',4,1.1));},
 'sea':function(){return sv('<defs><linearGradient id="sw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FD3E8"/><stop offset="1" stop-color="#1E5C8A"/></linearGradient></defs><rect width="400" height="280" fill="url(#sw)"/><g class="swim"><path d="M90 140 q40 -40 90 0 q-50 40 -90 0z" fill="#F2B705"/><path d="M180 140 l26 -18 v36z" fill="#F2B705"/><circle cx="110" cy="134" r="5" fill="#151515"/></g><path d="M300 240 c-10 -40 10 -60 0 -90 M320 240 c10 -30 -8 -50 6 -80" stroke="#2E9E6B" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M40 250 a26 26 0 1 1 52 0z" fill="#E95F8C"/>'+[60,140,220].map(function(x,i){return '<circle class="bub" cx="'+x+'" cy="230" r="6" fill="none" stroke="#fff" stroke-width="2" style="--dl:'+i*.7+'s"/>';}).join(''));},
 'tree':function(){return sv(dp('M200 260 C196 200 206 170 200 120','#7A4A2A',16)+dp('M200 160 C170 140 140 120 120 80','#7A4A2A',9,.4)+dp('M202 150 C240 130 260 100 290 80','#7A4A2A',9,.6)+'<g class="pop-in"><circle cx="120" cy="76" r="34" fill="#2E9E6B" style="--dl:.8s"/><circle cx="200" cy="70" r="44" fill="#3BB078" style="--dl:.95s"/><circle cx="290" cy="76" r="34" fill="#2E9E6B" style="--dl:1.1s"/></g>'+dp('M190 100 a8 8 0 1 1 16 0 a14 14 0 1 1 -28 0','#F2B705',4,1.4)+dp('M110 76 a6 6 0 1 1 12 0 a10 10 0 1 1 -20 0','#F2B705',4,1.6));},
 'heritage':function(){return sv('<g class="pop-in"><path d="M120 60 q40 0 40 30 v20 h-80 v-20 q0 -30 40 -30z" fill="#C98A04" style="--dl:.1s"/><path d="M90 110 h60 l-6 110 q-24 20 -48 0z" fill="#E4572E" style="--dl:.3s"/><path d="M160 130 q30 10 34 40" stroke="#C98A04" stroke-width="8" fill="none" style="--dl:.3s"/><path d="M260 60 l16 0 l4 150 q-12 26 -24 0z" fill="#3B2A6B" style="--dl:.55s"/><path d="M240 70 h56 v14 h-56z" fill="#F2B705" style="--dl:.55s"/></g>'+dp('M100 150 q20 -14 40 0 M100 180 q20 -14 40 0','#FFF',4,.9)+'<text x="120" y="262" class="dk-vs">الدلة</text><text x="268" y="262" class="dk-vs">الخنجر</text>');},
 'face':function(){return sv('<circle cx="200" cy="140" r="110" fill="#FFE2C4"/>'+dp('M150 110 q12 -14 24 0 M226 110 q12 -14 24 0','#3B2A6B',7)+dp('M140 175 Q200 235 260 175','#E4572E',9,.5)+dp('M120 70 q30 -30 70 -16 M210 54 q40 -14 70 16','#7A4A2A',6,.9));},
 'gallery':function(){return sv('<rect width="400" height="280" fill="#F6EFE2"/><g class="pop-in">'+[[30,50,'#E4572E'],[150,40,'#2E86AB'],[270,55,'#2E9E6B']].map(function(x,i){return '<g style="--dl:'+i*.25+'s"><rect x="'+x[0]+'" y="'+x[1]+'" width="100" height="120" fill="#7A4A2A"/><rect x="'+(x[0]+8)+'" y="'+(x[1]+8)+'" width="84" height="104" fill="'+x[2]+'"/><circle cx="'+(x[0]+50)+'" cy="'+(x[1]+60)+'" r="18" fill="#FFF8EC" opacity=".8"/></g>';}).join('')+'</g><text x="200" y="232" class="dk-vl">⭐ ⭐ ونجمتان وأمنية</text>');},
 'tools':function(){return sv('<g class="pop-in"><rect x="60" y="60" width="30" height="170" rx="6" fill="#F2B705" style="--dl:.1s;transform-origin:75px 145px;transform:rotate(-18deg)"/><polygon points="60,60 90,60 75,30" fill="#E9C9A0" style="--dl:.1s"/><rect x="170" y="50" width="22" height="160" rx="8" fill="#3B2A6B" style="--dl:.3s"/><path d="M170 50 q11 -40 22 0z" fill="#E4572E" style="--dl:.3s"/><circle cx="300" cy="150" r="70" fill="#FFF8EC" stroke="#3B2A6B" stroke-width="5" style="--dl:.5s"/>'+PAL.slice(0,5).map(function(c,i){var a=i*1.25;return '<circle cx="'+(300+Math.cos(a)*40)+'" cy="'+(150+Math.sin(a)*40)+'" r="14" fill="'+c+'" style="--dl:'+(.6+i*.1)+'s"/>';}).join('')+'</g>');}
};
D.VIS=V;
D.vis=function(k){return (V[k]||V.tools)();};
/* اختيار البصري المناسب من الكلمات */
var KW=[['حلزون','line-spiral'],['لولب','line-coil'],['منكسر','line-zigzag'],['متموج','line-wave'],['موج','line-wave'],['منحني','line-curve'],['سُمك','line-thick'],['سمك','line-thick'],['اتجاه','line-dir'],['أفقي','line-dir'],['تقارب','line-near'],['تباعد','line-near'],['مشاعر','line-feel'],['وجوه','face'],['تعبير','line-feel'],['ظل','light-shadow'],['ضوء','light-shadow'],['نور','light-shadow'],['بارز','relief'],['غائر','relief'],['بلاط','relief'],['موندريان','mondrian'],['مربعات لونية','mondrian'],['فضاء','space'],['أوريجامي','origami'],['طي','origami'],['سمك','origami'],['بحر','sea'],['محيط','sea'],['أصداف','sea'],['قوقع','sea'],['بحري','sea'],['اللبان','tree'],['شجرة','tree'],['زخرف','pattern'],['شريط','pattern'],['تراث','heritage'],['الخنجر','heritage'],['الدلة','heritage'],['درجات','color-tones'],['الدرجة','color-tones'],['تدرج','color-tones'],['الثانوية','color-secondary'],['ثانوي','color-secondary'],['مزج','color-mix'],['تقاطع','color-mix'],['الأساسية','color-primary'],['أساسي','color-primary'],['بقع','color-primary'],['الأشكال الهندسية','shape-geo'],['هندسي','shape-geo'],['بناء','shape-build'],['معرض','gallery'],['تجوال','gallery'],['نقد','gallery'],['الخطوط','line-curve'],['خط','line-straight'],['مستقيم','line-straight']];
D.pick=function(){var t=Array.prototype.join.call(arguments,' ');for(var i=0;i<KW.length;i++)if(t.indexOf(KW[i][0])>=0)return KW[i][1];return 'tools';};

/* =====================================================================
   الفرق ولوحة النقاط
   ===================================================================== */
var TEAMS=[['النجوم','#E4572E'],['الألوان','#2E86AB'],['الفرشاة','#2E9E6B'],['القلم','#7A4FB0']];
function teamsBar(ctx){return '<div class="dk-teams" data-teams>'+ctx.sc.slice(0,ctx.nt).map(function(s,i){return '<button type="button" class="dk-tm" data-tm="'+i+'" style="--tc:'+TEAMS[i][1]+'" title="'+T.tmTip+'"><b>'+TEAMS[i][0]+'</b><span>'+s+'</span></button>';}).join('')+'<button type="button" class="dk-tm add" data-tmn title="عدد الفرق">'+ctx.nt+' فرق</button></div>';}
function addPts(ctx,i,n){if(i==null||i<0)return;ctx.sc[i]=Math.max(0,ctx.sc[i]+(n||1));ctx.paint();var b=$('[data-tm="'+i+'"]',ctx.root);if(b){b.classList.remove('bump');void b.offsetWidth;b.classList.add('bump');}}

/* =====================================================================
   الألعاب: كل لعبة تُرسم داخل عنصر box وتستدعي ctx.addPts عند الفوز
   ===================================================================== */
var G=D.GAMES={};
function head(box,t,sub){box.innerHTML='<div class="dg-h"><b>'+esc(t)+'</b>'+(sub?'<small>'+esc(sub)+'</small>':'')+'</div><div class="dg-b" data-gb></div>';return $('[data-gb]',box);}
function teamPick(ctx,cb){if(!ctx||!ctx.nt){cb(-1);return;}var o=document.createElement('div');o.className='dg-pick';o.innerHTML='<b>من أجاب صحيحًا؟</b><div>'+ctx.sc.slice(0,ctx.nt).map(function(_,i){return '<button type="button" style="--tc:'+TEAMS[i][1]+'" data-p="'+i+'">'+TEAMS[i][0]+'</button>';}).join('')+'<button type="button" data-p="-1" class="no">لا أحد</button></div>';
  ctx.root.appendChild(o);o.addEventListener('click',function(e){var b=e.target.closest('[data-p]');if(!b)return;o.remove();cb(+b.dataset.p);});}
function done(box,msg,score){var r=document.createElement('div');r.className='dg-done';r.innerHTML='<div class="dg-medal">'+(score!=null?score:'🏆')+'</div><b>'+esc(msg||'أحسنتم!')+'</b>';box.appendChild(r);win();confetti(box.closest('.dk')||document.body,60);}

D.T=T;D.TEAMS=TEAMS;D._={teamPick:teamPick,addPts:addPts,done:done,head:head,shuf:shuf};

/* 1) صاروخ صح أم خطأ */
G.tf={n:'صاروخ صح أم خطأ',ic:'🚀',d:'كل إجابة صحيحة تطلق الصاروخ درجة نحو القمر',
 run:function(box,g,ctx){var it=shuf(g.items||[]).slice(0,8),i=0,ok=0;var b=head(box,g.t||this.n,'احكموا على العبارة: صح أم خطأ؟');
  b.innerHTML='<div class="tf-sky"><div class="tf-moon"></div><div class="tf-stars"></div><div class="tf-rocket" data-r>🚀</div><div class="tf-track">'+it.map(function(){return '<i></i>';}).join('')+'</div></div><div class="tf-card"><p data-q></p><div class="tf-btns"><button type="button" class="yes" data-a="1">✓ صح</button><button type="button" class="no" data-a="0">✗ خطأ</button></div><p class="tf-why" data-w></p></div>';
  function show(){if(i>=it.length){done(b,ok===it.length?'وصل الصاروخ إلى القمر!':'أنهيتم الرحلة!',ok+'/'+it.length);return;}$('[data-q]',b).textContent=it[i][0];$('[data-w]',b).textContent='';$$('[data-a]',b).forEach(function(x){x.disabled=false;});}
  b.addEventListener('click',function(e){var a=e.target.closest('[data-a]');if(!a||a.disabled)return;$$('[data-a]',b).forEach(function(x){x.disabled=true;});var right=(+a.dataset.a===(it[i][1]?1:0));
   if(right){ok++;snd('ok');$('[data-r]',b).style.setProperty('--h',(ok/it.length*100)+'%');$$('.tf-track i',b)[ok-1].classList.add('on');a.classList.add('good');teamPick(ctx,function(t){addPts(ctx,t,1);i++;setTimeout(show,300);});}
   else{bad();a.classList.add('bad');$('[data-w]',b).textContent=it[i][2]?('💡 '+it[i][2]):(it[i][1]?'العبارة صحيحة':'العبارة خطأ');setTimeout(function(){i++;show();},2200);}});
  show();}};

/* 2) افتح الصناديق */
G.boxes={n:'افتح الصناديق',ic:'🎁',d:'صندوق لكل فريق بدوره، وداخل كل صندوق سؤال ونقاط مفاجئة',
 run:function(box,g,ctx){var Q=shuf(g.q||[]).slice(0,12),turn=0;var b=head(box,g.t||this.n,'اختاروا صندوقًا وأجيبوا عن سؤاله');
  b.innerHTML='<div class="bx-turn" data-turn></div><div class="bx-g">'+Q.map(function(q,i){return '<button type="button" class="bx" data-bx="'+i+'" style="--bc:'+PAL[i%PAL.length]+'"><span class="lid"></span><span class="body">'+(i+1)+'</span></button>';}).join('')+'</div><div class="bx-q" data-bq hidden></div>';
  function turnLbl(){var t=$('[data-turn]',b);if(ctx&&ctx.nt){t.innerHTML='الدور على فريق <b style="color:'+TEAMS[turn][1]+'">'+TEAMS[turn][0]+'</b>';}else t.textContent='';}
  b.addEventListener('click',function(e){var x=e.target.closest('[data-bx]');if(x&&!x.classList.contains('open')){x.classList.add('open');snd('tap');var q=Q[+x.dataset.bx],pts=[1,1,2,2,3][Math.floor(Math.random()*5)],qp=$('[data-bq]',b);
     var opts=q[2]?shuf([q[1]].concat(q[2])):null;qp.hidden=false;qp.innerHTML='<div class="bx-pts">+'+pts+' ⭐</div><h3>'+esc(q[0])+'</h3>'+(opts?'<div class="bx-o">'+opts.map(function(o){return '<button type="button" data-o="'+esc(o)+'">'+esc(o)+'</button>';}).join('')+'</div>':'<button type="button" class="dk-btn line" data-show>'+T.show+'</button><p class="bx-a" hidden>'+esc(q[1])+'</p><div class="bx-o"><button type="button" data-ok="1">✓ أجابوا</button><button type="button" data-ok="0">✗ لم يجيبوا</button></div>');
     qp.onclick=function(ev){var o=ev.target.closest('[data-o]'),k=ev.target.closest('[data-ok]'),sh=ev.target.closest('[data-show]');if(sh){$('.bx-a',qp).hidden=false;return;}
      var good=null;if(o){good=o.dataset.o===q[1];$$('[data-o]',qp).forEach(function(z){z.disabled=true;if(z.dataset.o===q[1])z.classList.add('good');});if(!good)o.classList.add('bad');}if(k)good=k.dataset.ok==='1';if(good==null)return;
      if(good){snd('ok');addPts(ctx,ctx&&ctx.nt?turn:-1,pts);}else bad();x.classList.add(good?'won':'lost');
      setTimeout(function(){qp.hidden=true;if(ctx&&ctx.nt)turn=(turn+1)%ctx.nt;turnLbl();if(!$$('.bx:not(.open)',b).length)done(b,'فُتحت كل الصناديق!');},good?1300:2000);};}});
  turnLbl();}};

/* 3) صياد الإجابة: الإجابات تسقط كقطرات ألوان */
G.catch={n:'صياد الإجابة',ic:'🎯',d:'اصطادوا الإجابة الصحيحة وهي تسقط قطرة ألوان من السماء',
 run:function(box,g,ctx){var Q=shuf((g.q||[]).filter(function(q){return q[2];})).slice(0,8),i=0,ok=0,sp=1,raf=0,drops=[];var b=head(box,g.t||this.n,'اضغطوا القطرة التي تحمل الإجابة الصحيحة');
  if(!Q.length){b.innerHTML='<p class="dg-empty">لا توجد أسئلة اختيار لهذه اللعبة</p>';return;}
  b.innerHTML='<div class="ct-top"><div class="ct-sp">'+[['بطيء',.6],['متوسط',1],['سريع',1.5]].map(function(s){return '<button type="button" data-sp="'+s[1]+'"'+(s[1]===1?' class="on"':'')+'>'+s[0]+'</button>';}).join('')+'</div><b class="ct-sc" data-sc>0</b></div><h3 class="ct-q" data-q></h3><div class="ct-sky" data-sky></div>';
  var sky=$('[data-sky]',b);
  function round(){cancelAnimationFrame(raf);sky.innerHTML='';drops=[];if(i>=Q.length){done(b,'انتهى الصيد!',ok+'/'+Q.length);return;}var q=Q[i];$('[data-q]',b).textContent=q[0];
   var opts=shuf([q[1]].concat(q[2])).slice(0,4);opts.forEach(function(o,k){var d=document.createElement('button');d.type='button';d.className='ct-d';d.textContent=o;d.style.setProperty('--dc',PAL[(i+k)%PAL.length]);var w=100/opts.length;d.style.left=(k*w+w*.08)+'%';d.style.width=(w*.84)+'%';sky.appendChild(d);drops.push({el:d,y:-60-Math.random()*120,v:(40+Math.random()*30),o:o});});
   var t0=0;function f(t){if(!t0)t0=t;var dt=Math.min(.05,(t-t0)/1000);t0=t;var H=sky.clientHeight,miss=true;drops.forEach(function(x){if(x.dead)return;x.y+=x.v*sp*dt;if(x.y>H-10){x.y=-50;}x.el.style.transform='translateY('+x.y+'px)';miss=false;});if(!miss)raf=requestAnimationFrame(f);}raf=requestAnimationFrame(f);}
  b.addEventListener('click',function(e){var s=e.target.closest('[data-sp]');if(s){sp=+s.dataset.sp;$$('[data-sp]',b).forEach(function(z){z.classList.toggle('on',z===s);});return;}
   var d=e.target.closest('.ct-d');if(!d||d.disabled)return;var x=drops.filter(function(z){return z.el===d;})[0],q=Q[i];
   if(x.o===q[1]){ok++;snd('ok');d.classList.add('splash');$('[data-sc]',b).textContent=ok;drops.forEach(function(z){z.dead=true;z.el.disabled=true;});cancelAnimationFrame(raf);teamPick(ctx,function(t){addPts(ctx,t,1);i++;setTimeout(round,250);});}
   else{bad();d.classList.add('miss');d.disabled=true;}});
  round();}};

/* 4) سباق الفرق: كل فريق فرشاة تتسابق على لوحة. الإجابات أزرار تُضغط؛ الصحيحة تسأل «أي فريق أجاب؟» فتتقدم فرشاته */
G.race={n:'سباق الفرق',ic:'🏁',d:'سؤال لكل جولة: اضغطوا الإجابة، والفريق الذي أجاب صحيحًا تتقدم فرشاته نحو خط النهاية',
 run:function(box,g,ctx){var Q=shuf(g.q||[]).slice(0,10),i=0,nt=(ctx&&ctx.nt)||2,goal=Math.min(5,Q.length),pos=[0,0,0,0],lock=false;var b=head(box,g.t||this.n,'أول فريق يصل إلى '+goal+' يفوز');
  b.innerHTML='<div class="rc-track">'+[0,1,2,3].slice(0,nt).map(function(t){return '<div class="rc-lane" style="--tc:'+TEAMS[t][1]+'"><span class="rc-nm">'+TEAMS[t][0]+'</span><div class="rc-road"><i class="rc-paint" data-pt="'+t+'"></i><span class="rc-car" data-car="'+t+'">🖌️</span></div><span class="rc-flag">🏁</span></div>';}).join('')+'</div>'+
   '<div class="rc-q"><small data-n></small><h3 data-q></h3><div class="rc-o" data-o></div><p class="rc-msg" data-msg></p></div>'+
   '<div class="rc-who" data-rcwho hidden><b>أي فريق أجاب؟</b>'+[0,1,2,3].slice(0,nt).map(function(t){return '<button type="button" style="--tc:'+TEAMS[t][1]+'" data-win="'+t+'">'+TEAMS[t][0]+'</button>';}).join('')+'<button type="button" class="no" data-win="-1">لا أحد</button></div>'+
   '<div class="rc-foot"><button type="button" class="dk-btn line sm" data-skip>'+T.skip+'</button></div>';
  function showWho(){var w=$('[data-rcwho]',b);w.hidden=false;try{w.scrollIntoView({block:'nearest',behavior:'smooth'});}catch(e){}}
  function finish(){var mx=Math.max.apply(null,pos.slice(0,nt)),best=pos.indexOf(mx);done(b,mx>0?('الفائز: فريق '+TEAMS[best][0]+' 🎉'):'انتهى السباق!');}
  function show(){lock=false;$('[data-rcwho]',b).hidden=true;$('[data-msg]',b).textContent='';if(i>=Q.length){finish();return;}var q=Q[i];$('[data-n]',b).textContent='الجولة '+(i+1)+' من '+Q.length;$('[data-q]',b).textContent=q[0];
   $('[data-o]',b).innerHTML=q[2]&&q[2].length?shuf([q[1]].concat(q[2])).map(function(o){return '<button type="button" class="rc-a" data-ans="'+(o===q[1]?1:0)+'">'+esc(o)+'</button>';}).join(''):'<button type="button" class="rc-a hid" data-ans="1" data-open="1">اضغطوا لإظهار الإجابة</button>';}
  function advance(t){if(t>=0){pos[t]++;addPts(ctx,t,1);var p=Math.min(100,pos[t]/goal*100);$('[data-car="'+t+'"]',b).style.insetInlineStart='calc('+p+'% - 22px)';$('[data-pt="'+t+'"]',b).style.width=p+'%';if(pos[t]>=goal){done(b,'الفائز: فريق '+TEAMS[t][0]+' 🎉');return;}}i++;setTimeout(show,500);}
  b.addEventListener('click',function(e){var a=e.target.closest('[data-ans]'),w=e.target.closest('[data-win]');
   if(e.target.closest('[data-skip]')){if(i<Q.length){i++;show();}return;}
   if(w){advance(+w.dataset.win);return;}
   if(!a||lock||a.disabled)return;
   if(a.dataset.open){a.textContent=Q[i][1];a.classList.remove('hid');a.classList.add('good');a.removeAttribute('data-open');lock=true;snd('ok');showWho();return;}
   if(a.dataset.ans==='1'){lock=true;a.classList.add('good');snd('ok');$$('[data-ans]',b).forEach(function(x){x.disabled=true;});$('[data-msg]',b).textContent='إجابة صحيحة! 👏';showWho();}
   else{a.classList.add('bad');a.disabled=true;bad();$('[data-msg]',b).textContent='حاولوا مرة أخرى…';}});
  show();}};

/* 5) صنّف */
G.sort={n:'صنّف البطاقات',ic:'🗂️',d:'بطاقة بعد بطاقة: إلى أي سلة تنتمي؟',
 run:function(box,g,ctx){var it=shuf(g.items||[]),i=0,ok=0;var b=head(box,g.t||this.n,'اضغطوا السلة المناسبة للبطاقة');
  b.innerHTML='<div class="so-card" data-c></div><div class="so-bins">'+(g.bins||[]).map(function(x,k){return '<button type="button" class="so-bin" data-bin="'+k+'" style="--bc:'+PAL[k%PAL.length]+'"><b>'+esc(x)+'</b><span data-cnt="'+k+'">0</span></button>';}).join('')+'</div>';
  function show(){if(i>=it.length){done(b,'صنّفتم كل البطاقات!',ok+'/'+it.length);$('[data-c]',b).innerHTML='';return;}var c=$('[data-c]',b);c.textContent=it[i][0];c.classList.remove('in');void c.offsetWidth;c.classList.add('in');}
  b.addEventListener('click',function(e){var x=e.target.closest('[data-bin]');if(!x||i>=it.length)return;if(+x.dataset.bin===it[i][1]){ok++;snd('ok');var n=$('[data-cnt="'+x.dataset.bin+'"]',b);n.textContent=+n.textContent+1;x.classList.remove('hit');void x.offsetWidth;x.classList.add('hit');i++;show();}else{bad();x.classList.remove('shake');void x.offsetWidth;x.classList.add('shake');}});
  show();}};

/* 6) وجدتها (مطابقة) */
G.match={n:'وجدتها! (مطابقة)',ic:'🔗',d:'اضغطوا البطاقة ثم ما يناسبها من العمود الآخر',
 run:function(box,g,ctx){var P=shuf(g.pairs||[]).slice(0,6),sel=null,left=P.length;var b=head(box,g.t||this.n,'طابقوا كل بطاقة بما يناسبها');
  var A=shuf(P.map(function(p,i){return [p[0],i];})),B=shuf(P.map(function(p,i){return [p[1],i];}));
  b.innerHTML='<div class="mt-g"><div class="mt-c">'+A.map(function(x){return '<button type="button" class="mt" data-s="a" data-i="'+x[1]+'">'+esc(x[0])+'</button>';}).join('')+'</div><div class="mt-c">'+B.map(function(x){return '<button type="button" class="mt" data-s="b" data-i="'+x[1]+'">'+esc(x[0])+'</button>';}).join('')+'</div></div>';
  b.addEventListener('click',function(e){var x=e.target.closest('.mt');if(!x||x.classList.contains('ok'))return;if(!sel||sel.dataset.s===x.dataset.s){if(sel)sel.classList.remove('sel');sel=x;x.classList.add('sel');snd('tap');return;}
   if(sel.dataset.i===x.dataset.i){var c=PAL[left%PAL.length];[sel,x].forEach(function(z){z.classList.remove('sel');z.classList.add('ok');z.style.setProperty('--mc',c);});snd('ok');left--;sel=null;if(!left)done(b,'طابقتم كل البطاقات!');}
   else{bad();[sel,x].forEach(function(z){z.classList.add('shake');setTimeout(function(){z.classList.remove('shake');},500);});sel.classList.remove('sel');sel=null;}});}};

/* 7) الذاكرة */
G.memory={n:'بطاقات الذاكرة',ic:'🃏',d:'اقلبوا بطاقتين: هل تتطابقان؟',
 run:function(box,g,ctx){var P=shuf(g.pairs||[]).slice(0,6),C=[];P.forEach(function(p,i){C.push([p[0],i]);C.push([p[1],i]);});C=shuf(C);var open=[],left=P.length,turn=0;var b=head(box,g.t||this.n,'كل فريق يقلب بطاقتين بدوره');
  b.innerHTML='<div class="mm-g">'+C.map(function(c,k){return '<button type="button" class="mm" data-k="'+k+'" style="--bc:'+PAL[k%PAL.length]+'"><span class="f">🎨</span><span class="bk">'+esc(c[0])+'</span></button>';}).join('')+'</div>';
  b.addEventListener('click',function(e){var x=e.target.closest('.mm');if(!x||x.classList.contains('up')||open.length>1)return;x.classList.add('up');snd('tap');open.push(x);if(open.length<2)return;
   var a=C[+open[0].dataset.k],c=C[+open[1].dataset.k];if(a[1]===c[1]){snd('ok');open.forEach(function(z){z.classList.add('ok');});open=[];addPts(ctx,ctx&&ctx.nt?turn:-1,1);left--;if(!left)done(b,'وجدتم كل الأزواج!');}
   else{setTimeout(function(){open.forEach(function(z){z.classList.remove('up');});open=[];if(ctx&&ctx.nt)turn=(turn+1)%ctx.nt;},1100);}});}};

/* 8) عجلة الأسئلة */
G.wheel={n:'عجلة الأسئلة',ic:'🎡',d:'أديروا العجلة، وأجيبوا عمّا تقف عليه',
 run:function(box,g,ctx){var it=(g.items||(g.q||[]).map(function(q){return q[0];})).slice(0,10),rot=0;var b=head(box,g.t||this.n,'اضغطوا «أدِر» لتدور العجلة');var n=it.length;
  var seg='';for(var i=0;i<n;i++){var a0=i/n*360,a1=(i+1)/n*360;function P(a){var r=(a-90)*Math.PI/180;return (150+Math.cos(r)*145).toFixed(1)+' '+(150+Math.sin(r)*145).toFixed(1);}seg+='<path d="M150 150 L'+P(a0)+' A145 145 0 0 1 '+P(a1)+'Z" fill="'+PAL[i%PAL.length]+'"/><text x="150" y="38" transform="rotate('+((a0+a1)/2)+' 150 150)" class="wh-t">'+(i+1)+'</text>';}
  b.innerHTML='<div class="wh"><div class="wh-pin">▼</div><svg viewBox="0 0 300 300" class="wh-s" data-w>'+seg+'<circle cx="150" cy="150" r="26" fill="#FFF8EC"/></svg></div><div class="wh-r"><button type="button" class="dk-btn gold" data-spin>🎡 أدِر العجلة</button><h3 data-out></h3></div>';
  b.addEventListener('click',function(e){if(!e.target.closest('[data-spin]'))return;var k=Math.floor(Math.random()*n);rot+=1440+(360-(k+.5)/n*360)-(rot%360);var w=$('[data-w]',b);w.style.transform='rotate('+rot+'deg)';$('[data-out]',b).textContent='';snd('tap');setTimeout(function(){$('[data-out]',b).textContent=(k+1)+' · '+it[k];win();},RED?50:4200);});}};

/* 9) تحدي مزج الألوان */
var MIX=[['برتقالي','#F57C00',['أحمر','أصفر']],['أخضر','#2E9E4F',['أزرق','أصفر']],['بنفسجي','#7B3FA0',['أحمر','أزرق']]],POT={'أحمر':'#E53935','أصفر':'#FDD835','أزرق':'#1E63C6'};
G.mix={n:'تحدي مزج الألوان',ic:'🎨',d:'اصنعوا اللون المطلوب باختيار اللونين الصحيحين',
 run:function(box,g,ctx){var R=shuf(MIX.concat(MIX)).slice(0,6),i=0,sel=[],ok=0;var b=head(box,g.t||this.n,'اختاروا لونين أساسيين يصنعان اللون المطلوب');
  b.innerHTML='<div class="mxg"><div class="mxg-t"><small>اصنعوا</small><div class="mxg-blob" data-t></div><b data-tn></b></div><div class="mxg-pots">'+Object.keys(POT).map(function(k){return '<button type="button" class="pot" data-pot="'+k+'" style="--pc:'+POT[k]+'"><i></i><span>'+k+'</span></button>';}).join('')+'</div><div class="mxg-bowl" data-bowl></div></div>';
  function show(){if(i>=R.length){done(b,'أنتم خبراء الألوان!',ok+'/'+R.length);return;}sel=[];$('[data-t]',b).style.background=R[i][1];$('[data-tn]',b).textContent=R[i][0];var bw=$('[data-bowl]',b);bw.style.background='';bw.textContent='';}
  b.addEventListener('click',function(e){var p=e.target.closest('[data-pot]');if(!p||i>=R.length)return;if(sel.indexOf(p.dataset.pot)<0)sel.push(p.dataset.pot);snd('tap');var bw=$('[data-bowl]',b);bw.textContent=sel.join(' + ');if(sel.length<2)return;
   var good=R[i][2].every(function(c){return sel.indexOf(c)>=0;});bw.style.background=good?R[i][1]:'repeating-linear-gradient(45deg,'+POT[sel[0]]+' 0 12px,'+POT[sel[1]]+' 12px 24px)';
   if(good){ok++;snd('ok');bw.textContent='✓ '+R[i][0];teamPick(ctx,function(t){addPts(ctx,t,1);i++;setTimeout(show,300);});}else{bad();bw.textContent='جرّبوا مرة أخرى';setTimeout(function(){sel=[];bw.style.background='';bw.textContent='';},1300);}});
  show();}};

/* 10) ماذا ترى؟ (بصري) */
G.spot={n:'ماذا ترى؟',ic:'👁️',d:'رسم يظهر أمامكم: ما اسم الخط أو الشكل أو اللون؟',
 run:function(box,g,ctx){var it=shuf(g.items||[]).slice(0,8),i=0,ok=0,all=(g.items||[]).map(function(x){return x[1];});var b=head(box,g.t||this.n,'تأملوا الرسم واختاروا اسمه');
  b.innerHTML='<div class="sp-w"><div class="sp-v" data-v></div><div class="sp-o" data-o></div></div>';
  function show(){if(i>=it.length){done(b,T.eyes,ok+'/'+it.length);return;}var x=it[i];$('[data-v]',b).innerHTML=D.vis(x[0]);var opts=shuf([x[1]].concat(shuf(all.filter(function(a){return a!==x[1];})).slice(0,2)));
   $('[data-o]',b).innerHTML=opts.map(function(o){return '<button type="button" data-a="'+esc(o)+'">'+esc(o)+'</button>';}).join('');}
  b.addEventListener('click',function(e){var a=e.target.closest('[data-a]');if(!a||a.disabled)return;var x=it[i];$$('[data-a]',b).forEach(function(z){z.disabled=true;if(z.dataset.a===x[1])z.classList.add('good');});
   if(a.dataset.a===x[1]){ok++;snd('ok');teamPick(ctx,function(t){addPts(ctx,t,1);i++;setTimeout(show,250);});}else{bad();a.classList.add('bad');setTimeout(function(){i++;show();},1600);}});
  show();}};

/* =====================================================================
   الشرائح
   ===================================================================== */
function ring(min){return '<div class="dk-ring" data-ring data-sec="'+Math.round(min*60)+'"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" class="bg"/><circle cx="60" cy="60" r="52" class="fg" pathLength="1"/></svg><div class="dk-rt"><b data-rt>'+fmt(min*60)+'</b><button type="button" data-rgo>▶ ابدئي</button></div></div>';}
function fmt(s){s=Math.max(0,Math.round(s));return Math.floor(s/60)+':'+('0'+s%60).slice(-2);}
var RENDER={
 cover:function(s,sp){return '<div class="dk-cover" style="--gc:'+(sp.color||'#E4572E')+'"><div class="dk-cv-vis">'+D.vis(s.vis||'tools')+'</div><div class="dk-cv-t"><small>'+esc(s.kicker||'')+'</small><h1>'+esc(s.title)+'</h1><p>'+esc(s.sub||'')+'</p><div class="dk-chips">'+(s.chips||[]).map(function(c){return '<span>'+esc(c)+'</span>';}).join('')+'</div></div></div>';},
 goals:function(s){return '<div class="dk-goals"><h2>'+esc(s.title||'سأتعلم اليوم')+'</h2><ol>'+s.items.map(function(x,i){return '<li class="stp" style="--i:'+i+'"><span>'+(i+1)+'</span><p>'+esc(x[0])+'</p>'+(x[1]?'<em>'+esc(x[1])+'</em>':'')+'</li>';}).join('')+'</ol></div>';},
 step:function(s){var lines=s.lines||[];return '<div class="dk-step'+(s.k==='work'?' work':'')+'"><div class="dk-st-vis">'+D.vis(s.vis)+'</div><div class="dk-st-t"><div class="dk-phase"><span>'+esc(s.phase||'')+'</span>'+(s.min?'<em>'+s.min+' دقائق</em>':'')+'</div><h2>'+esc(s.title)+'</h2>'+(s.say&&s.say.length?'<div class="dk-says">'+s.say.map(function(t,i){return '<div class="dk-say stp" style="--i:'+i+'"><i>'+(s.sayIc||'💬')+'</i><p>'+esc(t)+'</p></div>';}).join('')+'</div>':'<ul>'+lines.map(function(l,i){return '<li class="stp who-'+l[0]+'" style="--i:'+i+'"><b>'+(l[0]==='t'?'👩‍🏫 المعلمة':'🧑‍🎨 الطلبة')+'</b><p>'+esc(l[1])+'</p></li>';}).join('')+'</ul>')+(s.tips&&s.tips.length?'<div class="dk-tips" data-tips>'+s.tips.map(function(t,i){return '<span'+(i?'':' class="on"')+'>💡 '+esc(t)+'</span>';}).join('')+'</div>':'')+'</div>'+(s.min?ring(s.min):'')+'</div>';},
 concepts:function(s){return '<div class="dk-con"><h2>'+esc(s.title||'مفاهيم الحصة')+'</h2><div class="dk-cg">'+s.items.map(function(c,i){return '<button type="button" class="dk-flip" style="--i:'+i+';--fc:'+PAL[i%PAL.length]+'" data-flipc><span class="f"><i>'+D.vis(c[2]||D.pick(c[0]))+'</i><b>'+esc(c[0])+'</b><small>'+T.flip+'</small></span><span class="bk">'+esc(c[1]||'ماذا يعني «'+c[0]+'»؟ ناقشوا معًا، ثم ارسموه في الهواء.')+'</span></button>';}).join('')+'</div></div>';},
 game:function(s){var gm=s.game,GD=G[gm.k]||{};return '<div class="dk-game"><div class="dk-gcard" data-gstart><span class="ic">'+(GD.ic||'🎲')+'</span><small>'+esc(s.kicker||'لعبة الحصة')+'</small><h2>'+esc(gm.t||GD.n)+'</h2><p>'+esc(GD.d||'')+'</p><button type="button" class="dk-btn gold big">▶ هيا نلعب</button></div><div class="dk-gbox" data-gbox hidden></div></div>';},
 levels:function(s){return '<div class="dk-lv"><h2>'+esc(s.title||'تحدي المستويات')+'</h2><div class="dk-lvg">'+s.items.map(function(x,i){var c=['#2E9E6B','#2E86AB','#7A4FB0'][i%3];return '<div class="dk-lvc" style="--lc:'+c+';--i:'+i+'"><span class="lv">'+esc(x.lv)+'</span><h3>'+esc(x.q)+'</h3><button type="button" class="dk-btn line sm" data-rev>'+(x.a?''+T.show+'':'✓ أجابوا')+'</button><p class="ans" hidden>'+esc(x.a||'أحسنتم! 👏')+'</p><div class="dk-lvp" data-lvp="'+(i+1)+'"></div></div>';}).join('')+'</div></div>';},
 gallery:function(s){return '<div class="dk-gal"><div class="dk-st-vis">'+D.vis('gallery')+'</div><div><h2>'+esc(s.title||'معرض التجوال')+'</h2><div class="dk-gal-r"><div><b>⭐ نجمة</b><p>ما أجمل شيء في عمل زميلي؟</p></div><div><b>⭐ نجمة</b><p>أي خط أو لون أو شكل أعجبني؟</p></div><div><b>🌱 أمنية</b><p>ماذا أقترح ليصبح العمل أجمل؟</p></div></div>'+(s.q?'<p class="dk-gq">'+esc(s.q)+'</p>':'')+'</div>'+(s.min?ring(s.min):'')+'</div>';},
 drag:function(s){return '<div class="dk-drag"><div class="dk-drag-h"><h2>'+esc(s.title||'')+'</h2>'+(s.hint?'<p>'+esc(s.hint)+'</p>':'')+'</div><div class="dk-drag-b" data-dragb></div></div>';},
 exit:function(s){return '<div class="dk-exit"><span class="ic">🎟️</span><small>بطاقة الخروج</small><h2>'+esc(s.title)+'</h2>'+(s.sub?'<p>'+esc(s.sub)+'</p>':'')+'</div>';},
 text:function(s){return '<div class="dk-text"><div class="dk-st-vis">'+D.vis(s.vis)+'</div><div><small>'+esc(s.kicker||'')+'</small><h2>'+esc(s.title)+'</h2><p>'+esc(s.body||'')+'</p></div></div>';},
 end:function(s,sp,ctx){var best=-1,m=-1;ctx.sc.slice(0,ctx.nt).forEach(function(v,i){if(v>m){m=v;best=i;}});return '<div class="dk-end"><div class="dk-trophy">🏆</div><h1>'+esc(s.title||T.endT)+'</h1>'+(m>0?'<p class="dk-winner">فريق <b style="color:'+TEAMS[best][1]+'">'+TEAMS[best][0]+'</b> بـ '+m+' نقطة</p>':'')+(s.sub?'<p>'+esc(s.sub)+'</p>':'')+'</div>';}
};

/* =====================================================================
   فتح العرض
   ===================================================================== */
D.open=function(sp,o){o=o||{};var S=sp.slides||[];if(!S.length)return;var i=0,started=Date.now(),clockT=null,ringT=null;
  var root=document.createElement('div');root.className='dk';root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.style.setProperty('--gc',sp.color||'#E4572E');
  var ctx={root:root,sc:[0,0,0,0],nt:sp.teams==null?2:sp.teams,paint:function(){var t=$('[data-teams]',root);if(t)t.outerHTML=teamsBar(ctx);}};
  root.innerHTML='<div class="dk-top"><b class="dk-tt">'+esc(sp.title||'')+'</b><span class="dk-clock" data-clock title="وقت الحصة">⏱ 0:00 / '+(sp.minutes||40)+':00</span><span class="sp"></span>'+teamsBar(ctx)+'<button type="button" class="dk-ib" data-x aria-label="إغلاق">✕</button></div><div class="dk-prog"><i data-prog></i></div><div class="dk-stage" data-st></div>'+
   '<div class="dk-bar"><button type="button" class="dk-ib" data-prev aria-label="السابقة">→</button><span class="dk-n" data-n></span><button type="button" class="dk-ib" data-next aria-label="التالية">←</button><div class="dk-dots" data-dots></div><span class="sp"></span>'+(sp.names&&sp.names.length?'<button type="button" class="dk-btn line sm" data-who>🎯 من يجيب؟</button>':'')+(T.mix?'<button type="button" class="dk-btn line sm" data-mix>🎨 الألوان</button>':'')+'<button type="button" class="dk-ib" data-full aria-label="ملء الشاشة">⛶</button></div><div class="dk-who" data-whoo hidden></div>';
  document.body.appendChild(root);document.body.style.overflow='hidden';var st=$('[data-st]',root);
  var w=sp.world&&D.WORLDS&&D.WORLDS[sp.world];if(w){root.classList.add('dw-on');root.classList.add(w.cls);var bg=document.createElement('div');bg.className='dw-bgs';bg.innerHTML=Object.keys(w.scenes).map(function(k){return '<div class="dw-bg" data-sc="'+k+'">'+w.scenes[k]()+'</div>';}).join('');root.insertBefore(bg,root.firstChild);}
  $('[data-dots]',root).innerHTML=S.map(function(s,k){return '<i data-dot="'+k+'" class="k-'+s.k+'" title="'+esc(s.title||s.k)+'"></i>';}).join('');
  function show(n,dir){clearInterval(ringT);i=Math.max(0,Math.min(S.length-1,n));var s=S[i],r=RENDER[s.k==='work'?'step':s.k]||RENDER.text;
   var html=r(s,sp,ctx);if(w&&D.worldSlide){var wr=D.worldSlide(w,s,sp,ctx,html);html=wr.html;root.setAttribute('data-scene',wr.scene);root.setAttribute('data-soft',wr.soft?'1':'0');}
   st.innerHTML='<div class="dk-slide k-'+s.k+(dir<0?' back':'')+'">'+html+'</div>';$('[data-n]',root).textContent=(i+1)+' / '+S.length;
   $$('[data-dot]',root).forEach(function(d,k){d.classList.toggle('on',k===i);d.classList.toggle('past',k<i);});$('[data-prog]',root).style.width=((i+1)/S.length*100)+'%';
   bindSlide(s);snd('tap');}
  function bindSlide(s){var sl=$('.dk-slide',st);
   if(RED)$$('.stp',sl).forEach(function(x){x.classList.add('shown');});
   var rg=$('[data-ring]',sl);if(rg){var tot=+rg.dataset.sec,left=tot,run=false;var fg=$('.fg',rg),lb=$('[data-rt]',rg),bt=$('[data-rgo]',rg);
     function paintR(){lb.textContent=fmt(left);fg.style.strokeDashoffset=(1-left/tot).toFixed(4);rg.classList.toggle('low',left<=60&&left>0);rg.classList.toggle('end',left<=0);}
     bt.onclick=function(e){e.stopPropagation();if(left<=0){left=tot;run=false;clearInterval(ringT);bt.textContent=T.start;paintR();return;}
       run=!run;bt.textContent=run?T.stop:T.cont;clearInterval(ringT);
       if(run){var end=Date.now()+left*1000;ringT=setInterval(function(){left=Math.max(0,Math.round((end-Date.now())/1000));paintR();if(left<=0){clearInterval(ringT);run=false;bt.textContent=T.again;chime();toast('انتهى وقت هذه الخطوة');}},500);}};paintR();
     if(o.autoTimer||s.auto){bt.click();}}
   var tp=$('[data-tips]',sl);if(tp){var k=0,sp2=$$('span',tp);if(sp2.length>1){var tt=setInterval(function(){if(!document.body.contains(tp)){clearInterval(tt);return;}sp2[k].classList.remove('on');k=(k+1)%sp2.length;sp2[k].classList.add('on');},5000);}}
   var gs=$('[data-gstart]',sl);if(gs){gs.addEventListener('click',function(){gs.hidden=true;var gb=$('[data-gbox]',sl);gb.hidden=false;var GD=G[s.game.k];if(GD)GD.run(gb,s.game,ctx);else gb.textContent='اللعبة غير متاحة';});}
   $$('[data-flipc]',sl).forEach(function(f){f.onclick=function(){f.classList.toggle('on');snd('tap');};});
   $$('[data-rev]',sl).forEach(function(b){b.onclick=function(){b.nextElementSibling.hidden=false;b.hidden=true;var c=b.parentNode,p=$('[data-lvp]',c);p.innerHTML=ctx.nt?'<small>من أجاب؟</small>'+ctx.sc.slice(0,ctx.nt).map(function(_,t){return '<button type="button" style="--tc:'+TEAMS[t][1]+'" data-lvt="'+t+'">'+TEAMS[t][0]+' +'+p.dataset.lvp+'</button>';}).join(''):'';};});
   $$('[data-lvt]',sl).forEach(function(){});
   var db=$('[data-dragb]',sl);if(db&&D.dragGame)D.dragGame(db,s.game,ctx,w);
   if(D.onSlide)D.onSlide(s,sl,ctx,w);
   if(s.k==='end')confetti(root,120);}
  st.addEventListener('click',function(e){var b=e.target.closest('[data-lvt]');if(b){var c=b.closest('.dk-lvc');addPts(ctx,+b.dataset.lvt,+c.querySelector('[data-lvp]').dataset.lvp);c.querySelector('[data-lvp]').innerHTML='<span class="good">⭐ أُضيفت النقاط</span>';}
   var s=e.target.closest('.stp:not(.shown)');if(s){s.classList.add('shown');}});
  function next(){if(i<S.length-1)show(i+1,1);}
  function prev(){if(i>0)show(i-1,-1);}
  function close(){clearInterval(clockT);clearInterval(ringT);document.removeEventListener('keydown',kd);root.remove();document.body.style.overflow='';try{if(document.fullscreenElement)document.exitFullscreen();}catch(e){}if(o.onClose)o.onClose(ctx.sc.slice(0,ctx.nt));}
  function kd(e){if(e.target.closest&&e.target.closest('input,textarea'))return;if(e.key==='Escape')close();else if(e.key==='ArrowLeft'||e.key===' '||e.key==='PageDown'){e.preventDefault();next();}else if(e.key==='ArrowRight'||e.key==='PageUp'){e.preventDefault();prev();}}
  document.addEventListener('keydown',kd);
  root.addEventListener('click',function(e){var t=e.target.closest('[data-x],[data-prev],[data-next],[data-full],[data-dot],[data-tm],[data-tmn],[data-who],[data-mix]');if(!t)return;
   if(t.dataset.x!=null)close();else if(t.dataset.prev!=null)prev();else if(t.dataset.next!=null)next();else if(t.dataset.dot!=null)show(+t.dataset.dot,0);
   else if(t.dataset.full!=null){try{if(document.fullscreenElement)document.exitFullscreen();else root.requestFullscreen();}catch(e2){}}
   else if(t.dataset.tm!=null)addPts(ctx,+t.dataset.tm,1);else if(t.dataset.tmn!=null){ctx.nt=ctx.nt>=4?0:ctx.nt+1;ctx.paint();toast(ctx.nt?('عدد الفرق: '+ctx.nt):'بلا فرق');}
   else if(t.dataset.who!=null){var w=$('[data-whoo]',root),nm=sp.names[Math.floor(Math.random()*sp.names.length)];w.hidden=false;w.innerHTML='<b>'+esc(nm)+'</b>';w.classList.remove('pop');void w.offsetWidth;w.classList.add('pop');win();setTimeout(function(){w.hidden=true;},3500);}
   else if(t.dataset.mix!=null){if(o.onMix)o.onMix();}});
  root.addEventListener('contextmenu',function(e){var t=e.target.closest('[data-tm]');if(t){e.preventDefault();addPts(ctx,+t.dataset.tm,-1);}});
  root.addEventListener('pointerdown',function(e){if(RED||e.target.closest('button,a,input,.dd-card,.dk-gbox,.dk-top,.dk-bar'))return;var r=root.getBoundingClientRect(),sp=document.createElement('i');sp.className='dk-splat';sp.style.left=(e.clientX-r.left)+'px';sp.style.top=(e.clientY-r.top)+'px';sp.style.setProperty('--sc',PAL[Math.floor(Math.random()*PAL.length)]);for(var q=0;q<7;q++){var d=document.createElement('b');d.style.setProperty('--a',(q*51+Math.random()*30)+'deg');d.style.setProperty('--d',(26+Math.random()*34)+'px');sp.appendChild(d);}root.appendChild(sp);setTimeout(function(){sp.remove();},900);});
  var tx=null;st.addEventListener('touchstart',function(e){tx=e.touches[0].clientX;},{passive:true});st.addEventListener('touchend',function(e){if(tx==null)return;var dx=e.changedTouches[0].clientX-tx;tx=null;if(Math.abs(dx)>70&&!e.target.closest('.dk-gbox')){if(dx>0)next();else prev();}});
  clockT=setInterval(function(){var c=$('[data-clock]',root);if(!c)return;var s=(Date.now()-started)/1000,m=(sp.minutes||40)*60;c.textContent='⏱ '+fmt(s)+' / '+(sp.minutes||40)+':00';c.classList.toggle('over',s>m);},1000);
  show(o.start||0,1);return {close:close,go:show};};

/* لعبة وحدها بملء الشاشة (مكتبة الألعاب) */
D.play=function(gm,o){o=o||{};var GD=G[gm.k];if(!GD)return;D.open({world:o.world,title:o.title||gm.t||GD.n,color:o.color,minutes:o.minutes||15,teams:o.teams==null?2:o.teams,names:o.names,slides:[{k:'game',game:gm,kicker:o.kicker||'مكتبة الألعاب'},{k:'end',title:'أحسنتم!'}]},o);};
})();
