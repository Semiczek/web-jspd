import {readFile,stat} from 'node:fs/promises';
import {projects} from '../src/projects.mjs';
const root=new URL('../dist/',import.meta.url);const html=await readFile(new URL('index.html',root),'utf8');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
const errors=[];
if(ids.length!==new Set(ids).size)errors.push('Duplicate IDs');
for(const [,hash]of html.matchAll(/href="#([^"]*)"/g))if(!hash||!ids.includes(hash))errors.push('Missing hash: '+hash);
for(const [,file]of html.matchAll(/(?:src|href|srcset)="(assets\/[^" ]+|[^" ]+\.css|[^" ]+\.js)"/g)){try{await stat(new URL(file,root));}catch{errors.push('Missing asset: '+file);}}
for(const p of projects)if(!html.includes(`id="${p.id}"`))errors.push('Missing project '+p.id);
if(!html.includes('name="robots" content="index, follow"'))errors.push('Production indexing not configured');
if(!html.includes('rel="canonical" href="https://jspd.cz/"'))errors.push('Production canonical missing');
const visitorText=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<[^>]*>/g,' ');
if(/koncept|lokální náhled/i.test(visitorText))errors.push('Draft copy is still visible');
if(/href="#"/.test(html))errors.push('Empty navigation link');
if(/<!-- (?:DIGITAL|FOOTER|PROJECT)/.test(html))errors.push('Unrendered template');
if(errors.length){console.error(errors);process.exit(1);}console.log('PASS: project sections, assets, unique IDs, hash links and production copy/metadata');
