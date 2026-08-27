import React, { useState, useEffect } from 'react';
import { useApp } from '../../context';
import { ProductCard } from '../productCard';
import styles from './style.module.css';

export const AmazingDeals = () => {
  const { products } = useApp();
  const dealProducts = products.filter((p) => p.isDeal);
  const [secondsLeft, setSecondsLeft] = useState(46785);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 46785));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!dealProducts.length) return null;

  const h = String(Math.floor(secondsLeft / 3600)).padStart(2, '0');
  const m = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, '0');
  const s = String(secondsLeft % 60).padStart(2, '0');

  return (
    <section className={styles.dealsSection}>
      <header className={styles.header}>
        <h3 className={styles.title}>
          <i className="fa-solid fa-fire-flame-curved" />
          <span>پیشنهاد شگفت‌انگیز طلا رایس</span>
        </h3>

        <time className={styles.timer}>
          <span>{s}</span>:<span>{m}</span>:<span>{h}</span>
        </time>
      </header>

      <div className={styles.gridContainer}>
        {dealProducts.slice(0, 2).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

