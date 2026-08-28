import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context';
import styles from './style.module.css';

export function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, setIsCartOpen, goBack } = useApp();

  function handleBack(e) {
    e?.preventDefault();
    e?.stopPropagation();
    goBack('/catalog');
  }

  const product = products?.find(function (p) { return String(p.id) === String(id) || String(p._id) === String(id); });
  const [activeTab, setActiveTab] = useState('desc');

  if (!product) {
    return (
      <div className={styles.pageWrapper}>
        <header className={styles.header}>
          <button type="button" onClick={handleBack} className={styles.backBtn}>
            <i className="fa-solid fa-arrow-right" />
            <span>بازگشت</span>
          </button>
        </header>
        <div className={styles.notFoundContainer}>
          <h2>محصول یافت نشد</h2>
          <button onClick={function () { navigate('/catalog'); }} className={styles.notFoundBtn}>
            مشاهده محصولات
          </button>
        </div>
      </div>
    );
  }

  const currentPrice = Number(product.price ?? 0);
  const currentOldPrice = product.oldPrice ? Number(product.oldPrice) : null;

  const tabs = [
    { id: 'desc', label: 'معرفی محصول' },
    { id: 'specs', label: 'مشخصات پخت' },
    { id: 'reviews', label: `نظرات (${(product.reviewCount ?? 0).toLocaleString('fa-IR')})` }
  ];

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.header}>
        <button type="button" onClick={handleBack} className={styles.backBtn}>
          <i className="fa-solid fa-arrow-right" />
          <span>بازگشت</span>
        </button>
        <div className={styles.headerActions}>
          <button className={styles.actionBtn}><i className="fa-regular fa-heart" /></button>
          <button className={styles.actionBtn}><i className="fa-solid fa-share-nodes" /></button>
        </div>
      </header>

      <div className={styles.imageContainer}>
        <img src={product.image} alt={product.name} className={styles.productImage} />
        {product.discountPercent > 0 && (
          <span className={styles.productBadge}>
            {product.discountPercent.toLocaleString('fa-IR')}٪ تخفیف
          </span>
        )}
      </div>

      <main className={styles.detailsContainer}>
        <div className={styles.titleRow}>
          <h1 className={styles.productTitle}>{product.name}</h1>
          <div className={styles.ratingBox}>
            <i className="fa-solid fa-star" />
            <span>{product.rating ?? '۵.۰'}</span>
          </div>
        </div>

        <div className={styles.tagsContainer}>
          <span className={styles.tag}>برنج اصیل کامفیروز</span>
          <span className={styles.tag}>بوجاری شده</span>
          <span className={styles.tag}>بدون خرده</span>
        </div>

        <div className={styles.priceContainer}>
          {currentOldPrice && currentOldPrice > currentPrice && (
            <div className={styles.oldPriceRow}>
              <span className={styles.discountBadge}>
                {Math.round(((currentOldPrice - currentPrice) / currentOldPrice) * 100)}٪
              </span>
              <span className={styles.oldPriceValue}>
                {currentOldPrice.toLocaleString('fa-IR')}
              </span>
            </div>
          )}
          <div className={styles.currentPriceRow}>
            <span className={styles.currentPriceValue}>
              {currentPrice.toLocaleString('fa-IR')}
            </span>
            <span className={styles.currency}>تومان</span>
          </div>
        </div>

        <div className={styles.tabsContainer}>
          <div className={styles.tabsList}>
            {tabs.map(function (t) {
              return (
                <button
                  key={t.id}
                  onClick={function () { setActiveTab(t.id); }}
                  className={`${styles.tabBtn} ${activeTab === t.id ? styles.tabActive : styles.tabInactive}`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'desc' && (
              <p className={styles.descText}>
                {product.description ?? 'برنج کامفیروزی اصل با عطر و طعم بی‌نظیر، مستقیماً از شالیزارهای منطقه کامفیروز فارس.'}
              </p>
            )}
            {activeTab === 'specs' && (
              <ul className={styles.specsList}>
                <li className={styles.specItem}>
                  <span className={styles.specLabel}>منطقه کشت:</span>
                  <strong>{product.origin ?? 'کامفیروز، استان فارس'}</strong>
                </li>
                <li className={styles.specItem}>
                  <span className={styles.specLabel}>شالیکار:</span>
                  <strong>{product.farmer ?? 'تعاونی شالیکاران'}</strong>
                </li>
                <li className={styles.specItem}>
                  <span className={styles.specLabel}>طریقه پخت:</span>
                  <strong>{product.cookingRatio ?? '۱ پیمانه برنج به ۱.۳ پیمانه آب'}</strong>
                </li>
                <li className={styles.specItem}>
                  <span className={styles.specLabel}>میزان ری‌کشی:</span>
                  <strong>{product.elongation ?? 'عالی'}</strong>
                </li>
              </ul>
            )}
            {activeTab === 'reviews' && (
              <div className={styles.reviewsList}>
                <div className={styles.reviewItem}>
                  <div className={styles.reviewHeader}>
                    <strong className={styles.reviewerName}>کاربر سایت</strong>
                    <div className={styles.reviewStars}>
                      {[...Array(5)].map(function (_, i) {
                        return <i key={i} className="fa-solid fa-star" />;
                      })}
                    </div>
                  </div>
                  <p className={styles.reviewText}>
                    کیفیت محصول بسیار عالی بود. عطر و طعم فوق‌العاده‌ای داشت.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <div className={styles.bottomBar}>
        <button
          onClick={function () {
            addToCart(product, null, 1);
            setIsCartOpen(true);
          }}
          className={styles.addToCartBtn}
        >
          <i className="fa-solid fa-cart-plus" />
          <span>افزودن به سبد خرید</span>
        </button>
      </div>
    </div>
  );
}

export default ProductPage;

