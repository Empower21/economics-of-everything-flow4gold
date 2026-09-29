import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import '@fontsource/dm-sans/700.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/800.css';
import './style.css';
import { calculate, preparedLesson, validateLesson } from '../shared/lesson.js';

const copy={
  en:{ brand:'The Economics<br>of Everything', lab:'AN EVERYDAY ECONOMICS LAB', chapter:'01 / THE CONCERT', time:'2 MIN TO A NEW PERSPECTIVE', title:'A full house.<br>A better business?', intro:'A tiny venue. A big decision. Change the ticket price and discover what a crowd can teach you about profit.', live:'YOUR CONCERT, IN MINIATURE', drag:'Drag to look around · Tap to explore', loading:'Setting the stage…', sceneError:'The 3D venue is unavailable. Every calculation and lesson still works below.', view:'2D view', view3:'3D view', reset:'Reset view', crowd:'Each figure represents up to 5 guests.', explore:'Follow the money', revenue:'Ticket revenue', cost:'Event costs', audience:'The audience', price:'Set your ticket price', units:'currency units', low:'Accessible', high:'Premium', guests:'Guests', capacity:'of 200 capacity', revenueLabel:'Revenue', costLabel:'Total cost', profit:'Your event profit', loss:'Your event loss', roc:'return on cost', experiment:'THE LITTLE EXPERIMENT', experimentTitle:'Same revenue. Different ending.', experimentText:'Compare a ticket price of 20 with 30. What changes when a smaller crowd pays more?', try20:'Try 20', try30:'Try 30', tutor:'MAKE IT CLICK', tutorTitle:'A question opens a world.', placeholder:'Why isn’t a sold-out show always more profitable?', ask:'Ask the lesson', asking:'Thinking…', prepared:'Prepared lesson', ai:'AI-selected lesson · checked calculations', fallback:'Connection unavailable · prepared lesson', questionHint:'Questions are sent to the lesson service. Please leave out personal information.', follow:'Explore next', assumptions:'Behind the numbers', assumptionTitle:'An invented model. A real idea.', footer:'Small worlds. Useful ideas.', footerRight:'Made with n8n · Blender · Babylon.js', compare:'Compared with a ticket price of 20', delta:'profit difference', quiz:'One last thought', quizQ:'Revenue stays the same. Costs fall. What happens to profit?', up:'It rises', down:'It falls', same:'It stays the same', correct:'Exactly. Profit is what remains after costs. You’ve got the idea.', incorrect:'Try again: subtract a smaller cost from the same revenue.', learn:'Learning check', help:'Choose a part of the venue or ask a question.', chart:'Revenue and costs in currency units', completed:'Lesson explored', unavailable:'Could not reach the lesson service. Here is a prepared explanation.', invalid:'Please enter a question.', error:'Something went wrong. Try again.', source:'Read the formulas', back:'Back to the concert', methodology:'How this lesson works', methText:'This is a hypothetical teaching model, not a prediction of ticket demand. All money is in currency units. No business savings or learning outcomes are claimed.', pause:'Pause rendering', resume:'Resume rendering' },
  de:{ brand:'Die Ökonomie<br>von allem',lab:'EIN LABOR FÜR ALLTAGSÖKONOMIE',chapter:'01 / DAS KONZERT',time:'2 MIN FÜR EINE NEUE PERSPEKTIVE',title:'Volles Haus.<br>Mehr Gewinn?',intro:'Ein kleiner Veranstaltungsort. Eine große Entscheidung. Ändere den Ticketpreis und entdecke, was die Besucherzahl über Gewinn verrät.',live:'DEIN KONZERT IM KLEINFORMAT',drag:'Ziehen zum Drehen · Antippen zum Erkunden',loading:'Die Bühne wird aufgebaut…',sceneError:'Die 3D-Ansicht ist nicht verfügbar. Alle Berechnungen und Erklärungen funktionieren unten weiter.',view:'2D-Ansicht',view3:'3D-Ansicht',reset:'Ansicht zurücksetzen',crowd:'Jede Figur steht für bis zu 5 Gäste.',explore:'Wohin fließt das Geld?',revenue:'Ticketumsatz',cost:'Veranstaltungskosten',audience:'Das Publikum',price:'Wähle deinen Ticketpreis',units:'Geldeinheiten',low:'Günstig',high:'Premium',guests:'Gäste',capacity:'von 200 Plätzen',revenueLabel:'Umsatz',costLabel:'Gesamtkosten',profit:'Dein Gewinn',loss:'Dein Verlust',roc:'Kostenrendite',experiment:'DAS KLEINE EXPERIMENT',experimentTitle:'Gleicher Umsatz. Anderes Ergebnis.',experimentText:'Vergleiche einen Ticketpreis von 20 mit 30. Was ändert sich, wenn weniger Gäste mehr bezahlen?',try20:'20 testen',try30:'30 testen',tutor:'JETZT WIRD ES KLAR',tutorTitle:'Eine Frage öffnet eine Welt.',placeholder:'Warum bringt ein ausverkauftes Konzert nicht immer mehr Gewinn?',ask:'Frage stellen',asking:'Einen Moment…',prepared:'Vorbereitete Erklärung',ai:'KI-Auswahl · geprüfte Berechnungen',fallback:'Verbindung nicht verfügbar · vorbereitete Erklärung',questionHint:'Fragen werden an den Lerndienst gesendet. Bitte keine persönlichen Daten eingeben.',follow:'Weiter entdecken',assumptions:'Hinter den Zahlen',assumptionTitle:'Ein erfundenes Modell. Eine echte Erkenntnis.',footer:'Kleine Welten. Nützliche Ideen.',footerRight:'Mit n8n · Blender · Babylon.js',compare:'Vergleich mit einem Ticketpreis von 20',delta:'Gewinnunterschied',quiz:'Ein letzter Gedanke',quizQ:'Der Umsatz bleibt gleich. Die Kosten sinken. Was passiert mit dem Gewinn?',up:'Er steigt',down:'Er sinkt',same:'Er bleibt gleich',correct:'Genau. Gewinn ist das, was nach Abzug der Kosten übrig bleibt.',incorrect:'Versuche es noch einmal: Ziehe geringere Kosten vom gleichen Umsatz ab.',learn:'Lerncheck',help:'Wähle einen Teil des Veranstaltungsorts oder stelle eine Frage.',chart:'Umsatz und Kosten in Geldeinheiten',completed:'Lektion erkundet',unavailable:'Der Lerndienst ist nicht erreichbar. Hier ist eine vorbereitete Erklärung.',invalid:'Bitte gib eine Frage ein.',error:'Etwas ist schiefgelaufen. Versuche es noch einmal.',source:'Die Formeln lesen',back:'Zurück zum Konzert',methodology:'So funktioniert diese Lektion',methText:'Dies ist ein hypothetisches Lernmodell und keine Prognose der Ticketnachfrage. Alle Geldbeträge sind in Geldeinheiten. Es werden keine Einsparungen oder Lernerfolge behauptet.',pause:'Darstellung pausieren',resume:'Darstellung fortsetzen' }
};
let lang=new URLSearchParams(location.search).get('lang')==='de'?'de':'en';
let price=20, venue, mode2d=false, paused=false, currentRequest=0, selected='revenue';
const sessionId=crypto.randomUUID();
const $=s=>document.querySelector(s);
const t=()=>copy[lang];
const format=n=>new Intl.NumberFormat(lang==='de'?'de-DE':'en-US',{maximumFractionDigits:1}).format(n);
const requestFor=question=>({requestId:crypto.randomUUID(),sessionId,topicId:'concert',language:lang,question,scenario:{ticketPrice:price}});

function render(){
  venue?.dispose();venue=null;currentRequest++;
  const c=t();document.documentElement.lang=lang;
  $('#app').innerHTML=`
    <header class="site-header"><a class="brand" href="/"><span class="brand-mark">e<span>•</span></span><span>${c.brand}</span></a><span class="header-lab">${c.lab}</span><label class="language"><span aria-hidden="true">◎</span><select id="language" aria-label="Language / Sprache"><option value="en" ${lang==='en'?'selected':''}>English</option><option value="de" ${lang==='de'?'selected':''}>Deutsch</option></select></label></header>
    <main>
      <section class="intro"><div><div class="eyebrow"><span class="little-line"></span>${c.chapter}</div><h1>${c.title}</h1></div><div class="intro-right"><span class="pill"><span class="pulse-dot"></span>${c.time}</span><p>${c.intro}</p></div></section>
      <div class="lesson-grid"><section class="world-panel" aria-label="${c.live}"><div class="world-top"><span class="eyebrow">${c.live}</span><div class="world-tools"><button id="pause" class="icon-button" aria-label="${c.pause}" title="${c.pause}">Ⅱ</button><button id="reset" class="icon-button" aria-label="${c.reset}" title="${c.reset}">↺</button><button id="toggle-view" class="text-button">${c.view}</button></div></div><div class="canvas-wrap"><canvas id="venue" aria-label="${c.drag}" tabindex="0"></canvas><div id="scene-loading" role="status">${c.loading}</div><div id="flat-view" hidden><div class="flat-stage">♫</div><div class="flat-audience" id="flat-audience"></div><p>${c.chart}</p><div class="bar-row"><span>${c.revenueLabel}</span><div><i id="rev-bar"></i></div><b id="rev-bar-label"></b></div><div class="bar-row"><span>${c.costLabel}</span><div><i id="cost-bar"></i></div><b id="cost-bar-label"></b></div></div></div><div class="world-bottom"><span id="scene-caption">${c.drag}</span><span>${c.crowd}</span></div><div class="hotspots"><span>${c.explore} <span class="arrow">↗</span></span><button class="hotspot active" data-focus="revenue"><span>01</span>${c.revenue}</button><button class="hotspot" data-focus="cost"><span>02</span>${c.cost}</button><button class="hotspot" data-focus="audience"><span>03</span>${c.audience}</button></div></section>
      <aside class="control-panel"><div class="price-top"><label for="price">${c.price}</label><span class="control-icon">↗</span></div><div class="price-number"><output id="price-value" for="price">20</output><span>${c.units}</span></div><input id="price" type="range" min="5" max="50" step="1" value="${price}"/><div class="range-labels"><span>5 · ${c.low}</span><span>50 · ${c.high}</span></div><div class="attendance"><div><span>${c.guests}</span><strong id="attendance"></strong></div><span class="muted">${c.capacity}</span><div class="capacity-track"><i id="capacity-fill"></i></div></div><div class="money-row"><span>${c.revenueLabel}</span><strong id="revenue"></strong></div><div class="money-row"><span>${c.costLabel}</span><strong id="total-cost"></strong></div><div class="profit-card" aria-live="polite" aria-atomic="true"><div><span id="profit-title">${c.profit}</span><span>↗</span></div><strong id="profit"></strong><p><b id="return"></b> ${c.roc}</p></div><p class="delta"><b id="delta"></b> ${c.delta}<br><span>${c.compare}</span></p></aside></div>
      <section class="experiment"><div class="experiment-symbol">↔</div><div><span class="eyebrow">${c.experiment}</span><h2>${c.experimentTitle}</h2><p>${c.experimentText}</p></div><div class="experiment-buttons"><button data-price="20">${c.try20}<span>↗</span></button><button data-price="30">${c.try30}<span>↗</span></button></div></section>
      <section class="tutor-grid"><div class="tutor-intro"><div class="eyebrow">${c.tutor}</div><h2>${c.tutorTitle}</h2><p>${c.help}</p><div class="tiny-art" aria-hidden="true"><span>?</span><i>✳</i></div></div><div class="tutor-card"><div class="tutor-heading"><span class="tutor-avatar">e•</span><span id="delivery">${c.prepared}</span><span class="status-dot"></span></div><p id="explanation" aria-live="polite"></p><button id="followup" class="followup"></button><form id="ask-form"><label class="sr-only" for="question">${c.tutorTitle}</label><textarea id="question" maxlength="600" rows="2" placeholder="${c.placeholder}" required></textarea><div class="form-bottom"><span>↵</span><button id="ask" type="submit">${c.ask} <span>↗</span></button></div></form><p id="form-error" role="alert"></p><small>${c.questionHint}</small></div></section>
      <section class="quiz"><span class="eyebrow">${c.learn}</span><h2>${c.quizQ}</h2><div class="quiz-buttons"><button data-answer="up">${c.up} ↗</button><button data-answer="down">${c.down} ↘</button><button data-answer="same">${c.same} →</button></div><p id="quiz-feedback" aria-live="polite"></p></section>
      <details class="assumptions"><summary>${c.assumptions}<span>+</span></summary><h3>${c.assumptionTitle}</h3><ul id="assumption-list"></ul><a href="/methodology?lang=${lang}">${c.source} ↗</a></details>
    </main><footer><span>${c.footer}</span><span>${c.footerRight}</span></footer>`;
  $('#language').addEventListener('change',e=>{lang=e.target.value;render();});
  $('#price').addEventListener('input',e=>setPrice(Number(e.target.value)));
  document.querySelectorAll('[data-price]').forEach(el=>el.addEventListener('click',()=>setPrice(Number(el.dataset.price))));
  document.querySelectorAll('[data-focus]').forEach(el=>el.addEventListener('click',()=>focus(el.dataset.focus)));
  $('#toggle-view').addEventListener('click',()=>{mode2d=!mode2d;updateView();});
  $('#reset').addEventListener('click',()=>venue?.reset());
  $('#pause').addEventListener('click',()=>{paused=!paused;venue?.pause(paused);$('#pause').textContent=paused?'▷':'Ⅱ';$('#pause').setAttribute('aria-label',paused?t().resume:t().pause);});
  $('#ask-form').addEventListener('submit',e=>{e.preventDefault();ask($('#question').value);});
  $('#followup').addEventListener('click',()=>{const q=$('#followup').textContent;$('#question').value=q;ask(q);});
  document.querySelectorAll('[data-answer]').forEach(el=>el.addEventListener('click',()=>{ const right=el.dataset.answer==='up';$('#quiz-feedback').textContent=right?t().correct:t().incorrect;$('#quiz-feedback').className=right?'correct':'incorrect'; }));
  setPrice(price);updateView();initScene();
}
function showLesson(lesson){
  $('#explanation').textContent=lesson.explanation;
  $('#followup').textContent=lesson.suggestedFollowup;
  $('#delivery').textContent=!lesson.fallbackUsed?t().ai:['service-fallback','client-fallback'].includes(lesson.delivery)?t().fallback:t().prepared;
  $('#assumption-list').replaceChildren(...lesson.assumptions.map(s=>{const li=document.createElement('li');li.textContent=s;return li;}));
}
function setPrice(value){
  price=value;currentRequest++;$('#ask').disabled=false;$('#ask').textContent=t().ask;$('#form-error').textContent='';
  const c=calculate(price);
  $('#price').value=price;$('#price-value').textContent=format(price);$('#price').setAttribute('aria-valuetext',`${format(price)} ${t().units}`);
  $('#attendance').textContent=c.attendance;$('#capacity-fill').style.width=`${c.attendance/2}%`;
  $('#revenue').textContent=format(c.revenue);$('#total-cost').textContent=format(c.totalCost);
  $('#profit').textContent=format(c.profit);$('#profit-title').textContent=c.profit<0?t().loss:t().profit;
  $('.profit-card').classList.toggle('negative',c.profit<0);$('#return').textContent=`${format(c.returnOnCost)}%`;
  $('#delta').textContent=`${c.profit>=750?'+':''}${format(c.profit-750)}`;
  $('#flat-audience').textContent='● '.repeat(Math.ceil(c.attendance/5));
  $('#rev-bar').style.width=`${c.revenue/3200*100}%`;$('#cost-bar').style.width=`${c.totalCost/3200*100}%`;
  $('#rev-bar-label').textContent=format(c.revenue);$('#cost-bar-label').textContent=format(c.totalCost);
  venue?.setAttendance(c.attendance);
  showLesson(preparedLesson(requestFor(selected==='cost'?'cost':selected==='audience'?'audience':'profit')));
}
function focus(concept){
  selected=concept;currentRequest++;$('#ask').disabled=false;$('#ask').textContent=t().ask;
  document.querySelectorAll('[data-focus]').forEach(el=>el.classList.toggle('active',el.dataset.focus===concept));
  venue?.focus(concept);
  showLesson(preparedLesson(requestFor(concept==='cost'?'cost':concept==='audience'?'audience':'profit')));
}
function updateView(){
  $('#venue').hidden=mode2d;$('#flat-view').hidden=!mode2d;$('#toggle-view').textContent=mode2d?t().view3:t().view;
  venue?.pause(mode2d||paused);
}
async function initScene(){
  const target=$('#venue');
  try{
    const {createVenue}=await import('./scene.js');
    if(!target.isConnected)return;
    const instance=await createVenue(target,focus,()=>{});
    if(!target.isConnected){instance.dispose();return;}
    venue=instance;venue.setAttendance(calculate(price).attendance);venue.pause(paused||mode2d);$('#scene-loading').hidden=true;
    target.dataset.loaded='true';
  }catch(error){
    console.warn('3D venue unavailable:',String(error));
    if(!target.isConnected)return;
    $('#scene-loading').hidden=true;$('#scene-caption').textContent=t().sceneError;mode2d=true;updateView();
  }
}
async function ask(question){
  if(!question.trim()){$('#form-error').textContent=t().invalid;return;}
  const id=++currentRequest;const request=requestFor(question);$('#ask').disabled=true;$('#ask').textContent=t().asking;$('#form-error').textContent='';
  try{
    const response=await fetch('/api/lesson',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(request),signal:AbortSignal.timeout(21000)});
    const result=await response.json();
    if(id!==currentRequest)return;
    if(!response.ok){$('#form-error').textContent=result.error||t().error;return;}
    const lesson=validateLesson(result,request);showLesson(lesson);
    for(const action of lesson.sceneActions) if(action.type==='highlightStage')venue?.focus('cost');else if(action.type==='highlightEntrance')venue?.focus('revenue');else if(action.type==='setAudienceCount')venue?.focus('audience');
  }catch{if(id===currentRequest){showLesson(preparedLesson(request,'client-fallback'));$('#form-error').textContent=t().unavailable;}}
  finally{if(id===currentRequest){$('#ask').disabled=false;$('#ask').textContent=t().ask;}}
}

if(location.pathname==='/methodology'){
  const c=t();const lesson=preparedLesson(requestFor('profit'));
  $('#app').innerHTML=`<main class="methodology"><a href="/?lang=${lang}">← ${c.back}</a><h1>${c.methodology}</h1><p>${c.methText}</p><ul>${lesson.assumptions.map(s=>`<li>${s}</li>`).join('')}</ul><p>Revenue = price × guests<br>Total cost = 1,500 + 5 × guests<br>Profit = revenue − total cost<br>Return on cost = profit / total cost × 100</p><p>p = 20 → q = 150; revenue = 3,000; cost = 2,250; profit = 750<br>p = 30 → q = 100; revenue = 3,000; cost = 2,000; profit = 1,000</p><p>Model version: concert-v1. Source: the original Flow4Gold build brief, September 29, 2026.</p></main>`;
}else render();
