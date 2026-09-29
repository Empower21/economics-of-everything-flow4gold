const id=process.env.ELEVENLABS_VOICE_ID,key=process.env.ELEVENLABS_API_KEY;
if(!id||!key)throw new Error('ElevenLabs voice configuration is missing.');
const r=await fetch('https://api.elevenlabs.io/v1/voices/'+encodeURIComponent(id),{headers:{'xi-api-key':key}});
const j=await r.json();console.log(JSON.stringify({status:r.status,name:j.name,labels:j.labels,category:j.category,available:!!j.voice_id,error:j.detail?.status}));
