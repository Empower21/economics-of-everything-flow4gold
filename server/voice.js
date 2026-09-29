import multer from 'multer';
import {rateLimit} from 'express-rate-limit';
import {createHash} from 'node:crypto';
import {validateRequest,approvedParagraphs} from '../shared/lesson.js';
import {synthesize} from './speech-provider.js';

export function mountVoice(app){
  const upload=multer({storage:multer.memoryStorage(),limits:{fileSize:5*1024*1024,files:1,fields:2}});
  const limit=rateLimit({windowMs:60000,limit:6,standardHeaders:'draft-8',legacyHeaders:false,message:{error:'Voice limit reached. Please type or wait a minute. / Bitte tippen oder eine Minute warten.'}});
  const cache=new Map();let daily={day:'',count:0};
  function guard(req,res,next){
    const allowed=process.env.PUBLIC_ORIGIN||`${req.protocol}://${req.get('host')}`;
    if(req.get('origin')&&req.get('origin')!==allowed)return res.status(403).json({error:'Origin not allowed.'});
    if(!process.env.OPENAI_API_KEY)return res.status(503).json({error:'Voice is unavailable. Please type your question.'});
    const day=new Date().toISOString().slice(0,10);if(day!==daily.day)daily={day,count:0};
    if(daily.count>=200)return res.status(429).json({error:'Today’s voice budget is reached. Text remains available.'});daily.count++;next();
  }
  app.post('/api/transcribe',limit,guard,upload.single('audio'),async(req,res)=>{
    try{
      const mime=(req.file?.mimetype||'').split(';')[0];const types={'audio/webm':'webm','video/webm':'webm','audio/mp4':'mp4','video/mp4':'mp4','audio/ogg':'ogg','audio/wav':'wav','audio/x-wav':'wav','audio/mpeg':'mp3'};
      if(!req.file||!types[mime]||req.file.size<500)return res.status(400).json({error:'No usable recording. Please speak clearly or type your question.'});
      const form=new FormData();form.set('model','gpt-4o-mini-transcribe');form.set('file',new Blob([req.file.buffer],{type:mime}),'question.'+types[mime]);form.set('language',req.body.language==='de'?'de':'en');
      const r=await fetch('https://api.openai.com/v1/audio/transcriptions',{method:'POST',headers:{Authorization:`Bearer ${process.env.OPENAI_API_KEY}`},body:form,signal:AbortSignal.timeout(25000)});
      if(!r.ok)throw new Error('transcription failed');const j=await r.json();
      if(typeof j.text!=='string'||!j.text.trim()||j.text.length>600)return res.status(400).json({error:'No short question was recognized. Please try again or type.'});
      res.set('Cache-Control','no-store').json({transcript:j.text.trim()});
    }catch{res.status(502).json({error:'Transcription failed. Your microphone has stopped; you can type instead.'});}
  });
  app.post('/api/speech',limit,guard,async(req,res)=>{
    try{
      const request=validateRequest(req.body.request),paragraphs=approvedParagraphs(request),ids=req.body.paragraphIds;
      if(!Array.isArray(ids)||ids.length<1||ids.length>3||ids.some(id=>typeof id!=='string'||!Object.hasOwn(paragraphs,id)))return res.status(400).json({error:'Invalid spoken lesson.'});
      const input=ids.map(id=>paragraphs[id]).join(' '),key=createHash('sha256').update(request.topicId+request.language+process.env.ELEVENLABS_VOICE_ID+input).digest('hex');
      let bytes=cache.get(key);
      if(!bytes){
        bytes=await synthesize(input,request.language);if(cache.size>=40)cache.delete(cache.keys().next().value);cache.set(key,bytes);
      }
      res.set({'Content-Type':'audio/mpeg','Cache-Control':'no-store'}).send(bytes);
    }catch{res.status(502).json({error:'Spoken audio is unavailable. The text explanation is still ready.'});}
  });
}
