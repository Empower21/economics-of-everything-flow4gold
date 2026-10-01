import {execFileSync} from 'node:child_process';
for(const args of [['scripts/build-workflow.js'],['scripts/build-events-workflow.js'],['scripts/consolidate-workflows.js','--from-source']])execFileSync(process.execPath,args,{stdio:'inherit'});
console.log('One sanitized production export: workflow/economics-concert.json');
