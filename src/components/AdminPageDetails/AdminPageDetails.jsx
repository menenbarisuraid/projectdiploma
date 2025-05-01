// src/components/AdminPageDetails/AdminPageDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import styles from './AdminPageDetails.module.css';

export default function AdminPageDetails() {
    const { t } = useTranslation();
    const { scan_id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const [newProductName, setNewProductName] = useState('');
    const [newProductImage, setNewProductImage] = useState(null);
    const [newProductIngredients, setNewProductIngredients] = useState('');
    const [newProductHaramIngredients, setNewProductHaramIngredients] = useState('');
    const [newProductStatus, setNewProductStatus] = useState('');
    const [newProductDescriptionId, setNewProductDescriptionId] = useState('');
    const [newProductScanId, setNewProductScanId] = useState('');
    const [saveMessage, setSaveMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [notificationUserId, setNotificationUserId] = useState('');
    const [notificationDescription, setNotificationDescription] = useState('');
    const [notificationSuccess, setNotificationSuccess] = useState('');
    const [notificationError, setNotificationError] = useState('');

    const userIdFromStorage = localStorage.getItem('id');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        axios
            .get(`https://quramdetector-k92n.onrender.com/admin/get-scan/${scan_id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(({ data }) => {
                setProduct(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Ошибка при получении деталей скана:', err);
                setLoading(false);
            });
    }, [scan_id, navigate]);

    useEffect(() => {
        if (!product) return;
        setNewProductIngredients(product.ingredients || '');
        setNewProductStatus(product.status || '');
        if (
            product.status &&
            ['күмәнді', 'таза емес'].includes(product.status.toLowerCase())
        ) {
            setNewProductHaramIngredients(product.haram_ingredients || '');
        }
    }, [product]);

    const handleSaveProduct = async e => {
        e.preventDefault();
        setSaveMessage('');
        setErrorMessage('');

        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('product_name', newProductName);
            formData.append('ingredients', newProductIngredients);
            formData.append('status', newProductStatus);
            if (['күмәнді', 'таза емес'].includes(newProductStatus.toLowerCase())) {
                formData.append('haram_ingredients', newProductHaramIngredients);
            }
            formData.append('description_id', newProductDescriptionId);
            formData.append('scan_id', newProductScanId);
            if (newProductImage) formData.append('file', newProductImage);

            const { data } = await axios.post(
                'https://quramdetector-k92n.onrender.com/update_product',
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSaveMessage(data.message || t('adminSaveSuccess'));
            setNewProductName('');
            setNewProductIngredients('');
            setNewProductStatus('');
            setNewProductHaramIngredients('');
            setNewProductImage(null);
            setNewProductDescriptionId('');
            setNewProductScanId('');
        } catch (err) {
            console.error('Ошибка при сохранении продукта:', err);
            setErrorMessage(
                err.response?.data?.message || t('adminSaveError')
            );
        }
    };

    const handleSendNotification = async e => {
        e.preventDefault();
        setNotificationSuccess('');
        setNotificationError('');

        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const payload = {
                user_id: notificationUserId.trim() === '' ? null : notificationUserId,
                news_description: notificationDescription
            };

            const { data } = await axios.post(
                'https://quramdetector-k92n.onrender.com/notifications/send',
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setNotificationSuccess(data.message || t('adminNotifySuccess'));
            setNotificationUserId('');
            setNotificationDescription('');
        } catch (err) {
            console.error('Ошибка при отправке уведомления:', err);
            setNotificationError(
                err.response?.data?.message || t('adminNotifyError')
            );
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className={styles.adminPageDetails}>
                <div className={styles.heroSection}>
                    <div className={styles.langSwitch}>
                        <LanguageSwitcher />
                    </div>
                    <div className={styles.heroWave}></div>
                    <div className={styles.heroGlow}></div>
                    <h1 className={styles.heroTitle}>{t('adminPageHeroTitle')}</h1>
                    <p className={styles.heroSubtitle}>{t('adminLoading')}</p>
                </div>
            </div>
        );
    }

    // No data
    if (!product) {
        return (
            <div className={styles.adminPageDetails}>
                <div className={styles.heroSection}>
                    <div className={styles.langSwitch}>
                        <LanguageSwitcher />
                    </div>
                    <div className={styles.heroWave}></div>
                    <div className={styles.heroGlow}></div>
                    <h1 className={styles.heroTitle}>{t('adminPageHeroTitle')}</h1>
                    <p className={styles.heroSubtitle}>{t('adminNoData')}</p>
                </div>
            </div>
        );
    }

    // Main content
    return (
        <div className={styles.adminPageDetails}>
            <div className={styles.heroSection}>
                <div className={styles.langSwitch}>
                    <LanguageSwitcher />
                </div>
                <div className={styles.heroWave}></div>
                <div className={styles.heroGlow}></div>
                <h1 className={styles.heroTitle}>{t('adminPageHeroTitle')}</h1>
                <p className={styles.heroSubtitle}>{t('adminPageHeroSubtitle')}</p>
            </div>

            <div className={styles.contentContainer}>
                {/* Scan details */}
                <div
                    className={`${styles.card} ${
                        product.is_processed ? styles.processed : ''
                    }`}
                >
                    <h2 className={styles.cardTitle}>{t('adminScanDetails')}</h2>
                    <div className={styles.detailsWrapper}>
                        <div className={styles.imageContainer}>
                            <img
                                src={product.image || 'https://via.placeholder.com/300'}
                                alt={product.product_name}
                                className={styles.productImage}
                            />
                        </div>
                        <div className={styles.infoContainer}>
                            <p className={styles.productLabel}>
                                <strong>{t('adminLabelName')}</strong> {product.product_name}
                            </p>
                            <p className={styles.productLabel}>
                                <strong>{t('adminLabelStatus')}</strong> {product.status}
                            </p>
                            <p className={styles.productLabel}>
                                <strong>{t('adminLabelIngredients')}</strong>{' '}
                                {product.ingredients}
                            </p>
                            <p className={styles.productLabel}>
                                <strong>Scan ID:</strong>{' '}
                                {product.scan_id || t('scanInfoNoId')}
                            </p>
                            <p className={styles.productLabel}>
                                <strong>{t('adminLabelUser')}</strong> {userIdFromStorage}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Add / Update product form */}
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>{t('adminAddProduct')}</h2>
                    {saveMessage && (
                        <p className={styles.successMessage}>{saveMessage}</p>
                    )}
                    {errorMessage && (
                        <p className={styles.errorMessage}>{errorMessage}</p>
                    )}

                    <form onSubmit={handleSaveProduct} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="productName">{t('adminFieldName')}</label>
                            <input
                                type="text"
                                id="productName"
                                value={newProductName}
                                onChange={e => setNewProductName(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="productIngredients">
                                {t('adminFieldIngredients')}
                            </label>
                            <input
                                type="text"
                                id="productIngredients"
                                value={newProductIngredients}
                                onChange={e => setNewProductIngredients(e.target.value)}
                                required
                            />
                        </div>

                        {['күмәнді', 'таза емес'].includes(
                            newProductStatus.toLowerCase()
                        ) && (
                            <div className={styles.formGroup}>
                                <label htmlFor="productHaramIngredients">
                                    {t('adminFieldHaramIngredients')}
                                </label>
                                <input
                                    type="text"
                                    id="productHaramIngredients"
                                    value={newProductHaramIngredients}
                                    onChange={e => setNewProductHaramIngredients(e.target.value)}
                                    required
                                />
                            </div>
                        )}

                        <div className={styles.formGroup}>
                            <label htmlFor="productStatus">{t('adminFieldStatus')}</label>
                            <input
                                type="text"
                                id="productStatus"
                                value={newProductStatus}
                                onChange={e => setNewProductStatus(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="productDescriptionId">
                                {/* add key "adminFieldDescriptionId" to your JSON */}
                                {t('adminFieldDescriptionId', 'Description ID:')}
                            </label>
                            <input
                                type="text"
                                id="productDescriptionId"
                                value={newProductDescriptionId}
                                onChange={e => setNewProductDescriptionId(e.target.value)}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="productScanId">
                                {/* add key "adminFieldScanId" to your JSON */}
                                {t('adminFieldScanId', 'Scan ID:')}
                            </label>
                            <input
                                type="text"
                                id="productScanId"
                                value={newProductScanId}
                                onChange={e => setNewProductScanId(e.target.value)}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="productImage">{t('adminFieldImage')}</label>
                            <input
                                type="file"
                                id="productImage"
                                accept=".jpg,.jpeg,.png"
                                onChange={e =>
                                    e.target.files?.[0] && setNewProductImage(e.target.files[0])
                                }
                                required
                            />
                        </div>

                        <button type="submit" className={styles.saveButton}>
                            {t('adminSaveBtn')}
                        </button>
                    </form>
                </div>

                {/* Send notification form */}
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>{t('adminSendNotify')}</h2>
                    {notificationSuccess && (
                        <p className={styles.successMessage}>{notificationSuccess}</p>
                    )}
                    {notificationError && (
                        <p className={styles.errorMessage}>{notificationError}</p>
                    )}

                    <form onSubmit={handleSendNotification} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="notificationUserId">
                                {t('adminNotifyPlaceholder')}
                            </label>
                            <input
                                type="text"
                                id="notificationUserId"
                                value={notificationUserId}
                                onChange={e => setNotificationUserId(e.target.value)}
                                placeholder={t('adminNotifyPlaceholder')}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="notificationDescription">
                                {t('adminNotifyText')}
                            </label>
                            <textarea
                                id="notificationDescription"
                                className={styles.textarea}
                                value={notificationDescription}
                                onChange={e => setNotificationDescription(e.target.value)}
                                placeholder={t('adminNotifyTextPH')}
                                required
                            />
                        </div>

                        <button type="submit" className={styles.saveButton}>
                            {t('adminSendBtn')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
