export function voiceController({language,onTranscript,onStatus,onRecording}){
  let recorder,stream,chunks=[],timer,cancelled=false,recording=false,context,levelTimer,maxLevel=0,revision=0,controller,audio,speechTurn=0;
  const status=(en,de)=>onStatus(language()==='de'?de:en);
  function stopAudio(){speechTurn++;if(audio){audio.pause();if(audio.src.startsWith('blob:'))URL.revokeObjectURL(audio.src);audio=null;}}
  function release(){clearTimeout(timer);clearInterval(levelTimer);stream?.getTracks().forEach(t=>t.stop());stream=null;context?.close().catch(()=>{});context=null;recording=false;onRecording(false);}
  function cancel(){revision++;cancelled=true;controller?.abort();if(recorder?.state==='recording')recorder.stop();release();stopAudio();}
  async function start(){
    cancel();cancelled=false;const id=revision;stopAudio();document.querySelectorAll('video,audio').forEach(a=>a.pause());
    if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){status('Microphone recording is unavailable here. Please type.','Mikrofonaufnahme ist hier nicht verfügbar. Bitte tippen.');return;}
    try{
      onRecording(true);status('Waiting for microphone permission…','Warte auf Mikrofonfreigabe…');
      const acquired=await navigator.mediaDevices.getUserMedia({audio:true});if(id!==revision){acquired.getTracks().forEach(t=>t.stop());return;}stream=acquired;
      const mime=['audio/webm;codecs=opus','audio/mp4','audio/webm','audio/ogg;codecs=opus'].find(type=>MediaRecorder.isTypeSupported(type));
      recorder=new MediaRecorder(stream,mime?{mimeType:mime}:undefined);chunks=[];maxLevel=0;
      try{context=new AudioContext();const analyser=context.createAnalyser();context.createMediaStreamSource(stream).connect(analyser);const values=new Uint8Array(analyser.fftSize);levelTimer=setInterval(()=>{analyser.getByteTimeDomainData(values);maxLevel=Math.max(maxLevel,Math.sqrt(values.reduce((sum,v)=>sum+(v-128)**2,0)/values.length));},100);}catch{maxLevel=10;}
      recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};
      recorder.onstop=async()=>{
        if(cancelled||id!==revision)return;const heard=maxLevel>1.2;release();
        if(!heard){status('No speech detected. Try again or type.','Keine Sprache erkannt. Bitte erneut versuchen oder tippen.');return;}
        const blob=new Blob(chunks,{type:recorder.mimeType}),form=new FormData();form.set('audio',blob,'question.'+(blob.type.includes('mp4')?'mp4':'webm'));form.set('language',language());controller=new AbortController();
        status('Transcribing your question…','Deine Frage wird transkribiert…');
        try{const r=await fetch('/api/transcribe',{method:'POST',body:form,signal:controller.signal});const j=await r.json();if(id!==revision)return;if(!r.ok)throw new Error(j.error);onTranscript(j.transcript);status('Transcript ready. Review the text, then send.','Text bereit. Bitte prüfen und dann senden.');}catch(e){if(id===revision)onStatus(language()==='de'?'Transkription fehlgeschlagen. Du kannst die Frage tippen.':e.message||'Transcription failed.');}
      };
      recorder.start();recording=true;onRecording(true);status('Recording · maximum 30 seconds. Stop when finished.','Aufnahme · höchstens 30 Sekunden. Danach stoppen.');timer=setTimeout(()=>stop(),30000);
    }catch(e){if(id!==revision)return;release();status(e.name==='NotAllowedError'?'Microphone permission denied. You can type below.':'No microphone available. You can type below.',e.name==='NotAllowedError'?'Mikrofonzugriff abgelehnt. Du kannst unten tippen.':'Kein Mikrofon verfügbar. Du kannst unten tippen.');}
  }
  function stop(){if(recorder?.state==='recording')recorder.stop();}
  async function speak(request,paragraphIds){
    stopAudio();const id=revision,speechId=speechTurn;controller?.abort();controller=new AbortController();status('Preparing AI-generated voice…','KI-Stimme wird vorbereitet…');
    try{const r=await fetch('/api/speech',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({request,paragraphIds}),signal:controller.signal});if(!r.ok){const j=await r.json();throw new Error(j.error);}const blob=await r.blob();if(id!==revision||speechId!==speechTurn)return;const playing=new Audio(URL.createObjectURL(blob));audio=playing;await playing.play();if(id!==revision||speechId!==speechTurn)return;status('Playing AI-generated speech.','KI-generierte Sprache wird abgespielt.');playing.onended=()=>status('Audio finished. Replay is available.','Audio beendet. Erneutes Abspielen ist möglich.');}catch(e){if(id===revision&&speechId===speechTurn)status('Audio could not play. Use Replay, or read the answer.','Audio konnte nicht abgespielt werden. Erneut abspielen oder die Antwort lesen.');}
  }
  return {start,stop,cancel,stopAudio,speak,get recording(){return recording;}};
}
