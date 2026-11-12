/* =====================================================================
   عرض «نص الاستماع: الأساس الخالد» — اللغة العربية، الصف الثامن، المعلم أحمد أكبر علي الشيهاني
   عالم «رحلة المطار» (kit/deck/world-airport.js) ووجهة الرحلة «متحف عُمان عبر الزمان».
   الشرائح بترتيب طلب عيسى (2026-11-12)، وتسير وفق خطوات التحضير دون أن تكتب أدوار المعلم والطلبة.
   ===================================================================== */
(function(){
'use strict';
var D=window.DECK,A=D.AIR,W=D.WORLDS.airport;
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function $(s,r){return (r||document).querySelector(s);}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));}
function snd(k){try{if(window.DA&&DA.snd)DA.snd(k);}catch(e){}}
function toast(m){if(window.DA&&DA.toast)DA.toast(m);}
var PAL=['#5AA6E8','#F28B9B','#F2C14E','#6CC08B','#B08BE0','#F29E4C'];

/* ---------- عبارات الواجهة: معلم، ولغة عربية ---------- */
D.T.start='▶ ابدأ';D.T.cont='▶ تابع';D.T.again='↻ من جديد';D.T.stop='⏸ إيقاف';D.T.show='أظهر الإجابة';D.T.flip='اضغط لمعرفة المعنى';
D.T.tmTip='اضغط لإضافة نقطة، واضغط مطوّلًا للإنقاص';D.T.skip='تخطَّ السؤال ←';D.T.eyes='أحسنتم!';D.T.endT='تمَّ بحمد الله';D.T.mix=false;
var TM=[['الصقور','#C0392B'],['النخيل','#1E8A4C'],['القلاع','#B8862F'],['الأمواج','#1A7FA3']];TM.forEach(function(t,i){D.TEAMS[i]=t;});
D.GAMES.race.d='سؤال لكل جولة: اضغطوا الإجابة، والفريق الذي أجاب صحيحًا تتقدّم طائرته نحو خط الوصول';
D.GAMES.boxes.n='افتح الحقائب';D.GAMES.boxes.d='حقيبة لكل فريق بدوره، وفي كل حقيبة سؤال ونقاط مفاجئة';

/* ---------- نص الاستماع ---------- */
var TITLE='الأساسُ الخالد';
var TEXT=[
 'في قلبِ محافظةِ الداخليةِ، وعلى أرضِ ولايةِ مَنَح القريبةِ من مدينةِ نزوى، يقفُ صرحٌ حضاريٌّ شامخٌ يحكي قصّةَ عُمانَ عبرَ آلافِ السنين، إنّه «متحفُ عُمانَ عبرَ الزمان».',
 'ففي عامِ ألفينِ وخمسةَ عشرَ للميلاد، وضعَ السلطانُ قابوسُ بنُ سعيدٍ -طيّبَ اللهُ ثراه- حجرَ الأساسِ لهذا المتحف، ليكونَ أيقونةً لعصرِ النهضةِ، وذاكرةً حيّةً للوطن.',
 'وقد أُنشئَ المتحفُ ليعرّفَ الأجيالَ بالحِقَبِ التاريخيةِ التي مرّتْ بها عُمان، بدءًا من تشكّلِ أرضِها وحياةِ سكّانِها الأوائل، مرورًا بأمجادِها البحريةِ وحضارتِها العريقة، وصولًا إلى عصرِ النهضةِ، مع استشرافِ المستقبل.',
 'ويتكوّنُ المتحفُ من قاعتينِ رئيستين: قاعةِ التاريخِ، وقاعةِ عصرِ النهضة، يتنقّلُ فيهما الزائرُ بينَ المقتنياتِ النادرةِ والشاشاتِ التفاعليةِ والعروضِ المرئية، فيشعرُ كأنّه يسافرُ عبرَ الزمن.',
 'ولا يقتصرُ المتحفُ على قاعتَي العرض، بل يضمُّ مرافقَ معرفيةً أخرى تخدمُ زوّارَه، وقد صُمِّمَ مبناه ليكونَ صديقًا للبيئة.',
 'وفي عامِ ألفينِ وثلاثةٍ وعشرينَ للميلاد، افتتحَ جلالةُ السلطانِ هيثمُ بنُ طارقٍ -حفظَه الله- المتحفَ، فأصبحَ وجهةً يقصدُها المواطنونَ والزوّارُ من داخلِ عُمانَ وخارجِها.',
 'إنَّ هذا المتحفَ ليسَ مبنًى للعرضِ فحسب، بل هو أساسٌ خالدٌ يربطُ الماضيَ بالحاضر، ويغرسُ في نفوسِ الأبناءِ الاعتزازَ بتاريخِ وطنِهم وهويّتِه.'];
/* ما يُقرأ بالصوت الآلي (الأعوام بالأرقام تُقرأ أوضح كلمات) */
var SPEAK=TEXT;
var SHOW=TEXT.map(function(t){return t.replace('عامِ ألفينِ وخمسةَ عشرَ للميلاد','عامِ ٢٠١٥م').replace('عامِ ألفينِ وثلاثةٍ وعشرينَ للميلاد','عامِ ٢٠٢٣م');});
window.AHMAD={TITLE:TITLE,TEXT:SHOW};

/* ---------- الصوت: صوت آلي عربي، أو تسجيل المعلم المحفوظ على الجهاز ---------- */
var TTS={on:false,i:0,cb:null,voice:null};
function pickVoice(){try{var v=speechSynthesis.getVoices().filter(function(x){return /^ar/i.test(x.lang);});v.sort(function(a,b){return (/(Majed|Maged|Google|Hamed|Tarik|Laila|Mariam)/i.test(b.name)?1:0)-(/(Majed|Maged|Google|Hamed|Tarik|Laila|Mariam)/i.test(a.name)?1:0);});TTS.voice=v[0]||null;}catch(e){}}
try{if(window.speechSynthesis){pickVoice();speechSynthesis.onvoiceschanged=pickVoice;}}catch(e){}
function ttsStop(){TTS.on=false;try{speechSynthesis.cancel();}catch(e){}if(TTS.cb)TTS.cb(-1);}
function ttsPlay(cb){if(!window.speechSynthesis){toast('هذا المتصفح لا يدعم القراءة الآلية');return false;}ttsStop();TTS.on=true;TTS.cb=cb;TTS.i=0;
  if(!TTS.voice)pickVoice();
  (function say(){if(!TTS.on)return;if(TTS.i>=SPEAK.length){TTS.on=false;if(cb)cb(-1);return;}if(cb)cb(TTS.i);var u=new SpeechSynthesisUtterance(SPEAK[TTS.i]);u.lang='ar-SA';if(TTS.voice)u.voice=TTS.voice;u.rate=.86;
    u.onend=function(){TTS.i++;setTimeout(say,350);};u.onerror=function(){TTS.on=false;if(cb)cb(-1);};speechSynthesis.speak(u);})();
  if(!TTS.voice)toast('لم أجد صوتًا عربيًا على هذا الجهاز؛ يمكنك إضافة تسجيلك');return true;}
var REC={url:null,audio:null};
function idb(fn){try{var r=indexedDB.open('ahmad-deck',1);r.onupgradeneeded=function(){r.result.createObjectStore('f');};r.onsuccess=function(){fn(r.result);};r.onerror=function(){fn(null);};}catch(e){fn(null);}}
function recLoad(cb){idb(function(db){if(!db){cb&&cb();return;}try{var q=db.transaction('f').objectStore('f').get('rec');q.onsuccess=function(){if(q.result){REC.url=URL.createObjectURL(q.result);}cb&&cb();};q.onerror=function(){cb&&cb();};}catch(e){cb&&cb();}});}
function recSave(file,cb){REC.url=URL.createObjectURL(file);idb(function(db){if(db)try{db.transaction('f','readwrite').objectStore('f').put(file,'rec');}catch(e){}cb&&cb();});}
recLoad();
function stopAll(){ttsStop();if(REC.audio){try{REC.audio.pause();}catch(e){}REC.audio=null;}$$('.ah-player').forEach(function(p){p.classList.remove('play');});}

function player(id){return '<div class="ah-player" data-player="'+id+'"><div class="ah-tower"><svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="56" fill="#1F3A68"/><circle cx="60" cy="60" r="44" fill="#2E4F86"/><path d="M48 38 L86 60 L48 82z" fill="#F2C14E" class="pl"/><g class="pa" fill="#F2C14E"><rect x="44" y="40" width="10" height="40" rx="3"/><rect x="66" y="40" width="10" height="40" rx="3"/></g></svg></div>'+
 '<div class="ah-wave" aria-hidden="true">'+Array.apply(null,{length:22}).map(function(_,i){return '<i style="--i:'+i+'"></i>';}).join('')+'</div>'+
 '<div class="ah-pbtn"><button type="button" class="dk-btn gold" data-tts>🔊 استمعوا إلى النص</button><button type="button" class="dk-btn line sm" data-rec>🎧 تسجيل المعلم</button><input type="file" accept="audio/*" data-recf hidden></div></div>';}
function bindPlayer(sl,hl){var p=$('[data-player]',sl);if(!p)return;
  function mark(i){$$('[data-sen]',sl).forEach(function(e,k){e.classList.toggle('on',k===i);if(k===i){var tx=e.closest('[data-txt]');if(tx&&tx.scrollHeight>tx.clientHeight)tx.scrollTop=e.offsetTop-tx.offsetTop-20;}});if(i<0)p.classList.remove('play');}
  $('.ah-tower',p).onclick=function(){if(p.classList.contains('play')){stopAll();mark(-1);return;}if(REC.url)playRec();else $('[data-tts]',p).click();};
  $('[data-tts]',p).onclick=function(){if(p.classList.contains('play')&&TTS.on){stopAll();mark(-1);return;}stopAll();if(ttsPlay(hl?mark:function(i){if(i<0)p.classList.remove('play');}))p.classList.add('play');};
  function playRec(){stopAll();var a=new Audio(REC.url);REC.audio=a;p.classList.add('play');a.onended=function(){p.classList.remove('play');};a.play().catch(function(){p.classList.remove('play');toast('تعذّر تشغيل التسجيل');});}
  var f=$('[data-recf]',p),rb=$('[data-rec]',p);
  function lbl(){rb.textContent=REC.url?'🎧 شغّل تسجيلك':'🎧 أضف تسجيلك';}lbl();
  rb.onclick=function(){if(REC.url)playRec();else f.click();};
  rb.oncontextmenu=function(e){e.preventDefault();f.click();};
  f.onchange=function(){var x=f.files&&f.files[0];if(!x)return;recSave(x,function(){lbl();toast('حُفظ التسجيل على هذا الجهاز');playRec();});};}

/* ---------- مشهد الوجهة: داخل متحف عُمان عبر الزمان ---------- */
function museum(){var s='<svg class="dw-scene" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>'+
 '<linearGradient id="amW" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6EEE3"/><stop offset="1" stop-color="#E9DCC8"/></linearGradient>'+
 '<linearGradient id="amCu" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#D9935A"/><stop offset="1" stop-color="#9C5A2C"/></linearGradient>'+
 '<linearGradient id="amF" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D8C6AE"/><stop offset="1" stop-color="#BFA888"/></linearGradient>'+
 '<linearGradient id="amL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF6D8" stop-opacity=".8"/><stop offset="1" stop-color="#FFF6D8" stop-opacity="0"/></linearGradient>'+
 '<linearGradient id="amG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#DFF2FB" stop-opacity=".65"/><stop offset="1" stop-color="#BFE3F3" stop-opacity=".35"/></linearGradient></defs>'+
 '<rect width="1600" height="900" fill="url(#amW)"/>'+
 /* سقف نحاسي مائل كمبنى المتحف */
 '<path d="M0 0 H1600 V120 L1100 210 L800 150 L480 220 L0 130z" fill="url(#amCu)"/><g stroke="#B9763F" stroke-width="2" opacity=".6">'+[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(function(i){return '<path d="M'+(i*110)+' 0 L'+(i*110-60)+' 200"/>';}).join('')+'</g>'+
 '<path d="M480 220 L800 150 L1100 210" fill="none" stroke="#F2C14E" stroke-width="4" opacity=".8"/>'+
 [300,800,1300].map(function(x){return '<path d="M'+(x-20)+' 190 L'+(x-170)+' 720 H'+(x+170)+' L'+(x+20)+' 190Z" fill="url(#amL)" class="dw-spot"/>';}).join('')+
 /* جدار الزمن */
 '<rect x="120" y="270" width="1360" height="70" rx="12" fill="#1F3A68" opacity=".92"/><path d="M160 305 H1440" stroke="#F2C14E" stroke-width="5"/>'+[0,1,2,3,4,5,6].map(function(i){return '<circle cx="'+(200+i*200)+'" cy="305" r="12" fill="'+PAL[i%PAL.length]+'" stroke="#fff" stroke-width="4"/>';}).join('')+
 /* واجهات العرض */
 '<g transform="translate(150 420)"><rect width="300" height="230" rx="10" fill="url(#amG)" stroke="#9BB7C9" stroke-width="4"/><rect y="230" width="300" height="70" fill="#7A5236"/>'+
   '<path d="M40 190 Q150 215 260 190 L240 205 H60z" fill="#8A5A2B"/><path d="M150 60 V188 M150 60 L235 170 H150 M150 75 L80 170 H150" stroke="#5E3B1C" stroke-width="5" fill="#FFF3DC"/></g>'+
 '<g transform="translate(650 440)"><rect width="300" height="210" rx="10" fill="url(#amG)" stroke="#9BB7C9" stroke-width="4"/><rect y="210" width="300" height="90" fill="#7A5236"/>'+
   '<path d="M110 60 q-8 40 30 70 q20 18 6 40 q30 -10 26 -40 q-4 -24 -30 -40 q-14 -10 -32 -30z" fill="#C9962F" stroke="#7A5A1C" stroke-width="4"/><rect x="136" y="26" width="22" height="40" rx="6" fill="#8A5A2B"/><circle cx="147" cy="26" r="12" fill="#C9962F"/></g>'+
 '<g transform="translate(1150 420)"><rect width="300" height="230" rx="10" fill="url(#amG)" stroke="#9BB7C9" stroke-width="4"/><rect y="230" width="300" height="70" fill="#7A5236"/>'+
   '<circle cx="150" cy="120" r="70" fill="#D9C3A0" stroke="#9C7A4B" stroke-width="5"/><path d="M150 120 m0 -10 a10 10 0 1 1 -10 10 a22 22 0 1 1 22 22 a36 36 0 1 1 -36 -36 a50 50 0 1 1 50 50" fill="none" stroke="#8A6A3B" stroke-width="5"/></g>'+
 '<rect y="720" width="1600" height="180" fill="url(#amF)"/>'+[0,1,2,3,4,5,6,7].map(function(i){return '<path d="M'+(i*230)+' 720 L'+(i*230-140)+' 900" stroke="#B59C7B" stroke-width="2"/>';}).join('')+
 '<rect x="0" y="712" width="1600" height="12" fill="#9C7A55"/></svg>';return s;}
W.scenes.gallery=museum;

/* ---------- محدد الرقم العشوائي (١–١٣) ---------- */
var AR='٠١٢٣٤٥٦٧٨٩';function ar(n){return String(n).replace(/\d/g,function(d){return AR[d];});}
function picker(){return '<div class="ah-pick" data-pick><button type="button" class="dk-btn gold sm" data-pickgo>🎲 رقم المسافر</button><b data-pickn>؟</b></div>';}
function bindPick(sl){$$('[data-pick]',sl).forEach(function(p){var b=$('[data-pickgo]',p),n=$('[data-pickn]',p);b.onclick=function(){var k=0,t=setInterval(function(){n.textContent=ar(1+Math.floor(Math.random()*13));snd('tap');if(++k>14){clearInterval(t);n.classList.remove('pop');void n.offsetWidth;n.classList.add('pop');snd('ok');}},70);};});}
function ring(min){return '<div class="dk-ring ah-ring" data-ring data-sec="'+Math.round(min*60)+'"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" class="bg"/><circle cx="60" cy="60" r="52" class="fg" pathLength="1"/></svg><div class="dk-rt"><b data-rt>'+min+':00</b><button type="button" data-rgo>'+D.T.start+'</button></div></div>';}

/* ---------- الشرائح الخاصة بالدرس ---------- */
var S=A.slides={},B=A.bind={};
/* ٣) قواعد الاستماع */
var RULE_ART=[
 '<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="54" fill="#FDE6EA"/><path d="M44 36 q24 -16 40 6 q10 16 -6 30 q-10 8 -8 20 q-2 12 -16 10" fill="none" stroke="#1F3A68" stroke-width="7" stroke-linecap="round"/><path d="M56 56 q8 -10 16 0" fill="none" stroke="#1F3A68" stroke-width="6" stroke-linecap="round"/><rect x="22" y="76" width="34" height="22" rx="8" fill="#F2C14E"/><path d="M30 98 l-4 10 l12 -10z" fill="#F2C14E"/><path d="M30 87 h18" stroke="#1F3A68" stroke-width="4" stroke-linecap="round"/><path d="M18 70 L60 104" stroke="#E4572E" stroke-width="7" stroke-linecap="round"/></svg>',
 '<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="54" fill="#E3F1FC"/><circle cx="62" cy="30" r="11" fill="#1F3A68"/><path d="M62 42 V74 H84 V100" fill="none" stroke="#1F3A68" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><path d="M62 52 L80 62" stroke="#1F3A68" stroke-width="7" stroke-linecap="round"/><path d="M40 40 V100 M40 76 H88 M88 76 V100" stroke="#B8862F" stroke-width="7" stroke-linecap="round"/></svg>',
 '<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="54" fill="#E6F6EC"/><path d="M50 30 q30 -10 38 18 q4 18 -12 28 q-8 6 -8 16 q-2 14 -18 12" fill="none" stroke="#1F3A68" stroke-width="7" stroke-linecap="round"/><path d="M58 50 q8 -8 14 2" fill="none" stroke="#1F3A68" stroke-width="6" stroke-linecap="round"/><g fill="none" stroke="#2E9E6B" stroke-width="5" stroke-linecap="round" class="ah-sw"><path d="M30 48 q-8 12 0 24"/><path d="M20 40 q-14 20 0 40"/></g></svg>'];
var RULES=['أسمعُ ولا أقاطعُ المتحدّثَ','أجلسُ جلسةً صحيحةً','أستمعُ وأُنصِتُ'];
S.rules=function(s){return {scene:'room',html:'<div class="ah-rules">'+A.sign('تعليمات الرحلة: قواعد الاستماع')+'<div class="ah-rg">'+RULES.map(function(r,i){return '<button type="button" class="ah-rule" data-rule style="--i:'+i+';--rc:'+PAL[i]+'"><span class="art">'+RULE_ART[i]+'</span><b>'+esc(r)+'</b><span class="stamp">✈ موافق</span></button>';}).join('')+'</div><p class="aw-hint">اضغطوا كل قاعدة لنختم عليها معًا</p></div>'};};
B.rules=function(s,sl,ctx){var r=$$('[data-rule]',sl);r.forEach(function(b){b.onclick=function(){if(b.classList.contains('ok'))return;b.classList.add('ok');snd('ok');if(r.every(function(x){return x.classList.contains('ok');})){D.confetti(sl.closest('.dk'),50);toast('جاهزون للإقلاع ✈');}};});};

/* ٤) الاستماع الأول */
var FOCUS=['واضعُ حجرِ الأساسِ للمتحف','موقعُ المتحف','الهدفُ من إنشاءِ المتحف','التواريخُ المذكورةُ في النص','من كم قاعةً يتكوّنُ المتحف؟'];
S.listen1=function(s){return {scene:'room',html:'<div class="ah-l1">'+A.sign('الاستماع الأول: استعدّوا للإقلاع')+'<div class="ah-l1g"><div class="ah-l1p">'+player('l1')+'<div class="ah-l1t"><small>نص الاستماع</small><b>'+esc(TITLE)+'</b></div></div>'+
  '<div class="ah-l1f"><h3>استمعوا إلى النص مع التركيز على:</h3><div class="ah-tags">'+FOCUS.map(function(f,i){return '<div class="ah-tagw" style="--i:'+i+'">'+A.tag(i+1,f)+'</div>';}).join('')+'</div></div>'+ring(5)+'</div></div>'};};
B.listen1=function(s,sl){bindPlayer(sl,false);};

/* ٥) صور المتحف ونص الاستماع فيها */
var PICS=[['img/museum-1.jpg','متحف عُمان عبر الزمان في ولاية مَنَح'],['img/museum-2.jpg','زاوية من المبنى (تصوير: AhmedMRH، ويكيميديا، CC BY-SA 4.0)'],['svg:hall','داخل قاعات المتحف']];
function hallArt(){return '<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">'+museum().replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'')+'</svg>';}
S.museum=function(s){return {scene:'gallery',html:'<div class="ah-mus">'+A.sign('وصلنا إلى المتحف: الاستماع الثاني')+'<div class="ah-frame" data-frame><div class="ph" data-ph></div><div class="glass"><div class="gh"><h3>'+esc(TITLE)+'</h3><div class="ah-mini">'+player('l2')+'</div></div><div class="txt" data-txt>'+SHOW.map(function(t,i){return '<span data-sen="'+i+'">'+esc(t)+'</span> ';}).join('')+'</div></div>'+
  '<div class="thumbs">'+PICS.map(function(p,i){return '<button type="button" data-thumb="'+i+'" class="'+(i?'':'on')+'" aria-label="'+esc(p[1])+'">'+(p[0].indexOf('svg:')===0?hallArt():'<img src="'+p[0]+'" alt="">')+'</button>';}).join('')+'<button type="button" class="aa" data-aa title="حجم الخط">Aa</button></div><small class="cap" data-cap></small></div>'+
  '</div>'};};
B.museum=function(s,sl){bindPlayer(sl,true);var ph=$('[data-ph]',sl),cap=$('[data-cap]',sl),fr=$('[data-frame]',sl);
  function set(i){var p=PICS[i];ph.innerHTML=p[0].indexOf('svg:')===0?hallArt():'<img src="'+p[0]+'" alt="'+esc(p[1])+'">';cap.textContent=p[1];$$('[data-thumb]',sl).forEach(function(t,k){t.classList.toggle('on',k===i);});}
  set(0);$$('[data-thumb]',sl).forEach(function(t){t.onclick=function(){set(+t.dataset.thumb);snd('tap');};});
  var z=0;$('[data-aa]',sl).onclick=function(){z=(z+1)%3;fr.setAttribute('data-z',z);};};

/* ٦) الفكرة العامة */
var IDEAS=[['التعريفُ بمتحفِ عُمانَ عبرَ الزمان: نشأتِه وموقعِه وأهدافِه ومكوّناتِه',1],['رحلةٌ سياحيةٌ إلى قلعةِ نزوى التاريخية',0],['الحديثُ عن صناعةِ السفنِ العُمانية قديمًا',0]];
S.idea=function(s){return {scene:'gallery',html:'<div class="ah-idea">'+A.sign('ما الفكرةُ العامّةُ للنص؟')+'<div class="ah-q"><span class="ic">💭</span><p>عمَّ يتحدّثُ النصُّ الذي استمعنا إليه؟ فكّروا، ثم اختاروا الرحلةَ الصحيحة.</p></div>'+
  '<div class="ah-fb"><div class="hd"><span>الرحلة</span><span>الوجهة</span><span>الحالة</span></div>'+IDEAS.map(function(x,i){return '<button type="button" class="row" data-idea="'+x[1]+'" style="--i:'+i+'"><span class="fl">OM-'+(81+i)+'</span><span class="ds">'+esc(x[0])+'</span><span class="st">في الانتظار</span></button>';}).join('')+'</div></div>'};};
B.idea=function(s,sl,ctx){$$('[data-idea]',sl).forEach(function(b){b.onclick=function(){if(b.classList.contains('go')||b.classList.contains('no'))return;var ok=b.dataset.idea==='1',st=$('.st',b);
  if(ok){b.classList.add('go');st.textContent='✈ أقلعت';snd('ok');D.confetti(sl.closest('.dk'),60);D._.teamPick(ctx,function(t){D._.addPts(ctx,t,2);});}else{b.classList.add('no');st.textContent='⛔ أُلغيت';snd('tap');}};});};

/* ٧) الخريطة الذهنية */
var MAP=[['موقعُ المتحف','ولايةُ مَنَح في محافظةِ الداخلية','📍'],['الهدفُ من إنشائه','التعريفُ بتاريخِ عُمانَ عبرَ حِقَبِه، من تشكّلِ الأرضِ إلى عصرِ النهضة','🎯'],['واضعُ حجرِ الأساس','السلطانُ قابوسُ بنُ سعيدٍ -طيّبَ اللهُ ثراه-','🧱'],['من كم قاعةً يتكوّن؟','قاعتان: قاعةُ التاريخِ، وقاعةُ عصرِ النهضة','🏛️']];
S.map=function(s){var cards=MAP.map(function(m,i){return [m[1],i];}).sort(function(){return Math.random()-.5;});
  return {scene:'gallery',html:'<div class="ah-map">'+A.sign('أستنتجُ في خريطةٍ ذهنية')+'<div class="aw-hint">اسحبوا كل بطاقة إلى فرعها، أو اضغطوها ثم اضغطوا الفرع</div><div class="ah-mm" data-mm>'+
   '<svg class="ln" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M50 50 L18 20 M50 50 L82 20 M50 50 L18 80 M50 50 L82 80"/></svg>'+
   '<div class="core"><span>🏛️</span><b>متحفُ عُمانَ عبرَ الزمان</b></div>'+MAP.map(function(m,i){return '<div class="br b'+i+'" data-br="'+i+'" style="--bc:'+PAL[i]+'"><span class="q"><i>'+m[2]+'</i>'+esc(m[0])+'</span><span class="z" data-z></span></div>';}).join('')+'</div>'+
   '<div class="ah-cards" data-cards>'+cards.map(function(c,k){return '<button type="button" class="ah-card" data-card="'+c[1]+'" style="--i:'+k+'">'+esc(c[0])+'</button>';}).join('')+'</div></div>'};};
function dnd(sl,cardSel,binSel,onDrop){var root=sl,drag=null,sel=null;
  root.addEventListener('pointerdown',function(e){var c=e.target.closest(cardSel);if(!c||c.disabled)return;drag={c:c,x:e.clientX,y:e.clientY,m:false};try{c.setPointerCapture(e.pointerId);}catch(er){}c.classList.add('drag');});
  root.addEventListener('pointermove',function(e){if(!drag)return;var dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>6)drag.m=true;if(drag.m){e.preventDefault();drag.c.style.transform='translate('+dx+'px,'+dy+'px) rotate(2deg) scale(1.04)';}
   $$(binSel,root).forEach(function(b){var r=b.getBoundingClientRect();b.classList.toggle('over',e.clientX>r.left&&e.clientX<r.right&&e.clientY>r.top&&e.clientY<r.bottom);});});
  function up(e){if(!drag)return;var c=drag.c,m=drag.m;drag=null;c.classList.remove('drag');c.style.transform='';var bin=$$(binSel,root).filter(function(b){var r=b.getBoundingClientRect();return e.clientX>r.left&&e.clientX<r.right&&e.clientY>r.top&&e.clientY<r.bottom;})[0];$$(binSel,root).forEach(function(b){b.classList.remove('over');});
   if(m){if(bin)onDrop(c,bin);return;}if(sel)sel.classList.remove('sel');sel=c;c.classList.add('sel');snd('tap');}
  root.addEventListener('pointerup',up);root.addEventListener('pointercancel',up);
  root.addEventListener('click',function(e){var b=e.target.closest(binSel);if(b&&sel&&!sel.disabled){var c=sel;sel.classList.remove('sel');sel=null;onDrop(c,b);}});}
B.map=function(s,sl,ctx){var left=MAP.length;dnd(sl,'.ah-card','[data-br]',function(c,b){if(c.dataset.card===b.dataset.br){c.disabled=true;c.classList.add('done');$('[data-z]',b).appendChild(c);b.classList.add('ok');snd('ok');if(!--left){setTimeout(function(){D.confetti(sl.closest('.dk'),70);toast('اكتملت الخريطة الذهنية!');for(var t=0;t<ctx.nt;t++)ctx.sc[t]+=1;ctx.paint();},300);}}
  else{b.classList.remove('shake');void b.offsetWidth;b.classList.add('shake');snd('tap');}});};

/* ٨) جدول الأعوام */
var YEARS=[['٢٠١٥م','وضعُ حجرِ الأساسِ لمتحفِ عُمانَ عبرَ الزمان'],['٢٠٢٣م','افتتاحُ المتحفِ في عهدِ جلالةِ السلطانِ هيثمَ بنِ طارق']];
S.years=function(s){return {scene:'gallery',html:'<div class="ah-yr">'+A.sign('لوحة الرحلات: ماذا حدث في هذه السنوات؟')+'<div class="ah-yrg"><div class="ah-board"><div class="hd"><span>السنة</span><span>الحدث</span></div>'+YEARS.map(function(y,i){return '<div class="row" style="--i:'+i+'"><span class="yr">'+y[0]+'</span><button type="button" class="ev" data-flap><span class="f">'+'<i>؟</i><i>؟</i><i>؟</i><i>؟</i>'+'</span><span class="bk">'+esc(y[1])+'</span></button></div>';}).join('')+'</div>'+
  '<div class="ah-yrs"><p class="ah-ask">✍️ اكتب حدثًا مناسبًا حصل في كل سنة، ثم اقلب اللوحة لنتأكد.</p>'+picker()+'</div></div></div>'};};
B.years=function(s,sl){bindPick(sl);$$('[data-flap]',sl).forEach(function(b){b.onclick=function(){b.classList.toggle('on');snd('tap');};});};

/* مفردات الرحلة */
var VOC=[['حجرُ الأساس','أوّلُ حجرٍ يوضَعُ إيذانًا ببدءِ بناءِ مبنًى مهمّ.'],['صرحٌ','بناءٌ عالٍ ضخمٌ.'],['أيقونةٌ','رمزٌ مميّزٌ يُعرَفُ به الشيءُ.'],['الحِقَبُ','جمعُ حِقبة، وهي مدّةٌ طويلةٌ من الزمن.'],['استشرافُ المستقبل','التطلّعُ إليه والتفكيرُ فيه.'],['المقتنياتُ','الأشياءُ النفيسةُ التي تُجمَعُ وتُحفَظ.']];
S.vocab=function(s){return {scene:'gallery',html:'<div class="ah-voc">'+A.sign('مفرداتُ الرحلة: أختامُ جواز السفر')+'<div class="aw-hint">اكتشفوا معنى الكلمة من سياقها في النص، ثم اقلبوا البطاقة</div><div class="ah-vg">'+VOC.map(function(v,i){return '<button type="button" class="ah-vc" data-vc style="--i:'+i+';--vc:'+PAL[i%PAL.length]+'"><span class="f"><i class="st">'+A.plane()+'</i><b>'+esc(v[0])+'</b><small>ما معناها؟</small></span><span class="bk"><b>'+esc(v[0])+'</b>'+esc(v[1])+'</span></button>';}).join('')+'</div></div>'};};
B.vocab=function(s,sl){$$('[data-vc]',sl).forEach(function(b){b.onclick=function(){b.classList.toggle('on');snd('tap');};});};

/* ٩) السرد */
var STOPS=[['📍','أين؟'],['🧱','٢٠١٥م'],['🎯','لماذا؟'],['🏛️','القاعتان'],['✂️','٢٠٢٣م'],['💛','رسالة النص']];
var LINK=['في البداية','ثُمَّ','بعدَ ذلك','وفي عامِ…','وفي الختام'];
var CHECK=['أرتّبُ الأحداثَ كما وردتْ','أتحدّثُ بالعربيةِ الفصيحة','صوتي واضحٌ، وأنظرُ إلى زملائي','أعبّرُ بأسلوبي الخاص'];
S.narrate=function(s){return {scene:'gallery',html:'<div class="ah-nr">'+A.sign('حكايتُنا: أسردُ النصَّ بأسلوبي')+'<div class="ah-route">'+STOPS.map(function(x,i){return '<div class="stop" style="--i:'+i+';--sc:'+PAL[i%PAL.length]+'"><span class="ic">'+x[0]+'</span><b>'+esc(x[1])+'</b></div>';}).join('<i class="dash">'+A.plane()+'</i>')+'</div>'+
  '<div class="ah-nrg"><div class="ah-links"><h3>كلماتٌ تربطُ حكايتي</h3><div>'+LINK.map(function(l){return '<span>'+esc(l)+'</span>';}).join('')+'</div></div><div class="ah-chk"><h3>الراوي المتميّز</h3>'+CHECK.map(function(c){return '<button type="button" data-chk>'+esc(c)+'</button>';}).join('')+'</div><div class="ah-nrs">'+picker()+ring(6)+'</div></div></div>'};};
B.narrate=function(s,sl){bindPick(sl);$$('[data-chk]',sl).forEach(function(b){b.onclick=function(){b.classList.toggle('on');snd(b.classList.contains('on')?'ok':'tap');};});};

/* محطة التأمل (التقويم الختامي والعلاجي والإثرائي) */
S.think=function(s){return {scene:'gallery',html:'<div class="ah-th">'+A.sign('محطةُ التأمّل')+'<div class="ah-thg">'+
  '<div class="ah-tc" style="--i:0;--tc:#6CC08B"><span class="lv">⭐</span><h3>أكملْ:</h3><p>يقعُ المتحفُ في ولايةِ <button type="button" class="gap" data-gap="مَنَح">……</button> بمحافظةِ الداخلية.</p><p>الهدفُ من إنشاءِ المتحفِ هو <button type="button" class="gap" data-gap="التعريفُ بتاريخِ عُمانَ وحِقَبِه">……</button>.</p></div>'+
  '<div class="ah-tc" style="--i:1;--tc:#5AA6E8"><span class="lv">⭐⭐</span><h3>ما أهمّيةُ المحافظةِ على تاريخِ الوطنِ وتراثِه للأجيالِ القادمة؟</h3><div class="ah-mic">🎤 نتحاور</div></div>'+
  '<div class="ah-tc" style="--i:2;--tc:#B08BE0"><span class="lv">⭐⭐⭐</span><h3>تخيّلْ أنّك مسؤولٌ عن متحفٍ وطني: ما أهمُّ ثلاثةِ أشياءَ ستختارُ عرضَها فيه؟ ولماذا؟</h3><div class="ah-cases"><i>١</i><i>٢</i><i>٣</i></div></div></div>'+picker()+'</div>'};};
B.think=function(s,sl){bindPick(sl);$$('[data-gap]',sl).forEach(function(b){b.onclick=function(){b.textContent=b.dataset.gap;b.classList.add('on');snd('ok');};});
  $$('.ah-cases i',sl).forEach(function(c){c.onclick=function(){c.classList.toggle('on');snd('tap');};});};

/* ١٠) الواجب */
S.home=function(s){return {scene:'room',html:'<div class="ah-hw">'+A.sign('الواجبُ المنزلي: بطاقةٌ بريديةٌ من المتحف')+'<div class="ah-post"><div class="pic"><img src="img/museum-1.jpg" alt=""><span>تحيّةٌ من متحفِ عُمانَ عبرَ الزمان</span></div><div class="msg"><i class="stp">🇴🇲</i><p>اكتبْ ثلاثةَ أسطرٍ توضّحُ فيها أهمّيةَ المتاحفِ في المحافظةِ على تاريخِ الوطنِ وهويّتِه.</p><i class="ln"></i><i class="ln"></i><i class="ln"></i></div></div></div>'};};

/* ---------- العرض ---------- */
function spec(){return {world:'airport',title:'نص الاستماع: الأساس الخالد',color:'#1F3A68',minutes:40,teams:2,names:Array.apply(null,{length:13}).map(function(_,i){return 'المسافر رقم '+ar(i+1);}),
 slides:[
  {k:'cover',title:'نصُّ الاستماع: الأساسُ الخالد',sub:'المعلم: أحمد أكبر علي الشيهاني',code:'8',chips:['اللغة العربية','الصف الثامن']},
  {k:'goals',title:'تذاكرُ رحلتِنا: أهدافُ الدرس',items:[['أستمعُ إلى نصِّ الاستماعِ مرّتين بانتباه.'],['أحدّدُ الفكرةَ العامّةَ للنص.'],['أستنتجُ موقعَ المتحفِ والهدفَ من إنشائه.'],['أرتّبُ الأحداثَ المرتبطةَ بكلِّ عامٍ ترتيبًا زمنيًّا صحيحًا.'],['أوضّحُ معانيَ المفرداتِ الجديدةِ في النص.'],['أسردُ النصَّ شفويًّا بأسلوبي الخاصّ بلغةٍ عربيةٍ فصيحة.']]},
  {k:'rules',title:'قواعد الاستماع'},
  {k:'drag',title:'المستمعُ الجيّد: يصعدُ الطائرةَ أم لا؟',hint:'اسحبوا كل بطاقة إلى مكانها، أو اضغطوها ثم اضغطوا المكان',game:{bins:['✈️ يصعدُ الطائرة','⛔ يبقى في المطار'],doneMsg:'الركّابُ جاهزون، هيّا نستمع!',max:8,
    items:[['أنظرُ إلى المتحدّث',0],['أُنصتُ حتى النهاية',0],['أدوّنُ الكلماتِ المهمّة',0],['أجلسُ معتدلًا',0],['أقاطعُ زميلي',1],['أتحدّثُ مع جاري',1],['أعبثُ بأدواتي',1],['أنشغلُ بالنظرِ من النافذة',1]]}},
  {k:'listen1',title:'الاستماع الأول'},
  {k:'museum',title:'صور المتحف ونص الاستماع'},
  {k:'idea',title:'الفكرة العامة'},
  {k:'map',title:'الخريطة الذهنية'},
  {k:'years',title:'الأحداث والسنوات'},
  {k:'vocab',title:'المفردات الجديدة'},
  {k:'game',kicker:'مسابقة الرحلة',game:{k:'boxes',t:'افتح الحقائب: مسابقة الرحلة',q:[
    ['ما الموضوعُ الرئيسُ الذي يتحدّثُ عنه النص؟','متحفُ عُمانَ عبرَ الزمان',['قلعةُ نزوى','الأسطولُ البحريُّ العُماني']],
    ['أين يقعُ المتحف؟','ولايةُ مَنَح بمحافظةِ الداخلية',['ولايةُ صور','مدينةُ صلالة']],
    ['ما الهدفُ من إنشاءِ المتحف؟','التعريفُ بالحِقَبِ التاريخيةِ لعُمان',['بيعُ التحفِ القديمة','إقامةُ المسابقاتِ الرياضية']],
    ['في أيِّ عامٍ وُضعَ حجرُ الأساسِ للمتحف؟','٢٠١٥م',['٢٠٢٠م','٢٠٢٣م']],
    ['في أيِّ عامٍ افتُتحَ المتحف؟','٢٠٢٣م',['٢٠١٥م','٢٠١٩م']],
    ['من كم قاعةً رئيسةً يتكوّنُ المتحف؟','قاعتين',['ثلاثِ قاعات','خمسِ قاعات']],
    ['من وضعَ حجرَ الأساسِ للمتحف؟','السلطانُ قابوسُ بنُ سعيد',['السلطانُ هيثمُ بنُ طارق','وزيرُ التراث']],
    ['ما معنى «أيقونة»؟','رمزٌ مميّزٌ يُعرَفُ به الشيء',['بناءٌ قديمٌ مهدَّم','صورةٌ صغيرةٌ ملوّنة']],
    ['لماذا وُصفَ المتحفُ بأنّه «أساسٌ خالد»؟','لأنّه يربطُ الماضيَ بالحاضرِ ويغرسُ الاعتزازَ بالوطن'],
    ['بمَ يشعرُ الزائرُ وهو يتنقّلُ بين قاعاتِ المتحف؟','كأنّه يسافرُ عبرَ الزمن']]}},
  {k:'game',kicker:'تحدّي المطابقة',game:{k:'match',t:'وجدتُها! طابقْ كلَّ معلومةٍ بما يناسبها',pairs:[['وضعُ حجرِ الأساس','٢٠١٥م'],['افتتاحُ المتحف','٢٠٢٣م'],['موقعُ المتحف','ولايةُ مَنَح'],['عددُ القاعاتِ الرئيسة','قاعتان'],['الصرح','بناءٌ عالٍ ضخم'],['الحِقَب','مُددٌ طويلةٌ من الزمن']]}},
  {k:'narrate',title:'السرد'},
  {k:'think',title:'محطة التأمل'},
  {k:'home',title:'الواجب المنزلي'},
  {k:'end',title:'تمَّ بحمدِ الله',sub:'شكرًا لكم، وإلى رحلةٍ قادمة ✈'}]};}
window.AHMAD.open=function(start){stopAll();D.open(spec(),{start:start||0,onClose:stopAll});};
})();
