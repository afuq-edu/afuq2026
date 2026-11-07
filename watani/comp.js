/* =====================================================================
   «هذا وطني» · التصفيات، ساحة العرض، لوحة الشرف والمعرض، الشهادات، الإعدادات
   ===================================================================== */
(function(){
'use strict';
var $=W.$,$$=W.$$,esc=W.esc,ar=W.ar,ic=W.ic,G=W.G,DB=window.WDB;

/* =====================================================================
   شجرة التصفيات
   ===================================================================== */
var FMT={
 g3:{n:'٤ مجموعات ثلاثية ← نصف نهائي ← نهائي',d:'كل ثلاث شعب في مواجهة، تتأهل الأولى (٤ شعب)، ثم مواجهتان ثنائيتان، ثم النهائي بين شعبتين.'},
 p2:{n:'٦ مواجهات ثنائية ← ٣ مواجهات ← نهائي ثلاثي',d:'كل شعبتين في مواجهة (٦ متأهلات)، ثم ثلاث مواجهات ثنائية، ثم نهائي بين ثلاث شعب.'},
 g4:{n:'٣ مجموعات رباعية ← نهائي ثلاثي',d:'كل أربع شعب في مواجهة، وتلتقي المتأهلات الثلاث في النهائي.'}};
W.FMT=FMT;
var GN=['أ','ب','ج','د','هـ','و'];
W.buildBracket=function(fmt,order){fmt=FMT[fmt]?fmt:'g3';var S=[],o=order.slice();
  function st(n,size,count,pre,from,fin){var ms=[];for(var i=0;i<count;i++){var slots=[];for(var j=0;j<size;j++){if(from)slots.push({f:from[i*size+j]});else slots.push({s:o.shift()||null});}
    ms.push({id:pre+(i+1),name:fin?'المواجهة النهائية':(count>1?(from?'المواجهة ':'المجموعة ')+(from?ar(i+1):GN[i]):'المواجهة'),stage:n,slots:slots,sc:{},w:null,rid:null,final:!!fin});}S.push({n:n,final:!!fin,ms:ms});return ms.map(function(m){return m.id;});}
  if(fmt==='g3'){var a=st('التصفيات الأولى',3,4,'a');var b=st('نصف النهائي',2,2,'b',a);st('النهائي',2,1,'f',b,true);}
  else if(fmt==='p2'){var a2=st('التصفيات الأولى',2,6,'a');var b2=st('الدور الثاني',2,3,'b',a2);st('النهائي',3,1,'f',b2,true);}
  else{var a3=st('التصفيات الأولى',4,3,'a');st('النهائي',3,1,'f',a3,true);}
  return {fmt:fmt,stages:S};};
function allMatches(){var out=[];((G.comp&&G.comp.br&&G.comp.br.stages)||[]).forEach(function(s){out=out.concat(s.ms);});return out;}
W.findMatch=function(id){return allMatches().filter(function(m){return m.id===id;})[0]||null;};
W.matchSecs=function(m){return m.slots.map(function(s){return s.s;}).filter(Boolean);};
W.pendingMatches=function(){return allMatches().filter(function(m){return !m.w&&W.matchSecs(m).length===m.slots.length;});};
W.stageInfo=function(){var ms=allMatches(),done=ms.filter(function(m){return m.w;}).length,cur=null;(G.comp.br.stages||[]).some(function(s){if(s.ms.some(function(m){return !m.w;})){cur=s;return true;}return false;});
  return {name:cur?cur.n:'انتهت المسابقة 🏆',done:done,total:ms.length,st:cur};};
function clearFrom(mid){allMatches().forEach(function(m){m.slots.forEach(function(sl){if(sl.f===mid){sl.s=null;if(m.w){var id=m.id;m.w=null;m.sc={};clearFrom(id);}}});});}
W.setWinner=function(mid,w,sc,via){var m=W.findMatch(mid);if(!m)return;if(m.w&&m.w!==w)clearFrom(mid);m.w=w;m.sc=sc||m.sc||{};m.via=via||'manual';
  allMatches().forEach(function(x){x.slots.forEach(function(sl){if(sl.f===mid)sl.s=w;});});W.saveComp(true);};
W.ranking=function(){var st=G.comp.br.stages,out=[],seen={};for(var i=st.length-1;i>=0;i--){var group=[];st[i].ms.forEach(function(m){if(!m.w)return;W.matchSecs(m).forEach(function(s){if(seen[s])return;group.push({s:s,sc:m.w===s?1e6:(+(m.sc||{})[s]||0)});});});
  group.sort(function(a,b){return b.sc-a.sc;});group.forEach(function(g){if(!seen[g.s]){seen[g.s]=1;out.push(g.s);}});}return out;};
W.champion=function(){var f=G.comp.br.stages[G.comp.br.stages.length-1].ms[0];return f&&f.w||null;};

W.tviews.bracket=function(main){function draw(){var br=G.comp.br,started=allMatches().some(function(m){return m.w||m.rid;}),info=W.stageInfo();
  W.view(main,W.head('التصفيات','من ١١/١ إلى ١١/١٢ على مراحل متتابعة، حتى النهائي وتكريم الشعبة الفائزة.','<button class="btn" id="dr"'+(started?' disabled':'')+'>'+ic('shuffle')+'قرعة</button><button class="btn" id="fm"'+(started?' disabled':'')+'>'+ic('tree')+'نظام التصفيات</button><button class="btn ghost" id="rs">'+ic('undo')+'إعادة ضبط</button>')+
   '<div class="grid g4">'+W.stat('<span style="font-size:24px;line-height:1.4">'+esc(info.name)+'</span>','المرحلة الحالية')+W.stat(ar(info.done)+' / '+ar(info.total),'مواجهات منتهية',W.pct(info.done,info.total))+W.stat('<span style="font-size:18px;line-height:1.6">'+esc(FMT[br.fmt].n)+'</span>','النظام')+'</div>'+
   '<div class="bracket">'+br.stages.map(function(s){return '<div class="stage"><h3>'+esc(s.n)+'</h3>'+s.ms.map(function(m){var secs=W.matchSecs(m),ready=secs.length===m.slots.length,live=m.rid&&!m.w&&G.rounds.some(function(r){return r.id===m.rid&&r.open;});
     return '<div class="match'+(m.final?' final':'')+(live?' live':'')+'"><div class="mh"><span>'+esc(m.name)+'</span>'+(m.w?'<span class="tag l1">انتهت</span>':(live?'<span class="tag l3">جارية</span>':''))+'</div>'+
      m.slots.map(function(sl){var s=sl.s;if(!s){var src=sl.f?W.findMatch(sl.f):null;return '<div class="slot tbd">'+(src?'الفائزة من '+esc(src.name):'—')+'</div>';}
        return '<div class="slot'+(m.w===s?' win':(m.w?' out':''))+'"><span class="n">'+esc(W.secName(s))+(W.nick(s)?' <small class="muted">'+esc(W.nick(s))+'</small>':'')+'</span>'+(m.sc&&m.sc[s]!=null?'<span class="s">'+ar(m.sc[s])+(m.via==='round'?'٪':'')+'</span>':'')+(m.w===s?'<span>🏆</span>':'')+'</div>';}).join('')+
      (ready&&!m.w?'<div class="row" style="gap:6px;margin-top:4px">'+(m.rid?'<a class="btn sm grn" href="#/t/rounds/'+m.rid+'">'+ic('chart')+'الجولة</a>':'<button class="btn sm grn" data-nr="'+m.id+'">'+ic('play')+'جولة للطالبات</button>')+'<a class="btn sm" href="#/t/arena/'+m.id+'">'+ic('screen')+'في الساحة</a><button class="btn sm ghost" data-w="'+m.id+'" title="تحديد الفائزة يدويًا">'+ic('check')+'</button></div>':'')+
      (m.w?'<div class="row" style="gap:6px;margin-top:4px">'+(m.rid?'<a class="btn sm ghost" href="#/t/rounds/'+m.rid+'">'+ic('chart')+'النتائج</a>':'')+'<button class="btn sm ghost" data-w="'+m.id+'">'+ic('edit')+'تعديل</button></div>':'')+'</div>';}).join('')+'</div>';}).join('')+
   '<div class="stage"><h3>التكريم</h3><div class="match final" style="text-align:center;align-items:center"><img src="img/trophy.webp" alt="" style="width:110px;mix-blend-mode:multiply;border-radius:50%">'+(W.champion()?'<b class="kufi" style="font-size:26px;color:var(--hd)">'+esc(W.secName(W.champion()))+'</b><a class="btn sm gld" href="#/t/honor">'+ic('trophy')+'لوحة الشرف</a>':'<span class="muted">الشعبة الفائزة</span>')+'</div></div></div>'+
   '<p class="muted">لكل مواجهة طريقتان: «جولة للطالبات» تجيب فيها كل طالبة من جهازها وتتأهل الشعبة الأعلى متوسطًا، أو «في الساحة» مسابقة حية على شاشة الصف بالنقاط والمؤقت.</p>');
  $('#dr').onclick=function(){W.ask('إجراء قرعة جديدة لتوزيع الشعب الاثنتي عشرة على مواجهات المرحلة الأولى؟',function(){draw2(true);});};
  $('#fm').onclick=function(){var d=W.dlg('<h2>نظام التصفيات</h2><div class="grid">'+Object.keys(FMT).map(function(k){return '<button class="card" data-f="'+k+'" style="text-align:start;cursor:pointer;font:inherit;color:inherit;'+(G.comp.br.fmt===k?'border-color:var(--gold);box-shadow:var(--glow)':'')+'"><b class="kufi" style="color:var(--hd);font-size:17px">'+FMT[k].n+'</b><br><small class="muted">'+FMT[k].d+'</small></button>';}).join('')+'</div>');
    $$('[data-f]',d).forEach(function(b){b.onclick=function(){G.comp.fmt=b.dataset.f;G.comp.br=W.buildBracket(b.dataset.f,W.SECS.map(function(s){return s.id;}));W.saveComp(true);d.close();draw();};});};
  $('#rs').onclick=function(){W.ask('إعادة ضبط التصفيات وحذف كل النتائج المسجلة في الشجرة؟ (لا تُحذف الجولات ولا إجابات الطالبات)',function(){G.comp.br=W.buildBracket(G.comp.fmt,W.SECS.map(function(s){return s.id;}));G.comp.arena={};W.saveComp(true);draw();},{danger:true,ok:'إعادة ضبط'});};
  $$('[data-nr]').forEach(function(b){b.onclick=function(){W.newRound({mid:b.dataset.nr,kind:'stage'});};});
  $$('[data-w]').forEach(function(b){b.onclick=function(){manual(b.dataset.w);};});}
  function draw2(shuf){var ids=W.shuffle(W.SECS.map(function(s){return s.id;}));G.comp.br=W.buildBracket(G.comp.fmt,ids);W.saveComp(true);
    if(!W.REDUCED){draw();$$('.stage:first-child .slot .n').forEach(function(el,i){el.style.opacity=0;setTimeout(function(){el.style.transition='opacity .4s';el.style.opacity=1;W.snd('tick');},140*i);});}else draw();W.toast('تمّت القرعة');}
  function manual(mid){var m=W.findMatch(mid),secs=W.matchSecs(m);var d=W.dlg('<h2>'+esc(m.stage+' · '+m.name)+'</h2><p class="muted">أدخلي نتيجة كل شعبة (اختياري) واختاري المتأهلة.</p><div class="grid">'+secs.map(function(s,i){return '<label class="card" style="display:flex;gap:10px;align-items:center;padding:10px 14px"><input type="radio" name="w" value="'+s+'"'+((m.w?m.w===s:i===0)?' checked':'')+' style="width:22px;height:22px;accent-color:var(--green)"><b class="kufi" style="flex:1;font-size:18px">'+esc(W.secName(s))+'</b><input class="inp" type="number" data-s="'+s+'" value="'+(m.sc&&m.sc[s]!=null?m.sc[s]:'')+'" placeholder="النتيجة" style="width:110px"></label>';}).join('')+'</div><div class="row" style="justify-content:space-between;margin-top:12px">'+(m.w?'<button class="btn ghost" id="un">'+ic('undo')+'إلغاء النتيجة</button>':'<span></span>')+'<div class="row"><button class="btn ghost" data-close>إلغاء</button><button class="btn gld" id="ok">'+ic('trophy')+'اعتماد</button></div></div>');
    $('#ok',d).onclick=function(){var sc={};$$('[data-s]',d).forEach(function(i){if(i.value!=='')sc[i.dataset.s]=+i.value;});var w=$('input[name=w]:checked',d).value;W.setWinner(mid,w,sc,'manual');d.close();W.toast('تأهلت '+W.secName(w));if(m.final)W.confetti();draw();};
    var un=$('#un',d);if(un)un.onclick=function(){clearFrom(mid);m.w=null;m.sc={};W.saveComp(true);d.close();draw();};}
  draw();W.onData=function(k){if(k==='comp'||k==='rounds')draw();};};

/* =====================================================================
   ساحة العرض: مسابقة حية على شاشة الصف
   ===================================================================== */
W.tviews.arena=function(main,p){var mid=p[0]||'',key=mid||'free',m=mid?W.findMatch(mid):null;
  var A=G.comp.arena[key];
  if(!A){setup();return;}
  play();
  function setup(){var cfg={secs:m?W.matchSecs(m):[],per:3,les:[1,2],ty:['mc','tf','fl','sa'],mode:'turn'};
    function draw(){W.view(main,W.head('ساحة العرض','مسابقة حية على شاشة الصف: سؤال كبير، ومؤقت، ونقاط لكل شعبة.')+
      '<section class="card corner form">'+(m?'<p><span class="tag">'+esc(m.stage)+'</span> <b>'+esc(m.name)+'</b>: '+cfg.secs.map(W.secName).join(' · ')+'</p>':
       '<div class="f"><b>الشعب المتنافسة</b><div class="row">'+W.SECS.map(function(s){return '<button type="button" class="chip'+(cfg.secs.indexOf(s.id)>=0?' on':'')+'" data-sec="'+s.id+'">'+s.name+'</button>';}).join('')+'</div>'+
       (W.pendingMatches().length?'<small class="muted">أو اختاري مواجهة من التصفيات: '+W.pendingMatches().map(function(x){return '<a href="#/t/arena/'+x.id+'">'+esc(x.stage+' · '+x.name)+'</a>';}).join('، ')+'</small>':'')+'</div>')+
      '<div class="grid g3"><label class="f">عدد الأسئلة لكل شعبة<input class="inp" type="number" min="1" max="15" id="per" value="'+cfg.per+'"></label><div class="f"><b>طريقة الإجابة</b><div class="row"><button type="button" class="chip'+(cfg.mode==='turn'?' on':'')+'" data-m="turn">بالدور</button><button type="button" class="chip'+(cfg.mode==='fast'?' on':'')+'" data-m="fast">الأسرع</button></div></div>'+
      '<div class="f"><b>الدروس</b><div class="row">'+[1,2].map(function(n){return '<button type="button" class="chip'+(cfg.les.indexOf(n)>=0?' on':'')+'" data-les="'+n+'">الدرس '+(n===1?'الأول':'الثاني')+'</button>';}).join('')+'</div></div></div>'+
      '<div class="f"><b>أنواع الأسئلة</b><div class="row">'+Object.keys(W.TY).map(function(t){return '<button type="button" class="chip'+(cfg.ty.indexOf(t)>=0?' on':'')+'" data-ty="'+t+'">'+W.TY[t]+'</button>';}).join('')+'</div></div>'+
      '<p class="muted" style="margin:0">«بالدور»: يُوجَّه كل سؤال لشعبة، وإن أخطأت يمكن لغيرها الاستحواذ بنقطة. «الأسرع»: تجيب أول شعبة ترفع البطاقة.</p><div class="row"><button class="btn pri lg" id="go"'+(cfg.secs.length<2?' disabled':'')+'>'+ic('play')+'ابدئي المواجهة</button></div></section>');
      $$('[data-sec]').forEach(function(b){b.onclick=function(){keep();var i=cfg.secs.indexOf(b.dataset.sec);if(i>=0)cfg.secs.splice(i,1);else cfg.secs.push(b.dataset.sec);draw();};});
      $$('[data-m]').forEach(function(b){b.onclick=function(){keep();cfg.mode=b.dataset.m;draw();};});
      $$('[data-les]').forEach(function(b){b.onclick=function(){keep();var n=+b.dataset.les,i=cfg.les.indexOf(n);if(i>=0){if(cfg.les.length>1)cfg.les.splice(i,1);}else cfg.les.push(n);draw();};});
      $$('[data-ty]').forEach(function(b){b.onclick=function(){keep();var i=cfg.ty.indexOf(b.dataset.ty);if(i>=0){if(cfg.ty.length>1)cfg.ty.splice(i,1);}else cfg.ty.push(b.dataset.ty);draw();};});
      $('#go').onclick=function(){keep();var sc={};cfg.secs.forEach(function(s){sc[s]=0;});A=G.comp.arena[key]={secs:cfg.secs,per:cfg.per,les:cfg.les,ty:cfg.ty,mode:cfg.mode,sc:sc,used:[],turn:0,n:0,log:[],cur:null};W.saveComp(true);play();};}
    function keep(){var p=$('#per');if(p)cfg.per=Math.max(1,+p.value||3);}
    draw();}
  function play(){document.body.classList.add('stage-mode');var q=null,showAns=false,timer=null,left=0,running=false,steal=false,lvPick=0;
    W.cleanup=function(){clearInterval(timer);};
    var total=A.secs.length*A.per;
    function curQ(){return A.cur?G.bank.items.filter(function(x){return x.id===A.cur.id;})[0]:null;}
    function draw(){q=curQ();var lead=Math.max.apply(null,A.secs.map(function(s){return A.sc[s]||0;}));var tsec=A.mode==='turn'?A.secs[A.turn%A.secs.length]:null;
      W.view(main,'<div class="arena"><div class="arena-top"><div><div class="st">'+(m?esc(m.stage+' · '+m.name):'مواجهة في الساحة')+'</div><div class="dots">'+Array.apply(null,{length:total}).map(function(x,i){return '<i class="'+(i<A.n?'d':(i===A.n&&q?'c':''))+'"></i>';}).join('')+'</div></div>'+
       '<div class="row"><span class="tag" style="font-size:14px">السؤال '+ar(Math.min(A.n+(q?1:0),total))+' من '+ar(total)+'</span><button class="btn sm ghost" id="fs" aria-label="ملء الشاشة">'+ic('full')+'</button><button class="btn sm ghost" id="ux"'+(A.log.length?'':' disabled')+'>'+ic('undo')+'تراجع</button><button class="btn sm gld" id="end">'+ic('trophy')+'إنهاء وإعلان الفائزة</button><button class="btn sm ghost" id="ex">'+ic('out')+'خروج</button></div></div>'+
       '<div class="teams" style="--n:'+A.secs.length+'">'+A.secs.map(function(s){return '<div class="team'+(tsec===s?' turn':'')+((A.sc[s]||0)===lead&&lead>0?' lead':'')+'" data-t="'+s+'"><div class="nm">'+esc(W.secName(s))+'</div><div class="nick">'+esc(W.nick(s))+'</div><div class="sc">'+ar(A.sc[s]||0)+'</div><div class="acts">'+(q?'<button class="btn sm grn" data-pt="'+s+'">+'+ar(pts())+'</button>'+(A.mode==='turn'&&steal&&s!==tsec?'<button class="btn sm" data-st="'+s+'">استحواذ +١</button>':''):'')+'<button class="btn sm ghost" data-adj="'+s+'" aria-label="خصم نقطة">−</button></div></div>';}).join('')+'</div>'+
       '<section class="card qbox corner">'+(q?qhtml(q):'<div style="text-align:center;padding:20px"><img src="img/trophy.webp" alt="" style="width:130px;mix-blend-mode:multiply;border-radius:50%"><h2 style="margin:8px 0">'+(A.n>=total?'انتهت الأسئلة! اضغطي «إنهاء وإعلان الفائزة»':(A.mode==='turn'?'السؤال التالي لشعبة '+esc(W.secName(tsec)):'جاهزات للسؤال التالي؟'))+'</h2></div>')+
        '<div class="row" style="justify-content:space-between;align-items:center">'+(q?W.tmr(left||tlimit()):'<span></span>')+'<div class="row">'+(q?'<button class="btn" id="tp">'+ic('clock')+(running?'إيقاف المؤقت':'تشغيل المؤقت')+'</button><button class="btn" id="sa">'+ic('eye')+(showAns?'إخفاء الإجابة':'إظهار الإجابة')+'</button>'+(A.mode==='turn'&&!steal?'<button class="btn" id="wr">'+ic('x')+'إجابة خاطئة</button>':'')+'<button class="btn ghost" id="sk">تخطّي</button>':'<div class="row" role="group" aria-label="المستوى">'+[[0,'تلقائي'],[1,'معرفة'],[2,'تطبيق'],[3,'استدلال']].map(function(l){return '<button class="chip'+(lvPick===l[0]?' on':'')+'" data-lv="'+l[0]+'">'+l[1]+'</button>';}).join('')+'</div><button class="btn pri lg" id="nq"'+(A.n>=total?' disabled':'')+'>'+ic('play')+'سؤال جديد</button>')+'</div></div></section></div>');
      if(q)W.setT(left||tlimit(),tlimit());
      $('#fs').onclick=W.full;$('#ex').onclick=function(){W.go(mid?'#/t/bracket':'#/t/');};
      $('#ux').onclick=function(){var l=A.log.pop();if(l){A.sc[l.s]-=l.p;W.saveComp();draw();}};
      $('#end').onclick=finish;
      $$('[data-lv]').forEach(function(b){b.onclick=function(){lvPick=+b.dataset.lv;draw();};});
      var nq=$('#nq');if(nq)nq.onclick=next;
      $$('[data-pt]').forEach(function(b){b.onclick=function(){award(b.dataset.pt,pts());done();};});
      $$('[data-st]').forEach(function(b){b.onclick=function(){award(b.dataset.st,1);done();};});
      $$('[data-adj]').forEach(function(b){b.onclick=function(){award(b.dataset.adj,-1);draw();};});
      if(q){$('#tp').onclick=function(){running?stop():start();draw();};$('#sa').onclick=function(){showAns=!showAns;draw();};$('#sk').onclick=done;var wr=$('#wr');if(wr)wr.onclick=function(){W.snd('end');steal=true;showAns=false;draw();};}}
    function tlimit(){var t=W.set().t;return q?(t[q.t]||30):30;}
    function pts(){return q?(+W.set().pts[q.lv]||q.lv):1;}
    function qhtml(q){var a=q.a;return '<div class="qmeta"><span class="tag l'+q.lv+'">'+W.LVp[q.lv]+'</span><span class="tag">'+W.TY[q.t]+'</span><span class="tag">'+ar(pts())+' '+(pts()===1?'نقطة':'نقاط')+'</span>'+(steal?'<span class="tag l3">فرصة الاستحواذ للشعب الأخرى</span>':'')+'</div>'+(q.img?'<img class="qimg" src="'+q.img+'" alt="">':'')+
      '<p class="qtext">'+esc(q.q).replace(/_{2,}/g,'<span style="display:inline-block;min-width:90px;border-bottom:2px dashed var(--gold)"></span>')+'</p>'+
      (q.t==='mc'||q.t==='fl'?'<div class="opts">'+A.cur.ord.map(function(i,k){return '<div class="opt'+(showAns?(i===a?' ok':' dim'):'')+'"><span class="l">'+W.KEYS[k]+'</span><span>'+esc(q.o[i])+'</span></div>';}).join('')+'</div>':'')+
      (q.t==='tf'?'<div class="opts"><div class="opt'+(showAns?(a?' ok':' dim'):'')+'"><span class="l">✓</span>صواب</div><div class="opt'+(showAns?(!a?' ok':' dim'):'')+'"><span class="l">✗</span>خطأ</div></div>':'')+
      (q.t==='sa'&&showAns?'<div class="answer"><small>الإجابة النموذجية</small>'+esc(a)+'</div>':'');}
    function next(){var pool=G.bank.items.filter(function(x){return A.les.indexOf(x.l)>=0&&A.ty.indexOf(x.t)>=0&&A.used.indexOf(x.id)<0;});
      var lv=lvPick||[1,1,2,2,3][A.n%5];var c=pool.filter(function(x){return x.lv===lv;});if(!c.length)c=pool;if(!c.length){W.toast('انتهت الأسئلة المتاحة في البنك لهذه الإعدادات');return;}
      var pick=W.shuffle(c).sort(function(a,b){return ((G.comp.used||{})[a.id]||0)-((G.comp.used||{})[b.id]||0);})[0];
      A.cur={id:pick.id,ord:pick.o?W.shuffle(pick.o.map(function(x,i){return i;})):null};A.used.push(pick.id);showAns=false;steal=false;q=pick;left=tlimit();W.saveComp();draw();start();}
    function start(){clearInterval(timer);running=true;timer=setInterval(function(){left--;W.setT(left,tlimit());if(left<=5&&left>0)W.snd('tick');if(left<=0){stop();W.snd('end');showAns=true;draw();}},1000);}
    function stop(){clearInterval(timer);running=false;}
    function award(s,p){A.sc[s]=(A.sc[s]||0)+p;A.log.push({s:s,p:p});W.snd(p>0?'ok':'tick');W.saveComp();var el=$('[data-t="'+s+'"] .sc');if(el){el.textContent=ar(A.sc[s]);el.classList.remove('bump');void el.offsetWidth;el.classList.add('bump');}}
    function done(){stop();A.cur=null;A.n++;A.turn++;q=null;showAns=false;steal=false;left=0;W.saveComp();setTimeout(draw,p0());}
    function p0(){return 350;}
    function finish(){stop();var ord=A.secs.slice().sort(function(a,b){return (A.sc[b]||0)-(A.sc[a]||0);});var tie=ord.length>1&&(A.sc[ord[0]]||0)===(A.sc[ord[1]]||0);
      var d=W.dlg('<h2>إنهاء المواجهة</h2>'+(tie?'<p class="tag l3" style="font-size:14px">تعادل في الصدارة! يمكنكِ طرح سؤال حاسم ثم الإنهاء، أو اختيار الفائزة.</p>':'')+'<div class="grid">'+ord.map(function(s,i){return '<label class="card" style="display:flex;gap:10px;align-items:center;padding:10px 14px;cursor:pointer"><input type="radio" name="w" value="'+s+'"'+(i===0?' checked':'')+' style="width:22px;height:22px;accent-color:var(--green)"><b class="kufi" style="flex:1;font-size:18px">'+esc(W.secName(s))+'</b><b>'+ar(A.sc[s]||0)+'</b></label>';}).join('')+'</div><div class="row" style="justify-content:flex-end;margin-top:12px"><button class="btn ghost" data-close>متابعة الأسئلة</button><button class="btn gld" id="ok">'+ic('trophy')+'إعلان الفائزة</button></div>');
      $('#ok',d).onclick=function(){var w=$('input[name=w]:checked',d).value;d.close();if(mid)W.setWinner(mid,w,W.clone(A.sc),'arena');var fin=m&&m.final;delete G.comp.arena[key];W.saveComp(true);celebrate(w,fin);};}
    function celebrate(w,fin){W.confetti(fin?6000:3500);W.snd('ok');var d=W.dlg('<div class="winner"><img src="img/trophy.webp" alt="" style="mix-blend-mode:multiply;border-radius:50%"><span class="muted">'+(fin?'الشعبة الفائزة بالمسابقة المنهجية «هذا وطني»':'الشعبة المتأهلة')+'</span><span class="wn">'+esc(W.secName(w))+'</span><span class="naskh" style="font-size:22px;color:var(--hd)">'+(fin?'أَلْفُ مَبْرُوكٍ لِلْبَطَلَات':'مَبْرُوكٌ التَّأَهُّل')+'</span>'+(W.nick(w)?'<span class="muted">'+esc(W.nick(w))+'</span>':'')+'<div class="row" style="justify-content:center">'+(fin?'<a class="btn gld" href="#/t/honor" data-close>'+ic('trophy')+'لوحة الشرف</a><a class="btn" href="#/t/certs" data-close>'+ic('award')+'الشهادات</a>':'<a class="btn grn" href="#/t/bracket" data-close>'+ic('tree')+'التصفيات</a>')+'</div></div>',{wide:true,onClose:function(){W.go(fin?'#/t/honor':'#/t/bracket');}});}
    draw();}};

/* =====================================================================
   لوحة الشرف والمعرض
   ===================================================================== */
W.tviews.honor=function(main){function draw(){var rk=W.ranking(),top=rk.slice(0,3),b=(G.site&&G.site.board)||{};
  W.view(main,W.head('لوحة الشرف','تكريم الطالبات والشعبة الحاصلة على المركز الأول تقديرًا لتميّزهن.')+
   '<section class="card corner" style="text-align:center">'+(top.length?W.podium(top):'<div class="empty"><img src="img/trophy.webp" alt="" style="mix-blend-mode:multiply;border-radius:50%"><p>تظهر منصة التتويج بعد نتائج التصفيات.</p></div>')+
   '<div class="row" style="justify-content:center;margin-top:12px"><label class="chip" style="font-size:15px;padding:8px 16px"><input type="checkbox" id="pub"'+(b.show?' checked':'')+' style="accent-color:var(--green);width:18px;height:18px"> إظهار لوحة الشرف للطالبات</label><input class="inp" id="note" style="max-width:380px" placeholder="عبارة تظهر تحتها (اختياري)" value="'+esc(b.note||'')+'"><button class="btn grn" id="sv">'+ic('save')+'نشر</button></div><p class="muted" style="margin-bottom:0">تظهر للطالبات أسماء الشعب فقط، ولا تُنشر أسماء الطالبات.</p></section>'+
   '<section class="card"><div class="sec-head"><h2 style="margin:0">الطالبات المتميزات</h2><button class="btn pri" id="ah">'+ic('plus')+'إضافة طالبة</button></div><div class="grid g3" style="margin-top:12px">'+(G.comp.honors.length?G.comp.honors.map(function(h,i){return '<div class="card" style="display:flex;gap:12px;align-items:center;padding:14px"><span class="badge o">'+ic('star').replace('<svg','<svg style="width:26px;height:26px"')+'</span><div style="flex:1;min-width:0"><b class="kufi" style="font-size:17px">'+esc(h.name)+'</b><div class="muted">'+esc(W.secName(h.sec))+(h.why?' · '+esc(h.why):'')+'</div></div><button class="icon-x" data-x="'+i+'" aria-label="حذف">✕</button></div>';}).join(''):'<p class="muted">أضيفيهن من هنا أو من صفحة النتائج بزر النجمة ✩، ثم اطبعي لهن الشهادات.</p>')+'</div></section>'+
   '<section class="card"><div class="sec-head"><h2 style="margin:0">معرض المسابقة</h2><button class="btn pri" id="ap">'+ic('img')+'أضيفي صورة</button></div><p class="muted">صور من أجواء المسابقة والتكريم، تظهر للمعلمات فقط.</p><div class="gal" id="gal"></div></section>');
  $('#sv').onclick=function(){DB.saveSite({board:{show:$('#pub').checked,top:top,note:$('#note').value.trim(),at:Date.now()}}).then(function(){W.toast($('#pub').checked?'نُشرت لوحة الشرف للطالبات ✓':'أُخفيت لوحة الشرف عن الطالبات');});};
  $('#ah').onclick=function(){W.addHonor();};$('#ap').onclick=W.addPhoto;
  $$('[data-x]').forEach(function(b){b.onclick=function(){var h=G.comp.honors[+b.dataset.x];W.ask('إزالة «'+esc(h.name)+'» من لوحة الشرف؟',function(){G.comp.honors.splice(+b.dataset.x,1);W.saveComp(true);draw();},{ok:'إزالة',danger:true});};});
  gal();}
  function gal(){var el=$('#gal');if(!el)return;el.innerHTML=G.gal.length?G.gal.map(function(g){return '<figure class="card ph" style="margin:0;position:relative"><img src="'+g.img+'" alt="'+esc(g.title||'')+'" data-z="'+g.id+'"><figcaption class="cap"><b>'+esc(g.title||'')+'</b>'+(g.desc?'<p>'+esc(g.desc)+'</p>':'')+'</figcaption><button class="icon-x x" data-dg="'+g.id+'" aria-label="حذف الصورة">✕</button></figure>';}).join(''):'<div class="empty" style="grid-column:1/-1">لا صور بعد.</div>';
    $$('[data-z]',el).forEach(function(i){i.onclick=function(){var g=G.gal.filter(function(x){return x.id===i.dataset.z;})[0];W.dlg('<div class="lightbox"><img src="'+g.img+'" alt=""><h2 style="margin-top:10px">'+esc(g.title||'')+'</h2><p>'+esc(g.desc||'')+'</p></div>',{wide:true});};});
    $$('[data-dg]',el).forEach(function(b){b.onclick=function(){W.ask('حذف هذه الصورة من المعرض؟',function(){DB.delGal(b.dataset.dg).then(function(){W.toast('حُذفت الصورة');});},{danger:true,ok:'حذف'});};});}
  draw();W.onData=function(k){if(k==='gal')gal();else if(k==='comp')draw();};};
W.addHonor=function(pre){pre=pre||{};var d=W.dlg('<h2>طالبة متميزة</h2><div class="form"><label class="f">الاسم<input class="inp" id="hn" value="'+esc(pre.name||'')+'"></label><label class="f">الشعبة<select class="inp" id="hs">'+W.SECS.map(function(s){return '<option value="'+s.id+'"'+(pre.sec===s.id?' selected':'')+'>'+s.name+'</option>';}).join('')+'</select></label><label class="f">سبب التكريم<input class="inp" id="hw" value="'+esc(pre.why||'')+'" placeholder="مثال: أعلى درجة في التصفيات الأولى"></label><div class="row" style="justify-content:flex-end"><button class="btn ghost" data-close>إلغاء</button><button class="btn grn" id="ok">'+ic('star')+'إضافة</button></div></div>');
  $('#ok',d).onclick=function(){var n=$('#hn',d).value.trim();if(!n){W.toast('اكتبي الاسم');return;}G.comp.honors.push({name:n,sec:$('#hs',d).value,why:$('#hw',d).value.trim()});W.saveComp(true);d.close();W.toast('أُضيفت إلى لوحة الشرف ✓');if(W.onData)W.onData('comp');};};
W.addPhoto=function(){W.pickImage(function(u){var d=W.dlg('<h2>صورة للمعرض</h2><img src="'+u+'" alt="" style="width:100%;border-radius:14px;max-height:50vh;object-fit:contain;background:var(--surface2)"><div class="form" style="margin-top:10px"><label class="f">العنوان<input class="inp" id="gt" placeholder="مثال: نهائي المسابقة"></label><label class="f">الوصف<textarea class="inp" id="gd" rows="2"></textarea></label><div class="row" style="justify-content:flex-end"><button class="btn ghost" data-close>إلغاء</button><button class="btn grn" id="ok">'+ic('save')+'حفظ</button></div></div>');
  $('#ok',d).onclick=function(){var g={img:u,title:$('#gt',d).value.trim(),desc:$('#gd',d).value.trim()};$('#ok',d).disabled=true;DB.saveGal(g).then(function(){d.close();W.toast('أُضيفت الصورة ✓');if(location.hash.indexOf('honor')<0)W.go('#/t/honor');}).catch(function(e){$('#ok',d).disabled=false;W.toast('تعذّر الحفظ: '+(e&&e.message||''));});};},1400,.78);};

/* =====================================================================
   الشهادات
   ===================================================================== */
var CT={sec1:['شَهَادَةُ تَكْرِيم','المركز الأول'],sec2:['شَهَادَةُ تَكْرِيم','المركز الثاني'],sec3:['شَهَادَةُ تَكْرِيم','المركز الثالث'],stu:['شَهَادَةُ تَمَيُّز',''],part:['شَهَادَةُ مُشَارَكَة',''],tch:['شَهَادَةُ شُكْرٍ وَتَقْدِير','']};
W.certHTML=function(c){var s=W.set();var txt={
  sec1:'تُمنح لطالبات الشعبة لحصولهن على <b>المركز الأول</b> في المسابقة المنهجية «هذا وطني» للصف الحادي عشر، تقديرًا لتميّزهن وتعاونهن، متمنين لهن دوام التفوق والنجاح.',
  sec2:'تُمنح لطالبات الشعبة لحصولهن على <b>المركز الثاني</b> في المسابقة المنهجية «هذا وطني» للصف الحادي عشر، تقديرًا لجهودهن المتميزة، متمنين لهن دوام التفوق.',
  sec3:'تُمنح لطالبات الشعبة لحصولهن على <b>المركز الثالث</b> في المسابقة المنهجية «هذا وطني» للصف الحادي عشر، تقديرًا لجهودهن، متمنين لهن دوام التفوق.',
  stu:'تُمنح للطالبة تقديرًا لتميّزها في المسابقة المنهجية «هذا وطني» للصف الحادي عشر'+(c.why?'، '+esc(c.why):'')+'، متمنين لها دوام التفوق والنجاح.',
  part:'تُمنح تقديرًا للمشاركة الفاعلة في المسابقة المنهجية «هذا وطني» للصف الحادي عشر، وإسهامها في تعزيز روح المنافسة الإيجابية والانتماء للوطن.',
  tch:'تقديرًا لجهودها المخلصة في إعداد وتنفيذ المسابقة المنهجية «هذا وطني» للصف الحادي عشر، وإسهامها في رفع مستوى التحصيل وتعزيز الانتماء الوطني.'}[c.t];
  var rank=CT[c.t][1];
  return '<div class="cert"><div class="pat"></div><span class="flag"></span><img class="fort" src="img/fort.webp" alt=""><div class="frame"></div>'+(rank?'<div class="rank">'+rank+'</div>':'')+
   '<div class="body"><div class="hdr"><div style="text-align:start"><img class="sch" src="img/school.webp" alt=""><br>سلطنة عُمان<br>وزارة التعليم<br>'+esc(s.school)+'</div><img src="img/emblem.webp" alt=""><div style="text-align:end">المسابقة المنهجية<br>«هذا وطني»<br>'+esc(s.year)+'</div></div>'+
   '<div class="ct">'+CT[c.t][0]+'</div><div class="cs">الصف الحادي عشر · الفصل الدراسي الأول</div><div class="who">'+esc(c.who)+'</div>'+(c.sub?'<div class="cs" style="color:#7D6B55">'+esc(c.sub)+'</div>':'')+
   '<div class="txt">'+txt+'</div><div class="slog">مَعًا .. نَعْرِفُ وَطَنَنَا وَنَعْتَزُّ بِهِ</div>'+
   '<div class="sig"><div>'+esc(s.teachers)+(s.lead?'<br><small style="font-weight:500">'+esc(s.lead)+'</small>':'')+'<span>التوقيع</span></div><div>مديرة المدرسة'+(s.principal?'<br><small style="font-weight:500">'+esc(s.principal)+'</small>':'')+'<span>التوقيع</span></div></div></div></div>';};
W.tviews.certs=function(main){var st=W.lsg('cert',{t:'sec1',sec:'',names:''}),rk=W.ranking();
  function list(){var t=st.t;if(t==='sec1'||t==='sec2'||t==='sec3'){var s=st.sec||rk[{sec1:0,sec2:1,sec3:2}[t]]||'11-1';return [{t:t,who:'الشعبة '+W.secName(s),sub:W.nick(s)}];}
    if(t==='part'){return (st.sec?[st.sec]:W.SECS.map(function(x){return x.id;})).map(function(s){return {t:t,who:'طالبات الشعبة '+W.secName(s),sub:W.nick(s)};});}
    var names=st.names.split('\n').map(function(x){return x.trim();}).filter(Boolean);return names.map(function(n){var p=n.split('|');var h=G.comp.honors.filter(function(x){return x.name===p[0].trim();})[0];return {t:t,who:p[0].trim(),sub:t==='stu'?(h?'الشعبة '+W.secName(h.sec):(st.sec?'الشعبة '+W.secName(st.sec):'')):'',why:h&&h.why};});}
  function draw(){var L=list();W.view(main,W.head('الشهادات','شهادات التكريم بهوية المسابقة، جاهزة للطباعة على ورق A4 بالعرض.','<button class="btn pri" id="pr"'+(L.length?'':' disabled')+'>'+ic('printer')+'طباعة '+ar(L.length)+' شهادة</button>')+
    '<section class="card form"><div class="f"><b>نوع الشهادة</b><div class="row">'+Object.keys(CT).map(function(k){return '<button class="chip'+(st.t===k?' on':'')+'" data-t="'+k+'" style="font-size:15px;padding:6px 14px">'+CT[k][0].replace(/[ًٌٍَُِّْ]/g,'')+(CT[k][1]?' · '+CT[k][1]:'')+'</button>';}).join('')+'</div></div>'+
    (st.t!=='stu'&&st.t!=='tch'?'<label class="f">الشعبة<select class="inp" id="sc" style="max-width:320px"><option value="">'+(st.t==='part'?'كل الشعب (١٢ شهادة)':'حسب نتيجة التصفيات')+'</option>'+W.SECS.map(function(s){return '<option value="'+s.id+'"'+(st.sec===s.id?' selected':'')+'>'+s.name+'</option>';}).join('')+'</select></label>':'')+
    (st.t==='stu'||st.t==='tch'?'<label class="f">'+(st.t==='stu'?'أسماء الطالبات (اسم في كل سطر)':'أسماء المعلمات (اسم في كل سطر)')+'<textarea class="inp" id="nm" rows="4">'+esc(st.names)+'</textarea></label>'+(st.t==='stu'&&G.comp.honors.length?'<button class="btn sm" id="fh" style="align-self:flex-start">'+ic('star')+'إدراج طالبات لوحة الشرف ('+ar(G.comp.honors.length)+')</button>':''):'')+'</section>'+
    '<div class="cert-prev" id="pv"></div>');
    var pv=$('#pv');if(L.length){pv.innerHTML=W.certHTML(L[0]);var c=$('.cert',pv),sc=Math.min(1,(pv.clientWidth-20)/c.offsetWidth);c.style.transform='scale('+sc+')';pv.style.height=(c.offsetHeight*sc+24)+'px';}else pv.innerHTML='<p class="empty">اكتبي الأسماء لتظهر المعاينة.</p>';
    $$('[data-t]').forEach(function(b){b.onclick=function(){st.t=b.dataset.t;st.sec='';W.lss('cert',st);draw();};});
    var s=$('#sc');if(s)s.onchange=function(){st.sec=s.value;W.lss('cert',st);draw();};
    var n=$('#nm');if(n)n.onchange=function(){st.names=n.value;W.lss('cert',st);draw();};
    var fh=$('#fh');if(fh)fh.onclick=function(){st.names=G.comp.honors.map(function(h){return h.name;}).join('\n');W.lss('cert',st);draw();};
    $('#pr').onclick=function(){var n2=$('#nm');if(n2){st.names=n2.value;W.lss('cert',st);}$('#print').innerHTML=list().map(W.certHTML).join('');setTimeout(function(){window.print();},300);};}
  draw();};

/* =====================================================================
   الإعدادات
   ===================================================================== */
W.tviews.settings=function(main){function draw(){var s=W.set();
  W.view(main,W.head('الإعدادات','بيانات المسابقة والنقاط والتوقيت وأسماء الشعب والنسخ الاحتياطي.')+
   '<div class="grid g2"><section class="card form"><h2>بيانات المسابقة</h2>'+[['school','المدرسة'],['year','العام الدراسي'],['month','موعد التنفيذ'],['teachers','الجهة المنفذة (تظهر في الشهادات)'],['lead','المعلمة المشرفة على المسابقة'],['principal','اسم مديرة المدرسة (للشهادات)']].map(function(f){return '<label class="f">'+f[1]+'<input class="inp" data-s="'+f[0]+'" value="'+esc(s[f[0]]||'')+'"></label>';}).join('')+'</section>'+
   '<section class="card form"><h2>النقاط والتوقيت</h2><div class="grid g3" style="gap:8px">'+[1,2,3].map(function(l){return '<label class="f">نقاط '+W.LVp[l]+'<input class="inp" type="number" min="1" max="10" data-p="'+l+'" value="'+s.pts[l]+'"></label>';}).join('')+'</div><b>ثواني كل سؤال في ساحة العرض</b><div class="grid g4" style="gap:8px">'+Object.keys(W.TY).map(function(t){return '<label class="f">'+W.TY[t]+'<input class="inp" type="number" min="5" max="300" data-tm="'+t+'" value="'+s.t[t]+'"></label>';}).join('')+'</div>'+
   '<label class="f" style="flex-direction:row;align-items:center;gap:10px"><input type="checkbox" id="mu"'+(W.lsg('mute',false)?'':' checked')+' style="width:22px;height:22px;accent-color:var(--green)">نقرات صوتية هادئة (على هذا الجهاز)</label></section></div>'+
   '<section class="card"><h2>أسماء الفرق (اختياري)</h2><p class="muted" style="margin-top:0">لقب لكل شعبة يظهر في الساحة والتصفيات والشهادات، مثل «فريق القلعة».</p><div class="grid g4" style="gap:10px">'+G.comp.secs.map(function(x){return '<label class="secard card" style="padding:10px"><span class="badge" style="width:44px;height:44px;font-size:16px">'+esc(W.secName(x.id).replace('١١/',''))+'</span><input data-nick="'+x.id+'" value="'+esc(x.nick||'')+'" placeholder="'+esc(W.secName(x.id))+'"></label>';}).join('')+'</div></section>'+
   '<div class="grid g2"><section class="card form"><h2>الدخول</h2><p class="muted" style="margin:0">كلمة سر واحدة تشترك فيها المعلمات. '+(DB.mode==='cloud'?'البيانات متزامنة بين أجهزة المعلمات عبر Google Firebase.':'هذه النسخة تعمل على هذا الجهاز فقط.')+'</p><label class="f">كلمة سر جديدة<input class="inp" type="password" id="np" minlength="6" autocomplete="new-password"></label><button class="btn" id="cp">'+ic('lock')+'تغيير كلمة السر</button></section>'+
   '<section class="card form"><h2>النسخة الاحتياطية</h2><p class="muted" style="margin:0">ملف واحد فيه بنك الأسئلة والشعب والتصفيات ولوحة الشرف.</p><div class="row"><button class="btn grn" id="bk">'+ic('dl')+'تنزيل نسخة احتياطية</button><button class="btn" id="rsr">'+ic('up')+'استعادة من ملف</button></div><hr style="border:0;border-top:1px dashed var(--line2);width:100%"><div class="row"><button class="btn ghost" id="ru">'+ic('undo')+'تصفير عدّاد استخدام الأسئلة</button><button class="btn" id="ins">'+ic('dl')+'تثبيت المنصة</button><button class="btn" id="qr">'+ic('qr')+'رابط الطالبات</button></div></section></div>');
  $$('[data-s]').forEach(function(i){i.onchange=function(){G.comp.set[i.dataset.s]=i.value.trim();W.saveComp();if(['lead','school','year'].indexOf(i.dataset.s)>=0){var o={};o[i.dataset.s]=i.value.trim();DB.saveSite(o);}W.toast('حُفظ ✓');};});
  $$('[data-p]').forEach(function(i){i.onchange=function(){G.comp.set.pts[i.dataset.p]=Math.max(1,+i.value||1);W.saveComp();W.toast('حُفظ ✓');};});
  $$('[data-tm]').forEach(function(i){i.onchange=function(){G.comp.set.t[i.dataset.tm]=Math.max(5,+i.value||30);W.saveComp();W.toast('حُفظ ✓');};});
  $$('[data-nick]').forEach(function(i){i.onchange=function(){G.comp.secs.forEach(function(x){if(x.id===i.dataset.nick)x.nick=i.value.trim();});W.saveComp();W.toast('حُفظ ✓');};});
  $('#mu').onchange=function(){W.lss('mute',!this.checked);};
  $('#cp').onclick=function(){var p=$('#np').value;if(p.length<6){W.toast('ستّ خانات على الأقل');return;}DB.changePw(p).then(function(){$('#np').value='';W.toast('تغيّرت كلمة السر ✓ أبلغي زميلاتك');}).catch(function(e){W.toast(/recent/.test(e&&e.code||'')?'اخرجي وادخلي من جديد ثم غيّريها':'تعذّر التغيير');});};
  $('#bk').onclick=function(){W.download('نسخة-هذا-وطني-'+new Date().toISOString().slice(0,10)+'.json',JSON.stringify({app:'watani',at:Date.now(),comp:G.comp,bank:G.bank},null,1));};
  $('#rsr').onclick=function(){var i=document.createElement('input');i.type='file';i.accept='.json,application/json';i.onchange=function(){var f=i.files[0];if(!f)return;f.text().then(function(t){var j=JSON.parse(t);if(j.app!=='watani'||!j.comp||!j.bank)throw 0;
    W.ask('استبدال بيانات المسابقة الحالية بمحتوى الملف؟',function(){G.comp=j.comp;G.bank=j.bank;W.saveComp(true);DB.saveT('bank',G.bank);W.toast('استُعيدت النسخة ✓');draw();},{ok:'استعادة',danger:true});}).catch(function(){W.toast('ملف غير صالح');});};i.click();};
  $('#ru').onclick=function(){G.comp.used={};W.saveComp(true);W.toast('صُفّر العدّاد');};$('#ins').onclick=W.install;$('#qr').onclick=W.showQR;}
  draw();};
})();
