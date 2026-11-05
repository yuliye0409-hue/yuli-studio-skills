import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {promptToolPreview} from '../public/prompt-tool-preview.js';
import {buildSite} from '../scripts/build-site.mjs';

test('project covers retain static content without walkthrough players',async()=>{
  const cover=promptToolPreview();
  assert.match(cover,/Prompt-Tool/);
  assert.match(cover,/prompt-sample-cup/);
  assert.doesNotMatch(cover,/notebook-demo|data-playing|data-prompt-(?:demo|step|toggle|replay)/);
  const app=await readFile(new URL('../app.js',import.meta.url),'utf8');
  assert.match(app,/少一点陌生名词/);
  assert.doesNotMatch(app,/mountNotebookDemo|mountPromptToolDemo|notebook-demo|prompt-tool-demo|data-(?:notebook|prompt|video)-(?:demo|toggle|replay)/);
  const css=await readFile(new URL('../styles.css',import.meta.url),'utf8');
  assert.doesNotMatch(css,/\.notebook-demo|@keyframes notebook-/);
});

test('published build includes static covers and excludes all removed animation modules',async()=>{
  const destination=await mkdtemp(path.join(tmpdir(),'yuli-static-covers-'));
  try{
    await buildSite(destination);
    assert.match(await readFile(path.join(destination,'public/prompt-tool-preview.js'),'utf8'),/export function promptToolPreview/);
    for(const file of ['notebook-demo.js','prompt-tool-demo.js','video-script-demo.js']){
      await assert.rejects(access(path.join(destination,'public',file)),{code:'ENOENT'});
    }
  }finally{await rm(destination,{recursive:true,force:true});}
});
