import test from 'node:test';
import assert from 'node:assert/strict';
import {defaults,calculateScenario,LESSONS} from '../shared/registry.js';
import {changeExplanation,fieldContent,zoneContent,deriveSceneState} from '../shared/teaching.js';
import {approvedParagraphs,modelRequest} from '../shared/lesson.js';
import {parseCommand} from '../shared/commands.js';
test('ambiguous amounts and relative spoken changes ask for clarification',()=>{
 for(const text of ['Increase the venue by one hundred seats','Set venue to 1000 and price to 30','Make venue 1000 or 2000 seats'])assert.equal(parseCommand(text,'concert-economics').clarification,true);
 assert.equal(parseCommand('Make the venue 1,000 seats.','concert-economics').value,1000);
});
test('change context explains the actual transition, including capacity-only and no prior state',()=>{
 const id='concert-economics',before=defaults(id),after={...before,ticketPrice:30};
 const text=changeExplanation(id,after,before);for(const n of ['150','100','3,000','2,250','2,000','750','1,000'])assert.ok(text.includes(n));
 const capacity=changeExplanation(id,{...before,capacity:1000},before);assert.match(capacity,/1,250 CU \(loss\)/);assert.match(capacity,/does not create buyers/);
 const request={topicId:id,scenario:after,previousScenario:before,language:'en',question:'Why did profit change?'};assert.equal(approvedParagraphs(request).change,text);assert.equal(JSON.parse(modelRequest(request).input).paragraphs.change,text);assert.match(changeExplanation(id,before,null),/no earlier/);
});
test('all fields have localized units/help and all focus experiments leave the state unchanged',()=>{
 for(const id of Object.keys(LESSONS)){const s=defaults(id),c=calculateScenario(id,s),before=JSON.stringify(s);for(const lang of ['en','de']){for(const row of LESSONS[id].fields){const m=fieldContent(id,row[0],lang);assert.ok(m.help&&m.unit&&m.group&&m.label);assert.equal(m.min,row[3]);}for(const zone of LESSONS[id].zones){const z=zoneContent(id,zone,s,c,lang);assert.ok(z.status&&z.meaning&&Object.keys(z.values).length);}}assert.equal(JSON.stringify(s),before);}
});
