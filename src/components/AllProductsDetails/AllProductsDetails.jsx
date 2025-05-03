import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import Header from './../Header/Header';
import styles from './AllProductsDetails.module.css';
import Footer from "../Footer/Footer";

const PRODUCTS_URL = 'https://quramdetector-k92n.onrender.com/products';

export default function AllProductsDetails() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [favourites, setFavourites] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

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
                const response = await axios.get(PRODUCTS_URL, config);
                let productsArray = response.data.data.products || [];
                productsArray.sort((a, b) => a.name.localeCompare(b.name));
                setProducts(productsArray);
            } catch (err) {
                setError(t('allProductsError'));
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
        } catch (err) {
            console.error(err);
        }
    };

    const handleProductClick = product =>
        navigate('/product-details', { state: { product } });

    const handleDetailsClick = (product, e) => {
        e.stopPropagation();
        navigate('/product-details', { state: { product } });
    };

    const getStatusClass = status => {
        if (!status) return '';
        const lower = status.toLowerCase();
        if (lower === 'halal' || lower === 'халал')   return styles.halal;
        if (lower === 'haram' || lower === 'харам')   return styles.haram;
        if (lower === 'suspect' || lower === 'подозрительно') return styles.suspicious;
        return '';
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={styles.allProductsPage}>
            <Header />

            <div className={styles.heroSection}>
                <LanguageSwitcher />
                <div className={styles.heroWave}></div>
                <h1 className={styles.heroTitle}>
                    {t('allProductsHeroTitle')}
                </h1>
                <p className={styles.heroSubtitle}>
                    {t('allProductsHeroSubtitle')}
                </p>
                <div className={styles.heroGlow}></div>
            </div>

            <div className={styles.contentWrapper}>
                <div className={styles.searchWrapper}>
                    <input
                        type="text"
                        placeholder={t('allProductsSearchPlaceholder')}
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>

                {error && <div className={styles.error}>{error}</div>}

                {loading ? (
                    <p className={styles.loadingText}>Loading...</p>
                ) : (
                    <div className={styles.productsGrid}>
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map(product => (
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
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className={styles.productImage}
                                    />
                                    <p className={styles.productName}>
                                        {product.name}
                                    </p>
                                    <div className={styles.cardFooter}>
                                        <p
                                            className={`${styles.productStatus} ${getStatusClass(product.status)}`}
                                        >
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
                            ))
                        ) : (
                            <p className={styles.noData}>
                                {t('allProductsNoData')}
                            </p>
                        )}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
