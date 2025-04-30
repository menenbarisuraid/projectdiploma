// src/components/Products/Products.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEye } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import Header from './../Header/Header';
import styles from './Products.module.css';

const TOP_PRODUCTS_URL = 'https://quramdetector-k92n.onrender.com/top-products';
const PRODUCTS_URL     = 'https://quramdetector-k92n.onrender.com/products';

export default function Products() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [userName, setUserName] = useState('');
    const [topProducts, setTopProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [favourites, setFavourites] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            const name = localStorage.getItem('name');
            setUserName(name || '');
        }
    }, [navigate]);

    useEffect(() => {
        (async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const { data } = await axios.get(TOP_PRODUCTS_URL, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTopProducts(data?.data?.products || []);
            } catch (error) {
                console.error('Ошибка при загрузке top-products:', error);
                setTopProducts([]);
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const { data } = await axios.get(PRODUCTS_URL, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const productsArray = (data?.data?.products || []).sort((a, b) =>
                    a.name.localeCompare(b.name)
                );
                setProducts(productsArray);
                setFilteredProducts(productsArray);
            } catch (error) {
                console.error('Ошибка при загрузке products:', error);
                setProducts([]);
                setFilteredProducts([]);
            }
        })();
    }, []);

    useEffect(() => {
        const q = searchQuery.trim().toLowerCase();
        setFilteredProducts(
            q ? products.filter(p => p.name.toLowerCase().includes(q)) : products
        );
    }, [searchQuery, products]);

    const handleSearchChange = e => setSearchQuery(e.target.value);
    const handleCameraClick   = () => navigate('/scanpage');

    const handleFavouriteClick = async (product, e) => {
        e.stopPropagation();
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        try {
            await axios.post(
                'https://quramdetector-k92n.onrender.com/favourites/toggle',
                { product_id: product.id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setFavourites(prev =>
                prev.includes(product.id)
                    ? prev.filter(id => id !== product.id)
                    : [...prev, product.id]
            );
        } catch (error) {
            console.error('Ошибка при переключении избранного:', error);
        }
    };

    const handleProductClick = product =>
        navigate('/product-details', { state: { product } });

    const handleDetailsClick = (product, e) => {
        e.stopPropagation();
        navigate('/product-details', { state: { product } });
    };

    const goToTopProductsDetails = () => navigate('/topproductsdetails');
    const goToAllProductsDetails = () => navigate('/allproductsdetails');

    const getStatusClass = status => {
        if (!status) return '';
        const s = status.toLowerCase();
        if (['halal', 'халал'].includes(s)) return styles.halal;
        if (['haram', 'харам'].includes(s)) return styles.haram;
        if (s === 'suspect') return styles.suspicious;
        return '';
    };

    return (
        <div className={styles.productsPage}>
            <Header userName={userName} />

            <div className={styles.heroSection}>
                <LanguageSwitcher />
                <div className={styles.heroWave}></div>
                <h1 className={styles.heroTitle}>Quram Detector</h1>
                <p className={styles.heroSubtitle}>{t('productsHeroSubtitle')}</p>

                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder={t('productsSearchPlaceholder')}
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className={styles.searchInput}
                    />
                    <button className={styles.cameraButton} onClick={handleCameraClick}>
                        <span role="img" aria-label="camera">📷</span>
                    </button>
                </div>
                <div className={styles.heroGlow}></div>
            </div>

            <div className={styles.contentWrapper}>
                <section className={styles.topProductsSection}>
                    <h2 className={styles.sectionTitle} onClick={goToTopProductsDetails}>
                        <strong>{t('productsTopTitle')}</strong>
                    </h2>
                    <div className={styles.topProductsScroll}>
                        {topProducts.map(product => (
                            <div
                                key={product.id}
                                className={styles.topProductCard}
                                onClick={() => handleProductClick(product)}
                            >
                                <button
                                    className={styles.favouriteButton}
                                    onClick={e => handleFavouriteClick(product, e)}
                                >
                                    {favourites.includes(product.id) ? '❤️' : '♡'}
                                </button>
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className={styles.topProductImage}
                                />
                                <p className={styles.topProductText}>{product.name}</p>
                                <div className={styles.cardFooter}>
                                    <p className={`${styles.productStatus} ${getStatusClass(product.status)}`}>
                                        {product.status}
                                    </p>
                                    <button
                                        className={styles.detailsButton}
                                        onClick={e => handleDetailsClick(product, e)}
                                    >
                                        <FaEye className={styles.detailsIcon} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className={styles.allProductsSection}>
                    <h2 className={styles.sectionTitle} onClick={goToAllProductsDetails}>
                        <strong>{t('productsAllTitle')}</strong>
                    </h2>
                    <div className={styles.allProductsGrid}>
                        {filteredProducts.slice(0, 10).map(product => (
                            <div
                                key={product.id}
                                className={styles.allProductItem}
                                onClick={() => handleProductClick(product)}
                            >
                                <button
                                    className={styles.favouriteButton}
                                    onClick={e => handleFavouriteClick(product, e)}
                                >
                                    {favourites.includes(product.id) ? '❤️' : '♡'}
                                </button>
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className={styles.allProductImage}
                                />
                                <p className={styles.productName}>{product.name}</p>
                                <div className={styles.cardFooter}>
                                    <p className={`${styles.productStatus} ${getStatusClass(product.status)}`}>
                                        {product.status}
                                    </p>
                                    <button
                                        className={styles.detailsButton}
                                        onClick={e => handleDetailsClick(product, e)}
                                    >
                                        <FaEye className={styles.detailsIcon} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
