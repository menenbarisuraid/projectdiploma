import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './CommentPage.module.css';

function CommentPage() {
    const navigate = useNavigate();
    const { scan_id } = useParams(); // Получаем scan_id из URL

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [stars, setStars] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            fetchComments();
        }
    }, [navigate, scan_id]);

    const fetchComments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `https://quramdetector-3uaf.onrender.com/scans/latest/reviews`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setComments(response.data);
        } catch (err) {
            console.error('Ошибка при загрузке комментариев:', err);
        }
    };

    const handleSendComment = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        if (newComment.trim() !== '' && stars > 0) {
            try {
                await axios.post(
                    `https://quramdetector-3uaf.onrender.com/scans/latest/reviews`,
                    { review_description: newComment.trim(), stars: stars },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setNewComment('');
                setStars(0);
                fetchComments();
            } catch (err) {
                console.error('Ошибка при отправке комментария:', err);
            }
        }
    };

    const renderStars = () => {
        return [1, 2, 3, 4, 5].map((star) => (
            <span
                key={star}
                className={star <= stars ? styles.filledStar : styles.emptyStar}
                onClick={() => setStars(star)}
            >
        &#9733;
      </span>
        ));
    };

    return (
        <div className={styles.commentPage}>
            <div className={styles.heroSection}>
                <h1 className={styles.heroTitle}>Comments</h1>
                <p className={styles.heroSubtitle}>Share your thoughts about this product</p>
            </div>

            <div className={styles.container}>
                <div className={styles.commentList}>
                    {comments.map((comment) => (
                        <div key={comment.id} className={styles.commentCard}>
                            <p className={styles.commentText}>{comment.review_description}</p>
                            <p className={styles.commentStars}>Stars: {comment.stars}</p>
                        </div>
                    ))}
                </div>

                <div className={styles.inputSection}>
                    <div className={styles.starRating}>{renderStars()}</div>
                    <input
                        className={styles.commentInput}
                        type="text"
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button className={styles.sendButton} onClick={handleSendComment}>
                        SEND
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CommentPage;
