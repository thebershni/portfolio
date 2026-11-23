(()=>{
const $=s=>document.querySelector(s),root=document.documentElement,slug=$('#detailPage').dataset.project,P=window.PROJECTS||[],i=P.findIndex(p=>p.slug===slug),p=P[i];
if(!p){location.href='../projects.html';return;}
document.title=`${p.title} — Abdelmohsine Berchni`;$('meta[name=description]').content=p.summary;
$('#detailCategory').textContent=p.category+' / '+p.kind;$('#detailTitle').textContent=p.title;$('#detailSummary').textContent=p.summary;$('#detailOverview').textContent=p.summary;
$('#detailCover').src='../'+p.cover;$('#detailCover').alt=p.title+' project presentation';
$('#detailMeta').innerHTML=`<span><b>Category</b>${p.category}</span><span><b>Project type</b>${p.kind}</span><span><b>Materials</b>${p.gallery.length} visuals</span>`;
$('#detailServices').innerHTML=p.services.map(s=>`<span class="service-chip">${s}</span>`).join('');
if (p.behanceUrl) {
  const link = document.createElement('a');
  link.href = p.behanceUrl;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.className = 'behance-project-link';
  link.textContent = 'View the AI storytelling video on Behance ↗';
  $('#detailServices').append(link);
}
const images=p.gallery.filter(src=>src!==p.cover);$('#detailImages').innerHTML=images.length?images.map((src,n)=>`<figure class="detail-image"><img src="../${src}" alt="${p.title} — visual ${n+1}" loading="lazy"></figure>`).join(''):'<p class="mono">Additional project visuals can be added here later.</p>';
const prev=P[(i-1+P.length)%P.length],next=P[(i+1)%P.length];$('#prevProject').href=prev.slug+'.html';$('#prevProject').textContent='← '+prev.title;$('#nextProject').href=next.slug+'.html';$('#nextProject').textContent=next.title+' →';
$('#theme').addEventListener('click',()=>{const t=root.dataset.theme==='dark'?'light':'dark';root.dataset.theme=t;try{localStorage.setItem('theme',t)}catch(e){};document.querySelector('meta[name=theme-color]')?.setAttribute('content',t==='dark'?'#0e0e13':'#f4f1e8')});$('#yr').textContent=new Date().getFullYear();
})();

// Original custom cursor behavior, shared with the homepage.
(()=>{const cur=document.getElementById('cur'),label=document.getElementById('curT');if(!cur||!matchMedia('(pointer:fine)').matches)return;let x=0,y=0,cx=0,cy=0;addEventListener('pointermove',e=>{x=e.clientX;y=e.clientY});(function loop(){cx+=(x-cx)*.22;cy+=(y-cy)*.22;cur.style.transform=`translate(${cx}px,${cy}px)`;requestAnimationFrame(loop)})();document.addEventListener('pointerover',e=>{const target=e.target.closest('a,button,.project-tile,.detail-image');cur.classList.toggle('h',!!target);const visual=e.target.closest('.project-tile,.detail-image');cur.classList.toggle('v',!!visual);if(label)label.textContent=visual?'View':''})})();
