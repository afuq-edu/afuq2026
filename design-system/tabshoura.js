/* =====================================================================
   طبشورة · محرك الثيمات والتفاعل  (v1.0)
   - ثيمات بصيغة «وِرد»: 18 لونًا للفاتح ومثلها للداكن (SKK)
   - مشهد مدرسي SVG خلف الواجهة + ثيمات حيّة على canvas تتفاعل مع اللمس
   - احتفال (قصاصات ونجوم)، إشعارات، ورقة سفلية، اختبار تفاعلي، استوديو المظهر
   كل شيء متاح عبر window.TB
   ===================================================================== */
(function(){
'use strict';
var root=document.documentElement;
var RMQ=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var DMQ=window.matchMedia&&matchMedia('(prefers-color-scheme: dark)');
var hostTheme=root.getAttribute('data-theme'); // set by an embedding host, if any

/* ---------- icons (24px stroke) ---------- */
function ic(d,extra){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"'+(extra||'')+'>'+d+'</svg>';}
var I={
  check:ic('<path d="M5 12.5l4.2 4.2L19 7"/>'),
  x:ic('<path d="M6 6l12 12M18 6L6 18"/>'),
  star:ic('<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>'),
  sun:ic('<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4"/>'),
  moon:ic('<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>'),
  auto:ic('<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17A8.5 8.5 0 0 0 12 3.5z" fill="currentColor"/>'),
  palette:ic('<path d="M12 3a9 9 0 1 0 0 18c1.2 0 1.8-.8 1.8-1.7 0-1.2-1-1.6-1-2.6 0-1 .8-1.7 1.8-1.7H17a4 4 0 0 0 4-4C21 6.6 17 3 12 3z"/><circle cx="7.5" cy="11" r="1.2" fill="currentColor"/><circle cx="10.5" cy="7.2" r="1.2" fill="currentColor"/><circle cx="15" cy="7.5" r="1.2" fill="currentColor"/>'),
  book:ic('<path d="M3 5.5C5.5 4 8.5 4 12 6c3.5-2 6.5-2 9-.5V19c-2.5-1.4-5.5-1.4-9 .5-3.5-1.9-6.5-1.9-9-.5z"/><path d="M12 6v13.5"/>'),
  home:ic('<path d="M3.5 11L12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5h4v5"/>'),
  user:ic('<circle cx="12" cy="8" r="4"/><path d="M4 20.5c1.4-3.8 4.4-5.5 8-5.5s6.6 1.7 8 5.5"/>'),
  users:ic('<circle cx="9" cy="8.5" r="3.5"/><path d="M2.5 19.5c1-3.2 3.4-4.8 6.5-4.8s5.5 1.6 6.5 4.8"/><path d="M16 5.2a3.4 3.4 0 0 1 0 6.6M18 14.9c1.8.7 3 2.2 3.5 4.6"/>'),
  chart:ic('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'),
  quiz:ic('<rect x="4" y="3.5" width="16" height="17" rx="3"/><path d="M9.2 9.2a2.8 2.8 0 1 1 3.9 2.6c-.7.3-1.1.9-1.1 1.6v.4"/><circle cx="12" cy="16.8" r=".6" fill="currentColor"/>'),
  task:ic('<rect x="5" y="4" width="14" height="17" rx="2.5"/><path d="M9 4V2.8h6V4M8.5 11l2 2 4-4M8.5 17h7"/>'),
  clock:ic('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
  cal:ic('<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>'),
  play:ic('<path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/>'),
  bell:ic('<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>'),
  search:ic('<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>'),
  chev:ic('<path d="M6 9l6 6 6-6"/>'),
  back:ic('<path d="M9 6l6 6-6 6"/>'),
  next:ic('<path d="M15 6l-6 6 6 6"/>'),
  spark:ic('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/>'),
  bolt:ic('<path d="M13 2.5L5 13.5h6l-1 8 8-11h-6z"/>'),
  award:ic('<circle cx="12" cy="9" r="5.5"/><path d="M8.5 13.5L7 21l5-2.5 5 2.5-1.5-7.5"/>'),
  pencil:ic('<path d="M4 20l1-4.5L15.5 5a2.1 2.1 0 0 1 3 3L8 18.5z"/><path d="M13.5 7l3 3"/>'),
  chalk:ic('<path d="M4 20h16"/><rect x="6" y="3.5" width="12" height="11" rx="1.5"/><path d="M9 8h4M9 11h6"/>'),
  flask:ic('<path d="M9.5 3.5h5M10.5 3.5v5.2L5 18.5a1.8 1.8 0 0 0 1.6 2.5h10.8a1.8 1.8 0 0 0 1.6-2.5l-5.5-9.8V3.5"/><path d="M7.5 14.5h9"/>'),
  globe:ic('<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.6 3.5 5.4 3.5 8.5s-1 5.9-3.5 8.5c-2.5-2.6-3.5-5.4-3.5-8.5s1-5.9 3.5-8.5z"/>'),
  calc:ic('<rect x="5" y="3" width="14" height="18" rx="2.5"/><path d="M8 7.5h8M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 16h.01M12 16h.01M15.5 16h.01" stroke-width="2.4"/>'),
  quran:ic('<path d="M12 6.5C9.5 4.8 6.5 4.5 3.5 5.5v13c3-1 6-.7 8.5 1 2.5-1.7 5.5-2 8.5-1v-13c-3-1-6-.7-8.5 1z"/><path d="M12 6.5v13M7 9.5c1-.2 2-.1 3 .3M14 9.8c1-.4 2-.5 3-.3"/>'),
  atom:ic('<circle cx="12" cy="12" r="1.6" fill="currentColor"/><ellipse cx="12" cy="12" rx="9" ry="3.6"/><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(-60 12 12)"/>'),
  lang:ic('<path d="M4 6h9M8.5 4v2c0 4-2 7-4.5 8.5M6 10c1.2 2 3 3.5 5 4.2"/><path d="M13 20l3.5-8 3.5 8M14.2 17.3h4.6"/>'),
  plane:ic('<path d="M21 3.5L3 11l6.5 2.5L12 20l3-6z"/><path d="M9.5 13.5L21 3.5"/>'),
  heart:ic('<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z"/>'),
  msg:ic('<path d="M4 5.5h16v10.5H9l-5 4z"/>'),
  plus:ic('<path d="M12 5v14M5 12h14"/>'),
  upload:ic('<path d="M12 16V4.5M7 9l5-5 5 5M4.5 19.5h15"/>'),
  reset:ic('<path d="M4 12a8 8 0 1 0 2.4-5.7L4 8.5"/><path d="M4 4v4.5h4.5"/>'),
  menu:ic('<path d="M4 7h16M4 12h16M4 17h16"/>'),
  logo:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 6.5h15v9h-15z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/><path d="M8 19.5l4-4 4 4" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/><path d="M7.5 12.2c1.6-2.4 3-2.4 4.5 0s3 2.4 4.5 0" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>'
};

/* ---------- skins: same 18-slot format as «وِرد» ---------- */
var SKK=['sky1','sky2','sky3','sun','sil','sil2','water','pillar','ink','ink2','muted','accent','accent2','accent-soft','track','gold','c1','c2'];
var SKINS={
 sabboura:{n:'سبّورة',d:'أخضر السبّورة وطباشير دافئ',who:'m',
  L:['#D3E6DC','#ECF4EF','#F5EFDF','#FFE7B0','#93BBA6','#BFD8CA','#DCEBE2','#F4FAF6','#10291F','#3E5E50','#6F8C7F','#2F7A5B','#1E5C43','#D6EBDF','#D7E7DE','#C2913A','#2F7A5B','#3D6FA3'],
  D:['#07170F','#0F2419','#1E3A2B','#F3E3B0','#1E4A35','#163A29','#0B1F15','#133022','#EAF5EE','#B3D2C1','#81A594','#7FD1A8','#5BB88B','rgba(127,209,168,.16)','rgba(255,255,255,.1)','#EBCB80','#7FD1A8','#8DB8E8'],g:'12,36,25',g2:'16,46,32'},
 royal:{n:'ملكي',d:'كحلي وذهبي',who:'m',
  L:['#D8DCEA','#EEF0F6','#F5EBD8','#FFE2A8','#9FA8C6','#C6CCE0','#E0E4EF','#F7F8FC','#141B3A','#454E75','#7880A0','#24357A','#17235A','#DDE1F0','#DDE0EC','#B8862B','#24357A','#B8862B'],
  D:['#05081A','#0D1330','#2A2540','#F5D27E','#222B55','#182046','#080C22','#141B3E','#F2EFE4','#CFC7AE','#9890A0','#D9AE52','#B0852E','rgba(217,174,82,.15)','rgba(255,255,255,.1)','#E2B65A','#E2B65A','#8EA2F0'],g:'14,20,50',g2:'18,26,62'},
 sky:{n:'سماء الفجر',d:'أزرق سماوي هادئ',
  L:['#CFE0F3','#E9F1FA','#F8EEE4','#FFE9C8','#9DB6D3','#C3D4E7','#DCE8F4','#F4F8FC','#13284A','#4B5F80','#7D8DA8','#3D6FA3','#2C5786','#DCE8F5','#DCE6F1','#C29A4E','#3F928B','#3D6FA3'],
  D:['#0A1630','#13284A','#2A3558','#F3D9A0','#2E4670','#20365C','#11244A','#1A2F55','#EAF1FB','#B6C5DC','#8597B3','#7FB0E3','#5E93CC','rgba(127,176,227,.16)','rgba(255,255,255,.1)','#E6C27A','#6CC4BC','#7FB0E3'],g:'16,32,62',g2:'20,40,76'},
 oasis:{n:'واحة',d:'أخضر زمردي ورمل',
  L:['#CFE8E0','#EAF5F0','#F7EEDB','#FFE7B8','#8DBFAE','#BBDACD','#D6ECE4','#F3FAF6','#0F2E27','#3F6158','#6F8C84','#2E8B73','#1F6E5A','#D5EDE5','#D6E8E1','#C08A3E','#2E8B73','#3B7EA1'],
  D:['#061E1A','#0D3029','#22433A','#F1D08C','#1F5246','#173F36','#0B2A24','#12382F','#E6F5EF','#A9CFC3','#7FA79B','#5FCFAE','#3FB394','rgba(95,207,174,.16)','rgba(255,255,255,.1)','#E8C37A','#5FCFAE','#7DBBE0'],g:'10,40,34',g2:'14,50,42'},
 ocean:{n:'بحر',d:'فيروزي ومائي',
  L:['#C9E8F0','#E6F5F8','#E8F1EC','#FFF0C8','#8EC0CF','#BCDDE6','#CFE9EF','#F2FAFC','#0C2D3A','#3D6270','#6E909C','#1F8AA6','#146C85','#D3ECF2','#D5E8EE','#C29A4E','#1F9A8A','#1F6FB0'],
  D:['#031821','#082C3A','#144556','#E8E0B0','#18536A','#0F3F52','#04222E','#0E3646','#E4F6FB','#A6D2DE','#78A6B3','#4FC6E3','#2EA9C8','rgba(79,198,227,.16)','rgba(255,255,255,.1)','#E6C27A','#52D6C2','#6FB7F0'],g:'6,38,50',g2:'10,46,60'},
 desert:{n:'صحراء',d:'رمل وطين دافئ',who:'m',
  L:['#F1DFC6','#F8EFE2','#F6DCC0','#FFD8A0','#CDA982','#E2CBAE','#EFE0CC','#FCF6EE','#3B2614','#6E5338','#9C8468','#B5652F','#934E20','#F4E1CF','#EBDCC9','#B98A2E','#6F8F4E','#B5652F'],
  D:['#1C120A','#2E1F12','#4A3220','#F2C58A','#5C412A','#46301E','#24180E','#3A2818','#F8EEE2','#DCC6AC','#A99178','#E7A06A','#D08450','rgba(231,160,106,.16)','rgba(255,255,255,.1)','#F0C878','#A8C985','#E7A06A'],g:'44,30,18',g2:'54,38,22'},
 ink:{n:'حبر',d:'رمادي بسيط مع ذهبي',
  L:['#E4E6EA','#F3F4F6','#EFEDE8','#FFF3DA','#B4B9C2','#D3D6DC','#E8EAED','#FAFAFB','#1A1D23','#4A505B','#7E848F','#3A414D','#22272F','#E3E5E9','#E1E3E7','#B48A3C','#3A414D','#8A6430'],
  D:['#0B0C0F','#15171B','#24262B','#E6D2A6','#2E3138','#22252B','#101215','#1E2025','#F1F2F4','#B9BDC5','#868B95','#8E97A8','#6B7486','rgba(217,220,226,.12)','rgba(255,255,255,.1)','#E6C27A','#C9CDD5','#E6C27A'],g:'24,26,30',g2:'30,32,37'},
 jouri:{n:'جوري',d:'وردي جوري وذهبي',who:'f',
  L:['#F3D6DE','#FBEEF1','#FBE7DA','#FFDDB5','#D5A3B2','#E9C7D0','#F6DFE5','#FFF7F9','#3A1626','#6E4357','#9C7686','#B84A72','#963558','#F7DCE6','#F1DDE3','#C4913F','#B84A72','#7A62B8'],
  D:['#1C0A14','#2E1322','#47243A','#F6C8A0','#5A2A42','#431F33','#26101D','#381A2C','#FCEAF0','#E3B8C8','#B08898','#F28DB2','#DC6F98','rgba(242,141,178,.16)','rgba(255,255,255,.1)','#F0C682','#F28DB2','#B9A2F0'],g:'44,18,32',g2:'54,24,40'},
 sunset:{n:'غروب',d:'وردي ومشمشي دافئ',who:'f',
  L:['#F6D5CF','#FBEAE4','#FCE3C9','#FFD9A8','#D7A6A6','#EBC8C4','#F5DCD6','#FFF6F3','#3A1C24','#6E4650','#9A7880','#C0566B','#9E3E53','#F7DDE2','#F0DCDD','#C98A3C','#B5614F','#8E5BA8'],
  D:['#1E0E1A','#33182A','#4F2A35','#F4B98A','#5A2F45','#432238','#2A1222','#3A1D31','#FBEAEE','#E0B9C3','#B08A96','#F08CA0','#D96E85','rgba(240,140,160,.16)','rgba(255,255,255,.1)','#F0C27A','#F0A58E','#C69BE0'],g:'46,20,36',g2:'56,26,44'},
 lilac:{n:'ليلك',d:'بنفسجي ناعم',who:'f',
  L:['#DCD6F2','#EFECFA','#F6EAF2','#FBE3F0','#A9A0D3','#CBC5E8','#E3DFF5','#F8F6FE','#221B47','#554D80','#8580A8','#6B5BC4','#5143A6','#E3DFF7','#E0DCF2','#C29A4E','#4E9D96','#6B5BC4'],
  D:['#100C2A','#1D1745','#34295A','#E9C9F0','#3A3270','#2A2458','#161236','#251F50','#EEEBFC','#C1BAE8','#908AB8','#A99BF2','#8C7CE0','rgba(169,155,242,.16)','rgba(255,255,255,.1)','#E6C27A','#7FD3C9','#A99BF2'],g:'28,22,66',g2:'34,28,78'},
 /* ---- live skins ---- */
 rain:{fx:1,n:'مطر',d:'مطر هادئ تتغيّر استجابته مع كل لمسة',i:'المس: تموّج، برق، مظلّة، قوس قزح',
  L:['#C7D0DA','#E3E8EE','#E9ECEF','#F2F2E8','#97A6B6','#BAC6D2','#D5DDE6','#F3F6F9','#18222E','#475566','#7A8796','#4A6B8A','#34516E','#DCE5EE','#D9E0E8','#B99550','#3E8A84','#4A6B8A'],
  D:['#0B1118','#16212C','#24313E','#C9D4DF','#2A3A4A','#1F2D3A','#0F1820','#1C2934','#E6EDF4','#AFBDCB','#7E8D9C','#8CB4D8','#6A96BF','rgba(140,180,216,.16)','rgba(255,255,255,.1)','#E0C07C','#7CC9C0','#8CB4D8'],g:'16,26,36',g2:'22,34,46'},
 snow:{fx:1,n:'ثلج',d:'ندف تتساقط وتتراكم، وتتطاير مع حركة إصبعك',i:'المس: انفجار ندف، بلّورة، عاصفة، صقيع',
  L:['#DCE9F5','#F2F7FC','#FAFCFF','#FFFFFF','#B5C8DC','#D4E1EE','#E8F0F8','#FFFFFF','#14263C','#46607C','#7F93AA','#3B7BB8','#2A5F94','#DDEBF7','#DFE8F1','#B8964F','#3C9AA0','#3B7BB8'],
  D:['#0A1424','#142238','#22344E','#E6F0FA','#2C4466','#203654','#0E1A2C','#1A2C46','#EEF5FC','#B8CCE2','#8398B2','#9CC8F0','#78AEE0','rgba(156,200,240,.16)','rgba(255,255,255,.1)','#E6C98A','#8AD8DA','#9CC8F0'],g:'14,26,46',g2:'20,34,58'},
 autumn:{fx:1,n:'الخريف',d:'أوراق ملوّنة تتساقط وتتكوّم على الأرض',i:'المس: بعثرة، دوّامة، زخّة أوراق، ورقة ذهبية',
  L:['#F2DCC0','#F9EEDF','#F5D9B8','#FFD49A','#C99A6E','#E0C2A0','#EEDCC4','#FCF5EC','#3A2312','#6E4A2C','#9C7A5C','#C0632A','#9A4A1A','#F5E0CC','#ECDCC8','#C79A2E','#7A8F3A','#C0632A'],
  D:['#1A0F08','#2C1A0E','#46291A','#F0B070','#5E3A22','#482C18','#22140A','#3A2414','#F8ECDF','#DEC2A6','#AA8C70','#F0965A','#D97A40','rgba(240,150,90,.16)','rgba(255,255,255,.1)','#F0C060','#B5C870','#F0965A'],g:'42,26,14',g2:'52,32,18'},
 spring:{fx:1,n:'الربيع',d:'بتلات وردية وفراشات تحوم حولك',i:'المس: زهرة تتفتّح، فراشات، بتلات، نداء الفراشات',who:'f',
  L:['#DDF0E0','#F1F8F1','#FCEEF0','#FFF0C2','#A6CDAE','#CDE5D1','#E3F2E5','#F8FCF8','#17301E','#46634E','#7A9481','#4C9A5E','#357A46','#DDF0E1','#DDEADF','#C9963F','#4C9A5E','#D0668C'],
  D:['#0B1A10','#13261A','#2A2430','#F6D9E4','#24452E','#1B3824','#0F2015','#183020','#EEF7EF','#BCD7C2','#88A690','#8FD6A0','#6CC083','rgba(143,214,160,.16)','rgba(255,255,255,.1)','#F0C680','#8FD6A0','#F29ABA'],g:'14,34,20',g2:'18,44,26'},
 galaxy:{fx:1,night:1,ga:.4,n:'المجرّة',d:'مجرّة حلزونية في سماء ليلية دائمًا',i:'المس المجرّة لتضيء وتدور، والسماء لتضيء النجوم',
  L:['#D8D2F0','#ECE8FA','#F4E8F4','#FBE6F6','#A79CD6','#CBC3EA','#E2DCF6','#F8F6FE','#1E1846','#4E4682','#8580B0','#6A4FC8','#5038A8','#E4DEF8','#E0DBF2','#C29A4E','#3F9EA8','#6A4FC8'],
  D:['#04030E','#0B0A24','#1C1440','#E8D8FF','#2A2060','#1C1648','#060518','#140F36','#F0EDFF','#C4BCEC','#8E88BC','#B39CFF','#9378F0','rgba(179,156,255,.16)','rgba(255,255,255,.1)','#F2CF7A','#7FE0E8','#B39CFF'],g:'14,10,40',g2:'20,16,54'},
 chalk:{fx:1,n:'طباشير',d:'غبار طباشير يتطاير، واكتب بإصبعك على الخلفية',i:'اسحب لتكتب بالطباشير',
  L:['#D6E2DC','#EEF3F0','#F3F0E6','#FFF1C8','#9DB5A9','#C5D6CD','#DFE9E3','#F6FAF8','#14261E','#435B50','#758A80','#3A7560','#275845','#DAE9E1','#DAE5DF','#BF9443','#3A7560','#4A72A0'],
  D:['#0C1A15','#15271F','#22382E','#EFEBD8','#284438','#1E362C','#101F19','#1A3028','#EEF4F0','#BCD0C6','#889E94','#9FD9BE','#7CC3A3','rgba(159,217,190,.15)','rgba(255,255,255,.1)','#EED28E','#9FD9BE','#9CC0EA'],g:'16,32,26',g2:'20,40,32'},
 planes:{fx:1,n:'طائرات ورقية',d:'طائرات ورقية تحلّق، وتنطلق أسرابًا عند الإنجاز',i:'المس لتطلق طائرة',
  L:['#C8E2F5','#E8F3FB','#FDF0E0','#FFE2AE','#94B9D6','#BED6EA','#D9EAF6','#F4FAFE','#102A44','#42607E','#7690AA','#2F78B7','#1F5D94','#D6E8F6','#D9E6F1','#D98A2B','#2F78B7','#D9662B'],
  D:['#071426','#0F2440','#23385A','#F5D49A','#234870','#1A385A','#0B1C34','#15304F','#EAF3FC','#B3CAE2','#8299B4','#7DB9EE','#589DDA','rgba(125,185,238,.16)','rgba(255,255,255,.1)','#F2B866','#7DB9EE','#F29A66'],g:'12,30,54',g2:'16,38,66'},
 bubbles:{fx:1,n:'فقاعات المختبر',d:'فقاعات تصعد من أنابيب المختبر',i:'المس الفقاعة لتفرقعها',
  L:['#D2ECEA','#EDF7F6','#F2F4EA','#FFF6D8','#9CC6C2','#C2DEDB','#DDEFEE','#F4FBFA','#0F2C2E','#3E6466','#729496','#2F8F8C','#20706E','#D6EEEC','#D6E8E7','#BE9A4C','#2F8F8C','#3D79A8'],
  D:['#071A1C','#0E2A2E','#1C3E42','#DDEFD8','#1F4E50','#163E42','#0A2224','#143436','#E6F6F5','#A8D2D0','#7AA8A6','#6CD6CF','#48BDB6','rgba(108,214,207,.16)','rgba(255,255,255,.1)','#E6C77E','#6CD6CF','#86BCEB'],g:'8,36,38',g2:'12,46,48'}
};

function skinCSS(){var out='';Object.keys(SKINS).forEach(function(id){var k=SKINS[id];
  function blk(a){return SKK.map(function(n,i){return '--'+n+':'+a[i];}).join(';');}
  out+=':root[data-skin="'+id+'"]{'+blk(k.L)+'}\n';
  out+=':root[data-skin="'+id+'"][data-theme="dark"]{'+blk(k.D)+';--glass:rgba('+k.g+','+(k.ga||.62)+');--glass2:rgba('+k.g2+',.88)}\n';});
  return out;}
(function(){var st=document.createElement('style');st.id='tbSkins';st.textContent=skinCSS();document.head.appendChild(st);})();

/* ---------- preferences ---------- */
var KEY='tabshoura:prefs';
/* default edge-light per skin: sweep = a light streak passes over surfaces, edge = light runs around the rim,
   follow = the rim lights up near the pointer */
var SHINE={sabboura:'sweep',royal:'edge',sky:'sweep',oasis:'sweep',ocean:'follow',desert:'sweep',ink:'follow',jouri:'edge',sunset:'edge',lilac:'edge',
  rain:'follow',snow:'sweep',autumn:'sweep',spring:'edge',galaxy:'edge',chalk:'follow',planes:'sweep',bubbles:'follow'};
function shineNow(){return P.shine&&P.shine!=='auto'?P.shine:(SHINE[P.skin]||'sweep');}
var DEF={skin:'sabboura',mode:'auto',scene:'full',cards:'glass',corners:'soft',ffam:'plex',font:'m',motion:true,amb:true,shine:'auto'};
if(root.dataset.skinDefault)DEF.skin=root.dataset.skinDefault; // <html data-skin-default="jouri">
var P=Object.assign({},DEF);
try{Object.assign(P,JSON.parse(localStorage.getItem(KEY)||'{}'));}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(P));}catch(e){}}
function isDark(){if(SKINS[P.skin]&&SKINS[P.skin].night)return true;if(P.mode==='dark')return true;if(P.mode==='light')return false;if(hostTheme)return hostTheme==='dark';return !!(DMQ&&DMQ.matches);}

function apply(){
  if(!SKINS[P.skin])P.skin=DEF.skin;
  root.setAttribute('data-skin',P.skin);
  root.setAttribute('data-theme',isDark()?'dark':'light');
  root.setAttribute('data-scene',P.scene);root.setAttribute('data-cards',P.cards);root.setAttribute('data-corners',P.corners);
  root.setAttribute('data-ffam',P.ffam);root.setAttribute('data-shine',shineNow());root.setAttribute('data-font',P.font);root.setAttribute('data-motion',P.motion?'on':'off');
  var tc=document.querySelector('meta[name=theme-color]');if(tc)tc.setAttribute('content',getComputedStyle(root).getPropertyValue('--sky2').trim());
  AMB.set(SKINS[P.skin].fx&&P.amb?P.skin:null);
  document.dispatchEvent(new CustomEvent('tb:theme',{detail:Object.assign({},P,{dark:isDark()})}));
}
function set(k,v){P[k]=v;save();apply();}
if(DMQ&&DMQ.addEventListener)DMQ.addEventListener('change',function(){if(P.mode==='auto'&&!hostTheme)apply();});

/* ---------- school scene (SVG behind the app) ---------- */
var SCENE='<svg viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice"><defs>'+
 '<linearGradient id="tbSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--sky1)"/><stop offset=".55" style="stop-color:var(--sky2)"/><stop offset=".7" style="stop-color:var(--sky3)"/><stop offset="1" style="stop-color:var(--water)"/></linearGradient>'+
 '<radialGradient id="tbSun"><stop offset="0" style="stop-color:var(--sun)"/><stop offset=".4" style="stop-color:var(--sun)" stop-opacity=".55"/><stop offset="1" style="stop-color:var(--sun)" stop-opacity="0"/></radialGradient>'+
 '<linearGradient id="tbGnd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--sky3)" stop-opacity=".9"/><stop offset="1" style="stop-color:var(--water)"/></linearGradient>'+
 '<linearGradient id="tbPil" x1="0" y1="0" x2="1" y2="0"><stop offset="0" style="stop-color:var(--pillar)" stop-opacity=".95"/><stop offset="1" style="stop-color:var(--pillar)" stop-opacity=".5"/></linearGradient></defs>'+
 '<rect width="1200" height="900" fill="url(#tbSky)"/>'+
 '<g>'+[[80,90],[210,170],[330,60],[460,130],[560,40],[690,110],[820,70],[930,160],[1050,80],[1140,140],[620,220],[380,240]].map(function(p,i){return '<circle class="star'+(i%2?' tw':'')+'" cx="'+p[0]+'" cy="'+p[1]+'" r="'+(1+(i%3)*.4)+'" style="animation-delay:'+(i*.4)+'s"/>';}).join('')+'</g>'+
 '<circle class="sunorb" cx="505" cy="560" r="170" fill="url(#tbSun)"/><circle cx="505" cy="560" r="28" style="fill:var(--sun)" opacity=".9"/>'+
 '<g class="cloud" opacity=".55" style="fill:var(--pillar)"><ellipse cx="300" cy="230" rx="70" ry="18"/><ellipse cx="340" cy="218" rx="40" ry="20"/><ellipse cx="880" cy="180" rx="90" ry="20"/><ellipse cx="920" cy="166" rx="46" ry="22"/><ellipse cx="1280" cy="260" rx="80" ry="18"/></g>'+
 '<g class="mist" opacity=".55" style="fill:var(--sil2)"><path d="M0 610 Q120 570 260 592 T540 584 T820 590 T1200 578 V660 H0 Z"/></g>'+
 // school: wings, main block, tower with clock, arched windows, flag
 '<g class="mist" opacity=".7" style="fill:var(--sil)">'+
   '<rect x="560" y="560" width="84" height="84" rx="4"/><rect x="876" y="560" width="84" height="84" rx="4"/>'+
   '<rect x="636" y="515" width="248" height="129" rx="5"/><path d="M630 518 H890 L870 500 H650 Z"/>'+
   '<rect x="728" y="448" width="64" height="70" rx="4"/><path d="M722 452 H798 L760 418 Z"/>'+
   '<rect x="758" y="352" width="3.5" height="70"/>'+
   '<rect x="434" y="560" width="10" height="84" rx="3"/><circle cx="439" cy="540" r="34"/><circle cx="414" cy="560" r="24"/><circle cx="464" cy="562" r="24"/>'+
 '</g>'+
 '<path class="flag" d="M761.5 354 h34 l-7 9 l7 9 h-34 z" style="fill:var(--gold)" opacity=".85"/>'+
 '<g style="fill:var(--pillar)" opacity=".55"><circle cx="760" cy="482" r="15"/>'+
   [664,712,808,856].map(function(x){return '<path d="M'+x+' 600 v-34 q12 -18 24 0 v34 z"/>';}).join('')+
   '<path d="M748 644 v-40 q12 -16 24 0 v40 z"/>'+[580,608,896,924].map(function(x){return '<path d="M'+x+' 625 v-26 q8 -12 16 0 v26 z"/>';}).join('')+
 '</g><path d="M760 471 V482 L768 487" stroke="var(--sil)" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/>'+
 // palms at far sides
 '<g class="mist" opacity=".45" style="stroke:var(--sil);fill:none" stroke-width="5" stroke-linecap="round"><path d="M150 650 Q156 560 146 480"/><path d="M1060 650 Q1052 570 1064 492"/></g>'+
 '<g class="mist" opacity=".45" style="fill:var(--sil)"><path d="M146 482 q-34 4 -52 24 q24 -12 52 -18 z M146 482 q34 0 52 22 q-24 -9 -52 -16 z M146 482 q-14 -22 -40 -28 q22 13 40 33 z M146 482 q18 -24 44 -26 q-24 11 -44 31 z"/><path d="M1064 494 q-34 4 -52 24 q24 -12 52 -18 z M1064 494 q34 0 52 22 q-24 -9 -52 -16 z M1064 494 q-14 -22 -40 -28 q22 13 40 33 z M1064 494 q18 -24 44 -26 q-24 11 -44 31 z"/></g>'+
 '<rect y="640" width="1200" height="260" fill="url(#tbGnd)"/>'+
 // playground lines
 '<g class="mist" opacity=".5" style="stroke:var(--pillar)" stroke-width="2" stroke-linecap="round" fill="none"><path d="M560 690 H960"/><path d="M520 720 Q760 740 1000 720"/><path d="M200 770 H380"/><path d="M820 800 H1000"/><path d="M90 700 H260"/></g>'+
 // classroom-window frame at the sides
 '<g class="frame" opacity=".8"><rect x="-10" y="140" width="40" height="760" fill="url(#tbPil)"/><path d="M-10 140 Q80 40 190 0 V-20 H-10 Z" style="fill:var(--pillar)" opacity=".5"/>'+
 '<rect x="1170" y="170" width="40" height="730" fill="url(#tbPil)"/><path d="M1210 170 Q1120 70 1010 0 V-20 H1210 Z" style="fill:var(--pillar)" opacity=".4"/></g></svg>';

function mountScene(){
  if(document.body.hasAttribute('data-no-scene'))return;
  if(!document.getElementById('scene')){var d=document.createElement('div');d.id='scene';d.setAttribute('aria-hidden','true');d.innerHTML=SCENE;document.body.prepend(d);}
  ['amb','fx'].forEach(function(id){if(!document.getElementById(id)){var c=document.createElement('canvas');c.id=id;c.setAttribute('aria-hidden','true');document.body.appendChild(c);}});
  if(!document.querySelector('.toast')){var t=document.createElement('div');t.className='toast';t.setAttribute('aria-live','polite');document.body.appendChild(t);}
}

/* mini preview of a skin (used by the theme studio) */
function skinPrev(id,dark){var k=SKINS[id],a=dark?k.D:k.L,c=function(n){return a[SKK.indexOf(n)];};
  return '<svg viewBox="0 0 120 92" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="sp'+id+(dark?'d':'')+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+c('sky1')+'"/><stop offset=".6" stop-color="'+c('sky2')+'"/><stop offset="1" stop-color="'+c('sky3')+'"/></linearGradient></defs>'+
  '<rect width="120" height="92" fill="url(#sp'+id+(dark?'d':'')+')"/><circle cx="34" cy="56" r="16" fill="'+c('sun')+'" opacity=".55"/>'+
  '<g fill="'+c('sil')+'" opacity=".65"><rect x="58" y="50" width="40" height="20" rx="1"/><rect x="72" y="40" width="12" height="11"/><path d="M71 41h14l-7-6z"/><rect x="77.6" y="24" width=".9" height="12"/><circle cx="46" cy="58" r="6"/><rect x="45" y="60" width="2" height="10"/></g>'+
  '<path d="M78.5 24.5h7l-1.5 2 1.5 2h-7z" fill="'+c('gold')+'"/>'+
  '<rect y="68" width="120" height="24" fill="'+c('water')+'"/>'+fxPrev(id,dark,c)+
  '<rect x="14" y="12" width="44" height="22" rx="6" fill="'+(dark?'rgba(255,255,255,.08)':'rgba(255,255,255,.8)')+'"/><rect x="19" y="18" width="22" height="3" rx="1.5" fill="'+c('ink')+'" opacity=".7"/><rect x="19" y="24" width="30" height="3" rx="1.5" fill="'+c('track')+'"/><rect x="19" y="24" width="18" height="3" rx="1.5" fill="'+c('accent')+'"/>'+
  '<rect x="30" y="76" width="60" height="10" rx="5" fill="'+c('accent2')+'"/></svg>';}
function fxPrev(id,dark,c){var s='',i,r=seeded(id.length*97+id.charCodeAt(0));
  function dots(n,fill,op,maxY){for(var k=0;k<n;k++)s+='<circle cx="'+(r()*120).toFixed(1)+'" cy="'+(r()*(maxY||70)).toFixed(1)+'" r="'+(.4+r()*.9).toFixed(1)+'" fill="'+fill+'" opacity="'+op+'"/>';}
  if(id==='rain'){for(i=0;i<22;i++){var x=r()*130-5,y=r()*80;s+='<line x1="'+x.toFixed(1)+'" y1="'+y.toFixed(1)+'" x2="'+(x-1.5).toFixed(1)+'" y2="'+(y+8).toFixed(1)+'" stroke="'+(dark?'rgba(190,210,255,.6)':'rgba(60,95,140,.5)')+'" stroke-width=".8"/>';}s+='<ellipse cx="96" cy="84" rx="10" ry="3" fill="none" stroke="'+c('accent')+'" opacity=".6"/>';}
  if(id==='snow'){for(i=0;i<26;i++)s+='<circle cx="'+(r()*120).toFixed(1)+'" cy="'+(r()*80).toFixed(1)+'" r="'+(.8+r()*1.6).toFixed(1)+'" fill="'+(dark?'#fff':'#9DB8D6')+'" opacity=".9"/>';s+='<path d="M0 92V84Q30 78 60 83T120 80V92Z" fill="#fff" opacity=".9"/>';}
  if(id==='autumn'){var cl=['#D9622B','#E8A23A','#C8402E','#B5892F'];for(i=0;i<10;i++){s+='<path transform="translate('+(r()*110+5).toFixed(1)+' '+(r()*80+4).toFixed(1)+') rotate('+(r()*180).toFixed(0)+')" d="M-5 0Q-1-3.5 5 0Q-1 3.5-5 0Z" fill="'+cl[i%4]+'"/>';}}
  if(id==='spring'){var pk=['#F4A7C0','#F7C6D6','#E88AAA'];for(i=0;i<14;i++)s+='<ellipse cx="'+(r()*120).toFixed(1)+'" cy="'+(r()*80).toFixed(1)+'" rx="2.2" ry="1.3" transform="rotate('+(r()*180).toFixed(0)+')" fill="'+pk[i%3]+'"/>';
    s+='<g transform="translate(92 22)"><ellipse cx="-3" cy="-2" rx="4" ry="3" fill="'+c('c2')+'"/><ellipse cx="3" cy="-2" rx="4" ry="3" fill="'+c('c2')+'"/><ellipse cx="-2.5" cy="2.5" rx="2.5" ry="2" fill="'+c('gold')+'"/><ellipse cx="2.5" cy="2.5" rx="2.5" ry="2" fill="'+c('gold')+'"/></g>';}
  if(id==='galaxy'){s+='<ellipse cx="88" cy="26" rx="26" ry="9" fill="'+(dark?'rgba(220,200,255,.3)':c('accent'))+'" opacity=".35" transform="rotate(-14 88 26)"/><circle cx="88" cy="26" r="3.5" fill="'+c('sun')+'"/>';dots(30,dark?'#fff':c('accent2'),.8,66);
    s+='<path d="M14 18L26 28L40 16L58 24" stroke="'+c('gold')+'" stroke-width=".7" fill="none"/><circle cx="14" cy="18" r="1.6" fill="'+c('gold')+'"/><circle cx="26" cy="28" r="1.6" fill="'+c('gold')+'"/><circle cx="40" cy="16" r="1.6" fill="'+c('gold')+'"/><circle cx="58" cy="24" r="1.6" fill="'+c('gold')+'"/>';}
  if(id==='chalk'){dots(26,dark?'#fff':c('ink2'),.45);s+='<path d="M64 14q6-6 10 0t10 0t10 0" stroke="'+(dark?'#fff':c('ink'))+'" stroke-width="1.6" fill="none" opacity=".6" stroke-linecap="round"/>';}
  if(id==='planes'){[[70,16,-14],[96,30,-8],[18,40,-20]].forEach(function(p){s+='<g transform="translate('+p[0]+' '+p[1]+') rotate('+p[2]+')"><path d="M0 0L14 -4L5 3Z" fill="#fff" stroke="'+c('accent2')+'" stroke-width=".6"/><path d="M14 -4L5 3L6 -1Z" fill="'+c('gold')+'" opacity=".7"/></g><path d="M'+(p[0]+16)+' '+(p[1]-3)+'q8 2 14 -2" stroke="'+c('accent')+'" stroke-dasharray="2 2" fill="none" stroke-width=".7"/>';});}
  if(id==='bubbles'){for(i=0;i<12;i++){var rr=1.5+r()*4;s+='<circle cx="'+(r()*120).toFixed(1)+'" cy="'+(r()*80).toFixed(1)+'" r="'+rr.toFixed(1)+'" fill="'+c('accent')+'" fill-opacity=".12" stroke="'+c('accent')+'" stroke-opacity=".6" stroke-width=".6"/>';}}
  return s;}
function seeded(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}

/* ---------- live skins on a canvas ---------- */
function canvasCtx(id){var cv=document.getElementById(id);if(!cv)return null;var x=cv.getContext('2d'),dpr=Math.min(2,window.devicePixelRatio||1);
  function fit(){cv.width=innerWidth*dpr;cv.height=innerHeight*dpr;x.setTransform(dpr,0,0,dpr,0,0);}fit();addEventListener('resize',fit);return {cv:cv,x:x};}
function tok(n){return getComputedStyle(root).getPropertyValue('--'+n).trim();}
/* Each live skin: init, step(dt), draw(x), move(x0,y0,x1,y1)?, taps:[...] (rotated on each tap, so every
   tap answers differently), boost() (called by TB.celebrate on achievement). Transients (flashes, rings,
   blooms...) live in T and draw themselves with progress k from 0 to 1. */
var AMB=(function(){
  var C=null,kind=null,raf=0,last=0,col={},W=0,H=0,down=false,px=0,py=0,tapN=0,S={},T=[];
  var PI=Math.PI,TAU=PI*2;
  function rnd(a,b){return a+Math.random()*(b-a);}
  function pick(a){return a[Math.floor(Math.random()*a.length)];}
  function add(dur,draw){T.push({age:0,dur:dur,draw:draw});}
  function colors(){col={ink:tok('ink'),accent:tok('accent'),accent2:tok('accent2'),gold:tok('gold'),c2:tok('c2'),sun:tok('sun'),dark:root.getAttribute('data-theme')==='dark'};}
  function rgba(rgb,a){return 'rgba('+rgb+','+a+')';}
  function star5(x,cx,cy,r,c,glow){x.save();x.fillStyle=c;if(glow){x.shadowColor=c;x.shadowBlur=glow;}x.beginPath();for(var i=0;i<10;i++){var a=-PI/2+i*PI/5,rr=i%2?r*.45:r;x.lineTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr);}x.closePath();x.fill();x.restore();}
  function ring(x,cx,cy,r,c,a,w){x.globalAlpha=Math.max(0,a);x.strokeStyle=c;x.lineWidth=w||2;x.beginPath();x.arc(cx,cy,Math.max(.1,r),0,TAU);x.stroke();x.globalAlpha=1;}
  function sparks(cx,cy,n,c,spd){var p=[];for(var i=0;i<n;i++){var a=rnd(0,TAU),v=rnd(.4,1)*(spd||160);p.push([Math.cos(a)*v,Math.sin(a)*v,rnd(1,2.6)]);}
    add(1.1,function(x,k){x.fillStyle=c;p.forEach(function(q){x.globalAlpha=1-k;x.beginPath();x.arc(cx+q[0]*k,cy+q[1]*k+40*k*k,q[2]*(1-k*.5),0,TAU);x.fill();});x.globalAlpha=1;});}

  /* ---------------- RAIN ---------------- */
  var rain={
    init:function(){S.drops=[];S.wind=0;S.shield=null;for(var i=0;i<170;i++)S.drops.push(rain.drop(rnd(0,H)));},
    drop:function(y){return {x:rnd(-40,W+40),y:y,l:rnd(10,22),v:rnd(650,950)};},
    step:function(dt){S.wind*=Math.pow(.4,dt);var sh=S.shield;if(sh){sh.t-=dt;if(sh.t<=0)S.shield=null;}
      S.drops.forEach(function(d){d.y+=d.v*dt;d.x+=(S.wind-60)*dt;
        if(sh){var dx=d.x-sh.x,dy=d.y-sh.y;if(dy<0&&dy>-90&&Math.abs(dx)<sh.r){d.x+=(dx<0?-1:1)*240*dt;}}
        if(d.y>H*.9+rnd(0,H*.1)){if(Math.random()<.3)rain.splash(d.x,d.y);Object.assign(d,rain.drop(rnd(-60,-10)));}});},
    splash:function(x0,y0){add(.35,function(x,k){x.strokeStyle=col.dark?'rgba(190,210,255,.6)':'rgba(60,95,140,.45)';x.globalAlpha=1-k;x.lineWidth=1;x.beginPath();x.ellipse(x0,y0,2+k*9,1+k*3,0,0,TAU);x.stroke();x.globalAlpha=1;});},
    draw:function(x){x.strokeStyle=col.dark?'rgba(190,210,255,.5)':'rgba(60,95,140,.42)';x.lineWidth=1.1;x.beginPath();
      S.drops.forEach(function(d){var s=(S.wind-60)/d.v;x.moveTo(d.x,d.y);x.lineTo(d.x-s*d.l,d.y-d.l);});x.stroke();
      var sh=S.shield;if(sh){var a=Math.min(1,sh.t*2,(2.6-sh.t)*4);x.globalAlpha=a*.8;x.fillStyle=col.accent;x.beginPath();x.moveTo(sh.x-sh.r,sh.y);
        for(var i=0;i<=4;i++){var cx=sh.x-sh.r+i*sh.r/2;x.quadraticCurveTo(cx+sh.r/4,sh.y-10,cx+sh.r/2,sh.y);}x.lineTo(sh.x+sh.r,sh.y);x.arc(sh.x,sh.y,sh.r,0,PI,true);x.fill();
        x.strokeStyle=col.accent2;x.lineWidth=3;x.beginPath();x.moveTo(sh.x,sh.y-sh.r);x.lineTo(sh.x,sh.y+42);x.arc(sh.x-7,sh.y+42,7,0,PI);x.stroke();x.globalAlpha=1;}},
    move:function(x0,y0,x1){S.wind+=(x1-x0)*6;},
    taps:[
      function ripple(cx,cy){for(var i=0;i<3;i++)(function(d){add(1.4,function(x,k){var kk=Math.max(0,k*1.4-d);if(kk<=0||kk>1)return;x.strokeStyle=col.accent;x.globalAlpha=(1-kk)*.8;x.lineWidth=2;x.beginPath();x.ellipse(cx,cy,10+kk*90,4+kk*30,0,0,TAU);x.stroke();x.globalAlpha=1;});})(i*.25);},
      function lightning(cx,cy){var pts=[[cx+rnd(-80,80),0]],y=0;while(y<cy){y+=rnd(20,50);pts.push([cx+rnd(-30,30)*(1-y/cy)+ (y>=cy?0:0),Math.min(y,cy)]);}pts[pts.length-1]=[cx,cy];
        var br=pts.slice(Math.floor(pts.length/2)).map(function(p,i){return [p[0]+i*rnd(8,18),p[1]+i*12];}).slice(0,5);
        add(.6,function(x,k){x.fillStyle='rgba(255,255,255,'+(.55*(1-k)*(k<.15||(k>.25&&k<.35)?1:.3))+')';x.fillRect(0,0,W,H);
          x.strokeStyle=col.dark?'#fff':col.gold;x.shadowColor=col.gold;x.shadowBlur=18;x.globalAlpha=1-k;[pts,br].forEach(function(P,j){x.lineWidth=j?1.5:3;x.beginPath();P.forEach(function(p,i){i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]);});x.stroke();});x.shadowBlur=0;x.globalAlpha=1;});},
      function umbrella(cx,cy){S.shield={x:cx,y:cy,r:56,t:2.6};},
      function rainbow(cx,cy){var R=Math.min(220,W*.4),cols=['#E5484D','#F38B3C','#F5C84B','#5DBB63','#3E9BDB','#5B5FC7','#9B59B6'];
        add(3.2,function(x,k){var a=Math.min(1,k*5,(1-k)*3)*.55;x.lineWidth=7;cols.forEach(function(c,i){x.strokeStyle=c;x.globalAlpha=a;x.beginPath();x.arc(cx,cy+R*.5,R-i*7,PI,TAU);x.stroke();});x.globalAlpha=1;});}
    ],
    boost:function(){rain.taps[3](W/2,H*.45);}
  };

  /* ---------------- SNOW ---------------- */
  var snow={
    init:function(){S.f=[];S.wind=0;S.pile=6;for(var i=0;i<150;i++)S.f.push(snow.flake(rnd(0,H)));},
    flake:function(y){return {x:rnd(0,W),y:y,r:rnd(1,3.4),vy:rnd(28,70),sw:rnd(10,30),ph:rnd(0,TAU),vx:0};},
    step:function(dt){S.wind*=Math.pow(.35,dt);S.f.forEach(function(f){f.ph+=dt;f.vx*=Math.pow(.2,dt);f.y+=f.vy*dt;f.x+=(Math.sin(f.ph)*f.sw+S.wind+f.vx)*dt;
        if(f.x<-10)f.x=W+10;if(f.x>W+10)f.x=-10;if(f.y>H-S.pile*.6||f.y<-60){if(f.y>0)S.pile=Math.min(46,S.pile+.012);Object.assign(f,snow.flake(-10));}});},
    draw:function(x){x.fillStyle=col.dark?'rgba(255,255,255,.9)':'rgba(130,165,205,.75)';S.f.forEach(function(f){x.beginPath();x.arc(f.x,f.y,f.r,0,TAU);x.fill();});
      var h=S.pile;x.fillStyle=col.dark?'rgba(235,242,250,.92)':'#fff';x.beginPath();x.moveTo(0,H);for(var i=0;i<=24;i++){var xx=i/24*W;x.lineTo(xx,H-h-Math.sin(i*1.3)*h*.25-Math.cos(i*.7)*h*.15);}x.lineTo(W,H);x.closePath();
      x.shadowColor='rgba(80,120,170,.25)';x.shadowBlur=10;x.fill();x.shadowBlur=0;},
    move:function(x0,y0,x1,y1){var dx=x1-x0,dy=y1-y0;S.f.forEach(function(f){var d=Math.hypot(f.x-x1,f.y-y1);if(d<90){f.vx+=dx*14*(1-d/90);f.y+=dy*.4*(1-d/90);}});},
    crystal:function(cx,cy,R,c){return function(x,k){var s=Math.min(1,k*3),a=Math.min(1,(1-k)*2.5);x.save();x.translate(cx,cy);x.rotate(k*.8);x.scale(s,s);x.strokeStyle=c;x.globalAlpha=a;x.lineWidth=2.4;x.lineCap='round';x.shadowColor=c;x.shadowBlur=10;
      for(var i=0;i<6;i++){x.rotate(PI/3);x.beginPath();x.moveTo(0,0);x.lineTo(0,-R);[.45,.7].forEach(function(t){x.moveTo(0,-R*t);x.lineTo(-R*.22,-R*t-R*.18);x.moveTo(0,-R*t);x.lineTo(R*.22,-R*t-R*.18);});x.stroke();}x.restore();};},
    taps:[
      function burst(cx,cy){for(var i=0;i<34;i++){var f=snow.flake(cy),a=rnd(0,TAU),v=rnd(80,260);f.x=cx;f.y=cy;f.vx=Math.cos(a)*v;f.vy=Math.max(20,Math.sin(a)*v*.5+40);S.f.push(f);}if(S.f.length>260)S.f.splice(0,S.f.length-260);},
      function crystal(cx,cy){add(2.4,snow.crystal(cx,cy,46,col.dark?'#fff':col.accent));},
      function gust(cx){S.wind=(cx<W/2?1:-1)*320;add(.8,function(x,k){x.strokeStyle=col.dark?'rgba(255,255,255,.5)':rgba('80,120,170',.4);x.globalAlpha=1-k;x.lineWidth=1.5;for(var i=0;i<6;i++){var yy=H*(.2+i*.11),xx=(cx<W/2?k:1-k)*W;x.beginPath();x.moveTo(xx-60,yy);x.quadraticCurveTo(xx,yy-12,xx+60,yy);x.stroke();}x.globalAlpha=1;});},
      function frost(cx,cy){var n=16;add(1.2,function(x,k){for(var i=0;i<n;i++){var a=i/n*TAU,r=20+k*110;x.globalAlpha=1-k;star5(x,cx+Math.cos(a)*r,cy+Math.sin(a)*r,4*(1-k)+1,col.dark?'#fff':col.accent);}x.globalAlpha=1;});}
    ],
    boost:function(){S.pile=Math.min(46,S.pile+6);add(2.4,snow.crystal(W/2,H*.35,70,col.gold));}
  };

  /* ---------------- AUTUMN ---------------- */
  var LEAF=['#D9622B','#E8A23A','#C8402E','#B5892F','#A85A2A'];
  var autumn={
    init:function(){S.l=[];S.pile=[];S.whirl=null;for(var i=0;i<34;i++)S.l.push(autumn.leaf(rnd(0,H)));},
    leaf:function(y){return {x:rnd(0,W),y:y,vy:rnd(40,90),vx:0,rot:rnd(0,TAU),vr:rnd(-2.5,2.5),sw:rnd(20,50),ph:rnd(0,TAU),s:rnd(.8,1.4),c:pick(LEAF)};},
    step:function(dt){var w=S.whirl;if(w){w.t-=dt;if(w.t<=0)S.whirl=null;}
      S.l.forEach(function(l){l.ph+=dt*1.5;l.rot+=l.vr*dt;l.vx*=Math.pow(.25,dt);
        if(w){var dx=l.x-w.x,dy=l.y-w.y,d=Math.hypot(dx,dy);if(d<170){var a=Math.atan2(dy,dx)+dt*4,r=d+(70-d)*dt*1.5;l.x=w.x+Math.cos(a)*r;l.y=w.y+Math.sin(a)*r;l.rot+=dt*6;return;}}
        l.y+=l.vy*dt;l.x+=(Math.sin(l.ph)*l.sw+l.vx)*dt;
        if(l.y>H-6-rnd(0,18)&&l.vy>0){if(!l.temp||Math.random()<.7){S.pile.push({x:l.x,y:H-rnd(4,16),rot:l.rot,s:l.s,c:l.c,g:l.gold});if(S.pile.length>70)S.pile.shift();}
          if(l.temp)l.dead=1;else Object.assign(l,autumn.leaf(-20));}
        if(l.y<-80)l.dead=1;});
      S.l=S.l.filter(function(l){return !l.dead;});},
    shape:function(x,cx,cy,rot,s,c,glow){x.save();x.translate(cx,cy);x.rotate(rot);x.scale(s,s);if(glow){x.shadowColor=c;x.shadowBlur=14;}x.fillStyle=c;x.beginPath();x.moveTo(-9,0);x.quadraticCurveTo(-1,-7,9,0);x.quadraticCurveTo(-1,7,-9,0);x.fill();
      x.shadowBlur=0;x.strokeStyle='rgba(0,0,0,.18)';x.lineWidth=.8;x.beginPath();x.moveTo(-9,0);x.lineTo(9,0);x.stroke();x.restore();},
    draw:function(x){S.pile.forEach(function(p){autumn.shape(x,p.x,p.y,p.rot,p.s,p.g?col.gold:p.c,0);});S.l.forEach(function(l){autumn.shape(x,l.x,l.y,l.rot,l.s*(l.gold?2:1),l.gold?col.gold:l.c,l.gold?1:0);});},
    taps:[
      function scatter(cx,cy){S.l.forEach(function(l){var dx=l.x-cx,dy=l.y-cy,d=Math.hypot(dx,dy);if(d<180){l.vx+=dx/d*420*(1-d/180);l.y+=dy/d*30;l.vr*=3;}});
        var lifted=S.pile.filter(function(p){return Math.abs(p.x-cx)<140;});S.pile=S.pile.filter(function(p){return Math.abs(p.x-cx)>=140;});
        lifted.forEach(function(p){var l=autumn.leaf(p.y);l.x=p.x;l.c=p.c;l.vy=rnd(-160,-60);l.vx=(p.x-cx)*3;l.temp=1;l.grav=1;S.l.push(l);});},
      function whirl(cx,cy){S.whirl={x:cx,y:cy,t:2.6};add(2.6,function(x,k){x.strokeStyle=col.accent;x.globalAlpha=.25*(1-k);x.lineWidth=1.5;for(var i=0;i<3;i++){x.beginPath();x.arc(cx,cy,30+i*28,k*12+i,k*12+i+PI*1.2);x.stroke();}x.globalAlpha=1;});},
      function shower(cx,cy){for(var i=0;i<14;i++){var l=autumn.leaf(cy+rnd(-20,20));l.x=cx+rnd(-50,50);l.temp=1;S.l.push(l);}},
      function golden(cx,cy){var l=autumn.leaf(cy);l.x=cx;l.vy=35;l.gold=1;l.temp=1;S.l.push(l);sparks(cx,cy,12,col.gold,90);}
    ],
    boost:function(){for(var i=0;i<6;i++){var l=autumn.leaf(rnd(-60,-10));l.gold=1;l.temp=1;l.vy=50;S.l.push(l);}}
  };
  // leaves thrown up fall back
  var _as=autumn.step;autumn.step=function(dt){S.l.forEach(function(l){if(l.grav)l.vy+=260*dt;});_as(dt);};

  /* ---------------- SPRING ---------------- */
  var PETAL=['#F4A7C0','#F7C6D6','#E88AAA','#FFFFFF'];
  var spring={
    init:function(){S.p=[];S.b=[];S.g=[];for(var i=0;i<46;i++)S.p.push(spring.petal(rnd(-W*.2,W),rnd(0,H)));for(i=0;i<3;i++)S.b.push(spring.fly(rnd(0,W),rnd(H*.2,H*.7)));},
    petal:function(x,y){return {x:x,y:y,vx:rnd(-50,-20),vy:rnd(25,55),rot:rnd(0,TAU),vr:rnd(-2,2),s:rnd(.7,1.3),c:pick(PETAL),ph:rnd(0,TAU)};},
    fly:function(x,y){return {x:x,y:y,tx:rnd(W*.1,W*.9),ty:rnd(H*.15,H*.75),ph:rnd(0,TAU),c:pick([col.c2,col.gold,col.accent]),s:rnd(.8,1.2),hold:0};},
    step:function(dt){S.p.forEach(function(p){p.ph+=dt*2;p.x+=(p.vx+Math.sin(p.ph)*20)*dt;p.y+=p.vy*dt;p.rot+=p.vr*dt;if(p.vx<-60)p.vx*=Math.pow(.3,dt);if(p.y>H+10||p.x<-20)Object.assign(p,spring.petal(rnd(W*.2,W+40),-10));});
      S.b.forEach(function(b){b.ph+=dt*14;var dx=b.tx-b.x,dy=b.ty-b.y,d=Math.hypot(dx,dy);if(b.hold>0)b.hold-=dt;
        if(d<12){if(b.hold<=0){b.tx=rnd(W*.05,W*.95);b.ty=rnd(H*.1,H*.75);}}else{var sp=b.fast?220:70;b.x+=dx/d*sp*dt;b.y+=dy/d*sp*dt+Math.sin(b.ph*.25)*20*dt;}
        if(b.temp&&(b.life-=dt)<0)b.dead=1;});S.b=S.b.filter(function(b){return !b.dead;});},
    drawFly:function(x,b){var f=.35+.65*Math.abs(Math.sin(b.ph));x.save();x.translate(b.x,b.y);x.scale(b.s,b.s);x.fillStyle=b.c;x.globalAlpha=.9;
      x.save();x.scale(f,1);x.beginPath();x.ellipse(-7,-4,7,5.5,-.4,0,TAU);x.ellipse(7,-4,7,5.5,.4,0,TAU);x.fill();x.beginPath();x.ellipse(-5,4,4,3.5,.3,0,TAU);x.ellipse(5,4,4,3.5,-.3,0,TAU);x.fill();x.restore();
      x.globalAlpha=1;x.fillStyle=col.dark?'#fff':col.ink;x.fillRect(-1,-7,2,14);x.restore();},
    flower:function(x,cx,cy,s,c){x.save();x.translate(cx,cy);x.scale(s,s);x.fillStyle=c;for(var i=0;i<6;i++){x.rotate(PI/3);x.beginPath();x.ellipse(0,-9,5,9,0,0,TAU);x.fill();}x.fillStyle=col.gold;x.beginPath();x.arc(0,0,4.5,0,TAU);x.fill();x.restore();},
    draw:function(x){S.g.forEach(function(g){x.strokeStyle=col.accent;x.lineWidth=2;x.beginPath();x.moveTo(g.x,H);x.quadraticCurveTo(g.x+6,H-g.h/2,g.x,H-g.h);x.stroke();spring.flower(x,g.x,H-g.h,g.s,g.c);});
      S.p.forEach(function(p){x.save();x.translate(p.x,p.y);x.rotate(p.rot);x.scale(p.s,p.s);x.fillStyle=p.c;x.globalAlpha=.85;x.beginPath();x.ellipse(0,0,5,3,0,0,TAU);x.fill();x.restore();});x.globalAlpha=1;
      S.b.forEach(function(b){spring.drawFly(x,b);});},
    taps:[
      function bloom(cx,cy){var c=pick(['#F4A7C0','#E88AAA',col.c2,'#FFFFFF']);add(2.6,function(x,k){var s=k<.3?k/.3*1.6:1.6,a=k>.75?(1-k)/.25:1;x.globalAlpha=a;x.save();x.translate(cx,cy);x.rotate(k*.6);spring.flower(x,0,0,s,c);x.restore();x.globalAlpha=1;});
        for(var i=0;i<8;i++){var p=spring.petal(cx,cy);p.vx=rnd(-120,40);p.vy=rnd(-60,40);S.p.push(p);}if(S.p.length>110)S.p.splice(0,S.p.length-110);},
      function flutter(cx,cy){for(var i=0;i<3;i++){var b=spring.fly(cx,cy);b.temp=1;b.life=9;b.fast=1;b.tx=cx+rnd(-260,260);b.ty=cy+rnd(-200,60);S.b.push(b);}setTimeout(function(){S.b&&S.b.forEach(function(b){b.fast=0;});},1500);},
      function petals(cx,cy){for(var i=0;i<26;i++){var p=spring.petal(cx,cy),a=rnd(0,TAU),v=rnd(60,200);p.vx=Math.cos(a)*v;p.vy=Math.sin(a)*v*.6;S.p.push(p);}if(S.p.length>110)S.p.splice(0,S.p.length-110);},
      function call(cx,cy){S.b.forEach(function(b,i){b.tx=cx+Math.cos(i*2.1)*26;b.ty=cy+Math.sin(i*2.1)*20;b.hold=2.5;b.fast=1;});setTimeout(function(){S.b&&S.b.forEach(function(b){b.fast=0;});},1200);
        add(1,function(x,k){ring(x,cx,cy,8+k*40,col.c2,(1-k)*.7,2);});}
    ],
    boost:function(){for(var i=0;i<4;i++){if(S.g.length>24)S.g.shift();S.g.push({x:rnd(W*.05,W*.95),h:rnd(30,70),s:rnd(.9,1.4),c:pick(['#F4A7C0','#E88AAA',col.c2])});}}
  };

  /* ---------------- GALAXY ---------------- */
  var galaxy={
    init:function(){S.st=[];S.gp=[];S.lines=[];S.gold=[];S.glow=0;S.spin=1;S.rot=0;
      for(var i=0;i<170;i++)S.st.push({x:rnd(0,W),y:rnd(0,H*.85),r:rnd(.4,1.6),ph:rnd(0,TAU),sp:rnd(.5,2),lit:0});
      galaxy.place();for(i=0;i<2600;i++){var arm=i%3,d=Math.pow(Math.random(),.7);S.gp.push({arm:arm,d:d,off:rnd(-.35,.35)*(1-d*.4),sz:rnd(.5,1.8)*(1.2-d*.6),hue:Math.random()});}},
    place:function(){var wide=W>900;S.cx=wide?W*.5:W*.5;S.cy=wide?H*.45:H*.24;S.R=wide?Math.min(W*.36,H*.46,520):Math.min(W*.52,H*.26);},
    pos:function(p){var a=p.arm*TAU/3+p.d*4.2+p.off+S.rot,r=p.d*S.R,X=Math.cos(a)*r,Y=Math.sin(a)*r*.42,t=-.35;return [S.cx+X*Math.cos(t)-Y*Math.sin(t),S.cy+X*Math.sin(t)+Y*Math.cos(t)];},
    step:function(dt){S.spin+=(1-S.spin)*dt*.8;S.glow*=Math.pow(.35,dt);S.rot+=dt*.06*S.spin;
      S.st.forEach(function(s){s.ph+=s.sp*dt;s.lit*=Math.pow(.45,dt);});S.lines=S.lines.filter(function(l){return (l.t-=dt)>0;});},
    draw:function(x){var D=col.dark;
      S.st.forEach(function(s){var a=.3+.45*Math.abs(Math.sin(s.ph))+s.lit*.6;x.globalAlpha=Math.min(1,a);x.fillStyle=s.lit>.15?col.gold:(D?'#fff':col.accent2);x.beginPath();x.arc(s.x,s.y,s.r*(1+s.lit*2.2),0,TAU);x.fill();
        if(s.lit>.15){x.globalAlpha=s.lit*.35;x.beginPath();x.arc(s.x,s.y,s.r*8*s.lit,0,TAU);x.fill();}});x.globalAlpha=1;
      S.lines.forEach(function(l){x.strokeStyle=col.gold;x.globalAlpha=Math.min(1,l.t)*.7;x.lineWidth=1.2;x.beginPath();l.p.forEach(function(s,i){i?x.lineTo(s.x,s.y):x.moveTo(s.x,s.y);});x.stroke();});x.globalAlpha=1;
      // night nebula behind the spiral so it reads clearly in light mode too
      x.save();x.translate(S.cx,S.cy);x.rotate(-.35);x.scale(1,.55);var nb=x.createRadialGradient(0,0,0,0,0,S.R*1.25);
      nb.addColorStop(0,D?'rgba(90,60,200,.35)':'rgba(40,24,110,.55)');nb.addColorStop(.55,D?'rgba(60,40,150,.18)':'rgba(60,40,150,.28)');nb.addColorStop(1,'rgba(0,0,0,0)');
      x.fillStyle=nb;x.beginPath();x.arc(0,0,S.R*1.25,0,TAU);x.fill();x.restore();
      var g=x.createRadialGradient(S.cx,S.cy,0,S.cx,S.cy,S.R*.75),gl=.35+S.glow*.65;
      g.addColorStop(0,D?'rgba(255,240,220,'+(gl*.9)+')':'rgba(255,250,240,'+gl+')');g.addColorStop(.18,D?'rgba(200,170,255,'+(gl*.35)+')':rgba('120,90,200',gl*.18));g.addColorStop(1,'rgba(0,0,0,0)');
      x.fillStyle=g;x.beginPath();x.ellipse(S.cx,S.cy,S.R*.75,S.R*.4,-.35,0,TAU);x.fill();
      x.globalCompositeOperation='lighter';
      S.gp.forEach(function(p){var q=galaxy.pos(p);x.globalAlpha=Math.min(1,(.35+(1-p.d)*.55)*(1+S.glow*.8));x.fillStyle=p.hue<.55?(D?col.accent:'#B9A6FF'):(p.hue<.85?'#FFFFFF':(D?col.c2:'#FFD9A0'));var z=p.sz*1.8;x.fillRect(q[0],q[1],z,z);if(p.hue>.93&&p.d<.8){x.globalAlpha=.07;x.beginPath();x.arc(q[0],q[1],9,0,TAU);x.fill();}});
      x.globalCompositeOperation='source-over';x.globalAlpha=1;
      x.fillStyle='#FFF4E0';x.shadowColor=col.gold;x.shadowBlur=24+S.glow*40;x.beginPath();x.arc(S.cx,S.cy,6+S.glow*7,0,TAU);x.fill();x.shadowBlur=0;
      S.gold.forEach(function(s){star5(x,s.x,s.y,s.r*(1+.1*Math.sin(performance.now()/400+s.x)),col.gold,12);});},
    inside:function(cx,cy){return Math.hypot((cx-S.cx)/1,(cy-S.cy)/.5)<S.R*.8;},
    lightStars:function(cx,cy){var near=S.st.map(function(s){return [Math.hypot(s.x-cx,s.y-cy),s];}).sort(function(a,b){return a[0]-b[0];}).slice(0,6).map(function(a){return a[1];});
      near.forEach(function(s,i){setTimeout(function(){s.lit=1;},i*90);});near.sort(function(a,b){return a.x-b.x;});S.lines.push({p:near,t:3.2});},
    shoot:function(cx,cy){var vx=rnd(-560,-400),vy=rnd(170,260);add(1.1,function(x,k){var X=cx+vx*k,Y=cy+vy*k,gr=x.createLinearGradient(X,Y,X-vx*.22,Y-vy*.22);gr.addColorStop(0,col.gold);gr.addColorStop(1,'rgba(0,0,0,0)');
      x.strokeStyle=gr;x.globalAlpha=1-k;x.lineWidth=2.6;x.beginPath();x.moveTo(X,Y);x.lineTo(X-vx*.22,Y-vy*.22);x.stroke();x.globalAlpha=1;});},
    nova:function(cx,cy){add(1.6,function(x,k){var g=x.createRadialGradient(cx,cy,0,cx,cy,30+k*140);g.addColorStop(0,'rgba(255,255,255,'+(1-k)+')');g.addColorStop(.3,col.dark?'rgba(255,210,150,'+(.6*(1-k))+')':rgba('200,150,60',.4*(1-k)));g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.beginPath();x.arc(cx,cy,30+k*140,0,TAU);x.fill();
      ring(x,cx,cy,10+k*160,col.accent,1-k,2);ring(x,cx,cy,k*110,col.gold,(1-k)*.8,1.2);});sparks(cx,cy,24,col.gold,220);},
    pulse:function(){S.glow=1;add(1.4,function(x,k){x.save();x.translate(S.cx,S.cy);x.rotate(-.35);x.scale(1,.42);ring(x,0,0,S.R*.2+k*S.R,col.gold,(1-k)*.8,3);x.restore();});},
    taps:[],
    tapAt:function(cx,cy){var n=tapN++;
      if(galaxy.inside(cx,cy)){[function(){galaxy.pulse();},function(){S.spin=7;galaxy.pulse();},function(){galaxy.nova(cx,cy);S.glow=.6;}][n%3]();}
      else [function(){galaxy.lightStars(cx,cy);},function(){galaxy.shoot(cx,cy);},function(){galaxy.nova(cx,cy);},function(){S.st.forEach(function(s){s.lit=Math.max(s.lit,rnd(.2,.9));});}][n%4]();},
    boost:function(){if(S.gold.length<40)S.gold.push({x:rnd(W*.05,W*.95),y:rnd(H*.05,H*.45),r:rnd(5,8)});galaxy.pulse();}
  };

  /* ---------------- CHALK ---------------- */
  var WORDS=['١ + ١ = ٢','أ ب ت ث','٣ × ٣ = ٩','ممتاز!','أحسنت','H₂O','٧ ÷ ٧ = ١','اقرأ'];
  var chalk={
    init:function(){S.d=[];S.tr=[];for(var i=0;i<70;i++)S.d.push({x:rnd(0,W),y:rnd(0,H),r:rnd(.6,2.2),vx:rnd(-6,6),vy:rnd(-10,-3),a:rnd(.15,.5)});},
    step:function(dt){S.d.forEach(function(p){p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.y<-5){p.y=H+5;p.x=rnd(0,W);}if(p.x<-5)p.x=W+5;if(p.x>W+5)p.x=-5;});S.tr=S.tr.filter(function(e){e.life-=dt*.25;return e.life>0;});},
    cc:function(){return col.dark?'255,255,255':'40,60,50';},
    draw:function(x){var c=chalk.cc();S.d.forEach(function(p){x.fillStyle=rgba(c,p.a);x.beginPath();x.arc(p.x,p.y,p.r,0,TAU);x.fill();});
      S.tr.forEach(function(e){x.strokeStyle=e.gold?col.gold:rgba(c,e.life*(col.dark?.85:.6));x.globalAlpha=e.gold?e.life:1;x.lineWidth=e.w;x.lineCap='round';
        for(var k=0;k<3;k++){x.beginPath();x.moveTo(e.x0+rnd(-1.2,1.2),e.y0+rnd(-1.2,1.2));x.lineTo(e.x1+rnd(-1.2,1.2),e.y1+rnd(-1.2,1.2));x.stroke();}x.globalAlpha=1;});},
    move:function(x0,y0,x1,y1){S.tr.push({x0:x0,y0:y0,x1:x1,y1:y1,w:rnd(2.4,3.6),life:1});if(S.tr.length>900)S.tr.splice(0,100);},
    star:function(cx,cy,R,gold){for(var i=0;i<5;i++){var a1=-PI/2+i*PI*4/5,a2=-PI/2+(i+1)*PI*4/5;S.tr.push({gold:gold,x0:cx+Math.cos(a1)*R,y0:cy+Math.sin(a1)*R,x1:cx+Math.cos(a2)*R,y1:cy+Math.sin(a2)*R,w:3.4,life:1.3});}},
    taps:[
      function puff(cx,cy){var c=chalk.cc(),p=[];for(var i=0;i<22;i++)p.push([rnd(-1,1)*40,rnd(-1,1)*30,rnd(2,6)]);add(1.3,function(x,k){x.fillStyle=rgba(c,.45*(1-k));p.forEach(function(q){x.beginPath();x.arc(cx+q[0]*(.3+k),cy+q[1]*(.3+k)-k*20,q[2]*(1+k),0,TAU);x.fill();});});},
      function word(cx,cy){var w=pick(WORDS),c=chalk.cc();add(3,function(x,k){x.font='600 34px "Aref Ruqaa", "Amiri", serif';x.textAlign='center';x.direction='rtl';x.fillStyle=rgba(c,(k<.15?k/.15:k>.7?(1-k)/.3:1)*(col.dark?.9:.7));
        var full=x.measureText(w).width;x.save();x.beginPath();x.rect(cx+full/2-full*Math.min(1,k*3)-4,cy-40,full*Math.min(1,k*3)+8,60);x.clip();x.fillText(w,cx,cy);x.restore();});},
      function star(cx,cy){chalk.star(cx,cy,46,0);},
      function circle(cx,cy){var R=44;for(var i=0;i<24;i++){var a1=i/24*TAU*1.08,a2=(i+1)/24*TAU*1.08;S.tr.push({x0:cx+Math.cos(a1)*R,y0:cy+Math.sin(a1)*R*.8,x1:cx+Math.cos(a2)*R,y1:cy+Math.sin(a2)*R*.8,w:3,life:1.1});}}
    ],
    boost:function(){chalk.star(W/2,H*.35,70,1);}
  };

  /* ---------------- PLANES ---------------- */
  var planes={
    init:function(){S.pl=[];for(var i=0;i<6;i++)S.pl.push(planes.mk(rnd(0,W),rnd(H*.08,H*.7)));},
    mk:function(x,y,temp){return {x:x,y:y,vx:rnd(-70,-40),vy:rnd(-8,8),t:rnd(0,6),f:rnd(.6,1.4),amp:rnd(6,16),s:rnd(.7,1.15),trail:[],temp:temp,loop:0};},
    step:function(dt){S.pl.forEach(function(p){p.t+=dt;
        if(p.loop>0){p.loop-=dt;var a=(1-p.loop/1.6)*TAU;p.x=p.lx+Math.sin(a)*-60;p.y=p.ly-(1-Math.cos(a))*60;p.ang=-a+PI;}
        else{p.x+=p.vx*dt;p.y+=p.vy*dt+Math.sin(p.t*p.f)*p.amp*dt;p.ang=null;}
        p.trail.push([p.x,p.y]);if(p.trail.length>46)p.trail.shift();
        if(p.x<-60||p.y<-60||p.y>H+60){if(p.temp)p.dead=1;else Object.assign(p,planes.mk(W+40,rnd(H*.08,H*.7)));}});S.pl=S.pl.filter(function(p){return !p.dead;});},
    draw:function(x){S.pl.forEach(function(p){x.strokeStyle=p.gold?col.gold:col.accent;x.globalAlpha=.35;x.setLineDash([4,6]);x.lineWidth=1.2;x.beginPath();p.trail.forEach(function(q,i){i?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1]);});x.stroke();x.setLineDash([]);x.globalAlpha=1;
        var ang=p.ang!=null?p.ang:Math.atan2(p.vy+Math.sin(p.t*p.f)*p.amp,p.vx)+PI;x.save();x.translate(p.x,p.y);x.rotate(ang);x.scale(p.s,p.s);
        x.fillStyle=col.dark?'rgba(255,255,255,.92)':'#fff';x.strokeStyle=col.accent2;x.lineWidth=1/p.s;x.beginPath();x.moveTo(22,0);x.lineTo(-10,-10);x.lineTo(-3,0);x.lineTo(-10,9);x.closePath();x.fill();x.stroke();
        x.fillStyle=p.gold?col.gold:col.accent;x.globalAlpha=.55;x.beginPath();x.moveTo(22,0);x.lineTo(-3,0);x.lineTo(-10,9);x.closePath();x.fill();x.globalAlpha=1;x.restore();});},
    taps:[
      function launch(cx,cy){S.pl.push(Object.assign(planes.mk(cx,cy,true),{vx:rnd(-260,-200),vy:rnd(-120,-60)}));},
      function loop(cx,cy){var p=planes.mk(cx,cy,true);p.vx=-220;p.vy=-40;p.loop=1.6;p.lx=cx;p.ly=cy;p.gold=1;S.pl.push(p);},
      function flock(cx,cy){for(var i=0;i<3;i++)S.pl.push(Object.assign(planes.mk(cx+i*26,cy+i*(i%2?18:-18),true),{vx:-230,vy:-70}));}
    ],
    boost:function(){for(var i=0;i<7;i++)S.pl.push(Object.assign(planes.mk(W+30+i*30,H*.6+i*14,true),{gold:1,vx:-240,vy:-90+i*6}));}
  };

  /* ---------------- BUBBLES ---------------- */
  var bubbles={
    init:function(){S.bb=[];for(var i=0;i<26;i++)S.bb.push(bubbles.mk(rnd(0,H)));},
    mk:function(y){return {x0:rnd(0,W),x:0,y:y,r:rnd(4,16),v:rnd(18,46),t:rnd(0,6),f:rnd(.6,1.6),amp:rnd(4,14)};},
    step:function(dt){S.bb.forEach(function(p){p.t+=dt;p.y-=p.v*dt;p.x=p.x0+Math.sin(p.t*p.f)*p.amp;if(p.y<-p.r-20){if(p.temp)p.dead=1;else Object.assign(p,bubbles.mk(H+20));}});S.bb=S.bb.filter(function(p){return !p.dead;});},
    draw:function(x){S.bb.forEach(function(p){x.strokeStyle=p.gold?col.gold:col.accent;x.globalAlpha=.55;x.lineWidth=1.2;x.beginPath();x.arc(p.x,p.y,p.r,0,TAU);x.stroke();x.globalAlpha=.1;x.fillStyle=p.gold?col.gold:col.accent;x.fill();x.globalAlpha=.7;x.fillStyle='#fff';x.beginPath();x.arc(p.x-p.r*.35,p.y-p.r*.35,p.r*.18,0,TAU);x.fill();x.globalAlpha=1;});},
    pop:function(p){var X=p.x,Y=p.y,R=p.r;add(.5,function(x,k){ring(x,X,Y,R+k*18,col.accent,1-k,2);});sparks(X,Y,6,col.accent,70);Object.assign(p,bubbles.mk(H+20));},
    near:function(cx,cy,R){return S.bb.filter(function(p){return Math.hypot(p.x-cx,p.y-cy)<R+p.r;}).sort(function(a,b){return Math.hypot(a.x-cx,a.y-cy)-Math.hypot(b.x-cx,b.y-cy);});},
    taps:[
      function pop(cx,cy){var n=bubbles.near(cx,cy,70);if(n.length)bubbles.pop(n[0]);else bubbles.taps[1](cx,cy);},
      function spawn(cx,cy){for(var i=0;i<5;i++){var b=bubbles.mk(cy+rnd(-10,10));b.x0=cx+rnd(-24,24);b.temp=1;b.v*=1.6;S.bb.push(b);}if(S.bb.length>70)S.bb.splice(0,S.bb.length-70);},
      function giant(cx,cy){var b=bubbles.mk(cy);b.x0=cx;b.r=42;b.v=50;b.temp=1;b.gold=1;S.bb.push(b);},
      function chain(cx,cy){bubbles.near(cx,cy,180).forEach(function(p,i){setTimeout(function(){bubbles.pop(p);},i*90);});}
    ],
    boost:function(){for(var i=0;i<16;i++){var b=bubbles.mk(H+rnd(0,120));b.gold=1;b.v*=2.2;b.temp=1;S.bb.push(b);}}
  };

  var FX={rain:rain,snow:snow,autumn:autumn,spring:spring,galaxy:galaxy,chalk:chalk,planes:planes,bubbles:bubbles};
  function loop(t){raf=requestAnimationFrame(loop);var dt=Math.min(.05,(t-last)/1000||0);last=t;if(document.hidden||document.documentElement.classList.contains('fx-pause'))return;var F=FX[kind];F.step(dt);var x=C.x;x.clearRect(0,0,W,H);F.draw(x);
    T=T.filter(function(e){e.age+=dt;if(e.age>=e.dur)return false;e.draw(x,e.age/e.dur,dt);x.globalAlpha=1;return true;});}
  function interactive(e){return e.target.closest&&e.target.closest('button,a,input,select,textarea,label,summary,[role=switch],.card,.tile,.sheet,.topbar,.nav,.side,.glass');}
  function tap(cx,cy){var F=FX[kind];if(F.tapAt)F.tapAt(cx,cy);else F.taps[(tapN++)%F.taps.length](cx,cy);}
  var bound=false;
  function bind(){
    addEventListener('pointerdown',function(e){if(!kind||interactive(e))return;down=true;px=e.clientX;py=e.clientY;tap(px,py);},{passive:true});
    addEventListener('pointermove',function(e){if(!kind||!down)return;var F=FX[kind];F.move&&F.move(px,py,e.clientX,e.clientY);px=e.clientX;py=e.clientY;},{passive:true});
    addEventListener('pointerup',function(){down=false;},{passive:true});
    addEventListener('pointercancel',function(){down=false;},{passive:true});
    addEventListener('resize',function(){W=innerWidth;H=innerHeight;if(kind==='galaxy')galaxy.place();});
  }
  return {
    set:function(k){if(!C){C=canvasCtx('amb');if(!C)return;}cancelAnimationFrame(raf);C.x.clearRect(0,0,innerWidth,innerHeight);T=[];S={};tapN=Math.floor(Math.random()*4);
      kind=(k&&FX[k]&&!RMQ&&P.motion)?k:null;C.cv.style.display=kind?'block':'none';if(!kind)return;
      if(!bound){bind();bound=true;}W=innerWidth;H=innerHeight;colors();FX[kind].init();last=performance.now();raf=requestAnimationFrame(loop);},
    boost:function(){if(kind)FX[kind].boost();},
    tap:function(x,y){if(kind)tap(x,y);},
    recolor:function(){if(kind)colors();},
    get kind(){return kind;}
  };
})();
document.addEventListener('tb:theme',function(){setTimeout(AMB.recolor,30);});

/* ---------- celebration: confetti + stars ---------- */
var FXC=null;
function celebrate(x,y,opt){opt=opt||{};if(RMQ||!P.motion){AMB.boost();return;}if(!FXC){FXC=canvasCtx('fx');if(!FXC)return;}
  var W=innerWidth,H=innerHeight;x=x==null?W/2:x;y=y==null?H*.4:y;
  var cols=[tok('accent'),tok('gold'),tok('c2'),tok('good'),tok('accent2')],ps=[],n=opt.count||110;
  for(var i=0;i<n;i++){var a=Math.random()*Math.PI*2,v=200+Math.random()*420;ps.push({x:x,y:y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-260,r:Math.random()*6.28,vr:(Math.random()-.5)*12,w:5+Math.random()*6,h:3+Math.random()*4,c:cols[i%cols.length],s:i%7===0,life:1});}
  var last=performance.now();
  (function f(t){var dt=Math.min(.05,(t-last)/1000);last=t;var X=FXC.x;X.clearRect(0,0,W,H);var alive=0;
    ps.forEach(function(p){p.vy+=720*dt;p.vx*=.985;p.x+=p.vx*dt;p.y+=p.vy*dt;p.r+=p.vr*dt;p.life-=dt*.42;if(p.life<=0||p.y>H+20)return;alive++;
      X.save();X.globalAlpha=Math.min(1,p.life*1.6);X.translate(p.x,p.y);X.rotate(p.r);X.fillStyle=p.c;
      if(p.s){X.beginPath();for(var k=0;k<10;k++){var aa=-Math.PI/2+k*Math.PI/5,rr=k%2?3:7.5;X.lineTo(Math.cos(aa)*rr,Math.sin(aa)*rr);}X.closePath();X.fill();}else X.fillRect(-p.w/2,-p.h/2,p.w,p.h);X.restore();});
    if(alive)requestAnimationFrame(f);else X.clearRect(0,0,W,H);})(last);
  AMB.boost();}

/* ---------- toast & sheet ---------- */
var tT;
function toast(msg,opt){opt=opt||{};var h=document.querySelector('.toast');if(!h)return;clearTimeout(tT);
  h.innerHTML='<div class="'+(opt.gold?'gold':'')+'">'+(opt.icon?I[opt.icon]:I.check)+'<span>'+msg+'</span></div>';tT=setTimeout(function(){h.innerHTML='';},opt.ms||2600);}
function sheet(html,opt){closeSheet();opt=opt||{};var s=document.createElement('div');s.className='scrim';s.addEventListener('click',closeSheet);
  var b=document.createElement('div');b.className='sheet';b.setAttribute('role','dialog');b.setAttribute('aria-modal','true');
  b.innerHTML='<div class="sheet-in"><div class="grab"></div>'+(opt.title?'<div class="sh-head"><span class="ico">'+(I[opt.icon]||I.spark)+'</span><div><h2>'+opt.title+'</h2>'+(opt.sub?'<p class="sub">'+opt.sub+'</p>':'')+'</div><button class="round-btn" data-act="close-sheet" aria-label="إغلاق">'+I.x+'</button></div>':'')+html+'</div>';
  document.body.appendChild(s);document.body.appendChild(b);var f=b.querySelector('button,input');if(f)f.focus({preventScroll:true});return b;}
function closeSheet(){document.querySelectorAll('.scrim,.sheet').forEach(function(n){n.remove();});}
addEventListener('keydown',function(e){if(e.key==='Escape')closeSheet();});

/* ---------- theme studio ---------- */
function segH(key,opts){return '<div class="seg" role="group">'+opts.map(function(o){return '<button data-pref="'+key+'" data-v="'+o[0]+'" aria-pressed="'+(String(P[key])===String(o[0]))+'">'+(o[2]?I[o[2]]:'')+o[1]+'</button>';}).join('')+'</div>';}
function studioHTML(){var dark=isDark(),who={m:'للمعلمين',f:'للمعلمات'};
  function card(id){var k=SKINS[id];return '<button class="skin'+(k.fx?' live':'')+'" data-pref="skin" data-v="'+id+'" aria-pressed="'+(P.skin===id)+'">'+skinPrev(id,dark)+(k.who?'<i class="who">'+who[k.who]+'</i>':'')+'<span><b>'+k.n+'</b><small>'+k.d+'</small>'+(k.fx?'<small class="hint">'+I.bolt.replace('<svg','<svg width="12" height="12"')+k.i+'</small>':'')+'</span><i class="ok">'+I.check+'</i></button>';}
  var ids=Object.keys(SKINS);
  return '<div class="stack">'+segH('mode',[['auto','تلقائي','auto'],['light','فاتح','sun'],['dark','داكن','moon']])+
   '<div class="between"><h3 class="h">ثيمات حيّة</h3><span class="chip gold">كل لمسة بتفاعل مختلف</span></div><div class="skins">'+ids.filter(function(i){return SKINS[i].fx;}).map(card).join('')+'</div>'+
   '<div class="between"><h3 class="h">ثيمات هادئة</h3><span class="chip">'+ids.filter(function(i){return !SKINS[i].fx;}).length+' ثيمات</span></div><div class="skins">'+ids.filter(function(i){return !SKINS[i].fx;}).map(card).join('')+'</div>'+
   '<h3 class="h">تخصيص المظهر</h3>'+
   '<div class="opt-row"><span>الخلفية</span>'+segH('scene',[['full','كاملة'],['soft','هادئة'],['none','بدون']])+'</div>'+
   '<div class="opt-row"><span>البطاقات</span>'+segH('cards',[['glass','زجاج'],['solid','صلبة']])+'</div>'+
   '<div class="opt-row"><span>الزوايا</span>'+segH('corners',[['sharp','حادة'],['soft','ناعمة'],['round','دائرية']])+'</div>'+
   '<div class="opt-row"><span>الخط</span>'+segH('ffam',[['plex','بلكس'],['tajawal','تجوال'],['amiri','أميري'],['kufi','كوفي']])+'</div>'+
   '<div class="opt-row"><span>حجم الخط</span>'+segH('font',[['m','عادي'],['l','كبير'],['xl','أكبر']])+'</div>'+
   '<div class="opt-row"><span>اللمعان</span>'+segH('shine',[['auto','تلقائي'],['edge','حواف'],['sweep','مرور'],['follow','يتبع'],['off','بدون']])+'</div>'+
   '<div class="opt-row"><span>الحركة والمؤثرات</span><button class="switch" role="switch" data-pref="motion" aria-checked="'+P.motion+'" aria-label="الحركة"></button></div>'+
   '<button class="btn soft sm" data-act="reset-look">'+I.reset+'إرجاع المظهر الافتراضي</button></div>';}
function studio(el){el.innerHTML=studioHTML();el.setAttribute('data-studio','');}
function openStudio(){sheet('<div data-studio>'+studioHTML()+'</div>',{title:'المظاهر والثيمات',sub:'اختر ثيمًا ونمطًا يناسب منصتك',icon:'palette'});}
function refreshStudios(){document.querySelectorAll('[data-studio]').forEach(function(el){el.innerHTML=studioHTML();});}

/* ---------- quiz engine ---------- */
/* TB.quiz(el,[{q,opts:[...],a:index,why},{q,tf:true,a:true|false,why}],{title,onDone}) */
function quiz(el,Q,opt){opt=opt||{};var i=0,score=0,picked=null,checked=false,res=[];
  function render(){if(i>=Q.length)return done();var q=Q[i],opts=q.tf?['صح','خطأ']:q.opts,keys=['أ','ب','ج','د','هـ'];
    el.innerHTML='<div class="stack"><div class="between"><span class="chip">السؤال '+(i+1)+' من '+Q.length+'</span><span class="chip gold">'+I.star+score+' نقاط</span></div>'+
      '<div class="qdots">'+Q.map(function(_,k){return '<i class="'+(k<i?(res[k]?'ok':'no'):k===i?'on':'')+'"></i>';}).join('')+'</div>'+
      '<p class="q-title">'+q.q+'</p><div class="opts">'+opts.map(function(o,k){return '<button class="opt" data-k="'+k+'" aria-pressed="false"><span class="k">'+(q.tf?(k?I.x:I.check):keys[k])+'</span><span>'+o+'</span></button>';}).join('')+'</div>'+
      '<div class="fb"></div><div class="between"><span class="note">اختر إجابة ثم اضغط «تحقّق»</span><button class="btn" data-q="go" disabled>تحقّق</button></div></div>';
    picked=null;checked=false;}
  function done(){var pct=Math.round(score/Q.length*100),lvl=pct>=90?'ممتاز':pct>=75?'جيد جدًا':pct>=60?'جيد':'حاول مجددًا';
    el.innerHTML='<div class="stack" style="align-items:center;text-align:center;padding-block:10px"><span class="stamp in" style="--sz:120px">'+lvl+'<small>'+pct+'٪</small></span>'+
      '<h3 class="h-xl">'+(pct>=60?'أحسنت! أنهيت '+(opt.title||'الاختبار'):'لا بأس، المحاولة تصنع الفرق')+'</h3><p class="sub">أجبت '+score+' من '+Q.length+' إجابات صحيحة</p>'+
      '<div class="qdots" style="justify-content:center">'+res.map(function(r){return '<i class="'+(r?'ok':'no')+'"></i>';}).join('')+'</div>'+
      '<div class="row" style="flex-wrap:wrap;justify-content:center"><button class="btn" data-q="again">'+I.reset+'أعد المحاولة</button></div></div>';
    if(pct>=60){var r=el.getBoundingClientRect();celebrate(r.left+r.width/2,r.top+80);}
    opt.onDone&&opt.onDone({score:score,total:Q.length,pct:pct});}
  el.addEventListener('click',function(e){var b=e.target.closest('button');if(!b||!el.contains(b))return;
    if(b.classList.contains('opt')&&!checked){picked=+b.dataset.k;el.querySelectorAll('.opt').forEach(function(o){o.setAttribute('aria-pressed',o===b);});el.querySelector('[data-q=go]').disabled=false;return;}
    var act=b.dataset.q;
    if(act==='go'&&!checked){var q=Q[i],ans=q.tf?(q.a?0:1):q.a,ok=picked===ans;checked=true;res[i]=ok;if(ok)score++;
      el.querySelectorAll('.opt').forEach(function(o){var k=+o.dataset.k;if(k===ans)o.classList.add('right');else if(k===picked)o.classList.add('wrong');});
      el.querySelector('.fb').innerHTML='<div class="feedback '+(ok?'ok':'no')+'">'+(ok?I.check:I.x)+'<span>'+(ok?'إجابة صحيحة. ':'الإجابة الصحيحة مظلّلة بالأخضر. ')+(q.why||'')+'</span></div>';
      b.textContent=i===Q.length-1?'النتيجة':'التالي';b.dataset.q='next';
      if(ok){var r=b.getBoundingClientRect();celebrate(r.left+r.width/2,r.top,{count:40});}return;}
    if(act==='next'){i++;render();return;}
    if(act==='again'){i=0;score=0;res=[];render();}
  });
  render();}

/* ---------- declarative behaviours ---------- */
document.addEventListener('click',function(e){var b=e.target.closest('[data-pref],[data-act],[data-tab],[data-flip],.cb,[role=switch],[data-copy]');if(!b)return;
  if(b.dataset.pref){var k=b.dataset.pref,v=b.dataset.v;if(k==='motion'||k==='amb')v=!P[k];set(k,v);refreshStudios();if(k==='skin'){var s=SKINS[v];toast(s.fx?'ثيم «'+s.n+'» · '+s.i:'ثيم «'+s.n+'»',{gold:!!s.fx,icon:'palette'});}return;}
  var a=b.dataset.act;
  if(a==='studio'){openStudio();return;}
  if(a==='close-sheet'){closeSheet();return;}
  if(a==='mode'){set('mode',isDark()?'light':'dark');refreshStudios();return;}
  if(a==='reset-look'){Object.assign(P,DEF,{skin:P.skin});save();apply();refreshStudios();toast('عاد المظهر الافتراضي');return;}
  if(a==='celebrate'){var r=b.getBoundingClientRect();celebrate(r.left+r.width/2,r.top);return;}
  if(b.dataset.tab){var g=b.closest('[data-tabs]');if(!g)return;var grp=g.dataset.tabs;g.querySelectorAll('[data-tab]').forEach(function(t){t.setAttribute('aria-selected',t===b);});
    document.querySelectorAll('[data-pane^="'+grp+':"]').forEach(function(p){var on=p.dataset.pane===grp+':'+b.dataset.tab;p.hidden=!on;if(on){p.classList.remove('enter');void p.offsetWidth;p.classList.add('enter');}});return;}
  if(b.hasAttribute('data-flip')){b.classList.toggle('on');return;}
  if(b.getAttribute('role')==='switch'){b.setAttribute('aria-checked',b.getAttribute('aria-checked')!=='true');return;}
  if(b.classList.contains('cb')){var grpc=b.closest('[data-chips]');if(grpc){grpc.querySelectorAll('.cb').forEach(function(c){c.setAttribute('aria-pressed',c===b);});
      var tgt=grpc.dataset.chips,f=b.dataset.f;if(tgt)document.querySelectorAll(tgt+' [data-cat]').forEach(function(it){it.hidden=!(f==='all'||it.dataset.cat.split(' ').indexOf(f)>-1);});}
    else b.setAttribute('aria-pressed',b.getAttribute('aria-pressed')!=='true');return;}
  if(b.dataset.copy){var src=document.querySelector(b.dataset.copy);if(!src)return;var txt=src.innerText;
    (navigator.clipboard?navigator.clipboard.writeText(txt):Promise.reject()).then(function(){toast('تم النسخ');},function(){var r=document.createRange();r.selectNodeContents(src);var s=getSelection();s.removeAllRanges();s.addRange(r);toast('النص محدّد، انسخه يدويًا');});}
});

/* ---------- inline icons: <i data-ic="book"></i> ---------- */
function icons(scope){(scope||document).querySelectorAll('[data-ic]').forEach(function(n){if(I[n.dataset.ic])n.outerHTML=I[n.dataset.ic];});}


/* ---------- edge light that follows the pointer (data-shine="follow") ---------- */
var SH_SEL='.card,.tile,.glass,.btn,.opt,.unit,.period,.todo';
(function(){var mx=-9999,my=-9999,q=false;
  /* read every rect first, then write: interleaving forced a layout per element and made scrolling heavy */
  function upd(){q=false;if(mx<-999||root.getAttribute('data-shine')!=='follow')return;var els=document.querySelectorAll(SH_SEL),rs=[],i;
    for(i=0;i<els.length;i++)rs.push(els[i].getBoundingClientRect());
    for(i=0;i<els.length;i++){var r=rs[i];if(r.bottom<-200||r.top>innerHeight+200)continue;els[i].style.setProperty('--mx',(mx-r.left)+'px');els[i].style.setProperty('--my',(my-r.top)+'px');}}
  addEventListener('pointermove',function(e){if(e.pointerType==='touch')return;mx=e.clientX;my=e.clientY;if(!q){q=true;requestAnimationFrame(upd);}},{passive:true});
  document.addEventListener('pointerleave',function(){mx=my=-9999;},{passive:true});
  addEventListener('scroll',function(){if(!q){q=true;requestAnimationFrame(upd);}},{passive:true});})();

/* ---------- typewriter: <h1 data-type>…</h1>, data-type="جملة|جملة|جملة" cycles ----------
   data-type-speed (ms per letter, default 65) · data-type-delay (ms before start) · data-type-on="view"
   (start when scrolled into view) · data-type-caret="chalk|block" · data-type-loop (keep cycling one phrase).
   Elements without data-type-on type one after another on page open, in page order. */
function graphemes(t){if(window.Intl&&Intl.Segmenter){return Array.from(new Intl.Segmenter('ar',{granularity:'grapheme'}).segment(t),function(x){return x.segment;});}
  var out=[];Array.from(t).forEach(function(ch){if(/[\u064B-\u065F\u0670\u06D6-\u06ED]/.test(ch)&&out.length)out[out.length-1]+=ch;else out.push(ch);});return out;}
function wait(ms){return new Promise(function(r){setTimeout(r,ms);});}
function prepType(el){if(el._tw)return el._tw;var phrases=(el.dataset.type||el.textContent).split('|').map(function(x){return x.trim();}).filter(Boolean);
  var longest=phrases.reduce(function(a,b){return b.length>a.length?b:a;},'');
  el.classList.add('tw');if(el.dataset.typeCaret)el.classList.add('tw-'+el.dataset.typeCaret);
  el.innerHTML='<span class="sr"></span><span class="tw-ghost" aria-hidden="true"></span><span class="tw-live" aria-hidden="true"></span>';
  el.querySelector('.sr').textContent=phrases.join('، ');el.querySelector('.tw-ghost').textContent=longest;
  el._tw={phrases:phrases,live:el.querySelector('.tw-live')};return el._tw;}
function type(el,opt){opt=opt||{};var tw=prepType(el),sp=+(opt.speed||el.dataset.typeSpeed||65),live=tw.live,loop=tw.phrases.length>1||el.hasAttribute('data-type-loop');
  el._run=(el._run||0)+1;var run=el._run;el.classList.remove('tw-end');el.classList.add('tw-on');
  if(RMQ||!P.motion){live.textContent=tw.phrases[0];el.classList.add('tw-end');return Promise.resolve();}
  function typeOut(text){var g=graphemes(text),i=0;return new Promise(function(res){(function step(){if(el._run!==run)return res();i++;live.textContent=g.slice(0,i).join('');
    if(i>=g.length)return res();var ch=g[i-1],d=sp*(0.6+Math.random()*0.8);if(/[،,.!؟?:]/.test(ch))d+=sp*5;else if(ch===' ')d+=sp*.8;setTimeout(step,d);})();});}
  function erase(){var g=graphemes(live.textContent);return new Promise(function(res){(function step(){if(el._run!==run)return res();g.pop();live.textContent=g.join('');if(!g.length)return res();setTimeout(step,sp*.45);})();});}
  var first=typeOut(tw.phrases[0]).then(function(){if(!loop)el.classList.add('tw-end');});
  if(loop){first.then(function(){var k=0;(function cycle(){if(el._run!==run)return;wait(1900).then(erase).then(function(){k=(k+1)%tw.phrases.length;return wait(300).then(function(){return typeOut(tw.phrases[k]);});}).then(cycle);})();});}
  return first;}
function bootTyping(){var all=Array.prototype.slice.call(document.querySelectorAll('[data-type]'));all.forEach(prepType);
  var seq=all.filter(function(el){return el.dataset.typeOn!=='view';}),view=all.filter(function(el){return el.dataset.typeOn==='view';});
  seq.reduce(function(pr,el){return pr.then(function(){return wait(+(el.dataset.typeDelay||250));}).then(function(){return type(el);});},wait(350));
  if(view.length&&'IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){io.unobserve(e.target);wait(+(e.target.dataset.typeDelay||150)).then(function(){type(e.target);});}});},{threshold:.4});view.forEach(function(el){io.observe(el);});}
  else view.forEach(function(el){type(el);});}

/* ---------- boot ---------- */
function boot(){mountScene();icons();apply();bootTyping();var v=document.querySelectorAll('.view');v.forEach(function(x){if(!x.hidden)x.classList.add('enter');});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();

window.TB={I:I,SKINS:SKINS,SKK:SKK,prefs:P,set:set,apply:apply,isDark:isDark,toast:toast,sheet:sheet,type:type,closeSheet:closeSheet,celebrate:celebrate,quiz:quiz,studio:studio,openStudio:openStudio,icons:icons,skinPrev:skinPrev,amb:AMB,
  addSkin:function(id,def){SKINS[id]=def;document.getElementById('tbSkins').textContent=skinCSS();refreshStudios();}};
})();
