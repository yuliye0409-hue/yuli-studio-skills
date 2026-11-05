import {mountNotebookDemo} from './notebook-demo.js';

// Fixed illustration of the published Skill's workflow; no uploads or model calls.
export const videoScriptLabels=['提供产品图','补充卖点','编排镜头','中英脚本'];
const product='<div class="prompt-sample video-product" aria-label="示例产品：陶瓷杯"><div class="prompt-sample-light"></div><div class="prompt-sample-cup"></div><small>PRODUCT PHOTO / 示例素材</small></div>';
const fields=[['镜头','01 · 产品开场'],['时长','3 秒（示例）'],['对应素材','产品图 01'],['画面内容','杯子置于晨光中'],['镜头动作','缓慢推进至杯沿'],['提示词','柔和侧光，陶瓷质感'],['转场建议','淡入下一镜头'],['适配音频','轻柔环境音']];
export const videoScriptFrames=[
  `<div class="video-scene"><div class="video-scene-top"><span>01 / INPUT</span><span>本地示意</span></div>${product}<div class="video-file"><span>产品图 01</span><span>已准备 ✓</span></div><p class="video-caption">先提供产品图片，让画面有明确的依据。</p></div>`,
  '<div class="video-scene"><div class="video-scene-top"><span>02 / BRIEF</span><span>陶瓷杯 · 示例</span></div><div class="video-brief"><small>产品卖点</small><p>圆润杯沿 · 陶瓷质感</p><small>简单的画面描述</small><p class="video-type">晨光下，一只杯子放在桌面上。</p><small>输出语言</small><div class="video-language"><span>中文 ✓</span><span>English ✓</span></div></div><p class="video-caption">图片 + 卖点 + 场景，交给支持图片的 AI。</p></div>',
  `<div class="video-scene"><div class="video-scene-top"><span>03 / STORYBOARD</span><span>八项字段</span></div><div class="video-fields">${fields.map(([label,value])=>`<div><small>${label}</small><p>${value}</p></div>`).join('')}</div></div>`,
  '<div class="video-scene"><div class="video-scene-top"><span>04 / SCRIPT</span><span>双语输出</span></div><div class="video-script-output"><div><small>中文脚本 · 镜头 01</small><p>晨光洒在陶瓷杯上，镜头缓慢推进，呈现杯沿与表面质感。</p><span>提示词 / 转场 / 音频</span></div><div><small>ENGLISH · SHOT 01</small><p>Morning light falls on a ceramic mug. Slowly push in to reveal the rim and surface texture.</p><span>Prompt / Transition / Audio</span></div></div><p class="video-caption">完整输出按八项字段展开，再用于 AI 视频生成。</p></div>',
];

export function videoScriptDemo(icon){
  return `<div class="notebook-demo video-script-demo" data-video-demo data-playing="false"><div class="notebook-demo-head"><div><span class="notebook-eyebrow">FROM PRODUCT TO STORY</span><h4>看一次，就知道怎么用。</h4></div><div class="notebook-demo-controls"><button class="notebook-demo-control" type="button" data-video-toggle aria-label="播放分镜操作演示" aria-pressed="false">${icon('play')}</button><button class="notebook-demo-control" type="button" data-video-replay aria-label="重播分镜操作演示" title="重播分镜操作演示">${icon('replay')}</button></div></div><div class="notebook-demo-screen" data-video-screen></div><div class="notebook-demo-steps" role="group" aria-label="分镜脚本演示步骤">${videoScriptLabels.map((label,index)=>`<button type="button" data-video-step="${index}" aria-label="演示步骤 ${index+1}：${label}" aria-pressed="false"><span>${String(index+1).padStart(2,'0')}</span>${label}</button>`).join('')}</div><p class="notebook-demo-status" role="status" aria-live="off" data-video-status></p><p class="notebook-demo-disclaimer">固定示例 · 不上传图片、不调用 AI；展示脚本流程，不生成视频。</p></div>`;
}

export function mountVideoScriptDemo(root){
  return mountNotebookDemo(root,{frames:videoScriptFrames,stepLabels:videoScriptLabels,prefix:'video',description:'分镜操作演示'});
}
