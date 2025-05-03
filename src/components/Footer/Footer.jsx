import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Footer.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebook, faVk, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useTranslation } from 'react-i18next';

export default function Footer() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <footer className={styles.footer}>
            <div className={styles.footerBrand}>
                <h2 onClick={() => navigate('/aboutus')} className={styles.brandTitle}>
                    Quram Detector
                </h2>
            </div>
            <div className={styles.footerColumns}>
                <div className={styles.footerColumn}>
                    <h3 className={styles.columnTitle}>{t('footer.about')}</h3>
                    <p>{t('footer.description')}</p>
                    <p>quramdetector.school@gmail.com</p>
                    <p>{t('footer.address')}</p>
                </div>
                <div className={styles.footerColumn}>
                    <h3 className={styles.columnTitle}>{t('footer.contacts')}</h3>
                    <ul>
                        <li>{t('footer.mukhtar')}</li>
                        <li>{t('footer.mukhtarRole')}</li>
                        <li>{t('footer.ayan')}</li>
                        <li>{t('footer.ayanRole')}</li>
                        <li>{t('footer.anur')}</li>
                        <li>{t('footer.anurRole')}</li>
                    </ul>
                </div>
                <div className={styles.footerColumn}>
                    <h3 className={styles.columnTitle}>{t('footer.company')}</h3>
                    <ul>
                        <li>{t('footer.companyName')}</li>
                        <li>{t('footer.check')}</li>
                        <li>{t('footer.wish')}</li>
                        <li>{t('footer.kmdb')}</li>
                        <li>{t('footer.withUs')}</li>
                    </ul>
                </div>
                <div className={styles.footerColumn}>
                    <h3 className={styles.columnTitle}>{t('footer.socials')}</h3>
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
