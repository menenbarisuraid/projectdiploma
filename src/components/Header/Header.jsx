import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCamera, FaHome, FaInfoCircle, FaBookOpen, FaProductHunt } from 'react-icons/fa';
import styles from './Header.module.css';

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const userName = localStorage.getItem('name') || 'Гость';

    return (
        <header className={styles.header}>
            <div className={styles.navContainer}>
                <span
                    className={`${styles.navLink} ${location.pathname === '/home' ? styles.activeNavLink : ''}`}
                    onClick={() => navigate('/home')}
                    title="Home"
                >
                    <FaHome className={styles.icon} />
                </span>

                <span className={styles.separator}>|</span>

                <span
                    className={`${styles.navLink} ${location.pathname === '/aboutus' ? styles.activeNavLink : ''}`}
                    onClick={() => navigate('/aboutus')}
                    title="About Us"
                >
                    <FaInfoCircle className={styles.icon} />
                </span>

                <span className={styles.separator}>|</span>

                <span
                    className={`${styles.navLink} ${location.pathname === '/instruction' ? styles.activeNavLink : ''}`}
                    onClick={() => navigate('/instruction')}
                    title="Instruction"
                >
                    <FaBookOpen className={styles.icon} />
                </span>

                <span className={styles.separator}>|</span>

                <span
                    className={`${styles.navLink} ${location.pathname === '/allproductsdetails' ? styles.activeNavLink : ''}`}
                    onClick={() => navigate('/allproductsdetails')}
                    title="Product"
                >
                    <FaProductHunt className={styles.icon} />
                </span>

                <span className={styles.separator}>|</span>

                <span
                    className={`${styles.userName} ${location.pathname === '/profilepage' ? styles.activeNavLink : ''}`}
                    onClick={() => navigate('/profilepage')}
                >
                    {userName}
                </span>

                <span className={styles.separator}>|</span>

                <button
                    className={`${styles.cameraButton} ${location.pathname === '/scanpage' ? styles.activeNavLink : ''}`}
                    onClick={() => navigate('/scanpage')}
                    title="Scan"
                >
                    <FaCamera className={styles.icon} />
                </button>
            </div>
        </header>
    );
}
