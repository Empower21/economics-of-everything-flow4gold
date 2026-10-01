import {Engine} from '@babylonjs/core/Engines/engine';
import {Scene} from '@babylonjs/core/scene';
import {ArcRotateCamera} from '@babylonjs/core/Cameras/arcRotateCamera';
import {Vector3} from '@babylonjs/core/Maths/math.vector';
import {HemisphericLight} from '@babylonjs/core/Lights/hemisphericLight';
import {Color3,Color4} from '@babylonjs/core/Maths/math.color';
import {BaseTexture} from '@babylonjs/core/Materials/Textures/baseTexture';
import {StandardMaterial} from '@babylonjs/core/Materials/standardMaterial';
import {ImportMeshAsync} from '@babylonjs/core/Loading/sceneLoader';
import '@babylonjs/loaders/glTF/2.0';
import '@babylonjs/loaders/glTF/glTFFileLoader';
// Independent Blender dashboard; never modifies the concert scene.
export async function createDeck(canvas) {
 const engine=new Engine(canvas,false,{preserveDrawingBuffer:true,stencil:false}),scene=new Scene(engine);scene.clearColor=new Color4(.055,.063,.13,1);
 try {
  const camera=new ArcRotateCamera('deck-camera',Math.PI/2-.35,Math.PI/3.3,13,new Vector3(0,0,0),scene);camera.mode=1;camera.orthoLeft=-5.6;camera.orthoRight=5.6;camera.orthoTop=3.2;camera.orthoBottom=-3.2;
  const light=new HemisphericLight('deck-light',new Vector3(-1,3,-2),scene);light.intensity=1.2;
  await ImportMeshAsync('/models/control-deck.glb',scene);
  await new Promise(resolve=>BaseTexture.WhenAllReady(scene.textures.slice(),resolve));
  const materials=new Map();for(const mesh of scene.meshes){const old=mesh.material;if(!old)continue;if(!materials.has(old)){const m=new StandardMaterial('deck-'+old.name,scene);m.diffuseColor=old.albedoColor?.clone()||Color3.White();m.specularColor=Color3.Black();materials.set(old,m);}mesh.material=materials.get(old);}
  const records=['DeckRecordLeft','DeckRecordRight'].map(n=>scene.getTransformNodeByName(n));let angle=0,last=0,stopped=false,visible=true,disposed=false,speed=1;
  const observer=new IntersectionObserver(([entry])=>visible=entry.isIntersecting);observer.observe(canvas);const resize=()=>{const w=Math.min(384,Math.max(1,canvas.clientWidth));engine.setSize(w,Math.round(w*4/7));scene.render();};const sizes=new ResizeObserver(resize);sizes.observe(canvas);resize();
  engine.runRenderLoop(()=>{const now=performance.now();if(disposed||!visible||document.hidden||now-last<1000/15)return;const dt=Math.min(.1,(now-last)/1000);last=now;if(!stopped){angle+=dt*speed;records.forEach((r,i)=>{if(r){r.rotationQuaternion=null;r.rotation.y=angle*(i?-.83:1);}});}scene.render();});canvas.dataset.loaded='true';canvas.tabIndex=-1;
  return {update(s,paused){speed=.5+Math.min(s.ticketPrice,100)/80;stopped=paused;canvas.dataset.paused=String(paused);for(const [name,value,max] of [['DeckFader-0.65',s.ticketPrice,100],['DeckFader0.65',s.capacity,10000]]){const mesh=scene.getMeshByName(name);if(mesh)mesh.position.z=-.7+Math.min(1,value/max)*1.4;}},dispose(){if(disposed)return;disposed=true;engine.stopRenderLoop();observer.disconnect();sizes.disconnect();scene.dispose();engine.dispose();}};
 }catch(e){scene.dispose();engine.dispose();throw e;}
}
