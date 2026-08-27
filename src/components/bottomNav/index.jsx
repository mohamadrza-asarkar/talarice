import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context';
import styles from './style.module.css';

export const BottomNav = () => {
  const { cartCount, setIsCartOpen, isAuthenticated } = useApp();

  const getLinkClass = ({ isActive }) => 
    `${styles.navButton} ${isActive ? styles.navButtonSelected : styles.navButtonUnselected}`;

  return (
    <nav className={styles.bottomNav}>
      <div className={styles.navContainer}>
        <NavLink to="/" end className={getLinkClass}>
          <span className={styles.iconContainer}>
            <i className="fa-solid fa-house" />
          </span>
          <span className={styles.label}>خانه</span>
        </NavLink>

        <NavLink to="/catalog" className={getLinkClass}>
          <span className={styles.iconContainer}>
            <i className="fa-solid fa-table-cells-large" />
          </span>
          <span className={styles.label}>محصولات</span>
        </NavLink>

        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className={`${styles.navButton} ${styles.navButtonUnselected}`}
        >
          <span className={styles.iconContainer}>
            <i className="fa-solid fa-cart-shopping" />
            {cartCount > 0 && (
              <span className={styles.badge}>
                {cartCount.toLocaleString('fa-IR')}
              </span>
            )}
          </span>
          <span className={styles.label}>سبد خرید</span>
        </button>

        <NavLink to="/blog" className={getLinkClass}>
          <span className={styles.iconContainer}>
            <i className="fa-solid fa-book-open" />
          </span>
          <span className={styles.label}>بلاگ و آموزش</span>
        </NavLink>

        <NavLink to={isAuthenticated ? '/profile' : '/auth'} className={getLinkClass}>
          <span className={styles.iconContainer}>
            <i className="fa-solid fa-user" />
          </span>
          <span className={styles.label}>پروفایل</span>
        </NavLink>
      </div>
    </nav>
  );
};

