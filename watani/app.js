/* =====================================================================
   «هذا وطني» · الهيكل، حالة المنصة، واجهة الطالبات، دخول المعلمات ولوحتهن
   ===================================================================== */
(function(){
'use strict';
var $=W.$,$$=W.$$,esc=W.esc,ar=W.ar,ic=W.ic,DB=window.WDB;
var G=W.G={site:{},comp:null,bank:null,rounds:[],subs:[],gal:[],ready:false,offs:[]};

/* ---------- الإعدادات الافتراضية للمسابقة ---------- */
W.defComp=function(){return {v:1,secs:W.SECS.map(function(s){return {id:s.id,nick:''};}),fmt:'g3',br:null,
  set:{pts:{1:1,2:2,3:3},t:{mc:30,tf:20,fl:30,sa:75},bonus:1,teachers:'معلمات الدراسات الاجتماعية',lead:'أ. عائشة الجبري',principal:'أ. عائشة الجبري',school:'مدرسة نسيبة بنت كعب (١١–١٢)',year:'٢٠٢٦ / ٢٠٢٧م',month:'نوفمبر ٢٠٢٦م'},honors:[],arena:{},used:{}};};
W.nick=function(id){var s=G.comp&&G.comp.secs.filter(function(x){return x.id===id;})[0];return s&&s.nick||'';};
W.principal=function(){return (G.site&&G.site.principal)||(G.comp&&G.comp.set&&G.comp.set.principal)||'أ. عائشة الجبري';};
W.set=function(){return (G.comp&&G.comp.set)||W.defComp().set;};
var ct=null,bt=null;
W.saveComp=function(now){clearTimeout(ct);var f=function(){DB.saveT('comp',G.comp).catch(function(e){W.toast('تعذّر الحفظ: '+(e&&e.message||''));});};if(now)f();else ct=setTimeout(f,350);};
W.saveBank=function(){clearTimeout(bt);bt=setTimeout(function(){DB.saveT('bank',G.bank).catch(function(e){W.toast('تعذّر حفظ البنك: '+(e&&e.message||''));});},300);};

/* ---------- التصحيح ---------- */
W.score=function(r,key,sub){var o={pts:0,max:0,ok:0,bad:0,pend:0,bonus:0,per:{}};if(!r||!sub)return o;var a=(key&&key.a)||{},ans=sub.ans||{},g=sub.g||{},tm=sub.tm||{};
  (r.qs||[]).forEach(function(q){o.max+=q.pts;var v=ans[q.id],res={got:0,ok:null};
    if(q.t==='sa'){if(g[q.id]!=null){res.got=+g[q.id];res.ok=res.got>=q.pts?true:(res.got>0?'half':false);}else if(v&&String(v).trim()){o.pend++;res.ok=null;}else res.ok=false;}
    else{var k=a[q.id];res.ok=v!=null&&v!==''&&String(v)===String(k);if(res.ok)res.got=q.pts;}
    if(res.ok===true)o.ok++;else if(res.ok===false)o.bad++;
    if(r.kind==='speed'&&res.ok===true&&tm[q.id]!=null&&tm[q.id]<=r.t/2){res.got+=1;o.bonus+=1;}
    o.pts+=res.got;o.per[q.id]=res;});
  o.p=W.pct(Math.min(o.pts,o.max),o.max);return o;};

/* ---------- الهيكل ---------- */
var app=$('#app');
var TNAV=[['','الرئيسية','home'],['rounds','الجولات','play'],['results','النتائج والإحصاءات','chart'],['bracket','التصفيات','tree'],['arena','ساحة العرض','screen'],['live','المنافسة المباشرة','bolt'],['bank','بنك الأسئلة','book'],null,['honor','لوحة الشرف','trophy'],['certs','الشهادات','award'],['settings','الإعدادات','gear']];
W.shell=function(kind,cur){var t=kind==='t';
  var top='<header class="top"><img class="emb" src="img/emblem.webp" alt=""><div class="ttl"><b>هٰذَا وَطَنِي</b><small>'+(t?'لوحة المعلمات · ':'')+'المسابقة المنهجية · الصف الحادي عشر</small></div>'+
   '<div class="prin"><img src="img/school.webp" alt="شعار مدرسة نسيبة بنت كعب (١١–١٢)"><span><small>مديرة المدرسة</small><b>'+esc(W.principal())+'</b></span></div>'+
   '<button class="tbtn inst" type="button">'+ic('dl')+'<span class="lb">تثبيت</span></button>'+
   '<button class="tbtn skb" type="button" aria-label="الألوان">'+ic('pal')+'<span class="lb">الألوان</span></button>'+
   (t?'<button class="tbtn lo" type="button" aria-label="خروج">'+ic('out')+'<span class="lb">خروج</span></button>':'<a class="tbtn" href="#/t">'+ic('lock')+'<span class="lb">المعلمات</span></a>')+'</header>';
  var nav=t?'<nav class="nav" aria-label="أقسام لوحة المعلمات">'+TNAV.map(function(n){return n?'<a href="#/t/'+n[0]+'" class="'+(cur===n[0]?'on':'')+'">'+ic(n[2])+n[1]+'</a>':'<hr>';}).join('')+'<hr><a href="#/">'+ic('users')+'صفحة الطالبات</a></nav>':'';
  var tabs=t?'<nav class="tabs" aria-label="تنقل سريع">'+[['','الرئيسية','home'],['rounds','الجولات','play'],['results','النتائج','chart'],['bracket','التصفيات','tree']].map(function(n){return '<a href="#/t/'+n[0]+'" class="'+(cur===n[0]?'on':'')+'">'+ic(n[2])+n[1]+'</a>';}).join('')+'<button type="button" class="more">'+ic('menu')+'المزيد</button></nav><div class="scrim"></div>':'';
  app.innerHTML=W.fxHTML()+top+'<div class="shell'+(t?'':' solo')+'">'+nav+'<main class="main" id="main"></main></div>'+tabs+(t?'<button class="fab" type="button">'+ic('plus')+'أضيفي</button>':'');
  $('.inst').onclick=W.install;$('.skb').onclick=W.skinPicker;
  if(t){$('.lo').onclick=function(){W.ask('الخروج من لوحة المعلمات على هذا الجهاز؟',function(){stopTeacher();DB.logout().then(function(){W.go('#/');});},{ok:'خروج'});};
   $('.tabs .more').onclick=function(){document.body.classList.add('nav-open');};$('.scrim').onclick=function(){document.body.classList.remove('nav-open');};
   $('.fab').onclick=W.addMenu;}
  W.applySkin();return $('#main');};
W.view=function(main,html){main.innerHTML='<div class="view">'+html+'</div>';W.animIn(main);window.scrollTo(0,0);return main.firstChild;};
W.addMenu=function(){var d=W.dlg('<h2>ماذا تضيفين؟</h2><div class="grid g2" style="gap:10px">'+
  [['q','سؤالًا إلى البنك','book'],['r','جولة جديدة للطالبات','play'],['g','صورة إلى معرض المسابقة','img'],['h','طالبة متميزة إلى لوحة الشرف','star']].map(function(x){return '<button class="btn" style="min-height:64px;justify-content:flex-start" data-a="'+x[0]+'">'+ic(x[2])+x[1]+'</button>';}).join('')+'</div>');
  $$('[data-a]',d).forEach(function(b){b.onclick=function(){d.close();var a=b.dataset.a;if(a==='q')W.editQ(null);else if(a==='r')W.newRound();else if(a==='g')W.addPhoto();else W.addHonor();};});};

/* ---------- تشغيل حالة المعلمات ---------- */
function stopTeacher(){G.offs.forEach(function(f){try{f();}catch(e){}});G.offs=[];G.ready=false;G.comp=null;G.bank=null;}
var waiters=[];
W.whenReady=function(cb){if(G.ready)cb();else waiters.push(cb);};
/* الأسئلة الأصلية بإجاباتها محفوظة في قاعدة البيانات للمعلمات فقط، لا في ملفات الموقع العامة */
W.defBank=function(){if(window.BANK)return Promise.resolve(window.BANK);
  return DB.getT('defbank').then(function(d){window.BANK=(d&&d.items)||[];return window.BANK;},function(){return [];});};
function startTeacher(){if(G.offs.length)return;var got={};
  function check(){if(got.comp&&got.bank&&!G.ready){G.ready=true;var w=waiters;waiters=[];w.forEach(function(f){f();});}}
  var err=function(e){console.warn(e);W.toast('تعذّر الاتصال بقاعدة البيانات');};
  G.offs.push(DB.watchT('comp',function(c){if(!c){c=W.defComp();G.comp=c;W.saveComp(true);}else{var d=W.defComp();Object.keys(d).forEach(function(k){if(c[k]==null)c[k]=d[k];});Object.keys(d.set).forEach(function(k){if(c.set[k]==null)c.set[k]=d.set[k];});G.comp=c;}
    if(!G.comp.br)G.comp.br=W.buildBracket(G.comp.fmt,W.SECS.map(function(s){return s.id;}));got.comp=1;check();if(G.ready&&W.onData)W.onData('comp');},err));
  G.offs.push(DB.watchT('bank',function(b){
    function done(){got.bank=1;check();if(G.ready&&W.onData)W.onData('bank');}
    if(b&&b.items&&(b.v||0)>=window.BANK_V){G.bank=b;done();return;}
    W.defBank().then(function(def){
      if(!b||!b.items){b={v:window.BANK_V,items:W.clone(def)};}
      else{var have={};b.items.concat(b.del||[]).forEach(function(q){have[q.id||q]=1;});def.forEach(function(q){if(!have[q.id])b.items.push(W.clone(q));});b.v=window.BANK_V;}
      G.bank=b;if(def.length)W.saveBank();done();});},err));
  G.offs.push(DB.watchRounds(function(a){G.liveRaw=a.filter(W.isLive);G.rounds=a.filter(function(r){return !W.isLive(r);});if(W.onData)W.onData('rounds');},err));
  G.offs.push(DB.watchSubs(null,function(a){G.subs=a.filter(function(x){return String(x.rid||'').indexOf('lv')!==0;});if(W.onData)W.onData('subs');},err));
  G.offs.push(DB.watchGal(function(a){G.gal=a;if(W.onData)W.onData('gal');},function(){}));}
W.keys={};
W.getKey=function(rid){if(W.keys[rid])return Promise.resolve(W.keys[rid]);return DB.key(rid).then(function(k){W.keys[rid]=k||{a:{}};return W.keys[rid];});};

/* صفحة المعلمات تتطلب الدخول */
W.tviews={};
W.routes.t=function(p){DB.ready().then(function(){if(!DB.isTeacher()){login();return;}startTeacher();
  var name=p[0]||'',fn=W.tviews[name]||W.tviews[''];var main=W.shell('t',name);
  main.innerHTML='<div class="card empty">جارٍ تحميل بيانات المسابقة…</div>';
  W.whenReady(function(){if(!$('#main'))return;W.onData=null;fn(main,p.slice(1));});});};

/* ---------- دخول المعلمات ---------- */
function login(){var main=W.shell('s');W.view(main,'<section class="card corner" style="max-width:520px;margin:30px auto;width:100%"><div style="text-align:center"><img src="img/emblem.webp" alt="" style="width:72px"><h2 style="margin-top:6px">دخول المعلمات</h2><p class="muted">لوحة إدارة المسابقة: الجولات والأسئلة والنتائج والتصفيات.</p></div>'+
  '<form class="form" id="lf"><label class="f">كلمة السر<input class="inp" type="password" id="pw" autocomplete="current-password" required minlength="6"></label><p class="muted" id="lm" style="margin:0;min-height:1.4em"></p><button class="btn pri lg" type="submit">'+ic('lock')+'دخول</button><button class="btn ghost" type="button" id="first">أول مرة؟ إنشاء كلمة السر</button><a class="btn ghost" href="#/">العودة إلى صفحة الطالبات</a></form></section>');
  var f=$('#lf'),msg=$('#lm');
  f.onsubmit=function(e){e.preventDefault();msg.textContent='جارٍ الدخول…';DB.login($('#pw').value).then(function(){W.toast('أهلًا بكِ');W.route();}).catch(function(x){var c=x&&x.message;msg.textContent=c==='wrong'?'كلمة السر غير صحيحة.':(c==='no-account'?'لم تُنشأ كلمة سر بعد. اضغطي «أول مرة».':(c==='many'?'محاولات كثيرة، انتظري قليلًا ثم أعيدي المحاولة.':'تعذّر الدخول، تحققي من الاتصال بالإنترنت.'));});};
  $('#first').onclick=function(){var pw=$('#pw').value;if(pw.length<6){msg.textContent='اكتبي كلمة سر من ٦ خانات على الأقل ثم اضغطي «أول مرة».';return;}
    DB.signup(pw).then(function(){W.toast('أُنشئت كلمة السر، احفظيها');W.route();}).catch(function(x){msg.textContent=x&&x.message==='exists'?'كلمة السر منشأة مسبقًا، استعمليها للدخول.':'تعذّر الإنشاء، تحققي من الاتصال.';});};}

/* =====================================================================
   واجهة الطالبات
   ===================================================================== */
var KIND={stage:['تَصْفِيَاتُ الشُّعَب','مواجهة بين الشعب ضمن مراحل التصفيات','tree'],solo:['الْمُسَابَقَةُ الْفَرْدِيَّة','تتنافس فيها كل طالبة باسمها','user'],speed:['تَحَدِّي السُّرْعَة','وقت أقصر، ونقطة إضافية لكل إجابة صحيحة سريعة','bolt'],train:['جَوْلَةٌ تَدْرِيبِيَّة','للمراجعة: تظهر الإجابة الصحيحة بعد كل سؤال ولا تُحتسب','book']};
W.KIND=KIND;
W.isLive=function(r){return !!r&&(r.kind==='livectl'||r.kind==='liveq');};
/* الدخول بالشعبة فقط بلا اسم: يُسجَّل التسليم باسم «شعبة ١١/س» */
function me(){var m=W.lsg('me',null);return m&&m.sec?{sec:m.sec,name:'شعبة '+W.secName(m.sec)}:null;}
W.me=me;
W.studentURL=function(){return location.href.split('#')[0];};
W.routes['']=function(){var main=W.shell('s','');DB.ready();var m=me();
  var hero='<section class="card hero corner"><div class="txt"><img class="schoollogo" src="img/school.webp" alt="شعار مدرسة نسيبة بنت كعب (١١–١٢)"><span class="kick"><img src="img/emblem.webp" alt="">وزارة التعليم · '+esc(G.site.school||'مدرسة نسيبة بنت كعب (١١–١٢)')+'</span><span class="sub">مُسَابَقَةٌ مَنْهَجِيَّةٌ</span><h1>هٰذَا وَطَنِي</h1><span class="slogan">مَعًا .. نَعْرِفُ وَطَنَنَا وَنَعْتَزُّ بِهِ</span><div class="meta"><span>الصف الحادي عشر (١١/١ – ١١/١٢)</span><span>الدرسان الأول والثاني · الفصل الأول</span><span>'+esc(G.site.year||'٢٠٢٦ / ٢٠٢٧م')+'</span></div></div><div class="art"><img class="fort" src="img/fort.webp" alt="قلعة عُمانية بين النخيل"><span class="stripe"></span></div></section>';
  var v=W.view(main,hero+'<div id="board"></div><section class="card corner" id="who"></section><div id="rl"></div>'+W.crenel()+'<p class="muted" style="text-align:center;margin:0">بادري بالمشاركة .. وكوني من المتميزات</p><footer class="schoolfoot"><img src="img/school.webp" alt="شعار مدرسة نسيبة بنت كعب (١١–١٢)"><small>مديرة المدرسة '+esc(W.principal())+' · معلمات الدراسات الاجتماعية</small></footer>');
  drawWho();
  var offs=[];W.cleanup=function(){offs.forEach(function(f){f();});};
  offs.push(DB.watchSite(function(s){G.site=s||{};drawBoard();}));
  offs.push(DB.watchOpen(function(rs){G.open=rs;drawRounds();},function(){$('#rl').innerHTML='<div class="card empty">تعذّر الاتصال بالإنترنت لعرض الجولات المفتوحة.</div>';}));
  function drawWho(){var m=me(),el=$('#who');if(!el)return;
    if(m){el.innerHTML='<div class="row" style="justify-content:space-between"><div class="row"><span class="badge">'+esc(W.secName(m.sec).replace('١١/',''))+'</span><div><b class="kufi" style="font-size:22px;color:var(--hd)">شُعْبَةُ '+esc(W.secName(m.sec))+'</b><div class="muted">تتنافسين باسم شعبتك</div></div></div><button class="btn sm ghost" id="chg">'+ic('edit')+'تغيير الشعبة</button></div>';$('#chg').onclick=function(){W.lss('me',null);drawWho();drawRounds();};return;}
    el.innerHTML='<h2>اخْتَارِي شُعْبَتَكِ لِلدُّخُول</h2><p class="muted" style="margin-top:0">تتنافسين باسم شعبتك دون كتابة اسم. اضغطي على شعبتك فتظهر لك الجولات والمنافسة المباشرة.</p>'+
     '<div class="secpick" role="group" aria-label="الشعب">'+W.SECS.map(function(s){return '<button type="button" data-s="'+s.id+'">'+s.name+'</button>';}).join('')+'</div>';
    $$('.secpick button',el).forEach(function(b){b.onclick=function(){W.lss('me',{sec:b.dataset.s});W.snd('ok');drawWho();drawRounds();};});}
  function drawBoard(){var b=G.site.board,el=$('#board');if(!el)return;if(!b||!b.show){el.innerHTML='';return;}
    el.innerHTML='<section class="card corner" style="text-align:center"><h2>'+ic('trophy').replace('<svg','<svg style="width:22px;height:22px;vertical-align:-4px"')+' لَوْحَةُ الشَّرَف</h2>'+(b.note?'<p class="muted" style="margin:0">'+esc(b.note)+'</p>':'')+podium(b.top||[])+'</section>';}
  function drawRounds(){var el=$('#rl'),m=me();if(!el)return;var rs=(G.open||[]).filter(function(r){return !W.isLive(r)&&(!m||(r.secs||[]).indexOf(m.sec)>=0);});
    if(!m){el.innerHTML='';return;}
    var lv=(G.open||[]).filter(function(r){return r.kind==='livectl'&&r.st!=='end'&&(r.secs||[]).indexOf(m.sec)>=0;})[0];
    if(lv){var ak='watani:lvauto:'+lv.id+':'+m.sec,seen=false;try{seen=!!sessionStorage.getItem(ak);sessionStorage.setItem(ak,'1');}catch(e){}if(!seen){W.go('#/live/'+lv.id);return;}}
    var lvh=lv?'<a class="card corner livecard" href="#/live/'+lv.id+'"><span class="pulse"></span><div style="flex:1"><b class="kufi">المنافسة المباشرة جارية الآن</b><div class="muted">الأسئلة تظهر على جهازك، والنقاط على شاشة الصف</div></div><span class="btn pri">'+ic('bolt')+'ادخلي</span></a>':'';
    if(!rs.length){el.innerHTML=lvh+(lv?'':'<div class="card empty"><img src="img/trophy.webp" alt="" style="mix-blend-mode:multiply;border-radius:50%"><p>لا توجد جولة مفتوحة لشعبتك الآن.<br>ستظهر هنا فور أن تفتحها المعلمة، دون تحديث الصفحة.</p></div>');return;}
    el.innerHTML=lvh+'<div class="grid g2">'+rs.map(function(r){var k=KIND[r.kind]||KIND.solo;return '<article class="card corner" data-r="'+r.id+'"><span class="tag">'+k[0]+'</span><h2 style="margin-top:8px">'+esc(r.name)+'</h2><p class="muted" style="margin:0 0 10px">'+ar(r.qs.length)+' سؤالًا · '+ar(r.t)+' ثانية لكل سؤال</p><div class="row"><a class="btn pri" href="#/play/'+r.id+'">'+ic('play')+'ابدئي</a><span class="muted st"></span></div></article>';}).join('')+'</div>';
    rs.forEach(function(r){DB.mySub(r.id).then(function(s){if(!s)return;var c=$('[data-r="'+r.id+'"]');if(!c)return;$('.btn',c).innerHTML=ic('check')+'نتيجتي';$('.btn',c).className='btn grn';$('.st',c).textContent='سلّمتِ إجاباتك ✓';}).catch(function(){});});}
};
function podium(top){var cls=['p2','p1','p3'],ord=[1,0,2];return '<div class="podium">'+ord.map(function(i){var s=top[i];if(!s)return '';return '<div class="pod '+cls[ord.indexOf(i)]+'">'+(i===0?'<img src="img/trophy.webp" alt="" style="mix-blend-mode:multiply;border-radius:50%">':'')+'<span class="nm">'+esc(W.secName(s))+'</span><div class="blk">'+ar(i+1)+'</div></div>';}).join('')+'</div>';}
W.podium=podium;

/* ---------- الإجابة عن الجولة ---------- */
W.routes.play=function(p){var rid=p[0],main=W.shell('s','');var m=me();
  if(!m){W.go('#/');W.toast('اختاري شعبتك أولًا');return;}
  main.innerHTML='<div class="card empty">جارٍ تحميل الجولة…</div>';
  Promise.all([DB.round(rid),DB.mySub(rid).catch(function(){return null;})]).then(function(x){var r=x[0],s=x[1];
    if(!r){W.view(main,'<div class="card empty">هذه الجولة غير موجودة.<br><a class="btn" href="#/">العودة</a></div>');return;}
    if(s){result(main,r,s);return;}
    if(!r.open){W.view(main,'<div class="card empty">أُغلقت هذه الجولة.<br><a class="btn" href="#/">العودة</a></div>');return;}
    if((r.secs||[]).indexOf(m.sec)<0){W.view(main,'<div class="card empty">هذه الجولة ليست لشعبتك.<br><a class="btn" href="#/">العودة</a></div>');return;}
    intro(main,r);}).catch(function(){W.view(main,'<div class="card empty">تعذّر الاتصال. تحققي من الإنترنت ثم أعيدي المحاولة.<br><a class="btn" href="#/">العودة</a></div>');});};
function intro(main,r){var m=me(),k=KIND[r.kind]||KIND.solo,cnt={};r.qs.forEach(function(q){cnt[q.lv]=(cnt[q.lv]||0)+1;});
  var v=W.view(main,'<section class="card corner" style="text-align:center;max-width:720px;margin:0 auto;width:100%"><span class="tag">'+k[0]+'</span><h1 class="kufi" style="color:var(--hd);margin:8px 0 2px;font-size:32px">'+esc(r.name)+'</h1><p class="muted">'+k[1]+'</p>'+W.crenel()+
   '<div class="grid g4" style="margin:14px 0"><div class="stat"><b>'+ar(r.qs.length)+'</b><span>سؤالًا</span></div><div class="stat"><b>'+ar(r.t)+'</b><span>ثانية لكل سؤال</span></div>'+[1,2,3].filter(function(l){return cnt[l];}).map(function(l){return '<div class="stat"><b>'+ar(cnt[l])+'</b><span>'+W.LVp[l]+'</span></div>';}).join('')+'</div>'+
   '<p>المتسابقة: <b>شعبة '+esc(W.secName(m.sec))+'</b></p><p class="muted">ينتقل السؤال تلقائيًا عند انتهاء وقته. تُسلَّم الإجابات مرة واحدة فقط.</p><button class="btn pri lg" id="go">'+ic('play')+'بِسْمِ اللهِ، ابدئي</button></section>');
  $('#go').onclick=function(){quiz(main,r);};}
function quiz(main,r){var m=me(),pk='prog:'+r.id,st=W.lsg(pk,null);
  if(!st||st.n!==r.qs.length){var order=r.qs.map(function(q,i){return i;});if(r.shuffle)order=W.shuffle(order);st={n:r.qs.length,order:order,i:0,ans:{},tm:{},t0:Date.now()};}
  var timer=null,left=0,qStart=0;W.cleanup=function(){clearInterval(timer);};document.body.classList.add('stage-mode');
  function save(){W.lss(pk,st);}
  function show(){clearInterval(timer);if(st.i>=st.n){finish();return;}save();var q=r.qs[st.order[st.i]],qt=r.t,picked=st.ans[q.id];left=qt;qStart=Date.now();
    var body='';if(q.t==='mc'||q.t==='fl')body='<div class="opts">'+q.o.map(function(o,i){return '<button class="opt" type="button" data-v="'+i+'" style="cursor:pointer"><span class="l">'+W.KEYS[i]+'</span><span>'+esc(o)+'</span></button>';}).join('')+'</div>';
    else if(q.t==='tf')body='<div class="opts"><button class="opt" type="button" data-v="true" style="cursor:pointer"><span class="l">✓</span><span>صواب</span></button><button class="opt" type="button" data-v="false" style="cursor:pointer"><span class="l">✗</span><span>خطأ</span></button></div>';
    else body='<textarea class="inp naskh" id="sa" rows="4" placeholder="اكتبي إجابتك هنا…"></textarea>';
    var v=W.view(main,'<div class="arena-top"><div><div class="st">'+esc(r.name)+'</div><div class="muted">شعبة '+esc(W.secName(m.sec))+'</div></div><div class="dots">'+st.order.map(function(x,i){return '<i class="'+(i<st.i?'d':(i===st.i?'c':''))+'"></i>';}).join('')+'</div>'+tmr(qt)+'</div>'+
      '<section class="card qbox corner"><div class="qmeta"><span class="tag">السؤال '+ar(st.i+1)+' من '+ar(st.n)+'</span><span class="tag l'+q.lv+'">'+W.LVp[q.lv]+'</span><span class="tag">'+W.TY[q.t]+'</span><span class="tag">'+ar(q.pts)+' '+(q.pts===1?'نقطة':'نقاط')+'</span></div>'+(q.img?'<img class="qimg" src="'+q.img+'" alt="">':'')+
      '<p class="qtext">'+esc(q.q).replace(/_{2,}/g,'<span style="display:inline-block;min-width:80px;border-bottom:2px dashed var(--gold)"></span>')+'</p>'+body+'<div id="fbk"></div><div class="row" style="justify-content:space-between"><span class="muted" id="hint"></span><button class="btn grn lg" id="nx">'+(st.i===st.n-1?ic('check')+'تسليم الإجابات':'التالي ←')+'</button></div></section>');
    var choose=function(val){st.ans[q.id]=val;$$('.opt',v).forEach(function(b){b.classList.toggle('ok',b.dataset.v===String(val));});save();W.snd('tick');
      if(r.kind==='train'&&q.k!=null&&q.t!=='sa'){var good=String(val)===String(q.k);$$('.opt',v).forEach(function(b){b.disabled=true;b.classList.remove('ok');if(b.dataset.v===String(q.k))b.classList.add('ok');else if(b.dataset.v===String(val))b.classList.add('dim');});
        $('#fbk').innerHTML='<div class="answer"><small>'+(good?'أحسنتِ! إجابة صحيحة':'الإجابة الصحيحة مظلّلة بالأخضر')+'</small></div>';clearInterval(timer);}};
    $$('.opt',v).forEach(function(b){b.onclick=function(){if(b.disabled)return;var x=b.dataset.v;choose(q.t==='tf'?x==='true':+x);};});
    if(picked!=null&&q.t!=='sa')$$('.opt',v).forEach(function(b){b.classList.toggle('ok',b.dataset.v===String(picked));});
    var sa=$('#sa');if(sa){sa.value=picked||'';sa.oninput=function(){st.ans[q.id]=sa.value;save();};if(r.kind==='train'&&q.k)sa.insertAdjacentHTML('afterend','<button class="btn sm ghost" id="shk" type="button">'+ic('eye')+'أظهري الإجابة النموذجية</button>');var shk=$('#shk');if(shk)shk.onclick=function(){$('#fbk').innerHTML='<div class="answer"><small>الإجابة النموذجية</small>'+esc(q.k)+'</div>';shk.remove();};setTimeout(function(){sa.focus();},100);}
    var next=function(){st.tm[q.id]=Math.min(qt,Math.round((Date.now()-qStart)/1000));if(st.ans[q.id]==null)st.ans[q.id]=null;st.i++;save();show();};
    $('#nx').onclick=function(){if(st.i===st.n-1){var miss=st.order.filter(function(ix){var a=st.ans[r.qs[ix].id];return a==null||a==='';}).length;if(miss&&st.ans[q.id]==null)miss--;
        if(miss>0||st.ans[q.id]==null){W.ask('لم تُجيبي عن '+ar(miss+(st.ans[q.id]==null?1:0))+' من الأسئلة. هل تسلّمين الآن؟',next,{ok:'تسليم'});return;}}next();};
    timer=setInterval(function(){left--;setT(left,qt);if(left<=5&&left>0)W.snd('tick');if(left<=0){clearInterval(timer);W.snd('end');$('#hint').textContent='انتهى الوقت';setTimeout(next,700);}},1000);setT(left,qt);}
  function finish(){clearInterval(timer);W.view(main,'<div class="card empty">جارٍ تسليم إجاباتك…</div>');
    var ans={};r.qs.forEach(function(q){var a=st.ans[q.id];ans[q.id]=a==null?null:(q.t==='sa'?String(a).slice(0,1500):a);});
    DB.submit(r.id,{name:m.name,sec:m.sec,ans:ans,tm:st.tm,dur:Math.round((Date.now()-st.t0)/1000)}).then(function(s){W.lss(pk,null);document.body.classList.remove('stage-mode');W.confetti(2600);result(main,r,s);})
     .catch(function(e){var c=e&&e.message;if(c==='dup'){W.lss(pk,null);DB.mySub(r.id).then(function(s){result(main,r,s);});return;}
       W.view(main,'<div class="card empty">'+(c==='closed'?'أُغلقت الجولة قبل التسليم، أخبري معلمتك.':'تعذّر التسليم. تحققي من الإنترنت ثم اضغطي «إعادة المحاولة»؛ إجاباتك محفوظة على جهازك.')+'<br><button class="btn pri" id="re">إعادة المحاولة</button> <a class="btn" href="#/">العودة</a></div>');var re=$('#re');if(re)re.onclick=finish;});}
  show();}
function tmr(t){return '<div class="timer" id="tm"><svg viewBox="0 0 100 100"><circle class="bgc" cx="50" cy="50" r="42"/><circle class="fg" cx="50" cy="50" r="42" stroke-dasharray="263.9" stroke-dashoffset="0"/></svg><b>'+ar(t)+'</b></div>';}
function setT(l,t){var e=$('#tm');if(!e)return;$('b',e).textContent=ar(Math.max(0,l));$('.fg',e).style.strokeDashoffset=263.9*(1-Math.max(0,l)/t);e.classList.toggle('warn',l<=5);}
W.tmr=tmr;W.setT=setT;
function result(main,r,s){document.body.classList.remove('stage-mode');var m=me()||{name:s.name,sec:s.sec};
  W.view(main,'<div class="card empty">جارٍ عرض نتيجتك…</div>');
  var off=DB.watchMySub(r.id,function(ss){if(ss)s=ss;DB.key(r.id).then(function(k){draw(k||{a:{}});}).catch(function(){draw(null);});});W.cleanup=off;
  function draw(k){var sc=W.score(r,k,s);var p=sc.p;
    var v=W.view(main,'<section class="card corner" style="text-align:center"><img src="img/trophy.webp" alt="" style="width:120px;mix-blend-mode:multiply;border-radius:50%"><h1 class="kufi" style="color:var(--hd);margin:4px 0;font-size:30px">أَحْسَنْتِ يَا بَطَلَةَ الشُّعْبَةِ '+esc(W.secName(s.sec))+'</h1><p class="muted" style="margin:0">'+esc(r.name)+'</p>'+W.crenel()+
     (k?'<div class="grid g4" style="margin:12px 0"><div class="stat"><b>'+ar(sc.pts)+' / '+ar(sc.max)+'</b><span>النقاط</span></div><div class="stat"><b>'+ar(p)+'٪</b><span>النسبة</span><div class="bar"><i style="width:'+p+'%"></i></div></div><div class="stat"><b>'+ar(sc.ok)+'</b><span>إجابة صحيحة</span></div><div class="stat"><b>'+W.fmtT(s.dur)+'</b><span>الوقت</span></div></div>'+(sc.pend?'<p class="tag" style="font-size:14px">'+ar(sc.pend)+' من الإجابات القصيرة بانتظار تصحيح المعلمة، وتظهر هنا تلقائيًا.</p>':''):'<p>سُلّمت إجاباتك ✓</p>')+
     '<p class="naskh" style="font-size:20px;color:var(--hd);font-weight:700">مَعًا .. نَعْرِفُ وَطَنَنَا وَنَعْتَزُّ بِهِ</p><a class="btn" href="#/">العودة إلى الجولات</a></section>'+(k?review(r,k,s,sc):''));}}
function review(r,k,s,sc){return '<section class="card"><h2>مراجعة إجاباتك</h2><div class="grid" style="gap:10px">'+r.qs.map(function(q,i){var a=(s.ans||{})[q.id],res=sc.per[q.id]||{},kk=(k.a||{})[q.id];
  var mine=a==null||a===''?'لم تُجيبي':(q.t==='tf'?(a?'صواب':'خطأ'):(q.t==='sa'?a:q.o[a]));var right=q.t==='tf'?(kk?'صواب':'خطأ'):(q.t==='sa'?kk:(q.o||[])[kk]);
  var mark=res.ok===true?'<span class="tag l1">✓ صحيحة</span>':(res.ok==='half'?'<span class="tag l2">جزئية</span>':(res.ok===null?'<span class="tag">بانتظار التصحيح</span>':'<span class="tag l3">✗</span>'));
  return '<div class="qrow card" style="padding:12px 14px"><span class="badge '+(res.ok===true?'g':(res.ok===false?'':'o'))+'" style="width:40px;height:40px;font-size:16px">'+ar(i+1)+'</span><div class="qt"><div class="row">'+mark+'<span class="tag">'+ar(res.got||0)+' / '+ar(q.pts)+'</span></div><p>'+esc(q.q)+'</p><div class="muted">إجابتك: '+esc(mine)+'</div>'+(res.ok!==true&&right!=null?'<div class="an">'+(q.t==='sa'?'الإجابة النموذجية: ':'الصحيح: ')+esc(right)+'</div>':'')+'</div></div>';}).join('')+'</div></section>';}

/* ---------- الإقلاع ---------- */
W.applySkin();
document.body.insertAdjacentHTML('beforeend','<div id="print"></div>');
DB.watchSite(function(s){G.site=s||{};});
document.addEventListener('DOMContentLoaded',function(){W.splash(function(){W.route();});});
if('serviceWorker' in navigator&&location.protocol==='https:')navigator.serviceWorker.register('sw.js').catch(function(){});
})();
