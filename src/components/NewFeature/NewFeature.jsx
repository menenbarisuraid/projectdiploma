import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import Header from './../Header/Header';
import styles from './NewFeature.module.css';

export default function NewFeature() {
    const { t } = useTranslation();

    return (
        <div className={styles.featurePage}>
            <Header />

            <div className={styles.heroSection}>
                <LanguageSwitcher />
                <h1 className={styles.heroTitle}>{t('newFeatureTitle')}</h1>
                <p className={styles.heroSubtitle}>{t('newFeatureSubtitle')}</p>
            </div>

            <div className={styles.contentWrapper}>
                <section className={`${styles.sectionCard} ${styles.overview}`}>
                    <h2>{t('newFeatureOverviewTitle')}</h2>
                    <p>{t('newFeatureOverviewText')}</p>
                </section>

                <section className={`${styles.sectionCard} ${styles.steps}`}>
                    <h2>{t('newFeatureStepsTitle')}</h2>
                    <ol>
                        <li>
                            <strong>{t('newFeatureStep1Strong')}</strong> {t('newFeatureStep1Text')}
                        </li>
                        <li>
                            <strong>{t('newFeatureStep2Strong')}</strong> {t('newFeatureStep2Text')}
                        </li>
                        <li>
                            <strong>{t('newFeatureStep3Strong')}</strong> {t('newFeatureStep3Text')}
                        </li>
                        <li>
                            <strong>{t('newFeatureStep4Strong')}</strong> {t('newFeatureStep4Text')}
                        </li>
                        <li>
                            <strong>{t('newFeatureStep5Strong')}</strong> {t('newFeatureStep5Text')}
                        </li>
                    </ol>
                </section>
            </div>
        </div>
    );
}
