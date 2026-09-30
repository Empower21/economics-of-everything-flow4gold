import {Engine} from '@babylonjs/core/Engines/engine';
import {Scene} from '@babylonjs/core/scene';
import {ArcRotateCamera} from '@babylonjs/core/Cameras/arcRotateCamera';
import {Vector3,Matrix,Quaternion} from '@babylonjs/core/Maths/math.vector';
import {Color3,Color4} from '@babylonjs/core/Maths/math.color';
import {HemisphericLight} from '@babylonjs/core/Lights/hemisphericLight';
import {DirectionalLight} from '@babylonjs/core/Lights/directionalLight';
import {ImportMeshAsync} from '@babylonjs/core/Loading/sceneLoader';
import {MeshBuilder} from '@babylonjs/core/Meshes/meshBuilder';
import {StandardMaterial} from '@babylonjs/core/Materials/standardMaterial';
import '@babylonjs/core/Meshes/thinInstanceMesh';
import '@babylonjs/loaders/glTF/2.0';
import '@babylonjs/loaders/glTF/glTFFileLoader';
import {crowdScale} from '../shared/registry.js';

export async function createVenue(canvas,onPick,onReady){
 const engine=new Engine(canvas,false,{preserveDrawingBuffer:true,stencil:false,antialias:false,adaptToDeviceRatio:false});
 const scene=new Scene(engine);scene.clearColor=new Color4(.035,.04,.09,1);
 const camera=new ArcRotateCamera('Stable concert camera',Math.PI/2-.35,.84,24,new Vector3(0,1,0),scene);camera.mode=1;
 const resize=()=>{const w=canvas.clientWidth,h=canvas.clientHeight;const ratio=w/h;engine.setSize(Math.min(512,Math.round(w)),Math.min(512,Math.round(w))/ratio);const span=ratio<1.1?10.5:10;camera.orthoLeft=-span;camera.orthoRight=span;camera.orthoTop=span/ratio;camera.orthoBottom=-span/ratio;};resize();
 const hemi=new HemisphericLight('soft ambient',new Vector3(0,1,0),scene);hemi.intensity=.85;hemi.groundColor=new Color3(.19,.12,.28);
 const key=new DirectionalLight('stage key',new Vector3(.3,-1,.5),scene);key.intensity=1.3;key.diffuse=new Color3(.84,.86,1);
 let imported;try{imported=await ImportMeshAsync('/models/concert.glb',scene);}catch(e){engine.dispose();throw e;}
 const convertedGeometry=new Set();for(const mesh of imported.meshes){if(!mesh.geometry||convertedGeometry.has(mesh.geometry))continue;convertedGeometry.add(mesh.geometry);const colors=mesh.getVerticesData('color');if(colors){const stride=mesh.getVertexBuffer('color').getSize();for(let i=0;i<colors.length;i++)if(stride===3||i%stride!==3)colors[i]=Math.pow(Math.max(0,colors[i]),1/2.2);mesh.setVerticesData('color',colors,false,stride);}}
 const paletteMaterials=new Map();for(const mesh of imported.meshes){const source=mesh.material;if(!source)continue;if(!paletteMaterials.has(source)){const m=new StandardMaterial('Pixel '+source.name,scene);m.diffuseColor=source.albedoColor?.clone()||Color3.White();m.specularColor=Color3.Black();m.emissiveColor=new Color3(.10,.10,.12);m.backFaceCulling=true;paletteMaterials.set(source,m);}mesh.material=paletteMaterials.get(source);}
 const templates=imported.meshes.filter(m=>/^Dancer_\d_\d_Frame$/.test(m.name));
 if(templates.length!==32){engine.dispose();throw new Error('Concert character library missing.');}
 // Exported posed frames share immutable geometry; 32 instanced batches serve up to 300 figures.
 templates.sort((a,b)=>a.name.localeCompare(b.name));
 const batches=templates.map(mesh=>{mesh.parent=null;mesh.position.setAll(0);mesh.rotationQuaternion=Quaternion.Identity();mesh.scaling.setAll(1);mesh.alwaysSelectAsActiveMesh=true;mesh.isPickable=false;const buffer=new Float32Array(300*16);mesh.thinInstanceSetBuffer('matrix',buffer,16,false);mesh.thinInstanceCount=0;return {mesh,buffer,variant:Number(mesh.name.split('_')[1]),pose:Number(mesh.name.split('_')[2])};});
 const dj=scene.getTransformNodeByName('DJ'),djRest=dj?.rotationQuaternion?.clone()||Quaternion.Identity();
 const groups=imported.animationGroups;groups.forEach(g=>{g.start(true);g.pause();});
 let paused=false,reduced=false,time=0,manualTime=null,last=performance.now(),visible=true,current={capacity:200,attendance:150},lastPose=-1;
 const beamMat=new StandardMaterial('gentle beam',scene);beamMat.diffuseColor=new Color3(.05,.6,.7);beamMat.emissiveColor=new Color3(.05,.35,.45);beamMat.alpha=.075;beamMat.disableLighting=true;beamMat.backFaceCulling=false;
 const beams=[-5,-2.5,2.5,5].map((x,i)=>{const b=MeshBuilder.CreateCylinder('light beam '+i,{height:5,diameterTop:.06,diameterBottom:2.5,tessellation:8},scene);b.position.set(x,2.6,-1.8);b.material=beamMat;b.isPickable=false;return b;});
 const pulseMaterial=new StandardMaterial('Booth beat LEDs',scene);pulseMaterial.disableLighting=true;const leds=MeshBuilder.CreateBox('Booth LED accents',{width:.06,height:.07,depth:.03},scene);leds.material=pulseMaterial;leds.isPickable=false;const ledMatrices=new Float32Array(17*16);for(let i=0;i<17;i++)Matrix.Translation((i-8)*.23,1.38,-1.69).copyToArray(ledMatrices,i*16);leds.thinInstanceSetBuffer('matrix',ledMatrices,16);
 const mat=Matrix.Identity(),scale=new Vector3(.48,.48,.48),rot=Quaternion.Identity(),pos=new Vector3();
 function drawCrowd(t,force=false){
  const tick=Math.floor(t*8);if(!force&&tick===lastPose)return;lastPose=tick;
  const mapping=crowdScale(current.capacity,current.attendance),cols=Math.ceil(Math.sqrt(mapping.availableFigureSlots*1.65)),rows=Math.ceil(mapping.availableFigureSlots/cols),counts=new Map(batches.map(b=>[b,0]));
  for(let i=0;i<mapping.occupiedFigures;i++){
   const variant=i%4,pose=(tick+Math.floor(i*1.7))%8,b=batches[variant*8+pose]||batches.find(b=>b.variant===variant&&b.pose===pose);
   // A stable permutation fills front/back evenly rather than one compressed strip.
   let slot=i;const x=(slot%cols+.5)/cols*13.5-6.75,z=(Math.floor(slot/cols)+.5)/rows*8.7-6.4;
   const phase=t*Math.PI*(variant===1?1:2)+i*1.71;
   pos.set(x+(reduced?0:Math.sin(phase)*(variant===1?.12:.035)),.04+(reduced?0:Math.abs(Math.sin(phase))*(variant===3?.065:.025)),-z);
   Quaternion.FromEulerAnglesToRef(0,(reduced?0:Math.sin(phase)*.08),reduced?0:Math.sin(phase)*(variant===0?.075:.025),rot);
   Matrix.ComposeToRef(scale,rot,pos,mat);const count=counts.get(b);mat.copyToArray(b.buffer,count*16);counts.set(b,count+1);
  }
  batches.forEach(b=>{const n=counts.get(b);b.mesh.setEnabled(n>0);b.mesh.thinInstanceCount=n;b.mesh.thinInstanceBufferUpdated('matrix');});
  canvas.dataset.visiblePeople=String(mapping.occupiedFigures);canvas.dataset.peoplePerFigure=String(mapping.peoplePerFigure);
 }
 function animate(t){const beat=.65+.15*Math.sin(t*Math.PI*4);pulseMaterial.emissiveColor.set(.1*beat,.8*beat,beat);groups.forEach(g=>{const frame=g.from+(t%8)/8*(g.to-g.from);g.goToFrame(frame);});if(dj)dj.rotationQuaternion=djRest.multiply(Quaternion.RotationYawPitchRoll(.015*Math.sin(t*Math.PI/2),0,.009*Math.sin(t*Math.PI/2)));drawCrowd(t);beams.forEach((b,i)=>{b.rotation.z=Math.sin(t*Math.PI/4+i)*.28;b.rotation.x=.35+Math.sin(t*Math.PI/4+i)*.12;});}
 const visibility=new IntersectionObserver(e=>{visible=e[0].isIntersecting;});visibility.observe(canvas);
 engine.runRenderLoop(()=>{const now=performance.now(),dt=Math.min(.05,(now-last)/1000);last=now;if(document.hidden||!visible)return;if(!paused&&!reduced)time+=dt;animate(manualTime??time);scene.render();canvas.dataset.fps=engine.getFps().toFixed(1);});
 const observer=new ResizeObserver(()=>{resize();scene.render();});observer.observe(canvas);onReady();
 canvas.dataset.animationGroups=String(groups.length);canvas.dataset.renderWidth=String(engine.getRenderWidth());
 return {update(s,c){current={capacity:s.capacity,attendance:c.attendance};drawCrowd(manualTime??time,true);scene.render();},pause(v){paused=v;},reduced(v){reduced=v;drawCrowd(time,true);},focus(){},reset(){},portrait(){camera.target.set(0,2.7,-2.7);camera.orthoLeft=-3.3;camera.orthoRight=3.3;camera.orthoTop=2.3;camera.orthoBottom=-2.3;scene.render();},seek(t){manualTime=t;animate(t);scene.render();},dispose(){observer.disconnect();visibility.disconnect();engine.dispose();}};
}
