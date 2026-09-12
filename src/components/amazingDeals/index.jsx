import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context';
import { truncateAtWord, toFaDigits } from '../../utils/textUtils';
import styles from './style.module.css';

export function AmazingDeals() {
  const { products, addToCart } = useApp();
  const dealProducts = (products || []).filter(function (p) {
    return p.isDeal || p.isSpecialDeal || p.isAmazing || (p.dealPrice && p.dealPrice < p.price);
  });
  
  // Choose the single featured amazing product
  const product = dealProducts[0] || products?.[0];

  const [secondsLeft, setSecondsLeft] = useState(46785);

  useEffect(function () {
    const timer = setInterval(function () {
      setSecondsLeft(function (s) { return s > 0 ? s - 1 : 46785; });
    }, 1000);
    return function () { clearInterval(timer); };
  }, []);

  if (!product) return null;

  const h = toFaDigits(String(Math.floor(secondsLeft / 3600)).padStart(2, '0'));
  const m = toFaDigits(String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, '0'));
  const s = toFaDigits(String(secondsLeft % 60).padStart(2, '0'));

  // Deal price is 12% off normal catalog price: 430,000 -> 378,000
  const regularCatalogPrice = product.price || 430000;
  const dealPrice = product.dealPrice || Math.round(regularCatalogPrice * 0.88);
  const discountPercent = product.dealDiscountPercent || 12;

  const handleBuyDeal = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      ...product,
      price: dealPrice
    }, 1);
  };

  return (
    <section className={styles.dealsSection}>
      <header className={styles.header}>
        <h3 className={styles.title}>
          <i className="fa-solid fa-fire-flame-curved" />
          <span>پیشنهاد ویژه شگفت‌انگیز</span>
        </h3>

        <time className={styles.timer} dir="ltr">
          <div className={styles.timerSegment}>
            <span>{h}</span>
          </div>
          <span className={styles.colon}>:</span>
          <div className={styles.timerSegment}>
            <span>{m}</span>
          </div>
          <span className={styles.colon}>:</span>
          <div className={styles.timerSegment}>
            <span>{s}</span>
          </div>
        </time>
      </header>

      <Link to={`/product/${product.id}`} className={styles.horizontalCard}>
        <div className={styles.imageCol}>
          <img src={product.image} alt={product.name} className={styles.productImage} />
          <span className={styles.discountBadge}>
            {toFaDigits(discountPercent)}٪ تخفیف
          </span>
        </div>

        <div className={styles.infoCol}>
          <div className={styles.titleGroup}>
            <h4 className={styles.productTitle}>{product.name}</h4>
          </div>

          <div className={styles.bottomRow}>
            <div className={styles.priceCol}>
              <del className={styles.oldPrice}>
                {toFaDigits(regularCatalogPrice.toLocaleString('fa-IR'))}
              </del>
              <strong className={styles.currentPrice}>
                {toFaDigits(dealPrice.toLocaleString('fa-IR'))} <small>تومان</small>
              </strong>
            </div>

            <button
              type="button"
              onClick={handleBuyDeal}
              className={styles.addToCartBtn}
              aria-label="خرید پیشنهاد ویژه با تخفیف"
            >
              <i className="fa-solid fa-cart-shopping" />
              <span>خرید ویژه</span>
            </button>
          </div>
        </div>
      </Link>
    </section>
  );
}
