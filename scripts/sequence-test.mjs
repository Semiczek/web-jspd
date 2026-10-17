import assert from 'node:assert/strict';
import {SequencePlayer} from '../src/sequence-player.js';
globalThis.devicePixelRatio=3;globalThis.ResizeObserver=class{observe(){}disconnect(){}};
let reduced=false;globalThis.matchMedia=()=>({get matches(){return reduced},addEventListener(){},removeEventListener(){}});
const draws=[];let closed=0;
globalThis.createImageBitmap=async n=>({width:1536,height:1024,n,close(){closed++}});
globalThis.fetch=async url=>({ok:url!=='bad',status:404,blob:async()=>url});
const canvas={width:0,height:0,hidden:true,getContext:()=>({drawImage:b=>draws.push(b.n)}),getBoundingClientRect:()=>({width:300,height:200})};
const errors=[];const p=new SequencePlayer(canvas,['a','b','bad','c'],{cacheSize:2,onError:e=>errors.push(e)});
await p.setProgress(-1);assert.equal(draws.at(-1),'a');assert.equal(canvas.width,450);assert.equal(canvas.hidden,false);
await p.setProgress(1/3);await p.setProgress(0);assert.equal(draws.at(-1),'a');
await p.setProgress(2/3);assert.equal(errors.length,1);assert.equal(draws.at(-1),'a');
await p.setProgress(1);assert.equal(p.cache.size,2);assert.equal(closed,1);
let resolveSlow;globalThis.fetch=url=>url==='a'?new Promise(r=>{resolveSlow=()=>r({ok:true,blob:async()=>url})}):Promise.resolve({ok:true,blob:async()=>url});
const q=new SequencePlayer(canvas,['a','b']);const old=q.setProgress(0);await q.setProgress(1);resolveSlow();await old;assert.equal(q.current.bitmap.n,'b');
reduced=true;let count=draws.length;await q.setProgress(0);assert.equal(draws.length,count);q.preference();assert.equal(canvas.hidden,true);
q.destroy();p.destroy();assert.equal(q.cache.size,0);assert.equal(p.cache.size,0);
console.log('PASS: frame clamping, DPR cap, cache eviction, last frame on error, stale-response protection, reduced motion and bitmap cleanup');

