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
const errors=[],checks=[];
page.on('pageerror',error=>errors.push(error.message));
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
  check('Reduced motion starts the walkthrough paused',await page.locator('[data-video-toggle]').getAttribute('aria-pressed')==='false');
  for(let step=0;step<4;step++){
    await page.locator(`[data-video-step="${step}"]`).click();
    check(`Manual step ${step+1} selects its frame and pauses`,await page.locator('[data-video-screen]').getAttribute('data-scene')===String(step)&&await page.locator('[data-video-toggle]').getAttribute('aria-pressed')==='false');
  }
  check('Final frame displays Chinese and English',await page.locator('.video-script-output').innerText().then(text=>text.includes('中文脚本')&&text.includes('ENGLISH')));
  await page.locator('[data-video-step="2"]').click();
  check('Storyboard exposes all eight fields',await page.locator('.video-fields small').count()===8);
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
  check('Favorite rerender retains one functional player',await page.locator('[data-video-demo]').count()===1);
  await page.locator('[data-video-step="3"]').click();
  check('Remounted player responds after filtering and saving',await page.locator('[data-video-screen]').getAttribute('data-scene')==='3');
  await page.locator('#search-input').fill('');
  await page.locator('#filter-all').click();
  for(const width of [320,390,600,768,960,1440]){
    await page.setViewportSize({width,height:1000});
    await page.locator('.video-skill-card').scrollIntoViewIfNeeded();
    check(`Skill layout adapts at ${width}px`,await page.locator('.video-skill-card').evaluate(element=>getComputedStyle(element).gridTemplateColumns.split(' ').length)===(width<600?1:2));
    for(let step=0;step<4;step++){
      await page.locator(`[data-video-step="${step}"]`).click();
      const fits=await page.evaluate(()=>{
        const screen=document.querySelector('[data-video-screen]');
        return document.documentElement.scrollWidth<=innerWidth&&screen.scrollWidth<=screen.clientWidth&&screen.scrollHeight<=screen.clientHeight;
      });
      check(`Frame ${step+1} fits at ${width}px`,fits);
    }
    if(width===390)await capture('video-skill-mobile.png');
  }
  await page.setViewportSize({width:1440,height:1000});
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.locator('[data-video-replay]').click();
  check('Replay resets and starts animation',await page.locator('[data-video-screen]').getAttribute('data-scene')==='0'&&await page.locator('[data-video-toggle]').getAttribute('aria-pressed')==='true');
  await page.waitForFunction(()=>document.querySelector('[data-video-screen]').dataset.scene==='1',null,{timeout:6500});
  await page.locator('[data-video-toggle]').click();
  check('Pause freezes selected frame',await page.locator('[data-video-toggle]').getAttribute('aria-pressed')==='false');
  await page.locator('[data-video-toggle]').click();
  await page.locator('#tab-products').click();
  const hidden=await page.locator('[data-video-screen]').getAttribute('data-scene');
  await page.waitForTimeout(4500);
  check('Hidden Skill animation suspends',await page.locator('[data-video-screen]').getAttribute('data-scene')===hidden);
  await page.locator('#tab-skills').click();
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForFunction(()=>document.querySelector('[data-video-toggle]').getAttribute('aria-pressed')==='false',null,{timeout:2000});
  check('Reduced-motion change pauses the player',await page.locator('[data-video-toggle]').getAttribute('aria-pressed')==='false');
  check('No JavaScript or site asset errors',errors.length===0);
  console.log(JSON.stringify({passed:checks.length,checks,errors},null,2));
}finally{await browser.close();}
