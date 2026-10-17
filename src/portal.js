import * as THREE from './assets/vendor/three/three.module.min.js';
const smooth=(a,b,x)=>{const t=THREE.MathUtils.clamp((x-a)/(b-a),0,1);return t*t*(3-2*t);};
// Deliberate initial poses, in logo units. Each fragment pivots around its own
// original alpha centroid and returns exactly to its original pixel placement.
const scatter=[
 {x:-1.5,y:.45,z:.45,rx:.22,ry:-.32,rz:-.72},
 {x:-.55,y:1.05,z:-.55,rx:-.28,ry:.38,rz:.67},
 {x:.25,y:-.85,z:.4,rx:.2,ry:-.3,rz:-.55},
 {x:-1.1,y:-1.15,z:-.35,rx:-.23,ry:.33,rz:.82},
 {x:1.25,y:.6,z:-.45,rx:.25,ry:.28,rz:-.62}
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
  const mobile=w<=600,tablet=w<=900,assembled=smooth(.015,.42,p),merge=smooth(.47,.81,p),arrival=smooth(.81,1,p),viewHeight=2*Math.tan(35*Math.PI/360)*10,viewWidth=viewHeight*w/h;
  const compact=mobile&&h<740;
  const restingScale=mobile?(compact?.32:.39):tablet?.7:.98;
  const scatteredScale=mobile?(compact?.23:.27):Math.min(restingScale*.78,viewWidth*.4/5.2);
  const initialScale=THREE.MathUtils.lerp(scatteredScale,restingScale,assembled),finalScale=Math.min(mobile?.29:.65,viewWidth*.75/8.7),scale=THREE.MathUtils.lerp(initialScale,finalScale,merge);
  group.scale.setScalar(scale);
  const initialX=mobile?0:viewWidth*.27,initialY=mobile?viewHeight*(compact?.22:.25):0;
  group.position.set(THREE.MathUtils.lerp(initialX,-2.7*finalScale,merge),THREE.MathUtils.lerp(initialY,viewHeight*.22,merge),0);
  group.rotation.set(py*.025*(1-merge),(-.13+px*.045)*(1-merge),-.025*(1-merge));
  for(let i=0;i<pieces.length;i++){
   const t=1-smooth(.01+i*.012,.34+i*.02,p),{mesh,pivot,home,pose}=pieces[i];
   pivot.position.set(home.x+pose.x*t,home.y+pose.y*t,pose.z*t);
   pivot.rotation.set(t*pose.rx,t*pose.ry,t*pose.rz);mesh.material.opacity=1-arrival*.04;
  }
  wordmark.position.set(518/450*4+(1-merge)*.6,-20/450*4,0);wordmark.material.opacity=smooth(.56,.81,p);renderer.render(scene,camera);
 }
 function onLost(event){event.preventDefault();lost=true;canvas.closest('.hero').classList.remove('webgl-ready');document.documentElement.classList.add('no-webgl');}
 function onRestored(){lost=false;paint();canvas.closest('.hero').classList.add('webgl-ready');document.documentElement.classList.remove('no-webgl');}
 canvas.addEventListener('webglcontextlost',onLost);canvas.addEventListener('webglcontextrestored',onRestored);paint();
 return{paint,dispose(){disposed=true;canvas.removeEventListener('webglcontextlost',onLost);canvas.removeEventListener('webglcontextrestored',onRestored);geometry.dispose();for(const {mesh} of pieces)mesh.material.dispose();for(const texture of textures)texture.dispose();wordmark.geometry.dispose();wordmark.material.dispose();wordTexture.dispose();renderer.dispose();}};
}
