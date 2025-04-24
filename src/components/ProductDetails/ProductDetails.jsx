// src/components/ProductDetails/ProductDetails.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import styles from './ProductDetails.module.css';

export default function ProductDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const { product } = location.state || {};

    const [serverProduct, setServerProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [comment, setComment] = useState('');
    const [stars, setStars] = useState(0);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [error, setError] = useState('');

    const fetchProductData = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        if (!product || !product.id) { navigate('/products'); return; }

        setLoadingReviews(true);
        setError('');
        try {
            const { data } = await axios.get(
                `https://quramdetector-3uaf.onrender.com/product/${product.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setServerProduct(data.data);
            setReviews(data.data.reviews || []);
        } catch {
            setError(t('productErrorLoadReviews'));
        } finally {
            setLoadingReviews(false);
        }
    }, [navigate, product, t]);

    useEffect(() => { fetchProductData(); }, [fetchProductData]);

    const handleCommentSubmit = async e => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        if (stars === 0) { setError(t('productSelectStars')); return; }
        try {
            const { data } = await axios.post(
                'https://quramdetector-3uaf.onrender.com/reviews',
                {
                    product_id: product.id,
                    review_description: comment.trim(),
                    stars
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (data?.data) setReviews(prev => [...prev, data.data]);
            setComment('');
            setStars(0);
        } catch {
            setError(t('productErrorSendReview'));
        }
    };

    const displayName   = serverProduct?.name   || product?.name   || 'No Name';
    const displayImage  = serverProduct?.image  || product?.image  || '';
    const displayStatus = serverProduct?.status || product?.status || '';

    const getStatusClass = s => {
        const l = s?.toLowerCase();
        if (!l) return '';
        if (['таза','halal','халал'].includes(l)) return styles.halal;
        if (['таза емес','haram','харам'].includes(l)) return styles.haram;
        if (['күмәнді','suspect','подозрительно'].includes(l)) return styles.suspicious;
        return '';
    };

    const isSuspicious = displayStatus.toLowerCase() === 'күмәнді';

    const highlightClass = isSuspicious ? styles.suspiciousHighlight : styles.haramHighlight;
    const ingredientsLabel = isSuspicious ? t('productSuspiciousIngredients') : t('productHaramIngredients');

    return (
        <div className={styles.productDetailsPage}>

            <div className={styles.heroSection}>
                <LanguageSwitcher />
                <div className={styles.heroContent}>
                    <div className={styles.heroImageContainer}>
                        {displayImage ? (
                            <img src={displayImage} alt={displayName} className={styles.heroImage} />
                        ) : (
                            <p className={styles.noImage}>{t('productNoImage')}</p>
                        )}
                    </div>
                    <h2 className={styles.heroTitle}>{displayName}</h2>
                    {displayStatus && (
                        <p className={`${styles.productStatus} ${getStatusClass(displayStatus)}`}>{displayStatus}</p>
                    )}
                </div>
                <div className={styles.heroWave} />
                <div className={styles.heroGlow} />
            </div>

            <div className={styles.contentWrapper}>
                {serverProduct?.ingredients && (
                    <>
                        <h3 className={styles.reviewHeader}>{t('productIngredientsTitle')}</h3>
                        <div className={styles.ingredientsBlock}>
                            <p className={styles.ingredientsText}>{serverProduct.ingredients}</p>
                            {(displayStatus.toLowerCase() === 'таза емес' || isSuspicious) && serverProduct.haram_ingredients && (
                                <p className={highlightClass}>
                                    {ingredientsLabel} {serverProduct.haram_ingredients}
                                </p>
                            )}
                        </div>
                    </>
                )}

                <h3 className={styles.reviewHeader}>{t('productReviewsTitle')}</h3>

                {loadingReviews ? (
                    <p>{t('productReviewsLoading')}</p>
                ) : error ? (
                    <p className={styles.errorText}>{error}</p>
                ) : reviews.length > 0 ? (
                    <ul className={styles.reviewsList}>
                        {reviews.map((r, idx) => (
                            <li key={idx} className={styles.reviewItem}>
                                <div className={styles.reviewContent}>
                                    <div className={styles.leftSide}>
                                        <p className={styles.userName}>{r.user_name || `User ${r.user_id}`}</p>
                                        <p className={styles.commentText}>{r.review_description || t('productNoComment')}</p>
                                    </div>
                                    <div className={styles.rightSide}>
                                        <div className={styles.starsDisplay}>
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <span key={i} className={i < r.stars ? styles.redStar : styles.greyStar}>★</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>{t('productNoReviews')}</p>
                )}

                <form onSubmit={handleCommentSubmit} className={styles.reviewForm}>
                    <label className={styles.starsLabel}>{t('productRatePrompt')}</label>
                    <div className={styles.starsInput}>
                        {[1,2,3,4,5].map(s => (
                            <span key={s} className={s<=stars?styles.selectedStar:styles.unselectedStar} onClick={()=>setStars(s)}>★</span>
                        ))}
                    </div>
                    <textarea
                        value={comment}
                        onChange={e=>setComment(e.target.value)}
                        placeholder={t('productCommentPlaceholder')}
                        className={styles.commentInput}
                    />
                    <button type="submit" className={styles.sendButton}>{t('productSendButton')}</button>
                </form>
            </div>
        </div>
    );
}
