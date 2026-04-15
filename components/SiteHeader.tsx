'use client';

import Image from 'next/image';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {AppLocale} from '@/lib/routing';
import {Dictionary} from './types';

const locales: AppLocale[] = ['cs', 'sk', 'en', 'de', 'es', 'fr'];

type Props = {
  locale: AppLocale;
  dict: Dictionary;
};

const navItems = [
  {key: 'home', slug: ''},
  {key: 'cleaning', slug: 'cleaning'},
  {key: 'construction', slug: 'construction'},
  {key: 'tech', slug: 'tech'},
  {key: 'bakery', slug: 'bakery'}
] as const;

function replaceLocale(pathname: string, nextLocale: AppLocale) {
  const segments = pathname.split('/');
  segments[1] = nextLocale;
  return segments.join('/') || `/${nextLocale}`;
}

export default function SiteHeader({locale, dict}: Props) {
  const pathname = usePathname() || `/${locale}`;

  return (
    <header className="site-header">
      <div className="container header-wrap">
        <div className="header-topline">{dict.header.groupLabel}</div>

        <div className="header-inner">
          <Link href={`/${locale}`} className="brand">
            <span className="brand-mark" aria-hidden="true">
              <Image
                src="/jspd-logo.png"
                alt=""
                width={180}
                height={180}
                className="brand-mark-image"
                priority
              />
            </span>
            <span className="brand-copy">
              <strong>{dict.common.brand}</strong>
              <small>{dict.header.groupLabel}</small>
            </span>
          </Link>

          <div className="header-controls">
            <nav className="nav" aria-label="Primary">
              {navItems.map((item) => {
                const href = item.slug ? `/${locale}/${item.slug}` : `/${locale}`;
                const isActive =
                  item.slug === ''
                    ? pathname === href
                    : pathname === href || pathname.startsWith(`${href}/`);

                return (
                  <Link
                    key={item.key}
                    href={href}
                    className={isActive ? 'active' : undefined}
                  >
                    {dict.nav[item.key]}
                  </Link>
                );
              })}
            </nav>

            <div className="header-meta">
              <div className="lang-switch-wrap">
                <div className="lang-switch-label">{dict.header.languageLabel}</div>
                <div className="lang-switch" aria-label={dict.header.languageLabel}>
                  {locales.map((item) => (
                    <Link
                      key={item}
                      href={replaceLocale(pathname, item)}
                      className={item === locale ? 'active' : undefined}
                    >
                      {item.toUpperCase()}
                    </Link>
                  ))}
                </div>
              </div>

              <Link className="btn btn-solid btn-small" href={`/${locale}/contact`}>
                {dict.header.contactCta}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
