import test from 'node:test';import assert from 'node:assert/strict';
import {calculateScenario,defaults,validateScenario} from '../shared/registry.js';
import {parseCommand} from '../shared/commands.js';
test('concert v2 all addendum references and independent demand',()=>{
  for(const [capacity,demand,ticketPrice,attendance,totalCost,profit] of [[200,150,20,150,2250,750],[200,150,30,100,2000,1000],[1000,150,20,150,4250,-1250],[1000,900,20,900,8000,10000],[5000,4500,20,4500,36000,54000]]){const c=calculateScenario('concert',{capacity,demand,ticketPrice});assert.equal(c.attendance,attendance);assert.equal(c.totalCost,totalCost);assert.equal(c.profit,profit);}
  assert.equal(calculateScenario('concert',{demand:0}).attendance,0);assert.equal(calculateScenario('concert',{productionBudget:0,venueRate:0,perGuest:0}).returnOnCost,null);
  assert.equal(calculateScenario('concert',{productionBudget:1000.25,perGuest:5.01}).totalCost,2251.75);
});
test('scenario validation',()=>{
  for(const capacity of [NaN,Infinity,0,10001,200.2,'1000'])assert.throws(()=>validateScenario('concert',{capacity}));
});
test('spoken setting requests are bounded by same scenario validator',()=>{
  assert.deepEqual(parseCommand('make the venue one thousand seats','concert-economics'),{field:'capacity',value:1000});assert.equal(parseCommand('Why did profit fall?','concert-economics'),null);assert.equal(parseCommand('make the venue bigger','concert-economics').clarification,true);
  assert.equal(parseCommand('Why does changing the price to 30 increase profit?','concert-economics'),null);assert.equal(parseCommand('set capacity to -1000','concert-economics').value,-1000);assert.equal(parseCommand('increase price by 5','concert-economics').clarification,true);
});
