let scene=1, total=15, popped=0;

/* AUDIO */
const bgm=document.getElementById("bgm");
const popSound=document.getElementById("popSound");
const blowSound=document.getElementById("blowSound");
const openSound=document.getElementById("openSound");

/* START */
function startApp(){
  bgm.volume=0.5;
  bgm.play().catch(()=>{});
  nextScene();
}

/* NEXT */
function nextScene(){
  document.getElementById("scene"+scene).classList.remove("active");
  scene++;
  document.getElementById("scene"+scene).classList.add("active");

  if(scene===2) typing();
  if(scene===3) createBalloons();
  if(scene===4) startMic();
}

/* TYPING */
let text="you are very special 💖";
let i=0;
function typing(){
  if(i<text.length){
    document.getElementById("typing").innerHTML+=text[i++];
    setTimeout(typing,40);
  }
}

/* BALLOONS */
function createBalloons(){
  let area=document.getElementById("balloons");
  popped=0;

  for(let i=0;i<total;i++){
    let b=document.createElement("div");
    b.className="balloon";

    b.style.left=Math.random()*90+"%";
    b.style.top=Math.random()*70+"%";

    b.onclick=()=>{
      popSound.currentTime=0;
      popSound.play();

      b.remove();
      popped++;

      document.getElementById("counter").innerText=popped+" / "+total;

      if(popped===total){
        setTimeout(nextScene,1000);
      }
    };

    area.appendChild(b);
  }
}

/* MIC DETECT */
let audioContext, mic, analyser, data;

function startMic(){
  navigator.mediaDevices.getUserMedia({audio:true})
  .then(stream=>{
    audioContext=new AudioContext();
    mic=audioContext.createMediaStreamSource(stream);
    analyser=audioContext.createAnalyser();
    mic.connect(analyser);
    data=new Uint8Array(analyser.frequencyBinCount);
    detectBlow();
  });
}

function detectBlow(){
  analyser.getByteFrequencyData(data);
  let volume=data.reduce((a,b)=>a+b)/data.length;

  if(volume>50){
    blowCandle();
    return;
  }
  requestAnimationFrame(detectBlow);
}

/* BLOW */
function blowCandle(){
  blowSound.play();
  document.getElementById("flame").style.display="none";
  setTimeout(nextScene,1200);
}

/* LETTER */
function openLetter(){
  openSound.play();
  document.getElementById("letterText").classList.remove("hidden");
  setTimeout(nextScene,2000);
}

/* HEART PARTICLES */
setInterval(()=>{
  let h=document.createElement("div");
  h.innerHTML="💖";
  h.style.position="absolute";
  h.style.left=Math.random()*100+"%";
  h.style.bottom="0";
  document.body.appendChild(h);

  h.animate([
    {transform:"translateY(0)"},
    {transform:"translateY(-100vh)"}
  ],{duration:3000});

  setTimeout(()=>h.remove(),3000);
},400);

/* SHAKE */
window.addEventListener("devicemotion",(e)=>{
  let a=e.accelerationIncludingGravity;
  if(!a) return;

  let force=Math.abs(a.x+a.y+a.z);
  if(force>25){
    startFireworks();
  }
});

/* FIREWORK */
function startFireworks(){
  let c=document.getElementById("fireworks");
  let ctx=c.getContext("2d");

  c.width=innerWidth;
  c.height=innerHeight;

  for(let i=0;i<200;i++){
    ctx.fillStyle="white";
    ctx.fillRect(Math.random()*c.width,Math.random()*c.height,3,3);
  }
      }
