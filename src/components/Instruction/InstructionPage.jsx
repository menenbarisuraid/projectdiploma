import React           from 'react';
import { useTranslation } from 'react-i18next';

import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import Header           from '../Header/Header';
import Footer           from '../Footer/Footer';

import styles from './InstructionPage.module.css';

export default function InstructionPage() {
    const userName = localStorage.getItem('name') || 'Guest';
    const { t }    = useTranslation();

    return (
        <div className={styles.instructionPage}>
            {/* ---------- HEADER ---------- */}
            <Header userName={userName} />

            {/* ---------- HERO ---------- */}
            <div className={styles.heroSection}>
                <LanguageSwitcher />
                <div className={styles.heroWave}></div>
                <h1 className={styles.heroTitle}>{t('instructionHeroTitle')}</h1>
                <p  className={styles.heroSubtitle}>{t('instructionHeroSubtitle')}</p>
                <div className={styles.heroGlow}></div>
            </div>

            {/* ---------- CONTENT ---------- */}
            <div className={styles.contentWrapper}>
                {/* ШАГ 1 */}
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>{t('instructionStep1Title')}</h2>
                    <p  className={styles.cardText}>{t('instructionStep1Text')}</p>
                    <button className={styles.cardButton}>{t('instructionStep1Button')}</button>
                </div>

                {/* ШАГ 2 */}
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>{t('instructionStep2Title')}</h2>
                    <p  className={styles.cardText}>{t('instructionStep2Text')}</p>
                </div>

                {/* ШАГ 3 */}
                <div className={styles.cardFull}>
                    <h2 className={styles.cardTitle}>{t('instructionStep3Title')}</h2>
                    <p  className={styles.cardText}>{t('instructionStep3Text')}</p>
                </div>

                {/* ВИДЕО-ИНСТРУКЦИЯ */}
                <div className={styles.cardFull}>
                    <h2 className={styles.cardTitle}>{t('instructionVideoTitle')}</h2>
                    {/* видеоролик */}
                    <div className={styles.videoWrapper}>
                        <iframe
                            className={styles.responsiveIframe}
                            src="https://www.youtube.com/embed/hSNOKxh7RHo?si=WbKncvoutzubGIEB"
                            title="Quram Detector — мини-инструкция"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        />
                    </div>
                </div>
            </div>

            {/* ---------- FOOTER ---------- */}
            <Footer />
        </div>
    );
}
