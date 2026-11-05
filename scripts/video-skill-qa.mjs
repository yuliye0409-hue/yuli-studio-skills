import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {skills} from '../data.js';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const baseURL=(process.env.BASE_URL||'http://127.0.0.1:4317').replace(/\/$/,'');
const skill=skills.find(item=>item.source);
const output=new URL('../artifacts/yuli-studio/',import.meta.url);
await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce',permissions:['clipboard-read','clipboard-write'],acceptDownloads:true});
const page=await context.newPage();
const errors=[],checks=[],assetRequests=[];
page.on('pageerror',error=>errors.push(error.message));
page.on('request',request=>{if(request.url().startsWith(baseURL))assetRequests.push(request.url());});
page.on('response',response=>{if(response.url().startsWith(baseURL)&&response.status()>=400)errors.push(`${response.status()} ${response.url()}`);});
function check(name,result){checks.push({name,passed:!!result});if(!result)throw new Error(`Failed: ${name}`);}
async function capture(name){
  await page.evaluate(()=>document.activeElement?.blur());
  const style=await page.addStyleTag({content:'.site-header,.skip-link,.reading-progress,#toast{visibility:hidden}'});
  await page.locator('.video-skill-card').screenshot({path:fileURLToPath(new URL(name,output))});
  await style.evaluate(element=>element.remove());
}
try{
  await page.goto(`${baseURL}/#skills`,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  check('Published Skill is first in the Skills collection',await page.locator('.skill-card').first().getAttribute('data-skill-card')===skill.id);
  check('Skill has no animation or playback controls',await page.locator('.video-skill-card .notebook-demo, [data-video-demo], [data-video-toggle], [data-video-replay]').count()===0);
  await capture('video-skill-desktop.png');
  const downloadPromise=page.waitForEvent('download');
  await page.locator('.video-skill-card [data-skill-download]').click();
  const download=await downloadPromise;
  check('Original SKILL.md downloads intact',download.suggestedFilename()==='SKILL.md'&&await fs.readFile(await download.path(),'utf8')===await fs.readFile(new URL(`../${skill.source.slice(2)}`,import.meta.url),'utf8'));
  await page.locator('.video-skill-actions [data-open]').click();
  check('Real Skill detail is distinguished from samples',await page.locator('.detail-tags').textContent().then(text=>text.includes('已收录 Skill')&&!text.includes('示例技能')));
  await page.locator('#copy-prompt').click();
  await page.waitForFunction(()=>document.querySelector('#copy-prompt').textContent.includes('已复制'));
  // The Windows clipboard converts LF to CRLF; compare the full text after normalization.
  check('Copy writes the complete original prompt',(await page.evaluate(()=>navigator.clipboard.readText())).replaceAll('\r\n','\n')===skill.prompt);
  check('Source link points at the published file',await page.locator('.detail-repository a').last().getAttribute('href')===`https://github.com/yuliye0409-hue/yuli-studio-skills/blob/master/${skill.source.slice(2)}`);
  await page.keyboard.press('Escape');
  await page.locator('#search-input').fill('视频分镜');
  check('New Skill is searchable',await page.locator('.skill-card').count()===1);
  await page.locator(`.video-skill-card [data-save="${skill.id}"]`).click();
  await page.locator('#filter-favorites').click();
  check('Skill remains usable after search and favorite filtering',await page.locator('.video-skill-card').isVisible()&&await page.locator(`.video-skill-card [data-save="${skill.id}"]`).getAttribute('aria-pressed')==='true'&&await page.locator('.video-skill-actions [data-skill-download]').isVisible());
  await page.locator('#search-input').fill('');
  await page.locator('#filter-all').click();
  for(const width of [320,390,600,768,960,1440]){
    await page.setViewportSize({width,height:1000});
    await page.locator('.video-skill-card').scrollIntoViewIfNeeded();
    check(`Standard Skills grid at ${width}px`,await page.locator('#skills-grid').evaluate(element=>getComputedStyle(element).gridTemplateColumns.split(' ').length)===(width<600?1:width<960?2:3));
    check(`No empty demonstration column at ${width}px`,await page.locator('.video-skill-card').evaluate(element=>getComputedStyle(element).display==='flex'&&getComputedStyle(element).gridColumnStart==='auto'&&getComputedStyle(element).gridColumnEnd==='auto'));
    check(`No overflow at ${width}px`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth&&document.body.scrollWidth<=innerWidth));
    if(width===390)await capture('video-skill-mobile.png');
  }
  check('Removed animation module is not requested',!assetRequests.some(url=>url.includes('/video-script-demo.js')));
  check('No JavaScript or site asset errors',errors.length===0);
  console.log(JSON.stringify({passed:checks.length,checks,errors},null,2));
}finally{await browser.close();}
