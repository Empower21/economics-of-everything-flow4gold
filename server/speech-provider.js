export async function synthesize(input,language='en'){
  if(!process.env.ELEVENLABS_API_KEY||!process.env.ELEVENLABS_VOICE_ID)throw new Error('Preferred voice is not configured.');
  const response=await fetch('https://api.elevenlabs.io/v1/text-to-speech/'+encodeURIComponent(process.env.ELEVENLABS_VOICE_ID)+'?output_format=mp3_44100_128',{method:'POST',headers:{'xi-api-key':process.env.ELEVENLABS_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({text:input,model_id:'eleven_multilingual_v2',voice_settings:{stability:.55,similarity_boost:.8,style:.15,use_speaker_boost:true,speed:1.02}}),signal:AbortSignal.timeout(60000)});
  if(!response.ok)throw new Error('Preferred speech service failed: '+response.status);
  return Buffer.from(await response.arrayBuffer());
}
