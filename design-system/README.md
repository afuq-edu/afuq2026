# طبشورة · نظام تصميم منصات المعلمين والمعلمات (v1.0)

مستوحى من تطبيق «وِرد» (التصميم والخلفيات والثيمات فقط): زجاج شفاف فوق مشهد SVG حي، ثيمات بـ18 لونًا لكل من الفاتح والداكن، وخيارات مظهر يختارها المستخدم.

## الملفات
| الملف | الدور |
|---|---|
| `tabshoura.css` | الرموز (tokens) + الأساسيات + كل المكونات |
| `tabshoura.js` | الثيمات (SKINS) + المشهد + الثيمات الحية + الاحتفال + الإشعار + الورقة السفلية + الاختبار + استوديو المظهر. كله عبر `window.TB` |
| `index.html` | صفحة العرض (الثيمات، المكونات، القوالب، الاستخدام) |
| `templates/*.html` | قوالب أمثلة: landing, profile, lessons, quiz, dashboard |

## صفحة جديدة
```html
<!doctype html>
<html lang="ar" dir="rtl" data-skin-default="sabboura">
<head>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Reem+Kufi:wght@500;600;700&family=Tajawal:wght@400;500;700&family=Amiri:wght@400;700&family=Aref+Ruqaa:wght@400;700&display=swap">
<link rel="stylesheet" href="PATH/tabshoura.css">
</head>
<body>
<div class="app"><main class="wrap stack"> ... </main></div>
<script src="PATH/tabshoura.js"></script>
</body></html>
```
`tabshoura.js` يضيف المشهد (`#scene`) ولوحتي الرسم (`#amb`, `#fx`) والإشعار تلقائيًا. لتعطيل المشهد: `<body data-no-scene>`.

## كيف تُطبَّق الثيمات (سمات على `<html>`)
- `data-skin` = معرّف الثيم: هادئة `sabboura`(افتراضي) `royal` `sky` `oasis` `ocean` `desert` `ink` `jouri` `sunset` `lilac`؛ حية `rain` `snow` `autumn` `spring` `galaxy` `chalk` `planes` `bubbles` (كل نقرة على الخلفية تعطي تفاعلًا مختلفًا، والسحب له أثر في بعضها، و`TB.celebrate()` يعزّز الثيم الحي).
- `data-shine` = اللمعان: `edge` (ضوء يدور على الحواف) | `sweep` (شعاع يمرّ على البطاقات) | `follow` (الحواف تضيء قرب المؤشر) | `off`. الافتراضي `auto` يختار حسب الثيم (الجدول `SHINE` في JS).
- `data-theme` = `light` | `dark` (يحددها JS من تفضيل المستخدم: auto/light/dark).
- `data-scene` full|soft|none · `data-cards` glass|solid · `data-corners` soft|round|sharp · `data-ffam` plex|tajawal|amiri|kufi · `data-font` m|l|xl · `data-motion` on|off.
- `data-skin-default` على `<html>` يحدد ثيم الصفحة الافتراضي (مثلًا `jouri` لمنصة معلمة).
- التفضيلات تُحفظ في localStorage بالمفتاح `tabshoura:prefs`.
- لا تكتب ألوانًا ثابتة؛ استخدم المتغيرات.

## الرموز (CSS variables)
18 لونًا للثيم بترتيب `TB.SKK`:
`--sky1 --sky2(الخلفية) --sky3 --sun --sil --sil2 --water(الأرض) --pillar --ink --ink2 --muted --accent --accent2 --accent-soft --track --gold --c1 --c2`
مشتقة: `--glass --glass2 --rim --line --gold-soft --on-accent --on-gold --accent-ink --good --warn --late --shadow`
شكل وخط: `--r --r-sm --r-xs --f-body --f-disp --f-hand --fs-* --ease --spring`

## المكونات (أصناف CSS)
تخطيط: `wrap` (`narrow`) `stack` `row` `between` `grid` (`--min`) `split` (`rev`) `dash` `kpis` `view` (ظهور متتابع)
أسطح: `card` (`pad-lg` `gold-rim`) `tile` `glass`
نص: `eyebrow` `h` `h-xl` `h-hero` `sub` `lead` `note` `mark` `scribble` `disp` `hand`
أزرار: `btn` (`soft` `gold` `ghost` `danger` `sm` `lg` `block`) `round-btn` `icon-x`
شارات: `chip` (`good` `warn` `late` `gold` `c2`) `newb` `chips`+`cb` `seg`
نماذج: `field` `lbl` `input` (`pill`) `select` `textarea` `search` `switch[role=switch]` `drop`
تقدم: `track>i[--p]` (`gold`) `ring[--p]` `week>.wd` `cal>i[data-l]`
تعليم: `lesson` (`cover` `body` `meta`) `unit` (`done` `now` `lock`) `period` (`now` `past`) `flip[data-flip]` `opts>.opt` `qdots` `feedback` `stamp` (`accent` `in`)
بيانات: `tbl-wrap>.tbl` `grade` (`a` `b` `c` `d`) `plot`+`bars>.bar[--v]`+`xl`
تنقل: `topbar` `brand` `links` `nav` (`mobile-only`, `--n`) `side`
أخرى: `avatar` (`c2` `gold`) `avatars` `set` (details) `sheet` `toast` `empty` `todo` `feat` `quote-card` `stars-row`

## السلوك التصريحي
- `data-act="studio"` استوديو المظهر · `data-act="mode"` فاتح/داكن · `data-act="celebrate"` احتفال
- تبويبات: `<div class="seg" data-tabs="g"><button data-tab="a">` + `<section data-pane="g:a">`
- تصفية: `<div class="chips" data-chips="#list"><button class="cb" data-f="x">` + عناصر `[data-cat="x"]`
- `data-copy="#id"` نسخ · `<i data-ic="book"></i>` أيقونة (انظر `TB.I`)

## الكتابة المتحركة
```html
<h1 data-type="منصة أ. نورة القحطاني">منصة أ. نورة القحطاني</h1>
<p data-type="جيلٌ مُجيدٌ|واعٍ|ومُنتمٍ" data-type-caret="chalk">جيلٌ مُجيدٌ</p>
```
- تُكتب العناصر حرفًا حرفًا عند الفتح بترتيبها في الصفحة، واحدًا بعد الآخر.
- `|` بين الجمل = تكتب ثم تمسح وتنتقل للتالية بلا توقف.
- `data-type-speed` (مللي ثانية للحرف، الافتراضي 65) · `data-type-delay` · `data-type-on="view"` (تبدأ عند ظهورها) · `data-type-caret="chalk|block"`.
- يحافظ على مساحة النص الكامل (بلا قفز في التخطيط)، ويقرؤه قارئ الشاشة كاملًا، ويُعرض فورًا إذا أُوقفت الحركة.
- `TB.type(el)` لإعادة الكتابة برمجيًا.

## JavaScript
```js
TB.openStudio()                 // ورقة الثيمات والمظهر
TB.studio(el)                   // الاستوديو داخل عنصر
TB.set('skin','jouri')          // أي تفضيل
TB.celebrate(x,y)               // قصاصات + تعزيز الثيم الحي
TB.toast('تم الحفظ',{gold:true,icon:'award'})
TB.sheet(html,{title,sub,icon}); TB.closeSheet()
TB.quiz(el,[{q,opts:[..],a:1,why},{q,tf:true,a:true,why}],{title,onDone})
TB.addSkin(id,{n,d,who:'m'|'f',fx:0|1,L:[18],D:[18],g:'r,g,b',g2:'r,g,b'})
document.addEventListener('tb:theme', e => e.detail)  // عند تغيّر المظهر
```

## السجل PDF (`tabshoura-report.js`)
يصدّر كل أعمال المنصة في سجل A4 جاهز للحفظ PDF: غلاف بألوان الثيم، لوحة إنجاز برسوم (نسبة الإنجاز العامة ولكل قسم)، فهرس، ثم كل قسم بجداوله ورسومه، وصفحة توقيع.
- الألوان من الثيم الحالي للمنصة فقط (نسخته الفاتحة، لأن الورق أبيض). لا ألوان ثابتة.
- يقرأ الحالة المحفوظة على الجهاز (تعديلات المعلمة وما أنجزته)، ويتخطى الجداول والأقسام الفارغة ويذكرها في «أقسام لم تُستكمل».
- التفعيل في أي منصة على `/kit/`: أضف بعد `tabshoura.js` السطر
  `<script src="../design-system/tabshoura-report.js"></script>` فيظهر في قائمة «المزيد» زر «تصدير سجل الأعمال PDF». أضفه أيضًا إلى `CORE` في `sw.js`.
- اختياري في `content.js`: `reportTitle:'سجل أعمال …'` و`reportSign:[['الصفة','الاسم'],['مديرة المدرسة','الاسم']]`.
- الأنواع الخاصة بمنصة: `TB.report.types.myType=function(it,R){return html}` و`.progress=function(it){return {d,n}}`. أدوات `R`: `kpis table donut hbars stack cols ring chip box pal mix`. مثال: `aisha/report.js` (مستويات الطلبة، الزيارات، تحليل الأعمال) ويصلح لمنصة `/suad/` كما هو.
- برمجيًا: `TB.report.open({state,title,sign})` أو `TB.report.html(state,opts)` للتوليد الآلي (Playwright `page.pdf`).
