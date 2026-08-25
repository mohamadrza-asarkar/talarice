import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context';
import styles from './style.module.css';

export const ProductCard = ({ product }) => {
  const { addToCart } = useApp();
  const navigate = useNavigate();
  
  if (!product) return null;

  const defaultWeight = product.weight || 10;
  // Initialize with the default product weight
  const [selectedWeight, setSelectedWeight] = useState(defaultWeight);
  
  // Safely get weight options or default to [product.weight]
  const weightOptions = product.weightOptions && product.weightOptions.length > 0 
    ? product.weightOptions 
    : [defaultWeight];

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

  const basePrice = product.price || 0;
  const currentPrice = Math.round(basePrice * (selectedWeight / defaultWeight));
  const currentOldPrice = product.oldPrice ? Math.round(product.oldPrice * (selectedWeight / defaultWeight)) : null;

  return (
    <div className={styles.card}>
      <div className={styles.contentWrapper} onClick={handleCardClick}>
        <div className={styles.imageContainer}>
          <img
            src={product.image || '/src/assets/images/white_rice_sack_1_1786553727373.jpg'}
            alt={product.name || 'برنج'}
            className={styles.image}
          />
          {product.discountPercent != null && product.discountPercent > 0 && (
            <span className={styles.discountBadge}>
              {(product.discountPercent || 0).toLocaleString('fa-IR')}٪ تخفیف
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
          {currentOldPrice != null && (
            <div className={styles.oldPrice}>
              {(currentOldPrice || 0).toLocaleString('fa-IR')}
            </div>
          )}
          <div className={styles.currentPrice}>
            <span>{(currentPrice || 0).toLocaleString('fa-IR')}</span>
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

