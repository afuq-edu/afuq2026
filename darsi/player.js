/* =====================================================================
   درسي · عارض الدروس التفاعلي
   يبني الحصة من وصفها: الغلاف ← الأهداف ← التهيئة (فتح البوابة) ← العرض ← الأنشطة ← التحدي ← الختام
   ===================================================================== */
(function(){
'use strict';
var D=window.DARSI,TB=window.TB,I=TB.I,$=D.$,$$=D.$$,esc=D.esc,h=D.h,ar=D.ar,SND=D.SND,VOICE=D.VOICE,sayBtn=D.sayBtn,plain=D.plain;
D.hooks=D.hooks||{};

var STAGE={cover:'البداية',goals:'أهداف الرحلة',warm:'التهيئة',show:'العرض',acts:'الأنشطة',chal:'التحدي',end:'الختام'};

/* ---------- عرض الشرح (beats) ----------
   كل نوع يعيد {n: عدد الخطوات الداخلية, go(i)} */
var BEAT={};
function stepper(el,sel){var parts=$$(sel,el);parts.forEach(function(p,i){if(i>0)p.classList.add('d-hide');});
  return {n:parts.length,go:function(i){parts.forEach(function(p,j){if(j<=i&&p.classList.contains('d-hide')){p.classList.remove('d-hide');p.classList.add('d-in');SND.play('flip');var s=p.getAttribute('data-auto');if(s&&D.autoRead)VOICE.say(s);}});}};}
BEAT.say=function(b,el){el.innerHTML='<div class="d-say-card">'+(b.e?'<div class="d-pic xl">'+esc(b.e)+'</div>':'')+'<p class="d-big">'+esc(b.t)+sayBtn(plain(b.say||b.t))+'</p>'+(b.sub?'<p class="d-subt">'+esc(b.sub)+'</p>':'')+'</div>';return {n:1,go:function(){}};};
BEAT.word=function(b,el){var parts=b.parts||[b.w];var cols=['#E85D75','#3D9BE9','#2FA36B','#C46BD8','#F28C38','#1FA2A8'];
  el.innerHTML='<div class="d-word">'+(b.e?'<div class="d-pic xl d-pop">'+esc(b.e)+'</div>':'')+'<div class="d-wbig">'+esc(b.w)+sayBtn(plain(b.w))+'</div>'+
   (b.parts?'<div class="d-syl">'+parts.map(function(p,i){return '<span style="--c:'+cols[i%cols.length]+'" data-auto="'+esc(plain(p))+'">'+esc(p)+'</span>';}).join('')+'</div>':'')+(b.m?'<p class="d-subt">'+esc(b.m)+'</p>':'')+'</div>';
  if(!b.parts)return {n:1,go:function(){}};var st=stepper(el,'.d-syl span');$$('.d-syl span',el)[0].classList.add('d-hide');return {n:st.n+1,go:function(i){if(i>0)st.go(i-1);}};};
BEAT.read=function(b,el){el.innerHTML='<div class="d-read">'+(b.t?'<h3 class="d-rt">'+esc(b.t)+'</h3>':'')+b.p.map(function(p){return '<p class="d-para">'+(String(p).match(/[^.،!؟:]+[.،!؟:]*/g)||[p]).map(function(s){return s.trim();}).filter(Boolean).map(function(s){return '<span class="d-sn" tabindex="0">'+esc(s)+'</span>';}).join(' ')+'</p>';}).join('')+
  '<div class="d-readbar"><button class="btn soft sm d-readall">'+D.SPK+'اقرأ النص كاملًا</button><span class="note">انقر أي جملة لسماعها</span></div></div>';
  $$('.d-sn',el).forEach(function(s){s.addEventListener('click',function(){$$('.d-sn.on',el).forEach(function(x){x.classList.remove('on');});s.classList.add('on');VOICE.say(plain(s.textContent),{onend:function(){s.classList.remove('on');}});});});
  $('.d-readall',el).addEventListener('click',function(){var ss=$$('.d-sn',el),k=0;(function nx(){$$('.d-sn.on',el).forEach(function(x){x.classList.remove('on');});if(k>=ss.length)return;var s=ss[k++];if(s.closest('.d-hide'))return;s.classList.add('on');s.scrollIntoView({block:'nearest',behavior:'smooth'});VOICE.say(plain(s.textContent),{onend:nx});})();});
  return stepper(el,'.d-para');};
BEAT.list=function(b,el){el.innerHTML=(b.h?'<h3 class="d-rt">'+esc(b.h)+'</h3>':'')+'<div class="d-list'+(b.items.length>4?' many':'')+'">'+b.items.map(function(x){return '<div class="d-li" data-auto="'+esc(plain(x[1]))+'">'+(x[0]?'<span class="d-pic">'+esc(x[0])+'</span>':'')+'<b>'+esc(x[1])+'</b>'+(x[2]?'<small>'+esc(x[2])+'</small>':'')+sayBtn(plain(x[1]+(x[2]?'، '+x[2]:'')))+'</div>';}).join('')+'</div>';return stepper(el,'.d-li');};
BEAT.table=function(b,el){el.innerHTML=(b.h?'<h3 class="d-rt">'+esc(b.h)+'</h3>':'')+'<div class="tbl-wrap"><table class="d-tbl"><thead><tr>'+b.head.map(function(x){return '<th>'+esc(x)+'</th>';}).join('')+'</tr></thead><tbody>'+b.rows.map(function(r){return '<tr>'+r.map(function(x){return '<td>'+esc(x)+'</td>';}).join('')+'</tr>';}).join('')+'</tbody></table></div>';return stepper(el,'.d-tbl tbody tr');};
BEAT.letters=function(b,el){/* إبراز حروف داخل كلمات: words:[[كلمة, الجزء المميز]] */
  el.innerHTML=(b.h?'<h3 class="d-rt">'+esc(b.h)+'</h3>':'')+'<div class="d-lw">'+b.words.map(function(w){var i=w[0].indexOf(w[1]);var html=i<0?esc(w[0]):esc(w[0].slice(0,i))+'<mark>'+esc(w[1])+'</mark>'+esc(w[0].slice(i+w[1].length));return '<div class="d-lwi">'+(w[2]?'<span class="d-pic">'+esc(w[2])+'</span>':'')+'<b>'+html+'</b>'+sayBtn(plain(w[0]))+'</div>';}).join('')+'</div>'+(b.note?'<p class="d-subt">'+esc(b.note)+'</p>':'');return stepper(el,'.d-lwi');};
/* الرياضيات */
function blocks(n){var t=Math.floor(n/10),o=n%10,hd=Math.floor(t/10);t=t%10;var s='<div class="d-blocks">';
  for(var k=0;k<hd;k++)s+='<i class="flat"></i>';for(var i=0;i<t;i++)s+='<i class="rod" style="--d:'+(i*80)+'ms"></i>';s+='<span class="gap"></span>';for(var j=0;j<o;j++)s+='<i class="cube" style="--d:'+((t+j)*80)+'ms"></i>';return s+'</div>';}
BEAT.tens=function(b,el){var n=b.n,hd=Math.floor(n/100),t=Math.floor(n%100/10),o=n%10;
  el.innerHTML='<div class="d-tens"><div class="d-num">'+ar(n)+sayBtn(String(n))+'</div>'+blocks(n)+'<div class="d-pv">'+(hd?'<span class="h">'+ar(hd)+'<small>مئات</small></span>':'')+'<span class="t">'+ar(t)+'<small>عشرات</small></span><span class="o">'+ar(o)+'<small>آحاد</small></span></div></div>';
  return stepper(el,'.d-tens>*');};
BEAT.frame=function(b,el){var s='<div class="d-frame">';for(var i=0;i<10;i++)s+='<i>'+(i<b.n?'<b style="--d:'+(i*120)+'ms">'+(b.e||'🔴')+'</b>':'')+'</i>';
  el.innerHTML='<div class="d-say-card">'+s+'</div><p class="d-big">'+esc(b.t||(ar(b.n)+' و '+ar(10-b.n)+' يُكَوِّنانِ ١٠'))+'</p></div>';return {n:1,go:function(){}};};
BEAT.eq=function(b,el){var e=b.e||'🍎',sub=b.op==='−'||b.op==='-',res=sub?b.a-b.b:b.op==='×'?b.a*b.b:b.a+b.b;
  function g(n,cls){return '<div class="d-grp '+(cls||'')+'">'+Array(n+1).join('<i>'+e+'</i>')+'</div>';}
  el.innerHTML='<div class="d-eq"><div class="d-eqv">'+(sub?'<div class="d-grp take">'+Array(b.a-b.b+1).join('<i>'+e+'</i>')+Array(b.b+1).join('<i class="gone">'+e+'</i>')+'</div>':g(b.a)+'<b class="op">'+esc(b.op)+'</b>'+g(b.b))+'</div>'+
   '<div class="d-eqs"><span>'+ar(b.a)+'</span><b>'+esc(b.op==='-'?'−':b.op)+'</b><span>'+ar(b.b)+'</span><b>=</b><span class="r">'+ar(res)+'</span>'+sayBtn(b.a+(sub?' ناقص ':b.op==='×'?' ضرب ':' زائد ')+b.b+' يساوي '+res)+'</div></div>';
  var st=stepper(el,'.d-eq>*');var orig=st.go;return {n:st.n+(sub?1:0),go:function(i){orig(Math.min(i,1));if(sub&&i>=1)$$('.gone',el).forEach(function(x,k){setTimeout(function(){x.classList.add('out');},k*150);});}};};
BEAT.line=function(b,el){var from=b.from||0,to=b.to||20,span=to-from;
  el.innerHTML='<div class="d-say-card"><p class="d-big">'+esc(b.t||(ar(b.start)+' + '+ar(b.jump)+' = '+ar(b.start+b.jump)))+'</p><div class="d-line show"><div class="d-lt">'+Array.apply(null,{length:span+1}).map(function(_,i){var v=from+i;return '<span class="d-tick'+(v===b.start?' st':'')+(v===b.start+b.jump?' en':'')+'" style="--x:'+(i/span*100)+'%"><i></i><span>'+((span<=20||v%5===0)?ar(v):'')+'</span></span>';}).join('')+
   '<div class="d-frog" style="--x:'+((b.start-from)/span*100)+'%">🐸</div></div></div></div>';
  var fr=$('.d-frog',el),k=0;return {n:b.jump+1,go:function(i){var v=b.start+Math.min(i,b.jump)*(b.dir||1);fr.style.setProperty('--x',((v-from)/span*100)+'%');fr.classList.remove('hop');void fr.offsetWidth;fr.classList.add('hop');if(i>0){SND.play('pop');VOICE.say(String(v));}}};};
BEAT.chart=function(b,el){var from=b.from||1,to=b.to||100,mk={};(b.mark||[]).forEach(function(v){mk[v]=1;});
  el.innerHTML=(b.h?'<h3 class="d-rt">'+esc(b.h)+'</h3>':'')+'<div class="d-chart">'+Array.apply(null,{length:to-from+1}).map(function(_,i){var v=from+i;return '<span'+(mk[v]?' class="mk" style="--d:'+(Object.keys(mk).indexOf(String(v))*90)+'ms"':'')+'>'+ar(v)+'</span>';}).join('')+'</div>';return {n:1,go:function(){}};};
BEAT.arr=function(b,el){el.innerHTML='<div class="d-say-card">'+'<div class="d-arr big" style="--c:'+b.c+'">'+Array(b.r*b.c+1).join('<i>'+(b.e||'🍪')+'</i>')+'</div><p class="d-big">'+ar(b.r)+' صُفوف × '+ar(b.c)+' = '+ar(b.r*b.c)+sayBtn(b.r+' ضرب '+b.c+' يساوي '+(b.r*b.c))+'</p></div>';return {n:1,go:function(){}};};
BEAT.frac=function(b,el){var d=b.d,n=b.n;var s='<svg viewBox="-110 -110 220 220">';for(var i=0;i<d;i++){var a0=i/d*Math.PI*2-Math.PI/2,a1=(i+1)/d*Math.PI*2-Math.PI/2;s+='<path class="'+(i<n?'on':'')+'" style="--d:'+(i*200)+'ms" d="M0 0 L'+(100*Math.cos(a0)).toFixed(2)+' '+(100*Math.sin(a0)).toFixed(2)+' A100 100 0 '+(a1-a0>Math.PI?1:0)+' 1 '+(100*Math.cos(a1)).toFixed(2)+' '+(100*Math.sin(a1)).toFixed(2)+' Z"/>';}s+='</svg>';
  el.innerHTML='<div class="d-say-card"><div class="d-pie show">'+s+'</div><p class="d-big"><b class="d-fr"><sup>'+ar(n)+'</sup><sub>'+ar(d)+'</sub></b> '+esc(b.t||'')+'</p></div>';return {n:1,go:function(){}};};
BEAT.cmp=function(b,el){var sg=b.a>b.b?'>':b.a<b.b?'<':'=';el.innerHTML='<div class="d-say-card"><div class="d-cmp"><b>'+ar(b.a)+'</b><i class="d-croc ok">'+sg+'</i><b>'+ar(b.b)+'</b></div><p class="d-big">'+esc(b.t||(ar(b.a)+(sg==='>'?' أكبر من ':sg==='<'?' أصغر من ':' يساوي ')+ar(b.b)))+sayBtn(b.a+(sg==='>'?' أكبر من ':sg==='<'?' أصغر من ':' يساوي ')+b.b)+'</p></div>';return {n:1,go:function(){}};};

/* ---------- بناء شرائح الحصة ---------- */
function build(L){var s=[];var sc=D.scene(L.sc);
  s.push({t:'cover',st:'cover'});
  if(L.goals&&L.goals.length)s.push({t:'goals',st:'goals'});
  if(L.warm&&L.warm.length)s.push({t:'warm',st:'warm',items:D.expand(L.warm,L.id+'w')});
  (L.show||[]).forEach(function(b){s.push({t:'beat',st:'show',b:b});});
  D.expand(L.acts||[],L.id+'a').forEach(function(a,i){s.push({t:'act',st:'acts',it:a,i:i});});
  if(L.chal)s.push({t:'act',st:'chal',it:D.expand([L.chal],L.id+'c')[0]});
  s.push({t:'end',st:'end'});
  return s;}

/* ---------- العارض ---------- */
var CUR=null;
function open(L,opt){opt=opt||{};close();var sc=D.scene(L.sc),slides=build(L),idx=0,step=0,ctl=null,stars=0,solved={};
  var root=h('div','d-player'+(sc.night?' night':''));root.setAttribute('role','dialog');root.setAttribute('aria-label',L.t);
  root.innerHTML='<div class="d-bg">'+sc.bg()+'</div>'+
   '<header class="d-top"><button class="d-ib" data-x="close" aria-label="إغلاق">'+I.x+'</button><div class="d-tt"><span class="d-stage"></span><b>'+esc(L.t)+'</b></div>'+
   '<div class="d-tools"><span class="d-stars" aria-label="النجوم">⭐ <b>٠</b></span><button class="d-ib" data-x="who" aria-label="من يجيب؟" title="من يجيب؟">🎲</button><button class="d-ib" data-x="snd" aria-label="الصوت">'+(SND.on?'🔊':'🔇')+'</button><button class="d-ib" data-x="fs" aria-label="ملء الشاشة">⛶</button></div></header>'+
   '<div class="d-prog"><i></i></div><main class="d-stagebox"><div class="d-slide"></div></main><div class="d-who" hidden></div>'+
   '<footer class="d-nav"><button class="d-arrow prev" data-x="prev" aria-label="السابق">'+I.back+'</button><div class="d-dots"></div><button class="d-arrow next" data-x="next" aria-label="التالي">'+I.next+'</button></footer>';
  document.body.appendChild(root);document.documentElement.classList.add('d-noscroll','fx-pause');
  var box=$('.d-slide',root),dots=$('.d-dots',root);
  dots.innerHTML=slides.map(function(sl,i){return '<button class="d-dot st-'+sl.st+'" data-i="'+i+'" aria-label="'+(i+1)+'"></button>';}).join('');
  function star(n){stars+=n||1;var el=$('.d-stars b',root);el.textContent=ar(stars);var c=$('.d-stars',root);c.classList.remove('bump');void c.offsetWidth;c.classList.add('bump');}
  function ctx(key){return {mode:'learn',right:function(n){SND.play('good');D.boom(n);},wrong:function(){SND.play('bad');},done:function(sc){if(!solved[key]){solved[key]=1;star(sc>=1?2:1);}unlockNext();}};}
  function unlockNext(){$('.d-arrow.next',root).classList.add('glow');}
  function show(i,back){idx=Math.max(0,Math.min(slides.length-1,i));step=0;VOICE.stop();var sl=slides[idx];
    $('.d-stage',root).textContent=(sc.st[sl.st]||STAGE[sl.st]);root.setAttribute('data-st',sl.st);
    $('.d-prog i',root).style.width=((idx+1)/slides.length*100)+'%';$$('.d-dot',root).forEach(function(d,k){d.classList.toggle('on',k===idx);d.classList.toggle('past',k<idx);});
    $('.d-arrow.prev',root).disabled=idx===0;$('.d-arrow.next',root).classList.remove('glow');
    var el=h('div','d-card '+(back?'from-l':'from-r')+' t-'+sl.t);box.innerHTML='';box.appendChild(el);ctl=null;
    R[sl.t](sl,el,L,sc);if(sl.t==='beat'){ctl=BEAT[sl.b.b]?BEAT[sl.b.b](sl.b,el.querySelector('.d-bbody')||el):null;if(ctl)ctl.go(0);}
    SND.play('whoosh');box.scrollTop=0;}
  var R={
   cover:function(sl,el){el.innerHTML='<div class="d-cover"><div class="d-prop p-'+sc.prop+'"><span class="d-pe">'+sc.e+'</span><small>عُنْوانُ دَرْسِنا اليَوْمَ</small><h1>'+esc(L.t)+'</h1>'+sayBtn(plain(L.t))+
     '<div class="d-meta"><span>'+esc(D.SUBJ[L.subj].n)+'</span>'+(L.grade?'<span>الصف '+['','الأول','الثاني','الثالث','الرابع'][L.grade]+'</span>':'<span>'+esc(D.REG.books[L.book].label||'')+'</span>')+(L.p?'<span>'+esc(L.p)+'</span>':'')+'</div></div>'+
     '<p class="d-hook">'+esc(L.hook||('مرحبًا بكم في '+sc.n+'! هيا نبدأ رحلتنا التعليمية'))+'</p><button class="btn gold lg d-go">'+I.play+'هيا نبدأ</button></div>';
     $('.d-go',el).addEventListener('click',function(){next();});setTimeout(function(){if(D.autoRead)VOICE.say(plain(L.t));},500);},
   goals:function(sl,el){el.innerHTML='<h2 class="d-h">'+sc.e+' أهدافُ رِحْلَتِنا</h2><div class="d-tickets">'+L.goals.map(function(g,i){return '<div class="d-ticket" style="--d:'+(i*350)+'ms"><span class="n">'+ar(i+1)+'</span><b>'+esc(g)+'</b>'+sayBtn(plain(g))+'<i class="d-tk"></i></div>';}).join('')+'</div>';},
   warm:function(sl,el){var n=sl.items.length,got=0;
     el.innerHTML='<h2 class="d-h">'+esc(sc.st.warm)+': حُلَّ البِطاقاتِ لِتُفْتَحَ البَوّابَةُ</h2><div class="d-warm"><div class="d-door"><div class="d-dl"></div><div class="d-dr"></div><span class="d-lock">🔒</span><span class="d-open">'+sc.e+'</span></div><div class="d-wcards">'+
      sl.items.map(function(it,i){return '<button class="d-wc" data-i="'+i+'" style="--d:'+(i*200)+'ms"><span class="n">'+ar(i+1)+'</span><b>البِطاقَةُ '+['الأُولى','الثّانِيَةُ','الثّالِثَةُ','الرّابِعَةُ','الخامِسَةُ'][i]+'</b><i>👆</i></button>';}).join('')+'</div></div><div class="d-modal" hidden><div class="d-mbox"><button class="d-ib d-mx" aria-label="إغلاق">'+I.x+'</button><div class="d-mbody"></div></div></div>';
     var modal=$('.d-modal',el),body=$('.d-mbody',el);$('.d-mx',el).addEventListener('click',function(){modal.hidden=true;});
     $$('.d-wc',el).forEach(function(c){c.addEventListener('click',function(){if(c.classList.contains('ok'))return;var i=+c.dataset.i;modal.hidden=false;body.innerHTML='';var a=h('div','');body.appendChild(a);SND.play('flip');
       D.render(sl.items[i],a,{mode:'learn',done:function(s){c.classList.add('ok');c.querySelector('i').textContent='✅';got++;if(!solved['w'+i]){solved['w'+i]=1;star(1);}
         setTimeout(function(){modal.hidden=true;if(got===n){var d=$('.d-door',el);d.classList.add('open');SND.play('win');D.boom(d);TB.celebrate();unlockNext();}},900);}});});});},
   beat:function(sl,el){el.innerHTML=(sl.b.h&&sl.b.b!=='list'&&sl.b.b!=='read'&&sl.b.b!=='letters'&&sl.b.b!=='chart'&&sl.b.b!=='table'?'<h2 class="d-h">'+esc(sl.b.h)+'</h2>':'')+'<div class="d-bbody"></div>';},
   act:function(sl,el){var lab=sl.st==='chal'?'🏆 '+esc(sc.st.chal):'<span class="d-an">'+ar(sl.i+1)+'</span> '+esc(sl.it.h||'نشاط');
     el.innerHTML='<h2 class="d-h">'+lab+'</h2><div class="d-abody"></div>';D.render(sl.it,$('.d-abody',el),ctx('a'+idx));},
   end:function(sl,el){var sum=L.sum||L.goals||[];
     el.innerHTML='<h2 class="d-h">'+sc.e+' '+esc(sc.st.end)+'</h2><div class="d-end"><div class="d-sum"><h3>ماذا تَعَلَّمْنا اليَوْمَ؟</h3>'+sum.map(function(g,i){return '<p style="--d:'+(i*400)+'ms"><i>✔</i>'+esc(g)+sayBtn(plain(g))+'</p>';}).join('')+'</div>'+
      (L.exit?'<div class="d-exit"><h3>🎟️ بِطاقَةُ الخُروجِ</h3><div class="d-xbody"></div></div>':'')+
      '<div class="d-feel"><h3>كَيْفَ كانَ دَرْسُنا؟</h3><div>'+['😍','🙂','😐'].map(function(f){return '<button>'+f+'</button>';}).join('')+'</div></div>'+
      '<div class="d-final"><span class="d-bigstar">⭐</span><b>جَمَعْنا <span class="d-st">'+ar(stars)+'</span> نَجْمَةً!</b><button class="btn gold lg d-fin">'+I.check+'إنهاء الحصة</button></div></div>';
     if(L.exit)D.render(D.expand([L.exit],L.id+'x')[0],$('.d-xbody',el),ctx('x'));
     $$('.d-feel button',el).forEach(function(b){b.addEventListener('click',function(){$$('.d-feel button',el).forEach(function(x){x.classList.remove('on');});b.classList.add('on');SND.play('pop');});});
     setTimeout(function(){TB.celebrate();SND.play('win');},400);
     $('.d-fin',el).addEventListener('click',function(){if(D.hooks.taught)D.hooks.taught(L.id);close();TB.toast('أحسنتم! سُجِّلت الحصة مُنجزة اليوم',{gold:true,icon:'award'});});}
  };
  function next(){if(ctl&&step<ctl.n-1){step++;ctl.go(step);return;}if(idx<slides.length-1)show(idx+1);}
  function prev(){if(idx>0)show(idx-1,true);}
  root.addEventListener('click',function(e){var b=e.target.closest('[data-x]');if(b){var x=b.dataset.x;
    if(x==='close')close();else if(x==='next')next();else if(x==='prev')prev();
    else if(x==='snd'){SND.set(!SND.on);b.textContent=SND.on?'🔊':'🔇';}
    else if(x==='fs'){var d=document;if(d.fullscreenElement)d.exitFullscreen();else if(root.requestFullscreen)root.requestFullscreen().catch(function(){});}
    else if(x==='who')who();return;}
    var dt=e.target.closest('.d-dot');if(dt)show(+dt.dataset.i,+dt.dataset.i<idx);});
  function key(e){if(e.target.closest&&e.target.closest('input,textarea'))return;if(e.key==='ArrowLeft'||e.key===' '||e.key==='PageDown'){e.preventDefault();next();}else if(e.key==='ArrowRight'||e.key==='PageUp'){e.preventDefault();prev();}else if(e.key==='Escape'&&!document.fullscreenElement)close();}
  document.addEventListener('keydown',key);
  /* السحب الأفقي للتنقل */
  var tx0=null;box.addEventListener('touchstart',function(e){tx0=e.touches.length===1?[e.touches[0].clientX,e.touches[0].clientY]:null;},{passive:true});
  box.addEventListener('touchend',function(e){if(!tx0)return;var t=e.changedTouches[0],dx=t.clientX-tx0[0],dy=t.clientY-tx0[1];if(Math.abs(dx)>80&&Math.abs(dy)<50&&!e.target.closest('.d-card .d-act')){if(dx>0)next();else prev();}tx0=null;},{passive:true});
  /* من يجيب؟ اختيار طالب عشوائي ومنحه نقطة */
  function who(){var P=D.games&&D.games.clsPick?D.games.clsPick(L.grade):null,list=P&&P.cs.length?P.list():D.hooks.students?D.hooks.students(L.grade):[];var w=$('.d-who',root);
    if(!list.length){TB.toast('أضيفي أسماء الطلاب'+(L.grade?' الصف '+['','الأول','الثاني','الثالث','الرابع'][L.grade]:'')+' من قسم الطلاب');return;}
    w.hidden=false;var k=0,turns=14+Math.floor(Math.random()*8),pickS=null;
    (function spin(){pickS=list[Math.floor(Math.random()*list.length)];w.innerHTML='<b class="d-wn">'+esc(pickS.name)+'</b>';SND.play('tap');
      if(++k<turns)setTimeout(spin,60+k*12);else{w.innerHTML='<span>🎯 دورُ:</span><b class="d-wn final">'+esc(pickS.name)+'</b><button class="btn gold sm" data-p="1">+١ نقطة</button><button class="btn soft sm" data-p="2">+٢</button><button class="d-ib" data-p="0" aria-label="إخفاء">'+I.x+'</button>';VOICE.say(pickS.name);SND.play('good');}})();
    w.onclick=function(e){var b=e.target.closest('[data-p]');if(!b)return;var v=+b.dataset.p;if(v&&D.hooks.addPoint){D.hooks.addPoint(pickS.id,v,'مشاركة',L.id);TB.toast('+'+ar(v)+' لـ '+pickS.name,{gold:true,icon:'star'});SND.play('win');}w.hidden=true;};}
  CUR={root:root,key:key};show(opt.at||0);
  return root;}
function close(){if(!CUR)return;VOICE.stop();document.removeEventListener('keydown',CUR.key);if(document.fullscreenElement)document.exitFullscreen().catch(function(){});CUR.root.remove();CUR=null;document.documentElement.classList.remove('d-noscroll','fx-pause');}

D.player={open:open,close:close,build:build,BEAT:BEAT};
})();
