export const LESSONS = {'concert-economics': {
    id:'concert-economics', version:3, icon:'♫', title:{en:'The concert',de:'Das Konzert'}, question:{en:'A full house. A better business?',de:'Volles Haus. Mehr Gewinn?'}, subtitle:{en:'Change the price, crowd and venue. Discover what really drives profit.',de:'Ändere Preis, Nachfrage und Saalgröße. Entdecke, was den Gewinn bestimmt.'},
    scene:'concert', zones:['entrance','stage','audience'],
    zoneLabels:{en:['Ticket revenue','Production costs','Audience & demand'],de:['Ticketumsatz','Produktionskosten','Publikum & Nachfrage']},
    fields:[
      ['ticketPrice','Ticket price','Ticketpreis',1,1000,.01,20],['capacity','Venue capacity','Kapazität',1,10000,1,200],['demand','Interested guests at $20','Interessierte Gäste bei $20',0,100000,1,150],
      ['productionBudget','DJ, stage & sound','DJ, Bühne & Ton',0,1000000,.01,1000,true],['venueRate','Venue cost per place','Saalpreis pro Platz',0,1000,.01,2.5,true],['perGuest','Cost per guest','Kosten pro Gast',0,1000,.01,5,true],['elasticity','How much price matters','Einfluss des Preises',0,3,.1,1,true],
      ['manualAttendance','Guests attending','Anwesende Gäste',0,10000,1,150],['promotionBudget','Promotion budget','Werbebudget',0,1000000,.01,0,true],['promotionBoost','Extra interest from promotion','Zusätzliches Interesse durch Werbung',0,300,1,0,true],['sponsorship','Sponsor contribution','Sponsorenbeitrag',0,1000000,.01,0,true]
    ],
    metrics:[['attendance','Guests','Gäste'],['potentialDemand','Potential demand','Potenzielle Nachfrage'],['occupancy','Occupancy %','Auslastung %'],['unmetDemand','Unmet demand','Ungedeckte Nachfrage'],['revenue','Projected revenue','Erwarteter Umsatz'],['totalCost','Total cost','Gesamtkosten'],['profit','Event profit / loss','Gewinn / Verlust'],['returnOnCost','Return on cost %','Kostenrendite %']],
    questions:{en:['Why did profit change?','Why doesn’t a bigger venue fill itself?','Where does the ticket money go?'],de:['Warum hat sich der Gewinn verändert?','Warum füllt sich ein größerer Saal nicht von selbst?','Wohin fließt das Geld aus Tickets?']}
  }};

export const MODEL_VERSION='concert-v3';
export const LOCATIONS={
 neighborhood:{en:'Neighborhood club',de:'Club im Viertel',values:{demand:150,productionBudget:1000,venueRate:2.5,perGuest:5}},
 city:{en:'City-center venue',de:'Veranstaltungsort im Stadtzentrum',values:{demand:600,productionBudget:2000,venueRate:4,perGuest:7}},
 outdoor:{en:'Outdoor concert space',de:'Open-Air-Konzertgelände',values:{demand:1200,productionBudget:4000,venueRate:1.5,perGuest:6}},
 custom:{en:'Custom location',de:'Eigener Veranstaltungsort',values:null}
};
export function normalizeId(id){return {concert:'concert-economics'}[id]||id;}
export function defaults(id){const l=LESSONS[normalizeId(id)];if(!l)throw new Error('Choose the concert lesson.');return {...Object.fromEntries(l.fields.map(f=>[f[0],f[6]])),audienceMode:'estimated',location:'neighborhood',profile:'neighborhood'};}
export function validateScenario(id,values={}){
 id=normalizeId(id);const l=LESSONS[id];if(!l)throw new Error('Choose the concert lesson.');
 if(!values||typeof values!=='object'||Array.isArray(values))throw new Error('Scenario must be an object.');
 const s={...defaults(id),...values},integerKeys=new Set(['capacity','demand','manualAttendance']);
 for(const [key,en,,min,max] of l.fields){const integer=integerKeys.has(key);if(typeof s[key]!=='number'||!Number.isFinite(s[key])||s[key]<min||s[key]>max||(integer&&!Number.isInteger(s[key])))throw new Error(`${en}: enter ${integer?'an integer':'a number'} between ${min} and ${max}.`);if(!integer&&key!=='elasticity'&&key!=='promotionBoost'&&Math.abs(s[key]*100-Math.round(s[key]*100))>1e-6)throw new Error(`${en}: use at most two decimal places.`);}
 if(!['estimated','manual'].includes(s.audienceMode)||!Object.hasOwn(LOCATIONS,s.location)||!['neighborhood','city','outdoor'].includes(s.profile))throw new Error('Invalid audience mode or location.');
 const allowed=new Set([...l.fields.map(f=>f[0]),'audienceMode','location','profile']);for(const key of Object.keys(values))if(!allowed.has(key))throw new Error(`Unknown scenario input: ${key}`);
 return s;
}
export function calculateScenario(id,values){
 const s=validateScenario(id,values),raw=s.demand*(1+s.promotionBoost/100)*Math.pow(s.ticketPrice/20,-s.elasticity),potentialDemand=Math.floor(raw+Math.min(1e-7,Math.abs(raw)*Number.EPSILON*8));
 const attendance=Math.min(s.capacity,s.audienceMode==='manual'?s.manualAttendance:potentialDemand),cents=n=>Math.round(n*100),venue=cents(s.venueRate)*s.capacity,guest=cents(s.perGuest)*attendance,total=cents(s.productionBudget)+venue+guest+cents(s.promotionBudget),tickets=cents(s.ticketPrice)*attendance,revenue=tickets+cents(s.sponsorship),profit=revenue-total;
 return {ticketPrice:s.ticketPrice,capacity:s.capacity,potentialDemand,attendance,occupancy:100*attendance/s.capacity,unmetDemand:s.audienceMode==='manual'?null:Math.max(0,potentialDemand-s.capacity),ticketRevenue:tickets/100,sponsorship:s.sponsorship,revenue:revenue/100,productionCost:s.productionBudget,venueCost:venue/100,variableCost:guest/100,promotionCost:s.promotionBudget,totalCost:total/100,profit:profit/100,returnOnCost:total===0?null:100*profit/total,revenueCents:revenue,costCents:total,profitCents:profit};
}
export function crowdScale(capacity,attendance){const peoplePerFigure=Math.max(1,Math.ceil(capacity/300));return {peoplePerFigure,occupiedFigures:attendance===0?0:Math.ceil(attendance/peoplePerFigure),availableFigureSlots:Math.ceil(capacity/peoplePerFigure)};}
export function money(value,language='en'){return value===null?'—':new Intl.NumberFormat(language==='de'?'de-DE':'en-US',{style:'currency',currency:'USD',currencyDisplay:'narrowSymbol',minimumFractionDigits:Number.isInteger(value)?0:2,maximumFractionDigits:2}).format(value);}
