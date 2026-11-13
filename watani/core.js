/* =====================================================================
   «تحدّي هذا وطني» · النواة: أدوات، ثيمات، خلفية، ترحيب، تثبيت، موجّه الصفحات
   ===================================================================== */
(function(){
'use strict';
var W=window.W={};
var $=W.$=function(s,r){return (r||document).querySelector(s);};
var $$=W.$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));};
var esc=W.esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});};
var AR='٠١٢٣٤٥٦٧٨٩';
W.ar=function(v){return String(v==null?'':v).replace(/\d/g,function(d){return AR[d];}).replace(/\./g,'٫');};
W.en=function(v){return String(v==null?'':v).replace(/[٠-٩]/g,function(d){return AR.indexOf(d);});};
W.shuffle=function(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a;};
W.clone=function(o){return o==null?o:JSON.parse(JSON.stringify(o));};
W.uid=function(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7);};
W.pct=function(a,b){return b?Math.round(a/b*100):0;};
W.lsg=function(k,d){try{var v=localStorage.getItem('watani:'+k);return v?JSON.parse(v):d;}catch(e){return d;}};
W.lss=function(k,v){try{localStorage.setItem('watani:'+k,JSON.stringify(v));}catch(e){}};
W.fmtT=function(s){s=Math.max(0,Math.round(s||0));var m=Math.floor(s/60),x=s%60;return W.ar(m+':'+(x<10?'0':'')+x);};
W.when=function(t){if(!t)return '';var d=new Date(t);return W.ar(d.toLocaleDateString('ar-OM-u-nu-latn',{day:'numeric',month:'long'})+' · '+d.toLocaleTimeString('ar-OM-u-nu-latn',{hour:'numeric',minute:'2-digit'}));};

/* ---------- الشعب ---------- */
W.SECS=[];for(var i=1;i<=12;i++)W.SECS.push({id:'11-'+i,name:'١١/'+W.ar(i)});
W.secName=function(id){var s=W.SECS.filter(function(x){return x.id===id;})[0];return s?s.name:(id||'—');};
W.LV={1:'مَعْرِفَة',2:'تَطْبِيق',3:'اسْتِدْلَال'};
W.LVp={1:'معرفة',2:'تطبيق',3:'استدلال'};
W.TY={mc:'اختيار من متعدد',tf:'صواب أو خطأ',fl:'أكملي الفراغ',sa:'إجابة قصيرة'};
W.KEYS=['أ','ب','ج','د','هـ','و'];

/* ---------- أيقونات ---------- */
var P={
 home:'<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
 play:'<circle cx="12" cy="12" r="9"/><path d="M10 8.5l5.5 3.5-5.5 3.5z"/>',
 chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
 tree:'<path d="M3 5h5v4H3zM3 15h5v4H3zM16 10h5v4h-5z"/><path d="M8 7h3v10H8M11 12h5"/>',
 screen:'<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
 book:'<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z"/><path d="M20 4h-4a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h5z"/>',
 trophy:'<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
 award:'<circle cx="12" cy="9" r="6"/><path d="M9 14.5L7.5 22 12 19.5 16.5 22 15 14.5"/>',
 gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1A1.6 1.6 0 0 0 9 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1A1.6 1.6 0 0 0 4.6 9a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/>',
 dl:'<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
 pal:'<path d="M12 3a9 9 0 1 0 0 18c1.2 0 2-.8 2-2 0-.6-.2-1-.5-1.4-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.3A4.7 4.7 0 0 0 22 9.7C22 6 17.5 3 12 3z"/><circle cx="7.5" cy="11" r="1.2"/><circle cx="10.5" cy="7" r="1.2"/><circle cx="15.5" cy="7.5" r="1.2"/>',
 out:'<path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 17l-5-5 5-5M5 12h11"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
 users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6.5 6.5 0 0 1 4 6"/>',
 menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
 x:'<path d="M6 6l12 12M18 6L6 18"/>',
 edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M14 6l4 4"/>',
 trash:'<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
 qr:'<path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3z"/><path d="M14 14h3v3h-3zM18 18h3v3h-3zM14 20h2M20 14v2"/>',
 full:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
 printer:'<path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M6 14h12v7H6z"/>',
 lock:'<rect x="4" y="10" width="16" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
 shuffle:'<path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>',
 img:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/>',
 eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
 undo:'<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>',
 bolt:'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
 star:'<path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/>',
 link:'<path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>',
 save:'<path d="M5 3h11l3 3v15H5z"/><path d="M8 3v6h8V3M8 21v-7h8v7"/>',
 up:'<path d="M12 19V5M5 12l7-7 7 7"/>'
};
W.ic=function(n){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(P[n]||'')+'</svg>';};

/* شرفات القلعة: خط زخرفي من الأبراج المسنّنة */
W.crenel=function(){var d='M0 11',x=0;while(x<1200){d+=' H'+(x+14)+' V4 H'+(x+20)+' V1 H'+(x+28)+' V4 H'+(x+34)+' V11';x+=40;}return '<svg class="crenel" viewBox="0 0 1200 12" preserveAspectRatio="none" aria-hidden="true"><path d="'+d+' H1200" fill="none" stroke="currentColor" stroke-width="1"/></svg>';};
W.wallSVG=function(){var d='M0 79',x=0;while(x<1600){var h=x%200===0?26:0;d+=' H'+(x+28)+' V'+(50-h)+' H'+(x+36)+' V'+(40-h)+' H'+(x+52)+' V'+(50-h)+' H'+(x+60)+' V79';x+=80;}return '<svg class="crenel-wall" viewBox="0 0 1600 80" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><path d="'+d+' H1600"/></svg>';};

/* ---------- تنبيه وحوار ---------- */
var tt=null;
W.toast=function(m){var o=$('.toast');if(o)o.remove();var d=document.createElement('div');d.className='toast';d.setAttribute('role','status');d.textContent=m;document.body.appendChild(d);clearTimeout(tt);tt=setTimeout(function(){d.remove();},2600);};
W.dlg=function(html,o){o=o||{};var d=document.createElement('div');d.className='dlg';d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');
  d.innerHTML='<div class="box'+(o.wide?' wide':'')+(o.cls?' '+o.cls:'')+'"><button class="icon-x x" aria-label="إغلاق">✕</button>'+html+'</div>';
  document.body.appendChild(d);var close=function(){if(!d.parentNode)return;d.remove();document.removeEventListener('keydown',k);if(o.onClose)o.onClose();};
  var k=function(e){if(e.key==='Escape')close();};document.addEventListener('keydown',k);
  d.addEventListener('click',function(e){if(e.target===d&&!o.sticky)close();});$('.x',d).onclick=close;
  $$('[data-close]',d).forEach(function(b){b.onclick=close;});d.close=close;var f=$('input,select,textarea',d);if(f&&!o.nofocus)setTimeout(function(){try{f.focus();}catch(e){}},60);return d;};
W.ask=function(msg,yes,o){o=o||{};var d=W.dlg('<h2>'+esc(o.title||'تأكيد')+'</h2><p>'+msg+'</p><div class="row" style="justify-content:flex-end;margin-top:14px"><button class="btn ghost" data-close>إلغاء</button><button class="btn '+(o.danger?'pri':'grn')+'" data-yes>'+esc(o.ok||'نعم')+'</button></div>');
  $('[data-yes]',d).onclick=function(){d.close();yes();};};

/* ---------- الصوت: نقرات هادئة غير موسيقية ---------- */
var AC=null;
W.snd=function(kind){if(W.lsg('mute',false))return;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();var t=AC.currentTime,len=kind==='end'?.35:(kind==='ok'?.16:.05);
  var b=AC.createBuffer(1,Math.floor(AC.sampleRate*len),AC.sampleRate),d=b.getChannelData(0);for(var i=0;i<d.length;i++){var e=Math.pow(1-i/d.length,kind==='tick'?6:3);d[i]=(Math.random()*2-1)*e;}
  var s=AC.createBufferSource();s.buffer=b;var f=AC.createBiquadFilter();f.type='bandpass';f.frequency.value=kind==='tick'?2400:(kind==='ok'?1400:(kind==='end'?500:900));f.Q.value=kind==='end'?.6:1.2;
  var g=AC.createGain();g.gain.value=kind==='end'?.5:.35;s.connect(f);f.connect(g);g.connect(AC.destination);s.start(t);}catch(e){}};

/* ---------- احتفال: قصاصات بألوان العلم والذهب ---------- */
W.confetti=function(ms){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;var c=document.createElement('canvas');c.className='confetti';document.body.appendChild(c);var x=c.getContext('2d'),Wd=c.width=innerWidth,H=c.height=innerHeight,cols=['#C0262D','#FFFFFF','#1D7A40','#E2C578','#B88A2E'],ps=[];
  for(var i=0;i<160;i++)ps.push({x:Math.random()*Wd,y:-20-Math.random()*H*.6,vx:(Math.random()-.5)*2,vy:2+Math.random()*3,r:Math.random()*6.28,vr:(Math.random()-.5)*.2,w:6+Math.random()*6,h:8+Math.random()*8,c:cols[i%cols.length]});
  var t0=performance.now();(function f(t){x.clearRect(0,0,Wd,H);ps.forEach(function(p){p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;x.save();x.translate(p.x,p.y);x.rotate(p.r);x.fillStyle=p.c;x.strokeStyle='rgba(0,0,0,.08)';x.fillRect(-p.w/2,-p.h/2,p.w,p.h);x.strokeRect(-p.w/2,-p.h/2,p.w,p.h);x.restore();});
    if(t-t0<(ms||4200))requestAnimationFrame(f);else c.remove();})(t0);};

/* ---------- الثيمات ---------- */
W.SKINS=[['raqq','رَقّ الوطن','كريمي وذهبي بألوان العلم، مثل الملصق'],['layl','لَيْلُ القِلاع','أخضر ليلي بنجوم ذهبية'],['annabi','عُنّابي','أحمر عميق بلمعة ذهبية']];
W.skin=function(){var k=W.lsg('skin','raqq');return W.SKINS.some(function(s){return s[0]===k;})?k:'raqq';};
W.applySkin=function(k){k=k||W.skin();document.documentElement.setAttribute('data-skin',k);var m=$('meta[name=theme-color]');if(m)m.content=k==='raqq'?'#F4EBD8':(k==='layl'?'#0F2A20':'#3A1216');SKY.start(k);};
W.skinPicker=function(){var d=W.dlg('<h2>الألوان</h2><p class="muted">ثلاثة ثيمات من ألوان ملصق المسابقة.</p><div class="grid" style="gap:10px">'+W.SKINS.map(function(s){return '<button class="btn" style="justify-content:flex-start;min-height:60px" data-k="'+s[0]+'"><span class="badge '+(s[0]==='raqq'?'o':(s[0]==='layl'?'g':''))+'" style="width:38px;height:38px;border-radius:12px;font-size:14px">'+(W.skin()===s[0]?'✓':'')+'</span><span style="text-align:start"><b>'+s[1]+'</b><br><small class="muted">'+s[2]+'</small></span></button>';}).join('')+'</div>');
  $$('[data-k]',d).forEach(function(b){b.onclick=function(){W.lss('skin',b.dataset.k);W.applySkin(b.dataset.k);d.close();};});};

/* ---------- الخلفية: نخلات ضوئية ونجوم في الثيمين الداكنين ---------- */
var REDUCED=W.REDUCED=matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
W.fxHTML=function(){return '<div class="fx" aria-hidden="true"><div class="glow g1"></div><div class="glow g2"></div><div class="pat"></div>'+
  '<svg class="flagband" viewBox="0 0 1440 120" preserveAspectRatio="none"><g><path class="fw" d="M-20 30 C 240 0, 420 70, 720 34 S 1200 6, 1460 40"/><path class="fr" d="M-20 42 C 240 12, 420 82, 720 46 S 1200 18, 1460 52"/><path class="fg" d="M-20 54 C 240 24, 420 94, 720 58 S 1200 30, 1460 64"/></g></svg></div>';};
var SKY=(function(){var cv,x,Wd,H,D,st=[],gp=[],raf=0,last=0,rot=0,kind='';
 function rnd(a,b){return a+Math.random()*(b-a);}
 function size(){D=Math.min(1.5,devicePixelRatio||1);Wd=innerWidth;H=innerHeight;cv.width=Wd*D;cv.height=H*D;cv.style.width=Wd+'px';cv.style.height=H+'px';x.setTransform(D,0,0,D,0,0);seed();}
 function seed(){var n=kind==='raqq'?0:Math.round(Wd*H/6000);st=[];for(var i=0;i<n;i++)st.push({x:Math.random()*Wd,y:Math.random()*H,r:rnd(.3,1.2),p:Math.random()*6.28,s:rnd(.4,1.3),g:Math.random()<.35});
  gp=[];var m=kind==='raqq'?0:(Wd<700?700:1400);for(i=0;i<m;i++){var d=Math.pow(Math.random(),.65);gp.push({arm:i%3,d:d,off:rnd(-.32,.32)*(1-d*.45),sz:rnd(.45,1.5)*(1.15-d*.55),h:Math.random()});}}
 function frame(t){var dt=Math.min(.05,(t-last)/1000||0);last=t;rot+=dt*.02;x.clearRect(0,0,Wd,H);if(kind==='raqq')return;
  for(var i=0;i<st.length;i++){var s=st[i];x.globalAlpha=(.3+.7*(.5+.5*Math.sin(t/1000*s.s+s.p)))*.8;x.fillStyle=s.g?'rgb(243,223,159)':'rgb(255,250,236)';x.beginPath();x.arc(s.x,s.y,s.r,0,6.283);x.fill();}
  var X=Wd<900?Wd*.5:Wd*.12,Y=Wd<900?H*.7:H*.82,r=Math.min(Wd,H)*(Wd<700?.42:.34);
  var g=x.createRadialGradient(X,Y,0,X,Y,r*.55);g.addColorStop(0,'rgba(243,223,159,.26)');g.addColorStop(1,'rgba(226,197,120,0)');x.globalAlpha=1;x.fillStyle=g;x.beginPath();x.arc(X,Y,r*.55,0,6.283);x.fill();
  for(i=0;i<gp.length;i++){var p=gp[i],a=p.arm*2.094+p.d*5.2+p.off+rot,rr=p.d*r,px=X+Math.cos(a)*rr,py=Y+Math.sin(a)*rr*.42;
   x.globalAlpha=Math.min(1,.22+(1-p.d)*.55);x.fillStyle=p.h<.62?'rgb(226,197,120)':(p.h<.9?'rgb(255,250,236)':(kind==='annabi'?'rgb(240,138,141)':'rgb(158,221,180)'));x.fillRect(px,py,p.sz,p.sz);}
  x.globalAlpha=1;}
 function loop(t){raf=requestAnimationFrame(loop);if(document.hidden)return;frame(t);}
 return {start:function(k){kind=k;var fx=$('.fx');if(!fx)return;if(!cv){cv=document.createElement('canvas');fx.insertBefore(cv,fx.firstChild);x=cv.getContext('2d');addEventListener('resize',function(){if(cv)size();});}
   size();cancelAnimationFrame(raf);if(k==='raqq'){x.clearRect(0,0,Wd,H);return;}if(REDUCED)frame(0);else raf=requestAnimationFrame(loop);}};})();

/* ---------- الظهور التدريجي ---------- */
W.animIn=function(m){if(REDUCED)return;$$('.view>*',m).forEach(function(k,i){if(i<12){k.classList.add('rise');k.style.setProperty('--i',i);}});
 $$('.hero h1, .sec-head .h1',m).forEach(function(h){if(h.querySelector('.wd'))return;var wi=0;(function walk(n){Array.prototype.slice.call(n.childNodes).forEach(function(c){if(c.nodeType===3){var f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(function(t){if(!t)return;if(/^\s+$/.test(t)){f.appendChild(document.createTextNode(t));return;}var sp=document.createElement('span');sp.className='wd';sp.style.setProperty('--w',wi++);sp.textContent=t;f.appendChild(sp);});c.parentNode.replaceChild(f,c);}else if(c.nodeType===1)walk(c);});})(h);});};

/* ---------- الترحيب ---------- */
W.greet=function(){return new Date().getHours()<12?'صَبَاحُ الْخَيْرِ':'مَسَاءُ الْخَيْرِ';};
W.splash=function(done){if(REDUCED){done();return;}try{if(sessionStorage.getItem('watani:splash')){done();return;}sessionStorage.setItem('watani:splash','1');}catch(e){}
 var d=document.createElement('div');d.className='splash';d.setAttribute('role','presentation');
 d.innerHTML='<div class="in"><img src="img/emblem.webp" alt=""><div class="g">'+W.greet()+'، أَهْلًا بِكُنَّ</div><div class="t">تَحَدِّي هٰذَا وَطَنِي</div><div class="s">مَعًا .. نَعْرِفُ وَطَنَنَا وَنَعْتَزُّ بِهِ</div><div class="sc">مدرسة نسيبة بنت كعب (١١–١٢)</div></div>'+W.wallSVG();
 document.body.appendChild(d);document.body.classList.add('splashing');var fin=false,end=function(){if(fin)return;fin=true;d.classList.add('out');document.body.classList.remove('splashing');done();setTimeout(function(){d.remove();},800);};d.onclick=end;setTimeout(end,3000);};

/* ---------- التثبيت ---------- */
var deferred=null;
W.installed=function(){return (matchMedia&&matchMedia('(display-mode: standalone)').matches)||navigator.standalone===true;};
addEventListener('beforeinstallprompt',function(e){e.preventDefault();deferred=e;document.documentElement.classList.add('can-install');});
addEventListener('appinstalled',function(){deferred=null;document.documentElement.classList.add('is-installed');W.toast('ثُبِّت «تحدّي هذا وطني» على جهازك ✓');});
W.install=function(){if(W.installed()){W.toast('«تحدّي هذا وطني» مثبّت على جهازك ✓');return;}
 if(deferred){deferred.prompt();deferred.userChoice.then(function(){deferred=null;});return;}
 var ios=/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
 W.dlg('<h2>تثبيت «تحدّي هذا وطني» على جهازك</h2><p class="muted">تظهر أيقونة «تحدّي هذا وطني» مع تطبيقاتك وتفتح بلمسة.</p>'+(ios?
  '<ol class="steps"><li>افتحي الرابط في متصفح <b>Safari</b>.</li><li>اضغطي زر المشاركة <b>⬆︎</b> أسفل الشاشة (أو أعلاها في الآيباد).</li><li>اختاري <b>«إضافة إلى الشاشة الرئيسية»</b>.</li><li>اضغطي <b>«إضافة»</b>.</li></ol>':
  '<ol class="steps"><li>افتحي قائمة المتصفح <b>⋮</b> أعلى الشاشة.</li><li>اختاري <b>«تثبيت التطبيق»</b> أو <b>«إضافة إلى الشاشة الرئيسية»</b>.</li><li>وافقي، وستظهر أيقونة «تحدّي هذا وطني» مع تطبيقاتك.</li></ol><p class="muted">في الآيفون والآيباد: افتحيها في Safari ثم زر المشاركة ⬆︎ ثم «إضافة إلى الشاشة الرئيسية».</p>')+
  '<div class="row" style="justify-content:flex-end"><button class="btn grn" data-close>حسنًا</button></div>');};
if(W.installed())document.documentElement.classList.add('is-installed');

/* ---------- ملء الشاشة للعرض ---------- */
W.full=function(){var el=document.documentElement;if(!document.fullscreenElement&&!document.webkitFullscreenElement){(el.requestFullscreen||el.webkitRequestFullscreen||function(){}).call(el);}else{(document.exitFullscreen||document.webkitExitFullscreen||function(){}).call(document);}};

/* ---------- ضغط الصور ---------- */
W.shrink=function(file,max,q){return new Promise(function(res,rej){var r=new FileReader();r.onerror=rej;r.onload=function(){var im=new Image();im.onerror=rej;im.onload=function(){var s=Math.min(1,max/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);c.getContext('2d').drawImage(im,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',q||.8));};im.src=r.result;};r.readAsDataURL(file);});};
W.pickImage=function(cb,max,q){var i=document.createElement('input');i.type='file';i.accept='image/*';i.onchange=function(){var f=i.files&&i.files[0];if(!f)return;W.shrink(f,max||1400,q).then(cb).catch(function(){W.toast('تعذّر قراءة الصورة');});};i.click();};

W.download=function(name,text,type){var b=new Blob([text],{type:type||'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove();},500);};
W.csv=function(rows){return '﻿'+rows.map(function(r){return r.map(function(c){c=String(c==null?'':c);return /[",\n]/.test(c)?'"'+c.replace(/"/g,'""')+'"':c;}).join(',');}).join('\n');};

/* ---------- الموجّه ---------- */
W.routes={};
W.go=function(h){if(location.hash===h)W.route();else location.hash=h;};
W.route=function(){var h=(location.hash||'#/').slice(1)||'/',parts=h.split('/').filter(Boolean),k=parts[0]||'';
  if(W.cleanup){try{W.cleanup();}catch(e){}W.cleanup=null;}
  document.body.classList.remove('nav-open','stage-mode');
  var fn=W.routes[k]||W.routes[''];fn(parts.slice(1));};
addEventListener('hashchange',W.route);
})();
