import React, { useState, useEffect } from 'react';
import { useApp } from '../../context';
import { ProductCard } from '../productCard';
import styles from './style.module.css';

export const AmazingDeals = () => {
  const { products } = useApp();
  const dealProducts = products.filter((p) => p.isDeal);

  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 59,
    seconds: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0)
          return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0)
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 59, seconds: 45 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (dealProducts.length === 0) return null;

  return (
    <section className={styles.dealsSection}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <i className="fa-solid fa-fire-flame-curved" style={{ color: '#fef08a', fontSize: '1rem' }} />
          <h3 className={styles.title}>
            پیشنهاد شگفت‌انگیز طلا رایس
          </h3>
        </div>

        <div className={styles.timer}>
          <span className={styles.timeBox}>
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
          <span className={styles.colon}>:</span>
          <span className={styles.timeBox}>
            {String(timeLeft.minutes).padStart(2, '0')}
          </span>
          <span className={styles.colon}>:</span>
          <span className={styles.timeBox}>
            {String(timeLeft.hours).padStart(2, '0')}
          </span>
        </div>
      </div>

      <div className={styles.gridContainer}>
        {dealProducts.slice(0, 2).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

