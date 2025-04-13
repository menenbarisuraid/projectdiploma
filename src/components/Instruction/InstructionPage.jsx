import React from 'react';
import Header from './../Header/Header';
import styles from './InstructionPage.module.css';

function InstructionPage() {
    const userName = localStorage.getItem('name') || 'Guest';
    return (
        <div className={styles.instructionPage}>
            <Header userName={userName} />
            <div className={styles.heroSection}>
                <div className={styles.heroWave}></div>
                <h1 className={styles.heroTitle}>Как пользоваться Quram Detector</h1>
                <p className={styles.heroSubtitle}>
                    Узнайте, как легко проверить продукты на халяль или харам
                </p>
                <div className={styles.heroGlow}></div>
            </div>
            <div className={styles.contentWrapper}>
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>Шаг 1: Авторизация</h2>
                    <p className={styles.cardText}>
                        Чтобы получить доступ ко всем функциям Quram Detector, сначала авторизуйтесь на сайте.
                    </p>
                    <button className={styles.cardButton}>Перейти к авторизации</button>
                </div>
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>Шаг 2: Проверка продукта</h2>
                    <p className={styles.cardText}>
                        Вы можете загрузить фото продукта или сделать снимок, чтобы узнать, является ли продукт халяль или харам.
                    </p>
                </div>
                <div className={styles.cardFull}>
                    <h2 className={styles.cardTitle}>Шаг 3: Оставление комментариев</h2>
                    <p className={styles.cardText}>
                        После проверки продукта вы можете перейти на страницу «Детали» и оставить свои отзывы или комментарии.
                    </p>
                </div>
                <div className={styles.cardFull}>
                    <h2 className={styles.cardTitle}>Мини Видео Инструкция</h2>
                    <div className={styles.videoPlaceholder}>
                        Здесь будет мини видео инструкция
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InstructionPage;
