# JSPD Holding — V7

Filmový web holdingu s původním logem JSPD, postavou Diriqenta a animacemi při posouvání. Obnovená verze V7 bez Křup & Go, včetně oprav mobilního časování a režimu omezeného pohybu.

## Spuštění

Node.js 22 nebo novější:

```sh
npm ci
npm run dev
```

Náhled: http://127.0.0.1:5186. Po změně `src/projects.mjs` nebo `scripts/render.mjs` restartujte server.

## Kontrola a sestavení

```sh
npm run check
npm run build
node scripts/check.mjs
```

Statický výstup vzniká v `dist/`. `src/` obsahuje obsah, styly a animace; `public/assets/` obrázky, fonty a licence. `design-sources/` uchovává zdroje ilustrací. Podrobnosti původní lokální předávky jsou v `README.txt` a `asset-manifest.json`.

## Hosting a oddělení Hubu

Tento repozitář `Semiczek/web-jspd` je napojený na Vercel projekt `project-z38dy` (`prj_2IR2Bht1S1jzHtlaXyjHX8h0ZdHA`) a doménu **test.jspd.cz**. Konfigurace `vercel.json` sestavuje statický web. Původní odkazy s jazykovým prefixem přesměrovává na odpovídající sekce; samostatné stránky `/routex1/` a `/routex2/` zůstávají zachované.

Hub je jiný repozitář (`Semiczek/jspdhubhotovy`) a jiný Vercel projekt. Tento web nemá backend, Supabase klienta ani databázové migrace. Není třeba měnit DNS, nastavení nebo databázi Hubu. Doména `jspd.cz` nebyla při přípravě této změny připojena k projektu tohoto webu.

Formulář připravuje e-mail s poptávkou, který návštěvník odešle ze svého e-mailového klienta. Web nemá server pro odesílání pošty. Produkční metadata, canonical a sitemap používají `https://jspd.cz/`; testovací doména má HTTP hlavičku `X-Robots-Tag: noindex, nofollow`.

Původní verze před nahrazením: commit `15bd3d65dd41b32cb27b4f8da405746bd045e341`, větev `backup/before-jspd-v7-2026-10-17`. Návrat lze provést revertem nahrazovacího commitu bez přepisování historie.
