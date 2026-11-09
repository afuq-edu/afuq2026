/* =====================================================================
   التحديث الذاتي للمنصات المقفلة: إذا نُشرت نسخة جديدة من المنصة تنتقل إليها وحدها
   دون أن تغلقها المعلمة، بعد حفظ كل شيء ورفعه، وبعيدًا عن لحظة الكتابة.
   يُضاف في index.html بعد محرك المنصة:  <script src="../lock/live.js"></script>
   قبل إعادة التحميل يُطلق الحدث 'afuq:flush' لتحفظ المنصة وترفع ما عندها.
   ===================================================================== */
(function(){
'use strict';
if(!('serviceWorker' in navigator)||location.protocol==='file:'||window.__afuqLive)return;window.__afuqLive=1;
var sw=navigator.serviceWorker,had=!!sw.controller,want=false,going=false;
function busy(){var a=document.activeElement;
  return !!(document.querySelector('dialog[open],.dlg,.tb-sheet.open,[data-pdadd]')||(a&&a!==document.body&&(a.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName))));}
function go(){if(going)return;if(busy()){want=true;return;}want=false;going=true;
  try{window.dispatchEvent(new Event('afuq:flush'));}catch(e){}
  setTimeout(function(){location.reload();},1800);}
sw.addEventListener('controllerchange',function(){if(!had){had=true;return;}go();});
function check(){sw.getRegistration().then(function(r){if(r)r.update();}).catch(function(){});}
document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible')check();else if(want)go();});
document.addEventListener('focusout',function(){if(want)setTimeout(function(){if(want)go();},2500);});
document.addEventListener('click',function(){if(want)setTimeout(function(){if(want)go();},2500);},true);
document.addEventListener('close',function(){if(want)setTimeout(function(){if(want)go();},900);},true);
setInterval(check,180000);
})();
