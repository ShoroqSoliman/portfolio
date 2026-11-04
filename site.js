
const $=s=>document.querySelector(s);
const LS={get:k=>{try{return localStorage.getItem(k)}catch(x){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(x){}}};
const BASE=window.CONTENT;
let D=BASE,lang=LS.get('lang')||'ar',authed=false,cur='pro',io;
const t=o=>!o?'':typeof o=='string'?o:(o[lang]||o.en||o.ar||'');
const e=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const calm=matchMedia('(prefers-reduced-motion:reduce)').matches,fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
/* ---------- icons ---------- */
const IC=p=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const I_MAIL=IC('<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3.5 7.5l8.5 6 8.5-6"/>'),I_TEL=IC('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>'),I_IN=IC('<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 11v5M8 8v.01M12 16v-5M12 13a2.5 2.5 0 0 1 5 0v3"/>'),I_SP=IC('<path d="M12 3c.6 4.4 4.6 8.4 9 9-4.4.6-8.4 4.6-9 9-.6-4.4-4.6-8.4-9-9 4.4-.6 8.4-4.6 9-9z"/>');
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
 const ttl=t(b.title)||(ar?'مشروع قريبًا':'Project coming soon');
 const m=b.src?`<figure>${mediaHTML(b.src,b.type)}</figure>`:has?'':`<div class="pj-ph" dir="auto">${ar?'قريبًا… المشروع ده لسه بيتجهز':'Coming soon… this project is being prepared'}</div>`;
 const x=(t(b.sub)||t(b.text)||link)?`<div class="pj-x">${t(b.sub)?`<h4 dir="auto">${e(t(b.sub))}</h4>`:''}${t(b.text)?`<p dir="auto">${e(t(b.text))}</p>`:''}${link?`<a class="btn o" href="${e(link)}" target="_blank" rel="noopener">${ar?'افتح المشروع':'Open project'}</a>`:''}</div>`:'';
 return `<div class="proj rv" role="button" tabindex="0" aria-expanded="false"><div class="pj-h"><span class="pj-n">${String(i+1).padStart(2,'0')}</span><span class="pj-t" dir="auto">${e(ttl)}</span>${t(b.sub)?`<span class="pj-s" dir="auto">${e(t(b.sub))}</span>`:''}<i class="pj-ic" aria-hidden="true"></i></div><div class="pj-b"><div class="pj-w"><div class="pj-c${m&&x?'':' solo'}">${m}${x}</div></div></div></div>`;
}
function sec(s){
 const B=k=>s.blocks.filter(b=>b.kind==k).map(block).join('');
 const logos=s.blocks.filter(b=>b.kind=='logo').map(b=>`<div>${b.src?`<img src="${e(b.src)}" alt="${e(b.name)}">`:e(b.name)}</div>`).join('');
 const cards=B('card'),med=B('media'),pj=s.blocks.filter(b=>b.kind=='project').map(proj).join('');
 return `<section id="${e(s.id)}"><div class="wrap"><h2 class="rv">${e(t(s.title))}</h2>${cover(s)}${B('text')}${B('tags')}${cards?`<div class="${s.layout=='timeline'?'tl':'grid'}">${cards}</div>`:''}${med?`<div class="grid">${med}</div>`:''}${pj?`<div class="projs">${pj}</div>`:''}${logos?`<div class="mq rv"><div class="mt">${logos+logos}</div></div>`:''}</div></section>`;
}
/* rounded-square frame with text that travels around the photo */
function ringSVG(){
 const L=675.36,w='CONTENT CREATOR ✦ COPYWRITER ✦ SCRIPTWRITER ✦ STORYTELLER ✦ ',one=w+w;
 return `<svg class="ring" viewBox="0 0 200 200" aria-hidden="true"><defs><path id="cp" d="M36,10H164A26,26 0 0 1 190,36V164A26,26 0 0 1 164,190H36A26,26 0 0 1 10,164V36A26,26 0 0 1 36,10Z"/></defs><use href="#cp" class="fr"/><text><textPath href="#cp" startOffset="0" textLength="${L*2}" lengthAdjust="spacing">${one+one}<animate attributeName="startOffset" from="0" to="-${L}" dur="38s" repeatCount="indefinite"/></textPath></text></svg>`;
}
function draw(){
 const p=D.profile,S=D.sections.filter(s=>s.visible!==false),ar=lang=='ar',nm=t(p.name);
 document.documentElement.lang=lang;document.documentElement.dir=ar?'rtl':'ltr';document.title=nm+' | '+t(p.title);
 const tg=D.sections.flatMap(s=>s.blocks).find(b=>b.kind=='tags'),kw=tg?t(tg.text).split(/[,،]/).filter(x=>x.trim()).map(x=>`<span>${e(x.trim())}</span>`).join(''):'';
 $('#app').innerHTML=`
 <nav><div class="wrap"><a class="logo" href="#" onclick="go('');return false"><img src="logo-s.png" alt="${e(nm)}"></a>
  <ul>${S.map(s=>`<li><a href="#${e(s.id)}" onclick="document.getElementById('${e(s.id)}').scrollIntoView({behavior:'smooth'});return false">${e(t(s.title))}</a></li>`).join('')}<li><a href="#contact" onclick="document.getElementById('contact').scrollIntoView({behavior:'smooth'});return false">${ar?'تواصل':'Contact'}</a></li></ul>
  <button class="lang" id="lg">${ar?'English':'عربي'}</button></div></nav>
 <header class="hero" id="top"><div class="bl b1"></div><div class="bl b2"></div><div class="wrap"><div>
  <small class="in">${e(t(p.title))}</small><h1 class="in">${e(nm)}</h1><p class="in" dir="auto">${e(t(p.bio))}</p>
  <div class="in"><a class="btn" href="mailto:${e(p.email)}">${I_SP}${ar?'نشتغل مع بعض':'Work with me'}</a> <a class="btn o" href="${e(p.linkedin)}" target="_blank" rel="noopener">${I_IN}LinkedIn</a>
  <div class="stats">${(p.stats||[]).map(x=>`<div><b dir="ltr">${e(x.n)}</b><span>${e(t(x.l))}</span></div>`).join('')}</div></div></div>
  <div class="pw in">${ringSVG()}
  <div class="ph">${p.photo?`<img src="${e(p.photo)}" alt="${e(nm)}">`:e(nm[0]||'')}</div></div></div></header>
 ${kw?`<div class="strip" aria-hidden="true"><div class="mt">${(kw+kw+kw+kw)}</div></div>`:''}
 ${S.map(sec).join('')}
 <footer id="contact"><div class="wrap"><h2 class="rv">${ar?'عندك مشروع؟':'Got a project?'}</h2>
  <a class="big" href="mailto:${e(p.email)}">${I_MAIL}<span>${e(p.email)}</span></a>
  <div class="ln"><a href="tel:${e(p.phone)}" dir="ltr">${I_TEL}${e(p.phone)}</a><a href="${e(p.linkedin)}" target="_blank" rel="noopener">${I_IN}LinkedIn</a></div>
  <p style="margin-top:48px;font-size:14px">© ${new Date().getFullYear()} ${e(nm)}</p></div></footer>`;
 $('#lg').onclick=()=>{lang=ar?'en':'ar';LS.set('lang',lang);draw()};
 if(calm)document.querySelectorAll('.ring animate').forEach(a=>a.remove());
 document.querySelectorAll('.proj').forEach(pj=>{
  const tog=()=>{const o=pj.classList.toggle('open');pj.setAttribute('aria-expanded',o)};
  pj.onclick=ev=>{if(ev.target.closest('a,video,iframe'))return;tog()};
  pj.onkeydown=ev=>{if(ev.target===pj&&(ev.key=='Enter'||ev.key==' ')){ev.preventDefault();tog()}};
 });
 io&&io.disconnect();io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('on');io.unobserve(x.target)}}),{threshold:.1});
 document.querySelectorAll('.rv').forEach(n=>io.observe(n));
}
/* ---------- star cursor + background glow ---------- */
const STAR='<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3.2l3.6 8.2 9 .8-6.8 5.9 2.1 8.8-7.7-4.6-8 4.7 2.2-8.7-7.1-5.9 9-.9z"/></svg>';
let mx=innerWidth/2,my=innerHeight/2,cx=mx,cy=my,gx=0,gy=0,ang=0,tx=0,ty=0,moved=false,cu,cs;
function mkCursor(){cu=document.createElement('div');cu.className='cu';cu.style.opacity=0;cu.innerHTML='<div class="cs">'+STAR+'</div>';document.body.append(cu);cs=cu.firstChild;document.documentElement.classList.add('fx')}
function spark(x,y){const s=document.createElement('i'),z=7+Math.random()*9;s.className='sp'+(Math.random()<.3?' s':'');
 Object.assign(s.style,{left:x+'px',top:y+'px',width:z+'px',height:z+'px'});
 s.style.setProperty('--dx',(Math.random()*44-22)+'px');s.style.setProperty('--dy',(10+Math.random()*34)+'px');s.style.setProperty('--r',(Math.random()*240-120)+'deg');
 s.onanimationend=()=>s.remove();document.body.append(s)}
function burst(x,y){for(let i=0;i<8;i++){const r=document.createElement('i');r.className='ray';r.style.setProperty('--x',x+'px');r.style.setProperty('--y',y+'px');r.style.setProperty('--a',i*45+'deg');r.onanimationend=()=>r.remove();document.body.append(r)}}
addEventListener('pointermove',ev=>{
 mx=ev.clientX;my=ev.clientY;
 if(!moved){moved=true;cx=gx=tx=mx;cy=gy=ty=my}
 if(ev.pointerType=='touch'||!fine)return;
 if(!cu){mkCursor();cx=mx;cy=my}
 cu.style.opacity=1;
 cu.classList.toggle('hv',!!(ev.target.closest&&ev.target.closest('a,button,[role=button],.lang,input,textarea,select,label')));
 if(!calm&&Math.hypot(mx-tx,my-ty)>26){tx=mx;ty=my;spark(mx,my)}
});
addEventListener('pointerdown',ev=>{if(cu)cu.classList.add('dn');if(!calm)burst(ev.clientX,ev.clientY)});
addEventListener('pointerup',()=>cu&&cu.classList.remove('dn'));
document.documentElement.addEventListener('mouseleave',()=>{if(cu)cu.style.opacity=0});
(function tick(){
 const g=$('#gl');cx+=(mx-cx)*.38;cy+=(my-cy)*.38;gx+=(mx-gx)*.1;gy+=(my-gy)*.1;
 if(g)g.style.transform=`translate(${gx}px,${gy}px)`;
 if(cu){cu.style.transform=`translate(${cx}px,${cy}px)`;ang+=calm?0:.6+Math.min(10,Math.hypot(mx-cx,my-cy)*.2);cs.style.rotate=ang+'deg'}
 requestAnimationFrame(tick)})();
/* ---------- routing ---------- */
function go(h){location.hash=h}
function route(){const dr=LS.get('draft');try{D=location.hash=='#preview'&&dr?JSON.parse(dr):BASE}catch(x){D=BASE}draw()}
addEventListener('hashchange',route);route();
