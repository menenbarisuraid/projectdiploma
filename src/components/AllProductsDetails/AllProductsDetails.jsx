import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import Header from './../Header/Header';
import styles from './AllProductsDetails.module.css';

const PRODUCTS_URL = 'https://quramdetector-3uaf.onrender.com/products';

function AllProductsDetails() {
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
        const fetchProducts = async () => {
            setLoading(true);
            setError('');
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const response = await axios.get(PRODUCTS_URL, config);
                let productsArray = response.data.data.products || [];
                productsArray.sort((a, b) => a.name.localeCompare(b.name));
                setProducts(productsArray);
            } catch (err) {
                setError('Ошибка при загрузке данных. Попробуйте позже.');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [navigate]);

    const handleFavouriteClick = async (product, e) => {
        e.stopPropagation();
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            await axios.post(
                'https://quramdetector-3uaf.onrender.com/favourites/toggle',
                { product_id: product.id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (favourites.includes(product.id)) {
                setFavourites(favourites.filter((id) => id !== product.id));
            } else {
                setFavourites([...favourites, product.id]);
            }
        } catch (error) {
            console.error('Ошибка при переключении избранного:', error);
        }
    };

    const handleProductClick = (product) => {
        navigate('/product-details', { state: { product } });
    };

    const handleDetailsClick = (product, e) => {
        e.stopPropagation();
        navigate('/product-details', { state: { product } });
    };

    const getStatusClass = (status) => {
        if (!status) return '';
        const lowerStatus = status.toLowerCase();
        if (lowerStatus === 'halal' || lowerStatus === 'халал') {
            return styles.halal;
        } else if (lowerStatus === 'haram' || lowerStatus === 'харам') {
            return styles.haram;
        } else if (lowerStatus === 'подозрительно') {
            return styles.suspicious;
        }
        return '';
    };

    // Фильтрация продуктов по поисковому запросу
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={styles.allProductsPage}>
            <Header />
            <div className={styles.heroSection}>
                <div className={styles.heroWave}></div>
                <h1 className={styles.heroTitle}>All Products Details</h1>
                <p className={styles.heroSubtitle}>Browse all available products</p>
                <div className={styles.heroGlow}></div>
            </div>
            <div className={styles.contentWrapper}>
                {/* Поисковая строка внутри контейнера */}
                <div className={styles.searchWrapper}>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
                {error && <div className={styles.error}>{error}</div>}
                {loading ? (
                    <p className={styles.loadingText}>Loading...</p>
                ) : (
                    <div className={styles.productsGrid}>
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className={styles.productCard}
                                    onClick={() => handleProductClick(product)}
                                >
                                    <button
                                        className={styles.favouriteButton}
                                        onClick={(e) => handleFavouriteClick(product, e)}
                                    >
                                        {favourites.includes(product.id) ? '❤️' : '♡'}
                                    </button>
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className={styles.productImage}
                                    />
                                    <p className={styles.productName}>{product.name}</p>
                                    <div className={styles.cardFooter}>
                                        <p className={`${styles.productStatus} ${getStatusClass(product.status)}`}>
                                            {product.status}
                                        </p>
                                        <button
                                            className={styles.detailsButton}
                                            onClick={(e) => handleDetailsClick(product, e)}
                                        >
                                            <FaEye className={styles.detailsIcon} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className={styles.noData}>No products found.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AllProductsDetails;
