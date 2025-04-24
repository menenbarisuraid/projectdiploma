// src/components/AboutUs/AboutUs.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import Header from './../Header/Header';
import styles from './AboutUs.module.css';

// Импортируем фото из папки image:
import muhaImg from './image/muha.jpg';
import ayanImg from './image/ayan.jpg';
import annurImg from './image/annur.jpg';

export default function AboutUs() {
    const userName = localStorage.getItem('name') || 'Guest';
    const { t } = useTranslation();

    // Данные о команде:
    const teamMembers = [
        {
            name: 'Mukhtar Rabayev',
            role: 'ML Engineer',
            phone: '+7 (707) 339-37-13',
            img: muhaImg
        },
        {
            name: 'Askarov Ayan',
            role: 'Frontend React Developer',
            phone: '+7 (777) 112-97-43',
            img: ayanImg
        },
        {
            name: 'Muratov Annur',
            role: 'Backend Flask Developer',
            phone: '+7 (702) 833-11-30',
            img: annurImg
        }
    ];

    return (
        <div className={styles.aboutUsPage}>
            <Header userName={userName} />
            {/* Hero */}
            <div className={styles.heroSection}>
                <LanguageSwitcher />
                <div className={styles.heroWave}></div>
                <h1 className={styles.heroTitle}>Quram Detector</h1>
                <p className={styles.heroSubtitle}>
                    {t('aboutHeroSubtitle')}
                </p>
                <div className={styles.heroGlow}></div>
            </div>

            {/* Содержимое */}
            <div className={styles.contentWrapper}>
                <div className={styles.row}>
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>
                            {t('aboutSectionAboutTitle')}
                        </h2>
                        <p className={styles.cardText}>
                            {t('aboutTextAbout')}
                        </p>
                    </div>

                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>
                            {t('aboutSectionMissionTitle')}
                        </h2>
                        <p className={styles.cardText}>
                            {t('aboutTextMission')}
                        </p>
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.card}>
                        <h2 className={`${styles.cardTitle} ${styles.centeredTitle}`}>
                            {t('aboutSectionTeamTitle')}
                        </h2>
                        <div className={styles.teamGrid}>
                            {teamMembers.map((member) => (
                                <div className={styles.teamMember} key={member.name}>
                                    <img
                                        className={styles.teamPhoto}
                                        src={member.img}
                                        alt={member.name}
                                    />
                                    <h3 className={styles.teamMemberName}>
                                        {member.name}
                                    </h3>
                                    <p>{member.role}</p>
                                    <p>{member.phone}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>
                            {t('aboutSectionContactsTitle')}
                        </h2>
                        <p className={styles.cardText}>
                            quramdetector.school@gmail.com
                        </p>
                        <p className={styles.cardText}>
                            {t('aboutContactAddress')}
                        </p>
                    </div>

                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>
                            {t('aboutSectionCompanyTitle')}
                        </h2>
                        <ul className={styles.list}>
                            <li>{t('aboutCompanyItem1')}</li>
                            <li>{t('aboutCompanyItem2')}</li>
                            <li>{t('aboutCompanyItem3')}</li>
                            <li>{t('aboutCompanyItem4')}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
