import { initMotion } from "./motion.js";
const motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
const header = document.querySelector(".header");
let userPaused = false;
const motion = initMotion();
const menu = document.querySelector('.menu-button'); const mobileNav=document.querySelector('#mobile-nav');
menu.hidden=false; header.classList.add('has-menu');
function closeMenu(){menu.setAttribute('aria-expanded','false');mobileNav.hidden=true;}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));mobileNav.hidden=!open;});
mobileNav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!mobileNav.hidden){closeMenu();menu.focus();}});
matchMedia('(min-width:601px)').addEventListener('change',e=>{if(e.matches)closeMenu();});
const toggle=document.createElement('button');toggle.type='button';toggle.className='motion-toggle';toggle.setAttribute('aria-label','Omezit pohyb');toggle.setAttribute('aria-pressed','false');toggle.textContent='Ⅱ';document.body.append(toggle);
toggle.addEventListener('click',()=>{userPaused=!userPaused;document.documentElement.classList.toggle('no-motion',userPaused);toggle.setAttribute('aria-pressed',String(userPaused));toggle.setAttribute('aria-label',userPaused?'Povolit pohyb':'Omezit pohyb');toggle.textContent=userPaused?'▷':'Ⅱ';motion.setPaused(userPaused);});
const concept=document.querySelector('.interface-preview');
document.querySelector('.concept-tabs').hidden=false;
for(const button of document.querySelectorAll('[data-stage][type=button]'))button.addEventListener('click',()=>{concept.dataset.stage=button.dataset.stage;concept.dataset.manual=button.dataset.stage;document.dispatchEvent(new Event('conceptchange'));for(const sibling of document.querySelectorAll('[data-stage][type=button]'))sibling.setAttribute('aria-pressed',String(sibling===button));});
const form=document.querySelector('#contact-form');const fields=document.querySelector('#contact-fields');fields.disabled=false;
const feedback=document.querySelector('#form-feedback');const result=document.querySelector('#form-result');const interest=document.querySelector('#interest');
document.querySelectorAll('[data-interest]').forEach(link=>link.addEventListener('click',()=>{interest.value=link.dataset.interest;interest.removeAttribute('aria-invalid');result.hidden=true;}));
function prepare(){
 result.hidden=true;feedback.classList.remove('error');feedback.textContent='';
 const controls=[...form.querySelectorAll('input,select,textarea')];
 controls.forEach(el=>el.removeAttribute('aria-invalid'));
 const invalid=controls.find(el=>!el.checkValidity()||(el.required&&!el.value.trim()));
 if(invalid){invalid.setAttribute('aria-invalid','true');invalid.setAttribute('aria-describedby','form-feedback');const names={interest:'Vyberte oblast zájmu.',name:'Doplňte své jméno.',email:invalid.value?'Zadejte platný e-mail, například jmeno@firma.cz.':'Doplňte svůj e-mail.',message:'Napište stručné zadání.'};feedback.classList.add('error');feedback.textContent=names[invalid.name]||'Zkontrolujte vyplněné údaje.';invalid.focus();return;}
 const values=new FormData(form);const text=`Oblast: ${values.get('interest')}\nJméno: ${values.get('name').trim()}\nE-mail: ${values.get('email').trim()}${values.get('company').trim()?'\nFirma: '+values.get('company').trim():''}\n\n${values.get('message').trim()}`;
 document.querySelector('#message-preview').textContent=text;
 document.querySelector('#email-draft').href=`mailto:jspdholding@gmail.com?subject=${encodeURIComponent('Poptávka — '+values.get('interest'))}&body=${encodeURIComponent(text)}`;
 result.hidden=false;feedback.textContent='Náhled připraven. Nic nebylo odesláno.';
}
document.querySelector('#preview-button').addEventListener('click',prepare);form.addEventListener('submit',e=>{e.preventDefault();prepare();});
form.addEventListener('input',()=>{result.hidden=true;feedback.textContent='';});
