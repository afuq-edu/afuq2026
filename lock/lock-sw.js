/* =====================================================================
   قفل المنصات: عامل خدمة مشترك تستورده كل منصة مقفلة من sw.js الخاص بها:
     self.LOCK={slug:'suad',v:'suad-l1',pub:[...]};importScripts('../lock/lock-sw.js');
   ملفات المنصة منشورة مشفّرة (اسم الملف + .enc) بمفتاح AES-GCM مشتق من كلمة المرور.
   بعد أن تُدخل المعلمة كلمة المرور يُحفظ المفتاح على جهازها (IndexedDB) فيفك هذا العامل
   كل ملف عند طلبه، فتعمل المنصة كما هي دون أي تغيير في محركها، وتعمل دون إنترنت.
   النسخ المحفوظة للعمل دون إنترنت تبقى مشفّرة.
   ===================================================================== */
'use strict';
var L=self.LOCK,SCOPE=new URL(self.registration.scope),SP=SCOPE.pathname,PUB=L.pub||[];
var KEY=null,KEYP=null;
var TYPES={html:'text/html; charset=utf-8',js:'text/javascript; charset=utf-8',css:'text/css; charset=utf-8',json:'application/json; charset=utf-8',webmanifest:'application/manifest+json',
  svg:'image/svg+xml',png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',webp:'image/webp',gif:'image/gif',pdf:'application/pdf',mp3:'audio/mpeg',mp4:'video/mp4',
  xlsx:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',docx:'application/vnd.openxmlformats-officedocument.wordprocessingml.document',txt:'text/plain; charset=utf-8'};

function idbKey(){return new Promise(function(res){try{var r=indexedDB.open('afuq-lock',1);r.onupgradeneeded=function(){r.result.createObjectStore('keys');};
  r.onerror=function(){res(null);};r.onsuccess=function(){try{var g=r.result.transaction('keys').objectStore('keys').get(L.slug);g.onsuccess=function(){res(g.result||null);};g.onerror=function(){res(null);};}catch(e){res(null);}};}catch(e){res(null);}});}
function getKey(){if(KEY)return Promise.resolve(KEY);if(KEYP)return KEYP;
  KEYP=idbKey().then(function(raw){KEYP=null;if(!raw)return null;return crypto.subtle.importKey('raw',raw,'AES-GCM',false,['decrypt']).then(function(k){KEY=k;return k;});});return KEYP;}
self.addEventListener('message',function(e){if(e.data==='lock:key'){KEY=null;KEYP=null;}});

self.addEventListener('install',function(){self.skipWaiting();});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k.indexOf(L.slug+'-')===0&&k!==L.v;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});

function isCode(p){return /(\/|\.html|\.js|\.css|\.json|\.webmanifest)$/.test(p);}
/* الشبكة أولًا للصفحات والبرمجة، والمحفوظ أولًا للصور والملفات */
function grab(url,code){var req=new Request(url);
  if(code)return fetch(req,{cache:'no-cache'}).then(function(res){if(res.ok){var cp=res.clone();caches.open(L.v).then(function(c){c.put(req,cp);});}return res;}).catch(function(){return caches.match(req).then(function(m){return m||Response.error();});});
  return caches.match(req).then(function(m){return m||fetch(req).then(function(res){if(res.ok){var cp=res.clone();caches.open(L.v).then(function(c){c.put(req,cp);});}return res;});});}
function decrypt(res,key,type){if(!res.ok)return new Response('',{status:res.status});
  return res.arrayBuffer().then(function(b){return crypto.subtle.decrypt({name:'AES-GCM',iv:new Uint8Array(b,0,12)},key,new Uint8Array(b,12));})
    .then(function(plain){return new Response(plain,{status:200,headers:{'Content-Type':type,'Cache-Control':'no-store'}});});}
function shell(){return grab(SCOPE.href+'index.html',true);}

self.addEventListener('fetch',function(e){var r=e.request;if(r.method!=='GET')return;var u=new URL(r.url);
  if(u.origin===SCOPE.origin){
    var inScope=u.pathname.indexOf(SP)===0,rel=inScope?decodeURIComponent(u.pathname.slice(SP.length)):null;
    if(inScope&&(rel===''||/\/$/.test(rel)))rel+='index.html';
    if(inScope&&PUB.indexOf(rel)<0&&!/^icons\//.test(rel)){
      var ext=(rel.split('.').pop()||'').toLowerCase(),type=TYPES[ext]||'application/octet-stream';
      e.respondWith(getKey().then(function(key){
        if(!key)return rel==='index.html'?shell():new Response('',{status:403});
        return grab(SCOPE.origin+SP+encodeURI(rel)+'.enc',isCode(rel)).then(function(res){return decrypt(res,key,type);})
          /* مفتاح قديم (تغيّرت كلمة المرور): نعيد صفحة القفل */
          .catch(function(){KEY=null;return rel==='index.html'?shell():new Response('',{status:403});});}));
      return;}
    e.respondWith(grab(r.url,isCode(u.pathname)));return;}
  if(/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname))e.respondWith(caches.match(r).then(function(m){return m||fetch(r).then(function(res){if(res.ok||res.type==='opaque'){var cp=res.clone();caches.open(L.v).then(function(c){c.put(r,cp);});}return res;});}));
});
