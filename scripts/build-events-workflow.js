import fs from 'node:fs/promises';
import * as planning from '../shared/planning.js';
import * as events from '../shared/events.js';
const declarations=m=>Object.entries(m).map(([k,v])=>typeof v==='function'?v.toString():`const ${k}=${JSON.stringify(v)};`).join('\n');
const shared=declarations(planning)+'\n'+declarations(events);
const prior=JSON.parse(await fs.readFile('docs/evidence/addendum04/workflow-before-Cbr6Bvxj4vKROEaE.json','utf8'));
const clone=(old,name,x,y)=>{const n=structuredClone(prior.nodes.find(n=>n.name===old));n.id=name.replace(/\W/g,'');n.name=name;n.position=[x,y];delete n.credentials;return n;};
const code=(name,x,jsCode)=>({id:name.replace(/\W/g,''),name,type:'n8n-nodes-base.code',typeVersion:2,position:[x,0],parameters:{jsCode}});
const webhook=clone('Lesson request','Event research request',0,0);webhook.webhookId='concert-events-v1';webhook.parameters.path='concert-events-v1';
const validate=code('Validate planning interval',240,shared+`\ntry { const plan=eventEnvelope($json.body);return [{json:{valid:true,plan,modelRequest:eventRequest(plan)}}]; }catch(e){return [{json:{valid:false,response:{schemaVersion:'concert-events-v1',status:'invalid_request',error:e.message,events:[]}}}];}`);
const branch=clone('Valid lesson request?','Valid planning request?',480,0);
const mode=clone('Valid lesson request?','Use illustrative listings?',600,-120);mode.parameters.conditions.conditions[0].leftValue="={{ $json.plan.dataMode === 'simulation' }}";
const simulation=code('Build clearly labeled simulation',960,shared+`\nconst plan=$('Validate planning interval').first().json.plan;return [{json:{response:simulatedEvents(plan)}}];`);simulation.position=[960,-240];
const search=clone('Select lesson explanation','Retrieve dated sources',720,0);search.parameters.options.timeout=50000;
const normalize=code('Verify geography dates and deduplicate',960,shared+`\nconst plan=$('Validate planning interval').first().json.plan;const response=readEvents($json,plan);return [{json:{response}}];`);
const respond=clone('Deliver interactive lesson','Return one research response',1440,0);respond.parameters.responseBody='={{ $json.response }}';
const invalid=clone('Explain how to correct input','Return invalid request',720,240);invalid.parameters.responseBody='={{ $json.response }}';
const audit=code('Record research correlation',1200,`const p=$('Validate planning interval').first().json.plan;console.log(JSON.stringify({requestId:p.requestId,executionId:$execution.id,status:$json.response.status}));return $input.all();`);
const nodes=[webhook,validate,branch,mode,simulation,search,normalize,audit,respond,invalid];const connections={};const link=(a,b,i=0)=>{connections[a]??={main:[]};connections[a].main[i]=[{node:b,type:'main',index:0}];};link(webhook.name,validate.name);link(validate.name,branch.name);link(branch.name,mode.name);link(mode.name,simulation.name);link(mode.name,search.name,1);link(simulation.name,audit.name);link(branch.name,invalid.name,1);link(search.name,normalize.name);link(normalize.name,audit.name);link(audit.name,respond.name);
const workflow={name:'The concert — City and date research',nodes,connections,settings:{executionOrder:'v1',executionTimeout:75,saveDataErrorExecution:'all',saveDataSuccessExecution:'all',saveManualExecutions:false}};
await fs.writeFile('workflow/concert-events.json',JSON.stringify(workflow,null,2));
if(process.argv.includes('--deploy')){
 const base=process.env.N8N_BASE_URL,headers={'X-N8N-API-KEY':process.env.N8N_API_KEY||process.env.n8n_API_KEY,'Content-Type':'application/json'};
 const api=async(path,method='GET',body)=>{const r=await fetch(base+'/api/v1'+path,{method,headers,body:body?JSON.stringify(body):undefined});if(!r.ok)throw Error('n8n '+r.status+' '+await r.text());return r.json();};
 webhook.credentials=prior.nodes.find(n=>n.name==='Lesson request').credentials;search.credentials=prior.nodes.find(n=>n.name==='Select lesson explanation').credentials;
 let state={};try{state=JSON.parse(await fs.readFile('.local/events-state.json','utf8'));}catch{}
 const saved=state.id?await api('/workflows/'+state.id,'PUT',workflow):await api('/workflows','POST',workflow);state.id=saved.id;await fs.writeFile('.local/events-state.json',JSON.stringify(state));
 await api('/workflows/'+state.id+'/activate','POST');const published=await api('/workflows/'+state.id);
 await fs.writeFile('docs/evidence/addendum04/events-published.json',JSON.stringify({id:published.id,active:published.active,versionId:published.versionId,activeVersionId:published.activeVersionId,nodes:published.nodes,connections:published.connections,settings:published.settings},null,2));
 let env=await fs.readFile('.env','utf8');const line='N8N_EVENTS_WEBHOOK_URL='+base+'/webhook/concert-events-v1';env=/^N8N_EVENTS_WEBHOOK_URL=.*$/m.test(env)?env.replace(/^N8N_EVENTS_WEBHOOK_URL=.*$/m,line):env.trimEnd()+'\n'+line+'\n';await fs.writeFile('.env',env);console.log(JSON.stringify({id:published.id,active:published.active,versionId:published.versionId,activeVersionId:published.activeVersionId}));
}
