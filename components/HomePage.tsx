import Link from 'next/link';
import {AppLocale} from '@/lib/routing';
import {Dictionary} from './types';

export default function HomePage({locale, dict}: {locale: AppLocale; dict: Dictionary}) {
  const t = dict.home;

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-panel">
            <div className="badge">{t.badge}</div>
            <h1>{t.heroTitle}</h1>
            <p>{t.heroText}</p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href={`/${locale}/cleaning`}>
                {t.primaryCta}
              </Link>
              <Link className="btn btn-secondary" href={`/${locale}/tech`}>
                {t.secondaryCta}
              </Link>
            </div>
          </div>

          <aside className="hero-card">
            <div>
              <h2>{t.sideTitle}</h2>
              <p className="muted">{t.sideText}</p>
              <div className="mini-list">
                {t.sideItems.map((item: string) => (
                  <div className="mini-item" key={item}>{item}</div>
                ))}
              </div>
            </div>
            <p className="note">{t.sideNote}</p>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>{t.pillarsTitle}</h2>
              <p className="lead">{t.pillarsLead}</p>
            </div>
          </div>

          <div className="grid">
            {t.pillars.map((item) => (
              <article className="card" key={item.title}>
                <div className="icon">{item.index}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="dark-band">
            <h2>{t.whyTitle}</h2>
            <p>{t.whyText}</p>
            <div className="checks">
              {t.whyItems.map((item: string) => (
                <div className="check" key={item}>{item}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>{t.projectsTitle}</h2>
              <p className="lead">{t.projectsLead}</p>
            </div>
          </div>

          <div className="grid">
            {t.projects.map((item) => (
              item.href ? (
                <Link
                  className="project-card"
                  key={item.title}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                >
                  <div className="project-tag">{item.tag}</div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  {item.ctaLabel ? (
                    <span className="btn btn-soft btn-small project-card-link">
                      {item.ctaLabel}
                    </span>
                  ) : null}
                </Link>
              ) : (
                <article className="project-card" key={item.title}>
                  <div className="project-tag">{item.tag}</div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              )
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta">
            <h2>{t.ctaTitle}</h2>
            <p>{t.ctaText}</p>
            <div className="cta-actions">
              <Link className="btn btn-primary" href={`/${locale}/demo`}>
                {t.ctaPrimary}
              </Link>
              <Link className="btn btn-secondary" href={`/${locale}/contact`}>
                {t.ctaSecondary}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
