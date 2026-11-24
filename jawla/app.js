/* جولة رحيق الأثر · المحرك: بوابة ← ممر ثلاثي الأبعاد (CSS 3D) ← قاعات أفقية ← عارض تكبير. بلا مكتبات. */
(function(){
'use strict';
var D=window.JAWLA,A=window.ART,S=D.SCHOOL,ROOMS=D.ROOMS,VISION=D.VISION,ORDER=ROOMS.concat([VISION]);
var $=function(s,r){return(r||document).querySelector(s);},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));};
var esc=A.esc,ic=A.icon;
var AR=function(n){return String(n).replace(/\d/g,function(d){return'٠١٢٣٤٥٦٧٨٩'[d];});};
var N=ROOMS.length/2,W=1000,H=640,B=780,EYE=36,ENDZ=-(N+1)*B,START=B*.72;
var view=$('#view'),world=$('#world'),gate=$('#gate'),top=$('#top'),hud=$('#hud'),roomEl=$('#room'),viewer=$('#viewer'),indexEl=$('#index'),flashEl=$('#flash'),toastEl=$('#toast');
var cam={x:0,y:EYE,z:START+520,yaw:0,ly:0,lp:0},P=800,mode='gate',busy=false,stop=0,cur=null,tw=0,tid=0,bays=[];
var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
/* الوضع الخفيف للهواتف والأجهزة اللوحية: دقة أقل للأسطح الثلاثية الأبعاد وإخفاء البعيد منها، حتى لا تمتلئ ذاكرة المتصفح */
var lite=matchMedia('(pointer:coarse)').matches||Math.min(screen.width,screen.height)<=600,Q=lite?.5:1;if(lite)document.documentElement.classList.add('lite');
function wait(ms){return new Promise(function(r){setTimeout(r,reduce?Math.min(ms,60):ms);});}
var io=function(p){return p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2;},easeIn=function(p){return p*p*p;},easeOut=function(p){return 1-Math.pow(1-p,3);};

/* ================= الصوت: خطوات وباب (ضجيج مرشّح، بلا نغمات) ================= */
var AC=null,sndOn=true;try{sndOn=localStorage.getItem('jawla:snd')!=='0';}catch(e){}
function ac(){if(!sndOn)return null;try{if(!AC)AC=new(window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();}catch(e){AC=null;}return AC;}
function noise(dur,f0,f1,vol,type){var c=ac();if(!c)return;try{var n=Math.floor(c.sampleRate*dur),buf=c.createBuffer(1,n,c.sampleRate),d=buf.getChannelData(0);for(var i=0;i<n;i++)d[i]=Math.random()*2-1;
  var s=c.createBufferSource();s.buffer=buf;var fl=c.createBiquadFilter();fl.type=type||'lowpass';fl.frequency.setValueAtTime(f0,c.currentTime);fl.frequency.exponentialRampToValueAtTime(Math.max(40,f1),c.currentTime+dur);fl.Q.value=1.4;
  var g=c.createGain();g.gain.setValueAtTime(0.0001,c.currentTime);g.gain.exponentialRampToValueAtTime(vol,c.currentTime+0.012);g.gain.exponentialRampToValueAtTime(0.0001,c.currentTime+dur);s.connect(fl);fl.connect(g);g.connect(c.destination);s.start();}catch(e){}}
var snd={step:function(){noise(.11,210+Math.random()*70,90,.16);},door:function(){noise(.8,420,140,.07,'bandpass');setTimeout(function(){noise(.16,150,60,.2);},640);},tap:function(){noise(.05,900,400,.06,'bandpass');}};

/* ================= رسم الجدران ================= */
var gid=0;
function arch(x1,x2,yTop,ySp,yB){var cx=(x1+x2)/2,c=yTop+(ySp-yTop)*.22;return'M'+x1+' '+yB+' V'+ySp+' Q'+x1+' '+c+' '+cx+' '+yTop+' Q'+x2+' '+c+' '+x2+' '+ySp+' V'+yB+'Z';}
function nest(svg,x,y,w,h){return svg.replace('<svg ','<svg x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" ');}
function wallBase(w){var id='w'+(++gid);
  var s='<defs><pattern id="'+id+'d" width="52" height="52" patternUnits="userSpaceOnUse"><path d="M26 6l20 20-20 20-20-20z" fill="none" style="stroke:var(--trim)" stroke-opacity=".45" stroke-width="2"/><circle cx="26" cy="26" r="4" style="fill:var(--trim)" fill-opacity=".5"/></pattern>'+
    '<radialGradient id="'+id+'g"><stop offset="0" stop-color="#FFD98A" stop-opacity=".85"/><stop offset=".45" stop-color="#F6A94A" stop-opacity=".28"/><stop offset="1" stop-color="#F6A94A" stop-opacity="0"/></radialGradient>'+
    '<linearGradient id="'+id+'s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF6D8" stop-opacity=".5"/><stop offset="1" stop-color="#FFF6D8" stop-opacity="0"/></linearGradient></defs>';
  s+='<rect width="'+w+'" height="640" style="fill:var(--wall)"/>';
  s+='<g class="beam"><path d="M'+(w*.08)+' 0 L'+(w*.3)+' 0 L'+(w*.62)+' 640 L'+(w*.22)+' 640Z" fill="url(#'+id+'s)"/><path d="M'+(w*.52)+' 0 L'+(w*.66)+' 0 L'+(w*1.02)+' 640 L'+(w*.8)+' 640Z" fill="url(#'+id+'s)" opacity=".7"/></g>';
  s+='<rect width="'+w+'" height="34" style="fill:var(--trim2)"/>';
  for(var x=0;x<w;x+=40)s+='<path d="M'+x+' 34 l20 22 l20 -22z" style="fill:var(--trim2)"/>';
  s+='<rect y="30" width="'+w+'" height="4" style="fill:var(--trim)"/>';
  s+='<rect y="500" width="'+w+'" height="140" style="fill:var(--wall2)"/><rect y="500" width="'+w+'" height="140" fill="url(#'+id+'d)"/><rect y="496" width="'+w+'" height="6" style="fill:var(--trim)"/><rect y="626" width="'+w+'" height="14" style="fill:var(--wood2)"/>';
  return{s:s,id:id};}
function lantern(x,y,id,cls){return'<circle class="lamp '+(cls||'')+'" cx="'+x+'" cy="'+(y+22)+'" r="170" fill="url(#'+id+'g)"/><g transform="translate('+x+' '+y+')"><path d="M-26 -40 h14 q14 0 14 14" fill="none" style="stroke:var(--wood2)" stroke-width="5"/><path d="M0 -26 v10" style="stroke:var(--brass)" stroke-width="3"/><path d="M-14 -16 h28 l-5 -9 h-18z M-16 44 h32 l-6 10 h-20z" style="fill:var(--brass)"/><rect x="-14" y="-16" width="28" height="60" rx="3" fill="#FFE2A0" fill-opacity=".92"/><path d="M-14 -16 v60 M14 -16 v60 M0 -16 v60 M-14 14 h28" style="stroke:var(--brass)" stroke-width="2.5" fill="none"/><ellipse cy="16" rx="5" ry="10" fill="#FFF6D8"/></g>';}
function teaser(room,i,x,y){var arts=room.panels.filter(function(p){return p.t==='art';});var p=arts[i],w=132,h=100;
  var o='<rect x="'+(x-8)+'" y="'+(y-8)+'" width="'+(w+16)+'" height="'+(h+16)+'" rx="3" style="fill:var(--brass)"/><rect x="'+(x-3)+'" y="'+(y-3)+'" width="'+(w+6)+'" height="'+(h+6)+'" fill="#3E2514"/>';
  if(p)o+=nest(A.make(p.art[0],p.art[1],p.art[2]),x,y,w,h);
  else o+='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+room.wall+'"/><circle cx="'+(x+w/2)+'" cy="'+(y+h/2)+'" r="34" fill="'+room.color+'"/><g transform="translate('+(x+w/2)+' '+(y+h/2)+') scale(2)" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+(A.ICON[i?'star':room.icon]||A.ICON.star)+'</g>';
  return o;}
function door(room,x1,x2,yTop,ySp,id,big){var cx=(x1+x2)/2,pad=big?30:24,o='';
  o+='<path d="'+arch(x1-pad,x2+pad,yTop-pad-8,ySp,640)+'" style="fill:var(--trim2)"/><path d="'+arch(x1-pad+9,x2+pad-9,yTop-pad+4,ySp,640)+'" fill="none" style="stroke:var(--trim)" stroke-width="3" stroke-dasharray="2 12" stroke-linecap="round"/>';
  o+='<clipPath id="'+id+'c"><path d="'+arch(x1,x2,yTop,ySp,640)+'"/></clipPath><linearGradient id="'+id+'r" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF4D2"/><stop offset=".5" stop-color="'+room.color+'"/><stop offset="1" stop-color="'+room.wall+'"/></linearGradient>';
  o+='<g class="dg" data-door="'+room.id+'"><path class="hit" data-room="'+room.id+'" d="'+arch(x1,x2,yTop,ySp,640)+'" fill="'+room.wall+'"/>';
  o+='<g class="leafs" clip-path="url(#'+id+'c)" pointer-events="none"><rect x="'+x1+'" y="'+yTop+'" width="'+(x2-x1)+'" height="'+(640-yTop)+'" fill="url(#'+id+'r)"/><path d="M'+cx+' '+(yTop+40)+' L'+(x1+20)+' 640 H'+(x2-20)+'Z" fill="#fff" opacity=".28"/>';
  ['l','r'].forEach(function(sd){var a=sd==='l'?x1:cx,b=sd==='l'?cx:x2,hx=sd==='l'?x1:x2,w=b-a;
    o+='<g class="leaf '+sd+'" style="transform-origin:'+hx+'px 400px"><rect x="'+a+'" y="'+(yTop-10)+'" width="'+w+'" height="'+(660-yTop)+'" style="fill:var(--wood)"/>';
    for(var i=1;i<4;i++)o+='<path d="M'+(a+w*i/4)+' '+yTop+' V640" style="stroke:var(--wood2)" stroke-width="2.5"/>';
    for(var r=0;r<5;r++)for(var c=0;c<4;c++)o+='<circle cx="'+(a+w*(c+.5)/4)+'" cy="'+(ySp+18+r*((640-ySp-40)/4))+'" r="'+(big?6:5)+'" style="fill:var(--brass)"/>';
    o+='<rect x="'+(sd==='l'?b-9:a)+'" y="'+yTop+'" width="9" height="'+(640-yTop)+'" style="fill:var(--wood2)"/><circle cx="'+(sd==='l'?b-24:a+24)+'" cy="'+(ySp+150)+'" r="10" fill="none" style="stroke:var(--brass)" stroke-width="4"/></g>';});
  o+='</g></g>';
  var pw=big===true?400:330,py=big?30:44;
  o+='<rect x="'+(cx-pw/2)+'" y="'+py+'" width="'+pw+'" height="'+(big?66:58)+'" rx="14" fill="'+room.color+'" style="stroke:var(--brass)" stroke-width="3"/><rect x="'+(cx-pw/2+7)+'" y="'+(py+7)+'" width="'+(pw-14)+'" height="'+(big?52:44)+'" rx="9" fill="none" stroke="#fff" stroke-opacity=".4"/>';
  o+='<text x="'+cx+'" y="'+(py+(big?46:40))+'" text-anchor="middle" font-family="\'Reem Kufi\',Cairo,sans-serif" font-weight="700" font-size="'+(big?36:(room.name.length>16?25:30))+'" fill="#fff">'+esc(room.name)+'</text>';
  return o;}
function wallRoom(room){var b=wallBase(B),s=b.s;
  s+='<rect x="0" width="20" height="640" style="fill:var(--wallhi)"/><rect x="'+(B-20)+'" width="20" height="640" style="fill:var(--wallhi)"/><rect x="20" width="3" height="640" fill="#000" opacity=".12"/><rect x="'+(B-23)+'" width="3" height="640" fill="#000" opacity=".12"/>';
  s+=lantern(112,230,b.id,'')+lantern(B-112,230,b.id,'b');
  s+=teaser(room,0,46,340)+teaser(room,1,B-46-132,340);
  s+=door(room,B/2-125,B/2+125,150,292,b.id,false);
  return'<svg viewBox="0 0 '+B+' 640" preserveAspectRatio="none">'+s+'</svg>';}
function wallWelcome(left){var b=wallBase(B),s=b.s;
  s+=lantern(90,230,b.id,'')+lantern(B-90,230,b.id,'b');
  if(left){s+='<rect x="170" y="110" width="440" height="330" rx="10" style="fill:var(--wallhi);stroke:var(--trim)" stroke-width="4"/><rect x="182" y="122" width="416" height="306" rx="6" fill="none" style="stroke:var(--trim)" stroke-dasharray="3 9"/>';
    s+='<text x="390" y="200" text-anchor="middle" font-family="\'Reem Kufi\',sans-serif" font-size="34" style="fill:var(--trim)">أهلًا بكم في</text><text x="390" y="282" text-anchor="middle" font-family="\'Reem Kufi\',sans-serif" font-weight="700" font-size="68" style="fill:var(--wood)">'+esc(S.name)+'</text>';
    s+='<text x="390" y="340" text-anchor="middle" font-family="Cairo,sans-serif" font-weight="700" font-size="22" style="fill:var(--wood2)">جولة افتراضية · '+esc(S.year)+'</text><path d="M300 372 h180" style="stroke:var(--trim)" stroke-width="3"/><text x="390" y="408" text-anchor="middle" font-family="Cairo,sans-serif" font-size="17" style="fill:var(--wood2)">منصة '+esc(S.product)+'</text>';}
  else{s+='<rect x="130" y="96" width="520" height="360" rx="10" fill="#14303F" style="stroke:var(--brass)" stroke-width="5"/><text x="390" y="142" text-anchor="middle" font-family="\'Reem Kufi\',sans-serif" font-weight="700" font-size="28" fill="#F6E7C8">دليل القاعات</text>';
    ROOMS.forEach(function(r,i){var col=i%2,row=Math.floor(i/2),x=col?372:612,y=186+row*42;s+='<circle cx="'+x+'" cy="'+(y-7)+'" r="9" fill="'+r.color+'"/><text x="'+(x-20)+'" y="'+y+'" text-anchor="start" direction="rtl" font-family="Cairo,sans-serif" font-weight="700" font-size="19" fill="#F4EEDF">'+esc(r.name)+'</text>';});}
  return'<svg viewBox="0 0 '+B+' 640" preserveAspectRatio="none">'+s+'</svg>';}
function wallPlain(){var b=wallBase(B),s=b.s;s+=lantern(B*.28,230,b.id,'')+lantern(B*.72,230,b.id,'b');return'<svg viewBox="0 0 '+B+' 640" preserveAspectRatio="none">'+s+'</svg>';}
function wallEnd(){var b=wallBase(W),s=b.s;
  var wide=W>800,dw=wide?170:150,lx=wide?150:54,px=wide?250:70;s+=lantern(lx,250,b.id,'')+lantern(W-lx,250,b.id,'b');
  if(wide)s+='<g transform="translate('+px+' 626)"><path d="M-34 0 l8 -46 h52 l8 46z" style="fill:var(--trim2)"/></g><g transform="translate('+(W-px)+' 626)"><path d="M-34 0 l8 -46 h52 l8 46z" style="fill:var(--trim2)"/></g>'+A.palm(px,582,1.5,'#3F7F4A','#6B4A2B')+A.palm(W-px,582,1.5,'#2F6B3B','#6B4A2B');
  s+=door(VISION,W/2-dw,W/2+dw,150,310,b.id,wide?true:'mid');
  return'<svg viewBox="0 0 '+W+' 640" preserveAspectRatio="none">'+s+'</svg>';}

/* ================= بناء العالم ================= */
function zc(k){return-(k+.5)*B;}
var planes=[];
function pl(cls,w,h,tf,html,k,O,U,V){var e=document.createElement('div');
  if(Q<1){e.className='pl';e.style.cssText='width:'+(w*Q)+'px;height:'+(h*Q)+'px;margin:'+(-h*Q/2)+'px 0 0 '+(-w*Q/2)+'px;transform:'+tf+' scale('+(1/Q)+')';e.innerHTML='<div class="'+cls+'" style="position:absolute;left:0;top:0;width:'+w+'px;height:'+h+'px;transform:scale('+Q+');transform-origin:0 0">'+(html||'')+'</div>';}
  else{e.className='pl '+cls;e.style.cssText='width:'+w+'px;height:'+h+'px;margin:'+(-h/2)+'px 0 0 '+(-w/2)+'px;transform:'+tf;e.innerHTML=html||'';}
  world.appendChild(e);(bays[k+1]=bays[k+1]||[]).push(e);planes.push({e:e,w:w,h:h,O:O,U:U,V:V,c:''});return e;}
function build(){world.innerHTML='';bays=[];planes=[];gid=0;
  for(var k=-1;k<=N;k++){var z=zc(k);
    pl('floor',W,B,'translate3d(0,'+(H/2)+'px,'+z+'px) rotateX(90deg)','<i></i>',k,[0,H/2,z],[1,0,0],[0,0,1]);
    pl('ceil',W,B,'translate3d(0,'+(-H/2)+'px,'+z+'px) rotateX(-90deg)','',k,[0,-H/2,z],[1,0,0],[0,0,-1]);
    var L=k<0?wallPlain():k?wallRoom(ROOMS[(k-1)*2]):wallWelcome(true),R=k<0?wallPlain():k?wallRoom(ROOMS[(k-1)*2+1]):wallWelcome(false);
    pl('wall',B,H,'translate3d('+(-W/2)+'px,0,'+z+'px) rotateY(90deg)',L,k,[-W/2,0,z],[0,0,-1],[0,1,0]);
    pl('wall',B,H,'translate3d('+(W/2)+'px,0,'+z+'px) rotateY(-90deg)',R,k,[W/2,0,z],[0,0,1],[0,1,0]);}
  pl('wall end',W,H,'translate3d(0,0,'+ENDZ+'px)',wallEnd(),N,[0,0,ENDZ],[1,0,0],[0,1,0]);}
/* إخفاء الأسطح التي صارت كلها خلف الكاميرا (أخف على الجوال من رسمها) */
function clipAll(){var a=(cam.yaw+cam.ly)*Math.PI/180,Fx=Math.sin(a),Fz=-Math.cos(a);
  for(var i=0;i<planes.length;i++){var p=planes[i],d0=(p.O[0]-cam.x)*Fx+(p.O[2]-cam.z)*Fz,ca=Math.abs(p.U[0]*Fx+p.U[2]*Fz)*p.w/2,cb=Math.abs(p.V[0]*Fx+p.V[2]*Fz)*p.h/2,c=d0+ca+cb<20?'hide':'show';
    if(c!==p.c){p.c=c;p.e.style.visibility=c==='hide'?'hidden':'visible';}}}
function apply(){world.style.transform='translateZ('+P+'px) rotateX('+cam.lp.toFixed(3)+'deg) rotateY('+(cam.yaw+cam.ly).toFixed(3)+'deg) translate3d('+(-cam.x).toFixed(1)+'px,'+(-cam.y).toFixed(1)+'px,'+(-cam.z).toFixed(1)+'px)';clipAll();}
var lastFogZ=1e9;
function fog(force){if(!force&&Math.abs(cam.z-lastFogZ)<40)return;lastFogZ=cam.z;
  for(var k=0;k<bays.length;k++){var d=cam.z-zc(k-1),f=lite?Math.max(0,Math.min(1,(d-B*.9)/(B*2.2))):Math.max(0,Math.min(.8,(d-B*1.1)/(B*4.2))),off=lite&&(d<-B*1.6||d>B*3.3);
    for(var i=0;i<bays[k].length;i++){var e=bays[k][i];e.style.setProperty('--fg',f.toFixed(2));if(lite&&e._off!==off){e._off=off;e.style.display=off?'none':'';}}}}
function resize(){var vw=innerWidth,vh=innerHeight,nw=vw<vh*.8?620:1000;P=Math.max(360,Math.min(vw*1.08,vh,900));view.style.perspective=P+'px';if(nw!==W&&!busy){W=nw;build();fog(true);if(mode!=='gate')hudUpdate();}apply();}
function tween(props,dur,ease,onStep){if(reduce)dur=Math.min(dur,80);return new Promise(function(res){var from={},k;for(k in props)from[k]=cam[k];var t0=performance.now(),id=++tw;
  function f(t){if(id!==tw){res(false);return;}var p=Math.min(1,Math.max(0,(t-t0)/dur)),e=(ease||io)(p);for(k in props)cam[k]=from[k]+(props[k]-from[k])*e;if(onStep)onStep(p);apply();fog();if(p<1)requestAnimationFrame(f);else res(true);}
  requestAnimationFrame(f);});}
function walkTo(z,fast){var dz=Math.abs(z-cam.z);if(dz<4)return Promise.resolve(true);var steps=Math.max(1,Math.round(dz/250)),dur=Math.max(650,Math.min(fast?2600:4200,dz*(fast?.9:1.35))),last=-1;
  return tween({z:z,x:0,yaw:0},dur,io,function(p){var e=io(p),ph=e*steps;cam.y=EYE+Math.sin(ph*Math.PI*2)*5*Math.sin(p*Math.PI);var n=Math.floor(ph*2);if(n!==last){last=n;snd.step();}}).then(function(r){cam.y=EYE;apply();return r;});}

/* ================= التجوال في الممر ================= */
function stopZ(k){return k<=0?START:k>N?ENDZ+760:-(k-.42)*B;}
function roomsAt(k){return k>=1&&k<=N?[ROOMS[(k-1)*2],ROOMS[(k-1)*2+1]]:k>N?[VISION,null]:[null,null];}
function locate(room){if(room===VISION)return{k:N+1,side:0};var i=ROOMS.indexOf(room);return{k:Math.floor(i/2)+1,side:i%2?1:-1};}
function dbtn(el,room,sideTxt){if(!room){el.classList.add('hide');el.innerHTML='';el.removeAttribute('data-room');return;}el.classList.remove('hide');el.style.setProperty('--c',room.color);el.setAttribute('data-room',room.id);
  el.innerHTML='<span class="ic">'+ic(room.icon,22)+'</span><span><small>'+sideTxt+'</small><b>'+esc(room.name)+'</b></span>';}
function hudUpdate(){var r=roomsAt(stop);
  $('#hWhere').textContent=stop===0?'مدخل المدرسة':stop>N?'صدر الممر':'الممر الرئيسي · المحطة '+AR(stop)+' من '+AR(N);
  $('#hTitle').textContent=stop===0?'تقدّم لتبدأ الجولة':stop>N?'القاعة الكبرى أمامك':'اختر أحد البابين أو واصل المشي';
  if(stop>N){dbtn($('#dL'),VISION,'ادخل');dbtn($('#dR'),null);}else{dbtn($('#dL'),r[0],'الباب الأيسر');dbtn($('#dR'),r[1],'الباب الأيمن');}
  $$('.dg',world).forEach(function(g){var id=g.getAttribute('data-door');g.classList.toggle('near',!!(r[0]&&r[0].id===id)||!!(r[1]&&r[1].id===id));});
  var me=$('#plan .me');if(me){var x=stop===0?530:stop>N?52:500-(stop-1)*((500-104)/(N-1));me.style.transform='translateX('+x+'px)';}
  $('[data-act=back]').style.visibility=stop===0?'hidden':'visible';$('[data-act=fwd]').style.visibility=stop>N?'hidden':'visible';}
function chrome(on){hud.classList.toggle('off',!on);top.classList.toggle('off',!on);}
async function goStop(k,fast){k=Math.max(0,Math.min(N+1,k));if(busy||mode!=='hall')return;busy=true;stop=k;hudUpdate();await walkTo(stopZ(k),fast);busy=false;}
function faceDist(){var vw=innerWidth,vh=innerHeight;return Math.max(380,Math.min(700,Math.max(270*P/(.72*vw),600*P/(.82*vh))));}
function doorEl(room){return $('.dg[data-door="'+room.id+'"]',world);}
function flash(room,on){flashEl.style.setProperty('--c',room.color);flashEl.classList.toggle('on',on);}
async function enter(room){if(busy||mode!=='hall')return false;busy=true;chrome(false);cam.ly=0;cam.lp=0;var l=locate(room),dg=doorEl(room);stop=l.k;hudUpdate();
  if(room===VISION){await walkTo(ENDZ+faceDist()+40,true);dg.classList.add('open');snd.door();await wait(700);flash(room,true);await tween({z:ENDZ+90},850,easeIn);}
  else{await walkTo(zc(l.k),true);await tween({yaw:l.side*89.6,x:l.side*(W/2-faceDist())},850,io);dg.classList.add('open');snd.door();await wait(700);flash(room,true);await tween({x:l.side*(W/2-70)},850,easeIn);}
  showRoom(room);await wait(380);if(lite)view.style.display='none';flash(room,false);busy=false;return true;}
async function exit(){if(busy||mode!=='room')return false;busy=true;closeViewer(true);var room=cur,l=locate(room),dg=doorEl(room);
  roomEl.classList.remove('in');flash(room,true);if(lite)view.style.display='';await wait(380);roomEl.hidden=true;roomEl.innerHTML='';mode='hall';cur=null;setHash('');flash(room,false);
  if(room===VISION)await tween({z:stopZ(N+1)},900,easeOut);else{await tween({x:l.side*(W/2-faceDist())},700,easeOut);dg.classList.remove('open');await tween({yaw:0,x:0,z:stopZ(l.k)},900,io);}
  dg.classList.remove('open');stop=l.k;hudUpdate();chrome(true);busy=false;return true;}
async function goRoom(room){if(busy)return;closeIndex();if(mode==='gate')await startTour(true);if(mode==='room'){if(cur===room)return;await exit();}await enter(room);}
function byId(id){for(var i=0;i<ORDER.length;i++)if(ORDER[i].id===id)return ORDER[i];return null;}
function setHash(h){try{history.replaceState(null,'',h?'#'+h:location.pathname+location.search);}catch(e){}}

/* ================= القاعة ================= */
var arrow='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>';
var arrowR='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
function hexColor(v){return v>=85?'#2E8B74':v>=70?'#C8922E':'#C7527C';}
function panel(p,i){var I='style="--i:'+(i+1)+'"';
  if(p.t==='art'){var k=p.art[0],cls=(k==='doc'||k==='poster'||k==='banner')?' pt':(k==='portrait'||k==='trophy')?' pp':'';
    return'<article class="pn pn-art" '+I+' data-art="'+i+'" tabindex="0" role="button" aria-label="'+esc(p.title)+'"><figure class="frame'+cls+'"><div class="mat">'+A.make(k,p.art[1],p.art[2])+'</div></figure><div class="label"><b>'+esc(p.title)+'</b><span>'+esc(p.meta.slice(0,2).map(function(m){return m[1];}).join(' · '))+'</span>'+(p.tag?'<em>'+esc(p.tag)+'</em>':'')+'</div></article>';}
  if(p.t==='stat')return'<article class="pn pn-stat" '+I+'><b>'+esc(p.n)+'</b><strong>'+esc(p.label)+'</strong><span>'+esc(p.sub||'')+'</span></article>';
  if(p.t==='quote')return'<article class="pn pn-quote" '+I+'><small>'+esc(p.k)+'</small><p>'+esc(p.big)+'</p></article>';
  if(p.t==='bars')return'<article class="pn" '+I+'><div class="card"><h3>'+esc(p.title)+'</h3>'+p.rows.map(function(r,j){return'<div class="brow"><span>'+esc(r[0])+'</span><span class="tr"><i style="--v:'+r[1]+'%;--j:'+j+'"></i></span><b>'+AR(r[1])+(p.unit||'')+'</b></div>';}).join('')+'</div></article>';
  if(p.t==='list')return'<article class="pn" '+I+'><div class="card"><h3>'+esc(p.title)+'</h3><ul>'+p.items.map(function(x){return'<li>'+esc(x)+'</li>';}).join('')+'</ul></div></article>';
  if(p.t==='table')return'<article class="pn" '+I+'><div class="card"><h3>'+esc(p.title)+'</h3><table><thead><tr>'+p.head.map(function(h){return'<th>'+esc(h)+'</th>';}).join('')+'</tr></thead><tbody>'+p.rows.map(function(r){return'<tr>'+r.map(function(c){return'<td>'+esc(c)+'</td>';}).join('')+'</tr>';}).join('')+'</tbody></table></div></article>';
  if(p.t==='ring')return'<article class="pn" '+I+'><div class="card" style="--c:'+p.color+'"><h3><small>'+esc(p.tag)+'</small>'+esc(p.title)+'</h3><div class="ring" style="--p:'+(p.v/100)+'"><svg viewBox="0 0 120 120"><circle class="bg" cx="60" cy="60" r="50"/><circle class="fg" cx="60" cy="60" r="50"/></svg><div><b>'+AR(p.v)+'٪</b><span>'+esc(p.sub)+'</span></div></div><ul>'+p.lines.map(function(x){return'<li>'+esc(x)+'</li>';}).join('')+'</ul></div></article>';
  if(p.t==='grade')return'<article class="pn" '+I+'><div class="card" style="--c:'+p.c+'"><h3><small>الصف</small>الصف '+esc(p.g)+'</h3><div class="gnum">'+AR(p.n)+'</div><span style="color:var(--rmut)">طالبة في ست شعب</span><div class="secs">'+p.sec.map(function(n,j){return'<div><b>'+AR(n)+'</b><small>شعبة '+AR(j+1)+'</small></div>';}).join('')+'</div></div></article>';
  if(p.t==='hex')return'<article class="pn pn-hex" '+I+'><h3>'+esc(p.title)+'</h3><div class="hexwrap"><div class="hexg">'+p.items.map(function(h,j){return'<button class="hx'+(j?'':' on')+'" data-hex="'+j+'" style="--hc:'+hexColor(h.v)+'"><span><b>'+AR(h.v)+'٪</b>'+esc(h.n)+'</span></button>';}).join('')+'</div><div class="hexinfo" id="hexinfo"></div></div></article>';
  if(p.t==='cta')return'<article class="pn pn-cta" '+I+'><h3>'+esc(p.big)+'</h3><p>'+esc(p.body)+'</p><div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center"><a class="btn p" href="'+S.wa+'" target="_blank" rel="noopener">اطلبي منصة مدرستك</a><button class="btn s" data-act="restart">أعد الجولة من البداية</button></div></article>';
  return'';}
function hexInfo(room,j){var p=room.panels.filter(function(x){return x.t==='hex';})[0];if(!p)return;var h=p.items[j],box=$('#hexinfo');if(!box)return;box.style.setProperty('--hc',hexColor(h.v));
  box.innerHTML='<b>'+AR(h.v)+'٪</b><strong>'+esc(h.n)+'</strong><p>'+esc(h.d)+'</p>';$$('.hx',roomEl).forEach(function(e,i){e.classList.toggle('on',i===j);});}
function showRoom(room){cur=room;mode='room';setHash(room.id);var idx=ORDER.indexOf(room),nx=ORDER[idx+1];
  roomEl.setAttribute('data-room',room.id);roomEl.style.setProperty('--rc',room.color);roomEl.style.setProperty('--rw',room.wall);
  var h='<div class="rm-top"><button class="gbtn" data-act="exit">'+arrowR+'<span class="tx">العودة إلى الممر</span></button><div class="ttl"><small>'+esc(room.tag)+' · '+esc(S.name)+'</small><b>'+esc(room.name)+'</b></div><button class="gbtn" data-act="index">'+ic('door',20)+'<span class="tx">كل القاعات</span></button></div>';
  h+='<div class="rm-wall" id="rmWall"><article class="pn pn-intro" style="--i:0"><span class="bigic">'+ic(room.icon,36)+'</span><h2>'+esc(room.name)+'</h2><p>'+esc(room.intro)+'</p><span class="hint">'+arrow+' تجوّل بالسحب أو بالأسهم</span></article>';
  h+=room.panels.map(panel).join('');
  if(nx)h+='<article class="pn pn-next" style="--i:'+(room.panels.length+1)+';--nc:'+nx.color+'" data-next="'+nx.id+'" tabindex="0" role="button"><div class="arch">'+ic(nx.icon,54,1.4)+'</div><small>القاعة التالية</small><b>'+esc(nx.name)+'</b></article>';
  h+='</div><div class="rm-floor"></div><div class="rm-nav"><button class="gbtn rd" data-act="pnext" aria-label="السابق">'+arrowR+'</button><div class="rm-prog"><i id="rmBar"></i></div><small id="rmCnt"></small><button class="gbtn rd" data-act="pprev" aria-label="التالي">'+arrow+'</button></div>';
  roomEl.innerHTML=h;roomEl.hidden=false;var wall=$('#rmWall');wall.scrollLeft=0;hexInfo(room,0);
  wall.addEventListener('scroll',progress,{passive:true});
  wall.addEventListener('wheel',function(e){if(Math.abs(e.deltaY)>Math.abs(e.deltaX)){wall.scrollLeft-=e.deltaY;e.preventDefault();}},{passive:false});
  void roomEl.offsetWidth;roomEl.classList.add('in');progress();}
function progress(){var wall=$('#rmWall');if(!wall)return;var max=wall.scrollWidth-wall.clientWidth,p=max>0?Math.min(1,Math.abs(wall.scrollLeft)/max):1;$('#rmBar').style.width=(p*100).toFixed(1)+'%';
  var n=$$('.pn',wall).length,c=Math.min(n,Math.round(p*(n-1))+1);$('#rmCnt').textContent=AR(c)+' / '+AR(n);}
function pan(dir){var wall=$('#rmWall');if(!wall)return;var pns=$$('.pn',wall),mid=wall.getBoundingClientRect().left+wall.clientWidth/2,best=0,bd=1e9;
  pns.forEach(function(e,i){var r=e.getBoundingClientRect(),d=Math.abs(r.left+r.width/2-mid);if(d<bd){bd=d;best=i;}});
  var t=pns[Math.max(0,Math.min(pns.length-1,best+dir))];if(t)t.scrollIntoView({behavior:reduce?'auto':'smooth',inline:'center',block:'nearest'});}

/* ================= العارض ================= */
var vz={s:1,x:0,y:0,i:-1},pts={},pinch=0;
function arts(){return cur?cur.panels.map(function(p,i){return p.t==='art'?i:-1;}).filter(function(i){return i>=0;}):[];}
function vApply(el){(el||$('.vw-art',viewer)).style.transform='translate('+vz.x.toFixed(1)+'px,'+vz.y.toFixed(1)+'px) scale('+vz.s.toFixed(3)+')';}
function openViewer(i,from){if(!cur)return;var p=cur.panels[i];if(!p||p.t!=='art')return;vz={s:1,x:0,y:0,i:i};snd.tap();
  var svg=A.make(p.art[0],p.art[1],p.art[2]),m=/viewBox="0 0 (\d+) (\d+)"/.exec(svg),ar=m?(+m[1]/+m[2]):1.333;
  viewer.style.setProperty('--rc',cur.color);
  viewer.innerHTML='<div class="vw-stage" id="vwStage"><div class="vw-art" style="--ar:'+ar.toFixed(4)+'">'+svg+'</div><div class="vw-hint">كبّر بالعجلة أو بإصبعين · انقر مرتين للتكبير · اسحب للتحريك</div></div>'+
   '<aside class="vw-side"><em>'+esc(p.tag||cur.name)+'</em><h3>'+esc(p.title)+'</h3><p>'+esc(p.desc)+'</p><dl>'+p.meta.map(function(mm){return'<dt>'+esc(mm[0])+'</dt><dd>'+esc(mm[1])+'</dd>';}).join('')+'</dl></aside>'+
   '<div class="vw-bar"><div class="grp"><button class="vb" data-v="close" aria-label="إغلاق"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button><button class="vb" data-v="in" aria-label="تكبير"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></button><button class="vb" data-v="out" aria-label="تصغير"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 12h14"/></svg></button></div><div class="grp"><button class="vb" data-v="prev" aria-label="السابق">'+arrowR+'</button><button class="vb" data-v="next" aria-label="التالي">'+arrow+'</button></div></div>';
  viewer.hidden=false;var art=$('.vw-art',viewer);
  if(from&&!reduce){var a=art.getBoundingClientRect(),b=from.getBoundingClientRect(),sc=Math.max(b.width/a.width,b.height/a.height);
    art.style.transform='translate('+(b.left+b.width/2-a.left-a.width/2)+'px,'+(b.top+b.height/2-a.top-a.height/2)+'px) scale('+sc+')';void art.offsetWidth;art.classList.add('fl');art.style.transform='';setTimeout(function(){art.classList.remove('fl');},750);}
  void viewer.offsetWidth;viewer.classList.add('in');stageEvents($('#vwStage'));}
function closeViewer(now){if(viewer.hidden)return;viewer.classList.remove('in');var f=function(){viewer.hidden=true;viewer.innerHTML='';};if(now)f();else setTimeout(f,400);}
function vStep(d){var a=arts(),k=a.indexOf(vz.i),n=a[(k+d+a.length)%a.length];openViewer(n,null);}
function vZoom(f,cx,cy){var st=$('#vwStage');if(!st)return;var r=st.getBoundingClientRect();cx=cx==null?r.width/2:cx-r.left;cy=cy==null?r.height/2:cy-r.top;var ox=cx-r.width/2,oy=cy-r.height/2,ns=Math.max(1,Math.min(6,vz.s*f)),k=ns/vz.s;
  vz.x=ox-(ox-vz.x)*k;vz.y=oy-(oy-vz.y)*k;vz.s=ns;if(ns===1){vz.x=0;vz.y=0;}vApply();}
function stageEvents(st){
  st.addEventListener('wheel',function(e){e.preventDefault();vZoom(e.deltaY<0?1.18:1/1.18,e.clientX,e.clientY);},{passive:false});
  st.addEventListener('dblclick',function(e){var art=$('.vw-art',viewer);art.classList.add('fl');if(vz.s>1.2){vz.s=1;vz.x=0;vz.y=0;vApply();}else vZoom(2.6,e.clientX,e.clientY);setTimeout(function(){art.classList.remove('fl');},720);});
  st.addEventListener('pointerdown',function(e){st.setPointerCapture(e.pointerId);pts[e.pointerId]={x:e.clientX,y:e.clientY};pinch=0;});
  st.addEventListener('pointermove',function(e){var p=pts[e.pointerId];if(!p)return;var ids=Object.keys(pts);
    if(ids.length===1){vz.x+=e.clientX-p.x;vz.y+=e.clientY-p.y;if(vz.s===1){vz.x*=.5;vz.y*=.5;}vApply();}
    p.x=e.clientX;p.y=e.clientY;
    if(ids.length===2){var a=pts[ids[0]],b=pts[ids[1]],d=Math.hypot(a.x-b.x,a.y-b.y);if(pinch)vZoom(d/pinch,(a.x+b.x)/2,(a.y+b.y)/2);pinch=d;}});
  var up=function(e){delete pts[e.pointerId];pinch=0;if(vz.s===1&&(vz.x||vz.y)){var art=$('.vw-art',viewer);if(!art)return;art.classList.add('fl');vz.x=0;vz.y=0;vApply();setTimeout(function(){art.classList.remove('fl');},720);}};
  st.addEventListener('pointerup',up);st.addEventListener('pointercancel',up);}

/* ================= الفهرس والمخطط ================= */
function openIndex(){var h='<div class="ix-head"><div><h2>قاعات المدرسة</h2><p>اختر قاعة وسنمشي بك إليها عبر الممر.</p></div><button class="vb" data-act="xindex" aria-label="إغلاق"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div><div class="ix-grid">';
  ORDER.forEach(function(r,i){h+='<button class="ix" data-room="'+r.id+'" style="--c:'+r.color+';--i:'+i+'"><span class="ic">'+ic(r.icon,34,1.4)+'</span><span class="no">'+esc(r.tag)+'</span><b>'+esc(r.name)+'</b><small>'+AR(r.panels.length)+' معروضات</small></button>';});
  h+='</div><div class="ix-foot"><p>عرض إعلاني لمنصة «'+esc(S.product)+'». المدرسة والأسماء والأرقام كلها افتراضية.</p><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn s" data-act="install">ثبّت التطبيق</button><a class="btn p" href="'+S.wa+'" target="_blank" rel="noopener">اطلبي منصة مدرستك</a></div></div>';
  indexEl.innerHTML=h;indexEl.hidden=false;void indexEl.offsetWidth;indexEl.classList.add('in');}
function closeIndex(){if(indexEl.hidden)return;indexEl.classList.remove('in');setTimeout(function(){indexEl.hidden=true;},300);}
function buildPlan(){var s='<svg viewBox="0 0 560 58"><path d="M40 29 H540" stroke="currentColor" stroke-opacity=".35" stroke-width="16" stroke-linecap="round"/><path d="M52 29 H530" stroke="#D9A64E" stroke-opacity=".5" stroke-width="2" stroke-dasharray="2 8" stroke-linecap="round"/>';
  for(var k=1;k<=N;k++){var x=500-(k-1)*((500-104)/(N-1)),l=ROOMS[(k-1)*2],r=ROOMS[(k-1)*2+1];
    s+='<circle class="dot" data-room="'+l.id+'" cx="'+x+'" cy="9" r="5.5" fill="'+l.color+'"><title>'+esc(l.name)+'</title></circle><circle class="dot" data-room="'+r.id+'" cx="'+x+'" cy="49" r="5.5" fill="'+r.color+'"><title>'+esc(r.name)+'</title></circle>';}
  s+='<circle class="dot" data-room="vision" cx="30" cy="29" r="7" fill="'+VISION.color+'"><title>'+esc(VISION.name)+'</title></circle><g class="me" style="transform:translateX(530px)"><circle cy="29" r="9" fill="#fff"/><circle cy="29" r="5" fill="#D9A64E"/></g></svg>';
  $('#plan').innerHTML=s;$('#plan').style.color='var(--uifg)';}

/* ================= البوابة ================= */
function gateSVG(){var r=A.rng(77),s='<style>:root{--gm1:#22324F;--gm2:#1A2740;--gm3:#131D31;--gland:#1B2433;--gwall:#8C7350;--gwall2:#75603F;--gwall3:#5F4D32;--gpath:#6B5A45;--gb:.55}[data-mode=day]{--gm1:#C9B79A;--gm2:#B19A78;--gm3:#97805F;--gland:#E2C792;--gwall:#F0E0BE;--gwall2:#E0CBA0;--gwall3:#C9B183;--gpath:#D2B98A;--gb:1}.gdim{filter:brightness(var(--gb))}</style>';
  s+='<defs><linearGradient id="gN" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070C1C"/><stop offset=".6" stop-color="#16264A"/><stop offset="1" stop-color="#3A4A78"/></linearGradient><linearGradient id="gD" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4E9FD1"/><stop offset=".6" stop-color="#9ED3EC"/><stop offset="1" stop-color="#F6E3B8"/></linearGradient><radialGradient id="gH"><stop offset="0" stop-color="#FFE9B0" stop-opacity=".9"/><stop offset="1" stop-color="#FFE9B0" stop-opacity="0"/></radialGradient><radialGradient id="gL"><stop offset="0" stop-color="#FFC56B" stop-opacity=".75"/><stop offset="1" stop-color="#FFC56B" stop-opacity="0"/></radialGradient><linearGradient id="gI" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF1C4"/><stop offset="1" stop-color="#F3A54B"/></linearGradient><clipPath id="gC"><path d="'+arch(700,900,512,610,742)+'"/></clipPath></defs>';
  s+='<rect class="gnight" width="1600" height="900" fill="url(#gN)"/><rect class="gday" width="1600" height="900" fill="url(#gD)"/>';
  s+='<g class="gnight">';for(var i=0;i<110;i++)s+='<circle class="twk" cx="'+(r()*1600).toFixed(0)+'" cy="'+(r()*470).toFixed(0)+'" r="'+(0.6+r()*1.7).toFixed(1)+'" fill="#fff" opacity="'+(0.4+r()*0.6).toFixed(2)+'"/>';
  s+='<circle cx="1270" cy="150" r="150" fill="url(#gH)" opacity=".5"/><circle cx="1270" cy="150" r="48" fill="#F6EED6"/><circle cx="1256" cy="138" r="9" fill="#E3D9BC"/><circle cx="1284" cy="166" r="6" fill="#E3D9BC"/></g>';
  s+='<g class="gday"><circle cx="1270" cy="170" r="190" fill="url(#gH)"/><circle cx="1270" cy="170" r="56" fill="#FFF6D2"/><g class="cloud" fill="#fff" opacity=".9"><ellipse cx="0" cy="150" rx="90" ry="26"/><ellipse cx="50" cy="132" rx="56" ry="26"/><ellipse cx="-50" cy="140" rx="44" ry="20"/></g><g class="cloud b" fill="#fff" opacity=".75"><ellipse cx="0" cy="260" rx="70" ry="20"/><ellipse cx="40" cy="246" rx="44" ry="20"/></g><path d="M360 220 q12 -12 24 0 q12 -12 24 0 M430 260 q9 -9 18 0 q9 -9 18 0 M300 280 q8 -8 16 0 q8 -8 16 0" stroke="#3A4A5A" stroke-width="3" fill="none" stroke-linecap="round"/></g>';
  function mt(base,amp,sd){var q=A.rng(sd),d='M0 '+base,x=0;while(x<1600){var st=50+q()*90;x+=st;d+=' L'+x.toFixed(0)+' '+(base-amp*(.35+q()*.65)).toFixed(0);x+=st*.7;d+=' L'+x.toFixed(0)+' '+(base-amp*q()*.4).toFixed(0);}return d+' L1600 900 L0 900Z';}
  s+='<path d="'+mt(470,210,5)+'" style="fill:var(--gm1)"/><path d="'+mt(510,150,9)+'" style="fill:var(--gm2)"/><path d="'+mt(560,90,13)+'" style="fill:var(--gm3)"/>';
  s+='<rect y="736" width="1600" height="164" style="fill:var(--gland)"/>';
  s+='<g class="gdim">'+A.palm(70,760,1.9,'#2F6B3B','#5B3F26')+A.palm(1530,770,2.1,'#3F7F4A','#5B3F26')+'</g>';
  /* السور والأبراج */
  s+='<rect x="150" y="520" width="1300" height="222" style="fill:var(--gwall)"/>';
  for(var x=150;x<1450;x+=46)s+='<path d="M'+x+' 520 v-26 h14 v-10 h6 v10 h14 v26z" style="fill:var(--gwall)"/>';
  s+='<rect x="150" y="556" width="1300" height="8" style="fill:var(--gwall2)"/><rect x="150" y="716" width="1300" height="26" style="fill:var(--gwall2)"/>';
  [330,430,530,1070,1170,1270].forEach(function(wx){s+='<path d="'+arch(wx-26,wx+26,590,616,690)+'" style="fill:var(--gwall3)"/><path class="gwin" d="'+arch(wx-19,wx+19,598,620,684)+'"/><path d="M'+wx+' 598 V684 M'+(wx-19)+' 640 H'+(wx+19)+' M'+(wx-19)+' 662 H'+(wx+19)+'" style="stroke:var(--gwall3)" stroke-width="3"/>';});
  [[150,300],[1300,1450]].forEach(function(t,ti){s+='<rect x="'+t[0]+'" y="400" width="150" height="342" style="fill:var(--gwall2)"/><rect x="'+t[0]+'" y="400" width="26" height="342" fill="#000" opacity=".08"/>';
    for(var cx=t[0];cx<t[1];cx+=30)s+='<path d="M'+cx+' 400 v-28 h9 v-10 h6 v10 h9 v28z" style="fill:var(--gwall2)"/>';
    s+='<rect x="'+t[0]+'" y="440" width="150" height="7" style="fill:var(--gwall3)"/><path class="gwin" d="'+arch(t[0]+58,t[0]+92,476,494,540)+'"/><path class="gwin" d="'+arch(t[0]+62,t[0]+88,610,624,664)+'"/>';
    if(!ti)s+='<path d="M225 372 V262" stroke="#E9E2D0" stroke-width="5"/><g class="flagw"><rect x="227" y="264" width="96" height="60" fill="#fff"/><rect x="227" y="284" width="96" height="20" fill="#C8102E"/><rect x="227" y="304" width="96" height="20" fill="#009A44"/><rect x="227" y="264" width="30" height="60" fill="#C8102E"/></g>';});
  /* مبنى البوابة */
  s+='<rect x="590" y="404" width="420" height="338" style="fill:var(--gwall)"/><rect x="590" y="404" width="420" height="338" fill="#fff" opacity=".06"/>';
  for(var gx=590;gx<1010;gx+=42)s+='<path d="M'+gx+' 404 v-30 h12 v-12 h6 v12 h12 v30z" style="fill:var(--gwall)"/>';
  s+='<rect x="590" y="492" width="420" height="8" style="fill:var(--gwall2)"/>';for(var tx=602;tx<1000;tx+=28)s+='<path d="M'+tx+' 500 l14 14 l14 -14z" style="fill:var(--gwall2)"/>';
  s+='<rect x="640" y="420" width="320" height="60" rx="12" fill="#14303F" stroke="#D9A64E" stroke-width="4"/><text x="800" y="463" text-anchor="middle" font-family="\'Reem Kufi\',Cairo,sans-serif" font-weight="700" font-size="38" fill="#F6E7C8">'+esc(S.name)+'</text>';
  s+='<path d="'+arch(672,928,480,610,742)+'" style="fill:var(--gwall3)"/><path d="'+arch(684,916,494,610,742)+'" fill="none" stroke="#D9A64E" stroke-width="3" stroke-dasharray="2 12" stroke-linecap="round"/>';
  s+='<g clip-path="url(#gC)"><rect x="700" y="500" width="200" height="244" fill="url(#gI)"/><path d="M800 540 L720 744 H880Z" fill="#fff" opacity=".4"/>';
  ['l','r'].forEach(function(sd){var a=sd==='l'?700:800,hx=sd==='l'?700:900;s+='<g class="gleaf" style="transform-origin:'+hx+'px 620px"><rect x="'+a+'" y="500" width="100" height="244" fill="#5E3A21"/>';
    for(var i=1;i<4;i++)s+='<path d="M'+(a+i*25)+' 500 V744" stroke="#3E2514" stroke-width="2"/>';for(var rr=0;rr<4;rr++)for(var c=0;c<4;c++)s+='<circle cx="'+(a+12.5+c*25)+'" cy="'+(624+rr*30)+'" r="4" fill="#E2B868"/>';
    s+='<rect x="'+(sd==='l'?793:800)+'" y="500" width="7" height="244" fill="#3E2514"/><circle cx="'+(sd==='l'?782:818)+'" cy="676" r="8" fill="none" stroke="#E2B868" stroke-width="3"/></g>';});
  s+='</g><rect x="660" y="742" width="280" height="12" style="fill:var(--gwall2)"/><rect x="640" y="754" width="320" height="12" style="fill:var(--gwall3)"/>';
  s+='<path d="M690 766 H910 L1240 900 H360Z" style="fill:var(--gpath)"/><path d="M770 766 H830 L900 900 H700Z" fill="#8E2C2F" opacity=".85"/><path d="M770 766 L700 900 M830 766 L900 900" stroke="#D9A64E" stroke-width="3"/>';
  [560,1040].forEach(function(lx){s+='<circle class="gnight" cx="'+lx+'" cy="640" r="150" fill="url(#gL)"/><rect x="'+(lx-4)+'" y="650" width="8" height="110" fill="#3E2514"/><path d="M'+(lx-13)+' 620 h26 l-4 -10 h-18z" fill="#E2B868"/><rect x="'+(lx-12)+'" y="620" width="24" height="34" rx="3" fill="#FFE2A0"/><path d="M'+(lx-12)+' 620 v34 M'+(lx+12)+' 620 v34 M'+lx+' 620 v34" stroke="#B88632" stroke-width="2"/>';});
  s+='<circle class="gnight" cx="800" cy="640" r="230" fill="url(#gL)" opacity=".55"/>';
  s+='<g class="gdim"><g class="sway">'+A.palm(430,800,2.5,'#2F6B3B','#5B3F26')+'</g><g class="sway b">'+A.palm(1180,812,2.8,'#3F7F4A','#5B3F26')+'</g><g class="sway b">'+A.palm(250,850,3.2,'#3F7F4A','#5B3F26')+'</g><g class="sway">'+A.palm(1390,860,3.3,'#2F6B3B','#5B3F26')+'</g><ellipse cx="120" cy="890" rx="190" ry="40" fill="#2F6B3B"/><ellipse cx="1500" cy="896" rx="210" ry="44" fill="#2F6B3B"/></g>';
  return'<svg class="scene" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">'+s+'</svg>';}
function buildGate(){var words=['مدرسة','<em>سَنا</em>','<em>الغد</em>'];
  gate.innerHTML=gateSVG()+'<div class="gate-photo" aria-hidden="true"></div><div class="gate-caption" aria-hidden="true">جولة في بيئة تعليمية عُمانية</div><div class="gtxt"><span class="k"><i></i>'+esc(S.product)+' · جولة افتراضية</span><h1>'+words.map(function(w,i){return'<span style="--i:'+i+'">'+w+'</span>';}).join(' ')+'</h1><p>تجوّل بين أقسام المدرسة كما تتجوّل في معرض: ممرّ وأبواب وقاعات، وكل معروضة تُكبَّر وتحكي قصتها.</p></div>'+
   '<div class="gcta"><div class="row"><button class="btn p" data-act="start">'+ic('door',22,2)+' ادخل المدرسة</button><button class="btn s" data-act="tour">'+ic('eye',22,2)+' جولة تلقائية</button></div><small>عرض إعلاني · المدرسة والبيانات افتراضية</small></div>';}
async function startTour(quick){if(mode!=='gate'||busy)return;busy=true;ac();var sc=$('.scene',gate),vw=innerWidth,vh=innerHeight,k=Math.max(vw/1600,vh/900);
  sc.style.transformOrigin=(vw/2)+'px '+(vh/2+(630-450)*k)+'px';gate.classList.add('opening');snd.door();await wait(quick?500:1100);
  sc.classList.add('zoom');sc.style.transform='scale(9)';await wait(reduce?50:1350);
  top.hidden=false;hud.hidden=false;chrome(true);gate.classList.add('gone');mode='hall';stop=0;hudUpdate();
  await tween({z:START},1700,easeOut,function(p){if(p>.2&&p<.25||p>.6&&p<.65)snd.step();});setTimeout(function(){gate.hidden=true;},900);busy=false;}
async function goHome(){if(busy)return;tid++;tourPill(false);if(mode==='room')await exit();if(mode==='hall'){await goStop(0,true);}}

/* ================= الجولة التلقائية ================= */
function tourPill(on){$$('[data-act=tour]').forEach(function(b){b.classList.toggle('on',on);});}
function toast(t){toastEl.textContent=t;toastEl.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(function(){toastEl.hidden=true;},2600);}
function autoPan(my){return new Promise(function(res){var wall=$('#rmWall');if(!wall)return res();wall.style.scrollSnapType='none';var max=wall.scrollWidth-wall.clientWidth,dur=Math.max(3500,max*3.1),t0=performance.now()+900;
  function f(t){if(my!==tid){wall.style.scrollSnapType='';return res();}var p=Math.max(0,Math.min(1,(t-t0)/dur));wall.scrollLeft=-max*(p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2);if(p<1)requestAnimationFrame(f);else{wall.style.scrollSnapType='';res();}}
  requestAnimationFrame(f);});}
async function autoTour(){if(tourOn()){tid++;tourPill(false);toast('أُوقفت الجولة التلقائية');return;}var my=++tid;tourPill(true);closeIndex();
  if(mode==='gate')await startTour();var start=cur?ORDER.indexOf(cur):0;
  for(var i=Math.max(0,start);i<ORDER.length&&my===tid;i++){if(mode==='room'&&cur!==ORDER[i])await exit();if(my!==tid)break;if(mode!=='room')await enter(ORDER[i]);if(my!==tid)break;await autoPan(my);if(my!==tid)break;await wait(1400);}
  if(my===tid){tourPill(false);toast('انتهت الجولة. تجوّل الآن بحرّيتك');}}
function tourOn(){return!!$('[data-act=tour].on');}

/* ================= الأحداث ================= */
var deferred=null;addEventListener('beforeinstallprompt',function(e){e.preventDefault();deferred=e;});
function install(){if(deferred){deferred.prompt();deferred.userChoice.then(function(){deferred=null;});return;}
  var ios=/iphone|ipad|ipod/i.test(navigator.userAgent);toast(ios?'في Safari: زر المشاركة ثم «إضافة إلى الشاشة الرئيسية»':'من قائمة المتصفح اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية»');}
function setMode(m){document.documentElement.setAttribute('data-mode',m);try{localStorage.setItem('jawla:mode',m);}catch(e){}icons();fog(true);}
function icons(){var day=document.documentElement.getAttribute('data-mode')==='day';
  $('[data-act=mode]').innerHTML=day?'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>':ic('sun',22,2);
  $('[data-act=sound]').innerHTML='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z"/>'+(sndOn?'<path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>':'<path d="M17 9l5 6M22 9l-5 6"/>')+'</svg>';
  $$('[data-ic]').forEach(function(e){e.innerHTML=ic(e.getAttribute('data-ic'),20,2);});}
document.addEventListener('click',function(e){var t=e.target,a=t.closest('[data-act]'),r;
  if(a){var act=a.getAttribute('data-act');
    if(act==='start')startTour();else if(act==='tour')autoTour();else if(act==='fwd')goStop(stop+1);else if(act==='back')goStop(stop-1);
    else if(act==='index')openIndex();else if(act==='xindex')closeIndex();else if(act==='exit')exit();else if(act==='home'){e.preventDefault();goHome();}
    else if(act==='pnext')pan(-1);else if(act==='pprev')pan(1);else if(act==='install')install();else if(act==='restart')goHome();
    else if(act==='mode')setMode(document.documentElement.getAttribute('data-mode')==='day'?'night':'day');
    else if(act==='sound'){sndOn=!sndOn;try{localStorage.setItem('jawla:snd',sndOn?'1':'0');}catch(er){}icons();if(sndOn)snd.tap();}
    return;}
  if((r=t.closest('[data-v]'))){var v=r.getAttribute('data-v');if(v==='close')closeViewer();else if(v==='in')vZoom(1.5);else if(v==='out')vZoom(1/1.5);else if(v==='prev')vStep(-1);else if(v==='next')vStep(1);return;}
  if((r=t.closest('[data-hex]'))){hexInfo(cur,+r.getAttribute('data-hex'));snd.tap();return;}
  if((r=t.closest('[data-art]'))){openViewer(+r.getAttribute('data-art'),$('.mat svg',r));return;}
  if((r=t.closest('[data-next]'))){goRoom(byId(r.getAttribute('data-next')));return;}
  if((r=t.closest('[data-room]'))){var rm=byId(r.getAttribute('data-room'));if(rm)goRoom(rm);return;}});
['pointerdown','wheel','keydown'].forEach(function(ev){addEventListener(ev,function(e){if(!tourOn())return;if(e.target&&e.target.closest&&e.target.closest('[data-act=tour]'))return;tid++;tourPill(false);toast('أُوقفت الجولة التلقائية');},{capture:true,passive:true});});
var wheelAt=0;view.addEventListener('wheel',function(e){e.preventDefault();if(mode!=='hall'||busy)return;var n=Date.now();if(n-wheelAt<350)return;wheelAt=n;if(Math.abs(e.deltaY)<8)return;goStop(stop+(e.deltaY>0?1:-1));},{passive:false});
var ts=null;view.addEventListener('pointerdown',function(e){ts={x:e.clientX,y:e.clientY,t:Date.now()};});
view.addEventListener('pointerup',function(e){if(!ts||mode!=='hall')return;var dx=e.clientX-ts.x,dy=e.clientY-ts.y;ts=null;if(Math.abs(dy)>46&&Math.abs(dy)>Math.abs(dx))goStop(stop+(dy<0?1:-1));});
var look={x:0,y:0};view.addEventListener('pointermove',function(e){if(e.pointerType==='touch')return;look.x=(e.clientX/innerWidth-.5);look.y=(e.clientY/innerHeight-.5);});
(function lookLoop(){if(mode==='hall'&&!busy&&!reduce){var tx=look.x*9,ty=-look.y*4;if(Math.abs(tx-cam.ly)>.02||Math.abs(ty-cam.lp)>.02){cam.ly+=(tx-cam.ly)*.07;cam.lp+=(ty-cam.lp)*.07;apply();}}requestAnimationFrame(lookLoop);})();
addEventListener('keydown',function(e){var k=e.key;
  if(!viewer.hidden){if(k==='Escape')closeViewer();else if(k==='ArrowLeft')vStep(1);else if(k==='ArrowRight')vStep(-1);else if(k==='+'||k==='=')vZoom(1.4);else if(k==='-')vZoom(1/1.4);return;}
  if(!indexEl.hidden){if(k==='Escape')closeIndex();return;}
  if(mode==='gate'){if(k==='Enter'||k===' ')startTour();return;}
  if(mode==='room'){if(k==='Escape')exit();else if(k==='ArrowLeft')pan(1);else if(k==='ArrowRight')pan(-1);else if((k==='Enter'||k===' ')&&document.activeElement&&document.activeElement.matches('.pn-art,.pn-next')){e.preventDefault();document.activeElement.click();}return;}
  if(mode==='hall'){var r=roomsAt(stop);if(k==='ArrowUp'||k==='w')goStop(stop+1);else if(k==='ArrowDown'||k==='s')goStop(stop-1);else if(k==='ArrowLeft'&&r[0])goRoom(r[0]);else if(k==='ArrowRight'&&(r[1]||stop>N))goRoom(r[1]||VISION);else if(k==='Enter'&&stop>N)goRoom(VISION);}});
addEventListener('resize',resize);

/* ================= الإقلاع ================= */
W=innerWidth<innerHeight*.8?620:1000;build();buildGate();buildPlan();icons();resize();fog(true);hudUpdate();
if('serviceWorker'in navigator&&location.protocol==='https:')navigator.serviceWorker.register('sw.js').catch(function(){});
var h0=byId((location.hash||'').slice(1));if(h0){gate.addEventListener('click',function once(){gate.removeEventListener('click',once);},{once:true});setTimeout(function(){goRoom(h0);},600);}
window.JW={goRoom:goRoom,byId:byId,cam:cam,apply:apply,state:function(){return{mode:mode,busy:busy,stop:stop,cur:cur&&cur.id};}};
})();
