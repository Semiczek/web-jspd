'use client';

import {useEffect} from 'react';
import {AppLocale} from '@/lib/routing';
import {Dictionary} from './types';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';

type Props = {
  locale: AppLocale;
  dict: Dictionary;
  children: React.ReactNode;
};

export default function PageLayout({locale, dict, children}: Props) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <div className="site-shell">
      <SiteHeader locale={locale} dict={dict} />
      <main className="site-main">{children}</main>
      <SiteFooter dict={dict} />
    </div>
  );
}
