import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEye } from 'react-icons/fa';
import Header from './../Header/Header';
import styles from './Products.module.css';

const TOP_PRODUCTS_URL = 'https://quramdetector-3uaf.onrender.com/top-products';
const PRODUCTS_URL = 'https://quramdetector-3uaf.onrender.com/products';

function Products() {
    const navigate = useNavigate();

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
        const fetchTopProducts = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const response = await axios.get(TOP_PRODUCTS_URL, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const topProductsArray = response.data?.data?.products || [];
                setTopProducts(topProductsArray);
            } catch (error) {
                console.error('Ошибка при загрузке top-products:', error);
                setTopProducts([]);
            }
        };
        fetchTopProducts();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const response = await axios.get(PRODUCTS_URL, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                let productsArray = response.data?.data?.products || [];
                productsArray.sort((a, b) => a.name.localeCompare(b.name));
                setProducts(productsArray);
                setFilteredProducts(productsArray);
            } catch (error) {
                console.error('Ошибка при загрузке products:', error);
                setProducts([]);
                setFilteredProducts([]);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(
                products.filter((product) =>
                    product.name.toLowerCase().includes(query)
                )
            );
        }
    }, [searchQuery, products]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleCameraClick = () => {
        navigate('/scanpage');
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

    const handleProductClick = (product) => {
        navigate('/product-details', { state: { product } });
    };

    const handleDetailsClick = (product, e) => {
        e.stopPropagation();
        navigate('/product-details', { state: { product } });
    };

    const goToTopProductsDetails = () => {
        navigate('/topproductsdetails');
    };

    const goToAllProductsDetails = () => {
        navigate('/allproductsdetails');
    };

    // Функция для получения класса статуса:
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
        <div className={styles.productsPage}>
            <Header userName={userName} />
            <div className={styles.heroSection}>
                <div className={styles.heroWave}></div>
                <h1 className={styles.heroTitle}>Quram Detector</h1>
                <p className={styles.heroSubtitle}>Scan and Check with Confidence</p>
                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Search products..."
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
                        Top Products
                    </h2>
                    <div className={styles.topProductsScroll}>
                        {topProducts.map((product) => (
                            <div
                                key={product.id}
                                className={styles.topProductCard}
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
                                    className={styles.topProductImage}
                                />
                                <p className={styles.topProductText}>{product.name}</p>
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
                        ))}
                    </div>
                </section>
                <section className={styles.allProductsSection}>
                    <h2 className={styles.sectionTitle} onClick={goToAllProductsDetails}>
                        All Products
                    </h2>
                    <div className={styles.allProductsGrid}>
                        {filteredProducts.slice(0, 10).map((product) => (
                            <div
                                key={product.id}
                                className={styles.allProductItem}
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
                                    className={styles.allProductImage}
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
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Products;
