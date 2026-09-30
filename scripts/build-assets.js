import {spawn} from 'node:child_process';
import {homedir} from 'node:os';
import {existsSync} from 'node:fs';
import {join} from 'node:path';
const executable=process.env.BLENDER_EXE||join(homedir(),'blender-5.2.2-windows-x64','blender.exe');
if(!existsSync(executable))throw new Error('Set BLENDER_EXE to your Blender 5.2.2 executable.');
const child=spawn(executable,['--background','--python','scripts/create-worlds.py'],{stdio:'inherit',windowsHide:true});
child.on('exit',code=>process.exit(code||0));
