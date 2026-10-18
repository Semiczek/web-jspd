const clamp=x=>Math.max(0,Math.min(1,x));
const ease=(a,b,x)=>{const t=clamp((x-a)/(b-a));return t*t*(3-2*t);};
export function initMotion(){
 const root=document.documentElement,header=document.querySelector('.header');
 const query=matchMedia('(prefers-reduced-motion: reduce)');
 const hero=document.querySelector('.hero');
 const scenes=[...document.querySelectorAll('[data-scene]')];
 const surfaces=[...document.querySelectorAll('main>section, main>.footer')];
 let paused=false,frame=0,portal=null,portalPromise=null,px=0,py=0;
 let heroP=0,bookmark=null;
 let phases=new WeakMap(),settling=false;
 function readingPosition(){
  const element=[...document.querySelectorAll('main h1,main h2,main h3,main p,main a,main input,main textarea')].find(el=>{const r=el.getBoundingClientRect();return r.top>=header.offsetHeight&&r.top<innerHeight&&r.height>0;});
  return element?{element,top:element.getBoundingClientRect().top}:null;
 }
 const enabled=()=>!paused&&!query.matches;
 function position(el,stage=el.querySelector('.scene-stage')){
  const r=el.getBoundingClientRect();
  const pinned=stage&&getComputedStyle(stage).position==='sticky';
  if(pinned){
   const inset=parseFloat(getComputedStyle(stage).top)||0;
   return clamp((inset-r.top)/Math.max(1,r.height-stage.offsetHeight));
  }
  // A short landscape layout must still start with scattered logo pieces.
  if(el===hero)return clamp(-r.top/Math.max(1,r.height*.65));
  return clamp((innerHeight*.65-r.top)/(innerHeight*.65+r.height*.65));
 }
 function artworkPosition(element){
  const r=element.getBoundingClientRect();
  // Finish when the artwork reaches the middle, not while its text enters.
  return clamp((innerHeight*.9-r.top)/(innerHeight*.4+r.height*.5));
 }
 function follow(scene,key,target,active){
  let state=phases.get(scene);if(!state){state={};phases.set(scene,state);}
  const previous=state[key]??target;
  const value=!active||Math.abs(target-previous)<.0006?target:previous+(target-previous)*.18;
  if(Math.abs(target-value)>=.0006)settling=true;
  state[key]=value;return value;
 }
 function paint(){
  frame=0;settling=false;header.classList.toggle('scrolled',scrollY>45);
  const current=surfaces.find(surface=>{const b=surface.getBoundingClientRect();return b.top<=header.offsetHeight&&b.bottom>header.offsetHeight;});
  root.dataset.world=current?.id||(current?.classList.contains('footer')?'footer':'uvod');
  const active=enabled();
  for(const scene of scenes){
   const box=scene.getBoundingClientRect();
   scene.dataset.inView=String(active&&box.top<innerHeight&&box.bottom>0);
   if(box.top>innerHeight*1.2||box.bottom< -innerHeight*.2)continue;
   const p=follow(scene,'scene',active?position(scene):1,active);
   const stage=scene.querySelector('.scene-stage');
   const pinned=stage&&getComputedStyle(stage).position==='sticky';
   scene.style.setProperty('--progress',p.toFixed(4));scene.dataset.progress=p.toFixed(3);
   if(scene.dataset.scene==='hero'){
    // Play both the scattered-symbol and full-wordmark phases.
    heroP=active?(pinned?p:clamp(p*2.4)):1;
    scene.dataset.logoProgress=heroP.toFixed(3);
    scene.style.setProperty('--logo-assembled',active?ease(.015,.42,heroP):1);
    scene.style.setProperty('--logo-merge',active?ease(.47,.81,heroP):0);
    scene.style.setProperty('--hero-arrival',active?ease(.8,.97,heroP):0);
    if(portal)portal.paint(heroP,active?px:0,active?py:0);
   }else if(scene.dataset.scene==='digital'){
    const dp=active?(pinned?p:follow(scene,'art',artworkPosition(scene.querySelector('.diri-portrait')),active)):1;
    scene.style.setProperty('--diri-draw',active?ease(.02,.35,dp):1);
    scene.style.setProperty('--diri-enter',active?ease(.2,.67,dp):1);
    scene.style.setProperty('--diri-settle',active?ease(.65,.92,dp):1);
    scene.style.setProperty('--branch',active?ease(.02,.35,dp):1);
    [...scene.querySelectorAll('.digital-project')].forEach(card=>{
     card.style.setProperty('--card',active?ease(.2,.67,dp):1);
    });
   }else if(scene.dataset.scene==='bakery'){
    scene.style.setProperty('--bread',active?ease(.05,.82,p):1);
   }else if(scene.dataset.scene==='cleaning'){
    const mobile=matchMedia('(max-width:700px)').matches;
    const cp=mobile?follow(scene,'art',artworkPosition(scene.querySelector('.cleaning-image')),active):p;
    scene.style.setProperty('--clean',active?ease(.04,.88,cp):1);
   }else if(scene.dataset.scene==='tech'){
    const tp=active?(pinned?p:follow(scene,'art',artworkPosition(scene.querySelector('.tech-visual')),active)):1;
    scene.style.setProperty('--tech-frame',active?ease(.03,.4,tp):1);
    scene.style.setProperty('--tech-fill',active?ease(.4,.66,tp):1);
    scene.style.setProperty('--tech-depth',active?ease(.63,.88,tp):1);
   }
  }
  bookmark=readingPosition();
  root.dataset.motionSettled=String(!settling);
  if(settling)queue();
 }
 function queue(){if(!frame)frame=requestAnimationFrame(paint);}
 async function startPortal(){
  if(portal||portalPromise||!enabled())return;
  portalPromise=import('./portal.js').then(async({createPortal})=>{
   if(!enabled())return;
   portal=await createPortal(document.querySelector('.portal-canvas'));
   if(portal){hero.classList.add('webgl-ready');portal.paint(heroP,px,py);}
   else root.classList.add('no-webgl');
  }).catch(()=>{hero.classList.remove('webgl-ready');root.classList.add('no-webgl');}).finally(()=>{portalPromise=null;});
 }
 function mode(preserve=true){
  // A system media query can alter CSS before its change callback runs.
  const anchor=preserve?.type==='change'?bookmark:preserve?readingPosition():null;
  phases=new WeakMap();root.classList.toggle('motion-enabled',enabled());root.classList.toggle('motion-reduced',!enabled());root.classList.toggle('no-motion',!enabled());
  if(anchor)scrollBy({top:anchor.element.getBoundingClientRect().top-anchor.top,behavior:'instant'});
  queue();if(enabled())startPortal();
  document.dispatchEvent(new CustomEvent('motionmodechange',{detail:{reduced:!enabled(),system:query.matches}}));
 }
 function pointer(event){if(!enabled()||hero.getBoundingClientRect().bottom<0)return;px=(event.clientX/innerWidth-.5)*2;py=(event.clientY/innerHeight-.5)*2;queue();}
 function alignProjectHash(){
  const id=decodeURIComponent(location.hash.slice(1));if(!id)return;
  const target=document.getElementById(id);
  if(target?.classList.contains('digital-project')){
   const scene=target.closest('[data-scene]');
   if(getComputedStyle(scene.querySelector('.scene-stage')).position==='sticky'){
    scrollTo({top:scrollY+scene.getBoundingClientRect().top+(scene.offsetHeight-innerHeight)*.64,behavior:'instant'});
   }
  }
  queue();
 }
 root.classList.add('has-motion-js');mode(false);
 addEventListener('scroll',queue,{passive:true});addEventListener('resize',()=>{phases=new WeakMap();queue();},{passive:true});
 if(matchMedia('(pointer:fine)').matches)addEventListener('pointermove',pointer,{passive:true});
 query.addEventListener('change',mode);
 addEventListener('hashchange',alignProjectHash);requestAnimationFrame(alignProjectHash);
 // A repeated anchor click does not fire hashchange; align its pinned scene again.
 document.addEventListener('click',event=>{
  if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  const href=event.target.closest('a')?.getAttribute('href');
  if(href?.startsWith('#')&&href===location.hash)requestAnimationFrame(alignProjectHash);
 });
 addEventListener('pagehide',()=>{cancelAnimationFrame(frame);frame=0;portal?.dispose();portal=null;});
 addEventListener('pageshow',e=>{if(e.persisted){portalPromise=null;startPortal();queue();}});
 return {setPaused(value){paused=value;mode();}};
}
