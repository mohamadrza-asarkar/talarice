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
      <div className={styles.header}>
        <h3 className={styles.titleContainer}>
          <i className={`fa-solid fa-wheat-awn ${styles.titleIcon}`} />
          <span>دسته‌بندی کیسه‌های طلا رایس</span>
        </h3>
        <span className={styles.badge}>
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
                className={`${styles.categoryItem} ${
                  isSelected ? styles.categoryItemSelected : styles.categoryItemDefault
                }`}
              >
                <div className={styles.iconWrapper}>
                  <i className={`${cat.iconClass} ${styles.icon}`} />
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
