// src/components/FavouriteDetails/FavouriteDetails.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import Header from './../Header/Header';
import styles from './FavouriteDetails.module.css';

export default function FavouriteDetails() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [favouriteProducts, setFavouriteProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError]   = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }

        (async () => {
            setLoading(true); setError('');
            try {
                const { data } = await axios.get(
                    'https://quramdetector-3uaf.onrender.com/favourites',
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setFavouriteProducts(data.data.favourites || []);
            } catch {
                setError(t('favouritesError'));
            } finally { setLoading(false); }
        })();
    }, [navigate, t]);

    const handleProductClick = product => navigate('/product-details', { state: { product } });

    const handleRemoveFavourite = async (product, e) => {
        e.stopPropagation();
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        try {
            await axios.post(
                'https://quramdetector-3uaf.onrender.com/favourites/toggle',
                { product_id: product.id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setFavouriteProducts(prev => prev.filter(p => p.id !== product.id));
        } catch (err) { console.error('remove favourite error', err); }
    };

    return (
        <div className={styles.favouritePage}>
            <Header userName={localStorage.getItem('name') || ''} />

            <div className={styles.heroSection}>
                <LanguageSwitcher />
                <div className={styles.heroWave} />
                <h1 className={styles.heroTitle}>{t('favouritesHeroTitle')}</h1>
                <p className={styles.heroSubtitle}>{t('favouritesHeroSubtitle')}</p>
                <div className={styles.heroGlow} />
            </div>

            <div className={styles.contentWrapper}>
                <h2 className={styles.contentTitle}>{t('favouritesContentTitle')}</h2>
                {error && <div className={styles.error}>{error}</div>}
                {loading && <p className={styles.loadingText}>{t('favouritesLoading')}</p>}

                {!loading && !error && (
                    <div className={styles.productsGrid}>
                        {favouriteProducts.length ? (
                            favouriteProducts.map((item, idx) => (
                                <div key={idx} className={styles.productCard} onClick={() => handleProductClick(item)}>
                                    <button className={styles.removeButton} onClick={e => handleRemoveFavourite(item, e)}>
                                        <FaTimes />
                                    </button>
                                    {item.image ? (
                                        <img src={item.image} alt={item.name || `Favourite #${idx + 1}`} className={styles.productImage} />
                                    ) : (
                                        <div className={styles.imagePlaceholder}>{t('favouritesNoImage')}</div>
                                    )}
                                    <p className={styles.productName}>{item.name || `Favourite #${idx + 1}`}</p>
                                </div>
                            ))
                        ) : (
                            <p className={styles.noData}>{t('favouritesNoProducts')}</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
