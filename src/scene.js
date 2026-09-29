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

export async function createVenue(canvas, onPick, onReady, kind='concert') {
  const engine = new Engine(canvas,true,{ preserveDrawingBuffer:true, stencil:true, antialias:true });
  engine.setHardwareScalingLevel(Math.max(1,window.devicePixelRatio/1.5));
  const scene = new Scene(engine);
  scene.clearColor=kind==='concert'?new Color4(.97,.90,.79,1):kind==='conference'?new Color4(.86,.92,.98,1):new Color4(.87,.94,.91,1);
  const camera=new ArcRotateCamera('camera',Math.PI/2.7,Math.PI/3.05,16,new Vector3(0,1,0),scene);
  camera.attachControl(canvas,true);
  const homeRadius=()=>canvas.clientWidth/canvas.clientHeight<1.2?21:kind==='concert'?16:18;
  camera.radius=homeRadius();camera.lowerRadiusLimit=9; camera.upperRadiusLimit=35;
  camera.lowerBetaLimit=.3; camera.upperBetaLimit=1.3;
  camera.panningSensibility=0; camera.wheelPrecision=35;
  const ambient=new HemisphericLight('sky',new Vector3(0,1,0),scene); ambient.intensity=.85; ambient.groundColor=new Color3(.3,.38,.27);
  const sun=new DirectionalLight('sun',new Vector3(-.5,-1,.5),scene); sun.intensity=1.1;
  const highlight=new HighlightLayer('focus',scene);
  let meshes;
  try { ({meshes}=await ImportMeshAsync('/models/'+kind+'.glb',scene)); }
  catch (err) { engine.dispose(); throw err; }
  const roots=[...scene.transformNodes,...meshes];
  const people=roots.filter(m=>/^(Audience|WorkshopPerson|Walker|Queue|Worker)_\d{2}$/.test(m.name));
  const cars=roots.filter(m=>/^Car_\d{2}$/.test(m.name));
  const audience=people.filter(m=>m.name.startsWith('Audience_')).sort((a,b)=>a.name.localeCompare(b.name));
  const positions=new Map([...people,...cars,...roots.filter(m=>m.name==='SupplierTruck')].map(m=>[m,m.position.clone()]));
  const prefixMap={entrance:['Entrance'],stage:['Stage','DJ'],audience:['Audience'],registration:['Registration'],speakers:['Speakers','Speaker'],workshop:['Workshop','Queue'],networking:['Networking','Walker'],catering:['Catering'],supplier:['Supplier'],components:['Components','Part'],assembly:['Assembly','Car'],finished:['Finished']};
  let paused=false,reduced=false,time=0,last=performance.now(),result={},inputs={},cameraGoal=null,manualTime=null;
  function animate(t){
    people.forEach((m,i)=>{const b=positions.get(m);m.position.y=b.y+Math.abs(Math.sin(t*2+i))*.08;m.position.x=b.x+(m.name.startsWith('Walker')?Math.sin(t*.65+i)*.55:Math.sin(t*1.2+i)*.07);m.position.z=b.z+(m.name.startsWith('Walker')?Math.cos(t*.65+i)*.35:0);});
    const flow=(result.day===0?inputs.openingInventory:result.produced)||0;
    if(kind==='factory'&&flow>0){cars.forEach((m,i)=>{const b=positions.get(m);m.position.x=-5.8+((t*Math.min(1,flow/(inputs.target||100))*.8+i*3)%12);m.position.y=b.y;});}
    const truck=roots.find(m=>m.name==='SupplierTruck');if(truck&&result.received>0)truck.position.z=positions.get(truck).z+Math.sin(t*.7)*1.2;
    if(cameraGoal){camera.target=Vector3.Lerp(camera.target,cameraGoal.target,reduced?1:.08);camera.radius+=(cameraGoal.radius-camera.radius)*(reduced?1:.08);}
  }
  const render=()=>{const now=performance.now(),dt=Math.min(.05,(now-last)/1000);last=now;if(document.hidden)return;if(!paused)time+=dt;animate(manualTime??time);scene.render();};
  engine.runRenderLoop(render);
  scene.onPointerObservable.add(info=>{
    if(info.type!==32 || !info.pickInfo?.hit) return;
    const name=info.pickInfo.pickedMesh.name;
    for(const [zone,prefixes] of Object.entries(prefixMap))if(prefixes.some(p=>name.startsWith(p))){onPick(zone);break;}
  });
  const resize=()=>{engine.resize();scene.render();};
  window.addEventListener('resize',resize);
  const observer=new ResizeObserver(resize); observer.observe(canvas);
  onReady();
  return {
    reduced(value){reduced=value;},
    update(s,c){inputs=s;result=c;
      if(kind==='concert'){
        const count=Math.ceil(60*c.occupancy/100);audience.forEach((m,i)=>m.setEnabled(i<count));
        const scale=s.capacity>=20000?3:s.capacity>=5000?2:s.capacity>=1000?1:0;
        roots.filter(m=>m.name.startsWith('Expansion_')).forEach(m=>{const row=Number(m.name.split('_')[2]);m.setEnabled(row<scale);});
        canvas.dataset.visiblePeople=String(audience.filter(m=>m.isEnabled()).length);
      }
      if(kind==='conference'){
        roots.filter(m=>/^WorkshopPerson_\d{2}$/.test(m.name)).forEach((m,i)=>m.setEnabled(i<Math.ceil(24*(c.workshopAccess||0)/100)));
        roots.filter(m=>/^Queue_\d{2}$/.test(m.name)).forEach((m,i)=>m.setEnabled(i<Math.ceil(12*(1-(c.workshopAccess??100)/100))));
        roots.filter(m=>/^Walker_\d{2}$/.test(m.name)).forEach((m,i)=>m.setEnabled(i<Math.min(18,c.attendance)));
      }
      if(kind==='factory')roots.filter(m=>/^Part_\d{2}$/.test(m.name)).forEach((m,i)=>m.setEnabled(i<Math.ceil(20*Math.min(1,c.inventory/Math.max(1,s.target*2)))));
      scene.render();
    },
    seek(t){manualTime=t;animate(t);scene.render();},
    setAttendance(n) { audience.forEach((m,i)=>m.setEnabled(i<Math.ceil(n/5))); scene.render(); },
    focus(concept) {
      highlight.removeAllMeshes();
      const prefixes=prefixMap[concept]||[];
      const targets=meshes.filter(m=>prefixes.some(p=>m.name.startsWith(p))&&m.getTotalVertices()>0);
      targets.forEach(m=>highlight.addMesh(m,new Color3(1,.6,.15)));
      if(targets.length){const center=targets[0].getBoundingInfo().boundingBox.centerWorld;cameraGoal={target:new Vector3(center.x*.45,1,center.z*.45),radius:homeRadius()*.82};}
      scene.render();
    },
    pause(value) {paused=value;scene.render();},
    reset() {cameraGoal=null;camera.target=new Vector3(0,1,0);camera.alpha=Math.PI/2.7;camera.beta=Math.PI/3.05;camera.radius=homeRadius();highlight.removeAllMeshes();scene.render();},
    dispose() { observer.disconnect();window.removeEventListener('resize',resize);engine.dispose(); }
  };
}
