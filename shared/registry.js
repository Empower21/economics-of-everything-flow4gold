export const LESSONS = {
  'concert-economics': {
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
  },
  'conference-economics': {
    id:'conference-economics',version:1,icon:'✳',title:{en:'The conference',de:'Die Konferenz'},question:{en:'Build a conference people love.',de:'Plane eine Konferenz für Menschen.'},subtitle:{en:'Balance workshop access, shared space and a sustainable budget.',de:'Bringe Workshopzugang, Begegnungen und Budget ins Gleichgewicht.'},scene:'conference',zones:['registration','speakers','workshop','networking','catering'],zoneLabels:{en:['Registration','Speakers','Workshops','Networking','Catering'],de:['Anmeldung','Vorträge','Workshops','Begegnungen','Verpflegung']},
    fields:[['expectedAttendees','Expected attendees','Erwartete Gäste',0,100000,1,500],['capacity','Venue capacity','Kapazität',50,100000,1,600],['ticketPrice','Ticket price','Ticketpreis',0,1000,1,40],['sponsor','Sponsor contribution','Sponsorbeitrag',0,10000000,500,10000],['workshopSeats','Workshop seats','Workshopplätze',0,100000,10,200],['networkingSeats','Networking-area seats','Plätze im Begegnungsbereich',0,100000,10,100],['catering','Catering per person','Verpflegung pro Person',0,1000,1,15],['speakerBudget','Speaker budget','Vortragsbudget',0,10000000,100,5000,true],['venueCost','Venue cost','Raumkosten',0,10000000,100,8000,true],['workshopRate','Cost per workshop seat','Kosten pro Workshopplatz',0,1000,1,10,true],['networkingRate','Cost per networking seat','Kosten pro Begegnungsplatz',0,1000,1,10,true],['otherFixed','Other fixed costs','Andere Fixkosten',0,10000000,100,1500,true],['availableBudget','Funding budget','Verfügbares Budget',0,10000000,500,25000,true]],
    metrics:[['attendance','Attendees','Teilnehmende'],['registrationRevenue','Ticket revenue','Ticketumsatz'],['sponsorRevenue','Sponsor revenue','Sponsorbeitrag'],['totalCost','Total cost','Gesamtkosten'],['profit','Surplus / deficit','Überschuss / Defizit'],['workshopAccess','Workshop access %','Workshopzugang %'],['networkingAccess','Networking capacity %','Begegnungskapazität %'],['cateringProvision','Catering per guest','Verpflegung pro Gast'],['budgetGap','Funding budget gap','Finanzierungslücke']],
    presets:[{en:'Community meetup',de:'Community-Treffen',values:{expectedAttendees:80,capacity:100,ticketPrice:10,sponsor:1500,workshopSeats:50,networkingSeats:80,catering:8,speakerBudget:200,venueCost:400,otherFixed:100,availableBudget:3000}},{en:'Regional conference',de:'Regionale Konferenz',values:{expectedAttendees:500,capacity:600,ticketPrice:40,sponsor:10000,workshopSeats:200,networkingSeats:100,catering:15,speakerBudget:5000,venueCost:8000,otherFixed:1500,availableBudget:25000}},{en:'Large conference',de:'Große Konferenz',values:{expectedAttendees:2000,capacity:2500,ticketPrice:80,sponsor:30000,workshopSeats:800,networkingSeats:600,catering:20,speakerBudget:25000,venueCost:45000,otherFixed:10000,availableBudget:150000}}],
    questions:{en:['Why can more workshop seats reduce surplus?','Does sponsorship measure sponsor ROI?','What is the difference between budget and revenue?'],de:['Warum können mehr Workshopplätze den Überschuss senken?','Misst Sponsoring den Nutzen für den Sponsor?','Was unterscheidet Budget und Umsatz?']}
  },
  'factory-supply-chain': {
    id:'factory-supply-chain',version:1,icon:'▰',title:{en:'The tiny part',de:'Das kleine Bauteil'},question:{en:'A whole car. One missing part.',de:'Ein ganzes Auto. Ein fehlendes Teil.'},subtitle:{en:'Follow a delivery through the line. See the cost of a bottleneck.',de:'Verfolge eine Lieferung durch die Fertigung. Entdecke die Folgen eines Engpasses.'},scene:'factory',zones:['supplier','components','assembly','finished'],zoneLabels:{en:['Supplier & deliveries','Component stock','Assembly line','Finished vehicles'],de:['Lieferant & Lieferungen','Bauteillager','Montageband','Fertige Fahrzeuge']},
    fields:[['target','Daily production target','Tagesproduktionsziel',1,10000,10,100],['openingInventory','Opening component stock','Anfangsbestand Bauteile',0,1000000,50,150],['supplierDelay','Supplier delay (days)','Lieferverzug (Tage)',0,29,1,3],['deliveryQuantity','Planned delivery quantity','Geplante Liefermenge',0,1000000,50,200],['sellingPrice','Vehicle selling price','Verkaufspreis pro Fahrzeug',0,1000000,500,30000,true],['nonComponentCost','Other cost per vehicle','Andere Stückkosten',0,1000000,500,24000,true],['componentCost','Component purchase cost','Bauteilpreis',0,100000,1,10,true],['alternativeQuantity','Alternative order quantity','Alternative Bestellmenge',0,1000000,50,0,true],['alternativeDay','Alternative arrival day','Ankunftstag Alternative',1,30,1,2,true],['alternativePremium','Premium per alternative part','Aufpreis pro Alternativteil',0,100000,1,5,true],['carryingCost','Daily carrying cost per part','Lagerkosten pro Teil und Tag',0,1000,.01,.1,true],['operatingCost','Daily operating cost','Tägliche Betriebskosten',0,10000000,100,1000,true],['dailySales','Daily sales if not automatic','Tägliche Verkäufe ohne Automatik',0,10000,10,0,true]],
    metrics:[['day','Completed day','Abgeschlossener Tag'],['produced','Units produced today','Heute produzierte Einheiten'],['inventory','Component inventory','Bauteilbestand'],['cumulativeOutput','Cumulative production','Produktion insgesamt'],['delayedUnits','Unfilled production opportunities','Nicht genutzte Produktionsmöglichkeiten'],['sales','Units sold','Verkaufte Einheiten'],['finishedInventory','Finished inventory','Fertigwarenbestand'],['revenue','Sales revenue','Verkaufsumsatz'],['componentConsumedCost','Consumed component cost','Kosten verbrauchter Bauteile'],['supplierPremiums','Consumed supplier premiums','Verbrauchte Lieferantenaufschläge'],['purchaseCash','Cash for arriving orders','Auszahlung für Lieferungen'],['carryingCosts','Inventory carrying costs','Lagerkosten'],['profit','Operating contribution','Betrieblicher Ergebnisbeitrag']],
    presets:[{en:'Delayed supplier',de:'Verspätete Lieferung',values:{openingInventory:150,alternativeQuantity:0}},{en:'More safety stock',de:'Mehr Sicherheitsbestand',values:{openingInventory:400,alternativeQuantity:0}},{en:'Second supplier',de:'Zweiter Lieferant',values:{openingInventory:150,alternativeQuantity:200,alternativeDay:2}}],
    questions:{en:['Why can a cheap part stop the whole line?','Does extra inventory always pay off?','Are delayed units the same as lost sales?'],de:['Warum kann ein billiges Teil die ganze Linie stoppen?','Lohnt sich mehr Lagerbestand immer?','Sind verzögerte Einheiten gleich verlorene Verkäufe?']}
  }
};

export function normalizeId(id){return {concert:'concert-economics',conference:'conference-economics',factory:'factory-supply-chain'}[id]||id;}
export function defaults(id){const l=LESSONS[normalizeId(id)];if(!l)throw new Error('Choose a supported lesson.');return {...Object.fromEntries(l.fields.map(f=>[f[0],f[6]])),...(l.scene==='factory'?{elapsedDays:0,sellImmediately:true}:{})};}
export function validateScenario(id,values={}){
  id=normalizeId(id);const l=LESSONS[id];if(!l)throw new Error('Choose a supported lesson.');
  if(!values||typeof values!=='object'||Array.isArray(values))throw new Error('Scenario must be an object.');
  const s={...defaults(id),...values};
  const integerKeys=new Set(['capacity','demand','expectedAttendees','workshopSeats','networkingSeats','target','openingInventory','supplierDelay','deliveryQuantity','alternativeQuantity','alternativeDay','dailySales']);
  for(const [key,en,,min,max] of l.fields){const integer=integerKeys.has(key);if(typeof s[key]!=='number'||!Number.isFinite(s[key])||s[key]<min||s[key]>max||(integer&&!Number.isInteger(s[key])))throw new Error(`${en}: enter ${integer?'an integer':'a number'} between ${min} and ${max}.`);}
  if(l.scene==='factory'&&(!Number.isInteger(s.elapsedDays)||s.elapsedDays<0||s.elapsedDays>30||typeof s.sellImmediately!=='boolean'))throw new Error('Choose a day from 0–30 and a sales assumption.');
  const allowed=new Set([...l.fields.map(f=>f[0]),...(l.scene==='factory'?['elapsedDays','sellImmediately']:[])]);
  for(const key of Object.keys(values))if(!allowed.has(key))throw new Error(`Unknown scenario input: ${key}`);
  return s;
}

export function calculateScenario(id,values){
  id=normalizeId(id);const s=validateScenario(id,values);
  if(id==='concert-economics'){
    const potentialDemand=Math.floor(s.demand*Math.pow(s.ticketPrice/20,-s.elasticity));
    const attendance=Math.min(s.capacity,potentialDemand),venueCost=s.venueRate*s.capacity,variableCost=s.perGuest*attendance,totalCost=s.productionBudget+venueCost+variableCost,revenue=s.ticketPrice*attendance,profit=revenue-totalCost;
    return {ticketPrice:s.ticketPrice,capacity:s.capacity,potentialDemand,attendance,occupancy:100*attendance/s.capacity,unmetDemand:Math.max(0,potentialDemand-s.capacity),revenue,productionCost:s.productionBudget,venueCost,variableCost,totalCost,profit,returnOnCost:totalCost===0?null:100*profit/totalCost};
  }
  if(id==='conference-economics'){
    const attendance=Math.min(s.expectedAttendees,s.capacity),registrationRevenue=attendance*s.ticketPrice,workshopCost=s.workshopSeats*s.workshopRate,networkingCost=s.networkingSeats*s.networkingRate,cateringCost=attendance*s.catering,totalCost=s.venueCost+s.speakerBudget+workshopCost+networkingCost+cateringCost+s.otherFixed,revenue=registrationRevenue+s.sponsor;
    return {attendance,capacity:s.capacity,registrationRevenue,sponsorRevenue:s.sponsor,revenue,workshopCost,networkingCost,cateringCost,totalCost,profit:revenue-totalCost,workshopAccess:attendance?100*Math.min(attendance,s.workshopSeats)/attendance:null,networkingAccess:attendance?100*Math.min(attendance,s.networkingSeats)/attendance:null,cateringProvision:s.catering,budgetGap:Math.max(0,totalCost-s.availableBudget)};
  }
  let inventory=s.openingInventory,cumulativeOutput=0,delayedUnits=0,sales=0,revenue=0,componentConsumedCost=0,supplierPremiums=0,purchaseCash=0,carryingCosts=0,costOfGoodsSold=0,operatingCosts=0,produced=0,received=0;
  const stock=[{qty:s.openingInventory,premium:0}],finished=[],history=[];
  for(let day=1;day<=s.elapsedDays;day++){
    received=0;
    for(const order of [{day:1+s.supplierDelay,qty:s.deliveryQuantity,premium:0},{day:s.alternativeDay,qty:s.alternativeQuantity,premium:s.alternativePremium}])if(order.day===day&&order.qty){stock.push({qty:order.qty,premium:order.premium});inventory+=order.qty;received+=order.qty;purchaseCash+=order.qty*(s.componentCost+order.premium);}
    produced=Math.min(s.target,inventory);let need=produced,dayPremium=0;
    for(const batch of stock){const take=Math.min(need,batch.qty);batch.qty-=take;need-=take;dayPremium+=take*batch.premium;}
    inventory-=produced;cumulativeOutput+=produced;delayedUnits+=s.target-produced;componentConsumedCost+=produced*s.componentCost;supplierPremiums+=dayPremium;
    if(produced)finished.push({qty:produced,cost:s.nonComponentCost+s.componentCost+dayPremium/produced});
    let sell=s.sellImmediately?finished.reduce((n,b)=>n+b.qty,0):s.dailySales;
    for(const batch of finished){const sold=Math.min(sell,batch.qty);batch.qty-=sold;sell-=sold;sales+=sold;revenue+=sold*s.sellingPrice;costOfGoodsSold+=sold*batch.cost;}
    carryingCosts+=inventory*s.carryingCost;operatingCosts+=s.operatingCost;
    history.push({day,received,produced,closingInventory:inventory});
  }
  return {day:s.elapsedDays,produced,received,inventory,cumulativeOutput,delayedUnits,sales,finishedInventory:finished.reduce((n,b)=>n+b.qty,0),revenue,componentConsumedCost,supplierPremiums,purchaseCash,openingInventoryValue:s.openingInventory*s.componentCost,carryingCosts,operatingCosts,costOfGoodsSold,profit:revenue-costOfGoodsSold-carryingCosts-operatingCosts,history};
}
