import {LESSONS,calculateScenario,money} from './registry.js';

// Presentation metadata shares stable keys and validation bounds with the calculator.
// [English label, German label, unit EN, unit DE, group, help EN, help DE]
const content={concert:{
 ticketPrice:['Ticket price per person','Ticketpreis pro Person','$ / person','$ / Person','primary','What each guest pays to enter. Use $1 or more for this paid-ticket model.','Eintrittspreis pro Gast. Verwende mindestens $1 für dieses Modell mit bezahlten Tickets.'],
 capacity:['How many people the venue can hold','Wie viele Personen in den Saal passen','people','Personen','primary','Empty places earn no ticket money. More space does not create buyers.','Leere Plätze bringen keine Einnahmen. Mehr Platz schafft keine Nachfrage.'],
 demand:['People willing to buy at 20 $','Kaufbereite Personen bei 20 $','people','Personen','audience','20 $ is the fixed reference price, not your current ticket price.','20 $ ist der feste Bezugspreis, nicht dein aktueller Ticketpreis.'],
 elasticity:['How strongly price affects demand','Wie stark der Preis die Nachfrage beeinflusst','parameter','Parameter','audience','Teaching assumptions: Low 0.5 · Medium 1 · High 2. At 0, price has no effect.','Lernannahmen: niedrig 0,5 · mittel 1 · hoch 2. Bei 0 hat der Preis keinen Einfluss.'],
 productionBudget:['Stage, DJ and production costs','Kosten für Bühne, DJ und Technik','$ total','$ gesamt','costs','Fixed cost for performers, stage and sound; excludes venue hire and guest services.','Fixkosten für Künstler, Bühne und Ton; ohne Saalmiete und Leistungen pro Gast.'],
 venueRate:['Venue hire per place of capacity','Saalmiete je verfügbarem Platz','$ / place','$ / Platz','costs','Charged for every available place, even if it stays empty.','Wird für jeden verfügbaren Platz berechnet, auch wenn er leer bleibt.'],
 perGuest:['Extra cost for each guest attending','Zusatzkosten pro anwesendem Gast','$ / guest','$ / Gast','costs','Illustrative guest supplies and services; only charged for attendees.','Beispielhafte Materialien und Leistungen; nur für anwesende Gäste.']}};
export function fieldContent(id,key,lang='en'){
 const l=LESSONS[id],row=l.fields.find(r=>r[0]===key),de=lang==='de',v=content[l.scene][key]||[row[1],row[2],key==='manualAttendance'?'people':key==='promotionBoost'?'%':'$',key==='manualAttendance'?'Personen':key==='promotionBoost'?'%':'$','costs',key==='promotionBoost'?'An explicit assumption, not a guaranteed advertising effect.':'Change this assumption to test your mix.',key==='promotionBoost'?'Eine ausdrückliche Annahme, keine garantierte Werbewirkung.':'Ändere diese Annahme und teste deinen Mix.'];
 return {key,label:v[de?1:0],unit:v[de?3:2],group:v[4],help:v[de?6:5],min:row[3],max:row[4],step:row[5]};
}
export function setupText(id,s,lang){
 const de=lang==='de',f=n=>new Intl.NumberFormat(de?'de-DE':'en-US').format(n);
 return de?'Du planst ein Konzert. Tickets bringen Geld ein; Saal, Bühne und Gäste verursachen Kosten. Ändere den Preis und beobachte Gästezahl und Gewinn.':'You are planning a live music event. Tickets bring money in; the venue, production and guests create costs. Try a different price and see how attendance and profit change.';
}
export function workedExample(id,key,s,c,lang){
 const de=lang==='de',m=n=>money(n,lang),f=n=>new Intl.NumberFormat(de?'de-DE':'en-US').format(n);
 if(key==='capacity'||key==='venueRate')return `${de?'Saalmiete':'Venue hire total'}: ${m(c.venueCost)} (${m(s.venueRate)} × ${f(s.capacity)}).`;
 if(key==='ticketPrice')return `${m(s.ticketPrice)} × ${f(c.attendance)} = ${m(c.ticketRevenue)}`;
 if(key==='perGuest')return `${m(s.perGuest)} × ${f(c.attendance)} = ${m(c.variableCost)}`;
 return '';
}

// Pure causal explanation. Serialized into n8n alongside the unchanged calculator.
export function changeExplanation(id,s,previous,language='en'){
 const de=language==='de',c=calculateScenario(id,s),m=n=>money(n,language),f=n=>new Intl.NumberFormat(de?'de-DE':'en-US').format(n);
 if(!previous)return de?'Ändere eine Entscheidung. Hier erscheinen Ursache und Wirkung.':'There is no earlier setting to compare yet. Try a decision: its cause and effect will appear here.';
 const a=calculateScenario(id,previous),keys=Object.keys(s).filter(k=>s[k]!==previous[k]);
 const moves=LESSONS[id==='concert'?'concert-economics':id].fields.filter(r=>keys.includes(r[0])).map(r=>`${r[de?2:1]}: ${['ticketPrice','productionBudget','venueRate','perGuest','promotionBudget','sponsorship'].includes(r[0])?m(previous[r[0]]):f(previous[r[0]])} → ${['ticketPrice','productionBudget','venueRate','perGuest','promotionBudget','sponsorship'].includes(r[0])?m(s[r[0]]):f(s[r[0]])}.`).join(' ');
 const cause=keys.includes('capacity')?(de?'Mehr Platz erzeugt keine Käufer. ':'Extra space does not create buyers. '):s.audienceMode==='manual'?(de?'Die manuell gewählte Gästezahl bleibt bei Preisänderungen gleich. ':'Manual headcount stays fixed when price changes. '):keys.includes('ticketPrice')?(de?'Die Nachfrage folgt der Preisannahme. ':'Demand follows your price-sensitivity assumption. '):'';
 return moves+' '+cause+(de?`Gäste: ${f(a.attendance)} → ${f(c.attendance)}. Einnahmen: ${m(a.revenue)} → ${m(c.revenue)}. Gesamtkosten: ${m(a.totalCost)} → ${m(c.totalCost)}. Gewinn: ${m(a.profit)} → ${m(c.profit)}${c.profit<0?' (Verlust)':''}.`:`Guests: ${f(a.attendance)} → ${f(c.attendance)}. Revenue: ${m(a.revenue)} → ${m(c.revenue)}${a.revenue===c.revenue?' (unchanged)':''}. Total costs: ${m(a.totalCost)} → ${m(c.totalCost)}. Profit: ${m(a.profit)} → ${m(c.profit)}${c.profit<0?' (loss)':''}.`);
}
function normalizeConcertId(id){return id==='concert'?'concert-economics':id;}

export function deriveSceneState(id,s,c,selectedZone){
 const kind=LESSONS[id].scene;
 return {kind,selectedZone,people:c.attendance||0,occupancy:c.occupancy||0,scale:Math.min(3,Math.log10(s.capacity/200+1))};
}

export function zoneContent(id,zone,s,c,lang){
 const de=lang==='de',f=n=>new Intl.NumberFormat(de?'de-DE':'en-US',{maximumFractionDigits:2}).format(n),cu=de?'$':'$',pick=(en,deText)=>de?deText:en;
 const map={entrance:[`${f(c.attendance)} × ${f(s.ticketPrice)} = ${f(c.revenue)} ${cu}.`,pick('Empty places earn no ticket money.','Leere Plätze bringen kein Ticketgeld.'),{ticketPrice:Math.min(500,s.ticketPrice+10)}],stage:[`${f(s.productionBudget)} ${cu}.`,pick('Stage, DJ and sound cost money even when attendance falls.','Bühne, DJ und Ton kosten auch bei weniger Gästen Geld.'),{productionBudget:Math.min(1000000,s.productionBudget+250)}],audience:[pick(`${f(c.attendance)} of ${f(s.capacity)} places filled. ${f(c.potentialDemand)} people would buy at this price.`,`${f(c.attendance)} von ${f(s.capacity)} Plätzen belegt. ${f(c.potentialDemand)} Personen würden zu diesem Preis kaufen.`),pick('Venue capacity limits attendance; it never creates demand.','Die Saalgröße begrenzt die Gästezahl; sie schafft keine Nachfrage.'),{capacity:Math.min(10000,Math.max(1000,s.capacity*2))}]};
 const [status,meaning,values]=map[zone];return {status,meaning,values};
}
