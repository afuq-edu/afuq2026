/* =====================================================================
   درسي · الألعاب التفاعلية (تأخذ أسئلتها من الدروس المختارة)
   فرقعة البالونات · بطاقات الذاكرة · شدّ الحبل (فريقان) · عجلة الأسماء · قطار الترتيب · اصطد الصحيح
   ===================================================================== */
(function(){
'use strict';
var D=window.DARSI,TB=window.TB,I=TB.I,$=D.$,$$=D.$$,esc=D.esc,h=D.h,ar=D.ar,SND=D.SND,VOICE=D.VOICE,plain=D.plain;

/* بنك أسئلة الدرس: كل ما في الحصة من أنشطة بعد توليدها */
function bank(L,seed){var items=[].concat(L.warm||[],L.acts||[],L.chal?[L.chal]:[],L.exit?[L.exit]:[],L.hw||[],L.bank||[]);return D.expand(items,(seed||'b')+L.id);}
function mcqs(lessons,seed){var out=[];lessons.forEach(function(L){D.atoms(bank(L,seed)).forEach(function(a){var m=D.toMCQ(a);if(m&&m.o&&m.o.length>=2&&String(m.q).length<90)out.push(m);});});return D.shuffle(out,D.rng(seed||'g'));}
function orders(lessons){var out=[];lessons.forEach(function(L){bank(L,'o').forEach(function(a){if(a.k==='order'&&a.items.length<=7)out.push({q:a.q,items:a.items});else if(a.k==='build'){var p=a.parts||Array.from(plain(a.w)).filter(function(c){return c!==' ';});if(p.length<=7)out.push({q:a.q||'رتّب لتكوّن الكلمة',items:p,w:a.w});}});});return out;}
function pairs(lessons){var out=[];lessons.forEach(function(L){bank(L,'p').forEach(function(a){if(a.k==='match')a.pairs.forEach(function(p){out.push(p);});});});
  if(out.length<4)mcqs(lessons,'pp').forEach(function(m){var q=String(m.q),o=String(m.o[m.a]);if(q.length<26&&o.length<16)out.push([q,o]);});return out;}
function sorts(lessons){var out=[];lessons.forEach(function(L){bank(L,'s').forEach(function(a){if(a.k==='sort')out.push(a);});});return out;}

var GAMES=[
 {id:'balloon',n:'فرقعة البالونات',e:'🎈',d:'افرقع البالون الذي يحمل الإجابة الصحيحة',need:'mcq'},
 {id:'memory',n:'بطاقات الذاكرة',e:'🃏',d:'اقلب البطاقات وطابق كل زوج',need:'pair'},
 {id:'tug',n:'شدّ الحبل',e:'🪢',d:'فريقان يتسابقان: كل إجابة صحيحة تشدّ الحبل',need:'mcq'},
 {id:'wheel',n:'عجلة الأسماء',e:'🎡',d:'تدور العجلة وتختار طالبًا يجيب ويكسب النقاط',need:'mcq'},
 {id:'train',n:'قطار الترتيب',e:'🚂',d:'رتّب العربات بالترتيب الصحيح',need:'order'},
 {id:'catch',n:'اصطد الصحيح',e:'🧺',d:'التقط البطاقات التي تناسب السلة',need:'sort'}
];

var CUR=null;
function shell(g,title){close();var w=h('div','g-wrap');w.innerHTML='<header class="d-top"><button class="d-ib" data-x="close" aria-label="إغلاق">'+I.x+'</button><div class="d-tt"><span class="d-stage" style="background:#C46BD8">'+g.e+' '+esc(g.n)+'</span><b>'+esc(title||'')+'</b></div><div class="d-tools g-score"><span class="d-stars">⭐ <b>٠</b></span><button class="d-ib" data-x="snd">'+(SND.on?'🔊':'🔇')+'</button></div></header><main class="g-stage"></main>';
  document.body.appendChild(w);document.documentElement.classList.add('d-noscroll','fx-pause');var score=0,timers=[];
  w.addEventListener('click',function(e){var b=e.target.closest('[data-x]');if(!b)return;if(b.dataset.x==='close')close();else if(b.dataset.x==='snd'){SND.set(!SND.on);b.textContent=SND.on?'🔊':'🔇';}});
  CUR={w:w,timers:timers,add:function(n){score+=n;$('.d-stars b',w).textContent=ar(score);var s=$('.d-stars',w);s.classList.remove('bump');void s.offsetWidth;s.classList.add('bump');},get score(){return score;},stage:$('.g-stage',w)};return CUR;}
function close(){if(!CUR)return;CUR.timers.forEach(clearTimeout);CUR.timers.forEach(clearInterval);VOICE.stop();CUR.w.remove();CUR=null;document.documentElement.classList.remove('d-noscroll','fx-pause');}
function endScreen(G,msg,again){var e=h('div','g-end','<div class="big">🏆</div><h2>'+esc(msg||'انتهت اللعبة!')+'</h2><p class="lead">النقاط: <b>'+ar(G.score)+'</b></p><div class="row"><button class="btn gold" data-a="again">'+I.reset+'العب مرة أخرى</button><button class="btn soft" data-a="out">'+I.x+'خروج</button></div>');
  G.stage.innerHTML='';G.stage.appendChild(e);TB.celebrate();SND.play('win');e.querySelector('[data-a=again]').onclick=again;e.querySelector('[data-a=out]').onclick=close;}
function qBar(G,m){var q=h('div','g-q','<span>'+esc(m.q)+'</span>'+D.sayBtn(plain(m.q)));G.stage.appendChild(q);return q;}
var COLS=['#FF7A59','#3D9BE9','#5BBF6A','#C46BD8','#F2B134','#E85D75','#1FA2A8'];

/* فرقعة البالونات */
function balloon(lessons,title){var g=GAMES[0],qs=mcqs(lessons,'bl'+Date.now()).slice(0,10);if(!qs.length)return none();var G=shell(g,title),k=0;
  function round(){G.timers.forEach(clearTimeout);G.timers.length=0;if(k>=qs.length)return endScreen(G,'فرقعت كل البالونات!',function(){balloon(lessons,title);});
    var m=qs[k];G.stage.innerHTML='';qBar(G,m);var W=G.stage.clientWidth;
    function launch(){var order=D.shuffle(m.o.map(function(o,i){return i;}));order.forEach(function(i,n){var b=h('button','g-balloon',esc(m.o[i]));b.style.left=Math.max(8,Math.min(W-160,(n+.5)*W/order.length-70+Math.random()*40-20))+'px';b.style.background=COLS[(i+k)%COLS.length];b.style.setProperty('--t',(8+Math.random()*3)+'s');b.style.setProperty('--sw',(Math.random()*60-30)+'px');b.style.animationDelay=(n*.5)+'s';
      b.onclick=function(){if(i===m.a){b.classList.add('pop');SND.play('pop');SND.play('good');D.boom(b);G.add(1);k++;setTimeout(round,500);}else{SND.play('bad');b.classList.add('d-shake');setTimeout(function(){b.classList.add('pop');},300);}};G.stage.appendChild(b);});}
    launch();G.timers.push(setInterval(function(){$$('.g-balloon',G.stage).forEach(function(b){if(b.getBoundingClientRect().bottom<0)b.remove();});if(!$('.g-balloon',G.stage))launch();},1500));}
  round();}
/* الذاكرة */
function memory(lessons,title){var g=GAMES[1],ps=D.shuffle(pairs(lessons)).slice(0,6);if(ps.length<3)return none();var G=shell(g,title),open=[],done=0,lock=false;
  var cards=D.shuffle([].concat(ps.map(function(p,i){return {t:p[0],i:i};}),ps.map(function(p,i){return {t:p[1],i:i};})));
  G.stage.innerHTML='<div class="g-mem" style="--c:'+(cards.length>8?4:cards.length>6?4:3)+'">'+cards.map(function(c,n){return '<button class="g-mc" data-i="'+c.i+'"><div><span class="bk">❓</span><span class="fr">'+esc(c.t)+'</span></div></button>';}).join('')+'</div>';
  $$('.g-mc',G.stage).forEach(function(c){c.onclick=function(){if(lock||c.classList.contains('open')||c.classList.contains('done'))return;c.classList.add('open');SND.play('flip');open.push(c);
    if(open.length===2){lock=true;var a=open[0],b=open[1];if(a.dataset.i===b.dataset.i){setTimeout(function(){a.classList.add('done');b.classList.add('done');SND.play('good');G.add(1);open=[];lock=false;done++;if(done===ps.length)setTimeout(function(){endScreen(G,'ذاكرة رائعة!',function(){memory(lessons,title);});},700);},400);}
      else setTimeout(function(){a.classList.remove('open');b.classList.remove('open');open=[];lock=false;},1000);}};});}
/* شد الحبل */
function tug(lessons,title){var g=GAMES[2],qs=mcqs(lessons,'tg'+Date.now());if(!qs.length)return none();var G=shell(g,title),pos=0,turn=0,k=0,LIM=4;
  var names=[D.lsGet('darsi:teamA','فريق النجوم'),D.lsGet('darsi:teamB','فريق الأبطال')];
  G.stage.innerHTML='<div class="g-tug"><div class="g-rope"><div class="mid"></div><div class="r"></div><div class="k">🪢</div></div><div class="g-teams"><div class="g-team a"><h3>⭐ '+esc(names[0])+'</h3><b class="sa">٠</b></div><div class="g-team b"><h3>🏅 '+esc(names[1])+'</h3><b class="sb">٠</b></div></div><div class="g-tq"></div></div>';
  var sc=[0,0];
  function render(){var k2=$('.g-rope .k',G.stage);k2.style.left=(50-pos*11)+'%';$$('.g-team',G.stage).forEach(function(t,i){t.classList.toggle('turn',i===turn);});$('.sa',G.stage).textContent=ar(sc[0]);$('.sb',G.stage).textContent=ar(sc[1]);
    if(Math.abs(pos)>=LIM){var win=pos>0?0:1;return endScreen(G,'فاز '+names[win]+'! 🎉',function(){tug(lessons,title);});}
    var m=qs[k++%qs.length],box=$('.g-tq',G.stage);box.innerHTML='';var a=h('div','');box.appendChild(a);
    D.render({k:'mcq',q:'دور '+names[turn]+': '+m.q,o:m.o,a:m.a,e:m.e},a,{mode:'test',done:function(s){if(s>0){sc[turn]++;pos+=turn===0?1:-1;G.add(1);}setTimeout(function(){turn=1-turn;render();},1100);}});}
  render();}
/* عجلة الأسماء: تعرض طلاب الشعبة المختارة فقط */
function clsPick(grade){var H=D.hooks,cs=H.classes?H.classes():[],ok={};cs.forEach(function(c){ok[c.id]=1;});
  var cur=(H.cls?H.cls():[]).filter(function(id){return ok[id];});
  if(!cur.length&&cs.length){var m=cs.filter(function(c){return !grade||c.g===grade;});cur=[(m[0]||cs[0]).id];}
  return {cs:cs,cur:cur,list:function(){return H.studentsCls?H.studentsCls(cur):[];},
    toggle:function(id){var i=cur.indexOf(id);if(i>=0){if(cur.length>1)cur.splice(i,1);}else cur.push(id);if(H.cls)H.cls(cur.slice());},
    html:function(){return '<div class="g-clsbox"><small>اختاري الصف أو الشعبة (يمكن أكثر من واحدة):</small><div class="seg g-cls" role="group" aria-label="الشعب">'+cs.map(function(c){return '<button data-wc="'+c.id+'" aria-pressed="'+(cur.indexOf(c.id)>=0)+'">'+esc(c.name)+'</button>';}).join('')+'</div></div>';}};}
function wheel(lessons,title){var g=GAMES[3],qs=mcqs(lessons,'wh'+Date.now()),grade=lessons[0]&&lessons[0].grade,P=clsPick(grade),list=P.list();
  if(!list.length){TB.toast('أضيفي أسماء طلاب الصف من قسم الطلاب لتعمل العجلة');return;}var G=shell(g,title),rot=0,k=0,n,seg;
  function draw(){list=P.list();n=list.length;seg=360/n;return '<svg viewBox="-100 -100 200 200">'+list.map(function(s,i){var a0=(i*seg-90)*Math.PI/180,a1=((i+1)*seg-90)*Math.PI/180,mid=((i+.5)*seg-90)*Math.PI/180;
    return '<path d="M0 0 L'+(98*Math.cos(a0)).toFixed(2)+' '+(98*Math.sin(a0)).toFixed(2)+' A98 98 0 '+(seg>180?1:0)+' 1 '+(98*Math.cos(a1)).toFixed(2)+' '+(98*Math.sin(a1)).toFixed(2)+'Z" fill="'+COLS[i%COLS.length]+'" stroke="#fff" stroke-width="1"/><text x="'+(62*Math.cos(mid)).toFixed(1)+'" y="'+(62*Math.sin(mid)).toFixed(1)+'" fill="#fff" font-size="'+Math.max(5,Math.min(11,120/n))+'" font-weight="700" text-anchor="middle" dominant-baseline="middle" transform="rotate('+((i+.5)*seg)+' '+(62*Math.cos(mid)).toFixed(1)+' '+(62*Math.sin(mid)).toFixed(1)+')">'+esc(String(s.name).split(' ')[0])+'</text>';}).join('')+'<circle r="12" fill="#fff"/></svg>';}
  G.stage.innerHTML='<div class="stack" style="align-items:center;width:min(900px,100%)">'+P.html()+'<div class="g-wheel"><span class="pin">🔻</span>'+draw()+'</div><button class="btn gold lg g-spin">🎡 أدِر العجلة</button><div class="g-wq" style="width:100%"></div></div>';
  $$('[data-wc]',G.stage).forEach(function(b){b.onclick=function(){if($('.g-spin',G.stage).disabled)return;P.toggle(b.dataset.wc);$$('[data-wc]',G.stage).forEach(function(x){x.setAttribute('aria-pressed',P.cur.indexOf(x.dataset.wc)>=0);});rot=0;var w=$('.g-wheel',G.stage);w.innerHTML='<span class="pin">🔻</span>'+draw();$('.g-wq',G.stage).innerHTML='';SND.play('tap');};});
  $('.g-spin',G.stage).onclick=function(){var b=this;if(!n)return;b.disabled=true;var i=Math.floor(Math.random()*n);rot+=360*5+(360-(i+.5)*seg)-(rot%360);$('.g-wheel svg',G.stage).style.transform='rotate('+rot+'deg)';SND.play('whoosh');
    setTimeout(function(){var s=list[i];VOICE.say(s.name);SND.play('good');var box=$('.g-wq',G.stage);box.innerHTML='<h2 class="d-h" style="justify-content:center">🎯 '+esc(s.name)+'</h2>';var a=h('div','');box.appendChild(a);
      if(qs.length){var m=qs[k++%qs.length];D.render({k:'mcq',q:m.q,o:m.o,a:m.a,e:m.e},a,{mode:'test',done:function(sc){if(sc>0){G.add(1);if(D.hooks.addPoint){D.hooks.addPoint(s.id,1,'لعبة','wheel');TB.toast('+١ نقطة لـ '+s.name,{gold:true,icon:'star'});}}b.disabled=false;}});}else b.disabled=false;},4600);};}
/* قطار الترتيب */
function train(lessons,title){var g=GAMES[4],os=D.shuffle(orders(lessons)).slice(0,8);if(!os.length)return none();var G=shell(g,title),k=0;
  function round(){if(k>=os.length)return endScreen(G,'وصل القطار!',function(){train(lessons,title);});var o=os[k];G.stage.innerHTML='';var box=h('div','d-card t-act');box.style.width='min(1000px,100%)';G.stage.appendChild(box);
    box.innerHTML='<h2 class="d-h">🚂 '+esc(o.q||'رتّب العربات')+'</h2><div class="a"></div>';D.render({k:'order',q:'',items:o.items,w:o.w},$('.a',box),{mode:'learn',done:function(){G.add(1);SND.play('win');k++;setTimeout(round,1300);}});
    $('.d-slots',box).classList.add('g-train');$$('.d-slot',box).forEach(function(s){s.classList.add('g-wagon');});}
  round();}
/* اصطد الصحيح: بطاقات تسقط وتختار السلة */
function catchG(lessons,title){var g=GAMES[5],ss=D.shuffle(sorts(lessons));if(!ss.length)return none();var G=shell(g,title),k=0;
  function round(){if(k>=ss.length||k>=4)return endScreen(G,'صيد موفق!',function(){catchG(lessons,title);});var s=ss[k],bin=Math.floor(Math.random()*s.bins.length),bn=typeof s.bins[bin]==='string'?s.bins[bin]:s.bins[bin].t;
    var targets=s.items.filter(function(x){return x[1]===bin;}).length,got=0;G.stage.innerHTML='';qBar(G,{q:'🧺 التقط كل ما يناسب: «'+bn+'»'});var W=G.stage.clientWidth,list=D.shuffle(s.items.concat(s.items)),n=0;
    var iv=setInterval(function(){if(n>=list.length){clearInterval(iv);setTimeout(function(){k++;round();},4000);return;}var x=list[n++];var f=h('button','g-fall',esc(x[0]));f.style.left=Math.random()*(W-180)+10+'px';f.style.setProperty('--t',(6+Math.random()*2)+'s');
      f.onclick=function(){if(x[1]===bin){SND.play('good');D.boom(f);G.add(1);f.remove();}else{SND.play('bad');f.classList.add('d-shake');f.style.borderColor='#E0475B';}};G.stage.appendChild(f);setTimeout(function(){f.remove();},9000);},1100);G.timers.push(iv);}
  round();}
function none(){TB.toast('لا توجد أسئلة مناسبة لهذه اللعبة في الدروس المختارة؛ جرّبي لعبة أخرى');}

D.games={clsPick:clsPick,list:GAMES,run:function(id,lessons,title){({balloon:balloon,memory:memory,tug:tug,wheel:wheel,train:train,'catch':catchG})[id](lessons,title);},close:close,bank:bank,mcqs:mcqs};
D.bank=bank;
})();
