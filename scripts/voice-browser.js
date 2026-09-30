import {chromium} from 'playwright';
import {writeFile,mkdir,readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
import {synthesize} from '../server/speech-provider.js';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:3182';await mkdir('.local',{recursive:true});
try{await readFile('.local/voice-question.mp3');}catch{await writeFile('.local/voice-question.mp3',await synthesize('Make the venue one thousand seats.','en'));}
execFileSync('ffmpeg',['-y','-loglevel','error','-i','.local/voice-question.mp3','-af','adelay=700:all=1,apad=pad_dur=2','-ar','48000','-ac','1','.local/voice-question.wav']);
const browser=await chromium.launch({headless:true,args:['--enable-unsafe-swiftshader','--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream',`--use-file-for-fake-audio-capture=${resolve('.local/voice-question.wav')}`,'--autoplay-policy=no-user-gesture-required']});
async function newVoicePage(){const p=await browser.newPage();await p.route('**/models/*.glb',r=>r.abort());return p;}
try{
const page=await newVoicePage();await page.addInitScript(()=>{const acquire=navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);window.testStreams=[];navigator.mediaDevices.getUserMedia=async options=>{const stream=await acquire(options);window.testStreams.push(stream);return stream;};});
page.on('response',async r=>{if(r.url().endsWith('/api/transcribe'))console.log('Synthetic transcription',r.status(),await r.text());});await page.goto(base);await page.locator('#mic').click();await page.waitForFunction(()=>document.querySelector('#voice-status').textContent.includes('maximum 30'));
await page.waitForTimeout(6200);await page.locator('#record-stop').click();
await page.waitForFunction(()=>document.querySelector('#question').value.toLowerCase().includes('thousand')||document.querySelector('#question').value.replace(/[, ]/g,'').includes('1000'),null,{timeout:40000});assert.equal(await page.locator('#field-capacity').inputValue(),'200');await page.locator('#spoken-reply').check();await page.locator('#ask').click();
await page.waitForFunction(()=>document.querySelector('#field-capacity').value==='1000',null,{timeout:40000});
assert.equal(await page.locator('[data-metric=profit]').textContent(),'-$1,250');
await page.waitForFunction(()=>document.querySelector('#voice-status').textContent.includes('Playing AI-generated'),null,{timeout:60000});
assert.equal(await page.evaluate(()=>window.testStreams.every(s=>s.getTracks().every(t=>t.readyState==='ended'))),true);
await page.locator('#mute').click();await page.locator('#mic').click();await page.waitForTimeout(800);await page.locator('#record-cancel').click();
assert.equal(await page.evaluate(()=>window.testStreams.every(s=>s.getTracks().every(t=>t.readyState==='ended'))),true);
await page.screenshot({path:'docs/evidence/addendum03/voice-tested.png'});
console.log('PASS: recorded synthetic microphone audio → real transcription → validated setting 1000 → live n8n → ElevenLabs playback; mute and cancel release tracks.');
const denied=await newVoicePage();await denied.addInitScript(()=>{navigator.mediaDevices.getUserMedia=async()=>{throw new DOMException('Denied','NotAllowedError');};});await denied.goto(base);await denied.locator('#mic').click();await denied.waitForFunction(()=>document.querySelector('#voice-status').textContent.includes('permission denied'));assert.equal(await denied.locator('#question').isEnabled(),true);console.log('PASS: denied microphone retains text input.');
const stale=await newVoicePage();await stale.addInitScript(()=>{const NativeAudio=window.Audio;window.audioPlayCount=0;window.Audio=class extends NativeAudio{play(){window.audioPlayCount++;return super.play();}};});
let unblockSpeech;let speechGate=new Promise(resolve=>unblockSpeech=resolve);
await stale.route('**/api/speech',async route=>{await speechGate;await route.fulfill({contentType:'audio/mpeg',body:await readFile('public/media/voice-audition-elevenlabs.mp3')});});
await stale.goto(base+'?review=1');await stale.locator('#voice-sample').click();await stale.locator('#mute').click();unblockSpeech();await stale.waitForTimeout(1600);assert.equal(await stale.evaluate(()=>window.audioPlayCount),0);
speechGate=new Promise(resolve=>unblockSpeech=resolve);await stale.locator('#voice-sample').click();await stale.locator('#field-ticketPrice').fill('30');await stale.locator('#field-ticketPrice').dispatchEvent('change');unblockSpeech();await stale.waitForTimeout(1600);assert.equal(await stale.evaluate(()=>window.audioPlayCount),0);console.log('PASS: mute and changed scenario suppress pending audio.');
await page.evaluate(()=>{const Native=window.AudioContext;window.AudioContext=class extends Native{createAnalyser(){const a=super.createAnalyser();a.getByteTimeDomainData=values=>values.fill(150);return a;}};});
await page.route('**/api/transcribe',route=>route.fulfill({status:502,json:{error:'Transcription failed. Type instead.'}}));await page.locator('#mic').click();await page.waitForTimeout(6200);await page.locator('#record-stop').click();await page.waitForFunction(()=>document.querySelector('#voice-status').textContent.includes('Transcription failed'));assert.equal(await page.locator('#question').isEnabled(),true);assert.equal(await page.evaluate(()=>window.testStreams.every(s=>s.getTracks().every(t=>t.readyState==='ended'))),true);console.log('PASS: transcription failure releases microphone and retains text.');
const silent=await newVoicePage();await silent.addInitScript(()=>{const Native=window.AudioContext;window.AudioContext=class extends Native{createAnalyser(){const a=super.createAnalyser();a.getByteTimeDomainData=values=>values.fill(128);return a;}};});let transcriptionCalls=0;silent.on('request',r=>{if(r.url().endsWith('/api/transcribe'))transcriptionCalls++;});await silent.goto(base);await silent.locator('#mic').click();await silent.waitForTimeout(1000);await silent.locator('#record-stop').click();await silent.waitForFunction(()=>document.querySelector('#voice-status').textContent.includes('No speech detected'));assert.equal(transcriptionCalls,0);console.log('PASS: silent recording does not send a transcription request.');
}catch(e){console.log('Voice test failed:',e.message);for(const p of browser.contexts().flatMap(c=>c.pages()))console.log(await p.evaluate(()=>({question:document.querySelector('#question')?.value,status:document.querySelector('#voice-status')?.textContent})));throw e;}finally{await browser.close();}
