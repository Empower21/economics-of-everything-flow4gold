import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,args:['--enable-unsafe-swiftshader']});
try{
const page=await browser.newPage();await page.goto((process.env.TEST_BASE_URL||'http://127.0.0.1:3182')+'/lessons/factory-supply-chain');
await page.waitForFunction(()=>window.lessonCapture);await page.evaluate(()=>window.lessonCapture.set({elapsedDays:1,sellImmediately:false,dailySales:0}));
await page.locator('#toggle-view').click();assert.equal(await page.locator('#flat-view .cost').evaluate(e=>e.style.width),'100%');assert.match(await page.locator('.flat-bars').textContent(),/1,005/);
console.log('PASS: factory 2D cost bar includes holding and operations when no vehicles sell.');
}finally{await browser.close();}
