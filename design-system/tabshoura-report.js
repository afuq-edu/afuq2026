/* =====================================================================
   طبشورة · «السجل» — تصدير سجل أعمال المنصة PDF (v1.0)
   يبني من بيانات المنصة (المحفوظة على الجهاز، بما فيها تعديلات المعلمة) مستندًا
   مطبوعًا بحجم A4: غلاف، لوحة إنجاز ورسوم بيانية، فهرس، ثم كل قسم بجداوله وبياناته.
   - الألوان كلها من الثيم الحالي للمنصة (نسخته الفاتحة لأن الورق أبيض)، لا لون دخيل.
   - الحفظ PDF من المتصفح نفسه (طباعة ← حفظ PDF) فيبقى الخط العربي صحيحًا.
   الاستعمال:
     <script src="../design-system/tabshoura-report.js"></script>   (بعد tabshoura.js)
     TB.report.open()                    يفتح المعاينة (يقرأ PF.state() تلقائيًا)
     TB.report.open({state, title, sign:['المعلم الأول','مديرة المدرسة']})
     TB.report.html(state, opts)         HTML السجل فقط (للتوليد الآلي)
   أنواع خاصة بمنصة: TB.report.types.myType = function(it, R){ return html }
     و TB.report.types.myType.progress = function(it){ return {d:منجز, n:الكل} }
   R = أدوات: esc, ic, kpis, table, donut, hbars, stack, cols, ring, chip, pal, mix
   ===================================================================== */
(function(){
'use strict';
var TB=window.TB=window.TB||{};
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function txt(s){return s!=null&&String(s).trim()!=='';}
function ic(n){try{if(window.PF&&window.PF.G)return window.PF.G(n);}catch(e){}return (TB.I&&(TB.I[n]||TB.I.book))||'';}
function pct(a,b){return b?Math.round(a/b*1000)/10:0;}
function fmt(n){n=Math.round(n*10)/10;return String(n);}
var MON=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
var DAYS=['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
function dlong(iso){var d=iso?new Date(iso+'T12:00'):new Date();if(isNaN(d))return esc(iso);return d.getDate()+' '+MON[d.getMonth()]+' '+d.getFullYear();}
function dshort(iso){var d=new Date(iso+'T12:00');if(isNaN(d))return esc(iso||'');return d.getDate()+' '+MON[d.getMonth()];}
function isoToday(){var d=new Date();return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2);}

/* ---------- ألوان الثيم (النسخة الفاتحة للثيم الحالي) ---------- */
function hex2rgb(h){h=String(h).trim();var m=h.match(/^rgba?\(([^)]+)\)/);if(m){var p=m[1].split(',').map(parseFloat);return [p[0],p[1],p[2]];}
  h=h.replace('#','');if(h.length===3)h=h.split('').map(function(c){return c+c;}).join('');var n=parseInt(h.slice(0,6),16);return [(n>>16)&255,(n>>8)&255,n&255];}
function rgb2hex(a){return '#'+a.map(function(v){v=Math.max(0,Math.min(255,Math.round(v)));return ('0'+v.toString(16)).slice(-2);}).join('');}
function mix(a,b,t){var x=hex2rgb(a),y=hex2rgb(b);return rgb2hex([x[0]*t+y[0]*(1-t),x[1]*t+y[1]*(1-t),x[2]*t+y[2]*(1-t)]);}
function palette(skin){var root=document.documentElement,sk=skin||root.getAttribute('data-skin')||(TB.prefs&&TB.prefs.skin)||root.getAttribute('data-skin-default')||'sabboura';
  var S=TB.SKINS&&(TB.SKINS[sk]||TB.SKINS[root.getAttribute('data-skin-default')]),K=TB.SKK||[],p={skin:sk};
  if(S&&S.L)K.forEach(function(k,i){p[k]=S.L[i];});
  else{var cs=getComputedStyle(root);['sky1','sky2','sky3','sun','sil','sil2','water','pillar','ink','ink2','muted','accent','accent2','accent-soft','track','gold','c1','c2'].forEach(function(k){p[k]=cs.getPropertyValue('--'+k).trim()||'#888';});}
  if(/^rgba/.test(p['accent-soft']||''))p['accent-soft']=mix(p.accent,'#ffffff',.14);
  p.paper='#ffffff';p.tint=mix(p.sky2,'#ffffff',.55);p.line=mix(p.ink,'#ffffff',.12);p.soft=mix(p.accent,'#ffffff',.12);p.gsoft=mix(p.gold,'#ffffff',.16);
  /* تسلسل الفئات: من ألوان الثيم فقط وبترتيب ثابت */
  p.cat=[p.accent,p.gold,p.c1,p.c2===p.accent?p.accent2:p.c2,p.muted];
  return p;}

/* ---------- مكوّنات الرسم (HTML + SVG، تعمل من اليمين لليسار) ---------- */
var PAL=null;
function chip(t,on){return '<span class="tbr-chip'+(on===true?' on':on===false?' off':'')+'">'+esc(t)+'</span>';}
function kpis(a){return '<div class="tbr-kpis">'+a.filter(Boolean).map(function(k){return '<div class="tbr-kpi'+(k.hi?' hi':'')+'">'+(k.ic?'<i>'+ic(k.ic)+'</i>':'')+'<b>'+esc(k.v)+'</b><small>'+esc(k.l)+'</small></div>';}).join('')+'</div>';}
/* حلقة/كعكة: segs=[{v,l,c}] */
function donut(segs,center,sub,opt){opt=opt||{};var tot=segs.reduce(function(s,x){return s+(+x.v||0);},0),r=40,C=2*Math.PI*r,off=0,gap=segs.filter(function(x){return x.v>0;}).length>1?1.6:0;
  var arcs=segs.map(function(s){var len=tot?(s.v/tot)*C:0,d=Math.max(0,len-gap);var a='<circle r="'+r+'" cx="50" cy="50" fill="none" stroke="'+s.c+'" stroke-width="13" stroke-dasharray="'+d.toFixed(2)+' '+(C-d).toFixed(2)+'" stroke-dashoffset="'+(-off).toFixed(2)+'"/>';off+=len;return len>0?a:'';}).join('');
  var lg=opt.nolegend?'':'<ul class="tbr-lg">'+segs.map(function(s){return '<li><i style="background:'+s.c+'"></i><span>'+esc(s.l)+'</span><b>'+esc(s.v)+(tot?' <small>('+fmt(pct(s.v,tot))+'%)</small>':'')+'</b></li>';}).join('')+'</ul>';
  return '<div class="tbr-donut"><div class="tbr-dz"><svg viewBox="0 0 100 100" aria-hidden="true"><circle r="'+r+'" cx="50" cy="50" fill="none" stroke="'+PAL.track+'" stroke-width="13"/><g transform="rotate(-90 50 50)">'+arcs+'</g></svg><div class="tbr-dc"><b>'+esc(center)+'</b>'+(sub?'<small>'+esc(sub)+'</small>':'')+'</div></div>'+lg+'</div>';}
function ring(p,label,c){return donut([{v:p,c:c||PAL.accent,l:''},{v:Math.max(0,100-p),c:'transparent',l:''}],fmt(p)+'%',label,{nolegend:1});}
/* أشرطة أفقية: rows=[{l,sub,v,max,vl,c}] */
function hbars(rows,opt){opt=opt||{};var mx=opt.max||Math.max.apply(null,rows.map(function(r){return r.max||r.v||0;}).concat([1]));
  return '<div class="tbr-hb">'+rows.map(function(r){var w=Math.max(0,Math.min(100,(r.v/(r.max||mx))*100));return '<div class="tbr-hr"><div class="tbr-hl"><b>'+esc(r.l)+'</b>'+(r.sub?'<small>'+esc(r.sub)+'</small>':'')+'</div><div class="tbr-ht"><i style="width:'+w.toFixed(1)+'%;background:'+(r.c||PAL.accent)+'"></i></div><div class="tbr-hv">'+esc(r.vl!=null?r.vl:r.v)+'</div></div>';}).join('')+'</div>';}
/* أشرطة مكدّسة 100%: rows=[{l,sub,parts:[n..]}], names=[], colors=[] */
function stack(rows,names,colors){return '<div class="tbr-st">'+rows.map(function(r){var t=r.parts.reduce(function(s,x){return s+x;},0);
    return '<div class="tbr-sr"><div class="tbr-hl"><b>'+esc(r.l)+'</b>'+(r.sub?'<small>'+esc(r.sub)+'</small>':'')+'</div><div class="tbr-sb">'+r.parts.map(function(v,i){var w=t?v/t*100:0;return w>0?'<i style="width:'+w.toFixed(2)+'%;background:'+colors[i]+';color:'+(i<1||i>3?'#fff':PAL.ink)+'" title="'+esc(names[i])+'">'+(w>=6?fmt(w)+'%':'')+'</i>':'';}).join('')+'</div></div>';}).join('')+
    '</div><ul class="tbr-lg row">'+names.map(function(n,i){return '<li><i style="background:'+colors[i]+'"></i><span>'+esc(n)+'</span></li>';}).join('')+'</ul>';}
/* أعمدة: a=[{l,v,c}] */
function cols(a,opt){opt=opt||{};var mx=Math.max.apply(null,a.map(function(x){return x.v;}).concat([1]));
  return '<div class="tbr-cols">'+a.map(function(x){return '<div class="tbr-col"><span class="tbr-cv">'+esc(x.v)+'</span><i style="height:'+(x.v/mx*100).toFixed(1)+'%;background:'+(x.c||PAL.accent)+'"></i><small>'+esc(x.l)+'</small></div>';}).join('')+'</div>';}
function table(head,rows,opt){opt=opt||{};var ltr=opt.ltr||[],tg=opt.toggle||[],okv=opt.okv;
  return '<table class="tbr-tbl'+(opt.compact?' compact':'')+'"><thead><tr>'+head.map(function(h){return '<th>'+esc(h)+'</th>';}).join('')+'</tr></thead><tbody>'+rows.map(function(r){return '<tr>'+r.map(function(c,i){var v=c;
      if(c===true||c===false)v='<span class="tbr-dot'+(c?' on':'')+'"></span>';else if(tg.indexOf(i)>-1)v=chip(c,c===okv);else if(c&&typeof c==='object'&&c.html)v=c.html;else v=txt(c)?esc(c):'<span class="tbr-mu">—</span>';
      return '<td'+(ltr.indexOf(i)>-1?' class="n"':'')+'>'+v+'</td>';}).join('')+'</tr>';}).join('')+'</tbody></table>';}
function box(title,icon,body,cls){return '<div class="tbr-box '+(cls||'')+'">'+(title?'<h4>'+(icon?ic(icon):'')+esc(title)+'</h4>':'')+body+'</div>';}

/* ---------- قراءة البنود ---------- */
function rowsFilled(it){var tg=it.toggle||[];return (it.rows||[]).filter(function(r){return r.some(function(c,i){if(tg.indexOf(i)>-1||c===true||c===false||!txt(c))return false;return !(i===0&&/^\d+$/.test(String(c).trim()));});});}
function goalProg(g){var a=g.acts||[],d=a.filter(function(x){return x.done;}).length;return {d:d,n:a.length};}
function statVal(s){if(s.from&&window.PF&&window.PF.from){try{return String(window.PF.from(s.from));}catch(e){}}return s.v;}
var REP=function(r){return r==='daily'?'كل يوم':r==='weekdays'?'أيام الدوام':/^w[0-6]$/.test(r)?'كل '+DAYS[+r[1]]:'مرة واحدة';};

/* تقدم أي بند {d,n} أو null */
function progress(it){var T=TB.report.types[it.type];if(T&&T.progress)return T.progress(it);
  if(it.type==='goals'){var d=0,n=0;(it.items||[]).forEach(function(g){var p=goalProg(g);d+=p.d;n+=p.n;});return n?{d:d,n:n}:null;}
  if(it.type==='table'&&it.toggle&&it.toggle.length){var c=it.toggle[0],rs=rowsFilled(it);if(!rs.length)return null;return {d:rs.filter(function(r){return r[c]===(it.okv||'منجزة');}).length,n:rs.length};}
  if(it.type==='timeline'&&(it.items||[]).length){return {d:it.items.filter(function(x){return x.done;}).length,n:it.items.length};}
  return null;}

/* ---------- رسم أنواع البنود ---------- */
var T={
  text:function(it){return txt(it.body)?box(it.title,'book','<div class="tbr-p">'+esc(it.body).replace(/\n/g,'<br>')+'</div>'):'';},
  vision:function(it){return txt(it.body)?'<div class="tbr-vision"><i>'+ic(it.icon||'eye')+'</i><div><h4>'+esc(it.title)+'</h4><p>'+esc(it.body).replace(/\n\n/g,'</p><p>').replace(/\n/g,'<br>')+'</p></div></div>':'';},
  list:function(it){var a=(it.items||[]).filter(txt);return a.length?box(it.title,'list','<ol class="tbr-ol">'+a.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ol>',it.w==='half'?'half':''):'';},
  stats:function(it){var a=(it.items||[]).map(function(s){return {v:statVal(s),l:s.l,ic:s.ic};});return a.length?(txt(it.title)?'<h4 class="tbr-h4">'+esc(it.title)+'</h4>':'')+kpis(a):'';},
  cards:function(it){var a=it.items||[];if(!a.length)return '';return box(it.title,'users','<div class="tbr-cards'+(a.length>8?' dense':'')+'">'+a.map(function(c){return '<div class="tbr-card'+(c.me?' me':'')+'"><b>'+esc(c.t)+'</b>'+(txt(c.s)?'<p>'+esc(c.s)+'</p>':'')+((c.chips||[]).length?'<div>'+c.chips.map(function(x){return chip(x);}).join('')+'</div>':'')+(c.badge?'<em>'+esc(c.badge)+' <small>'+esc(c.badgeL||'')+'</small></em>':'')+'</div>';}).join('')+'</div>');},
  table:function(it){var rs=rowsFilled(it);if(!rs.length)return '';var p=progress(it),side='';
    if(p&&p.n){var tg=it.toggle[0],vals={};rs.forEach(function(r){vals[r[tg]]=(vals[r[tg]]||0)+1;});var ks=Object.keys(vals).sort(function(a,b){return a===(it.okv||'منجزة')?-1:b===(it.okv||'منجزة')?1:0;});
      side='<div class="tbr-side">'+donut(ks.map(function(k,i){return {v:vals[k],l:k,c:k===(it.okv||'منجزة')?PAL.accent:i===1?PAL.gold:PAL.muted};}),fmt(pct(p.d,p.n))+'%',it.okv||'منجز')+'</div>';}
    return box(it.title,'list',(side?'<div class="tbr-with">'+side:'')+'<div class="tbr-tw">'+table(it.head||[],rs,{ltr:it.ltr,toggle:it.toggle,okv:it.okv,compact:(it.head||[]).length>5})+'</div>'+(side?'</div>':'')+(txt(it.note)?'<p class="tbr-note">'+esc(it.note)+'</p>':''));},
  goals:function(it){var gs=it.items||[];if(!gs.length)return '';var dom={},ord=[];
    gs.forEach(function(g){var p=goalProg(g),k=g.dom||'أهداف';if(!dom[k]){dom[k]={d:0,n:0,g:0};ord.push(k);}dom[k].d+=p.d;dom[k].n+=p.n;dom[k].g++;});
    var tot=ord.reduce(function(s,k){return s+dom[k].n;},0),dn=ord.reduce(function(s,k){return s+dom[k].d;},0);
    var h='<div class="tbr-with"><div class="tbr-side">'+ring(pct(dn,tot),'من الأنشطة منجزة')+'<p class="tbr-cap">'+dn+' من '+tot+' نشاطًا</p></div><div class="tbr-tw">'+
      '<h4 class="tbr-h4">التقدم في كل مجال</h4>'+hbars(ord.map(function(k,i){return {l:k,sub:dom[k].g+(dom[k].g>2?' أهداف':dom[k].g===2?' هدفان':' هدف'),v:dom[k].n?pct(dom[k].d,dom[k].n):0,max:100,vl:dom[k].d+' / '+dom[k].n,c:PAL.accent};}))+'</div></div>';
    h+='<div class="tbr-goals">'+gs.map(function(g,i){var p=goalProg(g);return '<div class="tbr-goal"><div class="tbr-gh"><span class="tbr-gn">'+(i+1)+'</span><div><small>'+esc(g.dom||'')+(g.from?' · '+dshort(g.from)+' – '+dshort(g.to):'')+'</small><b>'+esc(g.goal)+'</b></div><em>'+p.d+'/'+p.n+'</em></div>'+
      '<ul class="tbr-acts">'+(g.acts||[]).map(function(a){return '<li class="'+(a.done?'ok':'')+'"><span class="tbr-tick">'+(a.done?'✓':'')+'</span>'+esc(a.t)+'</li>';}).join('')+'</ul>'+(txt(g.note)?'<p class="tbr-note">'+esc(g.note)+'</p>':'')+'</div>';}).join('')+'</div>';
    return box(it.title||'الأهداف والأنشطة','target',h);},
  planner:function(it){var ts=it.tasks||[];if(!ts.length)return '';var tot=0;ts.forEach(function(t){tot+=Object.keys(t.done||{}).length;});
    var rep=ts.filter(function(t){return t.rep;}),one=ts.filter(function(t){return !t.rep;});
    return box(it.title||'المهام','task',kpis([{v:ts.length,l:'مهمة في الخطة',ic:'task'},{v:rep.length,l:'مهمة متكررة',ic:'clock'},{v:tot,l:'مرة أُنجزت فيها مهمة',ic:'check'}])+
      table(['المهمة','الوقت','التكرار','مرات الإنجاز'],ts.map(function(t){return [t.t,t.at||'',REP(t.rep),String(Object.keys(t.done||{}).length)];}),{ltr:[1,3]})+
      ((it.suggest||[]).length?'<h4 class="tbr-h4">مقترحات للمتابعة</h4><ol class="tbr-ol">'+it.suggest.map(function(s){return '<li>'+esc(typeof s==='string'?s:s.t)+'</li>';}).join('')+'</ol>':''));},
  timeline:function(it){var a=it.items||[];if(!a.length)return '';return box(it.title,'cal','<ol class="tbr-tl">'+a.map(function(x){return '<li class="'+(x.done?'ok':'')+'"><i></i><small>'+esc(x.date||(x.iso?dlong(x.iso):''))+(x.done?' · منفّذ':'')+'</small><b>'+esc(x.en||x.t||'')+'</b>'+(txt(x.s)?'<p>'+esc(x.s)+'</p>':'')+((x.chips||[]).length?'<div>'+x.chips.map(function(c){return chip(c);}).join('')+'</div>':'')+'</li>';}).join('')+'</ol>');},
  bars:function(it){var a=it.items||[];if(!a.length)return '';return box(it.title,'chart',hbars(a.map(function(b,i){return {l:b.l,sub:b.sub,v:+b.v||0,max:100,vl:b.vl||(b.v+'%'),c:PAL.cat[i%4]};}))+(txt(it.note)?'<p class="tbr-note">'+esc(it.note)+'</p>':''));},
  album:function(it){var a=(it.images||[]).filter(function(x){return x.thumb||x.src;});if(!a.length)return '';var more=a.length>6?a.length-6:0;a=a.slice(0,6);
    return box(it.title,'image','<div class="tbr-album'+(it.land?' land':'')+'">'+a.map(function(x){return '<figure><img src="'+esc(x.thumb||x.src)+'" alt="" loading="eager"><figcaption>'+esc(x.short||x.caption||'')+'</figcaption></figure>';}).join('')+'</div>'+(more?'<p class="tbr-note">و'+more+' صور أخرى في المنصة.</p>':''),'album');},
  image:function(it){if(!it.src)return '';return box(it.title,'image','<figure class="tbr-img"><img src="'+esc(it.src)+'" alt=""><figcaption>'+esc(it.caption||'')+'</figcaption></figure>');},
  projects:function(it){var a=it.items||[];if(!a.length)return '';return box(it.title,'star','<div class="tbr-cards">'+a.map(function(p){return '<div class="tbr-card"><b>'+esc(p.name)+'</b><p>'+esc(p.desc||'')+'</p>'+(p.grades?'<div>'+chip(p.grades)+'</div>':'')+'</div>';}).join('')+'</div>');},
  link:function(it){return it.url?box(it.title,'link','<p class="tbr-p">'+esc(it.desc||'')+'</p><p class="tbr-url">'+esc(it.url)+'</p>'):'';},
  file:function(it){return box(it.title||'ملف','folder','<p class="tbr-p">ملف مرفق في المنصة'+(it.name?': '+esc(it.name):'')+'</p>');}
};

/* ---------- بناء السجل ---------- */
function build(st,opts){opts=opts||{};PAL=palette(opts.skin);var t=st.teacher||{},secs=(st.sections||[]),today=isoToday();
  var R={esc:esc,ic:ic,kpis:kpis,table:table,donut:donut,hbars:hbars,stack:stack,cols:cols,ring:ring,chip:chip,box:box,pal:PAL,mix:mix,pct:pct,fmt:fmt,dshort:dshort,dlong:dlong,txt:txt,today:today};
  /* أجزاء كل قسم */
  var parts=[],empty=[],allP={d:0,n:0},secProg=[];
  secs.forEach(function(s){var html='',sp={d:0,n:0};(s.items||[]).forEach(function(it){var fn=TB.report.types[it.type]||T[it.type],h='';
      try{h=fn?fn(it,R)||'':'';}catch(e){h='';if(window.console)console.warn('report',it.type,e);}
      if(h){html+='<div class="tbr-it'+(it.w==='half'?' half':'')+'">'+h+'</div>';var p=progress(it);if(p&&p.n){sp.d+=p.d;sp.n+=p.n;}}});
    if(html){parts.push({s:s,html:html,p:sp});if(sp.n){secProg.push({l:s.title,d:sp.d,n:sp.n});allP.d+=sp.d;allP.n+=sp.n;}}else empty.push(s.title);});

  var who=t.name||'',title=opts.title||'سجل الأعمال',sub=[t.role,t.school].filter(txt).join(' · ');
  /* الغلاف */
  var av=t.logo?'<img src="'+esc(t.logo)+'" alt="">':t.photo?'<img src="'+esc(t.photo)+'" alt="">':'<span>'+esc(t.initials||(who||'·').charAt(0))+'</span>';
  var stars='';for(var i=0;i<46;i++){var hx=Math.sin(i*12.9898)*43758.5453,hy=Math.sin(i*78.233)*12345.678,x=(hx-Math.floor(hx))*100,y=(hy-Math.floor(hy))*100,r=(i%7===0)?1.6:(i%3===0?.9:.5);stars+='<circle cx="'+x.toFixed(1)+'" cy="'+(y*0.62).toFixed(1)+'" r="'+r+'" fill="'+(i%5===0?PAL.gold:PAL.accent)+'" opacity="'+(i%7===0?.7:.35)+'"/>';}
  var cover='<section class="tbr-cover"><svg class="tbr-cv-art" viewBox="0 0 100 140" preserveAspectRatio="xMidYMid slice" aria-hidden="true">'+
      '<defs><radialGradient id="tbrG1" cx="80%" cy="10%" r="70%"><stop offset="0" stop-color="'+PAL.accent+'" stop-opacity=".28"/><stop offset="1" stop-color="'+PAL.accent+'" stop-opacity="0"/></radialGradient><radialGradient id="tbrG2" cx="10%" cy="95%" r="60%"><stop offset="0" stop-color="'+PAL.gold+'" stop-opacity=".22"/><stop offset="1" stop-color="'+PAL.gold+'" stop-opacity="0"/></radialGradient></defs>'+
      '<rect width="100" height="140" fill="'+PAL.sky2+'"/><rect width="100" height="140" fill="url(#tbrG1)"/><rect width="100" height="140" fill="url(#tbrG2)"/>'+stars+
      '<g fill="none" stroke="'+PAL.accent+'" stroke-opacity=".18" stroke-width=".35"><circle cx="86" cy="18" r="22"/><circle cx="86" cy="18" r="30"/><circle cx="86" cy="18" r="38"/></g>'+
      '<path d="M0 118 C 25 108, 45 128, 70 116 S 100 110, 100 110 V140 H0Z" fill="'+PAL.accent+'" opacity=".10"/><path d="M0 126 C 30 118, 55 134, 100 122 V140 H0Z" fill="'+PAL.accent+'" opacity=".14"/></svg>'+
    '<div class="tbr-cv-in"><div class="tbr-cv-top"><span class="tbr-cv-brand">'+esc(st.brand||'')+'</span><span>'+esc(t.year||'')+'</span></div>'+
    '<div class="tbr-cv-mid"><div class="tbr-av">'+av+'</div><p class="tbr-eyebrow">'+esc(title)+'</p><h1>'+esc(who)+'</h1><p class="tbr-cv-sub">'+esc(sub)+'</p>'+(txt(t.region)?'<p class="tbr-cv-reg">'+esc(t.region)+'</p>':'')+
      ((t.stats||[]).length?'<div class="tbr-cv-stats">'+t.stats.map(function(s){return '<div><b>'+esc(s.v)+'</b><small>'+esc(s.l)+'</small></div>';}).join('')+'</div>':'')+'</div>'+
    '<div class="tbr-cv-foot"><div><small>تاريخ الإصدار</small><b>'+dlong(today)+'</b></div><div><small>الأقسام</small><b>'+parts.length+'</b></div><div><small>نسبة الإنجاز العامة</small><b>'+(allP.n?fmt(pct(allP.d,allP.n))+'%':'—')+'</b></div></div></div></section>';

  /* لوحة الإنجاز + الفهرس */
  var dash='<section class="tbr-page tbr-dash"><header class="tbr-sh"><span class="tbr-sn">'+ic('chart')+'</span><div><small>نظرة عامة</small><h2>لوحة الإنجاز</h2></div></header>';
  if(txt(t.bio))dash+='<div class="tbr-vision"><i>'+ic('user')+'</i><div><h4>نبذة</h4><p>'+esc(t.bio)+'</p></div></div>';
  if(allP.n){dash+='<div class="tbr-with"><div class="tbr-side">'+ring(pct(allP.d,allP.n),'نسبة الإنجاز العامة')+'<p class="tbr-cap">'+allP.d+' منجز من '+allP.n+' عنصرًا قابلًا للمتابعة</p></div><div class="tbr-tw"><h4 class="tbr-h4">الإنجاز في كل قسم</h4>'+
      hbars(secProg.map(function(s,i){return {l:s.l,v:pct(s.d,s.n),max:100,vl:s.d+' / '+s.n,c:PAL.accent};}))+'</div></div>';}
  var extra=(opts.dash?opts.dash(st,R):'')||'';dash+=extra;
  dash+='<h4 class="tbr-h4">محتويات السجل</h4><ol class="tbr-toc">'+parts.map(function(p,i){var n=(p.s.items||[]).length;return '<li><span class="tbr-tn">'+(i+1)+'</span><div><b>'+esc(p.s.title)+'</b>'+(txt(p.s.desc)?'<small>'+esc(p.s.desc)+'</small>':'')+'</div>'+(p.p.n?'<em>'+fmt(pct(p.p.d,p.p.n))+'%</em>':'')+'</li>';}).join('')+'</ol>';
  if(empty.length)dash+='<div class="tbr-box tbr-todo"><h4>'+ic('clock')+'أقسام لم تُستكمل بياناتها بعد</h4><div>'+empty.map(function(x){return chip(x);}).join('')+'</div></div>';
  dash+='</section>';

  /* الأقسام */
  var body=parts.map(function(p,i){return '<section class="tbr-sec"><header class="tbr-sh"><span class="tbr-sn">'+(i+1)+'</span><div>'+(txt(p.s.desc)?'<small>'+esc(p.s.desc)+'</small>':'')+'<h2>'+esc(p.s.title)+'</h2></div>'+(p.p.n?'<em class="tbr-sp">'+fmt(pct(p.p.d,p.p.n))+'%<small>منجز</small></em>':'')+'</header>'+p.html+'</section>';}).join('');

  /* الختام والتوقيع */
  var sign=opts.sign||[t.role||'المعلم','مدير/ة المدرسة'];
  var end='<section class="tbr-end"><div class="tbr-signs">'+sign.map(function(s,i){var l=Array.isArray(s)?s[0]:s,n=Array.isArray(s)?s[1]:(i===0?who:'');return '<div><small>'+esc(l)+'</small><b>'+(txt(n)?esc(n):'&nbsp;')+'</b><span>التوقيع</span></div>';}).join('')+'</div>'+
    (txt(st.footer)?'<p class="tbr-foot">'+esc(st.footer)+'</p>':'')+'<p class="tbr-foot sm">صدر هذا السجل من المنصة في '+dlong(today)+'</p></section>';

  var running=esc(title+' · '+who+(t.school?' · '+t.school:''));
  return {html:cover+'<div class="tbr-doc">'+dash+body+end+'</div>',running:running,pal:PAL};}

/* ---------- الأنماط ---------- */
function css(P,running){var v='--accent:'+P.accent+';--accent2:'+P.accent2+';--gold:'+P.gold+';--c1:'+P.c1+';--c2:'+P.c2+';--ink:'+P.ink+';--ink2:'+P.ink2+';--muted:'+P.muted+';--track:'+P.track+';--sky1:'+P.sky1+';--sky2:'+P.sky2+';--soft:'+P.soft+';--gsoft:'+P.gsoft+';--line:'+P.line+';--tint:'+P.tint;
return '@page{size:A4;margin:15mm 13mm 17mm;@bottom-center{content:counter(page);font:600 9pt "IBM Plex Sans Arabic",sans-serif;color:'+P.muted+'}@bottom-right{content:"'+running.replace(/"/g,'')+'";font:500 7.5pt "IBM Plex Sans Arabic",sans-serif;color:'+P.muted+'}}'+
'@page cover{margin:0;@bottom-center{content:none}@bottom-right{content:none}}'+
'#tbReport{'+v+';position:fixed;inset:0;z-index:9999;overflow:auto;background:'+mix(P.sky2,'#888888',.8)+';direction:rtl;font-family:"IBM Plex Sans Arabic",Tajawal,sans-serif;color:var(--ink);-webkit-print-color-adjust:exact;print-color-adjust:exact;font-size:10pt;line-height:1.65}'+
'#tbReport *{box-sizing:border-box}#tbReport svg{display:block}'+
'.tbr-bar{position:sticky;top:0;z-index:3;display:flex;gap:10px;align-items:center;justify-content:space-between;padding:10px 16px;background:var(--sky1);border-bottom:1px solid var(--line);font-family:inherit}'+
'.tbr-bar b{font-size:1rem}.tbr-bar .tbr-btns{display:flex;gap:8px}.tbr-bar button{font:600 .95rem "IBM Plex Sans Arabic",sans-serif;border:0;border-radius:99px;padding:10px 18px;cursor:pointer;background:var(--accent);color:#fff;display:inline-flex;gap:6px;align-items:center}.tbr-bar button.g{background:transparent;color:var(--ink);box-shadow:inset 0 0 0 1.5px var(--line)}.tbr-bar svg{width:18px;height:18px}'+
'.tbr-paper{max-width:210mm;margin:18px auto 40px;background:#fff;box-shadow:0 20px 50px -20px rgba(0,0,0,.35)}'+
'.tbr-cover{page:cover;position:relative;height:297mm;overflow:hidden;break-after:page;color:var(--ink)}.tbr-cv-art{position:absolute;inset:0;width:100%;height:100%}'+
'.tbr-cv-in{position:relative;height:100%;display:flex;flex-direction:column;justify-content:space-between;padding:20mm 18mm 18mm}'+
'.tbr-cv-top{display:flex;justify-content:space-between;font-weight:600;color:var(--ink2);font-size:10.5pt}.tbr-cv-brand{color:var(--accent2)}'+
'.tbr-cv-mid{text-align:center}.tbr-av{width:34mm;height:34mm;margin:0 auto 8mm;border-radius:50%;background:#fff;display:grid;place-items:center;box-shadow:0 0 0 2.5mm var(--soft),0 0 0 3.2mm var(--gold);overflow:hidden}.tbr-av img{width:100%;height:100%;object-fit:contain}.tbr-av span{font:700 40pt "Reem Kufi","IBM Plex Sans Arabic",sans-serif;color:var(--accent)}'+
'.tbr-eyebrow{display:inline-block;margin:0 0 4mm;padding:2mm 7mm;border-radius:99px;background:var(--accent);color:#fff;font-weight:700;font-size:12pt;letter-spacing:.3px}'+
'.tbr-cover h1{margin:0;font:700 30pt/1.35 "Reem Kufi","IBM Plex Sans Arabic",sans-serif;color:var(--ink)}.tbr-cv-sub{margin:3mm 0 0;font-size:13pt;font-weight:600;color:var(--ink2)}.tbr-cv-reg{margin:1mm 0 0;color:var(--muted);font-size:11pt}'+
'.tbr-cv-stats{display:flex;justify-content:center;gap:4mm;margin-top:12mm;flex-wrap:wrap}.tbr-cv-stats div{min-width:34mm;padding:4mm 3mm;border-radius:5mm;background:rgba(255,255,255,.72);border:1px solid var(--line)}.tbr-cv-stats b{display:block;font:700 20pt "Reem Kufi","IBM Plex Sans Arabic",sans-serif;color:var(--accent2)}.tbr-cv-stats small{color:var(--ink2);font-size:9pt}'+
'.tbr-cv-foot{display:grid;grid-template-columns:repeat(3,1fr);gap:4mm;padding-top:5mm;border-top:1.2px solid var(--gold)}.tbr-cv-foot small{display:block;color:var(--muted);font-size:8.5pt}.tbr-cv-foot b{font-size:12pt}'+
'.tbr-doc{padding:0}@media screen{.tbr-doc{padding:14mm 13mm}.tbr-sec,.tbr-end{margin-top:12mm}}'+
'.tbr-dash{break-after:page}.tbr-sec{break-before:page}'+
'.tbr-sh{display:flex;align-items:center;gap:4mm;margin:0 0 5mm;padding:4mm 5mm;border-radius:4mm;background:linear-gradient(90deg,var(--soft),var(--tint));border-inline-start:2mm solid var(--accent);break-after:avoid}'+
'.tbr-sn{flex:none;width:12mm;height:12mm;border-radius:50%;display:grid;place-items:center;background:var(--accent);color:#fff;font:700 15pt "Reem Kufi","IBM Plex Sans Arabic",sans-serif}.tbr-sn svg{width:6mm;height:6mm}'+
'.tbr-sh div{flex:1}.tbr-sh h2{margin:0;font:700 17pt/1.3 "Reem Kufi","IBM Plex Sans Arabic",sans-serif}.tbr-sh small{display:block;color:var(--ink2);font-size:8.5pt;line-height:1.5}.tbr-sp{font:700 15pt "Reem Kufi","IBM Plex Sans Arabic",sans-serif;color:var(--accent2);text-align:center;font-style:normal}.tbr-sp small{display:block;font:500 7.5pt "IBM Plex Sans Arabic";color:var(--muted)}'+
'.tbr-it{margin:0 0 4.5mm}.tbr-box{border:1px solid var(--line);border-radius:4mm;padding:4mm 4.5mm;background:#fff}.tbr-box.album,.tbr-with,.tbr-hb,.tbr-st,.tbr-cols{break-inside:avoid}.tbr-box h4,.tbr-h4{display:flex;align-items:center;gap:2mm;margin:0 0 3mm;font-size:11.5pt;font-weight:700;color:var(--ink);break-after:avoid}.tbr-box h4 svg{width:4.6mm;height:4.6mm;color:var(--accent)}'+
'.tbr-h4{margin-top:3mm;font-size:10.5pt;color:var(--ink2)}.tbr-p{margin:0}.tbr-note{margin:2.5mm 0 0;color:var(--muted);font-size:8.5pt}.tbr-mu{color:var(--muted)}.tbr-url{direction:ltr;text-align:left;color:var(--accent2);font-size:9pt;word-break:break-all}'+
'.tbr-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(36mm,1fr));gap:3mm;break-inside:avoid}.tbr-kpi{position:relative;padding:3.5mm 4mm;border-radius:4mm;background:var(--tint);border:1px solid var(--line)}.tbr-kpi i{position:absolute;top:3mm;left:3.5mm;color:var(--accent);opacity:.75}.tbr-kpi i svg{width:5mm;height:5mm}.tbr-kpi b{display:block;font:700 18pt/1.2 "Reem Kufi","IBM Plex Sans Arabic",sans-serif;color:var(--accent2)}.tbr-kpi small{color:var(--ink2);font-size:8.5pt}'+
'.tbr-box .tbr-kpis{margin-bottom:3mm}'+
'.tbr-tbl{width:100%;border-collapse:separate;border-spacing:0;font-size:9pt;border:1px solid var(--line);border-radius:3mm;overflow:hidden}.tbr-tbl th{background:var(--accent);color:#fff;font-weight:600;padding:2mm 2.4mm;text-align:start}.tbr-tbl td{padding:1.8mm 2.4mm;border-top:1px solid var(--line);vertical-align:top}.tbr-tbl tbody tr:nth-child(even) td{background:var(--tint)}.tbr-tbl td.n{direction:ltr;text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}.tbr-tbl.compact{font-size:8.3pt}.tbr-tbl tr{break-inside:avoid}'+
'.tbr-chip{display:inline-block;padding:.3mm 2.4mm;margin:.4mm 0 .4mm 1mm;border-radius:99px;font-size:8pt;font-weight:600;background:var(--tint);color:var(--ink2);border:1px solid var(--line);white-space:nowrap}.tbr-chip.on{background:var(--accent);color:#fff;border-color:var(--accent)}.tbr-chip.off{background:#fff;color:var(--muted)}'+
'.tbr-dot{display:inline-block;width:3mm;height:3mm;border-radius:50%;border:1.5px solid var(--muted)}.tbr-dot.on{background:var(--accent);border-color:var(--accent)}'+
'.tbr-with{display:flex;gap:5mm;align-items:flex-start}.tbr-side{flex:none;width:44mm}.tbr-tw{flex:1;min-width:0}.tbr-cap{text-align:center;margin:1mm 0 0;color:var(--muted);font-size:8.5pt}'+
'.tbr-donut{display:flex;flex-direction:column;align-items:center;gap:2.5mm}.tbr-dz{position:relative;width:36mm;height:36mm}.tbr-dz svg{width:100%;height:100%}.tbr-dc{position:absolute;inset:0;display:grid;place-content:center;text-align:center}.tbr-dc b{font:700 15pt/1.1 "Reem Kufi","IBM Plex Sans Arabic",sans-serif;color:var(--ink);direction:ltr}.tbr-dc small{font-size:7pt;color:var(--muted);max-width:22mm;line-height:1.3}'+
'.tbr-lg{list-style:none;margin:0;padding:0;font-size:8.5pt;width:100%}.tbr-lg li{display:flex;align-items:center;gap:2mm;padding:.6mm 0}.tbr-lg li i{flex:none;width:3mm;height:3mm;border-radius:1mm}.tbr-lg li span{flex:1;color:var(--ink2)}.tbr-lg li small{color:var(--muted);font-weight:500}.tbr-lg.row{display:flex;flex-wrap:wrap;gap:1mm 5mm;margin-top:2.5mm}.tbr-lg.row li{padding:0}'+
'.tbr-hb,.tbr-st{display:grid;gap:2.6mm}.tbr-hr,.tbr-sr{display:grid;grid-template-columns:38mm 1fr 16mm;align-items:center;gap:3mm;break-inside:avoid}.tbr-sr{grid-template-columns:30mm 1fr}.tbr-hl b{display:block;font-size:9pt;line-height:1.35}.tbr-hl small{color:var(--muted);font-size:7.5pt}'+
'.tbr-ht{height:4.2mm;border-radius:99px;background:var(--track);overflow:hidden}.tbr-ht i{display:block;height:100%;border-radius:99px;min-width:1mm}.tbr-hv{font-weight:700;font-size:9pt;direction:ltr;text-align:left;font-variant-numeric:tabular-nums}'+
'.tbr-sb{display:flex;height:7mm;border-radius:2mm;overflow:hidden;gap:.5mm;background:#fff}.tbr-sb i{display:grid;place-items:center;font:700 7.5pt "IBM Plex Sans Arabic";font-style:normal;direction:ltr}'+
'.tbr-cols{display:flex;align-items:stretch;gap:2.5mm;height:48mm;padding-top:2mm}.tbr-col{flex:1;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:1mm}.tbr-col i{display:block;width:70%;max-width:12mm;border-radius:1.5mm 1.5mm 0 0;min-height:.6mm}.tbr-cv{font-weight:700;font-size:8.5pt}.tbr-col small{display:block;width:100%;text-align:center;font-size:7.3pt;line-height:1.25;color:var(--muted);padding-top:1mm;border-top:1px solid var(--line);min-height:8mm}'+
'.tbr-ol{margin:0;padding:0 5mm 0 0}.tbr-ol li{padding:.6mm 0}.tbr-ol li::marker{color:var(--accent);font-weight:700}'+
'.tbr-it.half{display:inline-block;width:calc(50% - 2.5mm);vertical-align:top}.tbr-it.half+.tbr-it.half{margin-inline-start:5mm}'+
'.tbr-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:2.5mm}.tbr-cards.dense{grid-template-columns:repeat(4,1fr)}.tbr-card{position:relative;padding:2.6mm 3mm;border-radius:3mm;background:var(--tint);border:1px solid var(--line);break-inside:avoid}.tbr-card.me{background:var(--soft);border-color:var(--accent)}.tbr-card b{display:block;font-size:9.2pt}.tbr-card p{margin:.6mm 0;font-size:8.3pt;color:var(--ink2)}.tbr-card em{position:absolute;top:2mm;left:2.5mm;font-style:normal;font-weight:700;color:var(--accent2)}.tbr-card em small{font-weight:500;color:var(--muted)}.tbr-cards.dense .tbr-chip{font-size:7pt}'+
'.tbr-vision{display:flex;gap:4mm;padding:4.5mm 5mm;border-radius:4mm;background:linear-gradient(135deg,var(--gsoft),#fff);border:1px solid var(--line);border-inline-start:1.5mm solid var(--gold);break-inside:avoid;margin-bottom:4.5mm}.tbr-vision>i svg{width:7mm;height:7mm;color:var(--gold)}.tbr-vision h4{margin:0 0 1mm;font-size:11.5pt}.tbr-vision p{margin:0 0 1.5mm}'+
'.tbr-goals{display:grid;gap:3mm;margin-top:4mm}.tbr-goal{border:1px solid var(--line);border-radius:3mm;overflow:hidden;break-inside:avoid}.tbr-gh{display:flex;gap:3mm;align-items:center;padding:2.5mm 3mm;background:var(--tint)}.tbr-gn{flex:none;width:7mm;height:7mm;border-radius:50%;background:var(--gold);color:#fff;display:grid;place-items:center;font-weight:700}.tbr-gh div{flex:1}.tbr-gh small{display:block;color:var(--muted);font-size:7.8pt}.tbr-gh b{font-size:9.6pt}.tbr-gh em{font-style:normal;font-weight:700;color:var(--accent2);direction:ltr}'+
'.tbr-acts{list-style:none;margin:0;padding:2mm 3mm}.tbr-acts li{display:flex;gap:2.2mm;align-items:flex-start;padding:.7mm 0;font-size:9pt}.tbr-tick{flex:none;width:3.8mm;height:3.8mm;margin-top:.8mm;border-radius:1mm;border:1.3px solid var(--muted);display:grid;place-items:center;font-size:7pt;color:#fff;line-height:1}.tbr-acts li.ok .tbr-tick{background:var(--accent);border-color:var(--accent)}.tbr-acts li.ok{color:var(--ink)}.tbr-acts li:not(.ok){color:var(--ink2)}'+
'.tbr-tl{list-style:none;margin:0;padding:0 5mm 0 0;border-inline-start:1.5px solid var(--line)}.tbr-tl li{position:relative;padding:0 4mm 3mm 0;break-inside:avoid}.tbr-tl li>i{position:absolute;right:-6.6mm;top:1.2mm;width:3.2mm;height:3.2mm;border-radius:50%;background:#fff;border:1.5px solid var(--accent)}.tbr-tl li.ok>i{background:var(--accent)}.tbr-tl small{color:var(--accent2);font-weight:600;font-size:8pt}.tbr-tl b{display:block}.tbr-tl p{margin:.5mm 0;color:var(--ink2);font-size:8.8pt}'+
'.tbr-album{display:grid;grid-template-columns:repeat(4,1fr);gap:3mm}.tbr-album.land{grid-template-columns:repeat(3,1fr)}.tbr-album figure,.tbr-img{margin:0;break-inside:avoid}.tbr-album img{width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:2mm;border:1px solid var(--line)}.tbr-album.land img{aspect-ratio:4/3}.tbr-album figcaption,.tbr-img figcaption{font-size:7.8pt;color:var(--ink2);text-align:center;margin-top:1mm}.tbr-img img{width:100%;max-height:120mm;object-fit:contain;border-radius:2mm}'+
'.tbr-toc{list-style:none;margin:0 0 4mm;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:2mm 5mm}.tbr-toc li{display:flex;align-items:center;gap:3mm;padding:2mm 0;border-bottom:1px dashed var(--line);break-inside:avoid}.tbr-tn{flex:none;width:7mm;height:7mm;border-radius:2mm;background:var(--soft);color:var(--accent2);display:grid;place-items:center;font-weight:700}.tbr-toc div{flex:1;min-width:0}.tbr-toc b{display:block;font-size:9.6pt}.tbr-toc small{display:block;color:var(--muted);font-size:7.4pt;line-height:1.35;overflow:hidden;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical}.tbr-toc em{font-style:normal;font-weight:700;color:var(--accent2);font-size:9pt}'+
'.tbr-todo{background:var(--tint)}'+
'.tbr-end{break-inside:avoid;margin-top:10mm;padding-top:6mm;border-top:1.2px solid var(--gold)}.tbr-signs{display:grid;grid-template-columns:repeat(auto-fit,minmax(50mm,1fr));gap:8mm}.tbr-signs div{text-align:center}.tbr-signs small{display:block;color:var(--muted)}.tbr-signs b{display:block;min-height:6mm;font-size:11pt}.tbr-signs span{display:block;margin-top:12mm;padding-top:1.5mm;border-top:1px dotted var(--muted);color:var(--muted);font-size:8pt}.tbr-foot{text-align:center;color:var(--ink2);font-size:8.5pt;margin:8mm 0 0}.tbr-foot.sm{color:var(--muted);font-size:7.5pt;margin-top:1.5mm}'+
'@media print{html.tbr-on,html.tbr-on body{background:#fff!important;margin:0!important;padding:0!important;height:auto!important;overflow:visible!important}html.tbr-on body>*:not(#tbReport){display:none!important}#tbReport{position:static;overflow:visible;background:#fff}.tbr-bar{display:none!important}.tbr-paper{margin:0;max-width:none;box-shadow:none}}'+
'@media screen and (max-width:820px){.tbr-paper{margin:0;zoom:.55}}';}

/* ---------- فتح المعاينة والطباعة ---------- */
function ready(root){var imgs=[].slice.call(root.querySelectorAll('img'));return Promise.all([document.fonts?document.fonts.ready:0].concat(imgs.map(function(i){return i.complete?0:new Promise(function(r){i.onload=i.onerror=r;});})));}
function open(opts){opts=opts||{};var st=opts.state||(window.PF&&window.PF.state&&window.PF.state());if(!st){alert('لا توجد بيانات للمنصة');return null;}
  close();var b=build(st,opts),el=document.createElement('div');el.id='tbReport';el.setAttribute('role','dialog');el.setAttribute('aria-label','سجل الأعمال');
  el.innerHTML='<style>'+css(b.pal,b.running)+'</style>'+(opts.bare?'':'<div class="tbr-bar"><b>'+ic('folder')+' معاينة السجل</b><div class="tbr-btns"><button type="button" data-tbr="print">'+ic('download')+'حفظ PDF / طباعة</button><button type="button" class="g" data-tbr="close">إغلاق</button></div></div>')+'<div class="tbr-paper">'+b.html+'</div>';
  document.body.appendChild(el);document.documentElement.classList.add('tbr-on');
  var oldT=document.title;
  el.addEventListener('click',function(e){var a=e.target.closest('[data-tbr]');if(!a)return;if(a.dataset.tbr==='close')close();else{document.title=(st.teacher&&st.teacher.name?'سجل الأعمال - '+st.teacher.name:'سجل الأعمال');ready(el).then(function(){window.print();setTimeout(function(){document.title=oldT;},800);});}});
  if(!opts.bare)document.addEventListener('keydown',escClose);
  TB.report._ready=ready(el);return el;}
function escClose(e){if(e.key==='Escape')close();}
function close(){var o=document.getElementById('tbReport');if(o)o.remove();document.documentElement.classList.remove('tbr-on');document.removeEventListener('keydown',escClose);}

TB.report={open:open,close:close,html:function(st,o){return build(st,o).html;},types:{},base:T,palette:palette,version:'1.0'};
})();
