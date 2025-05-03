import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import styles from './Login.module.css';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [formData, setFormData] = useState({
        name: '',
        identifier: '',
        email: '',
        phone_number: '',
        password: '',
        city: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === 'phone_number') {
            newValue = newValue.replace(/\D/g, '').slice(0, 11); // только цифры, макс 11
        }
        setFormData((prev) => ({ ...prev, [name]: newValue }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (isLogin) {
            if (!formData.identifier || !formData.password) {
                setError(t('Заполните все поля'));
                return;
            }
        } else {
            if (
                !formData.name ||
                !formData.email ||
                !formData.phone_number ||
                !formData.password
            ) {
                setError(t('Заполните все обязательные поля'));
                return;
            }
            if (formData.phone_number.length !== 11) {
                setError(t('Длина номера должна быть 11 символов'));
                return;
            }
            if (!formData.phone_number.startsWith('8')) {
                setError(t('Номер телефона должен начинаться с 8'));
                return;
            }
            if (formData.password.length < 8) {
                setError(t('Пароль должен быть минимум 8 символов'));
                return;
            }
        }

        try {
            let url;
            let dataToSend = {};

            if (isLogin) {
                url = 'https://quramdetector-k92n.onrender.com/auth/login';
                dataToSend = {
                    identifier: formData.identifier,
                    password: formData.password,
                };

                const { data } = await axios.post(url, dataToSend, {
                    headers: { 'Content-Type': 'application/json' },
                });

                const { access_token, user } = data;
                if (access_token) {
                    localStorage.setItem('token', access_token);
                    localStorage.setItem('name', user?.name || '');
                    localStorage.setItem('authority', user.authority);
                    localStorage.setItem('id', user?.id);
                    localStorage.setItem('email', user.email);
                    localStorage.setItem('phone_number', user.phone_number);
                }
                navigate('/home');
            } else {
                url = 'https://quramdetector-k92n.onrender.com/auth/register';
                dataToSend = {
                    name: formData.name,
                    email: formData.email,
                    phone_number: formData.phone_number,
                    password: formData.password,
                    city: formData.city || null,
                };

                await axios.post(url, dataToSend, {
                    headers: { 'Content-Type': 'application/json' },
                });

                setIsLogin(true);
                setFormData({ ...formData, identifier: '', password: '' });
            }
        } catch (err) {
            console.error('API error:', err);
            setError(t('errApi'));
        }
    };

    return (
        <div className={styles.loginPage}>
            <LanguageSwitcher />

            <div className={styles.heroSection}>
                <div className={styles.heroWave}></div>
                <div className={styles.heroGlow}></div>
                <h1 className={styles.heroTitle}>Quram Detector</h1>
                <p className={styles.heroSubtitle}>
                    {isLogin ? t('loginHeroLogin') : t('loginHeroRegister')}
                </p>
            </div>

            <div className={styles.formContainer}>
                <h2 className={styles.formTitle}>
                    {isLogin ? t('loginTitleLogin') : t('loginTitleRegister')}
                </h2>

                {error && <p className={styles.formError}>{error}</p>}

                <form className={styles.formBody} onSubmit={handleSubmit}>
                    {!isLogin && (
                        <input
                            type="text"
                            name="name"
                            placeholder={t('phName')}
                            value={formData.name}
                            onChange={handleChange}
                            className={styles.formInput}
                        />
                    )}

                    {isLogin ? (
                        <input
                            type="text"
                            name="identifier"
                            placeholder={t('phIdentifier')}
                            value={formData.identifier}
                            onChange={handleChange}
                            className={styles.formInput}
                        />
                    ) : (
                        <>
                            <input
                                type="email"
                                name="email"
                                placeholder={t('phEmail')}
                                value={formData.email}
                                onChange={handleChange}
                                className={styles.formInput}
                            />
                            <input
                                type="tel"
                                name="phone_number"
                                placeholder={t('phPhone')}
                                value={formData.phone_number}
                                onChange={handleChange}
                                pattern="[0-9]{11}"
                                title={t('phPhone')}
                                className={styles.formInput}
                            />
                        </>
                    )}

                    <div
                        className={`${styles.passwordContainer} ${
                            isLogin ? styles.loginPasswordContainer : ''
                        }`}
                    >
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder={t('phPassword')}
                            value={formData.password}
                            onChange={handleChange}
                            className={styles.passwordInput}
                        />
                        <button
                            type="button"
                            className={styles.togglePasswordButton}
                            onClick={() => setShowPassword((prev) => !prev)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    {!isLogin && (
                        <input
                            type="text"
                            name="city"
                            placeholder={t('phCity')}
                            value={formData.city}
                            onChange={handleChange}
                            className={styles.formInput}
                        />
                    )}

                    <button type="submit" className={styles.submitButton}>
                        {isLogin ? t('loginBtnLogin') : t('loginBtnRegister')}
                    </button>
                </form>

                <div className={styles.toggleWrapper}>
                    <button
                        type="button"
                        className={styles.toggleButton}
                        onClick={() => setIsLogin((prev) => !prev)}
                    >
                        {isLogin ? t('loginToggleNoAcc') : t('loginToggleHasAcc')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
