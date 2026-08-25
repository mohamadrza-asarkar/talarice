import React from 'react';
import { useApp } from '../../context';
import styles from './style.module.css';

export const Categories = () => {
  const { categories, selectedCategory, setSelectedCategory, setActiveTab } = useApp();

  const handleSelect = (id) => {
    setSelectedCategory(id);
    setActiveTab('catalog');
  };

  return (
    <section className={styles.section}>
      <div className={styles.headerRow}>
        <h3 className={styles.title}>
          <i className="fa-solid fa-wheat-awn" style={{ color: '#d4af37' }} />
          <span>محصولات طلا رایس</span>
        </h3>
        <span className={styles.subtitle}>
          ۱۰۰٪ خالص کامفیروزی
        </span>
      </div>

      <div className={styles.categoryGrid}>
        {categories
          .filter((c) => c.id !== 'all')
          .map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleSelect(cat.id)}
                className={`${styles.categoryButton} ${
                  isSelected ? styles.categoryButtonSelected : styles.categoryButtonUnselected
                }`}
              >
                <div className={styles.iconWrapper}>
                  <i className={cat.iconClass} style={{ fontSize: '1.25rem' }} />
                </div>
                <span className={styles.categoryName}>
                  {cat.name}
                </span>
              </button>
            );
          })}
      </div>
    </section>
  );
};
