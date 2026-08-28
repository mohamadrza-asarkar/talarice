import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context';
import styles from './style.module.css';

export function BottomNav() {
  const { cartCount, setIsCartOpen, isAuthenticated } = useApp();

  function getLinkClass({ isActive }) {
    return `${styles.navButton} ${isActive ? styles.navButtonSelected : styles.navButtonUnselected}`;
  }

  return (
    <nav className={styles.bottomNav}>
      <NavLink to="/" end className={getLinkClass}>
        <i className="fa-solid fa-house" />
        <span>خانه</span>
      </NavLink>

      <NavLink to="/catalog" className={getLinkClass}>
        <i className="fa-solid fa-table-cells-large" />
        <span>محصولات</span>
      </NavLink>

      <button
        type="button"
        onClick={function () { setIsCartOpen(true); }}
        className={`${styles.navButton} ${styles.navButtonUnselected} ${styles.cartButton}`}
      >
        <i className="fa-solid fa-cart-shopping" />
        {cartCount > 0 && <span className={styles.badge}>{cartCount.toLocaleString('fa-IR')}</span>}
        <span>سبد خرید</span>
      </button>

      <NavLink to="/blog" className={getLinkClass}>
        <i className="fa-solid fa-book-open" />
        <span>دانشنامه</span>
      </NavLink>

      <NavLink to={isAuthenticated ? '/profile' : '/auth'} className={getLinkClass}>
        <i className="fa-solid fa-user" />
        <span>پروفایل</span>
      </NavLink>
    </nav>
  );
}

