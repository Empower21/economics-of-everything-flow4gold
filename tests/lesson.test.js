import test from 'node:test';
import assert from 'node:assert/strict';
import {calculate,validateRequest,preparedLesson,applyModel,validateLesson} from '../shared/lesson.js';
const request=(p=20,language='en')=>({requestId:'request-test-123',sessionId:'session-test-123',topicId:'concert',language,question:'Why is revenue different from profit?',scenario:{ticketPrice:p}});
test('brief reference cases and boundaries',()=>{
  assert.deepEqual(calculate(20),{ticketPrice:20,capacity:200,attendance:150,revenue:3000,fixedCost:1500,variableCost:750,totalCost:2250,profit:750,returnOnCost:33.3});
  assert.equal(calculate(30).profit,1000);assert.equal(calculate(30).returnOnCost,50);
  assert.equal(calculate(5).attendance,200);assert.equal(calculate(50).profit,-1500);assert.equal(calculate(20.21).attendance,148);
});
test('all supported prices satisfy accounting identity and bounded attendance',()=>{
  for(let cents=500;cents<=5000;cents++){const c=calculate(cents/100);assert.ok(c.attendance>=0&&c.attendance<=200);assert.ok(Number.isInteger(c.attendance));assert.equal(Math.round((c.revenue-c.totalCost)*100)/100,c.profit);}
});
test('invalid prices and malformed requests are rejected',()=>{
  for(const p of [null,undefined,NaN,Infinity,'20',4,51])assert.throws(()=>calculate(p));
  for(const change of [{topicId:'factory'},{language:'xx'},{question:' '},{question:'a'.repeat(601)},{sessionId:'bad<script>'}])assert.throws(()=>validateRequest({...request(),...change}));
});
test('both prepared languages contain correct scenario and safe actions',()=>{
  for(const lang of ['en','de']){const q=request(30,lang);const l=validateLesson(preparedLesson(q),q);assert.equal(l.calculationResults.profit,1000);assert.equal(l.language,lang);assert.equal(l.fallbackUsed,true);}
});
const response=value=>({status:'completed',output:[{content:[{type:'output_text',text:JSON.stringify(value)}]}]});
test('AI selects approved content and calculator supplies numbers',()=>{
  const l=applyModel(request(),response({paragraphs:['revenue','overview'],focus:'profit'}));
  assert.equal(l.fallbackUsed,false);assert.match(l.explanation,/750/);
});
test('model errors, refusals, raw numbers and arbitrary actions fall back',()=>{
  for(const r of [{error:'timeout'},{status:'incomplete'},response({explanation:'Your profit is 999999 currency units.',focus:'profit'}),response({explanation:'Profit is {{invented}}.',focus:'profit'}),response({explanation:'Profit is {{profit}}.',focus:'executeJavaScript'}),response({explanation:'<script>alert()</script>',focus:'profit'})])assert.equal(applyModel(request(),r).fallbackUsed,true);
});
test('unknown paragraphs, duplicates, excessive output and prototype keys fall back',()=>{
  for(const paragraphs of [['invented'],['overview','overview'],['revenue','overview','costs','limits'],['constructor'],['__proto__'],[]])assert.equal(applyModel(request(),response({paragraphs,focus:'profit'})).fallbackUsed,true);
});
test('upstream drift and unsafe scene instructions are rejected',()=>{
  const l=preparedLesson(request());l.calculationResults.profit=100000;assert.throws(()=>validateLesson(l,request()));
  const m=preparedLesson(request());m.sceneActions=[{type:'eval',value:0}];assert.throws(()=>validateLesson(m,request()));
});
