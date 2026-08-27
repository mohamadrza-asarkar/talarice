import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context';
import styles from './style.module.css';

export const Categories = () => {
  const { categories, selectedCategory, setSelectedCategory } = useApp();

  return (
    <section className={styles.section}>
      <header className={styles.headerRow}>
        <h3 className={styles.title}>
          <i className="fa-solid fa-wheat-awn" />
          <span>محصولات طلا رایس</span>
        </h3>
        <span className={styles.subtitle}>۱۰۰٪ خالص کامفیروزی</span>
      </header>

      <div className={styles.categoryGrid}>
        {categories
          .filter((c) => c.id !== 'all')
          .map((cat) => (
            <Link
              key={cat.id}
              to="/catalog"
              onClick={() => setSelectedCategory(cat.id)}
              className={`${styles.categoryButton} ${selectedCategory === cat.id ? styles.categoryButtonSelected : styles.categoryButtonUnselected}`}
            >
              <i className={cat.iconClass} />
              <span>{cat.name}</span>
            </Link>
          ))}
      </div>
    </section>
  );
};


