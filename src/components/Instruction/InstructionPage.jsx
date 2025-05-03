import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import Header from './../Header/Header';
import styles from './InstructionPage.module.css';
import Footer from "../Footer/Footer";

export default function InstructionPage() {
    const userName = localStorage.getItem('name') || 'Guest';
    const { t } = useTranslation();

    return (
        <div className={styles.instructionPage}>
            <Header userName={userName} />

            <div className={styles.heroSection}>
                <LanguageSwitcher />
                <div className={styles.heroWave}></div>
                <h1 className={styles.heroTitle}>
                    {t('instructionHeroTitle')}
                </h1>
                <p className={styles.heroSubtitle}>
                    {t('instructionHeroSubtitle')}
                </p>
                <div className={styles.heroGlow}></div>
            </div>

            <div className={styles.contentWrapper}>
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>
                        {t('instructionStep1Title')}
                    </h2>
                    <p className={styles.cardText}>
                        {t('instructionStep1Text')}
                    </p>
                    <button className={styles.cardButton}>
                        {t('instructionStep1Button')}
                    </button>
                </div>
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>
                        {t('instructionStep2Title')}
                    </h2>
                    <p className={styles.cardText}>
                        {t('instructionStep2Text')}
                    </p>
                </div>
                <div className={styles.cardFull}>
                    <h2 className={styles.cardTitle}>
                        {t('instructionStep3Title')}
                    </h2>
                    <p className={styles.cardText}>
                        {t('instructionStep3Text')}
                    </p>
                </div>
                <div className={styles.cardFull}>
                    <h2 className={styles.cardTitle}>
                        {t('instructionVideoTitle')}
                    </h2>
                    <div className={styles.videoPlaceholder}>
                        {t('instructionVideoPlaceholder')}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
