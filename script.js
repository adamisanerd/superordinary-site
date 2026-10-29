/* PLAY COUNTER: after signing up at goatcounter.com, put your account code between the quotes
   (e.g. if your dashboard is https://superordinary.goatcounter.com, use 'superordinary'). Leave empty to disable. */
const GOATCOUNTER_CODE='';
if(GOATCOUNTER_CODE){const g=document.createElement('script');g.async=true;g.src='https://gc.zgo.at/count.js';g.dataset.goatcounter='https://'+GOATCOUNTER_CODE+'.goatcounter.com/count';document.head.appendChild(g)}
const countPlay=(slug,name)=>{try{if(window.goatcounter&&window.goatcounter.count)window.goatcounter.count({path:'play/'+slug,title:'Play: '+name,event:true})}catch(e){}};
const menu=document.querySelector('.menu');const links=document.querySelector('.nav-links');menu.addEventListener('click',()=>{const open=links.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'close −':'menu +'});links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{links.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='menu +'}));document.getElementById('year').textContent=new Date().getFullYear();

(()=>{const audio=document.querySelector('audio');const btns=[...document.querySelectorAll('.track')];const player=document.querySelector('.player');const fill=player.querySelector('.fill');const bar=player.querySelector('.bar');const now=player.querySelector('.now');let cur=-1;
const fmt=t=>{t=Math.floor(t||0);return Math.floor(t/60)+':'+String(t%60).padStart(2,'0')};
const sync=()=>btns.forEach((b,i)=>{const on=i===cur;b.classList.toggle('active',on);b.classList.toggle('playing',on&&!audio.paused);b.setAttribute('aria-label',(on&&!audio.paused?'pause ':'play ')+b.querySelector('.t-name').textContent)});
const play=i=>{if(i===cur){audio.paused?audio.play():audio.pause();return}cur=i;audio.src=btns[i].dataset.src;player.hidden=false;fill.style.width='0';counted=false;audio.play()};let counted=false;
btns.forEach((b,i)=>b.addEventListener('click',()=>play(i)));
['play','pause'].forEach(e=>audio.addEventListener(e,sync));audio.addEventListener('playing',()=>{if(!counted&&cur>-1){counted=true;const b=btns[cur];countPlay(b.dataset.src.split('/').pop().replace('.mp3',''),b.querySelector('.t-name').textContent)}});
audio.addEventListener('timeupdate',()=>{if(audio.duration){fill.style.width=(audio.currentTime/audio.duration*100)+'%'}now.textContent=fmt(audio.currentTime)});
audio.addEventListener('ended',()=>{if(cur<btns.length-1)play(cur+1);else{sync()}});
const seek=x=>{const r=bar.getBoundingClientRect();if(audio.duration)audio.currentTime=Math.min(1,Math.max(0,(x-r.left)/r.width))*audio.duration};
bar.addEventListener('click',e=>seek(e.clientX));
bar.addEventListener('keydown',e=>{if(e.key==='ArrowRight')audio.currentTime+=5;if(e.key==='ArrowLeft')audio.currentTime-=5});
})();