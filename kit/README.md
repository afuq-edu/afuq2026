# منصّة · قالب منصات المعلمين والمعلمات

قالب واحد يُعاد استخدامه لكل منصة. الشكل من نظام «طبشورة» (`/design-system/`)، والمحرك هنا (`/kit/`)، والمحتوى في مجلد كل منصة.

```
/design-system/  tabshoura.css + tabshoura.js   (الثيمات، المشهد، الزجاج، المكونات)
/kit/            platform.css + platform.js     (الأقسام، التحرير، الأصوات، التفاعل، عارض الصور، التنصيب)
/<slug>/         index.html, content.js, manifest.webmanifest, sw.js, icons/, assets/
```

## إنشاء منصة جديدة (5 دقائق)
1. انسخ مجلد `shamsa/` إلى `/<slug>/` (اسم قصير بالإنجليزية، مثل `noura`).
2. في `content.js`: غيّر `id` و`brand` و`teacher` و`sections`. اترك `version:1`.
3. في `index.html` و`manifest.webmanifest`: غيّر العنوان والاسم المختصر واللون.
4. في `sw.js`: غيّر البادئة `shamsa-` إلى `<slug>-`.
5. ضع الملفات في `assets/`. صفحات PDF تُحوَّل إلى صور:
   `pdftoppm -r 150 -png file.pdf p && convert p-1.png -resize '1600x1600>' -quality 80 pages/name-1.jpg`
   ومصغّرات بعرض 360 في `assets/thumbs/`.
6. أيقونات: عدّل `icons/icon.svg` وولّد PNG بأحجام 512 و192 و180 و64.
7. ادفع إلى `main`، فيصبح الرابط: `https://afuq-edu.github.io/afuq2026/<slug>/`

## أنواع البنود في `content.js`
| النوع | الحقول |
|---|---|
| `text` | `title`, `body` |
| `vision` | `title`, `body`, `icon` (eye/target/heart), `tone` ('' ذهبي أو 'c2')، و`placeholder` يظهر للمعلمة في وضع التحرير إن كان فارغًا |
| `image` | `src`, `title`, `caption` (الصورة كبيرة والوصف تحتها) |
| `album` | `title`, `images:[{src,thumb,caption,short}]`, `file` (ملف للتحميل)، `land:1` للصفحات الأفقية |
| `list` | `title`, `items:[نص]` |
| `link` | `title`, `url`, `desc` |
| `stats` | `items:[{v,l,ic,from}]`؛ `from` يحسب الرقم حيًا: `{item,count:'rows'\|'done'\|'mine'\|'items'\|'goals'\|'acts'\|'actsdone'\|'goalsdone'}` أو `{item,col,eq}` |
| `cards` | `items:[{t,s,chips,badge,badgeL,me}]` |
| `timeline` | `filters`, `mineLabel`, `items:[{iso,date,en,s,chips,mine,done}]` |
| `bars` | `items:[{l,sub,v(0-100),vl,c}]`, `note` |
| `table` | `head`, `rows` (true/false تظهر نقطة)، `ltr:[أرقام أعمدة]`, `note`، `toggle:[أعمدة]` حالة تتبدل بلمسة (`okv`/`nov`)؛ الخانات قابلة للكتابة في وضع التحرير |
| `projects` | `items:[{name,ic,c,desc,grades}]` |
| `planner` | خطتي اليومية: `tasks:[{id,t,at,rep('' أو weekdays أو daily أو w0..w6 ليوم أسبوعي، w2 = الثلاثاء),done}]`، `suggest:[نص]`، `auto:{pd,visits,prep,goals}` لاقتراح مهام من بنود أخرى. مهامه تظهر أيضًا في الواجهة الرئيسية |
| `goals` | خطة المادة: `items:[{id,dom,goal,from,to,acts:[{t,done}],note}]` (التواريخ yyyy-mm-dd). الأنشطة تُعلّم بلمسة، وتُضاف إلى مهام اليوم وترتبط بها |

أي بند يقبل `w:'half'` ليأخذ نصف العرض على الشاشات الكبيرة. الأقسام: `{id,title,icon,color,desc,items}`.

## ما يفعله المحرك
- زر القلم: وضع التحرير. إضافة قسم أو بند (نص، رؤية، صورة، ألبوم، قائمة، رابط، ملف)، تعديل، تحريك، حذف مع «تراجع».
- التعديلات تُحفظ على جهاز المعلمة (IndexedDB)، مع تصدير واستيراد نسخة من قائمة «المزيد».
- عند تحديث `content.js` ارفع `version` فتُضاف الأقسام والبنود الجديدة دون مسح تعديلات المعلمة.
- أصوات هادئة مولّدة (Web Audio) قابلة للإيقاف، بريق يتبع المؤشر، ميلان البطاقات، تموّج عند اللمس، ذيل نجوم.
- عارض صور: سحب، تكبير بإصبعين أو نقر مزدوج، أسهم لوحة المفاتيح.
- PWA: تنصيب على الكمبيوتر وأندرويد، وتعليمات للآيباد والآيفون، وعمل دون إنترنت.

لفرض تحديث حقول المعلم المحفوظة على الأجهزة: `force:{teacher:['bio','stats']}` مع رفع `version`.
