import React from 'react';
import { useApp } from '../../context';
import styles from './style.module.css';

export const CustomerReviews = () => {
  const { reviews } = useApp();

  if (!reviews?.length) return null;

  return (
    <section className={styles.reviewsContainer}>
      <header className={styles.header}>
        <h3 className={styles.title}>
          <i className="fa-solid fa-star" />
          <span>نظرات خریداران واقعی</span>
        </h3>
        <span className={styles.ratingBadge}>۴.۹ از ۵</span>
      </header>

      <div className={styles.reviewsList}>
        {reviews.map((rev, index) => (
          <article key={rev.id ?? index} className={styles.reviewItem}>
            <header className={styles.reviewHeader}>
              <strong className={styles.userName}>{rev.userName}</strong>
              <div className={styles.stars}>
                {Array.from({ length: rev.rating ?? 5 }).map((_, i) => (
                  <i key={i} className="fa-solid fa-star" />
                ))}
              </div>
            </header>

            <span className={styles.productTag}>
              {rev.productName ?? 'خریدار برنج کامفیروزی ممتاز'}
            </span>
            <p className={styles.commentText}>{rev.comment}</p>

            {index < reviews.length - 1 && <hr className={styles.divider} />}
          </article>
        ))}
      </div>
    </section>
  );
};

