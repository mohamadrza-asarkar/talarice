import React from 'react';
import { useApp } from '../../context';
import styles from './style.module.css';

export const CustomerReviews = () => {
  const { reviews } = useApp();

  if (!reviews?.length) return null;

  return (
    <section className={styles.section}>
      <div className={styles.reviewsContainer}>
        <div className={styles.header}>
          <div className={styles.titleWrapper}>
            <i className="fa-solid fa-star" />
            <h3 className={styles.title}>نظرات خریداران واقعی</h3>
          </div>
          <span className={styles.ratingBadge}>۴.۹ از ۵</span>
        </div>

        <div className={styles.reviewsList}>
          {reviews.map((rev, index) => (
            <div key={rev.id ?? index} className={styles.reviewItem}>
              <div className={styles.reviewHeader}>
                <div className={styles.stars}>
                  {Array.from({ length: rev.rating ?? 5 }).map((_, i) => (
                    <i key={i} className="fa-solid fa-star" />
                  ))}
                </div>
                <strong className={styles.userName}>{rev.userName}</strong>
              </div>

              <div>
                <span className={styles.productTag}>
                  {rev.productName ?? 'خریدار برنج کامفیروزی ممتاز'}
                </span>
                <p className={styles.commentText}>{rev.comment}</p>
              </div>

              {index < reviews.length - 1 && <hr className={styles.divider} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
