import { readFile, mkdir, writeFile } from 'node:fs/promises';
const base='https://amdrfound.app.n8n.cloud';
const headers={'X-N8N-API-KEY':process.env.N8N_API_KEY||process.env.n8n_API_KEY};
await mkdir('.local',{recursive:true});
for(const [name,path] of [['workflow','/api/v1/workflows/Cbr6Bvxj4vKROEaE'],['settings','/rest/settings']]){
  const r=await fetch(base+path,{headers});const j=await r.json();
  if(name==='workflow'){
    await writeFile('.local/existing-workflow.json',JSON.stringify(j,null,2));
    console.log(JSON.stringify({kind:name,status:r.status,id:j.id,name:j.name,active:j.active,nodes:j.nodes?.map(n=>({name:n.name,type:n.type,typeVersion:n.typeVersion})),settings:j.settings}));
  }else console.log(JSON.stringify({kind:name,status:r.status,version:j.data?.versionCli}));
}
const repo=process.env.GITHUB_REPOSITORY || '';
console.log(JSON.stringify({configuredRepository:repo.startsWith('https://github.com/')?repo.replace(/\.git$/,''): /^[\w.-]+\/[\w.-]+$/.test(repo)?repo:'configured but not a plain repository path'}));
