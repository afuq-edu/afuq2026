/* =====================================================================
   درسي · إضافة «المستويات» لمنصات صعوبات التعلم (تعمل حين يضبط PF.levels)
   - مستوى لكل طالب مستقل عن صفه، وأهدافه السنوية وقصيرة المدى من مستند
     «الأهداف بالمستويات الأربعة» (darsi/content/th-goals.js → DARSI.GOALS)
   - الخطة الفردية لكل طالب، وتحضير كل هدف باسمه (طباعة وPDF)
   - واجبات إلكترونية تصممها المعلمة (أسئلة ومهام) تصل لواجهة الطلاب، ومتابعتها
   - تقرير لكل طالب وتصدير التقارير (PDF وExcel)
   - المزامنة عبر Firebase (PF.cloud) بلا تسجيل دخول من المعلمة
   ===================================================================== */
(function(){
'use strict';
var D=window.DARSI,TB=window.TB,I=TB.I,PF=window.PF;
if(!PF||!PF.levels||!D||!D.GOALS)return;
var $=D.$,$$=D.$$,esc=D.esc,ar=D.ar;
var LVN=['','الأول','الثاني','الثالث','الرابع'],SEMN={'1':'الأول','2':'الثاني','1+2':'الأول والثاني'};
var LVC=['','#3D9BE9','#2FA36B','#F28C38','#C46BD8'];
function rows(lv){return D.GOALS['th'+lv]||[];}
function rowById(id){var lv=+id.charAt(2),r=rows(lv).filter(function(x){return x.id===id;})[0];return r?{lv:lv,row:r,no:rows(lv).indexOf(r)+1}:null;}
function goal(key){var p=key.split('.'),r=rowById(p[0]);if(!r)return null;var t=r.row.st[+p[1]];return t==null?null:{key:key,lv:r.lv,row:r.row,no:r.no,i:+p[1],text:t};}
function first(n){return String(n||'').trim().split(/\s+/)[0]||'';}
function dl(name,blob){var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name.replace(/[\\\/:*?"<>|]/g,'-');document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(a.href);},60000);}
function csv(name,table){var s='﻿'+table.map(function(r){return r.map(function(c){c=c==null?'':String(c);return /[",\n]/.test(c)?'"'+c.replace(/"/g,'""')+'"':c;}).join(',');}).join('\r\n');dl(name+'.csv',new Blob([s],{type:'text/csv;charset=utf-8'}));TB.toast('حُفظ الملف في التنزيلات، ويفتح في Excel',{icon:'check'});}
function ic(d){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+d+'</svg>';}
var XI={target:ic('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>'),
  send:ic('<path d="M21 3 10 14"/><path d="M21 3 14 21l-4-7-7-4z"/>'),report:ic('<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5M8 17v-3M12 17v-6M16 17v-4"/>'),
  cloud:ic('<path d="M7 18a5 5 0 1 1 1.2-9.9A6 6 0 0 1 19.5 10 4 4 0 0 1 18 18z"/>'),key:ic('<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M17 6l3 3M15 8l2 2"/>'),
  img:ic('<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 17-5-5L5 20"/>'),xl:ic('<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5M9 12l6 6M15 12l-6 6"/>')};

(window.DARSI_EXT=window.DARSI_EXT||[]).push(function(E){
var S=function(){var s=E.S;if(s&&!s.esub)ensure(s);return s;},A=E.A,V=E.V,X=E.X,GR=E.GR;
function persist(){E.persist();}
function render(){E.render();}

/* ---------- الأقسام الجديدة ---------- */
var at=E.NAV.map(function(n){return n[0];}).indexOf('students')+1;
E.NAV.splice(at,0,['iep','الخطط الفردية','target'],['ehw','واجبات الطلاب','send'],['reports','التقارير','report']);
E.X.target=XI.target;E.X.send=XI.send;E.X.report=XI.report;
E.SEC.iep={e:'🎯',c:'#E8775A',d:'مستوى كل طالب وأهدافه السنوية وقصيرة المدى، وتحضير كل هدف باسمه'};
E.SEC.ehw={e:'📨',c:'#3D9BE9',d:'واجبات بأسئلتك ومهامك تصل للطلاب في واجهتهم، ومتابعة من حلّ'};
E.SEC.reports={e:'📑',c:'#6C7BE0',d:'تقرير شامل لكل طالب، وتصدير التقارير PDF وExcel'};
E.SEC.students.d='أسماء الطلاب وشعبهم، ومستوى كل طالب ورمز دخوله';

/* ---------- تجهيز البيانات ---------- */
function code6(){var used={};S().students.forEach(function(s){if(s.code)used[s.code]=1;});var c;do{c=String(100000+Math.floor(Math.random()*900000));}while(used[c]);return c;}
function ensure(st){st.iep=st.iep||{};st.ehw=st.ehw||[];st.esub=st.esub||{};st.rnote=st.rnote||{};
  if(PF.seed&&!st.seeded){PF.seed.forEach(function(c){var cl=st.classes.filter(function(x){return D.norm(x.name)===D.norm(c.c);})[0];
      if(!cl){cl={id:D.uid('c'),g:c.g,name:c.c};st.classes.push(cl);}
      c.n.forEach(function(n){if(!st.students.some(function(s){return D.norm(s.name)===D.norm(n)&&s.cls===cl.id;}))st.students.push({id:D.uid('s'),name:n,cls:cl.id});});});
    /* الصفوف الافتراضية الفارغة (الصف الثاني…) تُحذف إن لم يكن فيها طلاب */
    st.classes=st.classes.filter(function(c){return !/^c\d$/.test(c.id)||st.students.some(function(s){return s.cls===c.id;});});st.seeded=1;}
  /* رموز ثابتة من ملف المنصة: تُطبَّق مرة واحدة فتكون الرموز نفسها على كل الأجهزة */
  if(PF.seed&&PF.seedCodes&&st.codesV!==PF.seedCodes){var ch=0;PF.seed.forEach(function(c){if(!c.k)return;var cl=st.classes.filter(function(x){return D.norm(x.name)===D.norm(c.c);})[0];if(!cl)return;
      c.n.forEach(function(n,i){var s=st.students.filter(function(x){return x.cls===cl.id&&D.norm(x.name)===D.norm(n);})[0];if(s&&c.k[i]&&s.code!==c.k[i]){st.students.forEach(function(o){if(o!==s&&o.code===c.k[i])o.code='';});s.code=c.k[i];ch=1;}});});
    if(ch)st.ehw.forEach(function(h){if(h.sids)h.to=h.sids.map(function(id){var s=st.students.filter(function(x){return x.id===id;})[0];return s&&s.code;}).filter(Boolean);h.v=(h.v||0)+1;});
    st.codesV=PF.seedCodes;setTimeout(function(){try{persist();}catch(e){}},50);}
  var used={};st.students.forEach(function(s){if(!s.code||used[s.code]){var c;do{c=String(100000+Math.floor(Math.random()*900000));}while(used[c]);s.code=c;}used[s.code]=1;});
  return st;}
(D.onLoad=D.onLoad||[]).push(function(st){ensure(st);});
function iepOf(s){var m=S().iep[s.id];if(!m)m=S().iep[s.id]={sel:[],st:{},ls:{}};m.st=m.st||{};m.ls=m.ls||{};return m;}
function lvOf(s){return s.lv||0;}
function lvChip(s){var l=lvOf(s);return l?'<span class="lv-chip" style="--lc:'+LVC[l]+'">المستوى '+LVN[l]+'</span>':'<span class="lv-chip none">لم يُحدَّد المستوى</span>';}
function progress(s){var m=iepOf(s),sel=m.sel.filter(function(k){return goal(k)&&goal(k).lv===lvOf(s);}),done=sel.filter(function(k){return m.st[k]&&m.st[k].r===1;}).length;return {n:sel.length,done:done,no:sel.filter(function(k){return m.st[k]&&m.st[k].r===0;}).length,sel:sel};}
function clsName(s){var c=E.clsOf(s.cls);return c?c.name:'';}
function gradeOf(s){var c=E.clsOf(s.cls);return c?c.g:0;}
function portalURL(s){return new URL(PF.portalPath||'../thuraya-tullab/',location.href).href+(s?'#c='+s.code:'');}

/* ---------- الطلاب: المستوى والرمز ---------- */
var origStudents=V.students;
V.students=function(el){origStudents(el);var miss=S().students.filter(function(s){return !s.lv;}).length;
  $$('.ds-st[data-stu]',el).forEach(function(b){var s=E.stu(b.dataset.stu);if(!s)return;var c=document.createElement('span');c.innerHTML=lvChip(s);b.appendChild(c.firstChild);});
  var top=document.createElement('div');top.className='stack';
  top.innerHTML=(miss?'<div class="ds-row lv-note"><span style="font-size:26px">🎯</span><div class="grow"><b>حدّدي مستوى كل طالب</b><small>المستوى مستقل عن الصف: طالب في الصف الثالث قد يكون في المستوى الثاني. انقري اسم الطالب ثم اختاري مستواه ('+ar(miss)+' بلا مستوى)</small></div></div>':'')+
   '<div class="ds-row"><span style="font-size:26px">🔑</span><div class="grow"><b>واجهة الطلاب</b><small>لكل طالب رمز دخول من ٦ أرقام يحل به واجباته من أي جهاز. أرسلي لولي الأمر رابط طالبه من ملفه.</small></div><button class="btn soft sm" data-a="codes">'+XI.key+'الرموز كلها</button></div>';
  var h=el.querySelector('.between');if(h&&h.nextSibling)el.insertBefore(top,h.nextSibling);else el.appendChild(top);};
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-stu]');if(!b||E.route().v!=='students')return;
  setTimeout(function(){var s=E.stu(b.dataset.stu),sh=document.querySelector('.sheet .stack');if(!s||!sh)return;var box=document.createElement('div');box.className='lv-prof stack';
    function draw(){box.innerHTML='<div><p class="lbl" style="margin:0 0 6px">المستوى (مستقل عن الصف)</p><div class="seg lv-seg">'+[1,2,3,4].map(function(l){return '<button type="button" data-lv="'+l+'" aria-pressed="'+(s.lv===l)+'" style="--lc:'+LVC[l]+'">'+LVN[l]+'</button>';}).join('')+'</div></div>'+
      '<div class="ds-row"><span style="font-size:24px">🔑</span><div class="grow"><small>رمز دخول الطالب</small><b class="lv-code">'+esc(s.code)+'</b></div><button class="btn soft sm" data-share-stu="'+s.id+'">'+XI.send+'رابط الطالب</button></div>'+
      '<button class="btn gold block" data-go="iep/'+s.id+'">'+XI.target+'الخطة الفردية وأهداف '+esc(first(s.name))+'</button><button class="btn soft block" data-go="reports/'+s.id+'">'+XI.report+'تقرير الطالب</button>';
      $$('[data-lv]',box).forEach(function(x){x.onclick=function(){s.lv=+x.dataset.lv;persist();draw();render();TB.toast('المستوى '+LVN[s.lv]+' لـ'+first(s.name),{icon:'check'});};});}
    draw();sh.insertBefore(box,sh.children[2]||null);},30);});
function shareStu(s){var url=portalURL(s),msg='مرحبًا، هذا رابط واجبات '+first(s.name)+' في منصة '+PF.teacher+'.\nيفتح مباشرة، ورمز الدخول: '+s.code+'\n'+url;
  TB.sheet('<div class="stack"><p class="lead" style="margin:0">'+esc(s.name)+'</p><p class="note">رابط خاص بالطالب يدخل به مباشرة إلى واجباته، أو يدخل من الرابط العام بالرمز <b>'+esc(s.code)+'</b>.</p>'+
    '<div class="ds-link"><code>'+esc(url)+'</code></div><div class="row"><button class="btn soft" data-cp>'+X.copy+'نسخ الرابط</button><button class="btn ds-wa" data-wa>'+X.wa+'واتساب</button></div></div>',{title:'رابط الطالب',icon:'user'});
  $('.sheet [data-cp]').onclick=function(){E.copy(url);};$('.sheet [data-wa]').onclick=function(){E.waShare(msg);};}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-share-stu]');if(!b)return;TB.closeSheet();setTimeout(function(){shareStu(E.stu(b.dataset.shareStu));},250);});
A.codes=function(){var st=S().students;TB.sheet('<div class="stack"><p class="note">الرابط العام لواجهة الطلاب، يدخل كل طالب برمزه:</p><div class="ds-link"><code>'+esc(portalURL())+'</code><button class="round-btn" data-copy-url="'+esc(portalURL())+'" aria-label="نسخ">'+X.copy+'</button></div>'+
  S().classes.map(function(c){var l=st.filter(function(s){return s.cls===c.id;});if(!l.length)return '';return '<h3 class="h" style="margin:6px 0 0">'+esc(c.name)+'</h3>'+l.map(function(s){return '<div class="ds-row"><b class="grow">'+esc(s.name)+'</b>'+lvChip(s)+'<b class="lv-code sm">'+esc(s.code)+'</b><button class="round-btn" data-share-stu="'+s.id+'" aria-label="رابط '+esc(s.name)+'">'+XI.send+'</button></div>';}).join('');}).join('')+
  '<button class="btn soft block" data-a="printCodes">'+X.print+'طباعة بطاقات الدخول</button></div>',{title:'رموز دخول الطلاب',icon:'users'});};
A.printCodes=function(){var u=portalURL();E.out('print','<div class="pp port lv-cards">'+S().students.map(function(s){return '<div class="lv-card"><b>'+esc(s.name)+'</b><small>'+esc(clsName(s))+'</small><span>رمز الدخول</span><i>'+esc(s.code)+'</i><small dir="ltr">'+esc(u)+'</small></div>';}).join('')+'</div>','بطاقات دخول الطلاب',false);};

/* ---------- الخطط الفردية ---------- */
function pickLesson(unit,text){var w=D.norm(text).split(/\s+/).filter(function(x){return x.length>2;}),best=unit.lessons[0],bs=-1;
  unit.lessons.forEach(function(L){var t=D.norm(L.t+' '+(L.goals||[]).join(' ')+' '+(L.annual||'')),sc=w.filter(function(x){return t.indexOf(x.replace(/^ال/,''))>=0;}).length;if(sc>bs){bs=sc;best=L;}});return best;}
function unitOf(g){var b=D.REG.books['th'+g.lv];return g.row.u!=null&&b?b.units[g.row.u]:null;}
function baseLesson(s,g){var u=unitOf(g);if(!u)return null;var m=iepOf(s),id=m.ls[g.key];return (id&&D.REG.lessons[id])||pickLesson(u,g.text);}
function pseudo(s,key){var g=goal(key);if(!g)return null;var base=baseLesson(s,g);
  var L=Object.assign({},base||{t:g.row.sk,subj:'math',book:'th'+g.lv,sc:'school',show:[],acts:[],warm:[],n:g.no,uname:g.row.sk,grade:0},
   {id:'iep~'+s.id+'~'+key,goals:[g.text],annual:g.row.an,gno:ar(g.no),uname:g.row.sk+' · '+g.row.an,sname:s.name,gradeT:GR[gradeOf(s)]||'',semT:SEMN[g.row.sem]||'الأول',
    back:'iep/'+s.id,backT:'خطة '+first(s.name),eyebrow:'الخطة الفردية · '+s.name+' · المستوى '+LVN[g.lv]+' · الهدف '+ar(g.no)+'-'+ar(g.i+1),noPlay:!base});
  if(!base){L.p='';}D.REG.lessons[L.id]=L;return L;}
V.iep=function(el,r){if(r.id==='doc')return docView(el);if(r.id&&r.id.indexOf('~')>0){var p=r.id.split('~'),s=E.stu(p[0]),L=s&&pseudo(s,p[1]);if(!L){el.innerHTML='<div class="ds-empty">الهدف غير موجود</div>';return;}return E.planView(el,L);}
  if(r.id){var s2=E.stu(r.id);if(s2)return stuIEP(el,s2);}
  var st=S().students;
  el.innerHTML='<div class="between"><div><p class="eyebrow">🎯 الخطط الفردية</p><h1 class="h-xl" style="margin:0">الخطط الفردية</h1><p class="sub" style="margin:4px 0 0">اختاري الطالب، ثم مستواه وأهدافه، فتصلك خطته وتحضير كل هدف باسمه</p></div><div class="row"><button class="btn soft" data-go="iep/doc">📘 الأهداف بالمستويات الأربعة</button>'+(PF.goalsPdf?'<a class="btn ghost" href="'+esc(PF.goalsPdf)+'" target="_blank" rel="noopener">'+X.dl+'المستند الأصلي PDF</a>':'')+'</div></div>'+
   '<div class="lv-sum">'+[1,2,3,4].map(function(l){var n=st.filter(function(s){return s.lv===l;}).length;return '<div style="--lc:'+LVC[l]+'"><b>'+ar(n)+'</b><small>المستوى '+LVN[l]+'</small></div>';}).join('')+'</div>'+
   (st.length?S().classes.map(function(c){var l=st.filter(function(s){return s.cls===c.id;});if(!l.length)return '';return '<section class="card glass stack"><h2 class="h" style="margin:0">'+esc(c.name)+' <span class="chip">'+ar(l.length)+'</span></h2><div class="lv-list">'+l.map(function(s){var p=progress(s);
     return '<button class="lv-st" data-go="iep/'+s.id+'"><span class="av">'+E.av(s)+'</span><span class="grow"><b>'+esc(s.name)+'</b>'+lvChip(s)+'</span><span class="lv-pr"><small>'+(p.n?ar(p.done)+' من '+ar(p.n)+' هدفًا':'لا أهداف بعد')+'</small><i style="--p:'+(p.n?Math.round(p.done/p.n*100):0)+'%"></i></span></button>';}).join('')+'</div></section>';}).join(''):'<div class="ds-empty">أضيفي الطلاب أولًا من قسم الطلاب</div>');};
function docView(el){var lv=S().ui.docLv||1;
  el.innerHTML='<div class="between"><button class="btn ghost sm" data-go="iep">'+I.next+'الخطط الفردية</button><div class="row"><button class="btn soft sm" data-a="printDoc">'+X.print+'طباعة</button><button class="btn soft sm" data-a="printDoc" data-m="pdf">'+X.dl+'PDF</button>'+(PF.goalsPdf?'<a class="btn ghost sm" href="'+esc(PF.goalsPdf)+'" target="_blank" rel="noopener">المستند الأصلي</a>':'')+'</div></div>'+
   '<div><p class="eyebrow">📘 قسم التربية الخاصة · جنوب الباطنة</p><h1 class="h-xl" style="margin:0">الأهداف السنوية والأهداف قصيرة المدى</h1><p class="sub" style="margin:4px 0 0">الخطة التربوية التعليمية بالمستويات الأربعة، للفصلين الأول والثاني</p></div>'+
   '<div class="seg lv-seg">'+[1,2,3,4].map(function(l){return '<button data-doclv="'+l+'" aria-pressed="'+(l===lv)+'" style="--lc:'+LVC[l]+'">المستوى '+LVN[l]+'</button>';}).join('')+'</div>'+
   rows(lv).map(function(r,i){return rowCard(r,i+1,lv);}).join('');
  $$('[data-doclv]',el).forEach(function(b){b.onclick=function(){S().ui.docLv=+b.dataset.doclv;persist();render();};});}
function rowCard(r,no,lv,s){var m=s&&iepOf(s),u=unitOf({row:r,lv:lv});
  return '<section class="card glass lv-row" style="--lc:'+LVC[lv]+'"><header><span class="no">'+ar(no)+'</span><div class="grow"><small>'+esc(r.sk)+' · الفصل '+SEMN[r.sem]+(u?' · '+ar(u.lessons.length)+' دروس جاهزة':'')+'</small><b>'+esc(r.an)+'</b>'+(r.pg?'<small class="pg">📖 '+esc(r.pg)+'</small>':'')+'</div>'+
   (s?'<button class="btn ghost sm" data-allrow="'+r.id+'">'+(r.st.every(function(_,i){return m.sel.indexOf(r.id+'.'+i)>=0;})?'إلغاء الكل':'اختيار الكل')+'</button>':'')+'</header>'+
   '<ol class="lv-goals">'+r.st.map(function(t,i){var k=r.id+'.'+i;if(!s)return '<li>'+esc(t)+'</li>';var on=m.sel.indexOf(k)>=0,st=m.st[k]||{};
     return '<li class="'+(on?'on':'')+(st.r===1?' ok':st.r===0?' no':'')+'"><button class="lv-ck" data-sel="'+k+'" aria-pressed="'+on+'" aria-label="اختيار الهدف"></button><div class="grow"><span>'+esc(t)+'</span>'+
      (on?'<div class="lv-act"><div class="ds-obj"><button class="y" data-res="'+k+'|1" aria-pressed="'+(st.r===1)+'" aria-label="أنجز">✓</button><button class="n" data-res="'+k+'|0" aria-pressed="'+(st.r===0)+'" aria-label="لم ينجز">✗</button></div><input type="date" class="input sm" data-dt="'+k+'" value="'+esc(st.d||'')+'" aria-label="التاريخ">'+
       '<button class="btn gold sm" data-go="iep/'+s.id+'~'+k+'">📝 التحضير</button>'+(u?'<button class="btn soft sm" data-lsn="'+k+'">'+I.play+'العرض</button>':'')+'</div>':'')+'</div></li>';}).join('')+'</ol></section>';}
function stuIEP(el,s){var lv=lvOf(s),m=iepOf(s),p=progress(s),only=S().ui.iepOnly;
  el.innerHTML='<div class="between"><button class="btn ghost sm" data-go="iep">'+I.next+'كل الطلاب</button><div class="row"><button class="btn soft sm" data-a="printIEP" data-s="'+s.id+'">'+X.print+'طباعة الخطة</button><button class="btn soft sm" data-a="printIEP" data-m="pdf" data-s="'+s.id+'">'+X.dl+'PDF الخطة</button><button class="btn gold sm" data-a="printAllPlans" data-m="pdf" data-s="'+s.id+'">'+X.dl+'تحاضير '+esc(first(s.name))+' كلها</button></div></div>'+
   '<section class="card glass lv-head"><span class="av big">'+E.av(s)+'</span><div class="grow"><p class="eyebrow">'+esc(clsName(s))+'</p><h1 class="h-xl" style="margin:0">'+esc(s.name)+'</h1>'+
   '<div class="seg lv-seg" style="margin-top:10px">'+[1,2,3,4].map(function(l){return '<button data-setlv="'+l+'" aria-pressed="'+(l===lv)+'" style="--lc:'+LVC[l]+'">المستوى '+LVN[l]+'</button>';}).join('')+'</div></div>'+
   '<div class="ds-kpi"><div><b>'+ar(p.n)+'</b><small>هدفًا مختارًا</small></div><div><b>'+ar(p.done)+'</b><small>أنجز</small></div><div><b>'+ar(p.no)+'</b><small>لم ينجز</small></div></div></section>'+
   (!lv?'<div class="ds-empty">اختاري مستوى '+esc(first(s.name))+' أولًا، فتظهر أهداف ذلك المستوى لتختاري منها</div>':
    '<div class="ds-row"><div class="grow"><b>أهداف المستوى '+LVN[lv]+'</b><small>اختاري الأهداف قصيرة المدى التي يعمل عليها '+esc(first(s.name))+'، ثم سجّلي أنجز أو لم ينجز وتاريخه. لكل هدف تحضير باسمه.</small></div><button class="btn ghost sm" data-only aria-pressed="'+!!only+'">'+(only?'عرض كل الأهداف':'المختارة فقط')+'</button></div>'+
    rows(lv).map(function(r,i){if(only&&!r.st.some(function(_,j){return m.sel.indexOf(r.id+'.'+j)>=0;}))return '';return rowCard(r,i+1,lv,s);}).join('')||'<div class="ds-empty">لم تختاري أهدافًا بعد</div>');
  $$('[data-setlv]',el).forEach(function(b){b.onclick=function(){s.lv=+b.dataset.setlv;persist();render();};});
  var o=$('[data-only]',el);if(o)o.onclick=function(){S().ui.iepOnly=!only;persist();render();};
  $$('[data-sel]',el).forEach(function(b){b.onclick=function(){var k=b.dataset.sel,i=m.sel.indexOf(k);if(i>=0)m.sel.splice(i,1);else m.sel.push(k);persist();E.render({keep:1});};});
  $$('[data-allrow]',el).forEach(function(b){b.onclick=function(){var r=rowById(b.dataset.allrow).row,ks=r.st.map(function(_,i){return r.id+'.'+i;}),all=ks.every(function(k){return m.sel.indexOf(k)>=0;});
    if(all)m.sel=m.sel.filter(function(k){return ks.indexOf(k)<0;});else ks.forEach(function(k){if(m.sel.indexOf(k)<0)m.sel.push(k);});persist();E.render({keep:1});};});
  $$('[data-res]',el).forEach(function(b){b.onclick=function(){var a=b.dataset.res.split('|'),k=a[0],v=+a[1],c=m.st[k]=m.st[k]||{};c.r=c.r===v?null:v;if(c.r!=null&&!c.d)c.d=D.ymd();persist();E.render({keep:1});};});
  $$('[data-dt]',el).forEach(function(i){i.onchange=function(){var c=m.st[i.dataset.dt]=m.st[i.dataset.dt]||{};c.d=i.value;persist();};});
  $$('[data-lsn]',el).forEach(function(b){b.onclick=function(){var g=goal(b.dataset.lsn),u=unitOf(g),cur=baseLesson(s,g);
    TB.sheet('<div class="stack"><p class="note">دروس «'+esc(u.t)+'» الجاهزة. الدرس المختار يُبنى عليه تحضير هذا الهدف.</p>'+u.lessons.map(function(L){return '<div class="ds-row"><b class="grow">'+esc(L.t)+'</b><button class="btn soft sm" data-play="'+L.id+'">'+I.play+'عرض</button><button class="btn '+(cur&&cur.id===L.id?'gold':'ghost')+' sm" data-pickls="'+L.id+'">'+(cur&&cur.id===L.id?'✓ المرتبط':'اربطيه بالهدف')+'</button></div>';}).join('')+'</div>',{title:'دروس الهدف',icon:'play'});
    $$('.sheet [data-pickls]').forEach(function(x){x.onclick=function(){m.ls[g.key]=x.dataset.pickls;persist();TB.closeSheet();TB.toast('رُبط الدرس بالهدف',{icon:'check'});};});};});}
A.printDoc=function(b){var lv=S().ui.docLv||1;E.out(b.dataset.m||'print',[1,2,3,4].filter(function(l){return b.dataset.all||l===lv;}).map(function(l){return goalsTable(l,null);}).join(''),'الأهداف بالمستويات - المستوى '+LVN[lv]);};
function goalsTable(lv,s){var m=s&&iepOf(s),list=rows(lv).map(function(r,i){return {r:r,no:i+1,st:r.st.map(function(t,j){return {k:r.id+'.'+j,t:t};}).filter(function(x){return !s||m.sel.indexOf(x.k)>=0;})};}).filter(function(x){return x.st.length;});
  var head='<div class="lv-ph"><div><b>سلطنة عمان</b><span>وزارة التربية والتعليم</span><span>المديرية العامة للتربية والتعليم بمحافظة جنوب الباطنة</span><span>دائرة البرامج التعليمية – قسم التربية الخاصة</span></div><div class="ttl">'+(s?'الخطة التربوية التعليمية الفردية':'الخطة التربوية التعليمية (الأهداف السنوية طويلة المدى والأهداف التعليمية قصيرة المدى)')+'</div></div>'+
   (s?'<table class="lv-info"><tr><td>اسم الطالب: <b>'+esc(s.name)+'</b></td><td>الصف: <b>'+esc(clsName(s))+'</b></td><td>المستوى: <b>'+LVN[lv]+'</b></td><td>المادة: <b>الرياضيات</b></td></tr><tr><td colspan="2">المدرسة: <b>'+esc(E.sv('school'))+'</b></td><td>المعلمة: <b>'+esc(E.sv('teacher'))+'</b></td><td>العام الدراسي: <b>'+esc(S().settings.year||'')+'</b></td></tr></table>':'<p class="lv-lv">المستوى '+LVN[lv]+' ('+['','الصف الأول الأساسي','الصف الثاني الأساسي','الصف الثالث الأساسي','الصف الرابع الأساسي'][lv]+')</p>');
  var body='<table class="lv-pt"><colgroup><col style="width:4%"><col style="width:12%"><col style="width:22%"><col style="width:40%"><col style="width:7%"><col style="width:7%"><col style="width:8%"></colgroup><thead><tr><th>م</th><th>المهارة</th><th>الهدف السنوي</th><th>الأهداف التعليمية (قصيرة المدى) التابعة له</th><th>الفصل الدراسي</th><th>أنجز (✓)<br>لم ينجز (✗)</th><th>التاريخ</th></tr></thead><tbody>'+
   list.map(function(x){return x.st.map(function(g,j){var st=m&&m.st[g.k]||{};return '<tr>'+(j?'':'<td rowspan="'+x.st.length+'" class="c">'+ar(x.no)+'</td><td rowspan="'+x.st.length+'" class="c">'+esc(x.r.sk)+'</td><td rowspan="'+x.st.length+'">'+esc(x.r.an)+'</td>')+'<td>'+esc(g.t)+'</td>'+(j?'':'<td rowspan="'+x.st.length+'" class="c">'+esc(x.r.sem)+'</td>')+'<td class="c big">'+(st.r===1?'✓':st.r===0?'✗':'')+'</td><td class="c">'+(st.d?esc(D.fdate(st.d)):'')+'</td></tr>';}).join('');}).join('')+'</tbody></table>';
  var sig='<div class="sig"><span>معلمة صعوبات التعلم: أ/ '+esc(String(E.sv('teacher')).replace(/^(أ|ا)\s*[\.\/]\s*/,''))+'</span><span>مشرفة صعوبات التعلم: أ/ '+esc(E.sv('sup')||'....................')+'</span><span>يعتمد، مديرة المدرسة: أ/ '+esc(E.sv('head')||'....................')+'</span></div>';
  return '<div class="pp lv-print">'+head+body+sig+'</div>';}
A.printIEP=function(b){var s=E.stu(b.dataset.s);if(!s.lv)return TB.toast('اختاري المستوى أولًا');if(!progress(s).n)return TB.toast('اختاري أهداف الطالب أولًا');E.out(b.dataset.m||'print',goalsTable(s.lv,s),'الخطة الفردية - '+s.name);};
A.printAllPlans=function(b){var s=E.stu(b.dataset.s),p=progress(s);if(!p.n)return TB.toast('اختاري أهداف الطالب أولًا');E.out(b.dataset.m||'print',p.sel.map(function(k){return E.planPrintHTML(pseudo(s,k),s.name);}).join(''),'تحاضير '+s.name);};

/* ---------- واجبات الطلاب الإلكترونية ---------- */
var KT={mcq:['🔘','اختيار من متعدد'],tf:['✅','صح أو خطأ'],num:['🔢','إجابة بعدد'],task:['📸','مهمة (كتابة أو صورة)'],pack:['📚','أسئلة درس جاهز']};
function subsOf(hw){var o=[];Object.keys(S().esub).forEach(function(k){var x=S().esub[k];if(x.hw===hw.id)o.push(x);});return o;}
function cloudNote(){var c=D.CLOUD;if(!c)return '<div class="ds-row lv-note"><span style="font-size:24px">☁️</span><div class="grow"><b>المزامنة غير مفعّلة</b><small>الواجبات الإلكترونية تحتاج اتصالًا بالإنترنت</small></div></div>';
  return '<div class="ds-row lv-cloud" data-st="'+c.st+'"><i></i><div class="grow"><b>'+esc(c.msg)+'</b><small>واجهة الطلاب: <span dir="ltr">'+esc(portalURL())+'</span></small></div><button class="btn soft sm" data-copy-url="'+esc(portalURL())+'">'+X.copy+'نسخ</button></div>';}
V.ehw=function(el,r){if(r.id==='new'||(r.id&&r.id.indexOf('edit~')===0))return builder(el,r.id==='new'?null:r.id.slice(5));if(r.id){var h=S().ehw.filter(function(x){return x.id===r.id;})[0];if(h)return follow(el,h);}
  var list=S().ehw.slice().sort(function(a,b){return b.at-a.at;});
  el.innerHTML=E.head('ehw','<button class="btn gold" data-go="ehw/new">'+I.plus+'واجب جديد</button>').replace(/<div class="ds-filter">[\s\S]*$/,'')+cloudNote()+
   (list.length?'<div class="stack">'+list.map(function(h){var subs=subsOf(h),n=h.to.length,avg=subs.length?Math.round(subs.reduce(function(a,x){return a+x.sc/x.mx;},0)/subs.length*100):null;
     return '<button class="lv-hw'+(h.open?'':' closed')+'" data-go="ehw/'+h.id+'"><span class="em">'+(h.open?'📨':'🔒')+'</span><span class="grow"><small>'+D.fdate(D.ymd(new Date(h.at)))+(h.due?' · التسليم '+D.fdate(h.due):'')+' · '+ar(h.items.length)+' سؤال/مهمة</small><b>'+esc(h.t)+'</b><span class="lv-pr"><small>حلّه '+ar(subs.length)+' من '+ar(n)+(avg!=null?' · المتوسط '+ar(avg)+'%':'')+'</small><i style="--p:'+(n?Math.round(subs.length/n*100):0)+'%"></i></span></span></button>';}).join('')+'</div>':
    '<div class="ds-empty">صمّمي أول واجب: اختاري الطلاب، وأضيفي أسئلتك (اختيار، صح وخطأ، عدد) أو مهمة يكتب فيها الطالب أو يصوّر عمله، أو أسئلة درس جاهز من المستويات الأربعة.</div>');};
function blankItem(k){return k==='mcq'?{k:'mcq',q:'',o:['','',''],a:0}:k==='tf'?{k:'tf',q:'',a:true}:k==='num'?{k:'num',q:'',a:''}:k==='task'?{k:'task',q:'',txt:true,photo:true}:{k:'pack',ls:''};}
function builder(el,editId){var ex=editId&&S().ehw.filter(function(x){return x.id===editId;})[0];
  var d=S().ui.draft&&S().ui.draft._for===(editId||'new')?S().ui.draft:(S().ui.draft=ex?JSON.parse(JSON.stringify(ex.src||{t:ex.t,due:ex.due,note:ex.note,to:ex.sids||[],items:[]})):{t:'',due:'',note:'',to:[],items:[]});d._for=editId||'new';
  var st=S().students;
  function itemHTML(it,i){var h='<section class="card glass lv-q" data-i="'+i+'"><header><span class="no">'+ar(i+1)+'</span><b class="grow">'+KT[it.k][0]+' '+KT[it.k][1]+'</b><button class="round-btn" data-up="'+i+'" aria-label="لأعلى">↑</button><button class="round-btn" data-del="'+i+'" aria-label="حذف">'+X.trash+'</button></header>';
    if(it.k==='pack'){var opts='';[1,2,3,4].forEach(function(l){var b=D.REG.books['th'+l];if(!b)return;opts+='<optgroup label="المستوى '+LVN[l]+'">'+D.lessonsOf(b.id).map(function(L){return '<option value="'+L.id+'"'+(it.ls===L.id?' selected':'')+'>'+esc(L.t)+'</option>';}).join('')+'</optgroup>';});
      return h+'<label class="field"><span class="lbl">الدرس (تُضاف أسئلة واجبه التفاعلية كما هي)</span><select class="select" data-f="ls"><option value="">— اختاري الدرس —</option>'+opts+'</select></label>'+(it.ls&&D.REG.lessons[it.ls]?'<p class="note">'+ar(E.hwItems(D.REG.lessons[it.ls]).length)+' أسئلة تفاعلية</p>':'')+'</section>';}
    h+='<label class="field"><span class="lbl">'+(it.k==='task'?'وصف المهمة':it.k==='tf'?'العبارة':'السؤال')+'</span><textarea class="textarea" rows="2" data-f="q" placeholder="'+(it.k==='task'?'مثل: ارسم ٥ تفاحات ثم صوّر عملك':it.k==='tf'?'مثل: ٥ + ٣ = ٨':'اكتبي السؤال')+'">'+esc(it.q)+'</textarea></label>'+
     '<div class="row">'+(it.img?'<img class="lv-qimg" src="'+it.img+'" alt=""><button class="btn ghost sm" data-noimg="'+i+'">إزالة الصورة</button>':'<label class="btn ghost sm">'+XI.img+'إضافة صورة للسؤال<input type="file" accept="image/*" hidden data-img="'+i+'"></label>')+'</div>';
    if(it.k==='mcq')h+='<p class="lbl" style="margin:0">الخيارات (انقري الدائرة عند الإجابة الصحيحة)</p>'+it.o.map(function(o,j){return '<div class="row lv-opt"><button type="button" class="lv-ck" data-ans="'+j+'" aria-pressed="'+(it.a===j)+'" aria-label="الإجابة الصحيحة"></button><input class="input" data-o="'+j+'" value="'+esc(o)+'" placeholder="الخيار '+ar(j+1)+'">'+(it.o.length>2?'<button type="button" class="round-btn" data-odel="'+j+'" aria-label="حذف الخيار">✕</button>':'')+'</div>';}).join('')+(it.o.length<4?'<button type="button" class="btn ghost sm" data-oadd>'+I.plus+'خيار</button>':'');
    if(it.k==='tf')h+='<div class="seg"><button type="button" data-tf="1" aria-pressed="'+(it.a===true)+'">العبارة صحيحة</button><button type="button" data-tf="0" aria-pressed="'+(it.a===false)+'">العبارة خاطئة</button></div>';
    if(it.k==='num')h+='<label class="field"><span class="lbl">الإجابة الصحيحة (عدد)</span><input class="input" data-f="a" inputmode="numeric" value="'+esc(it.a)+'" style="max-width:180px"></label>';
    if(it.k==='task')h+='<div class="row"><label class="row"><input type="checkbox" data-c="txt"'+(it.txt?' checked':'')+'> إجابة مكتوبة</label><label class="row"><input type="checkbox" data-c="photo"'+(it.photo?' checked':'')+'> صورة من الطالب</label></div><p class="note">المهام تقيّمينها بنفسك من صفحة المتابعة.</p>';
    return h+'</section>';}
  el.innerHTML='<div class="between"><button class="btn ghost sm" data-go="ehw">'+I.next+'واجبات الطلاب</button><button class="btn ghost sm" data-a="dropDraft">إلغاء</button></div>'+
   '<h1 class="h-xl" style="margin:0">'+(ex?'تعديل الواجب':'واجب جديد')+'</h1>'+
   '<section class="card glass stack"><label class="field"><span class="lbl">عنوان الواجب</span><input class="input" id="hwT" value="'+esc(d.t)+'" placeholder="مثل: واجب الجمع ضمن ٢٠"></label>'+
   '<div class="row"><label class="field grow"><span class="lbl">آخر موعد للتسليم (اختياري)</span><input class="input" type="date" id="hwD" value="'+esc(d.due)+'"></label></div>'+
   '<label class="field"><span class="lbl">رسالة للطالب (اختياري)</span><input class="input" id="hwN" value="'+esc(d.note)+'" placeholder="مثل: حلّ بهدوء، وصوّر عملك في الدفتر"></label></section>'+
   '<section class="card glass stack"><div class="between"><h2 class="h" style="margin:0">لمن الواجب؟ <span class="chip">'+ar(d.to.length)+'</span></h2><div class="row"><button class="btn ghost sm" data-toall>الكل</button><button class="btn ghost sm" data-tonone>لا أحد</button></div></div>'+
   '<div class="row">'+[1,2,3,4].map(function(l){return st.some(function(s){return s.lv===l;})?'<button class="btn soft sm" data-tolv="'+l+'" style="--lc:'+LVC[l]+'">طلاب المستوى '+LVN[l]+'</button>':'';}).join('')+'</div>'+
   S().classes.map(function(c){var l=st.filter(function(s){return s.cls===c.id;});if(!l.length)return '';return '<div class="lv-to"><button class="btn ghost sm" data-tocls="'+c.id+'">'+esc(c.name)+'</button><div class="ds-reasons">'+l.map(function(s){return '<button class="cb" data-tos="'+s.id+'" aria-pressed="'+(d.to.indexOf(s.id)>=0)+'">'+esc(s.name)+(s.lv?' · م'+ar(s.lv):'')+'</button>';}).join('')+'</div></div>';}).join('')+'</section>'+
   '<h2 class="h" style="margin:6px 0 0">الأسئلة والمهام <span class="chip">'+ar(d.items.length)+'</span></h2>'+d.items.map(itemHTML).join('')+
   '<div class="lv-add">'+Object.keys(KT).map(function(k){return '<button class="ds-sec" data-add="'+k+'" style="--sc:#3D9BE9"><span class="ic">'+KT[k][0]+'</span><b>'+KT[k][1]+'</b></button>';}).join('')+'</div>'+
   '<button class="btn gold lg block" data-a="publishHw">'+XI.send+(ex?'حفظ التعديلات وإرسالها':'إرسال الواجب للطلاب')+'</button>';
  function save(){persist();}
  $('#hwT',el).oninput=function(){d.t=this.value;save();};$('#hwD',el).onchange=function(){d.due=this.value;save();};$('#hwN',el).oninput=function(){d.note=this.value;save();};
  function setTo(ids,on){ids.forEach(function(id){var i=d.to.indexOf(id);if(on&&i<0)d.to.push(id);if(!on&&i>=0)d.to.splice(i,1);});save();E.render({keep:1});}
  $('[data-toall]',el).onclick=function(){setTo(st.map(function(s){return s.id;}),true);};$('[data-tonone]',el).onclick=function(){d.to=[];save();E.render({keep:1});};
  $$('[data-tolv]',el).forEach(function(b){b.onclick=function(){setTo(st.filter(function(s){return s.lv===+b.dataset.tolv;}).map(function(s){return s.id;}),true);};});
  $$('[data-tocls]',el).forEach(function(b){b.onclick=function(){var ids=st.filter(function(s){return s.cls===b.dataset.tocls;}).map(function(s){return s.id;});setTo(ids,!ids.every(function(id){return d.to.indexOf(id)>=0;}));};});
  $$('[data-tos]',el).forEach(function(b){b.onclick=function(){setTo([b.dataset.tos],d.to.indexOf(b.dataset.tos)<0);};});
  $$('[data-add]',el).forEach(function(b){b.onclick=function(){d.items.push(blankItem(b.dataset.add));save();E.render({keep:1});setTimeout(function(){var q=$$('.lv-q');if(q.length)q[q.length-1].scrollIntoView({behavior:'smooth',block:'center'});},60);};});
  $$('.lv-q',el).forEach(function(box){var it=d.items[+box.dataset.i];
    $$('[data-f]',box).forEach(function(x){x.addEventListener(x.tagName==='SELECT'?'change':'input',function(){it[x.dataset.f]=x.value;save();if(x.tagName==='SELECT')E.render({keep:1});});});
    $$('[data-o]',box).forEach(function(x){x.oninput=function(){it.o[+x.dataset.o]=x.value;save();};});
    $$('[data-ans]',box).forEach(function(x){x.onclick=function(){it.a=+x.dataset.ans;save();E.render({keep:1});};});
    $$('[data-odel]',box).forEach(function(x){x.onclick=function(){var j=+x.dataset.odel;it.o.splice(j,1);if(it.a>=it.o.length)it.a=0;else if(it.a>j)it.a--;save();E.render({keep:1});};});
    var oa=$('[data-oadd]',box);if(oa)oa.onclick=function(){it.o.push('');save();E.render({keep:1});};
    $$('[data-tf]',box).forEach(function(x){x.onclick=function(){it.a=x.dataset.tf==='1';save();E.render({keep:1});};});
    $$('[data-c]',box).forEach(function(x){x.onchange=function(){it[x.dataset.c]=x.checked;save();};});
    $$('[data-img]',box).forEach(function(x){x.onchange=function(){var f=x.files[0];if(!f)return;D.shrink(f,900,.72).then(function(u){it.img=u;save();E.render({keep:1});});};});
    $$('[data-noimg]',box).forEach(function(x){x.onclick=function(){delete it.img;save();E.render({keep:1});};});
    $$('[data-del]',box).forEach(function(x){x.onclick=function(){if(!confirm('حذف هذا السؤال؟'))return;d.items.splice(+x.dataset.del,1);save();E.render({keep:1});};});
    $$('[data-up]',box).forEach(function(x){x.onclick=function(){var j=+x.dataset.up;if(!j)return;var t=d.items[j];d.items[j]=d.items[j-1];d.items[j-1]=t;save();E.render({keep:1});};});});}
A.dropDraft=function(){if(!confirm('إلغاء هذا الواجب وعدم إرساله؟'))return;delete S().ui.draft;persist();E.go('ehw');};
function compile(items){var out=[];items.forEach(function(it){var base={};if(it.img)base.img=it.img;
  if(it.k==='pack'){var L=D.REG.lessons[it.ls];if(L)E.hwItems(L).forEach(function(x){out.push(JSON.parse(JSON.stringify(x)));});return;}
  if(it.k==='mcq')out.push(Object.assign(base,{k:'mcq',q:it.q.trim(),o:it.o.map(function(o){return o.trim();}),a:it.a,say:it.q.trim()}));
  if(it.k==='tf')out.push(Object.assign(base,{k:'mcq',q:it.q.trim(),o:['صَحٌّ','خَطَأٌ'],a:it.a?0:1,say:it.q.trim()}));
  if(it.k==='num')out.push(Object.assign(base,{k:'num',q:it.q.trim(),a:+String(it.a).replace(/[٠-٩]/g,function(c){return '٠١٢٣٤٥٦٧٨٩'.indexOf(c);}),say:it.q.trim()}));
  if(it.k==='task')out.push(Object.assign(base,{k:'task',q:it.q.trim(),txt:!!it.txt,photo:!!it.photo}));});return out;}
function check(d){if(!d.t.trim())return 'اكتبي عنوان الواجب';if(!d.to.length)return 'اختاري الطلاب';if(!d.items.length)return 'أضيفي سؤالًا أو مهمة';
  for(var i=0;i<d.items.length;i++){var it=d.items[i],n='السؤال '+ar(i+1)+': ';if(it.k==='pack'&&!it.ls)return n+'اختاري الدرس';if(it.k!=='pack'&&!String(it.q||'').trim()&&!it.img)return n+'اكتبي نصه';
    if(it.k==='mcq'&&it.o.filter(function(o){return o.trim();}).length<it.o.length)return n+'أكملي الخيارات';if(it.k==='num'&&!/^[0-9٠-٩]+$/.test(String(it.a).trim()))return n+'اكتبي الإجابة عددًا';if(it.k==='task'&&!it.txt&&!it.photo)return n+'اختاري نوع الإجابة';}
  return null;}
A.publishHw=function(){var d=S().ui.draft,err=check(d);if(err)return TB.toast(err);var editId=d._for!=='new'?d._for:null,h=editId&&S().ehw.filter(function(x){return x.id===editId;})[0];
  var src=JSON.parse(JSON.stringify(d));delete src._for;
  if(!h){h={id:'h'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),at:Date.now(),open:true};S().ehw.push(h);}
  h.t=d.t.trim();h.due=d.due||'';h.note=d.note.trim();h.sids=d.to.slice();h.to=d.to.map(function(id){var s=E.stu(id);return s&&s.code;}).filter(Boolean);h.items=compile(d.items);h.src=src;h.v=(h.v||0)+1;
  delete S().ui.draft;persist();pushHw(h);E.go('ehw',h.id);TB.toast(editId?'حُفظ الواجب وأُرسل':'أُرسل الواجب للطلاب',{gold:true,icon:'check'});};
function pushHw(h){if(!D.CLOUD)return;D.CLOUD.putHw({t:h.t,due:h.due,note:h.note,to:h.to,items:h.items,open:h.open,at:h.at,v:h.v,tn:PF.teacher},h.id).catch(function(){TB.toast('لم يُرفع الواجب الآن، سيُعاد رفعه عند الاتصال');});}
function follow(el,h){var subs=subsOf(h),by={};subs.forEach(function(x){by[x.code]=x;});var list=(h.sids||[]).map(function(id){return E.stu(id);}).filter(Boolean);
  var done=list.filter(function(s){return by[s.code];});
  el.innerHTML='<div class="between"><button class="btn ghost sm" data-go="ehw">'+I.next+'واجبات الطلاب</button><div class="row"><button class="btn soft sm" data-go="ehw/edit~'+h.id+'">'+X.edit+'تعديل</button><button class="btn soft sm" data-a="toggleHw" data-h="'+h.id+'">'+(h.open?'🔒 إغلاق الواجب':'🔓 فتح الواجب')+'</button><button class="btn soft sm" data-a="hwCsv" data-h="'+h.id+'">'+XI.xl+'Excel</button><button class="round-btn" data-a="delHw" data-h="'+h.id+'" aria-label="حذف">'+X.trash+'</button></div></div>'+
   '<section class="card glass stack"><p class="eyebrow">📨 '+D.fdate(D.ymd(new Date(h.at)))+(h.due?' · آخر موعد '+D.fdate(h.due):'')+(h.open?'':' · مغلق')+'</p><h1 class="h-xl" style="margin:0">'+esc(h.t)+'</h1>'+(h.note?'<p class="sub" style="margin:0">'+esc(h.note)+'</p>':'')+
   '<div class="ds-kpi"><div><b>'+ar(done.length)+'/'+ar(list.length)+'</b><small>سلّموا</small></div><div><b>'+ar(h.items.length)+'</b><small>سؤال/مهمة</small></div><div><b>'+(done.length?ar(Math.round(done.reduce(function(a,s){var x=by[s.code];return a+x.sc/x.mx;},0)/done.length*100))+'%':'—')+'</b><small>المتوسط</small></div></div></section>'+cloudNote()+
   '<section class="card glass" style="padding:0;overflow:auto"><table class="ds-tbl lv-ft"><thead><tr><th>الطالب</th><th>الحالة</th><th>الدرجة</th><th>المحاولات</th><th></th></tr></thead><tbody>'+
   list.map(function(s){var x=by[s.code];return '<tr><td>'+esc(s.name)+'</td><td>'+(x?'<span class="lv-chip" style="--lc:#2FA36B">✓ سلّم '+esc(D.fdate(D.ymd(new Date(x.at))))+'</span>':'<span class="lv-chip none">لم يسلّم</span>')+'</td><td><b>'+(x?ar(round1(x.sc))+'/'+ar(x.mx):'—')+'</b>'+(x&&x.pend?' <small class="note">('+ar(x.pend)+' مهمة للتقييم)</small>':'')+'</td><td>'+(x?ar(x.tries||1):'')+'</td><td>'+(x?'<button class="btn soft sm" data-sub="'+esc(x.id)+'">التفاصيل</button>':'<button class="btn ghost sm" data-share-stu="'+s.id+'">تذكير</button>')+'</td></tr>';}).join('')+'</tbody></table></section>';
  $$('[data-sub]',el).forEach(function(b){b.onclick=function(){subSheet(h,S().esub[b.dataset.sub]);};});}
function round1(v){return Math.round(v*10)/10;}
function subSheet(h,x){var s=E.stu(x.sid);var full=D.CLOUD&&D.CLOUD.subs[x.id];
  TB.sheet('<div class="stack"><p class="lead" style="margin:0">'+esc(s?s.name:x.n)+' · '+ar(round1(x.sc))+'/'+ar(x.mx)+'</p>'+h.items.map(function(it,i){var v=x.it&&x.it[i],a=(full&&full.ans&&full.ans[i])||(x.ans&&x.ans[i])||{};
    return '<div class="lv-ans"><span class="no">'+ar(i+1)+'</span><div class="grow"><b>'+esc(it.q||it.s||D.plain(it.w||'')||KT[it.k]&&KT[it.k][1]||'سؤال')+'</b>'+(it.k==='task'?
      (a.txt?'<p class="lv-txt">'+esc(a.txt)+'</p>':'')+(a.img?'<img class="lv-aimg" src="'+a.img+'" alt="صورة من الطالب">':(x.ans&&x.ans[i]&&x.ans[i].hasImg&&!full?'<p class="note">صورة الطالب تظهر عند الاتصال بالإنترنت</p>':''))+
      '<div class="seg"><button data-tg="'+i+'|1" aria-pressed="'+(x.tg&&x.tg[i]===1)+'">✓ مقبولة</button><button data-tg="'+i+'|0" aria-pressed="'+(x.tg&&x.tg[i]===0)+'">✗ تحتاج إعادة</button></div>'
      :'')+'</div><span class="lv-sc '+(v==null?'':v>=.99?'ok':v>0?'mid':'no')+'">'+(it.k==='task'?(x.tg&&x.tg[i]!=null?(x.tg[i]?'✓':'✗'):'؟'):v==null?'—':v>=.99?'✓':v>0?'½':'✗')+'</span></div>';}).join('')+'</div>',{title:'إجابات الطالب',sub:h.t,icon:'check'});
  $$('.sheet [data-tg]').forEach(function(b){b.onclick=function(){var a=b.dataset.tg.split('|');x.tg=x.tg||{};x.tg[a[0]]=+a[1];rescore(h,x);persist();TB.closeSheet();render();setTimeout(function(){subSheet(h,x);},260);};});}
function rescore(h,x){var sc=0,pend=0;h.items.forEach(function(it,i){if(it.k==='task'){if(x.tg&&x.tg[i]!=null)sc+=x.tg[i];else if(x.it&&x.it[i]!=null){pend++;}}else sc+=(x.it&&x.it[i])||0;});x.sc=sc;x.pend=pend;
  var r=S().results.filter(function(q){return q.k==='hw'&&q.ref==='e:'+h.id&&q.sid===x.sid;})[0];if(r){r.score=Math.round(sc);r.max=x.mx;}}
A.toggleHw=function(b){var h=S().ehw.filter(function(x){return x.id===b.dataset.h;})[0];h.open=!h.open;persist();pushHw(h);render();};
A.delHw=function(b){var h=S().ehw.filter(function(x){return x.id===b.dataset.h;})[0];if(!confirm('حذف «'+h.t+'» من المنصة ومن واجهة الطلاب؟ (تبقى نتائجه في التقييم)'))return;S().ehw=S().ehw.filter(function(x){return x!==h;});persist();if(D.CLOUD)D.CLOUD.delHw(h.id);E.go('ehw');};
A.hwCsv=function(b){var h=S().ehw.filter(function(x){return x.id===b.dataset.h;})[0],by={};subsOf(h).forEach(function(x){by[x.code]=x;});
  csv(h.t,[['الطالب','الشعبة','المستوى','الحالة','الدرجة','من','النسبة','المحاولات','وقت التسليم']].concat((h.sids||[]).map(function(id){var s=E.stu(id);if(!s)return null;var x=by[s.code];
    return [s.name,clsName(s),s.lv?LVN[s.lv]:'',x?'سلّم':'لم يسلّم',x?round1(x.sc):'',x?x.mx:'',x?Math.round(x.sc/x.mx*100)+'%':'',x?x.tries||1:'',x?new Date(x.at).toLocaleString('ar-OM'):''];}).filter(Boolean)));};

/* استلام التسليمات من السحابة إلى بيانات المعلمة */
function mergeSubs(list){var st=S();if(!st)return;var ch=0,byCode={};st.students.forEach(function(s){byCode[s.code]=s;});
  list.forEach(function(x){var s=byCode[x.code],h=st.ehw.filter(function(q){return q.id===x.hw;})[0];if(!s||!h)return;var cur=st.esub[x.id];
    if(cur&&cur.at>=x.at)return;var o={id:x.id,hw:x.hw,code:x.code,sid:s.id,n:x.n,mx:x.mx,at:x.at,tries:x.tries||1,it:x.it||[],tg:null,
      ans:(x.ans||[]).map(function(a){return a?{txt:a.txt||'',hasImg:!!a.img}:null;})};
    rescore(h,o);st.esub[x.id]=o;ch++;
    var r=st.results.filter(function(q){return q.k==='hw'&&q.ref==='e:'+h.id&&q.sid===s.id;})[0];
    if(r){r.score=Math.round(o.sc);r.max=o.mx;r.t=o.at;}else{st.results.push({id:D.uid('r'),sid:s.id,k:'hw',ref:'e:'+h.id,score:Math.round(o.sc),max:o.mx,title:h.t,t:o.at});
      var p=Math.round(o.sc/o.mx*5);if(p>0)st.points.push({id:D.uid('p'),sid:s.id,v:p,r:'واجب',ref:'e:'+h.id,t:Date.now()});}});
  if(ch){persist();var v=E.route().v;if((v==='ehw'||v==='home'||v==='reports')&&!busy())render();}}
function busy(){var a=document.activeElement;return a&&/INPUT|TEXTAREA|SELECT/.test(a.tagName)&&a.closest('#view');}

/* ---------- التقارير ---------- */
function stuReport(s){var st=S(),c=E.clsOf(s.cls),t=E.total(s.id),lv=E.level(t),p=progress(s),m=iepOf(s);
  var days=Object.keys(st.att||{}).sort(),att=days.length?E.attStats([s],days[0],days[days.length-1])[0]:null;
  var res=st.results.filter(function(r){return r.sid===s.id;}).sort(function(a,b){return a.t-b.t;});
  var ehw=st.ehw.filter(function(h){return (h.sids||[]).indexOf(s.id)>=0;});
  return {s:s,c:c,t:t,lv:lv,p:p,m:m,att:att,res:res,ehw:ehw,pts:E.pts(s.id)};}
function reportHTML(s,print){var R=stuReport(s),st=S(),note=st.rnote[s.id]||'';
  var gl=R.p.sel.map(function(k){var g=goal(k),x=R.m.st[k]||{};return '<tr><td>'+esc(g.row.sk)+'</td><td>'+esc(g.text)+'</td><td class="c">'+(x.r===1?'✓ أنجز':x.r===0?'✗ لم ينجز':'جارٍ')+'</td><td class="c">'+(x.d?esc(D.fdate(x.d)):'')+'</td></tr>';}).join('');
  var hw=R.ehw.map(function(h){var x=st.esub[h.id+'_'+s.code];return '<tr><td>'+esc(h.t)+'</td><td class="c">'+esc(D.fdate(D.ymd(new Date(h.at))))+'</td><td class="c">'+(x?ar(round1(x.sc))+' / '+ar(x.mx):'لم يسلّم')+'</td></tr>';}).join('');
  var other=R.res.filter(function(r){return String(r.ref).indexOf('e:')!==0;}).map(function(r){var L=D.REG.lessons[r.ref];return '<tr><td>'+(r.k==='hw'?'واجب':'امتحان')+': '+esc(r.title||(L?L.t:r.ref))+'</td><td class="c">'+esc(D.fdate(D.ymd(new Date(r.t))))+'</td><td class="c">'+ar(r.score)+' / '+ar(r.max)+'</td></tr>';}).join('');
  var crit=st.criteria.map(function(k){var v=E.critPct(s.id,k);return '<tr><td>'+esc(k.n)+'</td><td class="c">'+ar(k.w)+'%</td><td class="c">'+(v==null?'—':ar(Math.round(v)))+'</td></tr>';}).join('');
  return '<div class="'+(print?'pp port ':'')+'lv-rep"><div class="lv-rh"><div><small>'+esc(E.sv('school'))+' · '+esc(st.settings.year||'')+'</small><h2>تقرير الطالب: '+esc(s.name)+'</h2><small>'+esc(R.c?R.c.name:'')+(s.lv?' · المستوى '+LVN[s.lv]:'')+' · الرياضيات · '+esc(E.sv('teacher'))+'</small></div><div class="lv-badge"><b>'+(R.t==null?'—':ar(Math.round(R.t)))+'</b><small>'+R.lv.n+'</small></div></div>'+
   '<div class="lv-kp"><div><b>'+(R.att&&R.att.pct!=null?ar(R.att.pct)+'%':'—')+'</b><small>الحضور'+(R.att&&R.att.a?' · غاب '+ar(R.att.a)+' يومًا':'')+'</small></div><div><b>'+ar(R.pts)+'</b><small>نقطة</small></div><div><b>'+ar(R.p.done)+'/'+ar(R.p.n)+'</b><small>أهداف أنجزها</small></div><div><b>'+ar(R.ehw.filter(function(h){return st.esub[h.id+'_'+s.code];}).length)+'/'+ar(R.ehw.length)+'</b><small>واجبات سلّمها</small></div></div>'+
   '<h3>الأهداف الفردية (المستوى '+(s.lv?LVN[s.lv]:'—')+')</h3>'+(gl?'<table><thead><tr><th>المهارة</th><th>الهدف قصير المدى</th><th>الحالة</th><th>التاريخ</th></tr></thead><tbody>'+gl+'</tbody></table>':'<p class="note">لم تُختر أهداف بعد</p>')+
   '<h3>الواجبات</h3>'+(hw||other?'<table><thead><tr><th>الواجب</th><th>التاريخ</th><th>الدرجة</th></tr></thead><tbody>'+hw+other+'</tbody></table>':'<p class="note">لا توجد واجبات بعد</p>')+
   '<h3>بنود التقييم</h3><table><thead><tr><th>البند</th><th>الوزن</th><th>النسبة</th></tr></thead><tbody>'+crit+'</tbody></table>'+
   (print?(note?'<h3>ملاحظات المعلمة</h3><p class="lv-txt">'+esc(note)+'</p>':'')+'<div class="sig"><span>المعلمة: '+esc(E.sv('teacher'))+'</span><span>ولي الأمر: ....................</span></div>':'')+'</div>';}
V.reports=function(el,r){var st=S().students,s=r.id&&E.stu(r.id);
  if(s){el.innerHTML='<div class="between"><button class="btn ghost sm" data-go="reports">'+I.next+'كل التقارير</button><div class="row"><button class="btn soft sm" data-a="repOut" data-s="'+s.id+'">'+X.print+'طباعة</button><button class="btn gold sm" data-a="repOut" data-m="pdf" data-s="'+s.id+'">'+X.dl+'PDF</button><button class="btn soft sm" data-share-stu="'+s.id+'">'+XI.send+'رابط الطالب</button></div></div>'+
    '<section class="card glass">'+reportHTML(s)+'</section><section class="card glass stack"><label class="field"><span class="lbl">ملاحظات المعلمة (تظهر في التقرير المطبوع)</span><textarea class="textarea" rows="3" id="repN">'+esc(S().rnote[s.id]||'')+'</textarea></label></section>';
    $('#repN',el).oninput=function(){S().rnote[s.id]=this.value;persist();};return;}
  el.innerHTML=E.head('reports','<div class="row"><button class="btn soft" data-a="repAll" data-m="pdf">'+X.dl+'تقارير كل الطلاب PDF</button><button class="btn soft" data-a="repCsv">'+XI.xl+'ملخص Excel</button><button class="btn soft" data-a="resCsv">'+XI.xl+'كل النتائج Excel</button></div>').replace(/<div class="ds-filter">[\s\S]*$/,'')+
   (st.length?S().classes.map(function(c){var l=st.filter(function(x){return x.cls===c.id;});if(!l.length)return '';return '<section class="card glass stack"><h2 class="h" style="margin:0">'+esc(c.name)+'</h2><div class="lv-list">'+l.map(function(x){var R=stuReport(x);
     return '<button class="lv-st" data-go="reports/'+x.id+'"><span class="av">'+E.av(x)+'</span><span class="grow"><b>'+esc(x.name)+'</b><small>'+(R.att&&R.att.pct!=null?'حضور '+ar(R.att.pct)+'% · ':'')+'⭐ '+ar(R.pts)+' · أهداف '+ar(R.p.done)+'/'+ar(R.p.n)+'</small></span><span class="ds-lvl '+R.lv.c+'">'+R.lv.n+'</span></button>';}).join('')+'</div></section>';}).join(''):'<div class="ds-empty">أضيفي الطلاب أولًا</div>');};
A.repOut=function(b){var s=E.stu(b.dataset.s);E.out(b.dataset.m||'print',reportHTML(s,true),'تقرير '+s.name,false);};
A.repAll=function(b){E.out(b.dataset.m||'print',S().students.map(function(s){return reportHTML(s,true);}).join(''),'تقارير الطلاب',false);};
A.repCsv=function(){csv('ملخص الطلاب',[['الطالب','الشعبة','المستوى','نسبة الحضور','أيام الغياب','النقاط','الأهداف المختارة','أنجز','لم ينجز','واجبات مسلّمة','واجبات مرسلة','التقييم من 100','التقدير']].concat(S().students.map(function(s){var R=stuReport(s);
  return [s.name,clsName(s),s.lv?LVN[s.lv]:'',R.att&&R.att.pct!=null?R.att.pct+'%':'',R.att?R.att.a:'',R.pts,R.p.n,R.p.done,R.p.no,R.ehw.filter(function(h){return S().esub[h.id+'_'+s.code];}).length,R.ehw.length,R.t==null?'':Math.round(R.t),R.lv.n];})));};
A.resCsv=function(){var rows2=[['الطالب','الشعبة','النوع','العنوان','الدرجة','من','النسبة','التاريخ']];S().results.slice().sort(function(a,b){return a.t-b.t;}).forEach(function(r){var s=E.stu(r.sid);if(!s)return;var L=D.REG.lessons[r.ref];
  rows2.push([s.name,clsName(s),String(r.ref).indexOf('e:')===0?'واجب إلكتروني':r.k==='hw'?'واجب':'امتحان',r.title||(L?L.t:r.ref),r.score,r.max,Math.round(r.score/r.max*100)+'%',new Date(r.t).toLocaleDateString('ar-OM')]);});csv('نتائج الطلاب',rows2);};

/* ---------- الرئيسية: بطاقة المستويات ---------- */
var origHome=V.home;
V.home=function(el){origHome(el);var st=S().students;if(!st.length)return;var pend=0;S().ehw.forEach(function(h){if(h.open)pend+=(h.sids||[]).length-subsOf(h).length;});
  var box=document.createElement('section');box.className='card glass stack lv-homecard';
  box.innerHTML='<div class="between"><h2 class="h" style="margin:0">🎯 طلابي حسب المستوى</h2><button class="btn ghost sm" data-go="iep">الخطط الفردية</button></div><div class="lv-sum">'+[1,2,3,4].map(function(l){var n=st.filter(function(s){return s.lv===l;}).length;return '<div style="--lc:'+LVC[l]+'"><b>'+ar(n)+'</b><small>المستوى '+LVN[l]+'</small></div>';}).join('')+'</div>'+
   (st.some(function(s){return !s.lv;})?'<p class="note" style="margin:0">'+ar(st.filter(function(s){return !s.lv;}).length)+' طالبًا بلا مستوى بعد، حدّديه من ملف الطالب.</p>':'')+
   (S().ehw.length?'<div class="ds-row"><span style="font-size:24px">📨</span><div class="grow"><b>واجبات الطلاب</b><small>'+ar(S().ehw.length)+' واجبًا · '+(pend>0?ar(pend)+' تسليمًا لم يصل بعد':'سلّم الجميع')+'</small></div><button class="btn soft sm" data-go="ehw">المتابعة</button></div>':'');
  var hero=el.querySelector('.ds-hero');if(hero&&hero.nextSibling)el.insertBefore(box,hero.nextSibling);else el.appendChild(box);};

/* ---------- المزامنة عبر Firebase ---------- */
var C=PF.cloud;if(!C||!window.firebase)return;
var DEV=D.lsGet('darsi:dev:'+PF.id,'');if(!DEV){DEV=Math.random().toString(36).slice(2)+Date.now().toString(36);D.lsSet('darsi:dev:'+PF.id,DEV);}
var app,auth,db;try{app=firebase.initializeApp(C.fb,'darsi-'+PF.id);auth=app.auth();db=app.firestore();if(C.emu){auth.useEmulator('http://127.0.0.1:9099');db.useEmulator('127.0.0.1',8080);}}catch(e){console.error(e);return;}
var CV=2,ns=C.ns,user=null,pushT=null,lastT=0,applying=false,rosterSig='',CH=250000,BK=E.KEY+':base',base=null,synced=false,syncing=false,nextMeta=null,seen=null,dirty=false,pendT=0;
var baseP=D.DB.get(BK).then(function(b){base=b||null;},function(){});
var CL=D.CLOUD={st:'wait',msg:'جارٍ الاتصال بالمزامنة…',subs:{},
  putHw:function(h,id){return ready().then(function(){var x=JSON.parse(JSON.stringify(h));x.items=JSON.stringify(h.items||[]);return db.collection(ns+'_hw').doc(id).set(x);}).catch(function(e){console.error('putHw',e);throw e;});},
  delHw:function(id){return ready().then(function(){return db.collection(ns+'_hw').doc(id).delete();}).catch(function(){});}};
function status(s,m){CL.st=s;CL.msg=m;$$('.lv-cloud').forEach(function(x){x.setAttribute('data-st',s);var b=x.querySelector('b');if(b)b.textContent=m;});var d=$('#lvSync');if(d){d.setAttribute('data-st',s);d.title=m;}}
var rdy,rdyOk;rdy=new Promise(function(r){rdyOk=r;});function ready(){return rdy;}
function login(){auth.signInWithEmailAndPassword(C.email,C.pw).catch(function(e){var c=e&&e.code||'';
  if(/user-not-found|invalid-credential|invalid-login-credentials/.test(c))return auth.createUserWithEmailAndPassword(C.email,C.pw).catch(function(e2){status('err','تعذّر تجهيز حساب المزامنة');throw e2;});
  status('err',navigator.onLine?'تعذّر الاتصال بالمزامنة؛ ستُعاد المحاولة':'لا يوجد إنترنت؛ تعملين على هذا الجهاز وتُزامن البيانات عند الاتصال');setTimeout(login,30000);});}
auth.onAuthStateChanged(function(u){user=u&&u.email===C.email?u:null;if(!user)return;rdyOk();status('wait','جارٍ المزامنة…');
  db.collection(ns+'_t').doc('state').onSnapshot(function(d){seenMeta(d.exists?d.data():null);},
    function(e){status('err',/permission/i.test(e&&e.code||'')?'قواعد المزامنة لم تُفعَّل بعد على Firebase':'انقطعت المزامنة؛ ستعود تلقائيًا');setTimeout(cloudCheck,10000);});
  function seenMeta(meta){if(!S()){setTimeout(function(){seenMeta(meta);},400);return;}
      if(meta&&meta.cv>CV&&!busyNow()){var rk='darsi:rl:'+PF.id,lr=+(sessionStorage.getItem(rk)||0);if(Date.now()-lr>600000){sessionStorage.setItem(rk,Date.now());location.reload();return;}}
      if(!meta){synced=true;push(true);return;}
      if(meta.dev===DEV&&(meta.t===lastT||meta.t===pendT)){seen=meta;synced=true;if(!dirty)ok();return;}
      if(synced&&seen&&meta.t===seen.t&&meta.dev===seen.dev){if(dirty)push(true);else ok();return;}
      sync(meta);}
  CL.seenMeta=seenMeta;
  db.collection(ns+'_sub').onSnapshot(function(q){var list=[];q.forEach(function(doc){var x=doc.data();x.id=doc.id;x.at=x.at&&x.at.toMillis?x.at.toMillis():(x.ts||Date.now());CL.subs[doc.id]=x;list.push(x);});mergeSubs(list);},function(){});
  roster(true);resendHws();});
/* فحص احتياطي: عند العودة للصفحة وكل ٢٠ ثانية، حتى لو انقطع الاستماع المباشر (شاشة مفتوحة طويلًا أو شبكة المدرسة) */
/* قراءة عبر معاملة: طلب مباشر لا يعتمد على قناة الاستماع */
function rd(refs){return db.runTransaction(function(tx){return Promise.all(refs.map(function(r){return tx.get(r);}));});}
function cloudCheck(){if(!user||!CL.seenMeta||document.hidden)return;rd([db.collection(ns+'_t').doc('state')]).then(function(r){var d=r[0];CL.seenMeta(d.exists?d.data():null);}).catch(function(){});}
document.addEventListener('visibilitychange',function(){if(!document.hidden)cloudCheck();});addEventListener('focus',cloudCheck);setInterval(cloudCheck,20000);
var lastKey=0;document.addEventListener('input',function(){lastKey=Date.now();},true);document.addEventListener('keydown',function(){lastKey=Date.now();},true);
function busyNow(){return busy()&&Date.now()-lastKey<8000;}
function ok(){status('ok','متزامنة · '+new Date().toLocaleTimeString('ar-OM',{hour:'numeric',minute:'2-digit'}));}
/* ---- الدمج: لا تُستبدل نسخة بأخرى أبدًا، بل تُجمع إضافات الجهازين ويُحترم الحذف منذ آخر مزامنة ---- */
function isO(x){return !!x&&typeof x==='object'&&!Array.isArray(x);}
function sj(x){if(Array.isArray(x))return '['+x.map(sj).join(',')+']';if(isO(x))return '{'+Object.keys(x).sort().map(function(k){return JSON.stringify(k)+':'+sj(x[k]);}).join(',')+'}';return JSON.stringify(x===undefined?null:x);}
function eq(a,b){return sj(a)===sj(b);}
function cp(x){return x===undefined?undefined:JSON.parse(JSON.stringify(x));}
function ik(x){return isO(x)&&x.id!=null?'#'+x.id:sj(x);}
function m3(b,l,r,lw){if(eq(l,r))return l;var hb=b!==undefined;if(hb&&eq(l,b))return r;if(hb&&eq(r,b))return l;
  if(isO(l)&&isO(r)){var bo=isO(b)?b:{},o={},ks={};Object.keys(l).concat(Object.keys(r)).forEach(function(k){ks[k]=1;});
    Object.keys(ks).forEach(function(k){var iL=k in l,iR=k in r,iB=k in bo;
      if(iL&&iR)o[k]=m3(iB?bo[k]:undefined,l[k],r[k],lw);
      else if(iL){if(!(iB&&eq(bo[k],l[k])))o[k]=l[k];}
      else if(!(iB&&eq(bo[k],r[k])))o[k]=r[k];});return o;}
  if(Array.isArray(l)&&Array.isArray(r)){var ba=Array.isArray(b)?b:[],bm={},lm={},rm={},out=[];ba.forEach(function(x){bm[ik(x)]=x;});l.forEach(function(x){lm[ik(x)]=x;});r.forEach(function(x){rm[ik(x)]=x;});
    function take(k,src){var iL=k in lm,iR=k in rm,iB=k in bm;if(iL&&iR)return m3(iB?bm[k]:undefined,lm[k],rm[k],lw);var v=iL?lm[k]:rm[k];if(iB&&eq(bm[k],v))return undefined;return v;}
    var done={};r.concat(l).forEach(function(x){var k=ik(x);if(done[k])return;done[k]=1;var v=take(k);if(v!==undefined)out.push(v);});return out;}
  return lw?l:r;}
/* أول مزامنة لجهاز: يُوحَّد رمز كل طالب وصف مع نسخة السحابة بالاسم، حتى لا يتكرر الطلاب */
function remap(loc,rem){var mp={},rc={};(rem.classes||[]).forEach(function(c){rc[D.norm(c.name)]=c.id;});
  (loc.classes||[]).forEach(function(c){var id=rc[D.norm(c.name)];if(id&&id!==c.id)mp[c.id]=id;});
  var rs={},cn=function(st,id){var c=(st.classes||[]).filter(function(x){return x.id===id;})[0];return c?D.norm(c.name):'';};
  (rem.students||[]).forEach(function(s){rs[D.norm(s.name)+'|'+cn(rem,s.cls)]=s.id;});
  (loc.students||[]).forEach(function(s){var id=rs[D.norm(s.name)+'|'+cn(loc,s.cls)];if(id&&id!==s.id)mp[s.id]=id;});
  if(!Object.keys(mp).length)return loc;
  function w(x){if(typeof x==='string')return mp[x]||x;if(Array.isArray(x))return x.map(w);if(isO(x)){var o={};Object.keys(x).forEach(function(k){o[mp[k]||k]=w(x[k]);});return o;}return x;}
  return w(loc);}
function strip(st){var o={};Object.keys(st).forEach(function(k){if(k!=='ui')o[k]=st[k];});return cp(o);}
function noSaved(x){var o=Object.assign({},x);delete o.saved;return o;}
function sync(meta){if(syncing){nextMeta=meta;return;}syncing=true;status('wait','جارٍ مزامنة التعديلات…');
  baseP.then(function(){var ps=[];for(var i=0;i<meta.n;i++)ps.push(db.collection(ns+'_t').doc('s'+i));return rd(ps);}).then(function(ds){
    var j=ds.map(function(x){return x.exists?x.data().d:'';}).join(''),d;try{d=JSON.parse(j);}catch(e){throw new Error('parse');}merge(d,meta);})
  .catch(function(e){console.error('sync',e);syncing=false;status('err','تعذّر تنزيل التعديلات؛ ستُعاد المحاولة');setTimeout(function(){sync(meta);},15000);});}
function merge(d,meta){if(busyNow()){setTimeout(function(){merge(d,meta);},2500);return;}
  var st=S(),loc=strip(st),rem=d;delete rem.ui;if(!base)loc=remap(loc,rem);
  var m=m3(base?noSaved(base):undefined,noSaved(loc),noSaved(rem),(loc.saved||0)>=(meta.t||0));m.saved=Math.max(loc.saved||0,meta.t||0);
  var chL=!eq(noSaved(m),noSaved(strip(st))),chR=!eq(noSaved(m),noSaved(rem));
  if(chL){D.DB.set(E.KEY+':bak',strip(st));applying=true;E.setS(Object.assign(cp(m),{ui:st.ui}));ensure(E.S);D.DB.set(E.KEY,E.S);applying=false;render();if(!eq(noSaved(m),noSaved(loc))||!base)TB.toast('وصلت تعديلات من جهازك الآخر',{icon:'check'});}
  seen=meta;synced=true;syncing=false;
  if(chR||dirty)push(true);else{base=noSaved(rem);D.DB.set(BK,base);ok();}
  if(nextMeta){var n=nextMeta;nextMeta=null;if(!(n.t===meta.t&&n.dev===meta.dev))sync(n);}}
function push(now){clearTimeout(pushT);pushT=setTimeout(doPush,now?50:2500);}
function doPush(){if(!user||!synced)return;if(syncing){pushT=setTimeout(doPush,1500);return;}
  var o=strip(S()),j=JSON.stringify(o),n=Math.ceil(j.length/CH)||1,t=Date.now(),ref=db.collection(ns+'_t').doc('state'),stale=null;dirty=false;pendT=t;status('wait','جارٍ رفع التعديلات…');
  db.runTransaction(function(tx){return tx.get(ref).then(function(d){var meta=d.exists?d.data():null;stale=null;
      if(meta&&!(seen&&meta.t===seen.t&&meta.dev===seen.dev)&&!(meta.dev===DEV&&meta.t===lastT)){stale=meta;return;}
      for(var i=0;i<n;i++)tx.set(db.collection(ns+'_t').doc('s'+i),{d:j.slice(i*CH,(i+1)*CH)});tx.set(ref,{n:n,t:t,dev:DEV,cv:CV});});})
  .then(function(){if(stale){dirty=true;sync(stale);return;}lastT=t;seen={n:n,t:t,dev:DEV};base=noSaved(o);D.DB.set(BK,base);if(!dirty)ok();})
  .catch(function(e){dirty=true;status('err',/permission/i.test(e&&e.code||'')?'قواعد المزامنة لم تُفعَّل بعد على Firebase':'تعذّر الرفع الآن؛ ستُعاد المحاولة');setTimeout(function(){push(true);},20000);});}
function roster(force){if(!user)return;var m={};S().students.forEach(function(s){m[s.code]={n:first(s.name),lv:s.lv||0,c:clsName(s),sx:E.sexOf(s)};});var sig=JSON.stringify(m);if(!force&&sig===rosterSig)return;
  var old=rosterSig?JSON.parse(rosterSig):null;rosterSig=sig;var b=db.batch();Object.keys(m).forEach(function(k){if(!old||JSON.stringify(old[k])!==JSON.stringify(m[k]))b.set(db.collection(ns+'_st').doc(k),m[k]);});
  if(old)Object.keys(old).forEach(function(k){if(!m[k])b.delete(db.collection(ns+'_st').doc(k));});b.commit().catch(function(){rosterSig='';});}
function resendHws(){S().ehw.forEach(function(h){if(!h.cloudV||h.cloudV<h.v){CL.putHw({t:h.t,due:h.due,note:h.note,to:h.to,items:h.items,open:h.open,at:h.at,v:h.v,tn:PF.teacher},h.id).then(function(){h.cloudV=h.v;persist();});}});}
var origPush=CL.putHw;CL.putHw=function(h,id){return origPush(h,id).then(function(){var x=S().ehw.filter(function(q){return q.id===id;})[0];if(x){x.cloudV=h.v;persist();}});};
D.onPersist=function(){if(applying)return;dirty=true;push();roster();};
addEventListener('online',function(){if(user)push(true);else login();});
login();
});

/* ضغط الصور قبل رفعها */
D.shrink=function(file,max,q){return new Promise(function(ok,no){var r=new FileReader();r.onerror=no;r.onload=function(){var im=new Image();im.onerror=no;im.onload=function(){var w=im.width,h=im.height,k=Math.min(1,max/Math.max(w,h)),c=document.createElement('canvas');c.width=Math.round(w*k);c.height=Math.round(h*k);
  var x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);ok(c.toDataURL('image/jpeg',q||.75));};im.src=r.result;};r.readAsDataURL(file);});};
})();
