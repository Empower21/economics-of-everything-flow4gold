import {rateLimit} from 'express-rate-limit';
import {eventEnvelope} from '../shared/planning.js';
import {researchResult,validateResearch} from '../shared/events.js';
export const researchCache=new Map();
export function mountEvents(app){
 let budget={day:'',count:0};const inflight=new Map(),ttl=Number(process.env.EVENT_CACHE_TTL_MS)||3600000;
 app.post('/api/events',rateLimit({windowMs:60000,limit:12,message:{error:'Please wait a minute before another date check.'},standardHeaders:'draft-8',legacyHeaders:false}),async(req,res)=>{
  res.set('Cache-Control','no-store');const origin=req.get('origin'),allowed=process.env.PUBLIC_ORIGIN||`${req.protocol}://${req.get('host')}`;if(origin&&origin!==allowed)return res.status(403).json({error:'Origin not allowed.'});
  let p;try{p=eventEnvelope(req.body);}catch(e){return res.status(400).json({status:'invalid_request',error:e.message});}
  const cached=researchCache.get(p.queryKey);if(!req.body.refresh&&cached&&Date.now()-cached.time<ttl)return res.json({...cached.result,requestId:p.requestId,planningRevision:p.planningRevision,cached:true});
  const unavailable=()=>res.json(researchResult(p));if(!process.env.N8N_EVENTS_WEBHOOK_URL||!process.env.N8N_WEBHOOK_SECRET)return unavailable();
  const day=new Date().toISOString().slice(0,10);if(day!==budget.day)budget={day,count:0};if(p.dataMode==='live'&&budget.count>=60)return unavailable();
  if(!inflight.has(p.queryKey)){if(p.dataMode==='live')budget.count++;inflight.set(p.queryKey,(async()=>{const upstream=await fetch(process.env.N8N_EVENTS_WEBHOOK_URL,{method:'POST',headers:{'Content-Type':'application/json','X-Lesson-Key':process.env.N8N_WEBHOOK_SECRET},body:JSON.stringify(p),signal:AbortSignal.timeout(65000)});if(!upstream.ok)throw new Error('Workflow unavailable');return validateResearch(await upstream.json(),p);})());}
  try{const raw=await inflight.get(p.queryKey),r={...raw,requestId:p.requestId,planningRevision:p.planningRevision};if(['ok','partial','no_matches'].includes(r.status)){if(researchCache.size>=100)researchCache.delete(researchCache.keys().next().value);researchCache.set(p.queryKey,{time:Date.now(),result:r});}console.log(JSON.stringify({event:'event-research',requestId:p.requestId,status:r.status,cached:false}));res.json(r);}catch{unavailable();}finally{inflight.delete(p.queryKey);}
 });
}
