/* =====================================================================
   «نجم الأسبوع»: منصة التحدي الأسبوعي
   الواجهة الأولى بمدخلين: الطالبات (الاسم الرباعي ← سؤال الأسبوع ← التقييم الفوري ← بطاقة الشكر)
   والمعلمة (كلمة سر ← المتابعة الحية، الأسئلة، لوحة الشرف، الإعدادات).
   البيانات في store.js (Firebase أو هذا الجهاز). الطابع جغرافي هادئ على أساس «مدار».
   ===================================================================== */
(function(){
'use strict';
var DB=window.NAJM_DB;
var $=function(s,r){return (r||document).querySelector(s);};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));};
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
var REDUCED=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var NAMES=['نجم الأسبوع','منصة الإنجاز الذكي','بصمة مبدعة','وسام التفوق الأسبوعي','تحدي الذكاء الأسبوعي'];
var DEF={title:'نجم الأسبوع',school:'',teacher:'',subject:'الجغرافيا',grade:'',logo:'',classes:[],classSize:0,cardMsg:'',active:''};
var G={cfg:clone(DEF),unsub:null};
function clone(o){return JSON.parse(JSON.stringify(o));}

/* ---------- الأيقونات ---------- */
var P={
 student:'<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/>',
 teacher:'<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M7 20h10M12 16v4"/><path d="m8 11 2.5-2.5L13 11l3-3"/>',
 arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
 check:'<path d="m5 12.5 4.5 4.5L19 7.5"/>',x:'<path d="M6 6l12 12M18 6 6 18"/>',
 star:'<path d="m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z"/>',
 globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"/>',
 pin:'<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
 list:'<path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/>',
 q:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.6 2.6 0 0 1 5 .9c0 1.7-2.5 2.1-2.5 3.6M12 17h.01"/>',
 trophy:'<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
 gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
 trash:'<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
 play:'<path d="M7 5v14l11-7z"/>',pause:'<path d="M8 5v14M16 5v14"/>',
 down:'<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',share:'<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4"/>',
 print:'<path d="M7 9V3h10v6M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"/><rect x="7" y="14" width="10" height="7"/>',
 sheet:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M4 9h16M4 15h16M10 3v18"/>',
 dice:'<rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="9" r="1.2"/><circle cx="15" cy="15" r="1.2"/><circle cx="15" cy="9" r="1.2"/><circle cx="9" cy="15" r="1.2"/>',
 out:'<path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10"/>',install:'<path d="M12 3v12M7 10l5 5 5-5"/><rect x="4" y="17" width="16" height="4" rx="1.5"/>',
 palette:'<path d="M12 3a9 9 0 1 0 0 18c1.2 0 1.6-.9 1.2-1.8-.5-1.1.2-2.2 1.4-2.2H17a4 4 0 0 0 4-4c0-5.5-4-10-9-10z"/><circle cx="7.5" cy="11" r="1.2"/><circle cx="10.5" cy="7" r="1.2"/><circle cx="15" cy="7.5" r="1.2"/>',
 note:'<path d="M5 4h14v12l-4 4H5z"/><path d="M15 20v-4h4M9 9h6M9 13h4"/>',bulb:'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
 users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14a5 5 0 0 1 5.5 5"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
 img:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/>',lock:'<rect x="4" y="10" width="16" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
 home:'<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/>'
};
function I(n){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(P[n]||'')+'</svg>';}

/* ---------- البوصلة (توقيع المنصة) ---------- */
function compassSVG(cls){var tk='';for(var i=0;i<72;i++){var a=i*5*Math.PI/180,r1=i%18===0?44:(i%2?49:47),r2=52;tk+='<line class="tk" x1="'+(60+Math.sin(a)*r1).toFixed(1)+'" y1="'+(60-Math.cos(a)*r1).toFixed(1)+'" x2="'+(60+Math.sin(a)*r2).toFixed(1)+'" y2="'+(60-Math.cos(a)*r2).toFixed(1)+'"/>';}
 return '<svg class="compass '+(cls||'')+'" viewBox="0 0 120 120" aria-hidden="true"><g class="slow"><circle class="ring" cx="60" cy="60" r="56"/><circle class="ring" cx="60" cy="60" r="52"/>'+tk+'</g>'+
  '<text class="ltr" x="60" y="34">ش</text><text class="ltr" x="60" y="96">ج</text><text class="ltr" x="91" y="64">ق</text><text class="ltr" x="29" y="64">غ</text>'+
  '<g class="ndl"><path class="pt" d="M60 60 L67 53 L60 14 L53 53Z" transform="rotate(45 60 60)" opacity=".5"/><path class="pt" d="M60 60 L67 53 L60 14 L53 53Z" transform="rotate(135 60 60)" opacity=".5"/><path class="pt" d="M60 60 L67 53 L60 14 L53 53Z" transform="rotate(225 60 60)" opacity=".5"/><path class="pt" d="M60 60 L67 53 L60 14 L53 53Z" transform="rotate(315 60 60)" opacity=".5"/>'+
  '<path class="pt n" d="M60 60 L66 60 L60 22 L54 60Z"/><path class="pt" d="M60 60 L66 60 L60 98 L54 60Z"/><circle class="ring" cx="60" cy="60" r="4" style="fill:#D9B36A"/></g></svg>';}
function ridgeSVG(){var d='M0 60',d2='M0 66',x;for(x=0;x<=1200;x+=40){d+=' L'+x+' '+(42+Math.sin(x/90)*12+Math.sin(x/33)*6).toFixed(1);d2+=' L'+x+' '+(54+Math.sin(x/120+1)*8+Math.sin(x/41)*4).toFixed(1);}
 return '<svg class="ridge" viewBox="0 0 1200 70" preserveAspectRatio="none" aria-hidden="true"><path d="'+d+'"/><path d="'+d2+'"/></svg>';}
function gratSVG(){var p='';for(var i=-4;i<=4;i++){p+='<path d="M'+(600+i*90)+' -20 Q '+(600+i*130)+' 160 '+(600+i*90)+' 340"/>';}for(var j=1;j<6;j++)p+='<path d="M0 '+(j*56)+' Q 600 '+(j*56-30)+' 1200 '+(j*56)+'"/>';
 return '<svg class="grat" viewBox="0 0 1200 320" preserveAspectRatio="xMidYMid slice" aria-hidden="true">'+p+'</svg>';}

/* ---------- الخلفية: خطوط كنتورية وكرة أرضية تدور ---------- */
function fxInit(){var fx=document.createElement('div');fx.className='fx';fx.setAttribute('aria-hidden','true');
 var W=1440,H=900,p='',seed=11;function rnd(){seed=(seed*9301+49297)%233280;return seed/233280;}
 var C=[[220,260,9],[1180,640,8],[760,120,5],[420,800,6]];
 C.forEach(function(c){var ph=rnd()*6;for(var k=1;k<=c[2];k++){var r=k*34,d='';for(var a=0;a<=64;a++){var t=a/64*Math.PI*2,rr=r*(1+.18*Math.sin(3*t+ph+k*.3)+.09*Math.sin(5*t-ph)+.05*Math.sin(7*t+k));
   d+=(a?'L':'M')+(c[0]+Math.cos(t)*rr*1.25).toFixed(1)+' '+(c[1]+Math.sin(t)*rr).toFixed(1);}p+='<path'+(k%4===0?' class="mj"':'')+' d="'+d+'Z"/>';}});
 var g='';for(var i=0;i<=8;i++)g+='<path class="gr" d="M'+(i*180)+' 0 Q '+(i*180+(i-4)*30)+' 450 '+(i*180)+' 900"/>';for(i=1;i<6;i++)g+='<path class="gr" d="M0 '+(i*150)+' Q 720 '+(i*150-40)+' 1440 '+(i*150)+'"/>';
 fx.innerHTML='<div class="orb o1"></div><div class="orb o2"></div><svg class="topo" viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="xMidYMid slice">'+g+p+'</svg>';
 document.body.insertBefore(fx,document.body.firstChild);GLOBE.start(fx);}
var GLOBE=(function(){var cv,x,W,H,D,raf=0,rot=0,last=0,land=[],cities=[],route=null,nextR=0,fr=0;
 function noise(la,lo){return Math.sin(la*2.1+1.3)*Math.cos(lo*1.7)+Math.sin(lo*3.3+la*1.1)*.6+Math.cos(la*4.7-lo*2.3)*.35;}
 function seed(){land=[];for(var la=-80;la<=80;la+=4.5)for(var lo=0;lo<360;lo+=4.5){var r=la*Math.PI/180,o=lo*Math.PI/180;if(noise(r,o)>.55)land.push([r,o]);}
  cities=[];for(var i=0;i<26;i++){var c=land[Math.floor(Math.random()*land.length)];if(c)cities.push({la:c[0],lo:c[1],p:Math.random()*6});}}
 function size(){D=Math.min(1.5,window.devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=W*D;cv.height=H*D;x.setTransform(D,0,0,D,0,0);}
 function geo(){var m=W<900;return {X:m?W*.5:W*.13,Y:m?H*.9:H*.78,R:Math.min(W,H)*(m?.34:.3)};}
 var TL=-.38;
 function pr(la,lo,g){var cx=Math.cos(la)*Math.sin(lo+rot),cy=-Math.sin(la),cz=Math.cos(la)*Math.cos(lo+rot);var y=cy*Math.cos(TL)-cz*Math.sin(TL),z=cy*Math.sin(TL)+cz*Math.cos(TL);return [g.X+cx*g.R,g.Y+y*g.R,z];}
 function frame(t){var dt=Math.min(.06,(t-last)/1000||0);last=t;rot+=dt*.05;x.clearRect(0,0,W,H);
  var light=document.documentElement.getAttribute('data-skin')==='raqq',gold=light?'168,116,46':'217,179,106',line=light?'47,111,126':'150,200,210',g=geo(),i,j,p,q;
  var hl=x.createRadialGradient(g.X,g.Y,g.R*.2,g.X,g.Y,g.R*1.35);hl.addColorStop(0,'rgba('+line+','+(light?.06:.08)+')');hl.addColorStop(.7,'rgba('+gold+',.04)');hl.addColorStop(1,'rgba('+gold+',0)');x.fillStyle=hl;x.beginPath();x.arc(g.X,g.Y,g.R*1.35,0,6.283);x.fill();
  x.lineWidth=1;x.strokeStyle='rgba('+gold+','+(light?.3:.28)+')';x.beginPath();x.arc(g.X,g.Y,g.R,0,6.283);x.stroke();
  for(var lo=0;lo<180;lo+=20){var L=lo*Math.PI/180;for(var s=0;s<2;s++){x.beginPath();var st=false;for(j=-90;j<=90;j+=5){p=pr(j*Math.PI/180,L+s*Math.PI,g);if(p[2]>0){if(!st){x.moveTo(p[0],p[1]);st=true;}else x.lineTo(p[0],p[1]);}else st=false;}
    x.strokeStyle='rgba('+line+','+(light?.16:.14)+')';x.stroke();}}
  for(var la=-60;la<=60;la+=30){x.beginPath();var s2=false;for(j=0;j<=360;j+=5){p=pr(la*Math.PI/180,j*Math.PI/180,g);if(p[2]>0){if(!s2){x.moveTo(p[0],p[1]);s2=true;}else x.lineTo(p[0],p[1]);}else s2=false;}x.strokeStyle='rgba('+line+','+(la===0?(light?.3:.26):(light?.14:.12))+')';x.stroke();}
  x.fillStyle='rgb('+gold+')';for(i=0;i<land.length;i++){p=pr(land[i][0],land[i][1],g);if(p[2]>.05){x.globalAlpha=(light?.35:.32)*p[2];x.fillRect(p[0]-.9,p[1]-.9,1.8,1.8);}}
  for(i=0;i<cities.length;i++){var c=cities[i];p=pr(c.la,c.lo,g);if(p[2]>.1){x.globalAlpha=(.4+.5*(.5+.5*Math.sin(t/900+c.p)))*p[2];x.beginPath();x.arc(p[0],p[1],1.9,0,6.283);x.fill();}}
  x.globalAlpha=1;
  if(!route&&t>nextR&&cities.length>3){var a=cities[Math.floor(Math.random()*cities.length)],b=cities[Math.floor(Math.random()*cities.length)];if(a!==b)route={a:a,b:b,k:0};nextR=t+9000+Math.random()*7000;}
  if(route){route.k+=dt*.45;var n=24,m=Math.min(1,route.k),fade=route.k>1.4?Math.max(0,1-(route.k-1.4)*1.5):1;x.beginPath();var on=false;
   for(i=0;i<=n*m;i++){var f=i/n,la2=route.a.la+(route.b.la-route.a.la)*f,lo2=route.a.lo+(route.b.lo-route.a.lo)*f;p=pr(la2,lo2,g);var lift=1+Math.sin(f*Math.PI)*.12;var px=g.X+(p[0]-g.X)*lift,py=g.Y+(p[1]-g.Y)*lift;if(p[2]>0){if(!on){x.moveTo(px,py);on=true;}else x.lineTo(px,py);}}
   x.setLineDash([3,4]);x.strokeStyle='rgba('+gold+','+(.75*fade)+')';x.lineWidth=1.3;x.stroke();x.setLineDash([]);if(fade<=0)route=null;}
 }
 function loop(t){raf=requestAnimationFrame(loop);if(document.hidden)return;if((fr++)%2)return;frame(t);}
 return {start:function(fx){cv=document.createElement('canvas');fx.appendChild(cv);x=cv.getContext('2d');if(!x)return;seed();size();addEventListener('resize',size);nextR=performance.now()+5000;if(REDUCED)frame(0);else raf=requestAnimationFrame(loop);},
  redraw:function(){if(REDUCED&&x)frame(0);}};})();

/* ---------- الثيمات ---------- */
var SKINS=[['atlas','أطلس','بحر عميق بخطوط كنتورية ذهبية'],['umq','عُمق المحيط','أعمق عتمة بتوهّج فيروزي'],['raqq','رقّ الخرائط','فاتح بلون الخرائط القديمة']];
function curSkin(){var k;try{k=localStorage.getItem('najm:skin');}catch(e){}return SKINS.some(function(s){return s[0]===k;})?k:'atlas';}
function applySkin(k){document.documentElement.setAttribute('data-skin',k);var m=$('meta[name=theme-color]');if(m)m.content=k==='raqq'?'#123A4E':'#082230';GLOBE.redraw();}
function setSkin(k){try{localStorage.setItem('najm:skin',k);}catch(e){}applySkin(k);$$('.skin').forEach(function(b){b.classList.toggle('on',b.dataset.k===k);});}

/* ---------- أدوات ---------- */
var tt=0;function toast(m){var t=$('.toast');if(!t){t=document.createElement('div');t.className='toast';t.setAttribute('role','status');document.body.appendChild(t);}t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(function(){t.classList.remove('on');},2600);}
function dlg(title,body,foot,opt){opt=opt||{};var d=document.createElement('dialog');d.className='dlg';
 d.innerHTML='<div class="dh"><b>'+esc(title)+'</b><button type="button" class="x" data-close aria-label="إغلاق">'+I('x')+'</button></div><div class="db">'+body+'</div>'+(foot===false?'':'<div class="df">'+(foot||'')+'<button type="button" class="btn ghost" data-close>'+(opt.closeText||'إلغاء')+'</button></div>');
 document.body.appendChild(d);
 /* أزرار الإغلاق تعمل دائمًا، حتى مع حقول مطلوبة فارغة */
 d.addEventListener('click',function(e){if(e.target.closest('[data-close]')){e.preventDefault();close();}else if(e.target===d){var r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close();}});
 d.addEventListener('cancel',function(e){e.preventDefault();close();});
 function close(){if(!d.isConnected)return;try{d.close();}catch(e){}d.remove();if(opt.onclose)opt.onclose();}
 if(d.showModal)d.showModal();else d.setAttribute('open','');d.closeDlg=close;return d;}
function norm(s){return String(s||'').replace(/[ً-ْٰـ]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي').replace(/ؤ/g,'و').replace(/ئ/g,'ي').replace(/[^؀-ۿa-z0-9\s]/gi,' ').replace(/\s+/g,' ').trim().toLowerCase();}
function words(s){return norm(s).split(' ').filter(function(w){return w.length>=2;});}
function cleanName(s){return String(s||'').replace(/\s+/g,' ').trim();}
function tm(ms){if(!ms)return '';var d=new Date(ms);return d.toLocaleTimeString('ar-OM',{hour:'numeric',minute:'2-digit'});}
function dt(ms){if(!ms)return '';var d=new Date(ms);return d.toLocaleDateString('ar-OM',{weekday:'long',day:'numeric',month:'long'});}
function hijri(d){try{return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(d);}catch(e){return '';}}
function greet(){var h=new Date().getHours();return h<12?'صباح الخير':'مساء الخير';}
function initials(n){var w=cleanName(n).split(' ');return (w[0]||'').charAt(0);}
function letter(i){return 'أبجدهوزحطي'.charAt(i)||String(i+1);}
function fileToImg(file,max,type,q){return new Promise(function(res,rej){var r=new FileReader();r.onerror=rej;r.onload=function(){var im=new Image();im.onload=function(){var s=Math.min(1,max/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);
  var cx=c.getContext('2d');if(type==='image/jpeg'){cx.fillStyle='#fff';cx.fillRect(0,0,c.width,c.height);}cx.drawImage(im,0,0,c.width,c.height);res(c.toDataURL(type,q));};im.onerror=function(){rej(new Error('img'));};im.src=r.result;};r.readAsDataURL(file);});}
function grade(q,key,sub,fbk){var r;key=key||{};
 if(q.type==='mcq'){var ok=+sub.choice===+key.correct;r={kind:'mcq',ok:ok,score:ok?100:0,level:ok?'good':'bad',label:ok?'إجابة صحيحة، أحسنتِ!':'إجابة غير صحيحة هذه المرة'};}
 else{var kws=(key.keywords||[]).filter(Boolean);
  if(!kws.length)r={kind:'essay',score:null,level:'mid',label:'تم استلام إجابتك بنجاح',hits:[],kws:[]};
  else{var a=norm(sub.answer),hits=kws.filter(function(k){return a.indexOf(norm(k))>=0;}),sc=Math.round(hits.length/kws.length*100);
   r={kind:'essay',score:sc,level:sc>=70?'good':(sc>=40?'mid':'bad'),label:sc>=70?'إجابة متميزة!':(sc>=40?'إجابة جيدة، وتقتربين من الكمال':'إجابتك تحتاج إلى مراجعة'),hits:hits,kws:kws};}}
 if(fbk&&fbk.mark){r.mark=fbk.mark;r.level=MARKS[fbk.mark]||r.level;}
 r.good=r.level==='good';return r;}
var MARKS={'ممتاز':'good','جيد جدًا':'good','جيد':'mid','يحتاج دعمًا':'bad'};

/* ---------- البناء العام ---------- */
function shell(){var app=$('#app');
 app.innerHTML='<header class="top"><a class="brand" href="#/"><span class="lg" data-logo></span><span style="min-width:0"><b data-title></b><small data-school></small></span></a>'+
  '<button class="tbtn inst" data-install hidden>'+I('install')+'<span class="tx">تثبيت</span></button>'+
  '<button class="tbtn" data-skinnext aria-label="تغيير الألوان" title="تغيير الألوان">'+I('palette')+'</button>'+
  '<button class="tbtn" data-logout hidden aria-label="خروج المعلمة" title="خروج المعلمة">'+I('out')+'<span class="tx">خروج</span></button></header>'+
  '<main id="main"></main><div class="foot" data-foot></div>';
 brand();}
function brand(){var c=G.cfg;$('[data-title]').innerHTML='<span>'+esc(c.title||DEF.title)+'</span>';$('[data-school]').textContent=[c.school,c.teacher?('المعلمة '+c.teacher):''].filter(Boolean).join(' · ')||'تحدٍّ أسبوعي ذكي';
 $('[data-logo]').innerHTML=c.logo?'<img src="'+esc(c.logo)+'" alt="">':'<span style="color:#D9B36A">'+I('globe')+'</span>';
 document.title=(c.title||DEF.title)+(c.school?' · '+c.school:'');
 $('[data-foot]').innerHTML='<span class="cloud '+(DB.mode==='cloud'?'on':'loc')+'"><i></i>'+(DB.mode==='cloud'?'متزامنة مع Google Firebase':'محفوظة على هذا الجهاز')+'</span>';
 $('[data-logout]').hidden=!DB.isTeacher();}
function animIn(m){if(REDUCED)return;$$('.view>*',m).forEach(function(k,i){if(i<10){k.classList.add('rise');k.style.setProperty('--i',i);}});
 $$('.hero h1',m).forEach(function(h){var wi=0;(function walk(n){Array.prototype.slice.call(n.childNodes).forEach(function(c){if(c.nodeType===3){var f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(function(t){if(!t)return;if(/^\s+$/.test(t)){f.appendChild(document.createTextNode(t));return;}var sp=document.createElement('span');sp.className='wd';sp.style.setProperty('--w',wi++);sp.textContent=t;f.appendChild(sp);});c.parentNode.replaceChild(f,c);}else if(c.nodeType===1)walk(c);});})(h);});}
function render(html){var m=$('#main');m.innerHTML='<div class="view">'+html+'</div>';animIn(m);window.scrollTo(0,0);return m;}
function splash(){if(REDUCED)return;try{if(sessionStorage.getItem('najm:splash'))return;sessionStorage.setItem('najm:splash','1');}catch(e){}
 var c=G.cfg,d=document.createElement('div');d.className='splash';d.setAttribute('role','presentation');
 d.innerHTML='<div class="sp-in">'+compassSVG()+'<div class="sp-g">'+greet()+'، أهلًا بكِ</div><div class="sp-t">'+esc(c.title||DEF.title)+'</div><div class="sp-s">'+esc(c.school||'تحدٍّ أسبوعي في '+(c.subject||DEF.subject))+'</div></div>';
 document.body.appendChild(d);document.body.classList.add('splashing');var fin=false,done=function(){if(fin)return;fin=true;d.classList.add('out');document.body.classList.remove('splashing');setTimeout(function(){d.remove();},800);};d.onclick=done;setTimeout(done,2600);}

/* ---------- التوجيه ---------- */
function route(){if(G.unsub){try{G.unsub();}catch(e){}G.unsub=null;}
 var h=(location.hash||'').replace(/^#\/?/,'').split('/');brand();
 if(h[0]==='student')return vStudent();
 if(h[0]==='teacher'){if(!DB.isTeacher())return vLogin();return ({'':vFollow,q:vQuestions,honor:vHonor,set:vSettings})[h[1]||'']?({'':vFollow,q:vQuestions,honor:vHonor,set:vSettings})[h[1]||'']():vFollow();}
 vHome();}

/* ===================== الرئيسية ===================== */
function heroHTML(eyebrow,h1,p,chips){return '<section class="card hero has-c">'+gratSVG()+compassSVG()+'<div class="greet">'+esc(eyebrow)+'</div><h1>'+h1+'</h1><p>'+p+'</p>'+(chips?'<div class="chips">'+chips+'</div>':'')+ridgeSVG()+'</section>';}
function vHome(){var c=G.cfg;
 render(heroHTML(greet()+'، أهلًا بكِ','<em>'+esc(c.title||DEF.title)+'</em>','سؤال واحد كل أسبوع في '+esc(c.subject||DEF.subject)+'، تقييم فوري وإجابة نموذجية، وبطاقة شكر تحمل اسمك تحفظينها وتشاركينها مع أسرتك.','<span class="chip" data-wk>'+I('clock')+'جارٍ التحقق من سؤال الأسبوع…</span>'+(c.grade?'<span class="chip">'+I('users')+esc(c.grade)+'</span>':''))+
  '<div class="grid2"><a class="card door" href="#/student"><span class="ic">'+I('student')+'</span><span><b>دخول الطالبات</b><p>اكتبي اسمك الرباعي، وحلّي سؤال الأسبوع، واستلمي بطاقة شكرك فورًا.</p><span class="go">ابدئي التحدي'+I('arrow')+'</span></span></a>'+
  '<a class="card door" href="#/teacher"><span class="ic">'+I('teacher')+'</span><span><b>دخول المعلمة</b><p>لوحة المتابعة: أسماء المنجزات ووقت تسليمهن، الأسئلة، ولوحة الشرف.</p><span class="go">لوحة المتابعة'+I('arrow')+'</span></span></a></div>'+
  '<section class="card"><h2 class="h2">رحلة التحدي في أربع محطات</h2><div class="grid3" style="margin-top:10px">'+
   [['student','الدخول','الاسم الرباعي لإثبات الإنجاز'],['q','سؤال الأسبوع','مقالي أو اختيار من متعدد'],['check','التقييم الفوري','الإجابة النموذجية وملاحظات المعلمة'],['star','التكريم','بطاقة شكر باسمك تُحفظ صورة']].map(function(s,i){return '<div class="stat"><span class="ic'+(i===3?' g':'')+'">'+I(s[0])+'</span><span><b style="font-size:16px">'+(i+1)+'. '+s[1]+'</b><small>'+s[2]+'</small></span></div>';}).join('')+'</div></section>');
 activeQ().then(function(q){var el=$('[data-wk]');if(!el)return;el.innerHTML=q?I('pin')+'سؤال '+esc(q.week||'الأسبوع')+' مفتوح الآن':I('clock')+'لا يوجد سؤال مفتوح الآن';}).catch(function(){var el=$('[data-wk]');if(el)el.innerHTML=I('clock')+'تعذّر الاتصال الآن';});}
function activeQ(){return DB.cfg().then(function(c){mergeCfg(c);if(!G.cfg.active)return null;return DB.question(G.cfg.active).then(function(q){return q&&q.open?q:null;});});}
function mergeCfg(c){var o=clone(DEF);Object.keys(c||{}).forEach(function(k){o[k]=c[k];});G.cfg=o;brand();}

/* ===================== الطالبة ===================== */
var ST={};
function stepsHTML(n){var L=['الاسم','سؤال الأسبوع','التقييم','التكريم'];return '<div class="steps" aria-label="مراحل التحدي">'+L.map(function(l,i){return (i?'<span class="sep"></span>':'')+'<span class="st'+(i===n?' on':'')+(i<n?' ok':'')+'"><i>'+(i<n?'✓':(i+1))+'</i><span>'+l+'</span></span>';}).join('')+'</div>';}
function vStudent(){render('<div class="card empty">'+I('globe')+'جارٍ تحميل سؤال الأسبوع…</div>');
 Promise.all([activeQ(),DB.student()]).then(function(r){var q=r[0];ST={q:q};
  if(!q)return render(stepsHTML(0)+'<section class="card empty">'+I('clock')+'<b style="display:block;font-size:18px;color:var(--ink)">لا يوجد سؤال مفتوح الآن</b>ترقّبي سؤال الأسبوع القادم، وستفتحه معلمتك قريبًا.<div class="row" style="justify-content:center;margin-top:14px"><a class="btn line" href="#/">'+I('home')+'الرئيسية</a></div></section>');
  return DB.mySub(q.id).then(function(s){if(s){ST.sub=s;return showResult();}sName();});
 }).catch(function(e){console.error(e);render('<section class="card empty">'+I('globe')+'تعذّر الاتصال. تأكدي من الإنترنت ثم أعيدي المحاولة.<div class="row" style="justify-content:center;margin-top:14px"><button class="btn" onclick="location.reload()">إعادة المحاولة</button></div></section>');});}
function sName(){var me={};try{me=JSON.parse(localStorage.getItem('najm:me')||'{}');}catch(e){}var c=G.cfg;
 var cls=c.classes&&c.classes.length?'<select class="input" name="cls" required><option value="">اختاري صفك وشعبتك</option>'+c.classes.map(function(k){return '<option'+(me.cls===k?' selected':'')+'>'+esc(k)+'</option>';}).join('')+'</select>':'<input class="input" name="cls" placeholder="مثال: الصف العاشر / 3" value="'+esc(me.cls||'')+'">';
 var m=render(stepsHTML(0)+'<section class="card"><h2 class="h2">مرحبًا بكِ في تحدي '+esc(ST.q.week||'الأسبوع')+'</h2><p class="sub">اكتبي اسمك الرباعي كما في سجل المدرسة، فهو الذي يُكتب على بطاقة شكرك ويظهر لمعلمتك.</p>'+
  '<form data-f style="margin-top:14px" novalidate><label class="field"><span class="lbl">الاسم الرباعي</span><input class="input" name="name" autocomplete="name" placeholder="مثال: مريم سالم علي البلوشية" value="'+esc(me.name||'')+'"><span class="err" data-e hidden></span></label>'+
  '<label class="field"><span class="lbl">الصف والشعبة</span>'+cls+'</label><button class="btn gold block" type="submit">التالي: سؤال الأسبوع'+I('arrow').replace('<svg','<svg style="transform:scaleX(-1)"')+'</button></form></section>');
 $('[data-f]',m).onsubmit=function(e){e.preventDefault();var n=cleanName(this.name.value),w=n.split(' ').filter(function(x){return x.length>=2;}),er=$('[data-e]',m);
  if(w.length<4){er.hidden=false;er.textContent='اكتبي اسمك الرباعي كاملًا (أربعة أسماء على الأقل).';this.name.classList.add('bad');this.name.focus();return;}
  if(this.cls.required&&!this.cls.value){this.cls.classList.add('bad');this.cls.focus();return;}
  ST.name=n;ST.cls=cleanName(this.cls.value);try{localStorage.setItem('najm:me',JSON.stringify({name:n,cls:ST.cls}));}catch(x){}sQuestion();};}
function qHead(q){return '<div class="qmeta"><span class="tag">'+I('pin')+esc(q.week||'سؤال الأسبوع')+'</span><span class="tag sea">'+(q.type==='mcq'?'اختيار من متعدد':'سؤال مقالي')+'</span></div>';}
function sQuestion(){var q=ST.q,choice=-1;
 var body=q.type==='mcq'?'<div class="choices" role="radiogroup">'+(q.choices||[]).map(function(c,i){return '<button type="button" class="choice" role="radio" aria-checked="false" data-i="'+i+'"><span class="l">'+letter(i)+'</span><span>'+esc(c)+'</span></button>';}).join('')+'</div>'
  :'<label class="field"><span class="lbl">إجابتك</span><textarea class="textarea" name="ans" placeholder="اكتبي إجابتك بأسلوبك…" maxlength="5000"></textarea></label>';
 var m=render(stepsHTML(1)+'<section class="card qcard">'+qHead(q)+'<p class="qtext">'+esc(q.text)+'</p>'+(q.img?'<img class="qimg" src="'+esc(q.img)+'" alt="صورة السؤال" data-zoom>':'')+(q.guide?'<div class="guide">'+esc(q.guide)+'</div>':'')+
  '<form data-f novalidate>'+body+'<span class="err" data-e hidden></span><div class="row" style="margin-top:12px"><button class="btn gold" type="submit" style="flex:1">'+I('check')+'تسليم الحل</button><button class="btn ghost" type="button" data-back>تعديل الاسم</button></div>'+
  '<p class="sub" style="margin-top:10px">الطالبة: <b>'+esc(ST.name)+'</b>'+(ST.cls?' · '+esc(ST.cls):'')+'. يُقبل تسليم واحد لكل طالبة.</p></form></section>');
 $$('.choice',m).forEach(function(b){b.onclick=function(){choice=+b.dataset.i;$$('.choice',m).forEach(function(x){var on=x===b;x.classList.toggle('on',on);x.setAttribute('aria-checked',on);});$('[data-e]',m).hidden=true;};});
 $('[data-back]',m).onclick=sName;zoomBind(m);
 $('[data-f]',m).onsubmit=function(e){e.preventDefault();var er=$('[data-e]',m),ans;
  if(q.type==='mcq'){if(choice<0){er.hidden=false;er.textContent='اختاري إجابة واحدة أولًا.';return;}ans=(q.choices||[])[choice]||'';}
  else{ans=(this.ans.value||'').trim();if(ans.length<3){er.hidden=false;er.textContent='اكتبي إجابتك أولًا.';this.ans.classList.add('bad');return;}}
  var bt=$('button[type=submit]',m);bt.disabled=true;bt.innerHTML='جارٍ التسليم…';
  DB.submit(q.id,{name:ST.name,cls:ST.cls,answer:ans,choice:q.type==='mcq'?choice:-1}).then(function(s){ST.sub=s;ST.fresh=true;showResult();}).catch(function(x){
   if(x&&x.message==='dup'){DB.mySub(q.id).then(function(s){ST.sub=s;showResult();});return;}
   bt.disabled=false;bt.innerHTML=I('check')+'تسليم الحل';er.hidden=false;er.textContent=x&&x.message==='closed'?'أُغلق هذا السؤال قبل التسليم. ترقّبي سؤال الأسبوع القادم.':'تعذّر التسليم، تأكدي من الإنترنت ثم حاولي مرة أخرى.';});};}
function zoomBind(m){$$('[data-zoom]',m).forEach(function(im){im.onclick=function(){dlg('صورة السؤال','<img src="'+esc(im.src)+'" alt="" style="width:100%;border-radius:12px">',false);};});}
function showResult(){var q=ST.q,s=ST.sub;render('<div class="card empty">'+I('globe')+'جارٍ التقييم…</div>');
 Promise.all([DB.key(q.id).catch(function(){return {};}),DB.myFb(q.id)]).then(function(r){var key=r[0]||{},fbk=r[1];ST.key=key;ST.fb=fbk;var g=grade(q,key,s,fbk);ST.g=g;
  var ch='';if(q.type==='mcq')ch='<div class="choices">'+(q.choices||[]).map(function(c,i){var cl=i===+key.correct?' right':(i===+s.choice?' wrong':'');return '<button type="button" class="choice'+cl+'" disabled><span class="l">'+(i===+key.correct?'✓':letter(i))+'</span><span>'+esc(c)+(i===+s.choice?' <small style="color:var(--muted)">(إجابتك)</small>':'')+'</span></button>';}).join('')+'</div>';
  var mk={good:'check',mid:'star',bad:'bulb'}[g.level];
  var m=render(stepsHTML(2)+'<section class="card"><div class="verdict '+g.level+'"><span class="mk">'+I(mk)+'</span><span><b>'+esc(g.mark?('تقدير المعلمة: '+g.mark):g.label)+'</b><p>'+(g.score!=null&&q.type!=='mcq'&&!g.mark?'نسبة اكتمال الإجابة '+g.score+'٪':'سُجّل إنجازك في '+dt(s.at)+' الساعة '+tm(s.at))+'</p></span></div>'+
   (g.score!=null&&q.type!=='mcq'&&!g.mark?'<div class="meter"><i data-w="'+g.score+'"></i></div>':'')+'</section>'+
   '<section class="card qcard">'+qHead(q)+'<p class="qtext">'+esc(q.text)+'</p>'+(q.img?'<img class="qimg" src="'+esc(q.img)+'" alt="" data-zoom>':'')+ch+
   (q.type!=='mcq'?'<div class="box"><h4>'+I('edit')+'إجابتك</h4><p>'+esc(s.answer)+'</p></div>':'')+
   (key.model?'<div class="box"><h4>'+I('check')+(q.type==='mcq'?'التفسير والإجابة النموذجية':'الإجابة النموذجية')+'</h4><p>'+esc(key.model)+'</p>'+(g.kws&&g.kws.length?'<div class="kw">'+g.kws.map(function(k){return '<span class="'+(g.hits.indexOf(k)>=0?'hit':'')+'">'+esc(k)+'</span>';}).join('')+'</div>':'')+'</div>':'')+
   (!key.model&&g.kws&&g.kws.length?'<div class="box"><h4>'+I('check')+'عناصر الإجابة المتوقعة</h4><div class="kw">'+g.kws.map(function(k){return '<span class="'+(g.hits.indexOf(k)>=0?'hit':'')+'">'+esc(k)+'</span>';}).join('')+'</div></div>':'')+
   (key.note?'<div class="box note"><h4>'+I('note')+'ملاحظات المعلمة وإرشاداتها</h4><p>'+esc(key.note)+'</p></div>':'')+
   (fbk&&fbk.note?'<div class="box note"><h4>'+I('star')+'رسالة معلمتك لكِ</h4><p>'+esc(fbk.note)+'</p></div>':'')+'</section>'+
   '<section class="card thanks"><h2 class="h2">بطاقة شكرك جاهزة</h2><p class="sub">بطاقة تقدير تحمل اسمك، احفظيها صورة وشاركيها مع ولي أمرك أو في ملف إنجازك.</p><div class="row" style="margin-top:12px"><button class="btn gold" data-card>'+I('star')+'استلمي بطاقة الشكر</button></div></section>');
  zoomBind(m);setTimeout(function(){$$('.meter i',m).forEach(function(i){i.style.width=i.dataset.w+'%';});},120);
  $('[data-card]',m).onclick=showCard;if(ST.fresh&&!REDUCED){ST.fresh=false;pinFx();}
 });}
function pinFx(){var d=document.createElement('div');d.className='pinfx';d.innerHTML='<svg viewBox="0 0 24 24" fill="#D9B36A" stroke="#0B2230" stroke-width="1"><path d="M12 22s-7-6.4-7-12a7 7 0 0 1 14 0c0 5.6-7 12-7 12z"/><circle cx="12" cy="10" r="2.6" fill="#0B2230"/></svg>';document.body.appendChild(d);setTimeout(function(){d.remove();},1700);toast('أُضيف اسمك إلى خريطة الإنجاز');}
function showCard(){var m=render(stepsHTML(3)+'<section class="card thanks"><h2 class="h2">بطاقة الشكر والتقدير</h2><p class="sub">'+esc(ST.sub.name)+'</p><div data-img><div class="empty">'+I('star')+'جارٍ تجهيز بطاقتك…</div></div>'+
  '<div class="row noprint"><button class="btn gold" data-save>'+I('down')+'حفظ البطاقة صورة</button><button class="btn line" data-share hidden>'+I('share')+'مشاركة</button><button class="btn ghost" data-back>العودة إلى التقييم</button></div><p class="sub" style="margin-top:10px">على الآيفون: اضغطي على البطاقة مطولًا ثم «إضافة إلى الصور».</p></section>');
 $('[data-back]',m).onclick=showResult;
 drawCard(ST.sub,ST.g).then(function(cv){var url=cv.toDataURL('image/png');$('[data-img]',m).innerHTML='<img src="'+url+'" alt="بطاقة شكر باسم '+esc(ST.sub.name)+'">';
  var fname='بطاقة-شكر-'+ST.sub.name.split(' ').slice(0,2).join('-')+'.png';
  $('[data-save]',m).onclick=function(){cv.toBlob(function(b){var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=fname;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove();},2000);toast('حُفظت البطاقة');},'image/png');};
  cv.toBlob(function(b){try{var f=new File([b],fname,{type:'image/png'});if(navigator.canShare&&navigator.canShare({files:[f]})){var sh=$('[data-share]',m);sh.hidden=false;sh.onclick=function(){navigator.share({files:[f],title:'بطاقة شكر',text:'بطاقة شكر من '+(G.cfg.title||DEF.title)}).catch(function(){});};}}catch(e){}},'image/png');
 });}

/* ---------- رسم بطاقة الشكر (1080×1350) ---------- */
function loadImg(src){return new Promise(function(res){if(!src)return res(null);var i=new Image();i.onload=function(){res(i);};i.onerror=function(){res(null);};i.src=src;});}
function drawCard(sub,g){var F='"IBM Plex Sans Arabic"';
 var fl=document.fonts&&document.fonts.load?Promise.all([document.fonts.load('700 60px '+F,'نجم'),document.fonts.load('400 30px '+F,'نجم'),document.fonts.load('600 30px '+F,'نجم')]).catch(function(){}):Promise.resolve();
 return Promise.all([fl,loadImg(G.cfg.logo)]).then(function(r){var logo=r[1],W=1080,H=1350,c=document.createElement('canvas');c.width=W;c.height=H;var x=c.getContext('2d'),i,k;
  var bg=x.createRadialGradient(W*.85,H*.05,40,W*.5,H*.5,H*.95);bg.addColorStop(0,'#2B6B78');bg.addColorStop(.42,'#123A4E');bg.addColorStop(1,'#061722');x.fillStyle=bg;x.fillRect(0,0,W,H);
  /* شبكة خطوط الطول والعرض */
  x.strokeStyle='rgba(150,200,210,.10)';x.lineWidth=1.2;for(i=-5;i<=5;i++){x.beginPath();x.moveTo(W/2+i*110,0);x.quadraticCurveTo(W/2+i*160,H/2,W/2+i*110,H);x.stroke();}
  for(i=1;i<9;i++){x.beginPath();x.moveTo(0,i*150);x.quadraticCurveTo(W/2,i*150-40,W,i*150);x.stroke();}
  /* خطوط كنتورية */
  [[150,1180,7],[960,1220,5],[980,120,4]].forEach(function(cc,ci){for(k=1;k<=cc[2];k++){x.beginPath();for(var a=0;a<=72;a++){var t=a/72*Math.PI*2,rr=k*30*(1+.16*Math.sin(3*t+ci+k*.4)+.08*Math.sin(5*t-ci));var px=cc[0]+Math.cos(t)*rr*1.3,py=cc[1]+Math.sin(t)*rr;a?x.lineTo(px,py):x.moveTo(px,py);}x.closePath();x.strokeStyle='rgba(217,179,106,'+(k%3===0?.22:.13)+')';x.lineWidth=k%3===0?1.6:1.1;x.stroke();}});
  /* الإطار */
  x.strokeStyle='rgba(217,179,106,.75)';x.lineWidth=2;x.strokeRect(44,44,W-88,H-88);x.strokeStyle='rgba(217,179,106,.35)';x.lineWidth=1;x.strokeRect(60,60,W-120,H-120);
  [[44,44],[W-44,44],[44,H-44],[W-44,H-44]].forEach(function(p){x.save();x.translate(p[0],p[1]);x.rotate(Math.PI/4);x.fillStyle='#D9B36A';x.fillRect(-9,-9,18,18);x.fillStyle='#0B2230';x.fillRect(-4,-4,8,8);x.restore();});
  /* البوصلة */
  var cx=W/2,cy=245;x.save();x.translate(cx,cy);x.strokeStyle='rgba(217,179,106,.7)';x.lineWidth=1.5;x.beginPath();x.arc(0,0,112,0,6.283);x.stroke();x.beginPath();x.arc(0,0,100,0,6.283);x.stroke();
  for(i=0;i<72;i++){var an=i*5*Math.PI/180,r1=i%18===0?86:(i%2?96:92);x.beginPath();x.moveTo(Math.sin(an)*r1,-Math.cos(an)*r1);x.lineTo(Math.sin(an)*100,-Math.cos(an)*100);x.strokeStyle='rgba(242,227,190,.55)';x.lineWidth=1;x.stroke();}
  function pt(rot,len,w,fill){x.save();x.rotate(rot);x.beginPath();x.moveTo(0,-len);x.lineTo(w,0);x.lineTo(0,len*.12);x.lineTo(-w,0);x.closePath();x.fillStyle=fill;x.fill();x.strokeStyle='#D9B36A';x.lineWidth=1.2;x.stroke();x.restore();}
  for(i=0;i<4;i++)pt(Math.PI/4+i*Math.PI/2,58,10,'rgba(242,227,190,.18)');pt(Math.PI,80,13,'rgba(242,227,190,.16)');pt(Math.PI/2,80,13,'rgba(242,227,190,.16)');pt(-Math.PI/2,80,13,'rgba(242,227,190,.16)');pt(0,80,13,'#D9B36A');
  x.beginPath();x.arc(0,0,8,0,6.283);x.fillStyle='#F2E3BE';x.fill();
  x.fillStyle='#F2E3BE';x.font='700 22px '+F;x.textAlign='center';x.textBaseline='middle';x.fillText('ش',0,-128);x.restore();
  /* النصوص */
  x.direction='rtl';x.textAlign='center';x.textBaseline='alphabetic';
  function fit(t,font,size,maxW){x.font=font.replace('S',size+'px')+' '+F;while(x.measureText(t).width>maxW&&size>24){size-=2;x.font=font.replace('S',size+'px')+' '+F;}return size;}
  function wrap(t,font,size,maxW,lh,color,y){x.font=font.replace('S',size+'px')+' '+F;x.fillStyle=color;var ws=t.split(' '),line='',lines=[];ws.forEach(function(w){var tt=line?line+' '+w:w;if(x.measureText(tt).width>maxW&&line){lines.push(line);line=w;}else line=tt;});if(line)lines.push(line);lines.forEach(function(l,j){x.fillText(l,W/2,y+j*lh);});return y+lines.length*lh;}
  var c0=G.cfg;x.fillStyle='#D9B36A';x.font='600 34px '+F;x.fillText('بطاقة شكر وتقدير',W/2,430);
  var ts=fit(c0.title||DEF.title,'700 S',84,860);var gr=x.createLinearGradient(W*.2,0,W*.8,0);gr.addColorStop(0,'#D9B36A');gr.addColorStop(.5,'#F2E3BE');gr.addColorStop(1,'#D9B36A');x.fillStyle=gr;x.font='700 '+ts+'px '+F;x.fillText(c0.title||DEF.title,W/2,530);
  x.strokeStyle='rgba(217,179,106,.6)';x.lineWidth=1.2;x.beginPath();x.moveTo(W/2-210,568);x.lineTo(W/2-24,568);x.moveTo(W/2+24,568);x.lineTo(W/2+210,568);x.stroke();x.save();x.translate(W/2,568);x.rotate(Math.PI/4);x.fillStyle='#D9B36A';x.fillRect(-6,-6,12,12);x.restore();
  var y=wrap('يسرّ '+(c0.teacher?'المعلمة '+c0.teacher:'معلمتك')+' أن تتقدّم بخالص الشكر والتقدير','400 S',36,880,54,'#E6EFF0',650);x.font='400 36px '+F;x.fillText('إلى الطالبة',W/2,y);y+=54;
  var ns=fit(sub.name,'700 S',76,900);x.font='700 '+ns+'px '+F;x.fillStyle=gr;x.shadowColor='rgba(217,179,106,.45)';x.shadowBlur=24;x.fillText(sub.name,W/2,y+70);x.shadowBlur=0;y+=112;
  if(sub.cls){x.font='500 28px '+F;x.fillStyle='#B9CFD2';x.fillText(sub.cls,W/2,y+20);y+=40;}
  y=wrap((g&&g.good?'لتميّزها في حلّ تحدّي ':'لمشاركتها الفاعلة في تحدّي ')+'«'+(ST.q&&ST.q.week||'الأسبوع')+'»'+(c0.subject?' في '+c0.subject:''),'500 S',34,860,52,'#F2E3BE',y+50);
  y=wrap(c0.cardMsg||'متمنّين لها دوام التألق، وأن تبقى نجمةً تهتدي بها زميلاتها كما يهتدي المسافر بالبوصلة.','400 S',30,820,48,'#D7E6E8',y+18);
  var d=new Date(sub.at||Date.now());x.font='400 26px '+F;x.fillStyle='#9FBDC2';x.fillText(d.toLocaleDateString('ar-OM',{weekday:'long',day:'numeric',month:'long',year:'numeric'})+'  ·  '+hijri(d),W/2,Math.max(y+40,1090));
  /* التذييل: المدرسة والشعار */
  var fy=1200;if(logo){var ls=96;x.save();x.beginPath();x.arc(W/2,fy-30,ls/2+6,0,6.283);x.fillStyle='#fff';x.fill();x.beginPath();x.arc(W/2,fy-30,ls/2,0,6.283);x.clip();var s=Math.min(ls/logo.width,ls/logo.height);x.drawImage(logo,W/2-logo.width*s/2,fy-30-logo.height*s/2,logo.width*s,logo.height*s);x.restore();fy+=46;}
  if(c0.school){x.font='600 30px '+F;x.fillStyle='#F2E3BE';x.fillText(c0.school,W/2,fy+(logo?20:0));}
  return c;});}

/* ===================== المعلمة: الدخول ===================== */
function vLogin(){var mode='in',locked=!!G.cfg.teacherSet;
 DB.cfg().then(function(c){if(c&&c.teacherSet&&!locked){locked=true;mode='in';draw();}}).catch(function(){});
 function draw(){var m=render('<section class="card" style="max-width:480px;margin:0 auto"><div style="text-align:center">'+compassSVG().replace('class="compass ','style="width:86px;height:86px" class="compass ')+'</div><h2 class="h2" style="text-align:center">'+(mode==='in'?'دخول المعلمة':'إنشاء كلمة سر المعلمة')+'</h2>'+
  '<p class="sub" style="text-align:center">'+(mode==='in'?'اكتبي كلمة سر لوحة المتابعة. تبقين مسجّلة على هذا الجهاز.':'أول مرة فقط: اختاري كلمة سر من 6 أحرف أو أكثر، وتُستخدم بعدها للدخول من أي جهاز.')+'</p>'+
  '<form data-f style="margin-top:14px" novalidate><label class="field"><span class="lbl">كلمة السر</span><input class="input" type="password" name="pw" dir="ltr" autocomplete="'+(mode==='in'?'current':'new')+'-password"></label>'+
  (mode==='up'?'<label class="field"><span class="lbl">تأكيد كلمة السر</span><input class="input" type="password" name="pw2" dir="ltr" autocomplete="new-password"></label>':'')+
  '<span class="err" data-e hidden></span><button class="btn gold block" type="submit" style="margin-top:6px">'+I('lock')+(mode==='in'?'دخول':'حفظ كلمة السر والدخول')+'</button></form>'+
  '<div class="row" style="justify-content:center;margin-top:12px">'+(locked?'':'<button class="btn ghost sm" data-sw>'+(mode==='in'?'أول مرة؟ أنشئي كلمة السر':'لديّ كلمة سر، العودة إلى الدخول')+'</button>')+'<a class="btn ghost sm" href="#/">الرئيسية</a></div></section>');
  if($('[data-sw]',m))$('[data-sw]',m).onclick=function(){mode=mode==='in'?'up':'in';draw();};
  $('[data-f]',m).onsubmit=function(e){e.preventDefault();var pw=this.pw.value,er=$('[data-e]',m),bt=$('button[type=submit]',m);er.hidden=true;
   function bad(t){er.hidden=false;er.textContent=t;bt.disabled=false;}
   if(pw.length<6)return bad('كلمة السر 6 أحرف على الأقل.');if(mode==='up'&&pw!==this.pw2.value)return bad('كلمتا السر غير متطابقتين.');bt.disabled=true;
   (mode==='in'?DB.login(pw):DB.signup(pw)).then(function(){if(!G.cfg.teacherSet){G.cfg.teacherSet=true;DB.saveCfg({teacherSet:true}).catch(function(){});}toast('أهلًا بكِ في لوحة المتابعة');brand();route();}).catch(function(x){var c=x&&x.message||'';
    if(c==='no-account')return bad('لم تُنشأ كلمة سر بعد. اضغطي «أول مرة؟ أنشئي كلمة السر».');
    if(c==='wrong')return bad('كلمة السر غير صحيحة. إن كانت هذه أول مرة فاضغطي «أول مرة؟».');
    if(c==='exists'){locked=true;mode='in';draw();var e2=$('[data-e]');if(e2){e2.hidden=false;e2.textContent='حساب المعلمة منشأ مسبقًا، فلا يمكن إنشاؤه مرة أخرى. ادخلي بكلمة السر التي اخترتِها أول مرة.';}return;}
    if(/too-many/.test(x&&x.code||''))return bad('محاولات كثيرة. انتظري دقائق ثم أعيدي المحاولة.');
    if(/operation-not-allowed|configuration-not-found/.test(x&&x.code||''))return bad('خدمة الدخول بكلمة السر غير مفعّلة في مشروع Firebase بعد.');
    bad('تعذّر الدخول، تأكدي من الإنترنت.');});};}
 draw();}
function tabs(on){var T=[['','المتابعة','list'],['q','الأسئلة','q'],['honor','لوحة الشرف','trophy'],['set','الإعدادات','gear']];
 return '<nav class="tabs noprint">'+T.map(function(t){return '<a href="#/teacher'+(t[0]?'/'+t[0]:'')+'" class="'+(t[0]===on?'on':'')+'">'+I(t[2])+t[1]+'</a>';}).join('')+'</nav>';}

/* ===================== المعلمة: المتابعة ===================== */
var FB={};
function vFollow(){var m=render(tabs('')+'<div class="card empty">'+I('globe')+'جارٍ التحميل…</div>');
 Promise.all([DB.cfg(),DB.questions(),DB.fbs().catch(function(){return {};})]).then(function(r){mergeCfg(r[0]);var qs=r[1];FB=r[2]||{};
  if(!qs.length)return render(tabs('')+'<section class="card empty">'+I('q')+'<b style="display:block;font-size:18px;color:var(--ink)">لا توجد أسئلة بعد</b>ابدئي بإضافة سؤال الأسبوع الأول، ثم شاركي الرابط مع الطالبات.<div class="row" style="justify-content:center;margin-top:14px"><a class="btn gold" href="#/teacher/q">'+I('plus')+'إضافة سؤال</a><a class="btn line" href="#/teacher/set">'+I('link')+'رابط الطالبات</a></div></section>');
  var sel=G.selQ&&qs.some(function(q){return q.id===G.selQ;})?G.selQ:(G.cfg.active&&qs.some(function(q){return q.id===G.cfg.active;})?G.cfg.active:qs[0].id);G.selQ=sel;
  var q=qs.filter(function(x){return x.id===sel;})[0];
  m=render(tabs('')+'<section class="card"><div class="row" style="justify-content:space-between"><div style="flex:1 1 240px"><span class="greet" style="color:var(--acc)">لوحة المتابعة الحية</span><h2 class="h2" style="margin:0">'+esc(q.week||'سؤال')+(q.open?' <span class="tag good">مفتوح للطالبات</span>':' <span class="tag off">مغلق</span>')+'</h2></div>'+
   '<select class="input" data-sel style="flex:0 1 260px">'+qs.map(function(x){return '<option value="'+x.id+'"'+(x.id===sel?' selected':'')+'>'+esc((x.week||'سؤال')+(x.open?' (مفتوح)':''))+'</option>';}).join('')+'</select></div><p class="qtext" style="font-size:16px;margin:10px 0 0">'+esc(q.text)+'</p></section>'+
   '<div class="stats" data-stats></div>'+
   '<section class="card"><div class="row" style="justify-content:space-between;margin-bottom:10px"><h2 class="h2" style="margin:0">خريطة الإنجاز</h2><span class="sub">كل دبوس طالبة أنجزت التحدي</span></div><div class="mapw" data-map></div></section>'+
   '<section class="card"><div class="row" style="justify-content:space-between;margin-bottom:12px"><h2 class="h2" style="margin:0">المنجزات ووقت التسليم</h2><div class="row noprint"><button class="btn sm line" data-draw>'+I('dice')+'قرعة نجم الأسبوع</button><button class="btn sm line" data-csv>'+I('sheet')+'Excel</button><button class="btn sm line" onclick="print()">'+I('print')+'طباعة</button></div></div>'+
   '<div class="search noprint" style="margin-bottom:12px"><input class="input" data-qs placeholder="ابحثي باسم الطالبة…"><select class="input" data-fc><option value="">كل الصفوف</option></select><select class="input" data-fl><option value="">الكل</option><option value="good">المتميزة والصحيحة</option><option value="mid">الجيدة</option><option value="bad">تحتاج مراجعة</option></select></div><div class="list" data-list></div></section>');
  $('[data-sel]',m).onchange=function(){G.selQ=this.value;route();};
  DB.key(q.id).then(function(key){var subs=[],seen={},first=true;
   function draw(){var f=$('[data-qs]',m).value,fc=$('[data-fc]',m).value,fl=$('[data-fl]',m).value,nf=norm(f);
    var rows=subs.map(function(s){return {s:s,g:grade(q,key,s,FB[s.id])};}).sort(function(a,b){return (b.s.at||0)-(a.s.at||0);});
    var cls={};rows.forEach(function(r){if(r.s.cls)cls[r.s.cls]=1;});var fcEl=$('[data-fc]',m),cur=fcEl.value;fcEl.innerHTML='<option value="">كل الصفوف</option>'+Object.keys(cls).sort().map(function(k){return '<option'+(k===cur?' selected':'')+'>'+esc(k)+'</option>';}).join('');
    var good=rows.filter(function(r){return r.g.good;}).length,size=+G.cfg.classSize||0,pct=size?Math.min(100,Math.round(rows.length/size*100)):null;
    $('[data-stats]',m).innerHTML=[['users','المنجزات',rows.length,''],['check',q.type==='mcq'?'إجابات صحيحة':'إجابات متميزة',good,'g'],['globe','نسبة المشاركة',pct==null?'—':pct+'٪',''],['clock','آخر تسليم',rows[0]?tm(rows[0].s.at):'—','']].map(function(s){return '<div class="card stat"><span class="ic '+s[3]+'">'+I(s[0])+'</span><span><b>'+s[2]+'</b><small>'+s[1]+(s[1]==='نسبة المشاركة'?(size?' من '+size+' (الهدف 85٪)':' (حدّدي العدد في الإعدادات)'):'')+'</small></span></div>';}).join('');
    mapDraw($('[data-map]',m),rows);
    var vis=rows.filter(function(r){return (!nf||norm(r.s.name).indexOf(nf)>=0)&&(!fc||r.s.cls===fc)&&(!fl||r.g.level===fl);});
    $('[data-list]',m).innerHTML=vis.length?vis.map(function(r){var s=r.s,g=r.g,nw=!first&&!seen[s.id];return '<button class="it'+(nw?' new':'')+'" data-id="'+esc(s.id)+'"><span class="av">'+esc(initials(s.name))+'</span><span class="mid"><b>'+esc(s.name)+'</b><small>'+esc([s.cls,q.type==='mcq'?s.answer:String(s.answer||'').slice(0,80)].filter(Boolean).join(' · '))+'</small></span>'+
     '<span class="tag '+(g.level==='good'?'good':(g.level==='bad'?'bad':''))+'">'+esc(g.mark||(q.type==='mcq'?(g.ok?'صحيحة':'خطأ'):(g.score==null?'مستلمة':g.score+'٪')))+'</span><span class="tm">'+tm(s.at)+'<br>'+(s.at?new Date(s.at).toLocaleDateString('ar-OM',{day:'numeric',month:'numeric'}):'')+'</span></button>';}).join('')
     :'<div class="empty">'+I('pin')+(rows.length?'لا نتائج مطابقة للبحث.':'لم تسلّم أي طالبة بعد. شاركي رابط المنصة مع الطالبات من الإعدادات.')+'</div>';
    rows.forEach(function(r){seen[r.s.id]=1;});first=false;
    $$('[data-id]',m).forEach(function(b){b.onclick=function(){var r=rows.filter(function(x){return x.s.id===b.dataset.id;})[0];if(r)subDlg(q,key,r.s,draw,function(){subs=subs.filter(function(x){return x.id!==r.s.id;});draw();});};});
    G.rows=rows;}
   ['[data-qs]','[data-fc]','[data-fl]'].forEach(function(s){$(s,m).addEventListener(s==='[data-qs]'?'input':'change',draw);});
   $('[data-csv]',m).onclick=function(){csv(q,G.rows||[]);};
   $('[data-draw]',m).onclick=function(){luckyDraw(q,G.rows||[]);};
   G.unsub=DB.watchSubs(q.id,function(a){var nw=subs.length&&a.length>subs.length;subs=a;draw();if(nw)toast('وصل تسليم جديد');},function(e){console.error(e);toast('تعذّر تحديث القائمة الحية');});
  });
 }).catch(function(e){console.error(e);render(tabs('')+'<section class="card empty">'+I('globe')+'تعذّر التحميل. تأكدي من الإنترنت.</section>');});}
function hashN(s){var h=2166136261>>>0;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)>>>0;}return h;}
function mapDraw(el,rows){var W=1000,H=360,cl='',gl='',i,k;
 [[230,190,6],[760,150,5],[560,300,3]].forEach(function(c,ci){for(k=1;k<=c[2];k++){var d='';for(var a=0;a<=48;a++){var t=a/48*Math.PI*2,rr=k*26*(1+.18*Math.sin(3*t+ci+k*.5)+.08*Math.sin(5*t-ci));d+=(a?'L':'M')+(c[0]+Math.cos(t)*rr*1.5).toFixed(1)+' '+(c[1]+Math.sin(t)*rr).toFixed(1);}cl+='<path class="cl" d="'+d+'Z"/>';}});
 for(i=1;i<10;i++)gl+='<path class="gl" d="M'+(i*100)+' 0 Q '+(i*100+(i-5)*12)+' 180 '+(i*100)+' 360"/>';for(i=1;i<4;i++)gl+='<path class="gl" d="M0 '+(i*90)+' Q 500 '+(i*90-20)+' 1000 '+(i*90)+'"/>';
 var pts=rows.slice().reverse().map(function(r,j){var h=hashN(norm(r.s.name)+r.s.id),px=60+(h%880),py=40+((h>>>10)%270);return {x:px,y:py,g:r.g.good,j:j};});
 var rt='';if(pts.length>1){rt='<path class="rt" d="'+pts.map(function(p,j){return (j?'L':'M')+p.x+' '+p.y;}).join(' ')+'"/>';}
 var pn=pts.map(function(p,j){var last=j===pts.length-1;return (last?'<circle class="hl" cx="'+p.x+'" cy="'+(p.y-9)+'" r="9"/>':'')+'<path class="pn'+(p.g?' k':'')+'" style="animation-delay:'+Math.min(j*40,1600)+'ms" d="M'+p.x+' '+p.y+' c-5 -6 -8 -9 -8 -13 a8 8 0 0 1 16 0 c0 4 -3 7 -8 13z"><title>'+esc(rows[rows.length-1-j].s.name)+'</title></path>';}).join('');
 el.innerHTML='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="خريطة الإنجاز: '+rows.length+' طالبة">'+gl+cl+rt+pn+'</svg>'+(rows.length?'':'<div class="cap" style="inset:0;display:grid;place-items:center;font-size:14px">يظهر هنا دبوس لكل طالبة تسلّم حلها</div>')+'<div class="cap"><span><i class="k"></i>متميزة</span><span><i></i>مشاركة</span></div>';}
function subDlg(q,key,s,redraw,ondel){var f=FB[s.id]||{},g=grade(q,key,s,f);
 var d=dlg(s.name,'<p class="sub">'+esc(s.cls||'')+(s.cls?' · ':'')+'سلّمت '+dt(s.at)+' الساعة '+tm(s.at)+'</p>'+
  '<div class="box"><h4>'+I('edit')+'الإجابة</h4><p>'+esc(s.answer)+'</p></div>'+
  '<div class="box"><h4>'+I('check')+'التقييم الآلي</h4><p>'+esc(q.type==='mcq'?(g.ok?'صحيحة':'غير صحيحة'):(g.score==null?'سؤال مقالي بلا كلمات مفتاحية: قدّريه أنتِ':'نسبة الاكتمال '+g.score+'٪'))+'</p></div>'+
  '<div class="field" style="margin-top:14px"><span class="lbl">تقدير المعلمة (يظهر للطالبة)</span><div class="seg" data-mk>'+['','ممتاز','جيد جدًا','جيد','يحتاج دعمًا'].map(function(k){return '<button type="button" data-v="'+k+'" class="'+((f.mark||'')===k?'on':'')+'">'+(k||'بلا')+'</button>';}).join('')+'</div></div>'+
  '<label class="field"><span class="lbl">رسالة خاصة للطالبة</span><textarea class="textarea" data-note style="min-height:90px" placeholder="مثال: إجابة رائعة، أضيفي مثالًا من خريطة عُمان">'+esc(f.note||'')+'</textarea><span class="hint">تظهر لها عند فتح المنصة من جهازها.</span></label>',
  '<button class="btn danger" data-del>'+I('trash')+'حذف التسليم</button><button class="btn gold" data-save>'+I('check')+'حفظ</button>');
 var mk=f.mark||'';$$('[data-mk] button',d).forEach(function(b){b.onclick=function(){mk=b.dataset.v;$$('[data-mk] button',d).forEach(function(x){x.classList.toggle('on',x===b);});};});
 $('[data-save]',d).onclick=function(){var o={mark:mk,note:$('[data-note]',d).value.trim(),at:Date.now()};DB.saveFb(s.id,o).then(function(){FB[s.id]=o;d.closeDlg();redraw();toast('حُفظ التقدير');}).catch(function(){toast('تعذّر الحفظ');});};
 $('[data-del]',d).onclick=function(){if(!confirm('حذف تسليم '+s.name+'؟ يمكنها التسليم مجددًا بعده.'))return;DB.delSub(s.id).then(function(){delete FB[s.id];d.closeDlg();ondel();toast('حُذف التسليم');}).catch(function(){toast('تعذّر الحذف');});};}
function csv(q,rows){var L=[['م','الاسم الرباعي','الصف والشعبة','الإجابة','التقييم','تقدير المعلمة','التاريخ','وقت التسليم']];
 rows.slice().reverse().forEach(function(r,i){var s=r.s,g=r.g;L.push([i+1,s.name,s.cls||'',s.answer,q.type==='mcq'?(g.ok?'صحيحة':'غير صحيحة'):(g.score==null?'مستلمة':g.score+'%'),(FB[s.id]||{}).mark||'',s.at?new Date(s.at).toLocaleDateString('ar-OM'):'',tm(s.at)]);});
 var t='﻿'+L.map(function(r){return r.map(function(v){v=String(v==null?'':v);return /[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v;}).join(',');}).join('\r\n');
 var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'text/csv;charset=utf-8'}));a.download=(G.cfg.title||'نجم الأسبوع')+' - '+(q.week||'سؤال')+'.csv';document.body.appendChild(a);a.click();setTimeout(function(){a.remove();},1000);}
function luckyDraw(q,rows){var pool=rows.filter(function(r){return r.g.good;});var from='المتميزات';if(!pool.length){pool=rows;from='كل المنجزات';}
 if(!pool.length){toast('لا توجد تسليمات بعد');return;}
 var d=dlg('قرعة نجم الأسبوع','<div style="text-align:center">'+compassSVG().replace('class="compass ','style="width:120px;height:120px" class="compass ')+'<p class="sub">من بين '+pool.length+' من '+from+'</p><div data-nm style="font-size:clamp(22px,5vw,32px);font-weight:700;color:var(--acc2);min-height:56px;margin-top:6px">…</div></div>','<button class="btn gold" data-again>'+I('dice')+'سحب آخر</button>');
 function spin(){var n=0,el=$('[data-nm]',d),t=setInterval(function(){el.textContent=pool[Math.floor(Math.random()*pool.length)].s.name;if(++n>18){clearInterval(t);var w=pool[Math.floor(Math.random()*pool.length)].s;el.textContent='⭐ '+w.name+' ⭐';}},REDUCED?1:90);}
 $('[data-again]',d).onclick=spin;spin();}

/* ===================== المعلمة: الأسئلة ===================== */
function vQuestions(){var m=render(tabs('q')+'<div class="card empty">'+I('globe')+'جارٍ التحميل…</div>');
 Promise.all([DB.cfg(),DB.questions()]).then(function(r){mergeCfg(r[0]);var qs=r[1];
  m=render(tabs('q')+'<section class="card"><div class="row" style="justify-content:space-between"><div><h2 class="h2" style="margin:0">أسئلة الأسابيع</h2><p class="sub">سؤال واحد مفتوح للطالبات في كل مرة. يُغلق السابق تلقائيًا عند فتح الجديد.</p></div><button class="btn gold" data-new>'+I('plus')+'سؤال جديد</button></div></section>'+
   '<div class="grid2" data-qs>'+(qs.length?qs.map(qCard).join(''):'<section class="card empty">'+I('q')+'لا توجد أسئلة بعد. أضيفي سؤال الأسبوع الأول.</section>')+'</div>');
  $('[data-new]',m).onclick=function(){qEditor(null,{},qs.length+1);};
  $$('[data-act]',m).forEach(function(b){var id=b.closest('[data-q]').dataset.q,q=qs.filter(function(x){return x.id===id;})[0];b.onclick=function(){var a=b.dataset.act;
   if(a==='edit')DB.key(id).then(function(k){qEditor(q,k||{});});
   if(a==='open'||a==='close'){b.disabled=true;DB.activate(a==='open'?id:'').then(function(){toast(a==='open'?'فُتح السؤال للطالبات':'أُغلق السؤال');vQuestions();}).catch(function(){b.disabled=false;toast('تعذّر التحديث');});}
   if(a==='del'){if(!confirm('حذف «'+(q.week||'السؤال')+'»؟ تبقى تسليمات الطالبات محفوظة.'))return;DB.delQ(id).then(function(){toast('حُذف السؤال');vQuestions();});}
   if(a==='view'){G.selQ=id;location.hash='#/teacher';}};});
 });}
function qCard(q){return '<section class="card qitem'+(q.open?' live':'')+'" data-q="'+esc(q.id)+'">'+(q.img?'<img class="qthumb" src="'+esc(q.img)+'" alt="">':'')+
 '<div class="qmeta"><span class="tag">'+I('pin')+esc(q.week||'سؤال')+'</span><span class="tag sea">'+(q.type==='mcq'?'اختيار من متعدد':'مقالي')+'</span>'+(q.open?'<span class="tag good">مفتوح الآن</span>':'<span class="tag off">مغلق</span>')+'</div>'+
 '<p class="qtext">'+esc(q.text)+'</p><div class="row">'+(q.open?'<button class="btn sm line" data-act="close">'+I('pause')+'إغلاق</button>':'<button class="btn sm gold" data-act="open">'+I('play')+'فتح للطالبات</button>')+
 '<button class="btn sm line" data-act="view">'+I('list')+'المنجزات</button><button class="btn sm ghost" data-act="edit">'+I('edit')+'تعديل</button><button class="btn sm ghost" data-act="del" aria-label="حذف">'+I('trash')+'</button></div></section>';}
function qEditor(q,key,n){var isNew=!q;q=q?clone(q):{type:'mcq',week:'الأسبوع '+['الأول','الثاني','الثالث','الرابع','الخامس','السادس','السابع','الثامن','التاسع','العاشر'][(n||1)-1]||'',choices:['','','','']};key=key||{};
 var type=q.type||'mcq',img=q.img||'',corr=key.correct==null?0:+key.correct;
 var d=dlg(isNew?'سؤال جديد':'تعديل السؤال','<form data-f novalidate>'+
  '<label class="field"><span class="lbl">عنوان الأسبوع</span><input class="input" name="week" value="'+esc(q.week||'')+'" placeholder="مثال: الأسبوع الثالث · التضاريس"></label>'+
  '<div class="field"><span class="lbl">نوع السؤال</span><div class="seg" data-type><button type="button" data-v="mcq">اختيار من متعدد</button><button type="button" data-v="essay">مقالي</button></div></div>'+
  '<label class="field"><span class="lbl">نص السؤال</span><textarea class="textarea" name="text" style="min-height:100px" placeholder="مثال: ما أطول سلسلة جبلية في سلطنة عُمان؟">'+esc(q.text||'')+'</textarea></label>'+
  '<div class="field"><span class="lbl">صورة أو خريطة للسؤال (اختياري)</span><div class="imgpick"><span data-ip>'+(img?'<img src="'+esc(img)+'" alt="">':'')+'</span><label class="btn sm line">'+I('img')+'اختيار صورة<input type="file" accept="image/*" hidden data-img></label><button type="button" class="btn sm ghost" data-noimg'+(img?'':' hidden')+'>إزالة</button></div></div>'+
  '<label class="field"><span class="lbl">إرشاد قبل الحل (اختياري)</span><input class="input" name="guide" value="'+esc(q.guide||'')+'" placeholder="مثال: استعيني بخريطة صفحة 24"></label>'+
  '<div data-mcq><span class="lbl" style="font-weight:600;font-size:14.5px;color:var(--ink2)">الخيارات (حدّدي الصحيح)</span><div class="chlist" data-ch style="margin-top:6px"></div><button type="button" class="btn sm ghost" data-addch>'+I('plus')+'خيار</button></div>'+
  '<label class="field" style="margin-top:14px"><span class="lbl" data-mlbl>الإجابة النموذجية</span><textarea class="textarea" name="model" style="min-height:90px">'+esc(key.model||'')+'</textarea></label>'+
  '<label class="field" data-kwf><span class="lbl">كلمات مفتاحية للتقييم الفوري (يفصل بينها فاصلة)</span><input class="input" name="kw" value="'+esc((key.keywords||[]).join('، '))+'" placeholder="مثال: الحجر, جبل شمس, الشمال"><span class="hint">تُقارن بإجابة الطالبة فتظهر لها نسبة الاكتمال فورًا. اتركيها فارغة إن أردتِ التقدير بنفسك.</span></label>'+
  '<label class="field"><span class="lbl">ملاحظات المعلمة وإرشاداتها بعد الحل (تظهر لكل الطالبات)</span><textarea class="textarea" name="note" style="min-height:80px" placeholder="مثال: أحسنتن! راجعن درس التضاريس في كتاب الطالب">'+esc(key.note||'')+'</textarea></label>'+
  (isNew?'<label class="row" style="gap:8px;font-weight:600"><input type="checkbox" name="open" checked style="width:20px;height:20px;accent-color:var(--acc)">افتحيه للطالبات الآن</label>':'')+
  '<span class="err" data-e hidden></span></form>','<button class="btn gold" data-save>'+I('check')+'حفظ السؤال</button>');
 var f=$('[data-f]',d);
 function chRows(){var cs=$$('[data-ch] .chrow input.input',d).map(function(i){return i.value;});return cs;}
 function drawCh(list){$('[data-ch]',d).innerHTML=list.map(function(c,i){return '<div class="chrow"><label><input type="radio" name="corr" value="'+i+'"'+(i===corr?' checked':'')+'>صحيح</label><input class="input" value="'+esc(c)+'" placeholder="الخيار '+letter(i)+'"><button type="button" class="btn sm ghost" data-rm="'+i+'" aria-label="حذف الخيار"'+(list.length<=2?' disabled':'')+'>'+I('x')+'</button></div>';}).join('');
  $$('[name=corr]',d).forEach(function(r){r.onchange=function(){corr=+r.value;};});
  $$('[data-rm]',d).forEach(function(b){b.onclick=function(){var l=chRows(),i=+b.dataset.rm;l.splice(i,1);if(corr===i)corr=0;else if(corr>i)corr--;drawCh(l);};});}
 function setType(t){type=t;$$('[data-type] button',d).forEach(function(b){b.classList.toggle('on',b.dataset.v===t);});$('[data-mcq]',d).hidden=t!=='mcq';$('[data-kwf]',d).hidden=t==='mcq';$('[data-mlbl]',d).textContent=t==='mcq'?'تفسير الإجابة الصحيحة (يظهر بعد الحل)':'الإجابة النموذجية';}
 drawCh(q.choices&&q.choices.length?q.choices:['','','','']);setType(type);
 $$('[data-type] button',d).forEach(function(b){b.onclick=function(){setType(b.dataset.v);};});
 $('[data-addch]',d).onclick=function(){var l=chRows();if(l.length>=6)return toast('ستة خيارات كحد أقصى');l.push('');drawCh(l);};
 $('[data-img]',d).onchange=function(){var fl=this.files[0];if(!fl)return;fileToImg(fl,1000,'image/jpeg',.78).then(function(u){if(u.length>700000)return fileToImg(fl,720,'image/jpeg',.7);return u;}).then(function(u){img=u;$('[data-ip]',d).innerHTML='<img src="'+u+'" alt="">';$('[data-noimg]',d).hidden=false;}).catch(function(){toast('تعذّر قراءة الصورة');});};
 $('[data-noimg]',d).onclick=function(){img='';$('[data-ip]',d).innerHTML='';this.hidden=true;};
 $('[data-save]',d).onclick=function(){var er=$('[data-e]',d),text=f.text.value.trim();er.hidden=true;function bad(t,el){er.hidden=false;er.textContent=t;if(el){el.classList.add('bad');el.focus();}}
  if(!text)return bad('اكتبي نص السؤال.',f.text);
  var nq={id:q.id,created:q.created,week:f.week.value.trim()||'سؤال الأسبوع',type:type,text:text,img:img,guide:f.guide.value.trim(),open:isNew?!!(f.open&&f.open.checked):!!q.open},nk={model:f.model.value.trim(),note:f.note.value.trim()};
  if(type==='mcq'){var cs=chRows().map(function(c){return c.trim();});if(cs.filter(Boolean).length<2)return bad('أضيفي خيارين على الأقل.');var c2=[],nc=0;cs.forEach(function(c,i){if(c){if(i===corr)nc=c2.length;c2.push(c);}});if(!cs[corr])return bad('حدّدي الخيار الصحيح بين الخيارات المكتوبة.');nq.choices=c2;nk.correct=nc;}
  else{nq.choices=[];nk.keywords=f.kw.value.split(/[،,؛;\n]+/).map(function(s){return s.trim();}).filter(Boolean);if(!nk.model&&!nk.keywords.length)return bad('اكتبي الإجابة النموذجية أو كلمات مفتاحية للتقييم.',f.model);}
  var bt=this;bt.disabled=true;var openNow=nq.open&&isNew;if(isNew)nq.open=false;
  DB.saveQ(nq,nk).then(function(id){return openNow?DB.activate(id).then(function(){return id;}):id;}).then(function(id){d.closeDlg();toast(isNew?'أُضيف السؤال'+(openNow?' وفُتح للطالبات':''):'حُفظ السؤال');vQuestions();}).catch(function(e){console.error(e);bt.disabled=false;bad('تعذّر الحفظ. '+(String(e&&e.message||'').indexOf('size')>=0?'الصورة كبيرة جدًا.':'تأكدي من الإنترنت.'));});};}

/* ===================== المعلمة: لوحة الشرف ===================== */
function vHonor(){var m=render(tabs('honor')+'<div class="card empty">'+I('globe')+'جارٍ التحميل…</div>');
 Promise.all([DB.questions(),DB.allSubs(),DB.fbs().catch(function(){return {};})]).then(function(r){var qs={},keys={};r[0].forEach(function(q){qs[q.id]=q;});FB=r[2]||{};
  return Promise.all(r[0].map(function(q){return DB.key(q.id).then(function(k){keys[q.id]=k||{};});})).then(function(){
   var P={};r[1].forEach(function(s){var q=qs[s.qid];if(!q)return;var g=grade(q,keys[s.qid],s,FB[s.id]),k=norm(s.name);var p=P[k]||(P[k]={name:s.name,cls:s.cls,n:0,good:0,last:0,wk:{}});if(p.wk[s.qid])return;p.wk[s.qid]=1;p.n++;if(g.good)p.good++;if((s.at||0)>p.last){p.last=s.at||0;p.cls=s.cls||p.cls;}});
   var L=Object.keys(P).map(function(k){return P[k];}).sort(function(a,b){return b.good-a.good||b.n-a.n||a.last-b.last;}),nq=r[0].length;
   render(tabs('honor')+heroHTML('لوحة الشرف','نجمات <em>المبادرة</em>','ترتيب الطالبات بعدد التحديات المتميزة ثم عدد المشاركات، في '+nq+' '+(nq===1?'سؤال':'أسئلة')+'.','<span class="chip">'+I('users')+L.length+' طالبة شاركت</span>')+
    '<section class="card honor"><div class="row" style="justify-content:space-between;margin-bottom:12px"><h2 class="h2" style="margin:0">الترتيب العام</h2><button class="btn sm line noprint" onclick="print()">'+I('print')+'طباعة</button></div><div class="list">'+
    (L.length?L.map(function(p,i){return '<div class="it"><span class="rk">'+(i+1)+'</span><span class="av">'+esc(initials(p.name))+'</span><span class="mid"><b>'+esc(p.name)+'</b><small>'+esc(p.cls||'')+'</small></span><span class="tag good">'+p.good+' متميزة</span><span class="tag">'+p.n+' من '+nq+'</span></div>';}).join(''):'<div class="empty">'+I('trophy')+'تظهر هنا الطالبات بعد أول تسليم.</div>')+'</div></section>');});
 }).catch(function(e){console.error(e);render(tabs('honor')+'<section class="card empty">تعذّر التحميل.</section>');});}

/* ===================== المعلمة: الإعدادات ===================== */
function studentURL(){return location.origin+location.pathname.replace(/index\.html$/,'')+'#/student';}
function vSettings(){DB.cfg().then(function(c){mergeCfg(c);c=G.cfg;var logo=c.logo||'';
 var m=render(tabs('set')+'<section class="card"><h2 class="h2">رابط الطالبات</h2><p class="sub">شاركيه في مجموعة الصف أو اعرضي الرمز على الشاشة، فيفتح مدخل الطالبات مباشرة.</p>'+
  '<div class="grid2" style="margin-top:12px;align-items:center"><div class="qr" data-qr></div><div><input class="input" dir="ltr" readonly value="'+esc(studentURL())+'" data-url><div class="row" style="margin-top:10px"><button class="btn gold" data-copy>'+I('link')+'نسخ الرابط</button><a class="btn line" target="_blank" rel="noopener" href="https://wa.me/?text='+encodeURIComponent('تحدي '+(c.title||DEF.title)+' لهذا الأسبوع: '+studentURL())+'">'+I('share')+'واتساب</a></div></div></div></section>'+
  '<section class="card"><h2 class="h2">بيانات المبادرة</h2><form data-f novalidate style="margin-top:10px"><div class="grid2">'+
  '<label class="field"><span class="lbl">اسم المبادرة</span><input class="input" name="title" list="najm-names" value="'+esc(c.title)+'"><datalist id="najm-names">'+NAMES.map(function(n){return '<option value="'+esc(n)+'">';}).join('')+'</datalist></label>'+
  '<label class="field"><span class="lbl">المادة</span><input class="input" name="subject" value="'+esc(c.subject)+'"></label>'+
  '<label class="field"><span class="lbl">اسم المعلمة</span><input class="input" name="teacher" value="'+esc(c.teacher)+'" placeholder="يظهر على بطاقة الشكر"></label>'+
  '<label class="field"><span class="lbl">اسم المدرسة</span><input class="input" name="school" value="'+esc(c.school)+'"></label>'+
  '<label class="field"><span class="lbl">الفئة المستهدفة</span><input class="input" name="grade" value="'+esc(c.grade)+'" placeholder="مثال: طالبات الصف العاشر"></label>'+
  '<label class="field"><span class="lbl">عدد الطالبات المستهدفات</span><input class="input" name="classSize" type="number" min="0" inputmode="numeric" value="'+(+c.classSize||'')+'"><span class="hint">لحساب نسبة المشاركة (الهدف 85٪ إلى 95٪).</span></label></div>'+
  '<label class="field"><span class="lbl">الصفوف والشعب (اختياري، يفصل بينها فاصلة)</span><input class="input" name="classes" value="'+esc((c.classes||[]).join('، '))+'" placeholder="مثال: العاشر/1، العاشر/2"><span class="hint">إن كتبتِها تختار الطالبة صفها من قائمة.</span></label>'+
  '<label class="field"><span class="lbl">عبارة بطاقة الشكر (اختياري)</span><textarea class="textarea" name="cardMsg" style="min-height:70px" placeholder="متمنّين لها دوام التألق…">'+esc(c.cardMsg)+'</textarea></label>'+
  '<div class="field"><span class="lbl">شعار المدرسة</span><div class="imgpick"><span data-lp>'+(logo?'<img src="'+esc(logo)+'" alt="" style="object-fit:contain;background:#fff">':'')+'</span><label class="btn sm line">'+I('img')+'اختيار الشعار<input type="file" accept="image/*" hidden data-logo-in></label><button type="button" class="btn sm ghost" data-nologo'+(logo?'':' hidden')+'>إزالة</button></div></div>'+
  '<div class="row end"><button class="btn gold" type="submit">'+I('check')+'حفظ البيانات</button></div></form></section>'+
  '<section class="card"><h2 class="h2">الألوان</h2><p class="sub">تُحفظ على هذا الجهاز.</p><div class="skins" style="margin-top:10px">'+SKINS.map(function(s){return '<button class="skin sk-'+s[0]+(curSkin()===s[0]?' on':'')+'" data-k="'+s[0]+'"><i></i>'+s[1]+'<small>'+s[2]+'</small></button>';}).join('')+'</div></section>'+
  '<section class="card"><h2 class="h2">المزامنة والحساب</h2><p class="sub">'+(DB.mode==='cloud'?'كل التسليمات تُحفظ في Google Firebase وتصل إلى لوحتك من أي جهاز، والطالبات لا يحتجن إلى حساب.':'لم يُربط Firebase بعد، فالبيانات محفوظة على هذا الجهاز فقط.')+'</p><div class="row" style="margin-top:12px">'+(DB.mode==='cloud'?'<button class="btn line" data-pw>'+I('lock')+'تغيير كلمة السر</button>':'')+'<button class="btn ghost" data-out>'+I('out')+'خروج المعلمة</button></div></section>');
 try{var qr=qrcode(0,'M');qr.addData(studentURL());qr.make();$('[data-qr]',m).innerHTML='<img alt="رمز QR لرابط الطالبات" src="'+qr.createDataURL(6,2)+'">';}catch(e){$('[data-qr]',m).hidden=true;}
 $('[data-copy]',m).onclick=function(){var u=$('[data-url]',m);(navigator.clipboard?navigator.clipboard.writeText(u.value):Promise.reject()).then(function(){toast('نُسخ الرابط');}).catch(function(){u.select();document.execCommand('copy');toast('نُسخ الرابط');});};
 $('[data-logo-in]',m).onchange=function(){var fl=this.files[0];if(!fl)return;fileToImg(fl,256,'image/png').then(function(u){if(u.length>300000)return fileToImg(fl,200,'image/jpeg',.85);return u;}).then(function(u){logo=u;$('[data-lp]',m).innerHTML='<img src="'+u+'" alt="" style="object-fit:contain;background:#fff">';$('[data-nologo]',m).hidden=false;}).catch(function(){toast('تعذّر قراءة الصورة');});};
 $('[data-nologo]',m).onclick=function(){logo='';$('[data-lp]',m).innerHTML='';this.hidden=true;};
 $$('.skin',m).forEach(function(b){b.onclick=function(){setSkin(b.dataset.k);};});
 $('[data-out]',m).onclick=logout;
 if($('[data-pw]',m))$('[data-pw]',m).onclick=function(){var d=dlg('تغيير كلمة السر','<label class="field"><span class="lbl">كلمة السر الجديدة</span><input class="input" type="password" dir="ltr" data-np autocomplete="new-password"></label><span class="err" data-e hidden></span>','<button class="btn gold" data-ok>حفظ</button>');
  $('[data-ok]',d).onclick=function(){var v=$('[data-np]',d).value,er=$('[data-e]',d);if(v.length<6){er.hidden=false;er.textContent='6 أحرف على الأقل.';return;}
   firebase.auth().currentUser.updatePassword(v).then(function(){d.closeDlg();toast('تغيّرت كلمة السر');}).catch(function(e){er.hidden=false;er.textContent=/recent/.test(e&&e.code||'')?'لأمانك: اخرجي وادخلي من جديد ثم غيّريها.':'تعذّر التغيير.';});};};
 $('[data-f]',m).onsubmit=function(e){e.preventDefault();var f=this,o={title:f.title.value.trim()||DEF.title,subject:f.subject.value.trim(),teacher:f.teacher.value.trim(),school:f.school.value.trim(),grade:f.grade.value.trim(),classSize:Math.max(0,parseInt(f.classSize.value,10)||0),
   classes:f.classes.value.split(/[،,؛;\n]+/).map(function(s){return s.trim();}).filter(Boolean),cardMsg:f.cardMsg.value.trim(),logo:logo};
  var bt=$('button[type=submit]',f);bt.disabled=true;DB.saveCfg(o).then(function(){mergeCfg(Object.assign({},G.cfg,o));bt.disabled=false;toast('حُفظت البيانات');}).catch(function(x){console.error(x);bt.disabled=false;toast('تعذّر الحفظ');});};
 });}
function logout(){DB.logout().then(function(){toast('خرجتِ من لوحة المعلمة');location.hash='#/';brand();route();});}

/* ---------- التثبيت ---------- */
var deferred=null;
function standalone(){return (window.matchMedia&&matchMedia('(display-mode: standalone)').matches)||navigator.standalone;}
function installUI(){var b=$('[data-install]');if(!b)return;b.hidden=!!standalone();b.onclick=function(){
 if(deferred){deferred.prompt();deferred.userChoice.then(function(){deferred=null;});return;}
 var ios=/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
 dlg('تثبيت المنصة على جهازك',ios?'<ol style="margin:0;padding-inline-start:20px;line-height:2.1"><li>افتحي المنصة في متصفح <b>Safari</b>.</li><li>اضغطي زر المشاركة <b>⬆︎</b> أسفل الشاشة.</li><li>اختاري <b>«إضافة إلى الشاشة الرئيسية»</b> ثم «إضافة».</li></ol>':'<ol style="margin:0;padding-inline-start:20px;line-height:2.1"><li>افتحي قائمة المتصفح <b>⋮</b>.</li><li>اختاري <b>«تثبيت التطبيق»</b> أو «إضافة إلى الشاشة الرئيسية».</li></ol>',false);};}
addEventListener('beforeinstallprompt',function(e){e.preventDefault();deferred=e;installUI();});

/* ---------- التشغيل ---------- */
function boot(){applySkin(curSkin());fxInit();shell();installUI();
 document.addEventListener('click',function(e){var t=e.target.closest('[data-skinnext]');if(t){var i=SKINS.map(function(s){return s[0];}).indexOf(curSkin());var k=SKINS[(i+1)%SKINS.length];setSkin(k[0]);toast('الألوان: '+k[1]);}if(e.target.closest('[data-logout]'))logout();});
 addEventListener('hashchange',route);
 DB.ready().then(function(){return DB.cfg().then(mergeCfg).catch(function(){});}).then(function(){splash();route();});
 if('serviceWorker' in navigator&&location.protocol!=='file:')navigator.serviceWorker.register('sw.js').catch(function(){});}
window.NAJM={grade:grade,norm:norm,drawCard:drawCard};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
