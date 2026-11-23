/* جولة · مولّد الرسوم: كل «معروضة» تُرسم SVG من بذرة، فلا صور خارجية ولا بيانات حقيقية. */
(function(){
'use strict';
function rng(seed){var s=(seed*2654435761)>>>0||1;return function(){s^=s<<13;s>>>=0;s^=s>>17;s^=s<<5;s>>>=0;return s/4294967296;};}
function esc(t){return String(t).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
var uid=0;
var PAL={
  dawn:{sky:['#F7C98B','#F3A26B','#7A6F9B'],sun:'#FFF1C9',m:['#8E6F8E','#6B5378','#4A3B5E'],land:'#D9A867',dark:'#3A2A3F'},
  day:{sky:['#BFE3F2','#8CCBE8','#5FA8D3'],sun:'#FFF6D6',m:['#B7A58C','#9A8468','#7C684F'],land:'#E3C48E',dark:'#4A3B2A'},
  dusk:{sky:['#F6B26B','#E2725B','#4B3F72'],sun:'#FFD9A0',m:['#7B4E6A','#5C3A5B','#3D2947'],land:'#C98E5A',dark:'#2E1F33'},
  night:{sky:['#1C2B4A','#15213B','#0B1326'],sun:'#F4EBD0',m:['#24365A','#1B2947','#131E36'],land:'#2D3E5C',dark:'#0A1020'},
  sea:{sky:['#CDEBF3','#9ED6E8','#6DB9D6'],sun:'#FFFBE6',m:['#9DB7C4','#7C9CAD','#5F8395'],land:'#2A7C9B',dark:'#173F55'}
};
function sky(p,w,h,id){return '<defs><linearGradient id="'+id+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+p.sky[2]+'"/><stop offset=".55" stop-color="'+p.sky[1]+'"/><stop offset="1" stop-color="'+p.sky[0]+'"/></linearGradient></defs><rect width="'+w+'" height="'+h+'" fill="url(#'+id+')"/>';}
function mountains(r,p,w,base,amp,idx){var d='M0 '+base,x=0;while(x<w){var step=30+r()*50;x+=step;d+=' L'+x.toFixed(0)+' '+(base-amp*(0.35+r()*0.65)).toFixed(0);x+=step*0.6;d+=' L'+x.toFixed(0)+' '+(base-amp*r()*0.4).toFixed(0);}return '<path d="'+d+' L'+w+' '+(base+200)+' L0 '+(base+200)+'Z" fill="'+p.m[idx]+'"/>';}
function palm(x,y,s,c,c2){var o='<g transform="translate('+x+' '+y+') scale('+s+')"><path d="M0 0 C-4 -30 6 -60 2 -92" stroke="'+c2+'" stroke-width="7" fill="none" stroke-linecap="round"/>';
  for(var i=0;i<7;i++){var a=-160+i*23;o+='<path d="M2 -92 q'+(Math.cos(a*Math.PI/180)*34).toFixed(1)+' '+(Math.sin(a*Math.PI/180)*30-14).toFixed(1)+' '+(Math.cos(a*Math.PI/180)*62).toFixed(1)+' '+(Math.sin(a*Math.PI/180)*30+10).toFixed(1)+'" stroke="'+c+'" stroke-width="6" fill="none" stroke-linecap="round"/>';}
  return o+'<circle cx="0" cy="-88" r="4" fill="#B5651D"/><circle cx="6" cy="-86" r="4" fill="#C97B2A"/></g>';}
function fort(x,y,s,c,c2){var o='<g transform="translate('+x+' '+y+') scale('+s+')">';
  o+='<rect x="-90" y="-60" width="180" height="60" fill="'+c+'"/>';
  for(var i=0;i<9;i++)o+='<rect x="'+(-90+i*20+2)+'" y="-70" width="12" height="10" fill="'+c+'"/>';
  o+='<path d="M-120 0 V-96 h8 v-8 h8 v8 h8 v-8 h8 v8 h8 V0Z" fill="'+c+'"/><path d="M80 0 V-110 h8 v-8 h8 v8 h8 v-8 h8 v8 h8 V0Z" fill="'+c+'"/>';
  o+='<path d="M-14 0 V-28 q14 -18 28 0 V0Z" fill="'+c2+'"/><rect x="-100" y="-70" width="3" height="-0" fill="'+c2+'"/>';
  o+='<path d="M-60 -34 v-10 q5 -6 10 0 v10z M40 -34 v-10 q5 -6 10 0 v10z M96 -70 v-10 q4 -5 8 0 v10z M-104 -60 v-10 q4 -5 8 0 v10z" fill="'+c2+'"/>';
  o+='<path d="M100 -118 v-30" stroke="'+c2+'" stroke-width="2"/><path d="M100 -148 h22 v14 h-22z" fill="#B4131F"/><path d="M106 -148 h16 v5 h-16z" fill="#fff"/><path d="M106 -139 h16 v5 h-16z" fill="#1E8A4C"/>';
  return o+'</g>';}
function kid(x,y,s,c){return '<g transform="translate('+x+' '+y+') scale('+s+')"><ellipse cx="0" cy="26" rx="9" ry="3" fill="rgba(0,0,0,.15)"/><path d="M-8 26 V4 q8 -8 16 0 V26Z" fill="'+c+'"/><circle cx="0" cy="-6" r="7" fill="#E7B98A"/><path d="M-7 -8 q7 -9 14 0 q-7 -3 -14 0z" fill="#3A2A22"/></g>';}
function frameWrap(inner,w,h){return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+w+' '+h+'" preserveAspectRatio="xMidYMid slice">'+inner+'</svg>';}

var K={};
K.fort=function(r,o){var p=PAL[o.pal||'dawn'],id='s'+(++uid);var s=sky(p,400,300,id);
  s+='<circle cx="'+(90+r()*220)+'" cy="'+(60+r()*40)+'" r="26" fill="'+p.sun+'" opacity=".95"/>';
  s+=mountains(r,p,400,190,90,0)+mountains(r,p,400,210,60,1)+'<rect y="205" width="400" height="95" fill="'+p.land+'"/>';
  s+=fort(200,222,1,'#E8D2A6','#6B4A2B')+palm(52,250,.9,'#3F7F4A','#6B4A2B')+palm(352,262,1.1,'#2F6B3B','#6B4A2B')+palm(318,246,.7,'#3F7F4A','#6B4A2B');
  s+='<path d="M0 262 Q200 240 400 268 V300 H0Z" fill="'+p.dark+'" opacity=".25"/>';return frameWrap(s,400,300);};
K.dhow=function(r,o){var p=PAL[o.pal||'sea'],id='s'+(++uid);var s=sky(p,400,300,id);
  s+='<circle cx="300" cy="70" r="30" fill="'+p.sun+'"/>'+mountains(r,p,400,170,40,1);
  s+='<rect y="165" width="400" height="135" fill="'+p.land+'"/>';
  for(var i=0;i<6;i++)s+='<path d="M'+(-20+i*8)+' '+(185+i*20)+' q25 -8 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0" stroke="#fff" stroke-width="2" fill="none" opacity="'+(0.15+i*0.07)+'"/>';
  s+='<g transform="translate(170 205)"><path d="M-70 0 Q-60 26 -30 28 H50 Q78 26 92 -6 L60 2 H-52Z" fill="#6B4226"/><path d="M-52 2 H60" stroke="#D9A64E" stroke-width="2"/><path d="M0 2 V-108" stroke="#4A2E1A" stroke-width="4"/><path d="M0 -106 Q70 -70 78 -8 L2 -2Z" fill="#FBF3E0"/><path d="M0 -106 Q-36 -60 -44 -4 L-2 -2Z" fill="#F1E3C4"/><path d="M0 -108 l16 5 -16 5z" fill="#B4131F"/></g>';
  s+='<path d="M60 60 q8 -8 16 0 q8 -8 16 0 M110 86 q6 -6 12 0 q6 -6 12 0" stroke="'+p.dark+'" stroke-width="2" fill="none"/>';return frameWrap(s,400,300);};
K.oasis=function(r,o){var p=PAL[o.pal||'day'],id='s'+(++uid);var s=sky(p,400,300,id);
  s+=mountains(r,p,400,170,80,1)+mountains(r,p,400,190,50,2)+'<rect y="185" width="400" height="115" fill="#D8BD86"/>';
  s+='<path d="M150 300 Q190 240 170 190 h22 Q230 240 260 300Z" fill="#6DB9D6"/><path d="M168 300 Q200 240 184 196" stroke="#fff" stroke-width="2" fill="none" opacity=".5"/>';
  s+='<g fill="#C9A26B"><rect x="250" y="168" width="60" height="38"/><rect x="300" y="156" width="46" height="50"/><rect x="60" y="172" width="54" height="34"/></g><g fill="#6B4A2B"><rect x="266" y="184" width="10" height="22"/><rect x="318" y="170" width="8" height="10"/><rect x="80" y="186" width="10" height="20"/></g>';
  for(var i=0;i<7;i++)s+=palm(20+i*58+r()*20,214+r()*50,.6+r()*.6,i%2?'#2F6B3B':'#3F7F4A','#6B4A2B');return frameWrap(s,400,300);};
K.dunes=function(r,o){var p=PAL[o.pal||'night'],id='s'+(++uid);var s=sky(p,400,300,id);
  for(var i=0;i<50;i++)s+='<circle cx="'+(r()*400).toFixed(0)+'" cy="'+(r()*160).toFixed(0)+'" r="'+(0.5+r()*1.3).toFixed(1)+'" fill="#fff" opacity="'+(0.3+r()*0.7).toFixed(2)+'"/>';
  s+='<circle cx="310" cy="64" r="24" fill="'+p.sun+'"/><circle cx="300" cy="58" r="22" fill="'+p.sky[1]+'" opacity=".0"/>';
  s+='<path d="M0 210 Q100 150 200 200 T400 180 V300 H0Z" fill="#3B4F78"/><path d="M0 240 Q140 190 260 236 T400 220 V300 H0Z" fill="#2B3B5E"/>';
  s+='<g transform="translate(120 232)"><path d="M-40 14 L0 -30 L40 14Z" fill="#E8D2A6"/><path d="M-6 14 L0 -8 L6 14Z" fill="#6B4A2B"/><path d="M0 -30 V-42" stroke="#E8D2A6" stroke-width="2"/></g><circle cx="190" cy="246" r="5" fill="#F3A26B"/><circle cx="190" cy="246" r="12" fill="#F3A26B" opacity=".25"/>';return frameWrap(s,400,300);};
K.pattern=function(r,o){var cs=o.colors||['#173F55','#D9A64E','#F6E7C8','#2A6A86'];var s='<rect width="400" height="300" fill="'+cs[0]+'"/>';
  for(var y=0;y<4;y++)for(var x=0;x<5;x++){var cx=40+x*80,cy=30+y*80,c=cs[1+((x+y)%3)];
    s+='<g transform="translate('+cx+' '+cy+')"><rect x="-22" y="-22" width="44" height="44" fill="'+c+'"/><rect x="-22" y="-22" width="44" height="44" fill="'+c+'" transform="rotate(45)"/><circle r="9" fill="'+cs[0]+'"/><circle r="4" fill="'+cs[2]+'"/></g>';
    s+='<path d="M'+(cx+40)+' '+(cy+18)+' l12 22 l-12 22 l-12 -22z" fill="'+cs[3]+'" opacity=".6"/>';}
  return frameWrap(s,400,300);};
K.pottery=function(r,o){var s='<rect width="400" height="300" fill="#EFE3CC"/><rect y="210" width="400" height="90" fill="#B98A5A"/><rect y="210" width="400" height="8" fill="#8E643C"/>';
  s+='<g transform="translate(120 210)"><path d="M-34 0 Q-50 -50 -18 -84 Q-24 -100 -12 -104 H12 Q24 -100 18 -84 Q50 -50 34 0Z" fill="#C4703B"/><path d="M-36 -40 H36" stroke="#F6E7C8" stroke-width="4" stroke-dasharray="6 6"/><path d="M-30 -56 H30" stroke="#8E3F1D" stroke-width="3"/></g>';
  s+='<g transform="translate(232 210)"><path d="M-26 0 Q-34 -34 -12 -52 V-76 h24 V-52 Q34 -34 26 0Z" fill="#D9A64E"/><path d="M12 -70 q30 -6 34 -30" stroke="#D9A64E" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M-12 -66 q-30 14 -16 40" stroke="#D9A64E" stroke-width="6" fill="none"/><path d="M-12 -76 l12 -18 l12 18z" fill="#B88632"/><circle cy="-98" r="5" fill="#B88632"/></g>';
  s+='<g transform="translate(318 210)"><ellipse cy="-8" rx="38" ry="10" fill="#7A4B2A"/><path d="M-38 -8 Q-30 14 0 14 Q30 14 38 -8Z" fill="#8E5A34"/>';for(var i=0;i<9;i++)s+='<ellipse cx="'+(-24+i*6)+'" cy="'+(-12-(i%3)*4)+'" rx="5" ry="8" fill="#4A2412"/>';
  return frameWrap(s+'</g>',400,300);};
K.kids=function(r,o){var s='<rect width="400" height="300" fill="#FDF8EC"/>';var cols=['#E2725B','#3D74C2','#2E8B74','#D9A64E','#7559C0','#C7527C'];
  s+='<circle cx="330" cy="62" r="30" fill="#F5C242"/>';for(var i=0;i<12;i++){var a=i*30*Math.PI/180;s+='<path d="M'+(330+Math.cos(a)*38)+' '+(62+Math.sin(a)*38)+' L'+(330+Math.cos(a)*52)+' '+(62+Math.sin(a)*52)+'" stroke="#F5C242" stroke-width="5" stroke-linecap="round"/>';}
  s+='<path d="M0 230 Q200 200 400 232 V300 H0Z" fill="#8CC66B"/><g stroke-linejoin="round"><path d="M90 232 V150 L150 104 L210 150 V232Z" fill="#F2B88A" stroke="#7A4B2A" stroke-width="4"/><path d="M78 154 L150 98 L222 154" fill="none" stroke="#B4131F" stroke-width="9" stroke-linecap="round"/><rect x="136" y="186" width="28" height="46" fill="#7A4B2A"/><rect x="104" y="162" width="24" height="22" fill="#9ED6E8" stroke="#7A4B2A" stroke-width="3"/><rect x="172" y="162" width="24" height="22" fill="#9ED6E8" stroke="#7A4B2A" stroke-width="3"/></g>';
  for(var j=0;j<6;j++){var x=236+j*26,y=236+r()*14,c=cols[j%6];s+='<path d="M'+x+' '+y+' v-'+(26+r()*16).toFixed(0)+'" stroke="#3F7F4A" stroke-width="3"/><circle cx="'+x+'" cy="'+(y-34-r()*10).toFixed(0)+'" r="9" fill="'+c+'"/><circle cx="'+x+'" cy="'+(y-34-r()*10).toFixed(0)+'" r="3.5" fill="#FDF8EC"/>';}
  s+='<path d="M40 70 q16 -18 32 0 q16 -18 32 0" stroke="#3D74C2" stroke-width="4" fill="none" stroke-linecap="round"/>'+kid(40,236,1.3,'#3D74C2')+kid(66,240,1.1,'#C7527C');return frameWrap(s,400,300);};
K.science=function(r,o){var s='<rect width="400" height="300" fill="#12233A"/>';for(var i=0;i<40;i++)s+='<circle cx="'+(r()*400).toFixed(0)+'" cy="'+(r()*300).toFixed(0)+'" r="'+(0.5+r()).toFixed(1)+'" fill="#fff" opacity=".6"/>';
  s+='<circle cx="70" cy="150" r="44" fill="#F5C242"/><circle cx="70" cy="150" r="56" fill="#F5C242" opacity=".2"/>';var pc=['#C9A26B','#E2725B','#3D9BD9','#C4703B','#E3C48E','#D9C27A'],pr=[6,9,10,8,20,16];
  for(var k=0;k<6;k++){var R=80+k*46;s+='<ellipse cx="70" cy="150" rx="'+R+'" ry="'+(R*0.42)+'" fill="none" stroke="#fff" stroke-opacity=".18"/>';var a=(-30+k*17+r()*20)*Math.PI/180;s+='<circle cx="'+(70+Math.cos(a)*R).toFixed(0)+'" cy="'+(150+Math.sin(a)*R*0.42).toFixed(0)+'" r="'+pr[k]+'" fill="'+pc[k]+'"/>';}
  return frameWrap(s,400,300);};
K.plant=function(r,o){var s='<rect width="400" height="300" fill="#F3F7EC"/><rect y="220" width="400" height="80" fill="#8E643C"/>';
  for(var i=0;i<4;i++){var x=70+i*88,h=14+i*34;s+='<ellipse cx="'+x+'" cy="232" rx="10" ry="6" fill="#5B3A1E"/>';if(i)s+='<path d="M'+x+' 226 V'+(226-h)+'" stroke="#3F7F4A" stroke-width="5" stroke-linecap="round"/>';
    for(var j=1;j<=i;j++){var y=226-h*j/(i+0.4);s+='<path d="M'+x+' '+y+' q-22 -10 -30 6 q20 8 30 -6z M'+x+' '+(y-6)+' q22 -10 30 6 q-20 8 -30 -6z" fill="#5FAE5B"/>';}
    if(i===3)s+='<circle cx="'+x+'" cy="'+(220-h)+'" r="13" fill="#E2725B"/><circle cx="'+x+'" cy="'+(220-h)+'" r="5" fill="#F5C242"/>';
    s+='<text x="'+x+'" y="272" text-anchor="middle" font-family="Cairo,sans-serif" font-weight="800" font-size="18" fill="#F6E7C8">'+['١','٢','٣','٤'][i]+'</text>';}
  s+='<circle cx="344" cy="54" r="24" fill="#F5C242"/><path d="M30 60 q10 -22 20 0 q-10 14 -20 0z M300 130 q10 -22 20 0 q-10 14 -20 0z" fill="#6DB9D6"/>';return frameWrap(s,400,300);};
K.calli=function(r,o){var c=o.colors||['#173F55','#D9A64E','#F6E7C8'];var s='<rect width="400" height="300" fill="'+c[0]+'"/>';
  for(var i=0;i<8;i++)s+='<circle cx="200" cy="150" r="'+(30+i*26)+'" fill="none" stroke="'+c[1]+'" stroke-opacity="'+(0.28-i*0.03)+'" stroke-dasharray="'+(4+i*2)+' '+(8+i)+'"/>';
  s+='<rect x="14" y="14" width="372" height="272" fill="none" stroke="'+c[1]+'" stroke-width="2"/><rect x="22" y="22" width="356" height="256" fill="none" stroke="'+c[1]+'" stroke-opacity=".5"/>';
  s+='<text x="200" y="'+(o.sub?160:172)+'" text-anchor="middle" font-family="\'Reem Kufi\',Cairo,sans-serif" font-weight="700" font-size="'+(o.size||64)+'" fill="'+c[2]+'">'+esc(o.text||'')+'</text>';
  if(o.sub)s+='<text x="200" y="208" text-anchor="middle" font-family="Cairo,sans-serif" font-weight="600" font-size="19" fill="'+c[1]+'">'+esc(o.sub)+'</text>';return frameWrap(s,400,300);};
K.doc=function(r,o){var c=o.color||'#2A6A86';var s='<rect width="300" height="400" fill="#FBF8F1"/><rect width="300" height="64" fill="'+c+'"/><circle cx="258" cy="32" r="16" fill="none" stroke="#fff" stroke-width="2"/><path d="M258 22 q8 10 0 20 q-8 -10 0 -20z" fill="#fff"/>';
  s+='<text x="232" y="38" direction="rtl" text-anchor="start" font-family="Cairo,sans-serif" font-weight="800" font-size="16" fill="#fff">'+esc(o.text||'وثيقة')+'</text>';
  for(var i=0;i<9;i++){var w=120+r()*130;s+='<rect x="'+(274-w).toFixed(0)+'" y="'+(92+i*22)+'" width="'+w.toFixed(0)+'" height="7" rx="3.5" fill="#D8D2C4"/>';}
  if(o.chart){for(var j=0;j<5;j++){var h=20+r()*56;s+='<rect x="'+(40+j*34)+'" y="'+(360-h).toFixed(0)+'" width="22" height="'+h.toFixed(0)+'" rx="3" fill="'+c+'" opacity="'+(0.5+j*0.1)+'"/>';}}
  else{s+='<g transform="translate(40 300)" fill="#22313A">';for(var y=0;y<7;y++)for(var x=0;x<7;x++)if(r()>.45||(x<2&&y<2)||(x>4&&y<2)||(x<2&&y>4))s+='<rect x="'+x*9+'" y="'+y*9+'" width="8" height="8"/>';s+='</g>';}
  s+='<g transform="translate(232 332) rotate(-14)"><circle r="30" fill="none" stroke="#B4131F" stroke-width="3" opacity=".7"/><circle r="23" fill="none" stroke="#B4131F" opacity=".7"/><text y="6" text-anchor="middle" font-family="Cairo,sans-serif" font-weight="800" font-size="15" fill="#B4131F" opacity=".8">موثّق</text></g>';
  return frameWrap(s,300,400);};
K.poster=function(r,o){var c=o.colors||['#2E8B74','#F6E7C8','#D9A64E'];var s='<rect width="300" height="400" fill="'+c[0]+'"/>';
  for(var i=0;i<7;i++)s+='<circle cx="'+(r()*300).toFixed(0)+'" cy="'+(r()*400).toFixed(0)+'" r="'+(20+r()*70).toFixed(0)+'" fill="'+c[1]+'" opacity=".07"/>';
  s+='<circle cx="150" cy="150" r="78" fill="'+c[1]+'" opacity=".14"/><circle cx="150" cy="150" r="58" fill="'+c[2]+'"/><g transform="translate(150 150) scale(2.6)" fill="none" stroke="'+c[0]+'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+(ICON[o.icon]||ICON.star)+'</g>';
  s+='<text x="150" y="284" text-anchor="middle" font-family="\'Reem Kufi\',Cairo,sans-serif" font-weight="700" font-size="'+(o.size||34)+'" fill="'+c[1]+'">'+esc(o.text||'')+'</text>';
  if(o.sub)s+='<text x="150" y="318" text-anchor="middle" font-family="Cairo,sans-serif" font-weight="600" font-size="16" fill="'+c[2]+'">'+esc(o.sub)+'</text>';
  s+='<rect x="110" y="346" width="80" height="4" rx="2" fill="'+c[2]+'"/>';return frameWrap(s,300,400);};
K.portrait=function(r,o){var c=o.colors||['#173F55','#D9A64E','#F6E7C8'];var s='<rect width="300" height="380" fill="'+c[0]+'"/>';
  for(var y=0;y<8;y++)for(var x=0;x<7;x++)s+='<path d="M'+(x*50-(y%2)*25)+' '+(y*50)+' l25 25 l-25 25 l-25 -25z" fill="none" stroke="'+c[1]+'" stroke-opacity=".16"/>';
  s+='<circle cx="150" cy="158" r="84" fill="'+c[2]+'"/><circle cx="150" cy="158" r="84" fill="none" stroke="'+c[1]+'" stroke-width="5"/><circle cx="150" cy="158" r="96" fill="none" stroke="'+c[1]+'" stroke-opacity=".5" stroke-dasharray="3 9"/>';
  s+='<text x="150" y="188" text-anchor="middle" font-family="\'Reem Kufi\',Cairo,sans-serif" font-weight="700" font-size="88" fill="'+c[0]+'">'+esc(o.text||'')+'</text>';
  s+='<rect x="60" y="282" width="180" height="46" rx="23" fill="'+c[1]+'"/><text x="150" y="312" text-anchor="middle" font-family="Cairo,sans-serif" font-weight="800" font-size="19" fill="'+c[0]+'">'+esc(o.sub||'')+'</text>';return frameWrap(s,300,380);};
K.yard=function(r,o){var p=PAL[o.pal||'day'],id='s'+(++uid);var s=sky(p,400,300,id)+mountains(r,p,400,150,50,0);
  s+='<rect y="140" width="400" height="60" fill="#E8D2A6"/>';for(var i=0;i<20;i++)s+='<rect x="'+(i*20+3)+'" y="132" width="12" height="8" fill="#E8D2A6"/>';
  for(var a=0;a<6;a++)s+='<path d="M'+(30+a*62)+' 200 v-34 q14 -18 28 0 v34z" fill="#8E643C"/>';
  s+='<rect y="200" width="400" height="100" fill="#D8BD86"/><path d="M200 300 V96" stroke="#EDE7D9" stroke-width="4"/><g transform="translate(202 98)"><rect width="52" height="33" fill="#fff"/><rect width="52" height="11" fill="#fff"/><rect y="22" width="52" height="11" fill="#1E8A4C"/><rect y="0" width="52" height="11" fill="#fff"/><rect y="11" width="52" height="11" fill="#B4131F"/><rect width="15" height="33" fill="#B4131F"/></g>';
  var uc=o.kc||['#2A6A86','#7559C0','#2E8B74'];for(var row=0;row<3;row++)for(var k=0;k<9;k++){if(Math.abs(k-4)<1&&row<3)continue;s+=kid(40+k*40+row*6,222+row*24,.8+row*.18,uc[row%uc.length]);}
  if(o.bunting){for(var b=0;b<16;b++)s+='<path d="M'+(b*26)+' '+(40+Math.sin(b/2.4)*12)+' l10 22 l10 -22z" fill="'+['#B4131F','#fff','#1E8A4C'][b%3]+'"/>';s+='<path d="M0 40 Q200 70 400 40" stroke="#6B4A2B" fill="none"/>';}
  return frameWrap(s,400,300);};
K.shelf=function(r,o){var s='<rect width="400" height="300" fill="#EADBC0"/>';var cs=['#B4131F','#2A6A86','#D9A64E','#2E8B74','#7559C0','#C7527C','#173F55','#E2725B'];
  for(var row=0;row<3;row++){var y=30+row*84;s+='<rect x="20" y="'+(y+62)+'" width="360" height="10" fill="#8E643C"/>';var x=28;while(x<360){var w=10+r()*14,h=40+r()*20;if(r()>.9){x+=18;continue;}s+='<rect x="'+x.toFixed(0)+'" y="'+(y+62-h).toFixed(0)+'" width="'+w.toFixed(0)+'" height="'+h.toFixed(0)+'" rx="2" fill="'+cs[Math.floor(r()*8)]+'"/><rect x="'+(x+2).toFixed(0)+'" y="'+(y+70-h).toFixed(0)+'" width="'+(w-4).toFixed(0)+'" height="3" fill="#F6E7C8" opacity=".7"/>';x+=w+2;}}
  s+='<rect x="12" y="20" width="8" height="262" fill="#6B4A2B"/><rect x="380" y="20" width="8" height="262" fill="#6B4A2B"/>'+kid(110,262,1.5,'#2A6A86')+'<rect x="122" y="252" width="22" height="16" fill="#fff" stroke="#B4131F" stroke-width="2"/>'+kid(300,262,1.5,'#7559C0');return frameWrap(s,400,300);};
K.track=function(r,o){var s='<rect width="400" height="300" fill="#8CCBE8"/><rect y="120" width="400" height="180" fill="#5FAE5B"/>';
  for(var i=0;i<5;i++)s+='<path d="M-20 '+(150+i*34)+' Q200 '+(120+i*34)+' 420 '+(150+i*34)+'" stroke="'+(i%2?'#C4573B':'#D9694C')+'" stroke-width="30" fill="none"/><path d="M-20 '+(166+i*34)+' Q200 '+(136+i*34)+' 420 '+(166+i*34)+'" stroke="#fff" stroke-width="2" fill="none" opacity=".8"/>';
  var cs=['#173F55','#D9A64E','#7559C0','#B4131F'];for(var k=0;k<4;k++)s+=kid(90+k*70+r()*30,132+k*34,1.2+k*.12,cs[k]);
  s+='<path d="M330 110 V250" stroke="#fff" stroke-width="5"/><path d="M330 112 h44 v26 h-44z" fill="#22313A"/><path d="M330 112 h11 v6.5 h-11z M352 112 h11 v6.5 h-11z M341 118.5 h11 v6.5 h-11z M363 118.5 h11 v6.5 h-11z M330 125 h11 v6.5 h-11z M352 125 h11 v6.5 h-11z M341 131.5 h11 v6.5 h-11z M363 131.5 h11 v6.5 h-11z" fill="#fff"/>';return frameWrap(s,400,300);};
K.fair=function(r,o){var s='<rect width="400" height="300" fill="#F4EEDF"/><rect y="216" width="400" height="84" fill="#CDB58B"/>';var cs=['#2E8B74','#D38A1F','#3D74C2','#C7527C'];
  for(var b=0;b<14;b++)s+='<path d="M'+(b*30)+' 22 l12 24 l12 -24z" fill="'+cs[b%4]+'"/>';
  for(var i=0;i<3;i++){var x=40+i*120;s+='<rect x="'+x+'" y="186" width="96" height="10" fill="#8E643C"/><rect x="'+(x+8)+'" y="196" width="6" height="40" fill="#6B4A2B"/><rect x="'+(x+82)+'" y="196" width="6" height="40" fill="#6B4A2B"/><rect x="'+(x+8)+'" y="96" width="80" height="62" rx="4" fill="#fff" stroke="'+cs[i]+'" stroke-width="4"/>';
    if(i===0)s+='<path d="M'+(x+34)+' 186 l8 -34 h12 l8 34z" fill="#C4703B"/><path d="M'+(x+44)+' 152 q4 -16 -4 -22 M'+(x+52)+' 152 q6 -14 12 -20" stroke="#E2725B" stroke-width="4" fill="none" stroke-linecap="round"/>';
    if(i===1)s+='<circle cx="'+(x+48)+'" cy="170" r="16" fill="#3D9BD9"/><path d="M'+(x+38)+' 166 q8 -8 14 0 q6 6 10 -2" stroke="#5FAE5B" stroke-width="5" fill="none"/>';
    if(i===2)s+='<rect x="'+(x+30)+'" y="160" width="36" height="26" rx="4" fill="#9AA7AE"/><circle cx="'+(x+40)+'" cy="170" r="4" fill="#F5C242"/><circle cx="'+(x+56)+'" cy="170" r="4" fill="#F5C242"/><path d="M'+(x+48)+' 160 v-12" stroke="#9AA7AE" stroke-width="3"/><circle cx="'+(x+48)+'" cy="146" r="4" fill="#E2725B"/>';
    for(var l=0;l<3;l++)s+='<rect x="'+(x+18)+'" y="'+(110+l*14)+'" width="'+(40+r()*20).toFixed(0)+'" height="5" rx="2" fill="'+cs[i]+'" opacity=".5"/>';
    s+=kid(x+20+r()*10,250,1.2,cs[(i+1)%4])+kid(x+78,254,1.3,cs[(i+2)%4]);}
  return frameWrap(s,400,300);};
K.bus=function(r,o){var p=PAL.day,id='s'+(++uid);var s=sky(p,400,300,id)+mountains(r,p,400,170,80,0)+mountains(r,p,400,186,50,1)+'<rect y="186" width="400" height="114" fill="#E3C48E"/>'+fort(300,196,.5,'#E8D2A6','#6B4A2B');
  s+='<path d="M0 262 H400" stroke="#6E6257" stroke-width="44"/><path d="M0 262 H400" stroke="#fff" stroke-width="2" stroke-dasharray="22 16"/>';
  s+='<g transform="translate(60 196)"><rect width="170" height="62" rx="10" fill="#F5C242"/><rect y="40" width="170" height="8" fill="#22313A"/>';for(var i=0;i<5;i++)s+='<rect x="'+(12+i*30)+'" y="10" width="22" height="22" rx="3" fill="#CDEBF3"/><circle cx="'+(23+i*30)+'" cy="24" r="6" fill="#E7B98A"/>';
  s+='<circle cx="38" cy="64" r="13" fill="#22313A"/><circle cx="132" cy="64" r="13" fill="#22313A"/><circle cx="38" cy="64" r="5" fill="#bbb"/><circle cx="132" cy="64" r="5" fill="#bbb"/></g>'+palm(30,206,.8,'#3F7F4A','#6B4A2B')+palm(372,214,.9,'#2F6B3B','#6B4A2B');return frameWrap(s,400,300);};
K.trophy=function(r,o){var c=o.colors||['#1B2C3A','#D9A64E','#F6E7C8'];var s='<rect width="300" height="380" fill="'+c[0]+'"/><path d="M150 0 L300 380 H0Z" fill="#fff" opacity=".05"/><path d="M150 0 L230 380 H70Z" fill="#fff" opacity=".05"/>';
  for(var i=0;i<16;i++)s+='<circle cx="'+(r()*300).toFixed(0)+'" cy="'+(r()*240).toFixed(0)+'" r="'+(1+r()*2).toFixed(1)+'" fill="'+c[1]+'" opacity="'+(0.3+r()*0.6).toFixed(2)+'"/>';
  if(o.medal){s+='<path d="M120 40 L150 150 L180 40" stroke="#B4131F" stroke-width="22" fill="none"/><path d="M131 40 L150 110 L169 40" stroke="#fff" stroke-width="6" fill="none"/><circle cx="150" cy="190" r="62" fill="'+c[1]+'"/><circle cx="150" cy="190" r="48" fill="none" stroke="'+c[0]+'" stroke-opacity=".35" stroke-width="3"/><text x="150" y="208" text-anchor="middle" font-family="\'Reem Kufi\',sans-serif" font-size="52" font-weight="700" fill="'+c[0]+'">'+esc(o.text||'١')+'</text>';}
  else{s+='<g fill="'+c[1]+'"><path d="M96 70 H204 V130 Q204 196 150 204 Q96 196 96 130Z"/><path d="M96 86 H66 Q62 140 108 150 V134 Q84 128 84 102 H96Z M204 86 H234 Q238 140 192 150 V134 Q216 128 216 102 H204Z"/><rect x="140" y="200" width="20" height="40"/><rect x="108" y="240" width="84" height="16" rx="4"/><rect x="94" y="256" width="112" height="22" rx="4"/></g><path d="M150 96 l9 19 21 3 -15 15 4 21 -19 -10 -19 10 4 -21 -15 -15 21 -3z" fill="'+c[0]+'" opacity=".5"/>';}
  s+='<text x="150" y="330" text-anchor="middle" font-family="Cairo,sans-serif" font-weight="800" font-size="20" fill="'+c[2]+'">'+esc(o.sub||'')+'</text>';return frameWrap(s,300,380);};
K.banner=function(r,o){var c=o.colors||['#2E8B74','#F6E7C8','#D9A64E'];var s='<rect width="300" height="400" fill="#1B2C3A"/><rect x="34" y="20" width="232" height="8" rx="4" fill="#D9A64E"/><path d="M48 28 H252 V330 L150 376 L48 330Z" fill="'+c[0]+'"/><path d="M60 40 H240 V322 L150 362 L60 322Z" fill="none" stroke="'+c[2]+'" stroke-width="2"/>';
  s+='<circle cx="150" cy="140" r="56" fill="'+c[1]+'"/><g transform="translate(150 140) scale(2.5)" fill="none" stroke="'+c[0]+'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+(ICON[o.icon]||ICON.star)+'</g>';
  s+='<text x="150" y="250" text-anchor="middle" font-family="\'Reem Kufi\',Cairo,sans-serif" font-weight="700" font-size="'+(o.size||30)+'" fill="'+c[1]+'">'+esc(o.text||'')+'</text><text x="150" y="286" text-anchor="middle" font-family="Cairo,sans-serif" font-weight="600" font-size="17" fill="'+c[2]+'">'+esc(o.sub||'')+'</text>';return frameWrap(s,300,400);};

/* أيقونات خطية 24×24 مركزها الصفر */
var ICON={
 star:'<path d="M0 -9l2.6 5.4 5.9.9-4.3 4.1 1 5.9L0 3.5-5.2 6.3l1-5.9-4.3-4.1 5.9-.9z"/>',
 book:'<path d="M-9 -7q5 -2 9 1q4 -3 9 -1v13q-5 -2 -9 1q-4 -3 -9 -1zM0 -6v13"/>',
 leaf:'<path d="M-8 8q-2 -14 14 -16q2 14 -14 16zM-8 8l10 -10"/>',
 heart:'<path d="M0 8q-10 -6 -9 -12q1 -5 5 -5q3 0 4 3q1 -3 4 -3q4 0 5 5q1 6 -9 12z"/>',
 chip:'<rect x="-6" y="-6" width="12" height="12" rx="2"/><path d="M-3 -9v3M3 -9v3M-3 6v3M3 6v3M-9 -3h3M-9 3h3M6 -3h3M6 3h3"/>',
 mic:'<rect x="-3" y="-9" width="6" height="11" rx="3"/><path d="M-6 -1q0 6 6 6q6 0 6 -6M0 5v4M-4 9h8"/>',
 brush:'<path d="M8 -9l-9 9 2 2 9 -9zM-2 1q-5 0 -5 5q0 2 -2 3q8 1 9 -5z"/>',
 flask:'<path d="M-3 -9h6M-2 -9v6l-6 10q-1 2 2 2h12q3 0 2 -2l-6 -10v-6M-5 3h10"/>',
 ball:'<circle r="9"/><path d="M0 -4l4 3-1.5 4.5h-5L-4 -1zM0 -9v5M9 -2l-5 1M5 8l-2.5 -4.5M-5 8l2.5 -4.5M-9 -2l5 1"/>',
 hands:'<path d="M-9 2l4 -4 4 2 3 -3 7 5-4 5-6 -3-4 3z"/>',
 eye:'<path d="M-10 0q10 -12 20 0q-10 12 -20 0z"/><circle r="3"/>',
 flag:'<path d="M-7 9V-9M-7 -8h13l-3 5 3 5H-7"/>',
 sun:'<circle r="4"/><path d="M0 -9v2M0 7v2M-9 0h2M7 0h2M-6.4 -6.4l1.4 1.4M5 5l1.4 1.4M-6.4 6.4l1.4 -1.4M5 -5l1.4 -1.4"/>',
 people:'<circle cx="-4" cy="-4" r="3.2"/><circle cx="5" cy="-2" r="2.4"/><path d="M-10 8q0 -7 6 -7t6 7M3 3q6 0 6 5"/>',
 chart:'<path d="M-9 9h18M-6 9v-6M-1 9v-11M4 9v-8M9 -8l-5 4-5 -3-6 5"/>',
 hex:'<path d="M0 -9l8 4.5v9L0 9l-8 -4.5v-9z"/>',
 cal:'<rect x="-8" y="-7" width="16" height="15" rx="2"/><path d="M-8 -2h16M-4 -9v4M4 -9v4"/>',
 doc:'<path d="M-6 -9h8l5 5v13h-13zM2 -9v5h5M-3 1h7M-3 5h7"/>',
 target:'<circle r="9"/><circle r="5"/><circle r="1.5"/>',
 medal:'<path d="M-4 -9l4 7 4 -7"/><circle cy="3" r="6"/>',
 frame:'<rect x="-9" y="-7" width="18" height="14" rx="1.5"/><path d="M-9 4l5 -5 4 4 3 -3 6 5"/>',
 megaphone:'<path d="M-8 -2v4h3l8 5v-14l-8 5zM6 -3q3 3 0 6"/>',
 shield:'<path d="M0 -9l8 3v5q0 7 -8 10q-8 -3 -8 -10v-5z"/>',
 door:'<path d="M-6 9v-14q6 -8 12 0v14zM3 1v2"/>'
};
function icon(name,size,sw){return '<svg viewBox="-12 -12 24 24" width="'+(size||24)+'" height="'+(size||24)+'" fill="none" stroke="currentColor" stroke-width="'+(sw||1.7)+'" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(ICON[name]||ICON.star)+'</svg>';}

window.ART={make:function(kind,seed,opt){var f=K[kind]||K.pattern;return f(rng(seed||1),opt||{});},icon:icon,ICON:ICON,rng:rng,esc:esc,palm:palm,PAL:PAL};
})();
