(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const P=window.PROJECTS,root=document.documentElement,fine=matchMedia('(pointer:fine)').matches;
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
root.classList.add('js');$('#yr').textContent=new Date().getFullYear();

/* theme */
$('#theme').onclick=()=>{const t=root.dataset.theme==='dark'?'light':'dark';root.dataset.theme=t;try{localStorage.setItem('theme',t)}catch(e){}
$('meta[name=theme-color]').content=t==='dark'?'#0e0e13':'#f4f1e8'};

/* build skills + project cards */
$('#skillGrid').innerHTML=SKILLS.map((s,i)=>`<div class="sk rv"><span class="mono">0${i+1}</span><h3>${s[0]}</h3><p>${s[1]}</p></div>`).join('');
$('#track').innerHTML=P.map((p,i)=>`<article class="card" tabindex="0" data-i="${i}" style="--c:${p.c}" aria-label="Open ${p.title}">
<div class="art"><img src="${p.img}" alt="${p.title} thumbnail" loading="lazy" data-h="1"><div class="ov">View project ↗</div></div>
<div class="meta"><div><h3>${p.title}</h3><p class="mono">${p.type}</p></div><span class="n">0${i+1}/0${P.length}</span></div></article>`).join('');

/* split words for heading reveal */
$$('.words').forEach(h=>{h.innerHTML=h.textContent.split(' ').map((w,i)=>`<span><i style="--i:${i}">${w}</i></span> `).join('')});

/* scroll reveals */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});
$$('.rv,.words').forEach(el=>io.observe(el));

/* nav highlight */
const links=$$('#nav a'),secs=links.map(a=>$(a.getAttribute('href')));
const so=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-45% 0px -50% 0px'});
secs.forEach(s=>s&&so.observe(s));

/* pinned horizontal scroll (desktop/tablet) + parallax */
const hs=$('.hs'),track=$('#track'),prog=$('#prog'),mob=matchMedia('(max-width:700px)'),par=$$('[data-p]'),imgs=$$('.card img');
let dist=0;
const size=()=>{if(mob.matches){hs.style.height='';return}dist=track.scrollWidth-innerWidth;hs.style.height=(dist+innerHeight)+'px'};
const tick=()=>{
  const y=scrollY;
  if(mob.matches){prog.style.width=(track.scrollLeft/Math.max(1,track.scrollWidth-track.clientWidth)*100)+'%'}
  else{const k=Math.min(1,Math.max(0,(y-hs.offsetTop)/Math.max(1,dist)));track.style.transform=`translate3d(${-k*dist}px,0,0)`;prog.style.width=k*100+'%';
    imgs.forEach(im=>{const r=im.parentNode.getBoundingClientRect();im.style.translate=`${(r.left+r.width/2-innerWidth/2)*-.06}px 0`})}
  if(!reduce)par.forEach(el=>{el.style.translate=`${mx*(+el.dataset.p)*-120}px ${y*(+el.dataset.p)}px`});
};
let mx=0,raf;const req=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(tick)};
addEventListener('scroll',req,{passive:true});addEventListener('resize',()=>{size();req()});track.addEventListener('scroll',req,{passive:true});
addEventListener('load',()=>{size();req()});size();req();

/* cursor, magnetic buttons, spotlight, tilt */
if(fine){
  const cur=$('#cur'),ct=$('#curT');let x=0,y=0,cx=0,cy=0;
  addEventListener('pointermove',e=>{x=e.clientX;y=e.clientY;mx=(x/innerWidth-.5);req()});
  (function loop(){cx+=(x-cx)*.2;cy+=(y-cy)*.2;cur.style.transform=`translate(${cx}px,${cy}px)`;requestAnimationFrame(loop)})();
  document.addEventListener('pointerover',e=>{const t=e.target.closest('a,button,.chip,.sk,.card,input');
    cur.classList.toggle('h',!!t);const c=e.target.closest('.card');cur.classList.toggle('v',!!c);ct.textContent=c?'View':''});
  $$('.mag').forEach(m=>{m.addEventListener('pointermove',e=>{const r=m.getBoundingClientRect();m.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.25}px,${(e.clientY-r.top-r.height/2)*.35}px)`});m.addEventListener('pointerleave',()=>m.style.transform='')});
  $$('.card').forEach(c=>{const a=$('.art',c);c.addEventListener('pointermove',e=>{const r=a.getBoundingClientRect(),px=(e.clientX-r.left)/r.width,py=(e.clientY-r.top)/r.height;
    a.style.setProperty('--mx',px*100+'%');a.firstElementChild.nextElementSibling.style.setProperty('--mx',px*100+'%');a.firstElementChild.nextElementSibling.style.setProperty('--my',py*100+'%');
    a.style.transform=`perspective(900px) rotateY(${(px-.5)*8}deg) rotateX(${(.5-py)*8}deg)`});c.addEventListener('pointerleave',()=>a.style.transform='')});
}
$$('.sk').forEach(s=>s.addEventListener('pointermove',e=>{const r=s.getBoundingClientRect();s.style.setProperty('--mx',e.clientX-r.left+'px');s.style.setProperty('--my',e.clientY-r.top+'px')}));

/* Behance modal */
const M=$('#modal'),fr=$('#fr'),L=$('#mL');let cur=0,timer;
const embed=id=>`https://www.behance.net/embed/project/${id}?ilo0=1`;
const gallery=id=>`https://www.behance.net/gallery/${id}`;
function open(i){cur=(i+P.length)%P.length;const p=P[cur];$('#mT').textContent=p.title;$('#mO').href=gallery(p.id);
  L.innerHTML=`Loading project…<br><a class="lnk" href="${gallery(p.id)}" target="_blank" rel="noopener">Open on Behance ↗</a>`;fr.style.visibility='hidden';
  fr.onload=()=>{fr.style.visibility='visible';L.style.display='none'};L.style.display='grid';fr.src=embed(p.id);
  M.classList.add('open');M.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';history.replaceState(null,'','#work-'+p.id)}
function close(){M.classList.remove('open');M.setAttribute('aria-hidden','true');document.body.style.overflow='';fr.src='about:blank';history.replaceState(null,'','#work')}
track.addEventListener('click',e=>{const c=e.target.closest('.card');if(c)open(+c.dataset.i)});
track.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.dataset.i)open(+e.target.dataset.i)});
$('#mX').onclick=close;$('#mP').onclick=()=>open(cur-1);$('#mN').onclick=()=>open(cur+1);
M.addEventListener('click',e=>{if(e.target===M)close()});
addEventListener('keydown',e=>{if(!M.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowRight')open(cur+1);if(e.key==='ArrowLeft')open(cur-1)});
/* mobile: drag the grab handle down to close */
const g=$('.grab'),sh=$('.sheet');let sy=null;
g.addEventListener('touchstart',e=>{sy=e.touches[0].clientY;sh.style.transition='none'},{passive:true});
g.addEventListener('touchmove',e=>{if(sy!==null)sh.style.transform=`translateY(${Math.max(0,e.touches[0].clientY-sy)}px)`},{passive:true});
g.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientY-sy;sy=null;sh.style.transition='';sh.style.transform='';if(d>120)close()});
const m=location.hash.match(/^#work-(\d+)/);if(m){const i=P.findIndex(p=>p.id===m[1]);if(i>-1)addEventListener('load',()=>open(i))}

/* contact form → mailto */
$('#form').addEventListener('submit',e=>{e.preventDefault();const f=e.target;
  location.href=`mailto:the3rdbershni@gmail.com?subject=${encodeURIComponent('Portfolio inquiry from '+f.n.value)}&body=${encodeURIComponent(f.s.value)}`});
})();
