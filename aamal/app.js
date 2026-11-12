/* =====================================================================
   «منصة الأعمال» · منصة أعمال الطلاب والمدرسة في مجلدات
   - دخولان: حساب مشترك للمعلمات، وحساب خاص لصاحبة المنصة (Firebase Email/Password).
   - المجلدات والأعمال سجلات في DA.R، تُزامَن بالمزامنة الآمنة (safe-sync.js):
     كل سجل مستند مستقل، والجديد يُضاف دون مسح السابق، والفارغ لا يُكتب فوق المكتوب.
   - الملفات (صور، PDF، فيديو، مستندات) في IndexedDB، وتُرفع أجزاءً وتُنزَّل على الأجهزة الأخرى.
   ===================================================================== */
(function(){
'use strict';
var DA=window.DA,$=DA.$,$$=DA.$$,esc=DA.esc,ic=DA.ic,Z=window.SafeSync;
var DOM='khizana'+'.ofuq.team';
var ALIAS={'المعلمات':'muallimat','معلمات':'muallimat','المعلمة':'muallimat','معلمة':'muallimat','teachers':'muallimat','teacher':'muallimat',
  'سامية':'samia','ساميه':'samia','samiya':'samia','samya':'samia'};
var ADMIN='samia';
function userOf(v){v=String(v||'').trim().toLowerCase().replace(/\s+/g,'');return ALIAS[v]||v;}
function roleOf(email){return String(email||'').split('@')[0]===ADMIN?'a':'t';}
window.SAFE_SYNC&&(window.SAFE_SYNC.emails=['muallimat@'+DOM,ADMIN+'@'+DOM]);

var ROLE=DA.lsg('role',null),DEV=DA.lsg('dev',null);if(!DEV){DEV=DA.uid('d');DA.lss('dev',DEV);}
function isA(){return ROLE==='a';}
function me(){return DA.lsg('me','');}
var TODAY=DA.today();

/* ---------- المحتوى الجاهز: مجلدات فارغة تبدأ منها ---------- */
var BF=[
 {id:'fd_students',K:'fold',n:'أعمال الطلاب',d:'لوحات الطلاب ومشاريعهم وأوراق عملهم وإبداعاتهم',ic:'cap',c:'a',p:'',o:1},
 {id:'fd_school',K:'fold',n:'أعمال المدرسة',d:'الخطط والتقارير والمبادرات والإنجازات والشواهد',ic:'award',c:'b',p:'',o:2},
 {id:'fd_events',K:'fold',n:'الأنشطة والفعاليات',d:'صور المناسبات والإذاعة والمسابقات والرحلات',ic:'flag',c:'good',p:'',o:3}];
var COLORS=[['a','ذهبي'],['b','زيتي'],['good','أخضر'],['warn','عنبري'],['bad','عنابي'],['hd','داكن']];
var ICONS=['folder','cap','award','flag','book','img','video','star','heart','pen','globe','bulb','users','cal','layers','sprout'];

function cfg(){var r=DA.rec('cfg_site')||{};return {title:r.title||'منصة الأعمال',owner:r.owner||'',school:r.school||'',motto:r.motto||'كل عمل جميل يستحق مكانًا يليق به'};}
function T(){var c=cfg();return {name:c.owner||c.title,short:'',role:c.owner?'صاحبة المنصة: '+c.owner:'أعمال الطلاب والمدرسة في مجلدات',school:c.school,schoolS:c.school||'مجلدات متزامنة بين الأجهزة',mottoAr:c.motto};}

function folders(){return DA.coll('fold',BF).sort(function(a,b){return (a.o||99)-(b.o||99)||(a.c||0)-(b.c||0);});}
function fold(id){return folders().filter(function(f){return f.id===id;})[0]||null;}
function kids(id){return folders().filter(function(f){return (f.p||'')===(id||'');});}
function desc(id){var out=[];kids(id).forEach(function(k){out.push(k);out=out.concat(desc(k.id));});return out;}
function trail(id){var t=[],f=fold(id),g=0;while(f&&g++<20){t.unshift(f);f=f.p?fold(f.p):null;}return t;}
function works(f){return DA.list('work',f).sort(function(a,b){return (b.dt||'').localeCompare(a.dt||'')||(b.c||0)-(a.c||0);});}
function worksIn(id,deep){var ids={};ids[id]=1;if(deep)desc(id).forEach(function(d){ids[d.id]=1;});return works(function(w){return ids[w.f];});}
function fcol(c){return 'var(--'+(c||'a')+')';}
function canW(w){return isA()||w.dev===DEV;}
function canF(f){return isA()||(f._mine&&f.dev===DEV);}

/* ---------- الملفات ---------- */
function kind(f){var t=f.ty||'',n=(f.n||'').toLowerCase();if(/^image\//.test(t))return 'img';if(/pdf/.test(t)||/\.pdf$/.test(n))return 'pdf';if(/^video\//.test(t))return 'vid';if(/^audio\//.test(t))return 'aud';
  if(/sheet|excel|\.xlsx?$|\.csv$/.test(t+n))return 'xls';if(/presentation|powerpoint|\.pptx?$|\.key$/.test(t+n))return 'ppt';if(/word|\.docx?$|\.pages$/.test(t+n))return 'doc';return 'file';}
var KN={img:['صورة','img'],pdf:['PDF','book'],vid:['فيديو','video'],aud:['صوت','vol'],doc:['مستند','file'],xls:['جدول','list'],ppt:['عرض','play'],file:['ملف','clip']};
function size(b){if(!b)return '';if(b<1024*1024)return Math.max(1,Math.round(b/1024))+' ك.ب';return (b/1048576).toFixed(b<10485760?1:0)+' م.ب';}
function coverOf(w){var im=(w.files||[]).filter(function(f){return kind(f)==='img';})[0];return im?(im.th||im.id):'';}
function counts(w){var o={};(w.files||[]).forEach(function(f){var k=kind(f);o[k]=(o[k]||0)+1;});return o;}
function fileIds(){var ids={};DA.list('work').forEach(function(w){(w.files||[]).forEach(function(f){ids[f.id]=1;if(f.th)ids[f.th]=1;});});return ids;}

/* ---------- لمسات المنصة: الوقت النسبي، «جديد»، اختصار الأسماء الطويلة ---------- */
var SEEN=DA.lsg('seen',0);DA.lss('seen',Date.now());
function ago(t){if(!t)return '';var m=Math.round((Date.now()-t)/60000);if(m<1)return 'الآن';if(m<60)return 'قبل '+(m===1?'دقيقة':m===2?'دقيقتين':m<=10?m+' دقائق':m+' دقيقة');var h=Math.round(m/60);if(h<24)return 'قبل '+(h===1?'ساعة':h===2?'ساعتين':h<=10?h+' ساعات':h+' ساعة');var d=Math.round(h/24);if(d<7)return d===1?'أمس':'قبل '+(d===2?'يومين':d+' أيام');return '';}
function isNew(w){return SEEN&&w.c>SEEN&&w.dev!==DEV;}
function mid(n,k){n=String(n||'');k=k||34;if(n.length<=k)return n;var e=n.lastIndexOf('.');var ext=e>0&&n.length-e<=6?n.slice(e):'';var b=n.slice(0,n.length-ext.length);return b.slice(0,k-ext.length-8)+'…'+b.slice(-5)+ext;}
/* ---------- قطع الواجهة ---------- */
var WD={w:['عمل','أعمال','عملًا'],f:['مجلد','مجلدات','مجلدًا'],c:['ملف','ملفات','ملفًا'],p:['مشارِكة','مشارِكات','مشارِكة']};
function nw(n,k){var w=WD[k];return n%100>=3&&n%100<=10?w[1]:(n===1||n===2||n===0?w[0]:w[2]);}
function head(en,title,d,acts){return '<div class="sec-head"><div class="tx"><div class="eyebrow"><span class="en">'+esc(en)+'</span></div><h2 class="h1">'+esc(title)+'</h2>'+(d?'<p>'+esc(d)+'</p>':'')+'</div>'+(acts?'<div class="row">'+acts+'</div>':'')+'</div>';}
function ctitle(icn,t,extra){return '<div class="ctitle"><span class="ci">'+ic(icn)+'</span><h3>'+esc(t)+'</h3><span class="sp"></span>'+(extra||'')+'</div>';}
function empty(icn,t,d,btn){return '<div class="empty">'+ic(icn)+'<b>'+esc(t)+'</b><span>'+esc(d)+'</span>'+(btn||'')+'</div>';}
function addWorkBtn(fid,cls){return '<button class="btn '+(cls||'gold')+'" data-addw="'+esc(fid||'')+'">'+ic('plus')+'أضيفي عملًا</button>';}
function addFoldBtn(pid,cls){return '<button class="btn '+(cls||'line')+'" data-addf="'+esc(pid||'')+'">'+ic('folder')+'مجلد جديد</button>';}

function foldCard(f){var W=worksIn(f.id,true),sub=kids(f.id).length,ims=[];W.some(function(w){var c=coverOf(w);if(c)ims.push(c);return ims.length>=3;});
  return '<a class="kz-fold" href="#f/'+esc(f.id)+'" style="--fc:'+fcol(f.c)+'"><span class="tab" aria-hidden="true"></span>'+
   '<span class="papers" aria-hidden="true">'+ims.map(function(id,i){return '<img data-fid="'+esc(id)+'" alt="" style="--k:'+i+'">';}).join('')+(ims.length?'':'<i></i><i></i>')+'</span>'+
   '<span class="fb"><span class="fi">'+ic(f.ic||'folder')+'</span><b>'+esc(f.n)+'</b>'+(f.d?'<small>'+esc(f.d)+'</small>':'')+
   '<span class="fm">'+(W[0]&&ago(W[0].c)?'<span class="t3-last" title="آخر إضافة">'+ic('cal')+esc(ago(W[0].c))+'</span>':'')+'<span>'+(W.length?W.length+' '+nw(W.length,'w'):'فارغ بعد')+'</span>'+(sub?'<span>'+sub+' '+nw(sub,'f')+'</span>':'')+'</span></span></a>';}
function newFoldCard(pid){return '<button class="kz-fold add" data-addf="'+esc(pid||'')+'"><span class="tab" aria-hidden="true"></span><span class="fb"><span class="fi">'+ic('plus')+'</span><b>مجلد جديد</b><small>'+(pid?'مجلد داخل هذا المجلد':'أنشئي مجلدًا بأي اسم، فيظهر بشكل المجلدات الجاهزة')+'</small></span></button>';}

function workCard(w,showF){var cv=coverOf(w),n=(w.files||[]).length,k=counts(w),f=showF&&fold(w.f),first=(w.files||[])[0],fk=first?kind(first):'file';
  return '<div class="card wk kz-wk'+(isNew(w)?' t3-new':'')+'" data-work="'+esc(w.id)+'" tabindex="0" role="button"><div class="cover">'+(isNew(w)?'<span class="t3-rib">جديد</span>':'')+(cv?'<img data-fid="'+esc(cv)+'" alt="" loading="lazy">':'<span class="ph k-'+fk+'">'+ic(KN[fk][1])+'<em>'+esc(KN[fk][0])+'</em></span>')+
   (n>1?'<span class="tag">'+n+' '+nw(n,'c')+'</span>':'')+'<span class="kinds">'+Object.keys(k).filter(function(x){return x!=='img'||!cv||k.img>1;}).map(function(x){return '<i title="'+esc(KN[x][0])+'">'+ic(KN[x][1])+'</i>';}).join('')+'</span></div>'+
   '<div class="bd"><b>'+esc(w.t||'عمل بلا عنوان')+'</b><small>'+[w.by,ago(w.c)||(w.dt?DA.fmtD(w.dt):''),f?f.n:''].filter(Boolean).map(esc).join(' · ')+'</small>'+(w.d?'<p class="clamp">'+esc(w.d)+'</p>':'')+'</div></div>';}

/* ---------- الواجهات ---------- */
var CUR='home',ARG='',fK='all',fSort='new',fQ='';
function stats(){var W=works(),files=0,by={};W.forEach(function(w){files+=(w.files||[]).length;if(w.by)by[w.by]=1;});
  var nf=folders().length,np=Object.keys(by).length;return [['folder',nf,nw(nf,'f')],['img',W.length,nw(W.length,'w')],['clip',files,nw(files,'c')],['users',np,nw(np,'p')]];}
function vHome(){var t=cfg(),W=works(),ims=[];W.some(function(w){var c=coverOf(w);if(c)ims.push({id:c,t:w.t});return ims.length>=3;});
  var hero='<section class="hero kz-hero"><div class="hero-in"><div class="medal">'+DA.emblem('emb')+'</div><div class="hx"><div class="greet"><span class="en">School Works</span> · '+DA.greet()+(ROLE==='t'&&me()?'، '+esc(me()):'')+'</div><h1>'+esc(t.owner||t.title)+'</h1>'+
    '<div class="role">'+(t.owner?esc(t.title)+' · أعمال الطلاب والمدرسة':'أعمال الطلاب والمدرسة في مجلدات')+(t.school?' · '+esc(t.school):'')+'</div>'+
    '<div class="chips">'+stats().map(function(s){return '<span class="chip">'+ic(s[0])+'<b>'+s[1]+'</b> '+s[2]+'</span>';}).join('')+'</div>'+
    '<div class="row hero-acts">'+addWorkBtn('')+'<a class="btn line" href="#all">'+ic('search')+'البحث في الأعمال</a></div></div>'+
    '<div class="polar" aria-hidden="true">'+(ims.length?ims.map(function(x,i){return '<figure style="--k:'+i+'"><img data-fid="'+esc(x.id)+'" alt=""><figcaption>'+esc(x.t||'')+'</figcaption></figure>';}).join(''):'<figure style="--k:0"><span>'+ic('img')+'</span><figcaption>أول عمل</figcaption></figure><figure style="--k:1"><span>'+ic('folder')+'</span><figcaption>في مجلده</figcaption></figure>')+'</div></div>'+
    '<div class="motto"><span>'+esc(t.motto)+'</span></div><div class="hero-deco hexes" aria-hidden="true"></div></section>';
  var top=kids('');
  return hero+'<section class="kz-sec">'+head('Folders','المجلدات','افتحي أي مجلد وأضيفي فيه أعمالك، أو أنشئي مجلدًا جديدًا داخله.',addFoldBtn(''))+
   '<div class="kz-folds">'+top.map(foldCard).join('')+newFoldCard('')+'</div></section>'+
   '<section class="kz-sec">'+head('Latest','أحدث الأعمال',W.length?'ما أضافته المعلمات مؤخرًا، من كل الأجهزة.':'',W.length?'<a class="btn ghost" href="#all">كل الأعمال</a>':'')+
   (W.length?'<div class="works">'+W.slice(0,6).map(function(w){return workCard(w,true);}).join('')+'</div>':'<div class="card">'+empty('img','المنصة تنتظر أول عمل','اضغطي «أضيفي عملًا»، واختاري المجلد والصور أو الملفات، فيظهر العمل هنا وعلى أجهزة المعلمات كلها.',addWorkBtn(''))+'</div>')+'</section>';}

function filters(list){var q=fQ.toLowerCase();var L=list.filter(function(w){if(fK!=='all'&&!(w.files||[]).some(function(f){var k=kind(f);return fK==='doc'?/doc|xls|ppt|file|aud/.test(k):k===fK;}))return false;
    if(q&&[w.t,w.d,w.by].concat((w.files||[]).map(function(f){return f.n;})).join(' ').toLowerCase().indexOf(q)<0)return false;return true;});
  if(fSort==='old')L.reverse();else if(fSort==='az')L.sort(function(a,b){return (a.t||'').localeCompare(b.t||'','ar');});return L;}
function toolbar(n){return '<div class="kz-tools"><label class="kz-q">'+ic('search')+'<input class="input" type="search" data-q placeholder="ابحثي بالعنوان أو الوصف أو اسم المعلمة" value="'+esc(fQ)+'"></label>'+
  '<div class="seg" data-seg="fK">'+[['all','الكل'],['img','صور'],['pdf','PDF'],['vid','فيديو'],['doc','مستندات']].map(function(x){return '<button data-v="'+x[0]+'" class="'+(fK===x[0]?'on':'')+'">'+x[1]+'</button>';}).join('')+'</div>'+
  '<select class="input sm" data-sort aria-label="الترتيب">'+[['new','الأحدث أولًا'],['old','الأقدم أولًا'],['az','بالعنوان']].map(function(x){return '<option value="'+x[0]+'"'+(fSort===x[0]?' selected':'')+'>'+x[1]+'</option>';}).join('')+'</select>'+
  '<span class="note">'+n+'</span></div>';}
function vFolder(){var f=fold(ARG);if(!f){location.hash='#home';return '';}
  var tr=trail(f.id),sub=kids(f.id),all=worksIn(f.id,false),W=filters(all);
  var crumbs='<nav class="kz-crumbs" aria-label="المسار"><a href="#home">'+ic('home')+'الرئيسية</a>'+tr.map(function(x,i){return '<span>›</span>'+(i<tr.length-1?'<a href="#f/'+esc(x.id)+'">'+esc(x.n)+'</a>':'<b>'+esc(x.n)+'</b>');}).join('')+'</nav>';
  var acts=addWorkBtn(f.id)+addFoldBtn(f.id)+(canF(f)?'<button class="ib" data-editf="'+esc(f.id)+'" aria-label="تعديل المجلد" title="تعديل المجلد">'+ic('edit')+'</button><button class="ib" data-delf="'+esc(f.id)+'" aria-label="حذف المجلد" title="حذف المجلد">'+ic('trash')+'</button>':'');
  return crumbs+'<section class="kz-fhead card" style="--fc:'+fcol(f.c)+'"><span class="fi">'+ic(f.ic||'folder')+'</span><div class="tx"><h2 class="h1">'+esc(f.n)+'</h2>'+(f.d?'<p>'+esc(f.d)+'</p>':'')+
   '<div class="chips"><span class="chip">'+all.length+' '+nw(all.length,'w')+'</span>'+(sub.length?'<span class="chip">'+sub.length+' مجلد فرعي</span>':'')+'</div></div><div class="row">'+acts+'</div></section>'+
   (sub.length?'<section class="kz-sec"><div class="kz-folds sm">'+sub.map(foldCard).join('')+newFoldCard(f.id)+'</div></section>':'')+
   '<section class="kz-sec">'+(all.length?toolbar(W.length+' من '+all.length)+(W.length?'<div class="works">'+W.map(function(w){return workCard(w,false);}).join('')+'</div>':'<div class="card">'+empty('search','لا نتائج','غيّري البحث أو نوع الملفات.')+'</div>'):
     '<div class="card kz-drop-empty" data-dropf="'+esc(f.id)+'">'+empty('up','المجلد فارغ','أضيفي أول عمل: صورًا أو ملفات PDF أو فيديو أو مستندات. ويمكنك سحب الملفات وإفلاتها هنا مباشرة.',addWorkBtn(f.id))+'</div>')+'</section>';}
function vAll(){var all=works(),W=filters(all);
  return head('All Works','كل الأعمال','كل ما في المنصة من كل المجلدات، مع البحث والتصفية.',addWorkBtn(''))+toolbar(W.length+' من '+all.length)+
   (W.length?'<div class="works">'+W.map(function(w){return workCard(w,true);}).join('')+'</div>':'<div class="card">'+empty(all.length?'search':'img',all.length?'لا نتائج':'لا أعمال بعد',all.length?'غيّري البحث أو نوع الملفات.':'ابدئي بإضافة أول عمل.',all.length?'':addWorkBtn(''))+'</div>');}

function syncCard(){return '<div class="card">'+ctitle('cloud','المزامنة بين الأجهزة')+'<div class="sync-st" data-st="'+(Z?Z.state():'off')+'"><i></i><span>'+esc(Z?Z.msg():'')+'</span></div><p class="note" style="margin-top:10px">تعمل وحدها: كل ما تضيفه أي معلمة يُحفظ على جهازها فورًا، ثم يُرفع ويظهر على كل الأجهزة. والجديد يُضاف دون أن يمسح ما أضافه غيرها.</p></div>';}
function vSettings(){var t=cfg();
  var acct='<div class="card">'+ctitle('user','حسابي')+'<div class="kv"><div><span>نوع الدخول</span>'+(isA()?'صاحبة المنصة (صلاحيات كاملة)':'حساب المعلمات المشترك')+'</div>'+(!isA()?'<div><span>اسمي على أعمالي</span>'+esc(me()||'لم يُكتب بعد')+'</div>':'')+'</div>'+
    '<div class="row" style="margin-top:12px">'+(!isA()?'<button class="btn line" data-myname>'+ic('edit')+'تعديل اسمي</button>':'')+'<button class="btn ghost" data-logout>'+ic('left')+'تسجيل الخروج</button></div></div>';
  var site=isA()?'<div class="card">'+ctitle('pen','بيانات المنصة')+'<div class="kv"><div><span>اسم المنصة</span>'+esc(t.title)+'</div><div><span>صاحبة المنصة</span>'+esc(t.owner||'لم يُكتب بعد')+'</div><div><span>المدرسة</span>'+esc(t.school||'لم تُكتب بعد')+'</div><div><span>العبارة</span>'+esc(t.motto)+'</div></div><div class="row" style="margin-top:12px"><button class="btn line" data-cfg>'+ic('edit')+'تعديل البيانات</button></div></div>':'';
  var pw=isA()?'<div class="card">'+ctitle('lock','كلمات المرور')+'<p class="note" style="margin-bottom:12px">غيّري كلمة دخولك الخاصة، أو كلمة حساب المعلمات المشترك (تحتاجين كلمته الحالية). بعد التغيير يُطلب الدخول من جديد على الأجهزة الأخرى بالكلمة الجديدة.</p><div class="row"><button class="btn line" data-pw="me">'+ic('lock')+'كلمة دخولي</button><button class="btn line" data-pw="t">'+ic('users')+'كلمة حساب المعلمات</button></div></div>':'';
  var theme='<div class="card">'+ctitle('pal','الثيمات')+'<div class="skins">'+DA.SKINS.map(function(s){return '<button class="skin sk-'+s[0]+(DA.skin()===s[0]?' on':'')+'" data-skin="'+s[0]+'" aria-pressed="'+(DA.skin()===s[0])+'"><i><em></em></i><span class="sn">'+esc(s[1])+'</span><small>'+esc(s[2])+'</small></button>';}).join('')+'</div>'+
    '<label class="row" style="margin-top:14px"><input type="checkbox" data-mute '+(DA.lsg('mute',false)?'':'checked')+'> <span>أصوات طبيعية هادئة عند النقر والتنقل</span></label></div>';
  var bk=isA()?'<div class="card">'+ctitle('dl','النسخة الاحتياطية')+'<p class="note" style="margin-bottom:12px">إلى جانب المزامنة، نزّلي نسخة كاملة بالملفات بين حين وآخر، واستعيديها على أي جهاز.</p><div class="row"><button class="btn gold" data-export>'+ic('dl')+'تنزيل نسخة احتياطية</button><button class="btn line" data-import>'+ic('up')+'استعادة نسخة</button></div></div>':'';
  var inst='<div class="card">'+ctitle('dl','تثبيت المنصة')+'<p class="note" style="margin-bottom:12px">ثبّتيها على الشاشة الرئيسية لتفتح كتطبيق. في آيفون وآيباد: افتحيها في Safari، ثم زر المشاركة، ثم «إضافة إلى الشاشة الرئيسية».</p><button class="btn line" data-install>'+ic('dl')+'تثبيت</button></div>';
  return head('Settings','الإعدادات')+'<div class="grid kz-set">'+syncCard()+acct+site+pw+theme+bk+inst+'</div>';}

var VIEWS={home:vHome,f:vFolder,all:vAll,settings:vSettings};
var NAV=[['home','الرئيسية','home'],['all','كل الأعمال','img']];
function shell(){var t=cfg();document.getElementById('app').innerHTML=DA.fxHTML()+'<div class="app"><header class="top"><div class="top-in"><a class="brand" href="#home"><span class="plaque">'+DA.emblem('emb')+'</span><span><b>'+esc(t.title)+'</b><small>'+esc(isA()?'صاحبة المنصة':(me()||'المعلمات'))+(t.school?' · '+esc(t.school):'')+'</small></span></a>'+
  '<div class="tools"><span class="tb sdot" aria-hidden="true"><i class="dot" data-sync title="'+esc(Z?Z.msg():'')+'" data-st="'+(Z?Z.state():'off')+'"></i></span><button class="tb opt" data-skinnext aria-label="تغيير الثيم" title="تغيير الثيم">'+ic('pal')+'</button>'+(DA.standalone()?'':'<button class="tb inst" data-install>'+ic('dl')+'<span class="lbl">تثبيت</span></button>')+'</div></div></header>'+
  '<div class="layout"><nav class="nav" aria-label="الأقسام">'+NAV.map(function(n){return '<a href="#'+n[0]+'" data-nav="'+n[0]+'"><span class="ni">'+ic(n[2])+'</span>'+esc(n[1])+'</a>';}).join('')+'<div class="sep"></div><div class="nav-h">المجلدات</div><div class="kz-tree">'+tree('')+'</div>'+
  '<button class="addsec" data-addf="">'+ic('plus')+'مجلد جديد</button><div class="sep"></div><a href="#settings" data-nav="settings"><span class="ni">'+ic('gear')+'</span>الإعدادات</a><div class="nfoot">'+esc(t.motto)+'</div></nav><main id="main" aria-live="polite"></main></div>'+
  '<nav class="tabbar" aria-label="التنقل"><a href="#home" data-nav="home">'+ic('home')+'<span>الرئيسية</span></a><button data-folders>'+ic('folder')+'<span>المجلدات</span></button><button class="fab" data-addw="">'+ic('plus')+'<span>أضيفي</span></button><a href="#all" data-nav="all">'+ic('search')+'<span>الأعمال</span></a><a href="#settings" data-nav="settings">'+ic('gear')+'<span>الإعدادات</span></a></nav></div>';
  bindAll(document.querySelector('.app'));if(DA.FX)DA.applySkin();}
function tree(pid,lv){lv=lv||0;return kids(pid).map(function(f){var on=CUR==='f'&&(ARG===f.id||trail(ARG).some(function(x){return x.id===f.id;}));
  return '<a href="#f/'+esc(f.id)+'" data-nav="f/'+esc(f.id)+'" style="--lv:'+lv+';--fc:'+fcol(f.c)+'"><span class="ni">'+ic(f.ic||'folder')+'</span>'+esc(f.n)+'</a>'+(on&&lv<3?tree(f.id,lv+1):'');}).join('');}
function foldersSheet(){var d=DA.dlg('<h2>المجلدات</h2><div class="kz-sheet">'+(function walk(pid,lv){return kids(pid).map(function(f){return '<a class="btn line" href="#f/'+esc(f.id)+'" style="--lv:'+lv+';--fc:'+fcol(f.c)+'">'+ic(f.ic||'folder')+esc(f.n)+'<small>'+worksIn(f.id,true).length+'</small></a>'+walk(f.id,lv+1);}).join('');})('',0)+'</div><div class="acts"><button class="btn ghost" data-close>إغلاق</button><button class="btn gold" data-nf>'+ic('plus')+'مجلد جديد</button></div>');
  $$('a',d).forEach(function(a){a.addEventListener('click',function(){d.close();});});$('[data-nf]',d).onclick=function(){d.close();foldForm(null,CUR==='f'?ARG:'');};}
function render(){var m=$('#main');if(!m)return;var t=cfg(),html=(VIEWS[CUR]||vHome)();m.innerHTML='<div class="view v-'+CUR+'">'+html+'<div class="foot"><b>'+esc(t.motto)+'</b><br>'+esc(t.title)+(t.owner?' · '+esc(t.owner):'')+'</div></div>';
  var key=CUR==='f'?'f/'+ARG:CUR;$$('[data-nav]').forEach(function(a){a.classList.toggle('on',a.dataset.nav===key);});var tr=$('.kz-tree');if(tr)tr.innerHTML=tree('');$$('.kz-tree [data-nav]').forEach(function(a){a.classList.toggle('on',a.dataset.nav===key);});
  DA.hydrate(m);DA.hydrate($('.nav'));bindAll(m);
  if(FLASH){var fe=$('[data-work="'+FLASH+'"]',m);FLASH=null;if(fe){fe.classList.add('t3-flash');setTimeout(function(){fe.scrollIntoView({block:'center',behavior:DA.REDUCED?'auto':'smooth'});},120);}}}
var FLASH=null;
function route(){if(!ROLE){showLogin();return;}if(!$('.app'))shell();$$('.dlg').forEach(function(d){if(d.close)d.close();});var h=(location.hash||'#home').slice(1).split('/');var n=VIEWS[h[0]]?h[0]:'home',a=decodeURIComponent(h[1]||''),ch=n!==CUR||a!==ARG||!$('#main .view');
  if(ch&&(n!==CUR||a!==ARG)){fQ='';fK='all';}CUR=n;ARG=a;render();if(ch){window.scrollTo(0,0);DA.animIn($('#main'));if(DA.sfx)DA.sfx('nav');}}
function keep(){var y=window.scrollY;render();window.scrollTo(0,y);}

/* ---------- نموذج العمل ---------- */
function foldOpts(sel){var out='';(function walk(pid,lv){kids(pid).forEach(function(f){out+='<option value="'+esc(f.id)+'"'+(f.id===sel?' selected':'')+'>'+'   '.repeat(lv)+(lv?'↳ ':'')+esc(f.n)+'</option>';walk(f.id,lv+1);});})('',0);return out;}
function workForm(id,fid,preFiles){var w=id?DA.rec(id):null;if(w&&!canW(w)){DA.toast('يمكن تعديل العمل لمن أضافته أو لصاحبة المنصة');return;}
  var keepF=w?(w.files||[]).slice():[],add=[];fid=w?w.f:(fid||(CUR==='f'?ARG:'')||(fold(DA.lsg('lastf',''))?DA.lsg('lastf',''):'')||(kids('')[0]||{}).id);
  var d=DA.dlg('<h2>'+(w?'تعديل العمل':'أضيفي عملًا')+'</h2>'+
   '<label class="field"><span>عنوان العمل</span><input class="input" data-k="t" maxlength="140" placeholder="مثال: لوحة «وطني» للصف الرابع" value="'+esc(w?w.t:'')+'"></label>'+
   '<div class="grid g2"><label class="field"><span>المجلد</span><select class="input" data-k="f">'+foldOpts(fid)+'</select></label><label class="field"><span>التاريخ</span><input class="input" type="date" data-k="dt" value="'+esc(w?w.dt:TODAY)+'"></label></div>'+
   '<label class="field"><span>اسم المعلمة</span><input class="input" data-k="by" maxlength="60" placeholder="يظهر على العمل" value="'+esc(w?w.by||'':(isA()?cfg().owner:me()))+'"></label>'+
   '<label class="field"><span>وصف قصير (اختياري)</span><textarea class="textarea" data-k="d" rows="2" maxlength="1200" placeholder="الصف، المناسبة، فكرة العمل…">'+esc(w?w.d||'':'')+'</textarea></label>'+
   '<div class="kz-drop" tabindex="0" role="button" aria-label="اختيار الملفات">'+ic('up')+'<b>اسحبي الملفات هنا أو اضغطي لاختيارها</b><small>صور، PDF، فيديو، Word، PowerPoint، Excel… حتى 50 م.ب للملف الواحد</small><span class="row"><button type="button" class="btn sm line" data-cam>'+ic('img')+'التقاط صورة</button></span></div>'+
   '<div class="kz-flist"></div><div class="kz-prog" hidden><i></i><span></span></div>'+
   '<div class="acts"><button class="btn ghost" data-close>إلغاء</button><button class="btn gold" data-sv>'+ic('check')+(w?'حفظ التعديل':'حفظ العمل')+'</button></div>',{wide:1});
  var list=$('.kz-flist',d);
  function draw(){list.innerHTML=keepF.map(function(f,i){return chip(f.n,kind(f),f.sz,f.th||(kind(f)==='img'?f.id:''),'k'+i);}).join('')+add.map(function(f,i){return chip(f.name,kind({ty:f.type,n:f.name}),f.size,'','a'+i,f);}).join('');
    DA.hydrate(list);$$('[data-rm]',list).forEach(function(b){b.onclick=function(e){e.stopPropagation();var k=b.dataset.rm;if(k[0]==='k')keepF.splice(+k.slice(1),1);else add.splice(+k.slice(1),1);draw();};});
    $$('img[data-blob]',list).forEach(function(im){var f=add[+im.dataset.blob];if(f){im.src=URL.createObjectURL(f);}});}
  function chip(n,k,sz,th,key,raw){return '<div class="kz-fc"><span class="th">'+(th?'<img data-fid="'+esc(th)+'" alt="">':(raw&&k==='img'?'<img data-blob="'+key.slice(1)+'" alt="">':ic(KN[k][1])))+'</span><span class="nm"><b title="'+esc(n||'')+'">'+esc(mid(n||'ملف'))+'</b><small>'+KN[k][0]+(sz?' · '+size(sz):'')+'</small></span><button type="button" class="ib" data-rm="'+key+'" aria-label="إزالة">'+ic('x')+'</button></div>';}
  function take(fs){var big=0;fs.forEach(function(f){if(f.size>50*1048576){big++;return;}add.push(f);});if(big)DA.toast(big+' ملف أكبر من 50 م.ب لم يُضف');draw();if(!$('[data-k=t]',d).value&&add[0])$('[data-k=t]',d).value=add[0].name.replace(/\.[^.]+$/,'').replace(/[_-]+/g,' ').slice(0,140);}
  var dz=$('.kz-drop',d);dz.onclick=function(e){if(e.target.closest('[data-cam]'))return;DA.pick('*/*',true).then(take);};dz.onkeydown=function(e){if(e.key==='Enter'){e.preventDefault();dz.click();}};
  $('[data-cam]',d).onclick=function(e){e.stopPropagation();var i=document.createElement('input');i.type='file';i.accept='image/*';i.setAttribute('capture','environment');i.style.display='none';document.body.appendChild(i);i.onchange=function(){take(Array.prototype.slice.call(i.files||[]));i.remove();};i.click();};
  ['dragenter','dragover'].forEach(function(ev){dz.addEventListener(ev,function(e){e.preventDefault();dz.classList.add('on');});});['dragleave','drop'].forEach(function(ev){dz.addEventListener(ev,function(e){e.preventDefault();dz.classList.remove('on');});});
  dz.addEventListener('drop',function(e){take(Array.prototype.slice.call(e.dataTransfer.files||[]));});
  if(preFiles)take(preFiles);else draw();
  var busy=false;
  $('[data-sv]',d).onclick=function(){if(busy)return;var v=function(k){return $('[data-k='+k+']',d).value.trim();};
    if(!keepF.length&&!add.length&&!v('t')){DA.toast('اكتبي عنوانًا أو أضيفي ملفًا');return;}if(!v('f')){DA.toast('اختاري المجلد');return;}
    busy=true;var pr=$('.kz-prog',d);pr.hidden=false;var done=0,out=[];
    function step(){pr.querySelector('i').style.width=(add.length?Math.round(done/add.length*100):100)+'%';pr.querySelector('span').textContent=add.length?'جارٍ حفظ الملفات '+done+' من '+add.length+'…':'';}
    step();var p=Promise.resolve();
    add.forEach(function(f){p=p.then(function(){var k=kind({ty:f.type,n:f.name});
      if(k!=='img'||/gif|svg/.test(f.type))return DA.saveFile(f,f.name).then(function(id){out.push({id:id,n:f.name,ty:f.type||'application/octet-stream',sz:f.size});});
      return DA.shrink(f,2000).then(function(big){return DA.shrink(f,520).then(function(sm){return DA.saveFile(big,f.name).then(function(id){return DA.saveFile(sm,'thumb-'+f.name).then(function(th){out.push({id:id,th:th,n:f.name,ty:big.type||f.type,sz:big.size});});});});});
    }).then(function(){done++;step();});});
    p.then(function(){var by=v('by');if(!isA()&&by&&!me())DA.lss('me',by);
      var r=w?JSON.parse(JSON.stringify(w)):{K:'work',dev:DEV};r.t=v('t')||(out[0]&&out[0].n.replace(/\.[^.]+$/,''))||'عمل';r.f=v('f');r.dt=v('dt')||TODAY;r.by=by;r.d=v('d');r.files=keepF.concat(out);
      DA.put(r);DA.lss('lastf',r.f);FLASH=r.id;if(!w&&window.Touches3)Touches3.papers();d.close();DA.snd('ok');DA.toast(w?'حُفظ التعديل':'أُضيف العمل في «'+((fold(r.f)||{}).n||'')+'» ✓');
      if(!w&&!(CUR==='f'&&ARG===r.f))location.hash='#f/'+r.f;else keep();}).catch(function(e){busy=false;pr.hidden=true;DA.toast('تعذّر حفظ أحد الملفات على هذا الجهاز (قد تكون الذاكرة ممتلئة)');console.error(e);});};}

/* ---------- عارض العمل ---------- */
function openWork(id){var w=DA.rec(id);if(!w)return;var F=w.files||[],ims=F.filter(function(f){return kind(f)==='img';}),oth=F.filter(function(f){return kind(f)!=='img';}),f=fold(w.f);
  var d=DA.dlg('<div class="kz-view"><div class="eyebrow"><span class="en">'+(f?esc(f.n):'')+'</span></div><h2>'+esc(w.t||'عمل')+'</h2><div class="chips">'+(w.by?'<span class="chip">'+ic('user')+esc(w.by)+'</span>':'')+(w.dt?'<span class="chip">'+ic('cal')+esc(DA.fmtD(w.dt))+'</span>':'')+'<span class="chip">'+ic('clip')+F.length+' ملف</span></div>'+
   (w.d?'<p class="kz-desc">'+esc(w.d)+'</p>':'')+
   (ims.length?'<div class="kz-gal'+(ims.length===1?' one':'')+'">'+ims.map(function(x,i){return '<button type="button" data-lb="'+i+'"><img data-fid="'+esc(ims.length===1?x.id:(x.th||x.id))+'" alt="'+esc(x.n||'')+'"></button>';}).join('')+'</div>':'')+
   oth.map(function(x,i){var k=kind(x);return '<div class="kz-file k-'+k+'"><span class="th">'+ic(KN[k][1])+'</span><span class="nm"><b title="'+esc(x.n||'')+'">'+esc(mid(x.n||'ملف',44))+'</b><small>'+KN[k][0]+(x.sz?' · '+size(x.sz):'')+'</small></span><button type="button" class="btn sm line" data-open="'+i+'">'+ic('eye')+'فتح</button><button type="button" class="btn sm ghost" data-down="'+i+'" aria-label="تنزيل">'+ic('dl')+'</button></div>'+
     (k==='vid'?'<video class="kz-vid" controls playsinline preload="metadata" data-vid="'+i+'"></video>':'')+(k==='pdf'&&i===oth.findIndex(function(y){return kind(y)==='pdf';})?'<div class="kz-pdf" data-pdf="'+i+'"></div>':'');}).join('')+
   '</div><div class="acts">'+(canW(w)?'<button class="btn danger" data-del>'+ic('trash')+'حذف</button><span class="sp"></span><button class="btn line" data-ed>'+ic('edit')+'تعديل</button>':'<span class="sp"></span>')+(F.length>1?'<button class="btn line" data-all>'+ic('dl')+'تنزيل الكل</button>':'')+'<button class="btn gold" data-close>إغلاق</button></div>',{wide:1});
  DA.hydrate(d);
  $$('[data-lb]',d).forEach(function(b){b.onclick=function(){DA.lightbox(ims.map(function(x){return {fid:x.id,cap:w.t};}),+b.dataset.lb,w.t);};});
  function url(x){return DA.fileURL(x.id).then(function(u){if(!u)DA.toast('الملف لم يصل بعد إلى هذا الجهاز؛ تأكدي من الإنترنت');return u;});}
  function dl(x){return url(x).then(function(u){if(!u)return;var a=document.createElement('a');a.href=u;a.download=x.n||'ملف';document.body.appendChild(a);a.click();a.remove();});}
  $$('[data-open]',d).forEach(function(b){b.onclick=function(){var x=oth[+b.dataset.open];var win=window.open('','_blank');url(x).then(function(u){if(!u){if(win)win.close();return;}if(win)win.location.href=u;else location.href=u;});};});
  $$('[data-down]',d).forEach(function(b){b.onclick=function(){dl(oth[+b.dataset.down]);};});
  $$('[data-vid]',d).forEach(function(v){url(oth[+v.dataset.vid]).then(function(u){if(u)v.src=u;});});
  $$('[data-pdf]',d).forEach(function(p){if(innerWidth<900)return;url(oth[+p.dataset.pdf]).then(function(u){if(u)p.innerHTML='<iframe src="'+u+'#view=FitH" title="معاينة"></iframe>';});});
  var all=$('[data-all]',d);if(all)all.onclick=function(){var q=Promise.resolve();F.forEach(function(x){q=q.then(function(){return dl(x);}).then(function(){return new Promise(function(r){setTimeout(r,500);});});});};
  var ed=$('[data-ed]',d);if(ed)ed.onclick=function(){d.close();workForm(w.id);};
  var dl1=$('[data-del]',d);if(dl1)dl1.onclick=function(){DA.ask('سيُحذف العمل «'+esc(w.t)+'» من كل الأجهزة. يمكنك التراجع مباشرة بعد الحذف.',function(){var old=DA.del(w.id);d.close();keep();DA.toast('حُذف العمل',{undo:function(){DA.restore(old);keep();}});},{danger:1,ok:'حذف العمل'});};}

/* ---------- نموذج المجلد ---------- */
function foldForm(id,pid){var f=id?fold(id):null;if(f&&!canF(f)){DA.toast('تعديل المجلدات لصاحبة المنصة');return;}var c=f?f.c:'a',ico=f?f.ic||'folder':'folder';pid=f?f.p||'':(pid||'');
  var d=DA.dlg('<h2>'+(f?'تعديل المجلد':'مجلد جديد')+'</h2><label class="field"><span>اسم المجلد</span><input class="input" data-k="n" maxlength="60" placeholder="مثال: الصف الخامس، الإذاعة المدرسية، اليوم الوطني" value="'+esc(f?f.n:'')+'"></label>'+
   '<label class="field"><span>وصف قصير (اختياري)</span><input class="input" data-k="d" maxlength="160" value="'+esc(f?f.d||'':'')+'"></label>'+
   '<label class="field"><span>مكانه</span><select class="input" data-k="p"><option value="">في الصفحة الرئيسية</option>'+foldOpts(pid).replace(f?new RegExp('<option value="'+f.id+'"[^<]*</option>'):/^$/,'')+'</select></label>'+
   '<div class="field"><span>اللون</span><div class="kz-sw">'+COLORS.map(function(x){return '<button type="button" data-c="'+x[0]+'" class="'+(x[0]===c?'on':'')+'" style="--fc:'+fcol(x[0])+'" aria-label="'+x[1]+'"></button>';}).join('')+'</div></div>'+
   '<div class="field"><span>الأيقونة</span><div class="kz-ics">'+ICONS.map(function(x){return '<button type="button" data-i="'+x+'" class="'+(x===ico?'on':'')+'">'+ic(x)+'</button>';}).join('')+'</div></div>'+
   '<div class="t3-prev"><span class="note">معاينة</span><div class="kz-fold" style="--fc:'+fcol(c)+'"><span class="tab"></span><span class="fb"><span class="fi">'+ic(ico)+'</span><b>'+esc(f?f.n:'مجلد جديد')+'</b><small></small></span></div></div>'+
   '<div class="acts"><button class="btn ghost" data-close>إلغاء</button><button class="btn gold" data-sv>'+ic('check')+'حفظ</button></div>');
  var pv=$('.t3-prev .kz-fold',d);function prev(){pv.style.setProperty('--fc',fcol(c));$('.fi',pv).innerHTML=ic(ico);$('b',pv).textContent=$('[data-k=n]',d).value.trim()||'مجلد جديد';$('small',pv).textContent=$('[data-k=d]',d).value.trim();}
  $$('[data-k=n],[data-k=d]',d).forEach(function(i){i.addEventListener('input',prev);});d.addEventListener('click',function(){setTimeout(prev,0);});
  $$('[data-c]',d).forEach(function(b){b.onclick=function(){c=b.dataset.c;$$('[data-c]',d).forEach(function(x){x.classList.toggle('on',x===b);});};});
  $$('[data-i]',d).forEach(function(b){b.onclick=function(){ico=b.dataset.i;$$('[data-i]',d).forEach(function(x){x.classList.toggle('on',x===b);});};});
  $('[data-k=n]',d).focus();
  $('[data-sv]',d).onclick=function(){var n=$('[data-k=n]',d).value.trim();if(!n){DA.toast('اكتبي اسم المجلد');return;}var p=$('[data-k=p]',d).value,ds=$('[data-k=d]',d).value.trim();
    if(f&&(p===f.id||desc(f.id).some(function(x){return x.id===p;}))){DA.toast('لا يمكن وضع المجلد داخل نفسه');return;}
    var nid;if(f&&!f._mine){DA.setOv(f.id,'fold',{n:n,d:ds,p:p,c:c,ic:ico});nid=f.id;}
    else{var r=f?JSON.parse(JSON.stringify(DA.rec(f.id))):{K:'fold',dev:DEV,o:50+folders().length};r.n=n;r.d=ds;r.p=p;r.c=c;r.ic=ico;nid=DA.put(r).id;}
    d.close();DA.snd('ok');DA.toast(f?'حُفظ المجلد':'أُنشئ المجلد «'+n+'»');shell();if(!f)location.hash='#f/'+nid;else route();};}
function delFold(id){var f=fold(id);if(!f||!canF(f))return;var D=[f].concat(desc(id)),W=worksIn(id,true);
  DA.ask('سيُحذف المجلد «'+esc(f.n)+'»'+(D.length>1?' و'+(D.length-1)+' مجلدًا داخله':'')+(W.length?' و'+W.length+' عملًا فيه':'')+' من كل الأجهزة. يمكنك التراجع مباشرة بعد الحذف.',function(){
    var undo=[];W.forEach(function(w){undo.push(['r',DA.del(w.id)]);});D.forEach(function(x){if(x._mine)undo.push(['r',DA.del(x.id)]);else{DA.setOv(x.id,'fold',{hide:1});undo.push(['o',x.id]);}});
    location.hash=f.p?'#f/'+f.p:'#home';shell();route();DA.toast('حُذف المجلد',{undo:function(){undo.forEach(function(u){if(u[0]==='r'&&u[1])DA.restore(u[1]);else if(u[0]==='o')DA.setOv(u[1],'fold',{hide:0});});shell();route();}});},{danger:1,ok:'حذف المجلد'});}

/* ---------- الإعدادات ---------- */
function cfgForm(){var t=cfg();var d=DA.dlg('<h2>بيانات المنصة</h2><label class="field"><span>اسم المنصة</span><input class="input" data-k="title" maxlength="60" value="'+esc(t.title)+'"></label><label class="field"><span>صاحبة المنصة</span><input class="input" data-k="owner" maxlength="60" value="'+esc(t.owner)+'"></label><label class="field"><span>المدرسة</span><input class="input" data-k="school" maxlength="80" value="'+esc(t.school)+'"></label><label class="field"><span>العبارة</span><input class="input" data-k="motto" maxlength="120" value="'+esc(t.motto)+'"></label><div class="acts"><button class="btn ghost" data-close>إلغاء</button><button class="btn gold" data-sv>'+ic('check')+'حفظ</button></div>');
  $('[data-sv]',d).onclick=function(){var r=DA.rec('cfg_site')||{id:'cfg_site',K:'cfg'};['title','owner','school','motto'].forEach(function(k){var v=$('[data-k='+k+']',d).value.trim();if(v)r[k]=v;else delete r[k];});DA.put(r);d.close();DA.snd('ok');DA.toast('حُفظت البيانات');shell();route();};}
function nameForm(first){var d=DA.dlg('<h2>'+(first?'أهلًا بكِ في المنصة':'اسمي على أعمالي')+'</h2><p class="note" style="margin-bottom:12px">اكتبي اسمك ليظهر على الأعمال التي تضيفينها من هذا الجهاز (يمكن تغييره لاحقًا من الإعدادات).</p><label class="field"><span>الاسم</span><input class="input" data-k="n" maxlength="60" placeholder="مثال: أ. مريم" value="'+esc(me())+'"></label><div class="acts"><button class="btn ghost" data-close>'+(first?'لاحقًا':'إلغاء')+'</button><button class="btn gold" data-sv>'+ic('check')+'حفظ</button></div>');
  $('[data-sv]',d).onclick=function(){DA.lss('me',$('[data-k=n]',d).value.trim());d.close();shell();route();};}
function pwForm(who){var t=who==='t';var d=DA.dlg('<h2>'+(t?'كلمة حساب المعلمات':'كلمة دخولي')+'</h2><label class="field"><span>الكلمة الحالية'+(t?' لحساب المعلمات':'')+'</span><input class="input" type="password" data-k="c" autocomplete="current-password"></label><label class="field"><span>الكلمة الجديدة (6 أحرف أو أرقام على الأقل)</span><input class="input" type="text" data-k="n" autocomplete="new-password" dir="ltr"></label><p class="note bad" data-err></p><div class="acts"><button class="btn ghost" data-close>إلغاء</button><button class="btn gold" data-sv>'+ic('check')+'تغيير</button></div>');
  $('[data-sv]',d).onclick=function(){var c=$('[data-k=c]',d).value,n=$('[data-k=n]',d).value.trim(),er=$('[data-err]',d);if(n.length<6){er.textContent='الكلمة الجديدة قصيرة';return;}if(!Z||!Z.changePw){er.textContent='يلزم الاتصال بالإنترنت';return;}
    er.textContent='جارٍ التغيير…';(t?Z.changeOther('muallimat@'+DOM,c,n):Z.changePw(c,n)).then(function(){d.close();DA.snd('ok');DA.toast('تغيّرت الكلمة. احفظيها جيدًا');},function(e){er.textContent=errText(e);});};}
function exportAll(){DA.toast('جارٍ تجهيز النسخة…');DA.idbAll('file').then(function(files){var out={app:'khizana',v:1,at:new Date().toISOString(),rec:DA.R,files:{}},p=Promise.resolve();
  Object.keys(files).forEach(function(id){p=p.then(function(){return new Promise(function(res){var m=files[id],r=new FileReader();r.onload=function(){out.files[id]={name:m.name,type:m.type,size:m.size,t:m.t,d:r.result};res();};r.onerror=function(){res();};r.readAsDataURL(m.blob);});});});
  return p.then(function(){var b=new Blob([JSON.stringify(out)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='منصة-الأعمال-نسخة-'+DA.today()+'.json';document.body.appendChild(a);a.click();a.remove();DA.toast('نُزّلت النسخة الاحتياطية');});});}
function importAll(){DA.pick('application/json,.json').then(function(fs){if(!fs[0])return;var r=new FileReader();r.onload=function(){var o;try{o=JSON.parse(r.result);}catch(e){DA.toast('الملف ليس نسخة صحيحة');return;}if(!o||o.app!=='khizana'){DA.toast('هذه ليست نسخة من هذه المنصة');return;}
  DA.ask('ستُدمج النسخة مع ما في المنصة الآن (الأحدث يبقى، ولا يُحذف شيء). متابعة؟',function(){var p=Promise.resolve();Object.keys(o.files||{}).forEach(function(id){var f=o.files[id];p=p.then(function(){return fetch(f.d).then(function(x){return x.blob();}).then(function(b){return DA.idbSet('file',id,{id:id,name:f.name,type:f.type,size:f.size,t:f.t,blob:b});});});});
    p.then(function(){var n=0;Object.keys(o.rec||{}).forEach(function(id){var x=o.rec[id],l=DA.R[id];if(!l||(l.T||0)<(x.T||0)){n++;DA.put(x);}});shell();route();DA.toast('استُعيدت النسخة ('+n+' عنصرًا)');});},{ok:'استعادة'});};r.readAsText(fs[0]);});}

/* ---------- الربط ---------- */
function on(root,sel,fn){$$(sel,root).forEach(function(el){el.onclick=function(e){fn(el,e);};if(el.getAttribute('role')==='button')el.onkeydown=function(e){if(e.key==='Enter'){e.preventDefault();fn(el,e);}};});}
function bindAll(root){
  on(root,'[data-addw]',function(el,e){e.preventDefault();workForm(null,el.dataset.addw);});
  on(root,'[data-addf]',function(el,e){e.preventDefault();foldForm(null,el.dataset.addf);});
  on(root,'[data-editf]',function(el){foldForm(el.dataset.editf);});
  on(root,'[data-delf]',function(el){delFold(el.dataset.delf);});
  on(root,'[data-work]',function(el){openWork(el.dataset.work);});
  on(root,'[data-folders]',foldersSheet);
  $$('[data-dropf]',root).forEach(function(z){['dragenter','dragover'].forEach(function(ev){z.addEventListener(ev,function(e){e.preventDefault();z.classList.add('on');});});z.addEventListener('dragleave',function(){z.classList.remove('on');});
    z.addEventListener('drop',function(e){e.preventDefault();z.classList.remove('on');workForm(null,z.dataset.dropf,Array.prototype.slice.call(e.dataTransfer.files||[]));});});
  $$('[data-q]',root).forEach(function(i){i.oninput=function(){fQ=i.value.trim();var pos=i.selectionStart;keep();var n=$('[data-q]');if(n){n.focus();try{n.setSelectionRange(pos,pos);}catch(e){}}};});
  $$('[data-seg=fK] button',root).forEach(function(b){b.onclick=function(){fK=b.dataset.v;keep();};});
  $$('[data-sort]',root).forEach(function(s){s.onchange=function(){fSort=s.value;keep();};});
  $$('[data-skin]',root).forEach(function(b){b.onclick=function(){DA.setSkin(b.dataset.skin);render();};});
  $$('[data-mute]',root).forEach(function(c){c.onchange=function(){DA.lss('mute',!c.checked);};});
  on(root,'[data-cfg]',cfgForm);on(root,'[data-myname]',function(){nameForm(false);});on(root,'[data-pw]',function(el){pwForm(el.dataset.pw);});
  on(root,'[data-export]',exportAll);on(root,'[data-import]',importAll);on(root,'[data-install]',DA.install);
  on(root,'[data-logout]',function(){DA.ask('تسجيل الخروج من هذا الجهاز؟ تبقى الأعمال محفوظة في السحابة.',function(){ROLE=null;DA.lss('role',null);if(Z&&Z.signOut)Z.signOut();showLogin();},{ok:'خروج'});});}
document.addEventListener('click',function(e){var t=e.target.closest('[data-skinnext]');if(t){var k=DA.SKINS.map(function(s){return s[0];}),i=(k.indexOf(DA.skin())+1)%k.length;DA.setSkin(k[i]);DA.toast('الثيم: '+DA.SKINS[i][1]);render();}});
addEventListener('hashchange',route);

/* ---------- الدخول ---------- */
function errText(e){var c=(e&&e.code)||'';if(/wrong-password|invalid-credential|invalid-login|user-not-found|invalid-email/.test(c))return 'اسم المستخدم أو كلمة المرور غير صحيحة';
  if(/too-many/.test(c))return 'محاولات كثيرة متتالية؛ انتظري قليلًا ثم أعيدي المحاولة';if(/network|unavailable/.test(c))return 'لا يوجد اتصال بالإنترنت';if(/no-sync/.test(c))return 'جارٍ تجهيز الاتصال، أعيدي المحاولة بعد لحظة';if(/requires-recent/.test(c))return 'سجّلي الخروج والدخول ثم أعيدي التغيير';return 'تعذّر الدخول ('+c+')';}
var tries=DA.lsg('tries',{n:0,until:0});
function showLogin(){var t=cfg(),mode=DA.lsg('lastmode','t');document.body.classList.add('kz-out');
  document.getElementById('app').innerHTML=DA.fxHTML()+'<main class="kz-login"><div class="kz-lbox card"><div class="kz-lmark">'+DA.emblem('emb')+'</div><div class="eyebrow"><span class="en">School Works</span></div><h1>'+esc(t.title)+'</h1><p class="note">أعمال الطلاب والمدرسة في مجلدات، متزامنة بين أجهزة المعلمات.</p>'+
   '<div class="seg big kz-mode" role="tablist"><button type="button" data-lmode="t" class="'+(mode==='t'?'on':'')+'">'+ic('users')+'المعلمات</button><button type="button" data-lmode="a" class="'+(mode==='a'?'on':'')+'">'+ic('lock')+'صاحبة المنصة</button></div>'+
   '<form class="kz-lform" autocomplete="on"><label class="field"><span>اسم المستخدم</span><input class="input" name="username" autocomplete="username" autocapitalize="none" spellcheck="false" dir="ltr" required></label>'+
   '<label class="field"><span>كلمة المرور</span><span class="kz-pw"><input class="input" type="password" name="password" autocomplete="current-password" dir="ltr" required><button type="button" class="ib" data-eye aria-label="إظهار كلمة المرور">'+ic('eye')+'</button></span></label>'+
   '<p class="note bad" data-err role="alert"></p><button class="btn gold kz-go" type="submit">'+ic('check')+'دخول</button></form>'+
   (DA.standalone()?'':'<button type="button" class="btn line kz-inst" data-install>'+ic('dl')+'تثبيت المنصة على الجهاز</button>')+'</div></main>';
  if(DA.FX)DA.applySkin();
  var box=$('.kz-lbox'),fm=$('.kz-lform'),er=$('[data-err]'),go=$('.kz-go'),u=fm.username,p=fm.password;
  function setMode(m){mode=m;DA.lss('lastmode',m);$$('[data-lmode]').forEach(function(b){b.classList.toggle('on',b.dataset.lmode===m);});u.placeholder=m==='a'?'اسم مستخدمك الخاص':'اسم مستخدم المعلمات';er.textContent='';}
  setMode(mode);$$('[data-lmode]').forEach(function(b){b.onclick=function(){setMode(b.dataset.lmode);};});
  $('[data-eye]').onclick=function(){p.type=p.type==='password'?'text':'password';};
  var ib=$('[data-install]');if(ib)ib.onclick=DA.install;
  function wait(){var s=Math.ceil((tries.until-Date.now())/1000);if(s>0){go.disabled=true;go.textContent='انتظري '+s+' ثانية';setTimeout(wait,1000);}else{go.disabled=false;go.innerHTML=ic('check')+'دخول';}}
  wait();
  fm.onsubmit=function(e){e.preventDefault();if(go.disabled)return;var un=userOf(u.value),pw=p.value;if(!un||!pw){er.textContent='اكتبي اسم المستخدم وكلمة المرور';return;}
    if(mode==='a'&&un!==ADMIN||mode==='t'&&un===ADMIN){er.textContent=mode==='a'?'هذا ليس اسم مستخدم صاحبة المنصة':'هذا اسم صاحبة المنصة؛ اختاري «صاحبة المنصة» في الأعلى';return;}
    if(!navigator.onLine){er.textContent='الدخول أول مرة يحتاج الإنترنت';return;}
    go.disabled=true;go.textContent='جارٍ الدخول…';er.textContent='';
    (Z&&Z.signIn?Z.signIn(un+'@'+DOM,pw):Promise.reject({code:'no-sync'})).then(function(){tries={n:0,until:0};DA.lss('tries',tries);},function(x){
      /* المحاولات الخاطئة تتباعد: 0، 5، 15، 30، 60 ثانية… حتى لا يُحظر الحساب */
      if(!/no-sync|network/.test(x&&x.code||'')){tries.n++;tries.until=Date.now()+[0,0,5,15,30,60,120][Math.min(tries.n,6)]*1000;DA.lss('tries',tries);}
      er.textContent=errText(x);box.classList.remove('shake');void box.offsetWidth;box.classList.add('shake');go.disabled=false;go.innerHTML=ic('check')+'دخول';wait();});};}
function onAuth(email){if(email){var r=roleOf(email),was=ROLE;ROLE=r;DA.lss('role',r);document.body.classList.remove('kz-out');
    if(!was||!$('.app')){CUR='';shell();DA.splash(T(),function(){});route();if(r==='t'&&!me())setTimeout(function(){nameForm(true);},was?0:3600);}else{shell();route();}}
  else if(ROLE){/* الحساب خرج (تغيّرت كلمة المرور مثلًا): يُطلب الدخول من جديد */ROLE=null;DA.lss('role',null);showLogin();}
  else if(!$('.kz-login'))showLogin();}

/* ---------- المزامنة الآمنة ---------- */
var SX={ev:[]},VER=0;
function sxBuild(){SX.ev=Object.keys(DA.R).map(function(k){return DA.R[k];});}
function sxSave(){var seen={},ch=0;(SX.ev||[]).forEach(function(e){if(!e||!e.id)return;seen[e.id]=1;var l=DA.R[e.id];if(!l||JSON.stringify(l)!==JSON.stringify(e)){DA.R[e.id]=e;DA.idbSet('rec',e.id,e);ch++;}});
  Object.keys(DA.R).forEach(function(id){if(!seen[id]){delete DA.R[id];DA.idbDel('rec',id);ch++;}});if(ch){VER++;DA.emit('remote');}}
var rt=null,rPend=false;function rRun(){clearTimeout(rt);rt=setTimeout(function(){if(!$('.app'))return;var a=document.activeElement;if($('.dlg')||$('.lb')||(a&&(a.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)))){rPend=true;return;}rPend=false;shell();var y=window.scrollY;render();window.scrollTo(0,y);},300);}
DA.on(function(src){if(src==='local'){sxBuild();if(Z)Z.changed();}else if(src==='remote'){sxBuild();rRun();}});
document.addEventListener('focusout',function(){if(rPend)setTimeout(rRun,400);});document.addEventListener('click',function(){if(rPend)setTimeout(rRun,900);},true);setInterval(function(){if(rPend)rRun();},4000);
DA.Sync={state:function(){return Z?Z.state():'off';},msg:function(){return Z?Z.msg():'';},kick:function(){if(Z)Z.changed();},fetchFile:function(id){return Z?Z.fetch(id):Promise.resolve(null);}};
setInterval(function(){var n=DA.today();if(n!==TODAY)TODAY=n;},60000);

document.documentElement.setAttribute('data-skin',DA.skin());
DA.load().then(function(){sxBuild();
  if(ROLE){shell();route();}else showLogin();
  if(Z)Z.start({S:function(){return SX;},seed:function(){return {};},save:sxSave,rerender:rRun,live:rRun,fileIds:fileIds,onAuth:onAuth,
    fGet:function(id){return DA.idbGet('file',id);},fPut:function(id,rec){return DA.idbSet('file',id,{id:id,name:rec.name||'',type:rec.type||'',size:rec.blob?rec.blob.size:0,blob:rec.blob,t:Date.now()});}});});
DA.KZ={folders:folders,works:works,fold:fold,add:function(files){if(!ROLE||$('.dlg'))return false;workForm(null,CUR==='f'?ARG:'',files);return true;},cur:function(){return CUR;},seen:function(){return SEEN;},on:function(){return !!ROLE&&!!$('.app');}};
})();
