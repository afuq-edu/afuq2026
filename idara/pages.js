/* =====================================================================
   «دفّة» · الأقسام: الرئيسية، الكادر، الحضور، الاحتياط، المناوبة، الجدول،
   الزيارات، النتائج، الخطة، الاجتماعات، التقويم، التعاميم، الإنجازات،
   لوحة الشرف، التقارير، الإعدادات، والأقسام المضافة.
   ===================================================================== */
(function(){
'use strict';
var DA=window.DA,I=window.IDARA,A=window.APP,$=DA.$,$$=DA.$$,esc=DA.esc,ic=A.ic,P=A.PAGES;
var BIND=[];function bind(fn){BIND.push(fn);}
A.after=function(m,r){var b=BIND;BIND=[];b.forEach(function(f){try{f(m,r);}catch(e){console.error(e);}});};
function on(sel,ev,fn){bind(function(m){$$(sel,m).forEach(function(el){el.addEventListener(ev,function(e){fn(el,e);});});});}
var STC={p:'good',l:'warn',a:'bad',s:'bad',o:'info',t:'info'};

/* =================== الرئيسية =================== */
P.home=function(){var S=A.school(),wd=A.workday(),isT=A.isToday(wd),T=A.teachers(),stu=DA.list('stu');
  var tm=A.tatt(wd),pres=T.filter(function(t){return tm[t.id]==='p'||tm[t.id]==='l';}).length;
  var sat=DA.rec('sat_'+wd),absS=0;if(sat)Object.keys(sat.c).forEach(function(c){absS+=sat.c[c].length;});
  var need=A.needOn(wd),cov=need.filter(function(x){return x.sub;}).length;
  var vis=DA.list('vis',function(v){return v.kind==='sup';}),vd=vis.filter(function(v){return v.st==='done';});
  var visited={};vd.forEach(function(v){visited[v.t]=1;});
  var h='<section class="hero has-scene">'+(window.SCENE?SCENE.html('campus'):'')+'<div class="hscrim" aria-hidden="true"></div>'+
   '<div class="wrap"><div class="hin"><div class="logo-ring">'+A.mark('x')+'</div><div class="htxt">'+
   '<div class="topline"><span>'+esc(S.place)+'</span><i></i><span>'+esc(S.cycle)+'</span><i></i><span>العام الدراسي '+esc(S.year)+'</span></div>'+
   '<h1>'+esc(S.name)+'</h1><div class="motto">'+esc(S.motto)+'</div>'+
   '<div class="greet">'+DA.greet()+'، <b>'+esc(S.principal)+'</b> · مديرة المدرسة</div>'+
   '<div class="when"><span class="pillx">'+ic('cal')+esc(A.fmt(DA.today()))+'</span><span class="pillx">'+ic('moon')+esc(A.hijri())+'</span><span class="pillx">'+ic('clock')+'<span class="clock" data-clock></span> · <span data-period>'+esc(A.periodNow())+'</span></span></div>'+
   '<div class="hact"><a class="btn gold" href="#/tatt">'+ic('check')+' تحضير المعلمات</a><a class="btn ghost" href="#/subs">'+ic('swap')+' الاحتياط '+(need.length-cov?'<span class="pill-n">'+(need.length-cov)+'</span>':'')+'</a><a class="btn ghost" href="#/reports">'+ic('report')+' التقارير</a></div>'+
   '</div></div></div></section>';
  h+='<div class="wrap kpi-wrap"><div class="kpis">'+
   stat('student','--k2',stu.length,'طالبًا وطالبة',A.classes().length+' شعبة')+
   stat('users','--k1',T.length,'معلمة','')+
   stat('check','--k5',A.pct(pres,T.length)+'٪','حضور المعلمات',isT?'اليوم':A.short(wd))+
   stat('sun','--k3',A.pct(stu.length-absS,stu.length)+'٪','حضور الطلبة',isT?'اليوم':A.short(wd))+
   stat('swap','--k7',cov+'/'+need.length,'حصص الاحتياط',need.length-cov?'بانتظار '+(need.length-cov):'مكتملة')+
   stat('eye','--k4',A.pct(Object.keys(visited).length,T.length)+'٪','تغطية الزيارات',vd.length+' زيارة منفذة')+'</div>';
  /* اليوم + التنبيهات */
  var ag=[],di=I.dayIdx(wd),duty=DA.rec('duty_plan');
  A.absentOn(wd).forEach(function(tid){var t=A.T(tid);ag.push(['07:30',I.TSTAT[tm[tid]][0]+': '+t.name,A.subjName(t.subj)+' · '+need.filter(function(x){return x.abs===tid;}).length+' حصص تحتاج احتياطًا','var(--bad)','#/subs']);});
  if(duty&&di>=0)ag.unshift(['07:00','مشرفة المناوبة: '+A.T(duty.grid[di].lead).name,I.LOCS.length+' مواقع مناوبة موزعة','var(--a)','#/duty']);
  DA.list('meet',function(m){return m.d===wd||m.d===DA.today();}).forEach(function(m){ag.push([m.time,m.title,m.place,'var(--b)','#/meet']);});
  DA.list('vis',function(v){return v.d===wd&&v.st==='plan';}).forEach(function(v){ag.push(['—','زيارة صفية: '+A.T(v.t).name,A.C(v.cls).name+' · '+A.subjName(v.subj),'var(--k4)','#/visits']);});
  var up=DA.list('evt',function(e){return e.d>=DA.today();}).sort(function(a,b){return a.d<b.d?-1:1;}).slice(0,3);
  up.forEach(function(e){ag.push([A.short(e.d),e.title,A.rel(e.d)+' · '+e.place,'var(--k3)','#/events']);});
  var al=[];var un=need.length-cov;if(un)al.push(['bad','swap',un+' حصص احتياط لم تُسند بعد','وزّعيها بضغطة واحدة بعدالة','#/subs']);
  var late=[];DA.list('meet').forEach(function(m){(m.dec||[]).forEach(function(d){if(d.st!=='done'&&d.due<DA.today())late.push(d);});});
  if(late.length)al.push(['warn','chat',late.length+' قرارات متأخرة عن موعدها','من محاضر الاجتماعات','#/meet']);
  var chronic=A.chronic();if(chronic.length)al.push(['warn','student',chronic.length+' طلبة غيابهم متكرر','تجاوز الغياب 5 أيام في آخر 20 يومًا','#/satt']);
  var nv=T.filter(function(t){return !visited[t.id];}).length;if(nv)al.push(['warn','eye',nv+' معلمات لم تُزَر بعد هذا الفصل','جدولي زياراتهن من قسم الزيارات','#/visits']);
  var circ=DA.list('circ',function(c){return c.st==='exec';}).length;if(circ)al.push(['warn','mail',circ+' تعاميم بانتظار التنفيذ','','#/circ']);
  al.push(['good','trophy',DA.list('ach').length+' إنجازًا موثقًا هذا الفصل','آخرها: '+((DA.list('ach').slice(-1)[0]||{}).title||''),'#/ach']);
  h+='<div class="cols mt"><div class="card"><div class="ctitle"><span class="ic2">'+ic('sun')+'</span><h3>'+(isT?'اليوم في المدرسة':'آخر يوم دراسي · '+esc(A.fmt(wd)))+'</h3></div><div class="agenda">'+
   ag.map(function(a){return '<a class="ag" href="'+a[4]+'" style="--c:'+a[3]+';text-decoration:none;color:inherit"><span class="t">'+esc(a[0])+'</span><span class="dt"></span><span><b>'+esc(a[1])+'</b><small>'+esc(a[2])+'</small></span></a>';}).join('')+'</div></div>'+
   '<div class="card"><div class="ctitle"><span class="ic2">'+ic('bell')+'</span><h3>يحتاج انتباهك</h3></div>'+al.map(function(a){return '<a class="alert '+a[0]+'" href="'+a[4]+'"><span class="ai">'+ic(a[1])+'</span><span><b>'+esc(a[2])+'</b><small>'+esc(a[3])+'</small></span></a>';}).join('')+'</div></div>';
  /* الأقسام */
  h+='<div class="grp"><h2>أقسام المنصة</h2><i></i></div><div class="tiles">'+A.SEC.filter(function(s){return s[0]!=='home';}).map(function(s){return tile(s);}).join('')+
   DA.list('sec').map(function(r){return tile(A.custom(r.id));}).join('')+'</div>';
  /* مؤشرات */
  var days=I.schoolDays(new Date(wd+'T08:00:00'),20),trend=days.map(function(d){var r=DA.rec('sat_'+d);if(!r)return 100;var a=0;Object.keys(r.c).forEach(function(c){a+=r.c[c].length;});return 100-a/stu.length*100;});
  var ttrend=days.map(function(d){var m=A.tatt(d),n=0,k=0;Object.keys(m).forEach(function(x){k++;if(m[x]==='p'||m[x]==='l')n++;});return k?n/k*100:100;});
  var avg=function(a){return (a.reduce(function(x,y){return x+y;},0)/a.length).toFixed(1);};
  var top=A.teachers().sort(function(a,b){return (b.pts||0)-(a.pts||0);}).slice(0,3);
  h+='<div class="cols eq mt"><div class="card"><div class="ctitle"><span class="ic2">'+ic('chart')+'</span><h3>نبض الحضور · آخر 20 يومًا</h3></div>'+
   '<div class="row"><div style="flex:1;min-width:200px"><small class="muted">الطلبة · المتوسط <b>'+avg(trend)+'٪</b></small>'+A.spark(trend)+'</div><div style="flex:1;min-width:200px"><small class="muted">المعلمات · المتوسط <b>'+avg(ttrend)+'٪</b></small>'+A.spark(ttrend)+'</div></div></div>'+
   '<div class="card"><div class="ctitle"><span class="ic2">'+ic('medal')+'</span><h3>لوحة الشرف</h3><span class="sp"></span><a class="btn ghost sm" href="#/honor">الكل</a></div>'+podium(top)+'</div></div>';
  h+='<div class="card sale mt"><span class="ri">'+ic('spark')+'</span><div style="flex:1"><h3>هذه نسخة عرض من منصة «دفّة»</h3><p class="muted" style="margin:4px 0 0">مدرسة سَنا الغد وكل الأسماء والأرقام هنا وهمية. نبني لمدرستكِ منصة مثلها بشعارها وبياناتها، تعمل على الجوال والحاسوب وتُثبَّت كتطبيق.</p></div><a class="btn gold" href="https://wa.me/96876506037?text='+encodeURIComponent('السلام عليكم، شاهدت نسخة العرض من منصة دفّة وأرغب بمنصة لمدرستنا')+'" target="_blank" rel="noopener">'+ic('wa')+' تواصلي معنا</a></div></div>';
  bind(function(m){var c=$('[data-clock]',m),p=$('[data-period]',m);function tick(){if(!c.isConnected){clearInterval(iv);return;}var d=new Date();c.textContent=('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2)+':'+('0'+d.getSeconds()).slice(-2);p.textContent=A.periodNow();}var iv=setInterval(tick,1000);tick();});
  return h;};
function stat(icK,col,v,lab,sub){return '<div class="stat" style="--c:var('+col+')"><span class="si">'+ic(icK)+'</span><span><b>'+v+'</b><small>'+esc(lab)+'</small>'+(sub?'<small style="opacity:.8;font-weight:500">'+esc(sub)+'</small>':'')+'</span></div>';}
function tile(s){return '<a class="tile" href="#/'+s[0]+'" style="--tc:var('+s[3]+')"><span class="ic">'+ic(s[2])+'</span><span><b>'+esc(s[1])+'</b><small>'+esc(s[4])+'</small></span><svg class="wm" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.2">'+DA.P[s[2]]+'</svg></a>';}
function podium(top){if(top.length<3)return A.empty('لا بيانات بعد','medal');var o=[top[1],top[0],top[2]],cl=['p2','p1','p3'],n=['٢','١','٣'];
  return '<div class="podium">'+o.map(function(t,i){return '<div class="pod '+cl[i]+'">'+A.av(t)+'<b>'+esc(t.name)+'</b><small>'+(t.pts||0)+' نقطة</small><div class="st">'+n[i]+'</div></div>';}).join('')+'</div>';}

/* =================== الهيئة التدريسية =================== */
var staffF={q:'',d:''};
P.staff=function(){var T=A.teachers();
  var list=T.filter(function(t){return (!staffF.q||(t.name+t.full).indexOf(staffF.q)>=0)&&(!staffF.d||I.DOMAINS.filter(function(d){return d[0]===staffF.d;})[0][2].indexOf(t.subj)>=0);});
  var h=A.banner('staff',T.length+' معلمة · '+I.DOMAINS.length+' مجالات','<button class="btn gold" data-add>'+ic('plus')+' إضافة معلمة</button>');
  h+='<div class="row mb"><label class="search">'+ic('search')+'<input type="search" placeholder="ابحثي باسم المعلمة" value="'+esc(staffF.q)+'" data-q></label><div class="chips"><button class="fchip" data-d="" aria-pressed="'+(!staffF.d)+'">الكل</button>'+I.DOMAINS.map(function(d){return '<button class="fchip" data-d="'+d[0]+'" aria-pressed="'+(staffF.d===d[0])+'">'+esc(d[1])+'</button>';}).join('')+'</div></div>';
  h+=list.length?'<div class="grid" style="--min:250px">'+list.map(function(t){return '<article class="card tcard" data-t="'+t.id+'" tabindex="0">'+A.who(Object.assign({},t,{full:t.name}),A.subjName(t.subj)+' · '+(t.fa?'بنت '+t.fa:''))+
    '<div class="meta"><span class="chip'+(t.role==='معلمة أولى'?' gold':'')+'">'+esc(t.role||'معلمة')+'</span><span class="chip">'+(t.exp||0)+' سنة خبرة</span>'+((t.classes||[]).length?'<span class="chip">'+t.classes.length+' شعب</span>':'')+'</div>'+
    '<div class="ld"><span>النصاب</span><div class="bar"><i style="--p:'+Math.min(100,(t.load||0)/24*100)+'"></i></div><b class="num">'+(t.load||0)+'</b></div>'+
    '<div class="row"><div class="badges-row">'+(t.badges||[]).map(function(b){return A.medal(b,1);}).join('')+'</div><span class="sp"></span><span class="chip gold">'+(t.pts||0)+' نقطة</span></div></article>';}).join('')+'</div>':A.empty('لا نتائج مطابقة','users');
  on('[data-add]','click',function(){teacherForm();});
  on('[data-q]','input',function(el){staffF.q=el.value.trim();clearTimeout(A._sq);A._sq=setTimeout(function(){A.refresh();var q=$('[data-q]');if(q){q.focus();q.setSelectionRange(q.value.length,q.value.length);}},250);});
  on('[data-d]','click',function(el){staffF.d=el.dataset.d;A.refresh();});
  on('[data-t]','click',function(el){profile(el.dataset.t);});
  on('[data-t]','keydown',function(el,e){if(e.key==='Enter')profile(el.dataset.t);});
  return h;};
function teacherForm(t){t=t||{};A.form({title:t.id?'تعديل بيانات المعلمة':'إضافة معلمة',data:t,fields:[
  {k:'name',label:'الاسم (الاسم الأول واسم العائلة)',req:1,ph:'مثال: سلمى الهنائية'},{k:'fa',label:'اسم الأب',ph:'مثال: سالم',half:'open'},{k:'subj',label:'المادة',type:'select',opts:Object.keys(I.SUBJ).map(function(k){return [k,I.SUBJ[k][0]];}),half:'close'},
  {k:'role',label:'الوظيفة',type:'select',opts:['معلمة','معلمة أولى','أخصائية'],half:'open'},{k:'exp',label:'سنوات الخبرة',type:'number',def:1,half:'close'},{k:'qual',label:'المؤهل',def:'بكالوريوس تربية'}],
  del:t.id?function(){A.remove(t.id,'المعلمة');}:null,
  onSave:function(v){var p=v.name.split(/\s+/);var r=Object.assign({K:'tch',classes:[],load:0,pts:0,badges:[],subs:0},t,v);r.full='أ. '+p[0]+(v.fa?' بنت '+v.fa:'')+(p.length>1?' '+p.slice(1).join(' '):'');DA.put(r);DA.toast(t.id?'حُفظت البيانات':'أُضيفت المعلمة '+p[0]);}});}
function profile(id){var t=A.T(id),g=A.grid(),days=I.schoolDays(new Date(A.workday()+'T08:00:00'),20),cnt={p:0,l:0,a:0,s:0,o:0,t:0};
  days.forEach(function(d){var s=A.tatt(d)[id];if(s)cnt[s]++;});
  var vis=DA.list('vis',function(v){return v.t===id;}).sort(function(a,b){return a.d<b.d?1:-1;});
  var tt='<div class="tbl-w"><table class="tbl"><tr><th>اليوم</th>'+I.PERIODS.map(function(p,i){return '<th class="c">'+(i+1)+'</th>';}).join('')+'</tr>'+I.DAYS.map(function(dn,di){return '<tr><td><b>'+dn+'</b></td>'+I.PERIODS.map(function(p,pi){var c=Object.keys(g).filter(function(k){return g[k][di][pi]===id;})[0];return '<td class="c">'+(c?'<span class="chip" style="background:'+A.subjColor(t.subj)+';color:#fff">'+A.C(c).short+'</span>':'<span class="muted">·</span>')+'</td>';}).join('')+'</tr>';}).join('')+'</table></div>';
  var d=DA.dlg('<div class="row" style="padding-inline-end:44px">'+A.av(t,'lg')+'<div style="flex:1"><h2 style="margin:0">'+esc(t.full||t.name)+'</h2><div class="chips"><span class="chip">'+esc(A.subjName(t.subj))+'</span><span class="chip gold">'+esc(t.role||'معلمة')+'</span><span class="chip">'+(t.exp||0)+' سنة خبرة</span><span class="chip">'+esc(t.qual||'')+'</span></div></div></div>'+
   '<div class="kpis mt" style="grid-template-columns:repeat(auto-fill,minmax(120px,1fr))">'+stat('grid','--k6',t.load||0,'حصة أسبوعيًا','')+stat('check','--k5',A.pct(cnt.p+cnt.l,20)+'٪','الحضور','20 يومًا')+stat('swap','--k7',A.subCount(id,30),'حصة احتياط','30 يومًا')+stat('star','--k3',t.pts||0,'نقطة','')+'</div>'+
   ((t.badges||[]).length?'<h3 class="mt" style="font-size:15px">الأوسمة</h3><div class="row mt" style="margin-top:6px">'+t.badges.map(function(b){var x=I.BADGES.filter(function(y){return y[0]===b;})[0];return '<span class="row" style="gap:6px">'+A.medal(b,1)+'<small>'+esc(x[1])+'</small></span>';}).join('')+'</div>':'')+
   '<h3 class="mt" style="font-size:15px;margin-bottom:6px">الجدول الأسبوعي</h3>'+tt+
   '<h3 class="mt" style="font-size:15px">الزيارات الصفية</h3>'+(vis.length?vis.map(function(v){return '<div class="item">'+A.dbox(v.d)+'<div class="body"><b>'+esc(v.kind==='peer'?'زيارة تبادلية من '+A.T(v.by).name:v.by)+'</b><p>'+esc(A.C(v.cls).name+' · '+v.focus)+'</p></div>'+(v.st==='done'?A.stars(v.rate):'<span class="chip info">مجدولة</span>')+'</div>';}).join(''):'<p class="muted">لا زيارات بعد.</p>')+
   '<div class="acts"><button class="btn ghost" data-edit>'+ic('edit')+' تعديل</button><button class="btn ghost" data-badge>'+ic('medal')+' منح وسام</button><button class="btn gold" data-close>إغلاق</button></div>',{wide:true});
  $('[data-edit]',d).onclick=function(){d.close();teacherForm(DA.rec(id));};
  $('[data-badge]',d).onclick=function(){d.close();A.grant(id);};}
A.grant=function(id){A.form({title:'منح وسام',data:{t:id},fields:[{k:'t',label:'المعلمة',type:'select',opts:A.teacherOpts(id),req:1},{k:'b',label:'الوسام',type:'select',opts:I.BADGES.map(function(b){return [b[0],b[1]+' · '+b[2]];})}],
  onSave:function(v){var t=DA.rec(v.t);if(!t)return;t.badges=(t.badges||[]).slice();if(t.badges.indexOf(v.b)>=0){DA.toast('لديها هذا الوسام من قبل');return false;}t.badges.push(v.b);t.pts=(t.pts||0)+20;DA.put(t);DA.toast('مُنح الوسام وأُضيفت 20 نقطة');if(window.Touches&&Touches.burst)try{Touches.burst();}catch(e){}}});};

/* =================== حضور المعلمات =================== */
var tattD='';
P.tatt=function(){var d=tattD||A.workday(),T=A.teachers(),m=A.tatt(d),c={p:0,l:0,a:0,s:0,o:0,t:0,n:0};T.forEach(function(t){var s=m[t.id];if(s)c[s]++;else c.n++;});
  var h=A.banner('tatt',A.fmt(d),'<button class="btn ghost" data-print>'+ic('print')+' طباعة</button>');
  h+='<div class="card mb"><div class="row"><label class="field" style="margin:0"><span>تاريخ التحضير</span><input class="in" type="date" value="'+d+'" data-date></label><span class="sp"></span>'+
   '<span class="chip good dot">حاضرة '+c.p+'</span><span class="chip warn dot">متأخرة '+c.l+'</span><span class="chip bad dot">غائبة '+(c.a+c.s)+'</span><span class="chip info dot">مهمة/تدريب '+(c.o+c.t)+'</span>'+(c.n?'<span class="chip dot">لم تُحضَّر '+c.n+'</span>':'')+
   '<button class="btn sm" data-allp>'+ic('check')+' الباقيات حاضرات</button></div>'+(I.isSchool(new Date(d+'T08:00:00'))?'':'<p class="muted" style="margin:8px 0 0">هذا اليوم عطلة نهاية الأسبوع.</p>')+'</div>';
  h+='<div class="att-grid">'+T.map(function(t){var s=m[t.id]||'';return '<div class="att">'+A.who(t,s?I.TSTAT[s][0]:'لم تُحضَّر بعد')+'<div class="stbtns" role="group" aria-label="الحالة">'+
    [['p','ح','حاضرة'],['l','ت','متأخرة'],['a','غ','غائبة'],['o','م','مهمة/تدريب/مرضية']].map(function(x){var pr=s===x[0]||(x[0]==='o'&&/[ost]/.test(s)&&s!=='')||(x[0]==='a'&&s==='s');if(x[0]==='o'&&s==='s')pr=false;return '<button class="'+x[0]+'" data-st="'+x[0]+'" data-tid="'+t.id+'" title="'+x[2]+'" aria-pressed="'+pr+'">'+x[1]+'</button>';}).join('')+'</div></div>';}).join('')+'</div>';
  /* السجل الشهري */
  var days=I.schoolDays(new Date(d+'T08:00:00'),20);
  h+='<div class="grp"><h2>سجل آخر 20 يومًا دراسيًا</h2><i></i></div><div class="tbl-w"><table class="tbl"><tr><th>المعلمة</th><th class="c">حضور</th><th class="c">تأخير</th><th class="c">غياب</th><th class="c">مهمة/تدريب</th><th style="min-width:220px">الأيام</th></tr>'+
   T.map(function(t){var k={p:0,l:0,a:0,o:0};var cells=days.map(function(dd){var s=A.tatt(dd)[t.id]||'p';var g=s==='p'?'p':s==='l'?'l':(s==='a'||s==='s')?'a':'o';k[g]++;return '<i title="'+dd+'" style="--v:'+(g==='p'?100:g==='l'?55:g==='o'?75:0)+'"'+(g==='a'?' class="lo"':'')+'></i>';}).join('');
     return '<tr><td>'+esc(t.name)+'</td><td class="c num">'+k.p+'</td><td class="c num">'+k.l+'</td><td class="c num">'+k.a+'</td><td class="c num">'+k.o+'</td><td><div class="heat" style="--n:20">'+cells+'</div></td></tr>';}).join('')+'</table></div>';
  on('[data-date]','change',function(el){tattD=el.value;A.refresh();});
  on('[data-st]','click',function(el){var r=DA.rec('tat_'+d)||{id:'tat_'+d,K:'tat',d:d,m:{}};var mm=Object.assign({},r.m),v=el.dataset.st;
    if(v==='o'){var cur=mm[el.dataset.tid];v=cur==='o'?'t':cur==='t'?'s':'o';}mm[el.dataset.tid]=v;r.m=mm;DA.put(r);DA.snd('tap');});
  on('[data-allp]','click',function(){var r=DA.rec('tat_'+d)||{id:'tat_'+d,K:'tat',d:d,m:{}};var mm=Object.assign({},r.m);T.forEach(function(t){if(!mm[t.id])mm[t.id]='p';});r.m=mm;DA.put(r);DA.toast('حُضّرت الباقيات');});
  on('[data-print]','click',function(){window.print();});
  return h;};

/* =================== حضور الطلبة =================== */
var sattD='';
A.chronic=function(){var days=I.schoolDays(new Date(A.workday()+'T08:00:00'),20),n={};days.forEach(function(d){var r=DA.rec('sat_'+d);if(!r)return;Object.keys(r.c).forEach(function(c){r.c[c].forEach(function(s){n[s]=(n[s]||0)+1;});});});
  return Object.keys(n).filter(function(s){return n[s]>=5&&DA.rec(s);}).map(function(s){return {s:DA.rec(s),n:n[s]};}).sort(function(a,b){return b.n-a.n;});};
P.satt=function(){var d=sattD||A.workday(),r=DA.rec('sat_'+d),cls=A.classes(),stu=DA.list('stu'),tot=0;if(r)Object.keys(r.c).forEach(function(c){tot+=r.c[c].length;});
  var h=A.banner('satt',A.fmt(d)+' · '+A.pct(stu.length-tot,stu.length)+'٪ حضور','<button class="btn ghost" data-print>'+ic('print')+' طباعة</button>');
  h+='<div class="card mb"><div class="row"><label class="field" style="margin:0"><span>التاريخ</span><input class="in" type="date" value="'+d+'" data-date></label><span class="sp"></span><span class="chip good dot">حاضرون '+(stu.length-tot)+'</span><span class="chip bad dot">غائبون '+tot+'</span></div></div>';
  h+='<div class="grid" style="--min:200px">'+cls.map(function(c){var ab=r&&r.c[c.id]?r.c[c.id].length:0,n=stu.filter(function(s){return s.cls===c.id;}).length,p=A.pct(n-ab,n);
    return '<button class="card row" data-cls="'+c.id+'" style="text-align:start;gap:14px"><span class="ring" style="--p:'+p+';--sz:64px;--c:'+(p>=95?'var(--good)':p>=90?'var(--a)':'var(--bad)')+'"><b>'+p+'</b></span><span><b style="font-size:15.5px">'+esc(c.name)+'</b><small class="muted" style="display:block">'+n+' طالبًا · غياب '+ab+'</small></span></button>';}).join('')+'</div>';
  var ch=A.chronic();
  h+='<div class="cols mt"><div class="card"><div class="ctitle"><span class="ic2">'+ic('warn')+'</span><h3>غياب متكرر · آخر 20 يومًا</h3><small>5 أيام فأكثر</small></div>'+(ch.length?'<div class="tbl-w"><table class="tbl"><tr><th>الطالب/ة</th><th>الشعبة</th><th class="c">أيام الغياب</th><th></th></tr>'+ch.map(function(x){return '<tr><td>'+esc(x.s.name)+'</td><td>'+esc(A.C(x.s.cls).short)+'</td><td class="c"><span class="chip bad">'+x.n+'</span></td><td><button class="btn ghost sm" data-msg="'+x.s.id+'" data-n="'+x.n+'">'+ic('wa')+' رسالة لولي الأمر</button></td></tr>';}).join('')+'</table></div>':'<p class="muted">لا حالات.</p>')+'</div>';
  var days=I.schoolDays(new Date(d+'T08:00:00'),20),tr=days.map(function(dd){var x=DA.rec('sat_'+dd),a=0;if(x)Object.keys(x.c).forEach(function(c){a+=x.c[c].length;});return 100-a/stu.length*100;});
  var byG=[1,2,3,4].map(function(g){var ids=cls.filter(function(c){return c.g===g;}).map(function(c){return c.id;}),n=stu.filter(function(s){return ids.indexOf(s.cls)>=0;}).length,a=0;days.forEach(function(dd){var x=DA.rec('sat_'+dd);if(x)ids.forEach(function(c){a+=(x.c[c]||[]).length;});});return 100-a/(n*days.length)*100;});
  h+='<div class="card"><div class="ctitle"><span class="ic2">'+ic('chart')+'</span><h3>الاتجاه العام</h3></div>'+A.spark(tr,80)+'<div class="vchart" style="height:130px;margin-top:10px">'+byG.map(function(v){return '<div class="col"><span>'+v.toFixed(1)+'٪</span><i style="--v:'+((v-85)/15*100).toFixed(0)+'"></i></div>';}).join('')+'</div><div class="vlab">'+['الأول','الثاني','الثالث','الرابع'].map(function(x){return '<span>'+x+'</span>';}).join('')+'</div></div></div>';
  on('[data-date]','change',function(el){sattD=el.value;A.refresh();});
  on('[data-cls]','click',function(el){classAtt(d,el.dataset.cls);});
  on('[data-print]','click',function(){window.print();});
  on('[data-msg]','click',function(el){var s=DA.rec(el.dataset.msg),S=A.school();var t='ولي أمر الطالب/ة '+s.name+' المحترم،\nنودّ إفادتكم بتكرر غياب ابنكم/ابنتكم ('+el.dataset.n+' أيام خلال الشهر الأخير). نأمل التواصل مع إدارة المدرسة لمتابعة الأمر معًا.\nمع خالص التقدير،\nإدارة '+S.name;
    var dd=DA.dlg('<h2>رسالة لولي الأمر</h2><textarea class="in" style="min-height:150px" data-t>'+esc(t)+'</textarea><div class="acts"><button class="btn ghost" data-close>إلغاء</button><button class="btn ghost" data-c>'+ic('copy')+' نسخ</button><button class="btn gold" data-w>'+ic('wa')+' واتساب</button></div>');
    $('[data-c]',dd).onclick=function(){A.copy($('[data-t]',dd).value);};$('[data-w]',dd).onclick=function(){A.wa($('[data-t]',dd).value);dd.close();};});
  return h;};
function classAtt(d,cid){var c=A.C(cid),stu=DA.list('stu',function(s){return s.cls===cid;});
  function draw(){var r=DA.rec('sat_'+d),ab=r&&r.c[cid]?r.c[cid]:[];return stu.map(function(s){var a=ab.indexOf(s.id)>=0;return '<button class="att" data-s="'+s.id+'" style="text-align:start;width:100%;cursor:pointer;'+(a?'background:var(--bad-soft)':'')+'"><span class="av sm" style="--c:'+(s.b?'#1E5F80':'#7A2E3B')+'">'+esc(s.name.charAt(0))+'</span><span style="flex:1">'+esc(s.name)+'</span><span class="chip '+(a?'bad':'good')+'">'+(a?'غائب':'حاضر')+'</span></button>';}).join('');}
  var dd=DA.dlg('<h2>'+esc(c.name)+' · '+esc(A.short(d))+'</h2><p class="muted" style="margin-top:-8px">اضغطي على اسم الطالب لتبديل حالته.</p><div class="stack" style="gap:6px" data-l>'+draw()+'</div><div class="acts"><button class="btn gold" data-close>تم</button></div>');
  $('[data-l]',dd).addEventListener('click',function(e){var b=e.target.closest('[data-s]');if(!b)return;var r=DA.rec('sat_'+d)||{id:'sat_'+d,K:'sat',d:d,c:{}};var cc=Object.assign({},r.c),ab=(cc[cid]||[]).slice(),i=ab.indexOf(b.dataset.s);if(i>=0)ab.splice(i,1);else ab.push(b.dataset.s);cc[cid]=ab;r.c=cc;DA.put(r);$('[data-l]',dd).innerHTML=draw();DA.snd('tap');});}

/* =================== الاحتياط =================== */
var subD='';
function freeFor(d,p,exclude){var di=I.dayIdx(d),m=A.tatt(d),subs=A.subsOn(d);
  return A.teachers().filter(function(t){if(t.id===exclude)return false;var s=m[t.id];if(s&&s!=='p'&&s!=='l')return false;if(A.busyAt(t.id,di,p))return false;return !subs.some(function(x){return x.by===t.id&&x.p===p;});})
   .map(function(t){return {t:t,n:A.subCount(t.id,30),today:subs.filter(function(x){return x.by===t.id;}).length};}).sort(function(a,b){return a.today-b.today||a.n-b.n||(a.t.load||0)-(b.t.load||0);});}
P.subs=function(){var d=subD||A.workday(),need=A.needOn(d),cov=need.filter(function(x){return x.sub;}).length;
  var h=A.banner('subs',A.fmt(d)+' · '+cov+' من '+need.length+' حصة مُسندة','<button class="btn gold" data-auto>'+ic('magic')+' توزيع تلقائي عادل</button><button class="btn ghost" data-wa>'+ic('wa')+' إرسال</button><button class="btn ghost" data-print>'+ic('print')+'</button>');
  h+='<div class="card mb"><div class="row"><label class="field" style="margin:0"><span>اليوم</span><input class="in" type="date" value="'+d+'" data-date></label><span class="sp"></span><div style="min-width:220px;flex:1;max-width:380px"><small class="muted">نسبة الإسناد</small><div class="bar" style="height:12px"><i style="--p:'+A.pct(cov,need.length||1)+';--c:linear-gradient(90deg,var(--good),var(--a))"></i></div></div></div>'+
   '<p class="muted" style="margin:10px 0 0;font-size:13px">'+ic('info').replace('<svg','<svg style="width:15px;height:15px;vertical-align:-3px"')+' التوزيع العادل يقترح المعلمة المتفرغة في الحصة، الأقل احتياطًا في آخر 30 يومًا، ثم الأقل نصابًا، ولا يكرر المعلمة في اليوم نفسه قبل غيرها.</p></div>';
  var abs=A.absentOn(d);
  if(!need.length)h+=A.empty(abs.length?'الغائبات اليوم بلا حصص في هذا اليوم':'لا غياب مسجّل في هذا اليوم. سجّلي الغياب من «حضور المعلمات» فتظهر حصصهن هنا تلقائيًا.','swap');
  abs.forEach(function(tid){var t=A.T(tid),rows=need.filter(function(x){return x.abs===tid;});if(!rows.length)return;var st=A.tatt(d)[tid];
    h+='<div class="card mb"><div class="ctitle">'+A.who(t,I.TSTAT[st][0]+' · '+A.subjName(t.subj))+'<span class="sp"></span><span class="chip '+(rows.every(function(x){return x.sub;})?'good':'warn')+'">'+rows.filter(function(x){return x.sub;}).length+'/'+rows.length+'</span></div>'+
     rows.map(function(x){var fr=freeFor(d,x.p,tid);if(x.sub){var cur=A.T(x.sub.by);fr.unshift({t:cur,n:A.subCount(cur.id,30),today:0,cur:1});}
       return '<div class="subrow'+(x.sub?' done':'')+'"><div class="pn">'+(x.p+1)+'<small>'+I.PERIODS[x.p][0]+'</small></div><div><b>'+esc(A.C(x.cls).name)+'</b><small class="muted" style="display:block">'+esc(A.subjName(t.subj))+'</small></div>'+
        '<select class="in" data-pick="'+x.p+'" data-abs="'+tid+'" data-cls="'+x.cls+'"><option value="">— اختاري البديلة —</option>'+fr.map(function(f,i){return '<option value="'+f.t.id+'"'+(x.sub&&x.sub.by===f.t.id?' selected':'')+'>'+(i===0&&!x.sub?'★ ':'')+esc(f.t.name)+' · '+f.n+' احتياط</option>';}).join('')+'</select>'+
        (x.sub?'<button class="ib" data-un="'+x.sub.id+'" aria-label="إلغاء الإسناد" title="إلغاء الإسناد">'+ic('x')+'</button>':'<span class="chip warn">بانتظار</span>')+'</div>';}).join('')+'</div>';});
  /* عدالة التوزيع */
  var T=A.teachers().map(function(t){return {t:t,n:A.subCount(t.id,30)};}).sort(function(a,b){return b.n-a.n;}),mx=Math.max(1,T[0]?T[0].n:1);
  h+='<div class="grp"><h2>عدالة الاحتياط · آخر 30 يومًا</h2><i></i></div><div class="card"><div class="grid" style="--min:260px;gap:6px 22px">'+T.map(function(x){return '<div class="fair"><span style="width:130px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(x.t.name)+'</span><div class="bar" style="flex:1"><i style="--p:'+(x.n/mx*100)+'"></i></div><b class="num" style="width:22px">'+x.n+'</b></div>';}).join('')+'</div></div>';
  on('[data-date]','change',function(el){subD=el.value;A.refresh();});
  on('[data-pick]','change',function(el){var p=+el.dataset.pick,tid=el.dataset.abs,id='sub_'+d+'_'+tid+'_'+p;if(!el.value){if(DA.rec(id))DA.del(id);return;}
    DA.put({id:id,K:'sub',d:d,p:p,abs:tid,cls:el.dataset.cls,by:el.value,how:'manual'});DA.toast('أُسندت الحصة '+(p+1)+' إلى '+A.T(el.value).name);});
  on('[data-un]','click',function(el){A.remove(el.dataset.un,'الإسناد');});
  on('[data-auto]','click',function(){var n=0;A._mute=true;A.needOn(d).forEach(function(x){if(x.sub)return;var fr=freeFor(d,x.p,x.abs);if(!fr.length)return;DA.put({id:'sub_'+d+'_'+x.abs+'_'+x.p,K:'sub',d:d,p:x.p,abs:x.abs,cls:x.cls,by:fr[0].t.id,how:'auto'});n++;});A._mute=false;A.refresh();
    DA.toast(n?'وُزّعت '+n+' حصص بعدالة':'كل الحصص مُسندة');if(n&&window.Touches&&Touches.burst)try{Touches.burst();}catch(e){}});
  on('[data-wa]','click',function(){var t='جدول الاحتياط · '+A.fmt(d)+'\n'+A.school().name+'\n\n'+A.needOn(d).map(function(x){return 'الحصة '+(x.p+1)+' · '+A.C(x.cls).name+' · بدل '+A.T(x.abs).name+' ← '+(x.sub?A.T(x.sub.by).name:'لم تُسند');}).join('\n');
    var dd=DA.dlg('<h2>إرسال جدول الاحتياط</h2><textarea class="in" style="min-height:220px" data-t>'+esc(t)+'</textarea><div class="acts"><button class="btn ghost" data-close>إلغاء</button><button class="btn ghost" data-c>'+ic('copy')+' نسخ</button><button class="btn gold" data-w>'+ic('wa')+' واتساب</button></div>');
    $('[data-c]',dd).onclick=function(){A.copy($('[data-t]',dd).value);};$('[data-w]',dd).onclick=function(){A.wa($('[data-t]',dd).value);dd.close();};});
  on('[data-print]','click',function(){window.print();});
  return h;};

/* =================== المناوبة =================== */
P.duty=function(){var r=DA.rec('duty_plan'),g=r?r.grid:{},wd=I.dayIdx(DA.today());
  var h=A.banner('duty','مناوبة أسبوعية · '+I.LOCS.length+' مواقع يوميًا','<button class="btn gold" data-auto>'+ic('magic')+' توزيع تلقائي عادل</button><button class="btn ghost" data-wa>'+ic('wa')+' مناوبة اليوم</button><button class="btn ghost" data-print>'+ic('print')+'</button>');
  if(r&&r.note)h+='<div class="alert"><span class="ai">'+ic('info')+'</span><span>'+esc(r.note)+'</span></div>';
  var cnt={};for(var d=0;d<5;d++)if(g[d])I.LOCS.forEach(function(l,j){var t=g[d][j];if(t)cnt[t]=(cnt[t]||0)+1;});
  h+='<div class="grid" style="--min:280px">'+I.DAYS.map(function(dn,di){var x=g[di]||{};return '<div class="card duty-day'+(di===wd?' today':'')+'"><h4>'+ic('cal').replace('<svg','<svg style="width:18px;height:18px;color:var(--a)"')+dn+(di===wd?' <span class="chip gold">اليوم</span>':'')+'</h4>'+
    '<div class="dloc" style="background:var(--a-soft)"><span class="ln" style="color:var(--a2)">مشرفة اليوم</span><select class="in" data-d="'+di+'" data-l="lead">'+A.teacherOpts(x.lead,'—')+'</select></div>'+
    I.LOCS.map(function(l,j){return '<div class="dloc"><span class="ln">'+esc(l)+'</span><select class="in" data-d="'+di+'" data-l="'+j+'">'+A.teacherOpts(x[j],'—')+'</select></div>';}).join('')+'</div>';}).join('')+'</div>';
  var T=A.teachers(),zero=T.filter(function(t){return !cnt[t.id];});
  h+='<div class="card mt"><div class="ctitle"><span class="ic2">'+ic('shield')+'</span><h3>توزيع الأعباء</h3><small>'+(T.length-zero.length)+' معلمة مشاركة هذا الأسبوع</small></div><div class="chips">'+T.filter(function(t){return cnt[t.id];}).map(function(t){return '<span class="chip">'+esc(t.name)+' · '+cnt[t.id]+'</span>';}).join('')+'</div>'+(zero.length?'<p class="muted" style="margin:10px 0 0">بلا مناوبة هذا الأسبوع: '+zero.map(function(t){return esc(t.name);}).join('، ')+'</p>':'')+'</div>';
  on('[data-l]','change',function(el){var rr=DA.rec('duty_plan')||{id:'duty_plan',K:'duty',grid:{}};var gg=JSON.parse(JSON.stringify(rr.grid||{}));gg[el.dataset.d]=gg[el.dataset.d]||{};gg[el.dataset.d][el.dataset.l]=el.value;rr.grid=gg;DA.put(rr);DA.toast('حُفظ');});
  on('[data-auto]','click',function(){DA.ask('إعادة توزيع المناوبة على كل المعلمات بالتساوي؟ ستُستبدل التوزيعات الحالية.',function(){var T2=A.teachers().slice().sort(function(){return Math.random()-.5;}),gg={},k=0;
     for(var d=0;d<5;d++){gg[d]={};I.LOCS.forEach(function(l,j){gg[d][j]=T2[k++%T2.length].id;});gg[d].lead=T2[k++%T2.length].id;}var rr=DA.rec('duty_plan')||{id:'duty_plan',K:'duty'};rr.grid=gg;DA.put(rr);DA.toast('وُزّعت المناوبة بعدالة');},{ok:'وزّعي'});});
  on('[data-wa]','click',function(){var di=wd<0?0:wd,x=g[di]||{};var t='مناوبة يوم '+I.DAYS[di]+' · '+A.school().name+'\nالمشرفة: '+A.T(x.lead).name+'\n'+I.LOCS.map(function(l,j){return '• '+l+': '+A.T(x[j]).name;}).join('\n');A.copy(t);A.wa(t);});
  on('[data-print]','click',function(){window.print();});
  return h;};

/* =================== الجدول المدرسي =================== */
var ttF={by:'cls',id:''};
P.tt=function(){var g=A.grid(),by=ttF.by,id=ttF.id||(by==='cls'?'c11':(A.teachers()[0]||{}).id);
  var h=A.banner('tt','7 حصص يوميًا · الأحد إلى الخميس','<button class="btn ghost" data-print>'+ic('print')+' طباعة</button>');
  h+='<div class="card mb"><div class="row"><div class="seg"><button data-by="cls" aria-pressed="'+(by==='cls')+'">جدول شعبة</button><button data-by="t" aria-pressed="'+(by==='t')+'">جدول معلمة</button></div><select class="in" style="max-width:320px" data-id>'+(by==='cls'?A.classOpts(id):A.teacherOpts(id))+'</select></div></div>';
  h+='<div class="tbl-w"><table class="tbl"><tr><th>اليوم</th>'+I.PERIODS.map(function(p,i){return '<th class="c">الحصة '+(i+1)+'<br><small class="muted">'+p[0]+'</small></th>';}).join('')+'</tr>'+I.DAYS.map(function(dn,di){return '<tr><td><b>'+dn+'</b></td>'+I.PERIODS.map(function(p,pi){
     if(by==='cls'){var tid=g[id]&&g[id][di][pi],t=A.T(tid);return '<td class="c" style="min-width:110px">'+(tid?'<div style="border-radius:10px;padding:5px 6px;background:color-mix(in srgb,'+A.subjColor(t.subj)+' 14%,transparent);border-inline-start:3px solid '+A.subjColor(t.subj)+'"><b style="font-size:12.5px;display:block">'+esc(A.subjName(t.subj))+'</b><small class="muted">'+esc(t.name)+'</small></div>':'')+'</td>';}
     var c=Object.keys(g).filter(function(k){return g[k][di][pi]===id;})[0],t2=A.T(id);return '<td class="c">'+(c?'<span class="chip" style="background:'+A.subjColor(t2.subj)+';color:#fff">'+esc(A.C(c).short)+'</span>':'<span class="muted">فراغ</span>')+'</td>';}).join('')+'</tr>';}).join('')+'</table></div>';
  h+='<div class="legend mt">'+Object.keys(I.SUBJ).map(function(k){return '<span><i style="background:'+I.SUBJ[k][1]+'"></i>'+esc(I.SUBJ[k][0])+' ('+I.WEEK[k]+')</span>';}).join('')+'</div>';
  on('[data-by]','click',function(el){ttF={by:el.dataset.by,id:''};A.refresh();});
  on('[data-id]','change',function(el){ttF.id=el.value;A.refresh();});
  on('[data-print]','click',function(){window.print();});
  return h;};

/* =================== الزيارات الصفية =================== */
var visF='sup';
P.visits=function(){var all=DA.list('vis'),T=A.teachers(),sup=all.filter(function(v){return v.kind==='sup';}),done=sup.filter(function(v){return v.st==='done';}),plan=all.filter(function(v){return v.st==='plan';});
  var visited={};done.forEach(function(v){visited[v.t]=1;});var rd=[0,0,0,0,0];done.forEach(function(v){rd[v.rate||3]++;});
  var avg=done.length?(done.reduce(function(a,v){return a+(5-(v.rate||3));},0)/done.length).toFixed(2):'—';
  var h=A.banner('visits',done.length+' زيارة إشرافية منفذة · '+plan.length+' مجدولة','<button class="btn gold" data-add>'+ic('plus')+' زيارة جديدة</button>');
  h+='<div class="kpis mb">'+stat('eye','--k4',done.length,'زيارة إشرافية','')+stat('users','--k1',A.pct(Object.keys(visited).length,T.length)+'٪','تغطية المعلمات',Object.keys(visited).length+' من '+T.length)+stat('swap2','--k2',all.filter(function(v){return v.kind==='peer';}).length,'زيارة تبادلية','')+stat('star','--k3',avg,'متوسط التقدير','من 4')+'</div>';
  var list=visF==='plan'?plan:all.filter(function(v){return v.kind===visF&&v.st==='done';});list.sort(function(a,b){return a.d<b.d?(visF==='plan'?-1:1):(visF==='plan'?1:-1);});
  h+='<div class="cols"><div class="card"><div class="ctitle"><div class="seg">'+[['sup','الإشرافية'],['peer','تبادل الزيارات'],['plan','المجدولة']].map(function(x){return '<button data-f="'+x[0]+'" aria-pressed="'+(visF===x[0])+'">'+x[1]+'</button>';}).join('')+'</div></div>'+
   (list.length?list.map(function(v){var t=A.T(v.t);return '<div class="item">'+A.dbox(v.d)+'<div class="body"><b>'+esc(t.full||t.name)+'</b><p>'+esc(A.C(v.cls).name+' · '+A.subjName(v.subj))+' · <span class="muted">'+esc(v.kind==='peer'?'الزائرة: '+A.T(v.by).name:v.by)+'</span></p><p class="muted" style="font-size:12.5px">'+ic('target').replace('<svg','<svg style="width:13px;height:13px;vertical-align:-2px"')+' '+esc(v.focus)+'</p>'+
     (v.good?'<p style="font-size:12.5px"><span class="chip good">قوة</span> '+esc(v.good)+'</p>':'')+(v.rec?'<p style="font-size:12.5px"><span class="chip warn">توصية</span> '+esc(v.rec)+'</p>':'')+'</div><div class="stack" style="gap:6px;align-items:flex-end">'+(v.st==='done'&&v.kind==='sup'?A.stars(v.rate)+'<small class="muted">'+esc(I.RATE[v.rate])+'</small>':'<span class="chip '+(v.st==='plan'?'info':'good')+'">'+(v.st==='plan'?A.rel(v.d):'منفذة')+'</span>')+'<button class="ib" data-e="'+v.id+'" aria-label="تعديل">'+ic('edit')+'</button></div></div>';}).join(''):A.empty('لا زيارات في هذا التبويب','eye'))+'</div>';
  h+='<div class="stack"><div class="card"><div class="ctitle"><span class="ic2">'+ic('chart')+'</span><h3>توزيع التقديرات</h3></div><div class="vchart" style="height:140px">'+[1,2,3,4].map(function(k){return '<div class="col"><span>'+rd[k]+'</span><i style="--v:'+(rd[k]/Math.max(1,Math.max.apply(null,rd))*100)+';--c:'+['','#2F7D55','#5FA36A','#D9A64E','#B23A48'][k]+'"></i></div>';}).join('')+'</div><div class="vlab">'+[1,2,3,4].map(function(k){return '<span>'+I.RATE[k]+'</span>';}).join('')+'</div></div>'+
   '<div class="card"><div class="ctitle"><span class="ic2">'+ic('warn')+'</span><h3>لم تُزَر بعد</h3><span class="pill-n">'+T.filter(function(t){return !visited[t.id];}).length+'</span></div><div class="chips">'+T.filter(function(t){return !visited[t.id];}).map(function(t){return '<button class="chip" data-plan="'+t.id+'" style="border:0">'+esc(t.name)+' +</button>';}).join('')+'</div></div></div></div>';
  on('[data-f]','click',function(el){visF=el.dataset.f;A.refresh();});
  on('[data-add]','click',function(){visitForm({kind:visF==='peer'?'peer':'sup',st:visF==='plan'?'plan':'done'});});
  on('[data-plan]','click',function(el){var t=A.T(el.dataset.plan);visitForm({kind:'sup',st:'plan',t:t.id,subj:t.subj,cls:(t.classes||[])[0]});});
  on('[data-e]','click',function(el){visitForm(DA.rec(el.dataset.e));});
  return h;};
function visitForm(v){v=v||{};var S=A.school();A.form({title:v.id?'تعديل الزيارة':'زيارة صفية جديدة',data:Object.assign({d:DA.today(),by:S.principal,rate:1},v),wide:1,fields:[
  {k:'kind',label:'نوع الزيارة',type:'select',opts:[['sup','إشرافية'],['peer','تبادل زيارات']],half:'open'},{k:'st',label:'الحالة',type:'select',opts:[['done','منفذة'],['plan','مجدولة']],half:'close'},
  {k:'t',label:'المعلمة المزورة',type:'select',opts:A.teacherOpts(v.t),req:1,half:'open'},{k:'d',label:'التاريخ',type:'date',req:1,half:'close'},
  {k:'by',label:'الزائرة (اسم أو صفة؛ للتبادل اكتبي اسم المعلمة)',half:'open'},{k:'cls',label:'الشعبة',type:'select',opts:A.classOpts(v.cls),half:'close'},
  {k:'focus',label:'محور الزيارة',ph:'مثال: التقويم من أجل التعلم'},{k:'rate',label:'التقدير',type:'select',opts:[[1,'ممتاز'],[2,'جيد جدًا'],[3,'جيد'],[4,'يحتاج دعمًا']]},
  {k:'good',label:'جوانب القوة',type:'textarea'},{k:'rec',label:'التوصيات',type:'textarea'}],
  del:v.id?function(){A.remove(v.id,'الزيارة');}:null,
  onSave:function(x){x.rate=+x.rate;var t=A.T(x.t);x.subj=t.subj;if(x.kind==='peer'){var m=A.teachers().filter(function(y){return y.name===x.by||y.full===x.by;})[0];if(m)x.by=m.id;}DA.put(Object.assign({K:'vis'},v,x));DA.toast(v.id?'حُفظت الزيارة':'أُضيفت الزيارة');}});}

/* =================== النتائج وتحليلها =================== */
var resF={term:'t1',g:0};
var GL=['أ (90+)','ب (80–89)','ج (65–79)','د (50–64)','هـ (أقل من 50)'];
function agg(term,g,subj){var d=[0,0,0,0,0];DA.list('res',function(r){return r.term===term&&(!g||r.cls.charAt(1)==g)&&(!subj||r.subj===subj);}).forEach(function(r){r.dist.forEach(function(v,i){d[i]+=v;});});return d;}
function mastery(d){var n=d.reduce(function(a,b){return a+b;},0);return n?(d[0]+d[1])/n*100:0;}
function passR(d){var n=d.reduce(function(a,b){return a+b;},0);return n?(n-d[4])/n*100:0;}
function sbar(d){var n=d.reduce(function(a,b){return a+b;},0)||1;return '<div class="stackbar">'+d.map(function(v,i){return '<i class="g'+i+'" style="--v:'+(v/n*100)+'" title="'+GL[i]+': '+v+'"></i>';}).join('')+'</div>';}
P.results=function(){var cfg=DA.rec('terms'),terms=cfg?cfg.terms:[['t1','الفصل الحالي']],term=resF.term,prev=terms.filter(function(t){return t[0]!==term;})[0],g=resF.g;
  var tot=agg(term,g),totP=prev?agg(prev[0],g):null,subs=Object.keys(I.SUBJ);
  var rows=subs.map(function(s){var d=agg(term,g,s),p=prev?agg(prev[0],g,s):null;return {s:s,d:d,m:mastery(d),pr:passR(d),ch:p?mastery(d)-mastery(p):0};});
  var best=rows.slice().sort(function(a,b){return b.m-a.m;}),imp=rows.slice().sort(function(a,b){return b.ch-a.ch;});
  var h=A.banner('results',(terms.filter(function(t){return t[0]===term;})[0]||['',''])[1],'<button class="btn gold" data-add>'+ic('edit')+' إدخال نتائج</button><button class="btn ghost" href="#/reports/res" data-go="#/reports/res">'+ic('report')+' التقرير</button>');
  h+='<div class="card mb"><div class="row"><select class="in" style="max-width:280px" data-term>'+terms.map(function(t){return '<option value="'+t[0]+'"'+(t[0]===term?' selected':'')+'>'+esc(t[1])+'</option>';}).join('')+'</select><div class="seg">'+[0,1,2,3,4].map(function(x){return '<button data-g="'+x+'" aria-pressed="'+(g===x)+'">'+(x?'الصف '+['','الأول','الثاني','الثالث','الرابع'][x]:'كل الصفوف')+'</button>';}).join('')+'</div></div></div>';
  var m=mastery(tot),pr=passR(tot),ch=totP?m-mastery(totP):0;
  h+='<div class="kpis mb">'+stat('target','--k5',m.toFixed(1)+'٪','نسبة الإتقان (أ+ب)',(ch>=0?'↑ ':'↓ ')+Math.abs(ch).toFixed(1)+' عن '+(prev?'الفصل السابق':''))+stat('check','--k2',pr.toFixed(1)+'٪','نسبة النجاح','')+stat('student','--k1',tot.reduce(function(a,b){return a+b;},0),'نتيجة مادة','')+stat('warn','--k7',tot[4],'نتيجة دون 50','تحتاج خطة علاجية')+'</div>';
  h+='<div class="cols"><div class="card"><div class="ctitle"><span class="ic2">'+ic('chart')+'</span><h3>التحصيل حسب المادة</h3><span class="sp"></span><div class="legend">'+GL.map(function(x,i){return '<span><i class="g'+i+'"></i>'+x.split(' ')[0]+'</span>';}).join('')+'</div></div>'+
   '<div class="tbl-w"><table class="tbl"><tr><th>المادة</th><th style="min-width:180px">توزيع التقديرات</th><th class="c">إتقان</th><th class="c">نجاح</th><th class="c">التغيّر</th></tr>'+rows.map(function(r){return '<tr><td><b style="color:'+A.subjColor(r.s)+'">●</b> '+esc(A.subjName(r.s))+'</td><td>'+sbar(r.d)+'</td><td class="c num"><b>'+r.m.toFixed(0)+'٪</b></td><td class="c num">'+r.pr.toFixed(0)+'٪</td><td class="c"><span class="chip '+(r.ch>=0?'good':'bad')+'">'+(r.ch>=0?'▲ ':'▼ ')+Math.abs(r.ch).toFixed(1)+'</span></td></tr>';}).join('')+'</table></div></div>';
  var weakC=A.classes().filter(function(c){return !g||c.g===g;}).map(function(c){var d=[0,0,0,0,0];DA.list('res',function(r){return r.term===term&&r.cls===c.id;}).forEach(function(r){r.dist.forEach(function(v,i){d[i]+=v;});});return {c:c,m:mastery(d)};});
  var mx=Math.max.apply(null,weakC.map(function(x){return x.m;}));
  h+='<div class="card"><div class="ctitle"><span class="ic2">'+ic('bulb')+'</span><h3>قراءة ذكية للنتائج</h3></div><div class="stack" style="gap:8px">'+
   '<div class="alert good"><span class="ai">'+ic('trophy')+'</span><span><b>الأعلى إتقانًا: '+esc(A.subjName(best[0].s))+'</b><small>'+best[0].m.toFixed(1)+'٪ من الطلبة في مستوى أ وب</small></span></div>'+
   '<div class="alert bad"><span class="ai">'+ic('warn')+'</span><span><b>الأحوج للدعم: '+esc(A.subjName(best[best.length-1].s))+'</b><small>إتقان '+best[best.length-1].m.toFixed(1)+'٪ · نقترح خطة علاجية وحصصًا إثرائية</small></span></div>'+
   (prev?'<div class="alert good"><span class="ai">'+ic('grow')+'</span><span><b>الأكثر تحسّنًا: '+esc(A.subjName(imp[0].s))+'</b><small>ارتفع الإتقان '+imp[0].ch.toFixed(1)+' نقطة عن '+esc(prev[1])+'</small></span></div>':'')+
   '<div class="alert"><span class="ai">'+ic('users')+'</span><span><b>شعب تحتاج متابعة: '+weakC.slice().sort(function(a,b){return a.m-b.m;}).slice(0,3).map(function(x){return x.c.short;}).join('، ')+'</b><small>أدنى نسب إتقان في الصفوف المختارة</small></span></div></div>'+
   '<h4 class="mt" style="font-size:14px">الإتقان حسب الشعبة</h4><div class="vchart" style="height:150px">'+weakC.map(function(x){return '<div class="col"><span>'+x.m.toFixed(0)+'</span><i style="--v:'+(x.m/mx*100)+'"></i></div>';}).join('')+'</div><div class="vlab">'+weakC.map(function(x){return '<span>'+x.c.short+'</span>';}).join('')+'</div></div></div>';
  h+='<div class="card mt"><div class="ctitle"><span class="ic2">'+ic('list')+'</span><h3>توصيات مقترحة</h3></div><ol style="margin:0;padding-inline-start:22px;line-height:2">'+
   '<li>برنامج علاجي مركّز في <b>'+esc(A.subjName(best[best.length-1].s))+'</b> لطلبة المستويين د وهـ ('+tot[3]+' و'+tot[4]+' نتيجة) بحصص أسبوعية ومتابعة كل أسبوعين.</li>'+
   '<li>نقل الممارسات الناجحة في <b>'+esc(A.subjName(best[0].s))+'</b> عبر دروس تطبيقية وتبادل زيارات.</li>'+
   '<li>تفعيل الحصة الإثرائية للمتميزين في مستوى أ ('+tot[0]+' نتيجة) للحفاظ على تقدّمهم.</li>'+
   '<li>مشاركة أولياء أمور الشعب الأقل إتقانًا في خطة متابعة منزلية مبسطة.</li></ol></div>';
  on('[data-term]','change',function(el){resF.term=el.value;A.refresh();});
  on('[data-g]','click',function(el){resF.g=+el.dataset.g;A.refresh();});
  on('[data-go]','click',function(el){location.hash=el.dataset.go;});
  on('[data-add]','click',function(){resForm(term);});
  return h;};
function resForm(term){var cfg=DA.rec('terms'),terms=cfg?cfg.terms:[];
  var d=A.form({title:'إدخال نتائج شعبة ومادة',data:{term:term,cls:'c11',subj:'ar'},wide:1,fields:[
   {k:'term',label:'الفصل',type:'select',opts:terms,half:'open'},{k:'cls',label:'الشعبة',type:'select',opts:A.classOpts('c11'),half:'close'},{k:'subj',label:'المادة',type:'select',opts:Object.keys(I.SUBJ).map(function(k){return [k,I.SUBJ[k][0]];})},
   {k:'d0',label:'عدد أ (90+)',type:'number',half:'open'},{k:'d1',label:'عدد ب (80–89)',type:'number',half:'close'},{k:'d2',label:'عدد ج (65–79)',type:'number',half:'open'},{k:'d3',label:'عدد د (50–64)',type:'number',half:'close'},{k:'d4',label:'عدد هـ (أقل من 50)',type:'number'}],
   onSave:function(v){var dist=[+v.d0||0,+v.d1||0,+v.d2||0,+v.d3||0,+v.d4||0];if(!dist.some(function(x){return x>0;})){DA.toast('أدخلي عدد الطلبة في تقدير واحد على الأقل');return false;}
     DA.put({id:'r_'+v.term+'_'+v.cls+'_'+v.subj,K:'res',term:v.term,cls:v.cls,subj:v.subj,dist:dist});DA.toast('حُفظت نتائج '+A.C(v.cls).short+' في '+A.subjName(v.subj));}});
  function fill(){var r=DA.rec('r_'+$('[name=term]',d).value+'_'+$('[name=cls]',d).value+'_'+$('[name=subj]',d).value);[0,1,2,3,4].forEach(function(i){$('[name=d'+i+']',d).value=r?r.dist[i]:'';});}
  ['term','cls','subj'].forEach(function(k){$('[name='+k+']',d).addEventListener('change',fill);});fill();}

/* =================== الخطة التشغيلية =================== */
P.plan=function(){var G=DA.list('goal'),all=0,dn=0;G.forEach(function(g){(g.acts||[]).forEach(function(a){all++;if(a.done)dn++;});});var p=A.pct(dn,all);
  var h=A.banner('plan',G.length+' أهداف · '+all+' مبادرة','<button class="btn gold" data-add>'+ic('plus')+' هدف جديد</button>');
  var doms={};G.forEach(function(g){doms[g.dom]=doms[g.dom]||[0,0];(g.acts||[]).forEach(function(a){doms[g.dom][1]++;if(a.done)doms[g.dom][0]++;});});
  h+='<div class="card mb row" style="gap:22px"><span class="ring" style="--p:'+p+';--sz:120px"><b>'+p+'٪</b></span><div style="flex:1;min-width:240px"><h3>نسبة إنجاز الخطة</h3><p class="muted" style="margin:2px 0 10px">'+dn+' من '+all+' مبادرة منجزة</p><div class="stack" style="gap:8px">'+Object.keys(doms).map(function(k){var x=doms[k];return '<div class="fair"><span style="width:140px">'+esc(k)+'</span><div class="bar" style="flex:1"><i style="--p:'+A.pct(x[0],x[1])+'"></i></div><b class="num">'+A.pct(x[0],x[1])+'٪</b></div>';}).join('')+'</div></div></div>';
  h+='<div class="grid" style="--min:340px">'+G.map(function(g){var a=g.acts||[],d=a.filter(function(x){return x.done;}).length;return '<article class="card goal" style="--c:'+(g.color||'var(--a)')+'"><div class="ctitle"><span class="chip" style="background:color-mix(in srgb,'+(g.color||'#D9A64E')+' 15%,transparent);color:'+(g.color||'var(--a2)')+'">'+esc(g.dom)+'</span><span class="sp"></span><button class="ib" data-e="'+g.id+'" aria-label="تعديل الهدف">'+ic('edit')+'</button></div>'+
    '<h3>'+esc(g.title)+'</h3><div class="fair mt" style="margin-top:8px"><div class="bar" style="flex:1"><i style="--p:'+A.pct(d,a.length)+';--c:'+(g.color||'var(--a)')+'"></i></div><b class="num">'+A.pct(d,a.length)+'٪</b></div>'+
    a.map(function(x){return '<label class="act'+(x.done?' done':'')+'"><input type="checkbox" data-g="'+g.id+'" data-a="'+x.id+'"'+(x.done?' checked':'')+'><span>'+esc(x.txt)+'</span><small>'+esc(x.who||'')+(x.when?' · '+esc(x.when):'')+'</small></label>';}).join('')+
    '<button class="btn ghost sm mt" data-na="'+g.id+'">'+ic('plus')+' مبادرة</button></article>';}).join('')+'</div>';
  on('[data-a]','change',function(el){var g=DA.rec(el.dataset.g);g.acts=g.acts.map(function(x){return x.id===el.dataset.a?Object.assign({},x,{done:el.checked}):x;});DA.put(g);if(el.checked){DA.snd('ok');DA.toast('أحسنتِ، أُنجزت المبادرة');}});
  on('[data-na]','click',function(el){var g=DA.rec(el.dataset.na);A.form({title:'مبادرة جديدة',fields:[{k:'txt',label:'المبادرة',req:1},{k:'who',label:'المسؤول',half:'open'},{k:'when',label:'الموعد',ph:'مثال: ديسمبر',half:'close'}],onSave:function(v){g.acts=(g.acts||[]).concat([{id:DA.uid('a'),txt:v.txt,who:v.who,when:v.when,done:false}]);DA.put(g);DA.toast('أُضيفت المبادرة');}});});
  on('[data-add]','click',function(){goalForm();});
  on('[data-e]','click',function(el){goalForm(DA.rec(el.dataset.e));});
  return h;};
function goalForm(g){g=g||{};A.form({title:g.id?'تعديل الهدف':'هدف جديد',data:Object.assign({acts:''},g,{actsTxt:(g.acts||[]).map(function(a){return a.txt;}).join('\n')}),fields:[
  {k:'dom',label:'المجال',type:'select',opts:['التعليم والتعلم','الإنماء المهني','البيئة المدرسية','الشراكة المجتمعية','القيادة والتقويم']},{k:'title',label:'الهدف',req:1},
  {k:'color',label:'اللون',type:'select',opts:[['#1F6F8B','فيروزي'],['#B7791F','ذهبي'],['#6B46C1','بنفسجي'],['#2F855A','أخضر'],['#B83280','وردي'],['#4A5568','رمادي']]},
  {k:'actsTxt',label:'المبادرات (كل سطر مبادرة)',type:'textarea'}],del:g.id?function(){A.remove(g.id,'الهدف');}:null,
  onSave:function(v){var old=g.acts||[];var acts=v.actsTxt.split('\n').map(function(s){return s.trim();}).filter(Boolean).map(function(t){var o=old.filter(function(x){return x.txt===t;})[0];return o||{id:DA.uid('a'),txt:t,done:false};});
    var r=Object.assign({K:'goal'},g,{dom:v.dom,title:v.title,color:v.color,acts:acts});delete r.actsTxt;DA.put(r);DA.toast('حُفظ الهدف');}});}

/* =================== الاجتماعات =================== */
var DST={done:['منجز','good'],run:['جارٍ','info'],late:['متأخر','bad']};
function decSt(d){return d.st==='done'?'done':(d.due<DA.today()?'late':'run');}
P.meet=function(){var M=DA.list('meet').sort(function(a,b){return a.d<b.d?1:-1;}),decs=[];M.forEach(function(m){(m.dec||[]).forEach(function(d){decs.push({m:m,d:d,s:decSt(d)});});});
  var c={done:0,run:0,late:0};decs.forEach(function(x){c[x.s]++;});
  var h=A.banner('meet',M.length+' اجتماعات · '+decs.length+' قرارًا','<button class="btn gold" data-add>'+ic('plus')+' اجتماع جديد</button>');
  h+='<div class="kpis mb">'+stat('chat','--k1',M.length,'اجتماعًا','')+stat('check','--k5',c.done,'قرارًا منجزًا','')+stat('clock','--k2',c.run,'قرارًا جاريًا','')+stat('warn','--k7',c.late,'قرارًا متأخرًا','')+'</div>';
  h+='<div class="grid" style="--min:360px">'+M.map(function(m){return '<article class="card"><div class="ctitle">'+A.dbox(m.d)+'<div style="flex:1;min-width:0"><h3>'+esc(m.title)+'</h3><small>'+esc((m.time||'')+' · '+(m.place||''))+(m.att?' · '+m.att+' حاضرًا':'')+'</small></div><span class="chip '+(m.st==='plan'?'info':'good')+'">'+(m.st==='plan'?A.rel(m.d):'منعقد')+'</span></div>'+
    ((m.agenda||[]).length?'<b style="font-size:13px">جدول الأعمال</b><ol class="agenda-list">'+m.agenda.map(function(a){return '<li>'+esc(a)+'</li>';}).join('')+'</ol>':'')+
    '<b style="font-size:13px;display:block;margin-top:10px">القرارات</b>'+((m.dec||[]).length?m.dec.map(function(d){var s=decSt(d);return '<div class="dec"><div class="tx">'+esc(d.txt)+'<small>'+esc(d.who||'')+' · '+esc(A.short(d.due))+'</small></div><button class="chip '+DST[s][1]+'" style="border:0" data-ds="'+m.id+'" data-d="'+d.id+'" title="تبديل الحالة">'+DST[s][0]+'</button></div>';}).join(''):'<p class="muted" style="margin:4px 0">لا قرارات بعد.</p>')+
    '<div class="row mt" style="margin-top:12px"><button class="btn ghost sm" data-nd="'+m.id+'">'+ic('plus')+' قرار</button><button class="btn ghost sm" data-min="'+m.id+'">'+ic('print')+' المحضر</button><span class="sp"></span><button class="ib" data-e="'+m.id+'" aria-label="تعديل">'+ic('edit')+'</button></div></article>';}).join('')+'</div>';
  on('[data-add]','click',function(){meetForm();});
  on('[data-e]','click',function(el){meetForm(DA.rec(el.dataset.e));});
  on('[data-ds]','click',function(el){var m=DA.rec(el.dataset.ds);m.dec=m.dec.map(function(d){if(d.id!==el.dataset.d)return d;return Object.assign({},d,{st:d.st==='done'?'run':'done'});});DA.put(m);DA.snd('ok');});
  on('[data-nd]','click',function(el){var m=DA.rec(el.dataset.nd);A.form({title:'قرار جديد',fields:[{k:'txt',label:'نص القرار',req:1,type:'textarea'},{k:'who',label:'المسؤول',half:'open'},{k:'due',label:'موعد التنفيذ',type:'date',def:I.iso(I.addD(new Date(),7)),half:'close'}],onSave:function(v){m.dec=(m.dec||[]).concat([{id:DA.uid('d'),txt:v.txt,who:v.who,due:v.due,st:'run'}]);DA.put(m);DA.toast('أُضيف القرار');}});});
  on('[data-min]','click',function(el){minutes(DA.rec(el.dataset.min));});
  return h;};
function meetForm(m){m=m||{};A.form({title:m.id?'تعديل الاجتماع':'اجتماع جديد',wide:1,data:Object.assign({d:DA.today(),time:'12:20',st:'plan'},m,{agTxt:(m.agenda||[]).join('\n')}),fields:[
  {k:'title',label:'عنوان الاجتماع',req:1},{k:'d',label:'التاريخ',type:'date',req:1,half:'open'},{k:'time',label:'الوقت',type:'time',half:'close'},{k:'place',label:'المكان',half:'open'},{k:'st',label:'الحالة',type:'select',opts:[['plan','مجدول'],['done','منعقد']],half:'close'},
  {k:'att',label:'عدد الحاضرين',type:'number'},{k:'agTxt',label:'جدول الأعمال (كل سطر بند)',type:'textarea'},{k:'notes',label:'ملخص المحضر',type:'textarea'}],del:m.id?function(){A.remove(m.id,'الاجتماع');}:null,
  onSave:function(v){var r=Object.assign({K:'meet',dec:[]},m,v,{agenda:v.agTxt.split('\n').map(function(s){return s.trim();}).filter(Boolean)});delete r.agTxt;DA.put(r);DA.toast('حُفظ الاجتماع');}});}
function minutes(m){var S=A.school();var d=DA.dlg('<div class="paper" id="pp">'+phead('محضر اجتماع')+'<h2>'+esc(m.title)+'</h2><p>التاريخ: '+esc(A.fmt(m.d))+' · الوقت: '+esc(m.time||'')+' · المكان: '+esc(m.place||'')+' · الحضور: '+(m.att||'—')+'</p>'+
  '<h3>جدول الأعمال</h3><ol>'+(m.agenda||[]).map(function(a){return '<li>'+esc(a)+'</li>';}).join('')+'</ol>'+(m.notes?'<h3>ملخص المناقشة</h3><p>'+esc(m.notes)+'</p>':'')+
  '<h3>القرارات والتوصيات</h3><table><tr><th>م</th><th>القرار</th><th>المسؤول</th><th>موعد التنفيذ</th><th>الحالة</th></tr>'+(m.dec||[]).map(function(x,i){return '<tr><td>'+(i+1)+'</td><td>'+esc(x.txt)+'</td><td>'+esc(x.who||'')+'</td><td>'+esc(A.short(x.due))+'</td><td>'+DST[decSt(x)][0]+'</td></tr>';}).join('')+'</table>'+
  '<div class="sig"><span>مقررة الاجتماع: ..................</span><span>مديرة المدرسة: '+esc(S.principal)+'</span></div><div class="wm2">نسخة عرض · بيانات وهمية</div></div><div class="acts"><button class="btn ghost" data-close>إغلاق</button><button class="btn gold" data-p>'+ic('print')+' طباعة</button></div>',{wide:true});
  $('[data-p]',d).onclick=function(){printEl($('#pp',d));};}
function phead(t){var S=A.school();return '<div class="phead"><img src="icons/mark.svg" alt=""><div class="t"><b style="font-size:17px">'+esc(S.name)+'</b><small>'+esc(S.place)+' · العام الدراسي '+esc(S.year)+'</small></div><div style="text-align:end"><b>'+esc(t)+'</b><small>'+esc(A.fmt(DA.today()))+'</small></div></div>';}
A.phead=phead;
function printEl(el){var w=document.createElement('div');w.className='print-only';w.innerHTML=el.outerHTML;document.body.appendChild(w);document.body.classList.add('printing');var st=document.createElement('style');st.textContent='@media print{body.printing>*:not(.print-only){display:none!important}.print-only .paper{box-shadow:none;padding:0}}@media screen{.print-only{display:none}}';document.head.appendChild(st);
  setTimeout(function(){window.print();setTimeout(function(){w.remove();st.remove();document.body.classList.remove('printing');},400);},60);}
A.printEl=printEl;

/* =================== التقويم والفعاليات =================== */
var calM=null;
P.events=function(){var now=new Date();if(!calM)calM=[now.getFullYear(),now.getMonth()];var y=calM[0],mo=calM[1],E=DA.list('evt'),cat={};I.EVCAT.forEach(function(c){cat[c[0]]=c;});
  var h=A.banner('events',DA.MONTHS[mo]+' '+y,'<button class="btn gold" data-add>'+ic('plus')+' فعالية</button>');
  var first=new Date(y,mo,1),start=I.addD(first,-first.getDay()),cells='';
  ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'].forEach(function(d){cells+='<div class="dh">'+d+'</div>';});
  for(var i=0;i<42;i++){var dd=I.addD(start,i),iso=I.iso(dd),ev=E.filter(function(e){return e.d===iso;});if(i===35&&dd.getMonth()!==mo)break;
    cells+='<div class="dc'+(dd.getMonth()!==mo?' out':'')+(dd.getDay()>4?' we':'')+(iso===DA.today()?' now':'')+'"><b>'+dd.getDate()+'</b>'+ev.map(function(e){var c=cat[e.cat]||I.EVCAT[0];return '<span class="ev" style="--c:'+c[2]+'" data-e="'+e.id+'" title="'+esc(e.title)+'">'+esc(e.title)+'</span>';}).join('')+'</div>';}
  h+='<div class="cols"><div class="card"><div class="ctitle"><button class="ib" data-m="-1" aria-label="الشهر السابق">'+ic('right')+'</button><h3 style="flex:1;text-align:center">'+DA.MONTHS[mo]+' '+y+'</h3><button class="ib" data-m="1" aria-label="الشهر التالي">'+ic('left')+'</button></div><div class="cal">'+cells+'</div>'+
   '<div class="legend mt">'+I.EVCAT.map(function(c){return '<span><i style="background:'+c[2]+'"></i>'+c[1]+'</span>';}).join('')+'</div></div>';
  var up=E.filter(function(e){return e.d>=DA.today();}).sort(function(a,b){return a.d<b.d?-1:1;}),past=E.filter(function(e){return e.d<DA.today();}).sort(function(a,b){return a.d<b.d?1:-1;}).slice(0,4);
  h+='<div class="card"><div class="ctitle"><span class="ic2">'+ic('flag')+'</span><h3>القادم</h3></div>'+(up.length?up.map(function(e){var c=cat[e.cat]||I.EVCAT[0];return '<div class="item" data-e="'+e.id+'" style="cursor:pointer">'+A.dbox(e.d)+'<div class="body"><b>'+esc(e.title)+'</b><p class="muted">'+esc(e.place||'')+' · '+A.rel(e.d)+'</p></div><span class="chip" style="background:'+c[2]+';color:#fff">'+c[1]+'</span></div>';}).join(''):'<p class="muted">لا فعاليات قادمة.</p>')+
   '<h4 class="mt" style="font-size:14px">مضى مؤخرًا</h4>'+past.map(function(e){return '<div class="item" data-e="'+e.id+'" style="cursor:pointer;opacity:.75">'+A.dbox(e.d)+'<div class="body"><b>'+esc(e.title)+'</b></div></div>';}).join('')+'</div></div>';
  on('[data-m]','click',function(el){mo+= +el.dataset.m;if(mo<0){mo=11;y--;}if(mo>11){mo=0;y++;}calM=[y,mo];A.refresh();});
  on('[data-add]','click',function(){evForm();});
  on('[data-e]','click',function(el){evForm(DA.rec(el.dataset.e));});
  return h;};
function evForm(e){e=e||{};A.form({title:e.id?'تعديل الفعالية':'فعالية جديدة',data:Object.assign({d:DA.today(),cat:'ev'},e),fields:[{k:'title',label:'العنوان',req:1},{k:'d',label:'التاريخ',type:'date',req:1,half:'open'},{k:'cat',label:'النوع',type:'select',opts:I.EVCAT.map(function(c){return [c[0],c[1]];}),half:'close'},{k:'place',label:'المكان'}],
  del:e.id?function(){A.remove(e.id,'الفعالية');}:null,onSave:function(v){DA.put(Object.assign({K:'evt'},e,v));DA.toast('حُفظت الفعالية');}});}

/* =================== التعاميم والمراسلات =================== */
var circF='';var CST={exec:['للتنفيذ','warn'],read:['للاطلاع','info'],done:['منجز','good']};
P.circ=function(){var L=DA.list('circ',function(c){return !circF||c.dir===circF;}).sort(function(a,b){return a.d<b.d?1:-1;});
  var h=A.banner('circ',DA.list('circ',function(c){return c.dir==='in';}).length+' وارد · '+DA.list('circ',function(c){return c.dir==='out';}).length+' صادر','<button class="btn gold" data-add>'+ic('plus')+' تسجيل مراسلة</button>');
  h+='<div class="row mb"><div class="seg">'+[['','الكل'],['in','الوارد'],['out','الصادر']].map(function(x){return '<button data-f="'+x[0]+'" aria-pressed="'+(circF===x[0])+'">'+x[1]+'</button>';}).join('')+'</div></div>';
  h+=L.length?'<div class="tbl-w"><table class="tbl"><tr><th>الرقم</th><th>التاريخ</th><th>الموضوع</th><th>الجهة</th><th>الحالة</th><th></th></tr>'+L.map(function(c){return '<tr><td class="num"><span class="chip '+(c.dir==='in'?'info':'gold')+'">'+esc(c.no||'')+'</span></td><td class="nowrap">'+esc(A.short(c.d))+'</td><td><b>'+esc(c.title)+'</b></td><td>'+esc(c.party||'')+'</td><td><button class="chip '+CST[c.st][1]+'" style="border:0" data-s="'+c.id+'">'+CST[c.st][0]+'</button></td><td><button class="ib" data-e="'+c.id+'" aria-label="تعديل">'+ic('edit')+'</button></td></tr>';}).join('')+'</table></div>':A.empty('لا مراسلات','mail');
  on('[data-f]','click',function(el){circF=el.dataset.f;A.refresh();});
  on('[data-s]','click',function(el){var c=DA.rec(el.dataset.s);c.st=c.st==='exec'?'done':c.st==='done'?'read':'exec';DA.put(c);});
  on('[data-add]','click',function(){circForm();});
  on('[data-e]','click',function(el){circForm(DA.rec(el.dataset.e));});
  return h;};
function circForm(c){c=c||{};A.form({title:c.id?'تعديل المراسلة':'تسجيل مراسلة',data:Object.assign({d:DA.today(),dir:'in',st:'exec'},c),fields:[{k:'dir',label:'النوع',type:'select',opts:[['in','وارد'],['out','صادر']],half:'open'},{k:'no',label:'الرقم',half:'close'},{k:'title',label:'الموضوع',req:1},{k:'party',label:'الجهة',half:'open'},{k:'d',label:'التاريخ',type:'date',half:'close'},{k:'st',label:'الحالة',type:'select',opts:[['exec','للتنفيذ'],['read','للاطلاع'],['done','منجز']]}],
  del:c.id?function(){A.remove(c.id,'المراسلة');}:null,onSave:function(v){DA.put(Object.assign({K:'circ'},c,v));DA.toast('حُفظت المراسلة');}});}

/* =================== الإنجازات والشواهد =================== */
var achF='';
var CATC={comp:'#B7791F',act:'#1F6F8B',init:'#6B46C1',part:'#2F855A',hon:'#B83280'};
A.cover=function(cat,seed){var c=CATC[cat]||'#173F55',ick=(I.ACHCAT.filter(function(x){return x[0]===cat;})[0]||[0,0,'star'])[2],s=0;String(seed||'').split('').forEach(function(ch){s=(s*31+ch.charCodeAt(0))%997;});
  var circ='';for(var i=0;i<7;i++){var x=(s*(i+3)*37)%320,y=(s*(i+5)*53)%200,r=8+((s*(i+2))%34);circ+='<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="#fff" opacity="'+(.05+((i*s)%7)/70)+'"/>';}
  return '<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="cg'+s+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+c+'"/><stop offset="1" stop-color="#0F2C3C"/></linearGradient><pattern id="cp'+s+'" width="42" height="42" patternUnits="userSpaceOnUse"><g fill="none" stroke="#fff" stroke-opacity=".08"><rect x="12" y="12" width="18" height="18"/><rect x="12" y="12" width="18" height="18" transform="rotate(45 21 21)"/></g></pattern></defs>'+
   '<rect width="320" height="200" fill="url(#cg'+s+')"/><rect width="320" height="200" fill="url(#cp'+s+')"/>'+circ+'<circle cx="160" cy="96" r="52" fill="#fff" opacity=".12"/><circle cx="160" cy="96" r="40" fill="none" stroke="#F2CF8A" stroke-dasharray="3 5" opacity=".7"/>'+
   '<g transform="translate(130 66) scale(2.5)" fill="none" stroke="#F2CF8A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'+DA.P[ick]+'</g><path d="M0 170 Q80 150 160 166 T320 160 V200 H0z" fill="#fff" opacity=".1"/></svg>';};
P.ach=function(){var L=DA.list('ach',function(a){return !achF||a.cat===achF;}).sort(function(a,b){return a.d<b.d?1:-1;}),cat={};I.ACHCAT.forEach(function(c){cat[c[0]]=c;});
  var h=A.banner('ach',DA.list('ach').length+' إنجازًا موثقًا','<button class="btn gold" data-add>'+ic('plus')+' أضيفي إنجازًا</button>');
  h+='<div class="chips mb"><button class="fchip" data-f="" aria-pressed="'+(!achF)+'">الكل</button>'+I.ACHCAT.map(function(c){return '<button class="fchip" data-f="'+c[0]+'" aria-pressed="'+(achF===c[0])+'">'+c[1]+' · '+DA.list('ach',function(a){return a.cat===c[0];}).length+'</button>';}).join('')+'</div>';
  h+=L.length?'<div class="gal">'+L.map(function(a){var c=cat[a.cat]||I.ACHCAT[0];return achCard(a,c[1],CATC[a.cat]);}).join('')+'</div>':A.empty('لا إنجازات في هذا التصنيف بعد','trophy');
  on('[data-f]','click',function(el){achF=el.dataset.f;A.refresh();});
  on('[data-add]','click',function(){achForm({cat:achF||'act'});});
  on('[data-e]','click',function(el){achForm(DA.rec(el.dataset.e));});
  on('[data-view]','click',function(el){var a=DA.rec(el.dataset.view);if(a.img)DA.lightbox([{fid:a.img,cap:a.title}],0);else achView(a);});
  return h;};
function achCard(a,catName,col,editAttr){return '<article class="card ach" style="--c:'+(col||'var(--a)')+'"><button class="cover" data-view="'+a.id+'" aria-label="عرض">'+(a.img?'<img alt="" data-fid="'+esc(a.img)+'">':A.cover(a.cat||'act',a.id+a.title))+'<span class="cat">'+esc(catName||'')+'</span></button>'+
  '<div class="cb"><b>'+esc(a.title)+'</b><p>'+esc(a.txt||'')+'</p><div class="foot2">'+ic('cal').replace('<svg','<svg style="width:14px;height:14px"')+'<span>'+esc(DA.fmtD(a.d))+'</span><span class="sp"></span><button class="ib" '+(editAttr||'data-e')+'="'+a.id+'" aria-label="تعديل" style="width:32px;height:32px">'+ic('edit')+'</button></div></div></article>';}
A.achCard=achCard;
function achView(a){DA.dlg('<div style="border-radius:16px;overflow:hidden;margin:-4px 0 12px;aspect-ratio:16/9">'+A.cover(a.cat,a.id+a.title)+'</div><h2>'+esc(a.title)+'</h2><p class="muted">'+esc(A.fmt(a.d))+'</p><p>'+esc(a.txt||'')+'</p><div class="acts"><button class="btn gold" data-close>إغلاق</button></div>');}
function achForm(a){a=a||{};A.form({title:a.id?'تعديل الإنجاز':'أضيفي إنجازًا',data:Object.assign({d:DA.today(),cat:'act'},a),fields:[{k:'title',label:'عنوان الإنجاز',req:1},{k:'cat',label:'التصنيف',type:'select',opts:I.ACHCAT.map(function(c){return [c[0],c[1]];}),half:'open'},{k:'d',label:'التاريخ',type:'date',half:'close'},{k:'txt',label:'الوصف',type:'textarea'},{k:'img',label:'صورة الشاهد',type:'img'}],
  del:a.id?function(){A.remove(a.id,'الإنجاز');}:null,onSave:function(v){DA.put(Object.assign({K:'ach'},a,v));DA.toast(a.id?'حُفظ الإنجاز':'أُضيف الإنجاز إلى المعرض');}});}

/* =================== لوحة الشرف والأوسمة =================== */
P.honor=function(){var T=A.teachers().slice().sort(function(a,b){return (b.pts||0)-(a.pts||0);});
  var h=A.banner('honor','نقاط تُجمع من الحضور والزيارات والاحتياط والمبادرات','<button class="btn gold" data-grant>'+ic('medal')+' منح وسام</button>');
  h+='<div class="cols"><div class="card"><div class="ctitle"><span class="ic2">'+ic('trophy')+'</span><h3>نجمات المدرسة</h3></div>'+podium(T.slice(0,3))+
   T.slice(3,12).map(function(t,i){return '<div class="rank"><span class="n">'+(i+4)+'</span>'+A.who(t)+'<div class="badges-row">'+(t.badges||[]).map(function(b){return A.medal(b,1);}).join('')+'</div><span class="pt">'+(t.pts||0)+'</span></div>';}).join('')+'</div>';
  h+='<div class="card"><div class="ctitle"><span class="ic2">'+ic('medal')+'</span><h3>الأوسمة</h3></div><div class="grid" style="--min:140px;gap:10px">'+I.BADGES.map(function(b){var n=T.filter(function(t){return (t.badges||[]).indexOf(b[0])>=0;});return '<div class="bdg-card">'+A.medal(b[0])+'<b>'+esc(b[1])+'</b><small>'+esc(b[2])+'</small><span class="cnt">'+n.length+' معلمة</span></div>';}).join('')+'</div></div></div>';
  /* الطلبة: الحضور المثالي */
  var days=I.schoolDays(new Date(A.workday()+'T08:00:00'),20),ab={};days.forEach(function(d){var r=DA.rec('sat_'+d);if(r)Object.keys(r.c).forEach(function(c){r.c[c].forEach(function(s){ab[s]=1;});});});
  h+='<div class="grp"><h2>طلبة الحضور المثالي · آخر 20 يومًا</h2><i></i></div><div class="grid" style="--min:230px">'+[1,2,3,4].map(function(g){var L=DA.list('stu',function(s){return s.cls.charAt(1)==g&&!ab[s.id];});return '<div class="card"><div class="ctitle"><span class="ic2">'+ic('sun')+'</span><h3>الصف '+['','الأول','الثاني','الثالث','الرابع'][g]+'</h3><span class="sp"></span><span class="pill-n">'+L.length+'</span></div><div class="chips">'+L.slice(0,10).map(function(s){return '<span class="chip">'+esc(s.name.split(' ')[0]+' '+s.name.split(' ').slice(-1)[0])+'</span>';}).join('')+(L.length>10?'<span class="chip gold">+'+(L.length-10)+'</span>':'')+'</div></div>';}).join('')+'</div>';
  on('[data-grant]','click',function(){A.grant(T[0]&&T[0].id);});
  return h;};

/* =================== التقارير =================== */
var REPS=[['month','التقرير الشهري الشامل','report','--k1','ملخص كل مؤشرات المدرسة في صفحة واحدة'],['tatt','تقرير حضور المعلمات','check','--k5','الحضور والتأخير والغياب لكل معلمة'],['satt','تقرير حضور الطلبة','student','--k2','نسب الحضور لكل شعبة والغياب المتكرر'],['subs','تقرير الاحتياط','swap','--k7','الحصص المغطاة وعدالة التوزيع'],
  ['vis','تقرير الزيارات الصفية','eye','--k4','التغطية والتقديرات والتوصيات'],['res','تقرير النتائج','chart','--k8','التحصيل حسب المادة والمقارنة'],['dec','تقرير متابعة القرارات','chat','--k3','قرارات الاجتماعات وحالتها'],['plan','تقرير الخطة التشغيلية','target','--k6','الأهداف والمبادرات ونسب الإنجاز']];
P.reports=function(a){if(a)return report(a);
  var h=A.banner('reports','تقارير تُولَّد من بيانات المنصة مباشرة');
  h+='<div class="grid" style="--min:280px">'+REPS.map(function(r){return '<a class="card rep-card" href="#/reports/'+r[0]+'" style="--c:var('+r[3]+');text-decoration:none;color:inherit"><span class="ri">'+ic(r[2])+'</span><span><b style="font-size:15.5px;display:block">'+esc(r[1])+'</b><small class="muted">'+esc(r[4])+'</small></span></a>';}).join('')+'</div>';
  return h;};
function report(k){var r=REPS.filter(function(x){return x[0]===k;})[0]||REPS[0],S=A.school(),T=A.teachers(),stu=DA.list('stu'),days=I.schoolDays(new Date(A.workday()+'T08:00:00'),20),b='';
  function tatt(){var tot={p:0,l:0,a:0,o:0};var rows=T.map(function(t){var k={p:0,l:0,a:0,o:0};days.forEach(function(d){var s=A.tatt(d)[t.id]||'p';var g=s==='p'?'p':s==='l'?'l':(s==='a'||s==='s')?'a':'o';k[g]++;tot[g]++;});return '<tr><td>'+esc(t.full||t.name)+'</td><td>'+esc(A.subjName(t.subj))+'</td><td>'+k.p+'</td><td>'+k.l+'</td><td>'+k.a+'</td><td>'+k.o+'</td><td>'+A.pct(k.p+k.l,days.length)+'٪</td></tr>';}).join('');
    return {h:'<table><tr><th>المعلمة</th><th>المادة</th><th>حضور</th><th>تأخير</th><th>غياب</th><th>مهمة</th><th>النسبة</th></tr>'+rows+'</table>',p:A.pct(tot.p+tot.l,tot.p+tot.l+tot.a+tot.o)};}
  function satt(){var cl=A.classes().map(function(c){var n=stu.filter(function(s){return s.cls===c.id;}).length,a=0;days.forEach(function(d){var x=DA.rec('sat_'+d);if(x)a+=(x.c[c.id]||[]).length;});return [c,n,a,100-a/(n*days.length)*100];});
    var avg=cl.reduce(function(s,x){return s+x[3];},0)/cl.length;return {h:'<table><tr><th>الشعبة</th><th>عدد الطلبة</th><th>أيام الغياب</th><th>نسبة الحضور</th></tr>'+cl.map(function(x){return '<tr><td>'+esc(x[0].name)+'</td><td>'+x[1]+'</td><td>'+x[2]+'</td><td>'+x[3].toFixed(1)+'٪</td></tr>';}).join('')+'</table>'+
      '<h3>الغياب المتكرر</h3><table><tr><th>الطالب/ة</th><th>الشعبة</th><th>أيام الغياب</th></tr>'+A.chronic().map(function(x){return '<tr><td>'+esc(x.s.name)+'</td><td>'+esc(A.C(x.s.cls).short)+'</td><td>'+x.n+'</td></tr>';}).join('')+'</table>',p:avg};}
  function subs(){var L=DA.list('sub',function(s){return s.d>=days[0];});var rows=T.map(function(t){return [t,L.filter(function(s){return s.by===t.id;}).length];}).sort(function(a,b){return b[1]-a[1];});
    return {h:'<p>إجمالي حصص الاحتياط المغطاة خلال آخر 20 يومًا: <b>'+L.length+'</b> حصة.</p><table><tr><th>المعلمة</th><th>حصص الاحتياط</th></tr>'+rows.map(function(x){return '<tr><td>'+esc(x[0].full||x[0].name)+'</td><td>'+x[1]+'</td></tr>';}).join('')+'</table>',n:L.length};}
  function vis(){var L=DA.list('vis',function(v){return v.st==='done';}).sort(function(a,b){return a.d<b.d?1:-1;});return {h:'<table><tr><th>التاريخ</th><th>المعلمة</th><th>الشعبة</th><th>المحور</th><th>التقدير</th><th>التوصية</th></tr>'+L.map(function(v){return '<tr><td>'+esc(A.short(v.d))+'</td><td>'+esc(A.T(v.t).name)+'</td><td>'+esc(A.C(v.cls).short)+'</td><td>'+esc(v.focus)+'</td><td>'+(v.kind==='peer'?'تبادلية':esc(I.RATE[v.rate]||''))+'</td><td>'+esc(v.rec||'')+'</td></tr>';}).join('')+'</table>',n:L.length};}
  function res(){var t='t1';var rows=Object.keys(I.SUBJ).map(function(s){var d=agg(t,0,s),p=agg('p2',0,s);return '<tr><td>'+esc(A.subjName(s))+'</td>'+d.map(function(v){return '<td>'+v+'</td>';}).join('')+'<td>'+mastery(d).toFixed(1)+'٪</td><td>'+passR(d).toFixed(1)+'٪</td><td>'+(mastery(d)-mastery(p)>=0?'▲':'▼')+Math.abs(mastery(d)-mastery(p)).toFixed(1)+'</td></tr>';}).join('');
    return {h:'<table><tr><th>المادة</th><th>أ</th><th>ب</th><th>ج</th><th>د</th><th>هـ</th><th>الإتقان</th><th>النجاح</th><th>التغير</th></tr>'+rows+'</table>',m:mastery(agg(t,0))};}
  function dec(){var rows=[];DA.list('meet').forEach(function(m){(m.dec||[]).forEach(function(d){rows.push('<tr><td>'+esc(d.txt)+'</td><td>'+esc(m.title)+'</td><td>'+esc(d.who||'')+'</td><td>'+esc(A.short(d.due))+'</td><td>'+DST[decSt(d)][0]+'</td></tr>');});});return {h:'<table><tr><th>القرار</th><th>الاجتماع</th><th>المسؤول</th><th>الموعد</th><th>الحالة</th></tr>'+rows.join('')+'</table>'};}
  function plan(){return {h:DA.list('goal').map(function(g){var a=g.acts||[];return '<h3>'+esc(g.title)+' <small>('+esc(g.dom)+' · '+A.pct(a.filter(function(x){return x.done;}).length,a.length)+'٪)</small></h3><table><tr><th>المبادرة</th><th>المسؤول</th><th>الموعد</th><th>الحالة</th></tr>'+a.map(function(x){return '<tr><td>'+esc(x.txt)+'</td><td>'+esc(x.who||'')+'</td><td>'+esc(x.when||'')+'</td><td>'+(x.done?'منجزة':'قيد التنفيذ')+'</td></tr>';}).join('')+'</table>';}).join('')};}
  if(k==='tatt')b=tatt().h;else if(k==='satt')b=satt().h;else if(k==='subs')b=subs().h;else if(k==='vis')b=vis().h;else if(k==='res')b=res().h;else if(k==='dec')b=dec().h;else if(k==='plan')b=plan().h;
  else{var ta=tatt(),sa=satt(),su=subs(),vi=vis(),re=res(),G=DA.list('goal'),all=0,dn=0;G.forEach(function(g){(g.acts||[]).forEach(function(a){all++;if(a.done)dn++;});});
    b='<div class="kp"><div><b>'+ta.p+'٪</b>حضور المعلمات</div><div><b>'+sa.p.toFixed(1)+'٪</b>حضور الطلبة</div><div><b>'+su.n+'</b>حصة احتياط مغطاة</div><div><b>'+vi.n+'</b>زيارة صفية</div><div><b>'+re.m.toFixed(1)+'٪</b>إتقان (أ+ب)</div><div><b>'+A.pct(dn,all)+'٪</b>إنجاز الخطة</div><div><b>'+DA.list('ach').length+'</b>إنجازًا موثقًا</div><div><b>'+DA.list('meet').length+'</b>اجتماعًا</div></div>'+
     '<h3>أبرز الإنجازات</h3><ul>'+DA.list('ach').slice(-5).map(function(a){return '<li>'+esc(a.title)+'</li>';}).join('')+'</ul><h3>التحصيل حسب المادة</h3>'+re.h+'<h3>حضور الطلبة حسب الشعبة</h3>'+sa.h.split('<h3>')[0];}
  var h='<div class="row mb no-print"><a class="btn ghost" href="#/reports">'+ic('right')+' كل التقارير</a><span class="sp"></span><button class="btn gold" data-p>'+ic('print')+' طباعة / حفظ PDF</button></div>'+
   '<div class="paper" id="rp">'+phead(r[1])+'<p style="color:#5E7079;margin-top:-6px">الفترة: آخر 20 يومًا دراسيًا حتى '+esc(A.fmt(A.workday()))+'</p>'+b+'<div class="sig"><span>إعداد: المساعدة · '+esc(S.deputy)+'</span><span>اعتماد مديرة المدرسة: '+esc(S.principal)+'</span></div><div class="wm2">نسخة عرض من منصة دفّة · جميع البيانات وهمية</div></div>';
  on('[data-p]','click',function(){window.print();});
  return h;}

/* =================== الإعدادات =================== */
P.settings=function(){var S=A.school(),mute=DA.lsg('mute',false);
  var h=A.banner('settings','بيانات المدرسة والمظهر والنسخة الاحتياطية');
  h+='<div class="cols"><div class="stack"><div class="card"><div class="ctitle"><span class="ic2">'+ic('home')+'</span><h3>بيانات المدرسة</h3><span class="sp"></span><button class="btn ghost sm" data-school>'+ic('edit')+' تعديل</button></div>'+
   [['الاسم',S.name],['الشعار اللفظي',S.motto],['المديرة',S.principal],['المساعدة',S.deputy],['المرحلة',S.cycle],['الموقع',S.place],['الرؤية',S.vision],['الرسالة',S.mission]].map(function(x){return '<div class="set-row"><div class="tx"><small>'+x[0]+'</small><b style="font-weight:700">'+esc(x[1])+'</b></div></div>';}).join('')+'</div></div>'+
   '<div class="stack"><div class="card"><div class="ctitle"><span class="ic2">'+ic('pal')+'</span><h3>المظهر</h3></div>'+
   '<div class="set-row"><div class="tx"><b>الثيمات</b><small>'+DA.SKINS.length+' ثيمات بخلفيات حيّة وأصوات خاصة</small></div><button class="btn sm" data-act="studio">اختيار</button></div>'+
   '<div class="set-row"><div class="tx"><b>الوضع الليلي</b><small>يبدّل بين النهاري والليلي للثيم</small></div><button class="switch" role="switch" aria-checked="'+(document.documentElement.getAttribute('data-mode')==='dark')+'" data-act="mode"></button></div>'+
   '<div class="set-row"><div class="tx"><b>أصوات اللمس</b><small>نقرات طبيعية هادئة</small></div><button class="switch" role="switch" aria-checked="'+(!mute)+'" data-mute></button></div>'+
   '<div class="set-row"><div class="tx"><b>تثبيت المنصة</b><small>كتطبيق على الجوال أو الحاسوب، وتعمل دون إنترنت</small></div><button class="btn gold sm" data-act="install">'+ic('dl')+' تثبيت</button></div></div>'+
   '<div class="card"><div class="ctitle"><span class="ic2">'+ic('folder')+'</span><h3>البيانات</h3></div>'+
   '<div class="set-row"><div class="tx"><b>نسخة احتياطية</b><small>تنزيل كل بيانات المنصة في ملف</small></div><button class="btn ghost sm" data-exp>'+ic('dl')+' تنزيل</button></div>'+
   '<div class="set-row"><div class="tx"><b>استعادة نسخة</b><small>من ملف نسخة احتياطية سابق</small></div><button class="btn ghost sm" data-imp>'+ic('up')+' استعادة</button></div>'+
   '<div class="set-row"><div class="tx"><b>إعادة بيانات العرض</b><small>يمسح ما أضفتِه ويعيد المدرسة الوهمية كما كانت</small></div><button class="btn danger sm" data-reset>'+ic('refresh')+' إعادة</button></div></div>'+
   '<div class="card sale"><span class="ri">'+ic('spark')+'</span><div style="flex:1"><h3>منصة دفّة لمدرستكِ</h3><p class="muted" style="margin:4px 0 0">نسخة خاصة بشعار مدرستكِ وبياناتها الحقيقية، بمزامنة آمنة بين أجهزة الإدارة.</p></div><a class="btn gold" href="https://wa.me/96876506037" target="_blank" rel="noopener">'+ic('wa')+' 76506037</a></div></div></div>';
  on('[data-school]','click',function(){var c=DA.rec('school_cfg')||{id:'school_cfg',K:'cfg'};A.form({title:'بيانات المدرسة',data:A.school(),wide:1,fields:[{k:'name',label:'اسم المدرسة',req:1},{k:'short',label:'الاسم المختصر',half:'open'},{k:'motto',label:'الشعار اللفظي',half:'close'},{k:'principal',label:'المديرة',half:'open'},{k:'deputy',label:'المساعدة',half:'close'},{k:'cycle',label:'المرحلة',half:'open'},{k:'year',label:'العام الدراسي',half:'close'},{k:'place',label:'الموقع'},{k:'vision',label:'الرؤية',type:'textarea'},{k:'mission',label:'الرسالة',type:'textarea'}],
    onSave:function(v){DA.put(Object.assign(c,v));setTimeout(function(){location.reload();},300);DA.toast('حُفظت بيانات المدرسة');}});});
  on('[data-mute]','click',function(el){var m=!DA.lsg('mute',false);DA.lss('mute',m);el.setAttribute('aria-checked',String(!m));});
  on('[data-exp]','click',function(){var out=Object.keys(DA.R).map(function(k){return DA.R[k];}).filter(function(r){return !r.del;});var b=new Blob([JSON.stringify({app:'idara',v:1,at:new Date().toISOString(),recs:out})],{type:'application/json'});var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='دفة-نسخة-احتياطية-'+DA.today()+'.json';document.body.appendChild(a);a.click();a.remove();DA.toast('نُزّلت النسخة الاحتياطية');});
  on('[data-imp]','click',function(){DA.pick('application/json,.json').then(function(fs){if(!fs[0])return;fs[0].text().then(function(t){var j;try{j=JSON.parse(t);}catch(e){DA.toast('الملف غير صالح');return;}if(!j||j.app!=='idara'||!j.recs){DA.toast('هذا ليس ملف نسخة من دفّة');return;}
    DA.ask('ستُستبدل البيانات الحالية بمحتوى النسخة ('+j.recs.length+' سجلًا). متابعة؟',function(){DA.wipe().then(function(){return DA.bulk(j.recs);}).then(function(){DA.toast('استُعيدت النسخة');A.refresh();});},{ok:'استعادة'});});});});
  on('[data-reset]','click',function(){DA.ask('سيُمسح كل ما أضفتِه وتعود بيانات العرض كما كانت. متابعة؟',function(){A.reset();},{danger:1,ok:'إعادة البيانات'});});
  return h;};

/* =================== الأقسام المضافة =================== */
P._custom=function(a,k){var s=DA.rec(k),L=DA.list('ent',function(e){return e.sec===k;}).sort(function(x,y){return x.d<y.d?1:-1;});
  var h=A.banner(k,s.desc||'قسم مضاف','<button class="btn gold" data-add>'+ic('plus')+' إضافة عنصر</button><button class="btn ghost" data-es>'+ic('edit')+' القسم</button>');
  h+=L.length?'<div class="gal">'+L.map(function(e){return achCard(Object.assign({cat:'act'},e),s.title,'var('+A.custom(k)[3]+')','data-ee');}).join('')+'</div>':A.empty('القسم جاهز. أضيفي أول عنصر بصورة ووصف، ويظهر بالشكل نفسه لبقية المنصة.','folder');
  on('[data-add]','click',function(){entForm({sec:k});});
  on('[data-ee]','click',function(el){entForm(DA.rec(el.dataset.ee));});
  on('[data-view]','click',function(el){var e=DA.rec(el.dataset.view);if(e.img)DA.lightbox([{fid:e.img,cap:e.title}],0);else entForm(e);});
  on('[data-es]','click',function(){A.addSection(DA.rec(k));});
  return h;};
function entForm(e){A.form({title:e.id?'تعديل العنصر':'إضافة عنصر',data:Object.assign({d:DA.today()},e),fields:[{k:'title',label:'العنوان',req:1},{k:'d',label:'التاريخ',type:'date'},{k:'txt',label:'الوصف',type:'textarea'},{k:'img',label:'صورة',type:'img'}],
  del:e.id?function(){A.remove(e.id,'العنصر');}:null,onSave:function(v){DA.put(Object.assign({K:'ent'},e,v));DA.toast('حُفظ');}});}
})();
