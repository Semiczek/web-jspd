ARCHIVNÍ PŘEDÁVKA — AKTUÁLNÍ NASAZENÍ A OBSAH V README.md
Následující poznámky zachycují původní lokální verzi, nikoli nynější stav.

JSPD HOLDING — POHYBOVÝ KONCEPT V7
7. 10. 2026

Spuštění: Node.js 22+, npm run dev nebo Spustit-nahled.cmd.
Náhled: http://127.0.0.1:5186
Build: npm ci, npm run check, npm run build, node scripts/check.mjs.
Po úpravě projects.mjs nebo render.mjs restartujte server.

PĚT SVĚTŮ
1. Holding — modré světelné pozadí a skládání původního loga.
2. Rodina Diri — modrofialové pozadí, sestavení tří panelů.
3. JSPD Cleaning — modrobílé optické odhalení stejné ilustrační scény.
4. Pekárna Litovel — zachovaná makrokompozice, bílá, hnědá a jemná zlatá.
5. Pojďme něco vytvořit — skládání návrhu webu, hnědozlatý až zlatý závěr.

src/index.html: sémantický obsah a pořadí
src/projects.mjs: šest projektů a jejich existující odkazy
src/style.css, motion.css, worlds.css, fonts.css: základ, pohyb, barvy, fonty
src/motion.js: nativní scroll, omezení pohybu a stav scén
src/portal.js: pět alfa komponent ORIGINÁLNÍHO loga, žádný kruhový portál
src/site.js: menu, formulář a přepínač animací
public/assets: lokální podklady, loga, licence; starší artwork je archivní
dist: aktuální statický build

Pekárna je stále animovaná ilustrace, nikoli film výroby.
Diriqent: stávající fialová postava z podkladů zadavatele, průhledný výřez.
Diriqent/DiriPOS: potvrzené domény, bez vymyšlených produktových funkcí.
Formulář vytváří jen místní náhled poptávky a neodesílá data.
Nic nebylo publikováno. Náhled zůstává noindex; DNS ani jspd.cz se nemění.

V4: kultivovaná barevnost, sjednocené neutrály a navigace podle scény.
Přímé vstupy do připnutých sekcí neposouvají jejich obsah pod navigaci.

V5: výraznější počáteční rozptyl loga, otáčení kolem skutečných těžišť
a jemný glow v úvodu, digitální scéně a teplém závěru.

V6: skutečná postava Diriqenta v digitální kartě, jemná záře a nástup
při scrollování. Zdroj, postup a prompt v design-sources.

V7 (17. 10. 2026): oprava mobilního časování, připnutí Cleaning a pekárny,
samostatná animace viditelné ukázky webu. src/mobile-motion.css obsahuje
mobilní choreografii. Při omezení pohybu je obsah v běžném toku.
