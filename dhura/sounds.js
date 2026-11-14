/* =====================================================================
   «أسماء» · أصوات الثيمات
   لكل ثيم ثلاثة أصوات طبيعية غير موسيقية (بلا نغمات ولا ألحان)، تُركَّب لحظيًا بـ Web Audio:
   tap عند النقر، ok عند الإنجاز والحفظ، nav عند التنقل بين الأقسام.
   - qamar  ليل القمر: نقرة ليلية خافتة، ونفحة هواء، ونسيم ليلي عند التنقل.
   - duha   ضُحى البحر: نقرة حصى، ورشة ماء، وموجة تتكسر عند التنقل.
   - muzn   مُزن: قطرة ماء، وزخّة مطر عند التنقل.
   - madar  المدار: نقرة آلية دقيقة، ومسحة هواء عند التنقل.
   - qalaa  قلعة الصباح: طرقة خشب، ودفّ عند التنقل.
   - english أكسفورد: مفتاح آلة كاتبة، وختم، وقلب صفحة عند التنقل.
   - garden حديقة الكلمات: حفيف ورقة، وطقطقة غصن، وحفيف أوراق عند التنقل.
   - aurora الشفق: نفخة هواء ناعمة، وريح عميقة عند التنقل.
   الصوت هادئ، ويُطفأ من الإعدادات، ولا يتكرر للنقرة الواحدة.
   ===================================================================== */
(function(){
'use strict';
var DA=window.DA;if(!DA)return;
var AC=null,OUT=null,last=0,lastNav=0,NB=null;
function ctx(){if(!AC){var C=window.AudioContext||window.webkitAudioContext;if(!C)return null;AC=new C();var comp=AC.createDynamicsCompressor();comp.threshold.value=-18;comp.ratio.value=4;OUT=AC.createGain();OUT.gain.value=.55;OUT.connect(comp);comp.connect(AC.destination);}
  if(AC.state==='suspended')AC.resume();return AC;}
function now(){return AC.currentTime+.005;}
function env(g,t,a,peak,dec){g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+a);g.gain.exponentialRampToValueAtTime(0.0001,t+a+dec);}
/* نغمة جيبية مع توافقياتها */
function tone(f,o){o=o||{};var t=now()+(o.at||0),g=AC.createGain(),dest=OUT;env(g,t,o.a||.004,o.v||.2,o.d||.4);
  if(o.lp){var lp=AC.createBiquadFilter();lp.type='lowpass';lp.frequency.value=o.lp;g.connect(lp);lp.connect(OUT);}else g.connect(dest);
  (o.parts||[[1,1]]).forEach(function(pp){var os=AC.createOscillator();os.type=o.type||'sine';os.frequency.setValueAtTime(f*pp[0],t);if(o.to)os.frequency.exponentialRampToValueAtTime(o.to*pp[0],t+(o.tt||.08));if(o.det)os.detune.value=o.det*(pp[2]||1);
   var pg=AC.createGain();pg.gain.value=pp[1];os.connect(pg);pg.connect(g);os.start(t);os.stop(t+(o.a||.004)+(o.d||.4)+.05);});}
/* ضجيج مُرشَّح (ريح، موج، ورق، مطر) */
function noiseBuf(){if(NB)return NB;var n=AC.sampleRate*2;NB=AC.createBuffer(1,n,AC.sampleRate);var d=NB.getChannelData(0);for(var i=0;i<n;i++)d[i]=Math.random()*2-1;return NB;}
function noise(o){var t=now()+(o.at||0),s=AC.createBufferSource();s.buffer=noiseBuf();var f=AC.createBiquadFilter();f.type=o.ft||'bandpass';f.Q.value=o.q||1;
  f.frequency.setValueAtTime(o.f0||1000,t);if(o.f1)f.frequency.exponentialRampToValueAtTime(o.f1,t+(o.fd||o.d||.3)*(o.f2?.5:1));if(o.f2)f.frequency.exponentialRampToValueAtTime(o.f2,t+(o.fd||o.d||.3));
  var g=AC.createGain();env(g,t,o.a||.005,o.v||.15,o.d||.3);
  if(o.flut){var lfo=AC.createOscillator(),lg=AC.createGain();lfo.frequency.value=o.flut;lg.gain.value=(o.v||.15)*.6;lfo.connect(lg);lg.connect(g.gain);lfo.start(t);lfo.stop(t+(o.a||.005)+(o.d||.3)+.05);}
  s.connect(f);f.connect(g);g.connect(OUT);s.start(t,Math.random()*1.5);s.stop(t+(o.a||.005)+(o.d||.3)+.05);}
function pk(a){return a[Math.floor(Math.random()*a.length)];}
/* أصوات طبيعية غير موسيقية: نقرات وخشب وماء وريح وورق، بلا نغمات ولا ألحان */
function thump(f,o){o=o||{};tone(f,{to:f*.45,tt:o.d||.06,v:o.v||.12,d:o.d||.06,a:.002,at:o.at||0,lp:o.lp||900});}
function tick(f,o){o=o||{};noise({ft:'bandpass',f0:f,q:o.q||2.5,d:o.d||.018,a:.001,v:o.v||.1,at:o.at||0});}
var P={
 qamar:{tap:function(){tick(5200,{v:.06,d:.014});thump(220,{v:.04,d:.03});},
  ok:function(){noise({ft:'bandpass',f0:2600,f1:6000,d:.28,a:.06,q:1.2,v:.05});tick(6500,{v:.04,at:.18});},
  nav:function(){noise({ft:'bandpass',f0:420,f1:1300,f2:500,d:.6,a:.18,q:.7,v:.05});}},
 duha:{tap:function(){tick(1900,{v:.09,q:1.8,d:.022});},
  ok:function(){noise({ft:'highpass',f0:1400,d:.22,a:.004,v:.06,flut:30});noise({ft:'lowpass',f0:700,d:.12,a:.003,v:.07,at:.03});},
  nav:function(){noise({ft:'lowpass',f0:380,f1:1900,f2:420,d:.85,a:.28,q:.5,v:.09});noise({ft:'highpass',f0:3500,d:.5,a:.35,v:.02,at:.25});}},
 muzn:{tap:function(){tone(pk([480,540,600]),{to:1300,tt:.035,v:.08,d:.05});},
  ok:function(){tone(520,{to:1300,tt:.035,v:.07,d:.05});tone(600,{to:1500,tt:.035,v:.06,d:.05,at:.1});noise({ft:'bandpass',f0:3000,d:.2,a:.02,q:.8,v:.03,at:.05});},
  nav:function(){noise({ft:'bandpass',f0:2800,d:.55,a:.08,q:.6,v:.06,flut:23});}},
 madar:{tap:function(){tick(3800,{v:.07,d:.01});tick(2600,{v:.05,d:.01,at:.012});},
  ok:function(){tick(3000,{v:.08,d:.012});thump(160,{v:.06,d:.04,at:.01});noise({ft:'highpass',f0:2500,d:.15,a:.03,v:.03,at:.03});},
  nav:function(){noise({ft:'bandpass',f0:600,f1:3200,d:.32,a:.08,q:1.4,v:.05});}},
 qalaa:{tap:function(){thump(190,{v:.13,d:.045});tick(900,{v:.05,q:1.2,d:.02});},
  ok:function(){thump(170,{v:.12,d:.05});thump(210,{v:.11,d:.05,at:.12});},
  nav:function(){thump(120,{v:.2,d:.22,lp:500});noise({ft:'bandpass',f0:1800,d:.07,q:.9,v:.05});}},
 english:{tap:function(){noise({ft:'highpass',f0:2600,d:.025,a:.001,v:.11});thump(140,{v:.05,d:.03});},
  ok:function(){thump(110,{v:.12,d:.07,lp:600});noise({ft:'bandpass',f0:1500,d:.06,a:.002,q:.8,v:.06});},
  nav:function(){noise({ft:'bandpass',f0:4200,f1:1100,d:.32,a:.07,q:.8,v:.08});noise({ft:'highpass',f0:5000,d:.05,v:.03,at:.27});}},
 garden:{tap:function(){noise({ft:'bandpass',f0:3200,d:.06,a:.004,q:1.5,v:.06,flut:60});},
  ok:function(){tick(2200,{v:.08,q:3,d:.012});tick(1700,{v:.06,q:3,d:.012,at:.03});noise({ft:'bandpass',f0:2600,d:.2,a:.03,q:1,v:.04,flut:25,at:.04});},
  nav:function(){noise({ft:'bandpass',f0:2200,d:.45,a:.06,q:.7,v:.05,flut:15});}},
 aurora:{tap:function(){noise({ft:'lowpass',f0:700,d:.07,a:.006,v:.08});},
  ok:function(){noise({ft:'bandpass',f0:1800,f1:4500,d:.35,a:.1,q:.9,v:.045});},
  nav:function(){noise({ft:'lowpass',f0:220,f1:650,f2:260,d:.8,a:.25,q:.6,v:.08});}}
};
function pack(){var k=document.documentElement.getAttribute('data-skin');var MP=window.SND_MAP||{sana:'madar',sanaN:'aurora'};if(MP[k])k=MP[k];return P[k]||P.muzn;}
DA.snd=function(kind){if(DA.lsg('mute',false))return;var t=Date.now();if(kind!=='ok'&&t-last<140)return;try{if(!ctx())return;last=t;var p=pack();(p[kind==='ok'?'ok':kind==='nav'?'nav':'tap'])();}catch(e){}};
/* كل نقرة على زر أو رابط لها صوت الثيم، دون تكرار مع أصوات الأقسام */
document.addEventListener('click',function(e){var el=e.target.closest('button,a,[role=button],.chip,.sc,summary,label.row');if(!el)return;
  var h=el.getAttribute&&el.getAttribute('href');if(h&&h.charAt(0)==='#'&&h.length>1)return;if(Date.now()-lastNav<200)return;DA.snd('');});
addEventListener('hashchange',function(){lastNav=Date.now();last=0;DA.snd('nav');});
/* عند اختيار ثيم يُسمع صوته */
var _set=DA.setSkin;if(_set)DA.setSkin=function(k){_set(k);last=Date.now();setTimeout(function(){DA.snd('ok');},40);};
DA.Sounds={packs:P,play:function(k,kind){if(!ctx()||!P[k])return;P[k][kind||'tap']();}};
})();
