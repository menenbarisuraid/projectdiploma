import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './EditAllScans.module.css';

function EditAllScans() {
    const navigate = useNavigate();
    const [scans, setScans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        axios
            .get('https://quramdetector-3uaf.onrender.com/admin/scan-products', {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                // Ответ сервера должен иметь вид:
                // {
                //   "data": [
                //       {
                //           "image": "https://storage.googleapis.com/quram_product_photo/1e022b7a87ef4dc79872be3d57ba1b14_maxi.jpeg",
                //           "is_processed": false,
                //           "product_name": "напиток безалкогольный",
                //           "scan_id": 194,
                //           "status": "halal",
                //           "user_id": 8
                //       },
                //       ...
                //   ]
                // }
                setScans(response.data.data || []);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Ошибка при получении сканов:', error);
                setError('Failed to load scans. Please try again later.');
                setLoading(false);
            });
    }, [navigate]);

    // При клике на карточку скана — переход на /adminpagedetails/:scan_id
    const handleEditClick = (scanId) => {
        navigate(`/adminpagedetails/${scanId}`);
    };

    return (
        <div className={styles.editAllScans}>
            <div className={styles.heroSection}>
                <div className={styles.heroWave}></div>
                <div className={styles.heroGlow}></div>
                <h1 className={styles.heroTitle}>Edit All Scans</h1>
                <p className={styles.heroSubtitle}>Modify or update scanned products</p>
            </div>

            <div className={styles.contentContainer}>
                {error && <p className={styles.errorText}>{error}</p>}

                {loading ? (
                    <p className={styles.loadingText}>Loading...</p>
                ) : (
                    <div className={styles.grid}>
                        {scans.map((item) => (
                            <div
                                key={item.scan_id}
                                // Если is_processed true — добавляем класс processed (желтый фон)
                                className={`${styles.card} ${item.is_processed ? styles.processed : ''}`}
                                onClick={() => handleEditClick(item.scan_id)}
                            >
                                <div className={styles.cardImage}>
                                    <img
                                        // Используем item.image или, если его нет, заглушку
                                        src={item.image || "https://via.placeholder.com/150"}
                                        alt={item.product_name || 'No Name'}
                                    />
                                </div>
                                <div className={styles.cardContent}>
                                    <h2 className={styles.cardTitle}>
                                        {item.product_name || 'No Name'}
                                    </h2>
                                    <p className={styles.cardSubtitle}>
                                        Status: {item.status || 'unknown'}
                                    </p>
                                    <p className={styles.cardSubtitle}>
                                        {item.is_processed ? 'Processed' : 'Not processed'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default EditAllScans;
