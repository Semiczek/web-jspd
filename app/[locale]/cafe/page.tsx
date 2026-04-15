import {redirect} from 'next/navigation';

export default async function CafePage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  redirect(`/${locale}/bakery`);
}
