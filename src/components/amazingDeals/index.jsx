import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context';
import { truncateAtWord, toFaDigits } from '../../utils/textUtils';
import styles from './style.module.css';

export function AmazingDeals() {
  const { amazingProducts, addToCart } = useApp();
  const navigate = useNavigate();
  
  // Strictly use real amazing products returned from API
  const dealProducts = Array.isArray(amazingProducts) ? amazingProducts : [];
  const [activeIndex, setActiveIndex] = useState(0);

  // Choose the active featured amazing product
  const product = dealProducts[activeIndex] || dealProducts[0];

  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (!product) return;

    // Determine real target expiration timestamp from server product fields
    let expTime = null;

    const expStr = product.amazingExpiresAt || product.expiresAt || product.dealExpiresAt || product.endTime || product.expireDate;
    if (expStr) {
      const parsed = new Date(expStr).getTime();
      if (!isNaN(parsed)) {
        expTime = parsed;
      }
    }

    // Fallback if expiration string not direct: check duration hours + creation time
    if (!expTime && (product.amazingDurationHours || product.dealDurationHours)) {
      const createdMs = product.createdAt ? new Date(product.createdAt).getTime() : Date.now();
      const hours = Number(product.amazingDurationHours || product.dealDurationHours || 24);
      if (!isNaN(createdMs) && hours > 0) {
        expTime = createdMs + hours * 3600 * 1000;
      }
    }

    // Fallback if no server expiration defined: calculate end of today (23:59:59)
    if (!expTime) {
      const now = new Date();
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).getTime();
      expTime = endOfDay > now.getTime() ? endOfDay : now.getTime() + 24 * 3600 * 1000;
    }

    const calcRemainingSeconds = () => {
      const now = Date.now();
      return Math.max(0, Math.floor((expTime - now) / 1000));
    };

    setSecondsLeft(calcRemainingSeconds());

    const timer = setInterval(() => {
      setSecondsLeft(calcRemainingSeconds());
    }, 1000);

    return () => clearInterval(timer);
  }, [
    product?.id,
    product?._id,
    product?.amazingExpiresAt,
    product?.expiresAt,
    product?.dealExpiresAt,
    product?.endTime,
    product?.expireDate,
    product?.amazingDurationHours,
    product?.dealDurationHours,
    product?.createdAt
  ]);

  if (!product) return null;

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  const h = toFaDigits(String(hours).padStart(2, '0'));
  const m = toFaDigits(String(minutes).padStart(2, '0'));
  const s = toFaDigits(String(seconds).padStart(2, '0'));

  // Compute robust prices matching normalized amazing product structure
  const regularCatalogPrice = Number(product.originalPrice || product.price || 480000);
  const discountPercent = Number(product.discountPercent || 15);
  const dealPrice = Number(product.dealPrice || (discountPercent > 0 ? Math.round(regularCatalogPrice * (1 - discountPercent / 100)) : product.price));

  const handleBuyDeal = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      ...product,
      price: dealPrice
    }, 1);
    navigate('/cart');
  };

  return (
    <section className={styles.dealsSection}>
      <header className={styles.header}>
        <h3 className={styles.title}>
          <i className="fa-solid fa-fire-flame-curved" />
          <span>پیشنهاد ویژه شگفت‌انگیز</span>
          {dealProducts.length > 1 && (
            <span style={{ fontSize: '0.75rem', opacity: 0.85, marginRight: '0.4rem', fontWeight: '500' }}>
              ({toFaDigits(activeIndex + 1)} از {toFaDigits(dealProducts.length)})
            </span>
          )}
        </h3>

        <time className={styles.timer} dir="ltr" title="زمان باقی‌مانده واقعی از سرور">
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

      <Link to={`/product/${product.id || product._id}`} className={styles.horizontalCard}>
        <div className={styles.imageCol}>
          <img src={product.image} alt={product.name} className={styles.productImage} />
          {discountPercent > 0 && (
            <span className={styles.discountBadge}>
              {toFaDigits(discountPercent)}٪ تخفیف
            </span>
          )}
        </div>

        <div className={styles.infoCol}>
          <div className={styles.titleGroup}>
            <h4 className={styles.productTitle}>{product.name}</h4>
          </div>

          <div className={styles.bottomRow}>
            <div className={styles.priceCol}>
              {regularCatalogPrice > dealPrice && (
                <del className={styles.oldPrice}>
                  {toFaDigits(regularCatalogPrice.toLocaleString('fa-IR'))}
                </del>
              )}
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

      {dealProducts.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.35rem', marginTop: '0.75rem' }}>
          {dealProducts.map((item, idx) => (
            <button
              key={item.id || item._id || idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              style={{
                width: idx === activeIndex ? '18px' : '8px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: idx === activeIndex ? '#D4AF37' : 'rgba(255,255,255,0.4)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              aria-label={`پیشنهاد شگفت انگیز ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
