import {mediaPlan} from './media-plan.js';
export const storyCards=Object.fromEntries(Object.entries(mediaPlan).map(([kind,plan])=>[kind,Object.fromEntries(['en','de'].map(lang=>[lang,plan.steps.map(step=>[lang==='de'?step.titleDe:step.title,step.card[lang]])]))]));
