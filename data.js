/* Default content (from the CV). Edit everything from admin.html instead of here. */
const L=(en,ar)=>({en,ar});
const X=(t,r,ra,d,tx,txa)=>({kind:'card',title:L(t,t),sub:L(r,ra),date:d,text:L(tx,txa)});
const DEFAULT={
 profile:{
  name:L('Shorouk Soliman','شروق سليمان'),
  title:L('Content Creator & Copywriter','كاتبة محتوى و Copywriter'),
  bio:L('Results-driven content creator with 4+ years in digital marketing: ad copy that converts, SEO strategy and video scripts across Egypt, Saudi Arabia and the UAE. My background in theater directing shapes how I tell stories on screen.',
        'كاتبة محتوى بخبرة أكتر من 4 سنين في الديجيتال ماركتنج: إعلانات بتبيع، استراتيجيات SEO، وسكريبتات فيديو في مصر والسعودية والإمارات. خلفيتي في إخراج المسرح بتدّي شغلي حكي بصري أقوى.'),
  email:'shorouksoliman000@gmail.com',phone:'+201080568318',
  linkedin:'https://www.linkedin.com/in/shorouq-soliman-8b2a94400/',photo:'',
  stats:[{n:'4+',l:L('Years of experience','سنين خبرة')},{n:'3',l:L('Markets: Egypt, KSA, UAE','أسواق: مصر والسعودية والإمارات')}]
 },
 sections:[
  {id:'about',visible:true,title:L('About','عني'),blocks:[
   {kind:'text',text:L('I write ad copy, video scripts, storyboards, social media content and SEO articles, and I direct actors on set when a script needs to come alive.','بكتب إعلانات وسكريبتات فيديو وستوري بورد ومحتوى سوشيال ميديا ومقالات SEO، وبخرّج الممثلين في الموقع لما السكريبت يحتاج يتحول لصورة.')},
   {kind:'tags',text:L('Ad Copywriting, Scriptwriting, Storyboarding, Social Media Content, SEO Content','كتابة إعلانات, سكريبتات, ستوري بورد, محتوى سوشيال ميديا, محتوى SEO')}]},
  {id:'experience',visible:true,title:L('Experience','الخبرة'),blocks:[
   X('Zikola','Content Creator','صانعة محتوى','May 2026 – Present','Led marketing campaigns, built B2B company profiles, landing pages and service PDFs, and mentored the junior content team.','قدت حملات تسويقية، وعملت بروفايلات شركات وصفحات هبوط وملفات خدمات PDF لعملاء B2B، ودربت فريق المحتوى الجديد.'),
   X('Stride Media Group','Content Creator & Creative Director Assistant','صانعة محتوى ومساعد مدير إبداعي','Dec 2024 – Apr 2026','Oversaw video production end to end: scripts, storyboards and directing actors on set for high-profile clients.','أشرفت على إنتاج الفيديو من الأول للآخر: سكريبتات وستوري بورد وإخراج أداء الممثلين في الموقع لعملاء كبار.'),
   X('Marketing Pulse','Content Creator','صانعة محتوى','Oct 2025 – Dec 2025','Brand analysis and data-backed strategic reports for Emirati brands.','تحليل براندات وتقارير استراتيجية مبنية على داتا لبراندات إماراتية.'),
   X('Skylight','Content Creator & Copywriter','صانعة محتوى وCopywriter','Jul 2024 – Mar 2026','Social copy and Reels, TikTok and sketch scripts in each brand’s voice; grew the agency’s own channels.','كوبي سوشيال وسكريبتات ريلز وتيك توك وسكتشات بصوت كل براند، وكبرت حسابات الأجنسي نفسها.'),
   X('Al-Alamiya Al-Hura','Content Creator','صانعة محتوى','Jan 2024 – Jul 2024','Competitor analysis, monthly content plans, and SEO articles that grew organic traffic.','تحليل منافسين وخطط محتوى شهرية ومقالات SEO زودت الزيارات الطبيعية.'),
   X('Mardoud','Content Writer','كاتبة محتوى','Aug 2023 – Jan 2024','Sales presentations, landing pages and ad scripts that turn agency services into clients.','عروض مبيعات وصفحات هبوط وسكريبتات إعلانات بتحول خدمات الأجنسي لعملاء.'),
   X('Sumoue','Copywriter','Copywriter','Mar 2022 – Jul 2023','Conversion copy for Snapchat, TikTok, Instagram and Twitter, tailored to the GCC market.','كوبي بيحوّل على سناب وتيك توك وإنستجرام وتويتر، مخصص لسوق الخليج.')]},
  {id:'skills',visible:true,title:L('Skills','المهارات'),blocks:[
   {kind:'tags',text:L('Copywriting, Scriptwriting, SEO Optimization, Content Strategy, Storyboarding, Competitor Analysis, Landing Page Copy, B2B Profiling','كوبي رايتينج, كتابة سكريبت, SEO, استراتيجية محتوى, ستوري بورد, تحليل منافسين, كوبي لانديج بيج, B2B Profiling')},
   {kind:'tags',text:L('Creative Problem Solving, Team Leadership & Mentoring, Agile Planning, Cross-functional Collaboration, Client Pitching','حل مشاكل إبداعي, قيادة وتدريب فريق, تخطيط Agile, تعاون بين الفرق, عرض للعملاء')}]},
  {id:'work',visible:true,title:L('Selected work','أعمال مختارة'),blocks:[
   {kind:'text',text:L('Work samples are coming soon.','نماذج الأعمال قريبًا.')}]},
  {id:'brands',visible:true,title:L('Brands I’ve worked with','شركات اشتغلت معاها'),blocks:
   ['Zikola','Stride Media','Camel Media','Marketing Pulse','Skylight','Mardoud','Sumoue'].map(n=>({kind:'logo',name:n,src:''}))},
  {id:'education',visible:true,title:L('Education & training','التعليم والتدريب'),blocks:[
   X('Al-Mansoura University','Bachelor of Laws (LL.B.)','ليسانس حقوق','2019 – 2023',''),
   X('Yasser Ismaiel Internship','Copywriting Intensive Training','كورس كوبي رايتينج مكثف','','')]}
 ]
};
/* Storage: IndexedDB in the admin's browser, else content.json next to the site, else DEFAULT. */
const DB={
 open(){return new Promise(r=>{const q=indexedDB.open('sh-portfolio',1);q.onupgradeneeded=()=>q.result.createObjectStore('k');q.onsuccess=()=>r(q.result);q.onerror=()=>r(null)})},
 async get(){const d=await this.open();if(!d)return;return new Promise(r=>{const q=d.transaction('k').objectStore('k').get('data');q.onsuccess=()=>r(q.result);q.onerror=()=>r()})},
 async set(v){const d=await this.open();if(!d)return;return new Promise(r=>{const t=d.transaction('k','readwrite');t.objectStore('k').put(v,'data');t.oncomplete=r})}
};
async function loadData(preferLocal){
 if(preferLocal){const l=await DB.get();if(l)return l}
 try{const r=await fetch('content.json',{cache:'no-store'});if(r.ok)return await r.json()}catch(e){}
 const l=await DB.get();return l||structuredClone(DEFAULT);
}
