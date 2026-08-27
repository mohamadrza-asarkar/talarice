import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context';
import { ProductCard } from '../../components/productCard';
import styles from './style.module.css';

export const CatalogPage = () => {
  const { products } = useApp();

  return (
    <div className={styles.catalogWrapper}>
      <header className={styles.headerCard}>
        <div className={styles.headerTopRow}>
          <span className={styles.locationBadge}>شالیزارهای کامفیروز فارس</span>
          <span className={styles.countBadge}>
            {(products?.length ?? 0).toLocaleString('fa-IR')} گونی برنج
          </span>
        </div>
        <h2 className={styles.title}>فهرست گونی‌های برنج کامفیروزی</h2>
        <p className={styles.subtitle}>
          عرضه مستقیم در کیسه‌های پارچه‌ای نخی سفید با گارانتی اصالت
        </p>
      </header>

      <div className={styles.searchRow}>
        <Link to="/search" className={styles.searchButton}>
          <i className="fa-solid fa-magnifying-glass" />
          <span>جستجو در محصولات</span>
        </Link>
      </div>

      {!products?.length ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <i className="fa-solid fa-wheat-awn-circle-exclamation" />
          </div>
          <h4 className={styles.emptyTitle}>موردی یافت نشد</h4>
        </div>
      ) : (
        <main className={styles.gridContainer}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </main>
      )}
    </div>
  );
};

