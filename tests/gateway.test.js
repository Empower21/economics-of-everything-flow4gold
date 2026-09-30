import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import http from 'node:http';
import {setTimeout as delay} from 'node:timers/promises';
import {preparedLesson} from '../shared/lesson.js';

test('gateway validates input, origin, upstream numbers and service failures',async t=>{
  let upstreamMode='ok';
  const upstream=http.createServer(async(req,res)=>{
    let body='';for await(const chunk of req)body+=chunk;
    assert.equal(req.headers['x-lesson-key'],'synthetic-test-secret');
    if(upstreamMode==='error'){res.writeHead(503);res.end('{}');return;}
    const lesson=preparedLesson(JSON.parse(body));
    if(upstreamMode==='drift')lesson.calculationResults.profit=99999;
    res.setHeader('Content-Type','application/json');res.end(JSON.stringify(lesson));
  });
  await new Promise(resolve=>upstream.listen(0,'127.0.0.1',resolve));
  const port=3102;
  const child=spawn(process.execPath,['server/index.js','--production'],{env:{...process.env,PORT:String(port),N8N_WEBHOOK_URL:`http://127.0.0.1:${upstream.address().port}`,N8N_WEBHOOK_SECRET:'synthetic-test-secret',PUBLIC_ORIGIN:'http://localhost:3102',TRUST_PROXY_HOPS:'0'},stdio:'ignore',windowsHide:true});
  t.after(()=>{child.kill();upstream.close();});
  let ready=false;
  for(let i=0;i<150;i++){try{await fetch(`http://localhost:${port}/api/health`);ready=true;break;}catch{await delay(100);}}
  assert.equal(ready,true,'gateway starts');
  const data={requestId:'test-request-123',sessionId:'test-session-123',topicId:'concert',language:'en',question:'Why is revenue not profit?',scenario:{ticketPrice:30}};
  const post=(body=data,origin='http://localhost:3102')=>fetch(`http://localhost:${port}/api/lesson`,{method:'POST',headers:{'Content-Type':'application/json',Origin:origin},body:JSON.stringify(body)});
  let r=await post();assert.equal(r.status,200);assert.equal((await r.json()).calculationResults.profit,1000);
  upstreamMode='error';r=await post();assert.equal((await r.json()).delivery,'service-fallback');
  upstreamMode='drift';r=await post();const fallback=await r.json();assert.equal(fallback.delivery,'service-fallback');assert.equal(fallback.calculationResults.profit,1000);
  assert.equal((await post({...data,scenario:{ticketPrice:-10}})).status,400);
  assert.equal((await post(data,'https://unrelated.example')).status,403);
  assert.equal((await post({...data,question:'x'.repeat(10000)})).status,413);
  for(let i=0;i<8;i++)await post();
  assert.equal((await post()).status,429);
});
