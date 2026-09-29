import {chromium} from 'playwright';
import {mkdir,rename} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {preparedLesson} from '../shared/lesson.js';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:3182';
const dir='docs/evidence/after';await mkdir(dir,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required']});
try{
for(const mobile of [false,true]){
  const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:1080},isMobile:mobile,hasTouch:mobile,recordVideo:{dir:'.local/interaction-captures',size:mobile?{width:390,height:844}:{width:1280,height:960}}});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(base,{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.querySelector('#venue')?.dataset.loaded==='true');
  if(mobile)await page.locator('.control-tray>summary').click();
  for(const capacity of [1000,5000,20000,1234]){await page.locator('#field-capacity').fill(String(capacity));await page.locator('#field-capacity').dispatchEvent('change');assert.equal(await page.locator('[data-metric=attendance]').textContent(),'150');}
  await page.locator('#reset-scenario').click();await page.locator('[data-zone=audience]').click();await page.waitForTimeout(1200);
  await page.locator('#reset-camera').click();await page.locator('#pause').click();await page.waitForTimeout(300);
  const pausedA=await page.locator('#venue').screenshot();await page.waitForTimeout(400);const pausedB=await page.locator('#venue').screenshot();assert.equal(pausedA.equals(pausedB),true);
  await page.locator('#pause').click();await page.waitForTimeout(350);const moving=await page.locator('#venue').screenshot();assert.equal(moving.equals(pausedB),false);
  await page.locator('#toggle-view').click();assert.equal(await page.locator('#flat-view').isVisible(),true);await page.waitForTimeout(600);await page.locator('#toggle-view').click();
  for(const id of ['concert-economics','conference-economics','factory-supply-chain']){
    await page.goto(`${base}/lessons/${id}`,{waitUntil:'networkidle'});await page.waitForFunction(()=>document.querySelector('#venue')?.dataset.loaded==='true');
    for(const lang of ['en','de']){
      if(lang==='de')await page.locator('#language').selectOption('de');
      await page.locator('#watch').click();await page.waitForFunction(()=>{const v=document.querySelector('#explainer');return v.readyState>=2&&v.currentTime>.1;},null,{timeout:30000});
      const data=await page.locator('#explainer').evaluate(v=>({duration:v.duration,captions:v.textTracks[0]?.cues?.length,playing:!v.paused}));assert.ok(data.duration>=45&&data.duration<=75);assert.ok(data.captions>=5);assert.ok(data.playing);assert.ok((await page.locator('#video-transcript').textContent()).length>400);await page.locator('#close-video').click();
    }
    if(mobile)await page.screenshot({path:`${dir}/${id}-mobile.png`,fullPage:true});
  }
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert.deepEqual(errors,[]);
  const video=page.video();await context.close();await rename(await video.path(),`${dir}/${mobile?'mobile':'desktop'}-interaction.webm`);
  console.log(`PASS ${mobile?'mobile emulation':'desktop'}: custom capacities, pause pixel stability, animation pixel change, 2D, all direct routes, 6 playable captioned videos, no page errors/overflow.`);
}
const page=await browser.newPage();await page.route('**/models/*.glb',route=>route.abort());await page.goto(base);await page.waitForFunction(()=>!document.querySelector('#flat-view').hidden);assert.equal(await page.locator('[data-metric=profit]').textContent(),'750');console.log('PASS failed 3D → working 2D.');
await page.route('**/api/lesson',async route=>{const request=route.request().postDataJSON();await new Promise(r=>setTimeout(r,1000));await route.fulfill({json:preparedLesson(request)});});
await page.locator('#question').fill('Explain this scenario');await page.locator('#ask').click();await page.locator('#field-ticketPrice').fill('30');await page.locator('#field-ticketPrice').dispatchEvent('change');await page.waitForTimeout(1400);assert.match(await page.locator('#explanation').textContent(),/1,000/);assert.doesNotMatch(await page.locator('#explanation').textContent(),/750/);console.log('PASS stale question cannot overwrite new scenario.');
await page.locator('[data-lesson=conference-economics]').click();await page.locator('[data-lesson=factory-supply-chain]').click();await page.goBack();assert.match(await page.locator('h1').textContent(),/conference/);await page.goForward();assert.match(await page.locator('h1').textContent(),/car/);await page.locator('.assumptions>a').evaluate(a=>a.click());assert.match(await page.locator('pre').textContent(),/Receive/);console.log('PASS browser history and methodology route.');
}finally{await browser.close();}
