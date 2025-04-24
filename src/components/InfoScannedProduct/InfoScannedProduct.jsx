// src/components/InfoScannedProduct/InfoScannedProduct.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import styles from './InfoScannedProduct.module.css';

export default function InfoScannedProduct() {
    const { scan_id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [serverProduct, setServerProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [reviews, setReviews] = useState([]);
    const [comment, setComment] = useState('');
    const [stars, setStars] = useState(0);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [reviewsError, setReviewsError] = useState('');

    const fetchReviews = useCallback(() => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }

        setLoadingReviews(true);
        axios
            .get(`https://quramdetector-3uaf.onrender.com/scans/${scan_id}/reviews`,
                { headers: { Authorization: `Bearer ${token}` } })
            .then(res => { setReviews(res.data || []); setLoadingReviews(false); })
            .catch(() => {
                setReviewsError(t('scanInfoReviewsError'));
                setLoadingReviews(false);
            });
    }, [scan_id, navigate, t]);

    // Product
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        if (!scan_id) { setError(t('scanInfoNoId')); setLoading(false); return; }

        setLoading(true);
        axios
            .get(`https://quramdetector-3uaf.onrender.com/admin/get-scan/${scan_id}`,
                { headers: { Authorization: `Bearer ${token}` } })
            .then(res => { setServerProduct(res.data); setLoading(false); })
            .catch(() => { setError(t('scanInfoProductError')); setLoading(false); });
    }, [scan_id, navigate, t]);

    useEffect(() => { fetchReviews(); }, [fetchReviews]);

    const getStatusClass = s => {
        const l = s?.toLowerCase();
        if (!l) return '';
        if (l === 'таза') return styles.halal;
        if (l === 'таза емес') return styles.haram;
        if (l === 'күмәнді') return styles.suspicious;
        return '';
    };

    const isSuspicious = serverProduct?.status?.toLowerCase() === 'күмәнді';
    const highlightClass = isSuspicious ? styles.suspiciousHighlight : styles.haramHighlight;
    const ingredientsLabel = isSuspicious
        ? t('scanInfoSuspiciousIngredients')
        : t('scanInfoHaramIngredients');

    const handleCommentSubmit = async e => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        if (stars === 0) { setReviewsError(t('scanInfoSelectStars')); return; }

        try {
            const { data } = await axios.post(
                `https://quramdetector-3uaf.onrender.com/scans/${scan_id}/reviews`,
                {
                    product_id: serverProduct.scan_id,
                    review_description: comment.trim(),
                    stars
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const newReview = data?.data || {
                user_id: Date.now(),
                user_name: 'You',
                review_description: comment.trim(),
                stars
            };
            setReviews(prev => [...prev, newReview]);
            setComment('');
            setStars(0);
            setReviewsError('');
        } catch {
            setReviewsError(t('scanInfoSendReviewError'));
        }
    };

    if (loading) return (<div className={styles.loadingWrapper}><p>{t('scanInfoLoading')}</p></div>);
    if (error)   return (<div className={styles.errorWrapper}><p>{error}</p></div>);
    if (!serverProduct) return (<div className={styles.errorWrapper}><p>{t('scanInfoNoData')}</p></div>);

    const displayName   = serverProduct.product_name || 'No Name';
    const displayImage  = serverProduct.image || '';
    const displayStatus = serverProduct.status || '';

    return (
        <div className={styles.productDetailsPage}>

            <div className={styles.heroSection}>
                <LanguageSwitcher />
                <div className={styles.heroContent}>
                    {displayImage ? (
                        <div className={styles.heroImageContainer}>
                            <img src={displayImage} alt={displayName} className={styles.heroImage} />
                        </div>
                    ) : (<p className={styles.noImage}>{t('scanInfoNoImage')}</p>)}

                    <h2 className={styles.heroTitle}>{displayName}</h2>
                    {displayStatus && (
                        <p className={`${styles.productStatus} ${getStatusClass(displayStatus)}`}>{displayStatus}</p>
                    )}
                </div>
                <div className={styles.heroWave} />
                <div className={styles.heroGlow} />
            </div>

            <div className={styles.contentWrapper}>
                {serverProduct.ingredients && (
                    <>
                        <h3 className={styles.reviewHeader}>{t('scanInfoIngredientsTitle')}</h3>
                        <div className={styles.ingredientsBlock}>
                            <p className={styles.ingredientsText}>{serverProduct.ingredients}</p>
                            {(displayStatus.toLowerCase() === 'таза емес' || isSuspicious) && serverProduct.haram_ingredients && (
                                <p className={highlightClass}>{ingredientsLabel} {serverProduct.haram_ingredients}</p>
                            )}
                        </div>
                    </>
                )}

                <h3 className={styles.reviewHeader}>{t('scanInfoReviewsTitle')}</h3>
                {loadingReviews ? (
                    <p>{t('scanInfoReviewsLoading')}</p>
                ) : reviewsError ? (
                    <p className={styles.errorText}>{reviewsError}</p>
                ) : reviews.length ? (
                    <ul className={styles.reviewsList}>
                        {reviews.map((r,i)=>(
                            <li key={i} className={styles.reviewItem}>
                                <div className={styles.reviewContent}>
                                    <div className={styles.leftSide}>
                                        <p className={styles.userName}>{r.user_name || `User ${r.user_id}`}</p>
                                        <p className={styles.commentText}>{r.review_description || t('scanInfoNoComment')}</p>
                                    </div>
                                    <div className={styles.rightSide}>
                                        <div className={styles.starsDisplay}>
                                            {Array.from({length:5}).map((_,idx)=>(
                                                <span key={idx} className={idx<r.stars?styles.redStar:styles.greyStar}>★</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (<p>{t('scanInfoNoReviews')}</p>)}

                <form onSubmit={handleCommentSubmit} className={styles.reviewForm}>
                    <label className={styles.starsLabel}>{t('scanInfoRatePrompt')}</label>
                    <div className={styles.starsInput}>
                        {[1,2,3,4,5].map(s=> (
                            <span key={s} className={s<=stars?styles.selectedStar:styles.unselectedStar} onClick={()=>setStars(s)}>★</span>
                        ))}
                    </div>
                    <textarea
                        value={comment}
                        onChange={e=>setComment(e.target.value)}
                        placeholder={t('scanInfoCommentPlaceholder')}
                        className={styles.commentInput}
                    />
                    <button type="submit" className={styles.sendButton}>{t('scanInfoSendButton')}</button>
                </form>
            </div>
        </div>
    );
}
