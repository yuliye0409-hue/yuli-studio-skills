import {mountNotebookDemo} from './notebook-demo.js';

// Code-drawn sample image and fixed output; no image is uploaded and no API is called.
export const promptSample='<div class="prompt-sample" aria-label="示例图片：一只杯子"><span class="prompt-sample-light"></span><span class="prompt-sample-cup"></span><small>SAMPLE IMAGE / 001</small></div>';
export function promptToolStage(icon){
  return `<div class="project-stage prompt-tool-stage"><div class="notebook-preview prompt-preview"><div class="notebook-preview-top"><span class="notebook-mark">P</span><span>Prompt-Tool <small>IMAGE PROMPT STUDIO</small></span><span class="notebook-live">Chrome / Edge</span></div><p class="notebook-eyebrow">从一张图，找到下一次创作的语言</p><h4>看见灵感，<br>也能说出灵感。</h4>${promptSample}<div class="notebook-preview-foot"><span>悬停唤起</span><span>手动生成</span><span>中英文复制</span></div></div><div class="notebook-demo" data-prompt-demo data-playing="false"><div class="notebook-demo-head"><div><span class="notebook-eyebrow">A SMALL WALKTHROUGH</span><h4>从图片到提示词</h4></div><div class="notebook-demo-controls"><button class="notebook-demo-control" type="button" data-prompt-toggle aria-label="播放扩展操作演示" aria-pressed="false" title="播放扩展操作演示">${icon('play')}</button><button class="notebook-demo-control" type="button" data-prompt-replay aria-label="重播扩展操作演示" title="重播扩展操作演示">${icon('replay')}</button></div></div><div class="notebook-demo-screen prompt-demo-screen" data-prompt-screen></div><div class="notebook-demo-steps" role="group" aria-label="扩展操作演示步骤">${['悬停图片','点击生成','中英结果','分别复制'].map((label,index)=>`<button type="button" data-prompt-step="${index}" aria-label="扩展演示步骤 ${index+1}：${label}" aria-pressed="false"><span>${String(index+1).padStart(2,'0')}</span>${label}</button>`).join('')}</div><p class="notebook-demo-status" role="status" aria-live="off" data-prompt-status></p><p class="notebook-demo-disclaimer">操作示意 · 预设示例结果 · 不请求 API</p></div></div>`;
}
const cursor='<svg class="notebook-demo-cursor" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 3 14 10-7 1-3 7Z"/></svg>';
const frame=(body)=>`<div class="prompt-demo-chrome"><span></span><span></span><span></span><b>Image Prompt Studio</b></div>${body}`;
const frames=[
  frame(`<div class="prompt-hover-scene">${promptSample}${cursor}<span class="prompt-hover-badge">悬停约 700ms</span></div>`),
  frame('<div class="prompt-mini-window"><small>通用图生文</small><b>让一张图，变成一段描述。</b><p>悬浮窗已展开，点击后才请求 API。</p><span class="prompt-generate">生成此图提示词</span>'+cursor+'</div>'),
  frame('<div class="prompt-output"><div><b>中文提示词</b><span>复制中文</span></div><p>白色陶瓷杯，浅色桌面，柔和侧光，简约静物摄影。</p><div><b>English Prompt</b><span>复制英文</span></div><p>A white ceramic cup on a light table, soft side lighting, minimal still life photography.</p></div>'),
  frame('<div class="prompt-output"><div><b>中文提示词</b><span class="prompt-copied">已复制 ✓</span></div><p>白色陶瓷杯，浅色桌面，柔和侧光，简约静物摄影。</p><div><b>English Prompt</b><span>复制英文</span></div><p>A white ceramic cup on a light table, soft side lighting, minimal still life photography.</p></div>'),
];
export function mountPromptToolDemo(root){
  mountNotebookDemo(root,{frames,stepLabels:['悬停图片','点击生成','中英文结果','分别复制'],prefix:'prompt'});
}
