/* =====================================================================
   درسي · واجهة المنصة (المعلمة) وصفحات الطالب (الواجب والامتحان)
   الأقسام: الرئيسية، العروض، التحاضير، الجدول، الواجبات، الامتحانات، الألعاب، الطلاب، الحضور، التقييم، النقاط
   البيانات على جهاز المعلمة فقط (IndexedDB) مع تصدير واستيراد
   ===================================================================== */
(function(){
'use strict';
var D=window.DARSI,TB=window.TB,I=TB.I,PF=window.PF,$=D.$,$$=D.$$,esc=D.esc,h=D.h,ar=D.ar,SND=D.SND,VOICE=D.VOICE,plain=D.plain;
var GR=['','الأول','الثاني','الثالث','الرابع','الخامس','السادس'];

/* ---------- الثيمات: ثلاثة فقط، محفوظة لكل منصة وحدها ---------- */
var KEEP=['rain','sky','jouri','snow','galaxy'];
Object.keys(TB.SKINS).forEach(function(k){if(KEEP.indexOf(k)<0)delete TB.SKINS[k];});
(function(){var k='darsi:skin2:'+PF.id,sk=D.lsGet(k,PF.skin||'rain');if(!TB.SKINS[sk])sk='rain';TB.prefs.skin=sk;TB.apply();
  document.addEventListener('tb:theme',function(e){D.lsSet(k,e.detail.skin);});})();

/* ---------- أيقونات إضافية ---------- */
function ic(d){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+d+'</svg>';}
var X={
  slides:ic('<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/><path d="m10 8.5 4 2-4 2z"/>'),
  plan:ic('<path d="M9 3h6l1 2h3v16H5V5h3z"/><path d="M9 11h6M9 15h4"/>'),
  home2:ic('<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>'),
  exam:ic('<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5M8 13l2 2 4-4"/>'),
  game:ic('<rect x="2" y="7" width="20" height="11" rx="5"/><path d="M7 11v3M5.5 12.5h3M15.5 12h.01M18 13.5h.01"/>'),
  eval:ic('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'),
  medal:ic('<circle cx="12" cy="15" r="6"/><path d="M8.5 3 12 9l3.5-6"/><path d="M12 12.5l.9 1.8 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2-1.5-1.4 2-.3z"/>'),
  more:ic('<circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/>'),
  print:ic('<path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/>'),
  link:ic('<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'),
  copy:ic('<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>'),
  share:ic('<path d="M12 3v12M8 7l4-4 4 4"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/>'),
  trash:ic('<path d="M4 7h16M10 11v6M14 11v6"/><path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/>'),
  edit:ic('<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>'),
  gear:ic('<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>'),
  dl:ic('<path d="M12 4v11m0 0-4-4m4 4 4-4"/><path d="M5 19h14"/>'),
  ul:ic('<path d="M12 16V5m0 0-4 4m4-4 4 4"/><path d="M5 19h14"/>'),
  inbox:ic('<path d="M3 13h5l2 3h4l2-3h5"/><path d="M5 5h14l2 8v6H3v-6z"/>'),
  install:ic('<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M12 7v7m0 0-3-3m3 3 3-3"/>'),
  wa:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.1-.1-.2-1.1-1.5-1.1-2.9s.7-2.1 1-2.4c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .5l-.3.5-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.5.3.1.2.1.7-.1 1.3z"/></svg>'
};
function G(n){return X[n]||I[n]||I.star;}

/* ---------- البيانات ---------- */
var KEY='darsi:'+PF.id,S=null,saveT;
function fresh(){return {app:'darsi',pf:PF.id,v:1,
  settings:{teacher:PF.teacher,role:PF.role||'',school:PF.school||'',region:PF.region||'',year:'2026/2027',sup:PF.sup||'',head:PF.head||'',wa:'',teamA:'فريق النجوم',teamB:'فريق الأبطال',autoRead:false},
  classes:PF.grades.map(function(g){return {id:'c'+g,g:g,name:'الصف '+GR[g]};}),students:[],
  criteria:[{id:'k1',n:'المشاركة الصفية',w:25,src:'part',target:20},{id:'k2',n:'الواجبات',w:25,src:'hw'},{id:'k3',n:'الامتحانات',w:30,src:'ex'},{id:'k4',n:'الأنشطة والألعاب',w:10,src:'game',target:10},{id:'k5',n:'السلوك والانضباط',w:10,src:'manual'}],
  manual:{},att:{},points:[],results:[],taught:{},plans:{},objs:{},exams:[],sent:{},ui:{book:PF.books[0]}};}
function persist(){clearTimeout(saveT);saveT=setTimeout(function(){S.saved=Date.now();D.DB.set(KEY,S);},200);}

/* ---------- حسابات ---------- */
function books(){return PF.books.map(function(b){return D.REG.books[b];}).filter(Boolean);}
function curBook(){var b=D.REG.books[S.ui.book];return b&&PF.books.indexOf(b.id)>=0?b:books()[0];}
function bookLabel(b){return b.label||D.SUBJ[b.subj].n+' · '+GR[b.grade];}
function clsOf(id){return S.classes.filter(function(c){return c.id===id;})[0];}
function studentsOf(grade){var cs=S.classes.filter(function(c){return !grade||c.g===grade;}).map(function(c){return c.id;});return S.students.filter(function(s){return cs.indexOf(s.cls)>=0;});}
function stu(id){return S.students.filter(function(s){return s.id===id;})[0];}
function pts(sid,src){return S.points.filter(function(p){return p.sid===sid&&(!src||p.r===src);}).reduce(function(a,p){return a+p.v;},0);}
function avgRes(sid,k){var r=S.results.filter(function(x){return x.sid===sid&&x.k===k;});if(!r.length)return null;return r.reduce(function(a,x){return a+x.score/x.max*100;},0)/r.length;}
function critPct(sid,c){switch(c.src){case 'part':return Math.min(100,pts(sid,'مشاركة')/(c.target||20)*100);case 'game':return Math.min(100,pts(sid,'لعبة')/(c.target||10)*100);
  case 'hw':return avgRes(sid,'hw');case 'ex':return avgRes(sid,'ex');default:var m=(S.manual[sid]||{})[c.id];return m==null||m===''?null:+m;}}
function total(sid){var sw=0,s=0;S.criteria.forEach(function(c){var p=critPct(sid,c);if(p==null)return;sw+=+c.w;s+=p*c.w;});return sw?s/sw:null;}
function level(v){if(v==null)return {c:'',n:'—'};return v>=90?{c:'a',n:'ممتاز'}:v>=75?{c:'b',n:'جيد جدًا'}:v>=50?{c:'c',n:'جيد'}:{c:'d',n:'يحتاج دعمًا'};}
function addPoint(sid,v,r,ref){S.points.push({id:D.uid('p'),sid:sid,v:v,r:r||'مشاركة',ref:ref||'',t:Date.now()});persist();}
D.hooks.students=function(g){return studentsOf(g);};
/* اختيار الشعبة للعجلة و«من يجيب؟»: الشعب التي فيها طلاب، والشعبة المختارة محفوظة */
D.hooks.classes=function(){return S.classes.filter(function(c){return S.students.some(function(s){return s.cls===c.id;});});};
D.hooks.studentsCls=function(ids){return S.students.filter(function(s){return ids.indexOf(s.cls)>=0;});};
D.hooks.cls=function(v){if(v!==undefined){S.ui.wcls=v;persist();}var w=S.ui.wcls;return Array.isArray(w)?w:w?[w]:[];};
D.hooks.addPoint=function(sid,v,r,ref){addPoint(sid,v,r,ref);};
D.hooks.taught=function(lid){S.taught[lid]=D.ymd();persist();if(route().v==='lessons'||route().v==='home')render();};

/* ---------- الروابط ---------- */
function base(){return location.origin+location.pathname;}
function waQ(){return S&&S.settings.wa?'?w='+encodeURIComponent(S.settings.wa.replace(/\D/g,'')):'';}
function hwLink(lid){return base()+'#/s/hw/'+lid+waQ();}
function exLink(code){return base()+'#/s/ex/'+code+waQ();}
function copy(t){(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(function(){TB.toast('نُسخ الرابط',{icon:'check'});},function(){prompt('انسخي الرابط:',t);});}
function waShare(text,num){var u=(num?'https://wa.me/'+num.replace(/\D/g,''):'https://wa.me/')+'?text='+encodeURIComponent(text);window.open(u,'_blank');}
function nativeShare(title,text,url){if(navigator.share)navigator.share({title:title,text:text,url:url}).catch(function(){});else copy(url);}
function shareBox(title,url,msg){return '<div class="stack"><div class="ds-link"><code>'+esc(url)+'</code><button class="round-btn" data-copy-url="'+esc(url)+'" aria-label="نسخ">'+G('copy')+'</button></div>'+
  '<div class="ds-share"><button class="btn ds-wa" data-wa="'+esc(msg+'\n'+url)+'">'+X.wa+'إرسال عبر واتساب</button><button class="btn soft" data-native="'+esc(url)+'" data-title="'+esc(title)+'">'+G('share')+'مشاركة</button><a class="btn ghost" href="'+esc(url)+'" target="_blank">'+G('link')+'معاينة</a></div></div>';}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-copy-url],[data-wa],[data-native]');if(!b)return;
  if(b.dataset.copyUrl)copy(b.dataset.copyUrl);else if(b.dataset.wa){waShare(b.dataset.wa);markSent(b);}else if(b.dataset.native){nativeShare(b.dataset.title,'',b.dataset.native);markSent(b);}});
function markSent(b){var ref=b.closest('[data-ref]');if(!ref||!S)return;var k=ref.dataset.ref;(S.sent[k]=S.sent[k]||[]).push(D.ymd());persist();}

/* ---------- التنقل ---------- */
var NAV=[['home','الرئيسية','home2'],['lessons','العروض','slides'],['plans','التحاضير','plan'],['table','الجدول','cal'],['hw','الواجبات','home'],['exams','الامتحانات','exam'],['games','الألعاب','game'],['students','الطلاب','users'],['att','الحضور','check'],['eval','التقييم','eval'],['points','النقاط','medal']];
var SEC={lessons:{e:'🎬',c:'#3D9BE9',d:'دروس متحركة تفاعلية لكل حصة من التهيئة إلى الختام'},plans:{e:'📝',c:'#2FA36B',d:'تحضير كل حصة بنموذج الخطة التعليمية الفردية، جاهز للطباعة'},
  hw:{e:'🏠',c:'#F28C38',d:'واجب لكل حصة برابط دائم يُرسل لأولياء الأمور'},exams:{e:'📋',c:'#E85D75',d:'امتحانات الوحدات ونماذج متعددة، وامتحانات تصممينها'},
  games:{e:'🎮',c:'#C46BD8',d:'ألعاب جماعية وفردية من أسئلة الدروس'},students:{e:'👧',c:'#1FA2A8',d:'أسماء الطلاب وصفوفهم وملف كل طالب'},
  table:{e:'🗓️',c:'#0E9F8E',d:'جدول حصصك الأسبوعي تكتبينه بيدك، ويظهر جدول اليوم في الرئيسية'},
  att:{e:'✅',c:'#2FA36B',d:'تسجيل حضور الطلاب وغيابهم يوميًا بنقرة، مع تقرير ونسبة حضور كل طالب'},
  eval:{e:'📊',c:'#6C7BE0',d:'بنود التقييم بأوزانها، والدرجات، ومتابعة الأهداف'},points:{e:'⭐',c:'#F2B134',d:'نقاط المشاركة والواجبات والامتحانات ولوحة الأبطال'}};
function route(){var hs=location.hash.replace(/^#\/?/,''),q='';var qi=hs.indexOf('?');if(qi>=0){q=hs.slice(qi+1);hs=hs.slice(0,qi);}var p=hs.split('/');
  var params={};q.split('&').forEach(function(kv){if(!kv)return;var a=kv.split('=');params[a[0]]=decodeURIComponent(a[1]||'');});
  if(p[0]==='s')return {stu:true,k:p[1],id:p[2],q:params};return {v:p[0]||'home',id:p[1],q:params};}
function go(v,id){location.hash='#/'+v+(id?'/'+id:'');}

/* ---------- الهيكل ---------- */
function shell(){var app=$('#app');app.innerHTML='<header class="ds-top"><button class="ds-brand" data-go="home"><span class="ds-logo">'+(PF.emoji||'🍎')+'</span><span><b>منصة '+esc(S.settings.teacher)+'</b><small>'+esc(PF.title||'')+'</small></span></button><div class="ds-tools">'+
  '<button class="round-btn" data-a="theme" aria-label="الثيمات">'+I.palette+'</button><button class="round-btn" data-a="sound" aria-label="الصوت">'+(SND.on?ic('<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/>'):ic('<path d="M4 9v6h4l5 4V5L8 9z"/><path d="m17 9 5 6M22 9l-5 6"/>'))+'</button><button class="round-btn" data-a="more" aria-label="المزيد">'+X.more+'</button></div></header>'+
  '<main class="wrap stack lg ds-main" id="view"></main><nav class="ds-nav" aria-label="الأقسام">'+NAV.map(function(n){return '<button data-go="'+n[0]+'">'+G(n[2])+'<span>'+n[1]+'</span></button>';}).join('')+'</nav>';}
document.addEventListener('click',function(e){var g=e.target.closest&&e.target.closest('[data-go]');if(g){e.preventDefault();var v=g.dataset.go.split('/');go(v[0],v[1]);return;}
  var a=e.target.closest&&e.target.closest('[data-a]');if(!a||!S)return;var act=A[a.dataset.a];if(act){e.preventDefault();act(a);}});
var A={};
A.theme=function(){var dark=TB.isDark();TB.sheet('<div class="stack"><div class="skins">'+KEEP.map(function(id){var k=TB.SKINS[id];return '<button class="skin'+(k.fx?' live':'')+'" data-pref="skin" data-v="'+id+'" aria-pressed="'+(TB.prefs.skin===id)+'">'+TB.skinPrev(id,dark)+'<span><b>'+k.n+'</b><small>'+k.d+'</small></span><i class="ok">'+I.check+'</i></button>';}).join('')+'</div>'+
  '<div class="seg" role="group">'+[['auto','تلقائي','auto'],['light','فاتح','sun'],['dark','داكن','moon']].map(function(o){return '<button data-pref="mode" data-v="'+o[0]+'" aria-pressed="'+(TB.prefs.mode===o[0])+'">'+I[o[2]]+o[1]+'</button>';}).join('')+'</div>'+
  '<div class="opt-row"><span>حجم الخط</span><div class="seg">'+[['m','عادي'],['l','كبير'],['xl','أكبر']].map(function(o){return '<button data-pref="font" data-v="'+o[0]+'" aria-pressed="'+(TB.prefs.font===o[0])+'">'+o[1]+'</button>';}).join('')+'</div></div></div>',{title:'الثيمات',sub:'ثلاثة ثيمات مختارة لهذه المنصة',icon:'palette'});};
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.sheet [data-pref]');if(!b)return;setTimeout(function(){var s=b.closest('.sheet');if(!s)return;$$('[data-pref="'+b.dataset.pref+'"]',s).forEach(function(x){x.setAttribute('aria-pressed',String(x===b));});},30);});
A.sound=function(b){SND.set(!SND.on);shell();render();};
var deferredInstall=null;window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();deferredInstall=e;});
A.more=function(){TB.sheet('<div class="stack">'+
  '<button class="btn soft block" data-a="settings">'+X.gear+'بيانات المعلمة والإعدادات</button>'+
  '<button class="btn soft block" data-a="export">'+X.dl+'تصدير نسخة احتياطية</button>'+
  '<label class="btn soft block">'+X.ul+'استيراد نسخة<input type="file" accept=".json,application/json" hidden id="dsImp"></label>'+
  '<button class="btn soft block" data-a="install">'+X.install+'تثبيت المنصة على الجهاز</button>'+
  '<p class="note">البيانات (الطلاب والنقاط والدرجات والتحاضير) محفوظة على هذا الجهاز فقط. صدّري نسخة احتياطية بين حين وآخر، واستورديها في أي جهاز آخر.</p></div>',{title:'المزيد',icon:'menu'});
  $('#dsImp').addEventListener('change',function(){var f=this.files[0];if(!f)return;var r=new FileReader();r.onload=function(){try{var d=JSON.parse(r.result);if(d.app!=='darsi')throw 0;if(d.pf!==PF.id&&!confirm('هذه النسخة من منصة أخرى، هل تريدين استيرادها؟'))return;S=Object.assign(fresh(),d);persist();TB.closeSheet();render();TB.toast('تم الاستيراد',{gold:true,icon:'check'});}catch(e){TB.toast('الملف غير صالح');}};r.readAsText(f);});};
A.export=function(){var b=new Blob([JSON.stringify(S)],{type:'application/json'});var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='darsi-'+PF.id+'-'+D.ymd()+'.json';a.click();TB.toast('حُفظت النسخة في التنزيلات',{icon:'check'});};
A.install=function(){if(deferredInstall){deferredInstall.prompt();deferredInstall=null;return;}
  TB.sheet('<div class="stack"><p><b>آيفون وآيباد:</b> افتحي الرابط في Safari، ثم زر المشاركة، ثم «إضافة إلى الشاشة الرئيسية».</p><p><b>أندرويد:</b> من قائمة Chrome (⋮) اختاري «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية».</p><p><b>الكمبيوتر:</b> أيقونة التثبيت في شريط العنوان في Chrome أو Edge.</p></div>',{title:'تثبيت المنصة',icon:'download'});};
A.settings=function(){var s=S.settings;TB.sheet('<form class="stack" id="dsSet">'+
  [['teacher','اسم المعلمة'],['role','الوظيفة'],['school','المدرسة'],['region','المحافظة'],['year','العام الدراسي'],['sup','مشرف/ة صعوبات التعلم (يظهر في التحضير)'],['head','مدير/ة المدرسة (يظهر في التحضير)'],['wa','رقم واتساب المعلمة (لاستقبال نتائج الواجبات) مثل 96891234567'],['teamA','اسم الفريق الأول في الألعاب'],['teamB','اسم الفريق الثاني']].map(function(f){return '<label class="field"><span class="lbl">'+f[1]+'</span><input class="input" name="'+f[0]+'" value="'+esc(s[f[0]]!=null?s[f[0]]:PF[f[0]]||'')+'"'+(f[0]==='wa'?' inputmode="tel" dir="ltr"':'')+'></label>';}).join('')+
  '<div class="opt-row"><span>قراءة العناوين صوتيًا تلقائيًا في العروض</span><button type="button" class="switch" role="switch" id="dsAR" aria-checked="'+!!s.autoRead+'"></button></div>'+
  '<label class="field"><span class="lbl">سرعة القراءة الصوتية</span><div class="seg">'+[['0.6','بطيئة'],['0.8','متوسطة'],['1','عادية']].map(function(o){return '<button type="button" data-rate="'+o[0]+'" aria-pressed="'+(String(VOICE.rate)===o[0])+'">'+o[1]+'</button>';}).join('')+'</div></label>'+
  '<button class="btn gold block" type="submit">'+I.check+'حفظ</button><button class="btn danger sm" type="button" id="dsReset">'+X.trash+'مسح كل البيانات من هذا الجهاز</button></form>',{title:'الإعدادات',icon:'user'});
  $('#dsAR').onclick=function(){this.setAttribute('aria-checked',String(this.getAttribute('aria-checked')!=='true'));};
  $$('[data-rate]').forEach(function(b){b.onclick=function(){VOICE.setRate(+b.dataset.rate);$$('[data-rate]').forEach(function(x){x.setAttribute('aria-pressed',String(x===b));});VOICE.say('مرحبًا يا أبطال');};});
  $('#dsReset').onclick=function(){if(confirm('سيُمسح كل شيء (الطلاب والنقاط والدرجات). هل صدّرتِ نسخة احتياطية؟')&&confirm('تأكيد المسح النهائي؟')){S=fresh();persist();TB.closeSheet();render();}};
  $('#dsSet').onsubmit=function(e){e.preventDefault();var fd=new FormData(this);fd.forEach(function(v,k){s[k]=String(v).trim();});s.autoRead=$('#dsAR').getAttribute('aria-checked')==='true';D.autoRead=s.autoRead;D.lsSet('darsi:teamA',s.teamA);D.lsSet('darsi:teamB',s.teamB);persist();TB.closeSheet();shell();render();TB.toast('حُفظت الإعدادات',{icon:'check'});};};

/* ---------- عناصر مشتركة ---------- */
function bookBar(){var bs=books();if(bs.length<2)return '';return '<div class="ds-filter"><div class="seg" role="tablist">'+bs.map(function(b){return '<button data-book="'+b.id+'" aria-pressed="'+(curBook().id===b.id)+'">'+esc(bookLabel(b))+'</button>';}).join('')+'</div></div>';}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-book]');if(!b)return;S.ui.book=b.dataset.book;persist();render();});
function head(v,extra){var n=NAV.filter(function(x){return x[0]===v;})[0],sc=SEC[v];return '<div class="between"><div><p class="eyebrow">'+sc.e+' '+n[1]+'</p><h1 class="h-xl" style="margin:0">'+n[1]+'</h1><p class="sub" style="margin:4px 0 0">'+sc.d+'</p></div>'+(extra||'')+'</div>'+bookBar();}
function sceneE(L){return D.scene(L.sc).e;}
function lessonMeta(L){return 'الحصة '+ar(L.n)+(L.p?' · '+L.p:'');}
function unitsHTML(b,card){return b.units.map(function(u){return '<section class="ds-unit"><header><h3>'+esc(u.t)+'</h3><span class="chip">'+ar(u.lessons.length)+' حصص</span></header><div class="ds-lessons">'+u.lessons.map(card).join('')+'</div></section>';}).join('')||'<div class="ds-empty">لا توجد دروس بعد</div>';}

/* ---------- الصفحات ---------- */
var V={};
function todayHTML(){var r=ttToday();if(!r.length)return '';var t=TT();return '<section class="card glass stack"><div class="between"><h2 class="h" style="margin:0">🗓️ حصص اليوم · '+DAYS[new Date().getDay()]+'</h2><button class="btn ghost sm" data-go="table">الجدول كاملًا</button></div><div class="ds-today">'+r.map(function(x){return '<div class="tt-c on" style="--cc:'+ttColor(x.c)+'"><small>الحصة '+ar(x.i+1)+(t.times[x.i]?' · '+esc(t.times[x.i]):'')+'</small><b>'+esc(x.c.cls||'')+'</b>'+(x.c.subj?'<small>'+esc(x.c.subj)+'</small>':'')+(x.c.note?'<small class="nt">'+esc(x.c.note)+'</small>':'')+'</div>';}).join('')+'</div></section>';}
V.home=function(el){var b=curBook(),all=books(),nl=0,nt=0;all.forEach(function(x){D.lessonsOf(x.id).forEach(function(L){nl++;if(S.taught[L.id])nt++;});});
  var next=null;D.lessonsOf(b.id).some(function(L){if(!S.taught[L.id]){next=L;return true;}});
  var top=S.students.map(function(s){return {s:s,p:pts(s.id)};}).sort(function(a,c){return c.p-a.p;}).slice(0,3);
  el.innerHTML='<section class="card ds-hero glass"><span class="ds-avatar">'+(PF.emoji||'🍎')+'</span><p class="eyebrow">'+esc(S.settings.school||PF.title||'')+'</p><h1 data-type="مرحبًا '+esc(S.settings.teacher)+'">مرحبًا '+esc(S.settings.teacher)+'</h1><p class="sub">'+esc(S.settings.role||'')+'</p>'+
   '<div class="ds-kpi"><div><b>'+ar(nl)+'</b><small>حصة جاهزة</small></div><div><b>'+ar(nt)+'</b><small>حصة دُرّست</small></div><div><b>'+ar(S.students.length)+'</b><small>طالبًا</small></div><div><b>'+ar(S.results.length)+'</b><small>نتيجة مستلمة</small></div></div>'+
   (next?'<div class="ds-row"><span style="font-size:30px">'+sceneE(next)+'</span><div class="grow"><small>الحصة التالية · '+esc(bookLabel(b))+'</small><b>'+esc(next.t)+'</b></div><button class="btn gold" data-play="'+next.id+'">'+I.play+'ابدئي</button></div>':'')+'</section>'+todayHTML()+
   '<div class="ds-grid">'+NAV.slice(1).map(function(n){var sc=SEC[n[0]];return '<button class="ds-sec" data-go="'+n[0]+'" style="--sc:'+sc.c+'"><span class="ic">'+sc.e+'</span><b>'+n[1]+'</b><small>'+sc.d+'</small></button>';}).join('')+'</div>'+
   (top.length&&top[0].p>0?'<section class="card glass stack"><h2 class="h">⭐ أبطال النقاط</h2><div class="ds-podium">'+[1,0,2].map(function(i){var t=top[i];if(!t)return '<div></div>';return '<div><span style="font-size:30px">'+['🥇','🥈','🥉'][i]+'</span><b>'+esc(t.s.name)+'</b><div class="bar" style="height:'+[110,80,60][i]+'px">'+ar(t.p)+'</div></div>';}).join('')+'</div></section>':'');};
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-play]');if(!b)return;var L=D.REG.lessons[b.dataset.play];if(L){D.autoRead=!!S.settings.autoRead;D.player.open(L);}});

V.lessons=function(el){var b=curBook();el.innerHTML=head('lessons')+unitsHTML(b,function(L){return '<button class="ds-ls" data-play="'+L.id+'" style="--sc:'+D.SUBJ[L.subj].c+'"><span class="em">'+sceneE(L)+'</span><span><small>'+lessonMeta(L)+'</small><b>'+esc(L.t)+'</b><small>'+esc(D.scene(L.sc).n)+'</small></span>'+(S.taught[L.id]?'<span class="done">✔ '+D.fdate(S.taught[L.id])+'</span>':'')+'</button>';});};

/* ---------- التحضير: الخطة التعليمية الفردية ---------- */
var STRAT=['استراتيجية حل المشكلات','العصف الذهني','طرح الأسئلة','أسلوب القصة','الحوار والمناقشة','التمثيل','التعلم بالأقران','التعلم المحوسب','الحواس المتعددة','الإملاء','التعلم الذاتي','القراءة الجهرية','الربط الحسي','التعلم التعاوني','إنشاء قصة تفاعلية','الاستقصاء','الرمل'];
var DEV=['الانتباه والتركيز','الإدراك البصري','الإدراك السمعي','التمييز البصري','التمييز السمعي','الذاكرة البصرية','الذاكرة السمعية','الذاكرة الحسية','الإغلاق','التآزر الحركي','التسلسل','تحليل المهام'];
var MAT=['الحاسوب','السبورة التفاعلية','البرنامج التفاعلي','ألعاب ذهنية','ألعاب حركية','برامج محوسبة','عرض بطاقات','كتاب الطالب/ النشاط','كتيب أنشطة','كراسة التأهيل','الكراسة النمائية','بطاقات ممغنطة','مجسمات أرقام','مجسمات حروف','عملات نقدية','مكعبات','حجر نرد','ألوان'];
var CRIT=['حوار ومناقشة','نشاط صفي','اختبار قصير','الملاحظة','سؤال قصير','نشاط أدائي','نشاط تقييمي'];
var KN={mcq:'اختيار الإجابة الصحيحة',tf:'الحكم بصح أو خطأ',fill:'إكمال الفراغ',count:'العدّ بالنقر ثم اختيار العدد',cmp:'المقارنة بالإشارات',num:'كتابة الإجابة على لوحة الأرقام',order:'الترتيب',build:'تركيب الكلمة من حروفها أو مقاطعها',sort:'التصنيف بالسحب إلى السلال',match:'التوصيل بين المتقابلات',pick:'اختيار كل الإجابات الصحيحة',gate:'تحدي «تدخل أم لا تدخل؟»',line:'القفز على خط الأعداد',frac:'تظليل أجزاء الكسر'};
function autoPlan(L){var kinds={},beats={};var items=D.expand([].concat(L.warm||[],L.acts||[],L.chal?[L.chal]:[],L.exit?[L.exit]:[]),L.id+'p');items.forEach(function(i){kinds[i.k]=1;});(L.show||[]).forEach(function(b){beats[b.b]=1;});
  var st=['طرح الأسئلة','الحواس المتعددة','التعلم المحوسب','الحوار والمناقشة'];if(L.sc)st.push('أسلوب القصة');if(beats.read)st.push('القراءة الجهرية');if(L.subj==='math'||kinds.num||kinds.line)st.push('استراتيجية حل المشكلات');if(kinds.sort||kinds.match)st.push('التعلم التعاوني');if(beats.tens||beats.eq||beats.frame)st.push('الربط الحسي');if(L.subj==='sci')st.push('الاستقصاء');if(kinds.build&&L.subj==='ar')st.push('الإملاء');
  var dv=['الانتباه والتركيز','الإدراك البصري','الإدراك السمعي'];if(kinds.mcq||kinds.pick||kinds.gate)dv.push('التمييز البصري');if(beats.word||beats.read||beats.letters)dv.push('التمييز السمعي','الذاكرة السمعية');if(kinds.match)dv.push('الذاكرة البصرية');if(kinds.order||kinds.build||beats.line)dv.push('التسلسل','تحليل المهام');if(kinds.sort)dv.push('التآزر الحركي');if(kinds.fill)dv.push('الإغلاق');
  var mt=['الحاسوب','السبورة التفاعلية','البرنامج التفاعلي','عرض بطاقات','كتاب الطالب/ النشاط','ألعاب ذهنية'];if(L.subj==='math'){mt.push('مجسمات أرقام');if(beats.tens||beats.frame)mt.push('مكعبات');if(L.t.indexOf('نقود')>=0)mt.push('عملات نقدية');}if(D.REG.books[L.book].obj)mt=mt.map(function(x){return x==='كتاب الطالب/ النشاط'?'كتيب أنشطة':x;});if(L.subj==='ar')mt.push('بطاقات ممغنطة','مجسمات حروف');mt.push('ألوان');
  var steps=[];var sc=D.scene(L.sc);steps.push(['التهيئة','تقديم الحصة في قصة «'+sc.n+'»'+(L.warm&&L.warm.length?'، ثم يحل الطالب '+ar(L.warm.length)+' بطاقات تمهيدية لفتح «'+sc.st.warm+'»':'')+'.']);
  if(L.goals)steps.push(['عرض الأهداف','قراءة أهداف الحصة على بطاقات الصعود.']);
  (L.show||[]).forEach(function(b){var t=b.h||b.t||b.w||(b.b==='tens'?'تمثيل العدد '+b.n+' بالعشرات والآحاد':b.b==='eq'?'تمثيل '+b.a+' '+b.op+' '+b.b+' بالمحسوسات':b.b==='line'?'القفز على خط الأعداد':b.b==='read'?'قراءة النص':'');if(t)steps.push(['العرض',String(t)+(b.b==='read'?' قراءة نموذجية ثم قراءة الطلاب جملة جملة':'')+'.']);});
  D.expand(L.acts||[],L.id+'a').forEach(function(a,i){steps.push(['النشاط '+ar(i+1),(a.h||KN[a.k]||'نشاط')+' ('+(KN[a.k]||'')+').']);});
  if(L.chal)steps.push(['التحدي',(L.chal.h||KN[L.chal.k]||'تحدٍ ختامي')+'.']);
  steps.push(['الختام','تلخيص ما تعلّمناه، وبطاقة خروج، وتقييم الطالب لشعوره نحو الدرس، وتعزيز بالنجوم.']);
  var qs=D.atoms(items).map(function(a){return a.q||(a.k==='cmp'?'قارن بين '+a.a+' و '+a.b:a.k==='count'?'عُدّ ثم اختر العدد':a.s?a.s.replace('_','......'):'');}).filter(Boolean).slice(0,4);
  return {goals:(L.goals||[]).join('\n'),strat:uniq(st),dev:uniq(dv),mat:uniq(mt),steps:steps.map(function(s){return s[0]+': '+s[1];}).join('\n'),qs:qs.join('\n'),crit:['حوار ومناقشة','نشاط صفي','الملاحظة','نشاط تقييمي'],res:'',notes:'',start:'',end:'',week:'',month:'',goalNo:L.gno||''};}
function uniq(a){return a.filter(function(x,i){return a.indexOf(x)===i;});}
function plan(L){var p=S.plans[L.id];var a=autoPlan(L);if(!p)return a;return Object.assign({},a,p);}
V.plans=function(el,r){if(r.id){return planView(el,D.REG.lessons[r.id]);}var b=curBook();
  el.innerHTML=head('plans','<div class="row"><button class="btn soft" data-a="printUnitAll">'+X.print+'طباعة تحاضير الكتاب</button><button class="btn soft" data-a="printUnitAll" data-m="pdf">'+X.dl+'PDF للكتاب</button></div>')+unitsHTML(b,function(L){return '<button class="ds-ls" data-go="plans/'+L.id+'" style="--sc:#2FA36B"><span class="em">📝</span><span><small>'+lessonMeta(L)+'</small><b>'+esc(L.t)+'</b><small>'+(S.plans[L.id]?'✎ عدّلتِه':'جاهز تلقائيًا')+'</small></span></button>';});};
function planView(el,L){if(!L){el.innerHTML='<div class="ds-empty">الحصة غير موجودة</div>';return;}var p=plan(L);
  function chips(key,list){return '<div class="ds-checks" data-k="'+key+'">'+list.map(function(x){return '<button type="button" aria-pressed="'+(p[key].indexOf(x)>=0)+'">'+esc(x)+'</button>';}).join('')+'</div>';}
  el.innerHTML='<div class="between"><button class="btn ghost sm" data-go="plans">'+I.next+'كل التحاضير</button><div class="row"><button class="btn soft sm" data-play="'+L.id+'">'+I.play+'العرض</button><button class="btn gold sm" data-a="printPlan" data-l="'+L.id+'">'+X.print+'طباعة</button><button class="btn gold sm" data-a="printPlan" data-m="pdf" data-l="'+L.id+'">'+X.dl+'تحميل PDF</button></div></div>'+
   '<section class="card glass ds-plan"><p class="eyebrow">'+esc(bookLabel(D.REG.books[L.book]))+' · '+lessonMeta(L)+'</p><h1 class="h-xl" style="margin:0">'+esc(L.t)+'</h1><p class="sub" style="margin:0">'+esc(L.uname)+'</p>'+
   '<div class="pf">'+[['goalNo','رقم الهدف السنوي'],['month','الشهر'],['week','الأسبوع'],['start','تاريخ البدء بالهدف'],['end','تاريخ تحقيق الهدف']].map(function(f){return '<label class="field"><span class="lbl">'+f[1]+'</span><input class="input" data-f="'+f[0]+'" value="'+esc(p[f[0]]||'')+'"'+(f[0]==='start'||f[0]==='end'?' type="date"':'')+'></label>';}).join('')+'</div>'+
   '<label class="field"><span class="lbl">الهدف التعليمي العام (السنوي)</span><textarea class="textarea" data-f="annual" rows="2">'+esc(p.annual!=null?p.annual:L.annual)+'</textarea></label>'+
   '<label class="field"><span class="lbl">الأهداف التعليمية الفرعية</span><textarea class="textarea" data-f="goals" rows="3">'+esc(p.goals)+'</textarea></label>'+
   '<div><h4>الأساليب والاستراتيجيات المستخدمة</h4>'+chips('strat',STRAT)+'<input class="input" data-f="stratO" placeholder="أخرى…" value="'+esc(p.stratO||'')+'" style="margin-top:8px">'+'</div>'+
   '<label class="field"><span class="lbl">آلية التنفيذ / الأنشطة التعليمية</span><textarea class="textarea" data-f="steps" rows="8">'+esc(p.steps)+'</textarea></label>'+
   '<div><h4>أهم الجوانب النمائية التي سيتم التركيز عليها</h4>'+chips('dev',DEV)+'<input class="input" data-f="devO" placeholder="أخرى…" value="'+esc(p.devO||'')+'" style="margin-top:8px">'+'</div><div><h4>الوسائل التعليمية والمواد اللازمة والتقانة</h4>'+chips('mat',MAT)+'<input class="input" data-f="matO" placeholder="أخرى…" value="'+esc(p.matO||'')+'" style="margin-top:8px">'+'</div>'+
   '<label class="field"><span class="lbl">أسئلة التقويم</span><textarea class="textarea" data-f="qs" rows="4">'+esc(p.qs)+'</textarea></label><div><h4>معايير التقييم</h4>'+chips('crit',CRIT)+'</div>'+
   '<div><h4>النتيجة ومستوى التحسن</h4><div class="ds-checks" data-one="res">'+['حقق الهدف بمستوى جيد','حقق الهدف بمستوى متوسط','حقق الهدف بمستوى ضعيف','لم يحقق'].map(function(x){return '<button type="button" aria-pressed="'+(p.res===x)+'">'+x+'</button>';}).join('')+'</div></div>'+
   '<label class="field"><span class="lbl">ملاحظات المعلمة</span><textarea class="textarea" data-f="notes" rows="2">'+esc(p.notes)+'</textarea></label>'+
   '<div class="row"><button class="btn soft sm" data-a="planReset" data-l="'+L.id+'">'+I.reset+'إرجاع التحضير التلقائي</button><span class="note">يُحفظ كل تعديل تلقائيًا على هذا الجهاز</span></div></section>'+
   '<section class="card glass stack"><div class="between"><h2 class="h" style="margin:0">معاينة بنموذج الخطة التعليمية الفردية</h2><span class="note">هكذا يُطبع ويُحمَّل</span></div><div class="pp-prev" id="ppPrev"></div></section>';
  var prev=$('#ppPrev',el);function pv(){if(!prev.isConnected)return window.removeEventListener('resize',pv);prev.innerHTML=planPrintHTML(L);prev.style.setProperty('--z',Math.min(1,(prev.clientWidth-2)/1060));}pv();window.addEventListener('resize',pv);
  function save(){var cur=S.plans[L.id]||{};$$('[data-f]',el).forEach(function(i){cur[i.dataset.f]=i.value;});$$('[data-k]',el).forEach(function(g){cur[g.dataset.k]=$$('button[aria-pressed="true"]',g).map(function(b){return b.textContent;});});var r1=$('[data-one] button[aria-pressed="true"]',el);cur.res=r1?r1.textContent:'';S.plans[L.id]=cur;persist();pv();}
  $$('[data-f]',el).forEach(function(i){i.addEventListener('input',save);});
  $$('.ds-checks button',el).forEach(function(b){b.addEventListener('click',function(){var one=b.parentNode.dataset.one;if(one)$$('button',b.parentNode).forEach(function(x){if(x!==b)x.setAttribute('aria-pressed','false');});b.setAttribute('aria-pressed',String(b.getAttribute('aria-pressed')!=='true'));save();});});}
A.planReset=function(b){if(!confirm('إرجاع التحضير التلقائي وحذف تعديلاتك على هذه الحصة؟'))return;delete S.plans[b.dataset.l];persist();render();};
/* طباعة التحضير بنفس قالب «الخطة التعليمية الفردية» (صفحتان A4 أفقي) */
var RES=['حقق الهدف بمستوى جيد','حقق الهدف بمستوى متوسط','حقق الهدف بمستوى ضعيف','لم يحقق'];
var MATX={'كتيب أنشطة':' ص........','كراسة التأهيل':' ص........','الكراسة النمائية':' ص......'};
function sv(k){var v=S.settings[k];return v!=null&&v!==''?v:(PF[k]||'');}
function mr(n){return String(n||'').replace(/^(أ|ا)\s*[\.\/]\s*/,'');}
function planPrintHTML(L,stName){var p=plan(L),s=S.settings,nl=function(t){return esc(t||'').replace(/\n/g,'<br>');};
  function par(list,sel,other,ex){return list.map(function(x){return '<div class="it">('+(sel.indexOf(x)>=0?'<i>✓</i>':'<i></i>')+') '+esc(x)+(ex&&ex(x)||'')+'</div>';}).join('')+(other===false?'':'<div class="it">('+(other?'<i>✓</i>':'<i></i>')+') أخرى: '+(other?esc(other):'..........')+'</div>');}
  function box(list,sel,other){return list.map(function(x){return '<div class="it"><u>'+(sel.indexOf(x)>=0?'✓':'')+'</u> '+esc(x)+'</div>';}).join('')+'<div class="it"><u>'+(other?'✓':'')+'</u> أخرى: '+esc(other||'')+'</div>';}
  function dt(v){return v?D.fdate(v)+' '+String(v).slice(0,4):'';}
  var steps=esc(p.steps||'').split('\n').map(function(l){var i=l.indexOf(':');return i>0&&i<16?'<b>'+l.slice(0,i+1)+'</b>'+l.slice(i+1):l;}).join('<br>');
  var r=p.res||'',lv={'حقق الهدف بمستوى جيد':'جيد','حقق الهدف بمستوى متوسط':'متوسط','حقق الهدف بمستوى ضعيف':'ضعيف'}[r]||'';
  return '<div class="pp"><div class="ttl">الخطة التعليمية الفردية</div>'+
   '<table class="hd"><colgroup><col style="width:17%"><col style="width:19%"><col style="width:30%"><col style="width:15%"><col style="width:19%"></colgroup><tbody>'+
   '<tr><td>الفصل الدراسي: <b>الأول</b></td><td>العام الدراسي: <b>'+esc(s.year)+'</b></td><td>الاسم: <b>'+esc(stName||'')+'</b></td><td>المادة: <b>'+esc(D.SUBJ[L.subj].n)+'</b></td><td>الصف: <b>'+GR[L.grade]+'</b></td></tr>'+
   '<tr><td colspan="2">المدرسة: <b>'+esc(sv('school'))+'</b></td><td>المحافظة: <b>'+esc(sv('region'))+'</b></td><td colspan="2">رقم الهدف السنوي / طويل المدى: <b>'+esc(p.goalNo||'')+'</b></td></tr>'+
   '<tr><td colspan="5" class="tall">الهدف التعليمي العام: <b>'+nl(p.annual!=null?p.annual:L.annual)+'</b></td></tr>'+
   '<tr><td>الشهر: <b>'+esc(p.month||'')+'</b></td><td>الأسبوع: <b>'+esc(p.week||'')+'</b></td><td>تاريخ البدء بالهدف: <b>'+dt(p.start)+'</b></td><td colspan="2">تاريخ تحقيق الهدف: <b>'+dt(p.end)+'</b></td></tr></tbody></table>'+
   '<table class="mt'+((p.steps||'').length>1100?' tight':'')+'"><colgroup><col style="width:20.9%"><col style="width:10.9%"><col style="width:41.9%"><col style="width:11.7%"><col style="width:14.6%"></colgroup>'+
   '<thead><tr><th>الأهداف التعليمية الفرعية</th><th>الأساليب والاستراتيجيات المستخدمة</th><th>آلية التنفيذ / الأنشطة التعليمية</th><th>أهم الجوانب النمائية التي سيتم التركيز عليها</th><th>الوسائل التعليمية والمواد اللازمة والتقانة</th></tr></thead>'+
   '<tbody><tr><td class="tx">'+nl(p.goals)+'</td><td>'+par(STRAT,p.strat||[],p.stratO)+'</td><td class="tx"><div class="ls">الدرس: '+esc(L.t)+(L.p?' ('+esc(L.p)+')':'')+'</div>'+steps+'</td><td>'+box(DEV,p.dev||[],p.devO)+'</td><td>'+par(MAT,p.mat||[],p.matO,function(x){return MATX[x]||(x==='كتاب الطالب/ النشاط'&&(p.mat||[]).indexOf(x)>=0&&L.p?' '+esc(L.p):'');})+'</td></tr></tbody></table></div>'+
   '<div class="pp p2"><table class="mt ev"><colgroup><col style="width:48.6%"><col style="width:11.9%"><col style="width:7.9%"><col style="width:5.9%"><col style="width:25.7%"></colgroup>'+
   '<thead><tr><th rowspan="2">أسئلة التقويم</th><th rowspan="2">معايير التقييم</th><th colspan="2">النتيجة ومستوى التحسن</th><th rowspan="2">ملاحظات المعلم</th></tr><tr><th class="s">حقق الهدف بمستوى</th><th class="s">لم يحقق</th></tr></thead>'+
   '<tbody><tr><td class="tx">'+nl(p.qs)+'</td><td>'+par(CRIT,p.crit||[],false)+'</td><td>'+['جيد','متوسط','ضعيف'].map(function(x){return '<div class="it"><u>'+(lv===x?'✓':'')+'</u> '+x+'</div>';}).join('')+'</td><td class="c">'+(r==='لم يحقق'?'<b class="big">✓</b>':'')+'</td><td class="tx">'+nl(p.notes)+'</td></tr></tbody></table>'+
   '<div class="sig"><span>معلم صعوبات التعلم: أ/ '+esc(mr(sv('teacher')))+'</span><span>مشرف صعوبات التعلم: أ/ '+esc(mr(sv('sup'))||'....................')+'</span><span>مدير المدرسة: أ/ <b>'+esc(mr(sv('head'))||'....................')+'</b></span></div></div>';}
function doPrint(html){var pd=$('#dsPrint');if(!pd){pd=document.createElement('div');pd.id='dsPrint';}if(pd.parentNode!==document.body)document.body.appendChild(pd);pd.innerHTML=html;setTimeout(function(){window.print();},150);}
/* تحميل PDF: تُرسم كل صفحة صورةً بخط المنصة ثم تُجمع في ملف A4 أفقي */
var BASE=(document.currentScript&&document.currentScript.src||'').replace(/[^\/]*$/,''),pdfL=null;
function loadJS(src){return new Promise(function(ok,no){var s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=no;document.head.appendChild(s);});}
function pdfLibs(){return pdfL||(pdfL=Promise.all([window.html2canvas?1:loadJS(BASE+'vendor/html2canvas.min.js'),window.jspdf?1:loadJS(BASE+'vendor/jspdf.umd.min.js')]).catch(function(e){pdfL=null;throw e;}));}
function savePDF(html,name,land){var host;TB.toast('جارٍ تجهيز ملف PDF…',{icon:'download'});
  return pdfLibs().then(function(){host=document.createElement('div');host.className='pp-host'+(land===false?' port':'');host.innerHTML=html;document.body.appendChild(host);return document.fonts?document.fonts.ready:0;}).then(function(){
    var pages=$$('.pp',host),P=land===false?[210,297]:[297,210],doc=new window.jspdf.jsPDF({orientation:land===false?'portrait':'landscape',unit:'mm',format:'a4'});
    return pages.reduce(function(pr,pg,i){return pr.then(function(){return window.html2canvas(pg,{scale:2,backgroundColor:'#ffffff',logging:false}).then(function(c){if(i)doc.addPage();var m=8,w=P[0]-2*m,hh=c.height*w/c.width;if(hh>P[1]-2*m){hh=P[1]-2*m;w=c.width*hh/c.height;}doc.addImage(c.toDataURL('image/jpeg',.9),'JPEG',(P[0]-w)/2,m,w,hh);});});},Promise.resolve()).then(function(){var u=URL.createObjectURL(doc.output('blob')),l=document.createElement('a');l.href=u;l.download=name.replace(/[\\\/:*?"<>|]/g,'-')+'.pdf';document.body.appendChild(l);l.click();l.remove();setTimeout(function(){URL.revokeObjectURL(u);},60000);});
  }).then(function(){if(host)host.remove();TB.toast('حُفظ ملف PDF في التنزيلات',{gold:true,icon:'check'});},function(){if(host)host.remove();TB.toast('تعذّر إنشاء PDF الآن، جرّبي زر الطباعة ثم «حفظ بصيغة PDF»');});}
function out(mode,html,name,land){return mode==='pdf'?savePDF(html,name,land):doPrint(html);}
A.printPlan=function(b){var L=D.REG.lessons[b.dataset.l],list=studentsOf(L.grade),m=b.dataset.m||'print',nm='تحضير '+L.t;
  if(!list.length)return out(m,planPrintHTML(L),nm);
  TB.sheet('<div class="stack"><button class="btn gold block" data-pp="">نسخة واحدة بلا اسم</button><button class="btn soft block" data-pp="*">نسخة لكل طالب ('+ar(list.length)+')</button>'+list.map(function(s){return '<button class="btn ghost block" data-pp="'+s.id+'">'+esc(s.name)+'</button>';}).join('')+'</div>',{title:m==='pdf'?'تحميل التحضير PDF':'طباعة التحضير',icon:m==='pdf'?'download':'book'});
  $$('[data-pp]').forEach(function(x){x.onclick=function(){var v=x.dataset.pp;TB.closeSheet();out(m,v==='*'?list.map(function(s){return planPrintHTML(L,s.name);}).join(''):planPrintHTML(L,v?stu(v).name:''),nm+(v&&v!=='*'?' - '+stu(v).name:''));};});};
A.printUnitAll=function(b){var bk=curBook();out(b.dataset.m||'print',D.lessonsOf(bk.id).map(function(L){return planPrintHTML(L);}).join(''),'تحاضير '+bookLabel(bk));};

/* ---------- جدول الحصص: تعبّئه المعلمة يدويًا ---------- */
var DAYS=['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس'],TTC=['#3D9BE9','#2FA36B','#F28C38','#C46BD8','#E85D75','#1FA2A8','#6C7BE0'];
function TT(){if(!S.tt)S.tt={n:7,times:[],cells:{}};return S.tt;}
function ttColor(c){var i=S.classes.map(function(x){return x.name;}).indexOf(c.cls);return TTC[(i<0?D.hash(c.cls||'')%TTC.length:i)%TTC.length];}
function ttSubjects(){var a=[];books().forEach(function(b){var n=D.SUBJ[b.subj].n;if(a.indexOf(n)<0)a.push(n);});return a;}
function ttGrid(print){var t=TT(),td=new Date().getDay();
  return '<table class="ds-tt"><thead><tr><th class="cn">اليوم / الحصة</th>'+Array.apply(null,{length:t.n}).map(function(_,i){return '<th>الحصة '+ar(i+1)+(print?(t.times[i]?'<small>'+esc(t.times[i])+'</small>':''):'<input class="tt-time" data-time="'+i+'" placeholder="الوقت" value="'+esc(t.times[i]||'')+'">')+'</th>';}).join('')+'</tr></thead><tbody>'+
   DAYS.map(function(d,di){return '<tr'+(!print&&di===td?' class="today"':'')+'><th class="cn">'+d+'</th>'+Array.apply(null,{length:t.n}).map(function(_,i){var c=t.cells[di+'-'+i];
     var inner=c?'<b>'+esc(c.cls||'')+'</b>'+(c.subj?'<small>'+esc(c.subj)+'</small>':'')+(c.note?'<small class="nt">'+esc(c.note)+'</small>':''):'';
     return print?'<td>'+inner+'</td>':'<td><button class="tt-c'+(c?' on':'')+'" data-cell="'+di+'-'+i+'"'+(c?' style="--cc:'+ttColor(c)+'"':'')+'>'+(inner||'<span class="pl">+</span>')+'</button></td>';}).join('')+'</tr>';}).join('')+'</tbody></table>';}
function ttToday(){var t=TT(),di=new Date().getDay();if(di>4)return [];var r=[];for(var i=0;i<t.n;i++){var c=t.cells[di+'-'+i];if(c)r.push({i:i,c:c});}return r;}
V.table=function(el){var t=TT();
  el.innerHTML=head('table','<div class="row"><button class="btn soft" data-a="ttPrint">'+X.print+'طباعة</button><button class="btn soft" data-a="ttPrint" data-m="pdf">'+X.dl+'PDF</button></div>').replace(bookBar(),'')+
   '<section class="card glass stack"><div class="between"><div class="row"><span>عدد الحصص في اليوم</span><div class="seg"><button data-a="ttN" data-d="-1" aria-label="أقل">−</button><button aria-pressed="true">'+ar(t.n)+'</button><button data-a="ttN" data-d="1" aria-label="أكثر">+</button></div></div><button class="btn ghost sm" data-a="ttClear">'+X.trash+'مسح الجدول</button></div>'+
   '<p class="note" style="margin:0">انقري أي خانة لتكتبي الصف والمادة. اكتبي وقت كل حصة تحت رقمها. يظهر جدول اليوم في الرئيسية.</p>'+
   '<div class="ds-tt-wrap">'+ttGrid()+'</div></section>';
  $$('[data-time]',el).forEach(function(i){i.addEventListener('input',function(){t.times[+i.dataset.time]=i.value.trim();persist();});});};
A.ttN=function(b){var t=TT();t.n=Math.max(1,Math.min(10,t.n+(+b.dataset.d)));persist();render();};
A.ttClear=function(){if(!confirm('مسح كل خانات الجدول؟'))return;S.tt={n:TT().n,times:TT().times,cells:{}};persist();render();};
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-cell]');if(!b||!S)return;var k=b.dataset.cell,t=TT(),c=t.cells[k]||{},p=k.split('-');
  var cls=S.classes.map(function(x){return x.name;}),sub=ttSubjects();
  function chips(name,list,val){return '<div class="ds-checks" data-one="'+name+'">'+list.map(function(x){return '<button type="button" aria-pressed="'+(val===x)+'">'+esc(x)+'</button>';}).join('')+'</div>';}
  TB.sheet('<form class="stack" id="ttF"><label class="field"><span class="lbl">الصف / الشعبة</span>'+chips('cls',cls,c.cls)+'<input class="input" name="cls" placeholder="أو اكتبي الصف" value="'+esc(c.cls||'')+'" style="margin-top:8px"></label>'+
   '<label class="field"><span class="lbl">المادة</span>'+chips('subj',sub,c.subj)+'<input class="input" name="subj" placeholder="أو اكتبي المادة" value="'+esc(c.subj||'')+'" style="margin-top:8px"></label>'+
   '<label class="field"><span class="lbl">ملاحظة (الدرس، القاعة، أسماء الطلاب…)</span><input class="input" name="note" value="'+esc(c.note||'')+'"></label>'+
   '<button class="btn gold block" type="submit">'+I.check+'حفظ</button>'+(t.cells[k]?'<button class="btn ghost block" type="button" id="ttDel">'+X.trash+'إفراغ الخانة</button>':'')+'</form>',{title:DAYS[+p[0]]+' · الحصة '+ar(+p[1]+1),icon:'cal'});
  var f=$('#ttF');$$('[data-one] button',f).forEach(function(x){x.onclick=function(){var g=x.parentNode,on=x.getAttribute('aria-pressed')!=='true';$$('button',g).forEach(function(y){y.setAttribute('aria-pressed','false');});x.setAttribute('aria-pressed',String(on));f.elements[g.dataset.one].value=on?x.textContent:'';};});
  f.onsubmit=function(ev){ev.preventDefault();var v={cls:f.elements.cls.value.trim(),subj:f.elements.subj.value.trim(),note:f.elements.note.value.trim()};if(v.cls||v.subj||v.note)t.cells[k]=v;else delete t.cells[k];persist();TB.closeSheet();render();};
  var del=$('#ttDel');if(del)del.onclick=function(){delete t.cells[k];persist();TB.closeSheet();render();};});
A.ttPrint=function(b){var s=S.settings;out(b.dataset.m||'print','<div class="pp tt"><div class="ttl">جدول الحصص الأسبوعي</div><div class="tth"><span>'+esc(sv('teacher'))+'</span><span>'+esc(sv('school'))+'</span><span>العام الدراسي '+esc(s.year)+' · الفصل الدراسي الأول</span></div>'+ttGrid(true)+'</div>','جدول الحصص - '+mr(sv('teacher')));};

/* ---------- حضور الطلاب وغيابهم ---------- */
var AST=[['p','حاضر','✅','#2FA36B'],['a','غائب','❌','#E85D75'],['l','متأخر','⏰','#F2B134'],['e','بعذر','📝','#3D9BE9']];
function attDay(d){S.att=S.att||{};return S.att[d]||(S.att[d]={});}
function addDays(d,n){var a=d.split('-'),x=new Date(+a[0],a[1]-1,+a[2]+n);return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0');}
function attStats(list,from,to){var days=Object.keys(S.att||{}).filter(function(d){return d>=from&&d<=to;}).sort();
  return list.map(function(s){var r={s:s,p:0,a:0,l:0,e:0,n:0,abs:[]};days.forEach(function(d){var v=S.att[d][s.id];if(!v)return;r[v]++;r.n++;if(v==='a')r.abs.push(d);});r.pct=r.n?Math.round((r.p+r.l+r.e)/r.n*100):null;return r;});}
V.att=function(el){var cid=S.ui.attCls||(S.classes[0]&&S.classes[0].id),c=clsOf(cid)||S.classes[0],day=S.ui.attDay||D.ymd(),tab=S.ui.attTab||'day';
  var list=c?S.students.filter(function(s){return s.cls===c.id;}):[],rec=attDay(day);
  var top='<div class="ds-row"><b>الصف</b><select class="select" id="atC" style="flex:1">'+S.classes.map(function(x){return '<option value="'+x.id+'"'+(c&&x.id===c.id?' selected':'')+'>'+esc(x.name)+'</option>';}).join('')+'</select></div>'+
   '<div class="seg" role="tablist"><button data-attab="day" aria-pressed="'+(tab==='day')+'">📅 تسجيل اليوم</button><button data-attab="rep" aria-pressed="'+(tab==='rep')+'">📊 التقرير</button></div>';
  if(!list.length){el.innerHTML=head('att').replace(bookBar(),'')+top+'<div class="ds-empty">أضيفي طلاب هذا الصف من قسم الطلاب</div>';return wire();}
  if(tab==='day'){var cnt={p:0,a:0,l:0,e:0,x:0};list.forEach(function(s){cnt[rec[s.id]||'x']++;});
    el.innerHTML=head('att').replace(bookBar(),'')+top+
     '<section class="card glass stack"><div class="between" style="flex-wrap:wrap;gap:10px"><div class="row" style="flex-wrap:nowrap"><button class="round-btn" data-a="attDay" data-d="-1" aria-label="اليوم السابق">'+I.next+'</button><input class="input" type="date" id="atD" value="'+day+'" style="width:auto"><button class="round-btn" data-a="attDay" data-d="1" aria-label="اليوم التالي">'+I.back+'</button></div><div class="row"><button class="btn gold sm" data-a="attAll">'+I.check+'الكل حاضر</button><button class="btn ghost sm" data-a="attClear">مسح اليوم</button></div></div>'+
     '<div class="ds-atsum">'+AST.map(function(t){return '<span style="--ac:'+t[3]+'">'+t[2]+' '+t[1]+' <b>'+ar(cnt[t[0]])+'</b></span>';}).join('')+(cnt.x?'<span style="--ac:#8a94a6">⏳ لم يُسجَّل <b>'+ar(cnt.x)+'</b></span>':'')+'</div>'+
     '<div class="ds-atlist">'+list.map(function(s){var v=rec[s.id]||'';return '<div class="ds-at" data-v="'+v+'"><span class="av">'+av(s)+'</span><b class="grow">'+esc(s.name)+'</b><div class="ds-atbtns">'+AST.map(function(t){return '<button data-at="'+s.id+'" data-v="'+t[0]+'" aria-pressed="'+(v===t[0])+'" style="--ac:'+t[3]+'" title="'+t[1]+'">'+t[2]+'<span>'+t[1]+'</span></button>';}).join('')+'</div></div>';}).join('')+'</div></section>';}
  else{var to=S.ui.attTo||D.ymd(),from=S.ui.attFrom||to.slice(0,8)+'01',st=attStats(list,from,to);
    el.innerHTML=head('att','<div class="row"><button class="btn soft" data-a="attPrint">'+X.print+'طباعة</button><button class="btn soft" data-a="attPrint" data-m="pdf">'+X.dl+'PDF</button></div>').replace(bookBar(),'')+top+
     '<section class="card glass stack"><div class="row"><label class="field" style="flex:1"><span class="lbl">من</span><input class="input" type="date" id="atF" value="'+from+'"></label><label class="field" style="flex:1"><span class="lbl">إلى</span><input class="input" type="date" id="atT" value="'+to+'"></label></div>'+
     '<div class="ds-tt-wrap">'+attTable(st)+'</div><p class="note" style="margin:0">نسبة الحضور = (حاضر + متأخر + بعذر) ÷ الأيام المسجلة. يظهر باللون الأحمر من تقل نسبته عن ٨٠٪.</p></section>';}
  wire();
  function wire(){var cs=$('#atC',el);if(cs)cs.onchange=function(){S.ui.attCls=this.value;persist();render();};
    $$('[data-attab]',el).forEach(function(b){b.onclick=function(){S.ui.attTab=b.dataset.attab;persist();render();};});
    var dd=$('#atD',el);if(dd)dd.onchange=function(){if(this.value){S.ui.attDay=this.value;persist();render();}};
    var f=$('#atF',el),t=$('#atT',el);if(f)f.onchange=function(){S.ui.attFrom=this.value;persist();render();};if(t)t.onchange=function(){S.ui.attTo=this.value;persist();render();};
    $$('[data-at]',el).forEach(function(b){b.onclick=function(){var sid=b.dataset.at,v=b.dataset.v,r=attDay(day);if(r[sid]===v)delete r[sid];else r[sid]=v;persist();SND.play(v==='p'?'good':'tap');
      var row=b.closest('.ds-at');row.dataset.v=r[sid]||'';$$('button',row).forEach(function(x){x.setAttribute('aria-pressed',String(r[sid]===x.dataset.v));});clearTimeout(V._at);V._at=setTimeout(function(){S.ui.keepScroll=1;var y=window.scrollY;render();window.scrollTo(0,y);},900);};});}};
function attTable(st,print){return '<table class="'+(print?'':'ds-attab')+'"><thead><tr><th>م</th><th>الطالب</th>'+AST.map(function(t){return '<th>'+(print?'':t[2]+' ')+t[1]+'</th>';}).join('')+'<th>نسبة الحضور</th>'+(print?'<th>أيام الغياب</th>':'')+'</tr></thead><tbody>'+
  st.map(function(r,i){return '<tr'+(r.pct!=null&&r.pct<80?' class="low"':'')+'><td>'+ar(i+1)+'</td><td class="nm">'+esc(r.s.name)+'</td>'+AST.map(function(t){return '<td>'+ar(r[t[0]])+'</td>';}).join('')+'<td><b>'+(r.pct==null?'—':ar(r.pct)+'٪')+'</b></td>'+(print?'<td class="nm">'+r.abs.map(function(d){return D.fdate(d);}).join('، ')+'</td>':'')+'</tr>';}).join('')+'</tbody></table>';}
A.attDay=function(b){S.ui.attDay=addDays(S.ui.attDay||D.ymd(),+b.dataset.d);persist();render();};
A.attAll=function(){var c=clsOf(S.ui.attCls)||S.classes[0],r=attDay(S.ui.attDay||D.ymd());S.students.filter(function(s){return s.cls===c.id;}).forEach(function(s){if(!r[s.id])r[s.id]='p';});persist();render();TB.toast('سُجّل الباقون حاضرين',{icon:'check'});};
A.attClear=function(){var c=clsOf(S.ui.attCls)||S.classes[0],r=attDay(S.ui.attDay||D.ymd());if(!confirm('مسح تسجيل هذا اليوم لهذا الصف؟'))return;S.students.filter(function(s){return s.cls===c.id;}).forEach(function(s){delete r[s.id];});persist();render();};
A.attPrint=function(b){var c=clsOf(S.ui.attCls)||S.classes[0],to=S.ui.attTo||D.ymd(),from=S.ui.attFrom||to.slice(0,8)+'01',list=S.students.filter(function(s){return s.cls===c.id;});
  out(b.dataset.m||'print','<div class="pp at"><div class="ttl">كشف حضور الطلاب وغيابهم</div><div class="tth"><span>'+esc(c.name)+'</span><span>'+esc(sv('teacher'))+' · '+esc(sv('school'))+'</span><span>من '+D.fdate(from)+' إلى '+D.fdate(to)+'</span></div>'+attTable(attStats(list,from,to),true)+'</div>','كشف الحضور - '+c.name);};

/* ---------- الواجبات ---------- */
function hwItems(L){var it=L.hw&&L.hw.length?L.hw:[].concat(L.acts||[],L.chal?[L.chal]:[],L.exit?[L.exit]:[],L.bank||[]);return D.expand(it,'hw'+L.id).slice(0,8);}
V.hw=function(el){var b=curBook();el.innerHTML=head('hw')+(S.settings.wa?'':'<div class="ds-row" style="border-color:var(--gold)"><span style="font-size:26px">📲</span><div class="grow"><b>أضيفي رقم واتساب لاستقبال نتائج الطلاب</b><small>عند انتهاء الطالب يرسل نتيجته إلى رقمك بنقرة، فتستلمينها من قسم النقاط</small></div><button class="btn soft sm" data-a="settings">إضافة</button></div>')+
  unitsHTML(b,function(L){var sent=S.sent['hw:'+L.id];return '<button class="ds-ls" data-hw="'+L.id+'" style="--sc:#F28C38"><span class="em">🏠</span><span><small>'+lessonMeta(L)+' · '+ar(hwItems(L).length)+' أسئلة</small><b>'+esc(L.t)+'</b><small>'+(sent?'أُرسل '+ar(sent.length)+' مرة · آخرها '+D.fdate(sent[sent.length-1]):'لم يُرسل بعد')+'</small></span></button>';});};
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-hw]');if(!b)return;var L=D.REG.lessons[b.dataset.hw],url=hwLink(L.id);
  TB.sheet('<div class="stack" data-ref="hw:'+L.id+'"><p class="lead" style="margin:0">'+esc(L.t)+'</p><p class="note">رابط دائم يفتحه الطالب على أي جهاز، يكتب اسمه ويحل '+ar(hwItems(L).length)+' أسئلة تفاعلية، ثم يرسل نتيجته إليك.</p>'+shareBox('واجب: '+L.t,url,'واجب '+D.SUBJ[L.subj].n+' – '+L.t+'\nأولياء الأمور الكرام، هذا واجب اليوم لأبنائنا، يحله الطالب ثم يضغط «أرسل النتيجة للمعلمة».')+'</div>',{title:'واجب الحصة',sub:lessonMeta(L),icon:'home'});});

/* ---------- الامتحانات ---------- */
function unitExams(b){return b.units.map(function(u){return {code:'u.'+u.id,t:'امتحان '+u.t,ls:u.lessons.map(function(l){return l.id;}),n:10};});}
function parseExam(code){var p=String(code).split('.');if(p[0]==='u'){var u=null;Object.keys(D.REG.books).forEach(function(k){D.REG.books[k].units.forEach(function(x){if(x.id===p[1])u=x;});});if(!u)return null;
    return {t:'امتحان '+u.t,ls:u.lessons,n:10,v:p[2]||'a',grade:u.lessons[0]&&u.lessons[0].grade,subj:u.lessons[0]&&u.lessons[0].subj};}
  if(p[0]==='c'){var ls=p[1].split(',').map(function(i){return D.REG.lessons[i];}).filter(Boolean);if(!ls.length)return null;return {t:null,ls:ls,n:+p[2]||10,v:p[3]||'a',grade:ls[0].grade,subj:ls[0].subj};}
  if(p[0]==='l'){var L=D.REG.lessons[p[1]];if(!L)return null;return {t:'اختبار قصير: '+L.t,ls:[L],n:+p[2]||5,v:p[3]||'a',grade:L.grade,subj:L.subj};}return null;}
function examItems(ex){var pool=[];ex.ls.forEach(function(L){pool=pool.concat(D.bank(L,'ex'+ex.v).filter(function(i){return i.k!=='gate'||i.items.length<=6;}));});
  var r=D.rng('exam'+ex.v+ex.ls.map(function(l){return l.id;}).join());var byL=ex.ls.map(function(L){return D.shuffle(D.bank(L,'ex'+ex.v),r);});var out=[],k=0;
  while(out.length<ex.n&&byL.some(function(a){return a.length;})){var a=byL[k%byL.length];if(a.length)out.push(a.shift());k++;}return D.shuffle(out,r);}
V.exams=function(el){var b=curBook(),V2=['a','b','c'],VN={a:'نموذج أ',b:'نموذج ب',c:'نموذج ج'};
  el.innerHTML=head('exams','<button class="btn gold" data-a="newExam">'+I.plus+'امتحان جديد</button>')+
   '<section class="stack"><h2 class="h">امتحانات الوحدات</h2>'+unitExams(b).map(function(x){return '<div class="ds-row"><span style="font-size:28px">📋</span><div class="grow"><b>'+esc(x.t)+'</b><small>'+ar(x.ls.length)+' حصص · '+ar(x.n)+' أسئلة · ثلاثة نماذج مختلفة</small></div><div class="row">'+V2.map(function(v){return '<button class="btn soft sm" data-exam="'+x.code+'.'+v+'" data-t="'+esc(x.t+' ('+VN[v]+')')+'">'+VN[v]+'</button>';}).join('')+'</div></div>';}).join('')+'</section>'+
   '<section class="stack"><h2 class="h">امتحاناتك</h2>'+(S.exams.filter(function(x){return x.book===b.id;}).map(function(x){return '<div class="ds-row"><span style="font-size:28px">🗓️</span><div class="grow"><b>'+esc(x.t)+'</b><small>'+ar(x.ls.length)+' حصص · '+ar(x.n)+' أسئلة · '+D.fdate(x.d)+'</small></div><div class="row">'+V2.map(function(v){return '<button class="btn soft sm" data-exam="c.'+x.ls.join(',')+'.'+x.n+'.'+v+'" data-t="'+esc(x.t+' ('+VN[v]+')')+'">'+VN[v]+'</button>';}).join('')+'<button class="round-btn" data-a="delExam" data-id="'+x.id+'" aria-label="حذف">'+X.trash+'</button></div></div>';}).join('')||'<div class="ds-empty">صمّمي امتحانًا شهريًا أو قصيرًا من الحصص التي تختارينها، وأرسليه بين فترة وأخرى</div>')+'</section>'+
   '<section class="stack"><h2 class="h">اختبارات قصيرة لكل حصة</h2>'+unitsHTML(b,function(L){return '<button class="ds-ls" data-exam="l.'+L.id+'.5.a" data-t="'+esc('اختبار قصير: '+L.t)+'" style="--sc:#E85D75"><span class="em">✏️</span><span><small>'+lessonMeta(L)+' · ٥ أسئلة</small><b>'+esc(L.t)+'</b></span></button>';})+'</section>';};
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-exam]');if(!b)return;var code=b.dataset.exam,t=b.dataset.t||'امتحان',url=exLink(code)+(code[0]==='c'?(waQ()?'&':'?')+'t='+encodeURIComponent(t):'');
  TB.sheet('<div class="stack" data-ref="ex:'+code+'"><p class="lead" style="margin:0">'+esc(t)+'</p><p class="note">لكل نموذج أسئلة مختلفة الترتيب والأرقام، فأرسلي نموذجًا مختلفًا كل مرة.</p>'+shareBox(t,url,t+'\nأولياء الأمور الكرام، يرجى أن يحل الطالب الامتحان ثم يضغط «أرسل النتيجة للمعلمة».')+'</div>',{title:'إرسال الامتحان',icon:'quiz'});});
A.newExam=function(){var b=curBook();TB.sheet('<form class="stack" id="dsEx"><label class="field"><span class="lbl">عنوان الامتحان</span><input class="input" name="t" value="امتحان شهر '+esc(new Intl.DateTimeFormat('ar',{month:'long'}).format(new Date()))+'" required></label>'+
  '<label class="field"><span class="lbl">عدد الأسئلة</span><select class="select" name="n">'+[5,8,10,12,15,20].map(function(n){return '<option value="'+n+'"'+(n===10?' selected':'')+'>'+ar(n)+'</option>';}).join('')+'</select></label><p class="lbl">الحصص المشمولة</p>'+
  b.units.map(function(u){return '<details class="set" open><summary>'+esc(u.t)+'</summary><div class="stack" style="padding:8px 0">'+u.lessons.map(function(L){return '<label class="row"><input type="checkbox" name="l" value="'+L.id+'"> '+esc(L.t)+'</label>';}).join('')+'</div></details>';}).join('')+
  '<button class="btn gold block" type="submit">'+I.check+'حفظ الامتحان</button></form>',{title:'امتحان جديد',sub:bookLabel(b),icon:'quiz'});
  $('#dsEx').onsubmit=function(e){e.preventDefault();var fd=new FormData(this),ls=fd.getAll('l');if(!ls.length){TB.toast('اختاري حصة واحدة على الأقل');return;}S.exams.push({id:D.uid('e'),book:b.id,t:String(fd.get('t')),n:+fd.get('n'),ls:ls,d:D.ymd()});persist();TB.closeSheet();render();};};
A.delExam=function(b){if(!confirm('حذف هذا الامتحان؟'))return;S.exams=S.exams.filter(function(x){return x.id!==b.dataset.id;});persist();render();};

/* ---------- الألعاب ---------- */
V.games=function(el){var b=curBook(),sel=S.ui.gameSrc&&S.ui.gameSrc[b.id]||'all';
  el.innerHTML=head('games')+'<div class="ds-row"><span style="font-size:24px">📚</span><div class="grow"><b>مصدر الأسئلة</b><small>اختاري وحدة أو حصة</small></div><select class="select" id="dsGS" style="max-width:56%"><option value="all">كل حصص '+esc(bookLabel(b))+'</option>'+b.units.map(function(u){return '<optgroup label="'+esc(u.t)+'"><option value="u:'+u.id+'">كل الوحدة</option>'+u.lessons.map(function(L){return '<option value="'+L.id+'">'+esc(L.t)+'</option>';}).join('')+'</optgroup>';}).join('')+'</select></div>'+
   '<div class="ds-grid">'+D.games.list.map(function(g){return '<button class="ds-sec" data-game="'+g.id+'" style="--sc:#C46BD8"><span class="ic">'+g.e+'</span><b>'+g.n+'</b><small>'+g.d+'</small></button>';}).join('')+'</div>';
  var s=$('#dsGS');s.value=sel;s.onchange=function(){S.ui.gameSrc=S.ui.gameSrc||{};S.ui.gameSrc[b.id]=s.value;persist();};};
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-game]');if(!b)return;var bk=curBook(),v=$('#dsGS')?$('#dsGS').value:'all',ls,t;
  if(v==='all'){ls=D.lessonsOf(bk.id);t=bookLabel(bk);}else if(v.indexOf('u:')===0){var u=bk.units.filter(function(x){return x.id===v.slice(2);})[0];ls=u.lessons;t=u.t;}else{ls=[D.REG.lessons[v]];t=ls[0].t;}
  D.games.run(b.dataset.game,ls,t);});

/* ---------- الطلاب ---------- */
var AV=['🦁','🐯','🐼','🦊','🐨','🐸','🐵','🦄','🐰','🐻','🐱','🐶','🦋','🐬','🦉','🐢','🐧','🐝'];
/* صور الطلاب: ولد بالكمة والدشداشة، وبنت باللحاف والثوب العماني (darsi/img) */
var FEM=('مريم هند زينب شيم رتيل حوراء أسيل اسيل سارة ساره ليلى ليلي نور سلمى رغد جود ريم لين روان ملاك غلا شهد وعد رزان لمى هيا منى هدى أمل امل ريماس جنى ميار تسنيم إسراء اسراء آلاء الاء بشرى ضحى سجى رهف يارا ريتاج لجين مرام أريام اريام ميثاء شماء شمه عهود بدور نوف أثير اثير وجد ألين الين تالين ماريا مايا حلا دانه دانة نهى وفاء ثريا رنا رناد لولوه لولوة جميلة عائشة عايشة خديجة فاطمة زهراء الزهراء').split(' ');
function guessG(n){var w=String(n||'').trim().split(/\s+/),f=(w[0]||'').replace(/^(ال)/,'');if(FEM.indexOf(w[0])>=0||FEM.indexOf(f)>=0)return 'g';
  if(/الله|^طه$/.test(w[0]))return 'b';if(/[ةه]$/.test(w[0]))return 'g';if(w.slice(1).some(function(x){return /(ية|يه)$/.test(x);}))return 'g';return 'b';}
function sexOf(s){return s.sx||guessG(s.name);}
function av(s){return '<img class="ds-av" src="'+BASE+'img/'+(sexOf(s)==='g'?'girl':'boy')+'.webp" alt="" loading="lazy" decoding="async">';}
V.students=function(el){el.innerHTML='<div class="between"><div><p class="eyebrow">👧 الطلاب</p><h1 class="h-xl" style="margin:0">الطلاب</h1><p class="sub" style="margin:4px 0 0">'+SEC.students.d+'</p></div><div class="row"><button class="btn soft" data-a="addClass">'+I.plus+'صف/شعبة</button></div></div>'+
  S.classes.map(function(c){var list=S.students.filter(function(s){return s.cls===c.id;});return '<section class="card glass stack"><div class="between"><h2 class="h" style="margin:0">'+esc(c.name)+' <span class="chip">'+ar(list.length)+'</span></h2><div class="row"><button class="btn gold sm" data-a="addStu" data-c="'+c.id+'">'+I.plus+'إضافة طلاب</button><button class="round-btn" data-a="editClass" data-c="'+c.id+'" aria-label="تعديل">'+X.edit+'</button></div></div>'+
   (list.length?'<div class="ds-class">'+list.map(function(s){var t=total(s.id);return '<button class="ds-st" data-stu="'+s.id+'"><span class="av">'+av(s)+'</span><b>'+esc(s.name)+'</b><span class="pts">⭐ '+ar(pts(s.id))+'</span>'+(t!=null?'<span class="ds-lvl '+level(t).c+'">'+level(t).n+'</span>':'')+'</button>';}).join('')+'</div>':'<div class="ds-empty">لا يوجد طلاب بعد. أضيفي الأسماء دفعة واحدة (اسم في كل سطر)</div>')+'</section>';}).join('');};
A.addClass=function(){TB.sheet('<form class="stack" id="dsC"><label class="field"><span class="lbl">الصف</span><select class="select" name="g">'+PF.grades.map(function(g){return '<option value="'+g+'">الصف '+GR[g]+'</option>';}).join('')+'</select></label><label class="field"><span class="lbl">اسم الشعبة/المجموعة</span><input class="input" name="n" placeholder="مثل: الثالث (١) أو مجموعة القراءة" required></label><button class="btn gold block">'+I.check+'إضافة</button></form>',{title:'صف أو مجموعة جديدة',icon:'users'});
  $('#dsC').onsubmit=function(e){e.preventDefault();var fd=new FormData(this);S.classes.push({id:D.uid('c'),g:+fd.get('g'),name:String(fd.get('n')).trim()});persist();TB.closeSheet();render();};};
A.editClass=function(b){var c=clsOf(b.dataset.c);TB.sheet('<form class="stack" id="dsC"><label class="field"><span class="lbl">الاسم</span><input class="input" name="n" value="'+esc(c.name)+'"></label><button class="btn gold block">'+I.check+'حفظ</button><button class="btn danger sm" type="button" id="dsDelC">'+X.trash+'حذف الصف وطلابه</button></form>',{title:'تعديل الصف',icon:'users'});
  $('#dsC').onsubmit=function(e){e.preventDefault();c.name=String(new FormData(this).get('n')).trim()||c.name;persist();TB.closeSheet();render();};
  $('#dsDelC').onclick=function(){if(!confirm('حذف الصف وكل طلابه ونقاطهم؟'))return;var ids=S.students.filter(function(s){return s.cls===c.id;}).map(function(s){return s.id;});S.students=S.students.filter(function(s){return s.cls!==c.id;});S.points=S.points.filter(function(p){return ids.indexOf(p.sid)<0;});S.results=S.results.filter(function(p){return ids.indexOf(p.sid)<0;});S.classes=S.classes.filter(function(x){return x!==c;});persist();TB.closeSheet();render();};};
A.addStu=function(b){var c=clsOf(b.dataset.c);TB.sheet('<form class="stack" id="dsS"><label class="field"><span class="lbl">الأسماء (اسم في كل سطر، ويمكن لصقها من ملف أو قائمة)</span><textarea class="textarea" name="n" rows="8" placeholder="أحمد سالم&#10;مريم خالد" required></textarea></label><button class="btn gold block">'+I.check+'إضافة</button></form>',{title:'إضافة طلاب',sub:c.name,icon:'user'});
  $('#dsS').onsubmit=function(e){e.preventDefault();var names=String(new FormData(this).get('n')).split(/\n|،|,/).map(function(x){return x.replace(/^\s*\d+[\s.\-)]*/,'').trim();}).filter(Boolean);
    names.forEach(function(n){S.students.push({id:D.uid('s'),name:n,cls:c.id});});persist();TB.closeSheet();render();TB.toast('أُضيف '+ar(names.length)+' طالبًا',{gold:true,icon:'users'});};};
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-stu]');if(!b||route().v!=='students')return;profile(stu(b.dataset.stu));});
function profile(s){if(!s)return;var c=clsOf(s.cls),t=total(s.id),lv=level(t),res=S.results.filter(function(r){return r.sid===s.id;}).slice(-8).reverse();
  var byR={};S.points.filter(function(p){return p.sid===s.id;}).forEach(function(p){byR[p.r]=(byR[p.r]||0)+p.v;});
  TB.sheet('<div class="stack"><div class="row"><span class="av big">'+av(s)+'</span><div><b style="font-size:1.2rem">'+esc(s.name)+'</b><p class="sub" style="margin:0">'+esc(c?c.name:'')+'</p></div></div>'+
   '<div class="ds-kpi"><div><b>'+ar(pts(s.id))+'</b><small>نقطة</small></div><div><b>'+(t==null?'—':ar(Math.round(t)))+'</b><small>التقييم من ١٠٠</small></div><div><b class="ds-lvl '+lv.c+'">'+lv.n+'</b><small>المستوى</small></div></div>'+
   (Object.keys(byR).length?'<div class="ds-reasons">'+Object.keys(byR).map(function(k){return '<span class="chip">'+esc(k)+': '+ar(byR[k])+'</span>';}).join('')+'</div>':'')+
   '<h3 class="h">آخر النتائج</h3>'+(res.length?res.map(function(r){var L=D.REG.lessons[r.ref];return '<div class="ds-row"><span>'+(r.k==='hw'?'🏠':'📋')+'</span><div class="grow"><b>'+esc(r.title||(L?L.t:r.ref))+'</b><small>'+D.fdate(D.ymd(new Date(r.t)))+'</small></div><b>'+ar(r.score)+'/'+ar(r.max)+'</b></div>';}).join(''):'<p class="note">لا توجد نتائج بعد</p>')+
   '<div class="seg" role="tablist" aria-label="الصورة" id="dsSx"><button data-sx="b" aria-pressed="'+(sexOf(s)==='b')+'">👦 ولد</button><button data-sx="g" aria-pressed="'+(sexOf(s)==='g')+'">👧 بنت</button></div>'+
   '<form class="row" id="dsRen"><input class="input" name="n" value="'+esc(s.name)+'" style="flex:1"><button class="btn soft sm">'+X.edit+'تعديل الاسم</button></form>'+
   '<div class="row"><select class="select" id="dsMv">'+S.classes.map(function(x){return '<option value="'+x.id+'"'+(x.id===s.cls?' selected':'')+'>'+esc(x.name)+'</option>';}).join('')+'</select><button class="btn danger sm" id="dsDelS">'+X.trash+'حذف الطالب</button></div></div>',{title:'ملف الطالب',icon:'user'});
  $('#dsRen').onsubmit=function(e){e.preventDefault();s.name=String(new FormData(this).get('n')).trim()||s.name;persist();TB.closeSheet();render();};
  $$('#dsSx [data-sx]').forEach(function(b){b.onclick=function(){s.sx=b.dataset.sx;persist();TB.closeSheet();render();profile(s);};});
  $('#dsMv').onchange=function(){s.cls=this.value;persist();render();};
  $('#dsDelS').onclick=function(){if(!confirm('حذف '+s.name+' ونقاطه؟'))return;S.students=S.students.filter(function(x){return x!==s;});S.points=S.points.filter(function(p){return p.sid!==s.id;});S.results=S.results.filter(function(p){return p.sid!==s.id;});persist();TB.closeSheet();render();};}

/* ---------- التقييم ---------- */
V.eval=function(el){var cid=S.ui.evalCls||(S.classes[0]&&S.classes[0].id),c=clsOf(cid)||S.classes[0];var list=c?S.students.filter(function(s){return s.cls===c.id;}):[];var sw=S.criteria.reduce(function(a,x){return a+(+x.w||0);},0);
  var tab=S.ui.evalTab||'grades';
  el.innerHTML=head('eval','<button class="btn soft" data-a="crit">'+X.edit+'بنود التقييم وأوزانها</button>')+
   '<div class="ds-row"><b>الصف</b><select class="select" id="dsEC" style="flex:1">'+S.classes.map(function(x){return '<option value="'+x.id+'"'+(c&&x.id===c.id?' selected':'')+'>'+esc(x.name)+'</option>';}).join('')+'</select></div>'+
   '<div class="seg" role="tablist"><button data-etab="grades" aria-pressed="'+(tab==='grades')+'">الدرجات</button><button data-etab="objs" aria-pressed="'+(tab==='objs')+'">متابعة الأهداف (أنجز/لم ينجز)</button></div>'+
   (tab==='grades'?'<div class="ds-reasons">'+S.criteria.map(function(k){return '<span class="chip">'+esc(k.n)+' · '+ar(k.w)+'%'+(k.src!=='manual'?' · تلقائي':'')+'</span>';}).join('')+(sw!==100?'<span class="chip warn">مجموع الأوزان '+ar(sw)+'%</span>':'')+'</div>'+
    (list.length?'<div class="tbl-wrap card glass" style="padding:0;overflow:auto"><table class="ds-tbl"><thead><tr><th>الطالب</th>'+S.criteria.map(function(k){return '<th>'+esc(k.n)+'<br><small>'+ar(k.w)+'%</small></th>';}).join('')+'<th>المجموع</th><th>المستوى</th></tr></thead><tbody>'+
     list.map(function(s){var t=total(s.id),lv=level(t);return '<tr><td>'+esc(s.name)+'</td>'+S.criteria.map(function(k){var p=critPct(s.id,k);if(k.src==='manual'){var m=(S.manual[s.id]||{})[k.id];return '<td><input type="number" min="0" max="100" inputmode="numeric" data-man="'+s.id+'|'+k.id+'" value="'+(m==null?'':m)+'" placeholder="—"></td>';}return '<td>'+(p==null?'—':ar(Math.round(p)))+'</td>';}).join('')+'<td class="tot">'+(t==null?'—':ar(Math.round(t)))+'</td><td><span class="ds-lvl '+lv.c+'">'+lv.n+'</span></td></tr>';}).join('')+'</tbody></table></div><p class="note">البنود التلقائية تُحسب من: النقاط (المشاركة والألعاب)، ومتوسط نتائج الواجبات والامتحانات المستلمة. أدخلي البنود اليدوية من ١٠٠.</p><button class="btn soft" data-a="printEval">'+X.print+'طباعة كشف الدرجات</button>':'<div class="ds-empty">أضيفي طلاب هذا الصف من قسم الطلاب</div>')
   :objsHTML(c,list));
  $('#dsEC').onchange=function(){S.ui.evalCls=this.value;persist();render();};
  $$('[data-etab]',el).forEach(function(b){b.onclick=function(){S.ui.evalTab=b.dataset.etab;persist();render();};});
  $$('[data-man]',el).forEach(function(i){i.onchange=function(){var a=i.dataset.man.split('|');S.manual[a[0]]=S.manual[a[0]]||{};var v=i.value===''?null:Math.max(0,Math.min(100,+i.value));S.manual[a[0]][a[1]]=v;persist();render();};});
  $$('[data-obj]',el).forEach(function(b){b.onclick=function(){var a=b.dataset.obj.split('|'),v=+a[2];S.objs[a[0]]=S.objs[a[0]]||{};S.objs[a[0]][a[1]]=S.objs[a[0]][a[1]]===v?null:v;persist();render();};});};
function objsHTML(c,list){if(!c)return '';var bk=books().filter(function(b){return !b.grade||b.grade===c.g;});if(!list.length)return '<div class="ds-empty">أضيفي طلاب هذا الصف من قسم الطلاب</div>';
  return bk.map(function(b){return '<section class="card glass stack"><h2 class="h">'+esc(bookLabel(b))+'</h2>'+b.units.map(function(u){return '<details class="set"><summary><b>'+esc(u.t)+'</b>'+(u.goal?'<br><small class="note">'+esc(u.goal)+'</small>':'')+'</summary><div class="tbl-wrap" style="overflow:auto"><table class="ds-tbl"><thead><tr><th>الطالب</th>'+u.lessons.map(function(L){return '<th title="'+esc((L.goals||[]).join(' • '))+'">'+esc(L.t)+'</th>';}).join('')+'</tr></thead><tbody>'+
    list.map(function(s){return '<tr><td>'+esc(s.name)+'</td>'+u.lessons.map(function(L){var v=(S.objs[s.id]||{})[L.id];return '<td><div class="ds-obj"><button class="y" data-obj="'+s.id+'|'+L.id+'|1" aria-pressed="'+(v===1)+'" aria-label="أنجز">✓</button><button class="n" data-obj="'+s.id+'|'+L.id+'|0" aria-pressed="'+(v===0)+'" aria-label="لم ينجز">✗</button></div></td>';}).join('')+'</tr>';}).join('')+'</tbody></table></div></details>';}).join('')+'</section>';}).join('');}
A.crit=function(){function row(k){return '<div class="ds-row" data-k="'+k.id+'"><input class="input" data-cn value="'+esc(k.n)+'" style="flex:1;min-width:120px"><input class="input" data-cw type="number" min="0" max="100" value="'+k.w+'" style="width:70px" aria-label="الوزن"><select class="select" data-cs style="width:auto">'+[['manual','يدوي'],['part','نقاط المشاركة'],['game','نقاط الألعاب'],['hw','نتائج الواجبات'],['ex','نتائج الامتحانات']].map(function(o){return '<option value="'+o[0]+'"'+(k.src===o[0]?' selected':'')+'>'+o[1]+'</option>';}).join('')+'</select><button class="round-btn" data-cdel aria-label="حذف">'+X.trash+'</button></div>';}
  TB.sheet('<div class="stack" id="dsCr">'+S.criteria.map(row).join('')+'</div><div class="stack" style="margin-top:10px"><button class="btn soft" id="dsCrAdd">'+I.plus+'إضافة بند</button><p class="note" id="dsCrSum"></p><button class="btn gold block" id="dsCrOk">'+I.check+'حفظ البنود</button></div>',{title:'بنود التقييم وأوزانها',sub:'مجموع الأوزان يُفضَّل أن يكون ١٠٠',icon:'chart'});
  function sum(){var t=$$('[data-cw]').reduce(function(a,i){return a+(+i.value||0);},0);$('#dsCrSum').textContent='مجموع الأوزان: '+ar(t)+'%'+(t!==100?' (يُعاد التوزيع نسبيًا)':' ✓');}
  sum();$('#dsCr').addEventListener('input',sum);$('#dsCr').addEventListener('click',function(e){if(e.target.closest('[data-cdel]')){e.target.closest('.ds-row').remove();sum();}});
  $('#dsCrAdd').onclick=function(){var d=h('div','');d.innerHTML=row({id:D.uid('k'),n:'بند جديد',w:10,src:'manual'});$('#dsCr').appendChild(d.firstChild);sum();};
  $('#dsCrOk').onclick=function(){S.criteria=$$('#dsCr .ds-row').map(function(r){var old=S.criteria.filter(function(k){return k.id===r.dataset.k;})[0]||{};return Object.assign({},old,{id:r.dataset.k,n:$('[data-cn]',r).value.trim()||'بند',w:+$('[data-cw]',r).value||0,src:$('[data-cs]',r).value});});persist();TB.closeSheet();render();};};
A.printEval=function(){var c=clsOf(S.ui.evalCls)||S.classes[0],list=S.students.filter(function(s){return s.cls===c.id;});
  doPrint('<div class="pp"><h2>كشف التقييم · '+esc(c.name)+'</h2><p>المعلمة: '+esc(S.settings.teacher)+' · '+esc(S.settings.school)+' · '+D.fdate(D.ymd())+'</p><table><thead><tr><th>م</th><th>الطالب</th>'+S.criteria.map(function(k){return '<th>'+esc(k.n)+' ('+k.w+'%)</th>';}).join('')+'<th>المجموع</th><th>المستوى</th></tr></thead><tbody>'+
   list.map(function(s,i){var t=total(s.id);return '<tr><td>'+(i+1)+'</td><td>'+esc(s.name)+'</td>'+S.criteria.map(function(k){var p=critPct(s.id,k);return '<td>'+(p==null?'—':Math.round(p))+'</td>';}).join('')+'<td>'+(t==null?'—':Math.round(t))+'</td><td>'+level(t).n+'</td></tr>';}).join('')+'</tbody></table></div>');};

/* ---------- النقاط ---------- */
var REASONS=['مشاركة','واجب','امتحان','لعبة','سلوك','قراءة','تعاون'];
V.points=function(el){var cid=S.ui.ptCls||(S.classes[0]&&S.classes[0].id),c=clsOf(cid)||S.classes[0],rs=S.ui.reason||'مشاركة',step=S.ui.step||1;var list=c?S.students.filter(function(s){return s.cls===c.id;}):[];
  var ranked=list.map(function(s){return {s:s,p:pts(s.id)};}).sort(function(a,b){return b.p-a.p;});
  el.innerHTML=head('points','<button class="btn gold" data-a="inbox">'+X.inbox+'استلام نتائج الطلاب</button>')+
   '<div class="ds-row"><b>الصف</b><select class="select" id="dsPC" style="flex:1">'+S.classes.map(function(x){return '<option value="'+x.id+'"'+(c&&x.id===c.id?' selected':'')+'>'+esc(x.name)+'</option>';}).join('')+'</select></div>'+
   '<div class="stack"><div class="ds-reasons">'+REASONS.map(function(r){return '<button class="cb" data-rs="'+r+'" aria-pressed="'+(r===rs)+'">'+r+'</button>';}).join('')+'</div><div class="seg">'+[1,2,5,-1].map(function(v){return '<button data-step="'+v+'" aria-pressed="'+(v===step)+'">'+(v>0?'+':'−')+ar(Math.abs(v))+'</button>';}).join('')+'</div><p class="note" style="margin:0">انقري اسم الطالب لإضافة '+(step>0?'+':'−')+ar(Math.abs(step))+' نقطة («'+esc(rs)+'»).</p></div>'+
   (list.length?'<div class="ds-class">'+ranked.map(function(x,i){return '<button class="ds-st" data-pt="'+x.s.id+'"><span class="rk">'+(x.p>0&&i<3?['🥇','🥈','🥉'][i]:'')+'</span><span class="av">'+av(x.s)+'</span><b>'+esc(x.s.name)+'</b><span class="pts">'+ar(x.p)+'</span></button>';}).join('')+'</div>':'<div class="ds-empty">أضيفي طلاب هذا الصف من قسم الطلاب</div>')+
   recentHTML(list);
  $('#dsPC').onchange=function(){S.ui.ptCls=this.value;persist();render();};
  $$('[data-rs]',el).forEach(function(b){b.onclick=function(){S.ui.reason=b.dataset.rs;persist();render();};});
  $$('[data-step]',el).forEach(function(b){b.onclick=function(){S.ui.step=+b.dataset.step;persist();render();};});
  $$('[data-pt]',el).forEach(function(b){b.onclick=function(){addPoint(b.dataset.pt,step,rs);SND.play(step>0?'good':'bad');var p=h('span','plus'+(step<0?' neg':''),(step>0?'+':'−')+ar(Math.abs(step)));b.appendChild(p);b.classList.add('pulse');if(step>0)D.boom(b);
    $('.pts',b).textContent=ar(pts(b.dataset.pt));setTimeout(function(){p.remove();b.classList.remove('pulse');},900);clearTimeout(V._pt);V._pt=setTimeout(render,1600);};});
  $$('[data-undo]',el).forEach(function(b){b.onclick=function(){S.points=S.points.filter(function(p){return p.id!==b.dataset.undo;});persist();render();};});};
function recentHTML(list){var ids=list.map(function(s){return s.id;});var r=S.points.filter(function(p){return ids.indexOf(p.sid)>=0;}).slice(-6).reverse();if(!r.length)return '';
  return '<section class="stack"><h2 class="h">آخر النقاط</h2>'+r.map(function(p){var s=stu(p.sid);return '<div class="ds-row"><b class="grow">'+esc(s?s.name:'')+' <small>· '+esc(p.r)+'</small></b><b>'+(p.v>0?'+':'−')+ar(Math.abs(p.v))+'</b><button class="btn ghost sm" data-undo="'+p.id+'">تراجع</button></div>';}).join('')+'</section>';}
/* استلام النتائج من رسائل واتساب */
var CODE=/R1\|(hw|ex)\|([^|\n]+)\|(\d+)\|(\d+)\|([^|\n]+?)(?:\|([^\n]*))?(?:\n|$)/g;
A.inbox=function(){TB.sheet('<div class="stack"><p class="note">الصقي هنا رسائل النتائج التي وصلتك من أولياء الأمور (يمكن لصق عدة رسائل معًا). يتعرف النظام على اسم الطالب ويضيف النتيجة ونقاطها.</p><textarea class="textarea" id="dsIn" rows="7" placeholder="ألصقي الرسائل هنا"></textarea><button class="btn gold block" id="dsInGo">'+I.check+'قراءة النتائج</button><div id="dsInR" class="stack"></div></div>',{title:'استلام نتائج الطلاب',icon:'download'});
  $('#dsInGo').onclick=function(){var t=$('#dsIn').value+'\n',m,found=[];CODE.lastIndex=0;while((m=CODE.exec(t)))found.push({k:m[1],ref:m[2],score:+m[3],max:+m[4],name:m[5].trim(),title:(m[6]||'').trim()});
    var box=$('#dsInR');if(!found.length){box.innerHTML='<p class="note">لم أجد رموز نتائج في النص. تأكدي من لصق رسالة النتيجة كاملة.</p>';return;}
    box.innerHTML=found.map(function(f,i){var n=D.norm(f.name),cand=S.students.filter(function(s){var x=D.norm(s.name);return x===n||x.indexOf(n)===0||n.indexOf(x)===0;});var dup=S.results.some(function(r){return r.k===f.k&&r.ref===f.ref&&D.norm((stu(r.sid)||{}).name)===n;});
      return '<div class="ds-row" data-i="'+i+'"><div class="grow"><b>'+esc(f.name)+'</b><small>'+(f.k==='hw'?'واجب':'امتحان')+' · '+esc(f.title||(D.REG.lessons[f.ref]||{}).t||f.ref)+' · '+ar(f.score)+'/'+ar(f.max)+(dup?' · ⚠ استُلمت سابقًا':'')+'</small></div><select class="select" style="max-width:45%"><option value="">— اختاري الطالب —</option>'+S.students.map(function(s){return '<option value="'+s.id+'"'+(cand.length===1&&cand[0]===s?' selected':'')+'>'+esc(s.name)+' ('+esc((clsOf(s.cls)||{}).name||'')+')</option>';}).join('')+'</select></div>';}).join('')+'<button class="btn gold block" id="dsInSave">'+I.check+'حفظ النتائج وإضافة النقاط</button>';
    $('#dsInSave').onclick=function(){var n=0;$$('#dsInR .ds-row').forEach(function(r){var f=found[+r.dataset.i],sid=$('select',r).value;if(!sid)return;S.results.push({id:D.uid('r'),sid:sid,k:f.k,ref:f.ref,score:f.score,max:f.max,title:f.title,t:Date.now()});
      var p=Math.round(f.score/f.max*(f.k==='hw'?5:10));if(p>0)S.points.push({id:D.uid('p'),sid:sid,v:p,r:f.k==='hw'?'واجب':'امتحان',ref:f.ref,t:Date.now()});n++;});persist();TB.closeSheet();render();TB.toast('حُفظت '+ar(n)+' نتيجة',{gold:true,icon:'award'});};};};

/* =====================================================================
   صفحات الطالب: الواجب والامتحان
   ===================================================================== */
function student(r){document.body.classList.add('ds-student');var app=$('#app'),items,title,L=null,kind=r.k,ref=r.id,grade,subj,sc;
  if(kind==='hw'){L=D.REG.lessons[ref];if(!L){app.innerHTML='<div class="ds-stu"><div class="ds-empty">الرابط غير صحيح</div></div>';return;}items=hwItems(L);title='واجب: '+L.t;grade=L.grade;subj=L.subj;sc=D.scene(L.sc);}
  else{var ex=parseExam(ref);if(!ex){app.innerHTML='<div class="ds-stu"><div class="ds-empty">الرابط غير صحيح</div></div>';return;}items=examItems(ex);title=r.q.t||ex.t||'امتحان';grade=ex.grade;subj=ex.subj;sc=D.scene(ex.ls[0].sc);}
  var tName=PF.teacher,wa=(r.q.w||'').replace(/\D/g,'');var nameKey='darsi:stuname';
  app.innerHTML='<div class="ds-stu"><div class="head"><span class="ds-logo">'+sc.e+'</span><p class="eyebrow">'+esc(D.SUBJ[subj].n)+(grade?' · الصف '+GR[grade]:'')+' · '+esc(tName)+'</p><h1>'+esc(title)+'</h1></div><div id="stuBody"></div></div>';
  var body=$('#stuBody');
  function start(){body.innerHTML='<section class="ds-qcard stack" style="text-align:center;justify-items:center"><div style="font-size:70px">👋</div><h2 class="h">مرحبًا يا بطل!</h2><p class="lead">اكتب اسمك الثلاثي ثم ابدأ. عدد الأسئلة: '+ar(items.length)+'</p><input class="input" id="stuN" placeholder="اسم الطالب" value="'+esc(D.lsGet(nameKey,''))+'" style="max-width:360px;text-align:center;font-size:1.2rem"><button class="btn gold lg" id="stuGo">'+I.play+'ابدأ</button></section>';
    $('#stuGo').onclick=function(){var n=$('#stuN').value.trim();if(n.split(/\s+/).length<2){TB.toast('اكتب اسمك واسم أبيك على الأقل');$('#stuN').focus();return;}D.lsSet(nameKey,n);run(n);};}
  function run(name){var k=0,scores=[];
    function show(){if(k>=items.length)return done(name,scores);var it=items[k];
      body.innerHTML='<div class="ds-qnav"><span class="chip">السؤال '+ar(k+1)+' من '+ar(items.length)+'</span><div class="ds-qdots">'+items.map(function(_,i){return '<i class="'+(i<k?(scores[i]>=.99?'ok':'no'):i===k?'on':'')+'"></i>';}).join('')+'</div></div><section class="ds-qcard"><div class="d-player-lite"></div></section><div class="row" style="justify-content:center"><button class="btn gold lg" id="stuNext" hidden>'+(k===items.length-1?'إنهاء':'التالي')+I.back+'</button></div>';
      var box=$('.d-player-lite',body);D.render(it,box,{mode:'test',done:function(s){scores[k]=s;var nb=$('#stuNext');nb.hidden=false;nb.onclick=function(){k++;show();};nb.focus();}});}
    show();}
  function done(name,scores){var sum=scores.reduce(function(a,b){return a+b;},0),max=items.length,sc10=Math.round(sum*10)/10,pct=sum/max,stars=pct>=.9?3:pct>=.6?2:pct>0?1:0;
    var code='R1|'+kind+'|'+ref+'|'+Math.round(sum)+'|'+max+'|'+name+(kind==='ex'?'|'+title:'');
    var msg='السلام عليكم أ. '+tName.replace(/^أ\.\s*/,'')+'\n'+(kind==='hw'?'أنهى ':'أنهى ')+name+' '+title+'\nالنتيجة: '+Math.round(sum)+' من '+max+'\n'+code;
    body.innerHTML='<section class="ds-qcard ds-result"><div class="stars">'+'⭐'.repeat(stars)+'☆'.repeat(3-stars)+'</div><h2 class="h">'+(pct>=.9?'ممتاز يا '+esc(name.split(' ')[0])+'!':pct>=.6?'أحسنت يا '+esc(name.split(' ')[0])+'!':'محاولة جيدة، واصل التدريب!')+'</h2><div class="score">'+ar(Math.round(sum))+' / '+ar(max)+'</div>'+
     '<button class="btn lg ds-wa" id="stuSend">'+X.wa+'أرسل النتيجة للمعلمة</button><button class="btn soft" id="stuAgain">'+I.reset+'حاول مرة أخرى</button><p class="note">النتيجة تُرسل برسالة واتساب إلى المعلمة.</p></section>';
    TB.celebrate();SND.play('win');
    $('#stuSend').onclick=function(){waShare(msg,wa);};$('#stuAgain').onclick=function(){run(name);};}
  start();}

/* ---------- العرض ---------- */
function render(){var r=route();if(r.stu)return;var v=V[r.v]?r.v:'home',el=$('#view');if(!el){shell();el=$('#view');}
  $$('.ds-nav button').forEach(function(b){b.setAttribute('aria-current',b.dataset.go===v?'page':'false');});
  el.classList.remove('view','enter');V[v](el,r);void el.offsetWidth;el.classList.add('view','enter');if(!r.keep)window.scrollTo(0,0);
  $$('[data-type]',el).forEach(function(t){if(TB.type)TB.type(t);});}
window.addEventListener('hashchange',function(){var r=route();if(r.stu)return location.reload();TB.closeSheet();render();});

/* ---------- البدء ---------- */
document.title=PF.title?('منصة '+PF.teacher+' · '+PF.title):document.title;
var r0=route();
if(r0.stu){S=fresh();student(r0);}
else D.DB.get(KEY).then(function(d){S=d&&d.app==='darsi'?Object.assign(fresh(),d):fresh();S.ui=S.ui||{};D.autoRead=!!S.settings.autoRead;shell();render();});
if('serviceWorker' in navigator&&location.protocol==='https:')navigator.serviceWorker.register('sw.js').catch(function(){});
})();
