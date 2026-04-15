import PageLayout from '@/components/PageLayout';
import SectionPage from '@/components/SectionPage';
import {AppLocale} from '@/lib/routing';
import {getMessages} from '@/lib/getMessages';

export default async function CleaningPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  const dict = await getMessages(locale as AppLocale);

  return (
    <PageLayout locale={locale as AppLocale} dict={dict}>
      <SectionPage
        locale={locale as AppLocale}
        data={dict.cleaning}
        primaryHref={`/${locale}/contact`}
        secondaryHref={`/${locale}`}
      />
    </PageLayout>
  );
}