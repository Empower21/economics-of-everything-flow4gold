import {chromium} from 'playwright';
import {mkdir} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:3184',dir='docs/evidence/addendum02';await mkdir(dir,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--enable-unsafe-swiftshader']});
try{
 for(const mobile of [false,true]){
  const size=mobile?{width:390,height:844}:{width:1440,height:1000};const context=await browser.newContext({viewport:size,isMobile:mobile,hasTouch:mobile,recordVideo:{dir:'.local/visual02',size}});const p=await context.newPage();
  await p.goto(base);await p.waitForFunction(()=>document.querySelector('#venue')?.dataset.loaded==='true',null,{timeout:90000});await p.locator('.world-panel').scrollIntoViewIfNeeded();
  const start=Date.now();await p.waitForTimeout(2500);await p.locator('#field-ticketPrice').fill('30');await p.locator('#field-ticketPrice').dispatchEvent('change');await p.locator('.world-panel').scrollIntoViewIfNeeded();await p.waitForTimeout(3500);await p.locator('#undo').click();await p.locator('.world-panel').scrollIntoViewIfNeeded();await p.waitForTimeout(3000);await p.locator('[data-zone=stage]').evaluate(b=>b.click());await p.waitForTimeout(3000);
  await p.screenshot({path:`${dir}/concert-action-${mobile?'mobile':'desktop'}.png`});const duration=(Date.now()-start)/1000;const video=p.video();await context.close();const raw=await video.path();const total=Number(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',raw],{encoding:'utf8'}));
  execFileSync('ffmpeg',['-y','-loglevel','error','-ss',String(Math.max(0,total-duration)),'-i',raw,'-t','15','-c:v','libx264','-preset','fast','-crf','24','-pix_fmt','yuv420p','-movflags','+faststart',`${dir}/input-change-${mobile?'mobile':'desktop'}.mp4`]);
 }
 const p=await browser.newPage({viewport:{width:1440,height:1000}});for(const id of ['concert-economics','conference-economics','factory-supply-chain']){await p.goto(`${base}/lessons/${id}`);await p.waitForFunction(()=>document.querySelector('#venue')?.dataset.loaded==='true',null,{timeout:90000});if(id.startsWith('factory'))await p.locator('#advance-day').click();await p.locator('#venue').screenshot({path:`${dir}/${id}-world.png`});if(id.startsWith('concert')){await p.evaluate(()=>window.lessonCapture.portrait());await p.locator('#venue').screenshot({path:`${dir}/character-closeup.png`});}}
 console.log('Captured real browser input recordings, all three worlds and character close-up. Mobile is emulation.');
}finally{await browser.close();}
