import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
const files=execFileSync('git',['ls-files','-z'],{encoding:'utf8'}).split('\0').filter(Boolean);
const secrets=Object.entries(process.env).filter(([key,value])=>/KEY|SECRET|TOKEN/.test(key)&&value.length>12).map(([,value])=>value);
let failures=[];
for(const file of files){
  if(file==='.env'||file.startsWith('.local/'))failures.push(file);
  const content=readFileSync(file).toString('utf8');
  if(secrets.some(value=>content.includes(value))||/sk-proj-[A-Za-z0-9_-]{30,}|ghp_[A-Za-z0-9]{30,}/.test(content))failures.push(file);
}
if(failures.length){console.error('Potential secrets in:',[...new Set(failures)].join(', '));process.exit(1);}
console.log(`PASS: ${files.length} staged/tracked files contain no configured API secrets.`);
