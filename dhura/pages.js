/* =====================================================================
   «ذُرى» · أقسام منصة المعلمة الأولى
   الرئيسية، فريقي، الزيارات الصفية، متابعة التحضير، لقاءات القسم، النتائج،
   الخطط العلاجية، التنمية المهنية، بنود التقييم، الإنجازات، التقارير، الإعدادات.
   ===================================================================== */
(function(){
'use strict';
var DA=window.DA,I=window.PD,A=window.APP,$=DA.$,$$=DA.$$,esc=DA.esc,ic=A.ic,P=A.PAGES,on=A.on;

/* حقل نصي متعدد الأسطر يُحفظ قائمة */
(function(){var f0=A.form;A.form=function(o){o.fields.forEach(function(f){if(f.type==='lines'){f.type='textarea';f._lines=1;}});var on0=o.onSave;o.onSave=function(v){o.fields.forEach(function(f){if(f._lines&&typeof v[f.k]==='string')v[f.k]=v[f.k].split('\n').map(function(x){return x.trim();}).filter(Boolean);});return on0(v);};return f0(o);};})();

function team(){return DA.list('tch').sort(function(a,b){return (a.ord||0)-(b.ord||0)||(a.c||0)-(b.c||0);});}
function T(id){return DA.rec(id)||{name:'—',short:'—',cls:[],color:'#888'};}
function tOpts(){return team().map(function(t){return [t.id,t.short];});}
function visits(f){return DA.list('vis',f).sort(function(a,b){return a.d<b.d?1:-1;});}
function lastVis(tid){return visits(function(v){return v.t===tid&&v.kind==='sup'&&v.st==='done';})[0];}
function visAvg(v){if(!v||!v.cr)return null;var k=Object.keys(v.cr);return k.reduce(function(a,x){return a+v.cr[x];},0)/k.length;}
function rateChip(r){if(!r)return '<span class="chip">لم تُزر</span>';var c=['','good','info','warn','bad'][r];return '<span class="chip '+c+'">'+I.RATE[r]+'</span>';}
function weeks(){return DA.list('fol').sort(function(a,b){return a.w<b.w?-1:1;});}
function folPct(tid){var W=weeks(),n=0,d=0;W.forEach(function(w){var m=w.m[tid];if(!m)return;['plan','book','corr'].forEach(function(k){n++;if(m[k])d++;});});return A.pct(d,n);}
function curTest(){var c=DA.rec('tests');return resT||(c?c.tests[0][0]:'mid');}
function mastery(d){var n=d.reduce(function(a,b){return a+b;},0);return n?(d[0]+d[1])/n*100:0;}
function nextDay(){var d=new Date();if(I.isSchool(d))return DA.today();while(!I.isSchool(d))d=I.addD(d,1);return I.iso(d);}
function tav(t,cls){return A.av({id:t.id,name:t.name,color:t.color},cls);}
I.searchItems=function(){var o=[];team().forEach(function(t){o.push({t:t.short,s:'معلمة · '+t.cls.join('، '),h:'#/team/'+t.id,i:'user',c:t.color,g:'الفريق'});});
  DA.list('meet').forEach(function(m){o.push({t:m.title,s:'لقاء · '+A.short(m.d),h:'#/meet',i:'chat',c:'var(--k4)',g:'اللقاءات'});});return o;};

/* =================== الرئيسية =================== */
P.home=function(){var me=A.me(),td=A.tod(),ps=A.periodState(),nd=nextDay(),isT=nd===DA.today(),di=I.dayIdx(nd),g=(DA.rec('tt')||{}).grid||[],row=g[di]||[],TM=team();
  var planV=visits(function(v){return v.st==='plan';}),upV=planV.filter(function(v){return v.d>=DA.today();}).sort(function(a,b){return a.d<b.d?-1:1;});
  var first=String(me.short).replace(/^أ\.\s*/,'').split(' ')[0];
  var h='<div class="bento pn">';
  h+='<section class="card living pano" data-tod="'+td.k+'"><div class="pic" style="--fy:.42">'+A.scene('peaks')+'<span class="eyebrow">'+A.mark('x')+esc(me.school)+' · '+esc(me.title)+'</span></div>'+
   '<div class="cap"><h1>'+DA.greet()+'، <br><em>أ. '+esc(first)+'</em></h1><p class="sub">فريقكِ '+TM.length+' معلمات، ولديكِ '+upV.length+' زيارات مجدولة'+(upV[0]?'، أقربها '+esc(A.rel(upV[0].d))+' لـ'+esc(T(upV[0].t).short):'')+'.</p></div>'+
   '<div class="hbar"><div class="when"><span>'+ic('cal')+esc(A.fmt(DA.today()))+'</span><span>'+ic('moon')+esc(A.hijri())+'</span><span>'+ic('clock')+'<b data-clock></b> · '+esc(A.periodNow())+'</span></div>'+
   '<div class="hact"><button class="btn gold" data-nv>'+ic('eye')+' زيارة صفية جديدة</button><a class="btn ghost" href="#/follow">'+ic('tasks')+' متابعة التحضير</a><a class="btn ghost" href="#/tests">'+ic('chart')+' تحليل النتائج</a></div></div></section>';
  /* نبض الفريق */
  h+='<div class="card s4 r2"><div class="ctitle"><span class="ic2">'+ic('users')+'</span><h3>نبض الفريق</h3><span class="sp"></span><a class="btn ghost sm" href="#/team">الكل</a></div><div class="lead">'+
   TM.map(function(t){var v=lastVis(t.id),f=folPct(t.id);return '<a class="lr" href="#/team/'+t.id+'" style="text-decoration:none;color:inherit">'+tav(t,'sm')+'<b>'+esc(t.short)+'</b><span title="الالتزام بالتحضير" style="width:54px">'+A.bar(f,f>=85?'var(--good)':f>=70?'var(--warn)':'var(--bad)')+'</span>'+(v?'<span class="chip '+['','good','info','warn','bad'][v.rate]+'" style="font-size:10.5px">'+I.RATE[v.rate]+'</span>':'<span class="chip" style="font-size:10.5px">لم تُزر</span>')+'</a>';}).join('')+'</div></div>';
  /* المؤشرات */
  var sup=visits(function(v){return v.kind==='sup'&&v.st==='done';}),cov={};sup.forEach(function(v){cov[v.t]=1;});
  var W=weeks(),lw=W[W.length-1],fp=TM.map(function(t){return folPct(t.id);}),fAvg=fp.reduce(function(a,b){return a+b;},0)/(fp.length||1);
  var fTr=W.map(function(w){var n=0,d=0;Object.keys(w.m).forEach(function(k){['plan','book','corr'].forEach(function(x){n++;if(w.m[k][x])d++;});});return A.pct(d,n);});
  var RS=DA.list('res',function(r){return r.test===curTest();}),dist=[0,0,0,0,0];RS.forEach(function(r){r.dist.forEach(function(v,i){dist[i]+=v;});});
  var RP=DA.list('res',function(r){return r.test==='diag';}),dp=[0,0,0,0,0];RP.forEach(function(r){r.dist.forEach(function(v,i){dp[i]+=v;});});
  h+=A.kc('users','--k1',TM.length,'','معلمات القسم',DA.list('res',function(r){return r.test===curTest();}).length+' شعبة · '+RS.reduce(function(a,r){return a+r.n;},0)+' طالبًا')+
   A.kc('eye','--k2',A.pct(Object.keys(cov).length,TM.length)+'٪','','تغطية الزيارات',sup.length+' زيارة منفذة')+
   A.kc('tasks','--k5',fAvg.toFixed(0)+'٪','','الالتزام بالتحضير','آخر '+W.length+' أسابيع',fTr)+
   A.kc('chart','--k8',mastery(dist).toFixed(0)+'٪','','إتقان القسم','<b>'+(mastery(dist)-mastery(dp)>=0?'▲ ':'▼ ')+Math.abs(mastery(dist)-mastery(dp)).toFixed(1)+'</b> عن التشخيصي',[mastery(dp),mastery(dist)]);
  /* يومي */
  h+='<div class="card s12"><div class="ctitle"><span class="ic2">'+ic('grid')+'</span><h3>'+(isT?'يومي':'يوم '+esc(A.dayName(nd))+' القادم')+'</h3><span class="sp"></span><span class="chip">نصاب مخفّف للمعلمة الأولى</span></div><div class="dayline">'+
   I.PERIODS.map(function(p,i){var s=row[i],cur=isT&&ps.state==='in'&&ps.i===i,done=isT&&(ps.state==='after'||((ps.state==='in'||ps.state==='gap')&&i<ps.i)),col=s?(s.k==='meet'?'var(--k4)':s.k==='vis'?'var(--k2)':'var(--k1)'):'';
     return (i===3?'<div class="brk">الفسحة</div>':'')+'<div class="pd'+(s?'':' free')+(cur?' cur':'')+(done?' done':'')+'" style="'+(s?'--c:'+col:'')+'"><span class="n">'+(i+1)+'</span><b>'+(s?(s.k==='meet'?'لقاء القسم':s.k==='vis'?'حصة زيارة':'رياضيات '+esc(s.cls)):'إشراف ومتابعة')+'</b><small>'+p[0]+' – '+p[1]+'</small></div>';}).join('')+'</div></div>';
  /* المهام والزيارات القادمة والقرارات */
  var TK=DA.list('task').sort(function(a,b){return (a.done?1:0)-(b.done?1:0)||(a.c||0)-(b.c||0);});
  h+='<div class="card s4"><div class="ctitle"><span class="ic2">'+ic('tasks')+'</span><h3>مهامي</h3><span class="sp"></span><button class="ib" data-tadd aria-label="إضافة مهمة">'+ic('plus')+'</button></div><div class="todo">'+
   (TK.length?TK.map(function(t){return '<label class="'+(t.done?'dn':'')+'"><input type="checkbox" data-tk="'+t.id+'"'+(t.done?' checked':'')+'><span>'+esc(t.txt)+'</span><button class="ib" data-tdel="'+t.id+'" aria-label="حذف" style="width:28px;height:28px">'+ic('x')+'</button></label>';}).join(''):A.empty('لا مهام.','tasks'))+'</div></div>';
  h+='<div class="card s4"><div class="ctitle"><span class="ic2">'+ic('eye')+'</span><h3>زيارات قادمة</h3><span class="sp"></span><a class="btn ghost sm" href="#/visits">الكل</a></div><div class="up">'+
   (upV.length?upV.slice(0,4).map(function(v){var t=T(v.t);return '<div class="u">'+A.dbox(v.d)+'<div style="flex:1;min-width:0"><b>'+esc(t.short)+'</b><small>'+(v.kind==='peer'?'تبادلية من '+esc(T(v.by).short):'إشرافية')+' · '+esc(v.cls)+' · '+esc(v.focus)+'</small></div></div>';}).join(''):A.empty('لا زيارات مجدولة.','eye'))+'</div></div>';
  var decs=[];DA.list('meet').forEach(function(m){(m.dec||[]).forEach(function(d){if(d.st!=='done')decs.push(d);});});decs.sort(function(a,b){return a.due<b.due?-1:1;});
  h+='<div class="card s4"><div class="ctitle"><span class="ic2">'+ic('flag')+'</span><h3>قرارات قيد المتابعة</h3><span class="sp"></span><a class="btn ghost sm" href="#/meet">اللقاءات</a></div><div class="up">'+
   (decs.length?decs.slice(0,4).map(function(d){var late=d.due<DA.today();return '<div class="u"><span class="chip '+(late?'bad':'warn')+'" style="flex:none">'+(late?'متأخر':esc(A.rel(d.due)))+'</span><div style="flex:1;min-width:0"><b style="font-size:13.5px">'+esc(d.txt)+'</b><small>'+esc(d.who)+'</small></div></div>';}).join(''):A.empty('كل القرارات منجزة.','check'))+'</div></div>';
  h+='<div class="card s8"><div class="ctitle"><span class="ic2">'+ic('magic')+'</span><h3>إجراءات سريعة</h3></div><div class="tools">'+
   [['nv','زيارة صفية','eye','--k2'],['nm','محضر لقاء','chat','--k4'],['np','نشاط مهني','grow','--k3'],['nr','خطة علاجية','target','--k7']].map(function(t){return '<button class="tool" data-q="'+t[0]+'" style="--c:var('+t[3]+')"><span class="ti">'+ic(t[2])+'</span>'+esc(t[1])+'</button>';}).join('')+'</div></div>';
  h+='<div class="card qcard s4"><q>'+esc(me.motto)+'</q><small>— '+esc(me.short)+'</small></div>';
  h+='</div>';
  on('[data-tk]','change',function(el){var t=DA.rec(el.dataset.tk);t.done=el.checked;DA.put(t);DA.snd(el.checked?'ok':'tap');});
  on('[data-tdel]','click',function(el,e){e.preventDefault();A.remove(el.dataset.tdel,'المهمة');});
  on('[data-tadd]','click',function(){A.form({title:'مهمة جديدة',fields:[{k:'txt',label:'المهمة',req:1}],onSave:function(v){DA.put({K:'task',txt:v.txt,done:false,d:DA.today()});}});});
  on('[data-nv]','click',function(){visForm({});});
  on('[data-q]','click',function(el){var q=el.dataset.q;if(q==='nv')visForm({});else if(q==='nm')meetForm({});else if(q==='np'){location.hash='#/pd';setTimeout(function(){A.openForm('pd');},120);}else{location.hash='#/remed';setTimeout(function(){A.openForm('remed');},120);}});
  A.bind(function(m){var c=$('[data-clock]',m);if(c)c.textContent=new Date().toLocaleTimeString('ar-OM',{hour:'2-digit',minute:'2-digit'});});
  return h;};

/* =================== فريقي =================== */
P.team=function(a){if(a&&DA.rec(a))setTimeout(function(){tDlg(a);},60);var TM=team();
  var h=A.phd('team','ملف كل معلمة: الشعب والزيارات والالتزام والنتائج','<button class="btn gold" data-tadd>'+ic('plus')+' معلمة جديدة</button>');
  h+='<div class="gridc">'+TM.map(function(t){var v=lastVis(t.id),f=folPct(t.id),R=DA.list('res',function(r){return r.t===t.id&&r.test===curTest();}),d=[0,0,0,0,0];R.forEach(function(r){r.dist.forEach(function(x,i){d[i]+=x;});});
    return '<article class="card ent" style="--c:'+t.color+'"><div class="eh">'+tav(t)+'<div style="flex:1;min-width:0"><b>'+esc(t.short)+'</b><small>'+esc(t.cls.join('، '))+' · خبرة '+t.exp+' سنة</small></div>'+rateChip(v&&v.rate)+'</div>'+
     '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12.5px"><div><span class="muted">الالتزام بالتحضير</span>'+A.bar(f,f>=85?'var(--good)':f>=70?'var(--warn)':'var(--bad)')+'<b>'+f+'٪</b></div><div><span class="muted">إتقان طلبتها</span>'+A.bar(mastery(d),t.color)+'<b>'+mastery(d).toFixed(0)+'٪</b></div></div>'+
     '<div class="ef"><span class="chip">'+visits(function(x){return x.t===t.id&&x.st==='done';}).length+' زيارات</span><span class="sp"></span><button class="btn ghost sm" data-tv="'+t.id+'">'+ic('eye')+' زيارة</button><button class="btn ghost sm" data-to="'+t.id+'">الملف</button></div></article>';}).join('')+'</div>';
  on('[data-tadd]','click',function(){tForm({});});
  on('[data-to]','click',function(el){tDlg(el.dataset.to);});
  on('[data-tv]','click',function(el){visForm({t:el.dataset.tv});});
  return h;};
function tForm(t){A.form({title:t.id?'تعديل بيانات المعلمة':'معلمة جديدة',data:Object.assign({exp:1,color:'#2C7BA0'},t,{cls:(t.cls||[]).join('، ')}),fields:[{k:'name',label:'الاسم',req:1},{k:'short',label:'الاسم المختصر',req:1,ph:'أ. ...',half:'open'},{k:'exp',label:'سنوات الخبرة',type:'number',half:'close'},{k:'cls',label:'الشعب (افصلي بفاصلة)',ph:'3/1، 3/2'},{k:'qual',label:'المؤهل'},{k:'color',label:'اللون',type:'select',opts:[['#4E3A9A','نيلي'],['#E5805F','خوخي'],['#2F7D62','أخضر'],['#C0485E','وردي'],['#2C7BA0','أزرق'],['#B8892F','عسلي'],['#A0457A','أرجواني']]},{k:'note',label:'ملاحظات',type:'textarea'}],
  del:t.id?function(){A.remove(t.id,'المعلمة');}:null,onSave:function(v){v.cls=String(v.cls||'').split(/[،,]/).map(function(x){return x.trim();}).filter(Boolean);v.load=v.cls.length*7;DA.put(Object.assign({K:'tch',ord:99},t,v));DA.toast(t.id?'حُفظ':'أُضيفت '+v.short);}});}
function tDlg(id){var t=DA.rec(id);if(!t)return;var V=visits(function(v){return v.t===id;}),f=folPct(id),pd=DA.list('pd');
  var d=DA.dlg('<div class="row" style="gap:14px;align-items:center">'+tav(t,'lg')+'<div style="flex:1"><h2 style="margin:0">'+esc(t.name)+'</h2><small class="muted">'+esc(t.qual||'')+' · خبرة '+t.exp+' سنة · '+esc(t.cls.join('، '))+'</small></div></div>'+
   '<div class="kpis" style="grid-template-columns:repeat(3,1fr);margin:14px 0"><div class="stat"><span><b>'+V.filter(function(v){return v.st==='done';}).length+'</b><small>زيارات</small></span></div><div class="stat"><span><b>'+f+'٪</b><small>الالتزام</small></span></div><div class="stat"><span><b>'+t.load+'</b><small>حصة</small></span></div></div>'+
   '<h3 style="font-size:15px;margin:6px 0">سجل الزيارات</h3>'+(V.length?V.map(function(v){return '<div class="row" style="padding:7px 0;border-bottom:1px dashed var(--line)">'+A.dbox(v.d)+'<div style="flex:1;min-width:0"><b style="font-size:13.5px">'+(v.kind==='peer'?'تبادلية من '+esc(T(v.by).short):'إشرافية')+' · '+esc(v.focus)+'</b><small class="muted" style="display:block">'+esc(v.rec||(v.st==='plan'?'مجدولة':''))+'</small></div>'+(v.st==='plan'?'<span class="chip gold">مجدولة</span>':v.kind==='sup'?rateChip(v.rate):'<span class="chip info">تبادلية</span>')+'</div>';}).join(''):A.empty('لا زيارات.','eye'))+
   '<label class="field" style="margin-top:12px"><span>ملاحظات المعلمة الأولى</span><textarea class="in" data-nt>'+esc(t.note||'')+'</textarea></label>'+
   '<div class="acts"><button class="btn ghost sm" data-te>'+ic('edit')+' البيانات</button><span class="sp"></span><button class="btn ghost" data-close>إغلاق</button><button class="btn gold" data-tv>'+ic('eye')+' زيارة جديدة</button></div>',{wide:1});
  $('[data-nt]',d).onchange=function(e){var r=DA.rec(id);r.note=e.target.value;DA.put(r);DA.toast('حُفظت الملاحظة');};
  $('[data-te]',d).onclick=function(){d.close();tForm(DA.rec(id));};
  $('[data-tv]',d).onclick=function(){d.close();visForm({t:id});};}

/* =================== الزيارات الصفية =================== */
var visTab='sup';
function visForm(v){v=v||{};var isPeer=v.kind==='peer'||(!v.id&&visTab==='peer');
  var f=[{k:'t',label:'المعلمة المزورة',type:'select',opts:tOpts,req:1,half:'open'},{k:'d',label:'التاريخ',type:'date',req:1,half:'close'}];
  if(isPeer)f.push({k:'by',label:'المعلمة الزائرة',type:'select',opts:tOpts});
  f.push({k:'cls',label:'الشعبة',half:'open',ph:'3/1'},{k:'st',label:'الحالة',type:'select',opts:[['done','منفّذة'],['plan','مجدولة']],half:'close'},{k:'focus',label:'محور الزيارة',type:'select',opts:I.FOCUS});
  if(!isPeer)I.CRIT.forEach(function(c,i){f.push({k:'c_'+c[0],label:c[1],type:'select',opts:[[1,'ممتاز'],[2,'جيد جدًا'],[3,'جيد'],[4,'يحتاج دعمًا']],half:i%2?'close':'open'});});
  f.push({k:'good',label:'نقاط القوة',type:'textarea'},{k:'rec',label:'التوصيات',type:'textarea'});
  var data=Object.assign({d:DA.today(),st:'done',kind:isPeer?'peer':'sup'},v);if(v.t&&!v.cls)data.cls=(T(v.t).cls||[])[0];if(v.cr)I.CRIT.forEach(function(c){data['c_'+c[0]]=v.cr[c[0]];});else I.CRIT.forEach(function(c){data['c_'+c[0]]=2;});
  A.form({title:(v.id?'تعديل ':'')+(isPeer?'زيارة تبادلية':'زيارة إشرافية'),wide:1,data:data,fields:f,del:v.id?function(){A.remove(v.id,'الزيارة');}:null,
   onSave:function(x){var r=Object.assign({K:'vis',kind:isPeer?'peer':'sup'},v,x);if(!isPeer){r.cr={};I.CRIT.forEach(function(c){r.cr[c[0]]=+x['c_'+c[0]];delete r['c_'+c[0]];});r.rate=Math.round(visAvg(r));}DA.put(r);DA.toast(v.id?'حُفظت الزيارة':'أُضيفت الزيارة');}});}
P.visits=function(){var TM=team(),L=visits(function(v){return v.kind===visTab;}),done=L.filter(function(v){return v.st==='done';}),plan=L.filter(function(v){return v.st==='plan';}).reverse();
  var h=A.phd('visits','زيارات بمعايير واضحة وتغذية راجعة جاهزة للإرسال','<button class="btn gold" data-vadd>'+ic('plus')+' '+(visTab==='peer'?'زيارة تبادلية':'زيارة إشرافية')+'</button>');
  h+='<div class="fbar"><div class="seg"><button data-vt="sup" aria-pressed="'+(visTab==='sup')+'">الإشرافية</button><button data-vt="peer" aria-pressed="'+(visTab==='peer')+'">تبادل الزيارات</button></div><span class="sp"></span><span class="chip good">'+done.length+' منفّذة</span><span class="chip gold">'+plan.length+' مجدولة</span></div>';
  if(visTab==='sup'){var S=DA.list('vis',function(v){return v.kind==='sup'&&v.st==='done';}),avg={};I.CRIT.forEach(function(c){var s=0,n=0;S.forEach(function(v){if(v.cr){s+=v.cr[c[0]];n++;}});avg[c[0]]=n?s/n:0;});
    h+='<div class="cols eq" style="margin-bottom:16px"><div class="card"><div class="ctitle"><span class="ic2">'+ic('chart')+'</span><h3>متوسط الفريق في المعايير</h3></div>'+I.CRIT.map(function(c){var p=(4-avg[c[0]])/3*100;return '<div style="margin:8px 0"><div class="row" style="font-size:13px"><span>'+c[1]+'</span><span class="sp"></span><b>'+I.RATE[Math.round(avg[c[0]])||2]+'</b></div>'+A.bar(p,p>=66?'var(--good)':p>=40?'var(--info)':'var(--warn)')+'</div>';}).join('')+
     '<p class="muted" style="font-size:12.5px;margin:10px 0 0">'+ic('bulb').replace('<svg','<svg style="width:14px;height:14px;vertical-align:-2px"')+' أضعف معيار: «'+I.CRIT.slice().sort(function(a,b){return avg[b[0]]-avg[a[0]];})[0][1]+'»، يُقترح موضوعًا للورشة القادمة.</p></div>'+
     '<div class="card"><div class="ctitle"><span class="ic2">'+ic('grid')+'</span><h3>خريطة الزيارات</h3><span class="sp"></span><small class="muted">آخر زيارتين لكل معلمة</small></div><div class="mx" style="--n:2">'+TM.map(function(t){var V=visits(function(v){return v.t===t.id&&v.kind==='sup';}).slice(0,2);while(V.length<2)V.push(null);return '<div class="mr"><span>'+esc(t.short)+'</span>'+V.map(function(v){return v?(v.st==='plan'?'<i class="pl">'+esc(A.short(v.d))+'</i>':'<i class="v'+v.rate+'">'+esc(A.short(v.d))+'</i>'):'<i></i>';}).join('')+'</div>';}).join('')+'</div></div></div>';}
  function card(v){var t=T(v.t);return '<article class="card ent'+(v.st==='plan'?'':'')+'" style="--c:'+t.color+'"><div class="eh">'+tav(t)+'<div style="flex:1;min-width:0"><b>'+esc(t.short)+'</b><small>'+esc(A.fmt(v.d))+' · '+esc(v.cls||'')+(v.kind==='peer'?' · الزائرة '+esc(T(v.by).short):'')+'</small></div>'+(v.st==='plan'?'<span class="chip gold">مجدولة</span>':v.kind==='sup'?rateChip(v.rate):'<span class="chip info">منفّذة</span>')+'</div>'+
    '<p><b style="font-weight:600">المحور:</b> '+esc(v.focus)+(v.good?'<br><b style="font-weight:600">القوة:</b> '+esc(v.good):'')+(v.rec?'<br><b style="font-weight:600">التوصية:</b> '+esc(v.rec):'')+'</p>'+
    '<div class="ef">'+(v.st==='done'?'<button class="btn ghost sm" data-vw="'+v.id+'">'+ic('wa')+' التغذية الراجعة</button><button class="ib" data-vc="'+v.id+'" aria-label="نسخ">'+ic('copy')+'</button>':'<button class="btn ghost sm" data-vd="'+v.id+'">'+ic('check')+' نُفّذت</button>')+'<span class="sp"></span><button class="ib" data-ve="'+v.id+'" aria-label="تعديل">'+ic('edit')+'</button></div></article>';}
  h+='<div class="sec-t">المجدولة</div>'+(plan.length?'<div class="gridc">'+plan.map(card).join('')+'</div>':A.empty('لا زيارات مجدولة.','cal'));
  h+='<div class="sec-t">المنفّذة</div>'+(done.length?'<div class="gridc">'+done.map(card).join('')+'</div>':A.empty('لا زيارات منفّذة.','eye'));
  function fb(v){var t=T(v.t);return 'السلام عليكم أ. '+t.short.replace(/^أ\.\s*/,'')+'،\nشكرًا على حصة '+v.cls+' بتاريخ '+A.fmt(v.d)+'.\n'+(v.kind==='sup'?'التقدير العام: '+I.RATE[v.rate]+'\n':'')+'محور الزيارة: '+v.focus+'\nنقاط القوة: '+(v.good||'')+'\nللتطوير: '+(v.rec||'')+'\nمع خالص التقدير، '+A.me().short;}
  on('[data-vt]','click',function(el){visTab=el.dataset.vt;A.refresh();});
  on('[data-vadd]','click',function(){visForm({});});
  on('[data-ve]','click',function(el){visForm(DA.rec(el.dataset.ve));});
  on('[data-vd]','click',function(el){var v=DA.rec(el.dataset.vd);visForm(Object.assign({},v,{st:'done',d:v.d>DA.today()?DA.today():v.d}));});
  on('[data-vw]','click',function(el){A.wa(fb(DA.rec(el.dataset.vw)));});
  on('[data-vc]','click',function(el){A.copy(fb(DA.rec(el.dataset.vc)));});
  return h;};

/* =================== متابعة التحضير =================== */
P.follow=function(){var W=weeks(),TM=team(),K=[['plan','الخطة'],['book','الدفتر'],['corr','التصحيح']],lw=W[W.length-1];
  var h=A.phd('follow','اضغطي الخانة لتبديل الحالة · لكل أسبوع ثلاثة بنود','<button class="btn gold" data-nw>'+ic('plus')+' أسبوع جديد</button>');
  if(lw){var miss=TM.filter(function(t){var m=lw.m[t.id]||{};return !(m.plan&&m.book&&m.corr);});
    h+='<div class="card" style="margin-bottom:16px"><div class="ctitle"><span class="ic2">'+ic('bell')+'</span><h3>أسبوع '+esc(A.short(lw.w))+'</h3><span class="sp"></span>'+(miss.length?'<button class="btn ghost sm" data-rem>'+ic('wa')+' تذكير لطيف ('+miss.length+')</button>':'<span class="chip good">'+ic('check')+' الجميع ملتزم</span>')+'</div>'+
     '<p class="muted" style="margin:0">'+(miss.length?'بانتظار الاستكمال: '+miss.map(function(t){return esc(t.short);}).join('، '):'اكتملت الخطط والدفاتر والتصحيح لكل الفريق.')+'</p></div>';}
  h+='<div class="card" style="padding:8px"><div class="tbl-w"><table class="tbl"><thead><tr><th>المعلمة</th>'+W.map(function(w){return '<th style="text-align:center">'+esc(A.short(w.w))+'<br><small class="muted" style="font-weight:500">خطة · دفتر · تصحيح</small></th>';}).join('')+'<th style="text-align:center">الالتزام</th></tr></thead><tbody>'+
   TM.map(function(t){var f=folPct(t.id);return '<tr><td style="white-space:nowrap">'+tav(t,'sm')+' <b style="font-size:13.5px;font-weight:600">'+esc(t.short)+'</b></td>'+W.map(function(w){var m=w.m[t.id]||{};return '<td style="text-align:center;white-space:nowrap">'+K.map(function(k){return '<button data-fl="'+w.id+'|'+t.id+'|'+k[0]+'" title="'+k[1]+'" aria-label="'+k[1]+'" style="width:24px;height:24px;border-radius:7px;margin:0 1px;vertical-align:middle;display:inline-grid;place-items:center;padding:0;border:1px solid '+(m[k[0]]?'transparent':'var(--line)')+';background:'+(m[k[0]]?'var(--good)':'transparent')+';color:#fff;font-size:12px;line-height:1">'+(m[k[0]]?'✓':'')+'</button>';}).join('')+'</td>';}).join('')+
    '<td style="text-align:center"><b style="color:'+(f>=85?'var(--good)':f>=70?'var(--warn)':'var(--bad)')+'">'+f+'٪</b></td></tr>';}).join('')+'</tbody></table></div></div>';
  on('[data-fl]','click',function(el){var p=el.dataset.fl.split('|'),r=DA.rec(p[0]);r.m[p[1]]=r.m[p[1]]||{};r.m[p[1]][p[2]]=r.m[p[1]][p[2]]?0:1;DA.put(r);DA.snd('tap');});
  on('[data-nw]','click',function(){var w=I.weekOf(DA.today());if(DA.rec('fol_'+w)){w=I.iso(I.addD(new Date(w+'T08:00:00'),7));}var m={};team().forEach(function(t){m[t.id]={plan:0,book:0,corr:0};});DA.put({id:'fol_'+w,K:'fol',w:w,m:m});DA.toast('أُضيف أسبوع '+A.short(w));});
  on('[data-rem]','click',function(){A.wa('السلام عليكم معلماتنا الفاضلات،\nتذكير لطيف باستكمال خطط الدروس والدفاتر والتصحيح لهذا الأسبوع قبل نهاية دوام الخميس. شاكرة جهودكن 🌷\n'+A.me().short);});
  return h;};

/* =================== لقاءات القسم =================== */
var DST={done:['منجز','good'],run:['قيد التنفيذ','warn']};
function meetForm(m){m=m||{};A.form({title:m.id?'تعديل اللقاء':'لقاء جديد',wide:1,data:Object.assign({d:DA.today(),time:'10:50',place:'غرفة قسم الرياضيات',st:'plan'},m,{agenda:(m.agenda||[]).join('\n'),decs:(m.dec||[]).map(function(d){return d.txt+' | '+d.who+' | '+d.due;}).join('\n')}),
  fields:[{k:'title',label:'عنوان اللقاء',req:1},{k:'d',label:'التاريخ',type:'date',half:'open'},{k:'time',label:'الوقت',type:'time',half:'close'},{k:'place',label:'المكان',half:'open'},{k:'st',label:'الحالة',type:'select',opts:[['plan','مجدول'],['done','منعقد']],half:'close'},{k:'agenda',label:'جدول الأعمال (بند في كل سطر)',type:'lines'},{k:'decs',label:'القرارات: القرار | المسؤولة | الموعد (سطر لكل قرار)',type:'textarea',ph:'تطبيق بنك الأسئلة | جميع المعلمات | 2026-12-01'},{k:'notes',label:'ملخص المحضر',type:'textarea'}],
  del:m.id?function(){A.remove(m.id,'اللقاء');}:null,
  onSave:function(v){var old={};(m.dec||[]).forEach(function(d){old[d.txt]=d;});v.dec=String(v.decs||'').split('\n').map(function(l){return l.trim();}).filter(Boolean).map(function(l,i){var p=l.split('|').map(function(x){return x.trim();});var o=old[p[0]];return {id:o?o.id:'d'+Date.now().toString(36)+i,txt:p[0],who:p[1]||'',due:p[2]||v.d,st:o?o.st:'run'};});delete v.decs;
    DA.put(Object.assign({K:'meet',att:0},m,v));DA.toast(m.id?'حُفظ اللقاء':'أُضيف اللقاء');}});}
P.meet=function(){var M=DA.list('meet').sort(function(a,b){return a.d<b.d?1:-1;});
  var h=A.phd('meet','المحاضر والقرارات بحالة كل قرار، وطباعة المحضر','<button class="btn gold" data-madd>'+ic('plus')+' لقاء جديد</button>');
  h+=M.length?'<div class="gridc" style="grid-template-columns:repeat(auto-fill,minmax(340px,1fr))">'+M.map(function(m){var dn=(m.dec||[]).filter(function(d){return d.st==='done';}).length;return '<article class="card ent" style="--c:var(--k4)"><div class="eh">'+A.dbox(m.d)+'<div style="flex:1;min-width:0"><b>'+esc(m.title)+'</b><small>'+esc(A.rel(m.d))+' · '+esc(m.time||'')+' · '+esc(m.place||'')+'</small></div><span class="chip '+(m.st==='done'?'good':'gold')+'">'+(m.st==='done'?'منعقد':'مجدول')+'</span></div>'+
    '<ol style="margin:0;padding-inline-start:20px;font-size:13.5px;color:var(--ink2);line-height:1.9">'+(m.agenda||[]).map(function(a){return '<li>'+esc(a)+'</li>';}).join('')+'</ol>'+
    ((m.dec||[]).length?'<div style="border-top:1px dashed var(--line);padding-top:8px"><small class="muted">القرارات · '+dn+'/'+m.dec.length+' منجز</small>'+(m.dec||[]).map(function(d){var s=DST[d.st]||DST.run,late=d.st!=='done'&&d.due<DA.today();return '<div class="row" style="padding:5px 0;gap:8px"><button class="chip '+(late?'bad':s[1])+'" data-ds="'+m.id+'|'+d.id+'" style="border:0;cursor:pointer;flex:none">'+(late?'متأخر':s[0])+'</button><span style="flex:1;font-size:13.5px">'+esc(d.txt)+'<small class="muted" style="display:block">'+esc(d.who)+' · '+esc(A.short(d.due))+'</small></span></div>';}).join('')+'</div>':'')+
    '<div class="ef"><button class="btn ghost sm" data-mp="'+m.id+'">'+ic('print')+' المحضر</button><span class="sp"></span><button class="ib" data-me="'+m.id+'" aria-label="تعديل">'+ic('edit')+'</button></div></article>';}).join('')+'</div>':A.empty('لا لقاءات.','chat');
  on('[data-madd]','click',function(){meetForm({});});
  on('[data-me]','click',function(el){meetForm(DA.rec(el.dataset.me));});
  on('[data-ds]','click',function(el){var p=el.dataset.ds.split('|'),m=DA.rec(p[0]);m.dec.forEach(function(d){if(d.id===p[1])d.st=d.st==='done'?'run':'done';});DA.put(m);DA.snd('ok');});
  on('[data-mp]','click',function(el){location.hash='#/reports/meet:'+el.dataset.mp;});
  return h;};

/* =================== النتائج وتحليلها =================== */
var resT=null,resG=0;
P.tests=function(){var cfg=DA.rec('tests'),TS=cfg?cfg.tests:[['mid','اختبار منتصف الفصل']],te=curTest(),prev=TS.filter(function(x){return x[0]!==te;})[0];
  var R=DA.list('res',function(r){return r.test===te&&(!resG||r.g===resG);}),RP=prev?DA.list('res',function(r){return r.test===prev[0]&&(!resG||r.g===resG);}):[];
  function agg(L){var d=[0,0,0,0,0];L.forEach(function(r){r.dist.forEach(function(v,i){d[i]+=v;});});return d;}
  var d=agg(R),dp=agg(RP),n=d.reduce(function(a,b){return a+b;},0),m=mastery(d),mp=mastery(dp),pass=n?(n-d[4])/n*100:0;
  var sk={};I.SKILLS.forEach(function(s){var t=0,c=0;R.forEach(function(r){t+=r.sk[s]*r.n;c+=r.n;});sk[s]=c?t/c:0;});var skS=I.SKILLS.slice().sort(function(a,b){return sk[a]-sk[b];});
  var h=A.phd('tests','قراءة النتائج حسب الصف والمعلمة والمهارة، مع توصيات','<button class="btn ghost" data-rp>'+ic('print')+' تقرير</button>');
  h+='<div class="fbar"><div class="seg">'+TS.map(function(t){return '<button data-te="'+t[0]+'" aria-pressed="'+(t[0]===te)+'">'+esc(t[1])+'</button>';}).join('')+'</div><span class="sp"></span>'+[0,1,2,3,4].map(function(g){return '<button class="fchip" data-rg="'+g+'" aria-pressed="'+(resG===g)+'">'+(g?'الصف '+['','الأول','الثاني','الثالث','الرابع'][g]:'كل الصفوف')+'</button>';}).join('')+'</div>';
  var LC=['var(--good)','var(--info)','var(--warn)','var(--a)','var(--bad)'],LN=['أ (٩٠+)','ب (٨٠+)','ج (٦٥+)','د (٥٠+)','هـ'];
  h+='<div class="bento" style="margin-bottom:16px">'+A.kc('award','--k5',m.toFixed(1)+'٪','','الإتقان (أ+ب)',prev?'<b>'+(m-mp>=0?'▲ ':'▼ ')+Math.abs(m-mp).toFixed(1)+'</b> عن '+esc(prev[1]):'')+A.kc('check','--k1',pass.toFixed(1)+'٪','','نسبة النجاح',n+' طالبًا')+
   '<div class="card s6"><div class="ctitle"><span class="ic2">'+ic('layers')+'</span><h3>توزيع المستويات</h3></div><div style="height:22px;border-radius:12px;overflow:hidden;display:flex">'+d.map(function(v,i){return v?'<i style="flex:'+v+';background:'+LC[i]+'"></i>':'';}).join('')+'</div><div class="row" style="flex-wrap:wrap;gap:10px;margin-top:10px;font-size:12.5px">'+d.map(function(v,i){return '<span><i style="display:inline-block;width:9px;height:9px;border-radius:3px;background:'+LC[i]+'"></i> '+LN[i]+' · '+v+'</span>';}).join('')+'</div></div></div>';
  h+='<div class="cols eq"><div class="card"><div class="ctitle"><span class="ic2">'+ic('target')+'</span><h3>الإتقان حسب المهارة</h3></div>'+skS.map(function(s){var v=sk[s];return '<div style="margin:9px 0"><div class="row" style="font-size:13px"><span>'+esc(s)+'</span><span class="sp"></span><b>'+v.toFixed(0)+'٪</b></div>'+A.bar(v,v>=80?'var(--good)':v>=65?'var(--info)':'var(--bad)')+'</div>';}).join('')+'</div>'+
   '<div class="card"><div class="ctitle"><span class="ic2">'+ic('users')+'</span><h3>حسب المعلمة</h3></div>'+team().map(function(t){var L=R.filter(function(r){return r.t===t.id;});if(!L.length)return '';var x=mastery(agg(L)),y=mastery(agg(RP.filter(function(r){return r.t===t.id;})));return '<div style="margin:9px 0"><div class="row" style="font-size:13px">'+tav(t,'sm')+'<span>'+esc(t.short)+'</span><small class="muted">'+esc(L.map(function(r){return r.cls;}).join('، '))+'</small><span class="sp"></span><b>'+x.toFixed(0)+'٪</b> <small style="color:'+(x>=y?'var(--good)':'var(--bad)')+'">'+(x>=y?'▲':'▼')+Math.abs(x-y).toFixed(0)+'</small></div>'+A.bar(x,t.color)+'</div>';}).join('')+'</div></div>';
  var weak=skS.slice(0,2),hasR=function(s){return DA.list('rem',function(r){return r.skill===s;}).length;};
  h+='<div class="sec-t">توصيات ذكية</div><div class="gridc">'+
   weak.map(function(s){return '<div class="card ent" style="--c:var(--bad)"><div class="eh"><span class="ei">'+ic('warn')+'</span><div><b>مهارة «'+esc(s)+'» الأضعف ('+sk[s].toFixed(0)+'٪)</b><small>تحتاج برنامجًا علاجيًا مشتركًا</small></div></div><div class="ef"><span class="sp"></span>'+(hasR(s)?'<span class="chip good">'+ic('check')+' لها خطة</span>':'<button class="btn ghost sm" data-mk="'+esc(s)+'">'+ic('target')+' أنشئي خطة</button>')+'</div></div>';}).join('')+
   '<div class="card ent" style="--c:var(--good)"><div class="eh"><span class="ei">'+ic('star')+'</span><div><b>أقوى مهارة: «'+esc(skS[skS.length-1])+'»</b><small>شاركي ممارساتها في درس تطبيقي</small></div></div></div>'+
   '<div class="card ent" style="--c:var(--info)"><div class="eh"><span class="ei">'+ic('chart')+'</span><div><b>'+(m>=mp?'تحسّن':'تراجع')+' الإتقان '+Math.abs(m-mp).toFixed(1)+' نقطة</b><small>'+(m>=mp?'استمري في المتابعة الأسبوعية للخطط العلاجية':'راجعي توزيع المحتوى ومستوى أسئلة الاختبار')+'</small></div></div></div></div>';
  on('[data-te]','click',function(el){resT=el.dataset.te;A.refresh();});
  on('[data-rg]','click',function(el){resG=+el.dataset.rg;A.refresh();});
  on('[data-rp]','click',function(){location.hash='#/reports/res';});
  on('[data-mk]','click',function(el){location.hash='#/remed';setTimeout(function(){A.openForm('remed');setTimeout(function(){var i=$('.dlg [name="skill"]');if(i)i.value=el.dataset.mk;},80);},150);});
  return h;};

/* =================== الخطط العلاجية =================== */
P.remed=function(){return A.listPage({k:'remed',kind:'rem',noun:'خطة علاجية',add:'خطة جديدة',icon:'target',sort:function(a,b){return a.prog-b.prog;},
  fields:[{k:'title',label:'العنوان',req:1,ph:'حقائق الضرب · الصف الرابع'},{k:'skill',label:'المهارة',type:'select',opts:I.SKILLS,half:'open'},{k:'g',label:'الصف',type:'select',opts:[['1','الأول'],['2','الثاني'],['3','الثالث'],['4','الرابع']],half:'close'},{k:'n',label:'عدد الطلبة المستهدفين',type:'number',half:'open'},{k:'prog',label:'نسبة التنفيذ ٪',type:'number',half:'close'},{k:'steps',label:'الإجراءات (إجراء في كل سطر)',type:'lines'},{k:'d',label:'تاريخ البدء',type:'date',def:DA.today}],
  before:function(x){x.prog=Math.max(0,Math.min(100,+x.prog||0));x.tchs=x.tchs||[];},
  top:function(L){var a=L.reduce(function(s,r){return s+(+r.prog||0);},0)/(L.length||1);return '<div class="bento" style="margin-bottom:16px">'+A.kc('target','--k7',L.length,'','خطط قائمة','')+A.kc('users','--k1',L.reduce(function(s,r){return s+(+r.n||0);},0),'','طالبًا مستهدفًا','')+A.kc('grow','--k5',a.toFixed(0)+'٪','','متوسط التنفيذ','')+'</div>';},
  item:function(r){return {icon:'target',c:'var(--k7)',title:r.title,meta:esc(r.n||0)+' طالبًا · '+((r.tchs||[]).map(function(x){return T(x).short;}).join('، ')||'القسم'),
   extra:'<ol style="margin:0;padding-inline-start:20px;font-size:13.5px;color:var(--ink2);line-height:1.9">'+(r.steps||[]).map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ol><div class="row" style="gap:10px"><div style="flex:1">'+A.bar(r.prog,'var(--k7)')+'</div><b style="font-family:var(--fh)">'+(r.prog||0)+'٪</b></div>',
   acts:'<button class="btn ghost sm" data-rp10="'+r.id+'">+10٪</button>'};}})+bindRem();};
function bindRem(){on('[data-rp10]','click',function(el){var r=DA.rec(el.dataset.rp10);r.prog=Math.min(100,(+r.prog||0)+10);DA.put(r);DA.snd('ok');});return '';}

/* =================== التنمية المهنية =================== */
P.pd=function(){return A.listPage({k:'pd',kind:'pd',noun:'نشاط مهني',add:'نشاط مهني',icon:'grow',
  fields:[{k:'title',label:'العنوان',req:1},{k:'kind',label:'النوع',type:'select',opts:I.PDK.map(function(x){return [x[0],x[1]];}),half:'open'},{k:'d',label:'التاريخ',type:'date',def:DA.today,half:'close'},{k:'by',label:'المنفّذة',half:'open'},{k:'att',label:'عدد الحاضرات',type:'number',half:'close'},{k:'st',label:'الحالة',type:'select',opts:[['plan','مخطط'],['run','جارٍ'],['done','منفّذ']]},{k:'txt',label:'الأثر والملاحظات',type:'textarea'},{k:'img',label:'صورة',type:'img'}],
  filter:{key:'kind',opts:I.PDK.map(function(x){return [x[0],x[1]];})},
  top:function(L){var dn=L.filter(function(x){return x.st==='done';});return '<div class="bento" style="margin-bottom:16px">'+A.kc('grow','--k3',dn.length,'','نشاطًا منفّذًا','')+A.kc('users','--k1',dn.reduce(function(a,x){return a+(+x.att||0);},0),'','حضورًا تراكميًا','')+A.kc('cal','--k4',L.filter(function(x){return x.st==='plan';}).length,'','مخطط قادم','')+'</div>';},
  item:function(r){var k=I.PDK.filter(function(x){return x[0]===r.kind;})[0]||I.PDK[0];return {icon:k[2],c:'var('+k[3]+')',title:r.title,meta:esc(k[1])+' · '+esc(A.fmt(r.d))+' · '+esc(r.by||''),body:esc(r.txt||''),cover:r.img?r.img:null,chips:'<span class="chip '+(r.st==='done'?'good':r.st==='run'?'info':'gold')+'">'+({done:'منفّذ',run:'جارٍ',plan:'مخطط'}[r.st]||'')+'</span>'+(r.att?'<span class="chip">'+r.att+' حاضرات</span>':'')};}});};

/* =================== بنود التقييم =================== */
P.kpi=function(){var r=DA.rec('kpi')||{id:'kpi',K:'kpi',lv:{},ev:{}},tot=0;I.KPI.forEach(function(k,i){tot+=+(r.lv[i]||0);});var pct=tot/(I.KPI.length*4)*100;
  var h=A.phd('kpi','تقييم ذاتي بأربعة مستويات، ولكل بند شاهد من المنصة نفسها','<button class="btn ghost" data-kp>'+ic('print')+' طباعة</button>');
  h+='<div class="card" style="margin-bottom:16px;display:flex;align-items:center;gap:20px;flex-wrap:wrap"><div class="now"><div class="pring" style="--p:'+pct.toFixed(0)+'"><div><b>'+pct.toFixed(0)+'٪</b><small>الإجمالي</small></div></div></div><div style="flex:1;min-width:220px"><h3 style="font-size:18px">'+esc(I.KLV[Math.max(1,Math.round(tot/I.KPI.length))])+' في المتوسط</h3><p class="muted" style="margin:4px 0 0">'+tot+' من '+(I.KPI.length*4)+' نقطة · '+I.KPI.length+' بنود في 5 مجالات. الشواهد تُربط تلقائيًا بالأقسام.</p></div></div>';
  var g=null;h+='<div class="card">';
  I.KPI.forEach(function(k,i){if(k[0]!==g){g=k[0];h+='<div class="sec-t" style="margin-top:'+(i?14:0)+'px">'+esc(g)+'</div>';}var v=+(r.lv[i]||0),s=A.sec(k[2]);
    h+='<div class="kpi-it" style="--c:var(--k4)"><div class="tx"><b>'+esc(k[1])+'</b><small><a href="#/'+k[2]+'" style="color:var(--b)">'+ic(s[2]).replace('<svg','<svg style="width:13px;height:13px;vertical-align:-2px"')+' الشاهد: '+esc(s[1])+'</a>'+(r.ev[i]?' · '+esc(r.ev[i]):'')+'</small></div><div class="lvls">'+[1,2,3,4].map(function(n){return '<button data-kl="'+i+'|'+n+'" aria-pressed="'+(v===n)+'" title="'+I.KLV[n]+'">'+n+'</button>';}).join('')+'</div><button class="ib" data-ke="'+i+'" aria-label="ملاحظة">'+ic('note')+'</button></div>';});
  h+='</div><p class="muted" style="font-size:12.5px;margin-top:10px">المستويات: ١ مبتدئ · ٢ نامٍ · ٣ متمكن · ٤ متميز. البنود هنا للعرض ويمكن تعديلها لتطابق استمارة الوزارة.</p>';
  function save(fn){var x=DA.rec('kpi')||{id:'kpi',K:'kpi',lv:{},ev:{}};fn(x);DA.put(x);}
  on('[data-kl]','click',function(el){var p=el.dataset.kl.split('|');save(function(x){x.lv[p[0]]=+p[1];});DA.snd('tap');});
  on('[data-ke]','click',function(el){var i=el.dataset.ke;A.form({title:'شاهد البند',data:{ev:(DA.rec('kpi')||{ev:{}}).ev[i]||''},fields:[{k:'ev',label:I.KPI[i][1],type:'textarea',ph:'وصف مختصر للشاهد'}],onSave:function(v){save(function(x){x.ev[i]=v.ev;});}});});
  on('[data-kp]','click',function(){location.hash='#/reports/kpi';});
  return h;};

/* =================== الإنجازات =================== */
P.ach=function(){return A.listPage({k:'ach',kind:'ach',noun:'إنجاز',add:'إضافة إنجاز',icon:'trophy',
  fields:[{k:'title',label:'العنوان',req:1},{k:'cat',label:'التصنيف',type:'select',opts:I.ACHCAT.map(function(x){return [x[0],x[1]];}),half:'open'},{k:'d',label:'التاريخ',type:'date',def:DA.today,half:'close'},{k:'txt',label:'الوصف',type:'textarea'},{k:'img',label:'صورة',type:'img'}],
  filter:{key:'cat',opts:I.ACHCAT.map(function(x){return [x[0],x[1]];})},
  item:function(r){var c=I.ACHCAT.filter(function(x){return x[0]===r.cat;})[0]||I.ACHCAT[0];return {icon:c[2],c:'var('+c[3]+')',title:r.title,meta:esc(c[1])+' · '+esc(A.fmt(r.d)),body:esc(r.txt||''),cover:r.img||''};}});};

/* =================== التقارير =================== */
var REPS=[['sum','التقرير الشامل للقسم','report','--k1','ملخص الأداء والزيارات والنتائج والتنمية'],['vis','تقرير الزيارات الصفية','eye','--k2','كل الزيارات بمعاييرها وتوصياتها'],['fol','تقرير متابعة التحضير','tasks','--k5','الالتزام الأسبوعي لكل معلمة'],['res','تقرير تحليل النتائج','chart','--k8','الإتقان حسب المهارة والمعلمة'],['kpi','بنود تقييم المعلمة الأولى','award','--k4','المستويات والشواهد']];
P.reports=function(a){if(a)return report(a);
  var h=A.phd('reports','تقارير تُولَّد من بيانات القسم مباشرة، جاهزة للطباعة أو حفظها PDF');
  h+='<div class="gridc">'+REPS.map(function(r){return '<a class="card ent" href="#/reports/'+r[0]+'" style="--c:var('+r[3]+');text-decoration:none;color:inherit"><div class="eh"><span class="ei">'+ic(r[2])+'</span><div><b>'+esc(r[1])+'</b><small>'+esc(r[4])+'</small></div></div></a>';}).join('')+'</div>';
  return h;};
function phead(t){var me=A.me();return '<div class="phead"><img src="icons/mark.svg" alt=""><div class="t"><b>'+esc(me.school)+'</b><small>'+esc(me.short)+' · '+esc(me.title)+' · '+esc(me.year)+'</small></div><h2 style="margin:0">'+esc(t)+'</h2></div>';}
function report(k){var me=A.me(),title,b='',TM=team();
  if(k.indexOf('meet:')===0){var m=DA.rec(k.slice(5));if(!m)return P.reports();title='محضر: '+m.title;b='<p><b>التاريخ:</b> '+esc(A.fmt(m.d))+' · '+esc(m.time||'')+' · '+esc(m.place||'')+'</p><h3>جدول الأعمال</h3><ol>'+(m.agenda||[]).map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ol><h3>القرارات</h3><table><tr><th>القرار</th><th>المسؤولة</th><th>الموعد</th><th>الحالة</th></tr>'+(m.dec||[]).map(function(d){return '<tr><td>'+esc(d.txt)+'</td><td>'+esc(d.who)+'</td><td>'+esc(A.short(d.due))+'</td><td>'+(DST[d.st]||DST.run)[0]+'</td></tr>';}).join('')+'</table>'+(m.notes?'<h3>ملخص</h3><p>'+esc(m.notes)+'</p>':'')+'<h3>الحاضرات</h3><table><tr><th>المعلمة</th><th>التوقيع</th></tr>'+TM.map(function(t){return '<tr><td>'+esc(t.name)+'</td><td></td></tr>';}).join('')+'</table>';}
  else{var r=REPS.filter(function(x){return x[0]===k;})[0]||REPS[0];title=r[1];
   var V=visits(function(v){return v.st==='done';});
   var vis='<table><tr><th>التاريخ</th><th>المعلمة</th><th>النوع</th><th>المحور</th><th>التقدير</th><th>التوصية</th></tr>'+V.map(function(v){return '<tr><td>'+esc(A.short(v.d))+'</td><td>'+esc(T(v.t).short)+'</td><td>'+(v.kind==='peer'?'تبادلية':'إشرافية')+'</td><td>'+esc(v.focus)+'</td><td>'+(v.kind==='sup'?I.RATE[v.rate]:'—')+'</td><td>'+esc(v.rec||'')+'</td></tr>';}).join('')+'</table>';
   var W=weeks(),fol='<table><tr><th>المعلمة</th>'+W.map(function(w){return '<th>'+esc(A.short(w.w))+'</th>';}).join('')+'<th>الالتزام</th></tr>'+TM.map(function(t){return '<tr><td>'+esc(t.short)+'</td>'+W.map(function(w){var m=w.m[t.id]||{};return '<td>'+((m.plan?1:0)+(m.book?1:0)+(m.corr?1:0))+'/3</td>';}).join('')+'<td>'+folPct(t.id)+'٪</td></tr>';}).join('')+'</table>';
   var te=curTest(),R=DA.list('res',function(x){return x.test===te;}),sk={};I.SKILLS.forEach(function(s){var t=0,c=0;R.forEach(function(x){t+=x.sk[s]*x.n;c+=x.n;});sk[s]=c?t/c:0;});
   var res='<table><tr><th>المهارة</th><th>متوسط الإتقان</th></tr>'+I.SKILLS.map(function(s){return '<tr><td>'+esc(s)+'</td><td>'+sk[s].toFixed(0)+'٪</td></tr>';}).join('')+'</table><h3>حسب المعلمة والشعبة</h3><table><tr><th>المعلمة</th><th>الشعبة</th><th>العدد</th><th>أ</th><th>ب</th><th>ج</th><th>د</th><th>هـ</th><th>الإتقان</th></tr>'+R.map(function(x){return '<tr><td>'+esc(T(x.t).short)+'</td><td>'+esc(x.cls)+'</td><td>'+x.n+'</td>'+x.dist.map(function(v){return '<td>'+v+'</td>';}).join('')+'<td>'+mastery(x.dist).toFixed(0)+'٪</td></tr>';}).join('')+'</table>';
   var kr=DA.rec('kpi')||{lv:{},ev:{}},kpi='<table><tr><th>المجال</th><th>البند</th><th>المستوى</th><th>الشاهد</th></tr>'+I.KPI.map(function(x,i){return '<tr><td>'+esc(x[0])+'</td><td>'+esc(x[1])+'</td><td>'+(I.KLV[kr.lv[i]]||'—')+'</td><td>'+esc(kr.ev[i]||A.sec(x[2])[1])+'</td></tr>';}).join('')+'</table>';
   if(k==='vis')b=vis;else if(k==='fol')b=fol;else if(k==='res')b=res;else if(k==='kpi')b=kpi;
   else{var d=[0,0,0,0,0];R.forEach(function(x){x.dist.forEach(function(v,i){d[i]+=v;});});var pd=DA.list('pd');
     b='<div class="kp"><div><b>'+TM.length+'</b>معلمات</div><div><b>'+V.length+'</b>زيارة منفذة</div><div><b>'+(TM.reduce(function(a,t){return a+folPct(t.id);},0)/TM.length).toFixed(0)+'٪</b>الالتزام بالتحضير</div><div><b>'+mastery(d).toFixed(0)+'٪</b>إتقان القسم</div><div><b>'+pd.filter(function(x){return x.st==='done';}).length+'</b>نشاطًا مهنيًا</div><div><b>'+DA.list('meet').length+'</b>لقاءات</div><div><b>'+DA.list('rem').length+'</b>خطط علاجية</div><div><b>'+DA.list('ach').length+'</b>إنجازات</div></div>'+
      '<h3>الزيارات الصفية</h3>'+vis+'<h3>تحليل النتائج حسب المهارة</h3>'+res.split('<h3>')[0]+'<h3>التنمية المهنية</h3><ul>'+pd.map(function(x){return '<li>'+esc(x.title)+' ('+({done:'منفّذ',run:'جارٍ',plan:'مخطط'}[x.st])+')</li>';}).join('')+'</ul>';}}
  var h='<div class="row no-print" style="margin:16px 0"><a class="btn ghost" href="#/reports">'+ic('right')+' كل التقارير</a><span class="sp"></span><button class="btn gold" data-p>'+ic('print')+' طباعة / حفظ PDF</button></div>'+
   '<div class="paper">'+phead(title)+'<p style="color:#666;margin-top:-6px">قسم '+esc(me.subj)+' · حتى '+esc(A.fmt(A.workday()))+'</p>'+b+'<div class="sig"><span>المعلمة الأولى: '+esc(me.short)+'</span><span>اعتماد مديرة المدرسة: ...................</span></div><div class="wm2">نسخة عرض من منصة ذُرى · جميع البيانات وهمية</div></div>';
  on('[data-p]','click',function(){window.print();});
  return h;}

/* =================== الإعدادات =================== */
P.settings=function(){var me=A.me(),mute=DA.lsg('mute',false);
  var h=A.phd('settings');
  h+='<div class="cols"><div class="stack"><div class="card"><div class="ctitle"><span class="ic2">'+ic('user')+'</span><h3>ملفي</h3><span class="sp"></span><button class="btn ghost sm" data-me>'+ic('edit')+' تعديل</button></div>'+
   [['الاسم',me.name],['الاسم المختصر',me.short],['الوظيفة',me.title],['المدرسة',me.school],['المرحلة',me.cycle],['العام الدراسي',me.year],['الخبرة',me.exp],['عبارتي',me.motto]].map(function(x){return '<div class="set-row"><div class="tx"><small>'+x[0]+'</small><b style="font-weight:600">'+esc(x[1])+'</b></div></div>';}).join('')+'</div></div>'+
   '<div class="stack"><div class="card"><div class="ctitle"><span class="ic2">'+ic('pal')+'</span><h3>المظهر</h3></div>'+
   '<div class="set-row"><div class="tx"><b>الثيمات</b><small>'+DA.SKINS.length+' ثيمات بخلفيات حيّة وأصوات خاصة</small></div><button class="btn sm" data-act="studio">اختيار</button></div>'+
   '<div class="set-row"><div class="tx"><b>الوضع الليلي</b><small>يبدّل بين النهاري والليلي</small></div><button class="switch" role="switch" aria-checked="'+(document.documentElement.getAttribute('data-mode')==='dark')+'" data-act="mode"></button></div>'+
   '<div class="set-row"><div class="tx"><b>أصوات اللمس</b><small>نقرات طبيعية هادئة</small></div><button class="switch" role="switch" aria-checked="'+(!mute)+'" data-mute></button></div>'+
   '<div class="set-row"><div class="tx"><b>تثبيت المنصة</b><small>كتطبيق على الجوال أو الحاسوب، وتعمل دون إنترنت</small></div><button class="btn gold sm" data-act="install">'+ic('dl')+' تثبيت</button></div></div>'+
   '<div class="card"><div class="ctitle"><span class="ic2">'+ic('folder')+'</span><h3>البيانات</h3></div>'+
   '<div class="set-row"><div class="tx"><b>نسخة احتياطية</b><small>تنزيل كل بيانات القسم في ملف</small></div><button class="btn ghost sm" data-exp>'+ic('dl')+' تنزيل</button></div>'+
   '<div class="set-row"><div class="tx"><b>استعادة نسخة</b><small>من ملف نسخة احتياطية سابق</small></div><button class="btn ghost sm" data-imp>'+ic('up')+' استعادة</button></div>'+
   '<div class="set-row"><div class="tx"><b>إعادة بيانات العرض</b><small>يمسح ما أضفتِه ويعيد البيانات الوهمية</small></div><button class="btn danger sm" data-reset>'+ic('refresh')+' إعادة</button></div></div>'+
   '<div class="card qcard"><h3>'+esc(I.BRAND.app)+' لقسمكِ</h3><p class="muted" style="margin:0">نسخة خاصة بفريقكِ الحقيقي، بمزامنة آمنة بين أجهزتكِ.</p><a class="btn gold" href="https://wa.me/96876506037?text='+encodeURIComponent(I.BRAND.wa)+'" target="_blank" rel="noopener" style="width:max-content">'+ic('wa')+' 76506037</a></div></div></div>';
  on('[data-me]','click',function(){var c=DA.rec('me')||{id:'me',K:'cfg'};A.form({title:'ملفي',data:A.me(),wide:1,fields:[{k:'name',label:'الاسم',req:1},{k:'short',label:'الاسم المختصر',half:'open'},{k:'title',label:'الوظيفة',half:'close'},{k:'school',label:'المدرسة',half:'open'},{k:'cycle',label:'المرحلة',half:'close'},{k:'year',label:'العام الدراسي',half:'open'},{k:'exp',label:'الخبرة',half:'close'},{k:'motto',label:'عبارتي',type:'textarea'}],
    onSave:function(v){DA.put(Object.assign(c,v));DA.toast('حُفظ ملفكِ');}});});
  on('[data-mute]','click',function(el){var m=!DA.lsg('mute',false);DA.lss('mute',m);el.setAttribute('aria-checked',String(!m));});
  on('[data-exp]','click',function(){var out=Object.keys(DA.R).map(function(k){return DA.R[k];}).filter(function(r){return !r.del;});var b=new Blob([JSON.stringify({app:window.APPID,v:1,at:new Date().toISOString(),recs:out})],{type:'application/json'});var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=I.BRAND.app+'-نسخة-احتياطية-'+DA.today()+'.json';document.body.appendChild(a);a.click();a.remove();DA.toast('نُزّلت النسخة الاحتياطية');});
  on('[data-imp]','click',function(){DA.pick('application/json,.json').then(function(fs){if(!fs[0])return;fs[0].text().then(function(t){var j;try{j=JSON.parse(t);}catch(e){DA.toast('الملف غير صالح');return;}if(!j||j.app!==window.APPID||!j.recs){DA.toast('هذا ليس ملف نسخة من '+I.BRAND.app);return;}
    DA.ask('ستُستبدل البيانات الحالية بمحتوى النسخة ('+j.recs.length+' سجلًا). متابعة؟',function(){DA.wipe().then(function(){return DA.bulk(j.recs);}).then(function(){DA.toast('استُعيدت النسخة');A.refresh();});},{ok:'استعادة'});});});});
  on('[data-reset]','click',function(){DA.ask('سيُمسح كل ما أضفتِه وتعود بيانات العرض كما كانت. متابعة؟',function(){A.reset();},{danger:1,ok:'إعادة البيانات'});});
  return h;};
})();
