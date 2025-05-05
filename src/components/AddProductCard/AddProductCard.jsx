import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import styles from './AddProductCard.module.css';   // стили скопируем ниже

export default function AddProductsCard() {
    const navigate       = useNavigate();
    const { t }          = useTranslation();
    const userAuthority  = localStorage.getItem('authority');   // 'admin' | 'user'

    // Показываем карточку только админам
    if (userAuthority !== 'admin') return null;

    return (
        <div className={styles.addProductsCard}>
            <div className={styles.addProductsUser}>
                <span className={styles.userIcon}>👤</span>
                <span className={styles.addProductsText}>{t('scanAdminAdd')}</span>
            </div>

            <span
                className={styles.settingsIcon}
                onClick={() => navigate('/admin-panel')}
                title="Admin settings"
            >
        {/* та же SVG-шестерёнка */}
                <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2.5em" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 4a4 4 0 1 0 0 8A4 4 0 0 0 8 4zM.93 4.712l.864-1.5a.5.5 0 0 1 .67-.223l.909.455a5.522 5.522 0 0 1 .531-.307l.155-.935A.5.5 0 0 1 4.5 2h1a.5.5 0 0 1 .5.424l.154.935c.184.097.36.2.531.307l.91-.455a.5.5 0 0 1 .67.223l.864 1.5a.5.5 0 0 1-.038.53l-.606.79c.058.203.106.407.145.615l.91.21a.5.5 0 0 1 .39.497v1a.5.5 0 0 1-.39.497l-.909.21a5.68 5.68 0 0 1-.145.615l.605.79a.5.5 0 0 1 .039.53l-.865 1.5a.5.5 0 0 1-.67.223l-.91-.455a5.522 5.522 0 0 1-.53.307l-.155.935a.5.5 0 0 1-.5.424h-1a.5.5 0 0 1-.5-.424l-.154-.935a5.68 5.68 0 0 1-.531-.307l-.909.455a.5.5 0 0 1-.67-.223l-.864-1.5a.5.5 0 0 1 .038-.53l.606-.79a5.68 5.68 0 0 1-.145-.615l-.91-.21a.5.5 0 0 1-.39-.497v-1a.5.5 0 0 1 .39-.497l.91-.21c.039-.208.087-.412.145-.615l-.606-.79a.5.5 0 0 1-.038-.53z" />
        </svg>
      </span>
        </div>
    );
}
