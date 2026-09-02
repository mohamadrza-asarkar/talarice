import React from 'react';
import { useApp } from '../../context';
import { SEO } from '../../components/SEO';
import { ProductCard } from '../../components/productCard';
import styles from './style.module.css';

export function CatalogPage() {
  const { products } = useApp();

  return (
    <div className={styles.catalogWrapper}>
      <SEO
        title="محصولات برنج اصیل کامفیروز"
        description="لیست قیمت انواع برنج اصیل کامفیروزی درجه یک، بوجاری شده، طارم هاشمی، دودی و نیم‌دانه در کیسه‌های ۱۰ کیلوگرمی با امکان خرید آنلاین."
        keywords="قیمت برنج کامفیروز, خرید کیسه برنج ۱۰ کیلویی, برنج مرودشت, برنج معطر کامفیروزی"
      />

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

