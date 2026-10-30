import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {siteConfig} from '../public/site.config.js';
import {projects} from '../data.js';

test('Yuli Studio name is consistent in config and current project',()=>{
  assert.equal(siteConfig.name,'Yuli Studio');
  assert.equal(projects.find(project=>project.id==='skill-garden').name,siteConfig.name);
  assert.ok(Object.hasOwn(siteConfig.projects,'skill-garden'));
});
test('Y monogram and favicon share the same vector artwork',()=>{
  const logo=readFileSync(new URL('../public/logo.svg',import.meta.url),'utf8').trim();
  const favicon=readFileSync(new URL('../public/favicon.svg',import.meta.url),'utf8').trim();
  assert.equal(logo,favicon);
  assert.match(logo,/id="yuli-mark"/);
});
