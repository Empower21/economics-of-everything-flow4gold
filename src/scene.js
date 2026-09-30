import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene } from '@babylonjs/core/scene';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { ShadowGenerator } from '@babylonjs/core/Lights/Shadows/shadowGenerator';
import '@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent';
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
  const camera=new ArcRotateCamera('camera',Math.PI/2.7,Math.PI/3.15,15,new Vector3(0,1,0),scene);
  camera.attachControl(canvas,true);
  const homeRadius=()=>canvas.clientWidth/canvas.clientHeight<1.2?19:kind==='concert'?14.7:17;
  camera.radius=homeRadius();camera.lowerRadiusLimit=2.3; camera.upperRadiusLimit=35;
  camera.lowerBetaLimit=.3; camera.upperBetaLimit=1.3;
  camera.panningSensibility=0; camera.wheelPrecision=35;
  const ambient=new HemisphericLight('sky',new Vector3(0,1,0),scene); ambient.intensity=.85; ambient.groundColor=new Color3(.3,.38,.27);
  const sun=new DirectionalLight('sun',new Vector3(-.5,-1,.5),scene); sun.intensity=1.35;sun.position=new Vector3(6,12,-7);
  const highlight=new HighlightLayer('focus',scene);
  let meshes;
  try { ({meshes}=await ImportMeshAsync('/models/'+kind+'.glb',scene)); }
  catch (err) { engine.dispose(); throw err; }
  const roots=[...scene.transformNodes,...meshes];
  const shadows=new ShadowGenerator(1024,sun);shadows.useBlurExponentialShadowMap=true;shadows.blurKernel=12;shadows.darkness=.22;shadows.getShadowMap().refreshRate=0;
  meshes.forEach(m=>{m.receiveShadows=true;if(/DJ|Speaker|Worker|Car_|Stage|WorkshopTable/.test(m.name))shadows.addShadowCaster(m);});
  // Exported quaternion rest poses must be preserved when rotating articulated joints.
  roots.forEach(m=>{if(/_(Torso|Head|Arm[LR]|Elbow[LR]|Leg[LR]|Knee[LR])$/.test(m.name)&&m.rotationQuaternion){m.rotation=m.rotationQuaternion.toEulerAngles();m.rotationQuaternion=null;}});
  const rest=new Map(roots.map(m=>[m,m.rotation.clone()]));
  const namedNodes=new Map(roots.map(m=>[m.name,m]));const joint=name=>namedNodes.get(name);
  const rotate=(name,axis,amount)=>{const m=joint(name);if(m)m.rotation[axis]=rest.get(m)[axis]+amount;};
  const people=roots.filter(m=>/^(Audience|WorkshopPerson|Walker|Worker|Listener|EntranceWalker)_\d{2}$|^(DJ|Speaker|RegistrationHost)$/.test(m.name));
  const cars=roots.filter(m=>/^Car_\d{2}$/.test(m.name));
  const parked=kind==='factory'&&cars[0]?Array.from({length:2},(_,i)=>{const clone=cars[0].clone('FinishedCar_'+i,cars[0].parent);clone.position=new Vector3(4.5+i*1.3,clone.position.y-.93,-3);clone.scaling.scaleInPlace(.6);clone.setEnabled(false);return clone;}):[];
  const audience=people.filter(m=>m.name.startsWith('Audience_')).sort((a,b)=>a.name.localeCompare(b.name));
  const positions=new Map([...people,...cars,...roots.filter(m=>m.name==='SupplierTruck')].map(m=>[m,m.position.clone()]));
  const prefixMap={entrance:['Entrance'],stage:['Stage','DJ','Speaker cone'],audience:['Audience'],registration:['Registration'],speakers:['Speakers','Speaker'],workshop:['Workshop','Queue'],networking:['Networking','Walker'],catering:['Catering'],supplier:['Supplier'],components:['Components','Part'],assembly:['Assembly','Car'],finished:['Finished']};
  let visible=true;const visibility=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;});visibility.observe(canvas);
  let paused=false,reduced=false,time=0,last=performance.now(),result={},inputs={},cameraGoal=null,manualTime=null,sceneState={},deliveryAt=0,lastDay=-1;
  function animate(t){
    people.forEach((m,i)=>{
      if(!m.isEnabled())return;const b=positions.get(m),name=m.name;
      const walking=name.startsWith('EntranceWalker'),dancing=name.startsWith('Audience'),working=name.startsWith('Worker'),dj=name==='DJ',seated=/WorkshopPerson|Listener/.test(name);
      const active=!working||sceneState.producing;const cycle=t*(walking?4:2)+i*1.7,amplitude=active?1:.06;
      rotate(name+'_Torso','z',Math.sin(cycle)*.045*amplitude);
      rotate(name+'_Head','y',Math.sin(t*.9+i)*.12);
      for(const [side,sign] of [['L',-1],['R',1]]){
        rotate(name+'_Arm'+side,'x',(walking?Math.sin(cycle)*.38*sign:dj?Math.sin(t*2+sign)*.18:working?Math.sin(t*2)*.20:dancing?-.35+Math.sin(cycle)*.17:Math.sin(cycle*.6)*.12)*amplitude);
        rotate(name+'_Elbow'+side,'x',(dj?Math.sin(t*3+sign)*.25:dancing?-.6+Math.sin(cycle+sign)*.25:-.25+Math.sin(cycle)*.1)*amplitude);
        if(!seated){rotate(name+'_Leg'+side,'x',Math.sin(cycle)*sign*(walking?.33:dancing?.055:0));rotate(name+'_Knee'+side,'x',Math.max(0,Math.sin(cycle)*sign)*(walking?.35:dancing?.1:0));}
      }
      if(walking){m.position.z=b.z+((t*.24+i*.36)%1.3)-.65;}else if(dancing){m.position.y=b.y+Math.abs(Math.sin(cycle))*.025;}
    });
    if(kind==='factory'&&sceneState.producing){cars.forEach((m,i)=>{m.position.x=-5.8+((t*Math.min(1,(result.produced||0)/(inputs.target||100))*.65+i*3)%12);});}
    const robot=joint('Assembly robot arm');if(robot)robot.rotation.z=sceneState.producing?Math.sin(t*2)*.12:0;
    const part=joint('Assembly moving part');if(part){part.setEnabled(!!sceneState.producing);part.position.y=2.1-Math.abs(Math.sin(t*1.4))*.5;}
    const truck=joint('SupplierTruck');if(truck){const b=positions.get(truck),dt=t-deliveryAt;truck.position.z=b.z+(result.received>0&&dt<4?(1-Math.min(1,dt/3))*3:0);}
    if(cameraGoal){camera.target=Vector3.Lerp(camera.target,cameraGoal.target,reduced?1:.1);camera.radius+=(cameraGoal.radius-camera.radius)*(reduced?1:.1);}
  }
  const render=()=>{const now=performance.now(),dt=Math.min(.05,(now-last)/1000);last=now;if(document.hidden||!visible)return;if(!paused)time+=dt;animate(manualTime??time);scene.render();};
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
    update(s,c,state){inputs=s;result=c;shadows.getShadowMap().resetRefreshCounter();sceneState=state||{producing:c.day>0&&c.produced>0};if(c.day!==lastDay){deliveryAt=time;lastDay=c.day;}
      if(kind==='concert'){
        const count=Math.ceil(36*c.occupancy/100);audience.forEach((m,i)=>m.setEnabled(i<count));
        const scale=s.capacity>=20000?3:s.capacity>=5000?2:s.capacity>=1000?1:0;
        roots.filter(m=>m.name.startsWith('Expansion_')).forEach(m=>{const row=Number(m.name.split('_')[2]);m.setEnabled(row<scale);});
        canvas.dataset.visiblePeople=String(audience.filter(m=>m.isEnabled()).length);
      }
      if(kind==='conference'){
        roots.filter(m=>/^WorkshopPerson_\d{2}$/.test(m.name)).forEach((m,i)=>m.setEnabled(i<Math.ceil(12*(c.workshopAccess||0)/100)));
        roots.filter(m=>/^WorkshopSeat_|^WorkshopTable_/.test(m.name)).forEach((m,i)=>m.setEnabled(i%12<Math.ceil(12*(c.workshopAccess||0)/100)));
        roots.filter(m=>/^Listener_/.test(m.name)).forEach(m=>m.setEnabled(c.attendance>0));
        roots.filter(m=>/^Queue_\d{2}$/.test(m.name)).forEach((m,i)=>m.setEnabled(i<Math.ceil(12*(1-(c.workshopAccess??100)/100))));
        roots.filter(m=>/^Walker_\d{2}$/.test(m.name)).forEach((m,i)=>m.setEnabled(i<Math.min(6,c.attendance)));
      }
      if(kind==='concert')roots.filter(m=>/^EntranceWalker_\d{2}$/.test(m.name)).forEach(m=>m.setEnabled(c.attendance>0));
      if(kind==='factory')roots.filter(m=>/^Part_\d{2}$/.test(m.name)).forEach((m,i)=>m.setEnabled(i<Math.ceil(20*Math.min(1,c.inventory/Math.max(1,s.target*2)))));
      parked.forEach((m,i)=>m.setEnabled(i<Math.min(2,c.finishedInventory||0)));
      canvas.dataset.producing=String(!!sceneState.producing);canvas.dataset.parts=String(c.inventory??0);animate(manualTime??time);scene.render();
    },
    portrait(){const head=joint(kind==='concert'?'DJ_Head':kind==='conference'?'Speaker_Head':'Worker_00_Head');if(head){head.computeWorldMatrix(true);cameraGoal=null;camera.target=head.getAbsolutePosition().clone();camera.radius=2.6;camera.beta=1.38;camera.alpha=1.45;scene.render();}},
    seek(t){manualTime=t;animate(t);scene.render();},
    setAttendance(n) { audience.forEach((m,i)=>m.setEnabled(i<Math.ceil(n/5))); scene.render(); },
    focus(concept) {
      highlight.removeAllMeshes();
      const prefixes=prefixMap[concept]||[];
      const targets=meshes.filter(m=>prefixes.some(p=>m.name.startsWith(p))&&m.getTotalVertices()>0);
      targets.forEach(m=>highlight.addMesh(m,new Color3(1,.6,.15)));
      if(targets.length){const anchors={entrance:'Entrance arch',stage:'DJ',audience:'Audience_14',registration:'Registration desk',speakers:'Speaker',workshop:'WorkshopPerson_05',networking:'Networking floor',catering:'Catering counter',supplier:'SupplierTruck',components:'Components rack',assembly:'Assembly gantry',finished:'Finished loading bay'};const anchor=joint(anchors[concept]);const center=anchor?(anchor.getBoundingInfo?anchor.getBoundingInfo().boundingBox.centerWorld:anchor.getAbsolutePosition()):targets[0].getBoundingInfo().boundingBox.centerWorld;cameraGoal={target:new Vector3(center.x,Math.max(1.1,center.y+(concept==='stage'||concept==='speakers'?.7:0)),center.z),radius:homeRadius()*.60};}
      scene.render();
    },
    pause(value) {paused=value;scene.render();},
    reset() {cameraGoal=null;camera.target=new Vector3(0,1,0);camera.alpha=Math.PI/2.7;camera.beta=Math.PI/3.05;camera.radius=homeRadius();highlight.removeAllMeshes();scene.render();},
    dispose() { visibility.disconnect();observer.disconnect();window.removeEventListener('resize',resize);engine.dispose(); }
  };
}
