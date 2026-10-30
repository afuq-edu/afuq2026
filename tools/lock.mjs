/* =====================================================================
   بناء النسخة المقفلة من الموقع
   node tools/lock.mjs --src . --out <مجلد الإخراج> --keys <ملف كلمات المرور>

   ملف كلمات المرور (خاص، لا يُرفع إلى المستودع العام):
     {"suad":{"pw":"...","salt":"..."}, "meaad":{...}}
   الملح يُنشأ تلقائيًا أول مرة ويُكتب في الملف، ويجب أن يبقى ثابتًا وإلا طُلبت كلمة المرور من جديد على كل الأجهزة.

   لكل منصة مذكورة في الملف:
   - كل ملفاتها تُشفّر إلى <الاسم>.enc (AES-256-GCM بمفتاح PBKDF2-SHA256 من كلمة المرور)،
     ما عدا الأيقونات و manifest.webmanifest.
   - index.html الأصلي يُشفّر، ويُكتب مكانه صفحة القفل (بنفس العنوان والأيقونات و noindex).
   - sw.js يصبح عامل القفل (../lock/lock-sw.js) الذي يفك الملفات على جهاز المعلمة.
   - التشفير حتمي (IV من HMAC للمسار والمحتوى) فلا يتغير ملف مشفّر ما لم يتغير أصله.
   بقية المجلدات (المحركات المشتركة، نظام التصميم، نماذج العرض العامة) تُنسخ كما هي.
   ===================================================================== */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const A={};for(let i=2;i<process.argv.length;i+=2)A[process.argv[i].replace(/^--/,'')]=process.argv[i+1];
const SRC=path.resolve(A.src||'.'),OUT=path.resolve(A.out),KEYS=path.resolve(A.keys),ITER=310000;
if(!A.out||!A.keys){console.error('usage: node tools/lock.mjs --src . --out DIR --keys keys.json');process.exit(1);}
const keys=JSON.parse(fs.readFileSync(KEYS,'utf8'));
const SKIP=new Set(['.git','.github','node_modules','.claude']);
const PUB=f=>f==='manifest.webmanifest'||f.startsWith('icons/');

function walk(dir,base=''){let out=[];for(const n of fs.readdirSync(dir)){if(SKIP.has(n))continue;const p=path.join(dir,n),r=base?base+'/'+n:n;
  if(fs.statSync(p).isDirectory())out=out.concat(walk(p,r));else out.push(r);}return out;}
function enc(key,mac,rel,buf){const iv=crypto.createHmac('sha256',mac).update(rel+'\0').update(buf).digest().subarray(0,12);
  const c=crypto.createCipheriv('aes-256-gcm',key,iv);const ct=Buffer.concat([c.update(buf),c.final()]);return Buffer.concat([iv,ct,c.getAuthTag()]);}
function writeIfChanged(p,buf){fs.mkdirSync(path.dirname(p),{recursive:true});if(fs.existsSync(p)&&fs.readFileSync(p).equals(buf))return;fs.writeFileSync(p,buf);}
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}

function shellHTML(slug,orig){const head=(orig.match(/<head>([\s\S]*?)<\/head>/i)||['',''])[1];
  const keep=(head.match(/<(meta|link)\b[^>]*>/gi)||[]).filter(t=>!/rel="?(stylesheet|preconnect)/i.test(t)&&!/name="?robots/i.test(t));
  const title=(head.match(/<title>([\s\S]*?)<\/title>/i)||['',''])[1];
  const short=((head.match(/apple-mobile-web-app-title"\s+content="([^"]*)"/i)||[])[1])||title;
  const lockSvg='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="16" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>';
  const eye='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
  return `<!doctype html>
<html lang="ar" dir="rtl" data-lock="${slug}">
<head>
${keep.join('\n')}
<meta name="robots" content="noindex,nofollow,noarchive">
<title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Reem+Kufi:wght@600;700&display=swap">
<link rel="stylesheet" href="../design-system/tabshoura.css">
<link rel="stylesheet" href="../lock/lock.css">
</head>
<body>
<main class="lk"><div class="lk-card card">
  <img class="lk-ic" src="icons/icon-192.png" alt="">
  <span class="lk-lock">${lockSvg}منصة خاصة</span>
  <h1>${short}</h1>
  <p class="lk-sub">أدخلي كلمة المرور لفتح المنصة على هذا الجهاز. تُحفظ على الجهاز فلا تُطلب مرة أخرى.</p>
  <form id="lkForm" autocomplete="on">
    <div class="lk-row"><input id="lkPw" class="input" type="password" autocomplete="current-password" placeholder="كلمة المرور" dir="ltr" required><button type="button" class="lk-eye" id="lkEye" aria-label="إظهار كلمة المرور">${eye}</button></div>
    <button id="lkBtn" class="btn block" type="submit">فتح المنصة</button>
    <p id="lkMsg" class="lk-msg" role="status"></p>
  </form>
  <p class="lk-foot">محتوى المنصة مشفّر، ولا يمكن قراءته دون كلمة المرور.</p>
</div></main>
<noscript><p style="text-align:center">يلزم تفعيل JavaScript لفتح المنصة.</p></noscript>
<script src="../lock/lock.js"></script>
</body>
</html>
`;}

/* 1) نسخ الموقع كما هو، ثم استبدال مجلدات المنصات المقفلة */
const all=walk(SRC),locked=new Set(Object.keys(keys));
const want=new Set();
for(const f of all){const top=f.split('/')[0];if(locked.has(top))continue;want.add(f);writeIfChanged(path.join(OUT,f),fs.readFileSync(path.join(SRC,f)));}
let changedKeys=false;
for(const slug of locked){const k=keys[slug];if(!k.pw)throw new Error('no password for '+slug);
  if(!k.salt){k.salt=crypto.randomBytes(16).toString('base64');changedKeys=true;}
  const key=crypto.pbkdf2Sync(k.pw.trim(),Buffer.from(k.salt,'base64'),ITER,32,'sha256'),mac=crypto.createHash('sha256').update(key).update('iv').digest();
  const files=walk(path.join(SRC,slug)),h=crypto.createHash('sha256');let n=0,bytes=0;
  for(const f of files){const src=fs.readFileSync(path.join(SRC,slug,f));
    if(f==='sw.js')continue;
    if(PUB(f)){want.add(slug+'/'+f);writeIfChanged(path.join(OUT,slug,f),src);continue;}
    const e=enc(key,mac,f,src);h.update(e.subarray(0,12));want.add(slug+'/'+f+'.enc');writeIfChanged(path.join(OUT,slug,f+'.enc'),e);n++;bytes+=src.length;
    if(f==='index.html'){want.add(slug+'/index.html');writeIfChanged(path.join(OUT,slug,'index.html'),Buffer.from(shellHTML(slug,src.toString('utf8'))));}}
  const chk=enc(key,mac,'lock.json',Buffer.from('afuq-lock-ok'));
  want.add(slug+'/lock.json');writeIfChanged(path.join(OUT,slug,'lock.json'),Buffer.from(JSON.stringify({v:1,iter:ITER,salt:k.salt,check:chk.toString('base64')})+'\n'));
  const v=slug+'-l'+h.digest('hex').slice(0,10);
  want.add(slug+'/sw.js');writeIfChanged(path.join(OUT,slug,'sw.js'),Buffer.from(`/* منصة مقفلة: الملفات مشفّرة ويفكها هذا العامل على جهاز المعلمة بعد إدخال كلمة المرور. */\nself.LOCK={slug:'${slug}',v:'${v}',pub:['sw.js','lock.json','manifest.webmanifest']};\nimportScripts('../lock/lock-sw.js');\n`));
  console.log(slug.padEnd(12),n+' files encrypted',(bytes/1048576).toFixed(1)+' MB',v);}
/* 2) حذف ما لم يعد موجودًا في الإخراج (مثل نسخ غير مشفّرة قديمة) */
if(fs.existsSync(OUT))for(const f of walk(OUT))if(!want.has(f))fs.rmSync(path.join(OUT,f));
if(changedKeys)fs.writeFileSync(KEYS,JSON.stringify(keys,null,2)+'\n');
