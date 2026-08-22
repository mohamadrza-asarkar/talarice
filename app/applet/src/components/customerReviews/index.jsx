import React from 'react';
import { useApp } from '../../context';
import styles from './style.module.css';

export const CustomerReviews = () => {
  const { reviews } = useApp();

  return (
    <section className={styles.section}>
      <div className={styles.reviewsContainer}>
        <div className={styles.header}>
          <div className={styles.titleWrapper}>
            <i className={`fa-solid fa-star ${styles.titleIcon}`} />
            <h3 className={styles.title}>
              نظرات خریداران واقعی
            </h3>
          </div>
          <span className={styles.badge}>
            ۴.۹ از ۵
          </span>
        </div>

        <div className={styles.reviewsList}>
          {reviews.map((rev, index) => (
            <div key={rev.id || index} className={styles.reviewItem}>
              <div className={styles.reviewHeader}>
                <div className={styles.stars}>
                  {[...Array(rev.rating || 5)].map((_, i) => (
                    <i key={i} className="fa-solid fa-star" />
                  ))}
                </div>
                <h4 className={styles.userName}>
                  {rev.userName}
                </h4>
              </div>
              
              <div>
                <span className={styles.productTag}>
                  {rev.productName || 'خریدار برنج کامفیروزی ممتاز'}
                </span>
                <p className={styles.comment}>
                  {rev.comment}
                </p>
              </div>
              
              {index < reviews.length - 1 && (
                <div className={styles.divider} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
