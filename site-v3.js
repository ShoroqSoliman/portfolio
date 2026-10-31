
const $=s=>document.querySelector(s);
const LS={get:k=>{try{return localStorage.getItem(k)}catch(x){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(x){}}};
const BASE=window.CONTENT;
function norm(d){d.ui=Object.assign({},BASE.ui,d.ui||{});const p=d.profile;['logo','ring','strip'].forEach(k=>{if(p[k]==null)p[k]=BASE.profile[k]});if(!p.lines)p.lines=p.bio?[p.bio]:[];return d}
norm(BASE);
let D=BASE,lang=LS.get('lang')||'ar',authed=false,cur='pro',io;
const t=o=>!o?'':typeof o=='string'?o:(o[lang]||o.en||o.ar||'');
const e=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const u=k=>t(D.ui&&D.ui[k])||t(BASE.ui[k]);
const calm=matchMedia('(prefers-reduced-motion:reduce)').matches,fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
/* ---------- icons ---------- */
const IC=p=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const I_MAIL=IC('<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3.5 7.5l8.5 6 8.5-6"/>'),I_TEL=IC('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>'),I_IN=IC('<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 11v5M8 8v.01M12 16v-5M12 13a2.5 2.5 0 0 1 5 0v3"/>'),I_SP=IC('<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>');
/* ---------- site ---------- */
const YT=/(?:youtu\.be\/|v=)([\w-]{11})/;
function mediaHTML(s,type){const y=(s||'').match(YT);
 return y?`<iframe src="https://www.youtube.com/embed/${y[1]}" allowfullscreen loading="lazy"></iframe>`:type=='video'?`<video src="${e(s)}" controls playsinline preload="metadata"></video>`:`<img src="${e(s)}" alt="" loading="lazy">`}
function block(b){
 switch(b.kind){
  case 'text':return `<p class="tx rv" dir="auto">${e(t(b.text))}</p>`;
  case 'tags':return `<div class="tags rv">${t(b.text).split(/[,،]/).filter(x=>x.trim()).map(x=>`<span dir="auto">${e(x.trim())}</span>`).join('')}</div>`;
  case 'card':return `<article class="card rv">${b.date?`<span class="dt" dir="ltr">${e(b.date)}</span>`:''}<h3>${e(t(b.title))}</h3><h4>${e(t(b.sub))}</h4>${t(b.text)?`<p>${e(t(b.text))}</p>`:''}</article>`;
  case 'media':return b.src?`<figure class="rv">${mediaHTML(b.src,b.type)}</figure>`:'';
 }return '';
}
/* image / video slot at the start of a section */
function cover(s){const c=s.cover;if(!c||!c.src)return '';const v=YT.test(c.src)||c.type=='video';
 return `<figure class="cover${v?' v':''} rv">${mediaHTML(c.src,c.type)}</figure>`}
/* project: two parallel lines that open to reveal the project */
function proj(b,i){
 const ar=lang=='ar',has=!!(t(b.title)||b.src),link=/^https?:\/\//i.test(b.link||'')?b.link:'';
 const ttl=t(b.title)||u('projectSoon');
 const m=b.src?`<figure>${mediaHTML(b.src,b.type)}</figure>`:has?'':`<div class="pj-ph" dir="auto">${e(u('projectSoonBox'))}</div>`;
 const x=(t(b.sub)||t(b.text)||link)?`<div class="pj-x">${t(b.sub)?`<h4 dir="auto">${e(t(b.sub))}</h4>`:''}${t(b.text)?`<p dir="auto">${e(t(b.text))}</p>`:''}${link?`<a class="btn o" href="${e(link)}" target="_blank" rel="noopener">${e(u('openProject'))}</a>`:''}</div>`:'';
 return `<div class="proj rv" role="button" tabindex="0" aria-expanded="false"><div class="pj-h"><span class="pj-n">${String(i+1).padStart(2,'0')}</span><span class="pj-t" dir="auto">${e(ttl)}</span>${t(b.sub)?`<span class="pj-s" dir="auto">${e(t(b.sub))}</span>`:''}<i class="pj-ic" aria-hidden="true"></i></div><div class="pj-b"><div class="pj-w"><div class="pj-c${m&&x?'':' solo'}">${m}${x}</div></div></div></div>`;
}
function sec(s){
 const B=k=>s.blocks.filter(b=>b.kind==k).map(block).join('');
 const logos=s.blocks.filter(b=>b.kind=='logo').map(b=>`<div>${b.src?`<img src="${e(b.src)}" alt="${e(b.name)}">`:e(b.name)}</div>`).join('');
 const cards=B('card'),med=B('media'),pj=s.blocks.filter(b=>b.kind=='project').map(proj).join('');
 return `<section id="${e(s.id)}"><div class="wrap"><h2 class="rv">${e(t(s.title))}</h2>${cover(s)}${B('text')}${B('tags')}${cards?`<div class="${s.layout=='timeline'?'tl':'grid'}">${cards}</div>`:''}${med?`<div class="grid">${med}</div>`:''}${pj?`<div class="projs">${pj}</div>`:''}${logos?`<div class="mq rv"><div class="mt">${logos+logos}</div></div>`:''}</div></section>`;
}
/* round frame: the sentence is written once and slowly circles the photo */
function ringSVG(){
 const w=(t(D.profile.ring)||'').trim();if(!w)return '';
 return `<svg class="ring" viewBox="0 0 200 200" aria-hidden="true"><defs><path id="cp" d="M11,100a89,89 0 1,1 178,0a89,89 0 1,1 -178,0"/></defs><circle class="fr" cx="100" cy="100" r="84"/><g><animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="40s" repeatCount="indefinite"/><text><textPath href="#cp" startOffset="0">${e(w)}</textPath></text></g></svg>`;
}
function draw(){
 const p=D.profile,S=D.sections.filter(s=>s.visible!==false),ar=lang=='ar',nm=t(p.name);
 document.documentElement.lang=lang;document.documentElement.dir=ar?'rtl':'ltr';document.title=nm+' | '+t(p.title);
 const kw=t(p.strip).split(/[,،]/).filter(x=>x.trim()).map(x=>`<span>${e(x.trim())}</span>`).join(''),logo=[...(p.logo||'S.S')].map(c=>c=='.'?'<b>.</b>':e(c)).join('');
 $('#app').innerHTML=`
 <nav><div class="wrap"><a class="logo" href="#" onclick="go('');return false"><span>${logo}</span></a>
  <ul>${S.map(s=>`<li><a href="#${e(s.id)}" onclick="document.getElementById('${e(s.id)}').scrollIntoView({behavior:'smooth'});return false">${e(t(s.title))}</a></li>`).join('')}<li><a href="#contact" onclick="document.getElementById('contact').scrollIntoView({behavior:'smooth'});return false">${e(u('contact'))}</a></li></ul>
  <button class="lang" id="lg">${ar?'English':'عربي'}</button></div></nav>
 <header class="hero" id="top"><div class="bl b1"></div><div class="bl b2"></div><div class="wrap"><div>
  <small class="in">${e(t(p.title))}</small><h1 class="in">${e(nm)}</h1><div class="in hl">${(p.lines||[]).filter(x=>t(x)).map(x=>`<p dir="auto">${e(t(x))}</p>`).join('')}</div>
  <div class="in"><a class="btn" href="mailto:${e(p.email)}">${I_SP}${e(u('workWithMe'))}</a> <a class="btn o" href="${e(p.linkedin)}" target="_blank" rel="noopener">${I_IN}${e(u('linkedin'))}</a>
  <div class="stats">${(p.stats||[]).map(x=>`<div><b dir="ltr">${e(x.n)}</b><span>${e(t(x.l))}</span></div>`).join('')}</div></div></div>
  <div class="pw in">${ringSVG()}
  <div class="ph">${p.photo?`<img src="${e(p.photo)}" alt="${e(nm)}">`:e(nm[0]||'')}</div></div></div></header>
 ${kw?`<div class="strip" aria-hidden="true"><div class="mt">${(kw+kw+kw+kw)}</div></div>`:''}
 ${S.map(sec).join('')}
 <footer id="contact"><div class="wrap"><h2 class="rv">${e(u('gotProject'))}</h2>
  <a class="big" href="mailto:${e(p.email)}">${I_MAIL}<span>${e(p.email)}</span></a>
  <div class="ln"><a href="tel:${e(p.phone)}" dir="ltr">${I_TEL}${e(p.phone)}</a><a href="${e(p.linkedin)}" target="_blank" rel="noopener">${I_IN}${e(u('linkedin'))}</a></div>
  <p style="margin-top:48px;font-size:14px">© ${new Date().getFullYear()} ${e(nm)}</p></div></footer>`;
 $('#lg').onclick=()=>{lang=ar?'en':'ar';LS.set('lang',lang);draw()};
 if(calm)document.querySelectorAll('.ring animateTransform').forEach(a=>a.remove());
 document.querySelectorAll('.proj').forEach(pj=>{
  const tog=()=>{const o=pj.classList.toggle('open');pj.setAttribute('aria-expanded',o)};
  pj.onclick=ev=>{if(ev.target.closest('a,video,iframe'))return;tog()};
  pj.onkeydown=ev=>{if(ev.target===pj&&(ev.key=='Enter'||ev.key==' ')){ev.preventDefault();tog()}};
 });
 io&&io.disconnect();io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('on');io.unobserve(x.target)}}),{threshold:.1});
 document.querySelectorAll('.rv').forEach(n=>io.observe(n));
}
/* ---------- pen cursor + handwriting scribbles ---------- */
const PEN='<svg viewBox="0 0 40 40" aria-hidden="true"><g stroke="#111113" stroke-width="1.3" stroke-linejoin="round"><path d="M7.4 28.1l4.5 4.5 14.1-14.1-4.5-4.5z" fill="#f78fb9"/><path d="M16.6 18.9l2.1-2.1 4.5 4.5-2.1 2.1z" fill="#9fdcb0"/><path d="M4 36l3.4-7.9 4.5 4.5z" fill="#fbe6d4"/><path d="M21.5 13.9l4.5 4.5 2.8-2.8-4.5-4.5z" fill="#f6f2f4"/></g><path d="M4 36l1.6-3.7 2.1 2.1z" fill="#111113"/></svg>';
let mx=innerWidth/2,my=innerHeight/2,cx=mx,cy=my,gx=0,gy=0,lx=0,ly=0,moved=false,cu,cs,pl;
function mkCursor(){cu=document.createElement('div');cu.className='cu';cu.style.opacity=0;cu.innerHTML='<div class="cs">'+PEN+'</div>';document.body.append(cu);cs=cu.firstChild;document.documentElement.classList.add('fx')}
/* dark ruled paper behind everything: its lines light up softly where the pen passes */
const LH=36;
(function mkPaper(){const a=document.createElement('div'),b=document.createElement('div'),c=document.createElement('div');
 a.className='paper';b.className='paper lit';c.className='pfx';document.body.prepend(c);document.body.prepend(b);document.body.prepend(a);pl=b})();
/* a hint of handwriting resting on a paper line: loops and strokes, never readable letters */
function scrPath(w){let x=0,d='M0 12';while(x<w){const k=Math.random(),s=4+Math.random()*6,h=3+Math.random()*7;
 if(k<.35)d+=`c${s*.2} ${-h} ${s*.8} ${-h} ${s} 0`;
 else if(k<.6)d+=`c${s*.2} ${h*.5} ${s*.8} ${h*.5} ${s} 0`;
 else if(k<.85)d+=`c${s*.6} ${-h} ${-s*.3} ${-h} ${s*.1} 0c${s*.3} ${h*.4} ${s*.7} ${h*.4} ${s*.9} 0`;
 else d+=`l${s*.5} ${-h*1.2} l${s*.5} ${h*1.2}`;x+=s}return d}
function inkLine(x,y){const box=document.querySelector('.pfx');if(!box||box.childElementCount>6)return;
 const line=35.5+LH*Math.round((y-35.5)/LH),w=34+Math.random()*40,n=document.createElementNS('http://www.w3.org/2000/svg','svg');
 n.setAttribute('viewBox',`-2 -4 ${w+8} 30`);n.setAttribute('width',w+8);n.setAttribute('height',30);
 n.style.left=(x-w*.7)+'px';n.style.top=(line-16)+'px';
 n.innerHTML=`<path pathLength="1" d="${scrPath(w)}"/>`;
 n.firstChild.onanimationend=()=>n.remove();box.append(n)}
addEventListener('pointermove',ev=>{
 mx=ev.clientX;my=ev.clientY;
 if(!moved){moved=true;cx=gx=lx=mx;cy=gy=ly=my}
 if(ev.pointerType=='touch'||!fine)return;
 if(!cu){mkCursor();cx=mx;cy=my}
 cu.style.opacity=1;
 cu.classList.toggle('hv',!!(ev.target.closest&&ev.target.closest('a,button,[role=button],.lang,input,textarea,select,label')));
 if(!calm&&Math.hypot(mx-lx,my-ly)>90){lx=mx;ly=my;inkLine(mx,my)}
});
addEventListener('pointerdown',()=>{if(cu)cu.classList.add('dn')});
addEventListener('pointerup',()=>cu&&cu.classList.remove('dn'));
document.documentElement.addEventListener('mouseleave',()=>{if(cu)cu.style.opacity=0;if(pl)pl.style.opacity=0});
document.documentElement.addEventListener('mouseenter',()=>{if(pl)pl.style.opacity=1});
(function tick(){
 const g=$('#gl');cx+=(mx-cx)*.45;cy+=(my-cy)*.45;gx+=(mx-gx)*.1;gy+=(my-gy)*.1;
 if(g)g.style.transform=`translate(${gx}px,${gy}px)`;
 if(pl&&fine&&moved){pl.style.setProperty('--mx',gx+'px');pl.style.setProperty('--my',gy+'px')}
 if(cu)cu.style.transform=`translate(${cx}px,${cy}px)`;
 requestAnimationFrame(tick)})();
/* ---------- routing ---------- */
function go(h){location.hash=h}
function route(){const dr=LS.get('draft');try{D=location.hash=='#preview'&&dr?norm(JSON.parse(dr)):BASE}catch(x){D=BASE}draw()}
addEventListener('hashchange',route);route();
