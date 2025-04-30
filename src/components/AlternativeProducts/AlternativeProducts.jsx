import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import Header from './../Header/Header';
import styles from './AlternativeProducts.module.css';

export default function AlternativeProducts() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { t } = useTranslation();

    const [userName, setUserName] = useState('');
    const [alternatives] = useState(state?.allAlternatives || []);
    const [filteredAlternatives, setFilteredAlternatives] = useState(alternatives);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            setUserName(localStorage.getItem('name') || '');
        }
    }, [navigate]);

    useEffect(() => {
        const q = searchQuery.trim().toLowerCase();
        setFilteredAlternatives(
            q ? alternatives.filter(a => a.name.toLowerCase().includes(q)) : alternatives
        );
    }, [searchQuery, alternatives]);

    const handleSearchChange = e => setSearchQuery(e.target.value);
    const handleAlternativeClick = alt => navigate('/product-details', { state: { product: alt } });

    return (
        <div className={styles.alternativeProductsPage}>
            <Header userName={userName} />

            <div className={styles.heroSection}>
                <LanguageSwitcher />
                <div className={styles.heroWave} />
                <h1 className={styles.heroTitle}>{t('altHeroTitle')}</h1>
                <p className={styles.heroSubtitle}>{t('altHeroSubtitle')}</p>
                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder={t('altSearchPlaceholder')}
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className={styles.searchInput}
                    />
                </div>
                <div className={styles.heroGlow} />
            </div>

            <div className={styles.contentWrapper}>
                <section className={styles.alternativesSection}>
                    <h2 className={styles.sectionTitle}>{t('altSectionTitle')}</h2>

                    {filteredAlternatives.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#666' }}>{t('altNoData')}</p>
                    ) : (
                        <div className={styles.alternativesGrid}>
                            {filteredAlternatives.map(alt => (
                                <div
                                    key={alt.id}
                                    className={styles.alternativeItem}
                                    onClick={() => handleAlternativeClick(alt)}
                                >
                                    <img src={alt.image} alt={alt.name} className={styles.alternativeImage} />
                                    <p className={styles.alternativeName}>{alt.name}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
