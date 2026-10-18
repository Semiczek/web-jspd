import { readFile } from 'node:fs/promises';
import { projects } from '../src/projects.mjs';
import { techCinemaMarkup } from '../src/tech-cinema.mjs';
import { diriCinemaMarkup } from '../src/diri-cinema.mjs';
const esc = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export async function render() {
 let html = await readFile(new URL('../src/index.html', import.meta.url), 'utf8');
 const list = projects.map((p,i)=>`<a href="${p.url||'#'+p.id}" ${p.url?'target="_blank" rel="noopener noreferrer"':''} data-project="${p.id}"><span class="project-no">0${i+1}</span><span class="project-name">${esc(p.name)}</span><span class="project-category">${esc(p.category)}</span><span class="project-action">${p.url?'Otevřít web':'Prozkoumat'}</span></a>`).join('\n');
 const digital = projects.filter(p=>p.id==='diriqent').map(p=>`<article class="digital-project diri-feature" id="${p.id}">
  <div class="diri-story">
   <span class="diri-status"><i aria-hidden="true"></i>${esc(p.status)}</span>
   <h2 id="diri-title">${esc(p.name)}.<br><em>Váš digitální <br>průvodce.</em></h2>
   <p class="digital-description">${esc(p.description)}</p>
   <a class="diri-cta" href="mailto:jspdholding@gmail.com?subject=Diriqent">${esc(p.cta)} <span aria-hidden="true">↗</span></a>
  </div>
  <div class="diri-portrait">
   ${diriCinemaMarkup}
   <div class="diri-aura" aria-hidden="true"></div>
   <span class="diri-orbit diri-orbit-one" aria-hidden="true"></span><span class="diri-orbit diri-orbit-two" aria-hidden="true"></span>
   <img src="${esc(p.character)}" width="512" height="768" alt="Fialová postava Diriqenta s motýlkem a palcem nahoru" loading="lazy" decoding="async">
   <span class="diri-portrait-caption" aria-hidden="true">MALÝ POMOCNÍK. VELKÉ MOŽNOSTI.</span>
  </div>
 </article>`).join('\n');
 const origin = new URL(process.env.SITE_ORIGIN || 'https://jspd.cz').origin;
 return html.replaceAll('{{SITE_ORIGIN}}',esc(origin)).replace(/<!-- PROJECT_LIST_START -->[\s\S]*?<!-- PROJECT_LIST_END -->/,list).replace('<!-- DIGITAL_PROJECTS -->',digital).replace('<!-- TECH_CINEMA -->',techCinemaMarkup).replace('<!-- FOOTER_PROJECTS -->',projects.map(p=>`<a href="#${p.id}">${esc(p.name)}</a>`).join(''));
}
