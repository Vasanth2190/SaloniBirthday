(()=>{"use strict";
const $=id=>document.getElementById(id);
const intro=$("intro"),peek=$("peekButton"),stage=$("phoneStage"),screen=$("chatScreen"),messages=$("chatMessages"),typing=$("typingRow"),skip=$("skipButton"),ending=$("ending"),audio=$("textAudio");
const chat=[
 {who:"user",text:"Hello!"},
 {who:"kitty",text:"Hiii, Vasanth! 🎀"},
 {who:"user",text:"Are you ready for Saloni's birthday??"},
 {who:"kitty",text:"Yes, I am! I've been waiting for this! ♡"},
 {who:"user",text:"She's here! Be quick!"},
 {who:"kitty",text:"Wait, wait—who even is she? And why are you doing SO much for her? 😭"},
 {who:"user",text:"Why? I don't know, honestly."},
 {who:"user",text:"Maybe because someone once gave me shade when I needed it most. Someone who stopped to ask if I was okay."},
 {who:"kitty",text:"Awww… that's actually really sweet. 🥹"},
 {who:"kitty",text:"But what do you expect in return?"},
 {who:"user",text:"Expectations? There weren't any."},
 {who:"user",text:"I just hope I can make her smile on her birthday. That's all."},
 {who:"kitty",text:"…Okay, now I REALLY want to meet her. 💗"},
 {who:"kitty",text:"Oh! She's here! I'm ready!"},
 {who:"user",text:"Alright. Let's go."}
];
let started=false,finished=false,skipRequested=false,timer=null;
const sleep=ms=>new Promise(resolve=>{timer=setTimeout(resolve,ms)});
function wait(ms){return new Promise(resolve=>setTimeout(resolve,ms))}
function duration(text){return Math.max(2100,Math.min(6500,1450+text.length*34))}
function addMessage(item){const wrap=document.createElement('div');wrap.className='message '+item.who;const name=document.createElement('span');name.className='message-name';name.textContent=item.who==='user'?'Vasanth':'Hello Kitty';const bubble=document.createElement('div');bubble.className='bubble';bubble.textContent=item.text;const stamp=document.createElement('span');stamp.className='message-time';stamp.textContent='♡';wrap.append(name,bubble,stamp);messages.appendChild(wrap);requestAnimationFrame(()=>{screen.scrollTo({top:screen.scrollHeight,behavior:'smooth'})})}
async function pause(ms){const start=performance.now();while(performance.now()-start<ms){if(skipRequested)return;await wait(100)}}
async function begin(){if(started)return;started=true;intro.classList.add('leaving');intro.hidden=true;stage.hidden=false;skip.hidden=false;try{audio.currentTime=0;audio.volume=.62;const p=audio.play();if(p)await p.catch(()=>{})}catch(e){}await wait(700);for(const item of chat){if(skipRequested)break;if(item.who==='kitty'){typing.hidden=false;screen.scrollTo({top:screen.scrollHeight,behavior:'smooth'});await pause(650);typing.hidden=true;if(skipRequested)break}addMessage(item);await pause(duration(item.text));if(skipRequested)break}typing.hidden=true;skip.hidden=true;finished=true;stage.classList.add('finished');ending.hidden=false;screen.scrollTo({top:screen.scrollHeight,behavior:'smooth'})}
peek.addEventListener('click',begin);skip.addEventListener('click',()=>{skipRequested=true;messages.replaceChildren();});
})();
