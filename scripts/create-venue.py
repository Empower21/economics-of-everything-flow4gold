"""Original low-poly concert diorama. Run with Blender --background --python this_file."""
import bpy, math, os
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

def material(name, color, metallic=0, roughness=.65, glow=0):
    m=bpy.data.materials.new(name); m.diffuse_color=(*color,1); m.use_nodes=True
    p=m.node_tree.nodes.get('Principled BSDF'); p.inputs['Base Color'].default_value=(*color,1)
    p.inputs['Metallic'].default_value=metallic; p.inputs['Roughness'].default_value=roughness
    if glow:
        p.inputs['Emission Color'].default_value=(*color,1); p.inputs['Emission Strength'].default_value=glow
    return m
sage=material('Sage island',(.35,.52,.40)); cream=material('Ivory',(.89,.84,.69)); dark=material('Forest',(.025,.12,.10))
mint=material('Mint',(.60,.88,.48)); gold=material('Warm brass',(.93,.65,.22),.35); coral=material('Coral',(.9,.29,.20)); black=material('Speaker charcoal',(.035,.047,.043))
wood=material('Stage wood',(.40,.23,.13)); light=material('Warm light',(1,.81,.38),glow=1.5); pink=material('Rose',(.70,.28,.41))

def box(name, pos, size, mat, bevel=.06):
    bpy.ops.mesh.primitive_cube_add(size=1, location=pos); o=bpy.context.object; o.name=name; o.dimensions=size
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    o.data.materials.append(mat)
    if bevel:
        mod=o.modifiers.new('Soft crafted edges','BEVEL'); mod.width=bevel; mod.segments=2
        bpy.context.view_layer.objects.active=o; bpy.ops.object.modifier_apply(modifier=mod.name)
        o.modifiers.new('Weighted normals','WEIGHTED_NORMAL')
    return o
def cyl(name,pos,radius,depth,mat,vertices=12):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices,radius=radius,depth=depth,location=pos)
    o=bpy.context.object; o.name=name; o.data.materials.append(mat); return o
def ball(name,pos,radius,mat):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1,radius=radius,location=pos)
    o=bpy.context.object; o.name=name; o.data.materials.append(mat); return o

box('Island',(0,0,-.32),(12,10,.65),sage,.32)
box('Island rim',(0,0,-.6),(11.75,9.75,.14),dark,.2)
box('Stage',(0,2.6,.45),(6.6,3.3,.8),wood)
box('Stage edge',(0,.94,.75),(6.65,.1,.15),gold,.03)
box('Stage backdrop',(0,4.13,1.9),(6.4,.16,2.6),dark)
for x in [-3.15,3.15]:
    cyl('Stage truss',(x,2.7,2.5),.065,4.2,dark)
    box('Stage speaker',(x,.98,1.65),(.6,.58,1.7),black)
    for z in [1.15,1.72,2.22]:
        o=cyl('Speaker cone',(x,.66,z),.21,.05,dark); o.rotation_euler[0]=math.pi/2
box('Stage canopy',(0,2.8,4.57),(7.25,3.95,.22),mint,.12)
for x in [-2.4,-1.2,0,1.2,2.4]:
    cyl('Stage downlight',(x,1.35,4.32),.16,.20,light)
for i,h in enumerate([.45,.8,1.3,1.8,1.15,.8,1.45,1.9,1.2,.65,.4]):
    box('Stage equalizer',(-2.15+i*.43,4.0,1.65+h/2),(.20,.07,h),mint,.03)
box('Stage DJ desk',(0,2.6,1.35),(2.1,.85,.75),cream)
for x in [-.5,.5]: cyl('Stage turntable',(x,2.6,1.77),.25,.04,black,24)
box('DJ torso',(0,3.2,1.8),(.48,.32,.65),coral)
ball('DJ head',(0,3.2,2.35),.24,gold)

# Entrance at the near right corner, with a paper ticket motif rather than baked text.
for x in [3.5,5.2]: box('Entrance post',(x,-2.9,1.1),(.18,.2,2.25),dark)
box('Entrance arch',(4.35,-2.9,2.35),(2.1,.3,.45),coral)
box('Entrance ticket booth',(4.4,-1.2,.65),(1.4,1.2,1.3),cream)
box('Entrance booth roof',(4.4,-1.2,1.4),(1.7,1.4,.15),coral)
box('Entrance window',(4.4,-1.82,.95),(.8,.035,.4),dark,.02)
for y in [-4,-3.5,-2,-1.4,-.8]: box('Path',(3.8,y,.03),(.6,.36,.08),cream,.04)

# Each named person represents five attendees. Runtime visibility follows the shared formula.
clothes=[mint,coral,cream,pink,gold,dark]
for i in range(40):
    col=i%8; row=i//8; x=-2.75+col*.73; y=-.02-row*.72
    x+=.10*math.sin(i*4); y+=.06*math.cos(i*3)
    parts=[]
    parts.append(cyl('body',(x,y,.50),.115,.42,clothes[i%len(clothes)],8))
    parts.append(ball('head',(x,y,.86),.145,cream if i%3 else gold))
    for dx in [-.055,.055]: parts.append(cyl('leg',(x+dx,y,.20),.04,.29,black,6))
    bpy.ops.object.select_all(action='DESELECT')
    for o in parts: o.select_set(True)
    bpy.context.view_layer.objects.active=parts[0]; bpy.ops.object.join(); bpy.context.object.name=f'Audience_{i:02d}'

for x,y in [(-4.7,3.5),(-4.7,-3.5),(4.7,3.2),(-4.65,.1)]:
    cyl('Tree trunk',(x,y,.65),.12,1.3,wood)
    ball('Tree crown',(x,y,1.65),.68,mint if y>0 else dark)
for y in [-3,-1.8]: box('Bench',(-4.0,y,.45),(.6,1,.15),wood)
for x in [-5.4,5.4]:
    cyl('Lamp post',(x,1.0,1.5),.04,3,dark)
    ball('Lamp',(x,1,3.05),.18,light)

(ROOT/'assets').mkdir(exist_ok=True)
(ROOT/'public'/'models').mkdir(parents=True,exist_ok=True)
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'assets'/'concert.blend'))
bpy.ops.export_scene.gltf(filepath=str(ROOT/'public'/'models'/'concert.glb'),export_format='GLB',export_apply=True,export_animations=False)
print('Original concert exported to public/models/concert.glb')
