import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context';
import styles from './style.module.css';

export const BottomNav = () => {
  const { cartCount, setIsCartOpen, isAuthenticated } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'home', label: 'خانه', icon: 'fa-solid fa-house', path: '/' },
    { id: 'catalog', label: 'محصولات', icon: 'fa-solid fa-table-cells-large', path: '/catalog' },
    { id: 'cart', label: 'سبد خرید', icon: 'fa-solid fa-cart-shopping', isCart: true, badge: cartCount },
    { id: 'blog', label: 'بلاگ و آموزش', icon: 'fa-solid fa-book-open', path: '/blog' },
    { id: 'profile', label: 'پروفایل', icon: 'fa-solid fa-user', path: isAuthenticated ? '/profile' : '/auth' }
  ];

  const currentTab = location.pathname === '/' ? 'home' : location.pathname.replace('/', '');

  return (
    <nav className={styles.bottomNav}>
      <div className={styles.navContainer}>
        {navItems.map((item) => {
          const isActive = !item.isCart && (currentTab === item.id || (item.id === 'profile' && currentTab === 'auth'));
          return (
            <button
              key={item.id}
              onClick={() => item.isCart ? setIsCartOpen(true) : navigate(item.path)}
              className={`${styles.navButton} ${isActive ? styles.navButtonSelected : styles.navButtonUnselected}`}
            >
              <span className={styles.iconContainer}>
                <i className={item.icon} />
                {item.badge > 0 && <span className={styles.badge}>{item.badge.toLocaleString('fa-IR')}</span>}
              </span>
              <span className={styles.label}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
