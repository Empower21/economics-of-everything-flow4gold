import {mkdir,writeFile,readFile,stat} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {mediaPlan} from './media-plan.js';
import {synthesize} from '../server/speech-provider.js';
const directory='.local/narration-eleven';
await mkdir(directory,{recursive:true});await mkdir('public/media',{recursive:true});
const probe=path=>Number(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',path],{encoding:'utf8'}).trim());
async function speech(input,language,path){
  try{await stat(path);return probe(path);}catch{}
  await writeFile(path,await synthesize(input,language));return probe(path);
}
await speech('Welcome to the Economics of Everything. Let us explore a small world together. Change one assumption, follow what happens, and discover an idea you can use.','en','public/media/voice-audition-elevenlabs.mp3');
console.log('Preferred voice ready: public/media/voice-audition-elevenlabs.mp3');
const timing={};
for(const [kind,plan] of Object.entries(mediaPlan)){
  timing[kind]=[];
  for(let i=0;i<plan.steps.length;i++){
    const durations=await Promise.all(['en','de'].map(async language=>{const path=`${directory}/${kind}-${language}-${i}.mp3`;const duration=await speech(plan.steps[i][language],language,path);return {language,duration};}));
    timing[kind].push(Math.max(...durations.map(d=>d.duration))/(kind==='factory'?1.08:1)+.8);console.log(kind,i,durations.map(d=>`${d.language}:${d.duration.toFixed(1)}s`).join(' '));
  }
  for(const language of ['en','de']){
    let start=0;const vtt=['WEBVTT',''];
    const stamp=s=>new Date(Math.round(s*1000)).toISOString().slice(11,23);
    for(let i=0;i<plan.steps.length;i++){const sentences=plan.steps[i][language].match(/[^.!?]+[.!?]+|[^.!?]+$/g).map(s=>s.trim()),total=sentences.reduce((n,s)=>n+s.length,0);let offset=0;for(const sentence of sentences){const duration=(timing[kind][i]-.15)*sentence.length/total;vtt.push(`${stamp(start+offset)} --> ${stamp(start+offset+duration)}`,sentence,'');offset+=duration;}start+=timing[kind][i];}
    await writeFile(`public/media/${kind}-${language}.vtt`,vtt.join('\n'));await writeFile(`public/media/${kind}-${language}.txt`,plan.steps.map(s=>s[language]).join('\n\n'));
  }
  console.log(kind,'planned duration',timing[kind].reduce((a,b)=>a+b,0).toFixed(1));
  await writeFile(directory+'/timing.json',JSON.stringify(timing,null,2));
}
