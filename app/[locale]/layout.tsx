import {notFound} from 'next/navigation';
import {routing, AppLocale} from '@/lib/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  if (!routing.locales.includes(locale as AppLocale)) {
    notFound();
  }

  return children;
}
