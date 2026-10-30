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
test('verified owner and website are bound, while sample slots remain unbound',()=>{
  assert.equal(siteConfig.profile.github,'https://github.com/yuliye0409-hue');
  for(const key of ['email','bilibili','xiaohongshu'])assert.equal(siteConfig.profile[key],null);
  assert.equal(externalURL(siteConfig.projects['skill-garden'].repository,{repository:true}),siteConfig.projects['skill-garden'].repository);
  assert.equal(externalURL(siteConfig.projects['skill-garden'].demo),siteConfig.projects['skill-garden'].demo);
  for(const key of ['creative-workbench','automation-kit'])assert.deepEqual(siteConfig.projects[key],{repository:null,demo:null});
  Object.values(siteConfig.skills).forEach(value=>assert.equal(value,null));
});
test('sample articles are explicitly drafts without invented publish dates',()=>{
  assert.equal(articles.length,3);
  articles.forEach(article=>{assert.equal(article.status,'示例草稿');assert.equal(article.date,null);assert.equal(article.sections.length,3);});
});
