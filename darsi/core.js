/* =====================================================================
   درسي · المحرك المشترك لمنصات معلمات صعوبات التعلم
   core.js: الأدوات، التخزين، الأصوات، القراءة الصوتية، سجل المحتوى،
   مولّدات الأسئلة، ومكوّنات الأنشطة التفاعلية (تُستخدم في الدروس والواجبات والامتحانات والألعاب)
   يعتمد على «طبشورة» (window.TB)
   ===================================================================== */
(function(){
'use strict';
var TB=window.TB,I=TB.I;
var RMQ=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- أدوات ---------- */
function $(s,el){return (el||document).querySelector(s);}
function $$(s,el){return Array.prototype.slice.call((el||document).querySelectorAll(s));}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function h(tag,cls,html){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e;}
function uid(p){return (p||'i')+Date.now().toString(36)+Math.random().toString(36).slice(2,6);}
function ar(n){return String(n).replace(/[0-9]/g,function(d){return '٠١٢٣٤٥٦٧٨٩'[d];});}
function pad(n){return (n<10?'0':'')+n;}
function ymd(d){d=d||new Date();return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());}
function fdate(s){try{var a=String(s).split('-');return new Intl.DateTimeFormat('ar-OM-u-nu-latn',{day:'numeric',month:'long'}).format(new Date(+a[0],a[1]-1,+a[2]));}catch(e){return s;}}
/* تطبيع الأسماء العربية للمطابقة */
function norm(s){return String(s||'').replace(/[ً-ْٰـ]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/ؤ/g,'و').replace(/ئ/g,'ي').replace(/\s+/g,' ').trim();}
function plain(s){return String(s||'').replace(/[ً-ْٰ]/g,'');}

/* ---------- عشوائية ثابتة البذرة ---------- */
function hash(s){s=String(s);var h=1779033703^s.length;for(var i=0;i<s.length;i++){h=Math.imul(h^s.charCodeAt(i),3432918353);h=h<<13|h>>>19;}return (h>>>0);}
function rng(seed){var a=typeof seed==='number'?seed:hash(seed);return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};}
function shuffle(a,r){r=r||Math.random;a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(r()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a;}
function ri(r,a,b){return a+Math.floor(r()*(b-a+1));}
function pick(r,a){return a[Math.floor(r()*a.length)];}

/* ---------- التخزين على الجهاز ---------- */
var DB=(function(){var dbp=null;
  function open(){if(dbp)return dbp;dbp=new Promise(function(res,rej){if(!window.indexedDB)return rej();var r=indexedDB.open('darsi',1);
    r.onupgradeneeded=function(){r.result.createObjectStore('kv');};r.onsuccess=function(){res(r.result);};r.onerror=function(){rej(r.error);};});return dbp;}
  function tx(mode,fn){return open().then(function(db){return new Promise(function(res,rej){var t=db.transaction('kv',mode),st=t.objectStore('kv'),q=fn(st);t.oncomplete=function(){res(q&&q.result);};t.onerror=function(){rej(t.error);};});});}
  return{get:function(k){return tx('readonly',function(s){return s.get(k);}).catch(function(){try{return JSON.parse(localStorage.getItem(k));}catch(e){return null;}});},
    set:function(k,v){return tx('readwrite',function(s){return s.put(v,k);}).catch(function(){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}});}};
})();
function lsGet(k,d){try{var v=localStorage.getItem(k);return v==null?d:v;}catch(e){return d;}}
function lsSet(k,v){try{localStorage.setItem(k,v);}catch(e){}}

/* ---------- أصوات هادئة غير موسيقية (Web Audio) ---------- */
var SND=(function(){
  var ctx=null,out=null,noise=null,on=lsGet('darsi:sound','on')!=='off';
  function init(){if(ctx||!on)return;var AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;ctx=new AC();
    out=ctx.createGain();out.gain.value=.8;out.connect(ctx.destination);
    noise=ctx.createBuffer(1,ctx.sampleRate,ctx.sampleRate);var d=noise.getChannelData(0);for(var i=0;i<d.length;i++)d[i]=Math.random()*2-1;}
  function ok(){if(!on)return false;init();if(!ctx)return false;if(ctx.state==='suspended')ctx.resume();return true;}
  function hiss(t0,dur,vol,type,f0,f1,q){var s=ctx.createBufferSource(),fl=ctx.createBiquadFilter(),g=ctx.createGain();s.buffer=noise;fl.type=type;fl.Q.value=q||.8;
    fl.frequency.setValueAtTime(f0,t0);if(f1)fl.frequency.exponentialRampToValueAtTime(f1,t0+dur);
    g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(vol,t0+.008);g.gain.exponentialRampToValueAtTime(.0008,t0+dur);
    s.connect(fl);fl.connect(g);g.connect(out);s.start(t0,Math.random()*.5);s.stop(t0+dur+.02);}
  function thump(t0,f0,f1,dur,vol){var o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(f0,t0);o.frequency.exponentialRampToValueAtTime(f1,t0+dur);
    g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(vol,t0+.006);g.gain.exponentialRampToValueAtTime(.0008,t0+dur);o.connect(g);g.connect(out);o.start(t0);o.stop(t0+dur+.02);}
  var P={
    tap:function(t){hiss(t,.05,.16,'bandpass',2400,1800,1.4);},
    pop:function(t){thump(t,520,180,.09,.35);hiss(t,.04,.12,'highpass',3000);},
    good:function(t){thump(t,300,620,.12,.32);hiss(t+.02,.16,.14,'bandpass',4200,7000,2);thump(t+.1,420,820,.1,.22);},
    bad:function(t){thump(t,190,120,.16,.3);},
    whoosh:function(t){hiss(t,.35,.16,'bandpass',600,2600,1.2);},
    win:function(t){for(var i=0;i<6;i++){hiss(t+i*.07,.12,.12,'bandpass',3000+i*600,5000+i*600,3);}thump(t,260,700,.25,.3);},
    flip:function(t){hiss(t,.12,.14,'bandpass',1500,900,1.2);},
    drop:function(t){thump(t,700,240,.12,.3);}
  };
  function play(n){if(!ok())return;try{P[n](ctx.currentTime+.005);}catch(e){}}
  return{play:play,get on(){return on;},set:function(v){on=!!v;lsSet('darsi:sound',on?'on':'off');if(on)play('tap');}};
})();

/* ---------- القراءة الصوتية (حسب أصوات الجهاز) ---------- */
var VOICE=(function(){
  var syn=window.speechSynthesis,voice=null,rate=+lsGet('darsi:rate','0.8')||.8;
  function pickV(){if(!syn)return;var vs=syn.getVoices()||[];voice=vs.filter(function(v){return /^ar/i.test(v.lang);}).sort(function(a,b){return (/(SA|OM|AE)/.test(b.lang)?1:0)-(/(SA|OM|AE)/.test(a.lang)?1:0);})[0]||null;}
  if(syn){pickV();if(syn.addEventListener)syn.addEventListener('voiceschanged',pickV);else syn.onvoiceschanged=pickV;}
  var warned=false;
  function say(text,opt){opt=opt||{};if(!syn){if(!warned){warned=true;TB.toast('القراءة الصوتية غير متاحة في هذا المتصفح');}return;}
    syn.cancel();if(!voice)pickV();
    var u=new SpeechSynthesisUtterance(String(text).replace(/[«»"]/g,''));u.lang=voice?voice.lang:'ar-SA';if(voice)u.voice=voice;u.rate=opt.rate||rate;u.pitch=1.05;
    if(opt.onend)u.onend=opt.onend;if(opt.onboundary)u.onboundary=opt.onboundary;
    if(!voice&&!warned){warned=true;setTimeout(function(){if(!voice)TB.toast('لا يوجد صوت عربي في الجهاز؛ ثبّتي العربية من إعدادات النطق');},900);}
    syn.speak(u);}
  return{say:say,stop:function(){if(syn)syn.cancel();},get ok(){return !!syn;},setRate:function(r){rate=r;lsSet('darsi:rate',String(r));},get rate(){return rate;}};
})();
function sayBtn(text,cls){return '<button class="d-say '+(cls||'')+'" data-say="'+esc(text)+'" aria-label="استمع">'+SPK+'</button>';}
var SPK='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>';
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-say]');if(!b)return;e.stopPropagation();
  b.classList.add('on');VOICE.say(b.getAttribute('data-say'),{onend:function(){b.classList.remove('on');}});setTimeout(function(){b.classList.remove('on');},6000);},true);

/* ---------- عبارات التشجيع ---------- */
var PRAISE=['أحسنت!','رائع!','ممتاز!','بطل!','عمل جميل!','أنت مبدع!','إجابة صحيحة!','واصل يا بطل!','نجم!','ما شاء الله!'];
var RETRY=['حاول مرة أخرى','قريب! جرّب ثانية','لا بأس، فكّر قليلًا','أنت تستطيع!'];
function praise(){return PRAISE[Math.floor(Math.random()*PRAISE.length)];}
function retry(){return RETRY[Math.floor(Math.random()*RETRY.length)];}

/* ---------- سجل المحتوى ---------- */
var REG={books:{},lessons:{},order:[]};
var SUBJ={ar:{n:'اللغة العربية',ic:'lang',c:'#E0567A'},math:{n:'الرياضيات',ic:'calc',c:'#3D7BE0'},sci:{n:'العلوم',ic:'flask',c:'#2FA36B'}};
/* book({id,subj,grade,title,sub,units:[{t,goal,lessons:[...] }]}) */
function book(b){b.units.forEach(function(u,ui){u.book=b.id;u.i=ui;u.id=b.id+'-u'+(ui+1);
  u.lessons.forEach(function(l,li){l.book=b.id;l.unit=u.id;l.subj=b.subj;l.grade=b.grade;l.n=li+1;l.ui=ui;l.uname=u.t;if(!l.annual)l.annual=u.goal||'';REG.lessons[l.id]=l;});});
  REG.books[b.id]=b;REG.order.push(b.id);}
/* كتاب يُكتب بالأرقام اللاتينية وتُحوَّل نصوصه إلى أرقام عربية (عدا المعرّفات والنطق والرموز التعبيرية) */
function arAll(o,k){if(typeof o==='string')return k==='id'||k==='say'||k==='e'||k==='sc'?o:ar(o);if(Array.isArray(o))return o.map(function(x){return arAll(x);});if(o&&typeof o==='object'){var r={};for(var x in o)r[x]=arAll(o[x],x);return r;}return o;}
function bookA(b){b=arAll(b);b.units.forEach(function(u,ui){u.lessons.forEach(function(l,li){if(!l.gno)l.gno=ar(ui+1);if(!l.p)l.p='الهدف '+ar(ui+1)+'-'+ar(li+1);});});book(b);}
function lessonsOf(bid){var b=REG.books[bid];if(!b)return [];var out=[];b.units.forEach(function(u){out=out.concat(u.lessons);});return out;}

/* ---------- مولّدات أسئلة الرياضيات ---------- */
var E=['🍎','⭐','🎈','🐟','🌸','🚗','🍪','⚽','🐥','🍋','🦋','🧁'];
function numOpts(r,a,spread,min){var s={};s[a]=1;var o=[a],guard=0;while(o.length<3&&guard++<50){var v=a+ri(r,-spread,spread);if(v<(min||0)||s[v])continue;s[v]=1;o.push(v);}return shuffle(o,r);}
function mq(r,q,a,spread,extra){var o=numOpts(r,a,spread||3,0);var it={k:'mcq',q:q,o:o.map(ar),a:o.indexOf(a)};if(extra)for(var x in extra)it[x]=extra[x];return it;}
var GEN={
  count:function(r,p){var n=ri(r,p.min||3,p.max||10),e=pick(r,E);return {k:'count',e:e,n:n,q:'عُدَّ ثُمَّ اخْتَرِ الْعَدَدَ'};},
  add:function(r,p){var mx=p.max||20,a=ri(r,p.amin||1,Math.max(1,mx-2)),b=ri(r,1,Math.max(1,mx-a));if(p.tens){a=ri(r,1,8)*10;b=ri(r,1,9-a/10)*10;}return mq(r,ar(a)+' + '+ar(b)+' = ؟',a+b,p.tens?10:3,{say:a+' زائد '+b});},
  sub:function(r,p){var mx=p.max||20,a=ri(r,Math.min(mx,4),mx),b=ri(r,1,a-1);if(p.tens){a=ri(r,2,9)*10;b=ri(r,1,a/10-1)*10;}return mq(r,ar(a)+' − '+ar(b)+' = ؟',a-b,p.tens?10:3,{say:a+' ناقص '+b});},
  cmp:function(r,p){var mx=p.max||100,a=ri(r,p.min||1,mx),b=r()<.15?a:ri(r,p.min||1,mx);return {k:'cmp',a:a,b:b};},
  place:function(r,p){var big=p.max||99;var n=ri(r,big>999?1000:big>99?100:10,big);var s=String(n);var pos=ri(r,0,s.length-1);var names={1:'الآحاد',2:'العشرات',3:'المئات',4:'الآلاف',5:'عشرات الآلاف'};var place=s.length-pos;
    var d=+s[pos];return mq(r,'ما الرَّقْمُ في مَنْزِلَةِ '+names[place]+' في العَدَدِ '+ar(n)+'؟',d,3,{});},
  value:function(r,p){var n=ri(r,p.min||11,p.max||99),t=Math.floor(n/10)*10;return mq(r,'ما قِيمَةُ رَقْمِ العَشَراتِ في '+ar(n)+'؟',t,20,{});},
  evenodd:function(r,p){var n=ri(r,p.min||1,p.max||20);return {k:'mcq',q:'العَدَدُ '+ar(n)+' عَدَدٌ ...',o:['زَوْجِيٌّ','فَرْدِيٌّ'],a:n%2?1:0};},
  next:function(r,p){var st=pick(r,p.steps||[1,2,5,10]),dir=p.down&&r()<.5?-1:1,s=ri(r,p.min||0,(p.max||50))/st|0;s*=st;var seq=[0,1,2,3].map(function(i){return s+dir*i*st;});if(seq[3]<0)return GEN.next(r,{steps:[st],max:p.max});
    return mq(r,'أَكْمِلِ النَّمَطَ: '+seq.slice(0,3).map(ar).join('، ')+'، ...',seq[3],st*2,{});},
  mul:function(r,p){var t=pick(r,p.tables||[2,5,10]),b=ri(r,1,p.maxb||10);return mq(r,ar(t)+' × '+ar(b)+' = ؟',t*b,t,{say:t+' ضرب '+b});},
  div:function(r,p){var t=pick(r,p.tables||[2,5,10]),q=ri(r,1,p.maxb||10);return mq(r,ar(t*q)+' ÷ '+ar(t)+' = ؟',q,2,{say:(t*q)+' تقسيم '+t});},
  double:function(r,p){var n=ri(r,1,p.max||20);return mq(r,'ضِعْفُ العَدَدِ '+ar(n)+' = ؟',n*2,4,{});},
  half:function(r,p){var n=ri(r,1,(p.max||40)/2)*2;return mq(r,'نِصْفُ العَدَدِ '+ar(n)+' = ؟',n/2,3,{});},
  round10:function(r,p){var n=ri(r,p.min||11,p.max||99);if(n%10===5)n++;var a=Math.round(n/10)*10;return mq(r,'قَرِّبِ العَدَدَ '+ar(n)+' لِأَقْرَبِ عَشَرَةٍ',a,10,{});},
  round100:function(r,p){var n=ri(r,p.min||110,p.max||999);if(n%100===50)n++;var a=Math.round(n/100)*100;return mq(r,'قَرِّبِ العَدَدَ '+ar(n)+' لِأَقْرَبِ مِئَةٍ',a,100,{});},
  bond:function(r,p){var t=p.to||10,a=ri(r,0,t);return mq(r,ar(a)+' + ؟ = '+ar(t),t-a,3,{});},
  miss:function(r,p){var mx=p.max||20,a=ri(r,1,mx-1),b=ri(r,1,mx-a);return mq(r,ar(a)+' + ؟ = '+ar(a+b),b,3,{});},
  numline:function(r,p){var mx=p.max||20,a=ri(r,0,mx-5),b=ri(r,1,Math.min(9,mx-a));return {k:'line',from:0,to:mx,start:a,jump:b,q:'اقْفِزْ عَلى خَطِّ الأَعْدادِ: '+ar(a)+' + '+ar(b)};},
  frac:function(r,p){var d=pick(r,p.d||[2,3,4]),n=ri(r,1,d-1);return {k:'frac',n:n,d:d};},
  money:function(r,p){var a=pick(r,[1,5,10,20,50]),b=pick(r,[1,5,10,20]);return mq(r,'مَعَ سالِمٍ وَرَقَةُ '+ar(a)+' وَوَرَقَةُ '+ar(b)+'، كَمْ مَعَهُ؟',a+b,5,{e:'💵'});},
  array:function(r,p){var rw=ri(r,2,p.max||5),c=ri(r,2,p.max||5);return mq(r,'كَمْ عَدَدُ الأَشْياءِ في المَصْفوفَةِ؟',rw*c,3,{arr:[rw,c,pick(r,E)]});}
};
/* يحوّل بنود gen إلى أسئلة حقيقية، ويعطي نتيجة ثابتة لنفس البذرة */
function expand(items,seed){var r=rng(seed||'x'),out=[];(items||[]).forEach(function(it){if(it&&it.k==='gen'){var n=it.n||1;for(var i=0;i<n;i++){var g=GEN[it.g];if(g)out.push(g(r,it));}}else if(it)out.push(it);});return out;}

/* ---------- مكوّنات الأنشطة ----------
   ACT.render(item, el, ctx)  ctx: {mode:'learn'|'test', done(score 0..1), right(), wrong(), say}
   في وضع التعلّم: محاولات غير محدودة مع تلميح بعد خطأين. في وضع الاختبار: تُحسب المحاولة الأولى. */
function feedback(el,ok,msg){var f=el.querySelector('.d-fb');if(!f){f=h('div','d-fb');el.appendChild(f);}f.className='d-fb '+(ok?'ok':'no');f.textContent=msg||(ok?praise():retry());
  f.classList.remove('show');void f.offsetWidth;f.classList.add('show');}
function shake(n){n.classList.remove('d-shake');void n.offsetWidth;n.classList.add('d-shake');}
function boom(n){if(!n)return;var r=n.getBoundingClientRect();TB.celebrate(r.left+r.width/2,r.top+r.height/2,{n:40});}
function q(item){return item.q?'<div class="d-q">'+(item.say!==false?sayBtn(plain(item.say||item.q)):'')+'<span>'+esc(item.q)+'</span></div>':'';}
function big(e){return e?'<div class="d-pic">'+esc(e)+'</div>':'';}
function arrHTML(a){var s='<div class="d-arr" style="--c:'+a[1]+'">';for(var i=0;i<a[0]*a[1];i++)s+='<i>'+a[2]+'</i>';return s+'</div>';}
var LETTERS=/^[؀-ۿ]+$/;

var ACT={};
/* اختيار من متعدد */
ACT.mcq=function(it,el,cx){var wrong=0,done=false;
  var short=it.o.every(function(o){return String(o).length<=4;});
  el.innerHTML=q(it)+big(it.e)+(it.arr?arrHTML(it.arr):'')+'<div class="d-opts'+(short?' short':'')+(it.o.length===2?' two':'')+'">'+it.o.map(function(o,i){return '<button class="d-opt" data-i="'+i+'"><span>'+esc(o)+'</span></button>';}).join('')+'</div>';
  $$('.d-opt',el).forEach(function(b){b.addEventListener('click',function(){if(done)return;var i=+b.dataset.i;
    if(i===it.a){done=true;b.classList.add('right');cx.right(b);feedback(el,true);cx.done(cx.mode==='test'?(wrong?0:1):(wrong?.5:1));}
    else{wrong++;b.classList.add('wrong');cx.wrong(b);shake(b);
      if(cx.mode==='test'){done=true;$$('.d-opt',el)[it.a].classList.add('right','reveal');feedback(el,false,'الإجابة الصحيحة مُظلَّلة');cx.done(0);}
      else{feedback(el,false);if(wrong>=2)$$('.d-opt',el)[it.a].classList.add('hint');setTimeout(function(){b.classList.remove('wrong');},700);}}});});};
/* صح أو خطأ */
ACT.tf=function(it,el,cx){var m={k:'mcq',q:it.q,e:it.e,say:it.say,o:['صَحٌّ ✔','خَطَأٌ ✖'],a:it.a?0:1};ACT.mcq(m,el,cx);el.querySelector('.d-opts').classList.add('tf');};
/* إكمال الفراغ */
ACT.fill=function(it,el,cx){var parts=String(it.s).split('_');var m={k:'mcq',o:it.o,a:it.a,e:it.e};ACT.mcq(m,el,cx);
  var s=h('div','d-sent','<span>'+esc(parts[0])+'</span><b class="d-blank">؟</b><span>'+esc(parts[1]||'')+'</span>'+sayBtn(plain(it.s.replace('_',it.o[it.a]))));
  el.insertBefore(s,el.firstChild);if(it.q)el.insertBefore(h('div','d-q','<span>'+esc(it.q)+'</span>'),el.firstChild);
  var orig=cx.done;$$('.d-opt',el).forEach(function(b){b.addEventListener('click',function(){if(+b.dataset.i===it.a||cx.mode==='test'){var bl=$('.d-blank',el);bl.textContent=it.o[it.a];bl.classList.add('filled');}});});};
/* العدّ */
ACT.count=function(it,el,cx){var n=it.n,c=0,r=rng(it.e+n);var o=numOpts(r,n,2,1);
  el.innerHTML=q(it)+'<div class="d-count">'+Array.apply(null,{length:n}).map(function(_,i){return '<button class="d-obj" style="--d:'+(i*60)+'ms">'+esc(it.e)+'</button>';}).join('')+'</div><div class="d-tally">٠</div>';
  var tally=$('.d-tally',el);
  $$('.d-obj',el).forEach(function(b){b.addEventListener('click',function(){if(b.classList.contains('on'))return;b.classList.add('on');c++;b.setAttribute('data-n',ar(c));tally.textContent=ar(c);SND.play('pop');VOICE.say(String(c));});});
  var box=h('div','');el.appendChild(box);ACT.mcq({k:'mcq',o:o.map(ar),a:o.indexOf(n)},box,cx);box.querySelector('.d-opts').classList.add('short');};
/* المقارنة > < = */
ACT.cmp=function(it,el,cx){var ans=it.a>it.b?0:it.a<it.b?1:2;
  el.innerHTML='<div class="d-q">'+sayBtn('قارن بين العددين')+'<span>'+esc(it.q||'ضَعِ الإِشارَةَ المُناسِبَةَ')+'</span></div><div class="d-cmp"><b>'+ar(it.a)+'</b><i class="d-croc">؟</i><b>'+ar(it.b)+'</b></div>';
  var box=h('div','');el.appendChild(box);
  ACT.mcq({k:'mcq',o:['>','<','='],a:ans},box,{mode:cx.mode,right:function(b){$('.d-croc',el).textContent=['>','<','='][ans];$('.d-croc',el).classList.add('ok');cx.right(b);},wrong:cx.wrong,done:cx.done});
  box.querySelector('.d-opts').classList.add('short','cmp');};
/* إدخال عدد بلوحة أرقام كبيرة */
ACT.num=function(it,el,cx){var v='',wrong=0,done=false;
  el.innerHTML=q(it)+big(it.e)+(it.arr?arrHTML(it.arr):'')+'<div class="d-ans" aria-live="polite">؟</div><div class="d-pad">'+[1,2,3,4,5,6,7,8,9,'⌫',0,'✔'].map(function(k){return '<button data-k="'+k+'">'+(typeof k==='number'?ar(k):k)+'</button>';}).join('')+'</div>';
  var ans=$('.d-ans',el);
  $$('.d-pad button',el).forEach(function(b){b.addEventListener('click',function(){if(done)return;var k=b.dataset.k;SND.play('tap');
    if(k==='⌫')v=v.slice(0,-1);else if(k==='✔'){if(!v)return;if(+v===+it.a){done=true;ans.classList.add('ok');cx.right(ans);feedback(el,true);cx.done(cx.mode==='test'?(wrong?0:1):(wrong?.5:1));}
      else{wrong++;cx.wrong(ans);shake(ans);if(cx.mode==='test'){done=true;ans.textContent=ar(it.a);ans.classList.add('reveal');feedback(el,false,'الإجابة الصحيحة: '+ar(it.a));cx.done(0);return;}feedback(el,false);if(wrong>=2)feedback(el,false,'تلميح: الإجابة تبدأ بـ '+ar(String(it.a)[0]));v='';}}
    else if(v.length<6)v+=k;ans.textContent=v?ar(v):'؟';});});};
/* ترتيب / تركيب كلمة: النقر بالترتيب لملء الخانات */
ACT.order=function(it,el,cx){var items=it.items||it.parts,r=rng(items.join('|')),sh=shuffle(items.map(function(t,i){return {t:t,i:i};}),r),step=0,miss=0,total=items.length;
  if(sh.every(function(x,i){return x.i===i;})&&total>1)sh.reverse();
  var word=it.k==='build',joined=it.w||items.join('');
  el.innerHTML=q(it)+big(it.e)+'<div class="d-slots'+(word?' word':'')+'">'+items.map(function(){return '<span class="d-slot"></span>';}).join('')+'</div><div class="d-chips">'+sh.map(function(x){return '<button class="d-chip" data-i="'+x.i+'">'+esc(x.t)+'</button>';}).join('')+'</div>';
  var slots=$$('.d-slot',el);
  $$('.d-chip',el).forEach(function(b){b.addEventListener('click',function(){if(b.disabled)return;var i=+b.dataset.i;
    if(items[i]===items[step]){slots[step].textContent=items[step];slots[step].classList.add('on');b.disabled=true;b.classList.add('used');SND.play('drop');step++;
      if(step===total){if(word){$('.d-slots',el).classList.add('done');VOICE.say(plain(joined));}cx.right($('.d-slots',el));feedback(el,true);cx.done(Math.max(0,1-miss/total));}}
    else{miss++;cx.wrong(b);shake(b);if(miss>=2&&cx.mode!=='test'){var hb=$$('.d-chip',el).filter(function(c){return !c.disabled&&items[+c.dataset.i]===items[step];})[0];if(hb)hb.classList.add('hint');}}});});};
ACT.build=function(it,el,cx){var parts=it.parts||Array.from(plain(it.w)).filter(function(c){return c!==' ';});ACT.order({k:'build',q:it.q||'رَكِّبِ الكَلِمَةَ',e:it.e,parts:parts,w:it.w},el,cx);};
/* تصنيف: اسحب أو انقر البطاقة ثم السلة */
ACT.sort=function(it,el,cx){var r=rng(JSON.stringify(it.items)),list=shuffle(it.items.map(function(x,i){return {t:x[0],b:x[1],i:i};}),r),placed=0,miss=0,sel=null;
  el.innerHTML=q(it)+'<div class="d-pool">'+list.map(function(x){return '<button class="d-sc" data-i="'+x.i+'">'+esc(x.t)+'</button>';}).join('')+'</div><div class="d-bins n'+it.bins.length+'">'+it.bins.map(function(b,i){var bb=typeof b==='string'?{t:b}:b;return '<div class="d-bin" data-b="'+i+'"><b>'+(bb.e?'<i>'+esc(bb.e)+'</i>':'')+esc(bb.t)+'</b><div class="d-binin"></div></div>';}).join('')+'</div>'+(cx.mode!=='test'?'<p class="d-tip">اسْحَبِ البِطاقَةَ إلى مَكانِها، أوِ انْقُرْها ثُمَّ انْقُرِ المَكانَ</p>':'');
  function put(card,bin){var x=it.items[+card.dataset.i];if(+bin.dataset.b===x[1]){$('.d-binin',bin).appendChild(card);card.classList.add('in');card.disabled=true;card.classList.remove('sel');SND.play('drop');placed++;sel=null;
      bin.classList.add('flash');setTimeout(function(){bin.classList.remove('flash');},400);
      if(placed===it.items.length){cx.right(el.querySelector('.d-bins'));feedback(el,true);cx.done(Math.max(0,1-miss/it.items.length));}}
    else{miss++;cx.wrong(card);shake(card);card.classList.remove('sel');sel=null;if(cx.mode!=='test')feedback(el,false);}}
  $$('.d-sc',el).forEach(function(c){c.addEventListener('click',function(){if(c.disabled||c._dragged)return;$$('.d-sc.sel',el).forEach(function(x){x.classList.remove('sel');});sel=c;c.classList.add('sel');SND.play('tap');});
    drag(c,function(x,y){var t=document.elementFromPoint(x,y);var bin=t&&t.closest&&t.closest('.d-bin');if(bin&&el.contains(bin))put(c,bin);});});
  $$('.d-bin',el).forEach(function(b){b.addEventListener('click',function(){if(sel)put(sel,b);});});};
/* سحب بالمؤشر مع إرجاع البطاقة لمكانها */
function drag(n,onDrop){var sx,sy,dx,dy,on=false,ghost=null;
  n.addEventListener('pointerdown',function(e){if(n.disabled)return;sx=e.clientX;sy=e.clientY;on=true;n._dragged=false;try{n.setPointerCapture(e.pointerId);}catch(x){}});
  n.addEventListener('pointermove',function(e){if(!on)return;dx=e.clientX-sx;dy=e.clientY-sy;if(!n._dragged&&Math.abs(dx)+Math.abs(dy)<10)return;
    if(!n._dragged){n._dragged=true;n.classList.add('drag');}n.style.transform='translate('+dx+'px,'+dy+'px) scale(1.08)';});
  function end(e){if(!on)return;on=false;if(n._dragged){n.style.transform='';n.classList.remove('drag');n.style.visibility='hidden';onDrop(e.clientX,e.clientY);n.style.visibility='';setTimeout(function(){n._dragged=false;},50);}}
  n.addEventListener('pointerup',end);n.addEventListener('pointercancel',function(){on=false;n.style.transform='';n.classList.remove('drag');n._dragged=false;});}
/* توصيل: انقر عنصرًا من اليمين ثم مقابله */
ACT.match=function(it,el,cx){var r=rng(JSON.stringify(it.pairs)),L=it.pairs.map(function(p,i){return {t:p[0],i:i};}),R=shuffle(it.pairs.map(function(p,i){return {t:p[1],i:i};}),r),sel=null,got=0,miss=0;
  var cols=['#F28C38','#3D9BE9','#5BBF6A','#C46BD8','#E85D75','#E8B92F'];
  el.innerHTML=q(it)+'<div class="d-match"><div>'+L.map(function(x){return '<button class="d-m a" data-i="'+x.i+'">'+esc(x.t)+'</button>';}).join('')+'</div><div>'+R.map(function(x){return '<button class="d-m b" data-i="'+x.i+'">'+esc(x.t)+'</button>';}).join('')+'</div></div>';
  $$('.d-m',el).forEach(function(b){b.addEventListener('click',function(){if(b.disabled)return;SND.play('tap');
    if(!sel||sel.classList.contains(b.classList.contains('a')?'a':'b')){$$('.d-m.sel',el).forEach(function(x){x.classList.remove('sel');});sel=b;b.classList.add('sel');return;}
    if(sel.dataset.i===b.dataset.i){var c=cols[got%cols.length];[sel,b].forEach(function(x){x.disabled=true;x.classList.remove('sel');x.classList.add('done');x.style.setProperty('--mc',c);});got++;SND.play('good');sel=null;
      if(got===it.pairs.length){cx.right(el.querySelector('.d-match'));feedback(el,true);cx.done(Math.max(0,1-miss/it.pairs.length));}}
    else{miss++;cx.wrong(b);shake(b);sel.classList.remove('sel');sel=null;}});});};
/* اختيار كل الصحيح */
ACT.pick=function(it,el,cx){var need=it.items.filter(function(x){return x[1];}).length,got=0,miss=0;
  el.innerHTML=q(it)+'<div class="d-pickg">'+it.items.map(function(x,i){return '<button class="d-pk" data-i="'+i+'">'+esc(x[0])+'</button>';}).join('')+'</div>';
  $$('.d-pk',el).forEach(function(b){b.addEventListener('click',function(){if(b.disabled)return;var x=it.items[+b.dataset.i];
    if(x[1]){b.disabled=true;b.classList.add('right');got++;cx.right(b);if(got===need){feedback(el,true);cx.done(Math.max(0,1-miss/need));}}
    else{miss++;b.classList.add('wrong');cx.wrong(b);shake(b);setTimeout(function(){b.classList.remove('wrong');},700);}});});};
/* بوابة «تدخل أم لا تدخل؟»: لكل بطاقة زرّان */
ACT.gate=function(it,el,cx){var n=it.items.length,ok=0,miss=0,yes=it.yes||'تَدْخُلُ',no=it.no||'لا تَدْخُلُ';
  el.innerHTML=q(it)+'<div class="d-gate">'+it.items.map(function(x,i){return '<div class="d-gi" data-i="'+i+'"><span class="n">'+ar(i+1)+'</span><b>'+esc(x[0])+'</b>'+sayBtn(plain(x[0]))+'<div class="d-yn"><button data-v="1">'+I.check+'<span>'+yes+'</span></button><button data-v="0">'+I.x+'<span>'+no+'</span></button></div></div>';}).join('')+'</div>';
  $$('.d-gi',el).forEach(function(row){var x=it.items[+row.dataset.i],tries=0;$$('button[data-v]',row).forEach(function(b){b.addEventListener('click',function(){if(row.classList.contains('ok')||row.classList.contains('bad'))return;
    if((b.dataset.v==='1')===!!x[1]){row.classList.add('ok',x[1]?'in':'out');ok++;cx.right(b);if(tries)miss++;
      if(ok+(cx.mode==='test'?$$('.d-gi.bad',el).length:0)===n){feedback(el,true);cx.done(Math.max(0,1-miss/n));}}
    else{tries++;cx.wrong(b);shake(row);if(cx.mode==='test'){row.classList.add('bad');miss++;if(ok+$$('.d-gi.bad',el).length===n){feedback(el,true,'انتهيت!');cx.done(Math.max(0,1-miss/n));}}}});});});};
/* القفز على خط الأعداد */
ACT.line=function(it,el,cx){var from=it.from||0,to=it.to||20,st=it.start,j=it.jump,ans=st+j,span=to-from;
  el.innerHTML=q(it)+'<div class="d-line"><div class="d-lt">'+Array.apply(null,{length:span+1}).map(function(_,i){var v=from+i;return '<button class="d-tick'+(v===st?' st':'')+'" data-v="'+v+'" style="--x:'+(i/span*100)+'%"><i></i><span>'+((span<=20||v%5===0)?ar(v):'')+'</span></button>';}).join('')+'<div class="d-frog" style="--x:'+((st-from)/span*100)+'%">🐸</div></div></div>';
  var frog=$('.d-frog',el),wrong=0,done=false;
  $$('.d-tick',el).forEach(function(b){b.addEventListener('click',function(){if(done)return;var v=+b.dataset.v;
    if(v===ans){done=true;frog.style.setProperty('--x',((v-from)/span*100)+'%');frog.classList.add('hop');b.classList.add('right');cx.right(b);feedback(el,true);cx.done(wrong?.5:1);}
    else{wrong++;cx.wrong(b);shake(b);if(cx.mode==='test'){done=true;$$('.d-tick',el).filter(function(x){return +x.dataset.v===ans;})[0].classList.add('right');cx.done(0);}else feedback(el,false);}});});};
/* الكسور: ظلّل الأجزاء */
ACT.frac=function(it,el,cx){var n=it.n,d=it.d,on=0,done=false;
  el.innerHTML='<div class="d-q">'+sayBtn('ظلل '+n+' من '+d)+'<span>'+esc(it.q||'ظَلِّلْ')+' <b class="d-fr"><sup>'+ar(n)+'</sup><sub>'+ar(d)+'</sub></b></span></div><div class="d-pie">'+pie(d)+'</div><button class="btn gold d-check">'+I.check+'تحقَّق</button>';
  $$('.d-pie path',el).forEach(function(p){p.addEventListener('click',function(){if(done)return;p.classList.toggle('on');on=$$('.d-pie path.on',el).length;SND.play('tap');});});
  var wrong=0;$('.d-check',el).addEventListener('click',function(){if(done)return;if(on===n){done=true;cx.right($('.d-pie',el));feedback(el,true);cx.done(wrong?.5:1);}else{wrong++;cx.wrong($('.d-pie',el));shake($('.d-pie',el));if(cx.mode==='test'){done=true;cx.done(0);feedback(el,false,'المطلوب '+ar(n)+' من '+ar(d));}else feedback(el,false,on>n?'ظلَّلت أكثر من المطلوب':'ظلِّل أجزاء أكثر');}});};
function pie(d){var s='<svg viewBox="-110 -110 220 220">';for(var i=0;i<d;i++){var a0=i/d*Math.PI*2-Math.PI/2,a1=(i+1)/d*Math.PI*2-Math.PI/2;
  s+='<path d="M0 0 L'+(100*Math.cos(a0)).toFixed(2)+' '+(100*Math.sin(a0)).toFixed(2)+' A100 100 0 '+(a1-a0>Math.PI?1:0)+' 1 '+(100*Math.cos(a1)).toFixed(2)+' '+(100*Math.sin(a1)).toFixed(2)+' Z"/>';}return s+'</svg>';}

function render(it,el,cx){cx=cx||{};cx.mode=cx.mode||'learn';cx.right=cx.right||function(n){SND.play('good');boom(n);};cx.wrong=cx.wrong||function(){SND.play('bad');};cx.done=cx.done||function(){};
  var f=ACT[it.k];el.classList.add('d-act','k-'+it.k);if(!f){el.innerHTML='<p class="note">نوع غير معروف</p>';return;}
  var called=false,d=cx.done;cx.done=function(s){if(called)return;called=true;d(s);};f(it,el,cx);}

/* أسئلة قصيرة تصلح لكل الألعاب: {q,o,a} */
function toMCQ(it){switch(it.k){
  case 'mcq':return {q:it.q||'',o:it.o,a:it.a,e:it.e};
  case 'tf':return {q:it.q,o:['صَحٌّ','خَطَأٌ'],a:it.a?0:1,e:it.e};
  case 'fill':return {q:it.s.replace('_','___'),o:it.o,a:it.a,e:it.e};
  case 'count':var o=[it.n-1,it.n,it.n+1].filter(function(x){return x>0;});return {q:'كَمْ؟ '+Array(it.n+1).join(it.e),o:o.map(ar),a:o.indexOf(it.n)};
  case 'cmp':return {q:ar(it.a)+' ؟ '+ar(it.b),o:['>','<','='],a:it.a>it.b?0:it.a<it.b?1:2};
  case 'num':return null;
  default:return null;}}
function atoms(items){var out=[];(items||[]).forEach(function(it){if(!it)return;
  if(it.k==='gate')it.items.forEach(function(x){out.push({k:'tf',q:x[0],a:!!x[1]});});
  else if(it.k==='match')it.pairs.forEach(function(p,i){var others=it.pairs.filter(function(_,j){return j!==i;}).map(function(x){return x[1];}).slice(0,2);var o=shuffle([p[1]].concat(others),rng(p[0]));out.push({k:'mcq',q:p[0],o:o,a:o.indexOf(p[1])});});
  else if(it.k==='sort')it.items.forEach(function(x){var bins=it.bins.map(function(b){return typeof b==='string'?b:b.t;});out.push({k:'mcq',q:x[0],o:bins,a:x[1]});});
  else if(it.k==='pick')it.items.forEach(function(x){out.push({k:'tf',q:(it.q?it.q+': ':'')+x[0],a:!!x[1]});});
  else if(it.k==='frac'||it.k==='line'||it.k==='order'||it.k==='build')out.push(it);
  else out.push(it);});return out;}

window.DARSI=window.DARSI||{};
Object.assign(window.DARSI,{$:$,$$:$$,esc:esc,h:h,uid:uid,ar:ar,ymd:ymd,fdate:fdate,norm:norm,plain:plain,hash:hash,rng:rng,shuffle:shuffle,
  DB:DB,lsGet:lsGet,lsSet:lsSet,SND:SND,VOICE:VOICE,sayBtn:sayBtn,SPK:SPK,praise:praise,retry:retry,boom:boom,
  REG:REG,SUBJ:SUBJ,book:book,bookA:bookA,lessonsOf:lessonsOf,GEN:GEN,expand:expand,render:render,ACT:ACT,toMCQ:toMCQ,atoms:atoms,RMQ:RMQ});
})();
