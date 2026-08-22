import React, { useState } from 'react';
import { useApp } from '../../context';
import styles from './style.module.css';

export const ProductCard = ({ product }) => {
  const { addToCart, setSelectedProduct } = useApp();
  
  // Initialize with the default product weight
  const [selectedWeight, setSelectedWeight] = useState(product.weight);
  
  // Safely get weight options or default to [product.weight]
  const weightOptions = product.weightOptions && product.weightOptions.length > 0 
    ? product.weightOptions 
    : [product.weight];

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    addToCart(product, selectedWeight, 1);
  };

  const handleWeightSelect = (e, w) => {
    e.stopPropagation();
    setSelectedWeight(w);
  };

  const currentPrice = product.price * (selectedWeight / product.weight);
  const currentOldPrice = product.oldPrice ? product.oldPrice * (selectedWeight / product.weight) : null;

  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardHeader} onClick={() => setSelectedProduct(product)}>
        <div className={styles.imageWrapper}>
          <img
            src={product.image}
            alt={product.name}
            className={styles.productImage}
          />
          {product.discountPercent && (
            <span className={styles.discountBadge}>
              {product.discountPercent.toLocaleString('fa-IR')}٪ تخفیف
            </span>
          )}
        </div>
        <h4 className={styles.productName}>
          {product.name}
        </h4>
        
        {product.description && (
          <p className={styles.productDescription}>
            {product.description}
          </p>
        )}
      </div>

      <div className={styles.cardFooter} onClick={(e) => e.stopPropagation()}>
        {/* Weight Selector */}
        <div className={styles.weightSelector}>
          {weightOptions.map((w) => (
            <button
              key={w}
              onClick={(e) => handleWeightSelect(e, w)}
              className={`${styles.weightButton} ${
                selectedWeight === w
                  ? styles.weightButtonActive
                  : styles.weightButtonInactive
              }`}
            >
              {w} کیلو
            </button>
          ))}
        </div>

        <div className={styles.priceContainer}>
          {currentOldPrice && (
            <div className={styles.oldPrice}>
              {currentOldPrice.toLocaleString('fa-IR')}
            </div>
          )}
          <div className={styles.currentPriceWrapper}>
            <span>{currentPrice.toLocaleString('fa-IR')}</span>
            <span className={styles.currencyLabel}>تومان</span>
          </div>
        </div>

        <button
          onClick={handleQuickAdd}
          className={styles.addToCartButton}
        >
          <i className={`fa-solid fa-cart-plus ${styles.cartIcon}`} />
          <span>افزودن به سبد</span>
        </button>
      </div>
    </div>
  );
};
