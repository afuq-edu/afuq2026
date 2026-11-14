/* =====================================================================
   «دفّة» · الهيكل: الرأس والقائمة والموجّه والرئيسية والإعدادات وأدوات مشتركة
   الأقسام نفسها في pages.js. البيانات كلها سجلات DA (core.js) تُزرع من data.js
   أول مرة، وكل ما يُضاف يدويًا سجلٌّ بالشكل نفسه فيظهر بالجودة نفسها.
   ===================================================================== */
(function(){
'use strict';
var DA=window.DA,I=window.IDARA,$=DA.$,$$=DA.$$,esc=DA.esc;
var A=window.APP={};

/* ---------- أيقونات إضافية ---------- */
var X={
 trophy:'<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 21h8M9 17h6"/>',
 spark:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/>',
 medal:'<circle cx="12" cy="15" r="5"/><path d="M8.5 11L6 3h4l2 5 2-5h4l-2.5 8"/><path d="M12 13l.9 1.8 2 .3-1.4 1.4.3 2-1.8-.9-1.8.9.3-2-1.4-1.4 2-.3z"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6L19 19M5 19l1.4-1.4M17.6 6.4L19 5"/>',
 moon:'<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
 shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 door:'<path d="M5 21V4a1 1 0 0 1 1-1h9l3 2v16"/><path d="M3 21h18M13 12h.01"/>',
 chat:'<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>',
 mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
 report:'<path d="M6 3h9l4 4v14H6z"/><path d="M9 17v-3M12 17v-6M15 17v-4"/>',
 grid:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M3 15h18M9 4v16M15 4v16"/>',
 swap2:'<path d="M17 3l4 4-4 4"/><path d="M3 7h18"/><path d="M7 21l-4-4 4-4"/><path d="M21 17H3"/>',
 bus:'<rect x="4" y="3" width="16" height="15" rx="3"/><path d="M4 11h16M8 18v3M16 18v3"/><circle cx="8" cy="14.5" r="1"/><circle cx="16" cy="14.5" r="1"/>',
 wa:'<path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z"/><path d="M9 9c0 3 3 6 6 6l1-1.5-2-1-1 1c-1 0-2.5-1.5-2.5-2.5l1-1-1-2z"/>',
 copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
 magic:'<path d="M4 20L16 8M14 6l2-2 2 2-2 2zM19 11v2M18 12h2M8 3v2M7 4h2M20 3l.5 1"/>',
 student:'<circle cx="12" cy="7" r="3.5"/><path d="M5 21a7 7 0 0 1 14 0"/><path d="M9 14l3 3 3-3"/>',
 folder:'<path d="M3 6a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/>',
 pin:'<path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11z"/><circle cx="12" cy="10" r="2.2"/>',
 refresh:'<path d="M20 11a8 8 0 0 0-14.6-4.5L4 8M4 4v4h4M4 13a8 8 0 0 0 14.6 4.5L20 16M20 20v-4h-4"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
 warn:'<path d="M12 3l10 18H2z"/><path d="M12 10v4M12 17h.01"/>',
 menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
 phone:'<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>'
};
Object.keys(X).forEach(function(k){DA.P[k]=X[k];});
var ic=DA.ic;A.ic=ic;

/* ---------- الأقسام ---------- */
var SEC=[
 ['home','الرئيسية','home','--k1','لوحة القيادة اليومية',null],
 ['staff','الهيئة التدريسية','users','--k1','ملفات المعلمات والأنصبة والأوسمة','الكادر والحضور'],
 ['tatt','حضور المعلمات','check','--k5','التحضير اليومي والسجل الشهري','الكادر والحضور'],
 ['satt','حضور الطلبة','student','--k2','نسب الحضور والمتابعة','الكادر والحضور'],
 ['subs','الاحتياط','swap','--k7','توزيع ذكي عادل لحصص الغائبات','الكادر والحضور'],
 ['duty','المناوبة','shield','--k3','مواقع المناوبة اليومية','الكادر والحضور'],
 ['tt','الجدول المدرسي','grid','--k6','جداول الشعب والمعلمات','التعليم والمتابعة'],
 ['visits','الزيارات الصفية','eye','--k4','الإشرافية وتبادل الزيارات','التعليم والمتابعة'],
 ['results','النتائج وتحليلها','chart','--k8','التحصيل والمقارنة والتوصيات','التعليم والمتابعة'],
 ['plan','الخطة التشغيلية','target','--k2','الأهداف والمبادرات ونسب الإنجاز','التعليم والمتابعة'],
 ['meet','الاجتماعات','chat','--k1','المحاضر والقرارات والمتابعة','التواصل والتوثيق'],
 ['events','التقويم والفعاليات','cal','--k3','تقويم الفصل والمناسبات','التواصل والتوثيق'],
 ['circ','التعاميم والمراسلات','mail','--k6','الوارد والصادر','التواصل والتوثيق'],
 ['ach','الإنجازات والشواهد','trophy','--k3','معرض إنجازات المدرسة','التواصل والتوثيق'],
 ['honor','لوحة الشرف والأوسمة','medal','--k4','نقاط المعلمات وتكريم الطلبة','التواصل والتوثيق'],
 ['reports','التقارير','report','--k7','تقارير جاهزة للطباعة','التواصل والتوثيق'],
 ['settings','الإعدادات','gear','--k6','المظهر والنسخة الاحتياطية',null]
];
A.SEC=SEC;
A.sec=function(k){return SEC.filter(function(s){return s[0]===k;})[0]||A.custom(k);};
A.custom=function(k){var r=DA.rec(k);if(!r||r.K!=='sec')return null;return [r.id,r.title,r.icon||'folder','--'+(r.color||'k1'),r.desc||'قسم مضاف',null,1];};
A.PAGES={};

/* ---------- البيانات المشتركة ---------- */
A.school=function(){var c=DA.rec('school_cfg')||{};var o={};Object.keys(I.SCHOOL).forEach(function(k){o[k]=c[k]!=null&&c[k]!==''?c[k]:I.SCHOOL[k];});return o;};
A.teachers=function(){return DA.list('tch').sort(function(a,b){return (a.ord||0)-(b.ord||0)||(a.c||0)-(b.c||0);});};
A.T=function(id){return DA.rec(id)||{name:'—',full:'—',subj:'',id:id};};
A.classes=function(){return DA.list('cls');};
A.C=function(id){return DA.rec(id)||{name:id||'—',short:id||'—'};};
A.grid=function(){var r=DA.rec('tt_main');return r?r.grid:{};};
A.subjName=function(k){return (I.SUBJ[k]||[k||'—'])[0];};
A.subjColor=function(k){return (I.SUBJ[k]||[0,'#4A5568'])[1];};
A.today=DA.today;
/* يوم العمل: اليوم إن كان يوم دراسة، وإلا آخر يوم دراسي */
A.workday=function(){var d=new Date();while(!I.isSchool(d))d=I.addD(d,-1);return I.iso(d);};
A.isToday=function(d){return d===DA.today();};
A.dayName=function(iso){return ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'][new Date(iso+'T08:00:00').getDay()];};
A.fmt=function(iso){return iso?A.dayName(iso)+' '+DA.fmtD(iso):'';};
A.short=function(iso){var p=DA.dParts(iso);return p?p.d+' '+p.m:'';};
A.rel=function(iso){if(!iso)return '';var a=new Date(DA.today()+'T00:00:00'),b=new Date(iso+'T00:00:00'),n=Math.round((b-a)/864e5);
  if(n===0)return 'اليوم';if(n===1)return 'غدًا';if(n===-1)return 'أمس';if(n>1&&n<11)return 'بعد '+n+(n>2?' أيام':' يومين');if(n<-1&&n>-11)return 'قبل '+(-n)+(n<-2?' أيام':' يومين');return DA.fmtD(iso);};
A.hijri=function(){try{return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch(e){return '';}};
A.periodNow=function(){var d=new Date(),w=d.getDay();if(w>4)return 'عطلة نهاية الأسبوع';var m=d.getHours()*60+d.getMinutes();
  function mm(s){var p=s.split(':');return +p[0]*60+ +p[1];}
  if(m<mm(I.PERIODS[0][0]))return 'قبل بدء اليوم الدراسي';
  for(var i=0;i<I.PERIODS.length;i++){if(m>=mm(I.PERIODS[i][0])&&m<mm(I.PERIODS[i][1]))return 'الحصة '+(i+1);if(i===2&&m>=mm(I.BREAK[0])&&m<mm(I.BREAK[1]))return 'الفسحة';}
  return m<mm(I.PERIODS[6][1])?'بين الحصص':'انتهى اليوم الدراسي';};
DA.periodLabel=A.periodNow;
A.tatt=function(d){var r=DA.rec('tat_'+d);return r?r.m:{};};
A.absentOn=function(d){var m=A.tatt(d);return Object.keys(m).filter(function(k){return /^[aost]$/.test(m[k])&&DA.rec(k);});};
A.subsOn=function(d){return DA.list('sub',function(s){return s.d===d;});};
/* حصص الغائبات في يوم: [{abs,p,cls,sub}] */
A.needOn=function(d){var di=I.dayIdx(d);if(di<0)return [];var g=A.grid(),out=[],subs=A.subsOn(d);
  A.absentOn(d).forEach(function(tid){Object.keys(g).forEach(function(c){(g[c][di]||[]).forEach(function(t,p){if(t===tid)out.push({abs:tid,p:p,cls:c,sub:subs.filter(function(s){return s.abs===tid&&s.p===p;})[0]||null});});});});
  return out.sort(function(a,b){return a.p-b.p;});};
A.busyAt=function(tid,di,p){var g=A.grid();return Object.keys(g).some(function(c){return g[c][di]&&g[c][di][p]===tid;});};
A.subCount=function(tid,days){var from=days?I.iso(I.addD(new Date(),-days)):'';return DA.list('sub',function(s){return s.by===tid&&(!from||s.d>=from);}).length;};

/* ---------- أدوات العرض ---------- */
var AVC=['#173F55','#1F6F78','#A8742A','#6E3A5E','#2F6B4F','#3C4F6B','#7A2E3B','#1E5F80'];
A.initials=function(n){var p=String(n||'').replace(/^أ\.\s*/,'').split(/\s+/).filter(function(x){return x&&x!=='بنت'&&x!=='بن';});return (p[0]||'؟').charAt(0)+(p[1]?' '+p[1].replace(/^ال/,'').charAt(0):'');};
A.av=function(t,cls){var c=t&&t.subj?A.subjColor(t.subj):AVC[(String(t&&t.id).length+String(t&&t.name).length)%AVC.length];return '<span class="av '+(cls||'')+'" style="--c:'+c+'" aria-hidden="true">'+esc(A.initials(t&&t.name))+'</span>';};
A.who=function(t,sub){return '<div class="who">'+A.av(t)+'<div style="min-width:0"><b>'+esc(t.full||t.name)+'</b><small>'+esc(sub!=null?sub:A.subjName(t.subj))+'</small></div></div>';};
A.banner=function(k,sub,bx){var s=A.sec(k);return '<header class="banner" style="--tc:var('+s[3]+')"><div class="ic">'+ic(s[2])+'</div><div><h1>'+esc(s[1])+'</h1><p>'+esc(sub||s[4])+'</p></div>'+(bx?'<div class="bx">'+bx+'</div>':'')+'<svg class="wm" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.2">'+DA.P[s[2]]+'</svg></header>';};
A.medal=function(key,sm){var b=I.BADGES.filter(function(x){return x[0]===key;})[0];if(!b)return '';var col={att:'#2F7D55',vis:'#D9A64E',sub:'#7A2E3B',init:'#6E3A5E',duty:'#1F6F78',grow:'#1E5F80'}[key]||'#D9A64E';
  return '<span class="medal'+(sm?' sm':'')+'" title="'+esc(b[1])+'"><svg class="m" viewBox="0 0 60 60" aria-hidden="true"><path d="M30 3l6.5 6 8.7-1.3 2.6 8.4 7.9 3.9-2.2 8.5 4.1 7.8-6.8 5.6-.2 8.8-8.7.9-5 7.2L30 54l-7.9 3.8-5-7.2-8.7-.9-.2-8.8-6.8-5.6 4.1-7.8-2.2-8.5 7.9-3.9 2.6-8.4 8.7 1.3z" fill="'+col+'"/><circle cx="30" cy="30" r="18" fill="none" stroke="#F2CF8A" stroke-width="1.6" stroke-dasharray="2 3"/></svg><span class="g">'+ic(b[3])+'</span></span>';};
A.empty=function(msg,iconK){return '<div class="empty">'+ic(iconK||'folder')+esc(msg)+'</div>';};
A.stars=function(r){var n=r?5-r:0;n=Math.max(1,Math.min(4,n));return '<span class="stars5" aria-label="'+esc(I.RATE[r]||'')+'">'+'★★★★'.slice(0,n)+'<span style="opacity:.25">'+'★★★★'.slice(n)+'</span></span>';};
A.dbox=function(iso){var p=DA.dParts(iso);return '<div class="dbox"><b>'+(p?p.d:'')+'</b><small>'+(p?p.m:'')+'</small></div>';};
A.teacherOpts=function(sel,blank){return (blank?'<option value="">'+esc(blank)+'</option>':'')+A.teachers().map(function(t){return '<option value="'+t.id+'"'+(t.id===sel?' selected':'')+'>'+esc(t.name)+' · '+esc(A.subjName(t.subj))+'</option>';}).join('');};
A.classOpts=function(sel){return A.classes().map(function(c){return '<option value="'+c.id+'"'+(c.id===sel?' selected':'')+'>'+esc(c.name)+'</option>';}).join('');};
A.pct=function(a,b){return b?Math.round(a/b*100):0;};
A.copy=function(txt){(navigator.clipboard?navigator.clipboard.writeText(txt):Promise.reject()).then(function(){DA.toast('نُسخ النص');}).catch(function(){var t=document.createElement('textarea');t.value=txt;document.body.appendChild(t);t.select();try{document.execCommand('copy');DA.toast('نُسخ النص');}catch(e){}t.remove();});};
A.wa=function(txt){window.open('https://wa.me/?text='+encodeURIComponent(txt),'_blank','noopener');};
A.spark=function(vals,h){h=h||60;var w=300,mx=Math.max.apply(null,vals),mn=Math.min.apply(null,vals);if(mx===mn){mx+=1;mn-=1;}
  var pts=vals.map(function(v,i){return [i/(vals.length-1)*w,h-6-(v-mn)/(mx-mn)*(h-14)];});var d='M'+pts.map(function(p){return p[0].toFixed(1)+' '+p[1].toFixed(1);}).join(' L');
  return '<svg class="spark" viewBox="0 0 '+w+' '+h+'" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="spg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgb(var(--a-rgb))" stop-opacity=".35"/><stop offset="1" stop-color="rgb(var(--a-rgb))" stop-opacity="0"/></linearGradient></defs><path class="f" d="'+d+' L'+w+' '+h+' L0 '+h+'z"/><path class="l" d="'+d+'"/></svg>';};

/* ---------- نموذج موحّد للإضافة والتعديل (الإلغاء يغلق دائمًا) ---------- */
A.form=function(o){var d0=o.data||{};
  var html='<h2>'+esc(o.title)+'</h2><form class="frm" novalidate>'+o.fields.map(function(f){var v=d0[f.k]!=null?d0[f.k]:(f.def!=null?f.def:'');var req=f.req?' <em>*</em>':'';
    var inp;if(f.type==='select')inp='<select class="in" name="'+f.k+'">'+(typeof f.opts==='string'?f.opts.replace('value="'+v+'"','value="'+v+'" selected'):f.opts.map(function(x){var val=Array.isArray(x)?x[0]:x,lab=Array.isArray(x)?x[1]:x;return '<option value="'+esc(val)+'"'+(String(val)===String(v)?' selected':'')+'>'+esc(lab)+'</option>';}).join(''))+'</select>';
    else if(f.type==='textarea')inp='<textarea class="in" name="'+f.k+'" placeholder="'+esc(f.ph||'')+'">'+esc(Array.isArray(v)?v.join('\n'):v)+'</textarea>';
    else if(f.type==='img')inp='<div class="row"><button type="button" class="btn ghost sm" data-pick="'+f.k+'">'+ic('img')+' اختيار صورة</button><span class="muted" data-pn="'+f.k+'">'+(v?'صورة محفوظة':'بلا صورة (يظهر غلاف مرسوم)')+'</span></div>';
    else inp='<input class="in" name="'+f.k+'" type="'+(f.type||'text')+'" value="'+esc(v)+'" placeholder="'+esc(f.ph||'')+'"'+(f.type==='number'?' inputmode="numeric"':'')+'>';
    return (f.half==='open'?'<div class="frow">':'')+'<label class="field"><span>'+esc(f.label)+req+'</span>'+inp+'</label>'+(f.half==='close'?'</div>':'');}).join('')+
   '</form><div class="acts">'+(o.del?'<button class="btn danger sm" data-del style="margin-inline-end:auto">'+ic('trash')+' حذف</button>':'')+'<button class="btn ghost" data-close>إلغاء</button><button class="btn gold" data-save>'+ic('check')+' حفظ</button></div>';
  var d=DA.dlg(html,{wide:o.wide});var picked={};
  $$('[data-pick]',d).forEach(function(b){b.onclick=function(){DA.pick('image/*').then(function(fs){if(!fs[0])return;DA.shrink(fs[0]).then(function(f){return DA.saveFile(f,fs[0].name);}).then(function(id){picked[b.dataset.pick]=id;$('[data-pn="'+b.dataset.pick+'"]',d).textContent='✓ '+fs[0].name;});});};});
  $('form',d).onsubmit=function(e){e.preventDefault();$('[data-save]',d).click();};
  $('[data-save]',d).onclick=function(){var out={},bad=null;o.fields.forEach(function(f){if(f.type==='img'){out[f.k]=picked[f.k]||d0[f.k]||'';return;}var el=$('[name="'+f.k+'"]',d);var v=el.value.trim();if(f.type==='number')v=v===''?'':+v;if(f.type==='lines')v=v;out[f.k]=v;
      if(f.req&&(v===''||v==null)&&!bad)bad=el;});
    if(bad){bad.focus();bad.animate&&bad.animate([{transform:'translateX(0)'},{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'translateX(0)'}],{duration:280});DA.toast('أكملي الحقول المطلوبة');return;}
    if(o.onSave(out)!==false){d.close();DA.snd('ok');}};
  if(o.del)$('[data-del]',d).onclick=function(){d.close();o.del();};
  var first=$('.in',d);if(first&&!('ontouchstart' in window))setTimeout(function(){first.focus();},60);
  return d;};
/* حذف مع تراجع */
A.remove=function(id,label){var keep=DA.del(id);DA.toast('حُذف '+(label||'العنصر'),{undo:function(){DA.restore(keep);}});};

/* ---------- الرأس والقائمة ---------- */
A.mark=function(cls){return '<img class="'+(cls||'mk')+'" src="icons/mark.svg" alt="" draggable="false">';};
function shell(){var S=A.school();
  document.getElementById('app').innerHTML=DA.fxHTML()+
  '<header class="top"><div class="top-in"><button class="ib menu" data-act="menu" aria-label="القائمة">'+ic('menu')+'</button>'+
   '<a class="brand" href="#/home">'+A.mark()+'<span><b>'+esc(S.short)+' <span class="demo-tag">نسخة عرض</span></b><small>منصة <i>دفّة</i> للإدارة المدرسية</small></span></a><span class="sp"></span>'+
   '<button class="ib hide-m" data-act="studio" aria-label="الثيمات" title="الثيمات">'+ic('pal')+'</button>'+
   '<button class="ib" data-act="mode" aria-label="الوضع الليلي" title="الوضع الليلي/النهاري">'+ic('moon')+'</button>'+
   '<button class="ib hide-m" data-act="mute" aria-label="الصوت" title="الصوت">'+ic(DA.lsg('mute',false)?'mute':'vol')+'</button>'+
   (DA.standalone()?'':'<button class="install-pill" data-act="install">'+ic('dl')+'<span>ثبّت التطبيق</span></button>')+
  '</div></header><div class="scrim" data-act="menu"></div><aside class="side" aria-label="الأقسام"><nav class="nav"></nav></aside><main id="main"></main>'+
  '<nav class="dock" aria-label="تنقل سريع"><a href="#/home" data-k="home">'+ic('home')+'الرئيسية</a><a href="#/tatt" data-k="tatt">'+ic('check')+'الحضور</a><a href="#/subs" data-k="subs">'+ic('swap')+'الاحتياط</a><a href="#/visits" data-k="visits">'+ic('eye')+'الزيارات</a><a href="#" data-act="menu" data-k="more">'+ic('apps')+'الأقسام</a></nav>';
  navHTML();}
function navHTML(){var cur=route().k,g=null,h='';
  SEC.forEach(function(s){if(s[0]==='settings')return;if(s[5]&&s[5]!==g){g=s[5];h+='<h6>'+esc(g)+'</h6>';}
    var cnt=s[0]==='subs'?A.needOn(A.workday()).filter(function(x){return !x.sub;}).length:0;
    h+='<a href="#/'+s[0]+'" data-k="'+s[0]+'" style="--c:var('+s[3]+')"'+(cur===s[0]?' class="on" aria-current="page"':'')+'><span class="ic">'+ic(s[2])+'</span>'+esc(s[1])+(cnt?'<span class="cnt">'+cnt+'</span>':'')+'</a>';});
  var cs=DA.list('sec');if(cs.length){h+='<h6>أقسام مضافة</h6>';cs.forEach(function(r){var s=A.custom(r.id);h+='<a href="#/'+r.id+'" data-k="'+r.id+'" style="--c:var('+s[3]+')"'+(cur===r.id?' class="on"':'')+'><span class="ic">'+ic(s[2])+'</span>'+esc(s[1])+'</a>';});}
  h+='<a href="#" class="add-sec" data-act="addsec"><span class="ic" style="--c:var(--a)">'+ic('plus')+'</span>إضافة قسم</a>';
  h+='<h6>المنصة</h6><a href="#/settings" data-k="settings" style="--c:var(--k6)"'+(cur==='settings'?' class="on"':'')+'><span class="ic">'+ic('gear')+'</span>الإعدادات</a>';
  h+='<div class="side-foot"><b>نسخة عرض تجريبية</b><br>كل الأسماء والبيانات وهمية. جرّبي الإضافة والتعديل بحرية، ويمكن إعادة البيانات من الإعدادات.</div>';
  $('.side .nav').innerHTML=h;
  $$('.dock a').forEach(function(a){a.classList.toggle('on',a.dataset.k===cur||(a.dataset.k==='more'&&['home','tatt','subs','visits'].indexOf(cur)<0));});}
A.nav=navHTML;

/* ---------- الموجّه ---------- */
function route(){var h=(location.hash||'#/home').replace(/^#\/?/,'').split('/');return {k:h[0]||'home',a:decodeURIComponent(h[1]||'')};}
A.route=route;
var lastK='';
function render(){var r=route(),m=$('#main');var fn=A.PAGES[r.k]||(DA.rec(r.k)&&DA.rec(r.k).K==='sec'?A.PAGES._custom:null);
  if(!fn){location.hash='#/home';return;}
  document.body.classList.remove('drawer');
  var html=fn(r.a,r.k);m.innerHTML=(r.k==='home'?'<div class="view home">'+html+'</div>':'<div class="wrap"><div class="view">'+html+'</div></div>')+footHTML();
  if(A.after)A.after(m,r);DA.hydrate(m);
  if(r.k!==lastK){window.scrollTo(0,0);DA.animIn(m);if(lastK)DA.snd('nav');lastK=r.k;}
  navHTML();var s=A.sec(r.k);document.title=(s&&r.k!=='home'?s[1]+' · ':'')+A.school().short+' · دفّة';}
A.render=render;
/* إعادة الرسم بعد أي تعديل، دون فقد موضع التمرير */
A.refresh=function(){if(!document.getElementById('main'))return;var y=window.scrollY;lastK=route().k;render();window.scrollTo(0,y);};
DA.on(function(src){if(src==='local'&&!A._mute){clearTimeout(A._rt);A._rt=setTimeout(A.refresh,30);}});

function footHTML(){var S=A.school();
  return '<footer class="foot no-print"><svg class="scene" viewBox="0 0 1200 150" preserveAspectRatio="none" aria-hidden="true"><path class="d1" d="M0 110 Q300 70 600 100 T1200 90 V150 H0z"/>'+
   '<g class="sil"><rect x="520" y="78" width="160" height="72"/><rect x="505" y="66" width="40" height="84"/><rect x="655" y="66" width="40" height="84"/>'+
   '<path d="M505 66h8v-8h8v8h8v-8h8v8h8M655 66h8v-8h8v8h8v-8h8v8h8" /><rect x="560" y="58" width="80" height="22"/><path d="M560 58h10v-8h10v8h10v-8h10v8h10v-8h10v8h10v-8h10v8"/>'+
   '<path d="M590 150v-30a10 10 0 0 1 20 0v30z" fill="var(--bg)"/>'+
   '<path d="M250 150c2-30 4-55 14-76" stroke="var(--tc)" stroke-width="5" fill="none"/><path d="M264 74c-20-6-38 2-48 12 18-4 32-4 48-12zm0 0c-4-18 4-30 16-36-2 14-8 26-16 36zm0 0c18-10 34-8 46 0-16 0-30 0-46 0zm0 0c14 6 22 18 22 30-10-10-16-20-22-30zm0 0c-14 8-20 20-22 32 8-12 14-22 22-32z"/>'+
   '<path d="M940 150c-2-26-4-48-12-66" stroke="var(--tc)" stroke-width="5" fill="none"/><path d="M928 84c18-6 34 0 44 10-16-4-30-2-44-10zm0 0c4-16-2-28-14-34 2 12 8 24 14 34zm0 0c-16-10-30-8-42 0 14 0 28 0 42 0zm0 0c-12 6-20 16-20 28 8-10 14-18 20-28z"/></g>'+
   '<path class="d2" d="M0 132 Q300 112 600 128 T1200 122 V150 H0z"/></svg>'+
   '<div class="fin"><div class="wrap">'+A.mark('mk" style="width:46px;height:46px')+'<div><b>'+esc(S.motto)+'</b><p>'+esc(S.name)+' · '+esc(S.cycle)+'</p><p>منصة <b style="font-size:13px">دفّة</b> للإدارة المدرسية · من تصميم منصات <b style="font-size:13px">أفق</b></p></div><span class="sp"></span>'+
   '<a class="btn ghost sm" href="https://wa.me/96876506037?text='+encodeURIComponent('السلام عليكم، أرغب في منصة «دفّة» للإدارة المدرسية لمدرستنا')+'" target="_blank" rel="noopener">'+ic('wa')+' اطلبي منصة مدرستك</a></div></div></footer>';}

/* ---------- الإجراءات العامة ---------- */
document.addEventListener('click',function(e){var b=e.target.closest('[data-act]');if(!b)return;var a=b.dataset.act;
  if(a==='menu'){e.preventDefault();document.body.classList.toggle('drawer');}
  else if(a==='studio'){e.preventDefault();A.studio();}
  else if(a==='mode'){e.preventDefault();var k=DA.skin();DA.setSkin(DA.PAIR[k]||'sanaN');DA.snd('tap');}
  else if(a==='mute'){var m=!DA.lsg('mute',false);DA.lss('mute',m);b.innerHTML=ic(m?'mute':'vol');DA.toast(m?'أُطفئ الصوت':'شُغّل الصوت');}
  else if(a==='install'){DA.install();}
  else if(a==='addsec'){e.preventDefault();A.addSection();}
});
A.studio=function(){var cur=DA.skin();
  var d=DA.dlg('<h2>الثيمات والمظهر</h2><div class="skins">'+DA.SKINS.map(function(s){return '<button class="skin sk-'+s[0]+'" data-sk="'+s[0]+'" aria-pressed="'+(s[0]===cur)+'"><i></i><b>'+esc(s[1])+'</b><small>'+esc(s[2])+'</small></button>';}).join('')+'</div>'+
   '<div class="set-row mt"><div class="tx"><b>حجم الخط</b></div><div class="seg" data-fs>'+[['m','عادي'],['l','كبير'],['xl','أكبر']].map(function(x){return '<button data-v="'+x[0]+'" aria-pressed="'+((DA.lsg('font','m'))===x[0])+'">'+x[1]+'</button>';}).join('')+'</div></div>'+
   '<div class="acts"><button class="btn gold" data-close>تم</button></div>',{wide:true});
  $$('[data-sk]',d).forEach(function(b){b.onclick=function(){DA.setSkin(b.dataset.sk);$$('[data-sk]',d).forEach(function(x){x.setAttribute('aria-pressed',x===b);});DA.snd('tap');};});
  $$('[data-fs] button',d).forEach(function(b){b.onclick=function(){DA.lss('font',b.dataset.v);document.documentElement.setAttribute('data-font',b.dataset.v);$$('[data-fs] button',d).forEach(function(x){x.setAttribute('aria-pressed',x===b);});};});};

/* ---------- قسم مضاف ---------- */
var COLS=[['k1','كحلي'],['k2','فيروزي'],['k3','ذهبي'],['k4','أرجواني'],['k5','أخضر'],['k6','رمادي'],['k7','عنابي'],['k8','بحري']];
var ICS=[['folder','مجلد'],['book','كتاب'],['heart','قلب'],['flag','علم'],['bulb','فكرة'],['star','نجمة'],['users','فريق'],['cal','تقويم'],['trophy','كأس'],['pin','موقع'],['bus','حافلة'],['shield','درع']];
A.addSection=function(r){r=r||{};A.form({title:r.id?'تعديل القسم':'إضافة قسم جديد',data:r,fields:[{k:'title',label:'اسم القسم',req:1,ph:'مثال: لجنة السلامة المدرسية'},{k:'desc',label:'وصف قصير',ph:'سطر يظهر تحت العنوان'},
   {k:'icon',label:'الأيقونة',type:'select',opts:ICS,half:'open'},{k:'color',label:'اللون',type:'select',opts:COLS,half:'close'}],
   del:r.id?function(){A.remove(r.id,'القسم');location.hash='#/home';}:null,
   onSave:function(v){var x=DA.put(Object.assign({K:'sec'},r,v));location.hash='#/'+x.id;DA.toast(r.id?'حُفظ القسم':'أُضيف القسم «'+v.title+'»');}});};

/* ---------- الترحيب ---------- */
function splash(done){if(DA.REDUCED){done();return;}try{if(sessionStorage.getItem('idara-splash')){done();return;}sessionStorage.setItem('idara-splash','1');}catch(e){}
  var S=A.school(),d=document.createElement('div');d.className='splash';
  d.innerHTML='<div class="si"><div class="sm"><svg viewBox="0 0 200 200" aria-hidden="true"><path d="M100 8l22 48 50-14-14 50 48 22-48 22 14 50-50-14-22 48-22-48-50 14 14-50-48-22 48-22-14-50 50 14z"/><circle cx="100" cy="100" r="78"/></svg>'+A.mark('x')+'</div>'+
   '<div class="g">'+DA.greet()+'، أهلًا بكِ</div><div class="t">'+esc(S.name)+'</div><div class="s">منصة دفّة للإدارة المدرسية · '+esc(S.motto)+'</div></div><div class="skip">اضغطي للمتابعة</div>';
  document.body.appendChild(d);var fin=false,end=function(){if(fin)return;fin=true;d.classList.add('out');done();setTimeout(function(){d.remove();},900);};d.onclick=end;setTimeout(end,2900);}

/* ---------- الإعداد الأول ---------- */
A.seed=function(){var recs=I.seed(DA.today());return DA.bulk(recs);};
A.reset=function(){return DA.wipe().then(function(){try{localStorage.removeItem('idara:seen');}catch(e){}return A.seed();}).then(function(){A.refresh();DA.toast('أُعيدت بيانات العرض كما كانت');});};

function boot(){var f=DA.lsg('font','m');document.documentElement.setAttribute('data-font',f);
  DA.load().then(function(){if(!DA.rec('seeded'))return A.seed();}).then(function(){
    shell();DA.applySkin();A._mute=true;render();A._mute=false;
    addEventListener('hashchange',render);
    splash(function(){});
  });}
A.boot=boot;
document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,0);});
})();
