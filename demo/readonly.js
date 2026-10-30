/* نسخة العرض: تمنع أي إدخال أو تعديل أو حذف أو تصدير، وتُبقي التصفح والثيمات والصور.
   تُحمَّل قبل ../kit/platform.js لأن مستمعي window في طور الالتقاط يسبقون مستمعي المحرك. */
(function(){
'use strict';
var BLOCK_DO=['edit-toggle','export','import','reset','undo','hero-edit','sec-add','add','sec-edit','sec-del','sec-up','sec-down','edit','del','up','down','logout'];
var BLOCK_SEL=BLOCK_DO.map(function(a){return '[data-do="'+a+'"]';}).concat(['[data-tg]','[data-tdone]','[data-rowdel]','[data-rowadd]','[data-ga]','[data-gtoday]','[data-gadd]','[data-gdel]','[data-gnew]','[data-pl]','[data-hwt]','[data-plform]','[contenteditable]','a[data-file]']).join(',');
var last=0;
function note(){var n=Date.now();if(n-last<1200)return;last=n;
  if(window.TB&&TB.toast)TB.toast('هذه نسخة للعرض فقط · للحصول على منصتك تواصل مع منصة أفق 76506037',{icon:'bell'});}
function stop(e){e.preventDefault();e.stopImmediatePropagation();note();}
window.addEventListener('click',function(e){if(e.target.closest&&e.target.closest(BLOCK_SEL))stop(e);},true);
window.addEventListener('submit',function(e){stop(e);},true);
window.addEventListener('drop',function(e){stop(e);},true);
window.addEventListener('focusin',function(e){var t=e.target;if(t.closest&&t.closest('[data-plform],[contenteditable]')){t.blur();note();}},true);
window.addEventListener('keydown',function(e){var t=e.target;if(t.closest&&t.closest('[data-plform],[contenteditable]'))stop(e);},true);
})();
