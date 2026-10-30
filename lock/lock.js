/* صفحة القفل: تتحقق من كلمة المرور، وتحفظ المفتاح على هذا الجهاز، وتشغّل عامل الخدمة الذي يفك ملفات المنصة. */
(function(){
'use strict';
var form=document.getElementById('lkForm'),inp=document.getElementById('lkPw'),msg=document.getElementById('lkMsg'),btn=document.getElementById('lkBtn'),CFG=null;
var SLUG=document.documentElement.dataset.lock;
function say(t,bad){msg.textContent=t||'';msg.className='lk-msg'+(bad?' bad':'');}
function b64(s){var b=atob(s),a=new Uint8Array(b.length);for(var i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return a;}
function db(mode,fn){return new Promise(function(res,rej){var r=indexedDB.open('afuq-lock',1);r.onupgradeneeded=function(){r.result.createObjectStore('keys');};r.onerror=function(){rej(r.error);};
  r.onsuccess=function(){var tx=r.result.transaction('keys',mode),q=fn(tx.objectStore('keys'));tx.oncomplete=function(){res(q&&q.result);};tx.onerror=function(){rej(tx.error);};};});}
function cfg(){return CFG?Promise.resolve(CFG):fetch('lock.json',{cache:'no-cache'}).then(function(r){return r.json();}).then(function(c){CFG=c;return c;});}
function check(raw){return cfg().then(function(c){return crypto.subtle.importKey('raw',raw,'AES-GCM',false,['decrypt']).then(function(k){var b=b64(c.check);
  return crypto.subtle.decrypt({name:'AES-GCM',iv:b.slice(0,12)},k,b.slice(12));}).then(function(p){return new TextDecoder().decode(p)==='afuq-lock-ok';},function(){return false;});});}
function derive(pw){return cfg().then(function(c){return crypto.subtle.importKey('raw',new TextEncoder().encode(pw.trim()),'PBKDF2',false,['deriveBits']).then(function(base){
  return crypto.subtle.deriveBits({name:'PBKDF2',salt:b64(c.salt),iterations:c.iter,hash:'SHA-256'},base,256);});});}
function open(){if(!('serviceWorker' in navigator)){say('هذا المتصفح لا يدعم فتح المنصة المقفلة. جرّبي Chrome أو Safari بتحديث حديث.',true);return;}
  say('جارٍ فتح المنصة…');
  navigator.serviceWorker.register('sw.js').then(function(){return navigator.serviceWorker.ready;}).then(function(reg){
    if(reg.active)reg.active.postMessage('lock:key');
    if(navigator.serviceWorker.controller){location.reload();return;}
    navigator.serviceWorker.addEventListener('controllerchange',function(){location.reload();},{once:true});
    setTimeout(function(){location.reload();},2500);}).catch(function(){say('تعذّر تشغيل المنصة على هذا المتصفح.',true);});}

form.addEventListener('submit',function(e){e.preventDefault();if(!inp.value.trim()){inp.focus();return;}btn.disabled=true;say('جارٍ التحقق…');
  derive(inp.value).then(function(raw){return check(raw).then(function(ok){if(!ok){btn.disabled=false;say('كلمة المرور غير صحيحة',true);inp.select();return;}
    return db('readwrite',function(s){return s.put(raw,SLUG);}).then(open);});}).catch(function(){btn.disabled=false;say('حدث خطأ، تحقّقي من الإنترنت وحاولي مرة أخرى',true);});});
document.getElementById('lkEye').addEventListener('click',function(){inp.type=inp.type==='password'?'text':'password';});

/* مفتاح محفوظ على الجهاز: نفتح مباشرة، إلا إن تغيّرت كلمة المرور */
db('readonly',function(s){return s.get(SLUG);}).then(function(raw){if(!raw){inp.focus();return;}
  return check(raw).then(function(ok){if(ok){var n=+(sessionStorage.getItem('lk:try')||0);if(n<2){sessionStorage.setItem('lk:try',n+1);open();}else{sessionStorage.removeItem('lk:try');say('تعذّر فتح المنصة تلقائيًا، أدخلي كلمة المرور مرة أخرى',true);}}
    else{db('readwrite',function(s){return s.delete(SLUG);});say('تغيّرت كلمة المرور، أدخلي الجديدة',true);}});}).catch(function(){inp.focus();});
})();
