/* protect.js: anti-copy protection for the whole site (user pages + admin panel).
   Konihi website cha ek pan shabd select / copy karu shakat nahi, ani karaycha prayatna kela
   tar popup yeto: "Copy karta yenar nahi".
   Fakt input fields (login, register, contact form, textarea) madhe type / copy / paste chalte.
   Blocks: select, copy, cut, drag, right-click, long-press (Android + iPhone), Ctrl+C/X/A/S/U/P,
   F12 / DevTools shortcuts, print, print-screen (blur) ani open developer tools. */
(function(){
if(window.__protect)return;window.__protect=true;
var DEVTOOLS_GUARD=true; /* false kela tar developer-tools overlay band hoil */
var d=document,de=d.documentElement;
var css='html.nocopy,html.nocopy *,html.nocopy *::before,html.nocopy *::after{-webkit-user-select:none!important;-moz-user-select:none!important;-ms-user-select:none!important;user-select:none!important;-webkit-touch-callout:none!important}'
+'html.nocopy input,html.nocopy textarea,html.nocopy select{-webkit-user-select:text!important;-moz-user-select:text!important;user-select:text!important;-webkit-touch-callout:default!important}'
+'html.nocopy img,html.nocopy svg,html.nocopy a{-webkit-user-drag:none!important}'
+'html.nocopy ::selection{background:transparent!important;color:inherit!important}'
+'html.nocopy ::-moz-selection{background:transparent!important;color:inherit!important}'
+'html.nocopy input::selection,html.nocopy textarea::selection{background:#b7d4ff!important;color:#000!important}'
+'html.pcHide body{visibility:hidden!important}html.pcHide{background:#0f2d14!important}html.pcHide #pcNote{visibility:visible!important}'
+'#pcWM{position:fixed;inset:0;pointer-events:none;z-index:2147483000;background-repeat:repeat}'
+'#pcNote{position:fixed;left:50%;bottom:calc(22px + env(safe-area-inset-bottom,0px));transform:translate(-50%,20px);width:max-content;max-width:min(92vw,470px);display:flex;align-items:flex-start;gap:12px;background:#0f2d14;color:#fff;border:1.5px solid #f0a500;border-radius:14px;padding:13px 18px;font:500 13px/1.45 system-ui,-apple-system,"Segoe UI","Noto Sans Devanagari",Mangal,sans-serif;box-shadow:0 10px 34px rgba(0,0,0,.35);z-index:2147483646;opacity:0;pointer-events:none;transition:opacity .25s,transform .25s}'
+'#pcNote.show{opacity:1;transform:translate(-50%,0)}'
+'#pcNote .pcI{font-size:24px;flex-shrink:0;line-height:1.2}#pcNote .pcR{display:block;margin:3px 0}#pcNote .pcR b{display:inline-block;min-width:52px;margin-right:6px;color:#f0a500;font-weight:700}'
+'#guard{position:fixed;inset:0;z-index:2147483647;background:#05070f;color:#eef2ff;display:grid;place-items:center;text-align:center;padding:24px;font-family:sans-serif}'
+'#guard h2{margin:0 0 8px;font-size:28px}#guard p{margin:0;color:#9aa6cc}'
+'@media print{html.nocopy body>*{display:none!important}html.nocopy body:before{content:"Printing is disabled on this website.";display:block;padding:40px;font:20px sans-serif;color:#000}}';
var st=d.createElement("style");st.id="protect-css";st.textContent=css;(d.head||de).appendChild(st);
de.classList.add("nocopy");

/* ── POPUP: user la kalte ki copy hot nahi ── */
var noteEl=null,noteT=null,lastNote=0;
var LB=["मराठी","हिंदी","English"];
var MSG={
 copy:["या वेबसाइटवरील मजकूर कॉपी किंवा सिलेक्ट करण्याची परवानगी नाही.","इस वेबसाइट की सामग्री कॉपी या सेलेक्ट करने की अनुमति नहीं है।","Copying or selecting content from this website is not allowed."],
 opt:["हा पर्याय बंद आहे: सेव्ह / व्ह्यू सोर्स / प्रिंट येथे चालत नाही.","यह विकल्प बंद है: सेव / व्यू सोर्स / प्रिंट यहाँ उपलब्ध नहीं है।","This option is disabled: save / view source / print is not allowed here."],
 dev:["डेव्हलपर टूल्स या वेबसाइटवर वापरता येणार नाहीत.","इस वेबसाइट पर डेवलपर टूल्स का उपयोग नहीं किया जा सकता।","Developer tools are not allowed on this website."],
 shot:["स्क्रीनशॉट घेण्याची परवानगी नाही.","स्क्रीनशॉट लेने की अनुमति नहीं है।","Taking screenshots is not allowed."]
};
function note(key){
 var now=Date.now();if(now-lastNote<1500)return;lastNote=now;
 if(!d.body)return;
 var m=MSG[key]||MSG.copy;
 if(!noteEl){noteEl=d.createElement("div");noteEl.id="pcNote";noteEl.setAttribute("role","alert");d.body.appendChild(noteEl)}
 noteEl.innerHTML='<span class="pcI">🚫</span><span>'+m.map(function(t,i){return '<span class="pcR"><b>'+LB[i]+'</b>'+t+'</span>'}).join("")+'</span>';
 void noteEl.offsetWidth;noteEl.classList.add("show");
 clearTimeout(noteT);noteT=setTimeout(function(){noteEl.classList.remove("show")},4200);
}
function inField(t){return !!(t&&t.closest&&t.closest("input,textarea,select,[contenteditable='true']"))}
function isCtl(t){return !!(t&&t.closest&&t.closest("a,button,label,[onclick],summary"))}
function stop(e){e.preventDefault();e.stopPropagation();return false}

/* copy / cut: page madhun kahich baher jaat nahi (fakt input fields madhe allowed) */
["copy","cut"].forEach(function(n){d.addEventListener(n,function(e){if(inField(e.target))return;
 try{if(e.clipboardData)e.clipboardData.setData("text/plain","Copying is disabled on this website.")}catch(x){}
 note();stop(e)},true)});
d.addEventListener("contextmenu",function(e){if(!inField(e.target)){note();stop(e)}},true);
d.addEventListener("dragstart",stop,true);
d.addEventListener("selectstart",function(e){if(!inField(e.target))stop(e)},true);

/* desktop: mouse ne text var drag kela kinva double/triple-click kela = select karaycha prayatna */
var md=null;
d.addEventListener("mousedown",function(e){
 if(e.button!==0||inField(e.target)||isCtl(e.target)){md=null;return}
 md={x:e.clientX,y:e.clientY};
 if(e.detail>=2)note();
},true);
d.addEventListener("mousemove",function(e){
 if(!md)return;
 if(!(e.buttons&1)){md=null;return}
 if(Math.abs(e.clientX-md.x)+Math.abs(e.clientY-md.y)>14){md=null;note()}
},true);
d.addEventListener("mouseup",function(){md=null},true);

/* Android / iPhone: text var long-press = select karaycha prayatna */
var lp=null;
d.addEventListener("touchstart",function(e){
 clearTimeout(lp);
 if(inField(e.target)||isCtl(e.target))return;
 lp=setTimeout(function(){note()},550);
},{passive:true,capture:true});
["touchmove","touchend","touchcancel"].forEach(function(n){d.addEventListener(n,function(){clearTimeout(lp)},{passive:true,capture:true})});

/* kahi tari select zale tar lagech clear kara */
d.addEventListener("selectionchange",function(){
 if(inField(d.activeElement))return;
 var s=window.getSelection&&window.getSelection();
 if(s&&s.rangeCount&&!s.isCollapsed){try{s.removeAllRanges()}catch(x){}note()}
});

d.addEventListener("keydown",function(e){
 var k=(e.key||"").toLowerCase(),c=e.ctrlKey||e.metaKey,f=inField(e.target);
 var bad=e.key==="F12"
  ||(c&&["s","u","p"].indexOf(k)>-1)
  ||(c&&!f&&["c","x","a"].indexOf(k)>-1)
  ||(c&&e.shiftKey&&["i","j","c","k"].indexOf(k)>-1)
  ||(e.metaKey&&e.altKey&&["i","j","u","c"].indexOf(k)>-1);
 if(bad){
  if(c&&["c","x","a"].indexOf(k)>-1)note();
  else if(c&&["s","u","p"].indexOf(k)>-1)note("opt");
  else note("dev");
  stop(e)}
},true);

/* ── SCREENSHOT (best-effort) ──
   Browser OS-level screenshot pooran rokू shakat nahi (vishesh karun mobile var). Mhanun:
   1) Screenshot shortcut / window focus gelyavar page lagech lapavto (black)
   2) Page var halka watermark (naav/email + vel) - screenshot leak zala tar kunacha te kalte */
var WATERMARK=true; /* false kela tar watermark band */
var hideT=null;
function hidePage(ms){de.classList.add("pcHide");clearTimeout(hideT);hideT=null;if(ms)hideT=setTimeout(showPage,ms)}
function showPage(){clearTimeout(hideT);hideT=null;de.classList.remove("pcHide")}
function isShotKey(e){
 var k=e.key||"",kl=k.toLowerCase();
 return k==="PrintScreen"||k==="Snapshot"||e.code==="PrintScreen"
  ||(e.metaKey&&e.shiftKey&&(["3","4","5"].indexOf(kl)>-1||e.code==="KeyS"));
}
["keydown","keyup"].forEach(function(n){d.addEventListener(n,function(e){
 if(!isShotKey(e))return;
 try{var cp=navigator.clipboard.writeText("Screenshots are disabled on this website.");if(cp&&cp.catch)cp.catch(function(){})}catch(x){}
 hidePage(2500);note("shot");stop(e)},true)});
window.addEventListener("blur",function(){hidePage(0)});
window.addEventListener("pagehide",function(){hidePage(0)});
d.addEventListener("visibilitychange",function(){if(d.hidden)hidePage(0);else showPage()});
["focus","pageshow"].forEach(function(n){window.addEventListener(n,showPage)});
["pointerdown","touchstart"].forEach(function(n){d.addEventListener(n,function(){if(de.classList.contains("pcHide"))showPage()},{passive:true,capture:true})});

/* watermark: tiled, halka, click la adthala yet nahi */
function wmText(){
 var who="";
 try{if(typeof CURRENT!=="undefined"&&CURRENT)who=CURRENT.email||CURRENT.name||""}catch(x){}
 try{if(!who&&typeof auth!=="undefined"&&auth.currentUser)who=auth.currentUser.email||""}catch(x){}
 var t=new Date().toLocaleString("en-IN",{dateStyle:"short",timeStyle:"short"});
 return "Krushi Shop"+(who?" \u2022 "+who:"")+" \u2022 "+t;
}
function esc(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
var wmEl=null;
function drawWM(){
 if(!WATERMARK||!d.body)return;
 if(!wmEl){wmEl=d.createElement("div");wmEl.id="pcWM";d.body.appendChild(wmEl)}
 var svg='<svg xmlns="http://www.w3.org/2000/svg" width="360" height="200"><text x="20" y="130" transform="rotate(-24 180 100)" font-family="sans-serif" font-size="15" font-weight="600" fill="#0f2d14" fill-opacity="0.11">'+esc(wmText())+'</text></svg>';
 wmEl.style.backgroundImage='url("data:image/svg+xml;utf8,'+encodeURIComponent(svg)+'")';
}
if(d.readyState==="loading")d.addEventListener("DOMContentLoaded",drawWM);else drawWM();
setInterval(drawWM,20000);

/* developer tools: console open asel tarach Chrome getter chalvto (fakt desktop) */
if(DEVTOOLS_GUARD&&!("ontouchstart" in window)){
 var open=false,probe=new Image(),box=null;
 Object.defineProperty(probe,"id",{get:function(){open=true;return"x"}});
 setInterval(function(){open=false;console.log(probe);console.clear();
  if(open&&!box&&d.body){box=d.createElement("div");box.id="guard";box.innerHTML="<div><h2>Developer tools detected</h2><p>कृपया डेव्हलपर टूल्स बंद करा.<br>कृपया डेवलपर टूल्स बंद करें।<br>Please close developer tools to view this website.</p></div>";d.body.appendChild(box)}
  else if(!open&&box){box.remove();box=null}},1000)}
})();
