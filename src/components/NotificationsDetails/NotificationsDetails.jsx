import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './NotificationsDetails.module.css';
import Footer from "../Footer/Footer";

function NotificationsDetails() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        const fetchNotifications = async () => {
            setLoading(true);
            setError('');
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get('https://quramdetector-k92n.onrender.com/notifications/', config);
                setNotifications(res.data.data.notifications || []);
            } catch (err) {
                console.error('Ошибка при загрузке уведомлений:', err);
                setError('Ошибка при загрузке данных. Попробуйте позже.');
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, [navigate]);

    return (
        <div className={styles.notificationsPage}>
            <div className={styles.heroSection}>
                <div className={styles.heroWave}></div>
                <h1 className={styles.heroTitle}>Notifications Details</h1>
                <p className={styles.heroSubtitle}>Stay updated with the latest news</p>
                <div className={styles.heroGlow}></div>
            </div>
            <div className={styles.contentWrapper}>
                {error && <div className={styles.error}>{error}</div>}
                {loading ? (
                    <p className={styles.loadingText}>Loading...</p>
                ) : (
                    <div className={styles.notificationsList}>
                        {notifications.length > 0 ? (
                            notifications.map((note, index) => (
                                <div key={index} className={styles.notificationCard}>
                                    <p className={styles.notificationText}>
                                        {note.news_description || `Notification #${index + 1}`}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className={styles.noData}>No notifications.</p>
                        )}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default NotificationsDetails;
