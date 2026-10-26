// Structured output of one OpenAI Responses API call, shared by the coach and research branches.
// The raw API returns output_text.text as a JSON string; the native n8n OpenAI node (json_schema
// format, Simplify Output off) parses it into an object first. Both shapes are accepted.
export function outputJson(response){
  if(!response||response.status!=='completed'||!Array.isArray(response.output))return null;
  const parts=response.output.flatMap(o=>o.content||[]).filter(c=>c.type==='output_text');
  if(!parts.length)return null;
  if(parts.length===1&&parts[0].text&&typeof parts[0].text==='object')return parts[0].text;
  return JSON.parse(parts.map(c=>typeof c.text==='string'?c.text:JSON.stringify(c.text)).join(''));
}
