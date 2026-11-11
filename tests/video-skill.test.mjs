import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,mkdtemp,rm,access} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {inflateRawSync} from 'node:zlib';
import {skills,filterSkills} from '../data.js';
import {buildSite} from '../scripts/build-site.mjs';

const skill=skills.find(item=>item.id==='office-keyboard-mouse-tvc');
const sourceURL=new URL(`../${skill.source.slice(2)}`,import.meta.url);
const packageFiles=['SKILL.md','agents/openai.yaml','references/board-to-video.md','references/intake.md','references/tvc-blueprint.md'];

test('TVC Skill replaces the old card and documents the staged workflow',async()=>{
  const source=(await readFile(sourceURL,'utf8')).replaceAll('\r\n','\n').trim();
  assert.match(source,/^---\nname: office-keyboard-mouse-tvc\n/);
  for(const stage of ['阶段一','阶段二','阶段三'])assert.ok(source.includes(stage));
  assert.ok(source.includes('无 BGM、无旁白、无人物对白'));
  assert.deepEqual(filterSkills(skills,'design','办公键鼠').map(item=>item.id),[skill.id]);
  assert.ok(skill.prompt.includes('$office-keyboard-mouse-tvc'));
  assert.ok(skill.prompt.includes('本轮不提前编写视频生成提示词'));
  assert.equal(skills.some(item=>item.id==='amazon-a-plus-video-script'||item.subtitle==='Video Storyboard'),false);
  await assert.rejects(access(new URL('../public/skills/amazon-a-plus-video-script/SKILL.md',import.meta.url)),{code:'ENOENT'});
  for(const match of source.matchAll(/\]\((references\/[^)]+)\)/g))await access(new URL(match[1],sourceURL));
});

test('complete downloadable ZIP contains every unmodified Skill file',async()=>{
  const archive=await readFile(new URL(`../${skill.download.slice(2)}`,import.meta.url));
  const end=archive.lastIndexOf(Buffer.from([0x50,0x4b,0x05,0x06]));
  assert.ok(end>=0,'ZIP end record exists');
  const count=archive.readUInt16LE(end+10),files=new Map();
  let position=archive.readUInt32LE(end+16);
  for(let index=0;index<count;index++){
    assert.equal(archive.readUInt32LE(position),0x02014b50);
    const method=archive.readUInt16LE(position+10),size=archive.readUInt32LE(position+20);
    const nameLength=archive.readUInt16LE(position+28),extra=archive.readUInt16LE(position+30),comment=archive.readUInt16LE(position+32);
    const name=archive.subarray(position+46,position+46+nameLength).toString('utf8');
    const local=archive.readUInt32LE(position+42);
    assert.equal(archive.readUInt32LE(local),0x04034b50);
    const dataStart=local+30+archive.readUInt16LE(local+26)+archive.readUInt16LE(local+28);
    const compressed=archive.subarray(dataStart,dataStart+size);
    assert.ok(method===0||method===8,'standard ZIP compression');
    if(!name.endsWith('/'))files.set(name,method===8?inflateRawSync(compressed):compressed);
    position+=46+nameLength+extra+comment;
  }
  assert.deepEqual([...files.keys()].sort(),packageFiles.map(file=>`${skill.id}/${file}`).sort());
  for(const file of packageFiles)assert.deepEqual(files.get(`${skill.id}/${file}`),await readFile(new URL(file,sourceURL)),file);
});

test('video Skill has no animation import or player markup',async()=>{
  const app=await readFile(new URL('../app.js',import.meta.url),'utf8');
  assert.doesNotMatch(app,/video-script-demo|data-video-demo|mountVideoScriptDemo|videoScriptDemo/);
  assert.match(app,/data-skill-download/);
});

test('Pages build includes the complete TVC Skill and excludes the removed source',async()=>{
  const destination=await mkdtemp(path.join(tmpdir(),'yuli-video-test-'));
  try{
    await buildSite(destination);
    assert.equal(await readFile(path.join(destination,skill.source.slice(2)),'utf8'),await readFile(sourceURL,'utf8'));
    assert.deepEqual(await readFile(path.join(destination,skill.download.slice(2))),await readFile(new URL(`../${skill.download.slice(2)}`,import.meta.url)));
    for(const file of packageFiles)await access(path.join(destination,'public/skills',skill.id,file));
    await assert.rejects(access(path.join(destination,'public/skills/amazon-a-plus-video-script/SKILL.md')),{code:'ENOENT'});
    await assert.rejects(access(path.join(destination,'public/video-script-demo.js')),{code:'ENOENT'});
  }finally{await rm(destination,{recursive:true,force:true});}
});
