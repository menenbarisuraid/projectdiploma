import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Footer.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebook, faVk, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
    const navigate = useNavigate();

    return (
        <footer className={styles.footer}>
            <div className={styles.footerBrand}>
                <h2 onClick={() => navigate('/aboutus')} className={styles.brandTitle}>
                    Quram Detector
                </h2>
            </div>
            <div className={styles.footerColumns}>
                <div className={styles.footerColumn}>
                    <h3 className={styles.columnTitle}>Про нас</h3>
                    <p>
                        Мы команда из трёх разработчиков, хотим помочь людям проверять составы
                        продуктов на халяль или харам.
                    </p>
                    <p>quramdetector.school@gmail.com</p>
                    <p>г. Алматы, улица Абылай хана, 1/1</p>
                </div>
                <div className={styles.footerColumn}>
                    <h3 className={styles.columnTitle}>Контакты</h3>
                    <ul>
                        <li>Mukhtar Rabayev: +7 (707) 339-37-13</li>
                        <li>ML Engineer</li>
                        <li>Askarov Ayan: +7 (777) 112-97-43</li>
                        <li>Frontend React Developer</li>
                        <li>Muratov Annur: +7 (702) 833-11-30</li>
                        <li>Backend Flask Developer</li>
                    </ul>
                </div>
                <div className={styles.footerColumn}>
                    <h3 className={styles.columnTitle}>Компания</h3>
                    <ul>
                        <li>Quram Detector</li>
                        <li>Проверьте состав продуктов</li>
                        <li>Мы желаем всего самого наилучшего людям</li>
                        <li>Мы стараемся брать композиции с КМДБ</li>
                        <li>Будьте с нами</li>
                    </ul>
                </div>
                <div className={styles.footerColumn}>
                    <h3 className={styles.columnTitle}>Мы в соц. сетях</h3>
                    <div className={styles.footerSocial}>
                        <button className={styles.socialLink}>
                            <FontAwesomeIcon icon={faInstagram} /> quramdetector.school@gmail.com
                        </button>
                        <button className={styles.socialLink}>
                            <FontAwesomeIcon icon={faFacebook} /> quramdetector.school@gmail.com
                        </button>
                        <button className={styles.socialLink}>
                            <FontAwesomeIcon icon={faVk} /> quramdetector.school@gmail.com
                        </button>
                        <button className={styles.socialLink}>
                            <FontAwesomeIcon icon={faWhatsapp} /> quramdetector.school@gmail.com
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
