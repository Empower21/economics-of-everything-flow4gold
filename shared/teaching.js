import {LESSONS,calculateScenario} from './registry.js';

// Presentation metadata shares stable keys and validation bounds with the calculator.
// [English label, German label, unit EN, unit DE, group, help EN, help DE]
const content={concert:{
 ticketPrice:['Ticket price per person','Ticketpreis pro Person','CU / person','GE / Person','primary','How much one guest pays to enter.','So viel zahlt ein Gast für den Eintritt.'],
 capacity:['How many people the venue can hold','Wie viele Personen in den Saal passen','people','Personen','primary','Empty places earn no ticket money. More space does not create buyers.','Leere Plätze bringen keine Einnahmen. Mehr Platz schafft keine Nachfrage.'],
 demand:['People willing to buy at 20 CU','Kaufbereite Personen bei 20 GE','people','Personen','audience','20 CU is the fixed reference price, not your current ticket price.','20 GE ist der feste Bezugspreis, nicht dein aktueller Ticketpreis.'],
 elasticity:['How strongly price affects demand','Wie stark der Preis die Nachfrage beeinflusst','parameter','Parameter','audience','Teaching assumptions: Low 0.5 · Medium 1 · High 2. At 0, price has no effect.','Lernannahmen: niedrig 0,5 · mittel 1 · hoch 2. Bei 0 hat der Preis keinen Einfluss.'],
 productionBudget:['Stage, DJ and production costs','Kosten für Bühne, DJ und Technik','CU total','GE gesamt','costs','Fixed cost for performers, stage and sound; excludes venue hire and guest services.','Fixkosten für Künstler, Bühne und Ton; ohne Saalmiete und Leistungen pro Gast.'],
 venueRate:['Venue hire per place of capacity','Saalmiete je verfügbarem Platz','CU / place','GE / Platz','costs','Charged for every available place, even if it stays empty.','Wird für jeden verfügbaren Platz berechnet, auch wenn er leer bleibt.'],
 perGuest:['Extra cost for each guest attending','Zusatzkosten pro anwesendem Gast','CU / guest','GE / Gast','costs','Illustrative guest supplies and services; only charged for attendees.','Beispielhafte Materialien und Leistungen; nur für anwesende Gäste.']}};
export function fieldContent(id,key,lang='en'){
 const l=LESSONS[id],row=l.fields.find(r=>r[0]===key),v=content[l.scene][key],de=lang==='de';
 return {key,label:v[de?1:0],unit:v[de?3:2],group:v[4],help:v[de?6:5],min:row[3],max:row[4],step:row[5]};
}
export function setupText(id,s,lang){
 const de=lang==='de',f=n=>new Intl.NumberFormat(de?'de-DE':'en-US').format(n);
 return de?'Du planst ein Konzert. Tickets bringen Geld ein; Saal, Bühne und Gäste verursachen Kosten. Ändere den Preis und beobachte Gästezahl und Gewinn.':'You are planning a live music event. Tickets bring money in; the venue, production and guests create costs. Try a different price and see how attendance and profit change.';
}
export function workedExample(id,key,s,c,lang){
 const de=lang==='de',f=n=>new Intl.NumberFormat(de?'de-DE':'en-US',{maximumFractionDigits:2}).format(n),cu=de?'GE':'CU';
 if(key==='capacity'&&id==='concert-economics')return de?`Saalmiete jetzt: ${f(c.venueCost)} GE (${f(s.venueRate)} × ${f(s.capacity)} Plätze).`:`Venue hire now: ${f(c.venueCost)} CU (${f(s.venueRate)} × ${f(s.capacity)} places).`;
 if(key==='ticketPrice')return `${f(s.ticketPrice)} × ${f(c.attendance)} = ${f(c.revenue)} ${cu}`;
 const examples={venueRate:`${f(s.venueRate)} × ${f(s.capacity)} = ${f(c.venueCost)} ${cu}`,perGuest:`${f(s.perGuest)} × ${f(c.attendance)} = ${f(c.variableCost)} ${cu}`,demand:de?`${f(s.demand)} Kaufbereite bei 20 GE → ${f(c.potentialDemand)} bei ${f(s.ticketPrice)} GE.`:`${f(s.demand)} buyers at 20 CU → ${f(c.potentialDemand)} at ${f(s.ticketPrice)} CU.`};
 return examples[key]||'';
}

// Pure causal explanation. Serialized into n8n alongside the unchanged calculator.
export function changeExplanation(id,s,previous,language='en'){
 const de=language==='de',c=calculateScenario(id,s),f=n=>n===null?'—':new Intl.NumberFormat(de?'de-DE':'en-US',{maximumFractionDigits:2}).format(n),cu=de?'GE':'CU';
 if(!previous)return de?'Noch keine frühere Einstellung zum Vergleich. Ändere eine Entscheidung: Hier siehst du danach Ursache und Wirkung.':'There is no earlier setting to compare yet. Try a decision: its cause and effect will appear here.';
 const a=calculateScenario(id,previous),keys=Object.keys(s).filter(k=>s[k]!==previous[k]);
 if(!keys.length)return de?'Die Einstellungen sind unverändert.':'The settings are unchanged.';
 {
  const price=keys.includes('ticketPrice')?(de?`Ticketpreis: ${f(previous.ticketPrice)} → ${f(s.ticketPrice)} GE. `:`Ticket price: ${f(previous.ticketPrice)} → ${f(s.ticketPrice)} CU. `):'';
  const capacity=keys.includes('capacity')?(de?`Saalgröße: ${f(previous.capacity)} → ${f(s.capacity)} Plätze. `:`Venue size: ${f(previous.capacity)} → ${f(s.capacity)} places. `):'';
  const demand=keys.includes('demand')?(de?`Auch die Nachfrageannahme wurde von ${f(previous.demand)} auf ${f(s.demand)} geändert. `:`The demand assumption also changed from ${f(previous.demand)} to ${f(s.demand)}. `):'';
  const cause=keys.length===1&&keys[0]==='capacity'?(de?`Mehr Platz erzeugt keine Käufer. Die Saalmiete ändert sich von ${f(a.venueCost)} auf ${f(c.venueCost)} GE. `:`Extra space does not create buyers. Venue hire changes from ${f(a.venueCost)} to ${f(c.venueCost)} CU. `):keys.length===1&&keys[0]==='ticketPrice'?(de?`Die Nachfrage folgt deiner Preissensibilitätsannahme; Kosten pro anwesendem Gast ändern sich von ${f(a.variableCost)} auf ${f(c.variableCost)} GE. `:`Demand follows your price-sensitivity assumption; costs for attending guests change from ${f(a.variableCost)} to ${f(c.variableCost)} CU. `):'';
  return price+capacity+demand+(de?`Erwartete Gäste: ${f(a.attendance)} → ${f(c.attendance)}. Ticketumsatz: ${f(a.revenue)} → ${f(c.revenue)} GE${a.revenue===c.revenue?' (unverändert)':''}. `:`Expected guests: ${f(a.attendance)} → ${f(c.attendance)}. Ticket revenue: ${f(a.revenue)} → ${f(c.revenue)} CU${a.revenue===c.revenue?' (unchanged)':''}. `)+cause+(de?`Gesamtkosten: ${f(a.totalCost)} → ${f(c.totalCost)} GE. Ergebnis: ${f(a.profit)} → ${f(c.profit)} GE${c.profit<0?' (Verlust)':''}.`:`Total costs: ${f(a.totalCost)} → ${f(c.totalCost)} CU. Profit: ${f(a.profit)} → ${f(c.profit)} CU${c.profit<0?' (loss)':''}.`);
 }
}

export function deriveSceneState(id,s,c,selectedZone){
 const kind=LESSONS[id].scene;
 return {kind,selectedZone,people:c.attendance||0,occupancy:c.occupancy||0,scale:Math.min(3,Math.log10(s.capacity/200+1))};
}

export function zoneContent(id,zone,s,c,lang){
 const de=lang==='de',f=n=>new Intl.NumberFormat(de?'de-DE':'en-US',{maximumFractionDigits:2}).format(n),cu=de?'GE':'CU',pick=(en,deText)=>de?deText:en;
 const map={entrance:[`${f(c.attendance)} × ${f(s.ticketPrice)} = ${f(c.revenue)} ${cu}.`,pick('Empty places earn no ticket money.','Leere Plätze bringen kein Ticketgeld.'),{ticketPrice:Math.min(500,s.ticketPrice+10)}],stage:[`${f(s.productionBudget)} ${cu}.`,pick('Stage, DJ and sound cost money even when attendance falls.','Bühne, DJ und Ton kosten auch bei weniger Gästen Geld.'),{productionBudget:Math.min(10000000,s.productionBudget+250)}],audience:[pick(`${f(c.attendance)} of ${f(s.capacity)} places filled. ${f(c.potentialDemand)} people would buy at this price.`,`${f(c.attendance)} von ${f(s.capacity)} Plätzen belegt. ${f(c.potentialDemand)} Personen würden zu diesem Preis kaufen.`),pick('Venue capacity limits attendance; it never creates demand.','Die Saalgröße begrenzt die Gästezahl; sie schafft keine Nachfrage.'),{capacity:Math.min(100000,Math.max(1000,s.capacity*2))}]};
 const [status,meaning,values]=map[zone];return {status,meaning,values};
}
