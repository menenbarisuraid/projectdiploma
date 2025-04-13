import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import Header from './../Header/Header';
import styles from './FavouriteDetails.module.css';

function FavouriteDetails() {
    const navigate = useNavigate();
    const [favouriteProducts, setFavouriteProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        const fetchFavouriteProducts = async () => {
            setLoading(true);
            setError('');
            try {
                const config = {
                    headers: { Authorization: `Bearer ${token}` },
                };
                const favRes = await axios.get(
                    'https://quramdetector-3uaf.onrender.com/favourites',
                    config
                );
                setFavouriteProducts(favRes.data.data.favourites || []);
            } catch (err) {
                console.error('Ошибка при загрузке избранных товаров:', err);
                setError('Ошибка при загрузке данных. Попробуйте позже.');
            } finally {
                setLoading(false);
            }
        };
        fetchFavouriteProducts();
    }, [navigate]);

    const handleProductClick = (product) => {
        navigate('/product-details', { state: { product } });
    };

    const handleRemoveFavourite = async (product, e) => {
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
            // Обновляем локальное состояние, удаляя продукт
            setFavouriteProducts((prev) =>
                prev.filter((item) => item.id !== product.id)
            );
        } catch (err) {
            console.error('Ошибка при удалении из избранного:', err);
        }
    };

    return (
        <div className={styles.favouritePage}>
            <Header userName={localStorage.getItem('name') || ''} />
            <div className={styles.heroSection}>
                <div className={styles.heroWave}></div>
                <h1 className={styles.heroTitle}>Favourite Products</h1>
                <p className={styles.heroSubtitle}>Here are your favourite items</p>
                <div className={styles.heroGlow}></div>
            </div>
            <div className={styles.contentWrapper}>
                <h2 className={styles.contentTitle}>Favourite Products Details</h2>
                {error && <div className={styles.error}>{error}</div>}
                {loading && <p className={styles.loadingText}>Loading...</p>}
                {!loading && !error && (
                    <div className={styles.productsGrid}>
                        {favouriteProducts.length > 0 ? (
                            favouriteProducts.map((item, index) => (
                                <div
                                    key={index}
                                    className={styles.productCard}
                                    onClick={() => handleProductClick(item)}
                                >
                                    <button
                                        className={styles.removeButton}
                                        onClick={(e) => handleRemoveFavourite(item, e)}
                                    >
                                        <FaTimes />
                                    </button>
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.name || `Favourite #${index + 1}`}
                                            className={styles.productImage}
                                        />
                                    ) : (
                                        <div className={styles.imagePlaceholder}>No Image</div>
                                    )}
                                    <p className={styles.productName}>
                                        {item.name || `Favourite #${index + 1}`}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className={styles.noData}>No favourite products.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default FavouriteDetails;
