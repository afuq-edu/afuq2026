/* ============================================================
   المشهد الحيّ شبه الواقعي · محرّك مشترك (رُواء، ذُرى، دفّة)
   - الإضاءة تُحسب من ارتفاع الشمس الحقيقي (خط عرض مسقط واليوم من السنة)،
     فتتغيّر ألوان السماء والظلال والنوافذ مع الوقت كما في الواقع.
   - طبقات منفصلة: السماء، الغيوم (تتحرّك على المعالج الرسومي)، الجبال، القريب.
   - لا صور: كل شيء يُرسم متجهًا، والوزن خفيف على الجوال.
   SCENE.html(kind)  kind: garden | peaks | campus
   ============================================================ */
(function(){'use strict';
var W=800,H=420,HZ=262,UID=0;
function P(h){h=h.replace('#','');return [parseInt(h.substr(0,2),16),parseInt(h.substr(2,2),16),parseInt(h.substr(4,2),16)];}
function S(c){return 'rgb('+Math.round(c[0])+','+Math.round(c[1])+','+Math.round(c[2])+')';}
function mix(a,b,t){return [a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];}
function mul(a,b){return [a[0]*b[0]/255,a[1]*b[1]/255,a[2]*b[2]/255];}
function cl(v,a,b){return Math.max(a,Math.min(b,v));}
function f(n){return (Math.round(n*10)/10)+'';}
function rng(seed){var s=seed%233280;return function(){s=(s*9301+49297)%233280;return s/233280;};}

/* ---------- الشمس: ارتفاعها وموضعها ---------- */
var LAT=23.6*Math.PI/180;
function solar(d){var st=new Date(d.getFullYear(),0,0),N=Math.floor((d-st)/864e5);
  var dec=-23.44*Math.PI/180*Math.cos(2*Math.PI*(N+10)/365),ts=d.getHours()+d.getMinutes()/60-.1;
  var ha=(ts-12)*15*Math.PI/180,e=Math.asin(Math.sin(LAT)*Math.sin(dec)+Math.cos(LAT)*Math.cos(dec)*Math.cos(ha))*180/Math.PI;
  var h0=Math.acos(-Math.tan(LAT)*Math.tan(dec))*180/Math.PI/15;
  return {e:e,ts:ts,h0:h0,hx:(ts-12)/h0};}
/* مفاتيح الإضاءة حسب ارتفاع الشمس بالدرجات */
var KEYS=[
 [-90,{z:'#03061A',m:'#0A1230',h:'#1B2550',amb:'#3D4C7C',sun:'#C5D4FF',haze:'#18223F',n:1,cl:'#33406A',cs:'#0F1632',g:1}],
 [-14,{z:'#03061A',m:'#0A1230',h:'#1B2550',amb:'#3D4C7C',sun:'#C5D4FF',haze:'#18223F',n:1,cl:'#33406A',cs:'#0F1632',g:1}],
 [-8,{z:'#0B1236',m:'#2A2A5C',h:'#6E4A72',amb:'#57557F',sun:'#D9A0B0',haze:'#3B3560',n:.75,cl:'#6C5A86',cs:'#1F1B40',g:1}],
 [-3,{z:'#1D2A5E',m:'#7A5A86',h:'#F0906A',amb:'#8C7E9C',sun:'#FFAE84',haze:'#8E6F8E',n:.3,cl:'#F6A68E',cs:'#4B4674',g:.85}],
 [.5,{z:'#2E4C92',m:'#C08A92',h:'#FFA95C',amb:'#C79C8C',sun:'#FF9450',haze:'#C99486',n:.05,cl:'#FFC096',cs:'#7B6A92',g:.5}],
 [6,{z:'#3B6FB4',m:'#A9BCD8',h:'#FFD9A6',amb:'#E6CBAC',sun:'#FFD08A',haze:'#DCC6B4',n:0,cl:'#FFEBCF',cs:'#A79CB6',g:.12}],
 [15,{z:'#2F7CC8',m:'#84BDE6',h:'#E6EEEE',amb:'#F6EFDF',sun:'#FFF1CC',haze:'#C6DAE4',n:0,cl:'#FFFDF6',cs:'#B6C4D6',g:0}],
 [34,{z:'#2475C6',m:'#72B5E8',h:'#D8EAF4',amb:'#FFFFFF',sun:'#FFFBEA',haze:'#C2DBEA',n:0,cl:'#FFFFFF',cs:'#BECBDA',g:0}],
 [90,{z:'#1E6EC2',m:'#69AFE6',h:'#D2E7F4',amb:'#FFFFFF',sun:'#FFFDF2',haze:'#C4DDEC',n:0,cl:'#FFFFFF',cs:'#C4D0DE',g:0}]];
function light(d){var so=solar(d),e=so.e,a=KEYS[0],b=KEYS[KEYS.length-1],i;
  for(i=0;i<KEYS.length-1;i++)if(e>=KEYS[i][0]&&e<=KEYS[i+1][0]){a=KEYS[i];b=KEYS[i+1];break;}
  var t=b[0]===a[0]?0:(e-a[0])/(b[0]-a[0]);t=t*t*(3-2*t);var L={e:e,hx:so.hx,ts:so.ts,h0:so.h0};
  ['z','m','h','amb','sun','haze','cl','cs'].forEach(function(k){L[k]=mix(P(a[1][k]),P(b[1][k]),t);});
  L.n=a[1].n+(b[1].n-a[1].n)*t;L.g=a[1].g+(b[1].g-a[1].g)*t;
  L.day=e>-4;
  if(L.day){L.sx=400+cl(so.hx,-1.08,1.08)*330;L.sy=206-Math.sin(cl(e,-6,90)*Math.PI/180)*205;}
  else{var ss=12+so.h0,tn=((so.ts-ss+24)%24)/(24-2*so.h0);L.sx=150+tn*500;L.sy=205-Math.sin(tn*Math.PI)*150;}
  L.s=cl((L.sx-400)/300,-1,1);                       /* جهة الضوء: سالب = من اليسار */
  L.sh=L.day?cl(e/9,0,1)*.34:.14;                    /* قوة الظل */
  L.sl=cl(1/Math.tan(cl(L.day?e:35,7,80)*Math.PI/180),.25,5); /* طول الظل */
  L.k=e<-10?'night':e<-.5?(so.hx<0?'dawn':'dusk'):e<10?(so.hx<0?'sunrise':'sunset'):so.hx<-.4?'day':so.hx<.3?'noon':'asr';
  return L;}
var NAMES={night:'الليل',dawn:'الفجر',dusk:'الغسق',sunrise:'الشروق',sunset:'الغروب',day:'الضحى',noon:'الظهيرة',asr:'العصر'};

/* ---------- ألوان المواد تحت الإضاءة ---------- */
var L;
function C(base,depth,k){var c=mul(typeof base==='string'?P(base):base,L.amb);
  if(k!=null){if(k>1)c=mix(c,mul(c,[330,315,290]).map(function(v){return Math.min(255,v);}),cl(k-1,0,1)*(L.day?1:.5));
    else c=mix([c[0]*k,c[1]*k,c[2]*k],mul(c,L.z),.16*(1-k)*2);}
  return depth?mix(c,L.haze,cl(depth,0,1)*(L.e>12?.72:.86)):c;}
function Cs(base,depth,k){return S(C(base,depth,k));}
function a(o){var s='';for(var k in o)s+=' '+k+'="'+o[k]+'"';return s;}

/* ---------- أشكال: سلاسل جبلية كسيرية ---------- */
function ridge(rnd,ctrl,d0,rough,iter){var p=ctrl.map(function(q){return [q[0],q[1]];}),d=d0,i,j,np;
  for(i=0;i<iter;i++){np=[];for(j=0;j<p.length-1;j++){var A=p[j],B=p[j+1];np.push(A,[(A[0]+B[0])/2,(A[1]+B[1])/2+(rnd()-.5)*d*Math.min(1,(B[0]-A[0])/60)]);}np.push(p[p.length-1]);p=np;d*=rough;}return p;}
function pth(p,bot){var s='M'+f(p[0][0])+' '+f(p[0][1]);for(var i=1;i<p.length;i++)s+='L'+f(p[i][0])+' '+f(p[i][1]);return s+'V'+bot+'H'+f(p[0][0])+'z';}
function facets(p,bot,rnd,id){var dir=L.s<=0?1:-1,o='',i,j,n=p.length,w=10;
  for(i=w;i<n-w;i++){var pk=true;for(j=1;j<=w;j++)if(p[i-j][1]<p[i][1]||p[i+j][1]<p[i][1]){pk=false;break;}if(!pk)continue;
    var q=[p[i]],k=i,lim=0;while(k+dir>0&&k+dir<n-1&&lim<26){k+=dir;lim++;q.push(p[k]);if(lim>5&&p[k+dir]&&p[k+dir][1]<p[k][1]-.6)break;}
    var end=q[q.length-1],s='M'+f(p[i][0])+' '+f(p[i][1]);for(j=1;j<q.length;j++)s+='L'+f(q[j][0])+' '+f(q[j][1]);
    s+='L'+f(end[0]+dir*(18+rnd()*30))+' '+bot;var bx=p[i][0]+dir*(10+rnd()*26),steps=5,yy;
    s+='L'+f(bx)+' '+bot;for(j=steps-1;j>0;j--){yy=p[i][1]+(bot-p[i][1])*j/steps;s+='L'+f(p[i][0]+(bx-p[i][0])*j/steps+(rnd()-.5)*9)+' '+f(yy);}
    o+='<path d="'+s+'z" fill="url(#'+id+')"/>';i+=w;}
  return o;}
function mountain(o){/* o:{pts,base,depth,bot,tex,seed} */
  var id='m'+(UID++),rnd=rng(o.seed||5),top=C(o.base,o.depth),bt=mix(top,L.haze,cl(.3+o.depth*.4,0,.85)),ymin=1e9;
  o.pts.forEach(function(q){if(q[1]<ymin)ymin=q[1];});
  var sh=C(o.base,o.depth,.56),d=pth(o.pts,o.bot);
  var h='<defs><linearGradient id="'+id+'" gradientUnits="userSpaceOnUse" x1="0" y1="'+f(ymin)+'" x2="0" y2="'+o.bot+'"><stop offset="0" stop-color="'+S(top)+'"/><stop offset="'+(o.fade||.8)+'" stop-color="'+S(bt)+'"/></linearGradient>'+
    '<linearGradient id="'+id+'s" gradientUnits="userSpaceOnUse" x1="0" y1="'+f(ymin)+'" x2="0" y2="'+o.bot+'"><stop offset="0" stop-color="'+S(sh)+'" stop-opacity="'+f((L.day?.8:.4)*(1-o.depth*.5))+'"/><stop offset="'+(o.fade||.8)+'" stop-color="'+S(sh)+'" stop-opacity="0"/></linearGradient>'+
    '<clipPath id="'+id+'c"><path d="'+d+'"/></clipPath></defs>'+
    '<path d="'+d+'" fill="url(#'+id+')"/><g clip-path="url(#'+id+'c)"><g style="filter:blur('+(o.soft||3.5)+'px)">'+facets(o.pts,o.bot,rnd,id+'s')+'</g>'+
    (o.tex?'<rect x="0" y="'+f(ymin-4)+'" width="'+W+'" height="'+f(o.bot-ymin+8)+'" filter="url(#'+o.tex+')" opacity="'+f((o.texOp||.55)*(1-o.depth*.6))+'" style="mix-blend-mode:soft-light"/>':'')+
    /* حافة مضاءة رفيعة على القمة */
    '<path d="'+d+'" fill="none" stroke="'+S(mix(top,L.sun,.5))+'" stroke-width="1.1" opacity="'+f((L.day?.5:.22)*(1-o.depth*.5))+'"/></g>';
  return h;}
function texF(id,fx,fy,oct,scale,seed){var az=L.s<=0?215:325,el=cl(L.day?L.e:40,14,62);
  return '<filter id="'+id+'" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="'+fx+' '+fy+'" numOctaves="'+oct+'" seed="'+(seed||3)+'"/><feDiffuseLighting surfaceScale="'+scale+'" diffuseConstant="'+f(.52/Math.sin(el*Math.PI/180))+'" lighting-color="#fff"><feDistantLight azimuth="'+az+'" elevation="'+f(el)+'"/></feDiffuseLighting></filter>';}
function leafF(id,fr,sc,blur){return '<filter id="'+id+'" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="'+fr+'" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="'+sc+'" xChannelSelector="R" yChannelSelector="G"/>'+(blur?'<feGaussianBlur stdDeviation="'+blur+'"/>':'')+'</filter>';}

/* ---------- السماء ---------- */
function sky(){var id='k'+(UID++),h='<defs><linearGradient id="'+id+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+S(L.z)+'"/><stop offset=".38" stop-color="'+S(L.m)+'"/><stop offset=".64" stop-color="'+S(L.h)+'"/><stop offset="1" stop-color="'+S(L.h)+'"/></linearGradient>'+
   '<radialGradient id="'+id+'g"><stop offset="0" stop-color="'+S(L.sun)+'" stop-opacity=".85"/><stop offset=".35" stop-color="'+S(L.sun)+'" stop-opacity=".3"/><stop offset="1" stop-color="'+S(L.sun)+'" stop-opacity="0"/></radialGradient>'+
   '<radialGradient id="'+id+'d"><stop offset="0" stop-color="#fff"/><stop offset=".55" stop-color="'+S(mix(L.sun,[255,255,255],.55))+'"/><stop offset="1" stop-color="'+S(L.sun)+'" stop-opacity="0"/></radialGradient>'+
   '<radialGradient id="'+id+'mw"><stop offset="0" stop-color="#C9D3FF" stop-opacity=".5"/><stop offset=".5" stop-color="#9CA9E6" stop-opacity=".16"/><stop offset="1" stop-color="#9CA9E6" stop-opacity="0"/></radialGradient>'+
   '<radialGradient id="'+id+'mn" cx=".38" cy=".36" r=".75"><stop offset="0" stop-color="#FFFDF2"/><stop offset=".6" stop-color="#E9E4CF"/><stop offset="1" stop-color="#9A9AAE"/></radialGradient>'+
   '<filter id="'+id+'b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9"/></filter></defs>'+
   '<rect width="'+W+'" height="'+H+'" fill="url(#'+id+')"/>';
  if(L.n>.03){var r=rng(77),st='',i,x,y,t;
    h+='<g opacity="'+f(L.n)+'"><g transform="rotate(-24 400 120)"><ellipse cx="400" cy="120" rx="560" ry="54" fill="url(#'+id+'mw)"/><ellipse cx="430" cy="126" rx="330" ry="20" fill="#0B0F26" opacity=".28" filter="url(#'+id+'b)"/>';
    for(i=0;i<150;i++){x=-120+r()*1040;y=120+(r()+r()+r()-1.5)*40;h+='<circle cx="'+f(x)+'" cy="'+f(y)+'" r="'+f(.25+r()*.55)+'" fill="#fff" opacity="'+f(.35+r()*.6)+'"/>';}
    h+='</g>';
    for(i=0;i<130;i++){x=r()*W;y=r()*HZ;t=r();st+='<circle cx="'+f(x)+'" cy="'+f(y)+'" r="'+f(.3+Math.pow(r(),3)*1.3)+'" fill="'+(t<.15?'#FFD9B8':t<.4?'#BFD2FF':'#fff')+'" opacity="'+f((.4+r()*.6)*(.35+.65*(1-y/HZ)))+'"/>';}
    h+=st+'</g>';}
  /* وهج الأفق */
  var hg=cl(1-Math.abs(L.e)/16,0,1);if(L.day&&hg>0)h+='<ellipse cx="'+f(L.sx)+'" cy="'+(HZ-6)+'" rx="470" ry="'+f(90+hg*80)+'" fill="url(#'+id+'g)" opacity="'+f(hg*.9)+'"/>';
  if(L.day){var low=cl(1-L.e/22,0,1),rd=11+low*7;
    h+='<g transform="translate('+f(L.sx)+' '+f(L.sy)+')"><circle r="'+f(150+low*60)+'" fill="url(#'+id+'g)" opacity="'+f(.5+low*.25)+'"/><circle r="'+f(rd*3.4)+'" fill="url(#'+id+'g)"/><ellipse rx="'+f(170+low*90)+'" ry="2.2" fill="'+S(L.sun)+'" opacity="'+f(.2+low*.2)+'"/><circle r="'+f(rd*1.7)+'" fill="url(#'+id+'d)"/><circle r="'+f(rd*.86)+'" fill="'+S(mix(L.sun,[255,255,255],.82-low*.35))+'"/></g>';}
  else{h+='<g transform="translate('+f(L.sx)+' '+f(L.sy)+')"><circle r="95" fill="url(#'+id+'mw)" opacity=".9"/><circle r="34" fill="url(#'+id+'mw)"/><circle r="13" fill="url(#'+id+'mn)"/>'+
    '<g fill="#8F8FA6" opacity=".38"><ellipse cx="-4" cy="-3" rx="3.6" ry="2.8"/><ellipse cx="3.4" cy="3.6" rx="2.6" ry="2"/><circle cx="2.6" cy="-6.4" r="1.6"/><circle cx="-6.5" cy="4.6" r="1.3"/><ellipse cx="6.6" cy="-1.4" rx="1.4" ry="2"/></g></g>';}
  /* سحب رقيقة عالية */
  var r2=rng(31),ci='';for(var j=0;j<7;j++){var cx=r2()*W,cy=40+r2()*120;ci+='<ellipse cx="'+f(cx)+'" cy="'+f(cy)+'" rx="'+f(70+r2()*110)+'" ry="'+f(2.4+r2()*3.4)+'" transform="rotate('+f(-6+r2()*5)+' '+f(cx)+' '+f(cy)+')"/>';}
  h+='<g fill="'+S(L.cl)+'" opacity="'+f(.26-L.n*.18)+'" style="filter:blur(3.5px)">'+ci+'</g>';
  return svg('sky',h);}
function twinkle(){if(L.n<.2)return '';var r=rng(123),g=['',''],i;for(i=0;i<34;i++)g[i%2]+='<circle cx="'+f(r()*W)+'" cy="'+f(r()*(HZ-40))+'" r="'+f(.7+r()*.9)+'" fill="#fff"/>';
  return '<svg class="L tw" viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none" style="opacity:'+f(L.n)+'"><g class="t1">'+g[0]+'</g><g class="t2">'+g[1]+'</g></svg>';}
function svg(c,inner,extra){return '<svg class="L '+c+'" viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none"'+(extra||'')+'>'+inner+'</svg>';}

/* ---------- الغيوم: كتل ركامية بحواف عضوية ---------- */
function cloudSvg(seed,n,yMin,yMax,sMin,sMax){var id='c'+(UID++),r=rng(seed),h='',i,j;
  var lit=S(L.cl),shd=S(L.cs),rim=S(mix(L.cl,L.sun,.5));
  h+='<defs><radialGradient id="'+id+'" cx="'+f(.5+L.s*.22)+'" cy=".3" r=".72"><stop offset="0" stop-color="'+lit+'"/><stop offset=".55" stop-color="'+lit+'" stop-opacity=".96"/><stop offset="1" stop-color="'+shd+'" stop-opacity=".9"/></radialGradient>'+
    '<linearGradient id="'+id+'b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+shd+'" stop-opacity="0"/><stop offset="1" stop-color="'+shd+'" stop-opacity=".75"/></linearGradient>'+
    '<filter id="'+id+'f" filterUnits="userSpaceOnUse" x="-60" y="0" width="'+(W+120)+'" height="'+HZ+'"><feTurbulence type="fractalNoise" baseFrequency=".022 .034" numOctaves="3" seed="'+seed+'"/><feDisplacementMap in="SourceGraphic" scale="20" xChannelSelector="R" yChannelSelector="G"/><feGaussianBlur stdDeviation="2.2"/></filter></defs><g filter="url(#'+id+'f)">';
  for(i=0;i<n;i++){var cx=(i+.2+r()*.6)*W/n,cy=yMin+r()*(yMax-yMin),s=sMin+r()*(sMax-sMin),w=120*s,k=6+(r()*4|0),g='',base=cy+10*s;
    for(j=0;j<k;j++){var t=j/(k-1),px=cx+(t-.5)*w,pr=w*(.1+.16*Math.sin(Math.PI*t))*(.8+r()*.45);g+='<circle cx="'+f(px)+'" cy="'+f(base-pr*.72)+'" r="'+f(pr)+'" fill="url(#'+id+')"/>';}
    for(j=0;j<3;j++){var px2=cx+(r()-.5)*w*.45,pr2=w*(.14+r()*.1);g+='<circle cx="'+f(px2)+'" cy="'+f(base-pr2*1.5-r()*8*s)+'" r="'+f(pr2)+'" fill="url(#'+id+')"/>';}
    g+='<ellipse cx="'+f(cx)+'" cy="'+f(base-3*s)+'" rx="'+f(w*.56)+'" ry="'+f(9*s)+'" fill="url(#'+id+'b)"/>';
    h+='<g opacity="'+f(.78+r()*.2)+'">'+g+'</g>';}
  h+='</g>';
  return '<svg viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none">'+h+'</svg>';}
function clouds(cls,seed,n,y0,y1,s0,s1,dur){var one=cloudSvg(seed,n,y0,y1,s0,s1),dl=-((Date.now()/1000)%dur);
  return '<div class="L cl '+cls+'" style="animation-duration:'+dur+'s;animation-delay:'+f(dl)+'s;opacity:'+f(.95-L.n*.45)+'">'+one+one+'</div>';}

/* ---------- نبات ---------- */
function palm(x,y,hh,lean,seed,depth,sc){var r=rng(seed),id='p'+(UID++),tx=x+lean,ty=y-hh,i,j,o='';
  var tr=Cs('#8A6F52',depth),trd=Cs('#5E4A36',depth,.7),w0=4.4*sc,w1=2.6*sc;
  var c1x=x+lean*.1,c1y=y-hh*.5;
  o+='<path d="M'+f(x-w0)+' '+f(y)+'Q'+f(c1x-w0)+' '+f(c1y)+' '+f(tx-w1)+' '+f(ty)+'L'+f(tx+w1)+' '+f(ty)+'Q'+f(c1x+w0)+' '+f(c1y)+' '+f(x+w0)+' '+f(y)+'z" fill="'+tr+'"/>';
  o+='<path d="M'+f(x)+' '+f(y)+'Q'+f(c1x)+' '+f(c1y)+' '+f(tx)+' '+f(ty)+'" fill="none" stroke="'+trd+'" stroke-width="'+f(w0*1.7)+'" stroke-dasharray="'+f(1.1*sc)+' '+f(2.6*sc)+'" opacity=".55"/>';
  o+='<path d="M'+f(x+(L.s<=0?w0*.3:-w0*.3))+' '+f(y)+'Q'+f(c1x+(L.s<=0?w0*.45:-w0*.45))+' '+f(c1y)+' '+f(tx+(L.s<=0?w1*.4:-w1*.4))+' '+f(ty)+'" fill="none" stroke="'+trd+'" stroke-width="'+f(w0*.9)+'" opacity=".5"/>';
  var n=sc>.7?17:11,fr=[];for(i=0;i<n;i++){var an=(-205+i*(230/(n-1))+(r()-.5)*14)*Math.PI/180,len=hh*(.52+r()*.2)*(sc>.7?1:1.1);fr.push([an,len,r()]);}
  fr.sort(function(p,q){return Math.abs(Math.cos(p[0]))-Math.abs(Math.cos(q[0]));});
  fr.forEach(function(F,ix){var an=F[0],len=F[1],ex=tx+Math.cos(an)*len,ey=ty+Math.sin(an)*len*.55+len*.42,cxp=tx+Math.cos(an)*len*.55,cyp=ty+Math.sin(an)*len*.75-len*.16;
    var up=Math.sin(an)<-.5,towards=(Math.cos(an)<0)===(L.s<=0),k=up?1.12:towards?1:.7,col=Cs(ix%3?'#4E7A3A':'#5E8A40',depth,k),d='';
    var m=sc>.7?15:8;for(j=1;j<=m;j++){var t=j/m,u=1-t,bx=u*u*tx+2*u*t*cxp+t*t*ex,by=u*u*ty+2*u*t*cyp+t*t*ey,dx=2*u*(cxp-tx)+2*t*(ex-cxp),dy=2*u*(cyp-ty)+2*t*(ey-cyp),dl=Math.sqrt(dx*dx+dy*dy)||1,nx=-dy/dl,ny=dx/dl,ll=len*.2*Math.pow(Math.sin(Math.PI*(t*.9+.08)),.7);
      d+='M'+f(bx)+' '+f(by)+'l'+f(nx*ll+dx/dl*ll*.45)+' '+f(ny*ll+dy/dl*ll*.45+ll*.25)+'M'+f(bx)+' '+f(by)+'l'+f(-nx*ll+dx/dl*ll*.45)+' '+f(-ny*ll+dy/dl*ll*.45+ll*.25);}
    o+='<path d="M'+f(tx)+' '+f(ty)+'Q'+f(cxp)+' '+f(cyp)+' '+f(ex)+' '+f(ey)+'" fill="none" stroke="'+col+'" stroke-width="'+f(1.3*sc)+'" stroke-linecap="round"/><path d="'+d+'" fill="none" stroke="'+col+'" stroke-width="'+f(1*sc)+'" stroke-linecap="round"/>';});
  o+='<circle cx="'+f(tx)+'" cy="'+f(ty+1)+'" r="'+f(3.6*sc)+'" fill="'+Cs('#6B5238',depth)+'"/>';
  if(sc>.7)o+='<g fill="'+Cs('#C98A2E',depth)+'"><ellipse cx="'+f(tx-4*sc)+'" cy="'+f(ty+7*sc)+'" rx="'+f(2.6*sc)+'" ry="'+f(4.4*sc)+'"/><ellipse cx="'+f(tx+4.4*sc)+'" cy="'+f(ty+6*sc)+'" rx="'+f(2.4*sc)+'" ry="'+f(4*sc)+'"/></g>';
  return o;}
function miniPalm(x,y,s,depth,r){var c=Cs('#4F7A3E',depth,.9),t=Cs('#6E5A44',depth),o='<path d="M'+f(x)+' '+f(y)+'v'+f(-9*s)+'" stroke="'+t+'" stroke-width="'+f(1.1*s)+'"/>',i,d='';
  for(i=0;i<7;i++){var an=(-200+i*36+(r()-.5)*10)*Math.PI/180;d+='M'+f(x)+' '+f(y-9*s)+'q'+f(Math.cos(an)*4*s)+' '+f(Math.sin(an)*5*s-2*s)+' '+f(Math.cos(an)*7*s)+' '+f(Math.sin(an)*3.4*s+2.2*s);}
  return o+'<path d="'+d+'" fill="none" stroke="'+c+'" stroke-width="'+f(1.25*s)+'" stroke-linecap="round"/>';}
function canopy(x,y,rx,ry,seed,base,depth,filt){var r=rng(seed),o='',i,n=Math.round(10+rx/3),dx=L.s<=0?-1:1;
  var dk=Cs(base,depth,.55),md=Cs(base,depth,.86),lt=Cs(base,depth,1.2),g1='',g2='',g3='';
  for(i=0;i<n;i++){var an=r()*6.283,rr=Math.sqrt(r()),px=x+Math.cos(an)*rx*rr*.8,py=y+Math.sin(an)*ry*rr*.8,pr=(.28+r()*.22)*Math.min(rx,ry*1.5);
    g1+='<circle cx="'+f(px+dx*-2)+'" cy="'+f(py+3)+'" r="'+f(pr)+'"/>';g2+='<circle cx="'+f(px)+'" cy="'+f(py)+'" r="'+f(pr*.86)+'"/>';
    if(py<y+ry*.2)g3+='<circle cx="'+f(px+dx*pr*.3)+'" cy="'+f(py-pr*.32)+'" r="'+f(pr*.5)+'"/>';}
  return '<g'+(filt?' filter="url(#'+filt+')"':'')+'><g fill="'+dk+'">'+g1+'</g><g fill="'+md+'">'+g2+'</g><g fill="'+lt+'" opacity=".8">'+g3+'</g></g>';}
function tree(x,y,hh,rx,ry,seed,base,depth,filt){var t=Cs('#5C4632',depth,.8);
  return '<path d="M'+f(x-2.6)+' '+f(y)+'C'+f(x-1)+' '+f(y-hh*.4)+' '+f(x-3)+' '+f(y-hh*.6)+' '+f(x-.5)+' '+f(y-hh)+'L'+f(x+2)+' '+f(y-hh)+'C'+f(x+1)+' '+f(y-hh*.6)+' '+f(x+3)+' '+f(y-hh*.4)+' '+f(x+3)+' '+f(y)+'z" fill="'+t+'"/>'+
   '<path d="M'+f(x)+' '+f(y-hh*.55)+'q'+f(-rx*.4)+' '+f(-hh*.2)+' '+f(-rx*.55)+' '+f(-hh*.42)+'M'+f(x+1)+' '+f(y-hh*.62)+'q'+f(rx*.3)+' '+f(-hh*.16)+' '+f(rx*.5)+' '+f(-hh*.36)+'" stroke="'+t+'" stroke-width="2" fill="none" stroke-linecap="round"/>'+
   canopy(x,y-hh-ry*.45,rx,ry,seed,base,depth,filt);}
function shadowE(x,y,w,hh){/* ظل مسقَط بيضوي لجسم عند (x,y) ارتفاعه hh */
  var len=cl(hh*L.sl*.42,4,170),dx=-L.s*len;return '<ellipse cx="'+f(x+dx*.5)+'" cy="'+f(y+1.5)+'" rx="'+f(w+Math.abs(dx)*.5)+'" ry="'+f(2.6+w*.12)+'" fill="#0A1420" opacity="'+f(L.sh)+'"/>';}

/* ---------- مبنى المدرسة (طراز عُماني حديث) ---------- */
function school(x0,gy,opt){opt=opt||{};var id='b'+(UID++),o='',i,wingW=opt.wing||128,cw=66,x1=x0+wingW,x2=x1+cw,x3=x2+wingW,top=gy-76,ctop=gy-102,depth=opt.depth||0;
  var wall='#EDE0CA',lit=C(wall,depth,L.s<=0?1.06:.98),shade=C(wall,depth,.74),wallTop=S(lit),wallBot=S(mix(lit,C(wall,depth,.8),.55));
  var sideLit=L.s>0?C(wall,depth,1.1):C(wall,depth,.62),trim=Cs('#D9C6A6',depth,.92),trimD=Cs('#B9A27E',depth,.8),wood=Cs('#6A4A2E',depth),woodD=Cs('#4A321E',depth,.8);
  var gl=mix(mix(L.m,[30,44,60],.55),P('#FFD27A'),L.g*.92),glass=S(gl),glassHi=S(mix(gl,mix(L.h,P('#FFF1C4'),L.g),.6)),inner=S(mix(C('#3A3028',depth,.6),P('#FFC76A'),L.g*.55));
  o+='<defs><linearGradient id="'+id+'w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+wallTop+'"/><stop offset="1" stop-color="'+wallBot+'"/></linearGradient>'+
   '<linearGradient id="'+id+'g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+glassHi+'"/><stop offset=".55" stop-color="'+glass+'"/><stop offset="1" stop-color="'+glass+'"/></linearGradient>'+
   '<linearGradient id="'+id+'a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+S(mix(C('#1E1812',depth,.5),P('#E9A54A'),L.g*.5))+'"/><stop offset="1" stop-color="'+inner+'"/></linearGradient>'+
   '<linearGradient id="'+id+'o" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient>'+
   '<linearGradient id="'+id+'s" x1="'+(L.s<=0?0:1)+'" y1="0" x2="'+(L.s<=0?1:0)+'" y2="0"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#0A1830" stop-opacity="'+f(.16+L.sh*.3)+'"/></linearGradient>'+
   '<radialGradient id="'+id+'l"><stop offset="0" stop-color="#FFD98A" stop-opacity=".9"/><stop offset="1" stop-color="#FFD98A" stop-opacity="0"/></radialGradient></defs>';
  /* ظل المبنى على الأرض */
  var sl=cl(76*L.sl*.38,6,150),sdx=-L.s*sl;
  o+='<path d="M'+x0+' '+gy+'L'+f(x0+sdx)+' '+f(gy+7+sl*.05)+'L'+f(x3+sdx+10)+' '+f(gy+7+sl*.05)+'L'+(x3+10)+' '+gy+'z" fill="#0A1420" opacity="'+f(L.sh*.9)+'"/>';
  /* الواجهة الجانبية (عمق) */
  o+='<path d="M'+x3+' '+top+'l14 -5V'+(gy-3)+'L'+x3+' '+gy+'z" fill="'+S(sideLit)+'"/><path d="M'+x3+' '+(top-5)+'l14 -5v5l-14 5z" fill="'+trimD+'"/>';
  function wing(xa){var s='',w=wingW,n=4,gap=w/n,k;
    s+='<rect x="'+xa+'" y="'+top+'" width="'+w+'" height="'+(gy-top)+'" fill="url(#'+id+'w)"/>';
    /* شرفات السور */
    for(k=0;k<Math.floor(w/8);k++)s+='<rect x="'+f(xa+k*8+1)+'" y="'+(top-5)+'" width="5" height="5.5" fill="'+wallTop+'"/>';
    s+='<rect x="'+xa+'" y="'+(top-.5)+'" width="'+w+'" height="2.2" fill="'+trimD+'" opacity=".7"/><rect x="'+xa+'" y="'+(top+35)+'" width="'+w+'" height="2.4" fill="'+trim+'"/><rect x="'+xa+'" y="'+(top+37.4)+'" width="'+w+'" height="1.6" fill="#000" opacity=".12"/>';
    for(k=0;k<n;k++){var cx=xa+gap*(k+.5);
      /* نافذة علوية بقوس مدبب */
      s+='<path d="M'+f(cx-6.5)+' '+(top+30)+'V'+(top+16)+'Q'+f(cx-6.5)+' '+(top+8)+' '+f(cx)+' '+(top+5.5)+'Q'+f(cx+6.5)+' '+(top+8)+' '+f(cx+6.5)+' '+(top+16)+'V'+(top+30)+'z" fill="'+trimD+'"/>'+
         '<path d="M'+f(cx-5)+' '+(top+29)+'V'+(top+16.5)+'Q'+f(cx-5)+' '+(top+10)+' '+f(cx)+' '+(top+8)+'Q'+f(cx+5)+' '+(top+10)+' '+f(cx+5)+' '+(top+16.5)+'V'+(top+29)+'z" fill="url(#'+id+'g)"/>'+
         '<path d="M'+f(cx)+' '+(top+8.4)+'V'+(top+29)+'M'+f(cx-5)+' '+(top+18)+'h10" stroke="'+woodD+'" stroke-width=".9"/><rect x="'+f(cx-7.5)+'" y="'+(top+30)+'" width="15" height="1.8" fill="'+trim+'"/>';
      /* رواق أرضي: قوس عميق */
      s+='<path d="M'+f(cx-10.5)+' '+gy+'V'+(gy-22)+'Q'+f(cx-10.5)+' '+(gy-33)+' '+f(cx)+' '+(gy-36)+'Q'+f(cx+10.5)+' '+(gy-33)+' '+f(cx+10.5)+' '+(gy-22)+'V'+gy+'z" fill="url(#'+id+'a)"/>'+
         '<path d="M'+f(cx-10.5)+' '+gy+'V'+(gy-22)+'Q'+f(cx-10.5)+' '+(gy-33)+' '+f(cx)+' '+(gy-36)+'" fill="none" stroke="#000" stroke-opacity=".28" stroke-width="'+(L.s<=0?1.6:.6)+'"/>'+
         '<path d="M'+f(cx+10.5)+' '+gy+'V'+(gy-22)+'Q'+f(cx+10.5)+' '+(gy-33)+' '+f(cx)+' '+(gy-36)+'" fill="none" stroke="#000" stroke-opacity=".28" stroke-width="'+(L.s<=0?.6:1.6)+'"/>'+
         '<rect x="'+f(cx-5)+'" y="'+(gy-18)+'" width="10" height="18" fill="'+wood+'" opacity=".55"/><rect x="'+f(cx-12.4)+'" y="'+(gy-23.5)+'" width="3.8" height="2" fill="'+trim+'"/><rect x="'+f(cx+8.6)+'" y="'+(gy-23.5)+'" width="3.8" height="2" fill="'+trim+'"/>';}
    s+='<rect x="'+xa+'" y="'+top+'" width="'+w+'" height="'+(gy-top)+'" fill="url(#'+id+'s)"/><rect x="'+xa+'" y="'+(gy-26)+'" width="'+w+'" height="26" fill="url(#'+id+'o)"/>';return s;}
  o+=wing(x0)+wing(x2);
  /* البوابة الوسطى */
  var cx=x1+cw/2;
  o+='<rect x="'+(x1-3)+'" y="'+ctop+'" width="'+(cw+6)+'" height="'+(gy-ctop)+'" fill="url(#'+id+'w)"/>';
  for(i=0;i<9;i++)o+='<rect x="'+f(x1-3+i*8+.5)+'" y="'+(ctop-6)+'" width="5.5" height="6.5" fill="'+wallTop+'"/>';
  o+='<rect x="'+(x1-3)+'" y="'+(ctop-.5)+'" width="'+(cw+6)+'" height="2.4" fill="'+trimD+'" opacity=".7"/>'+
   '<rect x="'+(x1+5)+'" y="'+(ctop+9)+'" width="'+(cw-10)+'" height="13" rx="1.5" fill="'+trim+'"/><rect x="'+(x1+7)+'" y="'+(ctop+11)+'" width="'+(cw-14)+'" height="9" rx="1" fill="'+Cs('#2F5E57',depth)+'"/>'+
   '<path d="M'+(x1+12)+' '+(ctop+15.5)+'h'+(cw-24)+'" stroke="'+Cs('#E9D9A8',depth)+'" stroke-width="1.6" stroke-dasharray="7 2.4 3 2.4" stroke-linecap="round"/>'+
   '<path d="M'+f(cx-19)+' '+gy+'V'+(gy-38)+'Q'+f(cx-19)+' '+(gy-56)+' '+f(cx)+' '+(gy-64)+'Q'+f(cx+19)+' '+(gy-56)+' '+f(cx+19)+' '+(gy-38)+'V'+gy+'z" fill="'+trim+'"/>'+
   '<path d="M'+f(cx-15)+' '+gy+'V'+(gy-37)+'Q'+f(cx-15)+' '+(gy-52)+' '+f(cx)+' '+(gy-58.5)+'Q'+f(cx+15)+' '+(gy-52)+' '+f(cx+15)+' '+(gy-37)+'V'+gy+'z" fill="url(#'+id+'a)"/>'+
   '<path d="M'+f(cx-12)+' '+gy+'V'+(gy-34)+'Q'+f(cx-12)+' '+(gy-46)+' '+f(cx)+' '+(gy-51)+'Q'+f(cx+12)+' '+(gy-46)+' '+f(cx+12)+' '+(gy-34)+'V'+gy+'z" fill="'+wood+'"/>'+
   '<path d="M'+f(cx)+' '+(gy-51)+'V'+gy+'" stroke="'+woodD+'" stroke-width="1.2"/><g fill="'+Cs('#C9A25A',depth)+'">'+[-8,-4,4,8].map(function(dx){return [-30,-20,-10].map(function(dy){return '<circle cx="'+f(cx+dx)+'" cy="'+(gy+dy)+'" r=".8"/>';}).join('');}).join('')+'</g>'+
   '<rect x="'+(x1-3)+'" y="'+ctop+'" width="'+(cw+6)+'" height="'+(gy-ctop)+'" fill="url(#'+id+'s)" opacity=".7"/><rect x="'+(x1-3)+'" y="'+(gy-26)+'" width="'+(cw+6)+'" height="26" fill="url(#'+id+'o)" opacity=".7"/>'+
   /* ظل البوابة على الجناح */
   '<rect x="'+(L.s<=0?x2+3:x1-3-9)+'" y="'+(top)+'" width="9" height="'+(gy-top)+'" fill="#0A1830" opacity="'+f(L.sh*.6)+'"/>'+
   /* درج */
   '<rect x="'+f(cx-24)+'" y="'+(gy-1)+'" width="48" height="3" fill="'+trim+'"/><rect x="'+f(cx-29)+'" y="'+(gy+2)+'" width="58" height="3" fill="'+trimD+'"/>'+
   /* سارية العلم */
   '<rect x="'+f(cx-.6)+'" y="'+(ctop-44)+'" width="1.3" height="40" fill="'+Cs('#C9CDD2',depth)+'"/><circle cx="'+f(cx)+'" cy="'+(ctop-44.5)+'" r="1.4" fill="'+Cs('#D9B25A',depth)+'"/>';
  /* إنارة ليلية */
  if(L.g>.1){o+='<g opacity="'+f(L.g)+'" style="mix-blend-mode:screen"><ellipse cx="'+f(cx)+'" cy="'+(gy+10)+'" rx="64" ry="11" fill="url(#'+id+'l)"/><circle cx="'+f(cx)+'" cy="'+(gy-56)+'" r="20" fill="url(#'+id+'l)" opacity=".7"/>';
    [x0,x2].forEach(function(xa){for(var k=0;k<4;k++){var c=xa+wingW/4*(k+.5);o+='<ellipse cx="'+f(c)+'" cy="'+(gy+5)+'" rx="15" ry="5" fill="url(#'+id+'l)" opacity=".8"/><circle cx="'+f(c)+'" cy="'+(top+19)+'" r="12" fill="url(#'+id+'l)" opacity=".45"/>';}});
    o+='</g>';}
  return {h:o,flag:[cx+.7,ctop-43.5]};}
function lamp(x,y,hh){var id='l'+(UID++),p=Cs('#3C434B',0);
  var o='<rect x="'+f(x-.7)+'" y="'+f(y-hh)+'" width="1.4" height="'+hh+'" fill="'+p+'"/><path d="M'+f(x-3)+' '+f(y-hh)+'h6l-1.2 -4.5h-3.6z" fill="'+S(mix(P('#D8DCE0'),P('#FFE6A6'),L.g))+'"/><rect x="'+f(x-3.4)+'" y="'+f(y-hh-5.6)+'" width="6.8" height="1.4" fill="'+p+'"/>';
  if(L.g>.1)o+='<defs><radialGradient id="'+id+'"><stop offset="0" stop-color="#FFE2A0" stop-opacity=".95"/><stop offset=".3" stop-color="#FFD98A" stop-opacity=".4"/><stop offset="1" stop-color="#FFD98A" stop-opacity="0"/></radialGradient></defs><g opacity="'+f(L.g)+'" style="mix-blend-mode:screen"><circle cx="'+f(x)+'" cy="'+f(y-hh-2)+'" r="22" fill="url(#'+id+')"/><ellipse cx="'+f(x)+'" cy="'+f(y+2)+'" rx="30" ry="6.5" fill="url(#'+id+')" opacity=".75"/></g>';
  return o;}

/* ---------- المشاهد ---------- */
function gardenFar(){var r=rng(41),h='<defs>'+texF('rk1','.009','.026',5,8,4)+'</defs>';
  h+=mountain({pts:ridge(rng(8),[[-10,214],[90,188],[190,206],[300,170],[400,196],[520,160],[640,192],[730,176],[810,204]],44,.56,5),base:'#8791A6',depth:.8,bot:300,tex:'rk1',seed:3});
  h+=mountain({pts:ridge(rng(19),[[-10,238],[110,216],[230,236],[340,210],[470,232],[590,204],[700,228],[810,214]],34,.55,5),base:'#94826E',depth:.55,bot:310,tex:'rk1',seed:9});
  /* تلال خضراء وبساتين نخيل */
  var hid='gh'+(UID++),c1=C('#8E9C62',.36),c2=C('#7C9054',.3);
  h+='<defs><linearGradient id="'+hid+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+S(c1)+'"/><stop offset="1" stop-color="'+S(mix(c2,L.haze,.25))+'"/></linearGradient></defs>'+
   '<path d="M0 262Q90 240 200 252T430 246T640 240T800 252V330H0z" fill="url(#'+hid+')"/>';
  var g='';for(var i=0;i<46;i++){var x=r()*W,y=254+r()*16+Math.sin(x/60)*3;g+=miniPalm(x,y,.75+r()*.5,.34,r);}
  h+=g+'<path d="M0 276Q160 258 330 270T620 264T800 272V340H0z" fill="'+S(mix(C('#86A058',.2),L.haze,.1))+'"/>';
  return svg('far',h);}
function lawn(id,yTop){var g1=C('#7FA650',.06),g2=C('#527F3A',0,.9);
  return '<defs><linearGradient id="'+id+'" gradientUnits="userSpaceOnUse" x1="0" y1="'+yTop+'" x2="0" y2="'+H+'"><stop offset="0" stop-color="'+S(g1)+'"/><stop offset="1" stop-color="'+S(g2)+'"/></linearGradient>'+
   '<filter id="'+id+'t" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".05 .5" numOctaves="3" seed="4"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  1.6 0 0 0 -.45"/></filter>'+
   '<filter id="'+id+'m" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".006 .02" numOctaves="2" seed="11"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 .1  0 0 0 0 0  0 1.5 0 0 -.62"/></filter></defs>';}
function gardenNear(kind){var r=rng(64),gy=318,h='<defs>'+leafF('lf','.11',5)+leafF('lf2','.07',9)+'</defs>',wide=kind==='campus';
  var lid='gl'+(UID++);h+=lawn(lid,gy-26);
  h+='<path d="M0 '+(gy-22)+'Q200 '+(gy-30)+' 400 '+(gy-26)+'T800 '+(gy-22)+'V'+H+'H0z" fill="url(#'+lid+')"/>'+
     '<rect x="0" y="'+(gy-30)+'" width="'+W+'" height="'+(H-gy+30)+'" filter="url(#'+lid+'m)" opacity=".5"/>'+
     '<rect x="0" y="'+(gy-30)+'" width="'+W+'" height="'+(H-gy+30)+'" filter="url(#'+lid+'t)" opacity=".34" style="mix-blend-mode:overlay"/>';
  /* أشجار خلف المبنى */
  var bx=wide?112:150,sc=school(bx,gy,{wing:wide?150:128}),bw=(wide?150:128)*2+66,cx=bx+bw/2;
  h+=tree(bx-22,gy-4,40,26,17,5,'#55803E',.1,'lf')+tree(bx+bw+38,gy-4,46,30,19,6,'#4F7A3A',.1,'lf')+palm(bx+bw+82,gy-2,74,8,23,.1,.8)+palm(bx-62,gy-3,66,-7,29,.1,.75);
  h+=sc.h;
  /* ممشى مرصوف بمنظور */
  var pid='pv'+(UID++),pv=C('#E4D6BC',0),pv2=C('#C9B796',0,.9);
  h+='<defs><linearGradient id="'+pid+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+S(pv)+'"/><stop offset="1" stop-color="'+S(pv2)+'"/></linearGradient></defs>'+
     '<path d="M'+f(cx-27)+' '+(gy+5)+'L'+f(cx+27)+' '+(gy+5)+'Q'+f(cx+60)+' 370 '+f(cx+150)+' '+H+'H'+f(cx-150)+'Q'+f(cx-60)+' 370 '+f(cx-27)+' '+(gy+5)+'z" fill="url(#'+pid+')"/>';
  var ln='';[.1,.22,.36,.54,.76].forEach(function(t){var y=gy+5+(H-gy-5)*t,w2=27+123*Math.pow(t,1.5);ln+='M'+f(cx-w2)+' '+f(y)+'H'+f(cx+w2);});
  h+='<path d="'+ln+'M'+f(cx)+' '+(gy+5)+'V'+H+'M'+f(cx-13)+' '+(gy+5)+'Q'+f(cx-30)+' 370 '+f(cx-75)+' '+H+'M'+f(cx+13)+' '+(gy+5)+'Q'+f(cx+30)+' 370 '+f(cx+75)+' '+H+'" stroke="#5A4A30" stroke-opacity=".2" stroke-width=".8" fill="none"/>';
  /* ظلال وأشجار ونخيل قريب */
  var items=[[bx+bw+4,gy+10,96,10,1.15,71],[bx-34,gy+14,104,-12,1.25,83]];
  items.forEach(function(p){h+=shadowE(p[0],p[1],8,p[2]);});
  /* أحواض زهور وشجيرات */
  function bed(x,y,w,seed){var rr=rng(seed),s=shadowE(x,y+3,w*.9,10)+canopy(x,y-5,w,7,seed,'#4E7C3C',0,'lf');var dots='',i;
    for(i=0;i<w*1.3;i++){var px=x+(rr()-.5)*w*1.8,py=y-6+(rr()-.5)*11,t=rr();dots+='<circle cx="'+f(px)+'" cy="'+f(py)+'" r="'+f(1+rr()*1.3)+'" fill="'+Cs(t<.5?'#D2468C':t<.8?'#E76AA6':'#F6E7EC',0,rr()<.4?1.2:.95)+'"/>';}
    return s+'<g filter="url(#lf)">'+dots+'</g>';}
  h+=bed(cx-74,gy+12,30,3)+bed(cx+76,gy+12,30,8)+bed(cx-150,gy+34,38,13)+bed(cx+158,gy+36,40,17);
  h+=lamp(cx-40,gy+14,34)+lamp(cx+40,gy+14,34);
  items.forEach(function(p){h+=palm(p[0],p[1],p[2],p[3],p[5],0,p[4]);});
  h+=shadowE(wide?566:640,gy+44,22,60)+tree(wide?566:640,gy+44,52,44,26,12,'#4A7838',0,'lf2')+(wide?'':palm(742,gy+30,92,-9,37,0,1.1));
  if(wide)h+=shadowE(726,gy+34,22,60)+tree(726,gy+34,50,40,24,15,'#507C3A',0,'lf2')+palm(46,gy+34,92,6,37,0,1.05)+palm(650,gy+16,84,-8,43,0,.95);
  /* حشائش أمامية */
  var gr='',gc=Cs('#3F6C2E',0,.8);for(var i=0;i<70;i++){var x=r()*W,y=H-r()*26;gr+='M'+f(x)+' '+f(y+8)+'q'+f((r()-.5)*5)+' '+f(-8-r()*9)+' '+f((r()-.5)*9)+' '+f(-13-r()*12);}
  h+='<path d="'+gr+'" stroke="'+gc+'" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".8"/>';
  if(L.g>.3){var ff='';for(i=0;i<9;i++)ff+='<circle cx="'+f(60+r()*680)+'" cy="'+f(gy+10+r()*70)+'" r="1.5"/>';h+='<g class="ff" fill="#FFF0A0" opacity="'+f(L.g*.9)+'">'+ff+'</g>';}
  return {h:svg('near',h),flag:sc.flag};}

function peaksFar(){var h='<defs>'+texF('rk2','.007','.02',5,7,6)+texF('rk3','.012','.03',5,8,2)+'</defs>';
  h+=mountain({pts:ridge(rng(3),[[-10,186],[70,160],[150,178],[250,120],[330,158],[430,132],[520,88],[600,134],[690,108],[810,150]],66,.57,5),base:'#7E86A6',depth:.84,bot:300,tex:'rk2',seed:2,fade:.95});
  h+=mist(204,.3);
  h+=mountain({pts:ridge(rng(14),[[-10,218],[80,186],[180,214],[280,170],[360,204],[470,164],[570,198],[660,150],[740,186],[810,172]],56,.57,5),base:'#B47C50',depth:.46,bot:320,tex:'rk2',seed:5,fade:.95});
  h+=mist(236,.32);
  h+=mountain({pts:ridge(rng(22),[[-10,240],[100,224],[210,246],[320,204],[420,238],[540,214],[640,244],[730,206],[810,230]],50,.56,5),base:'#BA7E4E',depth:.24,bot:340,tex:'rk3',seed:7,fade:.95});
  h+=mist(268,.3);
  return svg('far',h);}
function mist(y,op){var id='ms'+(UID++),c=S(mix(mix(L.haze,L.h,.45),[255,255,255],L.e>12?.4:.1));
  return '<defs><linearGradient id="'+id+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+c+'" stop-opacity="0"/><stop offset=".55" stop-color="'+c+'" stop-opacity="'+op+'"/><stop offset="1" stop-color="'+c+'" stop-opacity="0"/></linearGradient></defs><rect x="0" y="'+(y-26)+'" width="'+W+'" height="64" fill="url(#'+id+')"/>';}
function mistLayer(cls,y,dur,seed){var r=rng(seed),id='mv'+(UID++),c=S(mix(L.haze,[255,255,255],L.day?.55:.12)),g='',i;
  for(i=0;i<5;i++){var cx=(i+.5)*W/5+(r()-.5)*60;g+='<ellipse cx="'+f(cx)+'" cy="'+f(y+(r()-.5)*14)+'" rx="'+f(90+r()*70)+'" ry="'+f(7+r()*7)+'" fill="url(#'+id+')"/>';}
  var one='<svg viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none"><defs><radialGradient id="'+id+'"><stop offset="0" stop-color="'+c+'" stop-opacity=".7"/><stop offset="1" stop-color="'+c+'" stop-opacity="0"/></radialGradient></defs>'+g+'</svg>';
  return '<div class="L cl '+cls+'" style="animation-duration:'+dur+'s;animation-delay:'+f(-((Date.now()/1000)%dur))+'s">'+one+one+'</div>';}
function house(x,y,w,hh,depth,r){var lit=L.s<=0,front=Cs('#E6D6BC',depth,lit?1.04:.8),side=Cs('#E6D6BC',depth,lit?.62:1.08),win=S(mix(C('#3A2E24',depth,.7),P('#FFD27A'),L.g));
  return '<path d="M'+f(x+w)+' '+f(y)+'l3.2 -1.6v'+f(-hh)+'l-3.2 1.6z" fill="'+side+'"/><rect x="'+f(x)+'" y="'+f(y-hh)+'" width="'+f(w)+'" height="'+f(hh)+'" fill="'+front+'"/><path d="M'+f(x)+' '+f(y-hh)+'l3.2 -1.6h'+f(w)+'l-3.2 1.6z" fill="'+Cs('#F2E6D0',depth,1.05)+'"/>'+
   '<rect x="'+f(x+w*.2)+'" y="'+f(y-hh*.72)+'" width="1.5" height="2.2" fill="'+win+'"/>'+(w>7?'<rect x="'+f(x+w*.62)+'" y="'+f(y-hh*.72)+'" width="1.5" height="2.2" fill="'+win+'"/>':'')+(r()<.5?'<rect x="'+f(x+w*.4)+'" y="'+f(y-3.2)+'" width="1.8" height="3.2" fill="'+win+'"/>':'');}
function peaksNear(){var r=rng(91),h='<defs>'+texF('rk4','.014','.03',5,7,8)+texF('rk5','.02','.035',5,7,12)+leafF('lf','.12',5)+leafF('lf2','.08',8)+'</defs>';
  /* سفح القرية */
  var p4=ridge(rng(33),[[-10,292],[90,272],[200,284],[300,262],[380,252],[470,266],[580,282],[700,256],[810,266]],34,.55,5);
  h+=mountain({pts:p4,base:'#AE7A4C',depth:.13,bot:H,tex:'rk4',texOp:.5,seed:4,fade:1});
  /* مدرجات زراعية تتبع السفح */
  var i,tw=Cs('#6A543E',.18,.62),k;
  for(i=0;i<7;i++){var y=296+i*5.4,x0=322-i*2+(i%2)*14-(i%3)*6,x1=466+i*3-(i%3)*12+(i%2)*9,sag=5+i*.5,gcol=Cs(['#7C9E52','#93AE5C','#6C9048','#A3B46A'][i%4],.16,1.04);
    h+='<path d="M'+x0+' '+f(y)+'Q'+f((x0+x1)/2)+' '+f(y-sag)+' '+x1+' '+f(y-1)+'l3 4.6Q'+f((x0+x1)/2)+' '+f(y-sag+4.8)+' '+f(x0-4)+' '+f(y+4.8)+'z" fill="'+gcol+'"/><path d="M'+f(x0-4)+' '+f(y+4.8)+'Q'+f((x0+x1)/2)+' '+f(y-sag+4.8)+' '+f(x1+3)+' '+f(y+3.6)+'" stroke="'+tw+'" stroke-width="1.5" fill="none"/>';}
  /* بيوت القرية */
  var hs=[];for(i=0;i<19;i++){var row=i%4;hs.push([380+(r()-.5)*130+row*6,288-row*6.5+(r()-.5)*4,7+r()*5,5.5+r()*4]);}
  hs.sort(function(p,q){return p[1]-q[1];});hs.forEach(function(q){h+=house(q[0],q[1],q[2],q[3],.12,r);});
  for(i=0;i<9;i++)h+=miniPalm(300+r()*200,300+r()*42,1+r()*.5,.14,r);
  if(L.g>.1){var gid='vg'+(UID++);h+='<defs><radialGradient id="'+gid+'"><stop offset="0" stop-color="#FFD27A" stop-opacity=".55"/><stop offset="1" stop-color="#FFD27A" stop-opacity="0"/></radialGradient></defs><ellipse cx="384" cy="282" rx="100" ry="24" fill="url(#'+gid+')" opacity="'+f(L.g)+'" style="mix-blend-mode:screen"/>';}
  h+=mist(346,.22);
  /* الجرف الأمامي وشجرة العلعلان */
  var p5=ridge(rng(57),[[-10,318],[40,300],[110,292],[170,300],[230,326],[300,360],[380,392],[470,420]],26,.6,5);
  h+=mountain({pts:p5,base:'#8E6242',depth:0,bot:H+4,tex:'rk5',texOp:.42,seed:6,fade:1});
  var p6=ridge(rng(61),[[560,424],[640,400],[720,384],[810,372]],18,.6,4);
  h+=mountain({pts:p6,base:'#885E40',depth:0,bot:H+4,tex:'rk5',texOp:.42,seed:8,fade:1});
  /* شجرة عرعر معمّرة */
  var jx=118,jy=296,JS=1.5,tr=Cs('#5A4634',0,.75),trl=Cs('#8A705A',0,1.1);
  h+='<g transform="translate('+jx+' '+jy+') scale('+JS+') translate('+(-jx)+' '+(-jy)+')">';
  h+=shadowE(jx,jy+2,10,40)+'<path d="M'+(jx-5)+' '+(jy+3)+'C'+(jx-3)+' '+(jy-18)+' '+(jx-12)+' '+(jy-30)+' '+(jx-6)+' '+(jy-52)+'L'+(jx-1)+' '+(jy-52)+'C'+(jx-5)+' '+(jy-32)+' '+(jx+5)+' '+(jy-20)+' '+(jx+5)+' '+(jy+3)+'z" fill="'+tr+'"/>'+
   '<path d="M'+(jx-3)+' '+(jy-28)+'C'+(jx+10)+' '+(jy-38)+' '+(jx+22)+' '+(jy-40)+' '+(jx+34)+' '+(jy-52)+'M'+(jx-7)+' '+(jy-40)+'C'+(jx-20)+' '+(jy-48)+' '+(jx-26)+' '+(jy-52)+' '+(jx-34)+' '+(jy-62)+'" stroke="'+tr+'" stroke-width="3.4" fill="none" stroke-linecap="round"/>'+
   '<path d="M'+(jx+(L.s<=0?-4:3))+' '+(jy+2)+'C'+(jx-2)+' '+(jy-18)+' '+(jx-10)+' '+(jy-30)+' '+(jx-5)+' '+(jy-50)+'" stroke="'+trl+'" stroke-width="1.2" fill="none" opacity=".7"/>'+
   canopy(jx-36,jy-68,22,9,3,'#3F6A44',0,'lf')+canopy(jx+36,jy-58,24,9,9,'#3A6440',0,'lf')+canopy(jx-4,jy-66,26,12,5,'#44704A',0,'lf')+canopy(jx+8,jy-84,18,8,7,'#4A774E',0,'lf');
  h+='</g>';
  /* صخور وأعشاب */
  var gr='',gc=Cs('#8A8A4E',0,.9);for(i=0;i<46;i++){var x=r()<.62?r()*300:580+r()*220,y=x<300?306+x*.2+r()*40:392-(x-580)*.08+r()*20;gr+='M'+f(x)+' '+f(y)+'q'+f((r()-.5)*4)+' '+f(-5-r()*6)+' '+f((r()-.5)*8)+' '+f(-8-r()*8);}
  h+='<path d="'+gr+'" stroke="'+gc+'" stroke-width="1.1" fill="none" stroke-linecap="round" opacity=".85"/>';
  [[60,330,9],[196,334,7],[250,366,11],[690,398,10],[752,388,7]].forEach(function(q){h+='<ellipse cx="'+q[0]+'" cy="'+f(q[1]+q[2]*.3)+'" rx="'+f(q[2]*1.4)+'" ry="'+f(q[2]*.35)+'" fill="#0A1420" opacity="'+f(L.sh*.8)+'"/><path d="M'+(q[0]-q[2])+' '+(q[1]+q[2]*.4)+'q'+f(-q[2]*.2)+' '+f(-q[2]*.9)+' '+f(q[2]*.6)+' '+f(-q[2]*1.1)+'q'+f(q[2]*.9)+' '+f(-q[2]*.2)+' '+f(q[2]*1.4)+' '+f(q[2]*.5)+'q'+f(q[2]*.2)+' '+f(q[2]*.5)+' '+f(-q[2]*.2)+' '+f(q[2]*.7)+'z" fill="'+Cs('#7E6A58',0,L.s<=0?.95:.8)+'"/><path d="M'+(q[0]-q[2]*.4)+' '+(q[1]-q[2]*.7)+'q'+f(q[2]*.9)+' '+f(-q[2]*.2)+' '+f(q[2]*1.4)+' '+f(q[2]*.5)+'" stroke="'+Cs('#B8A48C',0,1.15)+'" stroke-width="1.2" fill="none" opacity=".7"/>';});
  return svg('near',h);}

/* ---------- تركيب المشهد ---------- */
var OVR=null;
function now(){return OVR||new Date();}
function html(kind,inner){UID=0;L=light(now());var h='',flag=null,xtra='';
  h+=sky()+twinkle()+clouds('c1',17,4,70,150,.4,.7,260);
  if(kind==='peaks'){h+=peaksFar()+mistLayer('m1',284,170,5)+peaksNear()+mistLayer('m2',352,120,9);
    if(L.e>1)xtra+='<i class="eagle"><svg viewBox="-20 -8 40 16"><path d="M-19 -3Q-10 -7 -3 -1L0 1L3 -1Q10 -7 19 -3Q11 -3 5 2Q2 5 0 5Q-2 5 -5 2Q-11 -3 -19 -3z" fill="#2A2420"/></svg></i>';}
  else{var nr=gardenNear(kind);h+=gardenFar()+nr.h;flag=nr.flag;}
  h+=clouds('c2',5,2,30,84,.8,1.15,170);
  if(flag)xtra+='<i class="flag" style="left:'+f(flag[0]/W*100)+'%;top:'+f(flag[1]/H*100)+'%"><svg viewBox="0 0 30 18" preserveAspectRatio="none"><rect width="30" height="6" fill="#fff"/><rect y="6" width="30" height="6" fill="#D4222E"/><rect y="12" width="30" height="6" fill="#1E8C4E"/><rect width="8" height="18" fill="#D4222E"/></svg></i>';
  if(L.e>3&&kind!=='peaks')xtra+='<i class="bd b1"></i><i class="bd b2"></i><i class="bd b3"></i>';
  var bg='linear-gradient(180deg,'+S(L.z)+','+S(L.m)+' 45%,'+S(L.h)+')';
  return '<div class="scn2" data-scene="'+kind+'" data-k="'+L.k+'" style="background:'+bg+';--n:'+f(L.n)+';--g:'+f(L.g)+'"><div class="stage">'+h+xtra+'</div><i class="grade" style="background:linear-gradient(180deg,transparent 40%,'+S(mul(L.amb,[60,70,90]))+')"></i><i class="grain"></i>'+
   '<button type="button" class="tod-btn" data-scene-cycle aria-label="جرّبي أوقات اليوم" title="جرّبي أوقات اليوم"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4"/></svg><span></span></button>'+(inner||'')+'</div>';}

/* تجربة أوقات اليوم (للعرض): كل نقرة تنقل المشهد إلى وقت تالٍ */
var step=-1,tmr=null;
function cycle(el){var so=solar(new Date()),sr=12-so.h0,ss=12+so.h0,list=[sr-.42,sr+.3,sr+2.4,12.1,ss-2.7,ss-.62,ss-.1,ss+.38,ss+3.6];
  step=(step+1)%(list.length+1);
  if(step===list.length){OVR=null;}else{var t=list[step]+.1,d=new Date();d.setHours(Math.floor(t),Math.round((t%1)*60),0,0);OVR=d;}
  refresh(true);var b=document.querySelector('.scn2 .tod-btn');
  if(b){b.querySelector('span').textContent=OVR?NAMES[L.k]:'الوقت الآن';b.classList.add('on');clearTimeout(tmr);tmr=setTimeout(function(){var x=document.querySelector('.scn2 .tod-btn');if(x)x.classList.remove('on');},2600);}}
function refresh(force){var els=document.querySelectorAll('.scn2'),i;for(i=0;i<els.length;i++){var el=els[i],k=el.getAttribute('data-scene');
    var keep=el.querySelector('.scn-keep'),tmp=document.createElement('div');tmp.innerHTML=html(k);var nw=tmp.firstChild;
    if(!force&&nw.style.background===el.style.background)continue;
    if(keep)nw.appendChild(keep);nw.classList.add('swap');el.parentNode.replaceChild(nw,el);
    var card=nw.closest?nw.closest('[data-tod]'):null;if(card)card.setAttribute('data-tod',L.k);}}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-scene-cycle]');if(b){e.preventDefault();e.stopPropagation();cycle();}},true);
setInterval(function(){if(!OVR&&!document.hidden)refresh(false);},240000);
window.SCENE={html:html,light:function(){return light(now());},refresh:refresh,names:NAMES};
})();
