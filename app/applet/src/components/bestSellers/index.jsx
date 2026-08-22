import React from 'react';
import { useApp } from '../../context';
import { ProductCard } from '../productCard';
import styles from './style.module.css';

export const BestSellers = () => {
  const { products, setActiveTab } = useApp();

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h3 className={styles.titleContainer}>
          <i className={`fa-solid fa-wheat-awn ${styles.titleIcon}`} />
          <span className={styles.titleText}>پرفروش‌ترین گونی‌های برنج</span>
        </h3>
        
        <button
          onClick={() => setActiveTab('catalog')}
          className={styles.viewAllButton}
        >
          <span>مشاهده همه</span>
          <i className={`fa-solid fa-arrow-left ${styles.arrowIcon}`} />
        </button>
      </div>

      <div className={styles.productsGrid}>
        {products.slice(0, 2).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
