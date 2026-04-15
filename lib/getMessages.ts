import {Dictionary} from '@/components/types';
import {AppLocale} from './routing';

export async function getMessages(locale: AppLocale): Promise<Dictionary> {
  return (await import(`../messages/${locale}.json`)).default as Dictionary;
}
