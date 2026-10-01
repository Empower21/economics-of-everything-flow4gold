import fs from 'node:fs/promises';import vm from 'node:vm';import assert from 'node:assert/strict';
import {defaults} from '../shared/registry.js';import {validateLesson,applyModel} from '../shared/lesson.js';
import {PLAN_DEFAULTS} from '../shared/planning.js';
const w=JSON.parse(await fs.readFile('workflow/economics-concert.json','utf8'));
const run=(name,json,prior={})=>JSON.parse(JSON.stringify(vm.runInNewContext(`(function(){${w.nodes.find(n=>n.name===name).parameters.jsCode}})()`,{$json:json,$:n=>({first:()=>({json:prior[n]})}),Intl,console,$execution:{id:'fixture'},$input:{all:()=>[{json}]}},{timeout:3000})));
const req={requestId:'fixture-coach-05',sessionId:'fixture-session',topicId:'concert',question:'Explain ticket revenue',language:'en',scenario:defaults('concert'),scenarioRevision:7};
const initial=run('Validate and calculate',{body:req})[0].json;assert(initial.valid);
for(const answer of [{answers:{intent:{choice:'ticket_price',confidence:.96}},model:'fixture'},{answers:{intent:{choice:'ticket_price',confidence:.4}}},{error:'fixture provider unavailable'}]){
const decision=run('Read intent confidence',answer,{'Validate and calculate':initial})[0].json;
const prior={'Read intent confidence':decision};
if(decision.decision.explain){for(const response of [{status:'completed',output:[{content:[{type:'output_text',text:JSON.stringify({paragraphs:['revenue'],focus:'tickets'})}]}]},{error:'provider failed'}]){const out=run('Check explanation or use prepared lesson',response,prior)[0].json;validateLesson(out,req);assert.deepEqual({...out,intentDecision:undefined},{...applyModel(initial.request,response),intentDecision:undefined});}}
else{const out=run('Ask focused clarification',{},prior)[0].json;validateLesson(out,req);assert.equal(out.delivery,answer.error?'typesafe-unavailable':'intent-clarification');}}
assert.equal(run('Validate and calculate',{body:{}})[0].json.valid,false);
for(const cityId of ['atlanta-us','berlin-de','kingston-jm']){const p=run('Validate planning interval',{body:{...PLAN_DEFAULTS,cityId,localStartDate:'2026-10-10',schemaVersion:'concert-events-v1',requestId:'fixture-events-05',planningRevision:4,language:'en'}})[0].json;assert(p.valid);const prior={'Validate planning interval':p};assert.equal(run('Build clearly labeled simulation',{},prior)[0].json.response.events.length,3);assert.equal(run('Verify geography dates and deduplicate',{error:'fixture'},prior)[0].json.response.status,'unavailable');assert.equal(run('Verify geography dates and deduplicate',{status:'completed',output:[{type:'web_search_call',status:'completed',action:{sources:[]}},{content:[{type:'output_text',text:'{"events":[]}'}]}]},prior)[0].json.response.status,'no_matches');}
await fs.writeFile('docs/evidence/addendum05/draft-fixtures.json',JSON.stringify({passed:true,kind:'local serialized Code-node fixtures, not live provider executions',checks:['valid and invalid coach','TypeSafe confidence and provider error','model parity','three simulation cities','research failure','zero events']},null,2));console.log('Consolidated draft fixtures passed.');

