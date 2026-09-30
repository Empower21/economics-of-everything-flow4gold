import {storyCards} from './story-cards.js';
import {chromium} from 'playwright';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {mediaPlan} from './media-plan.js';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:3184';
const dir='.local/recordings';await mkdir(dir,{recursive:true});
const timing=JSON.parse(await readFile('.local/narration-eleven/timing.json','utf8'));
const ids={concert:'concert-economics'};
const probe=path=>Number(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',path],{encoding:'utf8'}).trim());
const ff=args=>execFileSync('ffmpeg',['-y','-hide_banner','-loglevel','error',...args],{stdio:'pipe'});
const browser=await chromium.launch({headless:true,args:['--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required']});
try{
for(const [kind,plan] of Object.entries(mediaPlan))for(const lang of ['en','de']){
  const context=await browser.newContext({viewport:{width:960,height:960},recordVideo:{dir,size:{width:960,height:960}}});
  const page=await context.newPage();await page.goto(`${base}/lessons/${ids[kind]}?lang=${lang}`,{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.querySelector('#venue')?.dataset.loaded==='true',null,{timeout:60000});
  await page.evaluate(()=>{document.body.classList.add('capture-mode');const card=document.createElement('div');card.className='story-card';document.body.append(card);scrollTo(0,0);});await page.waitForTimeout(1000);
  await page.evaluate(cards=>window.storyCards=cards,storyCards);
  const start=Date.now();
  for(let i=0;i<plan.steps.length;i++){
    await page.evaluate(({values,zone,kind,lang,i})=>{window.lessonCapture.set(values);window.lessonCapture.focus(zone);const cards=window.storyCards[kind][lang];document.querySelector('.story-card').innerHTML=`<small>${lang==='de'?'FESTES LERNBEISPIEL · GE':'FIXED TEACHING EXAMPLE · CU'}</small><h2>${cards[i][0]}</h2><p>${cards[i][1]}</p>`;},{...plan.steps[i],kind,lang,i});
    if(i===0){await page.waitForTimeout(1200);await page.screenshot({path:`public/media/${kind}-${lang}-poster.jpg`,type:'jpeg',quality:90});}
    const deadline=start+timing[kind].slice(0,i+1).reduce((a,b)=>a+b,0)*1000;
    await page.waitForTimeout(Math.max(0,deadline-Date.now()));
  }
  const video=page.video();await context.close();const path=await video.path();
  const duration=timing[kind].reduce((a,b)=>a+b,0),offset=Math.max(0,probe(path)-duration);
  const clips=[];
  for(let i=0;i<plan.steps.length;i++){
    const output=`${kind}-${lang}-${i}.wav`;clips.push(`file '${output}'`);
    ff(['-i',`.local/narration-eleven/${kind}-${lang}-${i}.mp3`,'-af',`atempo=${1},apad,atrim=duration=${timing[kind][i]}`,'-ar','48000','-ac','2',`${dir}/${output}`]);
  }
  const list=`${dir}/${kind}-${lang}.txt`;await writeFile(list,clips.join('\n'));
  ff(['-f','concat','-safe','0','-i',list,'-c:a','pcm_s16le',`${dir}/${kind}-${lang}.wav`]);
  ff(['-ss',offset.toFixed(3),'-i',path,'-i',`${dir}/${kind}-${lang}.wav`,'-t',duration.toFixed(3),'-c:v','libx264','-preset','fast','-crf','23','-pix_fmt','yuv420p','-c:a','aac','-b:a','128k','-movflags','+faststart',`public/media/${kind}-${lang}.mp4`]);
  console.log(`${kind}-${lang}: ${probe(`public/media/${kind}-${lang}.mp4`).toFixed(1)} seconds, preferred ElevenLabs voice`);
}
}finally{await browser.close();}
