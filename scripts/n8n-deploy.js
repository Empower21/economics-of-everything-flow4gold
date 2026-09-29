import { readFile,writeFile,mkdir } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
const base='https://amdrfound.app.n8n.cloud';
const workflowId='Cbr6Bvxj4vKROEaE';
const headers={'X-N8N-API-KEY':process.env.N8N_API_KEY||process.env.n8n_API_KEY,'Content-Type':'application/json'};
async function api(path,method='GET',body){
  const r=await fetch(base+'/api/v1'+path,{method,headers,body:body?JSON.stringify(body):undefined});
  const j=await r.json();if(!r.ok)throw new Error(`n8n ${method} ${path}: ${r.status} ${j.message||'request failed'}`);return j;
}
if(process.argv.includes('--inspect')){
  for(const type of ['httpHeaderAuth','openAiApi']){const j=await api('/credentials/schema/'+type);console.log(JSON.stringify({type,schema:j}));}
  process.exit();
}
await mkdir('.local',{recursive:true});
let state={};try{state=JSON.parse(await readFile('.local/n8n-state.json','utf8'));}catch{}
const save=()=>writeFile('.local/n8n-state.json',JSON.stringify(state,null,2));
if(!state.secret){state.secret=randomBytes(32).toString('hex');await save();}
if(!state.headerCredential){
  const c=await api('/credentials','POST',{name:'Economics Concert — Gateway',type:'httpHeaderAuth',data:{name:'X-Lesson-Key',value:state.secret}});
  state.headerCredential={id:c.id,name:c.name};await save();
}
if(!state.openAiCredential){
  if(!process.env.OPENAI_API_KEY)throw new Error('OPENAI_API_KEY is required.');
  const c=await api('/credentials','POST',{name:'Economics Concert — OpenAI',type:'openAiApi',data:{apiKey:process.env.OPENAI_API_KEY}});
  state.openAiCredential={id:c.id,name:c.name};await save();
}
const workflow=JSON.parse(await readFile('workflow/economics-concert.json','utf8'));
workflow.nodes.find(n=>n.name==='Lesson request').credentials={httpHeaderAuth:state.headerCredential};
workflow.nodes.find(n=>n.name==='Select lesson explanation').credentials={openAiApi:state.openAiCredential};
if(process.env.OPENAI_MODEL){
  const node=workflow.nodes.find(n=>n.name==='Validate and calculate');
  node.parameters.jsCode=node.parameters.jsCode.replace("model: 'gpt-4o-mini'",'model: '+JSON.stringify(process.env.OPENAI_MODEL));
}
const current=await api('/workflows/'+workflowId);
if(current.active) await api('/workflows/'+workflowId+'/deactivate','POST');
await api('/workflows/'+workflowId,'PUT',{name:workflow.name,nodes:workflow.nodes,connections:workflow.connections,settings:workflow.settings});
const active=await api('/workflows/'+workflowId+'/activate','POST');
state.workflowId=workflowId;state.webhookUrl=base+'/webhook/economics-concert-v1';await save();
let env=await readFile('.env','utf8');
for(const [key,value] of Object.entries({N8N_BASE_URL:base,N8N_WEBHOOK_URL:state.webhookUrl,N8N_WEBHOOK_SECRET:state.secret})){
  const line=`${key}=${value}`;const re=new RegExp('^'+key+'=.*$','m');env=re.test(env)?env.replace(re,line):env.trimEnd()+'\n'+line+'\n';
}
await writeFile('.env',env);
console.log(JSON.stringify({workflowId,active:active.active,url:base+'/workflow/'+workflowId,credentials:'configured securely',env:'local gateway configured'}));
