import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './../Header/Header';
import styles from './Profile.module.css';

function Profile() {
    const navigate = useNavigate();

    // Состояние для данных пользователя
    const [user, setUser] = useState(null);

    // Остальные состояния
    const [scannedProducts, setScannedProducts] = useState([]);
    const [favouriteProducts, setFavouriteProducts] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const userName = localStorage.getItem('name') || 'User';

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        // Получаем данные пользователя из localStorage
        const storedUser = {
            id: localStorage.getItem('id') || 'N/A',
            name: localStorage.getItem('name') || 'N/A',
            email: localStorage.getItem('email') || 'N/A',
            phone_number: localStorage.getItem('phone_number') || 'N/A',
            authority: localStorage.getItem('authority') || 'N/A',
        };
        setUser(storedUser);

        const fetchAllData = async () => {
            setLoading(true);
            setError('');
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const [scannedRes, favRes, notRes] = await Promise.all([
                    axios.get('https://quramdetector-3uaf.onrender.com/scan-history', config),
                    axios.get('https://quramdetector-3uaf.onrender.com/favourites', config),
                    axios.get('https://quramdetector-3uaf.onrender.com/notifications/', config)
                ]);

                setScannedProducts(scannedRes.data.history || []);
                setFavouriteProducts(favRes.data.data.favourites || []);
                setNotifications(notRes.data.data.notifications || []);
            } catch (err) {
                console.error('Ошибка при загрузке данных:', err);
                setError('Oops, something went wrong. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [navigate]);

    const handleScanAgain = () => {
        navigate('/scanpage');
    };

    const closeError = () => {
        setError('');
    };

    const handleScannedProductsClick = () => {
        navigate('/scannedproductsdetails');
    };

    const handleFavouritesClick = () => {
        navigate('/favouritedetails');
    };

    const handleNotificationsClick = () => {
        navigate('/notificationsdetails');
    };

    // Переход к деталям конкретного скана
    const handleScannedProductCardClick = (product) => {
        if (!product.scan_id) {
            console.warn('У продукта нет поля "scan_id"');
            return;
        }
        navigate(`/infoscannedproductdetails/${product.scan_id}`);
    };

    // Переход к деталям продукта (для избранных)
    const handleProductClick = (product) => {
        navigate('/product-details', { state: { product } });
    };

    return (
        <div className={styles.profilePage}>
            <Header userName={userName} />

            <div className={styles.heroSection}>
                <div className={styles.heroWave}></div>
                <h1 className={styles.heroTitle}>Quram Detector</h1>
                <div className={styles.heroGlow}></div>
            </div>

            <div className={styles.contentWrapper}>
                {error && (
                    <div className={styles.errorMessage}>
                        <span className={styles.errorIcon}>⚠️</span>
                        <span>{error}</span>
                        <button className={styles.closeButton} onClick={closeError}>✕</button>
                    </div>
                )}

                {loading && <p className={styles.loadingText}>Loading...</p>}

                {/* Блок 1: Profile Information */}
                <div className={styles.blockContainer}>
                    <h2 className={styles.sectionTitle}>
                        Profile Information
                    </h2>
                    {user ? (
                        <div className={styles.userInfo}>
                            <p><strong>ID:</strong> {user.id}</p>
                            <p><strong>Name:</strong> {user.name}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Phone Number:</strong> {user.phone_number}</p>
                            <p><strong>Authority:</strong> {user.authority}</p>
                        </div>
                    ) : (
                        <p>Loading user info...</p>
                    )}
                </div>

                {/* Блок 2: Scanned Products */}
                <div className={styles.blockContainer}>
                    <h2
                        className={styles.sectionTitle}
                        onClick={handleScannedProductsClick}
                        title="Перейти к деталям сканированных товаров"
                    >
                        Scanned Products
                    </h2>
                    <div className={styles.productGrid}>
                        {scannedProducts.length > 0 ? (
                            scannedProducts.slice(0, 6).map((item, index) => (
                                <div
                                    // Если is_processed true — добавляем класс processed
                                    className={`${styles.productCard} ${item.is_processed ? styles.processed : ''}`}
                                    key={index}
                                    onClick={() => handleScannedProductCardClick(item)}
                                >
                                    {/* Здесь используем item.image напрямую */}
                                    <img
                                        src={item.image}
                                        alt={item.product_name || `Product #${index + 1}`}
                                        className={styles.productImage}
                                    />
                                    <p className={styles.productName}>
                                        {item.product_name || `Product #${index + 1}`}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className={styles.noDataText}>No scanned products yet.</p>
                        )}
                    </div>
                </div>

                {/* Блок 3: Favourite Products */}
                <div className={styles.blockContainer}>
                    <h2
                        className={styles.sectionTitle}
                        onClick={handleFavouritesClick}
                        title="Перейти к деталям избранных товаров"
                    >
                        Favourite Products
                    </h2>
                    <div className={styles.productGrid}>
                        {favouriteProducts.length > 0 ? (
                            favouriteProducts.slice(0, 6).map((item, index) => (
                                <div
                                    className={styles.productCard}
                                    key={index}
                                    onClick={() => handleProductClick(item)}
                                >
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.name || `Favourite #${index + 1}`}
                                            className={
                                                favouriteProducts.length === 1
                                                    ? `${styles.productImage} ${styles.singleProductImage}`
                                                    : styles.productImage
                                            }
                                        />
                                    ) : (
                                        <div className={styles.imagePlaceholder} />
                                    )}
                                    <p className={styles.productName}>
                                        {item.name || `Favourite #${index + 1}`}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className={styles.noDataText}>No favourite products.</p>
                        )}
                    </div>
                </div>

                {/* Блок 4: Notifications */}
                <div className={styles.blockContainer}>
                    <h2
                        className={styles.sectionTitle}
                        onClick={handleNotificationsClick}
                        title="Перейти к деталям уведомлений"
                    >
                        Notifications
                    </h2>
                    <div className={styles.notificationsBlock}>
                        {notifications.length > 0 ? (
                            notifications.map((note, index) => (
                                <div className={styles.notificationItem} key={index}>
                                    <p>
                                        {note.news_description || `Notification #${index + 1}`}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className={styles.noDataText}>No notifications.</p>
                        )}
                    </div>
                </div>

                <button className={styles.scanAgainButton} onClick={handleScanAgain}>
                    You can scan again
                </button>
            </div>
        </div>
    );
}

export default Profile;
