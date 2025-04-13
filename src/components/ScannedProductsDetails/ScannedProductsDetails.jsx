import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './../Header/Header';
import styles from './ScannedProductsDetails.module.css';

function ScannedProductsDetails() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        axios
            .get('https://quramdetector-3uaf.onrender.com/scan-history', {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then((response) => {
                setProducts(response.data.history || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Ошибка загрузки сканированных товаров:', err);
                setError('Что-то пошло не так. Попробуйте позже.');
                setLoading(false);
            });
    }, [navigate]);

    // При клике берем scan_id и передаем его в маршрут /infoscannedproductdetails/:scan_id
    const handleProductClick = (product) => {
        if (!product.scan_id) {
            console.warn('У продукта нет scan_id');
            return;
        }
        navigate(`/infoscannedproductdetails/${product.scan_id}`);
    };

    return (
        <div className={styles.scannedProductsPage}>
            <Header />

            <div className={styles.heroSection}>
                <div className={styles.heroWave}></div>
                <h1 className={styles.heroTitle}>Scanned Products</h1>
                <p className={styles.heroSubtitle}>Review your scanned products below</p>
                <div className={styles.heroGlow}></div>
            </div>

            <div className={styles.contentWrapper}>
                {error && <div className={styles.error}>{error}</div>}
                {loading ? (
                    <p className={styles.loadingText}>Loading...</p>
                ) : (
                    <div className={styles.grid}>
                        {products.length > 0 ? (
                            products.map((product, index) => (
                                <div
                                    className={`${styles.card} ${product.is_processed ? styles.processed : ''}`}
                                    key={product.scan_id || index}
                                    onClick={() => handleProductClick(product)}
                                >
                                    <div className={styles.imageWrapper}>
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt={product.product_name || `Product #${index + 1}`}
                                                className={styles.productImage}
                                            />
                                        ) : (
                                            <div className={styles.imagePlaceholder}>No Image</div>
                                        )}
                                    </div>
                                    <div className={styles.cardContent}>
                                        <h2 className={styles.productName}>
                                            {product.product_name || `Product #${index + 1}`}
                                        </h2>
                                        <p className={styles.status}>{product.status}</p>
                                        <p className={styles.scanDate}>{product.scan_date}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className={styles.noDataText}>No scanned products found.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ScannedProductsDetails;
