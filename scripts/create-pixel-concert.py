"""Reproducible original concert artwork. Blender 5.2; 192-frame performance, 24fps.
Palette vertex colours and rigid transform animations survive glTF export.
Audience: four character designs, eight posed frames each; browser thin-instances them.
"""
import bpy, math, json
from mathutils import Vector
from pathlib import Path
R=Path(__file__).resolve().parents[1]
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
sc=bpy.context.scene;sc.render.engine='CYCLES';sc.cycles.samples=24
sc.render.resolution_x=640;sc.render.resolution_y=360;sc.render.resolution_percentage=100
sc.render.fps=24;sc.frame_start=1;sc.frame_end=193
sc.world.color=(.075,.085,.13)
sc.view_settings.view_transform='Standard'
P={'navy':(.027,.032,.075),'wall':(.045,.052,.12),'purple':(.20,.10,.31),'cyan':(.06,.84,.86),'pink':(.94,.16,.48),'gold':(1,.65,.14),'white':(.85,.91,.88),'black':(.012,.018,.03),'skin':(.65,.32,.18),'light':(.96,.65,.39),'brown':(.25,.10,.07),'blue':(.08,.22,.58),'mint':(.13,.58,.41),'cream':(.92,.81,.57)}
materials={}
for key,c in P.items():
 m=bpy.data.materials.new(key);m.diffuse_color=(*c,1);m.use_nodes=True;bs=m.node_tree.nodes.get('Principled BSDF');bs.inputs['Base Color'].default_value=(*c,1);bs.inputs['Roughness'].default_value=.85
 if key in ['cyan','pink','gold']:bs.inputs['Emission Color'].default_value=(*c,1);bs.inputs['Emission Strength'].default_value=.22
 materials[key]=m
vertex=bpy.data.materials.new('Pixel palette');vertex.use_nodes=True
bs=vertex.node_tree.nodes.get('Principled BSDF');attr=vertex.node_tree.nodes.new('ShaderNodeVertexColor');attr.layer_name='Color';vertex.node_tree.links.new(attr.outputs['Color'],bs.inputs['Base Color']);bs.inputs['Roughness'].default_value=.9

def box(name,pos,size,col,parent=None):
 bpy.ops.mesh.primitive_cube_add(size=1,location=pos);o=bpy.context.object;o.name=name;o.dimensions=size;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(materials[col]);o.parent=parent;return o

def cyl(name,pos,r,depth,col,parent=None,verts=24):
 bpy.ops.mesh.primitive_cylinder_add(vertices=verts,radius=r,depth=depth,location=pos);o=bpy.context.object;o.name=name;o.data.materials.append(materials[col]);o.parent=parent;return o

def empty(name,pos,parent=None):
 o=bpy.data.objects.new(name,None);sc.collection.objects.link(o);o.location=pos;o.parent=parent;return o

def merge(parts,name):
 # Bake the small fixed palette into vertices; one material per rigid part.
 for o in parts:
  a=o.data.color_attributes.new(name='Color',type='FLOAT_COLOR',domain='CORNER')
  for poly in o.data.polygons:
   color=o.data.materials[poly.material_index].diffuse_color
   for i in poly.loop_indices:a.data[i].color=color
  o.data.materials.clear();o.data.materials.append(vertex)
 bpy.ops.object.select_all(action='DESELECT')
 for o in parts:o.select_set(True)
 bpy.context.view_layer.objects.active=parts[0];bpy.ops.object.join();o=bpy.context.object;o.name=name
 return o

# Stable front-facing stage, richly patterned tile floor and cyan aisle edges.
venue=[]
venue.append(box('foundation',(0,0,-.2),(17,16,.4),'navy'))
venue.append(box('backdrop',(0,5,2.5),(17,.35,5.4),'wall'))
venue.append(box('stage',(0,3.3,.28),(14,3.6,.56),'purple'))
for x in range(-8,9):
 for y in range(-7,3):venue.append(box('dance tile',(x,y,.015),(.97,.97,.03),'wall' if (x+y)%2 else 'navy'))
for x in [-8,8]:
 venue.append(box('aisle light',(x,-2,.04),(.06,11,.04),'cyan'))
 venue.append(box('truss upright',(x,4,2.6),(.16,.16,5.2),'black'))
 for z in [1,2,3,4]:venue.append(box('truss rung',(x,4,z),(.30,.22,.08),'white'))
venue.append(box('overhead truss',(0,4,5.1),(16,.17,.17),'black'))
for i in range(-7,8):
 venue.append(box('pixel equalizer',(i,4.76,1.7),( .50,.07,.2+abs(math.sin(i*2))*.8),'pink' if i%2 else 'cyan'))
for x in [-5.9,5.9]:
 for z in [.85,2.0]:
  venue.append(box('speaker cabinet',(x,3.5,z),(1.2,.9,1.08),'black'))
  for zz in [-.24,.24]:
   o=cyl('speaker cone',(x,2.99,z+zz),.32,.08,'purple',verts=16);o.rotation_euler.x=math.pi/2;venue.append(o)
   o=cyl('speaker dustcap',(x,2.92,z+zz),.13,.06,'black',verts=12);o.rotation_euler.x=math.pi/2;venue.append(o)
venue.append(box('entrance lintel',(-6.7,-5.6,2.1),(2.4,.16,.18),'gold'))
for x in [-7.9,-5.5]:venue.append(box('entrance post',(x,-5.6,1.0),(.12,.12,2),'gold'))
# Booth with two platters, striped fascia, and mixer.
venue.append(box('booth',(0,2.5,1.05),(4.5,1.4,1.05),'black'))
venue.append(box('booth fascia',(0,1.78,1.07),(4.3,.06,.8),'purple'))
for i in range(-8,9):venue.append(box('fascia pixel',(i*.23,1.73,1.05),(.11,.05,.13+abs(math.sin(i))*.4),'cyan' if i%3 else 'pink'))
venue.append(box('booth top',(0,2.5,1.61),(4.7,1.5,.12),'white'))
for x in [-1.38,1.38]:
 venue.append(box('turntable',(x,2.48,1.72),(1.35,1.12,.13),'navy'))
 venue.append(cyl('platter',(x,2.4,1.81),.49,.06,'black'))
 venue.append(box('tonearm',(x+.44,2.6,1.91),(.04,.65,.04),'white'))
 venue.append(box('cartridge',(x+.44,2.28,1.9),(.11,.08,.06),'pink'))
 rec=empty('RecordLeft' if x<0 else 'RecordRight',(x,2.4,1.86))
 cyl('record label',(0,0,0),.14,.025,'gold' if x<0 else 'pink',rec)
 box('record groove marker',(.28,0,.015),(.27,.035,.01),'cream',rec)
 for frame in range(1,194,8):
  t=(frame-1)/24;rec.rotation_euler.z=(math.sin(t*math.pi*4)*.7 if x<0 else t*math.pi);rec.keyframe_insert(data_path='rotation_euler',frame=frame)
venue.append(box('mixer',(0,2.4,1.75),(.85,1.15,.18),'navy'))
for x in [-.25,0,.25]:
 venue.append(box('fader track',(x,2.25,1.85),(.025,.35,.025),'white'));venue.append(box('fader knob',(x,2.2,1.88),(.12,.10,.05),'gold'))
 for y in [2.57,2.8]:venue.append(cyl('mixer knob',(x,y,1.87),.06,.08,'pink' if x==0 else 'cyan',verts=8))
merge(venue,'Venue_PixelArchitecture')

# Chibi silhouettes use stepped hair, eyes, cuffs and sneakers; hands attach to forearms.
def person(name,rootpos,shirt,skin,hair,pose=0,animated=False):
 root=empty(name,rootpos);parts=[]
 def b(n,p,s,c,parent=root):
  o=box(name+'_'+n,p,s,c,parent);parts.append(o);return o
 b('torso',(0,0,.86),(.46,.28,.50),shirt)
 b('hem',(0,-.01,.64),(.49,.30,.10),'white')
 head=empty(name+'_Head',(0,0,1.25),root)
 b('face',(0,0,.1),(.48,.38,.44),skin,head)
 b('hair',(0,.015,.34),(.53,.41,.14),hair,head)
 b('fringe',(-.14,-.19,.25),(.24,.07,.18),hair,head)
 for x in [-.27,.27]:b('ear',(x,0,.08),(.07,.16,.13),skin,head)
 for x in [-.105,.105]:b('eye',(x,-.199,.13),(.055,.025,.085),'black',head)
 b('nose',(0,-.225,.025),(.07,.065,.06),skin,head)
 b('smile',(0,-.21,-.045),(.105,.025,.024),'brown',head)
 joints=[]
 for side,x in [('L',-.29),('R',.29)]:
  arm=empty(name+'_Arm'+side,(x,0,1.03),root);joints.append(arm)
  b('sleeve'+side,(0,0,-.14 if animated else -.09),(.18,.25,.32 if animated else .23),shirt,arm)
  elbow=empty(name+'_Elbow'+side,(0,0,-.32 if animated else -.22),arm);joints.append(elbow)
  b('forearm'+side,(0,0,-.14 if animated else -.11),(.125,.15,.30 if animated else .24),skin,elbow)
  b('hand'+side,(0,-.02,-.34 if animated else -.25),(.16,.16,.13),skin,elbow)
  b('thumb'+side,(.07 if x<0 else -.07,-.055,-.30 if animated else -.21),(.06,.09,.10),skin,elbow)
  leg=empty(name+'_Leg'+side,(x*.5,0,.61),root);joints.append(leg)
  b('pants'+side,(0,0,-.20),(.17,.22,.4),'blue' if shirt!='blue' else 'purple',leg)
  b('shoe'+side,(0,-.06,-.44),(.22,.35,.12),'white',leg)
  b('sole'+side,(0,-.07,-.50),(.24,.37,.04),'pink' if shirt=='cyan' else 'gold',leg)
 if animated:
  for x in [-.30,.30]:b('headphone',(x,0,.15),(.12,.25,.25),'black',head);b('earlight',(x*1.17,-.01,.15),(.035,.17,.15),'cyan',head)
  b('headband',(0,.015,.46),(.62,.14,.08),'black',head)
  # DJ raised onto stage: record hand at z=1.9, with bent elbow and wrist.
  root.scale=(1.5,1.5,1.5)
  for frame in range(1,194,4):
   t=(frame-1)/24
   head.rotation_euler=(.07*math.sin(t*math.pi*4),.04*math.sin(t*math.pi/2),.06*math.sin(t*math.pi/2));head.keyframe_insert(data_path='rotation_euler',frame=frame)
   for side in ['L','R']:
    arm=bpy.data.objects[name+'_Arm'+side];elbow=bpy.data.objects[name+'_Elbow'+side]
    target=Vector(((-1.10+.035*math.sin(t*math.pi*4)) if side=='L' else .15,2.55 if side=='L' else 2.58,1.94))
    # A brief acknowledgement raises the mixer hand and returns by loop end.
    lift=max(0,math.sin((t-5)/2*math.pi)) if 5<t<7 else 0
    if side=='R':target.z+=lift*.60
    local=(target-Vector(rootpos))/1.5;shoulder=arm.location.copy();delta=local-shoulder;distance=min(.679,delta.length);direction=delta.normalized()
    along=(.32**2-.36**2+distance**2)/(2*distance);height=math.sqrt(max(0,.32**2-along**2));up=Vector((0,0,1));perp=(up-direction*up.dot(direction)).normalized();elbowpoint=shoulder+direction*along+perp*height
    qa=(elbowpoint-shoulder).to_track_quat('-Z','Y');qe=(local-elbowpoint).to_track_quat('-Z','Y')
    arm.rotation_mode='QUATERNION';arm.rotation_quaternion=qa;elbow.rotation_mode='QUATERNION';elbow.rotation_quaternion=qa.inverted()@qe
    arm.keyframe_insert(data_path='rotation_quaternion',frame=frame);elbow.keyframe_insert(data_path='rotation_quaternion',frame=frame)
  # Merge only rigid parts sharing a parent: preserve transform animation.
  groups=[(parent,[o for o in parts if o.parent==parent]) for parent in [root,head]+joints]
  for parent,objs in groups:
   if objs:merge(objs,parent.name+'_Mesh')
 else:
  phase=pose/8*math.tau;variant=int(name.split('_')[1])
  head.rotation_euler.x=.12*math.sin(phase)
  for j in joints:
   side=-1 if j.name.endswith('L') else 1
   if '_Arm' in j.name:j.rotation_euler=(.35*math.sin(phase+side),side*(.20+(.8 if variant==2 else .3)*max(0,math.sin(phase))),0)
   elif '_Elbow' in j.name:j.rotation_euler.x=-.35-.3*math.sin(phase+side)
   else:j.rotation_euler.x=.20*math.sin(phase)*side
  bpy.context.view_layer.update()
  for o in parts:
   world=o.matrix_world.copy();o.parent=None;o.matrix_world=world
  merged=merge(parts,name+'_Frame');bpy.context.scene.cursor.location=(0,0,0);bpy.ops.object.origin_set(type='ORIGIN_CURSOR')
  for o in [root,head]+joints:bpy.data.objects.remove(o,do_unlink=True)
  merged.hide_render=True
 return root
person('DJ',(0,3.15,.56),'pink','skin','black',animated=True)
for v,(shirt,skin,hair) in enumerate([('cyan','skin','black'),('gold','light','brown'),('mint','brown','black'),('pink','light','black')]):
 for pose in range(8):person(f'Dancer_{v}_{pose}',(0,0,0),shirt,skin,hair,pose)
# Supported transform channels for moving physical fixtures; browser recreates beams.
for i,x in enumerate([-5,-2.5,2.5,5]):
 lamp=empty('LightPivot_'+str(i),(x,3.5,4.7));cyl('lamp body',(0,0,0),.2,.4,'black',lamp,12);cyl('lamp lens',(0,0,-.22),.18,.04,'cyan' if i%2 else 'pink',lamp,12)
 for frame in range(1,194,8):
  lamp.rotation_euler.y=.45*math.sin((frame-1)/192*math.tau+i);lamp.keyframe_insert(data_path='rotation_euler',frame=frame)
for pos,power,color,size in [((0,-4,8),1800,(.5,.7,1),9),((0,3,7),1300,(1,.3,.6),7),((7,0,5),1000,(.2,1,1),6)]:
 bpy.ops.object.light_add(type='AREA',location=pos);o=bpy.context.object;o.data.energy=power;o.data.color=color;o.data.shape='DISK';o.data.size=size;o.rotation_euler=(Vector((0,1,1))-o.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add(location=(11,-18,15));cam=bpy.context.object;cam.rotation_euler=(Vector((0,.4,1))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=23;sc.camera=cam
# Preview instances, excluded from GLB export; runtime controls exact display count.
for i in range(150):
 src=bpy.data.objects[f'Dancer_{i%4}_{i%8}_Frame'];o=bpy.data.objects.new('PreviewGuest_'+str(i),src.data);sc.collection.objects.link(o);o.location=(-6.8+(i%15)*.92,-6.7+(i//15)*.82,.06);o.scale=(.48,.48,.48)
sc.frame_set(1)
(R/'assets').mkdir(exist_ok=True);(R/'public/models').mkdir(exist_ok=True);(R/'docs/evidence/addendum03').mkdir(parents=True,exist_ok=True)
bpy.ops.wm.save_as_mainfile(filepath=str(R/'assets/concert.blend'))
sc.render.filepath=str(R/'docs/evidence/addendum03/blender-preview.png');bpy.ops.render.render(write_still=True)
bpy.ops.object.select_all(action='DESELECT')
for o in sc.objects:
 if not o.name.startswith('PreviewGuest') and o.type not in ['LIGHT','CAMERA']:o.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(R/'public/models/concert.glb'),export_format='GLB',use_selection=True,export_animations=True,export_animation_mode='SCENE',export_frame_range=True,export_force_sampling=True,export_materials='EXPORT',export_cameras=False,export_lights=False)
print('PIXEL CONCERT EXPORT COMPLETE', (R/'public/models/concert.glb').stat().st_size)
