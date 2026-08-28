import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context';
import styles from './style.module.css';

export function ProductCard({ product }) {
  const { addToCart } = useApp();

  if (!product) return null;

  const currentPrice = product.price || 0;
  const currentOldPrice = product.oldPrice || null;

  return (
    <article className={styles.card}>
      <Link to={`/product/${product.id}`} className={styles.contentWrapper}>
        <div className={styles.imageContainer}>
          <img src={product.image} alt={product.name} className={styles.image} />
          {product.discountPercent > 0 && (
            <span className={styles.discountBadge}>
              {product.discountPercent.toLocaleString('fa-IR')}٪ تخفیف
            </span>
          )}
        </div>

        <h4 className={styles.title}>{product.name}</h4>
        {product.description && <p className={styles.description}>{product.description}</p>}
      </Link>

      <div className={styles.bottomSection}>
        <div className={styles.priceContainer}>
          {currentOldPrice ? <del className={styles.oldPrice}>{currentOldPrice.toLocaleString('fa-IR')}</del> : <span className={styles.emptyPrice} />}
          <strong className={styles.currentPrice}>
            {currentPrice.toLocaleString('fa-IR')} <small>تومان</small>
          </strong>
        </div>

        <button
          type="button"
          onClick={function () { addToCart(product, null, 1); }}
          className={styles.addButton}
        >
          <i className="fa-solid fa-cart-plus" />
          <span>افزودن به سبد</span>
        </button>
      </div>
    </article>
  );
}


