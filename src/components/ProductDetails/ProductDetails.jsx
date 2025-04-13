import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './ProductDetails.module.css';

function ProductDetails() {
    const location = useLocation();
    const navigate = useNavigate();

    const { product } = location.state || {};

    const [serverProduct, setServerProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [comment, setComment] = useState('');
    const [stars, setStars] = useState(0);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [error, setError] = useState('');

    const fetchProductData = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        if (!product || !product.id) {
            navigate('/products');
            return;
        }

        setLoadingReviews(true);
        setError('');
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.get(
                `https://quramdetector-3uaf.onrender.com/product/${product.id}`,
                config
            );
            const data = response.data.data;
            setServerProduct(data);
            setReviews(data.reviews || []);
        } catch (err) {
            console.error('Error fetching product data:', err);
            setError('Failed to load reviews.');
        } finally {
            setLoadingReviews(false);
        }
    }, [navigate, product]);

    useEffect(() => {
        fetchProductData();
    }, [fetchProductData]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        if (stars === 0) {
            setError('Please select a rating.');
            return;
        }
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = {
                product_id: product.id,
                review_description: comment.trim(),
                stars: stars,
            };

            const response = await axios.post(
                'https://quramdetector-3uaf.onrender.com/reviews',
                payload,
                config
            );
            const newReview = response.data?.data || null;
            if (newReview) {
                setReviews((prev) => [...prev, newReview]);
            }

            setComment('');
            setStars(0);
        } catch (err) {
            console.error('Error submitting review:', err);
            setError('Failed to submit review.');
        }
    };

    const displayName = serverProduct?.name || product?.name || 'No Name';
    const displayImage = serverProduct?.image || product?.image || '';
    const displayStatus = serverProduct?.status || product?.status || '';

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

    // Выбираем класс выделения для haram_ingredients:
    const highlightClass =
        displayStatus.toLowerCase() === 'suspect'
            ? styles.suspiciousHighlight
            : styles.haramHighlight;

    // Выбираем текст надписи для ингредиентов:
    const ingredientsLabel =
        displayStatus.toLowerCase() === 'suspect'
            ? 'Suspect Ingredients:'
            : 'Haram Ingredients:';

    return (
        <div className={styles.productDetailsPage}>
            <div className={styles.heroSection}>
                <div className={styles.heroContent}>
                    {/* Новый контейнер для изображения с белым кругом */}
                    <div className={styles.heroImageContainer}>
                        {displayImage ? (
                            <img
                                src={displayImage}
                                alt={displayName}
                                className={styles.heroImage}
                            />
                        ) : (
                            <p className={styles.noImage}>No image</p>
                        )}
                    </div>
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
                {serverProduct && serverProduct.ingredients && (
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

                <h3 className={styles.reviewHeader}>Reviews</h3>

                {loadingReviews ? (
                    <p>Loading reviews...</p>
                ) : error ? (
                    <p className={styles.errorText}>{error}</p>
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

export default ProductDetails;
