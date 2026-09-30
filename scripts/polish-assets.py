"""Small placement corrections, reusable without rebuilding character geometry."""
import bpy
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
for kind in ['concert','conference','factory']:
    bpy.ops.wm.open_mainfile(filepath=str(ROOT/'assets'/f'{kind}.blend'))
    if kind=='concert':
        bpy.data.objects['DJ'].location.y=3.10
    elif kind=='conference':
        for o in list(bpy.data.objects):
            if o.name.startswith('WorkshopSeat_'):bpy.data.objects.remove(o,do_unlink=True)
        material=bpy.data.materials.get('Honey') or bpy.data.materials.get('Safety ochre')
        for i in range(12):
            x=1.5+i%4*1.16;y=1.4+i//4*1.05;parts=[]
            for pos,size in [((x,y,.54),(.44,.40,.075)),((x,y+.18,.74),(.44,.06,.40)),((x-.16,y,.25),(.04,.30,.5)),((x+.16,y,.25),(.04,.30,.5))]:
                bpy.ops.mesh.primitive_cube_add(size=1,location=pos);o=bpy.context.object;o.dimensions=size;o.data.materials.append(material);parts.append(o)
            bpy.ops.object.select_all(action='DESELECT')
            for o in parts:o.select_set(True)
            bpy.context.view_layer.objects.active=parts[0];bpy.ops.object.join();bpy.context.object.name=f'WorkshopSeat_{i:02d}'
    else:
        import math
        def material(name,c):
            m=bpy.data.materials.new(name);m.diffuse_color=(*c,1);m.use_nodes=True;m.node_tree.nodes.get('Principled BSDF').inputs['Base Color'].default_value=(*c,1);return m
        glass=material('Light blue automotive glazing',(.24,.56,.64));alloy=material('Wheel alloy',(.58,.64,.64));rubber=material('Tire rubber',(.02,.03,.04));lamp=material('Headlamp lenses',(.94,.90,.69));red=material('Tail lamps',(.70,.04,.02));paints=[material('Burnt orange paint',(.76,.24,.10)),material('Petrol teal paint',(.03,.40,.40))]
        for o in list(bpy.data.objects):
            if o.name.startswith(('Car_','CarDetail_')):bpy.data.objects.remove(o,do_unlink=True)
        def surface(name,verts,faces,mat):
            data=bpy.data.meshes.new(name);data.from_pydata(verts,[],faces);data.materials.append(mat);o=bpy.data.objects.new(name,data);bpy.context.collection.objects.link(o);return o
        def block(pos,size,mat):
            bpy.ops.mesh.primitive_cube_add(size=1,location=pos);o=bpy.context.object;o.dimensions=size;o.data.materials.append(mat);return o
        for i in range(4):
            profile=[(-1.2,1.20),(-1.15,1.48),(-.72,1.62),(-.47,2.02),(.42,2.04),(.80,1.64),(1.20,1.51),(1.25,1.22)];n=len(profile)
            verts=[(x,y,z) for y in [-.55,.55] for x,z in profile];faces=[tuple(range(n-1,-1,-1)),tuple(range(n,2*n))]+[(j,(j+1)%n,(j+1)%n+n,j+n) for j in range(n)]
            parts=[surface('Vehicle shaped body',verts,faces,paints[i%2])]
            for sign in [-1,1]:
                y=sign*.558
                for points in [[(-.42,y,1.94),(-.57,y,1.69),(-.08,y,1.69),(-.08,y,1.96)],[(-.01,y,1.96),(-.01,y,1.69),(.67,y,1.69),(.35,y,1.96)]]:parts.append(surface('Side window',points,[(0,1,2,3)],glass))
                for x in [-.80,.83]:
                    bpy.ops.mesh.primitive_cylinder_add(vertices=20,radius=.27,depth=.16,location=(x,sign*.59,1.20),rotation=(math.pi/2,0,0));o=bpy.context.object;o.data.materials.append(rubber);parts.append(o)
                    bpy.ops.mesh.primitive_cylinder_add(vertices=12,radius=.135,depth=.175,location=(x,sign*.60,1.20),rotation=(math.pi/2,0,0));o=bpy.context.object;o.data.materials.append(alloy);parts.append(o)
                parts.append(block((1.217,sign*.37,1.45),(.03,.24,.095),lamp));parts.append(block((-1.18,sign*.38,1.42),(.03,.20,.08),red))
                parts.append(block((.2,sign*.568,1.62),(.14,.027,.022),alloy))
            parts.append(surface('Windshield',[(.455,-.46,2.014),(.455,.46,2.014),(.767,.47,1.676),(.767,-.47,1.676)],[(0,1,2,3)],glass))
            parts.append(block((1.235,0,1.29),(.04,.72,.055),alloy));parts.append(block((1.249,0,1.37),(.02,.37,.07),rubber))
            bpy.ops.object.select_all(action='DESELECT')
            for o in parts:o.select_set(True)
            bpy.context.view_layer.objects.active=parts[0];bpy.ops.object.join();o=bpy.context.object;o.name=f'Car_{i:02d}';o.location.x=-4.8+i*3
    bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'assets'/f'{kind}.blend'))
    bpy.ops.export_scene.gltf(filepath=str(ROOT/'public/models'/f'{kind}.glb'),export_format='GLB',export_apply=True,export_animations=False,export_extras=True)
