// src/components/AdminPanel/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import Header from '../Header/Header';
import styles from './AdminPanel.module.css';

export default function AdminPanel() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [notificationUserId, setNotificationUserId] = useState('');
    const [notificationDescription, setNotificationDescription] = useState('');
    const [notificationSuccess, setNotificationSuccess] = useState('');
    const [notificationError, setNotificationError] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        setUser({
            id:           localStorage.getItem('id')           || 'N/A',
            name:         localStorage.getItem('name')         || 'N/A',
            authority:    localStorage.getItem('authority')    || 'N/A',
            email:        localStorage.getItem('email')        || 'N/A',
            phone_number: localStorage.getItem('phone_number') || 'N/A',
        });
    }, [navigate]);

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
                user_id:          notificationUserId.trim() === '' ? null : notificationUserId,
                news_description: notificationDescription,
            };
            const { data } = await axios.post(
                'https://quramdetector-k92n.onrender.com/notifications/send',
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNotificationSuccess(data.message || t('adminNotificationSuccess'));
            setNotificationUserId('');
            setNotificationDescription('');
        } catch (err) {
            console.error('Ошибка при отправке уведомления:', err);
            setNotificationError(
                err.response?.data?.message || t('adminNotificationError')
            );
        }
    };

    const handleEditAllScansClick = () => navigate('/editallscans');

    return (
        <div className={styles.adminPanel}>
            <Header />

            <div className={styles.heroSection}>
                <LanguageSwitcher />
                <div className={styles.heroWave} />
                <div className={styles.heroGlow} />
                <h1 className={styles.heroTitle}>{t('adminHeroTitle')}</h1>
                <p className={styles.heroSubtitle}>{t('adminHeroSubtitle')}</p>
            </div>

            <div
                className={styles.profileBlock}
                onClick={handleEditAllScansClick}
            >
                <p className={styles.profileText}>{t('adminEditAllScans')}</p>
            </div>

            <div className={styles.bottomContainer}>
                <div className={styles.cardBlock}>
                    <h2 className={styles.blockTitle}>{t('adminProfileInfoTitle')}</h2>
                    {user ? (
                        <div className={styles.userInfo}>
                            <p>
                                <strong>{t('adminProfileLabelID')}:</strong> {user.id}
                            </p>
                            <p>
                                <strong>{t('adminProfileLabelName')}:</strong> {user.name}
                            </p>
                            <p>
                                <strong>{t('adminProfileLabelEmail')}:</strong> {user.email}
                            </p>
                            <p>
                                <strong>{t('adminProfileLabelPhone')}:</strong> {user.phone_number}
                            </p>
                            <p>
                                <strong>{t('adminProfileLabelRole')}:</strong> {user.authority}
                            </p>
                        </div>
                    ) : (
                        <p>{t('adminProfileLoading')}</p>
                    )}
                </div>

                <div className={styles.cardBlock}>
                    <h2 className={styles.blockTitle}>{t('adminNotificationTitle')}</h2>
                    {notificationSuccess && (
                        <p className={styles.successMessage}>
                            {notificationSuccess}
                        </p>
                    )}
                    {notificationError && (
                        <p className={styles.errorMessage}>
                            {notificationError}
                        </p>
                    )}
                    <form
                        onSubmit={handleSendNotification}
                        className={styles.notificationForm}
                    >
                        <div className={styles.formGroup}>
                            <label htmlFor="notificationUserId">
                                {t('adminNotificationUserIdLabel')}
                            </label>
                            <input
                                type="text"
                                id="notificationUserId"
                                value={notificationUserId}
                                onChange={(e) => setNotificationUserId(e.target.value)}
                                placeholder={t('adminNotificationUserIdPlaceholder')}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="notificationDescription">
                                {t('adminNotificationTextLabel')}
                            </label>
                            <textarea
                                id="notificationDescription"
                                value={notificationDescription}
                                onChange={(e) => setNotificationDescription(e.target.value)}
                                placeholder={t('adminNotificationTextPlaceholder')}
                                required
                            />
                        </div>
                        <button type="submit" className={styles.sendButton}>
                            {t('adminNotificationSendButton')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
