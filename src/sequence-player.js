/** Optional frame player for the final bakery film. Not mounted without approved frames.
 * Poster stays in HTML underneath the canvas. Call setProgress(0..1), then destroy().
 * Only the desired frame is loaded; nearby decoded frames form an LRU cache of <=7.
 */
export class SequencePlayer {
  constructor(canvas, urls, {cacheSize=7, onError=()=>{}}={}) {
    this.canvas=canvas;this.urls=urls;this.cacheSize=Math.max(1,Math.min(cacheSize,12));this.onError=onError;
    this.cache=new Map();this.request=null;this.version=0;this.current=null;this.destroyed=false;
    this.context=canvas.getContext('2d',{alpha:false});
    this.resizeObserver=new ResizeObserver(()=>this.draw());this.resizeObserver.observe(canvas);
    this.reduced=matchMedia('(prefers-reduced-motion: reduce)');
    this.preference=()=>{if(this.reduced.matches){this.version++;this.request?.abort();canvas.hidden=true;}else if(this.current)this.draw();};
    this.reduced.addEventListener('change',this.preference);canvas.hidden=true;
  }
  async setProgress(progress) {
    if(this.destroyed||!this.urls.length||!this.context||this.reduced.matches)return;
    const index=Math.round(Math.max(0,Math.min(1,Number(progress)||0))*(this.urls.length-1));
    if(this.current?.index===index)return;
    const version=++this.version;this.request?.abort();
    if(this.cache.has(index)){this.current={index,bitmap:this.cache.get(index)};this.cache.delete(index);this.cache.set(index,this.current.bitmap);this.draw();return;}
    const controller=new AbortController();this.request=controller;
    try {
      const response=await fetch(this.urls[index],{signal:controller.signal});if(!response.ok)throw Error(`Frame ${index}: ${response.status}`);
      const bitmap=await createImageBitmap(await response.blob());
      if(this.destroyed||version!==this.version){bitmap.close();return;}
      this.cache.set(index,bitmap);this.current={index,bitmap};
      while(this.cache.size>this.cacheSize){const oldest=this.cache.keys().next().value;this.cache.get(oldest).close();this.cache.delete(oldest);}
      this.draw();
    }catch(error){if(error.name!=='AbortError'&&version===this.version)this.onError(error);}
  }
  draw(){
    if(this.destroyed||this.reduced.matches||!this.current||!this.context)return;
    const bounds=this.canvas.getBoundingClientRect();if(bounds.width<=0||bounds.height<=0)return;
    const dpr=Math.min(devicePixelRatio||1,1.5);const w=Math.round(bounds.width*dpr),h=Math.round(bounds.height*dpr);
    if(this.canvas.width!==w)this.canvas.width=w;if(this.canvas.height!==h)this.canvas.height=h;
    const frame=this.current.bitmap;const scale=Math.max(w/frame.width,h/frame.height);const fw=frame.width*scale,fh=frame.height*scale;
    this.context.drawImage(frame,(w-fw)/2,(h-fh)/2,fw,fh);this.canvas.hidden=false;
  }
  destroy(){this.destroyed=true;this.version++;this.request?.abort();this.resizeObserver.disconnect();this.reduced.removeEventListener('change',this.preference);for(const bitmap of this.cache.values())bitmap.close();this.cache.clear();this.current=null;this.canvas.hidden=true;}
}
