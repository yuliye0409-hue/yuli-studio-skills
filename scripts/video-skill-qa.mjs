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
  await page.locator('[data-skill-card="office-keyboard-mouse-tvc"]').screenshot({path:fileURLToPath(new URL(name,output))});
  await style.evaluate(element=>element.remove());
}
try{
  await page.goto(`${baseURL}/?skill=${skill.id}#skills`,{waitUntil:'networkidle'});
  check('Share link opens the Skill detail',await page.locator('#detail-dialog').evaluate(element=>element.open)&&await page.locator('#detail-title').textContent()===skill.title);
  await page.keyboard.press('Escape');
  await page.evaluate(()=>document.fonts.ready);
  check('Published Skill is first in the Skills collection',await page.locator('.skill-card').first().getAttribute('data-skill-card')===skill.id);
  check('Skill has no animation or playback controls',await page.locator('[data-skill-card="office-keyboard-mouse-tvc"] .notebook-demo, [data-video-demo], [data-video-toggle], [data-video-replay]').count()===0);
  await capture('video-skill-desktop.png');
  const downloadPromise=page.waitForEvent('download');
  await page.locator('[data-skill-card="office-keyboard-mouse-tvc"] [data-skill-download]').click();
  const download=await downloadPromise;
  check('Complete Skill ZIP downloads intact',download.suggestedFilename()===`${skill.id}.zip`&&(await fs.readFile(await download.path())).equals(await fs.readFile(new URL(`../${skill.download.slice(2)}`,import.meta.url))));
  check('Marked old Skill card is removed',await page.locator('[data-skill-card="amazon-a-plus-video-script"]').count()===0&&!await page.locator('#skills-grid').textContent().then(text=>text.includes('Video Storyboard')));
  await page.locator('[data-skill-card="office-keyboard-mouse-tvc"] .video-skill-actions [data-open]').click();
  check('Real Skill detail is distinguished from samples',await page.locator('.detail-tags').textContent().then(text=>text.includes('已发布 Skill')&&!text.includes('示例技能')));
  await page.locator('#copy-prompt').click();
  await page.waitForFunction(()=>document.querySelector('#copy-prompt').textContent.includes('已复制'));
  // The Windows clipboard converts LF to CRLF; compare the full text after normalization.
  check('Copy writes the complete original prompt',(await page.evaluate(()=>navigator.clipboard.readText())).replaceAll('\r\n','\n')===skill.prompt);
  check('Source link points at the site repository',await page.locator('.detail-repository [data-repository]').getAttribute('href')==='https://github.com/yuliye0409-hue/yuli-studio-skills');
  check('Complete ZIP and raw SKILL.md are available',await page.getByRole('link',{name:'下载完整技能 ZIP'}).last().getAttribute('href')===skill.download&&await page.getByRole('link',{name:'查看 SKILL.md'}).getAttribute('href')===skill.source);
  check('Install guide keeps the complete directory',await page.locator('.detail-steps').textContent().then(text=>text.includes('references')&&text.includes('整个目录')));
  await page.keyboard.press('Escape');
  await page.locator('#search-input').fill('办公键鼠');
  check('New Skill is searchable',await page.locator('.skill-card').count()===1);
  await page.locator(`[data-skill-card="office-keyboard-mouse-tvc"] [data-save="${skill.id}"]`).click();
  await page.locator('#filter-favorites').click();
  check('Skill remains usable after search and favorite filtering',await page.locator('[data-skill-card="office-keyboard-mouse-tvc"]').isVisible()&&await page.locator(`[data-skill-card="office-keyboard-mouse-tvc"] [data-save="${skill.id}"]`).getAttribute('aria-pressed')==='true'&&await page.locator('.video-skill-actions [data-skill-download]').isVisible());
  await page.locator('#search-input').fill('');
  await page.locator('#filter-all').click();
  for(const width of [320,390,600,768,960,1440]){
    await page.setViewportSize({width,height:1000});
    await page.locator('[data-skill-card="office-keyboard-mouse-tvc"]').scrollIntoViewIfNeeded();
    check(`Standard Skills grid at ${width}px`,await page.locator('#skills-grid').evaluate(element=>getComputedStyle(element).gridTemplateColumns.split(' ').length)===(width<600?1:width<960?2:3));
    check(`No empty demonstration column at ${width}px`,await page.locator('[data-skill-card="office-keyboard-mouse-tvc"]').evaluate(element=>getComputedStyle(element).display==='flex'&&getComputedStyle(element).gridColumnStart==='auto'&&getComputedStyle(element).gridColumnEnd==='auto'));
    check(`No overflow at ${width}px`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth&&document.body.scrollWidth<=innerWidth));
    if(width===390)await capture('video-skill-mobile.png');
  }
  check('Removed animation module is not requested',!assetRequests.some(url=>url.includes('/video-script-demo.js')));
  await page.goto(`${baseURL}/?skill=unknown#skills`,{waitUntil:'networkidle'});
  check('Unknown share link does not open a dialog',!await page.locator('#detail-dialog').evaluate(element=>element.open));
  check('No JavaScript or site asset errors',errors.length===0);
  console.log(JSON.stringify({passed:checks.length,checks,errors},null,2));
}finally{await browser.close();}
