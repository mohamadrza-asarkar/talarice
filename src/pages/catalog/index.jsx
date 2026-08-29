import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context';
import { SEO } from '../../components/SEO';
import { ProductCard } from '../../components/productCard';
import styles from './style.module.css';

export function CatalogPage() {
  const { products, goBack } = useApp();

  return (
    <div className={styles.catalogWrapper}>
      <SEO
        title="فهرست و قیمت برنج‌های اصیل کامفیروز"
        description="لیست قیمت انواع برنج اصیل کامفیروزی درجه یک، بوجاری شده، طارم هاشمی، دودی و نیم‌دانه در کیسه‌های ۱۰ کیلوگرمی با امکان خرید آنلاین."
        keywords="قیمت برنج کامفیروز, خرید کیسه برنج ۱۰ کیلویی, برنج مرودشت, برنج معطر کامفیروزی"
      />
      <header className={styles.headerCard}>
        <div className={styles.headerTopRow}>
          <button
            type="button"
            onClick={function () { goBack('/'); }}
            className={styles.backBtn}
            aria-label="بازگشت"
          >
            <i className="fa-solid fa-arrow-right" />
            <span>بازگشت</span>
          </button>
          <div className={styles.headerBadges}>
            <span className={styles.locationBadge}>شالیزارهای کامفیروز فارس</span>
            <span className={styles.countBadge}>
              {(products?.length ?? 0).toLocaleString('fa-IR')} گونی برنج
            </span>
          </div>
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
          {products.map(function (product) {
            return <ProductCard key={product.id} product={product} />;
          })}
        </main>
      )}
    </div>
  );
}

export default CatalogPage;

