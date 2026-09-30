import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {LESSONS,defaults} from '../shared/registry.js';
import {validateRequest} from '../shared/lesson.js';

test('only the concert is supported by the shared and serialized n8n validators',()=>{
  assert.deepEqual(Object.keys(LESSONS),['concert-economics']);
  const workflow=JSON.parse(readFileSync('workflow/economics-concert.json','utf8'));
  const code=workflow.nodes.find(n=>n.name==='Validate and calculate').parameters.jsCode;
  const run=new Function('$json',code);
  const input={topicId:'concert-economics',requestId:'concert-only-test',sessionId:'concert-only-test',language:'en',question:'Why did profit change?',scenario:{...defaults('concert'),ticketPrice:30},previousScenario:defaults('concert')};
  const output=run({body:input})[0].json;
  assert.equal(output.valid,true);assert.equal(output.prepared.calculationResults.profit,1000);
  for(const topicId of ['conference','conference-economics','factory','factory-supply-chain']){
    assert.throws(()=>validateRequest({...input,topicId}));
    assert.equal(run({body:{...input,topicId}})[0].json.valid,false);
  }
  assert.doesNotMatch(JSON.stringify(workflow),/conference|factory|workshopSeats|supplierDelay|three interactive/i);
});
