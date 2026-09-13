import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context';
import { Logo } from '../logo';
import { SearchBar } from '../searchBar';
import styles from './style.module.css';

export function Header() {
  const { isAuthenticated, currentUser, isAdmin } = useApp();

  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        {/* برند و لوگوی طلا رایس در سمت راست */}
        <Link to="/" className={styles.logoLink} aria-label="صفحه اصلی طلا رایس">
          <Logo showText={true} variant="dark" />
        </Link>

        {/* دکمه حساب کاربری / ورود و پنل مدیریت در سمت چپ */}
        <div className={styles.userActionWrapper}>
          {isAdmin && (
            <Link to="/admin" className={styles.adminBadgeLink} title="ورود به پنل مدیریت فروشگاه">
              <i className="fa-solid fa-crown" style={{ color: '#fbbf24' }} />
              <span>پنل مدیریت</span>
            </Link>
          )}

          <Link
            to={isAuthenticated ? '/profile' : '/auth'}
            className={styles.userBtn}
            title={isAuthenticated ? `پنل کاربری ${currentUser?.name || ''}` : 'ورود به حساب کاربری'}
            aria-label={isAuthenticated ? 'پنل کاربری' : 'ورود به حساب'}
          >
            {isAuthenticated ? (
              <i className="fa-solid fa-user-circle" />
            ) : (
              <i className="fa-solid fa-arrow-right-to-bracket" />
            )}
            <span className={styles.userBtnText}>
              {isAuthenticated ? (currentUser?.name ? `پنل کاربری (${currentUser.name.split(' ')[0]})` : 'پنل کاربری') : 'ورود به حساب'}
            </span>
          </Link>
        </div>
      </div>
      <SearchBar />
    </header>
  );
}

export default Header;
