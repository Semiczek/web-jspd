# JSPD Holding Web Starter

Hotový základ pro nový veřejný web v **Next.js App Router** s vícejazyčnou strukturou.

## Co je uvnitř
- `app/[locale]` route-based vícejazyčný web
- sekce:
  - holding / homepage
  - cleaning
  - tech
  - bakery
  - cafe
  - demo
  - contact
- jazyky:
  - cs
  - sk
  - en
  - de
  - es
  - fr
- `next-intl` připravené pro další lokalizaci

## Jak spustit
```bash
npm install
npm run dev
```

Pak otevři:
- `http://localhost:3000/cs`
- `http://localhost:3000/en`
- atd.

## Co doporučuju jako další krok
1. Napojit reálné logo a brand assets
2. Doplnit skutečné texty pro všechny jazyky
3. Přidat reálné fotky
4. Udělat formulář a obchodní CTA
5. Udělat stránku dema hubu víc interaktivně
6. Přidat SEO metadata pro jednotlivé sekce

## Důležité
Tohle je **silný startovací základ**, ne finální produkční web.
Je navržený tak, aby:
- unesl více jazyků
- unesl více firemních větví
- šel dál rozvíjet bez překopání celé struktury

## Doporučená architektura
- veřejný web: Next.js
- mobilní appky: Expo
- backend / data: Supabase
- demo hubu: samostatná veřejná route v tomto projektu nebo napojená komponenta

OPRAVA NEXT-INTL
- Tento fixed balíček už obsahuje:
  - i18n/request.ts
  - next.config.ts s next-intl pluginem

SPUŠTĚNÍ NA PORTU 3002
```bash
npm install
npm run dev -- -p 3002
```

Pak otevři:
http://localhost:3002/cs
