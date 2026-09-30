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
