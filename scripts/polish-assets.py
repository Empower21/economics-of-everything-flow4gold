"""Small placement corrections, reusable without rebuilding character geometry."""
import bpy
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
for kind in ['concert']:
    bpy.ops.wm.open_mainfile(filepath=str(ROOT/'assets'/f'{kind}.blend'))
    if kind=='concert':
        bpy.data.objects['DJ'].location.y=3.10
    bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'assets'/f'{kind}.blend'))
    bpy.ops.export_scene.gltf(filepath=str(ROOT/'public/models'/f'{kind}.glb'),export_format='GLB',export_apply=True,export_animations=False,export_extras=True)
