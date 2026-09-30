"""Reproducible Blender 5.2 asset pass: articulated adult characters and detailed vehicles.
All geometry is original. Babylon animates named joints, with no downloaded rig dependency.
"""
import bpy, math, runpy, json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
# Regenerate the established environments, then upgrade their occupants/material detail.
runpy.run_path(str(ROOT/'scripts/create-worlds-base.py'))

def mat(name,color,metal=0):
 m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True
 p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*color,1);p.inputs['Roughness'].default_value=.56;p.inputs['Metallic'].default_value=metal
 return m

def empty(name,parent=None,loc=(0,0,0)):
 o=bpy.data.objects.new(name,None);bpy.context.collection.objects.link(o);o.parent=parent;o.location=loc;return o

def mesh(name,loc,size,material,parent=None,shape='box'):
 if shape=='sphere':bpy.ops.mesh.primitive_uv_sphere_add(segments=12,ring_count=8,radius=1)
 else:bpy.ops.mesh.primitive_cube_add(size=1)
 o=bpy.context.object;o.name=name;o.parent=parent;o.location=loc;o.scale=size if shape=='sphere' else (1,1,1)
 if shape!='sphere':
  o.dimensions=size;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
  mod=o.modifiers.new('Tailored edges','BEVEL');mod.width=min(size)*.18;mod.segments=2;bpy.ops.object.modifier_apply(modifier=mod.name)
 o.data.materials.append(material)
 for p in o.data.polygons:p.use_smooth=True
 return o

def join(parts,name,parent):
 bpy.ops.object.select_all(action='DESELECT')
 for o in parts:o.select_set(True)
 bpy.context.view_layer.objects.active=parts[0];bpy.ops.object.join();o=bpy.context.object;o.name=name
 # Keep world-space result and recover local parenting (join leaves first object's transform).
 return o

def human(name,x,y,z,index=0,role='dance',scale=1,angle=0):
 root=empty(name,loc=(x,y,z));root.scale=(scale,scale,scale);root.rotation_euler.z=angle;root['role']=role
 skin=skins[index%len(skins)];shirt=clothes[index%len(clothes)] if role!='work' else hi
 # Adult proportions: 1.78 metres, head about one eighth of standing height.
 body=empty(name+'_Torso',root,(0,0,1.12))
 parts=[mesh('jacket',(0,0,.16),(.24,.135,.29),shirt,body,'sphere'),mesh('waist',(0,0,-.10),(.34,.22,.17),shirt,body),mesh('shirt front',(0,-.125,.14),(.10,.012,.37),ivory,body),mesh('belt',(0,0,-.15),(.36,.25,.04),dark,body)]
 for dx in [-.055,.055]:parts.append(mesh('collar',(dx,-.13,.37),(.08,.025,.085),ivory,body))
 if role=='work':
  for dz in [.02,.25]:parts.append(mesh('reflective stripe',(0,-.14,dz),(.40,.015,.045),ivory,body))
 join(parts,name+'_Clothing',body)
 head=empty(name+'_Head',body,(0,0,.45))
 face=[mesh('neck',(0,0,-.05),(.075,.072,.10),skin,head,'sphere'),mesh('face',(0,-.004,.10),(.118,.103,.15),skin,head,'sphere'),mesh('nose',(0,-.109,.10),(.024,.030,.034),skin,head,'sphere')]
 for dx in [-.11,.11]:face.append(mesh('ear',(dx,0,.1),(.025,.020,.040),skin,head,'sphere'))
 for dx in [-.043,.043]:
  face.extend([mesh('eye white',(dx,-.099,.133),(.025,.012,.013),ivory,head,'sphere'),mesh('iris',(dx,-.111,.131),(.010,.005,.011),dark,head,'sphere'),mesh('brow',(dx,-.102,.162),(.054,.016,.012),hair[index%3],head)])
 face.extend([mesh('mouth',(0,-.099,.043),(.043,.012,.009),lips,head),mesh('hair crown',(0,.015,.216),(.124,.107,.067),hair[index%3],head,'sphere')])
 if index%3==0:face.append(mesh('hair bun',(0,.096,.19),(.09,.07,.09),hair[0],head,'sphere'))
 elif index%3==1:face.append(mesh('hair fringe',(-.05,-.065,.205),(.080,.06,.048),hair[1],head,'sphere'))
 else:
  for k in range(6):face.append(mesh('curl',(.075*math.cos(k),.05*math.sin(k),.245),(.05,.055,.045),hair[2],head,'sphere'))
 if role=='work':face.extend([mesh('helmet',(0,0,.245),(.15,.135,.07),hi,head,'sphere'),mesh('helmet brim',(0,-.022,.214),(.33,.3,.025),hi,head)])
 if role=='dj':
  for dx in [-.137,.137]:face.append(mesh('headphone',(dx,0,.11),(.035,.08,.09),dark,head,'sphere'))
  face.append(mesh('headband',(0,.01,.27),(.27,.055,.04),dark,head))
 join(face,name+'_Face',head)
 for side,sign in [('L',-1),('R',1)]:
  shoulder=empty(name+'_Arm'+side,body,(sign*.25,0,.33))
  upper=[mesh('sleeve',(sign*.015,0,-.12),(.075,.078,.17),shirt,shoulder,'sphere'),mesh('upper arm',(sign*.025,0,-.235),(.050,.050,.09),skin,shoulder,'sphere')]
  join(upper,name+'_Sleeve'+side,shoulder)
  elbow=empty(name+'_Elbow'+side,shoulder,(sign*.025,0,-.28))
  fore=[mesh('forearm',(0,0,-.12),(.047,.046,.13),skin,elbow,'sphere'),mesh('hand',(0,-.008,-.25),(.049,.033,.067),skin,elbow,'sphere')]
  for finger in range(3):fore.append(mesh('finger',(-.025+finger*.023,-.011,-.304),(.009,.016,.035),skin,elbow,'sphere'))
  join(fore,name+'_Hand'+side,elbow)
  hip=empty(name+'_Leg'+side,root,(sign*.095,0,.93))
  mesh(name+'_Trousers'+side,(0,0,-.215),(.083,.083,.235),pants,hip,'sphere')
  knee=empty(name+'_Knee'+side,hip,(0,0,-.43))
  lower=[mesh('lower leg',(0,0,-.20),(.063,.067,.22),pants,knee,'sphere'),mesh('shoe',(0,-.075,-.43),(.145,.28,.10),dark,knee)]
  join(lower,name+'_Boot'+side,knee)
  if role=='sit':hip.rotation_euler.x=-1.35;knee.rotation_euler.x=1.35
  if role in ['dj','work']:shoulder.rotation_euler.x=-.65;elbow.rotation_euler.x=-.8
 return root

for kind in ['concert']:
 bpy.ops.wm.open_mainfile(filepath=str(ROOT/'assets'/f'{kind}.blend'))
 skins=[mat('Skin umber',(.28,.115,.06)),mat('Skin honey',(.61,.30,.16)),mat('Skin rose',(.82,.51,.33)),mat('Skin sienna',(.43,.21,.11))]
 clothes=[mat('Coral jacket',(.75,.20,.12)),mat('Teal shirt',(.035,.36,.33)),mat('Indigo jacket',(.18,.22,.43)),mat('Ochre knit',(.78,.46,.10)),mat('Plum shirt',(.42,.13,.25))]
 ivory=mat('Cotton ivory',(.90,.86,.74));dark=mat('Leather charcoal',(.018,.027,.033));pants=mat('Denim',(.04,.08,.13));hi=mat('Safety ochre',(.96,.57,.08));lips=mat('Lip tone',(.30,.08,.065));hair=[mat('Hair dark',(.021,.014,.012)),mat('Hair chestnut',(.13,.045,.02)),mat('Hair brown',(.055,.028,.015))]
 for o in list(bpy.data.objects):
  if o.name.startswith(('Audience_','DJ torso','DJ head')):bpy.data.objects.remove(o,do_unlink=True)
 if kind=='concert':
  # Open canopy to retain light rig without hiding the DJ in the default view.
  canopy=bpy.data.objects.get('Stage canopy')
  if canopy:canopy.dimensions.y=.45;canopy.location.y=3.9
  human('DJ',0,3.10,.86,1,'dj',1.05)
  for i in range(36):human(f'Audience_{i:02d}',-2.55+i%6*.94,-.4-i//6*.61,0,i,'dance',.72,math.pi+(i%3-1)*.12)
  for i in range(3):human(f'EntranceWalker_{i:02d}',3.7,-3.9+i*.5,0,i+1,'walk',.70)
  # Mixer controls and an identifiable laptop.
  mesh('DJ mixer',(0,2.58,1.79),(.40,.5,.065),dark)
  for x in [-.12,0,.12]:
   for y in [2.46,2.59,2.72]:mesh('DJ knob',(x,y,1.845),(.025,.025,.04),hi)
  mesh('DJ laptop base',(.83,2.7,1.80),(.47,.36,.035),dark)
  laptop=mesh('DJ laptop screen',(.83,2.88,2.01),(.47,.03,.38),dark);laptop.rotation_euler.x=-.15
  mesh('DJ laptop display',(.83,2.855,2.01),(.40,.009,.31),clothes[1])
 # Keep editable, clean source and versioned provenance.
 bpy.context.scene['asset_version']='concert-only-v1';bpy.context.scene['animation_runtime']='Babylon named joint rotations'
 bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'assets'/f'{kind}.blend'))
 bpy.ops.export_scene.gltf(filepath=str(ROOT/'public/models'/f'{kind}.glb'),export_format='GLB',export_apply=True,export_animations=False,export_extras=True)
 print('UPGRADED',kind,flush=True)
manifest={'version':'concert-only-v1','blender':bpy.app.version_string,'renderer':'Babylon.js','license':'Original project-authored geometry; no external asset attribution required','sources':['scripts/create-venue.py','scripts/create-worlds-base.py','scripts/create-worlds.py','scripts/polish-assets.py'],'animation':'Articulated browser-driven named joints; no baked animation claim','models':{k:'/models/'+k+'.glb' for k in ['concert']},'fallback':'src/illustration.js, original vector illustration using shared scene state','voice':'Existing configured ElevenLabs voice; user accent review pending'}
manifest['media']={'version':'addendum02','format':'960 x 960 composed browser recordings with existing ElevenLabs narration','languages':['en','de'],'paths':['/media/'+k+'-'+lang+'.mp4' for k in ['concert'] for lang in ['en','de']]}
(ROOT/'public/asset-manifest.json').write_text(json.dumps(manifest,indent=2))

runpy.run_path(str(ROOT/'scripts/polish-assets.py'))
