
const $=s=>document.querySelector(s);
const LS={get:k=>{try{return localStorage.getItem(k)}catch(x){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(x){}}};
const BASE=window.CONTENT;
let D=BASE,lang=LS.get('lang')||'ar',authed=false,cur='pro',io;
const t=o=>!o?'':typeof o=='string'?o:(o[lang]||o.en||o.ar||'');
const e=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
/* ---------- admin ---------- */
async function sha(s){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
function gate(){
 $('#app').innerHTML=`<div class="login"><h2 style="margin-bottom:18px">Admin</h2><label>Password</label><input id="pwi" type="password" autofocus><button class="btn" id="pwb" style="width:100%">Log in</button><p class="st" id="pwe" style="margin-top:12px"></p><p class="hint"><a href="index.html" style="color:var(--pk)">Back to site</a></p></div>`;
 const ok=async()=>{if(await sha($('#pwi').value)==(D.pwh||BASE.pwh)){authed=true;adminUI()}else $('#pwe').textContent='Wrong password.'};
 $('#pwb').onclick=ok;$('#pwi').onkeydown=ev=>{if(ev.key=='Enter')ok()};
}
const SCH={text:[['text','Text','bia']],card:[['title','Title','bi'],['sub','Subtitle','bi'],['date','Date','pl'],['text','Description','bia']],tags:[['text','Tags, separated by commas','bi']],media:[['src','Image or video','file']],logo:[['name','Company name','pl'],['src','Logo image','file']]};
const NAMES={text:'Text',card:'Card',tags:'Tags',media:'Image / Video',logo:'Company logo'};
function h(tag,a={},...k){const n=document.createElement(tag);Object.assign(n,a);k.flat().forEach(x=>x!=null&&n.append(x));return n}
const btn=(txt,fn,cls='mini')=>h('button',{className:cls,textContent:txt,onclick:fn,type:'button'});
const setSt=m=>{const s=$('#st');if(s)s.textContent=m};
function save(){LS.set('draft',JSON.stringify(D));setSt('Draft saved. Download content.js to publish it.')}
const rd=f=>new Promise(r=>{
 if(f.type.startsWith('video')){if(f.size>3e6){alert('Videos over 3 MB: upload to YouTube and paste the link instead.');return r('')}const x=new FileReader();x.onload=()=>r(x.result);x.readAsDataURL(f);return}
 const i=new Image;i.onload=()=>{const s=Math.min(1,1200/i.width),c=document.createElement('canvas');c.width=i.width*s;c.height=i.height*s;c.getContext('2d').drawImage(i,0,0,c.width,c.height);r(c.toDataURL(f.type=='image/png'?'image/png':'image/jpeg',.8))};i.src=URL.createObjectURL(f)});
function F(o,k,label,ty){
 const w=h('div',{},h('label',{textContent:label}));
 if(ty=='bi'||ty=='bia'){o[k]=(o[k]&&typeof o[k]=='object')?o[k]:{en:o[k]||'',ar:''};
  ['en','ar'].forEach(l=>w.append(h(ty=='bia'?'textarea':'input',{value:o[k][l]||'',placeholder:l=='en'?'English':'عربي',rows:3,dir:l=='ar'?'rtl':'ltr',oninput:ev=>{o[k][l]=ev.target.value;save()}})));
 }else if(ty=='file'){
  if(o[k])w.append(o.type=='video'?h('small',{textContent:'Video attached'}):h('img',{src:o[k],className:'pv'}));
  w.append(h('input',{type:'file',accept:'image/*,video/*',onchange:async ev=>{const f=ev.target.files[0];if(!f)return;const v=await rd(f);if(!v)return;o[k]=v;o.type=f.type.startsWith('video')?'video':'image';save();R()}}),
   h('input',{value:o[k]&&!o[k].startsWith('data:')?o[k]:'',placeholder:'…or paste a link (YouTube or image URL)',oninput:ev=>{o[k]=ev.target.value;o.type=/youtu|\.mp4/.test(o[k])?'video':'image';save()}}));
 }else w.append(h('input',{value:o[k]||'',dir:/mail|phone|linkedin|date|^n$/.test(k)?'ltr':'auto',oninput:ev=>{o[k]=ev.target.value;save()}}));
 return w;
}
const mv=(a,i,d)=>{const j=i+d;if(j<0||j>=a.length)return;[a[i],a[j]]=[a[j],a[i]];save();R()};
function exportContent(){const a=h('a',{href:URL.createObjectURL(new Blob(['window.CONTENT='+JSON.stringify(D)+';'],{type:'text/javascript'})),download:'content.js'});document.body.append(a);a.click();a.remove();setSt('content.js downloaded. Replace the old content.js on your site with it.')}
function adminUI(){$('#app').innerHTML='<div class="adm"><aside class="side" id="side"></aside><main class="main" id="main"></main></div>';R()}
function R(){
 const side=$('#side'),main=$('#main'),sx=D.sections;side.innerHTML='';main.innerHTML='';
 side.append(h('h3',{textContent:'Admin'}),h('div',{className:'st',id:'st'}),
  btn('Download content.js',exportContent,'btn'),h('div',{style:'height:10px'}),
  h('div',{className:'si'+(cur=='pro'?' on':''),onclick:()=>{cur='pro';R()}},h('span',{textContent:'Profile & contact'})),
  h('div',{className:'hint',textContent:'Sections',style:'margin:14px 0 4px'}),
  ...sx.map((s,i)=>h('div',{className:'si'+(cur==s.id?' on':'')},h('span',{textContent:(s.title.en||s.title.ar||'Untitled')+(s.visible===false?' (hidden)':''),onclick:()=>{cur=s.id;R()}}),btn('↑',()=>mv(sx,i,-1)),btn('↓',()=>mv(sx,i,1)))),
  h('div',{style:'height:8px'}),btn('+ Add section',()=>{const id='s'+Date.now();sx.push({id,visible:true,title:{en:'New section',ar:'قسم جديد'},blocks:[]});cur=id;save();R()},'btn'),
  h('hr',{style:'border:0;border-top:1px solid var(--ln);margin:18px 0'}),
  btn('Preview draft',()=>window.open('index.html#preview')),h('div',{style:'height:8px'}),btn('Back to site',()=>{location.href='index.html'}),h('div',{style:'height:8px'}),
  btn('Discard draft',()=>{if(confirm('Discard changes not yet downloaded?')){LS.set('draft','');D=BASE;R()}}));
 if(cur=='pro'){const p=D.profile;
  main.append(h('h2',{textContent:'Profile & contact'}),h('div',{className:'hint',textContent:'Edit anything, then press Download content.js and replace the old file on your site.'}),
   h('div',{className:'box'},F(p,'name','Name','bi'),F(p,'title','Job title','bi'),F(p,'bio','Short bio','bia'),F(p,'photo','Photo','file')),
   h('div',{className:'box'},F(p,'email','Email','pl'),F(p,'phone','Phone','pl'),F(p,'linkedin','LinkedIn URL','pl')),
   h('div',{className:'box'},h('label',{textContent:'Hero stats'}),(p.stats=p.stats||[]).map((x,i)=>h('div',{className:'row'},F(x,'n','Number','pl'),F(x,'l','Label','bi'),btn('✕',()=>{p.stats.splice(i,1);save();R()}))),btn('+ Add stat',()=>{p.stats.push({n:'',l:{en:'',ar:''}});R()})),
   h('div',{className:'box'},h('label',{textContent:'New admin password'}),h('input',{type:'password',placeholder:'Leave empty to keep the current one',onchange:async ev=>{if(ev.target.value){D.pwh=await sha(ev.target.value);save();setSt('Password changed. Download content.js to apply it.')}}})));
  return}
 const i=sx.findIndex(s=>s.id==cur),s=sx[i];if(!s){cur='pro';return R()}
 main.append(h('div',{className:'row'},h('h2',{textContent:'Section'}),
  btn(s.visible===false?'Show on site':'Hide from site',()=>{s.visible=s.visible===false;save();R()}),
  btn('Layout: '+(s.layout=='timeline'?'timeline':'grid'),()=>{s.layout=s.layout=='timeline'?'grid':'timeline';save();R()}),
  btn('Delete section',()=>{if(confirm('Delete this section and everything in it?')){sx.splice(i,1);cur='pro';save();R()}})),
  h('div',{className:'box'},F(s,'title','Section title','bi')),
  h('div',{className:'hint',textContent:'A section can hold any mix of blocks. Add as many as you need.'}));
 s.blocks.forEach((b,j)=>main.append(h('div',{className:'box'},
  h('div',{className:'row'},h('b',{textContent:NAMES[b.kind]}),btn('↑',()=>mv(s.blocks,j,-1)),btn('↓',()=>mv(s.blocks,j,1)),btn('✕',()=>{s.blocks.splice(j,1);save();R()})),
  SCH[b.kind].map(f=>F(b,...f)))));
 main.append(h('div',{className:'row'},Object.keys(NAMES).map(k=>btn('+ '+NAMES[k],()=>{s.blocks.push({kind:k});save();R()}))));
}
try{const dr=LS.get('draft');D=dr?JSON.parse(dr):BASE}catch(x){D=BASE}
gate();
