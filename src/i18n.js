import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ru from './locales/ru/translation.json';
import kaz from './locales/kaz/translation.json';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            ru: { translation: ru },
            kaz: { translation: kaz },
        },
        lng: 'ru',           // язык по умолчанию
        fallbackLng: 'ru',   // запасной язык
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
