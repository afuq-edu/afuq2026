/* =====================================================================
   «رُواء» · أقسام منصة المعلمة
   الرئيسية، جدولي، التحضير، الحضور، طلابي، سجل الدرجات، الواجبات، النجوم،
   أدوات الصف، الخطط الفردية، أولياء الأمور، ملف الإنجاز، النمو المهني،
   التقارير، الإعدادات.
   ===================================================================== */
(function(){
'use strict';
var DA=window.DA,I=window.PD,A=window.APP,$=DA.$,$$=DA.$$,esc=DA.esc,ic=A.ic,P=A.PAGES,on=A.on;

/* ---------- بيانات مساعدة ---------- */
function classes(){return DA.list('cls').sort(function(a,b){return a.id<b.id?-1:1;});}
function C(id){return DA.rec(id)||{name:id||'—',short:id||'—',color:'#888'};}
function students(cls){return DA.list('stu',function(s){return !cls||s.cls===cls;}).sort(function(a,b){return a.name.localeCompare(b.name,'ar');});}
function asms(cls){return DA.list('asm',function(a){return a.cls===cls;}).sort(function(a,b){return a.d<b.d?-1:a.d>b.d?1:(a.c||0)-(b.c||0);});}
function stuPct(s){var t=0,m=0;asms(s.cls).forEach(function(a){if(a.sc&&a.sc[s.id]!=null&&a.sc[s.id]!==''){t+=+a.sc[s.id];m+=a.max;}});return m?t/m*100:null;}
function attRec(d,cls){return DA.rec('att_'+d+'_'+cls);}
function attPct(s,days){var n=0,ab=0;days.forEach(function(d){var r=attRec(d,s.cls);if(!r)return;n++;if(r.abs.indexOf(s.id)>=0)ab++;});return n?100-ab/n*100:100;}
function clsAtt(cls,d){var r=attRec(d,cls),n=students(cls).length;if(!r)return null;return {n:n,a:r.abs.length,l:(r.late||[]).length,p:A.pct(n-r.abs.length,n)};}
function recentDays(n){return I.schoolDays(new Date(A.workday()+'T08:00:00'),n||20);}
function nextDay(){var d=new Date();if(I.isSchool(d))return DA.today();while(!I.isSchool(d))d=I.addD(d,1);return I.iso(d);}
function lessonFor(cls,d){var L=DA.list('les',function(l){return l.cls===cls;}).sort(function(a,b){return a.d<b.d?-1:1;});return L.filter(function(l){return l.d>=d;})[0]||L[L.length-1];}
function clsSeg(cur,attr){return '<div class="seg" role="tablist">'+classes().map(function(c){return '<button data-'+attr+'="'+c.id+'" aria-pressed="'+(c.id===cur)+'">'+esc(c.short)+'</button>';}).join('')+'</div>';}
function clsOpts(){return classes().map(function(c){return [c.id,c.name];});}
function stuOpts(){return students().map(function(s){return [s.id,s.name+' · '+C(s.cls).short];});}
function lvChip(p){if(p==null)return '<span class="lv">—</span>';var l=I.level(p);return '<span class="lv '+l+'" title="'+I.LVN[l]+'">'+l+'</span>';}
var curCls=null;function cc(){if(!curCls||!DA.rec(curCls))curCls=(classes()[0]||{}).id;return curCls;}
I.searchItems=function(){var o=[];students().forEach(function(s){o.push({t:s.name,s:'طالب/ة · '+C(s.cls).name,h:'#/stu/'+s.id,i:'student',c:C(s.cls).color,g:'الطلبة'});});
  DA.list('les').forEach(function(l){o.push({t:l.title,s:'درس · '+l.unit+' · '+C(l.cls).short,h:'#/prep/'+l.id,i:'note',c:'var(--k2)',g:'الدروس'});});return o;};

/* =================== الرئيسية =================== */
P.home=function(){var me=A.me(),td=A.tod(),ps=A.periodState(),nd=nextDay(),isT=nd===DA.today(),di=I.dayIdx(nd),g=(DA.rec('tt')||{}).grid||[],row=g[di]||[];
  var cnt=row.filter(Boolean).length,hwOpen=DA.list('hw',function(h){return h.due>=DA.today();}).length;
  var first=String(me.short).replace(/^أ\.\s*/,'').split(' ')[0];
  var h='<div class="bento">';
  /* الغلاف الحيّ */
  h+='<section class="card living" data-tod="'+td.k+'">'+A.scene('garden')+'<div class="lin"><div><span class="eyebrow">'+A.mark('x')+esc(me.school)+' · '+esc(me.title)+'</span>'+
   '<h1>'+DA.greet()+'،<br><em>أ. '+esc(first)+'</em></h1><p class="sub">'+(isT?(cnt?'لديكِ اليوم '+cnt+' حصص':'لا حصص لديكِ اليوم'):'يومكِ الدراسي القادم '+esc(A.dayName(nd))+' وفيه '+cnt+' حصص')+(hwOpen?'، و'+hwOpen+' واجبات مفتوحة للتسليم':'')+'.</p></div>'+
   '<div class="when"><span>'+ic('cal')+esc(A.fmt(DA.today()))+'</span><span>'+ic('moon')+esc(A.hijri())+'</span><span>'+ic('clock')+'<b data-clock></b> · '+esc(A.periodNow())+'</span></div>'+
   '<div class="hact"><a class="btn gold" href="#/att">'+ic('check')+' تحضير الطلبة</a><a class="btn ghost" href="#/prep">'+ic('note')+' خطط الدروس</a><a class="btn ghost" href="#/tools">'+ic('wheel')+' عجلة الأسماء</a></div></div></section>';
  /* الحصة الآن */
  var curP=ps.state==='in'?ps.i:ps.state==='gap'||ps.state==='before'?ps.i:-1,slot=isT&&curP>=0?row[curP]:null,les=slot?lessonFor(slot.cls,DA.today()):null;
  var lbl=!isT?'اليوم عطلة':ps.state==='in'?'الحصة '+(ps.i+1)+' الآن':ps.state==='gap'||ps.state==='before'?'تبدأ الحصة '+(ps.i+1)+' بعد':'انتهى اليوم الدراسي';
  var nxt=null;if(isT&&ps.state!=='after'){for(var i=(ps.state==='in'?ps.i+1:Math.max(0,ps.i));i<7;i++)if(row[i]){nxt=[i,row[i]];break;}}else{for(i=0;i<7;i++)if(row[i]){nxt=[i,row[i]];break;}}
  h+='<div class="card now s4 r2"><div class="ctitle"><span class="ic2">'+ic('clock')+'</span><h3>الحصة الآن</h3></div><div class="big"><div class="pring" style="--p:'+(ps.state==='in'?ps.pct:0)+'"><div><b>'+(isT&&ps.left!=null?ps.left:'—')+'</b><small>'+(isT&&ps.left!=null?'دقيقة':'')+'</small></div></div><div style="min-width:0"><div class="lbl">'+esc(lbl)+'</div>'+
   '<div class="ttl">'+(slot?(slot.k==='act'?'نشاط ':'رياضيات ')+esc(C(slot.cls).name):isT&&ps.state==='in'?'حصة فراغ':'استراحة')+'</div>'+(les&&slot&&slot.k!=='act'?'<small class="muted">'+esc(les.title)+'</small>':'')+'</div></div>'+
   (nxt?'<div class="nx">'+ic('left')+'<span>'+(isT?'التالية':'أول حصة '+esc(A.dayName(nd)))+': الحصة '+(nxt[0]+1)+' · '+esc(C(nxt[1].cls).short)+' · '+I.PERIODS[nxt[0]][0]+'</span></div>':'')+
   (slot?'<a class="btn gold block" href="#/att/'+slot.cls+'">'+ic('check')+' حضّري '+esc(C(slot.cls).short)+' الآن</a>':'<a class="btn ghost block" href="#/tt">'+ic('grid')+' جدولي الأسبوعي</a>')+
   '<div class="nx" style="background:transparent">'+ic('bulb')+'<span class="muted" style="font-size:12.5px">نصيحة: اضغطي Ctrl K للبحث عن أي طالب أو درس.</span></div></div>';
  /* خط اليوم */
  h+='<div class="card s12"><div class="ctitle"><span class="ic2">'+ic('grid')+'</span><h3>'+(isT?'يومي':'يوم '+esc(A.dayName(nd))+' القادم')+'</h3><span class="sp"></span><a class="btn ghost sm" href="#/tt">الجدول الكامل</a></div><div class="dayline">'+
   I.PERIODS.map(function(p,i){var s=row[i],cur=isT&&ps.state==='in'&&ps.i===i,done=isT&&(ps.state==='after'||((ps.state==='in'||ps.state==='gap')&&i<ps.i));
     return (i===3?'<div class="brk">الفسحة</div>':'')+'<a href="'+(s?'#/att/'+s.cls:'#/tt')+'" class="pd'+(s?'':' free')+(cur?' cur':'')+(done?' done':'')+'" style="text-decoration:none;color:inherit;'+(s?'--c:'+C(s.cls).color:'')+'"><span class="n">'+(i+1)+'</span><b>'+(s?(s.k==='act'?'نشاط · ':'')+esc(C(s.cls).short):'فراغ')+'</b><small>'+p[0]+' – '+p[1]+'</small></a>';}).join('')+'</div></div>';
  /* المؤشرات */
  var S=students(),days=recentDays(20),wd=A.workday(),pres=0,tot=0;classes().forEach(function(c){var a=clsAtt(c.id,wd);if(a){pres+=a.n-a.a;tot+=a.n;}});
  var pcts=S.map(stuPct).filter(function(x){return x!=null;}),avg=pcts.reduce(function(a,b){return a+b;},0)/(pcts.length||1);
  var trend=days.slice(-10).map(function(d){var p=0,n=0;classes().forEach(function(c){var a=clsAtt(c.id,d);if(a){p+=a.n-a.a;n+=a.n;}});return n?p/n*100:100;});
  var sTr=classes().map(function(c){return asms(c.id);});var aTr=[0,1,2,3,4,5].map(function(j){var t=0,m=0;sTr.forEach(function(L){var a=L[j];if(a)Object.keys(a.sc).forEach(function(k){t+=+a.sc[k];m+=a.max;});});return m?t/m*100:0;});
  h+=A.kc('users','--k8',S.length,'','طلابي',classes().length+' شعب · '+S.filter(function(s){return !s.b;}).length+' طالبة')+
   A.kc('check','--k1',A.pct(pres,tot)+'٪','','حضور '+(A.isToday(wd)?'اليوم':esc(A.short(wd))),(tot-pres)+' غياب',trend)+
   A.kc('chart','--k4',avg.toFixed(0)+'٪','','متوسط الإتقان','<b>'+pcts.filter(function(p){return p>=80;}).length+'</b> طالبًا متمكنًا فأعلى',aTr)+
   A.kc('book','--k3',hwOpen,'','واجبات مفتوحة',DA.list('hw').length+' واجبًا هذا الفصل');
  /* مهامي */
  var TK=DA.list('task').sort(function(a,b){return (a.done?1:0)-(b.done?1:0)||(a.c||0)-(b.c||0);});
  h+='<div class="card s4"><div class="ctitle"><span class="ic2">'+ic('tasks')+'</span><h3>مهامي</h3><span class="sp"></span><button class="ib" data-tadd aria-label="إضافة مهمة">'+ic('plus')+'</button></div><div class="todo">'+
   (TK.length?TK.map(function(t){return '<label class="'+(t.done?'dn':'')+'"><input type="checkbox" data-tk="'+t.id+'"'+(t.done?' checked':'')+'><span>'+esc(t.txt)+'</span><button class="ib" data-tdel="'+t.id+'" aria-label="حذف" style="width:28px;height:28px">'+ic('x')+'</button></label>';}).join(''):A.empty('لا مهام. أضيفي مهمة.','tasks'))+'</div></div>';
  /* أبطال النجوم */
  var top=S.slice().sort(function(a,b){return (b.stars||0)-(a.stars||0);}).slice(0,5);
  h+='<div class="card s4"><div class="ctitle"><span class="ic2">'+ic('star')+'</span><h3>أبطال النجوم</h3><span class="sp"></span><a class="btn ghost sm" href="#/stars">الكل</a></div><div class="lead">'+
   top.map(function(s,i){return '<div class="lr"><span class="n">'+(i+1)+'</span>'+A.av(Object.assign({},s,{color:C(s.cls).color}),'sm')+'<b>'+esc(s.name.split(' ').slice(0,2).join(' '))+'</b><small class="muted">'+esc(C(s.cls).short)+'</small><span class="st">'+A.star+(s.stars||0)+'</span></div>';}).join('')+'</div></div>';
  /* القادم */
  var EV=DA.list('ev',function(e){return e.d>=DA.today();}).sort(function(a,b){return a.d<b.d?-1:1;}).slice(0,4);
  h+='<div class="card s4"><div class="ctitle"><span class="ic2">'+ic('cal')+'</span><h3>القادم</h3><span class="sp"></span><button class="ib" data-eadd aria-label="إضافة موعد">'+ic('plus')+'</button></div><div class="up">'+
   (EV.length?EV.map(function(e){return '<div class="u">'+A.dbox(e.d)+'<div style="flex:1;min-width:0"><b>'+esc(e.title)+'</b><small>'+esc(A.rel(e.d))+(e.cls?' · '+esc(C(e.cls).short):'')+'</small></div><button class="ib" data-eed="'+e.id+'" aria-label="تعديل" style="width:30px;height:30px">'+ic('edit')+'</button></div>';}).join(''):A.empty('لا مواعيد قادمة.','cal'))+'</div></div>';
  /* أدوات سريعة واقتباس */
  h+='<div class="card s8"><div class="ctitle"><span class="ic2">'+ic('magic')+'</span><h3>أدوات الحصة</h3></div><div class="tools">'+
   [['tools/wheel','عجلة الأسماء','wheel','--k7'],['tools/timer','المؤقت','timer','--k1'],['tools/groups','المجموعات','group','--k4'],['stars','نجمة لطالب','star','--k2']].map(function(t){return '<a class="tool" href="#/'+t[0]+'" style="--c:var('+t[3]+')"><span class="ti">'+ic(t[2])+'</span>'+esc(t[1])+'</a>';}).join('')+'</div></div>';
  h+='<div class="card qcard s4"><q>'+esc(me.motto)+'</q><small>— '+esc(me.short)+'</small></div>';
  h+='</div>';
  on('[data-tk]','change',function(el){var t=DA.rec(el.dataset.tk);t.done=el.checked;DA.put(t);DA.snd(el.checked?'ok':'tap');});
  on('[data-tdel]','click',function(el,e){e.preventDefault();A.remove(el.dataset.tdel,'المهمة');});
  on('[data-tadd]','click',function(){A.form({title:'مهمة جديدة',fields:[{k:'txt',label:'المهمة',req:1,ph:'مثال: تصحيح أوراق الاختبار'}],onSave:function(v){DA.put({K:'task',txt:v.txt,done:false,d:DA.today()});}});});
  function evForm(r){A.form({title:r?'تعديل الموعد':'موعد جديد',data:r||{d:DA.today()},fields:[{k:'title',label:'العنوان',req:1},{k:'d',label:'التاريخ',type:'date',req:1,half:'open'},{k:'cls',label:'الشعبة',type:'select',opts:[['','—']].concat(clsOpts()),half:'close'}],del:r?function(){A.remove(r.id,'الموعد');}:null,onSave:function(v){DA.put(Object.assign({K:'ev'},r||{},v));}});}
  on('[data-eadd]','click',function(){evForm();});on('[data-eed]','click',function(el){evForm(DA.rec(el.dataset.eed));});
  A.bind(function(m){var c=$('[data-clock]',m);if(!c)return;function t(){c.textContent=new Date().toLocaleTimeString('ar-OM',{hour:'2-digit',minute:'2-digit'});}t();});
  return h;};

/* =================== جدولي =================== */
P.tt=function(){var g=(DA.rec('tt')||{}).grid||[],di=I.dayIdx(DA.today()),cnt={};
  g.forEach(function(r){r.forEach(function(s){if(s)cnt[s.cls]=(cnt[s.cls]||0)+1;});});var tot=Object.keys(cnt).reduce(function(a,k){return a+cnt[k];},0);
  var h=A.phd('tt','نصابكِ '+tot+' حصة أسبوعيًا · اضغطي أي خانة لتعديلها');
  h+='<div class="fbar">'+classes().map(function(c){return '<span class="chip" style="background:color-mix(in srgb,'+c.color+' 14%,transparent);color:'+c.color+'"><i style="width:8px;height:8px;border-radius:50%;background:'+c.color+';display:inline-block"></i> '+esc(c.name)+' · '+(cnt[c.id]||0)+'</span>';}).join('')+'</div>';
  h+='<div class="card" style="padding:12px"><div class="tbl-w"><table class="tbl tt2"><thead><tr><th>اليوم</th>'+I.PERIODS.map(function(p,i){return '<th style="text-align:center">'+(i+1)+'<br><small class="muted" style="font-weight:500">'+p[0]+'</small></th>';}).join('')+'</tr></thead><tbody>'+
   I.DAYS.map(function(dn,d){return '<tr'+(d===di?' style="background:var(--a-soft)"':'')+'><td><b>'+dn+'</b>'+(d===di?' <span class="chip gold" style="font-size:10px">اليوم</span>':'')+'</td>'+I.PERIODS.map(function(p,i){var s=g[d]&&g[d][i];
     return '<td style="text-align:center;padding:4px"><button class="ttc" data-tc="'+d+'-'+i+'" style="width:100%;min-height:48px;border-radius:12px;border:1px '+(s?'solid transparent':'dashed var(--line)')+';background:'+(s?'color-mix(in srgb,'+C(s.cls).color+' 16%,transparent)':'transparent')+';color:'+(s?C(s.cls).color:'var(--muted)')+';font-weight:700;font-family:var(--fh)">'+(s?esc(C(s.cls).short)+(s.k==='act'?'<br><small style="font-weight:500">نشاط</small>':''):'·')+'</button></td>';}).join('')+'</tr>';}).join('')+'</tbody></table></div></div>';
  on('[data-tc]','click',function(el){var p=el.dataset.tc.split('-'),d=+p[0],i=+p[1],r=DA.rec('tt'),s=r.grid[d][i];
    A.form({title:I.DAYS[d]+' · الحصة '+(i+1),data:{cls:s?s.cls:'',k:s?s.k:'ma'},fields:[{k:'cls',label:'الشعبة',type:'select',opts:[['','فراغ']].concat(clsOpts())},{k:'k',label:'النوع',type:'select',opts:[['ma','رياضيات'],['act','نشاط']]}],
     onSave:function(v){r.grid[d][i]=v.cls?{cls:v.cls,k:v.k}:null;DA.put(r);DA.toast('حُدّث الجدول');}});});
  return h;};

/* =================== التحضير =================== */
var prepF='';
function lesText(l){return 'الدرس: '+l.title+'\nالوحدة: '+l.unit+'\nالصف: '+C(l.cls).name+'\nالتاريخ: '+A.fmt(l.d)+'\n\nالأهداف:\n'+(l.obj||[]).map(function(o,i){return (i+1)+'. '+o;}).join('\n')+'\n\nالتهيئة: '+(l.warm||'')+'\n\nالأنشطة:\n'+(l.acts||[]).map(function(o){return '- '+o;}).join('\n')+'\n\nالوسائل: '+(l.tools||'')+'\nالتقويم: '+(l.asm||'')+'\nالواجب: '+(l.hw||'');}
function lesForm(l){l=l||{};A.form({title:l.id?'تعديل خطة الدرس':'خطة درس جديدة',wide:1,data:Object.assign({d:nextDay(),st:'plan',cls:cc(),unit:I.UNITS[0]},l,{obj:(l.obj||[]).join('\n'),acts:(l.acts||[]).join('\n')}),
  fields:[{k:'title',label:'عنوان الدرس',req:1},{k:'unit',label:'الوحدة',type:'select',opts:I.UNITS,half:'open'},{k:'cls',label:'الشعبة',type:'select',opts:clsOpts(),half:'close'},{k:'d',label:'التاريخ',type:'date',half:'open'},{k:'st',label:'الحالة',type:'select',opts:[['plan','قادم'],['done','منفّذ']],half:'close'},
   {k:'obj',label:'الأهداف (هدف في كل سطر)',type:'lines',req:1},{k:'warm',label:'التهيئة'},{k:'acts',label:'الأنشطة (نشاط في كل سطر)',type:'lines'},{k:'tools',label:'الوسائل',half:'open'},{k:'asm',label:'التقويم',half:'close'},{k:'hw',label:'الواجب'}],
  del:l.id?function(){A.remove(l.id,'الخطة');location.hash='#/prep';}:null,
  onSave:function(v){var x=DA.put(Object.assign({K:'les'},l,v));DA.toast(l.id?'حُفظت الخطة':'أُضيفت خطة «'+v.title+'»');}});}
/* حقل textarea لنوع lines */
(function(){var f0=A.form;A.form=function(o){o.fields.forEach(function(f){if(f.type==='lines'){f.type='textarea';f._lines=1;}});var on0=o.onSave;o.onSave=function(v){o.fields.forEach(function(f){if(f._lines&&typeof v[f.k]==='string')v[f.k]=v[f.k].split('\n').map(function(x){return x.trim();}).filter(Boolean);});return on0(v);};return f0(o);};})();
P.prep=function(a){if(a&&DA.rec(a))return prepOne(DA.rec(a));
  var L=DA.list('les',function(l){return !prepF||l.cls===prepF;}).sort(function(x,y){return x.d<y.d?-1:1;}),up=L.filter(function(l){return l.st!=='done';}),dn=L.filter(function(l){return l.st==='done';}).reverse();
  var h=A.phd('prep','كل خطة جاهزة للنسخ بندًا بندًا إلى «نور»','<button class="btn gold" data-ladd>'+ic('plus')+' خطة درس</button>');
  h+='<div class="fbar"><button class="fchip" data-pf="" aria-pressed="'+(!prepF)+'">كل الشعب</button>'+classes().map(function(c){return '<button class="fchip" data-pf="'+c.id+'" aria-pressed="'+(prepF===c.id)+'">'+esc(c.name)+'</button>';}).join('')+'<span class="sp"></span><span class="chip">'+up.length+' قادم · '+dn.length+' منفّذ</span></div>';
  function card(l){return '<article class="card ent'+(l.st==='done'?' done':'')+'" style="--c:'+C(l.cls).color+'"><div class="eh"><span class="ei">'+ic('note')+'</span><div style="flex:1;min-width:0"><small>'+esc(l.unit)+'</small><b>'+esc(l.title)+'</b><small>'+esc(C(l.cls).name)+' · '+esc(A.rel(l.d))+'</small></div></div>'+
    '<p>'+(l.obj||[]).slice(0,2).map(function(o){return '• '+esc(o);}).join('<br>')+'</p><div class="ef"><span class="chip '+(l.st==='done'?'good':'gold')+'">'+(l.st==='done'?'منفّذ':'قادم')+'</span><span class="sp"></span><button class="ib" data-lcp="'+l.id+'" aria-label="نسخ الخطة كاملة" title="نسخ الكل">'+ic('copy')+'</button><a class="btn ghost sm" href="#/prep/'+l.id+'">فتح الخطة</a></div></article>';}
  h+='<div class="sec-t">الدروس القادمة</div>'+(up.length?'<div class="gridc">'+up.map(card).join('')+'</div>':A.empty('لا دروس قادمة. أضيفي خطة.','note'));
  h+='<div class="sec-t">الدروس المنفّذة</div>'+(dn.length?'<div class="gridc">'+dn.map(card).join('')+'</div>':A.empty('لا دروس منفّذة بعد.','note'));
  on('[data-pf]','click',function(el){prepF=el.dataset.pf;A.refresh();});
  on('[data-ladd]','click',function(){lesForm();});
  on('[data-lcp]','click',function(el){A.copy(lesText(DA.rec(el.dataset.lcp)));});
  return h;};
function prepOne(l){var items=[['الأهداف',(l.obj||[]).map(function(o,i){return (i+1)+'. '+o;}).join('\n')],['التهيئة',l.warm],['الأنشطة',(l.acts||[]).map(function(o){return '- '+o;}).join('\n')],['الوسائل',l.tools],['التقويم',l.asm],['الواجب',l.hw]];
  var h='<div class="row" style="margin-top:16px"><a class="btn ghost sm" href="#/prep">'+ic('right')+' كل الخطط</a></div>'+
   '<header class="phd" style="--tc2:'+C(l.cls).color+'"><div class="glyph">'+ic('note')+'</div><div class="tx"><div class="eb">'+esc(l.unit)+'</div><h1>'+esc(l.title)+'</h1><p>'+esc(C(l.cls).name)+' · '+esc(A.fmt(l.d))+'</p></div><div class="bx"><button class="btn ghost" data-led>'+ic('edit')+' تعديل</button><button class="btn gold" data-all>'+ic('copy')+' نسخ الكل</button></div></header>';
  h+='<div class="cols eq"><div class="card"><div class="ctitle"><span class="ic2">'+ic('copy')+'</span><h3>بنود الخطة · لكل بند زر نسخ</h3></div>'+items.map(function(x,i){return '<div class="cp"><div class="ct"><b>'+x[0]+'</b>'+esc(x[1]||'—')+'</div><button class="btn ghost sm" data-ci="'+i+'">'+ic('copy')+' نسخ</button></div>';}).join('')+'</div>'+
   '<div class="stack"><div class="card"><div class="ctitle"><span class="ic2">'+ic('check')+'</span><h3>حالة الدرس</h3></div><div class="seg"><button data-st="plan" aria-pressed="'+(l.st!=='done')+'">قادم</button><button data-st="done" aria-pressed="'+(l.st==='done')+'">منفّذ</button></div>'+
   '<p class="muted" style="font-size:13px;margin-top:10px">عند تنفيذ الدرس غيّري حالته، ويظهر في «المنفّذة» وفي تقرير الإنجاز.</p></div>'+
   '<div class="card"><div class="ctitle"><span class="ic2">'+ic('users')+'</span><h3>'+esc(C(l.cls).name)+'</h3></div><p class="muted" style="margin:0 0 10px">'+students(l.cls).length+' طالبًا · آخر حضور '+((clsAtt(l.cls,A.workday())||{}).p||100)+'٪</p><div class="row"><a class="btn ghost sm" href="#/att/'+l.cls+'">'+ic('check')+' الحضور</a><a class="btn ghost sm" href="#/tools/wheel">'+ic('wheel')+' عجلة الأسماء</a></div></div></div></div>';
  on('[data-ci]','click',function(el){var x=items[+el.dataset.ci];A.copy(x[1]||'');});
  on('[data-all]','click',function(){A.copy(lesText(l));});
  on('[data-led]','click',function(){lesForm(DA.rec(l.id));});
  on('[data-st]','click',function(el){var r=DA.rec(l.id);r.st=el.dataset.st;DA.put(r);DA.toast(r.st==='done'?'سُجّل الدرس منفّذًا':'أُعيد إلى القادمة');});
  return h;}

/* =================== الحضور =================== */
var attD=null;
P.att=function(a){if(a&&DA.rec(a)&&DA.rec(a).K==='cls')curCls=a;var cls=cc(),d=attD||A.workday(),S=students(cls),r=attRec(d,cls)||{abs:[],late:[]},ab=r.abs||[],lt=r.late||[];
  var days=recentDays(20),pc=days.map(function(x){var q=clsAtt(cls,x);return q?q.p:100;});
  var h=A.phd('att','اضغطي على الطالب: حاضر ← غائب ← متأخر','<input type="date" class="in" data-ad value="'+d+'" style="width:auto">');
  h+='<div class="fbar">'+clsSeg(cls,'ac')+'<span class="sp"></span><span class="chip good">حاضر '+(S.length-ab.length)+'</span><span class="chip bad">غائب '+ab.length+'</span><span class="chip warn">متأخر '+lt.length+'</span></div>';
  h+='<div class="sgrid">'+S.map(function(s){var st=ab.indexOf(s.id)>=0?'a':lt.indexOf(s.id)>=0?'l':'';return '<button class="sbox '+st+'" data-as="'+s.id+'">'+(st?'<span class="flag" style="background:var(--'+(st==='a'?'bad':'warn')+')">'+(st==='a'?'غ':'ت')+'</span>':'')+A.av(Object.assign({},s,{color:C(s.cls).color}))+'<b>'+esc(s.name.split(' ').slice(0,2).join(' '))+'</b><small>'+(st==='a'?'غائب':st==='l'?'متأخر':'حاضر')+'</small></button>';}).join('')+'</div>';
  h+='<div class="row" style="margin-top:14px;flex-wrap:wrap"><button class="btn ghost" data-allp>'+ic('check')+' الكل حاضر</button>'+(ab.length?'<button class="btn ghost" data-wa>'+ic('wa')+' رسالة غياب لأولياء الأمور</button>':'')+'</div>';
  var chronic=S.map(function(s){return [s,100-attPct(s,days)];}).filter(function(x){return x[1]>=10;}).sort(function(a,b){return b[1]-a[1];});
  h+='<div class="cols eq" style="margin-top:16px"><div class="card" style="--c:'+C(cls).color+'"><div class="ctitle"><span class="ic2">'+ic('chart')+'</span><h3>حضور الشعبة آخر 20 يومًا</h3><span class="sp"></span><b style="font-family:var(--fh);color:var(--hd)">'+(pc.reduce(function(a,b){return a+b;},0)/pc.length).toFixed(1)+'٪</b></div>'+A.spark(pc,70)+'</div>'+
   '<div class="card"><div class="ctitle"><span class="ic2">'+ic('warn')+'</span><h3>غياب متكرر</h3></div>'+(chronic.length?chronic.map(function(x){return '<div class="row" style="padding:6px 0;border-bottom:1px dashed var(--line)">'+A.av(Object.assign({},x[0],{color:C(cls).color}),'sm')+'<b style="flex:1;font-size:14px;font-weight:600">'+esc(x[0].name)+'</b><span class="chip bad">'+x[1].toFixed(0)+'٪ غياب</span></div>';}).join(''):A.empty('لا غياب متكرر في الشعبة.','check'))+'</div></div>';
  function save(fn){var x=attRec(d,cls)||{id:'att_'+d+'_'+cls,K:'att',d:d,cls:cls,abs:[],late:[]};x.abs=x.abs||[];x.late=x.late||[];fn(x);DA.put(x);}
  on('[data-ac]','click',function(el){curCls=el.dataset.ac;A.refresh();});
  on('[data-ad]','change',function(el){attD=el.value||null;A.refresh();});
  on('[data-as]','click',function(el){var id=el.dataset.as;save(function(x){var ia=x.abs.indexOf(id),il=x.late.indexOf(id);if(ia<0&&il<0)x.abs.push(id);else if(ia>=0){x.abs.splice(ia,1);x.late.push(id);}else x.late.splice(il,1);});DA.snd('tap');});
  on('[data-allp]','click',function(){save(function(x){x.abs=[];x.late=[];});DA.toast('سُجّل الجميع حاضرين');});
  on('[data-wa]','click',function(){A.wa('السلام عليكم ورحمة الله،\nنود إشعاركم بغياب ابنكم/ابنتكم عن حصة الرياضيات اليوم '+A.fmt(d)+'، ونتمنى له الصحة والعافية.\n'+A.me().short+' · '+A.me().school);});
  return h;};

/* =================== طلابي =================== */
var stuQ='';
P.stu=function(a){if(a&&DA.rec(a)&&DA.rec(a).K==='stu'){var s0=DA.rec(a);curCls=s0.cls;setTimeout(function(){stuDlg(s0.id);},60);}
  var cls=cc(),S=students(cls).filter(function(s){return !stuQ||s.name.indexOf(stuQ)>=0;}),days=recentDays(20);
  var h=A.phd('stu','ملف كل طالب: الدرجات والحضور والنجوم والملاحظات','<button class="btn gold" data-sadd>'+ic('plus')+' طالب جديد</button>');
  h+='<div class="fbar">'+clsSeg(cls,'sc')+'<span class="sp"></span><label class="search" style="max-width:260px">'+ic('search')+'<input type="search" placeholder="بحث بالاسم" value="'+esc(stuQ)+'" data-sq></label></div>';
  var lv={A:0,B:0,C:0,D:0,E:0};students(cls).forEach(function(s){var p=stuPct(s);if(p!=null)lv[I.level(p)]++;});
  h+='<div class="card" style="padding:14px;margin-bottom:14px"><div class="row" style="gap:6px;flex-wrap:wrap">'+Object.keys(lv).map(function(k){return '<span class="lv '+k+'" style="padding:4px 10px">'+k+' · '+I.LVN[k]+' · '+lv[k]+'</span>';}).join('')+'</div></div>';
  h+=S.length?'<div class="sgrid">'+S.map(function(s){var p=stuPct(s);return '<button class="sbox" data-sv="'+s.id+'">'+A.av(Object.assign({},s,{color:C(s.cls).color}))+'<b>'+esc(s.name.split(' ').slice(0,2).join(' '))+'</b><small>'+(p!=null?p.toFixed(0)+'٪ ':'')+lvChip(p)+'</small><span class="stc">'+A.star+(s.stars||0)+'</span></button>';}).join('')+'</div>':A.empty('لا نتائج.','users');
  on('[data-sc]','click',function(el){curCls=el.dataset.sc;A.refresh();});
  on('[data-sq]','input',function(el){stuQ=el.value.trim();clearTimeout(el._t);el._t=setTimeout(function(){A.refresh();var i=$('[data-sq]');if(i){i.focus();i.setSelectionRange(i.value.length,i.value.length);}},250);});
  on('[data-sv]','click',function(el){stuDlg(el.dataset.sv);});
  on('[data-sadd]','click',function(){stuForm();});
  return h;};
function stuForm(s){s=s||{};A.form({title:s.id?'تعديل بيانات الطالب':'طالب جديد',data:Object.assign({cls:cc(),b:1},s),fields:[{k:'name',label:'الاسم الثلاثي',req:1},{k:'cls',label:'الشعبة',type:'select',opts:clsOpts(),half:'open'},{k:'b',label:'النوع',type:'select',opts:[[1,'طالب'],[0,'طالبة']],half:'close'},{k:'note',label:'ملاحظات',type:'textarea'}],
  del:s.id?function(){A.remove(s.id,'الطالب');}:null,onSave:function(v){v.b=+v.b;DA.put(Object.assign({K:'stu',stars:0,badges:[]},s,v));DA.toast(s.id?'حُفظت البيانات':'أُضيف '+v.name);}});}
function stuDlg(id){var s=DA.rec(id);if(!s)return;var p=stuPct(s),days=recentDays(20),ap=attPct(s,days),L=asms(s.cls),pl=DA.list('plan',function(x){return x.stu===id;});
  var d=DA.dlg('<div class="row" style="gap:14px;align-items:center">'+A.av(Object.assign({},s,{color:C(s.cls).color}),'lg')+'<div style="flex:1;min-width:0"><h2 style="margin:0">'+esc(s.name)+'</h2><small class="muted">'+esc(C(s.cls).name)+'</small></div></div>'+
   '<div class="kpis" style="grid-template-columns:repeat(3,1fr);margin:14px 0"><div class="stat"><span><b>'+(p!=null?p.toFixed(0)+'٪':'—')+'</b><small>الإتقان '+lvChip(p)+'</small></span></div><div class="stat"><span><b>'+ap.toFixed(0)+'٪</b><small>الحضور</small></span></div><div class="stat"><span><b>'+(s.stars||0)+'</b><small>نجمة</small></span></div></div>'+
   '<h3 style="font-size:15px;margin:8px 0">الدرجات</h3><div class="tbl-w"><table class="tbl"><tbody>'+L.map(function(a){var v=a.sc&&a.sc[id];return '<tr><td>'+esc(a.title)+'</td><td style="text-align:center"><b>'+(v!=null&&v!==''?v:'—')+'</b> / '+a.max+'</td></tr>';}).join('')+'</tbody></table></div>'+
   ((s.badges||[]).length?'<h3 style="font-size:15px;margin:12px 0 6px">الأوسمة</h3><div class="row">'+s.badges.map(function(b){var x=I.BADGES.filter(function(y){return y[0]===b;})[0];return x?'<span class="chip" style="background:'+x[3]+';color:#fff">'+ic(x[2])+' '+esc(x[1])+'</span>':'';}).join('')+'</div>':'')+
   (pl.length?'<h3 style="font-size:15px;margin:12px 0 6px">خطة فردية</h3>'+pl.map(function(x){return '<div class="row"><span class="chip '+(x.kind==='rem'?'warn':'good')+'">'+(x.kind==='rem'?'علاجية':'إثرائية')+'</span><b style="font-size:14px">'+esc(x.skill)+'</b><span class="sp"></span>'+x.prog+'٪</div>';}).join(''):'')+
   '<label class="field" style="margin-top:12px"><span>ملاحظات المعلمة</span><textarea class="in" data-nt>'+esc(s.note||'')+'</textarea></label>'+
   '<div class="acts" style="flex-wrap:wrap"><button class="btn ghost sm" data-se>'+ic('edit')+' البيانات</button><button class="btn ghost sm" data-sw>'+ic('wa')+' وليّ الأمر</button><button class="btn ghost sm" data-sp>'+ic('target')+' خطة فردية</button><span class="sp"></span><button class="btn ghost" data-close>إغلاق</button><button class="btn gold" data-ss>'+A.star.replace('<svg','<svg style="width:16px;height:16px;fill:currentColor"')+' نجمة</button></div>',{wide:1});
  $('[data-ss]',d).onclick=function(){var r=DA.rec(id);r.stars=(r.stars||0)+1;DA.put(r);DA.snd('ok');DA.toast('⭐ نجمة لـ'+r.name.split(' ')[0]);d.close();};
  $('[data-nt]',d).onchange=function(e){var r=DA.rec(id);r.note=e.target.value;DA.put(r);DA.toast('حُفظت الملاحظة');};
  $('[data-se]',d).onclick=function(){d.close();stuForm(DA.rec(id));};
  $('[data-sw]',d).onclick=function(){A.wa('السلام عليكم ورحمة الله،\nنطمئنكم على ابنكم/ابنتكم '+s.name.split(' ')[0]+': مستوى الإتقان في الرياضيات '+(p!=null?p.toFixed(0)+'٪':'—')+' ونسبة الحضور '+ap.toFixed(0)+'٪، وحصل على '+(s.stars||0)+' نجمة. شكرًا لمتابعتكم.\n'+A.me().short);};
  $('[data-sp]',d).onclick=function(){d.close();planForm({stu:id,kind:p!=null&&p>=88?'enr':'rem'});};}

/* =================== سجل الدرجات =================== */
P.grades=function(a){if(a&&DA.rec(a))curCls=a;var cls=cc(),S=students(cls),L=asms(cls);
  var h=A.phd('grades','اكتبي الدرجة في الخانة وتُحفظ فورًا، والتحليل يتحدّث معها','<button class="btn gold" data-gadd>'+ic('plus')+' تقويم جديد</button>');
  h+='<div class="fbar">'+clsSeg(cls,'gc')+'</div>';
  var P2=S.map(function(s){return [s,stuPct(s)];}),vals=P2.map(function(x){return x[1];}).filter(function(x){return x!=null;}),avg=vals.reduce(function(x,y){return x+y;},0)/(vals.length||1);
  var lv={A:0,B:0,C:0,D:0,E:0};vals.forEach(function(v){lv[I.level(v)]++;});
  var am=L.map(function(a){var t=0,n=0;Object.keys(a.sc||{}).forEach(function(k){if(a.sc[k]!==''&&a.sc[k]!=null){t+=+a.sc[k];n++;}});return [a,n?t/n/a.max*100:0];}),hard=am.slice().sort(function(x,y){return x[1]-y[1];})[0];
  var need=P2.filter(function(x){return x[1]!=null&&x[1]<65;}).sort(function(x,y){return x[1]-y[1];});
  var LC={A:'var(--good)',B:'var(--info)',C:'var(--warn)',D:'var(--bad)',E:'var(--bad)'};
  h+='<div class="bento" style="margin-bottom:16px">'+A.kc('chart','--k4',avg.toFixed(1)+'٪','','متوسط الشعبة',L.length+' تقويمات')+A.kc('award','--k5',A.pct(lv.A+lv.B,vals.length)+'٪','','نسبة الإتقان','متقدم ومتمكن')+
   '<div class="card s6"><div class="ctitle"><span class="ic2">'+ic('layers')+'</span><h3>توزيع المستويات</h3></div><div class="stackbar" style="height:22px;border-radius:12px;overflow:hidden;display:flex">'+Object.keys(lv).map(function(k){return lv[k]?'<i style="flex:'+lv[k]+';background:'+LC[k]+'" title="'+k+'"></i>':'';}).join('')+'</div>'+
   '<div class="row" style="flex-wrap:wrap;gap:6px;margin-top:10px">'+Object.keys(lv).map(function(k){return '<span class="lv '+k+'">'+k+' · '+lv[k]+'</span>';}).join('')+'</div>'+
   (hard?'<p class="muted" style="font-size:13px;margin:10px 0 0">'+ic('info').replace('<svg','<svg style="width:14px;height:14px;vertical-align:-2px"')+' أصعب تقويم: «'+esc(hard[0].title)+'» بمتوسط '+hard[1].toFixed(0)+'٪، يُقترح إعادة تدريس مهارته.</p>':'')+'</div></div>';
  h+='<div class="card" style="padding:8px"><div class="tbl-w"><table class="tbl gtbl"><thead><tr><th>الطالب</th>'+L.map(function(a){return '<th style="text-align:center;min-width:86px"><button class="ib" data-ge="'+a.id+'" style="width:auto;height:auto;padding:4px 6px;font-size:12px;font-weight:700;color:var(--ink2)" title="تعديل التقويم">'+esc(a.title.split(':')[0])+'<br><small class="muted">/ '+a.max+'</small></button></th>';}).join('')+'<th style="text-align:center">المجموع</th><th style="text-align:center">المستوى</th></tr></thead><tbody>'+
   P2.map(function(x){var s=x[0];return '<tr><td style="white-space:nowrap"><button class="ib" data-gs="'+s.id+'" style="width:auto;height:auto;font-weight:600;font-size:13.5px;padding:2px 4px">'+esc(s.name.split(' ').slice(0,2).join(' '))+'</button></td>'+L.map(function(a){var v=a.sc&&a.sc[s.id];return '<td class="sc" style="text-align:center"><input data-g="'+a.id+'|'+s.id+'" inputmode="decimal" value="'+(v!=null?v:'')+'" aria-label="درجة '+esc(s.name)+'"></td>';}).join('')+
    '<td style="text-align:center"><b>'+(x[1]!=null?x[1].toFixed(0)+'٪':'—')+'</b></td><td style="text-align:center">'+lvChip(x[1])+'</td></tr>';}).join('')+'</tbody></table></div></div>';
  if(need.length)h+='<div class="sec-t">يحتاجون دعمًا ('+need.length+')</div><div class="gridc">'+need.map(function(x){var has=DA.list('plan',function(p){return p.stu===x[0].id;}).length;return '<div class="card ent" style="--c:var(--bad)"><div class="eh">'+A.av(Object.assign({},x[0],{color:C(cls).color}))+'<div style="flex:1"><b>'+esc(x[0].name)+'</b><small>'+x[1].toFixed(0)+'٪ · '+I.LVN[I.level(x[1])]+'</small></div></div><div class="ef"><span class="sp"></span>'+(has?'<span class="chip good">'+ic('check')+' له خطة</span>':'<button class="btn ghost sm" data-gp="'+x[0].id+'">'+ic('target')+' خطة علاجية</button>')+'</div></div>';}).join('')+'</div>';
  on('[data-gc]','click',function(el){curCls=el.dataset.gc;A.refresh();});
  on('[data-g]','change',function(el){var p=el.dataset.g.split('|'),a=DA.rec(p[0]),v=el.value.trim().replace(/[٠-٩]/g,function(c){return '٠١٢٣٤٥٦٧٨٩'.indexOf(c);});if(v!==''&&(isNaN(+v)||+v<0||+v>a.max)){DA.toast('الدرجة من 0 إلى '+a.max);el.value=a.sc[p[1]]!=null?a.sc[p[1]]:'';return;}a.sc=a.sc||{};a.sc[p[1]]=v===''?'':+v;DA.put(a);});
  on('[data-g]','keydown',function(el,e){if(e.key==='Enter'){e.preventDefault();var all=$$('[data-g]'),i=all.indexOf(el),n=all.length,cols=L.length;var nx=all[i+cols];if(nx)nx.focus();}});
  on('[data-gadd]','click',function(){asmForm({cls:cls});});
  on('[data-ge]','click',function(el){asmForm(DA.rec(el.dataset.ge));});
  on('[data-gs]','click',function(el){stuDlg(el.dataset.gs);});
  on('[data-gp]','click',function(el){planForm({stu:el.dataset.gp,kind:'rem'});});
  return h;};
function asmForm(a){A.form({title:a.id?'تعديل التقويم':'تقويم جديد',data:Object.assign({d:DA.today(),max:10,type:'quiz'},a),fields:[{k:'title',label:'عنوان التقويم',req:1,ph:'مثال: اختبار قصير ٤: القسمة'},{k:'max',label:'الدرجة العظمى',type:'number',req:1,half:'open'},{k:'d',label:'التاريخ',type:'date',half:'close'},{k:'type',label:'النوع',type:'select',opts:[['quiz','اختبار قصير'],['task','واجب أدائي'],['proj','مشروع'],['oral','أداء شفهي']]}],
  del:a.id?function(){A.remove(a.id,'التقويم');}:null,onSave:function(v){DA.put(Object.assign({K:'asm',sc:{}},a,v));DA.toast(a.id?'حُفظ':'أُضيف عمود «'+v.title+'»');}});}

/* =================== الواجبات =================== */
P.hw=function(){var L=DA.list('hw').sort(function(a,b){return a.due<b.due?1:-1;}),T0=DA.today();
  var h=A.phd('hw','سجّلي من سلّم بلمسة، وتظهر النسبة فورًا','<button class="btn gold" data-hadd>'+ic('plus')+' واجب جديد</button>');
  h+=L.length?'<div class="gridc">'+L.map(function(w){var n=students(w.cls).length,dn=(w.done||[]).length,p=A.pct(dn,n),late=w.due<T0;
    return '<article class="card ent" style="--c:'+C(w.cls).color+'"><div class="eh"><span class="ei">'+ic('book')+'</span><div style="flex:1;min-width:0"><b>'+esc(w.title)+'</b><small>'+esc(C(w.cls).name)+' · التسليم '+esc(A.rel(w.due))+'</small></div></div>'+
     '<div class="row" style="gap:10px"><div style="flex:1">'+A.bar(p,C(w.cls).color)+'</div><b style="font-family:var(--fh);font-size:14px">'+dn+'/'+n+'</b></div><div class="ef"><span class="chip '+(late?(p>=90?'good':'warn'):'info')+'">'+(late?(p>=90?'مكتمل تقريبًا':'انتهى موعده'):'مفتوح')+'</span><span class="sp"></span><button class="btn ghost sm" data-hd="'+w.id+'">'+ic('check')+' التسليم</button><button class="ib" data-he="'+w.id+'" aria-label="تعديل">'+ic('edit')+'</button></div></article>';}).join('')+'</div>':A.empty('لا واجبات بعد.','book');
  on('[data-hadd]','click',function(){hwForm({cls:cc()});});
  on('[data-he]','click',function(el){hwForm(DA.rec(el.dataset.he));});
  on('[data-hd]','click',function(el){var w=DA.rec(el.dataset.hd),S=students(w.cls),set={};(w.done||[]).forEach(function(x){set[x]=1;});
    var d=DA.dlg('<h2>'+esc(w.title)+'</h2><p class="muted" style="margin-top:-6px">'+esc(C(w.cls).name)+' · اضغطي اسم من سلّم</p><div class="sgrid" style="grid-template-columns:repeat(auto-fill,minmax(130px,1fr))">'+S.map(function(s){return '<button class="sbox'+(set[s.id]?'':' l')+'" data-hs="'+s.id+'" style="padding:10px 6px">'+(set[s.id]?'<span class="flag" style="background:var(--good)">✓</span>':'')+'<b>'+esc(s.name.split(' ').slice(0,2).join(' '))+'</b><small>'+(set[s.id]?'سلّم':'لم يسلّم')+'</small></button>';}).join('')+'</div>'+
     '<div class="acts"><button class="btn ghost sm" data-hall style="margin-inline-end:auto">الكل سلّم</button><button class="btn ghost" data-close>إلغاء</button><button class="btn gold" data-hsave>'+ic('check')+' حفظ</button></div>',{wide:1});
    $$('[data-hs]',d).forEach(function(b){b.onclick=function(){var id=b.dataset.hs;set[id]=!set[id];b.classList.toggle('l',!set[id]);b.querySelector('small').textContent=set[id]?'سلّم':'لم يسلّم';var f=b.querySelector('.flag');if(set[id]&&!f)b.insertAdjacentHTML('afterbegin','<span class="flag" style="background:var(--good)">✓</span>');if(!set[id]&&f)f.remove();DA.snd('tap');};});
    $('[data-hall]',d).onclick=function(){S.forEach(function(s){set[s.id]=true;});$$('[data-hs]',d).forEach(function(b){b.classList.remove('l');b.querySelector('small').textContent='سلّم';});};
    $('[data-hsave]',d).onclick=function(){var r=DA.rec(w.id);r.done=Object.keys(set).filter(function(k){return set[k];});DA.put(r);d.close();DA.snd('ok');DA.toast('حُفظ التسليم');};});
  return h;};
function hwForm(w){A.form({title:w.id?'تعديل الواجب':'واجب جديد',data:Object.assign({d:DA.today(),due:I.iso(I.nextSchool(new Date(),2))},w),fields:[{k:'title',label:'الواجب',req:1},{k:'cls',label:'الشعبة',type:'select',opts:clsOpts()},{k:'d',label:'تاريخ الإعطاء',type:'date',half:'open'},{k:'due',label:'موعد التسليم',type:'date',half:'close'}],
  del:w.id?function(){A.remove(w.id,'الواجب');}:null,onSave:function(v){DA.put(Object.assign({K:'hw',done:[]},w,v));DA.toast(w.id?'حُفظ':'أُضيف الواجب');}});}

/* =================== النجوم والتحفيز =================== */
P.stars=function(){var cls=cc(),S=students(cls).sort(function(a,b){return (b.stars||0)-(a.stars||0);}),top=S.slice(0,3),tot=S.reduce(function(a,s){return a+(s.stars||0);},0);
  var h=A.phd('stars','نجمة بلمسة، وأوسمة تُمنح للمتميزين','<button class="btn gold" data-all>'+ic('star')+' نجمة للجميع</button>');
  h+='<div class="fbar">'+clsSeg(cls,'tc')+'<span class="sp"></span><span class="chip gold">'+tot+' نجمة في الشعبة</span></div>';
  if(top.length>=3)h+='<div class="card" style="padding:20px 14px 0;margin-bottom:16px;overflow:hidden"><div class="podium">'+[1,0,2].map(function(i){var s=top[i];return '<div class="pod p'+(i+1)+'">'+A.av(Object.assign({},s,{color:C(cls).color}),'lg')+'<b>'+esc(s.name.split(' ').slice(0,2).join(' '))+'</b><small>'+(s.stars||0)+' ⭐</small><div class="st">'+(i+1)+'</div></div>';}).join('')+'</div></div>';
  h+='<div class="card" style="padding:8px">'+S.map(function(s,i){return '<div class="rank"><span class="n">'+(i+1)+'</span>'+A.av(Object.assign({},s,{color:C(cls).color}),'sm')+'<div style="flex:1;min-width:0"><b style="font-size:14px">'+esc(s.name)+'</b> '+(s.badges||[]).map(function(b){var x=I.BADGES.filter(function(y){return y[0]===b;})[0];return x?'<span title="'+esc(x[1])+'" style="display:inline-grid;place-items:center;width:20px;height:20px;border-radius:6px;background:'+x[3]+';color:#fff;vertical-align:-4px">'+ic(x[2]).replace('<svg','<svg style="width:12px;height:12px"')+'</span>':'';}).join(' ')+'</div><span class="pt">'+(s.stars||0)+' ⭐</span><button class="ib" data-bg="'+s.id+'" aria-label="وسام" title="منح وسام">'+ic('award')+'</button><button class="btn gold sm" data-st1="'+s.id+'" aria-label="نجمة">+1</button></div>';}).join('')+'</div>';
  h+='<div class="sec-t">الأوسمة</div><div class="gridc" style="grid-template-columns:repeat(auto-fill,minmax(200px,1fr))">'+I.BADGES.map(function(b){var n=students().filter(function(s){return (s.badges||[]).indexOf(b[0])>=0;}).length;return '<div class="card ent" style="--c:'+b[3]+';align-items:center;text-align:center"><span class="ei" style="width:54px;height:54px;border-radius:18px;background:'+b[3]+';color:#fff;display:grid;place-items:center">'+ic(b[2])+'</span><b style="font-family:var(--fh)">'+esc(b[1])+'</b><small class="muted">'+n+' طالبًا</small></div>';}).join('')+'</div>';
  on('[data-tc]','click',function(el){curCls=el.dataset.tc;A.refresh();});
  on('[data-st1]','click',function(el){var r=DA.rec(el.dataset.st1);r.stars=(r.stars||0)+1;DA.put(r);DA.snd('ok');DA.toast('⭐ نجمة لـ'+r.name.split(' ')[0]);});
  on('[data-all]','click',function(){A._mute=true;students(cls).forEach(function(s){s.stars=(s.stars||0)+1;DA.put(s);});A._mute=false;A.refresh();DA.snd('ok');DA.toast('نجمة لكل طلبة '+C(cls).short+' ✨');});
  on('[data-bg]','click',function(el){var s=DA.rec(el.dataset.bg);A.form({title:'وسام لـ'+s.name.split(' ')[0],fields:[{k:'b',label:'الوسام',type:'select',opts:I.BADGES.map(function(b){return [b[0],b[1]];})}],onSave:function(v){var r=DA.rec(s.id);r.badges=(r.badges||[]).filter(function(x){return x!==v.b;}).concat([v.b]);DA.put(r);DA.toast('مُنح الوسام 🏅');}});});
  return h;};

/* =================== أدوات الصف =================== */
var tmr={left:300,run:false,t:0,tot:300};
P.tools=function(a){var tab=a||'wheel',cls=cc();
  var h=A.phd('tools','أدوات تفاعلية تُعرض على السبورة');
  h+='<div class="fbar"><div class="seg">'+[['wheel','عجلة الأسماء'],['timer','المؤقت'],['groups','المجموعات']].map(function(x){return '<button data-tt="'+x[0]+'" aria-pressed="'+(x[0]===tab)+'">'+x[1]+'</button>';}).join('')+'</div><span class="sp"></span>'+(tab!=='timer'?clsSeg(cls,'oc'):'')+'</div>';
  if(tab==='wheel'){h+='<div class="cols eq"><div class="card"><div class="wheel-w"><span class="pin2"></span><canvas width="680" height="680" data-wh></canvas></div><div class="winner" data-win>اضغطي «أديري العجلة»</div><div class="row" style="justify-content:center;margin-top:8px"><button class="btn gold" data-spin>'+ic('wheel')+' أديري العجلة</button><label class="row" style="gap:6px;font-size:13px"><input type="checkbox" data-rm checked> لا تكرري الاسم</label></div></div>'+
    '<div class="card"><div class="ctitle"><span class="ic2">'+ic('users')+'</span><h3>من شارك</h3><span class="sp"></span><button class="btn ghost sm" data-wr>'+ic('refresh')+' من جديد</button></div><div data-done class="row" style="flex-wrap:wrap;gap:6px"></div><p class="muted" style="font-size:13px">بعد الاختيار يمكنكِ منح الطالب نجمة مباشرة.</p><button class="btn ghost" data-wst disabled>'+ic('star')+' نجمة للفائز</button></div></div>';
    A.bind(function(m){wheel(m,cls);});}
  else if(tab==='timer'){h+='<div class="card" style="max-width:640px;margin:0 auto;text-align:center;padding:30px 20px"><div class="timer" data-tm>'+fmtT(tmr.left)+'</div><div class="bar2" style="margin:18px 0;--c:var(--a)"><i data-tb style="width:'+(tmr.tot?tmr.left/tmr.tot*100:0)+'%"></i></div>'+
    '<div class="row" style="justify-content:center;flex-wrap:wrap">'+[1,2,3,5,10,15].map(function(n){return '<button class="fchip" data-tp="'+n+'">'+n+' د</button>';}).join('')+'</div><div class="row" style="justify-content:center;margin-top:16px"><button class="btn gold" data-tgo>'+ic(tmr.run?'pause':'play')+' '+(tmr.run?'إيقاف مؤقت':'ابدئي')+'</button><button class="btn ghost" data-trs>'+ic('refresh')+' إعادة</button></div></div>';
    A.bind(function(m){timerBind(m);});}
  else{h+='<div class="card"><div class="row" style="flex-wrap:wrap"><label class="field" style="margin:0"><span>عدد المجموعات</span><select class="in" data-gn>'+[2,3,4,5,6,7,8].map(function(n){return '<option'+(n===5?' selected':'')+'>'+n+'</option>';}).join('')+'</select></label><span class="sp"></span><button class="btn gold" data-gmk>'+ic('dice')+' كوّني المجموعات</button></div></div><div class="groups" data-gout style="margin-top:14px"></div>';
    A.bind(function(m){var mk=function(){var n=+$('[data-gn]',m).value,S=students(cls).map(function(s){return s.name.split(' ').slice(0,2).join(' ');});for(var i=S.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=S[i];S[i]=S[j];S[j]=t;}
      var G=[];for(i=0;i<n;i++)G.push([]);S.forEach(function(s,i){G[i%n].push(s);});var NM=['النجوم','الأفق','المستكشفون','العباقرة','الصقور','الواحة','المجرّة','القمم'],CO=['--k1','--k2','--k3','--k4','--k5','--k7','--k8','--k6'];
      $('[data-gout]',m).innerHTML=G.map(function(g,i){return '<div class="gp rise" style="--c:var('+CO[i]+');--i:'+i+'"><h4>'+ic('group').replace('<svg','<svg style="width:16px;height:16px;vertical-align:-3px"')+' فريق '+NM[i]+'</h4><div>'+g.map(esc).join('<br>')+'</div></div>';}).join('');DA.snd('ok');};
      $('[data-gmk]',m).onclick=mk;mk();});}
  on('[data-oc]','click',function(el){curCls=el.dataset.oc;A.refresh();});
  on('[data-tt]','click',function(el){location.hash='#/tools/'+el.dataset.tt;});
  return h;};
function fmtT(s){return ('0'+Math.floor(s/60)).slice(-2)+':'+('0'+s%60).slice(-2);}
function timerBind(m){var el=$('[data-tm]',m),bar=$('[data-tb]',m);function paint(){if(!el.isConnected)return;el.textContent=fmtT(tmr.left);el.classList.toggle('end',tmr.left===0&&tmr.tot>0);bar.style.width=(tmr.tot?tmr.left/tmr.tot*100:0)+'%';}
  $$('[data-tp]',m).forEach(function(b){b.onclick=function(){tmr.tot=tmr.left=+b.dataset.tp*60;paint();DA.snd('tap');};});
  $('[data-tgo]',m).onclick=function(){if(tmr.left===0)return;tmr.run=!tmr.run;clearInterval(tmr.t);if(tmr.run)tmr.t=setInterval(function(){tmr.left=Math.max(0,tmr.left-1);if(tmr.left===0){tmr.run=false;clearInterval(tmr.t);DA.snd('ok');DA.toast('⏰ انتهى الوقت');}var e2=$('[data-tm]');if(e2){el=e2;bar=$('[data-tb]');paint();}},1000);
    this.innerHTML=ic(tmr.run?'pause':'play')+' '+(tmr.run?'إيقاف مؤقت':'تابعي');};
  $('[data-trs]',m).onclick=function(){tmr.run=false;clearInterval(tmr.t);tmr.left=tmr.tot;paint();$('[data-tgo]',m).innerHTML=ic('play')+' ابدئي';};}
var wDone={};
function wheel(m,cls){var cv=$('[data-wh]',m),x=cv.getContext('2d'),W=cv.width,R0=W/2-6,cols=['#3E6E61','#D2704F','#B8892F','#7C5C8A','#4F7FA0','#7E8D4E','#B5566B','#2F7F86'];
  wDone[cls]=wDone[cls]||[];var ang=0,winner=null;
  function pool(){var S=students(cls);return $('[data-rm]',m).checked?S.filter(function(s){return wDone[cls].indexOf(s.id)<0;}):S;}
  function draw(){var S=pool(),n=Math.max(1,S.length),seg=Math.PI*2/n;x.clearRect(0,0,W,W);x.save();x.translate(W/2,W/2);x.rotate(ang);
    for(var i=0;i<n;i++){x.beginPath();x.moveTo(0,0);x.arc(0,0,R0,i*seg,(i+1)*seg);x.closePath();x.fillStyle=cols[i%cols.length];x.fill();x.strokeStyle='rgba(255,255,255,.6)';x.lineWidth=2;x.stroke();
      if(S[i]){x.save();x.rotate(i*seg+seg/2);x.textAlign='right';x.fillStyle='#fff';x.font='600 '+(n>24?17:21)+'px "IBM Plex Sans Arabic",sans-serif';x.direction='rtl';x.fillText(S[i].name.split(' ')[0],R0-18,7);x.restore();}}
    x.restore();x.beginPath();x.arc(W/2,W/2,46,0,Math.PI*2);x.fillStyle='#FFFDF9';x.fill();x.lineWidth=6;x.strokeStyle='#D2704F';x.stroke();
    var dn=$('[data-done]',m);if(dn)dn.innerHTML=wDone[cls].map(function(id){var s=DA.rec(id);return s?'<span class="chip">'+esc(s.name.split(' ')[0])+'</span>':'';}).join('')||'<span class="muted">لم يُختر أحد بعد</span>';}
  draw();$('[data-rm]',m).onchange=draw;
  $('[data-wr]',m).onclick=function(){wDone[cls]=[];draw();};
  $('[data-spin]',m).onclick=function(){var S=pool();if(!S.length){DA.toast('شارك الجميع! اضغطي «من جديد»');return;}var b=this;b.disabled=true;var start=ang,target=ang+Math.PI*2*(5+Math.random()*3),t0=performance.now(),dur=DA.REDUCED?10:4200,lastSeg=-1;
    (function f(t){var k=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-k,4);ang=start+(target-start)*e;draw();var n=S.length,seg=Math.PI*2/n,a=((-Math.PI/2-ang)%(Math.PI*2)+Math.PI*4)%(Math.PI*2),idx=Math.floor(a/seg)%n;if(idx!==lastSeg){lastSeg=idx;if(k<.97)DA.snd('tap');}
      if(k<1)requestAnimationFrame(f);else{winner=S[idx];$('[data-win]',m).innerHTML='🎉 '+esc(winner.name);wDone[cls].push(winner.id);b.disabled=false;DA.snd('ok');var ws=$('[data-wst]',m);ws.disabled=false;ws.onclick=function(){var r=DA.rec(winner.id);r.stars=(r.stars||0)+1;A._mute=true;DA.put(r);A._mute=false;DA.toast('⭐ نجمة لـ'+r.name.split(' ')[0]);ws.disabled=true;};setTimeout(draw,50);}})(t0);};}

/* =================== الخطط الفردية =================== */
function planForm(p){p=p||{};A.form({title:p.id?'تعديل الخطة':'خطة فردية جديدة',wide:1,data:Object.assign({kind:'rem',prog:0,d:DA.today()},p,{steps:(p.steps||[]).join('\n')}),
  fields:[{k:'stu',label:'الطالب',type:'select',opts:stuOpts,req:1},{k:'kind',label:'نوع الخطة',type:'select',opts:[['rem','علاجية'],['enr','إثرائية']],half:'open'},{k:'prog',label:'نسبة التقدم ٪',type:'number',min:0,max:100,half:'close'},{k:'skill',label:'المهارة المستهدفة',req:1},{k:'steps',label:'الخطوات (خطوة في كل سطر)',type:'lines'},{k:'note',label:'ملاحظة',type:'textarea'}],
  del:p.id?function(){A.remove(p.id,'الخطة');}:null,onSave:function(v){v.prog=Math.max(0,Math.min(100,+v.prog||0));DA.put(Object.assign({K:'plan'},p,v));DA.toast(p.id?'حُفظت الخطة':'أُضيفت الخطة');}});}
P.plans=function(){var L=DA.list('plan').sort(function(a,b){return a.prog-b.prog;}),fl=FPL;
  var h=A.phd('plans','خطط علاجية للمتعثرين وإثرائية للمتميزين، بنسبة تقدم','<button class="btn gold" data-padd>'+ic('plus')+' خطة جديدة</button>');
  h+='<div class="fbar">'+[['','الكل'],['rem','علاجية'],['enr','إثرائية']].map(function(x){return '<button class="fchip" data-pk="'+x[0]+'" aria-pressed="'+(fl===x[0])+'">'+x[1]+'</button>';}).join('')+'</div>';
  L=L.filter(function(p){return !fl||p.kind===fl;});
  h+=L.length?'<div class="gridc">'+L.map(function(p){var s=DA.rec(p.stu)||{name:'—'};var c=p.kind==='rem'?'var(--k2)':'var(--k1)';return '<article class="card ent" style="--c:'+c+'"><div class="eh">'+A.av(Object.assign({},s,{color:C(s.cls).color}))+'<div style="flex:1;min-width:0"><b>'+esc(s.name)+'</b><small>'+esc(C(s.cls).short)+' · '+esc(p.skill)+'</small></div><span class="chip '+(p.kind==='rem'?'warn':'good')+'">'+(p.kind==='rem'?'علاجية':'إثرائية')+'</span></div>'+
    '<ol style="margin:0;padding-inline-start:20px;font-size:13.5px;color:var(--ink2);line-height:1.9">'+(p.steps||[]).map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ol><div class="row" style="gap:10px"><div style="flex:1">'+A.bar(p.prog,c)+'</div><b style="font-family:var(--fh)">'+p.prog+'٪</b></div>'+
    '<div class="ef"><button class="btn ghost sm" data-pp="'+p.id+'">+10٪</button><span class="sp"></span><button class="ib" data-pe="'+p.id+'" aria-label="تعديل">'+ic('edit')+'</button></div></article>';}).join('')+'</div>':A.empty('لا خطط. أضيفي خطة لطالب.','target');
  on('[data-pk]','click',function(el){FPL=el.dataset.pk;A.refresh();});
  on('[data-padd]','click',function(){planForm();});
  on('[data-pe]','click',function(el){planForm(DA.rec(el.dataset.pe));});
  on('[data-pp]','click',function(el){var r=DA.rec(el.dataset.pp);r.prog=Math.min(100,(r.prog||0)+10);DA.put(r);DA.snd('ok');if(r.prog===100)DA.toast('🎉 اكتملت الخطة');});
  return h;};
var FPL='';

/* =================== أولياء الأمور =================== */
var TPL={praise:'نشكر متابعتكم، تميّز ابنكم/ابنتكم {n} اليوم في الرياضيات وحصل على نجمة ذهبية.',absence:'نود الاطمئنان على {n} لغيابه اليوم، ونتمنى له الصحة والعافية.',note:'نرجو متابعة {n} في واجب الرياضيات هذا الأسبوع، شاكرين تعاونكم.',meet:'يسعدنا لقاؤكم لمناقشة مستوى {n} في الرياضيات، نرجو تحديد موعد مناسب.'};
P.parents=function(){var o={k:'parents',kind:'msg',noun:'رسالة',add:'تسجيل تواصل',icon:'chat',
   fields:[{k:'stu',label:'الطالب',type:'select',opts:stuOpts,req:1},{k:'kind',label:'النوع',type:'select',opts:I.MSGK.map(function(x){return [x[0],x[1]];}),half:'open'},{k:'ch',label:'الوسيلة',type:'select',opts:[['wa','واتساب'],['call','اتصال'],['meet','لقاء']],half:'close'},{k:'d',label:'التاريخ',type:'date',def:DA.today},{k:'txt',label:'النص',type:'textarea',req:1}],
   item:function(r){var s=DA.rec(r.stu)||{name:'—'},k=I.MSGK.filter(function(x){return x[0]===r.kind;})[0]||I.MSGK[2];return {icon:k[2],c:'var('+k[3]+')',title:s.name,meta:esc(k[1])+' · '+esc(A.fmt(r.d))+' · '+({wa:'واتساب',call:'اتصال',meet:'لقاء'}[r.ch]||''),body:esc(r.txt),acts:'<button class="ib" data-mwa="'+r.id+'" aria-label="إرسال بواتساب">'+ic('wa')+'</button>'};},
   filter:{key:'kind',opts:I.MSGK.map(function(x){return [x[0],x[1]];})},
   top:function(){return '<div class="card" style="margin-bottom:16px"><div class="ctitle"><span class="ic2">'+ic('magic')+'</span><h3>رسالة جاهزة بلمسة</h3></div><div class="row" style="flex-wrap:wrap"><select class="in" data-ts style="flex:1;min-width:200px">'+stuOpts().map(function(x){return '<option value="'+x[0]+'">'+esc(x[1])+'</option>';}).join('')+'</select>'+
     I.MSGK.map(function(k){return '<button class="btn ghost sm" data-tk="'+k[0]+'">'+ic(k[2])+' '+k[1]+'</button>';}).join('')+'</div></div>';}};
  var h=A.listPage(o);
  on('[data-tk]','click',function(el){var sid=$('[data-ts]').value,s=DA.rec(sid),k=el.dataset.tk,txt=TPL[k].replace('{n}',s.name.split(' ')[0]);
    A.form({title:'رسالة '+I.MSGK.filter(function(x){return x[0]===k;})[0][1],data:{stu:sid,kind:k,ch:'wa',d:DA.today(),txt:txt},fields:o.fields,onSave:function(v){DA.put(Object.assign({K:'msg'},v));A.wa('السلام عليكم ورحمة الله،\n'+v.txt+'\n'+A.me().short);}});});
  on('[data-mwa]','click',function(el){A.wa('السلام عليكم ورحمة الله،\n'+DA.rec(el.dataset.mwa).txt+'\n'+A.me().short);});
  return h;};

/* =================== ملف الإنجاز =================== */
P.port=function(){return A.listPage({k:'port',kind:'pf',noun:'شاهد',add:'إضافة شاهد',icon:'trophy',
  fields:[{k:'title',label:'العنوان',req:1},{k:'cat',label:'التصنيف',type:'select',opts:I.PFCAT.map(function(x){return [x[0],x[1]];}),half:'open'},{k:'d',label:'التاريخ',type:'date',def:DA.today,half:'close'},{k:'txt',label:'الوصف',type:'textarea'},{k:'img',label:'صورة الشاهد',type:'img'}],
  filter:{key:'cat',opts:I.PFCAT.map(function(x){return [x[0],x[1]];})},
  top:function(L){return '<div class="bento" style="margin-bottom:16px">'+I.PFCAT.slice(0,4).map(function(c){return A.kc(c[2],c[3],L.filter(function(r){return r.cat===c[0];}).length,'',c[1]+'','');}).join('')+'</div>';},
  item:function(r){var c=I.PFCAT.filter(function(x){return x[0]===r.cat;})[0]||I.PFCAT[0];return {icon:c[2],c:'var('+c[3]+')',title:r.title,meta:esc(c[1])+' · '+esc(A.fmt(r.d)),body:esc(r.txt||''),cover:r.img||''};}});};

/* =================== النمو المهني =================== */
P.pd=function(){var L=DA.list('pd'),hrs=L.filter(function(x){return x.st==='done';}).reduce(function(a,x){return a+(+x.hours||0);},0),goal=40;
  return A.listPage({k:'pd',kind:'pd',noun:'نشاط مهني',add:'إضافة نشاط',icon:'grow',
  fields:[{k:'title',label:'العنوان',req:1},{k:'kind',label:'النوع',type:'select',opts:I.PDK.map(function(x){return [x[0],x[1]];}),half:'open'},{k:'hours',label:'الساعات',type:'number',half:'close'},{k:'by',label:'الجهة',half:'open'},{k:'st',label:'الحالة',type:'select',opts:[['done','منجز'],['run','جارٍ'],['plan','مخطط']],half:'close'},{k:'d',label:'التاريخ',type:'date',def:DA.today}],
  top:function(){return '<div class="card" style="margin-bottom:16px;display:flex;align-items:center;gap:20px;flex-wrap:wrap"><div class="now"><div class="pring" style="--p:'+Math.min(100,hrs/goal*100)+'"><div><b>'+hrs+'</b><small>ساعة</small></div></div></div><div style="flex:1;min-width:200px"><h3 style="font-size:18px">هدف الإنماء المهني لهذا العام</h3><p class="muted" style="margin:4px 0 10px">'+hrs+' من '+goal+' ساعة تدريبية · '+L.filter(function(x){return x.st==='done';}).length+' نشاطًا منجزًا</p>'+A.bar(hrs/goal*100,'var(--k4)')+'</div></div>';},
  item:function(r){var k=I.PDK.filter(function(x){return x[0]===r.kind;})[0]||I.PDK[0];return {icon:k[2],c:'var(--k4)',title:r.title,meta:esc(k[1])+' · '+esc(r.by||'')+' · '+esc(A.short(r.d)),done:r.st==='done',chips:'<span class="chip '+(r.st==='done'?'good':r.st==='run'?'info':'gold')+'">'+({done:'منجز',run:'جارٍ',plan:'مخطط'}[r.st]||'')+'</span>'+(r.hours?'<span class="chip">'+r.hours+' ساعة</span>':'')};}});};

/* =================== التقارير =================== */
var REPS=[['grades','تقرير التحصيل','chart','--k4','درجات ومستويات كل شعبة'],['att','تقرير الحضور','check','--k1','نسب الحضور والغياب المتكرر'],['card','بطاقة طالب','student','--k8','تقرير فردي لوليّ الأمر'],['sum','ملخص إنجازي','trophy','--k3','الدروس والخطط والشواهد والنمو المهني']];
var repCls=null,repStu=null;
P.reports=function(a){if(a)return report(a);
  var h=A.phd('reports','تقارير تُولَّد من بياناتكِ مباشرة، جاهزة للطباعة أو حفظها PDF');
  h+='<div class="gridc">'+REPS.map(function(r){return '<a class="card ent" href="#/reports/'+r[0]+'" style="--c:var('+r[3]+');text-decoration:none;color:inherit"><div class="eh"><span class="ei">'+ic(r[2])+'</span><div><b>'+esc(r[1])+'</b><small>'+esc(r[4])+'</small></div></div></a>';}).join('')+'</div>';
  return h;};
function phead(t){var me=A.me();return '<div class="phead"><img src="icons/mark.svg" alt=""><div class="t"><b>'+esc(me.school)+'</b><small>'+esc(me.short)+' · '+esc(me.title)+' · '+esc(me.year)+'</small></div><h2 style="margin:0">'+esc(t)+'</h2></div>';}
function report(k){var r=REPS.filter(function(x){return x[0]===k;})[0]||REPS[0],me=A.me(),days=recentDays(20),b='',sel='';
  var cls=repCls||cc();
  if(k==='grades'||k==='att'||k==='card')sel='<select class="in" data-rc style="width:auto">'+classes().map(function(c){return '<option value="'+c.id+'"'+(c.id===cls?' selected':'')+'>'+esc(c.name)+'</option>';}).join('')+'</select>';
  if(k==='grades'){var L=asms(cls),S=students(cls);b='<table><tr><th>الطالب</th>'+L.map(function(a){return '<th>'+esc(a.title.split(':')[0])+' ('+a.max+')</th>';}).join('')+'<th>النسبة</th><th>المستوى</th></tr>'+S.map(function(s){var p=stuPct(s);return '<tr><td>'+esc(s.name)+'</td>'+L.map(function(a){var v=a.sc[s.id];return '<td>'+(v!=null&&v!==''?v:'—')+'</td>';}).join('')+'<td>'+(p!=null?p.toFixed(0)+'٪':'—')+'</td><td>'+(p!=null?I.LVN[I.level(p)]:'—')+'</td></tr>';}).join('')+'</table>';}
  else if(k==='att'){var S2=students(cls);b='<table><tr><th>الطالب</th><th>أيام الغياب</th><th>أيام التأخر</th><th>نسبة الحضور</th></tr>'+S2.map(function(s){var a=0,l=0;days.forEach(function(d){var x=attRec(d,cls);if(x){if(x.abs.indexOf(s.id)>=0)a++;if((x.late||[]).indexOf(s.id)>=0)l++;}});return '<tr><td>'+esc(s.name)+'</td><td>'+a+'</td><td>'+l+'</td><td>'+attPct(s,days).toFixed(0)+'٪</td></tr>';}).join('')+'</table>';}
  else if(k==='card'){var S3=students(cls),st=DA.rec(repStu)&&DA.rec(repStu).cls===cls?DA.rec(repStu):S3[0];sel+=' <select class="in" data-rs style="width:auto">'+S3.map(function(s){return '<option value="'+s.id+'"'+(s.id===st.id?' selected':'')+'>'+esc(s.name)+'</option>';}).join('')+'</select>';
    var p=stuPct(st);b='<div class="kp"><div><b>'+(p!=null?p.toFixed(0)+'٪':'—')+'</b>الإتقان</div><div><b>'+(p!=null?I.LVN[I.level(p)]:'—')+'</b>المستوى</div><div><b>'+attPct(st,days).toFixed(0)+'٪</b>الحضور</div><div><b>'+(st.stars||0)+'</b>نجمة</div></div><h3>'+esc(st.name)+' · '+esc(C(st.cls).name)+'</h3><table><tr><th>التقويم</th><th>الدرجة</th><th>العظمى</th></tr>'+asms(cls).map(function(a){var v=a.sc[st.id];return '<tr><td>'+esc(a.title)+'</td><td>'+(v!=null&&v!==''?v:'—')+'</td><td>'+a.max+'</td></tr>';}).join('')+'</table>'+(st.note?'<h3>ملاحظة المعلمة</h3><p>'+esc(st.note)+'</p>':'<h3>ملاحظة المعلمة</h3><p>'+(p!=null&&p>=80?'مستوى متميز، نوصي بالاستمرار وتحدّي النفس بمسائل التفكير.':'نوصي بالتدريب اليومي القصير على المهارات الأساسية ومتابعة الواجبات.')+'</p>');}
  else{var Ls=DA.list('les'),pl=DA.list('plan'),pf=DA.list('pf'),pdl=DA.list('pd');b='<div class="kp"><div><b>'+Ls.filter(function(l){return l.st==='done';}).length+'</b>درسًا منفّذًا</div><div><b>'+Ls.filter(function(l){return l.st!=='done';}).length+'</b>درسًا مخططًا</div><div><b>'+pl.length+'</b>خطة فردية</div><div><b>'+pf.length+'</b>شاهدًا</div><div><b>'+pdl.filter(function(x){return x.st==='done';}).reduce(function(a,x){return a+(+x.hours||0);},0)+'</b>ساعة تدريب</div><div><b>'+DA.list('msg').length+'</b>تواصلًا مع الأولياء</div></div>'+
    '<h3>الشواهد والإنجازات</h3><ul>'+pf.map(function(x){return '<li>'+esc(x.title)+' ('+esc(A.short(x.d))+')</li>';}).join('')+'</ul><h3>الخطط الفردية</h3><table><tr><th>الطالب</th><th>النوع</th><th>المهارة</th><th>التقدم</th></tr>'+pl.map(function(x){var s=DA.rec(x.stu)||{name:'—'};return '<tr><td>'+esc(s.name)+'</td><td>'+(x.kind==='rem'?'علاجية':'إثرائية')+'</td><td>'+esc(x.skill)+'</td><td>'+x.prog+'٪</td></tr>';}).join('')+'</table>';}
  var h='<div class="row no-print" style="margin:16px 0;flex-wrap:wrap"><a class="btn ghost" href="#/reports">'+ic('right')+' كل التقارير</a>'+sel+'<span class="sp"></span><button class="btn gold" data-p>'+ic('print')+' طباعة / حفظ PDF</button></div>'+
   '<div class="paper">'+phead(r[1])+'<p style="color:#666;margin-top:-6px">'+esc(me.subj)+' · حتى '+esc(A.fmt(A.workday()))+'</p>'+b+'<div class="sig"><span>المعلمة: '+esc(me.short)+'</span><span>المعلمة الأولى: ...................</span></div><div class="wm2">نسخة عرض من منصة رُواء · جميع البيانات وهمية</div></div>';
  on('[data-p]','click',function(){window.print();});
  on('[data-rc]','change',function(el){repCls=el.value;A.refresh();});
  on('[data-rs]','change',function(el){repStu=el.value;A.refresh();});
  return h;}

/* =================== الإعدادات =================== */
P.settings=function(){var me=A.me(),mute=DA.lsg('mute',false);
  var h=A.phd('settings');
  h+='<div class="cols"><div class="stack"><div class="card"><div class="ctitle"><span class="ic2">'+ic('user')+'</span><h3>ملفي</h3><span class="sp"></span><button class="btn ghost sm" data-me>'+ic('edit')+' تعديل</button></div>'+
   [['الاسم',me.name],['الاسم المختصر',me.short],['الوظيفة',me.title],['المدرسة',me.school],['المرحلة',me.cycle],['العام الدراسي',me.year],['الخبرة',me.exp],['عبارتي',me.motto]].map(function(x){return '<div class="set-row"><div class="tx"><small>'+x[0]+'</small><b style="font-weight:600">'+esc(x[1])+'</b></div></div>';}).join('')+'</div>'+
   '<div class="card"><div class="ctitle"><span class="ic2">'+ic('users')+'</span><h3>شعبي</h3><span class="sp"></span><button class="btn ghost sm" data-cadd>'+ic('plus')+' شعبة</button></div>'+classes().map(function(c){return '<div class="set-row"><div class="tx"><b style="color:'+c.color+'">'+esc(c.name)+'</b><small>'+students(c.id).length+' طالبًا</small></div><button class="ib" data-ced="'+c.id+'" aria-label="تعديل">'+ic('edit')+'</button></div>';}).join('')+'</div></div>'+
   '<div class="stack"><div class="card"><div class="ctitle"><span class="ic2">'+ic('pal')+'</span><h3>المظهر</h3></div>'+
   '<div class="set-row"><div class="tx"><b>الثيمات</b><small>'+DA.SKINS.length+' ثيمات بخلفيات حيّة وأصوات خاصة</small></div><button class="btn sm" data-act="studio">اختيار</button></div>'+
   '<div class="set-row"><div class="tx"><b>الوضع الليلي</b><small>يبدّل بين النهاري والليلي</small></div><button class="switch" role="switch" aria-checked="'+(document.documentElement.getAttribute('data-mode')==='dark')+'" data-act="mode"></button></div>'+
   '<div class="set-row"><div class="tx"><b>أصوات اللمس</b><small>نقرات طبيعية هادئة</small></div><button class="switch" role="switch" aria-checked="'+(!mute)+'" data-mute></button></div>'+
   '<div class="set-row"><div class="tx"><b>تثبيت المنصة</b><small>كتطبيق على الجوال أو الحاسوب، وتعمل دون إنترنت</small></div><button class="btn gold sm" data-act="install">'+ic('dl')+' تثبيت</button></div></div>'+
   '<div class="card"><div class="ctitle"><span class="ic2">'+ic('folder')+'</span><h3>البيانات</h3></div>'+
   '<div class="set-row"><div class="tx"><b>نسخة احتياطية</b><small>تنزيل كل بياناتكِ في ملف</small></div><button class="btn ghost sm" data-exp>'+ic('dl')+' تنزيل</button></div>'+
   '<div class="set-row"><div class="tx"><b>استعادة نسخة</b><small>من ملف نسخة احتياطية سابق</small></div><button class="btn ghost sm" data-imp>'+ic('up')+' استعادة</button></div>'+
   '<div class="set-row"><div class="tx"><b>إعادة بيانات العرض</b><small>يمسح ما أضفتِه ويعيد البيانات الوهمية</small></div><button class="btn danger sm" data-reset>'+ic('refresh')+' إعادة</button></div></div>'+
   '<div class="card qcard"><h3>'+esc(I.BRAND.app)+' لكِ</h3><p class="muted" style="margin:0">نسخة خاصة باسمكِ وشعبكِ الحقيقية، بمزامنة آمنة بين الجوال والحاسوب.</p><a class="btn gold" href="https://wa.me/96876506037?text='+encodeURIComponent(I.BRAND.wa)+'" target="_blank" rel="noopener" style="width:max-content">'+ic('wa')+' 76506037</a></div></div></div>';
  on('[data-me]','click',function(){var c=DA.rec('me')||{id:'me',K:'cfg'};A.form({title:'ملفي',data:A.me(),wide:1,fields:[{k:'name',label:'الاسم',req:1},{k:'short',label:'الاسم المختصر',half:'open'},{k:'title',label:'الوظيفة',half:'close'},{k:'school',label:'المدرسة',half:'open'},{k:'cycle',label:'المرحلة',half:'close'},{k:'year',label:'العام الدراسي',half:'open'},{k:'exp',label:'الخبرة',half:'close'},{k:'motto',label:'عبارتي',type:'textarea'}],
    onSave:function(v){DA.put(Object.assign(c,v));DA.toast('حُفظ ملفكِ');}});});
  function clsForm(c){c=c||{};A.form({title:c.id?'تعديل الشعبة':'شعبة جديدة',data:Object.assign({color:'#4F7FA0'},c),fields:[{k:'name',label:'اسم الشعبة',req:1,ph:'الصف الرابع / ١'},{k:'short',label:'الاسم المختصر',req:1,ph:'4/1',half:'open'},{k:'color',label:'اللون',type:'select',opts:[['#3E6E61','مريمي'],['#D2704F','طيني'],['#7C5C8A','بنفسجي'],['#4F7FA0','أزرق'],['#B8892F','عسلي'],['#B5566B','وردي'],['#2F7F86','فيروزي']],half:'close'}],
    del:c.id?function(){A.remove(c.id,'الشعبة');}:null,onSave:function(v){DA.put(Object.assign({K:'cls'},c,v));}});}
  on('[data-cadd]','click',function(){clsForm();});on('[data-ced]','click',function(el){clsForm(DA.rec(el.dataset.ced));});
  on('[data-mute]','click',function(el){var m=!DA.lsg('mute',false);DA.lss('mute',m);el.setAttribute('aria-checked',String(!m));});
  on('[data-exp]','click',function(){var out=Object.keys(DA.R).map(function(k){return DA.R[k];}).filter(function(r){return !r.del;});var b=new Blob([JSON.stringify({app:window.APPID,v:1,at:new Date().toISOString(),recs:out})],{type:'application/json'});var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=I.BRAND.app+'-نسخة-احتياطية-'+DA.today()+'.json';document.body.appendChild(a);a.click();a.remove();DA.toast('نُزّلت النسخة الاحتياطية');});
  on('[data-imp]','click',function(){DA.pick('application/json,.json').then(function(fs){if(!fs[0])return;fs[0].text().then(function(t){var j;try{j=JSON.parse(t);}catch(e){DA.toast('الملف غير صالح');return;}if(!j||j.app!==window.APPID||!j.recs){DA.toast('هذا ليس ملف نسخة من '+I.BRAND.app);return;}
    DA.ask('ستُستبدل البيانات الحالية بمحتوى النسخة ('+j.recs.length+' سجلًا). متابعة؟',function(){DA.wipe().then(function(){return DA.bulk(j.recs);}).then(function(){DA.toast('استُعيدت النسخة');A.refresh();});},{ok:'استعادة'});});});});
  on('[data-reset]','click',function(){DA.ask('سيُمسح كل ما أضفتِه وتعود بيانات العرض كما كانت. متابعة؟',function(){A.reset();},{danger:1,ok:'إعادة البيانات'});});
  return h;};
})();
