import Link from 'next/link';
import {AppLocale} from '@/lib/routing';
import {SectionContent} from './types';

type Props = {
  locale: AppLocale;
  data: SectionContent;
  primaryHref: string;
  secondaryHref: string;
};

export default function SectionPage({locale, data, primaryHref, secondaryHref}: Props) {
  const featureHref = data.featurePanel?.href;
  const isExternalFeature = featureHref ? featureHref.startsWith('http') : false;

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="page-hero-box">
            <div className="badge badge-light">{data.badge}</div>
            <h1>{data.heroTitle}</h1>
            <p>{data.heroText}</p>
            <div className="hero-points">
              {data.heroPoints.map((item) => (
                <div className="hero-point" key={item}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {data.featurePanel && (
        <section className="section section-tight-top">
          <div className="container">
            <div className="cta promo-panel">
              <h2>{data.featurePanel.title}</h2>
              <p>{data.featurePanel.text}</p>
              <div className="cta-actions">
                <Link
                  className="btn btn-primary"
                  href={data.featurePanel.href}
                  target={isExternalFeature ? '_blank' : undefined}
                  rel={isExternalFeature ? 'noreferrer' : undefined}
                >
                  {data.featurePanel.label}
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>{data.cardsTitle}</h2>
              <p className="lead">{data.cardsLead}</p>
            </div>
          </div>

          <div className="grid">
            {data.cards.map((item) => (
              <article className="card" key={item.title}>
                <div className="icon">{item.index ?? '*'}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className={data.hideContactBox ? 'container' : 'container two-col'}>
          <div className="dark-band">
            <h2>{data.infoTitle}</h2>
            <p>{data.infoText}</p>
            <div className="checks">
              {data.infoItems.map((item) => (
                <div className="check" key={item}>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {!data.hideContactBox && (
            <div className="contact-box">
              <h3>{data.ctaTitle}</h3>
              <p>{data.ctaText}</p>
              {data.ctaItems && data.ctaItems.length > 0 && (
                <div className="compact-list">
                  {data.ctaItems.map((item) => (
                    <div className="mini-item" key={item}>
                      {item}
                    </div>
                  ))}
                </div>
              )}
              <Link className="btn btn-solid" href={primaryHref}>
                {data.ctaPrimary}
              </Link>
              {data.ctaSecondary ? (
                <Link className="btn btn-soft" href={secondaryHref}>
                  {data.ctaSecondary}
                </Link>
              ) : null}
            </div>
          )}
        </div>
      </section>

      {data.projects && data.projects.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <div>
                <h2>{data.projectsTitle}</h2>
                <p className="lead">{data.projectsLead}</p>
              </div>
            </div>

            <div className="grid">
              {data.projects.map((item) => (
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
      )}
    </>
  );
}
