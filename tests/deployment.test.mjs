import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,readdir,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {buildSite} from '../scripts/build-site.mjs';

test('static build contains only public site assets',async()=>{
  const destination=await mkdtemp(path.join(tmpdir(),'yuli-site-test-'));
  try{
    await buildSite(destination);
    assert.deepEqual((await readdir(destination)).sort(),['.nojekyll','app.js','data.js','index.html','public','styles.css']);
    const html=await readFile(path.join(destination,'index.html'),'utf8');
    const app=await readFile(path.join(destination,'app.js'),'utf8');
    assert.doesNotMatch(html,/(?:href|src)=["']\/(?!\/)/);
    assert.doesNotMatch(app,/href=["']\/public\//);
    const prefix='https://example.test/yuli-studio-skills/';
    for(const match of html.matchAll(/(?:src|href)="(\.\/[^"#]+)"/g)){
      assert.ok(new URL(match[1],prefix).pathname.startsWith('/yuli-studio-skills/'));
    }
  }finally{await rm(destination,{recursive:true,force:true});}
});
