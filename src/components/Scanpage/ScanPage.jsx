// src/components/ScanPage/ScanPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import Header            from './../Header/Header';

import styles from './ScanPage.module.css';
import logo   from './image/logo.jpg';
import Footer from "../Footer/Footer";
import AddProductsCard from "../AddProductCard/AddProductCard";

export default function ScanPage() {
    const navigate = useNavigate();
    const { t }   = useTranslation();

    /* ---------- state ---------- */
    const [scanResult,          setScanResult]          = useState(null);
    const [loading,             setLoading]             = useState(false);
    const [showOptions,         setShowOptions]         = useState(false);
    const [imagePreview,        setImagePreview]        = useState(null);
    const [showCommentBlock,    setShowCommentBlock]    = useState(false);
    const [comments,            setComments]            = useState([]);
    const [newComment,          setNewComment]          = useState('');
    const [stars,               setStars]               = useState(0);
    const [error,               setError]               = useState('');
    const [alternatives,        setAlternatives]        = useState([]);
    const [showFullComposition, setShowFullComposition] = useState(false);
    const [isOverflowing,       setIsOverflowing]       = useState(false);

    const compositionRef = useRef(null);
    const cameraInputRef = useRef(null);

    const userName      = localStorage.getItem('name')      || 'Username';

    /* ---------- handlers ---------- */
    const handleScanClick  = () => setShowOptions(true);

    const handleTakePhoto  = () => {
        // открываем интент камеры
        cameraInputRef.current?.click();
        setShowOptions(false);
    };

    const handleChooseFile = () => {
        document.getElementById('fileInput').click();
        setShowOptions(false);
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImagePreview(URL.createObjectURL(file));
        setLoading(true);
        setScanResult(null);
        setShowCommentBlock(false);
        setNewComment('');
        setStars(0);
        setError('');
        setShowFullComposition(false);

        try {
            const token = localStorage.getItem('token');
            if (!token) { navigate('/login'); return; }

            const formData = new FormData();
            formData.append('file', file);

            const { data } = await axios.post(
                'https://quramdetector-k92n.onrender.com/process-images',
                formData,
                { headers: { Authorization: `Bearer ${token}` } },
            );

            setScanResult(data);
            setAlternatives(data?.data?.alternatives_data?.alternatives || []);
        } catch (err) {
            console.error('Ошибка при обработке:', err?.response);
            setScanResult({
                message: `${t('scanErrorPrefix')} ${
                    err?.response?.data?.message || t('scanErrorUnknown')
                }`,
                data: null,
            });
        } finally {
            setLoading(false);
        }
    };

    /* ---------- эффекты ---------- */
    useEffect(() => {
        if (compositionRef.current && !showFullComposition) {
            const el = compositionRef.current;
            setIsOverflowing(el.scrollHeight > el.clientHeight);
        }
    }, [scanResult, showFullComposition]);

    const fetchComments = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(
                'https://quramdetector-k92n.onrender.com/scans/latest/reviews',
                { headers: { Authorization: `Bearer ${token}` } },
            );
            setComments(data);
        } catch (err) {
            console.error('Ошибка при загрузке комментариев:', err);
        }
    };

    const handleSendComment = async () => {
        setError('');
        if (!newComment.trim() || stars === 0) {
            setError(t('scanCommentValidation'));
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }

        try {
            await axios.post(
                'https://quramdetector-k92n.onrender.com/scans/latest/reviews',
                { review_description: newComment.trim(), stars },
                { headers: { Authorization: `Bearer ${token}` } },
            );
            setNewComment('');
            setStars(0);
            fetchComments();
        } catch (err) {
            console.error('Ошибка при отправке комментария:', err);
        }
    };

    const renderStars = () =>
        [1, 2, 3, 4, 5].map((v) => (
            <span
                key={v}
                className={v <= stars ? styles.filledStar : styles.emptyStar}
                onClick={() => setStars(v)}
            >
        &#9733;
      </span>
        ));

    const toggleCommentBlock = () => {
        setShowCommentBlock(true);
        fetchComments();
    };

    const getStatusClass = () => {
        const s = scanResult?.data?.halal_status?.toLowerCase();
        if (!s) return '';
        if (['таза'].includes(s))      return styles.halalStatus;
        if (['таза емес'].includes(s)) return styles.haramStatus;
        if (['күмәнді'].includes(s))   return styles.suspiciousStatus;
        return '';
    };

    /* ---------- render ---------- */
    return (
        <div className={styles.scanPage}>
            <Header userName={userName} />

            {/* hero */}
            <div className={styles.heroSection}>
                <LanguageSwitcher />
                <div className={styles.heroWave} />
                <h1 className={styles.heroTitle}>Quram Detector</h1>
                <p className={styles.heroSubtitle}>{t('scanHeroSubtitle')}</p>
                <div className={styles.heroGlow} />
            </div>

            <div className={styles.contentWrapper}>
                {/* card: scan */}
                <div className={styles.scanCard}>
                    <div className={styles.placeholder}>
                        <img src={logo} alt="Logo" className={styles.placeholderLogo} />
                    </div>
                    <button
                        className={styles.scanButton}
                        onClick={handleScanClick}
                        disabled={loading}
                    >
                        {loading ? t('scanButtonLoading') : t('scanButton')}
                    </button>
                </div>

                {/* hidden inputs */}
                {/* выбор из галереи */}
                <input
                    type="file"
                    id="fileInput"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />

                {/* вызов камеры (инпут «полупрозрачный», но видимый для Chrome/Android) */}
                <input
                    ref={cameraInputRef}
                    id="cameraInput"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileChange}
                    className={styles.hiddenInput} // .hiddenInput => position:absolute; width:1px; height:1px; opacity:0;
                />

                {/* modal: choose photo / file */}
                {showOptions && (
                    <div className={styles.modal}>
                        <div className={styles.modalContent}>
                            <button
                                className={styles.optionButton}
                                onClick={handleTakePhoto}
                            >
                                {t('scanOptionPhoto')}
                            </button>
                            <button
                                className={styles.optionButton}
                                onClick={handleChooseFile}
                            >
                                {t('scanOptionFile')}
                            </button>
                            <button
                                className={styles.closeButton}
                                onClick={() => setShowOptions(false)}
                            >
                                {t('scanOptionCancel')}
                            </button>
                        </div>
                    </div>
                )}

                {/* ----------------------- РЕЗУЛЬТАТ ----------------------- */}
                <div className={styles.resultCard}>
                    <h3>{t('scanResultTitle')}</h3>

                    {scanResult && scanResult.data ? (
                        <>
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="preview"
                                    className={styles.resultImage}
                                />
                            )}

                            {/* status */}
                            <div className={styles.statusContainer}>
                                <p>
                                    <strong>
                                        {t('scanStatusLabel') ?? 'Статус продукта:'}
                                    </strong>{' '}
                                    <span className={getStatusClass()}>
                    {scanResult.data.halal_status}
                  </span>
                                </p>

                                {Array.isArray(scanResult.data.found_ingredients) &&
                                    scanResult.data.found_ingredients.length > 0 && (
                                        <p>
                                            <strong>
                                                {['күмәнді'].includes(
                                                    scanResult.data.halal_status.toLowerCase(),
                                                )
                                                    ? t('scanIngredientsLabelSuspicious')
                                                    : t('scanIngredientsLabelDangerous')}
                                            </strong>{' '}
                                            <span
                                                className={
                                                    ['күмәнді'].includes(
                                                        scanResult.data.halal_status.toLowerCase(),
                                                    )
                                                        ? styles.suspiciousStatus
                                                        : styles.dangerousIngredients
                                                }
                                            >
                        {scanResult.data.found_ingredients.join(', ')}
                      </span>
                                        </p>
                                    )}
                            </div>

                            {/* composition */}
                            {Array.isArray(scanResult.data.extracted_text) &&
                                scanResult.data.extracted_text.length > 0 && (
                                    <div className={styles.compositionContainer}>
                                        <strong className={styles.compositionLabel}>
                                            {t('scanCompositionLabel')}
                                        </strong>
                                        <div
                                            className={
                                                !showFullComposition ? styles.truncatedText : ''
                                            }
                                            ref={compositionRef}
                                        >
                                            {scanResult.data.extracted_text.join(', ')}
                                        </div>
                                        {!showFullComposition && isOverflowing && (
                                            <div className={styles.showMoreWrapper}>
                        <span
                            className={styles.showMore}
                            onClick={() => setShowFullComposition(true)}
                        >
                          {t('scanShowMore')}
                        </span>
                                            </div>
                                        )}
                                    </div>
                                )}

                            {/* comments */}
                            <div className={styles.commentSection}>
                                {showCommentBlock ? (
                                    <div className={styles.commentContainer}>
                                        <div className={styles.commentList}>
                                            {comments.map((c) => (
                                                <div key={c.id} className={styles.commentCard}>
                                                    <p className={styles.commentText}>
                                                        {c.review_description}
                                                    </p>
                                                    <p className={styles.commentStars}>
                                                        {Array.from({ length: c.stars }).map((_, i) => (
                                                            <span key={i} className={styles.filledStar}>
                                &#9733;
                              </span>
                                                        ))}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                        <div className={styles.inputSection}>
                                            <div className={styles.starRating}>{renderStars()}</div>
                                            <input
                                                className={styles.commentInput}
                                                type="text"
                                                placeholder={t('scanCommentInputPlaceholder')}
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                            />
                                            {error && (
                                                <p className={styles.errorText}>{error}</p>
                                            )}
                                            <button
                                                className={styles.sendButton}
                                                onClick={handleSendComment}
                                            >
                                                {t('scanCommentSend')}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className={styles.commentPlaceholder}
                                        onClick={toggleCommentBlock}
                                    >
                    <span className={styles.placeholderText}>
                      {t('scanCommentPlaceholder')}
                    </span>
                                        <button className={styles.commentButton}>+</button>
                                    </div>
                                )}
                            </div>

                            {/* alternatives */}
                            {alternatives.length > 0 && (
                                <div className={styles.alternativesCard}>
                                    <h3>{t('scanAlternativesTitle')}</h3>
                                    <ul
                                        className={`${styles.alternativesList} ${
                                            alternatives.length === 1 ? styles.centeredList : ''
                                        }`}
                                    >
                                        {alternatives.slice(0, 5).map((item) => (
                                            <li
                                                key={item.id}
                                                className={styles.alternativeItem}
                                                onClick={() =>
                                                    navigate('/product-details', {
                                                        state: { product: item },
                                                    })
                                                }
                                            >
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className={styles.alternativeImage}
                                                />
                                                <strong className={styles.alternativeName}>
                                                    {item.name}
                                                </strong>
                                            </li>
                                        ))}
                                    </ul>

                                    {alternatives.length > 5 && (
                                        <button
                                            className={styles.viewAllButton}
                                            onClick={() =>
                                                navigate('/alternativeproducts', {
                                                    state: { allAlternatives: alternatives },
                                                })
                                            }
                                        >
                                            {t('scanAlternativesShowAll')}
                                        </button>
                                    )}
                                </div>
                            )}
                        </>
                    ) : (
                        <p className={styles.noResultText}>{t('scanNoResult')}</p>
                    )}
                </div>

                <AddProductsCard />
            </div>
            <Footer />
        </div>
    );
}
