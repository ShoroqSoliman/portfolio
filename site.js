
const $=s=>document.querySelector(s);
const LS={get:k=>{try{return localStorage.getItem(k)}catch(x){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(x){}}};
const BASE=window.CONTENT;
let D=BASE,lang=LS.get('lang')||'ar',authed=false,cur='pro',io;
const t=o=>!o?'':typeof o=='string'?o:(o[lang]||o.en||o.ar||'');
const e=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
/* ---------- site ---------- */
function block(b){
 switch(b.kind){
  case 'text':return `<p class="tx rv" dir="auto">${e(t(b.text))}</p>`;
  case 'tags':return `<div class="tags rv">${t(b.text).split(/[,،]/).filter(x=>x.trim()).map(x=>`<span dir="auto">${e(x.trim())}</span>`).join('')}</div>`;
  case 'card':return `<article class="card rv">${b.date?`<span class="dt" dir="ltr">${e(b.date)}</span>`:''}<h3>${e(t(b.title))}</h3><h4>${e(t(b.sub))}</h4>${t(b.text)?`<p>${e(t(b.text))}</p>`:''}</article>`;
  case 'media':{const s=b.src||'',y=s.match(/(?:youtu\.be\/|v=)([\w-]{11})/);
   return `<figure class="rv">${y?`<iframe src="https://www.youtube.com/embed/${y[1]}" allowfullscreen loading="lazy"></iframe>`:b.type=='video'?`<video src="${e(s)}" controls playsinline preload="metadata"></video>`:`<img src="${e(s)}" alt="" loading="lazy">`}</figure>`}
 }return '';
}
function sec(s){
 const B=k=>s.blocks.filter(b=>b.kind==k).map(block).join('');
 const logos=s.blocks.filter(b=>b.kind=='logo').map(b=>`<div>${b.src?`<img src="${e(b.src)}" alt="${e(b.name)}">`:e(b.name)}</div>`).join('');
 const cards=B('card'),med=B('media');
 return `<section id="${e(s.id)}"><div class="wrap"><h2 class="rv">${e(t(s.title))}</h2>${B('text')}${B('tags')}${cards?`<div class="${s.layout=='timeline'?'tl':'grid'}">${cards}</div>`:''}${med?`<div class="grid">${med}</div>`:''}${logos?`<div class="mq rv"><div class="mt">${logos+logos}</div></div>`:''}</div></section>`;
}
function draw(){
 const p=D.profile,S=D.sections.filter(s=>s.visible!==false),ar=lang=='ar',nm=t(p.name);
 document.documentElement.lang=lang;document.documentElement.dir=ar?'rtl':'ltr';document.title=nm+' | '+t(p.title);
 const tg=D.sections.flatMap(s=>s.blocks).find(b=>b.kind=='tags'),kw=tg?t(tg.text).split(/[,،]/).filter(x=>x.trim()).map(x=>`<span>${e(x.trim())}</span>`).join(''):'';
 $('#app').innerHTML=`
 <nav><div class="wrap"><a class="logo" href="#" onclick="go('');return false">${e(nm[0]||'S')}<b>.</b></a>
  <ul>${S.map(s=>`<li><a href="#${e(s.id)}" onclick="document.getElementById('${e(s.id)}').scrollIntoView({behavior:'smooth'});return false">${e(t(s.title))}</a></li>`).join('')}<li><a href="#contact" onclick="document.getElementById('contact').scrollIntoView({behavior:'smooth'});return false">${ar?'تواصل':'Contact'}</a></li></ul>
  <button class="lang" id="lg">${ar?'English':'عربي'}</button></div></nav>
 <header class="hero" id="top"><div class="bl b1"></div><div class="bl b2"></div><div class="wrap"><div>
  <small class="in">${e(t(p.title))}</small><h1 class="in">${e(nm)}</h1><p class="in" dir="auto">${e(t(p.bio))}</p>
  <div class="in"><a class="btn" href="mailto:${e(p.email)}">${ar?'نشتغل مع بعض':'Work with me'}</a> <a class="btn o" href="${e(p.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>
  <div class="stats">${(p.stats||[]).map(x=>`<div><b dir="ltr">${e(x.n)}</b><span>${e(t(x.l))}</span></div>`).join('')}</div></div></div>
  <div class="pw in"><svg class="ring" viewBox="0 0 200 200" aria-hidden="true"><defs><path id="cp" d="M100,100 m-90,0 a90,90 0 1,1 180,0 a90,90 0 1,1 -180,0"/></defs><text><textPath href="#cp" textLength="560" lengthAdjust="spacing">CONTENT CREATOR ✦ COPYWRITER ✦ SCRIPTWRITER ✦ STORYTELLER ✦ </textPath></text></svg>
  <div class="ph">${p.photo?`<img src="${e(p.photo)}" alt="${e(nm)}">`:e(nm[0]||'')}</div></div></div></header>
 ${kw?`<div class="strip" aria-hidden="true"><div class="mt">${(kw+kw+kw+kw)}</div></div>`:''}
 ${S.map(sec).join('')}
 <footer id="contact"><div class="wrap"><h2 class="rv">${ar?'عندك مشروع؟':'Got a project?'}</h2>
  <a class="big" href="mailto:${e(p.email)}">${e(p.email)}</a>
  <div class="ln"><a href="tel:${e(p.phone)}" dir="ltr">${e(p.phone)}</a><a href="${e(p.linkedin)}" target="_blank" rel="noopener">LinkedIn</a></div>
  <p style="margin-top:48px;font-size:14px">© ${new Date().getFullYear()} ${e(nm)}</p></div></footer>`;
 $('#lg').onclick=()=>{lang=ar?'en':'ar';LS.set('lang',lang);draw()};
 io&&io.disconnect();io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('on');io.unobserve(x.target)}}),{threshold:.1});
 document.querySelectorAll('.rv').forEach(n=>io.observe(n));
}
addEventListener('pointermove',ev=>{const g=$('#gl');if(g)g.style.transform=`translate(${ev.clientX}px,${ev.clientY}px)`});
/* ---------- routing ---------- */
function go(h){location.hash=h}
function route(){const dr=LS.get('draft');try{D=location.hash=='#preview'&&dr?JSON.parse(dr):BASE}catch(x){D=BASE}draw()}
addEventListener('hashchange',route);route();
