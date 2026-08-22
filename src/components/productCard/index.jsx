import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context';
import styles from './style.module.css';

export const ProductCard = ({ product }) => {
  const { addToCart } = useApp();
  const navigate = useNavigate();
  
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

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const currentPrice = product.price * (selectedWeight / product.weight);
  const currentOldPrice = product.oldPrice ? product.oldPrice * (selectedWeight / product.weight) : null;

  return (
    <div className={styles.card}>
      <div className={styles.contentWrapper} onClick={handleCardClick}>
        <div className={styles.imageContainer}>
          <img
            src={product.image}
            alt={product.name}
            className={styles.image}
          />
          {product.discountPercent && (
            <span className={styles.discountBadge}>
              {product.discountPercent.toLocaleString('fa-IR')}٪ تخفیف
            </span>
          )}
        </div>

        <h4 className={styles.title}>
          {product.name}
        </h4>
        
        {product.description && (
          <p className={styles.description}>
            {product.description}
          </p>
        )}
      </div>

      <div className={styles.bottomSection} onClick={(e) => e.stopPropagation()}>
        {/* Weight Selector */}
        <div className={styles.weightContainer}>
          {weightOptions.map((w) => (
            <button
              key={w}
              onClick={(e) => handleWeightSelect(e, w)}
              className={`${styles.weightButton} ${
                selectedWeight === w ? styles.weightButtonSelected : styles.weightButtonUnselected
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
          <div className={styles.currentPrice}>
            <span>{currentPrice.toLocaleString('fa-IR')}</span>
            <span className={styles.currency}>تومان</span>
          </div>
        </div>

        <button
          onClick={handleQuickAdd}
          className={styles.addButton}
        >
          <i className="fa-solid fa-cart-plus" />
          <span>افزودن به سبد</span>
        </button>
      </div>
    </div>
  );
};
