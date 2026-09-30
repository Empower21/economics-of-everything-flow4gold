import assert from 'node:assert/strict';
import {defaults} from '../shared/registry.js';
import {validateLesson} from '../shared/lesson.js';
const base=process.env.TEST_BASE_URL||'https://web-production-af12a.up.railway.app';
for(const language of ['en','de']){
 const topicId='concert-economics',previousScenario=defaults(topicId),request={requestId:crypto.randomUUID(),sessionId:'addendum02-context-test',topicId,language,scenarioRevision:15,previousScenario,scenario:{...previousScenario,ticketPrice:30},question:language==='de'?'Warum hat sich der Gewinn nach meiner letzten Änderung verändert?':'Why did profit change after my last setting change?'};
 const r=await fetch(base+'/api/lesson',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(request)});assert.equal(r.status,200);const answer=validateLesson(await r.json(),request);assert.equal(answer.fallbackUsed,false);assert.ok(answer.paragraphIds.includes('change'));assert.match(answer.explanation,/750/);assert.ok(answer.explanation.includes(language==='de'?'1.000':'1,000'));console.log('PASS live n8n previous/current answer',language,answer.delivery);
}
