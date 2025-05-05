// src/components/Profile/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import Header from '../Header/Header';
import styles from './Profile.module.css';
import Footer from "../Footer/Footer";
import AddProductsCard from "../AddProductCard/AddProductCard";

export default function Profile() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [scannedProducts, setScannedProducts] = useState([]);
    const [favouriteProducts, setFavouriteProducts] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    /*                     LOAD USER                      */
    const userName = localStorage.getItem('name') || t('profileGuest');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        setUser({
            id:           localStorage.getItem('id')           || 'N/A',
            name:         localStorage.getItem('name')         || 'N/A',
            email:        localStorage.getItem('email')        || 'N/A',
            phone_number: localStorage.getItem('phone_number') || 'N/A',
            authority:    localStorage.getItem('authority')    || 'N/A',
        });

        (async () => {
            setLoading(true);
            setError('');
            try {
                const cfg = { headers: { Authorization: `Bearer ${token}` } };
                const [scRes, favRes, notRes] = await Promise.all([
                    axios.get('https://quramdetector-k92n.onrender.com/scan-history',  cfg),
                    axios.get('https://quramdetector-k92n.onrender.com/favourites',     cfg),
                    axios.get('https://quramdetector-k92n.onrender.com/notifications/', cfg)
                ]);
                setScannedProducts(scRes.data.history            || []);
                setFavouriteProducts(favRes.data.data.favourites || []);
                setNotifications(notRes.data.data.notifications  || []);
            } catch {
                setError(t('profileError'));
            } finally {
                setLoading(false);
            }
        })();
    }, [navigate, t]);

    /*                  HANDLERS / NAVIGATE               */
    const handleLogout = () => {
        // очищаем всё, что связано с авторизацией
        ['token','id','name','email','phone_number','authority'].forEach(localStorage.removeItem.bind(localStorage));
        navigate('/login', { replace: true });
    };

    const handleScannedProductsClick = () => navigate('/scannedproductsdetails');
    const handleFavouritesClick      = () => navigate('/favouritedetails');
    const handleNotificationsClick   = () => navigate('/notificationsdetails');
    const closeError                 = () => setError('');

    const handleScannedProductCardClick = item => {
        if (item.scan_id) navigate(`/infoscannedproductdetails/${item.scan_id}`);
    };
    const handleProductClick = product =>
        navigate('/product-details', { state: { product } });

    /*                       RENDER                       */
    return (
        <div className={styles.profilePage}>
            <Header userName={userName} />

            <div className={styles.heroSection}>
                <LanguageSwitcher />
                <div className={styles.heroWave} />
                <h1 className={styles.heroTitle}>Quram Detector</h1>
                <div className={styles.heroGlow} />
            </div>

            <div className={styles.contentWrapper}>
                {error && (
                    <div className={styles.errorMessage}>
                        <span className={styles.errorIcon}>⚠️</span>
                        <span>{error}</span>
                        <button className={styles.closeButton} onClick={closeError}>✕</button>
                    </div>
                )}

                {loading && <p className={styles.loadingText}>{t('profileLoading')}</p>}

                <div className={styles.blockContainer}>
                    <h2 className={styles.sectionTitle}>{t('profileInfoTitle')}</h2>
                    {user ? (
                        <div className={styles.userInfo}>
                            <p><strong>ID:</strong> {user.id}</p>
                            <p><strong>{t('profileNameLabel')}:</strong> {user.name}</p>
                            <p><strong>{t('profileEmailLabel')}:</strong> {user.email}</p>
                            <p><strong>{t('profilePhoneLabel')}:</strong> {user.phone_number}</p>
                            <p><strong>{t('profileRoleLabel')}:</strong> {user.authority}</p>
                        </div>
                    ) : (
                        <p>{t('profileInfoLoading')}</p>
                    )}
                </div>

                <div className={styles.blockContainer}>
                    <h2
                        className={styles.sectionTitle}
                        onClick={handleScannedProductsClick}
                        title={t('profileScannedTooltip')}
                    >
                        {t('profileScannedTitle')}
                    </h2>
                    <div className={styles.productGrid}>
                        {scannedProducts.length > 0 ? (
                            scannedProducts.slice(0, 6).map((item, idx) => (
                                <div
                                    key={idx}
                                    className={`${styles.productCard} ${item.is_processed ? styles.processed : ''}`}
                                    onClick={() => handleScannedProductCardClick(item)}
                                >
                                    <img
                                        src={item.image}
                                        alt={item.product_name || `#${idx + 1}`}
                                        className={styles.productImage}
                                    />
                                    <p className={styles.productName}>
                                        {item.product_name || `#${idx + 1}`}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className={styles.noDataText}>{t('profileScannedNoData')}</p>
                        )}
                    </div>
                </div>

                <div className={styles.blockContainer}>
                    <h2
                        className={styles.sectionTitle}
                        onClick={handleFavouritesClick}
                        title={t('profileFavTooltip')}
                    >
                        {t('profileFavTitle')}
                    </h2>
                    <div className={styles.productGrid}>
                        {favouriteProducts.length > 0 ? (
                            favouriteProducts.slice(0, 6).map((item, idx) => (
                                <div
                                    key={idx}
                                    className={styles.productCard}
                                    onClick={() => handleProductClick(item)}
                                >
                                    {item.image
                                        ? <img src={item.image} alt={item.name} className={styles.productImage} />
                                        : <div className={styles.imagePlaceholder} />}
                                    <p className={styles.productName}>{item.name}</p>
                                </div>
                            ))
                        ) : (
                            <p className={styles.noDataText}>{t('profileFavNoData')}</p>
                        )}
                    </div>
                </div>

                <div className={styles.blockContainer}>
                    <h2
                        className={styles.sectionTitle}
                        onClick={handleNotificationsClick}
                        title={t('profileNotificationsTooltip')}
                    >
                        {t('profileNotificationsTitle')}
                    </h2>
                    <div className={styles.notificationsBlock}>
                        {notifications.length > 0 ? (
                            notifications.map((note, idx) => (
                                <div key={idx} className={styles.notificationItem}>
                                    <p>{note.news_description}</p>
                                </div>
                            ))
                        ) : (
                            <p className={styles.noDataText}>{t('profileNotificationsNoData')}</p>
                        )}
                    </div>
                </div>

                <AddProductsCard />

                <button
                    className={styles.scanAgainButton}
                    onClick={handleLogout}
                >
                    {t('profileLogout')}
                </button>
            </div>
            <Footer />
        </div>
    );
}
