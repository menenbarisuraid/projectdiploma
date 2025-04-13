import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import styles from './TopProductsDetails.module.css';

const TOP_PRODUCTS_URL = 'https://quramdetector-3uaf.onrender.com/top-products';

function TopProductsDetails() {
    const navigate = useNavigate();
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
        const fetchTopProducts = async () => {
            setLoading(true);
            setError('');
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const response = await axios.get(TOP_PRODUCTS_URL, config);
                setTopProducts(response.data.data.products || []);
            } catch (err) {
                setError('Ошибка при загрузке данных. Попробуйте позже.');
            } finally {
                setLoading(false);
            }
        };
        fetchTopProducts();
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

    return (
        <div className={styles.topProductsPage}>
            <div className={styles.heroSection}>
                <div className={styles.heroWave}></div>
                <h1 className={styles.heroTitle}>Top Products Details</h1>
                <p className={styles.heroSubtitle}>Explore all top products</p>
                <div className={styles.heroGlow}></div>
            </div>
            <div className={styles.contentWrapper}>
                {error && <div className={styles.error}>{error}</div>}
                {loading ? (
                    <p className={styles.loadingText}>Loading...</p>
                ) : (
                    <div className={styles.productsGrid}>
                        {topProducts.length > 0 ? (
                            topProducts.map((product) => (
                                <div key={product.id} className={styles.productCard} onClick={() => handleProductClick(product)}>
                                    <button className={styles.favouriteButton} onClick={(e) => handleFavouriteClick(product, e)}>
                                        {favourites.includes(product.id) ? '❤️' : '♡'}
                                    </button>
                                    <img src={product.image} alt={product.name} className={styles.productImage} />
                                    <p className={styles.productName}>{product.name}</p>
                                    <button className={styles.detailsButton} onClick={(e) => handleDetailsClick(product, e)}>
                                        <FaEye className={styles.detailsIcon} />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className={styles.noData}>No top products found.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default TopProductsDetails;
