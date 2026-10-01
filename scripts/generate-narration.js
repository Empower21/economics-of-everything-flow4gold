import {createHash} from 'node:crypto';
import {mkdir,writeFile,readFile,stat} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {mediaPlan} from './media-plan.js';
import {synthesize} from '../server/speech-provider.js';
const directory='.local/narration-guide';
await mkdir(directory,{recursive:true});await mkdir('public/media',{recursive:true});
const probe=path=>Number(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',path],{encoding:'utf8'}).trim());
async function speech(input,language,path){
  const fingerprint=createHash('sha256').update(JSON.stringify({input,language,voice:process.env.ELEVENLABS_VOICE_ID,version:1})).digest('hex');
  try{await stat(path);if(await readFile(path+'.sha256','utf8')===fingerprint)return probe(path);}catch{}
  await writeFile(path,await synthesize(input,language));await writeFile(path+'.sha256',fingerprint);return probe(path);
}
const timing={};
for(const [kind,plan] of Object.entries(mediaPlan)){
  timing[kind]={en:[],de:[]};
  for(let i=0;i<plan.steps.length;i++){
    const durations=await Promise.all(['en','de'].map(async language=>{const path=`${directory}/${kind}-${language}-${i}.mp3`;const duration=await speech(plan.steps[i][language],language,path);return {language,duration};}));
    for(const d of durations)timing[kind][d.language].push(d.duration+.45);console.log(kind,i,durations.map(d=>`${d.language}:${d.duration.toFixed(1)}s`).join(' '));
  }
  for(const language of ['en','de']){
    let start=0;const chapters=[];const vtt=['WEBVTT',''];
    const stamp=s=>new Date(Math.round(s*1000)).toISOString().slice(11,23);
    for(let i=0;i<plan.steps.length;i++){chapters.push({start,title:language==='de'?plan.steps[i].titleDe:plan.steps[i].title});const sentences=plan.steps[i][language].replaceAll('U.S.','US').match(/[^.!?]+[.!?]+|[^.!?]+$/g).map(s=>s.trim()),total=sentences.reduce((n,s)=>n+s.length,0);let offset=0;for(const sentence of sentences){const duration=(timing[kind][language][i]-.15)*sentence.length/total;vtt.push(`${stamp(start+offset)} --> ${stamp(start+offset+duration)}`,sentence,'');offset+=duration;}start+=timing[kind][language][i];}
    await writeFile(`public/media/${kind}-${language}.chapters.json`,JSON.stringify(chapters,null,2));
    await writeFile(`public/media/${kind}-${language}.vtt`,vtt.join('\n'));await writeFile(`public/media/${kind}-${language}.txt`,plan.steps.map(s=>s[language]).join('\n\n'));
  }
  console.log(kind,'planned seconds',Object.fromEntries(Object.entries(timing[kind]).map(([lang,t])=>[lang,t.reduce((a,b)=>a+b,0).toFixed(1)])));
  await writeFile(directory+'/timing.json',JSON.stringify(timing,null,2));
}
