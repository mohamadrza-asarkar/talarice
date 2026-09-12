import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context';
import styles from './style.module.css';

export function BottomNav() {
  const { cartCount, setIsCartOpen, isAuthenticated, isAdmin } = useApp();

  function getLinkClass({ isActive }) {
    return `${styles.navButton} ${isActive ? styles.navButtonSelected : styles.navButtonUnselected}`;
  }

  return (
    <nav className={styles.bottomNav} aria-label="ناوبری اصلی">
      <NavLink to="/" end className={getLinkClass}>
        <i className="fa-solid fa-house" style={{ fontSize: '1.1rem' }} />
        <span>خانه</span>
      </NavLink>

      <NavLink to="/products" className={getLinkClass}>
        <i className="fa-solid fa-shapes" style={{ fontSize: '1.1rem' }} />
        <span>محصولات</span>
      </NavLink>

      <NavLink to="/cart" className={getLinkClass}>
        <i className="fa-solid fa-bag-shopping" style={{ fontSize: '1.1rem' }} />
        {cartCount > 0 && <span className={styles.badge}>{cartCount.toLocaleString('fa-IR')}</span>}
        <span>سبد خرید</span>
      </NavLink>

      <NavLink to={isAuthenticated ? '/profile' : '/auth'} className={getLinkClass}>
        <i className="fa-solid fa-user" style={{ fontSize: '1.1rem' }} />
        <span>{isAuthenticated ? 'پروفایل' : 'ورود'}</span>
      </NavLink>
    </nav>
  );
}

export default BottomNav;
