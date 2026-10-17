const clamp=x=>Math.max(0,Math.min(1,x));
const ease=(a,b,x)=>{const t=clamp((x-a)/(b-a));return t*t*(3-2*t);};
export function initMotion(){
 const root=document.documentElement,header=document.querySelector('.header');
 const query=matchMedia('(prefers-reduced-motion: reduce)');
 const hero=document.querySelector('.hero');
 const scenes=[...document.querySelectorAll('[data-scene]')];
 const surfaces=[...document.querySelectorAll('main>section, main>.footer')];
 let paused=false,frame=0,portal=null,portalPromise=null,px=0,py=0;
 let heroP=0;
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
  return clamp((innerHeight-r.top)/(innerHeight+r.height*.2));
 }
 function paint(){
  frame=0;header.classList.toggle('scrolled',scrollY>45);
  const current=surfaces.find(surface=>{const b=surface.getBoundingClientRect();return b.top<=header.offsetHeight&&b.bottom>header.offsetHeight;});
  root.dataset.world=current?.id||(current?.classList.contains('footer')?'footer':'uvod');
  const active=enabled();
  for(const scene of scenes){
   const box=scene.getBoundingClientRect();if(box.top>innerHeight*1.2||box.bottom< -innerHeight*.2)continue;
   const p=active?position(scene):1;
   scene.style.setProperty('--progress',p.toFixed(4));scene.dataset.progress=p.toFixed(3);
   if(scene.dataset.scene==='hero'){
    heroP=active?p:.32;
    scene.style.setProperty('--copy-out',ease(.43,.66,p).toFixed(4));
    scene.style.setProperty('--arrival',ease(.82,.98,p).toFixed(4));
    scene.style.setProperty('--logo-assembled',active?ease(.015,.42,p):1);
    scene.style.setProperty('--logo-merge',active?ease(.47,.81,p):0);
    if(portal)portal.paint(active?p:.32,active?px:0,active?py:0);
   }else if(scene.dataset.scene==='digital'){
    scene.style.setProperty('--branch',active?ease(0,.45,p):1);
    const mobile=innerWidth<=600;
    [...scene.querySelectorAll('.digital-project')].forEach((card,i)=>{
     const entry=mobile?clamp((innerHeight-(box.top+card.offsetTop+scene.querySelector('.digital-grid').offsetTop))/(innerHeight*.7)):ease(.02+i*.1,.38+i*.12,p);
     card.style.setProperty('--card',active?entry:1);
    });
   }else if(scene.dataset.scene==='bakery'){
    scene.style.setProperty('--bread',active?ease(.02,.73,p):1);
   }else if(scene.dataset.scene==='cleaning'){
    scene.style.setProperty('--clean',active?ease(.04,.8,p):1);
   }else if(scene.dataset.scene==='contact'){
    scene.style.setProperty('--contact-in',active?ease(.05,.6,p):1);
   }else if(scene.dataset.scene==='development'){
    const manual=scene.querySelector('.interface-preview').dataset.manual;
    const visual=scene.querySelector('.interface-motion');
    const composition=scene.querySelector('.interface-composition');
    const visualP=getComputedStyle(composition).position==='sticky'?position(visual,composition):p;
    scene.style.setProperty('--built',active&&!manual?ease(.02,.64,visualP):1);
    scene.style.setProperty('--filled',manual==='wireframe'?0:active&&!manual?ease(.25,.7,visualP):1);
    scene.querySelector('.development-copy').style.setProperty('--built',active&&!manual?ease(.02,.64,p):1);
   }
  }
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
 function mode(){root.classList.toggle('motion-enabled',enabled());root.classList.toggle('motion-reduced',!enabled());queue();if(enabled())startPortal();}
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
 root.classList.add('has-motion-js');mode();
 addEventListener('scroll',queue,{passive:true});addEventListener('resize',queue,{passive:true});
 if(matchMedia('(pointer:fine)').matches)addEventListener('pointermove',pointer,{passive:true});
 query.addEventListener('change',mode);
 document.addEventListener('conceptchange',queue);
 addEventListener('hashchange',alignProjectHash);requestAnimationFrame(alignProjectHash);
 // A repeated anchor click does not fire hashchange; align its pinned scene again.
 document.addEventListener('click',event=>{
  if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  const href=event.target.closest('a')?.getAttribute('href');
  if(href?.startsWith('#')&&href===location.hash)requestAnimationFrame(alignProjectHash);
 });
 addEventListener('pagehide',()=>{cancelAnimationFrame(frame);portal?.dispose();portal=null;});
 addEventListener('pageshow',e=>{if(e.persisted){portalPromise=null;startPortal();queue();}});
 return {setPaused(value){
  const anchor=[...document.querySelectorAll('main>section')].find(el=>{const b=el.getBoundingClientRect();return b.top<=innerHeight*.5&&b.bottom>innerHeight*.5;});
  paused=value;mode();
  if(anchor)scrollTo({top:scrollY+anchor.getBoundingClientRect().top,behavior:'instant'});
 }};
}
