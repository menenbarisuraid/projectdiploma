import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Welcome.module.css';
import myImage from './image/logo.jpg';

const Welcome = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.welcomePage}>
            <div className={styles.phoneMockup}>
                <div className={styles.topSection}>
                    <div className={styles.imageWrapper}>
                        <img
                            src={myImage}
                            alt="Логотип Quram Detector"
                            className={styles.image}
                        />
                    </div>
                </div>

                <div className={styles.bottomSection}>
                    <h1 className={styles.welcomeTitle}>Quram Detector</h1>
                    <p className={styles.welcomeSubtitle}>
                        Scan product compositions for halal/haram verification
                    </p>
                    <button
                        className={styles.welcomeButton}
                        onClick={() => navigate('/login')}
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
