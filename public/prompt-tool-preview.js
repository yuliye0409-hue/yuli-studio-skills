// Static project cover; no walkthrough, timers or model calls.
export const promptSample='<div class="prompt-sample" aria-label="示例图片：一只杯子"><span class="prompt-sample-light"></span><span class="prompt-sample-cup"></span><small>SAMPLE IMAGE / 001</small></div>';
export function promptToolPreview(){
  return `<div class="project-stage prompt-tool-stage"><div class="notebook-preview prompt-preview"><div class="notebook-preview-top"><span class="notebook-mark">P</span><span>Prompt-Tool <small>IMAGE PROMPT STUDIO</small></span><span class="notebook-live">Chrome / Edge</span></div><p class="notebook-eyebrow">从一张图，找到下一次创作的语言</p><h4>看见灵感，<br>也能说出灵感。</h4>${promptSample}<div class="notebook-preview-foot"><span>悬停唤起</span><span>手动生成</span><span>中英文复制</span></div></div></div>`;
}
