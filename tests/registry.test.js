import test from 'node:test';import assert from 'node:assert/strict';
import {calculateScenario,defaults,validateScenario} from '../shared/registry.js';
import {parseCommand} from '../shared/commands.js';
test('concert v2 all addendum references and independent demand',()=>{
  for(const [capacity,demand,ticketPrice,attendance,totalCost,profit] of [[200,150,20,150,2250,750],[200,150,30,100,2000,1000],[1000,150,20,150,4250,-1250],[1000,900,20,900,8000,10000],[5000,4500,20,4500,36000,54000],[20000,18000,20,18000,141000,219000]]){const c=calculateScenario('concert',{capacity,demand,ticketPrice});assert.equal(c.attendance,attendance);assert.equal(c.totalCost,totalCost);assert.equal(c.profit,profit);}
  assert.equal(calculateScenario('concert',{demand:0}).attendance,0);assert.equal(calculateScenario('concert',{productionBudget:0,venueRate:0,perGuest:0}).returnOnCost,null);
  assert.equal(calculateScenario('concert',{productionBudget:1000.25,perGuest:5.01}).totalCost,2251.75);
});
test('scenario validation and conference access',()=>{
  for(const capacity of [NaN,Infinity,49,100001,200.2,'1000'])assert.throws(()=>validateScenario('concert',{capacity}));
  const a=calculateScenario('conference',{}),b=calculateScenario('conference',{workshopSeats:300});assert.equal(a.profit,5000);assert.equal(a.totalCost,25000);assert.equal(a.workshopAccess,40);assert.equal(b.totalCost,26000);assert.equal(b.profit,4000);assert.equal(b.workshopAccess,60);assert.equal(calculateScenario('conference',{expectedAttendees:0}).workshopAccess,null);
});
test('factory event order, premium timing and no double expensing',()=>{
  const c=calculateScenario('factory',{elapsedDays:4});assert.deepEqual(c.history.map(d=>[d.produced,d.closingInventory]),[[100,50],[50,0],[0,0],[100,100]]);assert.equal(c.cumulativeOutput,250);assert.equal(c.delayedUnits,150);assert.equal(c.purchaseCash,2000);assert.equal(c.componentConsumedCost,2500);
  const alt=calculateScenario('factory',{elapsedDays:4,alternativeQuantity:200,alternativeDay:2});assert.equal(alt.cumulativeOutput,400);assert.equal(alt.supplierPremiums,1000);
  const unsold=calculateScenario('factory',{elapsedDays:1,sellImmediately:false,dailySales:0});assert.equal(unsold.finishedInventory,100);assert.equal(unsold.sales,0);assert.equal(unsold.costOfGoodsSold,0);assert.equal(unsold.profit,-1005);
});
test('spoken setting requests are bounded by same scenario validator',()=>{
  assert.deepEqual(parseCommand('make the venue one thousand seats','concert-economics'),{field:'capacity',value:1000});assert.equal(parseCommand('Why did profit fall?','concert-economics'),null);assert.equal(parseCommand('make the venue bigger','concert-economics').clarification,true);
  assert.equal(parseCommand('Why does changing the price to 30 increase profit?','concert-economics'),null);assert.equal(parseCommand('set capacity to -1000','concert-economics').value,-1000);assert.equal(parseCommand('increase price by 5','concert-economics').clarification,true);
});
