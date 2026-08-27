import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context';
import styles from './style.module.css';

export const Categories = () => {
  const { categories, selectedCategory, setSelectedCategory } = useApp();

  return (
    <section className={styles.section}>
      <div className={styles.headerRow}>
        <h3 className={styles.title}>
          <i className="fa-solid fa-wheat-awn" />
          <span>محصولات طلا رایس</span>
        </h3>
        <span className={styles.subtitle}>۱۰۰٪ خالص کامفیروزی</span>
      </div>

      <div className={styles.categoryGrid}>
        {categories
          .filter((c) => c.id !== 'all')
          .map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <Link
                key={cat.id}
                to="/catalog"
                onClick={() => setSelectedCategory(cat.id)}
                className={`${styles.categoryButton} ${isSelected ? styles.categoryButtonSelected : styles.categoryButtonUnselected}`}
              >
                <div className={styles.iconWrapper}>
                  <i className={cat.iconClass} />
                </div>
                <span className={styles.categoryName}>{cat.name}</span>
              </Link>
            );
          })}
      </div>
    </section>
  );
};

