import React from 'react';
import Header from './../Header/Header';
import styles from './NewFeature.module.css';

export default function NewFeature() {
    return (
        <div className={styles.featurePage}>
            <Header />

            <div className={styles.heroSection}>
                <h1 className={styles.heroTitle}>Logo Recognition</h1>
                <p className={styles.heroSubtitle}>
                    Automatically detect halal‑certified brands at a glance
                </p>
            </div>

            <div className={styles.contentWrapper}>
                <section className={`${styles.sectionCard} ${styles.overview}`}>
                    <h2>How It Works</h2>
                    <p>
                        If a trusted halal brand’s logo is found on packaging, you no longer
                        need to check each product. Our model spots logos of certified
                        producers and confirms “✅ BrandName is on our whitelist and all its
                        products are halal.”
                    </p>
                </section>

                <section className={`${styles.sectionCard} ${styles.steps}`}>
                    <h2>Feature Steps</h2>
                    <ol>
                        <li>
                            <strong>Data & Augmentation:</strong> Collected 50 real logos,
                            then augmented to 900+ images (rotations, crops, flips,
                            brightness).
                        </li>
                        <li>
                            <strong>Annotation:</strong> Labeled logos in Roboflow, generated a clean
                            YOLOv8 dataset with train/val/test splits.
                        </li>
                        <li>
                            <strong>Model Selection:</strong> Chose YOLOv8s for fast, accurate
                            multi‑object detection on CPU/GPU.
                        </li>
                        <li>
                            <strong>Training:</strong> Ran 50 epochs on Google Colab using
                            Ultralytics’ API, producing a custom <code>best.pt</code> detector.
                        </li>
                        <li>
                            <strong>Backend Integration:</strong> Endpoint <code>/process-logo</code> lets
                            users upload images, runs detection, checks against our whitelist,
                            and returns brand verification results.
                        </li>
                    </ol>
                </section>
            </div>
        </div>
    );
}