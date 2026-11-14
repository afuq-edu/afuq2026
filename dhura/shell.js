/* =====================================================================
   «رُواء» و«ذُرى» · الهيكل المشترك
   الشريط العلوي العائم، الشريط الجانبي النحيل، جزيرة الجوال وورقة الأقسام،
   البحث السريع، الموجّه، الغلاف الحيّ بحسب ساعة اليوم، النماذج الموحّدة،
   صفحة القائمة العامة، الترحيب، والبذر الأول. إعدادات كل منصة في window.PD.
   ===================================================================== */
(function(){
'use strict';
var DA=window.DA,I=window.PD,$=DA.$,$$=DA.$$,esc=DA.esc;
var A=window.APP={};A.PAGES={};

/* ---------- أيقونات إضافية ---------- */
var X={
 trophy:'<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 21h8M9 17h6"/>',
 medal:'<circle cx="12" cy="15" r="5"/><path d="M8.5 11L6 3h4l2 5 2-5h4l-2.5 8"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6L19 19M5 19l1.4-1.4M17.6 6.4L19 5"/>',
 moon:'<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
 shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 chat:'<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>',
 mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
 report:'<path d="M6 3h9l4 4v14H6z"/><path d="M9 17v-3M12 17v-6M15 17v-4"/>',
 grid:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M3 15h18M9 4v16M15 4v16"/>',
 wa:'<path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z"/><path d="M9 9c0 3 3 6 6 6l1-1.5-2-1-1 1c-1 0-2.5-1.5-2.5-2.5l1-1-1-2z"/>',
 copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
 magic:'<path d="M4 20L16 8M14 6l2-2 2 2-2 2zM19 11v2M18 12h2M8 3v2M7 4h2"/>',
 student:'<circle cx="12" cy="7" r="3.5"/><path d="M5 21a7 7 0 0 1 14 0"/>',
 folder:'<path d="M3 6a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/>',
 pin:'<path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11z"/><circle cx="12" cy="10" r="2.2"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
 warn:'<path d="M12 3l10 18H2z"/><path d="M12 10v4M12 17h.01"/>',
 menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
 timer:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6M12 2v3"/>',
 wheel:'<circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4"/><circle cx="12" cy="12" r="2" fill="currentColor"/>',
 dice:'<rect x="3.5" y="3.5" width="17" height="17" rx="4"/><circle cx="8.5" cy="8.5" r="1.2" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1.2" fill="currentColor"/><circle cx="15.5" cy="8.5" r="1.2" fill="currentColor"/><circle cx="8.5" cy="15.5" r="1.2" fill="currentColor"/>',
 leaf:'<path d="M5 19c0-9 5-14 15-15-1 10-6 15-15 15z"/><path d="M5 19l8-8"/>',
 tower:'<path d="M9 21l1-13h4l1 13z"/><path d="M8 8h8M10 5h4v3h-4zM12 2v3M5 6l3 1M19 6l-3 1"/>',
 award:'<circle cx="12" cy="9" r="6"/><path d="M8.5 13.5L7 22l5-3 5 3-1.5-8.5"/>',
 note:'<path d="M5 3h10l4 4v14H5z"/><path d="M14 3v5h5M8 12h8M8 16h6"/>',
 home2:'<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
 phone:'<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
 megaphone:'<path d="M3 10v4h4l8 5V5L7 10z"/><path d="M18 9a4 4 0 0 1 0 6"/>',
 pause:'<rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/>',
 right:'<path d="M9 6l6 6-6 6"/>',
 refresh:'<path d="M20 11a8 8 0 0 0-14.6-4.5L4 8M4 4v4h4M4 13a8 8 0 0 0 14.6 4.5L20 16M20 20v-4h-4"/>',
 spark:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/>',
 mute:'<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9l4 6M21 9l-4 6"/>',
 group:'<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20a6 6 0 0 1 12 0M14 20a4.5 4.5 0 0 1 8 0"/>'
};
Object.keys(X).forEach(function(k){DA.P[k]=X[k];});
var ic=DA.ic;A.ic=ic;

/* ---------- الأقسام ---------- */
var SEC=I.SEC;A.SEC=SEC;
A.sec=function(k){return SEC.filter(function(s){return s[0]===k;})[0]||A.custom(k);};
A.custom=function(k){var r=DA.rec(k);if(!r||r.K!=='sec')return null;return [r.id,r.title,r.icon||'folder','--'+(r.color||'k1'),r.desc||'قسم مضاف','أقسام مضافة',1];};

/* ---------- التواريخ والحصص ---------- */
A.today=DA.today;
A.workday=function(){var d=new Date();while(!I.isSchool(d))d=I.addD(d,-1);return I.iso(d);};
A.isToday=function(d){return d===DA.today();};
A.dayName=function(iso){return ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'][new Date(iso+'T08:00:00').getDay()];};
A.fmt=function(iso){return iso?A.dayName(iso)+' '+DA.fmtD(iso):'';};
A.short=function(iso){var p=DA.dParts(iso);return p?p.d+' '+p.m:'';};
A.rel=function(iso){if(!iso)return '';var a=new Date(DA.today()+'T00:00:00'),b=new Date(iso+'T00:00:00'),n=Math.round((b-a)/864e5);
  if(n===0)return 'اليوم';if(n===1)return 'غدًا';if(n===-1)return 'أمس';if(n===2)return 'بعد يومين';if(n===-2)return 'قبل يومين';if(n>2&&n<11)return 'بعد '+n+' أيام';if(n<-2&&n>-11)return 'قبل '+(-n)+' أيام';return DA.fmtD(iso);};
A.hijri=function(){try{return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch(e){return '';}};
function mm(s){var p=s.split(':');return +p[0]*60+ +p[1];}
A.mm=mm;
/* الحصة الحالية: {i, state:'in'|'gap'|'before'|'after'|'off', pct, left} */
A.periodState=function(){var d=new Date(),w=d.getDay();if(w>4)return {state:'off'};var m=d.getHours()*60+d.getMinutes()+d.getSeconds()/60,P=I.PERIODS;
  if(m<mm(P[0][0]))return {state:'before',i:0,left:Math.round(mm(P[0][0])-m)};
  for(var i=0;i<P.length;i++){var a=mm(P[i][0]),b=mm(P[i][1]);if(m>=a&&m<b)return {state:'in',i:i,pct:Math.round((m-a)/(b-a)*100),left:Math.ceil(b-m)};
    if(i<P.length-1&&m>=b&&m<mm(P[i+1][0]))return {state:'gap',i:i+1,left:Math.ceil(mm(P[i+1][0])-m)};}
  return {state:'after'};};
A.periodNow=function(){var s=A.periodState();return s.state==='off'?'عطلة نهاية الأسبوع':s.state==='before'?'قبل بدء اليوم الدراسي':s.state==='after'?'انتهى اليوم الدراسي':s.state==='in'?'الحصة '+(s.i+1):'استراحة قبل الحصة '+(s.i+1);};
DA.periodLabel=A.periodNow;

/* ---------- أدوات العرض ---------- */
var AVC=['#3E6E61','#D2704F','#B8892F','#7C5C8A','#4F7FA0','#7E8D4E','#B5566B','#2F7F86'];
A.initials=function(n){var p=String(n||'').replace(/^أ\.\s*/,'').split(/\s+/).filter(function(x){return x&&x!=='بنت'&&x!=='بن';});return (p[0]||'؟').charAt(0)+(p[1]?' '+p[1].replace(/^ال/,'').charAt(0):'');};
A.hue=function(s){var h=0;s=String(s||'');for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;return AVC[h%AVC.length];};
A.av=function(o,cls){var c=o&&o.color||A.hue(o&&(o.id||o.name));return '<span class="av '+(cls||'')+'" style="--c:'+c+'" aria-hidden="true">'+esc(A.initials(o&&o.name))+'</span>';};
A.who=function(o,sub){return '<div class="who">'+A.av(o)+'<div style="min-width:0"><b>'+esc(o.full||o.name)+'</b><small>'+esc(sub||'')+'</small></div></div>';};
A.phd=function(k,sub,bx){var s=A.sec(k)||['',k,'folder','--k1',''];return '<header class="phd" style="--tc2:var('+s[3]+')"><div class="glyph">'+ic(s[2])+'</div><div class="tx"><div class="eb">'+esc(s[5]||I.BRAND.app)+'</div><h1>'+esc(s[1])+'</h1><p>'+esc(sub||s[4])+'</p></div>'+(bx?'<div class="bx">'+bx+'</div>':'')+'</header>';};
A.empty=function(msg,k){return '<div class="empty">'+ic(k||'folder')+esc(msg)+'</div>';};
A.dbox=function(iso){var p=DA.dParts(iso);return '<div class="dbox"><b>'+(p?p.d:'')+'</b><small>'+(p?p.m:'')+'</small></div>';};
A.pct=function(a,b){return b?Math.round(a/b*100):0;};
A.copy=function(txt){(navigator.clipboard?navigator.clipboard.writeText(txt):Promise.reject()).then(function(){DA.toast('نُسخ النص، الصقيه في «نور»');}).catch(function(){var t=document.createElement('textarea');t.value=txt;document.body.appendChild(t);t.select();try{document.execCommand('copy');DA.toast('نُسخ النص');}catch(e){}t.remove();});};
A.wa=function(txt){window.open('https://wa.me/?text='+encodeURIComponent(txt),'_blank','noopener');};
A.star='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"/></svg>';
A.spark=function(vals,h){h=h||40;var w=300,mx=Math.max.apply(null,vals),mn=Math.min.apply(null,vals);if(mx===mn){mx+=1;mn-=1;}
  var pts=vals.map(function(v,i){return [i/(vals.length-1)*w,h-4-(v-mn)/(mx-mn)*(h-10)];});var d='M'+pts.map(function(p){return p[0].toFixed(1)+' '+p[1].toFixed(1);}).join(' L');
  var id='sp'+Math.random().toString(36).slice(2,7);
  return '<svg class="spark" viewBox="0 0 '+w+' '+h+'" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="'+id+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--c,rgb(var(--a-rgb)))" stop-opacity=".3"/><stop offset="1" stop-color="var(--c,rgb(var(--a-rgb)))" stop-opacity="0"/></linearGradient></defs><path d="'+d+' L'+w+' '+h+' L0 '+h+'z" fill="url(#'+id+')"/><path d="'+d+'" fill="none" stroke="var(--c,rgb(var(--a-rgb)))" stroke-width="2.2" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg>';};
A.kc=function(icon,c,val,unit,label,sub,spark){return '<div class="card kc s3" style="--c:var('+c+')"><div class="kt"><span class="ki">'+ic(icon)+'</span>'+esc(label)+'</div><div class="kv"><span data-count="'+val+'">'+val+'</span><small>'+esc(unit||'')+'</small></div>'+(spark?A.spark(spark):'')+'<div class="ks">'+(sub||'')+'</div></div>';};
A.bar=function(p,c){return '<div class="bar2" style="--c:'+(c||'var(--b)')+'"><i style="width:'+Math.max(0,Math.min(100,p))+'%"></i></div>';};

/* ---------- نموذج موحّد للإضافة والتعديل (الإلغاء و✕ يغلقان دائمًا) ---------- */
A.form=function(o){var d0=o.data||{};
  var html='<h2>'+esc(o.title)+'</h2><form class="frm" novalidate>'+o.fields.map(function(f){var v=d0[f.k]!=null?d0[f.k]:(f.def!=null?(typeof f.def==='function'?f.def():f.def):'');var req=f.req?' <em>*</em>':'';
    var inp;if(f.type==='select')inp='<select class="in" name="'+f.k+'">'+(typeof f.opts==='function'?f.opts():f.opts).map(function(x){var val=Array.isArray(x)?x[0]:x,lab=Array.isArray(x)?x[1]:x;return '<option value="'+esc(val)+'"'+(String(val)===String(v)?' selected':'')+'>'+esc(lab)+'</option>';}).join('')+'</select>';
    else if(f.type==='textarea')inp='<textarea class="in" name="'+f.k+'" placeholder="'+esc(f.ph||'')+'">'+esc(Array.isArray(v)?v.join('\n'):v)+'</textarea>';
    else if(f.type==='img')inp='<div class="row"><button type="button" class="btn ghost sm" data-pick="'+f.k+'">'+ic('img')+' اختيار صورة</button><span class="muted" data-pn="'+f.k+'">'+(v?'صورة محفوظة':'بلا صورة (يظهر غلاف مرسوم)')+'</span></div>';
    else inp='<input class="in" name="'+f.k+'" type="'+(f.type||'text')+'" value="'+esc(v)+'" placeholder="'+esc(f.ph||'')+'"'+(f.type==='number'?' inputmode="decimal"':'')+(f.min!=null?' min="'+f.min+'"':'')+(f.max!=null?' max="'+f.max+'"':'')+'>';
    return (f.half==='open'?'<div class="frow">':'')+'<label class="field"><span>'+esc(f.label)+req+'</span>'+inp+'</label>'+(f.half==='close'?'</div>':'');}).join('')+
   '</form><div class="acts">'+(o.del?'<button class="btn danger sm" data-del style="margin-inline-end:auto">'+ic('trash')+' حذف</button>':'')+'<button class="btn ghost" data-close>إلغاء</button><button class="btn gold" data-save>'+ic('check')+' حفظ</button></div>';
  var d=DA.dlg(html,{wide:o.wide});var picked={};
  $$('[data-pick]',d).forEach(function(b){b.onclick=function(){DA.pick('image/*').then(function(fs){if(!fs[0])return;DA.shrink(fs[0]).then(function(f){return DA.saveFile(f,fs[0].name);}).then(function(id){picked[b.dataset.pick]=id;$('[data-pn="'+b.dataset.pick+'"]',d).textContent='✓ '+fs[0].name;});});};});
  $('form',d).onsubmit=function(e){e.preventDefault();$('[data-save]',d).click();};
  $('[data-save]',d).onclick=function(){var out={},bad=null;o.fields.forEach(function(f){if(f.type==='img'){out[f.k]=picked[f.k]||d0[f.k]||'';return;}var el=$('[name="'+f.k+'"]',d);var v=el.value.trim();if(f.type==='number')v=v===''?'':+v;if(f.type==='lines')v=v.split('\n').map(function(x){return x.trim();}).filter(Boolean);out[f.k]=v;
      if(f.req&&(v===''||v==null||(Array.isArray(v)&&!v.length))&&!bad)bad=el;});
    if(bad){bad.focus();bad.animate&&bad.animate([{transform:'translateX(0)'},{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'translateX(0)'}],{duration:280});DA.toast('أكملي الحقول المطلوبة');return;}
    if(o.onSave(out)!==false){d.close();DA.snd('ok');}};
  if(o.del)$('[data-del]',d).onclick=function(){d.close();o.del();};
  var first=$('.in',d);if(first&&!('ontouchstart' in window))setTimeout(function(){first.focus();},60);
  return d;};
A.remove=function(id,label){var keep=DA.del(id);DA.toast('حُذف '+(label||'العنصر'),{undo:function(){DA.restore(keep);}});};

/* ---------- صفحة قائمة عامة: إضافة وتعديل وحذف وتصفية بالشكل نفسه ---------- */
/* o: {k, kind, sub, add, fields, sort, item(r)->{icon,c,title,meta,body,chips,cover,done,extra}, filter:{key,opts:[[v,l]]}, top(list)->html, empty} */
var FST={};
A.listPage=function(o){var f=FST[o.k]||'';
  var L=DA.list(o.kind,function(r){return !f||!o.filter||String(r[o.filter.key])===f;});
  L.sort(o.sort||function(a,b){return (b.d||'')<(a.d||'')?-1:(b.d||'')>(a.d||'')?1:(b.c||0)-(a.c||0);});
  var h=A.phd(o.k,o.sub,'<button class="btn gold" data-add="'+o.k+'">'+ic('plus')+' '+esc(o.add||'إضافة')+'</button>');
  if(o.top)h+=o.top(DA.list(o.kind));
  if(o.filter)h+='<div class="fbar"><button class="fchip" data-lf="'+o.k+'" data-v="" aria-pressed="'+(!f)+'">الكل</button>'+o.filter.opts.map(function(x){return '<button class="fchip" data-lf="'+o.k+'" data-v="'+esc(x[0])+'" aria-pressed="'+(f===String(x[0]))+'">'+esc(x[1])+'</button>';}).join('')+'</div>';
  h+=L.length?'<div class="gridc">'+L.map(function(r){return A.entCard(r,o.item(r),o.k);}).join('')+'</div>':A.empty(o.empty||'لا توجد عناصر بعد. أضيفي أول عنصر.',o.icon);
  LP[o.k]=o;return h;};
var LP={};A.LP=LP;
A.entCard=function(r,it,k){var cov=it.cover!=null?'<div class="cov">'+(it.cover?'<img data-fid="'+esc(it.cover)+'" alt="">':A.coverSVG(r.title||it.title,it.c))+'</div>':'';
  return '<article class="card ent'+(it.done?' done':'')+'" style="--c:'+(it.c||'var(--b)')+'">'+cov+'<div class="eh"><span class="ei">'+ic(it.icon||'folder')+'</span><div style="flex:1;min-width:0"><b>'+esc(it.title)+'</b>'+(it.meta?'<small>'+it.meta+'</small>':'')+'</div></div>'+(it.body?'<p>'+it.body+'</p>':'')+(it.extra||'')+
   '<div class="ef">'+(it.chips||'')+'<span class="sp"></span>'+(it.acts||'')+'<button class="ib" data-edit="'+k+'" data-id="'+r.id+'" aria-label="تعديل">'+ic('edit')+'</button></div></article>';};
A.openForm=function(k,id){var o=LP[k];if(!o)return;var r=id?DA.rec(id):null;
  A.form({title:(r?'تعديل ':'إضافة ')+(o.noun||'عنصر'),data:r||{},fields:o.fields,wide:o.wide,
   del:r?function(){A.remove(r.id,o.noun);}:null,
   onSave:function(v){var x=Object.assign({K:o.kind},r||{},v);if(o.before)o.before(x,!r);DA.put(x);DA.toast(r?'حُفظت التعديلات':'أُضيف «'+(v.title||v.name||o.noun)+'»');}});};
/* غلاف مرسوم لكل بطاقة بلا صورة */
A.coverSVG=function(t,c){var h=0;String(t||'').split('').forEach(function(ch){h=(h*17+ch.charCodeAt(0))%997;});var col=c&&c.indexOf('var(')<0?c:A.hue(t),k=h%3;
  var sh=k===0?'<circle cx="'+(60+h%200)+'" cy="60" r="70" fill="#fff" opacity=".12"/><circle cx="'+(260-h%120)+'" cy="140" r="90" fill="#fff" opacity=".1"/>':k===1?'<path d="M0 120 Q100 '+(60+h%40)+' 200 110 T400 100 V160 H0z" fill="#fff" opacity=".14"/><path d="M0 140 Q120 110 220 135 T400 128 V160 H0z" fill="#fff" opacity=".12"/>':'<g fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="2"><circle cx="320" cy="40" r="30"/><circle cx="320" cy="40" r="52"/><circle cx="320" cy="40" r="76"/></g>';
  return '<svg viewBox="0 0 400 160" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="cg'+h+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+col+'"/><stop offset="1" stop-color="'+col+'" stop-opacity=".7"/></linearGradient></defs><rect width="400" height="160" fill="url(#cg'+h+')"/>'+sh+'<path d="M200 58l6 13 14 2-10 10 2 14-12-7-12 7 2-14-10-10 14-2z" fill="#fff" opacity=".55"/></svg>';};

/* ---------- الغلاف الحيّ: مشهد يتبدّل مع ساعة اليوم ---------- */
/* المشهد الحيّ: يرسمه scene.js (إضاءة من ارتفاع الشمس الحقيقي) */
A.tod=function(){return {k:window.SCENE?SCENE.light().k:'day'};};
A.scene=function(kind){return window.SCENE?SCENE.html(kind):'';};

/* ---------- الرأس والشريط والجزيرة ---------- */
A.mark=function(cls){return '<img class="'+(cls||'mk')+'" src="icons/mark.svg" alt="" draggable="false">';};
A.me=function(){var c=DA.rec('me')||{},o={};Object.keys(I.ME).forEach(function(k){o[k]=c[k]!=null&&c[k]!==''?c[k]:I.ME[k];});return o;};
function shell(){var B=I.BRAND,me=A.me();
  document.getElementById('app').innerHTML=DA.fxHTML()+
  '<aside class="rail" aria-label="الأقسام"></aside>'+
  '<header class="top"><div class="top-in">'+
   '<a class="brand" href="#/home">'+A.mark()+'<span><b>'+esc(B.app)+' <span class="demo-tag">نسخة عرض</span></b><small>'+esc(B.kind)+' · <i>'+esc(me.school)+'</i></small></span></a><span class="sp"></span>'+
   '<button class="cmdk" data-act="pal" aria-label="بحث سريع">'+ic('search')+'<span>ابحثي في المنصة…</span><kbd>Ctrl K</kbd></button>'+
   '<button class="ib hide-m" data-act="studio" aria-label="الثيمات" title="الثيمات">'+ic('pal')+'</button>'+
   '<button class="ib" data-act="mode" aria-label="الوضع الليلي" title="الوضع الليلي/النهاري">'+ic('moon')+'</button>'+
   '<button class="ib hide-m" data-act="mute" aria-label="الصوت" title="الصوت">'+ic(DA.lsg('mute',false)?'mute':'vol')+'</button>'+
   (DA.standalone()?'':'<button class="install-pill" data-act="install">'+ic('dl')+'<span>ثبّتي التطبيق</span></button>')+
  '</div></header><main id="main"></main>'+
  '<nav class="dock" aria-label="تنقل سريع">'+I.DOCK.map(function(d){return d[3]?'<a href="#/'+d[0]+'" class="mid" data-k="'+d[0]+'" aria-label="'+esc(d[1])+'"><span>'+ic(d[2])+'</span></a>':'<a href="#/'+d[0]+'" data-k="'+d[0]+'">'+ic(d[2])+esc(d[1])+'</a>';}).join('')+'<a href="#" data-act="sheet" data-k="more">'+ic('apps')+'الأقسام</a></nav>'+
  '<div class="sheet" data-act="sheetx"><div class="sh-in"></div></div>';
  navHTML();}
function allSecs(){var cs=DA.list('sec').map(function(r){return A.custom(r.id);});return SEC.concat(cs);}
function navHTML(){var cur=route().k,g=null,h='<a class="rmk" href="#/home" aria-label="الرئيسية">'+A.mark('x')+'</a>';
  allSecs().forEach(function(s){if(s[0]==='settings')return;if(s[5]!==g&&g!==null)h+='<span class="sep"></span>';g=s[5];
    var cnt=I.badge?I.badge(s[0]):0;
    h+='<a href="#/'+s[0]+'" data-k="'+s[0]+'" style="--c:var('+s[3]+')"'+(cur===s[0]?' class="on" aria-current="page"':'')+' title="'+esc(s[4])+'"><span class="ic">'+ic(s[2])+'</span>'+esc(s[6]?s[1]:(s[7]||s[1]))+(cnt?'<span class="cnt">'+cnt+'</span>':'')+'</a>';});
  h+='<span class="sep"></span><a href="#" data-act="addsec" title="إضافة قسم"><span class="ic">'+ic('plus')+'</span>قسم جديد</a><a href="#/settings" data-k="settings" style="--c:var(--k6)"'+(cur==='settings'?' class="on"':'')+'><span class="ic">'+ic('gear')+'</span>الإعدادات</a>';
  var rl=$('.rail');if(rl)rl.innerHTML=h;
  var dk=I.DOCK.map(function(d){return d[0];});
  $$('.dock a').forEach(function(a){a.classList.toggle('on',a.dataset.k===cur||(a.dataset.k==='more'&&dk.indexOf(cur)<0));});}
A.nav=navHTML;
function sheetHTML(){var cur=route().k,g,h='<div class="grab"></div>';
  allSecs().forEach(function(s){if(s[0]==='settings')return;if(s[5]!==g){if(g!==null)h+='</div>';g=s[5];h+='<h6>'+esc(g||'عام')+'</h6><div class="sh-grid">';}
    h+='<a href="#/'+s[0]+'" style="--c:var('+s[3]+')"'+(cur===s[0]?' class="on"':'')+'><span class="ic">'+ic(s[2])+'</span>'+esc(s[1])+'</a>';});
  h+='</div><h6>المنصة</h6><div class="sh-grid"><a href="#" data-act="addsec" style="--c:var(--a)"><span class="ic">'+ic('plus')+'</span>إضافة قسم</a><a href="#" data-act="studio" style="--c:var(--k4)"><span class="ic">'+ic('pal')+'</span>الثيمات</a><a href="#/settings" style="--c:var(--k6)"><span class="ic">'+ic('gear')+'</span>الإعدادات</a></div>';
  $('.sheet .sh-in').innerHTML=h;}

/* ---------- البحث السريع ---------- */
A.palette=function(){var items=[];allSecs().forEach(function(s){items.push({t:s[1],s:s[4],h:'#/'+s[0],i:s[2],c:'var('+s[3]+')',g:'الأقسام'});});
  if(I.searchItems)items=items.concat(I.searchItems());
  var d=DA.dlg('<div class="ps">'+ic('search')+'<input type="search" placeholder="اسم طالبة، درس، قسم، معلمة…" aria-label="بحث"></div><div class="pr"></div>',{});d.classList.add('pal');
  var inp=$('input',d),pr=$('.pr',d),sel=0,cur=[];
  function norm(s){return String(s||'').replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي').replace(/[ًٌٍَُِّْ]/g,'').toLowerCase();}
  function draw(){var q=norm(inp.value.trim());cur=(q?items.filter(function(x){return norm(x.t+' '+(x.s||'')).indexOf(q)>=0;}):items.filter(function(x){return x.g==='الأقسام';})).slice(0,40);
    if(!cur.length){pr.innerHTML='<div class="none">لا نتائج لـ«'+esc(inp.value)+'»</div>';return;}var g='',h='';
    cur.forEach(function(x,i){if(x.g!==g){g=x.g;h+='<h6>'+esc(g)+'</h6>';}h+='<a href="'+x.h+'" data-i="'+i+'"'+(i===sel?' class="sel"':'')+' style="--c:'+(x.c||'var(--b)')+'"><span class="ic">'+ic(x.i||'folder')+'</span><span><b>'+esc(x.t)+'</b>'+(x.s?'<small>'+esc(x.s)+'</small>':'')+'</span></a>';});pr.innerHTML=h;}
  inp.oninput=function(){sel=0;draw();};
  inp.onkeydown=function(e){if(e.key==='ArrowDown'){sel=Math.min(cur.length-1,sel+1);draw();e.preventDefault();}else if(e.key==='ArrowUp'){sel=Math.max(0,sel-1);draw();e.preventDefault();}else if(e.key==='Enter'&&cur[sel]){location.hash=cur[sel].h.slice(1);d.close();}};
  pr.onclick=function(e){if(e.target.closest('a'))d.close();};
  draw();setTimeout(function(){inp.focus();},50);};
document.addEventListener('keydown',function(e){if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();A.palette();}});

/* ---------- الموجّه ---------- */
function route(){var h=(location.hash||'#/home').replace(/^#\/?/,'').split('/');return {k:h[0]||'home',a:decodeURIComponent(h[1]||'')};}
A.route=route;
var BIND=[];A.bind=function(fn){BIND.push(fn);};
A.on=function(sel,ev,fn){A.bind(function(m){$$(sel,m).forEach(function(el){el.addEventListener(ev,function(e){fn(el,e);});});});};
var lastK='';
function render(){var r=route(),m=$('#main');var fn=A.PAGES[r.k]||(DA.rec(r.k)&&DA.rec(r.k).K==='sec'?A.PAGES._custom:null);
  if(!fn){location.hash='#/home';return;}
  $('.sheet')&&$('.sheet').classList.remove('on');
  BIND=[];var html=fn(r.a,r.k);
  m.innerHTML=(r.k==='home'?'<div class="view home">'+html+'</div>':'<div class="wrap"><div class="view">'+html+'</div></div>')+footHTML();
  var b=BIND;BIND=[];b.forEach(function(f){try{f(m,r);}catch(e){console.error(e);}});
  DA.hydrate(m);countUp(m);
  if(r.k!==lastK){window.scrollTo(0,0);DA.animIn(m);if(lastK)DA.snd('nav');lastK=r.k;}
  navHTML();var s=A.sec(r.k);document.title=(s&&r.k!=='home'?s[1]+' · ':'')+I.BRAND.app+' · '+I.BRAND.kind;}
A.render=render;
A.refresh=function(){if(!document.getElementById('main'))return;var y=window.scrollY;lastK=route().k;render();window.scrollTo(0,y);};
DA.on(function(src){if(src==='local'&&!A._mute){clearTimeout(A._rt);A._rt=setTimeout(A.refresh,30);}});
/* أرقام تعدّ صعودًا عند الظهور */
var counted={};
function countUp(m){if(DA.REDUCED)return;$$('[data-count]',m).forEach(function(el){var v=el.getAttribute('data-count'),n=parseFloat(String(v).replace(/[^\d.]/g,''));if(isNaN(n)||n===0)return;var key=location.hash+v+el.parentNode.className;if(counted[key])return;counted[key]=1;
  var suf=String(v).replace(/[\d.,]/g,''),dec=String(v).indexOf('.')>=0?1:0,t0=performance.now();
  (function f(t){var k=Math.min(1,(t-t0)/900),e=1-Math.pow(1-k,3);el.textContent=(n*e).toFixed(dec)+suf;if(k<1)requestAnimationFrame(f);else el.textContent=v;})(t0);});}
/* حافة الضوء تتبع المؤشر */
document.addEventListener('pointermove',function(e){var c=e.target.closest&&e.target.closest('.card');if(!c)return;var r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px');},{passive:true});

function footHTML(){var B=I.BRAND,q=I.QUOTES[new Date().getDate()%I.QUOTES.length];
  return '<footer class="foot2 no-print"><div class="fi">'+A.mark('x')+'<div><b>'+esc(B.app)+' · '+esc(B.kind)+'</b><p>نسخة عرض ببيانات وهمية بالكامل · من تصميم منصات <b>أفق</b></p></div><span class="sp"></span>'+
   '<a class="btn ghost sm" href="https://wa.me/96876506037?text='+encodeURIComponent(B.wa)+'" target="_blank" rel="noopener">'+ic('wa')+' اطلبي منصتك</a></div><div class="q">«'+esc(q)+'»</div></footer>';}

/* ---------- الإجراءات العامة ---------- */
document.addEventListener('click',function(e){var b=e.target.closest('[data-act],[data-add],[data-edit],[data-lf]');if(!b)return;
  if(b.dataset.add){e.preventDefault();A.openForm(b.dataset.add);return;}
  if(b.dataset.edit){e.preventDefault();A.openForm(b.dataset.edit,b.dataset.id);return;}
  if(b.dataset.lf!=null){FST[b.dataset.lf]=b.dataset.v;DA.snd('tap');A.refresh();return;}
  var a=b.dataset.act;
  if(a==='sheet'){e.preventDefault();sheetHTML();$('.sheet').classList.add('on');DA.snd('tap');}
  else if(a==='sheetx'){if(e.target===b){b.classList.remove('on');}}
  else if(a==='pal'){e.preventDefault();A.palette();}
  else if(a==='studio'){e.preventDefault();$('.sheet').classList.remove('on');A.studio();}
  else if(a==='mode'){e.preventDefault();var k=DA.skin();DA.setSkin(DA.PAIR[k]||I.SKIN_DEF);DA.snd('tap');if(route().k==='home')A.refresh();}
  else if(a==='mute'){var m=!DA.lsg('mute',false);DA.lss('mute',m);b.innerHTML=ic(m?'mute':'vol');DA.toast(m?'أُطفئ الصوت':'شُغّل الصوت');}
  else if(a==='install'){DA.install();}
  else if(a==='addsec'){e.preventDefault();$('.sheet').classList.remove('on');A.addSection();}
});
A.studio=function(){var cur=DA.skin();
  var d=DA.dlg('<h2>الثيمات والمظهر</h2><div class="skins">'+DA.SKINS.map(function(s){return '<button class="skin sk-'+s[0]+'" data-sk="'+s[0]+'" aria-pressed="'+(s[0]===cur)+'"><i></i><b>'+esc(s[1])+'</b><small>'+esc(s[2])+'</small></button>';}).join('')+'</div>'+
   '<div class="set-row mt"><div class="tx"><b>حجم الخط</b></div><div class="seg" data-fs>'+[['m','عادي'],['l','كبير'],['xl','أكبر']].map(function(x){return '<button data-v="'+x[0]+'" aria-pressed="'+((DA.lsg('font','m'))===x[0])+'">'+x[1]+'</button>';}).join('')+'</div></div>'+
   '<div class="acts"><button class="btn gold" data-close>تم</button></div>',{wide:true});
  $$('[data-sk]',d).forEach(function(b){b.onclick=function(){DA.setSkin(b.dataset.sk);$$('[data-sk]',d).forEach(function(x){x.setAttribute('aria-pressed',x===b);});DA.snd('tap');};});
  $$('[data-fs] button',d).forEach(function(b){b.onclick=function(){DA.lss('font',b.dataset.v);document.documentElement.setAttribute('data-font',b.dataset.v);$$('[data-fs] button',d).forEach(function(x){x.setAttribute('aria-pressed',x===b);});};});};

/* ---------- قسم مضاف ---------- */
var COLS=[['k1','الأساسي'],['k2','الدافئ'],['k3','العسلي'],['k4','البنفسجي'],['k5','الأزرق'],['k6','الزيتوني'],['k7','الوردي'],['k8','الفيروزي']];
var ICS=[['folder','مجلد'],['book','كتاب'],['heart','قلب'],['flag','علم'],['bulb','فكرة'],['star','نجمة'],['users','فريق'],['cal','تقويم'],['trophy','كأس'],['pin','موقع'],['leaf','ورقة'],['shield','درع']];
A.addSection=function(r){r=r||{};A.form({title:r.id?'تعديل القسم':'إضافة قسم جديد',data:r,fields:[{k:'title',label:'اسم القسم',req:1,ph:'مثال: نادي القراءة'},{k:'desc',label:'وصف قصير',ph:'سطر يظهر تحت العنوان'},
   {k:'icon',label:'الأيقونة',type:'select',opts:ICS,half:'open'},{k:'color',label:'اللون',type:'select',opts:COLS,half:'close'}],
   del:r.id?function(){A.remove(r.id,'القسم');location.hash='#/home';}:null,
   onSave:function(v){var x=DA.put(Object.assign({K:'sec'},r,v));location.hash='#/'+x.id;DA.toast(r.id?'حُفظ القسم':'أُضيف القسم «'+v.title+'»');}});};
A.PAGES._custom=function(a,k){var s=DA.rec(k);
  var o={k:k,kind:'ent',noun:'عنصر',add:'إضافة عنصر',sub:s.desc,icon:s.icon,
   fields:[{k:'title',label:'العنوان',req:1},{k:'d',label:'التاريخ',type:'date',def:DA.today},{k:'txt',label:'الوصف',type:'textarea'},{k:'img',label:'صورة',type:'img'}],
   before:function(x){x.sec=k;},
   item:function(r){return {icon:s.icon||'folder',c:'var(--'+(s.color||'k1')+')',title:r.title,meta:esc(A.fmt(r.d)),body:esc(r.txt||''),cover:r.img||''};}};
  var h=A.listPage(Object.assign(o,{kind:'ent'}));
  /* اقتصر على عناصر هذا القسم */
  var L=DA.list('ent',function(e){return e.sec===k;}).sort(function(x,y){return x.d<y.d?1:-1;});
  h=A.phd(k,s.desc,'<button class="btn ghost" data-act="esec">'+ic('edit')+' تعديل القسم</button><button class="btn gold" data-add="'+k+'">'+ic('plus')+' إضافة عنصر</button>')+
   (L.length?'<div class="gridc">'+L.map(function(r){return A.entCard(r,o.item(r),k);}).join('')+'</div>':A.empty('القسم جاهز. أضيفي أول عنصر بالزر في الأعلى.',s.icon));
  A.on('[data-act="esec"]','click',function(){A.addSection(s);});
  return h;};

/* ---------- الترحيب ---------- */
function splash(){if(DA.REDUCED)return;var key=(window.APPID||'x')+'-splash';try{if(sessionStorage.getItem(key))return;sessionStorage.setItem(key,'1');}catch(e){}
  var me=A.me(),d=document.createElement('div');d.className='splash2';
  d.innerHTML='<div class="si"><div class="lg">'+A.mark('x')+'</div><div class="g">'+DA.greet()+'، أهلًا بكِ</div><div class="t">'+esc(me.short)+'</div><div class="s">'+esc(I.BRAND.app)+' · '+esc(I.BRAND.kind)+'</div></div>';
  document.body.appendChild(d);var fin=false,end=function(){if(fin)return;fin=true;d.classList.add('out');setTimeout(function(){d.remove();},900);};d.onclick=end;setTimeout(end,2400);}

/* ---------- البذر وإعادة الضبط ---------- */
A.seed=function(){return DA.bulk(I.seed(DA.today()));};
A.reset=function(){return DA.wipe().then(function(){return A.seed();}).then(function(){A.refresh();DA.toast('أُعيدت بيانات العرض كما كانت');});};
function boot(){var f=DA.lsg('font','m');document.documentElement.setAttribute('data-font',f);
  DA.load().then(function(){if(!DA.rec('seeded'))return A.seed();}).then(function(){
    shell();DA.applySkin();A._mute=true;render();A._mute=false;addEventListener('hashchange',render);splash();
    /* تحديث الغلاف والحصة كل دقيقة */
    setInterval(function(){if(route().k==='home'&&!document.querySelector('.dlg[open]'))A.refresh();},60000);
  });}
document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,0);});
})();
