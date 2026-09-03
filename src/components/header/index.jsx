import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context';
import { Logo } from '../logo';
import { SearchBar } from '../searchBar';
import { User, LogIn } from 'lucide-react';
import styles from './style.module.css';

export function Header() {
  const { isAuthenticated, currentUser, isAdmin } = useApp();

  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        <div className={styles.rightActions}>
          <Link
            to={isAuthenticated ? '/profile' : '/auth'}
            className={styles.userBtn}
            title={isAuthenticated ? (currentUser?.name || 'پروفایل کاربری') : 'ورود به حساب کاربری'}
            aria-label={isAuthenticated ? 'پروفایل کاربری' : 'ورود'}
          >
            {isAuthenticated ? <User size={15} /> : <LogIn size={15} />}
            <span className={styles.userBtnText}>
              {isAuthenticated ? (currentUser?.name?.split(' ')[0] || 'حساب من') : 'ورود'}
            </span>
          </Link>
          
          {isAdmin && (
            <Link to="/admin" className={`${styles.userBtn} ${styles.adminBtnLink}`} title="پنل مدیریت">
              <i className="fa-solid fa-crown" />
              <span className={styles.userBtnText}>پنل مدیریت</span>
            </Link>
          )}
        </div>

        {/* لوگو طلا رایس در وسط */}
        <Link to="/" className={styles.logoLink} aria-label="صفحه اصلی">
          <Logo />
        </Link>
      </div>
      <SearchBar />
    </header>
  );
}

export default Header;
