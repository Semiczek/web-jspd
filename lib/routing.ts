export const locales = ['cs', 'sk', 'en', 'de', 'es', 'fr'] as const;

export type AppLocale = (typeof locales)[number];

export const routing = {
  locales,
  defaultLocale: 'cs',
  localePrefix: 'always'
} as const;
