import polyglotI18nProvider from 'ra-i18n-polyglot';
import en from 'ra-language-english';
import japaneseMessages from '@bicstone/ra-language-japanese';

en.ra.action.create = "Upload"

japaneseMessages.ra.action.create = "アップロード"

const translations: any = { en, japaneseMessages };

export const i18nProvider = polyglotI18nProvider(
  locale => translations[locale],
  'en', // default locale
  [{ locale: 'en', name: 'English' }, { locale: 'japaneseMessages', name: '日本語' }],
);