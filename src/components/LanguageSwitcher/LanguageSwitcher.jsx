import React from 'react';
import { useTranslation } from 'react-i18next';
import ReactCountryFlag from 'react-country-flag';
import styles from './LanguageSwitcher.module.css';

const langs = [
    { code: 'ru', countryCode: 'RU', title: 'Русский' },
    { code: 'kaz', countryCode: 'KZ', title: 'Қазақша' },
];

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();

    return (
        <div className={styles.flagContainer}>
            {langs.map(({ code, countryCode, title }) => (
                <button
                    key={code}
                    onClick={() => i18n.changeLanguage(code)}
                    disabled={i18n.resolvedLanguage === code}
                    title={title}
                    className={
                        i18n.resolvedLanguage === code
                            ? styles.flagActive
                            : styles.flag
                    }
                >
                    <ReactCountryFlag
                        countryCode={countryCode}
                        svg
                        style={{ width: '24px', height: '24px' }}
                        title={title}
                    />
                </button>
            ))}
        </div>
    );
}
