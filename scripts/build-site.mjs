import {cp, mkdir, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const root=fileURLToPath(new URL('..',import.meta.url));
export const siteFiles=['index.html','styles.css','app.js','data.js','public'];

// An explicit allowlist keeps development files, history and private files offline.
export async function buildSite(destination=path.join(root,'_site')){
  const target=path.resolve(destination);
  if(target===root||root.startsWith(`${target}${path.sep}`))throw new Error('Build output must not contain the source directory.');
  await mkdir(target,{recursive:true});
  for(const file of siteFiles)await cp(path.join(root,file),path.join(target,file),{recursive:true});
  await writeFile(path.join(target,'.nojekyll'),'');
  return target;
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  console.log(`Built Yuli Studio: ${await buildSite()}`);
}
