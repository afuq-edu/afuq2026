/* =====================================================================
   «لمسات المجلدات» · touches3.js — الجزء البرمجي من اللمسات الأربعين (2026-11-13)
   يعتمد على DA (core.js) و DA.KZ (app.js): add(files) و works() و on().
   ===================================================================== */
(function(){
'use strict';
var DA=window.DA;if(!DA)return;
var RM=DA.REDUCED||(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
var FINE=window.matchMedia&&matchMedia('(hover: hover) and (pointer: fine)').matches;
function $(s,r){return (r||document).querySelector(s);}function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));}
function KZ(){return DA.KZ&&DA.KZ.on&&DA.KZ.on();}
var T3=window.Touches3={papers:papers};

/* (29) إفلات الملفات في أي مكان من المنصة */
var ov=document.createElement('div');ov.className='t3-dropall';ov.setAttribute('aria-hidden','true');
ov.innerHTML='<div>'+DA.ic('up')+'<b>أفلتي الملفات هنا</b><small>تُضاف عملًا جديدًا في المجلد المفتوح</small></div>';document.body.appendChild(ov);
var dc=0;function hasFiles(e){var t=e.dataTransfer&&e.dataTransfer.types;return t&&Array.prototype.indexOf.call(t,'Files')>=0;}
addEventListener('dragenter',function(e){if(!KZ()||!hasFiles(e)||$('.dlg'))return;dc++;ov.classList.add('on');});
addEventListener('dragleave',function(){if(dc>0&&--dc===0)ov.classList.remove('on');});
addEventListener('dragover',function(e){if(ov.classList.contains('on'))e.preventDefault();});
addEventListener('drop',function(e){if(!ov.classList.contains('on'))return;e.preventDefault();dc=0;ov.classList.remove('on');var f=Array.prototype.slice.call(e.dataTransfer.files||[]);if(f.length)DA.KZ.add(f);});

/* (30) أوراق صغيرة تتطاير من زر الحفظ عند إضافة عمل */
function papers(){if(RM)return;var b=$('.dlg [data-sv]'),r=b?b.getBoundingClientRect():{left:innerWidth/2,top:innerHeight/2,width:0,height:0},x0=r.left+r.width/2,y0=r.top+r.height/2;
  for(var i=0;i<9;i++)(function(i){var p=document.createElement('i');p.className='t3-paper';p.style.left=x0+'px';p.style.top=y0+'px';document.body.appendChild(p);
    var a=-Math.PI/2+(Math.random()-.5)*2.2,v=120+Math.random()*160,dx=Math.cos(a)*v,dy=Math.sin(a)*v,rot=(Math.random()-.5)*540;
    var an=p.animate([{transform:'translate(-50%,-50%) rotate(0)',opacity:1},{transform:'translate(calc(-50% + '+dx+'px),calc(-50% + '+dy+'px)) rotate('+rot/2+'deg)',opacity:1,offset:.55},{transform:'translate(calc(-50% + '+dx*1.3+'px),calc(-50% + '+(dy+170)+'px)) rotate('+rot+'deg)',opacity:0}],{duration:1300+Math.random()*500,easing:'cubic-bezier(.2,.7,.4,1)',delay:i*25});
    an.onfinish=function(){p.remove();};})(i);
  if(navigator.vibrate)try{navigator.vibrate(12);}catch(e){}}

/* (31) خلايا سداسية تضيء واحدة واحدة في البطل */
setInterval(function(){if(RM||document.hidden)return;var h=$('.kz-hero');if(!h)return;var r=h.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;
  var c=document.createElement('span');c.className='t3-hex';var col=Math.floor(Math.random()*(r.width/56)),row=Math.floor(Math.random()*(r.height/97));
  c.style.left=(col*56)+'px';c.style.top=(row*97+(Math.random()<.5?0:48))+'px';var d=$('.hexes',h)||h;d.appendChild(c);setTimeout(function(){c.remove();},5200);},2600);

/* (32) نبضة المزامنة و(34) إشعار «وصل عمل جديد» و(40) عدد الجديد في عنوان التبويب */
var known=null,unseen=0,baseTitle=document.title;
function snap(){var o={};(DA.KZ&&DA.KZ.works?DA.KZ.works():[]).forEach(function(w){o[w.id]=w;});return o;}
DA.on(function(src){if(!DA.KZ||!DA.KZ.works)return;var now=snap();if(known===null||src!=='remote'){known=now;return;}
  var fresh=Object.keys(now).filter(function(id){return !known[id];}).map(function(id){return now[id];});known=now;if(!fresh.length)return;
  var d=$('.sdot .dot');if(d){d.classList.remove('t3-ping');void d.offsetWidth;d.classList.add('t3-ping');}
  var w=fresh[0],f=DA.KZ.fold(w.f);setTimeout(function(){if(!$('.toast'))DA.toast(fresh.length>1?'وصلت '+fresh.length+' أعمال جديدة من الأجهزة الأخرى':'وصل عمل جديد'+(w.by?' من '+w.by:'')+(f?' في «'+f.n+'»':''));},700);
  if(document.hidden){unseen+=fresh.length;document.title='('+unseen+') '+baseTitle;}});
document.addEventListener('visibilitychange',function(){if(!document.hidden&&unseen){unseen=0;document.title=baseTitle;}});

/* (35) أرقام البطل تعدّ تصاعديًا مرة عند الظهور */
function count(){if(RM)return;$$('.kz-hero .chips b').forEach(function(b){if(b._c)return;b._c=1;var n=parseInt(b.textContent,10);if(!(n>1))return;var t0=performance.now(),dur=900;
  (function st(t){var p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,3);b.textContent=String(Math.round(n*e));if(p<1)requestAnimationFrame(st);})(t0);});}

/* (36) اختصارات: N عمل جديد، و / للبحث، وEsc يمسح البحث */
addEventListener('keydown',function(e){if(!KZ()||e.ctrlKey||e.metaKey||e.altKey)return;var a=document.activeElement,typing=a&&(/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)||a.isContentEditable);
  if(e.key==='Escape'&&a&&a.matches&&a.matches('[data-q]')&&a.value){a.value='';a.dispatchEvent(new Event('input'));return;}
  if(typing||$('.dlg')||$('.lb'))return;
  if(e.key==='n'||e.key==='N'||e.key==='ى'){var b=$('#main [data-addw]')||$('[data-addw]');if(b){e.preventDefault();b.click();}}
  else if(e.key==='/'){var q=$('[data-q]');if(q){e.preventDefault();q.focus();}else{location.hash='#all';setTimeout(function(){var q2=$('[data-q]');if(q2)q2.focus();},250);}}});

/* (37) لصق صورة من الحافظة يفتح نافذة الإضافة بها */
addEventListener('paste',function(e){if(!KZ()||$('.dlg'))return;var a=document.activeElement;if(a&&/^(INPUT|TEXTAREA)$/.test(a.tagName))return;
  var it=Array.prototype.slice.call((e.clipboardData&&e.clipboardData.files)||[]);if(!it.length)return;e.preventDefault();
  DA.KZ.add(it.map(function(f,i){return f.name&&f.name!=='image.png'?f:new File([f],'صورة ملصقة '+(i+1)+'.png',{type:f.type||'image/png'});}));});

/* (33) تلميح الاختصارات داخل نافذة الإضافة */
function hint(){var dz=$('.dlg .kz-drop');if(!dz||$('.t3-keys',dz.parentNode))return;var s=document.createElement('span');s.className='t3-keys';s.innerHTML='<kbd>Ctrl</kbd>+<kbd>V</kbd> للصق صورة · <kbd>N</kbd> عمل جديد · <kbd>/</kbd> للبحث';dz.insertAdjacentElement('afterend',s);}

/* (38) ترحيب بعدد الأعمال الجديدة منذ آخر زيارة (مرة في الجلسة) */
var welcomed=false;
function welcome(){if(welcomed||!KZ())return;var seen=DA.KZ.seen?DA.KZ.seen():0;
  if(!seen)return;var n=DA.KZ.works().filter(function(w){return w.c>seen;}).length;if(!n)return;welcomed=true;setTimeout(function(){if(!$('.toast')&&!$('.dlg'))DA.toast('منذ زيارتك الأخيرة أُضيف '+(n===1?'عمل واحد':n===2?'عملان':n+' أعمال')+'، عليها شريط «جديد»');},4200);}

/* (39) بطاقات المجلدات تميل نحو المؤشر ميلًا خفيفًا (الفأرة فقط) */
if(FINE&&!RM){document.addEventListener('pointermove',function(e){var c=e.target.closest&&e.target.closest('.kz-folds .kz-fold');$$('.kz-fold.t3-tilt').forEach(function(x){if(x!==c){x.classList.remove('t3-tilt');x.style.rotate='';x.style.transform='';}});
  if(!c||c.classList.contains('add'))return;var r=c.getBoundingClientRect(),px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;c.classList.add('t3-tilt');c.style.transform='translateY(-4px) rotateX('+(-py*4).toFixed(2)+'deg) rotateY('+(px*5).toFixed(2)+'deg)';},{passive:true});}

/* يُعاد تطبيق اللمسات بعد كل عرض */
var mo=new MutationObserver(function(){count();hint();welcome();});
function watch(){var m=document.getElementById('app');if(m)mo.observe(m,{childList:true,subtree:true});mo.observe(document.body,{childList:true});}
watch();count();
})();
