import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:3184';
const browser=await chromium.launch({headless:true,args:['--autoplay-policy=no-user-gesture-required']});
try{
 const p=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});await p.route('**/models/*.glb',r=>r.abort());
 for(const id of ['concert-economics'])for(const lang of ['en','de']){
  await p.goto(`${base}/lessons/${id}?lang=${lang}`);const before=await p.evaluate(()=>window.lessonCapture.state());await p.locator('#watch').click();await p.waitForFunction(()=>document.querySelector('video').readyState>=2);
  const metadata=await p.locator('video').evaluate(v=>({width:v.videoWidth,height:v.videoHeight,duration:v.duration,cues:v.textTracks[0].cues.length}));assert.equal(metadata.width,960);assert.equal(metadata.height,960);assert.ok(metadata.duration>=45&&metadata.duration<=75);assert.ok(metadata.cues>=10);
  await p.locator('video').evaluate(v=>{v.muted=true;v.playbackRate=4;return v.play();});await p.waitForFunction(()=>document.querySelector('video').ended,null,{timeout:90000});assert.deepEqual(await p.evaluate(()=>window.lessonCapture.state()),before);assert.ok((await p.locator('#video-transcript').textContent()).length>400);await p.locator('#close-video').click();console.log('PASS full playback at 4×',id,lang,metadata);
 }
}catch(e){for(const p of browser.contexts().flatMap(c=>c.pages()))console.log(await p.locator('video').evaluate(v=>({time:v.currentTime,duration:v.duration,paused:v.paused,ended:v.ended,ready:v.readyState,network:v.networkState,error:v.error?.message})));throw e;}finally{await browser.close();}
