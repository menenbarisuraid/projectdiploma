// src/components/TopProductsDetails/TopProductsDetails.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import Header from './../Header/Header';
import { FaEye } from 'react-icons/fa';
import styles from './TopProductsDetails.module.css';
import Footer from "../Footer/Footer";

const TOP_PRODUCTS_URL = 'https://quramdetector-k92n.onrender.com/top-products';

export default function TopProductsDetails() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [favourites, setFavourites] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        (async () => {
            setLoading(true);
            setError('');
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const response = await axios.get(TOP_PRODUCTS_URL, config);
                setTopProducts(response.data.data.products || []);
            } catch (err) {
                setError(t('topProductsError'));
            } finally {
                setLoading(false);
            }
        })();
    }, [navigate, t]);

    const handleFavouriteClick = async (product, e) => {
        e.stopPropagation();
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            await axios.post(
                'https://quramdetector-k92n.onrender.com/favourites/toggle',
                { product_id: product.id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setFavourites(f =>
                f.includes(product.id) ? f.filter(id => id !== product.id) : [...f, product.id]
            );
        } catch {
            console.error('Ошибка при переключении избранного');
        }
    };

    const handleProductClick = product => navigate('/product-details', { state: { product } });
    const handleDetailsClick = (product, e) => { e.stopPropagation(); handleProductClick(product); };

    return (
        <div className={styles.topProductsPage}>
            <Header />

            <div className={styles.heroSection}>
                <LanguageSwitcher />
                <div className={styles.heroWave} />
                <h1 className={styles.heroTitle}>{t('topProductsHeroTitle')}</h1>
                <p className={styles.heroSubtitle}>{t('topProductsHeroSubtitle')}</p>
                <div className={styles.heroGlow} />
            </div>

            <div className={styles.contentWrapper}>
                {error && <div className={styles.error}>{error}</div>}

                {loading ? (
                    <p className={styles.loadingText}>{t('topProductsLoading')}</p>
                ) : (
                    <div className={styles.productsGrid}>
                        {topProducts.length > 0 ? (
                            topProducts.map(product => (
                                <div
                                    key={product.id}
                                    className={styles.productCard}
                                    onClick={() => handleProductClick(product)}
                                >
                                    <button
                                        className={styles.favouriteButton}
                                        onClick={e => handleFavouriteClick(product, e)}
                                    >
                                        {favourites.includes(product.id) ? '❤️' : '♡'}
                                    </button>
                                    <img src={product.image} alt={product.name} className={styles.productImage} />
                                    <p className={styles.productName}>{product.name}</p>
                                    <button
                                        className={styles.detailsButton}
                                        onClick={e => handleDetailsClick(product, e)}
                                    >
                                        <FaEye className={styles.detailsIcon} />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className={styles.noData}>{t('topProductsNoData')}</p>
                        )}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
