import {chromium} from 'playwright';
import {preparedLesson} from '../shared/lesson.js';
import assert from 'node:assert/strict';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:3184';
const b=await chromium.launch({headless:true,args:['--autoplay-policy=no-user-gesture-required']});
try{
 const p=await b.newPage();await p.route('**/models/*.glb',r=>r.abort());let release;const gate=new Promise(r=>release=r);let speechRequests=0;
 await p.route('**/api/lesson',async route=>{const request=route.request().postDataJSON();await gate;await route.fulfill({json:preparedLesson(request)});});
 await p.route('**/api/speech',route=>{speechRequests++;return route.abort();});await p.goto(base);await p.locator('#spoken-reply').check();await p.locator('#question').fill('Why did profit change?');await p.locator('#ask').click();await p.locator('#watch').click();await p.waitForFunction(()=>document.querySelector('video').currentTime>0);release();await p.waitForFunction(()=>!document.querySelector('#ask').disabled);await p.waitForTimeout(500);
 assert.equal(speechRequests,0);assert.equal(await p.locator('video').evaluate(v=>v.paused),false);assert.equal(await p.locator('#video-dialog').evaluate(d=>d.open),true);console.log('PASS pending tutor answer stays textual while the film is playing.');
}finally{await b.close();}
