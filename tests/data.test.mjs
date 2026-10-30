import {test} from 'node:test';
import assert from 'node:assert/strict';
import {skills,categories,workflows,filterSkills} from '../data.js';

test('all eight sample skills have unique IDs and complete content',()=>{
  assert.equal(skills.length,8);
  assert.equal(new Set(skills.map(skill=>skill.id)).size,skills.length);
  for(const skill of skills){
    assert.ok(categories.some(category=>category.id===skill.category));
    for(const key of ['title','subtitle','description','overview','prompt','takeaway','art','color','icon']) assert.ok(skill[key],`${skill.id}: ${key}`);
    assert.equal(skill.steps.length,4);
    assert.equal(skill.tags.length,2);
  }
});
test('category filtering returns expected records',()=>{
  assert.equal(filterSkills(skills).length,8);
  assert.equal(filterSkills(skills,'ai').length,3);
  assert.equal(filterSkills(skills,'design').length,2);
  assert.equal(filterSkills(skills,'dev').length,2);
  assert.equal(filterSkills(skills,'productivity').length,1);
});
test('search matches titles, English names, descriptions and tags',()=>{
  assert.equal(filterSkills(skills,'all','  PROMPT ARCHITECT ').length,1);
  assert.equal(filterSkills(skills,'all','提示词工程')[0].id,'prompt-architect');
  assert.equal(filterSkills(skills,'all','给知识')[0].id,'knowledge-garden');
  assert.equal(filterSkills(skills,'all','不存在的词').length,0);
});
test('favorites and search are combined without modifying the input',()=>{
  const saved=['prompt-architect','visual-story'];
  assert.equal(filterSkills(skills,'favorites','',saved).length,2);
  assert.equal(filterSkills(skills,'favorites','视觉',saved).length,1);
  assert.equal(filterSkills(skills,'favorites').length,0);
  assert.equal(skills.length,8);
});
test('all workflow steps resolve to existing skills',()=>{
  assert.equal(workflows.length,3);
  for(const workflow of workflows){
    assert.equal(workflow.skills.length,3);
    workflow.skills.forEach(id=>assert.ok(skills.some(skill=>skill.id===id)));
  }
});
