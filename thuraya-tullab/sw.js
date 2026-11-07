/* عامل الخدمة: يجعل المنصة تعمل دون إنترنت بعد أول زيارة. ارفع رقم الإصدار عند تحديث الملفات. */
var V='talib-thuraya-v1';
var CORE=["./","index.html","manifest.webmanifest","icons/icon-192.png","icons/icon-512.png","icons/apple-touch-icon.png","icons/favicon-64.png","../design-system/tabshoura.css","../design-system/tabshoura.js","../darsi/darsi.css","../darsi/core.js","../darsi/portal.js","../darsi/img/boy.webp","../darsi/img/girl.webp"];
self.addEventListener('install',function(e){e.waitUntil(caches.open(V).then(function(c){return Promise.all(CORE.map(function(u){return c.add(u).catch(function(){});}));}).then(function(){return self.skipWaiting();}));});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k.indexOf('talib-thuraya-')===0&&k!==V;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener('fetch',function(e){var r=e.request;if(r.method!=='GET')return;var u=new URL(r.url);
  var fresh=u.origin===location.origin&&/(\/|\.html|\.js|\.css|\.webmanifest)$/.test(u.pathname);
  if(fresh){e.respondWith(fetch(r).then(function(res){var cp=res.clone();caches.open(V).then(function(c){c.put(r,cp);});return res;}).catch(function(){return caches.match(r,{ignoreSearch:true}).then(function(m){return m||caches.match('index.html');});}));return;}
  if(u.origin===location.origin||/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){
    e.respondWith(caches.match(r).then(function(m){return m||fetch(r).then(function(res){if(res.ok||res.type==='opaque'){var cp=res.clone();caches.open(V).then(function(c){c.put(r,cp);});}return res;});}));}
});
