import assert from 'node:assert/strict';
import {validateLesson,validateRequest} from '../shared/lesson.js';
const base=process.env.TEST_BASE_URL||'https://web-production-af12a.up.railway.app';
for(const [topicId,scenario,expected] of [['concert-economics',{capacity:1000,demand:150},-1250],['concert-economics',{capacity:5000,demand:4500},54000],['concert-economics',{capacity:20000,demand:18000},219000],['concert-economics',{capacity:1234,demand:700},6415]]){
  const input=validateRequest({requestId:crypto.randomUUID(),sessionId:'revision-verification',topicId,language:'en',question:'Explain the current result',scenario,scenarioRevision:9});
  const response=await fetch(base+'/api/lesson',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input)});
  assert.equal(response.status,200);const answer=validateLesson(await response.json(),input);
  assert.equal(answer.calculationResults.profit,expected);
  assert.equal(answer.fallbackUsed,false);assert.equal(answer.scenarioRevision,9);
  console.log(topicId,scenario,answer.delivery,'profit:',answer.calculationResults.profit);
}
