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
matchMedia('(min-width:701px)').addEventListener('change',e=>{if(e.matches)closeMenu();});
const toggle=document.createElement('button');toggle.type='button';toggle.className='motion-toggle';header.insertBefore(toggle,menu);
function reflectMotion(){const reduced=userPaused||motionQuery.matches;const label=motionQuery.matches?'Pohyb omezen nastavením zařízení':reduced?'Povolit pohyb':'Omezit pohyb';toggle.setAttribute('aria-label',label);toggle.setAttribute('aria-pressed',String(reduced));toggle.setAttribute('aria-disabled',String(motionQuery.matches));toggle.title=label;toggle.textContent=reduced?'▷':'Ⅱ';}
reflectMotion();document.addEventListener('motionmodechange',reflectMotion);
toggle.addEventListener('click',()=>{if(motionQuery.matches)return;userPaused=!userPaused;motion.setPaused(userPaused);reflectMotion();});
