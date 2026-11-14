/* =====================================================================
   «أسماء» · النواة: أدوات، أيقونات، تخزين السجلات والملفات، حوارات، عارض صور،
   ثيمات، سماء ومجرّة، ترحيب، تثبيت، موجّه الصفحات.
   البيانات: المحتوى الجاهز في data.js، وكل ما تضيفه المعلمة أو تعدّله «سجل» مستقل
   {id,k(النوع),t(وقت آخر تعديل),c(وقت الإنشاء),del?} في IndexedDB 'asma'.
   ===================================================================== */
(function(){
'use strict';
var DA=window.DA={};
var $=DA.$=function(s,r){return (r||document).querySelector(s);};
var $$=DA.$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));};
var esc=DA.esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});};
DA.uid=function(p){return (p||'r')+Date.now().toString(36)+Math.random().toString(36).slice(2,6);};
DA.has=function(s){return s!=null&&String(s).trim()!=='';};
DA.pct=function(a,b){return b?Math.round(a/b*100):0;};
DA.lsg=function(k,d){try{var v=localStorage.getItem((window.APPID||'idara')+':'+k);return v?JSON.parse(v):d;}catch(e){return d;}};
DA.lss=function(k,v){try{localStorage.setItem((window.APPID||'idara')+':'+k,JSON.stringify(v));}catch(e){}};
var MONTHS=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
DA.MONTHS=MONTHS;
DA.fmtD=function(iso){if(!iso)return '';var p=String(iso).split('-');if(p.length<3)return iso;return (+p[2])+' '+MONTHS[+p[1]-1]+' '+p[0];};
DA.dParts=function(iso){var p=String(iso||'').split('-');return p.length<3?null:{d:+p[2],m:MONTHS[+p[1]-1]};};
DA.today=function(){var d=new Date();return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2);};

/* ---------- أيقونات ---------- */
var P={
 home:'<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
 star:'<path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/>',
 target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
 users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6.5 6.5 0 0 1 4 6"/>',
 eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
 chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
 heart:'<path d="M12 20s-7-4.4-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.6-9 9-9 9z"/>',
 grow:'<path d="M12 20v-8"/><path d="M12 12c0-4 3-7 8-7 0 5-3 7-8 7z"/><path d="M12 14c0-3-2.5-5.5-7-5.5 0 4 2.5 5.5 7 5.5z"/>',
 cap:'<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/><path d="M22 9v6"/>',
 check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
 list:'<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',
 book:'<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z"/><path d="M20 4h-4a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h5z"/>',
 gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1A1.6 1.6 0 0 0 9 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1A1.6 1.6 0 0 0 4.6 9a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M14 6l4 4"/>',
 trash:'<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
 x:'<path d="M6 6l12 12M18 6L6 18"/>',
 cloud:'<path d="M7 18a4.5 4.5 0 0 1-.6-9A6 6 0 0 1 18 9.5a4 4 0 0 1-.5 8.5"/><path d="M9.5 14.5 12 12l2.5 2.5M12 12v7"/>',
 pal:'<path d="M12 3a9 9 0 1 0 0 18c1.2 0 2-.8 2-2 0-.6-.2-1-.5-1.4-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.3A4.7 4.7 0 0 0 22 9.7C22 6 17.5 3 12 3z"/><circle cx="7.5" cy="11" r="1.2"/><circle cx="10.5" cy="7" r="1.2"/><circle cx="15.5" cy="7.5" r="1.2"/>',
 dl:'<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
 up:'<path d="M12 21V9M7 14l5-5 5 5M5 3h14"/>',
 img:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/>',
 file:'<path d="M6 3h8l5 5v13H6z"/><path d="M14 3v5h5M9 13h7M9 17h5"/>',
 cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
 search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
 more:'<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
 left:'<path d="M15 6l-6 6 6 6"/>',right:'<path d="M9 6l6 6-6 6"/>',
 zoom:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4M11 8v6M8 11h6"/>',
 bulb:'<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>',
 flag:'<path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/>',
 clip:'<path d="M20 12l-8.5 8.5a5 5 0 0 1-7-7L13 5a3.5 3.5 0 0 1 5 5l-8.5 8.5a2 2 0 0 1-3-3L14 8"/>',
 print:'<path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M6 14h12v7H6z"/>',
 play:'<circle cx="12" cy="12" r="9"/><path d="M10 8.5l5.5 3.5-5.5 3.5z"/>',
 share:'<path d="M12 3v12M8 7l4-4 4 4"/><path d="M5 12v8h14v-8"/>',
 vol:'<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 9a4 4 0 0 1 0 6"/>',mute:'<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M17 10l4 4M21 10l-4 4"/>',
 undo:'<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>',
 lock:'<rect x="4" y="10" width="20" height="11" rx="3" transform="translate(-2)"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
 pillar:'<path d="M5 21h14M6 18h12M8 18V8M16 18V8M12 18V8M5 8h14M4 5h16l-2 3H6z"/>',
 mosque:'<path d="M3 21h18M5 21v-8h14v8"/><path d="M8 13a4 4 0 0 1 8 0"/><path d="M12 5v4M12 5a1.5 1.5 0 1 0 0-.1"/>',
 noor:'<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>',
 quiz:'<path d="M9 4h6v3H9z"/><path d="M7 5H5v16h14V5h-2"/><path d="M9 12l2 2 4-4M9 17h6"/>',
 apps:'<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
 plane:'<path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/>',
 globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>',
 abc:'<path d="M3 18l3.5-10L10 18M4.3 14.5h4.4"/><path d="M13 8v10h3a2.5 2.5 0 0 0 0-5h-3 2.6a2.3 2.3 0 0 0 0-5z"/><path d="M21.5 10a3 3 0 1 0 0 6"/>',
 tasks:'<path d="M4 6l1.5 1.5L8 5M4 12l1.5 1.5L8 11M4 18l1.5 1.5L8 17"/><path d="M11 6h9M11 12h9M11 18h9"/>',
 layers:'<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
 link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
 quote:'<path d="M7 17c-2 0-3-1.5-3-3.5C4 10 6 7 9 6M17 17c-2 0-3-1.5-3-3.5C14 10 16 7 19 6"/>',
 swap:'<path d="M7 4L3 8l4 4"/><path d="M3 8h13a4 4 0 0 1 4 4"/><path d="M17 20l4-4-4-4"/><path d="M21 16H8a4 4 0 0 1-4-4"/>',
 bell:'<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2.2 2.2 0 0 0 4 0"/>',
 compass:'<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
 ladder:'<path d="M7 3v18M17 3v18M7 7h10M7 12h10M7 17h10"/>',
 pen:'<path d="M4 20l1-4L16 5l3 3L8 19z"/><path d="M14 7l3 3"/>',
 video:'<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3z"/>'
};
DA.P=P;
DA.ic=function(n){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(P[n]||P.star)+'</svg>';};
DA.starSVG=function(cls){return '<svg class="'+(cls||'')+'" viewBox="0 0 120 120" aria-hidden="true"><path d="M60 8l14 32 32 14-32 14-14 32-14-32-32-14 32-14z"/><rect x="30" y="30" width="60" height="60" transform="rotate(45 60 60)"/><circle cx="60" cy="60" r="12"/></svg>';};
/* ---------- صوت: نقرات هادئة غير موسيقية ---------- */
var AC=null;
DA.snd=function(kind){if(DA.lsg('mute',false))return;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();var len=kind==='ok'?.14:.045;
  var b=AC.createBuffer(1,Math.floor(AC.sampleRate*len),AC.sampleRate),dd=b.getChannelData(0);for(var i=0;i<dd.length;i++){dd[i]=(Math.random()*2-1)*Math.pow(1-i/dd.length,kind==='ok'?3:6);}
  var s=AC.createBufferSource();s.buffer=b;var f=AC.createBiquadFilter();f.type='bandpass';var tn=DA.tone||[1300,2200];f.frequency.value=kind==='ok'?tn[0]:tn[1];f.Q.value=1.1;var g=AC.createGain();g.gain.value=kind==='ok'?.28:.18;s.connect(f);f.connect(g);g.connect(AC.destination);s.start();}catch(e){}};

/* ---------- تنبيه وحوار ---------- */
var tt=null;
DA.toast=function(m,o){o=o||{};var old=$('.toast');if(old)old.remove();var d=document.createElement('div');d.className='toast';d.setAttribute('role','status');
  d.innerHTML='<span>'+esc(m)+'</span>'+(o.undo?'<button type="button">تراجع</button>':'');document.body.appendChild(d);
  if(o.undo)$('button',d).onclick=function(){d.remove();o.undo();};clearTimeout(tt);tt=setTimeout(function(){d.remove();},o.undo?6000:2600);};
DA.dlg=function(html,o){o=o||{};var d=document.createElement('div');d.className='dlg';d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');
  d.innerHTML='<div class="box'+(o.wide?' wide':'')+'"><button type="button" class="ib x" aria-label="إغلاق">'+DA.ic('x')+'</button>'+html+'</div>';
  document.body.appendChild(d);document.body.style.overflow='hidden';
  var close=function(){if(!d.parentNode)return;d.remove();if(!$('.dlg'))document.body.style.overflow='';document.removeEventListener('keydown',k);if(o.onClose)o.onClose();};
  var k=function(e){if(e.key==='Escape'&&!$('.lb'))close();};document.addEventListener('keydown',k);
  d.addEventListener('click',function(e){if(e.target===d)close();});$('.x',d).onclick=close;
  $$('[data-close]',d).forEach(function(b){b.onclick=close;});d.close=close;return d;};
DA.ask=function(msg,yes,o){o=o||{};var d=DA.dlg('<h2>'+esc(o.title||'تأكيد')+'</h2><p>'+msg+'</p><div class="acts"><button class="btn ghost" data-close>إلغاء</button><button class="btn '+(o.danger?'danger':'gold')+'" data-yes>'+esc(o.ok||'نعم')+'</button></div>');
  $('[data-yes]',d).onclick=function(){d.close();yes();};};

/* ---------- قاعدة البيانات المحلية ---------- */
var dbp=null;
function idb(){if(dbp)return dbp;dbp=new Promise(function(res,rej){var r=indexedDB.open((window.APPID||'idara')+'-db',1);r.onupgradeneeded=function(){var db=r.result;['rec','file','meta'].forEach(function(s){if(!db.objectStoreNames.contains(s))db.createObjectStore(s);});};r.onsuccess=function(){res(r.result);};r.onerror=function(){rej(r.error);};});return dbp;}
function tx(store,mode,fn){return idb().then(function(db){return new Promise(function(res,rej){var t=db.transaction(store,mode),s=t.objectStore(store),out=fn(s);t.oncomplete=function(){res(out instanceof IDBRequest?out.result:out);};t.onerror=function(){rej(t.error);};t.onabort=function(){rej(t.error);};});});}
DA.idbGet=function(store,k){return tx(store,'readonly',function(s){return s.get(k);});};
DA.idbSet=function(store,k,v){return tx(store,'readwrite',function(s){s.put(v,k);});};
DA.idbDel=function(store,k){return tx(store,'readwrite',function(s){s.delete(k);});};
DA.idbAll=function(store){return idb().then(function(db){return new Promise(function(res,rej){var out={},t=db.transaction(store,'readonly'),c=t.objectStore(store).openCursor();c.onsuccess=function(){var cu=c.result;if(cu){out[cu.key]=cu.value;cu.continue();}};t.oncomplete=function(){res(out);};t.onerror=function(){rej(t.error);};});});};

/* ---------- السجلات ---------- */
var R={},dirty={},listeners=[];
DA.R=R;
DA.on=function(fn){listeners.push(fn);};
function emit(src){listeners.forEach(function(f){try{f(src);}catch(e){console.error(e);}});}
DA.load=function(){return Promise.all([DA.idbAll('rec'),DA.idbGet('meta','dirty')]).then(function(a){Object.keys(a[0]).forEach(function(k){R[k]=a[0][k];});dirty=a[1]||{};}).catch(function(e){console.warn('idb',e);});};
DA.rec=function(id){var r=R[id];return r&&!r.del?r:null;};
DA.list=function(k,f){return Object.keys(R).map(function(id){return R[id];}).filter(function(r){return r.K===k&&!r.del&&(!f||f(r));}).sort(function(a,b){return (a.c||0)-(b.c||0);});};
DA.put=function(r){var now=Date.now();if(!r.id)r.id=DA.uid(r.K?r.K.slice(0,2):'r');if(!r.c)r.c=(R[r.id]&&R[r.id].c)||now;r.T=Math.max(now,((R[r.id]&&R[r.id].T)||0)+1);delete r.del;
  R[r.id]=r;dirty[r.id]=1;DA.idbSet('rec',r.id,r).catch(function(){DA.toast('تعذّر الحفظ على هذا الجهاز');});DA.idbSet('meta','dirty',dirty);emit('local');return r;};
DA.del=function(id){var old=R[id];if(!old)return null;var keep=JSON.parse(JSON.stringify(old));var r={id:id,K:old.K,c:old.c,T:Math.max(Date.now(),(old.T||0)+1),del:1};R[id]=r;dirty[id]=1;DA.idbSet('rec',id,r);DA.idbSet('meta','dirty',dirty);emit('local');return keep;};
DA.bulk=function(list){var now=Date.now();return idb().then(function(db){return new Promise(function(res,rej){var t=db.transaction('rec','readwrite'),st=t.objectStore('rec');list.forEach(function(r,i){if(!r.c)r.c=now+i;r.T=now;R[r.id]=r;st.put(r,r.id);});t.oncomplete=function(){emit('local');res();};t.onerror=function(){rej(t.error);};});});};
DA.wipe=function(){return idb().then(function(db){return new Promise(function(res){var t=db.transaction(['rec','file','meta'],'readwrite');['rec','file','meta'].forEach(function(s){t.objectStore(s).clear();});t.oncomplete=function(){Object.keys(R).forEach(function(k){delete R[k];});res();};});});};
DA.restore=function(r){delete r.del;return DA.put(r);};
/* من المزامنة: يُطبَّق السجل البعيد إن كان أحدث */
DA.applyRemote=function(r){var l=R[r.id];if(l&&(l.T||0)>=(r.T||0))return false;R[r.id]=r;if(dirty[r.id]){delete dirty[r.id];DA.idbSet('meta','dirty',dirty);}DA.idbSet('rec',r.id,r);return true;};
DA.dirty=function(){return dirty;};
DA.clean=function(ids,ts){ids.forEach(function(id){if(R[id]&&R[id].T===ts[id])delete dirty[id];});DA.idbSet('meta','dirty',dirty);};
DA.emit=emit;
/* تعديل عنصر جاهز: سجل ov_<id> يحمل الحقول المعدّلة، و hide لإخفائه */
DA.ov=function(id){return DA.rec('ov_'+id);};
DA.merge=function(item,kind){var o=DA.ov(item.id);if(!o)return item;var m={};Object.keys(item).forEach(function(k){m[k]=item[k];});Object.keys(o).forEach(function(k){if(['id','K','T','c','of'].indexOf(k)<0)m[k]=o[k];});m._ov=1;return m;};
DA.setOv=function(id,kind,fields){var o=DA.ov(id)||{id:'ov_'+id,K:'ov',of:kind};Object.keys(fields).forEach(function(k){o[k]=fields[k];});return DA.put(o);};
/* القائمة الموحّدة: الجاهز (بعد التعديل وبلا المخفي) ثم المُضاف بالشكل نفسه */
DA.coll=function(kind,builtins){var out=(builtins||[]).map(function(b){return DA.merge(b,kind);}).filter(function(b){return !b.hide;});
  return out.concat(DA.list(kind).map(function(r){var m={};Object.keys(r).forEach(function(k){m[k]=r[k];});m._mine=1;return m;}));};

/* ---------- الملفات (صور وPDF) ---------- */
var urls={},fetchers={};
DA.saveFile=function(blob,name){var id=DA.uid('f');var meta={id:id,name:name||blob.name||'ملف',type:blob.type||'application/octet-stream',size:blob.size,blob:blob,t:Date.now()};
  return DA.idbSet('file',id,meta).then(function(){var fd=DA.lsg('fdirty',{});fd[id]=1;DA.lss('fdirty',fd);if(DA.Sync)DA.Sync.kick();return id;});};
DA.getFile=function(id){return DA.idbGet('file',id).then(function(m){if(m)return m;if(DA.Sync&&DA.Sync.fetchFile){if(!fetchers[id])fetchers[id]=DA.Sync.fetchFile(id).then(function(m2){delete fetchers[id];return m2;});return fetchers[id];}return null;});};
DA.fileURL=function(id){if(urls[id])return Promise.resolve(urls[id]);return DA.getFile(id).then(function(m){if(!m||!m.blob)return '';urls[id]=URL.createObjectURL(m.blob);return urls[id];});};
DA.imgSrc=function(v){return v&&v.indexOf('f')===0&&v.indexOf('/')<0?'':v;};
/* أي عنصر يحمل data-fid يُملأ بالرابط عند توفره */
DA.hydrate=function(root){$$('[data-fid]',root||document).forEach(function(el){var id=el.getAttribute('data-fid');if(!id||el._h===id)return;el._h=id;
  DA.fileURL(id).then(function(u){if(!u){el.classList.add('missing');return;}if(el.tagName==='IMG')el.src=u;else if(el.tagName==='A')el.href=u;else el.style.backgroundImage='url("'+u+'")';});});};
/* ضغط الصور قبل الحفظ: أقصى ضلع 1600 */
DA.shrink=function(file,max){max=max||1600;return new Promise(function(res){if(!/^image\//.test(file.type)||/gif|svg/.test(file.type)){res(file);return;}
  var u=URL.createObjectURL(file),im=new Image();im.onload=function(){var w=im.naturalWidth,h=im.naturalHeight,s=Math.min(1,max/Math.max(w,h));if(s===1&&file.size<600000){URL.revokeObjectURL(u);res(file);return;}
    var c=document.createElement('canvas');c.width=Math.round(w*s);c.height=Math.round(h*s);c.getContext('2d').drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);
    c.toBlob(function(b){res(b?new File([b],(file.name||'صورة').replace(/\.\w+$/,'')+'.jpg',{type:'image/jpeg'}):file);},'image/jpeg',.84);};im.onerror=function(){URL.revokeObjectURL(u);res(file);};im.src=u;});};
DA.pick=function(accept,multi){return new Promise(function(res){var i=document.createElement('input');i.type='file';i.accept=accept||'image/*';if(multi)i.multiple=true;i.style.display='none';document.body.appendChild(i);
  i.onchange=function(){var f=Array.prototype.slice.call(i.files||[]);i.remove();res(f);};i.click();});};

/* ---------- عارض الصور ---------- */
DA.lightbox=function(list,start,title){if(!list||!list.length)return;var i=start||0,sc=1,tx0=0,ty0=0;
  var d=document.createElement('div');d.className='lb';d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');
  d.innerHTML='<div class="lbt"><b></b><button class="ib" data-z aria-label="تكبير">'+DA.ic('zoom')+'</button><a class="ib" data-dl aria-label="تنزيل" download>'+DA.ic('dl')+'</a><button class="ib" data-x aria-label="إغلاق">'+DA.ic('x')+'</button></div>'+
   '<div class="stage"><img alt="">'+(list.length>1?'<button class="nav2 prev" aria-label="السابقة">'+DA.ic('right')+'</button><button class="nav2 next" aria-label="التالية">'+DA.ic('left')+'</button>':'')+'</div><div class="cap"></div>'+
   (list.length>1&&list.length<80?'<div class="strip">'+list.map(function(x,j){return '<img data-j="'+j+'" alt="" loading="lazy" '+(x.fid?'data-fid="'+esc(x.fid)+'"':'src="'+esc(x.thumb||x.src)+'"')+'>';}).join('')+'</div>':'');
  document.body.appendChild(d);DA.hydrate(d);var img=$('.stage img',d);
  function tf(){img.style.transform='translate('+tx0+'px,'+ty0+'px) scale('+sc+')';}
  function show(){var x=list[i];sc=1;tx0=ty0=0;tf();$('.lbt b',d).textContent=(title?title+' · ':'')+(list.length>1?(i+1)+' من '+list.length:'');
    $('.cap',d).textContent=x.cap||'';if(x.fid){img.removeAttribute('src');DA.fileURL(x.fid).then(function(u){img.src=u;$('[data-dl]',d).href=u;});}else{img.src=x.src;$('[data-dl]',d).href=x.src;}
    $$('.strip img',d).forEach(function(t){t.classList.toggle('on',+t.dataset.j===i);});var on=$('.strip img.on',d);if(on)on.scrollIntoView({block:'nearest',inline:'center'});}
  function go(k){i=(i+k+list.length)%list.length;show();}
  function close(){d.remove();document.removeEventListener('keydown',kd);}
  var kd=function(e){if(e.key==='Escape')close();else if(e.key==='ArrowLeft')go(1);else if(e.key==='ArrowRight')go(-1);};document.addEventListener('keydown',kd);
  $('[data-x]',d).onclick=close;$('[data-z]',d).onclick=function(){sc=sc>1?1:2.2;tx0=ty0=0;tf();};
  if($('.prev',d)){$('.prev',d).onclick=function(){go(-1);};$('.next',d).onclick=function(){go(1);};}
  $$('.strip img',d).forEach(function(t){t.onclick=function(){i=+t.dataset.j;show();};});
  img.ondblclick=function(){sc=sc>1?1:2.2;tx0=ty0=0;tf();};
  var st=$('.stage',d),pts={},sx=0,sy=0,pd0=0,ps=1,moved=false;
  st.addEventListener('pointerdown',function(e){pts[e.pointerId]=e;moved=false;sx=e.clientX-tx0;sy=e.clientY-ty0;var k=Object.keys(pts);if(k.length===2){var a=pts[k[0]],b=pts[k[1]];pd0=Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);ps=sc;}});
  st.addEventListener('pointermove',function(e){if(!pts[e.pointerId])return;pts[e.pointerId]=e;var k=Object.keys(pts);
    if(k.length===2){var a=pts[k[0]],b=pts[k[1]];sc=Math.max(1,Math.min(5,ps*Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY)/pd0));tf();}
    else if(sc>1){tx0=e.clientX-sx;ty0=e.clientY-sy;moved=true;tf();}else{tx0=e.clientX-sx;moved=Math.abs(tx0)>8;img.style.transform='translateX('+tx0+'px)';}});
  function up(e){var k=Object.keys(pts);delete pts[e.pointerId];if(sc===1&&k.length===1){if(Math.abs(tx0)>70&&list.length>1)go(tx0<0?1:-1);else{tx0=0;tf();}}}
  st.addEventListener('pointerup',up);st.addEventListener('pointercancel',up);
  st.addEventListener('wheel',function(e){e.preventDefault();sc=Math.max(1,Math.min(5,sc*(e.deltaY<0?1.15:.87)));if(sc===1)tx0=ty0=0;tf();},{passive:false});
  show();};

var REDUCED=DA.REDUCED=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
/* الثيمات والمشاهد الحيّة في fx.js */

/* ---------- الظهور التدريجي ---------- */
DA.animIn=function(m){if(REDUCED)return;$$('.view>*',m).forEach(function(k,i){if(i<12){k.classList.add('rise');k.style.setProperty('--i',i);}});
  $$('.hero h1, .sec-head .h1',m).forEach(function(h){if(h.querySelector('.wd'))return;var wi=0;(function walk(n){Array.prototype.slice.call(n.childNodes).forEach(function(c){if(c.nodeType===3){var f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(function(t){if(!t)return;if(/^\s+$/.test(t)){f.appendChild(document.createTextNode(t));return;}var sp=document.createElement('span');sp.className='wd';sp.style.setProperty('--w',wi++);sp.textContent=t;f.appendChild(sp);});c.parentNode.replaceChild(f,c);}else if(c.nodeType===1)walk(c);});})(h);});};
DA.greet=function(){var h=new Date().getHours();return h<12?'صباح الخير':'مساء الخير';};
/* شعار المنصة: شعار المدرسة (كتاب مفتوح وقلم ودوائر رقمية) بخلفية شفافة */
DA.emblem=function(cls,full){return '<img class="'+(cls||'emb')+'" src="media/brand/'+(full?'logo':'mark')+'.webp" alt="" decoding="async" draggable="false">';};
DA.splash=function(T,done){if(REDUCED){done();return;}try{if(sessionStorage.getItem((window.APPID||'idara')+'-splash')){done();return;}sessionStorage.setItem((window.APPID||'idara')+'-splash','1');}catch(e){}
  var h=new Date().getHours(),en=h<12?'Good morning':(h<17?'Good afternoon':'Good evening');
  var star='<svg class="sp-star" viewBox="0 0 200 200" aria-hidden="true"><path d="M100 8l22 48 50-14-14 50 48 22-48 22 14 50-50-14-22 48-22-48-50 14 14-50-48-22 48-22-14-50 50 14z"/><circle cx="100" cy="100" r="62"/><circle cx="100" cy="100" r="70" class="dash"/></svg>';
  var drops='';for(var i=0;i<14;i++)drops+='<i style="--x:'+(Math.random()*100).toFixed(1)+'%;--d:'+(Math.random()*1.6).toFixed(2)+'s;--h:'+(40+Math.random()*60).toFixed(0)+'px"></i>';
  var d=document.createElement('div');d.className='splash';d.setAttribute('role','presentation');
  d.innerHTML='<div class="sp-rain" aria-hidden="true">'+drops+'</div><div class="sp-in"><div class="sp-mark">'+star+DA.emblem('sp-em',0)+'</div><div class="sp-en">'+en+'</div><div class="sp-g">'+DA.greet()+'، أهلًا بكِ</div><div class="sp-t">'+esc(T.short?'أ. '+T.short:T.name)+'</div><div class="sp-s">'+esc(T.role)+' · '+esc(T.schoolS||T.school)+'</div><div class="sp-q">'+esc(T.mottoAr||T.motto)+'</div><div class="sp-arch" aria-hidden="true"></div></div>';
  document.body.appendChild(d);document.body.classList.add('splashing');var fin=false,end=function(){if(fin)return;fin=true;d.classList.add('out');document.body.classList.remove('splashing');done();setTimeout(function(){d.remove();},900);};d.onclick=end;setTimeout(end,3400);};

/* ---------- التثبيت ---------- */
var deferred=null;
addEventListener('beforeinstallprompt',function(e){e.preventDefault();deferred=e;});
DA.standalone=function(){return (window.matchMedia&&matchMedia('(display-mode: standalone)').matches)||navigator.standalone===true;};
DA.install=function(){if(deferred){deferred.prompt();deferred.userChoice.then(function(){deferred=null;});return;}
  var ios=/iphone|ipad|ipod|macintosh/i.test(navigator.userAgent)&&'ontouchend' in document;
  DA.dlg('<h2>تثبيت المنصة</h2>'+(ios?'<div class="ios"><div>افتحي المنصة في متصفح <b>Safari</b></div><div>اضغطي زر المشاركة '+DA.ic('share')+' أسفل الشاشة</div><div>اختاري <b>«إضافة إلى الشاشة الرئيسية»</b></div><div>اضغطي <b>«إضافة»</b>، فتظهر أيقونة المنصة بين تطبيقاتك</div></div>':
   '<div class="ios"><div>في Chrome أو Edge: اضغطي زر التثبيت '+DA.ic('dl')+' في شريط العنوان</div><div>أو من القائمة ⋮ اختاري <b>«تثبيت التطبيق»</b> أو <b>«إضافة إلى الشاشة الرئيسية»</b></div><div>تفتح المنصة بعدها كتطبيق مستقل، وتعمل دون إنترنت</div></div>')+'<div class="acts"><button class="btn gold" data-close>حسنًا</button></div>');};

/* ---------- عامل الخدمة ---------- */
if('serviceWorker' in navigator&&location.protocol!=='file:')addEventListener('load',function(){navigator.serviceWorker.register('sw.js').catch(function(){});});
})();
