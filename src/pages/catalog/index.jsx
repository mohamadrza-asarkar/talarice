import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context';
import { ProductCard } from '../../components/productCard';
import styles from './style.module.css';

export const CatalogPage = () => {
  const { products } = useApp();
  const navigate = useNavigate();

  return (
    <div className={styles.catalogWrapper}>
      <div className={styles.headerCard}>
        <div className={styles.headerTopRow}>
          <span className={styles.locationBadge}>
            شالیزارهای کامفیروز فارس
          </span>
          <span className={styles.countBadge}>
            {products.length.toLocaleString('fa-IR')} گونی برنج
          </span>
        </div>
        <h2 className={styles.title}>
          فهرست گونی‌های برنج کامفیروزی
        </h2>
        <p className={styles.subtitle}>
          عرضه مستقیم در کیسه‌های پارچه‌ای نخی سفید با گارانتی اصالت
        </p>
      </div>

      <div className={styles.searchRow}>
        <button
          onClick={() => navigate('/search')}
          className={styles.searchButton}
        >
          <i className="fa-solid fa-magnifying-glass" style={{ fontSize: '0.75rem' }} />
          <span>جستجو در محصولات</span>
        </button>
      </div>

      {products.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <i className="fa-solid fa-wheat-awn-circle-exclamation" />
          </div>
          <h4 className={styles.emptyTitle}>
            موردی یافت نشد
          </h4>
        </div>
      ) : (
        <div className={styles.gridContainer}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

