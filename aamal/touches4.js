/* =====================================================================
   «لمسات المجلدات ٢» · touches4.js — الجزء البرمجي من اللمسات 41–60 (2026-11-13)
   يعتمد على DA (core.js) و DA.KZ (app.js): folders/works/fold/on/open.
   ===================================================================== */
(function(){
'use strict';
var DA=window.DA;if(!DA||!DA.KZ)return;
var RM=DA.REDUCED||(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
function $(s,r){return (r||document).querySelector(s);}function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));}
function on(){return DA.KZ.on&&DA.KZ.on();}
function fidOf(a){var m=/#f\/(.+)$/.exec(a.getAttribute('href')||'');return m?decodeURIComponent(m[1]):'';}

/* عدد أعمال كل مجلد مع ما في داخله */
function tally(){var F=DA.KZ.folders(),par={},n={};F.forEach(function(f){par[f.id]=f.p||'';n[f.id]=0;});
  DA.KZ.works().forEach(function(w){var id=w.f,g=0;while(id&&g++<12){if(id in n)n[id]++;id=par[id];}});return n;}

/* (44) علامة مائية لأيقونة المجلد في رأسه، و(49) لون المجلد لرقاقة المسار، و(58) زر نسخ الرابط */
function fhead(){var h=$('#main .kz-fhead');if(!h||h._t4)return;h._t4=1;var fi=$('.fi',h);
  if(fi){var wm=document.createElement('span');wm.className='t4-wm';wm.setAttribute('aria-hidden','true');wm.innerHTML=fi.innerHTML;h.appendChild(wm);}
  var c=$('#main .kz-crumbs');if(c)c.style.setProperty('--fc',h.style.getPropertyValue('--fc'));
  var row=$('.row',h);if(row&&navigator.clipboard){var b=document.createElement('button');b.className='ib t4-link';b.type='button';b.title='نسخ رابط المجلد';b.setAttribute('aria-label','نسخ رابط المجلد');b.innerHTML=DA.ic('link');
    b.onclick=function(){navigator.clipboard.writeText(location.href.split('#')[0]+location.hash).then(function(){b.classList.add('ok');b.innerHTML=DA.ic('check');DA.toast('نُسخ رابط المجلد، تفتحه المعلمات بعد الدخول');setTimeout(function(){b.classList.remove('ok');b.innerHTML=DA.ic('link');},1800);},function(){DA.toast('تعذّر النسخ على هذا الجهاز');});};
    var ed=$('[data-editf]',row);row.insertBefore(b,ed||null);}}

/* (51) مقياس امتلاء المجلد */
function fills(){var cards=$$('#main .kz-fold:not(.add)');if(!cards.length)return;var n=tally(),mx=0;cards.forEach(function(a){mx=Math.max(mx,n[fidOf(a)]||0);});
  cards.forEach(function(a){if($('.t4-fill',a))return;var v=n[fidOf(a)]||0;if(!v||!mx)return;var s=document.createElement('span');s.className='t4-fill';s.setAttribute('aria-hidden','true');s.innerHTML='<i style="--p:'+Math.max(6,Math.round(v/mx*100))+'%"></i>';a.appendChild(s);});}

/* (52) مؤشر منزلق في أزرار التصفية */
var lastPill=null;
function seg(){var s=$('#main .seg[data-seg]');if(!s)return;var b=$('button.on',s);if(!b)return;s.classList.add('t4-seg');var p=$('.t4-pill',s);
  if(!p){p=document.createElement('i');p.className='t4-pill';p.setAttribute('aria-hidden','true');s.insertBefore(p,s.firstChild);
    if(lastPill){p.style.transition='none';p.style.left=lastPill.l+'px';p.style.width=lastPill.w+'px';void p.offsetWidth;p.style.transition='';}}
  var l=b.offsetLeft,w=b.offsetWidth;p.style.left=l+'px';p.style.width=w+'px';lastPill={l:l,w:w};}
addEventListener('resize',function(){var s=$('#main .seg.t4-seg'),b=s&&$('button.on',s),p=s&&$('.t4-pill',s);if(b&&p){p.style.left=b.offsetLeft+'px';p.style.width=b.offsetWidth+'px';}},{passive:true});

/* (53) تاريخ اليوم بالهجري والميلادي */
function dates(){var g=$('#main .kz-hero .greet');if(!g||$('.t4-date',g.parentNode))return;var d=new Date(),a='',h='';
  try{a=new Intl.DateTimeFormat('ar-OM-u-nu-latn',{weekday:'long',day:'numeric',month:'long'}).format(d);}catch(e){}
  try{h=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura-nu-latn',{day:'numeric',month:'long',year:'numeric'}).format(d);}catch(e){}
  if(!a&&!h)return;var s=document.createElement('span');s.className='t4-date';s.innerHTML=(a?esc(a):'')+(a&&h?'<i>✦</i>':'')+(h?esc(h):'');g.insertAdjacentElement('afterend',s);}
function esc(t){return String(t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}

/* (54) شارة عدد أعمال اليوم بجوار «كل الأعمال» */
function today(){var a=$('.nav [data-nav="all"]');if(!a)return;var t0=new Date();t0.setHours(0,0,0,0);var n=DA.KZ.works().filter(function(w){return (w.c||0)>=t0.getTime();}).length,b=$('.t4-today',a);
  if(!n){if(b)b.remove();return;}if(!b){b=document.createElement('span');b.className='t4-today';a.appendChild(b);}b.textContent=n;b.title=n===1?'عمل واحد أُضيف اليوم':n===2?'عملان أُضيفا اليوم':n+' أعمال أُضيفت اليوم';}

/* (55) تظليل كلمات البحث في البطاقات */
function hl(){var q=$('#main [data-q]'),v=q&&q.value.trim();if(!v||v.length<2)return;var lv=v.toLowerCase();
  $$('#main .kz-wk .bd b, #main .kz-wk .bd small, #main .kz-wk .bd p').forEach(function(el){if(el._t4h===v)return;el._t4h=v;
    var w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null),L=[],x;while((x=w.nextNode()))L.push(x);
    L.forEach(function(tn){var s=tn.nodeValue,i=s.toLowerCase().indexOf(lv);if(i<0)return;var f=document.createDocumentFragment(),k=0;
      while(i>=0){f.appendChild(document.createTextNode(s.slice(k,i)));var m=document.createElement('mark');m.className='t4-hl';m.textContent=s.slice(i,i+v.length);f.appendChild(m);k=i+v.length;i=s.toLowerCase().indexOf(lv,k);}
      f.appendChild(document.createTextNode(s.slice(k)));tn.parentNode.replaceChild(f,tn);});});}

/* (56) التنقل بين الأعمال في العارض: أزرار وأسهم لوحة المفاتيح */
var SEQ=[];
function seq(){var L=$$('#main [data-work]').map(function(e){return e.getAttribute('data-work');});return L.filter(function(id,i){return L.indexOf(id)===i;});}
function viewer(){$$('.dlg[data-wid]').forEach(function(d){if(d._t4)return;d._t4=1;var id=d.getAttribute('data-wid'),L=SEQ.length&&SEQ.indexOf(id)>=0?SEQ:seq(),i=L.indexOf(id);if(i<0||L.length<2)return;
  var box=$('.kz-view',d)||d,n=document.createElement('div');n.className='t4-nav';
  n.innerHTML='<button type="button" data-t4="-1" aria-label="العمل السابق" title="السابق">'+DA.ic('right')+'</button><span class="pos">'+(i+1)+' / '+L.length+'</span><button type="button" data-t4="1" aria-label="العمل التالي" title="التالي">'+DA.ic('left')+'</button>';
  (box.parentNode||d).appendChild(n);var panel=n.parentNode;if(getComputedStyle(panel).position==='static')panel.style.position='relative';
  $('[data-t4="-1"]',n).disabled=i===0;$('[data-t4="1"]',n).disabled=i===L.length-1;
  $$('[data-t4]',n).forEach(function(b){b.onclick=function(){go(d,L,i+ +b.getAttribute('data-t4'));};});d._t4go=function(k){go(d,L,i+k);};});}
function go(d,L,j){if(j<0||j>=L.length)return;SEQ=L;if(d.close)d.close();else d.remove();setTimeout(function(){DA.KZ.open(L[j]);if(DA.sfx)DA.sfx('nav');},60);}
addEventListener('keydown',function(e){if(e.altKey||e.ctrlKey||e.metaKey||$('.lb'))return;var d=$('.dlg[data-wid]');if(!d||!d._t4go)return;var a=document.activeElement;if(a&&/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName))return;
  if(e.key==='ArrowLeft'){e.preventDefault();d._t4go(1);}else if(e.key==='ArrowRight'){e.preventDefault();d._t4go(-1);}});

/* (57) لون المجلد يتّسع من بطاقته عند فتحه */
document.addEventListener('click',function(e){if(RM||e.defaultPrevented||e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey)return;var a=e.target.closest&&e.target.closest('a.kz-fold');if(!a)return;
  var r=a.getBoundingClientRect(),o=document.createElement('div');o.className='t4-open';o.style.setProperty('--fc',a.style.getPropertyValue('--fc'));o.style.left=r.left+'px';o.style.top=r.top+'px';o.style.width=r.width+'px';o.style.height=r.height+'px';document.body.appendChild(o);
  var an=o.animate([{left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px',opacity:.95,borderRadius:'18px'},{left:'0px',top:'0px',width:innerWidth+'px',height:innerHeight+'px',opacity:0,borderRadius:'0px'}],{duration:520,easing:'cubic-bezier(.3,.7,.2,1)'});
  an.onfinish=function(){o.remove();};},true);

/* (59) توهج بطاقة العمل بلون صورتها */
var cv=document.createElement('canvas');cv.width=cv.height=8;var cx=null;try{cx=cv.getContext('2d',{willReadFrequently:true});}catch(e){}
function tint(img){var card=img.closest('.kz-wk');if(!card||!cx||card._t4c===img.src)return;card._t4c=img.src;
  try{cx.drawImage(img,0,0,8,8);var p=cx.getImageData(0,0,8,8).data,r=0,g=0,b=0,k=0;for(var i=0;i<p.length;i+=4){var l=(p[i]+p[i+1]+p[i+2])/3;if(l<18||l>240)continue;r+=p[i];g+=p[i+1];b+=p[i+2];k++;}
    if(!k)return;card.style.setProperty('--wc',Math.round(r/k)+','+Math.round(g/k)+','+Math.round(b/k));card.classList.add('t4-c');}catch(e){}}
document.addEventListener('load',function(e){var t=e.target;if(t&&t.tagName==='IMG'&&t.closest&&t.closest('.kz-wk .cover'))tint(t);},true);
function tints(){$$('#main .kz-wk .cover img').forEach(function(im){if(im.complete&&im.naturalWidth)tint(im);});}

/* (60) احتفال هادئ ببلوغ 10 و25 و50 و100 و200 و500 عمل (مرة لكل عتبة على الجهاز) */
var MS=[10,25,50,100,200,500];
function milestone(){var n=DA.KZ.works().length,seen=DA.lsg('t4ms',-1);if(seen<0){DA.lss('t4ms',n);return;}
  var hit=MS.filter(function(m){return n>=m&&seen<m;}).pop();if(n>seen)DA.lss('t4ms',n);if(!hit||$('.t4-ms'))return;
  var s=document.createElement('div');s.className='t4-ms';s.setAttribute('role','status');var wd=hit===10?'أعمال':hit<100?'عملًا':'عمل';s.innerHTML='<b>'+hit+' '+wd+'</b><span>بلغت المنصة '+hit+' '+wd+'، ما شاء الله، بارك الله في الجهود</span>';
  document.body.appendChild(s);setTimeout(function(){s.remove();},4400);
  if(window.Touches&&Touches.burst&&!RM){Touches.burst(innerWidth/2,innerHeight*0.27,18);}if(DA.snd)DA.snd('ok');}

/* يُعاد تطبيق اللمسات بعد كل عرض */
var pend=0;
function apply(){pend=0;if(!on())return;fhead();fills();seg();dates();today();hl();viewer();tints();milestone();}
var mo=new MutationObserver(function(){if(!pend){pend=1;requestAnimationFrame(apply);}});
var app=document.getElementById('app');if(app)mo.observe(app,{childList:true,subtree:true});mo.observe(document.body,{childList:true});
DA.on(function(){if(!pend){pend=1;requestAnimationFrame(apply);}});
apply();
})();
