import {storyCards} from './story-cards.js';
import {chromium} from 'playwright';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {mediaPlan} from './media-plan.js';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:3196';
const dir='.local/recordings-guide';await mkdir(dir,{recursive:true});
const timings=JSON.parse(await readFile('.local/narration-guide/timing.json','utf8'));
const probe=path=>Number(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',path],{encoding:'utf8'}).trim());
const ff=args=>execFileSync('ffmpeg',['-y','-hide_banner','-loglevel','error',...args],{stdio:'pipe'});
const browser=await chromium.launch({headless:true,args:['--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required']});
const views={scene:'.world-panel',mixer:'.dashboard',costs:'.result-card',audience:'.dashboard',planner:'.event-planner',comparison:'#comparison',coach:'.tutor-section',model:'.assumptions'};
const css=`.guide-lever,.guide-lever *{visibility:visible!important}.guide-lever{position:fixed!important;left:120px!important;top:658px!important;width:720px!important;height:154px!important;background:#202840!important;border:2px solid #ffc77f!important;padding:10px 18px!important;z-index:35!important}.guide-lever .field-help,.guide-lever .field-error,.guide-lever .worked-example{display:none!important}.guide-lever{display:grid!important;grid-template-columns:1fr 160px!important;grid-template-rows:56px 64px!important;gap:4px!important;align-items:center!important}.guide-lever input[type=range]{min-height:48px!important;height:48px!important;margin:0!important}.guide-lever label{font-size:20px!important}.guide-lever input[type=range]{width:100%!important}.guide-lever .field-value{max-width:160px}.guide-lever input[type=number]{font-size:21px!important}.guide-lever~*{visibility:hidden!important}body{overflow:hidden!important}body *{visibility:hidden!important}.guide-focus,.guide-focus *,.guide-title,.guide-title *,.guide-caption,.guide-caption *{visibility:visible!important}.guide-focus{position:fixed!important;left:60px!important;top:142px!important;width:840px!important;height:660px!important;max-height:660px!important;margin:0!important;box-sizing:border-box!important;overflow:auto!important;background:#101426!important;z-index:20!important;padding:22px!important;scrollbar-width:none}.guide-focus::-webkit-scrollbar{display:none}.guide-focus.world-panel{padding:0!important}.guide-focus .canvas-wrap{height:645px!important;min-height:645px!important}.guide-focus .world-top,.guide-focus .world-bottom,.guide-focus .scene-badge{display:none!important}.guide-title,.guide-caption{position:fixed;left:40px;right:40px;z-index:40;background:#101426;border-left:4px solid #8cf6d2;padding:12px 20px}.guide-title{top:16px}.guide-title small{color:#bca4f5;font-size:15px;letter-spacing:2px}.guide-title h2{font-family:'Pixelify Sans';font-size:32px;margin:6px 0;color:#eaf1fa}.guide-caption{bottom:28px;color:#8cf6d2;font-size:23px;line-height:1.35}.guide-focus .deck-display{height:190px!important}.guide-focus .deck-display canvas{height:165px!important}.guide-focus .field-help{font-size:15px}.guide-focus .field{padding:8px 0}.guide-focus .metric{padding:7px 0}.guide-focus .metric strong{font-size:21px}.guide-focus .cost-line{font-size:18px}.guide-focus .question-chips{margin:8px 0;gap:5px}.guide-focus.tutor-section{display:block!important}.guide-focus.tutor-section>div>p{margin:4px 0}.guide-focus.tutor-section h2{margin:5px 0;font-size:29px}.guide-focus .tutor-card{padding:14px}.guide-focus .question-chips button{padding:5px 10px;min-height:32px}.guide-focus #explanation{margin:6px 0;font-size:14px}.guide-focus .audio-tools{margin:5px 0}.guide-focus .tutor-card>small{display:none}.guide-focus .event-planner{margin:0}.guide-focus .event-planner h3{margin:0}.guide-focus .compare-scroll{max-height:none}.guide-focus #assumptions p{font-size:17px;line-height:1.6}.guide-focus summary{font-size:25px!important}.guide-focus.guide-audience{padding-top:20px!important}.guide-audience>h2,.guide-audience>p:first-of-type,.guide-audience>.deck-display,.guide-audience>.deck-channels{display:none!important}.guide-audience>.event-planner{display:none!important}.guide-focus input:focus,.guide-focus select:focus{outline:3px solid #ffc77f!important}`;
const preview=process.env.STORY_PREVIEW==='1';
const first=Number(process.env.STORY_FROM||0),requestedLast=process.env.STORY_TO===undefined?Infinity:Number(process.env.STORY_TO);
try{
for(const [kind,plan] of Object.entries(mediaPlan))for(const lang of (process.env.STORY_LANGUAGE?[process.env.STORY_LANGUAGE]:['en','de'])){
 const timing=timings[kind][lang],last=Math.min(requestedLast,plan.steps.length-1),partial=first>0||last<plan.steps.length-1;
 const context=await browser.newContext({viewport:{width:960,height:960},...(preview?{}:{recordVideo:{dir,size:{width:960,height:960}}})});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`${base}/lessons/concert-economics?lang=${lang}`,{waitUntil:'networkidle'});
 await page.waitForFunction(()=>document.querySelector('#venue')?.dataset.loaded==='true',null,{timeout:60000});
 await page.addStyleTag({content:css});
 await page.evaluate(()=>{for(const name of ['guide-title','guide-caption']){const el=document.createElement('div');el.className=name;document.body.append(el);}});
 let start;const evidence=[];
 for(let i=0;i<=last;i++){
  if(i===first)start=Date.now();
  const step=plan.steps[i];
  if(step.view==='comparison'){
   await page.evaluate(()=>document.querySelector('#save-scenario').click());
   await page.evaluate(()=>window.lessonCapture.set({ticketPrice:30}));
  }else if(Object.keys(step.values).length&&![2,3].includes(i))await page.evaluate(values=>window.lessonCapture.set(values),step.values);
  if(i===3)await page.evaluate(()=>window.lessonCapture.set({ticketPrice:20}));
  if(step.view==='planner'){
   await page.evaluate(()=>{for(const [id,value] of [['event-city','atlanta-us'],['plan-localStartDate','2026-11-14']]){const el=document.getElementById(id);el.value=value;el.dispatchEvent(new Event('change',{bubbles:true}));}});
   await page.evaluate(()=>document.querySelector('#check-events').click());
   await page.waitForFunction(()=>document.querySelectorAll('#event-results article').length>0,null,{timeout:70000});
  }
  if(step.view==='coach')await page.evaluate(lang=>{document.querySelector('#question').value=lang==='en'?'Explain ticket revenue':'Erkläre den Ticketumsatz (ticket revenue)';},lang);
  await page.evaluate(({selector,view,title,caption,i,total,lang})=>{
   document.querySelectorAll('.guide-lever').forEach(e=>e.classList.remove('guide-lever'));
   document.querySelectorAll('.guide-focus').forEach(e=>{e.classList.remove('guide-focus','guide-audience');e.scrollTop=0;});
   const target=document.querySelector(selector);target.hidden=false;if(target.tagName==='DETAILS')target.open=true;
   target.classList.add('guide-focus');if(view==='audience')target.classList.add('guide-audience');
   target.scrollTop=0;
   if(i===2||i===3){document.querySelector(`[data-field=${i===2?'ticketPrice':'capacity'}]`).classList.add('guide-lever');target.style.setProperty('height','510px','important');target.querySelector('.canvas-wrap').style.setProperty('height','510px','important');target.querySelector('.canvas-wrap').style.setProperty('min-height','510px','important');}else{document.querySelector('.world-panel').style.removeProperty('height');document.querySelector('.canvas-wrap').style.removeProperty('height');document.querySelector('.canvas-wrap').style.removeProperty('min-height');}
   document.querySelector('.guide-title').innerHTML='';const small=document.createElement('small'),h=document.createElement('h2');small.textContent=`THE ECONOMICS OF EVERYTHING / ${String(i+1).padStart(2,'0')} ${lang==='de'?'VON':'OF'} ${total}`;h.textContent=title;document.querySelector('.guide-title').append(small,h);
   document.querySelector('.guide-caption').textContent=caption;
   window.dispatchEvent(new Event('resize'));
  },{selector:views[step.view],view:step.view,title:storyCards[kind][lang][i][0],caption:step.card[lang],i,total:plan.steps.length,lang});
  await page.waitForTimeout(preview?500:800);
  if(i===2||i===3){
   const key=i===2?'ticketPrice':'capacity',from=i===2?20:200,to=i===2?30:1000;
   for(let n=1;n<=20;n++){await page.evaluate(({key,value})=>{const el=document.querySelector(`[data-range=${key}]`);el.value=value;el.dispatchEvent(new Event('input',{bubbles:true}));},{key,value:Math.round(from+(to-from)*n/20)});if(!preview)await page.waitForTimeout(60);}
  }
  let coachResponse;
  if(step.view==='coach'){coachResponse=page.waitForResponse(r=>r.url().endsWith('/api/lesson'));await page.evaluate(()=>document.querySelector('#ask-form').requestSubmit());}

  if(i===0&&!partial)await page.screenshot({path:`public/media/${kind}-${lang}-poster.jpg`,type:'jpeg',quality:90});
  await page.screenshot({path:`${dir}/${lang}-${i}.png`});
  evidence.push({chapter:i,view:step.view,state:await page.evaluate(()=>window.lessonCapture.state())});
  if(!preview&&i>=first){
   const deadline=start+timing.slice(first,i+1).reduce((a,b)=>a+b,0)*1000;
   if(['costs','planner','model'].includes(step.view)){
    await page.waitForTimeout(Math.max(0,(deadline-Date.now())*.55));
    await page.evaluate(()=>{const el=document.querySelector('.guide-focus');el.scrollTo({top:el.classList.contains('event-planner')?el.scrollHeight-el.clientHeight:Math.min(el.scrollHeight-el.clientHeight,400),behavior:'smooth'});});
   }
   await page.waitForTimeout(Math.max(0,deadline-Date.now()));
  }
  if(coachResponse){const response=await(await coachResponse).json();evidence.at(-1).coach={delivery:response.delivery,fallbackUsed:response.fallbackUsed};if(!preview&&response.fallbackUsed)throw Error('Coach demo needs a checked live answer; retry this chapter.');}
  console.log(`${lang} chapter ${i+1}/${plan.steps.length}: ${step.view}`);
 }
 if(errors.length)throw Error(errors.join('\n'));
 await writeFile(`${dir}/${lang}${partial?'-chapter-'+first:''}-evidence.json`,JSON.stringify(evidence,null,2));
 if(preview){await context.close();continue;}
 const video=page.video();await context.close();const path=await video.path();
 const duration=timing.slice(first,last+1).reduce((a,b)=>a+b,0),offset=Math.max(0,probe(path)-duration);
 const clips=[];
 for(let i=first;i<=last;i++){
  const output=`${kind}-${lang}-${i}.wav`;clips.push(`file '${output}'`);
  ff(['-i',`.local/narration-guide/${kind}-${lang}-${i}.mp3`,'-af',`apad,atrim=duration=${timing[i]}`,'-ar','48000','-ac','2',`${dir}/${output}`]);
 }
 const suffix=partial?'-chapter-'+first:'';
 const list=`${dir}/${kind}-${lang}${suffix}.txt`;await writeFile(list,clips.join('\n'));
 ff(['-f','concat','-safe','0','-i',list,'-c:a','pcm_s16le',`${dir}/${kind}-${lang}${suffix}.wav`]);
 const outputPath=partial?`${dir}/${kind}-${lang}-chapter-${first}.mp4`:`public/media/${kind}-${lang}.mp4`;
 ff(['-ss',offset.toFixed(3),'-i',path,'-i',`${dir}/${kind}-${lang}${suffix}.wav`,'-t',duration.toFixed(3),'-c:v','libx264','-preset','fast','-crf','23','-pix_fmt','yuv420p','-af','loudnorm=I=-16:TP=-1.5:LRA=11','-c:a','aac','-b:a','128k','-movflags','+faststart',outputPath]);
 console.log(`${kind}-${lang}: ${probe(outputPath).toFixed(1)} seconds, preferred ElevenLabs voice`);
}
}finally{await browser.close();}
