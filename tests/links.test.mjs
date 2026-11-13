import {test} from 'node:test';
import assert from 'node:assert/strict';
import {externalURL,emailURL} from '../public/links.js';
import {siteConfig} from '../public/site.config.js';
import {projects,skills,articles} from '../data.js';

test('repository links accept HTTPS GitHub repositories only',()=>{
  assert.equal(externalURL('https://github.com/example/project',{repository:true}),'https://github.com/example/project');
  for(const url of [null,'','javascript:alert(1)','http://github.com/example/project','https://github.com','https://github.com/example','https://github.com.evil.test/example/project','https://user:pass@github.com/example/project','https://github.com/example/project/issues'])assert.equal(externalURL(url,{repository:true}),null,String(url));
});
test('demo URLs accept HTTPS without credentials',()=>{
  assert.equal(externalURL('https://example.com/demo'),'https://example.com/demo');
  for(const url of ['//example.com','data:text/html,hello','ftp://example.com','https://user@site.test','https://site.test:444'])assert.equal(externalURL(url),null);
});
test('email values cannot inject mail headers',()=>{
  assert.equal(emailURL('hello@example.com'),'mailto:hello@example.com');
  for(const email of [null,'','a@b','hello@example.com?bcc=other@example.com','hello@example.com\r\nBcc:a@b.com'])assert.equal(emailURL(email),null);
});
test('every project and skill has a centralized binding slot',()=>{
  projects.forEach(project=>assert.ok(Object.hasOwn(siteConfig.projects,project.id)));
  skills.forEach(skill=>assert.ok(Object.hasOwn(siteConfig.skills,skill.id)));
});
test('published projects have real addresses and exclude the site itself and placeholders',()=>{
  assert.deepEqual(projects.map(project=>project.id),['ai-question-notebook','prompt-tool']);
  assert.deepEqual(Object.keys(siteConfig.projects).sort(),projects.map(project=>project.id).sort());
  for(const project of projects){
    const binding=siteConfig.projects[project.id];
    assert.ok(externalURL(binding.repository,{repository:true})||externalURL(binding.demo)||externalURL(binding.download),project.id);
    assert.notEqual(binding.demo,siteConfig.url);
    assert.notEqual(project.status,'示例展示位');
  }
});
test('verified owner and website metadata are bound, while sample Skills remain unbound',()=>{
  assert.equal(siteConfig.profile.github,'https://github.com/yuliye0409-hue');
  for(const key of ['email','bilibili','xiaohongshu'])assert.equal(siteConfig.profile[key],null);
  assert.equal(externalURL(siteConfig.repository,{repository:true}),siteConfig.repository);
  assert.equal(externalURL(siteConfig.url),siteConfig.url);
  skills.filter(skill=>!skill.source).forEach(skill=>assert.equal(siteConfig.skills[skill.id],null));
  skills.filter(skill=>skill.source).forEach(skill=>assert.equal(siteConfig.skills[skill.id],siteConfig.repository));
  assert.equal(Object.hasOwn(siteConfig.skills,'amazon-a-plus-video-script'),false);
  const download=new URL(skills.find(skill=>skill.source).download,siteConfig.url);
  assert.equal(download.href,'https://yuliye0409-hue.github.io/yuli-studio-skills/public/skills/office-keyboard-mouse-tvc.zip');
});
test('sample articles are explicitly drafts without invented publish dates',()=>{
  assert.equal(articles.length,3);
  articles.forEach(article=>{assert.equal(article.status,'示例草稿');assert.equal(article.date,null);assert.equal(article.sections.length,3);});
});
