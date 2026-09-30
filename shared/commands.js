export function parseCommand(text,lessonId,language='en'){
  const q=text.toLowerCase().trim();if(!/^(please\s+|bitte\s+)?(set|make|change|increase|reduce|put|setze|ändere|erhöhe|senke)\b/.test(q))return null;
  const slots=lessonId==='concert-economics'?[[/capacity|venue|seats|places|kapazität|plätze|saal/,'capacity'],[/demand|interest|nachfrage/,'demand'],[/ticket|price|preis/,'ticketPrice']]:lessonId==='conference-economics'?[[/workshop/,'workshopSeats'],[/attendees|gäste|teilnehm/,'expectedAttendees'],[/sponsor/,'sponsor'],[/ticket|preis/,'ticketPrice']]:[[/stock|inventory|bestand/,'openingInventory'],[/delay|verzug/,'supplierDelay'],[/target|ziel/,'target']];
  const matches=slots.filter(([pattern])=>pattern.test(q));const field=matches[0]?.[1];if(!field)return null;
  if(matches.length>1||/\b(by|um)\b/.test(q))return {field,clarification:true};
  const words={'one hundred thousand':100000,'twenty thousand':20000,'five thousand':5000,'one thousand':1000,'two hundred':200,'one hundred':100,'fifty':50,'twenty':20,'thirty':30,'zero':0,'tausend':1000,'zweihundert':200,'hundert':100,'zwanzig':20,'dreißig':30,'null':0};
  const numeric=q.match(/[+-]?\d[\d,.]*/);let value;
  if(numeric){if(new Set(q.match(/[+-]?\d[\d,.]*/g)).size>1)return {field,clarification:true};value=Number(language==='de'?numeric[0].replace(/\./g,'').replace(',','.'):numeric[0].replace(/,/g,''));}
  else for(const [phrase,n] of Object.entries(words))if(q.includes(phrase)){value=n;break;}
  return Number.isFinite(value)?{field,value}:{field,clarification:true};
}
