import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './AdminPageDetails.module.css';

function AdminPageDetails() {
    const { scan_id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const [newProductName, setNewProductName] = useState('');
    const [newProductImage, setNewProductImage] = useState(null);
    const [newProductIngredients, setNewProductIngredients] = useState('');
    const [newProductHaramIngredients, setNewProductHaramIngredients] = useState('');
    const [newProductStatus, setNewProductStatus] = useState('');

    // Новые поля
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
            .get(`https://quramdetector-3uaf.onrender.com/admin/get-scan/${scan_id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                setProduct(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Ошибка при получении деталей скана:', error);
                setLoading(false);
            });
    }, [scan_id, navigate]);

    useEffect(() => {
        if (product) {
            setNewProductIngredients(product.ingredients || '');
            setNewProductStatus(product.status || '');
            if (
                product.status &&
                (product.status.toLowerCase() === 'suspect' || product.status.toLowerCase() === 'haram')
            ) {
                setNewProductHaramIngredients(product.haram_ingredients || '');
            }
        }
    }, [product]);

    const handleSaveProduct = async (e) => {
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

            if (
                newProductStatus.toLowerCase() === 'suspect' ||
                newProductStatus.toLowerCase() === 'haram'
            ) {
                formData.append('haram_ingredients', newProductHaramIngredients);
            }

            // Новые поля
            formData.append('description_id', newProductDescriptionId);
            formData.append('scan_id', newProductScanId);

            if (newProductImage) {
                formData.append('file', newProductImage);
            }

            const response = await axios.post(
                'https://quramdetector-3uaf.onrender.com/update_product',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSaveMessage(response.data.message || 'Продукт успешно сохранён!');
            setNewProductName('');
            setNewProductIngredients('');
            setNewProductStatus('');
            setNewProductHaramIngredients('');
            setNewProductImage(null);
            setNewProductDescriptionId('');
            setNewProductScanId('');
        } catch (error) {
            console.error('Ошибка при сохранении продукта:', error);
            setErrorMessage(
                error.response?.data?.message ||
                'Произошла ошибка при сохранении продукта'
            );
        }
    };

    const handleSendNotification = async (e) => {
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

            const response = await axios.post(
                'https://quramdetector-3uaf.onrender.com/notifications/send',
                payload,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setNotificationSuccess(response.data.message || 'Уведомление отправлено!');
            setNotificationUserId('');
            setNotificationDescription('');
        } catch (error) {
            console.error('Ошибка при отправке уведомления:', error);
            setNotificationError(
                error.response?.data?.message ||
                'Произошла ошибка при отправке уведомления'
            );
        }
    };

    if (loading) {
        return (
            <div className={styles.adminPageDetails}>
                <div className={styles.heroSection}>
                    <h1 className={styles.heroTitle}>Admin Product Details</h1>
                    <p className={styles.heroSubtitle}>Loading data, please wait...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className={styles.adminPageDetails}>
                <div className={styles.heroSection}>
                    <h1 className={styles.heroTitle}>Admin Product Details</h1>
                    <p className={styles.heroSubtitle}>No data found</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.adminPageDetails}>
            <div className={styles.heroSection}>
                <div className={styles.heroWave}></div>
                <div className={styles.heroGlow}></div>
                <h1 className={styles.heroTitle}>Admin Product Details</h1>
                <p className={styles.heroSubtitle}>Manage or add new products</p>
            </div>

            <div className={styles.contentContainer}>
                {/* Блок с подробностями скана */}
                <div className={`${styles.card} ${product.is_processed ? styles.processed : ''}`}>
                    <h2 className={styles.cardTitle}>Scan Details</h2>
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
                                <strong>Product Name:</strong> {product.product_name}
                            </p>
                            <p className={styles.productLabel}>
                                <strong>Status:</strong> {product.status}
                            </p>
                            <p className={styles.productLabel}>
                                <strong>Ingredients:</strong> {product.ingredients}
                            </p>
                            {/* Показываем scan_id (если он у продукта есть) */}
                            <p className={styles.productLabel}>
                                <strong>Scan ID:</strong> {product.scan_id || 'Нет данных'}
                            </p>
                            <p className={styles.productLabel}>
                                <strong>User ID:</strong> {userIdFromStorage || 'Не определён'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Блок с формой для добавления нового продукта */}
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>Добавить новый продукт</h2>
                    {saveMessage && <p className={styles.successMessage}>{saveMessage}</p>}
                    {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

                    <form onSubmit={handleSaveProduct} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="productName">Product Name:</label>
                            <input
                                type="text"
                                id="productName"
                                value={newProductName}
                                onChange={(e) => setNewProductName(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="productIngredients">Ingredients:</label>
                            <input
                                type="text"
                                id="productIngredients"
                                value={newProductIngredients}
                                onChange={(e) => setNewProductIngredients(e.target.value)}
                                required
                            />
                        </div>

                        {(newProductStatus.toLowerCase() === 'suspect' ||
                            newProductStatus.toLowerCase() === 'haram') && (
                            <div className={styles.formGroup}>
                                <label htmlFor="productHaramIngredients">Haram Ingredients:</label>
                                <input
                                    type="text"
                                    id="productHaramIngredients"
                                    value={newProductHaramIngredients}
                                    onChange={(e) => setNewProductHaramIngredients(e.target.value)}
                                    required
                                />
                            </div>
                        )}

                        <div className={styles.formGroup}>
                            <label htmlFor="productStatus">Status:</label>
                            <input
                                type="text"
                                id="productStatus"
                                value={newProductStatus}
                                onChange={(e) => setNewProductStatus(e.target.value)}
                                required
                            />
                        </div>

                        {/* Новые поля */}
                        <div className={styles.formGroup}>
                            <label htmlFor="productDescriptionId">Description ID:</label>
                            <input
                                type="text"
                                id="productDescriptionId"
                                value={newProductDescriptionId}
                                onChange={(e) => setNewProductDescriptionId(e.target.value)}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="productScanId">Scan ID:</label>
                            <input
                                type="text"
                                id="productScanId"
                                value={newProductScanId}
                                onChange={(e) => setNewProductScanId(e.target.value)}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="productImage">Product Image (JPG, JPEG, PNG):</label>
                            <input
                                type="file"
                                id="productImage"
                                accept=".jpg, .jpeg, .png"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setNewProductImage(e.target.files[0]);
                                    }
                                }}
                                required
                            />
                        </div>

                        <button type="submit" className={styles.saveButton}>
                            Save
                        </button>
                    </form>
                </div>

                {/* Блок с отправкой уведомления */}
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>Отправить уведомление</h2>
                    {notificationSuccess && (
                        <p className={styles.successMessage}>{notificationSuccess}</p>
                    )}
                    {notificationError && (
                        <p className={styles.errorMessage}>{notificationError}</p>
                    )}

                    <form onSubmit={handleSendNotification} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="notificationUserId">
                                ID пользователя (необязательно)
                            </label>
                            <input
                                type="text"
                                id="notificationUserId"
                                value={notificationUserId}
                                onChange={(e) => setNotificationUserId(e.target.value)}
                                placeholder="Оставьте пустым для уведомления всем"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="notificationDescription">
                                Текст уведомления
                            </label>
                            <textarea
                                id="notificationDescription"
                                value={notificationDescription}
                                onChange={(e) => setNotificationDescription(e.target.value)}
                                placeholder="Введите описание уведомления..."
                                required
                                className={styles.textarea}
                            />
                        </div>

                        <button type="submit" className={styles.saveButton}>
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AdminPageDetails;
