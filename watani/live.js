/* =====================================================================
   «تحدّي هذا وطني» · المنافسة المباشرة
   الأسئلة تظهر على أجهزة الطالبات (كل جهاز يدخل باسم شعبته)، والنقاط على الجهاز الرئيسي (لابتوب المعلمة).
   - أسرع إجابة صحيحة تكسب نقاط السؤال لشعبتها، وكل إجابة خاطئة تخصم من شعبتها، والصحيحة الأبطأ لا تُضاف ولا تُخصم.
   - تُحسب أول إجابة من كل شعبة فقط، والسرعة بوقت خادم Firebase لا بساعة الجهاز.
   البيانات (بلا قواعد جديدة):
     watani_round/{lvID}      وثيقة التحكم kind:'livectl' (الحالة، السؤال المعروض بلا إجابة، النقاط، الكشف)
     watani_round/{lvIDqN}    جولة سؤال واحد kind:'liveq' مفتوحة أثناء السؤال فقط
     watani_sub/{rid_uid}     إجابة الجهاز (مرة واحدة لكل سؤال)، والانضمام تسليم فارغ على وثيقة التحكم
   ===================================================================== */
(function(){
'use strict';
var $=W.$,$$=W.$$,esc=W.esc,ar=W.ar,ic=W.ic,G=W.G,DB=window.WDB;
var LTY={mc:'اختيار من متعدد',tf:'صواب أو خطأ',fl:'أكملي الفراغ'};
function signed(n){return '<bdi dir="ltr">'+(n>0?'+':(n<0?'−':''))+ar(Math.abs(n))+'</bdi>';}
function num(n){n=n||0;return '<bdi dir="ltr">'+(n<0?'−':'')+ar(Math.abs(n))+'</bdi>';}
function qtext(t){return esc(t).replace(/_{2,}/g,'<span style="display:inline-block;min-width:80px;border-bottom:2px dashed var(--gold)"></span>');}
function sortedSecs(secs,sc){return secs.slice().sort(function(a,b){return (sc[b]||0)-(sc[a]||0);});}

/* =====================================================================
   جهاز الطالبة
   ===================================================================== */
W.routes.live=function(p){var id=p[0],main=W.shell('s','');var m=W.me();
  if(!m){W.go('#/');W.toast('اختاري شعبتك أولًا');return;}
  main.innerHTML='<div class="card empty">جارٍ الاتصال بالمنافسة…</div>';
  var C=null,shown='',seenAt={},timer=null,mine={};
  try{mine=JSON.parse(sessionStorage.getItem('watani:lvmine:'+id)||'{}');}catch(e){}
  function keepMine(){try{sessionStorage.setItem('watani:lvmine:'+id,JSON.stringify(mine));}catch(e){}}
  DB.student().then(function(){DB.submit(id,{name:m.name,sec:m.sec,ans:{},tm:{},dur:0}).catch(function(){});}).catch(function(){});
  var off=DB.watchRound(id,function(c){C=c;draw();},function(){main.innerHTML='<div class="card empty">تعذّر الاتصال بالإنترنت.<br><a class="btn" href="#/">العودة</a></div>';});
  W.cleanup=function(){off();clearInterval(timer);document.body.classList.remove('stage-mode');};
  function scoreStrip(){var sc=C.sc||{},ord=sortedSecs(C.secs||[],sc),rk=ord.indexOf(m.sec)+1;
    return '<div class="lv-me"><span class="badge">'+esc(W.secName(m.sec).replace('١١/',''))+'</span><div><b class="kufi">شُعْبَةُ '+esc(W.secName(m.sec))+'</b><div class="muted">الترتيب '+ar(rk)+' من '+ar(ord.length)+'</div></div><div class="pts"><b>'+num(sc[m.sec])+'</b><small>نقطة</small></div></div>';}
  function draw(){
    if(!C||(!C.open&&C.st!=='end')){clearInterval(timer);document.body.classList.remove('stage-mode');W.view(main,'<div class="card empty"><img src="img/trophy.webp" alt="" style="mix-blend-mode:multiply;border-radius:50%"><p>انتهت المنافسة المباشرة أو أُغلقت.</p><a class="btn" href="#/">العودة</a></div>');shown='';return;}
    if((C.secs||[]).indexOf(m.sec)<0){W.view(main,'<div class="card empty">شعبتك ليست ضمن هذه المنافسة.<br><a class="btn" href="#/">العودة</a></div>');shown='';return;}
    document.body.classList.add('stage-mode');
    var k=C.st+'|'+C.n;
    if(k===shown){var s=$('.lv-me');if(s)s.outerHTML=scoreStrip();return;}
    shown=k;clearInterval(timer);
    if(C.st==='wait'){W.view(main,'<div class="lv-stu">'+scoreStrip()+'<section class="card corner lv-wait"><span class="pulse"></span><h2>اسْتَعِدِّي!</h2><p class="muted">'+(C.n?'السؤال القادم يظهر هنا خلال لحظات.':'انضممتِ إلى المنافسة المباشرة. السؤال الأول يظهر هنا عندما تبدأ المعلمة.')+'</p><p class="naskh lv-rule">أَسْرَعُ إِجَابَةٍ صَحِيحَةٍ تَكْسِبُ، وَالْخَطَأُ يُخْصَمُ</p></section></div>');return;}
    if(C.st==='q'&&C.q){var q=C.q,cur=C.cur,dur=C.dur||20;if(!seenAt[cur])seenAt[cur]=Date.now();var picked=mine[cur];
      var opts=q.t==='tf'?[{v:'true',l:'✓',s:'صواب'},{v:'false',l:'✗',s:'خطأ'}]:q.o.map(function(o,k){return {v:String(o.i),l:W.KEYS[k],s:o.s};});
      var v=W.view(main,'<div class="lv-stu">'+scoreStrip()+'<section class="card qbox corner"><div class="arena-top"><div class="qmeta"><span class="tag">السؤال '+ar(C.n)+' من '+ar(C.total)+'</span><span class="tag l'+q.lv+'">'+W.LVp[q.lv]+'</span><span class="tag">'+ar(q.pts)+' '+(q.pts===1?'نقطة':'نقاط')+'</span></div>'+W.tmr(dur)+'</div>'+(q.img?'<img class="qimg" src="'+q.img+'" alt="">':'')+
        '<p class="qtext">'+qtext(q.q)+'</p><div class="opts lv-opts">'+opts.map(function(o){return '<button class="opt" type="button" data-v="'+o.v+'"><span class="l">'+o.l+'</span><span>'+esc(o.s)+'</span></button>';}).join('')+'</div><div id="lvmsg" class="lv-msg"></div></section></div>');
      function lock(val,msg){$$('.opt',v).forEach(function(b){b.disabled=true;b.classList.toggle('ok',val!=null&&b.dataset.v===String(val));if(val!=null&&b.dataset.v!==String(val))b.classList.add('dim');});$('#lvmsg').innerHTML=msg;}
      if(picked!=null)lock(picked.v,'<b>أُرسلت إجابتك ✓</b> انتظري النتيجة على شاشة الصف');
      $$('.opt',v).forEach(function(b){b.onclick=function(){if(b.disabled||mine[cur])return;var raw=b.dataset.v,val=q.t==='tf'?raw==='true':+raw,ms=Date.now()-seenAt[cur];
        mine[cur]={v:val};keepMine();lock(val,'جارٍ الإرسال…');W.snd('tick');
        DB.submit(cur,{name:m.name,sec:m.sec,ans:{x:val},tm:{x:ms},dur:Math.round(ms/1000)}).then(function(){var e=$('#lvmsg');if(e)e.innerHTML='<b>أُرسلت إجابتك ✓</b> انتظري النتيجة على شاشة الصف';})
         .catch(function(e){var c=e&&e.message,x=$('#lvmsg');if(c==='dup'){if(x)x.innerHTML='<b>وصلت إجابتك مسبقًا ✓</b>';return;}
           if(c==='closed'){if(x)x.innerHTML='<b>انتهى وقت السؤال قبل وصول إجابتك</b>';return;}
           delete mine[cur];keepMine();if(x)x.innerHTML='تعذّر الإرسال، تحققي من الإنترنت ثم أعيدي الضغط';$$('.opt',v).forEach(function(bb){bb.disabled=false;bb.classList.remove('ok','dim');});});};});
      var tick=function(){var left=Math.max(0,Math.ceil(dur-(Date.now()-seenAt[cur])/1000));W.setT(left,dur);if(left<=0){clearInterval(timer);if(!mine[cur])lock(null,'انتهى الوقت');}};tick();timer=setInterval(tick,250);return;}
    if(C.st==='rev'&&C.q){var q2=C.q,rv=C.rev||{},my=mine[C.cur],d=(rv.d||{})[m.sec],k2=rv.k;
      var right=q2.t==='tf'?(k2?'صواب':'خطأ'):((q2.o.filter(function(o){return String(o.i)===String(k2);})[0]||{}).s);
      var res=d==null?(my?'<span class="tag">لم تصل الإجابة في الوقت</span>':'<span class="tag">لم تُجب الشعبة</span>'):(d>0?'<div class="lv-big ok">'+signed(d)+'<small>أسرع إجابة صحيحة! أحسنتِ</small></div>':(d<0?'<div class="lv-big bad">'+signed(d)+'<small>إجابة خاطئة</small></div>':'<div class="lv-big">٠<small>صحيحة، لكن سبقتكِ شعبة أخرى</small></div>'));
      W.view(main,'<div class="lv-stu">'+scoreStrip()+'<section class="card corner lv-rev"><p class="qtext" style="font-size:20px">'+qtext(q2.q)+'</p><div class="answer"><small>الإجابة الصحيحة</small>'+esc(right||'')+'</div>'+res+(rv.win?'<p class="muted">الأسرع: شعبة '+esc(W.secName(rv.win))+'</p>':'<p class="muted">لم تُجب أي شعبة إجابة صحيحة</p>')+'</section></div>');
      if(d>0){W.snd('ok');W.confetti(1500);}else if(d<0)W.snd('end');return;}
    if(C.st==='end'){var sc=C.sc||{},ord=sortedSecs(C.secs||[],sc),won=C.win===m.sec;
      W.view(main,'<div class="lv-stu"><section class="card corner" style="text-align:center"><img src="img/trophy.webp" alt="" style="width:120px;mix-blend-mode:multiply;border-radius:50%"><h1 class="kufi" style="color:var(--hd);margin:4px 0">'+(won?'مَبْرُوكٌ! شُعْبَتُكِ الْفَائِزَة':'انْتَهَتِ الْمُنَافَسَة')+'</h1>'+(C.win?'<p>الشعبة الفائزة: <b>'+esc(W.secName(C.win))+'</b></p>':'')+W.crenel()+
        '<div class="grid" style="gap:8px;margin-top:10px">'+ord.map(function(s,i){return '<div class="card lv-row'+(s===m.sec?' me':'')+'"><span class="badge '+(i<3?'o':'g')+'">'+ar(i+1)+'</span><b class="kufi">شعبة '+esc(W.secName(s))+'</b><b>'+num(sc[s])+'</b></div>';}).join('')+'</div><p class="naskh" style="font-size:20px;color:var(--hd);font-weight:700">مَعًا .. نَعْرِفُ وَطَنَنَا وَنَعْتَزُّ بِهِ</p><a class="btn" href="#/">العودة</a></section></div>');
      if(won){W.confetti(4000);W.snd('ok');}return;}
  }
};

/* =====================================================================
   الجهاز الرئيسي (لابتوب المعلمة)
   ===================================================================== */
W.tviews.live=function(main){
  var L=G.comp.live;
  if(L)play();else setup();
  function setup(){var cfg={secs:[],per:10,les:[1,2],ty:['mc','tf','fl'],ded:1,dur:20};
    function draw(){W.view(main,W.head('المنافسة المباشرة','الأسئلة تظهر على أجهزة الطالبات، والنقاط هنا على شاشة الصف: أسرع إجابة صحيحة تكسب، والخطأ يُخصم.')+
      '<section class="card corner form"><div class="f"><b>الشعب المتنافسة <button type="button" class="chip" id="all" style="font-size:12px">الكل</button> <button type="button" class="chip" id="none" style="font-size:12px">لا شيء</button></b><div class="row">'+W.SECS.map(function(s){return '<button type="button" class="chip'+(cfg.secs.indexOf(s.id)>=0?' on':'')+'" data-sec="'+s.id+'">'+s.name+'</button>';}).join('')+'</div></div>'+
      '<div class="grid g3"><label class="f">عدد الأسئلة<input class="inp" type="number" min="1" max="40" id="per" value="'+cfg.per+'"></label><label class="f">ثوانٍ لكل سؤال<input class="inp" type="number" min="5" max="120" id="dur" value="'+cfg.dur+'"></label>'+
      '<div class="f"><b>خصم الإجابة الخاطئة</b><div class="row">'+[0,1,2,3].map(function(n){return '<button type="button" class="chip'+(cfg.ded===n?' on':'')+'" data-ded="'+n+'">'+(n?'−'+ar(n):'بلا خصم')+'</button>';}).join('')+'</div></div></div>'+
      '<div class="f"><b>الدروس</b><div class="row">'+[1,2].map(function(n){return '<button type="button" class="chip'+(cfg.les.indexOf(n)>=0?' on':'')+'" data-les="'+n+'">الدرس '+(n===1?'الأول':'الثاني')+'</button>';}).join('')+'</div></div>'+
      '<div class="f"><b>أنواع الأسئلة</b><div class="row">'+Object.keys(LTY).map(function(t){return '<button type="button" class="chip'+(cfg.ty.indexOf(t)>=0?' on':'')+'" data-ty="'+t+'">'+LTY[t]+'</button>';}).join('')+'</div><small class="muted">الإجابات القصيرة لا تدخل المنافسة المباشرة لأنها تحتاج تصحيحًا يدويًا.</small></div>'+
      '<p class="muted" style="margin:0">النقاط: أسرع إجابة صحيحة تأخذ نقاط السؤال حسب مستواه (معرفة '+ar(+W.set().pts[1]||1)+'، تطبيق '+ar(+W.set().pts[2]||2)+'، استدلال '+ar(+W.set().pts[3]||3)+')، وكل إجابة خاطئة تخصم من شعبتها. تُحسب أول إجابة تصل من كل شعبة.</p>'+
      '<div class="row"><button class="btn pri lg" id="go"'+(cfg.secs.length<2?' disabled':'')+'>'+ic('play')+'ابدئي المنافسة</button>'+(cfg.secs.length<2?'<span class="muted">اختاري شعبتين على الأقل</span>':'')+'</div></section>');
      $$('[data-sec]').forEach(function(b){b.onclick=function(){keep();var i=cfg.secs.indexOf(b.dataset.sec);if(i>=0)cfg.secs.splice(i,1);else cfg.secs.push(b.dataset.sec);draw();};});
      $('#all').onclick=function(){keep();cfg.secs=W.SECS.map(function(s){return s.id;});draw();};$('#none').onclick=function(){keep();cfg.secs=[];draw();};
      $$('[data-ded]').forEach(function(b){b.onclick=function(){keep();cfg.ded=+b.dataset.ded;draw();};});
      $$('[data-les]').forEach(function(b){b.onclick=function(){keep();var n=+b.dataset.les,i=cfg.les.indexOf(n);if(i>=0){if(cfg.les.length>1)cfg.les.splice(i,1);}else cfg.les.push(n);draw();};});
      $$('[data-ty]').forEach(function(b){b.onclick=function(){keep();var i=cfg.ty.indexOf(b.dataset.ty);if(i>=0){if(cfg.ty.length>1)cfg.ty.splice(i,1);}else cfg.ty.push(b.dataset.ty);draw();};});
      $('#go').onclick=function(){keep();var bt=$('#go');bt.disabled=true;
        /* تنظيف أي منافسة سابقة لم تُغلق */
        (G.liveRaw||[]).forEach(function(r){DB.delRound(r.id).catch(function(){});});
        var id='lv'+DB.rid(),sc={};cfg.secs.forEach(function(s){sc[s]=0;});var secs=W.SECS.map(function(s){return s.id;}).filter(function(s){return cfg.secs.indexOf(s)>=0;});
        var ctl={id:id,kind:'livectl',name:'المنافسة المباشرة',open:true,secs:secs,created:Date.now(),st:'wait',n:0,total:cfg.per,ded:cfg.ded,dur:cfg.dur,sc:sc,q:null,rev:null,cur:null,win:null,qs:[],t:cfg.dur};
        DB.saveRound(ctl,{}).then(function(){L=G.comp.live={id:id,secs:secs,total:cfg.per,les:cfg.les,ty:cfg.ty,ded:cfg.ded,dur:cfg.dur,sc:sc,used:[],n:0,log:[],cur:null,at:Date.now()};W.saveComp(true);play();})
         .catch(function(e){bt.disabled=false;W.toast('تعذّر بدء المنافسة: '+(e&&e.message||''));});};}
    function keep(){var p=$('#per'),d=$('#dur');if(p)cfg.per=Math.max(1,Math.min(40,+p.value||10));if(d)cfg.dur=Math.max(5,Math.min(120,+d.value||20));}
    draw();}

  function play(){document.body.classList.add('stage-mode');
    var C=null,joined={},ans=[],offAns=null,timer=null,left=0,closing=false,lvPick=0,last=null;
    var offC=DB.watchRound(L.id,function(c){C=c;if(!c){return;}if(c.st==='q'&&L.cur&&!offAns)watchAns();draw();},function(){});
    var offJ=DB.watchSubs(L.id,function(a){joined={};a.forEach(function(s){joined[s.sec]=(joined[s.sec]||0)+1;});drawTeams();},function(){});
    W.cleanup=function(){offC();offJ();if(offAns)offAns();clearInterval(timer);};
    if(L.cur&&L.cur.open){watchAns();resumeTimer();}
    function watchAns(){if(offAns)offAns();var rid=L.cur.rid;offAns=DB.watchSubs(rid,function(a){if(!L.cur||L.cur.rid!==rid)return;ans=a;drawTeams();drawCount();
      if(L.cur.open&&!closing&&firsts().length>=L.secs.length)setTimeout(close,900);},function(){});}
    function resumeTimer(){var el=(Date.now()-(L.cur.t0||Date.now()))/1000;left=Math.max(0,Math.ceil(L.dur-el));startTimer();}
    function startTimer(){clearInterval(timer);timer=setInterval(function(){left--;W.setT(Math.max(0,left),L.dur);if(left<=5&&left>0)W.snd('tick');if(left<=-1){clearInterval(timer);close();}},1000);}
    /* أول إجابة من كل شعبة، مرتبة بوقت الخادم */
    function firsts(){var seen={},out=[];ans.slice().sort(function(a,b){return (a.at||9e15)-(b.at||9e15);}).forEach(function(s){if(L.secs.indexOf(s.sec)<0||seen[s.sec])return;seen[s.sec]=1;out.push(s);});return out;}
    function qOf(id){return (G.bank.items||[]).filter(function(x){return x.id===id;})[0];}
    function pts(q){return +W.set().pts[q.lv]||q.lv||1;}
    function save(){W.saveComp();}
    function push(o){return DB.updRound(L.id,o).catch(function(e){W.toast('تعذّر التحديث: '+(e&&e.message||''));});}

    function teamHTML(s,lead){var sc=L.sc[s]||0,st='';
      if(L.cur&&L.cur.open){st=firsts().some(function(x){return x.sec===s;})?'<span class="lvst ans">أجابت ●</span>':'<span class="lvst">…</span>';}
      else if(last&&last.d[s]!=null){var d=last.d[s];st='<span class="lvst '+(d>0?'win':(d<0?'bad':'ok'))+'">'+(d>0?signed(d)+' الأسرع':(d<0?signed(d)+' خطأ':'صحيحة ٠'))+'</span>';}
      else st=joined[s]?'<span class="lvst on">متصلة ✓'+(joined[s]>1?' ('+ar(joined[s])+')':'')+'</span>':'<span class="lvst">بانتظار الدخول</span>';
      return '<div class="team'+(sc===lead&&lead>0?' lead':'')+'" data-t="'+s+'"><div class="nm">'+esc(W.secName(s))+'</div><div class="nick">'+esc(W.nick(s))+'</div><div class="sc">'+num(sc)+'</div>'+st+'<div class="acts"><button class="btn sm ghost" data-pl="'+s+'" aria-label="إضافة نقطة">+</button><button class="btn sm ghost" data-mi="'+s+'" aria-label="خصم نقطة">−</button></div></div>';}
    function drawTeams(){var el=$('#lvteams');if(!el)return;var lead=Math.max.apply(null,L.secs.map(function(s){return L.sc[s]||0;}));el.innerHTML=L.secs.map(function(s){return teamHTML(s,lead);}).join('');
      $$('[data-pl]',el).forEach(function(b){b.onclick=function(){adj(b.dataset.pl,1);};});$$('[data-mi]',el).forEach(function(b){b.onclick=function(){adj(b.dataset.mi,-1);};});}
    function drawCount(){var el=$('#lvcount');if(el)el.textContent='وصلت إجابات '+ar(firsts().length)+' من '+ar(L.secs.length)+' شعب';}
    function draw(){var q=L.cur?qOf(L.cur.id):null,nj=L.secs.filter(function(s){return joined[s];}).length;
      var body;
      if(q&&L.cur.open){body='<div class="qmeta"><span class="tag l'+q.lv+'">'+W.LVp[q.lv]+'</span><span class="tag">'+W.TY[q.t]+'</span><span class="tag">'+ar(pts(q))+' '+(pts(q)===1?'نقطة':'نقاط')+' للأسرع</span><span class="tag l3">الخطأ '+signed(-L.ded)+'</span></div>'+(q.img?'<img class="qimg" src="'+q.img+'" alt="">':'')+'<p class="qtext">'+qtext(q.q)+'</p>'+opts(q,false)+
        '<div class="row" style="justify-content:space-between;align-items:center">'+W.tmr(Math.max(0,left))+'<b id="lvcount" class="muted"></b><button class="btn" id="cl">'+ic('check')+'إنهاء السؤال الآن</button></div>';}
      else if(q&&last){body='<div class="qmeta"><span class="tag">نتيجة السؤال '+ar(L.n)+'</span></div><p class="qtext">'+qtext(q.q)+'</p>'+opts(q,true)+
        '<div class="lvorder">'+(last.rows.length?last.rows.map(function(r,i){return '<div class="card lv-row"><span class="badge '+(r.d>0?'g':(r.d<0?'':'o'))+'">'+ar(i+1)+'</span><b class="kufi">شعبة '+esc(W.secName(r.sec))+'</b><span class="muted">'+(r.sec2!=null?ar(r.sec2.toFixed(1))+' ث':'')+'</span><b class="'+(r.d>0?'g':(r.d<0?'r':''))+'">'+(r.d>0?signed(r.d)+' الأسرع الصحيحة':(r.d<0?signed(r.d)+' خطأ':'صحيحة ·  ٠'))+'</b></div>';}).join(''):'<p class="muted">لم تصل أي إجابة.</p>')+'</div>'+
        '<div class="row" style="justify-content:flex-end">'+nextBtn()+'</div>';}
      else body='<div style="text-align:center;padding:10px"><img src="img/trophy.webp" alt="" style="width:110px;mix-blend-mode:multiply;border-radius:50%"><h2 style="margin:8px 0">'+(L.n>=L.total?'انتهت الأسئلة! اضغطي «إنهاء وإعلان الفائزة»':(L.n?'جاهزات للسؤال التالي؟':'ادخلن من أجهزتكن: صفحة الطالبات ← اختاري شعبتك'))+'</h2><p class="muted">'+ar(nj)+' من '+ar(L.secs.length)+' شعب متصلة الآن</p></div><div class="row" style="justify-content:center">'+nextBtn()+'</div>';
      W.view(main,'<div class="arena"><div class="arena-top"><div><div class="st">المنافسة المباشرة</div><div class="dots">'+Array.apply(null,{length:L.total}).map(function(x,i){return '<i class="'+(i<L.n-(L.cur&&L.cur.open?1:0)?'d':(i===L.n-1&&L.cur&&L.cur.open?'c':''))+'"></i>';}).join('')+'</div></div>'+
        '<div class="row"><span class="tag" style="font-size:14px">السؤال '+ar(L.n)+' من '+ar(L.total)+'</span><button class="btn sm ghost" id="qrl">'+ic('qr')+'رابط الطالبات</button><button class="btn sm ghost" id="fs" aria-label="ملء الشاشة">'+ic('full')+'</button><button class="btn sm ghost" id="ux"'+(L.log.length&&!(L.cur&&L.cur.open)?'':' disabled')+'>'+ic('undo')+'تراجع</button><button class="btn sm gld" id="end">'+ic('trophy')+'إنهاء وإعلان الفائزة</button><button class="btn sm ghost" id="ex">'+ic('out')+'خروج</button></div></div>'+
        '<div class="teams" id="lvteams" style="--n:'+Math.min(L.secs.length,6)+'"></div><section class="card qbox corner">'+body+'</section></div>');
      drawTeams();drawCount();if(q&&L.cur.open)W.setT(Math.max(0,left),L.dur);
      $('#fs').onclick=W.full;$('#qrl').onclick=W.showQR;$('#ex').onclick=function(){W.go('#/t/');};$('#end').onclick=finish;
      $('#ux').onclick=undo;var cl=$('#cl');if(cl)cl.onclick=close;
      $$('[data-lv]').forEach(function(b){b.onclick=function(){lvPick=+b.dataset.lv;draw();};});var nq=$('#nq');if(nq)nq.onclick=ask;}
    function nextBtn(){return '<div class="row" role="group" aria-label="المستوى">'+[[0,'تلقائي'],[1,'معرفة'],[2,'تطبيق'],[3,'استدلال']].map(function(l){return '<button class="chip'+(lvPick===l[0]?' on':'')+'" data-lv="'+l[0]+'">'+l[1]+'</button>';}).join('')+'</div><button class="btn pri lg" id="nq"'+(L.n>=L.total?' disabled':'')+'>'+ic('play')+(L.n?'السؤال التالي':'السؤال الأول')+'</button>';}
    function opts(q,rev){var a=q.a;if(q.t==='tf')return '<div class="opts"><div class="opt'+(rev?(a?' ok':' dim'):'')+'"><span class="l">✓</span>صواب</div><div class="opt'+(rev?(!a?' ok':' dim'):'')+'"><span class="l">✗</span>خطأ</div></div>';
      return '<div class="opts">'+L.cur.ord.map(function(i,k){return '<div class="opt'+(rev?(i===a?' ok':' dim'):'')+'"><span class="l">'+W.KEYS[k]+'</span><span>'+esc(q.o[i])+'</span></div>';}).join('')+'</div>';}

    function ask(){var b=$('#nq');if(b)b.disabled=true;
      var pool=G.bank.items.filter(function(x){return L.les.indexOf(x.l)>=0&&L.ty.indexOf(x.t)>=0&&L.used.indexOf(x.id)<0&&(x.t==='tf'||(x.o&&x.o.length));});
      var lv=lvPick||[1,1,2,2,3][L.n%5];var c=pool.filter(function(x){return x.lv===lv;});if(!c.length)c=pool;if(!c.length){W.toast('انتهت الأسئلة المتاحة في البنك لهذه الإعدادات');if(b)b.disabled=false;return;}
      var pick=W.shuffle(c).sort(function(a,b){return ((G.comp.used||{})[a.id]||0)-((G.comp.used||{})[b.id]||0);})[0];
      var old=L.cur&&L.cur.rid,n=L.n+1,rid=L.id+'q'+n,ord=pick.t==='tf'?null:W.shuffle(pick.o.map(function(x,i){return i;}));
      var pub={q:pick.q,t:pick.t,lv:pick.lv,pts:pts(pick),img:pick.img||null,o:ord?ord.map(function(i){return {i:i,s:pick.o[i]};}):null};
      DB.saveRound({id:rid,kind:'liveq',name:'',open:true,secs:L.secs,created:Date.now(),qs:[],t:L.dur},{}).then(function(){
        return push({st:'q',n:n,cur:rid,q:pub,rev:null,qAt:'now'});}).then(function(){
        if(old)DB.delRound(old).catch(function(){});
        G.comp.used=G.comp.used||{};G.comp.used[pick.id]=(G.comp.used[pick.id]||0)+1;
        L.n=n;L.used.push(pick.id);L.cur={rid:rid,id:pick.id,ord:ord,open:true,t0:Date.now()};last=null;ans=[];closing=false;save();
        left=L.dur;watchAns();draw();startTimer();W.snd('tick');})
       .catch(function(e){if(b)b.disabled=false;W.toast('تعذّر إرسال السؤال: '+(e&&e.message||''));});}

    function close(){if(closing||!L.cur||!L.cur.open)return;closing=true;clearInterval(timer);var rid=L.cur.rid;
      DB.setOpen(rid,false).catch(function(){}).then(function(){return new Promise(function(r){setTimeout(r,700);});}).then(function(){
        if(!L.cur||L.cur.rid!==rid)return;var q=qOf(L.cur.id),a=q.a,p=pts(q),d={},rows=[],win=null,qAt=C&&C.qAt;
        firsts().forEach(function(s){var v=(s.ans||{}).x,ok=v!=null&&String(v)===String(a),dd;
          if(ok&&!win){win=s.sec;dd=p;}else if(ok)dd=0;else dd=-L.ded;d[s.sec]=dd;L.sc[s.sec]=(L.sc[s.sec]||0)+dd;
          var t=qAt&&s.at?(s.at-qAt)/1000:((s.tm||{}).x!=null?s.tm.x/1000:null);rows.push({sec:s.sec,d:dd,sec2:t!=null&&t>=0?t:null});});
        L.log.push({n:L.n,d:d});L.cur.open=false;last={d:d,rows:rows,win:win};L.last=last;save();
        push({st:'rev',sc:L.sc,rev:{k:a,win:win,d:d}});
        W.snd(win?'ok':'end');draw();bump(win);});}
    function bump(s){if(!s)return;var el=$('[data-t="'+s+'"] .sc');if(el){el.classList.remove('bump');void el.offsetWidth;el.classList.add('bump');}}
    function adj(s,v){var d={};d[s]=v;L.sc[s]=(L.sc[s]||0)+v;L.log.push({n:'m',d:d});save();push({sc:L.sc});drawTeams();bump(s);W.snd(v>0?'ok':'tick');}
    function undo(){var l=L.log.pop();if(!l)return;Object.keys(l.d).forEach(function(s){L.sc[s]=(L.sc[s]||0)-l.d[s];});if(l.n!=='m'&&last){last=null;L.last=null;}save();push({sc:L.sc});draw();W.toast('أُلغي آخر احتساب');}

    function finish(){if(L.cur&&L.cur.open){W.toast('أنهي السؤال الحالي أولًا');return;}
      var ord=sortedSecs(L.secs,L.sc),tie=ord.length>1&&(L.sc[ord[0]]||0)===(L.sc[ord[1]]||0);
      var d=W.dlg('<h2>إنهاء المنافسة المباشرة</h2>'+(tie?'<p class="tag l3" style="font-size:14px">تعادل في الصدارة! يمكنكِ طرح سؤال حاسم ثم الإنهاء، أو اختيار الفائزة.</p>':'')+'<div class="grid">'+ord.map(function(s,i){return '<label class="card" style="display:flex;gap:10px;align-items:center;padding:10px 14px;cursor:pointer"><input type="radio" name="w" value="'+s+'"'+(i===0?' checked':'')+' style="width:22px;height:22px;accent-color:var(--green)"><b class="kufi" style="flex:1;font-size:18px">'+esc(W.secName(s))+'</b><b>'+num(L.sc[s])+'</b></label>';}).join('')+'</div><div class="row" style="justify-content:flex-end;margin-top:12px"><button class="btn ghost" data-close>متابعة الأسئلة</button><button class="btn gld" id="ok">'+ic('trophy')+'إعلان الفائزة</button></div>');
      $('#ok',d).onclick=function(){var w=$('input[name=w]:checked',d).value;d.close();var id=L.id,cur=L.cur&&L.cur.rid,sc=W.clone(L.sc);
        push({st:'end',win:w,sc:sc,q:null,cur:null});if(cur)DB.delRound(cur).catch(function(){});
        G.comp.liveHist=(G.comp.liveHist||[]).concat([{at:Date.now(),sc:sc,win:w,n:L.n}]).slice(-30);delete G.comp.live;W.saveComp(true);
        W.cleanup();W.confetti(5000);W.snd('ok');
        var dd=W.dlg('<div class="winner"><img src="img/trophy.webp" alt="" style="mix-blend-mode:multiply;border-radius:50%"><span class="muted">الشعبة الفائزة في المنافسة المباشرة</span><span class="wn">'+esc(W.secName(w))+'</span><span class="naskh" style="font-size:22px;color:var(--hd)">أَلْفُ مَبْرُوكٍ لِلْبَطَلَات</span><div class="row" style="justify-content:center"><button class="btn grn" id="cls">'+ic('check')+'إغلاق المنافسة على أجهزة الطالبات</button></div></div>',{wide:true,onClose:function(){W.go('#/t/live');}});
        $('#cls',dd).onclick=function(){DB.delRound(id).catch(function(){});dd.close();};};}
    if(L.last&&L.cur&&!L.cur.open)last=L.last;
    if(L.cur&&L.cur.open)left=Math.max(0,Math.ceil(L.dur-(Date.now()-(L.cur.t0||Date.now()))/1000));
    draw();}
};
})();
