import React from 'react';
import { useApp } from '../../context';
import { ProductCard } from '../../components/productCard';
import styles from './style.module.css';

export const CatalogPage = () => {
  const { products, setIsSearchOpen } = useApp();

  return (
    <div className={styles.catalogWrapper}>
      <div className={styles.headerBox}>
        <div className={styles.headerTop}>
          <span className={styles.badge}>
            شالیزارهای کامفیروز فارس
          </span>
          <span className={styles.countText}>
            {products.length.toLocaleString('fa-IR')} گونی برنج
          </span>
        </div>
        <h2 className={styles.title}>
          فهرست گونی‌های برنج کامفیروزی
        </h2>
        <p className={styles.description}>
          عرضه مستقیم در کیسه‌های پارچه‌ای نخی سفید با گارانتی اصالت
        </p>
      </div>

      <div className={styles.searchActions}>
        <button
          onClick={() => setIsSearchOpen(true)}
          className={styles.searchBtn}
        >
          <i className="fa-solid fa-magnifying-glass" />
          <span>جستجو در محصولات</span>
        </button>
      </div>

      {products.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIconWrapper}>
            <i className="fa-solid fa-wheat-awn-circle-exclamation" />
          </div>
          <h4 className={styles.emptyTitle}>
            موردی یافت نشد
          </h4>
        </div>
      ) : (
        <div className={styles.productsGrid}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
