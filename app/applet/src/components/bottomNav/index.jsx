import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context';
import styles from './style.module.css';

export const BottomNav = () => {
  const { cartCount, setIsCartOpen } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path === '/catalog') return 'catalog';
    if (path === '/blog') return 'blog';
    if (path === '/profile') return 'profile';
    return '';
  };

  const activeTab = getActiveTab();

  return (
    <nav className={styles.bottomNavContainer}>
      <div className={styles.navGrid}>
        <button
          onClick={() => navigate('/')}
          className={`${styles.navItem} ${
            activeTab === 'home' ? styles.navItemActive : styles.navItemInactive
          }`}
        >
          <i className="fa-solid fa-house" />
          <span className={styles.navText}>خانه</span>
        </button>
        <button
          onClick={() => navigate('/catalog')}
          className={`${styles.navItem} ${
            activeTab === 'catalog' ? styles.navItemActive : styles.navItemInactive
          }`}
        >
          <i className="fa-solid fa-table-cells-large" />
          <span className={styles.navText}>دسته‌بندی</span>
        </button>
        <button
          onClick={() => setIsCartOpen(true)}
          className={`${styles.navItem} ${styles.navItemInactive}`}
        >
          <div className={styles.cartIconWrapper}>
            <i className="fa-solid fa-cart-shopping" />
            {cartCount > 0 && (
              <span className={styles.cartBadge}>
                {cartCount.toLocaleString('fa-IR')}
              </span>
            )}
          </div>
          <span className={styles.navText}>سبد خرید</span>
        </button>
        <button
          onClick={() => navigate('/blog')}
          className={`${styles.navItem} ${
            activeTab === 'blog' ? styles.navItemActive : styles.navItemInactive
          }`}
        >
          <i className="fa-solid fa-book-open" />
          <span className={styles.navText}>بلاگ و آموزش</span>
        </button>
        <button
          onClick={() => navigate('/profile')}
          className={`${styles.navItem} ${
            activeTab === 'profile' ? styles.navItemActive : styles.navItemInactive
          }`}
        >
          <i className="fa-solid fa-user" />
          <span className={styles.navText}>پروفایل</span>
        </button>
      </div>
    </nav>
  );
};
