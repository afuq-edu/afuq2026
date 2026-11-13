/* وِرد عيسى: متابعة ورد القرآن والذكر. البيانات على الجهاز فقط (localStorage) مع نسخة احتياطية في الإعدادات. */
(function(){
'use strict';
var D=window.WD,$=function(s,r){return (r||document).querySelector(s);};
var AR='٠١٢٣٤٥٦٧٨٩';
var WEST=false;try{WEST=localStorage.getItem('issaf:digits')==='w';}catch(e){}
function N(x){return WEST?String(x):String(x).replace(/\d/g,function(d){return AR[d];}).replace('.','٫');}
function dayn(n){return n===1?'يوم واحد':n===2?'يومان':n>=3&&n<=10?N(n)+' أيام':N(n)+' يومًا';}
function pad(n){return String(n).padStart(2,'0');}
function dk(t){var d=t?new Date(t):new Date();return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());}
function dDate(k){var a=k.split('-').map(Number);return new Date(a[0],a[1]-1,a[2],12);}
function dAdd(k,n){var d=dDate(k);d.setDate(d.getDate()+n);return dk(d.getTime());}
function dDiff(a,b){return Math.round((dDate(b)-dDate(a))/864e5);}
function clock(sec){sec=Math.max(0,Math.floor(sec));var h=Math.floor(sec/3600),m=Math.floor(sec%3600/60),s=sec%60;return N((h?h+':'+pad(m):m)+':'+pad(s));}
function mins(sec){var m=sec/60;return N(m>=10?Math.round(m):Math.round(m*10)/10);}
function dur(sec){var m=Math.round(sec/60);if(m<60)return N(m)+' د';return N(Math.floor(m/60))+' س '+(m%60?N(m%60)+' د':'');}
function hm(min){min=((Math.round(min)%1440)+1440)%1440;var h=Math.floor(min/60),m=min%60;return N((h%12||12)+':'+pad(m))+' '+(h<12?'ص':'م');}
function pg(n){return n===1?'صفحة واحدة':n===2?'صفحتان':n>=3&&n<=10?N(n)+' صفحات':N(n)+' صفحة';}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7);}
var DAYS=['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'],DS=['ح','ن','ث','ر','خ','ج','س'];

var P={
 home:'<path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z"/>',plan:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 heal:'<path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.500-7 10-7 10z"/><path d="M9 12h6M12 9v6"/>',chart:'<path d="M4 20V10M10 20V4M16 20v-8M21 20H3"/>',
 star:'<path d="M12 3l2.7 5.6 6.1.8-4.5 4.2 1.1 6-5.4-3-5.400 3 1.100-6L3.200 9.400l6.100-.8z"/>',gear:'<circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.300l2-1.500-2-3.400-2.300 1a7 7 0 0 0-2.300-1.300L14 3h-4l-.3 2.500a7 7 0 0 0-2.300 1.300l-2.300-1-2 3.400 2 1.500a7 7 0 0 0 0 2.600l-2 1.500 2 3.400 2.300-1a7 7 0 0 0 2.300 1.300L10 21h4l.3-2.500a7 7 0 0 0 2.300-1.300l2.300 1 2-3.400-2-1.500c.100-.4.100-.9.100-1.300z"/>',
 book:'<path d="M12 6c-2-1.500-5-2-8-2v14c3 0 6 .5 8 2 2-1.500 5-2 8-2V4c-3 0-6 .5-8 2zM12 6v14"/>',beads:'<circle cx="12" cy="5" r="2"/><circle cx="18" cy="9" r="2"/><circle cx="17" cy="16" r="2"/><circle cx="7" cy="16" r="2"/><circle cx="6" cy="9" r="2"/><path d="M12 18v4"/>',
 fire:'<path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',x:'<path d="M6 6l12 12M18 6L6 18"/>',
 warn:'<path d="M12 4l9 16H3zM12 10v4M12 17v.5"/>',ok:'<path d="M5 12.500l4.500 4.500L19 7.500"/>',plus:'<path d="M12 5v14M5 12h14"/>',down:'<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>',
 leaf:'<path d="M5 19c0-9 5-14 14-14 0 9-5 14-14 14zM5 19l7-7"/>',link:'<path d="M10 14a4 4 0 0 0 5.700 0l3-3a4 4 0 0 0-5.700-5.700l-1 1M14 10a4 4 0 0 0-5.700 0l-3 3a4 4 0 0 0 5.700 5.700l1-1"/>',
 sunrise:'<path d="M3 18h18M6 18a6 6 0 0 1 12 0M12 5v3M5 10l1.500 1.500M19 10l-1.500 1.500"/>',grid:'<rect x="4" y="4" width="6" height="6" rx="1.500"/><rect x="14" y="4" width="6" height="6" rx="1.500"/><rect x="4" y="14" width="6" height="6" rx="1.500"/><rect x="14" y="14" width="6" height="6" rx="1.500"/>',
 moon:'<path d="M20 14.500A8 8 0 0 1 9.500 4a8 8 0 1 0 10.500 10.500z"/>',heart:'<path d="M12 20s-7-4.500-7-10a4 4 0 0 1 7-2.600A4 4 0 0 1 19 10c0 5.500-7 10-7 10z"/>',bell:'<path d="M6 16V11a6 6 0 0 1 12 0v5l1.500 2h-15zM10 21h4"/>',
 feather:'<path d="M20 4c-7 0-12 5-12 12v4M8 16h6l5-5M8 20l6-6"/>',pause:'<path d="M8 5v14M16 5v14"/>',play:'<path d="M7 4l13 8-13 8z"/>',undo:'<path d="M9 7L4 12l5 5M4 12h10a6 6 0 0 1 0 12"/>',shield:'<path d="M12 3l8 3v6c0 5-3.500 8-8 9-4.500-1-8-4-8-9V6z"/>',
 chev:'<path d="M15 6l-6 6 6 6"/>',cal:'<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>'
};
function I(n){return '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">'+(P[n]||'')+'</svg>';}

/* ---------- الحالة ---------- */
var KEY='issaf:state',AKEY='issaf:active';
function fresh(){return {v:1,cfg:{set:false,pages:5,spp:150,dhikr:300,cur:1,khatmas:0,start:null,city:'muscat',lat:23.588,lng:58.383,slots:JSON.parse(JSON.stringify(D.SLOTS)),sound:true,vib:true,niyya:'',ease:null},reads:[],dhikr:[],delays:[],makeup:null,forgiven:null,goals:{},badges:{},flags:{micro:0,madeup:0,prep:null},snooze:0};}
var S=fresh(),A=null,tab='home',range=7;
function load(){try{var j=JSON.parse(localStorage.getItem(KEY)||'null');if(j&&j.cfg){var f=fresh();for(var k in f)if(j[k]===undefined)j[k]=f[k];for(k in f.cfg)if(j.cfg[k]===undefined)j.cfg[k]=f.cfg[k];for(k in f.flags)if(j.flags[k]===undefined)j.flags[k]=f.flags[k];S=j;}}catch(e){}
 try{A=JSON.parse(localStorage.getItem(AKEY)||'null');}catch(e){A=null;}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){toast('تعذّر الحفظ: مساحة الهاتف ممتلئة');}}
function saveA(){try{if(A)localStorage.setItem(AKEY,JSON.stringify(A));else localStorage.removeItem(AKEY);}catch(e){}}

/* ---------- الحسابات ---------- */
var IX={p:{},s:{},d:{}};
function index(){IX={p:{},s:{},d:{}};S.reads.forEach(function(r){IX.p[r.d]=(IX.p[r.d]||0)+r.p.length;IX.s[r.d]=(IX.s[r.d]||0)+r.p.reduce(function(a,b){return a+b;},0);});
 S.dhikr.forEach(function(r){IX.d[r.d]=(IX.d[r.d]||0)+r.n;});}
function baseGoal(){var e=S.cfg.ease;return e&&dk()<=e.until?e.pages:S.cfg.pages;}
function goalOf(d){if(S.goals[d]!=null)return S.goals[d];var ks=Object.keys(S.goals).filter(function(k){return k<d;}).sort();return ks.length?S.goals[ks[ks.length-1]]:S.cfg.pages;}
function snap(){var t=dk();S.goals[t]=baseGoal();if(S.cfg.ease&&t>S.cfg.ease.until)S.cfg.ease=null;}
function debtStart(){var t=dk(),a=[S.cfg.start||t,dAdd(t,-30)];if(S.forgiven)a.push(S.forgiven);return a.sort().pop();}
function carry(){var t=dk(),d=debtStart(),c=0;for(;d<t;d=dAdd(d,1))c+=goalOf(d)-(IX.p[d]||0);return Math.max(0,c);}
function debtNow(){var t=dk();return Math.max(0,carry()-Math.max(0,(IX.p[t]||0)-goalOf(t)));}
function extraToday(){var c=carry();return S.makeup&&c>0?Math.min(S.makeup.per,c):0;}
function goalToday(){return goalOf(dk())+extraToday();}
function missedDays(){var t=dk(),d=debtStart(),o=[];for(;d<t;d=dAdd(d,1)){var g=goalOf(d),p=IX.p[d]||0;if(p<g)o.push({d:d,miss:g-p});}return o;}
function streak(){var t=dk(),d=S.cfg.start||t,s=0,sh=0,best=0;if(dDiff(d,t)>730)d=dAdd(t,-730);
 for(;d<t;d=dAdd(d,1)){var p=IX.p[d]||0;if(p>=goalOf(d)){s++;if(s%7===0)sh=Math.min(2,sh+1);}else if(sh>0){sh--;}else s=0;best=Math.max(best,s);}
 var today=(IX.p[t]||0)>=goalOf(t);if(today){s++;best=Math.max(best,s);}return {n:s,sh:sh,best:best,today:today};}
function avgSpp(days){var t=dk(),n=0,s=0;for(var i=0;i<(days||14);i++){var d=dAdd(t,-i);n+=IX.p[d]||0;s+=IX.s[d]||0;}return n>=3?s/n:S.cfg.spp;}
function totals(){var tp=0,ts=0,td=0;S.reads.forEach(function(r){tp+=r.p.length;r.p.forEach(function(x){ts+=x;});});S.dhikr.forEach(function(r){td+=r.n;});return {p:tp,s:ts,d:td};}

/* مواقيت الصلاة (تقريبية): زاوية 18° للفجر والعشاء، العصر على مذهب الجمهور */
function prayer(date,lat,lng){var r=Math.PI/180,tz=-date.getTimezoneOffset()/60,y=date.getFullYear(),m=date.getMonth()+1,d=date.getDate();
 if(m<=2){y--;m+=12;}var a=Math.floor(y/100),b=2-a+Math.floor(a/4);
 var jd=Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+d+b-1524.5-lng/360,n=jd-2451545;
 function fx(v,k){v=v%k;return v<0?v+k:v;}
 var g=fx(357.529+0.98560028*n,360),q=fx(280.459+0.98564736*n,360),L=fx(q+1.915*Math.sin(g*r)+0.02*Math.sin(2*g*r),360),e=23.439-0.00000036*n;
 var ra=fx(Math.atan2(Math.cos(e*r)*Math.sin(L*r),Math.cos(L*r))/r/15,24),dec=Math.asin(Math.sin(e*r)*Math.sin(L*r)),eq=q/15-ra;if(eq>12)eq-=24;if(eq<-12)eq+=24;
 var noon=12+tz-lng/15-eq,la=lat*r;
 function T(alt){var c=(Math.sin(alt*r)-Math.sin(la)*Math.sin(dec))/(Math.cos(la)*Math.cos(dec));return Math.acos(Math.max(-1,Math.min(1,c)))/r/15;}
 var asrAlt=Math.atan(1/(1+Math.tan(Math.abs(la-dec))))/r;
 return {fajr:(noon-T(-18))*60,sunrise:(noon-T(-0.833))*60,dhuhr:noon*60+2,asr:(noon+T(asrAlt))*60,maghrib:(noon+T(-0.833))*60+2,isha:(noon+T(-18))*60};}
var PTc=null;function PT(){var t=dk();if(!PTc||PTc.k!==t+S.cfg.lat+S.cfg.lng)PTc={k:t+S.cfg.lat+S.cfg.lng,v:prayer(new Date(),S.cfg.lat,S.cfg.lng)};return PTc.v;}
function slotMin(s){if(s.time){var a=s.time.split(':');return +a[0]*60+ +a[1];}return Math.round(PT()[s.anchor]+s.off);}
function slots(){return S.cfg.slots.filter(function(s){return s.on;}).map(function(s){return {id:s.id,name:s.name,w:s.w||1,min:slotMin(s)};}).sort(function(a,b){return a.min-b.min;});}
function split(total,ws){var sum=ws.reduce(function(a,b){return a+b;},0)||1,raw=ws.map(function(w){return total*w/sum;}),out=raw.map(Math.floor),left=total-out.reduce(function(a,b){return a+b;},0);
 raw.map(function(v,i){return [v-out[i],i];}).sort(function(a,b){return b[0]-a[0]||a[1]-b[1];}).slice(0,left).forEach(function(x){out[x[1]]++;});return out;}
function nowMin(){var d=new Date();return d.getHours()*60+d.getMinutes();}
function plan(){var t=dk(),goal=goalToday(),read=IX.p[t]||0,sl=slots(),nm=nowMin(),orig=split(goal,sl.map(function(s){return s.w;}));
 var todays=S.reads.filter(function(r){return r.d===t;});
 sl.forEach(function(s,i){s.end=i<sl.length-1?sl[i+1].min:1440;s.orig=orig[i];s.done=0;s.state=nm>=s.end?'past':nm>=s.min?'cur':'next';});
 todays.forEach(function(r){var d=new Date(r.t),m=d.getHours()*60+d.getMinutes(),k=0;for(var i=0;i<sl.length;i++)if(m>=sl[i].min)k=i;if(sl[k])sl[k].done+=r.p.length;});
 var rem=Math.max(0,goal-read),act=sl.filter(function(s){return s.state!=='past';}),need=split(rem,act.map(function(s){return s.w;}));
 act.forEach(function(s,i){s.need=need[i];});
 var due=0;sl.forEach(function(s){if(s.state==='past')due+=s.orig;});
 var cur=sl.filter(function(s){return s.state==='cur';})[0]||null,next=sl.filter(function(s){return s.state==='next';})[0]||null;
 return {goal:goal,read:read,rem:rem,sl:sl,cur:cur,next:next,behind:Math.max(0,due-read),late:!act.length&&rem>0,spp:avgSpp()};}
function bestSlot(){var sl=S.cfg.slots.map(function(s){return {id:s.id,name:s.name,min:slotMin(s),n:0};}).sort(function(a,b){return a.min-b.min;}),lim=dAdd(dk(),-30),tot=0;
 S.reads.forEach(function(r){if(r.d<lim)return;var d=new Date(r.t),m=d.getHours()*60+d.getMinutes(),k=0;for(var i=0;i<sl.length;i++)if(m>=sl[i].min)k=i;sl[k].n+=r.p.length;tot+=r.p.length;});
 if(tot<10)return null;return sl.sort(function(a,b){return b.n-a.n;})[0];}
function level(tp){var L=D.LEVELS,i=0;for(var k=0;k<L.length;k++)if(tp>=L[k][0])i=k;var nx=L[i+1];return {i:i,name:L[i][1],next:nx?nx[1]:null,pct:nx?(tp-L[i][0])/(nx[0]-L[i][0]):1,left:nx?nx[0]-tp:0};}
function badgeStats(){var T=totals(),st=streak(),sun=PT().sunrise,fj=0,paced=0,maxDay=0,both=0;
 S.reads.forEach(function(r){var d=new Date(r.t),m=d.getHours()*60+d.getMinutes();if(m>=180&&m<sun&&!r.manual)fj++;if(!r.manual&&r.p.length>=5&&r.p.reduce(function(a,b){return a+b;},0)/r.p.length<=S.cfg.spp)paced++;});
 for(var d in IX.p){maxDay=Math.max(maxDay,IX.p[d]);if(IX.p[d]>=goalOf(d)&&(IX.d[d]||0)>=S.cfg.dhikr)both++;}
 return {total:T.p,dhikr:T.d,khatmas:S.cfg.khatmas,best:st.best,fajr:fj,paced:paced,maxDay:maxDay,bothDays:both,micro:S.flags.micro,madeup:S.flags.madeup};}
function checkBadges(quiet){var s=badgeStats(),got=[];D.BADGES.forEach(function(b){if(!S.badges[b.id]&&b.f(s)){S.badges[b.id]=Date.now();got.push(b);}});
 if(got.length){save();if(!quiet)setTimeout(function(){toast('وسام جديد: '+got.map(function(b){return b.t;}).join('، '));snd('done');},900);}}
function checkMakeup(){if(S.makeup&&debtNow()===0){S.makeup=null;S.flags.madeup++;save();setTimeout(function(){toast('اكتمل التعويض. قضيت ما فاتك كله.');},600);}}

/* ---------- صوت ولمس (أصوات طبيعية غير موسيقية) ---------- */
var AC=null;
function snd(k){if(!S.cfg.sound)return;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();
 var len=k==='page'?0.28:k==='done'?0.5:0.05,buf=AC.createBuffer(1,Math.floor(AC.sampleRate*len),AC.sampleRate),ch=buf.getChannelData(0);
 for(var i=0;i<ch.length;i++){var x=i/ch.length,env=k==='page'?Math.sin(Math.PI*x)*0.5:k==='done'?(Math.exp(-x*18)+0.7*Math.exp(-Math.abs(x-0.35)*30))*0.9:Math.exp(-x*9);ch[i]=(Math.random()*2-1)*env;}
 var src=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();src.buffer=buf;f.type=k==='page'?'bandpass':'lowpass';f.frequency.value=k==='page'?2600:k==='done'?520:900;f.Q.value=k==='page'?0.7:1.2;g.gain.value=k==='page'?0.16:k==='done'?0.5:0.22;
 src.connect(f);f.connect(g);g.connect(AC.destination);src.start();}catch(e){}}
function vib(p){if(S.cfg.vib&&navigator.vibrate)try{navigator.vibrate(p);}catch(e){}}
var toastT;function toast(m){var t=$('#toast');t.innerHTML='<div>'+esc(m)+'</div>';clearTimeout(toastT);toastT=setTimeout(function(){t.innerHTML='';},3600);}
function notify(title,body){toast(title+(body?' · '+body:''));vib([60,60,60]);try{if('Notification' in window&&Notification.permission==='granted'&&navigator.serviceWorker)navigator.serviceWorker.ready.then(function(r){r.showNotification(title,{body:body||'',icon:'icons/icon-192.png',badge:'icons/favicon-64.png',tag:'wird',lang:'ar',dir:'rtl'});});}catch(e){}}

/* ---------- الرسوم البيانية ---------- */
function bars(data,o){o=o||{};var W=320,H=150,pt=10,pb=18,n=data.length,max=Math.max(o.goal||0,1);data.forEach(function(x){max=Math.max(max,x.v);});max=Math.ceil(max*1.12);
 var bw=W/n,w=Math.min(22,Math.max(2,bw-2)),y=function(v){return pt+(H-pt-pb)*(1-v/max);},s='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(o.label||'')+'">';
 s+='<line class="grid" x1="0" x2="'+W+'" y1="'+(H-pb)+'" y2="'+(H-pb)+'"/>';
 var every=Math.ceil(n/7);
 data.forEach(function(x,i){var cx=(i+0.5)*bw,h=Math.max(x.v>0?2:0,(H-pb)-y(x.v)),r=Math.min(4,w/2,h);
  if(h>0)s+='<path class="bar'+(x.lo?' lo':'')+(o.cls?' '+o.cls:'')+'" d="M'+(cx-w/2)+' '+(H-pb)+'v'+(-(h-r))+'q0 '+(-r)+' '+r+' '+(-r)+'h'+(w-2*r)+'q'+r+' 0 '+r+' '+r+'v'+(h-r)+'z"/>';
  if(i%every===0)s+='<text x="'+cx+'" y="'+(H-5)+'" text-anchor="middle">'+esc(x.l)+'</text>';
  s+='<rect class="hit" data-tip="'+esc(x.tip)+'" x="'+(cx-bw/2)+'" y="0" width="'+bw+'" height="'+(H-pb)+'"/>';});
 if(o.goal)s+='<line class="goal" x1="0" x2="'+W+'" y1="'+y(o.goal)+'" y2="'+y(o.goal)+'"/><text x="'+(W-2)+'" y="'+(y(o.goal)-4)+'" text-anchor="start">'+esc(o.goalL||'')+'</text>';
 return s+'</svg>';}
function line(data,o){o=o||{};var W=320,H=150,pt=12,pb=18,n=data.length,vals=data.filter(function(x){return x.v!=null;});if(!vals.length)return '<div class="empty">لا توجد جلسات موقوتة في هذه المدة بعد.</div>';
 var max=o.goal||0;vals.forEach(function(x){max=Math.max(max,x.v);});max*=1.15;var bw=W/n,X=function(i){return (i+0.5)*bw;},y=function(v){return pt+(H-pt-pb)*(1-v/max);};
 var s='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(o.label||'')+'"><line class="grid" x1="0" x2="'+W+'" y1="'+(H-pb)+'" y2="'+(H-pb)+'"/>',d='',every=Math.ceil(n/7),pts='';
 data.forEach(function(x,i){if(i%every===0)s+='<text x="'+X(i)+'" y="'+(H-5)+'" text-anchor="middle">'+esc(x.l)+'</text>';if(x.v==null)return;d+=(d?'L':'M')+X(i)+' '+y(x.v);
  pts+='<circle class="pt" cx="'+X(i)+'" cy="'+y(x.v)+'" r="'+(n>31?2.5:4)+'"/><rect class="hit" data-tip="'+esc(x.tip)+'" x="'+(X(i)-bw/2)+'" y="0" width="'+bw+'" height="'+(H-pb)+'"/>';});
 if(o.goal)s+='<line class="goal" x1="0" x2="'+W+'" y1="'+y(o.goal)+'" y2="'+y(o.goal)+'"/>';
 return s+'<path class="ln" d="'+d+'"/>'+pts+'</svg>';}
function dayLabel(d){var x=dDate(d);return range<=7?DAYS[x.getDay()].replace('ال',''):N(x.getDate()+'/'+(x.getMonth()+1));}
function dayFull(d){var x=dDate(d);return DAYS[x.getDay()]+' '+N(x.getDate()+'/'+(x.getMonth()+1));}

/* ---------- سماء الختمة ---------- */
var skyRaf=0;
function drawSky(){var c=$('#sky');cancelAnimationFrame(skyRaf);if(!c)return;var dpr=Math.min(2,window.devicePixelRatio||1),w=c.clientWidth,h=c.clientHeight;c.width=w*dpr;c.height=h*dpr;var x=c.getContext('2d');x.scale(dpr,dpr);
 var cs=getComputedStyle(document.documentElement),star=cs.getPropertyValue('--star').trim(),moon=cs.getPropertyValue('--moon').trim(),lit=S.cfg.cur-1,seed=7,stars=[];
 function rnd(){seed=(seed*16807)%2147483647;return seed/2147483647;}
 var mx=w*0.2,my=h*0.36,mr=Math.min(46,h*0.2);
 for(var i=0;i<604;i++){var sx,sy,k=0;do{sx=rnd()*w;sy=rnd()*h*0.94;k++;}while(Math.hypot(sx-mx,sy-my)<mr+16&&k<8);stars.push([sx,sy,0.5+rnd()*0.9,rnd()*6.28]);}
 var pl=plan(),f=pl.goal?Math.min(1,pl.read/pl.goal):0,red=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches,t0=performance.now(),last=0;
 function frame(now){if(!document.body.contains(c))return;skyRaf=requestAnimationFrame(frame);if(now-last<90)return;last=now;var tt=(now-t0)/1000;x.clearRect(0,0,w,h);
  for(var i=0;i<604;i++){var s=stars[i];if(i<lit){var a=red?0.95:0.7+0.3*Math.sin(tt*1.3+s[3]);x.globalAlpha=a;x.fillStyle=star;x.beginPath();x.arc(s[0],s[1],s[2]+0.5,0,6.283);x.fill();if(s[2]>1.1){x.globalAlpha=a*0.18;x.beginPath();x.arc(s[0],s[1],s[2]*3.2,0,6.283);x.fill();}}
   else{x.globalAlpha=0.16;x.fillStyle='#fff';x.beginPath();x.arc(s[0],s[1],s[2]*0.55,0,6.283);x.fill();}}
  /* قمر اليوم: يكتمل بقدر ما قُرئ من الورد */
  x.globalAlpha=1;var gl=x.createRadialGradient(mx,my,mr*0.6,mx,my,mr*2.3);gl.addColorStop(0,'rgba(245,222,154,'+(0.10+0.28*f)+')');gl.addColorStop(1,'rgba(245,222,154,0)');x.fillStyle=gl;x.beginPath();x.arc(mx,my,mr*2.3,0,6.283);x.fill();
  x.fillStyle='rgba(255,255,255,.09)';x.beginPath();x.arc(mx,my,mr,0,6.283);x.fill();
  if(f>0){x.fillStyle=moon;x.beginPath();if(f>=0.999)x.arc(mx,my,mr,0,6.283);else{x.arc(mx,my,mr,-Math.PI/2,Math.PI/2,false);x.ellipse(mx,my,mr*Math.abs(1-2*f),mr,0,Math.PI/2,-Math.PI/2,f<0.5);}x.fill();}
  if(red)cancelAnimationFrame(skyRaf);}
 skyRaf=requestAnimationFrame(frame);}

/* ---------- الصفحات ---------- */
function hijri(){try{return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch(e){return DAYS[new Date().getDay()];}}
function greet(){var h=new Date().getHours();return h<4?'ليلة مباركة':h<11?'صباح النور':h<15?'نهارك مبارك':h<18?'عصرك طيب':'مساء الخير';}
function quote(){var q=D.QUOTES,i=Math.floor(dDate(dk()).getTime()/864e5)%q.length;return q[i];}
function nowCard(pl){var est=function(n){return '≈ '+dur(n*pl.spp);};
 if(pl.rem===0)return '<section class="card now"><div class="k">اكتمل قمر اليوم</div><div class="t">أتممت ورد اليوم: '+pg(pl.read)+'</div><p class="mute sm" style="margin:0 0 12px">الزيادة تضيء نجومًا أكثر'+(debtNow()>0?' وتقضي من الفائت.':'.')+'</p><button class="btn soft block" data-a="read">'+I('book')+'اقرأ زيادة</button></section>';
 var k,t,sub;
 if(pl.cur&&pl.cur.need>0){k='الآن · '+pl.cur.name;t=pg(pl.cur.need)+' '+est(pl.cur.need);sub='إن بدأت الآن تنتهي '+hm(nowMin()+pl.cur.need*pl.spp/60)+'.';}
 else if(pl.late){k='آخر فرصة اليوم';t=pg(pl.rem)+' '+est(pl.rem);sub='بقي من اليوم '+dur((1440-nowMin())*60)+'. صفحة الآن خير من ورد كامل غدًا.';}
 else if(pl.next){k='التالي · '+pl.next.name+' '+hm(pl.next.min);t=pg(pl.next.need)+' '+est(pl.next.need);sub='باقي اليوم '+pg(pl.rem)+'. ولك أن تسبق الوقت الآن.';}
 else{k='اليوم';t=pg(pl.rem)+' '+est(pl.rem);sub='';}
 return '<section class="card now"><div class="k">'+k+'</div><div class="t">'+t+'</div><p class="mute sm" style="margin:0 0 12px">'+sub+'</p><div class="row"><button class="btn sp" data-a="read">'+I('book')+'ابدأ القراءة</button><button class="btn ghost" data-a="postpone">أجّل</button></div></section>';}
function vHome(){var t=dk(),pl=plan(),st=streak(),dh=IX.d[t]||0,db=debtNow(),q=quote(),sec=IX.s[t]||0;
 var h='<header class="top"><h1>وِرد عيسى<small>'+greet()+' · '+hijri()+'</small></h1>'+(canInstall()?'<button class="pill" data-a="install">'+I('down')+'تثبيت</button>':'')+'<button class="ibtn" data-a="settings" aria-label="الإعدادات">'+I('gear')+'</button></header>';
 h+='<section class="sky"><canvas id="sky"></canvas><div class="in"><div class="cap">قمر اليوم يكتمل بوردك، وكل صفحة تضيء نجمة من ٦٠٤</div><div style="margin-top:118px"><div class="lab">ورد اليوم</div><div class="big">'+N(pl.read)+' <small>من '+pg(pl.goal)+'</small></div></div>'+
  '<div class="chips" style="margin-top:12px"><span class="chip">'+I('fire')+(st.n?dayn(st.n)+' بلا انقطاع':'ابدأ سلسلتك اليوم')+'</span>'+(st.sh?'<span class="chip">'+I('shield')+N(st.sh)+' درع</span>':'')+'<span class="chip">'+I('clock')+dur(sec)+'</span><span class="chip">'+I('book')+'ص '+N(S.cfg.cur)+' · '+D.surOf(S.cfg.cur)+'</span></div></div></section>';
 if(pl.behind>0&&pl.rem>0)h+='<div class="alert">'+I('warn')+'<div class="sp">متأخر '+pg(pl.behind)+' عن خطة اليوم. أُعيد توزيعها على ما بقي من الأوقات.</div><button class="btn sm soft" data-a="tab" data-t="heal">عالجها</button></div>';
 if(S.cfg.niyya&&(pl.behind>0||pl.late))h+='<div class="alert ok">'+I('heart')+'<div>نيّتك: '+esc(S.cfg.niyya)+'</div></div>';
 h+=nowCard(pl);
 h+='<div class="two"><button class="tile" data-a="read"><span class="ico">'+I('book')+'</span><b>القراءة</b><span class="sm mute">'+N(pl.read)+' من '+N(pl.goal)+' · '+N(S.cfg.spp/60)+' د للصفحة</span><span class="bar"><i style="width:'+Math.min(100,pl.goal?pl.read/pl.goal*100:0)+'%"></i></span></button>'+
  '<button class="tile b" data-a="dhikr"><span class="ico">'+I('beads')+'</span><b>التسبيح</b><span class="sm mute">'+N(dh)+' من '+N(S.cfg.dhikr)+'</span><span class="bar"><i style="width:'+Math.min(100,dh/S.cfg.dhikr*100)+'%"></i></span></button></div>';
 if(db>0)h+='<section class="card"><h2>'+I('undo')+'فائت يُقضى<span class="sp"></span><small>'+pg(db)+'</small></h2><p class="sm mute" style="margin:0 0 10px">'+(S.makeup?'خطة التعويض تعمل: '+pg(extraToday())+' إضافية اليوم ضمن وردك.':'اختر خطة تعويض تُطبَّق فورًا على وردك.')+'</p><button class="btn soft block sm" data-a="tab" data-t="heal">'+(S.makeup?'تابع الخطة':'خطط التعويض')+'</button></section>';
 h+='<section class="card quote"><p>'+q[0]+'</p><span>'+q[1]+'</span></section>';
 h+='<button class="btn ghost block" data-a="manual">'+I('plus')+'سجّل قراءة أو تسبيحًا تمّ خارج التطبيق</button>';
 return h;}

function vPlan(){var pl=plan(),pt=PT(),h='<header class="top"><h1>خطة اليوم<small>تتوزع على أوقاتك وتُعاد قسمتها كلما مضى وقت</small></h1></header>';
 var need=pl.rem*pl.spp;
 h+='<section class="card"><h2>'+I('plan')+'سير اليوم<span class="sp"></span><small>'+N(pl.read)+' / '+N(pl.goal)+'</small></h2>';
 if(!pl.sl.length)h+='<div class="empty">فعّل وقتًا واحدًا على الأقل من الأسفل.</div>';
 pl.sl.forEach(function(s){var cls=s.state==='past'?(s.done>=s.orig?'done past':'miss past'):s.state==='cur'?'cur':'',v,sm;
  if(s.state==='past'){v=N(s.done)+'/'+N(s.orig);sm=s.done>=s.orig?'تم':(s.orig-s.done>0?'رُحّل '+N(s.orig-s.done):'');}
  else{v=pl.rem===0?N(s.done||0):N(s.need);sm=pl.rem===0?'مكتمل':'≈ '+dur(s.need*pl.spp)+(s.done?' · قرأت '+N(s.done):'');}
  h+='<div class="slot '+cls+'"><span class="dot"></span><div class="b"><div class="n">'+esc(s.name)+(s.state==='cur'?' <span class="xs" style="color:var(--acc)">· الآن</span>':'')+'</div><div class="tm">'+hm(s.min)+'</div></div><div class="v">'+v+'<small>'+sm+'</small></div></div>';});
 h+='</section>';
 h+='<div class="alert '+(pl.rem?'':'ok')+'">'+I(pl.rem?'clock':'ok')+'<div>'+(pl.rem?'يلزمك '+dur(need)+' لإتمام ورد اليوم بإيقاعك ('+mins(pl.spp)+' د للصفحة). إن بدأت الآن تنتهي '+hm(nowMin()+need/60)+'.':'ورد اليوم مكتمل. بارك الله لك.')+'</div></div>';
 h+='<section class="card"><h2>'+I('sunrise')+'مواقيت اليوم<span class="sp"></span><small>تقريبية</small></h2><div class="pt">'+[['الفجر','fajr'],['الشروق','sunrise'],['الظهر','dhuhr'],['العصر','asr'],['المغرب','maghrib'],['العشاء','isha']].map(function(x){return '<div>'+x[0]+'<b>'+hm(pt[x[1]]).replace(/ [صم]$/,'')+'</b></div>';}).join('')+'</div>'+
  '<div class="row" style="margin-top:12px"><select class="inp" data-c="city">'+D.CITIES.map(function(c){return '<option value="'+c[0]+'"'+(S.cfg.city===c[0]?' selected':'')+'>'+c[1]+'</option>';}).join('')+(S.cfg.city==='gps'?'<option value="gps" selected>موقعي الحالي</option>':'')+'</select><button class="btn soft sm" data-a="gps">موقعي</button></div></section>';
 h+='<section class="card"><h2>'+I('grid')+'أوقات الورد<span class="sp"></span><small>النصيب يحدد حصة كل وقت</small></h2>';
 S.cfg.slots.forEach(function(s,i){h+='<div class="set"><button class="sw" role="switch" aria-checked="'+!!s.on+'" aria-label="'+esc(s.name)+'" data-a="slotOn" data-i="'+i+'"></button><div class="l">'+esc(s.name)+'<small>'+(s.time?'وقت ثابت':'يتبع الصلاة')+'</small></div>'+
  '<input class="inp t" type="time" value="'+pad(Math.floor(slotMin(s)/60)%24)+':'+pad(slotMin(s)%60)+'" data-c="slotT" data-i="'+i+'" aria-label="وقت '+esc(s.name)+'">'+
  (s.on?'<div class="wrow"><span class="sm mute sp">نصيبه من الورد</span><span class="step"><button data-a="slotW" data-i="'+i+'" data-d="-1" aria-label="أقل">−</button><b>'+N(s.w)+'</b><button data-a="slotW" data-i="'+i+'" data-d="1" aria-label="أكثر">+</button></span></div>':'')+'</div>';});
 h+='<div class="row" style="margin-top:12px"><button class="btn soft sm sp" data-a="slotsAuto">أعدها لمواقيت الصلاة</button><button class="btn soft sm sp" data-a="ics">'+I('bell')+'تذكير بالتقويم</button></div></section>';
 return h;}

function remHTML(r){var d=r.d,dis='';if(r.id==='best'){var b=bestSlot();if(b)d='أكثر قراءتك في آخر ثلاثين يومًا كانت «'+b.name+'» ('+pg(b.n)+'). اجعل له النصيب الأكبر.';else{d='بعد أيام من التسجيل يظهر هنا أقوى أوقاتك لتبني عليه.';dis=' disabled style="opacity:.5"';}}
 if(r.id==='prep'&&S.flags.prep===dk())dis=' disabled style="opacity:.5"';
 if(r.id==='half'&&S.cfg.ease)d='الهدف مخفف إلى '+pg(S.cfg.ease.pages)+' حتى '+dayFull(S.cfg.ease.until)+'.';
 return '<div class="rem"><span class="ico">'+I(r.ic)+'</span><div class="sp"><b>'+r.t+'</b><p>'+d+'</p><button class="btn sm soft" data-a="remedy" data-id="'+r.id+'"'+dis+'>'+(r.id==='prep'&&dis?'جاهز لغدٍ':r.id==='half'&&S.cfg.ease?'أعد الهدف الأصلي':r.act)+'</button></div></div>';}
var cause=null;
function vHeal(){var db=debtNow(),md=missedDays(),lim=dAdd(dk(),-7),wk=S.delays.filter(function(x){return x.d>=lim;}),cc={},top=null;
 S.delays.forEach(function(x){cc[x.c]=(cc[x.c]||0)+1;});Object.keys(cc).forEach(function(k){if(!top||cc[k]>cc[top])top=k;});
 var h='<header class="top"><h1>العلاج والتعويض<small>خطط قصيرة تُطبَّق بضغطة واحدة</small></h1></header>';
 h+='<section class="card"><h2>'+I('undo')+'قضاء ما فات</h2>';
 if(db===0)h+='<div class="alert ok" style="margin:0">'+I('ok')+'<div>لا فائت عليك. وردك في موعده.</div></div>';
 else{var c=carry();h+='<div class="row" style="margin-bottom:10px"><div class="sp"><div class="debt">'+N(db)+'</div><div class="sm mute">صفحة فائتة من '+dayn(md.length)+' · ≈ '+dur(db*avgSpp())+'</div></div></div>';
  [[1,'اقضها اليوم','جلسة واحدة تمحو الفائت'],[3,'على ثلاثة أيام','زيادة يسيرة تنتهي سريعًا'],[7,'على أسبوع','أخف زيادة يومية']].forEach(function(o){var per=Math.ceil(c/o[0]);if(o[0]>1&&c<o[0])return;var on=S.makeup&&S.makeup.days===o[0];
   h+='<button class="plan'+(on?' on':'')+'" data-a="makeup" data-n="'+o[0]+'"><span class="num">+'+N(per)+'</span><span class="sp"><b>'+o[1]+'</b><small>'+o[2]+' · '+pg(per)+' إضافية '+(o[0]===1?'اليوم':'يوميًا')+' ≈ '+dur(per*avgSpp())+'</small></span>'+(on?I('ok'):'')+'</button>';});
  h+='<p class="xs mute" style="margin:8px 0 10px">'+D.MAKEUP_Q[0]+' '+D.MAKEUP_Q[1]+'.</p><div class="row">'+(S.makeup?'<button class="btn sm ghost sp" data-a="makeupOff">أوقف الخطة</button>':'')+'<button class="btn sm ghost sp" data-a="forgive">صفحة جديدة: ابدأ من اليوم</button></div>';}
 h+='</section>';
 h+='<section class="card"><h2>'+I('heal')+'لماذا أتأخر؟</h2><p class="sm mute" style="margin:0 0 10px">اختر السبب الأقرب، وتظهر لك الخطط المناسبة له.</p><div class="causes">'+D.CAUSES.map(function(c){return '<button aria-pressed="'+(cause===c.id)+'" data-a="cause" data-id="'+c.id+'">'+c.t+'</button>';}).join('')+'</div>';
 if(cause){var C=D.CAUSES.filter(function(c){return c.id===cause;})[0];h+='<div style="margin-top:6px">'+C.r.map(function(id){return remHTML(D.REMEDIES.filter(function(r){return r.id===id;})[0]);}).join('')+'</div>';}
 h+='</section>';
 h+='<section class="card"><h2>'+I('chart')+'ميزان التأجيل<span class="sp"></span><small>آخر ٧ أيام</small></h2><div class="kpis" style="margin:0"><div class="kpi"><b>'+N(wk.length)+'</b><span>مرات التأجيل</span></div><div class="kpi"><b>'+(top?D.CAUSES.filter(function(c){return c.id===top;})[0].t:'لا يوجد')+'</b><span>السبب الأكثر</span></div></div></section>';
 h+='<section class="card"><h2>'+I('leaf')+'كل الخطط</h2>'+D.REMEDIES.map(remHTML).join('')+'</section>';
 return h;}

function vReports(){var t=dk(),days=[],i;for(i=0;i<range;i++)days.push(dAdd(t,-i));
 var first=S.cfg.start||t,act=days.filter(function(d){return d>=first;}),tp=0,ts=0,td=0,met=0,best=null;
 act.forEach(function(d){var p=IX.p[d]||0;tp+=p;ts+=IX.s[d]||0;td+=IX.d[d]||0;if(p>=goalOf(d)&&p>0)met++;if(p&&(!best||p>IX.p[best]))best=d;});
 var h='<header class="top"><h1>التقارير<small>'+(act.length<range?'منذ بدأت: '+dayn(act.length):'آخر '+dayn(range))+'</small></h1><div class="seg">'+[7,30,90].map(function(r){return '<button aria-pressed="'+(range===r)+'" data-a="range" data-r="'+r+'">'+N(r)+'</button>';}).join('')+'</div></header>';
 if(!S.reads.length&&!S.dhikr.length)return h+'<section class="card"><div class="empty">لا بيانات بعد. ابدأ أول جلسة قراءة أو تسبيح، وتمتلئ هذه الصفحة بالأرقام والرسوم.</div><button class="btn block" data-a="read">'+I('book')+'ابدأ القراءة</button></section>';
 h+='<div class="kpis"><div class="kpi"><b>'+N(tp)+'</b><span>صفحة مقروءة</span></div><div class="kpi"><b>'+dur(ts)+'</b><span>وقت القراءة</span></div><div class="kpi"><b>'+(tp?mins(ts/tp)+' د':'-')+'</b><span>متوسط الصفحة (الهدف '+N(S.cfg.spp/60)+')</span></div><div class="kpi"><b>'+N(act.length?Math.round(met/act.length*100):0)+'٪</b><span>أيام تمّ فيها الورد</span></div><div class="kpi"><b>'+N(td)+'</b><span>تسبيحة</span></div><div class="kpi"><b>'+(best?N(IX.p[best]):'-')+'</b><span>أعلى يوم'+(best?' · '+dayFull(best):'')+'</span></div></div>';
 var g=S.cfg.pages;
 h+='<section class="card chart"><h2>الصفحات كل يوم</h2>'+bars(days.map(function(d){var p=IX.p[d]||0;return {l:dayLabel(d),v:p,lo:p<goalOf(d),tip:dayFull(d)+': '+pg(p)+' من '+N(goalOf(d))};}),{goal:g,label:'الصفحات المقروءة كل يوم'})+'<div class="leg"><span><i class="s"></i>أتمّ الهدف</span><span><i class="s lo"></i>دون الهدف</span><span><i></i>الهدف '+N(g)+'</span></div></section>';
 h+='<section class="card chart"><h2>دقائق الصفحة الواحدة</h2>'+line(days.map(function(d){var p=IX.p[d]||0;return {l:dayLabel(d),v:p?(IX.s[d]/p/60):null,tip:dayFull(d)+': '+(p?mins(IX.s[d]/p)+' د للصفحة':'')};}),{goal:S.cfg.spp/60,label:'متوسط دقائق الصفحة كل يوم'})+'<div class="leg"><span><i></i>الوقت المحدد '+N(S.cfg.spp/60)+' د</span></div></section>';
 h+='<section class="card chart"><h2>التسبيح كل يوم</h2>'+bars(days.map(function(d){var n=IX.d[d]||0;return {l:dayLabel(d),v:n,lo:n<S.cfg.dhikr,tip:dayFull(d)+': '+N(n)+' تسبيحة'};}),{goal:S.cfg.dhikr,label:'عدد التسبيح كل يوم'})+'<div class="leg"><span><i></i>الهدف '+N(S.cfg.dhikr)+'</span></div></section>';
 var hrs=[],mx=0;for(i=0;i<24;i++)hrs.push(0);S.reads.forEach(function(r){if(r.d>=days[days.length-1]){var hh=new Date(r.t).getHours();hrs[hh]+=r.p.length;}});hrs.forEach(function(v){mx=Math.max(mx,v);});
 h+='<section class="card"><h2>متى تقرأ؟<span class="sp"></span><small>ساعات اليوم</small></h2><div class="hours" dir="ltr">'+hrs.map(function(v,k){return '<i style="opacity:'+(v?0.25+0.75*v/mx:0.08)+'" data-tip="الساعة '+hm(k*60)+': '+pg(v)+'"></i>';}).join('')+'</div><div class="hl"><span>'+N(12)+' ص</span><span>'+N(6)+' ص</span><span>'+N(12)+' م</span><span>'+N(6)+' م</span><span>'+N(11)+' م</span></div></section>';
 /* تقويم خمسة أسابيع */
 var end=dDate(t),cells='',startCal=dAdd(t,-(28+end.getDay()));
 h+='<section class="card"><h2>'+I('cal')+'التزام الأسابيع</h2><div class="cal">'+DS.map(function(x){return '<span>'+x+'</span>';}).join('');
 for(i=0;i<35;i++){var d=dAdd(startCal,i);if(d>t){cells+='<i class="x"></i>';continue;}var p=IX.p[d]||0,gg=goalOf(d);cells+='<i class="'+(p>=gg&&p>0?'f':p>0?'p':'')+(d===t?' t':'')+'" data-tip="'+dayFull(d)+': '+pg(p)+'">'+N(dDate(d).getDate())+'</i>';}
 h+=cells+'</div><div class="leg"><span>الممتلئ: ورد كامل · الفاتح: بعض الورد</span></div></section>';
 var cc={},tc=0;S.delays.forEach(function(x){cc[x.c]=(cc[x.c]||0)+1;tc++;});
 if(tc)h+='<section class="card"><h2>أسباب التأجيل</h2><div class="hb">'+D.CAUSES.filter(function(c){return cc[c.id];}).sort(function(a,b){return cc[b.id]-cc[a.id];}).map(function(c){return '<span>'+c.t+'</span><i style="width:'+(cc[c.id]/tc*100)+'%"></i><b>'+N(cc[c.id])+'</b>';}).join('')+'</div></section>';
 h+='<section class="card"><h2>سجل الجلسات<span class="sp"></span><small>اضغط جلسة لترى وقت كل صفحة</small></h2>';
 var all=S.reads.map(function(r){return {k:'r',r:r};}).concat(S.dhikr.map(function(r){return {k:'d',r:r};})).sort(function(a,b){return b.r.t-a.r.t;}),more=all.length>12&&!logAll;if(more)all=all.slice(0,12);
 all.forEach(function(x){var r=x.r,tm=new Date(r.t),when=dayFull(r.d)+' · '+hm(tm.getHours()*60+tm.getMinutes());
  if(x.k==='d'){h+='<div class="log"><div class="h"><span style="color:var(--acc2)">'+I('beads')+'</span><div class="sp"><b>'+N(r.n)+' تسبيحة</b><div class="xs mute">'+when+(r.sec?' · '+dur(r.sec):'')+'</div></div><button class="ibtn" style="width:34px;height:34px" data-a="del" data-k="d" data-id="'+r.id+'" aria-label="حذف">'+I('x')+'</button></div></div>';return;}
  var sum=r.p.reduce(function(a,b){return a+b;},0),open=openLog===r.id,mxp=Math.max.apply(null,r.p.concat([S.cfg.spp]));
  h+='<div class="log"><div class="row"><button class="h sp" data-a="log" data-id="'+r.id+'"><span style="color:var(--acc)">'+I('book')+'</span><div class="sp"><b>'+pg(r.p.length)+(r.manual?' <span class="xs mute">يدوي</span>':'')+'</b><div class="xs mute">'+when+' · '+dur(sum)+' · '+mins(sum/r.p.length)+' د/ص</div></div></button><button class="ibtn" style="width:34px;height:34px" data-a="del" data-k="r" data-id="'+r.id+'" aria-label="حذف">'+I('x')+'</button></div>';
  if(open)h+='<div class="pg">'+r.p.map(function(s,k){return '<span>ص '+N(((r.from+k-1)%604)+1)+'</span><i class="'+(s>S.cfg.spp?'o':'')+'" style="width:'+Math.max(3,s/mxp*100)+'%"></i><span>'+clock(s)+'</span>';}).join('')+'</div>';
  h+='</div>';});
 if(!all.length)h+='<div class="empty">لا جلسات بعد.</div>';
 if(more)h+='<button class="btn soft sm block" style="margin-top:10px" data-a="logAll">أظهر السجل كله</button>';
 h+='</section><button class="btn ghost block" data-a="share">شارك ملخص الأسبوع</button>';
 return h;}
var openLog=null,logAll=false;

function vWins(){var T=totals(),lv=level(T.p),st=streak(),cur=S.cfg.cur,cj=D.juzOf(cur),left=604-(cur-1),g=Math.max(1,S.cfg.pages),eta=new Date(Date.now()+Math.ceil(left/g)*864e5);
 var h='<header class="top"><h1>الإنجاز<small>ما تراكم من وردك حتى اليوم</small></h1></header>';
 h+='<section class="card"><div class="lvl"><svg class="ring" viewBox="0 0 80 80"><circle cx="40" cy="40" r="34" fill="none" stroke="var(--line)" stroke-width="7"/><circle cx="40" cy="40" r="34" fill="none" stroke="var(--acc)" stroke-width="7" stroke-linecap="round" stroke-dasharray="'+(213.6*lv.pct)+' 213.6" transform="rotate(-90 40 40)"/><text x="40" y="47" text-anchor="middle" font-size="22" font-family="El Messiri" fill="var(--ink)">'+N(lv.i+1)+'</text></svg><div class="sp"><div class="xs mute">منزلتك</div><h2 style="margin:0;font-size:22px">'+lv.name+'</h2><div class="sm mute">'+(lv.next?'بقي '+pg(lv.left)+' إلى «'+lv.next+'»':'أعلى المنازل')+'</div></div></div></section>';
 h+='<div class="kpis"><div class="kpi"><b>'+N(st.n)+'</b><span>أيام السلسلة الآن</span></div><div class="kpi"><b>'+N(st.best)+'</b><span>أطول سلسلة</span></div><div class="kpi"><b>'+N(T.p)+'</b><span>مجموع الصفحات</span></div><div class="kpi"><b>'+N(T.d)+'</b><span>مجموع التسبيح</span></div></div>';
 h+='<section class="card"><h2>'+I('shield')+'دروع السلسلة<span class="sp"></span><small>'+N(st.sh)+' من ٢</small></h2><p class="sm mute" style="margin:0">كل سبعة أيام متصلة تكسبك درعًا. إن فاتك يوم حماه الدرع فلا تنقطع سلسلتك، ويبقى الفائت يُقضى.</p></section>';
 h+='<section class="card"><h2>'+I('book')+'رحلة الختمة'+(S.cfg.khatmas?' '+N(S.cfg.khatmas+1):'')+'<span class="sp"></span><small>ص '+N(cur)+' · الجزء '+N(cj)+'</small></h2><div class="prog" style="margin-bottom:12px"><i style="width:'+((cur-1)/604*100)+'%"></i></div><div class="juz">';
 for(var j=1;j<=30;j++){var a=D.JUZ[j-1],b=j<30?D.JUZ[j]:605,cls=cur>=b?'f':cur>a?'c':'';h+='<i class="'+cls+'" style="--h:'+(cls==='c'?Math.round((cur-a)/(b-a)*100):0)+'%"><span>'+N(j)+'</span></i>';}
 h+='</div><p class="sm mute" style="margin:12px 0 0">بقي '+pg(left)+'. بوردك الحالي تختم '+dayFull(dk(eta.getTime()))+' بإذن الله'+(S.cfg.khatmas?' · ختمات سابقة: '+N(S.cfg.khatmas):'')+'.</p></section>';
 h+='<section class="card"><h2>'+I('star')+'الأوسمة<span class="sp"></span><small>'+N(Object.keys(S.badges).length)+' من '+N(D.BADGES.length)+'</small></h2><div class="badges">'+D.BADGES.map(function(b){return '<div class="bdg'+(S.badges[b.id]?' on':'')+'"><div class="m">'+I(S.badges[b.id]?'star':'moon')+'</div><b>'+b.t+'</b><small>'+b.d+'</small></div>';}).join('')+'</div></section>';
 return h;}

var TABS=[['home','اليوم','home'],['plan','الخطة','plan'],['heal','العلاج','heal'],['rep','التقارير','chart'],['wins','الإنجاز','star']];
function render(){index();snap();var v={home:vHome,plan:vPlan,heal:vHeal,rep:vReports,wins:vWins}[tab];$('#app').innerHTML=v();
 $('#nav').innerHTML='<div class="w">'+TABS.map(function(t){return '<button data-a="tab" data-t="'+t[0]+'"'+(tab===t[0]?' aria-current="page"':'')+'>'+I(t[2])+t[1]+'</button>';}).join('')+'</div>';
 if(tab==='home')drawSky();}

/* ---------- النوافذ ---------- */
var sheetFn=null,F={},sheetLock=false;
function openSheet(fn,lock){sheetFn=fn;sheetLock=!!lock;reSheet();$('#sheet').classList.add('on');}
function reSheet(){if(sheetFn)$('#sheet').innerHTML='<div class="sh" role="dialog" aria-modal="true"><div class="grab"></div>'+sheetFn()+'</div>';}
function closeSheet(){$('#sheet').classList.remove('on');$('#sheet').innerHTML='';sheetFn=null;sheetLock=false;}
function shh(t,noX){return '<div class="shh"><h2>'+t+'</h2>'+(noX?'':'<button class="ibtn" data-a="close" aria-label="إغلاق">'+I('x')+'</button>')+'</div>';}
function stepper(k,val,unit){return '<span class="step"><button data-a="st" data-k="'+k+'" data-d="-1" aria-label="أقل">−</button><b>'+val+'</b><button data-a="st" data-k="'+k+'" data-d="1" aria-label="أكثر">+</button></span>'+(unit?' <span class="sm mute">'+unit+'</span>':'');}
var STEP={pages:[1,1,60],spp:[30,30,900],dhikr:[100,100,20000],cur:[1,1,604],mp:[1,1,200],mm:[1,1,600]};
function goalsForm(){var days=Math.ceil((604-(F.cur-1))/F.pages);
 return '<label class="f">صفحات اليوم<br>'+stepper('pages',N(F.pages),'صفحة كل يوم')+'</label><label class="f">وقت الصفحة الواحدة<br>'+stepper('spp',N(F.spp/60),'دقيقة')+'</label><label class="f">تسبيح اليوم<br>'+stepper('dhikr',N(F.dhikr),'تسبيحة')+'</label><label class="f">صفحتك الحالية في المصحف<br>'+stepper('cur',N(F.cur),'· '+D.surOf(F.cur)+' · الجزء '+N(D.juzOf(F.cur)))+'</label>'+
 '<div class="alert ok">'+I('ok')+'<div>وردك اليومي ≈ '+dur(F.pages*F.spp)+'، وتختم في '+N(days)+' يومًا.</div></div>';}
function onboard(){F={pages:S.cfg.pages,spp:S.cfg.spp,dhikr:S.cfg.dhikr,cur:S.cfg.cur};openSheet(function(){return shh('أهلًا عيسى',true)+'<p class="sm mute" style="margin:-6px 0 14px">حدّد هدفك مرة واحدة، وتتولى المنصة تقسيمه على يومك ومتابعته. يمكنك تغييره متى شئت.</p>'+goalsForm()+'<div class="foot"><button class="btn" data-a="saveGoals">ابدأ على بركة الله</button></div>';},true);}
function settings(){F={pages:S.cfg.pages,spp:S.cfg.spp,dhikr:S.cfg.dhikr,cur:S.cfg.cur};openSheet(function(){var th=document.documentElement.getAttribute('data-theme');
 return shh('الإعدادات')+'<h3 style="font-size:15px;margin:4px 0 10px">الهدف</h3>'+goalsForm()+'<button class="btn block" data-a="saveGoals">احفظ الهدف</button>'+
 '<h3 style="font-size:15px;margin:20px 0 10px">المظهر</h3><div class="themes">'+[['qamar','ليل القمر','#070D22','#E7C877'],['fajr','الفجر','#F6EFEA','#B8742F'],['mushaf','المصحف','#F3EBD7','#1F6B4F']].map(function(t){return '<button aria-pressed="'+(th===t[0])+'" data-a="theme" data-t="'+t[0]+'"><i style="background:linear-gradient(135deg,'+t[2]+' 60%,'+t[3]+' 60%)"></i>'+t[1]+'</button>';}).join('')+'</div>'+
 '<div style="margin-top:14px"><div class="set"><div class="l">شكل الأرقام</div><div class="seg"><button aria-pressed="'+!WEST+'" data-a="digits" data-w="0">١٢٣</button><button aria-pressed="'+WEST+'" data-a="digits" data-w="1">123</button></div></div><div class="set"><div class="l">الأصوات<small>نقرة وورقة، بلا موسيقى</small></div><button class="sw" role="switch" aria-checked="'+S.cfg.sound+'" data-a="tog" data-k="sound" aria-label="الأصوات"></button></div><div class="set"><div class="l">الاهتزاز<small>عند كل تسبيحة وصفحة</small></div><button class="sw" role="switch" aria-checked="'+S.cfg.vib+'" data-a="tog" data-k="vib" aria-label="الاهتزاز"></button></div>'+
 '<div class="set"><div class="l">تنبيهات الأوقات<small>'+(('Notification' in window)?(Notification.permission==='granted'?'مفعّلة. تصل ما دام التطبيق مفتوحًا أو في الخلفية.':'تنبيه عند دخول وقت الورد'):'غير مدعومة في هذا المتصفح')+'</small></div>'+(('Notification' in window)&&Notification.permission!=='granted'?'<button class="btn sm soft" data-a="perm">فعّل</button>':'')+'</div>'+
 '<div class="set"><div class="l">تثبيت التطبيق<small>أيقونة على الشاشة الرئيسية، ويعمل دون إنترنت</small></div><button class="btn sm soft" data-a="install">تثبيت</button></div></div>'+
 '<h3 style="font-size:15px;margin:20px 0 6px">النسخة الاحتياطية</h3><p class="sm mute" style="margin:0 0 10px">بياناتك على هذا الهاتف فقط. احفظ نسخة بين حين وآخر، واستعدها على أي هاتف دون أن تمسح ما فيه.</p><div class="row"><button class="btn soft sp" data-a="export">'+I('down')+'حفظ نسخة</button><button class="btn soft sp" data-a="import">استعادة نسخة</button></div><input type="file" id="imp" accept="application/json,.json" hidden>'+
 '<button class="btn danger block" style="margin-top:16px" data-a="wipe">مسح كل البيانات</button>';});}
function confirmSheet(title,msg,yes,fn){openSheet(function(){return shh(title)+'<p style="margin:0">'+msg+'</p><div class="foot"><button class="btn ghost" data-a="close">إلغاء</button><button class="btn" data-a="yes">'+yes+'</button></div>';});ACT.yes=function(){closeSheet();fn();};}
function manual(){F={k:'r',mp:1,mm:Math.max(1,Math.round(S.cfg.spp/60)),mn:100,auto:true};openSheet(function(){if(F.auto)F.mm=Math.max(1,Math.round(F.mp*S.cfg.spp/60));
 return shh('تسجيل يدوي')+'<div class="seg" style="margin-bottom:14px"><button aria-pressed="'+(F.k==='r')+'" data-a="mk" data-k="r">قراءة</button><button aria-pressed="'+(F.k==='d')+'" data-a="mk" data-k="d">تسبيح</button></div>'+
 (F.k==='r'?'<label class="f">عدد الصفحات<br>'+stepper('mp',N(F.mp),'صفحة')+'</label><label class="f">الوقت كله<br>'+stepper('mm',N(F.mm),'دقيقة')+'</label>':'<label class="f">عدد التسبيح<input class="inp" type="number" inputmode="numeric" min="1" id="mn" value="'+F.mn+'" dir="ltr"></label>')+
 '<div class="foot"><button class="btn ghost" data-a="close">إلغاء</button><button class="btn" data-a="saveManual">سجّل</button></div>';});}
function postpone(){F={c:null};openSheet(function(){var h=shh('قبل أن تؤجّل')+'<p class="sm mute" style="margin:-6px 0 12px">ما الذي يمنعك الآن؟ يُسجَّل السبب لتعرف نمطك، ونقترح عليك ما يناسبه.</p><div class="causes">'+D.CAUSES.map(function(c){return '<button aria-pressed="'+(F.c===c.id)+'" data-a="pc" data-id="'+c.id+'">'+c.t+'</button>';}).join('')+'</div>';
 if(F.c){var C=D.CAUSES.filter(function(c){return c.id===F.c;})[0];h+='<div style="margin-top:8px">'+C.r.slice(0,2).map(function(id){return remHTML(D.REMEDIES.filter(function(r){return r.id===id;})[0]);}).join('')+'</div><div class="foot"><button class="btn ghost" data-a="snooze" data-m="15">ذكّرني بعد ١٥ دقيقة</button><button class="btn ghost" data-a="snooze" data-m="60">بعد ساعة</button></div>';}
 return h;});}
function celebrate(title,msg){var d=document.createElement('div');d.className='cele';d.innerHTML='<div><div class="moon"></div><h2>'+title+'</h2><p>'+msg+'</p><button class="btn" style="background:var(--star);color:#1d1705">الحمد لله</button></div>';document.body.appendChild(d);snd('done');vib([40,80,40,80,120]);d.addEventListener('click',function(){d.remove();});}

/* ---------- جلسة القراءة ---------- */
var tick=0,wl=null;
function wake(){try{if(navigator.wakeLock)navigator.wakeLock.request('screen').then(function(l){wl=l;}).catch(function(){});}catch(e){}}
function unwake(){try{if(wl)wl.release();}catch(e){}wl=null;}
function startRead(mode){if(A&&A.type==='read'){showRead();return;}if(A)finishDhikr(true);A={type:'read',t0:Date.now(),laps:[],lapStart:Date.now(),paused:0,from:S.cfg.cur,mode:mode||null};saveA();showRead();}
function lapSec(){return ((A.paused||Date.now())-A.lapStart)/1000;}
function showRead(){var o=$('#over');o.classList.add('on');wake();paintRead();clearInterval(tick);tick=setInterval(tickRead,500);}
function paintRead(){var p=((A.from+A.laps.length-1)%604)+1,t=dk(),left=Math.max(0,goalToday()-(IX.p[t]||0)-A.laps.length);
 $('#over').innerHTML='<div class="ses"><div class="hd"><button class="ibtn" data-a="minRead" aria-label="تصغير">'+I('chev')+'</button><b>'+(A.mode==='one'?'صفحة واحدة فقط':A.mode==='five'?'خمس دقائق':'جلسة قراءة')+'</b><span class="tt" id="rTot"></span></div>'+
 '<div class="mid"><div class="ringw" id="rRing"><svg viewBox="0 0 100 100"><circle class="bg" cx="50" cy="50" r="45"/><circle class="fg" id="rFg" cx="50" cy="50" r="45" stroke-dasharray="282.7" stroke-dashoffset="282.7"/></svg><div class="c"><div class="pg">صفحة '+N(p)+'</div><small>'+D.surOf(p)+' · الجزء '+N(D.juzOf(p))+'</small><div class="tm" id="rTm"></div><small id="rHint"></small></div></div></div>'+
 '<div class="st"><div><b>'+N(A.laps.length)+'</b>صفحات الجلسة</div><div><b>'+(A.laps.length?clock(A.laps.reduce(function(a,b){return a+b;},0)/A.laps.length):'-')+'</b>متوسط الصفحة</div><div><b>'+N(left)+'</b>باقي ورد اليوم</div></div>'+
 '<button class="main" data-a="lap">أتممتُ الصفحة</button><div class="acts"><button data-a="pauseRead">'+I(A.paused?'play':'pause')+(A.paused?'استئناف':'توقف')+'</button><button data-a="undoLap"'+(A.laps.length?'':' disabled style="opacity:.4"')+'>'+I('undo')+'تراجع</button><button data-a="finishRead">'+I('ok')+'إنهاء</button></div></div>';tickRead();}
function tickRead(){if(!A||A.type!=='read')return;var s=lapSec(),tm=$('#rTm');if(!tm)return;tm.textContent=clock(s);var pct=Math.min(1,s/S.cfg.spp);$('#rFg').style.strokeDashoffset=282.7*(1-pct);$('#rRing').classList.toggle('over',s>S.cfg.spp);
 $('#rHint').textContent=A.paused?'متوقف':s>S.cfg.spp?'تجاوزت الوقت المحدد، أكمل بتمهل':'الوقت المحدد '+clock(S.cfg.spp);var tot=A.laps.reduce(function(a,b){return a+b;},0)+s;$('#rTot').textContent=clock(tot);
 if(A.mode==='five'&&tot>=300&&!A.told){A.told=1;saveA();vib([80,60,80]);snd('done');toast('انتهت الخمس دقائق. لك أن تتوقف راضيًا، ولك أن تكمل.');}}
function finishRead(){if(!A||A.type!=='read')return;var laps=A.laps,t=dk(A.t0),before,goal;clearInterval(tick);unwake();$('#over').classList.remove('on');$('#over').innerHTML='';
 if(!laps.length){A=null;saveA();toast('لم تُسجَّل صفحة. الجلسة لم تُحفظ.');render();return;}
 index();before=IX.p[dk()]||0;goal=goalToday();var rec={id:uid(),t:A.t0,d:t,p:laps.map(function(x){return Math.round(x);}),from:A.from};if(A.mode==='one')S.flags.micro++;
 S.reads.push(rec);var c=S.cfg.cur+laps.length,kh=false;while(c>604){c-=604;S.cfg.khatmas++;kh=true;}S.cfg.cur=c;A=null;saveA();save();index();checkMakeup();checkBadges();render();
 var after=IX.p[dk()]||0,sum=rec.p.reduce(function(a,b){return a+b;},0),avg=sum/rec.p.length;
 if(kh){celebrate('ختمة مباركة','أتممت المصحف كله. تقبّل الله منك، وهذه بداية ختمة جديدة.');return;}
 if(before<goal&&after>=goal){celebrate('اكتمل قمر اليوم','أتممت وردك: '+pg(after)+' في '+dur(IX.s[dk()]||0)+'.');return;}
 openSheet(function(){var mx=Math.max.apply(null,rec.p.concat([S.cfg.spp]));return shh('ملخص الجلسة')+'<div class="kpis"><div class="kpi"><b>'+N(rec.p.length)+'</b><span>صفحة</span></div><div class="kpi"><b>'+dur(sum)+'</b><span>المدة</span></div><div class="kpi"><b>'+mins(avg)+' د</b><span>متوسط الصفحة</span></div><div class="kpi"><b>'+(avg<=S.cfg.spp?'ضمن الوقت':'+'+clock(avg-S.cfg.spp))+'</b><span>مقارنة بالمحدد</span></div></div><div class="log" style="border:0;padding:0"><div class="pg" style="margin:0">'+rec.p.map(function(s,k){return '<span>ص '+N(((rec.from+k-1)%604)+1)+'</span><i class="'+(s>S.cfg.spp?'o':'')+'" style="width:'+Math.max(3,s/mx*100)+'%"></i><span>'+clock(s)+'</span>';}).join('')+'</div></div><div class="foot"><button class="btn" data-a="close">تم</button></div>';});}

/* ---------- جلسة التسبيح ---------- */
function startDhikr(){if(A&&A.type==='dhikr'){showDhikr();return;}if(A&&A.type==='read'){showRead();toast('أنهِ جلسة القراءة أولًا');return;}A={type:'dhikr',t0:Date.now(),n:0};saveA();showDhikr();}
function showDhikr(){$('#over').classList.add('on');wake();var beads='';for(var i=0;i<33;i++){var a=(i/33)*6.283-1.5708;beads+='<circle class="bead" cx="'+(50+46*Math.cos(a)).toFixed(2)+'" cy="'+(50+46*Math.sin(a)).toFixed(2)+'" r="2.3"/>';}
 $('#over').innerHTML='<div class="ses"><div class="hd"><button class="ibtn" data-a="finishDhikr" aria-label="إنهاء">'+I('chev')+'</button><b>التسبيح</b><span class="tt" id="dDay"></span></div><div class="mid"><div class="tap" id="tap" role="button" aria-label="سبّح"><svg viewBox="0 0 100 100">'+beads+'</svg><div class="core"><div class="num" id="dNum"></div><small id="dSub"></small></div></div></div>'+
 '<p style="opacity:.75;font-size:13px;margin:0 0 12px;text-align:center">اضغط في أي مكان من الشاشة. اهتزازة أطول عند كل ٣٣ و١٠٠.</p><div class="acts"><button data-a="dMinus">'+I('undo')+'تراجع</button><button data-a="dAdd100">'+I('plus')+'١٠٠ يدويًا</button><button data-a="finishDhikr">'+I('ok')+'إنهاء</button></div></div>';
 $('#over .mid').addEventListener('pointerdown',function(e){e.preventDefault();tapDhikr(1);});paintDhikr();}
function paintDhikr(){if(!$('#dNum'))return;var n=A.n,r=n%33,day=(IX.d[dk()]||0)+n;$('#dNum').textContent=N(n);$('#dSub').textContent='الدورة '+N(Math.floor(n/33)+1)+' · '+N(r)+'/٣٣';$('#dDay').textContent='اليوم '+N(day)+' / '+N(S.cfg.dhikr);
 var b=document.querySelectorAll('#tap .bead');for(var i=0;i<b.length;i++)b[i].classList.toggle('on',i<r||(r===0&&n>0));}
function tapDhikr(k){var day0=(IX.d[dk()]||0)+A.n;A.n=Math.max(0,A.n+k);saveA();var n=A.n,day=day0+k;if(k>0){if(n%100===0)vib([60,50,120]);else if(n%33===0)vib(70);else vib(12);snd('tap');var t=$('#tap');t.classList.add('hit');setTimeout(function(){t.classList.remove('hit');},90);
  if(day0<S.cfg.dhikr&&day>=S.cfg.dhikr){vib([60,60,60,60,160]);snd('done');toast('أتممت تسبيح اليوم: '+N(S.cfg.dhikr));}}paintDhikr();}
function finishDhikr(silent){if(!A||A.type!=='dhikr')return;unwake();$('#over').classList.remove('on');$('#over').innerHTML='';if(A.n>0){S.dhikr.push({id:uid(),t:A.t0,d:dk(A.t0),n:A.n,sec:Math.round((Date.now()-A.t0)/1000)});save();if(!silent)toast('سُجّلت '+N(A.n)+' تسبيحة');}A=null;saveA();index();checkBadges();render();}

/* ---------- التثبيت والنسخ والتذكير ---------- */
var defer=null,standalone=window.matchMedia&&matchMedia('(display-mode: standalone)').matches||navigator.standalone;
window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();defer=e;if(tab==='home'&&!sheetFn)render();});
window.addEventListener('appinstalled',function(){defer=null;standalone=true;toast('ثُبّت التطبيق على هاتفك');render();});
function canInstall(){return !standalone;}
function install(){if(standalone){toast('التطبيق مثبّت على هذا الجهاز');return;}if(defer){defer.prompt();defer.userChoice.then(function(){defer=null;});return;}
 var ios=/iphone|ipad|ipod/i.test(navigator.userAgent);openSheet(function(){return shh('تثبيت التطبيق')+(ios?'<p>في Safari: اضغط زر المشاركة أسفل الشاشة، ثم «إضافة إلى الشاشة الرئيسية».</p>':'<p>في Chrome على أندرويد: اضغط القائمة ⋮ أعلى الشاشة، ثم «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية».</p><p class="sm mute">إن لم يظهر الخيار فافتح الرابط في Chrome نفسه لا من داخل تطبيق آخر.</p>')+'<div class="foot"><button class="btn" data-a="close">فهمت</button></div>';});}
function download(name,text,type){var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type:type}));a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove();},800);}
function exportData(){download('wird-issa-'+dk()+'.json',JSON.stringify({app:'wird-issa',at:Date.now(),state:S}),'application/json');toast('حُفظت النسخة في التنزيلات');}
function importData(file){var r=new FileReader();r.onload=function(){try{var j=JSON.parse(r.result),o=j.state;if(!o||!o.cfg||!Array.isArray(o.reads))throw 0;var add=0;
  ['reads','dhikr'].forEach(function(k){var have={};S[k].forEach(function(x){have[x.id]=1;});(o[k]||[]).forEach(function(x){if(x&&x.id&&!have[x.id]){S[k].push(x);add++;}});S[k].sort(function(a,b){return a.t-b.t;});});
  var hd={};S.delays.forEach(function(x){hd[x.t]=1;});(o.delays||[]).forEach(function(x){if(!hd[x.t])S.delays.push(x);});
  for(var d in o.goals||{})if(S.goals[d]==null)S.goals[d]=o.goals[d];for(var b in o.badges||{})if(!S.badges[b])S.badges[b]=o.badges[b];
  if(!S.reads.length||!S.cfg.set||(o.cfg.start&&(!S.cfg.start||o.cfg.start<S.cfg.start)))S.cfg.start=o.cfg.start||S.cfg.start;
  if(o.cfg.khatmas*604+o.cfg.cur>S.cfg.khatmas*604+S.cfg.cur){S.cfg.khatmas=o.cfg.khatmas;S.cfg.cur=o.cfg.cur;}
  if(!S.cfg.set){['pages','spp','dhikr','slots','city','lat','lng','niyya'].forEach(function(k){if(o.cfg[k]!=null)S.cfg[k]=o.cfg[k];});S.cfg.set=true;}
  save();closeSheet();render();toast('استُعيدت النسخة: أُضيف '+N(add)+' سجلًّا دون مسح الموجود');}catch(e){toast('الملف ليس نسخة صالحة من وِرد عيسى');}};r.readAsText(file);}
function ics(){var sl=slots(),now=new Date(),st=now.getFullYear()+pad(now.getMonth()+1)+pad(now.getDate()),o=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//wird-issa//AR','CALSCALE:GREGORIAN'];
 sl.forEach(function(s){o.push('BEGIN:VEVENT','UID:wird-'+s.id+'@issa','DTSTAMP:'+st+'T000000Z','DTSTART:'+st+'T'+pad(Math.floor(s.min/60))+pad(s.min%60)+'00','DURATION:PT15M','RRULE:FREQ=DAILY','SUMMARY:وِردي · '+s.name,'DESCRIPTION:افتح وِرد عيسى واقرأ نصيب هذا الوقت','BEGIN:VALARM','ACTION:DISPLAY','DESCRIPTION:حان وقت الورد · '+s.name,'TRIGGER:PT0M','END:VALARM','END:VEVENT');});
 o.push('END:VCALENDAR');download('wird-reminders.ics',o.join('\r\n'),'text/calendar');toast('افتح الملف المنزَّل لإضافته إلى تقويم هاتفك');}
function share(){var t=dk(),tp=0,ts=0,td=0,met=0;for(var i=0;i<7;i++){var d=dAdd(t,-i),p=IX.p[d]||0;tp+=p;ts+=IX.s[d]||0;td+=IX.d[d]||0;if(p>=goalOf(d)&&p)met++;}
 var txt='وِردي في آخر ٧ أيام:\n'+pg(tp)+' في '+dur(ts)+'\nمتوسط الصفحة: '+(tp?mins(ts/tp):'-')+' د\nالتسبيح: '+N(td)+'\nأيام اكتمل فيها الورد: '+N(met)+' من ٧';
 if(navigator.share)navigator.share({text:txt}).catch(function(){});else if(navigator.clipboard)navigator.clipboard.writeText(txt).then(function(){toast('نُسخ الملخص');});}
var fired={};
function minute(){var t=dk();if(!S.cfg.set)return;if(S.snooze&&Date.now()>=S.snooze){S.snooze=0;save();notify('حان الموعد الذي أجّلت إليه','صفحة واحدة تكفي للبداية');}
 if(A)return;index();var pl=plan(),nm=nowMin();pl.sl.forEach(function(s){var k=t+s.id;if(nm>=s.min&&nm<s.min+2&&!fired[k]&&pl.rem>0){fired[k]=1;notify('وقت الورد · '+s.name,pg(s.need||pl.rem)+' ≈ '+dur((s.need||pl.rem)*pl.spp));}});
 if(lastDay!==t){lastDay=t;render();}else if(tab==='home'||tab==='plan'){if(!document.activeElement||!/INPUT|SELECT/.test(document.activeElement.tagName))render();}}
var lastDay=dk();

/* ---------- الأفعال ---------- */
var ACT={
 tab:function(e){tab=e.dataset.t;render();window.scrollTo(0,0);snd('tap');},
 settings:settings,close:function(){if(!sheetLock)closeSheet();},install:install,manual:manual,postpone:postpone,ics:ics,share:share,
 read:function(){closeSheet();startRead();},dhikr:function(){startDhikr();},
 st:function(e){var k=e.dataset.k,c=STEP[k],v=F[k]+c[0]*(+e.dataset.d);F[k]=Math.max(c[1],Math.min(c[2],v));if(k==='mm')F.auto=false;reSheet();},
 saveGoals:function(){var was=S.cfg.set;S.cfg.pages=F.pages;S.cfg.spp=F.spp;S.cfg.dhikr=F.dhikr;S.cfg.cur=F.cur;if(!was){S.cfg.set=true;S.cfg.start=dk();S.goals={};}S.goals[dk()]=baseGoal();save();closeSheet();render();toast(was?'حُفظ الهدف':'بدأت رحلتك. وفقك الله.');if(!was)try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist();}catch(x){}},
 theme:function(e){var t=e.dataset.t;document.documentElement.setAttribute('data-theme',t);try{localStorage.setItem('issaf:theme',t);}catch(x){}var m=$('meta[name=theme-color]');if(m)m.content={qamar:'#0B1430',fajr:'#F6EFEA',mushaf:'#F3EBD7'}[t];reSheet();render();},
 digits:function(e){WEST=e.dataset.w==='1';try{localStorage.setItem('issaf:digits',WEST?'w':'a');}catch(x){}reSheet();render();},
 tog:function(e){S.cfg[e.dataset.k]=!S.cfg[e.dataset.k];save();reSheet();snd('tap');vib(15);},
 perm:function(){try{Notification.requestPermission().then(function(){reSheet();});}catch(x){}},
 export:exportData,import:function(){var i=$('#imp');i.onchange=function(){if(i.files[0])importData(i.files[0]);};i.click();},
 wipe:function(){confirmSheet('مسح كل البيانات','يُحذف كل ما سُجّل من قراءة وتسبيح وإعدادات من هذا الهاتف، ولا يمكن التراجع. احفظ نسخة احتياطية أولًا إن أردت.','امسح',function(){S=fresh();A=null;saveA();save();tab='home';render();onboard();});},
 mk:function(e){F.k=e.dataset.k;reSheet();},
 saveManual:function(){if(F.k==='r'){var each=Math.max(1,Math.round(F.mm*60/F.mp)),p=[];for(var i=0;i<F.mp;i++)p.push(each);index();var before=IX.p[dk()]||0,goal=goalToday();S.reads.push({id:uid(),t:Date.now(),d:dk(),p:p,from:S.cfg.cur,manual:true});var c=S.cfg.cur+F.mp;while(c>604){c-=604;S.cfg.khatmas++;}S.cfg.cur=c;save();closeSheet();index();checkMakeup();checkBadges();render();
   if(before<goal&&before+F.mp>=goal)celebrate('اكتمل قمر اليوم','أتممت وردك: '+pg(before+F.mp)+'.');else toast('سُجّلت '+pg(F.mp));}
  else{var n=parseInt($('#mn').value,10);if(!(n>0)){toast('اكتب عددًا صحيحًا');return;}S.dhikr.push({id:uid(),t:Date.now(),d:dk(),n:Math.min(n,100000),sec:0,manual:true});save();closeSheet();index();checkBadges();render();toast('سُجّلت '+N(n)+' تسبيحة');}},
 pc:function(e){F.c=e.dataset.id;S.delays.push({t:Date.now(),d:dk(),c:F.c});save();reSheet();},
 snooze:function(e){S.snooze=Date.now()+(+e.dataset.m)*60000;save();closeSheet();render();toast('سأذكّرك '+hm(nowMin()+ +e.dataset.m)+' ما دام التطبيق مفتوحًا');},
 cause:function(e){cause=cause===e.dataset.id?null:e.dataset.id;render();},
 remedy:function(e){var id=e.dataset.id,sl=S.cfg.slots,five=['fajr','dhuhr','asr','maghrib','isha'];
  if(id==='one'){closeSheet();startRead('one');}else if(id==='five'){closeSheet();startRead('five');}else if(id==='phone'){closeSheet();startRead();}
  else if(id==='anchor'){sl.forEach(function(s){s.on=five.indexOf(s.id)>=0;s.w=1;});done('وُزّع وردك بالتساوي بعد الصلوات الخمس');}
  else if(id==='front'){var on=sl.filter(function(s){return s.on&&s.id!=='fajr';});sl.forEach(function(s){if(s.id==='fajr'){s.on=true;s.w=Math.max(1,on.length);}else if(s.on)s.w=1;});done('نصف وردك صار بعد الفجر');}
  else if(id==='small'){sl.forEach(function(s){s.on=true;s.w=1;});done('وُزّع وردك على سبعة أوقات قصيرة');}
  else if(id==='best'){var b=bestSlot();if(b)sl.forEach(function(s){if(s.id===b.id){s.on=true;s.w=Math.min(6,(s.w||1)*2);}});done('ضوعف نصيب «'+(b?b.name:'')+'»');}
  else if(id==='prep'){S.flags.prep=dk();done('أحسنت. مصحفك ينتظرك غدًا.');}
  else if(id==='niyya'){closeSheet();openSheet(function(){return shh('نيّتي')+'<label class="f">لماذا أقرأ وردي كل يوم؟<textarea class="inp" id="ny" maxlength="140" placeholder="مثال: أريد أن يكون القرآن ربيع قلبي">'+esc(S.cfg.niyya)+'</textarea></label><div class="foot"><button class="btn ghost" data-a="close">إلغاء</button><button class="btn" data-a="saveNiyya">احفظ</button></div>';});}
  else if(id==='remind'){ics();}
  else if(id==='half'){if(S.cfg.ease){S.cfg.ease=null;S.goals[dk()]=baseGoal();done('عاد هدفك الأصلي: '+pg(S.cfg.pages));}else{S.cfg.ease={until:dAdd(dk(),6),pages:Math.max(1,Math.ceil(S.cfg.pages/2))};S.goals[dk()]=baseGoal();done('هدفك '+pg(S.cfg.ease.pages)+' لسبعة أيام ثم يعود وحده');}}
  function done(m){save();if(sheetFn)closeSheet();render();toast(m);snd('done');}},
 saveNiyya:function(){S.cfg.niyya=$('#ny').value.trim();save();closeSheet();render();toast('حُفظت نيّتك');},
 makeup:function(e){var n=+e.dataset.n,c=carry();S.makeup={days:n,per:Math.ceil(c/n),from:dk()};save();render();toast('طُبّقت الخطة: '+pg(S.makeup.per)+' إضافية '+(n===1?'اليوم':'كل يوم'));snd('done');},
 makeupOff:function(){S.makeup=null;save();render();},
 forgive:function(){confirmSheet('صفحة جديدة','يُصفَّر عدّاد الفائت وتبدأ الحساب من اليوم. سجل قراءتك السابقة يبقى كما هو.','ابدأ من اليوم',function(){S.forgiven=dk();S.makeup=null;save();render();toast('بداية جديدة من اليوم');});},
 slotOn:function(e){var s=S.cfg.slots[+e.dataset.i];s.on=!s.on;save();render();},
 slotW:function(e){var s=S.cfg.slots[+e.dataset.i];s.w=Math.max(1,Math.min(6,(s.w||1)+ +e.dataset.d));save();render();},
 slotsAuto:function(){S.cfg.slots.forEach(function(s){if(s.anchor)s.time=null;});save();render();toast('عادت الأوقات تتبع مواقيت الصلاة');},
 gps:function(){if(!navigator.geolocation){toast('الموقع غير متاح');return;}navigator.geolocation.getCurrentPosition(function(p){S.cfg.city='gps';S.cfg.lat=p.coords.latitude;S.cfg.lng=p.coords.longitude;PTc=null;save();render();toast('حُسبت المواقيت لموقعك');},function(){toast('لم يُسمح بتحديد الموقع');},{timeout:9000});},
 range:function(e){range=+e.dataset.r;render();},
 logAll:function(){logAll=true;render();},
 log:function(e){openLog=openLog===e.dataset.id?null:e.dataset.id;render();},
 del:function(e){var k=e.dataset.k==='r'?'reads':'dhikr',id=e.dataset.id;confirmSheet('حذف الجلسة','تُحذف هذه الجلسة من السجل والتقارير.','احذف',function(){var r=S[k].filter(function(x){return x.id===id;})[0];S[k]=S[k].filter(function(x){return x.id!==id;});
  if(r&&k==='reads'){var c=S.cfg.khatmas*604+S.cfg.cur-r.p.length;if(c<1)c=1;S.cfg.khatmas=Math.floor((c-1)/604);S.cfg.cur=((c-1)%604)+1;}save();render();toast('حُذفت الجلسة');});},
 lap:function(){if(A.paused){A.lapStart+=Date.now()-A.paused;A.paused=0;}var s=lapSec();if(s<3){toast('لحظة، الصفحة لم تبدأ بعد');return;}A.laps.push(s);A.lapStart=Date.now();saveA();snd('page');vib(25);paintRead();
  if(A.mode==='one'&&A.laps.length===1)toast('أتممت صفحتك. لك أن تكتفي، ولك أن تكمل.');
  index();var t=dk();if((IX.p[t]||0)+A.laps.length===goalToday()){vib([50,60,50,60,140]);toast('بهذه الصفحة اكتمل ورد اليوم');}},
 pauseRead:function(){if(A.paused){A.lapStart+=Date.now()-A.paused;A.paused=0;}else A.paused=Date.now();saveA();paintRead();},
 undoLap:function(){if(!A.laps.length)return;var l=A.laps.pop();A.lapStart-=l*1000;saveA();paintRead();},
 finishRead:finishRead,
 minRead:function(){clearInterval(tick);$('#over').classList.remove('on');$('#over').innerHTML='';unwake();render();toast('الجلسة مستمرة والعدّاد يعمل. اضغط «القراءة» للعودة.');},
 finishDhikr:function(){finishDhikr();},dMinus:function(){tapDhikr(-1);},dAdd100:function(){A.n+=100;saveA();paintDhikr();vib(40);}
};
document.addEventListener('click',function(e){var el=e.target.closest('[data-a]');if(el&&!el.disabled){var f=ACT[el.dataset.a];if(f)f(el);return;}
 if(e.target.id==='sheet'&&!sheetLock)closeSheet();});
document.addEventListener('change',function(e){var c=e.target.dataset.c;if(!c)return;
 if(c==='city'){var ct=D.CITIES.filter(function(x){return x[0]===e.target.value;})[0];if(ct){S.cfg.city=ct[0];S.cfg.lat=ct[2];S.cfg.lng=ct[3];PTc=null;save();render();}}
 if(c==='slotT'&&e.target.value){S.cfg.slots[+e.target.dataset.i].time=e.target.value;save();render();}});
var tipT;function showTip(e){var el=e.target.closest&&e.target.closest('[data-tip]'),tp=$('#tip');if(!el){tp.style.display='none';return;}var r=el.getBoundingClientRect();tp.textContent=el.dataset.tip;tp.style.display='block';tp.style.left=Math.max(90,Math.min(innerWidth-90,r.left+r.width/2))+'px';tp.style.top=Math.max(40,(e.clientY||r.top))+'px';clearTimeout(tipT);tipT=setTimeout(function(){tp.style.display='none';},2600);}
document.addEventListener('pointerdown',showTip);document.addEventListener('pointermove',function(e){if(e.pointerType==='mouse')showTip(e);});
document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible'){if(A)wake();minute();}});
window.addEventListener('afuq:flush',function(){save();saveA();});
window.addEventListener('resize',function(){if(tab==='home')drawSky();});

/* ---------- الإقلاع ---------- */
load();index();snap();checkBadges(true);render();
if(!S.cfg.set)onboard();else if(A){if(A.type==='read')showRead();else showDhikr();}
else{var go=(location.search.match(/[?&]go=(\w+)/)||[])[1];if(go==='read')startRead();else if(go==='dhikr')startDhikr();}
setInterval(minute,30000);
if('serviceWorker' in navigator&&location.protocol!=='file:')navigator.serviceWorker.register('sw.js').catch(function(){});
window.__wird={S:function(){return S;},prayer:prayer,plan:plan,render:render};
})();
