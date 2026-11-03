// Local walkthrough frames. This shared player never sends user data.
const scenes=[
  '<div class="notebook-screen-nav"><b>问而知</b><span class="is-active">术语笔记</span><span>教程目录</span></div><div class="notebook-screen-search"><span aria-hidden="true">⌕</span><span class="notebook-typed">DESIGN.md</span><i aria-hidden="true"></i></div><div class="notebook-screen-card"><small>相关技术名称</small><b>DESIGN.md 是什么？</b><p>颜色、字体、布局与组件规范，留下统一的设计语言。</p><span>打开笔记 ↗</span></div>',
  '<div class="notebook-screen-nav"><b>问而知</b><span class="is-active">术语笔记</span><span>教程目录</span></div><div class="notebook-screen-search"><span aria-hidden="true">⌕</span><span>DESIGN.md</span></div><div class="notebook-screen-card notebook-card-selected"><small>相关技术名称</small><b>DESIGN.md 是什么？</b><p>颜色、字体、布局与组件规范，留下统一的设计语言。</p><span>打开笔记 ↗</span><svg class="notebook-demo-cursor" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 3 14 10-7 1-3 7Z"/></svg></div>',
  '<div class="notebook-screen-reader"><div><span>笔记 / 阅读</span><span aria-hidden="true">×</span></div><small>相关技术名称 · DESIGN.md</small><h5>DESIGN.md 是什么？</h5><p>一种 Markdown 格式的设计文档。</p><div class="notebook-reader-callout"><b>记住这一点</b><p>记录颜色、字体、布局和组件规范，帮助界面保持一致。</p></div><span class="notebook-reader-end">解释清楚，留待下次查阅。</span></div>',
  '<div class="notebook-screen-nav"><b>问而知</b><span>术语笔记</span><span class="is-active">教程目录</span></div><div class="notebook-tutorial-heading"><small>PRACTICAL GUIDES</small><b>从理解，到操作。</b></div><div class="notebook-screen-card"><small>独立教程目录 · SSH</small><b>通过 SSH 用 Codex 访问另一台电脑</b><p>Windows、Mac，同网与异网：把登录和接入分开验证。</p><span>阅读教程 ↗</span></div>',
];
const labels=['搜索术语','打开笔记','阅读解释','切换教程'];
const frameDuration=4200;

export function mountNotebookDemo(root,{frames=scenes,stepLabels=labels,prefix='notebook'}={}){
  if(!root)return;
  const screen=root.querySelector(`[data-${prefix}-screen]`);
  const steps=[...root.querySelectorAll(`[data-${prefix}-step]`)];
  const toggle=root.querySelector(`[data-${prefix}-toggle]`);
  const replay=root.querySelector(`[data-${prefix}-replay]`);
  const status=root.querySelector(`[data-${prefix}-status]`);
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
  const description=prefix==='prompt'?'扩展操作演示':'笔记操作演示';
  let active=0,playing=!reducedMotion.matches,visible=false,timer;

  function renderScene(){
    screen.innerHTML=frames[active];
    screen.dataset.scene=String(active);
    steps.forEach((button,index)=>button.setAttribute('aria-pressed',String(index===active)));
    status.textContent=`${String(active+1).padStart(2,'0')} / ${String(frames.length).padStart(2,'0')} · ${stepLabels[active]}`;
  }
  function renderPlayback(){
    root.dataset.playing=String(playing);
    toggle.setAttribute('aria-pressed',String(playing));
    toggle.setAttribute('aria-label',`${playing?'暂停':'播放'}${description}`);
    toggle.title=toggle.getAttribute('aria-label');
    toggle.innerHTML=playing?'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5v14M15 5v14"/></svg>':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 12 7-12 7z"/></svg>';
    status.setAttribute('aria-live',playing?'off':'polite');
  }
  function schedule(){
    clearTimeout(timer);
    if(!playing||!visible||document.hidden)return;
    timer=setTimeout(()=>{active=(active+1)%frames.length;renderScene();schedule();},frameDuration);
  }
  toggle.addEventListener('click',()=>{playing=!playing;renderPlayback();schedule();});
  replay.addEventListener('click',()=>{active=0;playing=true;renderScene();renderPlayback();schedule();});
  steps.forEach((button,index)=>button.addEventListener('click',()=>{active=index;playing=false;renderPlayback();renderScene();schedule();}));
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();});
  observer.observe(root);
  document.addEventListener('visibilitychange',schedule);
  reducedMotion.addEventListener('change',event=>{if(event.matches){playing=false;renderPlayback();schedule();}});
  renderScene();renderPlayback();
}
