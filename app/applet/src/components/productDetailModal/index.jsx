import React, { useState } from 'react';
import { useApp } from '../../context';
import styles from './style.module.css';

export const ProductDetailModal = () => {
  const { selectedProduct, setSelectedProduct, addToCart } = useApp();
  const [selectedWeight, setSelectedWeight] = useState(
    selectedProduct ? selectedProduct.weight : 10
  );
  const [activeTab, setActiveTab] = useState('desc');

  if (!selectedProduct) return null;

  const currentPrice =
    selectedWeight === selectedProduct.weight
      ? selectedProduct.price
      : Math.round(
          (selectedProduct.price / selectedProduct.weight) * selectedWeight
        );

  const currentOldPrice = selectedProduct.oldPrice
    ? selectedWeight === selectedProduct.weight
      ? selectedProduct.oldPrice
      : Math.round(
          (selectedProduct.oldPrice / selectedProduct.weight) * selectedWeight
        )
    : null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <button
          onClick={() => setSelectedProduct(null)}
          className={styles.closeButton}
          aria-label="بازگشت"
        >
          <i className="fa-solid fa-arrow-right text-lg" />
        </button>

        <div className={styles.imageContainer}>
          <img
            src={selectedProduct.image}
            alt={selectedProduct.name}
            className={styles.productImage}
          />
          <div className={styles.imageOverlay}>
            <div className={styles.titleWrapper}>
              <span className={styles.badge}>
                برنج ۱۰۰٪ خالص کامفیروزی
              </span>
              <h3 className={styles.title}>
                {selectedProduct.name}
              </h3>
            </div>
          </div>
        </div>

        <div className={styles.contentContainer}>
          <div className={styles.ratingSection}>
            <div className={styles.ratingBadge}>
              <i className="fa-solid fa-star" style={{ color: '#b45309' }} />
              <span>{selectedProduct.rating.toLocaleString('fa-IR')}</span>
              <span className={styles.reviewCount}>
                ({selectedProduct.reviewCount} نظر مشتریان)
              </span>
            </div>
          </div>

          <div className={styles.weightSection}>
            <label className={styles.sectionLabel}>
              انتخاب وزن گونی پارچه‌ای:
            </label>
            <div className={styles.weightButtonsGrid}>
              {selectedProduct.weightOptions.map((w) => (
                <button
                  key={w}
                  onClick={() => setSelectedWeight(w)}
                  className={`${styles.weightButton} ${
                    selectedWeight === w
                      ? styles.weightButtonActive
                      : styles.weightButtonInactive
                  }`}
                >
                  <i className="fa-solid fa-weight-hanging" />
                  <span>{w.toLocaleString('fa-IR')} کیلوگرم</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.tabContainer}>
            <button
              onClick={() => setActiveTab('desc')}
              className={`${styles.tabButton} ${
                activeTab === 'desc' ? styles.tabButtonActive : styles.tabButtonInactive
              }`}
            >
              مشخصات و پخت
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`${styles.tabButton} ${
                activeTab === 'features' ? styles.tabButtonActive : styles.tabButtonInactive
              }`}
            >
              ویژگی‌های گونی
            </button>
          </div>

          {activeTab === 'desc' ? (
            <div className={styles.tabContentDesc}>
              <p>{selectedProduct.description}</p>
              <div className={styles.specsBox}>
                <div className={styles.specRow}>
                  <span className={styles.specLabel}>شالیکار و مزرعه:</span>
                  <span className={styles.specValue}>{selectedProduct.farmer}</span>
                </div>
                <div className={styles.specRow}>
                  <span className={styles.specLabel}>محل برداشت:</span>
                  <span className={styles.specValue}>{selectedProduct.origin}</span>
                </div>
                <div className={styles.specRow}>
                  <span className={styles.specLabel}>میزان قد کشیدن (ری):</span>
                  <span className={styles.specValue}>{selectedProduct.elongation}</span>
                </div>
                <div className={styles.specRow}>
                  <span className={styles.specLabel}>فرمول آب به برنج:</span>
                  <span className={styles.specValue}>{selectedProduct.cookingRatio}</span>
                </div>
              </div>
            </div>
          ) : (
            <ul className={styles.tabContentFeatures}>
              {selectedProduct.features.map((feat, i) => (
                <li key={i} className={styles.featureItem}>
                  <i className="fa-solid fa-circle-check" style={{ color: '#d4af37' }} />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.footerSection}>
          <div className={styles.priceContainer}>
            {currentOldPrice && (
              <span className={styles.oldPrice}>
                {currentOldPrice.toLocaleString('fa-IR')} تومان
              </span>
            )}
            <div className={styles.currentPriceWrapper}>
              <span className={styles.currentPrice}>
                {currentPrice.toLocaleString('fa-IR')}
              </span>
              <span className={styles.currency}>تومان</span>
            </div>
          </div>
          
          <button
            onClick={() => {
              addToCart(selectedProduct, selectedWeight);
              setSelectedProduct(null);
            }}
            className={styles.addToCartBtn}
          >
            <i className="fa-solid fa-cart-plus text-sm" />
            <span>خرید کیسه سفید</span>
          </button>
        </div>
      </div>
    </div>
  );
};
