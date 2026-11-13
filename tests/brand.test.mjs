import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {siteConfig} from '../public/site.config.js';
import {projects} from '../data.js';

test('Yuli Studio metadata is retained without a self-referential project card',()=>{
  assert.equal(siteConfig.name,'Yuli Studio');
  assert.equal(siteConfig.repository,'https://github.com/yuliye0409-hue/yuli-studio-skills');
  assert.equal(siteConfig.url,'https://yuliye0409-hue.github.io/yuli-studio-skills/');
  assert.equal(projects.some(project=>project.id==='skill-garden'),false);
  assert.equal(Object.hasOwn(siteConfig.projects,'skill-garden'),false);
});
test('Y monogram and favicon share the same vector artwork',()=>{
  const logo=readFileSync(new URL('../public/logo.svg',import.meta.url),'utf8').trim();
  const favicon=readFileSync(new URL('../public/favicon.svg',import.meta.url),'utf8').trim();
  assert.equal(logo,favicon);
  assert.match(logo,/id="yuli-mark"/);
});
test('AI question notebook links point to the public project and website',()=>{
  assert.equal(siteConfig.projects['ai-question-notebook'].repository,'https://github.com/yuliye0409-hue/ai-question-notebook');
  assert.equal(siteConfig.projects['ai-question-notebook'].demo,'https://yuliye0409-hue.github.io/ai-question-notebook/');
  assert.equal(projects.find(project=>project.id==='ai-question-notebook').status,'已上线');
});
test('Prompt-Tool provides extension download without claiming a web demo',()=>{
  const binding=siteConfig.projects['prompt-tool'];
  assert.equal(binding.repository,'https://github.com/yuliye0409-hue/Prompt-Tool');
  assert.equal(binding.download,'https://github.com/yuliye0409-hue/Prompt-Tool/archive/refs/heads/main.zip');
  assert.equal(binding.demo,null);
  assert.equal(projects.find(project=>project.id==='prompt-tool').type,'浏览器扩展');
});
