export const INTENT_THRESHOLD=.80;
export const INTENT_CHOICES={ticket_price:'Ticket price, demand response and ticket revenue',audience_capacity:'Audience size, occupancy and capacity limits',costs:'Production, venue, per-guest or promotion costs',profit_roi:'Profit, loss and return on event costs',location:'Fictional venue setup assumptions',local_events:'City, date planning and competing events; use only supplied trusted research context',compare_scenarios:'Compare current and saved scenarios',unclear_or_other:'Unclear, unrelated or requests real-world information absent from the simulation'};
export function routeIntent(output,threshold=.80){
 const answer=output?.answers?.intent;const confidence=answer?.confidence;
 if(typeof threshold!=='number'||threshold<0||threshold>1)throw new Error('Invalid intent threshold');
 return {unavailable:!answer,explain:!!answer&&Object.hasOwn(INTENT_CHOICES,answer.choice)&&answer.choice!=='unclear_or_other'&&typeof confidence==='number'&&confidence>=threshold&&confidence<=1,intent:answer?.choice||'unclear_or_other',confidence:typeof confidence==='number'?confidence:0,model:typeof output?.model==='string'?output.model:null};
}
