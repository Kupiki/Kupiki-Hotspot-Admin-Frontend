import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';

i18n
  .use(XHR)
  .init({
    initImmediate: true,
    fallbackLng: 'en',
    backend: {
      loadPath: '/lang/locale-{{lng}}.json'
    },
    react: {
      wait: true,
      bindStore: false,
      bindI18n: 'languageChanged'
    }
  });

export default i18n;
