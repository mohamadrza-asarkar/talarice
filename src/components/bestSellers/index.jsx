import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context';
import { ProductCard } from '../productCard';
import styles from './style.module.css';

export function BestSellers() {
  const { products } = useApp();

  if (!products?.length) {
    return null;
  }

  return (
    <section className={styles.section}>
      <header className={styles.headerRow}>
        <h3 className={styles.title}>
          <i className="fa-solid fa-wheat-awn" />
          <span>پرفروش‌ترین گونی‌های برنج</span>
        </h3>
        <Link to="/catalog" className={styles.viewAllBtn}>
          <span>مشاهده همه</span>
          <i className="fa-solid fa-arrow-left" />
        </Link>
      </header>

      <div className={styles.gridContainer}>
        {(products || []).map(function (product) {
          return <ProductCard key={product.id} product={product} />;
        })}
      </div>
    </section>
  );
}


