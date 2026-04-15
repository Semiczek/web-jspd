import PageLayout from '@/components/PageLayout';
import {AppLocale} from '@/lib/routing';
import {getMessages} from '@/lib/getMessages';

export default async function ContactPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  const dict = await getMessages(locale as AppLocale);
  const t = dict.contact;

  return (
    <PageLayout locale={locale as AppLocale} dict={dict}>
      <section className="page-hero">
        <div className="container">
          <div className="page-hero-box">
            <div className="badge badge-light">{t.badge}</div>
            <h1>{t.heroTitle}</h1>
            <p>{t.heroText}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container two-col">
          <div className="contact-box">
            <h3>{t.boxTitle}</h3>
            <p>{t.boxText}</p>
            <a className="btn btn-solid" href={`mailto:${dict.common.contactEmail}`}>
              {t.emailButton}
            </a>
            <p className="note">{dict.common.contactEmail}</p>
          </div>

          <div className="dark-band">
            <h2>{t.rightTitle}</h2>
            <p>{t.rightText}</p>
            <div className="checks">
              {t.rightItems.map((item: string) => (
                <div className="check" key={item}>{item}</div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
