/* =====================================================================
   درسي · مشاهد الدروس المتحركة (SVG خفيف، الحركة بـ CSS transform فقط)
   كل مشهد: خلفية + أسماء مراحل الدرس بروح القصة + عنصر العنوان (prop)
   ===================================================================== */
(function(){
'use strict';
var D=window.DARSI;
function cloud(x,y,s,c,dur){return '<g class="s-cloud" style="--dur:'+(dur||60)+'s"><g transform="translate('+x+' '+y+') scale('+(s||1)+')" fill="'+(c||'#fff')+'"><ellipse cx="0" cy="0" rx="60" ry="26"/><ellipse cx="-38" cy="8" rx="38" ry="20"/><ellipse cx="40" cy="8" rx="42" ry="20"/><ellipse cx="10" cy="-18" rx="34" ry="24"/></g></g>';}
function sun(x,y,r){return '<g class="s-pulse" style="transform-origin:'+x+'px '+y+'px"><circle cx="'+x+'" cy="'+y+'" r="'+(r*1.9)+'" fill="#FFE9A8" opacity=".45"/><circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="#FFD25A"/></g>';}
function tree(x,y,s,c){s=s||1;return '<g transform="translate('+x+' '+y+') scale('+s+')" class="s-sway" style="transform-origin:'+x+'px '+y+'px"><rect x="-9" y="-70" width="18" height="74" rx="6" fill="#9A6A3F"/><circle cx="0" cy="-100" r="52" fill="'+(c||'#5DBB63')+'"/><circle cx="-36" cy="-78" r="34" fill="'+(c||'#5DBB63')+'"/><circle cx="36" cy="-76" r="36" fill="'+(c||'#4FAE57')+'"/><circle cx="-14" cy="-118" r="16" fill="#fff" opacity=".18"/></g>';}
function palm(x,y,s){s=s||1;return '<g transform="translate('+x+' '+y+') scale('+s+')"><path d="M-6 0 Q-14 -90 4 -170 L14 -168 Q2 -90 8 0Z" fill="#A77A4B"/><g class="s-sway" style="transform-origin:'+x+'px '+(y-170*s)+'px">'+
  [[-80,-150],[80,-150],[-60,-200],[60,-200],[0,-215]].map(function(p){return '<path d="M8 -170 Q'+(p[0]/2)+' '+(p[1]-40)+' '+p[0]+' '+p[1]+' Q'+(p[0]/2.4)+' '+(p[1]-18)+' 8 -168Z" fill="#3E9B52"/>';}).join('')+'<circle cx="2" cy="-162" r="9" fill="#8A5A2B"/><circle cx="16" cy="-160" r="9" fill="#8A5A2B"/></g></g>';}
function flower(x,y,c){return '<g transform="translate('+x+' '+y+')" class="s-sway" style="transform-origin:'+x+'px '+y+'px"><path d="M0 0 V-38" stroke="#4E9F4E" stroke-width="5"/><g transform="translate(0 -44)">'+[0,72,144,216,288].map(function(a){return '<ellipse cx="0" cy="-11" rx="8" ry="12" fill="'+c+'" transform="rotate('+a+')"/>';}).join('')+'<circle r="7" fill="#FFD34D"/></g></g>';}
function bird(x,y,d){return '<g class="s-fly" style="--dur:'+(d||28)+'s;--y:'+y+'px"><path d="M'+x+' 0 q12 -12 24 0 q12 -12 24 0" stroke="#4A5568" stroke-width="4" fill="none" stroke-linecap="round"/></g>';}
function fish(x,y,c,d){return '<g class="s-swim" style="--dur:'+(d||22)+'s"><g transform="translate('+x+' '+y+')"><ellipse rx="30" ry="16" fill="'+c+'"/><path d="M26 0 L48 -14 L48 14Z" fill="'+c+'"/><circle cx="-14" cy="-4" r="4" fill="#fff"/><circle cx="-15" cy="-4" r="2" fill="#223"/></g></g>';}
function star(x,y,r){return '<circle class="s-tw" cx="'+x+'" cy="'+y+'" r="'+r+'" fill="#fff" style="animation-delay:'+(Math.random()*3).toFixed(2)+'s"/>';}
function hills(c1,c2){return '<path d="M0 640 Q300 540 600 620 T1200 600 T1600 610 V900 H0Z" fill="'+c1+'"/><path d="M0 700 Q400 640 800 700 T1600 690 V900 H0Z" fill="'+c2+'"/>';}
function sky(a,b){return '<defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+a+'"/><stop offset="1" stop-color="'+b+'"/></linearGradient></defs><rect width="1600" height="900" fill="url(#sg)"/>';}
function svg(inner){return '<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">'+inner+'</svg>';}

var S={
 airport:{n:'رحلة بالطائرة',e:'✈️',prop:'suitcase',st:{warm:'بوابة الصعود',show:'على متن الطائرة',acts:'محطات الرحلة',chal:'التحدي',end:'وصلنا بسلام'},
  bg:function(){return svg(sky('#9FD8FF','#E8F6FF')+sun(1380,150,60)+cloud(250,140,1.2,'#fff',70)+cloud(900,90,.9,'#fff',55)+cloud(1250,260,.7,'#fff',80)+
   '<g class="s-plane"><g transform="translate(0 210)"><path d="M0 0 L120 -6 Q150 -4 150 6 Q150 14 120 14 L0 10Z" fill="#fff" stroke="#9BB" stroke-width="2"/><path d="M50 2 L20 -38 L40 -38 L85 2Z M50 10 L22 48 L42 48 L85 10Z" fill="#E85D75"/><path d="M4 2 L-10 -26 L6 -26 L20 2Z" fill="#E85D75"/><g fill="#7FC4F5">'+[70,84,98,112].map(function(x){return '<circle cx="'+x+'" cy="3" r="3.5"/>';}).join('')+'</g></g></g>'+
   '<rect x="0" y="560" width="1600" height="340" fill="#D7DEE6"/><rect x="0" y="555" width="1600" height="14" fill="#B7C2CE"/>'+
   '<g fill="#7E8EA0" opacity=".9"><rect x="80" y="420" width="70" height="140" rx="6"/><rect x="60" y="390" width="110" height="40" rx="10"/><rect x="1380" y="440" width="60" height="120"/></g>'+
   '<g fill="#fff" opacity=".55">'+[0,1,2,3,4,5,6,7].map(function(i){return '<rect x="'+(i*200)+'" y="0" width="12" height="560"/>';}).join('')+'</g>'+
   '<path d="M0 900 L700 600 L900 600 L1600 900Z" fill="#C9D2DC"/><path d="M790 600 L810 600 L840 900 L760 900Z" fill="#F2C94C" opacity=".8"/>'+
   '<g transform="translate(1180 470)"><rect x="0" y="0" width="300" height="90" rx="12" fill="#22334A"/><text x="150" y="38" fill="#FFD25A" font-size="26" text-anchor="middle" font-family="sans-serif">GATE  A3</text><text x="150" y="72" fill="#9FE3B5" font-size="20" text-anchor="middle" font-family="sans-serif">BOARDING</text></g>');}},
 garden:{n:'جولة في الحديقة',e:'🌻',prop:'sign',st:{warm:'بوابة الحديقة',show:'نتجول ونتعلم',acts:'أزهار الأنشطة',chal:'التحدي',end:'قطفنا الثمار'},
  bg:function(){return svg(sky('#AEE3FF','#F1FBFF')+sun(1350,140,58)+cloud(300,120,1,'#fff',65)+cloud(1000,180,.8,'#fff',80)+bird(0,200,30)+bird(0,140,38)+hills('#9ED486','#7CC46E')+
   tree(160,720,1.2)+tree(1450,730,1.1,'#62B96A')+tree(1270,700,.8,'#4FAE57')+[220,330,420,1120,1190,1330,600,760,900].map(function(x,i){return flower(x,800+(i%3)*25,['#F47C9B','#FFB34D','#B784F0','#FF7676'][i%4]);}).join('')+
   '<g class="s-flutter"><text x="0" y="0" font-size="44">🦋</text></g>');}},
 sea:{n:'رحلة بحرية',e:'⛵',prop:'sail',st:{warm:'رفع الشراع',show:'في عرض البحر',acts:'جزر الأنشطة',chal:'تحدي الأمواج',end:'رسونا على الشاطئ'},
  bg:function(){return svg(sky('#8FD3FF','#DDF3FF')+sun(1300,160,64)+cloud(260,130,1,'#fff',60)+cloud(900,90,.8,'#fff',75)+bird(0,220,26)+
   '<rect y="520" width="1600" height="380" fill="#3BA7D9"/><g class="s-wave"><path d="M0 540 Q100 515 200 540 T400 540 T600 540 T800 540 T1000 540 T1200 540 T1400 540 T1600 540 T1800 540 V900 H0Z" fill="#4DB8E6"/></g>'+
   '<g class="s-wave s2"><path d="M0 640 Q100 615 200 640 T400 640 T600 640 T800 640 T1000 640 T1200 640 T1400 640 T1600 640 T1800 640 V900 H0Z" fill="#2C93C8"/></g>'+
   '<g class="s-bob"><g transform="translate(1200 520)"><path d="M-90 0 H90 L60 40 H-60Z" fill="#B5683A"/><path d="M0 0 V-150" stroke="#6B4423" stroke-width="7"/><path d="M4 -146 L90 -20 H4Z" fill="#fff"/><path d="M-4 -120 L-70 -20 H-4Z" fill="#FFD25A"/></g></g>'+
   fish(300,760,'#FFB34D',20)+fish(700,820,'#F47C9B',26)+fish(1000,740,'#B784F0',30)+'<path d="M0 860 Q400 820 800 860 T1600 850 V900 H0Z" fill="#F4D9A0"/>');}},
 space:{n:'رحلة إلى الفضاء',e:'🚀',prop:'planet',night:1,st:{warm:'العد التنازلي',show:'بين الكواكب',acts:'محطات الفضاء',chal:'تحدي النجوم',end:'عدنا إلى الأرض'},
  bg:function(){var s='';for(var i=0;i<70;i++)s+=star(Math.random()*1600,Math.random()*900,Math.random()*2.4+.6);
   return svg('<defs><radialGradient id="sp" cx=".3" cy=".3" r="1"><stop offset="0" stop-color="#2C2F7A"/><stop offset="1" stop-color="#0B0E2E"/></radialGradient></defs><rect width="1600" height="900" fill="url(#sp)"/>'+s+
   '<circle cx="1320" cy="220" r="110" fill="#F4A259"/><ellipse cx="1320" cy="220" rx="180" ry="34" fill="none" stroke="#FFD9A8" stroke-width="10" transform="rotate(-18 1320 220)"/>'+
   '<circle cx="240" cy="760" r="210" fill="#4FA3E3"/><path d="M110 700 q60 -40 120 0 t110 30 q-40 70 -140 40Z M260 820 q50 -20 90 10 q-30 40 -90 20Z" fill="#5DBB63"/>'+
   '<g class="s-rocket"><g transform="translate(800 470) rotate(35)"><path d="M0 -90 Q36 -40 30 40 H-30 Q-36 -40 0 -90Z" fill="#F2F2F7"/><circle cy="-20" r="15" fill="#5BC0EB" stroke="#2C5E8A" stroke-width="5"/><path d="M-30 20 L-55 60 L-28 50Z M30 20 L55 60 L28 50Z" fill="#E85D75"/><path class="s-flame" d="M-18 42 Q0 110 18 42Z" fill="#FFB34D"/></g></g>');}},
 farm:{n:'زيارة المزرعة',e:'🐄',prop:'sign',st:{warm:'باب المزرعة',show:'نتعرف ونتعلم',acts:'حقول الأنشطة',chal:'التحدي',end:'حصاد اليوم'},
  bg:function(){return svg(sky('#BDE8FF','#FFF8E1')+sun(1380,150,56)+cloud(300,130,1,'#fff',70)+cloud(950,100,.8,'#fff',60)+bird(0,190,34)+hills('#B7DD84','#93C95E')+
   '<g transform="translate(1100 470)"><path d="M0 120 V20 L110 -50 L220 20 V120Z" fill="#D9534F"/><path d="M-10 25 L110 -60 L230 25" stroke="#fff" stroke-width="12" fill="none"/><rect x="80" y="40" width="60" height="80" fill="#fff"/><path d="M80 40 L140 120 M140 40 L80 120" stroke="#D9534F" stroke-width="6"/></g>'+
   '<g fill="#A0784E">'+[100,190,280,370,460].map(function(x){return '<rect x="'+x+'" y="700" width="12" height="70"/>';}).join('')+'<rect x="90" y="715" width="390" height="10"/><rect x="90" y="745" width="390" height="10"/></g>'+
   '<g class="s-bob" style="--dur:3s"><text x="600" y="800" font-size="90">🐑</text></g><g class="s-bob" style="--dur:4s"><text x="820" y="790" font-size="100">🐄</text></g><text x="1430" y="820" font-size="70">🐓</text>'+tree(130,640,.9));}},
 souq:{n:'جولة في السوق',e:'🛍️',prop:'arch',st:{warm:'باب السوق',show:'بين الدكاكين',acts:'دكاكين الأنشطة',chal:'التحدي',end:'عدنا بالمشتريات'},
  bg:function(){return svg(sky('#FFE2B8','#FFF6E6')+
   '<rect y="0" width="1600" height="900" fill="#F5DDB7" opacity=".4"/>'+[0,1,2,3].map(function(i){var x=60+i*390;return '<g transform="translate('+x+' 180)"><path d="M0 560 V120 Q0 0 150 0 Q300 0 300 120 V560Z" fill="#C98B4E"/><path d="M30 560 V130 Q30 34 150 34 Q270 34 270 130 V560Z" fill="#7A4A2A" opacity=".85"/><g class="s-sway" style="transform-origin:'+(x+150)+'px 230px"><path d="M150 40 V90" stroke="#5B3A1E" stroke-width="3"/><path d="M130 90 H170 L162 130 H138Z" fill="#FFC857"/><circle cx="150" cy="112" r="7" fill="#FFF3B0" class="s-tw"/></g>'+
   '<g font-size="58">'+'<text x="70" y="520">'+['🧺','🏺','🍯','🧵'][i]+'</text><text x="160" y="520">'+['🍊','🫖','🌶️','👘'][i]+'</text></g></g>';}).join('')+'<rect y="740" width="1600" height="160" fill="#D9B98C"/>');}},
 oasis:{n:'في الواحة',e:'🌴',prop:'scroll',st:{warm:'عند الفلج',show:'بين النخيل',acts:'سواقي الأنشطة',chal:'التحدي',end:'جنينا الرطب'},
  bg:function(){return svg(sky('#9ED9FF','#FFF1D6')+sun(1360,160,62)+cloud(380,140,.9,'#fff',70)+bird(0,210,30)+
   '<path d="M0 560 Q400 500 800 560 T1600 540 V900 H0Z" fill="#E8C98E"/>'+
   '<g transform="translate(980 330)"><rect x="0" y="80" width="360" height="200" fill="#D8B27A"/><rect x="-30" y="20" width="110" height="260" fill="#CFA56C"/><rect x="290" y="30" width="100" height="250" fill="#CFA56C"/>'+[0,1,2,3,4].map(function(i){return '<rect x="'+(-30+i*22)+'" y="4" width="14" height="18" fill="#CFA56C"/><rect x="'+(290+i*20)+'" y="14" width="13" height="18" fill="#CFA56C"/>';}).join('')+'<path d="M150 280 V200 Q180 170 210 200 V280Z" fill="#7A5230"/></g>'+
   palm(170,700,1.1)+palm(420,660,.85)+palm(1480,720,1)+
   '<path d="M0 760 H1600 V800 H0Z" fill="#B8956A"/><g class="s-water"><path d="M0 768 H1600 V792 H0Z" fill="#5EC2E8"/><path d="M0 776 q40 -6 80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0" stroke="#fff" stroke-width="3" fill="none" opacity=".7"/></g>');}},
 forest:{n:'مغامرة في الغابة',e:'🌳',prop:'sign',st:{warm:'مدخل الغابة',show:'على الطريق',acts:'أشجار الأنشطة',chal:'تحدي المغامرة',end:'خرجنا من الغابة'},
  bg:function(){return svg(sky('#C8F0D8','#F2FFF4')+sun(1300,130,52)+cloud(500,120,.9,'#fff',70)+hills('#7CC47A','#5BAE5E')+
   tree(100,700,1.4,'#3E9E4F')+tree(300,640,1,'#57B65F')+tree(1500,700,1.3,'#3E9E4F')+tree(1300,650,1,'#62B96A')+tree(1150,720,.8,'#4FAE57')+
   '<path d="M650 900 Q760 760 780 640 L840 640 Q860 760 1000 900Z" fill="#E3C38F"/><g class="s-bob" style="--dur:3.4s"><text x="380" y="840" font-size="80">🦊</text></g><text x="1180" y="860" font-size="70">🐇</text><g class="s-flutter"><text x="0" y="0" font-size="40">🦋</text></g>'+bird(0,180,32));}},
 train:{n:'رحلة القطار',e:'🚂',prop:'ticket',st:{warm:'رصيف المحطة',show:'في العربة',acts:'محطات الأنشطة',chal:'التحدي',end:'المحطة الأخيرة'},
  bg:function(){return svg(sky('#A9DCFF','#FFF4E0')+sun(1380,150,56)+cloud(300,120,1,'#fff',60)+cloud(1000,180,.7,'#fff',80)+
   '<path d="M0 600 Q260 470 520 580 T1040 560 T1600 580 V900 H0Z" fill="#A8D88A"/><path d="M0 680 Q500 620 1000 680 T1600 670 V900 H0Z" fill="#8CC56C"/>'+
   '<rect y="770" width="1600" height="14" fill="#7A5A3A"/><g fill="#8E6B48">'+Array.apply(null,{length:33}).map(function(_,i){return '<rect x="'+(i*50)+'" y="760" width="22" height="36"/>';}).join('')+'</g><rect y="756" width="1600" height="6" fill="#888"/><rect y="790" width="1600" height="6" fill="#888"/>'+
   '<g class="s-train"><g transform="translate(0 640)">'+['#E85D75','#3D9BE9','#5BBF6A'].map(function(c,i){return '<g transform="translate('+(i*190)+' 0)"><rect x="0" y="20" width="170" height="90" rx="12" fill="'+c+'"/><rect x="20" y="36" width="50" height="36" rx="6" fill="#E6F6FF"/><rect x="96" y="36" width="50" height="36" rx="6" fill="#E6F6FF"/><circle cx="36" cy="116" r="16" fill="#333"/><circle cx="134" cy="116" r="16" fill="#333"/></g>';}).join('')+
   '<g transform="translate(570 0)"><rect x="0" y="0" width="200" height="110" rx="14" fill="#F2B134"/><rect x="120" y="-40" width="30" height="50" fill="#555"/><rect x="20" y="20" width="70" height="50" rx="8" fill="#E6F6FF"/><circle cx="50" cy="116" r="20" fill="#333"/><circle cx="160" cy="116" r="20" fill="#333"/><g class="s-smoke"><circle cx="135" cy="-60" r="18" fill="#fff" opacity=".8"/><circle cx="160" cy="-90" r="24" fill="#fff" opacity=".6"/></g></g></g></g>');}},
 lab:{n:'في المختبر',e:'🔬',prop:'board',st:{warm:'نلبس معطف العالِم',show:'نكتشف',acts:'تجارب الأنشطة',chal:'تحدي العلماء',end:'اكتشفنا!'},
  bg:function(){return svg(sky('#DDF3F7','#F7FCFD')+'<rect y="600" width="1600" height="300" fill="#CFE3E8"/><rect y="590" width="1600" height="22" fill="#9FC3CC"/>'+
   '<g transform="translate(140 420)"><path d="M40 0 V60 L0 170 H120 L80 60 V0Z" fill="#fff" stroke="#7FB3C0" stroke-width="5"/><path d="M14 130 H106 L120 170 H0Z" fill="#7BDCB5"/><g class="s-bubble"><circle cx="50" cy="110" r="8" fill="#7BDCB5"/><circle cx="70" cy="90" r="6" fill="#7BDCB5"/></g></g>'+
   '<g transform="translate(1320 400)"><rect x="0" y="0" width="40" height="190" rx="20" fill="#fff" stroke="#7FB3C0" stroke-width="5"/><rect x="5" y="90" width="30" height="95" rx="15" fill="#F47C9B"/><rect x="70" y="40" width="40" height="150" rx="20" fill="#fff" stroke="#7FB3C0" stroke-width="5"/><rect x="75" y="110" width="30" height="75" rx="15" fill="#FFB34D"/></g>'+
   '<text x="1150" y="560" font-size="90">🔬</text><text x="330" y="570" font-size="80">🧪</text><g class="s-bob"><text x="700" y="200" font-size="70">⚛️</text></g><g class="s-bob" style="--dur:5s"><text x="1000" y="160" font-size="60">💡</text></g>');}},
 city:{n:'جولة في المدينة',e:'🏙️',prop:'sign',st:{warm:'محطة الحافلة',show:'في الطريق',acts:'شوارع الأنشطة',chal:'التحدي',end:'وصلنا إلى البيت'},
  bg:function(){return svg(sky('#AFDFFF','#EEF8FF')+sun(1360,140,54)+cloud(400,120,1,'#fff',70)+cloud(1050,90,.8,'#fff',60)+
   [[60,300,'#8FB8DE'],[230,380,'#F4A9A8'],[380,260,'#A8D5BA'],[560,340,'#F6D186'],[1000,320,'#B5A8F0'],[1170,250,'#8FB8DE'],[1350,370,'#F4A9A8']].map(function(b){return '<rect x="'+b[0]+'" y="'+b[1]+'" width="150" height="'+(700-b[1])+'" rx="8" fill="'+b[2]+'"/>'+Array.apply(null,{length:Math.floor((680-b[1])/60)}).map(function(_,r){return '<rect x="'+(b[0]+25)+'" y="'+(b[1]+25+r*60)+'" width="36" height="30" rx="4" fill="#fff" opacity=".7"/><rect x="'+(b[0]+90)+'" y="'+(b[1]+25+r*60)+'" width="36" height="30" rx="4" fill="#fff" opacity=".7"/>';}).join('');}).join('')+
   '<rect y="700" width="1600" height="200" fill="#6E7B8A"/><g fill="#fff">'+Array.apply(null,{length:16}).map(function(_,i){return '<rect x="'+(i*110)+'" y="790" width="60" height="10" rx="5"/>';}).join('')+'</g><g class="s-car"><text x="0" y="770" font-size="80">🚌</text></g>'+tree(820,700,.8));}},
 school:{n:'في فصلنا',e:'🏫',prop:'board',st:{warm:'نستعد',show:'نتعلم معًا',acts:'أنشطتنا',chal:'التحدي',end:'أنهينا الدرس'},
  bg:function(){return svg('<rect width="1600" height="900" fill="#FFF3DD"/><rect y="640" width="1600" height="260" fill="#E7C998"/><rect y="630" width="1600" height="14" fill="#C9A26E"/>'+
   '<g transform="translate(1250 120)"><rect width="260" height="200" rx="10" fill="#9ED8FF" stroke="#C9A26E" stroke-width="12"/><path d="M130 0 V200 M0 100 H260" stroke="#C9A26E" stroke-width="8"/>'+cloud(70,60,.4,'#fff',40)+'</g>'+
   '<g transform="translate(90 140)"><rect width="200" height="260" rx="12" fill="#FFD9E2"/><text x="40" y="120" font-size="90">🌈</text><text x="40" y="230" font-size="60">✏️</text></g>'+
   '<g class="s-bob"><text x="1300" y="560" font-size="90">🌍</text></g><text x="160" y="610" font-size="80">📚</text><g class="s-sway" style="transform-origin:800px 0"><path d="M800 0 V70" stroke="#999" stroke-width="3"/><circle cx="800" cy="84" r="16" fill="#FFE07A"/></g>');}}
};
var IDS=Object.keys(S);
function get(id){return S[id]||S.school;}
D.SCENES=S;D.sceneIds=IDS;D.scene=get;
})();
