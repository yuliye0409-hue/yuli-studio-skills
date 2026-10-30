import {categories,skills,workflows,projects,articles,filterSkills} from './data.js';
import {siteConfig} from './public/site.config.js';
import {externalURL,emailURL} from './public/links.js';

const paths={
  'file-text':'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Zm0 0v6h6M8 13h8m-8 4h6"/>',
  'arrow-up-right':'<path d="M7 17 17 7M7 7h10v10"/>','arrow-down-right':'<path d="m7 7 10 10M7 17h10V7"/>',
  'arrow-down':'<path d="M12 4v16m-6-6 6 6 6-6"/>','arrow-up':'<path d="M12 20V4m-6 6 6-6 6 6"/>','arrow-right':'<path d="M4 12h16m-6-6 6 6-6 6"/>',
  bookmark:'<path d="M6 20V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v15l-6-4-6 4Z"/>',search:'<circle cx="10.7" cy="10.7" r="6.7"/><path d="m16 16 4.5 4.5"/>',
  x:'<path d="m6 6 12 12M6 18 18 6"/>',menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',sparkles:'<path d="m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4L12 3ZM20 2v4m-2-2h4"/>',
  'pen-tool':'<path d="m14 3 7 7-9 9-7 1 1-7 8-10ZM5 20l6-6"/><circle cx="12" cy="13" r="1.5"/>',code:'<path d="m8 6-6 6 6 6m8-12 6 6-6 6M14 4l-4 16"/>',
  workflow:'<rect x="2" y="3" width="7" height="7" rx="2"/><rect x="15" y="14" width="7" height="7" rx="2"/><path d="M5.5 10v6a2 2 0 0 0 2 2H15M9 6.5h7.5a2 2 0 0 1 2 2V14"/>',
  'book-open':'<path d="M12 6c-3-3-7-3-10-2v15c4-1 7-1 10 2 3-3 6-3 10-2V4c-3-1-7-1-10 2Zm0 0v15"/>',image:'<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
  scan:'<path d="M9 3H5a2 2 0 0 0-2 2v4m12-6h4a2 2 0 0 1 2 2v4M3 15v4a2 2 0 0 0 2 2h4m12-6v4a2 2 0 0 1-2 2h-4M8 8h8m-8 4h8m-8 4h5"/>',
  'check-circle':'<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',check:'<path d="m5 12 4 4L19 6"/>',
  copy:'<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',bolt:'<path d="m13 2-9 12h7l-1 8 10-13h-7l1-7Z"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.2"/>',mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
  message:'<path d="M21 12a9 9 0 0 1-13 8l-5 1 1-5A9 9 0 1 1 21 12Z"/>',
  github:'<path d="M9 19c-4.3 1.3-4.3-2.1-6-2.5M15 22v-3.5a3 3 0 0 0-.8-2.3c2.7-.3 5.5-1.3 5.5-6A4.7 4.7 0 0 0 18.4 7a4.4 4.4 0 0 0-.1-3.3S17.3 3.4 15 5a11.3 11.3 0 0 0-6 0C6.7 3.4 5.7 3.7 5.7 3.7A4.4 4.4 0 0 0 5.6 7a4.7 4.7 0 0 0-1.3 3.3c0 4.7 2.8 5.7 5.5 6a3 3 0 0 0-.8 2.3V22"/>',
};
const icon=(name,filled=false)=>`<svg viewBox="0 0 24 24" ${filled?'style="fill:currentColor"':''} aria-hidden="true">${paths[name]||paths.sparkles}</svg>`;
const $=selector=>document.querySelector(selector);
const esc=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const panels=['products','skills','articles','about','connect'];
const motion=()=>matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth';
const dialog=$('#detail-dialog'),menu=$('#mobile-menu');
let toastTimer,dialogTrigger=null;
function readStorage(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}}
const stored=readStorage('skill-garden:saved',[]);
const state={panel:'products',category:'all',query:'',saved:[...new Set(Array.isArray(stored)?stored.filter(id=>skills.some(skill=>skill.id===id)):[])],detail:null};
document.querySelectorAll('[data-icon]').forEach(element=>{element.outerHTML=icon(element.dataset.icon);});
document.title=`${siteConfig.name} — Think. Make. Share.`;
$('.footer-bottom>span:first-child').textContent=`© 2026 ${siteConfig.name} · V${siteConfig.version}`;
document.querySelectorAll('.brand>span:last-child').forEach(element=>{element.innerHTML=`${esc(siteConfig.name)}<small>${esc(siteConfig.englishName)}</small>`;});
document.querySelectorAll('.brand').forEach(element=>element.setAttribute('aria-label',`${siteConfig.name} 首页`));
$('.mobile-menu-top>span').textContent=siteConfig.name;
function anchor(label,url,className='text-link',symbol='arrow-up-right',attributes=''){return `<a class="${className}" href="${esc(url)}" target="_blank" rel="noopener noreferrer" ${attributes}>${esc(label)}${icon(symbol)}</a>`;}
function repoLink(url,{id='',className='text-link',label='GitHub'}={}){const safe=externalURL(url,{repository:true});return safe?anchor(label,safe,className,'github',`data-repository="${esc(id)}"`):`<span class="pending-link" data-pending-repository="${esc(id)}">${icon('github')}GitHub 待绑定</span>`;}
function profileLink(){const url=externalURL(siteConfig.profile.github,{github:true});return url?anchor('GitHub',url,'github-link','github','data-profile-link'):`<span class="github-pending">${icon('github')}GitHub <small>待绑定</small></span>`;}
$('#header-github').innerHTML=profileLink();$('#footer-github').innerHTML=profileLink();
const contacts=[{label:'GitHub',icon:'github',url:externalURL(siteConfig.profile.github,{github:true})},{label:'Email',icon:'mail',url:emailURL(siteConfig.profile.email)},{label:'哔哩哔哩',icon:'image',url:externalURL(siteConfig.profile.bilibili)},{label:'小红书',icon:'book-open',url:externalURL(siteConfig.profile.xiaohongshu)}];
$('#contact-links').innerHTML=contacts.map(item=>item.url?`<a href="${esc(item.url)}" ${item.url.startsWith('https:')?'target="_blank" rel="noopener noreferrer"':''}>${icon(item.icon)}${esc(item.label)}${icon('arrow-up-right')}</a>`:`<span>${icon(item.icon)}${esc(item.label)} <small>待补充</small></span>`).join('');

function renderFeaturedSkill(id='prompt-architect'){
  const featuredIds=['prompt-architect','visual-story','idea-to-interface'];
  const skill=skills.find(item=>item.id===id);
  if(!skill||!featuredIds.includes(id))return;
  const category=categories.find(item=>item.id===skill.category);
  document.querySelectorAll('[data-featured-skill]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.featuredSkill===id)));
  $('#hero-featured-filename').textContent=`${skill.id} / SKILL.md`;
  const preview=skill.prompt.split('\n').filter(Boolean).slice(0,4);
  $('#hero-featured-content').innerHTML=`<div class="workbench-skill"><p class="skill-file-label">${esc(category.label)} / 示例技能</p><h2>${esc(skill.subtitle)}</h2><p class="workbench-description">${esc(skill.description)}</p><pre class="workbench-prompt"><code><span class="code-comment"># ${esc(skill.title)}</span>\n\n${preview.map((line,index)=>index===0?esc(line):`<b>${esc(line.split('：')[0])}：</b>${esc(line.split('：').slice(1).join('：'))}`).join('\n')}</code></pre><button class="workbench-action" type="button" data-open="${esc(skill.id)}" aria-label="查看完整技能：${esc(skill.title)}">查看完整技能与提示词 ${icon('arrow-up-right')}</button></div>`;
}

function projectStage(project){
  if(project.demo==='garden')return `<div class="project-stage"><div class="stage-top"><span class="stage-brand"><svg viewBox="0 0 32 32" aria-hidden="true"><use href="./public/logo.svg#yuli-mark"></use></svg>${esc(siteConfig.name)}</span><div class="stage-controls" role="group" aria-label="切换项目预览"><button class="stage-control" type="button" data-demo="preview" aria-pressed="true">预览</button><button class="stage-control" type="button" data-demo="code" aria-pressed="false" aria-label="查看配置代码">${icon('code')}</button></div></div><div class="garden-preview" id="garden-preview"><p>A LITTLE SPACE FOR BIG IDEAS.</p><h3>Your next idea<br />starts <em>here.</em></h3><div class="preview-tiles">${[['sparkles','AI & Skills','Explore possibilities'],['pen-tool','Design & Create','Make something yours'],['code','Build & Share','Bring ideas to life']].map(([symbol,title,subtitle])=>`<div class="preview-tile">${icon(symbol)}<span>${title}</span><small>${subtitle}</small></div>`).join('')}</div><div class="preview-bottom"><span class="small-dot"></span> a growing collection of things worth making.</div></div><div class="code-preview" id="code-preview" hidden><div class="code-filename">public/site.config.js</div><pre class="code-lines"><span><b>export const</b> siteConfig = {</span><span>  name: <em>'${esc(siteConfig.name)}'</em>,</span><span>  version: <em>'${esc(siteConfig.version)}'</em>,</span><span>  projects: {</span><span>    <em>'skill-garden'</em>: {</span><span>      repository: <em>${esc(JSON.stringify(siteConfig.projects[project.id]?.repository??null))}</em>,</span><span>      demo: <em>${esc(JSON.stringify(siteConfig.projects[project.id]?.demo??null))}</em>,</span><span>    },</span><span>  },</span><span>};</span><span><i>// 留给你的下一件作品。</i></span></pre></div></div>`;
  if(project.demo==='creative')return `<div class="project-stage creative-stage" aria-hidden="true"><div class="stage-top"><span>CREATIVE WORKBENCH</span><span>VISUAL DIRECTION / 01</span></div><div class="moodboard"><div class="moodboard-title"><small>MAKE ROOM FOR</small><span>good<br />ideas.</span></div><div class="moodboard-art"></div><div class="moodboard-colors"><i></i><i></i><i></i><i></i></div></div><div class="moodboard-note">a little inspiration.${icon('arrow-down-right')}</div></div>`;
  return `<div class="project-stage automation-stage" aria-hidden="true"><div class="stage-top"><span>EVERYDAY AUTOMATION</span><span>WORKFLOW / PREVIEW</span></div><h3 class="automation-title">Make room for what matters.</h3><div class="automation-flow"><div class="flow-node">${icon('bolt')}接收输入</div>${icon('arrow-right')}<div class="flow-node">${icon('workflow')}自动处理</div>${icon('arrow-right')}<div class="flow-node">${icon('check-circle')}交付结果</div></div><div class="automation-bottom"><span>INPUT → PROCESS → OUTPUT</span><span>示例预览</span></div></div>`;
}
function renderProjects(){
  $('#project-grid').innerHTML=projects.map((project,index)=>{const binding=siteConfig.projects[project.id]||{},demo=externalURL(binding.demo);return `<article class="project-card ${index===0?'project-featured':''}">${projectStage(project)}<div class="project-content"><div class="project-meta"><span>0${index+1} / ${esc(project.type)}</span><span>${esc(project.status)}</span></div><h3 class="project-name">${esc(project.name)}</h3><p class="project-tagline">${esc(project.title)}</p><p class="project-description">${esc(project.description)}</p><div class="project-tags">${project.tags.map(tag=>`<span>${esc(tag)}</span>`).join('')}</div><div class="project-actions"><button class="text-link" type="button" data-project="${project.id}">了解项目 ${icon('arrow-right')}</button>${repoLink(binding.repository,{id:project.id})}${demo?anchor('在线体验',demo,'text-link','arrow-up-right',`data-demo-link="${project.id}"`):''}</div></div></article>`;}).join('');
  $('#project-count').textContent=String(projects.length).padStart(2,'0');
}
function renderFilters(){
  $('#category-filters').innerHTML=[...categories,{id:'favorites',label:'收藏'}].map(category=>`<button type="button" class="category-filter" id="filter-${category.id}" data-category="${category.id}" aria-pressed="${state.category===category.id}">${category.id==='favorites'?icon('bookmark'):''}${esc(category.label)}<small>${filterSkills(skills,category.id,'',state.saved).length}</small></button>`).join('');
  $('#favorites-count').textContent=state.saved.length;$('#favorites-count').hidden=!state.saved.length;$('#skill-count').textContent=String(skills.length).padStart(2,'0');
}
function renderSkills(){
  const shown=filterSkills(skills,state.category,state.query,state.saved);
  $('#skills-grid').innerHTML=shown.map(skill=>{const saved=state.saved.includes(skill.id);return `<article class="skill-card"><div class="skill-card-head"><span class="skill-symbol">${icon(skill.icon)}</span><span class="skill-number">SKILL / ${String(skills.indexOf(skill)+1).padStart(2,'0')}</span></div><button type="button" class="card-main" data-open="${skill.id}" aria-label="查看技能：${esc(skill.title)}"><span class="card-subtitle">${esc(skill.subtitle)}</span><h3>${esc(skill.title)}</h3><p>${esc(skill.description)}</p></button><div class="card-tags">${skill.tags.map(tag=>`<span>${esc(tag)}</span>`).join('')}</div><div class="card-bottom">${repoLink(siteConfig.skills[skill.id],{id:skill.id,className:'card-repo-link',label:'查看源码'})}<button type="button" class="icon-button ${saved?'saved':''}" data-save="${skill.id}" aria-label="${saved?'取消收藏':'收藏'}：${esc(skill.title)}" aria-pressed="${saved}">${icon('bookmark',saved)}</button></div></article>`;}).join('');
  $('#empty-state').hidden=shown.length!==0;$('#result-count').textContent=`${String(shown.length).padStart(2,'0')} SKILL${shown.length===1?'':'S'}`;
  $('#result-description').textContent=state.query?`搜索「${state.query}」的结果`:state.category==='favorites'?'留给下一次灵感的收藏。':'好用的方法，随时取用。';
  $('#empty-state h3').textContent=state.category==='favorites'&&!state.query?'你的收藏，从这里开始。':'换个方向，也许就找到了。';
  $('#empty-state p').textContent=state.category==='favorites'&&!state.query?'点击技能卡片上的书签，把好用的方法留下来。':'试试别的关键词，或回到全部技能看看。';
}
function setCategory(id){state.category=id;renderFilters();renderSkills();}
function showToast(message){clearTimeout(toastTimer);$('#toast').textContent=message;$('#toast').classList.add('visible');toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),3000);}
function toggleSave(id){
  if(!skills.some(skill=>skill.id===id))return;
  const focused=document.activeElement,focusOnSave=focused?.matches('[data-save]'),fromDialog=focused?.closest('#detail-dialog'),saved=state.saved.includes(id);
  state.saved=saved?state.saved.filter(value=>value!==id):[...state.saved,id];let persisted=true;
  try{localStorage.setItem('skill-garden:saved',JSON.stringify(state.saved));}catch{persisted=false;}
  renderFilters();renderSkills();if(state.detail?.type==='skill')renderSkillDetail(state.detail.id);
  if(focusOnSave)(fromDialog?$('#detail-content [data-save]'):$(`#skills-grid [data-save="${id}"]`)||$('#filter-favorites'))?.focus({preventScroll:true});
  showToast(saved?'已从收藏中移除':persisted?'已收藏，留给下一次灵感。':'已收藏；浏览器限制保存，仅本次访问有效。');
}
function setPanel(panel,{scroll=true,focus=false,historyMode='push'}={}){
  if(!panels.includes(panel))return;state.panel=panel;
  panels.forEach(id=>{$(`#panel-${id}`).hidden=id!==panel;const tab=$(`#tab-${id}`);tab.setAttribute('aria-selected',String(id===panel));tab.tabIndex=id===panel?0:-1;});
  document.querySelectorAll('.desktop-nav [data-panel]').forEach(button=>{if(button.dataset.panel===panel)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');});
  $('#panel-number').textContent=String(panels.indexOf(panel)+1).padStart(2,'0');
  if(historyMode!=='none'&&location.hash!==`#${panel}`)history[historyMode==='replace'?'replaceState':'pushState'](null,'',`#${panel}`);
  if(scroll)$('#collection').scrollIntoView({behavior:motion()});if(focus)$(`#tab-${panel}`).focus({preventScroll:true});
}
function initialPanel(){const hash=location.hash.slice(1);return panels.includes(hash)?hash:hash==='library'?'skills':'products';}
addEventListener('popstate',()=>{const panel=initialPanel();if(panel!==state.panel)setPanel(panel,{historyMode:'none'});});
addEventListener('hashchange',()=>{const panel=initialPanel();if(panel!==state.panel)setPanel(panel,{historyMode:'none',scroll:!!location.hash});});
function showDialog(){if(!dialog.open){dialogTrigger=document.activeElement;dialog.showModal();}dialog.scrollTop=0;$('#close-dialog').focus({preventScroll:true});}
function renderSkillDetail(id){
  const skill=skills.find(item=>item.id===id);if(!skill)return;const saved=state.saved.includes(id);
  $('#detail-eyebrow').textContent=`THE COLLECTION / SKILL ${String(skills.indexOf(skill)+1).padStart(2,'0')}`;
  $('#detail-content').innerHTML=`<span class="detail-subtitle">${esc(skill.subtitle)}</span><div class="detail-title-row"><h2 id="detail-title">${esc(skill.title)}</h2><button class="icon-button ${saved?'saved':''}" type="button" data-save="${id}" aria-pressed="${saved}" aria-label="${saved?'取消收藏':'收藏'}：${esc(skill.title)}">${icon('bookmark',saved)}</button></div><div class="detail-tags">${skill.tags.map(tag=>`<span>${esc(tag)}</span>`).join('')}<span>示例技能</span></div><p class="detail-overview">${esc(skill.overview)}</p><h3 class="detail-heading">怎么使用 <span class="mono">A SMALL GUIDE</span></h3><ol class="detail-steps">${skill.steps.map(step=>`<li>${esc(step)}</li>`).join('')}</ol><h3 class="detail-heading">带走这个提示词 <button class="copy-button" id="copy-prompt" type="button">${icon('copy')}复制提示词</button></h3><div class="prompt-box"><pre>${esc(skill.prompt)}</pre></div><p class="detail-takeaway">${esc(skill.takeaway)}</p><div class="detail-repository">${repoLink(siteConfig.skills[id],{id,label:'查看 GitHub 仓库'})}</div><p class="detail-demo-note">这是可体验的示例技能。使用前请填写提示词中方括号里的内容；真实技能资料与仓库链接会在之后逐步更新。</p>`;
}
function openSkill(id){if(!skills.some(skill=>skill.id===id))return;state.detail={type:'skill',id};renderSkillDetail(id);showDialog();}
function openProject(id){
  const project=projects.find(item=>item.id===id);if(!project)return;state.detail={type:'project',id};const binding=siteConfig.projects[id]||{},demo=externalURL(binding.demo);
  $('#detail-eyebrow').textContent=`SELECTED PROJECTS / ${project.type}`;
  $('#detail-content').innerHTML=`<span class="detail-subtitle">${esc(project.name)}</span><h2 id="detail-title">${esc(project.title)}</h2><div class="detail-tags"><span>${esc(project.type)}</span><span>${esc(project.status)}</span></div><p class="detail-overview">${esc(project.detail)}</p><h3 class="detail-heading">这个项目里，有什么</h3><ol class="detail-steps">${project.features.map(feature=>`<li>${esc(feature)}</li>`).join('')}</ol><div class="detail-repository">${repoLink(binding.repository,{id,label:'查看 GitHub 仓库'})}${demo?anchor('打开在线演示',demo):'<span class="pending-link">在线演示待绑定</span>'}</div><p class="detail-demo-note">${project.status==='示例展示位'?'这里是版式示例，尚未绑定真实项目。':'这是当前站点，可查看源代码与在线版本。'}</p>`;showDialog();
}
function openArticle(id){
  const article=articles.find(item=>item.id===id);if(!article)return;state.detail={type:'article',id};$('#detail-eyebrow').textContent=`NOTES / ${article.category}`;
  $('#detail-content').innerHTML=`<span class="detail-subtitle">Notes to self.</span><h2 id="detail-title">${esc(article.title)}</h2><div class="detail-tags"><span>${esc(article.category)}</span><span>${esc(article.status)}</span>${article.date?`<span>${esc(article.date)}</span>`:''}</div><p class="detail-overview">${esc(article.excerpt)}</p><div class="article-body">${article.sections.map(section=>`<h3>${esc(section.heading)}</h3><p>${esc(section.text)}</p>`).join('')}</div><p class="detail-demo-note">这是一篇用于确认阅读体验的示例草稿，不代表已经发布的个人文章。</p>`;showDialog();
}
function openWorkflow(id){
  const workflow=workflows.find(item=>item.id===id);if(!workflow)return;state.detail={type:'workflow',id};$('#detail-eyebrow').textContent=`CONNECT THE DOTS / WORKFLOW ${workflow.number}`;
  $('#detail-content').innerHTML=`<span class="detail-subtitle">Three skills. One small creation.</span><h2 id="detail-title">${esc(workflow.title)}</h2><p class="detail-overview">${esc(workflow.description)} 依次打开下面的技能，参考操作步骤，再复制提示词开始实践。</p><div class="workflow-detail-list">${workflow.skills.map((skillId,index)=>{const skill=skills.find(item=>item.id===skillId);return `<button class="workflow-detail-skill" type="button" data-open="${skill.id}"><span class="mono">0${index+1}</span><div><h3>${esc(skill.title)}</h3><p>${esc(skill.description)}</p></div>${icon('arrow-up-right')}</button>`;}).join('')}</div><p class="detail-takeaway">不用一次做好所有事，先把第一步做起来。</p><p class="detail-demo-note">这是演示性的技能组合，不会自动调用外部工具或发送你的资料。</p>`;showDialog();
}
$('#articles-list').innerHTML=articles.map((article,index)=>`<button class="article-row" type="button" data-article="${article.id}"><div class="article-meta"><span>${article.date?esc(article.date):`NOTE / 0${index+1}`}</span><span>${esc(article.category)}</span></div><div><h3>${esc(article.title)}</h3><p>${esc(article.excerpt)}</p><span class="draft-label">${esc(article.status)}</span></div>${icon('arrow-up-right')}</button>`).join('');
$('#article-count').textContent=String(articles.length).padStart(2,'0');
$('#workflow-grid').innerHTML=workflows.map(workflow=>`<button class="workflow-card" type="button" data-workflow="${workflow.id}"><div class="workflow-card-top"><span>WORKFLOW / ${workflow.number}</span>${icon('arrow-up-right')}</div><h3>${esc(workflow.title)}</h3><p>${esc(workflow.description)}</p><div class="workflow-steps">${workflow.tags.map((tag,index)=>`${index?icon('arrow-right'):''}<span>${esc(tag)}</span>`).join('')}</div></button>`).join('');

async function copyText(text,button,label){
  try{
    if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(text);
    else{const textarea=document.createElement('textarea');textarea.value=text;textarea.style.cssText='position:fixed;opacity:0;pointer-events:none';(dialog.open?dialog:document.body).append(textarea);textarea.select();const copied=document.execCommand('copy');textarea.remove();if(!copied)throw new Error('Unavailable');button.focus();}
    const before=button.innerHTML;button.innerHTML=`${icon('check')}${label}`;setTimeout(()=>{if(button.isConnected)button.innerHTML=before;},2200);showToast('已复制，可以开始下一步了。');
  }catch{showToast('自动复制暂不可用，请选中文字手动复制。');}
}
document.addEventListener('click',event=>{
  const featured=event.target.closest('[data-featured-skill]');if(featured){renderFeaturedSkill(featured.dataset.featuredSkill);return;}
  const panel=event.target.closest('[data-panel]');if(panel){const fromMenu=!!panel.closest('#mobile-menu');if(menu.open)menu.close();setPanel(panel.dataset.panel,{focus:fromMenu||panel.matches('[role=tab]')});return;}
  const category=event.target.closest('[data-category]');if(category){setCategory(category.dataset.category);$(`#filter-${category.dataset.category}`).focus({preventScroll:true});return;}
  const skill=event.target.closest('[data-open]');if(skill){openSkill(skill.dataset.open);return;}
  const save=event.target.closest('[data-save]');if(save){toggleSave(save.dataset.save);return;}
  const project=event.target.closest('[data-project]');if(project){openProject(project.dataset.project);return;}
  const article=event.target.closest('[data-article]');if(article){openArticle(article.dataset.article);return;}
  const workflow=event.target.closest('[data-workflow]');if(workflow){openWorkflow(workflow.dataset.workflow);return;}
  const demo=event.target.closest('[data-demo]');if(demo){const code=demo.dataset.demo==='code';$('#garden-preview').hidden=code;$('#code-preview').hidden=!code;document.querySelectorAll('[data-demo]').forEach(button=>button.setAttribute('aria-pressed',String(button===demo)));return;}
  const copy=event.target.closest('#copy-prompt');if(copy){const skillData=skills.find(item=>item.id===state.detail?.id);if(skillData)copyText(skillData.prompt,copy,'已复制');}
});
$('.main-tabs').addEventListener('keydown',event=>{if(!['ArrowRight','ArrowLeft','Home','End'].includes(event.key))return;const current=panels.indexOf(event.target.dataset.panel);if(current<0)return;event.preventDefault();const index=event.key==='Home'?0:event.key==='End'?panels.length-1:(current+(event.key==='ArrowRight'?1:-1)+panels.length)%panels.length;setPanel(panels[index],{scroll:false,focus:true});});
$('#search-input').addEventListener('input',event=>{state.query=event.target.value;renderSkills();});
$('#reset-filters').addEventListener('click',()=>{state.query='';$('#search-input').value='';setCategory('all');$('#filter-all').focus({preventScroll:true});});
$('#favorites-button').addEventListener('click',()=>{state.query='';$('#search-input').value='';setCategory('favorites');setPanel('skills');$('#filter-favorites').focus({preventScroll:true});});
$('#copy-conversation').addEventListener('click',event=>copyText('你好，想和你聊聊一个想法。\n\n我正在做：[项目或场景]\n希望解决：[核心问题]\n已经尝试过：[方法与结果]\n希望一起讨论：[具体问题或合作方向]',event.currentTarget,'已复制'));
$('#close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();});
dialog.addEventListener('close',()=>{state.detail=null;if(dialogTrigger?.isConnected)dialogTrigger.focus({preventScroll:true});else{const id=dialogTrigger?.dataset.open;($(`#skills-grid [data-open="${id}"]`)||$(`#tab-${state.panel}`)).focus({preventScroll:true});}});
$('#menu-toggle').addEventListener('click',()=>menu.showModal());$('#close-menu').addEventListener('click',()=>menu.close());
matchMedia('(min-width:600px)').addEventListener('change',event=>{if(event.matches&&menu.open)menu.close();});
document.addEventListener('keydown',event=>{const editing=event.target.matches('input,textarea,select,[contenteditable=true]');if(!dialog.open&&!menu.open&&((event.key==='/'&&!editing)||((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'))){event.preventDefault();setPanel('skills',{scroll:false});$('#collection').scrollIntoView({behavior:'instant'});$('#search-input').focus();}if(event.key==='Escape'&&!dialog.open&&!menu.open&&state.query){state.query='';$('#search-input').value='';renderSkills();}});
let scrollTicking=false;
function onScroll(){if(scrollTicking)return;scrollTicking=true;requestAnimationFrame(()=>{const available=document.documentElement.scrollHeight-innerHeight;$('#reading-progress').style.width=`${available>0?Math.max(0,Math.min(100,scrollY/available*100)):0}%`;scrollTicking=false;});}
addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll,{passive:true});
renderFeaturedSkill();renderProjects();renderFilters();renderSkills();setPanel(initialPanel(),{scroll:false,historyMode:'none'});onScroll();
