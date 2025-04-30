// src/components/HomePage/HomePage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import styles from './HomePage.module.css';

const TOP_PRODUCTS_URL = 'https://quramdetector-k92n.onrender.com/top-products';

export default function HomePage() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [userName, setUserName] = useState('');
    const [topProducts, setTopProducts] = useState([]);
    const [displayProducts, setDisplayProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [favourites, setFavourites] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            setUserName(localStorage.getItem('name') || '');
        }
    }, [navigate]);

    useEffect(() => {
        (async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const { data } = await axios.get(TOP_PRODUCTS_URL, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const products = data?.data?.products || [];
                setTopProducts(products);
                setDisplayProducts(products);
            } catch (err) {
                console.error(err);
                setTopProducts([]);
                setDisplayProducts([]);
            }
        })();
    }, []);

    useEffect(() => {
        const q = searchQuery.trim().toLowerCase();
        setDisplayProducts(
            !q
                ? topProducts
                : topProducts.filter(p => p.name.toLowerCase().includes(q))
        );
    }, [searchQuery, topProducts]);

    const handleSearchChange = e => setSearchQuery(e.target.value);
    const handleCameraClick  = () => navigate('/scanpage');
    const handleScanProduct  = () => navigate('/products');
    const handleProductClick = product => navigate('/product-details', { state: { product } });
    const handleDetailsClick = (product, e) => {
        e.stopPropagation();
        navigate('/product-details', { state: { product } });
    };
    const handleFavouriteClick = async (product, e) => {
        e.stopPropagation();
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');
        try {
            await axios.post(
                'https://quramdetector-k92n.onrender.com/favourites/toggle',
                { product_id: product.id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setFavourites(f =>
                f.includes(product.id) ? f.filter(id => id !== product.id) : [...f, product.id]
            );
        } catch (err) {
            console.error(err);
        }
    };

    const getStatusClass = status => {
        if (!status) return '';
        const st = status.toLowerCase();
        if (st === 'таза') return styles.halal;
        if (st === 'таза емес') return styles.haram;
        if (st === 'күмәнді') return styles.suspicious;
        return '';
    };

    return (
        <div className={styles.homePage}>
            <Header userName={userName} />

            <div className={styles.heroSection}>
                <LanguageSwitcher />
                <div className={styles.heroWave}></div>
                <h1 className={styles.heroTitle}>
                    Quram Detector
                </h1>
                <p className={styles.heroSubtitle}>
                    {t('homeHeroSubtitle')}
                </p>

                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder={t('homeSearchPlaceholder')}
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className={styles.searchInput}
                    />
                    <button
                        className={styles.cameraButton}
                        onClick={handleCameraClick}
                    >
                        <span role="img" aria-label="camera">📷</span>
                    </button>
                </div>

                <button
                    className={styles.scanButton}
                    onClick={handleScanProduct}
                >
                    {t('homeScanButton')}
                </button>
            </div>

            {/* Основной контент */}
            <div className={styles.contentWrapper}>
                <div className={styles.featureWrapper}>
                    <button
                        className={styles.featureButton}
                        onClick={() => navigate('/newfeature')}
                    >
                        {t('homeNewFeature')}
                    </button>
                </div>

                <h2 className={styles.sectionTitle}>
                    {t('homeSectionTitle')}
                </h2>

                <div className={styles.productsScroll}>
                    {displayProducts.map(product => (
                        <div
                            key={product.id}
                            className={styles.productCard}
                            onClick={() => handleProductClick(product)}
                        >
                            <button
                                className={styles.favouriteButton}
                                onClick={e => handleFavouriteClick(product, e)}
                            >
                                {favourites.includes(product.id)
                                    ? <FaHeart className={styles.favouriteIcon}/>
                                    : <FaRegHeart className={styles.favouriteIcon}/>}
                            </button>

                            <img
                                src={product.image}
                                alt={product.name}
                                className={styles.productImage}
                            />

                            <p className={styles.productName}>
                                {product.name}
                            </p>

                            <div className={styles.cardFooter}>
                <span
                    className={`${styles.productStatus} ${getStatusClass(product.status)}`}
                >
                  {product.status}
                </span>
                                <button
                                    className={styles.detailsButton}
                                    onClick={e => handleDetailsClick(product, e)}
                                >
                                    <FaEye className={styles.detailsIcon}/>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Инструкция */}
            <div className={styles.infoSection}>
                <div className={styles.instruction}>
                    <h3
                        onClick={() => navigate('/instruction')}
                        style={{ cursor: 'pointer' }}
                    >
                        {t('homeInstructionTitle')}
                    </h3>
                    <p>
                        {t('homeInstructionStep1')}<br/>
                        {t('homeInstructionStep2')}<br/>
                        {t('homeInstructionStep3')}
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
}
