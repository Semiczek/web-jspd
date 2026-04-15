import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['cs', 'sk', 'en', 'de', 'es', 'fr'],
  defaultLocale: 'cs',
  localePrefix: 'always'
});

export type AppLocale = (typeof routing.locales)[number];