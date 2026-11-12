/* =====================================================================
   «المزامنة الآمنة» المشتركة · مأخوذة من zainab/sync.js (2026-11-10) · Firebase Firestore
   - بلا تسجيل دخول: حساب خفي واحد للمنصة (window.SAFE_SYNC = {prefix, fb, email, pw} في index.html)،
     والنسخة المنشورة كلها مشفّرة بكلمة مرور المنصة.
   - كل قسم مستند مستقل في <prefix>_r/k:<القسم>، وكل شاهد مستند مستقل في <prefix>_r/e:<id>،
     والأحدث يغلب لكل مستند وحده، فلا يمسح تعديلُ جهازٍ شاهدًا أضافه جهاز آخر.
   - الصور والملفات في <prefix>_f/{fid} = {name,type,size,n} وأجزاؤها <prefix>_f/{fid}_{i} = {d}
     وتُنزَّل عند فتحها على جهاز آخر.
   - أول ربط لجهاز: ما في السحابة يغلب، وما انفرد به الجهاز يُرفع.
   ===================================================================== */
(function(){
'use strict';
var C=window.SAFE_SYNC||null,A=null,P=(C&&C.prefix)||"platform";
var RC=P+'_r',FC=P+'_f',CHUNK=700000,FILE_MAX=50*1048576,MK=P+':sync',BK=P+':syncbase';
var SKIP={v:1,settings:1};
var big='',auth=null,db=null,user=null,unsub=null,timer=null,busy=false,first=true,st='off',msg='',pendRender=false;
var M=lsg(),B=lbg(),prefetching=false;
function lbg(){try{return JSON.parse(localStorage.getItem(BK)||'{}')||{};}catch(e){return {};}}
function lbs(){try{localStorage.setItem(BK,JSON.stringify(B));}catch(e){}}
function lsg(){try{var m=JSON.parse(localStorage.getItem(MK)||'null');if(m&&m.h)return m;}catch(e){}return {h:{},t:{},dirty:{},fup:{}};}
function lss(){try{localStorage.setItem(MK,JSON.stringify(M));}catch(e){}}
function hash(s){var h=2166136261;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0).toString(36)+'.'+s.length;}
function clock(){return new Date().toLocaleTimeString('ar-OM-u-nu-latn',{hour:'numeric',minute:'2-digit'});}
var Z=window.SafeSync={on:!!C,state:function(){return st;},msg:function(){return msg;},changed:changed,now:function(){diff();push();},fetch:function(){return Promise.resolve(null);},start:start};

function status(s,m){st=s;msg=m||'';document.querySelectorAll('[data-sync]').forEach(function(b){b.setAttribute('data-st',s);b.title=msg;});
  document.querySelectorAll('.sync-st').forEach(function(p){p.setAttribute('data-st',s);var t=p.querySelector('span');if(t)t.textContent=msg;});}
Z.status=status;

/* السجلات: قسم لكل مفتاح، وشاهد لكل عنصر في ev */
function recs(){var S=A.S(),r={};Object.keys(S).forEach(function(k){if(SKIP[k]||k==='ev')return;r['k:'+k]=S[k];});(S.ev||[]).forEach(function(e){r['e:'+e.id]=e;});return r;}
function fileIds(){if(A.fileIds)return A.fileIds();var S=A.S(),ids={};(S.ev||[]).forEach(function(e){(e.files||[]).forEach(function(f){ids[f.id]=1;});});
  var T=S.tests||{};Object.keys(T).forEach(function(g){(T[g]||[]).forEach(function(t){(t.imgs||[]).forEach(function(f){ids[f.id]=1;});});});return ids;}
/* يقارن الحالة الحالية بآخر نسخة معروفة ويعلّم ما تغيّر */
function diff(){if(!A||!A.S())return;var r=recs(),now=Date.now(),ch=false;
  Object.keys(r).forEach(function(id){var h=hash(JSON.stringify(r[id]));if(M.h[id]!==h){M.h[id]=h;M.t[id]=now;M.dirty[id]=1;ch=true;}});
  Object.keys(M.h).forEach(function(id){if(!(id in r)&&M.h[id]!=='-'){if(id.indexOf('e:')===0){M.h[id]='-';M.t[id]=now;M.dirty[id]=1;ch=true;}}});
  var f=fileIds();Object.keys(f).forEach(function(fid){if(!M.fup[fid]){M.fup[fid]=0;ch=true;}});
  if(ch)lss();return ch;}
function changed(){clearTimeout(timer);timer=setTimeout(function(){diff();push();},400);}

/* دمج ثلاثي: ما غيّره هذا الجهاز يبقى، وما غيّره الجهاز الآخر يُضاف، فلا يضيع تعديل أحدهما */
function rh(j){try{return hash(JSON.stringify(JSON.parse(j)));}catch(e){return '';}}
function same(a,b){return JSON.stringify(a)===JSON.stringify(b);}
function isObj(x){return x&&typeof x==='object'&&!Array.isArray(x);}
function merge3(b,l,r){if(same(l,r))return l;if(b!==undefined){if(same(l,b))return r;if(same(r,b))return l;}
  if(isObj(l)&&isObj(r)){var o={},bb=isObj(b)?b:{};Object.keys(r).concat(Object.keys(l)).forEach(function(k){if(k in o)return;
      if(!(k in l)&&(k in bb))return; if(!(k in r)&&(k in bb)&&same(l[k],bb[k]))return;
      var v=(k in l)&&(k in r)?merge3(bb[k],l[k],r[k]):(k in l?l[k]:r[k]);if(v!==undefined)o[k]=v;});return o;}
  if(Array.isArray(l)&&Array.isArray(r)){
    var ids=l.concat(r).every(function(x){return isObj(x)&&x.id;});
    if(ids){var bm={};(Array.isArray(b)?b:[]).forEach(function(x){if(isObj(x))bm[x.id]=x;});var lm={},rm={},out=[];l.forEach(function(x){lm[x.id]=x;});r.forEach(function(x){rm[x.id]=x;});
      r.forEach(function(x){if(lm[x.id])out.push(merge3(bm[x.id],lm[x.id],x));else if(!bm[x.id])out.push(x);});
      l.forEach(function(x){if(!rm[x.id]&&!(bm[x.id]&&same(bm[x.id],x)))out.push(x);});return out;}
    if(l.length===r.length&&(!Array.isArray(b)||b.length===l.length)){return l.map(function(x,i){return merge3(Array.isArray(b)?b[i]:undefined,x,r[i]);});}
    var o2=r.slice(),seen={};r.forEach(function(x){seen[JSON.stringify(x)]=1;});l.forEach(function(x){if(!seen[JSON.stringify(x)])o2.push(x);});return o2;}
  /* جهاز لا يعرف آخر نسخة مشتركة (أول مزامنة له أو بعد تحديث): نسخة السحابة تغلب، إلا أن تكون فارغة */
  if(b===undefined&&!(r===''||r==null))return r;
  return l;}
/* حماية: جهاز فُتح بنسخة فارغة (متصفح آخر أو بيانات ممسوحة) قد يرفع المحتوى الأصلي كما هو فوق عمل المعلمة؛
   ما يصل مطابقًا للمحتوى الأصلي تمامًا بينما على هذا الجهاز عمل مكتوب، لا يُطبَّق، ويُعاد رفع ما على الجهاز */
var SEED=null;
function seedOf(id){if(!A||!A.seed||id.indexOf('k:')!==0)return undefined;if(!SEED){try{SEED=JSON.parse(JSON.stringify(A.seed()));}catch(e){SEED={};}}return SEED[id.slice(2)];}
function pristine(id,v){var s=seedOf(id);return s!==undefined&&v!==undefined&&same(s,v);}
function clobber(id,v,l){return pristine(id,v)&&l!==undefined&&!pristine(id,l);}
function curOf(id){var S=A.S();if(id.indexOf('k:')===0)return S[id.slice(2)];var eid=id.slice(2),f;(S.ev||[]).forEach(function(e){if(e.id===eid)f=e;});return f;}
function setOf(id,v){var S=A.S();if(id.indexOf('k:')===0){S[id.slice(2)]=v;return;}var eid=id.slice(2),i=-1;(S.ev||(S.ev=[])).forEach(function(e,j){if(e.id===eid)i=j;});
  if(v===undefined){if(i>=0)S.ev.splice(i,1);}else if(i>=0)S.ev[i]=v;else S.ev.push(v);}

/* تطبيق ما يصل من السحابة */
function applyRemote(id,d){var T=d.t||0;if(M.h[id]!==undefined&&M.h[id]===(d.del?'-':rh(d.j)))return false;
  var isK=id.indexOf('k:')===0,isE=id.indexOf('e:')===0;if(!isK&&!isE)return false;if(isK&&SKIP[id.slice(2)])return false;
  var v;if(!d.del){try{v=JSON.parse(d.j);}catch(e){return false;}}else if(isK)return false;
  var base=B[id]!==undefined?JSON.parse(B[id]):undefined;
  if(isK&&!d.del&&!d.rs&&clobber(id,v,curOf(id))){var keep=curOf(id);B[id]=d.j;M.h[id]=hash(JSON.stringify(keep));M.t[id]=Date.now();M.dirty[id]=1;return false;}
  if(M.dirty[id]){/* تعديل محلي لم يُرفع بعد: يُدمج مع القادم ولا يُستبدل */
    var l=curOf(id);
    if(d.del){delete B[id];if(l!==undefined)return false;}
    var mg=l===undefined?v:merge3(base,l,v);setOf(id,mg);if(!d.del)B[id]=d.j;
    M.h[id]=hash(JSON.stringify(mg));M.t[id]=Math.max(Date.now(),T+1);M.dirty[id]=1;return true;}
  setOf(id,d.del?undefined:v);
  if(d.del){M.h[id]='-';delete B[id];}else{B[id]=d.j;M.h[id]=hash(JSON.stringify(v));}
  M.t[id]=T;delete M.dirty[id];return true;}
function editing(){if(document.querySelector('dialog[open]'))return true;var a=document.activeElement;return !!(a&&(a.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)));}
function refresh(){if(document.querySelector('dialog[open]')){pendRender=true;return;}pendRender=false;(A.live||A.rerender)();}
document.addEventListener('close',function(){if(pendRender)setTimeout(refresh,250);},true);

function errMsg(e,def){var c=e&&e.code||'';return /permission/i.test(c)?'المزامنة بانتظار تفعيلها على الخادم؛ بياناتك محفوظة على هذا الجهاز':def;}
function start(api){A=api;
  if(!C){status('off','المزامنة غير مفعّلة؛ البيانات محفوظة على هذا الجهاز');return;}
  if(!window.firebase||!firebase.firestore){status('wait','جارٍ تجهيز المزامنة…');loadOld(function(ok){if(ok&&window.firebase&&firebase.firestore)boot();else{status('err','المزامنة تحتاج الإنترنت؛ البيانات محفوظة على هذا الجهاز وتُرفع عند الاتصال');setTimeout(function(){location.reload();},60000);}});return;}
  boot();}
/* الأجهزة القديمة (آيباد بنظام قديم) لا تشغّل نسخة Firebase الحديثة، فتُحمَّل لها نسخة متوافقة */
function loadOld(cb){NOTX=true;var V='https://www.gstatic.com/firebasejs/8.10.1/firebase-',L=['app','auth','firestore'],i=0;try{delete window.firebase;}catch(e){window.firebase=undefined;}
  (function nx(){if(i>=L.length)return cb(true);var sc=document.createElement('script');sc.src=V+L[i++]+'.js';sc.onload=nx;sc.onerror=function(){cb(false);};document.head.appendChild(sc);})();}
function boot(){
  /* نسخة المصدر قبل البناء: كلمة الحساب لم تُحقن بعد، فلا نتصل بالسحابة الحية حتى لا يُنشأ الحساب بكلمة خاطئة */
  if(!C.emu&&/^__[A-Z_]+__$/.test(C.pw||'')){status('off','المزامنة تعمل في النسخة المنشورة');return;}
  try{firebase.initializeApp(C.fb,P);var app=firebase.app(P);auth=app.auth();db=app.firestore();
    try{if(!C.emu)db.settings({experimentalAutoDetectLongPolling:true,merge:true});}catch(e){}
    if(C.emu){auth.useEmulator('http://127.0.0.1:9099',{disableWarnings:true});db.useEmulator('127.0.0.1',8080);}}catch(e){status('err','تعذّر تجهيز المزامنة');return;}
  /* أول تشغيل على جهاز: نعرف بصمة ما عليه دون اعتباره تعديلًا جديدًا، حتى تغلب نسخة السحابة */
  if(!Object.keys(M.h).length){var r=recs();Object.keys(r).forEach(function(id){M.h[id]=hash(JSON.stringify(r[id]));M.t[id]=0;});lss();}
  status('wait','جارٍ الاتصال بالمزامنة…');
  auth.onAuthStateChanged(function(u){var ok=u&&(C.emails||[C.email]).indexOf(u.email)>=0;if(u&&!ok){auth.signOut();return;}user=ok?u:null;if(unsub){unsub();unsub=null;}
    if(A.onAuth)A.onAuth(user?user.email:null);if(!user){status('off','سجّلي الدخول لتبدأ المزامنة');return;}listen();});
  Z.fetch=fetchFile;}
/* دخول بحساب من حسابات المنصة (المعلمات أو صاحبة المنصة) */
Z.signIn=function(email,pw){if(!auth)return Promise.reject({code:'no-sync'});return auth.signInWithEmailAndPassword(email,pw);};
Z.signOut=function(){if(unsub){unsub();unsub=null;}first=true;return auth?auth.signOut():Promise.resolve();};
Z.email=function(){return user?user.email:null;};
Z.changePw=function(cur,nw){if(!user)return Promise.reject({code:'no-user'});var cr=firebase.auth.EmailAuthProvider.credential(user.email,cur);
  return user.reauthenticateWithCredential(cr).then(function(){return user.updatePassword(nw);});};
/* تغيير كلمة حساب آخر (المعلمات) من حساب صاحبة المنصة: يُفتح الحساب في نسخة جانبية ثم يُغلق */
Z.changeOther=function(email,cur,nw){var nm=P+'-aux'+Date.now(),app2=firebase.initializeApp(C.fb,nm),a2=app2.auth();if(C.emu)a2.useEmulator('http://127.0.0.1:9099',{disableWarnings:true});
  return a2.signInWithEmailAndPassword(email,cur).then(function(c){return c.user.updatePassword(nw);}).then(function(){return a2.signOut();}).then(function(){return app2.delete();},function(e){app2.delete();throw e;});};
function login(){if(!C.pw){status('off','سجّلي الدخول لتبدأ المزامنة');return;}if(!navigator.onLine){status('off','لا يوجد اتصال؛ ستبدأ المزامنة عند عودة الإنترنت');addEventListener('online',login,{once:true});return;}
  auth.signInWithEmailAndPassword(C.email,C.pw).catch(function(e){var c=e&&e.code||'';
    if(/user-not-found|invalid-credential|invalid-login/.test(c))return auth.createUserWithEmailAndPassword(C.email,C.pw);throw e;})
   .then(function(){LTRY=0;},function(e){var c=(e&&e.code)||'',wait;LTRY++;
     /* لا نكرر المحاولة بسرعة: كل محاولة فاشلة تُطيل الانتظار، والحظر المؤقت من Firebase ننتظره ربع ساعة */
     if(/too-many-requests/.test(c)){wait=15*60000;status('err','المزامنة متوقفة مؤقتًا وستعود وحدها؛ بياناتك محفوظة على هذا الجهاز');}
     else if(/email-already-in-use|wrong-password|invalid-credential/.test(c)){wait=Math.min(60*60000,10*60000*LTRY);status('err','حساب المزامنة يحتاج ضبطًا؛ بياناتك محفوظة على هذا الجهاز');}
     else if(/network/.test(c)){wait=Math.min(10*60000,30000*Math.pow(2,LTRY-1));status('off','لا يوجد اتصال؛ ستبدأ المزامنة عند عودة الإنترنت');}
     else{wait=Math.min(30*60000,30000*Math.pow(2,LTRY-1));status('err','تعذّر الاتصال بالمزامنة؛ ستُعاد المحاولة');}
     lastErr=c;try{console.warn('[sync] login',c,'retry in',Math.round(wait/1000)+'s');}catch(x){}setTimeout(login,wait);});}
var LTRY=0;
function take(list,full){diff();var ch=0,seen={};list.forEach(function(x){seen[x.id]=1;if(applyRemote(x.id,x.data))ch++;});
  /* قراءة كاملة: كل ما على الجهاز ولم يصل إلى السحابة بعد يُرفع، مهما كان سبب تأخره */
  if(first||full){var wasFirst=first;first=false;var r=recs();Object.keys(r).forEach(function(id){if(!seen[id]&&!M.dirty[id]){M.t[id]=Date.now();M.dirty[id]=1;}});}
  lss();lbs();if(ch){A.save(true);refresh();}
  if(!busy)status('ok','متزامنة · آخر مزامنة '+clock());push();prefetch();}
function listen(){status('wait','جارٍ المزامنة…');
  unsub=db.collection(RC).onSnapshot(function(snap){var list=[];
    var full=first;snap.docChanges().forEach(function(c){if(c.type==='removed')return;list.push({id:c.doc.id,data:c.doc.data()});});take(list,full);},
   function(e){status('err',errMsg(e,'انقطعت المزامنة؛ ستعود تلقائيًا'));if(unsub){unsub();unsub=null;}setTimeout(function(){if(user&&!unsub)listen();},5000);});}
/* عند الرجوع إلى المنصة: سحب كامل من الخادم حتى لو نام الاتصال في الخلفية */
var lastPull=0;
function pull(){if(!user||first||Date.now()-lastPull<15000)return;lastPull=Date.now();
  tmo(db.collection(RC).get({source:'server'}),30000).then(function(q){var list=[];q.forEach(function(d){list.push({id:d.id,data:d.data()});});take(list,true);checkFiles();}).catch(function(){});}
/* الملفات: ما على الجهاز ولم يوجد في السحابة يُعاد رفعه */
var filesChecked=false;
function checkFiles(){if(filesChecked)return;filesChecked=true;var ids=Object.keys(fileIds()),i=0,ch=false;
  (function nx(){if(i>=ids.length){if(ch){lss();changed();}return;}var fid=ids[i++];
    A.fGet(fid).then(function(m){if(!m||!m.blob)return;return tmo(db.collection(FC).doc(fid).get(),20000).then(function(d){if(!d.exists&&M.fup[fid]!==0){M.fup[fid]=0;ch=true;}});}).catch(function(){}).then(nx);})();}
setInterval(function(){if(document.visibilityState==='visible')pull();},120000);
/* تنزيل كل صور الجهاز الآخر وملفاته إلى هذا الجهاز، فتبقى محفوظة حتى بلا إنترنت */
var pfTry=0;
function prefetch(){if(prefetching||!user)return;prefetching=true;var ids=Object.keys(fileIds()),i=0,miss=0,got=0;
  (function next(){if(i>=ids.length){prefetching=false;if(got)refresh();if(miss&&pfTry<40){pfTry++;setTimeout(prefetch,2000);}else if(!miss)pfTry=0;return;}var fid=ids[i++];
    A.fGet(fid).then(function(m){if(m&&m.blob)return;return fetchFile(fid).then(function(x){if(x)got++;else miss++;});}).catch(function(){miss++;}).then(function(){setTimeout(next,30);});})();}
addEventListener('online',function(){changed();});
document.addEventListener('visibilitychange',function(){if(!user)return;diff();push();if(document.visibilityState==='visible')pull();});
addEventListener('focus',function(){pull();});

/* الرفع بمعاملة: يقرأ نسخة الخادم أولًا، فإن غيّرها جهاز آخر منذ آخر مزامنة دُمج التعديلان قبل الكتابة، فلا يمسح جهازٌ تعديلَ آخر */
/* النسخة المتوافقة للأجهزة القديمة لا تُنجز المعاملات دائمًا، فتقرأ من الخادم ثم تكتب (وتبقى الدمج نفسه) */
var NOTX=false;
function pushOne(id){var ref=db.collection(RC).doc(id),out={};
  function decide(d,write){var sv=d.exists?d.data():null,t=Date.now();
    /* نقرأ نسخة الجهاز لحظة الكتابة نفسها، لا نسخة قديمة */
    var cur=curOf(id),lj=cur===undefined?null:JSON.stringify(cur);out.lj=lj;out.js=lj;out.v=cur===undefined?undefined:JSON.parse(lj);out.changed=false;
    if(sv&&!sv.del&&sv.j!==lj&&sv.j!==B[id]&&lj!==null){var rv;try{rv=JSON.parse(sv.j);}catch(e){}
      if(rv!==undefined&&(sv.rs||!clobber(id,rv,out.v))){var base=B[id]!==undefined?JSON.parse(B[id]):undefined,mg=merge3(base,out.v,rv);out.js=JSON.stringify(mg);out.v=mg;out.changed=out.js!==lj;}}
    if(sv&&!sv.del&&sv.j===out.js)return;if(!sv&&out.js===null)return;
    var w=out.js===null?{t:t,del:true}:{t:t,del:false,j:out.js};if(out.v!==undefined&&pristine(id,out.v))w.rs=true;/* إرجاع مقصود للمحتوى الأصلي */
    return write(w);}
  if(NOTX)return ref.get({source:'server'}).then(function(d){return decide(d,function(v){return ref.set(v);});}).then(function(){return out;});
  return db.runTransaction(function(tx){return tx.get(ref).then(function(d){decide(d,function(v){tx.set(ref,v);});});}).then(function(){return out;});}
var busyAt=0,lastErr='';
function pending(){return Object.keys(M.dirty).length+Object.keys(M.fup).filter(function(f){return !M.fup[f];}).length;}
Z.pending=pending;Z.err=function(){return lastErr;};
function push(){if(!user||first)return;if(busy&&Date.now()-busyAt<90000)return;diff();var ids=Object.keys(M.dirty),fids=Object.keys(M.fup).filter(function(f){return !M.fup[f];});
  if(!ids.length&&!fids.length)return;
  busy=true;busyAt=Date.now();status('wait','جارٍ رفع التعديلات… ('+(ids.length+fids.length)+')');var p=Promise.resolve(),re=0,fail=0,run=busyAt;
  function bad(e){fail++;lastErr=(e&&(e.code||e.message))||'?';}
  /* واحدًا واحدًا: المعاملات المتزامنة من الجهاز نفسه تتعارض على بعض المتصفحات */
  ids.forEach(function(id){p=p.then(function(){
      return tmo(pushOne(id),30000).then(function(o){if(o.js===null)delete B[id];else B[id]=o.js;
        var now=curOf(id),nj=now===undefined?null:JSON.stringify(now),still=nj!==o.lj;
        if(o.changed){var fin=still?merge3(JSON.parse(o.lj),now,o.v):o.v;setOf(id,fin);re++;}
        if(still){M.dirty[id]=1;M.h[id]='?';}else{delete M.dirty[id];M.h[id]=o.js===null?'-':hash(o.js);}},bad);});});
  p=p.then(function(){lss();lbs();if(re){A.save(true);refresh();}});
  fids.forEach(function(fid){p=p.then(function(){return tmo(upFile(fid),180000).then(function(ok){if(ok!==false){M.fup[fid]=1;lss();}},bad);});});
  p.then(function(){if(run!==busyAt)return;busy=false;
    if(fail){status(navigator.onLine?'err':'off',navigator.onLine?'بقي '+pending()+' عنصرًا لم يُرفع بعد؛ تُعاد المحاولة تلقائيًا':'لا يوجد اتصال؛ التعديلات محفوظة وتُرفع عند عودة الإنترنت');setTimeout(changed,5000);return;}
    lastErr='';status('ok',big?('متزامنة، ما عدا «'+big+'» لأنه أكبر من 50 ميجابايت'):'متزامنة · آخر مزامنة '+clock());if(pending())changed();});}
addEventListener('pagehide',function(){if(user){diff();push();}});

function tmo(p,ms){return new Promise(function(res,rej){var done=false,t=setTimeout(function(){if(!done){done=true;rej({code:'timeout'});}},ms);p.then(function(v){if(!done){done=true;clearTimeout(t);res(v);}},function(e){if(!done){done=true;clearTimeout(t);rej(e);}});});}
function b64(blob){return new Promise(function(res,rej){var r=new FileReader();r.onload=function(){res(String(r.result).split(',')[1]||'');};r.onerror=rej;r.readAsDataURL(blob);});}
function upFile(fid){return A.fGet(fid).then(function(m){if(!m||!m.blob)return db.collection(FC).doc(fid).get().then(function(d){return d.exists?true:false;});
  if(m.blob.size>FILE_MAX){big=(m.name||'ملف');return true;}
  return b64(m.blob).then(function(s){var n=Math.ceil(s.length/CHUNK)||1,q=Promise.resolve();
    for(var i=0;i<n;i++)(function(i){q=q.then(function(){return db.collection(FC).doc(fid+'_'+i).set({d:s.slice(i*CHUNK,(i+1)*CHUNK)});});})(i);
    return q.then(function(){return db.collection(FC).doc(fid).set({name:m.name||'',type:m.type||'',size:m.blob.size,n:n,t:Date.now()});});});});}
function fetchFile(fid){if(!user)return Promise.resolve(null);return db.collection(FC).doc(fid).get().then(function(d){if(!d.exists)return null;var m=d.data(),parts=[];
  for(var i=0;i<m.n;i++)parts.push(db.collection(FC).doc(fid+'_'+i).get());
  return Promise.all(parts).then(function(ds){var s=ds.map(function(x){return x.exists?x.data().d:'';}).join(''),bin=atob(s),u=new Uint8Array(bin.length);for(var j=0;j<bin.length;j++)u[j]=bin.charCodeAt(j);
    var rec={blob:new Blob([u],{type:m.type}),name:m.name,type:m.type};M.fup[fid]=1;lss();return A.fPut(fid,rec).then(function(){return rec;});});}).catch(function(){return null;});}
})();
