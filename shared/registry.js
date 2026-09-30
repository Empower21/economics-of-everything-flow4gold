export const LESSONS = {'concert-economics': {
    id:'concert-economics', version:2, icon:'♫', title:{en:'The concert',de:'Das Konzert'}, question:{en:'A full house. A better business?',de:'Volles Haus. Mehr Gewinn?'}, subtitle:{en:'Change the price, crowd and venue. Discover what really drives profit.',de:'Ändere Preis, Nachfrage und Saalgröße. Entdecke, was den Gewinn bestimmt.'},
    scene:'concert', zones:['entrance','stage','audience'],
    zoneLabels:{en:['Ticket revenue','Production costs','Audience & demand'],de:['Ticketumsatz','Produktionskosten','Publikum & Nachfrage']},
    fields:[
      ['ticketPrice','Ticket price','Ticketpreis',1,500,1,20],['capacity','Venue capacity','Kapazität',50,100000,1,200],['demand','Audience interest at price 20','Nachfrage bei Preis 20',0,100000,1,150],
      ['productionBudget','Production budget','Produktionsbudget',0,10000000,50,1000,true],['venueRate','Venue cost per available place','Saalpreis pro verfügbarem Platz',0,1000,.5,2.5,true],['perGuest','Cost per attendee','Kosten pro Gast',0,10000,1,5,true],['elasticity','Price sensitivity','Preissensibilität',0,3,.1,1,true]
    ],
    metrics:[['attendance','Guests','Gäste'],['potentialDemand','Potential demand','Potenzielle Nachfrage'],['occupancy','Occupancy %','Auslastung %'],['unmetDemand','Unmet demand','Ungedeckte Nachfrage'],['revenue','Projected revenue','Erwarteter Umsatz'],['totalCost','Total cost','Gesamtkosten'],['profit','Event profit / loss','Gewinn / Verlust'],['returnOnCost','Return on cost %','Kostenrendite %']],
    presets:[{en:'Intimate · 200',de:'Klein · 200',values:{capacity:200,demand:150}},{en:'Club · 1,000',de:'Club · 1.000',values:{capacity:1000,demand:900}},{en:'Festival · 5,000',de:'Festival · 5.000',values:{capacity:5000,demand:4500}},{en:'Arena · 20,000',de:'Arena · 20.000',values:{capacity:20000,demand:18000}}],
    questions:{en:['Why did profit change?','Why doesn’t a bigger venue fill itself?','Where does the ticket money go?'],de:['Warum hat sich der Gewinn verändert?','Warum füllt sich ein größerer Saal nicht von selbst?','Wohin fließt das Geld aus Tickets?']}
  }};

export function normalizeId(id){return {concert:'concert-economics'}[id]||id;}
export function defaults(id){const l=LESSONS[normalizeId(id)];if(!l)throw new Error('Choose a supported lesson.');return {...Object.fromEntries(l.fields.map(f=>[f[0],f[6]])),};}
export function validateScenario(id,values={}){
  id=normalizeId(id);const l=LESSONS[id];if(!l)throw new Error('Choose a supported lesson.');
  if(!values||typeof values!=='object'||Array.isArray(values))throw new Error('Scenario must be an object.');
  const s={...defaults(id),...values};
  const integerKeys=new Set(['capacity','demand']);
  for(const [key,en,,min,max] of l.fields){const integer=integerKeys.has(key);if(typeof s[key]!=='number'||!Number.isFinite(s[key])||s[key]<min||s[key]>max||(integer&&!Number.isInteger(s[key])))throw new Error(`${en}: enter ${integer?'an integer':'a number'} between ${min} and ${max}.`);}
  const allowed=new Set([...l.fields.map(f=>f[0])]);
  for(const key of Object.keys(values))if(!allowed.has(key))throw new Error(`Unknown scenario input: ${key}`);
  return s;
}

export function calculateScenario(id,values){
  id=normalizeId(id);const s=validateScenario(id,values);
  {
    const potentialDemand=Math.floor(s.demand*Math.pow(s.ticketPrice/20,-s.elasticity));
    const attendance=Math.min(s.capacity,potentialDemand),venueCost=s.venueRate*s.capacity,variableCost=s.perGuest*attendance,totalCost=s.productionBudget+venueCost+variableCost,revenue=s.ticketPrice*attendance,profit=revenue-totalCost;
    return {ticketPrice:s.ticketPrice,capacity:s.capacity,potentialDemand,attendance,occupancy:100*attendance/s.capacity,unmetDemand:Math.max(0,potentialDemand-s.capacity),revenue,productionCost:s.productionBudget,venueCost,variableCost,totalCost,profit,returnOnCost:totalCost===0?null:100*profit/totalCost};
  }
}
