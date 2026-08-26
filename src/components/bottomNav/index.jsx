import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context';
import styles from './style.module.css';

export const BottomNav = () => {
  const { cartCount, setIsCartOpen, isAuthenticated } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path === '/catalog') return 'catalog';
    if (path === '/blog') return 'blog';
    if (path === '/profile' || path === '/auth') return 'profile';
    return '';
  };

  const activeTab = getActiveTab();

  return (
    <nav className={styles.bottomNav}>
      <div className={styles.navContainer}>
        <button
          onClick={() => navigate('/')}
          className={`${styles.navButton} ${
            activeTab === 'home' ? styles.navButtonSelected : styles.navButtonUnselected
          }`}
        >
          <i className="fa-solid fa-house" style={{ fontSize: '0.875rem' }} />
          <span className={`${styles.label} ${activeTab === 'home' ? styles.labelBlack : styles.labelBold}`}>خانه</span>
        </button>

        <button
          onClick={() => navigate('/catalog')}
          className={`${styles.navButton} ${
            activeTab === 'catalog' ? styles.navButtonSelected : styles.navButtonUnselected
          }`}
        >
          <i className="fa-solid fa-table-cells-large" style={{ fontSize: '0.875rem' }} />
          <span className={`${styles.label} ${activeTab === 'catalog' ? styles.labelBlack : styles.labelBold}`}>محصولات</span>
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className={`${styles.navButton} ${styles.navButtonUnselected}`}
        >
          <div className={styles.iconContainer}>
            <i className="fa-solid fa-cart-shopping" style={{ fontSize: '0.875rem' }} />
            {cartCount > 0 && (
              <span className={styles.badge}>
                {(cartCount || 0).toLocaleString('fa-IR')}
              </span>
            )}
          </div>
          <span className={`${styles.label} ${styles.labelBold}`}>سبد خرید</span>
        </button>

        <button
          onClick={() => navigate('/blog')}
          className={`${styles.navButton} ${
            activeTab === 'blog' ? styles.navButtonSelected : styles.navButtonUnselected
          }`}
        >
          <i className="fa-solid fa-book-open" style={{ fontSize: '0.875rem' }} />
          <span className={`${styles.label} ${activeTab === 'blog' ? styles.labelBlack : styles.labelBold}`}>وبلاگ و آموزش</span>
        </button>

        <button
          onClick={() => navigate(isAuthenticated ? '/profile' : '/auth')}
          className={`${styles.navButton} ${
            activeTab === 'profile' ? styles.navButtonSelected : styles.navButtonUnselected
          }`}
        >
          <i className="fa-solid fa-user" style={{ fontSize: '0.875rem' }} />
          <span className={`${styles.label} ${activeTab === 'profile' ? styles.labelBlack : styles.labelBold}`}>پروفایل</span>
        </button>
      </div>
    </nav>
  );
};
