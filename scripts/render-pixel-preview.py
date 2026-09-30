import bpy,math
from pathlib import Path
R=Path(__file__).resolve().parents[1]
bpy.ops.wm.open_mainfile(filepath=str(R/'assets/concert.blend'))
s=bpy.context.scene;s.cycles.samples=8;s.render.resolution_x=480;s.render.resolution_y=270
out=R/'.local/pixel-loop';out.mkdir(parents=True,exist_ok=True)
for i,frame in enumerate(range(1,194,8)):
 s.frame_set(frame)
 for o in s.objects:
  if o.name.startswith('PreviewGuest_'):
   n=int(o.name.split('_')[1]);o.data=bpy.data.objects[f'Dancer_{n%4}_{(i+n)%8}_Frame'].data
 s.render.filepath=str(out/f'{i:03}.png');bpy.ops.render.render(write_still=True)
