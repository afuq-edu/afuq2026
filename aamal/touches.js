/* =====================================================================
   «لمسات» · touches.js — الجزء البرمجي من اللمسات الخمسين (26–50)
   مستقل عن محرك المنصة: يعمل على أصناف مشتركة (.card .btn .stat .hero .top .tabbar #main …)
   ويراقب #main ليعيد تطبيق اللمسات بعد كل عرض. الإعداد الاختياري:
     window.TOUCH_OPT = { clock: function(){ return 'الحصة ٣'; },   // نص إضافي بجوار الساعة
                          clockIn: '.top .tools',                   // مكان الساعة
                          name: '.hero h1' }                        // عنوان يُكتب حرفًا حرفًا
   ===================================================================== */
(function(){
'use strict';
var O=window.TOUCH_OPT||{},RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var FINE=window.matchMedia&&matchMedia('(hover: hover) and (pointer: fine)').matches;
function $(s,r){return (r||document).querySelector(s);}function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));}
var T=window.Touches={burst:burst,haptic:haptic,refresh:apply};

/* (26) شريط تقدّم القراءة + (27) الرأس عند النزول + (38) زر العودة للأعلى + (39) تباطؤ زخرفة البطل */
var prog=document.createElement('div');prog.className='t-prog';document.body.appendChild(prog);
var top=document.createElement('button');top.className='t-top';top.type='button';top.setAttribute('aria-label','العودة إلى الأعلى');
top.innerHTML='<svg viewBox="0 0 46 46"><circle cx="23" cy="23" r="21" stroke-dasharray="0 132"/></svg><i>↑</i>';document.body.appendChild(top);
top.onclick=function(){window.scrollTo({top:0,behavior:RM?'auto':'smooth'});};
var ticking=false;
function onScroll(){if(ticking)return;ticking=true;requestAnimationFrame(function(){ticking=false;var y=window.scrollY||0,h=document.documentElement.scrollHeight-innerHeight,p=h>0?Math.min(1,y/h):0;
  prog.style.transform='scaleX('+p+')';document.body.classList.toggle('t-scrolled',y>24);top.classList.toggle('on',y>innerHeight*.9);$('circle',top).setAttribute('stroke-dasharray',(132*p).toFixed(1)+' 132');
  if(!RM){var hd=$('.hero-deco');if(hd)hd.style.transform='translateY('+Math.min(60,y*.18)+'px)';var md=$('.hero .medal');if(md)md.style.translate='0 '+Math.min(24,y*.06)+'px';}});}
addEventListener('scroll',onScroll,{passive:true});

/* (28) الظهور عند الوصول + (32) خط العنوان + (48) خيط الضوء */
var io='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var el=e.target;el.classList.add('t-in');if(!RM&&el.classList.contains('card')&&Math.random()<.5){el.classList.add('t-sweep');setTimeout(function(){el.classList.remove('t-sweep');},1700);}io.unobserve(el);}});},{rootMargin:'0px 0px -6% 0px'}):null;

/* (29) العدّ التصاعدي + (49) توهّج الرقم المتغيّر */
var seen={},fresh=true;
function numOf(s){var m=String(s).match(/^(\D*)([\d٠-٩]+)(.*)$/);if(!m)return null;var d=m[2].replace(/[٠-٩]/g,function(c){return '٠١٢٣٤٥٦٧٨٩'.indexOf(c);});return {pre:m[1],n:+d,post:m[3]};}
function countUp(el){var key=(location.hash||'#')+'|'+(el.closest('[data-nrt],.stat,.ms,.nr-kpi>div,.hb')||el).textContent.replace(/[\d٠-٩٪%]+/g,'').trim().slice(0,40),txt=el.textContent,v=numOf(txt);
  if(!v||v.n>5000)return;var old=seen[key];seen[key]=txt;
  if(old===txt)return;if(old!=null&&!fresh){el.classList.remove('t-bump');void el.offsetWidth;el.classList.add('t-bump');return;}
  if(RM||!fresh||v.n===0)return;var t0=performance.now(),dur=Math.min(1400,500+v.n*12);
  (function step(t){var k=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-k,3);el.textContent=v.pre+Math.round(v.n*e)+v.post;if(k<1)requestAnimationFrame(step);else el.textContent=txt;})(t0);}

/* (30) الحلقات و(31) الأشرطة تنمو من الصفر عند دخول القسم */
function grow(root){if(RM)return;$$('.ring .fg',root).forEach(function(c){var d=c.getAttribute('stroke-dasharray');if(!d)return;c.style.transition='none';c.setAttribute('stroke-dasharray','0 999');requestAnimationFrame(function(){requestAnimationFrame(function(){c.style.transition='';c.setAttribute('stroke-dasharray',d);});});});
  $$('.bar i,.tbar i,.pbar i,.hb .tr i,.db i',root).forEach(function(i){var w=i.style.width;if(!w)return;i.style.transition='none';i.style.width='0';requestAnimationFrame(function(){requestAnimationFrame(function(){i.style.transition='';i.style.width=w;});});});}

/* (33) ضوء يتبع المؤشر + (34) ميل خفيف + (47) زر ذهبي مغناطيسي */
function hover(root){if(!FINE||RM)return;
  $$('.card',root).forEach(function(c){if(c._ts)return;c._ts=1;c.classList.add('t-spot');c.addEventListener('pointermove',function(e){var r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px');});});
  $$('.stat,.rolei,.tcard,.frole .fi',root).forEach(function(c){if(c._tt)return;c._tt=1;c.classList.add('t-tilt');
    c.addEventListener('pointermove',function(e){var r=c.getBoundingClientRect(),px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;c.style.transform='perspective(700px) rotateX('+(-py*4).toFixed(2)+'deg) rotateY('+(px*4).toFixed(2)+'deg) translateY(-2px)';});
    c.addEventListener('pointerleave',function(){c.style.transform='';});});
  $$('.btn.gold',root).forEach(function(b){if(b._tm)return;b._tm=1;b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect();b.style.translate=((e.clientX-r.left-r.width/2)*.08).toFixed(1)+'px '+((e.clientY-r.top-r.height/2)*.14).toFixed(1)+'px';});b.addEventListener('pointerleave',function(){b.style.translate='';});});}

/* (35) تموّج عند الضغط + (36) نثرة الإنجاز + (37) اهتزاز خفيف */
function haptic(ms){try{if(navigator.vibrate&&!RM)navigator.vibrate(ms||8);}catch(e){}}
function burst(x,y,n){if(RM)return;n=n||10;for(var i=0;i<n;i++){var s=document.createElement('i');s.className='t-spark';s.style.left=x+'px';s.style.top=y+'px';document.body.appendChild(s);
  var a=Math.random()*Math.PI*2,d=24+Math.random()*34,sz=.5+Math.random()*.9;
  var an=s.animate([{transform:'translate(-50%,-50%) scale('+sz+')',opacity:1},{transform:'translate(calc(-50% + '+(Math.cos(a)*d).toFixed(1)+'px),calc(-50% + '+(Math.sin(a)*d-10).toFixed(1)+'px)) scale(0)',opacity:0}],{duration:650+Math.random()*350,easing:'cubic-bezier(.2,.8,.2,1)'});an.onfinish=(function(el){return function(){el.remove();};})(s);}}
var DONE='.task:not(.done) .tick,.sc:not(.on),[data-cvdone],[data-pdst],[data-spst],[data-apst],[data-cpick],[data-auto],.btn.gold[type=submit]';
document.addEventListener('pointerdown',function(e){var b=e.target.closest('.btn,.ab-main,.nr-row,.seg button,.tabbar a,.tabbar button');
  if(b&&!RM){var r=b.getBoundingClientRect(),s=Math.max(r.width,r.height)*2.2,rp=document.createElement('span');rp.className='t-rip';rp.style.width=rp.style.height=s+'px';rp.style.left=(e.clientX-r.left-s/2)+'px';rp.style.top=(e.clientY-r.top-s/2)+'px';
    if(getComputedStyle(b).position==='static')b.style.position='relative';b.style.overflow='hidden';b.appendChild(rp);setTimeout(function(){rp.remove();},650);}
  var d=e.target.closest(DONE);if(d){burst(e.clientX,e.clientY,d.matches('[data-auto]')?16:9);haptic(10);}else if(b)haptic(5);},{passive:true});

/* (40) نجيمات تومض في البطل */
var twT=0;function twinkles(){clearInterval(twT);if(RM)return;twT=setInterval(function(){var h=$('.hero');if(!h||document.hidden)return;var s=document.createElement('i');s.className='t-tw';s.style.left=(8+Math.random()*84)+'%';s.style.top=(8+Math.random()*60)+'%';h.appendChild(s);setTimeout(function(){s.remove();},3300);},2600);}

/* (41) كتابة الاسم حرفًا حرفًا (مرة في الجلسة) + (18) بريق الاسم */
function shine(h){h.classList.add('t-shine');var off=function(){h.classList.remove('t-shine');};h.addEventListener('animationend',off,{once:true});setTimeout(off,3400);}
function typeName(){var h=$(O.name||'.hero h1');if(!h||h._ty)return;h._ty=1;var done=false;try{done=sessionStorage.getItem('t-typed');}catch(e){}
  if(RM){return;}if(done){shine(h);return;}try{sessionStorage.setItem('t-typed','1');}catch(e){}
  var full=h.textContent,i=0;h.textContent='';h.classList.add('t-caret');(function step(){i++;h.textContent=full.slice(0,i);if(i<full.length)setTimeout(step,38+Math.random()*40);else{setTimeout(function(){h.classList.remove('t-caret');shine(h);},600);}})();}

/* (42) ساعة حيّة في الرأس */
function clock(){var host=$(O.clockIn||'.top .tools');if(!host)return;var c=$('.t-clock',host);if(!c){c=document.createElement('span');c.className='t-clock';c.setAttribute('aria-live','off');host.insertBefore(c,host.firstChild);}
  var d=new Date(),t=d.toLocaleTimeString('ar-OM-u-nu-latn',{hour:'numeric',minute:'2-digit'}),x=O.clock?O.clock():'';c.innerHTML='<i></i><b>'+t+'</b>'+(x?'<small>'+x+'</small>':'');}
setInterval(clock,20000);

/* (44) الصور تظهر من الضباب */
function imgs(root){$$('img',root).forEach(function(im){if(im._ti||im.closest('.plaque,.medal,.sp-mark'))return;im._ti=1;if(im.complete&&im.naturalWidth)return;im.classList.add('t-img');var ok=function(){im.classList.add('t-ok');};im.addEventListener('load',ok,{once:true});im.addEventListener('error',ok,{once:true});});}

/* (45) شريط الاتصال */
var net=document.createElement('div');net.className='t-net';net.setAttribute('role','status');document.body.appendChild(net);var nt=0;
function netMsg(m){net.innerHTML=m;net.classList.add('on');clearTimeout(nt);nt=setTimeout(function(){net.classList.remove('on');},3200);}
addEventListener('offline',function(){netMsg('انقطع الإنترنت · <b>عملك محفوظ على الجهاز</b>');});
addEventListener('online',function(){netMsg('عاد الاتصال · <b>تُستكمل المزامنة</b>');});

/* (46) رمز الوقت بجوار التحية */
function tod(){var g=$('.hero .greet');if(!g||$('.t-tod',g))return;var h=new Date().getHours(),s=document.createElement('span');s.className='t-tod';s.setAttribute('aria-hidden','true');s.textContent=h>=5&&h<12?'☀︎':(h<18&&h>=12?'◐':'☾');g.insertBefore(s,g.firstChild);}

/* (50) نبضة «حُفظ» على زر المزامنة */
if(window.DA&&DA.on)DA.on(function(src){if(src!=='local')return;var b=$('.top [data-sync]');if(!b)return;b.classList.remove('t-saved');void b.offsetWidth;b.classList.add('t-saved');});

/* ===== التطبيق بعد كل عرض ===== */
function apply(){var m=$('#main')||document.body;
  $$('.card,.sec-head',m).forEach(function(c,i){if(c._tr)return;c._tr=1;var r=c.getBoundingClientRect();if(io&&!RM&&r.top>innerHeight*.92){c.classList.add('t-rev');io.observe(c);}else c.classList.add('t-line');});
  $$('.stat b,.ms b,.nr-kpi b,.nr-row b,.hb b,.cv-prog b',m).forEach(countUp);
  if(fresh)grow(m);hover(m);imgs(m);tod();typeName();clock();onScroll();fresh=false;}
var mt=0;function sched(){clearTimeout(mt);mt=setTimeout(apply,30);}
function watch(){var m=$('#main');if(!m){setTimeout(watch,200);return;}if(!m._tw){m._tw=1;new MutationObserver(sched).observe(m,{childList:true});}apply();twinkles();}
/* (43) انتقال ناعم بين الأقسام */
addEventListener('hashchange',function(){fresh=true;var m=$('#main');if(m&&!RM){m.classList.remove('t-swap');void m.offsetWidth;m.classList.add('t-swap');}});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watch);else watch();
/* إعادة الربط إن أُعيد بناء الهيكل (تغيير الثيم أو قسم جديد) */
new MutationObserver(function(){var m=$('#main');if(m&&!m._tw){m._tw=1;new MutationObserver(sched).observe(m,{childList:true});fresh=true;sched();}}).observe(document.getElementById('app')||document.body,{childList:true});
})();
