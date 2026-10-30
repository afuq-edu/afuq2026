/* =====================================================================
   مزامنة خاصة بين أجهزة المعلمة عبر Supabase (kit/supabase/vault.sql)
   البيانات لا تُقرأ ولا تُكتب إلا بالرمز السري للمنصة.
   Vault({url,key,slug,get,saved,apply,blobs?,status})
     get()      لقطة من الحالة الحالية
     saved()    وقت آخر تعديل محلي (S.saved)
     apply(st)  اعتماد حالة السحابة على هذا الجهاز (دون تغيير saved)
     blobs      اختياري للصور: {keys(),get(k),set(k,v),del(k)}
     status(kind,msg)  kind: off | wait | ok | err
   ===================================================================== */
(function(){
'use strict';
window.Vault=function(o){
  o.url=o.url||window.Vault.URL;o.key=o.key||window.Vault.KEY;
  var MK='vault:'+o.slug,meta={};
  try{meta=JSON.parse(localStorage.getItem(MK))||{};}catch(e){}
  function keep(){try{localStorage.setItem(MK,JSON.stringify(meta));}catch(e){}}
  function st(k,m){if(o.status)o.status(k,m);}
  function rpc(fn,body){return fetch(o.url+'/rest/v1/rpc/'+fn,{method:'POST',cache:'no-store',
      headers:{'Content-Type':'application/json',apikey:o.key,Authorization:'Bearer '+o.key},body:JSON.stringify(body)})
    .then(function(r){return r.json().catch(function(){return {};}).then(function(j){
      if(!r.ok){var e=new Error(j&&j.message||('HTTP '+r.status));e.code=j&&j.message==='locked'?'locked':'net';throw e;}
      if(j&&j.error){var e2=new Error(j.error);e2.code=j.error==='bad pin'?'pin':j.error;e2.rev=j.rev;throw e2;}return j;});});}
  function P(x){x.p_slug=o.slug;x.p_pin=meta.pin;return x;}
  var B=o.blobs;
  function localKeys(){return B?Promise.resolve(B.keys()).then(function(ks){return (ks||[]).map(String);}):Promise.resolve([]);}
  function minus(a,b){return a.filter(function(k){return b.indexOf(k)<0;});}

  function push(remoteKeys){var snap=JSON.parse(JSON.stringify(o.get())),at=o.saved()||0;
    return localKeys().then(function(lk){var up=minus(lk,remoteKeys);
      return up.reduce(function(p,k,i){return p.then(function(){st('wait','رفع الصور '+(i+1)+' من '+up.length+'…');
        return Promise.resolve(B.get(k)).then(function(v){if(v)return rpc('vault_blob_put',P({p_k:k,p_v:v}));});});},Promise.resolve())
      .then(function(){return rpc('vault_push',P({p_state:snap,p_base:meta.rev||0}));})
      .then(function(r){meta.rev=r.rev;meta.saved=at;meta.at=r.at;keep();
        var gone=minus(remoteKeys,lk);if(gone.length)rpc('vault_blob_del',P({p_ks:gone})).catch(function(){});return 'up';});});}

  function pull(rem){return localKeys().then(function(lk){var need=minus(rem.keys||[],lk);
      var chunks=[];for(var i=0;i<need.length;i+=4)chunks.push(need.slice(i,i+4));
      return chunks.reduce(function(p,c,i){return p.then(function(){st('wait','تنزيل الصور '+(i+1)+' من '+chunks.length+'…');
        return rpc('vault_blob_get',P({p_ks:c})).then(function(r){var bl=r.blobs||{};return Promise.all(Object.keys(bl).map(function(k){return B.set(k,bl[k]);}));});});},Promise.resolve())
      .then(function(){return Promise.resolve(o.apply(rem.state));})
      .then(function(){meta.rev=rem.rev;meta.saved=o.saved()||0;meta.at=rem.at;keep();
        if(B)minus(lk,rem.keys||[]).forEach(function(k){B.del(k);});return 'down';});});}

  var busy=null,again=false;
  function sync(auto){if(!meta.pin)return Promise.reject(new Error('nopin'));
    if(busy){again=true;return busy;}
    st('wait','جارٍ المزامنة…');
    busy=rpc('vault_pull',P({})).then(function(rem){
      var first=meta.rev==null,dirty=(o.saved()||0)>(meta.saved||0),changed=rem.rev!==meta.rev;
      if(!rem.state)return push(rem.keys||[]);
      if(first&&!(o.saved()||0))return pull(rem);
      if(first){if(confirm('توجد نسخة محفوظة في السحابة'+(rem.at?' بتاريخ '+new Date(rem.at).toLocaleString('ar-OM'):'')+'.\n\n«موافق» = اعتماد نسخة السحابة على هذا الجهاز\n«إلغاء» = رفع نسخة هذا الجهاز بدلًا منها'))return pull(rem);
        meta.rev=rem.rev;return push(rem.keys||[]);}
      if(changed&&dirty){if(confirm('عُدّلت المنصة على جهاز آخر وعلى هذا الجهاز معًا.\n\n«موافق» = اعتماد نسخة السحابة (أحدث تعديل من الجهاز الآخر)\n«إلغاء» = رفع نسخة هذا الجهاز'))return pull(rem);
        meta.rev=rem.rev;return push(rem.keys||[]);}
      if(changed)return pull(rem);
      if(dirty)return push(rem.keys||[]);
      return 'same';})
    .then(function(r){st('ok',r==='down'?'وصلت آخر التعديلات من السحابة':r==='up'?'حُفظت التعديلات في السحابة':'كل الأجهزة متطابقة');return r;},
      function(e){if(e.code==='conflict'){again=true;return 'retry';}
        if(e.code==='pin'){meta={};keep();st('err','الرمز غير صحيح');}
        else st('err',e.code==='locked'?'محاولات كثيرة، حاولي بعد 10 دقائق':'تعذّر الاتصال، ستتم المزامنة لاحقًا');
        if(!auto)throw e;})
    .then(function(r){busy=null;if(again){again=false;return sync(true);}return r;},function(e){busy=null;again=false;throw e;});
    return busy;}

  var KIND='off',MSG='';
  function paint(){document.querySelectorAll('[data-vault]').forEach(function(b){b.setAttribute('data-vs',KIND);b.title=MSG||'المزامنة';});
    var m=document.querySelector('.sheet .vs-msg');if(m){m.textContent=MSG||'';m.setAttribute('data-vs',KIND);}}
  var userSt=o.status;o.status=function(k,m){KIND=k;MSG=m;paint();if(userSt)userSt(k,m);};

  var T;
  function later(){if(!meta.pin)return;clearTimeout(T);T=setTimeout(function(){if(navigator.onLine!==false)sync(true);},4000);}
  addEventListener('online',later);
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible')later();});
  function when(t){return t?new Date(t).toLocaleString('ar-OM',{weekday:'long',day:'numeric',month:'long',hour:'numeric',minute:'2-digit'}):'—';}
  function sheet(){var TB=window.TB,I=TB.I;
    if(!meta.pin){TB.sheet('<form class="stack vs-sheet" id="vsForm"><p>اربطي هذا الجهاز بالسحابة لتظهر تعديلاتك على كل أجهزتك (الهاتف والحاسوب والآيباد) تلقائيًا.</p>'+
      '<label class="field"><span class="lbl">الرمز السري للمنصة</span><input class="input vs-pin" name="pin" inputmode="numeric" autocomplete="off" dir="ltr" required minlength="4" maxlength="20" placeholder="••••••"></label>'+
      '<p class="vs-msg note" data-vs="'+KIND+'">'+(MSG||'')+'</p><button class="btn gold block" type="submit">'+I.check+'ربط هذا الجهاز ومزامنته</button>'+
      '<p class="note">البيانات خاصة بكِ ولا تُفتح إلا بهذا الرمز. استخدمي الرمز نفسه في كل جهاز.</p></form>',{title:'المزامنة بين الأجهزة',icon:'upload'});
      var f=document.getElementById('vsForm');f.onsubmit=function(e){e.preventDefault();var btn=f.querySelector('button[type=submit]');btn.disabled=true;
        link(f.elements.pin.value).then(function(){TB.closeSheet();TB.toast(MSG||'تم الربط',{gold:true,icon:'check'});},function(){btn.disabled=false;});};
      setTimeout(function(){var i=f.querySelector('input');if(i)i.focus();},200);return;}
    TB.sheet('<div class="stack vs-sheet"><div class="vs-state"><span class="vs-big" data-vault>'+window.Vault.ICON+'<i class="vs-dot"></i></span><div><b>المزامنة مفعّلة على هذا الجهاز</b><small>آخر مزامنة: '+when(meta.at)+'</small></div></div>'+
      '<p class="vs-msg note" data-vs="'+KIND+'">'+(MSG||'')+'</p>'+
      '<button class="btn gold block" id="vsNow">'+window.Vault.ICON+'مزامنة الآن</button>'+
      '<p class="note">تتم المزامنة تلقائيًا عند فتح المنصة وبعد كل تعديل بثوانٍ. وإذا عُدّلت على جهازين معًا فستُسألين أيّ نسخة تعتمدين.</p>'+
      '<button class="btn ghost sm" id="vsOff">إيقاف المزامنة على هذا الجهاز</button></div>',{title:'المزامنة بين الأجهزة',icon:'upload'});
    paint();
    document.getElementById('vsNow').onclick=function(){var b=this;b.disabled=true;sync(false).then(function(){TB.closeSheet();TB.toast(MSG,{icon:'check'});},function(){b.disabled=false;});};
    document.getElementById('vsOff').onclick=function(){if(!confirm('إيقاف المزامنة على هذا الجهاز؟ تبقى بياناتك عليه وفي السحابة كما هي.'))return;meta={};keep();o.status('off','');TB.closeSheet();};}
  function link(pin){var old=meta;meta={pin:String(pin).trim()};
    return sync(false).catch(function(e){if(e.code==='pin'||e.code==='locked')meta={};else if(old.pin)meta=old;keep();throw e;});}
  document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-vault]');if(!b||b.closest('.sheet'))return;e.preventDefault();sheet();});

  return {
    sheet:sheet,
    linked:function(){return !!meta.pin;},
    last:function(){return meta.at||null;},
    link:link,
    sync:function(){return sync(false);},
    later:later,
    boot:function(){if(meta.pin){st('wait','');sync(true);}else st('off','');},
    paint:paint
  };
};
/* مشروع Supabase المشترك لكل المنصات */
window.Vault.URL='';
window.Vault.KEY='';
window.Vault.ICON='<svg class="vs-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 18a4.5 4.5 0 0 1-.6-9A6 6 0 0 1 18 9.5a4 4 0 0 1-.5 8.5"/><path d="M9.5 14.5 12 12l2.5 2.5M12 12v7"/></svg>';
(function(){var c=document.createElement('style');c.textContent=
  '[data-vault]{position:relative}[data-vault] .vs-dot{position:absolute;top:5px;inset-inline-end:5px;width:9px;height:9px;border-radius:50%;background:var(--muted);box-shadow:0 0 0 2px var(--glass2,transparent);transition:background .3s}'+
  '[data-vs="ok"] .vs-dot{background:var(--good)}[data-vs="err"] .vs-dot{background:var(--late)}[data-vs="wait"] .vs-dot{background:var(--gold)}'+
  '[data-vs="wait"] .vs-ic{animation:vsPulse 1.2s ease-in-out infinite}@keyframes vsPulse{50%{transform:translateY(-2px);opacity:.55}}'+
  '.vs-state{display:flex;align-items:center;gap:14px}.vs-state b{display:block}.vs-state small{color:var(--muted)}'+
  '.vs-big{display:grid;place-items:center;width:54px;height:54px;border-radius:18px;background:var(--accent-soft);color:var(--accent);flex:none}.vs-big svg{width:28px;height:28px}.vs-big .vs-dot{top:6px;inset-inline-end:6px}'+
  '.vs-msg:empty{display:none}.vs-msg[data-vs="err"]{color:var(--late)}.vs-msg[data-vs="ok"]{color:var(--good)}'+
  '.vs-pin{font-size:1.4rem;letter-spacing:.4em;text-align:center}'+
  '@media (prefers-reduced-motion:reduce){[data-vs="wait"] .vs-ic{animation:none}}';
  (document.head||document.documentElement).appendChild(c);})();
})();
