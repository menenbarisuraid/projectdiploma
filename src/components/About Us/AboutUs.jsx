import React from 'react';
import Header from './../Header/Header';
import styles from './AboutUs.module.css';

// Импортируем фото из папки image:
import muhaImg from './image/muha.jpg';
import ayanImg from './image/ayan.jpg';
import annurImg from './image/annur.jpg';

function AboutUs() {
    const userName = localStorage.getItem('name') || 'Guest';

    // Данные о команде:
    const teamMembers = [
        {
            name: 'Mukhtar Rabayev',
            role: 'ML Engineer',
            phone: '+7 (707) 339-37-13',
            img: muhaImg
        },
        {
            name: 'Askarov Ayan',
            role: 'Frontend React Developer',
            phone: '+7 (777) 112-97-43',
            img: ayanImg
        },
        {
            name: 'Muratov Annur',
            role: 'Backend Flask Developer',
            phone: '+7 (702) 833-11-30',
            img: annurImg
        }
    ];

    return (
        <div className={styles.aboutUsPage}>
            <Header userName={userName} />

            <div className={styles.heroSection}>
                <div className={styles.heroWave}></div>
                <h1 className={styles.heroTitle}>Quram Detector</h1>
                <p className={styles.heroSubtitle}>
                    Мы помогаем быстро и точно проверять продукты на халяль или харам
                </p>
                <div className={styles.heroGlow}></div>
            </div>

            <div className={styles.contentWrapper}>
                <div className={styles.row}>
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>О нас</h2>
                        <p className={styles.cardText}>
                            Quram Detector — это платформа, которая позволяет пользователям сфотографировать или загрузить изображение продукта, чтобы получить достоверную информацию о его соответствии нормам халяль или харам. Мы верим, что прозрачность и удобство должны быть доступны всем, поэтому мы стараемся сделать процесс проверки максимально понятным.
                        </p>
                    </div>

                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Наша миссия</h2>
                        <p className={styles.cardText}>
                            Наша цель — сделать мир чуточку проще для людей, которые придерживаются норм ислама. Мы проводим проверки состава продуктов и стараемся предоставить точную информацию, чтобы любой человек мог принимать осознанные решения.
                        </p>
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.card}>
                        <h2 className={`${styles.cardTitle} ${styles.centeredTitle}`}>Наша команда</h2>
                        <div className={styles.teamGrid}>
                            {teamMembers.map(member => (
                                <div className={styles.teamMember} key={member.name}>
                                    <img
                                        className={styles.teamPhoto}
                                        src={member.img}
                                        alt={member.name}
                                    />
                                    <h3 className={styles.teamMemberName}>{member.name}</h3>
                                    <p>{member.role}</p>
                                    <p>{member.phone}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Контакты</h2>
                        <p className={styles.cardText}>quramdetector.school@gmail.com</p>
                        <p className={styles.cardText}>г. Алматы, улица Абылай хана, 1/1</p>
                    </div>

                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Компания</h2>
                        <ul className={styles.list}>
                            <li>Check the composition of products</li>
                            <li>We wish all the best for peoples</li>
                            <li>We try to take compositions from KMDB</li>
                            <li>Be with us</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutUs;
