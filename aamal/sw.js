/* عامل الخدمة لـ«منصة الأعمال»: تعمل الواجهة دون إنترنت بعد أول زيارة. ارفعي رقم الإصدار عند تحديث الملفات. */
var V='aamal-v2';
var CORE=['./','index.html','app.css','gh.css','aamal.css','touches3.css','touches3.js','core.js','fx.js','sounds.js','safe-sync.js','app.js','touches.js','touches.css','touches2.js','touches2.css','manifest.webmanifest',
  'icons/icon-192.png','icons/icon-512.png','icons/apple-touch-icon.png','icons/favicon-64.png','media/brand/mark.png','media/brand/logo.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(V).then(function(c){return Promise.all(CORE.map(function(u){return c.add(u).catch(function(){});}));}).then(function(){return self.skipWaiting();}));});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return (k.indexOf('aamal-')===0||k.indexOf('khizana-')===0)&&k!==V;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener('fetch',function(e){var r=e.request;if(r.method!=='GET')return;var u=new URL(r.url);
  var fresh=u.origin===location.origin&&/(\/|\.html|\.js|\.css|\.webmanifest)$/.test(u.pathname);
  if(fresh){e.respondWith(fetch(r,{cache:'no-cache'}).then(function(res){var cp=res.clone();caches.open(V).then(function(c){c.put(r,cp);});return res;}).catch(function(){return caches.match(r,{ignoreSearch:true}).then(function(m){return m||caches.match('index.html');});}));return;}
  if(/firestore|googleapis\.com\/(identitytoolkit|securetoken)/.test(u.hostname+u.pathname))return;
  if(u.origin===location.origin||(/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)||/^\/firebasejs\//.test(u.pathname))){
    e.respondWith(caches.match(r,{ignoreSearch:true}).then(function(m){return m||fetch(r).then(function(res){if(res.ok||res.type==='opaque'){var cp=res.clone();caches.open(V).then(function(c){c.put(r,cp);});}return res;});}));}
});
