import express from 'express';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { validateRequest, preparedLesson, validateLesson } from '../shared/lesson.js';
import { mountVoice } from './voice.js';

const app = express();
const production = process.argv.includes('--production');
app.disable('x-powered-by');
app.set('trust proxy', Number(process.env.TRUST_PROXY_HOPS || 0));
app.use(helmet({ contentSecurityPolicy: production ? { directives: { defaultSrc: ["'self'"], scriptSrc: ["'self'"], styleSrc: ["'self'", "'unsafe-inline'"], imgSrc: ["'self'", 'data:', 'blob:'],mediaSrc:["'self'",'blob:'], connectSrc: ["'self'"], workerSrc: ["'self'", 'blob:'] } } : false, crossOriginEmbedderPolicy: false }));
app.use(express.json({ limit: '8kb' }));
mountVoice(app);
const limit = rateLimit({ windowMs: 60000, limit: 12, standardHeaders: 'draft-8', legacyHeaders: false, message: { error: 'Please wait a minute before asking another question. / Bitte warte eine Minute.' } });
// Global per-process budget protects a single demo instance. Use a shared store when scaling.
let daily = { day: '', count: 0 };
app.get('/api/health', (_req,res) => res.json({ ok:true, mode: process.env.N8N_WEBHOOK_URL ? 'n8n-configured' : 'prepared-lessons' }));
app.post('/api/lesson', limit, async (req,res) => {
  res.set('Cache-Control','no-store');
  const origin = req.get('origin');
  const allowedOrigin = process.env.PUBLIC_ORIGIN || `${req.protocol}://${req.get('host')}`;
  if (origin && origin !== allowedOrigin) return res.status(403).json({ error: 'This origin is not allowed.' });
  let input;
  try { input = validateRequest(req.body); } catch (err) { return res.status(400).json({ error: err.message }); }
  const started = Date.now();
  const day = new Date().toISOString().slice(0,10);
  if (daily.day !== day) daily = { day, count: 0 };
  let output = preparedLesson(input, 'prepared');
  if (process.env.N8N_WEBHOOK_URL && process.env.N8N_WEBHOOK_SECRET && daily.count < 300) {
    daily.count++;
    try {
      const upstream = await fetch(process.env.N8N_WEBHOOK_URL, { method:'POST', headers:{ 'Content-Type':'application/json', 'X-Lesson-Key':process.env.N8N_WEBHOOK_SECRET }, body:JSON.stringify(input), signal:AbortSignal.timeout(18000) });
      if (!upstream.ok) throw new Error('upstream');
      output = validateLesson(await upstream.json(),input);
    } catch { output = preparedLesson(input,'service-fallback'); }
  } else if (daily.count >= 300) output = preparedLesson(input,'budget-fallback');
  // No question, session identifier, IP address, or credentials in application logs.
  console.log(JSON.stringify({ event:'lesson', language:input.language, delivery:output.delivery, fallback:output.fallbackUsed, durationMs:Date.now()-started }));
  return res.json(output);
});
app.use('/api', (_req,res) => res.status(404).json({ error:'Endpoint not found.' }));
// Only the concert is published. Retired lesson URLs and media must not reach the SPA fallback.
app.use((req,res,next)=>{
  const unsupportedLesson=(req.path.startsWith('/lessons/')&&!['/lessons/concert','/lessons/concert-economics'].includes(req.path.replace(/\/$/,'')))||(req.query.lesson&&!['concert','concert-economics'].includes(req.query.lesson));
  const unsupportedAsset=(req.path.startsWith('/models/')&&req.path!=='/models/concert.glb')||(req.path.startsWith('/media/')&&!/^\/media\/concert-(en|de)(\.mp4|\.vtt|\.txt|-poster\.jpg)$/.test(req.path));
  if(unsupportedLesson||unsupportedAsset)return res.status(404).type('html').send('<!doctype html><html lang="en"><meta charset="utf-8"><title>Page unavailable</title><h1>This page is no longer available.</h1><a href="/">Open The concert</a></html>');
  next();
});
const root = fileURLToPath(new URL('../',import.meta.url));
if (production) {
  app.use(express.static(resolve(root,'dist')));
  app.get('/{*path}',(_req,res) => res.sendFile(resolve(root,'dist/index.html')));
} else {
  const { createServer } = await import('vite');
  const vite = await createServer({ root, server:{ middlewareMode:true, allowedHosts:['localhost'],hmr:false }, appType:'spa' });
  app.use(vite.middlewares);
}
app.use((err,_req,res,_next) => res.status(err.status === 413 ? 413 : 400).json({ error:'Request could not be read. Please send a small JSON lesson request.' }));
app.listen(Number(process.env.PORT || 3000),'0.0.0.0',error => {if(error)throw error;console.log(`Economics of Everything: http://localhost:${process.env.PORT || 3000}`);});
