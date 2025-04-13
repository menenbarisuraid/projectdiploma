import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from './../Header/Header';
import styles from './AlternativeProducts.module.css';

function AlternativeProducts() {
    const navigate = useNavigate();
    const { state } = useLocation();

    const [userName, setUserName] = useState('');
    // Читаем весь список альтернатив, переданный из ScanPage
    const [alternatives] = useState(state?.allAlternatives || []);
    const [filteredAlternatives, setFilteredAlternatives] = useState(state?.allAlternatives || []);
    const [searchQuery, setSearchQuery] = useState('');

    // Если нет токена – перебрасываем на /login
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            const name = localStorage.getItem('name');
            setUserName(name || '');
        }
    }, [navigate]);

    // Фильтрация по поиску
    useEffect(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) {
            setFilteredAlternatives(alternatives);
        } else {
            setFilteredAlternatives(
                alternatives.filter((alt) =>
                    alt.name.toLowerCase().includes(query)
                )
            );
        }
    }, [searchQuery, alternatives]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleAlternativeClick = (alternative) => {
        navigate('/product-details', { state: { product: alternative } });
    };

    return (
        <div className={styles.alternativeProductsPage}>
            <Header userName={userName} />
            <div className={styles.heroSection}>
                <div className={styles.heroWave}></div>
                <h1 className={styles.heroTitle}>Alternative Products</h1>
                <p className={styles.heroSubtitle}>Explore Alternative Options</p>
                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Search alternatives..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className={styles.searchInput}
                    />
                </div>
                <div className={styles.heroGlow}></div>
            </div>

            <div className={styles.contentWrapper}>
                <section className={styles.alternativesSection}>
                    <h2 className={styles.sectionTitle}>All Alternatives</h2>

                    {filteredAlternatives.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#666' }}>
                            Нет альтернатив (возможно, вы не сканировали продукт)
                        </p>
                    ) : (
                        <div className={styles.alternativesGrid}>
                            {filteredAlternatives.map((alternative) => (
                                <div
                                    key={alternative.id}
                                    className={styles.alternativeItem}
                                    onClick={() => handleAlternativeClick(alternative)}
                                >
                                    <img
                                        src={alternative.image}
                                        alt={alternative.name}
                                        className={styles.alternativeImage}
                                    />
                                    <p className={styles.alternativeName}>{alternative.name}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

export default AlternativeProducts;
