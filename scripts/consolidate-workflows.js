import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {transform} from 'esbuild';
const dir='docs/evidence/addendum05',canonical='Cbr6Bvxj4vKROEaE',retired='Hdc8JHwuai8BlbI6';
const read=id=>fs.readFile(`${dir}/before-${id}.json`,'utf8').then(JSON.parse);
const source=process.argv.includes('--from-source');
const coach=source?JSON.parse(await fs.readFile('.local/coach-branch.json','utf8')):await read(canonical),events=source?JSON.parse(await fs.readFile('.local/events-branch.json','utf8')):await read(retired);
const body=w=>({name:w.name,nodes:w.nodes,connections:w.connections,settings:Object.fromEntries(Object.entries(w.settings).filter(([k])=>!['binaryMode','availableInMCP'].includes(k)))});
const draft=body(coach);draft.name='The Economics of Everything — Concert System';
draft.settings.executionTimeout=75;
// Temporarily retain synthetic acceptance executions; finalize restores no-payload retention.
draft.settings.saveDataSuccessExecution='all';draft.settings.saveDataErrorExecution='all';
draft.nodes.push(...structuredClone(events.nodes).map(n=>({...n,position:[n.position[0],n.position[1]+1000]})));
Object.assign(draft.connections,events.connections);
// Reuse the prepared lesson and approved paragraph map already computed at entry.
const node=name=>draft.nodes.find(n=>n.name===name);
node('Check explanation or use prepared lesson').parameters.jsCode=`const source=$('Read intent confidence').first().json;let lesson={...source.prepared,delivery:'model-fallback'};try{const response=$json;if(response.status==='completed'){const a=JSON.parse(response.output.flatMap(o=>o.content||[]).filter(c=>c.type==='output_text').map(c=>c.text).join(''));const p=JSON.parse(source.modelRequest.input).paragraphs;const zones=source.modelRequest.text.format.schema.properties.focus.enum;if(Array.isArray(a.paragraphs)&&a.paragraphs.length>=1&&a.paragraphs.length<=3&&new Set(a.paragraphs).size===a.paragraphs.length&&a.paragraphs.every(id=>typeof id==='string'&&Object.hasOwn(p,id))&&zones.includes(a.focus))lesson={...lesson,explanation:a.paragraphs.map(id=>p[id]).join(' '),paragraphIds:a.paragraphs,sceneActions:[{type:'highlight',target:a.focus}],fallbackUsed:false,delivery:'n8n-openai'};}}catch{}return [{json:{...lesson,intentDecision:source.decision}}];`;
node('Ask focused clarification').parameters.jsCode=`const source=$('Read intent confidence').first().json,decision=source.decision;const lesson={...source.prepared,delivery:decision.unavailable?'typesafe-unavailable':'intent-clarification',intentDecision:decision};if(!decision.unavailable){lesson.paragraphIds=['clarification'];lesson.explanation=JSON.parse(source.modelRequest.input).paragraphs.clarification;lesson.sceneActions=[];}return [{json:lesson}];`;
// Strip unused declarations from existing serialized helper bundles. Required small
// date helpers remain branch-local because n8n Code nodes have isolated runtimes.
for(const n of draft.nodes.filter(n=>n.type==='n8n-nodes-base.code')){
 const result=await transform(`function execute(){${n.parameters.jsCode}\n}\nexecute();`,{treeShaking:true,minifySyntax:true,format:'esm',target:'es2022'});
 n.parameters.jsCode=result.code.replace(/execute\(\);\s*$/,'return execute();');
}
draft.nodes.find(n=>n.name==='Start here').parameters.content='# Concert coach\nNative TypeSafe AI Evaluate interprets the learner question. Confidence gating selects explanation or clarification; provider errors return prepared bilingual lessons. Financial arithmetic is deterministic.\n\nCanonical ID: Cbr6Bvxj4vKROEaE. Two authenticated webhooks, independent executions. Neither branch calls the other. Production payload retention is disabled after migration acceptance. See docs/ADDENDUM-05-VALIDATION.md.';
draft.nodes.push({id:'research-area-note',name:'City and Date Research',type:'n8n-nodes-base.stickyNote',typeVersion:1,position:[0,500],parameters:{width:1500,height:220,content:'# City & Date Research\nExisting concert-events-v1 entry. Explicit simulation returns labeled fictional listings; live mode retrieves dated sources and validates geography. One response, including empty/error results. Railway owns the one-hour cache and correlation checks. No slider, animation, or page-load searches.\n\nThe former Hdc8JHwuai8BlbI6 workflow is an inactive rollback copy only.'}});
assert.equal(new Set(draft.nodes.map(n=>n.id)).size,draft.nodes.length);assert.equal(new Set(draft.nodes.map(n=>n.name)).size,draft.nodes.length);
const names=new Set(draft.nodes.map(n=>n.name));for(const [name,c] of Object.entries(draft.connections)){assert(names.has(name));for(const outputs of Object.values(c))for(const list of outputs)for(const edge of list||[])assert(names.has(edge.node));}
for(const n of draft.nodes){for(const m of JSON.stringify(n.parameters).matchAll(/\$\('([^']+)'\)/g))assert(names.has(m[1]),m[1]);}
const reachable=start=>{const seen=new Set();const visit=n=>{if(seen.has(n))return;seen.add(n);for(const a of Object.values(draft.connections[n]||{}))for(const b of a)for(const e of b||[])visit(e.node);};visit(start);return seen;};
const a=reachable('Lesson request'),b=reachable('Event research request');assert(![...a].some(n=>b.has(n)));assert(a.has('Identify concert question'));assert(b.has('Retrieve dated sources'));
const clean=structuredClone(draft);clean.settings.saveDataSuccessExecution='none';clean.settings.saveDataErrorExecution='none';for(const n of clean.nodes)delete n.credentials;
await fs.writeFile('workflow/economics-concert.json',JSON.stringify(clean,null,2)+'\n');
await fs.writeFile(`${dir}/draft-check.json`,JSON.stringify({nodes:draft.nodes.length,coachNodes:[...a],researchNodes:[...b],disjoint:true,duplicateNames:false,duplicateIds:false,paths:draft.nodes.filter(n=>n.type.endsWith('.webhook')).map(n=>n.parameters.path)},null,2));
const base=process.env.N8N_BASE_URL,headers={'X-N8N-API-KEY':process.env.N8N_API_KEY||process.env.n8n_API_KEY,'Content-Type':'application/json'};
const api=async(p,method='GET',data)=>{const r=await fetch(base+'/api/v1'+p,{method,headers,body:data?JSON.stringify(data):undefined});if(!r.ok)throw Error(`${method} ${p}: ${r.status}`);return r.json();};
async function rollback(){await api(`/workflows/${canonical}/deactivate`,'POST');await api(`/workflows/${canonical}`,'PUT',body(coach));await api(`/workflows/${canonical}/activate`,'POST');await api(`/workflows/${retired}`,'PUT',body(events));await api(`/workflows/${retired}/activate`,'POST');}
if(process.argv.includes('--rollback')){await rollback();console.log('Original registrations restored.');}
if(process.argv.includes('--cutover')){
 for(const id of [canonical,retired]){const w=await api('/workflows/'+id);assert.equal(w.versionId,(id===canonical?coach:events).versionId,'Remote changed since backup');const running=await api('/executions?workflowId='+id+'&status=running');assert.equal(running.data.length,0,'In-flight execution');}
 try{await api(`/workflows/${retired}/deactivate`,'POST');await api(`/workflows/${canonical}`,'PUT',draft);await api(`/workflows/${canonical}/activate`,'POST');}catch(e){await rollback();throw e;}
 console.log('Consolidated workflow published; acceptance required before finalizing.');
}
if(process.argv.includes('--finalize')){
 const w=await api('/workflows/'+canonical);const final=body(w);final.settings.saveDataSuccessExecution='none';final.settings.saveDataErrorExecution='none';await api('/workflows/'+canonical,'PUT',final);await api('/workflows/'+canonical+'/activate','POST');
 const backup=body(events);backup.name='ARCHIVED — Replaced by Concert System — 2026-09-30';backup.nodes.push({id:'retired-note',name:'Inactive rollback backup',type:'n8n-nodes-base.stickyNote',typeVersion:1,position:[0,-450],parameters:{width:1000,height:200,content:'# Inactive rollback backup\nReplaced by https://amdrfound.app.n8n.cloud/workflow/Cbr6Bvxj4vKROEaE. Do not activate: its webhook path now belongs to that canonical workflow. Rollback procedure: docs/ADDENDUM-05-VALIDATION.md.'}});await api('/workflows/'+retired,'PUT',backup);
 for(const id of [canonical,retired]){const x=await api('/workflows/'+id);delete x.pinData;delete x.staticData;await fs.writeFile(`${dir}/after-${id}.json`,JSON.stringify(x,null,2));console.log(JSON.stringify({id,active:x.active,name:x.name,versionId:x.versionId,activeVersionId:x.activeVersionId}));}
}
