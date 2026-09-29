import bpy, math, runpy
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
helpers=runpy.run_path(str(ROOT/'scripts'/'create-venue.py'))
box=helpers['box']; cyl=helpers['cyl']; ball=helpers['ball']; material=helpers['material']

def palette():
    return [material('Deep teal',(.025,.22,.23)),material('Electric coral',(.97,.25,.16)),material('Honey',(.98,.66,.10)),material('Indigo',(.20,.20,.55)),material('Soft ivory',(.94,.91,.78)),material('Pool turquoise',(.10,.7,.65)),material('Grass',(.45,.68,.32)),material('Charcoal',(.03,.05,.08))]
def person(name,x,y,mat,cream,black):
    parts=[cyl('torso',(x,y,.53),.13,.43,mat),ball('head',(x,y,.89),.15,cream)]
    for dx in [-.07,.07]:parts.append(cyl('leg',(x+dx,y,.2),.043,.30,black,8))
    for dx in [-.20,.20]:parts.append(cyl('arm',(x+dx,y,.5),.04,.35,mat,8))
    bpy.ops.object.select_all(action='DESELECT')
    for o in parts:o.select_set(True)
    bpy.context.view_layer.objects.active=parts[0];bpy.ops.object.join();bpy.context.object.name=name
def save(name):
    bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'assets'/f'{name}.blend'))
    bpy.ops.export_scene.gltf(filepath=str(ROOT/'public'/'models'/f'{name}.glb'),export_format='GLB',export_apply=True,export_animations=False)
def clear():
    bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)

# Enhance concert silhouette and color while retaining the original scene.
p=palette()
for o in list(bpy.data.objects):
    if o.name.startswith('Audience_'):bpy.data.objects.remove(o,do_unlink=True)
for i in range(60):
    x=-2.8+(i%10)*.61;y=.15-(i//10)*.61
    person(f'Audience_{i:02d}',x,y,p[1+i%5],p[4],p[7])
for side in [-1,1]:
    for row in range(3):
        box('Expansion_'+str(side)+'_'+str(row),(side*(6.6+row*.7),.4,.3+row*.25),(.65,7,.4+row*.35),p[3 if row%2 else 5])
for x in [-2,0,2]:
    o=cyl('Stage spotlight',(x,1.6,3.7),.22,.35,p[2]);o.rotation_euler[0]=.3
save('concert')

clear();p=palette()
box('Conference foundation',(0,0,-.3),(15,11,.6),p[4],.3)
box('Registration desk',(-5,-3,.6),(2.4,1.1,1.2),p[1]);box('Registration sign',(-5,-3,1.8),(2.5,.18,.8),p[0])
box('Speakers stage',(-3.9,3,.35),(5,3,.7),p[3]);box('Speakers screen',(-3.9,4.3,2.3),(4.8,.16,3),p[0]);box('Speakers podium',(-3.9,3,1),(1,.6,1.3),p[1])
person('Speaker',-3.9,3.4,p[2],p[4],p[7])
box('Workshop floor',(3.3,2.8,.02),(5.5,4,.1),p[5]);box('Workshop board',(3.3,4.5,1.5),(4,.15,2),p[3])
for i in range(24):
    x=1.3+(i%6)*.8;y=1.2+(i//6)*.8
    box(f'WorkshopSeat_{i:02d}',(x,y,.35),(.42,.42,.6),p[2])
    person(f'WorkshopPerson_{i:02d}',x,y,p[1+i%5],p[4],p[7])
box('Networking floor',(2,-2.5,.02),(5.5,3.3,.12),p[2])
for x,y in [(0,-2),(2,-3),(4,-2)]:
    cyl('Networking table',(x,y,.65),.52,.12,p[4]);cyl('Networking leg',(x,y,.3),.06,.6,p[0])
box('Catering counter',(6,-2,.6),(1.5,4,1.2),p[0])
for y in [-3,-2,-1]:cyl('Catering plate',(6,y,1.24),.22,.035,p[2])
for i in range(18):
    person(f'Walker_{i:02d}',-4.5+(i%6)*1.35,-.9-(i//6)*.8,p[1+i%5],p[4],p[7])
for i in range(12):person(f'Queue_{i:02d}',.2-i*.37,.2,p[1+i%5],p[4],p[7])
save('conference')

clear();p=palette()
box('Factory foundation',(0,0,-.3),(16,11,.6),p[4],.3)
box('Assembly conveyor',(0,0,.5),(13,2,.8),p[7]);box('Assembly belt',(0,0,.94),(13,1.8,.08),p[3])
for i in range(24):cyl('Assembly roller',(-6+i*.52,0,.65),.08,1.95,p[5]).rotation_euler[0]=math.pi/2
for i in range(4):
    parts=[];x=-4.8+i*3.0
    parts.append(box('body',(x,0,1.35),(2,1.05,.45),p[1 if i%2==0 else 5],.18))
    parts.append(box('cabin',(x-.15,0,1.75),(1,1,.5),p[3],.12))
    for dx in [-.65,.65]:
        for y in [-.6,.6]:
            wheel=cyl('wheel',(x+dx,y,1.2),.22,.16,p[7]);wheel.rotation_euler[0]=math.pi/2;parts.append(wheel)
    bpy.ops.object.select_all(action='DESELECT')
    for o in parts:o.select_set(True)
    bpy.context.view_layer.objects.active=parts[0];bpy.ops.object.join();bpy.context.object.name=f'Car_{i:02d}'
box('Components rack',(-2,3,.55),(4,1.5,1.1),p[0])
for i in range(20):box(f'Part_{i:02d}',(-3.4+(i%5)*.68,2.6+(i//5)*.32,1.22),(.4,.2,.2),p[2],.04)
box('Assembly gantry',(1,0,3.15),(.45,3.6,.35),p[2])
for y in [-1.7,1.7]:box('Assembly support',(1,y,1.7),(.3,.3,3),p[2])
box('Assembly robot arm',(1,0,2.5),(.18,.2,1),p[1])
truck=[]
truck.append(box('cab',(-5,3,1),(1.3,1.3,1.5),p[1]));truck.append(box('trailer',(-5,1.5,1),(1.4,2,1.5),p[0]))
for y in [1,2.1,3.2]:
    for x in [-5.75,-4.25]:
        o=cyl('wheel',(x,y,.5),.3,.18,p[7]);o.rotation_euler[1]=math.pi/2;truck.append(o)
bpy.ops.object.select_all(action='DESELECT')
for o in truck:o.select_set(True)
bpy.context.view_layer.objects.active=truck[0];bpy.ops.object.join();bpy.context.object.name='SupplierTruck'
box('Finished loading bay',(5,3,.04),(3,3,.12),p[5])
for i in range(6):person(f'Worker_{i:02d}',-4+i*1.5,-2.3,p[2],p[4],p[7])
save('factory')
