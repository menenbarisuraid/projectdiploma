// src/components/EditAllScans/EditAllScans.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import styles from './EditAllScans.module.css';

export default function EditAllScans() {
    const navigate = useNavigate();
    const { t } = useTranslation();

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
            .get('https://quramdetector-k92n.onrender.com/admin/scan-products', {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setScans(response.data.data || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Ошибка при получении сканов:', err);
                setError(t('editScansError'));
                setLoading(false);
            });
    }, [navigate, t]);

    const handleEditClick = (scanId) => {
        navigate(`/adminpagedetails/${scanId}`);
    };

    return (
        <div className={styles.editAllScans}>
            <LanguageSwitcher />

            <div className={styles.heroSection}>
                <div className={styles.heroWave} />
                <div className={styles.heroGlow} />
                <h1 className={styles.heroTitle}>{t('editScansTitle')}</h1>
                <p className={styles.heroSubtitle}>{t('editScansSubtitle')}</p>
            </div>

            <div className={styles.contentContainer}>
                {error && <p className={styles.errorText}>{error}</p>}

                {loading ? (
                    <p className={styles.loadingText}>{t('editScansLoading')}</p>
                ) : (
                    <div className={styles.grid}>
                        {scans.map((item) => (
                            <div
                                key={item.scan_id}
                                className={`${styles.card} ${item.is_processed ? styles.processed : ''}`}
                                onClick={() => handleEditClick(item.scan_id)}
                            >
                                <div className={styles.cardImage}>
                                    <img
                                        src={item.image || 'https://via.placeholder.com/150'}
                                        alt={item.product_name || t('editScansNoName')}
                                    />
                                </div>
                                <div className={styles.cardContent}>
                                    <h2 className={styles.cardTitle}>
                                        {item.product_name || t('editScansNoName')}
                                    </h2>
                                    <p className={styles.cardSubtitle}>
                                        {t('editScansStatusLabel')} {item.status || t('editScansUnknown')}
                                    </p>
                                    <p className={styles.cardSubtitle}>
                                        {item.is_processed
                                            ? t('editScansProcessed')
                                            : t('editScansNotProcessed')}
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
