import { readFile } from 'node:fs/promises';
import { projects } from '../src/projects.mjs';
const esc = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export async function render() {
 let html = await readFile(new URL('../src/index.html', import.meta.url), 'utf8');
 const list = projects.map((p,i)=>`<a href="${p.url||'#'+p.id}" ${p.url?'target="_blank" rel="noopener noreferrer"':''} data-project="${p.id}"><span class="project-no">0${i+1}</span><span class="project-name">${esc(p.name)}</span><span class="project-category">${esc(p.category)}</span><span class="project-action">${p.url?'Otevřít web':'Prozkoumat'}</span></a>`).join('\n');
 const digital = projects.slice(0,3).map((p,i)=>`<article class="digital-project${p.character?' digital-project-character':''}" id="${p.id}">
  <div class="branch-end" aria-hidden="true"></div><p class="project-index">DIRI / 0${i+1}</p>
  <div class="digital-identity">
   <h3>${p.logo?`<span class="diriqo-wordmark"><img src="${p.logo}" width="52" height="52" alt=""><span>diriqo</span></span>`:esc(p.name)}</h3>
   ${p.character?`<div class="diriqent-character"><img src="${esc(p.character)}" width="512" height="768" alt="Fialová chlupatá postava Diriqenta s motýlkem a palcem nahoru" loading="lazy" decoding="async"></div>`:''}
  </div>
  <p class="digital-description">${esc(p.description)}</p>
  ${p.status?`<p class="product-status">${esc(p.status)}</p>`:`<p class="product-domain">${esc(p.domain)}</p>`}
  <a class="text-link" href="${p.url||'#kontakt'}" ${p.url?'target="_blank" rel="noopener noreferrer"':`data-interest="${p.name}"`}>${p.url?'Otevřít '+esc(p.name):'Zeptat se na '+esc(p.name)}</a>
 </article>`).join('\n');
 const origin = new URL(process.env.SITE_ORIGIN || 'https://jspd.cz').origin;
 return html.replaceAll('{{SITE_ORIGIN}}',esc(origin)).replace(/<!-- PROJECT_LIST_START -->[\s\S]*?<!-- PROJECT_LIST_END -->/,list).replace('<!-- DIGITAL_PROJECTS -->',digital).replace('<!-- FOOTER_PROJECTS -->',projects.map(p=>`<a href="#${p.id}">${esc(p.name)}</a>`).join(''));
}
