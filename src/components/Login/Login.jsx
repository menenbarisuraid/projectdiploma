import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import styles from './Login.module.css'; // Используем CSS Modules

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        identifier: '',
        email: '',
        phone_number: '',
        password: '',
        city: ''
    });

    const [error, setError] = useState(null);

    const handleChange = e => {
        const { name, value } = e.target;
        let newValue = value;
        // Если поле - номер телефона, оставляем только цифры и ограничиваем до 11 символов
        if (name === 'phone_number') {
            newValue = newValue.replace(/\D/g, ''); // удаляем все нецифровые символы
            if (newValue.length > 11) {
                newValue = newValue.slice(0, 11);
            }
        }
        setFormData(prev => ({ ...prev, [name]: newValue }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError(null);

        if (isLogin) {
            if (!formData.identifier || !formData.password) {
                setError('Введите email или номер телефона и пароль для входа');
                return;
            }
        } else {
            if (!formData.name || !formData.email || !formData.phone_number || !formData.password) {
                setError('Для регистрации обязательно укажите имя, email, номер телефона и пароль');
                return;
            }
            // Проверка: номер телефона должен содержать ровно 11 цифр
            if (formData.phone_number.length !== 11) {
                setError('Номер телефона должен содержать ровно 11 цифр.');
                return;
            }
            // Проверка: номер телефона должен начинаться с цифры 8
            if (!formData.phone_number.startsWith('8')) {
                setError('Номер телефона должен начинаться с цифры 8.');
                return;
            }
            // Проверка: пароль должен быть минимум 8 символов
            if (formData.password.length < 8) {
                setError('Пароль должен содержать минимум 8 символов.');
                return;
            }
        }

        try {
            let url;
            let dataToSend = {};

            if (isLogin) {
                url = 'https://quramdetector-3uaf.onrender.com/auth/login';
                dataToSend = {
                    identifier: formData.identifier,
                    password: formData.password
                };

                const response = await axios.post(url, dataToSend, {
                    headers: { 'Content-Type': 'application/json' }
                });

                const { access_token, user } = response.data;
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
                url = 'https://quramdetector-3uaf.onrender.com/auth/register';
                dataToSend = {
                    name: formData.name,
                    email: formData.email,
                    phone_number: formData.phone_number,
                    password: formData.password,
                    city: formData.city || null
                };

                await axios.post(url, dataToSend, {
                    headers: { 'Content-Type': 'application/json' }
                });

                // После успешной регистрации переключаемся на форму логина
                setIsLogin(true);
                setFormData({
                    ...formData,
                    identifier: '',
                    password: ''
                });
            }
        } catch (err) {
            console.error('Ошибка:', err);
            setError('Ошибка при отправке данных. Проверьте правильность введённых данных.');
        }
    };

    return (
        <div className={styles.loginPage}>
            <div className={styles.heroSection}>
                <div className={styles.heroWave}></div>
                <div className={styles.heroGlow}></div>
                <h1 className={styles.heroTitle}>Quram Detector</h1>
                <p className={styles.heroSubtitle}>
                    {isLogin ? 'Sign In to Continue' : 'Create Your Account'}
                </p>
            </div>

            <div className={styles.formContainer}>
                <h2 className={styles.formTitle}>
                    {isLogin ? 'Вход' : 'Регистрация'}
                </h2>

                {error && <p className={styles.formError}>{error}</p>}

                <form className={styles.formBody} onSubmit={handleSubmit}>
                    {!isLogin && (
                        <input
                            type="text"
                            name="name"
                            placeholder="Имя"
                            value={formData.name}
                            onChange={handleChange}
                            className={styles.formInput}
                        />
                    )}
                    {isLogin ? (
                        <input
                            type="text"
                            name="identifier"
                            placeholder="Email или номер телефона"
                            value={formData.identifier}
                            onChange={handleChange}
                            className={styles.formInput}
                        />
                    ) : (
                        <>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                className={styles.formInput}
                            />
                            <input
                                type="tel"
                                name="phone_number"
                                placeholder="Номер телефона"
                                value={formData.phone_number}
                                onChange={handleChange}
                                pattern="[0-9]{11}"
                                title="Номер телефона должен содержать 11 цифр и начинаться с цифры 8"
                                className={styles.formInput}
                            />
                        </>
                    )}

                    {/* Поле для пароля со встроенной иконкой.
                        Если это форма логина, добавляем дополнительный класс для уменьшения высоты */}
                    <div className={`${styles.passwordContainer} ${isLogin ? styles.loginPasswordContainer : ''}`}>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Пароль"
                            value={formData.password}
                            onChange={handleChange}
                            className={styles.passwordInput}
                        />
                        <button
                            type="button"
                            className={styles.togglePasswordButton}
                            onClick={() => setShowPassword(prev => !prev)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    {!isLogin && (
                        <input
                            type="text"
                            name="city"
                            placeholder="Город (необязательно)"
                            value={formData.city}
                            onChange={handleChange}
                            className={styles.formInput}
                        />
                    )}

                    <button type="submit" className={styles.submitButton}>
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </form>

                <div className={styles.toggleWrapper}>
                    <button
                        type="button"
                        className={styles.toggleButton}
                        onClick={() => setIsLogin(prev => !prev)}
                    >
                        {isLogin
                            ? 'Нет аккаунта? Зарегистрируйтесь'
                            : 'Уже есть аккаунт? Войти'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
