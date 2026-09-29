import {spawnSync} from 'node:child_process';
const cli=process.argv[2];
if(!cli)throw new Error('Pass the absolute Railway CLI executable path.');
const values={N8N_WEBHOOK_URL:process.env.N8N_WEBHOOK_URL,N8N_WEBHOOK_SECRET:process.env.N8N_WEBHOOK_SECRET,OPENAI_API_KEY:process.env.OPENAI_API_KEY,ELEVENLABS_API_KEY:process.env.ELEVENLABS_API_KEY,ELEVENLABS_VOICE_ID:process.env.ELEVENLABS_VOICE_ID,PUBLIC_ORIGIN:'https://web-production-af12a.up.railway.app',PORT:'3000',NODE_ENV:'production',TRUST_PROXY_HOPS:'1'};
for(const [key,value] of Object.entries(values)){
  if(!value)throw new Error(`Missing ${key}`);
  const result=spawnSync(cli,['variable','set',key,'--stdin','--skip-deploys','--service','web'],{input:value,encoding:'utf8',windowsHide:true});
  if(result.status!==0)throw new Error(`Railway failed to set ${key}; output withheld to avoid exposing secrets.`);
  console.log(`${key}: configured`);
}
