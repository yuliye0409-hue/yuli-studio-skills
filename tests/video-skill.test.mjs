import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {skills,filterSkills} from '../data.js';
import {videoScriptFrames,videoScriptLabels} from '../public/video-script-demo.js';
import {buildSite} from '../scripts/build-site.mjs';

const skill=skills.find(item=>item.id==='amazon-a-plus-video-script');
const sourceURL=new URL(`../${skill.source.slice(2)}`,import.meta.url);

test('published Skill retains its metadata and original prompt body',async()=>{
  const source=(await readFile(sourceURL,'utf8')).replaceAll('\r\n','\n').trim();
  const parts=source.split('---');
  assert.equal(parts.length,3);
  assert.match(parts[1],/name: 视频分镜脚本编写/);
  assert.match(parts[1],/description: 通过提供产品图、对应卖点以及简单的画面描述/);
  assert.equal(parts[2].trim(),skill.prompt);
  assert.deepEqual(filterSkills(skills,'design','视频分镜').map(item=>item.id),[skill.id]);
  for(const label of ['镜头','时长','对应素材','画面内容','镜头动作','提示词','转场建议','适配音频'])assert.ok(skill.prompt.includes(label));
});

test('walkthrough covers the Skill inputs, eight fields and bilingual output',()=>{
  assert.equal(videoScriptFrames.length,4);
  assert.equal(videoScriptLabels.length,4);
  assert.match(videoScriptFrames[0],/示例素材/);
  assert.match(videoScriptFrames[1],/产品卖点/);
  assert.match(videoScriptFrames[1],/简单的画面描述/);
  for(const label of ['镜头','时长','对应素材','画面内容','镜头动作','提示词','转场建议','适配音频'])assert.ok(videoScriptFrames[2].includes(`<small>${label}</small>`));
  assert.match(videoScriptFrames[3],/中文脚本/);
  assert.match(videoScriptFrames[3],/ENGLISH/);
});

test('Pages build includes a downloadable copy of the actual Skill',async()=>{
  const destination=await mkdtemp(path.join(tmpdir(),'yuli-video-test-'));
  try{
    await buildSite(destination);
    assert.equal(await readFile(path.join(destination,skill.source.slice(2)),'utf8'),await readFile(sourceURL,'utf8'));
    assert.equal(await readFile(path.join(destination,'public/video-script-demo.js'),'utf8'),await readFile(new URL('../public/video-script-demo.js',import.meta.url),'utf8'));
  }finally{await rm(destination,{recursive:true,force:true});}
});
