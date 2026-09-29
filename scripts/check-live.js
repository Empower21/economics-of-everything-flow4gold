import {validateLesson} from '../shared/lesson.js';
const url=process.env.N8N_WEBHOOK_URL;
const payload=(language='en',ticketPrice=20)=>({requestId:crypto.randomUUID(),sessionId:'synthetic-live-test',topicId:'concert',language,question:language==='de'?'Warum ist Umsatz nicht dasselbe wie Gewinn?':'Why is revenue different from profit?',scenario:{ticketPrice}});
for(const lang of ['en','de']){
  const input=payload(lang,lang==='de'?30:20);const start=Date.now();
  const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json','X-Lesson-Key':process.env.N8N_WEBHOOK_SECRET},body:JSON.stringify(input),signal:AbortSignal.timeout(25000)});
  const j=await r.json();console.log(JSON.stringify({language:lang,status:r.status,elapsedMs:Date.now()-start,delivery:j.delivery,explanation:j.explanation,error:j.error}));
  if(!r.ok)process.exitCode=1;else validateLesson(j,input);
}
const bad=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json','X-Lesson-Key':process.env.N8N_WEBHOOK_SECRET},body:JSON.stringify(payload('xx'))});
console.log('Invalid input status:',bad.status);if(bad.status!==400)process.exitCode=1;
const unauthorized=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload())});
console.log('Unauthenticated status:',unauthorized.status);if(![401,403].includes(unauthorized.status))process.exitCode=1;
