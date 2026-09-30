import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir,rename} from 'node:fs/promises';
import {preparedLesson} from '../shared/lesson.js';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:3184',dir='docs/evidence/addendum02';await mkdir(dir,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required']});
const field=async(p,k,v)=>{await p.locator('#field-'+k).fill(String(v));await p.locator('#field-'+k).dispatchEvent('change');};
const metric=(p,k)=>p.locator(`[data-metric=${k}]`).textContent();
try{
 for(const mobile of [false,true]){
  const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:1080},isMobile:mobile,hasTouch:mobile});const p=await context.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto(base);await p.waitForFunction(()=>document.querySelector('#venue')?.dataset.loaded==='true',null,{timeout:90000});
  if(!mobile){await p.locator('#pause').click();const a=await p.locator('#venue').screenshot();await p.waitForTimeout(400);const b=await p.locator('#venue').screenshot();assert.ok(a.equals(b));await p.locator('#pause').click();await p.waitForTimeout(400);assert.ok(!a.equals(await p.locator('#venue').screenshot()));}
  assert.equal(await p.locator('#voice-sample').count(),0);assert.equal(await p.locator('.fields .field').count(),2);
  await field(p,'ticketPrice',30);assert.equal(await metric(p,'attendance'),'100');assert.equal(await metric(p,'profit'),'1,000');assert.match(await p.locator('#causal-change').textContent(),/unchanged/);
  await p.locator('#undo').click();assert.equal(await metric(p,'profit'),'750');
  await field(p,'capacity',1000);assert.equal(await metric(p,'attendance'),'150');assert.equal(await metric(p,'totalCost'),'4,250');assert.equal(await metric(p,'profit'),'-1,250');
  assert.match(await p.locator('#causal-change').textContent(),/does not create buyers/);
  await p.locator('.explore-panel>summary').click();const before=await p.evaluate(()=>window.lessonCapture.state());await p.locator('[data-zone=stage]').click();assert.deepEqual(await p.evaluate(()=>window.lessonCapture.state()),before);assert.equal(await p.locator('[data-zone=stage]').getAttribute('aria-pressed'),'true');await p.locator('#experiment').click();assert.equal(await p.locator('#field-productionBudget').inputValue(),'1250');await p.locator('#undo').click();assert.equal(await p.locator('#field-productionBudget').inputValue(),'1000');
  await p.locator('#save-scenario').click();await field(p,'ticketPrice',30);assert.equal(await p.locator('#comparison').isVisible(),true);await p.locator('#reset-scenario').click();assert.equal(await p.locator('#comparison').isVisible(),false);
  await p.locator('#toggle-view').click();assert.equal(await p.locator('#flat-view svg').isVisible(),true);await p.locator('[data-zone=audience]').click();assert.equal(await p.locator('[data-illustration-zone=audience]').getAttribute('class'),'illustrated-zone selected');await p.screenshot({path:`${dir}/concert-${mobile?'mobile':'desktop'}-fallback.png`,fullPage:true});await p.locator('#toggle-view').click();
  for(const id of ['concert-economics','conference-economics','factory-supply-chain']){
   await p.goto(`${base}/lessons/${id}`);await p.waitForFunction(()=>document.querySelector('#venue')?.dataset.loaded==='true',null,{timeout:90000});
   if(id==='conference-economics'){assert.equal(await p.locator('.fields .field').count(),3);await field(p,'workshopSeats',300);assert.equal(await metric(p,'workshopAccess'),'60');assert.equal(await metric(p,'totalCost'),'26,000');assert.equal(await metric(p,'profit'),'4,000');assert.equal(await metric(p,'budgetGap'),'1,000');}
   if(id==='factory-supply-chain'){
    for(const [output,stock] of [[100,50],[50,0],[0,0],[100,100]]){await p.locator('#advance-day').click();assert.equal(await metric(p,'produced'),String(output));assert.equal(await metric(p,'inventory'),String(stock));}assert.equal(await metric(p,'cumulativeOutput'),'250');
    await field(p,'openingInventory',250);assert.equal(await metric(p,'day'),'0');assert.match(await p.locator('#causal-change').textContent(),/Restarted/);await p.locator('#undo').click();assert.equal(await metric(p,'day'),'4');
    await p.locator('#run-days').click();await p.waitForTimeout(3250);await p.locator('#run-days').click();const day=await metric(p,'day');await p.waitForTimeout(3250);assert.equal(await metric(p,'day'),day);
   }
   await p.screenshot({path:`${dir}/${id}-${mobile?'mobile':'desktop'}.png`,fullPage:true});
   await p.locator('#language').selectOption('de');await p.waitForFunction(()=>document.querySelector('#venue')?.dataset.loaded==='true',null,{timeout:90000});assert.equal(await p.locator('html').getAttribute('lang'),'de');assert.ok((await p.locator('.fields .field-help').first().textContent()).length>15);
   assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  }
  assert.deepEqual(errors,[]);await context.close();console.log('PASS',mobile?'mobile emulation':'desktop','causal math, undo, focus/experiments, compare/reset, distinct fallback, factory restart/time, routes, German, overflow');
 }
 const p=await browser.newPage();await p.route('**/models/*.glb',r=>r.abort());for(const id of ['conference-economics','factory-supply-chain']){await p.goto(base+'/lessons/'+id);await p.waitForFunction(()=>!document.querySelector('#flat-view').hidden);assert.equal(await p.locator('#flat-view svg').count(),1);await p.locator('[data-zone]').first().evaluate(b=>b.click());assert.equal(await p.locator('.illustrated-zone.selected').count(),1);await p.screenshot({path:`${dir}/${id}-fallback.png`});}await p.goto(base);await p.waitForFunction(()=>!document.querySelector('#flat-view').hidden);assert.equal(await p.locator('#toggle-view').isVisible(),false);assert.equal(await p.locator('#reset-camera').isVisible(),false);assert.doesNotMatch(await p.locator('#view-instruction').textContent(),/Drag/);
 await p.route('**/api/lesson',async route=>{const request=route.request().postDataJSON();await new Promise(r=>setTimeout(r,1400));await route.fulfill({json:preparedLesson(request)});});await p.locator('#question').fill('Why did profit change?');await p.locator('#ask').click();await field(p,'ticketPrice',30);await p.waitForTimeout(1900);assert.match(await p.locator('#explanation').textContent(),/1,000/);console.log('PASS failed assets → meaningful fallback; stale answer discarded');
}finally{await browser.close();}
