/* =====================================================================
   «نجم الأسبوع»: طبقة البيانات
   - سحابي: Google Firebase (Firestore). الطالبات يدخلن دخولًا مجهولًا (Anonymous) تلقائيًا،
     والمعلمة تدخل بكلمة سر على حساب واحد ثابت (TEACHER). الحماية في قواعد Firestore.
   - محلي: إن لم يُضبط firebase-config.js تعمل المنصة على هذا الجهاز وحده (localStorage).
   المجموعات: najm_cfg/site · najm_q/{id} · najm_key/{id} · najm_sub/{qid_uid} · najm_fb/{qid_uid}
   ===================================================================== */
(function(){
'use strict';
var TEACHER='muallima@najm.ofuq.team';
var CFG=window.NAJM_FIREBASE||null;
var db=null,auth=null,fb=null;

function rid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,8);}
function clone(o){return o==null?o:JSON.parse(JSON.stringify(o));}

/* ---------- المحلي ---------- */
var LP='najm:local:';
function lg(k,d){try{var v=localStorage.getItem(LP+k);return v?JSON.parse(v):d;}catch(e){return d;}}
function ls(k,v){try{localStorage.setItem(LP+k,JSON.stringify(v));}catch(e){throw new Error('مساحة الجهاز ممتلئة');}}
function luid(){var u=lg('uid',null);if(!u){u='u'+rid();ls('uid',u);}return u;}
var lsubs=[];
function lfire(){var s=lg('sub',{});lsubs.forEach(function(w){w.cb(Object.keys(s).map(function(k){return s[k];}).filter(function(x){return !w.qid||x.qid===w.qid;}));});}
function sha(s){var b=new TextEncoder().encode('najm|'+s);return crypto.subtle.digest('SHA-256',b).then(function(h){return Array.prototype.map.call(new Uint8Array(h),function(x){return ('0'+x.toString(16)).slice(-2);}).join('');});}

var Local={
  mode:'local',
  ready:function(){return Promise.resolve();},
  uid:function(){return luid();},
  student:function(){return Promise.resolve(luid());},
  isTeacher:function(){try{return sessionStorage.getItem('najm:t')==='1';}catch(e){return false;}},
  hasTeacher:function(){return Promise.resolve(!!lg('tpw',null));},
  login:function(pw){return sha(pw).then(function(h){var s=lg('tpw',null);if(!s)throw new Error('no-account');if(s!==h)throw new Error('wrong');try{sessionStorage.setItem('najm:t','1');}catch(e){}});},
  signup:function(pw){return sha(pw).then(function(h){if(lg('tpw',null))throw new Error('exists');ls('tpw',h);try{sessionStorage.setItem('najm:t','1');}catch(e){}});},
  logout:function(){try{sessionStorage.removeItem('najm:t');}catch(e){}return Promise.resolve();},
  cfg:function(){return Promise.resolve(lg('cfg',{}));},
  saveCfg:function(c){var o=lg('cfg',{});Object.keys(c).forEach(function(k){o[k]=c[k];});ls('cfg',o);return Promise.resolve();},
  questions:function(){var q=lg('q',{});return Promise.resolve(Object.keys(q).map(function(k){return q[k];}).sort(function(a,b){return (b.created||0)-(a.created||0);}));},
  question:function(id){return Promise.resolve(lg('q',{})[id]||null);},
  saveQ:function(q,key){var all=lg('q',{}),ks=lg('key',{});if(!q.id){q.id=rid();q.created=Date.now();}all[q.id]=q;ks[q.id]=key;ls('q',all);ls('key',ks);return Promise.resolve(q.id);},
  delQ:function(id){var all=lg('q',{}),ks=lg('key',{});delete all[id];delete ks[id];ls('q',all);ls('key',ks);var c=lg('cfg',{});if(c.active===id){c.active='';ls('cfg',c);}return Promise.resolve();},
  activate:function(id){var all=lg('q',{});Object.keys(all).forEach(function(k){all[k].open=k===id;});ls('q',all);var c=lg('cfg',{});c.active=id||'';ls('cfg',c);return Promise.resolve();},
  key:function(id){return Promise.resolve(lg('key',{})[id]||{});},
  mySub:function(qid){return Promise.resolve(lg('sub',{})[qid+'_'+luid()]||null);},
  submit:function(qid,d){var s=lg('sub',{}),id=qid+'_'+luid(),q=lg('q',{})[qid];
    if(!q||!q.open)return Promise.reject(new Error('closed'));if(s[id])return Promise.reject(new Error('dup'));
    s[id]={id:id,qid:qid,uid:luid(),name:d.name,cls:d.cls||'',answer:d.answer,choice:d.choice,at:Date.now()};ls('sub',s);lfire();return Promise.resolve(s[id]);},
  myFb:function(qid){return Promise.resolve(lg('fb',{})[qid+'_'+luid()]||null);},
  watchSubs:function(qid,cb){var w={qid:qid,cb:cb};lsubs.push(w);setTimeout(lfire,0);var t=function(e){if(e.key===LP+'sub')lfire();};addEventListener('storage',t);
    return function(){lsubs=lsubs.filter(function(x){return x!==w;});removeEventListener('storage',t);};},
  allSubs:function(){var s=lg('sub',{});return Promise.resolve(Object.keys(s).map(function(k){return s[k];}));},
  fbs:function(){return Promise.resolve(lg('fb',{}));},
  saveFb:function(sid,d){var f=lg('fb',{});d.uid=sid.split('_').slice(1).join('_');f[sid]=d;ls('fb',f);return Promise.resolve();},
  delSub:function(sid){var s=lg('sub',{});delete s[sid];ls('sub',s);var f=lg('fb',{});delete f[sid];ls('fb',f);lfire();return Promise.resolve();}
};

/* ---------- السحابي ---------- */
function ts(v){return v&&v.toMillis?v.toMillis():(typeof v==='number'?v:Date.now());}
function doc(c,id){return db.collection(c).doc(id);}
function dat(s){if(!s.exists)return null;var d=s.data();d.id=s.id;if(d.at)d.at=ts(d.at);if(d.created)d.created=ts(d.created);return d;}
var authReady=null;
var Cloud={
  mode:'cloud',
  ready:function(){if(authReady)return authReady;
    authReady=new Promise(function(res){var off=auth.onAuthStateChanged(function(){off();res();});});return authReady;},
  uid:function(){return auth.currentUser&&auth.currentUser.uid;},
  student:function(){return Cloud.ready().then(function(){if(auth.currentUser)return auth.currentUser.uid;
    return auth.signInAnonymously().then(function(c){return c.user.uid;});});},
  isTeacher:function(){return !!(auth.currentUser&&auth.currentUser.email===TEACHER);},
  hasTeacher:function(){return Promise.resolve(null);},
  login:function(pw){return auth.signInWithEmailAndPassword(TEACHER,pw).catch(function(e){var c=e&&e.code||'';
    if(/user-not-found/.test(c))throw new Error('no-account');if(/wrong-password|invalid-credential|invalid-login/.test(c))throw new Error('wrong');throw e;});},
  signup:function(pw){return auth.createUserWithEmailAndPassword(TEACHER,pw).catch(function(e){if(/email-already-in-use/.test(e&&e.code||''))throw new Error('exists');throw e;});},
  logout:function(){return auth.signOut();},
  cfg:function(){return doc('najm_cfg','site').get().then(function(s){return s.exists?s.data():{};});},
  saveCfg:function(c){return doc('najm_cfg','site').set(c,{merge:true});},
  questions:function(){return db.collection('najm_q').get().then(function(qs){var a=[];qs.forEach(function(s){a.push(dat(s));});return a.sort(function(x,y){return (y.created||0)-(x.created||0);});});},
  question:function(id){return doc('najm_q',id).get().then(dat);},
  saveQ:function(q,key){var isNew=!q.id;if(isNew){q.id=rid();q.created=Date.now();}var id=q.id,b=db.batch(),pub=clone(q);delete pub.id;
    b.set(doc('najm_q',id),pub);b.set(doc('najm_key',id),key||{});return b.commit().then(function(){return id;});},
  delQ:function(id){var b=db.batch();b.delete(doc('najm_q',id));b.delete(doc('najm_key',id));return b.commit().then(function(){return Cloud.cfg();}).then(function(c){if(c.active===id)return Cloud.saveCfg({active:''});});},
  activate:function(id){return Cloud.questions().then(function(all){var b=db.batch();all.forEach(function(q){var on=q.id===id;if(!!q.open!==on)b.update(doc('najm_q',q.id),{open:on});});
    b.set(doc('najm_cfg','site'),{active:id||''},{merge:true});return b.commit();});},
  key:function(id){return doc('najm_key',id).get().then(function(s){return s.exists?s.data():{};});},
  mySub:function(qid){return Cloud.student().then(function(u){return doc('najm_sub',qid+'_'+u).get();}).then(dat);},
  submit:function(qid,d){return Cloud.student().then(function(u){var id=qid+'_'+u,ref=doc('najm_sub',id);
    var o={qid:qid,uid:u,name:d.name,cls:d.cls||'',answer:d.answer,choice:d.choice,at:fb.firestore.FieldValue.serverTimestamp()};
    return ref.set(o).then(function(){return ref.get();}).then(dat).catch(function(e){if(/permission/.test(e&&e.code||''))return ref.get().then(function(s){if(s.exists)throw new Error('dup');throw new Error('closed');});throw e;});});},
  myFb:function(qid){return Cloud.student().then(function(u){return doc('najm_fb',qid+'_'+u).get();}).then(dat).catch(function(){return null;});},
  watchSubs:function(qid,cb,err){var r=db.collection('najm_sub');if(qid)r=r.where('qid','==',qid);
    return r.onSnapshot(function(qs){var a=[];qs.forEach(function(s){a.push(dat(s));});cb(a);},function(e){if(err)err(e);});},
  allSubs:function(){return db.collection('najm_sub').get().then(function(qs){var a=[];qs.forEach(function(s){a.push(dat(s));});return a;});},
  fbs:function(){return db.collection('najm_fb').get().then(function(qs){var o={};qs.forEach(function(s){o[s.id]=s.data();});return o;});},
  saveFb:function(sid,d){d.uid=sid.split('_').slice(1).join('_');return doc('najm_fb',sid).set(d);},
  delSub:function(sid){var b=db.batch();b.delete(doc('najm_sub',sid));b.delete(doc('najm_fb',sid));return b.commit();}
};

var S=Local;
if(CFG&&window.firebase){try{fb=window.firebase;var app=fb.apps.length?fb.app():fb.initializeApp(CFG);auth=fb.auth();db=fb.firestore();
  if(window.NAJM_EMU){auth.useEmulator('http://'+NAJM_EMU+':9099');db.useEmulator(NAJM_EMU,8080);}
  try{db.enablePersistence({synchronizeTabs:true}).catch(function(){});}catch(e){}
  S=Cloud;}catch(e){console.warn('najm: firebase off',e);S=Local;}}
S.TEACHER=TEACHER;
window.NAJM_DB=S;
})();
