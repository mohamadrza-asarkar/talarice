import React, { useState, useEffect } from 'react';
import { useApp } from '../../context';
import { ProductCard } from '../productCard';
import styles from './style.module.css';

export function AmazingDeals() {
  const { products } = useApp();
  const dealProducts = (products || []).filter(function (p) { return p.isDeal; });
  const [secondsLeft, setSecondsLeft] = useState(46785);

  useEffect(function () {
    const timer = setInterval(function () {
      setSecondsLeft(function (s) { return s > 0 ? s - 1 : 46785; });
    }, 1000);
    return function () { clearInterval(timer); };
  }, []);

  if (!dealProducts.length) return null;

  function toFaDigits(str) {
    return String(str).replace(/\d/g, function (d) {
      return '۰۱۲۳۴۵۶۷۸۹'[d];
    });
  }

  const h = toFaDigits(String(Math.floor(secondsLeft / 3600)).padStart(2, '0'));
  const m = toFaDigits(String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, '0'));
  const s = toFaDigits(String(secondsLeft % 60).padStart(2, '0'));

  return (
    <section className={styles.dealsSection}>
      <header className={styles.header}>
        <h3 className={styles.title}>
          <i className="fa-solid fa-fire-flame-curved" />
          <span>پیشنهاد شگفت‌انگیز طلا رایس</span>
        </h3>

        <time className={styles.timer} dir="ltr">
          <div className={styles.timerSegment}>
            <span>{h}</span>
            <small className={styles.timerLabel}>ساعت</small>
          </div>
          <span className={styles.colon}>:</span>
          <div className={styles.timerSegment}>
            <span>{m}</span>
            <small className={styles.timerLabel}>دقیقه</small>
          </div>
          <span className={styles.colon}>:</span>
          <div className={styles.timerSegment}>
            <span>{s}</span>
            <small className={styles.timerLabel}>ثانیه</small>
          </div>
        </time>
      </header>

      <div className={styles.gridContainer}>
        {dealProducts.map(function (product) {
          return <ProductCard key={product.id} product={product} />;
        })}
      </div>
    </section>
  );
}
