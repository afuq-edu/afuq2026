/* عامل الخدمة: تعمل الواجهة دون إنترنت بعد أول زيارة. ارفعي رقم الإصدار عند تحديث الملفات. */
var V='najm-v3';
var CORE=['./','index.html','najm.css','najm.js','store.js','firebase-config.js','vendor/qrcode.js','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/apple-touch-icon.png','icons/favicon-64.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(V).then(function(c){return c.addAll(CORE);}).then(function(){return self.skipWaiting();}));});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k.indexOf('najm-')===0&&k!==V;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener('fetch',function(e){var r=e.request;if(r.method!=='GET')return;var u=new URL(r.url);
  var fresh=u.origin===location.origin&&/(\/|\.html|\.js|\.css|\.webmanifest)$/.test(u.pathname);
  if(fresh){e.respondWith(fetch(r,{cache:'no-cache'}).then(function(res){var cp=res.clone();caches.open(V).then(function(c){c.put(r,cp);});return res;}).catch(function(){return caches.match(r,{ignoreSearch:true}).then(function(m){return m||caches.match('index.html');});}));return;}
  /* الصور والخطوط ومكتبة Firebase: المحفوظ أولًا ثم الشبكة. طلبات قاعدة البيانات لا تمر من هنا */
  if(u.origin===location.origin||/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)||(u.hostname==='www.gstatic.com'&&u.pathname.indexOf('/firebasejs/')===0)){
    e.respondWith(caches.match(r).then(function(m){return m||fetch(r).then(function(res){if(res.ok||res.type==='opaque'){var cp=res.clone();caches.open(V).then(function(c){c.put(r,cp);});}return res;});}));}
});
