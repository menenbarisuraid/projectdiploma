import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './FavouritesPage.module.css';
import Footer from "../Footer/Footer"; // стили

function FavouritesPage() {
    const [favourites, setFavourites] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            fetchFavourites(token);
        }
    }, [navigate]);

    const fetchFavourites = async (token) => {
        try {
            const response = await axios.get('https://quramdetector-k92n.onrender.com/favourites', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFavourites(response.data?.data?.favourites || []);
        } catch (error) {
            console.error('Ошибка при загрузке избранных продуктов:', error);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleRemoveFavourite = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            await axios.post(
                'https://quramdetector-k92n.onrender.com/favourites/toggle',
                { product_id: productId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setFavourites((prev) => prev.filter((item) => item.id !== productId));
        } catch (error) {
            console.error('Ошибка при удалении продукта из избранного:', error);
        }
    };

    const filteredFavourites = favourites.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={styles.favouritesPage}>
            <div className={styles.container}>
                <h1 className={styles.title}>Quram Detector</h1>

                <div className={styles.header}>
                    <input
                        type="text"
                        placeholder="Поиск"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className={styles.searchInput}
                    />
                    <button className={styles.cameraButton}>
                        <span role="img" aria-label="camera">📷</span>
                    </button>
                </div>

                <div className={styles.favouritesList}>
                    {filteredFavourites.map((product) => (
                        <div key={product.id} className={styles.favouriteItem}>
                            <div className={styles.productInfo}>
                                {product.imageUrl && (
                                    <div className={styles.productImageWrapper}>
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className={styles.productImage}
                                        />
                                    </div>
                                )}
                                <h4>{product.name}</h4>
                            </div>
                            <button
                                className={styles.removeButton}
                                onClick={() => handleRemoveFavourite(product.id)}
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default FavouritesPage;
