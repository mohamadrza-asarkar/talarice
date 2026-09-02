import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context';
import { Home, LayoutGrid, ShoppingBag, User } from 'lucide-react';
import styles from './style.module.css';

export function BottomNav() {
  const { cartCount, setIsCartOpen, isAuthenticated } = useApp();

  function getLinkClass({ isActive }) {
    return `${styles.navButton} ${isActive ? styles.navButtonSelected : styles.navButtonUnselected}`;
  }

  return (
    <nav className={styles.bottomNav} aria-label="ناوبری اصلی">
      <NavLink to="/" end className={getLinkClass}>
        <Home size={20} />
        <span>خانه</span>
      </NavLink>

      <NavLink to="/catalog" className={getLinkClass}>
        <LayoutGrid size={20} />
        <span>محصولات</span>
      </NavLink>

      <button
        type="button"
        onClick={function () { setIsCartOpen(true); }}
        className={`${styles.navButton} ${styles.navButtonUnselected} ${styles.cartButton}`}
        aria-label="سبد خرید"
      >
        <ShoppingBag size={20} />
        {cartCount > 0 && <span className={styles.badge}>{cartCount.toLocaleString('fa-IR')}</span>}
        <span>سبد خرید</span>
      </button>

      <NavLink to={isAuthenticated ? '/profile' : '/auth'} className={getLinkClass}>
        <User size={20} />
        <span>{isAuthenticated ? 'پروفایل' : 'ورود'}</span>
      </NavLink>
    </nav>
  );
}

export default BottomNav;
