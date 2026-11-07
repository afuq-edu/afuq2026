/* =====================================================================
   درسي · واجهة الطلاب (PF.portal): يدخل الطالب برمز من ٦ أرقام، فيرى واجباته
   التي أرسلتها المعلمة، ويحلها سؤالًا سؤالًا، فتصل نتيجته إلى المعلمة مباشرة.
   - لا أسماء في هذا الملف: الاسم الأول يُقرأ من السحابة بالرمز فقط.
   - كل جهاز يدخل بحساب تلقائي (بريد وكلمة سر عشوائيان محفوظان على الجهاز).
   ===================================================================== */
(function(){
'use strict';
var D=window.DARSI,TB=window.TB,I=TB.I,PF=window.PF,P=PF.portal,$=D.$,$$=D.$$,esc=D.esc,ar=D.ar,SND=D.SND;
var app=$('#app'),db,auth,me=null,stu=null,code=null,ns=P.ns,BASE=(document.currentScript&&document.currentScript.src||'').replace(/[^\/]*$/,'');
var LVN=['','الأول','الثاني','الثالث','الرابع'];
function screen(h){app.innerHTML='<div class="ds-stu pt">'+h+'</div>';window.scrollTo(0,0);}
function head(sub){return '<header class="pt-top"><span class="ds-logo">'+(PF.emoji||'🧮')+'</span><div><b>'+esc(PF.title||'واجباتي')+'</b><small>'+esc(sub||PF.teacher)+'</small></div>'+(stu?'<button class="btn ghost sm" id="ptOut">تبديل الطالب</button>':'')+'</header>';}
function wire(){var o=$('#ptOut');if(o)o.onclick=function(){if(!confirm('الخروج من حساب '+stu.n+'؟'))return;D.lsSet('pt:code:'+ns,'');stu=null;code=null;enter();};}
function wait(t){screen(head()+'<section class="ds-qcard pt-center"><div class="pt-spin"></div><p class="lead">'+esc(t||'لحظة…')+'</p></section>');}
function fail(t){screen(head()+'<section class="ds-qcard pt-center"><div style="font-size:64px">📶</div><h2 class="h">'+esc(t)+'</h2><button class="btn gold lg" id="ptRe">'+I.reset+'حاول مرة أخرى</button></section>');$('#ptRe').onclick=start;}

/* ---------- الاتصال والحساب التلقائي للجهاز ---------- */
function start(){if(!window.firebase)return fail('تعذّر التحميل، تأكد من الإنترنت');
  if(!db){try{var a=firebase.initializeApp(P.fb,'portal');auth=a.auth();db=a.firestore();if(P.emu){auth.useEmulator('http://127.0.0.1:9099');db.useEmulator('127.0.0.1',8080);}}catch(e){return fail('تعذّر التجهيز');}}
  wait('جارٍ الاتصال…');
  var k=D.lsGet('pt:dev',null);if(!k){k={e:'d'+Date.now().toString(36)+Math.random().toString(36).slice(2,8)+'@talib.darsi.ofuq.team',p:Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2)};D.lsSet('pt:dev',k);}
  (auth.currentUser?Promise.resolve():auth.signInWithEmailAndPassword(k.e,k.p).catch(function(e){if(/user-not-found|invalid-credential|invalid-login-credentials/.test(e&&e.code||''))return auth.createUserWithEmailAndPassword(k.e,k.p);throw e;}))
   .then(function(){me=auth.currentUser;enter();}).catch(function(){fail(navigator.onLine?'تعذّر الاتصال الآن':'لا يوجد اتصال بالإنترنت');});}
function enter(){var h=(location.hash.match(/c=(\d{6})/)||[])[1];if(h){D.lsSet('pt:code:'+ns,h);history.replaceState(null,'',location.pathname);}
  var c=h||D.lsGet('pt:code:'+ns,'');if(c)login(c,true);else pad();}
function login(c,silent){wait('جارٍ الدخول…');db.collection(ns+'_st').doc(c).get().then(function(d){if(!d.exists){D.lsSet('pt:code:'+ns,'');if(silent)return pad();return pad('الرمز غير صحيح، اسأل معلمتك عن رمزك');}
  stu=d.data();code=c;D.lsSet('pt:code:'+ns,c);home();}).catch(function(){fail('تعذّر الدخول الآن');});}

/* ---------- لوحة إدخال الرمز ---------- */
function pad(err){var v='';screen(head()+'<section class="ds-qcard pt-center"><div style="font-size:64px">🔑</div><h2 class="h">اكتب رمزك</h2><p class="note" style="margin:0">رمز من ٦ أرقام تعطيك إياه معلمتك</p>'+
  '<div class="pt-code" aria-live="polite">'+[0,1,2,3,4,5].map(function(){return '<i></i>';}).join('')+'</div>'+(err?'<p class="pt-err">'+esc(err)+'</p>':'')+
  '<div class="d-pad pt-pad">'+[1,2,3,4,5,6,7,8,9,'⌫',0,'✔'].map(function(k){return '<button data-k="'+k+'">'+(typeof k==='number'?ar(k):k)+'</button>';}).join('')+'</div></section>');
  var cells=$$('.pt-code i');function draw(){cells.forEach(function(c,i){c.textContent=v[i]?ar(v[i]):'';c.classList.toggle('on',i===v.length);});}draw();
  $$('.pt-pad button').forEach(function(b){b.onclick=function(){var k=b.dataset.k;SND.play('tap');if(k==='⌫')v=v.slice(0,-1);else if(k==='✔'){if(v.length===6)login(v);else TB.toast('الرمز ٦ أرقام');return;}else if(v.length<6)v+=k;draw();if(v.length===6)setTimeout(function(){login(v);},250);};});}

/* ---------- الواجبات ---------- */
function home(){wait('جارٍ تحميل واجباتك…');db.collection(ns+'_hw').where('to','array-contains',code).get().then(function(q){var hws=[];q.forEach(function(d){var x=d.data();x.id=d.id;if(typeof x.items==='string'){try{x.items=JSON.parse(x.items);}catch(e){x.items=[];}}hws.push(x);});
  hws.sort(function(a,b){return b.at-a.at;});
  return Promise.all(hws.map(function(h){return db.collection(ns+'_sub').doc(h.id+'_'+code).get().then(function(s){h.sub=s.exists?s.data():null;}).catch(function(){h.sub=null;});})).then(function(){return hws;});})
  .then(function(hws){var todo=hws.filter(function(h){return h.open&&!h.sub;}),done=hws.filter(function(h){return h.sub;}),stars=done.reduce(function(a,h){return a+starsOf(h.sub.sc,h.sub.mx);},0);
    screen(head(stu.c)+'<section class="ds-qcard pt-hello"><img class="pt-av" src="'+BASE+'img/'+(stu.sx==='g'?'girl':'boy')+'.webp" alt=""><div><h1>مرحبًا يا '+esc(stu.n)+' 👋</h1><p>'+(stu.lv?'المستوى '+LVN[stu.lv]+' · ':'')+'⭐ '+ar(stars)+' نجمة</p></div></section>'+
     (todo.length?'<h2 class="h pt-h">واجباتي الجديدة</h2>'+todo.map(card).join(''):'<section class="ds-qcard pt-center pt-empty"><div style="font-size:60px">🎉</div><h2 class="h">لا توجد واجبات جديدة</h2><p class="note">أحسنت! عُد لاحقًا لترى واجباتك الجديدة.</p></section>')+
     (done.length?'<h2 class="h pt-h">أنجزتها</h2>'+done.map(card).join(''):''));wire();
    $$('[data-hw]').forEach(function(b){b.onclick=function(){var h=hws.filter(function(x){return x.id===b.dataset.hw;})[0];if(!h.open&&h.sub)return TB.toast('أغلقت المعلمة هذا الواجب');if(!h.open)return TB.toast('هذا الواجب مغلق');run(h);};});})
  .catch(function(){fail('تعذّر تحميل الواجبات');});}
function starsOf(sc,mx){var p=sc/mx;return p>=.9?3:p>=.6?2:p>0?1:0;}
function card(h){var s=h.sub,st=s?starsOf(s.sc,s.mx):0;return '<button class="pt-hw'+(s?' done':'')+'" data-hw="'+h.id+'"><span class="em">'+(s?'✅':'📝')+'</span><span class="grow"><b>'+esc(h.t)+'</b><small>'+ar(h.items.length)+' أسئلة'+(h.due?' · قبل '+D.fdate(h.due):'')+(s?' · '+ar(Math.round(s.sc*10)/10)+' من '+ar(s.mx):'')+'</small>'+(h.note&&!s?'<small class="nt">'+esc(h.note)+'</small>':'')+'</span>'+
  (s?'<span class="pt-stars">'+'⭐'.repeat(st)+'</span>':'<span class="btn gold">'+I.play+'ابدأ</span>')+'</button>';}

/* ---------- حل الواجب ---------- */
function run(h){var k=0,sc=[],ans=[],items=h.items;
  function show(){if(k>=items.length)return finish();var it=items[k];
    screen(head(h.t)+'<div class="ds-qnav"><span class="chip">'+(it.k==='task'?'المهمة':'السؤال')+' '+ar(k+1)+' من '+ar(items.length)+'</span><div class="ds-qdots">'+items.map(function(_,i){return '<i class="'+(i<k?(sc[i]==null||sc[i]>=.99?'ok':'no'):i===k?'on':'')+'"></i>';}).join('')+'</div></div>'+
     '<section class="ds-qcard">'+(it.img?'<img class="pt-qimg" src="'+it.img+'" alt="">':'')+'<div class="d-player-lite"></div></section><div class="row" style="justify-content:center"><button class="btn gold lg" id="ptNext" hidden>'+(k===items.length-1?'إنهاء':'التالي')+I.back+'</button></div>');wire();
    var box=$('.d-player-lite');function next(){var nb=$('#ptNext');nb.hidden=false;nb.onclick=function(){k++;show();};nb.focus();}
    if(it.k==='task')task(it,box,function(a){ans[k]=a;sc[k]=null;next();});
    else D.render(it,box,{mode:'test',done:function(s){sc[k]=s;next();}});}
  function finish(){var auto=0,mx=items.length;items.forEach(function(it,i){if(it.k!=='task')auto+=sc[i]||0;});
    var tries=(h.sub&&h.sub.tries||0)+1,doc={hw:h.id,code:code,uid:me.uid,n:stu.n,sc:auto,mx:mx,it:items.map(function(it,i){return it.k==='task'?(ans[i]?1:0):Math.round((sc[i]||0)*100)/100;}),ans:items.map(function(it,i){return ans[i]||null;}),tries:tries,v:h.v||1,at:firebase.firestore.FieldValue.serverTimestamp()};
    wait('جارٍ إرسال إجاباتك للمعلمة…');
    db.collection(ns+'_sub').doc(h.id+'_'+code).set(doc).then(function(){h.sub={sc:auto,mx:mx,tries:tries};result(h,auto,mx,items.some(function(it){return it.k==='task';}));})
     .catch(function(e){screen(head()+'<section class="ds-qcard pt-center"><div style="font-size:60px">📶</div><h2 class="h">لم تُرسل الإجابات بعد</h2><p class="note">'+(/permission/i.test(e&&e.code||'')?'ربما أغلقت المعلمة الواجب.':'تأكد من الإنترنت ثم اضغط «أرسل مرة أخرى».')+'</p><button class="btn gold lg" id="ptAgain">'+I.reset+'أرسل مرة أخرى</button></section>');$('#ptAgain').onclick=finish;});}
  show();}
function result(h,s,mx,hasTask){var st=starsOf(s,mx);
  screen(head(h.t)+'<section class="ds-qcard ds-result"><div class="stars">'+'⭐'.repeat(st)+'☆'.repeat(3-st)+'</div><h2 class="h">'+(st===3?'ممتاز يا '+esc(stu.n)+'!':st===2?'أحسنت يا '+esc(stu.n)+'!':'محاولة جيدة، واصل التدريب!')+'</h2><div class="score">'+ar(Math.round(s*10)/10)+' / '+ar(mx)+'</div>'+
   '<p class="note">✅ وصلت إجاباتك إلى '+esc(PF.teacher)+(hasTask?'، وستقيّم المعلمة المهمة':'')+'.</p><button class="btn gold lg" id="ptHome">واجباتي</button></section>');wire();TB.celebrate();SND.play('win');$('#ptHome').onclick=home;}
function task(it,box,done){var a={txt:'',img:''};
  box.innerHTML='<div class="d-q">'+D.sayBtn(D.plain(it.q||'المهمة'))+'<span>'+esc(it.q||'')+'</span></div>'+(it.txt?'<textarea class="textarea pt-txt" rows="4" placeholder="اكتب إجابتك هنا"></textarea>':'')+
   (it.photo?'<div class="pt-ph"><label class="btn soft lg">📷 صوّر عملك<input type="file" accept="image/*" capture="environment" hidden></label><img alt="" hidden></div>':'')+'<button class="btn gold lg block pt-fin">✔ أنهيت المهمة</button>';
  var t=$('.pt-txt',box),f=$('.pt-ph input',box),im=$('.pt-ph img',box);
  if(t)t.oninput=function(){a.txt=t.value.slice(0,2000);};
  if(f)f.onchange=function(){var x=f.files[0];if(!x)return;TB.toast('جارٍ تجهيز الصورة…');shrink(x,1100,.7).then(function(u){a.img=u;im.src=u;im.hidden=false;});};
  $('.pt-fin',box).onclick=function(){if(!a.txt.trim()&&!a.img)return TB.toast(it.photo&&!it.txt?'صوّر عملك أولًا':'اكتب إجابتك أو صوّر عملك');$('.pt-fin',box).disabled=true;SND.play('good');done({txt:a.txt.trim(),img:a.img});};}
function shrink(file,max,q){return new Promise(function(ok,no){var r=new FileReader();r.onerror=no;r.onload=function(){var im=new Image();im.onerror=no;im.onload=function(){var w=im.width,h=im.height,k=Math.min(1,max/Math.max(w,h)),c=document.createElement('canvas');c.width=Math.round(w*k);c.height=Math.round(h*k);
  var x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);var u=c.toDataURL('image/jpeg',q);if(u.length>350000&&max>500)return shrink(file,max*0.7,q).then(ok,no);ok(u);};im.src=r.result;};r.readAsDataURL(file);});}

document.title=(PF.title||'واجباتي')+' · '+PF.teacher;
start();
if('serviceWorker' in navigator&&location.protocol==='https:')navigator.serviceWorker.register('sw.js').catch(function(){});
})();
