/* =====================================================================
   «هذا وطني»: طبقة البيانات
   - سحابي: Google Firebase (Firestore). الطالبة تدخل تلقائيًا بحساب جهاز (أو Anonymous إن كان مفعّلًا)،
     والمعلمات يدخلن بكلمة سر على حساب واحد ثابت (TEACHER). الحماية في قواعد Firestore.
   - محلي: إن لم يُضبط firebase-config.js تعمل المنصة على هذا الجهاز وحده (localStorage).
   المجموعات:
     watani_cfg/site        إعدادات عامة ولوحة الشرف المنشورة (يقرؤها الجميع)
     watani_t/{bank|comp}   بنك الأسئلة بالإجابات، والشعب والتصفيات والإعدادات (للمعلمات فقط)
     watani_round/{rid}     الجولة المنشورة بلا إجابات (يقرؤها الجميع)
     watani_key/{rid}       مفتاح الإجابات (للمعلمات، وللطالبة بعد تسليمها)
     watani_sub/{rid_uid}   تسليم الطالبة (مرة واحدة لكل جهاز في كل جولة)
     watani_gal/{id}        صور المعرض (للمعلمات)
   ===================================================================== */
(function(){
'use strict';
var TEACHER='muallimat@watani.ofuq.team';
var CFG=window.WATANI_FIREBASE||null;
var db=null,auth=null,fb=null;
function rid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,8);}
function clone(o){return o==null?o:JSON.parse(JSON.stringify(o));}
function arr(o){return Object.keys(o||{}).map(function(k){return o[k];});}

/* ---------- المحلي ---------- */
var LP='watani:local:';
function lg(k,d){try{var v=localStorage.getItem(LP+k);return v?JSON.parse(v):d;}catch(e){return d;}}
function ls(k,v){try{localStorage.setItem(LP+k,JSON.stringify(v));}catch(e){throw new Error('مساحة الجهاز ممتلئة');}fire(k);}
var W={};function on(k,cb){(W[k]=W[k]||[]).push(cb);setTimeout(function(){cb();},0);return function(){W[k]=W[k].filter(function(x){return x!==cb;});};}
function fire(k){(W[k]||[]).forEach(function(cb){try{cb();}catch(e){console.error(e);}});}
addEventListener('storage',function(e){if(e.key&&e.key.indexOf(LP)===0)fire(e.key.slice(LP.length));});
function luid(){var u=lg('uid',null);if(!u){u='u'+rid();try{localStorage.setItem(LP+'uid',JSON.stringify(u));}catch(e){}}return u;}
function sha(s){var b=new TextEncoder().encode('watani|'+s);return crypto.subtle.digest('SHA-256',b).then(function(h){return Array.prototype.map.call(new Uint8Array(h),function(x){return ('0'+x.toString(16)).slice(-2);}).join('');});}
var Local={
  mode:'local',
  ready:function(){return Promise.resolve();},
  uid:function(){return luid();},
  student:function(){return Promise.resolve(luid());},
  isTeacher:function(){try{return sessionStorage.getItem('watani:t')==='1';}catch(e){return false;}},
  login:function(pw){return sha(pw).then(function(h){var s=lg('tpw',null);if(!s)throw new Error('no-account');if(s!==h)throw new Error('wrong');try{sessionStorage.setItem('watani:t','1');}catch(e){}});},
  signup:function(pw){return sha(pw).then(function(h){if(lg('tpw',null))throw new Error('exists');ls('tpw',h);try{sessionStorage.setItem('watani:t','1');}catch(e){}});},
  changePw:function(pw){return sha(pw).then(function(h){ls('tpw',h);});},
  logout:function(){try{sessionStorage.removeItem('watani:t');}catch(e){}return Promise.resolve();},
  site:function(){return Promise.resolve(lg('site',{}));},
  saveSite:function(o){var s=lg('site',{});Object.keys(o).forEach(function(k){s[k]=o[k];});ls('site',s);return Promise.resolve();},
  watchSite:function(cb){return on('site',function(){cb(lg('site',{}));});},
  getT:function(k){return Promise.resolve(lg('t_'+k,null));},
  saveT:function(k,o){ls('t_'+k,o);return Promise.resolve();},
  watchT:function(k,cb){return on('t_'+k,function(){cb(lg('t_'+k,null));});},
  watchOpen:function(cb){return on('round',function(){cb(arr(lg('round',{})).filter(function(r){return r.open;}));});},
  watchRounds:function(cb){return on('round',function(){cb(arr(lg('round',{})).sort(function(a,b){return (b.created||0)-(a.created||0);}));});},
  round:function(id){return Promise.resolve(lg('round',{})[id]||null);},
  saveRound:function(r,key){var all=lg('round',{}),ks=lg('key',{});if(!r.id){r.id=rid();r.created=Date.now();}all[r.id]=clone(r);ks[r.id]=key;ls('key',ks);ls('round',all);return Promise.resolve(r.id);},
  setOpen:function(id,o){var all=lg('round',{});if(all[id]){all[id].open=!!o;ls('round',all);}return Promise.resolve();},
  delRound:function(id){var all=lg('round',{}),ks=lg('key',{}),s=lg('sub',{});delete all[id];delete ks[id];Object.keys(s).forEach(function(k){if(s[k].rid===id)delete s[k];});ls('sub',s);ls('key',ks);ls('round',all);return Promise.resolve();},
  key:function(id){return Promise.resolve(lg('key',{})[id]||null);},
  mySub:function(rid_){return Promise.resolve(lg('sub',{})[rid_+'_'+luid()]||null);},
  submit:function(rid_,d){var s=lg('sub',{}),id=rid_+'_'+luid(),r=lg('round',{})[rid_];
    if(!r||!r.open)return Promise.reject(new Error('closed'));if(s[id])return Promise.reject(new Error('dup'));
    var o=clone(d);o.id=id;o.rid=rid_;o.uid=luid();o.at=Date.now();s[id]=o;ls('sub',s);return Promise.resolve(o);},
  watchSubs:function(rid_,cb){return on('sub',function(){cb(arr(lg('sub',{})).filter(function(x){return !rid_||x.rid===rid_;}));});},
  watchMySub:function(rid_,cb){return on('sub',function(){cb(lg('sub',{})[rid_+'_'+luid()]||null);});},
  gradeSub:function(sid,g){var s=lg('sub',{});if(s[sid]){s[sid].g=g;ls('sub',s);}return Promise.resolve();},
  delSub:function(sid){var s=lg('sub',{});delete s[sid];ls('sub',s);return Promise.resolve();},
  watchGal:function(cb){return on('gal',function(){cb(arr(lg('gal',{})).sort(function(a,b){return (b.at||0)-(a.at||0);}));});},
  saveGal:function(g){var a=lg('gal',{});if(!g.id){g.id=rid();g.at=Date.now();}a[g.id]=g;ls('gal',a);return Promise.resolve(g.id);},
  delGal:function(id){var a=lg('gal',{});delete a[id];ls('gal',a);return Promise.resolve();}
};

/* ---------- السحابي ---------- */
function ts(v){return v&&v.toMillis?v.toMillis():(typeof v==='number'?v:Date.now());}
function doc(c,id){return db.collection(c).doc(id);}
function dat(s){if(!s.exists)return null;var d=s.data();d.id=s.id;if(d.at)d.at=ts(d.at);if(d.created)d.created=ts(d.created);return d;}
function list(qs){var a=[];qs.forEach(function(s){a.push(dat(s));});return a;}
var authReady=null;
var Cloud={
  mode:'cloud',
  ready:function(){if(authReady)return authReady;authReady=new Promise(function(res){var off=auth.onAuthStateChanged(function(){off();res();});});return authReady;},
  uid:function(){return auth.currentUser&&auth.currentUser.uid;},
  student:function(){return Cloud.ready().then(function(){if(auth.currentUser&&auth.currentUser.email!==TEACHER)return auth.currentUser.uid;
    var k='watani:dev',d=null;try{d=JSON.parse(localStorage.getItem(k)||'null');}catch(e){}
    if(d&&d.e&&d.p)return auth.signInWithEmailAndPassword(d.e,d.p).then(function(c){return c.user.uid;});
    return auth.signInAnonymously().then(function(c){return c.user.uid;}).catch(function(){
      d={e:'s'+rid()+rid().slice(-4)+'@talibat.watani.ofuq.team',p:rid()+rid()};try{localStorage.setItem(k,JSON.stringify(d));}catch(e){}
      return auth.createUserWithEmailAndPassword(d.e,d.p).then(function(c){return c.user.uid;});});});},
  isTeacher:function(){return !!(auth.currentUser&&auth.currentUser.email===TEACHER);},
  login:function(pw){return auth.signInWithEmailAndPassword(TEACHER,pw).catch(function(e){var c=e&&e.code||'';
    if(/user-not-found/.test(c))throw new Error('no-account');if(/wrong-password|invalid-credential|invalid-login/.test(c))throw new Error('wrong');if(/too-many/.test(c))throw new Error('many');throw e;});},
  signup:function(pw){return auth.createUserWithEmailAndPassword(TEACHER,pw).catch(function(e){if(/email-already-in-use/.test(e&&e.code||''))throw new Error('exists');throw e;});},
  changePw:function(pw){return auth.currentUser.updatePassword(pw);},
  logout:function(){return auth.signOut();},
  site:function(){return doc('watani_cfg','site').get().then(function(s){return s.exists?s.data():{};});},
  saveSite:function(o){return doc('watani_cfg','site').set(o,{merge:true});},
  watchSite:function(cb){return doc('watani_cfg','site').onSnapshot(function(s){cb(s.exists?s.data():{});},function(){cb({});});},
  getT:function(k){return doc('watani_t',k).get().then(function(s){return s.exists?s.data():null;});},
  saveT:function(k,o){return doc('watani_t',k).set(clone(o));},
  watchT:function(k,cb,err){return doc('watani_t',k).onSnapshot(function(s){if(s.metadata&&s.metadata.hasPendingWrites)return;cb(s.exists?s.data():null);},function(e){if(err)err(e);});},
  watchOpen:function(cb,err){return db.collection('watani_round').where('open','==',true).onSnapshot(function(qs){cb(list(qs));},function(e){if(err)err(e);});},
  watchRounds:function(cb,err){return db.collection('watani_round').onSnapshot(function(qs){cb(list(qs).sort(function(a,b){return (b.created||0)-(a.created||0);}));},function(e){if(err)err(e);});},
  round:function(id){return doc('watani_round',id).get().then(dat);},
  saveRound:function(r,key){if(!r.id){r.id=rid();r.created=Date.now();}var id=r.id,b=db.batch(),pub=clone(r);delete pub.id;
    b.set(doc('watani_round',id),pub);b.set(doc('watani_key',id),key||{});return b.commit().then(function(){return id;});},
  setOpen:function(id,o){return doc('watani_round',id).update({open:!!o});},
  delRound:function(id){return db.collection('watani_sub').where('rid','==',id).get().then(function(qs){var b=db.batch();qs.forEach(function(s){b.delete(s.ref);});
    b.delete(doc('watani_round',id));b.delete(doc('watani_key',id));return b.commit();});},
  key:function(id){return doc('watani_key',id).get().then(function(s){return s.exists?s.data():null;});},
  mySub:function(r){return Cloud.student().then(function(u){return doc('watani_sub',r+'_'+u).get();}).then(dat);},
  submit:function(r,d){return Cloud.student().then(function(u){var id=r+'_'+u,ref=doc('watani_sub',id);
    var o={rid:r,uid:u,name:d.name,sec:d.sec,ans:d.ans,tm:d.tm,dur:d.dur,at:fb.firestore.FieldValue.serverTimestamp()};
    return ref.set(o).then(function(){return ref.get();}).then(dat).catch(function(e){if(/permission/.test(e&&e.code||''))return ref.get().then(function(s){if(s.exists)throw new Error('dup');throw new Error('closed');},function(){throw new Error('closed');});throw e;});});},
  watchSubs:function(r,cb,err){var q=db.collection('watani_sub');if(r)q=q.where('rid','==',r);return q.onSnapshot(function(qs){cb(list(qs));},function(e){if(err)err(e);});},
  watchMySub:function(r,cb){var off=null,dead=false;Cloud.student().then(function(u){if(dead)return;off=doc('watani_sub',r+'_'+u).onSnapshot(function(s){cb(dat(s));},function(){});});return function(){dead=true;if(off)off();};},
  gradeSub:function(sid,g){return doc('watani_sub',sid).update({g:g});},
  delSub:function(sid){return doc('watani_sub',sid).delete();},
  watchGal:function(cb,err){return db.collection('watani_gal').onSnapshot(function(qs){cb(list(qs).sort(function(a,b){return (b.at||0)-(a.at||0);}));},function(e){if(err)err(e);});},
  saveGal:function(g){if(!g.id){g.id=rid();g.at=Date.now();}var o=clone(g);delete o.id;return doc('watani_gal',g.id).set(o).then(function(){return g.id;});},
  delGal:function(id){return doc('watani_gal',id).delete();}
};

var S=Local;
if(CFG&&window.firebase){try{fb=window.firebase;if(!fb.apps.length)fb.initializeApp(CFG);auth=fb.auth();db=fb.firestore();
  if(window.WATANI_EMU){auth.useEmulator('http://'+WATANI_EMU+':9099');db.useEmulator(WATANI_EMU,8080);}
  try{db.enablePersistence({synchronizeTabs:true}).catch(function(){});}catch(e){}
  S=Cloud;}catch(e){console.warn('watani: firebase off',e);S=Local;}}
S.TEACHER=TEACHER;S.rid=rid;
window.WDB=S;
})();
