/* =====================================================================
   منصّة · محرك قالب منصات المعلمين والمعلمات (v1.0)
   - يقرأ محتوى المنصة من window.PLATFORM (ملف content.js لكل منصة)
   - يعرض الأقسام والبنود، ويتيح إضافة الأقسام والبنود وتعديلها وحذفها
   - يحفظ التعديلات على الجهاز (IndexedDB) مع تصدير/استيراد نسخة
   - تفاعل باللمس والمؤشر، أصوات هادئة، عارض صور، تنصيب كتطبيق (PWA)
   يعتمد على نظام «طبشورة» (window.TB)
   ===================================================================== */
(function(){
'use strict';
var TB=window.TB, I=TB.I, DEF=window.PLATFORM, root=document.documentElement;
var RMQ=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var FINE=window.matchMedia&&matchMedia('(hover:hover) and (pointer:fine)').matches;
var KEY='pf:'+DEF.id, S=null, EDIT=false;
/* ثيمات المنصة الخاصة تُسجَّل فورًا قبل أن يطبّق «طبشورة» المظهر */
if(DEF.skins)Object.keys(DEF.skins).forEach(function(k){TB.addSkin(k,DEF.skins[k]);});

/* ---------- أيقونات إضافية ---------- */
function ic(d){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+d+'</svg>';}
var X={
  eye:ic('<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
  target:ic('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>'),
  image:ic('<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/>'),
  album:ic('<rect x="6" y="3" width="15" height="15" rx="3"/><path d="M3 7v11a3 3 0 0 0 3 3h11"/><circle cx="11" cy="8.5" r="1.5"/><path d="m21 14-4-4-6 6"/>'),
  text:ic('<path d="M4 6h16M4 12h16M4 18h10"/>'),
  list:ic('<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>'),
  link:ic('<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'),
  file:ic('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>'),
  download:ic('<path d="M12 4v11m0 0-4-4m4 4 4-4"/><path d="M5 19h14"/>'),
  trash:ic('<path d="M4 7h16M10 11v6M14 11v6"/><path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/>'),
  up:ic('<path d="m6 15 6-6 6 6"/>'),
  down:ic('<path d="m6 9 6 6 6-6"/>'),
  zoom:ic('<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4M11 8v6M8 11h6"/>'),
  sound:ic('<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>'),
  mute:ic('<path d="M4 9v6h4l5 4V5L8 9z"/><path d="m17 9 5 6M22 9l-5 6"/>'),
  more:ic('<circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/>'),
  install:ic('<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M12 7v7m0 0-3-3m3 3 3-3M10 18h4"/>'),
  share:ic('<path d="M12 3v12M8 7l4-4 4 4"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/>'),
  school:ic('<path d="M3 10 12 4l9 6-9 6z"/><path d="M7 12.5V17c0 1.5 2.2 3 5 3s5-1.5 5-3v-4.5"/>'),
  visit:ic('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m16 11 2 2 4-4"/>'),
  growth:ic('<path d="M3 20h18"/><path d="M6 16v-3M11 16V9M16 16V5"/><path d="m4 9 5-4 4 3 7-5"/>'),
  spell:ic('<path d="M4 18 8.5 6 13 18M5.7 14h5.6"/><path d="M15 9h3.5a2.5 2.5 0 0 1 0 5H15zM15 14h4a2.5 2.5 0 0 1 0 5h-4z"/>'),
  read:ic('<path d="M2 5h6a4 4 0 0 1 4 4v11a3 3 0 0 0-3-3H2zM22 5h-6a4 4 0 0 0-4 4v11a3 3 0 0 1 3-3h7z"/>'),
  write:ic('<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>'),
  folder:ic('<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>'),
  save:ic('<path d="M5 3h11l5 5v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M7 3v5h8M7 21v-7h10v7"/>'),
  table:ic('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M3 15h18M9 4v16"/>'),
  sparkle:ic('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>'),
  pin:ic('<path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>'),
  sunrise:ic('<path d="M17 18a5 5 0 0 0-10 0M12 2v7M4.2 10.2l1.4 1.4M1 18h2M21 18h2M18.4 11.6l1.4-1.4M23 22H1M8 6l4-4 4 4"/>'),
  sunset:ic('<path d="M17 18a5 5 0 0 0-10 0M12 9V2M4.2 10.2l1.4 1.4M1 18h2M21 18h2M18.4 11.6l1.4-1.4M23 22H1M16 5l-4 4-4-4"/>')
};
function G(n){return X[n]||I[n]||I.book;}
var ICONS=['book','read','write','spell','lang','user','users','school','visit','growth','chart','task','cal','clock','award','star','heart','spark','bolt','eye','target','globe','flask','calc','atom','pencil','chalk','plane','msg','bell','image','album','folder','file','link','table','pin','quran','home'];
var COLORS=[['accent','اللون الأساسي'],['c1','لون 1'],['c2','لون 2'],['gold','ذهبي']];

/* ---------- أدوات ---------- */
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function uid(p){return (p||'i')+Date.now().toString(36)+Math.random().toString(36).slice(2,6);}
function clone(o){return JSON.parse(JSON.stringify(o));}
function $(s,el){return (el||document).querySelector(s);}
function $$(s,el){return Array.prototype.slice.call((el||document).querySelectorAll(s));}
function arNum(n){return String(n);}
function hasText(s){return s!=null&&String(s).trim()!=='';}

/* ---------- التخزين على الجهاز (IndexedDB مع بديل localStorage) ---------- */
var DB=(function(){var dbp=null;
  function open(){if(dbp)return dbp;dbp=new Promise(function(res,rej){if(!window.indexedDB)return rej();var r=indexedDB.open('manassa',1);
    r.onupgradeneeded=function(){r.result.createObjectStore('kv');};r.onsuccess=function(){res(r.result);};r.onerror=function(){rej(r.error);};});return dbp;}
  function tx(mode,fn){return open().then(function(db){return new Promise(function(res,rej){var t=db.transaction('kv',mode),st=t.objectStore('kv'),q=fn(st);t.oncomplete=function(){res(q&&q.result);};t.onerror=function(){rej(t.error);};});});}
  return{get:function(k){return tx('readonly',function(s){return s.get(k);}).catch(function(){try{return JSON.parse(localStorage.getItem(k));}catch(e){return null;}});},
    set:function(k,v){return tx('readwrite',function(s){return s.put(v,k);}).catch(function(){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}});},
    del:function(k){return tx('readwrite',function(s){return s.delete(k);}).catch(function(){try{localStorage.removeItem(k);}catch(e){}});}};
})();
/* ---------- الحفظ السحابي (Supabase): يرى الزوار ما تحفظه المعلمة ---------- */
var CL=DEF.cloud||null,PIN=null;
try{PIN=localStorage.getItem('pf:pin:'+DEF.id)||sessionStorage.getItem('pf:pin:'+DEF.id);}catch(e){}
function api(path,opt){opt=opt||{};var h={apikey:CL.key,Authorization:'Bearer '+CL.key};if(!(opt.body instanceof FormData))h['Content-Type']='application/json';
  return fetch(CL.url+path,Object.assign({},opt,{headers:Object.assign(h,opt.headers||{})}));}
function rpc(fn,args){return api('/rest/v1/rpc/'+fn,{method:'POST',body:JSON.stringify(args)}).then(function(r){return r.json().catch(function(){return null;}).then(function(j){if(!r.ok)throw (j||{message:'http '+r.status});return j;});});}
function cloudLoad(){return api('/rest/v1/pf_platforms?slug=eq.'+encodeURIComponent(CL.slug)+'&select=state,updated_at',{cache:'no-store'}).then(function(r){return r.ok?r.json():[];}).then(function(a){return a&&a[0]||null;}).catch(function(){return null;});}
function sync(st,msg){var el=$('.pf-sync');if(!el)return;el.dataset.st=st;el.innerHTML=(st==='ok'?I.check:st==='err'?I.x:I.clock)+'<span>'+esc(msg)+'</span>';}
var cloudT,cloudBusy=false,cloudAgain=false;
function cloudSave(){if(!CL||!PIN)return;clearTimeout(cloudT);sync('wait','جارٍ الحفظ…');cloudT=setTimeout(function push(){
  if(cloudBusy){cloudAgain=true;return;}cloudBusy=true;
  rpc('pf_save',{p_slug:CL.slug,p_pin:PIN,p_state:S}).then(function(t){S.cloudAt=t;DB.set(KEY,S);sync('ok','محفوظ ويراه الجميع');})
  .catch(function(e){var m=(e&&(e.message||e.hint))||'';sync('err',/bad pin|locked/.test(m)?'الرمز غير صحيح':'لم يُحفظ، تحقّقي من الإنترنت');if(/bad pin/.test(m)){forgetPin();}})
  .then(function(){cloudBusy=false;if(cloudAgain){cloudAgain=false;push();}});},700);}
function forgetPin(){PIN=null;try{localStorage.removeItem('pf:pin:'+DEF.id);sessionStorage.removeItem('pf:pin:'+DEF.id);}catch(e){}}
/* رفع صورة أو ملف إلى مخزن المنصة، ويعيد الرابط العام */
function dataURLtoBlob(u){var a=u.split(','),m=/:(.*?);/.exec(a[0])[1],b=atob(a[1]),n=b.length,x=new Uint8Array(n);while(n--)x[n]=b.charCodeAt(n);return new Blob([x],{type:m});}
function upload(src,name){if(!CL||!PIN)return Promise.resolve(src);var blob=typeof src==='string'?(src.indexOf('data:')===0?dataURLtoBlob(src):null):src;if(!blob)return Promise.resolve(src);
  var fd=new FormData();fd.append('slug',CL.slug);fd.append('pin',PIN);fd.append('file',blob,name||(blob.type==='image/jpeg'?'image.jpg':'file'));
  return api('/functions/v1/pf-upload',{method:'POST',body:fd}).then(function(r){return r.json().then(function(j){if(!r.ok||!j.url)throw j;return j.url;});});}

var saveT;
function persist(){clearTimeout(saveT);saveT=setTimeout(function(){S.base=DEF.version;S.saved=Date.now();DB.set(KEY,S);},250);cloudSave();}

/* دمج المحتوى الأصلي الأحدث مع تعديلات المعلمة */
function merge(saved){
  if(!saved||!saved.sections)return clone(DEF);
  if(saved.base===DEF.version)return saved;
  var del=saved.deleted||[],have={};saved.sections.forEach(function(s){have[s.id]=s;});
  DEF.sections.forEach(function(ds,di0){
    if(del.indexOf(ds.id)>-1)return;
    var s=have[ds.id];
    if(!s){saved.sections.splice(Math.min(di0,saved.sections.length),0,clone(ds));return;}
    var ih={};s.items.forEach(function(it){ih[it.id]=it;});
    ds.items.forEach(function(di){var it=ih[di.id];
      if(!it){if(del.indexOf(di.id)<0)s.items.push(clone(di));return;}
      Object.keys(di).forEach(function(k){if(!(k in it))it[k]=clone(di[k]);}); // خصائص جديدة في القالب
    });
  });
  // حقول يفرض المحتوى الأصلي تحديثها (تصحيح معلومة مثلًا)
  if(DEF.force&&DEF.force.teacher&&saved.teacher)DEF.force.teacher.forEach(function(k){saved.teacher[k]=clone(DEF.teacher[k]);});
  return saved;
}

/* ---------- الأصوات الهادئة (Web Audio، بلا ملفات) ---------- */
var SND=(function(){
  /* أصوات تفاعل هادئة بلا نغمات موسيقية: نقرات خفيفة، فرقعة ناعمة، حفيف ورق، نسمة هواء */
  var ctx=null,out=null,noise=null,on=true,lastHover=0,pack='drop';
  try{on=localStorage.getItem('pf:sound')!=='off';pack=localStorage.getItem('pf:pack')||'drop';}catch(e){}
  function init(){if(ctx||!on)return;var AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;ctx=new AC();
    out=ctx.createGain();out.gain.value=.9;out.connect(ctx.destination);
    noise=ctx.createBuffer(1,ctx.sampleRate,ctx.sampleRate);var d=noise.getChannelData(0);for(var i=0;i<d.length;i++)d[i]=Math.random()*2-1;}
  function ok(){if(!on)return false;init();if(!ctx)return false;if(ctx.state==='suspended')ctx.resume();return true;}
  function rnd(a,b){return a+Math.random()*(b-a);}
  /* دفقة ضجيج مُرشَّحة: type نوع المرشّح، f0→f1 تردده، dur المدة، vol الشدة */
  function hiss(t0,dur,vol,type,f0,f1,q){var s=ctx.createBufferSource(),fl=ctx.createBiquadFilter(),g=ctx.createGain();s.buffer=noise;fl.type=type;fl.Q.value=q||.8;
    fl.frequency.setValueAtTime(f0,t0);if(f1)fl.frequency.exponentialRampToValueAtTime(f1,t0+dur);
    g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(vol,t0+Math.min(.01,dur/4));g.gain.exponentialRampToValueAtTime(.0001,t0+dur);
    s.connect(fl);fl.connect(g);g.connect(out);s.start(t0,Math.random()*.5);s.stop(t0+dur+.05);}
  /* فرقعة ناعمة: نبضة منخفضة سريعة الهبوط، تُسمع كلمسة لا كنغمة */
  function thump(t0,f0,f1,dur,vol){var o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(f0,t0);o.frequency.exponentialRampToValueAtTime(f1,t0+dur);
    g.gain.setValueAtTime(vol,t0);g.gain.exponentialRampToValueAtTime(.0001,t0+dur);o.connect(g);g.connect(out);o.start(t0);o.stop(t0+dur+.02);}
  /* نقرة صافية قصيرة جدًا بتردد ينزلق: تُسمع كقطرة أو فقاعة لا كنغمة */
  function blip(t0,f0,f1,dur,vol,type){var o=ctx.createOscillator(),g=ctx.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f0,t0);o.frequency.exponentialRampToValueAtTime(f1,t0+dur*.8);
    g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(vol,t0+.004);g.gain.exponentialRampToValueAtTime(.0001,t0+dur);o.connect(g);g.connect(out);o.start(t0);o.stop(t0+dur+.02);}
  /* حزم أصوات اللمس (تختارها المعلمة من الضبط) */
  var PACKS={
    drop:{n:'قطرة ماء',tap:function(t){var f=rnd(500,650);blip(t,f,f*2.6,.11,.16);blip(t+.006,f*1.9,f*3.2,.05,.04);},hover:function(t){blip(t,rnd(1200,1500),rnd(2200,2600),.04,.025);}},
    bubble:{n:'فقاعة',tap:function(t){var f=rnd(260,340);blip(t,f,f*3,.09,.17);hiss(t,.03,.025,'highpass',4000);},hover:function(t){blip(t,rnd(700,900),rnd(1600,1900),.035,.02);}},
    glass:{n:'زجاج',tap:function(t){blip(t,rnd(3000,3400),2800,.06,.06);blip(t,rnd(4400,4800),4200,.04,.03);},hover:function(t){blip(t,rnd(5200,5600),5000,.025,.012);}},
    wood:{n:'خشب',tap:function(t){hiss(t,.035,.12,'bandpass',rnd(900,1200),0,3);blip(t,rnd(320,380),220,.06,.12,'triangle');},hover:function(t){hiss(t,.02,.03,'bandpass',rnd(1600,2000),0,4);}},
    soft:{n:'لمسة ناعمة',tap:function(t){blip(t,rnd(170,200),90,.08,.2);hiss(t,.05,.02,'lowpass',1500);},hover:function(t){hiss(t,.03,.012,'lowpass',1800);}},
    breeze:{n:'نسمة',tap:function(t){hiss(t,.16,.07,'bandpass',500,2200,.9);},hover:function(t){hiss(t,.06,.015,'bandpass',1800,3200,1);}}
  };
  return{
    PACKS:PACKS,
    get pack(){return pack;},
    setPack:function(k){if(!PACKS[k])return;pack=k;try{localStorage.setItem('pf:pack',k);}catch(e){}if(!on){on=true;try{localStorage.setItem('pf:sound','on');}catch(e){}}this.tap();},
    get on(){return on;},
    toggle:function(){on=!on;try{localStorage.setItem('pf:sound',on?'on':'off');}catch(e){}if(on){init();this.tap();}return on;},
    unlock:function(){if(on){init();if(ctx&&ctx.state==='suspended')ctx.resume();}},
    tap:function(){if(!ok())return;(PACKS[pack]||PACKS.drop).tap(ctx.currentTime);},
    hover:function(){if(!ok())return;var n=performance.now();if(n-lastHover<110)return;lastHover=n;(PACKS[pack]||PACKS.drop).hover(ctx.currentTime);},
    chime:function(){if(!ok())return;var t=ctx.currentTime;hiss(t,.35,.05,'bandpass',600,3000,.9);thump(t+.05,160,70,.1,.07);},
    open:function(){if(!ok())return;var t=ctx.currentTime;hiss(t,.42,.06,'bandpass',350,2600,1);},
    page:function(){if(!ok())return;var t=ctx.currentTime;hiss(t,.18,.05,'bandpass',2600,900,.7);hiss(t+.05,.12,.03,'highpass',3500);},
    remove:function(){if(!ok())return;var t=ctx.currentTime;hiss(t,.28,.06,'lowpass',2400,300,.7);thump(t+.02,140,45,.14,.12);},
    success:function(){if(!ok())return;var t=ctx.currentTime;thump(t,220,80,.08,.1);[0,.07,.14].forEach(function(d){hiss(t+d,.06,.04,'highpass',rnd(6000,8000));});}
  };
})();

/* ---------- الرسم: البنود ---------- */
function figure(src,title,caption,list,idx){
  return '<figure class="pf-fig"><div class="frame" data-lb="'+esc(list)+'" data-i="'+(idx||0)+'"><img src="'+esc(src)+'" alt="'+esc(title||caption||'')+'" loading="lazy" decoding="async"><span class="zoom">'+X.zoom+'</span></div>'+
    ((hasText(title)||hasText(caption))?'<figcaption><span>'+(hasText(title)?'<b>'+esc(title)+'</b>':'')+(hasText(caption)?esc(caption):'')+'</span></figcaption>':'')+'</figure>';}
function head(it,icon){return hasText(it.title)?'<h3 class="it-h">'+G(it.icon||icon)+esc(it.title)+'</h3>':'';}
function av(name){var n=String(name||'').replace(/^(أ\.|T\.)\s*/,'').trim();return n?n[0]:'·';}

var R={
  text:function(it){if(!hasText(it.body)&&!EDIT)return null;
    return head(it,'text')+(hasText(it.body)?'<p class="pf-text">'+esc(it.body)+'</p>':'<div class="pf-placeholder" data-do="edit">'+I.pencil+(esc(it.placeholder)||'اكتبي النص هنا')+'</div>');},
  vision:function(it){if(!hasText(it.body)){if(!EDIT)return null;return '<div class="pf-placeholder" data-do="edit">'+G(it.icon||'eye')+'<span>'+esc(it.placeholder||('أضيفي '+(it.title||'الرؤية')))+'</span><small style="font-weight:500;color:var(--muted)">اضغطي هنا للكتابة</small></div>';}
    return {cls:'pf-vision'+(it.tone==='c2'?' c2':''),html:'<span class="badge">'+G(it.icon||'eye')+esc(it.title||'الرؤية')+'</span><p class="q">'+esc(it.body)+'</p>'};},
  image:function(it){if(!it.src)return null;return figure(it.src,it.title,it.caption,'it:'+it.id,0);},
  album:function(it){var imgs=it.images||[];if(!imgs.length&&!it.file)return null;
    var first=imgs[it.cover||0]||imgs[0],h=head(it,'album');
    var big=first?figure(first.src,first.title||'',first.caption||it.caption||'','it:'+it.id,it.cover||0):'';
    var strip=imgs.length>1?'<div class="strip">'+imgs.map(function(im,i){return '<button type="button" class="'+(it.land?'land':'')+'" data-lb="it:'+esc(it.id)+'" data-i="'+i+'" aria-label="'+esc(im.caption||('صفحة '+(i+1)))+'"><img src="'+esc(im.thumb||im.src)+'" alt="" loading="lazy" decoding="async"><span>'+esc(im.short||im.caption||('صفحة '+(i+1)))+'</span></button>';}).join('')+'</div>':'';
    var acts='<div class="acts">'+(imgs.length>1?'<button class="btn soft sm" data-lb="it:'+esc(it.id)+'" data-i="0">'+X.album+'تصفّح '+imgs.length+' صفحات</button>':'')+(it.file?'<a class="btn ghost sm" href="'+esc(it.file)+'" download target="_blank" rel="noopener">'+X.download+'تحميل الملف</a>':'')+'</div>';
    return {cls:'pf-album stack',html:h+big+strip+acts};},
  list:function(it){var a=(it.items||[]).filter(hasText);if(!a.length)return null;return head(it,'list')+'<ul class="pf-list">'+a.map(function(x){return '<li><span>'+esc(x)+'</span></li>';}).join('')+'</ul>';},
  link:function(it){if(!it.url)return null;return {cls:'pf-link-wrap',html:'<a class="pf-link" href="'+esc(it.url)+'" target="_blank" rel="noopener"><span class="li">'+X.link+'</span><span class="grow"><b>'+esc(it.title||it.url)+'</b><small>'+esc(it.desc||it.url)+'</small></span>'+I.next+'</a>'};},
  file:function(it){return {cls:'pf-link-wrap',html:'<a class="pf-link" '+(it.url?'href="'+esc(it.url)+'" target="_blank" rel="noopener" download':'href="#" data-file="'+esc(it.fileKey||'')+'" data-name="'+esc(it.name||'')+'"')+'><span class="li">'+X.file+'</span><span class="grow"><b>'+esc(it.title||it.name||'ملف')+'</b><small>'+esc(it.desc||it.name||'')+'</small></span>'+X.download+'</a>'};},
  stats:function(it){return head(it,'chart')+'<div class="pf-stats">'+(it.items||[]).map(function(s){var v=s.from?String(computeFrom(s.from)):s.v;return '<div class="pf-stat tile">'+G(s.ic||'star')+'<b data-count="'+esc(v)+'">'+esc(v)+'</b><small>'+esc(s.l)+'</small></div>';}).join('')+'</div>';},
  cards:function(it){return head(it,'users')+'<div class="pf-cards" style="--min:'+(it.min||230)+'px">'+(it.items||[]).map(function(c,i){var cc=['c1','c2','gold'][i%3];
      return '<div class="pf-c tile pf-tilt pf-glow'+(c.me?' me':'')+'"><div class="top"><span class="avatar '+(c.me?'gold':(i%2?'c2':''))+'">'+esc(c.av||av(c.t))+'</span><div><b>'+esc(c.t)+'</b>'+(hasText(c.s)?'<div class="s">'+esc(c.s)+'</div>':'')+'</div></div>'+
      (c.chips&&c.chips.length?'<div class="chips">'+c.chips.map(function(x){return '<span class="chip">'+esc(x)+'</span>';}).join('')+'</div>':'')+
      (hasText(c.badge)?'<span class="num-badge">'+esc(c.badge)+'<small>'+esc(c.badgeL||'')+'</small></span>':'')+'</div>';}).join('')+'</div>';},
  timeline:function(it){return head(it,'cal')+(it.filters?'<div class="chips" style="margin-bottom:12px">'+it.filters.map(function(f,i){return '<button class="cb" data-tlf="'+esc(f[0])+'" aria-pressed="'+(i===0)+'">'+esc(f[1])+'</button>';}).join('')+'</div>':'')+'<ol class="pf-tl">'+(it.items||[]).map(function(x){
      var cls=(x.done?'done ':'')+(x.mine?'mine':'');
      return '<li class="'+cls+'" data-cat="'+esc((x.cat||'')+(x.mine?' mine':'')+(x.done?' done':'')+' all')+'"><span class="dot"></span><div class="body tile pf-glow"><div class="row1"><span class="date">'+esc(x.date)+'</span>'+'<button type="button" class="pf-tdone chip '+(x.done?'good':(x.iso&&new Date(x.iso)<new Date()?'warn':''))+'" data-tdone="'+(it.items||[]).indexOf(x)+'" title="اضغطي لتغيير الحالة">'+(x.done?I.check+'نُفّذ':(x.iso&&new Date(x.iso)<new Date()?I.clock+'بانتظار التنفيذ':I.cal+'قادم'))+'</button>'+(x.mine?'<span class="chip gold">'+I.star+'المعلم الأول</span>':'')+'</div>'+
        (hasText(x.en)?'<div class="en">'+esc(x.en)+'</div>':'')+(hasText(x.s)?'<div class="s">'+esc(x.s)+'</div>':'')+(x.chips?'<div class="m">'+x.chips.map(function(c){return '<span class="chip c2">'+esc(c)+'</span>';}).join('')+'</div>':'')+'</div></li>';}).join('')+'</ol>';},
  bars:function(it){return head(it,'chart')+'<div class="pf-bars">'+(it.items||[]).map(function(b){return '<div class="pf-bar"><span class="l">'+esc(b.l)+(hasText(b.sub)?'<small>'+esc(b.sub)+'</small>':'')+'</span><span class="t"><i style="--v:'+Math.max(0,Math.min(100,+b.v))+'%;'+(b.c?'--bc:var(--'+esc(b.c)+')':'')+'"></i></span><span class="v">'+esc(b.vl||(Math.round(b.v)+'%'))+'</span></div>';}).join('')+'</div>'+(hasText(it.note)?'<p class="note" style="margin-top:12px">'+esc(it.note)+'</p>':'');},
  table:function(it){var ltr=it.ltr||[],tg=it.toggle||[],okv=it.okv||'منجزة',nov=it.nov||'غير منجزة';
    return head(it,'table')+'<div class="tbl-wrap"><table class="tbl pf-tbl"><thead><tr>'+(it.head||[]).map(function(h){return '<th>'+esc(h)+'</th>';}).join('')+(EDIT?'<th></th>':'')+'</tr></thead><tbody>'+(it.rows||[]).map(function(r,ri){return '<tr>'+r.map(function(c,i){
      if(tg.indexOf(i)>-1){if(typeof c==='boolean')return '<td><button type="button" class="pf-dotb" data-tg="'+ri+','+i+'" aria-pressed="'+c+'" aria-label="تبديل"><span class="dotc'+(c?'':' off')+'"></span></button></td>';
        var ok=c===okv;return '<td><button type="button" class="pf-st '+(ok?'ok':'no')+'" data-tg="'+ri+','+i+'" title="اضغطي للتبديل">'+(ok?I.check+esc(okv):I.clock+esc(nov))+'</button></td>';}
      if(c===true)return '<td><span class="dotc"></span></td>';if(c===false)return '<td><span class="dotc off"></span></td>';
      return '<td data-c="'+ri+','+i+'"'+(ltr.indexOf(i)>-1?' class="ltr"':'')+(EDIT?' contenteditable="true"':'')+'>'+esc(c)+'</td>';}).join('')+
      (EDIT?'<td><button type="button" class="pf-mini danger" data-rowdel="'+ri+'" title="حذف الصف">'+I.x+'</button></td>':'')+'</tr>';}).join('')+'</tbody></table></div>'+
      (EDIT?'<button type="button" class="btn soft sm" data-rowadd style="margin-top:10px">'+I.plus+'إضافة صف</button>':'')+
      (hasText(it.note)?'<p class="note" style="margin-top:10px">'+esc(it.note)+'</p>':'');},
  projects:function(it){return head(it,'award')+'<div class="pf-cards" style="--min:250px">'+(it.items||[]).map(function(p){return '<div class="pf-proj tile pf-tilt pf-glow" style="--pc:var(--'+esc(p.c||'accent')+')"><span class="art"></span><span class="pi">'+G(p.ic||'book')+'</span><h3>'+esc(p.name)+'</h3>'+(hasText(p.desc)?'<p class="sub" style="margin:0">'+esc(p.desc)+'</p>':'')+'<div class="grades">'+(p.grades||[]).map(function(g){return '<span class="chip">'+esc(g)+'</span>';}).join('')+'</div></div>';}).join('')+'</div>';}
  ,
  goals:function(it){var td=today(),gs=it.items||[],doms=[],all=0,dn=0;
    gs.forEach(function(g){if(g.dom&&doms.indexOf(g.dom)<0)doms.push(g.dom);(g.acts||[]).forEach(function(a){all++;if(a.done)dn++;});});
    var pct=all?Math.round(dn/all*100):0,gf=GF[it.id]||'';
    return head(it,'target')+'<div class="pf-gsum"><div class="grow"><b>'+dn+' من '+all+' نشاطًا منجزًا</b><small>اضغطي الهدف لعرض أنشطته، ثم علّمي النشاط عند إنجازه، أو أضيفيه إلى مهام اليوم.</small><div class="pf-gbar"><i style="--v:'+pct+'%"></i></div></div><span class="ring" style="--p:'+pct+'%;--sz:68px"><b>'+pct+'%</b></span></div>'+
      (doms.length>1?'<div class="chips pf-gf"><button type="button" class="cb" data-gf="" aria-pressed="'+!gf+'">الكل</button>'+doms.map(function(d){return '<button type="button" class="cb" data-gf="'+esc(d)+'" aria-pressed="'+(gf===d)+'">'+esc(d)+'</button>';}).join('')+'</div>':'')+
      '<div class="pf-goals">'+gs.map(function(g,gi){return goalHTML(it,g,gi,td,gf);}).join('')+'</div>'+
      (EDIT?'<button type="button" class="btn soft sm" data-gnew style="margin-top:12px">'+I.plus+'إضافة هدف</button>':'');},
  planner:function(it){var td=today(),list=planToday(it,td),done=list.filter(function(t){return planDone(t,td);}).length,tot=list.length,pct=tot?Math.round(done/tot*100):0;
    var d=new Date(),dl=d.toLocaleDateString('ar-OM',{weekday:'long',day:'numeric',month:'long'});
    var sug=planSuggest(it,td);
    var perm=('Notification' in window)?Notification.permission:'na';
    return '<div class="pf-plan">'+
      '<div class="ph"><div class="grow"><span class="eyebrow">'+esc(dl)+'</span><h3 class="h">'+(tot&&done===tot?'أحسنتِ! أنجزتِ كل مهام اليوم':tot?'باقي '+(tot-done)+' من '+tot+' مهام اليوم':'لا مهام لليوم بعد')+'</h3></div>'+
        '<span class="ring" style="--p:'+pct+'%;--sz:74px"><b>'+done+'/'+tot+'</b></span></div>'+
      '<form class="pf-plan-add" data-plform><input class="input" name="t" placeholder="اكتبي مهمة جديدة…" required><input class="input" name="at" type="time" aria-label="وقت التذكير"><select class="select" name="rep" aria-label="التكرار"><option value="">اليوم فقط</option><option value="weekdays">أيام الدوام</option><option value="daily">كل يوم</option><option value="week">كل أسبوع في هذا اليوم</option></select><button class="btn" type="submit">'+I.plus+'إضافة</button></form>'+
      (tot?'<ul class="pf-tasks">'+list.map(function(t){var dn=planDone(t,td),late=!t.rep&&t.date<td;
        return '<li class="'+(dn?'done':'')+(late?' late':'')+'"><button type="button" class="pf-chk" data-pl="tog" data-t="'+esc(t.id)+'" aria-pressed="'+dn+'" aria-label="إنجاز">'+I.check+'</button><span class="tt">'+esc(t.t)+'</span>'+
          (t.at?'<span class="chip">'+I.clock+esc(t.at)+'</span>':'')+(t.rep?'<span class="chip c2">'+repL(t.rep)+'</span>':'')+(late?'<span class="chip warn">متأخرة</span>':'')+
          '<button type="button" class="pf-mini danger" data-pl="del" data-t="'+esc(t.id)+'" aria-label="حذف">'+I.x+'</button></li>';}).join('')+'</ul>':'<div class="empty" style="padding:14px">'+I.task+'<span>أضيفي مهمة، أو اختاري من المهام المقترحة.</span></div>')+
      (sug.length?'<div class="pf-sug"><b>'+I.spark+'مهام مقترحة لكِ</b><div class="list">'+sug.map(function(x,k){return '<button type="button" class="pf-sug-b" data-pl="sug" data-k="'+k+'">'+I.plus+'<span>'+esc(x.t)+'</span>'+(x.at?'<small>'+esc(x.at)+'</small>':'')+'</button>';}).join('')+'</div></div>':'')+
      (perm==='na'?'':'<div class="pf-plan-n">'+(perm==='granted'?'<span class="chip good">'+I.bell+'التذكير بالتنبيهات مفعّل</span>':'<button type="button" class="btn soft sm" data-pl="notify">'+I.bell+'فعّلي التذكير بالتنبيهات</button>')+'<small class="note">يصلك التذكير في وقت المهمة والمنصة مفتوحة أو منصّبة على جهازك.</small></div>')+
    '</div>';},
};
/* أنواع بنود إضافية تعرّفها المنصة في ملف خاص بها (window.PF_TYPES)، ولكل نوع دالة رسم واختياريًا count(it,f) للإحصاءات */
if(window.PF_TYPES)Object.keys(window.PF_TYPES).forEach(function(k){R[k]=window.PF_TYPES[k];});
/* ---------- خطة المادة: أدوات ---------- */
var GF={},GOPEN={};
function fmtD(iso){if(!iso)return '';var d=new Date(iso+'T00:00');return isNaN(d)?iso:d.toLocaleDateString('ar-OM',{day:'numeric',month:'short',year:'numeric'});}
function goalProg(g){var a=g.acts||[],d=a.filter(function(x){return x.done;}).length;return {d:d,n:a.length,p:a.length?Math.round(d/a.length*100):0};}
function goalTime(g){var f=new Date(g.from+'T00:00'),t=new Date(g.to+'T23:59'),n=Date.now();if(isNaN(f)||isNaN(t)||t<=f)return 0;return Math.max(0,Math.min(100,Math.round((n-f)/(t-f)*100)));}
function goalState(g,td){var pr=goalProg(g);if(pr.n&&pr.d===pr.n)return ['good','مكتمل'];if(g.from&&td<g.from)return ['','يبدأ '+fmtD(g.from)];if(g.to&&td>g.to)return ['warn','انتهت مدته'];
  return pr.p+20<goalTime(g)?['warn','يحتاج متابعة']:['c2','جارٍ التنفيذ'];}
function goalHTML(it,g,gi,td,gf){var pr=goalProg(g),st=goalState(g,td),tp=goalTime(g),acts=g.acts||[],hid=gf&&g.dom!==gf?' hidden':'';
  var top='<span class="num">'+(gi+1)+'</span><div class="grow"><div class="m"><span class="chip"'+(EDIT?' contenteditable data-gg="'+gi+',dom"':'')+'>'+esc(g.dom||'المجال')+'</span>'+(EDIT?'':'<span class="chip '+st[0]+'">'+esc(st[1])+'</span>')+
    (EDIT?'<input class="input" type="date" data-gd="'+gi+',from" value="'+esc(g.from||'')+'" aria-label="من"><input class="input" type="date" data-gd="'+gi+',to" value="'+esc(g.to||'')+'" aria-label="إلى">':'<span class="dates">'+I.cal+esc(fmtD(g.from))+' – '+esc(fmtD(g.to))+'</span>')+'</div>'+
    '<p class="gt"'+(EDIT?' contenteditable data-gg="'+gi+',goal"':'')+'>'+esc(g.goal)+'</p><div class="pf-gbar sm" title="الإنجاز '+pr.p+'% · الوقت المنقضي '+tp+'%"><i style="--v:'+pr.p+'%"></i>'+(tp>0&&tp<100?'<u style="--t:'+tp+'%"></u>':'')+'</div></div>'+
    '<span class="pc"><b>'+pr.d+'/'+pr.n+'</b><small>نشاط</small></span>';
  var body='<ol class="pf-acts">'+acts.map(function(a,ai){return '<li class="'+(a.done?'done':'')+'"><button type="button" class="pf-chk" data-ga="'+gi+','+ai+'" aria-pressed="'+!!a.done+'" aria-label="إنجاز النشاط">'+I.check+'</button><span class="tt"'+(EDIT?' contenteditable data-gat="'+gi+','+ai+'"':'')+'>'+esc(a.t)+'</span>'+
      (EDIT?'<button type="button" class="pf-mini danger" data-gdel="'+gi+','+ai+'" aria-label="حذف النشاط">'+I.x+'</button>':(a.done?'':'<button type="button" class="pf-today-b" data-gtoday="'+gi+','+ai+'" title="أضيفيه إلى مهام اليوم">'+I.plus+'<span>لمهام اليوم</span></button>'))+'</li>';}).join('')+'</ol>'+
    (EDIT?'<button type="button" class="btn soft sm" data-gadd="'+gi+'">'+I.plus+'إضافة نشاط</button>':'')+
    (EDIT||hasText(g.note)?'<p class="pf-gnote"'+(EDIT?' contenteditable data-gg="'+gi+',note" data-ph="ملاحظات على الهدف"':'')+'>'+esc(g.note||'')+'</p>':'');
  var cls='pf-goal tile'+(pr.n&&pr.d===pr.n?' full':'');
  if(EDIT)return '<div class="'+cls+' open" data-g="'+esc(g.id)+'"'+hid+'><div class="sm-row">'+top+'</div>'+body+'</div>';
  return '<details class="'+cls+'" data-g="'+esc(g.id)+'"'+(GOPEN[g.id]?' open':'')+hid+'><summary>'+top+I.next+'</summary>'+body+'</details>';}
function goalsItem(){for(var i=0;i<S.sections.length;i++)for(var j=0;j<S.sections[i].items.length;j++)if(S.sections[i].items[j].type==='goals')return S.sections[i].items[j];return null;}
/* ربط مهمة اليوم بنشاط في الخطة: ref = "بند|هدف|رقم النشاط" */
function refAct(ref){var p=String(ref||'').split('|'),it=itemById(p[0]),g=it&&(it.items||[]).filter(function(x){return x.id===p[1];})[0];return g&&(g.acts||[])[+p[2]]||null;}
function setRefTasks(ref,val){var td=today();S.sections.forEach(function(s){s.items.forEach(function(it){if(it.type!=='planner')return;(it.tasks||[]).forEach(function(t){if(t.ref!==ref||!planVisible(t,td))return;var k=t.rep?td:t.date;t.done=t.done||{};if(val)t.done[k]=1;else delete t.done[k];});});});}
function syncRef(t,dn){if(!t.ref)return;var a=refAct(t.ref);if(a&&!!a.done!==dn){a.done=dn;refreshDerived();if(dn)TB.toast('سُجّل النشاط منجزًا في خطة المادة',{gold:true,icon:'target'});}}

/* ---------- خطتي اليومية: أدوات ---------- */
function pad(n){return (n<10?'0':'')+n;}
function today(d){d=d||new Date();return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());}
function planVisible(t,td){var dow=new Date().getDay();if(t.rep==='daily')return true;if(t.rep==='weekdays')return dow<=4; // الأحد إلى الخميس
  if(/^w[0-6]$/.test(t.rep||''))return dow===+t.rep[1]; // كل أسبوع في يوم محدد (w2 = الثلاثاء)
  return t.date===td||(t.date<td&&!(t.done||{})[t.date]);}
var DAYS=['أحد','اثنين','ثلاثاء','أربعاء','خميس','جمعة','سبت'];
function repL(r){return r==='daily'?'كل يوم':r==='weekdays'?'أيام الدوام':/^w[0-6]$/.test(r)?'كل '+DAYS[+r[1]]:'';}
function planDone(t,td){return !!(t.done||{})[t.rep?td:t.date];}
function planToday(it,td){return (it.tasks||[]).filter(function(t){return planVisible(t,td);}).sort(function(a,b){return (a.at||'99')<(b.at||'99')?-1:1;});}
function itemById(id){var f=findItem(id);return f&&f.item;}
function parseDMY(s){var m=/(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(s||'');return m?m[3]+'-'+pad(+m[2])+'-'+pad(+m[1]):null;}
function planSuggest(it,td){var out=[],have={},a=it.auto||{};(it.tasks||[]).forEach(function(t){if(planVisible(t,td))have[t.t]=1;});
  var lim=today(new Date(Date.now()+14*864e5));
  var pd=a.pd&&itemById(a.pd);if(pd)(pd.items||[]).filter(function(x){return !x.done&&x.iso&&x.iso>=td&&x.iso<=lim;}).slice(0,2).forEach(function(x){out.push({t:'التحضير لبرنامج النماء «'+x.en+'» ('+x.date+')'});});
  var gl=(a.goals&&itemById(a.goals))||goalsItem();if(gl){(gl.items||[]).filter(function(g){return (!g.from||g.from<=td)&&(!g.to||g.to>=td)&&goalProg(g).p<100;})
      .sort(function(x,y){return (goalProg(x).p-goalTime(x))-(goalProg(y).p-goalTime(y));}).slice(0,3).forEach(function(g){var ai=-1;(g.acts||[]).some(function(q,k){if(!q.done){ai=k;return true;}});
        if(ai>-1)out.push({t:'خطة المادة: '+g.acts[ai].t,ref:gl.id+'|'+g.id+'|'+ai});});}
  var v=a.visits&&itemById(a.visits.item);if(v){var c=a.visits;(v.rows||[]).forEach(function(r){var iso=parseDMY(r[c.date]);if(r[c.st]!==(v.okv||'منجزة')&&iso&&iso<=lim)out.push({t:'زيارة صفية للمعلمة '+r[c.name]+' · الصف '+r[c.cls]+' ('+r[c.date]+')'});});}
  var pr=a.prep&&itemById(a.prep.item);if(pr){var rows=(pr.rows||[]).slice().sort(function(x,y){return (+x[a.prep.col])-(+y[a.prep.col]);}).slice(0,2);rows.forEach(function(r){out.push({t:'متابعة تحضير المعلمة '+r[0]+' على منصة نور'});});}
  (it.suggest||[]).forEach(function(x){out.push(typeof x==='string'?{t:x}:x);});
  return out.filter(function(x){return !have[x.t];}).slice(0,8);}
function computeFrom(f){var it=itemById(f.item);if(!it)return 0;
  if(R[it.type]&&R[it.type].count)return R[it.type].count(it,f);
  if(f.count==='rows')return (it.rows||[]).length;
  if(f.count==='done')return (it.items||[]).filter(function(x){return x.done;}).length;
  if(f.count==='mine')return (it.items||[]).filter(function(x){return x.mine;}).length;
  if(f.count==='items'||f.count==='goals')return (it.items||[]).length;
  if(f.count==='acts'||f.count==='actsdone'){var c=0;(it.items||[]).forEach(function(g){(g.acts||[]).forEach(function(a){if(f.count==='acts'||a.done)c++;});});return c;}
  if(f.count==='goalsdone')return (it.items||[]).filter(function(g){var p=goalProg(g);return p.n&&p.d===p.n;}).length;
  if(f.col!=null)return (it.rows||[]).filter(function(r){return r[f.col]===(f.eq||it.okv||'منجزة');}).length;return 0;}
/* إعادة رسم بند واحد في مكانه (دون إعادة رسم الصفحة) + البنود المرتبطة به */
function rerenderItem(id){var f=findItem(id),el=$('[data-id="'+id+'"]');if(!f||!el)return;var h=renderItem(f.sec,f.item,f.ii,f.sec.items.length);
  var tmp=document.createElement('div');tmp.innerHTML=h;var n=tmp.firstElementChild;if(!n){el.remove();return;}n.classList.add('pf-in');el.replaceWith(n);}
function refreshDerived(){S.sections.forEach(function(s){s.items.forEach(function(it){if(it.type==='stats'&&(it.items||[]).some(function(x){return x.from;}))rerenderItem(it.id);if(it.type==='planner'||it.type==='goals')rerenderItem(it.id);});});}
var EDITABLE={text:1,vision:1,image:1,album:1,list:1,link:1,file:1};

function itemTools(sec,it,i,n){return '<div class="pf-item-tools">'+
  '<button class="pf-mini" data-do="edit" title="تعديل">'+I.pencil+'</button>'+
  (i>0?'<button class="pf-mini" data-do="up" title="تحريك للأعلى">'+X.up+'</button>':'')+
  (i<n-1?'<button class="pf-mini" data-do="down" title="تحريك للأسفل">'+X.down+'</button>':'')+
  '<button class="pf-mini danger" data-do="del" title="حذف">'+X.trash+'</button></div>';}

function renderItem(sec,it,i,n){var f=R[it.type];if(!f)return '';var r=f(it);if(r==null)return '';
  var cls='',html=r;if(typeof r==='object'){cls=r.cls||'';html=r.html;}
  var bare=it.type==='link'||it.type==='file';
  return '<article class="pf-item '+(bare?'card':'card pf-glow')+' pf-reveal '+(it.w||'')+' '+cls+'" data-id="'+esc(it.id)+'" data-kind="'+it.type+'"'+(bare?' style="padding:0"':'')+'>'+itemTools(sec,it,i,n)+html+'</article>';}

function renderSection(s,si){var n=s.items.length;
  var body=s.items.map(function(it,i){return renderItem(s,it,i,n);}).join('');
  var empty=!body.replace(/\s/g,'');
  return '<section class="pf-sec" id="'+esc(s.id)+'" data-sec="'+esc(s.id)+'" style="--sc:var(--'+esc(s.color||'accent')+')">'+
    '<div class="pf-sec-h pf-reveal"><span class="ico">'+G(s.icon)+'</span><div class="grow"><h2>'+esc(s.title)+'</h2>'+(hasText(s.desc)?'<p>'+esc(s.desc)+'</p>':'')+'</div>'+
      '<div class="pf-edit-tools">'+(si>0?'<button class="pf-mini" data-do="sec-up" title="تحريك القسم للأعلى">'+X.up+'</button>':'')+(si<S.sections.length-1?'<button class="pf-mini" data-do="sec-down" title="تحريك القسم للأسفل">'+X.down+'</button>':'')+
      '<button class="pf-mini" data-do="sec-edit" title="تعديل القسم">'+I.pencil+'</button><button class="pf-mini danger" data-do="sec-del" title="حذف القسم">'+X.trash+'</button></div></div>'+
    '<div class="pf-items">'+body+'</div>'+
    (empty&&!EDIT?'':'')+
    '<button class="pf-add btn soft block" data-do="add" style="border-style:dashed">'+I.plus+'إضافة بند إلى «'+esc(s.title)+'»</button>'+
    (empty&&EDIT?'':'')+
  '</section>';}

function heroHTML(){var t=S.teacher,h=new Date().getHours(),g=h<12?['sunrise','صباح الخير']:h<18?['sun','نهارك سعيد']:['moon','مساء الخير'];
  var nums=(t.stats||[]);
  return '<section class="card pf-hero pf-reveal" id="top"><div class="band"><span class="greet">'+G(g[0])+g[1]+' · أهلًا بكم في منصّتي</span>'+(hasText(t.year)?'<div class="year">العام الدراسي '+esc(t.year)+'</div>':'')+
    (t.logo?'<span class="logo-chip"><img src="'+esc(t.logo)+'" alt="شعار المدرسة"></span>':'')+'</div>'+
    '<div class="who"><span class="avatar">'+esc(t.initials||av(t.name))+'</span><div class="info"><h1>'+esc(t.name)+'</h1><p class="role">'+esc(t.role)+'</p><div class="meta">'+
      (hasText(t.school)?'<span class="chip">'+X.school+esc(t.school)+'</span>':'')+(hasText(t.region)?'<span class="chip c2">'+X.pin+esc(t.region)+'</span>':'')+(hasText(t.subject)?'<span class="chip gold">'+I.lang+esc(t.subject)+'</span>':'')+'</div></div>'+
      '<div class="pf-edit-tools"><button class="btn soft sm" data-do="hero-edit">'+I.pencil+'تعديل البطاقة</button></div></div>'+
    (hasText(t.bio)?'<p class="bio">'+esc(t.bio)+'</p>':'')+
    (nums.length?'<div class="nums" style="--n:'+nums.length+'">'+nums.map(function(x){return '<div><b data-count="'+esc(x.v)+'">'+esc(x.v)+'</b><small>'+esc(x.l)+'</small></div>';}).join('')+'</div>':'')+'</section>';}

function tabsHTML(){return '<nav class="pf-tabs" aria-label="أقسام المنصة"><a href="#top" data-spy="top">'+I.home+'الرئيسية</a>'+S.sections.map(function(s){return '<a href="#'+esc(s.id)+'" data-spy="'+esc(s.id)+'">'+G(s.icon)+esc(s.title)+'</a>';}).join('')+'</nav>';}

/* بطاقات الأقسام في الصفحة الرئيسية */
function overviewHTML(){return '<section class="pf-ov-wrap"><div class="pf-sec-h pf-reveal"><span class="ico">'+X.folder+'</span><div class="grow"><h2>أقسام المنصة</h2><p>اختر قسمًا لعرضه</p></div></div>'+
  '<div class="pf-ov">'+S.sections.map(function(s,i){var n=s.items.filter(function(it){var f=R[it.type];return f&&f(it)!=null;}).length;
    return '<a class="pf-ov-c tile pf-tilt pf-glow pf-reveal" href="#'+esc(s.id)+'" style="--sc:var(--'+esc(s.color||'accent')+')"><span class="ico">'+G(s.icon)+'</span><b>'+esc(s.title)+'</b>'+(hasText(s.desc)?'<small>'+esc(s.desc)+'</small>':'')+'<span class="go"><span class="chip">'+n+' '+(n===1?'بند':'بنود')+'</span>'+I.back+'</span></a>';}).join('')+'</div></section>';}

/* التنقل بين الأقسام أسفل القسم المعروض */
function pagerHTML(si){var a=S.sections[si-1],b=S.sections[si+1];
  return '<nav class="pf-pn" aria-label="التنقل بين الأقسام">'+(a?'<a class="btn soft" href="#'+esc(a.id)+'">'+I.next+esc(a.title)+'</a>':'<a class="btn soft" href="#top">'+I.home+'الرئيسية</a>')+
    (b?'<a class="btn" href="#'+esc(b.id)+'">'+esc(b.title)+I.back+'</a>':'<a class="btn" href="#top">الرئيسية'+I.home+'</a>')+'</nav>';}

var CUR='top';
/* مهام اليوم على الواجهة الرئيسية: تُنجز بضغطة */
function homePlanner(){for(var i=0;i<S.sections.length;i++)for(var j=0;j<S.sections[i].items.length;j++){var it=S.sections[i].items[j];if(it.type==='planner')return {sec:S.sections[i],item:it};}return null;}
function todayHTML(){var f=homePlanner();if(!f)return '';var it=f.item,td=today(),list=planToday(it,td),done=list.filter(function(t){return planDone(t,td);}).length,tot=list.length,pct=tot?Math.round(done/tot*100):0;
  return '<section class="pf-today glass pf-reveal" data-hw="'+esc(it.id)+'"><div class="ph"><span class="ring" style="--p:'+pct+'%;--sz:62px"><b>'+done+'/'+tot+'</b></span><div class="grow"><span class="eyebrow">'+I.task+'مهام اليوم</span><h3 class="h">'+(tot&&done===tot?'أحسنتِ! أنجزتِ كل مهام اليوم':tot?'باقي '+(tot-done)+' من '+tot+'، اضغطي المهمة عند إنجازها':'لم تختاري مهام لليوم بعد')+'</h3></div>'+
    '<a class="btn soft sm" href="#'+esc(f.sec.id)+'">'+(tot?'الخطة كاملة':I.plus+'اختاري مهامك')+'</a></div>'+
    (tot?'<div class="pf-today-l">'+list.map(function(t){var dn=planDone(t,td);return '<button type="button" class="pf-tk'+(dn?' done':'')+'" data-hwt="'+esc(t.id)+'" aria-pressed="'+dn+'"><span class="pf-chk">'+I.check+'</span><span class="tt">'+esc(t.t)+'</span>'+(t.at?'<small>'+I.clock+esc(t.at)+'</small>':'')+'</button>';}).join('')+'</div>':'')+
  '</section>';}
function curIndex(){for(var i=0;i<S.sections.length;i++)if(S.sections[i].id===CUR)return i;return -1;}
function render(){var main=$('#pf'),si=curIndex();if(si<0&&CUR!=='top'){CUR='top';try{history.replaceState(null,'',location.pathname+location.search);}catch(e){}}
  root.setAttribute('data-view',CUR==='top'?'home':'section');
  /* window.PF_HOME: واجهة رئيسية خاصة بالمنصة تُبنى من أجزاء المحرك */
  var addSec='<button class="pf-add btn lg block" data-do="sec-add">'+I.plus+'إضافة قسم جديد</button>';
  var body=CUR==='top'?(window.PF_HOME?window.PF_HOME({hero:heroHTML,install:installHTML,today:todayHTML,tabs:tabsHTML,overview:overviewHTML})+addSec:heroHTML()+installHTML()+todayHTML()+tabsHTML()+overviewHTML()+addSec)
    :tabsHTML()+renderSection(S.sections[si],si)+pagerHTML(si);
  main.innerHTML=body+'<footer class="pf-foot">'+esc(S.footer||'')+(S.saved?'<br><small>آخر تعديل على هذا الجهاز: '+new Date(S.saved).toLocaleString('ar-OM')+'</small>':'')+'</footer>';
  $$('[data-ic]',main).length&&TB.icons(main);
  observe();spy();
  if(window.PF_AFTER)window.PF_AFTER(CUR);
}
function go(id,keep){CUR=id||'top';render();if(!keep)scrollTo({top:0,behavior:RMQ?'auto':'smooth'});SND.page();
  var v=$('#pf');if(v&&!RMQ&&TB.prefs.motion!==false){v.classList.remove('pf-swap');void v.offsetWidth;v.classList.add('pf-swap');}}
addEventListener('hashchange',function(){var id=location.hash.slice(1)||'top';if(id!==CUR)go(id);});

/* ---------- الظهور التدريجي + العدّادات ---------- */
var IO=null;
function observe(){var els=$$('.pf-reveal:not(.pf-in)');
  if(RMQ||!('IntersectionObserver' in window)||TB.prefs.motion===false){els.forEach(function(e){e.classList.add('pf-in');});return;}
  if(!IO)IO=new IntersectionObserver(function(en){en.forEach(function(e){if(!e.isIntersecting)return;var el=e.target;IO.unobserve(el);
    var d=Math.min(+el.dataset.d||0,4);setTimeout(function(){el.classList.add('pf-in');countUp(el);},d*70);});},{rootMargin:'0px 0px -6% 0px',threshold:.06});
  var k=0;els.forEach(function(e){e.dataset.d=k++%5;IO.observe(e);});}
function countUp(el){$$('[data-count]',el).forEach(function(b){var raw=b.dataset.count,m=/^(\D*)(\d+)(\D*)$/.exec(raw);if(!m||b.dataset.done)return;b.dataset.done=1;
  var to=+m[2],t0=performance.now(),dur=1100;(function f(t){var p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,3);b.textContent=m[1]+Math.round(to*e)+m[3];if(p<1)requestAnimationFrame(f);})(t0);});}

/* ---------- القسم الحالي في الشريط + شريط التقدّم ---------- */
var spyT;
function spy(){cancelAnimationFrame(spyT);spyT=requestAnimationFrame(function(){
  var p=$('.pf-progress i'),h=document.documentElement,max=h.scrollHeight-innerHeight;if(p)p.style.setProperty('--p',max>0?(scrollY/max).toFixed(4):0);
  $$('.pf-tabs a').forEach(function(a){var on=a.dataset.spy===CUR;a.setAttribute('aria-current',on);if(on){var nav=a.parentNode;nav.scrollLeft=a.offsetLeft-nav.clientWidth/2+a.clientWidth/2;}});
});}
addEventListener('scroll',function(){var p=$('.pf-progress i'),max=document.documentElement.scrollHeight-innerHeight;if(p)p.style.setProperty('--p',max>0?(scrollY/max).toFixed(4):0);},{passive:true});

/* ---------- تفاعل المؤشر واللمس ---------- */
var trail=(function(){var cv,x,W,H,P=[],raf=0,dpr=Math.min(2,window.devicePixelRatio||1),col=[];
  function ok(){return !RMQ&&TB.prefs.motion!==false;}
  function fit(){W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;x.setTransform(dpr,0,0,dpr,0,0);}
  function colors(){var cs=getComputedStyle(root);col=[cs.getPropertyValue('--accent').trim(),cs.getPropertyValue('--gold').trim(),cs.getPropertyValue('--accent2').trim()];}
  function init(){cv=document.createElement('canvas');cv.id='pfTrail';document.body.appendChild(cv);x=cv.getContext('2d');fit();colors();addEventListener('resize',fit);document.addEventListener('tb:theme',function(){setTimeout(colors,30);});}
  function loop(){raf=0;x.clearRect(0,0,W,H);for(var i=P.length-1;i>=0;i--){var p=P[i];p.l-=p.d;p.x+=p.vx;p.y+=p.vy;p.vy+=p.g;if(p.l<=0){P.splice(i,1);continue;}
      x.globalAlpha=p.l*.9;x.fillStyle=p.c;x.shadowColor=p.c;x.shadowBlur=10;x.beginPath();if(p.star){var r=p.r*p.l*1.6;x.moveTo(p.x,p.y-r);x.quadraticCurveTo(p.x,p.y,p.x+r,p.y);x.quadraticCurveTo(p.x,p.y,p.x,p.y+r);x.quadraticCurveTo(p.x,p.y,p.x-r,p.y);x.quadraticCurveTo(p.x,p.y,p.x,p.y-r);}else x.arc(p.x,p.y,p.r*p.l,0,7);x.fill();}
    x.globalAlpha=1;x.shadowBlur=0;if(P.length)raf=requestAnimationFrame(loop);}
  function kick(){if(!raf)raf=requestAnimationFrame(loop);}
  return{init:init,
    move:function(px,py){if(!ok()||!cv||P.length>70)return;P.push({x:px,y:py,vx:(Math.random()-.5)*.6,vy:(Math.random()-.5)*.6-.2,g:-.004,r:2+Math.random()*2.5,l:1,d:.022+Math.random()*.02,c:col[Math.floor(Math.random()*col.length)],star:Math.random()<.25});kick();},
    burst:function(px,py,n){if(!ok()||!cv)return;n=n||14;for(var i=0;i<n;i++){var a=Math.random()*Math.PI*2,s=1.2+Math.random()*2.6;P.push({x:px,y:py,vx:Math.cos(a)*s,vy:Math.sin(a)*s-1,g:.06,r:2.4+Math.random()*2.6,l:1,d:.018+Math.random()*.018,c:col[i%col.length],star:Math.random()<.45});}kick();}};
})();

var lastMove=0,tiltEl=null;
document.addEventListener('pointermove',function(e){
  var g=e.target.closest&&e.target.closest('.pf-glow,.pf-hero');
  if(g){var r=g.getBoundingClientRect();g.style.setProperty('--mx',(e.clientX-r.left)+'px');g.style.setProperty('--my',(e.clientY-r.top)+'px');
    var band=g.classList.contains('pf-hero')&&$('.band',g);if(band){band.style.setProperty('--mx',(e.clientX-r.left)+'px');band.style.setProperty('--my',(e.clientY-r.top)+'px');}}
  if(FINE&&e.pointerType==='mouse'){var n=performance.now();if(n-lastMove>28){lastMove=n;trail.move(e.clientX,e.clientY);}
    var t=e.target.closest&&e.target.closest('.pf-tilt');
    if(tiltEl&&tiltEl!==t){tiltEl.style.transform='';tiltEl=null;}
    if(t&&TB.prefs.motion!==false&&!RMQ){var b=t.getBoundingClientRect(),dx=(e.clientX-b.left)/b.width-.5,dy=(e.clientY-b.top)/b.height-.5;t.style.transform='perspective(700px) rotateY('+(dx*7)+'deg) rotateX('+(-dy*7)+'deg) translateY(-3px)';tiltEl=t;}}
},{passive:true});
document.addEventListener('pointerover',function(e){if(e.pointerType!=='mouse')return;var t=e.target.closest&&e.target.closest('.pf-tabs a,.pf-c,.pf-proj,.pf-album .strip button,.btn,.round-btn');if(t&&!t.contains(e.relatedTarget))SND.hover();},{passive:true});
document.addEventListener('pointerdown',function(e){SND.unlock();
  var t=e.target.closest&&e.target.closest('.card,.tile,.btn,.round-btn,.pf-tabs a,.pf-mini');if(!t)return;
  if(TB.prefs.motion!==false&&!RMQ){var r=t.getBoundingClientRect(),sz=Math.max(r.width,r.height)*2.2,sp=document.createElement('span');sp.className='pf-ripple';sp.style.width=sp.style.height=sz+'px';sp.style.left=(e.clientX-r.left)+'px';sp.style.top=(e.clientY-r.top)+'px';
    if(getComputedStyle(t).position==='static')t.style.position='relative';t.appendChild(sp);setTimeout(function(){sp.remove();},750);}
  if(e.pointerType!=='mouse'){trail.burst(e.clientX,e.clientY,10);if(navigator.vibrate)try{navigator.vibrate(6);}catch(x){}}
  SND.tap();
},{passive:true});

/* ---------- عارض الصور ---------- */
function lbList(key){if(key.indexOf('it:')!==0)return[];var id=key.slice(3),it=findItem(id);if(!it)return[];
  if(it.item.type==='image')return [{src:it.item.src,caption:it.item.caption,title:it.item.title}];
  return (it.item.images||[]).map(function(im){return {src:im.src,caption:im.caption,title:it.item.title};});}
function lightbox(list,i){if(!list.length)return;SND.open();
  var el=document.createElement('div');el.className='pf-lb';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');
  el.innerHTML='<div class="lbbar"><button class="round-btn" data-x="close" aria-label="إغلاق">'+I.x+'</button><span class="cnt"></span><span class="sp"></span><button class="round-btn" data-x="zoom" aria-label="تكبير">'+X.zoom+'</button><a class="round-btn" data-x="dl" aria-label="فتح الصورة" target="_blank" rel="noopener">'+X.download+'</a></div>'+
    '<div class="stage"><button class="round-btn nav-b prev" data-x="prev" aria-label="السابق">'+I.next+'</button><img alt=""><button class="round-btn nav-b next" data-x="next" aria-label="التالي">'+I.back+'</button></div><div class="cap"></div>';
  document.body.appendChild(el);document.body.style.overflow='hidden';
  var img=$('img',el),z=1,tx=0,ty=0;
  function apply(){img.style.transform='translate('+tx+'px,'+ty+'px) scale('+z+')';img.classList.toggle('zoomed',z>1);}
  function show(k,dir){i=(k+list.length)%list.length;var it=list[i];z=1;tx=ty=0;img.style.opacity=0;img.style.transform='translateX('+(dir||0)*40+'px)';
    setTimeout(function(){img.src=it.src;img.onload=function(){img.style.opacity=1;apply();};},dir?120:0);
    $('.cnt',el).textContent=(i+1)+' / '+list.length;$('[data-x=dl]',el).href=it.src;
    $('.cap',el).innerHTML=(hasText(it.title)?'<small>'+esc(it.title)+'</small>':'')+esc(it.caption||'');
    $$('.nav-b',el).forEach(function(b){b.hidden=list.length<2;});}
  function close(){el.remove();document.body.style.overflow='';removeEventListener('keydown',key);}
  function key(e){if(e.key==='Escape')close();else if(e.key==='ArrowLeft'){SND.page();show(i+1,-1);}else if(e.key==='ArrowRight'){SND.page();show(i-1,1);}}
  addEventListener('keydown',key);
  el.addEventListener('click',function(e){var b=e.target.closest('[data-x]');if(!b){if(e.target===el||e.target.classList.contains('stage'))close();return;}var a=b.dataset.x;
    if(a==='close')close();else if(a==='next'){SND.page();show(i+1,-1);}else if(a==='prev'){SND.page();show(i-1,1);}else if(a==='zoom'){z=z>1?1:2.2;tx=ty=0;apply();}});
  // سحب للتنقّل، تكبير بإصبعين، نقر مزدوج للتكبير
  var pts={},start=null,pinch0=0,z0=1,lastTap=0;
  var stage=$('.stage',el);
  stage.addEventListener('pointerdown',function(e){if(e.target.closest('button'))return;stage.setPointerCapture(e.pointerId);pts[e.pointerId]={x:e.clientX,y:e.clientY};var ks=Object.keys(pts);
    if(ks.length===2){var a=pts[ks[0]],b=pts[ks[1]];pinch0=Math.hypot(a.x-b.x,a.y-b.y);z0=z;start=null;}
    else{start={x:e.clientX,y:e.clientY,tx:tx,ty:ty,t:Date.now()};var n=Date.now();if(n-lastTap<300){z=z>1?1:2.2;tx=ty=0;apply();start=null;}lastTap=n;}});
  stage.addEventListener('pointermove',function(e){if(!pts[e.pointerId])return;pts[e.pointerId]={x:e.clientX,y:e.clientY};var ks=Object.keys(pts);
    if(ks.length===2&&pinch0){var a=pts[ks[0]],b=pts[ks[1]];z=Math.max(1,Math.min(4,z0*Math.hypot(a.x-b.x,a.y-b.y)/pinch0));apply();return;}
    if(!start)return;var dx=e.clientX-start.x,dy=e.clientY-start.y;if(z>1){tx=start.tx+dx;ty=start.ty+dy;apply();}else{img.style.transform='translateX('+dx+'px)';}});
  function up(e){var had=pts[e.pointerId];delete pts[e.pointerId];if(Object.keys(pts).length<2)pinch0=0;if(!had||!start)return;var dx=e.clientX-start.x;
    if(z===1){if(Math.abs(dx)>60&&list.length>1){SND.page();if(dx>0)show(i+1,1);else show(i-1,-1);}else apply();}start=null;}
  stage.addEventListener('pointerup',up);stage.addEventListener('pointercancel',up);
  stage.addEventListener('wheel',function(e){e.preventDefault();z=Math.max(1,Math.min(4,z*(e.deltaY<0?1.12:.89)));if(z===1)tx=ty=0;apply();},{passive:false});
  show(i||0);
}

/* ---------- البحث عن عنصر ---------- */
function findItem(id){for(var a=0;a<S.sections.length;a++){var s=S.sections[a];for(var b=0;b<s.items.length;b++)if(s.items[b].id===id)return {sec:s,si:a,item:s.items[b],ii:b};}return null;}
function findSec(id){for(var a=0;a<S.sections.length;a++)if(S.sections[a].id===id)return {sec:S.sections[a],si:a};return null;}

/* ---------- التراجع ---------- */
var undoSnap=null,undoT;
function withUndo(msg,fn){undoSnap=JSON.stringify(S);fn();persist();render();SND.remove();
  var u=$('.pf-undo');if(!u){u=document.createElement('div');u.className='pf-undo';document.body.appendChild(u);}
  u.innerHTML='<div><span>'+esc(msg)+'</span><button class="btn gold sm" data-do="undo">'+I.reset+'تراجع</button></div>';u.hidden=false;
  clearTimeout(undoT);undoT=setTimeout(function(){u.hidden=true;undoSnap=null;},7000);}
function undo(){if(!undoSnap)return;S=JSON.parse(undoSnap);undoSnap=null;persist();render();var u=$('.pf-undo');if(u)u.hidden=true;TB.toast('تم التراجع',{icon:'reset'});SND.chime();}

/* ---------- الصور المرفوعة: ضغط إلى JPEG ---------- */
function readImage(file){return new Promise(function(res,rej){var fr=new FileReader();fr.onerror=rej;fr.onload=function(){var im=new Image();im.onerror=function(){res(fr.result);};im.onload=function(){
    var max=1800,w=im.naturalWidth,h=im.naturalHeight,k=Math.min(1,max/Math.max(w,h));if(file.type==='image/svg+xml'||k===1&&file.size<600000){res(fr.result);return;}
    var c=document.createElement('canvas');c.width=Math.round(w*k);c.height=Math.round(h*k);var x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',.86));};im.src=fr.result;};fr.readAsDataURL(file);});}

/* ---------- النماذج ---------- */
var TYPES=[['text','نص','text'],['vision','رؤية / رسالة','eye'],['image','صورة مع وصف','image'],['album','ألبوم صور','album'],['list','قائمة نقاط','list'],['link','رابط','link'],['file','ملف (PDF وغيره)','file']];
function field(lbl,inner,hint){return '<label class="field"><span class="lbl">'+lbl+'</span>'+inner+(hint?'<small class="note">'+hint+'</small>':'')+'</label>';}
function inp(name,val,ph,type){return '<input class="input" name="'+name+'" value="'+esc(val||'')+'" placeholder="'+esc(ph||'')+'"'+(type?' type="'+type+'"':'')+'>';}
function ta(name,val,ph,rows){return '<textarea class="textarea" name="'+name+'" rows="'+(rows||5)+'" placeholder="'+esc(ph||'')+'">'+esc(val||'')+'</textarea>';}

function itemForm(type,it){it=it||{};var h='';
  if(type==='text')h=field('العنوان (اختياري)',inp('title',it.title,'مثال: فلسفتي في التدريس'))+field('النص',ta('body',it.body,'اكتبي هنا…',8));
  else if(type==='vision')h=field('العنوان',inp('title',it.title||'رؤية المادة','رؤية المادة'))+field('النص',ta('body',it.body,it.placeholder||'اكتبي الرؤية هنا…',5))+
    field('الشكل','<div class="seg" role="group"><button type="button" data-pick="tone" data-v="" aria-pressed="'+(it.tone!=='c2')+'">ذهبي</button><button type="button" data-pick="tone" data-v="c2" aria-pressed="'+(it.tone==='c2')+'">أساسي</button></div><input type="hidden" name="tone" value="'+esc(it.tone||'')+'">')+
    field('الأيقونة','<div class="seg" role="group"><button type="button" data-pick="icon" data-v="eye" aria-pressed="'+((it.icon||'eye')==='eye')+'">'+X.eye+'رؤية</button><button type="button" data-pick="icon" data-v="target" aria-pressed="'+(it.icon==='target')+'">'+X.target+'رسالة</button><button type="button" data-pick="icon" data-v="heart" aria-pressed="'+(it.icon==='heart')+'">'+I.heart+'قيم</button></div><input type="hidden" name="icon" value="'+esc(it.icon||'eye')+'">');
  else if(type==='image')h=field('الصورة','<div class="drop" data-drop="one">'+X.image+'<b>اختاري صورة أو اسحبيها هنا</b><small class="note">تظهر الصورة كبيرة والوصف تحتها</small></div><input type="file" accept="image/*" hidden data-file="one"><div class="pf-prev-imgs">'+(it.src?'<img src="'+esc(it.src)+'" alt="">':'')+'</div>')+
    field('العنوان (اختياري)',inp('title',it.title,'مثال: حصة تطبيقية'))+field('الوصف',ta('caption',it.caption,'اكتبي وصف الصورة…',3));
  else if(type==='album')h=field('العنوان',inp('title',it.title,'مثال: صور ورشة النماء المهني'))+field('الصور','<div class="drop" data-drop="many">'+X.album+'<b>اختاري عدة صور</b><small class="note">يمكنك كتابة وصف لكل صورة بعد اختيارها</small></div><input type="file" accept="image/*" multiple hidden data-file="many"><div data-caps class="stack" style="gap:8px">'+(it.images||[]).map(capRow).join('')+'</div>');
  else if(type==='list')h=field('العنوان',inp('title',it.title,'مثال: إنجازاتي'))+field('النقاط',ta('items',(it.items||[]).join('\n'),'كل سطر نقطة مستقلة',7),'اكتبي كل نقطة في سطر');
  else if(type==='link')h=field('العنوان',inp('title',it.title,'مثال: قناتي التعليمية'))+field('الرابط',inp('url',it.url,'https://','url'))+field('وصف قصير (اختياري)',inp('desc',it.desc,''));
  else if(type==='file')h=field('الملف','<div class="drop" data-drop="doc">'+X.file+'<b>'+(it.name?esc(it.name):'اختاري ملفًا')+'</b><small class="note">PDF أو Word أو Excel أو غيره</small></div><input type="file" hidden data-file="doc">')+field('العنوان',inp('title',it.title,'مثال: خطة المادة'))+field('وصف قصير (اختياري)',inp('desc',it.desc,''));
  else h=field('العنوان',inp('title',it.title,''))+'<p class="note">هذا البند من المحتوى الأصلي للمنصة؛ يمكن تعديل عنوانه أو حذفه.</p>';
  return h;}
function capRow(im){return '<div class="row" data-cap style="gap:10px;align-items:center"><img src="'+esc(im.thumb||im.src)+'" data-src="'+esc(im.src)+'" alt="" style="width:64px;height:64px;object-fit:cover;border-radius:12px;flex:none"><input class="input" value="'+esc(im.caption||'')+'" placeholder="وصف الصورة"><button type="button" class="pf-mini danger" data-rmcap title="إزالة">'+I.x+'</button></div>';}

function openItemSheet(secId,itemId,preType){
  var found=itemId?findItem(itemId):null,it=found?found.item:null,type=it?it.type:(preType||null);
  var pending={one:it&&it.src||null,doc:null};
  function body(){
    if(!type)return '<p class="sub" style="margin:0 0 12px">ماذا تريدين أن تضيفي؟</p><div class="pf-types">'+TYPES.map(function(t){return '<button type="button" data-pick-type="'+t[0]+'">'+G(t[2])+t[1]+'</button>';}).join('')+'</div>';
    return '<form class="pf-form" data-form>'+itemForm(type,it||{})+(EDITABLE[type]||it?'<label class="field"><span class="lbl">العرض</span><div class="seg" role="group"><button type="button" data-pick="w" data-v="" aria-pressed="'+(!it||!it.w)+'">كامل العرض</button><button type="button" data-pick="w" data-v="half" aria-pressed="'+(!!it&&it.w==='half')+'">نصف العرض</button></div><input type="hidden" name="w" value="'+esc(it&&it.w||'')+'"></label>':'')+
      '<div class="row" style="gap:10px"><button class="btn" type="submit">'+X.save+(it?'حفظ التعديل':'إضافة')+'</button>'+(!it?'<button class="btn ghost" type="button" data-back>'+I.back+'رجوع</button>':'')+'</div></form>';}
  var title=it?'تعديل البند':'بند جديد';
  TB.sheet('<div data-pfsheet>'+body()+'</div>',{title:title,sub:found?('في قسم «'+found.sec.title+'»'):'',icon:'plus'});
  var box=$('[data-pfsheet]');if(!box)return;
  function rebind(){box.innerHTML=body();var f=$('[data-form]',box);if(f){var first=$('input:not([type=hidden]):not([type=file]),textarea',f);if(first&&!('ontouchstart' in window))first.focus();}}
  box.addEventListener('click',function(e){var t=e.target.closest('[data-pick-type]');if(t){type=t.dataset.pickType;SND.tap();rebind();return;}
    if(e.target.closest('[data-back]')){type=null;rebind();return;}
    var p=e.target.closest('[data-pick]');if(p){var g=p.dataset.pick;$$('[data-pick="'+g+'"]',box).forEach(function(b){b.setAttribute('aria-pressed',b===p);});$('input[name="'+g+'"]',box).value=p.dataset.v;return;}
    var d=e.target.closest('[data-drop]');if(d){$('[data-file="'+d.dataset.drop+'"]',box).click();return;}
    var rm=e.target.closest('[data-rmcap]');if(rm){rm.closest('[data-cap]').remove();return;}});
  function takeFiles(kind,files){if(!files||!files.length)return;
    if(kind==='one'){readImage(files[0]).then(function(src){pending.one=src;$('.pf-prev-imgs',box).innerHTML='<img src="'+src+'" alt="">';});}
    else if(kind==='many'){var caps=$('[data-caps]',box);Array.prototype.forEach.call(files,function(f){readImage(f).then(function(src){caps.insertAdjacentHTML('beforeend',capRow({src:src,caption:''}));});});}
    else if(kind==='doc'){pending.doc=files[0];$('[data-drop="doc"] b',box).textContent=files[0].name;var t=$('input[name=title]',box);if(t&&!t.value)t.value=files[0].name.replace(/\.[^.]+$/,'');}}
  box.addEventListener('change',function(e){var f=e.target.closest('[data-file]');if(f)takeFiles(f.dataset.file,f.files);});
  box.addEventListener('dragover',function(e){if(e.target.closest('[data-drop]')){e.preventDefault();}});
  box.addEventListener('drop',function(e){var d=e.target.closest('[data-drop]');if(!d)return;e.preventDefault();takeFiles(d.dataset.drop,e.dataTransfer.files);});
  box.addEventListener('submit',function(e){e.preventDefault();var f=e.target,v=function(n){var x=f.elements[n];return x?x.value.trim():'';};
    var data=it?clone(it):{id:uid('i'),type:type};
    if('title' in f.elements)data.title=v('title');
    if(type==='text'){data.body=v('body');}
    else if(type==='vision'){data.body=v('body');data.tone=v('tone');data.icon=v('icon')||'eye';}
    else if(type==='image'){if(!pending.one){TB.toast('اختاري صورة أولًا',{icon:'x'});return;}data.src=pending.one;data.caption=v('caption');}
    else if(type==='album'){data.images=$$('[data-cap]',box).map(function(r){var im=$('img',r),old=(it&&it.images||[]).filter(function(o){return o.src===im.dataset.src;})[0]||{};return Object.assign({},old,{src:im.dataset.src,caption:$('input',r).value.trim()});});if(!data.images.length){TB.toast('أضيفي صورة واحدة على الأقل',{icon:'x'});return;}}
    else if(type==='list'){data.items=v('items').split('\n').map(function(s){return s.trim();}).filter(Boolean);}
    else if(type==='link'){data.url=v('url');data.desc=v('desc');if(!data.url){TB.toast('اكتبي الرابط',{icon:'x'});return;}if(!/^https?:\/\//.test(data.url))data.url='https://'+data.url;}
    else if(type==='file'){data.desc=v('desc');if(pending.doc){data.fileKey=KEY+':file:'+uid('f');data.name=pending.doc.name;DB.set(data.fileKey,pending.doc);}else if(!it){TB.toast('اختاري ملفًا',{icon:'x'});return;}}
    if('w' in f.elements)data.w=v('w');
    var btn=$('button[type=submit]',f),jobs=[];
    if(CL&&PIN){
      if(data.src&&data.src.indexOf('data:')===0)jobs.push(upload(data.src).then(function(u){data.src=u;}));
      (data.images||[]).forEach(function(im){if(im.src&&im.src.indexOf('data:')===0)jobs.push(upload(im.src).then(function(u){im.src=u;delete im.thumb;}));});
      if(type==='file'&&pending.doc)jobs.push(upload(pending.doc,pending.doc.name).then(function(u){data.url=u;}));
    }
    if(jobs.length){btn.disabled=true;btn.innerHTML=I.clock+'جارٍ رفع الملفات…';}
    Promise.all(jobs).then(done,function(){btn.disabled=false;btn.innerHTML=X.save+'حاولي مرة أخرى';TB.toast('تعذّر رفع الملف، تحقّقي من الإنترنت',{icon:'x'});});
    function done(){
    if(it){found.sec.items[found.ii]=data;}else{findSec(secId).sec.items.push(data);}
    persist();TB.closeSheet();render();SND.success();
    var el=$('[data-id="'+data.id+'"]');if(el){el.scrollIntoView({behavior:'smooth',block:'center'});var r=el.getBoundingClientRect();TB.celebrate(r.left+r.width/2,Math.max(80,r.top),{count:36});}
    TB.toast(it?'تم حفظ التعديل':'أُضيف البند',{gold:true,icon:'check'});}});
}

function openSecSheet(secId){var f=secId?findSec(secId):null,s=f?f.sec:{icon:'book',color:'accent'};
  var html='<form class="pf-form" data-secform>'+field('اسم القسم',inp('title',s.title,'مثال: إنجازاتي'))+field('وصف قصير (اختياري)',inp('desc',s.desc,''))+
    field('الأيقونة','<div class="pf-icons">'+ICONS.map(function(n){return '<button type="button" data-icon="'+n+'" aria-pressed="'+(s.icon===n)+'">'+G(n)+'</button>';}).join('')+'</div><input type="hidden" name="icon" value="'+esc(s.icon)+'">')+
    field('اللون','<div class="seg" role="group">'+COLORS.map(function(c){return '<button type="button" data-color="'+c[0]+'" aria-pressed="'+((s.color||'accent')===c[0])+'"><span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:var(--'+c[0]+')"></span>'+c[1]+'</button>';}).join('')+'</div><input type="hidden" name="color" value="'+esc(s.color||'accent')+'">')+
    '<button class="btn" type="submit">'+X.save+(f?'حفظ القسم':'إنشاء القسم')+'</button></form>';
  TB.sheet(html,{title:f?'تعديل القسم':'قسم جديد',sub:'الأقسام تظهر في شريط التنقل أعلى المنصة',icon:'plus'});
  var form=$('[data-secform]');
  form.addEventListener('click',function(e){var b=e.target.closest('[data-icon],[data-color]');if(!b)return;var k=b.dataset.icon?'icon':'color';$$('[data-'+k+']',form).forEach(function(x){x.setAttribute('aria-pressed',x===b);});form.elements[k].value=b.dataset[k];SND.tap();});
  form.addEventListener('submit',function(e){e.preventDefault();var t=form.elements.title.value.trim();if(!t){TB.toast('اكتبي اسم القسم',{icon:'x'});return;}
    var d={title:t,desc:form.elements.desc.value.trim(),icon:form.elements.icon.value,color:form.elements.color.value};
    var id;if(f){Object.assign(f.sec,d);id=f.sec.id;}else{id=uid('s');S.sections.push(Object.assign({id:id,items:[]},d));}
    persist();TB.closeSheet();SND.success();if(location.hash!=='#'+id)location.hash=id;else go(id);
    TB.toast(f?'تم حفظ القسم':'أُنشئ القسم، أضيفي إليه بنودًا',{gold:true,icon:'check'});});}

function openHeroSheet(){var t=S.teacher;
  var html='<form class="pf-form" data-heroform>'+field('الاسم',inp('name',t.name))+field('الوظيفة',inp('role',t.role))+field('المدرسة',inp('school',t.school))+field('المحافظة',inp('region',t.region))+field('المادة',inp('subject',t.subject))+field('العام الدراسي',inp('year',t.year))+field('نبذة',ta('bio',t.bio,'',5))+
    '<button class="btn" type="submit">'+X.save+'حفظ</button></form>';
  TB.sheet(html,{title:'بطاقة المعلمة',icon:'user'});var form=$('[data-heroform]');
  form.addEventListener('submit',function(e){e.preventDefault();['name','role','school','region','subject','year','bio'].forEach(function(k){t[k]=form.elements[k].value.trim();});persist();TB.closeSheet();render();SND.success();TB.toast('تم حفظ البطاقة',{gold:true,icon:'check'});});}

/* ---------- رمز التحرير ---------- */
function openPinSheet(){
  TB.sheet('<form class="pf-form" data-pinform><p class="sub" style="margin:0">التحرير خاص بصاحبة المنصة. اكتبي الرمز السري، وستظهر تعديلاتك لكل من يفتح الرابط.</p>'+
    field('الرمز السري','<input class="input" name="pin" type="password" inputmode="numeric" autocomplete="current-password" style="letter-spacing:.4em;text-align:center;font-size:1.3rem" required>')+
    '<label class="row" style="gap:8px;align-items:center"><input type="checkbox" name="keep" checked> <span>تذكّري الرمز على هذا الجهاز</span></label>'+
    '<button class="btn" type="submit">'+I.pencil+'دخول التحرير</button></form>',{title:'تحرير المنصة',icon:'pencil'});
  var f=$('[data-pinform]');setTimeout(function(){var i=f&&f.elements.pin;if(i)i.focus();},80);
  f.addEventListener('submit',function(e){e.preventDefault();var pin=f.elements.pin.value.trim(),b=$('button',f);if(!pin)return;b.disabled=true;
    rpc('pf_check',{p_slug:CL.slug,p_pin:pin}).then(function(ok){b.disabled=false;
      if(!ok){SND.remove();TB.toast('الرمز غير صحيح',{icon:'x'});f.elements.pin.value='';return;}
      PIN=pin;try{(f.elements.keep.checked?localStorage:sessionStorage).setItem('pf:pin:'+DEF.id,pin);}catch(x){}
      TB.closeSheet();setEdit(true);
    },function(err){b.disabled=false;var m=(err&&(err.message||''))||'';TB.toast(/locked/.test(m)?'محاولات كثيرة، انتظري 10 دقائق':'تعذّر الاتصال، تحقّقي من الإنترنت',{icon:'x'});});});}

/* ---------- قائمة المزيد ---------- */
function openMore(){
  var html='<div class="stack" data-pfmore>'+
    (TB.report?'<button class="btn gold block" data-do="report">'+X.download+'تصدير سجل الأعمال PDF (جداول ورسوم بيانية)</button>':'')+
    '<button class="btn block '+(EDIT?'gold':'')+'" data-do="edit-toggle">'+I.pencil+(EDIT?'إنهاء التحرير':'تحرير المنصة (إضافة وحذف الأقسام والبنود)')+'</button>'+
    '<button class="btn soft block" data-act="studio">'+I.palette+'الثيمات والمظهر</button>'+
    '<button class="btn soft block" data-do="sound">'+(SND.on?X.sound:X.mute)+(SND.on?'الأصوات تعمل · إيقاف':'الأصوات متوقفة · تشغيل')+'</button>'+
    '<div class="card stack" style="gap:10px"><b>صوت اللمس</b><div class="chips">'+Object.keys(SND.PACKS).map(function(k){return '<button class="cb" data-pack="'+k+'" aria-pressed="'+(SND.on&&SND.pack===k)+'">'+SND.PACKS[k].n+'</button>';}).join('')+'<button class="cb" data-pack="off" aria-pressed="'+(!SND.on)+'">بلا صوت</button></div></div>'+
    (canInstall()?'<button class="btn soft block" data-do="install">'+X.install+'تنصيب المنصة كتطبيق</button>':'')+
    '<button class="btn soft block" data-do="share">'+X.share+'مشاركة رابط المنصة</button>'+
    (CL&&PIN?'<button class="btn ghost block" data-do="logout">'+I.x+'الخروج من التحرير على هذا الجهاز</button>':'')+
    '<div class="card stack" style="gap:10px"><b>نسخة احتياطية</b><p class="note" style="margin:0">'+(CL?'التعديلات تُحفظ في السحابة ويراها الجميع، ويمكنك أيضًا تصدير نسخة احتياطية.':'التعديلات محفوظة على هذا الجهاز. صدّري نسخة لنقلها إلى جهاز آخر.')+'</p>'+
    '<div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn soft sm" data-do="export">'+X.download+'تصدير نسخة</button><button class="btn soft sm" data-do="import">'+I.upload+'استيراد نسخة</button><button class="btn danger sm" data-do="reset">'+I.reset+'استعادة الأصل</button></div></div>'+
    '</div>';
  TB.sheet(html,{title:'خيارات المنصة',icon:'menu'});}

function exportData(){var files={},keys=[];S.sections.forEach(function(s){s.items.forEach(function(it){if(it.type==='file'&&it.fileKey)keys.push(it.fileKey);});});
  Promise.all(keys.map(function(k){return DB.get(k).then(function(b){if(!b)return;return new Promise(function(res){var fr=new FileReader();fr.onload=function(){files[k]=fr.result;res();};fr.readAsDataURL(b);});});})).then(function(){
    var blob=new Blob([JSON.stringify({manassa:1,id:DEF.id,state:S,files:files})],{type:'application/json'}),a=document.createElement('a');
    a.href=URL.createObjectURL(blob);a.download=DEF.id+'-نسخة-'+new Date().toISOString().slice(0,10)+'.json';document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove();},1000);TB.toast('تم تصدير النسخة',{gold:true,icon:'check'});});}
function importData(){var i=document.createElement('input');i.type='file';i.accept='application/json,.json';i.onchange=function(){var f=i.files[0];if(!f)return;var fr=new FileReader();fr.onload=function(){try{var d=JSON.parse(fr.result);if(!d.state||!d.state.sections)throw 0;
      var ps=Object.keys(d.files||{}).map(function(k){return fetch(d.files[k]).then(function(r){return r.blob();}).then(function(b){return DB.set(k,b);});});
      Promise.all(ps).then(function(){S=merge(d.state);persist();render();TB.closeSheet();TB.toast('تم استيراد النسخة',{gold:true,icon:'check'});SND.success();});}catch(e){TB.toast('الملف غير صالح',{icon:'x'});}};fr.readAsText(f);};i.click();}

/* ---------- التنصيب (PWA) ---------- */
var deferred=null,isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
var standalone=(window.matchMedia&&matchMedia('(display-mode: standalone)').matches)||navigator.standalone;
function canInstall(){return !standalone&&(deferred||isIOS);}
function installHTML(){if(!canInstall())return '';var dismissed=false;try{dismissed=localStorage.getItem('pf:inst-x')==='1';}catch(e){}if(dismissed)return '';
  return '<div class="card pf-install pf-reveal" data-install><span class="ai"><img src="'+esc(DEF.icon||'icons/icon-192.png')+'" alt=""></span><span class="grow"><b>ثبّتي المنصة كتطبيق</b><small>افتحيها من الشاشة الرئيسية في الكمبيوتر أو الآيباد أو الهاتف، وتعمل حتى دون إنترنت.</small></span><button class="btn sm" data-do="install">'+X.install+'تنصيب</button><button class="pf-mini" data-do="inst-x" aria-label="إخفاء">'+I.x+'</button></div>';}
addEventListener('beforeinstallprompt',function(e){e.preventDefault();deferred=e;if(S&&!$('[data-install]'))render();});
addEventListener('appinstalled',function(){deferred=null;standalone=true;render();TB.toast('تم تنصيب المنصة',{gold:true,icon:'check'});SND.success();});
function install(){if(deferred){deferred.prompt();deferred.userChoice.finally(function(){deferred=null;render();});return;}
  if(isIOS){TB.sheet('<div class="pf-ios"><div class="st"><i>1</i><span>اضغطي زر المشاركة '+X.share+' أسفل Safari أو أعلاه</span></div><div class="st"><i>2</i><span>اختاري «إضافة إلى الشاشة الرئيسية»</span></div><div class="st"><i>3</i><span>اضغطي «إضافة»، وستجدين المنصة بين تطبيقاتك</span></div></div>',{title:'تنصيب المنصة على الآيباد أو الآيفون',icon:'plus'});return;}
  TB.toast('من قائمة المتصفح اختاري «تثبيت التطبيق»',{icon:'bell'});}

/* ---------- الأوامر ---------- */
function setEdit(on){EDIT=on;root.setAttribute('data-edit',on?'on':'off');render();
  var b=$('[data-do="edit-toggle"].round-btn');if(b)b.classList.toggle('pf-sound-on',on);
  if(on){TB.toast('وضع التحرير: أضيفي أو عدّلي أو احذفي ما تشائين',{gold:true,icon:'pencil'});SND.chime();}else{TB.toast('تم حفظ كل التعديلات على هذا الجهاز',{icon:'check'});}}

document.addEventListener('click',function(e){
  var lb=e.target.closest('[data-lb]');if(lb&&!e.target.closest('.pf-item-tools')&&!EDIT_BLOCK(e)){e.preventDefault();lightbox(lbList(lb.dataset.lb),+lb.dataset.i||0);return;}
  var fl=e.target.closest('a[data-file]');if(fl){e.preventDefault();DB.get(fl.dataset.file).then(function(b){if(!b){TB.toast('الملف غير موجود على هذا الجهاز',{icon:'x'});return;}var u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=fl.dataset.name||'file';a.target='_blank';document.body.appendChild(a);a.click();setTimeout(function(){a.remove();},500);});return;}
  var tf=e.target.closest('[data-tlf]');if(tf){var box=tf.closest('.pf-item');$$('[data-tlf]',box).forEach(function(b){b.setAttribute('aria-pressed',b===tf);});$$('.pf-tl li',box).forEach(function(li){li.hidden=li.dataset.cat.split(' ').indexOf(tf.dataset.tlf)<0;});return;}
  var pk=e.target.closest('[data-pack]');if(pk){var k=pk.dataset.pack;if(k==='off'){if(SND.on)SND.toggle();}else SND.setPack(k);
    $$('[data-pack]').forEach(function(b){b.setAttribute('aria-pressed',b===pk);});
    $$('.round-btn[data-do=sound]').forEach(function(b){b.innerHTML=SND.on?X.sound:X.mute;b.classList.toggle('pf-sound-on',SND.on);});return;}
  var t=e.target.closest('[data-do]');if(!t)return;var a=t.dataset.do;
  var art=t.closest('[data-id]'),sec=t.closest('[data-sec]');
  if(a==='edit-toggle'){TB.closeSheet();if(!EDIT&&CL&&!PIN){openPinSheet();return;}setEdit(!EDIT);return;}
  if(a==='logout'){forgetPin();TB.closeSheet();if(EDIT)setEdit(false);TB.toast('تم الخروج من التحرير على هذا الجهاز',{icon:'check'});return;}
  if(a==='more'){openMore();return;}
  if(a==='sound'){var on=SND.toggle();$$('[data-do=sound]').forEach(function(b){if(b.classList.contains('round-btn')){b.innerHTML=on?X.sound:X.mute;b.classList.toggle('pf-sound-on',on);}});TB.toast(on?'الأصوات الهادئة تعمل':'تم إيقاف الأصوات',{icon:'bell'});if($('[data-pfmore]'))openMore();return;}
  if(a==='install'){install();return;}
  if(a==='inst-x'){try{localStorage.setItem('pf:inst-x','1');}catch(x){}var c=$('[data-install]');if(c)c.remove();return;}
  if(a==='share'){var u=location.href.split('#')[0];if(navigator.share)navigator.share({title:document.title,url:u}).catch(function(){});else if(navigator.clipboard)navigator.clipboard.writeText(u).then(function(){TB.toast('نُسخ رابط المنصة',{icon:'check'});});return;}
  if(a==='report'){TB.closeSheet();if(EDIT)setEdit(false);setTimeout(function(){TB.report.open({state:S,title:DEF.reportTitle,sign:DEF.reportSign});},60);return;}
  if(a==='export'){exportData();return;}
  if(a==='import'){importData();return;}
  if(a==='reset'){if(CL&&!PIN){TB.toast('ادخلي التحرير أولًا',{icon:'x'});return;}if(!confirm(CL?'سيتم حذف كل تعديلاتك وإرجاع المنصة كما كانت لكل الزوار. هل أنتِ متأكدة؟':'سيتم حذف كل تعديلاتك على هذا الجهاز وإرجاع المنصة كما كانت. هل أنتِ متأكدة؟'))return;DB.del(KEY).then(function(){S=clone(DEF);render();if(CL&&PIN)cloudSave();TB.closeSheet();TB.toast('عادت المنصة إلى أصلها',{icon:'reset'});});return;}
  if(a==='undo'){undo();return;}
  if(a==='hero-edit'){openHeroSheet();return;}
  if(a==='sec-add'){openSecSheet(null);return;}
  if(a==='add'&&sec){openItemSheet(sec.dataset.sec,null);return;}
  if(a==='sec-edit'&&sec){openSecSheet(sec.dataset.sec);return;}
  if(a==='sec-del'&&sec){var fs=findSec(sec.dataset.sec);if(!fs)return;withUndo('حُذف قسم «'+fs.sec.title+'»',function(){S.sections.splice(fs.si,1);(S.deleted=S.deleted||[]).push(fs.sec.id);});return;}
  if((a==='sec-up'||a==='sec-down')&&sec){var q=findSec(sec.dataset.sec),j=q.si+(a==='sec-up'?-1:1);if(j<0||j>=S.sections.length)return;var tmp=S.sections[j];S.sections[j]=q.sec;S.sections[q.si]=tmp;persist();render();SND.page();return;}
  if(!art)return;var fi=findItem(art.dataset.id);if(!fi)return;
  if(a==='edit'){openItemSheet(fi.sec.id,fi.item.id);return;}
  if(a==='del'){withUndo('حُذف البند',function(){fi.sec.items.splice(fi.ii,1);(S.deleted=S.deleted||[]).push(fi.item.id);});return;}
  if(a==='up'||a==='down'){var k=fi.ii+(a==='up'?-1:1);if(k<0||k>=fi.sec.items.length)return;var x=fi.sec.items[k];fi.sec.items[k]=fi.item;fi.sec.items[fi.ii]=x;persist();render();SND.page();return;}
});
function EDIT_BLOCK(e){return false;}

/* ---------- تفاعل الإنجاز: الحالة، الجداول، خطتي اليومية ---------- */
function burstAt(el,n){var r=el.getBoundingClientRect();TB.celebrate(r.left+r.width/2,r.top+r.height/2,{count:n||28});}
document.addEventListener('click',function(e){
  var hw=e.target.closest&&e.target.closest('[data-hwt]');if(hw){var box=hw.closest('[data-hw]'),hf=findItem(box.dataset.hw);if(!hf)return;var hit=hf.item,td=today(),t=(hit.tasks||[]).filter(function(q){return q.id===hw.dataset.hwt;})[0];if(!t)return;
    var key=t.rep?td:t.date;t.done=t.done||{};if(t.done[key])delete t.done[key];else t.done[key]=1;var dn=!!t.done[key];syncRef(t,dn);persist();var r0=hw.getBoundingClientRect();
    var tmp=document.createElement('div');tmp.innerHTML=todayHTML();var nw=tmp.firstChild;nw.classList.add('pf-in');box.replaceWith(nw);TB.icons&&TB.icons(nw);
    if(dn){SND.success();TB.celebrate(r0.left+r0.width/2,r0.top+r0.height/2,{count:26});var l=planToday(hit,td);if(l.length&&l.every(function(q){return planDone(q,td);}))setTimeout(function(){TB.celebrate(innerWidth/2,innerHeight/3,{count:90});TB.toast('رائع! أنجزتِ كل مهام اليوم',{gold:true,icon:'award'});},350);}else SND.tap();return;}
  var art=e.target.closest&&e.target.closest('[data-id]');if(!art)return;var f=findItem(art.dataset.id);if(!f)return;var it=f.item,b;
  if((b=e.target.closest('[data-tg]'))){var p=b.dataset.tg.split(','),ri=+p[0],ci=+p[1],row=it.rows[ri],okv=it.okv||'منجزة',nov=it.nov||'غير منجزة',was=row[ci];
    row[ci]=typeof was==='boolean'?!was:(was===okv?nov:okv);var nowOk=row[ci]===true||row[ci]===okv;
    persist();rerenderItem(it.id);refreshDerived();if(nowOk){SND.success();var nb=$('[data-id="'+it.id+'"] [data-tg="'+b.dataset.tg+'"]');if(nb)burstAt(nb,22);}else SND.remove();
    TB.toast(nowOk?'سُجّلت «'+(typeof was==='boolean'?'نعم':okv)+'»':'سُجّلت «'+(typeof was==='boolean'?'لا':nov)+'»',{icon:nowOk?'check':'clock',gold:nowOk});return;}
  if((b=e.target.closest('[data-tdone]'))){var x=it.items[+b.dataset.tdone];if(!x)return;x.done=!x.done;persist();rerenderItem(it.id);refreshDerived();
    if(x.done){SND.success();var nb2=$('[data-id="'+it.id+'"] [data-tdone="'+b.dataset.tdone+'"]');if(nb2)burstAt(nb2,30);TB.toast('أحسنتِ! سُجّل البرنامج منفّذًا',{gold:true,icon:'award'});}else{SND.remove();TB.toast('أُعيد البرنامج إلى غير منفّذ',{icon:'clock'});}return;}
  if((b=e.target.closest('[data-rowdel]'))){withUndo('حُذف الصف',function(){it.rows.splice(+b.dataset.rowdel,1);});return;}
  if(e.target.closest('[data-rowadd]')){var w=(it.head||[]).length||((it.rows[0]||[]).length)||1,tg=it.toggle||[],nr=[];for(var k=0;k<w;k++)nr.push(tg.indexOf(k)>-1?(it.rows[0]&&typeof it.rows[0][k]==='boolean'?false:(it.nov||'غير منجزة')):'');it.rows.push(nr);persist();rerenderItem(it.id);SND.tap();
    var cells=$$('[data-id="'+it.id+'"] tbody tr:last-child [contenteditable]');if(cells[0])cells[0].focus();return;}
  if((b=e.target.closest('[data-gf]'))){GF[it.id]=b.dataset.gf;rerenderItem(it.id);SND.tap();return;}
  if((b=e.target.closest('[data-ga]'))){var gp=b.dataset.ga.split(','),gg=it.items[+gp[0]],ga=gg&&gg.acts[+gp[1]];if(!ga)return;ga.done=!ga.done;GOPEN[gg.id]=1;
    setRefTasks(it.id+'|'+gg.id+'|'+gp[1],ga.done);persist();var rg=b.getBoundingClientRect();rerenderItem(it.id);refreshDerived();
    if(ga.done){SND.success();TB.celebrate(rg.left+rg.width/2,rg.top,{count:24});var pg=goalProg(gg);if(pg.d===pg.n)setTimeout(function(){TB.celebrate(innerWidth/2,innerHeight/3,{count:90});TB.toast('اكتمل الهدف '+(+gp[0]+1)+' من الخطة',{gold:true,icon:'award'});},300);}else SND.remove();return;}
  if((b=e.target.closest('[data-gtoday]'))){var tp2=b.dataset.gtoday.split(','),g2=it.items[+tp2[0]],a2=g2&&g2.acts[+tp2[1]],pl=homePlanner();if(!a2)return;
    if(!pl){TB.toast('لا يوجد قسم «خطتي اليومية»',{icon:'x'});return;}var ref=it.id+'|'+g2.id+'|'+tp2[1],td2=today();
    if((pl.item.tasks||[]).some(function(q){return q.ref===ref&&planVisible(q,td2);})){TB.toast('هذا النشاط موجود في مهام اليوم',{icon:'task'});SND.tap();return;}
    (pl.item.tasks=pl.item.tasks||[]).push({id:uid('t'),t:'خطة المادة: '+a2.t,at:'',rep:'',date:td2,done:{},ref:ref});persist();SND.success();burstAt(b,18);TB.toast('أُضيف إلى مهام اليوم في «خطتي اليومية»',{gold:true,icon:'check'});return;}
  if((b=e.target.closest('[data-gadd]'))){var g3=it.items[+b.dataset.gadd];(g3.acts=g3.acts||[]).push({t:'نشاط جديد'});persist();rerenderItem(it.id);SND.tap();
    var ts=$$('[data-id="'+it.id+'"] [data-g="'+g3.id+'"] [data-gat]');if(ts.length){var l=ts[ts.length-1];l.focus();document.getSelection().selectAllChildren(l);}return;}
  if((b=e.target.closest('[data-gdel]'))){var dp=b.dataset.gdel.split(',');withUndo('حُذف النشاط',function(){it.items[+dp[0]].acts.splice(+dp[1],1);});return;}
  if(e.target.closest('[data-gnew]')){var tdn=today();(it.items=it.items||[]).push({id:uid('g'),dom:'',goal:'هدف جديد',from:tdn,to:tdn,acts:[]});persist();rerenderItem(it.id);refreshDerived();SND.tap();return;}
  if((b=e.target.closest('[data-pl]'))){var a=b.dataset.pl,td=today();
    if(a==='tog'){var t=(it.tasks||[]).filter(function(q){return q.id===b.dataset.t;})[0];if(!t)return;var key=t.rep?td:t.date;t.done=t.done||{};
      if(t.done[key])delete t.done[key];else t.done[key]=1;var dn=!!t.done[key];syncRef(t,dn);persist();
      var r0=b.getBoundingClientRect();rerenderItem(it.id);
      if(dn){SND.success();TB.celebrate(r0.left+r0.width/2,r0.top,{count:24});var l=planToday(it,td);if(l.length&&l.every(function(q){return planDone(q,td);})){setTimeout(function(){TB.celebrate(innerWidth/2,innerHeight/3,{count:90});TB.toast('رائع! أنجزتِ كل مهام اليوم',{gold:true,icon:'award'});},350);}}else SND.tap();return;}
    if(a==='del'){withUndo('حُذفت المهمة',function(){it.tasks=(it.tasks||[]).filter(function(q){return q.id!==b.dataset.t;});});return;}
    if(a==='sug'){var sg=planSuggest(it,td)[+b.dataset.k];if(!sg)return;(it.tasks=it.tasks||[]).push({id:uid('t'),t:sg.t,at:sg.at||'',rep:sg.rep||'',date:td,done:{},ref:sg.ref||''});persist();rerenderItem(it.id);SND.success();TB.toast('أُضيفت إلى مهام اليوم',{gold:true,icon:'check'});return;}
    if(a==='notify'&&'Notification' in window){Notification.requestPermission().then(function(){rerenderItem(it.id);if(Notification.permission==='granted'){TB.toast('سيصلك تذكير في وقت كل مهمة',{gold:true,icon:'bell'});SND.chime();}});return;}}
});
document.addEventListener('submit',function(e){var f=e.target;if(!f.matches||!f.matches('[data-plform]'))return;e.preventDefault();var art=f.closest('[data-id]'),fi=art&&findItem(art.dataset.id);if(!fi)return;
  var t=f.elements.t.value.trim();if(!t)return;(fi.item.tasks=fi.item.tasks||[]).push({id:uid('t'),t:t,at:f.elements.at.value||'',rep:f.elements.rep.value==='week'?'w'+new Date().getDay():(f.elements.rep.value||''),date:today(),done:{}});
  persist();rerenderItem(fi.item.id);SND.success();TB.toast('أُضيفت المهمة',{gold:true,icon:'check'});var nf=$('[data-id="'+fi.item.id+'"] [data-plform] input[name=t]');if(nf&&!('ontouchstart' in window))nf.focus();});
/* تعديل خانات الجدول مباشرة في وضع التحرير */
document.addEventListener('focusout',function(e){var c=e.target.closest&&e.target.closest('td[data-c][contenteditable]');if(!c)return;var art=c.closest('[data-id]'),fi=art&&findItem(art.dataset.id);if(!fi)return;
  var p=c.dataset.c.split(','),v=c.innerText.trim();if(fi.item.rows[+p[0]][+p[1]]===v)return;fi.item.rows[+p[0]][+p[1]]=v;persist();refreshDerived();});
document.addEventListener('focusout',function(e){var c=e.target.closest&&e.target.closest('[data-gat],[data-gg]');if(!c)return;var art=c.closest('[data-id]'),fi=art&&findItem(art.dataset.id);if(!fi)return;var v=c.innerText.trim();
  if(c.dataset.gat){var p=c.dataset.gat.split(','),a=fi.item.items[+p[0]].acts[+p[1]];if(a&&a.t!==v){a.t=v;persist();}return;}
  var q=c.dataset.gg.split(','),g=fi.item.items[+q[0]];if(g&&g[q[1]]!==v){g[q[1]]=v;persist();if(q[1]==='dom')rerenderItem(fi.item.id);}});
document.addEventListener('change',function(e){var c=e.target.closest&&e.target.closest('[data-gd]');if(!c)return;var art=c.closest('[data-id]'),fi=art&&findItem(art.dataset.id);if(!fi)return;var q=c.dataset.gd.split(',');fi.item.items[+q[0]][q[1]]=c.value;persist();});
document.addEventListener('toggle',function(e){var d=e.target;if(d.matches&&d.matches('details.pf-goal')){if(d.open){GOPEN[d.dataset.g]=1;SND.page();}else delete GOPEN[d.dataset.g];}},true);
document.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target.matches&&e.target.matches('[data-gat],[data-gg]:not([data-gg$=",note"])')){e.preventDefault();e.target.blur();return;}
  if(e.key==='Enter'&&e.target.matches&&e.target.matches('td[contenteditable]')){e.preventDefault();e.target.blur();}});
/* التذكير بالمهام في وقتها */
var fired={};
function remind(){if(!S)return;var d=new Date(),td=today(d),hm=pad(d.getHours())+':'+pad(d.getMinutes());
  S.sections.forEach(function(s){s.items.forEach(function(it){if(it.type!=='planner')return;planToday(it,td).forEach(function(t){var k=t.id+td;
    if(!t.at||fired[k]||planDone(t,td)||t.at>hm)return;var ago=(d-new Date(td+'T'+t.at))/6e4;fired[k]=1;if(ago>2)return; // فات وقتها قبل فتح المنصة
    SND.chime();TB.toast('تذكير: '+t.t,{gold:true,icon:'bell'});
    if('Notification' in window&&Notification.permission==='granted'){var o={body:t.t,icon:DEF.icon||'icons/icon-192.png',tag:k,lang:'ar',dir:'rtl'};
      (navigator.serviceWorker&&navigator.serviceWorker.ready?navigator.serviceWorker.ready.then(function(r){return r.showNotification('تذكير من منصتك',o);}):Promise.reject()).catch(function(){try{new Notification('تذكير من منصتك',o);}catch(x){}});}});});});}
setInterval(remind,20000);
var lastDay=today();setInterval(function(){var d=today();if(d!==lastDay){lastDay=d;if(S)refreshDerived();}},60000);

/* ---------- الإقلاع ---------- */
function topbar(){var t=DEF.teacher;
  return '<header class="topbar"><a class="brand" href="#top"><span class="logo">'+I.lang+'</span>'+esc(DEF.brand||t.name)+'</a><div class="tools">'+
    '<button class="round-btn'+(SND.on?' pf-sound-on':'')+'" data-do="sound" aria-label="الأصوات">'+(SND.on?X.sound:X.mute)+'</button>'+
    '<button class="round-btn" data-act="mode" aria-label="فاتح وداكن">'+I.moon+'</button>'+
    '<button class="round-btn" data-act="studio" aria-label="الثيمات">'+I.palette+'</button>'+
    '<button class="round-btn" data-do="edit-toggle" aria-label="تحرير المنصة">'+I.pencil+'</button>'+
    '<button class="round-btn" data-do="more" aria-label="المزيد">'+X.more+'</button></div></header>';}
function editbar(){return '<div class="pf-editbar"><div><b>'+I.pencil+'وضع التحرير</b>'+(CL?'<span class="pf-sync" data-st="ok">'+I.check+'<span>متصل بالسحابة</span></span>':'')+'<button class="btn soft sm" data-do="sec-add">'+I.plus+'قسم جديد</button><button class="btn sm gold" data-do="edit-toggle">'+I.check+'تم</button></div></div>';}

function boot(){
  var app=$('.app');app.insertAdjacentHTML('afterbegin','<div class="pf-progress"><i></i></div>');
  $('#pfTop').outerHTML=topbar();document.body.insertAdjacentHTML('beforeend',editbar());
  trail.init();root.setAttribute('data-edit','off');
  DB.get(KEY).then(function(saved){S=merge(saved);if(!S.teacher)S.teacher=clone(DEF.teacher);
    if(CL)cloudLoad().then(function(rem){if(!rem||!rem.state||!rem.state.sections){if(PIN&&saved)cloudSave();return;}
      // نسخة السحابة هي المرجع، إلا إن كانت على هذا الجهاز تعديلات أحدث لم تُرفع
      var localNewer=saved&&saved.saved&&PIN&&saved.saved>Date.parse(rem.updated_at)+2000&&saved.cloudAt!==rem.updated_at;
      if(localNewer){cloudSave();return;}
      var keepCur=CUR;S=merge(rem.state);S.cloudAt=rem.updated_at;if(!S.teacher)S.teacher=clone(DEF.teacher);DB.set(KEY,S);CUR=keepCur;render();});
    CUR=location.hash.slice(1)||'top';render();});
  if('serviceWorker' in navigator&&location.protocol!=='file:')navigator.serviceWorker.register('sw.js').catch(function(){});
  // البريق المذهّب: احتفال بنقرة مزدوجة على الصورة الرمزية
  document.addEventListener('dblclick',function(e){var a=e.target.closest('.pf-hero .avatar');if(a){var r=a.getBoundingClientRect();TB.celebrate(r.left+r.width/2,r.top+r.height/2,{count:70});SND.success();}});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
window.PF={state:function(){return S;},sound:SND,lightbox:lightbox,render:function(){render();},
  /* أدوات للأنواع الإضافية */
  esc:esc,G:G,head:head,hasText:hasText,uid:uid,today:today,edit:function(){return EDIT;},cur:function(){return CUR;},readImage:readImage,find:findItem,from:computeFrom,goalProg:goalProg,persist:persist,rerender:rerenderItem,refresh:refreshDerived,burst:burstAt};
})();
