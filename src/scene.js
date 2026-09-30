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
  scene.clearColor=new Color4(.97,.90,.79,1);
  const camera=new ArcRotateCamera('camera',Math.PI/2.7,Math.PI/3.15,15,new Vector3(0,1,0),scene);
  camera.attachControl(canvas,true);
  const homeRadius=()=>canvas.clientWidth/canvas.clientHeight<1.2?19:14.7;
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
  meshes.forEach(m=>{m.receiveShadows=true;if(/DJ|Stage|Speaker cone/.test(m.name))shadows.addShadowCaster(m);});
  // Exported quaternion rest poses must be preserved when rotating articulated joints.
  roots.forEach(m=>{if(/_(Torso|Head|Arm[LR]|Elbow[LR]|Leg[LR]|Knee[LR])$/.test(m.name)&&m.rotationQuaternion){m.rotation=m.rotationQuaternion.toEulerAngles();m.rotationQuaternion=null;}});
  const rest=new Map(roots.map(m=>[m,m.rotation.clone()]));
  const namedNodes=new Map(roots.map(m=>[m.name,m]));const joint=name=>namedNodes.get(name);
  const rotate=(name,axis,amount)=>{const m=joint(name);if(m)m.rotation[axis]=rest.get(m)[axis]+amount;};
  const people=roots.filter(m=>/^(Audience|EntranceWalker)_\d{2}$|^(DJ)$/.test(m.name));
  const audience=people.filter(m=>m.name.startsWith('Audience_')).sort((a,b)=>a.name.localeCompare(b.name));
  const positions=new Map(people.map(m=>[m,m.position.clone()]));
  const prefixMap={entrance:['Entrance'],stage:['Stage','DJ','Speaker cone'],audience:['Audience']};
  let visible=true;const visibility=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;});visibility.observe(canvas);
  let paused=false,reduced=false,time=0,last=performance.now(),cameraGoal=null,manualTime=null;
  function animate(t){
    people.forEach((m,i)=>{
      if(!m.isEnabled())return;const b=positions.get(m),name=m.name;
      const walking=name.startsWith('EntranceWalker'),dancing=name.startsWith('Audience'),dj=name==='DJ';
      const cycle=t*(walking?4:2)+i*1.7,amplitude=1;
      rotate(name+'_Torso','z',Math.sin(cycle)*.045*amplitude);
      rotate(name+'_Head','y',Math.sin(t*.9+i)*.12);
      for(const [side,sign] of [['L',-1],['R',1]]){
        rotate(name+'_Arm'+side,'x',(walking?Math.sin(cycle)*.38*sign:dj?Math.sin(t*2+sign)*.18:dancing?-.35+Math.sin(cycle)*.17:Math.sin(cycle*.6)*.12)*amplitude);
        rotate(name+'_Elbow'+side,'x',(dj?Math.sin(t*3+sign)*.25:dancing?-.6+Math.sin(cycle+sign)*.25:-.25+Math.sin(cycle)*.1)*amplitude);
        {rotate(name+'_Leg'+side,'x',Math.sin(cycle)*sign*(walking?.33:dancing?.055:0));rotate(name+'_Knee'+side,'x',Math.max(0,Math.sin(cycle)*sign)*(walking?.35:dancing?.1:0));}
      }
      if(walking){m.position.z=b.z+((t*.24+i*.36)%1.3)-.65;}else if(dancing){m.position.y=b.y+Math.abs(Math.sin(cycle))*.025;}
    });
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
    update(s,c){shadows.getShadowMap().resetRefreshCounter();
      {
        const count=Math.ceil(36*c.occupancy/100);audience.forEach((m,i)=>m.setEnabled(i<count));
        const scale=s.capacity>=20000?3:s.capacity>=5000?2:s.capacity>=1000?1:0;
        roots.filter(m=>m.name.startsWith('Expansion_')).forEach(m=>{const row=Number(m.name.split('_')[2]);m.setEnabled(row<scale);});
        canvas.dataset.visiblePeople=String(audience.filter(m=>m.isEnabled()).length);
      }
      roots.filter(m=>/^EntranceWalker_\d{2}$/.test(m.name)).forEach(m=>m.setEnabled(c.attendance>0));
      animate(manualTime??time);scene.render();
    },
    portrait(){const head=joint('DJ_Head');if(head){head.computeWorldMatrix(true);cameraGoal=null;camera.target=head.getAbsolutePosition().clone();camera.radius=2.6;camera.beta=1.38;camera.alpha=1.45;scene.render();}},
    seek(t){manualTime=t;animate(t);scene.render();},
    setAttendance(n) { audience.forEach((m,i)=>m.setEnabled(i<Math.ceil(n/5))); scene.render(); },
    focus(concept) {
      highlight.removeAllMeshes();
      const prefixes=prefixMap[concept]||[];
      const targets=meshes.filter(m=>prefixes.some(p=>m.name.startsWith(p))&&m.getTotalVertices()>0);
      targets.forEach(m=>highlight.addMesh(m,new Color3(1,.6,.15)));
      if(targets.length){const anchors={entrance:'Entrance arch',stage:'DJ',audience:'Audience_14'};const anchor=joint(anchors[concept]);const center=anchor?(anchor.getBoundingInfo?anchor.getBoundingInfo().boundingBox.centerWorld:anchor.getAbsolutePosition()):targets[0].getBoundingInfo().boundingBox.centerWorld;cameraGoal={target:new Vector3(center.x,Math.max(1.1,center.y+(concept==='stage'?.7:0)),center.z),radius:homeRadius()*.60};}
      scene.render();
    },
    pause(value) {paused=value;scene.render();},
    reset() {cameraGoal=null;camera.target=new Vector3(0,1,0);camera.alpha=Math.PI/2.7;camera.beta=Math.PI/3.05;camera.radius=homeRadius();highlight.removeAllMeshes();scene.render();},
    dispose() { visibility.disconnect();observer.disconnect();window.removeEventListener('resize',resize);engine.dispose(); }
  };
}
