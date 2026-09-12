import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context';
import { truncateAtWord } from '../../utils/textUtils';
import styles from './style.module.css';

export function ProductCard({ product }) {
  const { addToCart } = useApp();
  const [justAdded, setJustAdded] = useState(false);

  if (!product) return null;

  const currentPrice = product.price || 0;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
    }, 1400);
  };

  return (
    <article className={styles.card}>
      <Link to={`/product/${product.id}`} className={styles.contentWrapper}>
        <div className={styles.imageContainer}>
          <img
            src={product.image}
            alt={product.name}
            className={styles.image}
            loading="lazy"
          />
        </div>

        <div className={styles.infoArea}>
          <div className={styles.topMeta}>
            <span className={styles.categoryBadge}>{product.categoryName || 'کامفیروز اصیل'}</span>
            <div className={styles.rating}>
              <i className="fa-solid fa-star" />
              <span>{(product.rating || 5).toLocaleString('fa-IR')}</span>
            </div>
          </div>

          <h4 className={styles.title}>{product.name}</h4>
          {product.description && (
            <p className={styles.description}>
              {truncateAtWord(product.description, 50)}
            </p>
          )}
        </div>
      </Link>

      <div className={styles.bottomSection}>
        <div className={styles.priceContainer}>
          <strong className={styles.currentPrice}>
            {currentPrice.toLocaleString('fa-IR')} <small>تومان</small>
          </strong>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className={`${styles.addButton} ${justAdded ? styles.addedButton : ''}`}
          aria-label="افزودن به سبد خرید"
        >
          {justAdded ? (
            <>
              <i className="fa-solid fa-check" />
              <span>ثبت شد</span>
            </>
          ) : (
            <>
              <i className="fa-solid fa-cart-plus" />
              <span>افزودن به سبد</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
