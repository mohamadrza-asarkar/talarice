import React from 'react';
import { useApp } from '../../context';
import { ProductCard } from '../productCard';
import styles from './style.module.css';

export const BestSellers = () => {
  const { products, setActiveTab } = useApp();

  return (
    <section className={styles.section}>
      <div className={styles.headerRow}>
        <h3 className={styles.title}>
          <i className="fa-solid fa-wheat-awn" style={{ color: '#d4af37' }} />
          <span>پرفروش‌ترین گونی‌های برنج</span>
        </h3>
        <button
          onClick={() => setActiveTab('catalog')}
          className={styles.viewAllBtn}
        >
          <span>مشاهده همه</span>
          <i className="fa-solid fa-arrow-left" style={{ fontSize: '11px' }} />
        </button>
      </div>

      <div className={styles.gridContainer}>
        {products.slice(0, 2).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
