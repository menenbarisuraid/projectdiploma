import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaHeart, FaRegHeart } from 'react-icons/fa';
import Header from './../Header/Header';
import Footer from './../Footer/Footer';
import styles from './HomePage.module.css';

const TOP_PRODUCTS_URL = 'https://quramdetector-3uaf.onrender.com/top-products';

export default function HomePage() {
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
            const name = localStorage.getItem('name');
            setUserName(name || '');
        }
    }, [navigate]);

    useEffect(() => {
        const fetchTopProducts = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const response = await axios.get(TOP_PRODUCTS_URL, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const topProductsArray = response.data?.data?.products || [];
                setTopProducts(topProductsArray);
                setDisplayProducts(topProductsArray);
            } catch (error) {
                console.error('Ошибка при получении top-products:', error);
                setTopProducts([]);
                setDisplayProducts([]);
            }
        };
        fetchTopProducts();
    }, []);

    useEffect(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) {
            setDisplayProducts(topProducts);
        } else {
            setDisplayProducts(
                topProducts.filter(product =>
                    product.name.toLowerCase().includes(query)
                )
            );
        }
    }, [searchQuery, topProducts]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleCameraClick = () => {
        navigate('/scanpage');
    };

    const handleScanProduct = () => {
        navigate('/products');
    };

    const handleProductClick = (product) => {
        navigate('/product-details', { state: { product } });
    };

    const handleDetailsClick = (product, e) => {
        e.stopPropagation();
        navigate('/product-details', { state: { product } });
    };

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

    const getStatusClass = (status) => {
        if (!status) return '';
        const lowerStatus = status.toLowerCase();
        if (lowerStatus === 'halal' || lowerStatus === 'халал') {
            return styles.halal;
        } else if (lowerStatus === 'haram' || lowerStatus === 'харам') {
            return styles.haram;
        } else if (lowerStatus === 'suspect') {
            return styles.suspicious;
        }
        return '';
    };

    return (
        <div className={styles.homePage}>
            <Header userName={userName} />

            <div className={styles.heroSection}>
                <div className={styles.heroWave}></div>
                <h1 className={styles.heroTitle}>Quram Detector</h1>
                <p className={styles.heroSubtitle}>
                    Discover top halal products with ease
                </p>
                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Search products..."
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
                    Scan the product
                </button>
            </div>

            <div className={styles.contentWrapper}>
                <div className={styles.featureWrapper}>
                    <button
                        className={styles.featureButton}
                        onClick={() => navigate('/newfeature')}
                    >
                        Try our new Feature
                    </button>
                </div>

                <h2 className={styles.sectionTitle}>Popular Products</h2>
                <div className={styles.productsScroll}>
                    {displayProducts.map((product) => (
                        <div
                            key={product.id}
                            className={styles.productCard}
                            onClick={() => handleProductClick(product)}
                        >
                            <button
                                className={styles.favouriteButton}
                                onClick={(e) => handleFavouriteClick(product, e)}
                            >
                                {favourites.includes(product.id) ? (
                                    <FaHeart className={styles.favouriteIcon} />
                                ) : (
                                    <FaRegHeart className={styles.favouriteIcon} />
                                )}
                            </button>
                            <img
                                src={product.image}
                                alt={product.name}
                                className={styles.productImage}
                            />
                            <h4 className={styles.productName}>{product.name}</h4>
                            <div className={styles.cardFooter}>
                                <p
                                    className={`${styles.productStatus} ${getStatusClass(
                                        product.status
                                    )}`}
                                >
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
                    ))}
                </div>
            </div>

            <div className={styles.infoSection}>
                <div className={styles.instruction}>
                    <h3
                        onClick={() => navigate('/instruction')}
                        style={{ cursor: 'pointer' }}
                    >
                        Instruction
                    </h3>
                    <p>
                        Здесь приведена инструкция по использованию сайта:
                        <br />
                        1. Нажмите на иконку камеры, чтобы сфотографировать состав и сканировать.
                        <br />
                        2. Или нажмите «Scan the product» и введите состав вручную.
                        <br />
                        3. В результатах будет указан статус Halal или Haram.
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
}
