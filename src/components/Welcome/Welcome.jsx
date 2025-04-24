import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './Welcome.module.css';
import myImage from './image/logo.jpg';

// импортируем наш переключатель
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';

const Welcome = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div className={styles.welcomePage}>
            {/* вот он, над макетом */}
            <LanguageSwitcher />

            <div className={styles.phoneMockup}>
                {/* ... остальной JSX без изменений */}
                <div className={styles.topSection}>
                    <div className={styles.imageWrapper}>
                        <img src={myImage} alt={t('logoAlt')} className={styles.image} />
                    </div>
                </div>
                <div className={styles.bottomSection}>
                    <h1 className={styles.welcomeTitle}>{t('welcomeTitle')}</h1>
                    <p className={styles.welcomeSubtitle}>{t('welcomeSubtitle')}</p>
                    <button className={styles.welcomeButton} onClick={() => navigate('/login')}>
                        {t('getStarted')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
