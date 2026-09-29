import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene } from '@babylonjs/core/scene';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight';
import { ImportMeshAsync } from '@babylonjs/core/Loading/sceneLoader';
import { HighlightLayer } from '@babylonjs/core/Layers/highlightLayer';
import '@babylonjs/core/Layers/effectLayerSceneComponent';
import '@babylonjs/core/Culling/ray';
import '@babylonjs/loaders/glTF/2.0';
import '@babylonjs/loaders/glTF/glTFFileLoader';

export async function createVenue(canvas, onPick, onReady) {
  const engine = new Engine(canvas,true,{ preserveDrawingBuffer:true, stencil:true, antialias:true });
  engine.setHardwareScalingLevel(Math.max(1,window.devicePixelRatio/1.5));
  const scene = new Scene(engine);
  scene.clearColor=new Color4(.925,.938,.883,1);
  const camera=new ArcRotateCamera('camera',Math.PI/2.7,Math.PI/3.05,16,new Vector3(0,1,0),scene);
  camera.attachControl(canvas,true);
  camera.lowerRadiusLimit=12; camera.upperRadiusLimit=24;
  camera.lowerBetaLimit=.3; camera.upperBetaLimit=1.3;
  camera.panningSensibility=0; camera.wheelPrecision=35;
  const ambient=new HemisphericLight('sky',new Vector3(0,1,0),scene); ambient.intensity=.85; ambient.groundColor=new Color3(.3,.38,.27);
  const sun=new DirectionalLight('sun',new Vector3(-.5,-1,.5),scene); sun.intensity=1.1;
  const highlight=new HighlightLayer('focus',scene);
  let meshes;
  try { ({meshes}=await ImportMeshAsync('/models/concert.glb',scene)); }
  catch (err) { engine.dispose(); throw err; }
  const audience=[...scene.transformNodes,...meshes].filter(m=>/^Audience_\d{2}$/.test(m.name)).sort((a,b)=>a.name.localeCompare(b.name));
  let paused=false;
  const render=()=>{ if(!document.hidden && !paused) scene.render(); };
  engine.runRenderLoop(render);
  scene.onPointerObservable.add(info=>{
    if(info.type!==1 || !info.pickInfo?.hit) return;
    const name=info.pickInfo.pickedMesh.name;
    if(name.startsWith('Stage')||name.startsWith('DJ')) onPick('cost');
    else if(name.startsWith('Entrance')) onPick('revenue');
    else if(name.startsWith('Audience')) onPick('audience');
  });
  const resize=()=>{engine.resize();scene.render();};
  window.addEventListener('resize',resize);
  const observer=new ResizeObserver(resize); observer.observe(canvas);
  onReady();
  return {
    setAttendance(n) { audience.forEach((m,i)=>m.setEnabled(i<Math.ceil(n/5))); scene.render(); },
    focus(concept) {
      highlight.removeAllMeshes();
      const prefix={cost:'Stage',revenue:'Entrance',audience:'Audience'}[concept];
      if(prefix) meshes.filter(m=>m.name.startsWith(prefix)&&m.getTotalVertices()>0).forEach(m=>highlight.addMesh(m,new Color3(.9,.65,.2)));
      scene.render();
    },
    pause(value) {paused=value;scene.render();},
    reset() {camera.alpha=Math.PI/2.7;camera.beta=Math.PI/3.05;camera.radius=16;highlight.removeAllMeshes();scene.render();},
    dispose() { observer.disconnect();window.removeEventListener('resize',resize);engine.dispose(); }
  };
}
