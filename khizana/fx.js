/* =====================================================================
   «خزانة الأعمال» · ثيمات المنصة (مأخوذة من مرسم مزن) ومشاهدها الحيّة (المرسم، رحيق، ليالي الحارة، ليل القمر، ضحى البحر، قلعة الصباح، الشفق)
   لكل ثيم روح مستقلة: ألوانه (في app.css)، ومشهد خلفية متحرك، وتفاعل خاص عند اللمس،
   وصوت لمس غير موسيقي، وطريقة ظهور مختلفة للبطاقات.
   - english  «أكسفورد»: حروف إنجليزية تطفو، وكل لمسة تكتب كلمة بخط مائل.
   - galaxy   «المجرّة»: مجرّة ذهبية تدور وسديم وشهب، واللمسة انفجار نجمي.
   - garden   «حديقة الكلمات»: أوراق تتمايل وتتساقط، واللمسة تنثر أوراقًا وزهرًا.
   - aurora   «الشفق القطبي»: ستائر ضوء تتموّج، واللمسة تموّجات ضوء.
   - planes   «طائرات ورقية»: غيوم وطائرات ورقية بمسارات منقّطة، واللمسة تطلق طائرة.
   الرسم على لوحتين: خلفية (تحت البطاقات) وطبقة عليا شفافة للمسات حتى تُرى فوق البطاقات على الهاتف.
   ===================================================================== */
(function(){
'use strict';
var DA=window.DA,$=DA.$;
DA.SKINS=[
 ['marsam','المرسم','ورق رسم دافئ تتنفس فيه بقع ألوان مائية وتعبره ضربات فرشاة، واللمسة ترشّ بقعة ألوان','light',[1200,1700]],
 ['raheeq','رحيق','أخضر زيتي ولمسة ذهبية ونسيج سداسي ينجرف بهدوء، واللمسة تومض سداسيًا ذهبيًا','light',[1100,1600]],
 ['layali','ليالي الحارة','حارة عُمانية ليلًا تضيء نوافذ بيوتها واحدة واحدة، ونخيل وهلال ويراعات، واللمسة تطلق يراعات','dark',[1300,1900]],
 ['qamar','ليل القمر','بدر مضيء فوق جبال وبحيرة يلمع فيها ضوؤه، نجوم ودرب التبانة ويراعات، واللمسة ترسم كوكبة','dark',[1300,1900]],
 ['duha','ضُحى البحر','نهار مشمس بأشعة تدور، غيوم ومناطيد ملوّنة، بحر يلمع وسفينة شراعية ونوارس، ونخيل يتمايل، واللمسة تطلق فراشة','light',[1400,2100]],
 ['qalaa','قلعة الصباح','فجر رملي وقلعة عُمانية وطيور مهاجرة، واللمسة غبار ذهبي','light',[1200,1700]],
 ['aurora','الشفق القطبي','ستائر ضوء خضراء وبنفسجية تتموّج، واللمسة تموّجات ضوء','dark',[800,1100]]
];
var DEF='raheeq';DA.SKINS=DA.SKINS.filter(function(x){return ['raheeq','qamar','duha','layali','qalaa','aurora'].indexOf(x[0])>=0;});
function meta(k){return DA.SKINS.filter(function(x){return x[0]===k;})[0];}
DA.skin=function(){var k=DA.lsg('skin',DEF);return meta(k)?k:DEF;};
DA.applySkin=function(k){k=k||DA.skin();var m=meta(k);var h=document.documentElement;h.setAttribute('data-skin',k);h.setAttribute('data-mode',m[3]);DA.tone=m[4];
  var tc=$('meta[name=theme-color]');if(tc)tc.content=getComputedStyle(h).getPropertyValue('--tc').trim()||'#0F1B2D';FX.start(k);};
DA.setSkin=function(k){DA.lss('skin',k);DA.applySkin(k);};
DA.fxHTML=function(){return '<div class="fx" aria-hidden="true"><div class="grd"></div><div class="orb o1"></div><div class="orb o2"></div><div class="deco"></div></div>';};

var REDUCED=DA.REDUCED;
function rnd(a,b){return a+Math.random()*(b-a);}
function pick(a){return a[Math.floor(Math.random()*a.length)];}
var TAU=Math.PI*2;

var FX=DA.FX=(function(){
 var cv,x,tv,tx,W=0,H=0,D=1,raf=0,last=0,kind='',S={},taps=[],T0=0;
 function size(){D=Math.min(1.5,window.devicePixelRatio||1);W=innerWidth;H=innerHeight;[[cv,x],[tv,tx]].forEach(function(p){p[0].width=W*D;p[0].height=H*D;p[0].style.width=W+'px';p[0].style.height=H+'px';p[1].setTransform(D,0,0,D,0,0);});seed();}

 /* ============ أكسفورد: حروف تطفو ============ */
 var GLY='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz&?!'.split('');
 var WORDS=['Read','Learn','Shine','Grow','Inspire','Hello!','Dream','Explore','Create','Bravo!','Think','Well done!','Imagine','Believe'];
 var english={
  seed:function(){S.g=[];var n=Math.round(Math.min(46,W*H/26000));for(var i=0;i<n;i++)S.g.push(this.mk(true));S.lines=[];},
  mk:function(any){return {ch:pick(GLY),x:rnd(0,W),y:any?rnd(0,H):H+60,s:rnd(16,64),v:rnd(5,14),r:rnd(-.4,.4),vr:rnd(-.05,.05),a:rnd(.05,.13),it:Math.random()<.5,gold:Math.random()<.35,ph:rnd(0,TAU)};},
  frame:function(t,dt){x.clearRect(0,0,W,H);
   for(var i=0;i<S.g.length;i++){var g=S.g[i];g.y-=g.v*dt;g.r+=g.vr*dt;var sx=g.x+Math.sin(t/3000+g.ph)*12;
    if(g.y<-80){S.g[i]=this.mk(false);continue;}
    x.save();x.translate(sx,g.y);x.rotate(g.r);x.globalAlpha=g.a*(Math.min(1,(H-g.y+80)/200));x.fillStyle=g.gold?'#D9B66F':'#F3E9D6';
    x.font=(g.it?'italic ':'')+'600 '+g.s+'px "Playfair Display",Georgia,serif';x.textAlign='center';x.fillText(g.ch,0,0);x.restore();}
   x.globalAlpha=1;},
  tap:function(px,py){taps.push({k:'word',x:px,y:py,w:pick(WORDS),t:0,life:1.6});}
 };

 /* ============ المجرّة ============ */
 var galaxy={
  seed:function(){S.st=[];var n=Math.round(W*H/5200);for(var i=0;i<n;i++)S.st.push({x:Math.random()*W,y:Math.random()*H,r:rnd(.3,1.3),p:Math.random()*TAU,s:rnd(.4,1.4),g:Math.random()<.22});
   S.gp=[];var m=W<700?900:1700;for(i=0;i<m;i++){var d=Math.pow(Math.random(),.65);S.gp.push({arm:i%3,d:d,off:rnd(-.32,.32)*(1-d*.45),sz:rnd(.45,1.55)*(1.15-d*.55),h:Math.random()});}
   S.neb=[{x:.78,y:.22,r:.36,c:'120,90,200'},{x:.2,y:.55,r:.3,c:'60,150,200'},{x:.6,y:.85,r:.28,c:'200,120,80'}];S.rot=0;S.sh=null;S.next=performance.now()+4000;},
  frame:function(t,dt){S.rot+=dt*.022;x.clearRect(0,0,W,H);var i;
   for(i=0;i<S.neb.length;i++){var nb=S.neb[i],nx=nb.x*W+Math.sin(t/9000+i)*30,ny=nb.y*H+Math.cos(t/11000+i)*24,nr=nb.r*Math.max(W,H);var ng=x.createRadialGradient(nx,ny,0,nx,ny,nr);ng.addColorStop(0,'rgba('+nb.c+',.13)');ng.addColorStop(1,'rgba('+nb.c+',0)');x.fillStyle=ng;x.fillRect(0,0,W,H);}
   for(i=0;i<S.st.length;i++){var s=S.st[i];x.globalAlpha=(.35+.65*(.5+.5*Math.sin(t/1000*s.s+s.p)))*.85;x.fillStyle=s.g?'#F3D28A':'#fff';x.beginPath();x.arc(s.x,s.y,s.r,0,TAU);x.fill();}
   var X=W<900?W*.5:W*.16,Y=W<900?H*.66:H*.78,r=Math.min(W,H)*(W<700?.46:.36);
   var g=x.createRadialGradient(X,Y,0,X,Y,r*.55);g.addColorStop(0,'rgba(243,210,138,.3)');g.addColorStop(.35,'rgba(233,180,76,.1)');g.addColorStop(1,'rgba(233,180,76,0)');x.globalAlpha=1;x.fillStyle=g;x.beginPath();x.arc(X,Y,r*.55,0,TAU);x.fill();
   var ca=Math.cos(.32),sa=Math.sin(.32);
   for(i=0;i<S.gp.length;i++){var p=S.gp[i],ang=p.arm*2.094+p.d*5.2+p.off+S.rot,rr=p.d*r,qx0=Math.cos(ang)*rr,qy0=Math.sin(ang)*rr*.42;var qx=X+qx0*ca-qy0*sa,qy=Y+qx0*sa+qy0*ca;
    x.globalAlpha=Math.min(1,.25+(1-p.d)*.6);x.fillStyle=p.h<.58?'#E9B44C':(p.h<.86?'#fff':'#B9A6FF');x.fillRect(qx,qy,p.sz,p.sz);}
   if(!S.sh&&t>S.next){S.sh={x:rnd(W*.2,W*.95),y:rnd(0,H*.35),vx:-rnd(260,380),vy:rnd(110,170),l:1};S.next=t+rnd(9000,16000);}
   var sh=S.sh;if(sh){sh.x+=sh.vx*dt;sh.y+=sh.vy*dt;sh.l-=dt*.9;var gr=x.createLinearGradient(sh.x,sh.y,sh.x-sh.vx*.22,sh.y-sh.vy*.22);gr.addColorStop(0,'rgba(243,210,138,'+Math.max(0,sh.l)+')');gr.addColorStop(1,'rgba(243,210,138,0)');x.globalAlpha=1;x.strokeStyle=gr;x.lineWidth=1.3;x.beginPath();x.moveTo(sh.x,sh.y);x.lineTo(sh.x-sh.vx*.22,sh.y-sh.vy*.22);x.stroke();if(sh.l<=0)S.sh=null;}
   x.globalAlpha=1;},
  tap:function(px,py){var ps=[];for(var i=0;i<22;i++){var a=i/22*TAU+rnd(-.1,.1),v=rnd(60,190);ps.push({vx:Math.cos(a)*v,vy:Math.sin(a)*v,c:Math.random()<.6?'#F3D28A':'#fff',r:rnd(.8,2.2)});}taps.push({k:'burst',x:px,y:py,t:0,life:1.1,ps:ps});}
 };

 /* ============ حديقة الكلمات ============ */
 var LEAF=['#7C9A72','#93AE86','#A9BF97','#6E8B63','#C8B78E','#B9C9A8'];
 function leafPath(c,s){c.beginPath();c.moveTo(0,-s);c.bezierCurveTo(s*.62,-s*.55,s*.55,s*.55,0,s);c.bezierCurveTo(-s*.55,s*.55,-s*.62,-s*.55,0,-s);c.closePath();}
 function blossom(c,s){for(var i=0;i<5;i++){c.save();c.rotate(i*TAU/5);c.beginPath();c.ellipse(0,-s*.55,s*.32,s*.55,0,0,TAU);c.fill();c.restore();}}
 var garden={
  seed:function(){S.l=[];var n=Math.round(Math.min(26,W*H/52000)+6);for(var i=0;i<n;i++)S.l.push(this.mk(true));},
  mk:function(any){var bl=Math.random()<.18;return {x:rnd(0,W),y:any?rnd(-40,H):-30,s:bl?rnd(5,8):rnd(7,15),v:rnd(10,24),sw:rnd(18,46),ph:rnd(0,TAU),r:rnd(0,TAU),vr:rnd(-.6,.6),c:pick(LEAF),bl:bl,a:rnd(.32,.6)};},
  frame:function(t,dt){x.clearRect(0,0,W,H);
   for(var i=0;i<S.l.length;i++){var l=S.l[i];l.y+=l.v*dt;l.r+=l.vr*dt;var sx=l.x+Math.sin(t/2200+l.ph)*l.sw;if(l.y>H+30){S.l[i]=this.mk(false);continue;}
    x.save();x.translate(sx,l.y);x.rotate(l.r+Math.sin(t/1500+l.ph)*.4);x.globalAlpha=l.a;
    if(l.bl){x.fillStyle='#FFF8EC';blossom(x,l.s);x.fillStyle='#E6C873';x.beginPath();x.arc(0,0,l.s*.22,0,TAU);x.fill();}
    else{x.fillStyle=l.c;leafPath(x,l.s);x.fill();x.strokeStyle='rgba(255,255,255,.45)';x.lineWidth=.8;x.beginPath();x.moveTo(0,-l.s*.8);x.lineTo(0,l.s*.8);x.stroke();}
    x.restore();}
   x.globalAlpha=1;},
  tap:function(px,py){var ps=[];for(var i=0;i<10;i++){var a=rnd(-Math.PI*.95,-Math.PI*.05),v=rnd(70,170);ps.push({vx:Math.cos(a)*v,vy:Math.sin(a)*v,r:rnd(0,TAU),vr:rnd(-5,5),s:rnd(5,10),c:pick(LEAF),bl:Math.random()<.35});}taps.push({k:'leaves',x:px,y:py,t:0,life:1.5,ps:ps});}
 };

 /* ============ الشفق القطبي ============ */
 var aurora={
  seed:function(){S.st=[];var n=Math.round(W*H/9000);for(var i=0;i<n;i++)S.st.push({x:Math.random()*W,y:Math.random()*H*.75,r:rnd(.3,1.1),p:Math.random()*TAU,s:rnd(.3,1)});
   S.cur=[{y:.2,h:.34,c:'64,230,170',f:.0042,sp:.00022,amp:.07,ph:0},{y:.3,h:.28,c:'120,140,255',f:.0031,sp:-.00017,amp:.06,ph:2},{y:.14,h:.24,c:'190,120,255',f:.0055,sp:.00029,amp:.05,ph:4}];},
  frame:function(t){x.clearRect(0,0,W,H);var i;
   for(i=0;i<S.st.length;i++){var s=S.st[i];x.globalAlpha=(.3+.7*(.5+.5*Math.sin(t/1200*s.s+s.p)))*.7;x.fillStyle='#E8F4FF';x.beginPath();x.arc(s.x,s.y,s.r,0,TAU);x.fill();}
   x.globalCompositeOperation='lighter';
   for(i=0;i<S.cur.length;i++){var c=S.cur[i],step=W<700?5:7;
    for(var px=0;px<W;px+=step){var yy=H*c.y+Math.sin(px*c.f+t*c.sp*6+c.ph)*H*c.amp+Math.sin(px*c.f*2.3+t*c.sp*9)*H*c.amp*.4,hh=H*c.h*(.65+.35*Math.sin(px*.006+t*.0004+c.ph));
     var al=.11*(.4+.6*(.5+.5*Math.sin(px*.011+t*.0007+c.ph)));var g=x.createLinearGradient(0,yy,0,yy+hh);g.addColorStop(0,'rgba('+c.c+',0)');g.addColorStop(.25,'rgba('+c.c+','+al+')');g.addColorStop(1,'rgba('+c.c+',0)');x.globalAlpha=1;x.fillStyle=g;x.fillRect(px,yy,step+.6,hh);}}
   x.globalCompositeOperation='source-over';x.globalAlpha=1;},
  tap:function(px,py){taps.push({k:'ripple',x:px,y:py,t:0,life:1.4});}
 };

 /* ============ طائرات ورقية ============ */
 function plane(c,s,col){c.beginPath();c.moveTo(s,0);c.lineTo(-s*.9,-s*.62);c.lineTo(-s*.45,0);c.closePath();c.fillStyle=col||'#fff';c.fill();c.beginPath();c.moveTo(s,0);c.lineTo(-s*.9,s*.5);c.lineTo(-s*.45,0);c.closePath();c.fillStyle='rgba(214,150,120,.55)';c.fill();c.strokeStyle='rgba(150,90,70,.35)';c.lineWidth=.8;c.beginPath();c.moveTo(s,0);c.lineTo(-s*.45,0);c.stroke();}
 var planes={
  seed:function(){S.cl=[];for(var i=0;i<6;i++)S.cl.push({x:rnd(0,W),y:rnd(H*.04,H*.7),s:rnd(.6,1.4),v:rnd(4,11)});S.pl=[];var n=W<700?2:4;for(i=0;i<n;i++)S.pl.push(this.mk(true));},
  mk:function(any){var dir=Math.random()<.5?1:-1;return {dir:dir,x:any?rnd(0,W):(dir>0?-40:W+40),y0:rnd(H*.12,H*.8),amp:rnd(18,60),f:rnd(.004,.009),ph:rnd(0,TAU),v:rnd(26,48),s:rnd(9,15),tr:[]};},
  cloud:function(c){x.save();x.translate(c.x,c.y);x.scale(c.s,c.s);x.fillStyle='rgba(255,255,255,.62)';x.beginPath();x.arc(0,0,26,0,TAU);x.arc(28,-10,32,0,TAU);x.arc(60,0,24,0,TAU);x.arc(30,8,26,0,TAU);x.fill();x.restore();},
  frame:function(t,dt){x.clearRect(0,0,W,H);var i;
   for(i=0;i<S.cl.length;i++){var c=S.cl[i];c.x+=c.v*dt;if(c.x>W+120)c.x=-140;this.cloud(c);}
   for(i=0;i<S.pl.length;i++){var p=S.pl[i];p.x+=p.v*p.dir*dt;var y=p.y0+Math.sin(p.x*p.f+p.ph)*p.amp;var sl=Math.cos(p.x*p.f+p.ph)*p.amp*p.f;
    p.tr.push([p.x,y]);if(p.tr.length>90)p.tr.shift();
    x.setLineDash([3,7]);x.strokeStyle='rgba(176,110,86,.33)';x.lineWidth=1.2;x.beginPath();for(var j=0;j<p.tr.length;j++){var q=p.tr[j];if(j)x.lineTo(q[0],q[1]);else x.moveTo(q[0],q[1]);}x.stroke();x.setLineDash([]);
    x.save();x.translate(p.x,y);x.rotate(Math.atan2(p.dir*sl,p.dir));x.globalAlpha=.85;plane(x,p.s);x.restore();x.globalAlpha=1;
    if(p.x<-80||p.x>W+80)S.pl[i]=this.mk(false);}},
  tap:function(px,py){var dir=px>W/2?-1:1;taps.push({k:'plane',x:px,y:py,t:0,life:1.8,dir:dir,tr:[]});}
 };


 /* ============ مُزن: سحب مضيئة ومطر هادئ ============ */
 function cloudBlob(c,cx,cy,w,al,col){var g=c.createRadialGradient(cx,cy,0,cx,cy,w);g.addColorStop(0,'rgba('+col+','+al+')');g.addColorStop(1,'rgba('+col+',0)');c.fillStyle=g;c.beginPath();c.ellipse(cx,cy,w,w*.42,0,0,TAU);c.fill();}
 var muzn={
  seed:function(){S.cl=[];var n=W<700?5:8;for(var i=0;i<n;i++)S.cl.push({x:rnd(-.1,1.1)*W,y:rnd(.04,.42)*H,w:rnd(140,320)*(W<700?.7:1),v:rnd(3,9),a:rnd(.08,.16),p:rnd(0,TAU),gold:Math.random()<.3});
   S.r=[];var m=Math.round(Math.min(120,W*H/14000));for(i=0;i<m;i++)S.r.push(this.drop(true));S.st=[];for(i=0;i<Math.round(W*H/16000);i++)S.st.push({x:rnd(0,W),y:rnd(0,H*.6),r:rnd(.3,1),p:rnd(0,TAU)});S.fl=0;S.nf=performance.now()+rnd(9000,16000);},
  drop:function(any){return {x:rnd(-40,W+40),y:any?rnd(-H,H):rnd(-H*.3,-10),l:rnd(9,20),v:rnd(260,420),a:rnd(.08,.22)};},
  frame:function(t,dt){x.clearRect(0,0,W,H);var i;
   for(i=0;i<S.st.length;i++){var s=S.st[i];x.globalAlpha=.25+.45*(.5+.5*Math.sin(t/1400+s.p));x.fillStyle='#EAF4F7';x.beginPath();x.arc(s.x,s.y,s.r,0,TAU);x.fill();}
   x.globalAlpha=1;
   if(t>S.nf){S.fl=1;S.nf=t+rnd(11000,20000);}
   if(S.fl>0){S.fl-=dt*1.6;var fa=Math.max(0,S.fl)*.12;x.fillStyle='rgba(200,225,255,'+fa+')';x.fillRect(0,0,W,H*.6);}
   for(i=0;i<S.cl.length;i++){var c=S.cl[i];c.x+=c.v*dt;if(c.x-c.w>W)c.x=-c.w;var by=c.y+Math.sin(t/7000+c.p)*8;var col=c.gold?'230,196,130':'190,220,232';
    cloudBlob(x,c.x,by,c.w,c.a,col);cloudBlob(x,c.x+c.w*.45,by+c.w*.08,c.w*.7,c.a*.9,col);cloudBlob(x,c.x-c.w*.4,by+c.w*.1,c.w*.6,c.a*.8,col);}
   x.lineCap='round';x.lineWidth=1;
   for(i=0;i<S.r.length;i++){var r=S.r[i];r.y+=r.v*dt;r.x-=r.v*dt*.08;if(r.y>H+20){S.r[i]=this.drop(false);continue;}
    x.strokeStyle='rgba(200,228,240,'+r.a+')';x.beginPath();x.moveTo(r.x,r.y);x.lineTo(r.x+r.l*.08,r.y-r.l);x.stroke();}
   x.globalAlpha=1;},
  tap:function(px,py){var ps=[];for(var i=0;i<7;i++){var a=rnd(-Math.PI*.9,-Math.PI*.1);ps.push({vx:Math.cos(a)*rnd(40,90),vy:Math.sin(a)*rnd(60,120),r:rnd(1.2,2.4)});}taps.push({k:'drop',x:px,y:py,t:0,life:1.5,ps:ps});}
 };

 /* ============ المدار: ذرّة الشعار ============ */
 function orbit(c,cx,cy,rx,ry,rot,col,lw){c.save();c.translate(cx,cy);c.rotate(rot);c.strokeStyle=col;c.lineWidth=lw;c.beginPath();c.ellipse(0,0,rx,ry,0,0,TAU);c.stroke();c.restore();}
 function onOrbit(cx,cy,rx,ry,rot,a){var ex=Math.cos(a)*rx,ey=Math.sin(a)*ry;return [cx+ex*Math.cos(rot)-ey*Math.sin(rot),cy+ex*Math.sin(rot)+ey*Math.cos(rot)];}
 var madar={
  seed:function(){S.st=[];var n=Math.round(W*H/6000);for(var i=0;i<n;i++)S.st.push({x:Math.random()*W,y:Math.random()*H,r:rnd(.3,1.2),p:rnd(0,TAU),s:rnd(.4,1.3),g:Math.random()<.2});
   S.e=[0,2.1,4.2].map(function(a,i){return {a:a,v:[.42,-.33,.27][i]};});S.mini=[];for(i=0;i<(W<700?3:6);i++)S.mini.push({x:rnd(.05,.95)*W,y:rnd(.05,.95)*H,r:rnd(16,34),p:rnd(0,TAU),v:rnd(.3,.7)});},
  frame:function(t,dt){x.clearRect(0,0,W,H);var i;
   for(i=0;i<S.st.length;i++){var s=S.st[i];x.globalAlpha=(.3+.7*(.5+.5*Math.sin(t/1000*s.s+s.p)))*.8;x.fillStyle=s.g?'#F0D49A':'#fff';x.beginPath();x.arc(s.x,s.y,s.r,0,TAU);x.fill();}
   var cx=W<900?W*.5:W*.18,cy=W<900?H*.7:H*.62,R=Math.min(W,H)*(W<700?.42:.34),rot0=t/60000;
   x.globalAlpha=1;var g=x.createRadialGradient(cx,cy,0,cx,cy,R*.9);g.addColorStop(0,'rgba(230,190,110,.16)');g.addColorStop(1,'rgba(230,190,110,0)');x.fillStyle=g;x.beginPath();x.arc(cx,cy,R*.9,0,TAU);x.fill();
   var rots=[rot0,rot0+Math.PI/3,rot0-Math.PI/3],cols=['rgba(214,176,104,.42)','rgba(120,190,214,.34)','rgba(214,176,104,.3)'];
   for(i=0;i<3;i++){orbit(x,cx,cy,R,R*.36,rots[i],cols[i],1.2);var e=S.e[i];e.a+=e.v*dt;var p=onOrbit(cx,cy,R,R*.36,rots[i],e.a);
    x.fillStyle=i===1?'#7FC4DC':'#E8C27A';x.shadowColor=x.fillStyle;x.shadowBlur=12;x.beginPath();x.arc(p[0],p[1],4.2,0,TAU);x.fill();x.shadowBlur=0;}
   var ng=x.createRadialGradient(cx-4,cy-4,1,cx,cy,14);ng.addColorStop(0,'#FFF1CF');ng.addColorStop(.5,'#D9AE62');ng.addColorStop(1,'#8E6A2C');x.fillStyle=ng;x.beginPath();x.arc(cx,cy,12,0,TAU);x.fill();
   for(i=0;i<S.mini.length;i++){var m=S.mini[i],mr=t/1000*m.v+m.p;x.globalAlpha=.22;for(var k=0;k<3;k++)orbit(x,m.x,m.y,m.r,m.r*.38,mr+k*Math.PI/3,'rgba(214,190,140,.8)',.7);x.globalAlpha=1;}
   x.globalAlpha=1;},
  tap:function(px,py){taps.push({k:'atom',x:px,y:py,t:0,life:1.6,r0:rnd(0,TAU)});}
 };

 /* ============ قلعة الصباح: فجر رملي وقلعة وطيور ============ */
 function fort(c,bx,by,s,col){c.fillStyle=col;c.beginPath();c.moveTo(bx-60*s,by);c.lineTo(bx-60*s,by-38*s);c.lineTo(bx-30*s,by-38*s);c.lineTo(bx-30*s,by-30*s);c.lineTo(bx-12*s,by-30*s);c.lineTo(bx-12*s,by-82*s);
   for(var k=0;k<4;k++){var xx=bx-12*s+k*8*s;c.lineTo(xx,by-90*s);c.lineTo(xx+4*s,by-90*s);c.lineTo(xx+4*s,by-82*s);c.lineTo(xx+8*s,by-82*s);}
   c.lineTo(bx+20*s,by-82*s);c.lineTo(bx+20*s,by-34*s);c.lineTo(bx+70*s,by-34*s);c.lineTo(bx+70*s,by-26*s);c.lineTo(bx+110*s,by-26*s);c.lineTo(bx+110*s,by);c.closePath();c.fill();}
 function bird(c,bx,by,s,ph){var f=Math.sin(ph)*s*.5;c.beginPath();c.moveTo(bx-s,by-f);c.quadraticCurveTo(bx-s*.4,by-s*.5-f,bx,by);c.quadraticCurveTo(bx+s*.4,by-s*.5-f,bx+s,by-f);c.stroke();}
 var qalaa={
  seed:function(){S.b=[];for(var i=0;i<(W<700?5:9);i++)S.b.push({x:rnd(0,W),y:rnd(.08,.4)*H,s:rnd(5,10),v:rnd(18,34),p:rnd(0,TAU)});S.d=[];for(i=0;i<40;i++)S.d.push({x:rnd(0,W),y:rnd(.5,1)*H,r:rnd(.6,1.6),p:rnd(0,TAU)});},
  frame:function(t,dt){x.clearRect(0,0,W,H);var i;
   var sx=W*.82,sy=H*.3;var sg=x.createRadialGradient(sx,sy,0,sx,sy,Math.max(W,H)*.45);sg.addColorStop(0,'rgba(255,214,150,.55)');sg.addColorStop(.25,'rgba(255,200,140,.18)');sg.addColorStop(1,'rgba(255,200,140,0)');x.fillStyle=sg;x.fillRect(0,0,W,H);
   x.fillStyle='rgba(255,236,200,.9)';x.beginPath();x.arc(sx,sy,26,0,TAU);x.fill();
   var base=H*.86;
   x.fillStyle='rgba(196,150,96,.16)';x.beginPath();x.moveTo(0,base-30);for(var px=0;px<=W;px+=20)x.lineTo(px,base-40+Math.sin(px/170+1)*18);x.lineTo(W,H);x.lineTo(0,H);x.fill();
   fort(x,W<700?W*.18:W*.12,base-10,W<700?.55:.8,'rgba(150,104,70,.18)');
   x.fillStyle='rgba(204,160,104,.2)';x.beginPath();x.moveTo(0,base);for(px=0;px<=W;px+=20)x.lineTo(px,base-8+Math.sin(px/120)*12);x.lineTo(W,H);x.lineTo(0,H);x.fill();
   for(i=0;i<S.d.length;i++){var d=S.d[i];x.globalAlpha=.25+.35*(.5+.5*Math.sin(t/900+d.p));x.fillStyle='#C9A05A';x.beginPath();x.arc(d.x,d.y,d.r,0,TAU);x.fill();}
   x.globalAlpha=.55;x.strokeStyle='#6B4A35';x.lineWidth=1.3;x.lineCap='round';
   for(i=0;i<S.b.length;i++){var b=S.b[i];b.x+=b.v*dt;if(b.x>W+30){b.x=-30;b.y=rnd(.08,.4)*H;}bird(x,b.x,b.y+Math.sin(t/1600+b.p)*6,b.s,t/160+b.p);}
   x.globalAlpha=1;},
  tap:function(px,py){var ps=[];for(var i=0;i<14;i++){var a=rnd(0,TAU);ps.push({vx:Math.cos(a)*rnd(20,80),vy:Math.sin(a)*rnd(20,80)-30,r:rnd(1,2.6)});}taps.push({k:'dust',x:px,y:py,t:0,life:1.4,ps:ps});}
 };
 /* ============ ليل القمر: قمر بطوره الحقيقي، نجوم، درب التبانة، جبال وبحيرة تعكس ضوءه ============ */
  function ridge(c,w,h,base,amp,seedN,step,col){c.fillStyle=col;c.beginPath();c.moveTo(0,h);var y;for(var X=0;X<=w+step;X+=step){var n=Math.sin(X*.004*seedN+seedN)*.55+Math.sin(X*.011*seedN+seedN*2)*.3+Math.sin(X*.027+seedN*5)*.15;y=base-amp*(.5+.5*n);c.lineTo(X,y);}c.lineTo(w,h);c.closePath();c.fill();}
 function palm(c,px,py,s,col){c.strokeStyle=col;c.fillStyle=col;c.lineWidth=s*.09;c.lineCap='round';c.beginPath();c.moveTo(px,py);c.quadraticCurveTo(px+s*.12,py-s*.55,px+s*.05,py-s);c.stroke();
  var tx0=px+s*.05,ty0=py-s;for(var i=0;i<7;i++){var a=-Math.PI/2+(i-3)*.48,l=s*(.42+.08*Math.cos(i));c.lineWidth=s*.05;c.beginPath();c.moveTo(tx0,ty0);c.quadraticCurveTo(tx0+Math.cos(a)*l*.6,ty0+Math.sin(a)*l*.6-s*.08,tx0+Math.cos(a)*l,ty0+Math.sin(a)*l+s*.12);c.stroke();}}
 var qamar={
  seed:function(){var i,n=Math.round(W*H/4200);S.st=[];for(i=0;i<n;i++){var y=Math.pow(Math.random(),1.4)*H*.78;S.st.push({x:Math.random()*W,y:y,r:Math.random()<.06?rnd(1.2,1.9):rnd(.25,1.05),p:Math.random()*TAU,s:rnd(.3,1.3),c:Math.random()<.15?'#FFE9BE':(Math.random()<.2?'#CFE0FF':'#fff')});}
   S.mw=[];var m=W<700?500:1100;for(i=0;i<m;i++){var u=Math.random(),off=(Math.random()+Math.random()+Math.random()-1.5)*.13;S.mw.push({u:u,o:off,r:rnd(.2,.9),a:rnd(.15,.55)});}
   S.mx=W<800?W*.2:W*.17;S.my=W<800?H*.145:H*.19;S.mr=Math.max(26,Math.min(W,H)*(W<800?.07:.06));S.ph=.47;
   S.cl=[];for(i=0;i<4;i++)S.cl.push({x:rnd(-.2,1.1)*W,y:rnd(.08,.42)*H,w:rnd(160,320)*(W<700?.7:1),v:rnd(4,9),a:rnd(.05,.11)});
   S.ff=[];var nf=W<700?10:18;for(i=0;i<nf;i++)S.ff.push({x:rnd(0,W),y:rnd(.74,.95)*H,p:rnd(0,TAU),s:rnd(.4,1),vx:rnd(-8,8),vy:rnd(-4,4)});
   S.sh=null;S.next=performance.now()+5000;S.par=0;
   /* المنظر الثابت يُرسم مرة واحدة */
   var bg=document.createElement('canvas');bg.width=W*D;bg.height=H*D;var b=bg.getContext('2d');b.setTransform(D,0,0,D,0,0);
   var hz=H*.8;
   ridge(b,W,H,hz-H*.02,H*.2,1.3,6,'#18264A');
   var rim=b.createLinearGradient(S.mx,0,S.mx+W*.5,0);
   ridge(b,W,H,hz+H*.015,H*.12,2.1,5,'#111C3A');
   ridge(b,W,H,hz+H*.045,H*.06,3.7,4,'#0B1430');
   /* حافة مضاءة بالقمر على القمم البعيدة */
   b.globalCompositeOperation='source-atop';var lg=b.createRadialGradient(S.mx,S.my,0,S.mx,S.my,Math.max(W,H)*.9);lg.addColorStop(0,'rgba(190,210,255,.22)');lg.addColorStop(1,'rgba(190,210,255,0)');b.fillStyle=lg;b.fillRect(0,0,W,hz+H*.05);b.globalCompositeOperation='source-over';
   /* البحيرة */
   var wy=hz+H*.06,wg=b.createLinearGradient(0,wy,0,H);wg.addColorStop(0,'#14224A');wg.addColorStop(1,'#070D22');b.fillStyle=wg;b.fillRect(0,wy,W,H-wy);
   /* نخيل على الشاطئ */
   var pc='#070C1E';palm(b,W*(W<700?.08:.88),wy+2,Math.min(120,H*.16),pc);palm(b,W*(W<700?.18:.93),wy+4,Math.min(90,H*.12),pc);if(W>700)palm(b,W*.06,wy+3,Math.min(100,H*.13),pc);
   b.fillStyle=pc;b.fillRect(0,wy-1,W,2.5);
   S.bg=bg;S.wy=wy;rim=null;},
  moon:function(t){var X=S.mx,Y=S.my+S.par,R=S.mr,ph=S.ph;
   var halo=x.createRadialGradient(X,Y,R*.8,X,Y,R*7);halo.addColorStop(0,'rgba(235,240,255,.34)');halo.addColorStop(.25,'rgba(210,222,255,.12)');halo.addColorStop(1,'rgba(200,215,255,0)');x.fillStyle=halo;x.beginPath();x.arc(X,Y,R*7,0,TAU);x.fill();
   x.save();x.beginPath();x.arc(X,Y,R,0,TAU);x.clip();
   x.fillStyle='rgba(60,72,110,.55)';x.fillRect(X-R,Y-R,R*2,R*2);
   var lit=x.createRadialGradient(X-R*.3,Y-R*.3,R*.1,X,Y,R*1.05);lit.addColorStop(0,'#FFFDF2');lit.addColorStop(.7,'#EDEADB');lit.addColorStop(1,'#C9CBC4');
   x.fillStyle=lit;x.beginPath();var k=Math.cos(ph*TAU),right=ph<.5;
   if(ph<.02||ph>.98){/* محاق: يبقى ضوء الأرض الخافت */}
   else{x.moveTo(X,Y-R);x.arc(X,Y,R,-Math.PI/2,Math.PI/2,!right);x.ellipse(X,Y,Math.abs(k)*R,R,0,Math.PI/2,-Math.PI/2,right?k>0:k<0);x.closePath();x.fill();}
   x.globalAlpha=.10;x.fillStyle='#5A6070';[[-.3,-.2,.22],[.25,.1,.16],[-.05,.35,.12],[.3,-.35,.09],[-.45,.25,.08]].forEach(function(c){x.beginPath();x.arc(X+c[0]*R,Y+c[1]*R,c[2]*R,0,TAU);x.fill();});x.globalAlpha=1;x.restore();},
  frame:function(t,dt){x.clearRect(0,0,W,H);var i;S.par+=((-(window.scrollY||0)*.04)-S.par)*.08;
   /* درب التبانة */
   var ax=W*.05,ay=H*.62,bx=W*.95,by=H*.02,dx=bx-ax,dy=by-ay,len=Math.hypot(dx,dy),nx=-dy/len,ny=dx/len;
   for(i=0;i<S.mw.length;i++){var q=S.mw[i],px=ax+dx*q.u+nx*q.o*len,py=ay+dy*q.u+ny*q.o*len;x.globalAlpha=q.a*(.75+.25*Math.sin(t/2600+i));x.fillStyle=i%7?'#E6ECFF':'#FFE3B0';x.fillRect(px,py,q.r,q.r);}
   var mg=x.createLinearGradient(ax,ay,bx,by);mg.addColorStop(0,'rgba(150,160,230,0)');mg.addColorStop(.5,'rgba(170,175,240,.06)');mg.addColorStop(1,'rgba(150,160,230,0)');x.globalAlpha=1;x.save();x.translate(W/2,H*.32);x.rotate(Math.atan2(dy,dx));x.fillStyle=mg;x.fillRect(-len/2,-len*.07,len,len*.14);x.restore();
   /* النجوم */
   for(i=0;i<S.st.length;i++){var s=S.st[i],tw=.5+.5*Math.sin(t/1000*s.s+s.p);x.globalAlpha=.3+.7*tw;x.fillStyle=s.c;x.beginPath();x.arc(s.x,s.y,s.r,0,TAU);x.fill();
    if(s.r>1.2&&tw>.85){x.globalAlpha=(tw-.85)*4;x.strokeStyle=s.c;x.lineWidth=.6;x.beginPath();x.moveTo(s.x-s.r*4,s.y);x.lineTo(s.x+s.r*4,s.y);x.moveTo(s.x,s.y-s.r*4);x.lineTo(s.x,s.y+s.r*4);x.stroke();}}
   x.globalAlpha=1;this.moon(t);
   /* سحب رقيقة تعبر القمر */
   for(i=0;i<S.cl.length;i++){var c=S.cl[i];c.x+=c.v*dt;if(c.x-c.w>W)c.x=-c.w*1.5;var near=Math.max(0,1-Math.hypot(c.x-S.mx,c.y-S.my)/(c.w*1.6));var col=near>.1?'225,232,255':'150,165,210';
    cloudBlob(x,c.x,c.y,c.w,c.a+near*.08,col);cloudBlob(x,c.x+c.w*.45,c.y+6,c.w*.6,c.a*.8,col);}
   /* شهاب */
   if(!S.sh&&t>S.next){S.sh={x:rnd(W*.3,W),y:rnd(0,H*.3),vx:-rnd(280,420),vy:rnd(90,150),l:1};S.next=t+rnd(10000,18000);}
   var sh=S.sh;if(sh){sh.x+=sh.vx*dt;sh.y+=sh.vy*dt;sh.l-=dt*.85;var gr=x.createLinearGradient(sh.x,sh.y,sh.x-sh.vx*.25,sh.y-sh.vy*.25);gr.addColorStop(0,'rgba(255,250,235,'+Math.max(0,sh.l)+')');gr.addColorStop(1,'rgba(255,250,235,0)');x.strokeStyle=gr;x.lineWidth=1.4;x.beginPath();x.moveTo(sh.x,sh.y);x.lineTo(sh.x-sh.vx*.25,sh.y-sh.vy*.25);x.stroke();if(sh.l<=0)S.sh=null;}
   /* المنظر الثابت */
   x.drawImage(S.bg,0,0,W,H);
   /* انعكاس القمر على الماء */
   var rx=S.mx,ry=S.wy;for(i=0;i<16;i++){var yy=ry+6+i*((H-ry)/16),wd=S.mr*(1.6-i*.05)*(.6+.4*Math.sin(t/700+i*1.7)),al=.28*(1-i/16)*(.6+.4*Math.sin(t/500+i));x.globalAlpha=al;x.fillStyle='#F4F1E2';x.fillRect(rx-wd/2+Math.sin(t/900+i)*4,yy,wd,1.3);}
   /* يراعات قرب الأرض */
   for(i=0;i<S.ff.length;i++){var f=S.ff[i];f.x+=(f.vx+Math.sin(t/1300+f.p)*6)*dt;f.y+=(f.vy+Math.cos(t/1700+f.p)*4)*dt;if(f.x<0)f.x=W;if(f.x>W)f.x=0;if(f.y<H*.7)f.vy=Math.abs(f.vy);if(f.y>H)f.vy=-Math.abs(f.vy);
    var gl=.5+.5*Math.sin(t/600*f.s+f.p);x.globalAlpha=gl*.8;var fg=x.createRadialGradient(f.x,f.y,0,f.x,f.y,6);fg.addColorStop(0,'rgba(255,236,160,.9)');fg.addColorStop(1,'rgba(255,236,160,0)');x.fillStyle=fg;x.beginPath();x.arc(f.x,f.y,6,0,TAU);x.fill();}
   x.globalAlpha=1;},
  tap:function(px,py){var ps=[];for(var i=0;i<5;i++)ps.push({x:px+rnd(-70,70),y:py+rnd(-60,20),d:rnd(0,.25)});taps.push({k:'constel',x:px,y:py,t:0,life:2,ps:ps});}
 };
 /* ============ ضُحى البحر: شمس بأشعة تدور، غيوم ركامية، مناطيد، جبال الحجر، بحر يلمع، سفينة شراعية، نوارس، نخيل يتمايل، فراشات ============ */
 function puffCloud(w,h,seedN){var c=document.createElement('canvas');c.width=Math.ceil(w*D);c.height=Math.ceil(h*D);var g=c.getContext('2d');g.setTransform(D,0,0,D,0,0);
  var n=7+Math.floor(seedN*4),i;for(i=0;i<n;i++){var u=(i+.5)/n,cx=w*(.12+.76*u),r=h*(.26+.2*Math.sin(u*Math.PI)+.06*Math.sin(i*2.3+seedN*9)),cy=h*.68-r*.55*Math.sin(u*Math.PI);
   var rg=g.createRadialGradient(cx,cy,r*.15,cx,cy,r);rg.addColorStop(0,'rgba(255,255,255,1)');rg.addColorStop(.72,'rgba(255,255,255,.96)');rg.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=rg;g.beginPath();g.arc(cx,cy,r,0,TAU);g.fill();}
  g.fillStyle='rgba(255,255,255,.95)';g.beginPath();g.ellipse(w*.5,h*.72,w*.4,h*.13,0,0,TAU);g.fill();
  g.globalCompositeOperation='source-atop';var sg=g.createLinearGradient(0,h*.25,0,h*.9);sg.addColorStop(0,'rgba(255,248,232,0)');sg.addColorStop(.55,'rgba(196,214,236,.18)');sg.addColorStop(1,'rgba(150,178,212,.42)');g.fillStyle=sg;g.fillRect(0,0,w,h);
  var hl=g.createRadialGradient(w*.7,h*.15,0,w*.7,h*.15,w*.5);hl.addColorStop(0,'rgba(255,244,214,.55)');hl.addColorStop(1,'rgba(255,244,214,0)');g.fillStyle=hl;g.fillRect(0,0,w,h);return c;}
 function dhow(c,bx,by,s,t){c.save();c.translate(bx,by+Math.sin(t/900)*s*.06);c.rotate(Math.sin(t/1300)*.025);
  c.fillStyle='rgba(255,255,255,.35)';c.beginPath();c.ellipse(0,s*.02,s*1.15,s*.06,0,0,TAU);c.fill();
  c.fillStyle='#6B4426';c.beginPath();c.moveTo(-s*1.05,-s*.22);c.quadraticCurveTo(-s*.6,s*.08,0,s*.06);c.quadraticCurveTo(s*.7,s*.06,s*1.1,-s*.3);c.lineTo(s*.95,-s*.12);c.lineTo(-s*.9,-s*.12);c.closePath();c.fill();
  c.fillStyle='#A9763F';c.fillRect(-s*.9,-s*.16,s*1.85,s*.035);
  c.strokeStyle='#4A2E18';c.lineWidth=Math.max(1,s*.035);c.beginPath();c.moveTo(-s*.05,-s*.12);c.lineTo(-s*.12,-s*1.25);c.stroke();
  c.beginPath();c.moveTo(-s*.75,-s*.3);c.lineTo(s*.55,-s*1.32);c.stroke();
  var sg=c.createLinearGradient(-s*.6,-s*1.2,s*.3,-s*.2);sg.addColorStop(0,'#FFFDF5');sg.addColorStop(1,'#EBDDBF');c.fillStyle=sg;
  c.beginPath();c.moveTo(-s*.7,-s*.34);c.quadraticCurveTo(-s*.1,-s*.95+Math.sin(t/700)*s*.03,s*.5,-s*1.27);c.quadraticCurveTo(s*.32,-s*.6,s*.02,-s*.2);c.closePath();c.fill();
  c.fillStyle='#C8473F';c.beginPath();c.moveTo(-s*.12,-s*1.25);c.lineTo(-s*.12+s*.22,-s*1.19+Math.sin(t/240)*s*.02);c.lineTo(-s*.12,-s*1.13);c.fill();c.restore();}
 function gull(c,bx,by,s,ph){var f=Math.sin(ph);c.lineWidth=Math.max(1.1,s*.16);c.strokeStyle='rgba(255,255,255,.95)';c.beginPath();c.moveTo(bx-s,by-f*s*.55);c.quadraticCurveTo(bx-s*.45,by-s*.45-f*s*.35,bx,by);c.quadraticCurveTo(bx+s*.45,by-s*.45-f*s*.35,bx+s,by-f*s*.55);c.stroke();
  c.strokeStyle='rgba(40,60,80,.55)';c.lineWidth=Math.max(.8,s*.1);c.beginPath();c.moveTo(bx-s,by-f*s*.55);c.lineTo(bx-s*.82,by-f*s*.5-s*.05);c.moveTo(bx+s,by-f*s*.55);c.lineTo(bx+s*.82,by-f*s*.5-s*.05);c.stroke();}
 var BAL=[['#F2A93B','#FFF3DA'],['#E2574C','#FFE1A8'],['#1385A8','#F7F1E1'],['#7A5BB5','#FFD27A']];
 function balloon(c,bx,by,s,cols){c.save();c.translate(bx,by);
  c.strokeStyle='rgba(90,60,40,.6)';c.lineWidth=.8;c.beginPath();c.moveTo(-s*.32,s*.62);c.lineTo(-s*.14,s*1.02);c.moveTo(s*.32,s*.62);c.lineTo(s*.14,s*1.02);c.stroke();
  c.fillStyle='#8A5A32';c.fillRect(-s*.15,s*1.02,s*.3,s*.2);
  c.save();c.beginPath();c.moveTo(0,s*.72);c.bezierCurveTo(-s*.9,s*.2,-s*.72,-s*.78,0,-s*.78);c.bezierCurveTo(s*.72,-s*.78,s*.9,s*.2,0,s*.72);c.closePath();c.clip();
  for(var i=-3;i<=3;i++){c.fillStyle=(i&1)?cols[1]:cols[0];c.beginPath();c.ellipse(0,0,Math.abs(i)*s*.17+s*.1,s*.9,0,0,TAU);c.fill();}
  c.fillStyle=cols[0];c.beginPath();c.ellipse(0,0,s*.1,s*.9,0,0,TAU);c.fill();
  var sh=c.createLinearGradient(-s*.8,0,s*.8,0);sh.addColorStop(0,'rgba(255,255,255,.35)');sh.addColorStop(.45,'rgba(255,255,255,0)');sh.addColorStop(1,'rgba(30,40,80,.28)');c.fillStyle=sh;c.fillRect(-s,-s,s*2,s*2);c.restore();c.restore();}
 function palmSway(c,px,py,s,sw,dir){var tipx=px+dir*s*.18+sw*s*.06,tipy=py-s;c.strokeStyle='#7B5A3A';c.lineCap='round';c.lineWidth=s*.075;c.beginPath();c.moveTo(px,py);c.quadraticCurveTo(px+dir*s*.02,py-s*.55,tipx,tipy);c.stroke();
  c.strokeStyle='rgba(60,40,24,.35)';c.lineWidth=s*.075;c.setLineDash([1.2,s*.07]);c.beginPath();c.moveTo(px,py-2);c.quadraticCurveTo(px+dir*s*.02,py-s*.55,tipx,tipy);c.stroke();c.setLineDash([]);
  for(var i=0;i<9;i++){var a=-Math.PI/2+(i-4)*.42+sw*.09*(1+Math.abs(i-4)*.15),l=s*(.5+.1*Math.cos(i*1.7)),droop=s*(.12+Math.abs(i-4)*.05);
   var ex=tipx+Math.cos(a)*l,ey=tipy+Math.sin(a)*l+droop,mx=tipx+Math.cos(a)*l*.55,my=tipy+Math.sin(a)*l*.55-s*.1;
   c.fillStyle=i%2?'#2F7A52':'#3C9163';c.beginPath();c.moveTo(tipx,tipy);c.quadraticCurveTo(mx-Math.sin(a)*s*.07,my+Math.cos(a)*s*.07,ex,ey);c.quadraticCurveTo(mx+Math.sin(a)*s*.03,my-Math.cos(a)*s*.03,tipx,tipy);c.fill();}
  c.fillStyle='#6E4A2A';for(var k=0;k<3;k++){c.beginPath();c.arc(tipx+(k-1)*s*.05,tipy+s*.05,s*.035,0,TAU);c.fill();}}
 function butterfly(c,bx,by,s,ph,ang,col){var o=Math.abs(Math.sin(ph))*.85+.15;c.save();c.translate(bx,by);c.rotate(ang);
  c.fillStyle=col;c.globalAlpha*=.95;[-1,1].forEach(function(sd){c.save();c.scale(sd*o,1);c.beginPath();c.ellipse(s*.55,-s*.35,s*.55,s*.42,-.5,0,TAU);c.fill();c.beginPath();c.ellipse(s*.42,s*.3,s*.36,s*.3,.6,0,TAU);c.fill();
   c.fillStyle='rgba(255,255,255,.55)';c.beginPath();c.arc(s*.62,-s*.42,s*.1,0,TAU);c.fill();c.fillStyle=col;c.restore();});
  c.fillStyle='#2B2B33';c.beginPath();c.ellipse(0,0,s*.08,s*.45,0,0,TAU);c.fill();c.strokeStyle='#2B2B33';c.lineWidth=.7;c.beginPath();c.moveTo(0,-s*.42);c.lineTo(-s*.18,-s*.72);c.moveTo(0,-s*.42);c.lineTo(s*.18,-s*.72);c.stroke();c.restore();}
 var BFC=['#FF8A65','#F7B733','#5BC0EB','#E86AA0','#9B7BEA'];
 var duha={
  seed:function(){var i,m=W<700;S.hz=H*(m?.66:.64);S.wy=S.hz+6;S.sand=H*(m?.9:.88);
   S.sx=m?W*.2:W*.12;S.sy=m?H*.1:H*.15;S.sr=Math.max(26,Math.min(W,H)*(m?.06:.05));
   S.cs=[];var nc=m?5:8;for(i=0;i<nc;i++){var lay=i%3,w=(m?150:230)*(.65+lay*.3)*rnd(.85,1.2);S.cs.push({img:puffCloud(w,w*.5,Math.random()),w:w,h:w*.5,x:rnd(-.1,1)*W,y:rnd(.05,.42)*S.hz,v:(4+lay*5)*rnd(.8,1.2),lay:lay});}
   S.cs.sort(function(a,b){return a.lay-b.lay;});
   S.bl=[];var nb=m?2:3;for(i=0;i<nb;i++)S.bl.push({x:rnd(.15,.9)*W,y:rnd(.15,.55)*S.hz,s:(m?14:20)*rnd(.75,1.2),v:rnd(5,9),p:rnd(0,TAU),c:BAL[i%BAL.length]});
   S.gl=[];var ng=m?4:7;for(i=0;i<ng;i++)S.gl.push({x:rnd(0,W),y:rnd(.2,.62)*S.hz,s:rnd(5,9),v:rnd(22,40)*(Math.random()<.5?-1:1),p:rnd(0,TAU)});
   S.gt=[];for(i=0;i<(m?50:90);i++){var u=Math.pow(Math.random(),1.6);S.gt.push({u:u,o:(Math.random()-.5),p:rnd(0,TAU),s:rnd(.6,1.6)});}
   S.bf=[];for(i=0;i<(m?2:4);i++)S.bf.push({x:rnd(0,W),y:rnd(.7,.95)*H,p:rnd(0,TAU),s:rnd(6,9),c:BFC[i%BFC.length],vx:rnd(-20,20),vy:rnd(-10,10)});
   S.dh={x:rnd(.3,.8)*W,v:-W/140,s:m?20:30};S.par=0;
   var bg=document.createElement('canvas');bg.width=W*D;bg.height=H*D;var b=bg.getContext('2d');b.setTransform(D,0,0,D,0,0);
   var hz=S.hz;
   ridge(b,W,H,hz+2,H*.13,1.7,6,'#A9C2DE');ridge(b,W,H,hz+4,H*.085,2.6,5,'#8FAED2');ridge(b,W,H,hz+6,H*.045,4.1,4,'#7C9CC4');
   b.globalCompositeOperation='source-atop';var mh=b.createLinearGradient(0,hz-H*.15,0,hz+6);mh.addColorStop(0,'rgba(255,240,215,.05)');mh.addColorStop(1,'rgba(240,248,255,.55)');b.fillStyle=mh;b.fillRect(0,0,W,hz+8);
   var sl=b.createRadialGradient(S.sx,S.sy,0,S.sx,S.sy,W*.7);sl.addColorStop(0,'rgba(255,226,160,.35)');sl.addColorStop(1,'rgba(255,226,160,0)');b.fillStyle=sl;b.fillRect(0,0,W,hz+8);b.globalCompositeOperation='source-over';
   var sea=b.createLinearGradient(0,S.wy,0,S.sand);sea.addColorStop(0,'#2A86B4');sea.addColorStop(.45,'#3BB0C8');sea.addColorStop(1,'#86DCD6');b.fillStyle=sea;b.fillRect(0,S.wy,W,H-S.wy);
   b.fillStyle='rgba(255,255,255,.55)';b.fillRect(0,S.wy,W,1.2);
   var sd=b.createLinearGradient(0,S.sand-10,0,H);sd.addColorStop(0,'#F6E3BC');sd.addColorStop(1,'#EBCF9A');b.fillStyle=sd;b.beginPath();b.moveTo(0,H);
   for(var X=0;X<=W+10;X+=10)b.lineTo(X,S.sand+Math.sin(X/W*Math.PI*1.3+.4)*H*.02);b.lineTo(W,H);b.closePath();b.fill();
   S.bg=bg;},
  frame:function(t,dt){var i,m=W<700;x.clearRect(0,0,W,H);S.par+=((-(window.scrollY||0)*.03)-S.par)*.08;
   var sky=x.createLinearGradient(0,0,0,S.hz);sky.addColorStop(0,'#5FB6E8');sky.addColorStop(.55,'#A8DBF3');sky.addColorStop(1,'#FFF0D2');x.fillStyle=sky;x.fillRect(0,0,W,S.hz+10);
   var sX=S.sx,sY=S.sy+S.par,R=S.sr;
   /* أشعة تدور ببطء */
   x.save();x.translate(sX,sY);x.rotate(t/26000);var L=Math.max(W,H)*.75;for(i=0;i<14;i++){x.rotate(TAU/14);var rg=x.createLinearGradient(0,0,L,0);rg.addColorStop(0,'rgba(255,246,214,'+(i%2?.16:.1)+')');rg.addColorStop(1,'rgba(255,246,214,0)');x.fillStyle=rg;x.beginPath();x.moveTo(0,0);x.lineTo(L,-L*.06);x.lineTo(L,L*.06);x.closePath();x.fill();}x.restore();
   var hal=x.createRadialGradient(sX,sY,R*.6,sX,sY,R*6);hal.addColorStop(0,'rgba(255,250,225,.9)');hal.addColorStop(.18,'rgba(255,236,180,.35)');hal.addColorStop(1,'rgba(255,236,180,0)');x.fillStyle=hal;x.beginPath();x.arc(sX,sY,R*6,0,TAU);x.fill();
   var core=x.createRadialGradient(sX,sY,0,sX,sY,R);core.addColorStop(0,'#FFFFFF');core.addColorStop(.7,'#FFF6D6');core.addColorStop(1,'#FFE39A');x.fillStyle=core;x.beginPath();x.arc(sX,sY,R*(1+.02*Math.sin(t/800)),0,TAU);x.fill();
   /* غيوم بعيدة خلف الجبال */
   for(i=0;i<S.cs.length;i++){var c=S.cs[i];c.x+=c.v*dt;if(c.x>W+20)c.x=-c.w-rnd(0,W*.3);if(c.lay<2){x.globalAlpha=.75+c.lay*.12;x.drawImage(c.img,c.x,c.y+S.par*(1+c.lay),c.w,c.h);}}
   x.globalAlpha=1;x.drawImage(S.bg,0,0,W,H);
   /* لمعان الشمس على الماء */
   var sh=S.sand-S.wy;for(i=0;i<S.gt.length;i++){var g=S.gt[i],gy=S.wy+3+g.u*sh*.85,spread=(14+g.u*sh*.9),gx=sX+g.o*spread*2,tw=Math.max(0,Math.sin(t/420*g.s+g.p));if(tw<.3)continue;x.globalAlpha=tw*(1-g.u*.6);x.fillStyle='#FFFFFF';var ln=2+tw*5*(1-g.u*.4);x.fillRect(gx-ln,gy,ln*2,1.2);if(tw>.93){x.fillRect(gx-.6,gy-ln*.6,1.2,ln*1.2);}}
   /* خطوط موج */
   x.globalAlpha=1;x.strokeStyle='rgba(255,255,255,.28)';x.lineWidth=1;for(i=0;i<7;i++){var wy2=S.wy+sh*(.2+i*.11),off=(t/(60+i*14)+i*80)%140;x.beginPath();for(var X=-140+off;X<W;X+=140){x.moveTo(X,wy2);x.quadraticCurveTo(X+18,wy2-2.5,X+36+i*3,wy2);}x.stroke();}
   /* السفينة الشراعية */
   var d=S.dh;d.x+=d.v*dt;if(d.x<-d.s*2)d.x=W+d.s*2;dhow(x,d.x,S.wy+sh*.22,d.s,t);
   /* زبد الشاطئ يتقدّم ويتراجع */
   var fw=Math.sin(t/2200)*H*.008;x.strokeStyle='rgba(255,255,255,.85)';x.lineWidth=2.2;x.beginPath();for(X=0;X<=W+10;X+=10){var yy=S.sand+Math.sin(X/W*Math.PI*1.3+.4)*H*.02-3+fw+Math.sin(X/38+t/700)*1.4;if(X)x.lineTo(X,yy);else x.moveTo(X,yy);}x.stroke();
   x.strokeStyle='rgba(255,255,255,.35)';x.lineWidth=1;x.beginPath();for(X=0;X<=W+10;X+=10){yy=S.sand+Math.sin(X/W*Math.PI*1.3+.4)*H*.02-9+fw*1.6+Math.sin(X/30+t/500)*1.2;if(X)x.lineTo(X,yy);else x.moveTo(X,yy);}x.stroke();
   /* المناطيد */
   for(i=0;i<S.bl.length;i++){var b=S.bl[i];b.y-=b.v*dt;if(b.y<-b.s*3){b.y=S.hz*rnd(.75,.95);b.x=rnd(.1,.9)*W;}balloon(x,b.x+Math.sin(t/3000+b.p)*10,b.y+S.par*1.5,b.s,b.c);}
   /* غيوم قريبة */
   for(i=0;i<S.cs.length;i++){c=S.cs[i];if(c.lay===2){x.globalAlpha=.95;x.drawImage(c.img,c.x,c.y+S.par*3,c.w,c.h);}}x.globalAlpha=1;
   /* النوارس */
   x.lineCap='round';for(i=0;i<S.gl.length;i++){var q=S.gl[i];q.x+=q.v*dt;if(q.x>W+30)q.x=-30;if(q.x<-30)q.x=W+30;gull(x,q.x,q.y+Math.sin(t/1400+q.p)*8+S.par*2,q.s,t/170+q.p);}
   /* نخيل يتمايل مع النسيم */
   var sw=Math.sin(t/1700)+Math.sin(t/610)*.3,ps=Math.min(150,H*.2);
   palmSway(x,W*(m?.06:.04),S.sand+H*.05,ps,sw,1);palmSway(x,W*(m?.17:.1),S.sand+H*.06,ps*.78,sw*1.1,1);if(!m){palmSway(x,W*.95,S.sand+H*.05,ps*.92,sw*.9,-1);palmSway(x,W*.885,S.sand+H*.065,ps*.7,sw,-1);}
   /* فراشات */
   for(i=0;i<S.bf.length;i++){var f=S.bf[i];f.vx+=rnd(-30,30)*dt;f.vy+=rnd(-30,30)*dt;f.vx=Math.max(-30,Math.min(30,f.vx));f.vy=Math.max(-18,Math.min(18,f.vy));f.x+=f.vx*dt;f.y+=f.vy*dt+Math.sin(t/300+f.p)*.4;
    if(f.x<0)f.x=W;if(f.x>W)f.x=0;if(f.y<H*.62)f.vy=Math.abs(f.vy);if(f.y>H*.98)f.vy=-Math.abs(f.vy);x.globalAlpha=.92;butterfly(x,f.x,f.y,f.s,t/70+f.p,Math.atan2(f.vy,f.vx)*.25,f.c);}
   x.globalAlpha=1;},
  tap:function(px,py){var ps=[];for(var i=0;i<8;i++)ps.push({a:i/8*TAU+rnd(-.2,.2),v:rnd(30,60),c:pick(['#FFB4A2','#FFD27A','#FF8FB1','#FFFFFF'])});taps.push({k:'fly',x:px,y:py,t:0,life:2.6,ps:ps,c:pick(BFC),dir:Math.random()<.5?-1:1,s:rnd(9,12)});}
 };

 /* ============ قيم تبني أجيال: شبكة نجوم ثمانية ذهبية يمرّ عليها ضوء، وفوانيس ترتفع ============ */
 function star8(c,X,Y,r){c.beginPath();for(var q=0;q<2;q++){var o=q*Math.PI/4;for(var i=0;i<4;i++){var a=o+i*Math.PI/2+Math.PI/4;var px=X+Math.cos(a)*r,py=Y+Math.sin(a)*r;if(i===0)c.moveTo(px,py);else c.lineTo(px,py);}c.closePath();}}
 /* ============ المرسم: ورق رسم دافئ، بقع ألوان مائية تتنفس، ونقاط ألوان تطفو ============ */
 var PNT=['228,87,46','46,134,171','242,183,5','122,79,176','46,158,107','233,95,140'];
 var marsam={
  seed:function(){var m=W<700,i;S.b=[];for(i=0;i<(m?4:7);i++)S.b.push({x:rnd(.04,.96)*W,y:rnd(.06,.94)*H,R:rnd(90,200)*(m?.7:1),c:PNT[i%PNT.length],p:rnd(0,TAU),v:rnd(.5,1.1),k:Math.floor(rnd(5,9))});
   S.d=[];for(i=0;i<(m?20:38);i++)S.d.push({x:rnd(0,W),y:rnd(0,H),r:rnd(1.6,4.2),c:pick(PNT),v:rnd(4,11),p:rnd(0,TAU),a:rnd(.16,.32)});
   S.s=[];for(i=0;i<(m?2:4);i++)S.s.push({y:rnd(.15,.85)*H,c:pick(PNT),p:rnd(0,TAU),w:rnd(14,26)});},
  frame:function(t,dt){x.clearRect(0,0,W,H);var i,j;
   for(i=0;i<S.b.length;i++){var b=S.b[i],cx=b.x+Math.sin(t/11000+b.p)*26,cy=b.y+Math.cos(t/13000+b.p)*20,br=.5+.5*Math.sin(t/4200*b.v+b.p);
    x.fillStyle='rgba('+b.c+','+(.05+br*.045).toFixed(3)+')';x.beginPath();
    for(j=0;j<=72;j++){var a=j/72*TAU,rr=b.R*(1+.14*Math.sin(a*b.k+t/3000*b.v+b.p)+.06*Math.sin(a*3-t/2300));var px=cx+Math.cos(a)*rr,py=cy+Math.sin(a)*rr;if(j===0)x.moveTo(px,py);else x.lineTo(px,py);}
    x.closePath();x.fill();}
   /* ضربات فرشاة ناعمة تعبر ببطء */
   x.lineCap='round';for(i=0;i<S.s.length;i++){var st=S.s[i],ph=((t/26000+st.p/TAU)%1),sx=-W*.3+ph*W*1.6;x.strokeStyle='rgba('+st.c+',.06)';x.lineWidth=st.w;x.beginPath();
    for(j=0;j<=24;j++){var qx=sx+j*12,qy=st.y+Math.sin(j/3+t/2600+st.p)*10;if(j===0)x.moveTo(qx,qy);else x.lineTo(qx,qy);}x.stroke();}
   for(i=0;i<S.d.length;i++){var d=S.d[i];d.y-=d.v*dt;if(d.y<-6){d.y=H+6;d.x=rnd(0,W);}x.fillStyle='rgba('+d.c+','+(d.a*(.7+.3*Math.sin(t/1500+d.p))).toFixed(3)+')';x.beginPath();x.arc(d.x+Math.sin(t/3000+d.p)*8,d.y,d.r,0,TAU);x.fill();}},
  tap:function(px,py){var ps=[],c=pick(['#E4572E','#2E86AB','#F2B705','#7A4FB0','#2E9E6B','#E95F8C']);for(var i=0;i<11;i++){var a=rnd(0,TAU);ps.push({a:a,v:rnd(18,58),r:rnd(2,6)});}taps.push({k:'splat',x:px,y:py,t:0,life:1.6,ps:ps,c:c,R:rnd(9,14)});}
 };
 /* ============ رحيق: ورق زيتي هادئ ونسيج سداسي ينجرف وبريق ذهبي ============ */
 function hexPath(c,X,Y,r){c.beginPath();for(var i=0;i<6;i++){var a=Math.PI/6+i*Math.PI/3;var px=X+Math.cos(a)*r,py=Y+Math.sin(a)*r;if(i===0)c.moveTo(px,py);else c.lineTo(px,py);}c.closePath();}
 var raheeq={
  seed:function(){var m=W<700,i;S.r=m?26:34;S.g=[];for(i=0;i<(m?14:26);i++)S.g.push({x:rnd(0,W),y:rnd(0,H),p:rnd(0,TAU),v:rnd(.5,1.2),s:rnd(1,2.4)});},
  frame:function(t,dt){x.clearRect(0,0,W,H);var r=S.r,hw=Math.sqrt(3)*r,ox=(t/90)%hw,oy=(t/140)%(r*3),i,j;
   x.lineWidth=1;for(j=-2;j*r*1.5<H+r*3;j++){for(i=-2;i*hw<W+hw*2;i++){var cx=i*hw+(j%2?hw/2:0)+ox,cy=j*r*1.5+oy,w=.5+.5*Math.sin(t/5200+i*.6+j*.45);
     x.strokeStyle='rgba(30,59,54,'+(.035+w*.035).toFixed(3)+')';hexPath(x,cx,cy,r*.94);x.stroke();
     if(w>.97){x.fillStyle='rgba(184,137,63,.05)';x.fill();}}}
   for(i=0;i<S.g.length;i++){var g=S.g[i];g.y-=g.v*6*dt;if(g.y<-4){g.y=H+4;g.x=rnd(0,W);}var a=Math.max(0,Math.sin(t/1300*g.v+g.p));x.fillStyle='rgba(184,137,63,'+(a*.45).toFixed(3)+')';x.beginPath();x.arc(g.x,g.y,g.s,0,TAU);x.fill();}},
  tap:function(px,py){taps.push({k:'hexgold',x:px,y:py,t:0,life:1.5});}
 };
 /* ============ ليالي الحارة: بيوت تضيء نوافذها ونخيل ويراعات ============ */
 var layali={
  seed:function(){var m=W<700,i;S.st=[];for(i=0;i<Math.round(W*H/7000);i++)S.st.push({x:rnd(0,W),y:Math.pow(Math.random(),1.5)*H*.6,r:rnd(.3,1.2),p:rnd(0,TAU),s:rnd(.4,1.3)});
   S.gy=H*(m?.86:.84);S.h=[];var xx=-20;while(xx<W+40){var w=rnd(54,110)*(m?.7:1),hh=rnd(46,96)*(m?.7:1);var win=[];var cols=Math.max(1,Math.floor(w/26)),rows=Math.max(1,Math.floor(hh/30));
    for(var r=0;r<rows;r++)for(var c=0;c<cols;c++)win.push({x:(c+.5)*w/cols,y:12+r*28,on:Math.random()<.45,tt:rnd(2,14)});S.h.push({x:xx,w:w,h:hh,win:win,dome:Math.random()<.12,tow:Math.random()<.1});xx+=w+rnd(-4,10);}
   S.pa=[];for(i=0;i<(m?3:6);i++)S.pa.push({x:rnd(0,W),h:rnd(90,150)*(m?.75:1),p:rnd(0,TAU)});S.ff=[];for(i=0;i<(m?14:26);i++)S.ff.push({x:rnd(0,W),y:rnd(H*.45,H*.95),p:rnd(0,TAU),v:rnd(.4,1)});},
  frame:function(t,dt){x.clearRect(0,0,W,H);var i,j;
   for(i=0;i<S.st.length;i++){var s=S.st[i];x.globalAlpha=.35+.4*Math.sin(t/1000*s.s+s.p);x.fillStyle='#FFF3D6';x.beginPath();x.arc(s.x,s.y,s.r,0,TAU);x.fill();}
   x.globalAlpha=1;var mx=W<700?W*.12:W*.82,my=W<700?H*.62:H*.16,g=x.createRadialGradient(mx,my,0,mx,my,90);g.addColorStop(0,'rgba(255,236,190,.35)');g.addColorStop(1,'rgba(255,236,190,0)');x.fillStyle=g;x.beginPath();x.arc(mx,my,90,0,TAU);x.fill();
   x.fillStyle='#F7E6B8';x.beginPath();x.arc(mx,my,20,0,TAU);x.fill();x.fillStyle='rgba(20,24,46,1)';x.beginPath();x.arc(mx+9,my-5,18,0,TAU);x.fill();
   for(i=0;i<S.pa.length;i++){var p=S.pa[i],sw=Math.sin(t/2200+p.p)*6,bx=p.x,by=S.gy;x.strokeStyle='rgba(8,12,28,.95)';x.lineWidth=5;x.beginPath();x.moveTo(bx,by);x.quadraticCurveTo(bx+sw*.5,by-p.h*.5,bx+sw,by-p.h);x.stroke();
    x.fillStyle='rgba(8,12,28,.95)';for(j=0;j<7;j++){var a=-Math.PI/2+(j-3)*.42+Math.sin(t/1800+p.p+j)*.05;x.save();x.translate(bx+sw,by-p.h);x.rotate(a);x.beginPath();x.ellipse(p.h*.2,0,p.h*.22,4,0,0,TAU);x.fill();x.restore();}}
   for(i=0;i<S.h.length;i++){var h=S.h[i],hx=h.x,hy=S.gy-h.h;x.fillStyle='#0A0F22';x.fillRect(hx,hy,h.w,h.h+2);
    if(h.dome){x.beginPath();x.arc(hx+h.w/2,hy,h.w*.28,Math.PI,0);x.fill();}if(h.tow){x.fillRect(hx+h.w*.72,hy-26,h.w*.16,28);}
    x.fillStyle='#0A0F22';for(j=0;j<h.w;j+=10)x.fillRect(hx+j,hy-4,6,5);
    for(j=0;j<h.win.length;j++){var w=h.win[j];w.tt-=dt;if(w.tt<=0){w.on=!w.on;w.tt=rnd(3,16);}if(w.on){var fl=.75+.25*Math.sin(t/700+j+i);x.fillStyle='rgba(255,196,110,'+(.55*fl).toFixed(3)+')';x.fillRect(hx+w.x-5,hy+w.y,10,13);x.fillStyle='rgba(255,196,110,.08)';x.beginPath();x.arc(hx+w.x,hy+w.y+6,16,0,TAU);x.fill();}}}
   x.fillStyle='#070B1A';x.fillRect(0,S.gy,W,H-S.gy);
   for(i=0;i<S.ff.length;i++){var f=S.ff[i],fx=f.x+Math.sin(t/2600*f.v+f.p)*40,fy=f.y+Math.cos(t/3100*f.v+f.p)*24,a=Math.max(0,Math.sin(t/900*f.v+f.p));x.globalAlpha=a*.9;var g2=x.createRadialGradient(fx,fy,0,fx,fy,8);g2.addColorStop(0,'rgba(240,255,170,1)');g2.addColorStop(1,'rgba(240,255,170,0)');x.fillStyle=g2;x.beginPath();x.arc(fx,fy,8,0,TAU);x.fill();}
   x.globalAlpha=1;},
  tap:function(px,py){var ps=[];for(var i=0;i<12;i++){var a=rnd(0,TAU);ps.push({vx:Math.cos(a)*rnd(20,70),vy:Math.sin(a)*rnd(20,60)-40,p:rnd(0,TAU)});}taps.push({k:'ffly',x:px,y:py,t:0,life:2.2,ps:ps});}
 };
 var SC={marsam:marsam,raheeq:raheeq,layali:layali,qamar:qamar,duha:duha,muzn:muzn,madar:madar,qalaa:qalaa,english:english,galaxy:galaxy,garden:garden,aurora:aurora,planes:planes};
 function seed(){S={};if(SC[kind])SC[kind].seed();}

 /* ===== الطبقة العليا: تفاعل اللمس ===== */
 function drawTaps(dt){tx.clearRect(0,0,W,H);var keep=[];
  for(var i=0;i<taps.length;i++){var p=taps[i];p.t+=dt;var k=p.t/p.life;if(k>=1)continue;keep.push(p);var e=1-Math.pow(1-k,3),fade=1-k;
   if(p.k==='word'){tx.save();tx.globalAlpha=Math.min(1,k*5)*fade;tx.font='italic 600 '+(W<600?22:26)+'px "Playfair Display",Georgia,serif';tx.textAlign='center';tx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--a2').trim()||'#E8C77E';
    var yy=p.y-14-e*34;tx.shadowColor='rgba(0,0,0,.35)';tx.shadowBlur=8;tx.fillText(p.w,p.x,yy);tx.shadowBlur=0;var wdt=tx.measureText(p.w).width;tx.strokeStyle=tx.fillStyle;tx.lineWidth=1.2;tx.beginPath();tx.moveTo(p.x-wdt/2,yy+7);tx.lineTo(p.x-wdt/2+wdt*Math.min(1,k*2.2),yy+7);tx.stroke();tx.restore();}
   else if(p.k==='splat'){tx.fillStyle=p.c;tx.globalAlpha=fade*.85;tx.beginPath();tx.arc(p.x,p.y,p.R*(.4+e*.8),0,TAU);tx.fill();for(var js=0;js<p.ps.length;js++){var q=p.ps[js],dd=e*q.v;tx.globalAlpha=fade*.8;tx.beginPath();tx.arc(p.x+Math.cos(q.a)*dd,p.y+Math.sin(q.a)*dd+k*k*18,q.r*(1-k*.5),0,TAU);tx.fill();}}
   else if(p.k==='hexgold'){for(var jh=0;jh<3;jh++){var kh=k-jh*.12;if(kh<=0)continue;var eh=1-Math.pow(1-Math.min(1,kh),3);tx.globalAlpha=(1-kh)*.8;tx.strokeStyle=jh?'#1E3B36':'#B8893F';tx.lineWidth=1.8;hexPath(tx,p.x,p.y,6+eh*(14+jh*12));tx.stroke();}}
   else if(p.k==='circles'){var CC=['#D06A82','#E0892F','#2F9E57','#2E9FB8','#5B6FC9'];for(var jc=0;jc<5;jc++){var kc=k-jc*.08;if(kc<=0)continue;var ec=1-Math.pow(1-Math.min(1,kc),3);tx.globalAlpha=(1-kc)*.85;tx.strokeStyle=CC[jc];tx.lineWidth=1.8;tx.beginPath();tx.arc(p.x,p.y,4+ec*(16+jc*14),0,TAU);tx.stroke();}}
   else if(p.k==='ffly'){p.ps.forEach(function(q){var tt=p.t,qx=p.x+q.vx*tt+Math.sin(tt*3+q.p)*10,qy=p.y+q.vy*tt;tx.globalAlpha=fade*Math.max(.2,Math.abs(Math.sin(tt*5+q.p)));var gq=tx.createRadialGradient(qx,qy,0,qx,qy,7);gq.addColorStop(0,'rgba(240,255,170,1)');gq.addColorStop(1,'rgba(240,255,170,0)');tx.fillStyle=gq;tx.beginPath();tx.arc(qx,qy,7,0,TAU);tx.fill();});}
   else if(p.k==='rose'){tx.save();tx.translate(p.x,p.y);tx.rotate(p.r0+k*.6);var R=10+e*44;tx.globalAlpha=fade;tx.strokeStyle='#F2D38E';tx.lineWidth=1.4;star8(tx,0,0,R);tx.stroke();tx.globalAlpha=fade*.6;star8(tx,0,0,R*.55);tx.stroke();tx.beginPath();tx.arc(0,0,R*1.18,0,TAU*Math.min(1,k*1.8));tx.stroke();
    for(var jr=0;jr<8;jr++){var ar=jr*Math.PI/4;tx.globalAlpha=fade;tx.fillStyle='#FFE7AE';tx.beginPath();tx.arc(Math.cos(ar)*R*1.32,Math.sin(ar)*R*1.32,1.8*(1-k*.5),0,TAU);tx.fill();}tx.restore();}
   else if(p.k==='print'){tx.save();tx.translate(p.x,p.y);tx.rotate(p.r0);tx.lineCap='round';for(var jp=0;jp<7;jp++){var kp=Math.min(1,Math.max(0,(k-jp*.05)*2.2));if(kp<=0)continue;var rx=5+jp*4.6,ry=6.5+jp*5.6;tx.globalAlpha=fade*.85;tx.strokeStyle=jp%2?'rgba(111,143,101,1)':'rgba(150,120,80,.9)';tx.lineWidth=1.3;
     var st=(jp*.9)%TAU,gap=.5+(jp%3)*.35;tx.beginPath();tx.ellipse(0,0,rx*(1+e*.25),ry*(1+e*.25),0,st,st+(TAU-gap)*kp);tx.stroke();}tx.restore();}
   else if(p.k==='burst'){tx.globalAlpha=fade*.7;tx.strokeStyle='#F3D28A';tx.lineWidth=1.2;tx.beginPath();tx.arc(p.x,p.y,6+e*46,0,TAU);tx.stroke();
    p.ps.forEach(function(q){var d=e;tx.globalAlpha=fade;tx.fillStyle=q.c;tx.beginPath();tx.arc(p.x+q.vx*d*.55,p.y+q.vy*d*.55,q.r*(1-k*.5),0,TAU);tx.fill();});
    tx.globalAlpha=fade;tx.fillStyle='#fff';tx.save();tx.translate(p.x,p.y);tx.rotate(k*2);var s=7*(1-k);tx.beginPath();tx.moveTo(0,-s*2);tx.lineTo(s*.5,-s*.5);tx.lineTo(s*2,0);tx.lineTo(s*.5,s*.5);tx.lineTo(0,s*2);tx.lineTo(-s*.5,s*.5);tx.lineTo(-s*2,0);tx.lineTo(-s*.5,-s*.5);tx.fill();tx.restore();}
   else if(p.k==='leaves'){p.ps.forEach(function(q){var tt=p.t;var qx=p.x+q.vx*tt,qy=p.y+q.vy*tt+120*tt*tt;tx.save();tx.translate(qx,qy);tx.rotate(q.r+q.vr*tt);tx.globalAlpha=fade;if(q.bl){tx.fillStyle='#FFF4E0';blossom(tx,q.s*.8);tx.fillStyle='#E6C873';tx.beginPath();tx.arc(0,0,q.s*.18,0,TAU);tx.fill();}else{tx.fillStyle=q.c;leafPath(tx,q.s);tx.fill();}tx.restore();});}
   else if(p.k==='ripple'){for(var j=0;j<3;j++){var kk=k-j*.14;if(kk<=0)continue;var ee=1-Math.pow(1-Math.min(1,kk),3);tx.globalAlpha=(1-kk)*.8;tx.strokeStyle=j===1?'rgba(190,140,255,1)':'rgba(90,240,190,1)';tx.lineWidth=1.6-j*.3;tx.beginPath();tx.arc(p.x,p.y,8+ee*70,0,TAU);tx.stroke();}}
   else if(p.k==='drop'){for(var j2=0;j2<3;j2++){var k2=k-j2*.16;if(k2<=0)continue;var e2=1-Math.pow(1-Math.min(1,k2),3);tx.globalAlpha=(1-k2)*.85;tx.strokeStyle=j2===1?'rgba(150,215,235,1)':'rgba(232,196,122,1)';tx.lineWidth=1.5-j2*.3;tx.beginPath();tx.ellipse(p.x,p.y,6+e2*58,(6+e2*58)*.38,0,0,TAU);tx.stroke();}
    p.ps.forEach(function(q){var tt=p.t;tx.globalAlpha=fade;tx.fillStyle='rgba(220,238,246,1)';tx.beginPath();tx.arc(p.x+q.vx*tt,p.y+q.vy*tt+160*tt*tt,q.r,0,TAU);tx.fill();});}
   else if(p.k==='atom'){var rr=8+e*40;for(var j3=0;j3<3;j3++){tx.save();tx.translate(p.x,p.y);tx.rotate(p.r0+j3*Math.PI/3+k*1.5);tx.globalAlpha=fade*.85;tx.strokeStyle=j3===1?'#8FD0E6':'#E8C27A';tx.lineWidth=1.2;tx.beginPath();tx.ellipse(0,0,rr,rr*.36,0,0,TAU);tx.stroke();var aa=k*TAU*1.4+j3*2;tx.fillStyle=tx.strokeStyle;tx.beginPath();tx.arc(Math.cos(aa)*rr,Math.sin(aa)*rr*.36,2.6,0,TAU);tx.fill();tx.restore();}
    tx.globalAlpha=fade;tx.fillStyle='#F3D28A';tx.beginPath();tx.arc(p.x,p.y,4*(1-k*.4),0,TAU);tx.fill();}
   else if(p.k==='dust'){p.ps.forEach(function(q){var tt=p.t;tx.globalAlpha=fade;tx.fillStyle='#C9A05A';tx.beginPath();tx.arc(p.x+q.vx*tt,p.y+q.vy*tt+40*tt*tt,q.r*(1-k*.4),0,TAU);tx.fill();});tx.globalAlpha=fade*.6;tx.strokeStyle='#B5835A';tx.lineWidth=1;tx.beginPath();tx.arc(p.x,p.y,4+e*30,0,TAU);tx.stroke();}
   else if(p.k==='plane'){var px=p.x+p.dir*e*Math.min(W*.6,360),py=p.y-e*120+Math.sin(e*Math.PI*1.4)*30;p.tr.push([px,py]);tx.setLineDash([3,6]);tx.globalAlpha=fade*.8;tx.strokeStyle='rgba(176,110,86,.7)';tx.lineWidth=1.3;tx.beginPath();p.tr.forEach(function(q,j){if(j)tx.lineTo(q[0],q[1]);else tx.moveTo(q[0],q[1]);});tx.stroke();tx.setLineDash([]);
    var pr=p.tr.length>1?p.tr[p.tr.length-2]:[p.x,p.y];tx.save();tx.translate(px,py);tx.rotate(Math.atan2(py-pr[1],px-pr[0]));tx.globalAlpha=fade;plane(tx,13);tx.restore();}
   else if(p.k==='constel'){var pts=[[p.x,p.y]].concat(p.ps.map(function(q){return [q.x,q.y];}));tx.lineWidth=.8;
    for(var j4=1;j4<pts.length;j4++){var kk4=Math.min(1,Math.max(0,(k-.08*j4)*3.2));if(kk4<=0)continue;tx.globalAlpha=fade*.55;tx.strokeStyle='rgba(225,232,255,1)';tx.beginPath();tx.moveTo(pts[j4-1][0],pts[j4-1][1]);tx.lineTo(pts[j4-1][0]+(pts[j4][0]-pts[j4-1][0])*kk4,pts[j4-1][1]+(pts[j4][1]-pts[j4-1][1])*kk4);tx.stroke();}
    pts.forEach(function(q,j){var a4=Math.min(1,Math.max(0,(k-.08*j)*4));tx.globalAlpha=fade*a4;var g4=tx.createRadialGradient(q[0],q[1],0,q[0],q[1],j?7:10);g4.addColorStop(0,'rgba(255,248,225,1)');g4.addColorStop(1,'rgba(255,248,225,0)');tx.fillStyle=g4;tx.beginPath();tx.arc(q[0],q[1],j?7:10,0,TAU);tx.fill();tx.fillStyle='#fff';tx.beginPath();tx.arc(q[0],q[1],j?1.3:1.9,0,TAU);tx.fill();});}
   else if(p.k==='fly'){p.ps.forEach(function(q){var tt=p.t,dd=q.v*Math.min(tt,1);tx.save();tx.translate(p.x+Math.cos(q.a)*dd,p.y+Math.sin(q.a)*dd+20*tt*tt);tx.rotate(q.a+tt*2);tx.globalAlpha=Math.max(0,1-k*1.6);tx.fillStyle=q.c;tx.beginPath();tx.ellipse(0,0,4.5,2.4,0,0,TAU);tx.fill();tx.restore();});
    var fx2=p.x+p.dir*Math.sin(p.t*2.2)*28+p.dir*e*40,fy2=p.y-e*150;tx.globalAlpha=Math.min(1,k*6)*Math.min(1,fade*2.5);butterfly(tx,fx2,fy2,p.s*(.6+.4*Math.min(1,k*4)),p.t*22,Math.sin(p.t*2.2)*.3,p.c);}
  }
  taps=keep;tx.globalAlpha=1;}

 var lastT=-1;
 function loop(t){if(t===lastT)return;lastT=t;raf=requestAnimationFrame(loop);if(document.hidden)return;var dt=Math.min(.05,(t-last)/1000||0);last=t;if(SC[kind])SC[kind].frame(t,dt);drawTaps(dt);}
 function onTap(e){if(REDUCED||!SC[kind])return;if(e.target.closest('input,textarea,select,.dlg .box,.lb'))return;if(e.pointerType==='mouse'&&e.button!==0)return;SC[kind].tap(e.clientX,e.clientY);if(!raf)raf=requestAnimationFrame(loop);}
 return {start:function(k){kind=k;var fx=$('.fx');if(!fx)return;
   if(!cv){cv=document.createElement('canvas');cv.className='sky';fx.insertBefore(cv,fx.firstChild);x=cv.getContext('2d');
    tv=document.createElement('canvas');tv.className='fxtop';tv.setAttribute('aria-hidden','true');document.body.appendChild(tv);tx=tv.getContext('2d');
    addEventListener('resize',function(){size();});document.addEventListener('pointerdown',onTap,{passive:true});}
   else if(cv.parentNode!==fx)fx.insertBefore(cv,fx.firstChild);
   taps=[];size();cancelAnimationFrame(raf);raf=0;last=performance.now();
   if(REDUCED){if(SC[kind])SC[kind].frame(0,0);}else raf=requestAnimationFrame(loop);}};
})();
})();
