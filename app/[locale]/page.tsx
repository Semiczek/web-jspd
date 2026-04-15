import PageLayout from '@/components/PageLayout';
import HomePage from '@/components/HomePage';
import {AppLocale} from '@/lib/routing';
import {getMessages} from '@/lib/getMessages';

export default async function LocaleHomePage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  const dict = await getMessages(locale as AppLocale);

  return (
    <PageLayout locale={locale as AppLocale} dict={dict}>
      <HomePage locale={locale as AppLocale} dict={dict} />
    </PageLayout>
  );
}