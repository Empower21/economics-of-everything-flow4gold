import assert from 'node:assert/strict';
const base=process.env.TEST_BASE_URL||'https://web-production-af12a.up.railway.app';
for(const name of ['conference','factory']){
  const id=name==='conference'?'conference-economics':'factory-supply-chain';
  for(const path of ['/lessons/'+id,'/lessons/'+name,'/?lesson='+id,'/methodology?lesson='+id,'/models/'+name+'.glb',...['en','de'].flatMap(lang=>['.mp4','.vtt','.txt','-poster.jpg'].map(ext=>'/media/'+name+'-'+lang+ext))]){
    const r=await fetch(base+path);assert.equal(r.status,404,path);
  }
  const input={requestId:crypto.randomUUID(),sessionId:'retired-lesson-test',topicId:id,language:'en',question:'Explain this',scenario:{}};
  const r=await fetch(base+'/api/lesson',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input)});assert.equal(r.status,400);
}
const manifest=await(await fetch(base+'/asset-manifest.json')).json();assert.deepEqual(Object.keys(manifest.models),['concert']);assert.equal(manifest.media.paths.length,2);
console.log('PASS retired pages, query links and assets return 404; API rejects retired topics; manifest is concert-only');
