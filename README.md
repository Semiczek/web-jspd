# JSPD Holding — V7

Filmový web holdingu s původním logem JSPD, samostatnou postavou Diriqenta a animacemi při posouvání. Závěr představuje JSPD Tech s animovaným skládáním webu a telefonu. Mobil používá běžný tok stránky; režim omezeného pohybu zachovává čitelný statický obsah.

## Spuštění

Node.js 22 nebo novější:

```sh
npm ci
npm run dev
```

Náhled: http://127.0.0.1:5186. Po změně renderovacích modulů (`src/*.mjs`, `scripts/render.mjs`) restartujte server.

## Kontrola a sestavení

```sh
npm run check
npm run build
node scripts/check.mjs
```

Statický výstup vzniká v `dist/`. `src/` obsahuje obsah, styly a animace; `public/assets/` obrázky, fonty a licence. `design-sources/` uchovává zdroje ilustrací. Podrobnosti původní lokální předávky jsou v `README.txt` a `asset-manifest.json`.

## Hosting a oddělení Hubu

Tento repozitář `Semiczek/web-jspd` je napojený na Vercel projekt `project-z38dy` (`prj_2IR2Bht1S1jzHtlaXyjHX8h0ZdHA`). Větev `main` nasazuje produkční web **https://jspd.cz/**; `www.jspd.cz` přesměrovává kódem 308 na hlavní adresu. `test.jspd.cz` zůstává připojený ke stejnému projektu. Konfigurace `vercel.json` sestavuje statický web. Původní odkazy s jazykovým prefixem přesměrovává na odpovídající sekce; samostatné stránky `/routex1/` a `/routex2/` zůstávají zachované.

Hub je jiný repozitář (`Semiczek/jspdhubhotovy`) a jiný Vercel projekt. Tento web nemá backend, Supabase klienta ani databázové migrace. Při připojení domény 18. 10. 2026 zůstaly záznamy Hubu a pošty beze změny. DNS servery a registrace zůstávají u FORPSI; měnily se pouze webové záznamy. Zástupný záznam ostatních subdomén zachovává původní IP hostingu.

Kontaktní odkazy používají e-mailového klienta; hlavní výzva vede na `https://jspdtech.cz/`. Web nemá formulář ani server pro odesílání pošty. Produkční metadata, canonical a sitemap používají `https://jspd.cz/`; testovací doména má HTTP hlavičku `X-Robots-Tag: noindex, nofollow`.

Původní verze před nahrazením: commit `15bd3d65dd41b32cb27b4f8da405746bd045e341`, větev `backup/before-jspd-v7-2026-10-17`. Návrat lze provést revertem nahrazovacího commitu bez přepisování historie.
