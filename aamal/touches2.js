/* =====================================================================
   اللمسات الخمسون الثانية (77–100) · مستقلة عن المحرك، تستعمل DA إن وُجد
   خيارات window.TOUCH_OPT: quotes (مصفوفة حِكَم)، title (اسم المنصة لعنوان التبويب)، brand (محدد الشعار)
   ===================================================================== */
(function(){
'use strict';
var O=window.TOUCH_OPT||{},DA=window.DA||{},RM=matchMedia('(prefers-reduced-motion: reduce)').matches,FINE=matchMedia('(hover:hover) and (pointer:fine)').matches;
function $(s,r){return (r||document).querySelector(s);}function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));}
function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v);}catch(e){}}
function toast(m){if(DA.toast)DA.toast(m);}
var lastPt={x:innerWidth/2,y:innerHeight/2};document.addEventListener('pointerdown',function(e){lastPt={x:e.clientX,y:e.clientY};},true);

/* (77) انتقال ألوان ناعم وخفيف عند تغيير الثيم (بلا لقطة للصفحة كي لا تتعلّق) */
if(DA.setSkin){var _set=DA.setSkin,thT=0;DA.setSkin=function(k){var h=document.documentElement;h.classList.add('t2-theming');_set(k);clearTimeout(thT);thT=setTimeout(function(){h.classList.remove('t2-theming');},650);};}

/* (78) عنوان التبويب يتبع القسم */
var baseTitle=O.title||document.title;
function setTitle(){var a=$('.nav a.on'),t=a?a.textContent.trim():'';document.title=t&&!/^الرئيسية/.test(t)?t+' · '+baseTitle:baseTitle;}
/* (79) الحقل المطلوب الفارغ يهتز برفق عند الحفظ */
document.addEventListener('invalid',function(e){var f=e.target;if(!f.classList)return;f.classList.remove('t2-shake');void f.offsetWidth;f.classList.add('t2-shake');setTimeout(function(){f.classList.remove('t2-shake');},600);},true);
/* (80) لمس القسم المفتوح في القائمة يعيد إلى الأعلى، و(81) لمس اسم المنصة كذلك */
document.addEventListener('click',function(e){var a=e.target.closest('.nav a.on,.tabbar a.on');if(a&&scrollY>200){e.preventDefault();scrollTo({top:0,behavior:RM?'auto':'smooth'});return;}
  if(e.target.closest(O.brand||'.brand')&&scrollY>200)scrollTo({top:0,behavior:RM?'auto':'smooth'});});
/* (82) ترحيب عند العودة بعد غياب */
var hidAt=0;document.addEventListener('visibilitychange',function(){document.body.classList.toggle('t-hidden',document.hidden);/* (75) */
  if(document.hidden)hidAt=Date.now();else if(hidAt&&Date.now()-hidAt>30*60000){toast('مرحبًا بعودتك، '+(DA.greet?DA.greet():'أهلًا')+'');hidAt=0;}});

/* (83) تحية الأيام، و(85) المناسبات الهجرية، و(84) خيط العيد الوطني */
function hijri(){try{var f=new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn',{day:'numeric',month:'numeric'}).formatToParts(new Date()),o={};f.forEach(function(p){o[p.type]=+p.value;});return o;}catch(e){return null;}}
function occasion(){var d=new Date(),wd=d.getDay(),m=d.getMonth()+1,dd=d.getDate(),h=hijri();
  if(m===11&&dd>=18&&dd<=20)return {t:'عيد وطني مجيد',nat:1};
  if(h){if(h.month===9)return {t:'رمضان كريم'};if(h.month===10&&h.day<=3)return {t:'عيد فطر سعيد'};if(h.month===12&&h.day>=10&&h.day<=13)return {t:'عيد أضحى مبارك'};if(h.month===1&&h.day===1)return {t:'عام هجري سعيد'};}
  if(wd===5)return {t:'جمعة مباركة'};if(wd===0)return {t:'أسبوع موفّق'};if(wd===4)return {t:'ختام أسبوع جميل'};return null;}
function decorGreet(){var g=$('.hero .greet');if(!g||g._t2)return;g._t2=1;var oc=occasion();if(!oc)return;var s=document.createElement('span');s.className='t2-occ';s.textContent=oc.t;g.appendChild(s);
  if(oc.nat&&!$('.t2-ribbon')){var r=document.createElement('div');r.className='t2-ribbon';r.setAttribute('aria-hidden','true');document.body.appendChild(r);}}
/* (92) التاريخ الهجري في تلميح الساعة */
function hijriTitle(){var c=$('.t-clock');if(!c||c._t2)return;c._t2=1;try{c.title=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura-nu-latn',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch(e){}}

/* (86) احتفال هادئ مرة في الجلسة عند اكتمال نسبة 100% */
var party={};try{party=JSON.parse(sessionStorage.getItem('t2-party')||'{}');}catch(e){}
function hundred(){$$('.ring b,.stat b').forEach(function(b){var tx=(b.textContent||'').replace(/\s/g,'');if(!/^100[%٪]$/.test(tx))return;var key=location.hash+'|'+(b.closest('.card,.stat')||{}).textContent.slice(0,30);if(party[key])return;party[key]=1;try{sessionStorage.setItem('t2-party',JSON.stringify(party));}catch(e){}
  var r=b.getBoundingClientRect();if(r.top<0||r.top>innerHeight)return;setTimeout(function(){if(window.Touches&&Touches.burst)for(var i=0;i<3;i++)setTimeout(function(){Touches.burst(r.left+r.width/2,r.top+r.height/2);},i*180);},900);});}

/* (87) بريق يعبر الشعار بعد 25 ثانية من الهدوء، و(99) بريق أول زيارة في اليوم */
var idleT=0;function idle(){clearTimeout(idleT);idleT=setTimeout(function(){var m=$('.hero .medal');if(m&&!document.hidden&&!RM){m.classList.remove('t2-glint');void m.offsetWidth;m.classList.add('t2-glint');}idle();},25000);}
['pointerdown','keydown','scroll'].forEach(function(ev){addEventListener(ev,idle,{passive:true});});idle();
function firstOfDay(){var k=new Date().toISOString().slice(0,10);if(ls('t2-day')===k)return;ls('t2-day',k);setTimeout(function(){var m=$('.hero .medal');if(!m||RM)return;m.classList.add('t2-glint');var r=m.getBoundingClientRect();if(window.Touches&&Touches.burst)Touches.burst(r.left+r.width/2,r.top+r.height/2);},1600);}

/* (88) تلميح أنيق لأزرار الأيقونات */
var tip=null,tipT=0;if(FINE){tip=document.createElement('div');tip.className='t2-tip';tip.setAttribute('aria-hidden','true');document.body.appendChild(tip);
  document.addEventListener('pointerover',function(e){var b=e.target.closest('.ib[aria-label],.top button[aria-label],.top a[aria-label],[data-skinnext]');clearTimeout(tipT);if(!b){tip.classList.remove('on');return;}
   tipT=setTimeout(function(){var t=b.getAttribute('aria-label')||b.title;if(!t)return;tip.textContent=t;var r=b.getBoundingClientRect();tip.style.left=Math.max(8,Math.min(innerWidth-tip.offsetWidth-8,r.left+r.width/2-tip.offsetWidth/2))+'px';tip.style.top=(r.bottom+8)+'px';tip.classList.add('on');},350);});
  document.addEventListener('pointerdown',function(){tip.classList.remove('on');},true);}

/* (89) مربع النص يتمدد مع الكتابة */
document.addEventListener('input',function(e){var t=e.target;if(t.tagName!=='TEXTAREA')return;t.style.height='auto';t.style.height=Math.min(t.scrollHeight+2,innerHeight*.5)+'px';});
/* (90) تأكيد النسخ */
document.addEventListener('copy',function(){var s=String(getSelection()||'');if(s.length>1)toast('نُسخ النص');});
/* (91) ترويسة الطباعة بالتاريخ واسم القسم */
addEventListener('beforeprint',function(){var p=$('.t2-print');if(!p){p=document.createElement('div');p.className='t2-print';var m=$('#main');if(m)m.insertBefore(p,m.firstChild);else return;}
  var a=$('.nav a.on');p.textContent=baseTitle+(a?' · '+a.textContent.trim():'')+' · '+new Date().toLocaleDateString('ar-OM-u-nu-latn',{weekday:'long',year:'numeric',month:'long',day:'numeric'});});
/* (93) ضوء البطل حسب الوقت */
function tod(){var h=new Date().getHours(),c=h>=5&&h<10?'t2-dawn':h<15&&h>=10?'t2-noon':h>=15&&h<19?'t2-dusk':'t2-night';['t2-dawn','t2-noon','t2-dusk','t2-night'].forEach(function(k){document.body.classList.toggle(k,k===c);});}
tod();setInterval(tod,10*60000);
/* (94) النافذة تنفتح من مكان اللمسة */
new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType===1&&n.classList.contains('dlg')){var b=$('.box',n);if(b&&b.animate&&!RM){var r=b.getBoundingClientRect();var ox=lastPt.x-r.left,oy=lastPt.y-r.top;b.style.transformOrigin=ox+'px '+oy+'px';b.animate([{transform:'scale(.92)',opacity:.4},{transform:'none',opacity:1}],{duration:320,easing:'cubic-bezier(.2,.8,.2,1)'});}}});});}).observe(document.body,{childList:true});
/* (95) مفتاح Esc يغلق الصورة المكبّرة أولًا ثم النافذة (موجود في المحرك)؛ وأسهم لوحة المفاتيح تتنقل بين أقسام القائمة */
document.addEventListener('keydown',function(e){if(e.target.closest('input,textarea,select,[contenteditable]')||$('.dlg'))return;if(!e.altKey)return;var ls2=$$('.nav a'),i=ls2.indexOf($('.nav a.on'));if(i<0)return;
  if(e.key==='ArrowDown'||e.key==='ArrowLeft'){e.preventDefault();(ls2[i+1]||ls2[0]).click();}else if(e.key==='ArrowUp'||e.key==='ArrowRight'){e.preventDefault();(ls2[i-1]||ls2[ls2.length-1]).click();}});
/* (97) ضغطة مطوّلة على بطاقة ترفعها على الجوال */
var prT=0,prEl=null;document.addEventListener('pointerdown',function(e){if(e.pointerType!=='touch')return;var c=e.target.closest('.card');if(!c)return;prEl=c;prT=setTimeout(function(){c.classList.add('t2-press');if(navigator.vibrate)try{navigator.vibrate(8);}catch(x){}},380);},{passive:true});
['pointerup','pointercancel','scroll'].forEach(function(ev){addEventListener(ev,function(){clearTimeout(prT);if(prEl){prEl.classList.remove('t2-press');prEl=null;}},{passive:true,capture:true});});
/* (98) حكمة اليوم في التذييل */
var Q=O.quotes||['Education is not the filling of a pail, but the lighting of a fire. — W. B. Yeats','The art of teaching is the art of assisting discovery. — Mark Van Doren','Tell me and I forget. Teach me and I remember. Involve me and I learn.','A good teacher can inspire hope, ignite the imagination, and instill a love of learning. — Brad Henry','Learning never exhausts the mind. — Leonardo da Vinci','What we learn with pleasure we never forget. — Alfred Mercier','Teamwork makes the dream work. — John C. Maxwell','The beautiful thing about learning is that no one can take it away from you. — B. B. King','Small steps every day lead to big results.','Coming together is a beginning, staying together is progress, working together is success. — Henry Ford'];
function quote(){var f=$('.foot');if(!f||$('.t2-quote',f))return;var d=new Date(),n=Math.floor((d-new Date(d.getFullYear(),0,0))/864e5);var s=document.createElement('span');s.className='t2-quote';s.lang='en';s.textContent='“'+Q[n%Q.length].replace(/ — /,'” — ').replace(/^(?!.*”)(.*)$/,'$1”');f.appendChild(s);}
/* (100) لمسة مخفية: خمس نقرات سريعة على الشعار تطلق احتفالًا صغيرًا */
var egg=[];document.addEventListener('click',function(e){var m=e.target.closest('.hero .medal,.plaque');if(!m)return;var t=Date.now();egg=egg.filter(function(x){return t-x<1600;});egg.push(t);
  if(egg.length>=5){egg=[];var r=m.getBoundingClientRect();if(window.Touches&&Touches.burst)for(var i=0;i<6;i++)(function(i){setTimeout(function(){Touches.burst(r.left+Math.random()*r.width,r.top+Math.random()*r.height);},i*120);})(i);toast(O.egg||'مزن المعرفة · تمكين في العمل');}});

/* التطبيق بعد كل عرض */
function apply(){setTitle();decorGreet();hijriTitle();quote();hundred();}
var mt=0,main=null;function watch(){var m=$('#main');if(m&&m!==main){main=m;new MutationObserver(function(){clearTimeout(mt);mt=setTimeout(apply,120);}).observe(m,{childList:true});}apply();}
addEventListener('hashchange',function(){setTimeout(watch,150);});
new MutationObserver(function(){if($('#main')!==main)setTimeout(watch,50);}).observe(document.body,{childList:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){watch();firstOfDay();});else{watch();firstOfDay();}
window.Touches2={occasion:occasion,refresh:apply};
})();
