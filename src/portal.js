import * as THREE from './assets/vendor/three/three.module.min.js';
const smooth=(a,b,x)=>{const t=THREE.MathUtils.clamp((x-a)/(b-a),0,1);return t*t*(3-2*t);};
// Deliberate initial poses, in logo units. Each fragment pivots around its own
// original alpha centroid and returns exactly to its original pixel placement.
const scatter=[
 {x:-2.25,y:.75,z:1.6,rx:.48,ry:-.78,rz:-1.12},
 {x:-.55,y:1.65,z:-1.45,rx:-.62,ry:.9,rz:1.04},
 {x:.65,y:-1.55,z:1.2,rx:.52,ry:-.72,rz:-.92},
 {x:-1.85,y:-1.9,z:-1.1,rx:-.58,ry:.83,rz:1.25},
 {x:1.95,y:1.15,z:-1.4,rx:.62,ry:.75,rz:-1.04}
];

// Original RGBA pixels, separated by connected alpha components. No tracing.
function logoTextures(image){
 const w=320,h=450,source=document.createElement('canvas');source.width=w;source.height=h;
 const context=source.getContext('2d',{willReadFrequently:true});context.drawImage(image,0,0);
 const pixels=context.getImageData(0,0,w,h),labels=new Int32Array(w*h),components=[];
 for(let start=0;start<w*h;start++){
  if(labels[start]||!pixels.data[start*4+3])continue;
  const id=components.length+1,queue=[start];labels[start]=id;let sumX=0,sumY=0;
  for(let k=0;k<queue.length;k++){
   const at=queue[k],x=at%w,y=Math.floor(at/w);sumX+=x;sumY+=y;
   for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
    const nx=x+dx,ny=y+dy,ni=ny*w+nx;
    if(nx<0||nx>=w||ny<0||ny>=h||labels[ni]||!pixels.data[ni*4+3])continue;
    labels[ni]=id;queue.push(ni);
   }
  }
  components.push({id,indices:queue,x:sumX/queue.length,y:sumY/queue.length});
 }
 const main=components.filter(c=>c.indices.length>1000).sort((a,b)=>a.x-b.x);
 if(main.length!==5)throw new Error('Official logo components could not be read');
 for(const small of components.filter(c=>c.indices.length<=1000)){
  const nearest=main.reduce((a,b)=>Math.hypot(a.x-small.x,a.y-small.y)<Math.hypot(b.x-small.x,b.y-small.y)?a:b);
  nearest.indices.push(...small.indices);
 }
 return main.map(component=>{
  const layer=document.createElement('canvas');layer.width=w;layer.height=h;
  const c=layer.getContext('2d'),data=c.createImageData(w,h);
  let totalAlpha=0,centerX=0,centerY=0;
  for(const index of component.indices){
   data.data.set(pixels.data.subarray(index*4,index*4+4),index*4);
   const alpha=pixels.data[index*4+3];totalAlpha+=alpha;centerX+=(index%w+.5)*alpha;centerY+=(Math.floor(index/w)+.5)*alpha;
  }
  c.putImageData(data,0,0);const texture=new THREE.CanvasTexture(layer);texture.colorSpace=THREE.SRGBColorSpace;
  texture.userData.center=[(centerX/totalAlpha-w/2)*4/h,(h/2-centerY/totalAlpha)*4/h];return texture;
 });
}
export async function createPortal(canvas){
 let renderer;
 try{renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});}catch{return null;}
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;
 let image;
 try{image=new Image();image.src=new URL('./assets/holding-logo.png',import.meta.url).href;await image.decode();}catch{renderer.dispose();return null;}
 let textures;try{textures=logoTextures(image);}catch{renderer.dispose();return null;}
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,.1,50),group=new THREE.Group();scene.add(group);camera.position.z=10;
 const geometry=new THREE.PlaneGeometry(320/450*4,4);
 const pieces=textures.map((map,index)=>{
  const material=new THREE.MeshBasicMaterial({map,transparent:true,side:THREE.DoubleSide,depthWrite:false,toneMapped:false});
  const mesh=new THREE.Mesh(geometry,material),pivot=new THREE.Group(),[x,y]=map.userData.center;
  mesh.position.set(-x,-y,0);pivot.add(mesh);group.add(pivot);
  return{mesh,pivot,home:new THREE.Vector3(x,y,0),pose:scatter[index]};
 });
 const wordCanvas=document.createElement('canvas');wordCanvas.width=620;wordCanvas.height=360;wordCanvas.getContext('2d').drawImage(image,368,65,620,360,0,0,620,360);
 const wordTexture=new THREE.CanvasTexture(wordCanvas);wordTexture.colorSpace=THREE.SRGBColorSpace;
 const wordmark=new THREE.Mesh(new THREE.PlaneGeometry(620/450*4,360/450*4),new THREE.MeshBasicMaterial({map:wordTexture,transparent:true,depthWrite:false,toneMapped:false}));group.add(wordmark);
 let progress=0,pointerX=0,pointerY=0,disposed=false,lost=false,w=0,h=0;
 function paint(p=progress,px=pointerX,py=pointerY){
  if(disposed||lost)return;progress=p;pointerX=px;pointerY=py;
  const box=canvas.getBoundingClientRect();if(!box.width||!box.height)return;
  if(w!==box.width||h!==box.height){w=box.width;h=box.height;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
  const mobile=matchMedia('(max-width:700px)').matches,tablet=matchMedia('(max-width:1099px)').matches,assembled=smooth(.015,.42,p),merge=mobile||matchMedia('(min-height:600px)').matches?smooth(.47,.81,p):0,arrival=smooth(.81,1,p),viewHeight=2*Math.tan(35*Math.PI/360)*10,viewWidth=viewHeight*w/h;
  const compact=mobile&&h<740;
  const restingScale=mobile?viewHeight*(compact?106:140)/h/4:tablet?.7:.98;
  const scatteredScale=mobile?restingScale*.58:Math.min(restingScale*.68,viewWidth*.4/7.4);
  const copy=canvas.closest('.hero-stage').querySelector('.hero-copy');
  const eyebrow=copy.querySelector('.eyebrow');
  const naturalBottom=copy.offsetTop+copy.offsetHeight-parseFloat(getComputedStyle(copy).paddingBottom);
  const copyShift=mobile?0:Math.max(0,Math.min(h*.22,h-65-naturalBottom));
  const logoHeight=mobile?0:Math.max(50,Math.min(h*.36,copy.offsetTop+eyebrow.offsetTop+copyShift-135));
  const targetY=mobile?0:viewHeight*(.5-(105+logoHeight/2)/h);
  const finalScale=mobile?Math.min(.29,viewWidth*.7/8.7):Math.min(.75,logoHeight/h*viewHeight/4,viewWidth*.73/8.7);
  canvas.closest('.hero').style.setProperty('--copy-shift',`${copyShift}px`);
  canvas.closest('.hero').style.setProperty('--logo-caption-y',`${105+logoHeight+12}px`);
  const initialScale=THREE.MathUtils.lerp(scatteredScale,restingScale,assembled),scale=THREE.MathUtils.lerp(initialScale,finalScale,merge);
  group.scale.setScalar(scale);
  const initialX=mobile?0:viewWidth*.27,initialY=mobile?viewHeight*(.5-(compact?138:165)/h):0;
  group.position.set(THREE.MathUtils.lerp(initialX,-2.9*finalScale,merge),THREE.MathUtils.lerp(initialY,mobile?initialY:targetY,merge),0);
  group.rotation.set(py*.025*(1-merge),(-.13+px*.045)*(1-merge),-.025*(1-merge));
  for(let i=0;i<pieces.length;i++){
   const t=1-smooth(.01+i*.012,.34+i*.02,p),{mesh,pivot,home,pose}=pieces[i];
   const arc=Math.sin(t*Math.PI);
   pivot.position.set(home.x+pose.x*t+arc*(i%2?.32:-.32),home.y+pose.y*t+arc*.35,pose.z*t);
   pivot.rotation.set(t*pose.rx,t*pose.ry,t*pose.rz);mesh.material.opacity=1-arrival*.04;
  }
  wordmark.position.set(518/450*4+(1-merge)*.6,-20/450*4,0);wordmark.material.opacity=merge?smooth(.65,.84,p):0;renderer.render(scene,camera);
 }
 function onLost(event){event.preventDefault();lost=true;canvas.closest('.hero').classList.remove('webgl-ready');document.documentElement.classList.add('no-webgl');}
 function onRestored(){lost=false;paint();canvas.closest('.hero').classList.add('webgl-ready');document.documentElement.classList.remove('no-webgl');}
 canvas.addEventListener('webglcontextlost',onLost);canvas.addEventListener('webglcontextrestored',onRestored);paint();
 return{paint,dispose(){disposed=true;canvas.removeEventListener('webglcontextlost',onLost);canvas.removeEventListener('webglcontextrestored',onRestored);geometry.dispose();for(const {mesh} of pieces)mesh.material.dispose();for(const texture of textures)texture.dispose();wordmark.geometry.dispose();wordmark.material.dispose();wordTexture.dispose();renderer.dispose();}};
}
