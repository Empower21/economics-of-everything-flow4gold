export const CITIES={
 'atlanta-us':{name:'Atlanta, Georgia, USA',country:'US',timezone:'America/New_York'},
 'berlin-de':{name:'Berlin, Germany',country:'DE',timezone:'Europe/Berlin'},
 'kingston-jm':{name:'Kingston, Jamaica',country:'JM',timezone:'America/Jamaica'}
};
export const PLAN_DEFAULTS={cityId:'atlanta-us',localStartDate:'',localEndDate:'',localStartTime:null,localEndTime:null,category:'music',dateScope:'same_day',dataMode:'simulation'};
export function validDate(s){return typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&s>='2020-01-01'&&s<='2100-12-31'&&Number.isFinite(Date.parse(s))&&new Date(s).toISOString().slice(0,10)===s;}
export function shiftDate(s,n){return new Date(Date.parse(s)+n*86400000).toISOString().slice(0,10);}
export function localInstant(date,time,zone){
 if(!validDate(date)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(time))throw new Error('Choose a valid local date and time.');
 const target=Date.parse(date+'T'+time+':00Z');
 const fmt=new Intl.DateTimeFormat('en-CA',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
 const wall=ms=>{const p=Object.fromEntries(fmt.formatToParts(ms).map(x=>[x.type,x.value]));return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;};
 const offsets=new Set();for(let h=-36;h<=36;h+=6){const ms=target+h*3600000;offsets.add(Date.parse(wall(ms)+':00Z')-ms);}
 const matches=[...offsets].map(o=>target-o).filter(ms=>wall(ms)===date+'T'+time);
 if(matches.length!==1)throw new Error(matches.length?'This local time occurs twice during the clock change. Choose an unambiguous time.':'This local time does not exist during the clock change. Choose another time.');
 return new Date(matches[0]).toISOString();
}
export function validatePlan(v){
 if(!v||!Object.hasOwn(CITIES,v.cityId))throw new Error('Choose Atlanta, Berlin or Kingston.');
 if(!validDate(v.localStartDate))throw new Error('Choose a valid concert date.');
 const dataMode=v.dataMode??'simulation';if(!['simulation','live'].includes(dataMode))throw new Error('Invalid listing mode.');
 const category=v.category??'music',dateScope=v.dateScope??'same_day';if(!['music','all'].includes(category)||!['same_day','nearby'].includes(dateScope))throw new Error('Invalid search filter.');
 const timeZone=CITIES[v.cityId].timezone,start=v.localStartTime||null,end=v.localEndTime||null;
 const endDate=v.localEndDate||v.localStartDate;let startUtc,endUtc;
 if(!validDate(endDate))throw new Error('Choose a valid end date.');
 if(!start&&end)throw new Error('Enter a start time before an end time.');
 startUtc=localInstant(v.localStartDate,start||'00:00',timeZone);
 endUtc=start?localInstant(endDate,end||'23:59',timeZone):localInstant(shiftDate(endDate,1),'00:00',timeZone);
 if(endUtc<=startUtc||Date.parse(endUtc)-Date.parse(startUtc)>7*86400000)throw new Error('End must follow start within seven days. For overnight events, select the next date.');
 return {dataMode,cityId:v.cityId,timeZone,localStartDate:v.localStartDate,localEndDate:endDate,localStartTime:start,localEndTime:end,startUtc,endUtc,category,dateScope,language:v.language==='de'?'de':'en'};
}
export function queryKey(p){return JSON.stringify([p.cityId,p.dataMode,p.startUtc,p.endUtc,p.category,p.dateScope,p.language]);}
export function eventEnvelope(v){
 if(v?.schemaVersion!=='concert-events-v1'||typeof v.requestId!=='string'||!/^[\w-]{8,80}$/.test(v.requestId)||!Number.isInteger(v.planningRevision)||v.planningRevision<0)throw new Error('Invalid research request.');
 const p=validatePlan(v);return {...p,schemaVersion:'concert-events-v1',requestId:v.requestId,planningRevision:v.planningRevision,queryKey:queryKey(p)};
}
export function breakEven(s){const c=n=>Math.round(n*100),fixed=c(s.productionBudget)+c(s.venueRate)*s.capacity+c(s.promotionBudget)-c(s.sponsorship),margin=c(s.ticketPrice)-c(s.perGuest);return {guests:margin>0?Math.max(0,Math.ceil(fixed/margin)):null,margin,fixed,covered:fixed<=0,capacity:s.capacity};}
