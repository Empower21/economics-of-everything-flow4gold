"""Standalone Blender dashboard. Does not modify the approved concert assets."""
import bpy, math
from pathlib import Path
from mathutils import Vector
R=Path(__file__).resolve().parents[1]
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
sc=bpy.context.scene;sc.render.engine='CYCLES';sc.cycles.samples=16;sc.view_settings.view_transform='Standard'
sc.render.resolution_x=768;sc.render.resolution_y=440;sc.render.resolution_percentage=100
colors={'body':'353b61','edge':'1b203b','top':'505b87','black':'080d19','silver':'dce9e5','white':'ffffff','cyan':'59efd7','gold':'ffbc52','pink':'e184d8'};mats={}
for name,h in colors.items():
 c=tuple(int(h[i:i+2],16)/255 for i in (0,2,4));m=bpy.data.materials.new(name);m.diffuse_color=(*c,1);m.use_nodes=True;m.node_tree.nodes.get('Principled BSDF').inputs['Base Color'].default_value=(*c,1);m.node_tree.nodes.get('Principled BSDF').inputs['Roughness'].default_value=.9;mats[name]=m
def box(name,p,size,c,parent=None):
 bpy.ops.mesh.primitive_cube_add(size=1,location=p);o=bpy.context.object;o.name=name;o.dimensions=size;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(mats[c]);o.parent=parent;return o
def disc(name,x,z,r,h,c,parent=None):
 bpy.ops.mesh.primitive_cylinder_add(vertices=24,radius=r,depth=h,location=(x,0,z));o=bpy.context.object;o.name=name;o.data.materials.append(mats[c]);o.parent=parent;return o
box('DeckCase',(0,0,0),(9.4,4.5,.55),'body');box('Surface',(0,0,.31),(9.2,4.3,.08),'top')
for i in range(31):box('PixelRib',(-4.5+i*.3,-2.31,-.05),(.10,.15,.38),'edge')
for x,name,col in [(-2.9,'DeckRecordLeft','cyan'),(2.9,'DeckRecordRight','pink')]:
 disc('Platter',x,.46,1.65,.17,'silver');o=bpy.data.objects.new(name,None);sc.collection.objects.link(o);o.location=(x,0,0)
 disc('Vinyl',0,.59,1.45,.08,'black',o);disc('Label',0,.65,.47,.03,col,o);box('LabelStripe',(.6,0,.68),(.50,.14,.03),'white',o);box('Spindle',(0,0,.70),(.12,.12,.1),'silver',o)
 box('ArmBase',(x+1.15,1.45,.6),(.45,.45,.45),'edge');box('ArmHinge',(x+1.15,1.45,.86),(.28,.28,.13),'silver');arm=box('Tonearm',(x+.75,.7,.83),(.12,1.9,.12),'silver');arm.rotation_euler.z=-.42;box('Cartridge',(x+.35,-.12,.76),(.27,.48,.2),'black')
 for i,c in enumerate(['cyan','gold','pink']):box('CuePad',(x-1+i*.48,-1.83,.43),(.35,.25,.12),c)
for x in [-.65,0,.65]:
 box('FaderTrack',(x,-.3,.40),(.15,1.75,.03),'black');box('DeckFader'+str(x),(x,x,.5),(.4,.22,.16),'gold' if x==0 else 'silver')
 for y in [.9,1.3,1.7]:box('Dial',(x,y,.53),(.23,.23,.27),'edge')
for i in range(8):box('Meter'+str(i),(-.7+i*.2,-1.65,.42),(.12,.25,.05),'gold' if i>5 else 'cyan')
sc.world.color=(.10,.12,.18)
bpy.ops.object.camera_add(location=(5,-10,10));camera=bpy.context.object;camera.rotation_euler=(Vector((0,0,.1))-camera.location).to_track_quat('-Z','Y').to_euler();camera.data.type='ORTHO';camera.data.ortho_scale=12;sc.camera=camera
bpy.ops.object.light_add(type='AREA',location=(-4,-4,10));bpy.context.object.data.energy=1500;bpy.context.object.data.size=7
bpy.ops.wm.save_as_mainfile(filepath=str(R/'assets/control-deck.blend'))
bpy.ops.export_scene.gltf(filepath=str(R/'public/models/control-deck.glb'),export_format='GLB',export_cameras=False,export_lights=False)
sc.render.filepath=str(R/'.local/control-deck-preview.png');bpy.ops.render.render(write_still=True)
