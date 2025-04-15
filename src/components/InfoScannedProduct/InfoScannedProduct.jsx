import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './InfoScannedProduct.module.css';

function InfoScannedProduct() {
    const { scan_id } = useParams();
    const navigate = useNavigate();

    const [serverProduct, setServerProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Reviews states
    const [reviews, setReviews] = useState([]);
    const [comment, setComment] = useState('');
    const [stars, setStars] = useState(0);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [reviewsError, setReviewsError] = useState('');

    // Функция для получения отзывов с использованием useCallback для стабильности ссылки
    const fetchReviews = useCallback(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        setLoadingReviews(true);
        axios
            .get(`https://quramdetector-3uaf.onrender.com/scans/${scan_id}/reviews`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setReviews(response.data || []);
                setLoadingReviews(false);
            })
            .catch((err) => {
                console.error('Error fetching reviews:', err);
                setReviewsError('Failed to fetch reviews. Please try again.');
                setLoadingReviews(false);
            });
    }, [scan_id, navigate]);

    // Получение данных продукта
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        if (!scan_id) {
            setError('No scan_id provided.');
            setLoading(false);
            return;
        }

        setLoading(true);
        axios
            .get(`https://quramdetector-3uaf.onrender.com/admin/get-scan/${scan_id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setServerProduct(response.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Ошибка при получении данных скана:', err);
                setError('Failed to load product data. Try again later.');
                setLoading(false);
            });
    }, [scan_id, navigate]);

    // Получаем отзывы при монтировании компонента и при изменении scan_id
    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    // Функция для назначения CSS-класса в зависимости от статуса продукта
    const getStatusClass = (status) => {
        if (!status) return '';
        const lowerStatus = status.toLowerCase();
        if (lowerStatus === 'halal' || lowerStatus === 'халал') {
            return styles.halal;
        } else if (lowerStatus === 'haram' || lowerStatus === 'харам') {
            return styles.haram;
        } else if (lowerStatus === 'suspect') {
            return styles.suspicious;
        }
        return '';
    };

    // Класс подсветки ингредиентов
    const highlightClass =
        serverProduct?.status?.toLowerCase() === 'suspect'
            ? styles.suspiciousHighlight
            : styles.haramHighlight;

    const ingredientsLabel =
        serverProduct?.status?.toLowerCase() === 'suspect'
            ? 'Suspect Ingredients:'
            : 'Haram Ingredients:';

    // Отправка нового отзыва с оптимистичным обновлением
    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        if (stars === 0) {
            setReviewsError('Please select a rating.');
            return;
        }
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = {
                product_id: serverProduct.scan_id,
                review_description: comment.trim(),
                stars: stars,
            };

            const response = await axios.post(
                `https://quramdetector-3uaf.onrender.com/scans/${scan_id}/reviews`,
                payload,
                config
            );
            const newReview = response.data?.data || {
                user_id: Date.now(), // временный ID
                user_name: 'You',
                review_description: comment.trim(),
                stars: stars,
            };
            setReviews((prevReviews) => [...prevReviews, newReview]);

            // Сброс формы
            setComment('');
            setStars(0);
            setReviewsError('');
        } catch (err) {
            console.error('Error submitting review:', err);
            setReviewsError('Failed to submit review.');
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingWrapper}>
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorWrapper}>
                <p>{error}</p>
            </div>
        );
    }

    if (!serverProduct) {
        return (
            <div className={styles.errorWrapper}>
                <p>No product data found.</p>
            </div>
        );
    }

    const displayName = serverProduct.product_name || 'No Name';
    const displayImage = serverProduct.image || '';
    const displayStatus = serverProduct.status || '';

    return (
        <div className={styles.productDetailsPage}>
            <div className={styles.heroSection}>
                <div className={styles.heroContent}>
                    {displayImage ? (
                        <div className={styles.heroImageContainer}>
                            <img
                                src={displayImage}
                                alt={displayName}
                                className={styles.heroImage}
                            />
                        </div>
                    ) : (
                        <p className={styles.noImage}>No image</p>
                    )}

                    <h2 className={styles.heroTitle}>{displayName}</h2>
                    {displayStatus && (
                        <p className={`${styles.productStatus} ${getStatusClass(displayStatus)}`}>
                            {displayStatus}
                        </p>
                    )}
                </div>
                <div className={styles.heroWave}></div>
                <div className={styles.heroGlow}></div>
            </div>

            <div className={styles.contentWrapper}>
                {/* Ingredients block */}
                {serverProduct.ingredients && (
                    <>
                        <h3 className={styles.reviewHeader}>Ingredients</h3>
                        <div className={styles.ingredientsBlock}>
                            <p className={styles.ingredientsText}>
                                {serverProduct.ingredients}
                            </p>
                            {(displayStatus.toLowerCase() === 'haram' ||
                                    displayStatus.toLowerCase() === 'харам' ||
                                    displayStatus.toLowerCase() === 'suspect') &&
                                serverProduct.haram_ingredients && (
                                    <p className={highlightClass}>
                                        {ingredientsLabel} {serverProduct.haram_ingredients}
                                    </p>
                                )}
                        </div>
                    </>
                )}

                {/* Reviews block */}
                <h3 className={styles.reviewHeader}>Reviews</h3>
                {loadingReviews ? (
                    <p>Loading reviews...</p>
                ) : reviewsError ? (
                    <p className={styles.errorText}>{reviewsError}</p>
                ) : reviews.length > 0 ? (
                    <ul className={styles.reviewsList}>
                        {reviews.map((review, index) => (
                            <li key={index} className={styles.reviewItem}>
                                <div className={styles.reviewContent}>
                                    <div className={styles.leftSide}>
                                        <p className={styles.userName}>
                                            {review.user_name ? review.user_name : `User ${review.user_id}`}
                                        </p>
                                        <p className={styles.commentText}>
                                            {review.review_description ? review.review_description : 'No comment provided'}
                                        </p>
                                    </div>
                                    <div className={styles.rightSide}>
                                        <div className={styles.starsDisplay}>
                                            {Array(5)
                                                .fill(0)
                                                .map((_, i) => (
                                                    <span
                                                        key={i}
                                                        className={i < review.stars ? styles.redStar : styles.greyStar}
                                                    >
                                                        ★
                                                    </span>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No reviews yet.</p>
                )}

                {/* Review Submission Form */}
                <form onSubmit={handleCommentSubmit} className={styles.reviewForm}>
                    <label className={styles.starsLabel}>Rate this product:</label>
                    <div className={styles.starsInput}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={star <= stars ? styles.selectedStar : styles.unselectedStar}
                                onClick={() => setStars(star)}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Leave a comment..."
                        className={styles.commentInput}
                    />
                    <button type="submit" className={styles.sendButton}>
                        SEND
                    </button>
                </form>
            </div>
        </div>
    );
}

export default InfoScannedProduct;
