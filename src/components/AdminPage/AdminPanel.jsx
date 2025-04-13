import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../Header/Header';  // Adjust the import path as needed
import styles from './AdminPanel.module.css';

function AdminPanel() {
    const navigate = useNavigate();

    // Состояния для уведомлений
    const [notificationUserId, setNotificationUserId] = useState('');
    const [notificationDescription, setNotificationDescription] = useState('');
    const [notificationSuccess, setNotificationSuccess] = useState('');
    const [notificationError, setNotificationError] = useState('');

    // Данные пользователя
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Проверка токена
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        // Забираем данные пользователя из localStorage
        const storedUser = {
            id: localStorage.getItem('id') || 'N/A',
            name: localStorage.getItem('name') || 'N/A',
            authority: localStorage.getItem('authority') || 'N/A',
            email: localStorage.getItem('email') || 'N/A',
            phone_number: localStorage.getItem('phone_number') || 'N/A',
        };
        setUser(storedUser);
    }, [navigate]);

    // Отправка уведомления
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
                news_description: notificationDescription,
            };

            const response = await axios.post(
                'https://quramdetector-3uaf.onrender.com/notifications/send',
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setNotificationSuccess(response.data.message || 'Уведомление отправлено!');
            setNotificationUserId('');
            setNotificationDescription('');
        } catch (error) {
            console.error('Ошибка при отправке уведомления:', error);
            setNotificationError(
                error.response?.data?.message || 'Произошла ошибка при отправке уведомления'
            );
        }
    };

    // Обработчик клика по кнопке "Edit all scans"
    const handleEditAllScansClick = () => {
        navigate('/editallscans');
    };

    return (
        <div className={styles.adminPanel}>
            {/* Добавляем адаптивный компонент Header */}
            <Header />

            {/* HERO SECTION */}
            <div className={styles.heroSection}>
                <div className={styles.heroWave}></div>
                <div className={styles.heroGlow}></div>
                <h1 className={styles.heroTitle}>Admin Panel</h1>
                <p className={styles.heroSubtitle}>Manage scanned products and more</p>
            </div>

            {/* Единственный оранжевый блок "Edit all scans" */}
            <div className={styles.profileBlock} onClick={handleEditAllScansClick}>
                <p className={styles.profileText}>Edit all scans</p>
            </div>

            {/* Контейнер для двух карточек: "Profile Information" и "Отправить уведомление" */}
            <div className={styles.bottomContainer}>
                {/* Карточка "Profile Information" */}
                <div className={styles.cardBlock}>
                    <h2 className={styles.blockTitle}>Profile Information</h2>
                    {user ? (
                        <div className={styles.userInfo}>
                            <p><strong>ID:</strong> {user.id}</p>
                            <p><strong>Name:</strong> {user.name}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Phone Number:</strong> {user.phone_number}</p>
                            <p><strong>Authority:</strong> {user.authority}</p>
                        </div>
                    ) : (
                        <p>Loading user info...</p>
                    )}
                </div>

                {/* Карточка "Отправить уведомление" */}
                <div className={styles.cardBlock}>
                    <h2 className={styles.blockTitle}>Отправить уведомление</h2>
                    {notificationSuccess && (
                        <p className={styles.successMessage}>{notificationSuccess}</p>
                    )}
                    {notificationError && (
                        <p className={styles.errorMessage}>{notificationError}</p>
                    )}
                    <form onSubmit={handleSendNotification} className={styles.notificationForm}>
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
                            <label htmlFor="notificationDescription">Текст уведомления</label>
                            <textarea
                                id="notificationDescription"
                                value={notificationDescription}
                                onChange={(e) => setNotificationDescription(e.target.value)}
                                placeholder="Введите описание уведомления..."
                                required
                            />
                        </div>
                        <button type="submit" className={styles.sendButton}>
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AdminPanel;
