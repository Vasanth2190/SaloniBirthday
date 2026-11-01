(()=>{"use strict";
const $=id=>document.getElementById(id), screens=["tapGate","loadingScene","battleScene","winScene"].map($);
const aud={ding:$("dingSfx"),loading:$("loadingMusic"),battle:$("battleMusic"),screech:$("screechSfx"),attack:$("attackSfx"),low:$("lowSfx"),counter:$("opponentAttackSfx"),catch:$("catchSfx"),move:$("moveSfx"),catch2:$("catch2Sfx"),end:$("endSfx"),win:$("winMusic")};
let busy=false,started=false,used=0,oppHP=100,loveHP=100,muted=false,typing=0;
const sleep=ms=>new Promise(r=>setTimeout(r,matchMedia("(prefers-reduced-motion: reduce)").matches?Math.min(ms,120):ms));
function show(target){screens.forEach(s=>s.hidden=s!==target);window.scrollTo(0,0)}
function stop(a){if(!a)return;a.pause();try{a.currentTime=0}catch(e){}}
function play(a,loop=false,volume=.85){a.loop=loop;a.volume=volume;a.muted=muted;try{return a.play().then(()=>true).catch(()=>false)}catch(e){return Promise.resolve(false)}}
function dingNow(){const a=aud.ding;if(!a)return;try{a.pause();a.currentTime=0}catch(e){}a.loop=false;a.volume=.9;a.muted=muted;const p=a.play();if(p&&p.catch)p.catch(()=>{});}
function ended(a){return new Promise(r=>{if(!a||a.ended||a.error){r();return}const done=()=>r();a.addEventListener("ended",done,{once:true});a.addEventListener("error",done,{once:true})})}
async function playAndWait(a,fallback=12000){stop(a);const ok=await play(a,false,.9);if(!ok){await sleep(250);return false}await Promise.race([ended(a),sleep(fallback)]);return true}
async function once(a){stop(a);return play(a,false,.9)}
async function type(text,pace=43){const token=++typing,el=$("battleText");el.textContent="";for(let i=0;i<text.length;i++){if(token!==typing)return;el.textContent+=text[i];await sleep(text[i]===" "?Math.max(8,pace*.4):pace)}}
function menus(which){$("mainMenu").hidden=which!=="main";$("moveMenu").hidden=which!=="moves"}
function update(){[["opponentHpFill","opponentHpText",oppHP],["loveHpFill","loveHpText",loveHP]].forEach(([f,t,v])=>{$(f).style.width=v+"%";$(t).textContent=v+" / 100";$(f).classList.toggle("warning",v<=60&&v>30);$(f).classList.toggle("danger",v<=30)})}
function setupImage(img,fb){img.addEventListener("error",()=>{img.style.display="none";fb.style.display="none"});img.addEventListener("load",()=>{img.style.display="block";fb.style.display="none"})}
setupImage($("opponentImage"),$("opponentFallback"));setupImage($("loveImage"),$("loveFallback"));
function effect(cls,text,x,y,duration=1300){const el=document.createElement("div");el.className="effect "+cls;el.textContent=text;el.style.left=x+"%";el.style.top=y+"%";$("attackLayer").appendChild(el);setTimeout(()=>el.remove(),duration+100)}
async function lightTransition(){const l=document.createElement("div");Object.assign(l.style,{position:"fixed",inset:0,zIndex:80,pointerEvents:"none",background:"radial-gradient(circle,#fff 0%,#fff8dc 9%,transparent 58%)",opacity:0,transition:"opacity .45s"});document.body.appendChild(l);requestAnimationFrame(()=>l.style.opacity=1);await sleep(520);show($("battleScene"));await sleep(80);l.style.opacity=0;await sleep(500);l.remove()}
async function loader(){
 show($("loadingScene"));
 $("readyPanel").hidden=true;$("loadingBall").classList.add("spinning");
 $("loadingBar").style.opacity="1";$("loadingPercent").style.opacity="1";
 $("loadingFill").style.width="0%";$("loadingPercent").textContent="0%";$("loadingBar").setAttribute("aria-valuenow","0");
 $("loadingMessage").textContent="Preparing the battlefield…";
 const progress=p=>{const total=p.totalBytes||1,percent=Math.max(0,Math.min(100,Math.round((p.loadedBytes||0)/total*100)));$("loadingFill").style.width=percent+"%";$("loadingPercent").textContent=percent+"%";$("loadingBar").setAttribute("aria-valuenow",String(percent));$("loadingMessage").textContent=p.failed?"Checking the last few files…":"Preparing the battlefield…"};
 let result={failed:0};
 if(window.BirthdayPreloader) result=await window.BirthdayPreloader.ensureGroup("battle",progress);
 const images=["assets/loading.png","assets/battleg.png","assets/battle back.png","assets/opponent.png","assets/love.png","assets/win.png"];
 await Promise.all(images.map(src=>new Promise(resolve=>{const img=new Image();img.onload=()=>resolve();img.onerror=()=>resolve();img.src=src;if(img.decode)img.decode().then(resolve).catch(resolve)})));
 $("loadingFill").style.width="100%";$("loadingPercent").textContent="100%";$("loadingBar").setAttribute("aria-valuenow","100");
 $("loadingBall").classList.remove("spinning");$("loadingBall").style.transform="rotate(0deg)";
 $("loadingMessage").textContent=result.failed?"A few files will load when needed.":(result.uncached?"Ready — some files may download when needed.":"Everything is ready.");
 $("loadingBar").style.opacity=".4";$("loadingPercent").style.opacity=".4";
 await sleep(180);$("readyPanel").hidden=false;$("soundButton").hidden=false;
}
let selectedPreloadMode="quick";
const quickModeButton=$("quickModeButton"),fullModeButton=$("fullModeButton"),startButton=$("tapToInteract");
function selectPreloadMode(mode){selectedPreloadMode=mode;[[quickModeButton,"quick"],[fullModeButton,"full"]].forEach(([button,value])=>{const selected=value===mode;button.classList.toggle("is-selected",selected);button.setAttribute("aria-pressed",String(selected))});$("gateHint").textContent=mode==="quick"?"Quick Start selected · Opens sooner; remaining files load quietly ♡":"Full Experience selected · All project media loads before the reveal ♡"}
quickModeButton.addEventListener("click",()=>{if(!started)selectPreloadMode("quick")});
fullModeButton.addEventListener("click",()=>{if(!started)selectPreloadMode("full")});
startButton.addEventListener("click",async()=>{
 if(started)return;started=true;startButton.disabled=true;quickModeButton.disabled=true;fullModeButton.disabled=true;
 $("gatePreloadStatus").hidden=false;$("gateHint").textContent=selectedPreloadMode==="full"?"Full Experience can take a little longer on mobile data.":"Getting the first scene ready…";
 startButton.innerHTML='<span class="play-icon">✦</span> PREPARING…';
 const update=p=>{const total=p.totalBytes||1,percent=Math.max(0,Math.min(100,Math.round((p.loadedBytes||0)/total*100)));$("gatePreloadFill").style.width=percent+"%";$("gatePreloadPercent").textContent=percent+"%";$("gatePreloadStatus").querySelector("[role=progressbar]").setAttribute("aria-valuenow",String(percent));$("gatePreloadMessage").textContent=selectedPreloadMode==="full"?"Preparing every scene and memory…":"Preparing the opening scene…"};
 try{if(window.BirthdayPreloader)await window.BirthdayPreloader.start(selectedPreloadMode,update)}catch(error){console.warn("Preloading could not complete; continuing with normal loading.",error)}
 try{sessionStorage.setItem("birthday-preload-mode",selectedPreloadMode)}catch(e){}
 window.location.href="reveal.html";
});
const no=$("noButton");function dodge(e){if(e)e.preventDefault();const w=no.offsetWidth||80,h=no.offsetHeight||48,p=12,old=no.getBoundingClientRect();let x,y,n=0;do{x=p+Math.random()*Math.max(1,innerWidth-w-p*2);y=70+Math.random()*Math.max(1,innerHeight-h-90);n++}while(n<12&&Math.hypot(x-old.left,y-old.top)<Math.min(140,innerWidth*.28));no.style.position="fixed";no.style.left=x+"px";no.style.top=y+"px";no.style.zIndex=50;no.style.transform=`rotate(${Math.random()*18-9}deg)`}
["pointerenter","pointerdown","click"].forEach(e=>no.addEventListener(e,dodge));
$("soundButton").addEventListener("click",async()=>{muted=!muted;Object.values(aud).forEach(a=>a.muted=muted);$("soundLabel").textContent=muted?"Music muted":"Music on";if(!muted&&aud.loading.paused)await play(aud.loading,true,.48)});
$("yesButton").addEventListener("click",startBattle);
async function startBattle(){if(busy)return;busy=true;stop(aud.loading);await lightTransition();used=0;oppHP=100;loveHP=100;update();menus("");const op=$("opponentPlatformAnchor");op.classList.remove("arrived","captured");op.style.opacity="0";op.style.transform="translateX(130%)";$("captureBall").className="capture-ball";$("captureStars").className="capture-stars";$("attackLayer").replaceChildren();await play(aud.battle,true,.42);op.style.opacity="1";op.style.transform="";void op.offsetWidth;op.classList.add("arrived");await sleep(1300);await once(aud.screech);await type("A Hot Saloni has appeared",46);await sleep(1000);await type("Choose your action",46);menus("main");busy=false}
$("fightButton").addEventListener("click",async()=>{if(busy)return;dingNow();if(used>=3){await type("She is in Love!!!",46);menus("main");return}await type("Choose Love's move",43);menus("moves")});
$("catchButton").addEventListener("click",async()=>{if(busy)return;dingNow();if(used<3){await type("She is still stubborn",45);menus("main");return}await catchSequence()});
$("bagButton").addEventListener("click",async()=>{if(busy)return;dingNow();await type("Your are broke!!",45);menus("main")});
$("runButton").addEventListener("click",async()=>{if(busy)return;dingNow();await type("Running From a baddie seriously?!!",42);menus("main")});
document.querySelectorAll(".move-button").forEach(b=>b.addEventListener("click",()=>{if(busy||used>=3)return;dingNow();loveMove(b.dataset.move)}));
const moves={"Love Shower":shower,"Love Shock":shock,"Rose Throw":rose,"Love Kiss":kiss};
async function loveMove(name){if(busy||used>=3)return;busy=true;used++;menus("");await type("Lovchu used "+name+"!",43);await sleep(220);await moves[name]();$("opponentImage").classList.add("hit-flash");await type("It's Super Effective!",43);oppHP=used===3?1:Math.max(1,oppHP-31);update();await playAndWait(aud.attack,8000);if(used===3)await playAndWait(aud.low,8000);$("opponentImage").classList.remove("hit-flash");await type("Saloni used Cuteness!",43);await playAndWait(aud.counter,8000);effect("kiss","♡",70,38,900);loveHP=Math.max(88,loveHP-3);update();$("loveImage").classList.add("hit-flash");await type("Its not very effective because Lovchu is already in love",36);$("loveImage").classList.remove("hit-flash");if(used<3){await type("Choose your action",43);menus("main")}else{await type("Too much Love",45);menus("main")}busy=false}
async function shower(){for(let i=0;i<6;i++){effect("heart-fall","♥",58+Math.random()*17,31+Math.random()*6,1250);await sleep(90)}await sleep(780)}
async function shock(){effect("shock-bolt","ϟ",53,38,850);for(let i=0;i<7;i++)effect("shock-heart","♥",55+i*2,39+(i%3)*2,900);await sleep(900)}
async function rose(){effect("rose","🌹",31,67,1050);await sleep(1000)}
async function kiss(){effect("kiss","💋",32,64,1200);await sleep(1100)}
async function catchSequence(){if(busy)return;busy=true;menus("");await type("Vasanth threw a Poké Ball!",42);const ball=$("captureBall"),stage=$("battleStage").getBoundingClientRect(),love=$("lovePlatformAnchor").getBoundingClientRect(),op=$("opponentPlatformAnchor").getBoundingClientRect();
const sx=(love.left-stage.left+love.width*.55)/stage.width*100,sy=(love.top-stage.top+love.height*.25)/stage.height*100,tx=(op.left-stage.left+op.width*.54)/stage.width*100,ty=(op.top-stage.top+op.height*.62)/stage.height*100;
ball.className="capture-ball";ball.style.left=sx+"%";ball.style.top=sy+"%";ball.style.setProperty("--flight-x",((tx-sx)/100*stage.width)+"px");ball.style.setProperty("--flight-y",((ty-sy)/100*stage.height)+"px");void ball.offsetWidth;ball.classList.add("throwing");await sleep(1080);stop(aud.battle);await play(aud.catch,false,.9);await type("The Poké Ball hit Saloni!",42);await Promise.race([ended(aud.catch),sleep(3000)]);
const opAnchor=$("opponentPlatformAnchor");
opAnchor.classList.add("captured");
opAnchor.style.transformOrigin="center center";
opAnchor.style.transition="transform 1.15s cubic-bezier(.22,.72,.2,1), opacity 1.15s ease";
opAnchor.style.transform="scale(.03)";
opAnchor.style.opacity="0";
await sleep(1180);
ball.className="capture-ball shaking";
ball.style.left=tx+"%";ball.style.top=ty+"%";
const stars=$("captureStars");
stars.style.left=tx+"%";stars.style.top=ty+"%";
stars.style.transform="translate(-50%,-50%)";
stars.style.zIndex="15";
stars.classList.remove("burst");
await play(aud.move,false,.9);
await type("The Poké Ball is shaking…",43);
await Promise.race([ended(aud.move),sleep(6000)]);
stop(aud.move);
ball.className="capture-ball settled";
ball.style.left=tx+"%";ball.style.top=ty+"%";
stars.classList.add("burst");
await playAndWait(aud.catch2,10000);
await play(aud.end,false,.9);
await type("You caught a baddie",46);
await Promise.race([ended(aud.end),sleep(15000)]);
stop(aud.battle);stop(aud.catch);stop(aud.catch2);stop(aud.move);await play(aud.win,true,.55);const fade=document.createElement("div");Object.assign(fade.style,{position:"fixed",inset:0,zIndex:90,background:"#000",opacity:0,transition:"opacity .7s",pointerEvents:"none"});document.body.appendChild(fade);requestAnimationFrame(()=>fade.style.opacity=1);await sleep(760);show($("winScene"));await sleep(150);fade.style.opacity=0;await sleep(760);fade.remove();busy=false}
Object.values(aud).forEach(a=>a.addEventListener("error",()=>console.warn("Missing audio asset:",a.getAttribute("src"))));
if(new URLSearchParams(window.location.search).has("load")){
 started=true;
 // Start loading music immediately when the loading page opens.
 play(aud.loading,true,.48);
 loader();
}else{show($("tapGate"))}
$("continueButton").addEventListener("click",async()=>{dingNow();window.location.href="evolve.html"});
})();